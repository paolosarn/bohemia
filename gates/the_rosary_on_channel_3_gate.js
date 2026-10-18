/* ============================================================================
   THE ROSARY ON CHANNEL 3 GATE: A NEW SONG MADE WITH HIS SONGS' OWN MACHINE  (SOUNDS, row [his sound, not a revamp],
   10/18/26)

   RULE 119 (PAOLO 10/18, LOCKED, his NO on The Long Road): 'both songs not giving analog horror vibes I was hoping the
   research that Grok helped you do would make it easier to do what you needed to do not like have a whole revamp process
   where you're like making songs I don't fit aesthetic'. (a) a new song starts from his canon songs' own instruments,
   kits and arrangement (MLOOPS, synthV, drumV, SONG_ARR), read and reused, never edited; the pure chip style is dead as
   the sound of a song. (c) before VOTE it plays beside two canon songs and EYES AND EARS writes one line. (d) the card
   plays it next to the canon song it came from.

   The song is ONE ROW in the shape of his MLOOPS rows, slices/vote/songs/the_rosary_on_channel_3.json, recorded from the
   alpha's own engine by tools/bohemia_sounds_his_machine.js. This proves:
     - HIS SHAPE, HIS VALUES: the row has exactly his parent row's keys; every field but the name and its colour is the
       value of the canon song its provenance names (deep equal), and that song is CANON (2 in his verdict table); the
       parent is a song the map plays at night; at most three fields differ from the parent
     - HIS RACK: the bass, the lead (through his engine's own leadVoice) and the accent are voices synthV already has;
       the kick and the hat are voices drumV already has; no new voice, no chip engine anywhere (the song, both pages)
     - HIS ENGINE PLAYS IT, LIVE, the map's way (schedule pass, no audio): 120 BPM; his 64-bar form; no drum before bar 9
       and drums after (the beat arrives late); the named lead sounds only in B and D, two a bar, never in A or C; the
       accent only in A; the bass every bar; MLOOPS the same length after (pushed in memory and popped)
     - A NEW TUNE: its tune, relative to its root, is not the tune of any of his 106 canon songs played the same way
     - HIS SONGS UNTOUCHED: the song lock's bodies are the alpha's (MLOOPS, MFACTIONS, synthV, drumV); its new_songs line
       carries this file, its hash and a why that says ON PURPOSE; the alpha does not load it until his YES
     - THE RECORDINGS ARE OF THIS ROW: measured.json's row hash is the song file's row; every mp3 is there with its hash;
       decoded here: about 65.5 s (32 bars), the peak under -3 dBFS, no sample-to-sample jump over 0.2, under 1 percent
       of the energy above 5 kHz (an AM broadcast's top: no crush, no hiss); the tune heard on a phone as well as his
       parent's tune within 3 dB; the new song and the parent equally loud on a phone within 1.5 dB (a fair A/B)
     - VOTE ONLY AFTER EYES: the card waits in the song's file; it is in the registry only when EYES AND EARS' line on the
       board names the song with 'same game YES' and 'analog horror YES' (tools/bohemia_sounds_register_song.py); the card
       shows the page, plays the parent as an option, and is a draft
     - THE PAGES, in a real phone-sized browser: the VOTE page over the real map, A the new song, B his parent, C no song,
       STOP, four buttons in two rows, every file there, nothing throws; EYES' page with the numbers and four players
   Run: node gates/the_rosary_on_channel_3_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));
const PORT = 8893;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

const SONGF = 'slices/vote/songs/the_rosary_on_channel_3.json';
const DIR = 'slices/vote/songs/the_rosary_on_channel_3';
const PAGE = 'slices/BOHEMIA_THE_ROSARY_ON_CHANNEL_3_10_18_26.html';
const EYESPAGE = 'slices/BOHEMIA_THE_ROSARY_BESIDE_HIS_SONGS_10_18_26.html';
const NIGHT = ['SLOW CREEP', 'SATELLITE PRAYER', 'REPO MAN', 'GHOST IN THE GRID', 'SLOW BLEED', 'THE PIT BOSS IS GONE'];

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const get = (o, k) => k.split('.').reduce((x, y) => (x == null ? x : x[y]), o);

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
  const canon = n => CD[n + '#1'] === 2;
  const byName = n => ML.find(r => r.n === n);
  const SV = cut(alpha, 'function synthV(', '\nfunction '), DV = cut(alpha, 'function drumV(', '\nfunction ');
  const rack = k => new RegExp("kind===\\'" + k + "\\'").test(SV), kit = k => new RegExp("kind===\\'" + k + "\\'").test(DV);
  const leadVoice = l => { l = l || 'pluck'; return l === 'whistle' ? 'karp' : (l === 'arp' ? 'acid' : (l === 'pluck' ? 'bell' : l)); };

  /* ---- his shape, his values ---- */
  const parent = byName(song.parent);
  ok('the parent is one of his songs, CANON, and the map plays it at night', !!parent && canon(song.parent) && NIGHT.includes(song.parent), song.parent);
  ok('the row has exactly the parent row\'s keys (his shape, nothing added, nothing dropped)', !!parent && deq(Object.keys(row).sort(), Object.keys(parent).sort()), Object.keys(row).join(','));
  const fields = ['root', 'scale', 'wave', 'kick', 'bass', 'hat', 'inst.b', 'inst.l', 'am', 'kit', 'mel', 'swing', 'feel', 'klay', 'ff'];
  const bad = fields.filter(k => { const pv = song.provenance[k]; const src = pv && byName(pv[0]); return !src || !canon(pv[0]) || !deq(get(row, k), get(src, k)); });
  ok('every field is the value of the canon song its provenance names (deep equal, the song CANON)', bad.length === 0, bad.length ? 'off: ' + bad.join(', ') : fields.length + ' fields');
  const changed = fields.filter(k => !deq(get(row, k), get(parent, k)));
  ok('  at most three fields differ from the parent (his siblings differ in three to five)', changed.length >= 1 && changed.length <= 3, changed.join(', '));
  ok('  the name is new and the tune it draws is not a canon song\'s name', !ML.some(r => r.n === row.n) && song.name === row.n && song.draft === true, row.n);

  /* ---- his rack ---- */
  ok('the bass, the lead and the accent are voices his rack already has', rack(row.inst.b) && rack(leadVoice(row.inst.l)) && rack(row.am), [row.inst.b, row.inst.l, row.am].join(', '));
  ok('the kick and the hat are voices his drum bank already has', kit(row.kit.k) && kit(row.kit.h), row.kit.k + ', ' + row.kit.h);
  const pageRaw = fs.readFileSync(path.join(ROOT, PAGE), 'utf8'), eyesRaw = fs.readFileSync(path.join(ROOT, EYESPAGE), 'utf8');
  ok('no chip engine: not in the song (no voices or order table), not on either page', !song.voices && !song.order && !/bohemia_chip_song/.test(pageRaw) && !/bohemia_chip_song/.test(eyesRaw));

  /* ---- his songs untouched, locked, silent until his YES ---- */
  const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_SONG_LOCK.json'), 'utf8'));
  const md5 = s => crypto.createHash('md5').update(s).digest('hex');
  const live = { MLOOPS: md5(cut(alpha, 'const MLOOPS=[', '\n];')), MFACTIONS: md5(cut(alpha, 'const MFACTIONS=[', '\n];')) };
  ok('his songs are the locked ones, byte for byte (MLOOPS and MFACTIONS in the alpha)', lock.bodies && lock.bodies.MLOOPS && lock.bodies.MLOOPS.md5 === live.MLOOPS && lock.bodies.MFACTIONS.md5 === live.MFACTIONS);
  const ns = (lock.new_songs || []).find(x => x.file === SONGF);
  const fmd5 = md5(fs.readFileSync(path.join(ROOT, SONGF)));
  ok('the song lock carries it as a new song, with its hash and its why (ON PURPOSE)', !!ns && ns.md5 === fmd5 && /ON PURPOSE/.test(ns.why || ''), ns ? ns.md5 + ' vs ' + fmd5 : 'no line');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const card = song.card, ID = card.id;
  const yes = (reg.verdicts || []).some(v => v.id === ID && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = alpha.indexOf('the_rosary_on_channel_3') >= 0 || alpha.indexOf(row.n) >= 0;
  ok('unjudged is silent: the alpha does not load it until his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired');

  /* ---- VOTE only after EYES ---- */
  const item = (reg.items || []).find(i => i.id === ID);
  let eyesSaid = 'none';
  try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_sounds_register_song.py'), SONGF], { stdio: 'pipe' }); eyesSaid = 'yes'; } catch (e) { eyesSaid = String(e.stdout || '').split('\n')[0]; }
  ok('in the VOTE tab only after EYES AND EARS\' line says same game YES and analog horror YES (rule 119c)', !item || eyesSaid === 'yes', item ? (eyesSaid === 'yes' ? 'registered after EYES' : 'REGISTERED WITHOUT EYES: ' + eyesSaid) : 'waiting: ' + eyesSaid.slice(0, 90));
  ok('  the card waiting in the song\'s file: kind song, this page, the parent as an option, a draft', card.kind === 'song' && card.show && card.show.src === path.basename(PAGE) && card.options.some(o => o.indexOf(song.parent) >= 0) && card.draft === true && /^sounds-/.test(ID));

  /* ---- the recordings are of this row ---- */
  const M = JSON.parse(fs.readFileSync(path.join(ROOT, DIR, 'measured.json'), 'utf8'));
  ok('the recordings are of this row (measured.json\'s row hash is the song file\'s row)', M.row_md5 === T.rowMd5(row) && deq(M.songs[0].row, row), M.row_md5);
  const files = M.songs.map(s => s.file);
  ok('every recording is there with its hash: the new song, then his ' + song.beside.join(', '), M.songs.length === 1 + song.beside.length && M.songs.every(s => fs.existsSync(path.join(ROOT, s.file)) && md5(fs.readFileSync(path.join(ROOT, s.file))) === s.mp3_md5) && song.beside.every((n, i) => M.songs[i + 1].name === n), files.map(f => path.basename(f)).join(' '));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rosary_gate_'));
  const raws = M.songs.map((s, i) => { const r = path.join(tmp, i + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(ROOT, s.file), '-f', 's16le', '-ac', '1', '-ar', '44100', r]); return r; });
  const A = JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools/bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
  fs.rmSync(tmp, { recursive: true, force: true });
  const a0 = A[0], ap = A[1];
  ok('decoded: about 65.5 s each, the first 32 bars', A.every(x => Math.abs(x.seconds - 65.5) < 0.3), A.map(x => x.seconds).join(', '));
  ok('the peak under -3 dBFS on every recording: no clip, no limiter', A.every(x => x.peak_db < -3), A.map(x => x.peak_db).join(', '));
  ok('no click: no sample-to-sample jump over 0.2', A.every(x => x.largest_jump < 0.2), A.map(x => x.largest_jump).join(', '));
  ok('under 1 percent of the new song\'s energy above 5 kHz (an AM broadcast\'s top): no crush, no hiss', a0.above_5k_pct < 1, a0.above_5k_pct + ' %');
  const tN = M.songs[0].audio.tune_on_a_phone_vs_the_mix_db, tP = M.songs[1].audio.tune_on_a_phone_vs_the_mix_db;
  ok('the tune heard on a phone as well as his parent\'s tune, within 3 dB (under the mix through a phone\'s speaker)', tN >= tP - 3, 'new ' + tN + ' dB, ' + song.parent + ' ' + tP + ' dB');
  ok('A FAIR A/B: the new song and his ' + song.parent + ' equally loud through a phone\'s speaker, within 1.5 dB', Math.abs(a0.phone_rms_db - ap.phone_rms_db) < 1.5, 'new ' + a0.phone_rms_db + ', his ' + ap.phone_rms_db + ' dB');

  /* ---- his engine plays it, live (schedule pass) ---- */
  const { b, p, errs: aerrs } = await T.openAlpha();
  const n0 = await p.evaluate(() => MLOOPS.length);
  const r = await T.pass(p, { row }, 64, false);
  const n1 = await p.evaluate(() => MLOOPS.length);
  ok('his engine plays the row from memory, and MLOOPS is the same length after (nothing left in it)', !r.err && r.name === row.n && n0 === n1, r.err || (n0 + ' -> ' + n1));
  const S = T.summarise(r);
  ok('120 BPM: his transport\'s own sixteenth is 0.125 s', Math.abs(r.sd - 0.125) < 1e-9 && S.bpm === 120, r.sd);
  ok('his 64-bar form and his key moves, as his engine has them', r.form.arr.join('') === 'ABBACBDBABCADDBA' && r.form.rt.join(',') === '0,0,2,0,3,2,0,1,0,2,3,0,1,2,0,0', r.form.arr.join(''));
  ok('the beat arrives late: no drum before bar 9 (16 s), then drums', S.first_drum_bar === 9 && S.drum_hits > 100, S.first_drum_s + ' s, ' + S.drum_hits + ' hits');
  const sec = t => r.form.arr[Math.floor(Math.floor(t / 2 + 1e-6) / 4) % 16];
  const lead = r.log.filter(x => x[0] === 's' && x[1] === r.form.lead), acc = r.log.filter(x => x[0] === 's' && x[1] === row.am && x[4] === 0.05), bassN = r.log.filter(x => x[0] === 's' && x[1] === row.inst.b && x[4] === 0.13);
  const leadSecs = [...new Set(lead.map(x => sec(x[2])))].sort().join('');
  ok('the rosary (the row\'s own lead) sounds only where his tune lives, B and D, two a bar', lead.length === 72 && leadSecs === 'BD' && S.tune_bars === 36, lead.length + ' notes in ' + leadSecs + ', ' + S.tune_bars + ' bars');
  ok('  the accent only in the core (A), the bass in every bar', acc.length > 0 && acc.every(x => sec(x[2]) === 'A') && new Set(bassN.map(x => Math.floor(x[2] / 2 + 1e-6))).size === 64, acc.length + ' accents, bass in ' + new Set(bassN.map(x => Math.floor(x[2] / 2 + 1e-6))).size + ' bars');
  /* a new tune: relative to the root, not any canon song's tune played the same way */
  const rel = rr => rr.log.filter(x => x[0] === 's' && x[1] === rr.form.lead && (x[4] === 0.07 || x[4] === 0.055)).map(x => (x[3] - rr.row.root) + '@' + (x[2]).toFixed(2)).join(' ');
  const mine = rel(r);
  const twins = [];
  for (const c of ML.filter(x => canon(x.n))) { const rc = await T.pass(p, { name: c.n }, 64, false); if (!rc.err && rel(rc) === mine) twins.push(c.n); }
  ok('a new tune: not the tune of any of his ' + ML.filter(x => canon(x.n)).length + ' canon songs, note for note and beat for beat, relative to the root', mine.length > 0 && twins.length === 0, twins.length ? 'SAME AS ' + twins.join(', ') : 'unique');
  await b.close();
  ok('the alpha threw nothing while his engine played it', aerrs.length === 0, aerrs.slice(0, 2).join(' | '));

  /* ---- the pages ---- */
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
  const sa = await q.evaluate(() => window.__rosary());
  ok('A: the new song plays, over the desert, and says where it is in his form', sa.mode === 'song' && sa.playing && /song\.mp3$/.test(sa.file) && sa.bed && sa.seconds > 0.5 && /Bar \d+ of 32/.test(sa.text), sa.text.slice(0, 90));
  await q.tap('#his'); await q.waitForTimeout(2500);
  const sb = await q.evaluate(() => window.__rosary());
  ok('B: his ' + song.parent + ' plays, the new song stopped', sb.mode === 'his' && sb.playing && sb.file.indexOf(T.slug(song.parent)) >= 0 && sb.text.indexOf(song.parent) >= 0, sb.file);
  await q.tap('#none'); await q.waitForTimeout(800);
  const sc = await q.evaluate(() => window.__rosary());
  ok('C: the map without a song, the desert alone', sc.mode === 'none' && !sc.playing && sc.bed);
  await q.tap('#stop'); await q.waitForTimeout(500);
  const sd = await q.evaluate(() => window.__rosary());
  ok('STOP: silent', sd.text === 'Stopped.' && !sd.playing && !sd.bed);
  const fit = await q.evaluate(() => [...document.querySelectorAll('#bar button')].map(x => { const rr = x.getBoundingClientRect(); return [Math.round(rr.left), Math.round(rr.right), Math.round(rr.top)]; }));
  ok('the four buttons fit the phone in two rows', fit.length === 4 && fit.every(z => z[0] >= 0 && z[1] <= 390) && new Set(fit.map(z => z[2])).size === 2, JSON.stringify(fit));
  await q.goto('http://127.0.0.1:' + PORT + '/' + EYESPAGE, { waitUntil: 'load' });
  await q.waitForTimeout(1200);
  const e0 = await q.evaluate(() => ({ s: window.__beside(), rows: document.querySelectorAll('#t tr').length, cols: document.querySelectorAll('#t tr:first-child th').length }));
  await q.tap('#b2'); await q.waitForTimeout(2000);
  const e1 = await q.evaluate(() => window.__beside());
  ok('EYES\' page: the numbers for all four songs, and a song plays on a tap', e0.s.loaded && e0.s.songs === 4 && e0.rows >= 15 && e0.cols === 5 && e1.playing, JSON.stringify(e0));
  const wide = await q.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok('  no sideways scroll on the phone (the table scrolls inside its box)', wide);
  ok('every file both pages asked for was there', miss.length === 0, miss.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await br.close(); srv.close();

  console.log('\nTHE ROSARY ON CHANNEL 3 GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
