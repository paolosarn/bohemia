/* ============================================================================
   BOHEMIA CREDITOR STANDS (9/23/26, PEOPLE lane).
   VAMILY [creditor stands], row YOU-DO-NOT-INHERIT-A-BILL-YOU-INHERIT-THE-PERSON.

   THE ROW: "in the real world a child is NOT liable for a parent's debts, and the
   only reason is that a court stops it. Bohemia has no courts... But the form was
   wrong: an heir does not inherit a NUMBER, they inherit THE PEOPLE HE OWED,
   still standing there, still remembering. Build the creditor who is still there
   after the fold, not a balance on a card."

   *** MEASURED ON THE ALPHA THROUGH THE GAME'S OWN DOORS BEFORE A LINE WAS
   *** CHANGED: take a loan, miss a night, let the night publish the deed.

       people who witnessed it                       1  (the neighbour at his door)
       people who still knew, one generation later   0
       the fold's own words   "1 of the things you did died with the last person
                               who saw them"

   THE LAST PERSON WHO SAW IT IS NOT DEAD. He is drawn every frame, he has a name
   and a face, and he speaks. inherit() drops an untold deed because "the
   eyewitness is dead", and the gate that pins that says the premise out loud:
   "Thirty years pass and everybody who watched you is dead."

   *** AND THE REPO ITSELF HAD ALREADY REFUSED THAT CALL. *** bohemia_family.js,
   on its parked bury() writer: "WHEN a person dies of age is a magnitude, so it
   waits on Paolo." Nothing in this game ages anybody out. So the organ decided
   the one thing the game explicitly refused to decide, for everybody, as a
   default, and then the surface kept drawing them.

   WHAT THIS HOLDS:
   A. the organ ASKS instead of assuming, and with nothing passed it answers
      exactly what it always did, which is why the two gates that pin the old
      rule stay green
   B. a living witness keeps the memory and it WEIGHS NOTHING, so the dynasty
      rule -- a quiet deed never becomes what your child is judged for -- is
      untouched
   C. the city answers with the world's own census, and says out loud that it
      answers "still here" and not "still alive"
   D. on the alpha: the man still remembers after the fold
   E. he SAYS it, once, with a name and a face, and he is silent when there is
      nothing to say and silent before the fold
   F. the words come out of the mouth unpainted, which cost a draw-order fix
   G. the cook is in the VOTE tab and it is pixels

   node gates/creditor_stands_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const MOD = path.join(ROOT, 'engine/bohemia_standing.js');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_THE_ONE_WHO_STOOD_THERE_9_23_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_CREDITOR_STANDS_9_23_26.txt');
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
   This lane has paid for that four rounds running. */
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const mod = fs.readFileSync(MOD, 'utf8');
const city = fs.readFileSync(CITY, 'utf8');
const S = require(MOD);
const M = require(path.join(ROOT, 'engine/bohemia_memory.js'));
function mind(id) { const m = M.makeMind(id); m.deeds = m.deeds || []; return m; }
const at = () => ({ x: 0, y: 0 });

