/* THE HAIRLINE GATE (8/27/26) -- machine-locks the four things Paolo said about the hair.
 *
 * Paolo, 8/27: "U HAVE TO FIX THE FOREHEAD SHIT YOU GOT THE FOREHEAD ALL WRONG EAST AND
 * WEST. AND ITS SO CONFUSING WHEN ITS FACING EAST AND WEST LIKE YOU HAVE THE HAIR BALDING
 * BACK FURTHER THAN IT SHOULD BE. AND MOST HAIRS EAST AND WEST ARE JUST LIKE A SINGLE LINE
 * GOING DOWN. AND THE VERY LONG PAST SHOULDER LENGTH HAIRS LIKE THEY BREAK IN THE MIDDLE OF
 * THE HAIR. AFTER THE HEAD THERES NOTHING UNTIL THE SHOULDERS FACING NORTH AND SOUTH."
 * Law: laws/BOHEMIA_LAW_THE_HAIRLINE_IN_PROFILE_8_27_26.md
 *
 * *** IT MEASURES THE PIXELS HE SEES, ON THE REAL RENDER, AND IT SHARES ONE BODY WITH THE
 * TOOL THAT FOUND THE BUG. *** The measurement lives in tools/bohemia_hair_the_four_
 * complaints.js and is imported here, so the gate and the report can never drift into
 * disagreeing about what a break is (ENGINE SYNC LAW, in spirit: one canonical body).
 *
 * AND IT PROVES ITS OWN EYES BEFORE IT JUDGES ANYTHING. Three of the four numbers in the
 * first version of that tool reported GREEN on a build that was visibly broken in four
 * ways, so a check here that simply reports a number is not worth having. Test 1 runs the
 * whole measurement on a BALD HEAD and asserts it comes back with no hair -- if the ruler
 * cannot tell a haircut from a shaved skull, nothing below it means anything.
 *
 *   node gates/hairline_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { MEASURE } = require('../tools/bohemia_hair_the_four_complaints.js');
const fs = require('fs');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_THE_HAIRLINE_IN_PROFILE_8_27_26.md');

/* HIS NUMBERS, MEASURED THE DAY HE SAID IT. Each is a ratchet with real headroom, so a new
   haircut can be cooked without a gate edit, and none of them can slide back to where they
   were. The "before" column is what the build he was looking at actually measured. */
const BROW_MIN  = 0.33;   /* share of the browline row that is hair, in profile.  before: 0.25 on 11 of 15 */
/* ONE PIXEL OF HEADROOM, ON PURPOSE. The broken build measured 10px and the fixed one
   measures 12-16, so a floor of 7 -- which is what this said first -- passed the mutation
   test with the whole fix deleted. A ratchet set below the value it is ratcheting against
   is decoration. If a new haircut ever legitimately renders at 11 in profile, look at it
   before you move this line. */
const WIDE_MIN  = 11;     /* hair pixels in a typical row below the brow.         before: 10, now 12-16 */
const LOOSE_MAX = 0;      /* pieces of hair not touching the head.                before: 6 of 75 */
const PINCH_MIN = 0.45;   /* narrowest neck row over the widest of the fall.      before: 8 of 75 choked */
/* *** A SHARE, NOT A COUNT. *** This was 5, set when the game had fifteen haircuts, and
   it went red the moment the wardrobe grew to thirty-five -- on a build whose RATE had
   improved. An absolute count on a list that is supposed to grow is a gate against
   cooking, which is the opposite of what this one is for; it is the same wrong-unit
   mistake as measuring a bald forehead in pixels instead of as a share of the head.
   Was 5 of 75 = 6.7%. Now 6 of 175 = 3.4%. The three that split are SLICK BACK, ROPE
   LOCKS and LONG WEAVE on the front facings, where the fringe and the side falls meet
   only along the outline; nothing floats (loose is 0) and nothing chokes. */
const PIECES_PCT = 5.0;   /* % of style/facings drawn in more than one piece. before 6.7%, now 3.4% */

