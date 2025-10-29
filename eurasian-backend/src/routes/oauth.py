from flask import Blueprint, jsonify, request, redirect, url_for, session, current_app
from src.models.user import db, User, SocialAccount
from datetime import datetime, timedelta
import uuid

oauth_bp = Blueprint('oauth', __name__)

def require_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@oauth_bp.route('/initiate/<platform>', methods=['POST'])
def initiate_oauth(platform):
    """
    Initiates the OAuth 2.0 flow for a given platform.
    In a real app, this would redirect to the platform's authorization URL.
    Here, we simulate this by redirecting to a dummy consent page.
    """
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    if platform not in ['instagram', 'twitter', 'facebook']:
        return jsonify({'error': 'Invalid platform'}), 400

    # In a real application, you would generate a state and store it in the session
    # to prevent CSRF attacks.
    session['oauth_state'] = str(uuid.uuid4())
    
    # Simulate the redirect to the platform's consent screen
    # In a real app, this would be the actual authorization URL from the platform's API
    # e.g., 'https://www.facebook.com/v12.0/dialog/oauth?client_id=...&redirect_uri=...&state=...'
    
    # For simulation, we redirect to a simple static HTML page that will act as our consent screen.
    # This page will then redirect back to our callback URL.
    return jsonify({
        'message': 'OAuth flow initiated.',
        'authorization_url': url_for('oauth.simulated_consent_screen', platform=platform, _external=True)
    }), 200

@oauth_bp.route('/consent/<platform>', methods=['GET'])
def simulated_consent_screen(platform):
    """
    A simulated consent screen that asks the user for permission.
    In a real app, this page would be hosted by the social media platform.
    """
    callback_url = url_for('oauth.oauth_callback', platform=platform, _external=True)
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Grant Permission</title>
        <style>
            body {{ font-family: sans-serif; text-align: center; padding-top: 50px; }}
            .container {{ max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }}
            h1 {{ color: #333; }}
            p {{ color: #666; }}
            .btn {{ display: inline-block; padding: 10px 20px; margin: 10px; border-radius: 5px; text-decoration: none; color: white; }}
            .allow {{ background-color: #28a745; }}
            .deny {{ background-color: #dc3545; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Eurasian Security</h1>
            <p>The application <strong>Eurasian</strong> is requesting permission to access your <strong>{platform.capitalize()}</strong> account.</p>
            <p><small>This is a simulated consent screen. In a real application, this would be a page on the social media platform's website.</small></p>
            <div>
                <a href="{callback_url}?code=dummy_auth_code_{platform}&state={session.get('oauth_state')}" class="btn allow">Allow</a>
                <a href="{callback_url}?error=access_denied" class="btn deny">Deny</a>
            </div>
        </div>
    </body>
    </html>
    """

@oauth_bp.route('/callback/<platform>')
def oauth_callback(platform):
    """
    Handles the callback from the OAuth provider.
    In a real app, this would exchange the authorization code for an access token.
    """
    user = require_auth()
    if not user:
        return "Authentication required. Please log in.", 401

    # In a real app, you would validate the 'state' parameter to prevent CSRF attacks.
    if request.args.get('state') != session.pop('oauth_state', None):
        return "Invalid state. CSRF attack detected.", 400

    if 'error' in request.args:
        return f"Access denied by user: {request.args['error']}", 400

    auth_code = request.args.get('code')
    if not auth_code:
        return "Missing authorization code.", 400

    # In a real app, you would make a POST request to the platform's token endpoint
    # to exchange the auth_code for an access token.
    # e.g., requests.post('https://graph.facebook.com/v12.0/oauth/access_token', data={...})

    # For simulation, we'll just generate a dummy access token.
    dummy_access_token = f"simulated_token_{platform}_{str(uuid.uuid4())}"
    dummy_username = f"{user.name.lower()}_{platform}"
    
    # Check if an account for this platform already exists for the user
    social_account = SocialAccount.query.filter_by(user_id=user.id, platform=platform).first()

    if social_account:
        # Update the existing account
        social_account.access_token = dummy_access_token
        social_account.username = dummy_username
        social_account.updated_at = datetime.utcnow()
    else:
        # Create a new social account
        social_account = SocialAccount(
            user_id=user.id,
            platform=platform,
            username=dummy_username,
            access_token=dummy_access_token,
            expires_at=datetime.utcnow() + timedelta(days=60) # Simulate a 60-day token
        )
        db.session.add(social_account)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to save social account for platform {platform}: {e}")
        return "Failed to connect account. Please try again.", 500

    # Redirect user back to the dashboard
    # In a real app, you might want to fetch the user's profile info from the platform's API here.
    return redirect(f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard?connected={platform}")

@oauth_bp.route('/disconnect/<platform>', methods=['POST'])
def disconnect_oauth(platform):
    """
    Disconnects a social media account for the user.
    """
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    social_account = SocialAccount.query.filter_by(user_id=user.id, platform=platform).first()

    if not social_account:
        return jsonify({'error': 'Account not connected'}), 404

    db.session.delete(social_account)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to disconnect social account for platform {platform}: {e}")
        return jsonify({'error': 'Failed to disconnect account'}), 500

    return jsonify({'message': f'Successfully disconnected {platform} account.'}), 200
