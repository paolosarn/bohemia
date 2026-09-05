/* ============================================================================
   CENTURY RECORD GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [century memory] / CENTURY-RECORD: "persist per-act build totals so
   act 3's city can differ; mechanism ours, every number his."

   THE LAW IS LOCKED AND ITS LAST SENTENCE IS THE BRIEF. The 7/26 three-currencies
   addendum, clause 4: "dynasty building choices COMPOUND across the three acts...
   The city is the game's long memory. MECHANISM TO BE DESIGNED; NUMBERS ARE
   PAOLO'S WHEN THE MECHANISM IS RULED." So A7 is as important as any leg that
   checks arithmetic: TIERS ships EMPTY and tierOf() answers NO_RULING by name. A
   sensible default for "what a rebuilt city looks like" would be canon nobody
   wrote, and this gate goes red the day one appears.

   THE LEG THAT IS THE WHOLE POINT IS A2. The delta (bohemia_cityedit.js) is the
   city AS IT STANDS, and it cannot answer the century question: a generation that
   built forty homes and one that built none look identical the moment a later
   generation knocks them down. "The dynasty that built and lost it" is exactly the
   story the century rule exists to tell, so act 1's record must survive act 2
   demolishing act 1's work. A2 stays red if this ever becomes a view over the
   delta instead of a ledger of what happened.

   AND B2 IS THE ORDER-OF-OPERATIONS LEG. A demolition has to be recorded with the
   type that CAME DOWN, which means reading it BEFORE the verb runs -- after it the
   plot is desert, and a record written a line too late remembers every demolition
   in the game's history as "desert".
   WORTH KNOWING HOW THAT LEG WAS PROVEN, because the first mutation I tried did NOT
   turn it red: simply moving the read to after CE.demolish still answered "suburb",
   since the edit-seam frame cache had not been bumped yet. The two orders were
   equivalent ONLY BY ACCIDENT OF A CACHE. The mutation that reflects the real bug --
   record after CBafterEdit(), which bumps the cache -- goes red immediately with
   "recorded desert". Accidental correctness is the kind that rots, so the leg is
   written against the fact (the record names what was standing, and never 'desert')
   rather than against the line ordering that currently produces it.
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

const H = require('../engine/bohemia_housing.js');
const C = require('../engine/bohemia_century.js');
const POP = require('../engine/bohemia_population.js');

console.log('='.repeat(74));
console.log('CENTURY RECORD — what each generation did, and it survives the next one');
console.log('='.repeat(74));

H.installCap();

/* ---- A. THE MEMORY, HEADLESS -------------------------------------------- */

const rec = C.make();
C.note(rec, 'build', { type: 'suburb', x: 1, y: 1 }, 3);
C.note(rec, 'build', { type: 'apartment', x: 4, y: 4, w: 2, h: 2 }, 5);
C.note(rec, 'build', { type: 'solar', x: 8, y: 8 }, 6);
const a1 = C.totals(rec, 1);
ok('A1 the ledger records the deed and the totals are a fold of it ('
   + JSON.stringify({ built: a1.built, housing: a1.housing, byType: a1.byType }) + ')',
   a1.built === 3 && a1.demolished === 0 && a1.net === 3
   && Math.abs(a1.housing - 2 * POP.HOUSEHOLD_MEAN) < 1e-9
   && a1.byType.suburb === 1 && a1.byType.solar === 1);

/* A2. THE WHOLE POINT. Act 2 tears down act 1's work; act 1's record does not move. */
C.setAct(rec, 2);
C.note(rec, 'demolish', { type: 'suburb', x: 1, y: 1 }, 40);
const a1b = C.totals(rec, 1), a2 = C.totals(rec, 2);
ok('A2 ACT 2 KNOCKING DOWN ACT 1\'S WORK DOES NOT ERASE ACT 1 (act1 built '
   + a1b.built + ' still, act2 demolished ' + a2.demolished + ') — the delta is the '
   + 'city, this is what the family DID',
   a1b.built === 3 && a1b.demolished === 0 && a2.built === 0 && a2.demolished === 1);

/* A3. ONE MEANING PER FIELD. byType counts BUILDS, never "what is standing" -- two
   different questions that the first cut had sharing one name. */
const same = C.make();
C.note(same, 'build', { type: 'trailer', x: 2, y: 2 }, 1);
C.note(same, 'demolish', { type: 'trailer', x: 2, y: 2 }, 2);
const st = C.totals(same, 1);
ok('A3 build-then-demolish in one act still records that the generation BUILT one ('
   + JSON.stringify({ built: st.built, demolished: st.demolished, byType: st.byType }) + ')',
   st.built === 1 && st.demolished === 1 && st.byType.trailer === 1 && st.net === 0);

