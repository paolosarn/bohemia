#!/usr/bin/env node
/* THE WHY LINE (FIGHT SCREEN 11/14/26; VAMILY rule 449(a), ask row 617).
   PAOLO 11/14: 'It doesn't explain why people are trying to attack you... I want there to be a sentence, just one sentence...
   why the fuck the enemies are attacking you or why the fuck the animals are attacking you.'
   THE LAW: NO FIGHT STARTS WITHOUT A TRUE REASON. Every fight opens with ONE sentence that says why this group is on him, true to
   how the fight began (the word the map's door hands over) and to who stands on the board (their kinds), from a face (their
   leader's when they are men; one of his own men when they are beasts, the dead or machines alone), in plain English, an attempt
   (draft:true); it never stops the fight and never waits for a tap; the same reason is never worded the same way twice in a row.
   The table is one data file a modder edits (records/target/bb/fight_reasons.json); slices/bohemia_fight_why.js chooses from it;
   slices/BOHEMIA_FIGHT.html shows it (__THE_WHY_LINE__).
   THE LEGS:
     W1  THE TABLE READS: draft, every rule has its own id, a how the table knows, a who the table knows, a reason the table
         explains, and two wordings or more for every mouth it has
     W2  EVERY WAY THE MAP STARTS A FIGHT HAS A HOW: every 'why' word a hand-over in the map and its helpers carries
         (contract, road, party, raid, take, arena, boss, machine, riggers, place, crew, tapped) is listed under a how
     W3  EVERYBODY WHO CAN STAND ON A BOARD IS SOMEBODY: every enemy kind in the fight's own tables (the tiers' mixes and heads,
         the act-one enemies' rows and mixes, the champions, the beasts' looks, the bosses' bands) falls in a named group: by
         its name, by its faction (so a new kind a lane adds to a known faction is somebody with no edit here), or, a boss's
         man and a pit fighter nobody names, by the group kept for that fight; a kind of a brand new faction is nobody
     W4  EVERY FIGHT HAS A REASON: every how x every group x every class, with every fact off and on, a man beside him or
         alone, their side able to talk or not: a sentence comes; men who can talk say it themselves, beasts and the dead never
     W5  THE WORDS: one sentence, words_max words at most, plain English (no Spanish word, no dash), {boss} only in his men's
         lines and once; said by a man alone it is 'I', never 'we', and nobody is called boss
     W10 ONLY A TRUE SENTENCE IS SAID (11/17, ask row 631: EYES heard 'They paid you to clear this road' from a man holding a doctor's cold
         box, and 'This road is ours' under a casino's ceiling): over every way, group, sky and kind of job no sentence is said while
         something it names is not so; the two EYES heard, by name; planted: the table's conditions taken out
     W11 NO START IS LEFT WITH NOTHING TRUE TO SAY; the starts with ONE true sentence are listed for WORDS (rule 454(a): none is written here)
     W12 on the page: a job to get a thing back is read by its kind, a garage deck by its ceiling
     W6  NEVER THE SAME WAY TWICE IN A ROW: sixty fights in a row on every rule, the wording kept as the page keeps it
     W7  THE FIGHT'S OWN DEALS: every faction the fight can deal, dealt by the fight's own rules (headless): its men fall in a
         named group and every how gives that band a sentence
     W8  THE PAGE IS WIRED: the page loads the chooser and the table, ticks the sentence before the lesson and the commentary,
         both wait for it, taps pass through it, it is never sent through the Spanglish dial and never touches the fight's dice
     W9  ON THE PAGE (a phone upright, the fight's own page): a job against men, a road pack of beasts, a party that hunted him:
         the sentence is on the glass after the first second from the right mouth with a drawn face, the fight moves under it
         when a finger starts it, it goes by itself, the lesson is never up with it
     planted: a how with its rules taken out (W4 red), a kind taken out of its group (W3 red), a line of two sentences (W5 red),
              the page's tick taken out (W9 red)
   Run: node gates/the_why_line_gate.js      (about forty seconds; WHY_NO_PAGE=1 skips W9 and says so, which fails) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), http = require('http');
const ROOT = path.join(__dirname, '..'), rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8'), J = f => JSON.parse(rd(f));
const WHY = require(path.join(ROOT, 'slices/bohemia_fight_why.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const D = J('records/target/bb/fight_reasons.json'), PAGE = rd('slices/BOHEMIA_FIGHT.html');
const HOWS = Object.keys(D.how), WHOS = Object.keys(D.who), CLASSES = ['men', 'beasts', 'dead'];
const arr = x => Array.isArray(x) ? x : (x == null ? [] : [x]);
const die = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
/* a hand-over word for each how, as the map writes it */
const WORD = {}; HOWS.forEach(h => { const from = D.how[h].from || []; WORD[h] = from.length ? from[0] + ':x' + (D.how[h].ends ? ':' + D.how[h].ends[0] : '') : ''; });
const OPTS = h => ({ arena: h === 'pit', camp: h === 'camp', boss: h === 'boss' });
const anyKind = w => { const k = D.who[w].kinds[0]; return k.endsWith('*') ? k.slice(0, -1) + 'x' : k; };
const unit = (kind, cls) => ({ kind, beast: cls === 'beasts', ghost: cls === 'dead', machine: false });

