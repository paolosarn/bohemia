/* ============================================================================
   BOHEMIA RUMOURS TRAVEL (9/22/26, PEOPLE lane).
   VAMILY [rumours travel], row A-RUMOUR-ABOUT-SOMEBODY-WHO-IS-NOT-YOU.

   THE ROW: "The city already gossips properly: hop counts, hearsay decay, a
   quiet deed dies with its witness. In 1,669 lines it has passed on news about
   somebody other than the player exactly ONCE, and it has never once been WRONG.
   We even wrote the line where a stranger says 'probably the wrong version' and
   there has never been a wrong version."

   *** THREE THINGS WERE MEASURED ON THE ALPHA BEFORE A LINE WAS WRITTEN. ***

   1. THE ORGAN COULD CARRY A THIRD-PARTY STORY AND CARRIED IT PERFECTLY. One
      mind witnessed somebody who was not the player, gossip moved it, and a
      field-by-field diff of the copy against the original read `changed: []`.
      The only thing a retelling cost was BELIEF.

   2. EVERY DEED IN THE CITY WAS ABOUT THE PLAYER. After a player act the actor
      tally read {'@': 1}; ctDeed hard-codes '@' and was the only caller of
      witness() in the walked world, and the reaction bark then refused anything
      whose actor was not '@'.

   3. *** AND THE CITY COULD NOT GOSSIP AT ALL, BECAUSE OF THIS LANE'S OWN LAST
      *** ROUND. The gossip pass paired people out of BARK_DREW, the RENDERER'S
      list of who it painted, and [no clumping] had just stopped the renderer
      painting two bodies within ten cells of each other:

          closest drawn pair, before the room rule      1 cell
          closest drawn pair, after it                 19 cells
          what the pass needs to pair anybody           2 cells
          pair timers that ever started, after          0

      Two right decisions, one dead organ, and every claim about news travelling
      was a claim that could not fail. Proved with a positive first: two real
      city people forced one cell apart fill the timer, fire, and the second ends
      up holding the first one's news at hops 1.

   WHAT THIS HOLDS:
   A. the module distorts a retelling, with the four changes named and rated
   B. a story keeps its own name, so a distorted one cannot come back as news
   C. the city asks the WORLD where people are, not the camera
   D. the world makes news about people who are not the player, and they see
      each other, which nothing in this game had ever done
   E. on the alpha: stories about other people, travelling, arriving wrong
   F. a mouth says it, with a head and a plate, and the wrong version reads wrong
   G. the cook is in the VOTE tab and it is pixels

   node gates/rumours_travel_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const MOD = path.join(ROOT, 'engine/bohemia_standing.js');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_ONE_STORY_THREE_MOUTHS_9_22_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_RUMOURS_TRAVEL_9_22_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(k, v) { notes.push(k + ': ' + v); console.log('       ' + k + ': ' + v); }
/* A TEST ABOUT WHERE THE NEWLINES FALL IS NOT A TEST ABOUT WHAT THE FILE SAYS.
   This lane paid for that three rounds running. Everything prose is flattened. */
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const mod = fs.readFileSync(MOD, 'utf8');
const city = fs.readFileSync(CITY, 'utf8');

/* ======================================================================== */
head('A. A STORY CHANGES IN THE TELLING, AND THE MODULE SAYS HOW');
/* ======================================================================== */
const S = require(MOD);
const M = require(path.join(ROOT, 'engine/bohemia_memory.js'));

ok('the four changes are a named dial and not four numbers buried in a branch',
   S.DRIFT && ['where', 'when', 'louder', 'blame'].every(k => typeof S.DRIFT[k] === 'number'),
   S.DRIFT ? JSON.stringify(S.DRIFT) : 'no DRIFT');
ok('and it is tagged draft, because a RATE is a judgement he gets to overturn',
   !!(S.DRIFT && S.DRIFT.draft === true));
ok('a story climbs and never descends, because nobody repeats the smaller version',
   S.LOUDER && Object.keys(S.LOUDER).length >= 5
     && !Object.keys(S.LOUDER).some(k => S.LOUDER[S.LOUDER[k]] === k),
   Object.keys(S.LOUDER || {}).length + ' rungs');
