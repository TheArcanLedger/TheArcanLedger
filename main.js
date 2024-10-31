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
        fetch('https://thearcanledger-050a6f44919a.herokuapp.com/', {
            metho
