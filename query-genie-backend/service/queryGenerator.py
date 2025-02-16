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


base_schema = """{
    "database_name_1": {}, #database_schema,
    "database_name_2": # A database contains collections
    { 
        "collection_name_1": {}, # collection_schema,
        "collection_name_2": # A collection maintains a 'count' and contains 1 object
        { 
            "count" : int, 
            "object":  # object_schema : An object contains fields.            
             {
                "field_name_1" : {}, # field_schema, 
                "field_name_2": # A field maintains 'types_count_information
                                # An optional 'array_types_count' field maintains 'types_count' information for values encountered in arrays 
                                # An 'OBJECT' or 'ARRAY(OBJECT)' field recursively contains 1 'object'
                {
                    'count': int,
                    'prop_in_object': float,
                    'type': 'type_str', 
                    'types_count': {  # count for each encountered type  
                        'type_str' : 13,
                        'Null' : 3
                    }, 
                    'array_type': 'type_str',
                    'array_types_count': {  # (optional) count for each type encountered  in arrays
                        'type_str' : 7,
                        'Null' : 3
                    }, 
                    'object': {}, # (optional) object_schema 
                } 
            } 
        }
    }           
}"""

def generateQueryForMongo(schema, prompt):
    # Define the request headers and data
    global base_schema
    headers = {'Content-Type': 'application/json'}
    data = {'contents': [{'parts': [{'text': 'You will be provided three things one a base schema, two a geniune mongodb schema and three a natural languages user query, you need to analyse the geniune schema and then write a mongodb query for the user query...Now here is base_schema : '+base_schema+"\n geninue_schema : "+schema+"\n user query : "+prompt+"\n"}]}]}

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