import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/account.html', 'r', encoding='utf-8') as f:
    h = f.read()

script = """
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Show 'Work in Progress' for any unlinked anchors or buttons in this dummy page
    const links = document.querySelectorAll('a[href="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🏗️ Work in Progress!\\n\\nThis screen is a mockup for the hackathon UI.');
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🏗️ Work in Progress!\\n\\nLogging out is disabled in the demo.');
        });
    }

    const qrBtn = document.querySelector('button:has(.material-symbols-outlined:contains("qr_code_2"))') || 
                  document.evaluate("//button[contains(., 'QR Code')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (qrBtn) {
        qrBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🏗️ Work in Progress!\\n\\nQR Code feature is coming soon.');
        });
    }
});
</script>
"""

h = h.replace('</body>', script + '</body>')

with open('frontend/public/account.html', 'w', encoding='utf-8') as f:
    f.write(h)

print("Added WIP alerts to account.html")