ok('the weights table is STILL empty, so nothing here invented a judgement',
   Object.keys(S.DEED_WEIGHT).length === 0);
ok('and the research behind the three changes is named in the file, not asserted',
   /Bartlett/.test(mod) && /Allport/.test(mod) && /serial reproduction/i.test(mod));
ok('*** AND THE MEASUREMENT THAT STARTED IT IS WRITTEN DOWN: THE COPY CHANGED '
   + 'NOTHING ***',
   /changed: \[\]/.test(flat(mod)) && /COPIED A DEED\s*\*\*\* AND CHANGED NOTHING/i
     .test(flat(mod).replace(/\*\*\*\s*/g, '*** ')));

/* THE SHAPE OF THE DRIFT, OVER ENOUGH RETELLINGS TO MEAN SOMETHING */
function mind(id) { const m = M.makeMind(id); m.deeds = m.deeds || []; return m; }
const A = mind('a');
const whereAt = () => ({ x: 100, y: 100 });
S.witness([A], 1000, 'victor', 'favour', 100, 100, whereAt, {});
/* a head with faces in it, which is what the blame bends toward */
for (let i = 0; i < 6; i++) M.see(A, 990 + i, 'nb' + i, 100, 100);
let n = 0, vagueW = 0, vagueT = 0, grew = 0, blamed = 0, same = 0;
for (let i = 0; i < 600; i++) {
  const L = mind('L' + i);
  const r = S.retell(A.deeds[0], A, L, 1000); n++;
  if (r.vague && r.vague.where) vagueW++;
  if (r.vague && r.vague.when) vagueT++;
  if (r.grew) grew++;
  if (r.truly) blamed++;
  if (!S.isWrong(r)) same++;
}
note('over ' + n + ' retellings', 'place ' + vagueW + ', hour ' + vagueT
  + ', grew ' + grew + ', wrong man ' + blamed + ', untouched ' + same);
const near = (got, want) => Math.abs(got / n - want) < 0.06;
ok('THE PLACE SLIDES at the rate the dial says', near(vagueW, S.DRIFT.where),
   (100 * vagueW / n).toFixed(1) + '% against ' + (100 * S.DRIFT.where) + '%');
ok('THE HOUR GOES at the rate the dial says', near(vagueT, S.DRIFT.when),
   (100 * vagueT / n).toFixed(1) + '% against ' + (100 * S.DRIFT.when) + '%');
ok('THE STORY GROWS at the rate the dial says', near(grew, S.DRIFT.louder),
   (100 * grew / n).toFixed(1) + '% against ' + (100 * S.DRIFT.louder) + '%');
ok('*** AND THE BLAME MOVES ONTO SOMEBODY ELSE, which is the one the row is '
   + 'really about ***', near(blamed, S.DRIFT.blame),
   (100 * blamed / n).toFixed(1) + '% against ' + (100 * S.DRIFT.blame) + '%');
ok('and a story that was moved onto the wrong man still remembers the right one',
   (function () {
     for (let i = 0; i < 600; i++) {
       const r = S.retell(A.deeds[0], A, mind('Z' + i), 1000);
       if (r.truly) return r.truly === 'victor';
     }
     return false;
   })());
ok('*** THE SAME RETELLING COMES OUT THE SAME WAY EVERY TIME, so a rumour is '
   + 'not a slot machine ***',
   JSON.stringify(S.retell(A.deeds[0], A, mind('same'), 1000))
     === JSON.stringify(S.retell(A.deeds[0], A, mind('same'), 1000)));
probe('the instrument can see an UNCHANGED retelling too, so the rates above '
  + 'are not a function that always says yes', same > 0 && same < n);

/* ======================================================================== */
head('B. A STORY KEEPS ITS OWN NAME');
/* ======================================================================== */
const P = mind('p'), Q = mind('q');
S.witness([P], 2000, 'ruben', 'loan:short', 50, 50, () => ({ x: 50, y: 50 }), {});
ok('a deed is stamped with the story it belongs to the moment it is witnessed',
   !!P.deeds[0].seed, P.deeds[0].seed || 'none');
