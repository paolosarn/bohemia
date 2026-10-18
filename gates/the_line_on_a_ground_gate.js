/* THE LINE ON A GROUND  (UI lane 11, [the line on a ground], 10/18/26)

   The row (rule 88, the twin's difference 2): the company screen sat on flat near-black where the opening screen he
   called awesome sits on the painted night valley; give the roster and the hall a ground from the approved packs, a
   camp at night behind the two lines, never a gradient, the words keep the sun test. A CANDIDATE (rule 100): painted
   by tools/bohemia_ui_the_line_on_a_ground_cook.py into records/target/ui_line_on_a_ground/, laid in the browser only
   by tools/bohemia_ui_the_line_on_a_ground_sheet.js (the same lay() this gate calls). Record:
   records/BOHEMIA_THE_LINE_ON_A_GROUND_10_18_26.md

   WHAT THIS HOLDS:
     G1  THE GROUND IS HIS: every tile the manifest says was laid is the bank's own bytes (sha1 of pack and index in
         banks/BOHEMIA_HD_TILE_REPO_part*.txt), from the two packs the row names, and the painting really is those
         tiles: the painting's light follows each tile's own light (luminance correlation 0.85 or more on the tiles
         the lamp does not reach); a ground drawn by hand, or a flat fill, correlates with nothing
     G2  RE-LIT, NEVER DARKENED (rule 114's fourth tell): both night ramps hue-shift 8 degrees or more from dark to
         light, read from the ramp's own colours, not from the hue numbers the painter wrote
     G3  ONE PIXEL SIZE: each painting is the width of its screen class (390 upright, 844 on its side) and is drawn at
         one css pixel a pixel, nearest (image-rendering pixelated)
     G4  NO GRADIENT, GLOW, BLUR OR ROUND CORNER in anything the candidate puts on the screen (rule 114 D10)
     G5  EVERY WORD ON THE GROUND READS: 4.5 to 1 against what is really under it (the word's own box shot with its
         ink made clear) and again in the sun (rule 73); A, B and C, upright and on its side, and the hall
     G6  THE LINE STILL WORKS: every cell where it was, the same size (48 x 64, the 44 pt bar), the finger lands on
         the cell and never on the ground (hit-tested at every cell's middle), every face's pixels unchanged
     G7  A AND C: every man stands on the rig's contact line; B: every man keeps his cardboard backing
     G8  ONE LIGHT: the ground under the words is darker than the lamp's pool (the brightest of the band is the pool)
     G9  THE HALL: the floor under every hire card, every card keeps its cardboard, every Hire press lands on itself
   PLANTED (each must turn its leg red, every run): a flat painted ground in place of his tiles (G1), a ramp with no
   hue shift (G2), the camp drawn at twice the size (G3), a gradient on the empty cells (G4), a dim word (G5), the
   ground laid over the line (G6).

   node gates/the_line_on_a_ground_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.dirname(__dirname);
const T = process.env.BM_OUT || path.join(ROOT, 'records/target/ui_line_on_a_ground');
const S = require(path.join(ROOT, 'tools/bohemia_ui_the_line_on_a_ground_sheet.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } return !!g; };
const done = () => { console.log('\nTHE LINE ON A GROUND: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const PACKS = { '2. Soil and dirt tiles': [0, 1, 20, 21, 22], '1. Cracked contrete tiles': [0, 1, 2, 6, 7] };

function hueSpread(stops) {
  const h = stops.map(([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return null;
    let x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (x * 60 + 360) % 360; }).filter(v => v !== null);
  let best = 0; for (const a of h) for (const b of h) { const d = Math.abs(a - b); best = Math.max(best, Math.min(d, 360 - d)); }
  return best;
}
function bankShas() {
  const out = {};
  for (let i = 1; i <= 4; i++) {
    const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_HD_TILE_REPO_part' + i + '.txt'), 'utf8'));
    for (const [k, ids] of Object.entries(PACKS)) if (d.packs[k]) for (const j of ids) out[k + '#' + j] = { sha: crypto.createHash('sha1').update(Buffer.from(d.packs[k][j].b64, 'base64')).digest('hex'), b64: d.packs[k][j].b64 };
  }
  return out;
}
/* in a page: does the painting follow the tiles it says it laid? luminance correlation per placement, on placements
   wholly inside the frame and wholly outside the lamp's outer ring and every prop */
