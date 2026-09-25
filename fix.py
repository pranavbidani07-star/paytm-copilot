import os
for f in ['frontend/public/passbook.html', 'frontend/public/dashboard.html']:
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        content = file.read()
    
    content = content.replace(',1', '?')
    content = content.replace('??', '•••')
    content = content.replace('â‚¹', '?')
    content = content.replace('â€¢', '•')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
