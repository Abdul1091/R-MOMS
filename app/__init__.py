#!/ user/bin/env python3

import os
import logging
from flask import Flask, request, g
from flask_mail import Mail
from dotenv import load_dotenv
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt_identity
from flask_bcrypt import Bcrypt
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()

# Configure the logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def seed_data():
    """Function to seed the database with initial data."""
    from app.models.user import Department, Role  # Import models inside the function to avoid circular imports

    # Seed Departments
    departments = [
        {'name': 'IT', 'description': 'Information Technology'},
        {'name': 'HR', 'description': 'Human Resources'},
        {'name': 'Weighbridge', 'description': 'Weighbridge Department'},
        {'name': 'Procurement', 'description': 'Supplier Management'},
        {'name': 'Quality', 'description': 'Quality Control'},
        {'name': 'Warehouse', 'description': 'Inventory Management'},
        {'name': 'Finance', 'description': 'Finance Department'},
        {'name': 'Production', 'description': 'Production Department'},
        {'name': 'Sales', 'description': 'Sales Department'},
        {'name': 'Marketing', 'description': 'Marketing and Communications'},
    ]

    for dept_data in departments:
        existing_department = Department.query.filter_by(name=dept_data['name']).first()
        if existing_department:
            logger.info(f"Department '{dept_data['name']}' already exists. Skipping.")
        else:
            new_department = Department(name=dept_data['name'], description=dept_data['description'])
            db.session.add(new_department)

    # Seed Roles
    roles = [
        {'name': 'Admin', 'description': 'Administrator role with full access'},
        {'name': 'Manager', 'description': 'Manager role with limited administrative access'},
        {'name': 'Employee', 'description': 'Regular employee role'},
    ]

    for role_data in roles:
        existing_role = Role.query.filter_by(name=role_data['name']).first()
        if existing_role:
            logger.info(f"Role '{role_data['name']}' already exists. Skipping.")
        else:
            new_role = Role(name=role_data['name'], description=role_data['description'])
            db.session.add(new_role)

    try:
        db.session.commit()
        logger.info("Database seeded successfully.")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error seeding database: {str(e)}")

def create_admin_user():
    """Function to create a single admin user with a department."""
    from app.models.user import User, Role, Department

    # Load admin details from environment variables or use defaults
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@test.com')
    admin_password = os.getenv('ADMIN_PASSWORD', 'securepassword')
    admin_username = os.getenv('ADMIN_USERNAME', 'admin')
    admin_department_name = os.getenv('ADMIN_DEPARTMENT', 'IT')

    # Check if the department exists
    admin_department = Department.query.filter_by(name=admin_department_name).first()
    if not admin_department:
        logger.error(f"Department '{admin_department_name}' not found. Please ensure departments are seeded before creating the admin user.")
        return

    # Check if the admin role exists
    admin_role = Role.query.filter_by(name='Admin').first()
    if not admin_role:
        logger.error("Admin role not found.")
        return

    # Check if the admin user already exists
    existing_user = User.query.filter_by(email=admin_email).first()
    if existing_user:
        logger.info(f"Admin user '{admin_email}' already exists. Skipping creation.")
        return

    # Create the admin user
    hashed_password = bcrypt.generate_password_hash(admin_password).decode('utf-8')
    admin_user = User(
        username=admin_username,
        email=admin_email,
        password=hashed_password,
        role_id=admin_role.id,
        department_id=admin_department.id
    )

    try:
        db.session.add(admin_user)
        db.session.commit()
        logger.info(f"Admin user '{admin_email}' created successfully in the '{admin_department_name}' department.")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating admin user: {str(e)}")


def create_app(config_class=Config, testing=False):
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(config_class)
    
    # Load environment variables from .env file
    load_dotenv()

    # Load email configuration from environment variables
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'abdul2kur1@gmail.com')

    # Configure app for testing
    if testing:
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    # Middleware to set the current user
    @app.before_request
    def set_current_user():
        g.current_user = None
        if request.method == 'OPTIONS':
            return  # Skip JWT validation for preflight requests
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            g.current_user = user_id
        except Exception as e:
            logging.warning(f"Failed to set current user: {e}")

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.procurement_route import procurement_bp
    from app.routes.weighbridge_route import weighbridge_bp
    from app.routes.quality_route import quality_control_bp
    from app.routes.warehouse_route import warehouse_bp
    from app.routes.finance_route import finance_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(procurement_bp, url_prefix='/api/procurement')
    app.register_blueprint(weighbridge_bp, url_prefix='/api/weighbridge')
    app.register_blueprint(quality_control_bp, url_prefix='/api/quality_control')
    app.register_blueprint(warehouse_bp, url_prefix='/api/warehouse')
    app.register_blueprint(finance_bp, url_prefix='/api/finance')

    # Register error handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)

    # Create database tables and seed data
    if not testing:
        with app.app_context():
            db.create_all()
            seed_data()
            create_admin_user()

    return app