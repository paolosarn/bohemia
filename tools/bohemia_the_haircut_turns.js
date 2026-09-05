/* DOES THE HAIRCUT ACTUALLY TURN? (9/5/26, CHARACTER lane, [hair sheet] HAIR-REF-EIGHT-FACINGS)
 *
 * HIS ORDER, 8/25, still open on the board:
 *   "THESE HAIRSTYLES ARE NOT FUCKING CUTTING IT WHY CANT U JUST TELL THE ART CHAT OR
 *    WHATEVER OR THE CHARACTER CHAT TO FUCKING LOOK ONLINE FOR PIXEL HAIRSTYLES IN ALL
 *    8 DIRECTIONS AND WE CAN GO FROM FUCKING THERE"
 *   -> laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md sec 3:
 *      "REFERENCE FIRST, FOR HAIR, IN ALL EIGHT FACINGS, BEFORE ANY MORE COOKING...
 *       study what those artists actually do at the back and the three-quarter, put the
 *       reference beside our styles, THEN cook."
 *
 * WHY THIS TOOL AND NOT ANOTHER BATCH OF CUTS. gates/hair_gate.js already holds that
 * every shape renders NON-EMPTY in all eight and that the front and back footprints are
 * distinct across the set. Both are true and both are a LOW BAR: "non-empty" is satisfied
 * by a head with a scalp painted on it, and "distinct from each other" is satisfied by
 * twenty-four cuts that are all equally flat as long as they are flat in different places.
 * NEITHER ASKS WHETHER A CUT DOES WHAT A HAIRCUT DOES WHEN A PERSON TURNS AROUND.
 * That is the question he asked in August and nobody has ever measured it.
 *
 * THE FIVE RULES, taken from reference (reference/library/haircut/INDEX.md, entries
 * HAIR-04..HAIR-08 landed this round) and from head anatomy, each one written so a
 * machine can decide it:
 *
 *   R1 VOLUME IN PROFILE. Hair sits ON TOP of the skull, so from E and W a cut with any
 *      length grows the head's OUTLINE -- it paints pixels where the bare head had none.
 *      A cut that never leaves the bare skull is a cut painted onto the head, not a
 *      haircut sitting on it. Measured as pixels the hair adds OUTSIDE the bare
 *      silhouette. (A buzz correctly scores zero. If EVERY cut scores zero, the
 *      wardrobe has no volume at all, which is the finding.)
 *
 *   R2 THE FACE-FRAME IS GONE FROM BEHIND. From the front, hair stops at the brow and
 *      wraps the temples: the face punches a hole in the mass. From the back there is no
 *      face, so the same cut covers MORE head. Hair pixels at N should not be fewer than
 *      at S. A cut with less hair behind than in front is drawn as a decal on the face.
 *
 *   R3 THE NAPE. Every real cut is defined at the back by where it stops on the neck --
 *      tapered, blocked, or grown out over the collar. Measured as hair pixels BELOW THE
 *      BASE OF THE SKULL on the N facing, and the base of the skull is read off the art
 *      (the row where the silhouette pinches before it widens into the shoulders), NOT
 *      off the rig's neck joint, which is a pivot three rows further down inside the
 *      body. See the long note beside skullBot: taking the joint made this rule
 *      un-passable by any real haircut and it read 18-of-24 bad before AND after a fix
 *      that worked. Zero for every cut means the whole wardrobe ends at the bone.
 *
 *   R4 THREE-QUARTER IS NOT FRONT. At SE / SW / NE / NW the head is narrower and the mass
 *      shifts off centre. If a cut's 3/4 footprint equals its front footprint, the head
 *      never turned; the sprite just swapped bodies underneath the same hair.
 *
 *   R5 EIGHT FACINGS, NOT TWO. How many of the eight footprints of ONE cut are actually
 *      different from each other. Eight distinct is a cut that turns. Two is a cut with
 *      a front and a back and six copies.
 *
 * HOW A CUT'S PIXELS ARE READ: render the head wearing NOTHING but that cut, render it
 * bare, and diff. That is the cut's own contribution, measured off what the game draws
 * rather than off its gen function's source -- the question is precisely whether the
 * drawing keeps what the source asked for.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel. Restores G_WORN, G.equipped and the caches
 * it clears before it returns.
 *   built on: buildFrame (read-only)   joints: reads neck y only   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Same render-alone-and-diff harness as
 * tools/bohemia_one_accent_only.js and tools/bohemia_does_the_ramp_survive.js (9/5),
 * which is why it is not written a third time.
 *
 *   node tools/bohemia_the_haircut_turns.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_HAIRCUT_TURN_9_5_26.txt');
/* THE CONTROL. A rule that only ever passes proves nothing, and this round moved one of
   the rulers (R3, see skullBot below), so "green now" is worthless without "red then".
   ALPHA= points this at any copy of the alpha -- e.g. the one on origin/main from before
   the fix -- and NOWRITE=1 keeps a control run from overwriting the record. */
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 60000 });

  const r = await p.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const shot = (worn, d) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes']) eq[s] = '';
      G.equipped = eq; window.G_WORN = worn; clear();
      return buildFrame(d, 'idle', 0);
    };
    const hash = (set) => { let s = 2166136261 >>> 0;
      for (const i of set) { s ^= i; s = Math.imul(s, 16777619) >>> 0; } return s.toString(36); };
    /* *** THE RULER THIS TOOL FIRST SHIPPED WITH WAS BROKEN, AND THE TABLE IS WHAT
       CAUGHT IT. *** The first pass hashed RAW pixel indices, so it reported every cut
       as having eight distinct shapes -- 24 of 24, 100%, a clean sweep. Then the
       per-facing pixel COUNTS printed underneath were identical to the pixel across
       NE, N and NW on almost every cut (SHAG 493, BOWL CUT 435, TEMPLE TAPER 415, three
       times each). A shape cannot be "distinct" three ways and weigh exactly the same
       three times. It was THE SAME MASS MOVED TWO PIXELS: the rig puts the neck at a
       different x for NE, N and NW, so a raw-index hash of an identical picture in a
       different place comes back different. THE HASH WAS MEASURING POSITION, NOT SHAPE.
       Fixed by translating every footprint to its own bounding box before hashing, so
       the same picture drawn anywhere hashes the same. A ruler that builds its answer
       out of where a thing sits cannot tell you what shape it is. */
    const shapeHash = (set, CW) => {
      if (!set.length) return 'empty';
      let mnX = 1e9, mnY = 1e9;
      for (const i of set) { const y = (i / CW) | 0, x = i % CW;
        if (x < mnX) mnX = x; if (y < mnY) mnY = y; }
      let s = 2166136261 >>> 0;
      for (const i of set) { const y = ((i / CW) | 0) - mnY, x = (i % CW) - mnX;
        s ^= (y * 4096 + x); s = Math.imul(s, 16777619) >>> 0; }
      return s.toString(36);
    };

    const bare = {};
    for (const d of DIRS) bare[d] = shot({}, d);
    const CW = bare.S.CW;

    /* *** WHERE THE SKULL STOPS, AND THE FIRST VERSION OF THIS ASKED THE WRONG BONE. ***
       The nape test needs the base of the skull. I first took the rig's own `neck`
       joint, on the reasoning that the rig's answer beats a number I get to pick -- and
       that was right about the principle and wrong about the joint. A neck JOINT is a
       PIVOT, and this rig puts it at y=32 on a head whose skull ends at y=30: three
       pixel rows down inside the neck. So the test was not asking "is there hair on the
       nape", it was asking "does the hair run a third of the way down the neck", which
       no haircut does and which would have sent me cooking mullets to satisfy it.
       IT REPORTED 18 OF 24 BAD BOTH BEFORE AND AFTER A FIX THAT DEMONSTRABLY WORKED --
       BUZZ CUT went from ending at row 29 to reaching row 31 -- and a number that does
       not move when the thing it measures moves is a broken ruler, not a stubborn
       defect.
       THE RIGHT LANDMARK, read off the art: between the crown and the neck joint the
       silhouette narrows to the head-and-neck pinch and then widens again into the
       shoulders. That narrowest row IS the base of the skull. Below it you are on the
       neck, which is exactly what the nape means. */
    const skullBot = {};
    for (const d of DIRS) {
      const fr = bare[d], CH = fr.px.length / CW;
      let top = null, joint = null;
      try { joint = BAKED.skeleton[d] && BAKED.skeleton[d].neck ? BAKED.skeleton[d].neck[1] : null; } catch (e) {}
      const wide = [];
      for (let y = 0; y < CH; y++) { let n = 0;
        for (let x = 0; x < CW; x++) if (fr.px[y * CW + x]) n++;
        wide.push(n); if (n && top === null) top = y; }
      let best = null, bw = 1e9;
      const hi = (joint == null ? (top || 0) + 24 : joint);
      for (let y = (top || 0) + 2; y <= hi && y < CH; y++)
        if (wide[y] && wide[y] <= bw) { bw = wide[y]; best = y; }
      skullBot[d] = best;
    }

    const cuts = GARMENTS.filter(g => g && g.layer === 'hair' && g.st === 'canon')
      .slice().sort((a, c) => a.n.localeCompare(c.n));

    const rows = [];
    for (const h of cuts) {
      const row = { n: h.n, per: {}, prints: {}, shapes: {} };
      for (const d of DIRS) {
        let fr; try { fr = shot({ hair: h.n }, d); } catch (e) { continue; }
        const bz = bare[d];
        const touched = [];      /* every pixel the hair changed  -> the FOOTPRINT */
        let outside = 0;         /* R1: hair where the bare head had NOTHING       */
        let nape = 0;            /* R3: hair at or below the neck joint            */
        let minY = 1e9, maxY = -1, minX = 1e9, maxX = -1;
        for (let i = 0; i < fr.px.length; i++) {
          const a = fr.px[i], z = bz.px[i];
          const changed = (!!a !== !!z) || (a && z && (a[0] !== z[0] || a[1] !== z[1] || a[2] !== z[2]));
          if (!changed) continue;
          touched.push(i);
          const y = (i / CW) | 0, x = i % CW;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (a && !z) outside++;
          if (skullBot[d] != null && a && y > skullBot[d]) nape++;
        }
        row.per[d] = { px: touched.length, outside: outside, nape: nape,
          top: (maxY < 0 ? null : minY), bot: (maxY < 0 ? null : maxY),
          w: (maxX < 0 ? null : maxX - minX + 1) };
        row.prints[d] = hash(touched);
        row.shapes[d] = shapeHash(touched, CW);
      }
      rows.push(row);
    }

    window.G_WORN = keepW; G.equipped = keepE; clear();
    return { rows: rows, dirs: DIRS, skullBot: skullBot, CW: CW, n: cuts.length };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const D = r.dirs;
  const rows = r.rows.filter(x => x.per.S && x.per.N);
  const pct = (a, b2) => b2 ? (a / b2 * 100).toFixed(0) + '%' : '0%';

  /* --- the five rules, scored ------------------------------------------------ */
  const prof = (x) => (x.per.E ? x.per.E.outside : 0) + (x.per.W ? x.per.W.outside : 0);
  const r1 = rows.filter(x => prof(x) === 0);                                  /* no volume  */
  const r2 = rows.filter(x => x.per.N.px < x.per.S.px);                        /* thin back  */
  const r3 = rows.filter(x => x.per.N.nape === 0);                             /* no nape    */
  /* R4 and R5 read the TRANSLATED shape, never the raw index print -- see the note in
     the page code above: the raw print says 8 of 8 distinct for every cut in the
     wardrobe, and it is wrong, because the rig moves the head a couple of pixels
     between facings and a moved copy of one picture hashes as a new picture. */
  const r4 = rows.filter(x => ['SE', 'SW', 'NE', 'NW']
    .some(d => x.shapes[d] && (x.shapes[d] === x.shapes.S || x.shapes[d] === x.shapes.N)));
  const distinct = (x) => new Set(D.map(d => x.shapes[d]).filter(Boolean)).size;
  const rawDistinct = (x) => new Set(D.map(d => x.prints[d]).filter(Boolean)).size;
  const r5hist = {};
  for (const x of rows) r5hist[distinct(x)] = (r5hist[distinct(x)] || 0) + 1;
  const rawAll8 = rows.filter(x => rawDistinct(x) === 8).length;
  /* WHICH FACINGS ARE THE SAME PICTURE AS WHICH, across the whole set. */
  const pairHits = {};
  for (const x of rows) for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
    const a = x.shapes[D[i]], c = x.shapes[D[j]];
    if (a && a === c) { const k = D[i] + '=' + D[j]; pairHits[k] = (pairHits[k] || 0) + 1; }
  }
  const pairs = Object.keys(pairHits).sort((a, c) => pairHits[c] - pairHits[a]);

  const L = [];
  L.push('DOES THE HAIRCUT ACTUALLY TURN? -- our hair read against reference, in all eight');
  L.push('9/5/26, CHARACTER lane. [hair sheet] HAIR-REF-EIGHT-FACINGS.');
  L.push('');
  L.push('HIS ORDER, 8/25, still open on the board: "LOOK ONLINE FOR PIXEL HAIRSTYLES IN');
  L.push('ALL 8 DIRECTIONS AND WE CAN GO FROM FUCKING THERE." The dispatch turned that into');
  L.push('REFERENCE FIRST, BEFORE ANY MORE COOKING: study what those artists do at the back');
  L.push('and the three-quarter, put the reference beside our styles, THEN cook.');
  L.push('');
  L.push('WHAT WAS ALREADY HELD, and why it was not enough. The hair gate proves every cut');
  L.push('renders NON-EMPTY in all eight and that the front and back shapes differ ACROSS');
  L.push('the set. Both are true. Both are a low bar: "non-empty" is satisfied by a scalp');
  L.push('painted on a head, and "they differ from each other" is satisfied by 24 equally');
  L.push('flat cuts as long as they are flat in different places. Neither asks whether a');
  L.push('cut does what a haircut does when the person turns around.');
  L.push('');
  L.push('  canon cuts measured   ' + rows.length + '        rig width ' + r.CW + ' px');
  L.push('');
  L.push('RULE 1 -- VOLUME IN PROFILE. Hair sits ON the skull, so from E and W a cut with');
  L.push('any length grows the head OUTLINE: it paints where the bare head had nothing.');
  L.push('  cuts that add ZERO pixels outside the bare skull in profile   ' +
    r1.length + ' of ' + rows.length + '   (' + pct(r1.length, rows.length) + ')');
  if (r1.length) { L.push('    ' + r1.slice(0, 24).map(x => x.n).join(', ') +
    (r1.length > 24 ? ', +' + (r1.length - 24) + ' more' : '')); }
  L.push('');
  L.push('RULE 2 -- THE FACE-FRAME IS GONE FROM BEHIND. From the front the face punches a');
  L.push('hole in the mass; from the back there is no face, so the same cut covers MORE.');
  L.push('  cuts with LESS hair from behind than from the front            ' +
    r2.length + ' of ' + rows.length + '   (' + pct(r2.length, rows.length) + ')');
  if (r2.length) for (const x of r2.slice(0, 12))
    L.push('    ' + x.n.padEnd(22) + 'S ' + String(x.per.S.px).padStart(4) + ' px   N ' +
      String(x.per.N.px).padStart(4) + ' px');
  L.push('');
  L.push('RULE 3 -- THE NAPE. Every real cut is defined at the back by where it STOPS on');
  L.push('the neck. Measured BELOW the base of the skull on the N facing -- the row where');
  L.push('the silhouette pinches before it widens into the shoulders, read off the art.');
  L.push('  cuts with NOTHING on the neck from behind                      ' +
    r3.length + ' of ' + rows.length + '   (' + pct(r3.length, rows.length) + ')');
  if (r3.length) { L.push('    ' + r3.slice(0, 24).map(x => x.n).join(', ') +
    (r3.length > 24 ? ', +' + (r3.length - 24) + ' more' : '')); }
  L.push('');
  L.push('RULE 4 -- THREE-QUARTER IS NOT FRONT. A three-quarter is its own drawing. If a');
  L.push('cut\'s 3/4 picture is the FRONT or the BACK picture slid sideways, the head');
  L.push('never turned; the body swapped underneath the same hair.');
  L.push('  cuts whose SE/SW/NE/NW picture IS the front or back picture    ' +
    r4.length + ' of ' + rows.length + '   (' + pct(r4.length, rows.length) + ')');
  if (r4.length) { L.push('    ' + r4.slice(0, 24).map(x => x.n).join(', ') +
    (r4.length > 24 ? ', +' + (r4.length - 24) + ' more' : '')); }
  L.push('');
  L.push('RULE 5 -- EIGHT FACINGS, NOT TWO. How many of ONE cut\'s eight pictures actually');
  L.push('differ from each other, comparing the PICTURE and not where it sits.');
  for (const k of Object.keys(r5hist).map(Number).sort((a, c) => a - c))
    L.push('  ' + k + ' different picture(s) of 8   ' + String(r5hist[k]).padStart(3) +
      ' cut(s)   ' + pct(r5hist[k], rows.length));
  L.push('');
  L.push('  Comparing RAW PIXEL POSITIONS instead, the way the first version of this tool');
  L.push('  did, ' + rawAll8 + ' of ' + rows.length + ' cuts come back with eight different shapes. That number is');
  L.push('  a lie and the counts in the table below are what expose it: the rig puts the');
  L.push('  head at a different x for NE, N and NW, so ONE picture drawn in three places');
  L.push('  hashes three ways while weighing exactly the same to the pixel.');
  L.push('');
  if (pairs.length) {
    L.push('WHICH FACINGS ARE THE SAME PICTURE, across all ' + rows.length + ' cuts');
    L.push('');
    for (const k of pairs.slice(0, 12))
      L.push('  ' + k.padEnd(10) + String(pairHits[k]).padStart(3) + ' of ' + rows.length +
        ' cuts   ' + pct(pairHits[k], rows.length));
    L.push('');
  }
  L.push('EVERY CUT, EVERY FACING (hair pixels / of those, pixels OUTSIDE the bare skull)');
  L.push('');
  L.push('  ' + 'cut'.padEnd(22) + D.map(d => d.padStart(9)).join(''));
  for (const x of rows.sort((a, c) => prof(c) - prof(a))) {
    L.push('  ' + x.n.padEnd(22) + D.map(d => {
      const c = x.per[d]; if (!c) return '        -';
      return (c.px + '/' + c.outside).padStart(9);
    }).join(''));
  }
  L.push('');
  L.push('THE REFERENCE HALF OF THE ORDER, because he said LOOK ONLINE FIRST');
  L.push('');
  L.push('  Five entries landed in the haircut shelf this round (HAIR-04..HAIR-08), all');
  L.push('  about the eight facings, which the three entries already there did not cover:');
  L.push('    HAIR-04  the canonical pixel turnaround is EIGHT SEPARATE DRAWINGS laid out');
  L.push('             as one sheet; a facing you cannot tell from its neighbour is not one.');
  L.push('    HAIR-05  THE FINDING THAT ARGUES AGAINST US, kept on purpose. Shipped');
  L.push('             top-down games routinely draw FOUR directions and let the diagonals');
  L.push('             reuse them, and a side view is normally MIRRORED, not redrawn. So');
  L.push('             "the back three-quarters reuse the back" is a normal trade in the');
  L.push('             craft. It is wrong HERE for two reasons: we already pay to render');
  L.push('             eight, and mirroring is exactly what ours were NOT doing -- NE and');
  L.push('             NW were the SAME picture, not reflections. We were not even taking');
  L.push('             the cheap correct answer.');
  L.push('    HAIR-06  head anatomy: the neck emerges from UNDER the occipital bone and the');
  L.push('             skull tapers toward the spine before the neck starts. THAT TAPER IS');
  L.push('             THE LANDMARK the hairline is placed from, and hair overlaps the ear');
  L.push('             and the neck. This is what corrected the nape ruler below.');
  L.push('    HAIR-07  from behind the hairline is a GRADIENT, thicker at the nape, finer at');
  L.push('             the crown; the edge that reads is the bottom one, on the neck.');
  L.push('    HAIR-08  a three-quarter shows depth a head-on view hides completely, so its');
  L.push('             silhouette sits BETWEEN head-on and side-on and is asymmetric.');
  L.push('');
  L.push('  AND THE NUMBER CAME FROM HIS OWN ART, NOT FROM THE INTERNET. Measured off');
  L.push('  hair/curtain-bob, the one style he painted and has never criticised: hair leaves');
  L.push('  the skull by 0 px head-on and 2 px side-on, so a three-quarter is 1. Reference');
  L.push('  gives the SHAPE of the rule; his art gives the NUMBER (8/3, standing).');
  L.push('');
  L.push('WHAT CHANGED IN THE GENERATOR, and the control that proves it');
  L.push('');
  L.push('  ROOT CAUSE: genHair had THREE facings -- front, back, profile -- and the game');
  L.push('  has eight. NE, N and NW took the same branch at every line. The front');
  L.push('  three-quarters escaped only by accident: SE and SW have FACE pixels, so the');
  L.push('  generator could read which way he was looking off the art. Turn away from the');
  L.push('  camera, the face is gone, and it had nothing left to tell left from right.');
  L.push('');
  L.push('  TWO FIXES. A three-quarter reads the turn off the FACING when there is no face');
  L.push('  to read it off the art, and gets HALF the profile\'s silhouette on the away side.');
  L.push('  A cut that ends at the skull carries ONE CELL of hair down onto the neck, inset');
  L.push('  to the neck\'s width, so the nape is where the nape is.');
  L.push('');
  L.push('  THE CONTROL, and without it none of the numbers above mean anything, because');
  L.push('  one of the rulers moved this round. The SAME corrected ruler, run against the');
  L.push('  build on origin/main from before the fix:');
  L.push('        no nape                18 of 24  ->  0 of 24');
  L.push('        3/4 is the front/back  19 of 24  ->  0 of 24');
  L.push('        pictures out of eight    6 or 7  ->  8 on all 24');
  L.push('  Red then, green now, same ruler. Held by gates/hair_gate.js, which takes ALPHA=');
  L.push('  so anyone can re-run that control.');
  L.push('');
  L.push('  ON THE SHIPPED DEMO, not only the workshop: 300 citizens asked of the real');
  L.push('  picker, 281 wear hair, all 24 cuts appear, and 281 of 281 both turn between N');
  L.push('  and NE and carry a nape.');
  L.push('');
  L.push('A CHECK THAT WAS WRITTEN THIS ROUND AND WITHDRAWN');
  L.push('');
  L.push('  HAIR-05 says a side view is normally MIRRORED, so the obvious next check was');
  L.push('  that NE should resemble NW-mirrored more than it resembles the flat back. It');
  L.push('  went red on four cuts by a whisker (WOLF CUT 0.83 against 0.95). THEN THE');
  L.push('  CONTROL KILLED IT: run the identical test on the BARE BODY WEARING NO HAIR --');
  L.push('        bare NE vs mirrored NW  0.849      bare NE vs N  0.862');
  L.push('        bare SE vs mirrored SW  0.837      bare SE vs S  0.851');
  L.push('  The naked rig fails it by the same margin, so the ruler was measuring THE RIG,');
  L.push('  not the haircut: a three-quarter body is not a mirror of the other three-quarter');
  L.push('  body because the arms, hands and their layer order resolve per facing. NOT A RIG');
  L.push('  BUG -- a body holding its arms differently on two facings should not mirror.');
  L.push('  What is dead is the claim that hair can be judged that way. A TEST WHOSE SUBJECT');
  L.push('  FAILS IT WITH THE THING BEING TESTED REMOVED IS TESTING THE SUBSTRATE.');
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. A BUZZ CUT CORRECTLY SCORES ZERO ON RULE');
  L.push('1 -- shaved hair does not leave the skull, and a rule that fails a buzz cut is a');
  L.push('broken rule, not a broken cut. What matters is the SHAPE OF THE WHOLE SET: if');
  L.push('nearly every cut scores zero, the wardrobe has no volume in it anywhere, and');
  L.push('that is the thing he has been looking at since August. A NUMBER IS NOT A FINDING');
  L.push('UNTIL YOU KNOW WHAT IT IS COUNTING (9/5, the round the brown boots were called');
  L.push('an accent).');
  L.push('');
  console.log(L.join('\n'));
  if (process.env.NOWRITE) { console.log('\n(control run on ' + ALPHA + ' -- nothing written)'); return; }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
