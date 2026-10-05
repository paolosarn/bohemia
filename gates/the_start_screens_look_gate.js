/* THE START SCREEN'S LOOK  (UI lane 11, [the start screen's look], 10/5/26)

   RULE 66 (Paolo 10/2: 'there should be a start screen'); RULE 67/71 (not AI slop: no default fonts, no
   flat boxes, no centred labels). RUN builds the start screen's LOGIC (claimed e31bb315) and the front
   door's picks; UI DRESSES both, in slices/bohemia_ui_materials.js, so their files stay theirs.

   WHAT THIS HOLDS, on the ALPHA at his phone's profile through the one driver (before BEGIN):
     THE FRONT DOOR'S DRESS (applied by itself where #newco exists)
     - the fights and the shelves are taped cards (cardboard), the origins a posted sheet (receipt), the
       crew's name a form on paper; the picked origin is ringed in marker
     - CASING on what is stamped, ROM on what is printed; every pick 44 points or more
     - the words pass 4.5 to 1 on their material, and again in the sun (+25% white)
     - a tap on a card still picks it and does not begin the game
     THE START SCREEN'S LOOK (BohemiaMaterials.startScreen, which RUN's logic calls)
     - three things of three materials (cardboard, receipt, glass), read from the left, 60+ points, CASING
     - each tap reaches RUN's callback; CONTINUE is dark with no run and prints the day with one
     - the arm line reads; every enabled word passes 4.5 to 1 and the sun test
     - landscape (844x390): the title and the three things do not overlap and stay on the glass
     - destroy() leaves nothing behind; no page error

   node gates/the_start_screens_look_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE START SCREEN\'S LOOK: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* words against what is under them, off the glass: each item is { box:[x,y,w,h] to sample the material,
   col: the word's computed colour }, sampled in the page from a real screenshot */
