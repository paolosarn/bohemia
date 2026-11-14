#!/usr/bin/env node
/* A PLAIN CELL IS NOT THE PLACE (COMBAT THREE 11/14/26; VAMILY rules 429(a)(c)(g) and 447; ask rows 504, 507 and 610; the coordinator's
   round: 'the fights on map cells no place stands on: a board cut from that cell's ground and zone, never the same suburb for
   everything').
   MEASURED BEFORE (main 843a15e1): WORLD THIRTEEN stands the 15 place boards on the map as places and a place's cell deals that
   place's own board (11/11h, 11/11z). But every OTHER cell of a place's districts dealt the place's board too, a shuffle of its one
   or two blocks: 30 of 30 plain suburb cells the same yards (yards.1 once, yards.2 eleven times), and the same for the 14 others.
   THE LAW NOW: a place's board is fought where the place stands (opts.template). A cell the map hands over with no place under it
   deals from that cell's own ground and zone: the district's block kinds in WORLD's list (BohemiaFightKinds.families, the one
   table), the cell's own dice. On the page the fight knows a plain cell by the map (it stands places, none under this cell);
   opts.place false asks for it here.
   THE LEGS (the live fight's own deal, headless):
     P1  NOT THE PLACE'S BOARD: for every district of the 15 places, a plain cell is dealt no place's own board
     P2  FROM ITS OWN ZONE: every block of a plain cell's board is of a kind WORLD's table names for that district
     P3  NEVER THE SAME FOR EVERYTHING: 30 plain cells of the suburbs are at least five different boards (they were one); every
         district of a place with two block kinds or more in the table deals at least two different boards over 12 cells
     P4  THE PLACE STILL WHERE IT STANDS: the same district with a place's cell handed (opts.template) is dealt the place's own board
     P5  A FIGHT PLAYS: both lines stand on ground with a walk to each other and a fight on AUTO ends, a plain cell of every place's
         first district
     P6  THE SAME CELL, THE SAME BOARD (ask row 610's question, 'if the re-deal sits in the board's hand-over': it does not): a
         cell fought twice deals the same blocks in the same places
     planted: the plain cell not known (place true, the old deal): P1 and P3 read red
   Run: node gates/a_plain_cell_is_not_the_place_gate.js      (about 40 seconds) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const F = ctx.FIGHT, FK = ctx.BohemiaFightKinds, PL = ctx.DB.ours.place_boards.value.places, G = ctx.DB.ground;
const PLACES = Object.keys(PL).filter(p => PL[p].built && G.boards['place_' + p]);
const kindOf = n => String(n).split('|')[0].split('.')[0];
const deal = (d, i, extra) => { ctx.setSeed(6100 + i);
  F.setup(Object.assign({ district: d, cell: { gx: 11 + i * 7, gy: 23 + i * 5 }, night: false, auto: true, formation: null, deploy: false, inside: false, place: false }, extra || {})); return F.S; };
const sig = S => S.boardDef.blocks.map(r => r.join(',')).join('/');
const walks = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
  const foe = new Set(S.units.filter(t => t.side !== u.side && F.onField(t)).map(t => t.x + ',' + t.y));
  while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
    if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h) continue; if (foe.has(k)) return true;
    if (!T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
  return false; };
(async () => {
  const t0 = Date.now(), DIST = []; PLACES.forEach(p => PL[p].districts.forEach(d => DIST.push({ p, d })));
  const read = (place) => { const o = { n: 0, own: 0, offZone: [], few: [], boards: {} };
    DIST.forEach(({ p, d }) => { const fam = FK.families(d) || [], seen = new Set();
      for (let i = 0; i < 12; i++) { const S = deal(d, i, place ? { place: true } : {}); o.n++;
        if (S.boardDef.own) o.own++;
        [].concat.apply([], S.boardDef.blocks).forEach(n => { if (fam.indexOf(kindOf(n)) < 0 && o.offZone.indexOf(d + ': ' + kindOf(n)) < 0) o.offZone.push(d + ': ' + kindOf(n)); });
        seen.add(sig(S)); }
      o.boards[d] = seen.size; if (fam.filter(k => Object.keys(G.blocks).some(n => kindOf(n) === k)).length >= 2 && seen.size < 2) o.few.push(d + ' ' + seen.size); });
    return o; };
  const A = read(false);
  check(A.own === 0 && A.n === DIST.length * 12, 'P1', 'NOT THE PLACE\'S BOARD: ' + (A.n - A.own) + ' of ' + A.n + ' plain cells (' + DIST.length + ' districts of the ' + PLACES.length + ' places, 12 cells each) are dealt no place\'s own board');
  check(A.offZone.length === 0, 'P2', 'FROM ITS OWN ZONE: every block of those ' + A.n + ' boards is of a kind WORLD\'s table names for its district' + (A.offZone.length ? '; NOT: ' + A.offZone.slice(0, 5).join(', ') : ''));
  { const sub = new Set(), was = new Set(); for (let i = 0; i < 30; i++) { sub.add(sig(deal('suburb', 40 + i))); } for (let i = 0; i < 30; i++) { was.add(kindSig(deal('suburb', 40 + i, { place: true }))); }
    function kindSig(S) { return [].concat.apply([], S.boardDef.blocks).map(n => String(n).split('|')[0]).sort().join(','); }
    check(sub.size >= 5 && A.few.length === 0, 'P3', 'NEVER THE SAME FOR EVERYTHING: 30 plain cells of the suburbs are ' + sub.size + ' different boards (as the place\'s board they were ' + was.size + ' set of blocks); districts dealing one board only over 12 cells: ' + (A.few.length ? A.few.join(', ') : 'none') + ' (the fewest ' + Math.min.apply(null, Object.values(A.boards)) + ')'); }
  { let n = 0, ok = 0; PLACES.forEach((p, i) => { const d = PL[p].districts[0], S = deal(d, i, { place: undefined, template: { id: p, board: 'place_' + p, tx: 6, ty: 6, flip: false, cell: [30, 30] } }); n++; if (S.boardDef.own === p && S.cutStart) ok++; });
    check(ok === n, 'P4', 'THE PLACE STILL WHERE IT STANDS: ' + ok + ' of ' + n + ' places handed with their cell are dealt their own board'); }
  { let n = 0, stood = 0, ended = 0, rounds = 0; PLACES.forEach((p, i) => { const S = deal(PL[p].districts[0], 70 + i); n++;
      if (S.units.every(u => !S.solid[u.y][u.x]) && S.units.every(u => walks(S, u))) stood++;
      let g = 0; while (!S.over && S.round <= 30 && g < 30000) { const u = F.current(); if (!u) break; S.byHand = false; F.aiStep(u); g++; } if (S.over) ended++; rounds += S.round; });
    check(stood === n && ended === n, 'P5', 'A FIGHT PLAYS: on ' + stood + ' of ' + n + ' plain cells (one a place) both lines stand on ground with a walk to each other; ' + ended + ' fights on AUTO ended inside 30 rounds (' + (rounds / n).toFixed(1) + ' a fight)'); }
  { let n = 0, same = 0; DIST.forEach(({ d }, i) => { const a = sig(deal(d, 90 + i)), b = sig(deal(d, 90 + i)); n++; if (a === b) same++; });
    check(same === n, 'P6', 'THE SAME CELL, THE SAME BOARD: ' + same + ' of ' + n + ' cells fought twice deal the same blocks in the same places (the fight\'s board never re-deals between two visits)'); }
  { const P = read(true); check(P.own > P.n * 0.9, 'Pp', 'planted: the plain cell not known (the old deal), ' + P.own + ' of ' + P.n + ' are a place\'s own board again'); }
  console.log('\nA PLAIN CELL IS NOT THE PLACE: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
