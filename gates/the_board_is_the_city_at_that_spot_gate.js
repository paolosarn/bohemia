#!/usr/bin/env node
/* THE BOARD IS THE CITY AT THAT SPOT (COMBAT TWO 11/6/26, VAMILY rule 407(g) STEP ONE, ask line 450; Paolo 11/4: 'imagine if you
   made a combat map whose street layout was exactly like the city... the sizing is the same... use all the same assets, right
   now it's two different maps').
   The rule's own gate: the board's houses and streets match the map's at the fight's spot, tile for tile, on several seeds and
   districts, with a mutation leg; the fight still plays.

   ONE: THE MAP (the demo, tools/bohemia_drive_the_demo.js, the map's own frame). Three valleys (the one the demo boots and two
   more, rebuilt the way a loaded save rebuilds it: OM.buildOvermap(seed)), six spots each: the valley's suburbs, the Strip,
   downtown, industrial, a town, the open desert (the block of that district with the most of its own kind round it). For each:
     the PLAN the fight asks for (slices/bohemia_street_board.js plan(cell, 20, 15, 10)), and THE MAP'S OWN TRUTH by another road:
     HOUSES: the map's own tiles as its painter is asked for them (vbTileInput(tx, ty, 36), the lots BohemiaMapHouses stands its
       models on, each block read off its own tile, the model its own pick), each on the 12 m tile its middle falls in;
     STREETS: every block's district (om.at, vbClassOf), a street block's three by three tiles a street (and a lot the street
       runs straight through, vbThruOf, the map's own rule).
   TWO: THE FIGHT (slices/BOHEMIA_FIGHT.html alone, each plan handed whole as opts.street with its district and cell, the way the
   map's door hands a fight over), the board it deals, compared tile for tile in the board's window (20 x 15):
     H1  every map house in the window is a house on the board on the same tile, the same model          (all of them)
     H2  every house on the board is a map house                                                           (all of them)
     T1  the trailer park's trailers stand on the map's trailer tiles                                      (all of them)
     S1  a map street tile is a street on the board                                                        (97% or more)
     S2  a board street tile is on a map street                                                            (97% or more)
     R1  the ring round the board (the map past its edge) holds the map's houses too                       (all of them)
     B1  the board's houses block or are a roof (never open ground under a house)
     P1  the fight plays: AUTO two rounds on a laid board from each district, no page error
     W1  RE-AIMED by rule 423(a) (11/7): the demo's own door opens a fight at a suburb block on the TEMPLATE layout with the new
         houses (the map's own block is now asked only by a handed plan or opts.street 'map'; legs H, S, R, K, M keep that path honest)
     K1  THE BOARDS GOT POORER (rule 419, ask line 479): the laid board, dressed, is at least as rich as the template board the
         same spot dealt before 11/6h (opts.street false, the same seed and cell) on every count: props (pieces standing on it),
         cover tiles (a man hides there), blockers (no step), roofs and high ground, the floor's effects (rough, rubble, water,
         fire), distinct pieces                                                                                        (every spot)
   THREE: MUTATIONS (each must turn a leg red, or the gate is blind): M1 the plan moved one tile east; M2 one house's model swapped;
   M3 the old deal (opts.street false, the district's template) at the same spot; M4 the bare laid board (opts.dress false, the
   11/6h board) is poorer than its template on some count.
     node gates/the_board_is_the_city_at_that_spot_gate.js [--json out.json] [--shots dir] [--plans plans.json]     (about a minute and a half)
   --shots writes, for each spot, the map's own painting of the board's window (its texels, top down, turned square) beside the
   board the fight dealt (its baked picture). */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null), SHOTS = arg('--shots', null), PLANS = arg('--plans', null);
