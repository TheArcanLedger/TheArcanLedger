document.addEventListener("DOMContentLoaded", () => {
    // Get elements from the HTML
    const responseContainer = document.getElementById("output");
    const userInput = document.getElementById("user-input");
    const seekButton = document.getElementById("seek-button");
    const stopButton = document.getElementById("stop-button");


    // Ensure elements exist
    if (!responseContainer || !userInput || !seekButton || !stopButton) {
        console.error("One or more elements are missing from the HTML.");
        return;
    }

     // Create a blinking cursor element
    const cursor = document.createElement("span");
    cursor.classList.add("blinking-cursor");

    // CSS styles for the cursor
    cursor.style.display = "inline-block";
    cursor.style.width = "8px";
    cursor.style.height = "8px";
    cursor.style.backgroundColor = "#FFD700"; // Golden color for the cursor
    cursor.style.marginLeft = "2px";
    cursor.style.animation = "blink 1s steps(1) infinite";

    // Function to display typing effect with the blinking cursor
    function typeText(text) {
        responseContainer.innerHTML = ""; // Clear previous text
        responseContainer.appendChild(cursor); // Ensure the cursor is appended

        let index = 0; // Initialize the index for typing

        // Function to type each character and keep cursor at the end
        function typeCharacter() {
            if (index < text.length) {
                const span = document.createElement("span");
                span.textContent = text.charAt(index); // Insert character in a new span
                responseContainer.insertBefore(span, cursor); // Append each character before the cursor
                index++;
                setTimeout(typeCharacter, 50); // Adjust typing speed here
            }
        }

        typeCharacter(); // Start typing the characters
    }

    // Function to send the user's message to the backend
    function sendMessage() {
        const message = userInput.value;

        // Check if input is empty to prevent sending an empty message
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

    // Stop button functionality to halt the typing effect
    stopButton.addEventListener("click", () => {
        clearTimeout(typingInterval); // Clear the typing interval
        stopButton.style.display = "none"; // Hide stop button
    });
});
