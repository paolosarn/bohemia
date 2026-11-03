/* BOHEMIA -- THE TOWN YOU DID NOT DEFEND, GATE (RADIO 11/3/26; Paolo 11/3, rule 353, ask lines 367 and 370).
 *
 *   node gates/the_town_you_did_not_defend_gate.js           the words, the sound file, the wiring, the VOTE card in a browser
 *   node gates/the_town_you_did_not_defend_gate.js --live    and the real demo: a town falls, the phone shows it (about 2 min)
 *
 * WHAT IT HOLDS (each leg is what his words and the round's rules say, read off the shipped files, never off the cook tool):
 *   A. THE WORDS (records/target/bb/radio_lines.json): every town 16 lines in the skeleton's order, each one whole on the
 *      phone (120 characters with every fill at its longest, the handle 16; rule 350), draft:true, no exclamation mark, no
 *      Spanglish (rule 355), the phone speaks only in brackets and ends it (R4), a call repeated and never answered (R6),
 *      never before the first minute (353e), and the strip keeps every line its read time before the next comes.
 *   B. THE SOUND (slices/radio/fall.mp3, decoded here): NO VOICE (353g: the file is the skeleton's keys and nothing else),
 *      every key-up ends in a squelch tail louder than the post's carrier, the channel silent between keys, the weak posts
 *      hiss over the strong (an FM receiver's quieting: the sound reports the signal), every object a CC0, public domain
 *      or MIT recording that exists in the bank, under the music (the heard gain).
 *   C. THE WIRING: the alpha and the demo carry engine/bohemia_radio_heard.js byte for byte and its glue; the map loads
 *      slices/bohemia_radio.js and raidSettle asks for the fall only on 'taken'.
 *   D. THE VOTE CARD: the page plays the game's own recording and shows the lines in order, 0 page errors; it is in the
 *      registry once.
 *   E. (--live) THE REAL DEMO: a town falls; the phone's posts carry its channel line by line, the shell books the
 *      recording on the next beat and answers the map, 0 page errors. (The first minute is A6's: this box boots past it.)
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
let pass = 0, fail = 0;
const leg = (ok, label, extra) => { (ok ? pass++ : fail++); console.log((ok ? '  PASS ' : '  FAIL ') + label + (extra ? '  -- ' + extra : '')); };

const L = JSON.parse(fs.readFileSync(R('records/target/bb/radio_lines.json'), 'utf8'));
const IDX = JSON.parse(fs.readFileSync(R('slices/radio/index.json'), 'utf8'));
const MAN = JSON.parse(fs.readFileSync(R('slices/radio/manifest.json'), 'utf8'));
const SPANISH = ['mio', 'mia', 'dios', 'madre', 'santa', 'mijo', 'mija', 'quiere', 'ay', 'oye', 'pues', 'hermano', 'ojala', 'gracias', 'bueno', 'vamos', 'nada', 'calle', 'jefe'];

/* ---------------- A. THE WORDS ---------------- */
function shown(town, i) {
  const sk = L.skeleton[i], T = L.towns[town], lab = (T.labels || {})[sk.src] || sk.src;
  const say = T.lines[i].say.replace(/\{town\}/g, town === '_plain' ? 'Volunteers' : town);
  return '23:59:59 ' + (sk.src === 'PHONE' ? '' : lab + '  ') + say;
}
function words() {
  console.log('A. THE WORDS');
  const n = L.skeleton.length, towns = Object.keys(L.towns), probs = [];
  towns.forEach(t => {
    const T = L.towns[t];
    if (T.lines.length !== n) { probs.push(t + ' has ' + T.lines.length + ' lines'); return; }
    T.lines.forEach((ln, i) => {
      const s = shown(t, i), low = ' ' + ln.say.toLowerCase().replace(/[.,?]/g, ' ') + ' ';
      if (s.length > L.max_chars) probs.push(t + ' ' + (i + 1) + ' is ' + s.length + ' characters');
      if (ln.draft !== true) probs.push(t + ' ' + (i + 1) + ' not draft');
      if (/!/.test(ln.say)) probs.push(t + ' ' + (i + 1) + ' has an exclamation mark');
      if (/[\u2013\u2014]/.test(ln.say)) probs.push(t + ' ' + (i + 1) + ' has a dash');
      if (SPANISH.some(w => low.indexOf(' ' + w + ' ') >= 0)) probs.push(t + ' ' + (i + 1) + ' is Spanglish');
      if (L.skeleton[i].src === 'PHONE' && !/^\[|^END OF TRANSMISSION/.test(ln.say)) probs.push(t + ' ' + (i + 1) + ': the phone speaks only in brackets');
    });
    if (!/^END OF TRANSMISSION/.test(T.lines[n - 1].say)) probs.push(t + ': the last line is not the end of transmission');
  });
  leg(probs.length === 0 && towns.length >= 4, 'A1 EVERY LINE OF EVERY TOWN IS WHOLE ON THE PHONE, DRAFT, CALM, NO SPANGLISH (rules 350, 355; R3, R4)',
    probs.length ? probs.slice(0, 4).join('; ') : towns.length + ' towns x ' + n + ' lines, longest ' + Math.max(...towns.flatMap(t => L.towns[t].lines.map((_, i) => shown(t, i).length))) + ' of ' + L.max_chars);
  leg((L.channel + ' VOLUNTEERS').length <= L.handle_max, 'A2 THE CHANNEL\'S HANDLE FITS (16)', L.channel + ' VOLUNTEERS');
  /* R6: the gate calls the roof, twice, and the phone says nobody answered */
  const sk = L.skeleton, calls = sk.map((s, i) => [s, i]).filter(([s, i]) => s.src === 'GATE' && /four-one/i.test(L.towns._plain.lines[i].say));
  const after = calls.length ? sk[calls[calls.length - 1][1] + 1] : null;
  const noReply = after && after.src === 'PHONE' && /no reply/.test(L.towns._plain.lines[sk.indexOf(after)].say);
  leg(calls.length >= 2 && noReply, 'A3 ONE CALL IS REPEATED AND NEVER ANSWERED (R6)', calls.length + ' calls, then ' + (after ? L.towns._plain.lines[sk.indexOf(after)].say : 'nothing'));
  leg((L.when.never_before_s | 0) >= 60 && L.draft === true, 'A4 NEVER IN THE FIRST MINUTE, AND THE FILE IS DRAFT (353e)', 'never_before_s ' + L.when.never_before_s);
  /* the strip keeps a post 1.2 s + 0.25 s a word in whole beats (UI 4, rule 329): each line gets that before the next */
  const RD = L.read, late = [];
  for (let i = 0; i + 1 < sk.length; i++) {
    const need = Math.max(...towns.map(t => { const s = shown(t, i), w = s.split(/\s+/).filter(Boolean).length + 3;
      return Math.ceil((RD.base_ms + RD.per_word_ms * w) / RD.beat_ms) * RD.beat_ms / 1000; }));
    if (sk[i + 1].at - sk[i].at + 1e-6 < need) late.push((i + 1) + ': ' + (sk[i + 1].at - sk[i].at) + ' s < ' + need);
  }
  const t2 = sk.every((s, i) => !i || s.t > sk[i - 1].t);
  leg(late.length === 0 && t2, 'A5 EVERY LINE STAYS ITS READ TIME, AND THE CLOCK ON THE LINES ONLY MOVES FORWARD', late.length ? late.slice(0, 3).join('; ') : sk.length + ' lines over ' + L.length_s + ' s');
}

/* A6: the scanner itself, run in a sandbox with the clock in our hands: a fall asked at 10 s waits; at 70 s it plays */
async function firstMinute() {
  const vm = require('vm'), src = fs.readFileSync(R('slices/bohemia_radio.js'), 'utf8');
  const run = async up => {
    const timers = [], posted = [];
    const win = { performance: { now: () => up }, localStorage: { getItem: () => null, setItem: () => {} },
      fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(JSON.stringify(L))) }),
      setTimeout: (f, ms) => { timers.push([f, ms]); return timers.length; }, clearTimeout: () => {},
      addEventListener: () => {}, removeEventListener: () => {}, postMessage: m => posted.push(m) };
    win.parent = win; win.window = win;
    vm.createContext(win); vm.runInContext(src, win);
    await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r));
    const ok = win.BohemiaRadio.fall('Church', 'Mob');
    return { ok, st: win.BohemiaRadio.state(), posted: posted.length, waits: timers.map(t => t[1]) };
  };
  const a = await run(10000), b = await run(70000);
  leg(a.ok === false && a.st.waiting === 1 && !a.st.playing && a.posted === 0 && a.waits.some(ms => ms >= 50000) && b.ok === true && b.st.playing && b.posted === 1,
    'A6 A FALL ASKED INSIDE THE FIRST MINUTE WAITS FOR IT; AFTER IT, IT PLAYS (353e; the scanner run in a sandbox)',
    'at 10 s: ' + JSON.stringify({ ok: a.ok, waiting: a.st.waiting, asks: a.posted }) + '; at 70 s: ' + JSON.stringify({ ok: b.ok, playing: b.st.playing, asks: b.posted }));
}

