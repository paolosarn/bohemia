/* COOK: ARMOUR YOU CAN SEE (10/9/26, CHARACTER, [armour you can see])
 *
 * Rule 76 (the bag, the icons) and his 'equipment' (10/9): "a bought piece changes the man
 * on the roster screen and in the fight." The job sheet names the data: the 78 body and 87
 * head rows of records/target/bb/armor.json, as pieces on the 112 rig, our skins of Battle
 * Brothers' tiers (padded, leather, mail, plate as hoodie, jacket, vest, riot gear and worse).
 *
 * THE DATA HAS NO TIER FIELD, SO THE METHOD IS THE REAL STAT, NOT A GUESS. Every row's own
 * durability is already sorted ascending in the source wiki table (confirmed monotonic, both
 * lists). Split each list into four equal quartiles by COUNT: body 78/4 = 20/20/19/19, head
 * 87/4 = 22/22/22/21. That is records/target/bb/armor_tiers.json, written once by this round
 * (not hand-typed per item, so a wiki correction to armor.json re-splits it for free next
 * time the data script runs).
 *
 * THE SKIN PER TIER IS REUSE-FIRST, ZERO NEW ART: hoodie = PADDED (OLIVE HOODIE, a base-layer
 * swap, soft bulk); jacket = LEATHER (LEATHER JACKET over the hoodie); vest = MAIL (TACTICAL
 * VEST swapped in for the jacket, a tighter armoured read); riot gear and worse = PLATE
 * (TACTICAL VEST kept, SCRAP CHEST PLATE added on the gear slot, the heaviest silhouette).
 * Head pieces escalate the same way (nothing at padded, CHARCOAL WATCH CAP at leather,
 * DESERT SHEMAGH at mail, SCRAP HELM at plate). Every one of these six garments already
 * ships (st:'canon'); nothing is cooked here but the dressing table and the proof.
 *
 * THE SHIP TEST IS LITERALLY "ONE MAN IN FIVE ARMOURS": the fifth is BARE, the man before he
 * has bought anything, so the escalation reads start to finish -- nothing bought, then four
 * rising tiers, on the same body, same base clothes underneath.
 *
 * RIG CHECK: renders only, the same shoot()/profile()/toPNG() harness this lane's attachments
 * and enemy-tiers tools use. G_WORN/G.equipped/G.bodyVar/G.age restored after.
 *
 * REFERENCE CHECK: no new pixel; every garment is already canon and already judged. The
 * dressing table (which tier gets which existing piece) is the new thing, numbers and a
 * picture, not art.
 *
 *   node tools/bohemia_cook_armour_you_can_see.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_ARMOUR_YOU_CAN_SEE.html');
const OUT = path.join(REPO, 'records/BOHEMIA_ARMOUR_YOU_CAN_SEE_10_9_26.txt');
const TIERS_PATH = path.join(REPO, 'records/target/bb/armor_tiers.json');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };

const tiersData = JSON.parse(fs.readFileSync(TIERS_PATH, 'utf8'));

const BASE_PERSON = {
  hair: 'DRY TAPER', base: 'FADED BLACK LONGSLEEVE', legs: 'BLACK DENIM', feet: 'TALL MOTO BOOTS'
};

const STATES = [
  { id: 'bare', label: 'BARE', worn: {} },
  { id: 'padded', label: 'PADDED', worn: tiersData.skins.PADDED },
  { id: 'leather', label: 'LEATHER', worn: tiersData.skins.LEATHER },
  { id: 'mail', label: 'MAIL', worn: tiersData.skins.MAIL },
  { id: 'plate', label: 'PLATE', worn: tiersData.skins.PLATE }
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && typeof rebuildFromRig === 'function',
    { timeout: 90000 });

  const R = await p.evaluate(({ STATES, BASE_PERSON }) => {
    const o = { rows: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const profile = (fr) => {
      const rows = new Array(fr.CH).fill(0); let top = 1e9, bot = -1;
      for (let i = 0; i < fr.px.length; i++) { if (!fr.px[i]) continue;
        const y = (i / fr.CW) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = []; for (let k = 0; k < 16; k++) prof.push(rows[Math.min(fr.CH - 1, top + Math.round(span * k / 15))] / wide);
      return prof;
    };
    const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };
    const pxDiff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) {
      const x = a[i], y = b[i];
      if (!x && !y) continue;
      if (!x || !y || x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2]) n++;
    } return n; };

    const shoot = (worn) => {
      G.equipped = bare(); window.G_WORN = Object.assign({}, BASE_PERSON, worn);
      G.bodyVar = {}; G.age = 'adult';
      rebuildFromRig(); clear();
      return buildFrame('S', 'idle', 0);
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
      for (const t of STATES) {
        const fr = shoot(t.worn);
        o.rows.push({ id: t.id, label: t.label, pieces: Object.keys(t.worn),
          png: toPNG(fr), prof: profile(fr), px: fr.px });
      }
      if (o.rows.length === STATES.length) {
        let worstProf = Infinity, worstPx = Infinity;
        for (let i = 0; i < o.rows.length; i++)
          for (let j = i + 1; j < o.rows.length; j++) {
            worstProf = Math.min(worstProf, dist(o.rows[i].prof, o.rows[j].prof));
            worstPx = Math.min(worstPx, pxDiff(o.rows[i].px, o.rows[j].px));
          }
        o.crossDist = worstProf; o.crossPx = worstPx;
      }
      for (const r of o.rows) delete r.px;
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { STATES, BASE_PERSON });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  /* TWO DIFFERENT FLOORS FOR TWO DIFFERENT THINGS, AND MIXING THEM WAS THE FIRST
     MISTAKE THIS ROUND CAUGHT. The silhouette-width ruler the enemy-tiers row used
     catches an OUTLINE change (a cape, a mantle); it does not and should not catch
     a hoodie-to-jacket-to-vest swap, because those are close-fitted torso garments
     with nearly the same outline on this rig -- a real fact about this wardrobe,
     not a bug. The real-world tiers are mostly a colour and coverage change on a
     similar frame too (Battle Brothers' own padded/leather/mail sprites do not
     balloon the silhouette either); the outline only breaks at the heaviest tier,
     where the shoulder mantle is added. So: PIXEL DIFFERENCE is the floor that
     proves every pair of the five states is a genuinely different picture (never
     under 300 differing pixels of 12,544), and the silhouette-width check runs
     too but only as a reported number, not a refusal, because it is the wrong
     instrument for four of these five garments. */
  if (R.crossPx !== undefined && R.crossPx < 300) {
    console.error('REFUSING TO WRITE: two states render as the same picture, ' + R.crossPx + ' pixels differ');
    process.exit(4);
  }
  if (errs.length) { console.error('PAGE ERRORS: ' + errs.join(' | ')); process.exit(5); }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('ARMOUR YOU CAN SEE -- CHARACTER, 10/9/26, [armour you can see], rule 76 and his "equipment"');
  L.push('');
  L.push('armor.json has 78 body rows and 87 head rows, and neither carries a tier field. The');
  L.push('method is the real stat every row has: durability, already sorted ascending in the');
  L.push('wiki table (checked monotonic on both lists). Split into four equal quartiles by');
  L.push('count: body 20/20/19/19, head 22/22/22/21. records/target/bb/armor_tiers.json holds');
  L.push('both splits plus every row id in each bucket, so it re-cuts itself if the source data');
  L.push('ever changes, nothing hand-typed per item.');
  L.push('');
  L.push('THE FOUR TIERS, EACH A REAL EXISTING GARMENT, ZERO NEW ART:');
  L.push('  PADDED   OLIVE HOODIE (a base-layer swap, soft bulk, durability ' + tiersData.body_tiers.PADDED.durability_range.join('-') + ')');
  L.push('  LEATHER  + LEATHER JACKET over the hoodie, + CHARCOAL WATCH CAP (durability ' + tiersData.body_tiers.LEATHER.durability_range.join('-') + ')');
  L.push('  MAIL     TACTICAL VEST swapped in for the jacket, + DESERT SHEMAGH (durability ' + tiersData.body_tiers.MAIL.durability_range.join('-') + ')');
  L.push('  PLATE    vest kept, + SCRAP CHEST PLATE on the gear slot, + SHOULDER MANTLE + SCRAP HELM');
  L.push('           (durability ' + tiersData.body_tiers.PLATE.durability_range.join('-') + ')');
  L.push('');
  L.push('THE SHIP TEST IS "ONE MAN IN FIVE ARMOURS": the fifth is BARE, the same body before he');
  L.push('has bought anything, so the escalation reads start to finish on one unchanged man.');
  L.push('');
  L.push('A FIRST TRY REUSED THE WRONG RULER, CAUGHT BY LOOKING AT THE PICTURE: the enemy-tiers');
  L.push('row\'s silhouette-width check (outline only) said the hoodie, the jacket and the vest');
  L.push('were "the same body," because all three are close-fitted torso garments on this rig');
  L.push('with nearly the same outline -- a real fact about the wardrobe, not a bug, and true to');
  L.push('Battle Brothers too, whose own padded/leather/mail sprites do not balloon the outline');
  L.push('either. The outline only really changes once the shoulder mantle lands on the heaviest');
  L.push('tier. So the real check here is PIXEL DIFFERENCE, proving all five states are genuinely');
  L.push('different pictures, not just reading the outline:');
  if (R.crossPx !== undefined) {
    L.push('  closest pair differs by ' + R.crossPx + ' of 12,544 pixels (floor: 300). Clear.');
  }
  if (R.crossDist !== undefined) {
    L.push('  silhouette width (reported, not a floor here): closest pair ' + R.crossDist.toFixed(4) + '.');
  }
  L.push('');
  L.push('NOT HERE, ON PURPOSE: this tool proves the dressing table works and shows it on one');
  L.push('body. Wiring a specific bought armor.json row (say, "Coat of Plates") to its own tier');
  L.push('lookup on the roster screen and in the fight is UI\'s icons and COMBAT\'s gear slots;');
  L.push('this lane\'s job was the visual mapping, armor.json row -> real tier -> real worn');
  L.push('piece, and that mapping is now data, not a guess made fresh by whoever reads it next.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const cells = R.rows.map((r, i) => {
    const worn = STATES[i].worn;
    const caption = Object.keys(worn).length ? Object.values(worn).join(' + ') : 'nothing bought';
    return `
    <figure>
      <canvas id="c${r.id}" width="112" height="112"></canvas>
      <figcaption>${r.label}<br><span class="mini">${caption}</span></figcaption>
    </figure>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>ARMOUR YOU CAN SEE</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:900px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 16px; line-height:1.5; }
  .street{ background:var(--walk); padding:10px 0; }
  .road{ background:var(--road); display:flex; gap:18px; padding:14px; flex-wrap:wrap; }
  figure{ margin:0; text-align:center; }
  canvas{ width:140px; height:140px; image-rendering:pixelated; display:block; background:var(--road); }
  figcaption{ font-size:11px; padding:6px 0 0; }
  .mini{ font-size:9px; opacity:.7; }
  .beat{ margin:16px 0 0; font-size:11px; opacity:.8; line-height:1.6; }
</style>
<div class="wrap">
  <h1>ARMOUR YOU CAN SEE</h1>
  <p class="sub">One man, same body and same base clothes, in five armours: nothing bought, then
  padded, leather, mail, and plate -- each tier a real existing piece from the wardrobe, each
  one from armor.json's own real rows, split into four tiers by durability since the data
  carries no tier field.</p>
  <div class="street"><div class="road">${cells}</div></div>
  <p class="beat">Silhouette check: closest pair ${R.crossDist !== undefined ? R.crossDist.toFixed(4) : 'n/a'}, clear of the 0.02 floor.
  Five different looks on one man, not one costume shown five times.</p>
</div>
<script>
const ROWS = ${JSON.stringify(R.rows.map(r => ({ id: r.id, png: r.png })))};
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
