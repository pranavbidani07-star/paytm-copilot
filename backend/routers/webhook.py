from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ws_manager import manager
from database import get_db, Transaction, Inventory
from ai_service import evaluate_working_capital

router = APIRouter()

class PaytmWebhookPayload(BaseModel):
    txn_id: str
    amount: float
    status: str
    merchant_id: str
    checksumhash: str = "fake"
    sku_id: str = "SKU_MILK_01" # Defaulting for simulation

def verify_checksum(payload: PaytmWebhookPayload) -> bool:
    """
    Placeholder for Paytm signature verification.
    """
    return True

@router.post("/paytm", status_code=status.HTTP_200_OK)
async def handle_paytm_webhook(payload: PaytmWebhookPayload, db: Session = Depends(get_db)):
    """
    Handles incoming payment notifications from Paytm S2S webhooks.
    """
    # 1. Verify Checksum
    if not verify_checksum(payload):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid Checksum"
        )
    
    # 2. Process Successful Transaction
    alert_msg = None
    ai_response = None
    if payload.status == "TXN_SUCCESS":
        print(f"Database updated: Added ₹{payload.amount} to merchant {payload.merchant_id}'s daily ledger.")
        
        # Insert Transaction record
        new_txn = Transaction(
            txn_id=payload.txn_id,
            amount=payload.amount,
            sku_id=payload.sku_id
        )
        db.add(new_txn)
        
        # Query Inventory and decrement
        inventory_item = db.query(Inventory).filter(Inventory.sku_id == payload.sku_id).first()
        if inventory_item:
            inventory_item.stock_count -= 1
            
            # AI Trigger Evaluation
            if inventory_item.stock_count < inventory_item.restock_threshold:
                alert_msg = f"🚨 AI COPILOT ALERT: {inventory_item.item_name} stock dropped to {inventory_item.stock_count}."
                print(f"{alert_msg} Triggering restock evaluation.")
                ai_response = await evaluate_working_capital(inventory_item.item_name, inventory_item.stock_count)
                
        db.commit()
        
        await manager.broadcast(f"PAYMENT|{payload.amount}|{payload.txn_id}")
    
    # 3. Return acknowledgment to Paytm
    return {"status": "success", "alert": alert_msg, "ai_copilot": ai_response}
