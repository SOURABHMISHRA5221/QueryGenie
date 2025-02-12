import sqlite3
import pandas as pd
import random

conn = sqlite3.connect('tables.db') # Connecting to the database
cursor = conn.cursor() 

def getCreateTableQuery(csvFile):
    df = pd.read_csv(csvFile)
    table_name = 'table'+str(random.randint(1, 100000))
    columns_with_types = ", ".join([f"{col.replace(' ', '_')} TEXT" for col in df.columns])
    create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_with_types});"
    cursor.execute(create_table_query)
    cursor.fetchall()
    for index, row in df.iterrows():
        values = ", ".join([f'"{row_item}"' for row_item in row])
        insert_sql = f"INSERT INTO {table_name} ({', '.join(df.columns.str.replace(' ', '_'))}) VALUES ({values})"
        cursor.execute(insert_sql)
    return create_table_query

import csv

def executeCursor(text, filename="output.csv"):
    cursor.execute(text)
    results = cursor.fetchall()

    # Ensure there are results before accessing cursor.description
    if not results:
        return "No results found."

    column_names = [description[0] for description in cursor.description]
    
    output = ",".join(column_names) + "\n"  # Join column names with commas
    
    # Write to CSV file
    with open(filename, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(column_names)  # Write header
        writer.writerows(results)  # Write data rows

    # Append each row as a comma-separated line to output string
    for row in results:
        output += ",".join(map(str, row)) + "\n"
    
    return output
