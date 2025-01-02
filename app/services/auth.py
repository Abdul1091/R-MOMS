from app.utils.validators import validate_password, validate_email_address, ValidationError
from app.models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token
from itsdangerous import URLSafeTimedSerializer
from app.utils.email import send_email
from app.utils.tokens import generate_reset_token, verify_reset_token
# import logging

class AuthService:
    @staticmethod
    def register_user(data):
        validate_email_address(data['email'])
        validate_password(data['password'])

        if User.query.filter_by(email=data['email']).first():
            raise ValidationError('Email already registered')
        if User.query.filter_by(username=data['username']).first():
            raise ValidationError('Username already taken')

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

    @staticmethod
    def authenticate_user(username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.verify_password(password):
            return user
        return None

    @staticmethod
    def create_tokens(user):
        return {
            'access_token': create_access_token(identity=str(user.id)),
            'refresh_token': create_refresh_token(identity=str(user.id)),
        }

    @staticmethod
    def reset_password_request(email):
        user = User.query.filter_by(email=email).first()
        if not user:
            return None

        token = generate_reset_token(user)
        reset_link = f"http://frontend-url/reset-password?token={token}"

        send_email(
            subject="Reset Your Password",
            recipients=[email],
            body=f"Click the link to reset your password: {reset_link}\nThis link will expire in 1 hour."
        )

    @staticmethod
    def reset_password(token, new_password):
        email = verify_reset_token(token)
        if not email:
            return False

        user = User.query.filter_by(email=email).first()
        if not user:
            return False

        validate_password(new_password)
        user.password = new_password
        user.save()

        send_email(
            subject="Password Changed Successfully",
            recipients=[email],
            body="Your password has been changed successfully. If you did not initiate this change, contact support immediately."
        )
        return True