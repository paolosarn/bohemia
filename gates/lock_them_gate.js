/* ============================================================================
   BOHEMIA LOCK THEM (9/15/26, PEOPLE lane).
   VAMILY [lock them], row ONE-TAP-LOCKS-A-PERSON-YOU-WILL-NOT-LOSE.

   PAOLO 9/11:
     "there has to be a way to make it easy to lock characters they don't want
      to die, companions, people in your company, not endgame bullshit."

   *** THE CONTROL IS THE STATE HE PLAYED, AND IT IS THE HEADLINE OF THIS GATE.
   Measured on the running demo, first morning, phone profile:

     the father falls, nothing locked    he IS down, and the card says NOTHING
     one tap, the same fall, same day    RAY IS DOWN, KNOCKED ABOUT, 7 DAYS

   The promise only ever covered the family you MARRY and the children you HAVE,
   plus whoever a ledger happened to name that second. Everybody else could be
   hurt in silence. ***

   AND WHY A MARK AND NOT A COMPUTATION. bohemia_company.js keeps no roster, on
   purpose and correctly, so who is yours is recomputed every call out of bonds
   and witnesses -- and a witness is somebody carrying a deed of yours, which
   fades on a three-week halflife. A promise that covers whoever a ledger names
   at the moment you ask is a promise with a hole nobody can see. A name he
   tapped does not decay.

   AND THE COST, WHICH IS WHAT MAKES IT A CHOICE. With nobody killable, the
   weight of a fall is what you lose WHILE they are down: a hurt person is not in
   your crew and is giving you nothing, for exactly as long as the injury the
   down module already rolled. Not one number in this feature is new.

   WHAT THIS HOLDS:
   A. the module: free, uncapped, reversible, and no way to lose anybody
   B. one id for one person, because two ids is a promise covering a ghost
   C. on the demo he plays: the tap exists in the first hour, it locks, the panel
      stays open and its own words move, it survives a reload, and the control
      above goes the other way with nothing locked
   D. the cost bites: a hurt person leaves the crew and the card says what it cost

   node gates/lock_them_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const MOD = path.join(ROOT, 'engine/bohemia_lock.js');
const REC = path.join(ROOT, 'records/BOHEMIA_LOCK_THEM_9_15_26.txt');
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
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }
/* A COMMENT IS A BLOCK, NOT A LINE -- this lane has been fooled by a claim that
   matched its own explanation more than once. */
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}
/* AND A REGEX MEETS A LINE WRAP. A claim about a record went red last round on a
   record that said exactly what it asked for, because the sentence was wrapped. */
function flat(s) { return String(s).replace(/\s+/g, ' '); }

