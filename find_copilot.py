import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

match = re.search(r'id=[\'\"]copilotDrawer[\'\"]', h)
if match:
    idx = match.start()
    print('ACTUAL copilotDrawer:', idx)
    path = []
    pos = 0
    while pos < idx:
        m = re.search(r'<(/?)(\w+)[^>]*>', h[pos:])
        if not m: break
        tag_pos = pos + m.start()
        if tag_pos >= idx: break
        tag = m.group(2)
        is_close = m.group(1) == '/'
        if not is_close and tag not in ['img', 'br', 'hr', 'input', 'link', 'meta', 'source']:
            path.append(tag)
        elif is_close and len(path) > 0 and path[-1] == tag:
            path.pop()
        pos += m.end()
    print('Path:', path)
