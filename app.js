import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenv.config({ path: '.env' });

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (this should be before defining routes)
app.use(express.static(path.join(__dirname)));

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
                model: 'ft:gpt-4o-2024-08-06:arcan-ledger:the-arcan-ledger:ANiMnw4A', // Use fine-tuned model ID
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 100
            })
        });

        const data = await response.json();
        
        // Check if there's an error in the API response
        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            res.status(500).json({ error: data.error.message });
        } else {
            res.json(data);
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

// Debugging line to verify API Key (you can remove this in production)
console.log("API Key:", process.env.OPENAI_API_KEY);
