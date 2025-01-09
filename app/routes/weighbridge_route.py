from flask import Blueprint, jsonify, request
from app.models.supplier import Supplier, Wallet, MoisturePricing
from app.models.delivery import Delivery
from app import db
from datetime import datetime
import logging
from app.utils.security import role_required, department_required
from marshmallow import Schema, fields, ValidationError

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

weighbridge_bp = Blueprint('weighbridge', __name__)

# Schema for input validation
class DeliverySchema(Schema):
    supplier_id = fields.Int(required=True)
    quantity = fields.Int(required=True)
    gross_wgt = fields.Int(required=True)
    tar_wgt = fields.Int(required=True)
    truck_no = fields.Str(required=False)
    driver_nm = fields.Str(required=False)
    driver_no = fields.Str(required=False)

# Dashboard route that returns data in JSON format
@weighbridge_bp.route('/dashboard')
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Weighbridge', 'IT'])
def dashboard():
    try:
        total_deliveries = Delivery.query.count()
        total_suppliers = Supplier.query.count()
        total_weight = db.session.query(db.func.sum(Delivery.net_wgt)).scalar() or 0
        deliveries = Delivery.query.all()

        deliveries_info = [d.to_dict() for d in deliveries]

        return jsonify({
            "total_deliveries": total_deliveries,
            "total_suppliers": total_suppliers,
            "total_weight": total_weight,
            "deliveries_info": deliveries_info
        })
    except Exception as e:
        logger.error(f"Error in dashboard route: {e}")
        return jsonify({"error": "An error occurred while fetching the data"}), 500

# Deliveries listing
@weighbridge_bp.route('/deliveries', methods=['GET'])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Weighbridge', 'IT'])
def list_deliveries():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'asc')

        valid_sort_columns = ['created_at', 'id', 'gross_wgt', 'tar_wgt', 'net_wgt', 'total_price']
        if sort_by not in valid_sort_columns:
            return jsonify({"success": False, "error": "Invalid sort column."}), 400

        query = db.session.query(Delivery)
        if order == 'desc':
            query = query.order_by(db.desc(getattr(Delivery, sort_by)))
        else:
            query = query.order_by(getattr(Delivery, sort_by))

        paginated_query = query.paginate(page=page, per_page=per_page)
        deliveries_info = [d.to_dict() for d in paginated_query.items]

        return jsonify({
            "success": True,
            "deliveries": deliveries_info,
            "total": paginated_query.total,
            "pages": paginated_query.pages,
        })
    except Exception as e:
        logger.error(f"Error in list_deliveries route: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Add a new delivery
@weighbridge_bp.route('/add_delivery', methods=['POST'])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Weighbridge', 'IT'])
def add_delivery():
    try:
        data = DeliverySchema().load(request.json)

        supplier_id = data.get('supplier_id')
        quantity = data.get('quantity')
        gross_wgt = data.get('gross_wgt')
        tar_wgt = data.get('tar_wgt')
        net_wgt = gross_wgt - tar_wgt

        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({"success": False, "error": "Supplier not found."}), 404

        moisture_pricing = MoisturePricing.query.first()
        if not moisture_pricing:
            return jsonify({"success": False, "error": "Moisture pricing is not set by procurement."}), 400

        price_per_kg = moisture_pricing.moisture_a_price
        total_value = net_wgt * price_per_kg

        new_delivery = Delivery(
            supplier_id=supplier_id,
            quantity=quantity,
            gross_wgt=gross_wgt,
            tar_wgt=tar_wgt,
            net_wgt=net_wgt,
            price_per_kg=price_per_kg,
            total_value=total_value,
            truck_no=data.get('truck_no'),
            driver_nm=data.get('driver_nm'),
            driver_no=data.get('driver_no'),
        )

        # Use the save() method to commit the object
        new_delivery.save()

        wallet = Wallet.query.filter_by(supplier_id=supplier_id).first()
        if wallet:
            wallet.balance += total_value
            wallet.save()
            new_delivery.wallet_id = wallet.id # Set wallet id

        return jsonify({"success": True, "message": "Delivery added successfully.", "delivery": new_delivery.to_dict()})
    except ValidationError as err:
        return jsonify({"success": False, "errors": err.messages}), 400
    except Exception as e:
        logger.error(f"Error in add_delivery route: {e}")
        return jsonify({"success": False, "error": "An unexpected error occurred."}), 500