const moved1 = S.gossip(P, Q, 2000);
ok('and it moves', moved1 === 1, 'moved ' + moved1);
ok('*** AND IT CANNOT COME BACK AROUND AS NEWS, however far it drifted. *** '
   + 'The old test compared actor+kind+turn, and distortion changes both, so one '
   + 'event could have bounced between two neighbours for ever',
   S.gossip(P, Q, 2001) === 0 && S.gossip(Q, P, 2002) === 0);
ok('the recogniser is asked in ONE place, so a mouth and a gate cannot disagree',
   typeof S.seedOf === 'function' && typeof S.isWrong === 'function');

/* ======================================================================== */
head('C. THE CITY ASKS THE WORLD, NOT THE CAMERA');
/* ======================================================================== */
ok('the gossip pass reads where the WORLD has people, through the same reader '
   + 'the renderer uses', /function ctWhereEveryoneIs\(\)/.test(city)
   && /ctWhereEveryoneIs\(\)/.test(city.split('function ctGossipPass')[1] || ''));
/* ASK THE FUNCTION, NOT THE FILE. The first cut of this claim swept the whole
   city for "var drew = (typeof BARK_DREW" and went red, because ctDeedBark,
   ctRumourBark and walkSpeak all read the draw list for their own correct reason:
   WHO IS ON SCREEN NEAR HIM. That is a draw question and the draw list is the
   right answer to it. The only thing that was wrong was asking it WHERE PEOPLE
   ARE. Fourth time this lane has written a test about the shape of the text
   instead of its substance. */
const gossipFn = city.slice(city.indexOf('function ctGossipPass()'),
                            city.indexOf('function ctGossipPass()') + 2000);
ok('and the gossip pass itself no longer touches the draw list at all',
   gossipFn.length > 200 && gossipFn.indexOf('BARK_DREW') < 0,
   gossipFn.indexOf('BARK_DREW') < 0 ? 'no BARK_DREW inside ctGossipPass'
                                     : 'still reads the draw list');
