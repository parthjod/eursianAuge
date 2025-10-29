import os
from .main import celery, db
from .models.user import User, SocialAccount, ThreatLog
import openai
from datetime import datetime
import random
import re
from googleapiclient.discovery import build
import uuid # <-- Add this line

# --- Placeholders for API Keys ---
# In a real application, these should be loaded securely, e.g., from environment variables.
openai.api_key = os.environ.get("OPENAI_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

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