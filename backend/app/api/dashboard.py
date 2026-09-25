from fastapi import APIRouter
import aiosqlite
from typing import List, Dict, Any

router = APIRouter()
DB_PATH = "./copilot.db"

@router.get("/inventory")
async def get_inventory() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM inventory ORDER BY stock_count ASC")
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/transactions")
async def get_transactions() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 10")
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/metrics")
async def get_metrics() -> Dict[str, Any]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        
        cursor = await db.execute("SELECT SUM(amount) as total_sales FROM transactions")
        sales_row = await cursor.fetchone()
        total_sales = sales_row["total_sales"] if sales_row and sales_row["total_sales"] else 0
        
        cursor = await db.execute("SELECT COUNT(*) as low_stock_count FROM inventory WHERE stock_count <= restock_threshold")
        stock_row = await cursor.fetchone()
        low_stock_count = stock_row["low_stock_count"] if stock_row else 0
        
        return {
            "total_sales": total_sales,
            "low_stock_count": low_stock_count
        }
