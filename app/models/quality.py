from app import db
from models.base import BaseModel

class QualityCheck(db.Model, BaseModel):
    __tablename__ = 'quality_checks'
    delivery_id = db.Column(db.Integer, db.ForeignKey('deliveries.id'), nullable=False)
    moisture_content = db.Column(db.Float, nullable=True)
    short_grains = db.Column(db.Float, nullable=True)
    immature = db.Column(db.Float, nullable=True)
    foreign_matter = db.Column(db.Float, nullable=True)
    stones = db.Column(db.Float, nullable=True)
    discolored_grains = db.Column(db.Float, nullable=True)
    cracked_grain = db.Column(db.Float, nullable=True)
    red_grain = db.Column(db.Float, nullable=True)
    empty_shells = db.Column(db.Float, nullable=True)
    total_bags = db.Column(db.Integer, nullable=True)
    accepted_bags = db.Column(db.Integer, nullable=True)
    rejected_bags = db.Column(db.Integer, nullable=True)
    quality_check_status = db.Column(db.String(20), default="Pending")
    notes = db.Column(db.Text, nullable=True)
    is_locked = db.Column(db.Boolean, default=False)

    delivery = db.relationship("Delivery", backref=db.backref("quality_checks", lazy=True))