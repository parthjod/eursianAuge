import os
from .main import celery, db
from .models.user import User, SocialAccount, ThreatLog
from .models.monitored_account import MonitoredAccount
import openai
from datetime import datetime
import random
import re
from googleapiclient.discovery import build
import uuid # <-- Add this line
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai

# --- Placeholders for API Keys ---
# In a real application, these should be loaded securely, e.g., from environment variables.
openai.api_key = os.environ.get("OPENAI_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

# --- Simulated Social Media Data ---
def get_simulated_activity(platform):
    """Generates some dummy social media activity."""
    comments = [
        "Great post! Thanks for sharing.",
        "I totally disagree with this. You should do more research.",
        "Check out this amazing offer at http://example.com/scam-link",
        "This is hate speech and should be reported.",
        "I'm feeling really down and need someone to talk to."
    ]
    return [{'id': str(uuid.uuid4()), 'text': random.choice(comments)} for _ in range(random.randint(1, 3))]


@celery.task
def monitor_all_accounts():
    """
    Scheduled task to monitor all connected social media accounts for all users.
    """
    users = User.query.all()
    for user in users:
        for account in user.social_accounts:
            monitor_account.delay(account.id)
        for account in user.monitored_accounts:
            monitor_public_instagram_account.delay(account.id)

@celery.task
def monitor_public_instagram_account(account_id):
    """
    Monitors a single public Instagram account for security risks.
    """
    account = MonitoredAccount.query.get(account_id)
    if not account:
        return

    try:
        url = f"https://www.instagram.com/{account.username}/"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        response = requests.get(url, headers=headers)
        response.raise_for_status() # Raise an exception for bad status codes

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract bio and recent posts (this is a simplified example, scraping Instagram is complex)
        bio = soup.find('meta', {'property': 'og:description'})
        bio_content = bio['content'] if bio else ""

        # For demonstration, we'll just use the bio. A real implementation would need to be more robust.
        # and likely use a dedicated Instagram scraping library or a different approach.
        
        if GEMINI_API_KEY:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""Analyze the following Instagram bio for any potential security risks, such as suspicious links, personal information exposure, or signs of a compromised account. Provide a JSON response with a 'summary' and a list of 'risks'.

Bio: {bio_content}"""
            
            gemini_response = model.generate_content(prompt)
            
            # Assuming the response is a JSON string
            security_analysis = gemini_response.text
            
            account.security_status = security_analysis
            account.last_checked = datetime.utcnow()
            db.session.commit()

    except Exception as e:
        print(f"Error monitoring public Instagram account {account.username}: {e}")

@celery.task
def monitor_account(account_id):
    """
    Monitors a single social media account for new activity.
    """
    account = SocialAccount.query.get(account_id)
    if not account:
        return

    # In a real app, you would use the account's access token to call the platform's API.
    # e.g., facebook_api.get_new_comments(account.access_token)
    
    # For now, we'll simulate this.
    activities = get_simulated_activity(account.platform)

    for activity in activities:
        analyze_content.delay(account.id, activity)

@celery.task
def analyze_content(account_id, activity):
    """
    Analyzes a piece of content for threats, including harmful text and malicious URLs.
    """
    account = SocialAccount.query.get(account_id)
    if not account:
        return

    # 1. Analyze text content with OpenAI
    if openai.api_key:
        try:
            response = openai.Moderation.create(input=activity['text'])
            result = response['results'][0]
            if result['flagged']:
                # ... (rest of the OpenAI logic as before)
                pass # For brevity, assuming the previous logic is here
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")

    # 2. Scan for malicious URLs with Google Safe Browsing
    if GOOGLE_API_KEY and account.user.subscription_tier in ['second', 'third']:
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', activity['text'])
        for url in urls:
            scan_url_for_threats.delay(account.id, url)

@celery.task
def scan_url_for_threats(account_id, url):
    """
    Scans a URL using the Google Safe Browsing API.
    """
    account = SocialAccount.query.get(account_id)
    if not account or not GOOGLE_API_KEY:
        return

    try:
        service = build('safebrowsing', 'v4', developerKey=GOOGLE_API_KEY)
        body = {
            'client': {'clientId': 'eurasian-app', 'clientVersion': '1.0.0'},
            'threatInfo': {
                'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                'platformTypes': ['ANY_PLATFORM'],
                'threatEntryTypes': ['URL'],
                'threatEntries': [{'url': url}]
            }
        }
        request = service.threatMatches().find(body=body)
        response = request.execute()

        if 'matches' in response:
            for match in response.get('matches', []):
                threat_type = match.get('threatType', 'UNKNOWN')
                threat = ThreatLog(
                    user_id=account.user_id,
                    platform=account.platform,
                    threat_type='Phishing/Malicious URL',
                    severity='High',
                    description=f"Malicious URL detected: {url} (Type: {threat_type})",
                    detected_at=datetime.utcnow()
                )
                db.session.add(threat)
                db.session.commit()
                send_high_severity_alert.delay(account.user_id, threat.id)

    except Exception as e:
        print(f"Error scanning URL with Google Safe Browsing: {e}")

@celery.task
def send_high_severity_alert(user_id, threat_id):
    """
    Sends an email alert for a high-severity threat.
    """
    user = User.query.get(user_id)
    threat = ThreatLog.query.get(threat_id)
    if not user or not threat:
        return

    # TODO: Implement email sending logic here.
    # You would use a library like Flask-Mail to send an email to user.email.
    print(f"!!! HIGH SEVERITY ALERT for user {user.email} !!!")
    print(f"Threat Details: {threat.description} on {threat.platform}")


@celery.task
def send_weekly_reports():
    """
    Sends weekly summary reports to all users.
    """
    users = User.query.filter(User.subscription_tier.in_(['first', 'second', 'third'])).all()
    for user in users:
        send_user_weekly_report.delay(user.id)

@celery.task
def send_user_weekly_report(user_id):
    """
    Generates and sends a weekly report for a single user.
    """
    user = User.query.get(user_id)
    if not user:
        return

    # TODO: Implement email sending logic here.
    # You would query the ThreatLog for the user's threats in the last week,
    # generate a summary, and email it to the user.
    print(f"--- Sending weekly report to {user.email} ---")
    print("This is a placeholder for the weekly report.")

@celery.task
def list_models():
    """Lists available models."""
    with open("models.txt", "w") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(m.name + "\n")
