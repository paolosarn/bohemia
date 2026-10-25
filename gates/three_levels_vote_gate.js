#!/usr/bin/env node
/* BOHEMIA -- THREE LEVELS IN THE VOTE TAB FIRST (SOUNDS, 10/25/26, rules 167, 168, 181).

   Rule 181(a): every new piece of music (levels 2 and 3 of his songs, a new pulse under them) goes to the VOTE tab first,
   PLAYING, and joins the game only when he says it joins. 181(b): the card plays each song at levels 1, 2 and 3 and a
   short run of turn changes on the bar and the 120 BPM beat. 168(a): every level carries an audible 120 BPM pulse.
   167(c): level 3 is real combat music, never the ambience louder.

   WHAT THIS GATE MEASURES, for every song in slices/vote/songs/three_levels/index.json:
     1  the four recordings exist and are the files measured.json names (md5), none clipped
     2  A 120 BPM PULSE IS IN EVERY LEVEL: the mp3 decoded, an onset envelope in 10 ms frames of the high end, its
        autocorrelation; at a lag of 0.5 s (one beat at 120) it repeats with at least 0.15 of its own energy
     3  level 3 is louder than level 1 on a phone, and carries the drums, the bass and the hook (the parts its pass
        scheduled), level 2 carries the heartbeat and no backbeat
     4  the card is in the registry, its page exists and names this song
     5  NOT IN THE GAME (181(d)): no file of the alpha or the demo names the three levels
     6  THE CARD PLAYS, on a phone profile and a computer profile: level 1 starts, level 3 tapped mid-song lands on the
        next bar line (the gains cross there, not before), A FIGHT plays the run, STOP stops
   node gates/three_levels_vote_gate.js [--fast]   (--fast skips 6) */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const SL = path.join(ROOT, 'slices');
const IDX = path.join(SL, 'vote', 'songs', 'three_levels', 'index.json');
const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
const PAGE = 'BOHEMIA_THREE_LEVELS_10_25_26.html';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('FAIL ' + m); } };
const md5 = b => crypto.createHash('md5').update(b).digest('hex');

function pcmOf(f) {
  const b = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '22050', '-'], { maxBuffer: 256 << 20 });
  return new Int16Array(b.buffer, b.byteOffset, b.length >> 1);
}
/* the pulse: onset strength (the rectified rise of the 10 ms energy), autocorrelated. HEARD THROUGH THE HIGH END: the energy
   is taken of the signal's first difference (a gentle high-pass), where the clock tick, the hats and the kit's attack live and
   what a phone's speaker plays. MEASURED, the full-band onset is fooled by a low voice that swells: CAMPFIRE CONFESSION's
   drone and strum repeat every 0.31 to 0.46 s and beat the 0.5 s lag on every level, while its beat repeats as strongly as
   the other songs' once the drone's low end is out (0.25 to 0.39 of its own energy; the other seven 0.17 to 0.64).
   THE TEST: the high-passed onset repeats at one beat (0.5 s) with at least 0.15 of its own energy. Reported beside it:
   how the beat lag compares with the strongest off-grid lag from 0.3 to 0.9 s, full band and high-passed. */
function pulse(pcm) {
  const fr = 220, N = Math.floor(pcm.length / fr);
  const one = hp => {
    const e = new Float64Array(N);
    for (let i = 0; i < N; i++) { let s = 0; for (let k = 0; k < fr; k++) { const j = i * fr + k; let v = pcm[j] / 32768; if (hp) v -= j ? pcm[j - 1] / 32768 : 0; s += v * v; } e[i] = Math.sqrt(s / fr); }
    const o = new Float64Array(N); for (let i = 1; i < N; i++) o[i] = Math.max(0, e[i] - e[i - 1]);
    let mu = 0; for (let i = 0; i < N; i++) mu += o[i]; mu /= N; for (let i = 0; i < N; i++) o[i] -= mu;
    const ac = lag => { let s = 0; for (let i = 0; i + lag < N; i++) s += o[i] * o[i + lag]; return s / (N - lag); };
    const beat = Math.max(ac(49), ac(50), ac(51));
    let worst = -Infinity, at = 0;
    for (let lag = 30; lag <= 90; lag++) { if (Math.abs(lag % 12.5) < 1.5 || Math.abs(lag % 12.5) > 11) continue; const v = ac(lag); if (v > worst) { worst = v; at = lag; } }
    return { beat, norm: beat / ac(0), ratio: worst > 0 ? beat / worst : 99, worst_at_s: at / 100 };
  };
  const full = one(false), high = one(true);
  return { norm: high.norm, ratio_full: full.ratio, ratio_high: high.ratio, worst_at_s: full.worst_at_s };
}

