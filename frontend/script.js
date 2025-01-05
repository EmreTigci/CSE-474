document.addEventListener('DOMContentLoaded', () => {
    // Select essential DOM elements
    const sendButton = document.getElementById('sendButton');
    const queryInput = document.getElementById('query');
    const siteSelect = document.getElementById('site');
    const chatBody = document.getElementById('chatBody');

    /**
     * Function to add messages to the chat interface.
     * @param {string} content - The message content to display.
     * @param {string} sender - Indicates the sender, 'user' or 'bot'.
     * @param {string|null} source - Optional, specifies the source, e.g., 'database' or 'chatgpt'.
     */
    const addMessage = (content, sender, source = null) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender); // Add 'message' and 'user'/'bot' classes

        if (sender === 'bot' && source) {
            messageDiv.classList.add(source); // Add source-specific class for styling
        }

        // Replace line breaks with <br> for proper HTML rendering
        const formattedContent = content.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedContent;

        // Append the new message to the chat body
        chatBody.appendChild(messageDiv);

        // Scroll to the bottom of the chat body
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    /**
     * Function to handle sending messages.
     */
    const sendMessage = async () => {
        // Get user input and selected site
        const query = queryInput.value.trim();
        const site = siteSelect.value;

        // Validate the input
        if (!site) {
            alert('Please select a site.');
            return;
        }

        if (!query) {
            alert('Please enter a question.');
            return;
        }

        // Add the user's message to the chat
        addMessage(query, 'user');

        // Clear the input field
        queryInput.value = '';

        // Send the query to the backend API
        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ site, query }), // Send site and query data
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Add the bot's response to the chat
            if (data.answer) {
                const source = data.source || 'chatgpt'; // Default to ChatGPT if no source is specified
                addMessage(data.answer, 'bot', source);
            } else {
                addMessage('Sorry, I could not find an answer.', 'bot');
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            addMessage('An error occurred while processing your request.', 'bot');
        }
    };

    // Attach event listener to the "Send" button
    sendButton.addEventListener('click', sendMessage);

    // Attach event listener to the input field for the Enter key
    queryInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior (form submission)
            sendMessage(); // Trigger sendMessage function
        }
    });
});