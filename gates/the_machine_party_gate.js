/* ============================================================================
   THE MACHINE PARTY GATE: HIS SONG, NOTE FOR NOTE, WITH A REAL MACHINE PLAYING ALONG  (SOUNDS, row [the machine party],
   10/19/26)

   RULE 121(k) (PAOLO 10/19, LOCKED): 'Remodel everything 3D grimey Crashbox analog horror machine party vibes. And the
   music too man.' The songs remade one per round in that vibe through his songs' own machine (RULE 119: MLOOPS,
   synthV, drumV, SONG_ARR read and reused, never edited), REPO MAN and NIGHT FREIGHT as the bar; EYES AND EARS is
   paused, so the card says so instead of waiting (the coordinator, 10/19).

   Round one is REPO MAN: slices/vote/songs/repo_man_the_machine_party.json, engine/bohemia_machine_party.js, the kit in
   slices/vote/songs/machine_party_kit/, the takes recorded by tools/bohemia_sounds_machine_party_record.js. This proves:
     - HIS SONG: the row is REPO MAN's row in the alpha, every key deep equal, the name too (his engine draws the tune
       from the name's length); REPO MAN is CANON and a map night song
     - A REAL MACHINE: every kit file is the manifest's (md5), cut from a CC0 recording with its Freesound line in the
       bank's LICENCES.md and its FLAC banked; the motor whines on G3 (196 Hz) within a tenth of a hertz; the kit tool
       has no generator in it (no random, no oscillator)
     - IT ONLY ANSWERS HIS ENGINE (a 64-bar schedule pass in the real alpha, the map's way): with the machine attached
       his engine schedules exactly the notes and drums it schedules without it (no note added, none moved); a press on
       every one of his kick calls and a relay on every one of his hat calls, at the same time; no machine hit before
       bar 9 (the beat still arrives late) while the motor runs from bar 1; the party only in D on beats two and four;
       steel only in B and D; the motor once per section at his key move's interval; drumV and MUS.playStep put back
       and MLOOPS the same length after
     - THE TAKES ARE OF THIS ROW AND THIS MACHINE: measured.json's hashes; three mp3s there with their hashes; decoded:
       about 66.5 s, the peak under -3 dBFS, no click, under 1 percent above 5 kHz (no crush, no hiss added); a fair A/B
       (each take as loud as his REPO MAN through a phone within 1.5 dB); his tune still heard (on a phone, under the mix,
       within 3 dB of his own); the beat heard on a phone at least 6 dB louder than his BOOM and tight hat
     - HIS SONGS UNTOUCHED AND LOCKED: the song lock's bodies are the alpha's; its new_songs line carries this file with
       its hash and an ON PURPOSE why; the alpha does not load the machine until his YES
     - IN VOTE, SAID PLAINLY: the card is in the registry with its sha, kind song, this page, REPO MAN as an option, a
       draft; it is there because EYES' line says yes, or because EYES' MODE reads PAUSED and the card says so
     - THE PAGE, in a real phone-sized browser: the real map, A the machine party, B his REPO MAN, C clean, STOP, four
       buttons in two rows, every file there, nothing throws
   Run: node gates/the_machine_party_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));
const MPR = require(path.join(ROOT, 'tools', 'bohemia_sounds_machine_party_record.js'));
const PORT = 8894;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

const SONGF = 'slices/vote/songs/repo_man_the_machine_party.json';
const DIR = 'slices/vote/songs/repo_man_the_machine_party';
const KITD = 'slices/vote/songs/machine_party_kit';
const PAGE = 'slices/BOHEMIA_REPO_MAN_THE_MACHINE_PARTY_10_19_26.html';
const NIGHT = ['SLOW CREEP', 'SATELLITE PRAYER', 'REPO MAN', 'GHOST IN THE GRID', 'SLOW BLEED', 'THE PIT BOSS IS GONE'];

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const md5 = s => crypto.createHash('md5').update(s).digest('hex');

(async () => {
  const song = JSON.parse(fs.readFileSync(path.join(ROOT, SONGF), 'utf8'));
  const row = song.row;
  const alphaRaw = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const ri = alphaRaw.indexOf('<script type="text/plain" id="BOHEMIA_MUSIC_REPO">'), rj = ri >= 0 ? alphaRaw.indexOf('</script>', ri) : -1;
  const alpha = ri >= 0 && rj > ri ? alphaRaw.slice(0, ri) + alphaRaw.slice(rj) : alphaRaw;
  const cut = (src, a, z) => { const i = src.indexOf(a); if (i < 0) return null; const j = src.indexOf(z, i + a.length); return j < 0 ? null : src.slice(i, j + z.length); };
  const ML = eval('(' + cut(alpha, 'const MLOOPS=[', '\n];').slice('const MLOOPS='.length, -1) + ')');
  const CDs = cut(alpha, 'const CANON_DEFAULTS=', '};');
  const CD = eval('(' + CDs.slice('const CANON_DEFAULTS='.length, -1) + ')');
  const his = ML.find(r => r.n === song.remakes);

  /* ---- his song ---- */
  ok('it remakes one of his songs, CANON, that the map plays at night', !!his && CD[song.remakes + '#1'] === 2 && NIGHT.includes(song.remakes), song.remakes);
  ok('the row IS his row: every key deep equal, the name too (the name is the tune)', !!his && deq(Object.keys(row).sort(), Object.keys(his).sort()) && Object.keys(his).every(k => deq(row[k], his[k])), his ? Object.keys(his).length + ' keys' : 'no row');
  ok('  a draft with its own id; the remake is named for the song it remakes', song.draft === true && /^sounds-/.test(song.id) && song.name.indexOf(song.remakes) === 0, song.name);

  /* ---- a real machine ---- */
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, KITD, 'manifest.json'), 'utf8'));
  const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/bohemia_from_a_recording_sources.json'), 'utf8'));
  const lic = fs.readFileSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0/LICENCES.md'), 'utf8');
  const kitNames = ['press_1', 'press_2', 'relay_1', 'relay_2', 'relay_3', 'clank_1', 'clank_2', 'bed', 'hall'];
  const kbad = kitNames.filter(k => { const v = man.files[k], f = path.join(ROOT, KITD, k + '.wav'); return !v || !fs.existsSync(f) || md5(fs.readFileSync(f)) !== v.md5; });
  ok('every kit file is the one the manifest names (md5)', kbad.length === 0, kbad.length ? 'off: ' + kbad.join(', ') : kitNames.length + ' files');
  const stems = [...new Set(kitNames.map(k => man.files[k] && man.files[k].stem).filter(Boolean))];
  const sbad = stems.filter(s => !src[s] || src[s].licence !== 'CC0' || !/freesound\.org/.test(src[s].url) || lic.indexOf('| ' + s + ' |') < 0 || !fs.existsSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0', s + '.flac')));
  ok('every machine is a real recording, CC0 at the source, its Freesound line in LICENCES.md and its FLAC banked', stems.length >= 4 && sbad.length === 0, sbad.length ? 'off: ' + sbad.join(', ') : stems.join(', '));
  ok('  the motor whines on his G (G3, 196 Hz) within a tenth of a hertz', Math.abs(man.files.bed.whine_hz - 196.0) <= 0.1, man.files.bed.whine_hz + ' Hz');
  const ktool = fs.readFileSync(path.join(ROOT, 'tools/bohemia_sounds_machine_party.py'), 'utf8').replace(/"""[\s\S]*?"""/g, '').replace(/#.*$/gm, '');
  ok('  the kit tool has no generator in it (no random, no oscillator): it only cuts, slows and filters recordings', !/random|np\.sin\(|oscillat|noise\(/i.test(ktool));
  let kc = 'ok'; try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_sounds_machine_party.py'), '--check'], { stdio: 'pipe' }); } catch (e) { kc = String(e.stdout || e.message).slice(0, 120); }
  ok('  the kit tool\'s own --check is clean (levels, licences, hashes)', kc === 'ok', kc);

  /* ---- it only answers his engine ---- */
  const { b, p, errs: aerrs } = await H.openAlpha();
  await MPR.prepare(p);
  const n0 = await p.evaluate(() => MLOOPS.length);
  const plain = await MPR.pass(p, song, 'his', 64, false, null);
  const withM = await MPR.pass(p, song, 'A', 64, false, null);
  const n1 = await p.evaluate(() => MLOOPS.length);
  const back = await p.evaluate(() => ({ dv: /^function drumV\(/.test(String(drumV)), ps: String(MUS.playStep).indexOf('__THE_BEAT_ARRIVES_LATE__') >= 0, on: window.MACHINEPARTY.on }));
  ok('his engine plays both passes, and MLOOPS is the same length after (pushed and popped)', !plain.err && !withM.err && n0 === n1, (plain.err || withM.err || '') + ' ' + n0 + ' -> ' + n1);
  ok('drumV and MUS.playStep are his again after the machine detaches', back.dv && back.ps && !back.on, JSON.stringify(back));
  ok('THE MACHINE ADDS NO NOTE: with it attached his engine schedules exactly the same notes and drums, at the same times', deq(plain.log, withM.log), plain.log.length + ' vs ' + withM.log.length + ' calls');
  const S = H.summarise(withM), sd = withM.sd;
  ok('120 BPM, his 64-bar form and key moves', Math.abs(sd - 0.125) < 1e-9 && S.bpm === 120 && withM.form.arr.join('') === 'ABBACBDBABCADDBA' && withM.form.rt.join(',') === '0,0,2,0,3,2,0,1,0,2,3,0,1,2,0,0');
  const kicks = withM.log.filter(x => x[0] === 'd' && x[1] === row.kit.k).map(x => x[2]), hats = withM.log.filter(x => x[0] === 'd' && x[1] === row.kit.h).map(x => x[2]);
  const ml = withM.mlog, of = k => ml.filter(x => x[0] === k);
  const tt = a => a.map(x => (typeof x === 'number' ? x : x[1]).toFixed(4)).join(' ');
  ok('a press on every one of his kick calls, at the same time', kicks.length > 100 && tt(kicks) === tt(of('press')), kicks.length + ' kicks, ' + of('press').length + ' presses');
  ok('a relay tick on every one of his hat calls, at the same time', hats.length > 50 && tt(hats) === tt(of('relay')), hats.length + ' hats, ' + of('relay').length + ' ticks');
  const hits = ml.filter(x => x[0] !== 'motor'), motors = of('motor');
  ok('the beat still arrives late: no machine hit before bar 9 (16 s), while the motor runs from bar 1', hits.length > 0 && Math.min.apply(null, hits.map(x => x[1])) >= 16 - 1e-6 && motors.length && motors[0][1] < 0.01, 'first hit ' + Math.min.apply(null, hits.map(x => x[1])).toFixed(2) + ' s');
  const secAt = t => withM.form.arr[Math.floor(Math.floor(t / 2 + 1e-6) / 4) % 16];
  ok('the party only in his D sections, on beats two and four (steps 4 and 12)', of('party').length > 0 && of('party').every(x => x[3] === 'D' && secAt(x[1]) === 'D' && (x[2] === 4 || x[2] === 12)), of('party').length + ' strokes');
  ok('steel on steel only in B and D, every other bar', of('clank').length > 0 && of('clank').every(x => (x[3] === 'B' || x[3] === 'D') && x[2] === song.machine.clank.step), of('clank').length + ' clanks');
  const wantSemi = withM.form.rt.map(r => row.scale[r % row.scale.length]);
  ok('the motor changes gear with his key moves: once per section, at the interval his SONG_ROOT names', motors.length === 16 && motors.every((x, i) => x[4] === wantSemi[i] && Math.abs(x[1] - i * 8) < 1e-6), motors.map(x => x[4]).join(','));
  await b.close();
  ok('the alpha threw nothing while his engine played', aerrs.length === 0, aerrs.slice(0, 2).join(' | '));

  /* ---- the takes ---- */
  const M = JSON.parse(fs.readFileSync(path.join(ROOT, DIR, 'measured.json'), 'utf8'));
  ok('the takes are of this row and this machine (measured.json\'s hashes)', M.row_md5 === H.rowMd5(row) && M.machine_md5 === H.rowMd5(song.machine), M.row_md5);
  ok('three takes there with their hashes: A the machine party, C clean, B his ' + song.remakes, M.takes.length === 3 && deq(M.takes.map(t => t.take), ['A', 'C', 'his']) && M.takes.every(t => fs.existsSync(path.join(ROOT, t.file)) && md5(fs.readFileSync(path.join(ROOT, t.file))) === t.mp3_md5 && t.clipped_samples === 0), M.takes.map(t => path.basename(t.file)).join(' '));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'machine_party_gate_'));
  const raws = M.takes.map((t, i) => { const r = path.join(tmp, i + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(ROOT, t.file), '-f', 's16le', '-ac', '1', '-ar', '44100', r]); return r; });
  const A = JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools/bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
  fs.rmSync(tmp, { recursive: true, force: true });
  ok('decoded: about 66.5 s each, the first 32 bars and the hall\'s tail', A.every(x => Math.abs(x.seconds - 66.5) < 0.3), A.map(x => x.seconds).join(', '));
  ok('the peak under -3 dBFS on every take', A.every(x => x.peak_db < -3), A.map(x => x.peak_db).join(', '));
  ok('no click: no sample-to-sample jump over 0.2', A.every(x => x.largest_jump < 0.2), A.map(x => x.largest_jump).join(', '));
  ok('under 1 percent of either machine take above 5 kHz: no crush, no hiss added', A[0].above_5k_pct < 1 && A[1].above_5k_pct < 1, A[0].above_5k_pct + ', ' + A[1].above_5k_pct + ' %');
  ok('A FAIR A/B: A and C each as loud as his ' + song.remakes + ' through a phone\'s speaker, within 1.5 dB', Math.abs(A[0].phone_rms_db - A[2].phone_rms_db) < 1.5 && Math.abs(A[1].phone_rms_db - A[2].phone_rms_db) < 1.5, A.map(x => x.phone_rms_db).join(', '));
  const au = k => M.takes.find(t => t.take === k).audio;
  ok('his tune is not buried: on a phone, under the mix, within 3 dB of his own (A and C)', au('A').tune_on_a_phone_vs_the_mix_db >= au('his').tune_on_a_phone_vs_the_mix_db - 3 && au('C').tune_on_a_phone_vs_the_mix_db >= au('his').tune_on_a_phone_vs_the_mix_db - 3,
    'A ' + au('A').tune_on_a_phone_vs_the_mix_db + ', C ' + au('C').tune_on_a_phone_vs_the_mix_db + ', his ' + au('his').tune_on_a_phone_vs_the_mix_db + ' dB');
  ok('THE BEAT IS HEARD ON A PHONE: at least 6 dB louder than his BOOM and tight hat (A and C)', au('A').beat_on_a_phone_db >= au('his').beat_on_a_phone_db + 6 && au('C').beat_on_a_phone_db >= au('his').beat_on_a_phone_db + 6,
    'A ' + au('A').beat_on_a_phone_db + ', C ' + au('C').beat_on_a_phone_db + ', his ' + au('his').beat_on_a_phone_db + ' dB');

  /* ---- his songs untouched, locked, silent until his YES ---- */
  const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_SONG_LOCK.json'), 'utf8'));
  const live = { MLOOPS: md5(cut(alpha, 'const MLOOPS=[', '\n];')), MFACTIONS: md5(cut(alpha, 'const MFACTIONS=[', '\n];')) };
  ok('his songs are the locked ones, byte for byte (MLOOPS and MFACTIONS in the alpha)', lock.bodies && lock.bodies.MLOOPS && lock.bodies.MLOOPS.md5 === live.MLOOPS && lock.bodies.MFACTIONS.md5 === live.MFACTIONS);
  const ns = (lock.new_songs || []).find(x => x.file === SONGF), fmd5 = md5(fs.readFileSync(path.join(ROOT, SONGF)));
  ok('the song lock carries the remake as a new song, with its hash and its why (ON PURPOSE)', !!ns && ns.md5 === fmd5 && /ON PURPOSE/.test(ns.why || ''), ns ? ns.md5 + ' vs ' + fmd5 : 'no line');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const ID = song.card.id, yes = (reg.verdicts || []).some(v => v.id === ID && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = alpha.indexOf('bohemia_machine_party') >= 0 || alpha.indexOf('MACHINEPARTY') >= 0;
  ok('unjudged is silent: the alpha does not load the machine until his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired');

  /* ---- in VOTE, said plainly ---- */
  const item = (reg.items || []).find(i => i.id === ID);
  const vam = fs.readFileSync(path.join(ROOT, 'VAMILY.md'), 'utf8');
  const eyesMode = (vam.split('\n## EYES AND EARS')[1] || '').split('\n')[1] || '';
  let eyesSaid = 'none';
  try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_sounds_register_song.py'), SONGF], { stdio: 'pipe' }); eyesSaid = 'yes'; } catch (e) { eyesSaid = String(e.stdout || '').split('\n')[0]; }
  ok('in the VOTE tab with its sha: kind song, this page, ' + song.remakes + ' as an option, a draft', !!item && item.kind === 'song' && /^[0-9a-f]{7,}$/.test(item.sha || '') && item.show && item.show.src === path.basename(PAGE) && item.options.some(o => o.indexOf(song.remakes) >= 0) && item.draft === true, item ? item.sha : 'NOT IN THE REGISTRY');
  ok('  there because EYES said yes, or because EYES is PAUSED and the card says so (rule 119c, the coordinator 10/19)', !!item && (eyesSaid === 'yes' || (/^MODE: PAUSED/.test(eyesMode) && /EYES AND EARS is paused/.test(item.why))), eyesSaid === 'yes' ? 'EYES yes' : eyesMode.slice(0, 40));

  /* ---- the page ---- */
  await new Promise(res => srv.listen(PORT, '127.0.0.1', res));
  const { chromium } = (() => { for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules']) { try { return require(path.join(g, 'playwright')); } catch (e) {} } return require('playwright'); })();
  const br = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const q = await ctx.newPage();
  const errs = [], miss = [];
  q.on('pageerror', e => errs.push(String(e.message)));
  q.on('response', x => { if (x.status() >= 400) miss.push(x.url()); });
  await q.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load' });
  await q.waitForTimeout(1200);
  const look = await q.evaluate(() => { const f = document.getElementById('map'); let o = false; try { o = !!f.contentDocument && f.contentDocument.readyState !== 'loading' && f.contentDocument.body.children.length > 0; } catch (_e) {} return { frame: !!f && /BOHEMIA_MAP_CURRENT/.test(f.src), loaded: o }; });
  ok('the VOTE page shows the real map', look.frame && look.loaded, JSON.stringify(look));
  await q.tap('#song'); await q.waitForTimeout(2500);
  const sa = await q.evaluate(() => window.__machineparty());
  ok('A: the machine party plays over the desert and says where it is in his form', sa.mode === 'song' && sa.playing && /repo_man_the_machine_party\/song\.mp3$/.test(sa.file) && sa.bed && sa.seconds > 0.5 && /Bar \d+ of 32/.test(sa.text), sa.text.slice(0, 90));
  await q.tap('#his'); await q.waitForTimeout(2500);
  const sb = await q.evaluate(() => window.__machineparty());
  ok('B: his ' + song.remakes + ' plays, the remake stopped', sb.mode === 'his' && sb.playing && /his_repo_man\.mp3$/.test(sb.file) && sb.text.indexOf(song.remakes) >= 0, sb.file);
  await q.tap('#clean'); await q.waitForTimeout(2500);
  const sc = await q.evaluate(() => window.__machineparty());
  ok('C: the machine party, clean', sc.mode === 'clean' && sc.playing && /clean\.mp3$/.test(sc.file), sc.file);
  await q.tap('#stop'); await q.waitForTimeout(500);
  const sd2 = await q.evaluate(() => window.__machineparty());
  ok('STOP: silent', sd2.text === 'Stopped.' && !sd2.playing && !sd2.bed);
  const fit = await q.evaluate(() => [...document.querySelectorAll('#bar button')].map(x => { const rr = x.getBoundingClientRect(); return [Math.round(rr.left), Math.round(rr.right), Math.round(rr.top)]; }));
  ok('the four buttons fit the phone in two rows', fit.length === 4 && fit.every(z => z[0] >= 0 && z[1] <= 390) && new Set(fit.map(z => z[2])).size === 2, JSON.stringify(fit));
  const wide = await q.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok('  no sideways scroll on the phone', wide);
  ok('every file the page asked for was there', miss.length === 0, miss.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await br.close(); srv.close();

  console.log('\nTHE MACHINE PARTY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
