import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/dashboard.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = re.sub(r'getElementById\([^\)]*chatContainer[^\)]*\)', "getElementById('chatContainer')", h)

with open('frontend/public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Fixed chatContainer')
