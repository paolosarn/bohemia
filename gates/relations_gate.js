/* THE RELATIONS GATE (FACTIONS lane, row [beef] RELATIONS-BANDS-FROM-THE-WIKI)
   records/target/bb/relations.json must say what the wiki's Relations page says, row for row, because it is read straight
   out of the wiki tarball here; ECONOMY's partial copy in contract_terms.json must agree with it; and the mechanism
   (bands, drift, clamps, crime, guards) behaves. Crime and the guard line are ours and must say so. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = require(path.join(ROOT, 'engine/bohemia_relations.js'));
const D = JSON.parse(fs.readFileSync(process.env.RELATIONS_FILE || path.join(ROOT, 'records/target/bb/relations.json'), 'utf8'));
const CT = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/contract_terms.json'), 'utf8'));
const wiki = cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' bb_all/1670_Relations.txt', { encoding: 'utf8', maxBuffer: 1 << 24 });
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
R.set(D);
const num = s => parseFloat(String(s).replace(',', '.').replace('+', ''));
const clean = s => s.replace(/<[^>]*>/g, '').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').trim();
/* the wiki's two tables, parsed */
const wBands = {}, wActs = {};
wiki.split('|-').forEach(blk => { const c = blk.split('||').map(x => clean(x).replace(/^\|+/, '').replace(/\s*\|\}[\s\S]*$/, '').replace(/\s*\n[\s\S]*$/, '').trim()); if (c.length !== 2) return;
  const m = c[1].match(/^(\d+) - (\d+)$/);
  if (m) wBands[c[0].toLowerCase().replace(/ /g, '_')] = [+m[1], +m[2]];
  else if (/^[+-]?\d+(,\d+)?$/.test(c[1])) wActs[c[0]] = num(c[1]); });
const NAME = { betray_contract: 'Betrayal on Contract', attack_them: 'Attacking Them', offensive_action: 'Offensive Action', fail_civilian_contract: 'Failing a Civilian Contract',
  fail_noble_contract: 'Failing a Noble Contract', cancel_contract: 'Canceling a Contract', minor_offensive_action: 'Minor Offensive Action', negotiation_fail: 'Contract Negotiation Fail',
  kill_one_unit: 'Killing 1 of Their Units', drink_for_patrons: 'Buying a Drink for the Patrons in the Tavern', noble_contract_poor: 'Noble Contract Poorly Completed',
  civilian_contract_poor: 'Civilian Contract Poorly Completed', noble_contract_done: 'Noble Contract Completed', civilian_contract_done: 'Civilian Contract Completed', favor: 'Doing Them a Favor' };

ok('the wiki parse found nine bands', Object.keys(wBands).length === 9, Object.keys(wBands).length);
ok('the wiki parse found the action rows', Object.keys(wActs).length >= 15, Object.keys(wActs).length);
const bs = D.bands.value;
ok('nine bands in the file', bs.length === 9);
for (const b of bs) { const w = wBands[b.id]; ok('band ' + b.id + ' equals the wiki', w && w[0] === b.lo && w[1] === b.hi, JSON.stringify(w)); }
ok('the bands tile 0..100 with no gap and no overlap', bs[0].lo === 0 && bs[8].hi === 100 && bs.every((b, i) => i === 0 || b.lo === bs[i - 1].hi + 1));
for (const k in NAME) { const a = D.acts[k]; ok('act ' + k + ' exists with a source and a quote', a && a.source && a.quote && a.quote.length > 8);
  const w = Object.keys(wActs).find(x => x.replace(/\W/g, '').toLowerCase() === NAME[k].replace(/\W/g, '').toLowerCase());
  ok('act ' + k + ' equals the wiki', a && w !== undefined && wActs[w] === a.value, a && (a.value + ' vs ' + wActs[w])); }
