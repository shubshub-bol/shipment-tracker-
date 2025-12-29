# 📦 Intelligent Shirt Inventory System

A modern full-stack application for managing garment inventory, shipments, and real-time tracking using QR code technology.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Tailwind-blue)

## ✨ Key Features

*   **📊 Interactive Dashboard**: Real-time visualization of inventory stats (Total Items, Shipped, Defective) with animated counters.
*   **📱 QR Code Workflow**:
    *   **Generation**: Auto-generates unique QR codes for every shirt.
    *   **Scanning**: Built-in camera scanner for verifying items and processing shipments.
    *   **Scan-to-Receive**: Streamlined workflow to accept incoming shipments or mark damaged goods instantly.
*   **🚚 Shipment Management**: Group items into shipments with tracking codes (`SH-XXXX`) and track their contents.
*   **🎨 Premium UI**: Glassmorphism design system, smooth animations (Framer Motion principles), and responsive mobile-first layout.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS (Custom Design System)
*   **Icons**: Lucide React
*   **QR Scanning**: `html5-qrcode`

### Backend
*   **API**: FastAPI (Python)
*   **Database**: SQLite (via SQLAlchemy ORM)
*   **Validation**: Pydantic Schemas

---

## 🚀 Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
*   **Node.js** (v18+ recommended)
*   **Python** (v3.8+)
*   **Git**

### 1. Clone the Repository
Open your terminal and run:

```bash
git clone <repository-url>
cd perceptive_assesment
```

### 2. Backend Setup (The Brain)
Open a terminal in the `backend/` folder:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload
```
*Server runs at: `http://localhost:8000`*

### 3. Frontend Setup (The Interface)
Open a **new** terminal in the `frontend/` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
*App runs at: `http://localhost:5173`*

---

## 🔄 User Workflows

### 1️⃣ Creating Inventory
1.  Navigate to **Inventory**.
2.  Click **"Add New Shirt"**.
3.  Fill in details (Size, Type, Color). **Serial Number** is auto-generated if left blank.
4.  Item status starts as **"In Stock"** (Emerald Badge).

### 2️⃣ Shipping Items
1.  Navigate to **Shipments**.
2.  Select items from the "Available Items" grid.
3.  Enter a **Tracking Code** (e.g., `TRK-001`).
4.  Click **"Create Shipment"**.
5.  Selected items move to **"Shipped"** status (Blue Badge).

### 3️⃣ Receiving & Scanning (The core workflow)
1.  Go to **Scanner**.
2.  Scan the QR code of a physical item (or click "View QR" in inventory to simulate).
3.  System identifies the item state:
    *   **If Shipped**: You see **"Accept"** (Verify Receipt) and **"Defective"** buttons.
        *   ✅ **Accepting** allows you to mark the shipment as safely received (Purple Badge).
    *   **If In Stock**: Shows as "Verified".
    *   **If Defective**: Warns that item is already damaged.

---

## 📂 Code Structure Simplified

| File | Purpose |
|---|---|
| **`models.py`** | Defines the database tables and the **Status Lifecycle** (`In Stock` → `Shipped` → `Accepted` / `Damaged`). |
| **`schemas.py`** | Validates data moving between Frontend and Backend (e.g. ensures "Color" is a string). |
| **`crud.py`** | Contains the logic for specific actions (Create item, Update status, etc.). |
| **`main.py`** | The API controller that listens for requests (e.g., `POST /scan/`). |

---

> Built with ❤️ by Antigravity
