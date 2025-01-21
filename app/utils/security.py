#!/user/bin/env python3

from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def department_required(departments):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            if user.department.name not in departments:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def role_required(roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            if user.role.name not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator