#!/user/bin/env python3

from app import db, bcrypt
from app.models.base import BaseModel, ModelValidationError
from app.utils.validators import validate_email_address, ValidationError

class Role(BaseModel):
    __tablename__ = 'roles'

    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    users = db.relationship('User', backref='role', lazy=True)

class Department(BaseModel):
    __tablename__ = 'departments'

    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    users = db.relationship('User', backref='department', lazy=True)

class User(BaseModel):
    __tablename__ = 'users'

    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_picture = db.Column(db.String(200), nullable=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    is_active = db.Column(db.Boolean, default=True)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def validate(self):
        if not self.username or len(self.username) < 3:
            raise ModelValidationError("Username must be at least 3 characters long")
            
        if not self.email:
            raise ModelValidationError("Email is required")
            
        try:
            validate_email_address(self.email)
        except ValidationError as e:
            raise ModelValidationError(str(e))
            
        if not self.password_hash:
            raise ModelValidationError("Password is required")

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
            'department': self.department.name if self.department else None,
            'role': self.role.name if self.role else None,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'updated_by': self.updated_by,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }