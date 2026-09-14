/* ============================================================================
   BOHEMIA THE MOMENT ENDS (9/13/26, PEOPLE lane).

   PAOLO 9/13, five minutes on a phone:
     "it's like this glitchy, buggy AI experience where nothing's complete."
   THE FIVE MINUTES says they hold when, among other things, nothing glitches.

   *** MEASURED ON THE DEMO, WALKING IT LIKE A PLAYER. *** A five-minute walk
   said one thing -- "headlights. nobody in it." -- and it was STILL ON SCREEN
   twenty-nine cells later, over empty street, long after the cab was gone. The
   cab's own words are "Waits its ninety seconds. Pulls off." The sentence
   outlived the car by the entire walk.

   AND THIS LANE ALREADY KNEW BETTER, IN THIS FILE, IN CAPITALS. trackSay solved
   exactly this for its own words: "STEP OFF THE PRINTS AND THE GROUND STOPS
   SAYING THEY ARE THERE ... a line that was true one cell ago and is a lie now,
   which is worse than silence." walkSay and ctAgainstSay never got the same
   treatment: both wrote the shared street line and neither could take it back.

   ONE OWNER FOR PUTTING A MOMENT UP AND TAKING IT DOWN. Three things write that
   element and only one ever cleared. Two of the three had their own copy of
   "set text, set display", so a second clearer with a second opinion about when
   was the obvious next bug. The tracks keep their own rule on purpose -- theirs
   is SPATIAL, step off the prints and it goes, which is right for prints. This
   is the rule for a MOMENT.

   HOW LONG IS NOT A NEW NUMBER: the moment lasts the director's own approved
   gap, MIN_GAP_S, out of his verdict ("~90s min gap"), which is already the
   clock this director paces on. The line is up exactly as long as it takes
   before another moment is allowed.

   WHAT THIS HOLDS:
   A. the street still says the moment, and says it long enough to read
   B. *** AND THE MOMENT ENDS, on the game's own clock, at the approved gap ***
   C. the body in your way comes down too -- same defect, same fix, one owner
   D. it clears ONLY ITS OWN WORDS, so the tracks' sentence is never eaten
   E. and a new day rewinding the clock does not wipe a fresh line

   node gates/the_moment_ends_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
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
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

(async () => {
  head('A. THE LENGTH IS THE DIRECTOR\'S OWN, NOT A NEW NUMBER');
  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);
  ok('the moment lasts the approved gap, read off the encounter module rather than typed here',
    /BohemiaEncounters\.MIN_GAP_S/.test(city));
  ok('and that gap is his verdict\'s own figure where the director keeps it',
    /var MIN_GAP_S = 90;\s*\/\/ "~90s min gap"/.test(cityRaw));
  probe('the derived-length claim rejects a duration picked here',
    !/BohemiaEncounters\.MIN_GAP_S/.test('var gap = 4000;'));

  head('B. EVERY WRITER OF THE SHARED LINE TAKES ITS OWN WORDS BACK');
  /* *** AND EACH ONE HAS THE RULE THAT SUITS THE THING IT DESCRIBES, which is
     the shape this claim settled on rather than the one it started with. My
     first cut routed the blocked-body line through THIS timer. Another lane
     fixed that same line the same round with a STATE rule -- it clears when
     nobody is in your way any more -- and theirs is right: a person who is still
     standing there has not stopped being true after ninety seconds. So:
       the tracks     SPATIAL   step off the prints and they go
       the body       STATE     nobody in your way any more and it goes
       the moment     TIME      a cab that drove off has no state left to check
     ONE OWNER PER LINE, NOT ONE RULE FOR ALL LINES. What must hold for every one
     of them is the same: it takes back ITS OWN WORDS and nobody else's, because
     the line is shared and eating somebody else's sentence is the worse bug.
     That lane's write-up found the half I had not: one writer that does not tidy
     up SILENCES every writer that does, because the tidy ones correctly refuse
     to clear text they did not write. */
  ok('the walked moment can take its own words back',
    /function streetSay\(/.test(city)
      && /function walkSay\([\s\S]{0,400}streetSay\(/.test(city)
      && /function walkSayTick\(/.test(city));
  ok('...the body in your way can take its own back, on the rule that suits a person who is still standing there',
    /function ctAgainstClear\(/.test(city)
      && /_againstWrote/.test(city));
  ok('...and the tracks keep theirs, which is spatial and right for prints',
    /_trackWrote && l\.textContent===_trackWrote/.test(city));
  ok('EVERY ONE OF THEM CLEARS ONLY ITS OWN WORDS, which is what makes three rules on one line safe',
    /l\.textContent !== _walkWrote/.test(city)
      && /l\.textContent === _againstWrote/.test(city)
      && /l\.textContent===_trackWrote/.test(city));
  probe('the own-words claim rejects a clearer that wipes the line whatever it says',
    !/l\.textContent !== _walkWrote/.test("l.textContent=''; l.style.display='none';"));

  head('C. AND IT IS TRUE ON THE DEMO HE PLAYS');
  let R = null, driveErr = null;
  try {
    const D = require(DRIVE);
    const d = await D.open();
    /* PROVE THE INSTRUMENT CAN PRODUCE A POSITIVE FIRST. This round alone, five
       probes returned a clean "nothing happened" and every one of them was the
       instrument. A gate that cannot show the thing working cannot show it
       broken either. */
    const pads = await d.fr.evaluate(() =>
      [...document.querySelectorAll('#pad .pb')].map(el => {
        const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }));
    const s0 = await d.state();
    if (pads.length) { await d.tapAt(pads[1].x, pads[1].y); await d.page.waitForTimeout(400); }
    const s1 = await d.state();
    R = { padMoved: (s1.hx !== s0.hx || s1.hy !== s0.hy), pads: pads.length };
    Object.assign(R, await d.fr.evaluate(() => {
      const o = {};
      const L = () => document.getElementById('packline');
      const up = () => { const l = L(); return !!l && getComputedStyle(l).display !== 'none' && !!l.textContent; };
      const gap = BohemiaEncounters.MIN_GAP_S;
      o.gap = gap;
      /* C1. the walked moment.
         *** THIS GATE NEVER CALLS walkSayTick. *** The first cut did, and the
         negative control PROVED IT WORTHLESS: I deleted the call that ticks it
         from the game and the gate stayed green, because it was driving my
         function instead of the game's path. That is the same defect COMBAT
         wrote up this same round -- a green produced by something other than the
         thing you claim to be testing. So the game does the ticking here, and
         the only thing this does is spend its clock and look. */
      walkSay({ id: 'ghost_robotaxi' });
      o.said = L().textContent; o.upAtOnce = up();
      const at = T.min; const trail = [];
      for (let i = 0; i < 8; i++) {
        T.min += gap / 60 / 6;
        try { dayDistrictCheck(); } catch (e) { o.tickPathThrew = String(e).slice(0, 70); }
        trail.push({ secs: Math.round((T.min - at) * 60), up: up() });
      }
      o.trail = trail;
      o.staysToBeRead = trail.length ? trail[0].up : false;
      o.goneBy = trail.filter(t => !t.up).length > 0;
      o.lastUp = Math.max(...trail.filter(t => t.up).map(t => t.secs).concat([0]));
      o.firstGone = Math.min(...trail.filter(t => !t.up).map(t => t.secs).concat([99999]));
      /* C2. the body in your way, on ITS rule rather than this one. Driven
         through the game's own clear, never through a copy of it here. */
      ctAgainstSay();
      o.blockUp = up(); o.blockText = L().textContent;
      /* THROUGH THE GAME'S OWN CALL, not a copy of it. Driving ctAgainstClear
         directly left this claim green when the call the GAME makes was deleted
         -- the same worthless shape the moment claim above was caught in one
         paragraph earlier. Both clears live in dayDistrictCheck, so that is the
         door. */
      try { dayDistrictCheck(); } catch (e) { o.blockClearThrew = String(e).slice(0, 70); }
      o.blockGone = !up();
      /* C3. somebody else's sentence is never eaten */
      walkSay({ id: 'coyote_shadow' });
      L().textContent = 'Anarchists came through here just now';
      T.min += gap / 60 + 0.01;
      try { dayDistrictCheck(); } catch (e) {}
      o.otherSurvives = L().textContent === 'Anarchists came through here just now';
      /* C4. a new day rewinds the clock and must not wipe a fresh line */
      L().textContent = ''; L().style.display = 'none';
      walkSay({ id: 'rattlesnake' });
      T.min -= 500;
      try { dayDistrictCheck(); } catch (e) {}
      o.survivesRewind = up();
      return o;
    }));
    R.pageErrors = d.errs.length;
    await d.close();
  } catch (e) { driveErr = String(e).slice(0, 150); }

  ok('the demo booted and the walked street answered', !!R, driveErr || 'ok');
  if (R) {
    ok('THE INSTRUMENT CAN PRODUCE A POSITIVE: one tap on the pad moves him, so a negative below means something',
      R.padMoved === true, `${R.pads} pad buttons`);
    ok('the street still says the moment when one happens',
      R.upAtOnce === true, JSON.stringify(R.said));
    ok('and it stays up to be read -- a moment that vanishes on the next step is the same bug the other way',
      R.staysToBeRead === true);
    ok('*** AND THE MOMENT ENDS. *** It came down on the game\'s own clock instead of riding the rest of the walk',
      R.goneBy === true, `up to +${R.lastUp}s, gone by +${R.firstGone}s`);
    ok('...at the director\'s approved gap and not before it',
      R.lastUp >= R.gap * 0.7 && R.firstGone <= R.gap * 1.3,
      `gap ${R.gap}s, last seen +${R.lastUp}s, gone +${R.firstGone}s`);
    notes.push('the line: ' + R.trail.map(t => `${t.secs}s:${t.up ? 'up' : 'gone'}`).join(' '));
    ok('THE BODY IN YOUR WAY COMES DOWN TOO, on its own rule: it is said while somebody is there and gone once nobody is',
      R.blockUp === true && R.blockGone === true,
      JSON.stringify(R.blockText));
    ok('*** AND IT ONLY EVER CLEARS ITS OWN WORDS. *** The street line is shared, and eating the tracks\' sentence would be a worse bug than the one this fixes',
      R.otherSurvives === true);
    ok('a new day rewinding the clock does not wipe a line that was just said',
      R.survivesRewind === true);
    ok('and nothing threw on the page', R.pageErrors === 0, 'page errors ' + R.pageErrors);
  }

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== THE MOMENT ENDS: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
