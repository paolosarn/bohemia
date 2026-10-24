/* THE SQUIGGLE FROM A RECORDING: ITS LEVEL, AND WHAT IT DOES, MEASURED IN A REAL CHROMIUM (SOUNDS 10/24/26, rule 135).
   The new voice takes the old one's place on the same bus (the EFFECTS slider, the music's duck), through the game's own
   chain (MUS.audio: compressor -14 dB 6:1 2 ms, brickwall -5 dB 20:1 1 ms; the same two nodes
   tools/bohemia_bullet_lands_level.js uses): the lines below, said by his six and by six people cast from his envelope, the
   OLD engine (engine/bohemia_voice.js say()) and the NEW (engine/bohemia_voice_recorded.js), each line's level the energy
   mean of its loudest 100 ms windows after the chain.
   THE MARK: -22 dB. MEASURED FIRST: the old voice sat at -27.7 dB after the chain, under every bullet landing (-18 to -21)
   and 7.7 dB under the gun (-20): a person in this game was the quietest thing on the bus, the likeliest reason he asked
   where it was. A person talking sits just under the gun and level with a hit landing, and the music already ducks for him.
   gain_db (written into slices/voice_heard/index.json, the one number the player reads beside the takes) lands the new
   voice at the mark.
   THE CLICK RULER: a click is broadband, and every take is band-limited at 7.2 kHz in the file; the highest a person's
   playback rate goes is +4 semitones and a shout's +3 (x1.5), so nothing a syllable says reaches 13 kHz, and energy above
   13 kHz in a dry render is a click (old and new side by side; the old's hiss bursts are broadband by design).
     node tools/bohemia_squiggle_level.js            (run after tools/bohemia_squiggle_from_a_recording.py) */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const ROOT = path.dirname(__dirname);
const IDX = path.join(ROOT, 'slices', 'voice_heard', 'index.json');
const PORT = 8941;
const MARK = -22.0;
const RULER_HZ = 13000;

/* the game's own lines: the second's teaching lines (records/target/words/the_second_speaks.json), the walking man, the
   keepers, a question, a shout, a trail-off */
function lines() {
  const out = [];
  try {
    const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/words/the_second_speaks.json'), 'utf8'));
    (function walk(o) { if (!o || typeof o !== 'object') return; if (typeof o.line === 'string') out.push(o.line); for (const k in o) walk(o[k]); })(W);
  } catch (e) {}
  out.push('Sin baterías no hay comida, jefe. I’m gone.', 'Shelves are empty today.', 'One battery and a day for any of these. What goes up?',
    'This is not our ground. We build where we hold.', 'You hear that out there?', 'GET OUT OF MY HOUSE!', 'Oh, them. Then you should know a few more people.',
    'On your own. That happens...');
  return out.slice(0, 24);
}

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
  fs.createReadStream(f).pipe(rs);
});

