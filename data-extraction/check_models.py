import os
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

print("--- CHECKING GEMINI MODELS ---")
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    found_gemini = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Available -> {m.name}")
            found_gemini = True
    if not found_gemini:
        print("Your key has no access to content generation models.")
except Exception as e:
    print(f"Gemini Error: {e}")

print("\n--- CHECKING GROK MODELS ---")
try:
    client = OpenAI(
        api_key=os.getenv("XAI_API_KEY"),
        base_url="https://api.x.ai/v1"
    )
    models = client.models.list()
    for m in models.data:
        print(f"Available -> {m.id}")
except Exception as e:
    print(f"Grok Error: {e}")