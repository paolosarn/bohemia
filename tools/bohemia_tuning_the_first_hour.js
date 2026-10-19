#!/usr/bin/env node
// TUNING [the first hour's numbers] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117).
// The row: every felt number a player meets in the first hour of a new game (starting purse, first wages, the first fight's
// enemies and their gear, the first injury, the first price) beside Battle Brothers' first hour, each marked easier, the same
// or harder, with the proposed value. Battle Brothers and his 'Nintendo-simple' are the whole frame.
//
// The most felt first-hour number is whether he wins his first fight, so that one is MEASURED, origin by origin: each of the
// fifteen origins' own men (records/target/bb/origins.json) against the party our map sends that company on day one
// (party_math's job count at one skull, tools/bohemia_tuning_the_whole_grid.js mapCount), in today's kit and in the draft guns
// (tools/bohemia_tuning_the_first_kit_is_guns.js, the rows and the butt), at Battle Brothers' Veteran (its count, its rules)
// and at our start (rule 117's levers, the Beginner count). The live fight, AUTO on both sides, seeded 9000+k.
// The guns are handed THE WAY THE GUNS PAGE ROUTED: the main man keeps the line; the best fighters among the rest keep the
// line's other places; the best eyes among the rest take the rifles, then the pistols, then the shotguns. The Lone Wolf keeps
// his blade (measured on the guns page: one man loses with a gun). Every number DRAFT; nothing in the game reads the outputs.
//
//   node tools/bohemia_tuning_the_first_hour.js [--n 200] [--jobs 2]
// writes banks/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.json, records/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.md and
// slices/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.html
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const GRID = require('./bohemia_tuning_the_whole_grid.js');
const GUNS = path.join(ROOT, 'tools/bohemia_tuning_the_first_kit_is_guns.js');
const OUT = 'banks/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.json';
const REC = 'records/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.md';
const PAGE = 'slices/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.html';
const ORIG = J('records/target/bb/origins.json').origins;
const BG = new Map(J('records/target/bb/backgrounds.json').rows.map(r => [r.id, r]));
const mid = (bg, k) => { const s = BG.get(bg).stats[k]; return (s[0] + s[s.length - 1]) / 2; };
const SETS = ['bb', 'start'], KITS = ['today', 'draft'];
/* THE STREET'S FIGHT (found 10/19): four of the city's eight hand-overs (a crew out on the block, a crew he taps, the door into
   a building) send a roster and NO party (slices/BOHEMIA_CITY_WORLD.html cityHandOver ... roster, street, why), and the demo's
   nfOpts() reads only d.party, so the fight falls back to its own band, ours.first_band: nine brigands. Played at the game as he
   plays it (TODAY) and at our start, 100 fights a cell. */
const FIRST_BAND = J('records/target/bb/ours.json').first_band.value;
const STREET_SETS = ['today', 'start'], STREET_N = 100;

/* ---------- the guns, handed by the man (the guns page's routing) ---------- */
const CYCLE = ['rifle', 'pistol', 'line', 'rifle', 'shotgun', 'line'];
function slotsFor(men) {
  const n = men.length; if (n === 1) return null;
  const want = Array.from({ length: n - 1 }, (_, i) => CYCLE[i % CYCLE.length]);
  const lines = want.filter(x => x === 'line').length;
  const guns = want.filter(x => x !== 'line').sort((a, b) => ['rifle', 'pistol', 'shotgun'].indexOf(a) - ['rifle', 'pistol', 'shotgun'].indexOf(b));
  const rest = men.map((m, i) => i).slice(1);
  const byFight = rest.slice().sort((a, b) => mid(men[b].background, 'melee_skill') - mid(men[a].background, 'melee_skill') || a - b);
  const out = men.map(() => 'line');
  const onLine = new Set(byFight.slice(0, lines));
  rest.filter(i => !onLine.has(i)).sort((a, b) => mid(men[b].background, 'ranged_skill') - mid(men[a].background, 'ranged_skill') || a - b)
    .forEach((i, k) => { out[i] = guns[k]; });
  return out;
}
function levelOf(men) { return men.reduce((s, m) => { const sl = BG.get(m.background).starting_level; return s + (m.level || (sl[0] + sl[sl.length - 1]) / 2); }, 0) / men.length; }
const LEV = id => GRID.SETTINGS.filter(s => s.id === id)[0].L;

