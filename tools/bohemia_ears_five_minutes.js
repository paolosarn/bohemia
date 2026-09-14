/* ============================================================================
   FIVE MINUTES, BY EAR (9/14/26, SOUNDS lane)

   RULE 14 (Paolo 9/13, LOCKED): THE DEMO'S FIRST FIVE MINUTES ON A PHONE IS THE ONLY
   MEASURE OF THE GAME. His break list names streets, a freeway, two buttons, dead
   cards, no fight, no fast travel and glitches. NOT ONE OF THEM IS A SOUND, so under
   14(b) this lane holds -- and rule 12 says a lane MEASURES the premise instead of
   taking it. NOBODY HAS EVER MEASURED WHAT A STRANGER HEARS IN THOSE FIVE MINUTES.
   This does that, and either finds this lane a break or says it holds with a number.

   IT USES THE ONE DRIVER (rule 14g) and extends it with `beforeTap`, because the ear
   has to be in place BEFORE the door opens: the front tap is the first sound in the
   game and the song takes the beat off the pulse a moment later, so a recorder
   installed after the tap measures the wrong five minutes.

   WHAT IT RECORDS, all on the real audio path, on the real demo, on a phone profile:
     * every sound the game ASKS FOR (playSFX by name, synthV and drumV by voice),
       with the wall-clock second it was asked for;
     * what the master bus ACTUALLY PUT OUT, metered every 250 ms, so silence is
       MEASURED silence and not inferred from a missing call -- a call that renders
       nothing and a call that was never made look identical from the call log alone;
     * the AudioContext's own state, because a suspended context makes every one of
       those calls a lie;
     * the longest run of silence, which is the thing a stranger actually notices;
     * page errors and console errors, filtered for the audio ones.

   THE ROUTE IS A STRANGER'S, not a test's: boot, the card, stand still and listen,
   walk, pinch out to the city, listen there, pinch back, walk again. Five minutes of
   wall clock from the tap, timed, never faked.

   NEVER REPORT A BREAK YOU HAVE NOT REPRODUCED. For sound that means the meter and
   the call log have to agree before anything here is called a break.

   USE IT:  node tools/bohemia_ears_five_minutes.js [BOHEMIA_DEMO.html] [seconds]
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');

const FILE = process.argv[2] || 'BOHEMIA_DEMO.html';
const SECS = parseInt(process.argv[3] || '300', 10);
const OUT = process.argv[4] || path.join(__dirname, '..', 'records',
  'BOHEMIA_EARS_FIVE_MINUTES_' + FILE.replace(/\W+/g, '_') + '.json');

/* installed in the PAGE, not the city frame: the whole sound engine lives in the
   shell and the frame only posts messages to it */