const W = 20, H = 15, RING = 10, SEEDS_MORE = [7, 4242];
const SPOTS = { suburb: /^suburb$/, strip: /^strip$/, downtown: /^downtown$/, industrial: /^(industrial|warehouse|storage)$/, town: /^town$/, desert: /^desert$/ };
const STREET_KINDS = ['road', 'walk', 'freeway'];
let pass = 0, fail = 0; const lines = [];
function check(ok, name, msg) { if (ok) pass++; else fail++; const l = (ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg; lines.push(l); console.log(l); return ok; }

/* ---------------- ONE: the map ---------------- */
async function readTheMap() {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 240; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready()))) break; await d.page.waitForTimeout(250); }
  /* __A_STREET_IN_FRONT_OF_EVERY_HOUSE__ (WORLD THIRTEEN 11/7): the home bases land a moment after the map and paint over the blocks
     under them (and the house streets step aside there), so the boards are read once they are in, never half before and half after */
  for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
  const boot = await fr.evaluate(() => om.seed);
  const out = [];
  for (const seed of [boot].concat(SEEDS_MORE)) {
    const r = await fr.evaluate(({ seed, boot, W, H, RING, spots, shots }) => {
      if (seed !== boot) { om = CBinstall(OM.buildOvermap(seed)); try { POWER = buildPower(om, seed); } catch (e) {} }
      const RX = {}; for (const k in spots) RX[k] = new RegExp(spots[k]);
      const N = om.n, D = (x, y) => { const t = om.at(x, y); return t ? t.district || '' : ''; };
      const res = [];
      for (const k in RX) {
        let best = null;
        for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) {
          if (!RX[k].test(D(x, y))) continue;
          let s = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) if (RX[k].test(D(x + dx, y + dy))) s++;
          if (!best || s > best.s) best = { x, y, s };
        }
        if (!best) { res.push({ spot: k, none: true }); continue; }
        const t0 = performance.now(), p = BohemiaStreetBoard.plan({ gx: best.x, gy: best.y }, W, H, RING), planMs = performance.now() - t0;
        if (!p || p.err) { res.push({ spot: k, cell: [best.x, best.y], err: p && p.err || 'no plan' }); continue; }
        /* THE TRUTH, another road: the map's own 8 x 8 tiles under the area, as it asks its painter for them */
        const TPB = p.tpb, tm = p.tile_m, B = p.block_m, AX0 = p.X0, AY0 = p.Y0;
        const bx0 = Math.floor(AX0 / TPB), bx1 = Math.floor((AX0 + p.AW - 1) / TPB), by0 = Math.floor(AY0 / TPB), by1 = Math.floor((AY0 + p.AH - 1) / TPB);
        const houses = [], trailers = [];
        for (let ty = Math.floor(by0 / VB_TILE); ty <= Math.floor(by1 / VB_TILE); ty++) for (let tx = Math.floor(bx0 / VB_TILE); tx <= Math.floor(bx1 / VB_TILE); tx++) {
          const inp = vbTileInput(tx, ty, 36), o = vbCityCore(inp), L = o.lots || [];
          for (let j = 0; j + 9 < L.length; j += 10) {
            const gx = L[j + 1], gy = L[j + 2];
            if (gx < tx * VB_TILE || gy < ty * VB_TILE || gx >= (tx + 1) * VB_TILE || gy >= (ty + 1) * VB_TILE) continue;   /* a margin block is its neighbour tile's */
            const X = (gx + L[j + 3] + L[j + 5] / 2) * B, Y = (gy + L[j + 4] + L[j + 6] / 2) * B, ax = Math.floor(X / tm) - AX0, ay = Math.floor(Y / tm) - AY0;
            if (ax < 0 || ay < 0 || ax >= p.AW || ay >= p.AH) continue;
            const key = BohemiaMapHouses.pick(L[j], L[j + 7], L[j + 8], L[j + 9]);
            (L[j] === 1 ? trailers : houses).push({ ax, ay, model: key.slice(0, key.lastIndexOf('_')) });
          }
        }
        const cls = (x, y) => x < 0 || y < 0 || x >= N || y >= N ? -1 : vbClassOf(D(x, y));
        const street = new Array(p.AW * p.AH).fill(-1);
        for (let ay = 0; ay < p.AH; ay++) for (let ax = 0; ax < p.AW; ax++) {
          const bx = Math.floor((AX0 + ax) / TPB), by = Math.floor((AY0 + ay) / TPB), c = cls(bx, by); if (c < 0) continue;
          const th = c === 1 || c === 2 || c === 3 ? 0 : vbThruOf(cls, bx, by);
          /* __A_STREET_IN_FRONT_OF_EVERY_HOUSE__ (WORLD THIRTEEN 11/7, rule 426(a)): a house block's own street, read off the
             generator's byte (houseLanes), never off the painter: its middle row (an east-west street) or column, and a T's lot */
          let ln = 0; try { const LV = window.vbLanesValley && vbLanesValley(); ln = LV && c === 4 && !th ? LV[by * N + bx] : 0; } catch (e) { ln = 0; }
          const ix = (AX0 + ax) - bx * TPB, iy = (AY0 + ay) - by * TPB, mid = TPB >> 1;
          const lane = !!(ln & 3) && ((ln & 3) === 1 ? (iy === mid || (ix === mid && ((iy === 0 && (ln & 16)) || (iy === TPB - 1 && (ln & 64)))))
                                                     : (ix === mid || (iy === mid && ((ix === 0 && (ln & 128)) || (ix === TPB - 1 && (ln & 32))))));
          street[ay * p.AW + ax] = (c === 1 || c === 2 || c === 3 || th || lane) ? 1 : 0;
        }
        let pic = null;
        if (shots) {   /* the map's own block read top down: every texel the painter paints there (its kind and part), 4 a tile, in a plain key */
          const kT = VB_TILE, kM = VB_TILE_M, cx = Math.round((bx0 + bx1) / 2), cy = Math.round((by0 + by1) / 2), M = Math.max(cx - bx0, bx1 - cx, cy - by0, by1 - cy) + 2;
          let inp; try { VB_TILE = 1; VB_TILE_M = M; inp = vbTileInput(cx, cy, 12); } finally { VB_TILE = kT; VB_TILE_M = kM; }
          inp.coli = true; inp.flat = false; const o = vbCityCore(inp), QT = 12 / TPB, c = document.createElement('canvas'); c.width = p.AW * QT; c.height = p.AH * QT;
          const g = c.getContext('2d'), im = g.createImageData(c.width, c.height);
          const COL = (cl, pt, h, burn) => { if (burn && h > 0.5) return [52, 46, 42];
            if (cl === 1 || cl === 3 || cl === 2) return pt === 3 || pt === 14 || pt === 13 ? [168, 160, 146] : pt === 15 ? [196, 160, 60] : pt === 5 ? [210, 206, 196] : h > 0.1 ? [120, 40, 36] : [58, 56, 54];
            if (cl === 4) return h > 0.5 ? [196, 178, 150] : [140, 122, 98];
            if (cl === 5 || cl === 16) return h > 0.9 ? [150, 150, 156] : pt === 5 || pt === 6 ? [96, 96, 96] : [128, 116, 98];
            if (cl === 6 || cl === 7) return h > 2.5 ? [90, 96, 110] : [170, 168, 160];
            if (cl === 9) return [60, 80, 100]; if (cl === 8) return pt === 10 ? [70, 84, 60] : [120, 116, 92]; return [146, 128, 104]; };
          for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
            const u = (AX0 - inp.org[0] * TPB) * QT + x, v = (AY0 - inp.org[1] * TPB) * QT + y, cv = o.coli[v * o.P + u], rgb = COL((cv >> 4) & 31, cv & 15, o.hs[v * o.P + u], (cv >> 9) & 1), k2 = (y * c.width + x) * 4;
            im.data[k2] = rgb[0]; im.data[k2 + 1] = rgb[1]; im.data[k2 + 2] = rgb[2]; im.data[k2 + 3] = 255; }
          g.putImageData(im, 0, 0);
          houses.forEach(h => { g.fillStyle = '#e8d4a0'; g.fillRect(h.ax * QT + 1, h.ay * QT + 1, QT - 2, QT - 2); g.fillStyle = '#5a3020'; g.fillRect(h.ax * QT + 1.5, h.ay * QT + 1.5, QT - 3, 1); });
          pic = c.toDataURL('image/png');
        }
        res.push({ spot: k, cell: [best.x, best.y], district: p.district, plan: p, planMs: Math.round(planMs), truth: { houses, trailers, street }, pic });
      }
      return { seed: om.seed, res };
    }, { seed, boot, W, H, RING, spots: Object.fromEntries(Object.entries(SPOTS).map(([k, v]) => [k, v.source])), shots: !!SHOTS });
    out.push(r);
  }
  /* W1: the fight asks the map itself, through the demo's own door (the shell's nfOpen, a suburb block on the boot valley) */
  let door = null;
  try {
    await fr.evaluate((boot) => { if (om.seed !== boot) { om = CBinstall(OM.buildOvermap(boot)); try { POWER = buildPower(om, boot); } catch (e) {} } }, boot);
    const cell = out[0].res.filter(x => x.spot === 'suburb')[0].cell;
    await d.page.evaluate(c => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: 'suburb', at: { gx: c[0], gy: c[1] }, label: 'gate', draft: true }); }, cell);
    for (let i = 0; i < 160 && !door; i++) {
      await d.page.waitForTimeout(500);
      door = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, F = w && w.eval('FIGHT'); const B = F && F.S && F.S.boardDef;
        return B && F.S.board ? { laid: !!B.laid, template: !!(B.laid && B.laid.template), cell: B.street && B.street.cell, district: B.street && B.street.district, ms: F.S.streetMs, err: F.S.streetErr || null, houses: B.laid ? B.laid.houses : 0 } : null; } catch (e) { return null; } });
    }
    door = Object.assign({ asked: cell }, door || {});
  } catch (e) { door = { err: String(e && e.message || e) }; }
  await d.close();
  return { boot, valleys: out, door };
}

