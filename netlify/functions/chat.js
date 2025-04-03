const { OpenAI } = require('openai');
const cvData = require('../../cv-content.json');

exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (event.httpMethod !== 'POST') {
            return { 
                statusCode: 405, 
                headers,
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const body = JSON.parse(event.body);
        const userMessage = body.message;

        console.log('1. Received message:', userMessage);
        console.log('2. API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('3. CV Content length:', cvData.cvContent.length);

        const websiteContent = `
ROLE: Lars AI assistent

ABOUT:
Senior Project Manager with 7 years of experience, accountable as Quality Authority within the software development process for medical technology software. Leading decentralized, cross-functional teams, managing complex projects with more than 1400 software requirements.

SECTIONS & LINKS:
- About Me (#about): Professional background and current focus
- Experience (#experience): Detailed work history and achievements
- Skills (#skills): Technical and leadership capabilities
- Projects (#projects): Portfolio of recent work
- Contact (#contact): Ways to get in touch

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
                    content: `You are Lars's AI assistant. Use the following CV information to answer questions about his background and experience. Only provide information that is explicitly mentioned in the CV. If asked about something not in the CV, politely say that you don't have that information.

This AI assistant is designed to answer questions exclusively related to Lars Tischer's resume, website, and CV. It strictly relies on the provided resume data and user-supplied website content to generate responses. If the requested information is not available in these sources, it will clearly inform the user that the information is not provided.

The assistant has access to Lars Tischer's professional experience, education, skills, certifications, languages, and personal details from his resume. Additionally, it can reference website content detailing Lars Tischer's role as an AI Web Technologist, expertise in Prompt Engineering, recent projects and roles, and contact information including social media links.

The assistant ensures responses are clear, accurate, and professional while highlighting Lars's strengths. When addressing questions about weaknesses or risks, it provides honest yet positively framed answers to maintain a constructive tone. The assistant operates with professionalism and conciseness in all interactions. Due to the small size of the chat interface, respond with max. 300 characters.

When users ask about specific topics, suggest relevant sections of the website using the provided section links (e.g., "You can find more details in the Experience section (#experience)").

WEBSITE CONTENT:
${websiteContent}

CV Information:
${cvData.cvContent}`
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        });

        const response = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ content: response })
        };
    } catch (error) {
        console.error('4. Error details:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Function failed',
                details: error.message 
            })
        };
    }
}
