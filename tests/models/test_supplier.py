#!/user/bin/env python3

import pytest
from app.models.supplier import Supplier, Wallet, BankDetails
from app import db

# Mock data for testing
mock_supplier_data = {
    "company_name": "Softbiochem Company",
    "cac_number": "CAC123456",
    "phone_no": "1234567890",
    "email": "softbiochemcompany@test.com",
    "contact_person": "John Doe",
    "goods_type": "Paddy",
}

mock_wallet_data = {
    "balance": 1000.0
}

mock_bank_details_data = {
    "bank_name": "Softbiochem Bank",
    "account_name": "Softbiochem Company",
    "account_number": "123456789",
    "sort_code": "12345",
    "bank_branch": "Main Branch",
}

def test_supplier_creation(app):
    """
    Test that a Supplier instance can be created and saved to the database.
    """
    with app.app_context():
        supplier = Supplier(**mock_supplier_data)
        supplier.save()

        saved_supplier = Supplier.query.filter_by(email=mock_supplier_data["email"]).first()
        assert saved_supplier is not None
        assert saved_supplier.company_name == mock_supplier_data["company_name"]

def test_supplier_validation(app):
    """
    Test validation of email and phone number for a Supplier.
    """
    with app.app_context():
        # Invalid email
        supplier = Supplier(**{**mock_supplier_data, "email": "invalid-email"})
        with pytest.raises(ValueError):
            supplier.validate()

        # Invalid phone number
        supplier = Supplier(**mock_supplier_data, phone_no="123abc")
        with pytest.raises(ValueError):
            supplier.validate()

def test_supplier_to_dict(app):
    """
    Test the Supplier model's to_dict method.
    """
    with app.app_context():
        supplier = Supplier(**mock_supplier_data)
        supplier.save()

        supplier_dict = supplier.to_dict()
        assert supplier_dict["company_name"] == mock_supplier_data["company_name"]
        assert supplier_dict["email"] == mock_supplier_data["email"]

def test_supplier_relationships(app):
    """
    Test the relationships of the Supplier model.
    """
    with app.app_context():
        # Create and save a supplier
        supplier = Supplier(**mock_supplier_data)
        supplier.save()

        # Add wallet and bank details
        wallet = Wallet(supplier_id=supplier.id, **mock_wallet_data)
        wallet.save()

        bank_details = BankDetails(supplier_id=supplier.id, **mock_bank_details_data)
        bank_details.save()

        # Fetch the supplier and check relationships
        fetched_supplier = Supplier.query.get(supplier.id)
        assert fetched_supplier.wallet is not None
        assert fetched_supplier.wallet.balance == mock_wallet_data["balance"]

        assert fetched_supplier.bank_details is not None
        assert fetched_supplier.bank_details.bank_name == mock_bank_details_data["bank_name"]