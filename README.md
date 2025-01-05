# AI BASED FAQ CHAT SYSTEM
**An AI-powered FAQ system that dynamically answers user queries by fetching information from a database or generating responses via ChatGPT.**

## Table of Contents
- [Project Structure]()
- [Prerequisites]()
- [How to Run the Project]()
  - [Step 1: Ensure Required Files Exist]()
  - [Step 2: Install Dependencies]()
  - [Step 3: Start the Server]()
  - [Step 4: Access the Application]()
- [Features]()
- [Troubleshooting]()
- [Technologies Used]()

## Project Structure
```plaintext
project/
├── backend/
│   ├── app.js               # Main backend server
│   └── cert/                # SSL certificates for HTTPS
│       ├── localhost-key.pem
│       ├── localhost.pem
├── database/
│   ├── faq.db               # SQLite database containing FAQ data
├── frontend/
│   ├── index.html           # Main HTML file for the user interface
│   ├── style.css            # Styling for the application
│   ├── script.js            # Frontend JavaScript for dynamic interaction
├── .env                     # Environment variables (e.g., OpenAI API key)
```

## Prerequisites
- **Node.js**: Ensure Node.js (version 14 or higher) is installed.
- **npm**: Comes with Node.js, but ensure it's up-to-date by running `npm install -g npm`.
- **SQLite**: SQLite must be installed if you need to modify or inspect the database.


## How to Run the Project
### Step 1: Ensure Required Files Exist
1. Verify the following files are in place:
   - `backend/cert/localhost-key.pem` and `backend/cert/localhost.pem` (SSL certificates)
   - `database/faq.db` (SQLite database with FAQ data)
   - `.env` file (for environment variables like OpenAI API key)

2. Example .env file content:
   - `OPENAI_API_KEY=your_openai_api_key_here`

### Step 2: Install Dependencies
1. Open a terminal in the project directory.
**Run the following command to install all required dependencies:**
```bash
npm install
```

### Step 3: Start the Server
**In the terminal, run:**
```javascript
node backend/app.js
```

**You should see the message:**
```bash
https://localhost:3000
```
### Step 4: Access the Application
**Open your browser and navigate to:**
```bash
https://localhost:3000
```

## Features

- **Multiple Website Support**: Users can select a site from the dropdown and receive site-specific answers.
- **Database + ChatGPT Responses**: Responses are either retrieved from the database or dynamically generated using ChatGPT.
- **Source Labeling**: Clearly identifies whether the response came from the database or ChatGPT.
- **Responsive UI**: The interface is optimized for both desktop and mobile devices.

## Troubleshooting
**Missing Database File:**
Ensure faq.db is in the database folder.

**SSL Certificate Issues:**
Ensure localhost-key.pem and localhost.pem exist in the backend/cert folder.**

**API Key Errors:**
Verify the .env file contains a valid OpenAI API key.

## Technologies Used
```plaintext
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express
Database: SQLite
AI Integration: ChatGPT API (via OpenAI)
```

## License
**This project is proprietary and "All Rights Reserved." Unauthorized use, distribution, or modification of this project is strictly prohibited without explicit permission from the author.**
