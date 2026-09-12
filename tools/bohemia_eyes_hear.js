/* BOHEMIA -- EYES AND EARS, E18 [he can hear it] round two: THE RENDER HALF.
 *
 * ONE JOB: get the song he likes out of the shipped engine as real audio AND as the
 * exact list of notes the engine scheduled, so the axis card is measured and not read
 * off a table.
 *
 * WHY IT RUNS THE ENGINE'S OWN SCHEDULER INSTEAD OF RE-IMPLEMENTING IT
 *   The song is a parameter row: root 48, a five-note scale, three step patterns and
 *   the names of voices in a 602-voice rack. Re-reading that row in python and working
 *   out what it sounds like would be measuring MY arithmetic, not his song. So this
 *   points MUS.AC and MUS.MAST at an OfflineAudioContext and calls the engine's own
 *   MUS.playStep() for every step, at the engine's own MUS.stepDur(). Same principle as
 *   tools/bohemia_sfx_instrument_measure.py (8/19), whose docstring is blunt about it:
 *   measuring on a clean wire is "a ruler for a signal chain nobody uses".
 *
 * AND IT WRAPS synthV AND drumV TO WRITE DOWN EVERY NOTE
 *   The melody degree is computed inside playStep and never exposed. Wrapping the two
 *   voice functions during the render gives the complete score the engine actually
 *   played: instrument name, semitone, time. That is where four of the five axes come
 *   from -- the drum onsets are the beat entry, the bass notes are the register, the
 *   lead notes are the contour -- all of them the engine's numbers, not a pitch tracker's
 *   guess. Round one's school round is explicit that a pitch or beat tracker pointed at
 *   slow, lightly-percussive music has a known octave-error failure mode; the engine's
 *   own schedule has no such failure mode because it is not an estimate.
 *
 * OUTPUT: a wav on disk (the audio, for loudness and band energy in python) and a json
 * of the note log plus what the engine says about itself.
 */
const path = require('path');
const fs = require('fs');

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}

const ROOT = path.resolve(__dirname, '..');
const SONG = process.argv[2] || 'THE MARKER ON THE DOOR';
const BARS = parseInt(process.argv[3] || '24', 10);
/* records/ AND NOT records/target/. _config.yml publishes slices/ + engine/ +
   records/target, so a wav dropped in target ships to the live site: 4.5 MB of
   evidence added to a published surface already at 247 of its 260 MB cap, for a file
   no visitor will ever open. The gate still reads it straight off disk. */
const OUTWAV = process.argv[4] || path.join(ROOT, 'records', 'BOHEMIA_EYES_E18_MARKER.wav');
const OUTJSON = process.argv[5] || path.join(ROOT, 'records', 'BOHEMIA_EYES_E18_RENDER_9_12_26.json');

/* float samples -> 16 bit mono wav. Written here because the analysis lives in python
   and handing 1.3 million floats through a json pipe is a way to lose a run. */
