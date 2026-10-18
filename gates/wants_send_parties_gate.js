/* ============================================================================
   WANTS SEND PARTIES GATE (10/18/26, FACTIONS lane) -- row [wants send parties]
   WHAT-A-FACTION-WANTS-DECIDES-WHERE-ITS-PARTIES-GO (WORLD [parties move] BUY half).

   THE ROW: "make the want choose the target: a crew goes at what stands on or
   beside the ground it wants, a house patrols the depot, read by bohemia_parties'
   target choice... no new numbers. Gate on the real valley: which kinds of place
   get raided, and that camps and towns are now reachable."

   WHAT IT HOLDS:
     A. the school is real: every quote in records/target/bb/wants.json is read
        back out of the wiki tarball, and every want's wiki keys name one;
     B. the module types no number and names no faction, and never takes the
        player's position;
     C. a seat whose faction has no want gets BYTE FOR BYTE what the parties
        module gave it (the valley's fourteen, three seeds);
     D. on the real valley plus the region's rows: BEFORE, every valley crew goes
        at a fortress and the wild crews send caravans; AFTER, the road crews and
        the dead send crews only, at camps and towns as well as fortresses, the
        beasts hold their ground and go at no place, no wild seat goes at another;
     E. the want's rule is the order: the road crew's first mark has the shortest
        trip; the dead take a raided place first; the house patrols the nearest
        depot ground; the data file drives it (change the ground, the marks move);
     F. the parties are the parties module's shape: advance(), legOf(), say() take
        them unchanged, and the same valley gives the same parties twice.

   node gates/wants_send_parties_gate.js   (env WANTS_FILE swaps the data file)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = p => require(path.join(ROOT, p));
const T = R('engine/bohemia_towns.js'), P = R('engine/bohemia_parties.js'), CE = R('engine/bohemia_cityedit.js');
const OM = R('engine/bohemia_overmap.js'), G = R('engine/BOHEMIA_faction_graph.json'), BT = R('engine/bohemia_boardterrain.js');
const W = R('engine/bohemia_wants.js');
const WANTS = JSON.parse(fs.readFileSync(process.env.WANTS_FILE || path.join(ROOT, 'records/target/bb/wants.json'), 'utf8'));
const FACTIONS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/factions.json'), 'utf8'));
const REGION = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/region_bases.json'), 'utf8'));
const DATA = { factions: FACTIONS, wants: WANTS };
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz');

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else { fail++; console.log('  FAIL ' + n + (d !== undefined ? '  [' + d + ']' : '')); } };

/* ---- A. the school is real ------------------------------------------------ */
const pages = {};
const page = f => pages[f] || (pages[f] = cp.execSync('tar -xzOf ' + TAR + ' "' + f + '"', { encoding: 'utf8', maxBuffer: 1 << 24 }));
const plain = t => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\[\[File:[^\]]*\]\]\s*/g, '').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1');
const school = WANTS.school || {};
ok('the school has at least eight quoted lines', Object.keys(school).length >= 8, Object.keys(school).length);
for (const k of Object.keys(school)) {
  const s = school[k], f = (s.source || '').split('.tar.gz ')[1];
  let found = false;
  try { const t = page(f); found = t.indexOf(s.quote) >= 0 || plain(t).indexOf(s.quote) >= 0; } catch (_e) { found = false; }
  ok('school.' + k + ': the quote is in its wiki page', found, f);
}
const kinds = BT.KINDS;
for (const id of Object.keys(WANTS.wants || {})) {
  const r = WANTS.wants[id];
  ok(id + ': its agenda is one of the parties module\'s three', Object.prototype.hasOwnProperty.call(P.AGENDAS, r.agenda), r.agenda);
  ok(id + ': it names at least one wiki line and every one is in the school', Array.isArray(r.wiki) && r.wiki.length > 0 && r.wiki.every(w => !!school[w]));
  ok(id + ': every ground it names is a terrain kind', (r.ground || []).every(g => kinds.indexOf(g) >= 0), (r.ground || []).join());
  ok(id + ': it is marked ours and says why', r.ours === true && typeof r.why === 'string' && r.why.length > 40);
  ok(id + ': it types no number', !Object.keys(r).some(f => typeof r[f] === 'number'));
}
for (const f of FACTIONS.factions) {
  ok(f.id + ': its want has a rule (no faction wants something nothing reads)', !!(f.want && WANTS.wants[f.want.id]), f.want && f.want.id);
}
ok('the gaps are named (the wild faction without a want, the valley\'s fourteen, the region\'s roads are RUN\'s)',
  Array.isArray(WANTS.gaps) && WANTS.gaps.length >= 3 && WANTS.gaps.some(g => /ancient_dead/.test(g)) && WANTS.gaps.some(g => /fourteen/.test(g)) && WANTS.gaps.some(g => /passAt/.test(g)));

