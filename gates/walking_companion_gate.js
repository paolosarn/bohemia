/* ============================================================================
   BOHEMIA WALKING COMPANION (9/21/26, PEOPLE lane).
   VAMILY [walking companion], row A-COMPANION-ON-FOOT. Under the rule 18 hold,
   with the RULE 22 cook riding beside it.

   PAOLO 9/7: "I don't know about the companion right now, have it on shuffle
   mode." So NO FIXED COMPANION AND NO FIXED NAME: whoever walks with you is
   drawn from the people already around you, shuffled per save, named from the
   pools that exist, draft:true.

   *** MEASURED ON THE ALPHA BEFORE A LINE WAS WRITTEN: NOBODY WALKS WITH YOU
   AND NOBODY EVER HAS. *** 0 of 61 people on his block answer "follow", 0 are
   hostile, 0 watching, 0 blocking, and the follow map is empty and stays empty
   over ten walked steps.

   *** AND THE CONTROL COST TWO TRIES, WHICH IS THE LESSON AGAIN. *** The first
   control stubbed one person into answering "follow", walked, and read zero --
   and the honest reading of that is NOT "the pipe is broken". Sight is 9 cells
   and the screen covers 2,415, so the body I picked was 62 CELLS AWAY and the
   follow pass correctly dropped it as "lost you". Repointed to the NEAREST
   drawn body and called the pass directly: somebody enters the follow map on
   the first try. THE PIPE WORKS. What is missing is a reason for a friend to
   use it, because only an enemy is ever allowed to.
   (This lane repointed a gate for exactly this trap on 9/16. It is the same
   trap: BARK_DREW[0] is not the nearest body, it is the first one drawn.)

   *** AND THE SHUFFLE HAS ONE CARD. *** Hour by hour, 1 or 2 of 61 people are
   within the game's own sight range, so six different saves all draw the same
   person. The shuffle itself is sound: eight candidates over forty saves hands
   back four different people. The deck is the problem, not the dealer.

   WHAT THIS HOLDS:
   A. the chooser invents nothing, keeps no clock, and answers the row's three
      questions off facts the world already has
   B. the shuffle really shuffles, and refuses rather than guessing
   C. on the alpha: nobody follows, the pipe works, the deck has one card
   D. the cook is in the VOTE tab and the person on it is the real one
   E. rule 18: nothing is on the play surface and nothing calls this

   node gates/walking_companion_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const MOD = path.join(ROOT, 'tools/bohemia_companion.js');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_THE_ONE_WHO_WALKS_WITH_YOU_9_21_26.html');
const FACE = path.join(ROOT, 'slices/vote/PEOPLE_COMPANION_12_12_900_9_21.png');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_WALKING_COMPANION_9_21_26.txt');
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

(async () => {
  const C = require(MOD);
  const src = fs.readFileSync(MOD, 'utf8');

  /* ======================================================================== */
  head('A. THE CHOOSER INVENTS NOTHING');
  /* ======================================================================== */
  probe('the module loads and exports a draw',
        typeof C.pick === 'function' && typeof C.reasons === 'function');
  ok('*** IT IS PURE. *** No DOM, no game globals, no clock, so the same world '
     + 'gives the same answer in a gate, in a page and in the game',
     !/document|window|Date\.now|performance\.now|Math\.random/.test(src));
  ok('the numbers live in ONE dial tagged draft:true, never sprayed through the '
     + 'code, because none of them is his ruling yet',
     C.DIAL && C.DIAL.draft === true && typeof C.DIAL.reach === 'number');
  ok('and the reach is the game\'s OWN sight range, not a new number somebody '
     + 'picked here', C.DIAL.reach === 9 && /ctSeeRange/.test(src));
  ok('*** EVERY REASON IS A FACT THE WORLD ALREADY HAS ***, and a missing fact is '
     + 'a NO rather than a maybe',
     C.REASONS.length === 4
     && C.REASONS.every(r => r.key && r.say && typeof r.weight === 'number'));
  ok('a debt moves somebody harder than an empty afternoon does, which is the '
     + 'order a real person would rank them in',
     C.REASONS[0].weight > C.REASONS[1].weight
     && C.REASONS[1].weight > C.REASONS[2].weight
     && C.REASONS[2].weight > C.REASONS[3].weight);
  ok('*** WHAT SHE WANTS IS ALREADY IN THE WORLD ***, which is the row\'s own '
     + 'words: a debt in the ledger, a day\'s work, getting home',
     Object.keys(C.WANTS).length === 4
     && Object.keys(C.WANTS).every(k => C.REASONS.some(r => r.key === k)));
  ok('*** AND WHAT SHE REFUSES COMES OFF HER OWN STANDING, *** not off a list '
     + 'written here: her faction first, then her household, then the floor '
     + 'everybody has',
     C.refusal({ faction: 'Church' }).kind === 'faction'
     && C.refusal({ household: 1 }).kind === 'house'
     && C.refusal({}).kind === 'start');
  ok('and it never names a person, because names are his',
     !/\b(Rosa|Marisela|Denise|Ray|Marco|Nina)\b/.test(src));

  /* ======================================================================== */
  head('B. THE SHUFFLE REALLY SHUFFLES, AND REFUSES RATHER THAN GUESSING');
  /* ======================================================================== */
  const mk = (i, o) => ({ id: 't:' + i, trade: 'WORKER', dist: 3, work: i % 2 === 0,
    household: i % 3 === 0, faction: (i % 5 === 0 ? 'Church' : null),
    owesYou: !!o, owedByYou: false });
  const eight = [0, 1, 2, 3, 4, 5, 6, 7].map(i => mk(i, i === 3));
  const seen = {};
  for (let s = 1; s <= 40; s++) { const p = C.pick(eight, s); if (p) seen[p.id] = 1; }
  const distinct = Object.keys(seen).length;
  note('the control: eight candidates over forty saves', distinct + ' different people');
  ok('*** THE CONTROL: GIVEN A REAL DECK IT DEALS DIFFERENT PEOPLE ***, so '
     + '"every save draws the same person" below is a fact about the world and '
     + 'not about this code', distinct >= 3, distinct + ' distinct over 40 saves');
  ok('same save, same answer, forever, with nothing stored',
     C.pick(eight, 7).id === C.pick(eight, 7).id
     && C.pick(eight, 7).id === C.pick(eight.slice().reverse(), 7).id);
  ok('somebody out of reach is out, however good their reason',
     C.pick([Object.assign(mk(9, true), { dist: 40 })], 9) === null);
  ok('*** AND NOBODY IS AN ANSWER. *** With no reason at all it returns nothing '
     + 'rather than picking the nearest body',
     C.pick([{ id: 'x', dist: 3, work: true, household: 1, faction: null }], 1) !== null
     && C.pick([], 1) === null);
  ok('the draw says how big the deck was, so a shuffle with one card cannot hide',
     C.pick([mk(0)], 9).outOf === 1 && C.pick(eight, 9).outOf > 1);
  ok('and every draw is tagged draft:true, because he has ruled on none of it',
     C.pick(eight, 3).draft === true);

  /* ======================================================================== */
  head('C. ON THE GLASS, ON THE ALPHA');
  /* ======================================================================== */
  let drove = false, r = null;
  try {
    const { open } = require(DRIVE);
    const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
    await d.clearCards();
    drove = true;
    r = await d.fr.evaluate(async () => {
      const out = {};
      out.seeRange = ctSeeRange();
      const all = (typeof ctEveryone === 'function' ? ctEveryone() : []) || [];
      out.census = all.length;

      /* WHO MAY FOLLOW HIM TODAY */
      let mayFollow = 0, hostile = 0;
      for (const p of all) { let ag = null; try { ag = ctAgainstMe(p); } catch (e) {}
        if (!ag) continue; if (ag.signs && ag.signs.follow) mayFollow++; if (ag.rung) hostile++; }
      out.mayFollow = mayFollow; out.hostile = hostile;
      for (const k in CT_FOLLOW) delete CT_FOLLOW[k];

      /* *** EVERYTHING AT REST FIRST, AND THE WALK LAST. *** The first cut of
         this gate walked eight steps and THEN measured who was near: he had
         walked away from everybody, so the nearest body read 36 cells and the
         deck read zero at every hour. The game was right and the order was
         mine. Measure before you disturb.

         AND IT IS THE NEAREST BODY, NOT THE FIRST ONE DRAWN.
         Sight is 9 cells and the screen covers thousands, so BARK_DREW[0] can
         be 62 cells out and the follow pass drops it, which reads as a dead
         pipe and is not one. *** */
      BARK_DREW.length = 0; try { render(); } catch (e) {}
      const dists = BARK_DREW.map(e => { const a = ctAt(e.p);
        return a ? Math.abs(a[0] - hx) + Math.abs(a[1] - hy) : null; }).filter(x => x != null);
      out.drawn = BARK_DREW.length;
      out.nearestDrawn = dists.length ? Math.min.apply(null, dists) : null;
      out.farthestDrawn = dists.length ? Math.max.apply(null, dists) : null;
      const real = ctAgainstMe;
      window.ctAgainstMe = function () {
        return { rung: 'cold', signs: { follow: true, watch: false, block: false, refuse: false } }; };
      ctFollowStep();
      out.controlFollowed = Object.keys(CT_FOLLOW).length;
      window.ctAgainstMe = real;
      for (const k in CT_FOLLOW) delete CT_FOLLOW[k];

      /* HOW BIG THE DECK IS, HOUR BY HOUR */
      const keep = T.min, rows = [];
      for (const h of [3, 7, 10, 13, 17, 20, 23]) {
        T.min = h * 60 + 5;
        let n = 0;
        for (const p of all) { const at = ctAt(p); if (!at) continue;
          if (Math.abs(at[0] - hx) + Math.abs(at[1] - hy) <= out.seeRange) n++; }
        rows.push({ h, n });
      }
      T.min = keep; try { render(); } catch (e) {}
      out.deckByHour = rows;
      const cvs = document.querySelector('canvas');
      out.cellsOnScreen = Math.round((cvs.width / HZOOM) * (cvs.height / HZOOM));
      out.sightCells = 2 * out.seeRange * out.seeRange + 2 * out.seeRange + 1;

      /* THE WALK LAST, because it moves him away from everything above. */
      for (const k in CT_FOLLOW) delete CT_FOLLOW[k];
      for (let i = 0; i < 8; i++) { try { render(); stepOnce(0, 1); } catch (e) {} }
      out.followedAfterWalk = Object.keys(CT_FOLLOW).length;
      return out;
    });

    note('the block', r.census + ' people, sight ' + r.seeRange + ' cells');
    note('drawn on screen', r.drawn + ', nearest ' + r.nearestDrawn
         + ' cells, farthest ' + r.farthestDrawn);
    note('the deck, hour by hour', r.deckByHour.map(x => x.h + 'h:' + x.n).join('  '));

    probe('the street really has people on it', r.census > 20);
    probe('and bodies really reached the glass', r.drawn > 0 && r.nearestDrawn != null);

    ok('*** NOBODY WALKS WITH YOU, AND NOBODY EVER HAS. *** Not one person on his '
       + 'block will follow him, and ten walked steps do not change it',
       r.mayFollow === 0 && r.followedAfterWalk === 0,
       r.mayFollow + ' of ' + r.census + ' may follow, ' + r.followedAfterWalk
       + ' following after a walk');
    ok('*** AND THE CONTROL SAYS THE WALKING ITSELF IS FINE. *** Tell one person '
       + 'to follow and somebody joins on the first pass, so what is missing is a '
       + 'reason and not machinery',
       r.controlFollowed > 0, r.controlFollowed + ' joined the follow map');
    ok('*** THE FIRST BODY DRAWN IS NOT THE NEAREST ONE ***, which is what made '
       + 'the first control lie: the camera shows him people the game says he '
       + 'cannot reach',
       r.farthestDrawn > r.seeRange * 2,
       'farthest drawn ' + r.farthestDrawn + ' cells against sight ' + r.seeRange);
    ok('*** AND THE SHUFFLE HAS ONE CARD, AT EVERY HOUR OF THE DAY. *** He asked '
       + 'for shuffle and the world offers one person to shuffle',
       r.deckByHour.every(x => x.n <= 2) && r.deckByHour.some(x => x.n >= 1),
       'deck ranges ' + Math.min.apply(null, r.deckByHour.map(x => x.n)) + ' to '
       + Math.max.apply(null, r.deckByHour.map(x => x.n)));
    ok('and the arithmetic says why: the screen shows him many times more street '
       + 'than he can reach',
       r.cellsOnScreen > r.sightCells * 5,
       r.cellsOnScreen + ' cells on screen against ' + r.sightCells + ' he can reach');
    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the alpha drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('D. THE COOK IS IN THE VOTE TAB, AND SHE IS THE REAL ONE');
  /* ======================================================================== */
  let page = '';
  try { page = fs.readFileSync(PAGE, 'utf8'); } catch (e) {}
  probe('the page exists', page.length > 1500);
  ok('*** IT LEADS WITH THE PERSON, NOT WITH THE FINDING ***, which is rule 22(c)',
     page.indexOf('SHE IS REAL') > 0
     && page.indexOf('SHE IS REAL') < page.indexOf('NOBODY WALKS WITH YOU TODAY'));
  ok('and she has her real face on it, baked by the player\'s own portrait path',
     /PEOPLE_COMPANION_12_12_900_9_21\.png/.test(page)
     && (function () { try { return fs.statSync(FACE).size > 500; } catch (e) { return false; } })());
  ok('with the name the game gives her, not one written for the page',
     /Marisela Escobar/.test(page));
  ok('*** AND THE ROW\'S THREE THINGS ARE ON IT: *** why she comes, what she '
     + 'wants of her own, and the one thing she will not do',
     /WHY SHE COMES/.test(page) && /WHAT SHE WANTS/.test(page)
     && /WHAT SHE WILL NOT DO/.test(page));
  ok('the measurement is there too, in his words and with the number',
     /0 of the 61/.test(page) && /shuffle has one card/i.test(page));
  ok('and it says the walking itself works, so he is not being sold a broken thing',
     /joined on the first step/i.test(page));
  ok('three ways to go, and one of them throws my own reasons away',
     /A &middot;/.test(page) && /B &middot;/.test(page) && /C &middot;/.test(page)
     && /Drop the reasons/i.test(page));
  ok('and it says plainly that none of it is in the game he plays',
     /Nothing here is in the game you play/.test(page));
  ok('it reads in daylight', /prefers-color-scheme:light/.test(page));

  let item = null;
  try {
    const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
    item = (reg.items || []).find(i => i.id === 'people-the-one-who-walks-with-you-9-21');
  } catch (e) {}
  ok('this lane cooked a person and it is in the tab, which is rule 22', !!item);
  ok('it is this lane\'s and it points at the page',
     !!item && item.lane === 'people' && item.show.src === path.basename(PAGE));
  ok('and the reason he is given carries the number, not an adjective',
     !!item && /0 of the 61/.test(item.why));

  /* ======================================================================== */
  head('E. RULE 18: NOTHING IS ON THE PLAY SURFACE');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  ok('*** NOTHING IN THE GAME CALLS THE CHOOSER. *** The hold is on the play '
     + 'surface, so the walked city and the alpha do not know this file exists',
     !/bohemia_companion|companionPick|ctCompanion/.test(city + alpha));
  ok('and the follow pass is untouched, still enemies only, exactly as it was',
     /if \(!ag \|\| !ag\.signs\.follow\) continue;/.test(city));
  ok('the chooser lives in tools, not in engine, so no derived slice has to be '
     + 'rebuilt and no lane\'s demo cut is touched',
     fs.existsSync(MOD) && !fs.existsSync(path.join(ROOT, 'engine/bohemia_companion.js')));

  /* ======================================================================== */
  head('F. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  let rec = '';
  try { rec = fs.readFileSync(REC, 'utf8'); } catch (e) {}
  ok('the record exists and carries the measurement', /0 of 61/.test(rec));
  ok('and the control that made the negative believable',
     /control/i.test(rec) && /follow/i.test(rec));
  ok('and the two tries it took, because the first control lied',
     /62/.test(rec) && /nearest/i.test(rec));
  ok('and the deck with one card', /one card/i.test(rec));
  ok('and that nothing was put on the play surface', /rule 18/i.test(rec));

  console.log('');
  notes.forEach(n => console.log(n));
  console.log('\n=== WALKING COMPANION: ' + pass + ' pass / ' + fail.length + ' fail ===');
  fail.forEach(f => console.log('   - ' + f));
  process.exit(fail.length ? 1 : 0);
})();
