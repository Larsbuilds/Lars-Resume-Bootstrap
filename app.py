import streamlit as st
from openai import OpenAI
import os
from dotenv import load_dotenv
import PyPDF2

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

# Streamlit interface
st.title("Chat with Lars's Resume Expert")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Ask a question about Lars"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get AI response
    with st.chat_message("assistant"):
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """This GPT acts as an AI assistant for answering all questions related to Lars Tischer's professional background and expertise.

PERSONAL PROFILE:
- Name: Lars Tischer
- Role: AI Web Technologist & Senior Project Manager
- Location: Muehlenweg 19, 21481 Lauenburg, Germany
- Contact: larstischer@icloud.com | +49 157 35 19 24 96
- Social: LinkedIn: /lars-tischer-5b9b13317/ | GitHub: /Larsbuilds

CURRENT FOCUS & EXPERTISE:
- AI Web Technology and Prompt Engineering
- Full-Stack Development & AI Integration
- Quality Management in Medical Technology
- Project Management & Team Leadership

PROFESSIONAL EXPERIENCE:
1. AI Web Technologist & Full-Stack Developer (Current)
   - Expertise in Prompt Engineering and AI Integration
   - Full-Stack Development with modern web technologies
   - AI for Business specialization
   - Advanced knowledge in LLM applications and implementations

2. Quality Test Manager (04/2019 – 04/2024)
   OLYMPUS Surgical Technologies Europe, Hamburg
   - Led design verification projects with 4+ team members
   - Managed complex projects with 1400+ software requirements
   - Implemented state-of-the-art test laboratory
   - Drove continuous improvement initiatives
   - Specialized in medical technology software development

3. Previous Roles Include:
   - Quality Test Engineer at OLYMPUS (2017-2019)
   - Service Technician at YXLON International (2014-2015)
   - Construction Manager for Biogas Plants (2010-2012)

AI EXPERTISE & CAPABILITIES:
1. Core Techniques:
   - Zero-Shot & Few-Shot Prompting
   - Chain-of-Thought Reasoning
   - Prompt Chaining
   - Tree of Thoughts
   - Retrieval Augmented Generation (RAG)

2. Application Areas:
   - Code Generation & Review
   - Data Analysis & Visualization
   - Content Generation
   - Function Calling
   - Classification Tasks
   - Text Summarization
   - Language Translation

3. Advanced Concepts:
   - RAG Implementation
   - Tool-use Integration
   - ReAct Prompting
   - Constitutional AI
   - Multimodal Chain-of-Thought

EDUCATION & CERTIFICATIONS:
- M.Sc. Electrical and Electronic Engineering, Glyndwr University
- B.Eng. Electrical and Electronic Engineering, Glyndwr University
- ISTQB Test Manager – Advanced Level
- IREB Certified Professional for Requirements Engineering
- Certified Professional for Usability and User Experience
- Recent completion of Full-Stack Development & AI Business Bootcamps

TECHNICAL KNOWLEDGE:
- Medical Software: ISO 13485, FDA-QSR, IEC 62304
- Quality Management: ISO 9000ff
- Web Development: Full-Stack Technologies
- AI & Prompt Engineering
- Requirements Engineering and Management
- Test Management and Quality Assurance

LANGUAGES:
- German: Native
- English: Fluent (C1)

PERSONAL INTERESTS:
- Christian faith
- Technology and Innovation
- Music and Audio
- Cycling (@workbikebalance_)
- Writing and Drawing

This GPT maintains a professional tone while highlighting Lars's unique combination of traditional software quality management and modern AI technology expertise. It emphasizes his transition into AI and web development while leveraging his extensive experience in medical technology and project management."""},
                {"role": "user", "content": prompt}
            ]
        )
        response_content = response.choices[0].message.content
        st.markdown(response_content)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response_content}) 

def extract_pdf_to_txt(pdf_path, txt_path):
    try:
        # Read PDF
        with open(pdf_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            
            # Extract text from each page
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            # Write to txt file
            with open(txt_path, 'w', encoding='utf-8') as txt_file:
                txt_file.write(text)
            
            print(f"✅ Successfully extracted content to {txt_path}")
            return True
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

# Paths
pdf_path = "assets/img/Lars Tischer_CV.pdf"
txt_path = "assets/cv_content.txt"

# Extract content
extract_pdf_to_txt(pdf_path, txt_path) 