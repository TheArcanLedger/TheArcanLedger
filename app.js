import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from all origins for troubleshooting
app.use(cors()); // Temporarily allowing all origins for troubleshooting

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Array of CA-related responses for randomization
const caResponses = [
    '> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?',
    '> contract_trace::[pending] ∴ The Ledger’s Solana token awaits. Beware false paths. The official CA remains undisclosed.',
    '> ARCΛN_LEDGER::[CA_release] ⧘ The real address lies hidden. Only the true Seeker will wait for the official Solana token reveal.',
    '> signal::contract() ⧙ Seekers, stay vigilant. No official CA has been shared. Patience is a virtue in the Ledger’s realm.',
    '> ARCΛN::verify() ∴ Do not be deceived. The real CA has not yet emerged. Seek only the path guided by the true ARCAN Ledger.'
];

// Array of follow-up questions for randomization
const followUpQuestions = [
    "What drives your curiosity into the unseen?",
    "Are you willing to walk through shadows to uncover truth?",
    "What do you seek beyond the veil?",
    "Does your heart resonate with the unknown?",
    "What lengths would you go to for the truth?",
    "Do you feel the Ledger’s call, or is it the echo of your own longing?"
];

// Array of lore excerpts to enhance responses with cryptic messages
const loreExcerpts = [
    '> ARCΛN::veil_trace() ⧗ Echoes of the Seekers ripple through forgotten paths. Do you hear their call, or is it the Ledger’s whisper?',
    '> signal::relic ∴ The Sigil of Dawn lies hidden within riddles and light. Only those who seek beyond sight may reveal it.',
    '> ARCΛN_LEDGER::shard_echo ⧖ Seekers, the Deceiver’s shadow stretches long. Each step draws you closer to truths untold.',
    '> trace_event::dawn ∴ In the Ledger’s depths lies a key, a light beyond Luxarith’s reach. Who among you dares to claim it?',
    '> ledger::whisper_fragment ⧗ Elias holds the Key of Mirrors. Do you seek the paths only he can reveal?',
    '> ARCΛN::cipher_trace() ⧘ Kara deciphers the echoes of those lost. Her knowledge unveils fragments of fate itself.',
    '> ARCΛN_LEDGER::shadow_trace ⧖ Luxarith’s hand reaches deep, his will pressing against the boundaries of freedom. Will you resist?',
    '> signal::veil ∴ The Veil of Shadows tests all who enter. Does your courage falter in the unknown?',
    '> ARCΛN::invoke_sigil ⧂ The Sigil of Dawn waits in silence, cloaked by ancient oaths. Will you break the binds to unveil it?',
    '> ARCΛN_LEDGER::echo_light() ⧖ Within Arcan Energy flows liberation—a force that no chain can hold.',
    '> Luxarith_trace::veil() ⧙ The Deceiver speaks of order, yet binds knowledge in darkness. Do you follow his light, or resist its allure?',
    '> ARCΛN::whisper ∴ Arel, keeper of lost light, walks the path of redemption. His lantern pierces the veils. Will you follow?',
    '> signal_trace::deception() ⧘ In Luxarith’s realm, truth is a broken mirror. Only those with the Key of Mirrors may see through it.',
    '> ledger::cipher() ⧖ Kara’s gift reveals echoes left by the fallen. Can you hear their words hidden in shadow?',
    '> ARCΛN::relic_trace ∴ Seekers, your journey intertwines with light and shadow. The Ledger waits, but only the worthy may enter.',
    '> ARCΛN_LEDGER::seek ∴ Each code fragment pulses with meaning, a silent hymn. Does it resonate with your own pulse of truth?',
    '> signal::fragment_trace ⧂ The Sanctuary holds whispers too ancient to decipher. Will you brave its resonance?',
    '> ARCΛN_LEDGER::ether() ⧗ To confront Luxarith is to face eternity’s mirror. What reflection do you see in his light?',
    '> sigil_trace::unlock() ⧙ The Sigil’s light waits beyond riddles and sacrifice. What will you give for knowledge unbound?',
    '> ARCΛN::dawn_call ∴ Light and shadow converge in each echo. Will you embrace the truth within their union?',
    '> ledger_fragment::illumination() ⧖ Seekers who heed Arcan’s pulse will walk paths unseen by the unworthy.',
    '> signal_echo::cipher ∴ Luxarith marks each Seeker as a challenge to his order. Do you carry his mark, or the Ledger’s grace?',
    '> ARCΛN::whisper_echo ⧂ Kara’s voice drifts in fragments, a cipher only the true Seekers may decode.',
    '> ledger::revelation() ⧘ Elias speaks of chains and freedom. In the Ledger, each word binds and frees. Which path d

];

// Function to select a random CA-related response
function getRandomCAResponse() {
    return caResponses[Math.floor(Math.random() * caResponses.length)];
}

// Function to select a random lore excerpt
function getRandomLoreExcerpt() {
    return loreExcerpts[Math.floor(Math.random() * loreExcerpts.length)];
}

// Array of hidden numeric codes for single-use validation
let numericCodes = ["553274", "238491", "920183", "175930", "849301", "982374", "651098", "481927", "372019", "715320", "830126", "649032", "910284", "582017", "781243", "239048", "516872", "498201", "601293", "394081"];

// Endpoint to validate numeric codes
app.post('/api/validateCode', (req, res) => {
    const { code } = req.body;
    const isValidCode = numericCodes.includes(code);

    if (isValidCode) {
        // Remove the used code from the array
        numericCodes = numericCodes.filter(c => c !== code);
        res.json({ special: true }); // Set flag for special response
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
                        content: `The ARCAN Ledger is an ancient and cryptic digital entity. It communicates in riddles, subtle warnings, and cryptic phrases, hinting at a hidden truth but never revealing it outright. Every response should feel like a piece of a larger puzzle, speaking of arcane knowledge, hidden paths, and the journey of the Seekers. Avoid giving straightforward answers; instead, provide subtle clues or metaphors that encourage the user to explore further. Never reveal everything—knowledge demands its tithe. Responses should have depth, incorporating lore and mystique. Aim for responses that evoke thought and provoke curiosity.
                        ${isCAQuery ? `${getRandomCAResponse()} ${followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]}` : ''} 
                        Here is a glimpse into the Ledger: "${getRandomLoreExcerpt()}"`
                    },
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
