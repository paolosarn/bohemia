/* ============================================================================
   BOHEMIA THE COMPANY IS A CAST (9/24/26, PEOPLE lane).
   VAMILY [bb company], row THE-COMPANY-IS-A-CAST. Rule 33 (THE OVERWORLD IS
   BATTLE BROTHERS), section 5, and rule 33g (where BB is a still, we move).

   *** THE FINDING OF THE ROUND IS NINE DAYS OLD AND IT IS NOT ABOUT COMPANIONS.
   *** THE STEP BECAME A HOUSE AND NOBODY RE-MEASURED WHO COULD KEEP UP.

   MEASURED ON THE ALPHA, MECHANISM NAMED AND CONTROLLED, BEFORE A LINE MOVED:
     one press of the pad moves the player    25 cells  (THE STEP IS A HOUSE, 9/15)
     the follow pass believed                  9 cells  (BohemiaStanding.SEE_RANGE)
     a drawn body standing on the glass       31 cells away, drawn EVERY press
     an enemy stubbed into following           0 of 8 presses in the follow map
     the SAME stub, reach widened, control      4 of 4 presses in the follow map
   The walked city's own comment says walking off your schedule to stay near
   somebody "takes an enemy to do it". An enemy cannot do it either. Two
   questions were sharing one number: how far you can SEE something happen (nine,
   correct) and how far somebody KEEPING UP may be (never asked).

   AND THE COMPANY'S OWN NUMBERS, MEASURED THE SAME PASS:
     people carrying a background             61 of 61, all 15 kinds, off their key
     backgrounds carrying a written line      15 of 15  (WORDS shipped them 9/23)
     backgrounds ever said out loud            0
     lines spoken past the first minute      224, and not one of them a background
     people who ever walk with you             0

   WHAT THIS GATE HOLDS:
   A. the reach a follower is judged by is measured in PRESSES, not in eyesight
   B. a follower covers a house, like he does (rule 16's own second half)
   C. nobody joins you until they told you who they were and you were still there
   D. on the alpha: somebody walks with you, backgrounds get a mouth, said once
   E. and the controls: the street is not muted, the first minute is his, one
      companion at a time, nothing in the demo
   F. the cook and the record

   node gates/the_company_is_a_cast_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const TOOL = path.join(ROOT, 'tools/bohemia_companion.js');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_THE_ONE_WHO_FELL_IN_9_24_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_THE_COMPANY_IS_A_CAST_9_24_26.txt');

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(k, v) { console.log('       ' + k + ': ' + v); }
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const city = fs.readFileSync(CITY, 'utf8');
const C = require(TOOL);

/* ======================================================================== */
head('A. KEEPING UP IS MEASURED IN PRESSES, NOT IN EYESIGHT');
/* ======================================================================== */
ok('the walked city has a name for how far one press carries him',
   /function ctOnePress\s*\(/.test(city));
ok('and it takes that from the game\'s own step, never a number of its own',
   /function ctOnePress[\s\S]{0,260}STEP_CELLS/.test(city));
ok('*** AND THE FOLLOW REACH IS THAT PRESS PLUS THE SIGHT THAT STARTED IT ***',
   /function ctKeepUpRange\s*\(\)\s*\{\s*return ctOnePress\(\)\s*\+\s*ctSeeRange\(\)/.test(city));
ok('and the follow pass asks THAT and no longer asks eyesight',
   /var live = \{\}, moved = 0, range = ctKeepUpRange\(\)/.test(city)
   && !/moved = 0, range = ctSeeRange\(\)/.test(city));
/* THE GATE MUST BE ABLE TO GO RED. A claim that cannot fail is worse than none. */
probe('this leg can fail: the old shape is refused',
   !/var live = \{\}, moved = 0, range = ctSeeRange\(\)/.test(city));
ok('and the reason is written where the next reader will hit it',
   /SMALLER THAN A SINGLE PRESS/.test(city)
   && /AN ENEMY CANNOT DO IT EITHER/.test(city));

/* ======================================================================== */
head('B. A FOLLOWER COVERS A HOUSE, WHICH IS RULE 16\'S OWN SECOND HALF');
/* ======================================================================== */
ok('the follow pass steps up to one press per press',
   /for \(var _c = 0, _cap = ctOnePress\(\); _c < _cap; _c\+\+\)/.test(city));
ok('and every cell still goes through the standable-and-not-taken test',
   /_nx = BohemiaAgainst\.follow\(now, \[hx, hy\], free\)/.test(city));
ok('and it stops the moment they hold, so they keep their distance',
   /if \(!_nx \|\| \(_nx\[0\] === now\[0\] && _nx\[1\] === now\[1\]\)\) break/.test(city));
ok('and it cites his own words rather than inventing a speed',
   /ALL CHARACTERS' MOVEMENTS AND ENEMIES' MOVEMENTS/.test(city));

/* ======================================================================== */
head('C. NOBODY JOINS YOU UNTIL THEY TOLD YOU, AND YOU WERE STILL THERE');
/* ======================================================================== */
ok('the rule exists and is pure', typeof C.joins === 'function');
ok('*** NOTHING JOINS A STRANGER ***',
   C.joins({ told: false, beatsSince: 9, cells: 1, onePress: 25 }).no ===
   'they have not told you anything yet');
ok('and not the instant you hear them',
   /only just heard/.test(C.joins({ told: true, beatsSince: 0, cells: 1, onePress: 25 }).no));
ok('and walking on IS the refusal, and it costs nothing',
   /walked away/.test(C.joins({ told: true, beatsSince: 5, cells: 60, onePress: 25 }).no));
ok('and one at a time, ever',
   /already walking with you/.test(
     C.joins({ told: true, beatsSince: 5, cells: 1, onePress: 25, already: true }).no));
ok('and when all four are true, they fall in',
   C.joins({ told: true, beatsSince: 5, cells: 3, onePress: 25 }).yes === true);
/* *** THE NUMBER THAT COST A MEASUREMENT: "still there" IS PRESSES, NOT CELLS. */
ok('*** STILL THERE IS MEASURED IN PRESSES, SO IT SURVIVES THE PLAYER MOVING ***',
   C.joins({ told: true, beatsSince: 5, cells: 20, onePress: 25 }).yes === true
   && !!C.joins({ told: true, beatsSince: 5, cells: 20, onePress: 6 }).no);
probe('this leg can fail: the old cell number would refuse a live join',
   C.JOIN.stay < 25 && C.JOIN.stayPresses === 1);
ok('and the size of a press comes from the world, never from the rule',
   /onePress: ctOnePress\(\)/.test(city));

/* ======================================================================== */
head('D. THE TWO MOUTHS, AND THEY GO THROUGH THE ONE GATE EVERY MOUTH GOES THROUGH');
/* ======================================================================== */
ok('somebody tells you what they used to be', /function ctWasBark\s*\(now\)/.test(city));
ok('and the one walking with you says what they kept',
   /function ctRoadBark\s*\(now\)/.test(city));
ok('*** BOTH ARE INSIDE barkTick, WHICH ASKS ctMaySpeak FIRST ***',
   /if \(ctRoadBark\(now\)\) return;/.test(city)
   && /if \(ctWasBark\(now\)\) return;/.test(city));
ok('and they sit BELOW the person who wants something and the one who knew your father',
   city.indexOf('if (ctAskBark(now)) return;') < city.indexOf('if (ctWasBark(now)) return;')
   && city.indexOf('if (ctStoodBark(now)) return;') < city.indexOf('if (ctWasBark(now)) return;'));
ok('and ABOVE the ambient street, which is untouched',
   city.indexOf('if (ctWasBark(now)) return;') < city.indexOf('BohemiaPeople.linesFor(pick.p'));
ok('a trade that died keeps nothing and says nothing on the road',
   /if \(!w \|\| !w\.keeps\) return false;\s*\/\* the trade died/.test(city));
ok('and somebody telling you their life tells you their name',
   /function ctWasBark[\s\S]{0,1400}ctAskName\(d\.p\)/.test(city));

/* ======================================================================== */
head('E. ON THE ALPHA, PLAYED THE WAY A PERSON PLAYS');
/* ======================================================================== */
let live = null;
try {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  live = await d.fr.evaluate(async () => {
    const out = { errs: [] };
    try { ctPeopleWipe(); render(); } catch (e) {}
    out.onePress = ctOnePress(); out.keepUp = ctKeepUpRange();
    const HOME = [hx, hy], HOMEMIN = (T.min | 0);   /* where AND WHEN he woke up */
    let lines = [], keeps = [];
    try { lines = (BohemiaPeople.WAS_WORDS || []).map(w => w.says).filter(Boolean); } catch (e) {}
    try { keeps = (BohemiaPeople.WAS_WORDS || []).map(w => w.keeps).filter(Boolean); } catch (e) {}
    out.writtenLines = lines.length;
    const t0 = (CT_PLAY_MS || performance.now());

    const run = (fromS, rounds, demo) => {
      const was = CT_IS_DEMO; if (demo) CT_IS_DEMO = true;
      let clockS = fromS, said = 0, intro = [], road = 0, withMe = 0, most = 0;
      const tick = () => {
        clockS += 1.0;
        BARK.p = null; BARK.until = 0; BARK.next = 0;
        try { render(); barkTick(t0 + clockS * 1000); } catch (e) { if (out.errs.length < 3) out.errs.push(String(e)); }
        if (BARK.p && BARK.text) {
          const t = String(BARK.text); said++;
          if (lines.indexOf(t) >= 0) intro.push(t);
          if (keeps.indexOf(t) >= 0) road++;
        }
        if (ctWalksWith() != null) { withMe++; most = 1; }
      };
      for (let r = 0; r < rounds; r++) {
        for (let b = 0; b < 6; b++) tick();
        for (let k = 0; k < 2; k++) { try { stepOnce((r * 3 + k) % DIRS.length); } catch (e) {} tick(); }
        if (r % 6 === 5) { try { ctPeopleWipe(); } catch (e) {} }
      }
      CT_IS_DEMO = was;
      return { said, intro, road, withMe, most };
    };

    const play = run(65, 30, false);
    out.linesSaidInTotal = play.said;
    out.saidWhatTheyUsedToBe = play.intro.length;
    out.differentTradesHeard = [...new Set(play.intro)].length;
    out.saidWhatTheyKept = play.road;
    out.beatsBesideSomebody = play.withMe;
    const c = {}; for (const t of play.intro) c[t] = (c[t] || 0) + 1;
    out.anybodySaidItTwice = Object.values(c).filter(n => n > 1).length;
    try { out.whoWalksWith = window.__WALKS_WITH || null; } catch (e) {}
    try { out.introduction = window.__WAS_SAID || null; } catch (e) {}

    /* ONE AT A TIME, EVER: the follow map may carry others, the company is one. */
    out.companionIsOneId = (ctWalksWith() == null) || (typeof ctWalksWith() !== 'object');

    /* *** THE CONTROL THAT MATTERS, AND IT IS A COMPARISON, NOT A THRESHOLD. ***
       The first cut of this leg asserted "more than 100 lines" and went red at
       54 on a build where nothing was muted: how far a walk wanders into empty
       country varies run to run, so an absolute number here measures the walk,
       not the change. A NUMBER I WOULD HAVE HAD TO KEEP LOWERING IS NOT A
       CONTROL. So the same walk is run twice on the same tree, once with this
       row's two mouths held shut, and the ambient street is compared with
       itself. */
    try { ctPeopleWipe(); render(); } catch (e) {}
    CT_WAS_SAID = {}; CT_WALKS_WITH = null; CT_ROAD_SAID = {};
    const realWas = ctWasBark, realRoad = ctRoadBark;
    ctWasBark = function () { return false; };
    ctRoadBark = function () { return false; };
    const without = run(65, 30, false);
    ctWasBark = realWas; ctRoadBark = realRoad;
    out.linesWithTheMouthsShut = without.said;
    out.mineInThePlay = play.intro.length + play.road;

    /* AND THE FIRST MINUTE IS HIS, which is the control [creditor waits] paid
       for. SEVEN ROUNDS, because a round is eight ticks of one second and the
       quiet floor is sixty: twelve rounds walked the clock to 96 s and read 13
       lines that were all legitimately past the minute. The gate was wrong, the
       game was not. */
    try { ctPeopleWipe(); render(); } catch (e) {}
    CT_WAS_SAID = {}; CT_WALKS_WITH = null; CT_ROAD_SAID = {};
    const early = run(0, 7, false);
    out.firstMinuteEndedAtS = 7 * 8;
    out.linesInHisFirstMinute = early.said;
    out.joinedInHisFirstMinute = early.most;

    /* AND NOTHING OF THIS IS IN THE DEMO */
    try { ctPeopleWipe(); render(); } catch (e) {}
    CT_WAS_SAID = {}; CT_WALKS_WITH = null; CT_ROAD_SAID = {};
    const demo = run(120, 12, true);
    out.linesInTheDemo = demo.said;
    /* *** PUT HIM BACK WHERE HE WOKE UP FIRST. *** Three cuts of this leg read
       "nobody is ever in earshot, 0 of 96" on a street whose real answer is 0.22.
       Every time it was the instrument: the runs above press the pad hundreds of
       times, and at 25 cells a press that leaves him in country where a wipe
       cannot seat anybody because there is no standable street to seat them on.
       Taking it FIRST broke the runs below instead, because the pass moves him.
       So he goes home, the block is re-seated, and the measurement is of his
       street rather than of a walk nobody would take. */
    /* *** AND THE HOUR, WHICH IS WHY PUTTING HIM BACK ON HIS OWN STREET WAS
       STILL NOT ENOUGH. *** Walking costs game minutes, so the runs above spend
       hundreds of presses and walk the clock deep into the night, and at night
       this street is correctly EMPTY -- the bark organ says so in its own words,
       "an empty street should sound empty". A crowd measurement taken at 3am is
       a measurement of bedtime. */
    try { hx = HOME[0]; hy = HOME[1]; T.min = HOMEMIN; ctPeopleWipe(); render(); } catch (e) {}
    /* AND HOW MANY PEOPLE ARE EVER CLOSE ENOUGH TO SAY ANY OF IT.
       *** PLAYED THE WAY A PERSON PLAYS, AND THE FIRST CUT OF THIS LEG WAS THE
       BROKEN INSTRUMENT FOR THE THIRD TIME THIS ROUND. *** It pressed the pad 60
       times in a row, which at 25 cells a press walks him clean out of the
       populated block, and then reported that nobody is ever in earshot -- 0 of
       0, which is not a measurement of the street, it is a measurement of a walk
       nobody would take. Stand and look, then take two steps, the same shape the
       record's numbers were taken with. */
    const seen = [];
    const lookAround = () => {
      let n = 0;
      for (const x of (BARK_DREW || [])) if (x && x.at &&
        Math.abs(x.at[0] - hx) + Math.abs(x.at[1] - hy) <= CT_VOICE.ambient) n++;
      seen.push(n);
    };
    for (let r2 = 0; r2 < 12; r2++) {
      for (let b = 0; b < 6; b++) { try { render(); } catch (e) {} lookAround(); }
      for (let k = 0; k < 2; k++) { try { stepOnce((r2 * 3 + k) % DIRS.length); render(); } catch (e) {} lookAround(); }
      if (r2 % 6 === 5) { try { ctPeopleWipe(); render(); } catch (e) {} }
    }
    out.earshotHour = Math.floor(((T.min | 0) % 1440) / 60);
    out.earshot = { mean: +(seen.reduce((a, b) => a + b, 0) / seen.length).toFixed(2),
                    max: Math.max.apply(null, seen),
                    zeroBeats: seen.filter(x => x === 0).length, beats: seen.length };

    /* *** THE VARIETY NUMBERS (Paolo 9/27). Taken on the real surface, because
       "how many lines exist" is a fact about a file and "how many the street can
       say" is a fact about the game, and they were 558 against 14. *** */
    try { ctPeopleWipe(); render(); } catch (e) {}
    const everyone = ctEveryone() || [];
    const union = new Set(); const sizes = [];
    for (const p of everyone) {
      let L = [];
      try { L = BohemiaPeople.linesFor(p, barkOpts(p)) || []; } catch (e) {}
      sizes.push(L.length); L.forEach(x => union.add(x));
    }
    out.pool = { everyPoolTogether: union.size,
                 min: Math.min.apply(null, sizes), max: Math.max.apply(null, sizes) };
    return out;
  });
  await d.close();
} catch (e) { live = { threw: String(e) }; }

if (live && !live.threw) {
  note('one press', live.onePress + ' cells, follow reach ' + live.keepUp);
  note('lines said in total', live.linesSaidInTotal);
  note('said what they used to be', live.saidWhatTheyUsedToBe
       + ' of ' + live.writtenLines + ' written lines, '
       + live.differentTradesHeard + ' different trades');
  note('said what they kept', live.saidWhatTheyKept);
  note('beats beside somebody', live.beatsBesideSomebody);
  if (live.whoWalksWith) note('who', JSON.stringify(live.whoWalksWith));
  if (live.introduction) note('introduced himself', live.introduction.head
       + ', ' + live.introduction.was);

  ok('a press is bigger than the old reach, which is the whole defect',
     live.onePress > 9, live.onePress + ' cells a press against a reach of 9');
  ok('*** SOMEBODY WALKS WITH YOU, AND NOBODY EVER HAS ***',
     live.beatsBesideSomebody > 0, live.beatsBesideSomebody + ' beats beside him');
  /* *** A BLANK PLATE IS THE ONLY WRONG ANSWER, AND ONE RAN BLANK. *** Measured:
     of three people who introduced themselves, TWO came back with their names
     and the third came back with nothing, because the never-empty field borrows
     bodies from other blocks and the id lookup only searches the block roster.
     This leg holds the fix: every speaker has SOMETHING over their head. */
  ok('and he is a person, with something over his head and a trade',
     !!(live.introduction && live.introduction.head && live.introduction.was),
     live.introduction ? live.introduction.head + ' / ' + live.introduction.was : 'nobody');
  ok('*** A BACKGROUND IS SAID OUT LOUD, AND NONE EVER HAS BEEN ***',
     live.saidWhatTheyUsedToBe > 0, live.saidWhatTheyUsedToBe + ' said');
  ok('and the one walking with you says what he kept',
     live.saidWhatTheyKept > 0, live.saidWhatTheyKept + ' said');
  ok('and nobody introduces himself twice',
     live.anybodySaidItTwice === 0, live.anybodySaidItTwice + ' repeats');
  /* *** THE CONTROL THAT MATTERS. Muting the street would pass every claim
     above except this one, and would hand him a dead town. A COMPARISON, not a
     threshold: the same walk on the same tree with these two mouths shut. *** */
  note('lines with the new mouths shut', live.linesWithTheMouthsShut);
  ok('*** THE CONTROL: THE STREET TALKS AS MUCH AS IT DID WITHOUT THIS ROW ***',
     live.linesWithTheMouthsShut > 0
     && live.linesSaidInTotal >= live.linesWithTheMouthsShut * 0.8,
     live.linesSaidInTotal + ' with, ' + live.linesWithTheMouthsShut + ' without');
  ok('and this row is a few lines on top, never the street\'s whole voice',
     live.mineInThePlay > 0 && live.mineInThePlay < live.linesSaidInTotal / 3,
     live.mineInThePlay + ' of ' + live.linesSaidInTotal);
  ok('the first minute is still his (rule 32a)',
     live.linesInHisFirstMinute === 0,
     live.linesInHisFirstMinute + ' lines to ' + live.firstMinuteEndedAtS + ' s');
  ok('and nobody falls in beside him in it either',
     live.joinedInHisFirstMinute === 0);
  ok('and none of it fires in the demo',
     live.linesInTheDemo === 0, live.linesInTheDemo + ' lines');
  ok('and the company is one id, never a roster', live.companionIsOneId === true);
  ok('nothing threw on the real surface', live.errs.length === 0,
     live.errs.join(' | ') || 'clean');
} else {
  ok('the alpha could be driven', false, live ? live.threw : 'no result');
}

/* ======================================================================== */
head("G. BATTLE BROTHERS' AMOUNT, OUR VARIETY (Paolo 9/27)");
/* ======================================================================== */
/* *** HIS RULING: "maybe that's the AMOUNT we should be interacting with people
   in our game... however everything we've done, all the research we've done,
   gives us way more chat bubble options." ***
   MEASURED THE SAME ROUND: 558 ambient lines written into 152 buckets, and the
   WHOLE STREET could only ever say 14 of them. These legs hold the four reasons
   why, each of which was a field or a rule and not a missing word. */
const PPL = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people.js'), 'utf8');
ok('the law he ruled exists and carries his own words',
   fs.existsSync(path.join(ROOT, 'laws/BOHEMIA_LAW_BATTLE_BROTHERS_AMOUNT_OUR_VARIETY_9_27_26.md')));
ok('*** THE AMBIENT BUCKETS ADD UP INSTEAD OF SHADOWING EACH OTHER ***',
   /add\(at && trade && bucket\(trade \+ ':' \+ at\)\)/.test(PPL)
   && /add\(bucket\('faction:' \+ fac\)\)|add\(fac && bucket\('faction:' \+ fac\)\)/.test(PPL));
ok('and a line can never be in a pool twice',
   /if \(typeof s !== 'string' \|\| seen\[s\]\) continue;/.test(PPL));
/* *** THE FIELD IS CALLED archetype AND THIS MODULE SAID SO IN A COMMENT SINCE
   9/5 WHILE STILL READING role. A NOTE IS NOT A GATE. *** */
ok('*** IT READS THE FIELD THE WORLD ACTUALLY WRITES, NOT THE ONE A COMMENT WISHED FOR ***',
   /var trade = person\.role \|\| person\.archetype \|\| null;/.test(PPL));
probe('this leg can fail: the old bare person.role reads are gone',
   !/\|\| \(at && bucket\(person\.role \+ ':' \+ at\)\)/.test(PPL));
ok('and the city hands over the faction it already derives, not an empty field',
   /o\.faction = ctFactionOf\(p\) \|\| p\.faction \|\| null;/.test(city));
/* *** A STATE COLOURS A VOICE, AN EVENT REPLACES IT. This is the regression the
   LAST round shipped: met:asked holds two lines and owned every person he had
   ever learned the name of, for ever. *** */
ok('*** AN EVENT STILL WINS OUTRIGHT: what they saw, what they heard ***',
   /var pick = \(saw && react\('saw:' \+ saw\)\)\s*\|\| \(heard && react\('heard:' \+ heard\)\)/.test(PPL));
ok('*** AND A STATE ONLY COLOURS IT: where you stand, whether you have met ***',
   /add\(rung && react\('rung:' \+ rung\)\);\s*add\(met && react\('met:' \+ met\)\);/.test(PPL));
probe('this leg can fail: the states are no longer in the outright chain',
   !/\|\| \(rung && react\('rung:' \+ rung\)\)/.test(PPL));
ok('the picker keys on the person, not on the LENGTH of their name',
   !/\^ String\(k\)\.length\)/.test(city) && /\^ kh\) >>> 0\) % lines\.length/.test(city));
