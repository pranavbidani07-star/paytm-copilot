import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()
h = h.replace('class="fixed inset-x-0 bottom-0 z-50 transform', 'class="fixed inset-x-0 bottom-0 z-[60] transform')
with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed z-index')
