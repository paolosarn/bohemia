#!/usr/bin/env node
/* WHOSE STREETS, AND WHAT THE MONEY LOOKS LIKE (WORLD 17, 11/27/26; VAMILY rule 485(a): 'every district reads who lives there and why
   without a word (the money it has or lost, whose streets they are ...) ... beside the blocks that still have power, each gang's
   streets carrying its look (COLOUR IS TERRITORY)'; rule 485(b), ECONOMY FOUR's call: 'a broke town and a well-off one can LOOK it';
   rule 495(b): one owning module, engine/bohemia_district_look.js, the painter calls it and carries no copy).
     STATIC (node)
     S1 the palette: every faction the map draws gets its own colour as its tag; a drab one (under the saturation line) gets no light,
        a saturated one a light of its own hue
     S2 whose street: a faction's own wire and the Network's grid are theirs; a lit (or lost) neighbourhood wire is its ground's; a wire
        never lit, or no wire, is nobody's
     S3 the grids (PLANTED): a building facing a lit street has power and the street's mark; one facing only the freeway, or an
        unlit street, has none; a road's own block keeps its own; the old reading (no feeding) is red here
     S4 the dead Strip moved pixel for pixel (the old painter lines, kept here as the reference, against the module on 4,000 texels)
     S5 the tags: only at the foot of a gang's walls (two storeys of paint at most), only on its casinos, towers and houses, never on a
        burned block or a frame, never on a town's box; its colour on a share of its roofs; a block with no mark is untouched
     S6 the money: a broke town boards windows, holes and dusts its roofs, grimes its walls; a well-off one puts panels on its roofs;
        getting by (and a place that is not a town) is exactly as it was; the lit floors 0.12 / 0.3 / 0.55
     S7 the page: the module is loaded, handed to the painter's worker as source, called once by the painter (no inline copy, no
        second declaration), and both inputs (the whole painting and a tile) carry the same grids
     ON THE PAGE (the demo, a phone upright)
     P1 the grids on the real valley: buildings have power only beside a lit street, more of them than before, every mark a faction's
     P2 the painting carries it (its key), and the painter changes pixels on a gang's street and lights more at night
     P3 the towns read the book: a place made broke and one made well off reach the town's painting (its key) and change its pixels
     P4 the 5-second check stays cheap (the valley's input in ms) and nothing threw
   Run: node gates/whose_streets_gate.js [static] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
global.vbHash = function (x, y, s) { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const D = require(path.join(ROOT, 'engine', 'bohemia_district_look.js'));

function statics() {
  console.log('\n-- static --');
  const page = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const m = page.match(/var MAP_ART = (\{.*?\});\n/), fac = m ? JSON.parse(m[1]).fac : {};
  const names = Object.keys(fac).sort(), P = D.palette(names, n => fac[n] && fac[n].banner);
  const drab = names.filter((n, i) => P.drab[i + 1]), lit = names.filter((n, i) => P.light[i + 1]);
  ok('S1 the palette: ' + names.length + ' factions, each its own colour as its tag; drab (no light) ' + drab.join(', ') + '; a light of their own hue: ' + lit.length,
     names.length >= 12 && names.every((n, i) => P.tag[i + 1]) && drab.length >= 2 && lit.length + drab.length === names.length && names.every((n, i) => P.drab[i + 1] === !P.light[i + 1]) && D.palette(names, n => fac[n].banner) === P);
  const ix = n => names.indexOf(n) + 1;
  const S2 = [D.markOf(P, { id: 3, live: true, faction: 'Reds' }) === ix('Reds'), D.markOf(P, { id: 3, live: true, faction: 'network' }) === ix('Network'),
    D.markOf(P, { id: 3, live: true, faction: null, ground: 'Church' }) === ix('Church'), D.markOf(P, { id: 3, live: false, doused: true, ground: 'Church' }) === ix('Church'),
    D.markOf(P, { id: 3, live: false, ground: 'Church' }) === 0, D.markOf(P, { id: -1, live: false, ground: 'Church' }) === 0, D.markOf(P, null) === 0];
  ok('S2 whose street: a faction\'s own wire, the Network\'s grid, a lit or lost wire\'s ground are theirs; a never-lit wire or no wire nobody\'s', S2.every(Boolean), S2.join(','));
  /* S3 PLANTED: 5 x 5; row 2 a street, its west half lit and the Reds', its east half unlit; column 4 the freeway (lit, nobody's) */
  const N = 5, cell = (x, y) => y === 2 && x < 4 ? (x < 2 ? { id: 1, live: true, faction: 'Reds' } : { id: 2, live: false, ground: 'Blues' }) : x === 4 ? { id: 9, live: true } : { id: -1, live: false };
  const street = (x, y) => y === 2 && x < 4;
  const G = D.grids(P, N, cell, street), at = (a, x, y) => a[y * N + x];
  const S3 = [at(G.live, 0, 1) === 1 && at(G.turf, 0, 1) === ix('Reds'), at(G.live, 1, 3) === 1 && at(G.turf, 1, 3) === ix('Reds'),
    at(G.live, 3, 1) === 0 && at(G.turf, 3, 1) === 0, at(G.live, 3, 0) === 0, at(G.live, 0, 2) === 1 && at(G.turf, 0, 2) === ix('Reds'), at(G.live, 2, 2) === 0];
  const old = (x, y) => cell(x, y).live ? 1 : 0;
  ok('S3 the grids (planted): a building on the Reds\' lit street has power and their mark; one by the freeway or an unlit street has none; the road keeps its own',
     S3.every(Boolean), S3.join(','));
  const G2 = D.grids(P, N, cell, street, (x, y) => x === 0 && y === 1);
  ok('S3 a burned shell or a frame on the lit street never takes power (deadAt), its neighbour still does', at(G2.live, 0, 1) === 0 && at(G2.live, 1, 1) === 1 && at(G2.live, 0, 2) === 1);
  ok('S3 PLANTED: the old reading (only a wire\'s own block has power) leaves the building on the lit street dark: red', old(0, 1) === 0 && at(G.live, 0, 1) === 1);
  /* S4: the old painter lines, as they stood on main before 11/27 WORLD 17 */
  const DUST = 128, mute = (c, k) => [c[0] * (1 - k) + DUST * k, c[1] * (1 - k) + DUST * k, c[2] * (1 - k) + DUST * k];
  const oldDead = (b, cas, neon, win, top, lit, ws) => { if (!ws && !lit) {   /* (the old lines ran on a casino or a tower only: K 1 or 2 below) */
    if (neon || (top && cas)) { const mn = mute(b, 0.62); return [mn[0] * 0.78, mn[1] * 0.76, mn[2] * 0.74]; }
    if (win) return [b[0] * 0.18 + 24, b[1] * 0.18 + 23, b[2] * 0.18 + 22];
    const mw = mute(b, 0.2); return [mw[0] * 0.84, mw[1] * 0.83, mw[2] * 0.82]; } return b; };
  let same = 0, tot = 0, r = 12345; const rnd = () => (r = (Math.imul(r, 1103515245) + 12345) >>> 0) / 4294967296;
  for (let i = 0; i < 4000; i++) { const b = [rnd() * 255, rnd() * 255, rnd() * 255], K = rnd() < 0.5 ? 1 : 2, neon = rnd() < 0.2, win = !neon && rnd() < 0.3, top = rnd() < 0.4, lit = rnd() < 0.5 ? 1 : 0, ws = rnd() < 0.15 ? 1 + ((rnd() * 4) | 0) : 0;
    const a = D.day(b, K, neon, win, top, false, 1 + ((rnd() * 9) | 0), 1, lit, ws, null, -1, (rnd() * 999) | 0, (rnd() * 999) | 0, 7, DUST), o = oldDead(b, K === 1, neon, win, top, lit, ws);
    tot++; if (a.every((v, j) => Math.abs(v - o[j]) < 1e-9)) same++; }
  ok('S4 the dead Strip moved pixel for pixel: ' + same + ' of ' + tot + ' texels the same as the old painter lines', same === tot);
  /* S5: the tags */
  const tag = [200, 30, 30], grey = [100, 100, 100];
  let foot = 0, high = 0, onTop = 0, burned = 0, town = 0, none = 0, roofs = 0, roofN = 0;
  for (let u = 0; u < 60; u++) for (let v = 0; v < 6; v++) for (const K of [1, 2, 3]) {
    const f = D.day(grey, K, false, false, false, false, 1, 2, 1, 0, tag, -1, u, v, 7, DUST); if (f !== grey) foot++;
    if (D.day(grey, K, false, false, false, false, 5, 2, 1, 0, tag, -1, u, v, 7, DUST) !== grey) high++;
    if (D.day(grey, K, false, false, true, false, 0, 2, 1, 0, tag, -1, u, v, 7, DUST) !== grey) onTop++;
    if (D.day(grey, K, false, false, false, false, 1, 2, 1, 1, tag, -1, u, v, 7, DUST) !== grey || D.day(grey, K, false, false, false, false, 1, 2, 1, 4, tag, -1, u, v, 7, DUST) !== grey) burned++;
    if (D.day(grey, K, false, false, false, false, 1, 2, 1, 0, null, -1, u, v, 7, DUST) !== grey) none++;
  }
  for (let u = 0; u < 90; u++) for (let v = 0; v < 90; v++) { roofN++; if (D.day(grey, 1 + ((u + v) % 3), false, false, true, true, 0, 2, 1, 0, tag, -1, u, v, 7, DUST) !== grey) roofs++; }
  for (let u = 0; u < 60; u++) if (D.day(grey, 4, false, false, false, false, 1, 2, 1, 0, tag, 1, u, 0, 7, DUST) !== grey) town++;
  ok('S5 the tags: at the foot of the walls (' + foot + ' of 1080), none above two storeys of paint (' + high + '), none on a top face (' + onTop + '), a burned block or a frame (' + burned + '), a town\'s box (' + town + ') or a block with no mark (' + none + '); its colour on ' + Math.round(100 * roofs / roofN) + '% of its roofs',
     foot > 300 && foot < 800 && !high && !onTop && !burned && !town && !none && roofs > 0.06 * roofN && roofs < 0.25 * roofN);
  /* S6: the money */
  let board = 0, hole = 0, dusty = 0, panel = 0, panelWall = 0, same1 = 0, sameNT = 0, n6 = 0, grime = 0;
  const wall = [90, 110, 130];
  for (let u = 0; u < 40; u++) for (let v = 0; v < 40; v++) { n6++;
    const bw = D.day(wall, 4, false, false, false, false, 3, 2, 1, 0, null, 0, u, v, 7, DUST); if (bw[0] === 100 || bw[0] === 82) board++; else if (bw !== wall) grime++;
    const br = D.day(wall, 4, false, false, true, true, 0, 2, 1, 0, null, 0, u, v, 7, DUST); if (br[0] === 34) hole++; else if (br[2] < wall[2] - 5) dusty++;
    const wr = D.day(wall, 4, false, false, true, true, 0, 2, 1, 0, null, 2, u, v, 7, DUST); if (wr !== wall && (wr[2] > wr[0] + 30)) panel++;
    const ww = D.day(wall, 4, false, false, false, false, 3, 2, 1, 0, null, 2, u, v, 7, DUST); if (ww[2] > ww[0] + 60) panelWall++;
    if (D.day(wall, 4, false, false, true, true, 3, 2, 1, 0, null, 1, u, v, 7, DUST) === wall && D.day(wall, 4, false, false, false, false, 3, 2, 1, 0, null, 1, u, v, 7, DUST) === wall) same1++;
    if (D.day(wall, 3, false, false, true, true, 3, 2, 1, 0, null, 0, u, v, 7, DUST) === wall) sameNT++; }
  ok('S6 the money: broke boards ' + board + ' and grimes ' + grime + ' of ' + n6 + ' window-band texels, holes ' + hole + ' and dusts ' + dusty + ' roof texels; well off puts panels on ' + panel + ' roof texels (none on a wall: ' + panelWall + '); getting by and a block not a town untouched (' + same1 + ', ' + sameNT + ' of ' + n6 + '); lit floors ' + [0, 1, 2, -1].map(D.lit).join(' / '),
     board > 0.3 * n6 && board < 0.6 * n6 && grime === n6 - board && hole > 0.05 * n6 && hole < 0.25 * n6 && dusty === n6 - hole && panel > 0.3 * n6 && panel < 0.7 * n6 && !panelWall && same1 === n6 && sameNT === n6 && D.lit(0) < D.lit(1) && D.lit(1) === 0.3 && D.lit(2) > D.lit(1) && D.lit(-1) === 0.3);
  /* S7: the page */
  const tag7 = /<script src="\.\.\/engine\/bohemia_district_look\.js"><\/script>/.test(page), worker = /vbMixStorey\]\.concat\(typeof BohemiaDistrictLook !== 'undefined' \? BohemiaDistrictLook\.WORKER : \[\]\)\.map\(String\)/.test(page);
  const calls = (page.match(/b = DLD\(b, dK,/g) || []).length, copy = /function vbDistrictDay|function vbDistrictLit/.test(page);
  const both = /var DLG = vbDistrictGrids\(\), DLP = DLG \? DLG\.pal : null, turf = DLP \? DLG\.turf : null;/.test(page) && /var DLG = VB_DL && VB_DL\.seed === om\.seed && VB_DL\.n === N \? VB_DL : vbDistrictGrids\(\)/.test(page) && /turf: turf, turfPal: DLP \};/.test(page);
  ok('S7 the page: the module loaded (' + tag7 + '), handed to the painter\'s worker as source (' + worker + '), called once by the painter (' + calls + '), no copy in the page (' + !copy + '), the whole painting and a tile cut from the same grids (' + both + ')',
     tag7 && worker && calls === 1 && !copy && both);
}

