/* THE ARRIVAL TRAITS GATE (FACTIONS lane, row [raids make traits])
   The effects in records/target/bb/arrival_traits.json are read out of the wiki tarball here and compared (Raided and Well Supplied),
   and the mechanism runs on the REAL valley's parties: crews raid, caravans supply, patrols do nothing, a stopped party sets nothing,
   a repeat arrival refreshes and never doubles, the player's own base is left to the raid chain, a mark ends on its day. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const A = require(path.join(ROOT, 'engine/bohemia_arrivaltraits.js'));
const H = require(path.join(ROOT, 'engine/bohemia_homebases.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const P = require(path.join(ROOT, 'engine/bohemia_parties.js'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const D = JSON.parse(fs.readFileSync(process.env.ARRIVAL_FILE || path.join(ROOT, 'records/target/bb/arrival_traits.json'), 'utf8'));
const ST = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
const page = n => cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' "bb_all/' + n + '"', { encoding: 'utf8' });
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
A.set(D);

/* ---- the wiki, row for row ---- */
const pct = (txt, label) => { const m = txt.match(new RegExp('([+\\u2212-]\\d+)%</span>\\s*' + label)); return m ? parseInt(m[1].replace('−', '-'), 10) : null; };
const raided = page('1626_Raided (Settlement Situation).txt'), well = page('2199_Well Supplied (Settlement Situation).txt');
const rw = { items: pct(raided, '(?:\\[\\[[^\\]]*\\]\\])?\\s*items available'), recruits: pct(raided, '(?:\\[\\[[^\\]]*\\]\\])?\\s*recruits available') };
ok('the wiki parse found Raided: -50 items, -50 recruits', pct(raided, 'items available') === -50 && pct(raided, 'recruits available') === -50, JSON.stringify(rw));
ok('the wiki parse found Well Supplied: -10 buy, -10 sell, +15 items', pct(well, 'buying prices') === -10 && pct(well, 'selling prices') === -10 && pct(well, 'items available') === 15);
const fr = 1 + pct(raided, 'items available') / 100, rr = 1 + pct(raided, 'recruits available') / 100;
ok('Raided items equal the wiki', D.traits.raided.effects.items_mult.value === fr);
ok('Raided recruits equal the wiki', D.traits.raided.effects.recruits_mult.value === rr);
ok('Well Supplied buy price equals the wiki', D.traits.well_supplied.effects.buy_price_mult.value === 1 + pct(well, 'buying prices') / 100);
ok('Well Supplied sell price equals the wiki', D.traits.well_supplied.effects.sell_price_mult.value === 1 + pct(well, 'selling prices') / 100);
ok('Well Supplied items equal the wiki', D.traits.well_supplied.effects.items_mult.value === 1 + pct(well, 'items available') / 100);
for (const t in D.traits) for (const k in D.traits[t].effects) { const e = D.traits[t].effects[k]; ok(t + '.' + k + ' carries a source and a quote', e.source && e.quote && e.quote.length > 5); }
ok('what SETS a trait is ours and says what Battle Brothers does', Object.values(D.traits).every(t => t.set_by.ours === true && t.set_by.bb && t.set_by.bb_quote));
ok('Escort Caravan\'s page really says well supplied (the quote is real)', /well supplied/i.test(page('0703_Escort Caravan.txt')));
ok('Defend Settlement\'s page really says Raided on a failed defence (the quote is real)', /Raided[\s\S]{0,80}fail to protect/i.test(page('0553_Defend Settlement Bandits.txt')));
ok('the duration is ours and equals RUN TWO\'s trait period', D.duration_days.ours === true && D.duration_days.value === ST.roll.period_days);

