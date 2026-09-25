from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.db.database import AsyncSessionLocal
from app.db.models import Inventory
from sqlalchemy.future import select
from ws_manager import manager
from ai_service import generate_morning_digest

async def run_morning_briefing():
    print("Running 6 AM Morning Briefing Cron Job...")
    
    # Query database for recent data
    async with AsyncSessionLocal() as session:
        # Mocking the transaction data query for now
        transaction_data = "Yesterday's successful transactions: ₹14,200 (45 txns)."
        
        # Querying real inventory data
        result = await session.execute(select(Inventory).filter(Inventory.current_stock <= Inventory.reorder_threshold))
        low_stock_items = result.scalars().all()
        
        inventory_data = "Low stock items:\n"
        if low_stock_items:
            for item in low_stock_items:
                inventory_data += f"- {item.item_name} (Current: {item.current_stock}, Threshold: {item.reorder_threshold})\n"
        else:
            inventory_data += "All inventory levels are healthy."
            
    # Generate structured digest
    digest_json = generate_morning_digest(inventory_data, transaction_data)
    
    # Broadcast to the frontend
    await manager.broadcast(f"DIGEST|{digest_json}")
    print(f"Broadcasted digest: {digest_json}")

scheduler = AsyncIOScheduler()
scheduler.add_job(run_morning_briefing, 'cron', hour=6, minute=0)