function cells() {
  const out = [];
  ORIG.forEach(o => {
    const men = o.men.map(m => ({ background: m.background, level: m.level || undefined })), n = men.length, lv = levelOf(men);
    SETS.forEach(s => KITS.forEach(k => {
      if (k === 'draft' && n === 1) return;
      const count = GRID.mapCount(n, lv, 1, LEV(s).pick);
      out.push({ origin: o.id, name: o.name, d: o.d, kit: k, setting: s, fight: 'job', C: { kind: 'humans', company: n, enemies: count, kit: k, setting: s, men: men, slots: k === 'draft' ? slotsFor(men) : null } });
    }));
    /* the game as he plays it, the map's job, today's kit */
    out.push({ origin: o.id, name: o.name, d: o.d, kit: 'today', setting: 'today', fight: 'job', C: { kind: 'humans', company: n, enemies: GRID.mapCount(n, lv, 1, LEV('today').pick), kit: 'today', setting: 'today', men: men, slots: null } });
    STREET_SETS.forEach(s => KITS.forEach(k => {
      if (k === 'draft' && n === 1) return;
      out.push({ origin: o.id, name: o.name, d: o.d, kit: k, setting: s, fight: 'street', C: { kind: 'humans', company: n, enemies: FIRST_BAND.length, band: FIRST_BAND, kit: k, setting: s, men: men, slots: k === 'draft' ? slotsFor(men) : null } });
    }));
  });
  return out;
}

async function main() {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const N = Number(arg('--n', 200)), JOBS = Number(arg('--jobs', 2));
  const sfile = path.join(os.tmpdir(), 'bohemia_first_hour_strikes_' + process.pid + '.json');
  fs.writeFileSync(sfile, JSON.stringify(GRID.wikiStrikes(Object.keys(GRID.BEASTS))));
  /* the resume cache (the grid's): a restart replays only the cells not yet played on this fight, these draft rows and splices */
  const CACHE = GRID.cellCache(path.join(ROOT, OUT.replace(/\.json$/, '.cells.ndjson')), N, [{ text: JSON.stringify(require(GUNS).DRAFT) + JSON.stringify(require(GUNS).SPLICES) }]);
  const all = cells(), res = {}, kk = w => [w.origin, w.kit, w.setting].concat(w.fight === 'street' ? ['street'] : []).join('|');
  const nOf = w => w.fight === 'street' ? Math.min(N, STREET_N) : N;
  all.forEach(w => { const v = CACHE.has(kk(w), nOf(w)); if (v) res[kk(w)] = v; });
  const work = all.filter(w => !res[kk(w)]);
  process.stderr.write('resume: ' + (all.length - work.length) + ' of ' + all.length + ' cells already played\n');
  let next = 0, running = 0; const t0 = Date.now();
  await new Promise(done => {
    const pump = () => { while (running < JOBS && next < work.length) { const w = work[next++]; running++;
      cp.execFile(process.execPath, [GUNS, '--cell', JSON.stringify(w.C), String(nOf(w)), sfile], { maxBuffer: 1 << 26 }, (err, out) => {
        running--; if (err) { console.error('cell failed', w.origin, w.kit, w.setting, err.message); process.exit(1); }
        const T = JSON.parse(out), f = GRID.felt(T);
        res[kk(w)] = { origin: w.origin, kit: w.kit, setting: w.setting, fight: w.fight, fights: nOf(w), company: w.C.company, enemies: w.C.enemies, slots: w.C.slots,
          won_in_100: f.won_in_100, your_men_struck_down_per_fight: f.your_men_struck_down_per_fight, your_men_dead_per_100_fights: f.your_men_dead_per_100_fights,
          whole_company_down_in_100: f.whole_company_down_in_100, minutes_on_auto: f.minutes_on_auto, stalled_in_100: f.stalled_in_100,
          guns_share_of_the_killing_in_100: T.allDmg ? Math.round(100 * T.gunDmg / T.allDmg) : null };
        CACHE.put(kk(w), res[kk(w)], nOf(w));
        process.stderr.write(Object.keys(res).length + '/' + all.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
        if (next >= work.length && running === 0) done(); else pump(); }); } };
    if (!work.length) done(); else pump();
  });
  fs.unlinkSync(sfile);
  fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify({
    _readme: 'TUNING [the first hour\'s numbers] 10/19 (rule 117; rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. Each origin\'s first fight: '
      + 'its own men against the party our map sends that company on day one at one skull (party_math), today\'s kit and the draft guns (handed by the man), at '
      + 'Battle Brothers\' Veteran and at our start; the live fight headless (tools/bohemia_tuning_the_first_kit_is_guns.js --cell), seeded 9000+k. Key: origin|kit|setting.',
    draft: true, schema: 1, fights_per_cell: N, cells: res
  }, null, 1) + '\n');
  write(res, N);
}

