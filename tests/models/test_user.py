#!/user/bin/env python3

import pytest
from app.models.user import User, ModelValidationError
from app import db, bcrypt

def test_user_save(app, mock_user_data):
    """
    Test saving a user instance to the database.
    """
    with app.app_context():
        user = User(**mock_user_data)
        user.password = mock_user_data["password"]
        user.save()

        saved_user = User.query.filter_by(username=mock_user_data["username"]).first()
        assert saved_user is not None
        assert saved_user.email == mock_user_data["email"]

def test_user_validation():
    """
    Test user validation raises errors for invalid data.
    """
    user = User(username="tu", email="invalidemail")
    with pytest.raises(ModelValidationError):
        user.validate()

def test_password_hashing():
    """
    Test that the password is hashed and verified correctly.
    """
    user = User(username="secureuser", email="secure@test.com")
    user.password = "mysecurepassword"

    assert bcrypt.check_password_hash(user.password_hash, "mysecurepassword")
    assert user.verify_password("mysecurepassword")
    assert not user.verify_password("wrongpassword")

def test_user_to_dict(app, mock_user_data):
    """
    Test the user model's to_dict method.
    """
    with app.app_context():
        user = User(**mock_user_data)
        user.password = mock_user_data["password"]
        user.save()

        user_dict = user.to_dict()
        assert user_dict["username"] == mock_user_data["username"]
        assert user_dict["email"] == mock_user_data["email"]
        assert "password_hash" not in user_dict