#!/usr/bin/env node
/* THE SQUIGGLE, CREEPIER (SOUNDS [the squiggle, creepier], rule 135; Paolo 10/24: 'we might have to revamp or upgrade or remake
   from scratch the squiggle voices; it's supposed to be this Animal Crossing style squiggle voice, but maybe it could be more
   creepy'; rule 127: no card, he hears it the next time somebody talks).
   MEASURED BEFORE (10/24): every talking portrait in the demo (the map's voice, the walking man, the keepers, the crew) moved
   its mouth in silence: none of them posted the voice; the only people who squiggled were the old walked city's talk cards,
   in formant synthesis, at -27.7 dB after the game's chain (under every bullet landing), with 8 clicks in 19 lines by the
   ruler below.
   Legs:
   1. THE RECORDING IS REAL: every syllable is cut from LJ Speech (public domain), the breath from ESC-50 (CC0), the sprite
      peaks under -1 dBFS and holds every letter (tools/bohemia_squiggle_from_a_recording.py --check);
   2. HIS SIX ARE THE FAMILIES, as he heard them: the families are exactly the six he passed 8/11, none he killed, each at his
      own pitch (Praat on the sprite, within 3 percent);
   3. ANIMALESE: one recorded syllable per letter, on the 120 BPM grid (4, 5 or 6 a beat), his six are themselves, the same
      person saying the same words is the same every time, two people are not;
   4. NO CLICKING (his 8/11 note): zero clicks in every line by a ruler proven on two planted ones (a click: half a millisecond
      above 13 kHz, 20 dB over its neighbours; a real t or k reaches 13.9, the one click this voice had 60.9, the planted 92),
      and a line cut short fades;
   5. THE LEVEL: through the game's own compressor and brickwall, the lines land within 1 dB of the mark, none over -1 dBFS;
   6. CREEPIER, NEVER BROKEN: over the game's lines a syllable drops and one doubles, a breath comes inside a line and after
      one, every statement sags at its end and no question does (a question rises), never two wrong things within six letters,
      and a line is a little wrong (0.3 to 1.5 wrong things a line), never a broken tape; the wobble inside his one hard law
      (0.73 Hz, 2.09 percent);
   7. THE GAME CARRIES IT: the alpha and the demo inline the engine byte for byte, the game's one voice says it, a face is
      cast from his look, the faces module says every line it mouths, the SCREECH LAW, and the narrator is still the machine;
   8. THE REAL SURFACE: the demo through its door, a town opened from the map: the face that greets him speaks, the shell says
      his words in the recorded squiggle, the effects bus carries it, a keeper tapped with a real touch speaks too; nothing threw.
   Run: node gates/the_squiggle_creepier_gate.js   (--fast skips leg 8) */