/* ---------------- B. THE SOUND ---------------- */
function decode(file, sr) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', String(sr), '-'], { maxBuffer: 1 << 28 });
  return new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
}
const dbOf = (x, a, b, sr) => { let s = 0, n = 0; for (let i = Math.max(0, (a * sr) | 0); i < Math.min(x.length, (b * sr) | 0); i++) { s += x[i] * x[i]; n++; } return n ? 10 * Math.log10(s / n + 1e-20) : -200; };
function sound() {
  console.log('B. THE SOUND');
  const sr = 22050, x = decode(R('slices/radio/' + IDX.file), sr), dur = x.length / sr;
  leg(Math.abs(dur - L.length_s) < 0.5 && JSON.stringify(IDX.skeleton.map(s => [s.n, s.at, s.key || 0])) === JSON.stringify(L.skeleton.map(s => [s.n, s.at, s.key || 0])),
    'B1 THE RECORDING IS THE WORDS\' OWN SKELETON (same keys, same times, same length)', dur.toFixed(1) + ' s against ' + L.length_s);
  const keys = L.skeleton.filter(s => s.kind === 'key' || s.kind === 'open');
  const tails = [], bodies = [];
  keys.forEach(s => { const e = s.at + s.key, body = dbOf(x, s.at + 0.35, e - 0.15, sr), tail = dbOf(x, e, e + 0.12, sr);
    bodies.push([s, body]); tails.push([s, tail - body, tail]); });
  const weakTails = tails.filter(t => t[1] < 6);
  leg(weakTails.length === 0, 'B2 EVERY KEY-UP ENDS IN A SQUELCH TAIL LOUDER THAN ITS POST\'S CARRIER',
    weakTails.length ? weakTails.map(t => t[0].n + ': +' + t[1].toFixed(1)).join(', ') : 'tails ' + Math.min(...tails.map(t => t[1])).toFixed(1) + ' to ' + Math.max(...tails.map(t => t[1])).toFixed(1) + ' dB over the carrier');
  /* between keys: the squelch shut (after the tail has had its 0.4 s) */
  const gaps = []; keys.forEach((s, i) => { const nx = keys[i + 1]; const a = s.at + s.key + 0.45, b = nx ? nx.at - 0.05 : Math.min(dur, a + 2);
    if (b - a > 0.3) gaps.push(dbOf(x, a, b, sr)); });
  leg(gaps.length > 5 && Math.max(...gaps) < -50, 'B3 THE CHANNEL IS SILENT BETWEEN TRANSMISSIONS (the squelch shut, not a bed of noise)', gaps.length + ' gaps, loudest ' + Math.max(...gaps).toFixed(1) + ' dB');
  const strong = bodies.filter(b => b[0].sig >= 0.9 && b[0].kind === 'key').map(b => b[1]), weak = bodies.filter(b => b[0].sig < 0.5 && b[0].kind === 'key').map(b => b[1]);
  const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
  leg(strong.length >= 4 && weak.length >= 3 && avg(weak) - avg(strong) >= 8, 'B4 A WEAK POST HISSES, A STRONG ONE GOES QUIET (the receiver\'s quieting: the sound reports the signal)',
    'weak ' + avg(weak).toFixed(1) + ' dB, strong ' + avg(strong).toFixed(1) + ' dB');
  /* 353g: no voice. The recording is the receiver's physics plus the objects; a voice would be a source in the manifest */
  const objs = Object.values(MAN.objects || {}), bad = objs.filter(o => !fs.existsSync(R(o.file)) || !/CC0|public domain|MIT/i.test(o.what));
  const lic = objs.every(o => { const d = path.dirname(R(o.file)), l = path.join(d, 'LICENCES.md'); return fs.existsSync(l); });
  leg(objs.length >= 6 && bad.length === 0 && lic && !MAN.voices_vote_only && !/voice/i.test(Object.keys(MAN.objects).join(' ')),
    'B5 NO VOICE IN IT, AND EVERY OBJECT IS A REAL RECORDING IN THE BANK UNDER CC0, PUBLIC DOMAIN OR MIT (353f, 353g)', objs.length + ' recordings' + (bad.length ? '; bad: ' + bad.map(o => o.file).join(', ') : ''));
  leg(typeof IDX.db === 'number' && IDX.db <= -8 && fs.statSync(R('slices/radio/' + IDX.file)).size < 700000, 'B6 UNDER THE MUSIC AND SMALL (heard gain, file size)', IDX.db + ' dB, ' + Math.round(fs.statSync(R('slices/radio/' + IDX.file)).size / 1024) + ' KB, loaded only when a town falls');
}

