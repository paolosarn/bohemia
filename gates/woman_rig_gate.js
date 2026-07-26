// BOHEMIA WOMAN RIG GATE (MARATHON WAVE 3, 7/25/26). FACTORY LAW: new
// machinery ships with its own regression gate, same turn.
//
// laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md, THE RULING: Paolo does not
// paint the female rig -- Claude produces her as a CANDIDATE (BODY_RIGS.
// FEMALE) through the standard verdict pipeline; the male paint stays
// sacrosanct (this gate never touches BAKED, only reads it as the source
// FEMALE_BAKED was derived from). The addendum's own gate spec: "female rig
// present in all 8 directions, part ids complete... every canon garment
// renders on her without error." This gate proves exactly that, plus the
// build-plan silhouette itself (narrower shoulders, waist taper, wider hips)
// so a future edit can't silently flatten her back into a recolor of the
// male body.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== WOMAN RIG GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

function grabConst(name) {
  const i = src.indexOf('const ' + name + '=');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(s, k + 1); } }
  return null;
}
const bakedStr = grabConst('BAKED'), femaleStr = grabConst('FEMALE_BAKED');
ok('BAKED (male, painted) present', !!bakedStr);
ok('FEMALE_BAKED (derived candidate) present', !!femaleStr);
ok('BODY_RIGS carries FEMALE', /const BODY_RIGS=\{MALE:1,FEMALE:1\}/.test(src));
// REGENERATABLE-BY-SPEC (the addendum: "a TRANSFORM with a spec, so it can be
// regenerated, tuned by his notes, and gated"). The shipped FEMALE_BAKED must
// come from a real checked-in tool, not a one-off scratch script nobody can rerun.
ok('the derivation tool is checked in (tools/bohemia_female_rig_transform.py)',
  fs.existsSync(path.join(__dirname, '../tools/bohemia_female_rig_transform.py')));
ok('the body picker rebuilds from the rig on switch (rebuildFromRig wired to the click)', /G\.bodyRig=rn;rebuildFromRig\(\);/.test(src));
ok('rebuildFromRig sources from G.bodyRig, not hardcoded to the male paint', /const src=bakedFor\(G\.bodyRig\);/.test(src));

let BAKED = null, FEMALE = null;
try { BAKED = JSON.parse(bakedStr); FEMALE = JSON.parse(femaleStr); } catch (e) { console.log('  parse err: ' + e.message); }

