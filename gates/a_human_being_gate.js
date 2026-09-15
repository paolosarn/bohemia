/* ============================================================================
   BOHEMIA A HUMAN BEING (9/15/26, PEOPLE lane).
   VAMILY [a human being], row HE-DID-NOT-SEE-A-SINGLE-HUMAN-BEING.

   PAOLO 9/15, his second play of the demo:
     "I didn't see a single human being. Very strange."

   *** AND THERE WAS ONE STANDING TWO CELLS FROM HIM AT THE DOOR. ***
   Measured on the shipped cut with the one driver, on a phone profile:
     first person on the glass   0.0 s after the door
     on screen at 10 s / 30 s / 60 s   2, 2, 2
   So the row's first question -- how long until a person appears -- has the
   answer "immediately", and the complaint is still true. He looked at a person
   and did not see a human being.

   THE CAUSE, AND IT IS ARITHMETIC RATHER THAN OPINION. The bark bubble lifted
   itself 0.9 of a CELL above the speaker's cell. A body is not drawn in cells,
   it is drawn on the zoom ladder, and at the zoom the demo opens at that is 112
   pixels against a 44 pixel cell. The bubble cleared a head only while a body
   was under 1.9 cells tall. It is 2.5. SO A NEAR-BLACK PANEL AT 0.92 ALPHA SAT
   OVER THE TOP 28 PIXELS OF THE BODY -- which is exactly the face -- every time
   anybody spoke, at the zoom he plays at.

   Looked at on the glass, before and after, which is what settled it:
     before   a dark blob with two faint dots, inside a black box
     after    brown hair, a face, green eyes, a mouth, a cream shirt, blue jeans

   AND THE LIFT IS NOT A NEW NUMBER EITHER. It is the body's own top, which the
   people pass computes as sy + C - lad, minus the bubble's height and the
   padding it already had. THE LADDER WAS WRITTEN OUT TWICE IN THIS FILE and the
   bubble could see neither copy, so it guessed -- two copies of a rule are how a
   third thing ends up disagreeing with both. There is one now, and three
   readers.

   WHAT THIS HOLDS:
   A. a person is on the glass within ten seconds of the door, every walk
   B. *** AND THE BUBBLE CLEARS THE HEAD, AT EVERY RUNG OF THE LADDER ***
   C. one ladder, one place, no second copy for anything to disagree with
   D. driven on the demo he plays, not computed from the file

   node gates/a_human_being_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

(async () => {
  head('A. HIS WORDS, AND ONE RULE FOR HOW TALL A BODY IS');
  const lawPath = path.join(ROOT, 'records/BOHEMIA_PAOLO_PLAYED_THE_DEMO_AGAIN_9_15_26.md');
  const law = fs.existsSync(lawPath) ? fs.readFileSync(lawPath, 'utf8') : '';
  ok('his second play is written down where the row says it is',
    fs.existsSync(lawPath));
  /* HIS WORDS ARE WRAPPED ACROSS LINES IN THAT FILE, so the newlines come out
     before matching. The first cut went red on a record that says exactly what
     it claims, because a regex met a line break -- which is the instrument
     failing, not the claim. */
  const lawFlat = law.replace(/\s+/g, ' ');
  ok('and the sentence this row exists for is in it verbatim',
    /didn'?t see a single human being/i.test(lawFlat),
    law ? 'found' : 'record missing');

  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);
  const copies = (city.match(/C >= 64 \? 224/g) || []).length;
  ok('*** HOW TALL A BODY IS DRAWN IS WRITTEN IN EXACTLY ONE PLACE. *** It was written twice and the bubble that has to clear a head could see neither, so it guessed',
    copies === 1, `${copies} copy of the ladder`);
  const readers = (city.match(/bodyLadder\(C\)/g) || []).length;
  ok('...and everything that needs it READS that one place rather than keeping its own',
    readers >= 3, `${readers} readers`);
  probe('the one-ladder claim rejects a file that still carries a second copy',
    (('C >= 64 ? 224' + ' C >= 64 ? 224').match(/C >= 64 \? 224/g) || []).length === 2);

  head('B. THE BUBBLE CLEARS THE HEAD, AT EVERY RUNG');
  /* THE WHOLE DEFECT IS ONE INEQUALITY, so this checks it as one, at every zoom
     the ladder can put him at rather than only the one the demo opens on. */
  const ladder = C => (C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56)));
  const padY = 6;
  const rungs = [12, 16, 17, 24, 31, 32, 44, 63, 64, 96];
  const bad = [];
  for (const C of rungs) {
    const lad = ladder(C);
    const bodyTop = C - lad;                       /* offset from the speaker's cell */
    const bubbleBottomNew = (C - lad) - padY;      /* the rule that shipped */
    const bubbleBottomOld = -0.9 * C;              /* the rule that was there */
    if (bubbleBottomNew > bodyTop) bad.push(`C=${C} new bottom ${bubbleBottomNew} below top ${bodyTop}`);
    notes.push(`C=${String(C).padStart(3)}  body ${lad}px, top at ${bodyTop}`
      + `   OLD bubble bottom ${bubbleBottomOld}`
      + (bubbleBottomOld > bodyTop ? `  OVERLAPPED THE HEAD BY ${(bubbleBottomOld - bodyTop).toFixed(1)}px` : '  cleared')
      + `   NEW ${bubbleBottomNew}`);
  }
  ok('*** THE BUBBLE SITS ABOVE THE BODY AT EVERY RUNG OF THE LADDER ***, not only at the zoom the demo happens to open on',
    bad.length === 0, bad.join(' | ') || `${rungs.length} rungs checked`);
  const wouldHaveFailed = rungs.filter(C => (-0.9 * C) > (C - ladder(C)));
  ok('...and the rule it replaced failed at the zoom he plays at, which is the measurement this row came from',
    wouldHaveFailed.indexOf(44) >= 0,
    `the old lift covered the face at C = ${wouldHaveFailed.join(', ')}`);
  ok('the code lifts by the BODY, not by a number somebody picked',
    /\(sy \+ C - _lad\) - h - padY/.test(city) && /var _lad = bodyLadder\(C\)/.test(city));
  probe('the clearance claim rejects the old lift',
    (-0.9 * 44) > (44 - 112));

  head('C. AND ON THE DEMO HE PLAYS');
  let R = null, driveErr = null;
  try {
    const D = require(DRIVE);
    const t0 = Date.now();
    const d = await D.open();
    const doorAt = Date.now();
    /* WHEN DOES A PERSON ARRIVE. The row asked for this by name. */
    let firstAt = null; const marks = {};
    for (let i = 0; i < 14; i++) {
      const t = (Date.now() - doorAt) / 1000;
      const n = await d.fr.evaluate(() => ({
        drawn: (typeof window.__PPL_DRAWN === 'number') ? window.__PPL_DRAWN : null,
        mode: (typeof MODE !== 'undefined') ? MODE : null
      }));
      if (firstAt === null && n.drawn > 0) firstAt = t;
      if (!marks[10] && t >= 10) marks[10] = n.drawn;
      await d.page.waitForTimeout(800);
    }
    R = { bootSeconds: +((doorAt - t0) / 1000).toFixed(1), firstAt, at10: marks[10] };
    Object.assign(R, await d.fr.evaluate(() => {
      const o = {};
      o.drawn = window.__PPL_DRAWN;
      /* *** THE REAL RECTANGLE THE PAGE PAINTS, NOT MY ARITHMETIC AGAIN. ***
         The first cut recomputed the geometry here, so putting the OLD lift back
         in the page left this claim GREEN -- it was checking my copy of the sum
         instead of what the game draws. It watches the canvas now: the body
         goes down through drawImage and the bubble through roundRect/fillRect,
         so both rectangles are the page's own. */
      const cv = document.querySelector('canvas'), g2 = cv.getContext('2d');
      const bodies = [], boxes = [];
      const oDraw = g2.drawImage, oRound = g2.roundRect, oFill = g2.fillRect;
      /* A BODY IS A SQUARE ON THE LADDER, and nothing else in this frame is.
         THE BUBBLE IS THE ONE BOX PAINTED IN ITS OWN COLOUR. Both are read off
         the page rather than matched by size, because "about this big" catches
         ground tiles and UI panels -- the first cut saw 4,281 boxes. */
      const RUNGS = [28, 56, 112, 224];
      g2.drawImage = function (img, ...a) {
        if (a.length === 4 && a[2] === a[3] && RUNGS.indexOf(a[2]) >= 0)
          bodies.push({ x: a[0], y: a[1], s: a[2] });
        return oDraw.apply(this, [img, ...a]);
      };
      const BUBBLE_INK = '#0d0b07';
      if (oRound) g2.roundRect = function (x, y, w, h, r) {
        if (String(this.fillStyle).toLowerCase() === BUBBLE_INK) boxes.push({ x, y, w, h });
        return oRound.apply(this, arguments);
      };
      g2.fillRect = function (x, y, w, h) {
        if (String(this.fillStyle).toLowerCase() === BUBBLE_INK && w > 40 && h > 20)
          boxes.push({ x, y, w, h });
        return oFill.apply(this, arguments);
      };
      o.watched = true;
      return new Promise(res => setTimeout(() => {
        g2.drawImage = oDraw; if (oRound) g2.roundRect = oRound; g2.fillRect = oFill;
        o.bodiesSeen = bodies.length; o.boxesSeen = boxes.length;
        /* pair each bubble with the body under it: the one whose horizontal
           middle is nearest the box's middle */
        o.pairs = [];
        for (const b of boxes) {
          const mid = b.x + b.w / 2;
          let best = null;
          for (const y of bodies) {
            const d = Math.abs((y.x + y.s / 2) - mid);
            if (!best || d < best.d) best = { d, body: y };
          }
          if (best && best.d < 120)
            o.pairs.push({ boxBottom: b.y + b.h, bodyTop: best.body.y,
                           clears: (b.y + b.h) <= best.body.y,
                           overlap: Math.max(0, (b.y + b.h) - best.body.y) });
        }
        o.clears = o.pairs.length ? o.pairs.every(p => p.clears) : null;
        o.worstOverlap = o.pairs.reduce((m, p) => Math.max(m, p.overlap), 0);
        try { o.nearest = BARK_DREW.map(b => Math.abs(b.at[0] - hx) + Math.abs(b.at[1] - hy)).sort((a, b) => a - b)[0]; } catch (e) { o.nearest = null; }
        res(o);
      }, 1500));
    }));
    R.pageErrors = d.errs.length;
    await d.close();
  } catch (e) { driveErr = String(e).slice(0, 150); }

  ok('the demo booted and the walked city answered', !!R, driveErr || 'ok');
  if (R) {
    ok('*** A PERSON IS ON THE GLASS WITHIN TEN SECONDS OF THE DOOR ***, which is what the row asked for',
      R.firstAt !== null && R.firstAt <= 10,
      R.firstAt === null ? 'NEVER' : `first at ${R.firstAt.toFixed(1)}s, ${R.at10} on screen at 10s`);
    ok('and somebody is near enough to be seen, not a rumour on the far side of the block',
      typeof R.nearest === 'number' && R.nearest <= 12, `nearest ${R.nearest} cells`);
    ok('*** THE RECTANGLE THE PAGE ACTUALLY PAINTS CLEARS THE BODY IT ACTUALLY PAINTS. *** Watched on the canvas, not recomputed here, because a gate that redoes the sum passes while the game keeps the bug',
      R.clears === true,
      `${R.pairs ? R.pairs.length : 0} bubble(s) over a body, worst overlap ${R.worstOverlap}px`
      + ` (${R.bodiesSeen} bodies, ${R.boxesSeen} boxes seen)`);
    ok('and nothing threw while it did', R.pageErrors === 0, 'page errors ' + R.pageErrors);
    notes.push(`the door took ${R.bootSeconds}s to open; first person ${R.firstAt}s after it`);
  }

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== A HUMAN BEING: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
