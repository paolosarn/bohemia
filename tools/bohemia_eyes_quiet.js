/* BOHEMIA -- EYES AND EARS -- TEN SECONDS OF STANDING STILL  (E12 round 2, 9/6/26)
 *
 * THE JOB (VAMILY lane 17, E12 [silence standing]):
 *   "Measure what a player hears in ten seconds of standing still, in three places,
 *    and hand SOUNDS the gap list."
 *
 * WHAT SCHOOL CHANGED, AND THE MODE REQUIRES ME TO SAY IT
 *   records/BOHEMIA_EYES_E12_ROUND_1_SCHOOL_WHAT_A_QUIET_PLACE_SOUNDS_LIKE_9_6_26.md
 *
 *   Round one's counter-finding was that MEASURING A LEVEL IS THE WRONG INSTRUMENT.
 *   A silent valley and a valley with a properly quiet bed differ by a handful of
 *   decibels and both read as "quiet". A level meter alone would have printed
 *   "quiet, quiet, quiet" across all three places and taught us nothing. So this
 *   measures FOUR things, and level is only one of them:
 *
 *     1 FLOOR        K-weighted loudness (BS.1770) and true peak over the ten seconds
 *     2 EVENT RATE   how many distinct sound calls the game fired
 *     3 SPECTRUM     is the frequency range occupied, or is it a hole
 *     4 DIFFERENCE   do the places differ from each other at all (the SOUNDMARK question)
 *
 *   School also gave the vocabulary: KEYNOTE (the background everything is heard
 *   against), SIGNAL (foreground, listened to on purpose), SOUNDMARK (unique to one
 *   place). We have signals. Question 1 asks about the keynote and question 4 asks
 *   about the soundmark, which nobody in this project had ever named.
 *
 * HOW THE TAP WORKS, AND WHY IT IS NOT A GREP OR AN OFFLINE RENDER
 *   E4 rendered every sound ALONE in an OfflineAudioContext. That cannot answer this
 *   question, because standing still is about what the game DOES, not about what an
 *   asset sounds like. So an init script patches AudioNode.prototype.connect before
 *   any page script runs: anything that connects to a real destination is ALSO
 *   connected to a silent tap (K-weighting filters -> analyser -> script processor ->
 *   zero gain). The tap therefore hears the true mixed output of the running game,
 *   including anything I do not know the name of.
 *
 * RULE ZERO (E9), AND THIS IS THE MOST DANGEROUS JOB IN THE QUEUE FOR IT
 *   A ten-second capture reporting ZERO is exactly what a broken tap reports. This
 *   lane has already printed a confident zero off counters nobody incremented. So
 *   every run ends with a POSITIVE CONTROL: fire one known sound by hand and refuse
 *   to report any silence unless the tap saw that sound arrive. No control, no finding.
 *
 * OUT: records/BOHEMIA_EYES_QUIET_9_6_26.json
 */
const path = require('path'), fs = require('fs');
function pw(){ for (const p of ['/opt/node22/lib/node_modules/playwright','playwright','/usr/lib/node_modules/playwright','/usr/local/lib/node_modules/playwright']) { try { return require(p); } catch(e){} } throw new Error('playwright not found'); }
const { chromium } = pw();
const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true };
const SECONDS = 10;

