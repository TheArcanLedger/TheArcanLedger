const responseContainer = document.getElementById("response");

// Create a blinking cursor element and add it to the response container on page load
const cursor = document.createElement("span");
cursor.style.display = "inline-block";
cursor.style.width = "8px";  // Smaller width for a square shape
cursor.style.height = "8px"; // Adjust height to match width
cursor.style.backgroundColor = "#FFD700"; // Golden blinking cursor
cursor.style.marginLeft = "2px";
cursor.style.verticalAlign = "middle"; // Align cursor with the middle of the text
cursor.style.animation = "blink 1s steps(1) infinite";

// Append the cursor to the response container immediately on page load
responseContainer.appendChild(cursor);

// Function to display typing effect with the blinking cursor
function typeText(text) {
    responseContainer.innerHTML = ""; // Clear previous text
    responseContainer.appendChild(cursor); // Ensure the cursor is appended

    let index = 0;

    // Function to type each character and keep cursor at the end
    function typeCharacter() {
        if (index < text.length) {
            // Insert next character before the cursor
            cursor.insertAdjacentText("beforebegin", text.charAt(index));
            index++;
            setTimeout(typeCharacter, 50); // Adjust typing speed here
        }
    }

    // Start typing with the cursor already visible
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
