/* BOHEMIA -- THE APPROACH IS THE TELL GATE (ANIMATION lane, 9/6/26)
 *
 * FACTORY LAW: new behaviour, new gate, same turn.
 * Record: records/BOHEMIA_THE_APPROACH_IS_THE_TELL_9_6_26.md
 *
 * WHAT IT PROTECTS. DIRECTION judged the shipped hostiles at phone size and all
 * three questions came back NO: they do not read as dangerous, as Cartel, or at
 * all -- THEY ARE THE CROWD. The coordinator's research says the cheapest fix is
 * free, because MOTION is a preattentive channel: everybody else walks past, a
 * hostile walks AT YOU.
 *
 * MEASURED BEFORE ANY OF IT WAS WRITTEN, walking a crew down from ten cells:
 *     dist 8..4   watch   every body STILL, on its corner
 *     dist 3      close   four bodies TELEPORT to [-1,0] [-1,1] [1,0] [0,1]
 *     dist 3,2,1,0        those offsets NEVER CHANGE again
 * and every one of them drawn with set.idle, a single still frame. Since the
 * residents started breathing, the most static bodies on the street were the
 * dangerous ones.
 *
 * THE FOUR CLAIMS, each a way this dies quietly:
 *
 *  1. THEY CLOSE. A body's distance to the player shrinks as the player walks in,
 *     instead of sitting on a corner until it snaps. This is the whole row.
 *  2. THEY NEVER TELEPORT. No body moves more than a bounded step in one beat.
 *     A version that "closes" by jumping satisfies claim 1 and is the exact defect
 *     this replaced.
 *  3. THEY STAY ON THE LEASH WHILE WATCHING. Within LEASH cells of crew.at, which
 *     is shorter than closeAt -- so a body can never be standing on the player
 *     while the state still says watch. The crew's cell stays the ONLY answer to
 *     where the crew is; a drifting body would be a second answer to a question
 *     stateOf is still reading the first one for.
 *  4. A MOVING BODY IS DRAWN WALKING. Checked on HOST_SPR, which records the
 *     sprite the frame actually blitted -- not the flag that chooses it, which
 *     would be a check reading its own input.
 *
 * AND THE FIGHT TIMING IS DELIBERATELY NOT ASSERTED HERE. streetFightOnStep posts
 * the encounter on the same step the state turns close, so there is no beat
 * between closing and fighting. That is real, it is RUN's, and it is bounced in
 * this lane's handoff rather than pinned by a gate this lane owns.
 */
