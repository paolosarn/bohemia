/* ============================================================================
   CITY BARKS GATE (8/15/26, PEOPLE lane)

   THE MEASUREMENT THAT FORCED THE FEATURE, and it is the worst reach failure
   this lane has found: `linesFor` was called ZERO TIMES in
   slices/BOHEMIA_CITY_WORLD.html -- the frame the player is looking at when
   they tap RUN. 244 written barks and 66 reactions, inlined and correct in that
   file, and nothing in it had ever asked for a line. The mouth, the reactions
   and the gate that proves them all lived in BOHEMIA_RUN_CURRENT.html, which
   the RUN tab does NOT show (it routes to p-city and parks the run frame
   hidden). Every one of those gates was honestly green about a surface nobody
   reaches.

   AND THEN THE FEATURE FAILED FOUR TIMES BEFORE IT DREW A SINGLE PIXEL, each
   time with everything upstream measuring perfectly. This gate exists to hold
   all four, because every one of them is a way to ship silence:
     1. THE BLOCK WAS DECLARED INSIDE THE DRAW FUNCTION, so barkHold and friends
        were nested and `barkHold is not defined` came back from the browser.
     2. THE CLOCK WAS A BEAT MULTIPLE (`if (beat % 8) return`). This city is
        I-MOVE-YOU-MOVE and only draws when the player acts, so a draw almost
        never lands on the exact beat. Forty walked steps, nobody ever spoke.
        A deadline the next draw can be LATE for is the only clock that works.
     3. IT PICKED THE NEAREST PERSON rather than a VISIBLE one. At 06:00 the
        whole block is home: the line resolved, and the bubble was over a roof
        with nobody under it. It reads peoplePass's own drawn list now.
     4. *** THE CITY'S 2D CONTEXT IS `g`, NOT `ctx`. *** barkPass opened with
        `var g = ctx;` -- a reference to something this frame lacks AND a shadow
        of the real one -- so it threw on its first line, every call, and the
        try/catch around the call ate it in silence. A CAUGHT EXCEPTION IN A
        DRAW PATH IS A FEATURE THAT SILENTLY DOES NOTHING, which is worse than a
        crash because a crash gets fixed.

   SO THE CLAIM IS PIXELS ON THE REAL PATH. Not "the function exists", not "a
   line resolved" -- both of those were true through every one of those four
   failures. It boots the ALPHA (never the standalone city: that page has no
   PLAYER_CV because the character bake is posted in, so peoplePass draws nobody
   and a probe there measures a ghost town that does not exist), finds the frame
   that owns the world, and reads the canvas.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
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
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  await page.goto('file://' + ALPHA);
  /* seen already, so the opening does not sit over the street we are measuring */
  await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
  await page.reload();
  await SETTLE(page, 3400);
  await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await SETTLE(page, 500);
  const _runTab = await page.evaluate(() => {
    /* NEVER SWALLOW A MISSING TAB. `if (t) t.click()` reports GREEN when the
             tab is gone -- four gates did exactly that and read green for weeks,
             which is why ONE WORLD TAB forbids the shape. Say so instead. */
    const t = Array.from(document.querySelectorAll('.tab'))
      .find(e => (e.textContent || '').trim() === 'RUN');
    if (!t) return false;
    t.click(); return true;
  });
  ok('the RUN tab exists in the alpha and was tapped', _runTab === true);
  await SETTLE(page, 16000);

  let city = null;
  for (const f of page.frames()) {
    try { if (await f.evaluate(() => typeof BARK !== 'undefined' && typeof pplPeople !== 'undefined')) { city = f; break; } }
    catch (_e) {}
  }
  ok('the walked world is loaded through the one link', !!city);
  if (!city) { await b.close(); console.log('CITY BARKS GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); }

  /* the character bake reaches this frame; without it peoplePass draws nobody
     and every measurement below would be about an empty street that is not real */
  ok('the player body reached the world frame — otherwise nobody is drawn at all',
    await city.evaluate(() => !!PLAYER_CV));

  await city.evaluate(() => { const g2 = document.querySelector('#daycardIn .dcgo'); if (g2) g2.click(); });
  await SETTLE(page, 500);
  await city.evaluate(() => { try { offerAccept(); } catch (_e) {} });
  await SETTLE(page, 700);

  const r = await city.evaluate(() => {
    const out = {};
    /* *** RENDER THE WAY THE GAME RENDERS. *** The bark call lives in
       renderHuman(), which is the human-mode path; calling draw() from a probe
       measured a frame that never reached it (barkPass invoked 0 times) while
       the real game was drawing bubbles fine. Ask for the path that exists. */
    function paint(){
      try { if (typeof renderHuman === 'function') { renderHuman(); return; } } catch (_e) {}
      try { draw(); } catch (_e) {}
    }
    out.paintPath = (typeof renderHuman === 'function') ? 'renderHuman' : 'draw';
    paint();
    out.drawn = BARK_DREW.length;
    out.drewShape = BARK_DREW.length ? Object.keys(BARK_DREW[0]).sort().join(',') : '';
    /* THE THROW CHECK. Call barkPass directly, OUTSIDE the try/catch the draw
       wraps it in, so an exception is visible instead of silent. */
    BARK.next = 0; BARK.p = null;
    try { barkTick(performance.now()); out.tickThrew = null; }
    catch (e) { out.tickThrew = e.message.slice(0, 90); }
    out.spoke = BARK.p ? BARK.text : null;
    out.dist = BARK.at ? Math.abs(BARK.at[0] - hx) + Math.abs(BARK.at[1] - hy) : null;
    /* the speaker must be one of the bodies the renderer actually drew */
    out.speakerWasDrawn = !!(BARK.p && BARK_DREW.some(d => d.p === BARK.p));
    out.hold = BARK.text ? barkHold(BARK.text) : 0;
    /* HIS WORDS, not mine: the line has to exist in the table the WORDS tab edits */
    out.fromHisTable = false;
    try {
      const L = BohemiaPeople.LINES;
      out.fromHisTable = Object.keys(L).some(k =>
        (Array.isArray(L[k]) ? L[k] : [L[k]]).indexOf(BARK.text) >= 0);
    } catch (_e) {}
    /* *** PIXELS, AS A DIFFERENCE, IN THE BUBBLE'S OWN RECTANGLE. ***
       The first cut of this counted pale #cdbd8a-ish pixels across the WHOLE
       canvas -- and this is a DESERT: the sand and the stucco sit in exactly
       that colour range, so it counted thousands whether the bubble drew or
       not. I mutated the context name back to the bug that shipped and the
       gate stayed GREEN. Third checkbox of the day.
       A colour census cannot tell a bubble from a pavement. So: draw the same
       frame TWICE, once with the bark suppressed and once with it live, and
       demand the pixels CHANGED. Nothing in the world can fake that, because
       everything else in both frames is identical. */
    function frameBytes() {
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      const out2 = [];
      for (let i = 0; i < d.length; i += 4 * 17) out2.push(d[i], d[i + 1], d[i + 2]);
      return out2;
    }
    const keepP = BARK.p, keepT = BARK.text, keepU = BARK.until, keepN = BARK.next;
    /* AND THE SILENT FRAME HAS TO ACTUALLY BE SILENT. Clearing BARK.p alone is
       not enough: the draw calls barkTick, which sees the deadline has passed,
       PICKS THE SAME PERSON AGAIN and draws the same bubble -- so both frames
       matched and the difference was zero. Push the deadline out of reach. */
    BARK.p = null; BARK.text = ''; BARK.until = 0; BARK.next = Infinity;
    paint();
    const silent = frameBytes();
    BARK.p = keepP; BARK.text = keepT; BARK.until = performance.now() + 60000;
    paint();
    const spoken = frameBytes();
    let diff = 0;
    for (let i = 0; i < silent.length; i++) if (silent[i] !== spoken[i]) diff++;
    out.pixelsChangedByTheBark = diff;
    BARK.until = keepU; BARK.next = keepN;
    return out;
  });

  ok('somebody is actually drawn on the street (' + r.drawn + ')', (r.drawn | 0) >= 1);
  ok('the renderer records WHO it drew, which is the only honest list of who is visible',
    r.drewShape === 'at,p', r.drewShape);
  ok('barkTick does not throw — a caught exception in a draw path is silent nothing',
    r.tickThrew === null, r.tickThrew || '');
  ok('SOMEBODY SPEAKS ("' + String(r.spoke).slice(0, 40) + '")', !!r.spoke);
  ok('and they are one of the bodies the renderer DREW, never a voice from inside a wall',
    r.speakerWasDrawn === true);
  ok('and they are within earshot (' + r.dist + ' tiles), not shouting across the valley',
    r.dist !== null && r.dist <= 7);
  ok('THE WORDS ARE HIS — the line is a row in the LINES table the WORDS tab edits',
    r.fromHisTable === true);
  ok('the line holds for a whole number of beats, sized by reading speed (' + r.hold + 'ms)',
    r.hold >= 833 && r.hold <= 7000 && r.hold % 500 === 0);
  ok('THE BUBBLE IS ON THE CANVAS — the same frame drawn silent and spoken DIFFERS by '
    + r.pixelsChangedByTheBark + ' samples',
    (r.pixelsChangedByTheBark | 0) > 200,
    'four separate failures all measured perfect right up to here');
  ok('the world booted clean', errs.length === 0, errs.slice(0, 2).join(' | '));

  await b.close();
  console.log('CITY BARKS GATE: ' + pass + ' passed, ' + fail + ' failed  ' +
    '(' + r.drawn + ' on screen, ' + r.dist + ' tiles away, measured through the one link)');
  process.exit(fail ? 1 : 0);
})();
