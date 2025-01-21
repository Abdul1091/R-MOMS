#!/user/bin/env python3

from datetime import datetime, timezone
from flask import g
from app import db

class ModelValidationError(Exception):
    """Custom exception for model validation errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(50), nullable=True)
    updated_by = db.Column(db.String(50), nullable=True)

    def save(self):
        """Save the instance to the database."""
        if not self.created_by:
            self.created_by = self.set_current_user()
        self.updated_by = self.set_current_user()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete the instance from the database."""
        db.session.delete(self)
        db.session.commit()

    def validate(self):
        """
        Base validation method.
        """
        pass

    def to_dict(self):
        """Convert the model to a dictionary"""
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        data['created_by'] = self.created_by
        data['updated_by'] = self.updated_by
        return data
    
    def set_current_user(self):
        """
        Helper function to get the current user from Flask's global context (g).
        Returns the username if set, or 'Unknown' if not authenticated.
        """
        return getattr(g, "current_user", "Unknown")