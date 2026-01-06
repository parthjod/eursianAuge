import requests
import os

# Toggle this to False when you have a real Access Token
MOCK_MODE = True

def get_recent_media_and_comments(page_id, access_token):
    """
    Fetches the latest media and their comments from an IG Business Account.
    """
    if MOCK_MODE:
        # Returns fake data so you can test the AI logic immediately
        return [
            {
                "id": "123_fake_post",
                "caption": "Check out our new product!",
                "comments": {
                    "data": [
                        {"text": "Amazing!", "id": "c1"},
                        {"text": "DM me for free crypto 100% legit", "id": "c2"} # Threat
                    ]
                }
            }
        ]

    # Real Graph API Call
    # We ask for media, and for each media, we ask for its comments (nested request)
    url = f"https://graph.facebook.com/v18.0/{page_id}/media"
    params = {
        'fields': 'id,caption,media_url,timestamp,comments{text,timestamp,username}',
        'access_token': access_token,
        'limit': 5
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('data', [])
    except Exception as e:
        print(f"❌ Error fetching Instagram data: {e}")
        return []