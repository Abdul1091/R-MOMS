#!/user/bin/env python3

from app import db
from datetime import datetime, timezone
from sqlalchemy.orm import validates
from app.models.base import BaseModel
import logging

# Configure logging
logger = logging.getLogger(__name__)

class Supplier(BaseModel):
    __tablename__ = 'suppliers'
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'cac_number': self.cac_number,
            'phone_no': self.phone_no,
            'email': self.email,
            'contact_person': self.contact_person,
            'goods_type': self.goods_type,
            'wallet': self.wallet.to_dict() if self.wallet else None,  # Ensure Wallet has a to_dict method too
            'bank_details': self.bank_details.to_dict() if self.bank_details else None,  # Same for BankDetails
        }

class MoisturePricing(BaseModel):
    __tablename__ = 'moisture_pricing'
    moisture_a = db.Column(db.Float, nullable=False)
    moisture_b = db.Column(db.Float, nullable=False)
    moisture_c = db.Column(db.Float, nullable=False)
    moisture_a_price = db.Column(db.Float, nullable=False)
    moisture_b_price = db.Column(db.Float, nullable=False)
    moisture_c_price = db.Column(db.Float, nullable=False)
    

    def update_prices(self, a_price, b_price, c_price, updated_by):
        self.moisture_a_price = a_price
        self.moisture_b_price = b_price
        self.moisture_c_price = c_price
        self.updated_by = updated_by
        self.updated_at = datetime.datetime.now(datetime.UTC)

class BankDetails(BaseModel):
    __tablename__ = 'bank_details'
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_name = db.Column(db.String(100), nullable=False)
    account_number = db.Column(db.String(20), nullable=False)
    sort_code = db.Column(db.String(10), nullable=True)
    bank_branch = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            'supplier_id': self.supplier_id,
            'bank_name': self.bank_name,
            'account_name': self.account_name,
            'account_number': self.account_number,
            'sort_code': self.sort_code,
            'bank_branch': self.bank_branch,
        }

class Wallet(BaseModel):
    __tablename__ = 'wallets'
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False, unique=True)
    balance = db.Column(db.Float, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'supplier_id': self.supplier_id,
            'balance': self.balance,
            'last_updated': self.last_updated,
        }

    def update_balance(self, amount):
        if amount < 0 and abs(amount) > self.balance:
            logger.error(f"Insufficient balance for transaction. Attempted amount: {amount}, Available: {self.balance}")
            raise ValueError("Insufficient balance")
        self.balance += amount
        self.last_updated = datetime.datetime.now(datetime.UTC)