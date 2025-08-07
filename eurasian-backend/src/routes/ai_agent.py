from flask import Blueprint, jsonify, request, session
from src.models.user import User, ThreatLog, db
from datetime import datetime, timedelta
import random
import json

ai_agent_bp = Blueprint('ai_agent', __name__)

def require_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

# Simulated AI threat detection patterns
THREAT_PATTERNS = {
    'phishing': [
        'suspicious login attempt detected',
        'phishing link shared in DMs',
        'fake verification request',
        'suspicious account trying to access profile'
    ],
    'malware': [
        'malicious file attachment detected',
        'suspicious download link shared',
        'infected media file detected',
        'malware signature found in content'
    ],
    'suspicious_link': [
        'shortened URL with suspicious destination',
        'link to known malicious domain',
        'suspicious redirect detected',
        'potentially harmful website link'
    ],
    'spam': [
        'bulk messaging pattern detected',
        'repetitive content flagged',
        'suspicious follower activity',
        'automated bot behavior detected'
    ]
}

PLATFORMS = ['Instagram', 'Twitter', 'Facebook']
SEVERITIES = ['Low', 'Medium', 'High']

@ai_agent_bp.route('/scan', methods=['POST'])
def trigger_scan():
    """Trigger a manual security scan"""
    try:
        user = require_auth()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.json
        platform = data.get('platform', 'all')
        
        # Simulate AI scanning process
        scan_results = {
            'scan_id': f'scan_{int(datetime.utcnow().timestamp())}',
            'status': 'completed',
            'platform': platform,
            'threats_found': random.randint(0, 5),
            'scan_duration': f'{random.randint(15, 45)} seconds',
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Generate some random threats for demonstration
        if scan_results['threats_found'] > 0:
            threats = []
            for _ in range(scan_results['threats_found']):
                threat_type = random.choice(list(THREAT_PATTERNS.keys()))
                threat_platform = platform if platform != 'all' else random.choice(PLATFORMS)
                severity = random.choice(SEVERITIES)
                description = random.choice(THREAT_PATTERNS[threat_type])
                
                # Create threat log entry
                threat_log = ThreatLog(
                    user_id=user.id,
                    threat_type=threat_type.replace('_', ' ').title(),
                    platform=threat_platform,
                    severity=severity,
                    description=description,
                    blocked=random.choice([True, False])
                )
                
                db.session.add(threat_log)
                threats.append({
                    'type': threat_type,
                    'platform': threat_platform,
                    'severity': severity,
                    'description': description,
                    'blocked': threat_log.blocked
                })
            
            db.session.commit()
            scan_results['threats'] = threats
        
        return jsonify(scan_results), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Scan failed'}), 500

@ai_agent_bp.route('/monitoring/status', methods=['GET'])
def get_monitoring_status():
    """Get current monitoring status"""
    try:
        user = require_auth()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Simulate monitoring status
        status = {
            'active': True,
            'platforms_monitored': [],
            'last_scan': (datetime.utcnow() - timedelta(minutes=random.randint(5, 30))).isoformat(),
            'next_scan': (datetime.utcnow() + timedelta(minutes=random.randint(10, 60))).isoformat(),
            'scan_frequency': '15 minutes',
            'ai_model_version': 'v2.1.3',
            'detection_accuracy': f'{random.randint(92, 98)}%'
        }
        
        # Check connected platforms
        if user.instagram_connected:
            status['platforms_monitored'].append('Instagram')
        if user.twitter_connected:
            status['platforms_monitored'].append('Twitter')
        if user.facebook_connected:
            status['platforms_monitored'].append('Facebook')
        
        return jsonify(status), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get monitoring status'}), 500

@ai_agent_bp.route('/threats/analysis', methods=['GET'])
def get_threat_analysis():
    """Get detailed threat analysis"""
    try:
        user = require_auth()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get threats from database
        threats = ThreatLog.query.filter(
            ThreatLog.user_id == user.id,
            ThreatLog.detected_at >= start_date
        ).all()
        
        # Analyze threat patterns
        analysis = {
            'total_threats': len(threats),
            'blocked_threats': len([t for t in threats if t.blocked]),
            'threat_types': {},
            'platform_breakdown': {},
            'severity_breakdown': {},
            'timeline': [],
            'risk_score': 0
        }
        
        # Count by type, platform, and severity
        for threat in threats:
            # Threat types
            threat_type = threat.threat_type
            analysis['threat_types'][threat_type] = analysis['threat_types'].get(threat_type, 0) + 1
            
            # Platform breakdown
            platform = threat.platform
            analysis['platform_breakdown'][platform] = analysis['platform_breakdown'].get(platform, 0) + 1
            
            # Severity breakdown
            severity = threat.severity
            analysis['severity_breakdown'][severity] = analysis['severity_breakdown'].get(severity, 0) + 1
        
        # Calculate risk score (0-100)
        high_severity = analysis['severity_breakdown'].get('High', 0)
        medium_severity = analysis['severity_breakdown'].get('Medium', 0)
        low_severity = analysis['severity_breakdown'].get('Low', 0)
        
        risk_score = min(100, (high_severity * 10) + (medium_severity * 5) + (low_severity * 2))
        analysis['risk_score'] = risk_score
        
        # Generate timeline data (simplified)
        for i in range(7):  # Last 7 days
            date = datetime.utcnow() - timedelta(days=i)
            day_threats = [t for t in threats if t.detected_at.date() == date.date()]
            analysis['timeline'].append({
                'date': date.date().isoformat(),
                'threats': len(day_threats),
                'blocked': len([t for t in day_threats if t.blocked])
            })
        
        analysis['timeline'].reverse()  # Chronological order
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate threat analysis'}), 500

@ai_agent_bp.route('/settings', methods=['GET', 'PUT'])
def ai_settings():
    """Get or update AI agent settings"""
    try:
        user = require_auth()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        if request.method == 'GET':
            # Return current AI settings (simulated)
            settings = {
                'scan_frequency': '15 minutes',
                'threat_sensitivity': 'medium',
                'auto_block': True,
                'notifications': {
                    'email': True,
                    'push': True,
                    'sms': False
                },
                'monitoring_enabled': True,
                'platforms': {
                    'instagram': user.instagram_connected,
                    'twitter': user.twitter_connected,
                    'facebook': user.facebook_connected
                }
            }
            return jsonify(settings), 200
        
        elif request.method == 'PUT':
            # Update AI settings
            data = request.json
            
            # In a real implementation, these would be stored in the database
            # For now, we'll just return success
            return jsonify({
                'message': 'AI settings updated successfully',
                'settings': data
            }), 200
            
    except Exception as e:
        return jsonify({'error': 'Failed to handle AI settings'}), 500

@ai_agent_bp.route('/reports/generate', methods=['POST'])
def generate_report():
    """Generate a security report"""
    try:
        user = require_auth()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.json
        report_type = data.get('type', 'weekly')
        format_type = data.get('format', 'json')
        
        # Generate report data
        if report_type == 'weekly':
            days = 7
        elif report_type == 'monthly':
            days = 30
        else:
            days = 7
        
        start_date = datetime.utcnow() - timedelta(days=days)
        threats = ThreatLog.query.filter(
            ThreatLog.user_id == user.id,
            ThreatLog.detected_at >= start_date
        ).all()
        
        report = {
            'report_id': f'report_{int(datetime.utcnow().timestamp())}',
            'type': report_type,
            'period': f'{start_date.date()} to {datetime.utcnow().date()}',
            'generated_at': datetime.utcnow().isoformat(),
            'summary': {
                'total_threats': len(threats),
                'blocked_threats': len([t for t in threats if t.blocked]),
                'platforms_monitored': sum([
                    user.instagram_connected,
                    user.twitter_connected,
                    user.facebook_connected
                ]),
                'scan_count': random.randint(50, 200)  # Simulated
            },
            'threats': [threat.to_dict() for threat in threats[-10:]]  # Last 10 threats
        }
        
        return jsonify(report), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate report'}), 500