async function contrast(page, items) {
  const png = (await page.screenshot()).toString('base64');
  return page.evaluate(async ({ png, items }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return items.map(it => {
      const [x, y, w, h] = it.box, d = g.getImageData(Math.round(x * sc), Math.round(y * sc), Math.max(1, Math.round(w * sc)), Math.max(1, Math.round(h * sc))).data, S = [];
      for (let i = 0; i < d.length; i += 4 * 5) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const t = it.col.match(/\d+/g).slice(0, 3).map(Number), tl = LUM(...t);
      /* the material's median, on the side that is worse for this word */
      const bg = S[Math.floor(S.length * (tl > 0.5 ? 0.8 : 0.2))];
      return { k: it.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
    });
  }, { png, items });
}

async function look(page) {
  await page.waitForTimeout(2500);
  const fam = 'el => getComputedStyle(el).fontFamily.split(",")[0].replace(/["\']/g, "")';
  const a = await page.evaluate((famSrc) => {
    const F = eval(famSrc), N = document.getElementById('newco'); if (!N) return null;
    const rowB = Array.from(N.querySelectorAll('.row button')), strip = N.querySelector('.strip'), name = N.querySelector('.name'), on = N.querySelector('.org.on');
    const bg = el => getComputedStyle(el).backgroundImage;
    const picks = Array.from(N.querySelectorAll('button')).map(b => b.getBoundingClientRect()).filter(r => r.width > 0);
    const un = rowB.find(b => !b.classList.contains('on')), ur = un.getBoundingClientRect(), sr = strip.getBoundingClientRect(), ob = N.querySelector('.org b');
    const casing = Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === 'BohemiaCasing' && f.status === 'loaded');
    return { dressed: !!document.getElementById('bm-frontdoor'), casing,
      mats: { cards: rowB.filter(b => !b.classList.contains('on')).every(b => /url\(/.test(bg(b))), lit: rowB.filter(b => b.classList.contains('on')).every(b => /gradient/.test(bg(b))), sheet: /url\(/.test(bg(strip)), form: /url\(/.test(bg(name)) },
      ring: on ? getComputedStyle(on).boxShadow : '', fams: { card: F(rowB[0]), org: F(ob), line: F(N.querySelector('.org i')), name: F(name.querySelector('span')) },
      small: picks.filter(r => r.height < 44).length, n: picks.length,
      cardBox: [ur.x + ur.width - 14, ur.y + 4, 10, ur.height - 8], cardCol: getComputedStyle(un).color,
      sheetBox: [sr.x + 4, sr.y + sr.height - 18, sr.width - 8, 6], orgCol: getComputedStyle(ob).color, lineCol: getComputedStyle(N.querySelector('.org i')).color };
  }, fam);
  if (!a) { ok('the front door\'s picks are on the page', false); return; }
  ok('THE FRONT DOOR IS DRESSED (the materials file found #newco by itself)', a.dressed);
  ok('  the fights and shelves are cards of cardboard (the picked one lit amber), the origins a posted sheet, the name a form on paper', a.mats.cards && a.mats.lit && a.mats.sheet && a.mats.form, JSON.stringify(a.mats));
  ok('  the picked origin is ringed in marker', /168, 48, 28/.test(a.ring), a.ring);
  ok('  CASING on what is stamped, ROM on what is printed (faces loaded)', a.casing && a.fams.card === 'BohemiaCasing' && a.fams.org === 'BohemiaCasing' && a.fams.name === 'BohemiaCasing' && a.fams.line === 'BohemiaROM', JSON.stringify(a.fams));
  ok('  every pick is 44 points or more', a.n >= 10 && a.small === 0, a.n + ' picks, ' + a.small + ' small');
  const c1 = await contrast(page, [{ k: 'card', box: a.cardBox, col: a.cardCol }, { k: 'origin name', box: a.sheetBox, col: a.orgCol }, { k: 'origin line', box: a.sheetBox, col: a.lineCol }]);
  ok('  THE WORDS PASS 4.5 TO 1 ON THEIR MATERIAL, AND IN THE SUN', c1.every(c => c.plain >= 4.5 && c.sun >= 4.5), c1.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  /* a tap on a card still picks it, and is not the BEGIN tap */
  const tb = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#newco .row button[data-k="combat"]')).find(x => !x.classList.contains('on')); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, v: b.getAttribute('data-v') }; });
  await page.touchscreen.tap(tb.x, tb.y); await page.waitForTimeout(400);
  const tp = await page.evaluate(() => ({ combat: BOH_START.state.combat, front: getComputedStyle(document.getElementById('front')).display }));
  ok('  a tap on a card still picks it and does not begin the game', tp.combat === tb.v && tp.front !== 'none', JSON.stringify(tp) + ' wanted ' + tb.v);

  /* THE START SCREEN'S LOOK */
  const s = await page.evaluate((famSrc) => {
    const F = eval(famSrc); window.__got = [];
    const api = BohemiaMaterials.startScreen(document.body, { onNew: () => __got.push('new'), onContinue: () => __got.push('continue'), onSettings: () => __got.push('settings'), saved: null });
    window.__ss = api;
    const bs = Array.from(api.root.querySelectorAll('.b')).map(b => { const r = b.getBoundingClientRect(), t = b.querySelector('b'), rg = document.createRange(); rg.selectNodeContents(t); const tr = rg.getBoundingClientRect();
      return { k: b.getAttribute('data-k'), bg: getComputedStyle(b).backgroundImage.slice(0, 400), h: r.height, w: r.width, tx: tr.left - r.left, align: getComputedStyle(b).textAlign, fam: F(t), dis: b.disabled, sub: b.querySelector('i').textContent }; });
    return { bs };
  }, fam);
  /* the whole background, not the first bytes of the picture: every PNG opens with the same header */
  const kinds = s.bs.map(b => b.bg);
  ok('THE START SCREEN\'S LOOK: THREE THINGS OF THREE MATERIALS', s.bs.length === 3 && s.bs.every(b => /url\(/.test(b.bg)) && new Set(kinds).size === 3, s.bs.map(b => b.k).join(' / '));
  ok('  each read from the left, 60 points or more, in CASING', s.bs.every(b => b.align !== 'center' && b.tx < 60 && b.h >= 60 && b.fam === 'BohemiaCasing'), s.bs.map(b => b.k + ' ' + Math.round(b.h) + ' +' + Math.round(b.tx) + ' ' + b.fam).join(', '));
  ok('  NO RUN: CONTINUE IS DARK AND SAYS SO', s.bs[1].dis && s.bs[1].sub === 'NO RUN SAVED', s.bs[1].dis + ' "' + s.bs[1].sub + '"');
  await page.evaluate(() => __ss.paint({ day: 3, min: 600 }));
  const tapK = async (k) => { const b = await page.evaluate((k) => { const r = __ss.root.querySelector('[data-k="' + k + '"]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, k);
    await page.touchscreen.tap(b[0], b[1]); await page.waitForTimeout(200); };
  for (const k of ['new', 'continue', 'settings']) await tapK(k);
  const g = await page.evaluate(() => ({ got: __got.slice(), sub: __ss.root.querySelector('[data-k="continue"] i').textContent, front: getComputedStyle(document.getElementById('front')).display }));
  ok('  EACH TAP REACHES RUN\'S CALLBACK (and nothing behind it)', g.got.join(',') === 'new,continue,settings' && g.front !== 'none', g.got.join(','));
  ok('  with a run, CONTINUE prints its day and hour', g.sub === 'DAY 3 · 10:00', g.sub);
  await page.evaluate(() => __ss.arm('DAY 3 IS KEPT ASIDE, NOT DELETED'));
  const ar = await page.evaluate(() => __ss.root.querySelector('[data-k="new"]').textContent);
  ok('  the arm line reads (TAP AGAIN, what happens to the run)', /TAP AGAIN/.test(ar) && /KEPT ASIDE/.test(ar), ar);
  await page.evaluate(() => __ss.disarm());
  const items = await page.evaluate(() => Array.from(__ss.root.querySelectorAll('.b')).filter(b => !b.disabled).flatMap(b => { const r = b.getBoundingClientRect(), box = [r.x + r.width - 30, r.y + 8, 22, r.height - 16];
    return [{ k: b.getAttribute('data-k') + ' word', box, col: getComputedStyle(b.querySelector('b')).color }, { k: b.getAttribute('data-k') + ' line', box, col: getComputedStyle(b.querySelector('i')).color }]; }));
  const c2 = await contrast(page, items);
  ok('  EVERY WORD PASSES 4.5 TO 1, AND IN THE SUN', c2.length === 6 && c2.every(c => c.plain >= 4.5 && c.sun >= 4.5), c2.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  await page.evaluate(() => __ss.destroy());
  await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(400);
  const L = await page.evaluate(() => { const api = BohemiaMaterials.startScreen(document.body, {}); const t = api.root.querySelector('.t').getBoundingClientRect(), m = api.root.querySelector('.m').getBoundingClientRect();
    const over = !(t.right <= m.left || m.right <= t.left || t.bottom <= m.top || m.bottom <= t.top);
    const r = { over, inside: m.top >= 0 && m.bottom <= innerHeight && m.right <= innerWidth && t.top >= 0 && t.bottom <= innerHeight, t: [t.left, t.top, t.right, t.bottom].map(Math.round), m: [m.left, m.top, m.right, m.bottom].map(Math.round) };
    api.destroy(); r.left = document.querySelectorAll('.bm-start').length; return r; });
  ok('  LANDSCAPE: the title and the three things do not overlap, and stay on the glass', !L.over && L.inside, JSON.stringify(L));
  ok('  destroy() leaves nothing behind', L.left === 0, L.left + ' left');
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
}

(async () => {
  console.log('\nTHE START SCREEN\'S LOOK  (UI [the start screen\'s look], rules 66, 67, 71)\n');
  let d;
  try { d = await open({ file: 'BOHEMIA_ALPHA_0_9.html', door: 150000, beforeTap: look }); }
  catch (e) { ok('the alpha opened', false, String(e.message).slice(0, 160)); return done(); }
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
