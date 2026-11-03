#!/usr/bin/env node
/* THE FEED TALKS ABOUT THE WHOLE WORLD (WORDS 11/3/26, VAMILY rule 352, ask line 366).

   His words: 'I wanted the feed posts to talk a lot about the rest of the world... I really did a good job building out a whole
   world... if you're just taking a quick glance... you're gonna be learning more about the world... definitely international
   vibes, kind of like Twitter.'

   Reads records/target/bb/feed_world.json (WORDS' one data file) and the engine that merges it (engine/bohemia_feedstream.js
   merge()), headless; then reads the map's loader. Sources of every fact: records/BOHEMIA_WORDS_THE_WORLD_FEED_WHAT_HIS_WORLD_SAYS_11_3_26.md.
     W1  THE FILE: 120+ posts across 30+ accounts; every row far, a source, a trigger, what it teaches; every line draft:true and
         in the mouth of a real account; every account speaks
     W2  THE MAX (rule 350): every line 120 characters with every fill at its longest, every handle 16; no em dash
     W3  THE VOICES, IN ENGLISH (rule 355(4), Paolo 11/3: no more Spanglish; the world writes in English, a place's name is
         fine): no Spanish word, no foreign word, no twin; the machine is sentence case with a full stop and no '!'; a person never
         says a machine's word
     W4  INTERNATIONAL: the country, Mexico and the world each 5+ voices; the Network's manufactured voices 4+ and the machine
     W5  NO NEW LORE BY THE BACK DOOR: the Texas talk is act one's (GDD v2: you hear it is starting); the gulf city is never named
         (its name is PENDING); no line names Dubai, Taiwan or a government in Washington
     W6  THE SHARE: a played hour on the map's clock (quiet, busy, very busy; six seeds each) is 4 in 10 from beyond the valley
         (0.33 to 0.50); every deed still posts; the city's life still speaks; the valley file alone makes no far post;
         the glass keeps its reading gap while he travels
     W7  NEVER DIALED (rule 355): no world post, nor a valley reply under one, ever comes out Spanglish
     W8  THE MAP READS IT: the loader fetches feed_world.json and merges it; the map's inlined engine carries the share
   Run: node gates/the_feed_talks_about_the_whole_world_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + String(why).slice(0, 400) + ']' : '')); };

const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/feed_world.json'), 'utf8'));
const BASE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/feed_kinds.json'), 'utf8'));
const S = require(path.join(ROOT, 'engine/bohemia_feedstream.js'));
const SP = require(path.join(ROOT, 'engine/bohemia_spanglish.js'));
const PE = require(path.join(ROOT, 'engine/bohemia_people.js'));
const LONGEST = { company: 24 };   /* the start screen's crew name, maxLength 24 */
const PLACES = /\b(las vegas|el paso|los angeles)\b/gi;
const MACHINE = /\b(successfully|completed|achievement|unlocked|level up|quests?|player|notification|xp|user|event|status|deed|ledger|reputation|faction)\b|%|\+\d|\[|\]/i;

console.log('='.repeat(74));
console.log('THE FEED TALKS ABOUT THE WHOLE WORLD: the country, Mexico and the world in the phone\'s feed, 4 in 10');
console.log('='.repeat(74));

const acc = {}; W.accounts.forEach(a => { acc[a.id] = a; });
const lines = []; W.kinds.forEach(k => (k.words || []).forEach(w => lines.push({ k, w, a: acc[(w.by || [])[0]] })));
const replies = []; W.kinds.forEach(k => (k.replies || []).forEach(r => (r.words || []).forEach(w => replies.push({ k, w }))));
const filled = s => String(s).replace(/\{([a-z_]+)\}/g, (m, k) => 'x'.repeat(LONGEST[k] || 30));

