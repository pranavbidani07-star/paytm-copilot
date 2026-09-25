import sys

with open('backend/main.py', 'r', encoding='utf-8') as f:
    html = f.read()

target = """async def _write_inventory(data):
    rows = _normalize_inventory(data)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM inventory")
        for row in rows:
            await db.execute(
                "INSERT INTO inventory (item_name, stock_count, restock_threshold) VALUES (?, ?, ?)",
                (row["item_name"], row["stock_count"], row["restock_threshold"])
            )
        await db.commit()
    return rows"""

replacement = """async def _write_inventory(data):
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
    return rows"""

if target in html:
    html = html.replace(target, replacement)
    with open('backend/main.py', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully updated _write_inventory")
else:
    print("Could not find target block in main.py")
