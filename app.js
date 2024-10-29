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
                model: 'ft:gpt-4o-2024-08-06:arcan-ledger:the-arcan-ledger:ANiMnw4A', // Ensure this is the correct model ID
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 100
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
                    messages: [{ role: 'user', content: userMessage }],
                    max_tokens: 100
                })
            });
    
            const data = await response.json();
            console.log('API Response:', data); // Log the entire response for debugging
    
            if (data.error) {
                console.error('OpenAI API Error:', data.error);
                res.status(500).json({ error: data.error.message });
            } else {
                if (data.choices && data.choices.length > 0) {
                    res.json(data);
                } else {
                    res.status(500).json({ error: "No valid response from the fine-tuned model." });
                }
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            res.status(500).send('Server Error');
        }
    });
    

});
