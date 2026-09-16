#!/usr/bin/env node
/* SHAPE FROZEN GATE (9/16/26, CHARACTER lane, VAMILY [shape frozen])
 *
 * THE LAW: STRUCTURE-NOT-COLOR (7/19). The ramp may move; the shape may not.
 * THE ROW (coordinator 9/13): the silhouette hasher "is the best instrument this lane has
 * and IT RUNS ONLY WHEN SOMEBODY REMEMBERS. Make it a registered gate: any colour or ramp
 * change that moves a silhouette is red unless the baseline is re-baked in the same commit
 * with a record saying why."
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is the machine. Three times in the
 * last week this lane leaned on STRUCTURE-NOT-COLOR over the wardrobe and each time it held
 * because a person chose to run a script: a count=1 replace that stripped the Anarchists'
 * duster (caught), a colour rewire (proven clean), and last round's COPPER -> PATINA rename
 * which I claimed "moves zero pixels by construction" AND COULD NOT HAVE PROVEN.
 *
 * WHAT IT COMPARES: the OPAQUE MASK of every canon garment, and of the 13 faction outfits,
 * against records/BOHEMIA_SHAPE_BASELINE.json. Colour is thrown away entirely, so a ramp
 * change is invisible here and a shape change cannot hide behind one. The instrument is
 * blind to exactly the half the law permits, which is why it will not be switched off.
 *
 * THE SCOPE IS PER GARMENT, NOT THE THIRTEEN THE ROW NAMED (rule 12: a premise, not a
 * gate). A faction outfit is four or five garments worn together; the thing a ramp change
 * touches is a GARMENT, and there are 318. Freezing only the combinations leaves every
 * garment no faction wears unguarded and cannot say WHICH garment moved.
 *
 * AND IT POLICES THE ESCAPE HATCH, which is the half a gate like this usually forgets. The
 * baseline is allowed to move -- shapes do change -- but only loudly:
 *   the baseline must carry a non-empty REASON, and
 *   the RECORD it names must exist on disk.
 * Otherwise a lane fixes a red by re-baking in silence and the gate has taught it to lie.
 * The baker refuses too, so both doors are shut rather than one.
 *
 *   python3 -m http.server 8231 &   (not needed: this reads the alpha over file://)
 *   node gates/shape_frozen_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const BASE = path.join(REPO, 'records/BOHEMIA_SHAPE_BASELINE.json');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== SHAPE FROZEN: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  ok('there is a frozen baseline at all', fs.existsSync(BASE));
  if (!fs.existsSync(BASE)) done();
  let B = null;
  try { B = JSON.parse(fs.readFileSync(BASE, 'utf8')); } catch (e) {}
  ok('and it parses', !!B && !!B.garments);
  if (!B || !B.garments) done();

  /* THE ESCAPE HATCH, POLICED. A baseline may move; it may not move quietly. */
  ok('*** THE BASELINE SAYS WHY IT IS WHAT IT IS *** -- a re-bake with no reason is how a '
     + 'red gets fixed in silence ("' + String(B.why || '').slice(0, 60) + '")',
     !!B.why && String(B.why).trim().length >= 12);
  ok('and the record it names is on disk (' + (B.record || 'none') + ')',
     !!B.record && fs.existsSync(path.join(REPO, B.record)));
  ok('and it is baked by the one tool, which refuses without both',
     /bohemia_freeze_the_silhouettes/.test(String(B.note || '')));

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate(() => {
    const o = { garments: {}, outfits: {}, err: [], canon: 0 };
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    /* THE SAME HASH THE BAKER TAKES, and it has to be: two spellings of one hash is a gate
       that goes red on the day somebody edits one of them. Alpha only, colour never. */
    const maskOf = (fr) => {
      let h = 2166136261 >>> 0, n = 0;
      for (let i = 0; i < fr.px.length; i++) {
        if (!fr.px[i]) continue;
        n++; h ^= i; h = Math.imul(h, 16777619) >>> 0;
      }
      return { hash: (h >>> 0).toString(16), px: n };
    };
    const shot = (worn) => {
      G.equipped = bare(); window.G_WORN = worn; clear();
      try { return maskOf(buildFrame('S', 'idle', 0)); } catch (e) { return null; }
    };
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    o.canon = canon.length;
    for (const gm of canon) {
      const w = {}; w[gm.layer] = gm.n;
      const m = shot(w);
      if (!m) { o.err.push(gm.n); continue; }
      o.garments[gm.n] = [m.hash, m.px, gm.layer];
    }
    try {
      const FL = window.FACTION_LOOKS || [];
      for (const f of FL) {
        const w = {}, src = f.worn || f;
        for (const k of ['hair', 'base', 'outer', 'legs', 'feet', 'head', 'neck', 'waist', 'gear', 'back'])
          if (src[k]) w[k] = src[k];
        const m = shot(w);
        if (m) o.outfits[f.faction] = [m.hash, m.px];
      }
    } catch (e) { o.err.push('faction looks'); }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  });
  await b.close();

  ok('*** THE WARDROBE RENDERED AT ALL *** -- every number below is meaningless over an '
     + 'empty rail (' + R.canon + ' canon garments)', R.canon > 250);
  ok('and every one of them rendered, because a garment that will not draw is not a pass ('
     + R.err.length + ' did not' + (R.err.length ? ': ' + R.err.slice(0, 4).join(', ') : '') + ')',
     R.err.length === 0);

  /* THE COMPARISON, BOTH WAYS. */
  const moved = [], gone = [], added = [];
  for (const n in B.garments) {
    const was = B.garments[n], now = R.garments[n];
    if (!now) { gone.push(n); continue; }
    if (was[0] !== now[0]) moved.push(n + ' (' + was[1] + ' px -> ' + now[1] + ')');
  }
  for (const n in R.garments) if (!B.garments[n]) added.push(n);

  ok('*** NO GARMENT SILHOUETTE MOVED *** -- STRUCTURE-NOT-COLOR: the ramp may move, the '
     + 'shape may not (' + moved.length + ' of ' + Object.keys(B.garments).length + ' moved'
     + (moved.length ? ': ' + moved.slice(0, 6).join(', ') : '') + ')',
     moved.length === 0);
  /* A RENAME IS A SHAPE LEAVING THE BASELINE UNDER ITS OLD KEY AND ARRIVING UNDER A NEW
     ONE. It is legal and it happened last round, but it has to be declared by re-baking,
     not absorbed silently -- otherwise "renamed" is the cover story for "deleted". */
  ok('and no frozen garment vanished from the rail (' + gone.length + ' gone'
     + (gone.length ? ': ' + gone.slice(0, 6).join(', ') : '') + ')', gone.length === 0);
  ok('and no garment is on the rail unfrozen -- a new shape nobody froze is a shape nobody '
     + 'is guarding (' + added.length + ' unfrozen'
     + (added.length ? ': ' + added.slice(0, 6).join(', ') : '') + ')', added.length === 0);

  const oMoved = [];
  for (const f in (B.outfits || {})) {
    const was = B.outfits[f], now = R.outfits[f];
    if (!now) { oMoved.push(f + ' (gone)'); continue; }
    if (was[0] !== now[0]) oMoved.push(f + ' (' + was[1] + ' px -> ' + now[1] + ')');
  }
  /* *** THE VACUOUS-PASS GUARD, AND THE MUTATION PUT IT HERE. *** The first cut of this
     gate read the outfit off the faction record one level too high -- the garments live
     under `worn`, not on the record itself -- so all thirteen "outfits" were the SAME BARE
     BODY. Stripping the Anarchists' duster, which is the exact defect this row was opened
     about, changed nothing and the gate stayed green. Thirteen identical hashes is not a
     wardrobe; if they are not distinct, the gate is measuring nothing and says so. */
  const oHashes = Object.keys(R.outfits).map(f => R.outfits[f][0]);
  const oDistinct = new Set(oHashes).size;
  ok('*** THE THIRTEEN OUTFITS ARE THIRTEEN DIFFERENT BODIES *** -- the first cut read them '
     + 'one level too high and froze thirteen copies of a naked man, which is a green over '
     + 'nothing (' + oDistinct + ' distinct of ' + oHashes.length + ')',
     oHashes.length >= 10 && oDistinct >= oHashes.length - 1);
  ok('*** AND NO FACTION OUTFIT MOVED *** -- the thirteen the row named, which are what the '
     + 'street actually wears and can break in ways their parts do not (' + oMoved.length
     + ' of ' + Object.keys(B.outfits || {}).length + ' moved'
     + (oMoved.length ? ': ' + oMoved.slice(0, 5).join(', ') : '') + ')',
     oMoved.length === 0);

  if (errs.length) console.log('  note: page errors -- ' + errs.slice(0, 2).join(' | '));
  console.log('\n  ' + Object.keys(B.garments).length + ' garment silhouettes and '
    + Object.keys(B.outfits || {}).length + ' outfits frozen, baked ' + (B.baked || '?'));
  done();
})();
