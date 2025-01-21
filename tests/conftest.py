import pytest
from app import create_app, db

@pytest.fixture(scope="module")
def app():
    """
    Fixture to create a Flask application instance for testing.
    """
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope="module")
def client(app):
    """
    Fixture to create a test client for the application.
    """
    return app.test_client()

@pytest.fixture
def mock_user_data():
    """
    Fixture to provide mock user data.
    """
    return {
        "username": "existinguser",
        "email": "existing@test.com",
        "password": "securepassword",
        "first_name": "User",
        "last_name": "Test",
        "profile_picture": "https://profile.png",
        "department_id": "1",
        "role_id": "1",
    }