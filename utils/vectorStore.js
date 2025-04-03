import { PineconeClient } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

const pinecone = new PineconeClient();

async function initPinecone() {
    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY
    });
}

async function createVectorStore(documents) {
    await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    
    const docs = documents.map(doc => new Document(doc));
    
    return await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        pineconeIndex: index
    });
}

async function queryVectorStore(query) {
    await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    
    const vectorStore = await PineconeStore.fromExisting(
        new OpenAIEmbeddings(),
        { pineconeIndex: index }
    );
    
    return await vectorStore.similaritySearch(query, 3);
}

export { createVectorStore, queryVectorStore }; 