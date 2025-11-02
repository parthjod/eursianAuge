import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.feedback import feedback_bp
from src.routes.dashboard import dashboard_bp
from src.routes.ai_agent import ai_agent_bp
from src.routes.oauth import oauth_bp
from src.celery_config import make_celery

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'eurasian-cybersecurity-secret-key-2024'
app.config['broker_url'] = 'redis://localhost:6379/0'
app.config['result_backend'] = 'redis://localhost:6379/0'
app.config['FRONTEND_URL'] = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
app.config.update(
    beat_schedule = {
        'monitor-every-5-minutes': {
            'task': 'src.tasks.monitor_all_accounts',
            'schedule': 300.0
        },
        'send-weekly-reports': {
            'task': 'src.tasks.send_weekly_reports',
            'schedule': 604800.0
        }
    }
)


# Enable CORS for all routes
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(feedback_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(ai_agent_bp, url_prefix='/api/ai-agent')
app.register_blueprint(oauth_bp, url_prefix='/api/oauth')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

celery = make_celery(app)

with app.app_context():
    db.create_all()
    
    # Create some sample threat data for demonstration
    from src.models.user import ThreatLog, User
    from src.models.monitored_account import MonitoredAccount
    
    # Check if we already have sample data
    if ThreatLog.query.count() == 0:
        # Create sample threats for demonstration
        sample_threats = [
            ThreatLog(
                user_id=1,
                threat_type='Phishing',
                platform='Instagram',
                severity='High',
                description='Suspicious phishing attempt detected in DMs'
            ),
            ThreatLog(
                user_id=1,
                threat_type='Suspicious Link',
                platform='Twitter',
                severity='Medium',
                description='Malicious URL detected in tweet'
            ),
            ThreatLog(
                user_id=1,
                threat_type='Malware',
                platform='Facebook',
                severity='High',
                description='Malware attachment detected in message'
            )
        ]
        
        for threat in sample_threats:
            db.session.add(threat)
        
        try:
            db.session.commit()
        except:
            db.session.rollback()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404



