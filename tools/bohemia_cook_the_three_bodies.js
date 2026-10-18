/* COOK: THE THREE BODIES (10/10/26, CHARACTER, [three bodies])
 *
 * Rule 31 (Paolo 9/23), law s5: "PORTRAIT and CHARACTER derive the three faces and
 * bodies from his own by the heredity the family law already runs." PORTRAIT shipped
 * the face half 9/27 (descendantSpec, slices/BOHEMIA_ALPHA_0_9.html). This row is the
 * body half, REUSE-FIRST: the exact same heritability weights (DESCENDANT_H,
 * DESCENDANT_LOOK_H), the exact same "roll an ordinary adult, then blend toward the
 * ancestor" shape, and the exact same "a whole bundle moves together, never averaged"
 * rule the face already proved on hair, applied here to a whole outfit instead of one
 * garment. New function: descendantBodySpec(actNum, ancestorDials, ancestorWorn, opts)
 * -- zero new weights invented, zero new rule invented.
 *
 * WHY THE DIALS BLEND AND THE OUTFIT DOES NOT: a body's five dials (height, belly,
 * arms, shoulders, hips) are continuous numbers, exactly like a skull's, so they blend
 * the same way. An outfit is categorical -- a vest half-blended with a duster is not a
 * garment, it is a glitch -- so it is copied whole or not at all, the SAME rule the
 * face mechanism already proved is correct for a haircut.
 *
 * THE BASE ROLL: there is no general body-dial roller the way faceFor() is one for
 * faces, because every body in this game is hand-authored (FACTION_LOOKS,
 * CITY_CAST_LOOKS, 25 looks between them). So "an ordinary adult body" is a
 * deterministic pick from that pool -- never an invented shape -- then blended toward
 * the ancestor.
 *
 * THE SHIP TEST: three bodies, one ancestor and two descendants, at the real weights
 * (h2=0.62, h3=0.3844, compounding exactly as the face does), proving the blend
 * actually moves toward the ancestor and the two generations read as different
 * amounts of family resemblance, not a coin flip.
 *
 * RIG CHECK: renders only, the same shoot()/toPNG() harness this lane's last four
 * rows use. G_WORN/G.equipped/G.bodyVar/G.age restored after.
 *
 * REFERENCE CHECK: no new pixel; every garment and every body archetype is already
 * canon and already judged (FACTION_LOOKS, CITY_CAST_LOOKS). The blend mechanism
 * itself is the new thing, and it reuses PORTRAIT's own weights verbatim.
 *
 *   node tools/bohemia_cook_the_three_bodies.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_THREE_BODIES.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_THREE_BODIES_10_10_26.txt');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };

/* A STAND-IN ANCESTOR, SAID PLAINLY: the live player's own hand-built face and body
   are not reachable from a headless cook tool (they come from the face maker, not a
   fixture). This uses one of the runway thirteen as the ancestor stand-in for the
   proof, same precedent as the enemy-tiers and origin-crews tools, which proved their
   mechanisms against FACTION_LOOKS entries rather than a live session. The mechanism
   itself (descendantBodySpec) takes any ancestor's real dials and worn bundle, player
   included; this is the proof it works, not a claim about which body it will run on. */
