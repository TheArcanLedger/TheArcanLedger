const responseContainer = document.getElementById("response");

// Function to display typing effect with a blinking cursor
function typeText(text) {
    responseContainer.textContent = ""; // Clear previous text
    let index = 0;

    // Create a blinking cursor element
    const cursor = document.createElement("span");
    cursor.style.display = "inline-block";
    cursor.style.width = "10px";
    cursor.style.height = "20px";
    cursor.style.backgroundColor = "#FFD700"; // Golden blinking cursor
    cursor.style.marginLeft = "2px";
    cursor.style.animation = "blink 1s steps(1) infinite";
    responseContainer.appendChild(cursor);

    // Function to type each character and move the cursor
    function typeCharacter() {
        if (index < text.length) {
            // Insert next character before the cursor
            cursor.insertAdjacentHTML("beforebegin", text.charAt(index));
            index++;
            setTimeout(typeCharacter, 50); // Adjust typing speed here
        } else {
            // Cursor stays after the last character
            responseContainer.appendChild(cursor);
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