async function pageRun() {
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  console.log('\n-- the demo upright --');
  const d = await open({ profile: 'phone_portrait', fog: false });
  const fr = d.fr, pg = d.page, errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && !!window.VBC && !!VBC.day)) break; await pg.waitForTimeout(500); }
    const r = await fr.evaluate(() => {
      const G = vbDistrictGrids(), n = om.n, P = G.pal, out = { fed: 0, fed0: 0, bad: [], marks: {}, builtMarks: {} };
      const cl = (x, y) => vbClassOf((om.at(x, y) || {}).district), st = (x, y) => { const c = cl(x, y); return c === VB_CLASS.road || c === VB_CLASS.blvd; };
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const k = y * n + x, c = POWER.at(x, y);
        if (c.live) out.fed0++; if (G.live[k]) out.fed++;
        const ws = window.__WS_CELL ? window.__WS_CELL[k] : 0; if (G.live[k] && !c.live && (ws === 1 || ws === 4)) out.dead = (out.dead || 0) + 1; if (ws === 4) out.frames = (out.frames || 0) + 1;
        if (G.live[k] && !c.live) { let ok2 = false; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < n && Y < n && st(X, Y) && POWER.at(X, Y).live) ok2 = true; } if (!ok2) out.bad.push([x, y]); }
        const m = G.turf[k]; if (m) { const f = P.names[m - 1]; out.marks[f] = (out.marks[f] || 0) + 1; if (!st(x, y) && cl(x, y) !== VB_CLASS.freeway) out.builtMarks[f] = (out.builtMarks[f] || 0) + 1; } }
      /* the painter on the box round the most-marked built block, with and without */
      let best = null; for (let y = 0; y < n - 8; y += 2) for (let x = 0; x < n - 8; x += 2) { let c = 0; for (let dy = 0; dy < 8; dy++) for (let dx = 0; dx < 8; dx++) { const k = (y + dy) * n + x + dx; if (G.turf[k] && !st(x + dx, y + dy) && !P.drab[G.turf[k]]) c++; } if (!best || c > best.c) best = { x, y, c }; }
      const A = vbCityCore(vbBoxInput(best.x, best.y, 8, 24)), i0 = vbBoxInput(best.x, best.y, 8, 24); i0.turf = null; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) i0.live[y * 8 + x] = POWER.at(best.x + x, best.y + y).live ? 1 : 0;
      const B = vbCityCore(i0); let diff = 0, la = 0, lb = 0;
      for (let i = 0; i < A.day.length; i += 4) { if (Math.abs(A.day[i] - B.day[i]) + Math.abs(A.day[i + 1] - B.day[i + 1]) + Math.abs(A.day[i + 2] - B.day[i + 2]) > 12) diff++; if (A.lights[i + 3]) la++; if (B.lights[i + 3]) lb++; }
      out.box = { at: [best.x, best.y], marked: best.c, diff, lights: [lb, la] };
      out.key = !!(VBC.key && P && VBC.key.indexOf(':' + P.key) >= 0);
      const t = []; for (let i = 0; i < 5; i++) { const a0 = performance.now(); vbCityInput(); t.push(performance.now() - a0); } t.sort((a, b) => a - b); out.inputMs = Math.round(t[2] * 10) / 10;
      return out; });
    ok('P1 the grids: ' + r.fed + ' blocks have power (a road\'s own: ' + r.fed0 + '), every building with power beside a lit street (' + r.bad.length + ' not), no frame (' + (r.frames | 0) + ' frame blocks) or burned shell with power (' + (r.dead | 0) + '), marks ' + JSON.stringify(r.marks),
       r.fed > r.fed0 * 1.5 && !r.bad.length && !r.dead && Object.keys(r.builtMarks).length >= 4, JSON.stringify(r.bad.slice(0, 3)));
    ok('P2 the painting carries it (its key: ' + r.key + '); on a gang\'s street (' + r.box.marked + ' marked buildings at ' + r.box.at + ') the painter changes ' + r.box.diff + ' texels by day and lights ' + r.box.lights[1] + ' at night against ' + r.box.lights[0],
       r.key && r.box.diff > 100 && r.box.lights[1] > r.box.lights[0]);
    const w = await fr.evaluate(async () => {
      const f0 = 'Anarchists', f2 = 'Network';
      PLACE_BOOK.st[f0] = Object.assign(PLACE_BOOK.st[f0] || {}, { verdict: 'broke', shelf: 0.75 }); PLACE_BOOK.st[f2] = Object.assign(PLACE_BOOK.st[f2] || {}, { verdict: 'well_off', shelf: 1.25 });
      const L = vbTownsInput() || [], a = L.find(t => t.name.toUpperCase() === f0.toUpperCase()), b = L.find(t => t.name.toUpperCase() === f2.toUpperCase());
      const key = VB_TOWNS.key, ci = vbCityInput(), L2 = VB_TOWNS.list || [], a2 = L2.find(t => t.name.toUpperCase() === f0.toUpperCase()), b2 = L2.find(t => t.name.toUpperCase() === f2.toUpperCase());   /* the 5-second input made the list again: paint from the list the painter is handed */
      const paint = (t) => { const x0 = t.bx - 2, y0 = t.by - 2, A = vbCityCore(vbBoxInput(x0, y0, 5, 24)); const sv = t.wl; t.wl = 1; const B = vbCityCore(vbBoxInput(x0, y0, 5, 24)); t.wl = sv;
        let d = 0; for (let i = 0; i < A.day.length; i += 4) if (Math.abs(A.day[i] - B.day[i]) + Math.abs(A.day[i + 1] - B.day[i + 1]) + Math.abs(A.day[i + 2] - B.day[i + 2]) > 12) d++; return d; };
      return { a: a && a.wl, b: b && b.wl, key: key.indexOf(',w0') >= 0 && key.indexOf(',w2') >= 0, inKey: ci.key.indexOf(VB_TOWNS.key) >= 0, da: a2 ? paint(a2) : -1, db: b2 ? paint(b2) : -1 }; });
    ok('P3 the towns read the book: Anarchists made broke -> ' + w.a + ', Network made well off -> ' + w.b + ', the painting\'s key carries both (' + w.key + ', ' + w.inKey + '); their pixels change (' + w.da + ' broke, ' + w.db + ' well off)',
       w.a === 0 && w.b === 2 && w.key && w.inKey && w.da > 50 && w.db > 50);
    ok('P4 the 5-second check stays cheap (the valley\'s input ' + r.inputMs + ' ms) and nothing threw', r.inputMs < 60 && !errs.length, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  statics();
  if (process.argv[2] !== 'static') { try { await pageRun(); } catch (e) { ok('the page ran', false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nWHOSE STREETS: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
