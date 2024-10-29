import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the current directory
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
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 100
            })
        });

        const data = await response.json();

        if (data.error) {
            res.status(500).json({ error: data.error.message });
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
