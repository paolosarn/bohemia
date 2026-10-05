/* THE SETTLEMENT'S LABELS  (UI lane 11, [the settlement's labels], 10/5/26)

   RULE 71a (one painted place) and RUN TWO [one painted place]: the settlement is one picture and a building
   names itself only under the finger. The row: the game's type on a torn tag, 44 points, placed by the
   building's hotspot, gone when the finger lifts; the pay and the price lines in the receipt face; nothing
   permanent over the picture. Drawn by slices/bohemia_ui_materials.js (settleTag, dressSettlement); RUN TWO's
   file only includes it and calls it.

   WHAT THIS HOLDS, on slices/BOHEMIA_SETTLEMENT_SCREEN.html at his phone's profile through the one driver:
     - for EVERY building the place has (hall, board, stall, barber, clinic, the scavenge lot, and what RUN TWO adds), a finger held on it draws the
       torn tag: 44 points tall, inside the glass, next to the building (under it, or over it near the foot)
     - the tag is paper (light under its words) and its ink passes 4.5 to 1, and again in the sun
     - the words are the game's faces (CASING and ROM loaded on the page)
     - when the finger lifts the tag is gone, and a drag never draws one
     - nothing is drawn on the picture before a finger (RUN TWO's own rule, kept)
     - the stall's prices and the board's pay are receipt lines: paper, ROM, 44 points or more, and their words
       pass 4.5 to 1 plain and in the sun
     - no page error

   node gates/the_settlement_labels_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE SETTLEMENT\'S LABELS: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* sample a box of the glass and report the paper's light and the ink's contrast on it, plain and in the sun */
async function onGlass(page, box, ink) {
  const png = (await page.screenshot()).toString('base64');
  return page.evaluate(async ({ png, box, ink }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth, d = g.getImageData(Math.round(box[0] * sc), Math.round(box[1] * sc), Math.max(1, Math.round(box[2] * sc)), Math.max(1, Math.round(box[3] * sc))).data;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    const S = []; for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]);
    S.sort((p, q) => LUM(...p) - LUM(...q)); const bg = S[Math.floor(S.length * 0.25)];   /* the darker quarter of the paper: the worst case */
    const t = ink.match(/\d+/g).slice(0, 3).map(Number);
    return { paper: +LUM(...S[Math.floor(S.length * 0.6)]).toFixed(2), plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
  }, { png, box, ink });
}

