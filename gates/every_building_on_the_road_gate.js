#!/usr/bin/env node
/* EVERY BUILDING ON THE ROAD (COMBAT TWO 11/8/26, VAMILY rule 429(h), ask lines 504 and 505; Paolo 11/7: 'my biggest problem with the
   combat maps, the old and the new, you still cannot recognize: every building needs to have a road on it, the road can be big, the
   road can be small, sometimes roads four tiles wide and that's OK, but a building needs to be part of whatever road network you
   want there to be').
   MEASURED BEFORE (the same boards, the darkness reader the fight had): 1,516 of 3,640 buildings had no road beside them (the lab and
   the rail yard read no road at all, the airport's hangars stood on concrete the fight called no road, a suburb's top row of houses
   faced a yard), and 180 of 360 boards had their roads in pieces (the suburb's three streets never met, the Strip's boulevard cut by
   every dead car on it, downtown's in eleven).
   THE LEGS (the live fight's own deal, headless: the 15 place boards x 20 seeds and every other district of the map x 6, the freeway's
   own boards aside, rule 432 is FREEWAY's; the graveyard's own deal counted apart: its crypts are pieces on its path, no building; and a fight inside a casino, the casino floor, rule 416):
     R1  every building fronts a road: every house, and every lump of a built kind's walls and roofs (two tiles or with a roof), has a
         road tile beside it                                                     planted: a house's road taken away, red
     R2  ONE NETWORK: every piece of road on a board with buildings is joined to the rest, unless no walk of open ground could join
         it (a wall edge to edge between: the Strip's casinos, Fremont's canopy), and then it runs off the board into the city (or
         ends at a casino's floor, the building it serves: the casino districts deal street blocks between casino floors); on a
         board with no building, no piece that reaches no edge                   planted: a stub of road in open ground, red
     R3  THE PAINT IS REAL: every joined tile shows the street kit's own road, flat, a street, never on a casino's floor; every other road tile is the board's
         own (asphalt in its picture on a kind that has asphalt, the paved apron or yard, or the lane between two road tiles, or a wreck across one)
                                                                                 planted: a painted tile that shows a yard, red
     R4  FIXED THERE AND ONLY THERE: against the same boards with the join off, nothing changed but the tiles it painted (the
         ground, the terrain, the cover), and no board lost its join between the two lines (the deal's own connected())
     R5  ROADS COME IN SIZES: a road one tile wide (a drive, a suburb's street), two, three (the Strip's boulevard, Fremont's) and
         four or more (the airport's apron, the lab's yard) all on the boards
     R6  enough: at least 600 boards over at least 60 districts, every place at 20 seeds, and every board laid (the graveyard's aside)
   Run: node gates/every_building_on_the_road_gate.js [--json out.json]     (about half a minute) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/street_board', f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_street_board.js'), 'utf8'), ctx);
try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_fight_kinds.js'), 'utf8'), ctx); } catch (e) {}
/* the casino floor as the live page loads it (rule 416): a fight at a casino with an inside is fought on its floor */
try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_casino_floor.js'), 'utf8'), ctx);
  const cd = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/casino/casino_floor.json'), 'utf8')), cz = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/casino/sizes.json'), 'utf8')), ck = {};
  Object.keys(cd.kit).forEach(k => { const z = cz[k.replace(/^casino_/, '')]; ck[k] = Object.assign({}, cd.kit[k], z ? { src: z.src } : {}); }); ctx.DB.casino = { data: cd, sizes: cz, kit: ck }; } catch (e) {}
