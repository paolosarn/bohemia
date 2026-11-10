const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THERE IS ONE DOOR PREDICATE AND EVERY DOOR QUESTION ASKS IT
   (8/25/26, RUN lane. The 8/2 law, gated at last, in the place it was missed.)

   THE LAW IS NOT NEW. On 8/2 stepOnce was found asking a hand-rolled door test
   while the guard beside it asked another, and the note is still in the file:

       __A_DOOR_IS_A_DOOR__ -- the SAME predicate massHasDoor counted with. This
       read `c.artPool_face==='hdoor'||c.portal` while the guard also counted
       doorW/doorE, so every house whose door is a doorW/doorE was sealed by its
       own door.

   That repair went into the movement path. NOTHING CHECKED THE REST OF THE FILE,
   and homeFind -- the function that answers "where do you live" -- kept the
   narrow test for three weeks.

   WHAT THAT COST, measured on the demo's own spawn before the fix:

       buildings around the spawn                        26
       whose door only the SHARED predicate can find     23   (88%)
       with no door at all                                0
       the house the game labels HOME                    door: null

   So "wake up at your own front door" was broken for essentially every house in
   the suburb he starts in, and the one thing in the game that knows where he
   lives reported that his house has no way in.

   WHAT THIS GATE REFUSES TO LET HAPPEN AGAIN, in two halves:

   A. THE SOURCE HALF. Every hand-rolled `artPool_face==='hdoor'` test in the
      city is a COPY of isDoorCell that will drift from it, so they are counted
      and held to the two that are legitimate: isDoorCell's own body, and the
      RENDER pass that draws that specific art tile (which is asking "is this the
      north-door PICTURE", not "is this a door"). A third one appearing is the
      bug coming back, and it fails here rather than three weeks later in a
      measurement nobody thought to take.

   B. THE MEASURED HALF, on the real surface, because a source rule can be
      satisfied while the answer is still wrong: the house the demo calls HOME
      must have a door, and the gate reports how many buildings near the spawn
      would be invisible to the narrow test. That number is the size of the bug
      and it is printed whether or not anything fails.

   node gates/one_door_predicate_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY_FILE = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

/* COMMENTS ARE NOT CODE. Two of this file's notes QUOTE the old narrow test in
   order to explain why it was wrong, and counting those as violations would make
   the gate punish its own post-mortems -- the mention-vs-use mistake this repo
   has now made often enough to name. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

(async () => {
  const raw = fs.readFileSync(CITY_FILE, 'utf8');
  const code = stripComments(raw);

  /* ---- A. ONE PREDICATE ------------------------------------------------- */
  ok('the city has a single shared door predicate',
    /function isDoorCell\(c\)\{/.test(code));
  ok('and it counts ALL FOUR ways a door exists -- the north-door art, a walkable '
    + 'portal, and the two side doors',
    /artPool_face==='hdoor'\s*\|\|\s*\(c\.portal&&c\.enter\)\s*\|\|\s*c\.doorW\s*\|\|\s*c\.doorE/.test(code));

  const hits = (code.match(/artPool_face==='hdoor'/g) || []).length;
  /* two are legitimate: the predicate's own body, and the render pass that blits
     the hdoor ART. Everything else is a copy of a rule that already exists. */
  ok('NOBODY ROLLS THEIR OWN DOOR TEST: ' + hits + ' hand tests for the north-door '
    + 'tile, and exactly two are allowed (isDoorCell itself, and the render pass '
    + 'that draws that art). A third is the 8/2 bug growing back.',
    hits === 2);

  ok('and the function that answers WHERE HE LIVES asks the shared predicate '
    + 'rather than a copy of it', /if\(isDoorCell\(c\)\)door=\[x,y\]/.test(code));

  /* the 8/2 post-mortem must stay in the file: it is the reason this rule exists */
  ok('the 8/2 finding is still written down where the next reader will hit it',
    raw.indexOf('__A_DOOR_IS_A_DOOR__') >= 0);

  /* ---- B. AND THE ANSWER IS ACTUALLY RIGHT ------------------------------ */
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (city) {
      await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
      await SETTLE(page, 1200);
      await city.evaluate(() => {
        const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
        if (g) g.click();
      });
      await SETTLE(page, 1800);

      const m = await city.evaluate(() => {
        const R = 110, seen = new Set();
        let masses = 0, wideOnly = 0, none = 0;
        for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
          const x = hx + dx, y = hy + dy;
          let c = null; try { c = cellAt(x, y); } catch (e) { continue; }
          if (!c || !c.enter) continue;
          let f = null; try { f = inFootprint(x, y); } catch (e) { }
          if (!f) continue;
          const k = f.x + ',' + f.y + ',' + f.w + ',' + f.h;
          if (seen.has(k)) continue; seen.add(k);
          masses++;
          let narrow = false, wide = false;
          for (let yy = f.y; yy < f.y + f.h; yy++) for (let xx = f.x; xx < f.x + f.w; xx++) {
            let q = null; try { q = cellAt(xx, yy); } catch (e) { continue; }
            if (!q) continue;
            if (q.artPool_face === 'hdoor') narrow = true;
            if (q.doorW || q.doorE || (q.portal && q.enter)) wide = true;
          }
          if (!narrow && wide) wideOnly++;
          if (!narrow && !wide) none++;
        }
        let home = null;
        try { const h = homeFind(); if (h) home = { door: h.door, at: [h.x, h.y] }; } catch (e) { }
        return { masses, wideOnly, none, home };
      });

      ok('the scan found real buildings to ask about (' + m.masses + ')', m.masses >= 5);
      ok('*** THE HOUSE THE GAME CALLS HOME HAS A FRONT DOOR *** -- it reported '
        + 'door:null before this, on 88% of the buildings around the spawn ('
        + JSON.stringify(m.home && m.home.door) + ')',
        !!(m.home && m.home.door));
      console.log('  MEASURED near the demo spawn: ' + m.masses + ' buildings · '
        + m.wideOnly + ' whose door ONLY the shared predicate can find ('
        + Math.round(m.wideOnly / Math.max(1, m.masses) * 100) + '%) · '
        + m.none + ' with no door at all');
      ok('and nothing threw while asking (' + (errs.length ? errs[0] : 'none') + ')',
        errs.length === 0);
    }
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  console.log('\n=== ONE DOOR PREDICATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
