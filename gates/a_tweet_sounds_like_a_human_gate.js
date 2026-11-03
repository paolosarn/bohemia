#!/usr/bin/env node
/* A TWEET SOUNDS LIKE A HUMAN (WORDS 2, 11/3/26; VAMILY rule 372, ask line 398).

   His words, the VOTE tab, on the world feed: 'you kinda suck at sounding like a human tweeting. Some of it is good but a lot
   of it is kinda like what the fuck does that even mean.'

   Reads every line the phone's feed can post: records/target/bb/feed_kinds.json (the valley's kinds, replies and follow-ups),
   records/target/bb/feed_world.json (the world, its replies) and records/target/bb/radio_lines.json (a town falling, rule 371).
     T1  NO CRYPTIC TELL: each tell is a shape that made him ask what a line meant, found in the feed on 11/3 (the record names the
         line each one caught): a thing that is not a person doing a person's thing; a formula nobody types ('that is the X now');
         two fragments mirrored ('minds in the cloud, feet in the rain'); a paradox for its own sake ('free and impossible', 'look
         what forever bought', 'a different lagos'); the turn-around ('the card does not work. the hour does.'); radio jargon a
         stranger cannot read ('73', 'keys up', 'four-one'); a transcript in a post (a time stamp, a line that is only brackets)
     T2  A PLAIN SUBJECT AND VERB: every post a person writes has a verb in it (the feed's machines, the bots, are exempt: a
         machine's line is a label)
     T3  THE RULES IT RIDES ON ARE HELD ELSEWHERE AND STILL HOLD HERE: 120 characters with the fills at their longest is THE FEED
         HAS A MAX LENGTH's; English only is the LANGUAGE gate's; the city is Bohemia is IT IS CALLED BOHEMIA's. This leg only
         checks no line here has an em dash, a Spanish twin newer than its line, or the old name
     P   PLANTS: one line for each tell is caught; plain lines pass
   Run: node gates/a_tweet_sounds_like_a_human_gate.js   (node only, seconds) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + String(why).slice(0, 900) + ']' : '')); };

const TELLS = [
  ['A THING DOING A PERSON\'S THING', /\bthe (moon|trees?|road|port|calendar|card|hour|light|sky|landfill|arms|receipt|floor) (does not|doesn't|do not|don't|knows?|cares?|listens?|tells? you|waits?|is waiting|wave|waves)\b/i],
  ['A FORMULA NOBODY TYPES', /\bthat is the [a-z ]{1,24} now\b|\bis the last \w+ in \w+\b|\bthat is how you know\b/i],
  ['TWO FRAGMENTS MIRRORED', /\b\w+ in the \w+, \w+ in the \w+\b/i],
  ['A PARADOX FOR ITS OWN SAKE', /\bfree and impossible\b|\blook what \w+ bought\b|\ba different (lagos|city|town|country)\b|\bwhat was never finished\b|\bonly unfinished\b|\bit is waiting\b/i],
  ['THE TURN-AROUND', /\b(does not|doesn't) work\. the \w+ does\b|\bdid not\. the \w+ did\b/i],
  ['RADIO JARGON', /(^|\s)73\.?$|\bkeys up\b|\bfour-one\b|\bcallsign\b/i],
  ['A TRANSCRIPT IN A POST', /^\s*\d\d:\d\d(:\d\d)?\s|^\s*\[[^\]]*\]\s*$/]
];
/* a verb: a closed list of the verbs these posts use, any -ed or -ing word, any contraction, a modal */
const VERBS = new Set(('am is are was were be been being has have had do does did can could will would shall should may might must '
  + 'go goes went gone get gets got take takes took taken make makes made say says said see sees saw seen know knows knew think thinks '
  + 'come comes came give gives gave find finds found tell tells told ask asks call calls keep keeps kept leave leaves left let lets '
  + 'put puts run runs ran bring brings brought buy buys bought pay pays paid sell sells sold need needs want wants hold holds held '
  + 'stand stands stood sit sits sat wait waits hear hears heard eat eats ate drink drinks drive drives drove ride rides rode walk walks '
  + 'carry carries try tries tried look looks watch watches hit hits shoot shoots shot win wins won lose loses lost die dies fall falls fell '
  + 'open opens close closes lock locks stop stops start starts work works live lives hope hopes pray prays thank thanks bury buries '
  + 'trade trades charge charges cost costs move moves count counts check checks fix fixes help helps hire hires sign signs join joins '
  + 'send sends sent stay stays turn turns burn burns break breaks broke fill fills boil boils cross crosses rest feed feeds fed '
  + 'meet meets met bark barks hate hates love loves like likes miss misses bet bets owe owes seem seems mean means guess remember '
  + 'post posts reply share go keep tape bring don\'t won\'t can\'t isn\'t aren\'t wasn\'t weren\'t didn\'t doesn\'t haven\'t '
  + 'answers knock tow listen listens wave waves smile smiles laugh laughs cry cries play plays sleep sleeps wake wakes believe '
  + 'beat beats forgive forgives write writes wrote vote votes cough coughs warm clear clears rob robs steal steals grow grows '
  + 'talk talks pick picks answer').split(/\s+/));
