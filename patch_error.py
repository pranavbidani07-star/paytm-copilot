import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    h = f.read()
h = h.replace(
    'list.innerHTML = \'<div class="p-8 text-center text-error">Failed to load inventory from server.</div>\';', 
    'list.innerHTML = \'<div class="p-8 text-center text-error">Failed: \' + (e.message || String(e)) + \'</div>\';'
)
with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Patched error output')