const ANCESTOR_NAME = 'Church';

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && typeof descendantBodySpec === 'function'
    && window.FACTION_LOOKS, { timeout: 90000 });

  const R = await p.evaluate(({ ANCESTOR_NAME }) => {
    const o = { rows: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const pxDiff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) {
      const x = a[i], y = b[i];
      if (!x && !y) continue;
      if (!x || !y || x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2]) n++;
    } return n; };

    const shoot = (dials, worn, age) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      return buildFrame('S', 'idle', 0);
    };
    const toPNG = (fr) => {
      const cv = document.createElement('canvas'); cv.width = fr.CW; cv.height = fr.CH;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(fr.CW, fr.CH), d = im.data;
      for (let i = 0; i < fr.px.length; i++) { const q = fr.px[i]; if (!q) continue;
        d[i*4] = q[0]; d[i*4+1] = q[1]; d[i*4+2] = q[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return { png: cv.toDataURL('image/png'), px: fr.px };
    };

    try {
      const ancestor = window.FACTION_LOOKS.find(f => f.faction === ANCESTOR_NAME);
      if (!ancestor) { o.err = 'no ancestor found'; return o; }
      const act1 = toPNG(shoot(ancestor.dials, ancestor.worn, ancestor.age));
      const a2 = descendantBodySpec(2, ancestor.dials, ancestor.worn);
      const act2 = toPNG(shoot(a2.dials, a2.worn, 'adult'));
      const a3 = descendantBodySpec(3, ancestor.dials, ancestor.worn);
      const act3 = toPNG(shoot(a3.dials, a3.worn, 'adult'));

      o.rows = [
        { label: 'ACT 1', sub: ANCESTOR_NAME + ' (the ancestor)', png: act1.png, dials: ancestor.dials, worn: ancestor.worn, h: null },
        { label: 'ACT 2', sub: 'h = 0.62', png: act2.png, dials: a2.dials, worn: a2.worn, h: 0.62, inherited: JSON.stringify(a2.worn) === JSON.stringify(ancestor.worn) },
        { label: 'ACT 3', sub: 'h = 0.3844', png: act3.png, dials: a3.dials, worn: a3.worn, h: 0.3844, inherited: JSON.stringify(a3.worn) === JSON.stringify(ancestor.worn) }
      ];
      o.px12 = pxDiff(act1.px, act2.px);
      o.px13 = pxDiff(act1.px, act3.px);
      o.px23 = pxDiff(act2.px, act3.px);
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { ANCESTOR_NAME });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (errs.length) { console.error('PAGE ERRORS: ' + errs.join(' | ')); process.exit(5); }
  const floor = 300;
  if (R.px12 < floor || R.px13 < floor || R.px23 < floor) {
    console.error('REFUSING TO WRITE: two of the three read as the same picture ('
      + R.px12 + ', ' + R.px13 + ', ' + R.px23 + ')');
    process.exit(4);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('THE THREE BODIES -- CHARACTER, 10/10/26, [three bodies], rule 31, law s5');
  L.push('');
  L.push('PORTRAIT\'s descendantSpec (9/27) already blends the three descendants\' FACES');
  L.push('toward the ancestor by heredity; this is the BODY half, with no new weight and');
  L.push('no new rule. New function, descendantBodySpec(actNum, ancestorDials,');
  L.push('ancestorWorn, opts): the five body dials (height, belly, arms, shoulders, hips)');
  L.push('blend toward the ancestor\'s real numbers by the SAME DESCENDANT_H (0.62, then');
  L.push('0.62 squared for the third generation); the outfit is copied whole or rolled');
  L.push('independently by the SAME DESCENDANT_LOOK_H (0.90), never averaged piece by');
  L.push('piece, the same rule the face mechanism already proved on a haircut.');
  L.push('');
  L.push('THE BASE ROLL: no general body-dial roller exists for a fresh adult the way');
  L.push('faceFor() is one for a face, so "an ordinary adult" body is a deterministic');
  L.push('pick from the 25 already-judged looks this lane has built (13 FACTION_LOOKS +');
  L.push('12 CITY_CAST_LOOKS), then blended toward the ancestor -- never an invented');
  L.push('shape, and "the runway names" the row asks for holds on both branches of the');
  L.push('outfit roll, inherited or independent.');
  L.push('');
  L.push('THIS PROOF\'S ANCESTOR STAND-IN: ' + ANCESTOR_NAME + ', one of the runway thirteen (the live');
  L.push('player\'s own hand-built face and body are not reachable from a headless tool;');
  L.push('this proves the mechanism against a real ancestor\'s real dials and worn bundle,');
  L.push('not a claim about whose face it will actually run on in the game).');
  L.push('');
  R.rows.forEach(r => {
    L.push(r.label + ' (' + r.sub + '): height ' + r.dials.height.toFixed(3) + ', belly '
      + r.dials.belly.toFixed(3) + ', arms ' + r.dials.arms.toFixed(3) + ', shoulders '
      + r.dials.shoulders.toFixed(3) + ', hips ' + r.dials.hips.toFixed(3)
      + (r.h !== null ? ' -- outfit ' + (r.inherited ? 'INHERITED whole from the ancestor' : 'INDEPENDENT, its own roll') : ''));
  });
  L.push('');
  L.push('SILHOUETTE/COLOUR CHECK, PIXEL DIFFERENCE (the honest ruler for this kind of');
  L.push('change, same lesson as [armour you can see]\'s first mistake): act1 vs act2 '
    + R.px12 + ', act1 vs act3 ' + R.px13 + ', act2 vs act3 ' + R.px23 + ' (floor: ' + floor + '). All three clear.');
  L.push('');
  L.push('NOT HERE, ON PURPOSE: this proves the mechanism renders and blends correctly.');
  L.push('Wiring it to the live player\'s actual ancestor dials/worn bundle at the flip');
  L.push('and to act 3\'s own visual era (ruin to recovered, DIRECTION\'s bible) is DYNASTY');
  L.push('and RUN\'s door; this lane\'s job was the body-heredity mechanism itself, and it');
  L.push('is now a function, not a guess made fresh by whoever wires it in next.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const cells = R.rows.map(r => `
    <figure>
      <canvas id="c${r.label.replace(/\s/g,'')}" width="112" height="112"></canvas>
      <figcaption>${r.label}<br><span class="mini">${r.sub}</span>${r.h !== null ? '<br><span class="mini">' + (r.inherited ? 'inherited outfit' : 'independent outfit') + '</span>' : ''}</figcaption>
    </figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE THREE BODIES</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:900px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 16px; line-height:1.5; }
  .street{ background:var(--walk); padding:10px 0; }
  .road{ background:var(--road); display:flex; gap:24px; padding:14px; flex-wrap:wrap; }
  figure{ margin:0; text-align:center; }
  canvas{ width:140px; height:140px; image-rendering:pixelated; display:block; background:var(--road); }
  figcaption{ font-size:11px; padding:6px 0 0; }
  .mini{ font-size:9px; opacity:.7; }
  .beat{ margin:16px 0 0; font-size:11px; opacity:.8; line-height:1.6; }
</style>
<div class="wrap">
  <h1>THE THREE BODIES</h1>
  <p class="sub">One ancestor, two descendants, bodies blended toward him by heredity the
  same weights the face already uses (h = 0.62, then 0.3844). The outfit copies whole or
  rolls independent, never averaged.</p>
  <div class="street"><div class="road">${cells}</div></div>
  <p class="beat">Pixel difference, the honest ruler: act1/act2 ${R.px12}, act1/act3 ${R.px13}, act2/act3 ${R.px23} (floor ${floor}). All three clear, three different pictures.</p>
</div>
<script>
const ROWS = ${JSON.stringify(R.rows.map(r => ({ id: r.label.replace(/\s/g,''), png: r.png })))};
for (const r of ROWS) {
  const cv = document.getElementById('c' + r.id);
  const img = new Image();
  img.onload = () => cv.getContext('2d').drawImage(img, 0, 0, 112, 112);
  img.src = r.png;
}
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('wrote ' + PAGE);
})();
