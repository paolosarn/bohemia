#!/usr/bin/env node
/* BODY SCALE GATE (9/15/26, CHARACTER lane, VAMILY [bigger bodies])
 *
 * THE LAW: THE STEP IS A HOUSE (Paolo 9/15, LOCKED,
 * laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md). "I want people to be larger,
 * cause remember each tile is the size of a house." It splits the work four ways and
 * gives CHARACTER one piece: THE BODY, drawn at the ruled size on both surfaces.
 *
 * WHAT THIS GUARDS, and it is not "the body is big". It is the SILENT failure underneath:
 * the body's size was chosen off the CELL size, so the first commit that zooms the camera
 * out to show lots would have SHRUNK every person to a quarter of their height -- the exact
 * opposite of the ruling, with no error, no red gate, and nothing to see until he played it.
 * A gate that fires only after the ruling is implemented is worth nothing; this one fires
 * the moment somebody reconnects the body to the cell.
 *
 * SO IT ASSERTS FOUR THINGS:
 *   1. TODAY IS UNCHANGED. With no step constant set, the rung at every zoom is exactly
 *      what the old inline formula returned. A wire that quietly resizes the game before
 *      RUN's number lands is a bug, not a head start.
 *   2. THE BOX AND THE ART AGREE. The blit box and the sprite rung are chosen by two
 *      different functions; if they ever disagree the game stretches a 28 px picture into
 *      a 112 px hole and calls it a person. Checked at every zoom, both ways.
 *   3. A SMALLER CELL CANNOT SHRINK A PERSON. With the step set to a lot and the camera
 *      zoomed to match, the body paints AT LEAST what it paints today. This is the ruling.
 *   4. ONE LADDER, ONE PLACE. No inline rung table survives anywhere in the city file.
 *      The player was the last copy and it is gone; this stops the next one.
 *
 * MEASURED ON THE REAL SURFACE, in the running city, never on the source text alone --
 * except check 4, which is a source check by nature and says so.
 *
 *   python3 -m http.server 8231 &
 *   node gates/body_scale_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const PORT = process.env.BOHEMIA_PORT || 8231;
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== BODY SCALE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const SRC = fs.readFileSync(path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

  /* 4. ONE LADDER, ONE PLACE -- a source check, because "is there a second copy" is a
     question about the text and nothing else can answer it. The shape it hunts is the
     rung table itself, written inline anywhere other than the one helper. */
  const inline = SRC.match(/>=\s*64\s*\?\s*224\s*:/g) || [];
  ok('ONE BODY LADDER, ONE PLACE -- no inline rung table outside the helper (' +
     inline.length + ' found, 1 allowed)', inline.length === 1);
  ok('and both the crowd and the player go through it',
     /const _lad\s*=\s*bodyLadder\(HC\)/.test(SRC) && /var lad = bodyLadder\(C\)/.test(SRC));
  /* *** REPOINTED 9/21, AND THE LITERAL IT REPLACES WAS THE STALE THING, NOT THE CODE. ***
     This demanded the text `lotFine: 25` and `bodyLots: 0.5` in the source. LIFE+CITY
     (749a626) repointed both at BOH_LATTICE -- lotFine reads LOT_FINE, bodyLots reads
     BODY_LOTS -- which is the ONE NUMBER IN ONE PLACE law working exactly as written, and
     my gate went red for it. A gate that goes red when a second copy is REMOVED is holding
     the wrong thing. So the check now asks what the law actually wants: the three keys are
     present for the lanes that read this object, and the two that have a home in the
     lattice READ it instead of carrying a copy. houseFine keeps its literal because this
     lane measured it (median footprint over 122 houses) and nothing else holds it.
     NOTE FOR WHOEVER READS THE NUMBER: the lattice says a lot is 24 fine cells and this
     lane measured 25 (median pitch between neighbours, 122 houses, 12 seeds). One cell,
     0.75 m. The lattice wins because it is what the generator actually packs; the gap is
     named in the handoff rather than papered over here. */
  ok('and the measured numbers are written down where the next lane will read them',
     /lotFine:/.test(SRC) && /houseFine:\s*13/.test(SRC) && /bodyLots:/.test(SRC));
  ok('and the two that live in the lattice READ it rather than keeping a second copy',
     /lotFine:[^\n]*BOH_LATTICE\.LOT_FINE/.test(SRC)
     && /bodyLots:[^\n]*BOH_LATTICE\.BODY_LOTS/.test(SRC));
  /* *** REPOINTED 9/15, THE ROUND RUN SHIPPED ITS HALF. *** This checked for a flag named
     BOHEMIA_STEP_FINE, which nothing ever set: RUN called its constant STEP_CELLS, so the
     wire was dangling and the gate was happily green over a second name for one number --
     the exact bug the law's "one number in one place" is about. And repointing alone would
     have been worse: STEP_CELLS is 5, the old test fired on anything over 1, and the body
     would have jumped to 550 px on a 378 px screen. RUN measured that and refused it: "a
     person taller than a doorway".
     SO THE TRIGGER IS WHETHER A HOUSE FITS ON THE SCREEN, which is self-measuring off the
     real camera and cannot make a giant on a tight one. */
  ok('RUN\'s constant is READ by its real name, never copied into a second table here',
     /typeof STEP_CELLS === 'number'/.test(SRC) && !/window\.BOHEMIA_STEP_FINE\s*\|/.test(SRC));
  ok('and the body grows off THE CAMERA, not off the step -- a step of 5 must not put a '
     + 'person taller than a doorway on a tight zoom',
     /lotFitsOnScreen/.test(SRC) && /cv\.width \* 0\.9/.test(SRC));
  ok('and it only grows him on a STREET -- a lot fits the screen at city zoom too, and a '
     + 'giant standing over a whole city is the one place a person should be a speck',
     /MODE !== 'human'\) return false/.test(SRC));

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { ok('the walked city is reachable from the demo at all', false); await b.close(); done(); }

  const R = await fr.evaluate(() => {
    render();
    /* THE ZOOMS THE WALK ACTUALLY USES. HZOOM is 44 and the transition animates up to 48,
       so these are the cells a person is ever drawn on WITH HIS FEET ON A STREET. The small
       numbers below are city zoom and are asked separately, in city mode, where the answer
       must never move. Asking one list in one mode is how the first cut of this check
       reported three false reds on zooms the walk never reaches in human mode. */
    const ZOOMS = [17, 22, 33, 44, 48, 64, 88];
    const CITY_ZOOMS = [4, 8, 11, 13, 16];
    /* THE OLD FORMULA, written out here on purpose rather than imported: a no-op check
       that asks the new code what the old code used to say is a check that cannot fail. */
    const was = (C) => C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
    const painted = (C) => {
      const d = BARK_DREW[0]; if (!d) return null;
      let dir = 'S'; try { dir = pplFace(d.p, d.at); } catch (e) {}
      let s = null; try { s = ctBody(d.p, dir); } catch (e) {}
      if (!s) return null;
      const lad = bodyLadder(C), img = spriteAt(s, bodySpriteC(C));
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g2 = c.getContext('2d', { willReadFrequently: true });
      g2.imageSmoothingEnabled = false; g2.drawImage(img, 0, 0);
      const D = g2.getImageData(0, 0, c.width, c.height).data;
      let y0 = 1e9, y1 = -1;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++)
        if (D[(y * c.width + x) * 4 + 3] >= 128) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return { box: lad, sprite: img.width, painted: +(((y1 - y0 + 1) * lad / c.height).toFixed(1)) };
    };
    const o = { drew: BARK_DREW.length, HC: HC, zooms: ZOOMS, lot: BODY_SCALE.lotFine };
    o.today = ZOOMS.map(C => ({ C: C, want: was(C), got: bodyLadder(C), m: painted(C) }));
    /* AND THE SAME QUESTION AT A CAMERA THAT ACTUALLY SHOWS A HOUSE. No flag is set and
       none exists: the trigger is the camera itself, so the only way to ask the question is
       to ask at that zoom. A lot is 25 cells and wants about 208 px, so HC lands near 8. */
    o.stepped = ZOOMS.map(C => ({ C: C, got: bodyLadder(C), m: painted(C) }));
    o.atLotCamera = painted(Math.max(1, Math.round(208 / BODY_SCALE.lotFine)));
    o.lotFitsToday = BODY_SCALE.lotFitsOnScreen(HC);
    o.stepCells = BODY_SCALE.stepCells();
    o.after = ZOOMS.map(C => bodyLadder(C));
    /* AND THE CITY, ASKED IN CITY MODE, where a lot fits the screen and the body must not
       move by one pixel. */
    const keepMode = MODE;
    try { MODE = 'city'; } catch (e) {}
    o.city = CITY_ZOOMS.map(C => ({ C: C, want: was(C), got: bodyLadder(C) }));
    try { MODE = keepMode; } catch (e) {}
    o.todayBody = painted(HC);
    return o;
  });
  await b.close();

  ok('the walk drew a body to measure at all -- every number below is meaningless without '
     + 'one (' + R.drew + ' drawn)', R.drew > 0 && R.todayBody && R.todayBody.painted > 0);

  /* 1. TODAY IS UNCHANGED, rung for rung. */
  /* *** RE-AIMED 9/20. THESE TWO LEGS ASSERTED A RULING THAT HAS BEEN OVERRULED. ***
     They checked that every walk zoom returns exactly what the OLD inline formula returned
     -- correct under rule 16, and RED the moment rule 18 (Paolo 9/20) said "THE BODY ONE
     FIXED SIZE THAT NEVER CHANGES WHILE HE WALKS OR PINCHES". A GATE MUST NEVER OUTRANK A
     RULING: when a leg fires, read what it asserts against the newest ruling before you
     read it against the code. What the law wants checked now is the opposite of what these
     asked, so they ask the opposite. */
  const walkSizes = Array.from(new Set(R.today.filter(r => r.m).map(r => r.m.painted)));
  ok('*** THE BODY IS ONE FIXED SIZE AT EVERY ZOOM A PINCH CAN REACH *** -- rule 18, the '
     + 'walking half of the playable cut. Measured before the fix: 52, 102 and 202 px, and '
     + 'pinching from 22 to 44 DOUBLED him (' + walkSizes.length + ' distinct: '
     + walkSizes.sort((a, c) => a - c).join(', ') + ' px across '
     + R.today.length + ' zooms)', walkSizes.length === 1);
  const boxes = Array.from(new Set(R.today.map(r => r.got)));
  ok('and the box he is drawn into is the same rung at every one of them ('
     + boxes.join(', ') + ')', boxes.length === 1);
  ok('and it is the size the game has shipped at, not a new one invented here (box 112, '
     + 'about 100 px of painted person)', boxes[0] === 112);

  const cityMoved = (R.city || []).filter(r => r.want !== r.got);
  ok('*** AND CITY MODE IS UNTOUCHED *** -- a lot fits the screen at city zoom, so without '
     + 'the mode half of the condition every body in the city would have jumped from 28 px '
     + 'to 112 (' + cityMoved.length + ' of ' + (R.city || []).length + ' moved)',
     cityMoved.length === 0);

  /* 2. THE BOX AND THE ART AGREE. */
  const mismatch = R.today.concat(R.stepped).filter(r => r.m && r.m.box !== r.m.sprite);
  ok('*** THE BLIT BOX AND THE SPRITE RUNG NEVER DISAGREE *** -- two functions choose them, '
     + 'and a mismatch stretches a small picture into a big hole (' + mismatch.length
     + ' of ' + (R.today.length + R.stepped.length) + ' disagree)', mismatch.length === 0);

  /* 3. AND THE CAMERA RUN IS HEADING FOR GETS THE SAME PERSON. A lot is 25 cells and a
     house fits a 378 px screen at about cell 14, so this asks at that camera specifically:
     when [one camera] lands, the body must already be the size it is now, with no further
     work in this lane. Under the old wire it would have been 28 px there. */
  const t = R.todayBody, L = R.atLotCamera;
  ok('*** AND THE CAMERA WHERE A HOUSE FITS GETS THE SAME PERSON *** -- so RUN [one camera] '
     + 'can land without this lane touching anything (' + (L ? L.painted : '?') + ' px there '
     + 'against ' + t.painted + ' px now)',
     !!L && Math.abs(L.painted - t.painted) < 1);
  ok('and the old wire would have drawn him at a quarter of that, which is the failure this '
     + 'gate was opened for (old rung would be 28)', !!L && L.box > 28);

  if (errs.length) console.log('  note: page errors -- ' + errs.slice(0, 2).join(' | '));
  console.log('\n  today: body ' + t.painted + ' px in a ' + t.box + ' box at HC ' + R.HC
    + '; a lot is ' + R.lot + ' fine cells (' + (R.lot * 0.75).toFixed(1)
    + ' m, derived from the fine cell this lane measured at 0.75 m)');
  done();
})();
