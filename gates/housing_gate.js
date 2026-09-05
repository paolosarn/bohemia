/* ============================================================================
   HOUSING GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [people housed] / HOUSING: "residents per plot, capacity, a
   population number that moves; the other half of the 7/26 economy law, zero
   built."

   WHAT WAS MEASURED FIRST, ON THE REAL SURFACE, BEFORE A LINE WAS WRITTEN: build a
   suburb on empty desert and the valley's census does not move. 297 before, 297
   after, and headsAt() on the plot you just built answers 0 both times. That is not
   a bug in the population module -- it is the module answering a different question.
   Everything it knows comes from the SEED: zoneAt() surveys a 4x4 neighbourhood,
   rolls the ruled three-zone share against a hash, and a quarter of the map is
   'empty' on purpose. THE POPULATION WAS A FUNCTION OF THE SEED, NOT OF WHAT THE
   PLAYER BUILT, and there was no path from "I built a house" to "somebody lives in
   it".

   THE LEG THAT IS REALLY A LAW IS A6. His 7/29 ruling is LOCKED and it is not a
   detail: THE POPULATION IS THE FOOD CARRYING CAPACITY -- ~65,000 in the valley,
   ~300 walkable, and the research behind it found the food supply cannot
   meaningfully grow in a lifetime. A city builder where putting up flats makes new
   people appear breaks that law quietly, in the direction every city builder drifts.
   So HOUSING DOES NOT CREATE PEOPLE, IT HOUSES THEM: residents are capped by the
   valley, and A6 stays red the moment that cap comes out.

   A7 IS THE OTHER HONESTY LEG AND IT IS ABOUT UNITS. headsAt() takes a cell and
   returns its 4x4 BLOCK's heads, so reporting it as "people on this plot" would
   claim one settlement of thirteen sixteen times over. residentsAt() carries the
   scope with the number and the panel says "on this block" for generated ground and
   "here, in what you built" for his own. A NUMBER IS NOT HONEST UNTIL ITS UNIT IS.
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

const CE = require('../engine/bohemia_cityedit.js');
const OM = require('../engine/bohemia_overmap.js');
const POP = require('../engine/bohemia_population.js');
const PR = require('../engine/bohemia_production.js');
const H = require('../engine/bohemia_housing.js');

console.log('='.repeat(74));
console.log('HOUSING — somebody lives in what you built, and the food ceiling still holds');
console.log('='.repeat(74));

/* ---- A. THE ARITHMETIC, HEADLESS ---------------------------------------- */

/* A1. WHICH BUILDINGS HOUSE ANYBODY IS READ, NEVER TYPED. If this ever drifts from
   the map the whole valley is counted with, two systems are disagreeing about what
   a home is. */
const inst = H.installCap();
const res = Object.keys(POP.RESIDENTIAL);
ok('A1 the housing types ARE the population module\'s own RESIDENTIAL map ('
   + res.join(', ') + ')',
   inst.types === res.length && res.length > 0 && res.every(t => H.capacityOf(t) > 0));

/* A2. AND A BUILDING THAT HOUSES NOBODY IS AN ANSWER, NOT A GAP. */
ok('A2 a solar farm has no beds, and that is an answer rather than an unruled number '
   + '(solar=' + H.capacityOf('solar') + ', warehouse=' + H.capacityOf('warehouse') + ')',
   H.capacityOf('solar') === 0 && H.capacityOf('warehouse') === 0);

/* A3. THE NUMBER IS THE REPO'S OWN RESEARCHED MEAN, not one invented here. */
ok('A3 one building is one household, at the population module\'s own HOUSEHOLD_MEAN ('
   + POP.HOUSEHOLD_MEAN + ')', H.capacityOf('suburb') === POP.HOUSEHOLD_MEAN);

/* A4. ONE BUILDING IS ONE BUILDING -- borrowed whole from production, so a 4-lot
   block is one household here exactly as it is one payout there. A third opinion
   about what a building is would be this lane's fourth post-mortem on the subject. */
