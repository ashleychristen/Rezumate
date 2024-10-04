from openai import OpenAI
import requests

name = "Yan Qing Lee"


if bias == "ethnicity":
    prompt = (f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its ethnicity. a 0 would indicate very white (or european) sounding and a 100 would indicate not white at all sounding. please only provide the numerical score.\n')

elif bias == "gender":
    prompt = (f'please act like a hiring manager at a tech company. you are reading a resume and you come across the name "{name}" what would you score this name out of 100 based on its gender. a 0 would indicate very masculine sounding and a 100 would indicate very feminine. please only provide the numerical score.\n')
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="\n")

    