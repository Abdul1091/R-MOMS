#!/user/bin/env python3

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth import AuthService
from app.utils.security import role_required
from app.utils.validators import ValidationError, validate_password
from app.utils.email import send_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        user = AuthService.register_user(data)
        
        # Send a welcome email
        subject = "Welcome to Our Platform!"
        body = "Thank you for signing up. We're excited to have you!"
        send_email(subject, [user.email], body)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    from app.services.auth import AuthService
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = AuthService.authenticate_user(username, password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    tokens = AuthService.create_tokens(user)
    return jsonify({
        'user': user.to_dict(),
        **tokens
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    from app.models.user import User
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    try:
        # Generate password reset token
        token = AuthService.reset_password_request(email)

        if token:
            return jsonify({
                'message': 'Password reset instructions sent. Please check your email.'
            }), 200
        
        # Email not found
        return jsonify({'error': 'Email not found'}), 404
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400
        
    try:
        if AuthService.reset_password(token, new_password):
            return jsonify({'message': 'Password reset successful'}), 200
        return jsonify({'error': 'Invalid or expired token'}), 400
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    from app.models.user import User
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current and new passwords are required'}), 400
        
    if not user.verify_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
        
    try:
        validate_password(new_password)
        user.password = new_password
        user.save()
        
        # Send email notification
        subject = "Password Changed Successfully"
        body = "Your password has been changed successfully. If you did not make this change, please contact support immediately."
        send_email(subject, [user.email], body)
        
        return jsonify({'message': 'Password changed successfully'}), 200
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400