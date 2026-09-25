import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def patch_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        h = f.read()
    
    h = h.replace('http://127.0.0.1:8000', 'http://${window.location.hostname}:8000')
    # Since it's inside quotes, if it's in single or double quotes, we need to change it to backticks!
    
    # Let's use regex
    import re
    h = re.sub(r'[\'"]http://127\.0\.0\.1:8000/([^\'"]+)[\'"]', r'`http://${window.location.hostname}:8000/\1`', h)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(h)
    print(f"Patched {filename}")

patch_file('frontend/public/inventory.html')
patch_file('frontend/public/dashboard.html')
