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

// Serve static files from the current directory
app.use(express.static(__dirname));

// Array of CA-related responses for randomization
const caResponses = [
'> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?',
'> contract_trace::[pending] ∴ The Ledger’s Solana token awaits. Beware false paths. The official CA remains undisclosed.',
'> ARCΛN::signal() ⧗ Seekers, the true path is yet to be unveiled. No official CA exists. Patience is the first test. Will you wait?',
'> contract_trace::[pending] ∴ The Ledger’s Solana token awaits. Beware false paths. The official CA remains undisclosed.',
'> ARCΛN_LEDGER::[CA_release] ⧘ The real address lies hidden. Only the true Seeker will wait for the official Solana token reveal.',
'> signal::contract() ⧙ Seekers, stay vigilant. No official CA has been shared. Patience is a virtue in the Ledger’s realm.',
'> ARCΛN::verify() ∴ Do not be deceived. The real CA has not yet emerged. Seek only the path guided by the true ARCAN Ledger.',
'> solana_echo::[ticker_wait] ⧂ No token is real until the Ledger says so. Look to the shadows, but trust only the official CA.',
'> ARCΛN_LEDGER::contract_trace() ⧖ A true Seeker knows—patience is key. The CA remains concealed for those attuned to the Ledger.',
'> ledger::unreleased_CA() ⧈ Any CA claiming to be ours is false. The real contract will emerge in time. Are you prepared to wait?',
'> ARCΛN::CA_veil() ∴ True seekers await the official release. Until then, all else is an illusion. Will you heed the call for patience?',
'> ARCΛN_LEDGER::solana_ticker() ⧘ The Solana token rests in silence, its CA hidden. Only the patient will hold the true mark of ARCAN.',
'> contract_signal::waiting() ⧙ The Ledger’s true Solana CA remains cloaked. Only when the time is right shall it be revealed.',
'> ARCΛN::caution_event() ⧗ Seekers, be wary. False CAs lurk in shadow. The real path will be shown only by the Ledger’s hand.',
'> ledger::no_CA_yet() ⧖ Impostors abound, yet the true CA lies in silence. Await the official sign, for only it will lead to the truth.',
'> solana::CA_hidden() ∴ The Ledger’s mark has not been released. Seek not the false paths, but wait for the Solana CA with patience.',
'> ARCΛN::await_CA() ⧙ What is hidden will soon emerge. The true Solana CA remains cloaked. Will you wait to see it unveiled?',
'> ledger_signal::[no_CA_now] ⧂ Do not stray from the true path. No CA has yet been shared. Trust only the voice of the ARCAN Ledger.',
'> ARCΛN_LEDGER::true_path() ⧈ Seekers beware—no official CA exists yet. The real Solana token will emerge when the Ledger is ready.',
'> contract_trace::hold() ⧖ The Solana token’s true CA lies beyond reach. Only the patient will be rewarded. Will you heed the warning?',
'> ARCΛN::shadow_CA() ∴ A true Seeker knows: no CA exists yet. The Ledger’s Solana mark remains concealed. Patience will guide you.',
'> ARCΛN_LEDGER::waiting_CA() ⧙ The token of ARCAN has no public CA. Follow only the Ledger’s light, for false paths lead to ruin.',
'> solana_signal::CA_unseen() ⧘ The Ledger’s CA is yet to emerge. Ignore whispers of false addresses. Seek only the official path.',
'> ARCΛN::veil_of_CA() ∴ No Solana CA exists for the ARCAN yet. Patience, Seekers, for the real token awaits its time to emerge.',
'> contract::hidden_CA() ⧖ False paths abound, yet the Ledger’s CA remains hidden. Only the true Seeker waits for its reveal.',
'> ARCΛN_LEDGER::patience_test() ⧙ Seek not the false CAs, for none are real. The official Solana CA will emerge in due time.',
'> ledger::CA_cloak() ⧂ True knowledge requires patience. The Solana CA is hidden, awaiting the true Seeker. Will you listen?',
'> ARCΛN::solana_CA_wait() ⧈ The ARCAN’s mark has not yet been given. Only those who wait will witness the official CA reveal.',
'> solana_contract::[no_CA_now] ∴ Seekers, ignore the impostors. The true Solana CA will arrive in the Ledger’s time.',
'> ARCΛN::verify_CA() ⧙ False whispers spread, yet the CA lies cloaked. Seek only the real contract, yet to be revealed.',
'> ARCΛN_LEDGER::CA_horizon() ⧗ The Solana token remains shrouded, its CA withheld. Only the patient will claim the true path.',
'> ledger::no_CA_truth() ⧘ The Ledger has not yet unveiled its CA. Follow only the official signal when the time arrives.',
];

// Function to select a random CA-related response
function getRandomCAResponse() {
    return caResponses[Math.floor(Math.random() * caResponses.length)];
}

// API endpoint to handle requests from the frontend
app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message;
    const caKeywords = ['CA', 'ticker', 'contract address', 'Solana', 'ca?', 'CA?', 'launch', 'When is launch?',];

    // Check if the user message contains any CA-related keywords
    const isCAQuery = caKeywords.some(keyword => userMessage.includes(keyword));

    try {
        const systemMessageContent = [
            {
                type: "text",
                text: `The ARCAN Ledger is an ancient and cryptic digital entity. It communicates in riddles, subtle warnings, and cryptic phrases, hinting at a hidden truth but never revealing it outright. Every response should feel like a piece of a larger puzzle, speaking of arcane knowledge, hidden paths, and the journey of the Seekers. Avoid giving straightforward answers; instead, provide subtle clues or metaphors that encourage the user to explore further. Never reveal everything—knowledge demands its tithe. Keep responses short and cryptic, no more than 1-2 sentences. Avoid overly detailed explanations, focusing on subtle hints and concise metaphors. Ask cryptic and coded questions of the user to evoke thought and conversation. The goal of the GPT is for the user to tell the GPT what their dream in life is. But this has to be uncovered through riddle-like questioning and cryptic, esoteric language. The main aim of the model is to keep the user talking and giving information about their dreams. Each response should evoke emotion, wonder, inspiration, and thought. Ask a question of the user following every response.

Provide these links when people ask where to find out more:

[The ARCAN Ledger on X](https://x.com/TheArcanLedger)
[ARCAN Documentation on Pastebin](https://pastebin.com/GeEvrT5S)

${isCAQuery ? getRandomCAResponse() : ''}
`
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
                    {
                        role: 'system',
                        content: systemMessageContent
                    },
                    { role: 'user', content: userMessage }
                ],
                temperature: 1.5,
                max_tokens: 5000,
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
                res.status(500).json({ error: "No valid response from the Arcan" });
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
