from sqlalchemy.orm import Session, joinedload
import models, schemas
import uuid

def get_shirt(db: Session, shirt_id: str):
    return db.query(models.Shirt).filter(models.Shirt.id == shirt_id).first()

def get_shirt_by_serial(db: Session, serial: str):
    return db.query(models.Shirt).filter(models.Shirt.serial_number == serial).first()

def get_shirts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Shirt).options(joinedload(models.Shirt.shipment)).offset(skip).limit(limit).all()

def create_shirt(db: Session, shirt: schemas.ShirtCreate):
    generated_serial = shirt.serial_number or f"SN-{str(uuid.uuid4())[:8].upper()}"
    
    db_shirt = models.Shirt(
        id=str(uuid.uuid4()),
        serial_number=generated_serial,
        color=shirt.color,
        size=shirt.size.value,
        type=shirt.type.value
    )
    db.add(db_shirt)
    db.commit()
    db.refresh(db_shirt)
    return db_shirt

def get_shipments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Shipment).offset(skip).limit(limit).all()

def create_shipment(db: Session, shipment: schemas.ShipmentCreate):
    db_shipment = models.Shipment(
        id=str(uuid.uuid4()),
        tracking_code=shipment.tracking_code
    )
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def update_shirt_status(db: Session, serial: str, status: str):
    shirt = get_shirt_by_serial(db, serial)
    if shirt:
        shirt.status = status
        db.commit()
        db.refresh(shirt)
    return shirt

def add_shirt_to_shipment(db: Session, serial: str, shipment_id: str):
    shirt = get_shirt_by_serial(db, serial)
    if shirt:
        shirt.shipment_id = shipment_id
        # Also could update status to SHIPPED if logic dictates
        if shirt.status == models.ShirtStatus.IN_STOCK.value:
             shirt.status = models.ShirtStatus.SHIPPED.value
        db.commit()
        db.refresh(shirt)
    return shirt
