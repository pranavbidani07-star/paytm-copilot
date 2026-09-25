import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/i18n.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the TreeWalker to skip scripts and styles
walker_old = "const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);"
walker_new = """const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }, false);"""

if walker_old in js:
    js = js.replace(walker_old, walker_new)
    with open('frontend/public/i18n.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed TreeWalker in i18n.js")
else:
    print("Could not find old TreeWalker code")
