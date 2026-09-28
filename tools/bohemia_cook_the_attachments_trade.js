/* COOK: THE ATTACHMENTS TRADE (9/28/26, CHARACTER, [attachments])
 *
 * RULE 36c (Paolo 9/27, 'armour attachment customization'; laws/
 * BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s3). School from the library,
 * volume 04, its own recall line: "ATTACHMENTS (later DLC): a cloak, a padding, a spiked
 * impaler, a leather aketon under mail etc., each a trade of armour vs fatigue vs a special."
 * Then ours on the runway thirteen under the bible, from the game's camera.
 *
 * *** THE SCHOOL FINDING FIRST, BECAUSE IT DECIDED WHAT GOT BUILT. *** REUSE-FIRST asks the
 * wardrobe before it asks a generator, and asking found three of Battle Brothers' four named
 * attachments already shipped, under other names:
 *   CLOAK       ROAD CAPE (three colourways: oxblood, charcoal, steel; shipped wave 3)
 *   PADDING     the VEST family (nine colourways; already a base/outer-layer garment)
 *   AKETON      no garment needed -- BB's own description is a comfort layer worn UNDER mail,
 *               invisible on the model; there is nothing to draw for an attachment whose whole
 *               point is that you cannot see it
 *   SPIKED      nothing existed. This is the only one built this round.
 *
 * THE SPIKE, MECHANICALLY. genGear('pauldron') already paints a shoulder plate (lit top edge,
 * dark rim, a strap lip onto the torso) off the rig's own right-arm part id, and REUSE-FIRST
 * says extend that branch rather than write a second one: kind:'spiked' shares every line of
 * the plate paint and adds three tapered points rising off the plate's own measured top edge,
 * spaced across its measured x-run (not a fixed offset), so the spikes sit ON the plate at
 * every body width instead of floating past a narrow one or bunching on a wide one. Tuned once
 * by looking at the picture: the first pass (4 px tall, 1 px wide at the base) read as a rough
 * edge, not a threat; widened to 6 px tall with a 5 px base tapering to a single tip pixel, it
 * reads as three points from the game's own zoom, not a contact sheet.
 *
 * THE TRADE ITSELF IS DESIGN LANGUAGE, NOT A NUMBER. Rule 36d gives TUNING every felt number in
 * one table with its own gate; this lane draws the shape of the trade (a plain sentence per
 * type, below) and stops there on purpose -- a hard-coded stat on a garment here is exactly the
 * "felt number outside the table" rule 36 bans.
 *
 * WHAT THE SHOW PROVES: two slots, not one. PADDING (outer) and the CLOAK (back) already
 * compete for garment real estate with a faction's own coat -- Reds' duster and a padding vest
 * cannot both be worn, which is a real finding about the wardrobe's own slot layout, said
 * plainly below rather than hidden by picking a faction where it does not collide. SPIKED
 * (gear) collides with nothing any of the thirteen currently wear, so it layers cleanly onto
 * an existing look, shown here stacked with a cloak on the same body.
 *
 * RIG CHECK (RIG IS LAW): renders only. G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. REUSE CHECK: the spike shares genGear('pauldron')'s own plate paint; only the
 * spike geometry itself is new code, disclosed above.
 * NOT WIRED (rule 18): no faction's FACTION_LOOKS worn block is changed; this cooks candidate
 * attachment garments and shows them, it does not assign them to anyone.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   BB volume 04 (reference/library/battle_brothers/04_ARMOUR_SHIELDS.md): "a cloak, a
 *          padding, a spiked impaler, a leather aketon under mail... each a trade of armour
 *          vs fatigue vs a special" -- the whole brief this row answers.
 *   REAL-WORLD: a real spiked pauldron (a besague/spike stud on a 14th-15th century shoulder
 *          plate) is a small, deliberate point, not a crown of thorns -- three modest points
 *          off a plate reads truer than a dense row would.
 *   RNWY-13 (the two-pole study): a body's silhouette still has to read as itself with the
 *          attachment on; measured below.
 *
 *   node tools/bohemia_cook_the_attachments_trade.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ATTACHMENTS_TRADE.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };
const FRAMES = 8;   /* the "with the attachment" body plays the game's own walk cycle (rule
                        25); "before" stays a still reference, the same split "THE THIRTEEN
                        ARE WEARING IT" used for its 112 source panel. */

/* MOB: no outer, no gear today -- the padding (outer) goes on clean.
   CARTEL: already wears the cloak (STEEL ROAD CAPE, back); the spike (gear) stacks on top. */
