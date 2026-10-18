/* ============================================================================
   TAKE A TOWN GATE (10/18/26, FACTIONS lane) -- row [take a town]
   OWNING-ANOTHER-SETTLEMENT-IS-ENDGAME (rule 56, Paolo 10/1: 'owning the other
   settlements... is some endgame shit').

   THE ROW: "Research first: how Battle Brothers lets you take or lose anything
   (the Conquered situation, Contracts, Late Game Crises); the shape for us: a take
   contract at the end of an act, a long chain not a click, a gate that refuses
   before the late third of an act. No code that makes it cheap."

   WHAT IT HOLDS:
     A. the school is real: every quote in records/target/bb/take.json is read back
        out of the wiki tarball, his words are in their records, every door and
        step names school lines that exist, every 'ours' says why;
     B. the numbers are read, never typed: each of the_numbers is recomputed from
        where it says it is read from (the late third, the siege days, one per act,
        the two bars, Conquered's 3 days parsed off the Siege Fortification page);
        the data types no number; the module types none but 0 and 1, names no
        faction, rolls no dice;
     C. the refusals on the REAL valley (seed 12345): too early for every tier (a
        camp you may RAID from the start still waits: raiding is not owning), no
        progress, no home, a ruin, already yours, no door, one take per act (the
        next act opens it again), the inside door never at a fortress;
     D. the chain, in order only: the roads before the siege, the siege's days
        before a surrender, an assault skips the siege, a lost assault or hold
        fails and writes nothing, a won take writes ONE ledger entry by 'contract'
        to the company from the holder, Conquered stands the wiki's 3 days, a burn
        writes a ruin by 'contract', a base the world takes mid-chain makes it moot,
        the hold waits only when somebody is left to send the last force;
     E. the timeline (status) lights the five steps; a save restores whole chains;
     F. six mutations of the module go red (the late third, the home, one per act,
        the order, the siege before a surrender, the write's 'contract').

   node gates/take_a_town_gate.js   (env TAKE_FILE swaps the data file)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const R = p => require(path.join(ROOT, p));
const T = R('engine/bohemia_towns.js'), CE = R('engine/bohemia_cityedit.js'), OM = R('engine/bohemia_overmap.js');
const G = R('engine/BOHEMIA_faction_graph.json'), H = R('engine/bohemia_homebases.js'), BT = R('engine/bohemia_between.js');
const REL = R('engine/bohemia_relations.js'), AT = R('engine/bohemia_arrivaltraits.js');
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const D = process.env.TAKE_FILE ? JSON.parse(fs.readFileSync(process.env.TAKE_FILE, 'utf8')) : read('records/target/bb/take.json');
const RD = read('records/target/bb/relations.json'), AD = read('records/target/bb/arrival_traits.json');
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz');
const MOD = path.join(ROOT, 'engine/bohemia_take.js');
REL.set(RD); AT.set(AD);

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else { fail++; console.log('  FAIL ' + n + (d !== undefined ? '  [' + d + ']' : '')); } };

/* ---- A. the school is real ------------------------------------------------ */
const pages = {};
const page = f => pages[f] || (pages[f] = cp.execSync('tar -xzOf ' + TAR + ' "' + f + '"', { encoding: 'utf8', maxBuffer: 1 << 24 }));
const plain = t => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\[\[File:[^\]]*\]\]\s*/g, '').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1');
const school = D.school || {};
ok('the school has at least twenty quoted lines', Object.keys(school).length >= 20, Object.keys(school).length);
for (const k of Object.keys(school)) {
  const s = school[k], f = (s.source || '').split('.tar.gz ')[1];
  let found = false;
  try { const t = page(f); found = t.indexOf(s.quote) >= 0 || plain(t).indexOf(s.quote) >= 0; } catch (_e) { found = false; }
  ok('school.' + k + ': the quote is in its wiki page', found, f);
  ok('school.' + k + ': it says what it means for us', typeof s.reading === 'string' && s.reading.length > 20);
}
for (const k of ['crisis_timing', 'houses_take_towns', 'contract_besiege', 'siege_surrender', 'siege_last_force', 'siege_conquered_days', 'dev_no_player_base'])
  ok('the row\'s three pages are all read (Late Game Crises, Siege Fortification, the developer): ' + k, !!school[k]);