/* ---- B. the module ---------------------------------------------------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_wants.js'), 'utf8');
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = logic.match(/\b\d+(\.\d+)?\b/g) || [];
  ok('the module types no number (numerals in its logic: ' + (nums.join(' ') || 'none') + ')', nums.every(n => n === '0' || n === '1'));
  ok('the module names no faction and no want of its own -- the data files are the only lists',
    !/(Mob|Cartel|Remnants|Caravans|brigands|zombies|beasts|noble_houses|freeway|industrial|depot)/.test(logic));
  for (const fn of ['all', 'sendFor', 'marksFor', 'wantOf']) {
    const m = new RegExp('function\\s+' + fn + '\\s*\\(([^)]*)\\)').exec(src);
    ok(fn + '() takes no player position', !!m && !/\bplayer\b|\bpx\b|\bpy\b|\bhx\b|\bhy\b/.test(m[1]), m && m[1]);
  }
}

/* ---- C. no want, no change -------------------------------------------------- */
for (const seed of [12345, 7, 999]) {
  const m = OM.buildOvermap(seed), seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
  const a = JSON.stringify(P.all(seats, { n: m.n })), b = JSON.stringify(W.all(seats, { n: m.n, data: DATA, cells: W.cellsOf(m, BT) }));
  ok('seed ' + seed + ': the valley\'s fourteen (no want) get byte for byte what the parties module gives them', a === b);
}

/* ---- D. the real valley and the region's rows ------------------------------ */
const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1), mid = (m.n - 1) / 2;
const power = f => (G.factions[f] && typeof G.factions[f].act1_power === 'number') ? G.factions[f].act1_power : null;
const rows = REGION.region_places.map(p => ({ faction: p.holder, tier: p.tier, kind: p.kind, x: Math.round(mid + p.east), y: Math.round(mid - p.north), power: power(p.holder) }))
  .concat(REGION.hostile_locations.map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north),
    power: T.TIERS.length - T.TIERS.indexOf(w.tier), wild: true, ground: w.ground })));
const all = seats.concat(rows), cells = W.cellsOf(m, BT);
ok('the valley\'s cells all carry a ground (' + cells.length + ' of ' + m.n * m.n + ')', cells.length === m.n * m.n);
const at = {}; all.forEach(s => { at[s.x + ',' + s.y] = s; });
const seatOf = p => at[p.from.x + ',' + p.from.y];
const markOf = p => at[p.to.x + ',' + p.to.y];
const wantsOf = f => !!W.wantOf(f, DATA);

const valleyOnly = P.all(seats, { n: m.n });
const vCrewTiers = {}; valleyOnly.filter(p => p.agenda === 'crew').forEach(p => { const t = (markOf(p) || {}).tier; vCrewTiers[t] = (vCrewTiers[t] || 0) + 1; });
console.log('  BEFORE, the valley alone: crews go at ' + JSON.stringify(vCrewTiers));
ok('BEFORE (measured, the row\'s complaint): every valley crew goes at a fortress', Object.keys(vCrewTiers).length === 1 && vCrewTiers.fortress >= 1);

const before = P.all(all, { n: m.n }), after = W.all(all, { n: m.n, data: DATA, cells });
const wanting = all.filter(s => s.wild && wantsOf(s.faction));
ok('the region hands in wild seats whose faction wants something (road crews, the dead, the beasts)',
  ['brigands', 'zombies', 'beasts'].every(f => wanting.some(s => s.faction === f)), wanting.map(s => s.faction).join());
const byAgenda = (ps, f) => { const o = {}; ps.filter(p => { const s = seatOf(p); return s && s.wild && s.faction === f; }).forEach(p => { o[p.agenda] = (o[p.agenda] || 0) + 1; }); return o; };
for (const f of ['brigands', 'zombies', 'beasts']) console.log('  ' + f + ': before ' + JSON.stringify(byAgenda(before, f)) + ', after ' + JSON.stringify(byAgenda(after, f)));
ok('BEFORE (measured): the road crews and the dead sent caravans, because between() never heard of them',
  (byAgenda(before, 'brigands').caravan || 0) > 0 && (byAgenda(before, 'zombies').caravan || 0) > 0);
