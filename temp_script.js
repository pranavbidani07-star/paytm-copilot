
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
