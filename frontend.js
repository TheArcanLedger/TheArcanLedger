document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("input-form");
    const input = document.getElementById("user-input");
    const output = document.getElementById("output");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const userMessage = input.value.trim();

        if (userMessage) {
            try {
                const response = await fetch("/api/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                const data = await response.json();
                
                if (data.choices && data.choices.length > 0) {
                    output.textContent = data.choices[0].message.content;
                } else {
                    output.textContent = "No response received.";
                }
            } catch (error) {
                output.textContent = "Error: " + error.message;
                console.error("Error fetching data:", error);
            }
            // Clear the input field after submitting
            input.value = '';
        }
    });
});
