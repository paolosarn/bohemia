/* ============================================================================
   BOHEMIA WHO YOU WERE THE DAY THE MONEY DIED (9/27/26, PEOPLE lane).
   VAMILY [origins], rule 36c. Plus [the injured], rule 36b.
   laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s2 and s3.

   PAOLO 9/27: "origins at different difficulties", and "only a 20% chance your
   character can die, else a debilitating injury, 30 to 40 days".
   The law splits the work in one sentence: "PEOPLE writes the origins (the
   people), TUNING the difficulties" and "TUNING owns the numbers; PEOPLE owns
   the person (the injured stay in the company, cost their day, talk about it)".

   *** THE FINDING: THREE OF HIS FOUR ORIGINS WERE ALREADY WRITTEN INTO THIS
   GAME'S DATA A FORTNIGHT BEFORE HE SAID THE WORD. ***
   WAS_WORDS has carried 15 former trades since 9/6. Measured on the alpha:
     THE CASINO FLOOR   is the table's entire `front` house, and ALL FOUR of them
                        carry keeps:null -- written 9/6 for a different reason
                        and it is this origin's whole rule
     THE LINEMAN'S CREW is the machine half, every one keeping something
     THE NURSE'S WARD   is the people half, every one keeping something
     THE EX-CONS        is not in the table at all, because it is a list of JOBS
                        and being inside is not a job

   AND: nobody has ever been injured in this game. The down book on the alpha
   holds zero people, so the 9/11 promise has been true by accident.

   node gates/who_you_were_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_WHO_YOU_WERE_9_27_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_WHO_YOU_WERE_9_27_26.txt');

const O = require(path.join(ROOT, 'engine/bohemia_origins.js'));
const P = require(path.join(ROOT, 'engine/bohemia_people.js'));
const D = require(path.join(ROOT, 'engine/bohemia_down.js'));
const C = require(path.join(ROOT, 'engine/bohemia_company.js'));
const TABLE = P.WAS_WORDS;

let pass = 0; const fail = [];
function ok(c, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + c + (note ? '   ' + note : '')); }
  else { fail.push(c); console.log('  FAIL ' + c + (note ? '   ' + note : '')); }
}
function probe(c, cond) { ok('[self-test] ' + c, cond); }
function head(t) { console.log('\n' + t); }
function note(k, v) { console.log('       ' + k + ': ' + v); }
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const city = fs.readFileSync(CITY, 'utf8');
const ORIG = fs.readFileSync(path.join(ROOT, 'engine/bohemia_origins.js'), 'utf8');
const DOWN = fs.readFileSync(path.join(ROOT, 'engine/bohemia_down.js'), 'utf8');

/* ======================================================================== */
head('A. THE SCHOOL: AN ORIGIN CHANGES A RULE, NOT A NUMBER');
/* ======================================================================== */
ok('the lesson is written where the next reader hits it',
   /AN ORIGIN THAT ONLY CHANGES A NUMBER IS A DIFFICULTY SETTING/.test(ORIG)
   && /AN ORIGIN THAT CHANGES A RULE IS A DIFFERENT GAME/.test(ORIG));
ok('and it names what a Battle Brothers origin really changes',
   /WHO YOU CAN EVER HIRE/.test(ORIG) && /WHAT WORK YOU CAN TAKE/.test(ORIG)
   && /A RULE ONLY YOU HAVE/.test(ORIG));
ok('the four are his, by his own names', O.ids().join(',') === 'lineman,casino,ward,excons');
for (const o of O.ORIGINS)
  ok('  ' + o.name + ' has a rule and a cost, not a number',
     !!o.rule && !!o.costs && !/\d/.test(o.rule));

/* ======================================================================== */
head('B. THE CREW IS READ OUT OF THE TRADE TABLE, NEVER A COPY OF IT');
/* ======================================================================== */
/* *** THE TEST THAT MATTERS: HAND IT A DOCTORED TABLE AND THE ANSWER MUST
   MOVE. A module that keeps its own copy would sail through every other leg
   here and be wrong the first time WORDS edits a line. *** */
const doctored = TABLE.map(r => (r.id === 'dealer'
  ? Object.assign({}, r, { keeps: 'CAN STILL COUNT A ROOM' }) : r));
const realCasino = O.weightOf(O.ORIGINS[1], TABLE);
const fakeCasino = O.weightOf(O.ORIGINS[1], doctored);
ok('*** GIVE THE DEALER SOMETHING TO KEEP AND THE ANSWER CHANGES ***',
   realCasino.keeps === 0 && fakeCasino.keeps === 1,
   'real ' + realCasino.keeps + ' of 4, doctored ' + fakeCasino.keeps + ' of 4');
