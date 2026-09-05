/* WHAT NOBODY WEARS (9/5/26, CHARACTER lane, [clothes wired] WIRE-THE-REMAKE)
 *
 * THE JOB: "as ART batches pass DIRECTION, wire them into the picker and the wardrobe
 * data; ART makes pixels, CHARACTER makes them worn."
 *
 * COOK's WARDROBE-REMAKE has not been cooked yet and DIRECTION's style card does not
 * exist, so there is no new batch to wire today. The half of this job that CAN be done
 * now is the half that matters most: FIND WHAT IS ALREADY COOKED AND ALREADY UNWORN,
 * because that is this lane's most expensive recurring failure --
 *     the seventeen invisible hats
 *     the four bright garments, three worn by nobody for five weeks (7/21 -> 8/26)
 *     the VOTE tab that held no faces for three weeks
 *     the face maker shipped into a tab the demo deletes (8/28 -> 8/30)
 * THE MATERIAL EXISTED AND NEVER REACHED THE PLAYER, four times in six weeks.
 *
 * WHAT IT CHECKS, and the first one is structural rather than statistical:
 *   1. EVERY CANON LAYER HAS ODDS. engine/bohemia_personlook.js says
 *      `if (odds === undefined) continue;` -- an unknown category is SILENTLY SKIPPED,
 *      so a garment cooked into a layer nobody added to WEAR_ODDS is canon, shipped,
 *      and unwearable forever, with no error anywhere.
 *   2. EVERY CANON GARMENT ACTUALLY APPEARS on somebody, over a large population.
 *      A garment can sit in a covered layer and still never be picked.
 *   3. THE RESERVED ONES ARE RARE, NOT ABSENT. `hard:true` garments (the 8/27 trenchcoat
 *      cap) are meant to be held back from nine strangers in ten -- held back, not
 *      deleted -- so they are reported separately and are allowed to be rare.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: BOH_PERSONLOOK.lookFor + GARMENTS (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It asks the game's own picker, which is the
 * point -- a number here is a number about what the game actually puts on people.
 * Looked at tools/bohemia_do_they_look_related.js (the 8/31 measure-with-a-control
 * shape, reused) and engine/bohemia_personlook.js (the picker it interrogates).
 *
 *   node tools/bohemia_what_nobody_wears.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_WHAT_NOBODY_WEARS_9_5_26.txt');
const N = 4000;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => window.GARMENTS && window.BOH_PERSONLOOK, { timeout: 40000 });

  const r = await p.evaluate((N) => {
    const canon = (window.GARMENTS || []).filter(g => g && g.st === 'canon' && g.layer);
    const byLayer = {};
    for (const g of canon) (byLayer[g.layer] = byLayer[g.layer] || []).push(g);

    /* THE ODDS TABLE, READ OFF THE PICKER RATHER THAN COPIED. A second copy of a
       table is how two things that must agree stop agreeing (8/27). */
    const odds = (BOH_PERSONLOOK && BOH_PERSONLOOK.WEAR_ODDS) || null;

    /* ASK THE REAL PICKER, N TIMES. */
    const seen = {};
    for (let i = 0; i < N; i++) {
      const look = BOH_PERSONLOOK.lookFor('crowd:' + i, window.GARMENTS);
      const worn = (look && look.worn) || {};
      for (const slot in worn) if (worn[slot]) seen[worn[slot]] = (seen[worn[slot]] || 0) + 1;
    }

    const rows = canon.map(g => ({
      n: g.n, layer: g.layer, hard: !!g.hard,
      worn: seen[g.n] || 0, pct: (seen[g.n] || 0) / N
    })).sort((a, c) => a.layer < c.layer ? -1 : a.layer > c.layer ? 1 : (a.worn - c.worn));

    const layers = Object.keys(byLayer).sort().map(L => ({
      layer: L, count: byLayer[L].length,
      hasOdds: !!(odds && odds[L] !== undefined),
      odds: odds && odds[L] !== undefined ? odds[L] : null,
      everWorn: byLayer[L].filter(g => seen[g.n]).length
    }));

    return { total: canon.length, rows, layers, oddsReadable: !!odds, N };
  }, N);

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const dead = r.rows.filter(x => x.worn === 0 && !x.hard);
  const deadHard = r.rows.filter(x => x.worn === 0 && x.hard);
  const noOdds = r.layers.filter(l => !l.hasOdds);

  const L = [];
  L.push('WHAT NOBODY WEARS -- every canon garment, against the picker that dresses the city');
  L.push('9/5/26, CHARACTER lane. [clothes wired] WIRE-THE-REMAKE.');
  L.push('');
  L.push('Asked BOH_PERSONLOOK.lookFor for ' + r.N + ' citizens and counted what came back.');
  L.push('');
  L.push('LAYERS  (a layer with no odds is SILENTLY SKIPPED by the picker:');
  L.push('         engine/bohemia_personlook.js, "if (odds === undefined) continue")');
  L.push('');
  L.push('  layer        canon   odds     ever worn');
  for (const l of r.layers)
    L.push('  ' + l.layer.padEnd(12) + String(l.count).padStart(4) + '   ' +
      (l.hasOdds ? String(l.odds).padEnd(7) : 'NONE   ') + '  ' +
      String(l.everWorn) + ' of ' + l.count + (l.hasOdds ? '' : '   <-- UNREACHABLE'));
  L.push('');
  L.push('TOTALS');
  L.push('  canon garments                 ' + r.total);
  L.push('  layers with no odds at all     ' + noOdds.length +
    (noOdds.length ? '  (' + noOdds.map(l => l.layer).join(', ') + ')' : ''));
  L.push('  cooked, canon, worn by NOBODY  ' + dead.length);
  L.push('  reserved (hard) and unworn     ' + deadHard.length + '  (allowed to be rare)');
  L.push('');
  if (dead.length) {
    L.push('THE ONES NOBODY WEARS');
    L.push('');
    for (const x of dead) L.push('  ' + x.layer.padEnd(10) + x.n);
    L.push('');
  }
  L.push('THE RAREST TWENTY THAT ARE WORN, for scale');
  L.push('');
  for (const x of r.rows.filter(v => v.worn > 0).sort((a, c) => a.worn - c.worn).slice(0, 20))
    L.push('  ' + x.layer.padEnd(10) + x.n.padEnd(26) + String(x.worn).padStart(5) +
      '  ' + (x.pct * 100).toFixed(2) + '%' + (x.hard ? '   (reserved)' : ''));
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