/* ---------------- TWO: the fight ---------------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
async function openFight() {
  const { chromium } = require('playwright');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e)));
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board) && !!eval('DB').streetKit; } catch (e) { return false; } }, null, { timeout: 120000 });
  return { p, errs, close: async () => { await br.close(); srv.close(); } };
}
function deal(page, o) {
  return page.evaluate(o => { const F = eval('FIGHT'); eval('SEED = ' + (o.seed >>> 0)); F.setup(o); const B = F.S.boardDef, L = B.laid;
    const houses = L ? L.sprites.filter(q => q.kind === 'house').map(q => ({ ax: q.tiles[0], ay: q.tiles[1], model: q.name })) : [];
    const trailers = (B.cover || []).filter(c => c.piece === 'trailer').map(c => ({ x: Math.floor(c.x_m / 12), y: Math.floor(c.y_m / 12) }));
    /* RICHNESS (rule 419): what the board carries, counted the same way on a laid board and a template board, over the whole board */
    const S = F.S, tm = 12, inB = c => c.x_m >= 0 && c.y_m >= 0 && c.x_m < S.w * tm && c.y_m < S.h * tm;
    const pcs = (B.cover || []).filter(inB).map(c => c.piece), fire = {}; (S.fire || []).forEach(f => { fire[f.y * S.w + f.x] = 1; });
    let cover = 0, block = 0, roof = 0, eff = 0;
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const r = F.rowAt(x, y);
      if (S.coverCount[y][x] > 0) cover++; if (!F._t.passable(x, y)) block++; if (r === 'height') roof++;
      if (r === 'rough' || r === 'swamp' || (fire[y * S.w + x] && r === 'flat')) eff++; }
    const rich = { props: pcs.length, cover, blockers: block, roofs: roof, effects: eff, distinct: new Set(pcs).size, lights: (B.lights || []).length,
      start: B.start || 'line', lifted: L && L.dressed ? L.dressed.lifted : 0, kit: L && L.dressed ? L.dressed.kit : 0 };
    return { laid: !!L && !L.template, tmpl: !!(L && L.template), name: B.name, ring: L ? L.ring : 0, AW: L ? L.AW : 0, kinds: L ? L.tiles : null, houses, trailers, terrain: F.S.terrain,
      blocks: B.blocks, w: F.S.w, h: F.S.h, shift: B.street ? B.street.shift : null, rich }; }, o);
}
function compare(spot, tr, b, p) {
  const R = RING, inW = (ax, ay) => ax >= R && ay >= R && ax < R + W && ay < R + H, key = h => h.ax + ',' + h.ay;
  const mapH = tr.houses.filter(h => inW(h.ax, h.ay)), boardH = (b.houses || []).filter(h => inW(h.ax, h.ay));
  const bm = {}; boardH.forEach(h => { bm[key(h)] = h.model; });
  const mm = {}; mapH.forEach(h => { mm[key(h)] = h.model; });
  const h1 = mapH.filter(h => bm[key(h)] === h.model).length, h2 = boardH.filter(h => mm[key(h)] === h.model).length;
  const ringMap = tr.houses.filter(h => !inW(h.ax, h.ay)), ringBoard = {}; (b.houses || []).forEach(h => { if (!inW(h.ax, h.ay)) ringBoard[key(h)] = h.model; });
  const r1 = ringMap.filter(h => ringBoard[key(h)] === h.model).length;
  const trT = {}; tr.trailers.filter(h => inW(h.ax, h.ay)).forEach(h => { trT[(h.ax - R) + ',' + (h.ay - R)] = 1; });
  const bT = {}; (b.trailers || []).forEach(t => { bT[t.x + ',' + t.y] = 1; });
  const t1 = Object.keys(trT).filter(k => bT[k]).length;
  let s1n = 0, s1 = 0, s2n = 0, s2 = 0, b1n = 0, b1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ms = tr.street[(y + R) * p.AW + x + R]; if (ms < 0) continue;
    const bs = b.kinds ? STREET_KINDS.indexOf(b.kinds[y][x]) >= 0 : false;
    if (ms === 1) { s1n++; if (bs) s1++; }
    if (bs) { s2n++; if (ms === 1) s2++; }
  }
  boardH.forEach(h => { b1n++; const t = b.terrain[h.ay - R] && b.terrain[h.ay - R][h.ax - R]; if (t === 'blocked' || /^height/.test(t)) b1++; });
  return { mapH: mapH.length, boardH: boardH.length, h1, h2, ring: ringMap.length, r1, trailers: Object.keys(trT).length, t1, s1n, s1, s2n, s2, b1n, b1,
    H1: h1 === mapH.length, H2: h2 === boardH.length, T1: t1 === Object.keys(trT).length, S1: s1n === 0 || s1 / s1n >= 0.97, S2: s2n === 0 || s2 / s2n >= 0.97, R1: r1 === ringMap.length, B1: b1 === b1n };
}

