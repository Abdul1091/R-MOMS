#!/user/bin/env python3

from marshmallow import Schema, fields

class DeliverySchema(Schema):
    supplier_id = fields.Int(required=True)
    quantity = fields.Int(required=True)
    quantity_received = fields.Int(required=False, allow_none=True)
    status = fields.Str(required=False, allow_none=True)
    gross_wgt = fields.Int(required=True)
    tar_wgt = fields.Int(required=True)
    truck_no = fields.Str(required=True)
    driver_nm = fields.Str(required=True)
    driver_no = fields.Str(required=True)


class UpdateQuantitySchema(Schema):
    delivery_id = fields.Int(required=True)
    quantity_received = fields.Int(required=True)


class UpdateStatusSchema(Schema):
    delivery_id = fields.Int(required=True)
    status = fields.Str(load_default="Pending")