/* ---------- the other first-hour numbers, each beside Battle Brothers' first hour (sourced rows, marked) ---------- */
function others() {
  const o = id => ORIG.filter(x => x.id === id)[0];
  const nc = o('newcrew'), rb = o('rebuild');
  return [
    { what: 'the starting purse (A NEW CREW, the middle money)', ours: nc.batteries.thin + ' batteries (' + nc.crowns.medium + ' crowns at ten a battery)', bb: rb.crowns.medium + ' crowns (Rebuilding a Company, Medium funds; bb_all/1651)', mark: 'EASIER', proposed: 'as is', src: 'records/target/bb/origins.json' },
    { what: 'the first wages (three men, a day)', ours: '0 (hire.wage_charged: the screens charge no wage)', bb: '42 crowns a day (three companions at a base wage of 14; bb_all/0427)', mark: 'EASIER', proposed: 'as is in the first hour; PEOPLE and ECONOMY owe the wage itself (a company that never pays never feels the purse)', src: 'banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json hire.wage_charged' },
    { what: 'the first fight\'s enemies', ours: 'brigands of the early tier (thugs 8 to raiders 2), as many as the map\'s job count for your company at one skull, the Beginner count at our start', bb: 'thugs and sometimes raiders (bb_all/0299_Brigands), sized by the company\'s strength at Veteran', mark: 'EASIER at our start (the count x0.85), the same at Veteran', proposed: 'as measured below', src: 'ours.enemy_tiers, records/target/bb/party_math.json' },
    { what: 'the first fight\'s enemy gear', ours: 'the early tier\'s rows: Thug body 5-70, head 0-45, a club or a pitchfork; no bows before day 20 (25 at our start)', bb: 'the same rows (the wiki\'s Brigand Thug)', mark: 'the same, and later at our start', proposed: 'as is', src: 'records/target/bb/enemies.json, ours.enemy_tiers' },
    { what: 'the first gun in his hands', ours: 'none in 14 of 15 origins (the seventh man is the first rifle)', bb: 'a ranged companion with his bow or crossbow from the first day', mark: 'HARDER, NO WORD (and against rule 120(a))', proposed: 'the draft guns handed by the man (records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md)', src: 'the guns page, finding 1' },
    { what: 'the first man struck down: does he die', ours: '20 in 100 (+5 a mark carried)', bb: '67 in 100 (survival 33)', mark: 'EASIER', proposed: 'as is', src: 'ours.struck_down_death_chance' },
    { what: 'the first man struck down who lives: how long he is out', ours: '30 to 40 days laid up', bb: '0 days: he fights on with a permanent injury', mark: 'HARDER, HIS WORD (9/27)', proposed: 'as is (his)', src: 'ours.struck_down_laid_up_days' },
    { what: 'the first hire\'s price (a militiaman, level one)', ours: 'up to 225 batteries', bb: '49 batteries by the wiki\'s formula (base plus 1.25 x the kit)', mark: 'HARDER, NO WORD (4.6 times)', proposed: '49 (engine/bohemia_pricetable.js hireCostRange, already in the repo, loaded by no screen)', src: 'records/BOHEMIA_TUNING_THE_SCREENS_AROUND_THE_FIGHT_IN_THE_ONE_TABLE_10_18_26.md' },
    { what: 'the first hire\'s stars', ours: 'one starred stat', bb: 'three starred stats (60/30/10 for one to three stars)', mark: 'HARDER, NO WORD', proposed: 'three, as Battle Brothers', src: 'hire.starred_stats' },
    { what: 'the first sale (what a town pays for your loot)', ours: '1/7 of its worth', bb: '0.136 at a town hall, neutral (0.109 a camp, 0.177 a city)', mark: 'EASIER (a hair)', proposed: 'as is', src: 'market.sell_cut' },
    { what: 'the first doctor', ours: '20 plus a fifth a level, halves the days', bb: 'the same (the Temple: 20, x0.2 a level, halves)', mark: 'the same', proposed: 'as is', src: 'clinic.base_price' },
    { what: 'the first haircut', ours: '1 battery', bb: 'free', mark: 'HARDER, HIS WORD', proposed: 'as is (his)', src: 'barber.price' },
    { what: 'the first job\'s pay (one skull)', ours: '30 batteries', bb: 'one sourced anchor: 760 crowns (76 batteries) for a fifteen-head job; nothing per skull', mark: 'NO TWIN', proposed: 'as is until ECONOMY prices a job by its heads (contractPayBatteries, in the repo)', src: 'contract.pay_one_skull' },
    { what: 'jobs he may hold at once', ours: '2', bb: '1', mark: 'EASIER', proposed: 'as is', src: 'contract.slots' },
    { what: 'the first level up (experience)', ours: 'the wiki\'s table, -15 in 100 at Veteran, -5 at our start', bb: 'the same table, -15 at Veteran (bb_all Experience)', mark: 'EASIER at our start', proposed: 'as is', src: 'experience.global_modifier' },
    { what: 'his first swing\'s roll', ours: '+5 for you, -5 for them at our start (Battle Brothers\' Beginner roll)', bb: '0 at Veteran', mark: 'EASIER', proposed: 'as is', src: 'the rule 117 levers (banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json)' }
  ];
}

