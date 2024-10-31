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
    cursor.style.display = "inline-block";
    cursor.style.width = "8px";
    cursor.style.height = "8px";
    cursor.style.backgroundColor = "#FFD700"; // Golden color for the cursor
    cursor.style.marginLeft = "2px";
    cursor.style.animation = "blink 1s steps(1) infinite";

    // Append the cursor to the response container immediately
    responseContainer.appendChild(cursor);

    // Array of hidden numeric codes
    const numericCodes = [
        "553274", "238491", "920183", "175930", "849301", 
        "982374", "651098", "481927", "372019", "715320", 
        "830126", "649032", "910284", "582017", "781243", 
        "239048", "516872", "498201", "601293", "394081"
    ];

    // Function to display a special response when a numeric code is detected
    function checkForNumericCode(userInput) {
        if (numericCodes.includes(userInput.trim())) {
            displaySpecialResponse(userInput.trim());
            numericCodes.splice(numericCodes.indexOf(userInput.trim()), 1); // Remove code after use
            return true; // Stop further processing if it's a numeric code
        }
        return false; // Continue with normal processing otherwise
    }

    function displaySpecialResponse(code) {
        const specialMessage = `> CONGRATULATIONS SEEKER! You've unlocked a hidden ARCΛN key: ${code}.\n\n` +
                               "▂▃▄▅▆▇█▓▒░ 🗝️ ░▒▓█▇▆▅▄▃▂\n\n" +
                               "To claim your reward, take a screenshot of this key and tweet it to the main ARCAN Ledger X page along with your Solana wallet address.\n" +
                               "Your journey into the Arcan has earned you a place among the chosen few.";

        // Clear any previous text and display the special message
        responseContainer.innerHTML = specialMessage;
    }

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
            } else {
                stopButton.style.display = "none"; // Hide stop button when typing is complete
            }
        }

        typeCharacter(); // Start typing the characters
    }

    // Function to handle user input, checking for numeric codes
    function processUserInput(userInputText) {
        if (checkForNumericCode(userInputText)) return; // Stop if numeric code is detected

        // Proceed with normal message handling
        sendMessage(userInputText);
    }

    // Function to send the user's message to the backend
    function sendMessage(message) {
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
    seekButton.addEventListener("click", () => {
        processUserInput(userInput.value); // Call the processing function
        userInput.value = ""; // Clear the input field
    });

    // Event listener for pressing Enter in the input field
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default Enter behavior
            processUserInput(userInput.value); // Call the processing function
            userInput.value = ""; // Clear the input field
        }
    });

    // Stop button functionality to halt the typing effect
    stopButton.addEventListener("click", () => {
        clearTimeout(typingInterval); // Clear the typing interval
        stopButton.style.display = "none"; // Hide stop button
    });
});
