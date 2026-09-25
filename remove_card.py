import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

# The block to remove starts with <div class="mt-2 pt-2 and ends before </div>\n\n</div>\n\n<span class="font-body-sm
# Let's find it
start_idx = h.find('<div class="mt-2 pt-2 bg-surface-container-low/60 rounded-xl p-2 flex items-center justify-between">')
if start_idx != -1:
    end_str = '</div>\n\n</div>\n\n<span class="font-body-sm text-[10px] text-on-surface-variant mt-1 ml-1">Copilot • Just now</span>'
    end_idx = h.find(end_str, start_idx)
    if end_idx != -1:
        new_h = h[:start_idx] + end_str
        with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
            f.write(new_h)
        print('Removed embedded Restock card from AI message.')
    else:
        print('End string not found')
else:
    print('Start string not found')
