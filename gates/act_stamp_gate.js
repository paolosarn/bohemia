#!/usr/bin/env node
/* BOHEMIA — ACT STAMP GATE (9/24/26, WORLD lane, row [act stamp])
 *
 * THE ROW (coordinator 9/24, off this lane's own caaaa26): three of the four
 * ledgers rule 31's derive reads cannot say which act they mean. The purse saved
 * {id, day, entries} with NO ACT; the treasuries (bohemia_pockets) had NO SAVE
 * AND NO LOAD AT ALL, so who held the valley's money was gone every reload.
 *
 * BOTH HALVES ARE BUILT AND THIS GATE HOLDS THEM.
 *
 *  A  THE ACT IS ON THE ENTRY, NOT ON A SUMMARY. Same reason the balance is a
 *     sum and not a field: entries are the truth and a total that can drift from
 *     the events behind it is the bug this file was written to avoid. Stamped in
 *     _post, the one private writer, and read off the purse AT THE TIME OF THE
 *     MOVEMENT so a later re-ruling cannot change hands in the past.
 *
 *  B  AN OLDER SAVE IS A PLAYABLE SAVE. A blob written before 9/24 has no act on
 *     it or on its entries and every one reads as ACT 1 -- not a fudge, his rule
 *     32(b): the game starts in the ruin and act 1 is the floor, so money that
 *     existed before anybody counted acts was act-1 money.
 *
 *  C  *** THE TREASURIES SURVIVE A RELOAD AND CANNOT MINT. *** I left the save
 *     off on 9/14 and wrote down why. That reason is now the RULE rather than the
 *     excuse: load() compares what the blob says the supply was against what the
 *     restored book is worth and REFUSES rather than quietly minting or burning.
 *
 *  D  *** AND MEASURING IT FOUND A BIGGER MINT THAN THE ONE I NAMED. *** STOCKED
 *     is the boolean guarding the opening stock -- one battery per head, his 9/16
 *     ruling -- and its own comment says "an opening stock that can be re-run is a
 *     mint with a polite name". Save the treasuries without it and every reload
 *     runs it again over the restored one. MEASURED: the valley opens with 80,
 *     and with the flag dropped a reload leaves 160. The whole valley, twice.
 *
 *  E  THE PLAYER IS NOT IN THIS BOOK'S SAVE, because the walked city already
 *     saves his purse in its own slot and two copies of one balance is exactly
 *     what adopt() exists to prevent.
 *
 *  F  RULE 22 / 29: the cook is a thing drawn.
 *
 *   node gates/act_stamp_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const P = R('engine/bohemia_purse.js');
const PK = R('engine/bohemia_pockets.js');
const C = P.CURRENCIES[0];

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

/* ---- A. THE ACT IS ON EVERY ENTRY --------------------------------------- */
section('A every entry carries the act it happened in', () => {
  const p = P.create({ id: 'x' });
  P.credit(p, C, 3, 'a day on a live wire');
  P.setAct(p, 2);
  P.credit(p, C, 5, 'act two work');
  P.debit(p, C, 1, 'rice');

  console.log('    [measured] act1 ' + P.balanceIn(p, C, 1) + '  act2 ' + P.balanceIn(p, C, 2)
    + '  through act2 ' + P.through(p, C, 2) + '  total ' + P.balance(p, C));

  ok('*** THE PURSE CAN NOW SAY WHAT EACH ACT DID ***',
     P.balanceIn(p, C, 1) === 3 && P.balanceIn(p, C, 2) === 4);
  ok('and what the acts up to here left, which is what rule 31 asks',
     P.through(p, C, 2) === 7 && P.through(p, C, 1) === 3);
  ok('the two agree with the plain balance, so nothing can drift',
     P.balance(p, C) === P.through(p, C, P.ACT_MAX));
  ok('every entry really carries one', p.entries.every(e => e.act >= 1 && e.act <= 3));

  /* IT IS STAMPED IN ONE PLACE, AND THE FIRST VERSION OF THIS CHECK COULD NOT
     TELL WHERE. It counted `act: clampAct(purse.act` across the whole file and
     found two -- the ENTRY stamp in _post, and the PURSE-LEVEL act that save()
     writes into the blob. Those are different facts and only the first one is
     what "one writer" means. Slice out _post and count inside it. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8');
  const postAt = src.indexOf('function _post(');
  const post = src.slice(postAt, src.indexOf('\n  }', postAt));
  ok('*** THE ENTRY IS STAMPED IN ONE PLACE, inside _post, the only writer ***',
     postAt > 0 && (post.match(/act: clampAct\(purse\.act/g) || []).length === 1,
     'a second stamp site inside the writer is a second truth');
  ok('and no other function builds an entry with an act on it',
     (src.replace(post, '').match(/act: clampAct\(purse\.act[\s\S]{0,60}seq:/g) || []).length === 0);
  ok('and it cannot run backwards (a ledger that reverses is not a memory)',
     (P.setAct(p, 1), p.act === 2));
  ok('the three acts are three', P.ACT_MIN === 1 && P.ACT_MAX === 3);

  const table = P.acts(p, C);
  ok('and one row per act, for the derive and for a surface',
     table.length === 3 && table[0].moved === 3 && table[2].lived === false);
});

/* ---- B. AN OLDER SAVE IS A PLAYABLE SAVE -------------------------------- */
section('B a save written before this round still works', () => {
  const old = P.load({ id: 'x', day: 0, entries: [
    { currency: C, amount: 9, kind: 'source', reason: 'a save written before 9/24', day: 0, seq: 0 }] });
  ok('*** IT LOADS, AND IT IS WORTH WHAT IT WAS WORTH ***', P.balance(old, C) === 9);
  ok('and every unstamped entry reads as ACT 1, which is rule 32(b) and not a fudge',
     old.entries[0].act === 1);
  ok('a broken blob is an empty purse and never a crash',
     P.balance(P.load(null), C) === 0 &&
     P.balance(P.load({ entries: [null, 7, { nonsense: true }] }), C) === 0);

  /* and the round trip is lossless, act and all */
  const p = P.create({ id: 'y' });
  P.credit(p, C, 4, 'one'); P.setAct(p, 3); P.credit(p, C, 6, 'two');
  const back = P.load(P.save(p));
  ok('a save and a load loses nothing, act and all',
     P.balance(back, C) === 10 && P.balanceIn(back, C, 1) === 4 &&
     P.balanceIn(back, C, 3) === 6 && back.act === 3);
});

/* ---- C. THE TREASURIES SURVIVE A RELOAD AND CANNOT MINT ----------------- */
section('C the treasuries survive a reload', () => {
  PK.reset();
  P.credit(PK.of('Mob'), C, 7, 'a day on a live wire');
  P.credit(PK.of('Church'), C, 3, 'a day on a live wire');
  const before = PK.supply(C).total;
  const blob = PK.save();

  PK.reset();
  console.log('    [measured] the hole as it was: a reload left ' + PK.supply(C).total
    + ' of ' + before + ' and ' + PK.holders().length + ' holders');
  ok('*** AND THAT REALLY WAS THE HOLE: a reload emptied the book ***',
     PK.supply(C).total === 0 && PK.holders().length === 0);

  const r = PK.load(blob);
  ok('*** NOW IT COMES BACK WHOLE ***',
     r.applied && PK.supply(C).total === before && PK.holders().length === 2, JSON.stringify(r));
  ok('and every holder is worth what they were',
     PK.worth('Mob', C) === 7 && PK.worth('Church', C) === 3);

  /* THE REFUSAL. This is the 9/14 reason turned into the rule. */
  const tampered = JSON.parse(JSON.stringify(blob));
  tampered.purses.Mob.entries.push({ currency: C, amount: 100, kind: 'source', reason: 'minted', day: 0, act: 1, seq: 9 });
  const bad = PK.load(tampered);
  ok('*** A BLOB THAT WOULD MINT IS REFUSED BY NAME ***',
     bad.applied === false && bad.reason === 'SUPPLY_WOULD_CHANGE', JSON.stringify(bad));
  ok('and the book it refused is UNCHANGED, not half-applied',
     PK.supply(C).total === before);
  ok('a blob that would BURN is refused the same way', (() => {
    const t2 = JSON.parse(JSON.stringify(blob));
    t2.purses.Mob.entries = [];
    const r2 = PK.load(t2);
    return r2.applied === false && r2.reason === 'SUPPLY_WOULD_CHANGE';
  })());
  ok('nothing to load is refused by name, never silently', PK.load(null).reason === 'NOTHING_TO_LOAD');
});

/* ---- D. *** AND THE OPENING STOCK STAYS SPENT *** ----------------------- */
section('D the whole valley cannot be minted twice', () => {
  const tally = { Mob: 40, Church: 25, Cartel: 15 };
  PK.reset();
  PK.stock(tally, C, 0);
  const opened = PK.supply(C).total;
  const blob = PK.save();
  console.log('    [measured] the valley opens with ' + opened + ' (his 9/16 ruling, one per head)');
  ok('the opening stock ran', opened === 80);

  PK.reset(); PK.load(blob);
  const again = PK.stock(tally, C, 0);
  ok('*** A RELOAD CANNOT RUN THE OPENING STOCK AGAIN ***',
     again.applied === false && again.reason === 'ALREADY_STOCKED', JSON.stringify(again));
  ok('so the supply is what it was', PK.supply(C).total === opened);

  /* and the counterfactual, measured rather than claimed */
  PK.reset();
  const noflag = JSON.parse(JSON.stringify(blob)); noflag.stocked = false;
  PK.load(noflag); PK.stock(tally, C, 0);
  const doubled = PK.supply(C).total;
  console.log('    [measured] with STOCKED dropped from the save the reload leaves ' + doubled);
  ok('*** AND WITHOUT THE FLAG IT REALLY IS THE WHOLE VALLEY TWICE ***',
     doubled === opened * 2, doubled + ' against ' + opened);
  PK.reset();
});

/* ---- E. THE PLAYER IS NOT IN THIS BOOK'S SAVE --------------------------- */
section('E one player balance, not two', () => {
  PK.reset();
  const mine = P.create({ id: PK.PLAYER });
  P.credit(mine, C, 12, 'a day on a live wire');
  PK.adopt(mine);
  P.credit(PK.of('Mob'), C, 2, 'rent');
  const blob = PK.save();
  ok('*** THE PLAYER IS ADOPTED INTO THE BOOK ***', PK.has(PK.PLAYER));
  ok('*** AND DELIBERATELY LEFT OUT OF ITS SAVE, because the walked city already'
   + ' saves his purse and two copies of one balance is what adopt() prevents ***',
     !blob.purses[PK.PLAYER] && !!blob.purses.Mob);
  const back = PK.load(blob);
  ok('so a load restores the treasuries and does not invent a second player',
     back.applied && !PK.has(PK.PLAYER) && PK.worth('Mob', C) === 2);
  PK.reset();
});

/* ---- F. RULE 22 / 29: THE COOK IS A THING DRAWN ------------------------- */
section('F the cook is a thing drawn', () => {
  const png = path.join(ROOT, 'slices/vote/WORLD_THE_CORNER_RECLAIMED.png');
  ok('the picture exists', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a real PNG', b.length > 1000 && b[0] === 0x89 && b[1] === 0x50, b.length + ' bytes');
  }
  const bankPath = path.join(ROOT, 'banks/BOHEMIA_THE_CORNER_RECLAIMED_9_24_26.txt');
  ok('with a bank behind it that parses', fs.existsSync(bankPath));
  if (!fs.existsSync(bankPath)) return;
  const doc = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  ok('it says which item it redoes and quotes the words that killed it',
     doc.redo_of === 'world-the-same-corner-9-23' && /future gets better/i.test(doc.his_words || ''));
  ok('*** RULE 32(b) MADE MECHANICAL: reclaim ADDED and took nothing away ***',
     doc.reclaimShare >= 8 && doc.reclaimShare <= 45, doc.reclaimShare + '%');
  ok('and the one wrong thing survives into the better future, on purpose',
     doc.wrongThingKept > 0);

  /* and the sand ruling, on the item he approved */
  const ring = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_THE_RING_ROAD_9_22_26.txt'), 'utf8'));
  ok('*** HIS SAND CORRECTION IS IN THE APPROVED TILE ***',
     /white grey/i.test(ring.his_correction || ''), 'NOTES ARE RULINGS');
  ok('and the dirt family is the walked city\'s own desert pavement, not a value I picked',
     ring.palette && ring.palette['1'] === '#6e6045');
});

console.log('ACT STAMP GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (every purse entry carries its act, the treasuries survive a reload, and a'
  + ' load that would change the valley\'s money supply is refused by name)');
process.exit(fail ? 1 : 0);
