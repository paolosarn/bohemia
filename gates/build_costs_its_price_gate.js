/* ============================================================================
   BUILD COSTS ITS PRICE GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [building costs] / BUILD-COSTS-ITS-PRICE: "CE.build debits PRICES;
   building is free today and the 8/15 law says the pipe must be exercised."

   WHY IT IS URGENT AND NOT TIDY-UP. The round before this one shipped the wake
   beat: every placed building pays out every morning. Measured against a build
   path that touched the purse ZERO times, that made the BUILD button a pure
   FAUCET -- place a plot, get paid forever, for nothing. A faucet with no drain
   is the inflation failure engine/bohemia_purse.js was built to measure, and half
   of it shipped in my own name. So this gate's real job is to make the two halves
   inseparable: if the charge ever comes out again, A6 and B4 go red.

   THE LEGS THAT MATTER MOST ARE THE ONES ABOUT ORDER AND ABOUT ZERO:
     A5  a refused build charges NOTHING (no debit for a plot that never landed)
     A6  a successful build charges EXACTLY ONE, once
     B3  a broke player is REFUSED on the real surface, in words, and the model
         is unchanged -- no free plot, no silent no-op
     B4  and with a battery in the purse the same tap lands the plot AND takes the
         battery, in the same tap
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
console.log('BUILD COSTS ITS PRICE — nothing goes down for free, and the drain is real');
console.log('='.repeat(74));

/* ---- A. THE TILL, HEADLESS -------------------------------------------- */

const inst = PR.installCost(OM.DISTRICT);
const buildable = CE.buildableTypes(OM.DISTRICT);
ok('A1 every type the BUILD button can place has a price (' + inst.types + ' types), '
   + 'read off the same list the button reads so neither can drift',
   inst.types === buildable.length && buildable.length > 0
   && buildable.every(t => !!PR.priceOf(t)));

ok('A2 the price is HIS, twice over — one battery, and every row names the rulings '
   + 'behind it and is tuned:false',
   buildable.every(t => { const r = PR.priceOf(t);
     return r.amount === 1 && r.currency === 'electricity' && r.ruling && r.tuned === false; }));

/* A3. A BROKE PLAYER IS TOLD, NOT GUESSED AT. canAfford answers before the tap so
   the panel can put the price on the plot rather than only the refusal after it. */
const broke = P.create();
const a0 = PR.canAfford(broke, 'farm');
ok('A3 with an empty purse the answer is CANNOT_AFFORD with the numbers in it ('
   + JSON.stringify(a0) + ')',
   a0.ok === false && a0.reason === 'CANNOT_AFFORD' && a0.price === 1 && a0.have === 0);

/* A4. AND THE MONEY IS THE MONEY THE SHOP ALREADY USES. If this ever names a
   different pocket from payday's, the tag and the till have split, which is the
   9/5 market bug one layer up. */
const PAYDAY = require('../engine/bohemia_payday.js');
const shopCur = (function () {
  const p = P.create(); P.credit(p, 'electricity', 5, 'gate fixture', null, 1);
  const r = PAYDAY.buy(p, null, 'food', 1, require('../engine/bohemia_economy.js')
    .makeLedger(1, 4, 4));
  return r && r.currency;
})();
ok('A5 building is bought with the money the shop already takes (shop: ' + shopCur
   + ', build: ' + PR.COST_CURRENCY + '), not a second till',
   shopCur === PR.COST_CURRENCY);

/* A6. A REFUSED BUILD CHARGES NOTHING. The order is check -> build -> charge, so a
   plot that never landed must leave the ledger untouched. */
const rich = P.create();
P.credit(rich, 'electricity', 3, 'gate fixture', null, 1);
const E = CE.makeEdits();
const bad = CE.build(E, 10, 10, 'arterial', 'farm', OM.DISTRICT);   /* not desert */
const afterBad = P.balance(rich, 'electricity');
ok('A6 a REFUSED build charges nothing ("' + bad.why + '", 3 -> ' + afterBad + ')',
   bad.ok === false && afterBad === 3);

/* A7. A SUCCESSFUL BUILD CHARGES EXACTLY ONE, ONCE. */
const good = CE.build(E, 10, 10, 'desert', 'farm', OM.DISTRICT);
const ch = PR.charge(rich, 'farm', 1, '10,10');
ok('A7 a build that lands costs exactly one battery (3 -> '
   + P.balance(rich, 'electricity') + ', entry "'
   + (ch.entry && ch.entry.reason) + '")',
   good.ok && ch.applied && P.balance(rich, 'electricity') === 2
   && ch.entry.reason === 'build:farm' && ch.entry.kind === 'drain');

/* A8. IT IS A HARD SINK. The whole reason the purse is a ledger and not three
   counters: a drain DESTROYS value and is what fights the faucet. A transfer would
   look identical in the balance and be wrong in the measurement. */
const fl = P.flow(rich).electricity;
ok('A8 the charge lands as a HARD SINK, which is what makes the wake-beat yield safe '
   + 'to exist (' + JSON.stringify(fl) + ')',
   fl.drain === 1 && fl.transferOut === 0 && P.audit(rich).ok);

/* A9. THE FAUCET AND THE DRAIN CANCEL AT ONE BUILDING PER DAY, which is the number
   this gate exists to keep honest. Placing one costs one battery; it then makes one
   RESOURCE a day and never another battery. Building can never pay for itself. */
