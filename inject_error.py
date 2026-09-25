import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    h = f.read()
script = '''
<script>
window.onerror = function(msg, url, line, col, error) {
    document.body.innerHTML = '<div style="color:red;font-size:20px;padding:20px;">Global Error: ' + msg + ' at ' + line + ':' + col + '</div>' + document.body.innerHTML;
    return false;
};
window.addEventListener('unhandledrejection', function(event) {
    document.body.innerHTML = '<div style="color:red;font-size:20px;padding:20px;">Unhandled Promise: ' + event.reason + '</div>' + document.body.innerHTML;
});
</script>
'''
h = h.replace('<head>', '<head>' + script)
with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Injected onerror')
