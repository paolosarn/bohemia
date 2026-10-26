#!/usr/bin/env node
/* ============================================================================
   THE FEED'S WORDS GATE (10/26/26, WORDS lane)

   VAMILY [the feed's words] (rule 215(f), Paolo 10/26: 'we have a whole words [chat] that's part of
   that... organize it properly so every time we upgrade it gets better, realistic vibes') and
   [the usernames tell the story] (rule 217: 'the usernames can tell a real awesome story in a very
   short amount of words, the vibes of the world and the internet at that era').

   Reads banks/BOHEMIA_WORDS_THE_FEED_BANK.json (built by tools/words_feed/build_feed_bank.py), headless.
   WHAT IT HOLDS, leg by leg:
     W1  the shape: every kind a row a modder reads, five or more variants, every line draft:true
     W2  the three kinds, and every deed rule 215(a) names has its own kind
     W3  every 'who' resolves to an account; every faction with a want has its page; every place on
         the region map has one of its own people
     W4  the handles (217): every account one, none alike in any act, no portrait on a post yet; a
         page's handle carries its faction's word, a person's handle carries a trade
     W5  THE PLAYER DOES NOT SPEAK SPANGLISH (the first votes): his page and the bots never do, on the dial
     W6  the English is English and the twin is Spanglish, by the people engine's one lexicon (esWordsIn)
     W7  Q15: 'somebody' never did it; every human line names a person or talks to one
     W8  no machine's words in a person's mouth, and never a joke at the player
     W9  no two lines alike, and a kind's variants never open the same way
     W10 every {fill} declared, and every fill a row lists is one its words use
     W11 short like a post on a phone
     W12 a big event gets replies and a follow-up (215d)
     W13 THE HOUSE RATE: a paced long feed through the real dial lands at 10 to 15 Spanglish posts in 100
   It never claims taste. Whether a line reads like a person is EYES' read (line 135); this gate
   only holds what a machine can hold.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
/* a path on the command line checks another copy (the mutation tests, or FEED's own file once it holds the words) */
const BANK = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'banks', 'BOHEMIA_WORDS_THE_FEED_BANK.json');
const P = require('../engine/bohemia_people.js');
const S = require('../engine/bohemia_spanglish.js');

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) pass++; else { fail++; console.log('  FAIL: ' + n + (why ? '  ' + why : '')); } };

console.log('='.repeat(74));
console.log("THE FEED'S WORDS -- every post a handle and a real voice (rules 215, 217)");
console.log('='.repeat(74));

const B = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const factions = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/factions.json'), 'utf8')).factions;
const region = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/region_bases.json'), 'utf8'));

const kinds = B.kinds || [], replies = B.replies || [], follows = B.followups || [];
const rows = kinds.concat(replies, follows);
const accts = B.accounts || [];
const byId = {}; accts.forEach(a => { byId[a.id] = a; });
const kindIds = {}; kinds.forEach(k => { kindIds[k.id] = k; });
const strip = s => String(s).replace(/\{[a-z]+\}/g, ' ');
const isMachineRow = r => (r.who || []).every(w => byId[w] && byId[w].machine);
const isCompanyRow = r => (r.who || []).length > 0 && r.who.every(w => w === 'company');
const lines = []; rows.forEach(r => (r.words || []).forEach(w => lines.push({ r, w })));

