/* ============================================================================
   THE MIDDLE GROUND GATE: NIGHT FREIGHT  (SOUNDS, row [the middle ground], round three of [a new song every round],
   10/18/26)

   PAOLO 10/18, his YES on OVER THE RIDGE: 'it sounds very different than the rest of our songs... I wonder if there's
   like a middleground'. The coordinator: 'his canon songs' own style and arrangement played the clean 8-bit way, so old
   and new sound like one game.' The song is slices/vote/songs/night_freight.json (tools/bohemia_sounds_middle_ground.py
   writes it), played by engine/bohemia_chip_song.js, judged on slices/BOHEMIA_NIGHT_FREIGHT_10_18_26.html over the
   real map beside his own REPO MAN as the map plays it. This proves:
     - HIS FORM, BYTE FOR BYTE: the song's arrangement and root movement are SONG_ARR and SONG_ROOT read out of the
       alpha (the bodies the song lock holds), bar by bar: every bar's section and every bar's key shift; the scale is
       REPO MAN's own row in MLOOPS; the beat late for the bars the map's MUS.drumsHeld holds (step < 128)
     - HIS GROOVE: half time, the kick on steps 0 and 8, the hat on 4 and 12 and gone in the strip, no snare, his fill
       (the kick on the last four sixteenths of every section's last bar), no drums before bar 9
     - HIS SECTIONS: A no tune, one motif note on beat one; B the tune and its echo; C kick and bass only; D the tune
       and the high line exactly an octave over it; the bass on his engine's rule (scale[s % 5]) with his B lift
     - THE 8-BIT WAY: four voices of the NES's four kinds at its duty widths and 16 levels; the tune from the five
       notes only; it is not the title's song or the pulled map song again
     - new and locked, written by its tool, silent in the game until his YES, in the VOTE tab with his song beside it
     - in a real browser, rendered offline: the same every render, the peak between -12 and -3 dBFS, no one-sample
       click, no silent bar, the tune at bar 5 and the drums at bar 9 on the clock, D5 at bar 5 and F5 at bar 9 (the
       song moved to B flat by his SONG_ROOT), nothing much above 8 kHz, the echo heard on a phone (no more than 14 dB
       under the tune through a phone's speaker); his recording loud the same as the new song through that speaker
       (within 1 dB), so the A/B is the music and not the volume; then the page: A on the audio clock, B his song,
       C no song, STOP, nothing throws
   Run: node gates/night_freight_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const PORT = 8887;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const SONGF = 'slices/vote/songs/night_freight.json';
const HISF = 'slices/vote/songs/his_repo_man_on_the_map.mp3';
const PAGE = 'slices/BOHEMIA_NIGHT_FREIGHT_10_18_26.html';
const ID = 'sounds-night-freight-10-18';

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

  /* ---- his form, read out of the alpha (the song lock's own anchors) ---- */
  const alphaRaw = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const ri = alphaRaw.indexOf('<script type="text/plain" id="BOHEMIA_MUSIC_REPO">'), rj = ri >= 0 ? alphaRaw.indexOf('</script>', ri) : -1;
  const alpha = ri >= 0 && rj > ri ? alphaRaw.slice(0, ri) + alphaRaw.slice(rj) : alphaRaw;
  const bk = "const COMBAT_B64='", bi = alphaRaw.indexOf(bk) + bk.length, bj = alphaRaw.indexOf("'", bi);
  const demo = Buffer.from(alphaRaw.slice(bi, bj), 'base64').toString('utf8');
  const grab = (src, start, end) => { const i = src.indexOf(start); if (i < 0) return null; const j = src.indexOf(end, i + start.length); return j < 0 ? null : src.slice(i + start.length - 1, j + 1); };
  const ARR = JSON.parse(grab(demo, 'const SONG_ARR=[', '];').replace(/'/g, '"'));
  const RT = JSON.parse(grab(demo, 'const SONG_ROOT=[', '];'));
  const F = song.his_form || {};
  ok('HIS FORM, BYTE FOR BYTE: the arrangement is his SONG_ARR and the root movement his SONG_ROOT, read out of the alpha', JSON.stringify(F.SONG_ARR) === JSON.stringify(ARR) && JSON.stringify(F.SONG_ROOT) === JSON.stringify(RT), ARR.join('') + ' / ' + RT.join(''));
  const repo = /\{n:'REPO MAN'[^}]*scale:(\[[^\]]*\])/.exec(alpha);
  ok('  the scale is REPO MAN\'s own row in his MLOOPS', !!repo && JSON.stringify(JSON.parse(repo[1])) === JSON.stringify(F.scale), repo ? repo[1] : 'no REPO MAN row');
  ok('  the beat late for the bars the map holds his kit (MUS.drumsHeld: step < 128 is eight bars)', /return MUS\.step < 128;/.test(alpha) && F.held_bars === 8);
  ok('64 bars, 2:08 at 120, his sixteen sections of four', song.order.length === 64 && ARR.length === 16);
  const entry = b => { const e = String(song.order[b]), k = e.indexOf('@'); return { name: k < 0 ? e : e.slice(0, k), shift: k < 0 ? 0 : +e.slice(k + 1) }; };
  const secOf = b => (song.patterns[entry(b).name] || {}).part;
  const PART = { A: 'core', B: 'lift: the tune', C: 'strip: kick and bass', D: 'full: the high line' };
  const wrongSec = [], wrongKey = [];
  for (let b = 0; b < 64; b++) { const si = b >> 2; if (secOf(b) !== PART[ARR[si]]) wrongSec.push(b + 1); if (entry(b).shift !== F.scale[RT[si] % F.scale.length]) wrongKey.push(b + 1); }
  ok('  every bar plays his section for its place', wrongSec.length === 0, wrongSec.slice(0, 6).join(','));
  ok('  every bar sits in his key for its place (the whole song moves, scale[SONG_ROOT]: G, B flat, D, A)', wrongKey.length === 0, wrongKey.slice(0, 6).join(','));

  /* ---- the 8-bit way ---- */
  const V = song.voices, kinds = Object.values(V).map(v => v.kind).sort().join(',');
  ok('120 BPM, 16 steps a bar', song.bpm === 120 && song.steps_per_bar === 16);
  ok('four voices of the NES\'s four kinds: two pulses, the triangle, the noise', Object.keys(V).length === 4 && kinds === 'noise,pulse,pulse,triangle', kinds);
  ok('  the pulses at the chip\'s own duty widths, the tune on the round 50 percent', Object.values(V).filter(v => v.kind === 'pulse').every(v => C.NUM.DUTIES.includes(v.duty)) && V.lead.duty === 0.5);
  ok('  every volume sequence is the chip\'s 16 levels, the kit\'s too', Object.values(V).concat(Object.values(song.kit || {})).every(v => !v.env || v.env.every(l => Number.isInteger(l) && l >= 0 && l <= 15)));
  ok('  the song\'s own kit is chip hits: a noise period from the 16 and a triangle falling', Object.values(song.kit || {}).every(k => Number.isInteger(k.noise) && k.noise >= 0 && k.noise < 16 && (!k.tri || (k.tri[0] > k.tri[1] && k.tri[2] > 0 && k.tri[2] < 0.5))));
  const bad = [], range = {}, kitL = Object.keys(C.KIT).concat(Object.keys(song.kit || {})).join('');
  const toks = (b, vn) => String((song.patterns[entry(b).name] || {})[vn] || '').trim().split(/\s+/).filter(Boolean);
  for (let b = 0; b < 64; b++) {
    if (!song.patterns[entry(b).name]) { bad.push('no pattern ' + entry(b).name); continue; }
    for (const vn of Object.keys(V)) {
      const t = toks(b, vn);
      if (t.length && t.length !== 16) bad.push(entry(b).name + '.' + vn + ' has ' + t.length + ' steps');
      for (const x of t) {
        if (x === '.' || x === '-') continue;
        if (V[vn].kind === 'noise') { if (![...x].every(h => kitL.includes(h))) bad.push(entry(b).name + '.' + vn + ' ' + x); continue; }
        const m = C.midi(x); if (m === null) { bad.push(entry(b).name + '.' + vn + ' ' + x); continue; }
        const mm = m + entry(b).shift;
        range[vn] = range[vn] || [999, -1]; range[vn][0] = Math.min(range[vn][0], mm); range[vn][1] = Math.max(range[vn][1], mm);
      }
    }
  }
  ok('every step of every bar parses: a pitch, a hold, a stop or a hit of the kit', bad.length === 0, bad.slice(0, 4).join('; '));
  ok('  as played (the key shift in): the bass under MIDI 62 (his B lift takes half a bar up an octave), the tune and the echo where they sing (60 to 96)', range.bass[1] < 62 && range.bass[0] >= 36 && range.lead[0] >= 60 && range.lead[1] <= 96 && range.echo[0] >= 60 && range.echo[1] <= 96, JSON.stringify(range));
  const pcs = new Set(F.scale.map(d => (7 + d) % 12));   /* G + his scale */
  const offKey = [];
  for (let b = 0; b < 64; b++) for (const vn of ['lead', 'echo', 'bass']) for (const x of toks(b, vn)) { if (x === '.' || x === '-') continue; if (!pcs.has(C.midi(x) % 12)) offKey.push(entry(b).name + '.' + vn + ' ' + x); }
  ok('  the tune, the echo and the bass are written in the five notes only (G A B flat D E flat), his engine moves them', offKey.length === 0, offKey.slice(0, 4).join(', '));

  /* ---- his groove ---- */
  const hit = (b, s, h) => (toks(b, 'drums')[s] || '.').includes(h);
  const grooveBad = [];
  for (let b = 0; b < 64; b++) {
    const t = toks(b, 'drums'), sec = ARR[b >> 2], last = (b % 4) === 3;
    if (b < 8) { if (t.some(x => x !== '.' && x !== '-')) grooveBad.push('drums in bar ' + (b + 1)); continue; }
    if (!hit(b, 0, 'b') || !hit(b, 8, 'b')) grooveBad.push('no kick on 1 and 3 in bar ' + (b + 1));
    if (sec === 'C' ? (hit(b, 4, 'c') || hit(b, 12, 'c')) : (!hit(b, 4, 'c') || !hit(b, 12, 'c'))) grooveBad.push('the hat wrong in bar ' + (b + 1));
    if (t.some(x => /s/.test(x))) grooveBad.push('a snare in bar ' + (b + 1));
    if (last !== [12, 13, 14, 15].every(s => hit(b, s, 'f'))) grooveBad.push('the fill wrong in bar ' + (b + 1));
    if ([1, 2, 3, 5, 6, 7, 9, 10, 11].some(s => hit(b, s, 'b') || hit(b, s, 'f'))) grooveBad.push('a kick off his steps in bar ' + (b + 1));
  }
  ok('HIS GROOVE: no drums in bars 1 to 8; then the kick on 1 and 3, the hat on 2 and 4 (none in the strip), no snare, his fill in every section\'s last bar', grooveBad.length === 0, grooveBad.slice(0, 4).join('; '));

  /* ---- his sections ---- */
  const notes = (b, vn) => toks(b, vn).map((x, s) => [s, x]).filter(([, x]) => x !== '.' && x !== '-');
  const secBad = [];
  for (let b = 0; b < 64; b++) {
    const sec = ARR[b >> 2], L = notes(b, 'lead'), E = notes(b, 'echo');
    if (sec === 'A' && (L.length || !E.length || E[0][0] !== 0)) secBad.push('A bar ' + (b + 1));
    if (sec === 'B' && (!L.length || !E.length)) secBad.push('B bar ' + (b + 1));
    if (sec === 'C' && (L.length || E.length)) secBad.push('C bar ' + (b + 1));
    if (sec === 'D' && (L.length !== E.length || L.some(([s, x], i) => E[i][0] !== s || C.midi(E[i][1]) !== C.midi(x) + 12))) secBad.push('D bar ' + (b + 1));
  }
  ok('HIS SECTIONS: A no tune and the motif on beat one; B the tune and its echo; C kick and bass only; D the high line an octave over the tune', secBad.length === 0, secBad.slice(0, 4).join(', '));
  const bassBad = [];
  for (let b = 0; b < 64; b++) for (const [s, x] of notes(b, 'bass')) {
    const d = F.scale[s % F.scale.length], m = C.midi(x);
    if (m % 12 !== (7 + d) % 12) bassBad.push(entry(b).name + ' step ' + s + ' ' + x);   /* his rule: the degree is the step's place */
    const want = 43 + d - (d > 7 ? 12 : 0) + ((ARR[b >> 2] === 'B' && s % 8 >= 4) ? 12 : 0);   /* G2, the flat sixth under it; his B lift */
    if (m !== want) bassBad.push(entry(b).name + ' step ' + s + ' ' + x + ' not ' + want);
  }
  ok('  the bass on his engine\'s own rule (the degree is scale[s % 5]) with his B lift (s % 8 >= 4 an octave up)', bassBad.length === 0, bassBad.slice(0, 4).join(', '));

  /* ---- not the same song again ---- */
  const ridge = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/vote/songs/over_the_ridge.json'), 'utf8'));
  const road = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/vote/songs/the_long_road.json'), 'utf8'));
  ok('not the title\'s song or the pulled map song: its own tune, no running arpeggio', ![ridge, road].some(o => Object.values(o.patterns).some(p => p.lead && p.lead === song.patterns.B1.lead)) && !Object.keys(V).includes('arp'));

  /* ---- new, written by its tool, locked, silent until his YES, in the tab ---- */
  let toolOk = false; try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_sounds_middle_ground.py'), '--check'], { stdio: 'pipe' }); toolOk = true; } catch (e) {}
  ok('the file is what its tool writes (edit the tool, not the file)', toolOk);
  const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_SONG_LOCK.json'), 'utf8'));
  const ns = (lock.new_songs || []).find(x => x.id === song.id);
  const md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, SONGF))).digest('hex');
  ok('the song lock carries it as a new song, with its hash and its why', !!ns && ns.file === SONGF && ns.md5 === md5 && /ON PURPOSE/.test(ns.why || ''), ns ? ns.md5 + ' vs ' + md5 : 'no line');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const item = (reg.items || []).find(i => i.id === ID);
  const yes = (reg.verdicts || []).some(v => v.id === ID && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = /night_freight\.json/.test(alphaRaw);
  ok('unjudged is silent: the map plays nothing new until his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired');
  ok('in the VOTE tab, kind song, on this page, his song as one of the options', !!item && item.kind === 'song' && item.show && item.show.src === path.basename(PAGE) && (item.options || []).some(o => /REPO MAN/.test(o)) && item.draft === true);
  ok('  its title and the song\'s own are drafts (a name is an attempt)', song.draft === true);
  ok('his song for the A/B is a recording on disk, an mp3 (his rows untouched: the song lock holds them)', fs.existsSync(path.join(ROOT, HISF)) && fs.statSync(path.join(ROOT, HISF)).size > 100000);

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
    const song = await (await fetch('vote/songs/night_freight.json')).json();
    const sr = 44100, secs = song.order.length * 2 + 0.5;
    const solo = (only) => { const s2 = JSON.parse(JSON.stringify(song)); if (only) Object.keys(s2.voices).forEach(k => { if (k !== only) s2.voices[k].vol = 0; }); return s2; };
    /* a phone's speaker: nothing much under 350 Hz (two high-passes), the way the A/B is heard */
    const phone = (c) => { const h1 = c.createBiquadFilter(), h2 = c.createBiquadFilter(); [h1, h2].forEach(h => { h.type = 'highpass'; h.frequency.value = 350; h.Q.value = 0.7; }); h1.connect(h2); h2.connect(c.destination); return h1; };
    const once = async (s2, ph, bars) => { const c = new OfflineAudioContext(1, Math.ceil(sr * (bars ? bars * 2 + 0.5 : secs)), sr); const S = BOH_CHIP.make(c, ph ? phone(c) : c.destination, s2 || song, {}); S.renderAll(0, bars); const buf = await c.startRendering(); return { d: buf.getChannelData(0), log: S.log }; };
    const rms = (d, a, z) => { a = a || 0; z = z || d.length; let s = 0, n = 0; for (let i = a; i < z; i++) { s += d[i] * d[i]; n++; } return 10 * Math.log10(s / n + 1e-12); };
    const active = d => { let s = 0, n = 0; const W = 2205; for (let i = 0; i + W < d.length; i += W) { let q = 0; for (let j = 0; j < W; j++) q += d[i + j] * d[i + j]; if (q / W > 1e-7) { s += q; n += W; } } return 10 * Math.log10(s / (n || 1) + 1e-12); };
    const r1 = await once(), r2 = await once(), d = r1.d;
    let diff = 0, pk = 0; for (let i = 0; i < d.length; i++) { diff = Math.max(diff, Math.abs(d[i] - r2.d[i])); pk = Math.max(pk, Math.abs(d[i])); }
    const bars = []; for (let k = 0; k < song.order.length; k++) bars.push(rms(d, Math.round((0.05 + k * 2) * sr), Math.round((0.05 + (k + 1) * 2) * sr)));
    const L = (await once(solo('lead'))).d;
    const f0 = t => { const a = Math.round(t * sr); let best = 0, bf = 0; for (let f = 200; f < 1500; f += 0.5) { let re = 0, im = 0; for (let i = 0; i < 5292; i += 2) { const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / 5292), x = L[a + i] * w, ph = 2 * Math.PI * f * i / sr; re += x * Math.cos(ph); im += x * Math.sin(ph); } const m = re * re + im * im; if (m > best) { best = m; bf = f; } } return bf; };
    const hp = new Float32Array(d.length); let y = 0, px = 0; const k = Math.exp(-2 * Math.PI * 8000 / sr);
    for (let i = 0; i < d.length; i++) { y = k * (y + d[i] - px); px = d[i]; hp[i] = y; }
    const leadPh = active((await once(solo('lead'), true)).d), echoPh = active((await once(solo('echo'), true)).d);
    const mine32 = rms((await once(null, true, 32)).d);
    /* his song through the same speaker */
    const ab = await (await fetch('vote/songs/his_repo_man_on_the_map.mp3')).arrayBuffer();
    const hb = await new OfflineAudioContext(1, 44100, 44100).decodeAudioData(ab);
    const hc = new OfflineAudioContext(1, hb.length, hb.sampleRate), hs = hc.createBufferSource(); hs.buffer = hb; hs.connect(phone(hc)); hs.start(0);
    const his = rms((await hc.startRendering()).getChannelData(0));
    return { diff, peak: 20 * Math.log10(pk), bars, notes: r1.log.length,
      first: { lead: (r1.log.find(e => e.v === 'lead') || {}).at, drums: (r1.log.find(e => e.v === 'drums') || {}).at },
      jump: (() => { let m = 0, at = 0; for (let i = 1; i < d.length; i++) { const j = Math.abs(d[i] - d[i - 1]); if (j > m) { m = j; at = i / sr; } } return [m, at]; })(),
      d5: f0(8.07), f5: f0(16.07), above8k: rms(hp) - rms(d), leadPh, echoPh, mine32, his, hisSecs: hb.duration };
  });
  ok('the same song every render, within one part in 100,000 (float rounding, 100 dB under hearing)', R.diff < 1e-5, 'max diff ' + R.diff.toExponential(2));
  ok('the peak between -12 and -3 dBFS: no clip, no compressor needed', R.peak < -3 && R.peak > -12, R.peak.toFixed(2) + ' dB');
  ok('no one-sample click: no sample jumps more than 0.4', R.jump[0] < 0.4, R.jump[0].toFixed(3) + ' at ' + R.jump[1].toFixed(3) + ' s');
  ok('no bar is silent (his strip keeps the kick and the bass)', R.bars.every(x => x > -40), 'quietest ' + Math.min(...R.bars).toFixed(1) + ' dB');
  ok('the tune enters at bar 5 (8 s) and the drums at bar 9 (16 s), on the clock: the beat arrives late', Math.abs(R.first.lead - 8.05) < 0.002 && Math.abs(R.first.drums - 16.05) < 0.002, JSON.stringify(R.first));
  ok('the written pitches sound: D5 at bar 5, and F5 at bar 9 where his SONG_ROOT moves the song to B flat', Math.abs(R.d5 - 587.33) < 4 && Math.abs(R.f5 - 698.46) < 4, R.d5 + ' Hz, ' + R.f5 + ' Hz');
  ok('almost nothing above 8 kHz: no crush, no sand', R.above8k < -20, R.above8k.toFixed(1) + ' dB under the whole');
  ok('the echo and the motif are heard on a phone: no more than 14 dB under the tune through its speaker', R.leadPh - R.echoPh < 14 && R.leadPh - R.echoPh > 4, 'tune ' + R.leadPh.toFixed(1) + ', echo ' + R.echoPh.toFixed(1) + ' dB');
  ok('A FAIR A/B: his REPO MAN is as loud as the new song through a phone\'s speaker, within 1 dB (the first 32 bars of each)', Math.abs(R.his - R.mine32) < 1 && R.hisSecs > 64 && R.hisSecs < 67, 'his ' + R.his.toFixed(2) + ', mine ' + R.mine32.toFixed(2) + ' dB, ' + R.hisSecs.toFixed(1) + ' s');

  /* ---- the page over the real map ---- */
  await p.waitForTimeout(800);
  const look = await p.evaluate(() => { const f = document.getElementById('map'); let ok2 = false; try { ok2 = !!f.contentDocument && f.contentDocument.readyState !== 'loading' && f.contentDocument.body.children.length > 0; } catch (_e) {} return { frame: !!f && /BOHEMIA_MAP_CURRENT/.test(f.src), loaded: ok2 }; });
  ok('the page shows the real map', look.frame && look.loaded, JSON.stringify(look));
  await p.tap('#song');
  await p.waitForTimeout(7000);
  const a = await p.evaluate(() => window.__freight());
  const at = a.log.filter(e => e.v === 'bass').map(e => e.at), t0 = at[0];
  const off = at.map(t => Math.abs(((t - t0) / 0.125) - Math.round((t - t0) / 0.125)) * 125);
  ok('A: the song plays on the audio clock, every note on the 125 ms grid within a millisecond', a.playing && a.mode === 'song' && at.length > 8 && Math.max(...off) < 1, at.length + ' bass notes, worst ' + Math.max(...off).toFixed(3) + ' ms');
  ok('  over the desert', a.bed);
  await p.tap('#his'); await p.waitForTimeout(2500);
  const h = await p.evaluate(() => ({ r: window.__freight(), text: document.getElementById('num').textContent }));
  ok('B: his REPO MAN plays, the new song stopped', h.r.mode === 'his' && h.r.his && !h.r.playing && /REPO MAN/.test(h.text), h.text.slice(0, 80));
  await p.tap('#none'); await p.waitForTimeout(800);
  const w = await p.evaluate(() => window.__freight());
  ok('C: the map without a song, the desert alone', w.mode === 'none' && !w.playing && !w.his && w.bed);
  await p.tap('#stop'); await p.waitForTimeout(400);
  const s = await p.evaluate(() => ({ r: window.__freight(), text: document.getElementById('num').textContent }));
  ok('STOP: silent', s.text === 'Stopped.' && !s.r.playing && !s.r.his && !s.r.bed);
  const fit = await p.evaluate(() => [...document.querySelectorAll('#bar button')].map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top)]; }));
  ok('the four buttons fit the phone in two rows', fit.length === 4 && fit.every(r => r[0] >= 0 && r[1] <= 390) && new Set(fit.map(r => r[2])).size === 2, JSON.stringify(fit));
  ok('every file the page asked for was there', miss.length === 0, miss.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nNIGHT FREIGHT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
