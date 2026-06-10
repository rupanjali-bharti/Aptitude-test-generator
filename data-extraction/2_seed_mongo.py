import os
import json
from dotenv import load_dotenv
from pymongo import MongoClient

# Load env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

def seed_database(json_file_path):
    print(f"Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    
    # Create or connect to your database and collection
    db = client['aptitude_db']
    collection = db['questions']
    
    print(f"Reading {json_file_path}...")
    with open(json_file_path, 'r') as file:
        questions_data = json.load(file)
        
    if not isinstance(questions_data, list):
        print("Error: JSON file should contain an array of questions.")
        return

    print(f"Inserting {len(questions_data)} questions into the database...")
    # Insert many documents at once
    result = collection.insert_many(questions_data)
    
    print(f"Successfully inserted {len(result.inserted_ids)} records!")
    
    # Create Indexes for fast querying in the backend
    collection.create_index("topic")
    collection.create_index("difficulty")
    print("Database indexes created successfully.")

if __name__ == "__main__":
    target_json = "outputs/number_system.json"
    
    if os.path.exists(target_json):
        seed_database(target_json)
    else:
        print(f"File not found: {target_json}. Please run the extraction script first.")