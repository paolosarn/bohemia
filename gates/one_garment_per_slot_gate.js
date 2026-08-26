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

    /* 2. NOTHING OF HIS LEAKS THROUGH A WORN GARMENT OF THE SAME SLOT
       EQUIP THE EMPTY SLOTS ON PURPOSE (added 8/22). The first cut of this gate walked
       G.equipped, and hat and glasses are EMPTY in his default equip -- so there was no
       painted layer on the body to leak and both slots were skipped in silence. Their
       entry in the map was an unproven claim sitting inside a green gate, which is the
       same defect as a check that passes vacuously. Measured once equipped:
           hat/durag       1,488 painted px with nothing worn, 0 under a hat
           glasses/shades    216 painted px with nothing worn, 0 under a face garment
       so the pairing is real for all seven. It is exercised here every run now. */
    const leaks = [];
    const slots = new Set(Object.keys(PAIR));
    for (const slot of Object.keys(G.equipped)) slots.add(slot);
    for (const slot of slots) {
      const wl = PAIR[slot]; if (!wl) continue;
      let key = G.equipped[slot];
      const restore = {};
      if (!key) {
        key = Object.keys(PD.layers).filter(k => k.indexOf(slot + '/') === 0)[0];
        if (!key) continue;
        restore[slot] = G.equipped[slot]; G.equipped[slot] = key;
      }
      /* ISOLATE THE SLOT FROM WHAT COVERS IT (added 8/22, caught by the vacuity check
         above on its first run). PD.meta.order draws shirt BEFORE jacket, and his
         painted fuzz jacket covers his painted cowl-hoodie completely -- so the shirt
         slot showed ZERO painted pixels even with nothing worn, and its "no leak"
         result was measuring an empty stage. Clear the layers drawn AFTER this one for
         the duration of the test. Both the bare and the worn reading use the SAME
         configuration, so the comparison stays honest; all that changes is that the
         layer under test is actually on screen to be leaked. */
      const ord = (PD.meta && PD.meta.order) || [];
      const after = ord.slice(ord.indexOf(slot) + 1);
      for (const s2 of after) { if (G.equipped[s2] && !(s2 in restore)) { restore[s2] = G.equipped[s2]; G.equipped[s2] = ''; } }
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
      /* AND IT MUST HAVE HAD SOMETHING TO HIDE. A zero that was always zero proves
         nothing -- with the slot empty, this check would pass on a broken build. */
      window.G_WORN = null;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const bareF = buildFrame('S', 'idle', 0);
      let bareN = 0;
      for (let i = 0; i < bareF.CW * bareF.CH; i++) { const c = bareF.px[i]; if (!c) continue;
        for (const r of ramp) if (c[0] === r[0] && c[1] === r[1] && c[2] === r[2]) { bareN++; break; } }
      leaks.push({ slot, key, wearing: pick.n, n, bare: bareN });
      for (const s2 in restore) G.equipped[s2] = restore[s2];
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

    /* 4. *** AND EVERY GARMENT HE CAN PUT ON ACTUALLY APPEARS. ***
       Added 8/25 after the garment identity audit found SEVENTEEN canon garments --
       every knit cap, watch cap, field cap, work cap and slouch beanie, the rice
       farmer hat, both pairs of shades -- that changed ZERO PIXELS OF THE FRAME when
       worn. Not thin, not misplaced: absent. He could equip one and nothing happened.
       WHY NO GATE SAW IT: the headwear gate lifts genHat OUT of the alpha and runs it
       against a synthetic grid, so BAKED and HAT_MAX_Y are undefined there and the
       durag-line path -- the one that was broken -- never executes. It also holds "a
       hat never crosses the durag line", and A HAT THAT DRAWS NOTHING CROSSES NOTHING.
       A check a corpse passes is not checking for life.
       So this one measures THE PIXELS HE ACTUALLY SEES, wearing it, on the real frame,
       which is the only surface that could ever have caught it. A garment legitimately
       invisible from behind (shades, a mask) is judged on the facings where it shows. */
    const VISIBLE = { face: ['S', 'SE', 'E'], back: ['N', 'NE', 'E'] };
    const invisible = [];
    /* *** AND THE BASELINE HAS TO BE THE SAME BODY, OR THIS MEASURES THE WRONG THING.
       The first cut of this check compared "wearing it" against "wearing nothing" and
       passed the mutation that reintroduced the bug. Reason: putting a garment on
       SUPPRESSES the painted layer of that slot (rule 2 above), so the frame changed by
       his durag DISAPPEARING even when the hat drew nothing. It was measuring "something
       changed", not "the garment appeared" -- the same failure as every lying picture
       this week. So the painted layer of the slot under test is pulled in BOTH frames,
       and the only thing that can differ is the garment itself. */
    const SLOTPD = { head: 'hat', face: 'glasses', base: 'shirt', outer: 'jacket',
                     legs: 'pants', feet: 'shoes' };
    const keepEq = {}; for (const k in G.equipped) keepEq[k] = G.equipped[k];
    for (const g of CANON) {
      if (g.layer === 'hair') continue;                 /* hair has its own gate */
      const dirs = VISIBLE[g.layer] || ['S', 'E', 'N'];
      const pdSlot = SLOTPD[g.layer];
      let best = 0;
      for (const d of dirs) {
        if (pdSlot) G.equipped[pdSlot] = '';
        window.G_WORN = {};
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const a = buildFrame(d, 'idle', 0);
        window.G_WORN = {}; window.G_WORN[g.layer] = g.n;
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const c2 = buildFrame(d, 'idle', 0);
        let n2 = 0;
        for (let i = 0; i < a.px.length; i++) { const x = a.px[i], y = c2.px[i];
          if (!x !== !y || (x && y && (x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2]))) n2++; }
        if (n2 > best) best = n2;
        if (pdSlot) G.equipped[pdSlot] = keepEq[pdSlot];
      }
      if (best === 0) invisible.push(g.n + ' [' + g.layer + ']');
    }
    for (const k in keepEq) G.equipped[k] = keepEq[k];

    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { dflt, leaks, facePx, invisible, sweptN: CANON.filter(g => g.layer !== 'hair').length };
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
  /* THE ZERO ABOVE MUST BE AN EARNED ZERO. Every slot has to draw real painted pixels
     when nothing is worn, or its zero is vacuous and would pass on a broken build. */
  const vac = R.leaks.filter(q => !q.bare);
  ok('every slot actually had something to hide (' + R.leaks.map(q => q.slot + ':' + q.bare).join(' ') +
     (vac.length ? ' -- VACUOUS: ' + vac.map(q => q.slot).join(', ') : '') + ')', vac.length === 0);
  ok('all seven clothing slots were exercised, none skipped for being empty (' +
     R.leaks.length + '/7: ' + R.leaks.map(q => q.slot).join(' ') + ')', R.leaks.length === 7);

  ok('HIS FACE SURVIVES BEING FULLY DRESSED (' + R.facePx + ' painted face pixels on screen)',
     R.facePx > 0);

  ok('*** EVERY GARMENT HE CAN PUT ON ACTUALLY APPEARS ON THE FRAME *** (' +
     (R.sweptN - R.invisible.length) + '/' + R.sweptN + ' canon garments swept on the real ' +
     'worn path' + (R.invisible.length ? ' -- DRAWS NOTHING: ' + R.invisible.slice(0, 20).join(', ') : '') + ')',
     R.invisible.length === 0);

  done();
})();
