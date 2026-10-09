/* THE RESHUFFLE MARK  (UI lane 11, [glass face], 10/9/26)

   RUN 9/28 left it in a code comment: 'Whoever wants a real reroll arrow adds it to the ROM face; UI [glass face]'.
   The reshuffle on each family face (rule 32d, [three names]) became a '?', because the phone's ROM face has no
   circular arrow; a '?' on a face reads as 'who is this' and it sat on the hair, 11 points wide. The row: the arrow
   drawn as a mark in the materials, the reshuffle's hit 24 points at least, without taking the flip's.
   Drawn by slices/bohemia_ui_materials.js (MARKS.again, dressPhone); the city file is not edited.

   WHAT THIS HOLDS, on the demo's map at his phone's profile through the one driver, with the family unlocked by the
   game's own hook so the reshuffle shows:
     - every reshuffle wears the drawn ring (an image, not a letter), and no '?' is painted
     - the ring is light on dark glass and passes 4.5 to 1 plain and in the sun, read off the real screenshot
     - the reshuffle is 24 points tall at least and the card's width, inside its card, under the face, never on it
     - the flip keeps the card above it: 44 by 44 at least that is not the reshuffle
     - a real finger on the reshuffle gives a new name and does not flip; a real finger on the face above it flips
     - no page error

   node gates/the_reshuffle_mark_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE RESHUFFLE MARK: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nTHE RESHUFFLE MARK  (UI [glass face])\n');
  const d = await open({ door: 120000 });
  if (!d.doorIsBehindUs()) { ok('the driver got past the door', false); await d.close(); done(); }
  const p = d.page, fr = d.fr;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await fr.evaluate(() => { const f = document.getElementById('cityfeed'); return !!(f && f.classList.contains('on')); })) break; await p.waitForTimeout(300); }
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); ctActUnlock(2); ctActUnlock(3); } catch (e) {} });
  await p.waitForTimeout(1200);
  const fb = await (await fr.frameElement()).boundingBox();

  const read = () => fr.evaluate(({ ox, oy }) => [...document.querySelectorAll('#actflip .af')].map(t => {
    const r = t.getBoundingClientRect(), a = t.querySelector('.afr'), cv = t.querySelector('canvas').getBoundingClientRect();
    const out = { name: t.querySelector('.afn').textContent, now: t.classList.contains('now'), card: { x: ox + r.left, y: oy + r.top, w: r.width, h: r.height } };
    if (a) {
      const q = a.getBoundingClientRect(), cs = getComputedStyle(a), be = getComputedStyle(a, '::before');
      out.afr = { x: ox + q.left, y: oy + q.top, w: q.width, h: q.height, top: q.top, inCard: q.left >= r.left && q.right <= r.right && q.bottom <= r.bottom,
        underFace: q.top >= cv.bottom, img: be.content !== 'none' && /url\(/.test(be.backgroundImage) && parseFloat(be.width) >= 10, fontPx: parseFloat(cs.fontSize), ink: cs.color };
      /* the flip's own part of the card: from the card's top down to the reshuffle */
      out.flip = { w: r.width, h: q.top - r.top };
    }
    return out;
  }), { ox: fb.x, oy: fb.y });
  const tiles = await read();
  const rs = tiles.filter(t => t.afr);
  ok('THE FAMILY IS ON THE PHONE WITH ITS RESHUFFLES', tiles.length === 3 && rs.length >= 1, tiles.map(t => t.name + (t.afr ? ' +reshuffle' : '')).join(', '));
  ok('EVERY RESHUFFLE WEARS THE DRAWN RING, NOT A LETTER', rs.length > 0 && rs.every(t => t.afr.img), rs.map(t => t.name + ' ' + t.afr.img).join(', '));
  ok('  and no \'?\' is painted (the letter stays for a screen reader at no size, see-through)', rs.every(t => t.afr.fontPx === 0 || /, 0\)$|transparent/.test(t.afr.ink)),
     rs.map(t => t.afr.fontPx + 'px ' + t.afr.ink).join(', '));

  /* the ring read off the real screenshot: the light cells against the glass around them */
  const png = (await p.screenshot()).toString('base64');
  const cr = await p.evaluate(async ({ png, boxes }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return boxes.map(b => {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      const d = g.getImageData(Math.round((cx - 6) * sc), Math.round((cy - 6) * sc), Math.round(12 * sc), Math.round(12 * sc)).data;
      const S = []; for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const ink = S[Math.floor(S.length * 0.95)], bg = S[Math.floor(S.length * 0.3)];
      const lit = S.filter(px => LUM(...px) > 0.45).length / S.length;
      return { plain: +CR(LUM(...ink), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(ink)), LUM(...SUN(bg))).toFixed(2), lit: +lit.toFixed(2) };
    });
  }, { png, boxes: rs.map(t => t.afr) });
  ok('THE RING IS PAINTED, LIGHT ON THE GLASS, 4.5 TO 1 PLAIN AND IN THE SUN', cr.length > 0 && cr.every(c => c.lit > 0.15 && c.plain >= 4.5 && c.sun >= 4.5),
     cr.map(c => c.plain + '/' + c.sun + ' lit ' + c.lit).join(', '));
  ok('THE RESHUFFLE IS 24 POINTS AT LEAST, INSIDE ITS CARD, UNDER THE FACE', rs.every(t => t.afr.h >= 24 && t.afr.w >= 24 && t.afr.inCard && t.afr.underFace),
     rs.map(t => Math.round(t.afr.w) + 'x' + Math.round(t.afr.h) + (t.afr.underFace ? '' : ' ON THE FACE')).join(', '));
  ok('  and the flip keeps 44 by 44 of the card above it', rs.every(t => t.flip.w >= 44 && t.flip.h >= 44), rs.map(t => Math.round(t.flip.w) + 'x' + Math.round(t.flip.h)).join(', '));

  /* the fingers */
  const i = tiles.findIndex(t => t.afr && !t.now);
  if (i >= 0) {
    const before = await fr.evaluate(() => BohemiaActs.current());
    const t = tiles[i];
    await p.touchscreen.tap(t.afr.x + t.afr.w / 2, t.afr.y + t.afr.h / 2); await p.waitForTimeout(1200);
    const mid = await read(), cur = await fr.evaluate(() => BohemiaActs.current());
    ok('A REAL FINGER ON THE RESHUFFLE GIVES A NEW NAME, AND DOES NOT FLIP', mid[i].name !== t.name && cur === before, t.name + ' -> ' + mid[i].name + ', act ' + before + ' -> ' + cur);
    await p.touchscreen.tap(t.card.x + t.card.w / 2, t.card.y + 14); await p.waitForTimeout(1500);
    const cur2 = await fr.evaluate(() => BohemiaActs.current());
    ok('  and a real finger on the face above it flips', cur2 !== before, 'act ' + before + ' -> ' + cur2);
  } else { ok('A REAL FINGER ON THE RESHUFFLE GIVES A NEW NAME, AND DOES NOT FLIP', false, 'no reshuffle on a face you are not'); }
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); } catch (e) {} });
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
