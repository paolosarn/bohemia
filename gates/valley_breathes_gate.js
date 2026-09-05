/* BOHEMIA -- THE VALLEY KEEPS BREATHING GATE (ANIMATION lane, 9/5/26)
 *
 * FACTORY LAW: new law, new gate, same turn.
 *
 * WHAT IT PROTECTS. Measured on the real surface before any of this was written:
 * standing still in the walked city for three seconds, render() was called ONCE.
 * The whole valley -- the crowd, and the 19 animals already written to move off
 * performance.now()/500 -- was a still photograph the moment the player stopped
 * walking. animate() runs a rAF loop for exactly one BEAT after a step and then
 * cancels itself, so nothing on the clock was being asked to tick.
 *
 * THE THREE CLAIMS, and each one is a way the feature dies silently:
 *
 *  1. THE HEARTBEAT BEATS. render() is called repeatedly with no input. If the
 *     interval is ever removed or its guards go wrong, everything below still
 *     "works" and nothing moves, which is the exact state this shipped to fix.
 *
 *  2. THE CROWD HAS BREATH FRAMES. The city cast used to be baked as ONE still of
 *     a clip that moves. Asserted on the DECODED cast inside the city frame, not
 *     on the bake -- the bake sending them and the decoder keeping them are two
 *     different failures and the RUN cast proves they come apart (it has walk
 *     frames the city never got).
 *
 *  3. NOBODY BREATHES IN UNISON, AND THIS ONE ALMOST SHIPPED BROKEN. The first
 *     cut offset each person by `(p.id>>>0)`. personFields gives `id` as a STRING
 *     ("nx:ny:i"), so that expression is 0 for EVERY person in the valley: the
 *     whole crowd would have breathed on the same frame on the same beat, nothing
 *     would have thrown, and the code would have read as though it staggered them.
 *     So this claim reads the OUTPUT -- how many DISTINCT frames the roster is
 *     actually holding at one instant -- and never the offset it was handed. A
 *     check that reads what you gave it is not a check (8/27).
 */
const path = require('path');
const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== VALLEY BREATHES GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2500);
  /* TAP THE SPLASH THE WAY A FINGER TAPS IT (8/30): hiding it with display:none
     leaves #app hidden and every screenshot comes back black. */
  await pg.click('#front').catch(() => {});
  await SETTLE(pg, 1500);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'city'); if (t) t.click(); });
  await SETTLE(pg, 5000);

  let cf = null;
  for (const fr of pg.frames()) {
    try { if (await fr.evaluate(() => typeof render === 'function' && typeof ctBody === 'function')) { cf = fr; break; } } catch (e) {}
  }
  ok('the walked city frame is up', !!cf);
  if (!cf) { await b.close(); done(); }

  /* 1. THE HEARTBEAT BEATS -- no input at all for two and a bit seconds. */
  const beatR = await cf.evaluate(async () => {
    let n = 0; const orig = window.render;
    window.render = function () { n++; return orig.apply(this, arguments); };
    await new Promise(r => setTimeout(r, 2200));
    window.render = orig;
    return { calls: n, mode: MODE };
  });
  ok(`the valley redraws while the player stands still (${beatR.calls} renders in 2.2s of no input, was 1 in 3s)`,
     beatR.calls >= 3);

  /* 2 + 3. THE CROWD, read off the DECODED cast and the REAL roster. */
  const crowd = await cf.evaluate(() => {
    const out = { castN: 0, breathe: 0, people: 0, distinctFrames: 0, phases: {} };
    if (!window.CAST_CV || !CAST_CV.length) return out;
    out.castN = CAST_CV.length;
    const first = CAST_CV[0];
    const s = first.S || first[Object.keys(first)[0]];
    out.breathe = (s && s.breathe) ? s.breathe.length : 0;

    const NB = BohemiaPopulation.NB, span = NB * FN;
    const pn = [Math.floor(hx / span), Math.floor(hy / span)];
    /* *** AND THE FIRST VERSION OF THIS CLAIM WAS PARTLY VACUOUS, caught by its own
       mutation run: it counted distinct frames over the WHOLE roster, and the six
       cast looks are six different bodies, so it read 6 distinct and passed even
       with the breath cycle deleted. THE LOOK SUPPLIED THE VARIETY, NOT THE BREATH.
       Held constant now -- one look, one facing -- so the ONLY thing left that can
       make two of these frames differ is the phase offset this claim is about. */
    /* *** AND THE SECOND VERSION WAS STILL WRONG, caught by mutating in the exact
       bug this claim exists for (offset always 0) and watching the gate pass. The
       sweep over ~289 people takes longer than a 500ms BEAT, so `beat` inside
       ctBody CHANGED PART WAY THROUGH THE LOOP and TIME supplied the variety. It
       was measuring when the test ran, not whether the crowd is staggered -- the
       same shape as the 8/30 gate whose answer depended on where its walker
       stopped. So the instant is made into an actual instant: performance.now()
       is pinned while sampling, and the only thing left that can separate two
       bodies is the offset. */
    const _now = performance.now, _fixed = _now.call(performance);
    performance.now = function () { return _fixed; };
    const byLook = new Map();
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = pn[0] + dx, ny = pn[1] + dy;
      if (nx < 0 || ny < 0) continue;
      let ppl = []; try { ppl = pplPeople(nx, ny); } catch (e) { continue; }
      for (const person of ppl) {
        out.people++;
        const lk = (person.look >>> 0) % CAST_CV.length;
        if (!byLook.has(lk)) byLook.set(lk, new Set());
        const cvn = ctBody(person, 'S');
        if (cvn) byLook.get(lk).add(cvn);
        const ph = (typeof ctPhase === 'function') ? ctPhase(person) % Math.max(1, out.breathe) : 0;
        out.phases[ph] = (out.phases[ph] || 0) + 1;
      }
    }
    performance.now = _now;
    let mx = 0;
    for (const set2 of byLook.values()) if (set2.size > mx) mx = set2.size;
    out.distinctFrames = mx;          /* distinct frames among people wearing the SAME body */
    out.looksSeen = byLook.size;
    return out;
  });

  ok(`the city cast is baked with a breath cycle, not one still (${crowd.breathe} frames per facing, ${crowd.castN} looks)`,
     crowd.breathe >= 2);
  ok(`there is a roster to measure (${crowd.people} people around the player)`, crowd.people >= 8);
  ok(`the crowd does not breathe in unison -- ${crowd.distinctFrames} distinct frames among people wearing the SAME body, one facing, one instant`,
     crowd.distinctFrames >= 2);
  const used = Object.keys(crowd.phases).length;
  ok(`every breath phase is in use across the roster (${used} of ${crowd.breathe} phases: ${JSON.stringify(crowd.phases)})`,
     used >= Math.min(crowd.breathe, 3));

  /* the whole point is what he sees: the drawn pixels have to change on the beat */
  const shots = [];
  for (let i = 0; i < 3; i++) {
    shots.push(require('crypto').createHash('sha1').update(await pg.screenshot()).digest('hex'));
    await new Promise(r => setTimeout(r, 600));
  }
  ok(`the screen he is looking at actually changes between beats (${new Set(shots).size} of 3 distinct)`,
     new Set(shots).size >= 2);

  ok('no page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close();
  done();
})();
