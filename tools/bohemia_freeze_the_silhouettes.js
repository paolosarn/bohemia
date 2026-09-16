/* FREEZE THE SILHOUETTES (9/16/26, CHARACTER lane, VAMILY [shape frozen])
 *
 * THE ROW: "r2 proved 'no silhouette moved' by hashing all 13 faction silhouettes with
 * colour discarded against a baseline, and that hasher is what caught a count=1 replace
 * stripping the Anarchists' duster. It is the best instrument this lane has and IT RUNS
 * ONLY WHEN SOMEBODY REMEMBERS. Make it a registered gate."
 *
 * THIS IS THE BAKER. gates/shape_frozen_gate.js is the check. Running this by hand is the
 * ONLY way the baseline ever moves, and the gate refuses a baseline that does not say why.
 *
 * *** THE ROW SAYS THIRTEEN FACTION SILHOUETTES AND THAT IS NOT THE SURFACE (rule 12). ***
 * A faction outfit is four or five garments worn together. The thing a colour or ramp
 * change actually touches is A GARMENT, and there are 318 canon ones. Freezing only the
 * thirteen combinations leaves every garment that no faction happens to wear unguarded,
 * and it cannot tell you WHICH garment moved when a combination changes. So the baseline is
 * taken per GARMENT, and the thirteen outfits are kept as well because they are what the
 * street actually wears.
 * LAST ROUND IS THE ARGUMENT FOR THIS ROW: I renamed four garments and wrote that "a rename
 * moves zero pixels, by construction". That was true and I could not have PROVEN it. The
 * next colour repair will not be a rename.
 *
 * WHAT IS HASHED: THE OPAQUE MASK, AND NOTHING ELSE. Every pixel with alpha at or over 128
 * becomes a 1 and colour is thrown away entirely, so a ramp change is INVISIBLE to this and
 * a shape change cannot hide behind one. That is the whole point: STRUCTURE-NOT-COLOR says
 * the ramp may move and the shape may not, so the instrument has to be blind to exactly the
 * half that is allowed to change.
 *
 * AND IT RECORDS THE PIXEL COUNT BESIDE THE HASH, because a hash alone says "different" and
 * nothing else. The count says how much moved, which is the difference between a one-pixel
 * nudge and a garment that lost its duster.
 *
 * RIG CHECK (RIG IS LAW): reads only; restores G_WORN, G.equipped and the caches it clears.
 * REUSE CHECK: cooks nothing. The renderer and the bare-body diff are last round's.
 *
 *   node tools/bohemia_freeze_the_silhouettes.js "why the shapes moved" records/THE_RECORD.md
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_SHAPE_BASELINE.json');

const WHY = process.argv[2] || '';
const RECORD = process.argv[3] || '';

(async () => {
  if (!WHY || !RECORD) {
    console.error('REFUSING TO BAKE WITHOUT A REASON.\n'
      + '  node tools/bohemia_freeze_the_silhouettes.js "<why the shapes moved>" <records/FILE.md>\n'
      + 'The gate rejects a baseline with an empty reason or a record that is not on disk,\n'
      + 'so baking one here would only move the failure later. The row\'s own words: red\n'
      + '"unless the baseline is re-baked in the same commit with a record saying why".');
    process.exit(2);
  }
  if (!fs.existsSync(path.join(REPO, RECORD))) {
    console.error('THE RECORD DOES NOT EXIST: ' + RECORD + '\nWrite it first, then bake.');
    process.exit(2);
  }

  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate(() => {
    const o = { garments: {}, outfits: {}, err: [], stable: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    /* THE MASK HASH. Alpha only; colour never enters. FNV-1a over the indices that are
       opaque, so two sprites with the same shape in different colours hash the same and a
       shape that moves by one pixel does not. */
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
    for (const gm of canon) {
      const w = {}; w[gm.layer] = gm.n;
      const m = shot(w);
      if (!m) { o.err.push(gm.n); continue; }
      o.garments[gm.n] = [m.hash, m.px, gm.layer];
    }
    /* AND THE THIRTEEN THE ROW NAMED, which are what the street actually wears. */
    try {
      const FL = window.FACTION_LOOKS || [];
      for (const f of FL) {
        const w = {}, src = f.worn || f;
        for (const k of ['hair', 'base', 'outer', 'legs', 'feet', 'head', 'neck', 'waist', 'gear', 'back'])
          if (src[k]) w[k] = src[k];
        const m = shot(w);
        if (m) o.outfits[f.faction] = [m.hash, m.px];
      }
    } catch (e) { o.err.push('faction looks: ' + e); }
    /* *** IS THE HASH EVEN STABLE? ASKED, NOT ASSUMED. *** A baseline built on a number that
       wobbles between renders is a gate that cries wolf, and this lane has published two
       instruments this week whose answer changed with the arithmetic. The first garment is
       re-shot after the whole sweep, with every cache cleared in between. */
    if (canon.length) {
      const first = canon[0], w = {}; w[first.layer] = first.n;
      const again = shot(w);
      o.stable = !!(again && o.garments[first.n] && again.hash === o.garments[first.n][0]
                    && again.px === o.garments[first.n][1]);
      o.stableOf = first.n;
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  if (!R.stable) {
    console.error('REFUSING TO BAKE: the hash is not stable across renders (' + R.stableOf + ').\n'
      + 'A baseline on a wobbling number is a gate that cries wolf. Fix the instrument first.');
    process.exit(3);
  }
  const out = {
    why: WHY,
    record: RECORD,
    baked: new Date().toISOString().slice(0, 10),
    note: 'THE OPAQUE MASK ONLY. Colour is thrown away, so a ramp change is invisible here '
        + 'and a shape change cannot hide behind one. Re-bake only with '
        + 'tools/bohemia_freeze_the_silhouettes.js, which refuses without a reason and a record.',
    garments: R.garments,
    outfits: R.outfits
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('FROZE ' + Object.keys(R.garments).length + ' garment silhouettes and '
    + Object.keys(R.outfits).length + ' faction outfits');
  console.log('  hash stable across renders: yes (' + R.stableOf + ')');
  if (R.err.length) console.log('  did not render: ' + R.err.length + ' -- ' + R.err.slice(0, 4).join(', '));
  console.log('  why:    ' + WHY);
  console.log('  record: ' + RECORD);
  console.log('  wrote ' + path.relative(REPO, OUT));
})();