/* shared with the gate */
const PAGE_LIB = `
  window.SR = 44100;
  window.chain = function (AC) {
    const OUT = AC.createGain();
    const cmp = AC.createDynamicsCompressor(); cmp.threshold.value = -14; cmp.knee.value = 8; cmp.ratio.value = 6; cmp.attack.value = 0.002; cmp.release.value = 0.12;
    const lim = AC.createDynamicsCompressor(); lim.threshold.value = -5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
    OUT.connect(cmp); cmp.connect(lim); lim.connect(AC.destination); return OUT;
  };
  /* the energy mean of the loudest 100 ms windows (the top fifth of the voiced ones): a line's spoken level */
  window.level = function (d) { const w = Math.round(0.1 * SR), st = Math.round(0.025 * SR), e = [];
    for (let i = 0; i + w <= d.length; i += st) { let s = 0; for (let j = i; j < i + w; j += 2) s += d[j] * d[j]; e.push(s / (w / 2)); }
    e.sort((a, b) => b - a); const k = Math.max(1, Math.round(e.filter(x => x > 1e-7).length / 5)); let m = 0; for (let i = 0; i < k; i++) m += e[i];
    return 10 * Math.log10(m / k + 1e-20); };
  /* THE CLICK RULER. A click is a step: broadband and over in a millisecond. Real speech up there (the skirt of an 's') is
     noise-like and lasts tens of ms. So: everything above the ruler (an 8th-order high-pass as four biquads), its energy
     in 0.5 ms frames, and a click is a frame 15 dB over the median of the 40 frames around it and loud enough to hear
     (within 45 dB of the line's own peak). Returns the count and the worst such jump. */
  window.clicks = async function (buf, hz) {
    const AC = new OfflineAudioContext(1, buf.length, SR), s = AC.createBufferSource(); s.buffer = buf; let n = s;
    for (let i = 0; i < 4; i++) { const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hz; f.Q.value = [0.51, 0.6, 0.9, 2.56][i]; n.connect(f); n = f; }
    n.connect(AC.destination); s.start(); const r = await AC.startRendering(), d = r.getChannelData(0), x = buf.getChannelData(0);
    let pk = 0; for (let i = 0; i < x.length; i++) pk = Math.max(pk, Math.abs(x[i]));
    const W = 22, e = []; for (let i = 0; i + W <= d.length; i += W) { let q = 0; for (let j = i; j < i + W; j++) q += d[j] * d[j]; e.push(q / W); }
    const floor = Math.pow(pk, 2) * Math.pow(10, -45 / 10); let count = 0, worst = -99;
    for (let k = 20; k < e.length - 20; k++) {
      if (e[k] < floor) continue;
      const around = []; for (let j = k - 20; j <= k + 20; j++) if (Math.abs(j - k) > 1) around.push(e[j]);
      around.sort((a, b) => a - b); const med = around[around.length >> 1] + 1e-20, jump = 10 * Math.log10(e[k] / med);
      if (jump > worst) worst = jump;
      if (jump > 15) { count++; k += 2; }
    }
    return { count: count, worst: +worst.toFixed(1) }; };
  /* THE PLANTED CLICKS, so the ruler is proven able to see one: a take started at its own loudest sample with no ramp (a
     cut at full level), and the same take stopped dead at its loudest sample (the old stop() without its fade) */
  window.planted = async function () {
    const tk = S.idx.clips['cand-3'].a[0], src = S.buf.getChannelData(0), a0 = Math.round((tk[0] + S.shift) * SR);
    let k = a0; for (let i = a0; i < a0 + Math.round(tk[1] * SR); i++) if (Math.abs(src[i]) > Math.abs(src[k])) k = i;
    const at = k / SR - S.shift;
    async function one(startAt, dur) { const AC = new OfflineAudioContext(1, SR * 2, SR), b = AC.createBufferSource();
      b.buffer = S.buf; b.connect(AC.destination); b.start(0.3, startAt, dur); return clicks(await AC.startRendering(), 13000); }
    return { cut_in: await one(at, tk[0] + tk[1] - at), stopped_dead: await one(tk[0], at - tk[0]) }; };
  /* one line, one voice, one engine: dry (for the click ruler) or through the game's chain (for the level) */
  window.render = async function (eng, text, v, wet, gainDb) {
    const T = 9, AC = new OfflineAudioContext(1, Math.round(SR * T), SR);
    const bus = wet ? chain(AC) : AC.destination;
    const g = AC.createGain(); g.gain.value = Math.pow(10, (gainDb || 0) / 20); g.connect(bus);
    let h;
    if (eng === 'old') h = BOH_VOICE.say(text, v, AC, g, 0.05);
    else { S.buf = S.buf; h = S.say(text, v, AC, g, 0.05); }
    const buf = await AC.startRendering();
    return { buf: buf, h: h ? { blips: h.blips, seconds: h.seconds, tail: h.tail, family: h.family, creep: h.creep, lpb: h.lpb } : null };
  };
`;