ok('AFTER: the road crews send crews only', JSON.stringify(byAgenda(after, 'brigands')) === JSON.stringify({ crew: byAgenda(before, 'brigands').caravan }));
ok('AFTER: the dead send crews only', Object.keys(byAgenda(after, 'zombies')).join() === 'crew');
ok('AFTER: the beasts send patrols only', Object.keys(byAgenda(after, 'beasts')).join() === 'patrol');
const wantParties = after.filter(p => { const s = seatOf(p); return s && s.wild && wantsOf(s.faction); });
ok('every party a wanting wild seat sends says which want sent it', wantParties.every(p => !!p.want));
const crewMarks = wantParties.filter(p => p.agenda === 'crew').map(markOf);
const tiers = {}; crewMarks.forEach(t => { tiers[t ? t.tier : 'none'] = (tiers[t ? t.tier : 'none'] || 0) + 1; });
const kindsHit = {}; crewMarks.forEach(t => { if (t) kindsHit[t.kind] = (kindsHit[t.kind] || 0) + 1; });
console.log('  AFTER, the wanting crews go at tiers ' + JSON.stringify(tiers) + ', kinds ' + JSON.stringify(kindsHit));
ok('AFTER: every crew\'s mark is a real place (a seat), never an empty cell', crewMarks.every(t => !!t));
ok('AFTER: camps and towns are reached (at least one camp or town is a crew\'s mark)', crewMarks.some(t => t && (t.tier === 'camp' || t.tier === 'town')));
ok('AFTER: a valley camp or town is reached, not only the region\'s', crewMarks.some(t => t && (t.tier === 'camp' || t.tier === 'town') && seats.indexOf(t) >= 0));
ok('AFTER: no wild seat goes at another wild seat', crewMarks.every(t => t && !t.wild));
ok('AFTER: no crew goes at its own faction', wantParties.filter(p => p.agenda === 'crew').every(p => { const t = markOf(p); return !t || t.faction !== p.from.faction; }));
ok('AFTER: the beasts go at no place (they hold ground)', after.filter(p => (seatOf(p) || {}).faction === 'beasts').every(p => !markOf(p) || markOf(p) === seatOf(p)));
ok('AFTER: a den already on its own ground holds it (its patrol\'s target is the den)', after.filter(p => (seatOf(p) || {}).faction === 'beasts').every(p => p.to.x === p.from.x && p.to.y === p.from.y));
ok('AFTER: the seats with no want sent exactly what they sent before',
  JSON.stringify(after.filter(p => !wantsOf((seatOf(p) || {}).faction))) === JSON.stringify(before.filter(p => !wantsOf((seatOf(p) || {}).faction))));
ok('AFTER: each wanting seat still sends REACH[tier] parties', wanting.every(s => after.filter(p => seatOf(p) === s).length === T.REACH[s.tier]));

/* ---- E. the rule is the order ---------------------------------------------- */
const fw = cells.filter(c => c.kind === 'freeway');
const d = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const trip = (s, o) => d(s, o) + Math.min.apply(null, fw.map(c => d(o, c)));
for (const s of wanting.filter(s => s.faction === 'brigands')) {
  const first = after.find(p => seatOf(p) === s), marks = W.marksFor(s, all);
  const best = Math.min.apply(null, marks.map(o => trip(s, o)));
  ok('the road crew at ' + s.x + ',' + s.y + ': its first mark has the shortest trip to the freeway (' + best + ')', first && trip(s, markOf(first)) === best, first && trip(s, markOf(first)));
}
{
  const dead = wanting.filter(s => s.faction === 'zombies')[0];
  const sent = after.filter(p => seatOf(p) === dead), marks = W.marksFor(dead, all);
  const far = marks.slice().sort((a, b) => d(dead, b) - d(dead, a))[0];
  const raided = {}; raided[far.x + ',' + far.y] = 1;
  const again = W.sendFor(dead, all, { data: DATA, cells, raided });
  ok('the dead go at the nearest place first', sent.length && d(dead, markOf(sent[0])) === Math.min.apply(null, marks.map(o => d(dead, o))));
  ok('the dead take a raided place first, even the farthest (the ruin is a condition)', again && again[0].to.x === far.x && again[0].to.y === far.y);
}
{
  const house = { faction: 'noble_houses', tier: 'fortress', kind: 'fort', x: 40, y: 40, power: 9 };
  const sent = W.sendFor(house, seats.concat([house]), { data: DATA, cells, n: m.n });
  const ind = cells.filter(c => c.kind === 'industrial'), near = Math.min.apply(null, ind.map(c => d(house, c)));
  ok('the house\'s first party is a patrol on the nearest depot (industrial) ground', sent && sent[0].agenda === 'patrol'
    && BT.at(m, sent[0].to.x, sent[0].to.y).kind === 'industrial' && d(house, sent[0].to) === near, sent && JSON.stringify(sent[0].to));
  ok('the house sends no more than REACH[fortress] and one patrol', sent.length <= T.REACH.fortress && sent.filter(p => p.agenda === 'patrol').length === 1, sent.map(p => p.agenda).join());
}
{
  const swapped = JSON.parse(JSON.stringify(WANTS)); swapped.wants['hold-the-freeway'].ground = ['airport'];
  const s = wanting.filter(s => s.faction === 'brigands')[0];
  const a = W.sendFor(s, all, { data: DATA, cells }).map(p => p.to.x + ',' + p.to.y).join();
  const b = W.sendFor(s, all, { data: { factions: FACTIONS, wants: swapped }, cells }).map(p => p.to.x + ',' + p.to.y).join();
  ok('the data file drives it: the road crew wanting the airport instead goes somewhere else', a !== b, a + ' | ' + b);
  const noWant = JSON.parse(JSON.stringify(FACTIONS)); noWant.factions.forEach(f => { delete f.want; });
  ok('a faction stripped of its want falls back to the parties module exactly',
    JSON.stringify(W.all(all, { n: m.n, data: { factions: noWant, wants: WANTS }, cells })) === JSON.stringify(before));
}

