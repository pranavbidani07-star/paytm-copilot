import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = h.replace(
    'Alert: <span class="font-semibold text-error">Amul Butter</span> is down to 2 packs. You have a pre-approved <span class="font-bold text-secondary">₹5,000 credit line</span> available to auto-order 20 units with next-morning delivery.',
    '<span id="copilot-alert-text">Alert: <span class="font-semibold text-error">Amul Butter</span> is down to 2 packs. You have a pre-approved <span class="font-bold text-secondary">₹5,000 credit line</span> available to auto-order 20 units with next-morning delivery.</span>'
)

h = h.replace('Yes, Restock Amul Butter', 'Yes, Restock <span id="copilot-restock-name">Amul Butter</span>')

h = h.replace('chatInput.value = "Restock 20 units of Amul Butter";', 'chatInput.value = "Restock 20 units of " + (window.currentLowStockItem || "Amul Butter");')

with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Updated HTML')
