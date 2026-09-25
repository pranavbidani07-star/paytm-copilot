import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    h = f.read()
idx = h.find('chatInput')
if idx != -1:
    print(h[idx-500:idx+500])
