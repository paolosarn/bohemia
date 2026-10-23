#!/usr/bin/env node
/* THE MAP HANDS THE BOARD (COMBAT [the map hands the board], rule 46a, Paolo 9/29: 'no two combat boards are the same';
   records/BOHEMIA_THE_COMBAT_BOARD_ASSETS_WHAT_WE_HAVE_AND_WHAT_WE_NEED_9_29_26.md). MEASURED BEFORE: the desert (WORLD's open
   ground, 1.5% cover) and the mountain (its boulders, 95.8%) dealt the same scrub boards at 30%, and four grounds (the airport,
   the industrial yards, the park, the solar fields) the same ruin boards; the deal was the clock's, never the place's.
   NOW: the cell's district names the ground and the board kind in WORLD's list (records/target/BOHEMIA_BOARD_KINDS.json), the
   cell seeds the deal, and the cover is fitted into the ground's measured envelope (records/target/BOHEMIA_GROUND_EFFECTS.json).

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. EVERY GROUND ITS OWN COVER: each of WORLD's thirteen grounds deals a board whose share of covered tiles sits inside that
      ground's measured envelope (a point envelope within one tile); the desert under 2%, the mountain over 95%;
   2. NO TWO GROUNDS DEAL THE SAME BOARD: every pair of grounds, on three cells: never the same blocks and cover;
   3. A PLACE IS A PLACE: one cell on one ground deals the same board whatever the fight's dice; five cells of one ground five boards;
   4. THE DISTRICT NAMES THE KIND: the board leads with the kind WORLD's list gives the district;
   5. THE FIGHT'S DICE STAY ITS OWN: two fights on one cell, the same board, their own rolls after it;
   6. THE PLACE'S OWN PIECES: what the fit adds is the lead kind's own (the mountain gets boulders and outcrops, never a car), every
      piece one the ground's art draws, never on a wall, and the field stays one from line to line;
   7. NOTHING HANDED, NOTHING CHANGED: a fight asked for by kind alone deals as it did, no fit;
   8. THE FIGHTS END: twenty fights on the mountain and twenty on the desert, every one to its end.
   THE DOOR (reported, not judged: it is RUN's file): whether the demo's nfOpts hands the fight the district and the cell.
   Run: node gates/the_map_hands_the_board_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB, G = DB.ground;
const env = {}; DB.groundEffects.measured.panels.forEach(p => { env[p.ground] = p.kitEnvelope; });
const byGround = {}; DB.boardKinds.districts.forEach(d => { (byGround[d.ground] = byGround[d.ground] || []).push(d); });
const grounds = Object.keys(byGround);
const deal = (o, seed) => { ctx.setSeed(seed === undefined ? 777 : seed); F.setup(Object.assign({ deploy: false, formation: null, band: ['brigand_thug'] }, o)); return F.S; };
const sig = S => JSON.stringify([S.boardDef.blocks, S.boardDef.cover.map(c => c.piece + '@' + c.x_m.toFixed(2) + ',' + c.y_m.toFixed(2))]);
const share = S => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.cover[y][x]) n++; return n / (S.w * S.h); };

/* 1 */
const rows = [], off = [];
grounds.forEach(g => {
  const S = deal({ district: byGround[g][0].district, cell: { x: 41, y: 17 } }), sh = share(S), e = env[g], tile = 1 / (S.w * S.h);
  rows.push(g + ' ' + (sh * 100).toFixed(1) + '% [' + (e[0] * 100).toFixed(1) + '-' + (e[1] * 100).toFixed(1) + ']');
  if (!(sh >= e[0] - tile - 1e-9 && sh <= e[1] + tile + 1e-9)) off.push(g);
});
const desert = share(deal({ district: 'desert', cell: { x: 41, y: 17 } })), mountain = share(deal({ district: 'mountain', cell: { x: 41, y: 17 } }));
leg(off.length === 0 && grounds.length === 13 && desert < 0.02 && mountain > 0.95,
  '*** EVERY GROUND ITS OWN COVER ***: each of the thirteen inside its measured envelope; the desert open, the mountain boulders',
  rows.join('; ') + (off.length ? '; OUTSIDE: ' + off.join(', ') : ''));

/* 2 */
let pairs = 0, same = [];
[{ x: 41, y: 17 }, { gx: 3, gy: 60 }, [120, 8]].forEach(cell => {
  const s = {}; grounds.forEach(g => { s[g] = sig(deal({ district: byGround[g][0].district, cell: cell })); });
  grounds.forEach((a, i) => grounds.slice(i + 1).forEach(b => { pairs++; if (s[a] === s[b]) same.push(a + '=' + b); }));
});
leg(same.length === 0 && pairs === 78 * 3, '*** NO TWO GROUNDS DEAL THE SAME BOARD ***: every pair of grounds on three cells (the door\'s three shapes of a cell)',
  pairs + ' pairs, ' + same.length + ' the same' + (same.length ? ': ' + same.slice(0, 4).join(' ') : ''));

/* 3 */
const one = sig(deal({ district: 'chapel', cell: { x: 9, y: 9 } }, 1)), two = sig(deal({ district: 'chapel', cell: { x: 9, y: 9 } }, 999999));
const five = new Set([0, 1, 2, 3, 4].map(i => sig(deal({ district: 'chapel', cell: { x: 9 + i, y: 9 } }))));
leg(one === two && five.size === 5, '*** A PLACE IS A PLACE ***: one cell deals its own board whatever the dice; five cells five boards', 'the same cell twice: ' + (one === two ? 'the same board' : 'two boards') + '; five cells: ' + five.size + ' boards');

