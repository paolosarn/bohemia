#!/usr/bin/env node
/* THE STREETS JOIN (COMBAT TWO 11/10/26, VAMILY rule 442(d), ask lines 544 to 547; Paolo 11/9 on his YES for every building on the
   road: 'you really need to make sure intersections, the sidewalk and the streets continue looking good like they're supposed to').
   MEASURED BEFORE (the same 600 boards): every tile the join painted (3,405) was a whole tile of bare asphalt, no sidewalk and no
   kerb; where a painted street met an old block's street it stopped at that street's kerb, or a strip of gravel short of it; a
   drive was painted through downtown's sidewalk; a road the join ran off the board met the ring's sand at the board's edge.
   THE LEGS (the live fight's own deal, headless, as EVERY BUILDING ON THE ROAD deals them: the 15 places x 20 seeds and every other
   district x 6):
     J1  THE PIECE: every painted tile shows the street piece for what is around it, worked out here again from the board's own
         roads and the ring's (the street goes on where a road is beside it, a sidewalk where none is; the sidewalk's corner at every
         inside corner whose tile across is no road; the centre line along a street, never across a junction)
                                                                         planted: a sidewalk cut at a corner (one corner piece gone), red
     J2  THE MOUTH: every side where a painted street meets an old block's street whose own edge there is not asphalt (its sidewalk,
         kerb, gravel: the reach read off its picture) is opened, as deep as that edge   planted: a mouth taken away, red
     J3  NO SEAM, IN THE PICTURES (gates/the_streets_join_pixels.py, every edge a piece or a mouth touches on 160 boards): no asphalt
         against a sidewalk, a kerb or a yard across an edge the join drew; the old layouts' own edges counted apart
                                                                         planted: the corner piece gone, and the mouth gone, both red
     J4  THE CITY: every road the join ran off the board runs on through the ring to a street there or the ring's end, the same pieces
                                                                         planted: one run taken away, red
     J5  A CURB CUT ONLY ACROSS A SIDEWALK: a painted tile shows its own old picture only as a single drive on a paved block, open to
         one old street (downtown's drive to the canopy); never a street of the join's
     J6  NOTHING ELSE MOVED: against the same boards with the pieces off, the terrain, the cover, the lights, the roads, the tiles
         the same; only the painted tiles' pictures, the mouths and the ring's runs differ
     J7  ENOUGH: 600 boards, every place at 20 seeds; straights, corners, T's and crossroads (a painted one or an old street a new one
         crosses, opened both sides) all laid; mouths, tapers and ring runs
     J8  THE BOARD HANDED WHOLE (MOTION 3's seam for the camp after a fight, rule 442(a)): a board taken from a fight (FIGHT.boardNow,
         through JSON) and handed to a fresh setup on another seed (opts.boardDef) stands again tile for tile
                                                                         planted: one tile of the handed board changed, red
   Run: node gates/the_streets_join_gate.js [--quick]       (about a minute and a half) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const QUICK = process.argv.indexOf('--quick') > 0;
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/street_board', f), 'utf8'));
const JOINS = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/kit_street/joins/joins.json'), 'utf8'));
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_street_board.js'), 'utf8'), ctx);
try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_fight_kinds.js'), 'utf8'), ctx); } catch (e) {}
try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_casino_floor.js'), 'utf8'), ctx);
  const cd = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/casino/casino_floor.json'), 'utf8')), cz = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/casino/sizes.json'), 'utf8')), ck = {};
  Object.keys(cd.kit).forEach(k => { const z = cz[k.replace(/^casino_/, '')]; ck[k] = Object.assign({}, cd.kit[k], z ? { src: z.src } : {}); }); ctx.DB.casino = { data: cd, sizes: cz, kit: ck }; } catch (e) {}
ctx.DB.streetKit = J('street_board.json'); ctx.DB.streetDress = J('dressing.json'); ctx.DB.streetStoreys = J('storeys.json'); ctx.DB.streetJoins = JOINS;
const F = ctx.FIGHT, P = ctx.DB.ours.place_boards.value.places, RN = ctx.DB.ours.road_network.value, LIFT = ctx.DB.streetDress.lift;
const ASPH = {}; (RN.asphalt || []).forEach(k => ASPH[k] = 1); const DK = RN.asphalt_dark || 30;
const BYSRC = {}; Object.keys(LIFT).forEach(n => { BYSRC[LIFT[n].src] = n; });
const PIECE = {}; Object.keys(JOINS.pieces).forEach(k => { PIECE[JOINS.dir + JOINS.pieces[k].src] = k; });
const D4 = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }, OPP = { N: 'S', S: 'N', E: 'W', W: 'E' }, SIDES = ['N', 'E', 'S', 'W'];
const DEALS = [];
Object.keys(P).forEach(pid => { for (let i = 0; i < 20; i++) DEALS.push({ tag: pid, d: P[pid].districts[i % P[pid].districts.length], i }); });
const inPlace = {}; Object.keys(P).forEach(pid => P[pid].districts.forEach(d => inPlace[d] = pid));
ctx.DB.boardKinds.districts.forEach(r => { if (r.boardKind === 'freeway' || inPlace[r.district]) return; for (let i = 0; i < 6; i++) DEALS.push({ tag: r.district, d: r.district, i }); });
const deal = (q, joins) => { ctx.DB.streetJoins = joins === false ? null : JOINS; ctx.setSeed(900 + q.i);
  F.setup({ kind: 'suburb', district: q.d, cell: { gx: (q.i * 37 + 11) % 90, gy: (q.i * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false });
  ctx.DB.streetJoins = JOINS; return F.S; };
/* the gate's own reading of an area tile (the board or the ring) from the laid board alone */
function reader(S, L) {
  const W = S.w, H = S.h, R = L.ring, AW = L.AW, AH = L.AH, G = L.ground;
  const inA = (ax, ay) => ax >= 0 && ay >= 0 && ax < AW && ay < AH, inB = (ax, ay) => ax >= R && ay >= R && ax < R + W && ay < R + H;
  const ringHouse = {}; L.sprites.forEach(q => { if (q.kind === 'house') ringHouse[q.tiles[1] * AW + q.tiles[0]] = 1; });
  const cut = {}; ((L.streets && L.streets.cutAt) || []).forEach(c => { cut[(c[1] + R) * AW + c[0] + R] = 1; });
  /* an old picture's tile: its block, its picture's column and row (as the picture lies), mirrored as dealt */
  const old = i => { const g = G[i] || '', k = g.indexOf('#'); if (k < 0) return null; const src = g.slice(0, k), rest = g.slice(k + 1), fl = rest.replace(/[^hv]/g, ''), cr = rest.replace(/[hv]/g, '').split(',').map(Number);
    const name = BYSRC[src]; return { src, name, kind: name ? name.split('.')[0] : null, cx: cr[0], cy: cr[1], fl, info: name ? LIFT[name] : null }; };
  const painted = i => !!PIECE[G[i]];
  const roadAt = (ax, ay) => { if (!inA(ax, ay)) return 0; const i = ay * AW + ax;
    if (inB(ax, ay)) return L.road[(ay - R) * W + ax - R];
    if (painted(i)) return 3; if (ringHouse[i]) return 0;
    const o = old(i); return o && o.info && o.info.dark[o.cy * 5 + o.cx] >= DK && ASPH[o.kind] ? 1 : 0; };
  /* the old street's edge met on side s of (ax, ay): its reach and its asphalt along the edge, mirrored as dealt */
  const edgeOf = (ax, ay, s) => { const bx = ax + D4[s][0], by = ay + D4[s][1], o = inA(bx, by) ? old(by * AW + bx) : null; if (!o || !o.info) return null;
    let ps = OPP[s]; if (o.fl.indexOf('h') >= 0 && (ps === 'E' || ps === 'W')) ps = OPP[ps]; if (o.fl.indexOf('v') >= 0 && (ps === 'N' || ps === 'S')) ps = OPP[ps];
    const cell = JOINS.reach[o.src] ? JOINS.reach[o.src][o.cy * 5 + o.cx] : null, i = SIDES.indexOf(ps), r = cell ? cell[i] : -1, sp = cell ? cell[4 + i] : -1;
    let a0 = null, a1 = null; if (sp && sp !== -1) { a0 = sp[0]; a1 = sp[1]; if ((s === 'N' || s === 'S') ? o.fl.indexOf('h') >= 0 : o.fl.indexOf('v') >= 0) { const t = a0; a0 = 1 - a1; a1 = 1 - t; } }
    return { o, r, a0, a1 }; };
  const WF = { ns: JOINS.walk_px.W / 515, ew: JOINS.walk_px.N / 364 };
  const ends = (s, op, nub) => { const lo = s === 'N' || s === 'S' ? 'W' : 'N', hi = s === 'N' || s === 'S' ? 'E' : 'S', wf = s === 'N' || s === 'S' ? WF.ns : WF.ew, cn = q => (s === 'N' || s === 'S') ? s + q : q + s;
    return [!op[lo] || nub[cn(lo)] ? wf : 0, !op[hi] || nub[cn(hi)] ? 1 - wf : 1]; };
  /* an old street takes this one straight on: its kerb first (a mouth opens it), or its asphalt at the edge long enough, reaching every
     end where this piece is open to the side, within a taper of this piece's kerb */
  const takes = (e, k) => !e || e.r >= 0.02 || (e.a0 !== null && e.a1 - e.a0 >= 0.25 && (k[0] === 0 ? e.a0 <= 0.05 : Math.abs(e.a0 - k[0]) <= 0.4) && (k[1] === 1 ? e.a1 >= 0.95 : Math.abs(e.a1 - k[1]) <= 0.4));
  /* the gate's own working of every piece: joined where both tiles are road drawn as road and neither side is shut; a side shut
     where its old street cannot take the street; an inside corner unless both tiles beside it go on into the tile across it */
  const pset = []; for (let ay = 0; ay < AH; ay++) for (let ax = 0; ax < AW; ax++) { const i = ay * AW + ax;
    if (inB(ax, ay) ? L.road[(ay - R) * W + ax - R] === 3 && !cut[i] : painted(i)) pset.push(i); }
  const shut = {}, drawn = (ax, ay) => !inA(ax, ay) || (roadAt(ax, ay) > 0 && !cut[ay * AW + ax]);
  const link = (ax, ay, s) => { const bx = ax + D4[s][0], by = ay + D4[s][1]; if (!drawn(ax, ay) || !drawn(bx, by)) return false;
    if (inA(ax, ay) && shut[ay * AW + ax] && shut[ay * AW + ax][s]) return false; if (inA(bx, by) && shut[by * AW + bx] && shut[by * AW + bx][OPP[s]]) return false; return true; };
  const shape = i => { const ax = i % AW, ay = (i - ax) / AW, op = {}; SIDES.forEach(s => { op[s] = link(ax, ay, s); });
    const corner = c => op[c[0]] && op[c[1]] && !(link(ax + D4[c[0]][0], ay + D4[c[0]][1], c[1]) && link(ax + D4[c[1]][0], ay + D4[c[1]][1], c[0]));
    return { ax, ay, op, nub: { NE: corner('NE'), SE: corner('SE'), SW: corner('SW'), NW: corner('NW') } }; };
  for (let pass = 0; pass < 3; pass++) { let ch = false;
    pset.forEach(i => { const f = shape(i); SIDES.forEach(s => { if (!f.op[s] || roadAt(f.ax + D4[s][0], f.ay + D4[s][1]) !== 1 || takes(edgeOf(f.ax, f.ay, s), ends(s, f.op, f.nub))) return; (shut[i] = shut[i] || {})[s] = 1; ch = true; }); });
    if (!ch) break; }
  /* the piece this tile must show */
  const want = (ax, ay) => {
    const f = shape(ay * AW + ax), op = f.op, nub = f.nub;
    const ewOk = op.E && op.W && !(op.N && (nub.NE || nub.NW)) && !(op.S && (nub.SE || nub.SW));
    const nsOk = op.N && op.S && !(op.E && (nub.NE || nub.SE)) && !(op.W && (nub.NW || nub.SW));
    const run = (dx, dy) => { let n = 1; for (let i = 1; i < 6 && roadAt(ax + dx * i, ay + dy * i) > 0; i++) n++; for (let j = 1; j < 6 && roadAt(ax - dx * j, ay - dy * j) > 0; j++) n++; return n; };
    let line = ewOk && nsOk ? (run(1, 0) >= run(0, 1) ? 'e' : 'n') : ewOk ? 'e' : nsOk ? 'n' : 'x';
    if (ewOk && nsOk && run(1, 0) >= 4 && run(0, 1) >= 4) line = 'x';
    return 'j_' + SIDES.map(s => op[s] ? '1' : '0').join('') + '_' + ['NE', 'SE', 'SW', 'NW'].map(c => nub[c] ? '1' : '0').join('') + '_' + line; };
  return { W, H, R, AW, AH, G, inA, inB, old, painted, roadAt, want, cut, edgeOf };
}
function judge(S, L) {
  const r = reader(S, L), out = { pieces: 0, wrong: [], mouths: 0, missing: [], cuts: 0, badCut: [], runs: 0, runBad: [], keys: {} };
  const dec = {}; (L.decals || []).forEach(q => { dec[q.ay * r.AW + q.ax + q.side] = q; });
  const visit = (ax, ay) => { const i = ay * r.AW + ax, k = PIECE[r.G[i]];
    if (!k) { out.wrong.push('@' + (ax - r.R) + ',' + (ay - r.R) + ' shows ' + r.G[i]); return; }
    const w = r.want(ax, ay); out.pieces++; out.keys[w] = (out.keys[w] || 0) + 1;
    if (k !== w) out.wrong.push('@' + (ax - r.R) + ',' + (ay - r.R) + ' ' + k + ' wants ' + w);
    SIDES.forEach((s, si) => { const bx = ax + D4[s][0], by = ay + D4[s][1]; if (r.roadAt(bx, by) !== 1 || w[2 + si] !== '1') return; const e = r.edgeOf(ax, ay, s); if (!e) return; const o = e.o;
      const d = e.r < 0 ? 0.5 : Math.min(e.r, 0.6);
      if (d < 0.02) return;
      const q = dec[by * r.AW + bx + OPP[s]]; if (q && Math.abs(q.d - d) < 0.002 && q.src === r.G[i]) out.mouths++; else out.missing.push('@' + (bx - r.R) + ',' + (by - r.R) + ' ' + OPP[s] + ' ' + o.name); }); };
  for (let y = 0; y < r.H; y++) for (let x = 0; x < r.W; x++) { if (L.road[y * r.W + x] !== 3) continue; const ax = x + r.R, ay = y + r.R, i = ay * r.AW + ax;
    if (r.cut[i]) { out.cuts++; const o = r.old(i), ways = SIDES.filter(s => r.roadAt(ax + D4[s][0], ay + D4[s][1]) > 0);
      if (!o || !o.info || o.info.fam !== 'paved' || ways.length !== 1 || r.roadAt(ax + D4[ways[0]][0], ay + D4[ways[0]][1]) === 3) out.badCut.push('@' + x + ',' + y); continue; }
    visit(ax, ay); }
  for (let ay = 0; ay < r.AH; ay++) for (let ax = 0; ax < r.AW; ax++) if (!r.inB(ax, ay) && r.painted(ay * r.AW + ax)) visit(ax, ay);
  /* J4: every road the join ran off the board, run on */
  ((L.roads && L.roads.exits) || []).forEach(e => { const x = e[0], y = e[1]; let s = x === 0 ? 'W' : x === r.W - 1 ? 'E' : y === 0 ? 'N' : y === r.H - 1 ? 'S' : null; if (!s) return;
    if ((s === 'W' || s === 'E') && (y === 0 || y === r.H - 1)) { const ins = s === 'W' ? L.road[y * r.W + x + 1] : L.road[y * r.W + x - 1]; if (!ins) s = y === 0 ? 'N' : 'S'; }
    out.runs++; let ax = x + r.R + D4[s][0], ay = y + r.R + D4[s][1], ok = true;
    for (let k = 1; k <= r.R && r.inA(ax, ay) && r.G[ay * r.AW + ax]; k++, ax += D4[s][0], ay += D4[s][1]) { const t = r.roadAt(ax, ay); if (t === 1) break; if (t !== 3) { ok = false; break; } }
    if (!ok) out.runBad.push('@' + x + ',' + y + ' ' + s); });
  return out;
}
(async () => {
  const t0 = Date.now(), tot = { boards: 0, laid: 0, pieces: 0, wrong: [], mouths: 0, missing: [], cuts: 0, badCut: [], runs: 0, runBad: [], keys: {}, byTag: {} };
  const forPix = [], deals = QUICK ? DEALS.filter((q, i) => i % 4 === 0) : DEALS;
  let nubAt = null, mouthAt = null, runAt = null;
  deals.forEach((q, n) => { const S = deal(q), L = S.boardDef.laid; tot.boards++; tot.byTag[q.tag] = (tot.byTag[q.tag] || 0) + 1;
    if (!L || !L.road) return; tot.laid++;
    const mc = {}; (L.decals || []).forEach(d => { if (d.kind !== 'taper') mc[d.ay * L.AW + d.ax] = (mc[d.ay * L.AW + d.ax] || 0) + 1; }); tot.crossOld = (tot.crossOld || 0) + Object.keys(mc).filter(k => mc[k] >= 2).length;
    tot.tapers = (tot.tapers || 0) + (L.decals || []).filter(d => d.kind === 'taper').length; tot.shut = (tot.shut || 0) + ((L.streets && L.streets.shut) || 0);
    const o = judge(S, L); tot.pieces += o.pieces; tot.mouths += o.mouths; tot.cuts += o.cuts; tot.runs += o.runs;
    ['wrong', 'missing', 'badCut', 'runBad'].forEach(k => o[k].forEach(s => tot[k].push(q.tag + ' s' + q.i + ' ' + s)));
    Object.keys(o.keys).forEach(k => { tot.keys[k] = (tot.keys[k] || 0) + o.keys[k]; });
    const kit = []; L.ground.forEach((g, i) => { if (PIECE[g]) kit.push(i); });
    if (kit.length && (n % (QUICK ? 1 : 3) === 0 || q.tag === 'suburb' || q.tag === 'trailer')) forPix.push({ tag: q.tag + ' s' + q.i, AW: L.AW, AH: L.AH, R: L.ring, ground: L.ground, decals: L.decals || [], kit });
    if (!nubAt) { const i = L.ground.findIndex((g, i) => { const k = PIECE[g]; if (!k || k.slice(7, 11) === '0000') return false;
      const ax = i % L.AW, ay = (i - ax) / L.AW, nb = k.slice(7, 11); return ['NE', 'SE', 'SW', 'NW'].some((c, ci) => nb[ci] === '1' && [c[0], c[1]].some(s => !!PIECE[L.ground[(ay + D4[s][1]) * L.AW + ax + D4[s][0]]])); });
      if (i >= 0) nubAt = { q, i }; }
    if (!mouthAt && L.decals && L.decals.length) mouthAt = { q };
    if (!runAt && L.streets && L.streets.runs && L.streets.runs.some(u => u.n > 0)) runAt = { q }; });
  check(tot.wrong.length === 0 && tot.pieces > (QUICK ? 200 : 1000), 'J1', 'THE PIECE: ' + tot.pieces + ' street pieces on ' + tot.laid + ' boards and their rings, every one the piece for what is around it (' + Object.keys(tot.keys).length + ' kinds of piece)' + (tot.wrong.length ? ': ' + tot.wrong.slice(0, 4).join('; ') : ''));
  /* planted J1: a sidewalk cut at a corner (one corner piece gone) */
  let plantPix = null;
  if (nubAt) { const S = deal(nubAt.q), L = S.boardDef.laid, i = nubAt.i, k = PIECE[L.ground[i]], ax = i % L.AW, ay = (i - ax) / L.AW;
    const nb = k.slice(7, 11), ci = nb.indexOf('1'), k2 = k.slice(0, 7) + nb.slice(0, ci) + '0' + nb.slice(ci + 1) + k.slice(11), keep = L.ground[i];
    L.ground[i] = JOINS.dir + JOINS.pieces[k2].src; const o = judge(S, L);
    plantPix = { tag: 'PLANT nub ' + nubAt.q.tag + ' s' + nubAt.q.i, AW: L.AW, AH: L.AH, R: L.ring, ground: L.ground.slice(), decals: L.decals || [], kit: L.ground.map((g, j) => PIECE[g] ? j : -1).filter(j => j >= 0) };
    L.ground[i] = keep;
    check(o.wrong.length > 0, 'J1p', 'planted: the sidewalk\'s corner at ' + ['NE', 'SE', 'SW', 'NW'][ci] + ' of ' + (ax - L.ring) + ',' + (ay - L.ring) + ' taken away (' + k + ' -> ' + k2 + ') is caught (' + o.wrong.slice(0, 1).join('') + ')'); }
  else check(false, 'J1p', 'no inside corner beside another piece found to plant on');
  check(tot.missing.length === 0 && tot.mouths > 200, 'J2', 'THE MOUTH: ' + tot.mouths + ' places a painted street meets an old block\'s street with a sidewalk, kerb or gravel at that edge, every one opened as deep as that edge' + (tot.missing.length ? ': ' + tot.missing.slice(0, 4).join('; ') : ''));
  let plantMouth = null;
  if (mouthAt) { const S = deal(mouthAt.q), L = S.boardDef.laid, q0 = L.decals.shift(), o = judge(S, L);
    plantMouth = { tag: 'PLANT mouth ' + mouthAt.q.tag + ' s' + mouthAt.q.i, AW: L.AW, AH: L.AH, R: L.ring, ground: L.ground.slice(), decals: L.decals.slice(), kit: L.ground.map((g, j) => PIECE[g] ? j : -1).filter(j => j >= 0) };
    L.decals.unshift(q0);
    check(o.missing.length > 0, 'J2p', 'planted: the mouth at ' + (q0.ax - L.ring) + ',' + (q0.ay - L.ring) + ' ' + q0.side + ' taken away is caught (' + o.missing.slice(0, 1).join('') + ')'); }
  else check(false, 'J2p', 'no mouth found to plant on');
  /* J3: the pictures */
  const pix = (boards) => { const f = path.join(os.tmpdir(), 'streets_join_' + process.pid + '_' + Math.random().toString(36).slice(2) + '.json'); fs.writeFileSync(f, JSON.stringify(boards));
    try { return JSON.parse(cp.execFileSync('python3', [path.join(ROOT, 'gates/the_streets_join_pixels.py'), f], { encoding: 'utf8', maxBuffer: 1 << 24 }).trim().split('\n').pop()); } catch (e) { return { err: String(e.message).slice(0, 200) }; } finally { try { fs.unlinkSync(f); } catch (e) {} } };
  if (process.env.SEAMS_DUMP) fs.writeFileSync(process.env.SEAMS_DUMP, JSON.stringify(forPix));
  const px = pix(forPix);
  check(!px.err && px.boards >= (QUICK ? 30 : 110) && px.edges > 2000 && px.seams === 0, 'J3', 'NO SEAM, IN THE PICTURES: ' + (px.err || px.boards + ' boards, ' + px.edges + ' edges a street piece or a mouth touches, ' + px.seams + ' seams (the old layouts\' own edges beside them: ' + px.old_seams + ' of ' + px.old_edges + ' uneven, theirs)' + (px.worst && px.worst.length ? ': ' + px.worst.slice(0, 3).join('; ') : '')));
  const pn = plantPix ? pix([plantPix]) : { err: 'no plant' }, pm = plantMouth ? pix([plantMouth]) : { err: 'no plant' };
  check(!pn.err && pn.seams > 0 && !pm.err && pm.seams > 0, 'J3p', 'planted, in the pictures: the corner piece gone ' + (pn.err || pn.seams + ' seam(s)') + '; the mouth gone ' + (pm.err || pm.seams + ' seam(s)') + ', both caught');
  check(tot.runBad.length === 0 && tot.runs >= (QUICK ? 5 : 20), 'J4', 'THE CITY: ' + tot.runs + ' roads the join ran off the board, every one runs on through the ring to a street there or the ring\'s end' + (tot.runBad.length ? ': ' + tot.runBad.slice(0, 4).join('; ') : ''));
  if (runAt) { const S = deal(runAt.q), L = S.boardDef.laid, u = L.streets.runs.find(v => v.n > 0), s = u.side, keep = [];
    for (let k = 1; k <= u.n; k++) { const ax = u.from[0] + L.ring + D4[s][0] * k, ay = u.from[1] + L.ring + D4[s][1] * k, i = ay * L.AW + ax; keep.push([i, L.ground[i]]); L.ground[i] = 'block_desert_1.webp#0,0'; }
    const o = judge(S, L); keep.forEach(p => { L.ground[p[0]] = p[1]; });
    check(o.runBad.length > 0, 'J4p', 'planted: the run off ' + u.from.join(',') + ' ' + s + ' (' + u.n + ' tiles of the ring) taken away is caught (' + o.runBad.slice(0, 1).join('') + ')'); }
  else check(false, 'J4p', 'no run into the ring found to plant on');
  check(tot.badCut.length === 0, 'J5', 'A CURB CUT ONLY ACROSS A SIDEWALK: ' + tot.cuts + ' painted tiles keep their own sidewalk, every one a single drive on a paved block open to one old street' + (tot.badCut.length ? ': ' + tot.badCut.slice(0, 4).join('; ') : ''));
  /* J6: against the pieces off */
  { let boards = 0; const stray = [];
    deals.filter((q, i) => i % 6 === 0).forEach(q => { const S1 = deal(q), L1 = S1.boardDef.laid; if (!L1 || !L1.road) return;
      const a = { t: JSON.stringify(S1.terrain), c: JSON.stringify(S1.boardDef.cover), l: JSON.stringify(L1.lights), r: JSON.stringify(Array.from(L1.road)), ti: JSON.stringify(L1.tiles), g: L1.ground.slice() };
      const S0 = deal(q, false), L0 = S0.boardDef.laid; boards++;
      if (!L0) { stray.push(q.tag + ' s' + q.i + ' not laid without'); return; }
      if (a.t !== JSON.stringify(S0.terrain)) stray.push(q.tag + ' s' + q.i + ' terrain'); if (a.c !== JSON.stringify(S0.boardDef.cover)) stray.push(q.tag + ' s' + q.i + ' cover');
      if (a.l !== JSON.stringify(L0.lights)) stray.push(q.tag + ' s' + q.i + ' lights'); if (a.r !== JSON.stringify(Array.from(L0.road))) stray.push(q.tag + ' s' + q.i + ' roads'); if (a.ti !== JSON.stringify(L0.tiles)) stray.push(q.tag + ' s' + q.i + ' tiles');
      a.g.forEach((g, i) => { if (g === L0.ground[i]) return; const ax = i % L1.AW, ay = (i - ax) / L1.AW, x = ax - L1.ring, y = ay - L1.ring, onB = x >= 0 && y >= 0 && x < S1.w && y < S1.h;
        if (onB ? L1.road[y * S1.w + x] !== 3 : !PIECE[g]) stray.push(q.tag + ' s' + q.i + ' ground @' + x + ',' + y); }); });
    check(stray.length === 0 && boards >= (QUICK ? 20 : 90), 'J6', 'NOTHING ELSE MOVED: ' + boards + ' boards against the pieces off: the terrain, the cover, the lights, the roads, the tiles the same; only the painted tiles, the mouths and the ring\'s runs differ' + (stray.length ? ': ' + stray.slice(0, 4).join('; ') : '')); }
  /* J8: THE BOARD HANDED WHOLE (MOTION 3's seam for the camp after a fight, rule 442(a)): a board taken whole from a fight (FIGHT.boardNow,
     through JSON as a page hands it on) and handed to a fresh setup on another seed (opts.boardDef) stands again tile for tile */
  { const sig = S => JSON.stringify([S.w, S.h, S.terrain, S.boardDef.cover, S.boardDef.lights, S.boardDef.roofs, S.boardDef.laid ? [S.boardDef.laid.ground, S.boardDef.laid.decals, S.boardDef.laid.sprites, S.boardDef.laid.storeys] : null]);
    let n = 0, same = 0; const bad = []; let plant = null;
    deals.filter((q, i) => i % 20 === 0).forEach(q => { const S1 = deal(q), a = sig(S1), snap = JSON.parse(JSON.stringify(F.boardNow())); n++;
      ctx.setSeed(77 + q.i); F.setup({ kind: 'desert', district: 'desert', night: false, auto: true, formation: null, deploy: false, boardDef: snap.boardDef });
      if (F.S.handed && sig(F.S) === a) same++; else bad.push(q.tag + ' s' + q.i + (F.S.handErr ? ' ' + F.S.handErr : ''));
      if (!plant && snap.boardDef.laid) plant = snap; });
    check(n >= (QUICK ? 7 : 30) && same === n, 'J8', 'THE BOARD HANDED WHOLE: ' + same + ' of ' + n + ' boards taken from a fight and handed to a fresh setup on another seed stand again tile for tile (every picture, mouth, building, piece and light)' + (bad.length ? ': ' + bad.slice(0, 3).join('; ') : ''));
    if (plant) { const q0 = deals.find(q => q.tag === 'suburb'), S1 = deal(q0), a = sig(S1), p2 = JSON.parse(JSON.stringify(F.boardNow()));
      p2.boardDef.terrain[3][3] = p2.boardDef.terrain[3][3] === 'blocked' ? 'flat' : 'blocked';
      ctx.setSeed(5); F.setup({ kind: 'desert', district: 'desert', night: false, auto: true, formation: null, deploy: false, boardDef: p2.boardDef });
      check(sig(F.S) !== a, 'J8p', 'planted: a handed board with one tile changed is not the fight\'s board (caught)'); } }
  const has = re => Object.keys(tot.keys).some(k => re.test(k));
  const places = Object.keys(P).filter(p => tot.byTag[p] >= (QUICK ? 5 : 20)).length;
  check(tot.boards >= (QUICK ? 150 : 600) && places === Object.keys(P).length && has(/^j_(1010|0101)/) && has(/^j_(1100|0110|0011|1001)_/) && has(/^j_(0111|1011|1101|1110)_/) && (has(/^j_1111_/) || tot.crossOld > 0) && tot.mouths > 0 && tot.runs > 0,
    'J7', tot.boards + ' boards, ' + places + ' places at ' + (QUICK ? 5 : 20) + ' seeds; straights ' + Object.keys(tot.keys).filter(k => /^j_(1010|0101)/.test(k)).reduce((s, k) => s + tot.keys[k], 0) + ', corners ' + Object.keys(tot.keys).filter(k => /^j_(1100|0110|0011|1001)_/.test(k)).reduce((s, k) => s + tot.keys[k], 0) + ', T\'s ' + Object.keys(tot.keys).filter(k => /^j_(0111|1011|1101|1110)_/.test(k)).reduce((s, k) => s + tot.keys[k], 0) + ', crossroads ' + Object.keys(tot.keys).filter(k => /^j_1111_/.test(k)).reduce((s, k) => s + tot.keys[k], 0) + ' (and ' + tot.crossOld + ' old street tiles a new street crosses, opened both sides), dead ends ' + Object.keys(tot.keys).filter(k => /^j_(1000|0100|0010|0001)_/.test(k)).reduce((s, k) => s + tot.keys[k], 0) + '; ' + tot.mouths + ' mouths, ' + tot.tapers + ' tapers, ' + tot.shut + ' sides ended in a kerb where the old street could not take the new, ' + tot.runs + ' runs into the ring, ' + tot.cuts + ' curb cuts');
  console.log('\nTHE STREETS JOIN: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
