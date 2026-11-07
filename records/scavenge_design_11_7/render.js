const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1170, height: 2900 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text()));
  await p.goto('file://' + __dirname + '/mock.html');
  await p.waitForFunction(() => document.title === 'done', null, { timeout: 30000 });
  const data = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  require('fs').writeFileSync(__dirname + '/mock.png', Buffer.from(data.split(',')[1], 'base64'));
  await b.close();
})();