async function follows(page, png, tiles, bank, avoid) {
  return page.evaluate(async ({ png, tiles, avoid }) => {
    const load = async s => { const im = new Image(); im.src = s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return { w: im.width, h: im.height, d: g.getImageData(0, 0, im.width, im.height).data }; };
    const P = await load(png), L = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const rs = [];
    for (const t of tiles) {
      const [ix, iy, cw, ch] = t.crop;
      if (t.x < 0 || t.y < 0 || t.x + cw > P.w || t.y + ch > P.h - 32) continue;
      if (avoid.some(a => t.x < a[0] + a[2] && t.x + cw > a[0] && t.y < a[1] + a[3] && t.y + ch > a[1])) continue;
      const Tl = await load('data:image/png;base64,' + t.b64);
      let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
      for (let y = 0; y < ch; y += 2) for (let x = 0; x < cw; x += 2) {
        const sx = t.flip ? ix + cw - 1 - x : ix + x, si = ((iy + y) * Tl.w + sx) * 4, pi = ((t.y + y) * P.w + t.x + x) * 4;
        if (Tl.d[si + 3] < 200) continue;
        const a = L(Tl.d, si), b = L(P.d, pi); n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
      }
      const r = (sab - sa * sb / n) / Math.sqrt((saa - sa * sa / n) * (sbb - sb * sb / n));
      rs.push(isFinite(r) ? r : 0);
    }
    return rs;
  }, { png, tiles: tiles.map(t => Object.assign({}, t, { b64: bank[t.pack + '#' + t.idx].b64 })), avoid });
}