function EAR() {
  window.__ear = { asks: [], meter: [], t0: performance.now(), notes: 0, errs: [] };
  const E = window.__ear;
  const at = () => +((performance.now() - E.t0) / 1000).toFixed(2);

  const wrap = (name, kind) => {
    const real = window[name];
    if (typeof real !== 'function') { E.errs.push('no ' + name); return; }
    window[name] = function (a) {
      try {
        if (kind === 'sfx') E.asks.push({ t: at(), k: 'sfx', n: String(a) });
        else { E.notes++; if (E.asks.length < 4000) E.asks.push({ t: at(), k: kind, n: String(a) }); }
      } catch (e) {}
      return real.apply(this, arguments);
    };
  };
  wrap('playSFX', 'sfx');
  wrap('synthV', 'v');
  wrap('drumV', 'd');

  /* *** AND THE FOOTSTEPS COME THROUGH A DIFFERENT DOOR, which is the fourth fault
     this instrument had and the one that would have shipped a false headline. The
     first fixed run said THREE SOUNDS IN FIVE MINUTES AND NO FOOTSTEPS while proving
     the player walked 29 cells. It is not true: stepSfx() builds its own event name
     and renders straight out of the step bank -- it NEVER passes through playSFX -- so
     an ear hooked only on playSFX is structurally deaf to every footstep in the game.
     AN EAR AT ONE DOOR CANNOT HEAR WHAT COMES THROUGH ANOTHER.
     Worse, this was already written down: gates/every_sound_is_reachable_gate.py hooks
     the message for exactly this reason and its own comments say the hour chime bypasses
     playSFX too. I wrote a hook set without reading the known-good one. So this now
     matches that gate's doors: the city's own messages, and BOH_SFX.render for a count
     of what was really rendered. */
  window.addEventListener('message', function (e) {
    const m = e && e.data; if (!m) return;
    try {
      if (m.type === 'BOHEMIA_STEP' && m.surface) E.asks.push({ t: at(), k: 'sfx', n: 'step_' + m.surface });
      if (m.bohemiaCitySfx && m.bohemiaCitySfx.ev) E.asks.push({ t: at(), k: 'sfx', n: m.bohemiaCitySfx.ev });
      if (m.bohemiaCitySting && m.bohemiaCitySting.fig) E.asks.push({ t: at(), k: 'sfx', n: 'sting:' + m.bohemiaCitySting.fig });
    } catch (err) {}
  });
  E.renders = 0;
  try {
    if (typeof BOH_SFX !== 'undefined' && BOH_SFX.render) {
      const r = BOH_SFX.render;
      BOH_SFX.render = function () { E.renders++; return r.apply(this, arguments); };
    } else E.errs.push('no BOH_SFX.render');
  } catch (err) { E.errs.push('BOH_SFX hook threw'); }
  /* CAN A FOOTSTEP SOUND AT ALL IN THIS BUILD? stepSfx returns silently when the step
     bank is empty ("nothing judged -> silence, on purpose"), so the bank's own size is
     the difference between "the game chose not to" and "the game cannot". */
  try {
    E.stepBank = (typeof STEP_BANK !== 'undefined' && STEP_BANK)
      ? Object.keys(STEP_BANK).map(k => k + ':' + (STEP_BANK[k] || []).length) : null;
  } catch (err) { E.stepBank = 'unreadable'; }
  /* AND THE TWO THINGS THAT DECIDE WHY A SILENCE IS A SILENCE: whether the street is
     RESTING (the duck this lane shipped on 9/11, one phrase between songs) and whether
     the ambience BED ever gets asked for. A hole and a rest look identical on a meter;
     only these two say which one you are listening to. */
  E.rest = []; E.bed = 0;
  try {
    if (window.__AMB && window.__AMB.pick) {
      const pk = window.__AMB.pick;
      window.__AMB.pick = function () { const r = pk.apply(this, arguments);
        E.bed++; E.asks.push({ t: at(), k: 'bed', n: String(r) }); return r; };
    } else E.errs.push('no __AMB.pick');
  } catch (err) { E.errs.push('AMB hook threw'); }
  E.restTick = setInterval(function () {
    try { E.rest.push({ t: at(), resting: !!CITYMUS.resting, on: !!CITYMUS.on,
                        step: MUS.step }); } catch (e) {}
  }, 500);

  /* THE METER IS THE HALF THAT CANNOT LIE. A call log says what was ASKED FOR; only
     a meter says what came out. The analyser goes on the very end of the chain --
     the limiter if it is reachable, because that is the only node that sees
     everything mixed. */
  E.startMeter = function () {
    try {
      /* MUS IS A TOP-LEVEL const, NOT A PROPERTY OF window, and this instrument's
         first run forgot that after this very session had already written it down.
         `window.MUS && MUS.AC` short-circuits to false, so the meter never started
         and the run reported no AudioContext on a page whose music was provably
         playing (1,473 notes in the call log). A GUARD THAT NAMES THE WRONG SCOPE
         SILENCES THE MEASUREMENT, NOT THE GAME. Bare reference in a try, which is
         what resolves a const in the script's own scope. */
      let M = null; try { M = MUS; } catch (e) {}
      const AC = M && M.AC; if (!AC) { E.errs.push('no AC'); return; }
      const tap = window.__LIMITER || window.__OUTBUS || M.OUT || M.MAST || AC.destination;
      const an = AC.createAnalyser(); an.fftSize = 2048;
      try { tap.connect(an); } catch (e) { E.errs.push('meter could not connect'); return; }
      const buf = new Float32Array(an.fftSize);
      E.meterOn = (window.__LIMITER ? 'LIMITER' : (window.__OUTBUS ? 'OUTBUS' : 'MAST'));
      E.tick = setInterval(() => {
        an.getFloatTimeDomainData(buf);
        let pk = 0, sq = 0;
        for (let i = 0; i < buf.length; i++) { const v = Math.abs(buf[i]); if (v > pk) pk = v; sq += v * v; }
        E.meter.push({ t: at(), pk: +pk.toFixed(5), rms: +Math.sqrt(sq / buf.length).toFixed(5),
                       st: AC.state });
      }, 250);
    } catch (e) { E.errs.push('meter threw: ' + e.message); }
  };
  return true;
}

