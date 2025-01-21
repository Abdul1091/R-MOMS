#!/user/bin/env python3

import logging
from flask import jsonify, request, Blueprint
from app.models.supplier import Supplier, Wallet, BankDetails
from app.models.payment import Payment
from app.models.quality import QualityCheck
from app.models.delivery import Delivery
from marshmallow.exceptions import ValidationError
from app.schema.payment_schema import PaymentSchema
from app.schema.delivery_schema import UpdateStatusSchema
from app import db

# Configure logging
logging.basicConfig(level=logging.INFO, filename='finance_routes.log', filemode='a',
                    format='%(asctime)s - %(levelname)s - %(message)s')

finance_bp = Blueprint('finance', __name__)

payment_schema = PaymentSchema()
payments_schema = PaymentSchema(many=True)

@finance_bp.route('/fin_dashboard')
def fin_dashboard():
    try:
        suppliers = Supplier.query.all()
        all_deliveries = Delivery.query.all()
        total_payments = sum(payment.amount for payment in Payment.query.all())
        pending_payments = Delivery.query.filter_by(status="Pending").count()
        total_wallet_balance = sum(wallet.balance for wallet in Wallet.query.all())

        # Transaction data for chart
        transaction_history = [
            {
                "date": delivery.created_at.strftime("%Y-%m-%d"),
                "supplier": delivery.supplier.to_dict() if delivery.supplier else None,
                "description": f"Delivery ID {delivery.id}",
                "amount": delivery.total_value,
                "status": delivery.status,
            }
            for delivery in all_deliveries
        ]

        return jsonify({
            "suppliers": [supplier.to_dict() for supplier in suppliers],
            "all_deliveries": [delivery.to_dict() for delivery in all_deliveries],
            "total_payments": total_payments,
            "pending_payments": pending_payments,
            "total_wallet_balance": total_wallet_balance,
            "transaction_history": transaction_history,
        })
    except Exception as e:
        logging.error("Error in fin_dashboard route", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@finance_bp.route('/fin_pro_payment')
def fin_pro_payment():
    try:
        suppliers = Supplier.query.all()
        pending_deliveries = Delivery.query.filter_by(status="Pending").all()

        deliveries_info = []
        for delivery in pending_deliveries:
            quality_check = QualityCheck.query.filter_by(delivery_id=delivery.id).first()
            bank_details = BankDetails.query.filter_by(supplier_id=delivery.supplier_id).first()
            deliveries_info.append({
                "id": delivery.id,
                "supplier": delivery.supplier.to_dict() if delivery.supplier else None,
                "bank_name": bank_details.bank_name if bank_details else "N/A",
                "account_number": bank_details.account_number if bank_details else "N/A",
                "net_weight": delivery.net_wgt,
                "total_price": delivery.total_value,
                "quality_check_status": quality_check.quality_check_status if quality_check else "N/A",
            })

        return jsonify({
            "suppliers": [supplier.to_dict() for supplier in suppliers],
            "deliveries_info": deliveries_info,
        })
    except Exception as e:
        logging.error("Error in fin_pro_payment route", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@finance_bp.route('/process_payment', methods=['POST'])
def process_payment():
    try:
        data = request.json
        
        # Validate incoming data using UpdateStatusSchema
        update_schema = UpdateStatusSchema()
        try:
            validated_data = update_schema.load(data)
        except ValidationError as err:
            logging.error(f"Validation error: {err.messages}")
            return jsonify({"error": "Validation error", "details": err.messages}), 400
        
        delivery_id = validated_data['delivery_id']
        status = validated_data.get('status', '')  # Default to 'Paid' if not provided

        # Get the delivery from the database
        delivery = Delivery.query.get_or_404(delivery_id)

        # Ensure the quality check has passed
        quality_check = QualityCheck.query.filter_by(delivery_id=delivery_id).first()
        if not quality_check or quality_check.quality_check_status != 'pass':
            return jsonify({"error": "Quality check not passed"}), 400

        # Prevent duplicate payments
        if delivery.status == "Paid":
            return jsonify({"error": "Delivery already paid"}), 400

        # Ensure net weight is valid
        if delivery.net_wgt <= 0:
            return jsonify({"error": "Invalid net weight"}), 400

        # Retrieve the supplier's wallet
        wallet = Wallet.query.filter_by(supplier_id=delivery.supplier_id).first()
        if not wallet:
            return jsonify({"error": "Supplier wallet not found"}), 400

        if wallet.balance < delivery.total_value:
            return jsonify({"error": "Insufficient wallet balance"}), 400

        # Process the payment
        payment = Payment(
            delivery_id=delivery_id,
            amount=delivery.total_value,
            quality_check_id=quality_check.id
        )
        
        # Add the payment to the session first (before updating status)
        db.session.add(payment)
        
        # Deduct the payment from the wallet
        wallet.balance -= delivery.total_value

        # Commit the changes to the database (save payment and update wallet balance)
        db.session.commit()

        # Update the delivery status to "Paid"
        delivery.status = "Paid"  # Set status to 'Paid' after payment processing
        db.session.commit()

        return jsonify({"message": "Payment processed successfully", "payment": payment_schema.dump(payment)})

    except Exception as e:
        logging.error("Error in process_payment route", exc_info=True)
        return jsonify({"error": "Internal server error", "message": str(e)}), 500