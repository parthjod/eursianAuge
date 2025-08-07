from flask import Blueprint, jsonify, request, session
from src.models.user import User, ThreatLog, db
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

def require_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        threats_blocked = ThreatLog.query.filter_by(user_id=user.id, blocked=True).count()
        accounts_protected = sum([
            user.instagram_connected,
            user.twitter_connected,
            user.facebook_connected
        ])

        base_score = 60
        if accounts_protected > 0:
            base_score += 10 * accounts_protected
        if threats_blocked > 0:
            base_score += min(15, threats_blocked)
        security_score = min(100, base_score)

        recent_date = datetime.utcnow() - timedelta(days=7)
        active_alerts = ThreatLog.query.filter(
            ThreatLog.user_id == user.id,
            ThreatLog.severity == 'High',
            ThreatLog.detected_at >= recent_date
        ).count()

        return jsonify({
            'threats_blocked': threats_blocked,
            'accounts_protected': accounts_protected,
            'security_score': security_score,
            'active_alerts': active_alerts
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/threats', methods=['GET'])
def get_recent_threats():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        limit = request.args.get('limit', 10, type=int)
        threats = ThreatLog.query.filter_by(user_id=user.id)\
            .order_by(ThreatLog.detected_at.desc())\
            .limit(limit).all()

        return jsonify({
            'threats': [threat.to_dict() for threat in threats]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/social-accounts', methods=['GET'])
def get_social_accounts():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        return jsonify({
            'instagram': user.instagram_connected,
            'twitter': user.twitter_connected,
            'facebook': user.facebook_connected
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/social-accounts/<platform>/connect', methods=['POST'])
def connect_social_account(platform):
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    if platform not in ['instagram', 'twitter', 'facebook']:
        return jsonify({'error': 'Invalid platform'}), 400

    try:
        if platform == 'instagram':
            user.instagram_connected = True
        elif platform == 'twitter':
            user.twitter_connected = True
        elif platform == 'facebook':
            user.facebook_connected = True

        db.session.commit()

        return jsonify({
            'message': f'{platform.title()} account connected successfully',
            'connected': True
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/social-accounts/<platform>/disconnect', methods=['POST'])
def disconnect_social_account(platform):
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    if platform not in ['instagram', 'twitter', 'facebook']:
        return jsonify({'error': 'Invalid platform'}), 400

    try:
        if platform == 'instagram':
            user.instagram_connected = False
        elif platform == 'twitter':
            user.twitter_connected = False
        elif platform == 'facebook':
            user.facebook_connected = False

        db.session.commit()

        return jsonify({
            'message': f'{platform.title()} account disconnected successfully',
            'connected': False
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/subscription', methods=['GET'])
def get_subscription():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        return jsonify({
            'tier': user.subscription_tier,
            'features': get_tier_features(user.subscription_tier)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@dashboard_bp.route('/subscription', methods=['PUT'])
def update_subscription():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        data = request.json
        if not data or 'tier' not in data:
            return jsonify({'error': 'Missing tier field'}), 400

        tier = data['tier']
        if tier not in ['first', 'second', 'third']:
            return jsonify({'error': 'Invalid subscription tier'}), 400

        user.subscription_tier = tier
        db.session.commit()

        return jsonify({
            'message': 'Subscription updated successfully',
            'tier': tier,
            'features': get_tier_features(tier)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

def get_tier_features(tier):
    features = {
        'first': [
            'Basic monitoring and NLP-based detection',
            'Basic threat monitoring',
            'NLP-based content analysis',
            'Weekly reports',
            'Email alerts'
        ],
        'second': [
            'Everything from First tier',
            'Advanced monitoring with phishing detection',
            'Phishing detection',
            'URL scanning',
            'Real-time alerts',
            'Priority support'
        ],
        'third': [
            'Everything from First and Second tier',
            'Enterprise-grade security with full automation',
            'Advanced threat intelligence',
            'Automated blocking',
            'IP/Domain scanning',
            '24/7 dedicated support'
        ]
    }
    return features.get(tier, [])
