import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Fix passbook.html
with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    pb_html = f.read()
pb_html = pb_html.replace('Sync Khatabook', 'Upload JSON')
with open('frontend/public/passbook.html', 'w', encoding='utf-8') as f:
    f.write(pb_html)
print("Updated passbook.html")

# Fix inventory.html
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    inv_html = f.read()
inv_html = inv_html.replace('Upload your Khatabook JSON to sync!', 'Upload your JSON file to sync!')
with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(inv_html)
print("Updated inventory.html")
