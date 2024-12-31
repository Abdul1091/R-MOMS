from flask import jsonify
from app.models.base import ModelValidationError
from app.utils.validators import ValidationError
from sqlalchemy.exc import SQLAlchemyError

def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({'error': str(e)}), 400

    @app.errorhandler(ModelValidationError)
    def handle_model_validation_error(e):
        return jsonify({'error': str(e)}), 400

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(e):
        return jsonify({'error': 'Database error occurred'}), 500

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({'error': 'Internal server error'}), 500