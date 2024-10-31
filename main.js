document.addEventListener("DOMContentLoaded", () => {
    const responseContainer = document.getElementById("output");
    const userInput = document.getElementById("user-input");
    const seekButton = document.getElementById("seek-button");
    const stopButton = document.getElementById("stop-button");

    if (!responseContainer || !userInput || !seekButton || !stopButton) {
        console.error("One or more elements are missing from the HTML.");
        return;
    }

    const cursor = document.createElement("span");
    cursor.classList.add("blinking-cursor");
    cursor.style.display = "inline-block";
    cursor.style.width = "8px";
    cursor.style.height = "8px";
    cursor.style.backgroundColor = "#FFD700";
    cursor.style.marginLeft = "2px";
    cursor.style.animation = "blink 1s steps(1) infinite";

    responseContainer.appendChild(cursor);

    function typeText(text) {
        responseContainer.innerHTML = "";
        responseContainer.appendChild(cursor);

        let index = 0;

        function typeCharacter() {
            if (index < text.length) {
                const span = document.createElement("span");
                span.textContent = text.charAt(index);
                responseContainer.insertBefore(span, cursor);

                index++;
                setTimeout(typeCharacter, 50);
            } else {
                stopButton.style.display = "none";
            }
        }

        typeCharacter();
    }

    function displaySpecialResponse() {
        const specialMessage = "> CONGRATULATIONS SEEKER! You've unlocked a hidden ARCΛN key.\n\n" +
                               "▂▃▄▅▆▇█▓▒░ 🗝️ ░▒▓█▇▆▅▄▃▂\n\n" +
                               "To claim your reward, take a screenshot of this key and tweet it to the main ARCAN Ledger X page along with your Solana wallet address.\n" +
                               "Your journey into the Arcan has earned you a place among the chosen few.";
        responseContainer.innerHTML = specialMessage;
    }

    function checkNumericCode(code) {
        fetch('https://sinister-haunting-694p64vxwgx7h4rg7.github.dev/api/validateCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.special) {
                displaySpecialResponse();
            } else {
                typeText(data.message || "Invalid or already used code.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            typeText("An error occurred. Please try again.");
        });
    }

    function sendMessage(message) {
        userInput.value = "";

        fetch('https://sinister-haunting-694p64vxwgx7h4rg7.github.dev/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data); // Log response for debugging
            if (data.choices && data.choices[0].message) {
                const responseText = data.choices[0].message.content;
                typeText(responseText);
            } else {
                typeText("No response received from the server.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            typeText("There was an error retrieving the response. Please try again.");
        });
    }

    seekButton.addEventListener("click", () => {
        processUserInput(userInput.value);
        userInput.value = "";
    });

    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            processUserInput(userInput.value);
            userInput.value = "";
        }
    });
});
