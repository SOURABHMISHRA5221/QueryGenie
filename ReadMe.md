# Query Genie

## Frontend

- [Query Genie App](https://query-genie.vercel.app/)
- [Query Genie API](https://querygenie-496094639433.us-central1.run.app)

## Backend

- [Query Genie Backend](https://queryginnebackend-496094639433.us-central1.run.app)

## Description

So, here we go...

The project is in its very early stages and currently does the following:

### a) File-based Querying

It allows interaction with your file (currently only `.csv`, but support for more formats like XML, JSON, etc., is being added).

#### How does it work?

- The file is stored as an SQL table.
- When a user enters a query, an LLM is provided with two key inputs:
  - The column names.
  - The user query.
- If the column names are expressive enough, the LLM can generate an accurate SQL query.
- This SQL query is then executed on the stored data, and the results are made available for download.

#### Observations

- Providing expressive column names helps the LLM map the user’s natural language query to the correct columns.
- If we can also supply the data types of the columns, the query generation improves significantly, leading to better results.
- Based on this observation, we could perform schema analysis to infer data types more effectively.

### b) MongoDB Query Generation

It helps generate queries for MongoDB (currently, only Genuine MongoDB, not Azure Cosmos).

#### How does it work?

- We ask the user for the connection string, database name, and collection names (supporting multiple collections).
- We perform schema analysis to understand the data types better.
- We feed the schema analysis and user query to the LLM for query generation.

#### Observations

- Similar to file-based querying, having expressive column names and knowing data types significantly improves query generation.

#### Clarification

**Why do I ask users for the database and collection names instead of relying on LLMs or RAG techniques?**

After reviewing multiple articles on text-to-query systems (notably, Uber’s QueryGPT case study), I found that retrieving the correct database and collection names is challenging for LLMs and RAG-based approaches. This difficulty arises primarily due to the expressiveness (or lack thereof) of names. For now, I have chosen to leave this task to users to ensure accuracy.