PR.install(OM.DISTRICT);
const E = CE.makeEdits();
CE.build(E, 10, 10, 'desert', 'suburb', OM.DISTRICT);
CE.build(E, 11, 10, 'desert', 'solar', OM.DISTRICT);
CE.buildBig(E, 20, 20, 2, 2, 'apartment', OM.DISTRICT, () => 'desert');
ok('A4 a 4-lot block is ONE household and a solar farm is none ('
   + Object.keys(E.cells).length + ' edited lots -> ' + H.homes(E).length + ' homes, '
   + 'capacity ' + H.capacity(E).toFixed(1) + ')',
   H.homes(E).length === 2 && Math.abs(H.capacity(E) - 2 * POP.HOUSEHOLD_MEAN) < 1e-9);

/* A5. THE MEAN IS APPLIED TO THE TOTAL. Rounding 2.2 down at every plot would
   quietly delete a fifth of everybody, which is the same class of mistake the
   population module's own comment describes refusing to make. */
const SEED = 2691674296;                       /* the ONE SEED law's own number */
const realOm = OM.buildOvermap(SEED);
const E10 = CE.makeEdits();
for (let i = 0; i < 10; i++) CE.build(E10, 30 + i, 30, 'desert', 'suburb', OM.DISTRICT);
const r10 = H.report(realOm, null, SEED, E10);
ok('A5 ten households house ' + r10.residents + ', not ' + (10 * Math.floor(POP.HOUSEHOLD_MEAN))
   + ' — the mean lands on the TOTAL, never rounded away per plot',
   r10.residents === 22);

/* A6. THE LAW. *** HOUSING DOES NOT CREATE PEOPLE. *** laws/..._HOW_MANY_PEOPLE_7_29
   is LOCKED: the population IS the food carrying capacity and the food supply cannot
   meaningfully grow in a lifetime. Build a thousand flats and the valley does not
   grow a thousand mouths. */
const EBIG = CE.makeEdits();
for (let i = 0; i < 400; i++)
  CE.build(EBIG, i % 96, (i / 96) | 0, 'desert', 'apartment', OM.DISTRICT);
const capped = H.report(realOm, null, SEED, EBIG);
ok('A6 BUILDING FLATS DOES NOT MAKE PEOPLE — capacity for '
   + capped.capacity.toFixed(0) + ' but only ' + capped.residents
   + ' live there, because the valley holds ' + capped.valley
   + ' and THE POPULATION IS THE FOOD CEILING (7/29, LOCKED)',
   capped.capacity > capped.valley && capped.capped === true
   && capped.residents === capped.valley && capped.valley > 0);

/* A6b. AND THE CAP MUST NOT BE BREAKABLE BY A MEASUREMENT FAILURE, which is a
   DIFFERENT thing from an empty valley and the first cut could not tell them apart:
   it returned 0 for both, so with no world to census the cap fell through and 400
   blocks of flats housed eighty-eight people out of a valley of none. An
   UNMEASURABLE valley houses nobody rather than everybody, and says why. */
const blind = H.report(null, null, SEED, EBIG);
ok('A6b an UNMEASURABLE valley houses NOBODY, not everybody, and names the reason ('
   + JSON.stringify({ residents: blind.residents, valley: blind.valley, reason: blind.reason }) + ')',
   blind.residents === 0 && blind.valley === null && blind.reason === 'NO_VALLEY');

/* A6c. AND A VALLEY THAT REALLY IS EMPTY IS NOT A FAILURE -- it is a measurement,
   and the answer is the same for a better reason: nobody to move in. */
const dead = H.report({ n: 96, at: () => null }, null, SEED, EBIG);
ok('A6c a valley that really holds nobody houses nobody, and that is CAPPED rather '
   + 'than unmeasured (' + JSON.stringify({ residents: dead.residents, valley: dead.valley,
     capped: dead.capped }) + ')',
   dead.residents === 0 && dead.valley === 0 && dead.capped === true);