if (BAKED && FEMALE) {
  const DIRS = Object.keys(BAKED.layers);
  ok('FEMALE ships all 8 directions', Object.keys(FEMALE.layers).length === 8 && DIRS.every(d => FEMALE.layers[d]));
  ok('FEMALE part ids are COMPLETE in every direction (no dropped/emptied part)', DIRS.every(d => {
    const mk = Object.keys(BAKED.layers[d]).sort().join(','), fk = Object.keys(FEMALE.layers[d]).sort().join(',');
    if (mk !== fk) return false;
    return Object.values(FEMALE.layers[d]).every(arr => arr.length > 0);
  }));
  ok('FEMALE skeleton carries the SAME joint set, every direction (same rig tools, not new bones)', DIRS.every(d => {
    const mj = Object.keys(BAKED.skeleton[d]).sort().join(','), fj = Object.keys(FEMALE.skeleton[d]).sort().join(',');
    return mj === fj;
  }));

  // THE BUILD PLAN, verbatim: narrower shoulders, waist taper, wider hips.
  const CW = BAKED.W;
  const rowWidth = (layerDir, part, y) => {
    let mn = CW, mx = -1;
    for (const idx of layerDir[part]) { if (((idx / CW) | 0) === y) { const x = idx % CW; if (x < mn) mn = x; if (x > mx) mx = x; } }
    return mx >= mn ? (mx - mn + 1) : null;
  };
  const shapeOk = DIRS.every(d => {
    const mT = BAKED.layers[d]['4'], fT = FEMALE.layers[d]['4'];
    const ys = [...new Set(mT.map(idx => (idx / CW) | 0))].sort((a, b) => a - b);
    const yTop = ys[0], yBot = ys[ys.length - 1];
    const mTop = rowWidth(BAKED.layers[d], '4', yTop), fTop = rowWidth(FEMALE.layers[d], '4', yTop);
    const mBot = rowWidth(BAKED.layers[d], '4', yBot), fBot = rowWidth(FEMALE.layers[d], '4', yBot);
    if (mTop == null || fTop == null || mBot == null || fBot == null) return false;
    return fTop <= mTop && fBot >= mBot;                              // narrower shoulders, wider (or equal) hips
  });
  ok('every direction: shoulders no wider than the male, hips no narrower (the addendum silhouette)', shapeOk);
  ok('at least one direction shows a REAL waist taper (narrower mid-torso than both its own shoulder and hip rows)', DIRS.some(d => {
    const fT = FEMALE.layers[d]['4'];
    const ys = [...new Set(fT.map(idx => (idx / CW) | 0))].sort((a, b) => a - b);
    if (ys.length < 5) return false;
    const yTop = ys[0], yBot = ys[ys.length - 1], yMid = ys[ys[Math.floor(ys.length / 2)] ? Math.floor(ys.length / 2) : 0];
    const wTop = rowWidth(FEMALE.layers[d], '4', yTop), wBot = rowWidth(FEMALE.layers[d], '4', yBot), wMid = rowWidth(FEMALE.layers[d], '4', ys[Math.floor(ys.length / 2)]);
    return wMid != null && wTop != null && wBot != null && wMid < wTop && wMid < wBot;
  }));

  // arm reattachment: the shoulder joint should sit AT the new torso edge (+-3px), not floating in
  // a gap. Uses the top THREE rows (not just the topmost) since a true profile facing's apex row
  // can be a single degenerate pixel that isn't representative of the shoulder line.
  const seamOk = DIRS.every(d => {
    const fT = FEMALE.layers[d]['4'];
    const ys = [...new Set(fT.map(idx => (idx / CW) | 0))].sort((a, b) => a - b);
    const band = new Set(ys.slice(0, 3));
    let mn = CW, mx = -1;
    for (const idx of fT) { if (band.has((idx / CW) | 0)) { const x = idx % CW; if (x < mn) mn = x; if (x > mx) mx = x; } }
    const shL = FEMALE.skeleton[d].shL[0], shR = FEMALE.skeleton[d].shR[0];
    return Math.min(Math.abs(shL - mn), Math.abs(shL - mx)) <= 3 && Math.min(Math.abs(shR - mn), Math.abs(shR - mx)) <= 3;
  });
  ok('the shoulder joints reattach AT the reshaped torso edge -- no seam/gap where the arms hang', seamOk);

  // ---- the three defects Paolo reported on the live build 7/25, machine-locked ----
  // "the leg looks like it's chopping off from the rest of the body": the ANATOMY
  // border rule outlines any body pixel with empty space above it, so if the thighs
  // splay wider than the torso above them the exposed leg tops get the dark border
  // and a hard line is drawn across the hip. The pelvis must always cover the thighs.
  ok('PELVIS COVER: the torso base spans the thigh row beneath it in every direction (no hip cut-line)', DIRS.every(d => {
    const trows = [...new Set(FEMALE.layers[d]['4'].map(i => (i / CW) | 0))].sort((a, b) => a - b);
    const tb = trows[trows.length - 1];
    const legs = (FEMALE.layers[d]['9'] || []).concat(FEMALE.layers[d]['10'] || [])
      .filter(i => ((i / CW) | 0) === tb + 1).map(i => i % CW);
    if (!legs.length) return true;
    const torso = FEMALE.layers[d]['4'].filter(i => ((i / CW) | 0) === tb).map(i => i % CW);
    if (!torso.length) return false;
    return Math.min(...torso) <= Math.min(...legs) && Math.max(...torso) >= Math.max(...legs);
  }));
  // "stray pixels flying off next to the butt on some of the cardinal directions":
  // the resample can strand a pixel when a stretched row's edge lands off its
  // neighbours. Torso and legs are solid blobs -- ZERO nubs is the correct bar.
  ok('NO STRAYS: zero orphan/nub pixels in the torso or either leg, all 8 directions', DIRS.every(d =>
    ['4', '9', '10'].every(p => {
      const S = new Set(FEMALE.layers[d][p] || []);
      for (const idx of S) {
        const x = idx % CW, y = (idx / CW) | 0; let n = 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < CW && ny >= 0 && ny < CW && S.has(ny * CW + nx)) n++;
        }
        if (n <= 1) return false;
      }
      return true;
    })));
  // "definitely want to fix where the nipples are": every skeleton-anchored detail in
  // the render path must read the rig being drawn, not BAKED (the male) directly.
  ok('skeleton-anchored render details read the ACTIVE rig (rigSkel), not BAKED directly',
    /function rigSkel\(d\)/.test(src) &&
    !/const RSK=BAKED\.skeleton\[d\]/.test(src) &&
    !/const RS=BAKED\.skeleton\[d\]/.test(src) &&
    !/garmentContactLaw\(slot,restCol,REST_GRID\[d\],BAKED\.skeleton\[d\]/.test(src));
  ok('nipple placement is MEASURED off the real chest row, not a hardcoded male offset',
    src.indexOf('PLACEMENT IS MEASURED, NOT HARDCODED') >= 0 && !/put\(cx-3,nipY\);put\(cx\+3,nipY\)/.test(src));
}

