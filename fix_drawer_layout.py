import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Let's find the boundaries of the broken drawer and the disconnected input bar
# The drawer header usually contains "Merchant Pulse Copilot"
header_idx = h.find('Merchant Pulse Copilot')
# The disconnected input bar has "<!-- Bottom Drawer Input Bar (Voice Active) -->"
input_bar_idx = h.find('<!-- Bottom Drawer Input Bar (Voice Active) -->')

if header_idx != -1:
    # Find the nearest preceding <div
    broken_start = h.rfind('<div', 0, header_idx)
    # Go back a few more divs just in case it was wrapped
    for _ in range(3):
        prev = h.rfind('<div', 0, broken_start)
        if prev != -1 and broken_start - prev < 200:
            broken_start = prev
            
    print("Found broken start near:", broken_start)
    
    # We also need to remove the disconnected input bar, which is currently a sibling.
    # Where does the broken drawer + input bar END?
    # It ends right before <nav or <aside or <script
    
    end_markers = [h.find('<aside aria-label="AI Assistant"'), h.find('<nav '), h.find('<script>')]
    end_markers = [m for m in end_markers if m > broken_start]
    
    if end_markers:
        broken_end = min(end_markers)
        print("Found broken end near:", broken_end)
        
        # Replace the broken section with the PERFECT drawer!
        perfect_drawer = """
<!-- AI Copilot Drawer -->
<div class="fixed inset-x-0 bottom-0 z-[60] transform transition-transform duration-300 ease-out bg-surface-container-lowest rounded-t-3xl shadow-[0_-12px_40px_rgba(0,46,110,0.22)] max-w-lg mx-auto translate-y-full" id="copilotDrawer">
    <!-- Top Drag Indicator & Header -->
    <div class="w-full flex flex-col items-center pt-2.5 pb-2 border-b border-surface-container px-space-md">
        <div class="w-12 h-1.5 rounded-full bg-surface-container-high mb-3"></div>
        <div class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-container to-primary flex items-center justify-center text-white shadow-sm">
                    <span class="material-symbols-outlined text-[18px]">neurology</span>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-none">Merchant Pulse Copilot</h4>
                        <span class="font-label-caps text-[9px] bg-secondary-container/20 text-secondary font-bold px-1.5 py-0.5 rounded">LIVE AI</span>
                    </div>
                    <span class="font-body-sm text-[11px] text-on-surface-variant">Connected to Wholesaler &amp; Capital Engine</span>
                </div>
            </div>
            <button aria-label="Minimize Copilot Drawer" class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container" onclick="document.getElementById('copilotDrawer').classList.add('translate-y-full')" type="button">
                <span class="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
            </button>
        </div>
    </div>
    
    <!-- Inside Drawer Chat Area -->
    <div id="chatContainer" class="p-space-md max-h-[46vh] overflow-y-auto space-y-space-sm bg-surface-bright">
        <!-- AI Message -->
        <div class="flex items-start gap-space-xs">
            <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 mt-0.5 shadow-sm">
                <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
            </div>
            <div class="flex flex-col max-w-[85%]">
                <div class="bg-surface-container-lowest p-space-sm rounded-2xl rounded-tl-sm shadow-sm text-on-surface">
                    <p class="font-body-md text-body-md">
                        <span id="copilot-alert-text">Alert: <span class="font-semibold text-error">Amul Butter</span> is down to 2 packs. You have a pre-approved <span class="font-bold text-secondary">₹5,000 credit line</span> available to auto-order 20 units with next-morning delivery.</span>
                    </p>
                </div>
                <span class="font-body-sm text-[10px] text-on-surface-variant mt-1 ml-1">Copilot • Just now</span>
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
</div>
"""
        
        # Clean the string
        new_h = h[:broken_start] + '\n' + perfect_drawer + '\n' + h[broken_end:]
        
        with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
            f.write(new_h)
            
        print("Drawer fixed!")

