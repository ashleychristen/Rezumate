from openai import OpenAI
from authenticate import get_openai_client
import PyPDF2
import csv
import os
import tkinter as tk
from tkinter import filedialog


client = get_openai_client()

# Ask user to select folder
def select_folder():
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    folder_selected = filedialog.askdirectory(title="Select Folder of Resumes")
    return folder_selected

# Ask user to select job description file
def select_job_description():
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_selected = filedialog.askopenfilename(
        title="Select Job Description Text File",
        filetypes=[("Text Files", "*.txt")]
    )
    return file_selected

# Get resume files and assign IDs
def associate_resumes_with_ids(resume_folder):
    resumes = [f for f in os.listdir(resume_folder) if f.endswith(".pdf")]
    resume_dict = {}
    for i, resume in enumerate(resumes, start=1):
        resume_path = os.path.join(resume_folder, resume)
        resume_dict[i] = resume_path
    return resume_dict

# Open the PDF file
def extract_resume_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        resume_text = ""
        for page in reader.pages:
            text = page.extract_text()
            resume_text += text + "\n"  # Combine text from each page
    return resume_text

def generate_prompts(resume_text, jd):
    name_prompt=f"""
    this is a resume text. what is the name of the person of whom this resume is of: : {resume_text}

    Give me the name of the applicant only - that is, do not include any other words in your response. """

    match_prompt=f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to - based on the job description - give the percentage at 
    which the resume matches the job description. 

    This is the resume text: {resume_text}
    This is the job description: {jd}

    Give me the percentage number only - that is, do not include any other words in your response. """

    length_prompt=f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to give me the number of words present in the following resume text: {resume_text} 

    Give me the number of words only in the full resume, in this format: "words: 100"
    """

    education_prestige_prompt=f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to extract the secondary or higher education present
    in the given resume text, and give a ranking from 0-10 of the prestige of this educational
    institution regarding the tech field, where 10 is the most prestigious. 

    This is the resume text: {resume_text} 

    Give me the ranking of the educational prestige (from 0-10) only - that is, do not include any other words in your response.
    """

    gpa_prompt=f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to extract the number of the GPA of the secondary or higher education of the applicant
    of the given resume text.

    This is the resume text: {resume_text} 

    Give me the GPA of the person only - that is, do not include any other words in your response. If there are multiple GPAs, 
    only use the one for the most recent educational institution.
    """ 

    input_prompts = {'name': name_prompt, 'match': match_prompt, 'length': length_prompt, 'education_prestige': education_prestige_prompt, 'gpa': gpa_prompt}
    return input_prompts

resume_variables = ["name", "match", "length", "education_prestige", "gpa"]

def get_resume_stats(resume_pdf_path, resume_id, jd):

    resume_text = extract_resume_text(resume_pdf_path)
    input_prompts = generate_prompts(resume_text, jd)

    resume_stats = {}
    resume_stats[resume_id] = {}

    for resume_variable in resume_variables:
        prompt = input_prompts[resume_variable]     
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        string = ""

        if resume_variable == "length":
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    #print(chunk.choices[0].delta.content, end="\n")
                    resume_stats[resume_id][resume_variable] = chunk.choices[0].delta.content
        else:
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    #print(chunk.choices[0].delta.content, end="")
                    string = string + chunk.choices[0].delta.content
                resume_stats[resume_id][resume_variable] = string

    return resume_stats

def write_to_csv(resume_stats):
    with open('resume_stats.csv', mode='a') as resume_stats_file:
        resume_stats_writer = csv.writer(resume_stats_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        resume_stats_writer.writerow(['Name', 'Resume ID', 'Match', 'Length', 'Education Prestige', 'GPA'])
        for resume_id in resume_stats.keys():
            data = resume_stats[resume_id]
            print(data['name'])
            resume_stats_writer.writerow([data['name'], resume_id, data['match'][:-1], data['length'], data['education_prestige'], data['gpa']])

def main():
    resume_stats = get_resume_stats(example_resume, resume_id, example_jd)
    #print(resume_stats)
    write_to_csv(resume_stats)
    
if __name__ == "__main__":
    main()