function wav(samples, rate, out) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    let v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files'] });
  const page = await b.newPage({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message)));
  const out = { ok: true, song: SONG, bars: BARS, when: new Date().toISOString() };
  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'),
      { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('.tab')].find(x => x.getAttribute('data-p') === 'music');
      if (t) t.click();
    });
    await page.waitForTimeout(2500);

    const res = await page.evaluate(async (cfg) => {
      const M = window.MUS || (typeof MUS !== 'undefined' ? MUS : null);
      if (!M) return { fatal: 'the music engine (MUS) is not reachable in the shipped alpha' };
      if (typeof synthV === 'undefined' && !window.synthV) return { fatal: 'the voice rack (synthV) is not reachable' };

      /* the row, straight out of the shipped table rather than retyped */
      const pools = [];
      for (const k of ['MFACTIONS', 'MLOOPS']) {
        const p = window[k] || (typeof MFACTIONS !== 'undefined' && k === 'MFACTIONS' ? MFACTIONS : null)
                || (typeof MLOOPS !== 'undefined' && k === 'MLOOPS' ? MLOOPS : null);
        if (p) pools.push(...p);
      }
      const row = pools.find(x => x && x.n === cfg.song);
      if (!row) return { fatal: 'no song row named ' + cfg.song + ' in the shipped table',
                         names: pools.slice(0, 400).map(x => x && x.n) };

      const sd = M.stepDur ? M.stepDur() : null;
      const SR = 44100;
      /* A HALF SECOND OF SILENCE IN FRONT, AND IT IS NOT COSMETIC. The cross-check
         between the engine's schedule and the sound that actually came out asks an
         onset detector where the first hit is, and an onset detector finds RISES. A
         song that begins at t=0 begins already loud, so there is no rise to find and
         the cross-check failed on its own first run -- correctly, because the question
         was unanswerable rather than because the two disagreed. Every time below has
         the lead-in subtracted again, so nothing this reports is shifted. */
      const LEADIN = 0.5;
      const secs = LEADIN + cfg.bars * 16 * sd + 2.5;
      const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
      const MASTER = OAC.createGain(); MASTER.gain.value = 1; MASTER.connect(OAC.destination);

      /* WRITE DOWN EVERY NOTE THE ENGINE SCHEDULES. Wrapped for the duration of the
         render only, and put back afterwards, because leaving a wrapper on the live
         rack would change the game for whatever ran next. */
      const notes = [];
      let depth = 0;                 /* 0 = the scheduler itself, >0 = inside a voice */
      const realSynth = window.synthV, realDrum = window.drumV;
      window.synthV = function (name, ctx, dest, hz, sd2, semi, t, amp) {
        notes.push({ kind: 'v', name: name, semi: semi, t: +(t || 0), amp: amp });
        depth++;
        try { return realSynth.apply(this, arguments); } finally { depth--; }
      };
      if (realDrum) window.drumV = function (name, ctx, dest, t) {
        notes.push({ kind: 'd', name: name, t: +(t || 0) });
        depth++;
        try { return realDrum.apply(this, arguments); } finally { depth--; }
      };

      /* AND THE RAW OSCILLATORS, WHICH IS THE BUG THE FIRST RUN WALKED INTO.
         Wrapping only synthV and drumV logged 359 notes and NOT ONE MELODY NOTE, and
         the tempting read was "the melody never plays". It does. This engine writes
         some notes with a named voice out of the rack and others as a bare
         createOscillator into a lowpass, and for this song's mel='longs' the melody is
         the bare kind. A note log blind to half the ways the engine makes a note is a
         log that invents silences. Depth tells the scheduler's own notes apart from the
         oscillators a voice builds inside itself. */
      const realOsc = OAC.createOscillator.bind(OAC);
      OAC.createOscillator = function () {
        const o = realOsc();
        const d0 = depth;
        const realStart = o.start.bind(o);
        o.start = function (when) {
          notes.push({ kind: d0 === 0 ? 'o' : 'oi', t: +(when || 0),
                       hz: +(o.frequency.value || 0), wave: o.type });
          return realStart.apply(this, arguments);
        };
        return o;
      };

      const savedAC = M.AC, savedMAST = M.MAST, savedFac = M.fac;
      let err = null, buf = null;
      try {
        M.AC = OAC; M.MAST = MASTER;
        M.fac = function () { return row; };          /* the song under test, not whatever was selected */
        for (let s = 0; s < cfg.bars * 16; s++) {
          const sc = M.songCtx ? M.songCtx(s) : null;
          M.playStep(s % 16, LEADIN + s * sd, sc);
        }
        const rendered = await OAC.startRendering();
        const d = rendered.getChannelData(0);
        buf = Array.from(d);
      } catch (e) {
        err = String(e && e.message || e);
      } finally {
        M.AC = savedAC; M.MAST = savedMAST; M.fac = savedFac;
        window.synthV = realSynth; if (realDrum) window.drumV = realDrum;
      }
      if (err) return { fatal: 'the offline render threw: ' + err };

      /* the section map, so "when does the melody arrive" is the engine's own answer */
      const arr = M.ARR ? M.ARR.slice() : null;
      const rt = M.RT ? M.RT.slice() : null;
      const sections = [];
      for (let s = 0; s < cfg.bars * 16; s += 16) {
        const sc = M.songCtx(s);
        sections.push({ bar: s / 16, sec: sc.sec, rs: sc.rs, t: +(s * sd).toFixed(4) });
      }
      return { row: row, stepDur: sd, rate: SR, notes: notes, samples: buf,
               arr: arr, rt: rt, sections: sections, leadin: LEADIN };
    }, { song: SONG, bars: BARS });

    if (res.fatal) { out.ok = false; out.why = res.fatal; out.names = res.names; }
    else {
      wav(res.samples, res.rate, OUTWAV);
      out.wav = path.relative(ROOT, OUTWAV);
      out.seconds = +(res.samples.length / res.rate).toFixed(3);
      out.rate = res.rate;
      out.row = res.row; out.stepDur = res.stepDur; out.notes = res.notes;
      out.arr = res.arr; out.rt = res.rt; out.sections = res.sections;
      out.leadin = res.leadin;
    }
  } catch (e) {
    out.ok = false; out.why = String(e).slice(0, 400);
  }
  out.pageerrors = errs.slice(0, 8);
  fs.mkdirSync(path.dirname(OUTJSON), { recursive: true });
  fs.writeFileSync(OUTJSON, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ ok: out.ok, why: out.why, wav: out.wav, seconds: out.seconds,
    notes: (out.notes || []).length, stepDur: out.stepDur, pageerrors: out.pageerrors }, null, 2));
  await b.close();
})();
