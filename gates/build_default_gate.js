/* ============================================================================
   THE FIRST BUILDING IS NOT AN AIRBASE (9/7/26, LIFE + CITY lane)
   VAMILY [build default] THE-FIRST-BUILDING-A-PLAYER-PLACES-IS-AN-AIRBASE.

   THE ROW, harvested from ECONOMY round 4 by PLAYING the game rather than grepping
   it: "Tap an empty plot in CITY: 59 district types in ALPHABETICAL ORDER, no
   default, no grouping, no placeholder, so the browser picks the first and BUILD
   places an airbase. This is the worst first-hour moment in the game."

   MEASURED BEFORE TOUCHING IT, on the cut demo: 59 options, ZERO groups, the select
   reads AIRBASE, first three labels AIRBASE / AIRPORT / APARTMENT. Every word true.

   AND THE DEFECT WAS IN FOUR PLACES, NOT ONE. Three other reads --  the price line,
   the affordability check and the build itself -- fell back to
   buildableTypes()[0] when the panel was not open, and [0] is alphabetical. The
   same wrong answer, in four separate copies.

   WHAT THE REPO ACTUALLY KNOWS ABOUT THESE 59 THINGS, AND IT IS ONE FACT:
   BohemiaPopulation.RESIDENTIAL names the six that are homes. Nothing else in the
   codebase says what any other district is FOR, and WHICH TYPES MAKE POWER OR CLOUT
   IS [PENDING Paolo] BY THIS LANE'S OWN STATE LINE -- so a POWER group here would be
   inventing content this row has no right to invent. The grouping is exactly as deep
   as the repo's knowledge: HOMES, and EVERYTHING ELSE. A2 is the leg that holds that
   line.

   AND A FINDING ON THE WAY: every home holds EXACTLY 2.2. An apartment houses what a
   trailer houses. That is HOUSEHOLD_MEAN applied flat, it is a [PENDING Paolo] this
   lane raised in round 4 of the other row, and it is why the group label carries the
   number ONCE instead of six identical numbers pretending to be a choice.
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

const POP = require('../engine/bohemia_population.js');
const CE = require('../engine/bohemia_cityedit.js');
const OM = require('../engine/bohemia_overmap.js');

console.log('='.repeat(74));
console.log('THE FIRST BUILDING IS NOT AN AIRBASE — the choice reads like a choice');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE DEFECT IS REAL AND STILL WOULD BE. The list itself is alphabetical and
   airbase is first; nothing here changed that, and nothing should -- the fix is the
   picker, not the enum, because the enum is canon. */
const types = CE.buildableTypes(OM.DISTRICT);
ok('A1 the canon list is still alphabetical and still starts at "' + types[0]
   + '" — the enum is canon and was not touched', types[0] === 'airbase');

/* A2. *** THE GROUPING IS ONLY AS DEEP AS THE REPO'S KNOWLEDGE. *** A POWER group
   would be content, and which types make power is [PENDING Paolo] in this lane's own
   state line. If a third group ever appears here without a ruling behind it, that is
   this lane inventing his content. */
const groupLabels = (CITY.match(/__add\(__[a-z]+, [^)]*\)/g) || []);
ok('A2 exactly two groups, HOMES off the population module\'s own RESIDENTIAL and '
   + 'EVERYTHING ELSE — no invented POWER group ('
   + groupLabels.length + ' groups added)',
   groupLabels.length === 2
   && /BohemiaPopulation\.RESIDENTIAL/.test(CITY)
   && !/optgroup[^]{0,200}POWER/i.test(CITY));

/* A3. ONE FUNCTION, NOT FOUR COPIES. The defect was four reads of the same wrong
   fallback; a fix that left three of them would be three quarters of a fix. */
ok('A3 nothing falls back to buildableTypes()[0] any more — one cbDefaultType()',
   CITY.indexOf('CE.buildableTypes(OM.DISTRICT)[0]') < 0
   && /function cbDefaultType\(\)/.test(CITY)
   && /function cbPickedType\(\)/.test(CITY));

