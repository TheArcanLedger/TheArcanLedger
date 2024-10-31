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

    let typingInterval; // Typing interval reference

    // Create a blinking cursor element
    const cursor = document.createElement("span");
    cursor.classList.add("blinking-cursor");
    cursor.style.display = "inline-block";
    cursor.style.width = "8px";
    cursor.style.height = "8px";
    cursor.style.backgroundColor = "#FFD700"; // Golden color for the cursor
    cursor.style.marginLeft = "2px";
    cursor.style.animation = "blink 1s steps(1) infinite";

    // Append the cursor to the response container immediately
    responseContainer.appendChild(cursor);

    // Function to display typing effect with the blinking cursor
    function typeText(text) {
        responseContainer.innerHTML = ""; // Clear previous text
        responseContainer.appendChild(cursor); // Ensure the cursor is appended

        let index = 0; // Initialize the index for typing
        stopButton.style.display = "block"; // Show the stop button

        // Function to type each character and keep cursor at the end
        function typeCharacter() {
            if (index < text.length) {
                // Create a new span for each character to ensure wrapping
                const span = document.createElement("span");
                span.textContent = text.charAt(index);
                responseContainer.insertBefore(span, cursor); // Insert character before cursor

                index++;
                typingInterval = setTimeout(typeCharacter, 50); // Adjust typing speed here
            } else {
                // Hide the stop button when typing is complete
                stopButton.style.display = "none";
            }
        }

        clearTimeout(typingInterval); // Clear any previous typing effect
        typeCharacter(); // Start typing the characters
    }

    // Function to process user input
    function processUserInput(input) {
        const trimmedInput = input.trim();
        sendMessage(trimmedInput);
    }

    // Function to send the user's message to the backend
    function sendMessage(message) {
        // Clear the input field
        userInput.value = "";

        // Send the user's input to the backend via POST request
        fetch('https://thearcanledger-050a6f44919a.herokuapp.com/', {
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
    seekButton.addEventListener("click", () => {
        processUserInput(userInput.value);
        userInput.value = ""; // Clear the input field
    });

    // Event listener for pressing Enter in the input field
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            processUserInput(userInput.value);
            userInput.value = ""; // Clear the input field
        }
    });

    // Stop button functionality to halt the typing effect
    stopButton.addEventListener("click", () => {
        clearTimeout(typingInterval); // Clear the typing interval
        stopButton.style.display = "none"; // Hide stop button
    });
});