/* ======================================================================== */
head('A. THE ORGAN ASKS INSTEAD OF ASSUMING, AND THE OLD ANSWER IS UNMOVED');
/* ======================================================================== */
{
  const a = mind('A');
  S.witness([a], 100, 'F', 'loan:short', 0, 0, at, {});
  const r = S.inherit([a], 'F', 'C', 200);
  ok('*** WITH NOTHING PASSED IT IS BYTE FOR BYTE WHAT IT ALWAYS WAS. *** A '
     + 'caller who cannot say who is alive has not earned a different answer, '
     + 'which is why the two gates that pin the old rule stay green',
     r.carried === 0 && r.died === 1 && a.deeds.length === 0, JSON.stringify(r));
}
{
  const b = mind('B');
  S.witness([b], 100, 'F', 'loan:short', 0, 0, at, {});
  const r = S.inherit([b], 'F', 'C', 200, () => true);
  ok('*** AND A MAN WHO IS STANDING RIGHT THERE DOES NOT FORGET ***',
     r.stood === 1 && r.died === 0 && b.deeds.length === 1, JSON.stringify(r));
  ok('what he keeps is about the FATHER, not a charge against the child',
     b.deeds[0].actor === 'F' && b.deeds[0].of === 'F' && !!b.deeds[0].ended);
  /* *** AND THE WEIGHT GOES IN BEFORE THE FOLD, WHICH MY OWN SELF-TEST CAUGHT.
     *** The first cut of this claim read the father's worth AFTER inherit() had
     already stamped the deed `ended`, so forceOf correctly returned 0 and the
     claim went red saying the father was worth nothing. It was measuring the
     thing it was trying to prove had been switched off. */
  S.DEED_WEIGHT['loan:short'] = -4;
  const fresh = mind('B2');
  S.witness([fresh], 100, 'F', 'loan:short', 0, 0, at, {});
  const father = Math.abs(S.opinionOf(fresh, 'F', 100));
  S.inherit([fresh], 'F', 'C', 200, () => true);
  const child = S.opinionOf(fresh, 'C', 200);
  const carried = S.opinionOf(fresh, 'F', 200);
  note('what the father was worth to him', '-' + father.toFixed(2));
  ok('*** AND THE CHILD IS JUDGED FOR NONE OF IT. *** The dynasty rule -- a quiet '
     + 'deed never becomes the thing your child is judged for -- is untouched, '
     + 'and so is every number that was on the board before this existed',
     father > 0 && child === 0 && carried === 0,
     'father ' + (-father).toFixed(2) + ', child ' + child + ', still charged ' + carried);
  probe('the weight really was in the table, so that zero is a refusal and not '
    + 'an empty haystack', father > 0);
  delete S.DEED_WEIGHT['loan:short'];
}
ok('and the row\'s own question is askable in one call, returning PEOPLE and '
   + 'never a balance',
   typeof S.whoRemembers === 'function'
     && (function () {
       const c = mind('C');
       S.witness([c], 100, 'F', 'loan:short', 0, 0, at, {});
       S.inherit([c], 'F', 'K', 200, () => true);
       const w = S.whoRemembers([c], 'F', 'loan:short');
       return w.length === 1 && w[0].who === 'C' && w[0].saw === true
         && w[0].kind === 'loan:short' && !('owed' in w[0]) && !('amount' in w[0]);
     })());
ok('the weights table is STILL empty by default, so nothing here invented a '
   + 'judgement', Object.keys(S.DEED_WEIGHT).length === 0);
ok('*** AND THE MEASUREMENT AND THE REPO\'S OWN REFUSAL ARE BOTH WRITTEN INTO '
   + 'THE FILE, so nobody has to rediscover either ***',
   /WHEN a person dies of age is a magnitude, so it waits on Paolo/.test(flat(mod))
     && /died with the last person who saw them/.test(flat(mod)));
ok('and the real-world check is there too, not just the repo one',
   /very likely alive at the end of it/.test(flat(mod)));

/* ======================================================================== */
head('B. THE CITY ANSWERS, AND SAYS WHAT ITS ANSWER IS WORTH');
/* ======================================================================== */
const foldFn = city.slice(city.indexOf('function ctFold()'),
                          city.indexOf('function ctFold()') + 900);
ok('the fold hands the organ a real answer instead of letting it assume',
   /BohemiaStanding\.inherit\(minds, '@', '@', ctMinuteNow\(\), ctStillHere\(\)\)/.test(foldFn));
ok('and the answer comes from the world\'s own census, not a second idea of it',
   /function ctStillHere\(\)/.test(city) && /ctWhereEveryoneIs\(\)/.test(
     city.slice(city.indexOf('function ctStillHere()'),
                city.indexOf('function ctStillHere()') + 600)));
ok('*** AND IT SAYS OUT LOUD THAT IT ANSWERS "STILL HERE" AND NOT "STILL ALIVE", '
   + 'rather than dressing one up as the other ***',
   /IT ANSWERS "STILL HERE", NOT "STILL ALIVE"/.test(flat(city)));
ok('and it is conservative where it cannot see, so anybody off the block keeps '
   + 'the old behaviour exactly',
   /anybody further out reads as gone and keeps the old behaviour exactly/.test(flat(city)));

