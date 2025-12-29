# Shirt Distribution System

A full-stack application to track shirt inventory and shipments using QR codes.

## 🚀 How to Run

1.  **Backend** (Terminal 1):
    ```bash
    cd backend
    pip install -r requirements.txt
    python -m uvicorn main:app --reload
    ```
2.  **Frontend** (Terminal 2):
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 🧠 Backend Code Explained (Simple Version)

The backend is written in **Python** using **FastAPI**. It's the "brain" of the application. Here is what each file does:

### 1. `main.py` (The Doorway)
This is where the application starts. It defines the **API Endpoints** (URLs like `/shirts` or `/scan`). When the frontend asks for something, `main.py` receives the request first.

### 2. `models.py` (The Database Tables)
This file defines what our data looks like in the database.
-   **Shirt**: Has ID, Size, Type, Age, and Status.
-   **Shipment**: Has a Tracking Code and a list of shirts.

### 3. `crud.py` (The Logic)
"CRUD" stands for **C**reate, **R**ead, **U**pdate, **D**elete. This file contains the actual functions that do the work, like:
-   `create_shirt`: Saves a new shirt to the database.
-   `update_shirt_status`: Changes a shirt from "In Stock" to "Shipped".

### 4. `schemas.py` (The Validator)
This ensures the data is correct before we process it. For example, it checks that "Age" is actually a number and "Type" is one of the allowed options (Buttoned, Hooded, Closed).

### 5. `database.py` (The Connection)
This file simply connects our Python code to the Database (SQLite or SQL). It handles the "pipeline" for data flow.
