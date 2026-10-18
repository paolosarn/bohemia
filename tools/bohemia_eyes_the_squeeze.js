/* BOHEMIA -- EYES AND EARS, [the Grok pages, stamped] (10/18): THE SQUEEZE ON EVERY SONG.
 *
 * ONE JOB: measure how hard the end of the game's sound chain squeezes his songs, because
 * the Grok music pages that passed the filter (184, 187, 193) name heavy compression and
 * limiting as the "crushed sand" he hears, and the alpha's chain ends in exactly that:
 * MAST -> MUSVOL -> OUT -> a compressor -> a brickwall limiter -> the speaker.
 * A page saying so is a claim. This is the number.
 *
 * HOW, AND WHY THIS WAY
 *   - The chain's settings are read twice and must agree: off the alpha's source text, and off
 *     the two live DynamicsCompressorNodes the alpha builds when its audio starts (captured by
 *     wrapping createDynamicsCompressor before the page loads). A ruler that retypes the
 *     settings measures my typing; this one fails loudly if the two readings differ.
 *   - The levels into the chain are the live ones: MAST, his music slider (MUSVOL) and his
 *     master slider (OUT), read off the nodes after the page applies the saved mix.
 *   - Every song is rendered by the engine's own scheduler (MUS.playStep at MUS.stepDur, the
 *     same door tools/bohemia_eyes_hear.js uses) into ONE two-channel OfflineAudioContext:
 *     channel 0 goes through a copy of the chain with the live settings, channel 1 skips the
 *     two compressors. Same notes, same render, one difference.
 *   - The compressor's and limiter's own gain reduction are read every 0.1 s (suspend), and
 *     only while the song is playing (dry window above -50 dBFS), so silence is not counted
 *     as "no squeeze".
 *   - It also counts what the engine builds while it plays (oscillator wave types, wave
 *     shapers, noise buffers), because the 8-bit way the pages describe has no sawtooth
 *     (the NES has two pulses, a triangle and noise) and no distortion stage.
 *
 * OUTPUT: records/BOHEMIA_EYES_THE_SQUEEZE_10_18_26.json, and for the two songs the VOTE page
 * plays, three short mp3s in slices/vote/ (as the game plays it / without the squeeze / without the noise);
 * mp3 because his phone is an iPhone and the other sound cards ship mp3.
 *
 *   node tools/bohemia_eyes_the_squeeze.js [bars=24] [limit=0 for all] [A/B song name]
 */
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}

const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const BARS = parseInt(process.argv[2] || '24', 10);
const LIMIT = process.argv[3] ? parseInt(process.argv[3], 10) : 0;   /* 0 = every song */
const ABSONG = process.argv[4] || '';                                    /* the A/B song; default the first title song */
const OUTJSON = process.env.EYES_SQUEEZE_OUT || path.join(ROOT, 'records', 'BOHEMIA_EYES_THE_SQUEEZE_10_18_26.json');
const VOTEDIR = path.join(ROOT, 'slices', 'vote');

/* the chain as the source text writes it; the live nodes must say the same */
function sourceChain() {
  const src = fs.readFileSync(ALPHA, 'utf8');
  const grab = (name) => {
    const re = new RegExp('const ' + name + '=this\\.AC\\.createDynamicsCompressor\\(\\);([^\\n]*)');
    const m = src.match(re);
    if (!m) return null;
    const o = {};
    for (const k of ['threshold', 'knee', 'ratio', 'attack', 'release']) {
      const mm = m[1].match(new RegExp(name + '\\.' + k + '\\.value=(-?[0-9.]+)'));
      o[k] = mm ? +mm[1] : null;
    }
    return o;
  };
  const mast = src.match(/this\.MAST=this\.AC\.createGain\(\);this\.MAST\.gain\.value=([0-9.]+)/);
  return { comp: grab('cmp'), lim: grab('lim'), mast: mast ? +mast[1] : null };
}