/* ---- W1 THE SHAPE ------------------------------------------------------------ */
ok('W1 the bank is a draft', B.draft === true);
ok('W1 at least 40 kinds', kinds.length >= 40, kinds.length + ' kinds');
ok('W1 kind ids are unique', Object.keys(kindIds).length === kinds.length);
kinds.forEach(k => {
  ok('W1 ' + k.id + ' is one of the three kinds', ['mine', 'world', 'life'].indexOf(k.kind) >= 0, k.kind);
  ok('W1 ' + k.id + ' says what it teaches', typeof k.teaches === 'string' && k.teaches.length > 20);
  ok('W1 ' + k.id + ' has a trigger for FEED to read', !!(k.suggest && k.suggest.trigger));
  ok('W1 ' + k.id + ' has five or more variants', (k.words || []).length >= 5, (k.words || []).length + '');
});
replies.forEach(r => ok('W1 ' + r.id + ' has six or more replies', (r.words || []).length >= 6, (r.words || []).length + ''));
follows.forEach(r => ok('W1 ' + r.id + ' has five or more follow-ups', (r.words || []).length >= 5, (r.words || []).length + ''));
ok('W1 every line is draft:true with English', lines.every(x => x.w.draft === true && typeof x.w.en === 'string' && x.w.en.trim()));

/* ---- W2 THE THREE KINDS, AND THE DEEDS 215(a) NAMES ---------------------------- */
const count = k => kinds.filter(x => x.kind === k).length;
ok('W2 what you did: 10 kinds or more', count('mine') >= 10, count('mine') + '');
ok('W2 what the world did: 10 kinds or more', count('world') >= 10, count('world') + '');
ok('W2 the city\'s life: 10 kinds or more', count('life') >= 10, count('life') + '');
['job_taken', 'job_done', 'job_dropped', 'fight_won', 'fight_lost', 'fight_fled', 'man_hired', 'man_dismissed',
 'man_hurt', 'man_dead', 'town_entered', 'rare_man_seen'].forEach(id =>
  ok('W2 the deed "' + id + '" has its kind', !!kindIds[id] && kindIds[id].kind === 'mine'));
['raid_seen', 'town_falls', 'town_rises', 'price_up', 'price_down', 'road_closed', 'road_open', 'party_seen'].forEach(id =>
  ok('W2 the world\'s "' + id + '" has its kind', !!kindIds[id] && kindIds[id].kind === 'world'));
ok('W2 somebody asks for something (Q15: the most common post in a real feed)', !!kindIds.ask);

/* ---- W3 EVERY WHO RESOLVES --------------------------------------------------- */
const POOLS = { town: 1, valley: 1, scanner: 1, company: 1, stranger: 1 };
const fids = {}; factions.forEach(f => { fids[f.id] = f; });
rows.forEach(r => (r.who || []).forEach(w => {
  let good = !!POOLS[w] || !!byId[w];
  if (/^faction:/.test(w)) {
    const fid = w.slice(8);
    good = !!fids[fid] && accts.some(a => a.kind === 'page' && a.faction === fid);
  }
  ok('W3 ' + r.id + ' who "' + w + '" resolves', good);
}));
ok('W3 the pools all have mouths', ['person', 'scanner', 'company', 'stranger', 'page'].every(k => accts.some(a => a.kind === k)));
/* a faction with a voice has a page; the lab-made beasts have no voice and no page (an animal does not post) */
factions.forEach(f => {
  const voiced = !!(f.voice && f.voice.text);
  ok('W3 ' + f.id + (voiced ? ' has its page' : ' (no voice) has no page'),
     voiced === accts.some(a => a.kind === 'page' && a.faction === f.id));
});
const places = Array.isArray(region.region_places) ? region.region_places : [];
ok('W3 the region map has its twelve places', places.length >= 12, places.length + '');
places.forEach(p => ok('W3 ' + p.id + ' has one of its own people on the feed',
  accts.some(a => a.kind === 'person' && a.home === p.id)));

