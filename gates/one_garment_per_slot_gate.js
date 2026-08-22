/* YOU WEAR ONE GARMENT PER SLOT (8/21/26, CHARACTER lane)
 *
 * Paolo, 8/21: "Continue fixing east and west hair pls"
 *
 * WHAT HE WAS LOOKING AT: a bright blob over the forehead on both profiles, in every
 * hairstyle. It was HIS OWN painted hair/curtain-bob, still drawing underneath the
 * hairstyle he had put on. Front-on the generated hair covered it and the double was
 * invisible; in profile it is not, because a generator spans the PART GRID and his
 * paint reaches two cells past that grid at the crown, so the painted twin peeked out
 * along the edge. His bob's ramp holds a near-white, and that is what showed.
 *
 * *** AND IT WAS NEVER A HAIR BUG. *** Fixing hair and stopping there would have left
 * the same defect in three more places. Audited afterwards with
 * tools/bohemia_pd_leak_audit.js, on the real worn path, all 8 facings:
 *
 *     pants/leather-legwarmer   68 px leaking through BLUE JEANS
 *     shoes/balenciaga          61 px leaking through WHITE SNEAKERS
 *     jacket/japanese-fuzz      18 px leaking through WASTELAND DUSTER
 *     shirt/cowl-hoodie          0
 *     hair/curtain-bob           0   (fixed the day before)
 *
 * THE LAW THIS HOLDS: if a generated garment of a slot is worn, the painted layer of
 * that same slot is not drawn. Nobody wears two pairs of trousers.
 *
 * TWO THINGS IT MUST NOT BREAK, both asserted below:
 *   HIS DEFAULT LOOK. G_WORN is null until something dresses him, so out of the box he
 *   wears his painted outfit exactly as painted. Measured: 32 frames byte-identical.
 *   HIS FACE AND HIS BODY. body/male-mid and facial/punk-face have NO generated
 *   counterpart and must always draw. A garment never replaces a face. The gate fails
 *   if either is ever added to the suppression map.
 *
 * RIG LAW IS UNTOUCHED: nothing of his is edited. One layer is not DRAWN while its slot
 * is filled, and it returns the moment the slot is empty.
 *
 * HAIR'S DEEP SWEEP LIVES IN hair_gate.js (15 styles x 8 facings, counted by his bob's
 * own ramp). This gate checks ONE garment per slot across ALL slots plus the two
 * invariants above; the two overlap on hair on purpose, because hair is where the
 * defect was worst and losing that coverage to tidiness would be a bad trade.
 *
 *   node gates/one_garment_per_slot_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('=== ONE GARMENT PER SLOT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  ok('the alpha is there', fs.existsSync(ALPHA));
  if (!fs.existsSync(ALPHA)) done();
  const src = fs.readFileSync(ALPHA, 'utf8');

  /* HIS FACE AND BODY ARE NOT GARMENT SLOTS. Read the map out of the source and assert
     what is NOT in it -- a suppression map that grew a 'facial' entry would delete his
     face the moment anything set G_WORN.face, and no pixel test elsewhere would say so
     in those words. */
  const m = src.match(/const _wl=\(\{([^}]*)\}\)\[slot\]/);
  ok('the slot map is in the render path where the layers are drawn', !!m);
  if (m) {
    const keys = m[1].split(',').map(s => s.split(':')[0].trim());
    ok('his BODY is never suppressed by a garment (map: ' + keys.join(' ') + ')', keys.indexOf('body') < 0);
    ok('his FACE is never suppressed by a garment', keys.indexOf('facial') < 0);
    ok('every suppressible slot is a real clothing slot',
      keys.every(k => ['hair', 'hat', 'shirt', 'jacket', 'pants', 'shoes', 'glasses'].indexOf(k) >= 0));
  }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });
  ok('the page loaded without throwing (' + (errs[0] || 'clean') + ')', errs.length === 0);

  const R = await pg.evaluate(() => {
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const PAIR = { hair: 'hair', hat: 'head', shirt: 'base', jacket: 'outer',
                   pants: 'legs', shoes: 'feet', glasses: 'face' };
    const shared = new Set();
    for (const k of ['body/male-mid', 'skin']) for (const c of (PD.ramps[k] || [])) shared.add(c.join(','));

    /* 1. HIS DEFAULT LOOK, with nothing worn */
    const keep = window.G_WORN;
    window.G_WORN = null;
    const dflt = [];
    for (const d of DIRS) {
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      let lit = 0, ownPaint = 0;
      const own = new Set();
      for (const slot in G.equipped) { const k = G.equipped[slot]; if (!k) continue;
        for (const c of (PD.ramps[k] || [])) if (!shared.has(c.join(','))) own.add(c.join(',')); }
      for (let i = 0; i < f.CW * f.CH; i++) { const c = f.px[i]; if (!c) continue;
        lit++; if (own.has(c.join(','))) ownPaint++; }
      dflt.push({ d, lit, ownPaint });
    }

    /* 2. NOTHING OF HIS LEAKS THROUGH A WORN GARMENT OF THE SAME SLOT */
    const leaks = [];
    for (const slot in G.equipped) {
      const key = G.equipped[slot]; if (!key) continue;
      const wl = PAIR[slot]; if (!wl) continue;
      const ramp = (PD.ramps[key] || []).filter(c => !shared.has(c.join(',')));
      const pick = CANON.filter(g => g.layer === wl)[0];
      if (!pick || !ramp.length) continue;
      window.G_WORN = { hair: 'SUN CROP', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
      window.G_WORN[wl] = pick.n;
      let n = 0;
      for (const d of DIRS) {
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const f = buildFrame(d, 'idle', 0);
        for (let i = 0; i < f.CW * f.CH; i++) { const c = f.px[i]; if (!c) continue;
          for (const r of ramp) if (c[0] === r[0] && c[1] === r[1] && c[2] === r[2]) { n++; break; } }
      }
      leaks.push({ slot, key, wearing: pick.n, n });
    }

    /* 3. AND HIS FACE SURVIVES BEING DRESSED. The failure this exists to catch is a
       suppression map that grows an entry it should not: dress him head to toe and his
       painted face must still be on the frame. */
    window.G_WORN = { hair: 'SUN CROP', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS',
                      outer: (CANON.filter(g => g.layer === 'outer')[0] || {}).n,
                      head: (CANON.filter(g => g.layer === 'head')[0] || {}).n,
                      face: (CANON.filter(g => g.layer === 'face')[0] || {}).n };
    const faceRamp = (PD.ramps['facial/punk-face'] || []).filter(c => !shared.has(c.join(',')));
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    const ff = buildFrame('S', 'idle', 0);
    let facePx = 0;
    for (let i = 0; i < ff.CW * ff.CH; i++) { const c = ff.px[i]; if (!c) continue;
      for (const r of faceRamp) if (c[0] === r[0] && c[1] === r[1] && c[2] === r[2]) { facePx++; break; } }

    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { dflt, leaks, facePx };
  });

  await b.close();

  /* HIS DEFAULT LOOK STILL WEARS HIS OWN PAINT. If the suppression ever fired with an
     empty G_WORN this number would collapse, and the character he opens the game on
     would silently lose his clothes. */
  const bare = R.dflt.filter(q => q.ownPaint === 0).map(q => q.d);
  ok('with nothing worn, his painted outfit still draws on every facing (' +
     R.dflt.map(q => q.d + ':' + q.ownPaint).join(' ') + (bare.length ? ' -- BARE ON ' + bare.join(',') : '') + ')',
     bare.length === 0);

  const bad = R.leaks.filter(q => q.n > 0);
  ok('no painted layer shows through a worn garment of the same slot, any facing (' +
     R.leaks.map(q => q.slot + ':' + q.n).join(' ') +
     (bad.length ? ' -- LEAKING: ' + bad.map(q => q.key + ' under ' + q.wearing + ' by ' + q.n).join(', ') : '') + ')',
     bad.length === 0);

  ok('HIS FACE SURVIVES BEING FULLY DRESSED (' + R.facePx + ' painted face pixels on screen)',
     R.facePx > 0);

  done();
})();
