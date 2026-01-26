import os
import requests
from flask import Flask, request, redirect
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

FB_CLIENT_ID = os.getenv("FB_CLIENT_ID")
FB_CLIENT_SECRET = os.getenv("FB_CLIENT_SECRET")
FB_REDIRECT_URI = os.getenv("FB_REDIRECT_URI") 

@app.route("/")
def home():
    # 2. Construct Authorization URL

    auth_url = (
        f"https://www.facebook.com/v19.0/dialog/oauth?"
        f"client_id={FB_CLIENT_ID}&"
        f"redirect_uri={FB_REDIRECT_URI}&"
        f"scope=user_posts,public_profile&"
        f"response_type=code"
    )
    return f'<a href="{auth_url}">CLICK HERE TO LOGIN WITH FACEBOOK</a>'

@app.route("/callback")
def callback():
    code = request.args.get("code")
    
    # 3. Exchange Code for Access Token
    token_url = (
        f"https://graph.facebook.com/v19.0/oauth/access_token?"
        f"client_id={FB_CLIENT_ID}&"
        f"redirect_uri={FB_REDIRECT_URI}&"
        f"client_secret={FB_CLIENT_SECRET}&"
        f"code={code}"
    )
    
    token_resp = requests.get(token_url).json()
    access_token = token_resp.get("access_token")
    
    if not access_token:
        return f"Error getting token: {token_resp}"
    
    # 4. Fetch Data
    graph_url = "https://graph.facebook.com/v19.0/me/feed"
    params = {
        "access_token": access_token,
        "fields": "id,message,created_time,comments{message,from}",
        "limit": 5
    }
    
    data_resp = requests.get(graph_url, params=params).json()
    
    print("\n\n=============== FACEBOOK DATA ===============")
    print(data_resp)
    print("=============================================\n")
    
    return "Data fetched! Check your VS Code terminal."

if __name__ == "__main__":
    app.run(port=5000, debug=True)