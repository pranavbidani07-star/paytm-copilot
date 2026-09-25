import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

idx1 = h.find('copilotDrawer')
idx2 = h.find('<nav')
print('copilot:', idx1, 'nav:', idx2)

def get_path(html, target_idx):
    path = []
    import re
    pos = 0
    while pos < target_idx:
        m = re.search(r'<(/?)(\w+)[^>]*>', html[pos:])
        if not m: break
        tag_pos = pos + m.start()
        if tag_pos >= target_idx: break
        tag = m.group(2)
        is_close = m.group(1) == '/'
        if not is_close and tag not in ['img', 'br', 'hr', 'input', 'link', 'meta', 'source']:
            path.append(tag)
        elif is_close and len(path) > 0 and path[-1] == tag:
            path.pop()
        pos += m.end()
    return path

print('Path to copilot:', get_path(h, idx1))
print('Path to nav:', get_path(h, idx2))
