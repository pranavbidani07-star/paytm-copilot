
document.addEventListener("DOMContentLoaded", () => {
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
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendUserMessage(text);
    chatInput.value = "";
    
    const typingId = showTypingIndicator();
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, query: text, merchant_id: "demo_1" })
      });
      const data = await response.json();
      document.getElementById(typingId).remove();
      appendAIMessage(data.reply || data.response || "Done!");
    } catch (error) {
      console.error(error);
      document.getElementById(typingId).remove();
      appendAIMessage("Oops, connection issue. Please try again later.");
    }
  };

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Restock Button Logic
  const restockBtn = document.getElementById("restockBtn");
  if (restockBtn) {
    restockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      document.getElementById('copilotDrawer').classList.remove('translate-y-full');
      chatInput.value = "Restock 20 units of Amul Butter";
      sendMessage();
    });
  }

  // Dismiss Button Logic
  const dismissBtn = document.getElementById("dismissBtn");
  const alertCard = document.getElementById("alertCard");
  if (dismissBtn && alertCard) {
    dismissBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      alertCard.style.opacity = '0';
      setTimeout(() => {
        alertCard.style.display = 'none';
      }, 300);
    });
  }

  // Settle Now Button Logic
  const settleBtn = document.getElementById("settleBtn");
  if (settleBtn) {
    settleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const textSpan = settleBtn.querySelector('.settle-text');
      if (textSpan) textSpan.textContent = "Settled ✓";
      settleBtn.classList.remove('bg-primary-container');
      settleBtn.classList.add('bg-tertiary-container');
      settleBtn.disabled = true;
      settleBtn.classList.add('opacity-90', 'cursor-not-allowed', 'scale-95');
      settleBtn.classList.remove('active:scale-95');
    });
  }


  // Web Speech API Logic
  const micBtn = document.getElementById("micBtn");
  const micIcon = document.getElementById("micIcon");
  const micPulse = document.getElementById("micPulse");

  if (micBtn && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // or 'hi-IN' if required
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
      micIcon.classList.remove("text-secondary");
      micIcon.classList.add("text-error"); // Turn icon red
      micPulse.classList.remove("hidden"); // Show pulse animation
    };

    recognition.onresult = function(event) {
      const speechResult = event.results[0][0].transcript;
      chatInput.value = speechResult;
      sendMessage(); // Automatically send
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error", event.error);
      resetMicUI();
    };

    recognition.onend = function() {
      resetMicUI();
    };

    function resetMicUI() {
      micIcon.classList.add("text-secondary");
      micIcon.classList.remove("text-error");
      micPulse.classList.add("hidden");
    }

    micBtn.addEventListener("click", () => {
      recognition.start();
    });
  } else if (micBtn) {
    micBtn.addEventListener("click", () => {
      alert("Voice recognition is not supported in this browser.");
    });
  }
});

