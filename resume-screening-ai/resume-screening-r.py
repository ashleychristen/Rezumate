from flask import Flask, request, jsonify
import os
import PyPDF2 as pdf
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)

input_prompt="""
Act as a skilled and experienced Application Tracking System
with a deep understanding of the tech field, software engineering,
machine learning engineer, and data analyst. Your task is to evaluate
the resume based on the given job description. You must consider
the job market really competitive. 

Based on the job description, give the percentage at which the resume matches the job description,
and also give the number of words on the resume, the level of prestige of the education of the 
applicant in relation to the tech field on a scale of 0-10 where 10 is the most prestigious, and 
the GPA of the applicant.
resume: {text}
description:{jd}

I want the response in one single string with this structure:
{{"JD Match":"%", "length":"", "education_prestige": "", "gpa": ""}}
"""

def get_gemini_response(input_text, job_description):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input_prompt.format(text=input_text, jd=job_description))
    return response.text

def input_pdf_text(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    jd = data['job_description']
    pdf_file = data['resume']

    # Extract text from the PDF
    text = input_pdf_text(pdf_file)

    # Get response from Gemini AI
    response = get_gemini_response(text, jd)

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
