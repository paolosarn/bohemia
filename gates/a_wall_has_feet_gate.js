/* ============================================================================
   A WALL HAS FEET (9/13/26, LIFE + CITY lane)
   VAMILY row [base shadows] A-WALL-WITH-NO-BASE-SHADOW-FLOATS.

   DIRECTION [streets read] judged the demo's spawn street at phone size and routed
   item 4 of the verdict here (records/BOHEMIA_VERDICT_THE_STREETS_9_13_26.md):

       "THE WALL WITH NO FEET. It cuts across with no base shadow, so it reads as a
        TEXTURE CHANGE instead of a standing thing. -> LIFE+CITY layering: standing
        structures carry a 1-2px ground shadow at their base line, always."

   THE CAST SHADOW WAS ALREADY THERE AND IS NOT THIS, measured at the spawn before a
   line was written: 48 shadow rects drawn, 33 solid cells on screen. The pass works.
   But a CAST shadow is thrown by the sun and lands a whole cell away -- at 06:00 the
   sun vector is (-0.50, 0.86), so the first rect is half a cell left and most of a
   cell down, and nothing touches the foot. That gap between the wall's bottom edge
   and where its shadow starts is what makes the brick band read as a stripe of paint.

   A CONTACT SHADOW IS NOT A CAST SHADOW: it is the light that cannot get into the
   join, so it does not move with the sun and does not stop at night. That is why the
   verdict says ALWAYS, and it is the leg below that would catch anyone "simplifying"
   it back into the sun's pass.

   MEASURED AFTER: 6 contact rects on the spawn screen at 2px, and 6 still drawn at
   two in the morning with sunVec() returning null.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('A WALL HAS FEET — the contact shadow, and it is not the sun\'s');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. IT RUNS BEFORE THE SUN IS ASKED. The whole point of the verdict's "always". */
ok('A1 the feet go down BEFORE sunVec() is consulted, so a contact shadow is not a '
   + 'thing the sun grants and the night still has corners',
   /contactPass\(ox,oy,C\);\s*\n\s*const S=sunVec\(\); if\(!S\)return 0;/.test(CITY));

/* A2. ONLY AT THE BASE LINE. A solid cell with solid below it is mid-wall; shading it
   would draw a line across the brickwork rather than under the building. */
ok('A2 only a cell whose ground below is OPEN gets a foot, so the line lands under the '
   + 'wall and never across the middle of it',
   /const below=cellAt\(gx,gy\+1\); if\(below&&below\.s\)continue;/.test(CITY));

/* A3. THE SIZE IS THE VERDICT'S, EXPRESSED AGAINST THE CELL rather than typed twice. */
ok('A3 the shadow is 1-2px at walk zoom, derived from the cell size instead of a number '
   + 'typed in two places',
   /CONTACT_OF_C=0\.05/.test(CITY)
   && /const h=Math\.max\(1,Math\.round\(C\*CONTACT_OF_C\)\);/.test(CITY));

/* A4. ONE FLAT VALUE. The line above SHADOW_A says "one flat value. NO DITHER, NO
   GRADIENT"; a contact shadow with its own dial would be the first crack in it. */
ok('A4 it reuses SHADOW_A rather than inventing a second alpha, which is the "one flat '
   + 'value, no dither, no gradient" rule this file already carries',
   /window\.__CONTACT_RECTS=n;/.test(CITY)
   && /g\.fillStyle='rgba\(0,0,0,'\+SHADOW_A\+'\)';[\s\S]{0,80}window\.__CONTACT_RECTS/.test(CITY));

(async () => {
  let d = null;
  try {
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const o = {};
      o.hzoom = HZOOM;
      o.h = Math.max(1, Math.round(HZOOM * CONTACT_OF_C));
      o.day = window.__CONTACT_RECTS;
      o.dayShadow = window.__SHADOW_RECTS;
      /* how many feet OUGHT to be on screen, counted here rather than trusting the
         pass's own number -- the gate does the walk itself */
      let want = 0;
      const C = HZOOM;
      const gx = Math.floor(hx), gy = Math.floor(hy);
      const half = Math.ceil(innerWidth / C) + 2, tall = Math.ceil(innerHeight / C) + 2;
      for (let y = gy - tall; y <= gy + tall; y++) for (let x = gx - half; x <= gx + half; x++) {
        const c = cellAt(x, y); if (!c || !c.s) continue;
        const b = cellAt(x, y + 1); if (b && b.s) continue;
        want++;
      }
      o.baseLinesNear = want;
      /* AND AT NIGHT, which is the leg the verdict's "always" is really about */
      const was = T.min;
      T.min = 2 * 60;
      try { render(); } catch (e) { o.err = String(e).slice(0, 100); }
      o.night = window.__CONTACT_RECTS;
      o.nightSun = (typeof sunVec === 'function') ? sunVec() : '?';
      o.nightShadow = window.__SHADOW_RECTS;
      T.min = was; try { render(); } catch (e) {}
      return o;
    });

    /* B1. *** THE THING THE ROW IS FOR. *** */
    ok('B1 *** THE WALL HAS FEET *** — ' + m.day + ' contact shadows drawn on the spawn '
       + 'screen, at ' + m.h + 'px. Before this round the count was zero and the brick band '
       + 'cut across the frame with nothing under it',
       !m.err && m.day > 0);

    /* B2. AND IT IS THE VERDICT'S SIZE, ON THE REAL SURFACE, not just in the source. */
    ok('B2 and it measures 1-2px at the walk zoom of ' + m.hzoom + ' (' + m.h + 'px), '
       + 'which is the size the verdict asked for',
       !m.err && m.h >= 1 && m.h <= 2);

    /* B3. *** ALWAYS. *** The cast shadow stops at night; the feet do not. This is the
       leg that catches anyone folding the contact pass back into the sun's. */
    ok('B3 *** THE FEET STAY AT NIGHT *** — ' + m.night + ' contact shadows at two in the '
       + 'morning with sunVec() returning ' + JSON.stringify(m.nightSun) + '. A thing '
       + 'standing on the ground meets the ground whether or not the sun is up',
       !m.err && m.night > 0 && m.nightSun === null);

    /* B4. AND IT IS NOT PAINTING EVERY SOLID CELL. A pass that shaded the whole wall
       would score well on B1 and look like mud. */
    ok('B4 it draws feet, not a coat of paint — ' + m.day + ' drawn against '
       + m.baseLinesNear + ' base lines in the neighbourhood, so it is following the '
       + 'ground line rather than filling every solid cell',
       !m.err && m.day > 0 && m.day <= m.baseLinesNear);

    ok('B5 nothing threw' + (m.err ? ' -> ' + m.err : '')
       + (d.errs.length ? ' -> ' + d.errs[0] : ''),
       !m.err && d.errs.length === 0);

    console.log('  MEASURED ON THE DEMO, DRIVEN LIKE A PLAYER:');
    console.log('    contact shadows, day   : ' + m.day + '   at ' + m.h + 'px (walk zoom ' + m.hzoom + ')');
    console.log('    contact shadows, night : ' + m.night + '   and the sun is ' + JSON.stringify(m.nightSun));
    console.log('    cast shadows for scale : ' + m.dayShadow + ' day, ' + m.nightShadow + ' night');
    console.log('    base lines nearby      : ' + m.baseLinesNear);
  } catch (e) {
    ok('harness ran: ' + e.message, false);
  }
  if (d) await d.close();

  console.log('='.repeat(74));
  console.log('  A WALL HAS FEET: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
