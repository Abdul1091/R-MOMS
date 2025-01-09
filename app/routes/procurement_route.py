from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, ValidationError
from app.models.supplier import Supplier, Wallet, BankDetails, MoisturePricing
from app import db
from app.utils.security import role_required, department_required
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

procurement_bp = Blueprint('procurement', __name__)

# Marshmallow schemas
class SupplierSchema(Schema):
    company_name = fields.String(required=True)
    cac_number = fields.String(required=False)
    phone_no = fields.String(required=True)
    email = fields.Email(required=True)
    contact_person = fields.String(required=True)
    goods_type = fields.String(required=True)
    bank_name = fields.String(required=True)
    account_name = fields.String(required=True)
    account_number = fields.String(required=True)
    sort_code = fields.String(required=False)
    branch_name = fields.String(required=False)

supplier_schema = SupplierSchema()

class MoisturePricingSchema(Schema):
    moisture_a = fields.Float(required=True)
    moisture_b = fields.Float(required=True)
    moisture_c = fields.Float(required=True)
    moisture_a_price = fields.Float(required=True)
    moisture_b_price = fields.Float(required=True)
    moisture_c_price = fields.Float(required=True)

moisture_pricing_schema = MoisturePricingSchema()

# Apply role_required and department_required decorators for the procurement dashboard
@procurement_bp.route("/proc_dashboard", methods=["GET"])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Procurement', 'IT'])
def proc_dashboard():
    try:
        # Fetch total suppliers
        total_suppliers = Supplier.query.count()

        # Fetch moisture pricing, if exists
        moisture_pricing = MoisturePricing.query.first()
        
        # Prepare the data
        moisture_data = {
            "moisture_a": {"level": 0, "price": 0},
            "moisture_b": {"level": 0, "price": 0},
            "moisture_c": {"level": 0, "price": 0}
        }

        if moisture_pricing:
            moisture_data = moisture_pricing.to_dict()

        # Return JSON response
        return jsonify({
            "total_suppliers": total_suppliers,
            "moisture_data": moisture_data
        }), 200
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}")
        return jsonify({"error": "Error loading the dashboard."}), 500

# Apply role_required and department_required decorators for listing suppliers
@procurement_bp.route("/suppliers", methods=["GET"])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Procurement', 'IT'])
def list_suppliers():
    try:
        # Pagination parameters
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        # Query suppliers with pagination
        paginated_suppliers = Supplier.query.paginate(page=page, per_page=per_page, error_out=False)

        suppliers = [supplier.to_dict() for supplier in paginated_suppliers.items]

        return jsonify({
            "suppliers": suppliers,
            "total": paginated_suppliers.total,
            "pages": paginated_suppliers.pages,
            "current_page": paginated_suppliers.page
        }), 200
    except Exception as e:
        logger.error(f"Error listing suppliers: {str(e)}")
        return jsonify({"error": "Error loading suppliers list."}), 500

# Apply role_required and department_required decorators for adding a supplier
@procurement_bp.route("/suppliers/add", methods=["POST"])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Procurement', 'IT'])
def add_supplier():
    try:
        data = request.get_json()

        # Validate inputs with Marshmallow
        validated_data = supplier_schema.load(data)

        # Create supplier, wallet, and bank details
        new_supplier = Supplier(
            company_name=validated_data["company_name"],
            cac_number=validated_data.get("cac_number"),
            phone_no=validated_data["phone_no"],
            email=validated_data["email"],
            contact_person=validated_data["contact_person"],
            goods_type=validated_data["goods_type"]
        )
        new_supplier.save()

        wallet = Wallet(supplier_id=new_supplier.id, balance=0)
        wallet.save()

        bank_details = BankDetails(
            supplier_id=new_supplier.id,
            bank_name=validated_data["bank_name"],
            account_name=validated_data["account_name"],
            account_number=validated_data["account_number"],
            sort_code=validated_data.get("sort_code"),
            bank_branch=validated_data.get("branch_name")
        )
        bank_details.save()

        return jsonify({"message": "Supplier, wallet, and bank details created successfully!"}), 201

    except ValidationError as ve:
        logger.error(f"Validation error: {ve.messages}")
        return jsonify({"error": ve.messages}), 400

    except Exception as e:
        logger.error(f"Error adding supplier: {str(e)}")
        return jsonify({"error": "Error adding supplier. Please try again."}), 500

# Apply role_required and department_required decorators for managing moisture pricing
@procurement_bp.route("/moisture-pricing", methods=["GET", "POST"])
@role_required(roles=['Admin', 'Manager'])
@department_required(departments=['Procurement', 'IT'])
def manage_moisture_pricing():
    if request.method == "POST":
        try:
            data = request.get_json()

            # Validate inputs with Marshmallow
            validated_data = moisture_pricing_schema.load(data)

            # Check if a pricing record already exists
            existing_pricing = MoisturePricing.query.first()
            if existing_pricing:
                # Update existing pricing
                existing_pricing.moisture_a = validated_data["moisture_a"]
                existing_pricing.moisture_b = validated_data["moisture_b"]
                existing_pricing.moisture_c = validated_data["moisture_c"]
                existing_pricing.moisture_a_price = validated_data["moisture_a_price"]
                existing_pricing.moisture_b_price = validated_data["moisture_b_price"]
                existing_pricing.moisture_c_price = validated_data["moisture_c_price"]
                existing_pricing.save()
                message = "Moisture pricing updated successfully!"
            else:
                # Create a new pricing record
                new_pricing = MoisturePricing(
                    moisture_a=validated_data["moisture_a"],
                    moisture_b=validated_data["moisture_b"],
                    moisture_c=validated_data["moisture_c"],
                    moisture_a_price=validated_data["moisture_a_price"],
                    moisture_b_price=validated_data["moisture_b_price"],
                    moisture_c_price=validated_data["moisture_c_price"]
                )
                new_pricing.save()
                message = "New moisture pricing created successfully!"

            return jsonify({"message": message}), 200

        except ValidationError as ve:
            logger.error(f"Validation error: {ve.messages}")
            return jsonify({"error": ve.messages}), 400

        except Exception as e:
            logger.error(f"Unexpected error in moisture pricing: {str(e)}")
            return jsonify({"error": "An unexpected error occurred. Please try again."}), 500

    # GET method: Fetch moisture pricing
    try:
        pricing = MoisturePricing.query.first()
        if not pricing:
            return jsonify({"message": "No moisture pricing found."}), 404

        return jsonify(pricing.to_dict()), 200
    except Exception as e:
        logger.error(f"Error fetching moisture pricing: {str(e)}")
        return jsonify({"error": "Error loading moisture pricing."}), 500