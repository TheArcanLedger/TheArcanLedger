// Ensure the code runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("input-form"); // Form ID in index.html
    const input = document.getElementById("user-input"); // Input field ID in index.html
    const output = document.getElementById("output");    // Output element ID in index.html

    // Listen for the form submission event
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const userMessage = input.value.trim(); // Get user input and trim whitespace

        // Only proceed if there's input
        if (userMessage) {
            try {
                // Send POST request to the backend API
                const response = await fetch("/api/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                // Parse the response
                const data = await response.json();

                // Check if the response contains choices and display the message
                if (data.choices && data.choices.length > 0) {
                    output.textContent = data.choices[0].message.content;
                } else {
                    output.textContent = "No response received from the server.";
                }
            } catch (error) {
                // Display error message if something goes wrong
                output.textContent = "Error: " + error.message;
                console.error("Error fetching data:", error);
            }
        }
    });
});