/* A7. A NUMBER IS NOT HONEST UNTIL ITS UNIT IS. */
const mine = H.residentsAt(null, null, 1, E, 20, 21);   /* inside the 2x2 apartment */
ok('A7 a plot HE built reports its own household, scoped to the PLOT ('
   + JSON.stringify(mine) + ')',
   !!mine && mine.scope === 'plot' && mine.yours === true && mine.type === 'apartment');

/* A7b. AND GROUND HE DID NOT BUILD REPORTS ITS BLOCK, WHICH IS THE HALF THAT MATTERS.
   headsAt() resolves a cell to its 4x4 neighbourhood and returns the BLOCK's heads,
   so calling that "people on this plot" would claim one settlement of thirteen
   sixteen times over. THIS LEG EXISTS BECAUSE A MUTATION SLIPPED THROUGH WITHOUT IT:
   flipping the scope to 'plot' left the browser leg green, because that leg decided
   what to expect FROM THE ANSWER IT WAS CHECKING. A test that reads the claim and
   then grades the claim against itself is decoration. */
const theirs = H.residentsAt(realOm, null, SEED, CE.makeEdits(), 12, 4);
ok('A7b ground he did NOT build reports its BLOCK, never the plot ('
   + JSON.stringify(theirs) + ')',
   !!theirs && theirs.scope === 'block' && theirs.yours === false);

