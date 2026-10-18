/* ============================================================================
   THE NEW SONG GATE: THE LONG ROAD  (SOUNDS, row [the map's song], round two of [a new song every round], 10/18/26)

   Paolo 10/18: 'I haven't heard a new song that was made in a long time... what's up?' and 'he likes 8-bit'. The
   row's order: the title (OVER THE RIDGE), then the map's travel song, then the fight's. The song is
   slices/vote/songs/the_long_road.json, played by engine/bohemia_chip_song.js, judged on
   slices/BOHEMIA_THE_LONG_ROAD_10_18_26.html over the real map. This proves:
     - it is the 8-bit way: 120 BPM, four voices of the NES's four kinds at its duty widths and 16 volume levels,
       every note a real pitch, the bass under MIDI 55, the tune between 60 and 96
     - it is a SONG with the shape the page promises: the engine turns over for four bars (no tune), the tune at bar 5
       with the kick and no snare, the snare late at bar 13, bar 21 the stall (one low E, nothing else), bar 27 the
       wrong sign (a B flat chord), 32 bars, a loop; and it is not the title's song again (its own key and its own
       lead duty)
     - it is new and locked: its own new_songs line in the song lock; the map plays nothing new until his YES
     - in a real browser, rendered offline: the same every render, the peak between -12 and -3 dBFS, no one-sample
       click (no sample jumps more than 0.4: the leak this round found and fixed jumped 0.50), no bar silent but the
       stall, the stall's bar is the triangle alone, almost nothing above 8 kHz, the written pitches sound (E5 at bar
       5, the B flat chord's D5 at bar 27); then on the page over the real map: A on the audio clock, B the tape, C no
       song, STOP, nothing throws
   Run: node gates/the_long_road_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const ROOT = path.dirname(__dirname);
const PORT = 8886;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const SONGF = 'slices/vote/songs/the_long_road.json';
const PAGE = 'slices/BOHEMIA_THE_LONG_ROAD_10_18_26.html';
const ID = 'sounds-the-long-road-10-18';

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  const song = JSON.parse(fs.readFileSync(path.join(ROOT, SONGF), 'utf8'));
  global.window = undefined;
  require(path.join(ROOT, 'engine/bohemia_chip_song.js'));
  const C = globalThis.BOH_CHIP;

  /* ---- the 8-bit way ---- */
  const V = song.voices, kinds = Object.values(V).map(v => v.kind).sort().join(',');
  ok('120 BPM, 16 steps a bar', song.bpm === 120 && song.steps_per_bar === 16);
  ok('four voices of the NES\'s four kinds: two pulses, the triangle, the noise', Object.keys(V).length === 4 && kinds === 'noise,pulse,pulse,triangle', kinds);
  ok('  the pulses at the chip\'s own duty widths', Object.values(V).filter(v => v.kind === 'pulse').every(v => C.NUM.DUTIES.includes(v.duty)), Object.values(V).filter(v => v.kind === 'pulse').map(v => v.duty).join(' '));
  ok('  every volume sequence is the chip\'s 16 levels', Object.values(V).every(v => !v.env || v.env.every(l => Number.isInteger(l) && l >= 0 && l <= 15)));
  const bad = [], range = {};
  for (const name of song.order) {
    const P = song.patterns[name]; if (!P) { bad.push('no pattern ' + name); continue; }
    for (const vn of Object.keys(V)) {
      const toks = String(P[vn] || '').trim().split(/\s+/).filter(Boolean);
      if (toks.length && toks.length !== 16) bad.push(name + '.' + vn + ' has ' + toks.length + ' steps');
      for (const t of toks) {
        if (t === '.' || t === '-') continue;
        if (V[vn].kind === 'noise') { if (!/^[kshot]+$/.test(t)) bad.push(name + '.' + vn + ' ' + t); continue; }
        const m = C.midi(t); if (m === null) { bad.push(name + '.' + vn + ' ' + t); continue; }
        range[vn] = range[vn] || [999, -1]; range[vn][0] = Math.min(range[vn][0], m); range[vn][1] = Math.max(range[vn][1], m);
      }
    }
  }
  ok('every step of every bar parses: a pitch, a hold, a stop or a drum', bad.length === 0, bad.slice(0, 4).join('; '));
  ok('  the bass under MIDI 55, the tune where a tune sings (60 to 96)', range.bass[1] < 55 && range.lead[0] >= 60 && range.lead[1] <= 96, JSON.stringify(range));

  /* ---- the shape ---- */
  const lead = b => String(song.patterns[song.order[b - 1]].lead || '').split(/\s+/).filter(t => t && t !== '.' && t !== '-');
  const drums = b => String(song.patterns[song.order[b - 1]].drums || '').split(/\s+/).filter(t => t && t !== '.' && t !== '-');
  ok('32 bars, a minute at 120, and it loops', song.order.length === 32);
  const has = (b, h) => drums(b).some(t => t.includes(h));
  ok('the engine turns over: bars 1 to 4 have no tune, only the bass and the tick', [1, 2, 3, 4].every(b => lead(b).length === 0 && drums(b).every(t => t === 'h')) && lead(5).length > 0);
  ok('the snare arrives late: the kick from bar 5, no snare before bar 13, and from bar 13 on', has(5, 'k') && [...Array(12).keys()].every(i => !has(i + 1, 's')) && has(13, 's'));
  const stall = song.patterns[song.order[20]];
  ok('bar 21 is the stall: one low E on the triangle, nothing else', lead(21).length === 0 && drums(21).length === 0 && String(stall.bass).trim().split(/\s+/)[0] === 'E2' && String(stall.bass).split(/\s+/).filter(t => t !== '.').length === 1 && String(stall.arp).split(/\s+/).filter(t => t !== '.' && t !== '-').length === 0);
  ok('bar 27 is the wrong sign, B flat, in a song in E', song.patterns[song.order[26]].chord === 'Bb' && song.patterns[song.order[0]].chord === 'Em' && /Bb4/.test(song.patterns[song.order[26]].lead));
  const ridge = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/vote/songs/over_the_ridge.json'), 'utf8'));
  ok('not the title\'s song again: its own key, its own tune and its own lead voice', ridge.voices.lead.duty !== song.voices.lead.duty && ridge.patterns[ridge.order[4]].lead !== song.patterns[song.order[4]].lead && ridge.patterns[ridge.order[0]].chord !== song.patterns[song.order[0]].chord);

  /* ---- new and locked ---- */
  const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_SONG_LOCK.json'), 'utf8'));
  const ns = (lock.new_songs || []).find(x => x.id === song.id);
  const md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, SONGF))).digest('hex');
  ok('the song lock carries it as a new song, with its hash and its why', !!ns && ns.file === SONGF && ns.md5 === md5 && /ON PURPOSE/.test(ns.why || ''), ns ? ns.md5 + ' vs ' + md5 : 'no line');
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const item = (reg.items || []).find(i => i.id === ID);
  const yes = (reg.verdicts || []).some(v => v.id === ID && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = /the_long_road\.json/.test(alpha);
  ok('unjudged is silent: the map plays nothing new until his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired');
  /* PULLED BEFORE HE HEARD IT (10/18): his YES on the title song came with 'I wonder if there's a middle ground'; this song is
     the pure chip style he questioned, so it waits for the middle ground and never reaches the tab as it is */
  ok('not in the VOTE tab: pulled for the middle ground before he heard it', !item, item ? 'REGISTERED' : 'pulled');
  ok('  its title and the song\'s own are drafts (a name is an attempt)', song.draft === true);

  /* ---- the render, in a real browser ---- */
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], miss = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) miss.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load' });
  const R = await p.evaluate(async () => {
    const song = await (await fetch('vote/songs/the_long_road.json')).json();
    const sr = 44100, secs = song.order.length * 2 + 0.5;
    const once = async () => { const c = new OfflineAudioContext(1, Math.ceil(sr * secs), sr); const S = BOH_CHIP.make(c, c.destination, song, {}); S.renderAll(); const buf = await c.startRendering(); return { d: buf.getChannelData(0), log: S.log }; };
    const r1 = await once(), r2 = await once(), d = r1.d;
    let diff = 0, pk = 0; for (let i = 0; i < d.length; i++) { diff = Math.max(diff, Math.abs(d[i] - r2.d[i])); pk = Math.max(pk, Math.abs(d[i])); }
    const bars = []; for (let b = 0; b < song.order.length; b++) { let s = 0; const a = Math.round((0.05 + b * 2) * sr), z = Math.round((0.05 + (b + 1) * 2) * sr); for (let i = a; i < z; i++) s += d[i] * d[i]; bars.push(10 * Math.log10(s / (z - a) + 1e-12)); }
    /* a pitch from one 120 ms window, by its strongest bin between 200 and 1500 Hz, on the lead alone */
    const lead = async () => { const s2 = JSON.parse(JSON.stringify(song)); Object.keys(s2.voices).forEach(k => { if (k !== 'lead') s2.voices[k].vol = 0; }); const c = new OfflineAudioContext(1, Math.ceil(sr * secs), sr); const S = BOH_CHIP.make(c, c.destination, s2, {}); S.renderAll(); return (await c.startRendering()).getChannelData(0); };
    const L = await lead();
    const f0 = t => { const N = 8192, a = Math.round(t * sr); let best = 0, bf = 0; for (let f = 200; f < 1500; f += 0.5) { let re = 0, im = 0; for (let i = 0; i < 5292; i += 2) { const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / 5292), x = L[a + i] * w, ph = 2 * Math.PI * f * i / sr; re += x * Math.cos(ph); im += x * Math.sin(ph); } const m = re * re + im * im; if (m > best) { best = m; bf = f; } } return bf; };
    /* the band above 8 kHz against the whole, by a first difference (a rough high-pass): small means no crush */
    const band = (x, a, z) => { let s = 0; for (let i = a; i < z; i++) s += x[i] * x[i]; return 10 * Math.log10(s / (z - a) + 1e-12); };
    const hp = new Float32Array(d.length); let y = 0, px = 0; const k = Math.exp(-2 * Math.PI * 8000 / sr);
    for (let i = 0; i < d.length; i++) { y = k * (y + d[i] - px); px = d[i]; hp[i] = y; }
    return { diff, peak: 20 * Math.log10(pk), bars, notes: r1.log.length,
      first: { lead: (r1.log.find(e => e.v === 'lead') || {}).at, drums: (r1.log.find(e => e.v === 'drums') || {}).at },
      jump: (() => { let m = 0, at = 0; for (let i = 1; i < d.length; i++) { const j = Math.abs(d[i] - d[i - 1]); if (j > m) { m = j; at = i / sr; } } return [m, at]; })(),
      stallNotes: r1.log.filter(e => e.at >= 40.05 && e.at < 42.05).map(e => e.v),
      e5: f0(8.07), d5: f0(52.57), above8k: band(hp, 0, d.length) - band(d, 0, d.length) };
  });
  ok('the same song every render, within one part in 100,000 (float rounding, 100 dB under hearing)', R.diff < 1e-5, 'max diff ' + R.diff.toExponential(2));
  ok('the peak between -12 and -3 dBFS: no clip, no compressor needed', R.peak < -3 && R.peak > -12, R.peak.toFixed(2) + ' dB');
  ok('no one-sample click: no sample jumps more than 0.4 (the leak fixed this round jumped 0.50)', R.jump[0] < 0.4, R.jump[0].toFixed(3) + ' at ' + R.jump[1].toFixed(3) + ' s');
  ok('no bar is silent but the stall', R.bars.every((x, i) => i === 20 || x > -40), 'quietest ' + Math.min(...R.bars.filter((x, i) => i !== 20)).toFixed(1) + ' dB');
  ok('the tune enters at bar 5 (8 s), on the clock', Math.abs(R.first.lead - 8.05) < 0.002, JSON.stringify(R.first));
  ok('the stall is the triangle alone', R.stallNotes.length === 1 && R.stallNotes[0] === 'bass', R.stallNotes.join(','));
  ok('the written pitches sound: E5 at bar 5 and the wrong sign\'s D5 at bar 27', Math.abs(R.e5 - 659.26) < 4 && Math.abs(R.d5 - 587.33) < 4, R.e5 + ' Hz, ' + R.d5 + ' Hz');
  ok('almost nothing above 8 kHz: no crush, no sand', R.above8k < -20, R.above8k.toFixed(1) + ' dB under the whole');

  /* ---- the page over the real map ---- */
  await p.waitForTimeout(800);
  const look = await p.evaluate(() => { const f = document.getElementById('map'); let ok2 = false; try { ok2 = !!f.contentDocument && f.contentDocument.readyState !== 'loading' && f.contentDocument.body.children.length > 0; } catch (_e) {} return { frame: !!f && /BOHEMIA_MAP_CURRENT/.test(f.src), loaded: ok2 }; });
  ok('the page shows the real map', look.frame && look.loaded, JSON.stringify(look));
  await p.tap('#song');
  await p.waitForTimeout(6000);
  const a = await p.evaluate(() => window.__road());
  const at = a.log.filter(e => e.v === 'arp').map(e => e.at), t0 = at[0];
  const off = at.map(t => Math.abs(((t - t0) / 0.125) - Math.round((t - t0) / 0.125)) * 125);
  ok('A: the song plays on the audio clock, every note on the 125 ms grid within a millisecond', a.playing && a.mode === 'song' && at.length > 20 && Math.max(...off) < 1, at.length + ' arp notes, worst ' + Math.max(...off).toFixed(3) + ' ms');
  ok('  over the desert', a.bed);
  await p.tap('#tape'); await p.waitForTimeout(1200);
  const t = await p.evaluate(() => window.__road());
  ok('B: the same song on the worn tape', t.mode === 'tape' && t.playing && t.notes > 0);
  await p.tap('#none'); await p.waitForTimeout(800);
  const w = await p.evaluate(() => window.__road());
  ok('C: the map without a song, the desert alone', w.mode === 'none' && !w.playing && w.bed);
  await p.tap('#stop'); await p.waitForTimeout(400);
  const s = await p.evaluate(() => ({ r: window.__road(), text: document.getElementById('num').textContent }));
  ok('STOP: silent', s.text === 'Stopped.' && !s.r.playing && !s.r.bed);
  const fit = await p.evaluate(() => [...document.querySelectorAll('#bar button')].map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top)]; }));
  ok('the four buttons fit the phone in two rows', fit.length === 4 && fit.every(r => r[0] >= 0 && r[1] <= 390) && new Set(fit.map(r => r[2])).size === 2, JSON.stringify(fit));
  ok('every file the page asked for was there', miss.length === 0, miss.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nTHE LONG ROAD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
