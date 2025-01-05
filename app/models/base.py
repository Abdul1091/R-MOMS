from datetime import datetime
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(50), nullable=True)  # Username of creator
    updated_by = db.Column(db.String(50), nullable=True)  # Username of last updater

    def save(self):
        """Save the instance to the database."""
        if not self.created_by:
            self.created_by = self._get_current_user()
        self.updated_by = self._get_current_user()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete the instance from the database."""
        db.session.delete(self)
        db.session.commit()

    def validate(self):
        """
        Base validation method.
        Override in child models to add specific validations.
        """
        pass  # Default: no validation

    def _get_current_user(self):
        """Retrieve the current user's username from Flask's global context (g)."""
        return getattr(g, 'current_user', 'Unknown')

    def to_dict(self):
        """Convert the model to a dictionary, including audit information."""
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        data['created_by'] = self.created_by
        data['updated_by'] = self.updated_by
        return data