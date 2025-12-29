from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum

class ShirtType(str, Enum):
    BUTTONED = "buttoned"
    CLOSED = "closed"
    HOODED = "hooded"

class ShirtSize(str, Enum):
    XS = "XS"
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"

class ShirtBase(BaseModel):
    color: str
    size: ShirtSize
    type: ShirtType
    # serial_number moved to specific subclasses to handle optionality correctly

class ShirtCreate(ShirtBase):
    serial_number: Optional[str] = None

class ShipmentBase(BaseModel):
    tracking_code: str

class ShipmentCreate(ShipmentBase):
    pass

class Shipment(ShipmentBase):
    id: str
    created_at: Any
    shirts: List['Shirt'] = [] # Forward Ref

    class Config:
        orm_mode = True

# Add new summary schema to avoid circular recursion
class ShipmentSummary(BaseModel):
    id: str
    tracking_code: str
    class Config:
        orm_mode = True

class Shirt(ShirtBase):
    id: str
    serial_number: str # Required in response
    status: str
    shipment_id: Optional[str] = None
    shipment: Optional[ShipmentSummary] = None # New nested field

    class Config:
        orm_mode = True

Shipment.update_forward_refs()
