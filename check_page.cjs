const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));
  
  await page.goto('http://127.0.0.1:8080/dashboard.html', {waitUntil: 'networkidle0'});
  
  console.log("HTML:", await page.evaluate(() => document.body.innerHTML.substring(0, 500)));
  
  await browser.close();
})();
