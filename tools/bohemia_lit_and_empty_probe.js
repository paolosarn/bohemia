/* BOHEMIA THE LIT STREET WITH NOBODY HOME (9/23/26, LIFE + CITY).

   DIRECTION's bible, rule 7, in its own words:
     "THE LIT STREET WITH NOBODY HOME. Occupancy wrongness is the cheapest dread we
      own: lights on where the census says empty, a crowd thin where it should be
      thick. DRAWN FROM WORLD DATA, NEVER FAKED.
      MEASURE: the wrongness traces to a real world-state row."

   Paolo voted this lane's 9/21 shop DOWN with "Not analog horror enough", and the
   post-mortem found I had PAINTED its one wrong thing. So before drawing anything
   this round, ask the world whether the wrongness is actually there:

     the circuit under a cell is LIVE      POWER.at(x,y).live
     and nobody lives on that block        BohemiaHousing.residentsAt(...).people === 0

   Two rows, both real, both already shipped by other lanes. If the count comes back
   zero then rule 7's dread does not exist in this valley yet and the honest thing is
   to say so instead of drawing it anyway.

   Run from repo root:  node tools/bohemia_lit_and_empty_probe.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'records', 'target', 'BOHEMIA_LIT_AND_EMPTY_9_23.json');

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ alpha: true });   /* THE TIP, not the baked file */
  console.log(d.says());

  const m = await d.fr.evaluate(() => {
    const H = window.BohemiaHousing;
    if (!H || !H.residentsAt) return { err: 'no housing module on the cut' };
    if (typeof POWER === 'undefined') return { err: 'no POWER on the cut' };
    const P = window.__proof;
    const FNv = P ? P.FN : 128;

    /* WALK THE OVERMAP, NOT THE FINE GRID. A lamp is queued per fine cell but the
       census answers per BLOCK, and asking a block question 16,384 times is asking
       the same question sixteen times over -- the unit error the housing module's
       own comment warns about in as many words. */
    let live = 0, dark = 0, litEmpty = 0, litLived = 0, darkEmpty = 0;
    const sample = [];
    let peopleSeen = 0;
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
      let t = null; try { t = om.at(x, y); } catch (e) { continue; }
      if (!t) continue;
      const isLampGround = /arterial/.test(String(t.district));
      if (!isLampGround) continue;
      let s = null; try { s = POWER.at(x, y); } catch (e) { continue; }
      if (!s) continue;
      if (s.live) live++; else { dark++; }
      let r = null; try { r = H.residentsAt(om, POWER, seed, EDITS, x, y); } catch (e) { r = null; }
      const people = r ? (r.people | 0) : -1;
      if (people >= 0) peopleSeen += people;
      if (s.live && people === 0) {
        litEmpty++;
        if (sample.length < 24) {
          let who = null; try { who = POWER.holderAt(x, y); } catch (e) {}
          sample.push({ at: [x, y], district: String(t.district), wire: who || null });
        }
      } else if (s.live && people > 0) litLived++;
      else if (!s.live && people === 0) darkEmpty++;
    }
    return { n: om.n, live, dark, litEmpty, litLived, darkEmpty, peopleSeen, sample };
  });

  await d.close();
  if (m.err) { console.log('PROBE: ' + m.err); process.exit(1); }

  console.log('');
  console.log('THE LIT STREET WITH NOBODY HOME, asked of the world (bible rule 7)');
  console.log('  overmap                          : ' + m.n + ' x ' + m.n);
  console.log('  lamp ground, circuit LIVE        : ' + m.live);
  console.log('  lamp ground, circuit dark        : ' + m.dark);
  console.log('  ---- the two rows crossed ----');
  console.log('  LIT, AND THE CENSUS SAYS EMPTY   : ' + m.litEmpty);
  console.log('  lit, and somebody lives there    : ' + m.litLived);
  console.log('  dark and empty (ordinary)        : ' + m.darkEmpty);
  console.log('  heads counted across lamp ground : ' + m.peopleSeen);
  for (const s of m.sample)
    console.log('      ' + s.at.join(',') + '  ' + s.district
      + '  wire: ' + (s.wire ? String(s.wire).toUpperCase() : 'nobody'));
  if (m.litEmpty === 0)
    console.log('  >>> RULE 7 HAS NOTHING TO DRAW FROM HERE YET. Say that, do not paint it.');

  /* WRITE IT DOWN SO A PICTURE CAN BE DRAWN FROM IT RATHER THAN FROM MEMORY.
     The 9/21 shop was voted down partly because its one wrong thing was PAINTED;
     the fix is that the factory reads a row somebody measured, and refuses to run
     without it. This is that row. */
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    what: 'blocks whose street circuit is LIVE and whose census says nobody lives there',
    law: 'DIRECTION analog horror bible rule 7, the lit street with nobody home',
    measuredOn: 'BOHEMIA_ALPHA_0_9.html', overmap: m.n,
    live: m.live, dark: m.dark, litEmpty: m.litEmpty, litLived: m.litLived,
    darkEmpty: m.darkEmpty, headsOnLampGround: m.peopleSeen,
    blocks: m.sample
  }, null, 1) + '\n');
  console.log('  wrote ' + path.relative(ROOT, OUT));
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
