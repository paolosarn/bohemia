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
  ok('and the measured numbers are written down where the next lane will read them',
     /lotFine:\s*25/.test(SRC) && /houseFine:\s*13/.test(SRC) && /bodyLots:\s*0\.5/.test(SRC));
  ok('and RUN\'s constant is READ, never copied into a second table here',
     /window\.BOHEMIA_STEP_FINE/.test(SRC));

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
    const ZOOMS = [4, 8, 11, 16, 22, 33, 44, 48, 64, 88];
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
    /* AND THE SAME QUESTION WITH RUN'S NUMBER SET. The camera that shows a lot at about
       the size a cell shows today is HC / lot, so the body is asked at that zoom. */
    window.BOHEMIA_STEP_FINE = BODY_SCALE.lotFine;
    o.stepped = ZOOMS.map(C => ({ C: C, got: bodyLadder(C), m: painted(C) }));
    o.atLotCamera = painted(Math.max(1, Math.round(208 / BODY_SCALE.lotFine)));
    delete window.BOHEMIA_STEP_FINE;
    o.after = ZOOMS.map(C => bodyLadder(C));
    o.todayBody = painted(HC);
    return o;
  });
  await b.close();

  ok('the walk drew a body to measure at all -- every number below is meaningless without '
     + 'one (' + R.drew + ' drawn)', R.drew > 0 && R.todayBody && R.todayBody.painted > 0);

  /* 1. TODAY IS UNCHANGED, rung for rung. */
  const moved = R.today.filter(r => r.want !== r.got);
  ok('*** TODAY IS UNCHANGED *** -- with no step constant, every zoom returns exactly what '
     + 'the old inline formula returned (' + R.today.length + ' zooms, ' + moved.length
     + ' moved' + (moved.length ? ': ' + moved.map(r => r.C + ' ' + r.want + '->' + r.got).join(', ') : '') + ')',
     moved.length === 0);
  ok('and it is still unchanged after the constant has been set and cleared, so nothing '
     + 'latched', R.after.every((v, i) => v === R.today[i].want));

  /* 2. THE BOX AND THE ART AGREE. */
  const mismatch = R.today.concat(R.stepped).filter(r => r.m && r.m.box !== r.m.sprite);
  ok('*** THE BLIT BOX AND THE SPRITE RUNG NEVER DISAGREE *** -- two functions choose them, '
     + 'and a mismatch stretches a small picture into a big hole (' + mismatch.length
     + ' of ' + (R.today.length + R.stepped.length) + ' disagree)', mismatch.length === 0);

  /* 3. A SMALLER CELL CANNOT SHRINK A PERSON. */
  const t = R.todayBody, L = R.atLotCamera;
  ok('*** A SMALLER CELL CANNOT SHRINK A PERSON *** -- with a lot per step and the camera '
     + 'zoomed so a lot fills the screen the way a cell does today, the body paints '
     + (L ? L.painted : '?') + ' px against ' + t.painted + ' px today, and the ruling is '
     + 'that it never goes down', !!L && L.painted >= t.painted);
  ok('and the old code would have SHRUNK him at that camera, which is the failure this '
     + 'gate exists for (old rung would be 28)', !!L && L.box > 28);

  if (errs.length) console.log('  note: page errors -- ' + errs.slice(0, 2).join(' | '));
  console.log('\n  today: body ' + t.painted + ' px in a ' + t.box + ' box at HC ' + R.HC
    + '; a lot is ' + R.lot + ' fine cells (18.8 m, measured)');
  done();
})();
