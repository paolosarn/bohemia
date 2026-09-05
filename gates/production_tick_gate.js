/* ============================================================================
   PRODUCTION TICK GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [buildings produce] / PRODUCTION-TICK: "on the wake beat, walk every
   placed building and call produce(); today produce() has one caller and it is a
   gate."

   THE JOB NAMES THE DEFECT AND THE DEFECT IS A GATE, so this gate has to be
   careful not to be the same thing again. A leg that calls
   BohemiaProduction.tick() from node and finds the balance moved proves the
   module works and proves NOTHING about whether the game ever calls it -- which
   is exactly the state produce() was already in. So the whole B section drives
   the REAL walked surface in a browser and the game does the calling:

     B1  build a plot with the real BUILD button
     B2  sleep, take the reckoning, wake into the next day
     B3  the purse moved, and it moved by the wake beat rather than by the test
     B4  the morning card SAYS SO in words a player reads
     B5  and a second wake on the same day pays nothing (a reload is a wake)

   A section stays headless on purpose: the arithmetic (spans counted once, a
   demolished lot stops paying, a ruled row is never overwritten) needs 60 cases,
   not 60 page loads.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const P = require('../engine/bohemia_purse.js');
const CE = require('../engine/bohemia_cityedit.js');
const PR = require('../engine/bohemia_production.js');
const OM = require('../engine/bohemia_overmap.js');

console.log('='.repeat(74));
console.log('PRODUCTION TICK — the buildings he placed make something on the wake beat');
console.log('='.repeat(74));

/* ---- A. THE ARITHMETIC, HEADLESS ---------------------------------------- */

/* A1. THE IDS ARE THE BUILD BUTTON'S OWN, not a list typed beside it. */
const inst = PR.install(OM.DISTRICT);
const buildable = CE.buildableTypes(OM.DISTRICT);
ok('A1 PRODUCTION is keyed on the types BUILD can actually place ('
   + inst.types + ' types, ' + inst.installed + ' rows written), so a district added to the '
   + 'canon enum is producible the same day with no second list',
   inst.types === buildable.length && buildable.length > 0
   && buildable.every(t => !!P.PRODUCTION[t]));

/* A2. EVERY ROW CARRIES ITS RULING. A hand-typed number with nothing behind it
   is what placeholder_number_gate exists to stop; this proves it cannot start
   here. */
ok('A2 every row it writes names the ruling behind it and is tuned:false',
   buildable.every(t => P.PRODUCTION[t].ruling && P.PRODUCTION[t].tuned === false));

/* A3. HIS RULING ALWAYS WINS. install() must never step on a row somebody set --
   that is the whole [PENDING Paolo] on which buildings make electricity or clout. */
P.PRODUCTION.farm = { clout: 9, ruling: 'A TEST RULING', tuned: false };
PR.install(OM.DISTRICT);
ok('A3 a row that already exists is KEPT, so the day he rules that a farm makes '
   + 'something else, nothing here overwrites it', P.PRODUCTION.farm.clout === 9);
delete P.PRODUCTION.farm; PR.install(OM.DISTRICT);

/* A4. ONE BUILDING IS ONE BUILDING. A 2x2 span covers four lots and must be paid
   once -- the same rule demolish already holds. */
const E = CE.makeEdits();
CE.build(E, 10, 10, 'desert', 'farm', OM.DISTRICT);
CE.buildBig(E, 20, 20, 2, 2, 'warehouse', OM.DISTRICT, () => 'desert');
const pl = PR.placed(E);
ok('A4 a 4-lot building is ONE building, not four (' + Object.keys(E.cells).length
   + ' edited lots -> ' + pl.length + ' buildings)',
   pl.length === 2 && pl.filter(b => b.w === 2 && b.h === 2).length === 1);

/* A5. A DEMOLISHED LOT IS DESERT AND DESERT IS NOT A BUILDING. Without this the
   delta pays forever for something he tore down, because demolish WRITES a cell
   rather than deleting one. */
const E2 = CE.makeEdits();
CE.build(E2, 5, 5, 'desert', 'farm', OM.DISTRICT);
const beforeDem = PR.placed(E2).length;
CE.demolish(E2, 5, 5, 'farm');
ok('A5 a demolished lot stops producing (' + beforeDem + ' -> ' + PR.placed(E2).length
   + '), though the delta still carries the cell', beforeDem === 1 && PR.placed(E2).length === 0);

/* A6. THE LEDGER SAYS WHETHER TODAY ALREADY PAID -- no second bookkeeping. */
const purse = P.create();
const t1 = PR.tick(purse, E, 1);
const t2 = PR.tick(purse, E, 1);
const t3 = PR.tick(purse, E, 2);
ok('A6 one day pays once and the next day pays again (day1 ' + t1.paid + ' paid, '
   + 'day1 again ' + t2.reason + ', day2 ' + t3.paid + ' paid)',
   t1.applied && t1.paid === 2 && !t2.applied && t2.reason === 'ALREADY_PRODUCED' && t3.paid === 2);

/* A7. AND THE LEDGER STILL BALANCES, which is the purse's own claim about itself. */
const aud = P.audit(purse);
ok('A7 the ledger audits clean after producing (' + JSON.stringify(aud.balances) + ')',
   aud.ok && aud.balances.resources === 4);

/* A8. NOTHING MINTS MONEY. Batteries are the money (9/4) and the market prices in
   them, so a build button that made electricity would be a printing press. That is
   a design act nobody ruled, and this leg is what stops it arriving by accident. */
ok('A8 production does not mint the money -- electricity and clout are untouched ('
   + JSON.stringify(aud.balances) + ')',
   aud.balances.electricity === 0 && aud.balances.clout === 0);