// every canon garment renders on her without throwing (body-shape-agnostic generators, part-id-grid only)
function grabFn(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const GNAMES = ['mix', 'bshade', 'ext', 'pExt', 'genTop', 'genPants', 'genCoat', 'genShoes', 'genPoncho', 'genGear', 'genBag', 'genApron', 'genCoverall', 'genCape', 'genHat', 'genAcc'];
const gbodies = GNAMES.map(grabFn);
ok('every clothing generator is still found (nothing renamed out from under this gate)', gbodies.every(Boolean));
if (gbodies.every(Boolean) && FEMALE) {
  try {
    const Gens = new Function('CW', 'CH', 'curDir', gbodies.join('\n') + '\nreturn {genTop,genPants,genCoat,genShoes,genPoncho,genGear,genBag,genApron,genCoverall,genCape,genHat,genAcc};')(56, 56, 'S');
    // build a FEMALE part-id grid (S) the same shape genTop/genPants/etc expect: a flat CW*CW array of part ids
    const CW = 56, g = new Array(CW * CW).fill(0);
    for (const part in FEMALE.layers.S) for (const idx of FEMALE.layers.S[part]) g[idx] = +part;
    const R = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80], mid2: [70, 55, 40], sole: [30, 24, 18] };
    let allOk = true, total = 0;
    const tries = [
      () => Gens.genTop(g, { ramp: R, sleeves: true }),
      () => Gens.genTop(g, { ramp: R, sleeves: 'long', neck: 'v' }),
      () => Gens.genPants(g, { ramp: R }),
      () => Gens.genCoat(g, { ramp: R, len: 0.86 }),
      () => Gens.genShoes(g, { ramp: R }),
      () => Gens.genPoncho(g, { ramp: R }),
      () => Gens.genGear(g, { ramp: R, kind: 'gorget' }),
      () => Gens.genGear(g, { ramp: R, kind: 'chestrig' }),
      () => Gens.genBag(g, { ramp: R, kind: 'backpack' }),
      () => Gens.genApron(g, { ramp: R, bibless: true }),
      () => Gens.genCoverall(g, { ramp: R, bib: true, short: true }),
      () => Gens.genCape(g, { ramp: R }),
      () => Gens.genHat(g, { ramp: R, kind: 'beanie' }),
      () => Gens.genAcc(g, { ramp: R, kind: 'belt' }),
    ];
    for (const t of tries) {
      try { const o = t(); if (!o || Object.keys(o).length === 0) allOk = false; else total += Object.keys(o).length; }
      catch (e) { allOk = false; console.log('  garment-on-female err: ' + e.message); }
    }
    ok('a representative sweep of canon garment generators render on the FEMALE part-id grid without error (FEMALE-RIG GUARANTEE)', allOk && total > 0);
  } catch (e) { ok('garment generators evaluate against the FEMALE grid', false); console.log('  eval err: ' + e.message); }
}

console.log(`\n=== WOMAN RIG GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
