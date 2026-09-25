import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()
h = h.replace('href="#"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">store</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Account</span>', 'href="account.html"><span class="material-symbols-outlined text-[22px] transition-transform group-active:scale-90">store</span><span class="font-body-sm text-body-sm text-[11px] mt-0.5 leading-none">Account</span>')
with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed account href')
