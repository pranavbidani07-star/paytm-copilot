import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_idx = html.find('<div class="space-y-space-sm" id="inventory-list">')
empty_state_idx = html.find('<!-- Empty Search State Placeholder')
end_idx = html.rfind('</div>', start_idx, empty_state_idx) + 6

script_injection = """
<script>
document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('inventory-list');
    try {
        const res = await fetch('http://127.0.0.1:8000/api/inventory');
        const items = await res.json();
        
        if (items.length === 0) {
            list.innerHTML = '<div class="p-8 text-center text-gray-500">No inventory found. Upload your Khatabook JSON to sync!</div>';
            return;
        }

        list.innerHTML = '';
        items.forEach(item => {
            const isLow = item.stock_count <= item.restock_threshold;
            const initials = item.item_name.substring(0, 2).toUpperCase();
            
            list.innerHTML += `
            <div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="grocery" data-status="${isLow ? 'low' : 'healthy'}">
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
    } catch(e) {
        console.error(e);
        list.innerHTML = '<div class="p-8 text-center text-error">Failed to load inventory from server.</div>';
    }
});
</script>
"""

new_html = html[:start_idx] + '<div class="space-y-space-sm" id="inventory-list"></div>\n  ' + html[end_idx:]

body_end = new_html.find('</body>')
new_html = new_html[:body_end] + script_injection + new_html[body_end:]

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("inventory.html updated")