for (const w of D.his_words || []) {
  let found = false;
  try { found = fs.readFileSync(path.join(ROOT, w.source), 'utf8').indexOf(w.quote) >= 0; } catch (_e) { found = false; }
  ok('his words are in their record: ' + w.quote.slice(0, 40), found, w.source);
}
ok('the real world is cited (two captains who took a city, each with a URL)', (D.real_world || []).length >= 2 && D.real_world.every(r => /^https:\/\//.test(r.url) && r.reading.length > 40));
for (const id of Object.keys(D.doors || {})) {
  const d = D.doors[id];
  ok('door ' + id + ': its test is one the module knows', ['hostile_to_holder', 'inside_not_fortress', 'holder_hostile_to_you'].indexOf(d.test) >= 0, d.test);
  ok('door ' + id + ': every wiki line it names is in the school', Array.isArray(d.wiki) && d.wiki.length > 0 && d.wiki.every(w => !!school[w]));
  ok('door ' + id + ': marked ours with why', d.ours === true && typeof d.why === 'string' && d.why.length > 60);
}
ok('three doors: hired (Battle Brothers\' own), inside, beef', JSON.stringify(Object.keys(D.doors)) === JSON.stringify(['hired', 'inside', 'beef']));

/* ---- B. the numbers are read, never typed ----------------------------------- */
const TK = R('engine/bohemia_take.js'); TK.load(fs, path);
ok('the data\'s steps are the module\'s five, in order', JSON.stringify((D.steps || []).map(s => s.id)) === JSON.stringify(TK.STEPS) && TK.STEPS.length === 5);
for (const s of D.steps || []) {
  ok('step ' + s.id + ': every wiki line it names is in the school', Array.isArray(s.wiki) && s.wiki.length > 0 && s.wiki.every(w => !!school[w]));
  ok('step ' + s.id + ': ours with why, its name a draft', s.ours === true && s.why.length > 60 && s.draft === true && /^[A-Z ]+$/.test(s.name));
}
const typed = [];
(function walk(o, at) { if (typeof o === 'number') typed.push(at); else if (o && typeof o === 'object') for (const k of Object.keys(o)) walk(o[k], at + '.' + k); })(D, 'take');
ok('the data file types no number (numbers live where the_numbers say)', typed.length === 0, typed.join());
const N = D.the_numbers || {}, bandOf = id => RD.bands.value.find(b => b.id === id);
const siegePage = plain(page('bb_all/1793_Siege Fortification.txt'));
const wikiDays = (/conquered settlement situation for (\d+) days/.exec(siegePage) || [])[1];
ok('late_third: the module\'s gate is openAt(\'fortress\') = 2/3', Math.abs(H.openAt('fortress') - 2 / 3) < 1e-9 && N.late_third.at_write === '2/3' && /openAt\('fortress'\)/.test(N.late_third.read_from));
ok('siege_days: the raid chain\'s own prepDays', String(H.RAID_DEFAULTS.prepDays) === N.siege_days.at_write && N.siege_days.draft === true && N.siege_days.tuning === true);
ok('per_act: the raid chain\'s own perAct', String(H.RAID_DEFAULTS.perAct) === N.per_act.at_write && N.per_act.draft === true);
ok('open_bar: the Open band\'s bottom', String(bandOf('open').lo) === N.open_bar.at_write);
ok('hostile_bar: the Hostile band\'s top', String(bandOf('hostile').hi) === N.hostile_bar.at_write);
ok('conquered_days: arrival_traits.json carries the wiki\'s number, parsed off the page (' + wikiDays + ')',
  !!wikiDays && AD.traits.conquered.duration_days.value === +wikiDays && String(+wikiDays) === N.conquered_days.at_write &&
  siegePage.indexOf(AD.traits.conquered.duration_days.quote) >= 0);
ok('the old claim is gone: arrival_traits.json no longer says Conquered\'s length is not on the wiki', /Conquered carries its own/.test(AD.duration_days.why));
const SRC = fs.readFileSync(MOD, 'utf8');
{
  const logic = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = logic.match(/\b\d+(\.\d+)?\b/g) || [];
  ok('the module types no number (numerals in its logic: ' + (nums.join(' ') || 'none') + ')', nums.every(n => n === '0' || n === '1'));
  ok('the module names no faction', !Object.keys(G.factions).some(f => new RegExp('\\b' + f + '\\b').test(logic)));
  ok('the module rolls no dice', !/Math\.random|rand\(/.test(logic));
  ok('the module writes only through the ledger\'s took() and ruined(), by \'contract\'', /H\.took\(/.test(SRC) && /H\.ruined\(/.test(SRC) && (SRC.match(/by: 'contract'/g) || []).length === 2 && !/entries\.push/.test(SRC));
}
ok('the gaps and the routes are written down', (D.gaps || []).length >= 3 && D.gaps.some(g => /region/i.test(g)) && (D.routed || []).length >= 4);
ok('every refusal the module can give is explained in the data', (SRC.match(/reason: '([A-Z_]+)'/g) || []).map(s => s.split("'")[1]).filter(r => r !== 'NOT_LOADED').every(r => !!(D.refusals || {})[r]));

/* ---- the real valley -------------------------------------------------------- */
const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
const keys = seats.map(s => s.faction), tierOf = f => (seats.find(s => s.faction === f) || {}).tier;
const factions = Object.keys(G.factions);
const between = (a, b) => BT.between(a, b);
const LATE = H.openAt('fortress'), EARLY = LATE - 0.01;
const tgt = f => ({ base: f, tier: tierOf(f), seed: f });
/* the company's home: the camp his first home base sits on in the build screen's way (took to 'you'); Custom is his own faction (8/26), never a target */
const HOME = 'Custom';
function world(o) {
  o = o || {};
  const rec = H.make({ act: o.act || 1 });
  if (!o.homeless) H.took(rec, { base: HOME, to: H.YOU, by: 'deal', day: 1 });
  const bars = REL.make(); Object.assign(bars.bars, o.bars || {});
  return { rec, ctx: { progress: o.progress == null ? LATE : o.progress, day: o.day || 30, bases: keys, bars, between, factions, inside: o.inside || [], traits: AT.make() } };
}

/* ---- C, D, E as one suite, so a mutant can be run through it --------------- */
function suite(M, say) {
  let bad = 0;
  const chk = (n, c, d) => { if (!c) bad++; if (say) ok(n, c, d); };
  const tk0 = () => M.make();
  /* C. refusals */
  { const w = world({ progress: EARLY, bars: { Remnants: 60 } });
    for (const s of seats) if (s.faction !== HOME) chk('too early: ' + s.faction + ' (' + s.tier + ') waits for the late third', M.offer(tk0(), w.rec, tgt(s.faction), w.ctx).reason === 'TOO_EARLY');
    chk('and a camp you could RAID from the start still waits: raiding is not owning', H.raidable('camp', 0, false) === true && M.offer(tk0(), w.rec, tgt('Colorful'), Object.assign({}, w.ctx, { progress: 0 })).reason === 'TOO_EARLY'); }
  { const w = world({ bars: { Remnants: 60 } }); delete w.ctx.progress;
    chk('no progress is a no, never a guess', M.offer(tk0(), w.rec, tgt('Cartel'), w.ctx).reason === 'NO_PROGRESS'); }
  { const w = world({ homeless: true, bars: { Remnants: 60 } });
    chk('no home of your own: refused ("your settlement at your base")', M.offer(tk0(), w.rec, tgt('Cartel'), w.ctx).reason === 'NO_HOME'); }
  { const w = world({ bars: { Remnants: 60 } });
    const o = M.offer(tk0(), w.rec, tgt('Cartel'), w.ctx);
    chk('HIRED: the Remnants (at war with the Cartel, canon) at Open hire you against the Cartel\'s fortress', o.ok && o.door === 'hired' && o.by === 'Remnants', JSON.stringify(o));
    const w2 = world({ bars: { Remnants: 59 } });
    chk('one point under Open and nobody hires you', M.offer(tk0(), w2.rec, tgt('Cartel'), w2.ctx).reason === 'NO_DOOR'); }
  { const w = world();
    chk('the Mob: nobody canon is hostile to it, nobody inside, no beef: NO_DOOR', M.offer(tk0(), w.rec, tgt('Mob'), w.ctx).reason === 'NO_DOOR'); }
  { const w = world({ bars: { Church: 9 } });
    const o = M.offer(tk0(), w.rec, tgt('Church'), w.ctx);
    chk('BEEF: the Church at the Hostile top (9) is yours to go after with no employer', o.ok && o.door === 'beef', JSON.stringify(o));
    const w2 = world({ bars: { Church: 10 } });
    chk('at Threatening (10) it is not', M.offer(tk0(), w2.rec, tgt('Church'), w2.ctx).reason === 'NO_DOOR'); }
  { const w = world({ bars: { Pures: 60 }, inside: ['Pures'] });
    const o = M.offer(tk0(), w.rec, tgt('Blues'), w.ctx);
    chk('INSIDE: the Pures living on the Blues\' town and Open with you open its gate', o.ok && o.door === 'inside' && o.by === 'Pures', JSON.stringify(o));
    chk('INSIDE never opens a fortress (the wiki: a fortified place has no townsfolk of its own)', tierOf('Mob') === 'fortress' && M.offer(tk0(), w.rec, tgt('Mob'), w.ctx).reason === 'NO_DOOR'); }
  { const w = world({ bars: { Church: 0 } });
    H.took(w.rec, { base: 'Church', to: H.YOU, by: 'deal', day: 2 });
    chk('already yours', M.offer(tk0(), w.rec, tgt('Church'), w.ctx).reason === 'ALREADY_YOURS');
    const w2 = world({ bars: { Church: 0 } }); H.ruined(w2.rec, { base: 'Church', by: 'raid', day: 2 });
    chk('a ruin is never taken', M.offer(tk0(), w2.rec, tgt('Church'), w2.ctx).reason === 'RUIN'); }
  { const w = world({ bars: { Church: 0, Remnants: 60 } }), tk = tk0();
    const a = M.open(tk, w.rec, tgt('Church'), w.ctx);
    chk('a take opens', a.applied && a.chain.state === 'open');
    chk('a second on the same base is refused while it runs', M.offer(tk, w.rec, tgt('Church'), w.ctx).reason === 'ALREADY_OPEN');
    chk('one take per act: a second base this act is refused', M.offer(tk, w.rec, tgt('Cartel'), w.ctx).reason === 'ONE_PER_ACT');
    M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    M.step(tk, w.rec, 'Church', { step: 'the_gate', how: 'assault', won: false, day: 32 }, w.ctx);
    chk('a failed take still spends the act\'s one', M.offer(tk, w.rec, tgt('Cartel'), w.ctx).reason === 'ONE_PER_ACT');
    H.setAct(w.rec, 2);
    chk('the next act opens it again', M.offer(tk, w.rec, tgt('Cartel'), w.ctx).ok === true); }

  /* D. the chain */
  { const w = world({ bars: { Church: 0 } }), tk = tk0(), before = w.rec.entries.length;
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    const st = (e) => M.step(tk, w.rec, 'Church', e, w.ctx);
    chk('the siege before the roads: OUT_OF_ORDER', st({ step: 'the_siege', days: 9, day: 31 }).reason === 'OUT_OF_ORDER');
    chk('the gate before the roads: OUT_OF_ORDER', st({ step: 'the_gate', how: 'surrender', day: 31 }).reason === 'OUT_OF_ORDER');
    chk('a party still out: NOT_YET', st({ step: 'cut_the_roads', partiesOut: 1, day: 31 }).reason === 'NOT_YET');
    chk('no count: BAD_EVENT', st({ step: 'cut_the_roads', day: 31 }).reason === 'BAD_EVENT');
    chk('roads cut', st({ step: 'cut_the_roads', partiesOut: 0, day: 32 }).applied === true);
    chk('the roads twice: refused', st({ step: 'cut_the_roads', partiesOut: 0, day: 32 }).applied === false);
    chk('a surrender before the siege held: SIEGE_NOT_HELD', st({ step: 'the_gate', how: 'surrender', day: 33 }).reason === 'SIEGE_NOT_HELD');
    chk('the siege one day short: NOT_YET', st({ step: 'the_siege', days: H.RAID_DEFAULTS.prepDays - 1, day: 35 }).reason === 'NOT_YET');
    chk('the siege held its days', st({ step: 'the_siege', days: H.RAID_DEFAULTS.prepDays, day: 36 }).applied === true);
    chk('the hold before the gate: OUT_OF_ORDER', st({ step: 'the_hold', won: true, day: 36 }).reason === 'OUT_OF_ORDER');
    const g = st({ step: 'the_gate', how: 'surrender', day: 37 });
    chk('the Church holds no other base and no warm friend holds one: nobody comes, the gate is the end', g.applied && g.chain.state === 'yours' && g.chain.steps.the_hold.how === 'nobody came', JSON.stringify(g.chain && g.chain.steps.the_hold));
    const e = w.rec.entries.slice(before);
    chk('ONE ledger entry: the Church\'s base, from the Church, to the company, by contract', e.length === 1 && e[0].base === 'Church' && e[0].from === 'Church' && e[0].to === H.YOU && e[0].how === 'taken' && e[0].by === 'contract', JSON.stringify(e));
    chk('the company now holds two bases (its home and the Church\'s)', H.heldBy(w.rec, 'Church', 1) === H.YOU && H.ownedBy(w.rec, seats, H.YOU, 1).length === 2);
    chk('the act\'s arithmetic: +1 the company, -1 the Church', H.netFor(w.rec, 1)[H.YOU] === 2 && H.netFor(w.rec, 1).Church === -1);
    const days = AD.traits.conquered.duration_days.value;
    chk('Conquered stands the wiki\'s ' + days + ' days and then ends', AT.active(w.ctx.traits, 'Church', 37 + days - 1).indexOf('conquered') >= 0 && AT.active(w.ctx.traits, 'Church', 37 + days).indexOf('conquered') < 0);
    const tl = M.status(tk, 'Church').map(s => s.state).join(' ');
    chk('the timeline at the end: every step done', tl === 'done done done done done', tl); }
  { const w = world({ bars: { Church: 0 } }), tk = tk0(), before = w.rec.entries.length;
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    let tl = M.status(tk, 'Church').map(s => s.state).join(' ');
    chk('the timeline on opening: the ask done, the roads now, the rest later', tl === 'done now later later later', tl);
    M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    const a = M.step(tk, w.rec, 'Church', { step: 'the_gate', how: 'assault', won: true, day: 32 }, w.ctx);
    chk('an ASSAULT any time after the roads skips the siege', a.applied && a.chain.steps.the_siege.state === 'skipped' && a.chain.state === 'yours');
    tl = M.status(tk, 'Church').map(s => s.state).join(' ');
    chk('the timeline shows the skipped siege', tl === 'done done skipped done done', tl);
    chk('and it writes the same one entry', w.rec.entries.length - before === 1); }
  { const w = world({ bars: { Church: 0 } }), tk = tk0(), before = JSON.stringify(w.rec.entries);
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    chk('an assault without won: BAD_EVENT', M.step(tk, w.rec, 'Church', { step: 'the_gate', how: 'assault', day: 32 }, w.ctx).reason === 'BAD_EVENT');
    const l = M.step(tk, w.rec, 'Church', { step: 'the_gate', how: 'assault', won: false, day: 32 }, w.ctx);
    chk('a LOST assault fails the take and writes nothing', l.chain.state === 'failed' && JSON.stringify(w.rec.entries) === before && H.heldBy(w.rec, 'Church', 1) === 'Church');
    chk('a failed take takes no more steps', M.step(tk, w.rec, 'Church', { step: 'the_hold', won: true, day: 33 }, w.ctx).reason === 'NO_CHAIN'); }
  { const w = world({ bars: { Church: 0 } }), tk = tk0();
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    const b = M.step(tk, w.rec, 'Church', { step: 'the_gate', how: 'burn', day: 32 }, w.ctx);
    const e = w.rec.entries[w.rec.entries.length - 1];
    chk('BURN: the base is a ruin, by contract (his "yours or ruined")', b.applied && b.chain.state === 'ruined' && e.how === 'ruined' && e.by === 'contract' && H.isRuin(w.rec, 'Church', 1));
    chk('and nobody takes it after', M.offer(M.make(), w.rec, tgt('Church'), w.ctx).reason === 'RUIN'); }
  { const w = world({ bars: { Church: 0 } }), tk = tk0();
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    H.took(w.rec, { base: 'Church', to: 'Mob', by: 'raid', day: 31 });
    chk('the world takes the base mid-chain: MOOT', M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 32 }, w.ctx).reason === 'MOOT' && tk.chains[0].state === 'moot'); }
  { /* the hold: the Mob's base, the Remnants are warm with the Mob (professional respect, canon) and hold their own */
    const warm = between('Remnants', 'Mob') || between('Mob', 'Remnants');
    const w = world({ bars: { Mob: 0 } }), tk = tk0(), before = w.rec.entries.length;
    M.open(tk, w.rec, tgt('Mob'), w.ctx);
    M.step(tk, w.rec, 'Mob', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    const g = M.step(tk, w.rec, 'Mob', { step: 'the_gate', how: 'assault', won: true, day: 32 }, w.ctx);
    chk('THE HOLD WAITS when somebody is left: the Remnants (warm with the Mob in canon) send the last force', !!warm && warm.sign === 'warm' && g.applied && g.chain.state === 'open' && g.chain.relief === 'Remnants', g.chain && g.chain.relief);
    chk('nothing is written until the hold', w.rec.entries.length === before);
    chk('the hold without won: BAD_EVENT', M.step(tk, w.rec, 'Mob', { step: 'the_hold', day: 33 }, w.ctx).reason === 'BAD_EVENT');
    const h = M.step(tk, w.rec, 'Mob', { step: 'the_hold', won: true, day: 33 }, w.ctx);
    chk('the hold won: the Mob\'s base is the company\'s', h.applied && h.chain.state === 'yours' && H.heldBy(w.rec, 'Mob', 1) === H.YOU);
    const w2 = world({ bars: { Mob: 0 } }), tk2 = tk0();
    H.ruined(w2.rec, { base: 'Remnants', by: 'raid', day: 2 });
    M.open(tk2, w2.rec, tgt('Mob'), w2.ctx);
    M.step(tk2, w2.rec, 'Mob', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w2.ctx);
    const g2 = M.step(tk2, w2.rec, 'Mob', { step: 'the_gate', how: 'assault', won: true, day: 32 }, w2.ctx);
    chk('with the friend\'s base a ruin, nobody is left and the gate is the end', g2.chain.state === 'yours' && g2.chain.relief === null);
    const w3 = world({ bars: { Mob: 0 } }), tk3 = tk0(), b3 = JSON.stringify(w3.rec.entries);
    M.open(tk3, w3.rec, tgt('Mob'), w3.ctx);
    M.step(tk3, w3.rec, 'Mob', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w3.ctx);
    M.step(tk3, w3.rec, 'Mob', { step: 'the_gate', how: 'assault', won: true, day: 32 }, w3.ctx);
    const h3 = M.step(tk3, w3.rec, 'Mob', { step: 'the_hold', won: false, day: 33 }, w3.ctx);
    chk('the hold LOST: the take fails and the ledger is untouched', h3.chain.state === 'failed' && JSON.stringify(w3.rec.entries) === b3); }
  { const w = world({ bars: { Church: 0 } }), tk = tk0();
    M.open(tk, w.rec, tgt('Church'), w.ctx);
    M.step(tk, w.rec, 'Church', { step: 'cut_the_roads', partiesOut: 0, day: 31 }, w.ctx);
    const back = M.restore(JSON.parse(JSON.stringify(tk)));
    chk('a save restores the chain whole and it runs on', back.chains.length === 1 && M.step(back, w.rec, 'Church', { step: 'the_siege', days: H.RAID_DEFAULTS.prepDays, day: 36 }, w.ctx).applied === true);
    chk('junk in a save is dropped', M.restore({ chains: [{ base: 'x' }, null, { base: 'y', act: 1, steps: {}, state: 'weird' }] }).chains.length === 0 && M.restore(null).chains.length === 0); }
  return bad;
}
console.log('  on the real valley (seed 12345): ' + seats.map(s => s.faction + ' ' + s.tier).join(', '));
ok('the real module passes the whole suite', suite(TK, true) === 0);

/* ---- F. mutations ------------------------------------------------------------ */
function mutant(from, to) {
  if (SRC.indexOf(from) < 0) return null;
  const sandbox = { module: { exports: {} }, require: p => require(path.join(ROOT, 'engine', p)), __dirname: path.join(ROOT, 'engine'), console };
  sandbox.exports = sandbox.module.exports; sandbox.globalThis = sandbox;
  vm.runInNewContext(SRC.replace(from, to), sandbox, { filename: 'bohemia_take.mutant.js' });
  const M = sandbox.module.exports; M.load(fs, path); return M;
}
const MUTANTS = [
  ['the late third', "if (!(ctx.progress >= H.openAt('fortress'))) return { ok: false, reason: 'TOO_EARLY' };", ''],
  ['the home', "if (!standing(rec, ctx, H.YOU, t.base).length) return { ok: false, reason: 'NO_HOME' };", ''],
  ['one per act', "if (takesIn(tk, rec.act) >= H.RAID_DEFAULTS.perAct) return { ok: false, reason: 'ONE_PER_ACT' };", ''],
  ['the order', "if (!done(c, 'cut_the_roads')) return { applied: false, reason: 'OUT_OF_ORDER' };", ''],
  ['the siege before a surrender', "if (!done(c, 'the_siege')) return { applied: false, reason: 'SIEGE_NOT_HELD' };", ''],
  ['the write is a contract', "to: H.YOU, by: 'contract'", "to: H.YOU, by: 'raid'"]
];
for (const [name, from, to] of MUTANTS) {
  const M = mutant(from, to);
  ok('mutation [' + name + '] applies to the module', !!M);
  if (M) { let bad = 0; try { bad = suite(M, false); } catch (_e) { bad = 1; } ok('mutation [' + name + '] goes red (' + bad + ' checks)', bad > 0); }
}

console.log('TAKE A TOWN GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
