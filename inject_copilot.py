import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The UI block for Copilot Chat
copilot_html = """
<!-- Copilot FAB & Chat Window -->
<button onclick="toggleChat()" class="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-[#002970] text-white p-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all z-50 flex items-center justify-center">
  <span class="text-xl">✨</span>
</button>

<div id="copilot-window" class="fixed bottom-44 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 hidden z-50 flex flex-col overflow-hidden">
  <div class="bg-[#002970] text-white p-3 font-semibold text-sm">Paytm Merchant AI</div>
  <div id="chat-history" class="p-4 h-64 overflow-y-auto flex flex-col space-y-3 text-sm bg-gray-50">
    <div class="bg-gray-200 text-gray-800 self-start p-2 rounded-lg max-w-[85%]">
      Hi! I am your AI Copilot. I can see your live inventory. What do you need help with?
    </div>
  </div>
  <div class="p-3 border-t border-gray-200 bg-white flex">
    <input id="chat-input" type="text" class="flex-1 bg-gray-100 rounded-l-lg px-3 py-2 outline-none text-sm text-gray-800" placeholder="Ask about stock...">
    <button onclick="sendMessage()" class="bg-[#002970] text-white px-4 rounded-r-lg text-sm font-semibold hover:bg-blue-800">Send</button>
  </div>
</div>

<script>
function toggleChat() {
  const win = document.getElementById('copilot-window');
  win.classList.toggle('hidden');
}

async function sendMessage(overrideMsg = null) {
  const input = document.getElementById('chat-input');
  const query = overrideMsg || input.value.trim();
  if (!query) return;
  
  if (!overrideMsg) input.value = '';

  const history = document.getElementById('chat-history');
  
  // User bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-blue-100 text-blue-900 self-end p-2 rounded-lg max-w-[85%]';
  userDiv.innerText = query;
  history.appendChild(userDiv);
  history.scrollTop = history.scrollHeight;

  // Bot thinking bubble
  const botDiv = document.createElement('div');
  botDiv.className = 'bg-gray-200 text-gray-800 self-start p-2 rounded-lg max-w-[85%]';
  botDiv.innerText = 'Thinking...';
  history.appendChild(botDiv);
  history.scrollTop = history.scrollHeight;

  try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({query: query, demo_mode: false})
      });
      const data = await res.json();
      botDiv.innerText = data.reply;
  } catch(e) {
      botDiv.innerText = "Error connecting to AI backend.";
  }
  history.scrollTop = history.scrollHeight;
}

// Override Review Button
document.addEventListener('DOMContentLoaded', () => {
    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) {
        // Remove old alert logic by replacing node
        const newBtn = reviewBtn.cloneNode(true);
        reviewBtn.parentNode.replaceChild(newBtn, reviewBtn);
        
        newBtn.addEventListener('click', () => {
            const win = document.getElementById('copilot-window');
            win.classList.remove('hidden');
            sendMessage("What items should I review for the weekend? Only list items that have low stock. Keep it very short.");
        });
    }
});
</script>
"""

# Remove old alert script if present
if "alert(\"✨ Copilot Advisory" in html:
    start_alert = html.find("<script>\ndocument.addEventListener('DOMContentLoaded', () => {\n    const reviewBtn = document.getElementById('review-btn');")
    end_alert = html.find("</script>", start_alert) + 9
    html = html[:start_alert] + html[end_alert:]

# Inject copilot HTML before </body>
body_end = html.find('</body>')
html = html[:body_end] + copilot_html + html[body_end:]

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected Copilot UI into inventory.html")
