import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = h.replace(
    'list.innerHTML = `<div class="p-8 text-center text-gray-500">No inventory found. Upload your JSON file to sync!</div>\';',
    'list.innerHTML = \'<div class="p-8 text-center text-gray-500">No inventory found. Upload your JSON file to sync!</div>\';'
)

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed inventory empty state syntax')
