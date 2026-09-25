import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

target = """<!-- Settings Action -->

<button id="navSettings" onclick="window.location.href='dashboard.html'" class="flex flex-col items-center group active:scale-95 transition-transform" type="button">

<div class="w-12 h-12 rounded-2xl bg-surface-container-low text-on-surface-variant flex items-center justify-center shadow-sm group-hover:bg-surface-container">

<span class="material-symbols-outlined text-[22px]">settings</span>

</div>

<span class="font-body-sm text-body-sm text-on-surface font-semibold mt-1.5">Settings</span>

</button>"""

if target in h:
    h = h.replace(target, '')
    with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
        f.write(h)
    print("Removed settings button")
else:
    print("Target not found. Will try a more robust removal.")
    start = h.find('<!-- Settings Action -->')
    if start != -1:
        end = h.find('</button>', start) + 9
        h = h[:start] + h[end:]
        with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
            f.write(h)
        print("Removed settings button via fallback")
    else:
        print("Still not found")
