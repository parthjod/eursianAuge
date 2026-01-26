from dotenv import load_dotenv
load_dotenv()
from src.services.instagram_service import get_recent_media_and_comments
from src.services.twitter_service import fetch_twitter_mentions
from src.services.llm_analysis import analyze_content
import os
import time


# If using Celery, uncomment the import and decorator below
# from celery import shared_task
# @shared_task

def run_social_media_scan(page_id, access_token):
    print(f"🔍 Starting Multi-Platform Scan...")
    
    threat_count = 0

    # 1. INSTAGRAM SCAN
    print(f"\n📸 Checking Instagram (Page ID: {page_id})...")
    # Note: If using the 'Private' scraper, page_id/token might be ignored inside the service, 
    # but we keep them here for compatibility.
    posts = get_recent_media_and_comments(page_id, access_token)
    print(f"📥 Found {len(posts)} recent posts.")

    for post in posts:
        if 'comments' in post and 'data' in post['comments']:
            comments = post['comments']['data']
            for comment in comments:
                text = comment.get('text', '')
                
                # Analyze
                analysis = analyze_content(text, platform="Instagram Comment")
                time.sleep(2) # Rate limit safety

                if analysis['is_threat']:
                    threat_count += 1
                    print(f"\n🚨 [INSTAGRAM] THREAT: '{text}'")
                    print(f"   Score: {analysis['risk_score']}/100")
                    print(f"   Reason: {analysis['reason']}")
                    # TODO: save_threat_to_db("Instagram", text, analysis)
                else:
                    print(f"✅ [INSTAGRAM] Safe: {text[:20]}...")

    # 2. TWITTER SCAN
    print(f"\n🐦 Checking Twitter Mentions...")
    try:
        # No args needed here, it grabs keys from .env
        tweets = fetch_twitter_mentions()
        print(f"📥 Found {len(tweets)} mentions.")

        for tweet in tweets:
            text = tweet.get('text', '')
            
            # Analyze
            analysis = analyze_content(text, platform="Twitter Mention")
            time.sleep(2) # Rate limit safety

            if analysis['is_threat']:
                threat_count += 1
                print(f"\n🚨 [TWITTER] THREAT: '{text}'")
                print(f"   Score: {analysis['risk_score']}/100")
                print(f"   Reason: {analysis['reason']}")
                # TODO: save_threat_to_db("Twitter", text, analysis)
            else:
                print(f"✅ [TWITTER] Safe: {text[:20]}...")
                
    except Exception as e:
        print(f"⚠️ Twitter Scan Failed (Check your keys): {e}")

    print(f"\n🏁 Scan Complete. Total Threats Found: {threat_count}")

# --- MANUAL TEST TRIGGER ---
if __name__ == "__main__":
    # Dummy credentials for testing
    TEST_ID = "12345"
    TEST_TOKEN = "test_token"
    run_social_media_scan(TEST_ID, TEST_TOKEN)