from app import db
from app.models.base import BaseModel

class Delivery(BaseModel):
    __tablename__ = 'deliveries'

    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    supplier = db.relationship('Supplier', backref=db.backref('deliveries', lazy=True))

    wallet_id = db.Column(db.Integer, db.ForeignKey('wallets.id'), nullable=True)  # Foreign key to Wallet
    wallet = db.relationship('Wallet', backref='deliveries')  # Relationship to Wallet

    quantity = db.Column(db.String(255), nullable=False)
    gross_wgt = db.Column(db.Integer, nullable=False)  # Gross weight in kg
    tar_wgt = db.Column(db.Integer, nullable=False)  # Tare weight in kg
    net_wgt = db.Column(db.Integer, nullable=False)  # Net weight calculated
    price_per_kg = db.Column(db.Integer, nullable=False)  # Price per kg
    total_value = db.Column(db.Integer, nullable=False)  # Total value calculated
    truck_no = db.Column(db.String(255), nullable=False)  # Truck number
    driver_nm = db.Column(db.String(255), nullable=False)  # Driver name
    driver_no = db.Column(db.String(255), nullable=False)  # Driver phone number

    # Additional methods for calculations
    def calculate_net_wgt(self):
        if self.gross_wgt < self.tar_wgt:
            raise ValueError('Gross weight cannot be less than tare weight')
        self.net_wgt = self.gross_wgt - self.tar_wgt
        return self.net_wgt

    def calculate_total_value(self):
        if self.price_per_kg <= 0:
            raise ValueError('Price per kg must be greater than zero')
        self.total_value = self.net_wgt * self.price_per_kg
        return self.total_value

    def save(self):
        self.calculate_net_wgt()
        self.calculate_total_value()
        db.session.add(self)
        db.session.commit()

        # Call BaseModel's save method for timestamps and user tracking
        super().save()