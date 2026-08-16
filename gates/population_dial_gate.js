/* ============================================================================
   POPULATION DIAL GATE (8/16/26, PEOPLE lane)

   PAOLO 8/1: "why don't you do some coding plumbing right now till I make a
   population slider ... it should be something that's extremely easy to control
   ... the slider can go all the way from zero to a maximum."

   The plumbing shipped that day. THE SLIDER DID NOT, and for fifteen days
   nothing anywhere called setDial. This gate holds the handle open.

   WHAT IT REFUSES TO LET HAPPEN AGAIN, and every one of these is a bug this
   session actually measured on the real surface rather than a hypothetical:

   1. A HANDLE HE CANNOT REACH, OR ONE UNDER HIS THUMB. The chip and the panel
      must exist, open when tapped, and sit CLEAR OF THE TOOLBAR AND THE OPEN
      DRAWER on a 390px phone. The first cut inserted the panel inside #topbar,
      whose CSS is `#topbar>*{position:static !important}` -- it would have
      stripped the card's positioning and dropped it into the button row. And the
      chip itself belongs in the BUILDER'S DRAWER: Paolo 8/16 said the walking row
      has "a lot of bullshit buttons still around from the early days", the RUN
      lane moved every world-BUILDING control out of it, and a population dial
      regenerates the valley. B2b holds that placement so a later edit cannot
      quietly drag it back under his thumb.

   2. A HANDLE THAT MOVES NOTHING. peoplePass -> pplPeople -> peopleIn ->
      homesIn -> headsAt, and headsAt was RAW: the dial multiplied a rate that
      only bohemia_agents.js ever read. Measured through the one link, bodies
      actually blitted at dial 0, 1 and 20 were 1, 1 and 1.
      ONE DIAL, TWO PATHS, APPLIED EXACTLY ONCE ON EACH.

   3. A CACHE THAT OUTLIVES THE DECISION. PPL_PEOPLE keys on rulesVersion() and
      setDial did not bump it, so the surface served pre-dial neighbourhoods
      forever. Fixed IN THE MODULE, not at the call site -- a fix next to the
      button would have left the next caller of setDial broken identically.

   4. A BOTTOM THAT LIES. The module promises dial 0 is "A GHOST VALLEY. Not
      'fewer people' - NOBODY." An authored spawn neighbour sailed straight
      through it and stood there at dial 0.

   5. A TOP THAT IS DEAD. The surface capped a neighbourhood at 24 bodies, so
      dial 4, 12, 20 and 32 drew the SAME STREET. Seven eighths of his handle
      did nothing.

   HOW IT MEASURES, and this is the whole point: PRESS THE BUTTON HE PRESSES,
   THEN COUNT THE BODIES THE FRAME ACTUALLY BLITTED. Not a symbol grep, not a
   call to the function under test, not a colour census. This session has now
   produced five separate features that measured perfectly and were invisible on
   screen; every assertion below reads BARK_DREW, which peoplePass fills with
   what it drew, or a getBoundingClientRect off the live panel.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  /* ---- A. THE MODULE'S HALF, headless: cheap, and it fails fast ---------- */
  global.window = global;
  const POP = require(path.join(ROOT, 'engine/bohemia_population.js'));

  ok('A1 the dial still ships at 1 -- nothing moved until he moves it', POP.dial() === 1);

  const LM = POP.LANDMARK || {};
  ok('A2 the landmarks are the module\'s, derived, not retyped in the panel',
    Number(LM.nobody) === 0 && Number(LM.today) === 1 &&
    Number(LM.scale) > 1 && Number(LM.story) > Number(LM.scale));
  ok('A3 every landmark is REACHABLE on the track (max ' + POP.DIAL_MAX + ')',
    Object.values(LM).every(v => Number(v) >= POP.DIAL_MIN && Number(v) <= POP.DIAL_MAX));

  /* A4: the version bump IS the cache invalidation. Every consumer keys on it. */
  POP.setDial(1);
  const v0 = POP.rulesVersion();
  POP.setDial(7);
  ok('A4 moving the dial bumps rulesVersion, so caches cannot outlive it',
    POP.rulesVersion() > v0);
  const v1 = POP.rulesVersion();
  POP.setDial(7);
  ok('A5 setting it to what it already is bumps nothing', POP.rulesVersion() === v1);

  /* A6: the second path. dialHeads must scale the COUNT homesIn asks for, and
     applyDial must still scale the RATE -- once each, never both on one path. */
  POP.setDial(1);
  const rate1 = POP.applyDial(0.02);
  POP.setDial(4);
  const rate4 = POP.applyDial(0.02);
  ok('A6 the rate path still answers to the dial (' + rate1 + ' -> ' + rate4 + ')',
    rate4 > rate1 * 3.5);
  POP.setDial(1);

  /* ---- B. THE SURFACE'S HALF, through the one link ----------------------- */
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await page.waitForTimeout(3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await page.waitForTimeout(16000);

    /* ASK A FRAME WHAT IT CAN DO, NEVER MATCH ITS URL. .find() on a url pattern
       returned the wrong frame once and blinded fourteen gates. */
    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof pplPeople === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('B1 the world loads through the one link', !!city);
    if (!city) throw new Error('no city frame');

    /* out onto the street: peoplePass draws nobody until there is a body */
    await city.evaluate(() => { if (MODE !== 'human') { swapMode(); HC = HZOOM; } render(); });
    await page.waitForTimeout(2600);

    ok('B2 the handle is IN THE TAB he plays -- a chip beside REROLL',
      await city.evaluate(() => !!document.getElementById('popbtn')));

    /* B2b: AND IT IS IN THE BUILDER'S DRAWER, NOT UNDER HIS THUMB. Paolo 8/16:
       "the run has a lot of bullshit buttons still around from the early days."
       The RUN lane moved every world-BUILDING control out of the walking row for
       exactly that reason, and a population dial is a world-building control.
       This asserts the placement rather than trusting it, because the anchor
       that puts it there is one line in a patch tool and a future edit could
       quietly drag it back into the row he walks with. */
    const home = await city.evaluate(() => {
      const b = document.getElementById('popbtn');
      return { inTray: !!(b && b.closest('#devtray')), inRow: !!(b && b.closest('#topbar')) };
    });
    ok('B2b it lives in the builder\'s drawer, NOT the row he walks with',
      home.inTray && !home.inRow);

    /* B2c: AND THE DRAWER IS NOT A PILE. #reroll/#underbtn/#keybtn each still
       carry a sandbox-era `position:absolute;right:NNNpx;top:10px`. Inside
       #topbar that was dead, because #topbar>* forces position:static. The
       moment the RUN lane moved them into #devtray those rules woke up, and the
       tray -- whose own CSS says flex-direction:column -- laid out as a row of
       chips overlapping by up to 9px that only looked tidy because the old
       right: offsets happened to tile. Adding one static chip put it straight on
       top of KEY. This counts real overlaps between real rects, so no future
       chip can land on another one. */
    await city.evaluate(() => { const t = document.getElementById('devtray');
      if (t && !t.classList.contains('on')) document.getElementById('devbtn').click(); });
    await page.waitForTimeout(300);
    const overlaps = await city.evaluate(() => {
      const r = Array.from(document.getElementById('devtray').children)
        .map(c => { const b = c.getBoundingClientRect(); return { id: c.id, b }; });
      const hits = [];
      for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
        const a = r[i].b, c = r[j].b;
        if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom)
          hits.push(r[i].id + '/' + r[j].id);
      }
      return { n: r.length, hits };
    });
    ok('B2c no two chips in the drawer sit on top of each other (' +
      overlaps.n + ' chips, ' + overlaps.hits.length + ' overlaps)',
      overlaps.n >= 4 && overlaps.hits.length === 0, overlaps.hits.join(' '));

    /* B3: OPEN THE DRAWER AND TAP IT, the way he does. Then measure the card on
       the real surface -- display:flex is not visible and neither is a 0x0 box,
       so this reads the rect. */
    await city.evaluate(() => document.getElementById('devbtn').click());
    await page.waitForTimeout(300);
    await city.evaluate(() => document.getElementById('popbtn').click());
    await page.waitForTimeout(500);
    const box = await city.evaluate(() => {
      const w = document.getElementById('popwrap');
      const r = w.getBoundingClientRect();
      /* the lowest thing hanging off the top of the stage: the toolbar wraps to
         two rows on a phone, and the open drawer hangs below it */
      let low = 0;
      ['topbar', 'devtray'].forEach(id => {
        const e = document.getElementById(id);
        if (e && e.offsetParent !== null) low = Math.max(low, e.getBoundingClientRect().bottom);
      });
      return { w: r.width, h: r.height, top: r.top, tbBottom: low,
               right: r.right, vw: window.innerWidth,
               marks: document.getElementById('popmarks').children.length,
               now: (document.getElementById('popnow').textContent || '').trim() };
    });
    ok('B3 tapping it opens a real card (' + Math.round(box.w) + 'x' + Math.round(box.h) + ')',
      box.w > 200 && box.h > 100);
    /* B4: THE TOOLBAR WRAPS TO TWO ROWS ON A PHONE and the open drawer hangs
       below it. A fixed top would hide the card under one of them on the only
       screen he uses. */
    ok('B4 the card clears the toolbar AND the open drawer (top ' +
      Math.round(box.top) + ' vs bottom of what is above it ' + Math.round(box.tbBottom) + ')',
      box.top >= box.tbBottom && box.right <= box.vw + 1);
    ok('B5 the four landmarks are on it, one tap each', box.marks === 4);
    ok('B6 it opens saying how many people are on his street, in words',
      /person|people|street/i.test(box.now), box.now);

    /* ---- C. AND IT MOVES THE WORLD, counted in blitted bodies ------------- */
    const drewAt = async (v) => {
      await city.evaluate(val => { BohemiaPopulation.setDial(val); render(); }, v);
      await page.waitForTimeout(2400);
      return await city.evaluate(() => { render(); return BARK_DREW.length; });
    };

    /* stand in a SETTLEMENT: his 7/29 ruling makes a spread neighbourhood one
       household per subdivision BY DESIGN, so a cluster is where the dial is
       legible. The gate goes where the claim is testable. */
    const found = await city.evaluate(() => {
      const NB = BohemiaPopulation.NB;
      for (let ny = 0; ny < 24; ny++) for (let nx = 0; nx < 24; nx++) {
        if (BohemiaPopulation.zoneAt(om, POWER, nx * NB, ny * NB, seed) !== 'cluster') continue;
        BohemiaPopulation.setDial(1);
        const ppl = pplPeople(nx, ny);
        if (ppl.length < 5) continue;
        hx = ppl[0].home[0] + 1; hy = ppl[0].home[1] + 1;
        city.x = (nx * NB) | 0; city.y = (ny * NB) | 0;
        render();
        return { nb: [nx, ny], n: ppl.length };
      }
      return null;
    });
    ok('C1 the valley actually has a settlement to stand in', !!found);
    await page.waitForTimeout(2400);

    const zero = await drewAt(0);
    const one = await drewAt(1);
    const four = await drewAt(4);
    const top = await drewAt(POP.DIAL_MAX);
    const curve = [zero, one, four, top].join(' -> ');

    /* C2: THE BOTTOM OF THE SLIDER IS NOT ALLOWED TO LIE. */
    ok('C2 dial 0 is a GHOST VALLEY -- nobody, including the man next door (' + zero + ' drawn)',
      zero === 0);
    /* C3: and 1 is still a street with people on it */
    ok('C3 dial 1 is still the game he already has (' + one + ' drawn)', one > 0);
    /* C4: the whole point. More dial, more bodies ON SCREEN, not in a variable. */
    ok('C4 turning it up puts MORE BODIES ON THE SCREEN (' + curve + ')',
      four > one && top > four);
    /* C5: the top is not a plateau three quarters of the way down the track --
       the 24-body draw budget made dial 4, 12, 20 and 32 the same street. */
    ok('C5 the top of the track is not dead ground (' + four + ' -> ' + top + ')',
      top >= four * 1.5);
    ok('C6 nothing threw while he dragged it', errs.length === 0, errs.slice(0, 3).join(' | '));

    /* C7: put it back where it ships, and prove that ROUND TRIPS. A dial he
       cannot undo is worse than one he cannot set. */
    const back = await drewAt(1);
    ok('C7 dragging it back restores the street he started on (' + one + ' -> ' + back + ')',
      back === one);
  } finally {
    await b.close();
  }

  console.log('POPULATION DIAL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
