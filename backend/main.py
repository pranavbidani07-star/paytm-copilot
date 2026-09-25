from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from ws_manager import manager
from fastapi.middleware.cors import CORSMiddleware
from app.api.webhooks import router as webhooks_router
from app.api.chat import router as chat_router
from routers.webhook import router as paytm_webhook_router
from database import get_db, Inventory
from sqlalchemy.orm import Session
from fastapi import Depends
from pydantic import BaseModel
import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="Paytm AI Copilot",
    description="Backend API for Paytm Merchant Growth AI",
    version="1.0.0"
)

from scheduler import scheduler

@app.on_event("startup")
async def startup_event():
    scheduler.start()
    print("APScheduler started!")

# Configure CORS â€” wildcard is safe here since we don't use cookies/credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from google.genai import types

class ChatRequest(BaseModel):
    query: str
    demo_mode: bool = False

from fastapi import Request
import aiosqlite

DB_PATH = "./copilot.db"

def _safe_int(val, default=0) -> int:
    """Convert any value to int safely â€” returns default if value is non-numeric."""
    try:
        return int(float(str(val))) if val not in (None, "", False) else default
    except (ValueError, TypeError):
        return default


def _normalize_inventory(data) -> list:
    """
    Accepts any Khatabook JSON export shape and normalises it into inventory rows.
    Never raises â€” unknown or malformed fields are skipped or defaulted.
    """
    # If the JSON is wrapped in a metadata object like {"store_name": "X", "inventory": [...]}
    if isinstance(data, dict):
        if "inventory" in data and isinstance(data["inventory"], list):
            data = data["inventory"]
        elif "items" in data and isinstance(data["items"], list):
            data = data["items"]
        elif "data" in data and isinstance(data["data"], list):
            data = data["data"]
        # Wrap single dict in a list
        elif "item_name" in data or "name" in data or "sku" in data:
            data = [data]
        else:
            # Dict mapping name -> details e.g. {"Amul Milk": {"qty": 10}}
            data = [
                {"item_name": k, **(v if isinstance(v, dict) else {"stock_count": v})}
                for k, v in data.items()
            ]

    if not isinstance(data, list):
        return []

    rows = []
    for item in data:
        if isinstance(item, str):
            rows.append({"item_name": item, "stock_count": 0, "restock_threshold": 5})

        elif isinstance(item, dict):
            # Try multiple possible field names for the item name
            item_name = (
                item.get("item_name") or item.get("name") or item.get("product_name")
                or item.get("sku") or item.get("item") or item.get("title") or None
            )
            if not item_name or not isinstance(item_name, str):
                continue  # Skip rows with no recognisable item name

            # Try multiple possible field names for stock count
            raw_stock = (
                item.get("stock_count") or item.get("quantity") or item.get("qty")
                or item.get("stock") or item.get("units") or 0
            )
            stock_count = _safe_int(raw_stock, 0)

            raw_threshold = item.get("restock_threshold") or item.get("threshold") or item.get("min_stock") or 5
            restock_threshold = _safe_int(raw_threshold, 5)

            rows.append({
                "item_name": str(item_name).strip(),
                "stock_count": stock_count,
                "restock_threshold": restock_threshold,
            })

    return rows


async def _write_inventory(data):
    rows = _normalize_inventory(data)
    async with aiosqlite.connect(DB_PATH) as db:
        for row in rows:
            # Check if item already exists
            async with db.execute("SELECT id, stock_count FROM inventory WHERE item_name = ?", (row["item_name"],)) as cursor:
                existing = await cursor.fetchone()
                
            if existing:
                # Add the new stock count to the existing stock count
                new_stock = existing[1] + row["stock_count"]
                await db.execute(
                    "UPDATE inventory SET stock_count = ?, restock_threshold = ? WHERE item_name = ?",
                    (new_stock, row["restock_threshold"], row["item_name"])
                )
            else:
                # Insert new item
                await db.execute(
                    "INSERT INTO inventory (item_name, stock_count, restock_threshold) VALUES (?, ?, ?)",
                    (row["item_name"], row["stock_count"], row["restock_threshold"])
                )
        await db.commit()
    return rows


@app.post("/api/inventory/upload")
async def upload_inventory(request: Request):
    data = await request.json()
    rows = await _write_inventory(data)
    return {"message": "Inventory successfully synced", "items_imported": len(rows)}

@app.post("/api/inventory/sync")
async def sync_inventory(request: Request):
    """Accepts Khatabook JSON exports from the HTML frontend â€” tolerates any shape."""
    data = await request.json()
    rows = await _write_inventory(data)
    return {"message": "Inventory successfully synced", "items_imported": len(rows)}


