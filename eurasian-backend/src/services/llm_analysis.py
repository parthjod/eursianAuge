import google.generativeai as genai
import os
import json
import typing_extensions as typing

# Configure API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the latest flash model for speed
model = genai.GenerativeModel('gemini-2.0-flash')

# Define the structured output schema
class ThreatAnalysis(typing.TypedDict):
    is_threat: bool
    risk_score: int
    type: str
    reason: str

def analyze_content(text: str, platform: str = "General") -> ThreatAnalysis:
    """
    Analyzes text for security threats using Gemini, with platform-specific context.
    """
    
    # We give the LLM specific instructions based on the platform
    prompt = f"""
    You are a Cyber Security Agent monitoring {platform}.
    Analyze the following text for security threats (Phishing, Scams, Malware, Harassment, Bot Spam).
    
    TEXT TO ANALYZE: "{text}"
    
    CONTEXT: This is a {platform} post/message.
    
    Respond with a JSON object containing:
    - is_threat: boolean (true if dangerous/spam)
    - risk_score: integer (0-100)
    - type: string (e.g., "Phishing", "Crypto Scam", "Safe", "Hate Speech")
    - reason: string (Short explanation, max 1 sentence)
    """

    try:
        # Generate response forcing JSON mode
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=ThreatAnalysis
            )
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fail safe return
        return {"is_threat": False, "risk_score": 0, "type": "Error", "reason": "Analysis Failed"}