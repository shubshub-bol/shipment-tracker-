from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base
import uuid

class ShirtType(str, enum.Enum):
    BUTTONED = "buttoned"
    CLOSED = "closed"
    HOODED = "hooded"

class ShirtSize(str, enum.Enum):
    XS = "XS"
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"

class ShirtStatus(str, enum.Enum):
    PENDING = "pending"
    IN_STOCK = "in_stock"
    SHIPPED = "shipped"
    DAMAGED = "damaged"
    ACCEPTED = "accepted"

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    tracking_code = Column(String, unique=True, index=True)

    shirts = relationship("Shirt", back_populates="shipment")

class Shirt(Base):
    __tablename__ = "shirts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    serial_number = Column(String, unique=True, index=True) # Could be QR content
    color = Column(String) # Replaces age
    size = Column(String) # Storing Enum as string
    type = Column(String) # Storing Enum as string
    status = Column(String, default=ShirtStatus.IN_STOCK.value)
    
    shipment_id = Column(String, ForeignKey("shipments.id"), nullable=True)
    shipment = relationship("Shipment", back_populates="shirts")
