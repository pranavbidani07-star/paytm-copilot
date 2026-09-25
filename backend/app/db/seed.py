import asyncio
import uuid
import random
from datetime import datetime, timedelta
from .database import AsyncSessionLocal, engine, Base
from .models import Inventory, Transaction

items_data = [
    # High-velocity items near/below threshold
    {"sku_id": "SKU001", "item_name": "Fortune Sunflower Oil 1L", "current_stock": 2, "reorder_threshold": 15, "unit_cost": 140.0, "selling_price": 165.0, "supplier_id": "SUP01", "supplier_name": "Adani Wilmar Dist.", "supplier_upi": "adaniwilmar@okaxis"},
    {"sku_id": "SKU002", "item_name": "Amul Butter 500g", "current_stock": 2, "reorder_threshold": 15, "unit_cost": 210.0, "selling_price": 245.0, "supplier_id": "SUP02", "supplier_name": "Amul Gujarat", "supplier_upi": "amul@sbi"},
    # Other items
    {"sku_id": "SKU003", "item_name": "Tata Salt 1kg", "current_stock": 45, "reorder_threshold": 20, "unit_cost": 18.0, "selling_price": 25.0, "supplier_id": "SUP03", "supplier_name": "Tata Consumer", "supplier_upi": "tata@hdfc"},
    {"sku_id": "SKU004", "item_name": "Aashirvaad Shudh Chakki Atta 5kg", "current_stock": 25, "reorder_threshold": 10, "unit_cost": 190.0, "selling_price": 220.0, "supplier_id": "SUP04", "supplier_name": "ITC Ltd.", "supplier_upi": "itc@icici"},
    {"sku_id": "SKU005", "item_name": "Maggi 2-Min Noodles 70g", "current_stock": 120, "reorder_threshold": 50, "unit_cost": 11.5, "selling_price": 14.0, "supplier_id": "SUP05", "supplier_name": "Nestle India", "supplier_upi": "nestle@okicici"},
    {"sku_id": "SKU006", "item_name": "Parle-G 250g", "current_stock": 80, "reorder_threshold": 30, "unit_cost": 20.0, "selling_price": 25.0, "supplier_id": "SUP06", "supplier_name": "Parle Products", "supplier_upi": "parle@paytm"},
    {"sku_id": "SKU007", "item_name": "Dettol Original Soap 75g", "current_stock": 60, "reorder_threshold": 20, "unit_cost": 32.0, "selling_price": 38.0, "supplier_id": "SUP07", "supplier_name": "Reckitt Benckiser", "supplier_upi": "rb@okaxis"},
    {"sku_id": "SKU008", "item_name": "Surf Excel Easy Wash 1kg", "current_stock": 35, "reorder_threshold": 15, "unit_cost": 105.0, "selling_price": 125.0, "supplier_id": "SUP08", "supplier_name": "HUL", "supplier_upi": "hul@sbi"},
    {"sku_id": "SKU009", "item_name": "Brooke Bond Red Label Tea 250g", "current_stock": 40, "reorder_threshold": 15, "unit_cost": 115.0, "selling_price": 130.0, "supplier_id": "SUP08", "supplier_name": "HUL", "supplier_upi": "hul@sbi"},
    {"sku_id": "SKU010", "item_name": "Haldiram's Bhujia Sev 200g", "current_stock": 50, "reorder_threshold": 20, "unit_cost": 45.0, "selling_price": 55.0, "supplier_id": "SUP09", "supplier_name": "Haldirams Snacks", "supplier_upi": "haldiram@hdfc"},
    {"sku_id": "SKU011", "item_name": "Colgate MaxFresh 150g", "current_stock": 42, "reorder_threshold": 15, "unit_cost": 85.0, "selling_price": 105.0, "supplier_id": "SUP10", "supplier_name": "Colgate Palmolive", "supplier_upi": "colgate@icici"},
    {"sku_id": "SKU012", "item_name": "Dabur Honey 250g", "current_stock": 28, "reorder_threshold": 10, "unit_cost": 95.0, "selling_price": 115.0, "supplier_id": "SUP11", "supplier_name": "Dabur India", "supplier_upi": "dabur@okaxis"},
    {"sku_id": "SKU013", "item_name": "Sunsilk Black Shine Shampoo 180ml", "current_stock": 25, "reorder_threshold": 10, "unit_cost": 125.0, "selling_price": 145.0, "supplier_id": "SUP08", "supplier_name": "HUL", "supplier_upi": "hul@sbi"},
    {"sku_id": "SKU014", "item_name": "Gillette Vector Razor", "current_stock": 18, "reorder_threshold": 5, "unit_cost": 45.0, "selling_price": 60.0, "supplier_id": "SUP12", "supplier_name": "P&G", "supplier_upi": "pg@okicici"},
    {"sku_id": "SKU015", "item_name": "Britannia Good Day 250g", "current_stock": 55, "reorder_threshold": 20, "unit_cost": 30.0, "selling_price": 35.0, "supplier_id": "SUP13", "supplier_name": "Britannia Ind.", "supplier_upi": "britannia@paytm"},
]

async def seed_data():
    async with engine.begin() as conn:
        # For a clean slate during development
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Populate Inventory
        inventory_objs = []
        for item in items_data:
            inv = Inventory(**item)
            inventory_objs.append(inv)
            session.add(inv)
        
        await session.commit()
        
        # 2. Populate Transactions (exactly 50 transactions over 7 days)
        merchant_id = "M_PAYTM_9991"
        now = datetime.utcnow()
        
        # We want 50 total transactions. Let's distribute them.
        # Let's give SKU001 and SKU002 15 transactions each, and remaining 20 across others.
        for _ in range(15):
            txn = Transaction(merchant_id=merchant_id, amount=165.0 * random.randint(1,3), status="TXN_SUCCESS", created_at=now - timedelta(days=random.uniform(0, 7)), linked_sku_id="SKU001")
            session.add(txn)
        
        for _ in range(15):
            txn = Transaction(merchant_id=merchant_id, amount=245.0 * random.randint(1,2), status="TXN_SUCCESS", created_at=now - timedelta(days=random.uniform(0, 7)), linked_sku_id="SKU002")
            session.add(txn)
            
        remaining_skus = [item["sku_id"] for item in items_data[2:]]
        for _ in range(20):
            sku = random.choice(remaining_skus)
            item_info = next(i for i in items_data if i["sku_id"] == sku)
            txn = Transaction(merchant_id=merchant_id, amount=float(item_info["selling_price"]) * random.randint(1,3), status="TXN_SUCCESS", created_at=now - timedelta(days=random.uniform(0, 7)), linked_sku_id=sku)
            session.add(txn)
                
        await session.commit()
        print("Successfully seeded Indian retail inventory and transactions.")

if __name__ == "__main__":
    asyncio.run(seed_data())
