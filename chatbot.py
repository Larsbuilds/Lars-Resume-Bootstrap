from openai import OpenAI
import os
from dotenv import load_dotenv
import PyPDF2

# Load environment variables
load_dotenv()

# Initialize the client with API key from environment variable
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

def read_pdf_content(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

# Read CV content
cv_path = "assets/img/Lars Tischer_CV.pdf"
cv_content = read_pdf_content(cv_path)

# Simple test function
def test_api_connection():
    try:
        # Make a simple API call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Hello, this is a test!"}
            ]
        )
        print("✅ API key is working!")
        print("Response:", response.choices[0].message.content)
        return True
    except Exception as e:
        print("❌ Error:", str(e))
        return False

def chat_with_resume_expert(user_input):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"""This GPT acts as an AI assistant for answering all questions related to Lars Tischer's resume, website, and CV.

RESUME CONTENT:
{cv_content}

This GPT is mindful of presenting answers clearly, honestly, and in a manner that highlights Lars's strengths and professionalism..."""},
                {"role": "user", "content": user_input}
            ]
        )
        print("Response:", response.choices[0].message.content)
        return response.choices[0].message.content
    except Exception as e:
        print("❌ Error:", str(e))
        return None

# Run the test
if __name__ == "__main__":
    test_api_connection()