ok('the street takes turns: somebody who spoke stands down while anybody else is there',
   /var spoken = !!BARK_SEEN\[p\.key \|\| p\.id\];/.test(city));
ok('and how often the street may speak is ONE named dial, his to set',
   /var CT_HOW_OFTEN = \{/.test(city) && /BARK\.next = now \+ CT_HOW_OFTEN\.gapMs;/.test(city));

if (live && !live.threw && live.pool) {
  note('the street\'s reachable pool', live.pool.everyPoolTogether
       + ' lines, was 14 before this round');
  note('one person\'s own pool', live.pool.min + ' to ' + live.pool.max + ', was 5 for everybody');
  ok('*** THE WHOLE STREET CAN SAY MORE THAN THE 14 IT COULD SAY BEFORE ***',
     live.pool.everyPoolTogether > 14,
     live.pool.everyPoolTogether + ' lines reachable on his own block');
  ok('and not every person has the identical pool any more',
     live.pool.max > live.pool.min, live.pool.min + '..' + live.pool.max);
  /* *** AND THE NUMBER THAT SAYS WHY VARIETY IS A CROWD PROBLEM. Not a claim
     about this row: a measurement kept on the board so the next lane sees it. */
  note('*** people within earshot', 'mean ' + live.earshot.mean + ', most ever '
       + live.earshot.max + ', ' + live.earshot.zeroBeats + ' of '
       + live.earshot.beats + ' beats with nobody at all ***');
  /* *** THIS IS NOT A CLAIM AND IT IS DELIBERATELY NOT ASSERTED. FOUR VERSIONS
     OF IT WERE BUILT AND ALL FOUR READ ZERO ON A STREET WHOSE REAL ANSWER IS
     0.22, SO I STOPPED. (STOP PRODUCING, 7/26: "a fourth version means you
     already failed, so stop and say so.") ***
     What was tried, in order: measure at the end (he has walked out of the
     populated block); measure first (the pass moves him and every run below
     starts somewhere else); put him back on his own street; put the CLOCK back
     too, because walking spends game minutes and the runs above carry it into
     the night when this street is correctly empty. All four still read zero, so
     something else about a surface that has already been driven for minutes is
     the cause and I have not found it.
     THE REAL NUMBER EXISTS AND COMES FROM AN INSTRUMENT THAT CAN PRODUCE A
     POSITIVE: a fresh page, stand and look, then two steps -- mean 0.22 people
     in earshot, most ever ONE, 188 of 240 beats with nobody at all. It is in the
     record with how it was taken. A number printed here that disagrees with it
     is this gate's instrument, not the game, and it is printed anyway rather
     than deleted so the next reader sees the disagreement instead of a silence. */
  note('and that reading is NOT asserted here', 'four versions read zero at hour '
       + live.earshotHour + '; the fresh-page instrument reads 0.22 mean, 1 max');
}

/* ======================================================================== */
head('F. THE COOK AND THE RECORD');
/* ======================================================================== */
ok('the cook exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('*** AND BOTH FRAMES ARE THE WALKED STREET FROM THE GAME\'S CAMERA (rule 32f) ***',
   /from the game's own camera/i.test(flat(page)));
ok('and it leads with the control rather than the claim',
   /talks exactly as much|not muted|dead town/i.test(flat(page)));
ok('and it reads at an eighth-grade level: no code words on his screen',
   !/barkTick|ctOnePress|STEP_CELLS|SEE_RANGE|BohemiaCompanion|null/.test(page));
let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-the-one-who-fell-in-9-24');
} catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB (rule 22) ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item (rule 29)', !!(item && item.kind !== 'line'));

ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries the before measurement with the control beside it',
   /0 of 8 presses/.test(rec) && /4 of 4/.test(rec));
ok('and the school, which is what rule 33f asked for',
   /BATTLE BROTHERS/i.test(rec) && /SCHOOL/i.test(rec));
ok('and what MOVES that Battle Brothers\' picture does not (rule 33g)',
   /WHAT MOVES/i.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

/* ======================================================================== */
console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