/* A4. A GENERATION THAT TORE DOWN HOUSING REALLY DID REDUCE IT. Clamping that to
   zero would hide the exact story the century rule is for. */
ok('A4 a generation that only demolished reports NEGATIVE housing, not zero (act2 '
   + 'housing ' + a2.housing + ')', a2.housing < 0);

/* A5. THE LAW SAYS CHOICES COMPOUND, so there is a number that compounds. */
const th = C.through(rec, 2);
ok('A5 through() compounds across the acts lived (' + JSON.stringify({ built: th.built,
     demolished: th.demolished, net: th.net }) + ')',
   th.built === 3 && th.demolished === 1 && th.net === 2);

/* A6. A CENTURY THAT CAN RUN IN REVERSE IS NOT A MEMORY. */
const back = C.setAct(rec, 1);
ok('A6 the act cannot be wound backwards (asked for 1 while in 2, got ' + back + ')',
   back === 2);

/* A7. THE VALVE IS HIS AND IT IS SHUT. What a poor city and a rebuilt city ARE is
   the ruling the law itself defers, and a sensible default here would be canon
   nobody wrote. THIS LEG GOES RED THE DAY ONE APPEARS. */
const tier = C.tierOf(rec, 2);
ok('A7 what a poor city and a rebuilt city ARE is unruled, and it says so by name ('
   + tier.reason + ', table ' + tier.table + ') — and it still hands over the totals',
   Object.keys(C.TIERS).length === 0 && tier.reason === 'NO_RULING'
   && tier.table === 'TIERS' && !!tier.totals && tier.totals.built === 3);

/* A8. THE ONE THING THAT MUST SURVIVE EVERY MIGRATION IT WILL EVER MEET. */
const round = C.load(C.save(rec));
ok('A8 a saved memory round-trips exactly',
   JSON.stringify(C.acts(round)) === JSON.stringify(C.acts(rec)));
const junk = C.load({ V: 99, act: 47, entries: [null, { kind: 'nonsense' }, 'x',
                      { type: 'suburb', kind: 'build', act: 9 }] });
ok('A8b a broken or future blob loads as a memory rather than a crash ('
   + junk.entries.length + ' entry kept, act clamped to ' + junk.entries[0].act + ')',
   junk.entries.length === 1 && junk.entries[0].act === C.ACT_MAX && junk.act === C.ACT_MAX);

/* A9. THE PAST IS NOT REWRITTEN. The household is stamped when it happens, so the
   day he rules that an apartment holds more than a trailer, what the family built
   under the old rules stays what it built. */
const before9 = C.totals(rec, 1).housing;
H.CAP.apartment = { people: 99, ruling: 'A TEST RULING', tuned: false };
const after9 = C.totals(rec, 1).housing;
H.CAP.apartment = { people: POP.HOUSEHOLD_MEAN, ruling: 'restored', tuned: false };
ok('A9 changing what a building holds does NOT rewrite what the family already built ('
   + before9.toFixed(1) + ' -> ' + after9.toFixed(1) + ')', before9 === after9);

