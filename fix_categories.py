import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

script_find = "items.forEach(item => {"
script_replace = """
        let counts = { all: items.length, 'low-stock': 0, grocery: 0, instant: 0, dairy: 0 };

        items.forEach(item => {
            const isLow = item.stock_count <= item.restock_threshold;
            const initials = item.item_name.substring(0, 2).toUpperCase();
            
            let nameLower = item.item_name.toLowerCase();
            let cat = 'grocery';
            if (nameLower.includes('milk') || nameLower.includes('butter') || nameLower.includes('paneer') || nameLower.includes('curd')) {
                cat = 'dairy';
            } else if (nameLower.includes('noodle') || nameLower.includes('maggi') || nameLower.includes('biscuit') || nameLower.includes('bhujia') || nameLower.includes('chips') || nameLower.includes('snack')) {
                cat = 'instant';
            }
            
            if (isLow) counts['low-stock']++;
            counts[cat]++;
            
            list.innerHTML += `
            <div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="${cat}" data-status="${isLow ? 'low' : 'healthy'}">
                <div class="w-12 h-12 rounded-xl ${isLow ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'} font-headline-sm text-headline-sm flex items-center justify-center font-bold flex-shrink-0">${initials}</div>
                <div class="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div class="flex items-start justify-between gap-space-xs">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-space-2xs">
                                <h2 class="font-headline-sm text-headline-sm text-on-surface truncate">${item.item_name}</h2>
                                ${isLow ? '<span class="w-2 h-2 rounded-full bg-error flex-shrink-0"></span>' : ''}
                            </div>
                            <div class="flex items-center gap-space-xs mt-0.5">
                                <span class="font-label-caps text-label-caps ${isLow ? 'text-error' : 'text-outline'} flex-shrink-0">Threshold: ${item.restock_threshold}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
                        <div class="font-data-mono-num text-[16px] text-on-surface font-bold"></div>
                        <div class="flex items-center gap-1 ${isLow ? 'text-error bg-error-container/60' : 'text-on-tertiary-container bg-surface-container-low'} px-space-xs py-0.5 rounded-full font-body-sm text-body-sm font-bold">
                            <span class="material-symbols-outlined text-[16px]">${isLow ? 'warning' : 'check_circle'}</span>
                            <span>${isLow ? 'Stock: ' + item.stock_count + ' units' : 'In Stock: ' + item.stock_count + ' units'}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        
        // Update chip numbers
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            const filterType = chip.getAttribute('data-filter');
            let text = chip.textContent.trim().split(' (')[0];
            chip.textContent = text + ' (' + (counts[filterType] || 0) + ')';
        });
"""

# We need to replace the old forEach loop logic that I injected earlier.
# The old logic starts with "items.forEach(item => {" and ends just before "        if (typeof applyFilters === 'function') applyFilters();"
start_idx = html.find("items.forEach(item => {")
end_idx = html.find("if (typeof applyFilters === 'function') applyFilters();")

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + script_replace + "\n        " + html[end_idx:]
    with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed categories and counts")
else:
    print("Could not find script block")