/* 4 */
const leads = [];
['desert', 'casino', 'freeway', 'landfill', 'trailer', 'basin'].forEach(d => {
  const want = DB.boardKinds.districts.filter(r => r.district === d)[0].boardKind, S = deal({ district: d, cell: { x: 5, y: 5 } }), al = (DB.ours.board_mix.value.aliases || {})[want] || [want];
  leads.push({ d, want, got: S.boardDef.lead, kinds: S.boardDef.kinds, ok: al.indexOf(S.boardDef.lead) >= 0 || S.boardDef.lead === want });
});
leg(leads.every(l => l.ok), '*** THE DISTRICT NAMES THE KIND ***: the board leads with the kind WORLD\'s list gives the district', leads.map(l => l.d + ' ' + l.want + '->' + l.got).join(', '));

/* 5 */
deal({ district: 'chapel', cell: { x: 9, y: 9 } }, 1); const b1 = sig(F.S);
deal({ district: 'chapel', cell: { x: 9, y: 9 } }, 2); const b2 = sig(F.S);
/* the dice after the deal: the first five rolls each fight makes */
const rolls = seed => { deal({ district: 'chapel', cell: { x: 9, y: 9 } }, seed); const u = F.S.units.filter(v => v.side === 'you')[0], t = F.S.units.filter(v => v.side === 'them')[0]; return [0, 1, 2, 3, 4].map(() => F.resolveAttack(u, t, null).roll).join(','); };
const ra = rolls(1), rb = rolls(2);
leg(b1 === b2 && ra !== rb, '*** THE FIGHT\'S DICE STAY ITS OWN ***: two fights on one cell deal the same board and roll their own blows', 'boards ' + (b1 === b2 ? 'the same' : 'differ') + '; rolls ' + ra + ' | ' + rb);

/* 6 */
const M = deal({ district: 'mountain', cell: { x: 41, y: 17 } }), added = M.boardDef.cover.filter(c => c.added), kinds = {};
added.forEach(c => { const k = c.piece.split('_')[0]; kinds[k] = (kinds[k] || 0) + 1; });
const drawn = M.boardDef.cover.every(c => !!(G.cover[c.piece] || G.cover_extra[c.piece]));
const onWall = added.filter(c => F.rowAt(Math.floor(c.x_m / G.tile_metres), Math.floor(c.y_m / G.tile_metres)) === 'obstacles').length;
const cols = DB.ours.start_cols.value;
const reachable = (() => { const S = M, seen = {}, q = []; for (let y = 0; y < S.h; y++) if (F._t.passable(cols[0], y)) { seen[y * S.w + cols[0]] = 1; q.push([cols[0], y]); }
  while (q.length) { const [x, y] = q.shift(); if (x === cols[1]) return true; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(dd => { const nx = x + dd[0], ny = y + dd[1]; if (F._t.passable(nx, ny) && !seen[ny * S.w + nx]) { seen[ny * S.w + nx] = 1; q.push([nx, ny]); } }); } return false; })();
leg(added.length > 0 && Object.keys(kinds).every(k => k === 'rock' || k === 'outcrop') && drawn && onWall === 0 && reachable,
  '*** THE PLACE\'S OWN PIECES ***: the mountain\'s added cover is its own boulders and outcrops, every piece drawn by the ground\'s art, none on a wall, the field still one',
  added.length + ' added: ' + JSON.stringify(kinds) + '; all drawn: ' + drawn + '; on a wall: ' + onWall + '; line to line: ' + reachable);

/* 7 */
const plain = deal({ kind: 'scrub' }, 4242);
leg(!plain.boardDef.groundFit && !plain.boardDef.cover.some(c => c.added), '*** NOTHING HANDED, NOTHING CHANGED ***: a fight asked for by kind alone deals as it did, no fit', 'fit: ' + JSON.stringify(plain.boardDef.groundFit || null));

/* 8 */
const ends = {};
['mountain', 'desert'].forEach(d => { const r = { won: 0, lost: 0, stuck: 0 };
  for (let s = 1; s <= 20; s++) { deal({ district: d, cell: { x: s, y: 3 }, auto: true, party: { count: 3, days: 1, difficulty: 0, faction: 'brigands' } }, s * 101);
    let n = 0; while (!F.S.over && n < 4000) { const u = F.current(); if (!u) break; F.aiStep(u); F.S.events = []; n++; }
    if (!F.S.over) r.stuck++; else if (F.S.result === 'won') r.won++; else r.lost++; }
  ends[d] = r; });
leg(ends.mountain.stuck === 0 && ends.desert.stuck === 0, '*** THE FIGHTS END ***: twenty on the mountain, twenty on the desert, every one to its end', JSON.stringify(ends));

/* the door, reported */
let door = 'not read';
try { const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8'); const m = demo.match(/function nfOpts\(d\)\{[\s\S]*?\n\}/); door = m && /district/.test(m[0].replace(/nfKind\(d && d\.district\)/, '')) && /cell/.test(m[0]) ? 'hands the district and the cell' : 'does not hand the district and the cell yet (RUN: o.district = d.district; o.cell = d.at in nfOpts)'; } catch (_e) {}
console.log('  note THE DOOR: the demo ' + door);
console.log('=== THE MAP HANDS THE BOARD: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
