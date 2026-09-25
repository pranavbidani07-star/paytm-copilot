import re
import sys

filepath = r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\dashboard.html'
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
except FileNotFoundError:
    print("File not found")
    sys.exit(1)

# 1. Update Navigation Links in dashboard.html itself
# Top nav action row
html = html.replace('id="navPassbook" class="', 'id="navPassbook" onclick="window.location.href=\'passbook.html\'" class="')
html = html.replace('id="navLoans" class="', 'id="navLoans" onclick="window.location.href=\'dashboard.html\'" class="') 
html = html.replace('id="navInventory" class="', 'id="navInventory" onclick="window.location.href=\'inventory.html\'" class="')
html = html.replace('id="navSettings" class="', 'id="navSettings" onclick="window.location.href=\'dashboard.html\'" class="')

# Bottom nav bar
html = html.replace('data-path="merchant-dashboard" href="#"', 'data-path="merchant-dashboard" href="dashboard.html"')
html = html.replace('data-path="passbook-ledger" href="#"', 'data-path="passbook-ledger" href="passbook.html"')
html = html.replace('data-path="payment-transactions" href="#"', 'data-path="payment-transactions" href="payments.html"')

# Remove the JS event listeners for the nav actions
js_to_remove = """  // Nav Icons Logic
  const navActions = [
    { id: "navPassbook", prompt: "Show my recent passbook ledger" },
    { id: "navLoans", prompt: "Check my working capital loan status" },
    { id: "navInventory", prompt: "Show me my full inventory report" },
    { id: "navSettings", prompt: "Open store settings" }
  ];

  navActions.forEach(action => {
    const btn = document.getElementById(action.id);
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById('copilotDrawer').classList.remove('translate-y-full');
        chatInput.value = action.prompt;
        sendMessage();
      });
    }
  });"""

html = html.replace(js_to_remove, "")

# Write updated dashboard.html
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)

# Now create inventory.html, passbook.html, payments.html
# First, extract everything outside of <main>...</main>
match = re.search(r'(.*?<main class="[^"]*">\s*<div class="[^"]*">)(.*?)(</div>\s*</main>.*)', html, re.DOTALL)
if match:
    header_part = match.group(1)
    footer_part = match.group(3)
else:
    print("Could not match HTML structure")
    sys.exit(1)

# Function to write a new page
def write_page(filename, content):
    with open(rf'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\{filename}', 'w', encoding='utf-8') as f:
        f.write(header_part + content + footer_part)

# Inventory Content
inventory_content = """
<section class="px-margin py-space-md">
    <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface mb-space-sm">Inventory</h2>
    <div class="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="border-b border-surface-container">
                    <th class="py-2 text-on-surface-variant font-label-caps">Item</th>
                    <th class="py-2 text-on-surface-variant font-label-caps text-right">Stock</th>
                </tr>
            </thead>
            <tbody class="font-body-md text-on-surface">
                <tr class="border-b border-surface-container">
                    <td class="py-3 font-semibold">Amul Butter 100g</td>
                    <td class="py-3 text-right text-error font-bold">2</td>
                </tr>
                <tr class="border-b border-surface-container">
                    <td class="py-3 font-semibold">Aashirvaad Atta 5kg</td>
                    <td class="py-3 text-right text-primary font-bold">14</td>
                </tr>
                <tr class="border-b border-surface-container">
                    <td class="py-3 font-semibold">Fortune Mustard Oil 1L</td>
                    <td class="py-3 text-right text-primary font-bold">8</td>
                </tr>
                <tr class="border-b border-surface-container">
                    <td class="py-3 font-semibold">Cadbury Dairy Milk Silk</td>
                    <td class="py-3 text-right text-primary font-bold">25</td>
                </tr>
                <tr>
                    <td class="py-3 font-semibold">Tata Tea Gold 500g</td>
                    <td class="py-3 text-right text-primary font-bold">12</td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
"""
write_page('inventory.html', inventory_content)

# Passbook Content
passbook_content = """
<section class="px-margin py-space-md">
    <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface mb-space-sm">Passbook</h2>
    <div class="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm">
        <div class="flex flex-col space-y-space-sm">
            <div class="flex items-center justify-between py-space-xs border-b border-surface-container last:border-0">
                <div>
                    <span class="font-body-md text-body-md font-semibold block">Settlement to Bank ending 9821</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">Today, 10:00 AM</span>
                </div>
                <div class="text-right">
                    <span class="font-headline-sm text-headline-sm font-bold text-primary block">-₹10,500</span>
                    <span class="text-secondary font-label-caps text-[10px]">Settled</span>
                </div>
            </div>
            <div class="flex items-center justify-between py-space-xs border-b border-surface-container last:border-0">
                <div>
                    <span class="font-body-md text-body-md font-semibold block">Customer UPI Payment</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">Today, 10:45 AM</span>
                </div>
                <div class="text-right">
                    <span class="font-headline-sm text-headline-sm font-bold text-tertiary block">+₹240</span>
                </div>
            </div>
            <div class="flex items-center justify-between py-space-xs border-b border-surface-container last:border-0">
                <div>
                    <span class="font-body-md text-body-md font-semibold block">Customer QR Payment</span>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">Today, 10:38 AM</span>
                </div>
                <div class="text-right">
                    <span class="font-headline-sm text-headline-sm font-bold text-tertiary block">+₹185</span>
                </div>
            </div>
        </div>
    </div>
</section>
"""
write_page('passbook.html', passbook_content)

# Payments Content
payments_content = """
<section class="px-margin py-space-md flex flex-col items-center">
    <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface mb-space-md w-full text-left">Accept Payment</h2>
    <div class="bg-surface-container-lowest rounded-3xl p-space-xl shadow-sm flex flex-col items-center w-full">
        <span class="font-body-md text-body-md text-on-surface-variant mb-space-md">Scan to Pay</span>
        <div class="w-48 h-48 bg-surface-container rounded-2xl flex items-center justify-center mb-space-md">
            <span class="material-symbols-outlined text-[64px] text-primary">qr_code_2</span>
        </div>
        <button class="w-full bg-primary-container text-white py-3 rounded-xl font-body-sm font-semibold shadow-md active:scale-95 transition-transform flex justify-center items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">share</span>
            Share Payment Link
        </button>
    </div>
</section>
"""
write_page('payments.html', payments_content)
print("done")