/* ---- G. the next four (row [more banners]): each new want sends its parties by its own rule ---- */
{
  const nom = wanting.filter(s => s.faction === 'nomads');
  ok('the region\'s nomad camp now wants something (the water)', nom.length === 1 && W.wantOf('nomads', DATA).id === 'hold-the-water');
  const pumps = cells.filter(c => c.kind === 'solar_and_pumps');
  const wtrip = (s, o) => d(s, o) + Math.min.apply(null, pumps.map(c => d(o, c)));
  for (const s of nom) {
    const sent = after.filter(p => seatOf(p) === s), marks = W.marksFor(s, all);
    ok('the water people send crews only', sent.length === T.REACH[s.tier] && sent.every(p => p.agenda === 'crew' && p.want === 'hold-the-water'), sent.map(p => p.agenda).join());
    ok('their first mark has the shortest trip to the pumps', sent.length && wtrip(s, markOf(sent[0])) === Math.min.apply(null, marks.map(o => wtrip(s, o))));
  }
  const probe = (faction, x, y, ground) => W.sendFor({ faction, tier: 'camp', kind: 'camp', x, y, power: 1, wild: true, ground: ground || [] }, seats, { data: DATA, cells, n: m.n });
  const nearest = (kinds, at) => Math.min.apply(null, cells.filter(c => kinds.indexOf(c.kind) >= 0).map(c => d(at, c)));
  const merc = probe('mercenaries', 10, 10);
  ok('the hired guns walk to the nearest ground with money on it (the strip or the casino floor)', merc && merc.length === 1 && merc[0].agenda === 'patrol'
    && ['the_strip', 'casino_floor'].indexOf(BT.at(m, merc[0].to.x, merc[0].to.y).kind) >= 0 && d({ x: 10, y: 10 }, merc[0].to) === nearest(['the_strip', 'casino_floor'], { x: 10, y: 10 }), merc && JSON.stringify(merc[0].to));
  const bh = probe('bounty_hunters', 60, 20);
  ok('the head takers patrol the nearest road crews\' ground (freeway or hills), never a place', bh && bh.length === 1 && bh[0].agenda === 'patrol' && bh[0].toward === null
    && ['freeway', 'hills'].indexOf(BT.at(m, bh[0].to.x, bh[0].to.y).kind) >= 0 && d({ x: 60, y: 20 }, bh[0].to) === nearest(['freeway', 'hills'], { x: 60, y: 20 }), bh && JSON.stringify(bh[0].to));
  const off = probe('cultists', 5, 80), on = probe('cultists', 5, 80, ['trailer_park']);
  ok('a chapel off the trailer park walks to the nearest one', off && BT.at(m, off[0].to.x, off[0].to.y).kind === 'trailer_park' && d({ x: 5, y: 80 }, off[0].to) === nearest(['trailer_park'], { x: 5, y: 80 }), off && JSON.stringify(off[0].to));
  ok('a chapel on the trailer park holds it', on && on[0].to.x === 5 && on[0].to.y === 80);
  ok('every one of the eight factions has a want with a rule', FACTIONS.factions.length >= 8 && FACTIONS.factions.every(f => !!W.wantOf(f.id, DATA)));
}

/* ---- F. the shape ------------------------------------------------------------ */
{
  const again = W.all(all, { n: m.n, data: DATA, cells });
  ok('the same valley gives the same parties twice', JSON.stringify(again) === JSON.stringify(after));
  const keys = Object.keys(before[0]).sort().join();
  ok('every want-sent party carries every field the parties module\'s parties carry', wantParties.every(p => Object.keys(before[0]).every(k => k in p)), keys);
  P.advance(again, 10, 3);
  ok('advance() moves them like any party', again.filter(p => p.want && p.agenda === 'crew').every(p => p.at.x !== p.from.x || p.at.y !== p.from.y));
  ok('legOf() and say() read them', wantParties.every(p => typeof P.legOf(p) === 'string' && P.say(p).length > 0));
}

console.log('\n=== WANTS SEND PARTIES GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
