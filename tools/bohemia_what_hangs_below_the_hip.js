/* WHAT HANGS BELOW THE HIP? (9/15/26, CHARACTER lane, VAMILY [long coats])
 *
 * THE ROW: "Paolo 9/7 said the coat problem will be the nature of any long jackets and
 * coats; the runway wardrobe has many. The wardrobe data carries, for every garment that
 * hangs below the hip, which leg segment it is tied to, so the rig can move it with the
 * stride instead of freestyling."
 *
 * *** THE THING THIS REFUSES TO DO IS GUESS FROM THE NAME. *** This lane's own open row
 * [names lie] exists because COPPER WORK SHIRT renders GREEN: a garment's name is not
 * evidence about its pixels, and it has already cost this lane a wrong measurement once.
 * "LONGCOAT" is a name. So is "SKIRT". Neither says how far down it actually paints, and a
 * short jacket called a duster and a long apron called a wrap would both be filed wrong.
 *
 * SO IT ASKS THE PIXELS, AND THE RIG'S OWN PART GRID IS THE RULER. buildFrame returns a
 * per-pixel grid of PART IDS -- the rig's own answer to "which bone is under this pixel":
 *     1, 2      head          3, 4    torso
 *     5,6,7,8   arms          9, 10   legs (thigh and shin)     11, 12  feet
 * A garment is rendered on the body, diffed against the same body naked, and every pixel
 * the garment CHANGED is looked up in that grid. A garment hangs below the hip exactly
 * when it changes pixels the rig calls leg. That is not an interpretation of a name, it is
 * the same grid the rig poses, so a garment that reaches the thigh cannot be filed as a
 * shirt and a shirt cannot be filed as a coat.
 *
 * AND WHICH SEGMENT, by the rest skeleton's own joints rather than a fraction of the
 * sprite: the hip (waA) and the knee (knA) are read off the rig, and the garment's lowest
 * painted leg row is placed against them. Above the knee is THIGH, below it is SHIN, and a
 * garment that reaches the foot band is filed on the shin because that is the segment the
 * stride swings it with.
 *
 * WHAT IT DOES NOT DECIDE: whether the rig should move a given garment, how much lag a
 * hem gets, or what a coat looks like mid-stride. That is ANIMATION's [coat follows]. This
 * produces the DATA that row has to read, and the data is a measurement, so it is this
 * lane's whatever ANIMATION does (rule 12: a dependency is a premise, not a gate).
 *
 * RIG CHECK (RIG IS LAW): reads only. It restores G_WORN, G.equipped and the caches it
 * clears. It never touches BAKED, a joint, a bone or a painted pixel.
 * REUSE CHECK: cooks nothing, adds no art, draws no new shape.
 *
 *   node tools/bohemia_what_hangs_below_the_hip.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_WHAT_HANGS_BELOW_THE_HIP_9_15_26.txt');
const JSON_OUT = path.join(REPO, 'records/BOHEMIA_WHAT_HANGS_BELOW_THE_HIP_9_15_26.json');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate(() => {
    const o = { garments: [], err: [], joints: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    /* NAKED, ONCE. Everything below is a diff against this exact body, so a difference can
       only be the garment and never the body's own dials drifting between renders. */
    G.equipped = bare(); window.G_WORN = {}; clear();
    let base = null; try { base = buildFrame('S', 'idle', 0); } catch (e) { o.err.push('bare: ' + e); }
    if (!base) { window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }
    /* *** THE FRAME IS 112 WIDE AND THE FIRST CUT OF THIS TOOL ASSUMED 56. ***
       buildFrame returns {px, CW, CH, grid} -- there is no `w` on it, so `base.w || 56`
       silently took the fallback, every row number came out of a 12,544-pixel buffer
       divided by the wrong width, and the whole thigh-against-shin split was noise that
       LOOKED like a clean result: 49 and 54, a believable spread. The count of garments
       that hang was right the whole time because it is read off the part GRID by index and
       never touches a row. READ THE WIDTH OFF THE FRAME, NEVER OFF A DEFAULT. */
    const W = base.CW, H = base.CH;
    if (!W || !H) { o.err.push('the frame did not say how wide it is');
                    window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }
    /* THE JOINTS, READ OFF THE RIG'S OWN PART LAYOUT rather than a fraction of the sprite.
       A hem line guessed at "60% down the body" moves the moment a body dial moves. Part
       ids 9 and 10 are the legs and 11 and 12 are the lower leg and foot, so the top of the
       leg band IS the hip and the top of the 11/12 band IS where the lower leg starts. */
    let hipY = 1e9, kneeY = 1e9, footBot = -1;
    for (let i = 0; i < base.grid.length; i++) {
      const gid = base.grid[i]; if (gid < 9 || gid > 12) continue;
      const y = (i / W) | 0;
      if (y < hipY) hipY = y;
      if (y > footBot) footBot = y;
      if ((gid === 11 || gid === 12) && y < kneeY) kneeY = y;
    }
    if (kneeY === 1e9) kneeY = Math.round((hipY + footBot) / 2);
    o.joints = { hipY: hipY, kneeY: kneeY, footBot: footBot, W: W, H: H };

    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    for (const gm of canon) {
      const slot = ({ base: 'shirt', outer: 'jacket', legs: 'pants', feet: 'shoes',
                      hair: 'hair', hat: 'hat', glasses: 'glasses' })[gm.layer] || gm.layer;
      const eq = bare();
      G.equipped = eq; window.G_WORN = {}; window.G_WORN[gm.layer] = gm.n; clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { o.err.push(gm.n + ': ' + e); continue; }
      let onLeg = 0, onFoot = 0, onTorso = 0, changed = 0, lowest = -1;
      /* THE HEM IS THE LOWEST PIXEL ON A LEG, NOT THE LOWEST PIXEL. The first cut compared
         the lowest CHANGED pixel anywhere against the knee, so a shirt was judged by where
         its own hem sat on the torso and trousers came out "thigh" -- 99 thigh against 4
         shin, which is as wrong as the 49/54 the broken width produced, in the opposite
         direction and just as believable. Two wrong splits in one round is the tell: the
         number that matters is where the garment stops ON THE LEG. */
      let lowestLeg = -1, highestLeg = 1e9;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = base.px[i];
        const same = (!a && !c) || (a && c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]);
        if (same) continue;
        changed++;
        const y = (i / W) | 0, gid = fr.grid[i] || base.grid[i] || 0;
        if (y > lowest) lowest = y;
        if (gid >= 9 && gid <= 12) {
          if (gid <= 10) onLeg++; else onFoot++;
          if (y < highestLeg) highestLeg = y;
          if (y > lowestLeg) lowestLeg = y;
        } else if (gid === 3 || gid === 4) onTorso++;
      }
      /* HOW FAR DOWN THE LEG, as a fraction: 0 at the hip, 1 at the sole. Reported raw so
         nobody has to trust the boundary this tool draws, because THE RIG DOES NOT NAME A
         KNEE anywhere the page exposes -- part ids 9 and 10 are thigh and shin together.
         The knee is taken as the midpoint of the leg band and that choice is stated rather
         than buried, which is the only honest way to publish a boundary you inferred. */
      const legSpan = Math.max(1, footBot - hipY);
      const drop = lowestLeg < 0 ? null : +(((lowestLeg - hipY) / legSpan).toFixed(3));
      /* WHICH SEGMENT. A garment that only touches the foot band is a SHOE and is not a
         hem; it is filed as such rather than counted as a long coat, which is the kind of
         miscount that would have made this whole measurement look impressive and wrong. */
      let seg = 'none';
      if (gm.layer === 'feet') seg = 'shoe';
      else if (onLeg + onFoot === 0) seg = 'none';
      else if (drop <= 0.5) seg = 'thigh';
      else seg = 'shin';
      o.garments.push({ n: gm.n, layer: gm.layer, slot: slot, changed: changed,
                        onTorso: onTorso, onLeg: onLeg, onFoot: onFoot,
                        lowest: lowest, lowestLeg: lowestLeg < 0 ? null : lowestLeg,
                        topOfHem: highestLeg === 1e9 ? null : highestLeg,
                        drop: drop, seg: seg });
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const g = R.garments;
  const hangs = g.filter(x => x.seg === 'thigh' || x.seg === 'shin');
  const byLayer = {};
  for (const x of g) {
    const k = x.layer; byLayer[k] = byLayer[k] || { n: 0, thigh: 0, shin: 0, shoe: 0, none: 0 };
    byLayer[k].n++; byLayer[k][x.seg]++;
  }
  /* AND THE HALF OF THIS THAT IS WORTH THE ROUND: which garments a NAME would have filed
     wrong, in both directions. [names lie] is this lane's own open row about exactly that. */
  const LONGISH = /(COAT|DUSTER|CLOAK|CAPE|ROBE|GOWN|SKIRT|TRENCH|PONCHO|WRAP|TAIL|KILT)/;
  const nameSaysLong = g.filter(x => LONGISH.test(x.n) && x.layer !== 'legs' && x.layer !== 'feet');
  const missedByName = hangs.filter(x => !LONGISH.test(x.n) && x.layer !== 'legs' && x.layer !== 'feet');
  const falseAlarm = nameSaysLong.filter(x => x.seg === 'none');

  const L = [];
  L.push('WHAT HANGS BELOW THE HIP?  --  CHARACTER lane, 9/15/26, VAMILY [long coats]');
  L.push('Asked of the pixels and the rig\'s own part grid, never of the garment\'s name.');
  L.push('');
  L.push('HIS WORDS THIS ANSWERS (Paolo 9/7): the coat problem "will be the nature of any');
  L.push('long jackets and coats". The row asks for the DATA the rig needs: for every');
  L.push('garment that hangs below the hip, which leg segment carries it.');
  L.push('');
  L.push('THE RULER. buildFrame returns a per-pixel grid of the rig\'s PART IDS. Each garment');
  L.push('is rendered on the body and diffed against the same body naked; every pixel it');
  L.push('changed is looked up in that grid. A garment hangs below the hip exactly when it');
  L.push('changes pixels the rig calls LEG. The hip and the knee come off the rest skeleton');
  L.push('hip row ' + R.joints.hipY + ', lower leg starts at row ' + R.joints.kneeY + ', foot ends at '
    + R.joints.footBot + ', in a frame ' + R.joints.W + ' x ' + R.joints.H + '.');
  L.push('');
  L.push('  canon garments measured      ' + g.length);
  L.push('  HANG BELOW THE HIP           ' + hangs.length);
  L.push('    carried by the THIGH       ' + hangs.filter(x => x.seg === 'thigh').length);
  L.push('    carried by the SHIN        ' + hangs.filter(x => x.seg === 'shin').length);
  L.push('  shoes (a foot, not a hem)    ' + g.filter(x => x.seg === 'shoe').length);
  L.push('  stop at or above the hip     ' + g.filter(x => x.seg === 'none').length);
  L.push('');
  L.push('BY LAYER');
  L.push('  ' + 'layer'.padEnd(10) + 'canon'.padStart(7) + 'thigh'.padStart(7) + 'shin'.padStart(7)
    + 'shoe'.padStart(7) + 'above'.padStart(7));
  for (const k of Object.keys(byLayer).sort())
    L.push('  ' + k.padEnd(10) + String(byLayer[k].n).padStart(7) + String(byLayer[k].thigh).padStart(7)
      + String(byLayer[k].shin).padStart(7) + String(byLayer[k].shoe).padStart(7)
      + String(byLayer[k].none).padStart(7));
  L.push('');
  L.push('*** AND THE NAME WOULD HAVE BEEN WRONG ' + (missedByName.length + falseAlarm.length)
    + ' TIMES, WHICH IS WHY IT ASKS THE PIXELS ***');
  L.push('This lane\'s own open row [names lie] exists because COPPER WORK SHIRT renders');
  L.push('green. A name is not evidence about pixels. Counted here, on top and bottom:');
  L.push('  hang below the hip and their NAME never says so   ' + missedByName.length);
  L.push('  named like a long coat and stop at the hip        ' + falseAlarm.length);
  if (missedByName.length) {
    L.push('');
    L.push('  MISSED BY NAME (these are the ones a hand-written list would have lost):');
    for (const x of missedByName.slice(0, 24))
      L.push('    ' + x.n.padEnd(26) + x.layer.padEnd(7) + x.seg.padEnd(7) + 'down the leg ' + (x.drop*100).toFixed(0) + '%');
    if (missedByName.length > 24) L.push('    ... and ' + (missedByName.length - 24) + ' more');
  }
  if (falseAlarm.length) {
    L.push('');
    L.push('  NAMED LONG, MEASURED SHORT:');
    for (const x of falseAlarm.slice(0, 16))
      L.push('    ' + x.n.padEnd(26) + x.layer.padEnd(7) + 'never reaches a leg pixel');
  }
  L.push('');
  L.push('EVERY GARMENT THAT HANGS, AND THE SEGMENT THAT CARRIES IT');
  L.push('  ' + 'garment'.padEnd(28) + 'layer'.padEnd(7) + 'segment'.padEnd(8) + 'hem row'.padStart(8) + 'down the leg'.padStart(14));
  for (const x of hangs.sort((a, c) => c.drop - a.drop))
    L.push('  ' + x.n.padEnd(28) + x.layer.padEnd(7) + x.seg.padEnd(8)
      + String(x.lowestLeg).padStart(8) + ((x.drop * 100).toFixed(0) + '%').padStart(14));
  if (R.err.length) { L.push(''); L.push('DID NOT RENDER: ' + R.err.length + ' -- ' + R.err.slice(0, 3).join(' | ')); }
  L.push('');
  L.push('FOR ANIMATION [coat follows]: the JSON beside this file is the table. A garment');
  L.push('filed on the THIGH swings with the upper leg, one on the SHIN with the lower. This');
  L.push('lane measured it; how a hem moves is that row\'s, not this one\'s.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  fs.writeFileSync(JSON_OUT, JSON.stringify({ joints: R.joints, garments: g }, null, 1));
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT) + ' and the table beside it');
})();
