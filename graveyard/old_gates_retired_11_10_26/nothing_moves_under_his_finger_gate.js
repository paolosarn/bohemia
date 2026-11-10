/* ============================================================================
   NOTHING MOVES UNDER HIS FINGER (9/15/26, LIFE + CITY lane)
   VAMILY row [eyes: shape rows], EYES E26 bounce-back, PAOLO 9/13 rule 14(d).

   EYES E26 reported three rows on the day card dead, three rounds running, on two
   independent walks each: 'Half of it now, before I go', 'I will go first, on
   something small', 'I'LL TAKE IT'. 320x44 each, panel still open, nothing new
   inside it, both presses.

   DRIVEN ROW BY ROW FROM A CLEAN DOOR, EVERY ONE OF THEM WORKS ON THE FIRST PRESS.
   'Half of it now' moves the terms to the upfront shape and the card to 'One
   battery, half of it up front'. 'I will go first' moves them to the first shape.
   'I'LL TAKE IT' takes the job and the card says 'You took it. It is yours until
   the day is out.' Not one of the three is dead.

   THE REAL BUG IS THE SECOND PRESS, AND IT IS WORSE THAN A DEAD ROW. Measured at
   phone size before the fix: the finger lands on a shape row at y=473. Choosing one
   shape spends all three, the card loses three rows and re-centres as it shrinks,
   and 'Make it a favour instead' arrives at y=491 -- 18 px from the point he is
   still touching, inside the same 44 px box. THE ROOM IS TWO ASKS. So a double tap
   on the first card of the game spends his last ask on a deal he never chose, and a
   third tap on whatever slid in next loses the job outright.

   IT IS ALSO WHY A CAREFUL INSTRUMENT KEPT READING THEM DEAD. EYES fixed this shape
   in round 5 for a panel that CLOSES ("once the panel is gone the same screen point
   belongs to whatever is underneath"). A panel whose CONTENTS MOVE reads exactly the
   same way, and that half was still open.

   SO: the menu keeps every slot for the life of the card. A spent row is drawn in
   place, dashed and dimmed, with no data-act at all, so a tap on it cannot reach the
   dispatcher. This lane ruled on 9/13 that a button which cannot work must not look
   like one; this is the part that ruling missed -- it must not MOVE either.

   THE LEG THAT MATTERS IS B3: after a press, no row a finger can use may sit within
   half a row of the point that was pressed. Everything else here is the guard around
   it. Measured after: zero.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const NEAR = 22;                       /* half a 44 px row: close enough to re-press */

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('NOTHING MOVES UNDER HIS FINGER — the day card\'s rows keep their slots');
console.log('='.repeat(74));

/* ---- A. THE SOURCE ------------------------------------------------------ */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('A1 a spent row exists and cannot be pressed',
   /\.dcbtn\.spent\{[^}]*pointer-events:none/.test(CITY));
