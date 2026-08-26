const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE VALLEY HAS ANIMALS IN IT (8/26/26, RUN lane)
   His words: "maybe I wanna fuck around and start putting dogs and swarms of
   flies as low tier biome level one enemies", and from the 8/25 dispatch,
   "the city is dead and DEAD IS NOT THE DEFAULT (a slider is not an answer)".

   THE RESEARCH DELIVERED THE SAME DAY HE ASKED ALREADY ANSWERED IT, and nobody
   built it (records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md):

     the reason the city feels dead is not that we lack enemies. It is that we
     lack ANIMALS ... Tier 1 is mostly not an enemy system at all. It is set
     dressing that moves, and it is the cheapest fix on this list for the loudest
     complaint on his list.

   WHAT THIS HOLDS
     A. there is life on the ground, and the RENDERER says so, not a table
     B. it is the SAME life every time -- a valley that reshuffles is noise
     C. it MOVES, on the game's own clock
     D. all three shipped kinds really occur somewhere in the valley
     E. density is BY PLACE (the Valheim half of his ruling)
     F. it is NOT an enemy system -- no damage, no health (NO DAMAGE BEFORE THE DIAL)
     G. it costs nothing at city zoom and is capped (his item 7 is PERFORMANCE)
     H. and THE DOG SLOT IS EMPTY AND DECLARED, because a dog is a body and a
        body is character art

   node gates/the_valley_has_animals_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
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
  console.log('\n=== THE VALLEY HAS ANIMALS: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* ---- SOURCE ------------------------------------------------------------- */
const src = fs.readFileSync(CITY, 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
ok('the animal layer exists and the renderer calls it',
  /function animalPass\s*\(/.test(code) && /animalPass\(ox,\s*oy,\s*C\)/.test(code));
/* F. NOT AN ENEMY SYSTEM. He said "enemies"; the ecology answer is that Tier 1
   barely fights, and NO DAMAGE BEFORE THE DIAL is absolute. If this pass ever
   learns to hurt him, that is a ruling he has not given. */
const passBody = (/function animalPass[\s\S]*?\n\}/.exec(code) || [''])[0];
ok('*** IT CANNOT HURT HIM *** -- no damage, no health, no fight anywhere in the '
  + 'pass (NO DAMAGE BEFORE THE DIAL)',
  !/\b(damage|hurt|hp|health|attack|startEncounter|cityFight)\b/i.test(passBody));
/* H. CONTENTS-PAOLO'S. The dog is the one he named first and it is the one thing
   here that needs a real body. The slot exists at zero rather than being quietly
   dropped, so nobody has to remember it. */
ok('*** THE DOG SLOT IS BUILT AND EMPTY *** -- he named it first, a dog is a BODY '
  + 'and a body is character art, so it waits for the art rather than this lane '
  + 'inventing creature pixels',
  /dogs:\s*0/.test(code) && (code.match(/dogs:\s*0/g) || []).length >= 4);
/* E. DENSITY BY PLACE. A table keyed on district with every row identical would
   pass a "there is a table" check and mean nothing. */
const tab = (/var ANIMAL_DENSITY = \{[\s\S]*?\n\};/.exec(src) || [''])[0];
const rows = [...tab.matchAll(/flies:\s*([\d.]+),\s*rats:\s*([\d.]+),\s*ravens:\s*([\d.]+)/g)]
  .map(m => m[1] + '/' + m[2] + '/' + m[3]);
ok('*** DENSITY IS BY PLACE AND THE PLACES REALLY DIFFER *** (' + rows.length
  + ' districts, ' + new Set(rows).size + ' distinct) -- difficulty and life live '
  + 'in THE GROUND, which is the Valheim half of his ruling',
  rows.length >= 5 && new Set(rows).size >= 4);
ok('and the numbers say out loud that they are dials he has not ruled',
  /ANIMAL_DENSITY[\s\S]{0,400}?draft:true/.test(src) || /\[DIAL, draft:true\][\s\S]{0,600}?ANIMAL_DENSITY/.test(src)
  || /ANIMAL_DENSITY/.test(src) && /\[DIAL, draft:true\]/.test(src));

(async () => {
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
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1300);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    const m = await city.evaluate(async () => {
      try { render(); } catch (e) { }
      await new Promise(r => setTimeout(r, 120));
      const onScreen = window.__ANIMALS_DRAWN || 0;

      /* C. DO THE MARKS MOVE? Spy on the fillRects the pass itself makes, twice.
         COUNTING DARK PIXELS OVER THE WHOLE CANVAS WAS THE FIRST ATTEMPT and came
         back byte-identical: a whole-screen ink count is dominated by the world and
         cannot see eighteen specks shifting two pixels. */
      const g = cv.getContext('2d');
      const orig = g.fillRect;
      let rec = null;
      g.fillRect = function (x, y, w, h) {
        if (rec && w <= 8 && h <= 8) rec.push(Math.round(x) + ',' + Math.round(y));
        return orig.apply(this, arguments); };
      /* *** SPY ON A REAL render(), NOT ON animalPass DIRECTLY. *** The first cut
         called animalPass itself, so when a mutation removed the renderer's call --
         the game showing no animals at all -- this claim and the kind sweep both
         stayed GREEN, because they were driving the function by hand. A gate that
         supplies the call it is meant to be checking for cannot fail. Marks are
         filtered to the small ones only, so the world's own fillRects (panels,
         bars, ground) do not drown eighteen specks. */
      const shot = () => { rec = []; try { render(); } catch (e) { } const o = rec.join('|'); rec = null; return o; };
      const s1 = shot();
      await new Promise(r => setTimeout(r, 300));
      const s2 = shot();
      g.fillRect = orig;

      /* D. ASK THE RENDERER WHICH KINDS REALLY OCCUR, over a walk of the valley.
         AN EARLIER PROBE KEPT ITS OWN COPY of "a rat needs a wall beside it",
         reported 4 of 305, and did not move when the game's rule was fixed --
         it was measuring the probe. Never re-implement the rule you are checking. */
      const seen = { flies: 0, rats: 0, ravens: 0 };
      const home = [hx, hy];
      for (let s = 0; s < 40; s++) {
        hx = home[0] + ((s % 8) - 4) * 9;
        hy = home[1] + (((s / 8) | 0) - 2) * 9;
        try { render(); } catch (e) { }
        const k = window.__ANIMALS_BY_KIND || {};
        seen.flies += k.flies || 0; seen.rats += k.rats || 0; seen.ravens += k.ravens || 0;
      }
      hx = home[0]; hy = home[1]; try { render(); } catch (e) { }

      /* B. THE SAME VALLEY EVERY TIME */
      let stable = true;
      for (let i = 0; i < 200; i++) {
        const x = home[0] + i, y = home[1] + (i % 7);
        if (animalKindAt(x, y) !== animalKindAt(x, y)) { stable = false; break; }
      }
      /* G. AND IT COSTS NOTHING WHERE IT WOULD BE A LIE */
      const wasMode = MODE;
      let cityCost = null;
      try { MODE = 'city'; animalPass(0, 0, 12); cityCost = window.__ANIMALS_DRAWN; } catch (e) { }
      MODE = wasMode; try { render(); } catch (e) { }

      return { onScreen, marksA: s1 ? s1.split('|').length : 0,
               moved: s1 !== s2 && !!s1, seen, stable, cityCost, cap: ANIMAL_CAP };
    });

    /* ---- A. THERE IS LIFE, AND THE RENDERER SAYS SO --------------------- */
    ok('*** THERE IS LIFE ON THE BLOCK HE WAKES ON *** (' + m.onScreen
      + ' animals drawn on one screen) -- his complaint was that the city is dead',
      m.onScreen > 0);
    ok('and they are really being painted (' + m.marksA + ' marks in one pass)',
      m.marksA > 0);
    ok('*** AND THEY MOVE *** -- set dressing that does not move is scenery',
      m.moved === true);
    ok('*** IT IS THE SAME VALLEY EVERY TIME *** -- life hashed from the seed and '
      + 'the cell, so a block does not reshuffle its rats when he turns around',
      m.stable === true);

    /* ---- D. ALL THREE SHIPPED KINDS REALLY OCCUR ------------------------ */
    console.log('  ACROSS 40 SCREENS: flies ' + m.seen.flies + ' · rats '
      + m.seen.rats + ' · ravens ' + m.seen.ravens);
    ok('flies live here (' + m.seen.flies + ') -- and a swarm is a READ, it means '
      + 'something died there', m.seen.flies > 0);
    ok('ravens live here (' + m.seen.ravens + ') -- on a roofline, which is where '
      + 'the research puts them', m.seen.ravens > 0);
    /* RATS WERE MEASURED AT 9 ACROSS FORTY SCREENS on the first cut, because the
       rule wanted a wall specifically to the SOUTH and then hid them 62% of the
       time on top of the density roll. The ecology calls them "the urban
       constant"; one every five screens is not that. */
    ok('*** AND RATS ARE ACTUALLY THE URBAN CONSTANT *** (' + m.seen.rats
      + ' across 40 screens) -- the first cut managed 9, by wanting a wall to the '
      + 'south and then hiding them most of the time as well', m.seen.rats >= 15);

    /* ---- G. PERFORMANCE ------------------------------------------------- */
    ok('*** IT DRAWS NOTHING AT CITY ZOOM *** (' + m.cityCost + ') -- a 2px mark '
      + 'up there is a dirty screen, not an animal, and his item 7 is PERFORMANCE',
      m.cityCost === 0);
    ok('and it is capped per frame (' + m.cap + ')', m.cap > 0 && m.cap <= 200);

    ok('and nothing threw ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
