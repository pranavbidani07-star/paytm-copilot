import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def fix_copilot_close(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    old_header = '<div class="bg-[#002970] text-white p-3 font-semibold text-sm">Paytm Merchant AI</div>'
    new_header = '<div class="bg-[#002970] text-white p-3 font-semibold text-sm flex justify-between items-center"><span>Paytm Merchant AI</span><button onclick="toggleChat()" class="hover:text-gray-300 text-lg leading-none">&times;</button></div>'
    
    if old_header in html:
        html = html.replace(old_header, new_header)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Fixed close button in {filepath}")

fix_copilot_close('frontend/public/inventory.html')
fix_copilot_close('frontend/public/passbook.html')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Add SKU with Upload JSON
html = html.replace('<span class="">Add SKU</span>', '<span class="">Upload JSON</span>')

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Changed Add SKU to Upload JSON in inventory.html")
