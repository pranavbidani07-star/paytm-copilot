import re
import os

account_html = """<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" name="viewport"><meta content="mobile_tab" name="shell-type"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"><link href="https://fonts.googleapis.com" rel="preconnect"><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "inverse-surface": "#22304e", "surface-container": "#e9edff", "surface-container-high": "#e1e8ff", "on-primary-fixed-variant": "#224585", "surface-container-lowest": "#ffffff", "surface-variant": "#d8e2ff", "secondary": "#006686", "on-background": "#0b1b38", "on-primary-fixed": "#001943", "secondary-fixed-dim": "#71d2ff", "secondary-container": "#2bc6ff", "outline-variant": "#c4c6d2", "inverse-on-surface": "#edf0ff", "on-secondary-fixed-variant": "#004d66", "tertiary-container": "#003923", "on-secondary": "#ffffff", "surface-bright": "#faf9ff", "error-container": "#ffdad6", "surface-dim": "#ccdaff", "surface-tint": "#3d5d9e", "on-surface-variant": "#434750", "on-tertiary": "#ffffff", "on-tertiary-fixed-variant": "#005233", "primary": "#001a45", "outline": "#747781", "secondary-fixed": "#c0e8ff", "surface-container-low": "#f1f3ff", "tertiary-fixed-dim": "#53de9e", "primary-container": "#002e6e", "on-surface": "#0b1b38", "on-tertiary-fixed": "#002112", "surface": "#faf9ff", "on-error-container": "#93000a", "on-primary-container": "#7998de", "on-secondary-container": "#004f69", "primary-fixed-dim": "#afc6ff", "on-primary": "#ffffff", "on-secondary-fixed": "#001e2b", "error": "#ba1a1a", "on-tertiary-container": "#00ae73", "background": "#faf9ff", "tertiary": "#002112", "on-error": "#ffffff", "primary-fixed": "#d9e2ff", "tertiary-fixed": "#73fbb8", "surface-container-highest": "#d8e2ff", "inverse-primary": "#afc6ff" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "space-xl": "2rem", "margin-tablet": "1.5rem", "gutter-desktop": "1.5rem", "space-2xs": "0.25rem", "space-xs": "0.5rem", "margin-desktop": "2.5rem", "space-lg": "1.5rem", "space-md": "1rem", "gutter": "1rem", "margin": "1rem", "space-sm": "0.75rem", "space-2xl": "3rem" }, "fontFamily": { "headline-md": ["Plus Jakarta Sans"], "display-currency-mobile": ["Plus Jakarta Sans"], "body-lg": ["Plus Jakarta Sans"], "display-currency": ["Plus Jakarta Sans"], "headline-lg-mobile": ["Plus Jakarta Sans"], "label-caps": ["JetBrains Mono"], "data-mono-num": ["JetBrains Mono"], "headline-lg": ["Plus Jakarta Sans"], "headline-sm": ["Plus Jakarta Sans"], "body-md": ["Plus Jakarta Sans"], "body-sm": ["Plus Jakarta Sans"] }, "fontSize": { "headline-md": ["20px", {"lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600"}], "display-currency-mobile": ["30px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "800"}], "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "400"}], "display-currency": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "800"}], "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700"}], "label-caps": ["11px", {"lineHeight": "14px", "letterSpacing": "0.06em", "fontWeight": "700"}], "data-mono-num": ["14px", {"lineHeight": "20px", "letterSpacing": "-0.02em", "fontWeight": "600"}], "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}], "headline-sm": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "600"}], "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}], "body-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0em", "fontWeight": "500"}] } } } }</script><style>@layer base{html,body{width:100%;margin:0;padding:0;min-height:100%;}body{overscroll-behavior-y:none;-webkit-tap-highlight-color:transparent;}.pb-safe{padding-bottom:env(safe-area-inset-bottom,0px);}.pt-safe{padding-top:env(safe-area-inset-top,0px);}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style></head><body class="bg-[#F4F6F9] text-on-surface font-body-md flex flex-col min-h-screen antialiased"><header class="fixed top-0 w-full z-50 bg-[#002E6E] shadow-[0_4px_20px_rgba(0,46,110,0.18)] pt-safe"><div class="h-14 px-margin flex items-center justify-between gap-space-sm"><div class="flex items-center gap-space-xs"><button aria-label="Navigation menu" class="w-11 h-11 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-95 transition-all" type="button"><span class="material-symbols-outlined text-[24px]">menu</span></button></div><div class="flex items-center justify-center flex-1"><h1 class="font-headline-md text-headline-md text-white font-bold tracking-tight text-center select-none">My Account</h1></div><div class="flex items-center gap-space-2xs"><button aria-label="Notifications" class="relative w-11 h-11 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-95 transition-all" type="button"><span class="material-symbols-outlined text-[24px]">notifications</span><span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-primary-container"></span></button></div></div></header>

<main class="flex flex-col relative w-full pt-16 pb-[96px] bg-[#F4F6F9] min-h-screen px-4">
    <!-- Profile Card -->
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center mb-6">
        <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center text-primary text-2xl mr-4 shrink-0 shadow-sm">
            <span class="material-symbols-outlined">storefront</span>
        </div>
        <div class="flex-1 min-w-0">
            <h2 class="font-bold text-lg text-on-surface truncate">Pranav's Kirana</h2>
            <p class="text-sm text-on-surface-variant truncate">UPI ID: pranav@paytm</p>
        </div>
        <button class="flex flex-col items-center justify-center text-secondary ml-2 shrink-0 active:scale-95 transition-transform">
            <span class="material-symbols-outlined text-2xl">qr_code_2</span>
            <span class="text-[10px] font-bold mt-0.5">QR Code</span>
        </button>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
        
        <!-- Payment & Settlement -->
        <div>
            <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">Payment & Settlement</h3>
            <div class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">account_balance</span>
                        <div>
                            <p class="font-semibold text-on-surface text-sm">Linked Bank Account</p>
                            <p class="text-xs text-on-surface-variant mt-0.5">State Bank of India ending in 4432</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">volume_up</span>
                        <p class="font-semibold text-on-surface text-sm">Soundbox Settings</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">tune</span>
                        <p class="font-semibold text-on-surface text-sm">Payment Limits</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
            </div>
        </div>

        <!-- Business Management -->
        <div>
            <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">Business Management</h3>
            <div class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">store</span>
                        <p class="font-semibold text-on-surface text-sm">Store Details & Timings</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">group</span>
                        <p class="font-semibold text-on-surface text-sm">Staff Roles</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
            </div>
        </div>

        <!-- App Preferences -->
        <div>
            <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">App Preferences</h3>
            <div class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">language</span>
                        <div>
                            <p class="font-semibold text-on-surface text-sm">App Language</p>
                            <p class="text-xs text-on-surface-variant mt-0.5">English</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">notifications_active</span>
                        <p class="font-semibold text-on-surface text-sm">Notification Alerts</p>
                    </div>
                    <!-- Toggle Switch -->
                    <label class="relative inline-flex items-center cursor-pointer active:scale-95 transition-transform">
                        <input type="checkbox" value="" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Support -->
        <div>
            <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">Support</h3>
            <div class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">headset_mic</span>
                        <p class="font-semibold text-on-surface text-sm">24x7 Help & Support</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-4 border-b border-surface-container last:border-0 active:bg-surface-container-low transition-colors cursor-pointer">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined text-on-surface-variant mr-3">gavel</span>
                        <p class="font-semibold text-on-surface text-sm">Terms & Policies</p>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                </div>
            </div>
        </div>

    </div>

    <!-- Logout Button -->
    <div class="mt-8 flex justify-center w-full">
        <button class="w-full py-4 text-error font-bold text-base active:scale-95 transition-transform bg-transparent" type="button">
            Log Out
        </button>
    </div>
</main>

<nav class="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,46,110,0.06)]" data-active-classes="text-primary-container font-semibold"><div class="flex justify-around items-center h-16 px-space-sm"><a class="flex flex-col items-center justify-center min-w-[64px] h-full py-1 text-on-surface-variant hover:text-on-surface transition-colors" data-path="dashboard" href="dashboard.html"><span class="material-symbols-outlined text-[24px]">home</span><span class="font-body-sm text-body-sm mt-0.5">Home</span></a><a class="flex flex-col items-center justify-center min-w-[64px] h-full py-1 text-on-surface-variant hover:text-on-surface transition-colors" data-path="passbook-ledger" href="passbook.html"><span class="material-symbols-outlined text-[24px]">receipt_long</span><span class="font-body-sm text-body-sm mt-0.5">Passbook</span></a><a class="flex flex-col items-center justify-center min-w-[64px] h-full py-1 text-on-surface-variant hover:text-on-surface transition-colors" data-path="merchant-lending" href="loans.html"><span class="material-symbols-outlined text-[24px]">credit_score</span><span class="font-body-sm text-body-sm mt-0.5">Loans</span></a><a aria-current="page" class="flex flex-col items-center justify-center min-w-[64px] h-full py-1 transition-colors text-primary-container font-semibold" data-path="merchant-account" href="account.html"><span class="material-symbols-outlined text-[24px]">account_circle</span><span class="font-body-sm text-body-sm mt-0.5">Account</span></a></div></nav>

</body></html>"""

with open(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\account.html', 'w', encoding='utf-8') as f:
    f.write(account_html)

# Now loop through all files and update href="#" to href="account.html" for business-account or merchant-account
files = ['dashboard.html', 'passbook.html', 'loans.html']

for fn in files:
    path = os.path.join(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public', fn)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We replace any href="#" that is within the account tag.
    # Look for data-path="business-account" href="#" or data-path="merchant-account" href="#"
    content = re.sub(r'data-path="business-account" href="#"', 'data-path="business-account" href="account.html"', content)
    content = re.sub(r'data-path="merchant-account" href="#"', 'data-path="merchant-account" href="account.html"', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