(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(20000);
  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;

  const m = fr ? await fr.evaluate(() => {
    try {
      let spot = null;
      const tx = hx >> 7, ty = hy >> 7;
      for (let r = 0; r < 12 && !spot; r++)
        for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r; dx++) {
          const c = om.at(tx + dx, ty + dy);
          if (c && c.district === 'desert') { spot = [tx + dx, ty + dy]; break; }
        }
      if (!spot) return { none: true };
      CB.sel = spot; CBpanel();
      const sel = document.getElementById('cbtype');
      const groups = sel ? [...sel.querySelectorAll('optgroup')].map(g => g.label) : [];
      const firstThree = sel ? [...sel.options].slice(0, 3).map(o => o.textContent) : [];
      const P = BohemiaPopulation;
      return {
        plot: spot,
        selectSays: sel ? sel.value : null,
        selectIsAHome: !!(sel && P.RESIDENTIAL[sel.value]),
        options: sel ? sel.options.length : 0,
        groups: groups,
        firstThree: firstThree,
        /* and the three OTHER reads, with the panel shut */
        defaultWithNoPanel: (function () {
          const was = document.getElementById('cbtype');
          if (was) was.id = 'cbtype_hidden_for_the_probe';
          const d = cbPickedType();
          if (was) was.id = 'cbtype';
          return d;
        })(),
        mean: P.HOUSEHOLD_MEAN
      };
    } catch (e) { return { err: String(e).slice(0, 160) }; }
  }) : { err: 'NO CITY FRAME' };

  /* B1. *** THE THING THE ROW IS ABOUT. *** */
  ok('B1 *** TAP A PLOT AND THE GAME IS NOT ABOUT TO BUILD AN AIRBASE *** — it says "'
     + (m.selectSays || m.err) + '"',
     !m.err && m.selectSays !== 'airbase' && m.selectIsAHome === true);

  /* B1b. *** AND IT IS THE GROUND HE IS STANDING ON. *** Grouping alone already
     stops the airbase -- the first home alphabetically is APARTMENT, so B1 passes
     with no default set at all, which is exactly what the mutation run showed. That
     makes "suburb" a DECISION rather than a side effect, and a decision no leg states
     is a decision that drifts: the row said "put a sensible first building at the
     top", and the sensible one is the thing he can already see out of the door he
     woke up behind. */
  ok('B1b the default is SUBURB — the ground he wakes standing on, not just the first '
     + 'home in the alphabet (which is "' + (m.firstThree || [])[0] + '")',
     !m.err && m.selectSays === 'suburb');

  /* B2. AND EVERY OPTION IS STILL THERE. Fixing a default by deleting choices would
     be a different and worse bug. */
  ok('B2 all ' + (m.options || '?') + ' buildings are still offered, now in '
     + ((m.groups || []).length) + ' groups: ' + JSON.stringify(m.groups),
     !m.err && m.options === types.length && (m.groups || []).length === 2);

  /* B3. THE CHOICE READS LIKE A CHOICE: the homes come first and the group says what
     it is for, using the module's own number. */
  ok('B3 the homes are at the top and the group says what they are for ('
     + JSON.stringify(m.firstThree) + ', label "' + (m.groups || [])[0] + '")',
     !m.err && (m.firstThree || []).every(t => POP.RESIDENTIAL[String(t).toLowerCase()])
     && String((m.groups || [])[0]).indexOf(String(m.mean)) > 0);

  /* B4. *** AND THE FALLBACK IS NOT AN AIRBASE EITHER. *** This is the three quarters
     of the defect that were not in the row: with the panel shut, the price line, the
     affordability check and the build all used to answer "airbase". */
  ok('B4 with the panel shut, the price, the affordability check and the build all '
     + 'default to "' + (m.defaultWithNoPanel || '?') + '", not airbase',
     !m.err && m.defaultWithNoPanel !== 'airbase'
     && !!POP.RESIDENTIAL[String(m.defaultWithNoPanel)]);

  ok('B5 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED IN THE CUT DEMO:');
  console.log('    the select says      : ' + m.selectSays + '  (was "airbase")');
  console.log('    groups               : ' + JSON.stringify(m.groups) + '  (were none)');
  console.log('    first three          : ' + JSON.stringify(m.firstThree)
    + '  (were AIRBASE / AIRPORT / APARTMENT)');
  console.log('    with the panel shut  : ' + m.defaultWithNoPanel + '  (was "airbase" in 3 places)');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THE FIRST BUILDING IS NOT AN AIRBASE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THE FIRST BUILDING IS NOT AN AIRBASE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
