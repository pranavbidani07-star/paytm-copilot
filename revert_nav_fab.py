import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 1. Read passbook.html to get the nav bar
with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    ph = f.read()

nav_start = ph.find('<nav class="fixed bottom-0')
nav_end = ph.find('</nav>', nav_start) + 6
passbook_nav = ph[nav_start:nav_end]

# 2. Modify passbook nav to make Home active instead of Passbook
# First, remove aria-current="page" and active classes from Passbook
# Passbook active class: text-[#002E6E] font-semibold
# Passbook inactive class: text-on-surface-variant transition-colors group
import re

# We will just reconstruct the nav items to be perfectly safe
new_nav = """<nav class="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,46,110,0.06)]" data-active-classes="text-[#002E6E] font-semibold"><div class="flex items-center justify-around h-16 px-space-xs"><a aria-current="page" class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors group text-[#002E6E] font-semibold" data-path="merchant-dashboard" href="dashboard.html"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">home</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Home</span></a><a class="flex flex-col items-center justify-center min-w-[56px] h-12 text-on-surface-variant transition-colors group" data-path="passbook" href="passbook.html"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">receipt_long</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Passbook</span></a><a class="flex flex-col items-center justify-center min-w-[56px] h-12 text-on-surface-variant transition-colors group" data-path="merchant-lending" href="loans.html"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">credit_score</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Loans</span></a><a class="flex flex-col items-center justify-center min-w-[56px] h-12 text-on-surface-variant transition-colors group" data-path="business-account" href="#"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">store</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Account</span></a></div></nav>"""

# 3. Read dashboard.html
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    dh = f.read()

# 4. Replace nav bar in dashboard
dh_nav_start = dh.find('<nav ')
dh_nav_end = dh.find('</nav>', dh_nav_start) + 6
if dh_nav_start != -1:
    dh = dh[:dh_nav_start] + new_nav + dh[dh_nav_end:]

# 5. Get the FAB from passbook.html
fab_start = ph.find('<aside aria-label="AI Assistant"')
fab_end = ph.find('</aside>', fab_start) + 8
passbook_fab = ph[fab_start:fab_end]
# Modify it to be bottom-24 and z-[60] so it's fully visible!
passbook_fab = passbook_fab.replace('bottom-20 z-40', 'bottom-24 z-[60]')
passbook_fab = passbook_fab.replace('onclick="toggleChat()"', 'onclick="document.getElementById(\'copilotDrawer\').classList.remove(\'translate-y-full\')"')

# 6. Replace FAB in dashboard.html
dh_fab_start = dh.find('<aside aria-label="AI Assistant"')
dh_fab_end = dh.find('</aside>', dh_fab_start) + 8
if dh_fab_start != -1:
    dh = dh[:dh_fab_start] + passbook_fab + dh[dh_fab_end:]

with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dh)

print("Reverted to passbook's nav and FAB!")
