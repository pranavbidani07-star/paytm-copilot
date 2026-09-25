from database import engine, Base, SessionLocal, Inventory

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if already seeded
    existing_item = db.query(Inventory).filter(Inventory.sku_id == "SKU_MILK_01").first()
    if not existing_item:
        new_item = Inventory(
            sku_id="SKU_MILK_01",
            item_name="Amul Milk 1L",
            stock_count=12,
            restock_threshold=10
        )
        db.add(new_item)
        db.commit()
        print("Successfully seeded Inventory table with Amul Milk 1L.")
    else:
        print("Database is already seeded.")
        
    db.close()

if __name__ == "__main__":
    seed_database()