/* W1 */
{
  const badRow = W.kinds.filter(k => !k.id || k.far !== true || k.source !== 'world' || !k.trigger || !k.teaches || !(k.words || []).length);
  const undrafted = lines.concat(replies).filter(x => x.w.draft !== true || !x.w.en);
  const noMouth = lines.filter(x => !x.a);
  const silent = W.accounts.filter(a => !lines.some(x => x.a === a));
  const dupIds = W.accounts.map(a => a.id).filter(id => BASE.accounts.some(b => b.id === id)).concat(W.kinds.map(k => k.id).filter(id => BASE.kinds.some(b => b.id === id)));
  leg(lines.length >= 120 && W.accounts.length >= 30 && !badRow.length && !undrafted.length && !noMouth.length && !silent.length && !dupIds.length && W.draft === true,
    'W1  THE FILE: 120+ POSTS, 30+ ACCOUNTS, EVERY ROW FAR, EVERY LINE DRAFT IN A REAL MOUTH, EVERY VOICE SPEAKS',
    lines.length + ' posts (+' + replies.length + ' replies), ' + W.accounts.length + ' accounts, ' + W.kinds.length + ' kinds; bad ' + badRow.map(k => k.id) + '; undrafted ' + undrafted.length + '; no mouth ' + noMouth.length + '; silent ' + silent.map(a => a.id) + '; clash ' + dupIds);
}
/* W2 */
{
  const long = [];
  lines.forEach(x => ['en', 'es'].forEach(f => { if (x.w[f] && filled(x.w[f]).length > 120) long.push(filled(x.w[f]).length + ' ' + x.w[f]); }));
  replies.forEach(x => { if (filled(x.w.en).length > 120) long.push(x.w.en); });
  const handles = W.accounts.filter(a => !a.handle || a.handle.length > 16 || /[^a-z0-9_.]/i.test(a.handle));
  const all = BASE.accounts.concat(W.accounts).map(a => String(a.handle).toLowerCase());
  const dupH = all.filter((h, i) => all.indexOf(h) !== i);
  const dash = JSON.stringify(W).indexOf('—') >= 0;
  const maxLen = Math.max(...lines.map(x => Math.max(filled(x.w.en).length, x.w.es ? filled(x.w.es).length : 0)));
  leg(!long.length && !handles.length && !dupH.length && !dash,
    'W2  THE MAX (rule 350): EVERY LINE 120 WITH FILLS AT THEIR LONGEST, EVERY HANDLE 16 AND ITS OWN; NO EM DASH',
    'longest ' + maxLen + '; over ' + long.slice(0, 3) + '; handles ' + handles.map(a => a.handle) + '; dup ' + dupH + '; em dash ' + dash);
}
/* W3 */
{
  const FOREIGN = /\b(salamat|ingat|abeg|wahala|pikin|abi|inshallah|valeu|nossa|arre|yaar|bas|chale|maa|konbini|sawa|pole|aigoo|bof|che|habibi|yalla|khalas|dizem|merci|danke|grazie|hola|gracias|mijo|mija|primo|compa)\b/i;
  const all = lines.concat(replies);
  const esInEn = all.filter(x => PE.esWordsIn(x.w.en.replace(PLACES, ' ')).length).map(x => x.w.en);
  const foreign = all.filter(x => FOREIGN.test(x.w.en)).map(x => x.w.en);
  const twins = all.filter(x => x.w.es).map(x => x.w.es);
  const notEn = W.accounts.filter(a => a.lang !== 'en').map(a => a.id);
  const machine = lines.filter(x => x.a && x.a.kind === 'page');
  const machineBad = machine.filter(x => !/^[A-Z]/.test(x.w.en) || !/[.]$/.test(x.w.en) || /!/.test(x.w.en)).map(x => x.w.en);
  const personMachine = lines.filter(x => x.a && x.a.kind !== 'page' && MACHINE.test(x.w.en.replace(/\{[a-z]+\}/g, ' '))).map(x => x.w.en);
  const personCase = lines.filter(x => x.a && x.a.kind !== 'page' && /^[A-Z][a-z]/.test(x.w.en)).map(x => x.w.en);
  leg(!esInEn.length && !foreign.length && !twins.length && !notEn.length && machine.length >= 3 && !machineBad.length && !personMachine.length && !personCase.length,
    'W3  THE VOICES, IN ENGLISH (rule 355(4)): NO SPANISH, NO FOREIGN WORD, NO TWIN; THE MACHINE SMOOTH, PEOPLE ROUGH',
    'spanish ' + esInEn.slice(0, 2) + '; foreign ' + foreign.slice(0, 2) + '; twins ' + twins.length + '; not en ' + notEn + '; machine ' + machine.length + ' bad ' + machineBad + '; machine words ' + personMachine.slice(0, 2) + '; capital ' + personCase.slice(0, 2));
}
/* W4 */
{
  const n = t => W.accounts.filter(a => (a.tags || []).indexOf(t) >= 0).length;
  const r = { us: n('far_us'), mx: n('far_mx'), world: n('far_world'), network: n('far_network') };
  const cities = {}; W.accounts.forEach(a => { cities[a.where] = 1; });
  leg(r.us >= 5 && r.mx >= 5 && r.world >= 5 && r.network >= 5 && Object.keys(cities).length >= 30,
    'W4  INTERNATIONAL: THE COUNTRY, MEXICO AND THE WORLD 5+ VOICES EACH, THE NETWORK\'S OWN 5+, 30+ PLACES', JSON.stringify(r) + ' places ' + Object.keys(cities).length);
}
/* W5 */
{
  const tx = W.kinds.filter(k => /texas/i.test(k.id));
  const txAct = tx.length && tx.every(k => k.when && JSON.stringify(k.when.act) === '[1]');
  const named = lines.concat(replies).filter(x => /\b(dubai|taiwan|white house|congress in washington|president of the united states)\b/i.test((x.w.en || '') + ' ' + (x.w.es || ''))).map(x => x.w.en);
  const gulf = lines.filter(x => /gulf city/.test(x.w.en)).length;
  leg(txAct && !named.length && gulf >= 5,
    'W5  NO NEW LORE BY THE BACK DOOR: THE TEXAS TALK IS ACT ONE\'S, THE GULF CITY NEVER NAMED, NO PENDING FACT SAID AS TRUE',
    'texas rows ' + tx.length + ' act one ' + !!txAct + '; gulf city lines ' + gulf + '; named ' + named.slice(0, 2));
}
/* W6, W7: the engine */
const M = S.merge(BASE, W);
const CTX = { company: 'Night Shift', companyhandle: 'nightshift', town: 'Church', night_from: 18, night_to: 6, high: 107, low: 81, lights: 212, minutes: 7, district: 'suburb', road: 'Flamingo' };
const SAMPLE = { job: 'Ride carts to Primm', client: 'ROSA', town: 'BLUES', pay: 135, stars: 2, enemy: 'Road crews', enemy_faction: 'brigands', count: 4, lost: 0,
  man: 'TOMAS', background: 'bus driver', crew: 4, injury: 'a cracked rib', days: 9, title: 'road knight', rare: 'a road knight', price: 500, good: 'water',
  faction: 'Blues', faction_name: 'Blues', agenda: 'caravan', toward: 'Trades', was: 'Remnants', key: 'food', now: 8, origin: 'a new crew', start: 290, paid: 12, days_left: 6 };
