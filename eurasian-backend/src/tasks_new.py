from src.services.instagram_service import get_recent_media_and_comments
from src.services.llm_analysis import analyze_content
import os
import time

# If using Celery, uncomment the import and decorator below
# from celery import shared_task
# @shared_task

def run_instagram_scan(page_id, access_token):
    print(f"🔍 Starting scan for Page ID: {page_id}")
    
    # 1. Fetch Data (The Hands)
    posts = get_recent_media_and_comments(page_id, access_token)
    print(f"📥 Found {len(posts)} recent posts.")

    threat_count = 0

    # 2. Iterate (The Loop)
    for post in posts:
        # Check if post has comments
        if 'comments' in post and 'data' in post['comments']:
            comments = post['comments']['data']
            
            for comment in comments:
                text = comment.get('text', '')
                
                # 3. Analyze (The Brain)
                analysis = analyze_content(text)
                time.sleep(4)
                # 4. Action (The Verdict)
                if analysis['is_threat']:
                    threat_count += 1
                    print(f"\n🚨 THREAT DETECTED in comment: '{text}'")
                    print(f"   Score: {analysis['risk_score']}/100")
                    print(f"   Reason: {analysis['reason']}")
                    # TODO: Here is where you would save to database:
                    # save_threat_to_db(post['id'], text, analysis)
                else:
                    print(f"✅ Safe: {text[:20]}...")

    print(f"\n🏁 Scan Complete. Found {threat_count} threats.")

# --- MANUAL TEST TRIGGER ---
# This allows you to run this file directly like "python src/tasks.py"
# without needing Celery running yet.
if __name__ == "__main__":
    # Dummy credentials for testing
    TEST_ID = "12345"
    TEST_TOKEN = "test_token"
    run_instagram_scan(TEST_ID, TEST_TOKEN)