/* installed before any page script, in every frame */
const TAP = `
(() => {
  if (window.__EYES_TAP) return;
  const W = window;
  const origConnect = AudioNode.prototype.connect;   // the un-patched one, used for ALL of our own wiring
  const tapByCtx = new Map();
  let building = false;
  W.__EYES_TAP = { taps: [], contexts: 0, err: null, recursionGuardHits: 0 };

  // BS.1770 K-weighting. These coefficients are the 48 kHz ones; if the context is not
  // 48 kHz the weighting is approximate and the record says so rather than hiding it.
  const K1B = [1.53512485958697, -2.69169618940638, 1.19839281085285];
  const K1A = [1, -1.69065929318241, 0.73248077421585];
  const K2B = [1.0, -2.0, 1.0];
  const K2A = [1, -1.99004745483398, 0.99007225036621];

  function makeTap(ctx) {
    // BUG 1, AND IT COST A WHOLE RUN: the first version registered the tap only AFTER
    // wiring it, and its own mute -> destination connect re-entered the patched connect,
    // found no tap yet, and built another. 3172 taps and a stack overflow. Register the
    // tap in the map BEFORE any wiring, wire only with origConnect, and hold a guard.
    const t = { ctx, on:false, n:0, sumsq:0, peak:0, blocks:0, spec:null, specN:0,
                rate: ctx.sampleRate, mine: new Set() };
    tapByCtx.set(ctx, t);
    W.__EYES_TAP.taps.push(t);
    W.__EYES_TAP.contexts++;
    try {
      const inNode = ctx.createGain(); inNode.gain.value = 1; t.mine.add(inNode);
      let head = inNode;
      try {
        const k1 = ctx.createIIRFilter(K1B, K1A); t.mine.add(k1);
        const k2 = ctx.createIIRFilter(K2B, K2A); t.mine.add(k2);
        origConnect.call(head, k1); origConnect.call(k1, k2); head = k2; t.kWeighted = true;
      } catch (e) { t.kWeighted = false; t.kErr = String(e).slice(0,80); }
      const an = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0; t.mine.add(an);
      origConnect.call(head, an);
      if (ctx.createScriptProcessor) {
        const sp = ctx.createScriptProcessor(4096, 1, 1); t.mine.add(sp);
        const mute = ctx.createGain(); mute.gain.value = 0; t.mine.add(mute);
        origConnect.call(head, sp);
        origConnect.call(sp, mute);
        origConnect.call(mute, ctx.destination);   // origConnect, so the patch never sees it
        sp.onaudioprocess = (e) => {
          if (!t.on) return;
          const d = e.inputBuffer.getChannelData(0);
          for (let i = 0; i < d.length; i++) { const v = d[i]; t.sumsq += v*v; const a = v < 0 ? -v : v; if (a > t.peak) t.peak = a; }
          t.n += d.length; t.blocks++;
        };
        t.sp = sp;
      }
      t.inNode = inNode; t.an = an;
    } catch (e) { W.__EYES_TAP.err = String(e).slice(0,160); }
    return t;
  }

  AudioNode.prototype.connect = function(dest, ...rest) {
    const r = origConnect.call(this, dest, ...rest);
    try {
      if (building) { W.__EYES_TAP.recursionGuardHits++; return r; }
      if (dest && dest.context && dest === dest.context.destination) {
        let t = tapByCtx.get(dest.context);
        if (!t) { building = true; try { t = makeTap(dest.context); } finally { building = false; } }
        if (t && t.inNode && !t.mine.has(this)) origConnect.call(this, t.inNode);
      }
    } catch (e) {}
    return r;
  };

  W.__EYES_START = () => { for (const t of W.__EYES_TAP.taps) { t.on = true; t.n=0; t.sumsq=0; t.peak=0; t.blocks=0; t.spec = t.an ? new Float32Array(t.an.frequencyBinCount) : null; t.specN = 0; } };
  W.__EYES_POLL = () => {
    for (const t of W.__EYES_TAP.taps) {
      if (!t.on || !t.spec || !t.an) continue;
      const buf = new Float32Array(t.an.frequencyBinCount);
      t.an.getFloatFrequencyData(buf);
      for (let i = 0; i < buf.length; i++) { const v = isFinite(buf[i]) ? buf[i] : -140; t.spec[i] += v; }
      t.specN++;
    }
  };
  W.__EYES_STOP = () => {
    const out = [];
    for (const t of W.__EYES_TAP.taps) {
      t.on = false;
      const rms = t.n ? Math.sqrt(t.sumsq / t.n) : 0;
      const spec = [];
      if (t.spec && t.specN) for (let i = 0; i < t.spec.length; i++) spec.push(t.spec[i] / t.specN);
      out.push({ sampleRate: t.rate, kWeighted: !!t.kWeighted, kErr: t.kErr || null,
        samples: t.n, blocks: t.blocks, expectedSamples: null,
        rms_dbfs: rms > 0 ? 20 * Math.log10(rms) : -Infinity,
        peak_dbfs: t.peak > 0 ? 20 * Math.log10(t.peak) : -Infinity,
        spectrum_db: spec, specFrames: t.specN });
    }
    return { taps: out, contexts: W.__EYES_TAP.contexts, err: W.__EYES_TAP.err, recursionGuardHits: W.__EYES_TAP.recursionGuardHits };
  };
})();
`;

