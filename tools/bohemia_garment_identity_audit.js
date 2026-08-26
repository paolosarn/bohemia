/* IS A COAT STILL THE SAME COAT WHEN HE TURNS ROUND? (8/25/26, CHARACTER lane)
 *
 * Paolo, 8/25: "you just have to be intentional with the hairstyles making them looking
 * good and the same and coordinated from all angles."
 *
 * HE SAID IT ABOUT HAIR. IT IS NOT A FACT ABOUT HAIR. genHair branches on back/profile/
 * front and so does every other generator in the wardrobe -- genCoat has a hood branch
 * for N/NE/NW, genTop has a front-opening branch, genPants and genShoes both read the
 * facing. The hair audit found two of fifteen styles that were a mane from the front and
 * a crop from the side, hiding inside a green gate, and it found them on its first run.
 * NOTHING HAS EVER ASKED THE SAME QUESTION OF THE 200 GARMENTS.
 *
 * WHAT IS MEASURED, and the split is the whole method the hair audit proved out:
 *
 *   HEM      how far past the hips a garment falls, in body-heights. A duster is not a
 *            vest from any angle. This is the single strongest identity signal a
 *            garment has, and it is the one that was broken in hair.
 *   RISE     how far up the neck/shoulders it reaches, in body-heights.
 *   SLEEVE   how far down the arm it runs, as a fraction of the arm's own length. A
 *            long-sleeved coat with short sleeves from behind is the same bug.
 *   REACH    how far it stands off the body silhouette, in body-widths.
 *
 * All four describe THE OBJECT. Area does NOT -- a coat shows more of itself from the
 * front than in profile no matter how correct it is -- so area is printed and never
 * judged. Pinning a quantity that legitimately moves is exactly how the hair gate sat
 * green through a shoulder-length haircut rendering as a crop.
 *
 * *** AND THE FIRST RUN OF THIS TOOL MADE THAT EXACT MISTAKE ITSELF. (fixed 8/26) ***
 * It reported 52 garments changing by a tenth of the body or more in one notch, led by
 * ROAD CAPE at 0.94 on SLEEVE -- a cape covering 3% of the arm facing E and 97% facing
 * NE. That is not a defect, it is WHERE THE CAMERA IS: a pack or a cape hangs BEHIND
 * the arms, so from behind it is between you and them and paints them, and from the
 * side the near arm is in front of it and it does not. Sleeve coverage is a property
 * of the VIEW for anything on the back, and judging it there is the same error as
 * pinning area on hair.
 *   SLEEVE is now asked ONLY of layers that have sleeves, and ONLY OFF THE PROFILE --
 *   side-on the near arm sits in front of the torso, so a SLEEVELESS apron overlaps arm
 *   pixels in screen space and scored 0.68. There is no way to tell a sleeve from an
 *   occlusion in a flat grid seen edge-on, so that view is not asked.
 *   EVERY GARMENT IS JUDGED ONLY ON THE FACINGS WHERE IT IS MEANT TO BE SEEN --
 *   shades and masks are not judged from behind, a pack is not judged head-on.
 *
 * *** AND REACH HAD TO COME OUT OF THE JUDGED SET ENTIRELY, WHICH WAS THE HARDEST ONE
 * TO ADMIT BECAUSE I WROTE IT AS AN IDENTITY MEASURE. *** How far a garment stands off
 * the body SIDEWAYS IS NOT A PROPERTY OF THE GARMENT AT ALL: a cap brim projects
 * FORWARD, so head-on it is pointing at the camera and adds nothing to the silhouette,
 * and side-on the whole of it is across the frame. A gas mask's filter snout does the
 * same. That is foreshortening -- the entire reason a three-quarter view looks like
 * anything -- and reporting it is measuring the camera.
 * WHAT SURVIVES IS VERTICAL: hem and rise. A hem does not foreshorten as the head
 * turns, which is exactly why it was the measure that caught the hair bug.
 *
 * *** AND ONE LAST CONFOUND, WHICH COST ME A CHANGE I HAD TO THROW AWAY. *** After all
 * of the above the loudest survivor was SMITH'S APRON: hem 0.188 facing SOUTH and
 * exactly 0.000 from behind. I read that as an apron that stops existing when he turns
 * round, wrote the fix -- draw the skirt's edges where the body does not cover them --
 * and it painted ZERO PIXELS. The apron panel is 17 px wide and his hips are 22. IT IS
 * GENUINELY HIDDEN FROM BEHIND, and the code was right the whole time.
 * A garment can be occluded rather than absent, and a hem measured off the pixels you
 * can SEE cannot tell those apart. So a facing is only judged when the garment shows at
 * least a QUARTER of its own biggest view there. Below that it is behind him, and the
 * question is not answerable from the render. That keeps the check honest without
 * blinding it: SHOULDER LENGTH hair drew plenty of pixels in profile and still had no
 * length, which is exactly the case this must still catch.
 * Fix the ruler, never the target. The reports that survive that are the real ones.
 *
 * AND THE RULER IS ONE NOTCH OF TURN, not max-minus-min: a hem that is genuinely lower
 * at the back than the front is a garment, not a defect. What must never happen is the
 * thing changing between two views a player sees back to back.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own generators.
 *
 *   node tools/bohemia_garment_identity_audit.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const R = await p.evaluate(() => {
    const SKIP = { hair: 1 };                 /* hair has its own audit and its own gate */
    /* WHERE A GARMENT IS MEANT TO BE SEEN. Not a convenience: judging a pair of shades
       from behind, or a backpack head-on, measures the camera and not the garment. */
    const SEEN = { face: ['S', 'SE', 'SW', 'E', 'W'],
                   back: ['E', 'NE', 'N', 'NW', 'W'] };
    /* ONLY THESE LAYERS HAVE SLEEVES. Everything else's arm overlap is view geometry. */
    const HAS_SLEEVES = { base: 1, outer: 1, coverall: 1 };
    const G2 = (window.GARMENTS || []).filter(g => g.st === 'canon' && !SKIP[g.layer]);
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = {}, layerOf = {};
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      /* the BODY, off the part grid -- his painted silhouette, never a guess */
      let bTop = 1e9, bBot = -1, bMn = 1e9, bMx = -1;
      let torsoBot = -1, torsoTop = 1e9;
      let armTop = 1e9, armBot = -1;
      const bodyCol = {};                      /* per row, the body's own left/right */
      for (let i = 0; i < f.grid.length; i++) { const gv = f.grid[i];
        if (!gv) continue;
        const x = i % f.CW, y = (i / f.CW) | 0;
        if (y < bTop) bTop = y; if (y > bBot) bBot = y;
        if (x < bMn) bMn = x; if (x > bMx) bMx = x;
        const r = bodyCol[y] || (bodyCol[y] = { a: 1e9, b: -1 });
        if (x < r.a) r.a = x; if (x > r.b) r.b = x;
        if (gv === 4) { if (y > torsoBot) torsoBot = y; if (y < torsoTop) torsoTop = y; }
        if (gv === 5 || gv === 6) { if (y < armTop) armTop = y; if (y > armBot) armBot = y; } }
      const bH = bBot - bTop + 1, bW = bMx - bMn + 1;
      const armH = Math.max(1, armBot - armTop + 1);
      for (const g of G2) {
        if (SEEN[g.layer] && SEEN[g.layer].indexOf(d) < 0) continue;   /* not meant to be seen this way */
        let o = null; try { o = g.gen(f.grid, f.CW, f.CH, { name: g.n }); } catch (e) {}
        if (!o || typeof o !== 'object') continue;
        let top = 1e9, bot = -1, n = 0, reach = 0, armReach = -1;
        for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
          if (y < top) top = y; if (y > bot) bot = y; n++;
          const r = bodyCol[y];
          if (r) { const e = Math.max(r.a - x, x - r.b); if (e > reach) reach = e; }
          const gv = f.grid[i];
          if ((gv === 5 || gv === 6) && y > armReach) armReach = y; }
        if (!n) continue;
        layerOf[g.n] = g.layer;
        /* SLEEVE: only a layer that has sleeves, and never off the profile -- side-on
           the near arm is in FRONT of the torso, so a sleeveless apron overlaps arm
           pixels in screen space and there is no way to tell that from a sleeve. */
        const sleeveAsked = HAS_SLEEVES[g.layer] && d !== 'E' && d !== 'W';
        (out[g.n] = out[g.n] || {})[d] = {
          hem:    Math.max(0, bot - torsoBot) / bH,
          rise:   Math.max(0, torsoTop - top) / bH,
          sleeve: sleeveAsked ? (armReach < 0 ? 0 : Math.max(0, armReach - armTop) / armH) : null,
          reach:  Math.max(0, reach) / bW,
          area:   n,
        };
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { out, DIRS, layerOf, n: G2.length };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const { out, DIRS, layerOf } = R;
  const KEYS = ['hem', 'rise', 'sleeve'];          /* judged: all three are VERTICAL */
  const SHOWN = ['hem', 'rise', 'sleeve', 'reach'];/* printed: reach is view geometry */
  const rows = [];
  for (const n in out) {
    const per = out[n], notch = {}, span = {};
    const maxArea = Math.max(...DIRS.filter(d => per[d]).map(d => per[d].area));
    for (const k of SHOWN) {
      let g = 0, pair = '';
      for (let i = 0; i < DIRS.length; i++) {
        const a = per[DIRS[i]], c = per[DIRS[(i + 1) % DIRS.length]];
        if (!a || !c) continue;
        if (a[k] === null || c[k] === null) continue;   /* not asked on that facing */
        /* OCCLUDED IS NOT ABSENT: a facing showing under a quarter of the garment's
           biggest view is a facing where the body is in the way, and a hem read off
           pixels you cannot see is not a measurement. */
        if (a.area < maxArea * 0.25 || c.area < maxArea * 0.25) continue;
        const j = Math.abs(a[k] - c[k]);
        if (j > g) { g = j; pair = DIRS[i] + '->' + DIRS[(i + 1) % DIRS.length]; }
      }
      notch[k] = g; span[k] = pair;
    }
    rows.push({ n, layer: layerOf[n], notch, span,
                worst: Math.max(...KEYS.map(k => notch[k])) });
  }
  rows.sort((a, c) => c.worst - a.worst);

  console.log('  IS A GARMENT THE SAME GARMENT FROM EVERY ANGLE?  ' + rows.length + ' canon garments, 8 facings.');
  console.log('  Scale-free, and every one of these describes THE OBJECT, never the view.');
  console.log('  Numbers are the biggest change across ONE NOTCH of turn. Area is not judged.\n');
  console.log('  garment                   layer      hem    rise  sleeve  (reach)  worst notch');
  console.log('  reach is PRINTED, NOT JUDGED: sideways extent foreshortens when he turns.');
  for (const q of rows.slice(0, 24))
    console.log('  ' + q.n.slice(0, 24).padEnd(26) + (q.layer || '').padEnd(9) +
      q.notch.hem.toFixed(3).padStart(7) + q.notch.rise.toFixed(3).padStart(8) +
      q.notch.sleeve.toFixed(3).padStart(8) + q.notch.reach.toFixed(3).padStart(8) +
      ('  ' + q.span[KEYS.reduce((a, k) => q.notch[k] > q.notch[a] ? k : a, 'hem')]).padStart(14));
  if (rows.length > 24) console.log('  ... ' + (rows.length - 24) + ' more, all quieter than these.');

  console.log('');
  for (const k of SHOWN) {
    const w = rows.reduce((a, c) => c.notch[k] > a.notch[k] ? c : a, rows[0]);
    const v = DIRS.filter(d => out[w.n][d] && out[w.n][d][k] !== null).map(d => [d, out[w.n][d][k]]);
    if (!v.length) continue;
    const lo = v.reduce((a, c) => c[1] < a[1] ? c : a), hi = v.reduce((a, c) => c[1] > a[1] ? c : a);
    console.log('  worst ' + k.toUpperCase().padEnd(7) + w.n.slice(0, 24).padEnd(26) +
      hi[0] + ' ' + hi[1].toFixed(3) + '   vs   ' + lo[0] + ' ' + lo[1].toFixed(3) +
      '   (one notch: ' + w.notch[k].toFixed(3) + ' at ' + w.span[k] + ')');
  }
  const tot = k => Math.max(...rows.map(r => r.notch[k]));
  console.log('\n  *** ONE NOTCH OF TURN, WORST ACROSS ALL ' + rows.length + ' GARMENTS: ' +
    KEYS.map(k => k + ' ' + tot(k).toFixed(3)).join('  ') + '   (reach ' + tot('reach').toFixed(3) +
    ', not judged) ***');
  const bad = rows.filter(r => r.worst >= 0.10);
  console.log('  ' + bad.length + ' garment(s) change by a tenth of the body or more in a single notch.');
})();
