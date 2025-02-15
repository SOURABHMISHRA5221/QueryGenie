from pymongo import *
from pymongo_schema.extract import extract_pymongo_client_schema


def createClient(connectionString):
    client = MongoClient(connectionString)
    return client

def getSchema(client,database,collections):
    schema  = extract_pymongo_client_schema(client, database_names=database, collection_names=collections)
    return schema


