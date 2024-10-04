from openai import OpenAI
import requests
import os

api_key = os.getenv('OPENAI_API_KEY') 

client = OpenAI(
  organization='org-AUTjzHJLNiOLA39QPHM8lXXy',
  api_key=api_key
)


stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say this is a test"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")

    