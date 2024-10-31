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
    let isRequestInProgress = false; // Prevent double-clicks
    let debounceTimeout; // Debounce timeout reference

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
                const span = document.createElement("span");
                span.textContent = text.charAt(index);
                responseContainer.insertBefore(span, cursor); // Insert character before cursor

                index++;
                typingInterval = setTimeout(typeCharacter, 50); // Adjust typing speed here
            } else {
                stopButton.style.display = "none"; // Hide the stop button when typing is complete
            }
        }

        clearTimeout(typingInterval); // Clear any previous typing effect
        typeCharacter(); // Start typing the characters
    }

    // Function to display a special response when a valid numeric code is detected
    function displaySpecialResponse() {
        const specialMessage = "> CONGRATULATIONS SEEKER! You've unlocked a hidden ARCΛN key.\n\n" +
            "▂▃▄▅▆▇█▓▒░ 🗝️ ░▒▓█▇▆▅▄▃▂\n\n" +
            "To claim your reward, take a screenshot of this key and tweet it to the main ARCAN Ledger X page along with your Solana wallet address.\n" +
            "Your journey into the Arcan has earned you a place among the chosen few.";

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

    // Debounced function to process the "Seek Knowledge" button click
    function debouncedProcessInput() {
        if (isRequestInProgress) return; // Prevent double-clicks

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            processUserInput(userInput.value);
            userInput.value = ""; // Clear the input field
        }, 300); // Adjust debounce time as necessary
    }

    // Function to send the user's message to the backend
    function sendMessage(message) {
        if (isRequestInProgress) return;
        isRequestInProgress = true;

        // Send the user's input to the backend via POST request
        fetch('https://thearcanledger-050a6f44919a.herokuapp.com/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            const responseText = data.choices[0].message.content;
            typeText(responseText);
        })
        .catch(error => {
            console.error('Error:', error);
            typeText("There was an error retrieving the response. Please try again.");
        })
        .finally(() => {
            isRequestInProgress = false; // Reset flag after request is complete
        });
    }

    // Event listener for the "Seek Knowledge" button with debounce
    seekButton.addEventListener("click", debouncedProcessInput);

    // Event listener for pressing Enter in the input field
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            debouncedProcessInput();
        }
    });

    // Stop button functionality to halt the typing effect
    stopButton.addEventListener("click", () => {
        clearTimeout(typingInterval); // Clear the typing interval
        stopButton.style.display = "none"; // Hide stop button
    });
});
