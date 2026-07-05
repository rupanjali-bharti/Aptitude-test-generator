import os
import json
import re
import time
from dotenv import load_dotenv
from google import genai  # Modern google-genai SDK

load_dotenv()

# Initialize the client using the modern SDK
client = genai.Client()
MODEL_NAME = 'gemini-2.5-flash-lite'

def automated_batch_extraction(pdf_path, topic_name, total_questions_needed=120, batch_size=15):
    print(f"1. Uploading {pdf_path} to Gemini's servers...")
    uploaded_file = client.files.upload(file=pdf_path)
    time.sleep(3) # Wait for processing
    
    all_extracted_questions = []
    
    try:
        # Loop through in batches (e.g., 1-15, 16-30, 31-45, 46-60)
        for start_num in range(1, total_questions_needed + 1, batch_size):
            end_num = min(start_num + batch_size - 1, total_questions_needed)
            
            print(f"\n-> Asking Gemini to extract questions {start_num} to {end_num}...")
            
            system_prompt = f"""
            You are a data extraction AI. Look at the attached scanned textbook pages for '{topic_name}'.
            Extract exactly questions {start_num} through {end_num}, matching them with their solutions.
            Return ONLY a valid JSON array matching this exact schema:
            [
              {{
                "topic": "{topic_name}",
                "question": "The question text",
                "options": {{"a": "opt1", "b": "opt2", "c": "opt3", "d": "opt4"}},
                "correct_answer": "a",
                "difficulty": "Pending",
                "explanation": "Step by step explanation from the solutions section"
              }}
            ]
            """
            
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[system_prompt, uploaded_file]
            )
            match = re.search(r'\[.*\]', response.text, re.DOTALL)
            
            if match:
                batch_json = json.loads(match.group(0))
                all_extracted_questions.extend(batch_json)
                print(f"✅ Successfully grabbed {len(batch_json)} questions. Total so far: {len(all_extracted_questions)}")
            else:
                print(f"❌ Gemini failed on batch {start_num}-{end_num}. Skipping.")
                
            # Sleep to prevent hitting API rate limits (Too Many Requests)
            time.sleep(5) 
            
    except Exception as e:
        print(f"\n❌ Script failed: {e}")
    finally:
        # File deletion via the updated API client layout
        client.files.delete(name=uploaded_file.name)
        print("\nCleaned up file from Google servers.")
        
    # --- PROPORTIONAL DIFFICULTY MAPPING (0.3 / 0.7 method) ---
    total_extracted = len(all_extracted_questions)
    if total_extracted > 0:
        print(f"\n2. Applying dynamic difficulty mapping to all {total_extracted} questions...")
        
        easy_limit = int(total_extracted * 0.3)
        medium_limit = int(total_extracted * 0.7) 
        
        for i, question in enumerate(all_extracted_questions):
            if i < easy_limit:
                question["difficulty"] = "Easy"
            elif i < medium_limit:
                question["difficulty"] = "Medium"
            else:
                question["difficulty"] = "Difficult"
                
        print("✅ Difficulty assignment complete.")
        
    return all_extracted_questions

if __name__ == "__main__":
    os.makedirs("outputs", exist_ok=True)
    
    # Target PDF file configurations
    pdf_file = "pdf_assets/time_work.pdf" 
    topic_name = "time_work"
    
    if not os.path.exists(pdf_file):
        print(f"Please place {pdf_file} in the directory.")
    else:
        # Grabs 60 questions total, 15 at a time.
        final_json = automated_batch_extraction(pdf_file, topic_name, total_questions_needed=120, batch_size=15)
        
        if final_json:
            output_path = f"outputs/{topic_name}.json"
            with open(output_path, "w") as f:
                json.dump(final_json, f, indent=4)
            print(f"\n🎉 SUCCESS! Saved {len(final_json)} questions to {output_path}")