/* THE TERRITORY LEDGER GATE
   FACTIONS lane, VAMILY row [territory ledger], 9/24/26.

   THE ROW: turfGrid() is keyed on seed and map size and nothing else, the save
   never mentions turf, and what the player took is written nowhere. Rule 31
   derives act 2's map from act 1's ledger and there is no ledger.

   THE ONE THIS GATE EXISTS FOR, above all the others: THE EMPTY LEDGER IS A
   NO-OP. Wiring the read-through into turfAt must change nothing whatsoever
   until somebody actually takes ground, and that is held here against the REAL
   derived grid off the real overmap, cell by cell, not against a stub. */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const L = require(path.join(ROOT, 'engine/bohemia_turfledger.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')));
};

/* ---- 1. the shape, taken from bohemia_century and not reinvented ---------- */
{
  const r = L.make();
  ok('a new record is act 1 with nothing in it', r.act === 1 && r.entries.length === 0);
  ok('the act clamps to his three generations',
     L.clampAct(0) === 1 && L.clampAct(9) === 3 && L.clampAct(2) === 2);

  L.setAct(r, 3);
  ok('the act moves forward', r.act === 3);
  L.setAct(r, 1);
  ok('AND IT REFUSES TO RUN BACKWARDS, which is the century module\'s own rule',
     r.act === 3, 'act is ' + r.act);
}

/* ---- 2. an entry says who held it before, and is refused when it is not a change */
{
  const r = L.make();
  ok('a cell with no taker is refused', L.took(r, { x: 5, y: 5 }).applied === false);
  ok('a record with no cell is refused', L.took(r, { to: 'Mob' }).applied === false);

  const a = L.took(r, { x: 5, y: 5, from: 'Mob', to: 'Reds', day: 12, why: 'gate' });
  ok('a real change is recorded', a.applied === true);
  ok('and it carries the act, the day and who held it before',
     a.entry.act === 1 && a.entry.day === 12 && a.entry.from === 'Mob');

  const b = L.took(r, { x: 6, y: 6, from: 'Mob', to: 'Mob' });
  ok('A CHANGE THAT CHANGES NOTHING IS REFUSED', b.applied === false && b.reason === 'NOT_A_CHANGE');
  ok('and it is not in the record', r.entries.length === 1);

  /* null from is a real answer, not a missing one */
  const c = L.took(r, { x: 7, y: 7, from: null, to: 'Church' });
  ok('unheld ground can be taken and the null is kept',
     c.applied === true && c.entry.from === null);
}

/* ---- 3. who holds it, and the future has not happened yet ---------------- */
{
  const r = L.make();
  L.took(r, { x: 3, y: 3, from: 'Mob', to: 'Reds' });
  ok('the record answers for a cell it knows', L.heldBy(r, 3, 3) === 'Reds');
  ok('and says nothing about a cell it does not', L.heldBy(r, 4, 4) === null);

  L.setAct(r, 2);
  L.took(r, { x: 3, y: 3, from: 'Reds', to: 'Blues' });
  ok('the newest entry wins', L.heldBy(r, 3, 3) === 'Blues');
  ok('READ AT ACT 1 AND THE ACT-2 CHANGE HAS NOT HAPPENED YET',
     L.heldBy(r, 3, 3, 1) === 'Reds', 'got ' + L.heldBy(r, 3, 3, 1));
}

/* ---- 4. *** THE EMPTY LEDGER IS A NO-OP, AGAINST THE REAL VALLEY *** ------ */
{
  const m = OM.buildOvermap(12345);
  const seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
  const grid = T.turf(m, CE.cat, seats);
  const empty = L.make();

  let checked = 0, differed = 0;
  for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
    const base = grid.at(x, y);
    const through = L.holderThrough(empty, grid, x, y);
    checked++;
    const bf = base && base.faction, tf = through && through.faction;
    const bt = base && base.tier, tt = through && through.tier;
    if (bf !== tf || bt !== tt) differed++;
  }
  ok('THE READ-THROUGH ON AN EMPTY LEDGER IS THE DERIVED GRID, EVERY CELL OF THE '
     + 'REAL VALLEY (' + checked + ' cells, ' + differed + ' different)',
     checked > 9000 && differed === 0, differed + ' cells differed');

  /* and the negative control: one entry must move exactly one cell and no other */
  const one = L.make();
  const target = { x: 48, y: 48 };
  const was = grid.at(target.x, target.y);
  L.took(one, { x: target.x, y: target.y, from: was && was.faction, to: 'Volunteers' });

  let moved = 0, movedAt = null;
  for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
    const base = grid.at(x, y), through = L.holderThrough(one, grid, x, y);
    if ((base && base.faction) !== (through && through.faction)) { moved++; movedAt = x + ',' + y; }
  }
  ok('ONE ENTRY MOVES EXACTLY ONE CELL AND NOT THE VALLEY',
     moved === 1 && movedAt === target.x + ',' + target.y, moved + ' cells moved');
  ok('and that cell now answers with the taker',
     L.holderThrough(one, grid, target.x, target.y).faction === 'Volunteers');
  /* THE TIER IS CHECKED ON A CELL THAT IS NOT A FORTRESS. 48,48 is Mob fortress
     ground, so an earlier cut of this check passed a mutation that hardcoded
     'fortress' -- it agreed with its own bug by coincidence of the cell chosen.
     Every tier the valley actually carries is asserted instead. */
  const tiersSeen = {};
  for (let y = 0; y < m.n && Object.keys(tiersSeen).length < 3; y++)
    for (let x = 0; x < m.n; x++) {
      const c = grid.at(x, y);
      if (c && c.tier && !tiersSeen[c.tier]) tiersSeen[c.tier] = { x, y, was: c.tier };
    }
  let tierHeld = 0, tierTot = 0;
  for (const t of Object.keys(tiersSeen)) {
    const cell = tiersSeen[t];
    const rec = L.make();
    L.took(rec, { x: cell.x, y: cell.y, from: grid.at(cell.x, cell.y).faction, to: 'Volunteers' });
    const got = L.holderThrough(rec, grid, cell.x, cell.y);
    tierTot++;
    if (got.tier === cell.was && got.faction === 'Volunteers') tierHeld++;
  }
  ok('THE TIER STAYS THE GROUND\'S, NOT THE TAKER\'S, on every tier the valley has ('
     + Object.keys(tiersSeen).join('/') + ')',
     tierTot >= 2 && tierHeld === tierTot, tierHeld + ' of ' + tierTot);
}

