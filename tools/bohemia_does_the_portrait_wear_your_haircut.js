/* DOES THE PORTRAIT WEAR THE HAIRCUT THE BODY IS WEARING? (8/28/26, CHARACTER lane).
 *
 * ONE ID, ONE WHOLE PERSON (8/27) fixed SKIN, HAIR COLOUR and EYES, and the record for it
 * says "same person on both sides now, every time". This measures whether that sentence is
 * true of the one field nobody checked: THE HAIRCUT ITSELF.
 *
 * The body picks from FIFTEEN canon hairstyles through the wardrobe. The portrait picks
 * `hair.style` from a coin flip between 'wavy_mid' and 'curly', and `hair.len` from three
 * lengths, with NO reference to the body at all. So the arithmetic before running anything
 * says the two can agree by accident and nothing else, but the arithmetic is not the
 * measurement -- WHEN A NUMBER DISAGREES WITH HIM ABOUT A PICTURE, GO AND LOOK (8/27), and
 * the same discipline applies before you accuse the code of something.
 *
 * WHAT IT REPORTS
 *   1. what the BODY has on its head, over N citizens, and how often it is even set
 *   2. what the PORTRAIT has, and how many distinct hair looks exist across N portraits
 *   3. AGREEMENT: for each citizen, does the portrait's length band match the body's?
 *      (Style cannot be compared until the portrait has more than two, which is the point.)
 *   4. THE VARIETY CEILING: how many hair silhouettes the portrait renderer can express at
 *      all, counted on RENDERED PIXELS rather than on the names in the spec -- a name the
 *      renderer never reads is not a style (A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A
 *      DIAL, 8/27, which cost that turn twice).
 *
 * RIG CHECK (RIG IS LAW, 7/26): measures and prints. Writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: faceFor + renderFace + NPC_FACTORY (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own renderers.
 *
 *   node tools/bohemia_does_the_portrait_wear_your_haircut.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && window.BOH_PERSONLOOK,
    { timeout: 40000 });

  const out = await p.evaluate(() => {
    const N = 200;
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const bodyHair = {}, portStyle = {}, portLen = {};
    const rows = [];
    let bodySet = 0;

    /* which length band a canon hairstyle falls in, off its OWN `side` dial rather than
       off its name -- the dial is what the renderer reads, so the dial is the truth. */
    const HAIRS = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const sideOf = {};
    for (const h of HAIRS) {
      const m = /side:\s*([\d.]+)/.exec(String(h.gen));
      sideOf[h.n] = m ? parseFloat(m[1]) : null;
    }
    const bandOf = s => s == null ? '?' : (s < 0.55 ? 'short' : (s < 1.05 ? 'jaw' : 'long'));

    for (let i = 0; i < N; i++) {
      const id = 'street:' + i;
      const lk = window.BOH_PERSONLOOK.lookFor(id, pool);
      const bh = (lk.worn || {}).hair || '';
      if (bh) bodySet++;
      bodyHair[bh || '(none)'] = (bodyHair[bh || '(none)'] || 0) + 1;
      const sp = faceFor(id);
      portStyle[sp.hair.tex || sp.hair.style] = (portStyle[sp.hair.tex || sp.hair.style] || 0) + 1;
      /* *** MEASURE THE PIXELS, NOT THE FIELD. ***
         The first cut of this compared sp.hair.len, a STRING, against the body's band.
         The fix made renderFace read sp.hair.side instead, so `len` stopped driving
         anything -- and the ruler went on reading it and reported the fix had changed
         nothing. THIRD BROKEN RULER THIS WEEK, and the same shape every time: a number
         that is true about something nobody is asking about. So this renders the face
         and finds where the hair actually stops. */
      let bot = -1;
      try {
        const buf = renderFace(sp, { ramp: faceRampFor(sp) });
        const bald = renderFace(sp, { ramp: faceRampFor(sp), bald: true });
        for (let k = 0; k < buf.length; k += 4) {
          if (buf[k] === bald[k] && buf[k+1] === bald[k+1] && buf[k+2] === bald[k+2]) continue;
          const y = ((k / 4) / 64) | 0; if (y > bot) bot = y;
        }
      } catch (e) {}
      const Y0 = sp.face.top, flen = sp.face.len;
      const drop = bot < 0 ? null : (bot - Y0) / flen;      /* fall, in face-lengths */
      portLen[bandOf(drop)] = (portLen[bandOf(drop)] || 0) + 1;
      rows.push({ id, body: bh, bodyBand: bandOf(sideOf[bh]), bodySide: sideOf[bh],
                  pLen: bandOf(drop), pDrop: drop, pStyle: sp.hair.tex || sp.hair.style });
    }
    const cmp = rows.filter(r => r.bodyBand !== '?' && r.pDrop != null);
    const lenAgree = cmp.filter(r => r.bodyBand === r.pLen).length;
    /* and the honest continuous version: does a longer haircut on the body actually
       produce a longer fall in the portrait? A band match can be luck; a correlation
       across 186 people cannot. */
    let corr = null;
    if (cmp.length > 3) {
      const xs = cmp.map(r => r.bodySide), ys = cmp.map(r => r.pDrop);
      const mx = xs.reduce((a, b2) => a + b2, 0) / xs.length;
      const my = ys.reduce((a, b2) => a + b2, 0) / ys.length;
      let sxy = 0, sxx = 0, syy = 0;
      for (let k = 0; k < xs.length; k++) { const dx = xs[k] - mx, dy = ys[k] - my;
        sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
      corr = (sxx && syy) ? +(sxy / Math.sqrt(sxx * syy)).toFixed(3) : null;
    }

    /* 4 -- THE VARIETY CEILING, ON RENDERED PIXELS.
       Render every (style, len) the spec can name and hash only the hair pixels, so two
       names that draw the same thing collapse into one. */
    /* *** AND THE CEILING PROBE WAS SETTING DEAD FIELDS TOO. *** It drove style/len,
       which the new dials override, so all 21 combinations rendered identically and it
       reported a ceiling of ONE on a renderer that had just grown five dials. It probes
       the DIALS the renderer reads now: the fifteen real haircuts, plus the textures. */
    const TEX = ['wave', 'coils', 'locs', 'solid'];
    const seen = {}, byName = {};
    const base = faceFor('probe:0');
    const COMBOS = [];
    for (const h of HAIRS) for (const tx of TEX)
      COMBOS.push([h.n, tx, hairDialsFor(h.n)]);
    for (const [nm, tx, dl] of COMBOS) {
      const sp = JSON.parse(JSON.stringify(base));
      const st = nm, ln = tx;
      sp.hair.tex = tx;
      sp.hair.side = dl && dl.side != null ? dl.side : null;
      sp.hair.front = dl && dl.front != null ? dl.front : null;
      sp.hair.vol = dl && dl.vol != null ? dl.vol : null;
      sp.hair.flare = dl && dl.flare != null ? dl.flare : null;
      let buf; try { buf = renderFace(sp, { ramp: faceRampFor(sp) }); } catch (e) { continue; }
      /* hash against a BALD render so only hair pixels count */
      const spB = JSON.parse(JSON.stringify(base));
      let bald; try { bald = renderFace(spB, { ramp: faceRampFor(spB), bald: true }); } catch (e) { bald = null; }
      let h = 2166136261;
      for (let k = 0; k < buf.length; k += 4) {
        const same = bald && buf[k] === bald[k] && buf[k+1] === bald[k+1] && buf[k+2] === bald[k+2];
        const v = same ? 0 : (buf[k] * 7 + buf[k+1] * 13 + buf[k+2] * 17 + (k & 4095));
        h = Math.imul(h ^ v, 16777619) >>> 0;
      }
      seen[h] = (seen[h] || 0) + 1;
      byName[st + '/' + ln] = h;
    }
    return { N, bodySet, bodyHair, portStyle, portLen, corr,
             lenAgree, lenOf: cmp.length,
             distinct: Object.keys(seen).length, tried: Object.keys(byName).length, byName,
             sample: rows.slice(0, 10) };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  const pct = (a, b2) => b2 ? (a / b2 * 100).toFixed(1) + '%' : 'n/a';

  console.log('\nDOES THE PORTRAIT WEAR THE HAIRCUT THE BODY IS WEARING?   (' + out.N + ' citizens)\n');

  console.log('  THE BODY   ' + out.bodySet + ' of ' + out.N + ' have a hairstyle set (' +
              pct(out.bodySet, out.N) + ')');
  const bh = Object.entries(out.bodyHair).sort((a, b2) => b2[1] - a[1]);
  console.log('             ' + bh.length + ' distinct: ' +
    bh.slice(0, 6).map(([k, v]) => k.toLowerCase() + ' ' + v).join(', ') + (bh.length > 6 ? ', ...' : ''));

  console.log('\n  THE FACE   style: ' + Object.entries(out.portStyle)
    .map(([k, v]) => k + ' ' + pct(v, out.N)).join(',  '));
  console.log('             length: ' + Object.entries(out.portLen)
    .map(([k, v]) => k + ' ' + pct(v, out.N)).join(',  '));

  console.log('\n  AGREEMENT  the portrait\'s RENDERED fall matches the body\'s band: ' +
    out.lenAgree + ' of ' + out.lenOf + '  (' + pct(out.lenAgree, out.lenOf) + ')');
  console.log('             chance alone, over three bands, is about 33%.');
  console.log('             correlation between the body\'s length dial and the fall');
  console.log('             actually drawn in the portrait: ' + out.corr +
    '   (0 = unrelated, 1 = the same haircut)');

  console.log('\n  THE CEILING  ' + out.distinct + ' distinct hair silhouettes out of ' +
    out.tried + ' (style, length) pairs the spec can name.');
  const groups = {};
  for (const [k, v] of Object.entries(out.byName)) (groups[v] || (groups[v] = [])).push(k);
  for (const g of Object.values(groups))
    if (g.length > 1) console.log('             SAME PIXELS: ' + g.join('  =  '));

  console.log('\n  A SAMPLE');
  for (const r of out.sample)
    console.log('    ' + r.id.padEnd(11) + (r.body || '(none)').toLowerCase().padEnd(18) +
      'body ' + r.bodyBand.padEnd(6) + '  face ' + r.pLen.padEnd(6) + ' ' + r.pStyle);
})();
