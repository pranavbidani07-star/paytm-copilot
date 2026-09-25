import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/payments.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = h.replace('chatInput.value = "Restock 20 units of Amul Butter";', 'chatInput.value = "Show my latest transactions";')
h = h.replace('Amul Butter', 'Surf Excel') # Just in case

with open('frontend/public/payments.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed payments copilot fallback')