/* ---------------- C. THE WIRING ---------------- */
function wiring() {
  console.log('C. THE WIRING');
  const eng = fs.readFileSync(R('engine/bohemia_radio_heard.js'), 'utf8');
  const alpha = fs.readFileSync(R('slices/BOHEMIA_ALPHA_0_9.html'), 'utf8'), demo = fs.readFileSync(R('slices/BOHEMIA_DEMO.html'), 'utf8');
  const has = s => s.indexOf(eng) >= 0 && s.indexOf("d.type !== 'BOHEMIA_RADIO'") >= 0 && s.indexOf("type: 'BOHEMIA_RADIO_STARTED'") >= 0;
  leg(has(alpha) && has(demo), 'C1 THE ALPHA AND THE DEMO CARRY THE PLAYER BYTE FOR BYTE, AND ITS ANSWER TO THE MAP');
  const city = fs.readFileSync(R('slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const i = city.indexOf('function raidSettle(){'), body = i >= 0 ? city.slice(i, city.indexOf('\n}\n', i)) : '';
  leg(/<script src="bohemia_radio\.js"><\/script>/.test(city) && /if\(r\.outcome === 'taken'\)\{ try\{ if\(window\.BohemiaRadio\) BohemiaRadio\.fall\(r\.base, r\.by\)/.test(body),
    'C2 THE MAP LOADS THE SCANNER, AND A TOWN TAKEN WITH NOBODY AT ITS GATE ASKS FOR ITS FALL (raidSettle; a town that held says nothing)');
}

/* ---------------- D. THE VOTE CARD, AND E. THE LIVE DEMO ---------------- */
function serve() {
  const http = require('http');
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
    const ext = path.extname(f); r.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream');
    r.end(fs.readFileSync(f)); });
  return new Promise(res => srv.listen(0, '127.0.0.1', () => res(srv)));
}
async function card() {
  console.log('D. THE VOTE CARD');
  const reg = JSON.parse(fs.readFileSync(R('records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const mine = reg.items.filter(it => it.show && it.show.src === 'BOHEMIA_THE_TOWN_YOU_DID_NOT_DEFEND_11_3_26.html');
  leg(mine.length === 1 && mine[0].draft === true, 'D1 THE CARD IS IN THE VOTE TAB ONCE', mine.map(m => m.id).join(', '));
  const { chromium } = require('playwright');
  const srv = await serve(), b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_THE_TOWN_YOU_DID_NOT_DEFEND_11_3_26.html');
    await p.click('text=MOB'); await p.waitForTimeout(16000);
    const st = await p.evaluate(() => ({ c: window.__RADIO_CARD, rows: [...document.querySelectorAll('#log div')].map(d => d.textContent), strip: document.getElementById('strip').innerText }));
    const due = L.skeleton.filter(s => 0.15 + s.at <= 15.6).length;
    leg(st.c && st.c.town === 'Mob' && st.rows.length >= due - 1 && st.rows.length <= due + 1 && /Headlights off/.test(st.rows[0] || '') && /Somebody paid/.test(st.rows.join(' ')) && /CH 4 MOB/.test(st.strip) && errs.length === 0,
      'D2 THE CARD PLAYS ONE TOWN FALLING: THE GAME\'S RECORDING AND ITS LINES IN ORDER, ON THE PHONE', st.rows.length + ' lines by 16 s (due ' + due + '), errors ' + errs.length + (errs[0] ? ': ' + errs[0] : ''));
  } finally { await b.close(); srv.close(); }
}
async function live() {
  console.log('E. THE REAL DEMO');
  const { open } = require(R('tools/bohemia_drive_the_demo.js'));
  const d = await open({ profile: 'phone_portrait' }); const p = d.page, fr = d.fr;
  try {
    await p.waitForTimeout(2500); try { await d.clearCards(); } catch (_e) {}
    await fr.evaluate(() => BohemiaRadio.fall('Church', 'Mob'));   /* inside the first minute it waits (A6); after it, it plays */
    await fr.waitForFunction(() => BohemiaRadio.state().playing, null, { timeout: 90000 }).catch(() => {});
    const t1 = await fr.evaluate(() => ({ up: performance.now(), st: BohemiaRadio.state() }));
    await p.waitForTimeout(20000);
    const posts = await fr.evaluate(() => BohemiaPhone.P.posts().filter(x => x.radio).map(x => x.who + ' | ' + x.txt));
    const due = L.skeleton.filter(s => s.at <= 19).length;
    const top = await p.evaluate(() => ({ log: window.RADIO ? window.RADIO.log : null, err: window.RADIO ? window.RADIO.err : 'no player' }));
    leg(t1.st.playing && t1.up >= 60000 && posts.length >= due && posts.length <= due + 1 && posts.every(s => /^CH 4 CHURCH \| \d\d:\d\d:\d\d /.test(s)) && /TOWER/.test(posts.join(' ')),
      'E2 AFTER THE FIRST MINUTE THE CHURCH FALLS ON THE PHONE, LINE BY LINE, TIME-STAMPED', posts.length + ' lines by 20 s (due ' + due + '); ' + (posts[posts.length - 1] || 'none'));
    leg(top.log && top.log.length === 1 && top.log[0].in_ms >= 0 && top.log[0].in_ms < 700 && !top.err, 'E3 THE SHELL BOOKS THE RECORDING ON THE NEXT BEAT AND TELLS THE MAP', JSON.stringify(top));
    leg(d.errs.length === 0, 'E4 0 PAGE ERRORS', d.errs[0] || '');
  } finally { try { await d.browser.close(); } catch (_e) {} try { d.server.close(); } catch (_e) {} }
}

(async () => {
  console.log('THE TOWN YOU DID NOT DEFEND (rule 353, asks 367 and 370)');
  try { words(); await firstMinute(); sound(); wiring(); await card(); if (process.argv.includes('--live')) await live(); }
  catch (e) { fail++; console.log('  FAIL the gate itself: ' + String(e && e.stack || e).slice(0, 300)); }
  console.log((fail ? 'RED' : 'GREEN') + ' ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
