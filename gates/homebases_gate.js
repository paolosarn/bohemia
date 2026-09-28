/* THE HOME BASES GATE
   FACTIONS lane, VAMILY rows [home bases] (the map's marker list) and
   [territory ledger] (RE-AIMED 9/28 to record who holds which HOME BASE), 9/28/26.
   Paolo 9/27, rule 37e: "fourteen parts of Vegas as home bases you can raid... a
   home base can be attacked: taken or ruined; the hard ones late in an act... no
   text on screen he did not ask for."

   THE THREE THINGS THIS GATE EXISTS FOR, above the rest:
     1. THE EMPTY LEDGER IS A NO-OP, held against the REAL valley: with nobody
        having taken or ruined anything, every base is held by its own people and
        no party is silenced, so wiring this in changes nothing until a raid exists.
     2. A PARTY EXISTS BECAUSE ITS HOME BASE STILL HOLDS IT. A fixed roster of 28
        that keeps walking out of a ruin is the measured gap this file closes:
        Battle Brothers locations BUY parties out of what they have and are weaker
        until they return, ours never did.
     3. A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME. This is FOURTEEN wholes.
        The logic carries no cell, no grid and no per-lot read, and nothing outside
        a named few touches the superseded 9,216-cell ledger.  */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const H = require(path.join(ROOT, 'engine/bohemia_homebases.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const P = require(path.join(ROOT, 'engine/bohemia_parties.js'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')));
};

const m = OM.buildOvermap(12345);
const seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
const parties = P.all(seats, { n: m.n });
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/* ---- 1. the record, taken from bohemia_century and not reinvented -------- */
{
  const r = H.make();
  ok('a new record is act 1 with nothing in it', r.act === 1 && r.entries.length === 0);
  ok('the act clamps to his three generations, always',
     H.clampAct(0) === 1 && H.clampAct(9) === 3 && H.clampAct(2) === 2);
  H.setAct(r, 3);
  ok('the act moves forward', r.act === 3);
  H.setAct(r, 1);
  ok('AND IT REFUSES TO RUN BACKWARDS, the century module\'s own rule', r.act === 3, 'act is ' + r.act);
}

/* ---- 2. what a write is allowed to be ------------------------------------ */
{
  const r = H.make();
  ok('a write with no base is refused', H.took(r, { to: 'you' }).applied === false);
  ok('a taking with no taker is refused',
     H.took(r, { base: 'Mob' }).applied === false && H.took(r, { base: 'Mob' }).reason === 'NO_TAKER');
  const own = H.took(r, { base: 'Mob', to: 'Mob' });
  ok('A BASE TAKEN BY ITS OWN PEOPLE IS NOT A CHANGE', own.applied === false && own.reason === 'NOT_A_CHANGE');
  ok('and nothing was written', r.entries.length === 0);

  const a = H.took(r, { base: 'Mob', to: 'you', from: 'Reds', day: 12, why: 'raid' });
  ok('a real taking is recorded', a.applied === true);
  ok('it carries the act and the day', a.entry.act === 1 && a.entry.day === 12);
  ok('AND `from` IS READ OFF THE LEDGER, NEVER TAKEN ON THE CALLER\'S WORD (the caller said Reds, it was the Mob)',
     a.entry.from === 'Mob', 'from is ' + a.entry.from);
  ok('a base already yours is not a change', H.took(r, { base: 'Mob', to: 'you' }).applied === false);

  const f = H.ruined(r, { base: 'Cartel', day: 20 });
  ok('a base can fall', f.applied === true && f.entry.to === null && f.entry.from === 'Cartel');
  ok('A RUIN CANNOT FALL TWICE', H.ruined(r, { base: 'Cartel' }).reason === 'ALREADY_RUIN');
  ok('AND CANNOT BE MOVED INTO IN THE ACT IT FELL IN',
     H.took(r, { base: 'Cartel', to: 'you' }).reason === 'RUIN_THIS_ACT');
  H.setAct(r, 2);
  const re = H.took(r, { base: 'Cartel', to: 'you' });
  ok('a generation later it can be reclaimed: the future goes both ways', re.applied === true && re.entry.from === null);
  ok('and it is held by whoever moved in', H.heldBy(r, 'Cartel') === 'you' && !H.isRuin(r, 'Cartel'));
}

