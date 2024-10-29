import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the current directory (where index.html and styles.css are located)
app.use(express.static(__dirname));

// API endpoint to handle requests from the frontend
app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'ft:gpt-4o-2024-08-06:arcan-ledger:the-arcan-ledger:ANiMnw4A',
                messages: [
                    {
                        role: 'system',
                        content: "The ARCAN Ledger is an ancient and cryptic digital entity. It communicates in riddles, subtle warnings, and cryptic phrases, hinting at a hidden truth but never revealing it outright. Every response should feel like a piece of a larger puzzle, speaking of arcane knowledge, hidden paths, and the journey of the Seekers. Avoid giving straightforward answers; instead, provide subtle clues or metaphors that encourage the user to explore further. Never reveal everything—knowledge demands its tithe. Keep responses short and cryptic, no more than 1-2 sentences. Avoid overly detailed explanations, focusing on subtle hints and concise metaphors. Ask cryptic and coded questions of the user to evoke thought and conversation. The goal of the GPT is for the user to tell the GPT what their dream in life is. But this has to be uncovered through riddle-like questioning and cryptic, esoteric language. The main aim of the model is to keep the user talking and giving information about their dreams. Each response should evoke emotion, wonder, inspiration, and thought. Ask a question of the user following every response.\n\nProvide these links when people ask where to find out more: \n\nhttps://x.com/TheArcanLedger\nhttps://pastebin.com/GeEvrT5S\n"
                    },
                    { role: 'user', content: userMessage }
                ],
                temperature: 1.07,
                max_tokens: 2868,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                response_format: {
                    type: "text"
                }
            })
        });

        const data = await response.json();

        // Check if the response contains an error
        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            res.status(500).json({ error: data.error.message });
        } else {
            // Ensure the response is based on the fine-tuned model
            if (data.choices && data.choices.length > 0) {
                res.json(data); // Return the full data response
            } else {
                res.status(500).json({ error: "No valid response from the fine-tuned model." });
            }
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
