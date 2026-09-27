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
