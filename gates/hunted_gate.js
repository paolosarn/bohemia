/* THE HUNTED GATE (FACTIONS lane, row [beef] A-SETTLEMENT-COMES-FOR-YOU)
   The two thresholds are Battle Brothers' and are checked against the wiki text read out of the tarball (the quotes must be there,
   the bands must exist in relations.json). The rest runs on the REAL valley's parties: only patrols hunt, only from a faction whose
   bar is Hostile; only caravans are attackable, only with no contract, only at Threatening or lower; a contract against a settlement
   costs the wiki's Attacking Them; nothing hunts a company nobody has wronged. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = require(path.join(ROOT, 'engine/bohemia_relations.js'));
const H = require(path.join(ROOT, 'engine/bohemia_hunted.js'));
const D = JSON.parse(fs.readFileSync(process.env.HUNTED_FILE || path.join(ROOT, 'records/target/bb/hunted.json'), 'utf8'));
const RD = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/relations.json'), 'utf8'));
const P = require(path.join(ROOT, 'engine/bohemia_parties.js')), T = require(path.join(ROOT, 'engine/bohemia_towns.js')),
      CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js')), OM = require(path.join(ROOT, 'engine/bohemia_overmap.js')),
      G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const page = n => cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' "bb_all/' + n + '"', { encoding: 'utf8', maxBuffer: 1 << 24 });
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
H.set(D, R, RD); R.set(RD);
const flat = s => s.replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').replace(/\s+/g, ' ');
for (const k of ['patrol_hunts', 'caravan_attackable']) {
  const row = D[k], file = row.source.split('bb_all/')[1];
  ok(k + ': the quote is really on the wiki page', row.quote.length > 20 && flat(page(file)).includes(flat(row.quote).replace(/\\"/g, '"')), file);
  ok(k + ': its band exists in the relations bands', RD.bands.value.some(b => b.id === row.band));
}
ok('the hunt band is Hostile and the caravan band is Threatening', D.patrol_hunts.band === 'hostile' && D.caravan_attackable.band === 'threatening');
ok('the wiki says the caravan needs no contract', D.caravan_attackable.needs_no_contract === true && /doesn't have an active contract/.test(flat(page('0724_Factions and Relations.txt'))));
ok('the contract-against mapping is ours and names a real wiki act', D.contract_against_them.ours === true && !!RD.acts[D.contract_against_them.act]);
ok('the patrol-hunts reading is marked as our reading of the wiki', D.patrol_hunts.reading_ours === true);

const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1), ps = P.all(seats, { n: m.n });
const patrols = ps.filter(p => p.agenda === 'patrol'), vans = ps.filter(p => p.agenda === 'caravan'), crews = ps.filter(p => p.agenda === 'crew');
ok('the real valley has patrols, caravans and crews', patrols.length && vans.length && crews.length, [patrols.length, vans.length, crews.length].join());
{ const r = R.make();
  ok('NOBODY HUNTS A COMPANY NOBODY WRONGED (every bar at 50)', H.huntersFor(r, ps).length === 0);
  ok('and no caravan is attackable', vans.every(v => !H.attackable(r, v, false)));
  const f = patrols[0].from.faction;
  H.contractAgainst(r, f);
  ok('one contract against a settlement costs 30 (to 20, Unfriendly) and still nobody hunts', R.score(r, f) === 20 && H.huntersFor(r, ps).length === 0);
  ok('...but its caravans are not yet attackable either (20 is above Threatening)', vans.filter(v => v.from.faction === f).every(v => !H.attackable(r, v, false)));
  H.contractAgainst(r, f);
  ok('a second drops it to 0, Hostile', R.score(r, f) === 0 && R.band(0) === 'hostile');
  const hs = H.huntersFor(r, ps), mine = patrols.filter(p => p.from.faction === f).map(p => p.id);
  ok('now exactly that faction\'s patrols hunt', hs.length === mine.length && hs.every(i => mine.includes(i)) && mine.length > 0);
  ok('crews never hunt for standing', hs.every(i => !crews.some(c => c.id === i)));
  ok('its caravans are now attackable, with no contract', vans.filter(v => v.from.faction === f).every(v => H.attackable(r, v, false)) && vans.some(v => v.from.faction === f));
  ok('and not while you hold a contract', vans.every(v => !H.attackable(r, v, true)));
  ok('another faction\'s caravans and patrols are untouched', vans.filter(v => v.from.faction !== f).every(v => !H.attackable(r, v, false)));
  ok('a patrol is never an attackable caravan', patrols.every(p => !H.attackable(r, p, false)));
  R.dawn(r, 40);
  ok('forty mornings later the bar is 10 (Threatening): the patrols stop, the caravans stay open', H.huntersFor(r, ps).length === 0 && vans.some(v => v.from.faction === f && H.attackable(r, v, false)));
  R.dawn(r, 40);
  ok('and eighty mornings in, the caravans close too (20 is above Threatening)', vans.filter(v => v.from.faction === f).every(v => !H.attackable(r, v, false)));
}
{ const r = R.make(), f = patrols[0].from.faction;
  for (let i = 0; i < 3; i++) R.crime(r, f, 'steal_bread', true);
  ok('three seen loaves never make a faction hunt you (50 to 20)', H.huntersFor(r, ps).length === 0);
  R.crime(r, f, 'steal_battery', true); R.crime(r, f, 'steal_battery', true);
  ok('two seen batteries on top do (20 to 0)', H.huntersFor(r, ps).length > 0); }
{ const f = patrols[0].from.faction, van = vans.find(v => v.from.faction === f) || vans[0], vf = van.from.faction;
  for (const [sc, hunts] of [[5, true], [9, true], [9.5, true], [10, false]]) { const r = R.make(); r.bars[f] = sc; ok('a bar at ' + sc + (hunts ? ' hunts' : ' does not hunt'), (H.huntersFor(r, ps).filter(i => patrols.find(p => p.id === i).from.faction === f).length > 0) === hunts); }
  for (const [sc, open] of [[15, true], [19, true], [19.5, true], [20, false]]) { const r = R.make(); r.bars[vf] = sc; ok('a caravan is ' + (open ? '' : 'not ') + 'attackable at ' + sc, H.attackable(r, van, false) === open); } }
ok('a party with no home is never a hunter', H.huntersFor(R.make(), [{ id: 'x', agenda: 'patrol' }]).length === 0);
ok('a missing party list is quietly empty', H.huntersFor(R.make(), null).length === 0 && H.attackable(R.make(), null, false) === false);
ok('no cell, no grid, no per-lot read', !/turfGrid|turfledger|\bcells?\[|lotOwner/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_hunted.js'), 'utf8')));
console.log('HUNTED GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
