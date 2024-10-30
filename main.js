const responseContainer = document.getElementById("response");
const userInput = document.getElementById("user-input");
const seekButton = document.getElementById("seek-button");
const stopButton = document.getElementById("stop-button");

let typingInterval; // For typing effect
let isTyping = false;

// Create a blinking cursor element
const cursor = document.createElement("span");
cursor.style.display = "inline-block";
cursor.style.width = "8px";  // Smaller width for a square shape
cursor.style.height = "8px";
cursor.style.backgroundColor = "#FFD700"; // Golden blinking cursor
cursor.style.marginLeft = "2px";
cursor.style.verticalAlign = "middle";
cursor.style.animation = "blink 1s steps(1) infinite";

// Append the cursor to the response container immediately on page load
responseContainer.appendChild(cursor);

// Typing effect function with stop functionality
function typeText(text) {
    responseContainer.innerHTML = ""; // Clear previous text
    responseContainer.appendChild(cursor); // Ensure the cursor is appended
    let index = 0;
    isTyping = true;
    stopButton.style.display = "inline-block"; // Show stop button

    function typeCharacter() {
        if (index < text.length) {
            // Insert next character before the cursor
            cursor.insertAdjacentText("beforebegin", text.charAt(index));
            index++;
            typingInterval = setTimeout(typeCharacter, 50); // Adjust typing speed here
        } else {
            isTyping = false;
            stopButton.style.display = "none"; // Hide stop button when typing is complete
        }
    }

    typeCharacter();
}

// Stop typing when stop button is clicked
stopButton.addEventListener("click", () => {
    clearTimeout(typingInterval);
    isTyping = false;
    stopButton.style.display = "none"; // Hide stop button
});

// Function to send the user's message to the backend
function sendMessage() {
    if (isTyping) return; // Prevent sending a new message while typing

    const message = userInput.value;

    // Send the user's input to the backend via POST request
    fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
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

// Event listener for the "Seek Knowledge" button
seekButton.addEventListener("click", () => {
    sendMessage();
});

// Allow pressing Enter to trigger sendMessage function
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission if any
        sendMessage();
    }
});