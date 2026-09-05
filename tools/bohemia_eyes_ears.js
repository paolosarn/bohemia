/* BOHEMIA -- EYES AND EARS: THE EARS (lane 17, E4, 9/5/26)
 *
 * WHAT IT IS. Every sound Paolo has approved, RENDERED and MEASURED. Not read off
 * a recipe: rendered through the real factory (engine/bohemia_sfx.js) into a real
 * OfflineAudioContext, then measured with the instruments the broadcast and game
 * audio world actually uses.
 *
 * WHAT IT MEASURES, and why each one is in the list:
 *   LUFS (ITU-R BS.1770-4 / EBU R128)  loudness as a person hears it, K-weighted,
 *                                      gated. Peak says nothing about loud.
 *   TRUE PEAK (4x oversampled)         the sample peak lies: a signal can read
 *                                      -0.2 dBFS and still clip a DAC between
 *                                      samples. Broadcast asks for -1 dBTP.
 *   CREST FACTOR (peak - rms, dB)      punch. A transient with no crest is a
 *                                      squashed sound; a huge crest with no body
 *                                      is a click with nothing behind it.
 *   ATTACK TIME                        how long to reach peak. The snap.
 *   DECAY TO -60 dB                    the tail. A sound that stops dead is the
 *                                      loudest synthetic tell there is, and this
 *                                      factory's own header says so.
 *   NOISE FLOOR (last 10% rms)         what is left ringing when it should be over.
 *   DC OFFSET                          a mix bug that eats headroom silently.
 *   CLIPPED SAMPLES                    hard faults, counted.
 *   STEREO CORRELATION                 +1 is mono, 0 is wide, NEGATIVE is a phase
 *                                      problem that vanishes on a phone speaker --
 *                                      and a phone speaker is what this game ships on.
 *   SPECTRAL CENTROID / ROLLOFF        where the sound sits: bright, dark, thin.
 *   BAND ENERGY (5 bands)              the shape of it, so "no low end" is a number.
 *
 * IT NEVER JUDGES TASTE. It reports numbers; the record decides what is weak.
 *
 * USAGE:  node tools/bohemia_eyes_ears.js [--bank banks/BOHEMIA_SFX_APPROVED_8_20_26.json]
 *                                         [--out records/BOHEMIA_EYES_EARS_MEASURED_9_5_26.json]
 *                                         [--limit N]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BANK = arg('--bank', 'banks/BOHEMIA_SFX_APPROVED_8_20_26.json');
const OUT  = arg('--out', null);
const LIMIT = parseInt(arg('--limit', '0'), 10) || 0;

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(require('path').join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}
const { chromium } = pw();

/* EVERYTHING BELOW RUNS INSIDE THE PAGE, because WebAudio only exists there and
   because moving 185 rendered sounds across the bridge as PCM is 280 MB of
   nothing. Numbers come back; audio does not. */