'use strict';
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const LV = require(path.join(ROOT, 'tools/bohemia_squiggle_level.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('THE SQUIGGLE, CREEPIER: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SIX = ['cand-1', 'cand-2', 'cand-3', 'cand-4', 'cand-6', 'cand-7'];
(async () => {
  /* ---------------- 1, 2: the files ---------------- */
  let chk = '';
  try { chk = execFileSync('python3', [path.join(ROOT, 'tools/bohemia_squiggle_from_a_recording.py'), '--check'], { encoding: 'utf8' }); } catch (e) { chk = String(e.stdout || e.message); }
  const bank = JSON.parse(read('reference/library/sound_bank/ljspeech_pd/regions.json'));
  const lic = read('reference/library/sound_bank/ljspeech_pd/LICENCES.md'), esc = read('reference/library/sound_bank/esc50_cc0/LICENCES.md');
  const idx = JSON.parse(read('slices/voice_heard/index.json'));
  const fromLJ = bank.regions.every(r => /^LJ001-\d{4}$/.test(r.clip) && bank.clips[r.clip]);
  leg(/^CHECK PASS/m.test(chk) && fromLJ && /public domain/i.test(lic) && /\| 3-166125-A-23 \|.*\| CC0 \|/.test(esc),
    '*** THE RECORDING IS REAL ***: ' + bank.regions.length + ' syllables cut from LJ Speech (public domain, ' + Object.keys(bank.clips).length + ' clips), the breath ESC-50 CC0, the sprite under -1 dBFS with every letter', chk.trim().split('\n')[0]);
  const ap = JSON.parse(read('banks/BOHEMIA_VOICES_APPROVED_8_11_26.json'));
  const fams = idx.families.map(f => f.id);
  leg(JSON.stringify(fams.slice().sort()) === JSON.stringify(ap.approved.slice().sort()) && !ap.killed.some(k => fams.includes(k)),
    'HIS SIX ARE THE FAMILIES: exactly the six he passed 8/11, none of the two he killed', fams.join(' '));
  let pit = '';
  try {
    pit = execFileSync('python3', ['-I', '-c', `
import json, numpy as np, soundfile as sf, parselmouth, sys
idx = json.load(open(sys.argv[1])); y, sr = sf.read(sys.argv[2], dtype='float32'); out = {}
for f in idx['families']:
    fs = []
    for L, t in idx['clips'][f['id']].items():
        for a, d in t:
            p = parselmouth.Sound(y[int(a*sr):int((a+d)*sr)].astype(np.float64), sr).to_pitch(pitch_floor=75, pitch_ceiling=600).selected_array['frequency']
            fs += list(p[p > 0])
    out[f['id']] = [f['f0'], float(np.median(fs))]
print(json.dumps(out))`, path.join(ROOT, 'slices/voice_heard/index.json'), path.join(ROOT, 'slices/voice_heard/squiggle.mp3')], { encoding: 'utf8' });
  } catch (e) { pit = '{}'; }
  const P = JSON.parse(pit.trim().split('\n').pop() || '{}');
  const offP = Object.entries(P).filter(([, v]) => Math.abs(v[1] / v[0] - 1) > 0.03);
  leg(Object.keys(P).length === 6 && !offP.length, 'his six AS HE HEARD THEM: every family\'s syllables at his own pitch (Praat, within 3%)',
    Object.entries(P).map(([k, v]) => k + ' ' + v[0] + '/' + Math.round(v[1])).join(' '));

  /* ---------------- 3 to 6: a bare page with both engines ---------------- */
  /* PLANTED DEFECTS: SQUIGGLE_ENGINE=<a file> serves that file as the player, so a mutated copy can prove a leg bites */
  const ENG = process.env.SQUIGGLE_ENGINE ? path.resolve(process.env.SQUIGGLE_ENGINE) : null;
  const srv = http.createServer((rq, rs) => {
    let f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (ENG && /\/engine\/bohemia_voice_recorded\.js$/.test(rq.url.split('?')[0])) { rs.setHeader('content-type', 'text/javascript'); return fs.createReadStream(ENG).pipe(rs); }
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
    rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
    fs.createReadStream(f).pipe(rs);
  });
  const PORT = 8944; await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e.message)));
  try {
    await page.goto('http://127.0.0.1:' + PORT + '/slices/voice_heard/index.json');
    await page.setContent('<html><body></body></html>');
    await page.addScriptTag({ url: '/engine/bohemia_voice.js' });
    await page.addScriptTag({ url: '/engine/bohemia_voice_recorded.js' });
    await page.addScriptTag({ content: LV.PAGE_LIB });
    const R = await page.evaluate(async ({ L, mark, hz }) => {
      const S = window.S = BOH_VOICE_RECORDED.make({ dir: '/slices/voice_heard/' });
      await S.load(new OfflineAudioContext(1, 44100, 44100));
      const out = { ready: S.ready(), err: S.err, gain: S.NUM.GAIN_DB };
      if (!out.ready) return out;
      const people = ['cand-1', 'cand-2', 'cand-3', 'cand-4', 'cand-6', 'cand-7'].map(BOH_VOICE.voiceOf)
        .concat([0, 1, 2, 3, 4, 5].map(i => BOH_VOICE.castVoice('face:person_reds_' + i)));
      /* 3. ANIMALESE */
      out.self = people.slice(0, 6).map(v => BOH_VOICE_RECORDED.familyOf(S.idx, v) === S.idx.families.findIndex(f => f.id === v.seed));
      const lpbs = {}, blipsOk = [];
      /* 4, 5, 6: every line by somebody, then the same lines again by the next */
      out.clicks = 0; out.levels = []; out.peaks = []; out.lines = 0;
      const cr = out.creep = { dropped: 0, doubled: 0, inside: 0, after: 0, statements: 0, sagged: 0, questions: 0, qSagged: 0, qRose: 0, sRose: 0, close: 0, weird: 0 };
      for (let pass = 0; pass < 3; pass++) for (let i = 0; i < L.length; i++) {
        const v = people[(i + pass * 5) % people.length], text = BOH_VOICE.opener(L[i]);
        const r = await render('new', text, v, true, 0); if (!r.h) continue;
        const d = r.buf.getChannelData(0); let pk = 0; for (let k = 0; k < d.length; k++) pk = Math.max(pk, Math.abs(d[k]));
        out.levels.push(level(d)); out.peaks.push(20 * Math.log10(pk + 1e-12)); out.lines++;
        if (pass === 0) { const dry = await render('new', text, v, false, 0); out.clicks += (await clicks(dry.buf, hz)).count; }
        const h = r.h, c = h.creep; lpbs[h.lpb] = 1;
        const spoken = (BOH_VOICE_RECORDED.letters(text).match(/[a-z]/g) || []).length;
        blipsOk.push(h.blips === spoken);
        cr.dropped += c.dropped.length; cr.doubled += c.doubled.length; cr.weird += c.dropped.length + c.doubled.length;
        if (c.breath) { if (c.breath.inside) cr.inside++; else cr.after++; }
        const w = c.dropped.concat(c.doubled).sort((a, b) => a - b); for (let k = 1; k < w.length; k++) if (w[k] - w[k - 1] <= 6) cr.close++;
        const q = /\?\s*$/.test(text);
        if (q) { cr.questions++; if (c.sag) cr.qSagged++; }
        else if (spoken >= 8) { cr.statements++; if (c.sag) cr.sagged++; }
      }
      /* the contour on a handle's own rates: a statement falls, a question rises */
      const AS = new OfflineAudioContext(1, 44100 * 6, 44100), st = S.say('Work is on the board, the men wait at the posts.', people[2], AS, AS.destination, 0.05);
      out.stmt = st ? [st.rates[0], st.rates[st.rates.length - 1]] : null;
      const AQ = new OfflineAudioContext(1, 44100 * 6, 44100), qq = S.say('Do you hear that out there tonight?', people[2], AQ, AQ.destination, 0.05);
      out.ques = qq ? [qq.rates[Math.floor(qq.rates.length / 2)], qq.rates[qq.rates.length - 1]] : null;
      out.lpbs = Object.keys(lpbs).map(Number).sort(); out.blipsOk = blipsOk.every(Boolean);
      /* the same person, the same words, twice: the same samples */
      const a1 = await render('new', 'Shelves are empty today, carnal.', people[7], false, 0), a2 = await render('new', 'Shelves are empty today, carnal.', people[7], false, 0);
      const b1 = await render('new', 'Shelves are empty today, carnal.', people[8], false, 0);
      const x1 = a1.buf.getChannelData(0), x2 = a2.buf.getChannelData(0), y1 = b1.buf.getChannelData(0);
      /* the same within 1e-6 (-120 dB): two offline renders of one schedule differ by float rounding (measured 1.5e-8), never more */
      let same = true, differ = false; for (let k = 0; k < x1.length; k++) { if (Math.abs(x1[k] - x2[k]) > 1e-6) { same = false; break; } }
      for (let k = 0; k < x1.length; k += 7) if (Math.abs(x1[k] - y1[k]) > 1e-4) { differ = true; break; }
      out.same = same; out.differ = differ;
      out.whoA = a1.h.family + '/' + a1.h.lpb; out.whoB = b1.h.family + '/' + b1.h.lpb;
      /* the ruler, proven, and a cut line */
      out.planted = await planted();
      /* A LINE CUT SHORT, at 54 points (three lines, his six, three cuts each, every cut somewhere new): the next line cuts the
         one talking, so the cut is heard as often as a line starts. One cut passed by luck on 10/24 while 86 of 144 clicked. */
      out.cut = 0; out.cuts = 0;
      const CL = ['One battery and a day for any of these. What goes up?', 'My cousin says it is market day over by the Homeless.', 'Work is on the board, mijo.'];
      for (let li = 0; li < CL.length; li++) for (let pi = 0; pi < 6; pi++) for (let k = 0; k < 3; k++) {
        const tc = Math.round((0.25 + k * 0.81 + pi * 0.067 + li * 0.023) * 44100 / 128) * 128 / 44100;
        const AC = new OfflineAudioContext(1, 44100 * 4, 44100), g = AC.createGain(); g.connect(AC.destination);
        const h = S.say(CL[li], people[pi], AC, g, 0.05);
        AC.suspend(tc).then(() => { h.stop(); AC.resume(); });
        out.cut += (await clicks(await AC.startRendering(), hz)).count; out.cuts++;
      }
      /* his one hard law, per family */
      /* the worst case of the two wobbles the player sums: the faster of the two rates, the two depths added as magnitudes */
      out.law = S.idx.families.map(f => ({ id: f.id, hz: Math.max(S.NUM.WOW_HZ, Math.min(S.NUM.CAP_HZ, Math.max(0.2, f.vib || 0.3))),
        depth: Math.abs(S.NUM.WOW) + Math.abs(Math.min(S.NUM.CAP_DEPTH - S.NUM.WOW, (f.vibA || 0.008) * 0.5)) }));
      return out;
    }, { L: LV.lines(), mark: LV.MARK, hz: LV.RULER_HZ });
    if (!R.ready) { leg(false, 'the sprite loads in a browser', R.err); throw new Error('no sprite'); }
    leg(R.self.every(Boolean) && R.blipsOk && R.lpbs.every(n => n >= 4 && n <= 6) && R.lpbs.length >= 2,
      '*** ANIMALESE ***: one recorded syllable per letter of every line, on the 120 BPM grid, his six are themselves',
      'letters a beat ' + R.lpbs.join(',') + '; his six themselves ' + R.self.filter(Boolean).length + '/6; one take a letter ' + R.blipsOk);
    leg(R.same && R.differ, 'ONE VOICE PER PERSON: the same person saying the same words is the same samples every time, another person is not', R.whoA + ' vs ' + R.whoB);
    leg(R.clicks === 0 && R.planted.cut_in.count >= 1 && R.planted.stopped_dead.count >= 1 && R.cut === 0,
      '*** NO CLICKING *** (his 8/11 note): zero clicks in every line, by a ruler that sees both planted clicks, and a line cut short fades',
      'clicks ' + R.clicks + ' over ' + LV.lines().length + ' lines; planted ' + R.planted.cut_in.count + '+' + R.planted.stopped_dead.count + '; cut short at ' + R.cuts + ' points: ' + R.cut + ' clicks');
    const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
    const lvl = mean(R.levels), worst = Math.max(...R.peaks);   /* the player rides index.gain_db already */
    leg(Math.abs(lvl - LV.MARK) <= 1.0 && worst <= -1.0, 'THE LEVEL: through the game\'s own compressor and brickwall the lines land at the mark, none over -1 dBFS',
      'mean ' + lvl.toFixed(1) + ' dB against ' + LV.MARK + ' (the old voice -27.7); loudest peak ' + worst.toFixed(1) + ' dBFS; ' + R.lines + ' lines');
    const c = R.creep;
    const perLine = c.weird / R.lines;
    leg(c.dropped > 0 && c.doubled > 0 && c.inside > 0 && c.after > 0 && c.sagged === c.statements && c.qSagged === 0 && c.close === 0 && perLine >= 0.3 && perLine <= 1.5,
      '*** CREEPIER, NEVER BROKEN ***: a syllable drops and one doubles, a breath inside a line and after one, every statement sags, no question does, never two wrong within six letters, a little wrong a line',
      JSON.stringify(c) + ' over ' + R.lines + ' lines (' + perLine.toFixed(2) + ' wrong things a line)');
    leg(R.stmt && R.stmt[1] < R.stmt[0] * 0.95 && R.ques && R.ques[1] > R.ques[0] * 1.05,
      'a statement falls to its end and a question rises', 'statement ' + JSON.stringify(R.stmt) + ', question ' + JSON.stringify(R.ques));
    leg(R.law.every(f => f.hz <= 0.73 && f.depth <= 0.0209), 'the tape\'s wobble inside HIS ONE HARD LAW (8/11): never past 0.73 Hz, never deeper than 2.09 percent',
      R.law.map(f => f.id + ' ' + f.hz + 'Hz ' + (f.depth * 100).toFixed(2) + '%').join(' '));
  } catch (e) { if (!/no sprite/.test(e.message)) leg(false, 'the bare page ran', String(e.message).slice(0, 200)); }
  leg(!errs.length, 'nothing threw on the bare page', errs.slice(0, 2).join(' | '));
  await browser.close(); srv.close();

  /* ---------------- 7: the game carries it ---------------- */
  const eng = read('engine/bohemia_voice_recorded.js');
  const code = eng.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1 ');
  const alpha = read('slices/BOHEMIA_ALPHA_0_9.html'), demo = read('slices/BOHEMIA_DEMO.html');
  leg(alpha.includes(eng) && demo.includes(eng), 'the alpha and the demo inline engine/bohemia_voice_recorded.js byte for byte');
  const routed = s => /TALKING = window\.squiggleSay \? squiggleSay\(line, v, MUS\.AC, d, null\)/.test(s) && /\(sp\.indexOf\('city:'\)===0 \|\| sp\.indexOf\('face:'\)===0\) && BOH_VOICE\.castVoice/.test(s) && /dir: 'voice_heard\/'/.test(s);
  leg(routed(alpha) && routed(demo), 'the game\'s one voice says it (speakLine through squiggleSay, the 8/11 voice only until the bank is in), a face cast from his look');
  const faces = read('engine/bohemia_crew_faces.js');
  leg(/function talk\(c, look, line\) \{\n\s+if \(!c \|\| !has\(look\)\) return false;\n\s+heard\(look, line\);/.test(faces) && /type: 'BOHEMIA_VOICE', speaker: 'face:' \+ look/.test(faces),
    'every face that mouths a line says it out loud (engine/bohemia_crew_faces.js talk() posts it to the voice)');
  leg(!/createDelay|createConvolver|createWaveShaper|feedback/i.test(code) && !/Math\.random/.test(code) && !/speechSynthesis/.test(code),
    'SCREECH LAW (no delay, no convolver, no waveshaper, no feedback), seeded never Math.random, and never the narrator\'s machine voice');
  const narr = read('engine/bohemia_narrator.js');
  leg(/speechSynthesis/.test(narr) && !/BOH_VOICE_RECORDED|squiggle/i.test(narr), 'the narrator is still the machine (9/29): engine/bohemia_narrator.js, the phone\'s own speech engine, never the squiggle');

  /* ---------------- 8: the real surface ---------------- */
  if (process.argv.includes('--fast')) return done();
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, 'the demo boots', String(e.message).slice(0, 160)); return done(); }
  const p = d.page; const perr = []; p.on('pageerror', e => perr.push(String(e.message)));
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running' && window.SQUIGGLE, null, { timeout: 30000 });
    /* every line the game's one voice says, logged at the call (the message listener calls window.speakLine when it runs) */
    await p.evaluate(() => { const L = window.__SQ = { msgs: [], rms: [], said: [] };
      addEventListener('message', ev => { const m = ev.data; if (m && m.type === 'BOHEMIA_VOICE') L.msgs.push({ speaker: m.speaker, text: m.text, t: performance.now() }); });
      const real = window.speakLine;
      window.speakLine = function (speaker, text) { const h = real(speaker, text);
        if (h) L.said.push({ speaker: String(speaker), text: String(text), t: performance.now(), recorded: !!h.recorded, family: h.family, blips: h.blips, seconds: h.seconds });
        return h; };
      const an = MUS.AC.createAnalyser(); an.fftSize = 2048; (window.__SFXBUS || MUS.OUT).connect(an); const b = new Float32Array(2048);
      setInterval(() => { an.getFloatTimeDomainData(b); let s = 0; for (const v of b) s += v * v; L.rms.push({ t: performance.now(), db: 10 * Math.log10(s / b.length + 1e-20) }); }, 50); });
    await p.waitForFunction(() => SQUIGGLE.ready(), null, { timeout: 60000 });
    const name = await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
    let f = null, w = null, box = null, key = null;
    for (let k = 0; k < 80 && !(w && box); k++) { await p.waitForTimeout(500);
      for (const fr of p.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
        const order = await fr.evaluate(() => { try { return BohemiaSettlement.ready() ? BohemiaSettlement.order() : null; } catch (e) { return null; } }).catch(() => null);
        key = order && (order.indexOf('bar') >= 0 ? 'bar' : order[0]);
        const ww = key && await fr.evaluate(k => { try { return BohemiaSettlement.where(k); } catch (e) { return null; } }, key).catch(() => null);
        const bb = ww && await (await fr.frameElement()).boundingBox();
        if (ww && bb && bb.width > 0) { f = fr; w = ww; box = bb; break; } } }
    await p.waitForTimeout(4500);
    const first = await p.evaluate(() => ({ msgs: __SQ.msgs.slice(), said: __SQ.said.slice() }));
    if (box) { await p.touchscreen.tap(box.x + w.x, box.y + w.y); await p.waitForTimeout(5000); }
    const S = await p.evaluate(() => ({ msgs: __SQ.msgs, said: __SQ.said, rms: __SQ.rms.map(r => [Math.round(r.t), +r.db.toFixed(1)]), err: SQUIGGLE.err }));
    const sheet = f ? await f.evaluate(() => (document.querySelector('#sbody .say p') || {}).textContent || '').catch(() => '') : '';
    const greet = first.msgs.find(m => /^face:/.test(m.speaker)), greetSaid = greet && first.said.find(s => s.speaker === greet.speaker && s.text === greet.text);
    const loudDuring = s => S.rms.filter(r => r[0] >= s.t && r[0] <= s.t + s.seconds * 1000 && r[1] > -45).length * 0.05;
    const said0 = greetSaid;
    leg(!!greet && !!greetSaid && greetSaid.recorded && SIX.includes(greetSaid.family) && loudDuring(greetSaid) >= 0.4,
      '*** HE HEARS IT THE NEXT TIME SOMEBODY TALKS ***: a town opened from the map, the face that greets him speaks, the shell says his words in the recorded squiggle, the effects bus carries it',
      name + ': ' + (greet ? greet.speaker + ' "' + greet.text + '"' : 'no face spoke') + ' -> ' + (greetSaid ? greetSaid.family + ', ' + greetSaid.blips + ' syllables' : 'not said recorded') + '; over -45 dB on the bus for ' + (said0 ? loudDuring(said0).toFixed(2) : 0) + ' s');
    const later = S.msgs.filter(m => /^face:/.test(m.speaker) && (!greet || m.t > greet.t + 1));
    const laterSaid = S.said.filter(s => s.recorded && later.some(m => m.speaker === s.speaker && m.text === s.text));
    leg(later.length >= 1 && laterSaid.length >= 1 && (!sheet || laterSaid.some(m => m.text === sheet)),
      'a keeper tapped with a real touch (' + key + ') speaks too, in the squiggle, his own words', laterSaid.map(m => m.speaker + ' "' + m.text + '" -> ' + m.family + ', ' + m.blips + ' syllables').join(' | ') + (sheet ? '; on screen: "' + sheet + '"' : '') + '; every line said: ' + S.said.map(x => x.speaker + (x.recorded ? '' : ' (8/11 voice)')).join(', '));
  } catch (e) { leg(false, 'the demo\'s town ran', String(e.message).slice(0, 220)); }
  leg(!perr.length && !d.errs.length, 'nothing threw in the demo', perr.concat(d.errs).slice(0, 2).join(' | '));
  await d.close();
  done();
})();