(async () => {
  console.log('\nTHE LINE ON A GROUND  (UI [the line on a ground], a candidate: laid in the browser only)\n');
  const man = JSON.parse(fs.readFileSync(path.join(T, 'manifest.json'), 'utf8'));
  const bank = bankShas();

  /* G1a, G2, G3a: pure */
  const allTiles = Object.values(man.out).flatMap(o => o.tiles);
  const bad = allTiles.filter(t => !PACKS[t.pack] || !PACKS[t.pack].includes(t.idx) || !bank[t.pack + '#' + t.idx] || bank[t.pack + '#' + t.idx].sha !== t.sha1);
  ok('G1 EVERY TILE LAID IS HIS: the bank\'s own bytes, from the two packs the row names', allTiles.length > 100 && !bad.length, allTiles.length + ' placements, ' + bad.length + ' not his');
  ok('G2 RE-LIT, NEVER DARKENED: the moon\'s ramp hue-shifts 8 degrees or more', hueSpread(man.moon) >= 8, Math.round(hueSpread(man.moon)) + ' degrees');
  ok('G2 RE-LIT, NEVER DARKENED: the lamp\'s ramp hue-shifts 8 degrees or more', hueSpread(man.lamp) >= 8, Math.round(hueSpread(man.lamp)) + ' degrees');
  const dims = f => { const b = fs.readFileSync(path.join(T, f)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
  ok('G3 ONE PIXEL SIZE: each painting is its screen class\'s width (390, 844; the hall 390)',
    ['camp_upright.png', 'ground_upright.png'].every(f => dims(f)[0] === 390) && ['camp_sideways.png', 'ground_sideways.png'].every(f => dims(f)[0] === 844) && dims('hall_floor.png')[0] === 390);

  /* the screens: every leg in one function, so a planted defect is read by the same code that reads the candidate */
  async function legs(p, view, opt, B0, plant) {
    const out = [], L_ = (k, g, x) => out.push([k, !!g, x]);
    const file = (opt === 'C' ? 'ground_' : 'camp_') + view + '.png';
    if (plant === 'G1') await p.evaluate(() => { const c = document.createElement('canvas'); c.width = innerWidth; c.height = 264; const g = c.getContext('2d'); g.fillStyle = '#16131a'; g.fillRect(0, 0, c.width, c.height); for (let i = 0; i < 400; i++) { g.fillStyle = i % 2 ? '#1d1a22' : '#121016'; g.fillRect((i * 37) % c.width, (i * 53) % 264, 3, 2); } document.getElementById('bm-camp').style.backgroundImage = 'url(' + c.toDataURL() + ')'; });
    if (plant === 'G3') await p.evaluate(() => { document.getElementById('bm-camp').style.backgroundSize = (innerWidth * 2) + 'px 528px'; });
    if (plant === 'G4') await p.evaluate(() => { const s = document.createElement('style'); s.textContent = 'html[data-bm-roster] .cell:not(.full){background:linear-gradient(#222,#000)}'; document.head.appendChild(s); });
    if (plant === 'G5') await p.evaluate(() => { const s = document.createElement('style'); s.textContent = 'html[data-bm-roster] .ln{color:#5a5248 !important}'; document.head.appendChild(s); });
    if (plant === 'G6') await p.evaluate(() => { const e = document.getElementById('bm-camp'); e.style.zIndex = '5'; e.style.pointerEvents = 'auto'; });
    const shown = await p.evaluate(() => getComputedStyle(document.getElementById('bm-camp')).backgroundImage.replace(/^url\("?|"?\)$/g, ''));
    const m = man.out[file];
    /* G1b: the painting on the screen follows his tiles */
    const avoid = (m.props || []).map(q => [q.x, q.y, q.w, q.h]).concat([[m.lamp[0] - m.radii[0], m.lamp[1] - m.radii[0] / 2, m.radii[0] * 2, m.radii[0]]]);
    const rs = await follows(p, shown, m.tiles, bank, avoid);
    const med = rs.length ? rs.slice().sort((a, b) => a - b)[Math.floor(rs.length / 2)] : 0;
    L_('G1 THE PAINTING IS HIS TILES: its light follows each tile\'s own light, median correlation 0.85 or more', rs.length >= 4 && med >= 0.85, rs.length + ' tiles read, median ' + med.toFixed(3));
    /* G3b, G4 */
    const L = await p.evaluate(() => {
      const e = document.getElementById('bm-camp'), cs = getComputedStyle(e), bad = [];
      const look = el => { const s = getComputedStyle(el); if (/gradient/.test(s.backgroundImage)) bad.push('gradient ' + (el.id || el.className)); if (s.filter !== 'none' && /blur/.test(s.filter)) bad.push('blur ' + (el.id || el.className));
        if (s.boxShadow !== 'none' && /\d+px -?\d+px [1-9]\d*px/.test(s.boxShadow)) bad.push('glow ' + (el.id || el.className)); if (parseFloat(s.borderTopLeftRadius) > 1) bad.push('corner ' + (el.id || el.className)); };
      look(e); document.querySelectorAll('.cell:not(.full), .bm-contact').forEach(look);
      const css = (document.getElementById('bm-camp-css') || {}).textContent || '';
      if (/gradient|blur\(|border-radius:[2-9]/.test(css)) bad.push('in the candidate css');
      return { size: cs.backgroundSize, render: cs.imageRendering, bad };
    });
    const img = await p.evaluate(async (s) => { const im = new Image(); im.src = s; await im.decode(); return [im.width, im.height]; }, shown);
    L_('G3 ONE PIXEL SIZE ON THE GLASS: drawn at one css pixel a pixel, nearest', L.size === img[0] + 'px ' + img[1] + 'px' && L.render === 'pixelated' && img[0] === (view === 'upright' ? 390 : 844), L.size + ' for ' + img.join('x') + ', ' + L.render);
    L_('G4 NO GRADIENT, GLOW, BLUR OR ROUND CORNER in what the candidate puts on the screen', !L.bad.length, L.bad.join(', ') || 'none');
    /* G5 */
    const W = (await S.words(p, S.ROSTER_WORDS)).filter(w => w.plain);
    L_('G5 EVERY WORD ON THE GROUND READS, plain and in the sun', W.length >= 4 && W.every(w => w.plain >= 4.5 && w.sun >= 4.5), W.map(w => w.k + ' ' + w.plain + '/' + w.sun).join(', '));
    /* G6 */
    const C = await p.evaluate(() => {
      const cells = [...document.querySelectorAll('.cell')];
      return { cells: cells.map(c => { const r = c.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }),
        hits: cells.filter(c => { const r = c.getBoundingClientRect(); if (r.right > innerWidth || r.bottom > innerHeight) return true; const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return h && c.contains(h); }).length,
        faces: [...document.querySelectorAll('.cell.full canvas.head')].map(c => c.toDataURL()) };
    });
    L_('G6 THE LINE STILL WORKS: every cell where it was, the same size', C.cells.length === B0.cells.length && C.cells.every((c, i) => c.every((v, j) => Math.abs(v - B0.cells[i][j]) < 0.5)), C.cells.length + ' cells, ' + (C.cells[0] || []).slice(2).join('x'));
    L_('G6 THE FINGER LANDS ON THE CELL, NEVER ON THE GROUND', C.hits === C.cells.length, C.hits + ' of ' + C.cells.length);
    L_('G6 EVERY FACE\'S PIXELS UNCHANGED', C.faces.length === B0.faces.length && C.faces.every((f, i) => f === B0.faces[i]), C.faces.length + ' faces');
    /* G7 */
    const K = await p.evaluate(() => [...document.querySelectorAll('.cell.full')].map(c => ({ contact: !!c.querySelector('.bm-contact'), card: /url\(/.test(getComputedStyle(c).backgroundImage) })));
    if (opt === 'B') L_('G7 B: EVERY MAN KEEPS HIS CARDBOARD BACKING', K.length && K.every(k => k.card && !k.contact), K.length + ' men');
    else L_('G7 ' + opt + ': EVERY MAN STANDS ON THE RIG\'S CONTACT LINE, no backing', K.length && K.every(k => k.contact && !k.card), K.length + ' men');
    /* G8 */
    const lum = await p.evaluate(async ({ s, lamp }) => { const im = new Image(); im.src = s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const mm = (x, y, w, h) => { const d = g.getImageData(x, y, w, h).data; let t = 0; for (let i = 0; i < d.length; i += 4) t += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; return t / (d.length / 4); };
      return { words: mm(0, 0, 120, 140), pool: mm(Math.max(0, lamp[0] - 30), Math.max(0, lamp[1] - 12), 60, 24) }; }, { s: shown, lamp: m.lamp });
    L_('G8 ONE LIGHT: the ground under the words is darker than the lamp\'s pool', lum.pool > lum.words * 2, 'words ' + lum.words.toFixed(1) + ', pool ' + lum.pool.toFixed(1));
    return out;
  }
  const B0s = {};
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    const view = prof === 'phone_portrait' ? 'upright' : 'sideways';
    const before = await S.roster(prof, '');
    B0s[view] = await before.p.evaluate(() => ({ cells: [...document.querySelectorAll('.cell')].map(c => { const r = c.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }),
      faces: [...document.querySelectorAll('.cell.full canvas.head')].map(c => c.toDataURL()) }));
    await before.d.close();
    for (const opt of ['A', 'B', 'C']) {
      console.log('\n  -- ' + view + ', candidate ' + opt + '\n');
      const { d, p } = await S.roster(prof, opt);
      for (const [k, g, x] of await legs(p, view, opt, B0s[view], '')) ok(k, g, x);
      await d.close();
    }
  }
  console.log('\n  -- planted defects (upright, candidate A): each must turn its own leg red\n');
  ok('PLANTED G2: a ramp with no hue shift is caught', hueSpread([[5, 5, 5], [15, 15, 15], [25, 25, 25], [35, 35, 35], [45, 45, 45]]) < 8);
  /* one page for all five: each plant is undone before the next (the camp's own style put back, the planted style
     sheets taken out), and a control read between them proves the undo left the candidate green */
  {
    const { d, p } = await S.roster('phone_portrait', 'A');
    const snap = await p.evaluate(() => ({ css: document.getElementById('bm-camp').style.cssText, n: document.head.querySelectorAll('style').length }));
    const undo = () => p.evaluate((snap) => { document.getElementById('bm-camp').style.cssText = snap.css; const st = document.head.querySelectorAll('style'); for (let i = st.length - 1; i >= snap.n; i--) st[i].remove(); }, snap);
    for (const [plant, leg] of [['G1', 'G1 THE PAINTING'], ['G3', 'G3 ONE PIXEL SIZE ON THE GLASS'], ['G4', 'G4 NO GRADIENT'], ['G5', 'G5 EVERY WORD'], ['G6', 'G6 THE FINGER']]) {
      const r = (await legs(p, 'upright', 'A', B0s.upright, plant)).find(l => l[0].startsWith(leg));
      ok('PLANTED ' + plant + ' (' + { G1: 'a flat painted ground', G3: 'the camp at twice the size', G4: 'a gradient on the empty cells', G5: 'a dim word', G6: 'the ground over the line' }[plant] + ') is caught', r && !r[1], r ? r[2] : 'leg not found');
      await undo();
    }
    const back = await legs(p, 'upright', 'A', B0s.upright, '');
    ok('THE UNDO IS CLEAN: after the five plants the candidate reads green again (so each plant was read alone)', back.every(l => l[1]), back.filter(l => !l[1]).map(l => l[0].slice(0, 30)).join(', ') || back.length + ' legs');
    await d.close();
  }
  /* G9: the hall */
  console.log('\n  -- the hall\n');
  {
    const { d, q } = await S.hallPage('A');
    const H = await q.evaluate(() => { const f = document.getElementById('bm-floor'), fr = f.getBoundingClientRect();
      return { floor: [fr.x, fr.y, fr.width, fr.height], render: getComputedStyle(f).imageRendering, size: getComputedStyle(f).backgroundSize,
        cards: [...document.querySelectorAll('#sbody .hire')].map(h => { const r = h.getBoundingClientRect(); const a = h.querySelector('.act'), ar = a.getBoundingClientRect();
          const hit = ar.bottom > innerHeight || (() => { const e = document.elementFromPoint(ar.x + ar.width / 2, ar.y + ar.height / 2); return e && a.contains(e); })();
          return { r: [r.x, r.y, r.width, r.height], card: /url\(/.test(getComputedStyle(h).backgroundImage), hit }; }) }; });
    ok('G9 THE HALL: THE FLOOR IS UNDER EVERY HIRE CARD, at one css pixel a pixel', H.cards.length >= 2 && H.cards.every(c => c.r[1] >= H.floor[1] && c.r[1] + c.r[3] <= H.floor[1] + H.floor[3] && c.r[0] >= H.floor[0]) && H.render === 'pixelated' && H.size === '390px 1200px', H.cards.length + ' cards on ' + H.floor.map(Math.round).join(','));
    ok('G9 EVERY CARD KEEPS ITS CARDBOARD, EVERY HIRE PRESS LANDS ON ITSELF', H.cards.every(c => c.card && c.hit), H.cards.map(c => (c.card ? 'card' : 'NO CARD') + '/' + (c.hit ? 'hit' : 'MISS')).join(' '));
    const W = (await S.words(q, S.HALL_WORDS)).filter(w => w.plain);
    ok('G5 THE HALL\'S WORDS ON THE FLOOR READ, plain and in the sun', W.length === 2 && W.every(w => w.plain >= 4.5 && w.sun >= 4.5), W.map(w => w.k + ' ' + w.plain + '/' + w.sun).join(', '));
    await d.close();
  }
  done();
})().catch(e => { console.log('  FAIL threw: ' + (e && e.stack || e)); fail++; done(); });