/* ---- 5. what changed, for rule 31's derive ------------------------------- */
{
  const r = L.make();
  L.took(r, { x: 1, y: 1, from: 'Mob', to: 'Reds' });
  L.took(r, { x: 2, y: 2, from: 'Mob', to: 'Reds' });
  L.took(r, { x: 1, y: 1, from: 'Reds', to: 'Blues' });   /* same cell again */

  const ch = L.changedIn(r);
  ok('a cell that changed twice is listed once, at its newest', ch.length === 2
     && ch.filter(c => c.x === 1 && c.y === 1)[0].to === 'Blues');
  ok('AND ITS `from` IS WHO HAD IT BEFORE ANY OF THIS, not the middleman',
     ch.filter(c => c.x === 1 && c.y === 1)[0].from === 'Mob',
     'from is ' + ch.filter(c => c.x === 1 && c.y === 1)[0].from);

  const net = L.netFor(r);
  ok('the net is a count against the ground underneath, and it balances',
     net.Mob === -2 && net.Reds === 1 && net.Blues === 1 && net.Reds !== 0,
     JSON.stringify(net));

  /* A CELL HANDED BACK is history, but it is not a change to report. */
  const back = L.make();
  L.took(back, { x: 8, y: 8, from: 'Mob', to: 'Reds' });
  L.took(back, { x: 8, y: 8, from: 'Reds', to: 'Mob' });
  ok('a cell taken and handed back is not reported as changed',
     L.changedIn(back).length === 0, JSON.stringify(L.changedIn(back)));
  ok('and the net of that is empty, not two zeroes',
     Object.keys(L.netFor(back)).length === 0, JSON.stringify(L.netFor(back)));
  ok('but the record still holds both entries, because the history happened',
     back.entries.length === 2);
}

/* ---- 6. the save, and an older save is a playable save ------------------- */
{
  const r = L.make();
  L.setAct(r, 2);
  L.took(r, { x: 9, y: 9, from: 'Cartel', to: 'Church', day: 40 });
  const blob = JSON.parse(JSON.stringify(L.toJSON(r)));
  const back = L.load(blob);
  ok('a record survives a round trip through the save',
     back.act === 2 && back.entries.length === 1 && back.heldByCheck === undefined
     && L.heldBy(back, 9, 9) === 'Church');

  ok('A BLOB THAT PREDATES THIS FILE LOADS AS ACT 1 WITH NOTHING IN IT (rule 32b)',
     L.load(null).act === 1 && L.load(null).entries.length === 0
     && L.load({}).entries.length === 0);

  const dirty = L.load({ act: 2, entries: [ { x: 1, y: 1, to: 'Mob' }, null,
                                            { x: 2 }, { y: 3, to: 'Reds' },
                                            { x: 4, y: 4, to: 'Blues' } ] });
  ok('debris in a blob is skipped and the real rows are kept',
     dirty.entries.length === 2, dirty.entries.length + ' kept');
}

/* ---- 7. the measurement the row is actually about ------------------------ */
{
  const m = OM.buildOvermap(12345);
  const s1 = T.derive(G, T.districtsOf(m, CE.cat), 1);
  const g1 = T.turf(m, CE.cat, s1);
  const g1again = T.turf(m, CE.cat, T.derive(G, T.districtsOf(m, CE.cat), 1));
  let same = 0, tot = 0;
  for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
    const a = g1.at(x, y), b = g1again.at(x, y);
    tot++; if ((a && a.faction) === (b && b.faction)) same++;
  }
  ok('TERRITORY IS A PURE FUNCTION OF THE SEED: two builds agree on every cell, '
     + 'so nothing a player does is in there (' + same + ' of ' + tot + ')',
     same === tot);
  ok('and HOLDS, the only override the towns module has, is empty',
     Object.keys(T.HOLDS || {}).length === 0,
     Object.keys(T.HOLDS || {}).length + ' overrides');
}

console.log('THE TERRITORY LEDGER GATE: ' + pass + ' ok, ' + fail + ' failed'
          + '  (the empty ledger is a no-op - one entry moves one cell - the act '
          + 'never runs backwards - an older save is a playable save)');
process.exit(fail ? 1 : 0);
