import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()
import re
match = re.search(r'<div[^>]*id=[\'"]copilotDrawer[\'"][^>]*>', h)
if match:
    print('Drawer start:', match.start())
else:
    print('Drawer not found!')
