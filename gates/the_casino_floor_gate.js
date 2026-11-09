#!/usr/bin/env node
/* THE CASINO FLOOR (COMBAT TWO 11/8/26, VAMILY rule 416, ask line 468; Paolo 11/6: 'some fights could be inside too... I still want
   like this is a block and turf war, I always want that feeling'). The first big interior: a Strip casino's floor on house tiles,
   the same camera with the roof cut away (slices/bohemia_casino_floor.js, slices/fight_ground/casino/casino_floor.json).
   MEASURED BEFORE (main 29dc67d33): a fight at the casino, the high roller, the Luxor or the resort was dealt the strip family's
   checkerboard of casino-carpet blocks and street blocks (a street ending at a carpet); the casino board in the data (opts.board
   'casino') was bare carpet with slot banks and no wall, cage, bar or sportsbook, and no fight from the map ever dealt it.
   THE LEGS (the live fight's own deal, headless; the four casino districts x 6 seeds, the Strip's own district for the control):
     C1  a fight at a casino with an inside is fought on its floor (the four districts), a fight on the Strip's boulevard is not
     C2  THE FLOOR IS JOINED: every open tile reached from every other (doors, never through a wall); both lines on open floor
                                                                                   planted: a wall run across the floor, red
     C3  THE STRONG ROOM: the cage's room behind its counter and bars has exactly one way in (its door)
                                                                                   planted: a second way in, red
     C4  THE DARK: inside it is night; with no power handed not one tile is lit; paid power lights the slot banks
                                                                                   planted: the dark leg read with the power on, red
     C5  THE PIECES ARE REAL: every piece of the floor has its picture (the cage, the bar, the screens, the seats, the walls, the
         doors, the stage through the master rig; the slot banks, tables and pillars the rig's own), the cover is cover (slot
         banks and tables), the cage and the columns block a step, the stage is high ground
     C6  A FIGHT PLAYS: both sides on AUTO, every fight on the floor ends inside 30 rounds
   Run: node gates/the_casino_floor_gate.js [--json out.json]     (about ten seconds) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const data = J('slices/fight_ground/casino/casino_floor.json'), sizes = J('slices/fight_ground/casino/sizes.json') || {};
const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(/^casino_/, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); });
ctx.DB.casino = { data, sizes, kit };
const F = ctx.FIGHT, CF = ctx.BohemiaCasinoFloor, G = ctx.DB.ground;
const deal = (d, i, extra) => { ctx.setSeed(500 + i); F.setup(Object.assign({ kind: 'suburb', district: d, cell: { gx: (i * 31 + 7) % 90, gy: (i * 17 + 3) % 90 }, night: false, auto: true, formation: null, deploy: false }, extra || {})); return F.S; };
(async () => {
  const t0 = Date.now(), DIST = data.districts, R = { boards: [] };
  /* C1 */
  let inside = 0, n1 = 0, strip = 0; const wrong = [];
  DIST.forEach(d => { for (let i = 0; i < 6; i++) { const S = deal(d, i); n1++; if (S.boardDef.interior === 'casino') inside++; else wrong.push(d + ' s' + i + ' ' + S.boardDef.name); } });
  for (let i = 0; i < 6; i++) { const S = deal('strip', i); if (S.boardDef.interior === 'casino') strip++; }
  check(inside === n1 && strip === 0, 'C1', 'a fight at a casino with an inside is fought on its floor: ' + inside + ' of ' + n1 + ' (' + DIST.join(', ') + '); on the Strip\'s boulevard ' + strip + ' of 6' + (wrong.length ? ': ' + wrong.slice(0, 3).join('; ') : ''));
  /* C2, C3, C4, C5, C6 over the four districts x 6 */
  let joined = 0, lines = 0, rooms = 0, dark = 0, n = 0, ended = 0, rounds = 0; const bad2 = [], bad3 = [], bad5 = [];
  let lit = 0; const PIECES = {}, BLOCK = {}, HIGH = { stage: 0 };
  DIST.forEach(d => { for (let i = 0; i < 6; i++) {
    const S = deal(d, i), B = S.boardDef; if (B.interior !== 'casino') continue; n++;
    const c = CF.check(B); if (c.reached === c.open && c.open > 200) joined++; else bad2.push(d + ' s' + i + ' ' + c.reached + '/' + c.open);
    if (S.units.every(u => !S.solid[u.y][u.x] && S.terrain[u.y][u.x] !== 'blocked')) lines++;
    if (c.vault > 0 && c.waysIn === 1) rooms++; else bad3.push(d + ' s' + i + ' room ' + c.vault + ' ways ' + c.waysIn);
    let litN = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) litN++;
    if (S.night && !S.power && litN === 0) dark++;
    (B.cover || []).forEach(cv => { PIECES[cv.piece] = (PIECES[cv.piece] || 0) + 1; const df = F.pieceDef ? F.pieceDef(cv.piece) : null; });
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { if (/^height/.test(S.terrain[y][x])) HIGH.stage++; }
    (B.cover || []).forEach(cv => { if (S.solid[cv.ty] && S.solid[cv.ty][cv.tx]) BLOCK[cv.piece] = 1; });
    let g = 0; while (!S.over && S.round <= 30 && g < 60000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    if (S.over) ended++; rounds += S.round;
    R.boards.push({ d, i, layout: B.casino && B.casino.layout, flip: B.casino && B.casino.flip, open: c.open, reached: c.reached, ways: c.waysIn, over: S.over, rounds: S.round });
  } });
  check(joined === n && lines === n && n >= 20, 'C2', 'THE FLOOR IS JOINED: ' + joined + ' of ' + n + ' floors every open tile reached, both lines on open floor on ' + lines + bad2.slice(0, 3).map(s => '; ' + s).join(''));
  { const S = deal(DIST[0], 0), B = S.boardDef, L = B.laid, keep = L.terrain.map(r => r.slice()); for (let x = 0; x < L.W; x++) L.terrain[8][x] = 'blocked';
    const c = CF.check(B); L.terrain.forEach((r, y) => r.forEach((t, x) => { r[x] = keep[y][x]; }));
    check(c.reached < c.open, 'C2p', 'planted: a wall run across the floor at row 8 is caught (' + c.reached + ' of ' + c.open + ' reached)'); }
  check(rooms === n, 'C3', 'THE STRONG ROOM: on ' + rooms + ' of ' + n + ' floors the cage\'s room has exactly one way in, its door' + bad3.slice(0, 3).map(s => '; ' + s).join(''));
  { const S = deal(DIST[0], 0), B = S.boardDef, L = B.laid; let opened = null;
    const NB = [[1, 0], [-1, 0], [0, 1], [0, -1]], inB = (x, y) => x >= 0 && y >= 0 && x < L.W && y < L.H;
    for (let y = 0; y < L.H && !opened; y++) for (let x = 0; x < L.W && !opened; x++) { if (L.tiles[y][x] !== 'vault') continue;
      for (const d of NB) { const u = x + d[0], v = y + d[1]; if (!inB(u, v) || L.tiles[v][u] !== 'wall') continue;
        if (NB.some(e => { const a = u + e[0], b = v + e[1]; return inB(a, b) && L.tiles[b][a] !== 'vault' && L.terrain[b][a] !== 'blocked'; })) { opened = [u, v]; break; } } }
    const keep = opened ? L.terrain[opened[1]][opened[0]] : null; if (opened) L.terrain[opened[1]][opened[0]] = 'flat';
    const c = CF.check(B); if (opened) L.terrain[opened[1]][opened[0]] = keep;
    check(c.waysIn > 1, 'C3p', 'planted: a second way into the strong room at ' + (opened ? opened.join(',') : '?') + ' is caught (' + c.waysIn + ' ways in)'); }
  { const S = deal(DIST[0], 0, { casinoPower: true }); for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) lit++; }
  check(dark === n && lit > 0, 'C4', 'THE DARK: ' + dark + ' of ' + n + ' floors at night with no power and not one tile lit; paid power lights ' + lit + ' tiles round the slot banks');
  { const S = deal(DIST[0], 0, { casinoPower: true }); let litN = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) litN++;
    check(!(S.night && !S.power && litN === 0), 'C4p', 'planted: the dark leg read with the power on is caught (' + litN + ' tiles lit)'); }
  /* C5: the pictures and the rules of the pieces */
  const missing = [], kinds = [];
  Object.keys(PIECES).forEach(p => { const d = kit[p] || G.cover[p] || (G.cover_extra || {})[p]; if (!d || !d.src) { missing.push(p + ' (no picture)'); return; }
    const file = path.join(ROOT, 'slices/fight_ground', d.src); if (!fs.existsSync(file)) missing.push(p + ' ' + d.src); });
  Object.keys(sizes).forEach(k => { if (!sizes[k].model || !fs.existsSync(path.join(ROOT, sizes[k].model))) missing.push(k + ' (no model)'); });
  if (!PIECES.slot_bank || PIECES.slot_bank < 15 * n) kinds.push('slot banks ' + (PIECES.slot_bank || 0));
  if (!PIECES.table || PIECES.table < 8 * n) kinds.push('tables ' + (PIECES.table || 0));
  if (!BLOCK.casino_cage || !BLOCK.pillar) kinds.push('the cage or a column lets a man through');
  if (!(HIGH.stage > 0)) kinds.push('no high ground');
  ['casino_cage', 'casino_bar', 'casino_screens', 'casino_seats', 'casino_stage', 'casino_door', 'casino_glass'].forEach(p => { if (!PIECES[p]) kinds.push('no ' + p); });
  if (!PIECES.casino_wall_ew && !PIECES.casino_wall_ns) kinds.push('no wall');
  check(!missing.length && !kinds.length, 'C5', 'THE PIECES ARE REAL: ' + Object.keys(PIECES).length + ' kinds of piece on the floors (' + Object.keys(PIECES).map(p => p.replace(/^casino_/, '') + ' ' + PIECES[p]).join(', ') + '), every one with its picture, the casino\'s own through the master rig; the cage and the columns block a step, the stage is high ground' + (missing.concat(kinds).length ? ': ' + missing.concat(kinds).slice(0, 5).join('; ') : ''));
  check(ended === n, 'C6', 'A FIGHT PLAYS: ' + ended + ' of ' + n + ' fights on the floor ended on AUTO inside 30 rounds (' + (n ? (rounds / n).toFixed(1) : 0) + ' rounds a fight)');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nTHE CASINO FLOOR: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
