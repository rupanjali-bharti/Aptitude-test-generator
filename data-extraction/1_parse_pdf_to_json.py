import os
import json
import re
import time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-2.5-flash') 

def automated_batch_extraction(pdf_path, topic_name, total_questions_needed=60, batch_size=15):
    print(f"1. Uploading {pdf_path} to Gemini's servers...")
    uploaded_file = genai.upload_file(path=pdf_path)
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
                "difficulty": "Medium",
                "explanation": "Step by step explanation from the solutions section"
              }}
            ]
            """
            
            response = gemini_model.generate_content([system_prompt, uploaded_file])
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
        genai.delete_file(uploaded_file.name)
        print("\nCleaned up file from Google servers.")
        
    return all_extracted_questions

if __name__ == "__main__":
    os.makedirs("outputs", exist_ok=True)
    
    # Change these to whichever PDF you are currently processing!
    pdf_file = "pdf_assets/partnership.pdf" 
    topic_name = "partnership"
    
    if not os.path.exists(pdf_file):
        print(f"Please place {pdf_file} in the directory.")
    else:
        # Grabs 60 questions total, 15 at a time. Change 60 to 100 if you want more!
        final_json = automated_batch_extraction(pdf_file, topic_name, total_questions_needed=60, batch_size=15)
        
        if final_json:
            output_path = f"outputs/{topic_name}_massive.json"
            with open(output_path, "w") as f:
                json.dump(final_json, f, indent=4)
            print(f"\n🎉 SUCCESS! Saved {len(final_json)} questions to {output_path}")