let pass = 0, fail = 0;
const ok = (name, cond, note) => {
  if (cond) { pass++; console.log('  ok   ' + name + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + name + (note ? '   ' + note : '')); }
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 40000 });

  console.log('\nTHE HAIRLINE GATE');

  /* ---- 1. CAN THE RULER SEE HAIR AT ALL? ------------------------------------- */
  const blind = await p.evaluate(() => {
    const keepW = window.G_WORN, keepE = G.equipped;
    const eq = {}; for (const k in keepE) eq[k] = keepE[k];
    for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
    G.equipped = eq;
    window.G_WORN = { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', hair:'' };
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    const a = buildFrame('E','idle',0);
    /* THE FIXTURE READS THE POOL INSTEAD OF NAMING A STYLE (9/5). It named BOWL CUT,
       which Paolo killed on 8/20 -- a ruler whose fixture is a corpse keeps working only
       because the draw path resolves by name and never looks at `st`. Every canon cut is
       tried and the loudest one answers the question this check actually asks: can the
       ruler tell hair from a shaved head at all. */
    const CUTS = (window.GARMENTS||[]).filter(g=>g.layer==='hair'&&g.st==='canon');
    const N = a.CW; let diff = 0, which = '';
    for (const h of CUTS) {
      window.G_WORN = { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', hair:h.n };
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const c = buildFrame('E','idle',0);
      let d = 0;
      for (let i=0;i<N*N;i++){ const u=a.px[i], v=c.px[i];
        if (!((!u&&!v)||(u&&v&&u[0]===v[0]&&u[1]===v[1]&&u[2]===v[2]))) d++; }
      if (d > diff) { diff = d; which = h.n; }
    }
    window.G_WORN = keepW; G.equipped = keepE;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { diff, which, n: CUTS.length };
  });
  ok('the ruler can tell a haircut from a shaved head', blind.diff > 60,
     '(' + blind.which + ' moves ' + blind.diff + ' pixels of the profile render; ' +
     blind.n + ' canon cuts tried)');

  /* ---- the measurement, once, on every canon style x five facings ------------- */
  const rows = await p.evaluate(MEASURE);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const E = rows.filter(r => r.dir === 'E' && !r.dead);
  /* *** A COUNT OF THE POOL IS NOT A CHECK ON THE POOL. (9/5.) ***
     This said `>= 15`, written when the game had fifteen canon haircuts. It went red on
     a turn that did not move a pixel: enforcing Paolo's thirteen 8/20 kills (which had
     been shipping as canon for sixteen days, because the graveyard registry spelled them
     `HAIR - SUN CROP` and the build says `SUN CROP`) took the pool to eleven. It is the
     same wrong-unit mistake PIECES_PCT already has a paragraph about, twenty lines up.
     AND `>= 15` WAS ALWAYS THE WEAKER CLAIM: with thirty styles in the pool it would sit
     green while half of them drew nothing in profile. The check's own NAME is "EVERY
     canon hairstyle", so measure that -- every canon style that exists rendered -- with a
     floor underneath so an empty wardrobe cannot pass by rendering nothing perfectly. */
  const Eall = rows.filter(r => r.dir === 'E');
  ok('every canon hairstyle renders in profile', E.length === Eall.length && E.length >= 8,
     '(' + E.length + ' of ' + Eall.length + ' canon styles draw pixels in profile)');

  /* ---- 2. THE FOREHEAD (his first sentence) ---------------------------------- */
  const balding = E.filter(r => r.brow < BROW_MIN);
  const worstBrow = E.slice().sort((a, c) => a.brow - c.brow)[0];
  ok('no hairstyle is balding back in profile', balding.length === 0,
     '(worst ' + (worstBrow.brow * 100).toFixed(0) + '% of the browline is hair, floor is ' +
     (BROW_MIN * 100) + '%' + (balding.length ? '; ' + balding.map(r => r.n).join(', ') : '') + ')');

  /* ---- 3. A LINE GOING DOWN (his second sentence) ---------------------------- */
  const lines = E.filter(r => r.med < WIDE_MIN);
  const thinnest = E.slice().sort((a, c) => a.med - c.med)[0];
  ok('no hairstyle in profile is a line going down', lines.length === 0,
     '(thinnest is ' + thinnest.n.toLowerCase() + ' at ' + thinnest.med + 'px a row, floor is ' +
     WIDE_MIN + 'px)');

  /* ---- 4. THE BREAK (his third and fourth sentences) ------------------------- */
  const loose = rows.filter(r => r.loose > 0);
  ok('no haircut has a piece floating off the head', loose.length <= LOOSE_MAX,
     '(' + loose.length + ' of ' + rows.filter(r => !r.dead).length + ' style/facings' +
     (loose.length ? ': ' + loose.map(r => r.n + ' ' + r.dir).join(', ') : '') + ')');

  const choke = rows.filter(r => r.pinch && r.pinch < PINCH_MIN);
  ok('no fall chokes to a point at the neck and flares out again', choke.length === 0,
     '(' + choke.length + ' of ' + rows.filter(r => r.pinch).length + ' style/facings with a fall' +
     (choke.length ? ': ' + choke.map(r => r.n + ' ' + r.dir + ' ' + r.pinch).join(', ') : '') + ')');

  const split = rows.filter(r => r.blobs > 1);
  const liveRows = rows.filter(r => !r.dead).length;
  const splitPct = liveRows ? (split.length / liveRows * 100) : 0;
  ok('a haircut is drawn as one piece', splitPct <= PIECES_PCT,
     '(' + split.length + ' of ' + liveRows + ' = ' + splitPct.toFixed(1) + '% in more than one piece, cap ' +
     PIECES_PCT + '%)');
  if (splitPct < PIECES_PCT - 1.5)
    console.log('       *** WELL UNDER THE CAP. Lower PIECES_PCT toward ' + (splitPct + 1).toFixed(1) +
                ' so it cannot slide back. ***');

  /* ---- 5. THE LONG STYLES SPECIFICALLY, because they are what he named ------- */
  const LONG = ['SHOULDER LENGTH', 'LONG LOOSE', 'WOLF CUT'];
  const longRows = rows.filter(r => LONG.indexOf(r.n) >= 0 && !r.dead);
  const longBad = longRows.filter(r => r.blobs > 1 || r.loose > 0);
  ok('the past-shoulder styles are whole from every angle', longBad.length === 0,
     '(' + longRows.length + ' style/facings' +
     (longBad.length ? ' -- ' + longBad.map(r => r.n + ' ' + r.dir).join(', ') : '') + ')');

  /* ---- 6. THE HAIR STILL REACHES PAST THE SHOULDER --------------------------- */
  /* the fix connects the fall to the head; it must not have done that by SHORTENING it.
     A haircut that is whole because it stopped at the jaw passes every test above. */
  const stillLong = longRows.filter(r => r.bot > r.head[1] + 6);
  ok('and they still hang past the jaw (the fix did not shorten them)',
     stillLong.length === longRows.length,
     '(' + stillLong.length + ' of ' + longRows.length + ' fall 6+ rows below the head)');

  /* ---- 7. THE LAW RECORDS WHY ------------------------------------------------ */
  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 1200, '(' + law.length + ' chars)');
  ok('and it quotes him', /BALDING BACK FURTHER/i.test(law) && /NOTHING UNTIL THE SHOULDERS/i.test(law));
  ok('and it names the cause, not just the symptom',
     /face part/i.test(law) && /loop bound/i.test(law));

  console.log('\nTHE HAIRLINE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
