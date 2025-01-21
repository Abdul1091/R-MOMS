#!/user/bin/env python3

from flask import Blueprint, jsonify, request
from app.schema.quality_schema import QualityCheckSchema
from marshmallow.exceptions import ValidationError
from app.models.supplier import Supplier, MoisturePricing
from app.models.delivery import Delivery
from app.models.quality import QualityCheck
from app import db
from app.utils.logging_config import logger

# Blueprint for quality control
quality_control_bp = Blueprint('quality_control', __name__)

# Initialize Marshmallow schema
quality_check_schema = QualityCheckSchema()

@quality_control_bp.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        logger.info("Fetching dashboard data")
        
        # Fetch data for the dashboard
        total_checks = QualityCheck.query.count()
        passed_checks = QualityCheck.query.filter_by(quality_check_status='pass').count()
        failed_checks = QualityCheck.query.filter_by(quality_check_status='fail').count()
        partial_checks = QualityCheck.query.filter_by(quality_check_status='partial').count()

        deliveries = Delivery.query.all()
        suppliers = Supplier.query.all()

        quality_stats = {
            'passed': passed_checks,
            'failed': failed_checks,
            'partial': partial_checks,
            'total': total_checks
        }

        response = {
            'quality_stats': quality_stats,
            'deliveries': [delivery.to_dict() for delivery in deliveries],
            'suppliers': [supplier.to_dict() for supplier in suppliers]
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching dashboard data'}), 500


@quality_control_bp.route('/list_quality_check', methods=['GET'])
def quality_checks_list():
    try:
        logger.info("Fetching quality checks list with pagination")

        # Query parameters
        truck_no = request.args.get('truck_no')
        created_at = request.args.get('created_at')
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'asc')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        query = db.session.query(Delivery, QualityCheck).outerjoin(
            QualityCheck, Delivery.id == QualityCheck.delivery_id
        )

        if truck_no:
            query = query.filter(Delivery.truck_no.ilike(f"%{truck_no}%"))
        if created_at:
            query = query.filter(Delivery.created_at == created_at)

        if order == 'desc':
            query = query.order_by(db.desc(getattr(Delivery, sort_by)))
        else:
            query = query.order_by(getattr(Delivery, sort_by))

        # Apply pagination
        paginated_results = query.paginate(page=page, per_page=per_page, error_out=False)

        response = {
            'page': paginated_results.page,
            'per_page': paginated_results.per_page,
            'total_pages': paginated_results.pages,
            'total_items': paginated_results.total,
            'items': [
                {
                    'delivery': delivery.to_dict(),
                    'quality_check': quality_check.to_dict() if quality_check else None
                }
                for delivery, quality_check in paginated_results.items
            ]
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching quality checks list: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching quality checks list'}), 500

@quality_control_bp.route('/list_deliveries', methods=['GET'])
def list_deliveries():
    try:
        deliveries = Delivery.query.all()
        return jsonify([delivery.to_dict() for delivery in deliveries]), 200
    except Exception as e:
        logger.error(f"Error fetching deliveries: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching deliveries'}), 500

@quality_control_bp.route('/quality_check/<int:delivery_id>', methods=['POST'])
def quality_check(delivery_id):
    try:
        logger.info(f"Performing quality check for delivery ID: {delivery_id}")

        delivery = Delivery.query.get_or_404(delivery_id)
        quality_check = QualityCheck.query.filter_by(delivery_id=delivery_id).first()
        moisture_pricing = MoisturePricing.query.first()

        if not moisture_pricing:
            return jsonify({'error': 'Moisture pricing is not set by procurement'}), 400

        if quality_check and quality_check.is_locked:
            return jsonify({'error': 'Quality check already finalized and cannot be edited'}), 400

        # Validate input using Marshmallow
        validated_data = quality_check_schema.load(request.json)

        # Update quality check
        if not quality_check:
            quality_check = QualityCheck(delivery_id=delivery_id)

        for field, value in validated_data.items():
            setattr(quality_check, field, value)

        quality_check.rejected_bags = quality_check.total_bags - quality_check.accepted_bags
        price_per_kg = determine_price(validated_data, moisture_pricing)

        if price_per_kg == 0.0:
            return jsonify({'error': 'Invalid moisture content provided'}), 400

        delivery.price_per_kg = price_per_kg
        delivery.total_value = delivery.net_wgt * price_per_kg
        quality_check.is_locked = True

        # Save both records
        try:
            db.session.add(delivery)
            db.session.add(quality_check)
            db.session.commit()
            return jsonify({'message': 'Quality check updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error: {e}")
            return jsonify({'error': 'Database error occurred'}), 500

    except ValidationError as err:
        return jsonify({'error': 'Invalid input', 'details': err.messages}), 400
    except Exception as e:
        logger.error(f"Error updating quality check for delivery ID {delivery_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'An error occurred while updating quality check'}), 500


def determine_price(quality_data, pricing):
    """Helper function to determine price based on moisture content."""
    if quality_data['moisture_content'] <= pricing.moisture_a:
        return pricing.moisture_a_price
    elif pricing.moisture_a < quality_data['moisture_content'] <= pricing.moisture_b:
        return pricing.moisture_b_price
    elif pricing.moisture_b < quality_data['moisture_content'] <= pricing.moisture_c:
        return pricing.moisture_c_price
    return 0.0