@app.get("/api/inventory")
async def get_inventory():
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT item_name, stock_count, restock_threshold FROM inventory") as cursor:
            rows = await cursor.fetchall()
            return [{"item_name": row[0], "stock_count": row[1], "restock_threshold": row[2]} for row in rows]

def get_live_store_context() -> str:
    """Fetches the live inventory and transaction context of the store from the database."""
    import sqlite3
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT item_name, stock_count FROM inventory")
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return "Inventory is empty or not uploaded yet."
            
        inventory_str = "Live Inventory State:\n"
        for item_name, stock_count in rows:
            inventory_str += f"- {item_name}: {stock_count} units\n"
        return inventory_str
    except Exception as e:
        return f"Error reading inventory: {e}"

@app.post("/api/chat")
async def chat_with_copilot(request: ChatRequest):
    if request.demo_mode:
        q = request.query.lower()
        if "stock" in q or "amul" in q:
            return {"reply": "Stock is critically low for 1L Amul Milk (2 units). Based on your settlement history, you have a pre-approved Paytm Working Capital loan of â‚¹5,000 available to instantly restock 20 units. Should I process this and SMS the supplier?"}
        elif "loan" in q or "yes" in q:
            return {"reply": "Loan of â‚¹5,000 disbursed to your settlement account successfully! âœ… Restock Purchase Order has been SMS'd to your supplier. Let's keep those sales growing!"}

    config = types.GenerateContentConfig(
        system_instruction=(
            "You are the Paytm Merchant Growth AI, an elite business copilot for Indian retailers. "
            "Rules: 1) You MUST use the get_live_store_context tool to fetch live data before answering questions about sales or inventory. "
            "2) NEVER invent or hallucinate numbers. 3) Keep answers extremely concise and actionable."
        ),
        tools=[get_live_store_context],
        temperature=0.1
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=request.query,
            config=config
        )
        return {"reply": response.text}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Local Fallback when Gemini is overloaded (503)
        q = request.query.lower()
        if 'review' in q or 'stock' in q:
            import sqlite3
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT item_name, stock_count FROM inventory WHERE stock_count <= restock_threshold")
            low_items = c.fetchall()
            conn.close()
            if low_items:
                msg = "⚠️ *Copilot Fallback:* Gemini AI is currently experiencing high demand (503), but I scanned your local database.\n\n**LOW STOCK ALERTS:**\n"
                for item in low_items:
                    msg += f"- {item[0]} (Only {item[1]} units left)\n"
                msg += "\nShould I draft a restock order to your suppliers?"
                return {"reply": msg}
            else:
                return {"reply": "Gemini AI is busy right now. I checked locally: Your stock looks healthy!"}
        
        return {"reply": "Sorry, the Google Gemini AI is currently experiencing very high demand (Error 503). Please try again in a moment."}


app.include_router(webhooks_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(paytm_webhook_router, prefix="/api/v1/webhook")
app.include_router(dashboard_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Paytm AI Copilot API"}

@app.get("/api/transactions")
async def get_mock_transactions():
    return [
        {
            "id": "tx1",
            "payer_name": "Aarav Sharma",
            "upi_id": "aarav@paytm",
            "utr": "312456789011",
            "amount": 450.0,
            "status": "Success",
            "timestamp": "Today, 11:15 AM"
        },
        {
            "id": "tx2",
            "payer_name": "Bank Settlement",
            "upi_id": "NA",
            "utr": "312456789012",
            "amount": -10500.0,
            "status": "Settled",
            "timestamp": "Today, 10:00 AM"
        },
        {
            "id": "tx3",
            "payer_name": "Priya Verma",
            "upi_id": "priya.v@okaxis",
            "utr": "312456789013",
            "amount": 240.0,
            "status": "Success",
            "timestamp": "Today, 09:45 AM"
        },
        {
            "id": "tx4",
            "payer_name": "Rahul Kumar",
            "upi_id": "rahul.k@ybl",
            "utr": "312456789014",
            "amount": 185.0,
            "status": "Success",
            "timestamp": "Today, 09:30 AM"
        },
        {
            "id": "tx5",
            "payer_name": "Suresh Patel",
            "upi_id": "suresh@paytm",
            "utr": "312456789015",
            "amount": -50.0,
            "status": "Refunded",
            "timestamp": "Yesterday, 06:15 PM"
        },
        {
            "id": "tx6",
            "payer_name": "Neha Gupta",
            "upi_id": "neha@paytm",
            "utr": "312456789016",
            "amount": 320.0,
            "status": "Success",
            "timestamp": "Yesterday, 05:20 PM"
        }
    ]

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}



