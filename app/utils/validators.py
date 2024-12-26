from email_validator import validate_email, EmailNotValidError
import re

class ValidationError(Exception):
    pass

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValidationError("Password must contain at least one special character")

def validate_email_address(email):
    """Validate email format"""
    try:
        validate_email(email)
    except EmailNotValidError as e:
        raise ValidationError(str(e))