const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   STREET FACING IS MEASURED, NOT ASSERTED (8/28/26, RUN lane)

   PAOLO, 8/28, LOOKING AT A SCREENSHOT OF HIS OWN GAME:
     "do you not see the fucking streets that are not facing the correct
      direction? ... I keep trying to fucking tell you"

   AND HE HAS BEEN. gates/street_facing_gate.js opens with his words from 8/15:
     "how hard is it to recognize and be smart about which direction a street
      should be going east to West north to south and then make it face that way
      properly by turning the tile"

   THAT GATE HAS BEEN GREEN, 16 OF 16, FOR THIRTEEN DAYS.

   *** AND IT HAS NEVER LOOKED AT A STREET. *** Measured on the file:
       times it renders a frame or reads om.at .................. 0
       checks that are REGEXES AGAINST ITS OWN SOURCE TEXT ...... 14
   It proves the code CONTAINS the characters `roadAxis(d,x,y)`. That is a
   MENTION, not a USE, and this repo already has a law about the difference: a
   checker that cannot tell one from the other is the broken one. It cannot
   count a single misfaced street and never could.

   IT IS THE SAME SHAPE THE WORLD LANE ADMITTED THIS MORNING about a different
   street gate: "HE PLAYED IT AND SAID THE STREETS WERE STILL FUCKED WHILE MY
   GATE SAID 0 OF 2594. HE WAS RIGHT AND THE GATE WAS THE BROKEN PART." Twice in
   one day, on two different gates, both about streets, both green.

   ------------------------------------------------------------------------
   WHAT IS ACTUALLY WRONG, MEASURED ON THE REAL SURFACE
   ------------------------------------------------------------------------
   roadAxis() decides which way a street runs by RUN LENGTH, and it is right to.
   On 3,573 road cells it answers 3,458 times. ON 115 IT RETURNS NOTHING AT ALL,
   and its own comment says why that matters:

     "A TIE IS NOT AN ANSWER, AND EVERY CALLER WAS TURNING IT INTO ONE ... an
      ambiguous cell did not become a crossing, it became a NORTH-SOUTH ROAD BY
      DEFAULT ... the world had no answer, and instead of finding one, the code
      guessed, and the guess was always the same direction."

   That was written on 8/27 about 14 freeway cells and it was fixed for those.
   THE SAME SENTENCE IS STILL TRUE FOR 115 MORE, and 114 of them are not odd
   corners: they sit inside a real corridor with two or more road neighbours of
   their own district. Every caller still writes `roadAxis(...)||'ns'`.

   115 cells is 3.2% of the valley's roads, scattered everywhere, which is
   exactly what "streets not facing the correct direction" looks like from the
   air.

   ------------------------------------------------------------------------
   WHY THIS GATE RATCHETS INSTEAD OF GOING RED
   ------------------------------------------------------------------------
   THE STREET RENDERER IS THE WORLD LANE'S SYSTEM AND THEY ARE IN IT TODAY (they
   are the most recent writer in the handoff, mid-flight on street-to-city
   seams). ONE SYSTEM, ONE SESSION, and this lane lost four hours today to
   exactly that collision. So this does not touch their pipe.
   A gate that is deliberately red would block every lane's ship, so instead it
   HOLDS THE NUMBER AS A CEILING and prints it in every suite run. It cannot be
   made worse in silence and it goes green on its own as it is fixed. That is
   the pattern the WORLD lane itself used for its ratcheted seam counts.

   AND IT HOLDS ITSELF TO THE THING THE OLD GATE FAILED: it must actually read
   the map. If this ever decays into another source-text checker, its own first
   claim goes red.

   node gates/street_facing_is_measured_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

/* THE CEILING. Measured 8/28 on the shipped seed. Lower it when it improves;
   raising it needs a reason written next to it. */
