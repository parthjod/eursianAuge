import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"🔑 Checking key: {api_key[:10]}... (hidden)") 

if not api_key:
    print("❌ ERROR: No API Key found.")
else:
    genai.configure(api_key=api_key)
    
    print("\n📡 Connecting to Google to fetch available models...")
    try:
        count = 0
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"   ✅ Found: {m.name}")
                count += 1
        
        if count == 0:
            print("⚠️ Connected, but no text generation models found. Check your API Key permissions.")
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}")