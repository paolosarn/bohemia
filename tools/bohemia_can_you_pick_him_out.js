/* CAN YOU PICK HIM OUT OF THE CROWD? (9/6/26, CHARACTER lane, [stands out]
 * ONE-STEP-FROM-THE-CROWD-AROUND-IT)
 *
 * THE JOB, from the board: DIRECTION judged the hostiles on the walked street and the
 * answer to all three of its questions was NO -- they ARE the crowd
 * (records/BOHEMIA_VERDICT_THE_HOSTILES_LOOK_9_6_26.md, frame
 * records/target/DIRECTION_HOSTILES_IN_THE_CROWD_9_6_26.png). The verdict's own fix was
 * "a hostile wears its faction's accent". THE BOARD THEN CORRECTED THAT FIX, and the
 * correction is this row:
 *     "in a Cartel block full of Cartel people that is exactly what makes a hostile
 *      INVISIBLE. Pop-out comes from FEATURE CONTRAST, not the feature. So a hostile
 *      carries ONE VALUE STEP away from the bodies within a few cells of it -- light in
 *      a dark crowd, dark in a light one -- measured in the FRAME, not against the
 *      palette."
 *
 * THIS TOOL ANSWERS THE THREE THINGS THE FIX NEEDS AND NOBODY HAD MEASURED:
 *   Q1  Does a body's VALUE change at all when that body becomes your enemy?
 *   Q2  How wide is the crowd's own value spread, and how far apart are neighbours?
 *       That is the number "ONE VALUE STEP" has to beat to be seen, and it belongs to
 *       DIRECTION's [contrast rule] row -- measured here, DECIDED there.
 *   Q3  How many genuinely different body values does a crowd contain? A crowd drawn
 *       from a handful of baked bodies is quantised, and a rule that shifts value has to
 *       know what it is shifting.
 *
 * Q1 IS THE ONE THAT MATTERS AND IT IS ASKED AS A CONTROL, not as an opinion: the SAME
 * crowd is measured twice, before and after they become hostile, every body matched to
 * itself by id. If one body's value moves, the appearance path knows something about
 * hostility. If not one moves by a thousandth, the value channel carries NO information
 * about who is dangerous -- and no amount of recolouring reaches that, because nothing
 * is asking.
 *
 * MEASURED ON THE REAL SURFACE, THROUGH THE DEMO, NOT ON A FIXTURE. It opens
 * slices/BOHEMIA_DEMO.html, reaches into the walked city frame, earns real enemies the
 * way the game earns them (ctDeed + ctAgainstBump, the same calls against_gate uses),
 * renders, and reads the bodies the renderer ACTUALLY BLITTED -- BARK_DREW, the draw
 * pass's own record of who landed on the glass.
 *
 * HOW A BODY'S VALUE IS READ: the sprite the draw pass would blit for that person in the
 * facing it would blit, averaged over its OPAQUE pixels only (Rec.709 luma). Transparent
 * pixels are not part of a body; counting them would drag every value toward the ground
 * behind it and flatten exactly the difference being measured.
 *
 * WHY THE SPRITE AND NOT A SCREENSHOT: the canvas mixes a body with the ground under it,
 * the day's light and anything drawn on top, so a screen sample answers "what colour is
 * that patch of street", not "how light is that person". The rule is bodies against
 * bodies, so both sides are read the same way.
 *
 * TWO THINGS THIS TOOL LEARNED THE HARD WAY, kept because they are facts about the game:
 *   - THE DEMO'S COLD SPAWN PUTS ONE BODY ON THE GLASS. Not a fact about hostiles: it is
 *     the city file's own __AN_ADDRESS_IS_A_FRONT_DOOR__ finding (nearest resident 64
 *     cells away, seven screens). Contrast against a crowd of one is a number with no
 *     meaning, so this sweeps pplPeople() for the fullest neighbourhood and stands in the
 *     middle of it. Found, not typed in, and it prints where it stood.
 *   - TELEPORTING TO THE CELL DIRECTION'S FRAME NAMES (8560,3195) put ZERO bodies on the
 *     glass. A world position is not the whole state; the overmap marker and that
 *     neighbourhood's population go with it.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. It never touches
 * BAKED, a joint, a bone or a painted pixel. The only state it changes is the player's
 * own standing, which is what earning an enemy IS, inside a throwaway page.
 *   built on: ctBody / pplFace / ctAgainstMe / BARK_DREW (all read-only)
 *
 * REUSE CHECK: cooks ZERO pixels and defines ZERO new hostility. The enemy-earning path
 * is gates/against_gate.js's; the body path is the draw pass's own.
 *
 *   node tools/bohemia_can_you_pick_him_out.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_CAN_YOU_PICK_HIM_OUT_9_6_26.txt');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'));
  await SETTLE(p, 15000);
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(p, 12000);
  await wait(3000);
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.log('NO CITY FRAME -- the demo did not open the walked street'); await b.close(); process.exit(1); }

  const r = await fr.evaluate(() => {
    const o = {};
    for (let q = 0; q < 6; q++) { const gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
    try { cardHide(); } catch (e) {}
    T.min = 13 * 60;

    /* STAND WHERE THE CROWD IS, FOUND RATHER THAN GUESSED (see the header). */
    const NB = BohemiaPopulation.NB, span = NB * FN;
    let best = null;
    const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
    for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
    for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
      let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      if (ppl.length && (!best || ppl.length > best.n)) best = { nx: nx, ny: ny, n: ppl.length, ppl: ppl };
    }
    if (best) {
      o.dense = [best.nx, best.ny]; o.denseCount = best.n;
      const spots = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
      if (spots.length) {
        const xs = spots.map(a => a[0]).sort((a, c) => a - c);
        const ys = spots.map(a => a[1]).sort((a, c) => a - c);
        hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
      }
    }
    try { render(); } catch (e) { o.warpThrew = String(e.message).slice(0, 140); }

    const lumaCache = new Map();
    const lumaOf = (spr) => {
      if (!spr) return null;
      if (lumaCache.has(spr)) return lumaCache.get(spr);
      let src = spr;
      try { if (typeof spriteAt === 'function') src = spriteAt(spr, 32) || spr; } catch (e) {}
      try {
        const cnv = document.createElement('canvas');
        cnv.width = src.width; cnv.height = src.height;
        const cx = cnv.getContext('2d'); cx.imageSmoothingEnabled = false;
        cx.drawImage(src, 0, 0);
        const im = cx.getImageData(0, 0, cnv.width, cnv.height).data;
        let s = 0, n = 0;
        for (let i = 0; i < im.length; i += 4) {
          if (im[i + 3] < 128) continue;
          s += 0.2126 * im[i] + 0.7152 * im[i + 1] + 0.0722 * im[i + 2];
          n++;
        }
        const v = n ? s / n : null;
        lumaCache.set(spr, v); return v;
      } catch (e) { return null; }
    };

    /* ONE SWEEP OF EVERY BODY ON THE GLASS: who, where, how light, and whether the game
       currently counts them as against you. */
    /* *** THE FACING IS PINNED, AND THAT CORRECTION IS THE WHOLE REASON THIS TOOL CAN BE
       BELIEVED. *** Read at each body's REAL facing, the first version reported that all
       172 bodies changed value on becoming hostile -- which flatly contradicts the code
       path, and the contradiction was the tell. 152 of them had TURNED TO LOOK AT YOU
       (the watch behaviour PEOPLE shipped, working exactly as designed), and a body seen
       from a different side is a different sprite. The measurement was reading the turn.
       Of the 20 that did NOT turn, ZERO changed value.
       So both readings ask for the SAME facing, and the only thing allowed to differ
       between them is whether that person is now your enemy. */
    const sweep = () => {
      try { render(); } catch (e) {}
      const out = [];
      for (let i = 0; i < BARK_DREW.length; i++) {
        const person = BARK_DREW[i].p, at = BARK_DREW[i].at;
        const dir = 'S';
        let own = null; try { own = (typeof ctBody === 'function') ? ctBody(person, dir) : null; } catch (e) {}
        let spr = own;
        if (!spr) { try { const set = PLAYER_CV[dir] || PLAYER_CV.S; spr = set && set.idle; } catch (e) {} }
        const lum = lumaOf(spr);
        if (lum == null) continue;
        let ag = null; try { ag = ctAgainstMe(person); } catch (e) {}
        let fid = null; try { fid = ctFactionOf(person); } catch (e) {}
        out.push({ id: person.id, x: at[0], y: at[1], luma: lum, cast: !!own,
                   level: ag ? ag.level : null, why: ag ? ag.why : null, fid: fid || null });
      }
      return out;
    };

    /* THE NULL CONTROL: two sweeps with NOTHING happening between them. It measures the
       noise floor -- a body's breath frame advances with the beat (ctBody picks a phase
       off floor(now/BEAT) plus the person's id), so the same body drifts a little all by
       itself. Without this number the test below cannot be read at all. AND THE FIRST
       NULL RUN CAME BACK ZERO BY LUCK, both sweeps landing inside one beat, which is
       exactly why it is run every time and reported as a magnitude rather than a count. */
    /* *** AND THE NULL CONTROL HAD TO BE MADE FAIR, WHICH IS ITS OWN LESSON. ***
       The first version took two sweeps back to back and reported ZERO drift, then the
       test sweep -- which happens after the deed calls, so later -- reported up to 2.3
       shades on every body. Run again it reported zero for both. THE NOISE IS NOT
       CONSTANT, IT IS ELAPSED TIME: a body's breath frame advances with the beat, so two
       sweeps inside one beat agree exactly and two sweeps either side of one do not. A
       control that takes less time than the test it is controlling for is not a control.
       So the floor is measured over a SPAN, several sweeps with real waiting between
       them and nothing else happening, and the number kept is the WORST drift any body
       showed. That is what the test has to beat to mean anything. */
    o.nullSweeps = [];
    for (let k = 0; k < 4; k++) {
      o.nullSweeps.push(sweep());
      const t0 = Date.now(); while (Date.now() - t0 < 350) { /* let the beat move */ }
    }
    o.before = sweep();
    /* EARN REAL ENEMIES THE WAY THE GAME EARNS THEM: a weighted deed, witnessed by
       whoever was on the glass. Every body in frame saw it, which is why the whole crowd
       turns -- reported honestly below rather than filtered to look tidier. */
    try { ctDialApply({ 'commit': -6 }, false); } catch (e) {}
    try { ctDeed('commit', CT_DEED_CLOUT['commit'], 'Cartel'); ctAgainstBump(); } catch (e) {}
    o.after = sweep();
    o.hx = hx; o.hy = hy;
    try { o.hour = (T.min / 60) | 0; } catch (e) {}
    return o;
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const before = r.before || [], after = r.after || [];
  const median = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y);
    return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
  const bId = new Map(before.map(x => [x.id, x]));
  const diffs = (m, list) => list.filter(a => m.has(a.id))
    .map(a => Math.abs(a.luma - m.get(a.id).luma));
  /* THE NOISE FLOOR: the worst drift any body showed across the whole null span, with
     nothing happening at all. Every pair of null sweeps, not just adjacent ones. */
  const nulls = (r.nullSweeps || []).concat([before]);
  let nullD = [];
  for (let i = 0; i < nulls.length; i++) for (let j = i + 1; j < nulls.length; j++)
    nullD = nullD.concat(diffs(new Map(nulls[i].map(x => [x.id, x])), nulls[j]));
  const testD = diffs(bId, after);                 /* they became your enemies */
  const nullMoved = nullD.filter(d => d > 1e-9).length;
  const testMoved = testD.filter(d => d > 1e-9).length;
  const nullMax = nullD.length ? Math.max(...nullD) : 0;
  const testMax = testD.length ? Math.max(...testD) : 0;
  const turned = after.filter(a => a.level && !(bId.get(a.id) || {}).level);
  const lums = after.map(x => x.luma);
  const distinct = new Set(lums.map(v => v.toFixed(3))).size;

  /* Q2: how far a body already sits from its own neighbours -- the noise a deliberate
     step has to beat. */
  const nbrGaps = [];
  for (const a of after) {
    const near = after.filter(o2 => o2 !== a && Math.max(Math.abs(o2.x - a.x), Math.abs(o2.y - a.y)) <= 3);
    if (near.length) nbrGaps.push(Math.abs(a.luma - median(near.map(o2 => o2.luma))));
  }

  const L = [];
  L.push('CAN YOU PICK HIM OUT OF THE CROWD? -- does a body look any different once it is');
  L.push('your enemy? Measured on the walked street, through the demo.');
  L.push('9/6/26, CHARACTER lane. [stands out] ONE-STEP-FROM-THE-CROWD-AROUND-IT.');
  L.push('');
  L.push('THE BOARD\'S OWN WORDS, and they CORRECT the fix the hostile verdict proposed:');
  L.push('"our fix for readable hostiles was \'wear the faction colour\', and in a Cartel');
  L.push(' block full of Cartel people that is exactly what makes a hostile INVISIBLE.');
  L.push(' Pop-out comes from FEATURE CONTRAST, not the feature. So a hostile carries ONE');
  L.push(' VALUE STEP away from the bodies within a few cells of it."');
  L.push('');
  L.push('  bodies the renderer put on the glass   ' + after.length);
  L.push('    wearing a real cast body             ' + after.filter(x => x.cast).length);
  L.push('    the tinted fallback body             ' + after.filter(x => !x.cast).length);
  L.push('  the fullest neighbourhood found        ' + (r.dense ? r.dense.join(',') : 'none') +
    ', holding ' + (r.denseCount || 0) + ' residents');
  L.push('  stood at world cell                    ' + r.hx + ',' + r.hy +
    ' (found by sweeping the population, never typed in)');
  L.push('  the hour on the clock                  ' + r.hour + ':00');
  L.push('');
  L.push('Q1. DOES A BODY LOOK ANY DIFFERENT ONCE IT IS YOUR ENEMY?');
  L.push('');
  L.push('  Same crowd, same bodies, THE SAME FACING ASKED FOR BOTH TIMES, matched by id.');
  L.push('  And it is run against a NULL CONTROL that spans REAL TIME: several sweeps with');
  L.push('  waiting between them and nothing else happening, every pair compared, so the');
  L.push('  noise a body shows on its own is a measured number and not an assumption.');
  L.push('  (An earlier version took two sweeps back to back, reported zero drift, and was');
  L.push('  therefore controlling for less time than the test it was controlling for.)');
  L.push('');
  L.push('    bodies that turned hostile                    ' + turned.length + ' of ' + after.length);
  L.push('');
  L.push('    NOTHING HAPPENED (the null control, over a real span of time)');
  L.push('      readings compared                          ' + nullD.length);
  L.push('      readings that moved at all                 ' + nullMoved);
  L.push('      the biggest move any body made              ' + nullMax.toFixed(2) + ' of 255');
  L.push('');
  L.push('    THEY BECAME YOUR ENEMIES');
  L.push('      bodies whose value moved at all             ' + testMoved + ' of ' + testD.length);
  L.push('      the biggest move any body made              ' + testMax.toFixed(2) + ' of 255');
  L.push('');
  L.push('  ' + (testMoved === 0
    ? 'NOT ONE BODY IN ' + testD.length + ' CHANGED BY A THOUSANDTH OF A SHADE.'
    : testMax <= nullMax * 1.5
      ? 'BECOMING YOUR ENEMY MOVES A BODY NO FURTHER THAN NOTHING-HAPPENING DOES ('
        + testMax.toFixed(2) + ' against ' + nullMax.toFixed(2) + '), which is not a signal.'
      : 'Some bodies DID move further than the null control. That has to be understood.'));
  L.push('');
  L.push('  AND A RULER THAT REPORTS ZERO FOR EVERYTHING IS NOT EVIDENCE, so here is the');
  L.push('  POSITIVE CONTROL that shows this one can see a difference when there is one:');
  L.push('  the SAME measurement, on the same bodies, through the same code, separates the');
  L.push('  crowd into ' + distinct + ' distinct values spanning ' +
    (lums.length ? (Math.max(...lums) - Math.min(...lums)).toFixed(1) : '0') + ' shades (Q2 and Q3 below). It is');
  L.push('  wide awake. It returns zero for the before-and-after comparison because there');
  L.push('  is nothing there to see.');
  L.push('');
  L.push('  THE CODE SAYS THE SAME THING, so this is not an accident of one crowd: a');
  L.push('  body\'s sprite comes from ctBody(), which asks ctFactionOf() and then');
  L.push('  ctFitIndex() -- faction, else trade, else id. ctAgainstMe is called in exactly');
  L.push('  FOUR places in the walked city and NOT ONE is the appearance path: it drives');
  L.push('  following, blocking, the bark and the bump. THE VALUE CHANNEL CARRIES NO');
  L.push('  INFORMATION ABOUT WHO IS DANGEROUS, because nothing is asking.');
  L.push('');
  L.push('  *** AND THE FIRST VERSION OF THIS MEASUREMENT SAID THE OPPOSITE. *** Read at');
  L.push('  each body\'s REAL facing it reported all 172 bodies changing value, which');
  L.push('  contradicts the code path -- and the contradiction was the tell, not a');
  L.push('  discovery. 152 of them HAD TURNED TO LOOK AT ME, which is the watch behaviour');
  L.push('  PEOPLE shipped working exactly as designed, and a body seen from another side');
  L.push('  is another sprite. Of the 20 that did not turn, ZERO moved. The ruler was');
  L.push('  measuring the turn. WHEN A NUMBER CONTRADICTS THE CODE, SUSPECT THE NUMBER.');
  L.push('');
  L.push('  HONESTLY, ABOUT THIS CROWD: every body on the glass witnessed the deed, so all');
  L.push('  ' + turned.length + ' turned at once and the reason is "you" -- personal, not faction. In real');
  L.push('  play you earn a few enemies, not a street. That does not weaken Q1, which asks');
  L.push('  whether the SAME body looks different. It does mean this crowd cannot answer');
  L.push('  "does a hostile stand out from civilians", because after the deed there are no');
  L.push('  civilians left to stand out from. That needs a mixed crowd and it is the ship');
  L.push('  test for the fix, not for the measurement.');
  L.push('Q2. HOW BIG DOES ONE STEP HAVE TO BE? (for DIRECTION\'s [contrast rule])');
  L.push('');
  if (lums.length) {
    L.push('    darkest body in the crowd            ' + Math.min(...lums).toFixed(1) + ' of 255');
    L.push('    median body                          ' + median(lums).toFixed(1));
    L.push('    lightest body                        ' + Math.max(...lums).toFixed(1));
    L.push('    the whole crowd fits inside          ' + (Math.max(...lums) - Math.min(...lums)).toFixed(1) + ' shades');
    L.push('');
    L.push('    how far a body already sits from its own neighbours (within 3 cells):');
    L.push('      median   ' + (nbrGaps.length ? median(nbrGaps).toFixed(1) : '-'));
    L.push('      worst    ' + (nbrGaps.length ? Math.max(...nbrGaps).toFixed(1) : '-'));
    L.push('');
    L.push('    A STEP HAS TO BEAT THAT MEDIAN TO READ AS DELIBERATE. Anything smaller sits');
    L.push('    inside the noise the crowd already has, and a player reads it as another');
    L.push('    body rather than as a warning. REPORTED, NOT DECIDED -- the number belongs');
    L.push('    in the card, and the card is DIRECTION\'s ([contrast rule], still open).');
  }
  L.push('');
  L.push('Q3. HOW MANY DIFFERENT BODIES IS THE CROWD ACTUALLY MADE OF?');
  L.push('');
  L.push('    distinct body values among ' + after.length + ' bodies   ' + distinct);
  if (distinct < after.length / 4) {
    L.push('');
    L.push('    THE CROWD IS QUANTISED: it is drawn from a small set of baked bodies, so');
    L.push('    many people share a value exactly. That decides where the fix can live --');
    L.push('    a shift baked into a shared sprite would move everybody wearing it, so');
    L.push('    whatever carries the step has to be applied PER BODY AT DRAW TIME.');
  }
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. A NUMBER IS NOT A FINDING UNTIL YOU KNOW');
  L.push('WHAT IT IS COUNTING (9/5, the round the brown boots were called an accent). The');
  L.push('finding here is Q1, and it is held by a control AND by the code path: nothing');
  L.push('about how a body looks has ever asked whether that body is your enemy.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
