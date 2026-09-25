import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = re.sub(r"getElementById\([^\)]*alertCard[^\)]*\)", "getElementById('alertCard')", h)
h = re.sub(r"getElementById\([^\)]*copilotDrawer[^\)]*\)", "getElementById('copilotDrawer')", h)
h = re.sub(r"console\.log\([^\)]*Proactive Agent Alert[^\)]*\)", "console.log('Proactive Agent Alert:', digestData);", h)

with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed completely')