/* ---- the mechanism on the real valley ---- */
const m = OM.buildOvermap(12345);
const seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
const mk = () => P.all(seats, { n: m.n });
const ev = H.advanceWatching(mk(), 89, 2);
const kinds = new Set(ev.map(e => e.agenda));
ok('the real valley gives crews, caravans and patrols arriving', ['crew', 'caravan', 'patrol'].every(k => kinds.has(k)));
{ const r = A.make(), out = A.traitsFrom(ev, seats, r, 10);
  ok('arrivals wrote marks', out.length > 0);
  ok('every crew arrival made Raided and every caravan arrival made Well Supplied, nothing else',
     out.every(o => (o.trait === 'raided') === (ev.find(e => e.id === o.party).agenda === 'crew')));
  ok('both traits appear on the real valley', out.some(o => o.trait === 'raided') && out.some(o => o.trait === 'well_supplied'));
  ok('no patrol wrote a mark', out.every(o => ev.find(e => e.id === o.party).agenda !== 'patrol'));
  ok('no mark is a party at its own home', out.every(o => o.place !== o.by));
  const n0 = r.marks.length; const again = A.traitsFrom(ev, seats, r, 12);
  ok('a repeat arrival refreshes, adds no new mark', again.length === 0 && r.marks.length === n0);
  ok('the refresh moved the end day (12 + 7)', r.marks.every(k => k.until === 19));
  const mk0 = r.marks[0];
  ok('a mark stands inside its days and ends on the end day', A.active(r, mk0.place, mk0.from).includes(mk0.trait) && !A.active(r, mk0.place, mk0.until).includes(mk0.trait));
  ok('before its first day nothing stands', !A.active(r, mk0.place, mk0.from - 1).includes(mk0.trait) || r.marks.some(k => k.place === mk0.place && k.trait === mk0.trait && k.from < mk0.from));
  const rm = r.marks.find(k => k.trait === 'raided'), ws = r.marks.find(k => k.trait === 'well_supplied');
  const expect = (place, day) => { const ids = A.active(r, place, day); let it = 1, rc = 1, by = 1, sl = 1;
    ids.forEach(i => { const f = D.traits[i].effects; it *= (f.items_mult || { value: 1 }).value; rc *= (f.recruits_mult || { value: 1 }).value; by *= (f.buy_price_mult || { value: 1 }).value; sl *= (f.sell_price_mult || { value: 1 }).value; });
    return [it, rc, by, sl].join(); };
  const every = r.marks.every(k => { const e = A.effects(r, k.place, 11); return [e.items_mult, e.recruits_mult, e.buy_price_mult, e.sell_price_mult].join() === expect(k.place, 11); });
  ok('effects on every marked place are exactly the product of its standing traits', every);
  ok('a raided place has half the recruits', A.effects(r, rm.place, 11).recruits_mult === 0.5);
  ok('a supplied place pays less to buy', A.effects(r, ws.place, 11).buy_price_mult === 0.9 || A.active(r, ws.place, 11).length > 1);
  ok('a supplied-only place has +15 items', (() => { const k = r.marks.find(x => x.trait === 'well_supplied' && A.active(r, x.place, 11).length === 1); return !k || A.effects(r, k.place, 11).items_mult === 1.15; })());
  ok('a place with both multiplies them', (() => { const q = A.make(); q.marks = [{ place: 'X', trait: 'raided', from: 0, until: 9 }, { place: 'X', trait: 'well_supplied', from: 0, until: 9 }]; return A.effects(q, 'X', 1).items_mult === 0.575; })());
  ok('a place with nothing is 1 on every number', Object.values(A.effects(A.make(), 'Nowhere', 1)).every(v => v === 1));
}
{ const home = seats[0], r = A.make();
  ok('a crew arriving at its own home sets nothing', A.traitsFrom([{ id: 'h', agenda: 'crew', faction: home.faction, to: { x: home.x, y: home.y } }], seats, r, 3).length === 0);
  const q = A.make(); q.marks = [{ place: 'X', trait: 'raided', from: 0, until: 9 }, { place: 'X', trait: 'raided', from: 1, until: 9 }];
  ok('two marks of one trait on a place count once', A.active(q, 'X', 2).length === 1 && A.effects(q, 'X', 2).recruits_mult === 0.5); }
{ const r = A.make(), out = A.traitsFrom(ev, seats, r, 10, { stopped: () => true });
  ok('a party you stopped on the road sets nothing (68a)', out.length === 0 && r.marks.length === 0); }
{ const r = A.make(), all = seats.map(s => s.faction), out = A.traitsFrom(ev, seats, r, 10, { yours: all });
  ok('your own bases are left to the raid chain', out.length === 0); }
{ const r = A.make(), one = ev.filter(e => e.agenda === 'crew').slice(0, 1);
  ok('no day, no write', A.traitsFrom(one, seats, r, undefined).length === 0 && r.marks.length === 0);
  ok('no record, no throw', Array.isArray(A.traitsFrom(one, seats, null, 3)));
  ok('an event with no destination is ignored', A.traitsFrom([{ id: 'x', agenda: 'crew', faction: 'Q' }], seats, r, 3).length === 0); }
{ const r = A.make(); const dry = A.traitsFrom(H.advanceWatching(mk(), 89, 2), seats, r, 5);
  const r2 = A.make(); A.traitsFrom(H.advanceWatching(mk(), 89, 2), seats, r2, 5);
  ok('the same valley gives the same marks (deterministic)', JSON.stringify(r.marks) === JSON.stringify(r2.marks)); }
ok('the logic reads no cell, no grid, no per-lot ownership (dead shape stays dead)', !/turfGrid|turfledger|\bcells?\[|lotOwner/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_arrivaltraits.js'), 'utf8')));
console.log('ARRIVAL TRAITS GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
