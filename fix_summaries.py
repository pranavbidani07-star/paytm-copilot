import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add IDs to the hardcoded summary values so we can update them in JS
html = html.replace(
    '<div class="font-display-currency-mobile text-display-currency-mobile text-on-surface">₹45,200</div>',
    '<div id="total-inventory-val" class="font-display-currency-mobile text-display-currency-mobile text-on-surface">... Units</div>'
)

html = html.replace(
    '<div class="font-display-currency-mobile text-display-currency-mobile text-error">3 Items</div>',
    '<div id="low-stock-val" class="font-display-currency-mobile text-display-currency-mobile text-error">... Items</div>'
)

# Update JS to calculate these values dynamically
script_find = "counts[cat]++;"
script_replace = """counts[cat]++;
            totalUnits += item.stock_count;"""

# Inject let totalUnits = 0; before the loop
html = html.replace(
    "let counts = { all: items.length, 'low-stock': 0, grocery: 0, instant: 0, dairy: 0 };",
    "let counts = { all: items.length, 'low-stock': 0, grocery: 0, instant: 0, dairy: 0 };\n        let totalUnits = 0;"
)

html = html.replace(script_find, script_replace)

# Inject DOM update after the loop
dom_update_find = "const chips = document.querySelectorAll('.chip');"
dom_update_replace = """
        const totalEl = document.getElementById('total-inventory-val');
        if (totalEl) totalEl.innerText = totalUnits + ' Units';
        
        const lowEl = document.getElementById('low-stock-val');
        if (lowEl) lowEl.innerText = counts['low-stock'] + (counts['low-stock'] === 1 ? ' Item' : ' Items');
        
        const chips = document.querySelectorAll('.chip');"""

html = html.replace(dom_update_find, dom_update_replace)

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Made summary cards dynamic")
