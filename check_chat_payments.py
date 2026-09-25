import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/payments.html', 'r', encoding='utf-8') as f:
    h = f.read()
idx = h.find('chatInput')
if idx != -1:
    print(h[max(0, idx-1000):idx+1000])
