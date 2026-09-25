import sqlite3
conn = sqlite3.connect('backend/copilot.db')
c = conn.cursor()
c.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='inventory'")
print(c.fetchone()[0])
conn.close()
