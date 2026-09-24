/* BOHEMIA: THE AERIAL AT THREE DATES, MEASURED FIRST (9/24/26, LIFE + CITY,
   row [three cities], rule 31 + rule 32(b)).

   RULE 12: A DEPENDENCY ON A LINE IS A PREMISE, NOT A GATE. The row says "after
   DYNASTY [the derive]" and "waits for DYNASTY's school". Six rows in a row have
   shipped without the blocker the coordinator named, so this measures whether the
   blocker is real before anybody waits on it.

   AND RULE 32(b), PAOLO 9/23, REWRITES THE ROW'S OWN SENTENCE. The row says the same
   ground "built up OR FALLEN DOWN from the ledger". His ruling says the opposite of
   the second half: "the ruin is act 1's FLOOR, NEVER A FALL; act 2 and 3 are the ruin
   PLUS WHAT WAS RECLAIMED, techier and more modern; NOTHING DECAYS BELOW THE START."
   Newest date wins, so act 2 is not a decayed act 1 -- it is act 1 plus additions,
   and there is no "fallen down" case to draw at all.

   SO THE ONLY QUESTION IS: what does the game already carry that says WHAT WAS
   RECLAIMED? If the answer is "the player's own placed buildings", then act 2 is
   drawable today from EDITS and the derive is not a gate for the first page.

   Run from repo root:  node tools/bohemia_three_cities_probe.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'records', 'target', 'BOHEMIA_THREE_CITIES_9_24.json');

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ alpha: true });
  console.log(d.says());
  const m = await d.fr.evaluate(() => {
    const out = {};
    /* 1. IS THERE AN ACT AT ALL, and does anything read it? */
    out.actState = {};
    for (const n of ['ACT', 'DYNASTY', 'ERA', 'BohemiaDynasty', 'BohemiaDerive'])
      out.actState[n] = (typeof window[n]);
    try { out.actState.DAY_act = (typeof DAY !== 'undefined' && DAY.act !== undefined) ? DAY.act : 'no DAY.act'; } catch (e) {}

    /* 2. THE LEDGER OF WHAT WAS RECLAIMED: the player's own placed buildings. */
    let placed = [];
    try { placed = (window.BohemiaProduction && BohemiaProduction.placed)
            ? BohemiaProduction.placed(EDITS) || [] : []; } catch (e) { out.placedErr = String(e).slice(0, 80); }
    out.placedCount = placed.length;
    out.placedSample = placed.slice(0, 6).map(p => ({ type: p.type, at: [p.x, p.y], w: p.w, h: p.h }));
    try { out.editKeys = Object.keys(EDITS || {}).length; } catch (e) {}

    /* 3. AND WHAT THE CITY RENDERER ACTUALLY DRAWS FROM, so "draw whichever act he
          is in" has a real seam to hang on rather than a wish. */
    out.rendersFrom = {
      om: (typeof om !== 'undefined'),
      EDITS: (typeof EDITS !== 'undefined'),
      CE: (typeof CE !== 'undefined'),
      spanAt: (typeof CE !== 'undefined' && typeof CE.spanAt === 'function'),
      distAt: (typeof CBdistAt === 'function')
    };
    /* 4. HOW MUCH GROUND IS BUILDABLE AT ALL -- the room act 2 has to grow into. */
    let desert = 0, built = 0, skeleton = 0;
    try {
      for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
        const dd = CBdistAt(x, y);
        if (dd === 'desert') desert++;
        else if (CE.isSkeleton(dd)) skeleton++;
        else built++;
      }
    } catch (e) { out.sweepErr = String(e).slice(0, 80); }
    out.ground = { desert, built, skeleton, total: desert + built + skeleton };
    return out;
  });
  await d.close();
  console.log('');
  console.log('THE AERIAL AT THREE DATES, asked of the game');
  console.log('  is there an ACT in the world : ' + JSON.stringify(m.actState));
  console.log('  the ledger of what was built : ' + m.placedCount + ' placed buildings, '
    + m.editKeys + ' edit keys');
  if (m.placedSample && m.placedSample.length)
    for (const p of m.placedSample) console.log('      ' + p.type + ' at ' + p.at.join(','));
  console.log('  what the city renderer reads : ' + JSON.stringify(m.rendersFrom));
  console.log('  the ground, 96x96            : ' + JSON.stringify(m.ground));
  console.log('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(Object.assign({
    what: 'what the game already carries for drawing the aerial at three dates',
    law: 'rule 31 + rule 32(b): the ruin is act 1 FLOOR, never a fall; act 2 and 3 are the ruin PLUS what was reclaimed',
    measuredOn: 'BOHEMIA_ALPHA_0_9.html'
  }, m), null, 1) + '\n');
  console.log('  wrote ' + path.relative(ROOT, OUT));
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