ok('A2 a spent row does not look pressable', /\.dcbtn\.spent\{[^}]*opacity:\.4/.test(CITY));
ok('A3 the chosen deal is marked differently from the spent ones',
   /\.dcbtn\.chosen\{/.test(CITY));
ok('A4 the shape slots are drawn from the module order, not a list written here',
   /BohemiaHaggle\.SHAPE_ORDER/.test(CITY) && /BohemiaHaggle\.SHAPES\[sid\]/.test(CITY));
ok('A5 the yes keeps its slot instead of being dropped',
   /var _yes=\(!OFFER_TAKEN && !\(o\.terms && o\.terms\.withdrawn\)\)/.test(CITY));
ok('A6 taking the job dims the rows instead of hiding them',
   /_rows\[_r\]\.removeAttribute\('data-act'\)/.test(CITY)
   && !/_rows\[_r\]\.style\.display='none'/.test(CITY));
ok('A7 the warning keeps a line of its own before it is earned',
   /style="visibility:hidden"/.test(CITY));

/* ---- B. DRIVEN, ON THE DEMO, WITH A REAL FINGER ------------------------- */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open({ keepCards: true });
    const read = () => d.fr.evaluate(() => {
      const box = document.getElementById('daycardIn') || document.getElementById('daycard');
      if (!box) return null;
      const all = Array.from(box.querySelectorAll('.dcbtn,.dcgo'));
      return {
        open: box.getBoundingClientRect().height > 8,
        words: (box.innerText || '').replace(/\s+/g, ' ').trim(),
        /* VISIBLE rows, not DOM nodes. The first cut counted nodes, so a mutation
           that set the spent rows to display:none passed this leg with the card
           visibly collapsing. A ruler that cannot see the regression is not a ruler. */
        drawn: all.filter(e => e.getBoundingClientRect().height > 0).length,
        live: all.filter(e => e.getAttribute('data-act')).map(e => {
          const b = e.getBoundingClientRect();
          return { act: e.getAttribute('data-act'), y: b.y + b.height / 2, h: b.height };
        }),
        asked: (typeof OFFER !== 'undefined' && OFFER && OFFER.terms) ? OFFER.terms.asked : null,
        shape: (typeof OFFER !== 'undefined' && OFFER && OFFER.terms) ? OFFER.terms.shape : null,
        taken: (typeof OFFER_TAKEN !== 'undefined') ? !!OFFER_TAKEN : null
      };
    });
    const at = (s, act) => (s.live.find(r => r.act === act) || null);

    const s0 = await read();
    ok('B0 the day card is up at the door with something on it', !!s0 && s0.open);
    const row = at(s0, 'hg:upfront');
    ok('B1 the row EYES named is on the card and a finger can use it', !!row);
    console.log('  the card draws ' + (s0 ? s0.drawn : '?') + ' rows, '
      + (s0 ? s0.live.length : '?') + ' of them pressable');

    if (row) {
      const y = row.y;
      await d.tapAt(195, y);
      await new Promise(z => setTimeout(z, 1400));
      const s1 = await read();
      /* RULE 14(h): the panel must still be open AND its words must have moved. */
      ok('B2 *** the row is NOT dead: panel still open and its words moved ***',
         s1.open && s1.words !== s0.words && s1.shape === 'upfront');
      /* *** THE LEG THAT MATTERS. *** */
      const slid = s1.live.filter(r => Math.abs(r.y - y) <= NEAR);
      ok('B3 *** no pressable row slid onto the point he pressed *** -> '
         + (slid.map(r => r.act).join(', ') || 'none'), slid.length === 0);
      ok('B4 the card still shows the same number of rows (' + s0.drawn + ' -> ' + s1.drawn + ')',
         s1.drawn === s0.drawn);
      /* AND THE SHARPEST FORM OF THE SAME SENTENCE: a row a finger can still use has
         not moved. This is what actually fails when anything on the card collapses,
         and the first cut of this gate did not have it -- the display:none mutation
         walked straight past B3 and B4 because the geometry happened to land clear. */
      const drift = s1.live.map(r => { const o = at(s0, r.act); return o ? Math.abs(r.y - o.y) : 0; });
      const worst = drift.length ? Math.max.apply(null, drift) : 0;
      ok('B4b *** every row he can still press stayed where it was *** (worst move '
         + worst.toFixed(0) + ' px)', worst <= 8);
      /* the second press of a double tap must cost him nothing */
      await d.tapAt(195, y);
      await new Promise(z => setTimeout(z, 1400));
      const s2 = await read();
      ok('B5 *** a second tap in the same place spends nothing *** (asked '
         + s1.asked + ' -> ' + s2.asked + ')', s2.open && s2.asked === s1.asked);
      console.log('  terms after one press : shape=' + s1.shape + '  asked=' + s1.asked);
      console.log('  terms after the double: shape=' + s2.shape + '  asked=' + s2.asked);

      /* and taking the job is the one path that does not redraw */
      const yes = at(s2, 'take');
      ok('B6 the yes is still there to press', !!yes);
      if (yes) {
        const ty = yes.y;
        await d.tapAt(195, ty);
        await new Promise(z => setTimeout(z, 1400));
        const s3 = await read();
        ok('B7 taking the job takes it and says so',
           s3.taken === true && /took it/i.test(s3.words));
        const slid2 = s3.live.filter(r => Math.abs(r.y - ty) <= NEAR);
        ok('B8 *** nothing slid onto the yes he just pressed *** -> '
           + (slid2.map(r => r.act).join(', ') || 'none'), slid2.length === 0);
        ok('B9 and the card still shows the same number of rows ('
           + s0.drawn + ' -> ' + s3.drawn + ')', s3.drawn === s0.drawn);
        const drift2 = s3.live.map(r => { const o = at(s2, r.act); return o ? Math.abs(r.y - o.y) : 0; });
        const worst2 = drift2.length ? Math.max.apply(null, drift2) : 0;
        ok('B9b taking the job moved no row he can still press (worst '
           + worst2.toFixed(0) + ' px)', worst2 <= 8);
      }
    }
    ok('B10 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
  } catch (e) {
    ok('B harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  NOTHING MOVES UNDER HIS FINGER: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
