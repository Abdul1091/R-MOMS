from datetime import datetime
from app import db
from sqlalchemy.exc import SQLAlchemyError

class ModelValidationError(Exception):
    pass

class BaseModel(db.Model):
    __abstract__ = True

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def validate(self):
        """Override this method in child classes to add validation"""
        pass

    def save(self):
        try:
            self.validate()
            db.session.add(self)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ModelValidationError(f"Database error: {str(e)}")
        except Exception as e:
            db.session.rollback()
            raise ModelValidationError(str(e))

    def delete(self):
        db.session.delete(self)
        db.session.commit()