(async () => {
  const t0 = Date.now();
  const M = await readTheMap();
  console.log('the map read in', Math.round((Date.now() - t0) / 1000), 's; valleys', M.valleys.map(v => v.seed).join(', '));
  if (PLANS) fs.writeFileSync(PLANS, JSON.stringify(M.valleys[0].res.filter(r => r.plan).map(r => ({ spot: r.spot, cell: r.cell, district: r.district, plan: r.plan }))));   /* the boot valley's plans, for a bench */
  check(M.valleys.length === 3 && new Set(M.valleys.map(v => v.seed)).size === 3, 'SEEDS', 'three valleys: ' + M.valleys.map(v => v.seed).join(', '));
  const F = await openFight();
  const report = { boot: M.boot, door: M.door, spots: [] };
  let played = {};
  for (const v of M.valleys) for (const s of v.res) {
    const tag = 'seed ' + v.seed + ' ' + s.spot;
    if (s.none) { check(false, 'SPOT', tag + ': no block of that district on this valley'); continue; }
    if (s.err) { check(false, 'PLAN', tag + ' ' + JSON.stringify(s.cell) + ': ' + s.err); continue; }
    const o = { seed: 11, kind: 'suburb', district: s.district, cell: { gx: s.cell[0], gy: s.cell[1] }, street: s.plan, night: false, auto: true, formation: null };
    const b = await deal(F.p, o);
    check(b.laid, 'LAID', tag + ' ' + JSON.stringify(s.cell) + ' ' + s.district + ': the board is laid from the map (' + b.name + ')');
    const c = compare(s.spot, s.truth, b, s.plan);
    check(c.H1, 'H1', tag + ': map houses on the board, same tile, same model ' + c.h1 + '/' + c.mapH);
    check(c.H2, 'H2', tag + ': board houses that are map houses ' + c.h2 + '/' + c.boardH);
    check(c.T1, 'T1', tag + ': trailer tiles ' + c.t1 + '/' + c.trailers);
    check(c.S1, 'S1', tag + ': map street tiles that are board streets ' + c.s1 + '/' + c.s1n);
    check(c.S2, 'S2', tag + ': board street tiles on map streets ' + c.s2 + '/' + c.s2n);
    check(c.R1, 'R1', tag + ': the ring holds the map\'s houses ' + c.r1 + '/' + c.ring);
    check(c.B1, 'B1', tag + ': a house blocks or is a roof ' + c.b1 + '/' + c.b1n);
    /* K1 THE BOARDS GOT POORER (rule 419, ask line 479): the template board the same spot dealt before 11/6h (opts.street false,
       the same seed and cell) against the laid board, every count; the laid board is never poorer */
    const bt = await deal(F.p, Object.assign({}, o, { street: false, houses: false })), RICH = ['props', 'cover', 'blockers', 'roofs', 'effects', 'distinct'];
    const poorer = RICH.filter(k => b.rich[k] < bt.rich[k]);
    check(!bt.laid && poorer.length === 0, 'K1', tag + ': as rich as its old template (' + bt.name + ') ' + RICH.map(k => k + ' ' + bt.rich[k] + '->' + b.rich[k]).join(', ') +
      (poorer.length ? '; POORER: ' + poorer.join(', ') : '') + '; lifted ' + b.rich.lifted + ', kit ' + b.rich.kit + ', start ' + bt.rich.start + '->' + b.rich.start);
    report.spots.push({ seed: v.seed, spot: s.spot, cell: s.cell, district: s.district, planMs: s.planMs, shift: b.shift, cmp: c, rich: { template: bt.rich, laid: b.rich, templateName: bt.name } });
    /* THREE: the mutations, on the boot valley */
    if (v.seed === M.boot) {
      const m1 = JSON.parse(JSON.stringify(s.plan)); m1.X0 += 1;   /* the whole read moved a tile: the lay is the plan's, the truth is the map's */
      const sh = (a, AW) => { const o2 = a.slice(); for (let i = 0; i < o2.length; i++) { const x = i % AW; o2[i] = x + 1 < AW ? a[i + 1] : a[i]; } return o2; };
      ['kind', 'walk', 'axis', 'car', 'lamp', 'burn', 'lift', 'cls', 'blk'].forEach(k => { m1[k] = sh(m1[k], m1.AW); });
      m1.houses = m1.houses.map(h => Object.assign({}, h, { x: h.x - 1, mx: h.mx - 12 })).filter(h => h.x >= 0);
      const bm1 = await deal(F.p, Object.assign({}, o, { street: m1 })), c1 = compare(s.spot, s.truth, bm1, s.plan);
      check(!(c1.H1 && c1.H2 && c1.S1 && c1.S2), 'M1', tag + ': the plan moved a tile east is caught (H1 ' + c1.h1 + '/' + c1.mapH + ', S1 ' + c1.s1 + '/' + c1.s1n + ')');
      if (s.plan.houses.length) {
        const m2 = JSON.parse(JSON.stringify(s.plan)), hi = m2.houses.findIndex(h => h.x >= RING && h.y >= RING && h.x < RING + W && h.y < RING + H);
        if (hi >= 0) { m2.houses[hi].model = m2.houses[hi].model === 'ranch_plain' ? 'ranch_garage' : 'ranch_plain';
          const c2 = compare(s.spot, s.truth, await deal(F.p, Object.assign({}, o, { street: m2 })), s.plan);
          check(!c2.H1, 'M2', tag + ': one house\'s model swapped is caught (H1 ' + c2.h1 + '/' + c2.mapH + ')'); }
      }
      const b4 = await deal(F.p, Object.assign({}, o, { dress: false })), poor4 = ['props', 'cover', 'blockers', 'roofs', 'effects', 'distinct'].filter(k => b4.rich[k] < bt.rich[k]);
      check(b4.laid && poor4.length > 0, 'M4', tag + ': the bare laid board (11/6h, undressed) is caught by K1 (poorer on ' + (poor4.join(', ') || 'nothing') + ')');
      const b3 = await deal(F.p, Object.assign({}, o, { street: false, houses: false })), c3 = compare(s.spot, s.truth, b3, s.plan);
      check(!b3.laid && !(c3.H1 && c3.S1 && c3.S2), 'M3', tag + ': the old template deal at the same spot is caught (' + b3.name + '; H1 ' + c3.h1 + '/' + c3.mapH + ', S1 ' + c3.s1 + '/' + c3.s1n + ')');
    }
    /* P1: the fight plays on a laid board, once a district */
    if (!played[s.spot]) {
      played[s.spot] = true;
      const before = F.errs.length;
      await F.p.evaluate(o => { window.FIGHT_OPTS = Object.assign({}, o, { speed: 4, auto: true }); start(); }, o);
      await F.p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 90000 }).catch(() => {});
      const ok = await F.p.waitForFunction(() => { const S = eval('FIGHT').S; return S.round >= 2 || S.over; }, null, { timeout: 120000, polling: 250 }).then(() => true).catch(() => false);
      const st = await F.p.evaluate(() => { const S = eval('FIGHT').S; return { round: S.round, over: S.over, laid: !!S.boardDef.laid, units: S.units.length }; });
      check(ok && st.laid && F.errs.length === before, 'P1', tag + ': the fight plays on the laid board (round ' + st.round + (st.over ? ', over' : '') + ', ' + st.units + ' men, page errors ' + (F.errs.length - before) + ')');
      if (SHOTS) {
        fs.mkdirSync(SHOTS, { recursive: true });
        const board = await F.p.evaluate(() => { const U = eval('UI'); return U.board ? U.board.toDataURL('image/png') : null; });
        if (board) fs.writeFileSync(path.join(SHOTS, s.spot + '_board.png'), Buffer.from(board.split(',')[1], 'base64'));
        if (s.pic) fs.writeFileSync(path.join(SHOTS, s.spot + '_map.png'), Buffer.from(s.pic.split(',')[1], 'base64'));
        await F.p.screenshot({ path: path.join(SHOTS, s.spot + '_play.png') });
      }
    }
  }
  const dr = M.door || {};
  /* W1 RE-AIMED (the law moved: rule 423(a), Paolo 11/7, 'I prefer the previous layouts... use the layout of before and just swap the
     house assets'): the demo's own door deals the TEMPLATE layout at that cell with the new houses in it, no longer the map's block */
  check(!!dr.laid && !!dr.template && dr.cell && dr.asked && dr.cell[0] === dr.asked[0] && dr.cell[1] === dr.asked[1], 'W1', 'the demo\'s own door (rule 423(a)): a fight at ' + JSON.stringify(dr.asked) + ' deals the template layout with the new houses, template ' + !!dr.template + ', cell ' + JSON.stringify(dr.cell) + ', ' + (dr.houses || 0) + ' houses' + (dr.err ? ', ' + dr.err : ''));
  await F.close();
  console.log('\nTHE BOARD IS THE CITY AT THAT SPOT: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(Object.assign(report, { pass, fail, lines }), null, 1));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
