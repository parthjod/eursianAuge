from flask import Blueprint, jsonify, request
from src.models.monitored_account import MonitoredAccount
from src.models.user import db

ai_agent_bp = Blueprint('ai_agent', __name__)

@ai_agent_bp.route('/monitored-accounts', methods=['GET', 'POST', 'DELETE'])
def handle_monitored_accounts():
    if request.method == 'POST':
        from src.tasks import monitor_public_instagram_account
        data = request.get_json()
        user_id = data.get('user_id')
        username = data.get('username')

        if not user_id or not username:
            return jsonify({'error': 'Missing user_id or username'}), 400

        # Check if the account is already monitored for this user
        existing_account = MonitoredAccount.query.filter_by(user_id=user_id, username=username).first()
        if existing_account:
            return jsonify({'error': 'Account already monitored'}), 400

        new_account = MonitoredAccount(user_id=user_id, username=username)
        db.session.add(new_account)
        db.session.commit()

        # Trigger the analysis task
        monitor_public_instagram_account.delay(new_account.id)

        return jsonify(new_account.to_dict()), 201
    
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400

        accounts = MonitoredAccount.query.filter_by(user_id=user_id).all()
        return jsonify([account.to_dict() for account in accounts])

    if request.method == 'DELETE':
        data = request.get_json()
        account_id = data.get('account_id')

        if not account_id:
            return jsonify({'error': 'Missing account_id'}), 400

        account = MonitoredAccount.query.get(account_id)
        if not account:
            return jsonify({'error': 'Account not found'}), 404

        db.session.delete(account)
        db.session.commit()

        return jsonify({'message': 'Account removed successfully'}), 200

@ai_agent_bp.route('/monitored-accounts/<int:account_id>', methods=['GET'])
def get_monitored_account(account_id):
    account = MonitoredAccount.query.get(account_id)
    if not account:
        return jsonify({'error': 'Account not found'}), 404
    return jsonify(account.to_dict())