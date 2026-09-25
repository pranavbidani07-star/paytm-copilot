import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

replacement = """        if (lowItems.length > 0) {
            let item = lowItems[0];
            text.innerHTML = `${item.item_name} has only <span class="text-error font-bold font-data-mono-num">${item.stock_count} units</span> left. Daily run-rate predicts stockout soon.`;
            
            // Update Copilot recommendation
            const copilotAlert = document.getElementById('copilot-alert-text');
            if (copilotAlert) {
                copilotAlert.innerHTML = `Alert: <span class="font-semibold text-error">${item.item_name}</span> is down to ${item.stock_count} packs. You have a pre-approved <span class="font-bold text-secondary">₹5,000 credit line</span> available to auto-order 20 units with next-morning delivery.`;
            }
            const copilotBtnName = document.getElementById('copilot-restock-name');
            if (copilotBtnName) {
                copilotBtnName.innerText = item.item_name;
            }
            window.currentLowStockItem = item.item_name;
        } else {"""

h = h.replace(
    '        if (lowItems.length > 0) {\n            let item = lowItems[0];\n            text.innerHTML = `${item.item_name} has only <span class="text-error font-bold font-data-mono-num">${item.stock_count} units</span> left. Daily run-rate predicts stockout soon.`;\n        } else {',
    replacement
)

with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Updated Dashboard Copilot JS')
