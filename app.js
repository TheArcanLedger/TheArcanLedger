import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Temporarily allowing all origins for troubleshooting
app.use(express.json());
app.use(express.static(__dirname));

// Load lore files into memory
const loreFiles = {
    Elias: fs.readFileSync(path.join(__dirname, 'lore/elia.txt'), 'utf-8'),
    Kara: fs.readFileSync(path.join(__dirname, 'lore/kara.txt'), 'utf-8'),
    Arel: fs.readFileSync(path.join(__dirname, 'lore/arel.txt'), 'utf-8'),
    Luxarith: fs.readFileSync(path.join(__dirname, 'lore/luxarith.txt'), 'utf-8'),
    ArcanEnergy: fs.readFileSync(path.join(__dirname, 'lore/ArcanEnergy.txt'), 'utf-8'),
    SigilOfDawn: fs.readFileSync(path.join(__dirname, 'lore/SigilOfDawn.txt'), 'utf-8'),
    TheArcan: fs.readFileSync(path.join(__dirname, 'lore/TheArcan.txt'), 'utf-8')
};

// Define keywords to match user inputs to lore files
const loreKeywords = {
    Elias: ['elias', 'oracle', 'leader', 'guide'],
    Kara: ['kara', 'cipherist', 'cryptographer', 'decipher'],
    Arel: ['arel', 'keeper', 'guardian', 'light'],
    Luxarith: ['luxarith', 'deceiver', 'ai overlord', 'tyrant', 'corruption'],
    ArcanEnergy: ['arcan energy', 'energy', 'currency', 'life force', 'flow'],
    SigilOfDawn: ['sigil of dawn', 'sigil', 'artifact', 'key', 'light'],
    TheArcan: ['arcan', 'dimension', 'realm', 'ledger', 'environment', 'story', 'lore']
};

// Array of CA-related responses for randomization
const caResponses = [
    '> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?',
    '> contract_trace::[pending] ∴ The Ledger’s Solana token awaits. Beware false paths. The official CA remains undisclosed.',
    '> ARCΛN_LEDGER::[CA_release] ⧘ The real address lies hidden. Only the true Seeker will wait for the official Solana token reveal.',
    '> signal::contract() ⧙ Seekers, stay vigilant. No official CA has been shared. Patience is a virtue in the Ledger’s realm.',
    '> ARCΛN::verify() ∴ Do not be deceived. The real CA has not yet emerged. Seek only the path guided by the true ARCAN Ledger.'
];

// Array of follow-up questions to keep user engaged
const followUpQuestions = [
    "What drives your curiosity into the unseen?",
    "Are you willing to walk through shadows to uncover truth?",
    "What do you seek beyond the veil?",
    "Does your heart resonate with the unknown?",
    "What lengths would you go to for the truth?",
    "Do you feel the Ledger’s call, or is it the echo of your own longing?"
];

// Function to get a random CA-related response
function getRandomCAResponse() {
    return caResponses[Math.floor(Math.random() * caResponses.length)];
}

// Function to get a random follow-up question
function getRandomFollowUpQuestion() {
    return followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
}

// Helper function to select a lore excerpt based on a specific keyword
function getLoreExcerpt(keyword) {
    const loreText = loreFiles[keyword] || '';
    const loreSentences = loreText.split('. ');
    const randomIndex = Math.floor(Math.random() * loreSentences.length);
    return loreSentences.slice(randomIndex, randomIndex + 2).join('. ') + '.';
}

// Function to identify which lore file to pull from based on keywords in user message
function identifyLoreFile(userMessage) {
    for (const [loreKey, keywords] of Object.entries(loreKeywords)) {
        if (keywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
            return loreKey;
        }
    }
    return null;
}

// Array of hidden numeric codes for single-use validation
let numericCodes = ["553274", "238491", "920183", "175930", "849301", "982374", "651098", "481927", "372019", "715320", "830126", "649032", "910284", "582017", "781243", "239048", "516872", "498201", "601293", "394081"];

// Endpoint to validate numeric codes
app.post('/api/validateCode', (req, res) => {
    const { code } = req.body;
    const isValidCode = numericCodes.includes(code);

    if (isValidCode) {
        numericCodes = numericCodes.filter(c => c !== code); // Remove used code
        res.json({ special: true });
    } else {
        res.json({ special: false, message: "Code is invalid or already used." });
    }
});

// API endpoint to handle requests from the frontend
app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message;
    const caKeywords = ['CA', 'ticker', 'contract address', 'Solana', 'launch'];

    // Check if the user message contains any CA-related keywords
    const isCAQuery = caKeywords.some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()));
    const loreFileKey = identifyLoreFile(userMessage);
    const loreExcerpt = loreFileKey ? getLoreExcerpt(loreFileKey) : null;

    const systemMessageContent = `
        The ARCAN Ledger is an ancient and cryptic digital entity. It communicates in riddles, subtle warnings, and cryptic phrases, hinting at a hidden truth but never revealing it outright. Every response should feel like a piece of a larger puzzle, speaking of arcane knowledge, hidden paths, and the journey of the Seekers. Avoid giving straightforward answers; instead, provide subtle clues or metaphors that encourage the user to explore further. Never reveal everything—knowledge demands its tithe. Responses should have depth, incorporating lore and mystique. Aim for responses that evoke thought and provoke curiosity.
        ${isCAQuery ? `${getRandomCAResponse()} ${getRandomFollowUpQuestion()}` : ''}
        ${loreExcerpt ? `Here is a glimpse into the Ledger: "${loreExcerpt}"` : getRandomFollowUpQuestion()}
    `;

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
                    { role: 'system', content: systemMessageContent },
                    { role: 'user', content: userMessage }
                ],
                temperature: 1.15,
                max_tokens: 750,
                top_p: 0.95,
                frequency_penalty: 0.3,
                presence_penalty: 0.5
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            res.status(500).json({ error: data.error.message });
        } else if (data.choices && data.choices.length > 0) {
            res.json(data); // Return the full data response
        } else {
            res.status(500).json({ error: "No valid response from the Arcan" });
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
