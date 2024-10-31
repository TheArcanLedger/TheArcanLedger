document.addEventListener("DOMContentLoaded", () => {
    // Get elements from the HTML
    const responseContainer = document.getElementById("output");
    const userInput = document.getElementById("user-input");
    const seekButton = document.getElementById("seek-button");

    // Ensure elements exist
    if (!responseContainer || !userInput || !seekButton) {
        console.error("One or more elements are missing from the HTML.");
        return;
    }

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

        // Function to type each character and keep cursor at the end
        function typeCharacter() {
            if (index < text.length) {
                // Create a new span for each character to ensure wrapping
                const span = document.createElement("span");
                span.textContent = text.charAt(index);
                responseContainer.insertBefore(span, cursor); // Insert character before cursor

                index++;
                setTimeout(typeCharacter, 50); // Adjust typing speed here
            }
        }

        typeCharacter(); // Start typing the characters
    }

    // Function to display a special response when a valid numeric code is detected
    function displaySpecialResponse() {
        const specialMessage = "> CONGRATULATIONS SEEKER! You've unlocked a hidden ARCΛN key.\n\n" +

            "▂▃▄▅▆▇█▓▒░ 🗝️ ░▒▓█▇▆▅▄▃▂\n\n" +

            "To claim your reward, take a screenshot of this key and tweet it to the main ARCAN Ledger X page along with your Solana wallet address.\n" +
            "Your journey into the Arcan has earned you a place among the chosen few.";

        // Clear any previous text and display the special message
        responseContainer.innerHTML = specialMessage;
    }

    // Function to check if the input code is valid
    function checkNumericCode(code) {
        fetch('https://thearcanledger-050a6f44919a.herokuapp.com/api/validateCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.special) {
                    displaySpecialResponse(); // Trigger the special response
                } else {
                    typeText(data.message || "Invalid or already used code.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                typeText("An error occurred. Please try again.");
            });
    }

    // Consolidated function to send the user's message to the backend
    function sendMessage(message) {
        // Clear the input field
        userInput.value = "";

        // Send the user's input to the backend via POST request
        fetch('https://thearcanledger-050a6f44919a.herokuapp.com/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check if response data has the expected structure
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
                const responseText = data.choices[0].message.content;
                typeText(responseText);
            } else {
                throw new Error("Unexpected response structure");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            typeText("There was an error retrieving the response. Please try again.");
        });
    }

    // Function to process user input
    function processUserInput(input) {
        const trimmedInput = input.trim();

        // Check if input is a numeric code
        if (/^\d+$/.test(trimmedInput)) {
            checkNumericCode(trimmedInput); // Use backend validation for numeric codes
            return; // Stop further processing if it's a numeric code
        }

        // Otherwise, proceed with normal message handling
        sendMessage(trimmedInput);
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
});
