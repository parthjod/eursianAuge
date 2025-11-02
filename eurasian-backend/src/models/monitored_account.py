from .user import db
from datetime import datetime

class MonitoredAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False, default='instagram')
    username = db.Column(db.String(150), nullable=False)
    security_status = db.Column(db.JSON, nullable=True)
    last_checked = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('monitored_accounts', lazy=True))

    def __repr__(self):
        return f'<MonitoredAccount {self.username} for User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'platform': self.platform,
            'username': self.username,
            'security_status': self.security_status,
            'last_checked': self.last_checked.isoformat() if self.last_checked else None,
        }
