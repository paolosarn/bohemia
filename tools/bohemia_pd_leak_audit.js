/* DOES ANY OTHER PAINTED LAYER LEAK THE WAY HIS BOB DID? (8/21/26, CHARACTER lane)
 *
 * Yesterday's fix: his painted hair/curtain-bob was still drawing UNDER a worn
 * hairstyle, and in profile it stuck out past the part grid as a bright blob. The fix
 * was to stop drawing the PD hair layer while a hair garment is worn -- nobody wears
 * two hairstyles.
 *
 * BUT HAIR IS ONE OF NINE PD LAYERS, and six of them have generated counterparts:
 *   hat/durag                     vs the generated hats        (slot head)
 *   shirt/cowl-hoodie             vs the generated tops        (slot base)
 *   jacket/japanese-fuzz_hoodDown vs the generated coats       (slot outer)
 *   pants/leather-legwarmer       vs the generated pants       (slot legs)
 *   shoes/balenciaga              vs the generated shoes       (slot feet)
 *   glasses/shades                vs the generated eyewear     (slot face)
 * If the same double happens on any of those, it is the same visible defect he
 * complained about, in a different place.
 *
 * (body/male-mid is his body and facial/punk-face is his face. Neither has a generated
 * counterpart and BOTH MUST ALWAYS DRAW -- a generated garment never replaces a face.
 * They are measured here too, but as a control: a leak there is not a defect.)
 *
 * THE MEASUREMENT: for each slot, dress him in a canon garment of that slot, render all
 * 8 facings on the REAL worn path, and count pixels still showing that PD layer's own
 * ramp colours. Colours shared with the body/skin ramp are excluded, or the count is
 * measuring his skin rather than the leak.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own render.
 *
 *   node tools/bohemia_pd_leak_audit.js
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
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    /* PD slot -> the G_WORN layer that would replace it. THESE NAMES ARE READ, NOT
       GUESSED: the first cut of this tool assumed the PD slots were called base/legs/
       feet/outer like the wardrobe's layers. They are not -- they are shirt/pants/
       shoes/jacket -- so every pairing missed and the tool cheerfully reported "no
       generated counterpart" for all six, which reads exactly like a clean audit.
       A LOOKUP THAT MISSES SILENTLY IS THE SAME BUG AS A GATE THAT PASSES VACUOUSLY. */
    const PAIR = { hair: 'hair', hat: 'head', shirt: 'base', jacket: 'outer',
                   pants: 'legs', shoes: 'feet', glasses: 'face' };
    const order = (PD.meta && PD.meta.order) || [];
    /* which PD key sits in which slot, straight off what the renderer equips */
    const equipped = {};
    for (const slot of order) if (G.equipped[slot]) equipped[slot] = G.equipped[slot];

    /* colours that also belong to his body or skin are not evidence of a leak */
    const shared = new Set();
    for (const k of ['body/male-mid', 'skin']) for (const c of (PD.ramps[k] || [])) shared.add(c.join(','));

    const keep = window.G_WORN;
    const out = [];
    for (const slot in equipped) {
      const key = equipped[slot];
      const ramp = (PD.ramps[key] || []).filter(c => !shared.has(c.join(',')));
      const wearLayer = PAIR[slot];
      const pick = wearLayer ? CANON.filter(g => g.layer === wearLayer)[0] : null;
      if (!pick || !ramp.length) { out.push({ slot, key, skip: !wearLayer ? 'HIS OWN, must always draw' : (!pick ? 'NO CANON GARMENT IN LAYER ' + wearLayer + ' -- pairing unproven' : 'no colours of its own') }); continue; }
      window.G_WORN = { hair: 'SUN CROP', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
      window.G_WORN[wearLayer] = pick.n;
      let leaked = 0; const per = {};
      for (const d of DIRS) {
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const f = buildFrame(d, 'idle', 0);
        let n = 0;
        for (let i = 0; i < f.CW * f.CH; i++) { const c = f.px[i]; if (!c) continue;
          for (const r of ramp) if (c[0] === r[0] && c[1] === r[1] && c[2] === r[2]) { n++; break; } }
        per[d] = n; leaked += n;
      }
      out.push({ slot, key, wearing: pick.n, leaked, per });
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { out, equipped };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  console.log('  PAINTED LAYERS STILL SHOWING WHILE A GENERATED GARMENT OF THE SAME SLOT IS WORN\n');
  console.log('  slot    painted layer                    worn instead        leaked   S  SE   E  NE   N  NW   W  SW');
  for (const q of R.out) {
    if (q.skip) { console.log('  ' + q.slot.padEnd(8) + q.key.padEnd(34) + '(' + q.skip + ')'); continue; }
    const d = ['S','SE','E','NE','N','NW','W','SW'].map(k => String(q.per[k]).padStart(4)).join('');
    console.log('  ' + q.slot.padEnd(8) + q.key.padEnd(34) + String(q.wearing).padEnd(20) +
      String(q.leaked).padStart(6) + '  ' + d);
  }
})();