const index = JSON.parse(fs.readFileSync(IDX, 'utf8'));
const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
ok(index.songs.length > 0, 'no song in the index');
const report = [];
for (const S of index.songs) {
  const dir = path.join(SL, S.dir), M = JSON.parse(fs.readFileSync(path.join(dir, 'measured.json'), 'utf8'));
  const files = M.levels.map(l => l.file).concat([M.a_fight.file]);
  files.forEach((f, i) => {
    const abs = path.join(ROOT, f); ok(fs.existsSync(abs), S.name + ' missing ' + f);
    const want = i < 3 ? M.levels[i].mp3_md5 : M.a_fight.mp3_md5; ok(md5(fs.readFileSync(abs)) === want, S.name + ' ' + f + ' is not the file measured');
  });
  M.levels.forEach(l => ok(l.clipped_samples === 0, S.name + ' level ' + l.level + ' clipped ' + l.clipped_samples));
  const P = files.map(f => pulse(pcmOf(path.join(ROOT, f))));
  P.forEach((p, i) => ok(p.norm >= 0.15, S.name + ' ' + (i < 3 ? 'level ' + (i + 1) : 'the fight') + ': no 120 BPM pulse (the beat repeats at ' + p.norm.toFixed(3) + ' of its energy; beat vs the strongest off-grid lag ' + p.ratio_full.toFixed(2) + ' full, ' + p.ratio_high.toFixed(2) + ' high)'));
  const [a, , c] = M.levels.map(l => l.audio.phone_rms_db);
  ok(c - a >= 1, S.name + ': level 3 is not louder than level 1 on a phone (' + a + ' vs ' + c + ')');
  const k3 = M.levels[2].parts_added, k2 = M.levels[1].parts_added;
  ok((k3['d:clap'] || 0) >= 32 && Object.keys(k3).some(k => k.startsWith('s:') && k3[k] >= 64), S.name + ': level 3 has no backbeat or no hook and bass');
  ok(!k2['d:clap'], S.name + ': level 2 has a backbeat (it waits; the backbeat is your turn)');
  const card = reg.items.find(x => x.id === S.id);
  ok(!!card, S.name + ': no card ' + S.id);
  const own = 'BOHEMIA_THREE_LEVELS_' + S.slug.toUpperCase() + '_10_25_26.html';
  ok(fs.existsSync(path.join(SL, own)) && fs.readFileSync(path.join(SL, own), 'utf8').includes('<meta name="song" content="' + S.slug + '">'), S.name + ': no page of its own naming it (' + own + ')');
  if (card) { ok(card.show && card.show.how === 'page' && card.show.src === own, S.name + ': the card does not show its own page'); ok(card.kind === 'song' && card.lane === 'sounds', S.name + ': card kind/lane'); }
  report.push(S.name + ' the beat repeats ' + P.map(p => p.norm.toFixed(2)).join('/') + ' (vs off-grid, high ' + P.map(p => p.ratio_high > 50 ? '>50' : p.ratio_high.toFixed(1)).join('/') + '), phone dB ' + M.levels.map(l => l.audio.phone_rms_db).join('/'));
}
ok(fs.existsSync(path.join(SL, PAGE)), 'no card page');
/* 181(d): not in the game */
for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
  const p = path.join(SL, f); if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, 'utf8'); ok(!/three_levels|THREE_LEVELS/.test(s), f + ' names the three levels: they are not in the game until he says so (181(d))');
}

async function plays() {
  let pw = null; for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) { try { pw = require(path.join(g, 'playwright')); break; } catch (e) {} }
  if (!pw) { ok(false, 'no playwright'); return; }
  const b = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const S = index.songs[0];
  for (const prof of [{ name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }, { name: 'computer', viewport: { width: 1280, height: 800 } }]) {
    const ctx = await b.newContext(prof), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route('http://bohemia.test/**', r => { const u = new URL(r.request().url()), f = path.join(SL, decodeURIComponent(u.pathname.replace(/^\/+/, '')));
      if (!f.startsWith(SL) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: '' });
      const ext = path.extname(f); r.fulfill({ status: 200, body: fs.readFileSync(f), contentType: ext === '.html' ? 'text/html' : ext === '.json' ? 'application/json' : ext === '.mp3' ? 'audio/mpeg' : 'application/octet-stream' }); });
    await p.goto('http://bohemia.test/BOHEMIA_THREE_LEVELS_' + S.slug.toUpperCase() + '_10_25_26.html');
    await p.waitForTimeout(600);
    const st = () => p.evaluate(() => window.__threelevels());
    ok((await st()).song === S.name, prof.name + ': the page did not pick ' + S.name);
    await p.click('#l1'); await p.waitForFunction(() => window.__threelevels().live, null, { timeout: 30000 }).catch(() => {});
    let s1 = await st(); ok(s1.live && s1.level === 1 && s1.state === 'running', prof.name + ': level 1 did not play ' + JSON.stringify(s1));
    await p.waitForTimeout(2600);
    const before = await st(); await p.click('#l3');
    const t1 = (await st()).t; await p.waitForTimeout(200);
    const mid = await st();
    const nextBar = 0.05 + Math.ceil((t1 + 0.08 - 0.05) / 2) * 2;
    /* before the bar line level 1 still holds, after it level 3 */
    if (nextBar - mid.t > 0.1) ok(mid.gains[0] > 0.9 && mid.gains[2] < 0.1, prof.name + ': level 3 came in before the bar line ' + JSON.stringify(mid));
    await p.waitForTimeout(Math.max(0, (nextBar - mid.t + 0.2) * 1000));
    const after = await st(); ok(after.level === 3 && after.gains[2] > 0.9 && after.gains[0] < 0.1, prof.name + ': level 3 did not land on the bar ' + JSON.stringify(after));
    ok(before.t > 2, prof.name + ': the song did not run (' + before.t + ')');
    await p.click('#fight'); await p.waitForFunction(() => window.__threelevels().fight, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(9000);
    const f = await st(); ok(f.fight && /THEIR TURN/.test(f.text), prof.name + ': A FIGHT did not play its turns ' + JSON.stringify(f));
    await p.click('#stop'); await p.waitForTimeout(300); const z = await st(); ok(!z.live && !z.fight, prof.name + ': STOP did not stop');
    ok(errs.length === 0, prof.name + ': page errors ' + errs.join(' | '));
    report.push(prof.name + ': plays, level 3 on the bar at ' + nextBar.toFixed(2) + ' s, latency ' + (s1.latency || 0).toFixed(3) + ' s');
    await ctx.close();
  }
  await b.close();
}

(async () => {
  if (!process.argv.includes('--fast')) await plays();
  report.forEach(r => console.log('  ' + r));
  console.log('THREE LEVELS IN THE VOTE TAB FIRST: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