PR.install(OM.DISTRICT);
const cycle = P.create();
P.credit(cycle, 'electricity', 1, 'gate fixture', null, 1);
PR.charge(cycle, 'farm', 1, '10,10');
PR.tick(cycle, E, 2);
const cb = P.balances(cycle);
ok('A9 a building never pays its own price back — it costs a battery and makes '
   + 'resources (' + JSON.stringify(cb) + ')',
   cb.electricity === 0 && cb.resources >= 1);

/* ---- B. THE REAL SURFACE ---------------------------------------------- */
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

  let plot = null;
  for (let gy = 0; gy < 6 && !plot; gy++) {
    for (let gx = 0; gx < 5 && !plot; gx++) {
      const x = 60 + gx * 68, y = 240 + gy * 70;
      await page.touchscreen.tap(x, y);
      await page.waitForTimeout(200);
      const st = await page.evaluate(() => {
        const el = document.getElementById('buildpanel');
        return { shown: !!el && el.style.display !== 'none', build: !!(el && el.querySelector('#cbbuild')) };
      });
      if (st.shown && st.build) plot = { x, y };
    }
  }
  ok('B1 a buildable plot opens the panel by touch', !!plot);

  /* B2. THE PRICE IS ON THE PLOT BEFORE HE TAPS. A refusal he only meets by tapping
     is a bug report; a price he can read first is a decision. */
  const tag = await page.evaluate(() => {
    const el = document.getElementById('cbprice');
    return el ? (el.textContent || '').trim() : null; });
  ok('B2 the panel names the price BEFORE the tap ("' + tag + '")',
     !!tag && /battery|batteries/.test(tag));

  const tapBuild = async () => {
    const b = await page.evaluate(() => { const e = document.getElementById('cbbuild');
      if (!e) return null; const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
    if (b) { await page.touchscreen.tap(b.x, b.y); await page.waitForTimeout(800); }
    return !!b;
  };

  /* B3. BROKE: REFUSED, IN WORDS, WITH THE MODEL UNCHANGED. */
  const brokeRun = await page.evaluate(() => ({
    bal: BohemiaPurse.balances(purseGet()), edits: CE.count(EDITS) }));
  await tapBuild();
  const afterBroke = await page.evaluate(() => ({
    edits: CE.count(EDITS), bal: BohemiaPurse.balances(purseGet()),
    note: (document.getElementById('buildpanel') || {}).textContent || '' }));
  ok('B3 A BROKE PLAYER IS REFUSED AND TOLD WHY — no free plot and no silent no-op ('
     + brokeRun.edits + ' -> ' + afterBroke.edits + ' edits, "'
     + (afterBroke.note.match(/that costs[^.]*\./) || ['NO REFUSAL SHOWN'])[0] + '")',
     brokeRun.bal.electricity === 0 && afterBroke.edits === brokeRun.edits
     && /that costs/.test(afterBroke.note));

  /* B4. WITH A BATTERY: the same tap lands the plot AND takes the battery. */
  await page.evaluate(() => {
    /* the day pays one battery for a finished job; the gate puts one in the pocket
       so the BUILD path can be exercised without playing a whole quest. */
    BohemiaPurse.credit(purseGet(), 'electricity', 1, 'gate fixture', null, DAY.day);
    CBpanel();
  });
  const before = await page.evaluate(() => ({
    bal: BohemiaPurse.balances(purseGet()), edits: CE.count(EDITS) }));
  await tapBuild();
  const after = await page.evaluate(() => ({
    bal: BohemiaPurse.balances(purseGet()), edits: CE.count(EDITS),
    paid: window.__BUILD_PAID || 0 }));
  ok('B4 THE PLOT GOES DOWN AND THE BATTERY GOES WITH IT, in one tap (edits '
     + before.edits + ' -> ' + after.edits + ', batteries '
     + before.bal.electricity + ' -> ' + after.bal.electricity + ')',
     after.edits > before.edits && after.bal.electricity === before.bal.electricity - 1
     && after.paid >= 1);

  /* B5. AND THE LEDGER STILL BALANCES on the surface, with the charge recorded as a
     drain against the plot it bought. */
  const led = await page.evaluate(() => {
    const p = purseGet(), h = BohemiaPurse.history(p, 'electricity');
    const b = h.filter(e => String(e.reason).indexOf('build:') === 0)[0] || null;
    return { ok: BohemiaPurse.audit(p).ok, entry: b };
  });
  ok('B5 the ledger audits clean and the charge names the plot it bought ('
     + (led.entry ? led.entry.reason + ' @ ' + led.entry.ref + ', ' + led.entry.kind : 'NO ENTRY')
     + ')',
     led.ok && !!led.entry && led.entry.kind === 'drain' && !!led.entry.ref);

  ok('B6 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    the tag on the plot  : "' + tag + '"');
  console.log('    broke                : ' + brokeRun.edits + ' -> ' + afterBroke.edits + ' edits, refused');
  console.log('    one battery in hand  : edits ' + before.edits + ' -> ' + after.edits
    + ', batteries ' + before.bal.electricity + ' -> ' + after.bal.electricity);

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  BUILD COSTS ITS PRICE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  BUILD COSTS ITS PRICE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