(async () => {
  console.log('\nTHE SETTLEMENT\'S LABELS  (UI [the settlement\'s labels], rule 71a)\n');
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  const p = d.page;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await p.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.where('stall'))) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(1500);
  const base = await p.evaluate(() => ({ mats: !!(window.BohemiaMaterials && BohemiaMaterials.settleTag), dressed: !!document.getElementById('bm-settle'),
    faces: ['BohemiaCasing', 'BohemiaROM'].map(n => Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === n && f.status === 'loaded')),
    quiet: BohemiaSettlement.state.open === null && !window.__SETTLE_TAG, keys: BohemiaSettlement.order(), W: innerWidth, H: innerHeight }));
  ok('the settlement wears the materials (the tag drawer, the receipt lines)', base.mats && base.dressed, JSON.stringify({ mats: base.mats, dressed: base.dressed }));
  ok('  the game\'s faces are loaded on the page (CASING, ROM)', base.faces.every(Boolean), JSON.stringify(base.faces));
  ok('NOTHING IS DRAWN ON THE PICTURE BEFORE A FINGER', base.quiet);

  const tags = [];
  for (const k of base.keys) {
    await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(250);
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.evaluate(() => { window.__SETTLE_TAG = null; });
    await p.mouse.move(xy.x, xy.y); await p.mouse.down(); await p.waitForTimeout(350);
    /* the tag is drawn in the canvas's own space: add the canvas's place on the page */
    const tg = await p.evaluate(() => { const t = window.__SETTLE_TAG; if (!t) return null; const r = document.getElementById('cv').getBoundingClientRect(); return { x: t.x + r.left, y: t.y + r.top, w: t.w, h: t.h }; });
    /* the paper is read in the tag's right margin (the words are set from the left), the ink against it */
    const glass = tg ? await onGlass(p, [tg.x + tg.w - 12, tg.y + 6, 8, tg.h - 14], 'rgb(31,23,16)') : null;
    /* lift FIRST, then clear: clearing while the finger is still down only lets the next frame redraw it */
    await p.mouse.up(); await p.waitForTimeout(120);
    await p.evaluate(() => { window.__SETTLE_TAG = null; }); await p.waitForTimeout(300);
    const after = await p.evaluate(() => window.__SETTLE_TAG);
    tags.push({ k, tg, glass, gone: after === null, near: tg ? Math.min(Math.abs(tg.y - xy.y), Math.abs(tg.y + tg.h - xy.y)) : null });
    await p.evaluate(() => { try { BohemiaSettlement.state.open && document.getElementById('close').click(); } catch (e) {} });
    await p.waitForTimeout(300);
  }
  const bad = tags.filter(t => !t.tg || t.tg.h < 44 || t.tg.x < 0 || t.tg.y < 0 || t.tg.x + t.tg.w > base.W || t.tg.y + t.tg.h > base.H);
  ok('A FINGER ON EVERY BUILDING DRAWS ITS TORN TAG: 44 points, inside the glass', tags.length >= 6 && tags.length === base.keys.length && bad.length === 0, tags.map(t => t.k + (t.tg ? ' ' + t.tg.w + 'x' + t.tg.h : ' NONE')).join(', '));
  ok('  the tag is paper, and its ink passes 4.5 to 1 plain and in the sun', tags.every(t => t.glass && t.glass.paper > 0.45 && t.glass.plain >= 4.5 && t.glass.sun >= 4.5),
     tags.map(t => t.k + ' ' + (t.glass ? t.glass.paper + ' ' + t.glass.plain + '/' + t.glass.sun : '-')).join(', '));
  ok('WHEN THE FINGER LIFTS, THE TAG IS GONE', tags.every(t => t.gone), tags.filter(t => !t.gone).map(t => t.k).join(' '));

  /* a drag pans the picture and never names anything */
  const xy = await p.evaluate(() => BohemiaSettlement.where('hall'));
  await p.evaluate(() => { window.__SETTLE_TAG = null; });
  await p.mouse.move(xy.x, xy.y); await p.mouse.down(); await p.mouse.move(xy.x - 40, xy.y, { steps: 4 }); await p.evaluate(() => { window.__SETTLE_TAG = null; }); await p.waitForTimeout(250);
  const dragged = await p.evaluate(() => window.__SETTLE_TAG); await p.mouse.up(); await p.waitForTimeout(300);
  ok('  and a drag never draws one', dragged === null);

  /* the receipt lines: the stall's prices, the board's pay */
  const lines = [];
  for (const k of ['stall', 'board']) {
    await p.evaluate(() => { try { BohemiaSettlement.state.open && document.getElementById('close').click(); } catch (e) {} }); await p.waitForTimeout(300);
    const xy2 = await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(250);
    const xy3 = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.mouse.click(xy3.x, xy3.y); await p.waitForTimeout(700);
    const a = await p.evaluate(() => Array.from(document.querySelectorAll('#sbody .act')).filter(b => !b.disabled).map(b => { const r = b.getBoundingClientRect(), em = b.querySelector('em');
      return { t: b.textContent.trim().slice(0, 24), h: r.height, bg: getComputedStyle(b).backgroundImage.slice(0, 30), fam: getComputedStyle(b).fontFamily.split(',')[0].replace(/["']/g, ''),
        box: [r.x + r.width * 0.55, r.y + 6, r.width * 0.2, r.height - 12], col: getComputedStyle(b).color, emCol: em ? getComputedStyle(em).color : null }; }));
    for (const it of a.slice(0, 2)) {
      const c1 = await onGlass(p, it.box, it.col), c2 = it.emCol ? await onGlass(p, it.box, it.emCol) : { plain: 99, sun: 99 };
      lines.push(Object.assign({ k }, it, { c1, c2 }));
    }
  }
  ok('THE PRICES AND THE PAY ARE RECEIPT LINES: paper, ROM, 44 points or more', lines.length >= 3 && lines.every(l => /url\(/.test(l.bg) && l.fam === 'BohemiaROM' && l.h >= 44),
     lines.map(l => l.k + ' "' + l.t + '" ' + Math.round(l.h) + ' ' + l.fam).join(', '));
  ok('  and their words pass 4.5 to 1 plain and in the sun', lines.every(l => l.c1.plain >= 4.5 && l.c1.sun >= 4.5 && l.c2.plain >= 4.5 && l.c2.sun >= 4.5),
     lines.map(l => l.k + ' ' + l.c1.plain + '/' + l.c1.sun + ' price ' + l.c2.plain + '/' + l.c2.sun).join(', '));
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
