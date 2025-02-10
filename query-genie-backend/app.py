from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.queryGenerator import generateQuery
from service.queryExecutor import executeCursor, getCreateTableQuery
from dotenv import load_dotenv

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

@app.get("/")
def read_root():
    return {"message": "Hello from Server last updated on 10th Feb 2023"}

@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()  # Read file contents
    with open("Test.csv", 'w') as f:
        f.write(contents.decode("utf-8"))  # Write file content to Test.csv
    return {"filename": file.filename}

@app.post("/processQuery")
async def process_query(payload: QueryPayload):
    query_text = payload.query
    print(f"Received query: {query_text}")  # Print the query for debugging
    create_table_query = getCreateTableQuery('Test.csv')
    generated_query = generateQuery(create_table_query, query_text)
    print(f"Generated query: {generated_query}")
    
    if generated_query.startswith("Error"):
        return {"error": generated_query}
    else:
        output = executeCursor(generated_query)
        return {"output": output}

if __name__ == "__main__":
    import uvicorn
    load_dotenv()
    uvicorn.run(app, host="127.0.0.1", port=8000)
