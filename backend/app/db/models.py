import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    sku_id = Column(String, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    current_stock = Column(Integer, nullable=False, default=0)
    reorder_threshold = Column(Integer, nullable=False, default=10)
    unit_cost = Column(Numeric(10, 2), nullable=False)
    selling_price = Column(Numeric(10, 2), nullable=False)
    supplier_id = Column(String, nullable=False)
    supplier_name = Column(String, nullable=False)
    supplier_upi = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    transactions = relationship("Transaction", back_populates="inventory_item")
    credit_offers = relationship("CreditOffer", back_populates="inventory_item")


class Transaction(Base):
    __tablename__ = "transactions"

    txn_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False) # TXN_SUCCESS, TXN_FAILURE, PENDING
    created_at = Column(DateTime, default=datetime.utcnow)
    linked_sku_id = Column(String, ForeignKey("inventory.sku_id"), nullable=True)

    # Relationships
    inventory_item = relationship("Inventory", back_populates="transactions")


class CreditOffer(Base):
    __tablename__ = "credit_offers"

    offer_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    sku_id = Column(String, ForeignKey("inventory.sku_id"), nullable=False)
    loan_amount = Column(Numeric(10, 2), nullable=False)
    interest_rate_pct = Column(Numeric(5, 2), default=1.5, nullable=False)
    tenure_days = Column(Integer, default=14, nullable=False)
    status = Column(String, nullable=False, default="OFFERED") # OFFERED, ACCEPTED, DISBURSED, REPAID
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    inventory_item = relationship("Inventory", back_populates="credit_offers")
