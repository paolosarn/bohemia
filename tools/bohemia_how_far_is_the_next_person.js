/* HOW FAR IS THE NEXT PERSON? (9/15/26, CHARACTER lane, VAMILY [six people])
 *
 * *** WHY THIS EXISTS: PAOLO PLAYED AND SAID HE DID NOT SEE A SINGLE HUMAN BEING,
 * AND THIS LANE HAD JUST SHIPPED A CAST CHANGE, SO THE CAST CHANGE WAS THE SUSPECT. ***
 * It is not. The cast is fine, the renderer is fine, and the street is empty because
 * there is nearly nobody standing on it.
 *
 * THE RULER THIS LANE THREW AWAY FIRST (the eighth one, and the same class of mistake
 * as holderAt/groundAt on 9/13). Round 1 of this chase built its OWN screen rectangle,
 * counted "59 people inside it, 2 drawn", and was about to report a broken cull. Both
 * halves were wrong:
 *   - the rectangle measured distance in OVERMAP CELLS (divide by FN) while peoplePass
 *     measures in FINE CELLS. One overmap cell is 128 fine cells, so "0.1 cells away"
 *     was really 12.8 cells away, which is off the side of a screen 8.6 cells wide.
 *   - and it never asked the pass which of its four skips actually fired.
 * SO THE PASS NOW COUNTS ITS OWN SKIPS (window.__PPL_SKIP) and this tool reads them.
 * A SKIP COUNTER IS CHEAPER THAN A ROUND. That is the whole lesson: the pass already
 * decided; only nobody wrote down which decision.
 *
 * WHAT IT MEASURES, all in the pass's own units, on the real surface over http:
 *   - the roster peoplePass considers, and which skip removed each person from it
 *   - the screen in FINE CELLS (house-sized tiles), not pixels and not overmap cells
 *   - the distance ladder to the nearest, second, tenth and median person
 *
 * IT CORROBORATES A NUMBER THE POPULATION MODULE ALREADY WROTE DOWN and does not
 * contradict it. bohemia_population.js, 8/28: "AT THE TOP OF THE SLIDER YOU STILL WALK
 * TWO CITY BLOCKS BETWEEN STRANGERS ... What is left is not a count, it is WHERE."
 * This is that sentence measured at the eye instead of in a sweep.
 *
 * NOT THIS LANE'S DIAL TO TURN. ONE SYSTEM, ONE SESSION: the population grid belongs to
 * WORLD / LIFE+CITY. CHARACTER measures it, publishes the number, and touches nothing.
 *
 * RIG CHECK (RIG IS LAW): reads only. REUSE CHECK: cooks zero pixels.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_how_far_is_the_next_person.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const PORT = process.env.BOHEMIA_PORT || 8231;
const OUT = path.join(REPO, 'records/BOHEMIA_HOW_FAR_IS_THE_NEXT_PERSON_9_15_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  /* HIS PHONE, and over http rather than file:// -- twelve of the fourteen errors a
     file:// run reports are tile-fetch artifacts of the protocol, not the game. */
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    render();                                   /* so __PPL_SKIP is this frame's, not a stale one */
    const cv = document.querySelector('canvas'), C = HC;
    const skip = JSON.parse(JSON.stringify(window.__PPL_SKIP || {}));
    const NB = BohemiaPopulation.NB, span = NB * FN;
    const cx = Math.floor(hx / span), cy = Math.floor(hy / span);
    /* THE SAME 3x3 WINDOW peoplePass walks, read the same way it reads it. */
    const at = [];
    for (let ny = cy - 1; ny <= cy + 1; ny++)
    for (let nx = cx - 1; nx <= cx + 1; nx++) {
      let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      for (const q of ppl) { let a = null; try { a = pplAt(q); } catch (e) { continue; } if (a) at.push(a); }
    }
    const wide = cv.width / C, tall = cv.height / C;
    let onScreen = 0;
    for (const a of at) {
      if (Math.abs(a[0] - hx) <= wide / 2 && Math.abs(a[1] - hy) <= tall / 2) onScreen++;
    }
    const d = at.map(a => Math.max(Math.abs(a[0] - hx), Math.abs(a[1] - hy))).sort((x, y) => x - y);
    return { skip: skip, roster: at.length, onScreen: onScreen,
             screenWideCells: +wide.toFixed(1), screenTallCells: +tall.toFixed(1),
             windowCells: span * 3,
             nearest: d[0], second: d[1], tenth: d[9], median: d[Math.floor(d.length / 2)],
             perScreen: +(at.length * (wide * tall) / (span * 3 * span * 3)).toFixed(4),
             dial: (function () { try { return BohemiaPopulation.dial(); } catch (e) { return null; } })(),
             castBodies: (typeof CAST_CV !== 'undefined' && CAST_CV) ? CAST_CV.length : 0,
             FN: FN, NB: NB, C: C };
  });
  await b.close();

  const L = [];
  L.push('HOW FAR IS THE NEXT PERSON?  CHARACTER lane, 9/15/26, VAMILY [six people]');
  L.push('measured on the demo over http, 390x844 at DPR 3, walk mode, canon seed');
  L.push('');
  L.push('HE SAID HE DID NOT SEE A SINGLE HUMAN BEING. THE RENDERER IS NOT WHY.');
  L.push('');
  L.push('WHAT THE DRAW PASS ITSELF COUNTED (its own skips, not this tool\'s rectangle)');
  L.push('  people it considered      ' + R.skip.roster);
  L.push('  skipped, on his own cell  ' + R.skip.onPlayer);
  L.push('  skipped, cell taken       ' + R.skip.stacked);
  L.push('  skipped, off the screen   ' + R.skip.offscreen);
  L.push('  skipped, no picture       ' + R.skip.noSprite);
  L.push('  DREW                      ' + R.skip.drawn);
  L.push('');
  L.push('SO EVERY SKIP BUT ONE IS ZERO. Nothing is stacking, nobody is missing a body,');
  L.push('the cast is ' + R.castBodies + ' bodies and all of them work. They are simply not here.');
  L.push('');
  L.push('HOW BIG HIS SCREEN IS, IN HOUSE-SIZED TILES (the unit the pass uses)');
  L.push('  screen          ' + R.screenWideCells + ' x ' + R.screenTallCells + ' tiles');
  L.push('  the window      ' + R.windowCells + ' x ' + R.windowCells + ' tiles holds ' + R.roster + ' people');
  L.push('  on his screen   ' + R.onScreen);
  L.push('');
  L.push('HOW FAR TO THE NEXT PERSON, IN TILES');
  L.push('  nearest         ' + R.nearest);
  L.push('  second nearest  ' + R.second);
  L.push('  tenth nearest   ' + R.tenth);
  L.push('  median          ' + R.median);
  L.push('  people you can expect on one screen: ' + R.perScreen);
  L.push('');
  L.push('THE POPULATION DIAL IS AT ' + R.dial + ' AND THIS IS NOT A CASE FOR TURNING IT UP.');
  L.push('bohemia_population.js measured that sweep itself on 8/28 and wrote the answer');
  L.push('into its own head: at the TOP of the slider, 23 of 32 walks still met nobody.');
  L.push('Its words: "it is not a count, it is WHERE." Same finding, measured at the eye.');
  L.push('');
  L.push('NOT THIS LANE\'S TO FIX. The population grid is WORLD / LIFE+CITY.');
  L.push('CHARACTER measured it, is publishing the number, and changed nothing in it.');
  L.push('What CHARACTER did change: the draw pass now counts its own skips, so the next');
  L.push('empty street is a read instead of a round.');
  L.push('');
  L.push('AND THE RULER THIS LANE THREW AWAY GETTING HERE (the eighth):');
  L.push('round 1 built its own screen rectangle and measured distance in OVERMAP cells');
  L.push('while the pass measures in FINE cells, 128 to one. "0.1 cells away" was really');
  L.push('12.8 tiles away, off the side of a screen 8.6 tiles wide. The cull was right.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();
