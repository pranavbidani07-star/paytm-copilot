import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"reply": "Network connection thoda slow hai, par aapka â‚¹50,000 ka Paytm credit line abhi bhi active hai."}"""

replacement = """    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Local Fallback when Gemini is overloaded (503)
        q = request.query.lower()
        if 'review' in q or 'stock' in q:
            import sqlite3
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT item_name, stock_count FROM inventory WHERE stock_count <= restock_threshold")
            low_items = c.fetchall()
            conn.close()
            if low_items:
                msg = "⚠️ *Copilot Fallback:* Gemini AI is currently experiencing high demand (503), but I scanned your local database.\\n\\n**LOW STOCK ALERTS:**\\n"
                for item in low_items:
                    msg += f"- {item[0]} (Only {item[1]} units left)\\n"
                msg += "\\nShould I draft a restock order to your suppliers?"
                return {"reply": msg}
            else:
                return {"reply": "Gemini AI is busy right now. I checked locally: Your stock looks healthy!"}
        
        return {"reply": "Sorry, the Google Gemini AI is currently experiencing very high demand (Error 503). Please try again in a moment."}"""

if target in content:
    content = content.replace(target, replacement)
    with open('backend/main.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated fallback")
else:
    print("Target not found")
