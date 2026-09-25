import sys, io, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

for file in glob.glob('frontend/public/*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        h = f.read()
    
    changed = False
    if 'bottom-20 z-40' in h and '<aside' in h:
        h = h.replace('bottom-20 z-40', 'bottom-24 z-[60]')
        changed = True
        
    if changed:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(h)
        print(f'Fixed FAB position in {file}')
