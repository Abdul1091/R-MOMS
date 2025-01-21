#!/user/bin/env python3


from marshmallow import Schema, fields

class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)  # Read-only field
    delivery_id = fields.Int(required=True)
    amount = fields.Float(required=True)
    quality_check_id = fields.Int(required=False)