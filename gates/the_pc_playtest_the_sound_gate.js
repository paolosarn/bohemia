#!/usr/bin/env node
/* THE PC PLAYTEST, THE SOUND'S PART (SOUNDS 10/25, row [the PC playtest: the sound's part], rule 164 items 19, 20, 23;
   records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md). His words on his PC: 'they just kept running and
   running and overlapping each other, and even when I left the city I was still hearing them'; 'they're getting repetitive,
   not that different from each other'; the song after a battle 'so bad, so terrible'.
   MEASURED BEFORE (tools/bohemia_sounds_pc_playtest_measure.js on the demo of 10/24t): a keeper's line ran 9.4 s, every
   town line one woman in two of six families, the town's walkers on their own player and their own context (nothing kept
   them off the shell's voice), the town frame hidden on LEAVE with nothing told; after a fight STING 'win', a synth figure.
   Legs:
   1. ONE AT A TIME (a bare page, the top and a town frame inside a map frame, as the demo nests them): a mutter is said
      only into silence and refused while anybody talks, in any frame; a line for him cuts every other voice in the game;
      after the quiet a mutter speaks again;
   2. SHORT: a line for him keeps its first CAP_LEAD letters at a word, a mutter CAP_BG, and a long line lasts under its cap's
      seconds; it still ends like a line (a statement sags, a question rises);
   3. GONE WHEN YOU LEAVE: a line the shell says for a man in the town frame, and the town's own mutter, both fade within
      250 ms of the map frame around it hiding (the floor's look); the town's own sound (engine/bohemia_settlement_heard.js)
      goes to zero the moment its frame hides (HUSH), and comes back when it shows;
   4. MANY MORE VOICES: twenty real people in the more sprite (fourteen men, six women, every letter), the six still his; sixty
      of the valley's people land on at least eighteen voices; a man known to be a man always speaks as one of the men; the
      twenty are measured apart from the sprites themselves: two of them sit at least 1.5x farther apart IN PITCH than two of
      the six (the ear's first cue), and their long-term spectrum below every band's top (250 to 4,500 Hz, where the vocal
      tract is) is never collapsed onto one radio (at least 0.75x the six's, which Praat spread on purpose). What this does
      NOT measure, said: a real throat, an accent, the timing of a real mouth (twenty people against one woman moved);
   5. THE DEMO (the real surface, tools/bohemia_sounds_pc_playtest_measure.js): in a town no two voices are heard at once,
      nothing he heard in the town is still heard 250 ms after LEAVE, no line runs past 3.6 s with its breath; after a road
      fight on AUTO the synth 'win' never plays and one of HIS songs takes the transport on the top of a bar, every song after
      it in his set; nothing threw.
   Run: node gates/the_pc_playtest_the_sound_gate.js   (--fast skips leg 5) */