/* ---- W1 ---- */
{ const bad = [], ids = {};
  if (D.draft !== true) bad.push('the table is not draft:true');
  D.rules.forEach(r => { if (!r.id || ids[r.id]) bad.push('rule id ' + r.id); ids[r.id] = 1;
    arr(r.how).forEach(h => { if (!D.how[h]) bad.push(r.id + ': how ' + h); });
    arr(r.who).forEach(w => { if (!D.who[w] && CLASSES.indexOf(w) < 0) bad.push(r.id + ': who ' + w); });
    if (!D.reasons[r.reason]) bad.push(r.id + ': reason ' + r.reason);
    arr(r.needs).forEach(n => { if (['holds_ground', 'lives_here', 'has_food', 'known', 'night'].indexOf(n) < 0) bad.push(r.id + ': needs ' + n); });
    if (!(r.them || r.ours)) bad.push(r.id + ': no mouth');
    ['them', 'ours'].forEach(s => { if (r[s] && r[s].length < 2) bad.push(r.id + ': one wording for ' + s); }); });
  WHOS.forEach(w => { if (CLASSES.indexOf(D.who[w].class) < 0 || !(D.who[w].kinds || []).length) bad.push('who ' + w); });
  check(!bad.length, 'W1', 'THE TABLE READS: ' + D.rules.length + ' rules, ' + HOWS.length + ' ways a fight starts, ' + WHOS.length + ' groups, ' + Object.keys(D.reasons).length + ' reasons, ' + WHY.lines(D).length + ' sentences' + (bad.length ? '; BAD: ' + bad.slice(0, 6).join(' | ') : '')); }

/* ---- W2 ---- */
{ const files = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/bohemia_bosses.js', 'slices/bohemia_his_map.js', 'slices/bohemia_job_kinds.js', 'slices/bohemia_place_visits.js', 'slices/bohemia_road_events.js', 'slices/bohemia_job_danger.js'].filter(f => fs.existsSync(path.join(ROOT, f)));
  const heads = {}; let vars = 0;
  files.forEach(f => { const s = rd(f), re = /BOHEMIA_CITY_ENCOUNTER[\s\S]{0,1400}?\bwhy:\s*([^,}\n]{1,80})/g; let m;
    while ((m = re.exec(s))) { const v = m[1].trim(), q = /^'([a-z_]+)[:']/.exec(v); if (q) (heads[q[1]] = heads[q[1]] || []).push(path.basename(f)); else vars++; } });
  const listed = h => HOWS.some(k => (D.how[k].from || []).indexOf(h) >= 0), miss = Object.keys(heads).filter(h => !listed(h));
  const need = ['contract', 'road', 'party', 'raid', 'take', 'arena', 'boss', 'place'], lost = need.filter(h => !heads[h]);
  const caught = WHY.how('road:toll_crew:caught', {}, D), road = WHY.how('road:toll_crew', {}, D), none = WHY.how('', {}, D), odd = WHY.how('somebody new', {}, D), camp = WHY.how('', { camp: true }, D), pit = WHY.how('arena:3', { arena: true }, D);
  check(!miss.length && !lost.length && caught === 'hunted' && road === 'road' && none === D.how_none && odd === D.how_unknown && camp === 'camp' && pit === 'pit', 'W2',
    'EVERY WAY THE MAP STARTS A FIGHT HAS A HOW: ' + Object.keys(heads).length + ' words in ' + files.length + ' files (' + Object.keys(heads).sort().join(', ') + '; ' + vars + ' handed as a variable read as the street)' +
    (miss.length ? '; NOT LISTED: ' + miss.join(', ') : '') + (lost.length ? '; THE SCAN LOST: ' + lost.join(', ') : '') + '; a party that caught him reads ' + caught + ', a road stop ' + road + ', no word ' + none + ', a new word ' + odd); }