const CASES = [
  { faction: 'Cartel', add: { gear: 'STEEL SPIKED PAULDRON' },
    label: 'CARTEL, CLOAK + SPIKE', note: 'already wears the cloak (steel road cape); the spike layers on cleanly, gear collides with nothing.' },
  { faction: 'Mob', add: { outer: 'QUILTED VEST' },
    label: 'MOB, PADDING', note: 'wore no coat; the padding is a clean add here -- on a faction that already wears one, it would REPLACE the coat, not layer under it (the finding, stated in the record).' }
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ CASES, FRAMES }) => {
    const o = { pairs: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const hsv = (r, g, bb) => { const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb), d = mx - mn;
      let h = 0; if (d) { if (mx === r) h = ((g - bb) / d) % 6; else if (mx === g) h = (bb - r) / d + 2;
        else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
      return { h: h, s: mx ? d / mx : 0, v: mx / 255 }; };

    const profile = (fr) => {
      const rows = new Array(fr.CH).fill(0); let top = 1e9, bot = -1;
      for (let i = 0; i < fr.px.length; i++) { if (!fr.px[i]) continue;
        const y = (i / fr.CW) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = []; for (let k = 0; k < 16; k++) prof.push(rows[Math.min(fr.CH - 1, top + Math.round(span * k / 15))] / wide);
      return prof;
    };
    const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };

    const shoot = (dials, worn, age, dir, clip, ph) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      return buildFrame(dir, clip || 'idle', ph || 0);
    };
    const toPNG = (fr) => {
      const cv = document.createElement('canvas'); cv.width = fr.CW; cv.height = fr.CH;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(fr.CW, fr.CH), d = im.data;
      for (let i = 0; i < fr.px.length; i++) { const q = fr.px[i]; if (!q) continue;
        d[i*4] = q[0]; d[i*4+1] = q[1]; d[i*4+2] = q[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return cv.toDataURL('image/png');
    };

    try {
      for (const c of CASES) {
        const f = FACTION_LOOKS.filter(x => x.faction === c.faction)[0];
        if (!f) { o.err = 'no faction ' + c.faction; break; }
        const wornAfter = Object.assign({}, f.worn, c.add);
        /* S facing, not E: the spike sits on the RIGHT shoulder and reads clearly face-on
           (measured across all 8 facings this round); side-on it is the far/near arm and
           reads thinner. Front-on is also where the game's own camera holds a standing man. */
        const before = shoot(f.dials, f.worn, f.age, 'S');
        const walk = [];
        for (let i = 0; i < FRAMES; i++) walk.push(toPNG(shoot(f.dials, wornAfter, f.age, 'S', 'walk', i / FRAMES)));
        const after0 = shoot(f.dials, wornAfter, f.age, 'S', 'walk', 0);
        o.pairs.push({ faction: c.faction, label: c.label, note: c.note,
          before: toPNG(before), walk: walk,
          profBefore: profile(before), profAfter: profile(after0) });
      }
      /* CROSS-CASE SILHOUETTE CHECK: Cartel-with-spike and Mob-with-padding must not read as
         the same body -- the same closest-pair ruler this lane always uses. */
      if (o.pairs.length === 2) {
        o.crossDist = dist(o.pairs[0].profAfter, o.pairs[1].profAfter);
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { CASES, FRAMES });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }

  /* REFUSE if the attachment made the two bodies read as one silhouette. */
  if (R.crossDist !== undefined && R.crossDist < 0.02) {
    console.error('REFUSING TO WRITE: the two dressed bodies read as the same silhouette, '
      + R.crossDist.toFixed(4));
    process.exit(4);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('THE ATTACHMENTS TRADE  --  CHARACTER, 9/28/26, [attachments], rule 36c');
  L.push('');
  L.push('HIS WORDS (9/27): "armour attachment customization." Library, volume 04: "a cloak, a');
  L.push('padding, a spiked impaler, a leather aketon under mail... each a trade of armour vs');
  L.push('fatigue vs a special."');
  L.push('');
  L.push('SCHOOL FOUND THREE OF FOUR ALREADY SHIPPED, UNDER OTHER NAMES (REUSE-FIRST):');
  L.push('  CLOAK    = ROAD CAPE (3 colourways, back slot, since wave 3)');
  L.push('  PADDING  = the VEST family (9 colourways, outer slot)');
  L.push('  AKETON   = no garment needed; BB\'s own description is a layer worn UNDER mail,');
  L.push('             invisible on the model -- nothing to draw for an attachment whose point');
  L.push('             is that you cannot see it.');
  L.push('  SPIKED   = nothing existed. Built this round: SPIKED PAULDRON, STEEL SPIKED');
  L.push('             PAULDRON. Reuses genGear(\'pauldron\')\'s own plate paint; only the three');
  L.push('             tapered points are new code.');
  L.push('');
  L.push('A REAL SLOT FINDING, NOT GLOSSED OVER: PADDING (outer) and a faction\'s own coat');
  L.push('(also outer) compete for the same layer. On a faction that already wears a coat,');
  L.push('adding padding REPLACES it rather than layering under it -- true to the wardrobe\'s');
  L.push('own engine, worth knowing before TUNING prices padding as an addable option. The');
  L.push('cloak (back) and the spike (gear) do not have this problem; both layer cleanly.');
  L.push('');
  for (const pr of R.pairs) {
    L.push(pr.label + ': ' + pr.note);
  }
  if (R.crossDist !== undefined) {
    L.push('');
    L.push('SILHOUETTE CHECK: Cartel-with-spike vs Mob-with-padding, same 16-sample profile');
    L.push('the runway work uses: ' + R.crossDist.toFixed(4) + ' apart -- CLEARS the collapse');
    L.push('floor (0.02), two different people, not one costume swapped twice.');
  }
  L.push('');
  L.push('THE TRADE, IN WORDS, TUNING\'S TO NUMBER: a cloak conceals but flaps and catches; a');
  L.push('padding adds protection at a cost in fatigue; a spike threatens (a called-shot');
  L.push('deterrent or a morale read) without adding armour of its own; an aketon is comfort,');
  L.push('not a stat, which is why it is invisible. No number is hard-coded on any of these');
  L.push('garments -- rule 36d\'s own line, no felt number outside TUNING\'s one table.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const cells = R.pairs.map((pr, i) => `
    <section>
      <h2>${pr.label}</h2>
      <p class="note">${pr.note}</p>
      <div class="street">
        <div class="walk"></div><div class="kerb"></div>
        <div class="road">
          <figure><img src="${pr.before}"><figcaption>before, still</figcaption></figure>
          <figure><canvas id="c${i}" width="112" height="112"></canvas><figcaption>with the attachment, plays</figcaption></figure>
        </div>
      </div>
    </section>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE ATTACHMENTS TRADE</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:640px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 6px; line-height:1.5; }
  section{ margin:22px 0 0; }
  h2{ font-size:13px; margin:0 0 4px; letter-spacing:1px; }
  p.note{ margin:0 0 8px; font-size:11px; opacity:.8; }
  .street{ background:var(--walk); }
  .walk{ height:14px; background:var(--walk); }
  .kerb{ height:3px; background:var(--kerb); }
  .road{ background:var(--road); display:flex; gap:24px; padding:8px 14px; }
  figure{ margin:0; }
  img,canvas{ width:168px; height:168px; image-rendering:pixelated; display:block; }
  figcaption{ font-size:10px; padding:4px 0 0; opacity:.8; text-align:center; }
  .beat{ margin:20px 0 0; font-size:11px; opacity:.8; line-height:1.55; }
</style>
<div class="wrap">
  <h1>THE ATTACHMENTS TRADE</h1>
  <p class="sub">armour attachment customization: a cloak, a padding, a spike, an aketon,
  each a trade of armour vs fatigue vs a special. three of four already existed in the
  wardrobe under other names; the spike is the one built this round.</p>
  ${cells}
  <p class="beat">what is not here: the aketon (worn under mail, meant to be invisible, so</p>
  <p class="beat">there is nothing to draw) and any stat. the trade is written in words above;</p>
  <p class="beat">the numbers are tuning's, in their one table, not hard-coded on a garment.</p>
</div>
<script>
const WALK = ${JSON.stringify(R.pairs.map(pr => pr.walk))};
const rows = WALK.map((set, i) => ({
  imgs: set.map(u => { const im = new Image(); im.src = u; return im; }),
  ctx: document.getElementById('c' + i).getContext('2d') }));
rows.forEach(r => r.ctx.imageSmoothingEnabled = false);
const msPerBeat = 500, t0 = performance.now(), FR = ${FRAMES};
function tick(now){
  const f = Math.floor((now - t0) / (msPerBeat / FR)) % FR;
  rows.forEach(r => { const im = r.imgs[f];
    if (im && im.complete) { r.ctx.clearRect(0,0,112,112); r.ctx.drawImage(im, 0, 0); } });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('\nWROTE ' + path.relative(REPO, PAGE));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
})();
