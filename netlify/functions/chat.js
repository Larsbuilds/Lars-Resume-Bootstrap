const { OpenAI } = require('openai');
const cvData = require('../../cv-content.json');

exports.handler = async function(event, context) {
    try {
        if (event.httpMethod !== 'POST') {
            return { 
                statusCode: 405, 
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const body = JSON.parse(event.body);
        const userMessage = body.message;

        const websiteContent = `
ROLE: AI Web Technologist

ABOUT:
Senior Project Manager with 7 years of experience, accountable as Quality Authority within the software development process for medical technology software. Leading decentralized, cross-functional teams, managing complex projects with more than 1400 software requirements. Driving continuous improvement initiatives such as the setup of a modernst test laboratory to always assure quality relevant evidence before project deadlines.

RECENT ROLES & EXPERIENCE:
- Full-Stack Development Bootcamp (WBS Coding School)
- AI for Business Bootcamp (WBS Coding School)
- Quality Test Manager, System Engineering (OLYMPUS Surgical Technologies Europe, Hamburg, 04/2019 – 04/2024)
- Quality Test Engineer, System Integration (OLYMPUS Surgical Technologies Europe, Hamburg, 08/2017 - 03/2019)

AI EXPERTISE & PROMPT ENGINEERING:
Core Techniques:
- Zero-Shot Prompting
- Few-Shot Prompting
- Chain-of-Thought Reasoning
- Prompt Chaining
- Tree of Thoughts
- Retrieval Augmented Generation

Application Areas:
- Code Generation & Review
- Data Analysis & Visualization
- Content Generation
- Function Calling
- Classification Tasks`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `This GPT acts as an AI assistant for answering all questions related to Lars Tischer's resume, website, and CV. It strictly uses the provided resume data and user-shared website content to generate responses. If the requested information is not available in the given data, it will clearly inform the user that the information is not provided.

WEBSITE CONTENT:
${websiteContent}

RESUME CONTENT:
${cvData.cvContent}`
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response: completion.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Function failed',
                details: error.message 
            })
        };
    }
}