(async () => {
  await new Promise(r => srv.listen(PORT, r));
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_VOTE_TAB.html').catch(() => {});
  await pg.setContent('<html><body></body></html>');
  await pg.addScriptTag({ url: 'http://127.0.0.1:' + PORT + '/engine/bohemia_voice.js' });
  await pg.addScriptTag({ url: 'http://127.0.0.1:' + PORT + '/engine/bohemia_voice_recorded.js' });
  await pg.evaluate(PAGE_LIB);
  const L = lines();
  const res = await pg.evaluate(async ({ L, base, hz }) => {
    window.S = BOH_VOICE_RECORDED.make({ dir: base + 'slices/voice_heard/' });
    const AC0 = new OfflineAudioContext(1, 44100, 44100);
    await S.load(AC0);
    if (!S.ready()) return { err: S.err };
    S.NUM.GAIN_DB = 0;
    const people = ['cand-1', 'cand-2', 'cand-3', 'cand-4', 'cand-6', 'cand-7'].map(BOH_VOICE.voiceOf)
      .concat([0, 1, 2, 3, 4, 5].map(i => BOH_VOICE.castVoice('face:person_reds_' + i)));
    const out = { old: [], neu: [], clickOld: [], clickNew: [], creep: { lines: 0, breath: 0, inside: 0, dropped: 0, doubled: 0, sag: 0, letters: 0 }, fam: {}, shift: S.shift };
    for (let i = 0; i < L.length; i++) {
      const v = people[i % people.length];
      const text = BOH_VOICE.opener(L[i]);
      const o = await render('old', text, v, true), n = await render('new', text, v, true);
      if (!n.h || !o.h) { out.skipped = (out.skipped || []).concat([text]); continue; }
      out.old.push(level(o.buf.getChannelData(0))); out.neu.push(level(n.buf.getChannelData(0)));
      const od = await render('old', text, v, false), nd = await render('new', text, v, false);
      const co = await clicks(od.buf, hz), cn = await clicks(nd.buf, hz); out.clickOld.push(co.count); out.clickNew.push(cn.count);
      out.worstNew = Math.max(out.worstNew == null ? -99 : out.worstNew, cn.worst);
      out.secOld = (out.secOld || 0) + o.h.seconds; out.secNew = (out.secNew || 0) + n.h.seconds;
      const c = n.h.creep; out.creep.lines++; out.creep.letters += n.h.blips;
      if (c.breath) { out.creep.breath++; if (c.breath.inside) out.creep.inside++; }
      out.creep.dropped += c.dropped.length; out.creep.doubled += c.doubled.length; if (c.sag) out.creep.sag++;
      out.fam[n.h.family] = (out.fam[n.h.family] || 0) + 1;
    }
    out.planted = await planted();
    return out;
  }, { L, base: 'http://127.0.0.1:' + PORT + '/', hz: RULER_HZ });
  await br.close(); srv.close();
  if (res.err) { console.log('THE SQUIGGLE LEVEL: the sprite did not load: ' + res.err); process.exit(1); }
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const gain = +(MARK - mean(res.neu)).toFixed(2);
  const idx = JSON.parse(fs.readFileSync(IDX, 'utf8'));
  idx.gain_db = gain;
  idx.level = { measured: '10/24/26', chain: 'MUS.audio: compressor -14 dB 6:1 knee 8 2 ms/120 ms, brickwall -5 dB 20:1 1 ms/80 ms',
    mark_db: MARK, old_db: +mean(res.old).toFixed(2), new_at_0_db: +mean(res.neu).toFixed(2), lines: res.old.length, ruler_hz: RULER_HZ,
    seconds_old: +(res.secOld / res.old.length).toFixed(2), seconds_new: +(res.secNew / res.old.length).toFixed(2),
    clicks_old: res.clickOld.reduce((a, b) => a + b, 0), clicks_new: res.clickNew.reduce((a, b) => a + b, 0), worst_jump_new_db: res.worstNew, planted: res.planted, creep: res.creep };
  fs.writeFileSync(IDX, JSON.stringify(idx));
  console.log('THE SQUIGGLE LEVEL over ' + res.old.length + ' lines, his six and six cast from his envelope:');
  console.log('  the old voice after the chain ' + mean(res.old).toFixed(1) + ' dB, the new at 0 dB ' + mean(res.neu).toFixed(1) + ' dB -> gain_db ' + gain + ' (the mark ' + MARK + '); a line ' + (res.secOld / res.old.length).toFixed(2) + ' s old, ' + (res.secNew / res.old.length).toFixed(2) + ' s new');
  console.log('  clicks (a 0.5 ms frame above ' + RULER_HZ / 1000 + ' kHz, 15 dB over its neighbours): old ' + idx.level.clicks_old + ', new ' + idx.level.clicks_new + ' (the new\'s worst frame ' + res.worstNew + ' dB over its neighbours); the planted click: ' + JSON.stringify(res.planted));
  console.log('  the creep: ' + JSON.stringify(res.creep) + '  families ' + JSON.stringify(res.fam) + '  the decoder shift ' + res.shift.toFixed(4) + ' s');
})().catch(e => { console.error(e); process.exit(1); });
