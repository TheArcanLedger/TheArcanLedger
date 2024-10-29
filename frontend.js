// Make a POST request to the server's /api/ask endpoint
async function askQuestion(question) {
    try {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: question })
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        displayResponse(data.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
        displayResponse('There was an error processing your request.');
    }
}

// Function to display the response in the frontend
function displayResponse(response) {
    const outputElement = document.getElementById('output');
    outputElement.textContent = response;
}

// Event listener for form submission
document.getElementById('askForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const questionInput = document.getElementById('question');
    const question = questionInput.value.trim();
    if (question) {
        askQuestion(question);
        questionInput.value = '';
    }
});
