import sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

for root, dirs, files in os.walk('frontend/public'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                h = f.read()
            
            idx1 = h.find('<!-- Suggested Action Chips -->')
            if idx1 != -1:
                idx2 = h.find('</div>\n\n</div>\n\n<!-- Bottom Drawer Input Bar', idx1)
                if idx2 == -1:
                    idx2 = h.find('</div>\n</div>\n<!-- Bottom Drawer Input Bar', idx1)
                if idx2 == -1:
                    idx2 = h.find('<!-- Bottom Drawer Input Bar', idx1)
                
                if idx2 != -1:
                    # Find the closing </div> of the chatContainer BEFORE the Bottom Drawer Input Bar
                    # Wait, the structure is:
                    # <div id="chatContainer">
                    #   ...
                    #   <!-- Suggested Action Chips -->
                    #   ...
                    # </div>
                    # </div> (closes the drawer)
                    # No, </div> closes the chatContainer.
                    # I will just replace from idx1 to idx2!
                    
                    new_h = h[:idx1] + h[idx2:]
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_h)
                    print(f'Removed pre-answer buttons from {file}')