/* counts the game's own sound calls, by BARE NAME.
   A top-level const is a global BINDING and not a window property. Reading
   window.MUS once made this lane report "no AudioContext" through an entire walk. */
const COUNTERS = `
(() => {
  const W = window;
  W.__EYES_CALLS = { stepSfx: 0, render: 0, wrapped: [] };
  try { if (typeof stepSfx === 'function' && !stepSfx.__eyes) {
    const o = stepSfx;
    const w = function(...a){ W.__EYES_CALLS.stepSfx++; return o.apply(this, a); };
    w.__eyes = 1;
    // a top-level FUNCTION declaration in a classic script IS a window property, unlike a
    // top-level const. So this one can be replaced through window; MUS and BOH_SFX cannot,
    // and must be reached by bare name. Read it back rather than assuming it took.
    W.stepSfx = w;
    if (typeof stepSfx === 'function' && stepSfx.__eyes) W.__EYES_CALLS.wrapped.push('stepSfx');
    else W.__EYES_CALLS.stepErr = 'assignment did not take: the binding is not the window property';
  } } catch (e) { W.__EYES_CALLS.stepErr = String(e).slice(0,80); }
  try { if (typeof BOH_SFX === 'object' && BOH_SFX && typeof BOH_SFX.render === 'function' && !BOH_SFX.render.__eyes) {
    const o = BOH_SFX.render;
    const w = function(...a){ W.__EYES_CALLS.render++; return o.apply(this, a); };
    w.__eyes = 1; BOH_SFX.render = w; W.__EYES_CALLS.wrapped.push('BOH_SFX.render');
  } } catch (e) { W.__EYES_CALLS.renderErr = String(e).slice(0,80); }
  return W.__EYES_CALLS.wrapped;
})();
`;

async function standStill(page, label, note) {
  await page.evaluate(`(${JSON.stringify(null)}, (() => { window.__EYES_CALLS.stepSfx = 0; window.__EYES_CALLS.render = 0; })())`);
  await page.evaluate('window.__EYES_START()');
  const t0 = Date.now();
  while (Date.now() - t0 < SECONDS * 1000) {
    await page.evaluate('window.__EYES_POLL()');
    await page.waitForTimeout(100);
  }
  const tap = await page.evaluate('window.__EYES_STOP()');
  const calls = await page.evaluate('({stepSfx: window.__EYES_CALLS.stepSfx, render: window.__EYES_CALLS.render, wrapped: window.__EYES_CALLS.wrapped})');
  // WHAT ELSE WAS RUNNING. Without this the floor is unattributable: music tailing off
  // looks exactly like one place being louder than another.
  const mus = await page.evaluate(`(() => { const o = {}; try { o.playing = !!MUS.playing; o.cur = String(MUS.cur||''); o.acState = MUS.AC ? MUS.AC.state : null; o.layers = MUS.layers ? (MUS.layers.length||Object.keys(MUS.layers).length) : null; } catch(e) { o.err = String(e).slice(0,80); } return o; })()`);
  return { place: label, note, seconds: SECONDS, tap, calls, music: mus, at: Date.now() };
}

