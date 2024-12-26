const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// OpenAI API Key
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
const db = new sqlite3.Database('./database/faq.db');

app.post('/api/query', async (req, res) => {
    const { site, query } = req.body;

    if (!site || !query) {
        return res.status(400).json({ error: 'Site and query are required.' });
    }

    db.get(
        'SELECT answer FROM faqs WHERE site = ? AND question LIKE ?',
        [site, `%${query}%`],
        async (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (row) {
                return res.json({ answer: row.answer });
            }

            // Call ChatGPT if no FAQ is found
            try {
                const chatResponse = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `You are a helpful assistant for ${site}.`,
                            },
                            { role: 'user', content: query },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        },
                    }
                );

                const answer = chatResponse.data.choices[0].message.content.trim();
                res.json({ answer });
            } catch (apiError) {
                console.error(apiError);
                res.status(500).json({ error: 'Failed to fetch response from ChatGPT API.' });
            }
        }
    );
});

// Serve index.html as the root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});