/* ---- W4 THE HANDLES (rule 217) --------------------------------------------------- */
const norm = h => String(h || '').toLowerCase().replace(/[._\-]/g, '');
['1', '2', '3'].forEach(act => {
  const seen = {}; let dup = [];
  accts.forEach(a => { const h = a.acts && a.acts[act]; if (!h) return; const n = norm(h); if (seen[n]) dup.push(h); seen[n] = 1; });
  ok('W4 act ' + act + ': no two handles alike', dup.length === 0, dup.join(', '));
});
accts.forEach(a => {
  ok('W4 ' + a.id + ' has a handle that is a handle', /^[A-Za-z0-9._{}]{3,30}$/.test(a.handle || ''), a.handle);
  ok('W4 ' + a.id + ' act one is its handle', a.acts && a.acts['1'] === a.handle);
  ok('W4 ' + a.id + ' shows no portrait on a post yet (217a)', a.face && a.face.portrait === null);
});
const STOP = { the: 1, and: 1, its: 1, their: 1, them: 1, with: 1, from: 1, what: 1, whoever: 1, has: 1, everybody: 1,
  else: 1, keep: 1, own: 1, hold: 1, open: 1, roads: 0, only: 1, they: 1, are: 1, not: 1, you: 1, your: 1, this: 1 };
function words(s) { return String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !STOP[w]); }
accts.filter(a => a.kind === 'page').forEach(a => {
  const f = fids[a.faction] || {};
  const pool = words([f.name, f.want && f.want.text, f.voice && f.voice.text, (f.ground || []).join(' ')].join(' '));
  const h = a.handle.toLowerCase().replace(/[^a-z]/g, '');
  const hit = pool.find(w => h.indexOf(w.slice(0, Math.min(w.length, 5))) >= 0);
  ok('W4 ' + a.handle + ' carries a word of ' + (f.name || a.faction), !!hit);
});
const people = accts.filter(a => a.kind === 'person');
const traded = people.filter(a => {
  const h = a.handle.toLowerCase();
  return words(a.trade).some(w => h.indexOf(w.slice(0, 4)) >= 0);
});
ok('W4 most people\'s handles carry their trade (a reader learns the trades)', traded.length * 3 >= people.length * 2,
   traded.length + ' of ' + people.length);
ok('W4 handles carry the era: digits on some, a pre-crash fossil, burners, bots',
   people.filter(a => /\d/.test(a.handle)).length >= 4 && accts.some(a => /\.eth/.test(a.handle)) &&
   accts.filter(a => a.kind === 'stranger').length >= 3 && accts.filter(a => a.kind === 'bot').length >= 3);

/* ---- W5 THE PLAYER DOES NOT SPEAK SPANGLISH ------------------------------------- */
const company = accts.find(a => a.kind === 'company');
ok('W5 his page is the player\'s', !!company && company.player === true && company.lean === 'en');
rows.filter(isCompanyRow).forEach(r => r.words.forEach(w => {
  ok('W5 ' + r.id + ' has no Spanglish twin', w.es === undefined, w.es);
}));
S.setSeed('feed-words-W5');
let spoke = 0;
for (let i = 0; i < 2000; i++) if (S.regFor({ key: company.id, player: true }, 'man_hired:' + i) !== 'en') spoke++;
ok('W5 the dial never rolls his page into Spanglish', spoke === 0, spoke + ' of 2000');
ok('W5 every bot is a machine and never code-switches', accts.filter(a => a.kind === 'bot').every(a => a.machine === true && a.lean === 'en'));
rows.filter(isMachineRow).forEach(r => ok('W5 ' + r.id + ' has no twin', r.words.every(w => w.es === undefined)));

/* ---- W6 THE ENGLISH IS ENGLISH, THE TWIN IS SPANGLISH ---------------------------- */
lines.forEach(({ r, w }) => {
  const en = P.esWordsIn(strip(w.en));
  ok('W6 ' + r.id + ': the English line carries no Spanish', en.length === 0, en.join(',') + ' | ' + w.en);
  if (w.es !== undefined) {
    const es = P.esWordsIn(strip(w.es));
    ok('W6 ' + r.id + ': the twin is Spanglish', es.length > 0, w.es);
    ok('W6 ' + r.id + ': the twin keeps the same fills', JSON.stringify((w.en.match(/\{[a-z]+\}/g) || []).sort()) ===
       JSON.stringify((w.es.match(/\{[a-z]+\}/g) || []).sort()), w.en + ' | ' + w.es);
  }
});
const twins = lines.filter(x => x.w.es !== undefined).length;
const human = lines.filter(x => !isCompanyRow(x.r) && !isMachineRow(x.r)).length;
ok('W6 a third or more of the people\'s lines have a twin of their own (flavour() is the fallback, not the voice)',
   twins * 3 >= human, twins + ' of ' + human);