function bands(spec, sampleRate, fftSize) {
  // average dB inside octave bands, so a hole is visible instead of buried in 1024 bins
  const edges = [20, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const binHz = sampleRate / fftSize;
  const out = {};
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = Math.floor(edges[i] / binHz), hi = Math.min(spec.length - 1, Math.ceil(edges[i+1] / binHz));
    let s = 0, n = 0;
    for (let b = lo; b <= hi; b++) { s += spec[b]; n++; }
    out[edges[i] + '-' + edges[i+1] + 'Hz'] = n ? +(s / n).toFixed(1) : null;
  }
  return out;
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext(PHONE);
  await ctx.addInitScript(TAP);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,160)));
  await page.goto('file://' + path.resolve('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil:'load' });
  await page.waitForTimeout(2500);
  try { await page.click('#front', { timeout:4000 }); } catch(e){}
  await page.waitForTimeout(7000);
  const wrapped = await page.evaluate(COUNTERS);

  // --muted: mute the music bus BEFORE anything is captured, so all three places are
  // measured with the soundtrack out of the way. Without this the fourth question cannot
  // be answered at all: measured with the music on, the floor swings 5 to 16 dB just from
  // the song changing while you stand still, which is as large as any difference between
  // places, so the place comparison is drowned by the thing that is not the place.
  const MUTED = process.argv.includes('--muted');
  let mutedFirst = null;
  if (MUTED) {
    mutedFirst = await page.evaluate(`(() => {
      const o = { had:null, muted:false, err:null };
      try { o.had = MUS.MAST.gain.value; MUS.MAST.gain.value = 0; o.muted = (MUS.MAST.gain.value === 0); }
      catch(e){ o.err = String(e).slice(0,120); }
      return o;
    })()`);
    console.log('MUSIC BUS MUTED BEFORE ANY CAPTURE: ' + mutedFirst.muted + (mutedFirst.err ? '  err: ' + mutedFirst.err : ''));
    await page.waitForTimeout(1500);
  }

  const cityFrame = () => page.frames().find(f => f.url().includes('CITY_WORLD'));

  // A SECOND, INDEPENDENT WITNESS THAT THE PLAYER MOVED: the picture itself.
  // The footstep counter is one witness and it may be the wrong one (the city frame may
  // make its own step sound rather than calling the parent's). So sample the canvas on a
  // 32x32 grid and count how many of those samples changed. A player who walks across a
  // valley changes most of the picture; a player standing still in an animated scene
  // changes a few percent. The standing number is measured here, not assumed, so it is a
  // real threshold and not a guess.
  const snapGrid = async () => {
    const city = cityFrame();
    if (!city) return null;
    return city.evaluate(() => {
      const cv = document.querySelector('canvas'); if (!cv) return null;
      const t = document.createElement('canvas'); t.width = 32; t.height = 32;
      const g = t.getContext('2d'); g.drawImage(cv, 0, 0, 32, 32);
      return Array.from(g.getImageData(0, 0, 32, 32).data);
    }).catch(() => null);
  };
  const gridChange = (a, b) => {
    if (!a || !b || a.length !== b.length) return null;
    let n = 0, tot = 0;
    for (let i = 0; i < a.length; i += 4) {
      tot++;
      if (Math.abs(a[i]-b[i]) + Math.abs(a[i+1]-b[i+1]) + Math.abs(a[i+2]-b[i+2]) > 24) n++;
    }
    return tot ? +(100 * n / tot).toFixed(1) : null;
  };

  // THE NULL CONTROL, AND IT IS THE MOST IMPORTANT THING IN THIS TOOL.
  // The first honest run showed the floor falling -23 -> -32 -> -36 across three places,
  // which reads as "the places differ". It reads exactly the same if something is simply
  // DECAYING with time (music tailing off after the front door). So: three captures at
  // the SAME spot, back to back, without moving a single step. If those three spread as
  // much as the three places do, then the place difference is a time artifact and the
  // DIFFERENCE answer is worthless.
  const nulls = [];
  const standA = await snapGrid();
  for (let i = 0; i < 3; i++) nulls.push(await standStill(page, 'NULL CONTROL ' + (i+1) + ' OF 3', 'same spot, no step taken between captures'));
  const standB = await snapGrid();
  const standingPictureChange = gridChange(standA, standB);

  const places = [];
  places.push(nulls[0]);

  // walk, then stop dead and wait a beat so no footstep tail leaks into the capture
  // DID THE WALK ACTUALLY MOVE ANYBODY? If the input does nothing, "three places" is one
  // place with the music at three different moments, and every place claim is void.
  // The game's own footstep call is the witness: it only fires when a foot lands.
  //
  // BUG 2, AND IT VOIDED A WHOLE RUN'S WORTH OF PLACE CLAIMS BEFORE I WROTE THEM DOWN:
  // the first version walked with arrow keys. 140 presses, ZERO footsteps. Then w, taps
  // on the canvas, drags, and touchscreen taps: zero, zero, zero, zero. This is a phone
  // game and it walks on an ON-SCREEN D-PAD -- buttons with class .pb inside the city
  // frame. The game was fine; my harness was pressing keys at a game that has no keys.
  // Without the footstep witness I would have reported three places and measured one.
  const walkProof = [];
  const walk = async (glyph, n) => {
    await page.evaluate('window.__EYES_CALLS.stepSfx = 0');
    const city = cityFrame();
    let pads = city ? await city.$$('.pb') : [];
    let idx = -1;
    for (let i = 0; i < pads.length; i++) {
      const txt = (await pads[i].textContent().catch(() => '')) || '';
      if (txt.trim() === glyph) { idx = i; break; }
    }
    if (idx < 0) { walkProof.push({ glyph, pressed: 0, footstepsHeard: 0, note: 'no d-pad button with this glyph' }); return; }
    const before = await snapGrid();
    for (let i = 0; i < n; i++) { try { await pads[idx].click({ timeout: 800 }); } catch(e){} await page.waitForTimeout(110); }
    const after = await snapGrid();
    const steps = await page.evaluate('window.__EYES_CALLS.stepSfx');
    walkProof.push({ glyph, pressed: n, footstepsHeard: steps, pictureChangedPct: gridChange(before, after) });
    await page.waitForTimeout(1500);
  };

  await walk('\u2191', 70);
  places.push(await standStill(page, 'SEVENTY STEPS OUT', 'walked one direction away from the opening street, then stood still'));
  await walk('\u2192', 70);
  places.push(await standStill(page, 'SEVENTY MORE, ACROSS', 'walked a second direction, then stood still: a third spot, not a third KIND of place'));

  // WHAT IS UNDERNEATH THE MUSIC. The soundtrack is the only thing with a level in the
  // first three captures, so it hides the answer to the question the job actually asks:
  // is there a KEYNOTE, a background the world itself makes. Mute the music bus and
  // listen again. And prove the mute is a MUSIC mute and not an everything mute first,
  // by firing a sound effect through it: if the tap still hears the effect, the bus is
  // music-only and the capture below means what it says.
  const muteCheck = await page.evaluate(`(() => {
    const o = { had: null, muted: false, err: null };
    try { o.had = MUS.MAST.gain.value; MUS.MAST.gain.value = 0; o.muted = (MUS.MAST.gain.value === 0); }
    catch (e) { o.err = String(e).slice(0,120); }
    return o;
  })()`);
  await page.evaluate('window.__EYES_START()');
  await page.evaluate(`(() => { try { stepSfx('dirt'); } catch(e){} })()`);
  for (let i=0;i<12;i++){ await page.evaluate('window.__EYES_POLL()'); await page.waitForTimeout(80); }
  const mutedProbe = await page.evaluate('window.__EYES_STOP()');
  const mp = (mutedProbe.taps||[])[0];
  const sfxSurvivesMute = mp && isFinite(mp.rms_dbfs) && mp.rms_dbfs > -120;
  let underMusic = null;
  if (sfxSurvivesMute) {
    await page.waitForTimeout(1500);
    underMusic = await standStill(page, 'THE SAME SPOT WITH THE MUSIC MUTED', 'the music bus set to zero; a sound effect was proved to still pass through it first');
  }
  const restoreTo = (muteCheck.had == null ? 1 : muteCheck.had);
  await page.evaluate('(() => { try { MUS.MAST.gain.value = ' + restoreTo + '; } catch(e){} })()');

  // POSITIVE CONTROL -- RULE ZERO. no control, no finding.
  await page.evaluate('window.__EYES_START()');
  const fired = await page.evaluate(`(() => {
    const out = { tried: [], ok: false, err: null };
    try { if (typeof stepSfx === 'function') { stepSfx('dirt'); out.tried.push('stepSfx(dirt)'); out.ok = true; } } catch(e) { out.err = String(e).slice(0,120); }
    try { if (!out.ok && typeof BOH_SFX === 'object') { const b = BOH_SFX.render(Object.keys(BOH_SFX.EVENTS||{})[0]); out.tried.push('BOH_SFX.render'); out.ok = !!b; } } catch(e) { out.err = (out.err||'') + ' | ' + String(e).slice(0,120); }
    return out;
  })()`);
  for (let i=0;i<25;i++){ await page.evaluate('window.__EYES_POLL()'); await page.waitForTimeout(60); }
  const controlTap = await page.evaluate('window.__EYES_STOP()');

  await browser.close();

  const doc = {
    what: 'EYES AND EARS -- E12 [silence standing] round 2. Ten seconds of standing still, on the shipped alpha, at iPhone size.',
    date: '9/6/26',
    school: 'records/BOHEMIA_EYES_E12_ROUND_1_SCHOOL_WHAT_A_QUIET_PLACE_SOUNDS_LIKE_9_6_26.md',
    seconds_each: SECONDS,
    wrapped_entry_points: wrapped,
    pageErrors: errs,
    mutedRun: MUTED, mutedFirst,
    nullControl: nulls,
    standingPictureChangePct: standingPictureChange,
    walkProof,
    musicMute: { muteCheck, sfxSurvivesMute, probe_rms_dbfs: mp ? mp.rms_dbfs : null },
    underMusic,
    places, control: { fired, tap: controlTap },
  };
  fs.writeFileSync(MUTED ? 'records/BOHEMIA_EYES_QUIET_MUSIC_OFF_9_6_26.json' : 'records/BOHEMIA_EYES_QUIET_9_6_26.json', JSON.stringify(doc, null, 1));

  // ---- report ----
  const ctrlTap = (controlTap.taps || [])[0];
  const controlHeard = ctrlTap && isFinite(ctrlTap.rms_dbfs) && ctrlTap.rms_dbfs > -120;
  console.log('RULE ZERO -- THE POSITIVE CONTROL');
  console.log('   fired by hand: ' + (fired.tried.join(', ') || 'NOTHING') + (fired.err ? '   err: ' + fired.err : ''));
  console.log('   the tap heard it: ' + (controlHeard ? 'YES, ' + ctrlTap.rms_dbfs.toFixed(1) + ' dBFS' : 'NO'));
  if (!controlHeard) {
    console.log('');
    console.log('   REFUSING TO REPORT. A silence I cannot prove I would have heard is not a finding,');
    console.log('   it is a broken instrument. Nothing below can be trusted.');
    process.exitCode = 1;
  }
  console.log('');
  console.log('TAPS: ' + (places[0].tap.taps.length) + ' audio context(s), sample rate ' + ((places[0].tap.taps[0]||{}).sampleRate || '?') +
              ', K-weighted: ' + ((places[0].tap.taps[0]||{}).kWeighted));
  console.log('WRAPPED: ' + (wrapped && wrapped.length ? wrapped.join(', ') : 'NOTHING -- event counts below are meaningless'));
  console.log('');
  for (const p of places) {
    const t = (p.tap.taps || [])[0];
    console.log('=== ' + p.place + ' ===');
    console.log('   ' + p.note);
    if (!t) { console.log('   NO TAP'); continue; }
    console.log('   1 FLOOR       ' + (isFinite(t.rms_dbfs) ? t.rms_dbfs.toFixed(1) + ' dBFS K-weighted' : 'DIGITAL SILENCE, not one sample above zero') +
                '   peak ' + (isFinite(t.peak_dbfs) ? t.peak_dbfs.toFixed(1) + ' dBFS' : 'none'));
    console.log('   2 EVENT RATE  ' + (p.calls.stepSfx + p.calls.render) + ' calls in ' + SECONDS + 's  (steps ' + p.calls.stepSfx + ', renders ' + p.calls.render + ')');
    const b = bands(t.spectrum_db, t.sampleRate, 2048);
    console.log('   3 SPECTRUM    ' + Object.entries(b).map(([k,v]) => k.replace('Hz','') + ':' + (v===null?'-':v)).join('  '));
    console.log('                 (dB, averaged over ' + t.specFrames + ' frames; -140 is the floor of the meter)');
  }
  console.log('');
  console.log('=== DID THE WALK MOVE ANYBODY? ===');
  console.log('   standing still for thirty seconds changed ' + standingPictureChange + '% of the picture (this is the threshold)');
  for (const w of walkProof) console.log('   ' + w.pressed + ' x d-pad ' + w.glyph + '  ->  ' + w.footstepsHeard + ' footsteps, ' + w.pictureChangedPct + '% of the picture changed' + (w.note ? '   (' + w.note + ')' : ''));
  const moved = walkProof.every(w => w.pictureChangedPct !== null && standingPictureChange !== null && w.pictureChangedPct > standingPictureChange * 2);
  if (moved) console.log('   THE PLAYER MOVED (the picture changed far more than standing still does), even though the parent-side footstep counter never fired, so that counter is the wrong witness for the walked city.');
  else console.log('   NOT PROVEN THAT THE PLAYER MOVED. Neither witness fired. Treat the place claims as unproven and say so.');

  console.log('');
  console.log('=== WHAT IS UNDERNEATH THE MUSIC ===');
  console.log('   music bus muted: ' + muteCheck.muted + (muteCheck.err ? '  err: ' + muteCheck.err : ''));
  console.log('   a sound effect still passes through the mute: ' + sfxSurvivesMute + (mp ? '  (' + (isFinite(mp.rms_dbfs) ? mp.rms_dbfs.toFixed(1) : 'silence') + ' dBFS)' : ''));
  if (!sfxSurvivesMute) {
    console.log('   SO THE MUTE IS AN EVERYTHING MUTE, NOT A MUSIC MUTE. Not measuring under it.');
  } else {
    const ut = (underMusic.tap.taps||[])[0];
    console.log('   FLOOR WITH THE MUSIC OFF: ' + (ut && isFinite(ut.rms_dbfs) ? ut.rms_dbfs.toFixed(1) + ' dBFS' : 'DIGITAL SILENCE, not one sample above zero'));
    console.log('   EVENTS WITH THE MUSIC OFF: ' + (underMusic.calls.stepSfx + underMusic.calls.render) + ' in ' + SECONDS + 's');
  }

  console.log('');
  console.log('=== THE NULL CONTROL -- SAME SPOT, THREE TIMES, NOT ONE STEP TAKEN ===');
  for (const n of nulls) {
    const t = (n.tap.taps||[])[0];
    console.log('   ' + n.place + '   floor ' + (t && isFinite(t.rms_dbfs) ? t.rms_dbfs.toFixed(1) : 'silence') +
                ' dBFS   events ' + (n.calls.stepSfx + n.calls.render) + '   music playing: ' + n.music.playing + ' (' + (n.music.cur||'') + ')');
  }
  const nf = nulls.map(n => (n.tap.taps||[])[0]).filter(Boolean).map(t => t.rms_dbfs).filter(isFinite);
  const nullSpread = nf.length > 1 ? Math.max(...nf) - Math.min(...nf) : 0;
  console.log('   SPREAD WITHOUT MOVING: ' + nullSpread.toFixed(1) + ' dB');

  // 4 DIFFERENCE
  console.log('');
  console.log('=== 4 DIFFERENCE -- CAN YOU TELL THESE PLACES APART WITH YOUR EYES SHUT? ===');
  const specs = places.map(p => (p.tap.taps||[])[0]).filter(Boolean).map(t => bands(t.spectrum_db, t.sampleRate, 2048));
  const keys = Object.keys(specs[0] || {});
  let maxSpread = 0;
  for (const k of keys) {
    const vals = specs.map(s => s[k]).filter(v => v !== null);
    if (vals.length < 2) continue;
    const spread = Math.max(...vals) - Math.min(...vals);
    if (spread > maxSpread) maxSpread = spread;
  }
  const pf = places.map(p => (p.tap.taps||[])[0]).filter(Boolean).map(t => t.rms_dbfs).filter(isFinite);
  const placeSpread = pf.length > 1 ? Math.max(...pf) - Math.min(...pf) : 0;
  console.log('   floor spread ACROSS THE THREE PLACES:      ' + placeSpread.toFixed(1) + ' dB');
  console.log('   floor spread AT ONE SPOT, WITHOUT MOVING:  ' + nullSpread.toFixed(1) + ' dB');
  console.log('   widest octave-band gap between places:     ' + maxSpread.toFixed(1) + ' dB');
  if (nullSpread >= placeSpread * 0.5) {
    console.log('');
    console.log('   THE PLACE DIFFERENCE IS NOT A PLACE DIFFERENCE. Standing in one spot and doing');
    console.log('   nothing moves the floor about as much as walking across the valley does, so');
    console.log('   what this measured is TIME, not PLACE, and the soundmark question is unanswered.');
  } else {
    console.log('   (a soundmark is a sound belonging to ONE place. the null control says this gap is real.)');
  }
  console.log('');
  console.log('written: ' + (MUTED ? 'records/BOHEMIA_EYES_QUIET_MUSIC_OFF_9_6_26.json' : 'records/BOHEMIA_EYES_QUIET_9_6_26.json'));
})();
