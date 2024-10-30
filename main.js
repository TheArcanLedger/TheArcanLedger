const responseContainer = document.getElementById("response");

function typeText(text) {
    responseContainer.textContent = ""; // Clear previous text
    let index = 0;

    function typeCharacter() {
        if (index < text.length) {
            responseContainer.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, 50); // Adjust typing speed here
        }
    }

    typeCharacter();
}

// Function to send the user's message to the backend
function sendMessage() {
    const userInput = document.getElementById("user-input").value;

    // Send the user's input to the backend via POST request
    fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        // Get the response text from OpenAI and start typing it
        const responseText = data.choices[0].message.content;
        typeText(responseText);
    })
    .catch(error => {
        console.error('Error:', error);
        typeText("There was an error retrieving the response. Please try again.");
    });
}
