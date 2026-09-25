import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()
idx = h.find('id="copilotDrawer"')
print(h[max(0, idx-200):min(len(h), idx+200)])
