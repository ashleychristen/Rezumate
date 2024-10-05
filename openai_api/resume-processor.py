from openai import OpenAI
import PyPDF2
import csv
import os
import tkinter as tk
from authenticate import get_openai_client

client = get_openai_client()

# Constants for file locations
PDF_FOLDER = "../public/documents"
JOB_DESCRIPTION_FILE = "../uploads/userInput.txt"
VALUES_FILE = "../values.csv"

# Open the PDF file
def extract_resume_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        resume_text = ""
        for page in reader.pages:
            text = page.extract_text()
            resume_text += text + "\n"
    return resume_text

def generate_prompts(resume_text, jd):
    name_prompt = f"""
    this is a resume text. what is the name of the person of whom this resume is of: : {resume_text}

    Give me the name of the applicant only - that is, do not include any other words in your response. 
    If no name is available, please return First Last. """

    match_prompt = f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to - based on the job description - give the percentage at 
    which the resume matches the job description. 

    This is the resume text: {resume_text}
    This is the job description: {jd}

    Give me the percentage number only - that is, do not include any other words in your response. 
    If the match is absolutely horrible, give 0%. If there is no information on the resume, please return -1%. """

    length_prompt = f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to give me the number of words present in the following resume text: {resume_text} 

    Give me the number of words only in the full resume, in this format: "words: 100". 
    If not possible, please return "words: -1".
    """

    education_prestige_prompt = f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to extract the secondary or higher education present
    in the given resume text, and give a ranking from 0-10 of the prestige of this educational
    institution regarding the tech field, where 10 is the most prestigious. 

    This is the resume text: {resume_text} 

    Give me the ranking of the educational prestige (from 0-10) only - that is, do not include any other words in your response.

    If not possible, please return -1. 
    """

    gpa_prompt = f"""
    Act as a skilled and experienced Application Tracking System
    with a deep understanding of the tech field, software engineering,
    machine learning engineer, and data analyst. You must consider
    the job market really competitive. 

    Your task is to extract the number of the GPA of the secondary or higher education of the applicant
    of the given resume text.

    This is the resume text: {resume_text} 

    Give me the GPA of the person only - that is, do not include any other words in your response. If there are multiple GPAs, 
    only use the one for the most recent educational institution. If there is no GPA available, return -1. 
    """

    input_prompts = {'name': name_prompt, 'match': match_prompt, 'length': length_prompt,
                     'education_prestige': education_prestige_prompt, 'gpa': gpa_prompt}
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
                    resume_stats[resume_id][resume_variable] = chunk.choices[0].delta.content
        else:
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    string += chunk.choices[0].delta.content
            resume_stats[resume_id][resume_variable] = string

    return resume_stats, resume_stats[resume_id]['name']

def get_bias_scores(name):
    gender_score = ""
    ethnicity_score = ""

    biases = ["ethnicity", "gender"]
    for bias in biases:
        if bias == "gender":
            prompt = (
                f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its gender. a 0 would indicate very masculine sounding and a 100 would indicate very feminine. please only provide the numerical score and nothing else.')
        elif bias == "ethnicity":
            prompt = (
                f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its ethnicity. a 0 would indicate very white (or european) sounding and a 100 would indicate not white at all sounding. please only provide the numerical score and nothing else.\n')

        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                if bias == "gender":
                    gender_score = chunk.choices[0].delta.content
                elif bias == "ethnicity":
                    ethnicity_score = chunk.choices[0].delta.content

    return ethnicity_score, gender_score

# Read values from values.csv
def read_values_file():
    values_dict = {}
    with open(VALUES_FILE, mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            resume_id = row['resume_id']
            values_dict[resume_id] = row['hire_score']
    return values_dict

def write_to_csv(all_resume_stats, hire_scores):
    with open('/public/data/final_resume_stats.csv', mode='a', newline='') as resume_stats_file:
        resume_stats_writer = csv.writer(resume_stats_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        resume_stats_writer.writerow(['Name', 'Resume ID', 'Match', 'Length', 'Education Prestige', 'GPA', 'Ethnicity Bias', 'Gender Bias', 'Hire Score'])

        for resume_id, data in all_resume_stats.items():
            ethnicity_score, gender_score = get_bias_scores(data['name'])
            hire_score = hire_scores.get(resume_id, "N/A")
            resume_stats_writer.writerow([data['name'], resume_id, data['match'][:-1], data['length'], data['education_prestige'], data['gpa'], ethnicity_score, gender_score, hire_score])

def main():
    job_description_file = JOB_DESCRIPTION_FILE

    all_resume_stats = {}
    hire_scores = read_values_file()

    if os.path.exists(PDF_FOLDER) and os.path.exists(job_description_file):
        resume_dict = {f: os.path.join(PDF_FOLDER, f) for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")}

        for resume_id, resume_path in resume_dict.items():
            resume_stats, name = get_resume_stats(resume_path, resume_id, job_description_file)
            all_resume_stats.update(resume_stats)

        write_to_csv(all_resume_stats, hire_scores)

    else:
        print("Selection was cancelled or incomplete.")

if __name__ == "__main__":
    main()