/* ======================================================================== */
head('C. ON THE ALPHA: THE MAN IS STILL THERE AND HE SAYS SO');
/* ======================================================================== */
let drove = false, r = null;
try {
  const { open } = require(DRIVE);
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  drove = true;
  r = await d.fr.evaluate(async () => {
    try { ctPeopleWipe(); } catch (e) {}
    try { render(); } catch (e) {}
    const out = {}; const keep = T.min;
    for (let i = 1; i <= 8; i++) { T.min = keep + i; try { render(); } catch (e) {} }
    /* CONTROL ONE: nothing owed, nothing folded. This mouth must be silent. */
    /* *** HE HAS BEEN WALKING FOR A MINUTE. *** (9/24, rule 32a: "why does
       everything have to happen the first second of the game".) Nothing in the
       city speaks until play is 60 s old, so a gate that asserts speech has to
       put him past that first, exactly as a player is by the time any of this
       could happen. This is a PRECONDITION, not a bypass: the quiet floor is
       still on and creditor_waits_gate is what proves it holds. */
    try { CT_PLAY_MS = performance.now() - 61000; } catch (_e) {}
    CT_STOOD_SAID = {}; BARK.p = null; BARK.until = 0; BARK.next = 0;
    window.__STOOD_SAID = null;
    try { barkTick(performance.now() + 1000); } catch (e) {}
    out.silentWithNothing = !window.__STOOD_SAID;
    /* the father borrows and goes short, through the game's own writers */
    const fid = (typeof ctFid !== 'undefined' && ctFid) || 'CARTEL';
    try { BohemiaLend.take(LOAN_BOOK, fid, DAY ? DAY.day : 1); } catch (e) {}
    try { out.witnessed = ctDeed(BohemiaLend.SHORT_DEED,
      CT_DEED_CLOUT[BohemiaLend.SHORT_DEED], fid); } catch (e) { out.threw = String(e); }
    try { out.witnessed2 = ctDeed('favour', CT_DEED_CLOUT['favour'], fid); } catch (e) {}
    const holders = () => ctMindsList().filter(m =>
      (m.deeds || []).some(x => x.kind === 'loan:short'));
    out.rememberBefore = holders().length;
    /* CONTROL TWO: the father is ALIVE. Nothing has ended, so still silence. */
    CT_STOOD_SAID = {}; BARK.p = null; BARK.until = 0; BARK.next = 0;
    window.__STOOD_SAID = null;
    try { barkTick(performance.now() + 2000); } catch (e) {}
    out.silentBeforeTheFold = !window.__STOOD_SAID;
    /* THE GENERATION TURNS */
    try { out.fold = ctFold(); } catch (e) { out.foldThrew = String(e); }
    out.rememberAfter = holders().length;
    out.stillRemember = BohemiaStanding.whoRemembers(ctMindsList(), null, null)
      .map(x => ({ who: x.who, kind: x.kind, saw: x.saw }));
    /* AND THE HEIR WALKS OUT */
    const said = [];
    for (let i = 0; i < 8; i++) {
      BARK.p = null; BARK.until = 0; BARK.next = 0; window.__STOOD_SAID = null;
      try { render(); barkTick(performance.now() + 5000 + i * 6000); } catch (e) {}
      if (window.__STOOD_SAID) said.push(window.__STOOD_SAID);
    }
    out.said = said;
    out.uniq = new Set(said.map(x => x.by + '|' + x.kind)).size;
    out.headsOnAll = said.length > 0 && said.every(x => !!x.head);
    out.bothWays = new Set(said.map(x => x.kind)).size >= 2;
    T.min = keep;
    return out;
  });
  note('before the fold, who knew', r.rememberBefore);
  note('after the fold, who knew', r.rememberAfter);
  (r.said || []).forEach(s => note('the street says', '"' + s.text + '"  (' + s.head + ')'));

  probe('a deed really got published, so the numbers below are not an empty set',
        r.witnessed > 0);
  probe('*** THE MOUTH IS SILENT WHEN THERE IS NOTHING TO SAY ***',
        r.silentWithNothing === true);
  probe('*** AND SILENT WHILE THE FATHER IS STILL ALIVE, so it fires on the FOLD '
    + 'and not on any deed at all ***', r.silentBeforeTheFold === true);
  ok('*** THE MAN WHO WATCHED IS STILL THERE AFTER THE GENERATION TURNS. *** It '
     + 'used to be 1 before and 0 after',
     r.rememberBefore > 0 && r.rememberAfter === r.rememberBefore,
     r.rememberBefore + ' before, ' + r.rememberAfter + ' after');
  ok('and the fold\'s own report stops saying it died with the last person who '
     + 'saw it, and says somebody stood instead',
     r.fold && r.fold.died === 0 && r.fold.stood > 0
       && !(r.fold.beat && (r.fold.beat.lost || []).some(x => x.what === 'deeds')),
     JSON.stringify({ died: r.fold && r.fold.died, stood: r.fold && r.fold.stood,
                      lost: r.fold && r.fold.beat && r.fold.beat.lost }));
  ok('the row\'s own question answers with a PERSON who was there',
     (r.stillRemember || []).length > 0 && r.stillRemember.every(x => !!x.who),
     JSON.stringify(r.stillRemember));
  ok('*** AND HE SAYS IT OUT LOUD, TO THE HEIR\'S FACE ***',
     (r.said || []).length > 0, (r.said[0] || {}).text || 'nothing said');
  ok('with a name and a face, per rule 19c: text comes from a mouth', r.headsOnAll,
     'heads on ' + (r.said || []).length + ' of ' + (r.said || []).length);
  ok('*** AND IT CUTS BOTH WAYS: the man his father did a turn for is standing '
     + 'there too. An heir who only ever meets the debts is a punishment, not an '
     + 'inheritance ***', r.bothWays,
     [...new Set((r.said || []).map(x => x.kind))].join(', '));
  ok('and nobody is a broken record: one man, one story, said once',
     (r.said || []).length === r.uniq,
     (r.said || []).length + ' said, ' + r.uniq + ' different');
  ok('and nothing threw while any of it happened', d.errs.length === 0,
     'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
  await d.close();
} catch (e) {
  ok('the alpha drive finished', false, e.message);
}
probe('the drive really ran, so a green above is not an empty pass', drove);

/* ======================================================================== */
head('D. THE WORDS COME OUT OF THE MOUTH UNPAINTED');
/* ======================================================================== */
{
  const i = city.indexOf('try{ barkPass(ox,oy,C); }catch(_e){}');
  const h = city.indexOf('try{ homePass(ox,oy,C); }catch(_e){}');
  ok('*** THE SPEECH BUBBLE IS DRAWN AFTER THE WAYFINDER, because this round\'s '
     + 'own cook photographed the word HOME painted straight through a sentence ***',
     i > 0 && h > 0 && i > h, 'bubble at ' + i + ', wayfinder at ' + h);
  ok('and the cost is written down rather than left for somebody to find',
     /for the two seconds a bubble is up it can cover the HOME word/.test(flat(city)));
}

/* ======================================================================== */
head('E. THE COOK IS IN THE VOTE TAB AND IT IS PIXELS');
/* ======================================================================== */
ok('the page exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
const shots = ['PEOPLE_STOOD_1_BEFORE.png', 'PEOPLE_STOOD_2_OWED.png',
               'PEOPLE_STOOD_3_TURN.png'];
ok('and it shows THREE FRAMES OFF THE REAL GLASS, not a description of one',
   shots.every(s => page.indexOf(s) >= 0
     && fs.existsSync(path.join(ROOT, 'slices/vote', s))));
const sizes = shots.map(s => { try { return fs.statSync(path.join(ROOT, 'slices/vote', s)).size; }
                               catch (e) { return 0; } });
ok('*** AND THEY ARE THREE DIFFERENT FRAMES, *** which this lane learned to check '
   + 'the hard way: a page photographed after the fact comes back byte for byte '
   + 'identical on a city that only redraws when the player acts',
   new Set(sizes).size === 3 && sizes.every(s => s > 50000), sizes.join(' / ') + ' bytes');
ok('the sentences are the game\'s own words, kept beside the pictures',
   fs.existsSync(path.join(ROOT, 'slices/vote/PEOPLE_STOOD_SAID.json')));
ok('and the page reads at an eighth-grade level: no code words on his screen',
   !/inherit\(|ctFold|BARK_DREW|deeds|hops|localStorage|null/.test(page));
let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-the-one-who-stood-there-9-23');
} catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB, which is rule 22 ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page, so the tab shows the thing (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item, which rule 29 bans', !!(item && item.kind !== 'line'));

/* ======================================================================== */
head('F. THE RECORD');
/* ======================================================================== */
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries the row\'s own words',
   /still standing there, still remembering/i.test(rec));
ok('and it names the two gates whose premise this touches, rather than quietly '
   + 'changing it under them',
   /standing_gate/.test(rec) && /faction_between/.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

/* ======================================================================== */
console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
