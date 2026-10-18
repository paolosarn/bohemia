/* ============================================================================
   THE TRAVEL STEPS GATE  (SOUNDS, row [steps from a recording], 10/18/26)

   The party's footsteps under travel, from real recordings (two CC0 Freesound walks per surface,
   eight footfalls each, via ESC-50) instead of the engine's modelled step (TRAVELBED, his YES 10/13).
   This proves:
     - the sprites and the manifest agree: eight cuts per surface, each in its own half-second slot,
       every source CC0 and in the bank's LICENCES.md, the files small
     - the engine file's numbers are the manifest's, and its cadence and level are TRAVELBED's own
       (the road two a beat, the dirt one, REL 0.5), so the swap is a swap
     - unjudged is silent: the alpha keeps TRAVELBED until his YES (it never loads the file before)
     - on the VOTE page, in a real browser: each cut decodes, starts at its slot with silence before it
       and a hit inside its first 60 ms; the road lays two steps a beat and the dirt one, never the same
       cut twice in a row; STOP stops it; the A/B's engine buttons play; nothing throws
   Run: node gates/travel_steps_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.dirname(__dirname);
const PORT = 8883;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const DIR = path.join(ROOT, 'slices/vote/travel_steps');
const PAGE = 'slices/BOHEMIA_THE_STEPS_FROM_A_RECORDING_10_18_26.html';

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  /* ---- the files and the manifest ---- */
  const man = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const lic = fs.readFileSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0/LICENCES.md'), 'utf8');
  global.window = undefined;
  require(path.join(ROOT, 'engine/bohemia_travel_steps.js'));
  const NUM = globalThis.BOH_TRAVEL_STEPS.NUM;
  for (const surf of ['asphalt', 'dirt']) {
    const d = man.surfaces[surf] || {};
    const slots = d.slots || [];
    const f = path.join(DIR, 'steps_' + surf + '.mp3');
    ok(surf + ': the sprite is on disk and small', fs.existsSync(f) && fs.statSync(f).size < 150000, fs.existsSync(f) ? fs.statSync(f).size + ' bytes' : 'missing');
    ok('  eight cuts, cut k at k x ' + NUM.SLOT + ' s + ' + NUM.LEAD + ' s', slots.length === NUM.N && slots.every((s, k) => Math.abs(s.offset - (k * NUM.SLOT + NUM.LEAD)) < 0.002), slots.map(s => s.offset).join(','));
    ok('  no cut is longer than the engine plays of it', slots.every(s => s.seconds <= NUM.CUT[surf] + 0.001), slots.map(s => s.seconds).join(','));
    const stems = [...new Set(slots.map(s => s.stem))];
    ok('  the cuts come from two recordings, four each', stems.length === 2 && stems.every(st => slots.filter(s => s.stem === st).length === 4), stems.join(' '));
    ok('  every source is CC0 and in the bank\'s licence file', (d.sources || []).length === 2 && d.sources.every(s => s.licence === 'CC0' && lic.includes('| ' + s.stem + ' |') && fs.existsSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0', s.stem + '.flac'))));
    ok('  its cadence is the engine\'s: ' + NUM.PERBEAT[surf] + ' a beat', d.per_beat === NUM.PERBEAT[surf]);
    ok('  no sand in it: a shoe on ' + (surf === 'asphalt' ? 'asphalt' : 'gravel'), (d.sources || []).every(s => !/sand|beach/i.test(s.source)) && (d.sources || []).some(s => surf === 'asphalt' ? /asfalt|street|pavement/i.test(s.source) : /grus|gravel/i.test(s.source)));
  }

  /* ---- the engine's numbers are TRAVELBED's ---- */
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const tb = alpha.slice(alpha.indexOf('var TRAVELBED = {'), alpha.indexOf('window.__TRAVELBED = TRAVELBED;'));
  const pb = s => { const m = new RegExp(s + ':\\s*\\{[^}]*PERBEAT:\\s*(\\d+)').exec(tb); return m && +m[1]; };
  const rel = /REL:\s*([\d.]+)/.exec(tb), beat = /BEAT:\s*([\d.]+)/.exec(tb);
  ok('the road is two a beat and the dirt one, the same as TRAVELBED', pb('asphalt') === NUM.PERBEAT.asphalt && pb('dirt') === NUM.PERBEAT.dirt, 'TRAVELBED ' + pb('asphalt') + '/' + pb('dirt'));
  ok('  the same level (REL) and the same beat (120 BPM)', rel && +rel[1] === NUM.REL && beat && +beat[1] === NUM.BEAT && NUM.BEAT === 0.5);
  /* ---- the VOTE registry, and unjudged is silent ---- */
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const item = (reg.items || []).find(i => i.id === 'sounds-the-steps-from-a-recording-10-18');
  const yes = (reg.verdicts || []).some(v => v.id === 'sounds-the-steps-from-a-recording-10-18' && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = /bohemia_travel_steps\.js/.test(alpha);
  ok('unjudged is silent: the alpha loads the recorded steps only after his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired, TRAVELBED plays');
  ok('the VOTE item is registered and shows this page', !!item && item.show && item.show.src === path.basename(PAGE) && item.draft === true);

  /* ---- the real page in a real browser ---- */
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400 && /travel_steps|settlement_heard|engine\//.test(r.url())) bad.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load' });

  /* each cut decodes and sits in its slot */
  const cuts = await p.evaluate(async () => {
    const AC = new (window.AudioContext || window.webkitAudioContext)();
    const out = {};
    for (const s of ['asphalt', 'dirt']) {
      const ab = await (await fetch('vote/travel_steps/steps_' + s + '.mp3')).arrayBuffer();
      const buf = await AC.decodeAudioData(ab); const d = buf.getChannelData(0), sr = buf.sampleRate, N = BOH_TRAVEL_STEPS.NUM;
      const db = (a, z) => { let m = 0; for (let i = Math.max(0, Math.round(a * sr)); i < Math.min(d.length, Math.round(z * sr)); i++) m = Math.max(m, Math.abs(d[i])); return 20 * Math.log10(m + 1e-9); };
      out[s] = { seconds: buf.duration, slots: [] };
      for (let k = 0; k < N.N; k++) { const at = k * N.SLOT + N.LEAD; out[s].slots.push({ pre: +db(k * N.SLOT + 0.002, at - 0.008).toFixed(1), hit: +db(at - 0.004, at + 0.06).toFixed(1), after: +db(at + N.CUT[s] + 0.02, (k + 1) * N.SLOT - 0.002).toFixed(1) }); }
    }
    return out;
  });
  for (const s of ['asphalt', 'dirt']) {
    const c = cuts[s];
    ok(s + ': the sprite decodes in the browser, four seconds of slots', c.seconds >= 3.95 && c.seconds < 4.2, c.seconds.toFixed(3) + ' s');
    ok('  every cut starts at its slot: silence before it, a hit in its first 60 ms, silence after', c.slots.every(x => x.pre < -45 && x.hit > -20 && x.after < -45), JSON.stringify(c.slots));
  }

  /* the road: two a beat */
  await p.tap('#road');
  await p.waitForTimeout(4200);
  const r1 = await p.evaluate(() => { const S = window.__steps(); return { surface: S.surface, count: S.count, picks: S.picks.slice(), playing: S.playing(), errs: S.log.filter(x => x.err) }; });
  const rep = a => a.some((k, i) => i && a[i - 1] === k);
  ok('ROAD: real shoes play on the beat, two a beat (about 16 in 4 s)', r1.playing && r1.surface === 'asphalt' && r1.count >= 15 && r1.count <= 19, r1.count + ' steps');
  ok('  never the same cut twice in a row, and more than half the cuts heard', !rep(r1.picks) && new Set(r1.picks).size >= 5, r1.picks.join(''));
  ok('  the recording loaded', r1.errs.length === 0, JSON.stringify(r1.errs));

  /* the dirt: one a beat */
  await p.tap('#dirt');
  await p.waitForTimeout(4200);
  const r2 = await p.evaluate(() => { const S = window.__steps(); return { surface: S.surface, count: S.count, picks: S.picks.slice(), playing: S.playing() }; });
  const dirtSteps = r2.count - r1.count;
  ok('DIRT: one a beat, half the road (about 8 in 4 s)', r2.playing && r2.surface === 'dirt' && dirtSteps >= 7 && dirtSteps <= 11, dirtSteps + ' steps');
  ok('  never the same cut twice in a row', !rep(r2.picks.slice(-dirtSteps)), r2.picks.slice(-dirtSteps).join(''));

  /* the A/B and stop */
  await p.tap('#roadOld');
  await p.waitForTimeout(600);
  const r3 = await p.evaluate(() => ({ steps: window.__steps().playing(), text: document.getElementById('num').textContent, old: !!document.querySelector('#roadOld.on') }));
  ok('WHAT PLAYS NOW: the engine step plays and the recorded steps stand down', !r3.steps && /engine/.test(r3.text), r3.text);
  await p.tap('#stop');
  await p.waitForTimeout(300);
  ok('STOP: silent', (await p.evaluate(() => document.getElementById('num').textContent)) === 'Stopped.');

  ok('every file the page asked for was there', bad.length === 0, bad.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nTRAVEL STEPS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
