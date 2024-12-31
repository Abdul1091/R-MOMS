from app.utils.validators import validate_password, validate_email_address, ValidationError
from app.models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import datetime, timedelta
import secrets

class AuthService:
    @staticmethod
    def register_user(data):
        try:
            # Validate input
            validate_email_address(data['email'])
            validate_password(data['password'])
            
            # Check existing user
            if User.query.filter_by(email=data['email']).first():
                raise ValidationError('Email already registered')
            if User.query.filter_by(username=data['username']).first():
                raise ValidationError('Username already taken')
            
            # Create user
            user = User(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                department_id=data.get('department_id'),
                role_id=data.get('role_id')
            )
            user.password = data['password']
            user.save()
            
            return user
            
        except ValidationError as e:
            raise ValidationError(str(e))
        except Exception as e:
            raise Exception(f'Error creating user: {str(e)}')
        
    @staticmethod
    def authenticate_user(username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.verify_password(password):
            return user
        return None

    @staticmethod
    def create_tokens(user):
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
    @staticmethod
    def reset_password_request(email):
        user = User.query.filter_by(email=email).first()
        if user:
            # Generate reset token
            reset_token = secrets.token_urlsafe(32)
            user.reset_token = reset_token
            user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
            user.save()
            
            # In a real application, you would send an email here
            return reset_token
        return None
    
    @staticmethod
    def reset_password(token, new_password):
        user = User.query.filter_by(reset_token=token).first()
        if user and user.reset_token_expires > datetime.utcnow():
            validate_password(new_password)
            user.password = new_password
            user.reset_token = None
            user.reset_token_expires = None
            user.save()
            return True
        return False