import os
import requests

# Access the OpenAI API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")

# Check if the API key was retrieved successfully
if api_key:
    print("API Key successfully retrieved!")
else:
    print("Failed to retrieve API Key.")

url = "https://api.openai.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Define the input data for the API
data = {
    "model": "gpt-3.5-turbo",  # You can choose different models
    "messages": [{"role": "user", "content": "Hello, how are you?"}]
}

# Make the API request
response = requests.post(url, headers=headers, json=data)

# Check the response
if response.status_code == 200:
    result = response.json()
    print(result["choices"][0]["message"]["content"])  # Print the model's response
else:
    print(f"Error: {response.status_code} - {response.text}")