const MEASURE = function (bankJson, opts) {
  const bank = JSON.parse(bankJson);
  const SR = 48000;

  /* ---- ITU-R BS.1770-4 K-WEIGHTING, the two stages, at 48k --------------- */
  function biquad(x, b, a) {
    const y = new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
      x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
    }
    return y;
  }
  /* The published 48 kHz coefficients: stage 1 a high shelf (+4 dB, ~1681 Hz),
     stage 2 an RLB high-pass (~38 Hz). */
  const SHELF_B = [1.53512485958697, -2.69169618940638, 1.19839281085285];
  const SHELF_A = [1, -1.69065929318241, 0.73248077421585];
  const HP_B    = [1.0, -2.0, 1.0];
  const HP_A    = [1, -1.99004745483398, 0.99007225036621];
  const kWeight = ch => biquad(biquad(ch, SHELF_B, SHELF_A), HP_B, HP_A);

  function loudnessLUFS(chans) {
    const k = chans.map(kWeight);
    const block = Math.round(0.4 * SR), hop = Math.round(0.1 * SR);   /* 400 ms, 75% overlap */
    const blocks = [];
    for (let s = 0; s + block <= k[0].length; s += hop) {
      let sum = 0;
      for (const ch of k) { let a = 0; for (let i = s; i < s + block; i++) a += ch[i] * ch[i]; sum += a / block; }
      blocks.push(sum);
    }
    if (!blocks.length) return null;
    const L = ms => -0.691 + 10 * Math.log10(Math.max(ms, 1e-12));
    let kept = blocks.filter(b => L(b) > -70);                        /* absolute gate */
    if (!kept.length) return null;
    const mean1 = kept.reduce((a, b) => a + b, 0) / kept.length;
    const rel = L(mean1) - 10;                                        /* relative gate, -10 LU */
    kept = kept.filter(b => L(b) > rel);
    if (!kept.length) return null;
    const mean2 = kept.reduce((a, b) => a + b, 0) / kept.length;
    return L(mean2);
  }

  /* ---- TRUE PEAK, 4x oversampled by linear interpolation. Approximate on
     purpose and labelled as such: the exact method is a polyphase filter, and
     linear 4x under-reads by a few tenths of a dB. It never over-reads, so a
     sound this calls hot IS hot. */
  function truePeak(chans) {
    let tp = 0;
    for (const ch of chans) {
      for (let i = 0; i < ch.length - 1; i++) {
        const a = ch[i], b = ch[i + 1];
        for (let f = 0; f < 4; f++) { const v = Math.abs(a + (b - a) * (f / 4)); if (v > tp) tp = v; }
      }
    }
    return tp;
  }

  /* ---- a small radix-2 FFT, for where the sound SITS ---------------------- */
  function fftMag(re) {
    const n = re.length, im = new Float32Array(n);
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { const t = re[i]; re[i] = re[j]; re[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len;
      for (let i = 0; i < n; i += len) {
        for (let k = 0; k < len / 2; k++) {
          const wr = Math.cos(ang * k), wi = Math.sin(ang * k);
          const ur = re[i + k], ui = im[i + k];
          const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
          const vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
          re[i + k] = ur + vr; im[i + k] = ui + vi;
          re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        }
      }
    }
    const mag = new Float32Array(n / 2);
    for (let i = 0; i < n / 2; i++) mag[i] = Math.hypot(re[i], im[i]);
    return mag;
  }

  function spectrum(mono) {
    const N = 4096;
    const acc = new Float64Array(N / 2);
    let frames = 0;
    for (let s = 0; s + N <= mono.length; s += N) {
      const w = new Float32Array(N);
      for (let i = 0; i < N; i++) w[i] = mono[s + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
      const m = fftMag(w);
      for (let i = 0; i < N / 2; i++) acc[i] += m[i];
      frames++;
    }
    if (!frames) return null;
    for (let i = 0; i < acc.length; i++) acc[i] /= frames;
    const hzPerBin = SR / N;
    let sum = 0, wsum = 0, total = 0;
    for (let i = 1; i < acc.length; i++) { const f = i * hzPerBin; sum += acc[i]; wsum += acc[i] * f; total += acc[i]; }
    const centroid = sum > 0 ? wsum / sum : 0;
    let run = 0, rolloff = 0;
    for (let i = 1; i < acc.length; i++) { run += acc[i]; if (run >= 0.85 * total) { rolloff = i * hzPerBin; break; } }
    const edges = [0, 120, 500, 2000, 6000, SR / 2];
    const bands = [];
    for (let b = 0; b < edges.length - 1; b++) {
      let e = 0;
      for (let i = Math.max(1, Math.floor(edges[b] / hzPerBin)); i < Math.min(acc.length, Math.floor(edges[b + 1] / hzPerBin)); i++) e += acc[i];
      bands.push(total > 0 ? +(100 * e / total).toFixed(1) : 0);
    }
    return { centroid_hz: Math.round(centroid), rolloff85_hz: Math.round(rolloff), band_pct: bands };
  }

  const dB = v => v > 0 ? +(20 * Math.log10(v)).toFixed(2) : -999;

  async function one(ev, idx) {
    const pool = BOH_SFX.cook(ev, Math.max(6, idx + 1));
    const vec = pool[idx] || pool[0];
    if (!vec) return null;
    const secs = Math.max(0.6, Math.min(8, (BOH_SFX.durSec ? BOH_SFX.durSec(vec) : 2) + 1.0));
    const AC = new OfflineAudioContext(2, Math.ceil(secs * SR), SR);
    const out = AC.createGain(); out.gain.value = 1; out.connect(AC.destination);
    BOH_SFX.render(vec, AC, out, 0);
    const buf = await AC.startRendering();
    const chans = [buf.getChannelData(0), buf.getChannelData(1)];
    const n = buf.length;

    /* trim the trailing digital silence so "duration" means the sound, not the canvas */
    let last = 0;
    for (let i = 0; i < n; i++) if (Math.abs(chans[0][i]) > 1e-4 || Math.abs(chans[1][i]) > 1e-4) last = i;
    const len = Math.max(1, last + 1);
    const cut = chans.map(c => c.subarray(0, len));

    let peak = 0, sum2 = 0, dc = 0, clipped = 0, peakAt = 0;
    for (const ch of cut) for (let i = 0; i < len; i++) {
      const a = Math.abs(ch[i]);
      if (a > peak) { peak = a; peakAt = i; }
      if (a >= 0.999) clipped++;
      sum2 += ch[i] * ch[i]; dc += ch[i];
    }
    const rms = Math.sqrt(sum2 / (len * 2));
    const mono = new Float32Array(len);
    for (let i = 0; i < len; i++) mono[i] = (cut[0][i] + cut[1][i]) * 0.5;

    /* decay to -60 dB from the peak, measured on a 5 ms sliding rms */
    const win = Math.round(0.005 * SR);
    let decayTo60 = null;
    const thresh = peak * 0.001;
    for (let s = peakAt; s + win < len; s += win) {
      let a = 0; for (let i = s; i < s + win; i++) a += mono[i] * mono[i];
      if (Math.sqrt(a / win) < thresh) { decayTo60 = +((s - peakAt) / SR).toFixed(3); break; }
    }
    const tailStart = Math.floor(len * 0.9);
    let t2 = 0; for (let i = tailStart; i < len; i++) t2 += mono[i] * mono[i];
    const tailRms = Math.sqrt(t2 / Math.max(1, len - tailStart));

    let lr = 0, ll = 0, rr = 0;
    for (let i = 0; i < len; i++) { lr += cut[0][i] * cut[1][i]; ll += cut[0][i] * cut[0][i]; rr += cut[1][i] * cut[1][i]; }
    const corr = (ll > 0 && rr > 0) ? +(lr / Math.sqrt(ll * rr)).toFixed(3) : 1;

    return {
      event: ev, pick: idx,
      seconds: +(len / SR).toFixed(3),
      lufs: (v => v === null ? null : +v.toFixed(2))(loudnessLUFS(cut)),
      peak_dbfs: dB(peak),
      true_peak_dbtp: dB(truePeak(cut)),
      rms_dbfs: dB(rms),
      crest_db: +(dB(peak) - dB(rms)).toFixed(2),
      attack_ms: +(1000 * peakAt / SR).toFixed(1),
      decay_to_60_s: decayTo60,
      tail_rms_dbfs: dB(tailRms),
      dc_offset: +(dc / (len * 2)).toFixed(5),
      clipped_samples: clipped,
      stereo_corr: corr,
      spectrum: spectrum(mono)
    };
  }

  return (async () => {
    const rows = [];
    const events = Object.keys(bank);
    for (const ev of events) {
      for (const idx of bank[ev]) {
        try { const r = await one(ev, idx); if (r) rows.push(r); }
        catch (e) { rows.push({ event: ev, pick: idx, error: String(e).slice(0, 120) }); }
        if (opts.limit && rows.length >= opts.limit) return rows;
      }
    }
    return rows;
  })();
};

(async () => {
  const bank = fs.readFileSync(path.join(ROOT, BANK), 'utf8');
  const sfx = fs.readFileSync(path.join(ROOT, 'engine/bohemia_sfx.js'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await page.goto('about:blank');
  await page.addScriptTag({ content: sfx });
  const rows = await page.evaluate(({ fn, bank, limit }) =>
    (new Function('return ' + fn)())(bank, { limit }), { fn: MEASURE.toString(), bank, limit: LIMIT });
  await browser.close();

  const ok = rows.filter(r => !r.error);
  console.log('rendered and measured ' + ok.length + ' approved sounds across '
    + new Set(ok.map(r => r.event)).size + ' events'
    + (errs.length ? ' (' + errs.length + ' page errors)' : ''));
  if (OUT) {
    fs.writeFileSync(path.isAbsolute(OUT) ? OUT : path.join(ROOT, OUT), JSON.stringify({
      what: 'every sound Paolo has approved, rendered through the real factory and measured',
      bank: BANK, at: new Date().toISOString().slice(0, 10),
      method: 'OfflineAudioContext 48k stereo; LUFS per ITU-R BS.1770-4 (K-weighted, 400ms blocks, '
            + '75% overlap, -70 absolute and -10 relative gates); true peak 4x linear oversample '
            + '(approximate, never over-reads); spectrum 4096-point Hann-windowed FFT',
      rows
    }, null, 1));
    console.log('wrote ' + OUT);
  }
  const bad = rows.filter(r => r.error);
  if (bad.length) console.log('  ' + bad.length + ' failed to render, first: ' + bad[0].event + ' ' + bad[0].error);
})().catch(e => { console.error(e); process.exit(1); });