const NOT_VERBS = new Set('nothing something anything everything morning evening building ceiling king ring thing spring string wing bed red shed seed need weed sled'.split(' '));
/* a question or a short reply (four words or fewer) is how people talk and needs no verb; anything longer needs one somewhere */
const hasVerb = t => /\?\s*$/.test(t) || String(t).trim().split(/\s+/).length <= 4 || String(t).toLowerCase().replace(/\{[a-z_]+\}/g, ' x ').split(/[^a-z']+/).some(w => w && (VERBS.has(w)
  || (/^[a-z]+(ed|ing)$/.test(w) && !NOT_VERBS.has(w)) || /'(s|re|m|ll|ve|d)$/.test(w) || /n't$/.test(w)));

function lines() {
  const out = [];
  const K = R('records/target/bb/feed_kinds.json'), W = R('records/target/bb/feed_world.json'), L = R('records/target/bb/radio_lines.json');
  const acc = {}; (K.accounts || []).concat(W.accounts || []).forEach(a => { acc[a.id] = a; });
  const machine = k => (k.who || []).length && (k.who || []).every(id => acc[id] && acc[id].kind === 'bot');
  K.kinds.forEach(k => (k.words || []).forEach(w => out.push({ t: w.en, es: w.es, where: 'feed ' + k.id, machine: machine(k) })));
  (K.replies || []).concat(K.followups || []).forEach(r => (r.words || []).forEach(w => out.push({ t: w.en, es: w.es, where: 'feed reply', machine: false })));
  W.kinds.forEach(k => { (k.words || []).forEach(w => out.push({ t: w.en, es: w.es, where: 'world ' + k.id, machine: false }));
    (k.replies || []).forEach(r => (r.words || []).forEach(w => out.push({ t: w.en, es: w.es, where: 'world reply', machine: false }))); });
  Object.keys(L.towns).forEach(t => L.towns[t].lines.forEach(x => out.push({ t: x.say, where: 'radio ' + t, machine: false })));
  return out.filter(x => typeof x.t === 'string' && x.t.trim());
}
const tellsOf = t => TELLS.filter(([, re]) => re.test(t)).map(([n]) => n);

console.log('='.repeat(74));
console.log('A TWEET SOUNDS LIKE A HUMAN: every post plain, one clear thing, typed on a phone (rule 372)');
console.log('='.repeat(74));
const ALL = lines();
{
  const hits = ALL.filter(x => tellsOf(x.t).length);
  leg(ALL.length >= 700 && !hits.length, 'T1  NO CRYPTIC TELL IN ANY OF THE FEED\'S LINES, THE WORLD\'S OR A FALLING TOWN\'S',
    ALL.length + ' lines read; ' + (hits.length ? hits.slice(0, 8).map(x => tellsOf(x.t)[0] + ': ' + x.where + ' "' + x.t + '"').join(' | ') : 'none'));
}
{
  const noVerb = ALL.filter(x => !x.machine && !hasVerb(x.t));
  leg(!noVerb.length, 'T2  EVERY POST A PERSON WRITES HAS A VERB IN IT (a question, a reply of four words or fewer, and the bots are exempt)',
    (ALL.filter(x => !x.machine).length) + ' person lines; ' + (noVerb.length ? noVerb.slice(0, 8).map(x => x.where + ' "' + x.t + '"').join(' | ') : 'none without'));
}
{
  const dash = ALL.filter(x => /[\u2013\u2014]/.test(x.t)), vegas = ALL.filter(x => /vegas/i.test(x.t + ' ' + (x.es || '')));
  leg(!dash.length && !vegas.length, 'T3  NO EM DASH, AND THE CITY IS BOHEMIA (the max, English only and the name are held by their own gates)',
    'dashes ' + dash.length + ', the old name ' + vegas.length);
}
{
  const plant = ['the moon does not know what country it is in.', 'my mother waves at seven. that is the phone call now.',
    'minds in the cloud, feet in the rain.', 'chai is free and impossible.', 'the card does not work. the hour does.',
    'KD5 relay: all well. 73.', '04:51:12 TOWER  Roof copies.'];
  const caught = plant.filter(t => tellsOf(t).length), plain = ['dust coming up from the south. bring the laundry in.', 'shared.', 'rest easy.', 'my dad drove a truck to bohemia twice a week.'];
  const freed = plain.filter(t => !tellsOf(t).length && hasVerb(t)), verbless = ['{man}. All of it. {place}. Nothing else.', 'tracks out there. big ones. the wash by the school.'].filter(t => !hasVerb(t));
  leg(caught.length === plant.length && freed.length === plain.length && verbless.length === 2,
    'P   THE PLANTS: one line for each tell is caught; plain lines pass; a line with no verb is caught',
    caught.length + '/' + plant.length + ' tells, ' + freed.length + '/' + plain.length + ' plain pass, ' + verbless.length + '/2 verbless caught');
}
console.log('\n=== A TWEET SOUNDS LIKE A HUMAN: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
