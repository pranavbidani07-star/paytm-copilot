import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Fix broken copilotDrawer from my previous truncation
if not h.endswith('</html>'):
    # Let's add the missing bottom HTML to complete the copilotDrawer
    missing_drawer_html = """</div>
</div>
</div>
</div>
<!-- Bottom Drawer Input Bar (Voice Active) -->
<div class="p-space-sm pb-24 bg-surface-container-lowest border-t border-surface-container">
<div class="flex items-center gap-2">
<!-- Voice Pulse Button -->
<button id="micBtn" aria-label="Activate voice order" class="relative w-11 h-11 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform" type="button">
<span id="micIcon" class="material-symbols-outlined text-[22px]">mic</span>
<span id="micPulse" class="absolute inset-0 rounded-2xl bg-secondary-container/30 animate-ping hidden"></span>
</button>
<!-- Input Field -->
<div class="relative flex-1">
<input id="chatInput" class="w-full bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 rounded-2xl py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Speak or type stock order..." type="text">
<span class="absolute right-3 top-2.5 font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider">Auto-Send</span>
</div>
<button id="sendBtn" aria-label="Send message" class="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform shadow-md shadow-primary/20" type="button">
<span class="material-symbols-outlined text-[20px]">send</span>
</button>
</div>
<div class="mt-2 text-center">
<span class="font-body-sm text-[10px] text-on-surface-variant/70 flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[12px]">mic</span>Voice Active: Say "Ek carton butter order karo"</span>
</div>
</div>
</div>"""

    # Add missing closing tags for the main content
    missing_closing = "\n</section>\n</div>\n</main>\n"
    
    # Nav bar
    nav_html = """<nav class="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,46,110,0.06)]" data-active-classes="text-primary-container font-semibold">
<div class="flex items-center justify-around h-16 px-margin pb-1">
<button onclick="window.location.href='dashboard.html'" class="flex flex-col items-center group active:scale-95 transition-transform" type="button">
<div class="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-white shadow-md shadow-primary-container/20 group-hover:bg-primary">
<span class="material-symbols-outlined text-[22px]">home</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface font-semibold mt-1.5">Home</span>
</button>
<button onclick="window.location.href='inventory.html'" class="flex flex-col items-center group active:scale-95 transition-transform" type="button">
<div class="w-12 h-12 rounded-2xl bg-secondary-container/25 text-secondary flex items-center justify-center group-hover:bg-secondary-container/40 transition-colors relative">
<span class="material-symbols-outlined text-[22px]">inventory_2</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1.5 group-hover:text-on-surface transition-colors">Inventory</span>
</button>
<button onclick="window.location.href='passbook.html'" class="flex flex-col items-center group active:scale-95 transition-transform" type="button">
<div class="w-12 h-12 rounded-2xl bg-secondary-container/25 text-secondary flex items-center justify-center group-hover:bg-secondary-container/40 transition-colors">
<span class="material-symbols-outlined text-[22px]">menu_book</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1.5 group-hover:text-on-surface transition-colors">Passbook</span>
</button>
<button onclick="window.location.href='loans.html'" class="flex flex-col items-center group active:scale-95 transition-transform" type="button">
<div class="w-12 h-12 rounded-2xl bg-secondary-container/25 text-secondary flex items-center justify-center group-hover:bg-secondary-container/40 transition-colors">
<span class="material-symbols-outlined text-[22px]">account_balance</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1.5 group-hover:text-on-surface transition-colors">Loans</span>
</button>
</div>
</nav>"""

    # Add back the script
    script_html = """<script>
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`http://${window.location.hostname}:8000/api/inventory`);
        const items = await res.json();
        let lowItems = items.filter(i => i.stock_count <= i.restock_threshold);
        const card = document.getElementById('alertCard');
        const text = document.getElementById('dynamic-alert-text');
        if (lowItems.length > 0) {
            let item = lowItems[0];
            text.innerHTML = `${item.item_name} has only <span class="text-error font-bold font-data-mono-num">${item.stock_count} units</span> left. Daily run-rate predicts stockout soon.`;
            const copilotAlert = document.getElementById('copilot-alert-text');
            if (copilotAlert) {
                copilotAlert.innerHTML = `Alert: <span class="font-semibold text-error">${item.item_name}</span> is down to ${item.stock_count} packs. You have a pre-approved <span class="font-bold text-secondary">₹5,000 credit line</span> available to auto-order 20 units with next-morning delivery.`;
            }
            window.currentLowStockItem = item.item_name;
        } else {
            if (card) card.style.display = 'none';
        }
    } catch(e) { console.error(e); }

    const dismissBtn = document.getElementById("dismissBtn");
    const alertCard = document.getElementById("alertCard");
    if (dismissBtn && alertCard) {
        dismissBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            alertCard.style.opacity = '0';
            setTimeout(() => { alertCard.style.display = 'none'; }, 300);
        });
    }

    const chatContainer = document.getElementById("chatContainer");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");

    const appendUserMessage = (text) => {
        const msgHTML = `
        <div class="flex items-start gap-space-xs justify-end">
            <div class="flex flex-col max-w-[85%] items-end">
            <div class="bg-primary-container p-space-sm rounded-2xl rounded-tr-sm shadow-sm text-white">
                <p class="font-body-md text-body-md">${text}</p>
            </div>
            <span class="font-body-sm text-[10px] text-on-surface-variant mt-1 mr-1">You • Just now</span>
            </div>
        </div>
        `;
        chatContainer.insertAdjacentHTML("beforeend", msgHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const appendAIMessage = (text) => {
        const msgHTML = `
        <div class="flex items-start gap-space-xs">
            <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 mt-0.5 shadow-sm">
            <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
            </div>
            <div class="flex flex-col max-w-[85%]">
            <div class="bg-surface-container-lowest p-space-sm rounded-2xl rounded-tl-sm shadow-sm text-on-surface">
                <p class="font-body-md text-body-md">${text}</p>
            </div>
            <span class="font-body-sm text-[10px] text-on-surface-variant mt-1 ml-1">Copilot • Just now</span>
            </div>
        </div>
        `;
        chatContainer.insertAdjacentHTML("beforeend", msgHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const showTypingIndicator = () => {
        const id = "typing-" + Date.now();
        const msgHTML = `
        <div id="${id}" class="flex items-start gap-space-xs">
            <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 mt-0.5 shadow-sm">
            <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
            </div>
            <div class="flex flex-col max-w-[85%]">
            <div class="bg-surface-container-lowest p-space-sm rounded-2xl rounded-tl-sm shadow-sm text-on-surface flex gap-1 items-center h-10">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            </div>
        </div>
        `;
        chatContainer.insertAdjacentHTML("beforeend", msgHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    };

    const sendMessage = async () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendUserMessage(text);
        chatInput.value = "";
        
        const typingId = showTypingIndicator();
        
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/v1/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, query: text, merchant_id: "demo_1" })
            });
            const data = await response.json();
            const el = document.getElementById(typingId);
            if (el) el.remove();
            appendAIMessage(data.reply || data.response || "Done!");
        } catch (error) {
            console.error("Chat error:", error);
            const el = document.getElementById(typingId);
            if (el) el.remove();
            appendAIMessage("Connection error. Please try again.");
        }
    };

    if (sendBtn) {
        sendBtn.addEventListener("click", (e) => { e.preventDefault(); sendMessage(); });
    }
    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
        });
    }
});
</script>
</body>
</html>
"""

    # Assemble everything!
    # Wait, the h is just the top half of the file and ends with the first half of the drawer.
    # What if the drawer was ALREADY moved to the end of the file in h?
    # Yes, h currently ends at `Copilot • Just now</span>`
    
    full = h + missing_drawer_html + missing_closing + nav_html + script_html
    
    with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
        f.write(full)
    print("RESTORED!")
else:
    print("Already complete")
