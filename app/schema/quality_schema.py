#!/user/bin/env python3


from marshmallow import Schema, fields, validates, ValidationError

class QualityCheckSchema(Schema):
    id = fields.Int(dump_only=True)
    delivery_id = fields.Int(required=True)
    moisture_content = fields.Float(required=True)
    short_grains = fields.Float(required=True)
    immature = fields.Float(required=True)
    foreign_matter = fields.Float(required=True)
    stones = fields.Float(required=True)
    discolored_grains = fields.Float(required=True)
    cracked_grain = fields.Float(required=True)
    red_grain = fields.Float(required=True)
    empty_shells = fields.Float(required=True)
    total_bags = fields.Int(required=True)
    accepted_bags = fields.Int(required=True)
    rejected_bags = fields.Int(dump_only=True)  # Calculated field
    quality_check_status = fields.Str(required=True, validate=lambda x: x in ["Pending", "pass", "fail", "partial"])
    notes = fields.Str(allow_none=True)
    is_locked = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates("accepted_bags")
    def validate_accepted_bags(self, value):
        if value < 0:
            raise ValidationError("Accepted bags cannot be negative.")

    @validates("total_bags")
    def validate_total_bags(self, value):
        if value <= 0:
            raise ValidationError("Total bags must be greater than zero.")

    @validates("moisture_content")
    def validate_moisture_content(self, value):
        if value < 0 or value > 100:
            raise ValidationError("Moisture content must be between 0 and 100.")