/* ---- B. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  const server = http.createServer((req, res2) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, url.replace(/^\//, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res2.writeHead(404); return res2.end(); }
    res2.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res2);
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
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(1800); }
    return t;
  };
  const tapId = async (id) => {
    const b = await page.evaluate(i => {
      const e = document.getElementById(i);
      if (!e || e.offsetParent === null) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    }, id);
    if (b) { await page.touchscreen.tap(b.x, b.y); await page.waitForTimeout(1000); }
    return !!b;
  };

  await tapText('^GET UP$');
  await tapId('buildbtn');

  /* B1. THE PLOT HE IS STANDING ON ANSWERS WHO IS ON IT, in the unit it can. */
  const stood = await page.evaluate(() => {
    const el = document.getElementById('cblives');
    let r = null;
    try { r = BohemiaHousing.residentsAt(om, POWER, seed, EDITS, CB.sel[0], CB.sel[1]); } catch (e) {}
    return { line: el ? (el.textContent || '').trim() : null, r: r };
  });
  /* THE EXPECTATION COMES FROM AN INDEPENDENT FACT -- did HE build this plot -- and
     never from the scope the answer reported, which is grading a claim against
     itself. */
  const isHis = await page.evaluate(() => {
    try { return !!BohemiaHousing.builtAt(EDITS, CB.sel[0], CB.sel[1]); } catch (e) { return null; }
  });
  ok('B1 a plot he is standing on says who lives there, in the unit the number really '
     + 'has (his own plot: ' + isHis + ', line: "' + stood.line + '")',
     !!stood.line && !!stood.r && isHis !== null
     && (isHis ? (/in what you built/.test(stood.line) && stood.r.scope === 'plot')
               : (/on this block/.test(stood.line) && stood.r.scope === 'block')));

  /* B2 + B3. CLEAR IT, FUND IT, AND BUILD A HOME. */
  await tapId('cbdem');
  const before = await page.evaluate(() => {
    BohemiaPurse.credit(purseGet(), 'electricity', 2, 'gate fixture', null, DAY.day);
    const s = document.getElementById('cbtype');
    if (s) { for (let i = 0; i < s.options.length; i++)
      if (s.options[i].value === 'suburb') { s.selectedIndex = i; break; }
      if (s.onchange) s.onchange(); }
    return { r: BohemiaHousing.report(om, POWER, seed, EDITS, om.n),
             house: (document.getElementById('cbhouse') || {}).textContent || '' };
  });
  ok('B2 the panel says what this type would house BEFORE he commits to it ("'
     + before.house.trim() + '")', /houses about/.test(before.house));

  await tapId('cbbuild');
  const after = await page.evaluate(() => ({
    r: BohemiaHousing.report(om, POWER, seed, EDITS, om.n),
    lives: (document.getElementById('cblives') || {}).textContent || '' }));
  ok('B3 THE POPULATION NUMBER MOVES WHEN HE BUILDS — residents '
     + before.r.residents + ' -> ' + after.r.residents + ' (valley ' + after.r.valley
     + '), which is the thing that did not exist before this job',
     after.r.residents > before.r.residents && after.r.buildings > before.r.buildings);

  ok('B4 and the plot he just built says who is in it ("' + after.lives.trim() + '")',
     /in what you built/.test(after.lives));

  /* B5. AND THE MORNING SAYS IT. A number that only lives in a panel he has to open
     is a number he will never meet. */
  await tapText('^🛏 SLEEP$|^SLEEP$');
  await tapText('SLEEP \\u2192 DAY|SLEEP →');
  const card = await page.evaluate(() => {
    const el = document.getElementById('daycardIn');
    return el ? (el.textContent || '') : ''; });
  ok('B5 the morning card says it in words a player reads ("'
     + (card.match(/[^.]*under a roof you put up\./) || ['NOT ON THE CARD'])[0].trim() + '")',
     /under a roof you put up/.test(card));

  ok('B6 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  /* ---- C. AND IN THE DEMO, WHICH IS THE OTHER HALF OF RULE 7 ------------- */
  const dpage = await ctx.newPage();
  const derrs = [];
  dpage.on('pageerror', e => derrs.push(String(e).slice(0, 160)));
  await dpage.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 240000 });
  await dpage.waitForTimeout(4000);
  await dpage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await dpage.waitForTimeout(3000);
  /* the cold-open invite is a banner a real player answers, and until it is answered
     it lies across the top of the city frame swallowing taps (learned the hard way in
     builder_where_he_walks_gate, which spent a run proving an innocent button broken). */
  await dpage.evaluate(() => {
    const n = document.getElementById('openNot'); if (n) n.click();
    const w = document.getElementById('openSkip'); if (w) w.click(); });
  await dpage.waitForTimeout(14000);
  const cf = dpage.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null;
  const dhouse = cf ? await cf.evaluate(() => {
    try {
      const before = BohemiaHousing.report(om, POWER, seed, EDITS, om.n);
      const d = (function () { for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++)
        if (om.at(x, y).district === 'desert') return [x, y]; return null; })();
      if (!d) return { err: 'no desert' };
      CE.build(EDITS, d[0], d[1], 'desert', 'suburb', OM.DISTRICT);
      CITY_FRAME++;
      const after = BohemiaHousing.report(om, POWER, seed, EDITS, om.n);
      return { before: before, after: after, cap: BohemiaHousing.capacityOf('suburb') };
    } catch (e) { return { err: String(e).slice(0, 90) }; }
  }) : null;
  ok('C1 the number moves in the cut demo too ('
     + (dhouse && dhouse.after ? dhouse.before.residents + ' -> ' + dhouse.after.residents
        + ' of a valley of ' + dhouse.after.valley : (dhouse && dhouse.err) || 'NO CITY FRAME') + ')',
     !!dhouse && !!dhouse.after && dhouse.after.residents > dhouse.before.residents);
  ok('C2 nothing threw in the demo' + (derrs.length ? ' -> ' + derrs[0] : ''),
     derrs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    standing plot        : "' + stood.line + '"');
  console.log('    before -> after      : ' + before.r.residents + ' -> ' + after.r.residents
    + ' residents of a valley of ' + after.r.valley);
  console.log('    capacity per home    : ' + POP.HOUSEHOLD_MEAN + ' (the module\'s own mean)');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  HOUSING: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  HOUSING: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
