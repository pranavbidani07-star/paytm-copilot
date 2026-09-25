import asyncio
from fastapi.testclient import TestClient
from main import app
from app.db.database import AsyncSessionLocal
from app.db.models import Inventory
from sqlalchemy.future import select

client = TestClient(app)

async def verify_db():
    print("\n--- Verifying Database State ---")
    async with AsyncSessionLocal() as session:
        # Check SKU001
        result = await session.execute(select(Inventory).filter(Inventory.sku_id == "SKU001"))
        item1 = result.scalars().first()
        print(f"{item1.sku_id}: {item1.item_name} -> Stock: {item1.current_stock}")
        
        # Check SKU002
        result = await session.execute(select(Inventory).filter(Inventory.sku_id == "SKU002"))
        item2 = result.scalars().first()
        print(f"{item2.sku_id}: {item2.item_name} -> Stock: {item2.current_stock}")

def test_erp_sync():
    print("\n--- Testing ERP Sync Webhook ---")
    response = client.post(
        "/api/v1/webhook/erp/sync",
        json={
            "sku_id": "SKU001",
            "updated_stock": 50
        }
    )
    print("Response Status:", response.status_code)
    print("Response JSON:", response.json())

def test_paytm_txn():
    print("\n--- Testing Paytm TXN Webhook ---")
    response = client.post(
        "/api/v1/webhook/paytm",
        json={
            "txn_id": "TEST_TXN_001",
            "merchant_id": "M_PAYTM_9991",
            "amount": 245.0,
            "status": "TXN_SUCCESS",
            "sku_id": "SKU002"
        }
    )
    print("Response Status:", response.status_code)
    print("Response JSON:", response.json())

async def run_tests():
    print("Initial State:")
    await verify_db()
    
    test_erp_sync()
    test_paytm_txn()
    
    print("\nFinal State:")
    await verify_db()

if __name__ == "__main__":
    # TestClient blocks async loop sometimes if nested, but here it's fine
    # Actually, we will just use standard TestClient. Since we are using async endpoints and db, 
    # the TestClient handles running the endpoints in its own event loop internally.
    # We will just run our verification in asyncio.
    asyncio.run(run_tests())
