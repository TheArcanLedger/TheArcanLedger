// Get elements from the HTML
const responseContainer = document.getElementById("response");
const userInput = document.getElementById("user-input");
const seekButton = document.getElementById("seek-button"); 

// Create a blinking cursor element
const cursor = document.createElement("span");
cursor.style.display = "inline-block";
cursor.style.width = "8px";
cursor.style.height = "8px";
cursor.style.backgroundColor = "#FFD700"; // Golden color for the cursor
cursor.style.marginLeft = "2px";
cursor.style.verticalAlign = "middle"; 
cursor.style.animation = "blink 1s steps(1) infinite";

// Append the cursor to the response container immediately
responseContainer.appendChild(cursor);

// Function to display typing effect with the blinking cursor
function typeText(text) {
    responseContainer.innerHTML = ""; // Clear previous text
    responseContainer.appendChild(cursor); // Ensure the cursor is appended

    let index = 0;

    // Function to type each character and keep cursor at the end
    function typeCharacter() {
        if (index < text.length) {
            cursor.insertAdjacentText("beforebegin", text.charAt(index));
            index++;
            setTimeout(typeCharacter, 50); // Adjust typing speed here
        }
    }

    typeCharacter();
}

// Function to send the user's message to the backend
function sendMessage() {
    const message = userInput.value;

    // Check if input is empty, prevent sending an empty message
    if (!message.trim()) return;

    // Clear the input field
    userInput.value = "";

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
        // Get the response text and start typing it
        const responseText = data.choices[0].message.content;
        typeText(responseText);
    })
    .catch(error => {
        console.error('Error:', error);
        typeText("There was an error retrieving the response. Please try again.");
    });
}

// Event listener for the "Seek Knowledge" button
seekButton.addEventListener("click", sendMessage);

// Event listener for pressing Enter in the input field
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter behavior
        sendMessage();
    }
});
