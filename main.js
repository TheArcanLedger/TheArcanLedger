const responseContainer = document.getElementById("response");

// Typing function to reveal text character-by-character
function typeText(text) {
    responseContainer.textContent = ""; // Clear any previous text
    let index = 0;

    function typeCharacter() {
        if (index < text.length) {
            responseContainer.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, 50); // Adjust typing speed by changing 50ms delay
        }
    }

    typeCharacter();
}

// Send message function to simulate sending the user’s input and receiving a response
function sendMessage() {
    const userInput = document.getElementById("user-input").value;

    // Simulate a response for demonstration purposes
    const responseText = "> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?";
    
    // Start the typing effect with the response text
    typeText(responseText);
}
