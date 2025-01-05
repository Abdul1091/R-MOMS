from app import db
from datetime import datetime
from sqlalchemy.orm import validates
import logging

# Configure logging
logger = logging.getLogger(__name__)

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    cac_number = db.Column(db.String(50), nullable=False)
    phone_no = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_person = db.Column(db.String(50), nullable=False)
    goods_type = db.Column(db.String(100), nullable=True)
    #deliveries = db.relationship("Delivery", backref="supplier", lazy=True)
    wallet = db.relationship("Wallet", backref="supplier", uselist=False)
    bank_details = db.relationship("BankDetails", backref="supplier", uselist=False)

    @validates('email')
    def validate_email(self, key, email):
        if not email or '@' not in email:
            logger.error(f"Invalid email provided: {email}")
            raise ValueError('Invalid email address')
        return email

    @validates('phone_no')
    def validate_phone(self, key, phone_no):
        if not phone_no.isdigit():
            logger.error(f"Invalid phone number provided: {phone_no}")
            raise ValueError('Phone number must contain only digits')
        return phone_no

class MoisturePricing(db.Model):
    __tablename__ = 'moisture_pricing'
    id = db.Column(db.Integer, primary_key=True)
    moisture_a = db.Column(db.Float, nullable=False)
    moisture_b = db.Column(db.Float, nullable=False)
    moisture_c = db.Column(db.Float, nullable=False)
    moisture_a_price = db.Column(db.Float, nullable=False)
    moisture_b_price = db.Column(db.Float, nullable=False)
    moisture_c_price = db.Column(db.Float, nullable=False)
    updated_by = db.Column(db.String(80), nullable=False)  # Username of the user who updated it
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def update_prices(self, a_price, b_price, c_price, updated_by):
        self.moisture_a_price = a_price
        self.moisture_b_price = b_price
        self.moisture_c_price = c_price
        self.updated_by = updated_by
        self.updated_at = datetime.utcnow()

class BankDetails(db.Model):
    __tablename__ = 'bank_details'
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_name = db.Column(db.String(100), nullable=False)
    account_number = db.Column(db.String(20), nullable=False)
    sort_code = db.Column(db.String(10), nullable=True)
    bank_branch = db.Column(db.String(100), nullable=True)

class Wallet(db.Model):
    __tablename__ = 'wallets'
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False, unique=True)
    balance = db.Column(db.Float, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def update_balance(self, amount):
        if amount < 0 and abs(amount) > self.balance:
            logger.error(f"Insufficient balance for transaction. Attempted amount: {amount}, Available: {self.balance}")
            raise ValueError("Insufficient balance")
        self.balance += amount
        self.last_updated = datetime.utcnow()

# Example utility function to handle common operations
def save_to_db(instance):
    try:
        db.session.add(instance)
        db.session.commit()
    except Exception as e:
        logger.error(f"Error saving {instance.__class__.__name__} to database: {e}")
        db.session.rollback()
        raise