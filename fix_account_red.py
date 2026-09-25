import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/account.html', 'r', encoding='utf-8') as f:
    h = f.read()

# I want to add text-error to all spans inside a[href="#"]:not(#lang-btn)
# The easiest way is to add a small style script that runs on DOMContentLoaded
style_script = """
<script>
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href="#"]:not(#lang-btn)');
    links.forEach(link => {
        // Find text elements inside and make them red
        const texts = link.querySelectorAll('.text-on-surface, .text-on-surface-variant');
        texts.forEach(t => {
            t.classList.remove('text-on-surface');
            t.classList.remove('text-on-surface-variant');
            t.classList.add('text-error');
        });
        
        // Also make icons red
        const icons = link.querySelectorAll('.text-primary');
        icons.forEach(i => {
            i.classList.remove('text-primary');
            i.classList.add('text-error');
        });
    });
    
    // Also the QR code button
    const qrBtn = document.querySelector('button:has(.material-symbols-outlined:contains("qr_code_2"))') || 
                  document.evaluate("//button[contains(., 'QR Code')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (qrBtn) {
        qrBtn.classList.remove('text-primary');
        qrBtn.classList.add('text-error');
    }
});
</script>
"""

h = h.replace('</body>', style_script + '</body>')

with open('frontend/public/account.html', 'w', encoding='utf-8') as f:
    f.write(h)

print("Injected script to make WIP items red")
