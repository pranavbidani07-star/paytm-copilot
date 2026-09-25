import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

target = '<span class="absolute -top-1 -right-1 bg-error text-white font-label-caps text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>'

if target in h:
    h = h.replace(target, '')
    with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
        f.write(h)
    print("Removed notification badge from inventory button")
else:
    print("Target not found")
