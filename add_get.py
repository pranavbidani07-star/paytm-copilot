with open('backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('def get_live_store_context')

new_route = """
@app.get("/api/inventory")
async def get_inventory():
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT item_name, stock_count, restock_threshold FROM inventory") as cursor:
            rows = await cursor.fetchall()
            return [{"item_name": row[0], "stock_count": row[1], "restock_threshold": row[2]} for row in rows]

"""

content = content[:idx] + new_route + content[idx:]
with open('backend/main.py', 'w', encoding='utf-8') as f:
    f.write(content)
