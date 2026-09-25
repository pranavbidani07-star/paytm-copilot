import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    h = f.read()
idx = h.find('onclick="toggleChat()"')
print('PASSBOOK:')
print(h[idx-10:idx+250])

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    h2 = f.read()
idx2 = h2.find('onclick="toggleChat()"')
print('\nINVENTORY:')
print(h2[idx2-10:idx2+250])
