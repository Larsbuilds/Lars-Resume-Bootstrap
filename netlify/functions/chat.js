const { OpenAI } = require('openai');

exports.handler = async function(event, context) {
    console.log('1. Function called');
    try {
        if (event.httpMethod !== 'POST') {
            console.log('2. Wrong method:', event.httpMethod);
            return { 
                statusCode: 405, 
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        console.log('3. Processing request');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const body = JSON.parse(event.body);
        const userMessage = body.message;

        console.log('4. Calling OpenAI');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are Lars's AI assistant. Answer questions about his background and experience." 
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        });

        console.log('5. OpenAI responded');
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
        console.log('6. Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Function failed',
                details: error.message 
            })
        };
    }
}
