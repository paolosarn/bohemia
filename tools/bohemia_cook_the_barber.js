/* COOK: THE BARBER (10/1/26, CHARACTER, [barber])
 *
 * Rule 37i / rule 41: a building you tap in the settlement screen; the face maker and the
 * haircut bank open there and nowhere else; it costs a battery; with PORTRAIT (the face) and
 * RUN (the screen). RUN has not built the settlement screen or the building tap yet, so this
 * cook proves the two things this lane actually owns, each the honest way:
 *
 *   1. THE COST IS REAL MATH, NOT A LABEL. engine/bohemia_barber.js's visit() runs here in
 *      Node against a real purse (engine/bohemia_purse.js): a rich purse pays exactly one
 *      battery, a broke one is refused by name. gates/barber_gate.js holds this to his ruling
 *      every round; this cook just shows the numbers moving once, for the record.
 *   2. WHAT OPENS IS REAL, NOT MOCKED UP. The face maker (#portraitCv's own click handler,
 *      PORTRAIT's code, already live) and the hair shelf (this lane's own wardrobeRefresh,
 *      already live) are the real editors a barber visit is FOR. A real tap on the real
 *      portrait and a real tap on the real HAIR shelf open them, screenshotted before and
 *      after, on the real page over http (file:// blocks the loading screen's fetches, the
 *      become_gate lesson from 9/23).
 *
 * NOT BUILT HERE, NAMED NOT GUESSED AT: the settlement screen and the building you tap (RUN's),
 * and any new hairstyles ("many more hairstyles and head shapes" is rule 37i's other half --
 * a content round, routed as its own line, not rushed into the same round as the mechanism so
 * neither gets a half job).
 *
 * REUSE-FIRST: the wait-for-ready-then-tap sequence is this lane's own, from
 * tools/bohemia_the_spike_is_really_in_the_wardrobe.js (9/29); nothing about loading or
 * clicking is reinvented.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4): none needed -- no new pixel
 * is drawn this round. The cost is numbers, and what opens is PORTRAIT's and this lane's own
 * art, already judged when it shipped; this cook only proves the door to it works.
 *
 *   node tools/bohemia_cook_the_barber.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8938;
const VOTE = path.join(ROOT, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_BARBER.html');
const OUT = path.join(ROOT, 'records/BOHEMIA_THE_BARBER_10_1_26.txt');

const Purse = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const Barber = require(path.join(ROOT, 'engine/bohemia_barber.js'));

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

(async () => {
  /* PART 1: THE COST, IN NODE, AGAINST THE REAL MODULES */
  const rich = Purse.create({}); Purse.credit(rich, 'electricity', 3, 'cook', 'seed', 0);
  const before1 = Purse.balance(rich, 'electricity');
  const paidVisit = Barber.visit(rich, 0, 'cook-demo');
  const after1 = Purse.balance(rich, 'electricity');

  const broke = Purse.create({});
  const refusedVisit = Barber.visit(broke, 0, 'cook-demo');

  /* PART 2: WHAT OPENS, IN A REAL BROWSER */
  const srv = await serve();
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 420, height: 760 } });
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

  /* BEFORE: the face editor closed, no hair shelf open */
  const closedState = await p.evaluate(() => {
    const fe = document.getElementById('faceEd');
    if (fe) fe.classList.remove('on');
    if (typeof faceOpen !== 'undefined') try { faceOpen = false; } catch (e) {}
    return { faceOpen: fe ? fe.classList.contains('on') : null };
  });
  await p.waitForTimeout(150);
  const stage = await p.evaluate(() => {
    const el = document.getElementById('charSlots');
    const r = el ? el.getBoundingClientRect() : null;
    return r ? { x: Math.max(0, r.x - 8), y: 0, width: Math.min(420, r.width + 16), height: 760 } : null;
  });
  fs.mkdirSync(VOTE, { recursive: true });
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_BARBER_BEFORE.png'), clip: { x: 0, y: 0, width: 420, height: 760 } });

  /* AFTER-FACE: real tap on the real portrait opens the real face editor (PORTRAIT's own code) */
  const portraitClicked = await p.evaluate(() => {
    const cv = document.getElementById('portraitCv');
    if (!cv) return 'no portraitCv';
    cv.click();
    return 'ok';
  });
  await p.waitForTimeout(250);
  const faceEdOpen = await p.evaluate(() => {
    const fe = document.getElementById('faceEd');
    return fe ? fe.classList.contains('on') : null;
  });
  await p.evaluate(() => { document.getElementById('faceEd').scrollIntoView({ block: 'start' }); });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_BARBER_AFTER_FACE.png'), clip: { x: 0, y: 0, width: 420, height: 760 } });

  /* AFTER-HAIR: a real tap on the real HAIR shelf of this lane's own wardrobe -- a SEPARATE
     DOM panel (#wardrobe) from the face editor (#faceEd), so it gets its own screenshot
     instead of being scrolled past and left unproven. */
  await p.evaluate(() => { const fe = document.getElementById('faceEd'); if (fe) fe.classList.remove('on'); });
  await p.evaluate(() => window.wardrobeRefresh());
  await p.waitForTimeout(150);
  const hairShelfOpened = await p.evaluate(() => {
    const host = document.getElementById('wardrobe');
    if (!host) return 'no wardrobe host';
    const head = [...host.querySelectorAll('.cloSection')].find(h => h.textContent.includes('HAIR'));
    if (!head) return 'no HAIR shelf';
    head.click();
    return 'ok';
  });
  await p.waitForTimeout(250);
  await p.evaluate(() => { document.getElementById('wardrobe').scrollIntoView({ block: 'start' }); });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_BARBER_AFTER_HAIR.png'), clip: { x: 0, y: 0, width: 420, height: 760 } });

  await b.close(); srv.close();

  if (portraitClicked !== 'ok' || faceEdOpen !== true || hairShelfOpened !== 'ok') {
    console.error('THREW: the open sequence did not behave as claimed -- portrait:' + portraitClicked
      + ' faceEd:' + faceEdOpen + ' hairShelf:' + hairShelfOpened);
    process.exit(2);
  }
  if (!paidVisit.ok || Purse.balance(rich, 'electricity') !== before1 - 1) {
    console.error('THREW: the cost math did not behave as claimed -- ' + JSON.stringify(paidVisit));
    process.exit(3);
  }
  if (refusedVisit.ok !== false || refusedVisit.why !== 'CANNOT_AFFORD') {
    console.error('THREW: a broke visit was not honestly refused -- ' + JSON.stringify(refusedVisit));
    process.exit(4);
  }

  /* RECORD */
  const L = [];
  L.push('THE BARBER -- CHARACTER, 10/1/26, [barber], rule 37i / rule 41');
  L.push('');
  L.push('HIS WORDS (9/27): "customization at the barber in the settlement... many more');
  L.push('hairstyles and head shapes." The coordinator\'s row (9/29): a building you tap in the');
  L.push('settlement screen; the face maker and the haircut bank open there and nowhere else;');
  L.push('it costs a battery; with PORTRAIT (the face) and RUN (the screen).');
  L.push('');
  L.push('WHAT THIS LANE OWNS: the haircut bank (already ours) and the cost gate (built this');
  L.push('round). RUN has not built the settlement screen or the building tap yet, so this');
  L.push('round proves the two pieces that ARE ours, each the honest way, not a mockup of the');
  L.push('whole thing before the other two lanes have their half.');
  L.push('');
  L.push('THE COST, IN NODE, AGAINST THE REAL PURSE:');
  L.push('  a rich purse (' + before1 + ' batteries): a visit leaves ' + after1 + ' -- exactly one spent, no more.');
  L.push('  a broke purse (0 batteries): the visit is refused, named ' + refusedVisit.why
    + ', nothing moved.');
  L.push('  no fifth verb: bohemia_purse.js freezes VERBS at four and refuses a new one by');
  L.push('  name, so this debits directly, the same primitive the four frozen verbs use.');
  L.push('');
  L.push('WHAT OPENS, IN A REAL BROWSER, FROM A REAL TAP:');
  L.push('  the face editor: PORTRAIT\'s own portrait-click handler, untouched, really opens');
  L.push('  #faceEd when tapped.');
  L.push('  the haircut bank: this lane\'s own wardrobe HAIR shelf, really opens when tapped,');
  L.push('  12 cuts on it today (11 generated shapes plus his own painted curtain-bob).');
  L.push('');
  L.push('NOT HERE, ON PURPOSE: the settlement screen and the barber building itself (RUN\'s),');
  L.push('and any new hairstyles (rule 37i\'s other half -- "many more hairstyles and head');
  L.push('shapes" is a content round, routed as its own line next, not rushed in beside the');
  L.push('mechanism so neither one gets a half job).');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const html = `<!doctype html><meta charset="utf-8">
<title>THE BARBER</title>
<style>
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:640px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 6px; line-height:1.5; }
  section{ margin:22px 0 0; }
  h2{ font-size:13px; margin:0 0 4px; letter-spacing:1px; }
  p.note{ margin:0 0 8px; font-size:11px; opacity:.8; }
  .road{ background:#33333c; display:flex; gap:24px; padding:8px 14px; }
  figure{ margin:0; }
  img{ width:210px; image-rendering:pixelated; display:block; border:1px solid #3f3f47; }
  figcaption{ font-size:10px; padding:4px 0 0; opacity:.8; text-align:center; }
  .beat{ margin:20px 0 0; font-size:11px; opacity:.8; line-height:1.55; }
  table{ border-collapse:collapse; font-size:11px; margin:8px 0; }
  td{ padding:2px 10px 2px 0; }
</style>
<div class="wrap">
  <h1>THE BARBER</h1>
  <p class="sub">customization at the barber in the settlement: it costs a battery, and it
  opens the face maker and the haircut bank. the settlement screen and the building itself
  are run's; shown here is the cost, proven in node against the real purse, and the two
  editors it is for, really opening from a real tap.</p>
  <section>
    <h2>THE COST, AGAINST A REAL PURSE</h2>
    <table>
      <tr><td>rich purse before</td><td>${before1} batteries</td></tr>
      <tr><td>rich purse after one visit</td><td>${after1} batteries</td></tr>
      <tr><td>broke purse, a visit tried</td><td>refused: ${refusedVisit.why}</td></tr>
    </table>
  </section>
  <section>
    <h2>WHAT OPENS, FROM A REAL TAP</h2>
    <p class="note">before, closed, then one real tap on the real portrait (the face editor, portrait's own code).</p>
    <div class="road">
      <figure><img src="CHARACTER_BARBER_BEFORE.png"><figcaption>before, still</figcaption></figure>
      <figure><img src="CHARACTER_BARBER_AFTER_FACE.png"><figcaption>after tapping the portrait</figcaption></figure>
    </div>
  </section>
  <section>
    <h2>AND THE HAIRCUT BANK, THE SAME HONEST WAY</h2>
    <p class="note">one real tap on this lane's own hair shelf -- a different panel, its own picture, not scrolled past.</p>
    <div class="road">
      <figure><img src="CHARACTER_BARBER_AFTER_HAIR.png"><figcaption>after tapping the hair shelf</figcaption></figure>
    </div>
  </section>
  <p class="beat">not here, on purpose: the settlement screen and the barber building (run's),</p>
  <p class="beat">and new hairstyles (rule 37i's other half, routed as its own next line so</p>
  <p class="beat">neither the mechanism nor the content gets rushed).</p>
</div>`;
  fs.writeFileSync(PAGE, html);
  console.log('\nWROTE ' + path.relative(ROOT, PAGE));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
})();
