import { createVectorStore } from '../utils/vectorStore';
import fs from 'fs/promises';

async function populateStore() {
    // Load CV content
    const cvContent = await fs.readFile('../cv-content.json', 'utf8');
    const cv = JSON.parse(cvContent);

    // Load website content
    const websiteContent = `...`; // Your website content

    // Create documents
    const documents = [
        {
            pageContent: cv.cvContent,
            metadata: { source: 'cv' }
        },
        {
            pageContent: websiteContent,
            metadata: { source: 'website' }
        }
        // Add more documents as needed
    ];

    await createVectorStore(documents);
    console.log('Vector store populated successfully!');
}

populateStore().catch(console.error); 