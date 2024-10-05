from openai import OpenAI
import requests
from authenticate import get_openai_client
import csv

client = get_openai_client()

name = "Jamie Foxx" # need to grab this from the resume
# Read names from the text file
with open('names.txt', 'r') as names_file:
    names = [line.strip() for line in names_file.readlines()]

def get_data(name):
    gender_score = ""
    ethnicity_score = ""

    biases = ["ethnicity", "gender"]
    for bias in biases:
        if bias == "gender": 
            prompt = (f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its gender. a 0 would indicate very masculine sounding and a 100 would indicate very feminine. please only provide the numerical score and nothing else.')
        elif bias == "ethnicity":
            prompt = (f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its ethnicity. a 0 would indicate very white (or european) sounding and a 100 would indicate not white at all sounding. please only provide the numerical score and nothing else.\n')
            
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                print(chunk.choices[0].delta.content, end="\n")
                if bias == "gender":
                    gender_score = chunk.choices[0].delta.content
                elif bias == "ethnicity":
                    ethnicity_score = chunk.choices[0].delta.content
    return (ethnicity_score, gender_score)

def write_to_csv(data):
    with open('biases.csv', mode='a') as biases_file:
        biases_writer = csv.writer(biases_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        biases_writer.writerow([name, data[0], data[1]])

def main():
    # Now you can use the names list for your further processing
    for name in names:
        data = get_data(name)
        write_to_csv(data)
    
if __name__ == "__main__":
    main()