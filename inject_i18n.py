import sys, io
import glob

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# First update account.html to have the ID and remove WIP
with open('frontend/public/account.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Replace the language anchor with an ID
lang_target = """<a class="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors active:bg-surface-container" href="#">
<div class="flex items-center gap-space-sm min-w-0">
<div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[20px]">language</span>
</div>
<div class="flex flex-col min-w-0">
<span class="font-headline-sm text-headline-sm text-on-surface">App Language</span>
<span class="font-body-sm text-body-sm text-on-surface-variant truncate" id="lang-text-display">English</span>
</div>
</div>
<span class="material-symbols-outlined text-outline text-[20px] shrink-0">chevron_right</span>
</a>"""

# Since I just made up the id="lang-text-display", let me find the original block and replace it
orig_lang_block = """<a class="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors active:bg-surface-container" href="#">
<div class="flex items-center gap-space-sm min-w-0">
<div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[20px]">language</span>
</div>
<div class="flex flex-col min-w-0">
<span class="font-headline-sm text-headline-sm text-on-surface">App Language</span>
<span class="font-body-sm text-body-sm text-on-surface-variant truncate">English</span>
</div>
</div>
<span class="material-symbols-outlined text-outline text-[20px] shrink-0">chevron_right</span>
</a>"""

new_lang_block = orig_lang_block.replace('<a ', '<a id="lang-btn" ')

if orig_lang_block in h:
    h = h.replace(orig_lang_block, new_lang_block)
    with open('frontend/public/account.html', 'w', encoding='utf-8') as f:
        f.write(h)
    print("Added lang-btn to account.html")
else:
    print("Could not find lang block in account.html")

# Now inject <script src="i18n.js"></script> into ALL html files
html_files = glob.glob('frontend/public/*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<script src="i18n.js"></script>' not in content:
        content = content.replace('</body>', '<script src="i18n.js"></script>\n</body>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected i18n.js into {file}")
