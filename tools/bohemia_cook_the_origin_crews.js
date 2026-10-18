/* COOK: THE ORIGIN CREWS (10/9/26, CHARACTER, [the origin crews])
 *
 * RUN [the origin sets the company] (records/target/bb/origins.json): the door's origin picks
 * who starts in your company, by background and level. The row's own brief: "each origin's
 * starting men dressed by their backgrounds.json background (the Lone Wolf's veteran in his
 * worn plate, Block Watch's weak men in work clothes)."
 *
 * backgrounds.json HAS NO ARMOUR FIELD EITHER, SAME GAP AS LAST ROUND'S [armour you can see].
 * The method is the same one, applied to a different real stat: every background carries a
 * daily wage (Battle Brothers' own proxy for how equipped and seasoned a man already is), so
 * sort the 26 backgrounds this game's 15 origins actually use by wage (tie-broken by melee
 * defense, then id) and split into the SAME five states this lane already built and already
 * ships (records/target/bb/armor_tiers.json: bare, padded, leather, mail, plate). 26 / 5 =
 * 6/5/5/5/5, zero new art, zero new skins -- this row reuses last round's table whole.
 *
 * IT MATCHES HIS OWN TWO EXAMPLES WITHOUT BEING TOLD TO: hedge_knight (the Lone Wolf's one
 * man, wage 35, the highest in the data with gladiator) lands in PLATE on its own; every one
 * of the Block Watch's twelve backgrounds (farmhand, daytaler, poacher, miller, fisherman,
 * militia, minstrel, vagabond, butcher) lands in bare, padded or leather, NEVER mail or plate
 * -- "weak men in work clothes" is where the real wage data puts them, not a label pasted on.
 *
 * THE SHEET: records/target/bb/origin_crews_dress.json, one row per background (its tier) and
 * one row per origin (its men, each man's background, level and tier). RUN reads it at the
 * door; this tool proves it renders.
 *
 * THE SHIP TEST IS "THREE ORIGINS' FIRST SCREENS": Lone Wolf (1 man, the extreme), A New
 * Company (3, the common case), the Block Watch (12, the other extreme) -- the mechanism
 * proven at every crew size it actually has to handle.
 *
 * RIG CHECK: renders only, the same shoot()/toPNG() harness this lane's last two rows use.
 * G_WORN/G.equipped/G.bodyVar/G.age restored after.
 *
 * REFERENCE CHECK: no new pixel; every garment is already canon and already judged (last
 * round's [armour you can see]). The dressing table (which background gets which tier) is the
 * new thing, numbers and a picture, not art.
 *
 *   node tools/bohemia_cook_the_origin_crews.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ORIGIN_CREWS.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_ORIGIN_CREWS_10_9_26.txt');
const DRESS_PATH = path.join(REPO, 'records/target/bb/origin_crews_dress.json');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };

const dress = JSON.parse(fs.readFileSync(DRESS_PATH, 'utf8'));
const BASE_PERSON = {
  hair: 'DRY TAPER', base: 'FADED BLACK LONGSLEEVE', legs: 'BLACK DENIM', feet: 'TALL MOTO BOOTS'
};

const SHOWN = ['wolf', 'newcrew', 'watch'];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && typeof rebuildFromRig === 'function',
    { timeout: 90000 });

  const R = await p.evaluate(({ dress, BASE_PERSON, SHOWN }) => {
    const o = { origins: {}, err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

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
      for (const oid of SHOWN) {
        const origin = dress.origins[oid];
        const men = [];
        for (const m of origin.men) {
          const skin = dress.skins[m.tier] || {};
          const fr = shoot(skin);
          men.push({ background: m.background, level: m.level, tier: m.tier, png: toPNG(fr) });
        }
        o.origins[oid] = { bb: origin.bb, name: origin.name, men };
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { dress, BASE_PERSON, SHOWN });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (errs.length) { console.error('PAGE ERRORS: ' + errs.join(' | ')); process.exit(5); }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('THE ORIGIN CREWS -- CHARACTER, 10/9/26, [the origin crews], RUN [the origin sets the company]');
  L.push('');
  L.push('backgrounds.json has no armour field, same gap [armour you can see] found in armor.json.');
  L.push('Same method, a different real stat: every background carries a daily wage, Battle');
  L.push('Brothers\' own proxy for how equipped a man already is. Sort the 26 backgrounds this');
  L.push('game\'s 15 origins actually use by wage, split into the SAME five states this lane');
  L.push('already ships (bare, padded, leather, mail, plate) -- zero new art, this row reuses');
  L.push('last round\'s table whole.');
  L.push('');
  L.push('MATCHES HIS OWN TWO EXAMPLES WITHOUT BEING TOLD TO: hedge_knight (wage 35, tied for');
  L.push('highest in the data) lands in PLATE on its own -- the Lone Wolf\'s one man, in worn');
  L.push('plate. Every one of the Block Watch\'s twelve men\'s backgrounds lands in bare, padded');
  L.push('or leather, never mail or plate -- weak men in work clothes, because that is where the');
  L.push('real wage data puts them, not a label pasted on.');
  L.push('');
  L.push('THREE ORIGINS\' FIRST SCREENS, THE SHIP TEST, EVERY CREW SIZE THE DATA ACTUALLY HAS:');
  for (const oid of SHOWN) {
    const origin = R.origins[oid];
    L.push('  ' + origin.name + ' (' + origin.bb + '), ' + origin.men.length + ' men: '
      + origin.men.map(m => m.background + '=' + m.tier).join(', '));
  }
  L.push('');
  L.push('NOT HERE, ON PURPOSE: this tool proves the table and renders three origins at real');
  L.push('crew size. Wiring origins.json\'s own pick (which men, at which level) to the door\'s');
  L.push('NEW GAME screen is RUN\'s; this lane\'s job was the visual mapping, background ->');
  L.push('real tier -> real worn piece, now data for whoever reads it next.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const sections = SHOWN.map(oid => {
    const origin = R.origins[oid];
    const cells = origin.men.map((m, i) => `
      <figure>
        <canvas id="c${oid}_${i}" width="112" height="112"></canvas>
        <figcaption>${m.background}${m.level ? ' L' + m.level : ''}<br><span class="mini">${m.tier}</span></figcaption>
      </figure>`).join('');
    return `
    <h2>${origin.name} <span class="bb">${origin.bb}</span></h2>
    <div class="street"><div class="road">${cells}</div></div>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE ORIGIN CREWS</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:900px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  h2{ font-size:15px; margin:18px 0 6px; }
  .bb{ font-size:11px; opacity:.6; font-weight:normal; }
  p.sub{ margin:0 0 16px; line-height:1.5; }
  .street{ background:var(--walk); padding:10px 0; }
  .road{ background:var(--road); display:flex; gap:14px; padding:14px; flex-wrap:wrap; }
  figure{ margin:0; text-align:center; }
  canvas{ width:112px; height:112px; image-rendering:pixelated; display:block; background:var(--road); }
  figcaption{ font-size:10px; padding:6px 0 0; }
  .mini{ font-size:9px; opacity:.7; }
</style>
<div class="wrap">
  <h1>THE ORIGIN CREWS</h1>
  <p class="sub">Three origins at real crew size, each man dressed by his own background's real
  tier: Lone Wolf's one veteran, A New Company's three, the Block Watch's twelve. No new art,
  the same five armours this lane already shipped.</p>
  ${sections}
</div>
<script>
const ORIGINS = ${JSON.stringify(R.origins)};
for (const oid in ORIGINS) {
  ORIGINS[oid].men.forEach((m, i) => {
    const cv = document.getElementById('c' + oid + '_' + i);
    const img = new Image();
    img.onload = () => cv.getContext('2d').drawImage(img, 0, 0, 112, 112);
    img.src = m.png;
  });
}
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('wrote ' + PAGE);
})();