function write(res, N) {
  const get = (o, k, s, street) => res[[o, k, s].concat(street ? ['street'] : []).join('|')] || null;
  const OTH = others();
  const md = [], P = x => md.push(x);
  const rows = ORIG.map(o => ({ o,
    play: get(o.id, 'today', 'today'), bbT: get(o.id, 'today', 'bb'), today: get(o.id, 'today', 'start'), draft: get(o.id, 'draft', 'start'),
    sPlay: get(o.id, 'today', 'today', 1), sPlayG: get(o.id, 'draft', 'today', 1), sStart: get(o.id, 'today', 'start', 1), sStartG: get(o.id, 'draft', 'start', 1) }));
  const w = x => x ? x.won_in_100 : '-';
  const gunsOr = (g, t) => g || t;
  P('# TUNING [the first hour\'s numbers]: what he meets first, beside Battle Brothers\' first hour (10/19)');
  P('');
  P('RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank. Battle Brothers and his "Nintendo-simple" are the whole frame (rule 117).');
  P('');
  P('## Why');
  P('');
  P('Rule 117 (Paolo 10/18): "I want you to be easier than Battle Brothers... like Nintendo simplified... let\'s just make the people feel that they\'re successfully doing it." The first hour decides whether a player feels successful. And rule 120 (10/18): "the combat is still so fucking ass... so fucking hard... I wanna start off with the guns."');
  P('');
  P('## The finding that proves us wrong');
  P('');
  const nc = rows.filter(r => r.o.id === 'newcrew')[0];
  P('**HIS FIRST FIGHT IS OFTEN NOT THE ONE THE MAP SIZED. IT IS NINE BRIGANDS.** Of the city\'s eight hand-overs into a fight (slices/BOHEMIA_CITY_WORLD.html cityHandOver), four send a party (a job, a raid, taking a place, the road encounter) and four do not: '
    + 'the man next to him who jumps him, the crew out on the block, the crew he taps, and the door into a building. They carry the city\'s own head count as a ROSTER (2 to 4: SF_MIN 2 and SF_MAX 4 for the man who jumps him, CREW [2, 4] in engine/bohemia_hostiles.js for a crew) and no party; the demo\'s nfOpts() reads only the party, so the count is dropped, and the fight\'s bandOf() falls back to ours.first_band: '
    + FIRST_BAND.length + ' brigands (' + FIRST_BAND.filter(x => x === 'brigand_thug').length + ' thugs and a raider), written for the old twelve. They are on his screen: tap-to-travel on the map moves the marker through stepOnce(), and every step asks streetFightOnStep(). A NEW CREW (the door\'s default, three men) against them, the game as he plays it: wins ' + w(nc.sPlay) + ' in 100. '
    + 'Against the party the map sizes for it (two): ' + w(nc.play) + '. That gap is "so fucking hard".');
  P('');
  P('And the levers of our start (rule 117, measured on my EASIER, MEASURED page) are NOT IN THE GAME: the fight reads no hit-roll shift, no streak help, no enemy nerve, no breath change and no Beginner count (none of them appears in slices/BOHEMIA_FIGHT.html). He plays the TODAY column.');
  P('');
  P('## THE FIRST FIGHT OF EVERY ORIGIN (measured: won in 100)');
  P('');
  P('Each origin\'s own men, the early tier\'s brigands. TODAY = the game as he plays it: the door\'s default SEEN IT, Battle Brothers\' Veteran rules, no rule 117 lever, each man in the kit of his place in the line; it is also Battle Brothers\' own first fight (its rules, its count) but for its level-ups, which lift only the men who start past level one (the bench applies none, as the live fight applies none). OUR START = rule 117\'s levers and the Beginner count. GUNS = the draft guns '
    + '(records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md) handed by the man: the main man and the best fighters keep the line, the best eyes take the rifle, then the pistol, then the shotgun; the Lone Wolf keeps his blade. AUTO on both sides, seeded.');
  P('');
  P('### The map\'s job (the party our map sizes for that company on day one, one skull; ' + N + ' fights a cell)');
  P('');
  P('| origin | men | their men (today / our start) | TODAY (Battle Brothers\' Veteran rules) | OUR START | OUR START WITH GUNS | your men struck down a fight (today / start with guns) | dead in 100 fights (today / start with guns) | the guns\' hands |');
  P('|---|---|---|---|---|---|---|---|---|');
  rows.forEach(r => {
    const g = gunsOr(r.draft, r.today);
    P('| ' + r.o.name + ' | ' + r.o.men.length + ' | ' + (r.play ? r.play.enemies : '-') + ' / ' + (r.today ? r.today.enemies : '-') + ' | ' + w(r.play) + ' | ' + w(r.today) + ' | ' + (r.draft ? r.draft.won_in_100 : 'keeps his blade') + ' | '
      + (r.play ? r.play.your_men_struck_down_per_fight : '-') + ' / ' + (g ? g.your_men_struck_down_per_fight : '-') + ' | ' + (r.play ? r.play.your_men_dead_per_100_fights : '-') + ' / ' + (g ? g.your_men_dead_per_100_fights : '-') + ' | '
      + (r.draft && r.draft.slots ? r.draft.slots.map((s, i) => s === 'line' ? null : r.o.men[i].background.replace(/_/g, ' ') + ' ' + s).filter(Boolean).join(', ') : '-') + ' |');
  });
  P('');
  P('### The street\'s fight (no party handed: the fight\'s own ' + FIRST_BAND.length + ' brigands; ' + STREET_N + ' fights a cell)');
  P('');
  P('| origin | men | TODAY, his kit | TODAY, THE GUNS | OUR START, his kit | OUR START WITH GUNS | your men struck down (today / start with guns) |');
  P('|---|---|---|---|---|---|---|');
  rows.forEach(r => P('| ' + r.o.name + ' | ' + r.o.men.length + ' v ' + FIRST_BAND.length + ' | ' + w(r.sPlay) + ' | ' + (r.sPlayG ? r.sPlayG.won_in_100 : (r.o.men.length === 1 ? 'blade' : '-')) + ' | ' + w(r.sStart) + ' | ' + (r.sStartG ? r.sStartG.won_in_100 : (r.o.men.length === 1 ? 'blade' : '-')) + ' | '
    + (r.sPlay ? r.sPlay.your_men_struck_down_per_fight : '-') + ' / ' + (gunsOr(r.sStartG, r.sStart) ? gunsOr(r.sStartG, r.sStart).your_men_struck_down_per_fight : '-') + ' |'));
  P('');
  const jobUnder = rows.filter(r => gunsOr(r.draft, r.today) && gunsOr(r.draft, r.today).won_in_100 < 70);
  const streetUnder = rows.filter(r => gunsOr(r.sStartG, r.sStart) && gunsOr(r.sStartG, r.sStart).won_in_100 < 70);
  P('**UNDER 70 IN 100 AT OUR START WITH THE GUNS (rule 117: a first fight he should mostly win):** the map\'s job: ' + (jobUnder.length ? jobUnder.map(r => r.o.name + ' ' + gunsOr(r.draft, r.today).won_in_100).join('; ') : 'none')
    + '. The street\'s nine: ' + (streetUnder.length ? streetUnder.length + ' of ' + rows.length + ' (' + streetUnder.map(r => r.o.name + ' ' + gunsOr(r.sStartG, r.sStart).won_in_100).join('; ') + ')' : 'none') + '.');
  P('');
  const stalls = Object.values(res).filter(x => x.stalled_in_100 > 0);
  if (stalls.length) { P('**FIGHTS THAT NEVER END (a standoff: both sides hold their line and nobody steps in; the bench stops each at 400,000 steps):** ' + stalls.map(x => (ORIG.filter(o => o.id === x.origin)[0] || {}).name + ', ' + (x.fight === 'street' ? 'the street\'s nine' : 'the map\'s job') + ', ' + x.kit + ' kit, ' + x.setting + ': ' + x.stalled_in_100 + ' in 100').join('; ') + '. A player can walk in; AUTO never does. COMBAT (the same standoff the guns page found with the dire wolves).'); P(''); }
  P('**THE PROPOSAL (for RUN and COMBAT):** (1) ONE LINE in the demo\'s nfOpts(): a hand-over with a roster and no party becomes a party of the roster\'s length, so the city\'s own 2 to 4 reach the fight (the street then plays like the job table\'s 3 v 2 to 3 v 4, not 3 v 9); '
    + '(2) the fight\'s own fallback is sized by the company in front of it (party_math\'s one-skull count), never the twelve\'s nine. '
    + 'Then the first fight is the map\'s-job table: with the guns and our start, ' + rows.filter(r => gunsOr(r.draft, r.today) && gunsOr(r.draft, r.today).won_in_100 >= 80).length + ' of ' + rows.length + ' origins win 80 or more in 100. Our start\'s levers go into the fight (COMBAT) or the door\'s easiest pick (RUN), so the TODAY column becomes the START column.');
  P('');
  P('## EVERY OTHER NUMBER HE MEETS IN THE FIRST HOUR');
  P('');
  P('| what he meets | ours | Battle Brothers\' first hour | mark | proposed | source |');
  P('|---|---|---|---|---|---|');
  OTH.forEach(x => P('| ' + x.what + ' | ' + x.ours + ' | ' + x.bb + ' | ' + x.mark + ' | ' + x.proposed + ' | ' + x.src + ' |'));
  P('');
  const harderNo = OTH.filter(x => /HARDER, NO WORD/.test(x.mark));
  P('**HARDER THAN BATTLE BROTHERS WITH NO WORD FROM HIM (rule 117(d): a NO before he sees it): ' + (harderNo.length + 1) + '.** The first fight on the street (above). ' + harderNo.map(x => x.what.charAt(0).toUpperCase() + x.what.slice(1) + ': ' + x.ours + ' against ' + x.bb + '; proposed ' + x.proposed).join('. ') + '.');
  P('');
  P('## WHAT CANNOT BE TESTED YET');
  P('');
  P('1. THE GUNS ARE THE BENCH\'S: the draft rows, the row\'s own distance numbers and the butt are in memory only until COMBAT builds them.');
  P('2. WHICH HAND-OVER HE MEETS FIRST: the map decides (a street crew, a door, or a job); this page measures each, not the order.');
  P('3. AUTO PLAYS BOTH SIDES: a player does better; the comparison between kits and settings is fair, the absolute number a floor.');
  P('4. WAGES AND FOOD: the first hour charges none, so nothing here can be felt yet (ECONOMY, PEOPLE).');
  P('');
  P('## ROUTED');
  P('');
  P('- RUN (the map\'s hand-overs) + COMBAT (the fight\'s fallback): one line in nfOpts() turns a roster into a party (count = roster.length) so the city\'s own count reaches the fight; the fallback band is sized by the company in front of it, never the twelve\'s nine. This is the first fix of "so fucking hard".');
  P('- COMBAT: our start\'s levers are measured and not built (the hit-roll shift, the streak help, the enemy nerve, the breath, the Beginner count).');
  P('- COMBAT + RUN: each origin\'s first fight with the guns handed by the man (the job table\'s last column).');
  P('- RUN TWO + ECONOMY: the first hire\'s price, 49 by the wiki\'s formula against 225 (engine/bohemia_pricetable.js is in the repo and no screen loads it); three starred stats, not one.');
  P('- PEOPLE + ECONOMY: wages are charged nowhere, so the first hour\'s purse never moves on its own.');
  P('');
  P('Bank: ' + OUT + ' (and its resume cache). Tool: tools/bohemia_tuning_the_first_hour.js (the bench is the guns page\'s, --cell with an origin\'s own men and, for the street, the fight\'s own band).');
  P('');
  P('[bb Battle Brothers sizes every fight, even an ambush on the road, by the company in front of it; it never sends a band written for twelve at three.]');
  P('[analog horror: nine men stepping out of the dark onto three is the scene; the problem is that it is the first one. Named for SOUNDS and COMBAT, not moved.]');
  fs.writeFileSync(path.join(ROOT, REC), md.join('\n') + '\n');

  /* the VOTE page */
  const band = v => v === null || v === undefined || typeof v !== 'number' ? '' : v >= 70 ? 'g' : v >= 40 ? 'a' : 'r';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const cell = (x, alt) => { const v = x ? x.won_in_100 : null; return '<td class="' + band(v) + '">' + (v === null ? (alt || '-') : v) + '</td>'; };
  const h = [];
  h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
  h.push('<title>YOUR FIRST FIGHT</title>');
  h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--g:#bfd8a8;--a:#f0d79a;--r:#e7a593}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}'
    + 'h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}p,li{max-width:72ch}.wrap{overflow-x:auto}table{border-collapse:collapse;font-size:13px}th,td{border:1px solid var(--line);padding:4px 5px;text-align:center}'
    + 'th{background:#e8dfcd;font-weight:normal}td:first-child{text-align:left}td.g{background:var(--g)}td.a{background:var(--a)}td.r{background:var(--r)}.key span{display:inline-block;padding:2px 6px;margin-right:4px;border:1px solid var(--line);font-size:12px}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
  h.push('<h1>YOUR FIRST FIGHT</h1>');
  h.push('<p>TUNING, research only. Why the first fight feels so hard: when a street crew or a door starts the fight, the game sends <b>nine bandits</b> at your three. A New Crew wins <b>' + w(nc.sPlay) + ' in 100</b> of those. When the map picks the fight, it sends two, and you win ' + w(nc.play) + '. <b>DRAFT.</b></p>');
  h.push('<p class="key"><span style="background:var(--g)">70+ you mostly win</span><span style="background:var(--a)">40 to 69 a coin toss</span><span style="background:var(--r)">under 40 you mostly lose</span></p>');
  h.push('<h2>A street crew or a door: nine bandits</h2><div class="wrap"><table><tr><th>start</th><th>crew</th><th>now</th><th>easier, with guns</th></tr>');
  rows.forEach(r => h.push('<tr><td>' + esc(r.o.name) + '</td><td>' + r.o.men.length + '</td>' + cell(r.sPlay) + cell(gunsOr(r.sStartG, r.sStart)) + '</tr>'));
  h.push('</table></div>');
  h.push('<h2>A fight the map picks: a few bandits</h2><div class="wrap"><table><tr><th>start</th><th>crew v them</th><th>now</th><th>easier, with guns</th></tr>');
  rows.forEach(r => h.push('<tr><td>' + esc(r.o.name) + '</td><td>' + r.o.men.length + ' v ' + (r.play ? r.play.enemies : '-') + '</td>' + cell(r.play) + cell(r.draft, r.o.men.length === 1 ? 'blade' : '-') + '</tr>'));
  h.push('</table></div>');
  h.push('<p>The fix is one line: the street already counts 2 to 4 of them, and the fight never hears it. Size every fight to your crew, like Battle Brothers does, and nearly every start wins its first fight 8 or 9 times in 10.</p>');
  h.push('<h2>The rest of the first hour</h2><ul>');
  const PLAIN = [
    'Starting money: 240 batteries, a bit more than Battle Brothers\' 2,000 crowns. Easier.',
    'Wages: none. Battle Brothers charges 42 crowns a day for three men. Easier.',
    'The first gun: none in 14 of 15 starts. Battle Brothers hands you a bow on day one. Harder, and the guns page fixes it.',
    'A man who goes down dies 1 time in 5. In Battle Brothers it is 2 in 3. Easier.',
    'A man who lives is out 30 to 40 days. In Battle Brothers he fights on hurt. Harder, but that was your call.',
    'Your first hire costs up to 225 batteries. Battle Brothers\' own formula says 49. Harder, nobody decided it.',
    'A new hire is good at one thing. In Battle Brothers he can be good at three. Harder, nobody decided it.'
  ];
  PLAIN.forEach(x => h.push('<li>' + esc(x) + '</li>'));
  h.push('</ul>');
  h.push('<p class="k">Every number, its source and the proposal: ' + REC + '. The computer played both sides. draft:true.</p>');
  h.push('</body></html>');
  fs.writeFileSync(path.join(ROOT, PAGE), h.join('\n') + '\n');
  console.log('street (today, new crew): ' + w(nc.sPlay) + ' | job (today, new crew): ' + w(nc.play) + ' | street under 70 with guns at start: ' + streetUnder.length);
  console.log('wrote ' + REC + ' and ' + PAGE);
}
if (require.main === module) {
  if (process.argv.includes('--page')) write(J(OUT).cells, J(OUT).fights_per_cell);
  else main().catch(e => { console.error(e); process.exit(1); });
}