(async () => {

  /* ======================================================================== */
  head('A. THE MODULE: EASY, UNCAPPED, REVERSIBLE, AND NOBODY CAN BE LOST');
  /* ======================================================================== */
  const src = fs.readFileSync(MOD, 'utf8');
  const code = stripComments(src);
  const L = require(MOD);

  /* HIS OWN SENTENCE IS IN THE FILE, so the next person to touch it reads why
     rather than guessing why. */
  /* A REGEX MEETS A COMMENT MARKER AS WELL AS A LINE WRAP: his sentence is
     quoted across two comment lines, so flattening whitespace leaves the // in
     the middle of it. The claim asks for the half that fits on one line. */
  ok('the module carries his own words, so nobody has to guess what it is for',
     /make it easy to lock characters/.test(flat(src))
     && /not endgame bullshit/.test(flat(src)));

  /* "NOT ENDGAME BULLSHIT" IS ENFORCED BY THE SHAPE OF THE CALL. There is no
     parameter that could carry a price, an item or a rung, so a caller in a
     hurry cannot add a gate later without changing the signature in the open. */
  ok('one tap costs nothing, because lock() has no slot a price could arrive in',
     L.lock.length === 3, 'lock(book, id, day), arity ' + L.lock.length);
  const bk = {};
  let smuggled = false;
  try {
    /* try to make it expensive or gated, the way [down not dead] tried to make
       a permanent injury: attempt the forbidden thing rather than read a comment */
    L.lock(bk, 'a', 1, { costs: 9, needs: 'rare item', rung: 'TERRITORY' });
    const r = bk['a'];
    smuggled = !!(r && (r.costs != null || r.needs != null || r.rung != null));
  } catch (_e) { smuggled = false; }
  ok('and a fourth argument asking for a gate is not recorded', !smuggled);

  /* NO CAP. A cap is a number nobody ruled and it is the endgame shape he named. */
  const many = {};
  for (let i = 0; i < 500; i++) L.lock(many, 'p' + i, 1);
  ok('there is no cap on how many people he will not lose',
     L.count(many) === 500, L.count(many) + ' locked');

  /* A LOCK DOES NOT DECAY. Deliberately the opposite shape from bohemia_down,
     where "are they down" IS a question against the clock. */
  ok('isLocked takes no day, so time cannot take a lock away',
     L.isLocked.length === 2, 'isLocked(book, id), arity ' + L.isLocked.length);
  ok('and it is still true ten thousand days later', L.isLocked(many, 'p7'));
  ok('no clock word appears in the lock question at all',
     !/\bday\b/.test(stripComments(String(L.isLocked))));

  /* THERE IS NO WAY TO LOSE A LOCKED PERSON. Same discipline the down module
     paid for: the bad state has to be unreachable, not merely undocumented. */
  const banned = Object.keys(L).filter(k => /kill|die|dead|lose|lost|perish|drop/i.test(k));
  ok('no export can lose anybody', banned.length === 0,
     banned.length ? banned.join(',') : Object.keys(L).length + ' exports, none of them');
  ok('unlock removes the MARK and returns a boolean, never a person',
     L.unlock(many, 'p7') === true && L.isLocked(many, 'p7') === false);
  ok('and unlocking somebody who was never locked is false, not an error',
     L.unlock(many, 'nobody-at-all') === false);

  /* THE COST IS NOT A NEW NUMBER: withheld reports the down module's own
     arithmetic and cannot invent a length of its own. */
  const D = require(path.join(ROOT, 'engine/bohemia_down.js'));
  const lb = {}, db = {};
  L.lock(lb, 'x', 1); L.lock(lb, 'y', 1);
  D.fall(db, 'x', 1);
  const w = L.withheld(lb, id => D.isDown(db, id, 1), id => D.daysLeft(db, id, 1));
  ok('what it costs is the injury the down module already rolled, not a new number',
     w.length === 1 && w[0].id === 'x' && w[0].daysLeft === D.daysLeft(db, 'x', 1),
     w.length ? w[0].id + ', ' + w[0].daysLeft + ' days' : 'nothing withheld');
  ok('and no length is written in this file at all',
     !/\b(7|90|365)\b/.test(code.replace(/arity|slice/g, '')),
     'the three lengths live in the down module');

  /* ======================================================================== */
  head('B. ONE ID FOR ONE PERSON, BECAUSE TWO IS A PROMISE COVERING A GHOST');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  const ccode = stripComments(city);

  ok('the walked city carries the module, inlined verbatim',
     city.indexOf(src) >= 0);
  for (const fn of ['ctLockTap', 'ctLocked', 'ctLockList', 'ctLockCost',
                    'ctLockOut', 'ctLockName', 'ctFamId', 'ctWhoName']) {
    ok('the city has ' + fn, new RegExp('function ' + fn + '\\s*\\(').test(ccode));
  }
  /* THE ID FORMAT IS WRITTEN IN ONE PLACE. The family tree builds 'cast:' + role
     and nothing else may spell it again: a second speller is how one man ends up
     with two ids and the promise protects the one he did not tap. This is the
     same defect as the body ladder written twice, one round ago. */
  const castSpellers = (ccode.match(/'cast:'\s*\+/g) || []).length;
  ok('the family id format is spelled in exactly one place', castSpellers === 1,
     castSpellers + ' speller(s)');
  ok('and the tap asks the tree for the id instead of building one',
     /function ctFamId[\s\S]{0,700}famTree\(\)/.test(ccode)
     && !/function ctFamId[\s\S]{0,700}'cast:'/.test(ccode));
  /* THE PROMISE READS THE LOCK. Without this loop the coverage is whatever a
     decaying ledger happens to say, which is the hole this row exists to close. */
  /* THE BODY, NOT A WINDOW AFTER THE NAME. A fixed-size window ran past the end
     of the function and matched the export line underneath it, so unplugging the
     lock from the promise left this claim GREEN. A claim that cannot fail is
     worse than no claim, which is this repo's own rule from 8/30. */
  function bodyOf(src, name) {
    const i = src.indexOf('function ' + name);
    if (i < 0) return '';
    let j = src.indexOf('{', i), d = 0;
    for (let k = j; k < src.length; k++) {
      if (src[k] === '{') d++;
      else if (src[k] === '}') { d--; if (!d) return src.slice(j, k + 1); }
    }
    return '';
  }
  const downMine = bodyOf(ccode, 'ctDownMine');
  probe('the body reader found ctDownMine at all', downMine.length > 200);
  ok('who is down reads the lock list, not only the ledgers',
     downMine.indexOf('ctLockList()') >= 0, downMine.length + ' chars of body read');

  /* ======================================================================== */
  head('C. ON THE DEMO HE PLAYS');
  /* ======================================================================== */
  let drove = false;
  try {
    const { open } = require(DRIVE);
    const d = await open({});
    await d.clearCards();
    const fr = d.fr;
    drove = true;
    ok('the demo booted and the walked city answered', true,
       await fr.evaluate(() => (typeof ctLockTap === 'function') ? 'ok' : 'no lock seam'));

    /* START FROM A CLEAN SAVE, THROUGH THE GAME'S OWN DOORS.
       AND THE FIRST CUT OF THIS RESET DID NOT RESET, which cost four claims and
       is worth writing down: clearing localStorage does NOT clear the book,
       because ctLockLoad only overwrites the in-memory copy when storage HAS
       something ('if raw is an object'), exactly like ctDownLoad it was modelled
       on. So the tap under test toggled a lock that was already on and the whole
       block measured the feature running backwards. Unlocking through ctLockTap
       is the player's own door and cannot drift from what he does. */
    await fr.evaluate(() => {
      ctLockList().forEach(r => ctLockTap(r.id));
      localStorage.removeItem('boh.city.down'); CT_DOWN = {}; ctDownSave();
    });
    await fr.evaluate(() => showStanding());
    await fr.evaluate(() => new Promise(r => setTimeout(r, 300)));

    /* ---- THE TAP EXISTS IN THE FIRST HOUR --------------------------------- */
    const t0 = await fr.evaluate(() => Array.from(document.querySelectorAll('[data-lock]'))
      .map(e => ({ id: e.getAttribute('data-lock'), text: e.textContent.trim(),
                   h: Math.round(e.getBoundingClientRect().height) })));
    ok('*** THERE IS SOMEBODY TO LOCK ON THE FIRST MORNING ***, which is the half '
       + 'of his sentence a card built for the endgame would lose',
       t0.length > 0, t0.length + ' tap target(s): ' + t0.map(x => x.text).join(', '));
    const minH = t0.length ? Math.min.apply(null, t0.map(x => x.h)) : 0;
    ok('and every one of them is a real target on a phone, not a word to poke at',
       t0.length > 0 && minH >= 40, 'shortest ' + minH + ' px');
    note('the people the game can name as his on the first morning',
         t0.map(x => x.text + ' [' + x.id + ']').join(' · '));

    /* ---- THE CONTROL, AND IT IS THE HEADLINE ------------------------------ */
    const ctl = await fr.evaluate(() => {
      ctFall('cast:FATHER');
      return { isDown: ctIsDown('cast:FATHER'),
               covered: ctDownMine().map(x => x.rel + ':' + x.id) };
    });
    ok('*** WITH NOTHING LOCKED, A MAN CAN BE HURT AND THE GAME SAYS NOTHING. ***'
       + ' The control is the state he played, not a hypothetical',
       ctl.isDown === true && ctl.covered.length === 0,
       'down=' + ctl.isDown + ', the card covers ' + ctl.covered.length);

    const after = await fr.evaluate(() => {
      ctLockTap('cast:FATHER');
      return { covered: ctDownMine().map(x => x.rel + ':' + x.id),
               list: ctLockList().map(r => r.id) };
    });
    ok('*** ONE TAP, THE SAME FALL, THE SAME DAY, AND NOW HE IS ON THE CARD ***',
       after.covered.length === 1 && after.covered[0].indexOf('locked:') === 0,
       after.covered.join(', '));

    /* ---- RULE 14(h): THE PANEL STILL OPEN AND ITS OWN WORDS MOVED --------- */
    await fr.evaluate(() => {
      ctLockList().forEach(r => ctLockTap(r.id));
      localStorage.removeItem('boh.city.down'); CT_DOWN = {}; ctDownSave();
      showStanding();
    });
    await fr.evaluate(() => new Promise(r => setTimeout(r, 250)));
    const words = () => fr.evaluate(() => {
      const c = document.querySelector('#daycardIn');
      return c ? { open: true, text: c.textContent.replace(/\s+/g, ' ').trim() }
               : { open: false, text: '' };
    });
    const cleanNow = await fr.evaluate(() => ({ locked: ctLockList().length,
                                                down: ctIsDown('cast:FATHER') }));
    probe('the reset really reset, so the tap below is measuring a lock and not '
          + 'an unlock', cleanNow.locked === 0 && cleanNow.down === false);
    const before = await words();
    await fr.evaluate(() => document.querySelector('[data-lock]').click());
    await fr.evaluate(() => new Promise(r => setTimeout(r, 350)));
    const afterTap = await words();
    ok('ONE TAP LOCKS, and it is judged the way rule 14(h) asks: THE PANEL IS '
       + 'STILL OPEN and its own words moved, never a card that vanished',
       afterTap.open === true && afterTap.text !== before.text
       && /YOU WILL NOT LOSE/.test(afterTap.text),
       afterTap.open ? 'panel open, words moved' : 'THE PANEL CLOSED');
    const marked = await fr.evaluate(() => {
      const e = document.querySelector('[data-lock]');
      return e ? e.classList.contains('on') : null; });
    ok('and the name he tapped is marked, so the promise is visible not remembered',
       marked === true);
    const namedRight = await fr.evaluate(() => {
      const t = document.querySelector('#daycardIn').textContent;
      const i = t.indexOf('YOU WILL NOT LOSE');
      return i < 0 ? '' : t.slice(i, i + 40).replace(/\s+/g, ' ');
    });
    ok('and it says WHO, not ONE OF YOURS -- a fallback standing in for somebody '
       + 'the game can name is how a person stops being a person',
       namedRight.length > 0 && !/ONE OF YOURS/.test(namedRight), namedRight.trim());

    /* ---- ONE TAP BACK OFF ------------------------------------------------- */
    await fr.evaluate(() => document.querySelector('[data-lock]').click());
    await fr.evaluate(() => new Promise(r => setTimeout(r, 300)));
    const off = await fr.evaluate(() => ({ n: ctLockList().length,
                                           open: !!document.querySelector('#daycardIn') }));
    ok('one tap back off, because a mark he cannot remove is the endgame bullshit '
       + 'he named wearing a friendlier face',
       off.n === 0 && off.open === true, off.n + ' locked, panel open ' + off.open);

    /* ---- THE COST, ON THE CARD AND IN THE WORLD --------------------------- */
    const cost = await fr.evaluate(() => {
      ctLockTap('cast:FATHER'); ctFall('cast:FATHER'); showStanding();
      const t = document.querySelector('#daycardIn').textContent.replace(/\s+/g, ' ');
      return { text: t, rows: ctLockCost(),
               left: BohemiaDown.daysLeft(ctDownLoad(), 'cast:FATHER', T.day | 0) };
    });
    ok('the card says what the fall COST him and for how long, which is what makes '
       + 'the lock a choice rather than a free win',
       /COSTS YOU/.test(cost.text) && /GIVING YOU NOTHING/.test(cost.text)
       && cost.rows.length === 1,
       cost.rows.length ? cost.rows[0].id + ', ' + cost.rows[0].daysLeft + ' days' : 'no cost row');
    ok('and the number on the card is the down module\'s own, not a second one',
       cost.rows.length === 1 && cost.rows[0].daysLeft === cost.left,
       cost.rows[0] ? cost.rows[0].daysLeft + ' = ' + cost.left : '');

    const crew = await fr.evaluate(() => {
      const j = ctJoinersHere();
      const who = j && j.offers && j.offers.length ? j.offers[0].who : null;
      const b = ctFollowersHere(5);
      ctFall(who);
      const a = ctFollowersHere(5);
      return { who: who, before: b && b.crowd, after: a && a.crowd };
    });
    ok('and a hurt person is not carrying anything: they leave the crew until they '
       + 'are well, which is the share of the carry this world computes',
       crew.before != null && crew.after === crew.before - 1,
       crew.before + ' -> ' + crew.after + ' after ' + crew.who + ' fell');

    /* ---- IT SURVIVES THE PAGE BEING CLOSED -------------------------------- */
    await d.page.reload({ waitUntil: 'load' });
    await d.page.waitForTimeout(2000);
    /* the splash is in the SHELL and the driver's own card-clearer closes over a
       frame the reload detached, so the shell's door is tapped directly here */
    const vp = d.page.viewportSize();
    await d.page.mouse.click(vp.width / 2, vp.height / 2);
    await d.page.waitForTimeout(1500);
    let fr2 = null;
    for (let i = 0; i < 90 && !fr2; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof ctLockList === 'function')) { fr2 = f; break; } }
        catch (_e) {}
      }
      if (!fr2) await d.page.waitForTimeout(500);
    }
    const kept = fr2 ? await fr2.evaluate(() => ({
      list: ctLockList().map(r => r.id),
      covered: ctDownMine().map(x => x.rel + ':' + x.id) })) : null;
    ok('and it is still true after the page is closed and opened again, because a '
       + 'promise he has to re-make every morning is not a promise',
       !!kept && kept.list.indexOf('cast:FATHER') >= 0 && kept.covered.length > 0,
       kept ? kept.list.join(',') + ' | ' + kept.covered.join(',') : 'the city never came up');

    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the demo drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('D. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  if (fs.existsSync(REC)) {
    const r = flat(fs.readFileSync(REC, 'utf8'));
    ok('the record carries his own sentence', /lock characters they don't want to die/.test(r));
    ok('and the control that is the whole finding',
       /nothing locked/i.test(r) && /says nothing|SAYS NOTHING/.test(r));
  } else {
    ok('the record exists', false, REC);
  }

  notes.forEach(n => console.log(n));
  console.log('\n=== LOCK THEM: ' + pass + ' pass / ' + fail.length + ' fail ===');
  if (fail.length) { fail.forEach(f => console.log('   - ' + f)); process.exit(1); }
})();
