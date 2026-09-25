import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

target = '<div class="grid grid-cols-4 gap-space-2xs bg-surface-container-lowest p-space-sm rounded-3xl shadow-sm">'
replacement = '<div class="grid grid-cols-3 gap-space-2xs bg-surface-container-lowest p-space-sm rounded-3xl shadow-sm">'

if target in h:
    h = h.replace(target, replacement)
    with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
        f.write(h)
    print("Fixed grid layout in dashboard")
else:
    print("Target not found")
