import sys, io
import glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

html_files = glob.glob('frontend/public/*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        h = f.read()
    
    # Replace single quote with backtick
    h = h.replace("'http://${window.location.hostname}:8000", "`http://${window.location.hostname}:8000")
    # Also need to replace the closing single quote. But since the URL usually ends at 8000/...', let's be careful.
    import re
    h = re.sub(r"`http://\$\{window\.location\.hostname\}:8000/([^']*)'", r"`http://${window.location.hostname}:8000/\1`", h)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(h)
    print(f"Fixed {file}")
