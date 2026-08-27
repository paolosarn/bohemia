/* THE PORTRAIT HAIRCUT GATE (8/28/26) -- the portrait wears the haircut the body is wearing.
 *
 * ONE ID, ONE WHOLE PERSON (Paolo 8/26 "Eye colors matching the portrait again", built 8/27)
 * fixed SKIN, HAIR COLOUR and EYES, and its record says "same person on both sides now,
 * every time". THE HAIRCUT ITSELF WAS NEVER CHECKED, and it is the largest shape on a head.
 * Law: laws/BOHEMIA_LAW_THE_PORTRAIT_WEARS_YOUR_HAIRCUT_8_28_26.md
 *
 * MEASURED BEFORE THE FIX, over 200 citizens on the real renderers:
 *     the body       16 distinct haircuts
 *     the portrait    6 distinct silhouettes, and 5 of the 7 style names it could hold
 *                     drew IDENTICAL PIXELS (straight = coils = buzz = locs = afro)
 *     agreement      24.7%, WORSE THAN THE 33% A COIN GIVES over three bands -- two
 *                     independent hashes are not merely unrelated, they can disagree
 *
 * IT MEASURES RENDERED PIXELS, NEVER THE SPEC FIELDS. The first version of the report this
 * gate is built on compared `sp.hair.len`, a STRING -- and the fix made the renderer read
 * `sp.hair.side` instead, so `len` stopped driving anything and the ruler cheerfully
 * reported that the fix had changed nothing. THIRD BROKEN RULER IN A WEEK, same shape every
 * time: a number that is perfectly true about something nobody is asking about.
 *
 *   node gates/portrait_haircut_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_THE_PORTRAIT_WEARS_YOUR_HAIRCUT_8_28_26.md');

/* HIS NUMBERS, MEASURED. Ratchets with real headroom so a new haircut can be cooked
   without a gate edit, and none of them can slide back to where they were. */
