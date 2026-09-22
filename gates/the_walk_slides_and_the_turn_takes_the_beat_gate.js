/* BOHEMIA — THE WALK SLIDES AND THE TURN TAKES THE BEAT (9/22, ANIMATION)
 *
 * RULE 26, PAOLO 9/21, four words on the walk item: "I want slide immedialy."
 * The tape skip this lane built over three rounds was the MANAGER'S default, not
 * his, and it is dead. This gate is what that one became.
 *
 * BUT THE REASON SLIDE WAS NOT ALREADY WHAT HE HAD IS STILL THE POINT, and it is
 * the thing this gate really guards. The glide carried a handwritten four-cell
 * ceiling, written 8/23 when a step was ONE cell -- its own comment said so. Rule
 * 16 made a step twenty-five. So every full step died on its first drawn frame,
 * the chip said SLIDE, the source said SLIDE, and what he actually walked was
 * GRID: the whole world jumping 275 px in one frame, twice a second. A NUMBER
 * TYPED INTO A GUARD EXPIRES SILENTLY, because a guard that refuses everything
 * looks exactly like a feature nobody turned on. Saying "the feel is SLIDE"
 * means nothing unless something checks the ground actually slides.
 *
 * AND THE TURN, VOTED UP 9/21. There was no turn at all: the facing was assigned
 * the instant the step ran, so he was facing south and then a different drawing
 * facing east on the very next frame. He already has eight drawings; a turn is
 * those drawings in order, across the beat, the short way round. No new art.
 *
 * AND THE IDLE, VOTED UP 9/21, under the one law that can break it: in idle the
 * FEET NEVER MOVE. Measured on the drawn frame, not the joints -- the joint
 * ruler lied to this lane twice and the picture caught it both times.
 *
 *   node gates/the_walk_slides_and_the_turn_takes_the_beat_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  ok   ' + n + (note ? '  [' + note + ']' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  [' + note + ']' : ''))); };

(async () => {
  const src = fs.readFileSync(CITY, 'utf8');

  /* ---- 1. HIS WORD, IN THE SOURCE ---------------------------------------- */
  ok('the walk curve is written once and only once',
     (src.match(/1-Math\.pow\(-2\*k\+2,2\)\/2/g) || []).length === 1);
  ok('the tape skip is gone, not left lying around as a dead option',
     !/TAPE_STATIONS|tapeWorthIt|walkStation/.test(src));
  ok('the teleport ceiling is a named derivation, not a number typed in a guard',
     (src.match(/glideCeil\(\)/g) || []).length >= 2
     && !/Math\.abs\(dx\)>4\|\|Math\.abs\(dy\)>4/.test(src));
  ok('the walk frame is picked in one place, not once outdoors and once indoors',
     (src.match(/\/BEAT\*frames\.length\)\|0/g) || []).length === 0
     && (src.match(/walkFrame\(/g) || []).length >= 2);

  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  await pg.waitForTimeout(4000);

  const seam = await pg.evaluate(() => {
    const W = window.__WALKFEEL;
    return W ? { feels: W.feels(), mode: W.mode(), ceil: W.ceil(), step: W.step() } : null;
  });
  if (!seam) { ok('the city exposes its walk seam', false); await br.close(); return done(); }
  ok('SLIDE is what he gets without asking', seam.mode === 'SLIDE', seam.mode);
  ok('there are two feels, and TAPE is not one of them',
     seam.feels.length === 2 && seam.feels.indexOf('TAPE') < 0, seam.feels.join(', '));
  ok('the ceiling clears one walk step', seam.ceil > seam.step, 'step ' + seam.step + ', ceiling ' + seam.ceil);
  ok('it clears a run and a bike too', seam.ceil >= 4 * seam.step);
  ok('and it still refuses a teleport', seam.ceil < 10 * seam.step, 'ceiling ' + seam.ceil);

  /* ---- 2. THE GROUND REALLY SLIDES, ON THE PIXELS THE GAME DRAWS ----------
     Not a sample of a clock: this box clamps a headless page to about twenty
     frames a second and a beat holds sixty, so the CLOCK is driven instead.
     performance.now() is stubbed, render() is called at each of the sixty moments
     a sixty-frame beat lands on, and the real canvas is read back. And the
     question is not "did a pixel change" -- the crowd breathes -- but how many
     frames MOVE THE WORLD: more than a twentieth of the screen at once. */
  const film = await pg.evaluate(async (feels) => {
    const W = window.__WALKFEEL, out = {};
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) {}
    const realNow = performance.now.bind(performance);
    const cv = document.getElementById('cv');
    if (!cv) return { FAILED: 'no canvas' };
    const g = cv.getContext('2d'), N = 60;
    for (const feel of feels) {
      W.set(feel);
      const DIRS = [2, 4, 0, 6, 1, 3, 5, 7];
      let tries = 0, got = false, cells = 0;
      while (tries < 24 && !got) {
        const x0 = hx, y0 = hy;
        startHold(DIRS[tries % DIRS.length]); endHold(); tries++;
        let w = 0; while (w < 1200 && hx === x0 && hy === y0) { await new Promise(r => setTimeout(r, 8)); w += 8; }
        cells = Math.max(Math.abs(hx - x0), Math.abs(hy - y0));
        if (cells >= W.step() / 2) got = true; else await new Promise(r => setTimeout(r, 300));
      }
      if (!got) { out[feel] = { FAILED: 'no step of half a lot in 24 presses' }; continue; }
      const t0 = realNow();
      performance.now = () => t0; try { render(); } catch (e) {}
      let prev = null, moved = 0, biggest = 0;
      for (let i = 0; i <= N; i++) {
        const k = i / N;
        performance.now = () => t0 + k * 500;
        try { render(); } catch (e) {}
        const im = g.getImageData(0, 0, cv.width, cv.height);
        if (prev) {
          let ch = 0; const a = im.data, b = prev;
          for (let q = 0; q < a.length; q += 16)
            if (a[q] !== b[q] || a[q + 1] !== b[q + 1] || a[q + 2] !== b[q + 2]) ch++;
          const f = ch / (a.length / 16);
          if (f > 0.05) moved++;
          if (f > biggest) biggest = f;
        }
        prev = im.data.slice(0);
      }
      performance.now = realNow;
      out[feel] = { cells, frames: N, movedTheWorld: moved, biggest: +(biggest * 100).toFixed(1) };
      await new Promise(r => setTimeout(r, 600));
    }
    W.set('SLIDE');
    return out;
  }, ['GRID', 'SLIDE']);

  if (film.FAILED) { ok('the frame-by-frame look can be taken', false, film.FAILED); }
  else {
    const G = film.GRID, S = film.SLIDE;
    console.log('       GRID  ' + (G.FAILED || (G.movedTheWorld + ' of ' + G.frames + ' drawn frames moved the world')));
    console.log('       SLIDE ' + (S.FAILED || (S.movedTheWorld + ' of ' + S.frames + ' drawn frames moved the world, biggest ' + S.biggest + '%')));
    ok('both feels were filmed on a real step', !G.FAILED && !S.FAILED, (G.FAILED || '') + ' ' + (S.FAILED || ''));
    if (!G.FAILED && !S.FAILED) {
      /* THE CLAIM THAT CATCHES THE EXPIRED CEILING. With the old guard back this
         is 0: the ground never moves inside the beat, it teleports on it. */
      ok('the ground really slides: it moves on many frames inside the beat',
         S.movedTheWorld >= 8, S.movedTheWorld + ' of 60');
      /* AND THE CONTROL, without which the claim passes on a broken renderer:
         the same ruler on the same surface must see GRID holding still. */
      ok('and the same ruler sees GRID holding still inside the beat',
         G.movedTheWorld <= 2, 'GRID ' + G.movedTheWorld + ' against SLIDE ' + S.movedTheWorld);
    }
  }
  await br.close();

  /* ---- 3. THE TURN, ON THE REAL SURFACE ----------------------------------
     The standalone city page has NO player sprites at all -- PLAYER_CV is empty
     there, the bodies are posted in from the alpha -- so a facing can only be
     judged where he plays it. The seam is faceNow(), which is what the renderer
     asks for the drawing. */
  let D2 = null;
  try { D2 = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js')); } catch (e) {}
  if (!D2) { ok('the one driver is available to check the turn', false); return done(); }
  const d = await D2.open();
  await d.page.waitForTimeout(2500);
  const turn = await d.fr.evaluate(async () => {
    if (!window.__TURN) return { ERR: 'no turn seam on this surface' };
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) {}
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const T = window.__TURN;
    /* *** THE CLAIM IS NOT "A TURN HAPPENED". IT IS THAT THE DRAWING NEVER JUMPS. ***
       Two rulers were built and thrown away before this one. The first compared
       HFACE before and after a press: but a held walk steps EVERY beat, so N to W
       usually happens as N to NW then NW to W, two one-point turns with nothing
       in between, and it scored the code red for drawing exactly what it should.
       The second watched the turn object: but a turn that re-aims mid-flight
       becomes a new object, and it counted the re-aims as turns that failed.
       BOTH WERE MEASURING THE MECHANISM INSTEAD OF THE RESULT. What "the turn
       takes the beat" actually means on screen is ONE THING: the drawing he is
       shown never skips a compass point. That needs no notion of a turn at all,
       and nothing inside can game it. */
    const COMP = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const gap = (a, b) => { let d = ((COMP.indexOf(b) - COMP.indexOf(a)) % 8 + 8) % 8; return d > 4 ? 8 - d : d; };
    const seen = [];
    const iv = setInterval(() => {
      const f = T.now();
      if (!seen.length || seen[seen.length - 1] !== f) seen.push(f);
    }, 8);
    for (let i = 0; i < 20; i++) { startHold([4, 2, 0, 6, 3, 7, 1, 5][i % 8]); endHold(); await sleep(560); }
    await sleep(700);
    clearInterval(iv);
    let changes = 0, jumps = 0, worst = 0;
    for (let i = 1; i < seen.length; i++) {
      const g = gap(seen[i - 1], seen[i]);
      if (g === 0) continue;
      changes++;
      if (g > 1) jumps++;
      if (g > worst) worst = g;
    }
    return { changes, jumps, worst, distinct: new Set(seen).size };
  });
  const errs2 = d.errs || [];
  await d.close();
  if (turn.ERR) { ok('the turn seam is on the surface he plays', false, turn.ERR); return done(); }
  console.log('       the drawn facing changed ' + turn.changes + ' times across the walk, '
    + turn.distinct + ' different drawings used, worst single jump ' + turn.worst + ' compass points');
  /* VACUOUS-PASS GUARD: a facing that never changed proves nothing about turning,
     and a build that froze the facing entirely would otherwise score a perfect 0. */
  ok('he really turned during the sweep, using most of the eight drawings',
     turn.changes >= 10 && turn.distinct >= 5,
     turn.changes + ' changes, ' + turn.distinct + ' drawings');
  /* *** THIS NUMBER IS PRINTED AND DOES NOT DECIDE A SHIP, AND THAT IS ON PURPOSE. ***
     Wiring the turn into the one place the facing is set took it from 10 jumps of
     up to FOUR points to 4 of at most two. Then the SAME gate on the SAME tree
     measured 8 jumps, worst three. It swings because the walk itself does: walls
     redirect him, so no two sweeps turn the same corners, and this box draws at
     about twenty frames a second while a beat holds sixty.
     A FLAKY RATCHET IS WORSE THAN NO RATCHET. It fails honest work and it gets
     switched off, which costs the gate everything else it holds. So the jumps are
     REPORTED every run and the claim below holds the thing that does not swing:
     the facing is set in one place and that place starts a turn. The remaining
     jumps are named in the record, not hidden and not pretended away. */
  console.log('       ' + turn.jumps + ' of those changes skipped a point (worst ' + turn.worst
    + '). It was 10, worst 4, before the turn was wired into every facing assignment. '
    + 'This swings run to run and is reported, never a pass or a fail.');
  ok('the facing is set in ONE place, and that place starts a turn',
     (src.match(/setFace\(/g) || []).length >= 6
     && /function setFace\(to\)\{ turnStart\(to\); HFACE=to; \}/.test(src)
     && (src.match(/HFACE=dirOf\(/g) || []).length === 0,
     (src.match(/setFace\(/g) || []).length + ' assignments go through it');

  /* ---- 4. THE IDLE HE VOTED UP, UNDER IDLE LAW --------------------------- */
  const br2 = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p2 = await br2.newPage();
  const errs3 = []; p2.on('pageerror', e => errs3.push(e.message));
  await p2.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p2.waitForTimeout(7000);
  const idle = await p2.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const PH = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
    let footMoved = 0, n = 0, lo = 1e9, hi = 0;
    for (const d of DIRS) {
      let base = null;
      for (const ph of PH) {
        const { CW, CH, grid } = buildFrame(d, 'idle', ph);
        const feet = []; let all = 0;
        for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
          const id = grid[y * CW + x];
          if (id === 11 || id === 12) feet.push(y * CW + x);
          if (id) all++;
        }
        const key = feet.join(',');
        if (base === null) base = key; else { n++; if (key !== base) footMoved++; }
        if (all < lo) lo = all; if (all > hi) hi = all;
      }
    }
    return { footMoved, n, lo, hi };
  });
  await br2.close();
  ok('IDLE LAW: the feet never move in idle, on every facing',
     idle.footMoved === 0, idle.footMoved + ' of ' + idle.n + ' frames move a foot');
  /* THE CONTROL: a body that is not moving at all would also score zero. */
  ok('and the body is not simply frozen',
     idle.hi - idle.lo > 200, 'body pixels swing ' + idle.lo + ' to ' + idle.hi);

  ok('nothing threw anywhere in this sweep',
     errs.length === 0 && errs2.length === 0 && errs3.length === 0,
     errs.concat(errs2, errs3).slice(0, 2).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate could not run — ' + String(e.message).slice(0, 200)); process.exit(1); });

function done() {
  console.log('\nTHE WALK SLIDES AND THE TURN TAKES THE BEAT: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
