import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

for root, dirs, files in os.walk('frontend/public'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                h = f.read()
            m = re.search(r'id=[\'\"]chatContainer[\'\"]', h)
            if m:
                print(f'=== {file} ===')
