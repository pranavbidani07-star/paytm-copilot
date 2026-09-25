import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/account.html', 'r', encoding='utf-8') as f:
    h = f.read()
h = h.replace('a[href="#"]', 'a[href="#"]:not(#lang-btn)')
with open('frontend/public/account.html', 'w', encoding='utf-8') as f:
    f.write(h)
print("Fixed WIP selector")
