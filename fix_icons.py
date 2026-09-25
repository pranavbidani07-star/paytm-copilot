import sys

new_button = """<aside aria-label="AI Assistant" class="fixed right-4 bottom-20 z-40">
<button class="flex items-center gap-2 bg-gradient-to-r from-[#2bc6ff] via-[#006686] to-[#002e6e] text-white px-4 py-3 rounded-full shadow-[0_8px_24px_rgba(43,198,255,0.45),0_4px_12px_rgba(0,46,110,0.3)] active:scale-95 transition-all" onclick="toggleChat()">
<div class="relative">
<span class="material-symbols-outlined text-[22px] animate-spin" style="animation-duration: 6s;">auto_awesome</span>
<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#53de9e] ring-2 ring-[#001a45]"></span>
</div>
<span class="font-body-sm text-body-sm font-bold tracking-tight">AI Copilot</span>
</button>
</aside>"""

# Replace in passbook.html
with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    pb = f.read()

pb_old_start = pb.find('<button onclick="toggleChat()"')
pb_old_end = pb.find('</button>', pb_old_start) + 9

if pb_old_start != -1:
    pb = pb[:pb_old_start] + new_button + pb[pb_old_end:]
    with open('frontend/public/passbook.html', 'w', encoding='utf-8') as f:
        f.write(pb)
    print("Fixed passbook.html")

# Replace in inventory.html
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    inv = f.read()

inv_old_start = inv.find('<button onclick="toggleChat()"')
inv_old_end = inv.find('</button>', inv_old_start) + 9

if inv_old_start != -1:
    inv = inv[:inv_old_start] + new_button + inv[inv_old_end:]
    with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
        f.write(inv)
    print("Fixed inventory.html")