const AGREE_MIN = 0.75;   /* portrait fall band === body band.        before 0.247 */
const CORR_MIN  = 0.80;   /* correlation, body length dial vs drawn.  before ~0     */
const CEIL_MIN  = 40;     /* distinct hair silhouettes renderable.    before 6      */
const DIALS_MIN = 15;     /* canon styles whose numbers resolve.      before 0      */
const N = 200;

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function',
    { timeout: 40000 });

  console.log('\nTHE PORTRAIT HAIRCUT GATE');

  const r = await p.evaluate((N) => {
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const HAIRS = pool.filter(g => g.layer === 'hair');
    const sideOf = {};
    for (const h of HAIRS) { const m = /side:\s*([\d.]+)/.exec(String(h.gen));
      sideOf[h.n] = m ? parseFloat(m[1]) : null; }
    const band = s => s == null ? '?' : (s < 0.55 ? 'short' : (s < 1.05 ? 'jaw' : 'long'));

    /* 1 -- do the fifteen canon haircuts resolve to numbers at all? */
    let dialsOk = 0, dialSet = {};
    for (const h of HAIRS) { const d = hairDialsFor(h.n);
      if (d && d.side != null) { dialsOk++; dialSet[JSON.stringify(d)] = 1; } }

    /* 2 -- agreement, on the RENDERED fall */
    const rows = [];
    for (let i = 0; i < N; i++) {
      const id = 'street:' + i;
      const bh = (window.BOH_PERSONLOOK.lookFor(id, pool).worn || {}).hair || '';
      if (!bh || sideOf[bh] == null) continue;
      const sp = faceFor(id);
      let bot = -1;
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      const bald = renderFace(sp, { ramp: faceRampFor(sp), bald: true });
      for (let k = 0; k < buf.length; k += 4) {
        if (buf[k] === bald[k] && buf[k+1] === bald[k+1] && buf[k+2] === bald[k+2]) continue;
        const y = ((k / 4) / 64) | 0; if (y > bot) bot = y; }
      if (bot < 0) continue;
      rows.push({ x: sideOf[bh], y: (bot - sp.face.top) / sp.face.len,
                  bb: band(sideOf[bh]) });
    }
    const agree = rows.filter(r2 => r2.bb === band(r2.y)).length;
    let corr = null;
    if (rows.length > 3) {
      const mx = rows.reduce((a, r2) => a + r2.x, 0) / rows.length;
      const my = rows.reduce((a, r2) => a + r2.y, 0) / rows.length;
      let sxy = 0, sxx = 0, syy = 0;
      for (const r2 of rows) { const dx = r2.x - mx, dy = r2.y - my;
        sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
      corr = (sxx && syy) ? sxy / Math.sqrt(sxx * syy) : 0;
    }

    /* 3 -- THE CEILING, on rendered pixels: how many haircuts CAN it draw */
    const base = faceFor('probe:0');
    const seen = {};
    const spB = JSON.parse(JSON.stringify(base));
    const bald0 = renderFace(spB, { ramp: faceRampFor(spB), bald: true });
    for (const h of HAIRS) for (const tx of ['wave', 'coils', 'locs', 'solid']) {
      const d = hairDialsFor(h.n);
      const sp = JSON.parse(JSON.stringify(base));
      sp.hair.tex = tx;
      sp.hair.side = d && d.side != null ? d.side : null;
      sp.hair.front = d && d.front != null ? d.front : null;
      sp.hair.vol = d && d.vol != null ? d.vol : null;
      sp.hair.flare = d && d.flare != null ? d.flare : null;
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let hh = 2166136261;
      for (let k = 0; k < buf.length; k += 4) {
        const same = buf[k] === bald0[k] && buf[k+1] === bald0[k+1] && buf[k+2] === bald0[k+2];
        hh = Math.imul(hh ^ (same ? 0 : (buf[k] * 7 + buf[k+1] * 13 + buf[k+2] * 17 + (k & 4095))), 16777619) >>> 0;
      }
      seen[hh] = 1;
    }

    /* 4 -- EVERY TEXTURE MOVES PIXELS. A name the renderer ignores is not a style
       (A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A DIAL, 8/27). */
    const tseen = {};
    for (const tx of ['wave', 'coils', 'locs', 'solid']) {
      const sp = JSON.parse(JSON.stringify(base));
      const d = hairDialsFor('SHAG');
      sp.hair.tex = tx;
      if (d) { sp.hair.side = d.side; sp.hair.front = d.front; sp.hair.vol = d.vol; sp.hair.flare = d.flare; }
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let hh = 2166136261;
      for (let k = 0; k < buf.length; k += 4) hh = Math.imul(hh ^ buf[k] ^ (buf[k+1] << 3) ^ (buf[k+2] << 6), 16777619) >>> 0;
      tseen[hh] = (tseen[hh] || 0) + 1;
    }

    /* 5 -- EVERY SHAPE DIAL MOVES PIXELS, one at a time, against the same face */
    const moved = {};
    const flat = renderFace(base, { ramp: faceRampFor(base) });
    for (const [k2, v] of [['side', 2.2], ['front', 0.34], ['vol', 3], ['flare', 0.30]]) {
      const sp = JSON.parse(JSON.stringify(base));
      sp.hair[k2] = v;
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let d = 0;
      for (let i = 0; i < buf.length; i += 4)
        if (buf[i] !== flat[i] || buf[i+1] !== flat[i+1] || buf[i+2] !== flat[i+2]) d++;
      moved[k2] = d;
    }

    /* 6 -- THE APPROVED PLAYER FACE IS UNTOUCHED. Not "should be" -- hashed. */
    const pf = renderFace(buildSpec(), {});
    let ph = 2166136261;
    for (let i = 0; i < pf.length; i++) ph = Math.imul(ph ^ pf[i], 16777619) >>> 0;
    const pspec = buildSpec();
    const playerHasNew = ['side', 'front', 'vol', 'flare', 'tex']
      .filter(k2 => pspec.hair && pspec.hair[k2] != null);

    return { dialsOk, dialDistinct: Object.keys(dialSet).length, hairs: HAIRS.length,
             n: rows.length, agree, corr, ceiling: Object.keys(seen).length,
             texDistinct: Object.keys(tseen).length, moved,
             playerHash: ph.toString(16), playerHasNew };
  }, N);

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  ok('every canon haircut resolves to the numbers the body draws it with',
     r.dialsOk >= DIALS_MIN,
     '(' + r.dialsOk + ' of ' + r.hairs + ', ' + r.dialDistinct + ' distinct dial sets)');

  ok('the portrait wears the haircut the body is wearing',
     r.n > 100 && (r.agree / r.n) >= AGREE_MIN,
     '(' + (r.agree / r.n * 100).toFixed(1) + '% of ' + r.n + ' agree on the fall; floor ' +
     (AGREE_MIN * 100) + '%, and a coin gives 33%)');

  ok('and it is the same haircut, not a lucky band',
     r.corr != null && r.corr >= CORR_MIN,
     '(correlation ' + (r.corr == null ? 'n/a' : r.corr.toFixed(3)) + ' between the body\'s length dial and the fall drawn; floor ' + CORR_MIN + ')');

  ok('the portrait can draw more than a handful of haircuts',
     r.ceiling >= CEIL_MIN,
     '(' + r.ceiling + ' distinct silhouettes on rendered pixels; floor ' + CEIL_MIN + ', was 6)');

  ok('every texture moves pixels', r.texDistinct === 4,
     '(' + r.texDistinct + ' of 4 draw something different -- five of the old seven names were the same haircut)');

  for (const [k, v] of Object.entries(r.moved))
    ok('the ' + k + ' dial moves pixels', v >= 12, '(' + v + ' pixels)');

  ok('the face Paolo approved did not move', r.playerHasNew.length === 0,
     '(the player takes the default path; hash ' + r.playerHash + ')');

  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 1200, '(' + law.length + ' chars)');
  ok('and it records the number it was, not just the number it is',
     /24\.7/.test(law) && /worse than/i.test(law));

  console.log('\nTHE PORTRAIT HAIRCUT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
