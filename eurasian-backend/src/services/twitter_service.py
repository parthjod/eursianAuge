import tweepy
import os

def get_twitter_client():
    """
    Initializes the Twitter v2 Client using credentials from .env
    """
    return tweepy.Client(
        bearer_token=os.getenv("TWITTER_BEARER_TOKEN"),
        consumer_key=os.getenv("TWITTER_API_KEY"),
        consumer_secret=os.getenv("TWITTER_API_SECRET"),
        access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
        access_token_secret=os.getenv("TWITTER_ACCESS_SECRET")
    )

def fetch_twitter_mentions():
    """
    Fetches the last 5 mentions of the user to scan for spam/scams.
    """
    client = get_twitter_client()
    
    try:
        # 1. Get My User ID
        # We need the numeric ID of the authenticated user to ask for their mentions
        me = client.get_me()
        if not me.data:
            print("❌ Error: Could not verify Twitter credentials.")
            return []
            
        my_id = me.data.id
        
        # 2. Get Mentions
        # tweet_fields=['created_at', 'author_id'] gives us extra data for the AI
        response = client.get_users_mentions(
            id=my_id,
            max_results=5,
            tweet_fields=['created_at', 'author_id', 'text']
        )
        
        if not response.data:
            print("✅ No new mentions found.")
            return []
            
        # 3. Format for our Agent
        formatted_tweets = []
        for tweet in response.data:
            formatted_tweets.append({
                "platform": "Twitter",
                "type": "Mention",
                "text": tweet.text,
                "id": tweet.id,
                "author_id": tweet.author_id, # Converting ID to username requires an extra API call
                "timestamp": tweet.created_at
            })
            
        return formatted_tweets

    except Exception as e:
        print(f"❌ Twitter API Error: {e}")
        return []