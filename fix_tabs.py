import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the static `const cards = document.querySelectorAll('.product-card');`
# with a dynamic query in `applyFilters()`
html = html.replace(
    "const cards = document.querySelectorAll('.product-card');",
    "// cards queried dynamically in applyFilters"
)

html = html.replace(
    "cards.forEach(card => {",
    "const cards = document.querySelectorAll('.product-card');\n    cards.forEach(card => {"
)

# Also I need to call applyFilters() after my fetch completes!
html = html.replace(
    "list.innerHTML = '<div class=\"p-8 text-center text-error\">Failed to load inventory from server.</div>';",
    "list.innerHTML = '<div class=\"p-8 text-center text-error\">Failed to load inventory from server.</div>';\n    if (typeof applyFilters === 'function') applyFilters();"
)

html = html.replace(
    "            </div>`;\n        });",
    "            </div>`;\n        });\n        if (typeof applyFilters === 'function') applyFilters();"
)

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Fixed applyFilters')
