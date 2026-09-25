import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Normalise all backend URLs to 127.0.0.1 (avoids IPv6 localhost resolution issues)
content = content.replace("'http://localhost:8000/", "'http://127.0.0.1:8000/")
content = content.replace('"http://localhost:8000/', '"http://127.0.0.1:8000/')

# 2. The existing DOMContentLoaded upload block is good.
# But the first DOMContentLoaded (transaction fetcher) has a bare try/catch that 
# swallows errors silently. Add a console.error so we can see it.
content = content.replace(
    "} catch (e) {\n      console.error(\"Error fetching transactions:\", e);",
    "} catch (e) {\n      console.error(\"TRANSACTION FETCH ERROR:\", e);"
)

with open('frontend/public/passbook.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done. All backend URLs normalised to 127.0.0.1")
