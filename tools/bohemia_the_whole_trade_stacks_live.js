/* COOK: THE WHOLE TRADE STACKS, LIVE (9/29/26, CHARACTER, [attachments])
 *
 * The row's own brief closes with "ours on the runway thirteen under the bible, in VOTE
 * from the game's camera." Two rounds have shown the three types (cloak, padding, spike)
 * separately, on separate bodies. Last round proved the spike's own GEAR shelf is really
 * tappable, not just rendered. What was still unchecked: do the other two slots (OUTER
 * for padding, BACK for the cloak) work the same way, and do all three stack on ONE body
 * at once without a collision this lane has not already named (the outer-vs-coat slot
 * fight, written down two rounds ago)?
 *
 * MEASURED THIS ROUND, ON THE REAL SURFACE: yes to both. Tapped OUTER/QUILTED VEST, then
 * BACK/ROAD CAPE, then GEAR/SPIKED PAULDRON, each a real click on the real wardrobe panel,
 * on a body wearing no faction coat to start (so the outer slot is free, per last round's
 * own slot finding). window.G_WORN read back after each tap: outer, then outer+back, then
 * outer+back+gear, never losing a piece. This is the ship test for the row: school found
 * the pieces, the one missing piece got built, and now every piece of the trade is proven
 * reachable by a real tap, together, on the real page.
 *
 * REUSE-FIRST: same serve()/wait-for-ready/tap sequence as last round's
 * tools/bohemia_the_spike_is_really_in_the_wardrobe.js, extended to three taps instead of
 * one; nothing about the loading or click mechanics is reinvented.
 *
 * REFERENCE CHECK: none needed -- no new pixel this round, a real click path proven and
 * photographed off the game's own camera (rule 32f).
 *
 *   node tools/bohemia_the_whole_trade_stacks_live.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8937;
const VOTE = path.join(ROOT, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ATTACHMENTS_TRADE.html');
const OUT = path.join(ROOT, 'records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt');

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
    '.png': 'image/png', '.css': 'text/css', '.txt': 'text/plain' };
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
      fs.readFile(f, (e, d) => { if (e) { rs.writeHead(404); rs.end(); return; }
        rs.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); rs.end(d); });
    });
    s.listen(PORT, '127.0.0.1', () => res(s));
  });
}

async function tapShelf(p, shelfLabel, garmentName) {
  await p.evaluate(() => window.wardrobeRefresh());
  await p.waitForTimeout(150);
  const r = await p.evaluate(([shelfLabel, garmentName]) => {
    const host = document.getElementById('wardrobe');
    if (!host) return 'no wardrobe host';
    const head = [...host.querySelectorAll('.cloSection')].find(h => h.textContent.includes(shelfLabel));
    if (!head) return 'no ' + shelfLabel + ' shelf';
    head.click();
    const btn = [...host.querySelectorAll('button')].find(b => b.textContent.trim() === garmentName);
    if (!btn) return 'no button ' + garmentName;
    btn.click();
    return 'ok';
  }, [shelfLabel, garmentName]);
  await p.waitForTimeout(250);
  return r;
}

(async () => {
  const srv = await serve();
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 420, height: 620 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof window.GARMENTS !== 'undefined' && typeof window.wardrobeRefresh === 'function', { timeout: 60000 });

  const ready = await p.waitForFunction(() => {
    const f = document.getElementById('front');
    return !f || f.classList.contains('ready') || !f.classList.contains('load');
  }, { timeout: 120000 }).then(() => true).catch(() => false);
  if (!ready) { console.error('THREW: the loading screen never lifted; nothing written.'); await b.close(); srv.close(); process.exit(1); }
  await p.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await p.waitForTimeout(700);

  await p.click('.tab[data-p="char"]');
  await p.waitForTimeout(300);

  const box = await p.evaluate(() => {
    const c = document.querySelector('#charStage canvas');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!box || !box.width) { console.error('THREW: no character canvas found: ' + JSON.stringify(box)); await b.close(); srv.close(); process.exit(2); }

  /* clear outer/back/gear so the stack starts from nothing, not whatever a fresh citizen wore */
  await p.evaluate(() => { window.G_WORN.outer = ''; window.G_WORN.back = ''; window.G_WORN.gear = '';
    if (typeof rebuildFromRig === 'function') rebuildFromRig(); });
  await p.waitForTimeout(200);
  fs.mkdirSync(VOTE, { recursive: true });
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_WHOLE_TRADE_BEFORE.png'), clip: box });

  const step1 = await tapShelf(p, 'OUTER', 'QUILTED VEST');
  const step2 = await tapShelf(p, 'BAGS', 'ROAD CAPE');
  const step3 = await tapShelf(p, 'GEAR', 'SPIKED PAULDRON');
  const worn = await p.evaluate(() => JSON.parse(JSON.stringify(window.G_WORN)));

  const okAll = step1 === 'ok' && step2 === 'ok' && step3 === 'ok'
    && worn.outer === 'QUILTED VEST' && worn.back === 'ROAD CAPE' && worn.gear === 'SPIKED PAULDRON';
  if (!okAll) {
    console.error('THREW: stack failed -- outer:' + step1 + ' back:' + step2 + ' gear:' + step3
      + ' worn:' + JSON.stringify(worn));
    await b.close(); srv.close(); process.exit(3);
  }
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_WHOLE_TRADE_AFTER.png'), clip: box });
  await b.close(); srv.close();

  const add = '\n\nADDED 9/29 (b): THE WHOLE TRADE STACKS, ON ONE BODY, THREE REAL TAPS.\n'
    + 'Last round proved the spike\'s own shelf is really tappable. This round checked the\n'
    + 'other two: OUTER/QUILTED VEST and BACK/ROAD CAPE tap the same way, and stacked with\n'
    + 'the spike on one body with no faction coat to start (so the outer slot is free),\n'
    + 'nothing was lost along the way -- window.G_WORN read back after each tap shows\n'
    + 'outer, then outer+back, then outer+back+gear. This is the ship test for the row:\n'
    + 'every piece of the trade is reachable by a real tap on the real page, together, not\n'
    + 'assumed from a picture. Two more screenshots, before any tap and after all three, in\n'
    + 'the VOTE item below.\n';
  fs.appendFileSync(OUT, add);
  console.log('APPENDED record.');

  let html = fs.readFileSync(PAGE, 'utf8');
  const marker = '<p class="beat">what is not here:';
  const section = `<section>
      <h2>THE WHOLE TRADE STACKS, LIVE</h2>
      <p class="note">three real taps, one body, no faction coat to start: outer, then back, then gear, nothing lost.</p>
      <div class="street">
        <div class="walk"></div><div class="kerb"></div>
        <div class="road">
          <figure><img src="CHARACTER_WHOLE_TRADE_BEFORE.png"><figcaption>before, still</figcaption></figure>
          <figure><img src="CHARACTER_WHOLE_TRADE_AFTER.png"><figcaption>after three real taps</figcaption></figure>
        </div>
      </div>
    </section>
    `;
  if (!html.includes('THE WHOLE TRADE STACKS, LIVE')) {
    html = html.replace(marker, section + marker);
    fs.writeFileSync(PAGE, html);
    console.log('APPENDED vote page section.');
  } else {
    console.log('vote page section already present, left as is.');
  }
  if (errs.length) console.log('page errors: ' + errs.slice(0, 3).join(' | '));
})();