/* ---- W3 ---- */
const OURS = J('records/target/bb/ours.json'), NEW = J('records/target/bb/bohemia_enemies.json'), ROWS = J('records/target/bb/enemies.json').rows.map(r => r.id);
function kindsOnBoards() {
  const k = {}, add = (id, from) => { if (typeof id === 'string' && id) (k[id] = k[id] || []).push(from); };
  const mixes = (M, from) => Object.keys(M || {}).forEach(f => Object.keys(M[f] || {}).forEach(ph => { const m = M[f][ph]; if (m && typeof m === 'object') Object.keys(m).forEach(id => add(id, from + ' ' + f)); }));
  const T = OURS.enemy_tiers.value; mixes(T.mix, 'tiers'); Object.keys(T.heads || {}).forEach(f => add(T.heads[f], 'head ' + f));
  NEW.rows.forEach(r => add(r.id, 'act-one row')); mixes(NEW.mix, 'act-one mix'); Object.keys(NEW.heads || {}).forEach(f => add(NEW.heads[f], 'act-one head'));
  Object.keys((NEW.champions && NEW.champions.kinds) || {}).forEach(id => add(id, 'champion'));
  Object.keys(OURS.beast_looks.value || {}).forEach(id => add(id, 'beast look'));
  /* the bosses' and the pit's bands: any enemy id a boss or arena file names */
  const known = {}; ROWS.concat(NEW.rows.map(r => r.id)).forEach(id => { known[id] = 1; });
  fs.readdirSync(path.join(ROOT, 'records/target/bb')).filter(f => /^(boss|arena)/.test(f) && /\.json$/.test(f)).forEach(f => { (rd('records/target/bb/' + f).match(/"[a-z][a-z0-9_]+"/g) || []).forEach(q => { const id = q.slice(1, -1); if (known[id]) add(id, f); }); });
  return k;
}
const FACS = WHY.factions({ tiers: OURS.enemy_tiers.value, own: NEW });
/* a kind a boss's file or the pit's file names is met in that kind of fight: the group kept for it takes a man nobody else names */
const ctxOf = (from) => ({ boss: from.some(f => /^boss/.test(f)), pit: from.some(f => /^arena/.test(f)) });
{ const K = kindsOnBoards(), ids = Object.keys(K), nobody = ids.filter(id => !WHY.groupOf(id, D, FACS, ctxOf(K[id])));
  check(ids.length >= 60 && !nobody.length, 'W3', 'EVERYBODY WHO CAN STAND ON A BOARD IS SOMEBODY: ' + ids.length + ' kinds in the fight\'s tables, ' + (ids.length - nobody.length) + ' in a named group' + (nobody.length ? '; NOBODY: ' + nobody.map(id => id + ' (' + K[id][0] + ')').join(', ') : ''));
  /* planted: a kind taken out of its group */
  const P = JSON.parse(JSON.stringify(D)); P.who.scavengers.kinds = P.who.scavengers.kinds.filter(k => k !== 'coyote');
  P.who.scavengers.factions = P.who.scavengers.factions.filter(f => f !== 'coyotes');
  check(ids.some(id => !WHY.groupOf(id, P, FACS, ctxOf(K[id]))), 'W3 planted', 'the coyote and its faction taken out of their group: the leg sees a kind that is nobody');
  /* a new kind a lane adds to a known faction's mix is somebody with no edit to the table; a kind of a brand new faction is not */
  const T2 = JSON.parse(JSON.stringify(OURS.enemy_tiers.value)); Object.keys(T2.mix.kids)[0] && (T2.mix.kids[Object.keys(T2.mix.kids)[0]].kids_brand_new_thing = 1); T2.mix.the_new_people = { early: { new_people_scout: 1 } };
  const F2 = WHY.factions({ tiers: T2, own: NEW });
  check(WHY.groupOf('kids_brand_new_thing', D, F2) === 'kids' && WHY.groupOf('new_people_scout', D, F2) === null, 'W3 new kinds', 'a new kind put in the kids\' mix is one of the kids with no edit to the table (' + WHY.groupOf('kids_brand_new_thing', D, F2) + '); a kind of a faction nobody listed is nobody (' + WHY.groupOf('new_people_scout', D, F2) + ') until its faction is in a group'); }

