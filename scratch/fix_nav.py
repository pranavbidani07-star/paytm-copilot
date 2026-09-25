import re

def update_nav(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the "Payment" nav item with "Loans"
    payment_str_regex = r'<a class="flex flex-col items-center justify-center min-w-\[56px\] h-12 text-on-surface-variant transition-colors group" data-path="payment-transactions" href="[^"]*"><span class="material-symbols-outlined text-\[22px\] transition-transform group-active:scale-90">payments</span><span class="font-body-sm text-body-sm text-\[11px\] mt-0\.5 leading-none">Payment</span></a>'
    
    replacement = '<a class="flex flex-col items-center justify-center min-w-[56px] h-12 text-on-surface-variant transition-colors group" data-path="merchant-lending" href="loans.html"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">credit_score</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Loans</span></a>'
    
    content = re.sub(payment_str_regex, replacement, content)
    
    if filepath.endswith('dashboard.html'):
        content = content.replace('id="navLoans" onclick="window.location.href=\'dashboard.html\'"', 'id="navLoans" onclick="window.location.href=\'loans.html\'"')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_nav(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\dashboard.html')
update_nav(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\passbook.html')
update_nav(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\inventory.html')
update_nav(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\payments.html')
