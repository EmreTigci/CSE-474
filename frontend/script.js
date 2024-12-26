document.getElementById('sendButton').addEventListener('click', async () => {
    const site = document.getElementById('site').value;
    const query = document.getElementById('query').value;
    const chatBody = document.getElementById('chatBody');
  
    if (!site || !query) {
      alert('Please select a site and type a question.');
      return;
    }
  
    // Add user message to the chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = query;
    chatBody.appendChild(userMessage);
  
    // Clear the input field
    document.getElementById('query').value = '';
  
    // Add a loading indicator
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message bot';
    loadingMessage.textContent = 'Thinking...';
    chatBody.appendChild(loadingMessage);
  
    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;
  
    try {
      // Send the query to the backend
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, query }),
      });
  
      const data = await response.json();
  
      // Remove loading message
      chatBody.removeChild(loadingMessage);
  
      // Add bot's response to the chat
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot';
      botMessage.textContent = data.answer || 'No answer found.';
      chatBody.appendChild(botMessage);
  
      // Scroll to the bottom
      chatBody.scrollTop = chatBody.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
      chatBody.removeChild(loadingMessage);
  
      // Add error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'message bot';
      errorMessage.textContent = 'Error fetching response. Please try again.';
      chatBody.appendChild(errorMessage);
    }
  });