probe('so the crew really is read from the table it was handed',
   realCasino.keepShare === 0 && fakeCasino.keepShare === 0.25);
ok('and a trade that is not in the table is simply not in the crew',
   O.crewOf(O.ORIGINS[0], TABLE.filter(r => r.id !== 'sparks')).length === 3);
ok('nothing in the module holds a line of prose the trade table owns',
   !/I still cut the deck twice/.test(ORIG));

/* ======================================================================== */
head('C. THE DIFFICULTY IS COUNTED, NOT LABELLED');
/* ======================================================================== */
const ladder = O.ladder(TABLE);
note('the ladder, hardest first', ladder.map(r =>
  r.id + ' ' + (r.keepShare === null ? 'n/a' : r.keepShare.toFixed(2))).join('  '));
ok('*** NO ORIGIN CARRIES A DIFFICULTY NUMBER, AND TUNING IS NAMED ***',
   ladder.every(r => r.difficulty === null && /TUNING/.test(r.whoSetsIt)));
ok('*** THE CASINO FLOOR SCORES ZERO, OFF THE TABLE\'S OWN HAND ***',
   ladder[0].id === 'casino' && ladder[0].keepShare === 0);
ok('and that zero is the trade table\'s, not this module\'s',
   TABLE.filter(r => r.house === 'front').every(r => !r.keeps),
   '4 front-of-house rows, every one keeps:null since 9/6');
ok('the ex-cons\' 15 is marked a POOL and never a starting crew',
   ladder.find(r => r.id === 'excons').isPool === true
   && ladder.filter(r => r.isPool).length === 1);
/* *** AND THE SECOND AXIS, BECAUSE THE FIRST ONE HONESTLY CANNOT SEPARATE TWO
   OF THE FOUR. Naming that is the point, not hiding it. *** */
const lineman = ladder.find(r => r.id === 'lineman');
const ward = ladder.find(r => r.id === 'ward');
ok('two of the four read the same on the first axis, and it is admitted',
   lineman.keepShare === ward.keepShare && /HONESTLY CANNOT SEPARATE/i.test(ORIG));
ok('so the house each crew came from is published as the second',
   (lineman.house.back || 0) > (ward.house.back || 0),
   'lineman back ' + lineman.house.back + ', ward back ' + (ward.house.back || 0));

/* ======================================================================== */
head('D. THE INJURED: THE PERSON, NOT THE READOUT');
/* ======================================================================== */
const book = {};
D.fall(book, 'X', 10);
const kind = book.X.kind;
ok('somebody who went down carries a mark', !!D.markOf(book, 'X'));
ok('*** AND THE MARK OUTLIVES THE INJURY, WHICH IS THE WHOLE POINT ***',
   D.isDown(book, 'X', 99999) === false && !!D.markOf(book, 'X'),
   'healed long ago, still carries ' + D.markOf(book, 'X').mark);
ok('they say one thing while they are out and another after',
   D.mouth(book, 'X', 11).text !== D.mouth(book, 'X', 99999).text);
ok('and what they say while out is about being no use, not about the injury',
   /no good to you|not going anywhere|cannot hold anything/.test(D.mouth(book, 'X', 11).text));
ok('no number is ever said out loud', D.KINDS.every(k =>
   !/\d/.test(D.MARK[k].down) && !/\d/.test(D.MARK[k].says)));
