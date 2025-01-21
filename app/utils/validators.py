#!/user/bin/env python3

from email_validator import validate_email, EmailNotValidError
import re

class ValidationError(Exception):
    pass

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        raise ValidationError(
            "Password must be at least 8 characters long"
            )
    if not re.search(r"[A-Z]", password):
        raise ValidationError(
            "Password must contain at least one uppercase letter"
            )
    if not re.search(r"[a-z]", password):
        raise ValidationError(
            "Password must contain at least one lowercase letter"
            )
    if not re.search(r"\d", password):
        raise ValidationError(
            "Password must contain at least one number"
            )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValidationError(
            "Password must contain at least one special character"
            )

def validate_email_address(email):
    """Validate email format"""
    try:
        validate_email(email)
    except EmailNotValidError as e:
        raise ValidationError(str(e))
    
# Procurement data validation
def validate_procurement_data(data):
    """Validate procurement data"""
    if not data:
        raise ValidationError(
            'No data provided'
            )

    # Check for required fields
    required_fields = [
        'item_name',
        'quantity', 'price'
        ]
    for field in required_fields:
        if field not in data:
            raise ValidationError(
                f'Missing {field} in request data'
                )

    # Validate quantity (should be a positive integer)
    if not isinstance(data['quantity'], int) or data['quantity'] <= 0:
        raise ValidationError(
            'Quantity must be a positive integer'
            )

    # Validate price (should be a positive number)
    if not isinstance(data['price'], (int, float)) or data['price'] <= 0:
        raise ValidationError(
            'Price must be a positive number'
            )

    return True