function play(file, seed, realMinutes, every) {
  let real = 0;
  const E = S.engine(file, { seed: seed, say: SP.say, spanglish: SP, realNow: () => real });
  let t = 1440 + 360; E.tick(t, CTX);
  const log = []; E.on(p => { p._real = real; log.push(p); });
  E.fire('game.start', SAMPLE);
  const evs = ['party.moved', 'town.entered', 'job.taken', 'party.sighted', 'fight.won', 'man.hurt', 'job.done', 'man.hired', 'scarce.down', 'raid', 'prices.up', 'road.closed'];
  for (let b = 1; b <= realMinutes * 120; b++) {
    real += 500;
    if (every && b % every === 0) E.fire(evs[(b / every) % evs.length], SAMPLE);
    if ((b % 120) < 90) t += 13;
    E.tick(t);
  }
  return log;
}
{
  const out = {};
  let lifeOk = true;
  [['quiet', 0], ['busy', 400], ['very busy', 120]].forEach(([name, every]) => {
    let tot = 0, far = 0;
    for (let s = 0; s < 6; s++) {
      const log = play(M, 'world-' + name + '-' + s, 60, every);
      tot += log.length; far += log.filter(p => p.far).length;
      if (!log.some(p => p.kind === 'life')) lifeOk = false;
    }
    out[name] = +(far / tot).toFixed(3);
  });
  const shareOk = Object.keys(out).every(k => out[k] >= 0.33 && out[k] <= 0.5);
  /* every deed still posts with the world merged in */
  const DEEDS = ['job.taken', 'job.done', 'job.dropped', 'fight.won', 'fight.lost', 'fight.fled', 'man.hired', 'man.dismissed', 'man.hurt', 'man.dead', 'town.entered', 'rare.seen'];
  const missed = DEEDS.filter(d => {
    let real = 0; const E = S.engine(M, { seed: 'deed-' + d, say: SP.say, spanglish: SP, realNow: () => real });
    let t = 1440 + 600; E.tick(t, CTX); const log = []; E.on(p => log.push(p));
    for (let i = 0; i < 30; i++) { real += 500; t += 13; E.tick(t); }
    E.fire(d, SAMPLE);
    for (let i = 0; i < 400; i++) { real += 500; t += 13; E.tick(t); }
    return !log.some(p => p.kind === 'mine');
  });
  const baseFar = play(BASE, 'base-alone', 30, 400).filter(p => p.far).length;
  /* the glass keeps its reading gap (pace.real_gap_s) while he travels, the world merged in (the travel clock is live) */
  const gl = play(M, 'gap', 60, 400), gap = (M.pace.real_gap_s || 0) * 1000;
  let close = 0; for (let i = 1; i < gl.length; i++) if (!gl[i].reply_to && !gl[i - 1].reply_to && gl[i]._real - gl[i - 1]._real < gap && gl[i]._real > 0) close++;
  leg(shareOk && lifeOk && !missed.length && baseFar === 0 && close === 0,
    'W6  THE SHARE: A PLAYED HOUR IS 4 IN 10 FROM BEYOND THE VALLEY; EVERY DEED STILL POSTS; THE CITY STILL LIVES; THE VALLEY ALONE UNCHANGED',
    JSON.stringify(out) + '; life ' + lifeOk + '; deeds missed ' + missed + '; far posts from the valley file alone ' + baseFar + '; posts closer than the reading gap ' + close);
  /* W7 */
  const CALLS = /(^|[\s,.])(mijo|mija|compa|carnal|güey|guey|hermano|hermana|primo|prima|mano|jefe|nomás|ese|ándale|andale|mira|oye|órale|orale|ojalá|ojala|ahorita)([\s,.!?]|$)/i;
  const leaks = [];
  for (let s = 0; s < 6; s++) play(M, 'tongue-' + s, 60, 300).forEach(p => {
    const a = acc[p.account];
    if (p.far && (CALLS.test(p.text) || p.form === 'es' || PE.esWordsIn(p.text.replace(PLACES, ' ')).length)) leaks.push(p.handle + ': ' + p.text);
  });
  leg(!leaks.length, 'W7  NEVER DIALED (rule 355): NO WORLD POST, NOR A VALLEY REPLY UNDER ONE, EVER COMES OUT SPANGLISH', leaks.length + ' ' + leaks.slice(0, 2));
}
/* W8 */
{
  const page = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const wired = page.indexOf("'../records/target/bb/feed_world.json'") >= 0 && /BohemiaFeedStream\.merge\(file, world\)/.test(page);
  const eng = fs.readFileSync(path.join(ROOT, 'engine/bohemia_feedstream.js'), 'utf8');
  const inl = page.indexOf(eng) >= 0;
  const cfg = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
  leg(wired && inl && /records\/target/.test(cfg),
    'W8  THE MAP READS IT: THE LOADER FETCHES THE WORLD FILE AND MERGES IT; THE MAP CARRIES THIS ENGINE BYTE FOR BYTE; THE SITE PUBLISHES records/target',
    'loader ' + wired + '; inlined engine current ' + inl);
}
console.log('\nTHE FEED TALKS ABOUT THE WHOLE WORLD: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
