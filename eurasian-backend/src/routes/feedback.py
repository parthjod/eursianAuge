from flask import Blueprint, jsonify, request
from src.models.user import Feedback, db
import re

feedback_bp = Blueprint('feedback', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@feedback_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'category', 'subject', 'message']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        name = data['name'].strip()
        email = data['email'].strip().lower()
        category = data['category'].strip()
        subject = data['subject'].strip()
        message = data['message'].strip()
        
        # Validate input
        if not name or len(name) < 2:
            return jsonify({'error': 'Name must be at least 2 characters long'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if category not in ['bug-report', 'feature-request', 'general-feedback', 'support', 'other']:
            return jsonify({'error': 'Invalid category'}), 400
        
        if not subject or len(subject) < 5:
            return jsonify({'error': 'Subject must be at least 5 characters long'}), 400
        
        if not message or len(message) < 10:
            return jsonify({'error': 'Message must be at least 10 characters long'}), 400
        
        # Create feedback entry
        feedback = Feedback(
            name=name,
            email=email,
            category=category,
            subject=subject,
            message=message
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback': feedback.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/feedback', methods=['GET'])
def get_feedback():
    try:
        # This endpoint would typically require admin authentication
        # For now, we'll return all feedback for demonstration
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', None)
        
        query = Feedback.query
        
        if status:
            query = query.filter_by(status=status)
        
        feedback_list = query.order_by(Feedback.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'feedback': [f.to_dict() for f in feedback_list.items],
            'total': feedback_list.total,
            'pages': feedback_list.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/feedback/<int:feedback_id>', methods=['GET'])
def get_feedback_by_id(feedback_id):
    try:
        feedback = Feedback.query.get_or_404(feedback_id)
        return jsonify({'feedback': feedback.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/feedback/<int:feedback_id>/status', methods=['PUT'])
def update_feedback_status(feedback_id):
    try:
        data = request.json
        
        if not data or 'status' not in data:
            return jsonify({'error': 'Missing status field'}), 400
        
        status = data['status']
        if status not in ['new', 'reviewed', 'resolved']:
            return jsonify({'error': 'Invalid status'}), 400
        
        feedback = Feedback.query.get_or_404(feedback_id)
        feedback.status = status
        
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback status updated successfully',
            'feedback': feedback.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

