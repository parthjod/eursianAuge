import google.generativeai as genai
import os
import json
import dotenv

# Load environment variables
dotenv.load_dotenv()

# Make sure you set this env var or paste your key here for testing
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
genai.configure(api_key=GEMINI_API_KEY)

def analyze_content(text, content_type="comment"):
    """
    Analyzes text for threats using Gemini.
    Returns a dictionary: {'is_threat': bool, 'risk_score': int, 'reason': str}
    """
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    Act as a cybersecurity expert. Analyze this {content_type}:
    "{text}"
    
    Is this a security threat (phishing, scam, malware, social engineering)?
    Reply in strict JSON format:
    {{
        "is_threat": boolean,
        "risk_score": integer (0-100),
        "reason": "short explanation"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"❌ AI Analysis Failed: {e}")
        # Default fallback (fail safe)
        return {"is_threat": False, "risk_score": 0, "reason": "AI Error"}