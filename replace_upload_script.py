with open('frontend/public/passbook.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last script block that contains the old json-upload listener
# We'll look for the script tag containing the old listener and replace just that block
OLD_MARKER_START = "document.getElementById('json-upload').addEventListener"
OLD_SCRIPT_OPEN = "<script>"

# Find position of the old listener
listener_pos = content.rfind(OLD_MARKER_START)
if listener_pos == -1:
    print("ERROR: Old listener not found")
    exit(1)

# Find the <script> tag that opens this block (search backward from listener)
script_open_pos = content.rfind(OLD_SCRIPT_OPEN, 0, listener_pos)
# Find the </script> that closes it (search forward from listener)
script_close_pos = content.find('</script>', listener_pos)

old_block = content[script_open_pos:script_close_pos + len('</script>')]
print("OLD BLOCK (first 100 chars):", repr(old_block[:100]))

NEW_BLOCK = """<script>
document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('json-upload');
  if (!uploadInput) {
    console.error("Upload input with ID 'json-upload' not found on the page.");
    return;
  }

  uploadInput.addEventListener('change', async function(event) {
    console.log("1. File input changed");
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }
    console.log("2. File detected:", file.name);

    const reader = new FileReader();
    reader.onload = async function(e) {
      console.log("3. File read successfully");
      try {
        const jsonData = JSON.parse(e.target.result);
        console.log("4. JSON parsed:", jsonData);

        const response = await fetch('http://localhost:8000/api/inventory/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData)
        });

        console.log("5. Fetch response status:", response.status);
        if (response.ok) {
          alert('Store inventory synced successfully!');
          event.target.value = '';
        } else {
          alert('Backend returned an error. Check FastAPI logs.');
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert('Could not parse JSON or connect to server.');
      }
    };
    reader.readAsText(file);
  });
});
</script>"""

content = content[:script_open_pos] + NEW_BLOCK + content[script_close_pos + len('</script>'):]

with open('frontend/public/passbook.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Script replaced with DOMContentLoaded version")
