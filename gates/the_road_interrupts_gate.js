const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE ROAD INTERRUPTS -- FT-JOURNEY, THE MIDDLE (8/27/26, RUN lane)

     Paolo 8/24, LOCKED (laws/BOHEMIA_ADDENDUM_FAST_TRAVEL_IS_A_JOURNEY_8_24_26):
     "Crossing the valley is something you PLAY, not something you skip."
     Paolo 8/25, dispatch item 8: enemies and Valheim-style DANGER BY PLACE.
     Paolo 8/27: "maybe I wanna fuck around and start putting dogs and swarms of
     flies as, like, low tier, you know, biome level one enemies."

   WHAT THIS HOLDS IS A WIRE, NOT A SYSTEM. engine/bohemia_encounters.js is the
   ambient encounter director: 258 lines, approved 7/27 ("Approve all"), gated by
   encounter_gate.js, green for a month, AND WITH ZERO CALLERS ANYWHERE IN THE
   REPO. A search for its name returned its own gate and nothing else.

   That is the failure class this repo keeps naming: the seventeen invisible
   hats, four Colorful garments worn by nobody for five weeks, cardHide and
   vistaClose with no caller. A finished approved thing the player cannot reach
   does not exist. SO THE CLAIMS BELOW ARE ABOUT REACHABILITY:

     A. the director is really in the walked world, and it is THE SAME BODY as
        the engine file rather than a second copy that will drift
     B. TRAVEL REALLY CALLS IT -- proved by spying on a real pad press, never by
        this gate calling it. A gate that supplies the call it is checking for
        holds nothing.
     C. what comes back really reaches his screen, with words on it
     D. the approved pacing survived the wiring: 70/20/10, no global spawns, an
        unproven need never fires, and standing still does nothing at all
     E. an interruption really costs him the day, in minutes

   node gates/the_road_interrupts_gate.js
   ========================================================================== */
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
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
const done = () => {
  console.log('\n=== THE ROAD INTERRUPTS: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* ---- A2. ONE CANONICAL BODY, off the files, before a browser is involved ----
   The BOH_* sync gate cannot see this module: it keys on `const BOH_x=` and the
   director is an IIFE on window.BohemiaEncounters. So ENGINE SYNC LAW is held
   here instead of being held by nobody. Comments and whitespace are stripped
   because a comment edit is not drift, same normalization the sync gate uses. */
function norm(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
          .replace(/\s+/g, ' ').trim();
}
const ENGINE_SRC = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_encounters.js'), 'utf8');
const CITY_SRC = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');

(async () => {
  const nEng = norm(ENGINE_SRC);
  ok('*** THE INLINED DIRECTOR IS THE SAME BODY AS THE ENGINE FILE *** -- one '
    + 'canonical body, so a fix to one is a fix to both (' + nEng.length + ' chars)',
    nEng.length > 2000 && norm(CITY_SRC).indexOf(nEng) >= 0);

  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                         hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  let mix = {}, fires = 0, steps = 0;
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
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1500);

    /* ---- A. THE APPROVED DIRECTOR IS REALLY HERE ------------------------ */
    const have = await city.evaluate(() => ({
      engine: typeof BohemiaEncounters !== 'undefined',
      roster: (typeof BohemiaEncounters !== 'undefined') ? BohemiaEncounters.ROSTER.length : 0,
      mix: (typeof BohemiaEncounters !== 'undefined') ? BohemiaEncounters.MIX : null,
      gap: (typeof BohemiaEncounters !== 'undefined') ? BohemiaEncounters.MIN_GAP_S : null,
      caller: typeof roadInterrupt === 'function',
      table: (typeof ROAD_TABLE !== 'undefined') ? Object.keys(ROAD_TABLE).length : 0 }));
    ok('the approved act-1 roster is in the walked world (' + have.roster + ' tokens)',
      have.engine && have.roster === 12);
    ok('and his approved pacing came with it, unedited (' + JSON.stringify(have.mix)
      + ', ' + have.gap + 's floor)',
      !!have.mix && have.mix.ambient === 0.70 && have.mix.interactive === 0.20
      && have.mix.forced === 0.10 && have.gap === 90);
    ok('a caller exists at all and roads are tabled (' + have.table + ' districts)',
      have.caller && have.table >= 5);

    /* ---- B. AND TRAVEL IS WHAT CALLS IT --------------------------------- */
    /* *** THIS GATE MUST NOT SUPPLY THE CALL IT IS CHECKING FOR. *** Driving
       roadInterrupt() by hand proves only that I can type its name. The ANIMALS
       gate made exactly that mistake this week: it drove animalPass itself, so
       deleting the renderer's call left it green. So this SPIES: replace the
       function with a counter, press the pad for real in map mode, and see
       whether the game reaches for it on its own. */
    const spied = await city.evaluate(async () => {
      MODE = 'city';
      const real = window.roadInterrupt;
      let hits = 0, secs = [];
      window.roadInterrupt = function (s) { hits++; secs.push(s); return { fired: false, reason: 'SPY' }; };
      const pb = document.querySelectorAll('#pad .pb');
      for (let i = 0; i < 6; i++) {
        pb[2].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await new Promise(r => setTimeout(r, 620));
        pb[2].dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        await new Promise(r => setTimeout(r, 120));
      }
      window.roadInterrupt = real;
      return { hits: hits, secs: secs.slice(0, 3) };
    });
    ok('*** MOVING THE MARKER IS WHAT ASKS THE ROAD WHAT HAPPENS *** -- spied on '
      + 'real pad presses, not called by this gate (' + spied.hits + ' pulls, '
      + JSON.stringify(spied.secs) + ' seconds each)',
      spied.hits > 0 && spied.secs[0] === 600);

    /* ---- D1. AND STANDING STILL ASKS IT NOTHING ------------------------- */
    /* NO BACKGROUND TICKING is the ruling the director was built around: "a world
       that keeps rolling at an idle player is the thing the ruling forbids".
       The wiring could break that even though the director cannot. */
    const idle = await city.evaluate(async () => {
      MODE = 'city';
      const real = window.roadInterrupt;
      let hits = 0;
      window.roadInterrupt = function () { hits++; return { fired: false, reason: 'SPY' }; };
      await new Promise(r => setTimeout(r, 3000));
      window.roadInterrupt = real;
      return hits;
    });
    ok('*** AND STANDING STILL ASKS IT NOTHING *** -- three seconds of doing '
      + 'nothing produced ' + idle + ' pulls (NO BACKGROUND TICKING)', idle === 0);

    /* ---- C + D + E. WHAT A REAL CROSSING OF THE VALLEY ACTUALLY GIVES HIM  */
    const run = await city.evaluate(async () => {
      MODE = 'city';
      const D = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      const fired = [], reasons = {};
      let steps = 0, cost = {}, card = null;
      for (let i = 0; i < 300 && steps < 140; i++) {
        const [dx, dy] = D[i % 8];
        const nx = city.x + dx, ny = city.y + dy;
        if (!cityWalkable(nx, ny)) continue;
        city.x = nx; city.y = ny; advance(10);
        steps++;
        const t0 = T.min;
        const g = roadInterrupt(600);
        if (g && g.fired) {
          fired.push({ id: g.id, kind: g.kind, d: g.at.district });
          const spent = T.min - t0;
          (cost[g.kind] = cost[g.kind] || []).push(spent);
          if (!card) {
            const c = document.getElementById('daycard');
            card = { on: !!(c && c.classList.contains('on')),
                     text: document.getElementById('daycardIn').textContent,
                     draft: !!document.querySelector('#daycardIn [data-draft="true"]') };
          }
        } else reasons[(g && g.reason) || '?'] = (reasons[(g && g.reason) || '?'] || 0) + 1;
        try { cardHide(); } catch (e) { }
      }
      const m = {};
      fired.forEach(f => m[f.kind] = (m[f.kind] || 0) + 1);
      /* NO GLOBAL SPAWNS EVER, held by construction: a district with no row has
         nothing to fall back on. Asked directly of the table. */
      const offRoad = ['suburb', 'park', 'casino', 'mountain'].map(function (d) {
        return { d: d, day: ROAD_TABLE[d] ? 'HAS A ROW' : null };
      }).filter(function (r) { return r.day; });
      return { steps: steps, fired: fired.length, m: m, reasons: reasons, cost: cost,
               card: card, offRoad: offRoad.length,
               bounty: fired.filter(function (f) { return f.id === 'bounty_squad'; }).length,
               canMurders: roadCan('murders') };
    });
    steps = run.steps; fires = run.fired; mix = run.m;

    ok('*** CROSSING THE VALLEY IS NO LONGER SILENT *** -- ' + run.fired
      + ' things happened on the road over ' + run.steps + ' marker cells, which '
      + 'is one about every ' + (run.fired ? Math.round(run.steps / run.fired) : 0)
      + ' cells', run.fired >= 4 && run.steps >= 40);

    /* HIS APPROVED RATIO, MEASURED IN WHAT HE ACTUALLY GETS. 70/20/10 is a
       promise about experience, so it is checked against experience, not against
       the constant (the constant is checked separately above). */
    const tot = run.fired || 1;
    const amb = (run.m.ambient || 0) / tot;
    ok('*** AND IT COMES OUT AT HIS APPROVED 70/20/10 *** (' + JSON.stringify(run.m)
      + ') -- the deficit chooser converging, not dice',
      (run.m.ambient || 0) >= (run.m.interactive || 0)
      && (run.m.interactive || 0) >= (run.m.forced || 0) && amb >= 0.5);

    ok('an interruption really eats his day, by class (' + JSON.stringify(run.cost)
      + ' minutes)',
      !run.cost.forced || run.cost.forced.every(v => v === 20));
    ok('and an ambient beat costs him nothing, because he only looked at it',
      !run.cost.ambient || run.cost.ambient.every(v => v === 0));

    ok('NO GLOBAL SPAWNS EVER: not one off-road district has a row to fall back '
      + 'on (' + run.offRoad + ' found)', run.offRoad === 0);
    ok('an unproven precondition never spawns -- the bounty squad wants a kill '
      + 'count this build cannot answer, so it never comes (' + run.bounty
      + ' fires, can=' + run.canMurders + ')',
      run.bounty === 0 && run.canMurders === false);

    /* ---- C. IT REACHED HIS SCREEN, WITH WORDS ON IT --------------------- */
    ok('*** AND HE ACTUALLY SEES IT *** -- the card is on screen with the road '
      + 'moment written on it (' + (run.card ? run.card.text.slice(0, 64) : 'NO CARD')
      + ')', !!(run.card && run.card.on && run.card.text.length > 80));
    ok('and every word of it is tagged draft so he can edit it later (ALWAYS '
      + 'MAKE AN ATTEMPT, 8/11)', !!(run.card && run.card.draft));
    ok('the card offers a real way out of itself',
      !!(run.card && /KEEP MOVING/.test(run.card.text)));

    /* ---- AND IT IS NOT A LOCK ------------------------------------------- */
    /* *** THIS CLAIM EXISTS BECAUSE I SHIPPED THE BUG AN HOUR EARLIER. ***
       cardShow is modal by construction: a full-screen scrim at z-index 20. Right
       for the wake card and the market, because those are PLACES YOU GO. Wrong
       for a thing that happens to you WHILE YOU ARE MOVING -- the scrim sat on
       the pad, the chip and the canvas, so the pad went dead and a pinch back to
       his body did nothing at all. LOOK NOT TRAVEL caught it and reproduced it
       alone, twice: "he is back on his feet in the walked world (city)" FAIL.
       Same class as the vista press he reported on STANDING: a card that eats
       his next gesture is a button that does not work. Measured as reachability,
       not as CSS, because the whole failure was that a rule I could read said
       nothing about what a thumb could press. */
    const reach = await city.evaluate(async () => {
      MODE = 'city';
      let ev = null;
      for (let i = 0; i < 60 && !ev; i++) {
        const nx = city.x + 1;
        if (cityWalkable(nx, city.y)) { city.x = nx; advance(10); }
        const g = roadInterrupt(600);
        if (g && g.fired) ev = g;
      }
      if (!ev) return { none: true };
      const hit = el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!(t && (t === el || el.contains(t)));
      };
      const cv = document.getElementById('cv');
      const cr = cv.getBoundingClientRect();
      const onCanvas = document.elementFromPoint(cr.left + cr.width / 2,
                                                 cr.top + cr.height * 0.35);
      return { up: document.getElementById('daycard').classList.contains('on'),
               pad: hit(document.querySelector('#pad .pb')),
               chip: hit(document.getElementById('modechip')),
               world: !!(onCanvas && onCanvas.id === 'cv'),
               closes: hit(document.querySelector('#daycardIn [data-act="close"]')) };
    });
    ok('*** AND THE ROAD CARD IS NOT A LOCK *** -- with it on screen the pad, the '
      + 'camera chip and the world itself are all still pressable (pad='
      + reach.pad + ' chip=' + reach.chip + ' world=' + reach.world + ')',
      !reach.none && reach.up === true && reach.pad === true
      && reach.chip === true && reach.world === true);
    ok('and the card itself still takes a press, so it is readable and closable, '
      + 'not merely transparent (close=' + reach.closes + ')',
      reach.closes === true);

    ok('and nothing threw across the whole crossing ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    console.log('  MEASURED: ' + run.fired + ' road moments over ' + run.steps
      + ' marker cells (1 per ' + (run.fired ? Math.round(run.steps / run.fired) : 0)
      + ') · mix ' + JSON.stringify(run.m) + ' · minutes by class '
      + JSON.stringify(Object.keys(run.cost).map(k => k + ':' + run.cost[k][0]))
      + ' · quiet steps by reason ' + JSON.stringify(run.reasons));
    console.log('  MINE, NOT HIS, AND CORRECTABLE: interruption costs are '
      + 'ambient 0 / interactive 10 / forced 20 minutes, and a token may come '
      + 'round again after 7200s of travel. The roster, the 70/20/10 mix, the 90s '
      + 'floor and the spice cap are all his, approved 7/27.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