/* ---- 3. reading, and the future has not happened yet --------------------- */
{
  const r = H.make();
  ok('a base nobody touched is its own faction\'s', H.heldBy(r, 'Church') === 'Church');
  H.took(r, { base: 'Church', to: 'Reds' });
  ok('the record answers for a base it knows', H.heldBy(r, 'Church') === 'Reds');
  H.setAct(r, 2);
  H.ruined(r, { base: 'Church' });
  ok('a ruin has no holder and says so', H.heldBy(r, 'Church') === null && H.isRuin(r, 'Church'));
  ok('READ AT ACT 1 AND THE ACT-2 FALL HAS NOT HAPPENED YET',
     H.heldBy(r, 'Church', 1) === 'Reds' && H.isRuin(r, 'Church', 1) === false,
     'act 1 says ' + H.heldBy(r, 'Church', 1));
}

/* ---- 4. what the future reads: signed, in whole bases -------------------- */
{
  const r = H.make();
  H.took(r, { base: 'Mob', to: 'you' });
  H.ruined(r, { base: 'Cartel' });
  const n1 = H.netFor(r, 1);
  ok('a base you took is +1 to you and -1 to who held it', n1.you === 1 && n1.Mob === -1);
  ok('A BASE THAT FELL SUBTRACTS FROM ITS HOLDER AND ADDS TO NOBODY (raided falls, rule 37c)',
     n1.Cartel === -1 && Object.keys(n1).filter(k => n1[k] > 0).join() === 'you');
  H.setAct(r, 2);
  H.ruined(r, { base: 'Mob' });
  ok('the net is per act, and act 2 does not rewrite act 1',
     H.netFor(r, 2).you === -1 && H.netFor(r, 1).you === 1);
  ok('ruins stand through the acts they fell in', H.ruinsThrough(r, 1) === 1 && H.ruinsThrough(r, 2) === 2);
}

/* ---- 5. *** THE EMPTY LEDGER IS A NO-OP, AGAINST THE REAL VALLEY *** ------- */
{
  const empty = H.make();
  const bl = H.bases(seats, empty, 1);
  ok('fourteen home bases, one per seat, in the seats\' own order',
     bl.length === 14 && seats.length === 14 && bl.every((b, i) => b.faction === seats[i].faction),
     bl.length + ' bases');
  ok('THE EMPTY LEDGER HOLDS EVERY BASE FOR ITS OWN PEOPLE',
     bl.every(b => b.holder === b.faction && b.state === 'held'));
  ok('a base is the seat, unmoved: same cell, same kind, same tier',
     bl.every((b, i) => b.x === seats[i].x && b.y === seats[i].y && b.kind === seats[i].kind && b.tier === seats[i].tier));
  ok('every base has a real district kind, none invented here', bl.every(b => typeof b.kind === 'string' && b.kind !== '?'));
  const pl = H.partiesLeft(parties, bl);
  ok('AND THE EMPTY LEDGER SILENCES NOBODY: ' + parties.length + ' parties in, ' + pl.kept.length + ' out',
     parties.length > 14 && pl.kept.length === parties.length && pl.silenced.length === 0
     && pl.kept.every((p, i) => p === parties[i]));
}

/* ---- 6. THE HARD ONES LATE IN AN ACT, off his own DEPTH thirds ------------ */
{
  const third = 1 / 3;
  ok('a camp can be attacked from the start', Math.abs(H.openAt('camp')) < 1e-9);
  ok('a town a third of the way through', Math.abs(H.openAt('town') - third) < 1e-9, 'got ' + H.openAt('town'));
  ok('a fortress two thirds of the way through', Math.abs(H.openAt('fortress') - 2 * third) < 1e-9, 'got ' + H.openAt('fortress'));
  ok('at the start of an act only camps are open',
     H.raidable('camp', 0) === true && H.raidable('town', 0) === false && H.raidable('fortress', 0) === false);
  ok('a third in, towns open and fortresses still hold',
     H.raidable('town', 0.34) === true && H.raidable('fortress', 0.34) === false);
  ok('two thirds in, the fortresses are open', H.raidable('fortress', 0.67) === true);
  ok('NOBODY RAIDS A RUIN', H.raidable('camp', 1, true) === false);
  ok('WITHOUT AN ACT CLOCK THE ANSWER IS NULL, NEVER A GUESS: the length of an act is not this file\'s',
     H.raidable('town', undefined) === null && H.raidable('camp', null) === null);
  const saved = T.DEPTH.town;
  T.DEPTH.town = 0.9;
  const moved = H.openAt('town');
  T.DEPTH.town = saved;
  ok('THE CUT MOVES WITH THE TABLE IT COMES FROM: nothing is typed in the module',
     Math.abs(moved - (0.9 - T.DEPTH.camp)) < 1e-9 && Math.abs(H.openAt('town') - third) < 1e-9, 'got ' + moved);
  const atStart = H.bases(seats, H.make(), 1, { progress: 0 });
  ok('on the real seats, at the start of an act, exactly the camps can be attacked',
     atStart.every(b => b.raidable === (b.tier === 'camp')) && atStart.some(b => b.raidable) && atStart.some(b => !b.raidable));
  ok('with no act clock handed in, every base says null',
     H.bases(seats, H.make(), 1).every(b => b.raidable === null));
}

