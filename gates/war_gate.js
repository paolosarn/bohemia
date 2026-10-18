/* THE WAR GATE (FACTIONS lane, row [houses at war])
   WHO is at war is read from bohemia_between.js and never stored; the quotes about what a war does are re-read from the wiki tarball;
   the Conquered effects equal the Conquered page; and on the REAL valley's parties: hostile pairs meet, once a day each, the stronger breaks
   the weaker in a war and only taxes in a non-war hostility, equal strength is a standoff, friends and strangers never clash, taking a
   side drops the enemies of that side to the Hostile top and never raises anyone, a base the world took is Conquered and not burned. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const W = require(path.join(ROOT, 'engine/bohemia_war.js')), R = require(path.join(ROOT, 'engine/bohemia_relations.js')), AT = require(path.join(ROOT, 'engine/bohemia_arrivaltraits.js'));
const BT = require(path.join(ROOT, 'engine/bohemia_between.js')), H = require(path.join(ROOT, 'engine/bohemia_homebases.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js')), P = require(path.join(ROOT, 'engine/bohemia_parties.js')), CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js')),
      OM = require(path.join(ROOT, 'engine/bohemia_overmap.js')), G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const D = JSON.parse(fs.readFileSync(process.env.WAR_FILE || path.join(ROOT, 'records/target/bb/war.json'), 'utf8'));
const AD = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/arrival_traits.json'), 'utf8'));
const RD = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/relations.json'), 'utf8'));
const page = n => cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' "bb_all/' + n + '"', { encoding: 'utf8', maxBuffer: 1 << 24 });
const flat = s => s.replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').replace(/\s+/g, ' ');
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
W.set(D, R, AT); R.set(RD);

for (const k of ['war_takes_settlements', 'side_makes_enemy_hostile']) ok(k + ': the quote is really on the wiki page', flat(page(D[k].source.split('bb_all/')[1])).includes(flat(D[k].quote)));
ok('the Holy War line is really on the Noble Houses page', flat(page('1430_Noble Houses.txt')).includes(D.holy_war.quote.replace(/^Noble houses/i, '').trim().replace(/^hostile/, 'hostile')) && D.holy_war.built === false);
ok('the taking-a-side bar is the top of the Hostile band', D.side_makes_enemy_hostile.to_bar === RD.bands.value.find(b => b.id === 'hostile').hi && D.side_makes_enemy_hostile.to_bar_ours === true);
ok('our readings and outcomes are marked ours', D.war_takes_settlements.reading_ours === true && D.meeting.ours === true && D.outcomes.war.ours === true && D.outcomes.hostile_not_war.ours === true);
ok('no pair of factions is stored in this file (read from between)', !/Cartel|Remnants|Caravans|Mob/.test(JSON.stringify(D.outcomes) + JSON.stringify(D.meeting)));
{ const c = page('0437_Conquered (Settlement Situation).txt'), e = AD.traits.conquered.effects;
  const pc = (l) => { const m = c.match(new RegExp('([+\\u2212-]\\d+)%</span>\\s*(?:\\[\\[[^\\]]*\\]\\])?\\s*' + l)); return m ? parseInt(m[1].replace('−', '-'), 10) : null; };
  ok('Conquered buying prices equal the wiki', e.buy_price_mult.value === 1 + pc('buying prices') / 100);
  ok('Conquered selling prices equal the wiki', e.sell_price_mult.value === 1 + pc('selling prices') / 100);
  ok('Conquered food equals the wiki', e.food_mult.value === 1 + pc('food') / 100);
  ok('Conquered items equal the wiki', e.items_mult.value === 1 + pc('items available') / 100);
  ok('Conquered carries a quote on every number', Object.values(e).every(x => x.source && x.quote)); }

const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
const between = (a, b) => BT.between(a, b);
const mk = () => P.all(seats, { n: m.n });
/* hand-made parties for the exact cases, on real faction names */
const pty = (id, f, power, x, y, agenda) => ({ id, agenda: agenda || 'patrol', from: { faction: f, power }, at: { x, y } });
{ const rec = W.make();
  let ev = W.meetings([pty('c', 'Cartel', 12, 5, 5, 'crew'), pty('r', 'Remnants', 14, 5, 6, 'patrol')], 3, rec, between);
  ok('a war meeting: the stronger (Remnants 14) breaks the weaker (Cartel 12)', ev.length === 1 && ev[0].kind === 'war' && ev[0].winner === 'r' && ev[0].loser === 'c', JSON.stringify(ev));
  ev = W.meetings([pty('c', 'Cartel', 12, 5, 5, 'crew'), pty('r', 'Remnants', 14, 5, 6, 'patrol')], 3, rec, between);
  ok('the same pair the same day is not a second event', ev.length === 0);
  ev = W.meetings([pty('c', 'Cartel', 12, 5, 5, 'crew'), pty('r', 'Remnants', 14, 5, 6, 'patrol')], 4, rec, between);
  ok('the next day it is a new meeting', ev.length === 1);
  ev = W.meetings([pty('c', 'Cartel', 12, 5, 5), pty('r', 'Remnants', 12, 5, 6)], 9, rec, between);
  ok('equal strength is a standoff, nobody breaks', ev.length === 1 && ev[0].kind === 'standoff' && !ev[0].loser);
  ev = W.meetings([pty('c', 'Cartel', 12, 5, 5), pty('v', 'Caravans', 10, 5, 5, 'caravan')], 3, W.make(), between);
  ok('prey-tax is not war: the stronger taxes and nobody is broken', ev.length === 1 && ev[0].kind === 'tax' && ev[0].taxer === 'Cartel' && ev[0].taxed === 'Caravans' && !ev[0].loser);
  ev = W.meetings([pty('c', 'Cartel', 12, 5, 5), pty('r', 'Remnants', 14, 5, 7)], 3, W.make(), between);
  ok('two cells apart is not a meeting', ev.length === 0);
  ev = W.meetings([pty('a', 'Mob', 9, 5, 5), pty('b', 'Remnants', 14, 5, 5)], 3, W.make(), between);
  ok('friends who respect each other never clash', ev.length === 0);
  ev = W.meetings([pty('a', 'Reds', 5, 5, 5), pty('b', 'Church', 6, 5, 5)], 3, W.make(), between);
  ok('strangers with no graph edge never clash', ev.length === 0);
  ev = W.meetings([pty('a', 'Cartel', 12, 5, 5), pty('b', 'Cartel', 12, 5, 5)], 3, W.make(), between);
  ok('a faction never meets itself', ev.length === 0);
  ok('no day, no between, no record: quietly nothing', W.meetings([pty('c', 'Cartel', 12, 5, 5), pty('r', 'Remnants', 14, 5, 5)], undefined, W.make(), between).length === 0 &&
     W.meetings([pty('c', 'Cartel', 12, 5, 5), pty('r', 'Remnants', 14, 5, 5)], 3, W.make(), null).length === 0 && W.meetings(null, 3, W.make(), between).length === 0);
  ev = W.meetings([pty('c', 'Cartel', null, 5, 5), pty('r', 'Remnants', 14, 5, 5)], 3, W.make(), between);
  ok('a party with no strength number is a standoff, never a guess', ev.length === 1 && ev[0].kind === 'standoff'); }
{ const ps = mk(), rec = W.make(); let evs = [];
  for (let step = 0; step < 89 * 4; step++) { P.advance(ps, 1, 1); evs = evs.concat(W.meetings(ps, step / 89, rec, between)); }
  ok('on the real valley, four waking days make war meetings', evs.some(e => e.kind === 'war'), evs.length);
  ok('every war meeting is between factions the graph says are at war', evs.filter(e => e.kind === 'war').every(e => between(e.between[0], e.between[1]).war === true));
  ok('every tax is a hostile pair that is not war', evs.filter(e => e.kind === 'tax').every(e => { const r = between(e.between[0], e.between[1]); return r.sign === 'hostile' && r.war !== true; }));
  ok('the winner always has the larger number', evs.filter(e => e.kind === 'war').every(e => { const w = ps.find(p => p.id === e.winner), l = ps.find(p => p.id === e.loser); return w.from.power > l.from.power; }));
  const keys = evs.map(e => [e.a || e.winner, e.b || e.loser].sort().join('|') + e.day);
  ok('no pair is counted twice in a day', new Set(keys).size === keys.length);
  const ps2 = mk(), rec2 = W.make(); let evs2 = [];
  for (let step = 0; step < 89 * 4; step++) { P.advance(ps2, 1, 1); evs2 = evs2.concat(W.meetings(ps2, step / 89, rec2, between)); }
  ok('the same valley gives the same wars (deterministic)', JSON.stringify(evs) === JSON.stringify(evs2)); }
{ const factions = Object.keys(G.factions), rel = R.make();
  const hit = W.sideWith(rel, 'Cartel', between, factions);
  ok('siding with the Cartel makes the Remnants hostile (bar 9)', hit.indexOf('Remnants') >= 0 && R.score(rel, 'Remnants') === 9 && R.band(9) === 'hostile');
  ok('and only those at war with it: the Mob and the Caravans are untouched', R.score(rel, 'Mob') === 50 && R.score(rel, 'Caravans') === 50);
  const r2 = R.make(); r2.bars.Remnants = 3; W.sideWith(r2, 'Cartel', between, factions);
  ok('a bar already lower is never raised', R.score(r2, 'Remnants') === 3);
  ok('the side itself is untouched', R.score(rel, 'Cartel') === 50);
  ok('siding with someone at war with nobody changes nothing', W.sideWith(R.make(), 'Church', between, factions).length === 0); }
{ const rec = AT.make(), day = 20;
  const made = W.onSettled([{ base: 'Remnants', by: 'Cartel', outcome: 'taken', how: 'unattended', day }, { base: 'Caravans', by: 'Cartel', outcome: 'held', how: 'unattended', day }, { base: 'Mob', by: 'x', outcome: 'ruined', how: 'fought', day }], rec, day);
  ok('a base the world TOOK is Conquered; one that held or was ruined is not', made.length === 1 && made[0].place === 'Remnants' && made[0].trait === 'conquered');
  ok('it stands for the trait period and then ends', AT.active(rec, 'Remnants', day).indexOf('conquered') >= 0 && AT.active(rec, 'Remnants', day + 7).indexOf('conquered') < 0);
  ok('its effects are the wiki\'s: items 60%, buy 110%, sell 90%, food 90%', (() => { const e = AT.effects(rec, 'Remnants', day + 1); return e.items_mult === 0.6 && e.buy_price_mult === 1.1 && e.sell_price_mult === 0.9 && e.food_mult === 0.9; })());
  ok('a second taking refreshes, never doubles', W.onSettled([{ base: 'Remnants', by: 'Cartel', outcome: 'taken' }], rec, day + 3).length === 0 && AT.effects(rec, 'Remnants', day + 4).items_mult === 0.6);
  ok('it is never burned: no ruin is written anywhere by this module', !/ruined\(|closeRaid|\.ruin\b/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_war.js'), 'utf8'))); }
ok('no cell, no grid, no per-lot ownership', !/turfGrid|turfledger|\bcells?\[|lotOwner/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_war.js'), 'utf8')));
console.log('WAR GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