/* ---- B. THE GAME DOES THE CALLING -------------------------------------- */
(async () => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, url.replace(/^\//, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);

  const tapText = async (re) => {
    const t = await page.evaluate(src => {
      const R = new RegExp(src);
      const e = [...document.querySelectorAll('button,div,span')]
        .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                     && (x.textContent || '').trim().length < 30)
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), t: e.textContent.trim() };
    }, re);
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(2200); }
    return t;
  };

  await tapText('^GET UP$');
  await tapText('CITY|DROP IN');

  /* B1. BUILD ONE, WITH THE REAL BUTTON. Same hunt as builder_on_a_phone_gate:
     desert is the only thing you may build on, so find one rather than assume. */
  let found = null;
  for (let gy = 0; gy < 6 && !found; gy++) {
    for (let gx = 0; gx < 5 && !found; gx++) {
      const x = 60 + gx * 68, y = 240 + gy * 70;
      await page.touchscreen.tap(x, y);
      await page.waitForTimeout(200);
      const st = await page.evaluate(() => {
        const el = document.getElementById('buildpanel');
        return { shown: !!el && el.style.display !== 'none', build: !!(el && el.querySelector('#cbbuild')) };
      });
      if (st.shown && st.build) found = { x, y };
    }
  }
  if (found) {
    /* A BATTERY IN THE POCKET FIRST, NEW ON 9/5. When this gate was written, building
       was free; the [building costs] job landed the same day and BUILD now debits one
       battery, so B1 went red -- correctly, because the game changed under a gate that
       was still true about the old game. A FIXTURE fixes that, never a softer
       assertion: the day pays a battery for a finished job, and this puts one in the
       pocket so the WAKE BEAT can be exercised without playing a whole quest. Whether
       the charge is right belongs to gates/build_costs_its_price_gate.js. */
    await page.evaluate(() => {
      try { BohemiaPurse.credit(purseGet(), 'electricity', 1, 'gate fixture', null, DAY.day);
            CBpanel(); } catch (e) {} });
    await page.evaluate(() => { const s = document.getElementById('cbtype');
      if (s && s.options.length) s.selectedIndex = 0; });
    const btn = await page.evaluate(() => { const b = document.getElementById('cbbuild');
      if (!b) return null; const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
    if (btn) { await page.touchscreen.tap(btn.x, btn.y); await page.waitForTimeout(800); }
  }
  const placedN = await page.evaluate(() => {
    try { return BohemiaProduction.placed(EDITS).length; } catch (e) { return -1; } });
  ok('B1 a building really is standing in the model after the real BUILD button ('
     + placedN + ' placed)', placedN >= 1);

  const before = await page.evaluate(() => {
    try { return BohemiaPurse.balances(purseGet()); } catch (e) { return null; } });

  /* B2 + B3. SLEEP, TAKE THE RECKONING, WAKE. The game turns the day over; nothing
     in this gate calls tick(). */
  const slept = await tapText('^🛏 SLEEP$|^SLEEP$');
  const rolled = await tapText('^SLEEP \\u2192 DAY|SLEEP →');
  const after = await page.evaluate(() => {
    try { return { bal: BohemiaPurse.balances(purseGet()), produced: window.__PRODUCED || 0,
                   day: DAY.day, phase: DAY.phase }; } catch (e) { return null; } });

  ok('B2 the day turned over on the real surface (slept "' + (slept ? slept.t : 'NO')
     + '", rolled "' + (rolled ? rolled.t : 'NO') + '", now day '
     + (after ? after.day : '?') + ')', !!after && after.day >= 2);

  ok('B3 THE WAKE BEAT CALLED PRODUCE, NOT THIS TEST — the purse moved by itself ('
     + JSON.stringify(before) + ' -> ' + JSON.stringify(after && after.bal)
     + ', __PRODUCED=' + (after ? after.produced : '?') + '), which is the one claim '
     + 'a node-side tick() cannot make',
     !!after && after.produced >= 1
     && after.bal.resources > (before ? before.resources : 0));

  /* B4. AND HE CAN SEE IT. A number that moves in a ledger nobody renders is the
     same defect one layer up. */
  const card = await page.evaluate(() => {
    const el = document.getElementById('daycardIn');
    return el ? (el.textContent || '') : ''; });
  ok('B4 the morning card says it in words a player reads ("'
     + (card.match(/[^.]*by the door overnight\./) || ['NOT ON THE CARD'])[0].trim() + '")',
     /by the door overnight/.test(card));

  /* B5. A RELOAD IS A WAKE. The guard has to hold on the surface, not only in node. */
  const again = await page.evaluate(() => {
    try { const b0 = BohemiaPurse.balances(purseGet());
      const r = produceOvernight();
      return { r: r && r.reason, b0: b0, b1: BohemiaPurse.balances(purseGet()) };
    } catch (e) { return null; } });
  ok('B5 a second wake on the same day pays nothing (' + (again ? again.r : '?') + ', '
     + (again ? again.b0.resources + ' -> ' + again.b1.resources : '?') + ')',
     !!again && again.r === 'ALREADY_PRODUCED' && again.b0.resources === again.b1.resources);

  ok('B6 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    buildings placed : ' + placedN);
  console.log('    purse before/after the night : ' + JSON.stringify(before)
    + ' -> ' + JSON.stringify(after && after.bal));
  console.log('    PRODUCTION rows  : ' + Object.keys(P.PRODUCTION).length
    + ' (from ' + buildable.length + ' buildable district types)');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  PRODUCTION TICK: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  PRODUCTION TICK: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