ok('no act in the file that is not in the table', Object.keys(D.acts).every(k => NAME[k]));
ok('start is the neutral middle (50)', D.start.value === 50 && R.band(50) === 'neutral');
ok('drift is 0.25 toward 50', D.drift.value.per_dawn === 0.25 && D.drift.value.toward === 50);
const E = CT.relationsCost;
ok('ECONOMY\'s copy agrees with this file where they overlap', E.betrayContract === D.acts.betray_contract.value && E.attackThem === D.acts.attack_them.value &&
   E.offensiveAction === D.acts.offensive_action.value && E.failCivilianContract === D.acts.fail_civilian_contract.value && E.cancelContract === D.acts.cancel_contract.value &&
   E.killOneOfTheirUnits === D.acts.kill_one_unit.value && E.finishedNobleContract === D.acts.noble_contract_done.value && E.drinkForThePatrons === D.acts.drink_for_patrons.value);
/* the mechanism */
{ const r = R.make();
  ok('a settlement with no bar reads 50', R.score(r, 'x') === 50);
  const a = R.apply(r, 'x', 'attack_them');
  ok('attacking costs 30 and lands in unfriendly', a.applied && a.after === 20 && a.band === 'unfriendly');
  ok('another settlement is untouched', R.score(r, 'y') === 50);
  R.apply(r, 'x', 'betray_contract'); ok('the bar floors at 0', R.score(r, 'x') === 0 && R.band(0) === 'hostile');
  for (let i = 0; i < 30; i++) R.apply(r, 'z', 'favor'); ok('the bar caps at 100', R.score(r, 'z') === 100 && R.band(100) === 'allied');
  R.dawn(r, 40); ok('forty dawns from 0 reach 10 (the wiki: roughly 40 days)', R.score(r, 'x') === 10 && R.band(10) === 'threatening');
  R.dawn(r, 400); ok('drift stops at 50 from below', R.score(r, 'x') === 50);
  ok('and at 50 from above', R.score(r, 'z') === 50);
  ok('drift never steps past 50 (49.9 -> 50, 50.1 -> 50)', (() => { const q = R.make(); q.bars.l = 49.9; q.bars.h = 50.1; R.dawn(q, 1); return q.bars.l === 50 && q.bars.h === 50; })());
  ok('a drink is +0.1 and does not round away', (() => { const q = R.make(); R.apply(q, 'a', 'drink_for_patrons'); return R.score(q, 'a') === 50.1; })());
  ok('unknown act and no settlement are refused by name', R.apply(r, 'x', 'dance').reason === 'UNKNOWN_ACT' && R.apply(r, '', 'favor').reason === 'NO_SETTLEMENT');
  ok('the band edges: 9 hostile, 10 threatening, 39 cold, 40 neutral, 59 neutral, 60 open', [9, 10, 39, 40, 59, 60].map(R.band).join() === 'hostile,threatening,cold,neutral,neutral,open');
}
/* crime and guards (ours) */
{ const r = R.make();
  ok('stealing bread seen costs the minor offence (10)', R.crime(r, 'a', 'steal_bread', true).after === 40);
  ok('stealing a battery seen costs the offensive action (20)', R.crime(r, 'b', 'steal_battery', true).after === 30);
  ok('an unseen theft writes nothing', R.crime(r, 'c', 'steal_bread', false).reason === 'UNSEEN' && R.score(r, 'c') === 50);
  ok('an unknown crime is refused', R.crime(r, 'c', 'arson', true).reason === 'UNKNOWN_CRIME');
  ok('crime sizes are mapped onto wiki rows, not new numbers', Object.keys(D.crime).filter(k => D.crime[k].maps_to).every(k => D.crime[k].ours === true && D.acts[D.crime[k].maps_to]));
  ok('guards draw in the hostile band and not above', R.guardsDraw(9) && !R.guardsDraw(10) && D.guards.draw_at_or_below.ours === true);
  ok('three thefts of bread do not make a town hostile alone (50-30=20)', (() => { const q = R.make(); for (let i = 0; i < 3; i++) R.crime(q, 'a', 'steal_bread', true); return !R.guardsDraw(R.score(q, 'a')); })());
}
console.log('RELATIONS GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
