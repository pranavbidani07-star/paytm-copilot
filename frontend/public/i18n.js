const dict = {
    // Nav & Common
    "Home": "होम",
    "Passbook": "पासबुक",
    "Loans": "लोन",
    "Account": "खाता",
    "My Account": "मेरा खाता",
    "App Language": "ऐप की भाषा",
    "English": "English", 
    "Log Out": "लॉग आउट",
    "QR Code": "क्यूआर कोड",
    "Pay": "पे",
    "tm": "टीएम",
    "for Business": "फॉर बिज़नेस",
    
    // Dashboard
    "Today's Collections": "आज की कमाई",
    "vs yesterday": "कल की तुलना में",
    "Settle Now": "अभी सेटल करें",
    "SOUNDBOX": "साउंडबॉक्स",
    "BHARAT QR": "भारत QR",
    "TAP & PAY": "टैप एंड पे",
    "TAP &amp; PAY": "टैप एंड पे",
    "Total Inventory": "कुल स्टॉक",
    "Low Stock Alerts": "कम स्टॉक अलर्ट",
    "Inventory Critical": "स्टॉक क्रिटिकल",
    "Ask Copilot to Restock": "AI से स्टॉक मंगाएं",
    "Auto-detected": "ऑटो-डिटेक्टेड",
    "Low Stock Action": "कम स्टॉक एक्शन",
    "Dismiss": "हटाएं",
    "AI Copilot": "एआई कोपायलट",
    "Recent Insights": "हाल की जानकारी",
    "Sales spiked by 18% during peak hours yesterday.": "कल पीक आवर्स के दौरान बिक्री में 18% की वृद्धि हुई।",
    "Restock 5 items to avoid weekend stockouts.": "वीकेंड स्टॉकआउट से बचने के लिए 5 आइटम मंगाएं।",
    "Inventory": "स्टॉक",
    "Settings": "सेटिंग्स",
    
    // Passbook & Upload
    "SETTLEMENT SUMMARY": "सेटलमेंट समरी",
    "Cycle: Daily Auto-Sweep": "साइकिल: डेली ऑटो-स्वीप",
    "Net Settled to Bank": "बैंक में सेटल हुआ",
    "Total Received": "कुल प्राप्त",
    "Refunds / Debits": "रिफंड / डेबिट",
    "Upload JSON": "JSON अपलोड करें",
    "Upload your JSON file to sync!": "सिंक करने के लिए अपना JSON अपलोड करें!",
    "No inventory found.": "कोई स्टॉक नहीं मिला।",
    "Payment Settings": "पेमेंट सेटिंग्स",
    "Business Profile": "बिज़नेस प्रोफाइल",
    "Security": "सुरक्षा",
    "Help & Support": "मदद और सपोर्ट",
    "Policies": "नीतियां",
    "Ledger Log": "खाता बही",
    "Add new inventory records...": "नया स्टॉक रिकॉर्ड जोड़ें...",
    
    // Inventory
    "All": "सभी",
    "Low Stock": "कम स्टॉक",
    "Grocery": "किराना",
    "Dairy": "डेयरी",
    "Snacks": "स्नैक्स",
    "Review": "रिव्यू",
    "Weekend Stock Advisory": "वीकेंड स्टॉक सलाह",
    
    // Loans
    "Active Loans": "सक्रिय लोन",
    "Apply for Loan": "लोन के लिए आवेदन करें",
    "Working Capital": "वर्किंग कैपिटल",
    "Loan Offers": "लोन ऑफर्स",
    "Your Pre-approved Loan": "आपका प्री-अप्रूव्ड लोन",
    "Disburse Now": "अभी प्राप्त करें",
    
    // Copilot
    "Paytm Merchant AI": "पेटीएम मर्चेंट AI",
    "Send": "भेजें",
    "Thinking...": "सोच रहा है..."
};

function applyTranslations() {
    const lang = localStorage.getItem('appLang') || 'en';
    
    // Update language display in Account tab
    const langTextDisplay = document.getElementById('lang-text-display');
    if (langTextDisplay) {
        langTextDisplay.innerText = lang === 'hi' ? 'हिन्दी' : 'English';
    }

    if (lang === 'en') return; // Default html is english
    
    // Aggressive text replacement
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }, false);
    let n;
    const nodes = [];
    while(n = walk.nextNode()) nodes.push(n);
    
    nodes.forEach(node => {
        let text = node.nodeValue.trim();
        if (!text) return;

        // Try exact match first
        if (dict[text]) {
            node.nodeValue = node.nodeValue.replace(text, dict[text]);
            return;
        } 
        
        // Try substring match for complex nodes (like "All (5)")
        for (const [en, hi] of Object.entries(dict)) {
            if (text.startsWith(en + " (") || text === en) {
                node.nodeValue = node.nodeValue.replace(en, hi);
                return;
            }
        }
    });

    // Translate attributes like placeholder or aria-labels if needed
    const inputs = document.querySelectorAll('input[placeholder]');
    inputs.forEach(input => {
        if (input.placeholder.includes('Search')) {
            input.placeholder = 'उत्पाद, SKU, श्रेणी खोजें...';
        }
        if (input.placeholder.includes('Ask')) {
            input.placeholder = 'स्टॉक के बारे में पूछें...';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    
    // Rerun for dynamic content like fetch
    setTimeout(applyTranslations, 200);
    setTimeout(applyTranslations, 600);
    setTimeout(applyTranslations, 1500);

    // Attach listener to language button
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity";
            overlay.innerHTML = `
                <div class="bg-surface-container-lowest w-full max-w-xs rounded-3xl p-space-lg shadow-2xl flex flex-col gap-4 animate-scale-up">
                    <div class="flex items-center gap-3 text-primary">
                        <span class="material-symbols-outlined text-[28px]">language</span>
                        <h2 class="font-headline-sm text-headline-sm font-bold">Select Language</h2>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface-variant">Choose your preferred application language / अपनी पसंदीदा भाषा चुनें:</p>
                    
                    <div class="flex flex-col gap-3 mt-2">
                        <button id="lang-hi-btn" class="w-full py-3 bg-primary-container text-on-primary rounded-xl font-headline-sm font-semibold hover:bg-primary transition-colors active:scale-95 shadow-sm">
                            हिन्दी (Hindi)
                        </button>
                        <button id="lang-en-btn" class="w-full py-3 bg-surface-container-high text-primary rounded-xl font-headline-sm font-semibold hover:bg-surface-container-highest transition-colors active:scale-95 shadow-sm">
                            English
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            document.getElementById('lang-hi-btn').addEventListener('click', () => {
                localStorage.setItem('appLang', 'hi');
                window.location.reload();
            });

            document.getElementById('lang-en-btn').addEventListener('click', () => {
                localStorage.setItem('appLang', 'en');
                window.location.reload();
            });

            overlay.addEventListener('click', (ev) => {
                if (ev.target === overlay) {
                    overlay.remove();
                }
            });
        });
    }
});