ctx.DB.streetKit = J('street_board.json'); ctx.DB.streetDress = J('dressing.json'); ctx.DB.streetStoreys = J('storeys.json');
/* THE STREETS JOIN (rule 442(d)): the street pieces as the live page loads them; a painted tile shows one of them, or, a curb cut, its own sidewalk */
try { ctx.DB.streetJoins = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/kit_street/joins/joins.json'), 'utf8')); } catch (e) {}
const F = ctx.FIGHT, P = ctx.DB.ours.place_boards.value.places, RNrow = ctx.DB.ours.road_network, RN = RNrow.value, LIFT = ctx.DB.streetDress.lift;
const BUILT = {}, PAVED = {}, ASPH = {}; RN.built.forEach(k => BUILT[k] = 1); RN.paved.forEach(k => PAVED[k] = 1); (RN.asphalt || []).forEach(k => ASPH[k] = 1);
const KIT = {}; Object.keys(ctx.DB.streetKit.streets.pieces).forEach(k => { KIT[ctx.DB.streetKit.streets.dir + ctx.DB.streetKit.streets.pieces[k].src] = k; });
if (ctx.DB.streetJoins) Object.keys(ctx.DB.streetJoins.pieces).forEach(k => { KIT[ctx.DB.streetJoins.dir + ctx.DB.streetJoins.pieces[k].src] = k; });
const PAINT = {}, NOP = {}; (RN.paint_on || ['flat', 'rough', 'debris']).forEach(t => PAINT[t] = 1); (RN.no_paint || []).forEach(k => NOP[k] = 1);
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], isH = t => /^height/.test(t);
/* the boards: every place at 20 seeds, every other district at 4 (the freeway's own boards aside) */
const DEALS = [];
Object.keys(P).forEach(pid => { for (let i = 0; i < 20; i++) DEALS.push({ tag: pid, d: P[pid].districts[i % P[pid].districts.length], i }); });
const inPlace = {}; Object.keys(P).forEach(pid => P[pid].districts.forEach(d => inPlace[d] = pid));
ctx.DB.boardKinds.districts.forEach(r => { if (r.boardKind === 'freeway' || inPlace[r.district]) return; for (let i = 0; i < 6; i++) DEALS.push({ tag: r.district, d: r.district, i }); });
const deal = (q, on) => { RN.on = on !== false; ctx.setSeed(900 + q.i);
  F.setup({ kind: 'suburb', district: q.d, cell: { gx: (q.i * 37 + 11) % 90, gy: (q.i * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false });
  RN.on = true; return F.S; };
/* the gate's own reading of one dealt board: road, buildings, pieces (from the board as the fight holds it) */
function read(S, L) {
  const W = S.w, H = S.h, road = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L.road[y * W + x] > 0;
  const kindAt = (x, y) => { const n = F.blockNameAt(x, y); return n ? String(n).split('|')[0].split('.')[0] : null; };
  const nameAt = (x, y) => F.blockNameAt(x, y);
  const house = (x, y) => L.tiles[y][x] === 'house';
  const bAt = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H || road(x, y)) return false; if (house(x, y)) return true; return !!BUILT[kindAt(x, y)] && (S.terrain[y][x] === 'blocked' || isH(S.terrain[y][x])); };
  const seen = new Uint8Array(W * H), blds = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (seen[y * W + x] || !bAt(x, y)) continue;
    if (house(x, y)) { seen[y * W + x] = 1; blds.push([[x, y]]); continue; }
    const c = [], q = [[x, y]]; seen[y * W + x] = 1;
    while (q.length) { const p = q.pop(); c.push(p); D4.forEach(d => { const u = p[0] + d[0], v = p[1] + d[1]; if (bAt(u, v) && !house(u, v) && !seen[v * W + u]) { seen[v * W + u] = 1; q.push([u, v]); } }); }
    if (c.length >= 2 || c.some(p => isH(S.terrain[p[1]][p[0]]))) blds.push(c); }
  const id = new Int32Array(W * H).fill(-1), pcs = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!road(x, y) || id[y * W + x] >= 0) continue; const c = [], q = [[x, y]]; id[y * W + x] = pcs.length;
    while (q.length) { const p = q.pop(); c.push(p); D4.forEach(d => { const u = p[0] + d[0], v = p[1] + d[1]; if (road(u, v) && id[v * W + u] < 0) { id[v * W + u] = pcs.length; q.push([u, v]); } }); } pcs.push(c); }
  /* open ground a road could be laid on (what the join may pave): the gate's own, from the board */
  const open = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !house(x, y) && !isH(S.terrain[y][x]) && !!PAINT[S.terrain[y][x]] && !!nameAt(x, y) && !NOP[kindAt(x, y)];
  const edge = c => c.some(([x, y]) => x === 0 || y === 0 || x === W - 1 || y === H - 1);
  const intoFloor = c => c.some(([x, y]) => D4.some(d => { const u = x + d[0], v = y + d[1]; return u >= 0 && v >= 0 && u < W && v < H && !!NOP[kindAt(u, v)]; }));
  /* can piece a reach piece b over open ground? */
  const reach = (a, b) => { const mark = new Uint8Array(W * H), q = []; pcs[a].forEach(([x, y]) => { mark[y * W + x] = 1; q.push([x, y]); });
    while (q.length) { const [x, y] = q.shift(); for (const d of D4) { const u = x + d[0], v = y + d[1]; if (u < 0 || v < 0 || u >= W || v >= H || mark[v * W + u]) continue;
      if (road(u, v)) { if (id[v * W + u] === b) return true; if (id[v * W + u] !== a) continue; }
      else if (!open(u, v)) continue; mark[v * W + u] = 1; q.push([u, v]); } } return false; };
  const out = { blds: blds.length, off: [], stubs: [], joinable: [], fake: [], widths: {}, floor: 0 };
  blds.forEach(c => { if (!c.some(p => D4.some(d => road(p[0] + d[0], p[1] + d[1])))) out.off.push(kindAt(c[0][0], c[0][1]) + '@' + c[0].join(',')); });
  if (pcs.length > 1) { const big = pcs.reduce((m, c, i) => c.length > pcs[m].length ? i : m, 0);
    pcs.forEach((c, i) => { if (i === big) return;
      const goes = edge(c) || intoFloor(c); if (!edge(c) && intoFloor(c)) out.floor++;
      if (blds.length) { if (reach(i, big) || pcs.some((c2, j) => j !== i && reach(i, j))) out.joinable.push('piece@' + c[0].join(',') + ' n' + c.length); else if (!goes) out.stubs.push('piece@' + c[0].join(',')); }
      else if (!goes) { if (pcs.some((c2, j) => j !== i && reach(i, j))) out.joinable.push('piece@' + c[0].join(',')); else out.stubs.push('piece@' + c[0].join(',')); } }); }
  /* R3: every road tile is what it says */
  const DK = RN.asphalt_dark || 30, AWr = L.AW, R = L.ring;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const r = L.road[y * W + x]; if (!r) continue;
    const g = L.ground[(y + R) * AWr + x + R] || '';
    const cutHere = L.streets && (L.streets.cutAt || []).some(c => c[0] === x && c[1] === y) && g.indexOf('#') > 0;   /* a curb cut: its own sidewalk */
    if (r === 3) { if (!(KIT[g] || cutHere) || S.terrain[y][x] !== 'flat' || L.tiles[y][x] !== 'street' || NOP[kindAt(x, y)]) out.fake.push('painted@' + x + ',' + y + ' ' + g + ' ' + kindAt(x, y)); continue; }
    if (KIT[g]) { out.fake.push('unsaid@' + x + ',' + y); continue; }
    if (r === 2) { if (!PAVED[kindAt(x, y)]) out.fake.push('paved@' + x + ',' + y + ' ' + kindAt(x, y)); continue; }
    const i = g.indexOf('#'), base = String(nameAt(x, y)).split('|')[0], info = LIFT[base];
    const t = g.slice(i + 1).replace(/[hv]/g, '').split(','), dk = info && i > 0 ? info.dark[(+t[1]) * 5 + (+t[0])] : 0;
    const between = (road(x - 1, y) || S.terrain[y][x - 1] === 'blocked') && (road(x + 1, y) || (S.terrain[y][x + 1] === 'blocked')) || (road(x, y - 1) || (S.terrain[y - 1] && S.terrain[y - 1][x] === 'blocked')) && (road(x, y + 1) || (S.terrain[y + 1] && S.terrain[y + 1][x] === 'blocked'));
    if (!(dk >= DK && ASPH[kindAt(x, y)]) && !between) out.fake.push('asphalt@' + x + ',' + y + ' ' + kindAt(x, y) + ' dark ' + dk); }
  /* R5: how wide a road is: the biggest square of road a tile stands in (a crossing of two one-tile streets is one tile wide) */
  const dp = new Int32Array(W * H), wd = new Int32Array(W * H), rd = (x, y) => road(x, y) && S.terrain[y][x] !== 'blocked';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rd(x, y)) dp[y * W + x] = 1 + (x && y ? Math.min(dp[y * W + x - 1], dp[(y - 1) * W + x], dp[(y - 1) * W + x - 1]) : 0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = dp[y * W + x]; for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) { const i = (y - b) * W + x - a; if (wd[i] < k) wd[i] = k; } }
  for (let i = 0; i < W * H; i++) if (wd[i]) out.widths[Math.min(4, wd[i])] = 1;
  return out;
}
(async () => {
  const t0 = Date.now(), tot = { floor: 0, boards: 0, laid: 0, blds: 0, off: [], stubs: [], joinable: [], fake: [], widths: {}, byTag: {}, painted: 0, drives: 0, joins: 0, edgeRoads: 0 };
  let sample = null;
  DEALS.forEach(q => { const S = deal(q), L = S.boardDef.laid; tot.boards++; if (S.boardDef.family === 'graveyard') { tot.graveyard = (tot.graveyard || 0) + 1; return; }
    if (S.boardDef.interior) { tot.interior = (tot.interior || 0) + 1; return; }   /* an inside (the casino floor, rule 416): no road runs on a casino's floor */
    const bt = tot.byTag[q.tag] = tot.byTag[q.tag] || { boards: 0, blds: 0, widths: {} }; bt.boards++;
    if (!L || !L.road) return; tot.laid++;
    const r = read(S, L); tot.blds += r.blds; tot.floor += r.floor; bt.blds += r.blds; Object.keys(r.widths).forEach(w => { tot.widths[w] = (tot.widths[w] || 0) + 1; bt.widths[w] = 1; });
    r.off.forEach(s => tot.off.push(q.tag + ' s' + q.i + ' ' + s)); r.stubs.forEach(s => tot.stubs.push(q.tag + ' s' + q.i + ' ' + s));
    r.joinable.forEach(s => tot.joinable.push(q.tag + ' s' + q.i + ' ' + s)); r.fake.forEach(s => tot.fake.push(q.tag + ' s' + q.i + ' ' + s));
    tot.painted += L.roads.painted; tot.drives += L.roads.drives; tot.joins += L.roads.joins; tot.edgeRoads += L.roads.edge || 0;
    if (!sample && q.tag === 'suburb' && L.roads.drives > 0) sample = q; });
  check(tot.off.length === 0 && tot.blds > 3000, 'R1', 'every building fronts a road: ' + (tot.blds - tot.off.length) + ' of ' + tot.blds + ' buildings over ' + tot.laid + ' boards (' + tot.drives + ' drives laid, ' + tot.edgeRoads + ' roads in from the edge)' + (tot.off.length ? ': ' + tot.off.slice(0, 4).join('; ') : ''));
  /* planted R1: a house's road taken away */
  { const S = deal(sample), L = S.boardDef.laid, W = S.w; let at = null;
    for (let y = 0; y < S.h && !at; y++) for (let x = 0; x < W; x++) if (L.tiles[y][x] === 'house') { at = [x, y]; break; }
    const keep = L.road.slice(); if (at) D4.forEach(d => { const u = at[0] + d[0], v = at[1] + d[1]; if (u >= 0 && v >= 0 && u < W && v < S.h) L.road[v * W + u] = 0; });
    const r = read(S, L); L.road.set(keep);
    check(r.off.length > 0, 'R1p', 'planted: the road beside the house at ' + (at ? at.join(',') : '?') + ' taken away is caught (' + r.off.slice(0, 1).join('') + ')'); }
  check(tot.stubs.length === 0 && tot.joinable.length === 0, 'R2', 'ONE NETWORK: ' + tot.joins + ' joins laid; ' + tot.joinable.length + ' pieces a walk of open ground could still join, ' + tot.stubs.length + ' stubs that reach no edge' + (tot.joinable.length + tot.stubs.length ? ': ' + tot.joinable.concat(tot.stubs).slice(0, 4).join('; ') : ' (a piece apart is walled off edge to edge and runs off the board; ' + tot.floor + ' end at a casino\'s floor, the casino districts\' street blocks between casino floors: the casino floor job, named)'));
  /* planted R2: a stub of road in open ground, apart from the rest */
  { const S = deal(sample), L = S.boardDef.laid, W = S.w; let at = null;
    for (let y = 1; y < S.h - 1 && !at; y++) for (let x = 1; x < W - 2; x++) { const ok = [0, 1].every(k => !L.road[y * W + x + k] && S.terrain[y][x + k] === 'flat' && L.tiles[y][x + k] !== 'house' && D4.every(d => !L.road[(y + d[1]) * W + x + k + d[0]] || (d[0] === 1 && !k) || (d[0] === -1 && k)));
      if (ok) { at = [x, y]; break; } }
    const keep = L.road.slice(); if (at) { L.road[at[1] * W + at[0]] = 1; L.road[at[1] * W + at[0] + 1] = 1; }
    const r = read(S, L); L.road.set(keep);
    check(r.joinable.length + r.stubs.length > 0, 'R2p', 'planted: a stub of road at ' + (at ? at.join(',') : '?') + ' split from the rest is caught (' + r.joinable.concat(r.stubs).slice(0, 1).join('') + ')'); }
  check(tot.fake.length === 0, 'R3', 'THE PAINT IS REAL: ' + tot.painted + ' tiles painted, every one the street kit\'s own road, flat, a street; every other road tile asphalt in its own picture, the paved kind or a lane between two' + (tot.fake.length ? ': ' + tot.fake.slice(0, 4).join('; ') : ''));
  /* planted R3: a painted tile that shows a yard */
  { const S = deal(sample), L = S.boardDef.laid, W = S.w; let at = -1; for (let i = 0; i < L.road.length; i++) if (L.road[i] === 3) { at = i; break; }
    const gi = at >= 0 ? (Math.floor(at / W) + L.ring) * L.AW + (at % W) + L.ring : -1, keep = gi >= 0 ? L.ground[gi] : null;
    if (gi >= 0) L.ground[gi] = L.ground[gi - 1] && !KIT[L.ground[gi - 1]] ? L.ground[gi - 1] : 'block_yards_2.webp#0,0';
    const r = read(S, L); if (gi >= 0) L.ground[gi] = keep;
    check(r.fake.length > 0, 'R3p', 'planted: a painted tile at ' + (at >= 0 ? (at % W) + ',' + Math.floor(at / W) : '?') + ' showing a yard is caught (' + r.fake.slice(0, 1).join('') + ')'); }
  /* R4: against the join off, only the painted tiles changed, and the deal still joins the two lines */
  { let boards = 0, changed = 0, painted = 0, stray = [], lost = 0;
    DEALS.filter((q, i) => i % 8 === 0).forEach(q => { const S1 = deal(q), L1 = S1.boardDef.laid; if (!L1 || !L1.road) return;
      const g1 = L1.ground.slice(), t1 = S1.terrain.map(r => r.slice()), road = L1.road.slice(), W = S1.w, R = L1.ring, AW = L1.AW, w1 = S1.w, h1 = S1.h, cov1 = {};
      (S1.boardDef.cover || []).forEach(c => { cov1[c.piece + '@' + c.x_m + ',' + c.y_m] = 1; });
      const S0 = deal(q, false), L0 = S0.boardDef.laid; boards++;
      if (!L0 || S0.w !== w1 || S0.h !== h1) return;
      for (let y = 0; y < h1; y++) for (let x = 0; x < w1; x++) { const gi = (y + R) * AW + x + R, diff = g1[gi] !== L0.ground[gi] || t1[y][x] !== S0.terrain[y][x];
        if (road[y * W + x] === 3) painted++; if (!diff) continue; changed++;
        if (road[y * W + x] !== 3) stray.push(q.tag + ' s' + q.i + ' @' + x + ',' + y + ' ' + t1[y][x] + '/' + S0.terrain[y][x]); }
      (S0.boardDef.cover || []).forEach(c => { if (cov1[c.piece + '@' + c.x_m + ',' + c.y_m]) return; const tx = Math.floor(c.x_m / 12), ty = Math.floor(c.y_m / 12);
        if (!(tx >= 0 && ty >= 0 && tx < w1 && ty < h1 && road[ty * W + tx] === 3)) stray.push(q.tag + ' s' + q.i + ' cover ' + c.piece + '@' + tx + ',' + ty); });
      if (S0.housesErr !== 'not joined' && S1.housesErr === 'not joined') lost++; });
    check(stray.length === 0 && lost === 0 && boards >= 60, 'R4', 'FIXED THERE AND ONLY THERE: ' + boards + ' boards against the join off: ' + changed + ' tiles changed, every one painted (' + painted + ' painted); ' + lost + ' boards lost their join between the lines' + (stray.length ? ': ' + stray.slice(0, 4).join('; ') : '')); }
  const ws = Object.keys(tot.widths).map(Number).sort();
  const wide = k => Object.keys(tot.byTag).filter(t => tot.byTag[t].widths[k]);
  check([1, 2, 3, 4].every(w => tot.widths[w]), 'R5', 'ROADS COME IN SIZES: widths on the boards ' + ws.map(w => (w === 4 ? '4+' : w) + ' tile' + (w > 1 ? 's' : '') + ' on ' + tot.widths[w] + ' boards').join(', ') + ' (3 wide: ' + wide(3).slice(0, 5).join(', ') + '; 4 and more: ' + wide(4).slice(0, 4).join(', ') + ')');
  const places = Object.keys(P).filter(p => tot.byTag[p] && tot.byTag[p].boards >= 20).length;
  check(tot.boards >= 600 && Object.keys(tot.byTag).length >= 60 && places === Object.keys(P).length && tot.laid === tot.boards - (tot.graveyard || 0) - (tot.interior || 0), 'R6', tot.boards + ' boards over ' + Object.keys(tot.byTag).length + ' districts and places, ' + places + ' places at 20 seeds, ' + tot.laid + ' laid with their roads read (' + (tot.graveyard || 0) + ' the graveyard\'s own deal, ' + (tot.interior || 0) + ' inside a casino)');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ boards: tot.boards, blds: tot.blds, painted: tot.painted, drives: tot.drives, joins: tot.joins, widths: tot.widths, off: tot.off, stubs: tot.stubs, joinable: tot.joinable, fake: tot.fake.slice(0, 50) }, null, 1));
  console.log('\nEVERY BUILDING ON THE ROAD: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
