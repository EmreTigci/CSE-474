const fs = require('fs');
const https = require('https');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Resolve paths dynamically for portability
const projectRoot = path.resolve(__dirname, '..');
const certPath = path.join(projectRoot, 'backend', 'cert');
const dbPath = path.join(projectRoot, 'database', 'faq.db');

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    process.exit(1); // Exit the application if the database is missing
}

// Load SSL certificates dynamically
const sslOptions = {
    key: fs.readFileSync(path.join(certPath, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(certPath, 'localhost.pem')),
};

// Load environment variables
require('dotenv').config({ path: path.join(projectRoot, '.env') });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Ensure the OpenAI API key is available
if (!OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in .env file.');
    process.exit(1); // Exit the application if API key is missing
}

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static(path.join(projectRoot, 'frontend'))); // Serve static files from the frontend directory

// Database connection
const db = new sqlite3.Database(dbPath);

// API endpoint to handle user queries
app.post('/api/query', async (req, res) => {
    const { site, query } = req.body;

    // Validate incoming request
    if (!site || !query) {
        return res.status(400).json({ error: 'Site and query are required.' });
    }

    // Check the database for matching FAQs
    db.get(
        'SELECT answer FROM faqs WHERE site = ? AND question LIKE ?',
        [site, `%${query}%`],
        async (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message }); // Internal server error
            }

            // If a matching FAQ is found, return the answer
            if (row) {
                const answer = `Database Response:\n${row.answer}`;
                return res.json({ answer, source: 'database' });
            }

            // If no match is found, forward the query to ChatGPT API
            try {
                const chatResponse = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `You are a helpful assistant for the ${site} website.`,
                            },
                            { role: 'user', content: query },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${OPENAI_API_KEY}`,
                        },
                    }
                );

                const chatAnswer = chatResponse.data.choices[0].message.content.trim();
                const answer = `ChatGPT Response:\n${chatAnswer}`;
                res.json({ answer, source: 'chatgpt' });
            } catch (apiError) {
                console.error('ChatGPT API error:', apiError.message);
                res.status(500).json({ error: 'Failed to fetch a response from ChatGPT API.' });
            }
        }
    );
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'index.html')); // Serve the main HTML file
});

// Start the HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS server is running at https://localhost:${PORT}`);
});