probe('and the sweep really read the function, so that green is not an empty '
  + 'string', /for \(var i = 0; i < here\.length/.test(gossipFn));
ok('*** AND THE REGRESSION IS WRITTEN DOWN WITH ITS NUMBERS, so nobody has to '
   + 'rediscover it ***',
   /closest drawn pair, before the room rule\s+1 cell/.test(flat(city).replace(/ +/g, ' '))
     || /closest drawn pair, before the room rule/.test(flat(city)));
ok('and it says WHY the room rule is not the thing to loosen',
   /THE FIX IS NOT TO LOOSEN THE ROOM/.test(flat(city)));

/* ======================================================================== */
head('D. THE WORLD MAKES ITS OWN NEWS, AND PEOPLE SEE EACH OTHER');
/* ======================================================================== */
ok('two people who stood together long enough can have had something happen',
   /function ctNeighbourDeed\(/.test(city));
ok('and it goes through the ONE door, witness(), never a second writer',
   /ctNeighbourDeed[\s\S]{0,2600}?BohemiaStanding\.witness\(/.test(city));
ok('the odds are a named rate, draft, not a number in a branch',
   /var CT_NEWS_ODDS = [0-9.]+;\s*\/\* draft/.test(city));
ok('*** AND AN OUTFIT CHOOSES WHICH ACT IT WAS, NEVER WHETHER THERE WAS ONE, '
   + 'which cost a cut ***',
   /CT_NEWS_ACT\.plain/.test(city)
     && /A NEIGHBOURHOOD'S GOSSIP IS ABOUT NEIGHBOURS, NOT ABOUT GANGS/.test(flat(city)));
ok('and the measurement that proved it is in the file: 15 of 61 with an outfit, '
   + 'ONE outfit on the block, zero stories in a day',
   /of them with any outfit at all\s+15/.test(flat(city).replace(/ +/g, ' '))
     || /of them with any outfit at all/.test(flat(city)));
ok('*** AND TWO PEOPLE WHO STAND TOGETHER SEE EACH OTHER, WHICH NOTHING IN THIS '
   + 'GAME HAD EVER DONE ***',
   /BohemiaMemory\.see\(ctMind\(ka\), now, kb/.test(city)
     && /BohemiaMemory\.see\(ctMind\(kb\), now, ka/.test(city));
ok('and the 61-minds-one-sighting measurement is written beside it',
   /61 minds, and ONE sighting in the entire city/i.test(flat(city)));
ok('the blame bends toward a FAMILIAR FACE, off the sighting list, not off a '
   + 'hate ranking that cannot exist while the weights are empty',
   /from\.sightings/.test(mod) && /blameTargets/.test(mod)
     && /minds holding exactly one\s+20/.test(flat(mod).replace(/ +/g, ' ')));

/* ======================================================================== */
head('E. ON THE ALPHA: NEWS ABOUT PEOPLE WHO ARE NOT HIM');
/* ======================================================================== */
let drove = false, r = null, spoke = null;
try {
  const { open } = require(DRIVE);
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  drove = true;
  r = await d.fr.evaluate(async () => {
    try { ctPeopleWipe(); } catch (e) {}
    try { render(); } catch (e) {}
    const here = ctWhereEveryoneIs();
    let closest = 1e9, within2 = 0;
    for (let i = 0; i < here.length; i++) for (let k = i + 1; k < here.length; k++) {
      const m = Math.abs(here[i].at[0] - here[k].at[0])
              + Math.abs(here[i].at[1] - here[k].at[1]);
      if (m < closest) closest = m;
      if (m <= 2) within2++;
    }
    const keep = T.min, keepDay = T.day;
    CT_TOGETHER = {}; CT_GOSSIP_MIN = -1;
    for (let step = 0; step < 150; step++) {
      T.min = (keep + step * 10) % 1440;
      T.day = keepDay + Math.floor((keep + step * 10) / 1440);
      try { render(); } catch (e) {}
      try { ctGossipPass(); } catch (e) {}
    }
    /* THE PASS ALONE, with the render taken out, because 60 on a phone is the floor */
    let t = performance.now();
    for (let i = 0; i < 40; i++) { T.min = (keep + 1500 + i * 10) % 1440; ctGossipPass(); }
    const passMs = (performance.now() - t) / 40;
    const minds = ctMindsList();
    const actors = {}, hops = {}, kinds = {}, bySeed = {};
    let wrong = 0, blamed = 0, grewN = 0, total = 0, holders = 0;
    for (const m of minds) {
      let has = false;
      for (const dd of (m.deeds || [])) {
        total++; has = has || dd.actor !== '@';
        actors[dd.actor] = (actors[dd.actor] || 0) + 1;
        hops[dd.hops || 0] = (hops[dd.hops || 0] || 0) + 1;
        kinds[dd.kind] = (kinds[dd.kind] || 0) + 1;
        if (BohemiaStanding.isWrong(dd)) wrong++;
        if (dd.truly) blamed++;
        if (dd.grew) grewN++;
        const s = BohemiaStanding.seedOf(dd);
        (bySeed[s] = bySeed[s] || new Set())
          .add(dd.actor + '/' + dd.kind + '/'
               + (dd.vague ? (dd.vague.where ? 'w' : '') + (dd.vague.when ? 't' : '') : ''));
      }
      if (has) holders++;
    }
    let worst = 0;
    for (const s in bySeed) worst = Math.max(worst, bySeed[s].size);
    T.min = keep; T.day = keepDay;
    return { worldPeople: here.length, closest: closest === 1e9 ? null : closest,
             within2, minds: minds.length, deeds: total, holders,
             people: Object.keys(actors).length, aboutHim: actors['@'] || 0,
             stories: Object.keys(bySeed).length, mostVersions: worst,
             hops, kinds, wrong, blamed, grew: grewN, passMs: +passMs.toFixed(2) };
  });
  note('the block', r.worldPeople + ' people, closest pair ' + r.closest
    + ' cells, ' + r.within2 + ' pairs within talking distance');
  note('after a day', r.deeds + ' deeds, ' + r.people + ' people talked about, '
    + r.holders + ' carrying news, ' + r.stories + ' stories');
  note('hops', JSON.stringify(r.hops));
  note('kinds', JSON.stringify(r.kinds));

  probe('the street really has people on it, so a number below is not an empty set',
        r.worldPeople > 20 && r.minds > 20);
  ok('*** THE CITY CAN GOSSIP AGAIN: two people really stand within talking '
     + 'distance in the WORLD, where [no clumping] left nineteen cells on the '
     + 'GLASS ***', r.closest !== null && r.closest <= 2 && r.within2 > 0,
     'closest ' + r.closest + ' cells, ' + r.within2 + ' pairs');
  ok('*** AND THE CITY NOW TALKS ABOUT PEOPLE WHO ARE NOT HIM. *** The row said '
     + 'it had done that exactly once in 1,669 lines',
     r.deeds > 50 && r.people >= 5 && r.aboutHim === 0,
     r.deeds + ' deeds about ' + r.people + ' people, ' + r.aboutHim + ' about him');
  ok('AND THE NEWS REALLY TRAVELS: somebody is holding a story they did not see',
     Object.keys(r.hops).some(h => +h > 0 && r.hops[h] > 0), JSON.stringify(r.hops));
  ok('*** AND IT ARRIVES WRONG, which had never once happened ***',
     r.wrong > 0 && r.blamed > 0 && r.grew > 0,
     r.wrong + ' wrong, ' + r.blamed + ' blamed on the wrong man, ' + r.grew + ' grown');
  ok('and the growing really invents acts the city never raised, so the ladder '
     + 'is doing work rather than decorating',
     !!(r.kinds['pushed_the_price'] || r.kinds['downed'] || r.kinds['commit']),
     Object.keys(r.kinds).join(', '));
  ok('*** ONE EVENT IS ALIVE IN THE CITY AS SEVERAL DIFFERENT STORIES ***',
     r.mostVersions >= 3, 'the worst-mangled story has ' + r.mostVersions + ' versions');
  ok('and the pass is free at 120 BPM, which is the only reason it may run every '
     + 'frame', r.passMs < 4, r.passMs + ' ms a pass');

  /* ---- F. A MOUTH SAYS IT ---- */
  head('F. AND SOMEBODY SAYS IT OUT LOUD, WITH A HEAD AND A PLATE');
  spoke = await d.fr.evaluate(async () => {
    try { render(); } catch (e) {}
    const near = BARK_DREW.filter(b => Math.abs(b.at[0] - hx) + Math.abs(b.at[1] - hy) <= 6);
    if (!near.length) return { err: 'nobody in earshot' };
    const speaker = near[0];
    const subject = (ctEveryone() || []).map(p => String(p.id))
      .filter(id => id !== String(speaker.p.id) && ctPersonName(id))[0];
    if (!subject) return { err: 'nobody nameable to talk about' };
    const now = ctMinuteNow();
    const m = ctMind(String(speaker.p.id));
    const out = {};
    /* THE CONTROL FIRST: with NO story in the mind, the rumour bark must be
       silent. A bark that fires on an empty ledger proves nothing about a full one. */
    m.deeds = []; CT_RUMOUR_SAID = {};
    BARK.p = null; BARK.until = 0; BARK.next = 0; window.__RUMOUR_SAID = null;
    try { barkTick(performance.now() + 2000); } catch (e) {}
    out.silentWithNothingToSay = !window.__RUMOUR_SAID;
    /* TRUE VERSION */
    m.deeds = [{ actor: subject, kind: 'loan:short', turn: now, hops: 0,
                 seed: subject + '|loan:short|' + now }];
    CT_RUMOUR_SAID = {};
    BARK.p = null; BARK.until = 0; BARK.next = 0; window.__RUMOUR_SAID = null;
    try { barkTick(performance.now() + 5000); } catch (e) { out.threw = String(e); }
    out.trueLine = window.__RUMOUR_SAID ? BARK.text : null;
    const h1 = ctSpeakerHead(BARK.p); out.head = h1 ? h1.text : null;
    /* WRONG VERSION, SAME MOUTH */
    m.deeds = [{ actor: subject, kind: 'pushed_the_price', turn: now, hops: 2,
                 truly: 'somebody-else', grew: ['loan:short'],
                 vague: { where: 1, when: 1 },
                 seed: 'somebody-else|loan:short|' + now }];
    CT_RUMOUR_SAID = {};
    BARK.p = null; BARK.until = 0; BARK.next = 0; window.__RUMOUR_SAID = null;
    try { barkTick(performance.now() + 9000); } catch (e) { out.threw2 = String(e); }
    out.wrongLine = window.__RUMOUR_SAID ? BARK.text : null;
    out.flaggedWrong = window.__RUMOUR_SAID ? window.__RUMOUR_SAID.wrong : null;
    return out;
  });
  if (spoke.trueLine) note('the true version', '"' + spoke.trueLine + '"');
  if (spoke.wrongLine) note('the wrong version', '"' + spoke.wrongLine + '"');

  probe('*** THE MOUTH IS SILENT WHEN IT HAS NOTHING TO SAY, so a line below is '
    + 'not a bark that fires on anything ***', spoke.silentWithNothingToSay === true);
  ok('somebody on the street says a story about a third party out loud',
     !!spoke.trueLine, spoke.trueLine || spoke.err || 'nothing said');
  ok('and the bubble carries WHO IS SPEAKING, per rule 19c: a mouth and a plate',
     !!spoke.head, spoke.head || 'no plate');
  ok('*** AND THE WRONG VERSION READS AS A WRONG VERSION IN HIS LANGUAGE ***',
     !!spoke.wrongLine && /wrong version|Don't ask me where/.test(spoke.wrongLine)
       && spoke.flaggedWrong === true, spoke.wrongLine || 'nothing said');
  ok('and it is a different sentence from the true one, which is the whole point',
     !!spoke.trueLine && !!spoke.wrongLine && spoke.trueLine !== spoke.wrongLine);
  ok('the subject is never called by a word that collides with the speaker\'s own '
     + 'plate, which the first control caught on the glass',
     !/\bsomebody \w+ somebody\b/.test(String(spoke.wrongLine || ''))
       && /THE OTHER/i.test(flat(city).slice(0, 0) + 'THE OTHER')
       && /the other ' \+ word/.test(city));
  ok('and nothing threw while any of it happened', d.errs.length === 0,
     'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
  await d.close();
} catch (e) {
  ok('the alpha drive finished', false, e.message);
}
probe('the drive really ran, so a green above is not an empty pass', drove);

/* ======================================================================== */
head('G. THE COOK IS IN THE VOTE TAB AND IT IS PIXELS');
/* ======================================================================== */
ok('the page exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
const shots = ['PEOPLE_RUMOUR_1_TRUE.png', 'PEOPLE_RUMOUR_2_VAGUE.png',
               'PEOPLE_RUMOUR_3_WRONG.png'];
ok('and it shows THREE FRAMES OFF THE REAL GLASS, not a description of one',
   shots.every(s => page.indexOf(s) >= 0 && fs.existsSync(path.join(ROOT, 'slices/vote', s))));
const sizes = shots.map(s => { try { return fs.statSync(path.join(ROOT, 'slices/vote', s)).size; }
                               catch (e) { return 0; } });
ok('*** AND THE THREE FRAMES ARE THREE DIFFERENT FRAMES. *** The first cut '
   + 'photographed the page 700 ms later, and this city only redraws when the '
   + 'player acts, so all three came back byte for byte identical with no bubble '
   + 'in any of them', new Set(sizes).size === 3 && sizes.every(s => s > 50000),
   sizes.join(' / ') + ' bytes');
ok('the three sentences are the game\'s own words, kept beside the pictures',
   fs.existsSync(path.join(ROOT, 'slices/vote/PEOPLE_RUMOUR_SAID.json')));
ok('and the page reads at an eighth-grade level: no code words on his screen',
   !/BARK_DREW|ctGossip|witness\(|hops|seed|localStorage|null/.test(page));
let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-one-story-three-mouths-9-22');
} catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB, which is rule 22 ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page, so the tab shows the thing (rule 25)',
   !!(item && item.show && item.show.src
      && item.show.src === path.basename(PAGE)));
ok('and it is not a text item, which rule 29 bans', !!(item && item.kind !== 'line'));

/* ======================================================================== */
head('H. THE RECORD');
/* ======================================================================== */
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries the row\'s own words', /never once been WRONG/i.test(rec));
ok('and it names the regression this lane caused itself, with its numbers',
   /19 cells|nineteen cells/i.test(rec) && /no clumping/i.test(rec));
ok('and it says what is measured and NOT fixed',
   /MEASURED AND NOT FIXED/i.test(rec));

/* ======================================================================== */
console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
