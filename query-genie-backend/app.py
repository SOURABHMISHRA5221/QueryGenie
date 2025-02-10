from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from service.queryGenerator import generateQuery
from service.queryExecutor import executeCursor,getCreateTableQuery


app = FastAPI()

class QueryPayload(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Hello from Server"}

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
    if ( generated_query.startswith("Error") ):
        return {"error": generated_query}
    else:
        output = executeCursor(generated_query)
        return {"output": output}
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
