import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Extract copilotDrawer
start = h.find('id="copilotDrawer"')
if start != -1:
    # find the preceding <div
    div_start = h.rfind('<div', 0, start)
    # find the matching closing div
    pos = div_start + 4
    depth = 1
    while pos < len(h) and depth > 0:
        next_open = h.find('<div', pos)
        next_close = h.find('</div', pos)
        if next_open == -1: next_open = len(h)
        if next_close == -1: next_close = len(h)
        
        if next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            pos = next_close + 5

    drawer_html = h[div_start:pos+1]
    
    # Remove it from current location
    new_h = h[:div_start] + h[pos+1:]
    
    # Put it right before </body>
    body_close = new_h.find('</body>')
    if body_close != -1:
        new_h = new_h[:body_close] + '\n' + drawer_html + '\n' + new_h[body_close:]
    else:
        new_h += '\n' + drawer_html
        
    with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
        f.write(new_h)
    print('Moved copilotDrawer to end of body')
