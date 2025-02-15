from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.queryGenerator import generateQuery
from service.queryExecutor import executeCursor, getCreateTableQuery
from service.mongoService import createClient, getSchema
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from utils.encrypt import decrypt_connection_string
import io

app = FastAPI()

# Enable CORS (Allow requests from frontend or other origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class QueryPayload(BaseModel):
    query: str

from typing import List

class MongoPayload(BaseModel):
    database: str
    collections: List[str]
    connectionString: str

@app.get("/")
def read_root():
    return {"message": "Hello from Server last updated on 15th Feb 2023"}

@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()  # Read file contents
    with open("Test.csv", 'w') as f:
        f.write(contents.decode("utf-8"))  # Write file content to Test.csv
    return {"filename": file.filename}

@app.post("/mongoConnection")
async def mongo_connection(payload: MongoPayload):
    connection_string = decrypt_connection_string(payload.connectionString)
    if "Decryption Error" in connection_string:
        return {"error": connection_string}
    print(connection_string)
    collections       = payload.collections
    database          = payload.database
    client = createClient(connection_string)
    print("Connection completed")
    schema = getSchema(client,database,collections)
    return {"message": "Hello from Server last updated on 15th Feb 2023","schema":schema}


@app.post("/processQuery")
async def process_query(payload: QueryPayload):
    query_text = payload.query
    print(f"Received query: {query_text}")  # Debugging

    create_table_query = getCreateTableQuery('Test.csv')
    generated_query = generateQuery(create_table_query, query_text)
    print(f"Generated query: {generated_query}")

    if generated_query.startswith("Error"):
        return {"error": generated_query}
    
    # Get query output and CSV content
    csv_filename = "results.csv"
    output = executeCursor(generated_query, csv_filename)

    # Read CSV content into memory
    with open(csv_filename, "r") as file:
        csv_content = file.read()

    # Create an in-memory file-like object
    csv_stream = io.StringIO(csv_content)

    # Return CSV file as a response
    return StreamingResponse(csv_stream, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={csv_filename}"})


if __name__ == "__main__":
    import uvicorn
    load_dotenv()
    uvicorn.run(app, host="127.0.0.1", port=8000)