/* ---- B. THE REAL SURFACE ------------------------------------------------ */
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
    if (b) { await page.touchscreen.tap(b.x, b.y); await page.waitForTimeout(1100); }
    return !!b;
  };

  await tapText('^GET UP$');
  await tapId('buildbtn');

  const was = await page.evaluate(() => ({
    district: om.at(CB.sel[0], CB.sel[1]).district,
    t: BohemiaCentury.totals(centuryGet(), centuryGet().act) }));
  await tapId('cbdem');
  const afterDem = await page.evaluate(() => ({
    t: BohemiaCentury.totals(centuryGet(), centuryGet().act),
    last: centuryGet().entries[centuryGet().entries.length - 1] || null }));

  ok('B1 DEMOLISHING BY THUMB IS REMEMBERED (' + was.t.demolished + ' -> '
     + afterDem.t.demolished + ')', afterDem.t.demolished === was.t.demolished + 1);

  /* B2. THE ORDER-OF-OPERATIONS LEG. What came down is what is written down. */
  ok('B2 the record names WHAT CAME DOWN, not the desert it left behind (was "'
     + was.district + '", recorded "' + (afterDem.last && afterDem.last.type) + '")',
     !!afterDem.last && afterDem.last.type === was.district
     && afterDem.last.type !== 'desert');

  await page.evaluate(() => {
    BohemiaPurse.credit(purseGet(), 'electricity', 2, 'gate fixture', null, DAY.day);
    const s = document.getElementById('cbtype');
    if (s) { for (let i = 0; i < s.options.length; i++)
      if (s.options[i].value === 'suburb') { s.selectedIndex = i; break; }
      if (s.onchange) s.onchange(); } });
  await tapId('cbbuild');
  const afterBuild = await page.evaluate(() => ({
    t: BohemiaCentury.totals(centuryGet(), centuryGet().act),
    n: window.__CENTURY || 0 }));
  ok('B3 BUILDING BY THUMB IS REMEMBERED TOO (built ' + afterDem.t.built + ' -> '
     + afterBuild.t.built + ', ' + afterBuild.n + ' deeds written)',
     afterBuild.t.built === afterDem.t.built + 1 && afterBuild.n >= 2);

  /* B4. THROUGH THE REAL SAVE PATH, both ends of it. citySnapshot() builds the blob
     the shell stores and applyRestore() is what consumes it; the shell only moves
     the bytes between them, so driving both ends IS the save path. */
  const survived = await page.evaluate(() => {
    const blob = JSON.parse(JSON.stringify(citySnapshot()));
    CENTURY = null;                       /* forget everything, as a fresh boot does */
    const empty = BohemiaCentury.totals(centuryGet(), 1).built;
    applyRestore(blob);
    return { hadCentury: !!blob.century, empty: empty,
             back: BohemiaCentury.totals(centuryGet(), 1) };
  });
  ok('B4 THE MEMORY SURVIVES THE REAL SAVE AND RESTORE (forgotten: ' + survived.empty
     + ' built, restored: ' + survived.back.built + ' built, ' + survived.back.demolished
     + ' down)',
     survived.hadCentury === true && survived.empty === 0
     && survived.back.built >= 1 && survived.back.demolished >= 1);

  /* B5. AND HE MEETS IT WHERE HE ALREADY READS. */
  await tapText('^🛏 SLEEP$|^SLEEP$');
  const card = await page.evaluate(() => {
    const el = document.getElementById('daycardIn');
    return el ? (el.textContent || '') : ''; });
  ok('B5 the reckoning names the generation\'s tally ("'
     + (card.match(/this generation:[^<]*?(up|down)[^<]*/) || ['NOT ON THE CARD'])[0].trim()
     + '")', /this generation: /.test(card));

  ok('B6 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  /* ---- C. AND IN THE DEMO (rule 7) --------------------------------------- */
  const dpage = await ctx.newPage();
  const derrs = [];
  dpage.on('pageerror', e => derrs.push(String(e).slice(0, 160)));
  await dpage.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 240000 });
  await dpage.waitForTimeout(4000);
  await dpage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await dpage.waitForTimeout(3000);
  /* the cold-open invite lies across the top of the city frame until answered */
  await dpage.evaluate(() => {
    const n = document.getElementById('openNot'); if (n) n.click();
    const w = document.getElementById('openSkip'); if (w) w.click(); });
  await dpage.waitForTimeout(14000);
  const cf = dpage.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null;
  const dem = cf ? await cf.evaluate(() => {
    try {
      const b0 = BohemiaCentury.totals(centuryGet(), centuryGet().act).built;
      const d = (function () { for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++)
        if (om.at(x, y).district === 'desert') return [x, y]; return null; })();
      if (!d) return { err: 'no desert' };
      CE.build(EDITS, d[0], d[1], 'desert', 'suburb', OM.DISTRICT);
      centuryNote('build', 'suburb', d[0], d[1], 1, 1);
      const b1 = BohemiaCentury.totals(centuryGet(), centuryGet().act).built;
      const blob = JSON.parse(JSON.stringify(citySnapshot()));
      return { b0: b0, b1: b1, saved: !!(blob.century && blob.century.entries.length) };
    } catch (e) { return { err: String(e).slice(0, 90) }; }
  }) : null;
  ok('C1 the memory is live in the cut demo and lands in its save ('
     + (dem && dem.b1 != null ? dem.b0 + ' -> ' + dem.b1 + ' built, in the save: '
        + dem.saved : (dem && dem.err) || 'NO CITY FRAME') + ')',
     !!dem && dem.b1 === dem.b0 + 1 && dem.saved === true);
  ok('C2 nothing threw in the demo' + (derrs.length ? ' -> ' + derrs[0] : ''),
     derrs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    demolished "' + was.district + '" and the record says "'
    + (afterDem.last && afterDem.last.type) + '"');
  console.log('    after a save/forget/restore : ' + survived.back.built + ' up, '
    + survived.back.demolished + ' down');
  console.log('    what a rebuilt city IS      : ' + tier.reason + ' (his ruling, TIERS empty)');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  CENTURY RECORD: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  CENTURY RECORD: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