'use strict';
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('THE PC PLAYTEST, THE SOUND: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

(async () => {
  /* ---------------- 1 to 3: a bare page, nested as the demo nests its frames ---------------- */
  const PAGES = {
    '/top.html': '<html><body><iframe id="map" src="/map.html" style="width:300px;height:200px"></iframe></body></html>',
    '/map.html': '<html><body><iframe id="town" src="/town.html" style="width:200px;height:100px"></iframe></body></html>',
    '/town.html': '<html><body><script src="/engine/bohemia_voice.js"></script><script src="/engine/bohemia_voice_recorded.js"></script>' +
      '<script src="/engine/bohemia_settlement_heard.js"></script></body></html>'
  };
  const srv = http.createServer((rq, rs) => {
    const u = decodeURIComponent(rq.url.split('?')[0]);
    if (PAGES[u]) { rs.setHeader('content-type', 'text/html; charset=utf-8'); return rs.end(PAGES[u]); }
    const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
    rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript; charset=utf-8' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'application/octet-stream');
    fs.createReadStream(f).pipe(rs);
  });
  const PORT = 8961; await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e.message)));
  try {
    await page.goto('http://127.0.0.1:' + PORT + '/top.html');
    await page.addScriptTag({ url: '/engine/bohemia_voice.js' });
    await page.addScriptTag({ url: '/engine/bohemia_voice_recorded.js' });
    const town = await (async () => { for (let i = 0; i < 100; i++) { const f = page.frames().find(f => /town\.html/.test(f.url())); if (f && await f.evaluate(() => !!window.BOH_VOICE_RECORDED && !!window.BohemiaHeard).catch(() => false)) return f; await page.waitForTimeout(100); } return null; })();
    if (!town) throw new Error('the town frame never loaded');
    const R = await page.evaluate(async () => {
      const AC = new AudioContext(); await AC.resume();
      const T = window.SQUIGGLE = BOH_VOICE_RECORDED.make({ dir: '/slices/voice_heard/', lead: true });
      await T.load(AC); await (T.moreLoading || Promise.resolve());
      return { ready: T.ready(), more: !!T.more, err: T.err, moreErr: T.moreErr, NUM: { CAP_LEAD: T.NUM.CAP_LEAD, CAP_BG: T.NUM.CAP_BG, QUIET_MS: T.NUM.QUIET_MS } };
    });
    if (!R.ready) throw new Error('the sprite did not load: ' + R.err);
    /* the town's player borrows the shell's sprites, as the walkers' module does */
    await town.evaluate(() => { const T = window.top.SQUIGGLE; const S = window.S = BOH_VOICE_RECORDED.make({ dir: '/slices/voice_heard/' });
      S.idx = T.idx; S.buf = T.buf; S.shift = T.shift; window.AC = new AudioContext(); return window.AC.resume(); });
    const townSay = (text, who) => town.evaluate(([t, w]) => { const h = S.say(t, BOH_VOICE.castVoice('face:' + w), AC, AC.destination, AC.currentTime + 0.05);
      if (!h) return null; window.__h = h; const s0 = h.stop; h.cutAt = null; h.stop = function () { h.cutAt = Date.now(); return s0.apply(h, arguments); }; return { seconds: h.seconds, blips: h.blips, family: h.family }; }, [text, who]);
    const shellSay = (text, who, fromTown) => page.evaluate(([t, w, ft]) => { const AC2 = window.__AC || (window.__AC = new AudioContext());
      const src = ft ? document.getElementById('map').contentWindow.document.getElementById('town').contentWindow : window;
      const h = SQUIGGLE.say(t, BOH_VOICE.castVoice('face:' + w), AC2, AC2.destination, null, undefined, { src: src });
      if (!h) return null; window.__h = h; const s0 = h.stop; h.cutAt = null; h.stop = function () { h.cutAt = Date.now(); return s0.apply(h, arguments); };
      return { seconds: h.seconds, blips: h.blips, family: h.family, tail: h.tail }; }, [text, who, !!fromTown]);
    const idle = () => page.evaluate(() => new Promise(r => { const t0 = Date.now(); const iv = setInterval(() => { if (!BOH_VOICE_RECORDED.floor.alive().length || Date.now() - t0 > 8000) { clearInterval(iv); r(); } }, 50); }));

    /* 1. ONE AT A TIME */
    const m1 = await townSay('Hot one today, eh.', 'person_reds_1');
    const m2 = await townSay('Where is Chuy at?', 'person_reds_2');
    const sh = await shellSay('Work is on the board, mijo, the men wait at the posts.', 'person_cartel_4', true);
    const cut1 = await town.evaluate(() => window.__h && window.__h.cutAt != null);
    await idle(); await page.waitForTimeout(R.NUM.QUIET_MS + 150);
    const m3 = await townSay('Busy, busy.', 'person_reds_3');
    const st1 = await page.evaluate(() => BOH_VOICE_RECORDED.floor.state());
    leg(!!m1 && m2 === null && !!sh && cut1 && !!m3,
      '*** ONE AT A TIME *** across frames: a mutter is refused while one talks, a line for him cuts the town\'s mutter, after the quiet a mutter speaks',
      'first mutter ' + (m1 ? m1.family : 'none') + '; second while it talked: ' + (m2 ? 'SAID' : 'refused') + '; the shell\'s line ' + (sh ? sh.family : 'none') + ' cut the mutter ' + cut1 + '; after the quiet ' + (m3 ? 'said' : 'refused') + '; floor ' + JSON.stringify(st1));

    /* 2. SHORT */
    await idle();
    const long = 'One battery and a day for any of these, carnal, and if you want the long gun it is two, what goes up the road tonight?';
    const L1 = await shellSay(long, 'person_blues_0', false);
    await idle();
    const L2 = await page.evaluate(([t]) => { const AC2 = window.__AC; const S2 = BOH_VOICE_RECORDED.make({ dir: '/slices/voice_heard/' }); S2.idx = SQUIGGLE.idx; S2.buf = SQUIGGLE.buf; S2.shift = SQUIGGLE.shift;
      const h = S2.say(t, BOH_VOICE.castVoice('face:person_blues_3'), AC2, AC2.destination, null); return h ? { blips: h.blips, seconds: h.seconds } : null; }, [long]);
    const sq = await page.evaluate(() => { const A = new OfflineAudioContext(1, 44100 * 4, 44100); const s = SQUIGGLE.say('Work is on the board and the men all wait at the posts for you.', BOH_VOICE.castVoice('face:person_blues_0'), A, A.destination, 0.05);
      const B = new OfflineAudioContext(1, 44100 * 4, 44100); const q = SQUIGGLE.say('Do you hear that out past the wash tonight?', BOH_VOICE.castVoice('face:person_blues_0'), B, B.destination, 0.05);
      return { s: s && [s.rates[0], s.rates[s.rates.length - 1], s.creep.sag], q: q && [q.rates[Math.floor(q.rates.length / 2)], q.rates[q.rates.length - 1]] }; });
    leg(L1 && L1.blips <= R.NUM.CAP_LEAD && L1.seconds <= 2.6 && L2 && L2.blips <= R.NUM.CAP_BG && L2.seconds <= 1.6 && sq.s && sq.s[2] > 0 && sq.s[1] < sq.s[0] && sq.q && sq.q[1] > sq.q[0],
      '*** SHORT ***: a line for him keeps its first ' + R.NUM.CAP_LEAD + ' letters, a mutter ' + R.NUM.CAP_BG + ', and still ends like a line (a statement sags, a question rises)',
      'a ' + long.length + '-character line: ' + (L1 ? L1.blips + ' syllables in ' + L1.seconds + ' s' : 'none') + '; as a mutter ' + (L2 ? L2.blips + ' in ' + L2.seconds + ' s' : 'none') + '; statement ' + JSON.stringify(sq.s) + ', question ' + JSON.stringify(sq.q));

    /* 3. GONE WHEN YOU LEAVE */
    await idle(); await page.waitForTimeout(R.NUM.QUIET_MS + 150);
    await town.evaluate(() => { window.dispatchEvent(new Event('pointerdown')); });
    await page.waitForTimeout(600);
    const g1 = await shellSay('My cousin says it is market day over by the wash.', 'person_reds_6', true);
    await page.waitForTimeout(300);
    const hush0 = await town.evaluate(() => (BohemiaHeard.state().live || {}).hush);
    const hidAt = await page.evaluate(() => { document.getElementById('map').style.display = 'none'; return Date.now(); });
    await page.waitForTimeout(400);
    const gone1 = await page.evaluate(() => window.__h.cutAt);
    const hush1 = await town.evaluate(() => ({ hush: (BohemiaHeard.state().live || {}).hush, shown: BohemiaHeard.state().shown }));
    await page.evaluate(() => { document.getElementById('map').style.display = ''; });
    await page.waitForTimeout(600);
    await idle(); await page.waitForTimeout(R.NUM.QUIET_MS + 150);
    const g2 = await townSay('Watch the fence tonight.', 'person_reds_4');
    const hid2 = await page.evaluate(() => { document.getElementById('map').style.display = 'none'; return Date.now(); });
    await page.waitForTimeout(400);
    const gone2 = await town.evaluate(() => window.__h.cutAt);
    const hush2 = await town.evaluate(() => (BohemiaHeard.state().live || {}).hush);
    await page.evaluate(() => { document.getElementById('map').style.display = ''; });
    await page.waitForTimeout(700);
    const hush3 = await town.evaluate(() => (BohemiaHeard.state().live || {}).hush);
    const st3 = await page.evaluate(() => BOH_VOICE_RECORDED.floor.state());
    leg(!!g1 && gone1 != null && gone1 - hidAt <= 250 && !!g2 && gone2 != null && gone2 - hid2 <= 250,
      '*** GONE WHEN YOU LEAVE ***: the shell\'s line for a man in the town and the town\'s own mutter both fade the moment the map frame around the town hides',
      'the shell\'s line cut ' + (gone1 != null ? (gone1 - hidAt) + ' ms' : 'NEVER') + ' after; the mutter ' + (gone2 != null ? (gone2 - hid2) + ' ms' : 'NEVER') + ' after; floor ' + JSON.stringify(st3));
    leg(hush0 === 1 && hush1.hush === 0 && hush1.shown === false && hush2 === 0 && hush3 > 0.5,
      'the town\'s own sound (its bed, its doors, its jobs and mutters) is zero the moment its frame hides, and back when it shows',
      'hush ' + hush0 + ' -> hidden ' + JSON.stringify(hush1) + ' -> hidden again ' + hush2 + ' -> shown ' + (hush3 != null ? hush3.toFixed(2) : hush3));

    /* 4. MANY MORE VOICES */
    const V = await page.evaluate(() => {
      const idx = SQUIGGLE.idx, M = idx.more || { families: [], clips: {} }, letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const out = { n: M.families.length, m: M.families.filter(f => f.sex === 'm').length, f: M.families.filter(f => f.sex === 'f').length,
        whole: M.families.every(f => letters.every(L => (M.clips[f.id][L] || []).length >= 2)), six: idx.families.map(f => f.id) };
      const fams = {}, men = {}; let menOk = true, sixSelf = true;
      const gangs = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'mob', 'network', 'reds', 'remnants', 'trades'];
      const AC = new OfflineAudioContext(1, 44100, 44100);
      for (let i = 0; i < 60; i++) { const v = BOH_VOICE.castVoice('face:person_' + gangs[i % 10] + '_' + Math.floor(i / 10));
        const h = SQUIGGLE.say('Hey there.', v, AC, AC.destination, 0.05); if (h) fams[h.family] = 1;
        const hm = SQUIGGLE.say('Hey there.', v, AC, AC.destination, 0.05, undefined, { sex: 'm' });
        if (hm) { men[hm.family] = 1; const f = M.families.find(x => x.id === hm.family); if (!f || f.sex !== 'm') menOk = false; } }
      idx.families.forEach(f => { const h = SQUIGGLE.say('Hey there.', BOH_VOICE.voiceOf(f.id), AC, AC.destination, 0.05); if (!h || h.family !== f.id) sixSelf = false; });
      out.distinct = Object.keys(fams).length; out.men = Object.keys(men).length; out.menOk = menOk; out.sixSelf = sixSelf;
      return out;
    });
    leg(V.n === 20 && V.m === 14 && V.f === 6 && V.whole && V.six.length === 6,
      '*** MANY MORE VOICES ***: twenty real people in the second sprite (AudioMNIST, MIT), fourteen men and six women, every letter, his six still the six',
      V.n + ' real (' + V.m + ' men, ' + V.f + ' women), every letter ' + V.whole + '; his six ' + V.six.join(' '));
    leg(V.distinct >= 18 && V.menOk && V.men >= 10 && V.sixSelf,
      'sixty of the valley\'s people speak in at least eighteen voices, a man known to be a man always as one of the men, his six themselves',
      V.distinct + ' voices for 60 people; as known men ' + V.men + ' voices, all men ' + V.menOk + '; his six themselves ' + V.sixSelf);
  } catch (e) { leg(false, 'the bare page ran', String(e.message).slice(0, 220)); }
  leg(!errs.length, 'nothing threw on the bare page', errs.slice(0, 2).join(' | '));
  await browser.close(); srv.close();

  /* 4b. measured apart: each family's long-term spectrum and pitch, from the sprites themselves */
  let D = null;
  try {
    D = JSON.parse(execFileSync('python3', ['-I', '-c', `
import json, sys, numpy as np, soundfile as sf
from scipy import signal
idx = json.load(open(sys.argv[1])); base = sys.argv[2]
def ltas(y, sr, takes):
    edges = np.geomspace(250, 4500, 17); acc = np.zeros(16); n = 0
    for a, d in takes:
        seg = y[int(a * sr):int((a + d) * sr)]
        if len(seg) < 1024: continue
        f, p = signal.welch(seg, sr, nperseg=1024)
        acc += np.array([10 * np.log10(np.mean(p[(f >= edges[i]) & (f < edges[i + 1])]) + 1e-15) for i in range(16)]); n += 1
    v = acc / max(1, n); return v - v.mean()
def fams(fam_list, clips, file):
    y, sr = sf.read(base + '/' + file, dtype='float32'); out = []
    for f in fam_list:
        t = [x for L in clips[f['id']].values() for x in L]
        out.append((f['id'], ltas(y, sr, t), 12 * np.log2(f['f0'])))
    return out
def med(F):
    sp, pi = [], []
    for i in range(len(F)):
        for j in range(i + 1, len(F)):
            sp.append(float(np.sqrt(np.mean((F[i][1] - F[j][1]) ** 2)))); pi.append(float(abs(F[i][2] - F[j][2])))
    return [float(np.median(sp)), float(np.median(pi))] if sp else [0.0, 0.0]
six = fams(idx['families'], idx['clips'], idx['file'])
M = idx.get('more') or {'families': [], 'clips': {}, 'file': idx['file']}
more = fams(M['families'], M['clips'], M['file']) if M['families'] else []
print(json.dumps({'six': med(six), 'more': med(more), 'n': len(more)}))`, path.join(ROOT, 'slices/voice_heard/index.json'), path.join(ROOT, 'slices/voice_heard')], { encoding: 'utf8' }).trim().split('\n').pop());
  } catch (e) { D = { err: String(e.message).slice(0, 160) }; }
  leg(D && !D.err && D.n === 20 && D.more[1] >= 1.5 * D.six[1] && D.more[0] >= 0.75 * D.six[0],
    'the twenty are MEASURED APART: two of them 1.5x farther apart in pitch than two of the six, and their spectrum (250 to 4,500 Hz) never one radio',
    D ? (D.err || ('pitch, the median pair: twenty ' + D.more[1].toFixed(2) + ' semitones against the six ' + D.six[1].toFixed(2) + ' (' + (D.more[1] / D.six[1]).toFixed(2) + 'x); the spectrum ' + D.more[0].toFixed(2) + ' dB against ' + D.six[0].toFixed(2) + ' (' + (D.more[0] / D.six[0]).toFixed(2) + 'x)')) : 'no measure');

  /* ---------------- 5: the demo ---------------- */
  if (process.argv.includes('--fast')) return done();
  const out = path.join(require('os').tmpdir(), 'pc_playtest_sound_' + process.pid + '.json');
  try { execFileSync('node', [path.join(ROOT, 'tools/bohemia_sounds_pc_playtest_measure.js'), '--out', out], { encoding: 'utf8', timeout: 900000, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { /* the tool's own output is in the json if it got that far */ }
  let M = null; try { M = JSON.parse(fs.readFileSync(out, 'utf8')); } catch (e) { M = null; }
  if (!M || !M.town || !M.fight) { leg(false, 'the demo was walked (a town, then a road fight)', M ? Object.keys(M).join(',') : 'no record'); return done(); }
  const T = M.town, F = M.fight;
  leg(T.lines >= 3 && T.overlapPairs === 0, 'IN THE DEMO, ONE AT A TIME: a town opened from the map, its people tapped, no two voices heard at once',
    T.name + ': ' + T.lines + ' lines, ' + T.overlapPairs + ' overlapping pairs (' + T.overlapMs + ' ms); voices ' + (T.families || []).join(' '));
  leg(T.heardAfterLeave.every(e => e.cut != null && e.cut <= 250), 'IN THE DEMO, GONE WHEN YOU LEAVE: nothing he heard in the town is still heard 250 ms after LEAVE',
    T.heardAfterLeave.length ? JSON.stringify(T.heardAfterLeave) : 'nothing was talking when he left; said after, on the map: ' + JSON.stringify(T.saidAfterLeave || []));
  leg(T.longestSeconds <= 3.6, 'IN THE DEMO, SHORT: no line in the town runs past 3.6 s with its breath', 'longest ' + T.longestSeconds + ' s; every line ' + JSON.stringify(T.lineSeconds));
  const swap = (F.swaps || [])[0];
  leg(F.over && F.stings.filter(s => s.which === 'win' || s.which === 'loss').every(s => !s.played) && swap && swap.onBar && F.outside === 0 && F.afterTheFight.length >= 2,
    '*** THE SONG AFTER THE BATTLE IS ONE OF HIS ***: the synth win never plays; on the top of the next bar another of his songs takes the transport, every song after the fight in his set',
    (F.over ? F.over.result : 'no end') + '; stings ' + JSON.stringify(F.stings) + '; after: ' + F.afterTheFight.map(r => r.song + ' @' + r.fromMs + 'ms').join(' -> ') + '; swap ' + JSON.stringify(swap) + '; outside ' + F.outside);
  leg(!(M.errors || []).length, 'nothing threw in the demo', (M.errors || []).join(' | '));
  try { fs.unlinkSync(out); } catch (e) {}
  done();
})();
