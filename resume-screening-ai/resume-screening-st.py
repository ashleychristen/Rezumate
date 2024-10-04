import streamlit as st
import google.generativeai as genai
import os
import PyPDF2 as pdf

from dotenv import load_dotenv

load_dotenv() 

genai.configure(api_key="AIzaSyDEw4ZF5Gxg3o26sxYJaUB8IDVVVEfDk-w")

# Get the Gemini Pro Response

# Use extracted pdf's text, and get gemini pro response
def get_gemini_response(input):
    model=genai.GenerativeModel('gemini-pro')
    response=model.generate_content(input)
    return response.text

# Function to take a pdf and extract the text
def input_pdf_text(uploaded_file):
    reader=pdf.PdfReader(uploaded_file)
    text=""
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]  # Get the specific page
        text += str(page.extract_text())  # Extract text from the page
    return text

input_prompt="""
Act as a skilled and experienced Application Tracking System
with a deep understanding of the tech field, software engineering,
machine learning engineer, and data analyst. Your task is to evaluate
the resume based on the given job description. You must consider
the job market really competitive. 

Based on the job description, give the percentage at which the resume matches the job description,
and also give the number of words on the resume, the level of prestige of the education of the 
applicant in relation to the tech field on a scale of 0-10 where 10 is the most prestigious, and 
the GPA of the applicant. Also, print the first line of text in the resume.
resume: {text}
description:{jd}

I want the response in one single string with this structure:
{{"JD Match":"%", "length":"", "education_prestige": "", "gpa": "", "first list of text": ""}}
"""

## streamlist app
st.title("Resume Screening AI")
st.text("AI Component to Understand Resumes")
jd=st.text_area("Past the Job Description")
uploaded_file=st.file_uploader("Upload Your Resume", type="pdf", help="Please upload the pdf")

submit=st.button("Submit")

if submit:
    if uploaded_file is not None:
        text=input_pdf_text(uploaded_file)
        response = get_gemini_response(input_prompt)
        st.subheader(response)