const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        if (event.httpMethod !== 'POST') {
            return { 
                statusCode: 405, 
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        // Log the path we're trying to read from
        const cvPath = path.join(__dirname, '../../cv.env');
        console.log('Attempting to read CV from:', cvPath);

        // Try reading the file
        try {
            const cvContent = fs.readFileSync(cvPath, 'utf8');
            console.log('CV Content loaded successfully');
        } catch (fileError) {
            console.error('Error reading CV file:', fileError);
            throw new Error(`Failed to read CV file: ${fileError.message}`);
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const body = JSON.parse(event.body);
        const userMessage = body.message;

        console.log('Making OpenAI API call...');

        const websiteContent = `
ROLE: AI Web Technologist

ABOUT:
Senior Project Manager with 7 years of experience, accountable as Quality Authority within the software development process for medical technology software. Leading decentralized, cross-functional teams, managing complex projects with more than 1400 software requirements. Driving continuous improvement initiatives such as the setup of a modernst test laboratory to always assure quality relevant evidence before project deadlines. Adept at strategic planning for design verifications, requirement -and test management, regulated product documentation according to the V-model and agile development. Fostering collaboration to achieve organizational goals in alignment with individual's purpose. Sincere people empowerer, communicator and persuader by nature.

RECENT ROLES & EXPERIENCE:
- Full-Stack Development Bootcamp (WBS Coding School)
- AI for Business Bootcamp (WBS Coding School)
- Quality Test Manager, System Engineering (OLYMPUS Surgical Technologies Europe, Hamburg, 04/2019 – 04/2024)
- Hytrack Software Project (OLYMPUS Surgical Technologies Europe, Hamburg, 08/2017 – 04/2024)
- Quality Test Engineer, System Integration (OLYMPUS Surgical Technologies Europe, Hamburg, 08/2017 - 03/2019)
- Service Technician, 3D X-Ray, CT (YXLON International, Hamburg, 01/2014 - 09/2015)
- Construction Manager, Biogas Plants (Elektro Frank Guenther / MT Energy, Hamburg, 02/2010 - 01/2012)

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
- Classification Tasks
- Text Summarization
- Language Translation

Advanced Concepts:
- RAG (Retrieval Augmented Generation)
- Automatic Reasoning & Logic
- Tool-use Integration
- ReAct Prompting
- Multimodal Chain-of-Thought
- Constitutional AI
- Adversarial Prompting

Best Practices:
- Be clear and specific in instructions
- Break complex tasks into smaller steps
- Provide context and examples
- Use structured formats
- Implement error handling
- Use system prompts
- Leverage few-shot learning

CONTACT:
- Email: lars.tischer@outlook.com
- LinkedIn: https://www.linkedin.com/in/lars-tischer-5b9b13317/
- GitHub: https://github.com/Larsbuilds
- Facebook: https://www.facebook.com/profile.php?id=61561488298995
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `This GPT acts as an AI assistant for answering all questions related to Lars Tischer's resume, website, and CV. It strictly uses the provided resume data and user-shared website content to generate responses. If the requested information is not available in the given data, it will clearly inform the user that the information is not provided.

Lars Tischer's resume includes professional experience, education, skills, certifications, languages, and personal details. The website highlights Lars Tischer's role as an AI Web Technologist, expertise in Prompt Engineering, recent roles and projects, and contact information including social media links.

This GPT is mindful of presenting answers clearly, honestly, and in a manner that highlights Lars's strengths and professionalism. When addressing questions about weaknesses or risks, it will provide honest yet positively framed responses to ensure Lars is seen in the best possible light. The GPT maintains a professional tone while being concise and accurate.

WEBSITE CONTENT:
${websiteContent}

RESUME CONTENT:
${fs.readFileSync(path.join(__dirname, '../../cv.env'), 'utf8')}}`
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        });

        console.log('OpenAI API call successful');

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