/* ---- W7 Q15: SOMEBODY NEVER DID IT; A PERSON IS IN EVERY HUMAN LINE ----------------- */
const AGENT_FILL = /\{(company|man|rare|faction|enemy)\}/;
const AGENT_WORD = new RegExp('\\b(i|i\'m|i\'ve|i\'ll|i\'d|me|my|we|we\'re|we\'ve|we\'ll|our|ours|us|you|your|you\'re|you\'ll|yours|y\'all|' +
  'anyone|anybody|everybody|everyone|nobody|people|folks|he|he\'s|she|she\'s|they|they\'re|they\'ve|them|his|her|their|theirs|' +
  'man|men|woman|women|kid|kids|family|families|mother|mom|dad|father|brother|sister|cousin|uncle|aunt|son|daughter|' +
  'husband|wife|neighbor|neighbors|boys|girl|guy|lady|nurse|captain|boss|runner|runners|crew|admin|mrs|mr|members|' +
  'keepers|herd|flock|house|grandmother|nephew|mine|myself|boy|riders|whoever)\\b', 'i');
/* A COMMAND TALKS TO THE READER ('bring cells', 'avoid the area', 'go early'), and a feed drops the
   'i' off what the poster did ('heard {town} fell', 'drove it myself', 'lost dog'): both are a person
   in the line, the poster or the reader. The verb has to open a sentence (or follow a 'PLACE:' head),
   so a noun that is also a verb mid-sentence never counts. */
const ADDRESS = new RegExp('(^|[.!?:]\\s+)(bring|go|stay|keep|tape|wet|hang|take|lock|put|pay|drive|come|call|check|ask|tell|' +
  'don\'t|please|get|avoid|boil|charge|pray|leave|let|say|stop|wave|turn|watch|give|look|line|message|rest|thank|' +
  'heard|saw|drove|found|lost|missing|need|needs|looking|trading|giving|counting|watched|turned|teaching|' +
  'praying|dropping|shared|bumping|messaged)\\b', 'i');
lines.forEach(({ r, w }) => {
  const both = w.en + ' ' + (w.es || '');
  ok('W7 ' + r.id + ': "somebody" is never the one who did it', !/\b(somebody|someone)\b/i.test(both), w.en);
  /* a reply answers a person by construction ('shared.', 'rest easy.'); a bot is the one machine voice */
  if (isMachineRow(r) || replies.indexOf(r) >= 0) return;
  const t = strip(w.en).trim();
  ok('W7 ' + r.id + ': names a person or talks to one', AGENT_FILL.test(w.en) || AGENT_WORD.test(t) || ADDRESS.test(t), w.en);
});

/* ---- W8 NO MACHINE'S WORDS IN A PERSON'S MOUTH; NEVER A JOKE AT THE PLAYER ---------- */
const MACHINE = /\b(successfully|completed|achievement|unlocked|level up|quests?|player|notification|xp|user|event|status|deed|ledger|reputation|faction)\b|%|\+\d|\[|\]/i;
const MOCK = /\b(lol|lmao|haha|clown|idiot|loser|noob|bozo|cringe)\b/i;
lines.forEach(({ r, w }) => {
  if (!isMachineRow(r)) ok('W8 ' + r.id + ': no machine word', !MACHINE.test(strip(w.en)) && !MACHINE.test(strip(w.es || '')), w.en);
  ok('W8 ' + r.id + ': never a joke at the player', !MOCK.test(w.en + ' ' + (w.es || '')), w.en);
});