/* ---- 7. *** A PARTY EXISTS BECAUSE ITS BASE STILL HOLDS IT *** ------------ */
{
  const count = {};
  parties.forEach(p => { count[p.from.faction] = (count[p.from.faction] || 0) + 1; });
  const victim = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
  const other = Object.keys(count).filter(k => k !== victim)[0];

  const r = H.make();
  H.ruined(r, { base: victim });
  const mk = H.markers(seats, parties, r, 1);
  const bm = mk.filter(x => x.kind === 'base'), pm = mk.filter(x => x.kind === 'party');
  ok('a fallen base is still on the map, as a ruin',
     bm.length === 14 && bm.find(b => b.faction === victim).state === 'ruined'
     && bm.find(b => b.faction === victim).holder === null && bm.find(b => b.faction === victim).raidable === false);
  ok('AND IT SENDS NOBODY: none of its ' + count[victim] + ' parties are on the map',
     pm.every(x => x.faction !== victim) && pm.length === parties.length - count[victim],
     pm.length + ' left of ' + parties.length);
  ok('every other party is exactly as it was, same id, same place',
     pm.every(x => { const p = parties.find(q => q.id === x.id); return p && p.at.x === x.x && p.at.y === x.y && p.from.faction !== victim; }));

  const r2 = H.make();
  H.took(r2, { base: victim, to: 'you' });
  const m2 = H.markers(seats, parties, r2, 1);
  ok('a base that is yours is marked yours, and it too sends nobody',
     m2.find(x => x.id === 'base:' + victim).state === 'yours'
     && m2.filter(x => x.kind === 'party' && x.faction === victim).length === 0);

  const r3 = H.make();
  H.took(r3, { base: victim, to: other });
  const m3 = H.markers(seats, parties, r3, 1);
  ok('a base taken by another crew is marked taken, its old crew sends nobody, and NOTHING IS INVENTED FOR THE TAKER',
     m3.find(x => x.id === 'base:' + victim).state === 'taken'
     && m3.filter(x => x.kind === 'party' && x.faction === victim).length === 0
     && m3.filter(x => x.kind === 'party' && x.faction === other).length === count[other]);

  const back = H.markers(seats, parties, r, 1).filter(x => x.kind === 'party').length;
  H.setAct(r, 2);
  H.took(r, { base: victim, to: 'you' });
  ok('the marker list is read at an act: act 1 has not yet seen the act-2 change',
     H.markers(seats, parties, r, 1).filter(x => x.kind === 'party').length === back
     && H.markers(seats, parties, r, 2).find(x => x.id === 'base:' + victim).state === 'yours');
}

/* ---- 8. NO TEXT: ids, classes and numbers, never a sentence ---------------- */
{
  const r = H.make(); H.ruined(r, { base: seats[0].faction });
  const mk = H.markers(seats, parties, r, 1, { progress: 0.5 });
  const bannedKeys = ['label', 'name', 'text', 'about', 'say', 'title', 'why', 'note'];
  ok('no marker carries a key that could hold a sentence',
     mk.every(x => bannedKeys.every(k => !(k in x))));
  const wordy = [];
  mk.forEach(x => Object.keys(x).forEach(k => {
    if (typeof x[k] === 'string' && !/^[A-Za-z0-9:,._-]+$/.test(x[k])) wordy.push(k + '=' + x[k]);
  }));
  ok('AND EVERY STRING ON A MARKER IS AN ID OR A CLASS: "no text on screen he did not ask for" (37e)',
     wordy.length === 0, wordy.slice(0, 3).join(' | '));
  ok('a base marker says where, whose, what and how big',
     mk.filter(x => x.kind === 'base').every(b => b.x >= 0 && b.y >= 0 && b.faction && b.glyph && b.tier));
  ok('a party marker says where it is now, whose, doing what, how strong',
     mk.filter(x => x.kind === 'party').every(p => p.x >= 0 && p.y >= 0 && p.faction && p.agenda && typeof p.strength === 'number'));
}

