from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, database
from fastapi.middleware.cors import CORSMiddleware

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",  # React default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/shirts/", response_model=schemas.Shirt)
def create_shirt(shirt: schemas.ShirtCreate, db: Session = Depends(get_db)):
    db_shirt = crud.get_shirt_by_serial(db, serial=shirt.serial_number)
    if db_shirt:
        raise HTTPException(status_code=400, detail="Serial number already registered")
    return crud.create_shirt(db=db, shirt=shirt)

@app.get("/shirts/", response_model=List[schemas.Shirt])
def read_shirts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shirts = crud.get_shirts(db, skip=skip, limit=limit)
    return shirts

@app.post("/shipments/", response_model=schemas.Shipment)
def create_shipment(shipment: schemas.ShipmentCreate, db: Session = Depends(get_db)):
    return crud.create_shipment(db=db, shipment=shipment)

@app.get("/shipments/", response_model=List[schemas.Shipment])
def read_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_shipments(db, skip=skip, limit=limit)

@app.post("/scan/")
def scan_action(action: str, serial: str, db: Session = Depends(get_db), shipment_id: str = None):
    # Action concepts: "receive", "damage", "ship"
    shirt = crud.get_shirt_by_serial(db, serial)
    if not shirt:
        raise HTTPException(status_code=404, detail="Shirt not found")
    
    if action == "damage":
        return crud.update_shirt_status(db, serial, "damaged")
    elif action == "ship":
        if not shipment_id:
             raise HTTPException(status_code=400, detail="Shipment ID required for shipping")
        return crud.add_shirt_to_shipment(db, serial, shipment_id)
    elif action == "remove":
        # Remove from shipment? Or delete?
        pass # Implement logic
    
    return shirt