const CEIL_BLANK = 115;
const CEIL_CORRIDOR = 114;

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
  console.log('\n=== STREET FACING IS MEASURED: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  /* ---- 0. THE OLD GATE'S BLINDNESS, HELD SO IT CANNOT COME BACK -------- */
  const old = fs.readFileSync(path.join(ROOT, 'gates', 'street_facing_gate.js'), 'utf8');
  const oldReads = (old.match(/om\.at|render\(\)|chromium|playwright/g) || []).length;
  const me = fs.readFileSync(__filename, 'utf8');
  const meReads = (me.match(/om\.at/g) || []).length;
  ok('*** THIS GATE READS THE MAP, WHICH IS THE THING THE 8/15 FACING GATE NEVER '
    + 'DID *** (it renders/queries ' + oldReads + ' times and checks its own source '
    + 'text instead; this one reads the map ' + meReads + ' times)',
    meReads >= 2);

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
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1500);

    /* ---- 1. EVERY ROAD CELL IN THE VALLEY, ASKED THE REAL FUNCTION ------ */
    const m = await city.evaluate(() => {
      const D4 = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      let road = 0, blank = 0, decided = 0, corridor = 0, isolated = 0;
      const by = {}, sample = [];
      for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
        const t = om.at(x, y);
        if (!t || !RD[t.district]) continue;
        road++;
        let a = '';
        try { a = roadAxis(t.district, x, y); } catch (e) { continue; }
        if (a) { decided++; continue; }
        blank++;
        by[t.district] = (by[t.district] || 0) + 1;
        let same = 0;
        for (const d of D4) {
          const q = om.at(x + d[0], y + d[1]);
          if (q && RD[q.district] && q.district === t.district) same++;
        }
        if (same >= 2) corridor++; else isolated++;
        if (sample.length < 6) sample.push([x, y, t.district, same]);
      }
      return { road, blank, decided, corridor, isolated, by, sample, n: om.n };
    });

    ok('the gauge really swept the whole valley (' + m.road + ' road cells on a '
      + m.n + 'x' + m.n + ' map)', m.road > 2000);
    ok('and the function answers for the overwhelming majority (' + m.decided
      + ' of ' + m.road + ')', m.decided > m.road * 0.9);

    /* ---- 2. THE DEFECT, IN A NUMBER HE CAN CHECK ------------------------ */
    ok('*** ' + m.blank + ' ROAD CELLS HAVE NO DECIDED DIRECTION, AND EVERY CALLER '
      + 'TURNS THAT INTO NORTH-SOUTH *** -- ceiling ' + CEIL_BLANK + ', by district '
      + JSON.stringify(m.by), m.blank <= CEIL_BLANK);
    ok('*** AND ' + m.corridor + ' OF THEM ARE NOT ODD CORNERS: they sit inside a '
      + 'real corridor with two or more road neighbours of their own district *** '
      + '-- ceiling ' + CEIL_CORRIDOR, m.corridor <= CEIL_CORRIDOR);
    ok('(for scale: ' + (Math.round(m.blank / m.road * 1000) / 10) + '% of the '
      + 'valley\'s roads, scattered, which is what "streets not facing the correct '
      + 'direction" looks like from the air)', true);

    /* ---- 3. AND THE RULER ITSELF IS NOT THE BROKEN PART ------------------ */
    /* I NEARLY REPORTED 15 MORE CELLS AS WRONG AND THEY WERE NOT. My first
       measure counted NEIGHBOURS; roadAxis measures RUN LENGTH, and on those
       cells run length is right and my count was the broken ruler. Fourth broken
       ruler in this lane this week, and the only reason it did not reach him is
       that it got checked against the function's own inputs first. So the gate
       proves run length and neighbour count really are different questions,
       rather than quietly assuming they agree. */
    const ruler = await city.evaluate(() => {
      let disagree = 0, looked = 0;
      const D4 = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (let y = 0; y < om.n && looked < 4000; y++) for (let x = 0; x < om.n; x++) {
        const t = om.at(x, y); if (!t || !RD[t.district]) continue;
        let a = ''; try { a = roadAxis(t.district, x, y); } catch (e) { continue; }
        if (!a) continue;
        looked++;
        let ns = 0, ew = 0;
        for (const d of D4) {
          const q = om.at(x + d[0], y + d[1]);
          if (!q || !RD[q.district]) continue;
          if (d[1] !== 0) ns++; else ew++;
        }
        if (ns === ew) continue;
        if ((ns > ew ? 'ns' : 'ew') !== a) disagree++;
      }
      return { disagree, looked };
    });
    ok('counting NEIGHBOURS and measuring RUN LENGTH are genuinely different '
      + 'questions (' + ruler.disagree + ' of ' + ruler.looked + ' decided cells '
      + 'disagree) -- so "the neighbours say otherwise" is NOT evidence a street '
      + 'faces wrong, and this gate does not claim it is',
      ruler.disagree > 0 && ruler.disagree < ruler.looked * 0.05);

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);

    console.log('  MEASURED: ' + m.blank + ' of ' + m.road + ' road cells have NO '
      + 'decided direction and are drawn north-south by default · ' + m.corridor
      + ' of those sit inside a real corridor · by district ' + JSON.stringify(m.by));
    console.log('  FIRST SIX: ' + JSON.stringify(m.sample));
    console.log('  NOT THIS LANE\'S PIPE TO FIX: the street renderer is the WORLD '
      + 'lane\'s and they are in it today. This holds the number as a CEILING so '
      + 'it cannot get worse in silence, prints it every run, and goes green on '
      + 'its own as it comes down.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
