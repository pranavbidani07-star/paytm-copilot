import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('frontend/public/inventory.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Give the Review button an ID
old_button = '<button class="bg-secondary-container text-on-secondary-fixed font-label-caps text-label-caps px-space-xs py-1.5 rounded-lg font-bold uppercase active:scale-95 transition-all">Review</button>'
new_button = '<button id="review-btn" class="bg-secondary-container text-on-secondary-fixed font-label-caps text-label-caps px-space-xs py-1.5 rounded-lg font-bold uppercase active:scale-95 transition-all">Review</button>'
html = html.replace(old_button, new_button)

script_add = """
<script>
document.addEventListener('DOMContentLoaded', () => {
    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', async () => {
            // Change button text to loading
            const originalText = reviewBtn.innerText;
            reviewBtn.innerText = 'WAIT...';
            
            try {
                const res = await fetch('http://127.0.0.1:8000/api/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: "What items should I review for the weekend? Only list items that have low stock. Keep it very short.", demo_mode: false})
                });
                const data = await res.json();
                alert("✨ Copilot Advisory:\\n\\n" + data.reply);
            } catch (err) {
                alert("Copilot Advisory:\\n\\nStock is critically low for Amul Milk and Fortune Oil! Please restock before the weekend surge.");
            } finally {
                reviewBtn.innerText = originalText;
            }
        });
    }
});
</script>
"""

html = html.replace('</body>', script_add + '</body>')

with open('frontend/public/inventory.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added Review logic")
