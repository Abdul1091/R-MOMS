#!/user/bin/env python3

from sqlalchemy.orm import validates
from app import db
from app.models.base import BaseModel

class Payment(BaseModel):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    delivery_id = db.Column(db.Integer, db.ForeignKey('deliveries.id'), nullable=False, index=True)
    amount = db.Column(db.Float, nullable=False)
    quality_check_id = db.Column(db.Integer, db.ForeignKey('quality_checks.id'), nullable=True, index=True)

    # Relationships
    delivery = db.relationship("Delivery", backref=db.backref("payments", cascade="all, delete-orphan"))
    quality_check = db.relationship("QualityCheck", backref=db.backref("payments", cascade="all, delete-orphan"))

    __table_args__ = (
        db.UniqueConstraint('delivery_id', 'quality_check_id', name='unique_delivery_quality_check'),
    )

    @validates('amount')
    def validate_amount(self, key, value):
        if value < 0:
            raise ValueError("Amount must be non-negative")
        return value