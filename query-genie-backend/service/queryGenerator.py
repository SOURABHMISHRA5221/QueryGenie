import requests
import os
from dotenv import load_dotenv
load_dotenv()
# Define the API endpoint URL and API key
url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
api_key = os.environ.get("API_KEY")


def generateQuery(create_table_queries, prompt):
    # Define the request headers and data
    headers = {'Content-Type': 'application/json'}
    data = {'contents': [{'parts': [{'text': 'Just give me the SQL query, do not write anything else like ```sql ```. My tables are '+ str(create_table_queries) + ". " + prompt}]}]}

    # Set the API key in the params
    params = {'key': api_key}

    # Send a POST request
    response = requests.post(url, headers=headers, json=data, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        text = response.json()['candidates'][0]['content']['parts'][0]['text']
        return text
    else:
        return "Error: " + str(response.status_code) + " - " + response.text