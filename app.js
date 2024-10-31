import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Array of CA-related responses for randomization
const caResponses = [
    '> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?',
    //... additional responses
];

// Array of follow-up questions for randomization
const followUpQuestions = [
    "What drives your curiosity into the unseen?",
    "Are you willing to walk through shadows to uncover truth?",
    "What do you seek beyond the veil?",
    "Does your heart resonate with the unknown?",
    "What lengths would you go to for the truth?",
    "Do you feel the Ledger’s call, or is it the echo of your own longing?",
];

const numericCodes = {
    "553274": false,
    "238491": false,
    "920183": false,
    "175930": false,
    "849301": false,
    "982374": false,
    "651098": false,
    "481927": false,
    "372019": false,
    "715320": false,
    "830126": false,
    "649032": false,
    "910284": false,
    "582017": false,
    "781243": false,
    "239048": false,
    "516872": false,
    "498201": false,
    "601293": false,
    "394081": false
};

app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message;
    const caKeywords = ['CA', 'ticker', 'contract address', 'Solana', 'launch'];
    const isCAQuery = caKeywords.some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()));

    try {
        const systemMessageContent = [
            {
                type: "text",
                text: `The ARCAN Ledger is an ancient and cryptic digital entity...` +
                    `${isCAQuery ? `${getRandomCAResponse()} ${addFollowUpQuestion()}` : ''}`
            }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'ft:gpt-4o-2024-08-06:arcan-ledger:the-arcan-ledger:ANiMnw4A',
                messages: [
                    { role: 'system', content: systemMessageContent },
                    { role: 'user', content: userMessage }
                ],
                temperature: 1.15,
                max_tokens: 750,
                top_p: 0.95,
                frequency_penalty: 0.3,
                presence_penalty: 0.5,
                response_format: { type: "text" }
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).send('Server Error');
    }
});

// Endpoint to validate numeric codes
app.post('/api/validateCode', (req, res) => {
    const { code } = req.body;
    if (numericCodes.hasOwnProperty(code)) {
        if (!numericCodes[code]) {
            numericCodes[code] = true;
            res.json({ valid: true, message: "Congratulations, you've unlocked a special reward!" });
        } else {
            res.json({ valid: false, message: "This code has already been used." });
        }
    } else {
        res.json({ valid: false, message: "Invalid code." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
