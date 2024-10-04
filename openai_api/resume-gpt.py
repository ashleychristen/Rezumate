from openai import OpenAI
from authenticate import get_openai_client
import PyPDF2
import csv
import os

client = get_openai_client()

example_resume = "/Users/hhpfi/Downloads/Fiona Hoang Resume.pdf"
resume_id = 1
example_jd = """
About the job
GENERAL APPLICATION BANK

4 or 8 months internship | Full time | 37.5 hours per week | Start in January 2025 | End in April 2025 or August 2025 | Valcourt | University level 

The Experience Of a Lifetime

BRP's internship program is truly one of a kind. We hire more than 350 interns a year from all backgrounds, skill levels and professions. And many of these internships lead to employment at BRP because we believe in investing in our talent to help them reach their full potential. At BRP, you'll work with an experienced professional team and have the opportunity to work on challenging projects with real impact. Will you be our next generation? Apply now!

Any benefits? There's no shortage of them for our interns!

Competitive salary and a bonus for returning to the internship: we know how hard you work, so we offer you what you deserve. 
Flexible working hours: whether you're in the office or working from home, you'll always be supported by your team. 
The most stimulating work environment: progress doesn't come from standing still. You'll have the chance to learn and be challenged by tomorrow's top talent. 
Social activities: the cohort of 100 interns is never bored with a full calendar of activities organized by the social committee! 

Become Our Next Generation If

You are pursuing a degree in Software Engineering, Computer Engineering or a related field. 
You demonstrate ambition, passion, self-reliance and resilience. 

Overview Of The Recruitment Process

The internship team will analyze all applications received on the career site and on university platforms and will share those that are selected with the internship managers. Don't hesitate to add a project portfolio, your transcript, your academic involvement and anything else that sets you apart! 
The manager of an internship that might be suitable for you will invite you to a one-on-one interview if your application has caught their attention. You may be contacted by several managers! Please note that you will only be contacted if you are selected for an interview. 
After the interview, if your application is successful, you may be offered an internship at BRP! 

WELCOME TO BRP

As a world leader in recreational vehicles and boats, we create innovative ways to get around on snow, water, asphalt, land and... even in the air. Our corporate headquarters are in Valcourt, Quebec, but we offer internships in Sherbrooke and Montreal as well. We have manufacturing facilities around the world. We have more than 20,000 dynamic people, driven by the deep conviction that in work, as in life, it's not about the destination. It's the journey. It's your journey.

THE ROAD SHOULD BELONG TO EVERYONE.

We still live in a world where many feel the road is for other people. We believe we can make a difference. Moving people goes beyond making innovative products.

We strive to nurture our people’s aspirations, to exceed our riders’ expectations and stand in solidarity with all the communities that ride with us.

Building a more inclusive BRP with no barriers for those who seek to ride starts from within, and we need everyone's commitment, drive and dedication to make it a reality.

You want to be sure not to miss anything? Subscribe to our newsletter by clicking here!
"""

# Open the PDF file
def extract_resume_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        resume_text = ""
        for page in reader.pages:
            text = page.extract_text()
            resume_text += text + "\n"  # Combine text from each page
    return resume_text

resume_text = extract_resume_text(example_resume)
jd = example_jd

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
