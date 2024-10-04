from openai import OpenAI
import os

api_key = os.getenv('OPENAI_API_KEY') 

client = OpenAI(
  organization='org-AUTjzHJLNiOLA39QPHM8lXXy',
  api_key=api_key
)

def get_openai_client():
    return client

