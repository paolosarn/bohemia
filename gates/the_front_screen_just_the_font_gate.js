/* THE FRONT SCREEN, JUST THE FONT  (UI lane 11, [the front screen, just the font], 10/18/26)

   PAOLO 10/18: 'the loading screen, the Bohemia title card, I don't want the card behind it, I just want the crazy
   font... the whole front screen looks like dog shit.' Built in slices/bohemia_ui_materials.js (frontJustTheFont,
   startScreen's bare branch, groundBare), switched by the door's own attribute: #front data-look="just-the-font".
   The alpha carries "classic" until RUN flips it at the cut (rule 93). Record:
   records/BOHEMIA_THE_FRONT_SCREEN_JUST_THE_FONT_10_18_26.md

   DRIVEN ON THE DEMO through the one driver, at his phone's profile, with the switch forced on the way RUN's flip
   puts it on (an attribute on the door before the page's own scripts read it):
     J1  THE CARD IS GONE: his letters stand on the screen's own ground on the title, the splash and the loading
         screen's top (#loadtag); not one pixel of the grey card (45,43,39 within 10) in the letters' box on the glass
     J2  EVERY KEPT PIXEL IS HIS: the letters' canvas is his wordmark cropped to its ink (321 x 71 at 39,33), every
         opaque pixel equal to his, no card pixel kept, 99% of his gold kept
     J3  ONE PIXEL SIZE: the letters drawn at a whole scale, one css pixel a pixel on the phone (three phone pixels)
     J4  NO BROWSER DEFAULTS on any front screen (rule 114 D10): no gradient, no blurred shadow or glow, no blur
         filter, no corner over 1 px, nothing animating; every word in the project's faces (casing, ROM, mono) at a
         size its ten dots land on whole phone pixels (a multiple of 10/3 css px)
     J5  EVERY WORD READS: 4.5 to 1 against what is really under it (the glass photographed with the words hidden),
         and again in the sun (+25% white; rule 73); enabled words only
     J6  ONE NEXT THING (rule 117): one gold button on the title, NEW GAME with no run, CONTINUE with one; BEGIN gold
         only once the game is in
     J7  THUMBS: every pick 44 css px or taller, every title choice 48, BEGIN 48
     J8  NOTHING OFF THE GLASS, upright and sideways: the picks fit their column, no pick below the glass, BEGIN
         clear of the picks and the stamp, the stamp on the glass
     J9  THE CLASSIC DOOR IS UNTOUCHED when the switch says classic: no bare sheet, no letters canvas, the plate as
         it was; and the alpha's door carries the switch with one of its two values
     J10 THE SHEET ITSELF carries no gradient, blur, glow or round corner (read from the source)
     J11 nothing threw
   PLANTED (each must turn its leg red, every run): the card painted back behind the title's letters, a gradient on
   the bar, a glow on BEGIN, a phone font on the subtitle, an 11 px label, a round corner on a pick, a pick squeezed
   under a thumb, a dim word, the gold on a second title choice.

   node gates/the_front_screen_just_the_font_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE FRONT SCREEN, JUST THE FONT: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const FORCE = () => { new MutationObserver((m, o) => { const f = document.getElementById('front'); if (f) { f.setAttribute('data-look', 'just-the-font'); o.disconnect(); } }).observe(document, { childList: true, subtree: true }); };
const CROP = { x: 39, y: 33, w: 321, h: 71 };

/* ---------- what the page is asked (each a pure read; no clicks) ---------- */
const READ_MARK = async (page, sel) => page.evaluate(async ({ sel, CROP }) => {
  const c = document.querySelector(sel); if (!c || !c.width || c.width < 2) return null;
  const r = c.getBoundingClientRect(), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  const im = new Image(); im.src = 'data:image/png;base64,' + window.BOH_FRONT_LOGO_B64; await im.decode();
  const s = document.createElement('canvas'); s.width = im.width; s.height = im.height; const sg = s.getContext('2d'); sg.drawImage(im, 0, 0);
  const S = sg.getImageData(0, 0, s.width, s.height).data;
  let opaque = 0, clear = 0, his = 0, cardKept = 0, goldIn = 0, goldKept = 0;
  const gold = (q, i) => { const mx = Math.max(q[i], q[i + 1], q[i + 2]), mn = Math.min(q[i], q[i + 1], q[i + 2]); return mx >= 64 && (mx - mn) * 4 >= mx; };
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4, j = ((y + CROP.y) * s.width + (x + CROP.x)) * 4, inside = x + CROP.x < s.width && y + CROP.y < s.height;
    const g = inside && gold(S, j); if (g) goldIn++;
    if (d[i + 3] === 0) { clear++; continue; }
    opaque++; if (g) goldKept++; else cardKept++;
    if (inside && d[i] === S[j] && d[i + 1] === S[j + 1] && d[i + 2] === S[j + 2] && d[i + 3] === 255) his++;
  }
  return { nat: [c.width, c.height], css: [Math.round(r.width * 100) / 100, Math.round(r.height * 100) / 100], box: [r.left, r.top, r.width, r.height], opaque, clear, his, cardKept, goldIn, goldKept, dpr: devicePixelRatio };
}, { sel, CROP });

