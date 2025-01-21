#!/user/bin/env python3

import pytest
from app.models.delivery import Delivery
from app.models.supplier import Supplier, Wallet
from app import db

@pytest.fixture
def sample_supplier(app):
    """Fixture to create a sample supplier."""
    with app.app_context():
        supplier = Supplier(
            company_name="Soft Supplier",
            cac_number="CAC123456",
            phone_no="08012345678",
            email="supplier@test.com",
            contact_person="John Doe"
        )
        db.session.add(supplier)
        db.session.commit()
        return supplier

@pytest.fixture
def sample_wallet(app, sample_supplier):
    """Fixture to create a sample wallet."""
    with app.app_context():
        wallet = Wallet(balance=50000, supplier_id=sample_supplier.id)
        db.session.add(wallet)
        db.session.commit()
        return wallet

@pytest.fixture
def sample_delivery(app, sample_supplier, sample_wallet):
    """Fixture to create a sample delivery."""
    with app.app_context():
        delivery = Delivery(
            supplier_id=sample_supplier.id,
            wallet_id=sample_wallet.id,
            goods_type="Paddy",
            quantity="100 Bags",
            gross_wgt=1200,
            tar_wgt=200,
            price_per_kg=50,
            truck_no="ABC-1234",
            driver_nm="Soft Driver",
            driver_no="08098765432"
        )
        db.session.add(delivery)
        db.session.commit()
        return delivery

def test_delivery_creation(app, sample_delivery):
    """Test successful creation of a Delivery instance."""
    with app.app_context():
        delivery = sample_delivery
        assert delivery.goods_type == "Paddy"
        assert delivery.gross_wgt == 1200
        assert delivery.tar_wgt == 200

def test_delivery_calculate_net_wgt(app, sample_delivery):
    """Test the calculation of net weight."""
    with app.app_context():
        delivery = sample_delivery
        net_wgt = delivery.calculate_net_wgt()
        assert net_wgt == 1000  # 1200 - 200

def test_delivery_calculate_total_value(app, sample_delivery):
    """Test the calculation of total value."""
    with app.app_context():
        delivery = sample_delivery
        delivery.calculate_net_wgt()
        total_value = delivery.calculate_total_value()
        assert total_value == 50000  # 1000 * 50

def test_delivery_save(app, sample_supplier, sample_wallet):
    """Test the save method of the Delivery model."""
    with app.app_context():
        delivery = Delivery(
            supplier_id=sample_supplier.id,
            wallet_id=sample_wallet.id,
            goods_type="Paddy",
            quantity="50 Bags",
            gross_wgt=600,
            tar_wgt=100,
            price_per_kg=30,
            truck_no="XYZ-5678",
            driver_nm="Alice Driver",
            driver_no="08123456789"
        )
        delivery.save()
        assert delivery.net_wgt == 500  # 600 - 100
        assert delivery.total_value == 15000  # 500 * 30

def test_invalid_net_wgt_calculation(app, sample_delivery):
    """Test error when gross weight is less than tare weight."""
    with app.app_context():
        delivery = sample_delivery
        delivery.gross_wgt = 100
        delivery.tar_wgt = 200
        with pytest.raises(ValueError, match="Gross weight cannot be less than tare weight"):
            delivery.calculate_net_wgt()

def test_invalid_price_per_kg(app, sample_delivery):
    """Test error when price per kg is invalid."""
    with app.app_context():
        delivery = sample_delivery
        delivery.price_per_kg = 0
        with pytest.raises(ValueError, match="Price per kg must be greater than zero"):
            delivery.calculate_total_value()