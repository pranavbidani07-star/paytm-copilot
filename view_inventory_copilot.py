import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    h = f.read()
idx = h.find('id="copilot-window"')
print(h[max(0, idx):min(len(h), idx+2000)])