/* ---- W9 NO TWO ALIKE ------------------------------------------------------------ */
const flat = s => String(s).toLowerCase().replace(/[^a-z0-9{} ]/g, '').replace(/\s+/g, ' ').trim();
const seenEn = {}, seenEs = {}; let dupEn = [], dupEs = [];
lines.forEach(({ w }) => {
  const a = flat(w.en); if (seenEn[a]) dupEn.push(w.en); seenEn[a] = 1;
  if (w.es !== undefined) { const b = flat(w.es); if (seenEs[b]) dupEs.push(w.es); seenEs[b] = 1; }
});
ok('W9 no two English lines alike in the whole bank', dupEn.length === 0, dupEn.slice(0, 3).join(' || '));
ok('W9 no two twins alike', dupEs.length === 0, dupEs.slice(0, 3).join(' || '));
rows.forEach(r => {
  const opens = {}; let clash = [];
  (r.words || []).forEach(w => { const o = flat(w.en).split(' ').slice(0, 3).join(' '); if (opens[o]) clash.push(o); opens[o] = 1; });
  /* the bots are the one exception: a scheduler repeats its opening, that is the horror */
  if (!isMachineRow(r)) ok('W9 ' + r.id + ': no two variants open the same way', clash.length === 0, clash.join(' / '));
});

/* ---- W10 THE FILLS ------------------------------------------------------------- */
const declared = B.fills || {};
rows.forEach(r => {
  const used = {};
  (r.words || []).forEach(w => ((w.en + ' ' + (w.es || '')).match(/\{[a-z]+\}/g) || []).forEach(f => { used[f] = 1; }));
  Object.keys(used).forEach(f => {
    ok('W10 ' + r.id + ': ' + f + ' is declared', !!declared[f]);
    ok('W10 ' + r.id + ': ' + f + ' is in the row\'s fills', (r.fills || []).indexOf(f) >= 0);
  });
  if (!/^page_/.test(r.id)) (r.fills || []).forEach(f => ok('W10 ' + r.id + ': its fill ' + f + ' is used', !!used[f]));
});

/* ---- W10b A FACTION IS ALWAYS A PLURAL, AND THE VERB AGREES -------------------------------
   Found reading the first filled hour: 'the road crews still has the road'. The names are mixed
   singular and plural (the House, the runners), so {enemy} and {faction} are always filled from one
   plural a person says, and no line puts a singular verb after one. */