(async () => {
  const out = { ok: true, file: FILE, secs: SECS, when: new Date().toISOString() };
  let d = null;
  try {
    d = await D.open({
      file: FILE,
      beforeTap: async (page) => { await page.evaluate(EAR); }
    });
    /* the meter can only start once the tap has built the audio graph */
    await d.page.evaluate(() => { try { window.__ear.startMeter(); } catch (e) {} });

    const console_ = [];
    d.page.on('console', m => { if (m.type() === 'error') console_.push(String(m.text()).slice(0, 180)); });

    const t0 = Date.now();
    const left = () => SECS * 1000 - (Date.now() - t0);
    /* *** THE PAD IS A RING WITH A DEAD CENTRE, AND THE FIRST RUN TAPPED THE CENTRE.
       Measured in the city file: eight wedges from radius 50 to 86 in a 180 box, with
       a 40-radius face in the middle that is not a direction. So forty taps on the
       middle of the pad were forty taps on nothing, and the run reported no footsteps
       in five minutes about a player who never took a step. A TAP ON A CONTROL IS NOT
       AN INPUT TO IT.
       This taps a WEDGE (north, 68/180 of the box above centre) and then PROVES the
       player moved by reading the engine's own hx/hy before and after. If the walk did
       not walk, that is reported as an instrument failure and NOT as silence. */
    const walkN = async (taps) => {
      const before = await d.state();
      const h = await d.fr.$('#pad');
      if (!h) { out.padMissing = true; return { before: before, after: before, moved: 0 }; }
      const b = await h.boundingBox();
      if (!b) { out.padMissing = true; return { before: before, after: before, moved: 0 }; }
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      const up = (68 / 180) * b.height;
      for (let i = 0; i < taps; i++) {
        if (left() <= 0) break;
        await d.tapAt(cx, cy - up);
        await d.page.waitForTimeout(600);
      }
      const after = await d.state();
      const moved = (before.hx == null || after.hx == null) ? null
        : Math.abs(after.hx - before.hx) + Math.abs(after.hy - before.hy);
      return { before: before, after: after, moved: moved };
    };

    const step = async (label, ms, fn) => {
      if (left() <= 0) return;
      out.route = out.route || [];
      out.route.push({ at: +((Date.now() - t0) / 1000).toFixed(1), did: label });
      if (fn) await fn();
      const w = Math.min(ms, Math.max(0, left()));
      if (w > 0) await d.page.waitForTimeout(w);
    };

    /* A STRANGER'S FIVE MINUTES, and the first minute is STANDING STILL on purpose:
       that is the one thing this lane has an open row about and has never measured on
       the demo he plays. */
    await step('stand still and listen', 60000);
    await step('walk', 90000, async () => { out.walk1 = await walkN(40); });
    await step('pinch out to the city', 45000, async () => { await d.pinchOut(); });
    await step('pinch back to the street', 45000, async () => { await d.pinchIn(); });
    await step('walk again', 60000, async () => { out.walk2 = await walkN(24); });
    while (left() > 0) await d.page.waitForTimeout(Math.min(2000, left()));

    out.ear = await d.page.evaluate(() => {
      const E = window.__ear;
      try { clearInterval(E.tick); } catch (e) {}
      try { clearInterval(E.restTick); } catch (e) {}
      let M = null; try { M = MUS; } catch (e) {}
      return {
        asks: E.asks, meter: E.meter, notes: E.notes, errs: E.errs,
        renders: E.renders, stepBank: E.stepBank, rest: E.rest, bed: E.bed,
        meterOn: E.meterOn || null,
        acState: (M && M.AC) ? M.AC.state : null,
        acTime: (M && M.AC) ? +M.AC.currentTime.toFixed(2) : null,
        musPlaying: !!(M && M.playing),
        song: (M && M.fac && M.fac()) ? M.fac().n : null,
        step: (M && M.step != null) ? M.step : null,
        players: ['CITYMUS', 'MENUMUS', 'FIGHTMUS', 'INTERIORMUS']
          .filter(n => typeof window[n] !== 'undefined')
          .map(n => ({ n: n, on: !!window[n].on })),
        pulse: (typeof window.__pulseState === 'function') ? window.__pulseState() : null
      };
    });
    out.state = await d.state();
    out.pageErrors = d.errs.slice(0, 10);
    out.consoleErrors = console_.slice(0, 10);
  } catch (e) {
    out.ok = false; out.why = String(e && e.message || e).slice(0, 400);
  } finally { if (d) await d.close().catch(() => {}); }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  const e = out.ear || {};
  const sfx = (e.asks || []).filter(x => x.k === 'sfx');
  const names = {}; for (const s of sfx) names[s.n] = (names[s.n] || 0) + 1;
  const m = e.meter || [];
  let quiet = 0, worst = 0, worstAt = null;
  for (const r of m) {
    if (r.pk < 0.002) { quiet++; if (quiet * 0.25 > worst) { worst = quiet * 0.25; worstAt = r.t; } }
    else quiet = 0;
  }
  console.log(JSON.stringify({
    ok: out.ok, why: out.why, file: FILE,
    secondsWalked: out.route ? out.route[out.route.length - 1].at : null,
    soundsAsked: sfx.length, distinctSounds: Object.keys(names).length, names: names,
    /* THE CONTROL ON THE WALK: cells moved, read off the engine. A footstep claim is
       worthless without it. */
    walkMoved: [out.walk1 && out.walk1.moved, out.walk2 && out.walk2.moved],
    padMissing: !!out.padMissing,
    musicNotes: e.notes, rendersOfEffects: e.renders, stepBank: e.stepBank,
    bedAsked: e.bed,
    secondsResting: e.rest ? +(e.rest.filter(r => r.resting).length * 0.5).toFixed(1) : null,
    musicNotesSong: e.song, acState: e.acState, meterOn: e.meterOn,
    meterSamples: m.length,
    longestSilenceSec: worst, longestSilenceEndedAt: worstAt,
    pageErrors: out.pageErrors, consoleErrors: out.consoleErrors, earErrs: e.errs,
    out: path.relative(path.join(__dirname, '..'), OUT)
  }, null, 1));
})();