/* ---- 9. the save --------------------------------------------------------- */
{
  const r = H.make(); H.took(r, { base: 'Mob', to: 'you', day: 3 }); H.setAct(r, 2); H.ruined(r, { base: 'Blues', day: 9 });
  const back = H.load(JSON.parse(JSON.stringify(H.toJSON(r))));
  ok('a save round-trips', JSON.stringify(H.toJSON(back)) === JSON.stringify(H.toJSON(r)));
  ok('AN OLDER SAVE IS A PLAYABLE SAVE: nothing, null and junk all load as act 1 with nothing in it',
     [undefined, null, 'x', 7, {}, { entries: 'no' }].every(b => { const l = H.load(b); return l.act === 1 && l.entries.length === 0; }));
  const junk = H.load({ act: 2, entries: [{ base: 'Mob', how: 'taken', to: 'you', act: 1 }, { base: 'Mob', how: 'explode' }, null, { how: 'ruined' }] });
  ok('an entry that is not a taking or a fall is dropped on load', junk.entries.length === 1 && junk.act === 2);
}

/* ---- 10. the same valley gives the same list ------------------------------- */
{
  const r = H.make(); H.ruined(r, { base: 'Mob' });
  const a = JSON.stringify(H.markers(seats, parties, r, 1, { progress: 0.4 }));
  const seats2 = T.derive(G, T.districtsOf(OM.buildOvermap(12345), CE.cat), 1);
  const parties2 = P.all(seats2, { n: m.n });
  const b = JSON.stringify(H.markers(seats2, parties2, r, 1, { progress: 0.4 }));
  ok('DERIVED, NEVER STORED: two builds of the same valley give the same marker list byte for byte', a === b && a.length > 100);
}

/* ---- 11. *** A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME *** ---------- */
{
  const logic = stripComments(fs.readFileSync(path.join(ROOT, 'engine/bohemia_homebases.js'), 'utf8'));
  ok('the logic reads no cell, no grid and no per-lot ownership: none of turf, holderOf, grid, cells or 9216',
     !/\bturf\b|holderOf|\bgrid\b|\bcells?\b|9216|\bat\(\s*[a-z]+\s*,\s*[a-z]+\s*\)/i.test(logic));
  ok('and it does not require the superseded ledger', !/turfledger|TurfLedger/.test(logic));
  const allowed = new Set(['engine/bohemia_turfledger.js', 'engine/bohemia_future.js', 'gates/turf_ledger_gate.js',
                           'gates/three_acts_gate.js', 'gates/homebases_gate.js', 'engine/bohemia_homebases.js']);
  const offenders = [];
  for (const dir of ['engine', 'slices', 'gates', 'tools']) {
    const d = path.join(ROOT, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (!/\.(js|html|py)$/.test(f)) continue;
      const rel = dir + '/' + f;
      if (allowed.has(rel)) continue;
      const src = fs.readFileSync(path.join(d, f), 'utf8');
      if (/BohemiaTurfLedger|bohemia_turfledger/.test(src)) offenders.push(rel);
    }
  }
  ok('NOTHING BUT THE NAMED FEW FILES TOUCHES THE SUPERSEDED 9,216-CELL LEDGER: a new reader is a dead shape returning',
     offenders.length === 0, offenders.join(', '));
  const banner = fs.readFileSync(path.join(ROOT, 'engine/bohemia_turfledger.js'), 'utf8').slice(0, 900);
  ok('the old ledger still says, at the top, that it is superseded', /SUPERSEDED 9\/28\/26/.test(banner));
}

console.log('THE HOME BASES GATE: ' + pass + ' ok, ' + fail + ' failed  (fourteen wholes, taken or ruined; '
          + 'the empty ledger is a no-op; a party exists because its base holds it; no text; no cells)');
process.exit(fail ? 1 : 0);