const says = (B.faction_says && B.faction_says.value) || {};
factions.forEach(f => ok('W10b ' + f.id + ' has its plural (' + (says[f.id] || 'none') + ')', typeof says[f.id] === 'string' && says[f.id].length > 3));
const SINGULAR = /\{(enemy|faction)\}('s)? ((still|now|already|just|really|never) )?(is|has|holds|was|isn't|wasn't|hasn't|doesn't|knows|wants|keeps|takes|says|goes)\b/;
/* and his company's name is his to type, singular or plural ('Bone Saints', 'Iron Company'), so no verb
   that has to agree ever follows it: 'the {company} came', never 'the {company} was' */
const COMPANY_AGREES = /\{company\}('s)? ((still|now|already|just|really|never) )?(is|was|has|are|were|have|isn't|wasn't|hasn't|aren't|weren't|haven't|does|doesn't|do|don't)\b/i;
lines.forEach(({ r, w }) => [w.en, w.es].filter(Boolean).forEach(t =>
  ok('W10b ' + r.id + ': a plural verb after a faction', !SINGULAR.test(t), t)));
lines.forEach(({ r, w }) => [w.en, w.es].filter(Boolean).forEach(t =>
  ok('W10b ' + r.id + ': no verb that must agree after his company\'s name', !COMPANY_AGREES.test(t), t)));

/* ---- W11 SHORT LIKE A POST ON A PHONE -------------------------------------------- */
let longest = { n: 0, t: '' };
lines.forEach(({ w }) => [w.en, w.es].forEach(t => { if (t && t.length > longest.n) longest = { n: t.length, t }; }));
ok('W11 every line fits a phone (170 characters before fills)', longest.n <= 170, longest.n + ': ' + longest.t);

/* ---- W12 A BIG EVENT GETS REPLIES AND A FOLLOW-UP ---------------------------------- */
replies.concat(follows).forEach(r => (r.to || []).forEach(t => ok('W12 ' + r.id + ' answers a kind that exists (' + t + ')', !!kindIds[t])));
kinds.filter(k => k.big).forEach(k => {
  ok('W12 the big "' + k.id + '" gets replies', replies.some(r => (r.to || []).indexOf(k.id) >= 0));
  ok('W12 the big "' + k.id + '" gets a follow-up', follows.some(r => (r.to || []).indexOf(k.id) >= 0));
});
ok('W12 every bot is answered by a person', kinds.filter(isMachineRow).every(k => replies.some(r => (r.to || []).indexOf(k.id) >= 0)));

/* ---- W13 THE HOUSE RATE ON THE REAL DIAL ----------------------------------------- */
/* A long feed, paced by each kind's own suggested 'every' (a kind that may post once in eight hours
   comes up eight times less than one that may post every hour), each post from an account in its
   pool, its form picked exactly as how_to_speak says. The share of posts carrying Spanish must sit
   in his 10 to 15 (rule 143a). */
function poolOf(w) {
  if (w === 'company') return accts.filter(a => a.kind === 'company');
  if (w === 'scanner') return accts.filter(a => a.kind === 'scanner');
  if (w === 'stranger') return accts.filter(a => a.kind === 'stranger');
  if (w === 'town' || w === 'valley') return people;
  if (/^faction:/.test(w)) return accts.filter(a => a.kind === 'page' && a.faction === w.slice(8));
  return byId[w] ? [byId[w]] : [];
}
function speak(a, key, w) {
  if (a.player || a.machine) return w.en;
  const who = { key: a.id, lang: a.lean || undefined };
  const reg = S.regFor(who, key, a.lean || undefined);
  if (reg === 'en') return w.en;
  return w.es !== undefined ? w.es : S.flavour(w.en, who);
}
S.setSeed('feed-words-W13');
const weighted = [];
kinds.forEach(k => { const per = 60 / (k.suggest && k.suggest.every_min ? k.suggest.every_min : 60); weighted.push([k, per]); });
const total = weighted.reduce((s, x) => s + x[1], 0);
let posts = 0, es = 0, h = 7;
const rnd = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return h / 4294967296; };
for (let i = 0; i < 40000; i++) {
  let t = rnd() * total, k = weighted[0][0];
  for (const [kk, per] of weighted) { t -= per; if (t <= 0) { k = kk; break; } }
  const pool = [].concat(...k.who.map(poolOf)); if (!pool.length) continue;
  const a = pool[Math.floor(rnd() * pool.length)], w = k.words[Math.floor(rnd() * k.words.length)];
  const out = speak(a, k.id + ':' + i, w);
  posts++; if (P.esWordsIn(strip(out)).length) es++;
}
const share = es / posts;
console.log('  the paced feed: ' + posts + ' posts, ' + (100 * share).toFixed(1) + ' in 100 carry Spanish');
ok('W13 the house rate: 10 to 15 posts in 100 come out Spanglish', share >= 0.10 && share <= 0.15, (100 * share).toFixed(1));

/* ---- THE COUNT, for the record ---------------------------------------------------- */
const ah = lines.filter(x => (x.w.tags || []).indexOf('ah') >= 0).length;
console.log('  ' + accts.length + ' accounts, ' + kinds.length + ' kinds (' + count('mine') + ' mine, ' + count('world') + ' world, ' +
  count('life') + ' life), ' + replies.length + ' reply rows, ' + follows.length + ' follow-up rows');
console.log('  ' + lines.length + ' lines, ' + twins + ' Spanglish twins, ' + ah + ' marked as analog horror for EYES');
console.log('-'.repeat(74));
console.log("THE FEED'S WORDS: " + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
