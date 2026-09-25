import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/i18n.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the confirm block with an injected UI modal
target_block = """            const choice = confirm("Press OK to switch to हिन्दी (Hindi), or Cancel for English.");
            if (choice) {
                localStorage.setItem('appLang', 'hi');
            } else {
                localStorage.setItem('appLang', 'en');
            }
            window.location.reload();"""

modal_js = """
            // Build native-looking app modal
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

            // Close if clicking outside the modal box
            overlay.addEventListener('click', (ev) => {
                if (ev.target === overlay) {
                    overlay.remove();
                }
            });
"""

if target_block in js:
    js = js.replace(target_block, modal_js)
    with open('frontend/public/i18n.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Injected custom modal into i18n.js")
else:
    print("Could not find the confirm block in i18n.js")
