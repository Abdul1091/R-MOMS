
#!/user/bin/env python3
import os
from flask import make_response
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from flask import Blueprint, Response, request, jsonify
from xhtml2pdf import pisa
from app.utils.logging_config import logger
from app.schema.delivery_schema import DeliverySchema, UpdateQuantitySchema
from marshmallow.exceptions import ValidationError
from app.models.supplier import Supplier
from app.models.delivery import Delivery
from app.models.quality import QualityCheck
from app import db

warehouse_bp = Blueprint('warehouse', __name__)

# Schema for Delivery validation
delivery_schema = DeliverySchema()
update_quantity_schema = UpdateQuantitySchema()


@warehouse_bp.route('/dashboard_data', methods=['GET'])
def warehouse_dashboard_data():
    logger.info("Fetching warehouse dashboard data.")

    total_deliveries = Delivery.query.count()
    total_suppliers = Supplier.query.count()
    total_weight = db.session.query(db.func.sum(Delivery.net_wgt)).scalar() or 0

    # Pagination for deliveries
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    deliveries = Delivery.query.paginate(page=page, per_page=per_page, error_out=False)

    deliveries_info = [
        {
            "id": d.id,
            "supplier_name": d.supplier.company_name,
            "supplier_id": d.supplier.id,
            "gross_weight": d.gross_wgt,
            "tar_weight": d.tar_wgt,
            "net_weight": d.net_wgt,
            "total_price": d.total_value,
            "quantity_received": d.quantity_received,
        }
        for d in deliveries.items
    ]

    logger.debug(f"Total Deliveries: {total_deliveries}, Page: {page}, Per Page: {per_page}")
    return jsonify({
        "total_deliveries": total_deliveries,
        "total_suppliers": total_suppliers,
        "total_weight": total_weight,
        "deliveries_info": deliveries_info,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_pages": deliveries.pages,
            "total_items": deliveries.total
        }
    }), 200


@warehouse_bp.route('/download_gpr/<int:delivery_id>', methods=['GET'])
def download_gpr(delivery_id):
    logger.info(f"Generating GPR PDF for delivery ID: {delivery_id}")
    
    # Query the delivery from the database
    delivery = Delivery.query.get(delivery_id)
    if not delivery:
        logger.error(f"Delivery with ID {delivery_id} not found.")
        return jsonify({"error": "Delivery not found"}), 404

    # Create a PDF in memory
    buffer = BytesIO()
    pdf_canvas = canvas.Canvas(buffer, pagesize=letter)

    # Add content to the PDF
    pdf_canvas.setFont("Helvetica-Bold", 14)
    pdf_canvas.drawString(72, 750, "Goods Receive Note")
    pdf_canvas.setFont("Helvetica", 12)
    pdf_canvas.drawString(72, 720, f"Delivery ID: {delivery.id}")
    pdf_canvas.drawString(72, 700, f"Supplier: {delivery.supplier.company_name if delivery.supplier else 'Unknown'}")
    pdf_canvas.drawString(72, 680, f"Gross Weight: {delivery.gross_wgt}")
    pdf_canvas.drawString(72, 660, f"Tar Weight: {delivery.tar_wgt}")
    pdf_canvas.drawString(72, 640, f"Net Weight: {delivery.net_wgt}")
    pdf_canvas.drawString(72, 620, f"Total Price: {delivery.total_value}")
    pdf_canvas.drawString(72, 600, f"Quantity Received: {delivery.quantity_received}")
    pdf_canvas.drawString(72, 580, f"Created At: {delivery.created_at.strftime('%Y-%m-%d %H:%M:%S') if delivery.created_at else 'N/A'}")
    pdf_canvas.drawString(72, 560, f"Updated At: {delivery.updated_at.strftime('%Y-%m-%d %H:%M:%S') if delivery.updated_at else 'N/A'}")
    pdf_canvas.drawString(72, 580, f"Created At: {delivery.created_by if delivery.created_by else 'N/A'}")

    # Finalize the PDF
    pdf_canvas.showPage()
    pdf_canvas.save()

    # Return the PDF as a downloadable file
    buffer.seek(0)
    response = make_response(buffer.read())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=goods_receive_note_{delivery_id}.pdf'
    buffer.close()

    logger.info(f"GPR PDF for delivery ID {delivery_id} generated successfully.")
    return response


@warehouse_bp.route('/update_quantity', methods=['POST'])
def update_quantity():
    data = request.get_json()
    logger.info("Updating quantity received for delivery.")
    try:
        validated_data = update_quantity_schema.load(data)
    except ValidationError as e:
        logger.error(f"Validation error: {e.messages}")
        return jsonify({"error": "Invalid data", "details": e.messages}), 400

    delivery_id = validated_data.get('delivery_id')
    quantity_received = validated_data.get('quantity_received')

    delivery = Delivery.query.get(delivery_id)
    quality_check = QualityCheck.query.get(delivery_id)

    if not delivery:
        logger.error(f"Invalid Delivery ID: {delivery_id}")
        return jsonify({"error": "Invalid Delivery ID."}), 404

    if delivery.quantity_received is not None:
        logger.warning(f"Delivery {delivery_id} already updated.")
        return jsonify({"error": "This delivery has already been updated."}), 400

    if quantity_received != quality_check.accepted_bags:
        logger.warning(f"Quantity mismatch: {quantity_received} vs {quality_check.accepted_bags}")
        return jsonify({
            "error": f"Quantity received ({quantity_received}) must match accepted bags ({quality_check.accepted_bags})."
        }), 400

    delivery.quantity_received = quantity_received
    delivery.save()
    logger.info(f"Quantity for delivery ID {delivery_id} updated successfully.")
    return jsonify({"message": "Quantity updated successfully!", "delivery_id": delivery.id}), 200


@warehouse_bp.route('/warehouse', methods=['GET'])
def warehouse():
    logger.info("Fetching warehouse data.")
    suppliers = Supplier.query.all()
    all_deliveries = Delivery.query.order_by(Delivery.created_at).all()

    deliveries_info = [
        {
            "id": delivery.id,
            "supplier": delivery.supplier.company_name,
            "supplier_id": delivery.supplier.id,
            "gross_weight": delivery.gross_wgt,
            "tar_weight": delivery.tar_wgt,
            "net_weight": delivery.net_wgt,
            "total_price": delivery.total_value,
            "quantity": delivery.quantity,
            "quantity_received": delivery.quantity_received
        }
        for delivery in all_deliveries
    ]

    logger.debug(f"Total Suppliers: {len(suppliers)}, Total Deliveries: {len(all_deliveries)}")
    return jsonify({
        "suppliers": [supplier.company_name for supplier in suppliers],
        "deliveries_info": deliveries_info,
    }), 200