const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to inventory page
  await page.goto('http://127.0.0.1:8080/inventory.html', { waitUntil: 'networkidle2' });
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Extract text from list
  const text = await page.evaluate(() => {
    const list = document.getElementById('inventory-list');
    return list ? list.innerText : 'NO LIST FOUND';
  });
  
  console.log("INVENTORY LIST TEXT:", text);
  
  // Extract console errors
  
  await browser.close();
})();