const path = require('path');
const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== THE APPROACH IS THE TELL: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

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
  await pg.click('#front').catch(() => {});
  await SETTLE(pg, 1500);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'city'); if (t) t.click(); });
  await SETTLE(pg, 5000);

  let cf = null;
  for (const fr of pg.frames()) {
    try { if (await fr.evaluate(() => typeof hostilePass === 'function' && typeof HOST_STEP !== 'undefined')) { cf = fr; break; } } catch (e) {}
  }
  ok('the walked city is up and the hostile pass is in it', !!cf);
  if (!cf) { await b.close(); done(); }

  const R = await cf.evaluate(async () => {
    const out = { steps: [] };
    const danger = hostDanger();
    if (!danger.length) { out.err = 'no dangerous factions -- standings are neutral'; return out; }
    const list = BohemiaHostiles.near({ seed: seed, at: [hx, hy], radius: 40,
      probe: hostileProbe, danger: danger, density: 1.0, day: (T.day | 0) });
    if (!list.length) { out.err = 'no crews near the start'; return out; }
    const cw = list[0], pre = cw.at[0] + ',' + cw.at[1] + '|';
    out.crewAt = cw.at.slice(); out.seeAt = cw.seeAt; out.closeAt = cw.closeAt;

    /* WALK THE PLAYER IN, one cell a beat, from the far edge of watch to close */
    for (let d = cw.seeAt; d >= cw.closeAt; d--) {
      __proof.setPos(cw.at[0] + d, cw.at[1]);
      const before = {};
      for (const k in HOST_STEP) if (k.indexOf(pre) === 0) before[k] = { x: HOST_STEP[k].x, y: HOST_STEP[k].y };
      let maxJump = 0;
      for (let t = 0; t < 3; t++) {
        render();
        await new Promise(r => setTimeout(r, 520));
        for (const k in HOST_STEP) {
          if (k.indexOf(pre) !== 0 || !before[k]) continue;
          const j = Math.hypot(HOST_STEP[k].x - before[k].x, HOST_STEP[k].y - before[k].y);
          if (j > maxJump) maxJump = j;
          before[k] = { x: HOST_STEP[k].x, y: HOST_STEP[k].y };
        }
      }
      const st = BohemiaHostiles.stateOf(cw, [__proof.hx, __proof.hy]);
      const bodies = [];
      for (const k in HOST_STEP) {
        if (k.indexOf(pre) !== 0) continue;
        const q = HOST_STEP[k];
        bodies.push({ k: k,
          toPlayer: Math.hypot(q.x - __proof.hx, q.y - __proof.hy),
          offCorner: Math.hypot(q.x - cw.at[0], q.y - cw.at[1]),
          mv: q.mv, spr: HOST_SPR[k] || null });
      }
      out.steps.push({ dist: d, state: st, maxJumpPerBeat: maxJump, bodies: bodies });
    }
    return out;
  });

  if (R.err) { ok('a crew with a dangerous faction is reachable to measure -- ' + R.err, false); await b.close(); done(); }
  ok(`a crew was found and walked in on (${R.steps.length} player steps, seeAt ${R.seeAt}, closeAt ${R.closeAt})`,
     R.steps.length >= 4);

  /* 1. THEY CLOSE -- AND THE FIRST VERSION OF THIS CLAIM WAS SATISFIED BY THE
     PLAYER'S OWN LEGS. It compared nearest-body-to-player at the start against
     the end, which shrinks whether or not anybody approaches, because the PLAYER
     is the thing walking. Mutated to LEASH 0 -- the exact old behaviour, four
     bodies glued to a corner -- and it still passed. A check that the test itself
     satisfies is not a check (the 8/30 walker again).
     THE HONEST MEASURE IS THE GAP THEY OPEN: how much nearer to the player the
     bodies are than their own corner is. Standing still on the corner that gap is
     zero at every distance; only walking toward him grows it. */
  const gapOf = s => Math.max.apply(null, s.bodies.map(bd =>
    Math.hypot(R.crewAt[0] - (R.crewAt[0] + s.dist), R.crewAt[1] - R.crewAt[1]) - bd.toPlayer));
  const first = R.steps[0], last = R.steps[R.steps.length - 1];
  const g0 = gapOf(first), g1 = gapOf(R.steps[R.steps.length - 2]);
  ok(`the crew closes the ground ITSELF, not just because the player walks in ` +
     `(bodies are ${g0.toFixed(2)} -> ${g1.toFixed(2)} cells nearer him than their corner is)`,
     g1 > g0 + 0.3);
  const off0 = Math.max.apply(null, first.bodies.map(x => x.offCorner));
  const offLast = Math.max.apply(null, R.steps[R.steps.length - 2].bodies.map(x => x.offCorner));
  ok(`and it does it by STEPPING OFF THE CORNER, not by waiting there (${off0.toFixed(2)} -> ${offLast.toFixed(2)} cells off)`,
     offLast > off0 + 0.3);

  /* 2. NEVER A TELEPORT */
  const worstJump = Math.max.apply(null, R.steps.map(s => s.maxJumpPerBeat));
  ok(`no body ever teleports: the biggest move in one beat is ${worstJump.toFixed(2)} cells`, worstJump <= 1.2);

  /* 3. THE LEASH HOLDS WHILE WATCHING */
  const LEASH = 1.5;
  const watchSteps = R.steps.filter(s => s.state === 'watch');
  let overLeash = 0, worstOff = 0;
  for (const s of watchSteps) for (const bd of s.bodies) {
    if (bd.offCorner > worstOff) worstOff = bd.offCorner;
    if (bd.offCorner > LEASH + 0.05) overLeash++;
  }
  ok(`watching, every body stays inside the ${LEASH}-cell leash on its corner (worst ${worstOff.toFixed(2)}, ${overLeash} over)`,
     watchSteps.length > 0 && overLeash === 0);
  ok(`the leash is shorter than closeAt (${LEASH} < ${R.closeAt}), so a watching body can never be standing on the player`,
     LEASH < R.closeAt);

  /* 4. A MOVING BODY IS DRAWN WALKING */
  let moving = 0, movingWalk = 0;
  for (const s of R.steps) for (const bd of s.bodies) if (bd.mv) { moving++; if (bd.spr === 'walk') movingWalk++; }
  ok(`a body that is moving is drawn WALKING, not as a still (${movingWalk}/${moving} moving bodies blitted a walk frame)`,
     moving > 0 && movingWalk === moving);

  ok('no page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close();
  done();
})();
