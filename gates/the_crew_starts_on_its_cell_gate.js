#!/usr/bin/env node
/* THE CREW STARTS ON ITS CELL (COMBAT THREE 11/11/26; VAMILY rule 429(a) ONE MAP, ask rows 504, 506, 507; WORLD THIRTEEN's seam,
   handoffs/WORLD_THIRTEEN.md 11/11h: 'OWED, YOURS: start the crew on the cell's tiles (template.tx..tx+2, ty..ty+2) instead of the
   start rows').
   MEASURED BEFORE (main a87a1a3f + WORLD THIRTEEN's THE CUT, 18295f69): a fight the map hands from a cell of one of the 15 places is
   dealt that place's own board block for block, but his line stood where every line stands: the board's usual column, the board's
   middle rows, whichever of the 35 cells of the place the company was on.
   THE LAW NOW: the cell's three rows are his line's middle and the cell's east column is his front; their line faces it. The fight
   still runs west to east (rule 67), so a cell too far east for their line to have board left stands his front as far east as the
   board allows, and a cell west of his usual column keeps the usual column (rule 415(b), room to run): FIGHT.S.cutStart says what
   was asked and what was stood.
   THE LEGS (the live fight's own deal, headless; every place template of records/target/bb/place_templates.json, its cells 7 by 5):
     K1  THE BOARD IS THE PLACE'S OWN (WORLD THIRTEEN's block, read here so the two halves are held together): a template hand-over
         is dealt board place_<id> block for block and carries the cell it was cut at
     K2  HIS LINE'S ROWS ARE THE CELL'S: over every cell of every place, a man of his stands as near the cell's middle row as the
         ground his line stands on allows (a tile's grace: a board's own walls and pens are not his to stand in)
     K3  HIS FRONT IS THE CELL'S EAST COLUMN wherever both lines have ground: S.cutStart.stood says which of four it was and the
         gate holds it to that: 'cell' (exactly on tx + 2), 'usual' (the cell is west of his usual column, rule 415(b)), 'east'
         (the cell is past the last column that leaves their line its gap: the farthest the board allows), 'room' (the front
         stepped west until both lines had joined ground: the Strip's wall, the lab's pens); nobody of his ahead of his front
     K4  THEIR LINE FACES HIS AND THE GAP HOLDS: nobody of theirs on or west of his front column; the nearest two men never closer
         than the gap (or than that place's own start with no cell); both lines on open ground with a walk to each other
     K5  A FIGHT PLAYS FROM ANY CELL: both sides on AUTO, a fight from the four corner cells and the middle of every place ends
         inside 30 rounds
     K7  THE KEPT LINE COMES BACK THE SAME: the memory of his line (rule 110b) is counted from the row the line was stood on, so a
         line kept on a cell and handed to that cell again stands on the same tiles
     K8  A PLACE'S CELL WINS OVER AN INSIDE: where the map stands a place's own board the fight is on it, never in the tunnels under
         it or a garage beside it (those take their share on the cells no place stands on, and when asked for by name)
     K6  NO TEMPLATE, NO CHANGE: the same place asked for without a cell carries no cell start and deals the same line twice
     planted: the cell ignored (the old start), K2 and K3 read red
   Run: node gates/the_crew_starts_on_its_cell_gate.js      (about a minute) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js', 'slices/bohemia_flood_tunnels.js', 'slices/bohemia_parking_garage.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
/* the three insides, loaded as the page loads them: a place's cell must win over them (K8) */
{ const gd = J('slices/fight_ground/garage/garage.json'), ga = J('slices/fight_ground/garage/garage_art.json');
  if (gd && ga) { const kit = {}; Object.keys(ga.kit).forEach(k => { kit[k] = Object.assign({}, ga.kit[k], (gd.rules || {})[k] || {}); }); Object.keys(gd.kit).forEach(k => { const q = (gd.sizes || {})[gd.kit[k].like || k.replace(/^garage_/, '')]; kit[k] = Object.assign({}, q ? { src: q.src } : {}, gd.kit[k]); }); ctx.DB.garage = { data: gd, art: ga, sizes: gd.sizes || {}, kit }; }
  const kitOf = (data, sizes, pre) => { const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(pre, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); }); return kit; };
  const cd = J('slices/fight_ground/casino/casino_floor.json'), cz = J('slices/fight_ground/casino/sizes.json') || {}; if (cd) ctx.DB.casino = { data: cd, sizes: cz, kit: kitOf(cd, cz, /^casino_/) };
  const td = J('slices/fight_ground/tunnels/tunnels.json'), tz = J('slices/fight_ground/tunnels/sizes.json') || {}; if (td && !ctx.DB.tunnels) ctx.DB.tunnels = { data: td, sizes: tz, kit: kitOf(td, tz, /^tunnel_/) }; }