function wav(ch, rate, out) {
  const n = ch.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, ch[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(out, buf);
}

(async () => {
  const SRC = sourceChain();
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await b.newPage({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message)));
  await page.addInitScript(() => {
    window.__EYES_COMPS = [];
    for (const C of [window.AudioContext, window.webkitAudioContext]) {
      if (!C || !C.prototype || C.prototype.__eyesWrapped) continue;
      const real = C.prototype.createDynamicsCompressor;
      C.prototype.createDynamicsCompressor = function () {
        const n = real.call(this);
        if (!(this instanceof OfflineAudioContext)) window.__EYES_COMPS.push(n);
        return n;
      };
      C.prototype.__eyesWrapped = true;
    }
  });
  const out = { ok: true, bars: BARS, when: new Date().toISOString(), source: SRC };
  try {
    await page.goto('file://' + ALPHA, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1800);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('.tab')].find(x => x.getAttribute('data-p') === 'music');
      if (t) t.click();
    });
    await page.waitForTimeout(2500);

    const live = await page.evaluate(() => {
      const M = window.MUS || (typeof MUS !== 'undefined' ? MUS : null);
      if (!M) return { fatal: 'MUS not reachable' };
      try { M.audio(); } catch (e) {}
      try { if (window.__applyMix) window.__applyMix(); } catch (e) {}
      const p = n => n ? { threshold: n.threshold.value, knee: n.knee.value, ratio: n.ratio.value,
        attack: +n.attack.value.toFixed(4), release: +n.release.value.toFixed(4) } : null;
      const comps = window.__EYES_COMPS || [];
      return {
        mast: M.MAST ? M.MAST.gain.value : null,
        musvol: window.__MUSVOL ? window.__MUSVOL.gain.value : null,
        outbus: window.__OUTBUS ? window.__OUTBUS.gain.value : null,
        mix: window.getMix ? window.getMix() : null,
        comps: comps.map(p),
        limIsLast: !!(window.__LIMITER && comps.length && comps[comps.length - 1] === window.__LIMITER),
      };
    });
    out.live = live;
    if (live.fatal) throw new Error(live.fatal);

    /* the two readings must agree, or this is a ruler of the wrong chain */
    const same = (a, b) => a && b && ['threshold', 'knee', 'ratio', 'attack', 'release']
      .every(k => Math.abs(a[k] - b[k]) < 1e-3);
    const nC = live.comps.length;
    out.chainAgrees = nC >= 2 && same(live.comps[nC - 2], SRC.comp) && same(live.comps[nC - 1], SRC.lim)
      && live.limIsLast;
    if (!out.chainAgrees) throw new Error('the live chain and the source text disagree: '
      + JSON.stringify({ live: live.comps, src: SRC }));
    const gainIn = (live.mast > 0 ? live.mast : SRC.mast) * live.musvol * live.outbus;
    out.gainIntoTheChain = +gainIn.toFixed(4);

    const names = await page.evaluate(() => {
      const pools = [];
      if (typeof MLOOPS !== 'undefined') for (const r of MLOOPS) pools.push({ n: r.n, pool: 'MLOOPS', menu: !!r.menu });
      if (typeof MFACTIONS !== 'undefined') for (const r of MFACTIONS) pools.push({ n: r.n, pool: 'MFACTIONS', menu: !!r.menu });
      return pools;
    });
    const list = LIMIT ? names.slice(0, LIMIT) : names;
    const render = (s, extra) => page.evaluate(async (cfg) => {
        const M = window.MUS || MUS;
        const pool = cfg.pool === 'MLOOPS' ? MLOOPS : MFACTIONS;
        const row = pool.find(x => x && x.n === cfg.n);
        if (!row) return { fatal: 'no row ' + cfg.n };
        const sd = M.stepDur();
        const SR = 44100, LEAD = 0.25, WIN = 0.1;
        const secs = LEAD + cfg.bars * 16 * sd + 2.0;
        const OAC = new OfflineAudioContext(2, Math.ceil(SR * secs), SR);
        const IN = OAC.createGain(); IN.gain.value = cfg.gainIn;
        const mk = (o) => { const c = OAC.createDynamicsCompressor();
          for (const k of ['threshold', 'knee', 'ratio', 'attack', 'release']) c[k].value = o[k]; return c; };
        const cmp = mk(cfg.comp), lim = mk(cfg.lim);
        const mer = OAC.createChannelMerger(2);
        IN.connect(cmp); cmp.connect(lim); lim.connect(mer, 0, 0);
        IN.connect(mer, 0, 1);
        mer.connect(OAC.destination);

        const tally = { osc: {}, shapers: 0, buffers: 0 };
        const rO = OAC.createOscillator.bind(OAC), rW = OAC.createWaveShaper.bind(OAC),
              rB = OAC.createBufferSource.bind(OAC);
        OAC.createOscillator = function () { const o = rO(); const st = o.start.bind(o);
          o.start = function () { tally.osc[o.type] = (tally.osc[o.type] || 0) + 1; return st.apply(this, arguments); };
          return o; };
        OAC.createWaveShaper = function () { tally.shapers++; return rW(); };
        tally.noise = 0; tally.noiseSec = 0;
        OAC.createBufferSource = function () { tally.buffers++; const n = rB(); const st = n.start.bind(n);
          /* a white-noise buffer crosses zero about every other sample; a recorded or tonal one far less.
             Read off the buffer itself at the moment it plays, so no kit table is retyped here. */
          n.start = function () {
            let z = 0, len = 0;
            try { const d = n.buffer.getChannelData(0); len = d.length;
              const m = Math.min(d.length, 4096); for (let i = 1; i < m; i++) if ((d[i] >= 0) !== (d[i - 1] >= 0)) z++;
              z = m > 1 ? z / (m - 1) : 0; } catch (e) {}
            if (z > 0.3) { tally.noise++; tally.noiseSec += len / SR; if (cfg.noiseOut) { try { n.disconnect(); } catch (e) {} } }
            return st.apply(this, arguments); };
          return n; };

        const gr = [];
        for (let t = LEAD + WIN; t < secs - 0.05; t += WIN) {
          OAC.suspend(t).then(() => { gr.push([OAC.currentTime, cmp.reduction, lim.reduction]); OAC.resume(); });
        }
        const sAC = M.AC, sM = M.MAST, sF = M.fac;
        let buf, err = null;
        try {
          M.AC = OAC; M.MAST = IN; M.fac = function () { return row; };
          for (let st = 0; st < cfg.bars * 16; st++) {
            const sc = M.songCtx ? M.songCtx(st) : null;
            M.playStep(st % 16, LEAD + st * sd, sc);
          }
          buf = await OAC.startRendering();
        } catch (e) { err = String(e && e.message || e); }
        finally { M.AC = sAC; M.MAST = sM; M.fac = sF; }
        if (err) return { fatal: err };
        const bus = buf.getChannelData(0), dry = buf.getChannelData(1);
        const db = v => v > 1e-9 ? 20 * Math.log10(v) : -180;
        const W = Math.round(SR * WIN);
        const win = [];
        let pkB = 0, pkD = 0, sB = 0, sD = 0, nAct = 0;
        for (let i = 0; i + W <= bus.length; i += W) {
          let eb = 0, ed = 0, pb = 0, pd = 0;
          for (let j = i; j < i + W; j++) { const a = bus[j], d = dry[j]; eb += a * a; ed += d * d;
            if (Math.abs(a) > pb) pb = Math.abs(a); if (Math.abs(d) > pd) pd = Math.abs(d); }
          const rb = Math.sqrt(eb / W), rd = Math.sqrt(ed / W);
          win.push({ t: (i + W) / SR, rb, rd, pb, pd });
          if (db(rd) > -50) { nAct++; sB += eb; sD += ed; if (pb > pkB) pkB = pb; if (pd > pkD) pkD = pd; }
        }
        /* gain reduction only while the song is playing */
        const act = gr.filter(g => { const w = win.find(x => Math.abs(x.t - g[0]) < WIN * 0.51);
          return w && db(w.rd) > -50; });
        const c = act.map(g => -g[1]), l = act.map(g => -g[2]);
        const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
        const share = (a, th) => a.length ? a.filter(x => x > th).length / a.length : 0;
        const res = {
          seconds: +(bus.length / SR).toFixed(2), activeWindows: nAct,
          compMaxAt: act.length ? +act[c.indexOf(Math.max(...c))][0].toFixed(2) : null,
          /* WHEN it squeezes over 3 dB, so a start-up catch is told apart from a squeeze inside the song */
          compOver3At: act.filter((g, i) => c[i] > 3).map(g => +g[0].toFixed(2)),
          comp: { meanDb: +mean(c).toFixed(2), maxDb: +Math.max(0, ...c).toFixed(2),
                  over1dB: +share(c, 1).toFixed(3), over3dB: +share(c, 3).toFixed(3), over6dB: +share(c, 6).toFixed(3) },
          lim: { meanDb: +mean(l).toFixed(2), maxDb: +Math.max(0, ...l).toFixed(2),
                 over1dB: +share(l, 1).toFixed(3) },
          peakDbfs: { bus: +db(pkB).toFixed(2), dry: +db(pkD).toFixed(2) },
          rmsDbfs: { bus: +db(Math.sqrt(sB / Math.max(1, nAct * W))).toFixed(2),
                     dry: +db(Math.sqrt(sD / Math.max(1, nAct * W))).toFixed(2) },
          tally,
        };
        res.crestDb = { bus: +(res.peakDbfs.bus - res.rmsDbfs.bus).toFixed(2),
                        dry: +(res.peakDbfs.dry - res.rmsDbfs.dry).toFixed(2) };
        if (cfg.keep) { res.samples = { bus: Array.from(bus), dry: Array.from(dry), rate: SR }; }
        return res;
    }, Object.assign({ n: s.n, pool: s.pool, bars: BARS, gainIn, comp: SRC.comp, lim: SRC.lim, keep: false, noiseOut: false }, extra || {}));
    /* RESUMABLE: a container restart killed the first full run at song 78 of 156, so every song is written
       to a partial file as it lands and a rerun with the same bar count picks up after the last one. */
    const PART = OUTJSON + '.partial';
    let prior = [];
    try { const pj = JSON.parse(fs.readFileSync(PART, 'utf8')); if (pj.bars === BARS) prior = pj.songs || []; } catch (e) {}
    out.songs = [];
    /* EYES_SQUEEZE_ABONLY=1: keep the songs already measured in the output file and only cut the A/B again */
    const AB_ONLY = process.env.EYES_SQUEEZE_ABONLY === '1';
    if (AB_ONLY) { const pj = JSON.parse(fs.readFileSync(OUTJSON, 'utf8')); prior = pj.songs || []; }
    for (const s of list) {
      const was = prior.find(x => x.n === s.n && x.pool === s.pool);
      if (was) { out.songs.push(was); continue; }
      if (AB_ONLY) continue;
      const r = await render(s);
      if (r.fatal) { out.songs.push({ n: s.n, pool: s.pool, fatal: r.fatal }); continue; }
      r.levelChangeDb = +(r.rmsDbfs.bus - r.rmsDbfs.dry).toFixed(2);
      out.songs.push(Object.assign({ n: s.n, pool: s.pool, menu: s.menu }, r));
      fs.writeFileSync(PART, JSON.stringify({ bars: BARS, songs: out.songs }));
      process.stdout.write('.');
    }
    process.stdout.write('\n');

    /* THE A/B THE VOTE PAGE PLAYS, one song from the title's pool (the first song SOUNDS is making new),
       12 s each, three ways: as the game plays it; without the two compressors, raised to the same
       loudness so louder never wins by being louder; and through the same chain with only the white-noise
       buffers taken out (read off each buffer as it plays). One song keeps the published site small. */
    const ok0 = out.songs.filter(x => !x.fatal);
    const song = (ABSONG && ok0.find(x => x.n === ABSONG)) || ok0.find(x => x.menu) || ok0[0];
    out.ab = [];
    if (song) {
      const a = await render(song, { keep: true });
      const z = await render(song, { keep: true, noiseOut: true });
      const SECS = 12;
      const cut = (x) => x.slice(0, Math.round(a.samples.rate * (SECS + 0.25)));
      const rms = (x) => Math.sqrt(x.reduce((q, v) => q + v * v, 0) / Math.max(1, x.length));
      const game = cut(a.samples.bus), dry = cut(a.samples.dry), noOut = cut(z.samples.bus);
      /* same loudness as the game's version, but never over -1 dBFS: a song that runs over full scale (the
         hymnal) would otherwise come back clipped, and clipping is a sand of its own */
      const peak = (x) => x.reduce((q, v) => Math.max(q, Math.abs(v)), 0);
      const k = Math.min(rms(game) / Math.max(1e-9, rms(dry)), 0.891 / Math.max(1e-9, peak(dry)));
      const dryM = dry.map(v => v * k);
      out.abSong = { n: song.n, pool: song.pool, menu: song.menu, dryRaisedDb: +(20 * Math.log10(k)).toFixed(2),
        noiseOutQuieterDb: +(20 * Math.log10(rms(noOut) / Math.max(1e-9, rms(game)))).toFixed(2), noiseBuffers: a.tally.noise };
      for (const [which, ch] of [['GAME', game], ['NOSQUEEZE', dryM], ['NOISEOUT', noOut]]) {
        const tmp = path.join(require('os').tmpdir(), 'eyes_squeeze_' + which + '.wav');
        wav(ch, a.samples.rate, tmp);
        const dst = path.join(VOTEDIR, 'EYES_THE_SQUEEZE_' + which + '.mp3');
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '64k', dst]);
        fs.unlinkSync(tmp);
        out.ab.push({ which, song: song.n, file: path.relative(ROOT, dst), bytes: fs.statSync(dst).size });
      }
    }
  } catch (e) {
    out.ok = false; out.why = String(e && e.message || e).slice(0, 600);
  }
  out.pageerrors = errs.slice(0, 8);
  const ok = (out.songs || []).filter(x => !x.fatal);
  if (ok.length) {
    const m = a => a.reduce((x, y) => x + y, 0) / a.length;
    const sorted = k => ok.map(k).sort((a, b) => a - b);
    const med = a => a[Math.floor(a.length / 2)];
    const osc = {};
    let shapers = 0, buffers = 0;
    for (const s of ok) { for (const [k, v] of Object.entries(s.tally.osc)) osc[k] = (osc[k] || 0) + v;
      shapers += s.tally.shapers; buffers += s.tally.buffers; }
    const oscN = Object.values(osc).reduce((x, y) => x + y, 0);
    out.summary = {
      songs: ok.length, failed: (out.songs || []).length - ok.length,
      compMeanDb: { mean: +m(ok.map(s => s.comp.meanDb)).toFixed(2), median: med(sorted(s => s.comp.meanDb)),
                    max: Math.max(...ok.map(s => s.comp.meanDb)) },
      compOver3dBShare: +m(ok.map(s => s.comp.over3dB)).toFixed(3),
      songsWhereCompWorksOver1dBHalfTheTime: ok.filter(s => s.comp.over1dB >= 0.5).length,
      limMeanDb: +m(ok.map(s => s.lim.meanDb)).toFixed(2),
      songsWhereLimiterEverWorks1dB: ok.filter(s => s.lim.maxDb >= 1).length,
      crestLostDb: +m(ok.map(s => s.crestDb.dry - s.crestDb.bus)).toFixed(2),
      oscillatorStarts: oscN, byWave: osc,
      sawShare: oscN ? +((osc.sawtooth || 0) / oscN).toFixed(3) : null,
      waveShapersPerSong: +(shapers / ok.length).toFixed(1), buffersPerSong: +(buffers / ok.length).toFixed(1),
      whiteNoiseBuffersPerSong: +m(ok.map(s => s.tally.noise)).toFixed(1),
      songsWithWhiteNoise: ok.filter(s => s.tally.noise > 0).length,
      levelChangeDb: { mean: +m(ok.map(s => s.levelChangeDb)).toFixed(2), min: Math.min(...ok.map(s => s.levelChangeDb)),
                       max: Math.max(...ok.map(s => s.levelChangeDb)) },
    };
  }
  fs.writeFileSync(OUTJSON, JSON.stringify(out, null, 1));
  if (out.ok && !LIMIT) { try { fs.unlinkSync(OUTJSON + '.partial'); } catch (e) {} }
  console.log(JSON.stringify({ ok: out.ok, why: out.why, chainAgrees: out.chainAgrees,
    gainIntoTheChain: out.gainIntoTheChain, summary: out.summary, abSong: out.abSong, ab: out.ab, pageerrors: out.pageerrors }, null, 1));
  await b.close();
})();