/* the share of the grey card's colour in a box on the glass */
async function cardOnGlass(page, box) {
  const png = (await page.screenshot()).toString('base64');
  return page.evaluate(async ({ png, box }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const k = im.width / innerWidth, [x, y, w, h] = box.map(v => Math.round(v * k));
    const d = g.getImageData(x, y, Math.max(1, w), Math.max(1, h)).data; let n = 0, card = 0;
    for (let i = 0; i < d.length; i += 4) { n++; if (Math.abs(d[i] - 45) <= 10 && Math.abs(d[i + 1] - 43) <= 10 && Math.abs(d[i + 2] - 39) <= 10) card++; }
    return card / n;
  }, { png, box });
}

/* every visible element on the front screen and what the browser resolved for it */
const READ_DEFAULTS = () => {
  const T = document.getElementById('title'), up = T && !T.classList.contains('gone') && getComputedStyle(T).display !== 'none';
  const roots = [up ? T : document.getElementById('front')].filter(Boolean), out = [], FACES = ['BohemiaCasing', 'BohemiaROM', 'BohemiaMono'];
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const hidden = e => { for (let p = e; p; p = p.parentElement) { const s = getComputedStyle(p); if (s.display === 'none' || s.visibility === 'hidden') return true; } return false; };
  const blurOf = sh => { if (!sh || sh === 'none') return 0; let worst = 0; sh.split(/,(?![^(]*\))/).forEach(one => { const L = one.replace(/rgba?\([^)]*\)|#[0-9a-f]+|inset/gi, '').trim().split(/\s+/).map(parseFloat).filter(v => !isNaN(v)); if (L.length >= 3) worst = Math.max(worst, L[2]); }); return worst; };
  const name = e => e.id ? '#' + e.id : (e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''));
  roots.forEach(R => R.querySelectorAll('*').forEach(e => {
    if (hidden(e) || !vis(e)) return;
    const s = getComputedStyle(e), why = [];
    if (/gradient/i.test(s.backgroundImage)) why.push('gradient');
    if (blurOf(s.boxShadow) > 0) why.push('box glow ' + s.boxShadow.slice(0, 60));
    if (blurOf(s.textShadow) > 0) why.push('text glow');
    if (/blur/.test(s.filter) || /blur/.test(s.backdropFilter || '')) why.push('blur');
    ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].forEach(k => { if (parseFloat(s[k]) > 1) why.push('corner ' + s[k]); });
    if (s.animationName && s.animationName !== 'none' && s.animationPlayState !== 'paused') why.push('animates ' + s.animationName);
    const own = Array.from(e.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (own) {
      const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), px = parseFloat(s.fontSize), k = px * 3 / 10;
      if (FACES.indexOf(fam) < 0) why.push('face ' + fam);
      if (Math.abs(k - Math.round(k)) > 0.02 || Math.round(k) < 2) why.push('size ' + px + 'px');
    }
    if (why.length) out.push(name(e) + ': ' + why.join(', '));
  }));
  return out;
};

/* every enabled word and the glass under it, photographed with the words hidden */
async function words(page) {
  const items = await page.evaluate(() => {
    const out = [];
    const vis = e => { for (let p = e; p; p = p.parentElement) { const s = getComputedStyle(p); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth && r.right > 0; };
    const T = document.getElementById('title'), top = T && !T.classList.contains('gone') && getComputedStyle(T).display !== 'none' ? T : document.getElementById('front');   /* what is on top is what he reads */
    top.querySelectorAll('*').forEach(e => {
      if (!Array.from(e.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) return;
      if (!vis(e) || e.closest('button:disabled')) return;
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      out.push({ k: (e.id ? '#' + e.id : e.tagName.toLowerCase()) + ' "' + e.textContent.trim().slice(0, 18) + '"', box: [Math.max(0, r.left), Math.max(0, r.top), Math.min(innerWidth, r.right) - Math.max(0, r.left), Math.min(innerHeight, r.bottom) - Math.max(0, r.top)], col: s.color });
    });
    const st = document.createElement('style'); st.id = 'jtf-gate-hide'; st.textContent = '#front *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}';
    document.head.appendChild(st); return out;
  });
  await page.waitForTimeout(120);
  const png = (await page.screenshot()).toString('base64');
  await page.evaluate(() => { const s = document.getElementById('jtf-gate-hide'); if (s) s.remove(); });
  return page.evaluate(async ({ png, items }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return items.map(it => {
      const [x, y, w, h] = it.box, d = g.getImageData(Math.round(x * sc), Math.round(y * sc), Math.max(1, Math.round(w * sc)), Math.max(1, Math.round(h * sc))).data, S = [];
      for (let i = 0; i < d.length; i += 4 * 3) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const t = it.col.match(/[\d.]+/g).slice(0, 3).map(Number), tl = LUM(...t);
      const bg = S[Math.floor((S.length - 1) * (tl > 0.18 ? 0.9 : 0.1))];   /* the worse side of what is under the word */
      return { k: it.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2), bg: bg.join(','), col: t.join(',') };
    });
  }, { png, items });
}

const READ_LEAD = () => {
  const bs = Array.from(document.querySelectorAll('#title .bm-start .b')), gold = b => getComputedStyle(b).backgroundColor === 'rgb(200, 171, 99)';
  return { gold: bs.filter(gold).map(b => b.getAttribute('data-k')), hs: bs.map(b => Math.round(b.getBoundingClientRect().height)) };
};
const READ_FIT = () => {
  const R = e => e && e.getBoundingClientRect(), n = document.getElementById('newco'), tap = R(document.getElementById('fronttap')), st = R(document.getElementById('buildstamp')), nr = R(n);
  const over = (a, b) => !!a && !!b && a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const picks = Array.from(n.querySelectorAll('button')).map(b => ({ t: b.textContent.trim().slice(0, 14), r: R(b) }));
  return { scroll: n.scrollHeight, client: n.clientHeight, below: picks.filter(p => p.r.bottom > innerHeight + 0.5 || p.r.top < -0.5).map(p => p.t), thin: picks.filter(p => p.r.height < 44).map(p => p.t + ' ' + Math.round(p.r.height)),
    tapH: tap ? tap.height : 0, tapOverPicks: over(tap, nr), tapOverStamp: over(tap, st), stampOn: !!st && st.bottom <= innerHeight && st.top >= 0 && st.height > 0 };
};

/* ---------- the walk ---------- */
async function walk(profile, legs) {
  const res = {};
  const d = await open({ profile, keepCards: true, beforeGoto: async (cdp, page) => { await page.addInitScript(FORCE); }, beforeTap: async (page) => {
    for (let i = 0; i < 160; i++) { if (await page.evaluate(() => !!window.__LOAD_READY && !!document.querySelector('#title .bm-start .jtf-mark') && document.querySelector('#title .bm-start .jtf-mark').width > 1)) break; await page.waitForTimeout(250); }
    await page.waitForTimeout(700);
    await legs(page, res);
  } });
  res.errs = d.errs ? d.errs.slice() : [];
  await d.close();
  return res;
}

(async () => {
  /* J9 + J10 from the source, before any browser */
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const sw = alpha.match(/<div id="front" data-look="([^"]*)">/);
  ok('J9 the alpha\'s door carries the switch, with one of its two values', !!sw && /^(classic|just-the-font)$/.test(sw[1]), sw ? sw[1] : 'no data-look on #front');
  const mat = fs.readFileSync(path.join(ROOT, 'slices/bohemia_ui_materials.js'), 'utf8');
  const a = mat.indexOf('var JTF_CSS = ['), b = mat.indexOf("].join('\\n');", a), sheet = a > 0 && b > a ? mat.slice(a, b) : '';
  const tells = [/(?:linear|radial|conic)-gradient\s*\(/, /blur\(/, /border-radius\s*:\s*(?:[2-9]|\d\d)/, /(?:box|text)-shadow\s*:[^;']*\d+px\s+\d+px\s+[1-9]\d*px/].filter(r => r.test(sheet)).map(String);
  ok('J10 the bare sheet carries no gradient, blur, glow or round corner (read from the source)', !!sheet && !tells.length, tells.join(' '));
  const gb = mat.slice(mat.indexOf('function groundBare('), mat.indexOf('var JD ='));
  ok('J10 and the valley under the title is painted without a smooth fade (no canvas gradient in groundBare)', gb.length > 200 && !/create(?:Linear|Radial)Gradient|shadowBlur/.test(gb));

  /* ---------- upright: the title, the picks, the door once the game is in, then the plants ---------- */
  const up = await walk('phone_portrait', async (page, res) => {
    res.tMark = await READ_MARK(page, '#title .bm-start .jtf-mark');
    res.tCard = res.tMark ? await cardOnGlass(page, res.tMark.box) : 1;
    res.tDef = await page.evaluate(READ_DEFAULTS);
    res.tWords = await words(page);
    res.lead0 = await page.evaluate(READ_LEAD);
    /* a saved run the way the title holds one (its own tick repaints from BOH_TITLE.save twice a second) */
    await page.evaluate(() => { BOH_TITLE.save = { day: 3, min: 980 }; BOH_TITLE.ui.paint(BOH_TITLE.save); });
    res.lead1 = await page.evaluate(READ_LEAD);
    await page.evaluate(() => { BOH_TITLE.save = null; BOH_TITLE.ui.paint(null); });
    res.notesH = await page.evaluate(() => Math.round(document.querySelector('#title .notes').getBoundingClientRect().height));
    /* the NOTES sheet over the title */
    await page.evaluate(() => BOH_TITLE.act('notes')); await page.waitForTimeout(200);
    res.nDef = await page.evaluate(READ_DEFAULTS);
    await page.evaluate(() => BOH_TITLE.act('nclose'));
    /* PLANTS on the title: each must turn its leg red */
    const plant = async css => page.evaluate(c => { const s = document.createElement('style'); s.id = 'jtf-plant'; s.textContent = c; document.head.appendChild(s); }, css);
    const unplant = async () => page.evaluate(() => { const s = document.getElementById('jtf-plant'); if (s) s.remove(); });
    res.plants = {};
    await plant('html body .bm-start.jtf .t .jtf-mark{background:#2d2b27!important}'); res.plants.card = await cardOnGlass(page, res.tMark.box); await unplant();
    await plant('html body .bm-start.jtf .sub{font-family:Arial,sans-serif!important}'); res.plants.face = await page.evaluate(READ_DEFAULTS); await unplant();
    await plant('html body .bm-start.jtf .b i{font-size:11px!important}'); res.plants.size = await page.evaluate(READ_DEFAULTS); await unplant();
    await plant('html body .bm-start.jtf .sub{color:#3a362f!important}'); res.plants.dim = await words(page); await unplant();
    await plant('html body .bm-start.jtf .b.pane{background:#c8ab63!important}'); res.plants.lead = await page.evaluate(READ_LEAD); await unplant();
    /* NEW GAME, the way a person goes in */
    const nb = await page.evaluate(() => { const r = document.querySelector('#title .bm-start [data-k=new]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(nb.x, nb.y); await page.waitForTimeout(900);
    res.lMark = await READ_MARK(page, '#loadtag .jtf-mark');
    res.lCard = res.lMark ? await cardOnGlass(page, res.lMark.box) : 1;
    res.lDef = await page.evaluate(READ_DEFAULTS);
    res.lWords = await words(page);
    res.fit = await page.evaluate(READ_FIT);
    res.begin = await page.evaluate(() => ({ ready: !!window.__LOAD_READY, bg: getComputedStyle(document.getElementById('fronttap')).backgroundColor, txt: document.getElementById('fronttap').textContent }));
    await plant('html body #front[data-look="just-the-font"] #loadfill{background:linear-gradient(#b6d6a8,#4c6f42)!important}'); res.plants.gradient = await page.evaluate(READ_DEFAULTS); await unplant();
    await plant('html body #front[data-look="just-the-font"].load.ready #fronttap{box-shadow:0 0 14px rgba(150,200,150,.35)!important}'); res.plants.glow = await page.evaluate(READ_DEFAULTS); await unplant();
    await plant('html body #front[data-look="just-the-font"] #newco .row button{border-radius:6px!important}'); res.plants.corner = await page.evaluate(READ_DEFAULTS); await unplant();
    await plant('html body #front[data-look="just-the-font"] #newco .row button{min-height:0!important;height:30px!important;overflow:hidden}'); res.plants.thumb = await page.evaluate(READ_FIT); await unplant();
  });
  /* ---------- sideways ---------- */
  const side = await walk('phone_landscape', async (page, res) => {
    res.tMark = await READ_MARK(page, '#title .bm-start .jtf-mark');
    res.tDef = await page.evaluate(READ_DEFAULTS);
    res.tWords = await words(page);
    res.menu = await page.evaluate(() => { const t = document.querySelector('#title .bm-start .t').getBoundingClientRect(), m = document.querySelector('#title .bm-start .m').getBoundingClientRect(); return { over: t.left < m.right && m.left < t.right && t.top < m.bottom && m.top < t.bottom, on: m.bottom <= innerHeight && m.top >= 0 && t.top >= 0 }; });
    const nb = await page.evaluate(() => { const r = document.querySelector('#title .bm-start [data-k=new]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(nb.x, nb.y); await page.waitForTimeout(900);
    res.lMark = await READ_MARK(page, '#loadtag .jtf-mark');
    res.lDef = await page.evaluate(READ_DEFAULTS);
    res.lWords = await words(page);
    res.fit = await page.evaluate(READ_FIT);
  });
  /* ---------- the classic door, switch untouched ---------- */
  let classic = null, cErrs = [];
  {
    const d = await open({ keepCards: true, beforeTap: async (page) => {
      await page.waitForTimeout(600);
      classic = await page.evaluate(() => { const lp = document.getElementById('logoplate'), s = lp && getComputedStyle(lp); return { look: document.getElementById('front').getAttribute('data-look'), sheet: !!document.getElementById('bm-jtf-css'), marks: document.querySelectorAll('.jtf-mark').length, jtfTitle: !!document.querySelector('.bm-start.jtf'), plateClip: s ? s.clipPath : '', logobig: getComputedStyle(document.getElementById('logobig')).display }; });
    } });
    cErrs = d.errs ? d.errs.slice() : []; await d.close();
  }

  /* ---------- verdicts ---------- */
  const markOk = (m, where) => {
    ok('J2 ' + where + ': the letters are his wordmark cropped to its ink (321 x 71), every opaque pixel his, no card pixel kept, 99% of his gold kept',
      !!m && m.nat[0] === CROP.w && m.nat[1] === CROP.h && m.his === m.opaque && m.cardKept === 0 && m.goldKept >= 0.99 * m.goldIn,
      m ? m.nat.join('x') + ', ' + m.his + ' of ' + m.opaque + ' his, card kept ' + m.cardKept + ', gold ' + m.goldKept + '/' + m.goldIn : 'no letters canvas');
    const k = m ? m.css[0] / m.nat[0] : 0;
    ok('J3 ' + where + ': one pixel size, the letters at a whole scale (' + (m ? m.css.join('x') + ' css' : '?') + ')', !!m && Math.abs(k - Math.round(k)) < 0.01 && Math.round(k) >= 1 && Math.abs(m.css[1] / m.nat[1] - k) < 0.01, 'scale ' + k.toFixed(3));
  };
  markOk(up.tMark, 'upright title'); markOk(up.lMark, 'upright loading screen'); markOk(side.tMark, 'sideways title'); markOk(side.lMark, 'sideways loading screen');
  ok('J3 on his phone the scale is one css pixel a pixel (three phone pixels), the same as the words around it', !!up.tMark && up.tMark.css[0] === CROP.w && up.tMark.dpr === 3);
  ok('J1 THE CARD IS GONE behind the title\'s letters: no grey card pixel in their box on the glass', up.tCard < 0.005, (up.tCard * 100).toFixed(2) + '% card');
  ok('J1 and behind the loading screen\'s letters (#loadtag)', up.lCard < 0.005, (up.lCard * 100).toFixed(2) + '% card');
  ok('J1 PLANTED: the card painted back behind the title\'s letters is caught', up.plants.card > 0.5, (up.plants.card * 100).toFixed(0) + '% card');
  const def = (list, where) => ok('J4 no browser default on ' + where + ' (gradient, glow, blur, corner, animation, phone face, off-grid size)', list && !list.length, (list || ['not read']).slice(0, 4).join(' | '));
  def(up.tDef, 'the title, upright'); def(up.nDef, 'the NOTES sheet over the title'); def(up.lDef, 'the picks and the terminal, upright'); def(side.tDef, 'the title, sideways'); def(side.lDef, 'the picks and the terminal, sideways');
  ok('J4 PLANTED: a phone font on the subtitle is caught', up.plants.face.some(s => /face Arial/.test(s)));
  ok('J4 PLANTED: an 11 px label is caught', up.plants.size.some(s => /size 11px/.test(s)));
  ok('J4 PLANTED: a gradient on the bar is caught', up.plants.gradient.some(s => /loadfill.*gradient/.test(s)));
  ok('J4 PLANTED: a glow on BEGIN is caught', up.plants.glow.some(s => /fronttap.*glow/.test(s)));
  ok('J4 PLANTED: a round corner on a pick is caught', up.plants.corner.some(s => /corner/.test(s)));
  const wordsOk = (list, where) => { const bad = (list || []).filter(w => w.plain < 4.5 || w.sun < 4.5);
    ok('J5 every enabled word reads on ' + where + ': 4.5 to 1 and in the sun (' + (list || []).length + ' words)', list && list.length > 5 && !bad.length, bad.slice(0, 4).map(w => w.k + ' ' + w.plain + '/' + w.sun + ' on ' + w.bg + ' in ' + w.col).join(' | ')); };
  wordsOk(up.tWords, 'the title, upright'); wordsOk(up.lWords, 'the picks and the terminal, upright'); wordsOk(side.tWords, 'the title, sideways'); wordsOk(side.lWords, 'the picks and the terminal, sideways');
  ok('J5 PLANTED: a dim subtitle is caught', (up.plants.dim || []).some(w => /POST-ECONOMIC/.test(w.k) && (w.plain < 4.5 || w.sun < 4.5)));
  ok('J6 ONE NEXT THING: with no run the one gold choice is NEW GAME', JSON.stringify(up.lead0.gold) === '["new"]', up.lead0.gold.join(','));
  ok('J6 and with a run saved the one gold choice is CONTINUE', JSON.stringify(up.lead1.gold) === '["continue"]', up.lead1.gold.join(','));
  ok('J6 PLANTED: the gold on a second title choice is caught', up.plants.lead.gold.length > 1, up.plants.lead.gold.join(','));
  ok('J6 BEGIN is gold once the game is in, and says BEGIN', up.begin.ready && up.begin.bg === 'rgb(200, 171, 99)' && up.begin.txt === 'BEGIN', up.begin.txt + ' ' + up.begin.bg);
  ok('J7 THUMBS: every title choice 48 css px or taller, NOTES 40', up.lead0.hs.length === 3 && up.lead0.hs.every(h => h >= 48) && up.notesH >= 40, up.lead0.hs.join(',') + ' notes ' + up.notesH);
  ok('J7 every pick 44 css px or taller and BEGIN 48, upright and sideways', !up.fit.thin.length && !side.fit.thin.length && up.fit.tapH >= 48 && side.fit.tapH >= 48, up.fit.thin.concat(side.fit.thin).join(' | '));
  ok('J7 PLANTED: a pick squeezed under a thumb is caught', up.plants.thumb.thin.length > 0);
  const fitOk = (f, where) => ok('J8 NOTHING OFF THE GLASS ' + where + ': the picks fit their column (' + f.scroll + ' of ' + f.client + '), none below the glass, BEGIN clear of the picks and the stamp, the stamp on the glass',
    f.scroll <= f.client + 1 && !f.below.length && !f.tapOverPicks && !f.tapOverStamp && f.stampOn, JSON.stringify({ below: f.below, tapOverPicks: f.tapOverPicks, tapOverStamp: f.tapOverStamp, stampOn: f.stampOn }));
  fitOk(up.fit, 'upright'); fitOk(side.fit, 'sideways');
  ok('J8 sideways the title\'s letters and its menu do not overlap and stay on the glass', side.menu && !side.menu.over && side.menu.on);
  ok('J9 THE CLASSIC DOOR IS UNTOUCHED when the switch is classic: no bare sheet, no letters canvas, the plate as it was',
    !!classic && classic.look !== 'just-the-font' && !classic.sheet && classic.marks === 0 && !classic.jtfTitle && classic.plateClip !== 'none' && classic.logobig !== 'none',
    classic ? JSON.stringify(classic) : 'not read');
  const errs = (up.errs || []).concat(side.errs || [], cErrs);
  ok('J11 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate itself threw: ' + (e && e.stack || e)); fail++; done(); });
