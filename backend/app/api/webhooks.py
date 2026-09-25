from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime

from app.db.database import get_db
from app.db.models import Inventory, Transaction

router = APIRouter()

class PaytmWebhookPayload(BaseModel):
    txn_id: str
    merchant_id: str
    amount: float
    status: str
    sku_id: str

class ERPSyncPayload(BaseModel):
    sku_id: str
    updated_stock: int

@router.post("/webhook/paytm", status_code=status.HTTP_200_OK)
async def paytm_s2s_webhook(payload: PaytmWebhookPayload, db: AsyncSession = Depends(get_db)):
    """
    Ingests payment status (e.g. TXN_SUCCESS), records the transaction, 
    and decrements the linked inventory stock by 1.
    """
    # 1. Check for duplicate webhook (idempotency)
    existing_txn = await db.execute(select(Transaction).filter(Transaction.txn_id == payload.txn_id))
    if existing_txn.scalars().first():
        return {"message": "Transaction already processed", "txn_id": payload.txn_id}

    # 2. Insert transaction record
    new_txn = Transaction(
        txn_id=payload.txn_id,
        merchant_id=payload.merchant_id,
        amount=payload.amount,
        status=payload.status,
        linked_sku_id=payload.sku_id,
        created_at=datetime.utcnow()
    )
    db.add(new_txn)
    
    # 2. Decrement stock if TXN_SUCCESS
    if payload.status == "TXN_SUCCESS":
        result = await db.execute(select(Inventory).filter(Inventory.sku_id == payload.sku_id))
        inventory_item = result.scalars().first()
        
        if inventory_item:
            inventory_item.current_stock -= 1
        else:
            # If sku is invalid, we might want to log it but still record the transaction
            pass
            
    await db.commit()
    return {"message": "Webhook processed successfully", "txn_id": payload.txn_id}

@router.post("/webhook/erp/sync", status_code=status.HTTP_200_OK)
async def erp_inventory_sync(payload: ERPSyncPayload, db: AsyncSession = Depends(get_db)):
    """
    Syncs inventory updates from Khatabook/Marg ERP to keep stock levels accurate.
    """
    result = await db.execute(select(Inventory).filter(Inventory.sku_id == payload.sku_id))
    inventory_item = result.scalars().first()
    
    if not inventory_item:
        raise HTTPException(status_code=404, detail="SKU not found")
        
    inventory_item.current_stock = payload.updated_stock
    await db.commit()
    
    return {"message": "Inventory synced successfully", "sku_id": payload.sku_id, "new_stock": payload.updated_stock}
