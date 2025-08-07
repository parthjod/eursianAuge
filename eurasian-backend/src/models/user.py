from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)  # Nullable for Google OAuth users
    login_method = db.Column(db.String(20), nullable=False, default='email')  # 'email' or 'google'
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    subscription_tier = db.Column(db.String(20), nullable=True)  # 'first', 'second', 'third'
    
    # Social media connections
    instagram_connected = db.Column(db.Boolean, default=False)
    twitter_connected = db.Column(db.Boolean, default=False)
    facebook_connected = db.Column(db.Boolean, default=False)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'login_method': self.login_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'subscription_tier': self.subscription_tier,
            'instagram_connected': self.instagram_connected,
            'twitter_connected': self.twitter_connected,
            'facebook_connected': self.facebook_connected
        }

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='new')  # 'new', 'reviewed', 'resolved'
    
    def __repr__(self):
        return f'<Feedback {self.subject}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'category': self.category,
            'subject': self.subject,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'status': self.status
        }

class ThreatLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    threat_type = db.Column(db.String(50), nullable=False)  # 'phishing', 'malware', 'suspicious_link'
    platform = db.Column(db.String(20), nullable=False)  # 'instagram', 'twitter', 'facebook'
    severity = db.Column(db.String(10), nullable=False)  # 'low', 'medium', 'high'
    description = db.Column(db.Text, nullable=True)
    detected_at = db.Column(db.DateTime, default=datetime.utcnow)
    blocked = db.Column(db.Boolean, default=True)
    
    user = db.relationship('User', backref=db.backref('threats', lazy=True))
    
    def __repr__(self):
        return f'<ThreatLog {self.threat_type} on {self.platform}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'threat_type': self.threat_type,
            'platform': self.platform,
            'severity': self.severity,
            'description': self.description,
            'detected_at': self.detected_at.isoformat() if self.detected_at else None,
            'blocked': self.blocked
        }

