import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def fix_fetch(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        h = f.read()
    
    # Replace the exact literal string with single quotes to backticks
    h = h.replace(
        "fetch('http://${window.location.hostname}:8000/api/inventory')",
        "fetch(`http://${window.location.hostname}:8000/api/inventory`)"
    )
    h = h.replace(
        "fetch(\"http://${window.location.hostname}:8000/api/v1/chat\",",
        "fetch(`http://${window.location.hostname}:8000/api/v1/chat`,"
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(h)
    print(f"Fixed backticks in {filename}")

fix_fetch('frontend/public/inventory.html')
fix_fetch('frontend/public/dashboard.html')