const F = ctx.FIGHT, PL = ctx.DB.ours.place_boards.value.places, G = ctx.DB.ground;
const PLACES = Object.keys(PL).filter(p => G.boards['place_' + p]);
const R = k => { const o = ctx.DB.rules; return k.split('.').reduce((a, b) => a && a[b], o); };
const deal = (p, cx, cy, extra, i) => { ctx.setSeed(4290 + (i || 0));
  const tx = cx * 3, ty = cy * 3;
  F.setup(Object.assign({ kind: 'suburb', district: PL[p].districts[0], cell: { gx: 40 + cx, gy: 40 + cy }, night: false, auto: true, formation: null, deploy: false,
    template: cx === null ? undefined : { id: p, board: 'place_' + p, tx: tx, ty: ty, flip: false, cell: [40 + cx, 40 + cy] } }, extra || {}));
  return F.S; };
const walks = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
  const foe = new Set(S.units.filter(t => t.side !== u.side && F.onField(t)).map(t => t.x + ',' + t.y));
  while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
    if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h) continue; if (foe.has(k)) return true;
    if (!T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
  return false; };
(async () => {
  const t0 = Date.now(), CX = [0, 1, 2, 3, 4, 5, 6], CY = [0, 1, 2, 3, 4];
  const joined = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
    while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
      if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h || !T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
    return seen; };
  const apart = S => { const a = S.units.filter(u => u.side === 'you'), b = S.units.filter(u => u.side !== 'you'); let m = 99; a.forEach(u => b.forEach(v => { m = Math.min(m, Math.max(Math.abs(u.x - v.x), Math.abs(u.y - v.y))); })); return m; };
  const gap = R('deployment.min_gap_between_lines_hexes') + 1;
  const A = { n: 0, k1: 0, rowsOk: 0, worse: 0, cell: 0, usual: 0, east: 0, room: 0, wrong: 0, ahead: 0, west: 0, close: 0, walkOk: 0, bad: [], roomAt: {} };
  PLACES.forEach((p, pi) => { const S0 = deal(p, null, null, {}, pi), d0 = apart(S0);
    CX.forEach(cx => CY.forEach(cy => {
      let S; try { S = deal(p, cx, cy, {}, pi); } catch (e) { A.bad.push(p + ' ' + cx + ',' + cy + ' threw ' + String(e.message).slice(0, 60)); return; }
      A.n++; const B = S.boardDef, TB = G.boards['place_' + p], his = S.units.filter(u => u.side === 'you'), theirs = S.units.filter(u => u.side !== 'you'), C = S.cutStart || {};
      if (B.own === p && B.cut && TB.blocks.every((r, y) => r.every((n, x) => B.blocks[y][x] === n))) A.k1++; else A.bad.push(p + ' ' + cx + ',' + cy + ' not its own board');
      const front = S.cols[0], want = cx * 3 + 2, cm = Math.max(1, Math.min(S.h - 2, cy * 3 + 1));
      /* K2: a man of his as near the cell's middle row as the ground his line stands on allows (a tile's grace) */
      const J = joined(S, his[0]); let open = 99; for (let y = 0; y < S.h; y++) for (let x = front; x >= front - 1; x--) if (J.has(x + ',' + y) && !(F.level(x, y) > 0)) open = Math.min(open, Math.abs(y - cm));
      const near = Math.min(...his.map(u => Math.abs(u.y - cm))); if (near <= open + 1) A.rowsOk++; else A.bad.push(p + ' ' + cx + ',' + cy + ' rows: nearest man ' + near + ' from the cell\'s row, open ground ' + open);
      /* K3 */
      const say = C.stood; if (A[say] !== undefined && typeof A[say] === 'number') A[say]++;
      const right = say === 'usual' ? want < C.usual && front === C.usual : say === 'cell' ? front === want && want >= C.usual && want <= C.max : say === 'east' ? want > C.max && front === C.max : say === 'room' ? front < Math.min(want, C.max) && front >= C.usual : false;
      if (!right) { A.wrong++; A.bad.push(p + ' ' + cx + ',' + cy + ' front ' + front + ' wanted ' + want + ' said ' + say); }
      if (say === 'room') A.roomAt[p] = (A.roomAt[p] || 0) + 1;
      if (his.some(u => u.x > front)) A.ahead++;
      /* K4 */
      if (theirs.some(u => u.x <= front)) { A.west++; A.bad.push(p + ' ' + cx + ',' + cy + ' gap: a man of theirs on or west of his front'); }
      const d = apart(S); if (d < Math.min(d0, gap - 1)) { A.close++; A.bad.push(p + ' ' + cx + ',' + cy + ' gap: the nearest two ' + d + ' apart (no cell: ' + d0 + ')'); }
      if (S.units.every(u => !S.solid[u.y][u.x] && S.terrain[u.y][u.x] !== 'blocked') && S.units.every(u => walks(S, u))) A.walkOk++; else A.bad.push(p + ' ' + cx + ',' + cy + ' walk: a man with no ground or no walk');
    })); });
  const some = rx => A.bad.filter(b => rx.test(b)).slice(0, 3).map(s => '; ' + s).join('');
  check(A.k1 === A.n && A.n === PLACES.length * 35, 'K1', 'THE BOARD IS THE PLACE\'S OWN: ' + A.k1 + ' of ' + A.n + ' hand-overs (' + PLACES.length + ' places, 35 cells each) dealt the place\'s own board block for block, the cell kept on it');
  check(A.rowsOk === A.n, 'K2', 'HIS LINE\'S ROWS ARE THE CELL\'S: on ' + A.rowsOk + ' of ' + A.n + ' a man of his stands as near the cell\'s middle row as the ground his line stands on allows (a tile\'s grace)' + some(/rows/));
  check(A.wrong === 0 && A.cell > A.n * 0.3 && A.ahead === 0, 'K3', 'HIS FRONT IS THE CELL\'S EAST COLUMN wherever both lines have ground: exactly on it for ' + A.cell + ' cells; ' + A.usual + ' cells west of his usual column keep it; ' + A.east + ' too far east stand the farthest the board allows; ' + A.room + ' stepped west until both lines had ground (' + Object.keys(A.roomAt).map(k => k + ' ' + A.roomAt[k]).join(', ') + '); said wrong on ' + A.wrong + '; a man ahead of his front on ' + A.ahead + some(/front/));
  check(A.west === 0 && A.close === 0 && A.walkOk === A.n, 'K4', 'THEIR LINE FACES HIS AND THE GAP HOLDS: a man of theirs on or west of his front on ' + A.west + ' of ' + A.n + '; the nearest two men closer than the gap (or than the place\'s own start with no cell) on ' + A.close + '; both lines on open ground with a walk to each other on ' + A.walkOk + some(/gap|walk/));
  /* K5 */
  { let ended = 0, n = 0, rounds = 0; const cells = [[0, 0], [6, 0], [0, 4], [6, 4], [3, 2]];
    PLACES.forEach((p, pi) => cells.forEach(c => { const S = deal(p, c[0], c[1], {}, pi + 7); n++; let g = 0; while (!S.over && S.round <= 30 && g < 30000) { const u = F.current(); if (!u) break; S.byHand = false; F.aiStep(u); g++; } if (S.over) ended++; rounds += S.round; }));
    check(ended === n && n === PLACES.length * 5, 'K5', 'A FIGHT PLAYS FROM ANY CELL: ' + ended + ' of ' + n + ' fights (the four corner cells and the middle of every place) ended on AUTO inside 30 rounds (' + (rounds / n).toFixed(1) + ' rounds a fight)'); }
  /* K6 */
  { let same = 0, n = 0; PLACES.forEach((p, pi) => { const S = deal(p, null, null, {}, pi), at = S.units.map(u => u.x + ',' + u.y).join(' '), cols = S.cols.join(','), none = !S.cutStart && S.rowMid == null; const S2 = deal(p, null, null, {}, pi); n++;
      if (none && S2.units.map(u => u.x + ',' + u.y).join(' ') === at && S2.cols.join(',') === cols) same++; });
    check(same === n, 'K6', 'NO TEMPLATE, NO CHANGE: ' + same + ' of ' + n + ' places asked for without a cell carry no cell start and no cell row, and deal the same line twice'); }
  /* K7: the memory of his line is read back as the same line (formationNow counts from the row the line was stood on) */
  { const three = [0, 1, 2].map(n => ({ background: 'militia', level: 2, gear: { main: n ? 'shortsword' : 'snub_revolver', off: null } })); let same = 0, n = 0, old = 0; const ex = [];
    PLACES.forEach((p, pi) => [[1, 0], [3, 2], [2, 4]].forEach(c => { const S1 = deal(p, c[0], c[1], { company: three }, pi), P1 = S1.units.filter(u => u.side === 'you').map(u => u.name + '@' + u.x + ',' + u.y).sort().join(' '), M1 = JSON.parse(JSON.stringify(S1.formation)), mid = S1.rowMid, bm = Math.round((S1.h - 1) / 2);
      const S2 = deal(p, c[0], c[1], { company: three, formation: M1 }, pi), P2 = S2.units.filter(u => u.side === 'you').map(u => u.name + '@' + u.x + ',' + u.y).sort().join(' '); n++;
      if (P1 === P2) same++; else if (ex.length < 3) ex.push(p + ' ' + c + ': ' + P1 + ' came back ' + P2);
      if (mid !== bm) old++; }));
    check(n === PLACES.length * 3 && same === n, 'K7', 'THE KEPT LINE COMES BACK THE SAME: a three-man line stood on a cell, kept (rule 110b) and handed to the same cell again stands on the same tiles on ' + same + ' of ' + n + ' (counted from the board\'s middle, the old way, it would come back shifted on the ' + old + ' whose cell row is not the middle)' + ex.map(s => '; ' + s).join('')); }
  /* K8: a place's cell wins over an inside (the tunnels under the wash, the garage and the casino floor at the casinos) */
  { const INS = [].concat((ctx.DB.tunnels && ctx.DB.tunnels.data.districts) || [], (ctx.DB.garage && ctx.DB.garage.data.districts) || [], (ctx.DB.casino && ctx.DB.casino.data.districts) || []);
    let n = 0, own = 0, plain = 0, plainIn = 0, asked = 0; const hit = [];
    PLACES.forEach((p, pi) => PL[p].districts.filter(d => INS.indexOf(d) >= 0).forEach(d => { for (let i = 0; i < 12; i++) { ctx.setSeed(8800 + i * 131 + pi);
        F.setup({ kind: d, district: d, cell: { gx: 30 + i, gy: 50 + pi }, night: false, auto: true, formation: null, deploy: false, template: { id: p, board: 'place_' + p, tx: 6, ty: 6, flip: false, cell: [30 + i, 50 + pi] } });
        n++; if (F.S.boardDef.own === p && !F.S.boardDef.interior && F.S.cutStart) own++; else hit.push(p + '/' + d + ' dealt ' + (F.S.boardDef.interior || F.S.boardDef.name));
        ctx.setSeed(8800 + i * 131 + pi); F.setup({ kind: d, district: d, cell: { gx: 30 + i, gy: 50 + pi }, night: false, auto: true, formation: null, deploy: false }); plain++; if (F.S.boardDef.interior) plainIn++; } }));
    { const d = (ctx.DB.tunnels && ctx.DB.tunnels.data.districts[0]) || null, p = PLACES.filter(q => PL[q].districts.indexOf(d) >= 0)[0];
      if (d && p) { ctx.setSeed(8801); F.setup({ kind: d, district: d, cell: { gx: 30, gy: 50 }, night: false, auto: true, formation: null, deploy: false, inside: 'tunnels', template: { id: p, board: 'place_' + p, tx: 6, ty: 6, flip: false, cell: [30, 50] } }); if (F.S.boardDef.interior === 'tunnels') asked = 1; } }
    check(n > 0 && own === n && plainIn > 0 && asked === 1, 'K8', 'A PLACE\'S CELL WINS OVER AN INSIDE: ' + own + ' of ' + n + ' hand-overs on a place\'s cell in a district that has an inside (the tunnels, the garage, the casino floor) are dealt the place\'s own board; with no cell the same ' + plain + ' deals go inside ' + plainIn + ' times as before; an inside asked for by name on a place\'s cell is dealt (' + asked + ' of 1)' + hit.slice(0, 3).map(s => '; ' + s).join('')); }
  /* the plant: the cell ignored */
  { let off = 0, n = 0; PLACES.forEach((p, pi) => [[6, 0], [0, 4], [5, 4]].forEach(c => { const S = deal(p, c[0], c[1], {}, pi); const keep = S.boardDef.cut; n++;
      /* the old start: the same board stood again with its cell taken off */
      ctx.setSeed(4290 + pi); F.setup({ kind: 'suburb', district: PL[p].districts[0], cell: { gx: 40 + c[0], gy: 40 + c[1] }, night: false, auto: true, formation: null, deploy: false });
      const S2 = F.S, his = S2.units.filter(u => u.side === 'you'), rows = his.map(u => u.y).sort((a, b) => a - b), cellMid = Math.max(1, Math.min(S2.h - 2, c[1] * 3 + 1));
      if (Math.abs((rows[0] + rows[rows.length - 1]) / 2 - cellMid) > 1.5 || S2.cols[0] !== Math.max(S2.cols[0], Math.min(S2.w - 2 - (R('deployment.min_gap_between_lines_hexes') + 1), c[0] * 3 + 2))) off++; }));
    check(off >= n * 0.6, 'Kp', 'planted: the cell ignored (the old start) is caught on ' + off + ' of ' + n + ' corner cells (his line off the cell\'s rows or its column)'); }
  console.log('\nTHE CREW STARTS ON ITS CELL: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
