import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
lines[167] = "  const chips = document.querySelectorAll('.chip');\n"
with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Fixed chips line')