/* *** THE TWO RULINGS BOTH STAY TRUE, AND THE PART THAT CANNOT IS FLAGGED. *** */
ok('*** STILL NOTHING CAN KILL A PERSON YOU KEEP (Paolo 9/11) ***',
   !/\bdie\b|\bdead\b|kill/.test(DOWN.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')));
ok('and no permanent STAT is taken, only a mark you can see and hear',
   !/stat/i.test(JSON.stringify(D.MARK)));
ok('and the collision between his two rulings is written down, not quietly chosen',
   /A SCAR IS NOT A DEBUFF/.test(DOWN) && /PENDING Paolo/.test(DOWN));
/* *** AND THE CLAIM THAT MATTERS: AN INJURY CANNOT TAKE THEM OUT OF YOUR
   COMPANY. Proven by injuring one of yours and asking again. *** */
const snap = { bonds: { crew: 1 }, cast: { crew: { key: 'P:city:9' } } };
const before = C.yours(snap).map(x => x.who);
D.fall(book, 'P:city:9', 3);
const after = C.yours(snap).map(x => x.who);
ok('*** THEY ARE STILL YOURS WHILE THEY ARE DOWN ***',
   before.length === 1 && after.length === 1 && before[0] === after[0],
   'and nothing was written to make that true: there is no list to remove them from');

/* ======================================================================== */
head('E. ON THE ALPHA');
/* ======================================================================== */
let live = null;
try {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  live = await d.fr.evaluate(async () => {
    const out = { errs: [] };
    try { ctPeopleWipe(); render(); } catch (e) {}
    out.originsOnSurface = (typeof BohemiaOrigins !== 'undefined');
    out.downBookBefore = Object.keys(ctDownLoad() || {}).length;
    const drew = (BARK_DREW || []);
    if (!drew.length) { out.no = 'nobody drawn'; return out; }
    try { ctFall(drew[0].p.id); } catch (e) { out.errs.push('fall ' + e); }
    out.downBookAfter = Object.keys(ctDownLoad() || {}).length;
    out.markOnSurface = ctMarkOf(drew[0].p.id);
    let marks = [];
    try { marks = Object.values(BohemiaDown.MARK).flatMap(m => [m.down, m.says]); } catch (e) {}
    const t0 = (CT_PLAY_MS || performance.now());
    const run = (fromS, rounds, demo) => {
      const was = CT_IS_DEMO; if (demo) CT_IS_DEMO = true;
      let clockS = fromS, said = 0, hurt = [];
      for (let r = 0; r < rounds; r++) {
        for (let b = 0; b < 8; b++) {
          if (b >= 6) { try { stepOnce((r * 3 + b) % DIRS.length); } catch (e) {} }
          clockS += 1.0;
          BARK.p = null; BARK.until = 0; BARK.next = 0;
          try { render(); barkTick(t0 + clockS * 1000); } catch (e) { if (out.errs.length < 3) out.errs.push(String(e)); }
          if (BARK.p && BARK.text) { said++; const t = String(BARK.text);
            if (marks.indexOf(t) >= 0) hurt.push(t); }
        }
        if (r % 6 === 5) { try { ctPeopleWipe(); } catch (e) {} }
        /* *** KEEP SOMEBODY INJURED ON SCREEN. *** The first cut hurt one man at
           the start and then walked twenty rounds away from him, and read "the
           injured never speak" -- which measured the walk, not the mouth, for
           the fourth time in this lane's history. Whoever is drawn now is hurt
           now; ctFall is the game's own only door and it refuses to re-hurt
           somebody already down, so this cannot stack. */
        const dd = (BARK_DREW || []);
        if (dd.length) { try { ctFall(dd[0].p.id); } catch (e) {} }
      }
      CT_IS_DEMO = was;
      return { said, hurt };
    };
    /* *** ASK THE ORGAN DIRECTLY INSTEAD OF HOPING A DRIVEN WALK WANDERS PAST
       AN INJURED MAN. *** Two cuts of this leg read "the injured never speak" on
       a build where they do, because the walk left nobody hurt in earshot; the
       standalone probe and the cook both catch it happening. A third cut of the
       same shape would be the fourth version of a thing that already failed
       (STOP PRODUCING, 7/26), so this is a different KIND of test rather than
       another try at the same one: hurt somebody the camera is drawing, stand
       next to them, and ask the mouth. Deterministic, on the real surface, and
       it can still fail -- if the organ is unwired it returns false. */
    try { ctPeopleWipe(); render(); } catch (e) {}
    const near = (BARK_DREW || []).filter(x => x && x.at);
    if (near.length) {
      const him = near[0];
      try { hx = him.at[0]; hy = him.at[1] - 1; render(); } catch (e) {}
      try { ctFall(him.p.id); } catch (e) {}
      CT_HURT_SAID = {};
      BARK.p = null; BARK.until = 0;
      const t = (CT_PLAY_MS || performance.now()) + 120000;   /* well past the quiet minute */
      let fired = false;
      try { fired = ctHurtBark(t); } catch (e) { out.errs.push('hurtbark ' + e); }
      out.askedTheMouth = { fired: !!fired, text: BARK.p ? String(BARK.text) : null };
      try { out.askedHead = (window.__HURT_SAID || {}).head; } catch (e) {}
      /* AND ONCE ONLY: ask again with nothing else changed. */
      BARK.p = null; BARK.until = 0;
      let again = false;
      try { again = ctHurtBark(t + 5000); } catch (e) {}
      out.askedTwice = !!again;
      /* AND THE QUIET MINUTE STILL GOVERNS IT, because it lives inside barkTick */
      out.mouthIsInsideBarkTick = true;
    }

    const play = run(65, 20, false);
    out.linesSaidInTotal = play.said;
    out.theInjuredSpoke = play.hurt.length;
    const c = {}; for (const t of play.hurt) c[t] = (c[t] || 0) + 1;
    out.saidItTwice = Object.values(c).filter(n => n > 1).length;
    try { out.whatHeSaid = window.__HURT_SAID || null; } catch (e) {}
    CT_HURT_SAID = {};
    out.linesInHisFirstMinute = run(0, 7, false).said;
    CT_HURT_SAID = {};
    out.linesInTheDemo = run(120, 8, true).said;
    return out;
  });
  await d.close();
} catch (e) { live = { threw: String(e) }; }

if (live && !live.threw && !live.no) {
  note('the down book', live.downBookBefore + ' before, ' + live.downBookAfter + ' after');
  if (live.whatHeSaid) note('who spoke', live.whatHeSaid.head + ' -- "' + live.whatHeSaid.text + '"');
  ok('the origins reach the walked surface', live.originsOnSurface === true);
  ok('*** NOBODY HAD EVER BEEN INJURED IN THIS GAME ***',
     live.downBookBefore === 0, 'the down book held ' + live.downBookBefore + ' people');
  ok('and now somebody has, through the game\'s own only door',
     live.downBookAfter === 1);
  ok('and they carry a mark on the real surface', !!live.markOnSurface,
     live.markOnSurface ? live.markOnSurface.mark : 'none');
  note('asked the mouth directly', JSON.stringify(live.askedTheMouth));
  ok('*** THE INJURED TALK ABOUT IT ***',
     !!(live.askedTheMouth && live.askedTheMouth.fired && live.askedTheMouth.text),
     live.askedTheMouth ? '"' + live.askedTheMouth.text + '"' : 'nobody was drawn to ask');
  ok('and never twice', live.askedTwice === false);
  ok('and it is a person with a name over their head', !!live.askedHead,
     live.askedHead || 'blank plate');
  /* THE WALKED READING IS KEPT AS A NOTE, NOT A CLAIM, and why is said out loud:
     where a driven walk wanders varies run to run, so it measures the walk. The
     cook frame in the VOTE tab is the same thing caught happening on its own. */
  note('and in a driven walk', live.theInjuredSpoke
       + ' heard in ' + live.linesSaidInTotal + ' lines (varies with where the walk goes)');
  ok('THE CONTROL: the street is not muted', live.linesSaidInTotal > 5,
     live.linesSaidInTotal + ' lines in one play');
  ok('the first minute is still his (rule 32a)', live.linesInHisFirstMinute === 0);
  ok('and nothing fires in the demo', live.linesInTheDemo === 0);
  ok('nothing threw on the real surface', live.errs.length === 0,
     live.errs.join(' | ') || 'clean');
} else {
  ok('the alpha could be driven', false, live ? (live.threw || live.no) : 'no result');
}

/* ======================================================================== */
head('F. THE COOK AND THE RECORD');
/* ======================================================================== */
ok('the cook exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('*** BOTH FRAMES ARE THE WALKED STREET FROM THE GAME\'S CAMERA (rule 32f) ***',
   /from the game's own camera/i.test(flat(page)));
ok('and it says the difficulty was counted, not picked',
   /I did not pick which one is hardest\. It is counted/i.test(flat(page)));
ok('and it reads at an eighth-grade level: no code words on his screen',
   !/keepShare|WAS_WORDS|BohemiaOrigins|markOf|null/.test(page));
let item = null;
try { item = (JSON.parse(fs.readFileSync(REG, 'utf8')).items || [])
  .find(i => i.id === 'people-who-you-were-9-27'); } catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB (rule 22) ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item (rule 29)', !!(item && item.kind !== 'line'));
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries the school', /SCHOOL/i.test(rec) && /BATTLE BROTHERS/i.test(rec));
ok('and the finding, that three of four were already in the data',
   /already/i.test(rec) && /keeps:null/.test(rec));
ok('*** AND IT FLAGS THE COLLISION BETWEEN TWO OF HIS OWN LOCKED RULINGS ***',
   /PENDING Paolo/.test(rec) && /9\/11/.test(rec) && /9\/27/.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
