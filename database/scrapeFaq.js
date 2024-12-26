const fs = require('fs');
const jsdom = require('jsdom');
const sqlite3 = require('sqlite3').verbose();

const { JSDOM } = jsdom;

// Database setup
const db = new sqlite3.Database('./database/faq.db');

fs.readFile('/Users/emrebey/CSE-474/project/database/edevlet.html', 'utf8', (err, html) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        return;
    }

    try {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Extract FAQs
        const faqData = [];
        const sections = document.querySelectorAll('div.faqgroupbox');

        sections.forEach((section) => {
            const question = section.previousElementSibling?.textContent?.trim();
            const answer = section.textContent?.trim();
            if (question && answer) {
                faqData.push({ question, answer });
            }
        });

        console.log('Extracted FAQ Data:', faqData);

        // Save FAQs to database
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS faqs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    site TEXT,
                    question TEXT,
                    answer TEXT
                )
            `);

            const stmt = db.prepare("INSERT INTO faqs (site, question, answer) VALUES (?, ?, ?)");
            faqData.forEach((faq) => {
                stmt.run("edevlet", faq.question, faq.answer);
            });
            stmt.finalize();
        });

        console.log('FAQs saved to database successfully.');
    } catch (error) {
        console.error('Error processing HTML:', error);
    } finally {
        db.close();
    }
});