/* ---- W4 ---- */
function everyFight(T) {
  const miss = [], wrong = []; let n = 0;
  const facts = [{}, { holds_ground: WHOS, lives_here: true, has_food: true, known: true, night: true }];
  HOWS.forEach(h => {
    const bands = WHOS.map(w => ({ tag: w, cls: T.who[w] ? T.who[w].class : D.who[w].class, them: [unit(anyKind(w), D.who[w].class), unit(anyKind(w), D.who[w].class)] }))
      .concat(CLASSES.map(c => ({ tag: 'a new ' + c, cls: c, them: [unit('nobody_listed_this', c)] })))
      .concat([{ tag: 'machines alone', cls: 'men', mute: true, them: [{ kind: 'wiederganger', machine: true }, { kind: 'armored_wiederganger', machine: true }] }]);
    bands.forEach(b => facts.forEach(f => [false, true].forEach(alone => { n++;
      const p = WHY.pick({ why: WORD[h], opts: OPTS(h), them: b.them, facts: f, last: {}, alone: alone, rnd: die(n) }, T);
      if (!p || !p.line) { miss.push(h + ' x ' + b.tag); return; }
      if (p.how !== h) wrong.push(h + ' read as ' + p.how);
      const talk = b.cls === 'men' && !b.mute;
      if (!talk && p.side !== 'ours') wrong.push(h + ' x ' + b.tag + ': a ' + b.cls + ' talks');
      if (alone && p.side === 'ours' && /boss/.test(p.line)) wrong.push(h + ' x ' + b.tag + ': he calls himself boss');
      if (/\{/.test(p.line)) wrong.push(h + ' x ' + b.tag + ': a raw slot'); })));
  });
  return { n, miss, wrong };
}
{ const E = everyFight(D);
  check(!E.miss.length && !E.wrong.length, 'W4', 'EVERY FIGHT HAS A REASON: ' + E.n + ' fights (' + HOWS.length + ' ways x ' + (WHOS.length + CLASSES.length + 1) + ' bands x facts off and on x a man beside him or alone): ' + (E.n - E.miss.length) + ' said why' + (E.miss.length ? '; SILENT: ' + [...new Set(E.miss)].slice(0, 8).join(', ') : '') + (E.wrong.length ? '; WRONG: ' + [...new Set(E.wrong)].slice(0, 6).join(' | ') : ''));
  const men = WHOS.filter(w => D.who[w].class === 'men'); let theirs = 0, all = 0;
  HOWS.forEach(h => men.forEach(w => { all++; const p = WHY.pick({ why: WORD[h], opts: OPTS(h), them: [unit(anyKind(w), 'men')], facts: {}, last: {}, rnd: die(all) }, D); if (p && p.side === 'them') theirs++; }));
  check(theirs === all, 'W4 mouths', 'MEN SAY IT THEMSELVES: ' + theirs + ' of ' + all + ' fights against men who can talk are said by their own leader');
  const P = JSON.parse(JSON.stringify(D)); P.rules = P.rules.filter(r => arr(r.how).indexOf('raid') < 0); const PE = everyFight(P);
  check(PE.miss.length > 0 && PE.miss.every(m => /^raid /.test(m)), 'W4 planted', 'the raid\'s rules taken out: ' + PE.miss.length + ' fights start with no reason, every one a raid'); }

/* ---- W5 ---- */
function words(T) {
  const bad = [], MAX = T.words_max || 16, SPAN = /\b(compa|g[uü]ey|mijo|mija|carnal|vecino|flaco|oye|mira|[aá]ndale|cuidado|ay|amigo|pero|nadie|agua|nuestra|vete|ese|vato|jefe|se[nñ]or|gringo|hombre|pinche|cabr[oó]n|chingad\w*|para|esta|los|las|que|por|con|muy|bueno|gracias)\b/i;
  WHY.lines(T).forEach(l => { const said = WHY.say(l.text, false), alone = WHY.say(l.text, true), tag = l.rule + '/' + l.side + '[' + l.i + ']';
    if (!/^[^.!?]+\.$/.test(said)) bad.push(tag + ': not one sentence');
    if (said.split(/\s+/).length > MAX) bad.push(tag + ': ' + said.split(/\s+/).length + ' words');
    if (/[^\x20-\x7E]/.test(said) || /--/.test(said)) bad.push(tag + ': a dash or a letter that is not plain');
    if (SPAN.test(said)) bad.push(tag + ': a Spanish word (' + SPAN.exec(said)[0] + ')');
    const slots = (l.text.match(/\{boss\}/g) || []).length;
    if (l.side === 'them' && (slots || /\bboss\b,/.test(said))) bad.push(tag + ': their man calls him boss');
    if (l.side === 'ours' && slots !== 1) bad.push(tag + ': ' + slots + ' {boss} slots');
    if (/\{/.test(said) || /\s,|,,|\s\s/.test(alone)) bad.push(tag + ': reads broken');
    if (l.side === 'ours' && (/\b(we|us|our|ours|boss)\b/i.test(alone) || /\bI (are|were)\b|\bI am the ones\b/.test(alone) || !/^[A-Z]/.test(alone))) bad.push(tag + ': alone he still says we (' + alone + ')'); });
  return bad;
}
{ const bad = words(D), n = WHY.lines(D).length;
  check(!bad.length, 'W5', 'THE WORDS: ' + n + ' sentences, each one sentence of ' + (D.words_max || 16) + ' words at most in plain English' + (bad.length ? '; BAD: ' + bad.slice(0, 6).join(' | ') : ''));
  const P = JSON.parse(JSON.stringify(D)); P.rules[0].them[0] = 'This road is ours. Your cart is the toll.';
  check(words(P).some(b => /not one sentence/.test(b)), 'W5 planted', 'a line of two sentences is caught'); }

/* ---- W6, W10, W11 (FIGHT SCREEN TWO 11/17, ask row 631: ONLY A TRUE SENTENCE IS SAID) ---- */
/* what can be so of a fight: under the sky or not, and which job (one that clears them, one that hunts them, another kind, one nobody can name) */
const SKIES = [true, false], JOBS = [['clears', 'clear-crew'], ['hunts', 'hunt-kind'], ['another job', 'recover-return'], ['a job nobody names', null]];
const truthOf = (outside, plays, isJob) => Object.assign({ outside: outside }, WHY.jobFacts(D, plays === null ? null : plays, isJob));
const needsOf = (p) => { const rule = D.rules.filter(r => r.id === p.rule)[0]; return arr(WHY.lineIf(rule, p.side, p.i)); };
{ let twice = 0, runs = 0, alone = {}, silent = {}, untrue = [];
  HOWS.forEach(h => WHOS.concat(['new']).forEach(w => [false, true].forEach(known => SKIES.forEach(sky => (WORD[h].indexOf('contract') === 0 ? JOBS : [['', undefined]]).forEach(J => {
    const them = w === 'new' ? [unit('nobody_listed_this', 'men')] : [unit(anyKind(w), D.who[w].class)], last = {}, r = die(HOWS.indexOf(h) * 97 + runs), tag = h + ' x ' + w + (sky ? '' : ', under a ceiling') + (J[0] ? ', ' + J[0] : '');
    const facts = Object.assign({ known, has_food: known, lives_here: known, holds_ground: known ? WHOS : [] }, truthOf(sky, J[1], WORD[h].indexOf('contract') === 0));
    let prev = null;
    for (let i = 0; i < 40; i++) { const p = WHY.pick({ why: WORD[h], opts: OPTS(h), them, facts, last, rnd: r }, D); if (!p) { silent[tag] = 1; break; } runs++;
      needsOf(p).forEach(k => { if (!facts[k]) untrue.push(tag + ': "' + p.line + '" needs ' + k); });
      if (prev === p.line) { if (p.pooled > 1) twice++; else alone[tag] = p.line; } prev = p.line; last[p.key] = p.i; last[p.said] = p.saidAs; } })))));
  check(runs > 5000 && twice === 0, 'W6', 'NEVER THE SAME WAY TWICE IN A ROW: ' + runs + ' fights in a row over every way, every group, under the sky and under a ceiling, every kind of job: ' + twice + ' said the same words twice running while a second true sentence stood');
  check(untrue.length === 0 && runs > 5000, 'W10', 'ONLY A TRUE SENTENCE IS SAID: ' + runs + ' sentences, ' + untrue.length + ' said with something it names not so' + (untrue.length ? ': ' + untrue.slice(0, 3).join(' | ') : ''));
  /* EYES' two, by name */
  const coldbox = [], ceiling = []; { const last = {}, r = die(631), f = Object.assign({}, truthOf(true, 'recover-return', true));
    for (let i = 0; i < 60; i++) { const p = WHY.pick({ why: 'contract:J9:holders', opts: {}, them: [unit('brigand_thug', 'men'), unit('brigand_thug', 'men')], facts: f, last, rnd: r }, D); if (p) { coldbox.push(p.line); last[p.key] = p.i; last[p.said] = p.saidAs; } }
    const last2 = {}, f2 = truthOf(false, undefined, false);
    for (let i = 0; i < 60; i++) { const p = WHY.pick({ why: 'road:7', opts: {}, them: [unit('brigand_thug', 'men')], facts: f2, last: last2, rnd: r }, D); if (p) { ceiling.push(p.line); last2[p.key] = p.i; last2[p.said] = p.saidAs; } } }
  const U = a => [...new Set(a)];
  check(coldbox.length === 60 && !coldbox.some(l => /clear this road|move us/i.test(l)) && U(coldbox).length >= 2 && ceiling.length === 60 && !ceiling.some(l => /\broad\b|street|block/i.test(l)) && U(ceiling).length >= 2, 'W10 the two EYES heard',
    'the man holding the cold box (a job to get a thing back) says ' + U(coldbox).map(l => '"' + l + '"').join(' / ') + ', never the road he was not paid to clear; a road crew under a ceiling says ' + U(ceiling).map(l => '"' + l + '"').join(' / ') + ', never a road');
  /* planted: the table with its conditions taken out is the table EYES walked */
  const BARE = JSON.parse(JSON.stringify(D)); BARE.rules.forEach(r => { delete r['if']; }); let old = 0; { const last = {}, r = die(77), f = truthOf(true, 'recover-return', true);
    for (let i = 0; i < 60; i++) { const p = WHY.pick({ why: 'contract:J9:holders', opts: {}, them: [unit('brigand_thug', 'men')], facts: f, last, rnd: r }, BARE); if (p) { if (/clear this road/.test(p.line)) old++; last[p.key] = p.i; last[p.said] = p.saidAs; } } }
  check(old > 0, 'W10 planted', 'the conditions taken out of the table: the man holding the cold box says the road again (' + old + ' of 60)');
  const S1 = Object.keys(silent), A1 = Object.keys(alone);
  check(S1.length === 0, 'W11', 'NO START IS LEFT WITH NOTHING TRUE TO SAY: ' + S1.length + ' silent' + (S1.length ? ' (' + S1.slice(0, 6).join('; ') + ')' : '') + '. FOR WORDS: ' + A1.length + ' starts have ONE true sentence and say it every time (' + A1.slice(0, process.env.ALL ? 999 : 40).join('; ') + (A1.length > 40 ? '; ...' : '') + ')'); }

/* ---- W7: the fight's own deals ---- */
{ let ok = 0, n = 0; const bad = [], seenWho = {};
  try {
    const HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js')), ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
    for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js']) { try { vm.runInContext(rd(f), ctx); } catch (e) {} }
    const F = ctx.FIGHT, T = OURS.enemy_tiers.value, facs = [...new Set(Object.keys(T.mix).concat(Object.keys(NEW.mix || {})))];
    facs.forEach((fc, i) => { for (let s = 0; s < 3; s++) { n++;
      try { ctx.setSeed(6170 + i * 7 + s);
        F.setup({ kind: 'strip', district: 'strip', cell: { gx: (i * 37 + 11) % 90, gy: (s * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false, cap: 12, met: 0, party: { count: 4 + s, days: 1 + s * 30, difficulty: 1, faction: fc },
          company: [{ background: 'militia', level: 2, gear: { main: 'shortsword', off: null } }, { background: 'militia', level: 2, gear: { main: 'shortsword', off: null } }] });
        const them = F.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, beast: !!u.beast, ghost: !!u.ghost, machine: !!u.machine })), w = WHY.who(them, D, FACS);
        if (!them.length || !w.id) { bad.push(fc + ': ' + them.map(u => u.kind).join(',') + ' is nobody'); continue; }
        seenWho[w.id] = 1;
        const silent = HOWS.filter(h => { const p = WHY.pick({ why: WORD[h], opts: OPTS(h), them, factions: FACS, facts: {}, last: {}, rnd: die(n) }, D); return !p || !p.line || (p.side === 'them' && !them.some(u => !u.beast && !u.ghost && !u.machine)); });
        if (silent.length) bad.push(fc + ': silent on ' + silent.join(',')); else ok++;
      } catch (e) { bad.push(fc + ': ' + String(e && e.message || e).slice(0, 80)); } } });
    check(n >= 60 && ok === n, 'W7', 'THE FIGHT\'S OWN DEALS: ' + facs.length + ' factions dealt by the fight\'s own rules, ' + n + ' bands: ' + ok + ' are somebody and have a sentence for every way a fight starts (' + Object.keys(seenWho).length + ' of ' + WHOS.length + ' groups met)' + (bad.length ? '; BAD: ' + bad.slice(0, 5).join(' | ') : ''));
  } catch (e) { check(false, 'W7', 'the headless fight could not be stood: ' + String(e && e.message || e).slice(0, 160)); } }

/* ---- W8 ---- */
{ const blk = (PAGE.split('/* ---------------- __THE_WHY_LINE__')[1] || '').split('/* ---------------- /__THE_WHY_LINE__')[0] || '', css = (/#why\{[^}]*\}/.exec(PAGE) || [''])[0], bad = [];
  if (!/<script src="bohemia_fight_why\.js"><\/script>/.test(PAGE)) bad.push('the chooser is not loaded');
  if (!/fetch\('\.\.\/records\/target\/bb\/fight_reasons\.json', FRESH\)/.test(PAGE)) bad.push('the table is not read');
  if (!/<div id="why"><canvas id="whyface"/.test(PAGE)) bad.push('no card on the glass');
  if (!/tickWhy\(now\); tickVet\(now\);/.test(PAGE)) bad.push('the sentence does not tick before the lesson');
  if (!/UI\.vet \|\| UI\.why \|\| !UI\.whyDone \|\| !TEACH\[k\]/.test(PAGE)) bad.push('the lesson does not wait for it');
  if (!/if \(UI\.vet \|\| UI\.why \|\| !UI\.whyDone\) return;/.test(PAGE)) bad.push('the commentary does not wait for it');
  if (!/pointer-events:none/.test(css)) bad.push('the card takes taps');
  if (!blk) bad.push('no block');
  if (/BohemiaSpanglish/.test(blk)) bad.push('the sentence goes through the Spanglish dial');
  if (/\brng\(/.test(blk) || /SEED\s*=/.test(blk)) bad.push('the sentence touches the fight\'s dice');
  if (/addEventListener|onclick|S\.deploy\s*=|S\.over\s*=|endTurn\(|aiStep\(/.test(blk)) bad.push('the sentence waits for a tap or moves the fight');
  if (!/WHY_QUIET_MS = 1000/.test(blk) || !/performance\.now\(\) - UI\.t0 < Math\.max\(WHY_QUIET_MS/.test(blk)) bad.push('it may come in the first second');
  if (!/songBeat\(\)/.test(blk)) bad.push('its hold shrinks with the fight\'s speed');
  check(!bad.length, 'W8', 'THE PAGE IS WIRED: the chooser and the table are loaded, the sentence ticks first, the lesson and the commentary wait, taps pass through, no Spanglish dial, no dice' + (bad.length ? '; BAD: ' + bad.join(' | ') : '')); }

/* ---- W9: on the page ---- */
(async () => {
  if (process.env.WHY_NO_PAGE) { check(false, 'W9', 'ON THE PAGE: skipped by WHY_NO_PAGE (a gate that did not look at the page did not pass)'); return done(); }
  let chromium = null; try { chromium = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })().chromium; } catch (e) {}
  if (!chromium) { check(false, 'W9', 'ON THE PAGE: no browser on this box'); return done(); }
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
  let planted = false;
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f); if (planted && /BOHEMIA_FIGHT\.html$/.test(rel)) body = Buffer.from(String(body).replace('tickWhy(now); tickVet(now);', 'tickVet(now);'));
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(body); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch(); const errs = [];
  const CO = [{ background: 'militia', level: 2, gear: { main: 'shortsword' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'shortsword' } }, { name: 'RAUL', background: 'militia', level: 2, gear: { main: 'shortsword' } }];
  const run = async (opts) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    await p.addInitScript(o => { window.FIGHT_OPTS = o; }, Object.assign({ district: 'suburb', cell: { gx: 40, gy: 40 }, met: 5, company: CO }, opts));
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    const R = { said: null, both: 0, moved: false, gone: false };
    try {
      await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0, null, { timeout: 45000 });
      const t0 = Date.now(); while (Date.now() - t0 < 6000 && !R.said) { R.said = await p.evaluate(() => UI.whySaid ? JSON.parse(JSON.stringify(UI.whySaid)) : null); if (!R.said) await p.waitForTimeout(80); }
      if (R.said && R.said.line) {
        R.glass = await p.evaluate(() => { const up = id => getComputedStyle(document.getElementById(id)).display !== 'none', e = document.getElementById('why'), r = e.getBoundingClientRect(), cv = document.getElementById('whyface'), g = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, seen = {};
          for (let i = 0; i < g.length; i += 16) seen[(g[i] >> 3) + ',' + (g[i + 1] >> 3) + ',' + (g[i + 2] >> 3)] = 1; const v = FIGHT.byId(UI.why.who);
          return { up: up('why'), vet: up('vet'), call: up('call'), inside: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, colours: Object.keys(seen).length, name: document.getElementById('whyname').textContent, side: v && v.side, log0: FIGHT.S.log.length, dep: !!FIGHT.S.deploy }; });
        const tapId = async id => { const q = await p.evaluate(id => { const e = document.getElementById(id), r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, id); await p.touchscreen.tap(q[0], q[1]); };
        if (R.glass.dep) await tapId('bend'); await p.waitForTimeout(200); await tapId('bauto');
        const t1 = Date.now(); while (Date.now() - t1 < 14000) { const s = await p.evaluate(() => { const up = id => getComputedStyle(document.getElementById(id)).display !== 'none'; return { why: up('why'), vet: up('vet'), call: up('call'), n: FIGHT.S.log.length, dep: !!FIGHT.S.deploy }; });
          if (s.why && (s.vet || s.call)) R.both++; if (s.why && !s.dep && s.n > R.glass.log0) R.moved = true; if (!s.why) { R.gone = true; break; } await p.waitForTimeout(100); }
      }
    } catch (e) { R.err = String(e && e.message || e).slice(0, 120); }
    await ctx.close(); return R;
  };
  try {
    const cases = [
      { tag: 'a job against the watch', opts: { why: 'contract:J17:clear', party: { count: 4, days: 1, difficulty: 1, faction: 'watch' } }, how: 'job', who: 'watch', side: 'them', mouth: 'them' },
      { tag: 'a pack on the road', opts: { why: 'road:pack', party: { count: 4, days: 1, difficulty: 1, faction: 'coyotes' } }, how: 'road', who: 'scavengers', side: 'ours', mouth: 'you' },
      { tag: 'a crew that hunted him', opts: { why: 'road:toll_crew:caught', party: { count: 3, days: 1, difficulty: 1, band: ['brigand_thug', 'brigand_thug', 'brigand_raider'], rolled: true, faction: 'brigands' } }, how: 'hunted', who: 'brigands', side: 'them', mouth: 'them' }];
    const out = []; let ok = 0;
    for (const c of cases) { const R = await run(c.opts), s = R.said || {}, g = R.glass || {};
      const good = !!s.line && s.how === c.how && s.who === c.who && s.side === c.side && g.side === c.mouth && s.at >= 1000 && g.up && g.inside && g.colours >= 12 && !!g.name && !g.vet && !g.call && R.both === 0 && R.moved && R.gone;
      if (good) ok++; out.push(c.tag + ': ' + (s.line ? (s.by + ' "' + s.line + '" at ' + Math.round(s.at) + ' ms' + (good ? '' : ' MISS ' + JSON.stringify({ how: s.how, who: s.who, side: s.side, mouth: g.side, up: g.up, inside: g.inside, colours: g.colours, both: R.both, moved: R.moved, gone: R.gone }))) : 'NO SENTENCE ' + JSON.stringify(R.said || R.err || null))); }
    check(ok === cases.length && !errs.length, 'W9', 'ON THE PAGE (a phone upright): ' + ok + ' of ' + cases.length + ' fights said why after the first second from the right mouth with a drawn face, the fight moved under it, it went by itself, nothing stood with it; page errors ' + errs.length + ' | ' + out.join(' | '));
    /* W12 (ask row 631), on the page: the job is asked for by name and the board for its sky */
    const cb = await run({ why: { why: 'contract:J9:holders', plays: 'recover-return' }, party: { count: 3, days: 1, difficulty: 1, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'], rolled: true, faction: 'brigands' } });
    const cl = await run({ why: 'road:toll_crew', inside: 'garage', district: 'downtown', party: { count: 3, days: 1, difficulty: 1, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'], rolled: true, faction: 'brigands' } });
    const cs = cb.said || {}, ls = cl.said || {};
    check(!!cs.line && cs.how === 'job' && cs.truth && cs.truth.plays === 'recover-return' && !cs.truth.job_clears && !/clear this road|move us/i.test(cs.line) && !arr(cs.needs).length
      && !!ls.line && ls.truth && ls.truth.outside === false && !/\broad\b|street|block/i.test(ls.line) && arr(ls.needs).indexOf('outside') < 0, 'W12',
      'ON THE PAGE: the job to get a thing back: ' + (cs.by || '?') + ' "' + (cs.line || JSON.stringify(cs)) + '" (the job read as ' + (cs.truth && cs.truth.plays) + '); a road crew on a garage deck: ' + (ls.by || '?') + ' "' + (ls.line || JSON.stringify(ls)) + '" (under the sky: ' + (ls.truth && ls.truth.outside) + ')');
    planted = true; const PR = await run(cases[0].opts);
    check(!(PR.said && PR.said.line), 'W9 planted', 'the page\'s tick taken out: the fight opens and nothing says why (' + JSON.stringify(PR.said) + ')');
  } catch (e) { check(false, 'W9', 'the page leg threw: ' + String(e && e.message || e).slice(0, 200)); }
  await b.close(); srv.close(); done();
})();
function done() { console.log('\nTHE WHY LINE GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
