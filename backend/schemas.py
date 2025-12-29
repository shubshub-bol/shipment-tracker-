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
    age: int
    size: ShirtSize
    type: ShirtType
    serial_number: str

class ShirtCreate(ShirtBase):
    pass

class Shirt(ShirtBase):
    id: str
    status: str
    shipment_id: Optional[str] = None

    class Config:
        orm_mode = True

class ShipmentBase(BaseModel):
    tracking_code: str

class ShipmentCreate(ShipmentBase):
    pass

class Shipment(ShipmentBase):
    id: str
    created_at: Any
    shirts: List[Shirt] = []

    class Config:
        orm_mode = True
