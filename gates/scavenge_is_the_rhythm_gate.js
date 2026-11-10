#!/usr/bin/env node
/* ============================================================================
   SCAVENGE IS THE RHYTHM (SCAVENGE 2, 11/10/26; VAMILY rule 444(c), ask line 570. PAOLO 11/10: 'the scavenge mini game needs a
   little more love. I feel the skeleton, I appreciate it, but it's not rhythm based; out of everything I want that to be the most
   rhythm based minigame'. The skeleton is SCAVENGE's (11/7, rule 426(b), his YES); this gate takes over from
   graveyard/scavenge_on_the_dial_11_10_26/ and keeps its legs that are still true (the board, the spots, the glass, the demo).
   Record: records/BOHEMIA_SCAVENGE_TWO_THE_BLOCK_PLAYS_THE_SONG_11_10_26.md.
   What it holds:
     D1 THE DIAL IS STILL THE OLD FIGHT'S OWN: engine/bohemia_dial.js is the alpha's stamped engine (COMBAT_B64) byte for byte.
     K1 THE SKELETON'S FINDS: one thing or nothing, what the place holds (a house meds / food / tape, the ground batteries / rounds
        / tape, a car a battery / food / tape), six spots at most, greedMult 1.
     K2 THE DIAL'S OWN BANDS JUDGE A TAP: his touch, ms from the beat, is the bead's angle from the middle of the track; the old
        fight's zoneOf names the band. At HARD the bands are the dial's own (48 / 115 / 248 ms); a package only scales them.
     K3 EVERY SPOT IS A PHRASE OF FOUR TO EIGHT BEATS ON THE 120 GRID: every row of every package; a house taps on the beat; the
        detector's answer is its call a bar later, note for note; a gulp is pressed and let go on the grid; a spot is under 8 s.
     K4 THE FIND IS AS GOOD AS HIS TIMING: all dead on the best thing, worse timing never a better find, a mash pays less.
     K5 THE ALLOWANCE: a thumb steadily late is judged as if on time from its third tap, inside its limits; a wild tap moves nothing.
     K6 NOTHING HE DID NOT APPROVE (rule 331): no greed, no noise meter, nobody comes; the combo never changes a find.
     K7 NO SAND, NO VOICE: the page makes its sounds from oscillators (struck things), never a noise buffer, never speech.
     B1 THE BLOCK'S OWN BOARD and B2 THE MAP PICKS THE SPOTS (the skeleton's legs, kept).
     P1 PLAYED WITH A FINGER ON THE BEAT, ON A PHONE: every spot of a block tapped, every beat touched at its time (real touch
        events carrying the glass's own time stamp): every note DEAD ON, every find the best thing there, the combo across spots
        the count of his notes; every beat on the 120 grid and every phrase from a half-bar line.
     P2 WORSE TIMING, A WORSE FIND: a thumb 170 ms each side of the beat gets scraps; no thumb gets nothing; a mash gets less
        than dead centre.
     P3 THE ALLOWANCE ON THE PAGE: a thumb 150 ms late every time is DEAD ON from the fourth tap and the page says its lag.
     P4 THE BEAT IS SEEN: at a beat's time its bead is on the middle of the track (a pixel read off the glass), two beats before
        it is at the track's end; the crew's drawing changes inside every beat; with the audio taken away the block plays the same.
     P5 THE SOUND IS BOOKED ON THE PICTURE: every sound booked ahead is booked for the audio clock time that is HEARD at its beat
        (read back through the context's own output stamp), none late.
     B5 THE GLASS: upright, on its side, a laptop: nothing scrolls, spots on the glass and clear of the plate, LEAVE a thumb box,
        the man the fight's ~100 pt man; and the dial's middle and its coming-in end are on the glass for every spot.
     F1 SIXTY FRAMES: a block played at 1x and at a phone-shaped CPU (4x): the page's own work a frame (the budget is 16.7 ms).
     B6 ON THE REAL PAGE, THE DEMO AND THE ALPHA, A PHONE BOTH WAYS: a town's lot, 'Search the lot', the game on the block's own
        board, and never by the tap on the lot alone; its clock is the shell's ONE BEAT and its notes the playing song's own root and scale; a spot played on the beat is
        dead centre; the town's screen draws nothing while the game covers it; LEAVE; the find paid on the town's screen and said by YOU.
     M  PLANTED FAILS: each check is run once on a planted wrong thing and must go red.
   Run: node gates/scavenge_is_the_rhythm_gate.js [--shots DIR] [--no-real] [--only demo|alpha] [--shape phone_portrait|phone_landscape]
        (the bench legs about two minutes; each real page two to four more)
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SHOTS = arg('--shots', null), NO_REAL = process.argv.includes('--no-real') || process.argv.includes('--no-demo'), ONLY = arg('--only', null), SHAPE = arg('--shape', null);
let pass = 0, fail = 0;
const ok = (name, good, why) => { good ? pass++ : fail++; console.log((good ? '  ok   ' : '  FAIL ') + name + (why !== undefined ? '  [' + String(why).slice(0, 460) + ']' : '')); return good; };
const caught = (name, red) => ok('PLANTED: ' + name + ' goes red', red === false, red === false ? 'caught' : 'NOT CAUGHT: the check passed a planted wrong thing');

const D = require(path.join(ROOT, 'engine/bohemia_dial.js'));
const R = require(path.join(ROOT, 'slices/bohemia_scavenge_game.js'));
const PAGE = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SCAVENGE.html'), 'utf8'), RULES = fs.readFileSync(path.join(ROOT, 'slices/bohemia_scavenge_game.js'), 'utf8');
const code = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\/.*$/gm, '');

/* ------------------------------------------------------------------ the node legs */
/* D1 (kept from SCAVENGE ON THE DIAL): the dial module the bands come from is the old fight's own stamped engine, byte for byte */
function stampedEngine() {
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const m = alpha.match(/const COMBAT_B64='([A-Za-z0-9+/=]+)'/); if (!m) return null;
  const html = Buffer.from(m[1], 'base64').toString('utf8');
  const a = html.indexOf('<!-- ENGINE START'), b = html.indexOf('<!-- ENGINE END');
  if (a < 0 || b < 0) return null;
  const block = html.slice(html.indexOf('<script>', a) + '<script>'.length, html.lastIndexOf('</script>', b));
  return block.replace(/\bBohemiaEngine\b/g, 'BohemiaDial').trim();
}
function d1(mod, stamped) { return !!stamped && stamped.length > 20000 && mod.indexOf(stamped) >= 0; }
const MOD = fs.readFileSync(path.join(ROOT, 'engine/bohemia_dial.js'), 'utf8'), STAMPED = stampedEngine();
ok('D1 the dial is still the old fight\'s own engine, byte for byte (the alpha\'s stamped copy, renamed BohemiaDial): its bands are the judge', d1(MOD, STAMPED), STAMPED ? STAMPED.length + ' chars of engine' : 'no stamped engine in the alpha');
caught('D1, one pattern\'s phase changed in the module', d1(MOD.replace('snap:0.4165', 'snap:0.4166'), STAMPED));
function findsRight(Rr) {
  const want = { house: ['medicine', 'food', 'tape'], ground: ['battery', 'ammo', 'tape'], car: ['battery', 'food', 'tape'] };
  for (const k of Object.keys(want)) { const s = { kind: k, id: k + ':0,0' };
    const got = ['kill', 'vital', 'hit', 'miss'].map(z => Rr.result(s, z));
    if (got[0].got !== want[k][0] || got[1].got !== want[k][1] || got[2].got !== want[k][2] || got[3].got !== null) return false;
    if (got.some(r => r.greedMult !== 1 || Array.isArray(r.got))) return false; }
  return Rr.MAX_SPOTS === 6;
}
ok('K1 the skeleton\'s finds: one thing or nothing, what the place holds, six spots at most, greedMult 1', findsRight(R));
caught('K1, a dead centre that pays a pile', findsRight(Object.assign({}, R, { result: (s, z) => Object.assign(R.result(s, z), { got: z === 'kill' ? ['battery', 'battery'] : R.result(s, z).got }) })));

function judgeRight(Rr) {
  const bad = [], W = D.defaultState().W, per = Rr.RIDE_BEATS * Rr.BEAT_MS / D.K.LIM;
  const hard = Rr.windowsMs(2);
  if (Math.abs(hard.kill - W.hZ * per) > 0.01 || Math.abs(hard.vital - W.vZ * per) > 0.01 || Math.abs(hard.hit - W.hitZ * per) > 0.01) bad.push('HARD is not the dial\'s own bands');
  if (Math.abs(hard.kill - 47.75) > 0.5 || Math.abs(hard.vital - 114.6) > 0.5 || Math.abs(hard.hit - 248.3) > 0.5) bad.push('the bands in ms moved: ' + JSON.stringify(hard));
  for (const pkg of [0, 1, 2, 3, 4]) { const k = Rr.WINDOW[pkg];
    for (let ms = -420; ms <= 420; ms += 7) { const j = Rr.judge(ms, pkg), a = ms / (Rr.RIDE_BEATS * Rr.BEAT_MS) * D.K.LIM * D.K.ARC_MULT, z = D.zoneOf({ angle: a / k });
      if (j.zone !== z) { bad.push('pkg ' + pkg + ' at ' + ms + ' ms: ' + j.zone + ' not ' + z); break; } }
    if (pkg && !(Rr.windowsMs(pkg).kill < Rr.windowsMs(pkg - 1).kill)) bad.push('package ' + pkg + ' is not tighter than ' + (pkg - 1)); }
  if (Rr.judge(0, 1).zone !== 'kill' || Rr.judge(900, 0).zone !== 'miss') bad.push('the ends');
  if (!(Rr.windowsMs(1, Rr.RELEASE_SLACK).hit > Rr.windowsMs(1).hit && Rr.FIRST_SLACK > 1)) bad.push('a let-go or the first beat is not wider');
  return bad;
}
{ const b = judgeRight(R); ok('K2 the dial\'s own bands judge a tap: at HARD 48 / 115 / 248 ms each side of the beat, a package only scales them, every ms of every package the dial\'s zone', b.length === 0, b[0] || 'NORMAL ' + ['kill', 'vital', 'hit'].map(z => Math.round(R.windowsMs(1)[z])).join(' / ') + ' ms');
  caught('K2, a judge that pays dead centre wherever the bead is', judgeRight(Object.assign({}, R, { judge: (ms, p) => Object.assign(R.judge(ms, p), { zone: 'kill' }) })).length === 0); }

function phrasesRight(Rr) {
  const bad = []; let n = 0, longest = 0;
  for (const kind of ['house', 'ground', 'car']) for (const pkg of [0, 1, 2, 3, 4]) {
    const pool = Rr.PHRASES[kind][pkg]; if (!pool || !pool.length) { bad.push(kind + ' ' + pkg + ' has no phrase'); continue; }
    for (let i = 0; i < pool.length; i++) {
      let pick = 0; const r = () => (pick++ === 0 ? (i + 0.5) / pool.length : 0.37), P = Rr.phrase(kind, pkg, r, Rr.SONG), tag = kind + ' ' + pkg + ' #' + i; n++;
      if (!(P.beats >= 4 && P.beats <= 8)) bad.push(tag + ' is ' + P.beats + ' beats');
      if (!P.notes.length) bad.push(tag + ' has no beat to play');
      P.notes.forEach(q => { if (Math.abs(q.b * 2 - Math.round(q.b * 2)) > 1e-9 || q.b < 0 || q.b >= P.beats) bad.push(tag + ' a beat off the grid at ' + q.b);
        if (!(q.hz > 40 && q.hz < 4000)) bad.push(tag + ' a note at ' + q.hz + ' hz');
        if (Math.abs((q.b - q.born) - (P.lead)) > 1e-9 && kind !== 'ground') bad.push(tag + ' a beat that does not come in the lead');
        if (Rr.beadAt(q, q.b).u !== 1 || Rr.beadAt(q, q.b - Rr.RIDE_BEATS).u !== 0) bad.push(tag + ' a bead not in the middle on its beat'); });
      if (kind === 'house') { const on = P.notes.filter(q => q.b === Math.round(q.b)).length; if (on * 2 < P.notes.length || !P.notes.some(q => q.b === 0)) bad.push(tag + ' is not taps on the beat');
        if (pkg === 0 && on !== P.notes.length) bad.push(tag + ' EASY has an off beat'); }
      if (kind === 'ground') { if (P.call.length !== P.notes.length) bad.push(tag + ' the answer is not the call');
        P.call.forEach((c, j) => { const q = P.notes[j]; if (Math.abs(c.b + P.beats - q.b) > 1e-9 || c.hz !== q.hz) bad.push(tag + ' beep ' + j + ' is not answered a bar later on its own note'); if (q.born !== c.b) bad.push(tag + ' a bead not born on its beep'); }); }
      if (kind === 'car') { if (P.notes.length !== P.holds.length * 2) bad.push(tag + ' a gulp without both ends');
        P.holds.forEach((h, j) => { if (!(h[1] - h[0] >= 0.5) || (j && h[0] < P.holds[j - 1][1] + 0.5)) bad.push(tag + ' gulp ' + j + ' ' + h.join('-')); }); }
      const secs = (P.lead + 2 + P.beats) * Rr.BEAT_MS / 1000 + 1;   /* the wait for the half-bar line at its worst, the lead, the phrase, a walk of two tiles */
      if (secs > longest) longest = secs;
      if (pkg <= 1 && secs > 8.01) bad.push(tag + ' takes ' + secs + ' s at its slowest');
    } }
  if (Rr.BPM !== 120 || Rr.BEAT_MS !== 500) bad.push('not 120 BPM');
  return { bad, n, longest };
}
{ const p = phrasesRight(R); ok('K3 every spot is a phrase of four to eight beats on the 120 grid: a house on the beat, the detector answered a bar later note for note, a gulp pressed and let go on the grid, a spot under 8 s',
    p.bad.length === 0, p.bad[0] || p.n + ' phrases; EASY and NORMAL at their slowest ' + p.longest.toFixed(1) + ' s or less a spot');
  const long = JSON.parse(JSON.stringify(R.PHRASES)); long.house[1] = ['x.x.x.x.x.x.x.x.x.x.x.x.'];
  caught('K3, a house phrase of twelve beats', phrasesRight(Object.assign({}, R, { PHRASES: long, phrase: (k, p, r, s) => { const keep = R.PHRASES.house[1]; R.PHRASES.house[1] = long.house[1]; try { return R.phrase(k, p, r, s); } finally { R.PHRASES.house[1] = keep; } } })).bad.length === 0); }

function scoreRight(Rr) {
  const bad = [], Z = ['kill', 'vital', 'hit', 'miss'], rank = { kill: 3, vital: 2, hit: 1, miss: 0 };
  Z.forEach(z => { if (Rr.score([z, z, z, z], 0).zone !== z) bad.push('four ' + z + ' is not ' + z); });
  let s = 7; const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = 0; i < 400 && !bad.length; i++) { const n = 2 + Math.floor(rnd() * 9), zs = []; for (let j = 0; j < n; j++) zs.push(Z[Math.floor(rnd() * 4)]);
    const a = Rr.score(zs, 0), k = Math.floor(rnd() * n), worse = zs.slice(); worse[k] = Z[Math.min(3, Z.indexOf(zs[k]) + 1)];
    if (rank[Rr.score(worse, 0).zone] > rank[a.zone]) bad.push('a worse tap, a better find: ' + zs.join(',') + ' at ' + k);
    if (rank[Rr.score(zs, 2).zone] > rank[a.zone]) bad.push('strays raised a find'); }
  if (rank[Rr.score(['kill', 'kill', 'kill', 'kill'], 8).zone] >= 3) bad.push('a mash still pays dead centre');
  if (Rr.score(['kill', 'kill', 'kill', 'kill'], 1).zone !== 'kill') bad.push('one stray tap cost a clean phrase its find');
  return bad;
}
{ const b = scoreRight(R); ok('K4 the find is as good as his timing: all dead on the best thing, a worse tap never a better find (400 phrases), a mash pays less, one stray forgiven', b.length === 0, b[0]);
  caught('K4, a score that forgets the strays', scoreRight(Object.assign({}, R, { score: (z, n) => R.score(z, 0) })).length === 0); }

function lagRight(Rr) {
  const bad = [];
  if (Rr.lagOf([], 0) !== 0 || Rr.lagOf([150, 150], 0) !== 0) bad.push('it moved before the third tap');
  if (Rr.lagOf([150, 148, 152], 0) !== 150) bad.push('a steady 150 is not learned at the third');
  if (Math.abs(Rr.lagOf([0, 2, -3, 400, 1], 0)) > 2) bad.push('one wild tap moved it');
  if (Math.abs(Rr.lagOf([150, 151, 149, 150, 152, 148, 150, 450], 0) - 150) > 30) bad.push('one wild tap lost a steady thumb its allowance');
  if (Rr.lagOf([900, 900, 900], 0) !== Rr.LAG.MAX || Rr.lagOf([-900, -900, -900], 0) !== Rr.LAG.MIN) bad.push('no limit');
  if (Rr.lagOf([10], 120) !== 120) bad.push('the last visit\'s lag is not where it starts');
  if (Rr.lagOf([170, -170, 170], 0) !== 0 || Rr.lagOf([170, -170, 170, -170, 170], 0) !== 0) bad.push('a wild thumb was read as a lag');
  const taps = [150, 150, 150, 150]; let lag = 0, seen = []; const got = [];
  taps.forEach(t => { got.push(Rr.judge(t - lag, 1).zone); seen.push(t); lag = Rr.lagOf(seen, 0); });
  if (got[3] !== 'kill') bad.push('a thumb 150 ms late is not dead on by its fourth tap: ' + got.join(','));
  return bad;
}
{ const b = lagRight(R); ok('K5 the allowance: a steady lag is taken out from the third tap, one wild tap moves nothing, a wild thumb is not read as a lag, inside ' + R.LAG.MIN + ' to ' + R.LAG.MAX + ' ms, the last visit\'s lag kept', b.length === 0, b[0]);
  caught('K5, an allowance that never learns', lagRight(Object.assign({}, R, { lagOf: () => 0 })).length === 0); }

function noExtras(txt) { return !/greed(?!Mult)|noise ?meter|theyCome|they_come|hoursPerSearch|districtLoot/i.test(txt); }
function comboNeverPays(Rr) { const s = { kind: 'house', id: 'house:0,0' }; return Rr.result(s, 'hit', { combo: 99 }).got === Rr.result(s, 'hit').got && Rr.score.length === 2 && Rr.findOf.length === 2; }
ok('K6 nothing he did not approve (rule 331): no greed, no noise meter, nobody coming; the combo never changes a find', noExtras(code(PAGE)) && noExtras(code(RULES)) && comboNeverPays(R));
caught('K6, a page that holds the greed', noExtras(code(PAGE) + '\nG.greedHeld = true;'));
caught('K6, a find that reads the combo', comboNeverPays(Object.assign({}, R, { result: (s, z, x) => Object.assign(R.result(s, z, x), { got: x && x.combo > 8 ? 'battery' : R.result(s, z, x).got }) })));

function noSand(txt) { return /createOscillator\(/.test(txt) && !/createBuffer\(|createBufferSource\(|AudioBuffer|Math\.random\(\)\s*\*\s*2\s*-\s*1|speechSynthesis|SpeechSynthesisUtterance|new Audio\(|<audio/i.test(txt); }
ok('K7 no sand, no voice: every sound of the page is an oscillator bank (a struck thing), never a noise buffer, never speech or a recording of one', noSand(code(PAGE)));
caught('K7, a page with a burst of noise in it', noSand(code(PAGE) + '\nvar n = A.createBuffer(1, 4410, 44100);'));

/* ------------------------------------------------------------------ the browser legs */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain', '.webmanifest': 'application/json' };
function serve() {
  return new Promise(r => { const s = http.createServer((q, res) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); }).listen(0, '127.0.0.1', () => r(s)); });
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };
async function bench(br, base, kind, ctxOpts, q, init) {
  const ctx = await br.newContext(ctxOpts || PHONE); if (init) await ctx.addInitScript({ content: init });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  await p.goto(base + '/slices/BOHEMIA_SCAVENGE.html?bench=' + kind + '&seed=11' + (q || ''));
  await p.waitForFunction(() => window.SCAV && ['play', 'empty', 'failed', 'closed'].includes(window.SCAV.phase), null, { timeout: 90000 });
  await p.waitForTimeout(400);
  return { p, ctx, errs, st: await p.evaluate(() => SCAV.state()) };
}
/* the board the fight itself deals for the bench's options (the camp mode's die: o.deal, else 1) */
async function directDeals(br, base, kinds) {
  const ctx = await br.newContext({ viewport: { width: 480, height: 320 } }); const p = await ctx.newPage();
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; });
  await p.goto(base + '/slices/BOHEMIA_FIGHT.html');
  await p.waitForFunction(() => { try { return !!eval('FIGHT').S.board; } catch (e) { return false; } }, null, { timeout: 120000 });
  const out = {};
  for (const k of kinds) out[k] = await p.evaluate((k) => { const F = eval('FIGHT'); eval('SEED = 1');
    F.setup({ seed: 11, kind: k, district: k, night: false, deploy: false, odds: false, teach: false, keep: false, resume: false });
    const S = F.S, sig = []; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) sig.push(S.terrain[y][x] + '/' + (S.cover[y][x] || ''));
    return { name: S.boardDef.name, sig: sig.join(',') }; }, k);
  await ctx.close(); return out;
}
function sigOf(board) { const a = []; for (let y = 0; y < board.h; y++) for (let x = 0; x < board.w; x++) { const t = board.tiles[y][x]; a.push(t.terr + '/' + (t.cover || '')); } return a.join(','); }
function spotsRight(st, board) {
  const bad = [], S = st.spots;
  if (S.length > 6) bad.push('more than six');
  S.forEach(s => { const t = board.tiles[s.y][s.x], sd = board.tiles[s.sy][s.sx];
    if (s.kind === 'house' && !R.houseAt(t)) bad.push(s.id + ' is no house');
    if (s.kind === 'car' && !R.carAt(t)) bad.push(s.id + ' has no car');
    if (s.kind === 'ground' && !R.dirt(t)) bad.push(s.id + ' is not dirt (' + t.terr + ', luma ' + t.luma + ')');
    if (!R.openTile(sd)) bad.push(s.id + ' stands on a closed tile');
    if (Math.abs(s.sx - s.x) + Math.abs(s.sy - s.y) > 1) bad.push(s.id + ' stand not beside it'); });
  for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) if (Math.abs(S[i].x - S[j].x) + Math.abs(S[i].y - S[j].y) <= 1) bad.push(S[i].id + ' beside ' + S[j].id);
  return bad;
}
async function glassRight(p) {
  return p.evaluate(() => { const de = document.documentElement, P = document.getElementById('plate').getBoundingClientRect(), L = document.getElementById('leave').getBoundingClientRect(), st = SCAV.state();
    const bad = []; if (de.scrollHeight > innerHeight + 1 || de.scrollWidth > innerWidth + 1 || document.body.scrollHeight > innerHeight + 1) bad.push('the page scrolls ' + de.scrollWidth + 'x' + de.scrollHeight);
    [...document.querySelectorAll('*')].forEach(el => { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)) bad.push('scroller ' + (el.id || el.tagName)); });
    if (P.right > innerWidth + 0.5 || P.bottom > innerHeight + 0.5 || P.left < 0 || P.top < 0) bad.push('the plate off the glass');
    if (L.height < 44) bad.push('LEAVE ' + Math.round(L.height) + ' tall');
    st.spots.forEach(s => { if (s.px < 0 || s.py < 0 || s.px > innerWidth || s.py > innerHeight) bad.push(s.id + ' off the glass'); if (s.px > P.left - 20 && s.py > P.top - 40) bad.push(s.id + ' under the plate');
      const G = SCAV.geoAt(s.id); [['the dial\'s middle', G.mid], ['the end the beats come in at', G.end]].forEach(q => { if (q[1].x < 6 || q[1].y < 6 || q[1].x > innerWidth - 6 || q[1].y > innerHeight - 6) bad.push(s.id + ' ' + q[0] + ' off the glass'); }); });
    return bad; });
}

/* A FINGER, TIMED: real touch events through the browser's own touch pipe, each carrying the time the glass felt it (a phone
   stamps a touch when it happens; the page judges on that stamp). plan(note) gives the ms off the beat to touch at, or null to
   leave the beat alone. Returns what the page settled. frame: the game's frame; xy: a point on the glass that is not the plate. */
async function finger(cdp, frame, origin) {
  const touch = (type, x, y, at) => cdp.send('Input.dispatchTouchEvent', Object.assign({ type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] }, at != null ? { timestamp: (origin + at) / 1000 } : {}));
  const waitTo = at => frame.evaluate(at => new Promise(r => { const f = () => { const d = at - performance.now(); d <= 1 ? r() : setTimeout(f, Math.min(d, 40)); }; f(); }), at);
  return { touch, waitTo };
}
async function playSpot(F, frame, s, at, plan, hooks) {
  const off = at.off || { x: 0, y: 0 };
  await F.touch('touchStart', off.x + s.px, off.y + s.py); await F.touch('touchEnd');
  for (let i = 0; i < 200; i++) { if (await frame.evaluate(() => !!(SCAV.act && SCAV.act.phase === 'phrase'))) break; await new Promise(r => setTimeout(r, 40)); }
  const a = (await frame.evaluate(() => SCAV.state())).act; if (!a) return null;
  if (hooks && hooks.opened) await hooks.opened(a);
  let idx = 0;
  for (const n of a.notes) { const d = plan(n, idx++, a); if (d == null) continue;
    await F.waitTo(n.at + d + 2);
    if (n.type === 'up') await F.touch('touchEnd', 0, 0, n.at + d);
    else { await F.touch('touchStart', at.x, at.y, n.at + d); if (n.type === 'tap') await F.touch('touchEnd'); } }
  for (let i = 0; i < 200; i++) { if (await frame.evaluate(() => !SCAV.act)) break; await new Promise(r => setTimeout(r, 40)); }
  await F.touch('touchEnd').catch(() => {});
  return a;
}
const notesOf = st => st.log.filter(l => l.t === 'note');

(async () => {
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port;
  const { chromium } = require('playwright'); const br = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    /* B1 + B2: the skeleton's board and spots */
    const KINDS = ['suburb', 'strip', 'downtown', 'desert'];
    const direct = await directDeals(br, base, KINDS);
    const kinds = {}; const sameB = [], spotBad = [], perBoard = [];
    for (const k of KINDS) {
      const B = await bench(br, base, k, Object.assign({}, PHONE, { deviceScaleFactor: 1 }));
      const board = await B.p.evaluate(() => SCAV.board);
      sameB.push(k + ':' + (board.name === direct[k].name && sigOf(board) === direct[k].sig ? 'same' : 'DIFFERENT (' + board.name + ' vs ' + direct[k].name + ')'));
      const bad = spotsRight(B.st, board); spotBad.push.apply(spotBad, bad.map(x => k + ' ' + x));
      const C = R.candidates(board, R.centroid(board.crew)), has = { house: C.house.length > 0, ground: C.ground.length > 0, car: C.car.length > 0 };
      const ks = {}; B.st.spots.forEach(s => { ks[s.kind] = (ks[s.kind] || 0) + 1; });
      Object.keys(ks).forEach(kk => { if (!has[kk]) spotBad.push(k + ' lit a ' + kk + ' the board has none of'); });
      kinds[k] = { st: B.st, board };
      perBoard.push(k + ' ' + B.st.spots.length + ' (' + Object.keys(ks).map(kk => kk + ' ' + ks[kk]).join(', ') + ')' + (B.errs.length ? ' ERR ' + B.errs[0] : ''));
      await B.ctx.close();
    }
    ok('B1 the block\'s own board: on a phone the page\'s board is the very board the fight deals for those options', sameB.every(x => /same$/.test(x)), sameB.join(' '));
    ok('B2 the map picks the spots: each a house\'s roof, a dead car or open dirt (never the asphalt) on that board, its stand open, six at most, none side by side, a kind only where the board has it',
      spotBad.length === 0 && KINDS.every(k => kinds[k].st.spots.length >= 3), spotBad.slice(0, 4).join('; ') || perBoard.join(' | '));
    { const st = JSON.parse(JSON.stringify(kinds.suburb.st)), b = kinds.suburb.board; let hx = null;
      for (let y = 0; y < b.h && !hx; y++) for (let x = 0; x < b.w; x++) if (R.houseAt(b.tiles[y][x])) { hx = [x, y]; break; }
      st.spots.push({ id: 'car:planted', kind: 'car', x: hx[0], y: hx[1], sx: hx[0], sy: hx[1] + 1 });
      caught('B2, a siphon lit on a house with no car', spotsRight(st, b).length === 0); }

    /* P1: a whole block on the beat. P4's pixel reads and P5's audio read ride the same play. */
    const run = async (kind, plan, o) => {
      o = o || {}; const B = await bench(br, base, kind, o.ctx || PHONE, o.q, o.init), cdp = await B.ctx.newCDPSession(B.p);
      if (o.throttle) await cdp.send('Emulation.setCPUThrottlingRate', { rate: o.throttle });
      const F = await finger(cdp, B.p, await B.p.evaluate(() => performance.timeOrigin)), vp = B.p.viewportSize(), at = { x: Math.round(vp.width * 0.42), y: Math.round(vp.height * 0.6) };
      await B.p.evaluate(() => { SCAV.perf = { n: 0, work: 0, worst: 0, over20: 0, over34: 0, gap: 0 }; });
      const acts = []; const spots = o.spots ? B.st.spots.slice(0, o.spots) : B.st.spots;
      for (const s of spots) { const a = await playSpot(F, B.p, s, at, plan, o.hooks ? o.hooks(B.p) : null); if (a) acts.push(a); }
      const st = await B.p.evaluate(() => SCAV.state());
      const extra = o.after ? await o.after(B.p) : null;
      if (SHOTS && o.shot) await B.p.screenshot({ path: path.join(SHOTS, o.shot) });
      await B.ctx.close(); return { st, acts, errs: B.errs, extra };
    };
    /* the pixel reads of P4: at a beat's time its bead is on the middle of the track; the crew's drawing moves inside a beat */
    const seen = { mid: [], end: [], crew: [] };
    const hooks = (p) => ({ opened: async (a) => {
      if (seen.mid.length >= 3) return;
      const n = a.notes[0], bm = 500;
      const read = (at, u) => p.evaluate(([at, u]) => new Promise(res => { const f = () => { if (performance.now() < at) return requestAnimationFrame(f);
        requestAnimationFrame(() => { const S = SCAV, G = S.act && S.act.geo; if (!G) return res(null); const cv = document.getElementById('g'), k = cv.width / innerWidth, span = 1.1623892818282235, tr = G.R * 0.97;
          const ang = (G.up ? -Math.PI / 2 : Math.PI / 2) + G.s * (1 - u) * span, x = Math.round((G.cx + Math.cos(ang) * tr) * k), y = Math.round((G.cy + Math.sin(ang) * tr) * k);
          const d = cv.getContext('2d').getImageData(x - 2, y - 2, 5, 5).data; let paper = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 235 && d[i + 1] > 225 && d[i + 2] > 190 && d[i + 3] > 200) paper++;
          res({ paper, late: Math.round(performance.now() - at) }); }); }; f(); }), [at, u]);
      const crew = (at) => p.evaluate((at) => new Promise(res => { const f = () => { if (performance.now() < at) return requestAnimationFrame(f);
        requestAnimationFrame(() => { const cv = document.getElementById('g'), S = SCAV, m = S.men.filter(q => !q.busy)[0], V = S.view, k = cv.width / innerWidth, fx = (m.x + 0.5 - V.x) * V.T, fy = (m.y + 0.9 - V.y) * V.Th;
          const d = cv.getContext('2d').getImageData(Math.round((fx - 30) * k), Math.round((fy - 105) * k), Math.round(60 * k), Math.round(110 * k)).data; let h = 0; for (let i = 3; i < d.length; i += 16) h = (h * 31 + d[i] + d[i - 1]) >>> 0; res(h); }); }; f(); }), at);
      seen.end.push(await read(n.at - 2 * bm + 30, 0.03)); seen.crew.push([await crew(n.at - 1.5 * bm + 40), await crew(n.at - 1.5 * bm + 300)]);
      seen.mid.push(await read(n.at - 8, 1 - 8 / 1000));
    } });
    const audioRead = (p) => p.evaluate(() => { const S = SCAV, o = S.out; if (!o || !o.AC || o.AC.state !== 'running') return { none: true, state: o && o.AC ? o.AC.state : 'no context' };
      const ts = o.AC.getOutputTimestamp(), bk = S.booked.slice(), c = S.clk; let worst = 0, late = 0, onGrid = 0, n = 0;
      bk.forEach(b => { if (b.rel) return; n++; const heardAt = ts.performanceTime + (b.ctx - ts.contextTime) * 1000, e = Math.abs(heardAt - b.at); if (e > worst) worst = e; if (b.late) late++;
        const g = (b.at - c.t0) / (c.bm / 4); if (Math.abs(g - Math.round(g)) < 0.02) onGrid++; });
      return { n, worst: +worst.toFixed(2), late, onGrid, heard: S.heard, lat: S.lat }; });
    const on = await run('suburb', () => 0, { hooks, after: audioRead, shot: 'rhythm_played_on_the_beat.png' });
    const N = notesOf(on.st), grid = [], startsOnHalfBar = [];
    on.acts.forEach(a => { startsOnHalfBar.push(a.b0 % 2 === 0); a.notes.forEach(n => { const g = (n.at - on.st.clock.t0) / 250; grid.push(Math.abs(g - Math.round(g)) < 0.004); }); });
    const onRight = (r) => { const nn = notesOf(r.st); return r.st.finds.length === r.acts.length && r.st.finds.length >= 3 && nn.length > 0 && nn.every(l => l.zone === 'kill') && r.st.finds.every(f => f.zone === 'kill' && f.got === R.FINDS[f.kind].kill) && r.st.best === nn.length; };
    ok('P1 played with a finger on the beat, on a phone: six spots, every beat touched at its time (real touches, the glass\'s own time stamp), every note DEAD ON, every find the best thing there, the combo runs across the spots',
      onRight(on) && on.st.finds.length === 6 && !on.errs.length && !on.st.err, on.st.finds.map(f => f.kind + ':' + f.word + ':' + f.got).join(' ') + ' | ' + N.length + ' notes, worst ' + Math.max.apply(null, N.map(l => Math.abs(l.raw))) + ' ms off, combo ' + on.st.best + (on.errs[0] ? ' ERR ' + on.errs[0] : ''));
    ok('P1 every beat he is given is on the 120 grid (an eighth, 250 ms) of the page\'s clock and every phrase starts on a half-bar line', grid.length > 0 && grid.every(Boolean) && startsOnHalfBar.every(Boolean), grid.length + ' beats, ' + on.acts.map(a => a.row || JSON.stringify(a.holds)).join(' '));
    { const fake = JSON.parse(JSON.stringify(on)); fake.st.log.filter(l => l.t === 'note')[2].zone = 'hit'; caught('P1, one beat of the on-the-beat run graded blue', onRight(fake)); }

    /* P2: worse timing, a worse find */
    const wide = await run('suburb', (n, i) => (i % 2 ? -170 : 170), { spots: 2 });   /* a house and the detector (a let-go is judged wider: K2) */
    const none = await run('suburb', () => null, { spots: 2 });
    const mash = await bench(br, base, 'suburb'); let mashFind = null;
    { const cdp = await mash.ctx.newCDPSession(mash.p), F = await finger(cdp, mash.p, await mash.p.evaluate(() => performance.timeOrigin)), s = mash.st.spots.find(q => q.kind === 'house');
      await F.touch('touchStart', s.px, s.py); await F.touch('touchEnd'); await mash.p.waitForFunction(() => SCAV.act && SCAV.act.phase === 'phrase', null, { timeout: 15000 });
      const a = (await mash.p.evaluate(() => SCAV.state())).act, t0 = a.notes[0].at - 120, t1 = a.notes[a.notes.length - 1].at + 120;
      for (let t = t0; t <= t1; t += 83) { await F.waitTo(t + 1); await F.touch('touchStart', 160, 500, t); await F.touch('touchEnd'); }
      await mash.p.waitForFunction(() => !SCAV.act, null, { timeout: 15000 }); mashFind = (await mash.p.evaluate(() => SCAV.state())).finds[0]; await mash.ctx.close(); }
    const rank = { kill: 3, vital: 2, hit: 1, miss: 0 };
    const worseRight = (w, nn, m) => notesOf(w.st).slice(1).every(l => l.zone === 'hit') && w.st.finds.every(f => f.zone === 'hit' && f.got === 'tape') && nn.st.finds.length === 2 && nn.st.finds.every(f => f.zone === 'miss' && f.got === null) && notesOf(nn.st).every(l => l.zone === 'miss') && m && rank[m.zone] < 3 && m.strays >= 4;
    ok('P2 worse timing, a worse find: a thumb 170 ms each side of the beat gets every note blue (the first, the free one, amber) and scraps; no thumb gets nothing; a mash of twelve taps a second gets less than dead centre',
      worseRight(wide, none, mashFind), 'wide: ' + wide.st.finds.map(f => f.word + ':' + f.got).join(' ') + ' | none: ' + none.st.finds.map(f => f.word).join(' ') + ' | mash: ' + (mashFind ? mashFind.word + ' with ' + mashFind.strays + ' strays' : 'none'));
    caught('P2, the wide thumb paid like the one on the beat', worseRight(on, none, mashFind));

    /* P3: the allowance on the page */
    const lateRun = await run('suburb', () => 150, { spots: 3 });
    const LN = notesOf(lateRun.st), lagRightOnPage = (ln, lag) => ln.length >= 8 && ln.slice(3).every(l => l.zone === 'kill') && Math.abs(lag - 150) <= 3;
    ok('P3 the allowance on the page: a thumb 150 ms late every time is DEAD ON from the fourth tap, and the page reads his lag as 150', lagRightOnPage(LN, lateRun.st.lag), LN.map(l => l.word + '(' + l.ms + ')').join(' ') + ' | lag ' + lateRun.st.lag);
    caught('P3, a page whose late thumb stayed late', lagRightOnPage(notesOf(wide.st), wide.st.lag));

    /* P4: the beat is seen */
    const seenRight = (sn) => sn.mid.length >= 3 && sn.mid.every(q => q && q.paper >= 6) && sn.end.every(q => q && q.paper >= 6) && sn.crew.every(c => c[0] !== c[1]);
    ok('P4 the beat is seen: at a beat\'s time its bead is on the middle of the track and two beats before at the track\'s end (pixels read off the glass, three spots); the crew\'s drawing changes inside a beat',
      seenRight(seen), 'middle ' + seen.mid.map(q => q ? q.paper + '/25 px' : 'none').join(' ') + ' | end ' + seen.end.map(q => q ? q.paper + '/25' : 'none').join(' ') + ' | crew ' + seen.crew.map(c => c[0] !== c[1] ? 'moved' : 'STILL').join(' '));
    caught('P4, a track with no bead on its middle at the beat', seenRight({ mid: seen.mid.map(() => ({ paper: 0 })), end: seen.end, crew: seen.crew }));
    const mute = await run('suburb', () => 0, { spots: 3, init: 'try { delete window.AudioContext; delete window.webkitAudioContext; window.AudioContext = undefined; window.webkitAudioContext = undefined; } catch (e) {}' });
    ok('P4 with the audio taken away (no sound at all) the block plays the same: every note DEAD ON, every find the best thing', onRight(mute) && mute.st.heard === 0 && !mute.errs.length, mute.st.finds.map(f => f.word + ':' + f.got).join(' ') + ', sounds made ' + mute.st.heard + (mute.errs[0] ? ' ERR ' + mute.errs[0] : ''));

    /* P5: the sound is booked on the picture */
    const au = on.extra || {};
    const audioRight = (a) => !a.none && a.n >= 20 && a.worst <= 6 && a.late === 0 && a.onGrid === a.n && a.heard > a.n;
    ok('P5 the sound is booked on the picture: every sound booked ahead is booked for the audio time that is heard at its beat (read back through the context\'s own output stamp), on the grid, none late',
      audioRight(au), au.none ? 'the audio context is ' + au.state : au.n + ' booked, worst ' + au.worst + ' ms off its beat as heard, ' + au.late + ' late, ' + au.onGrid + ' on the grid, ' + au.heard + ' sounds made, the way to the ear ' + au.lat + ' ms');
    caught('P5, a sound booked 40 ms after its beat', audioRight(Object.assign({}, au, { worst: 40 })));

    /* B5: the glass, three sizes */
    const sizes = [['phone upright', Object.assign({}, PHONE, { deviceScaleFactor: 1 })], ['phone on its side', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }], ['laptop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]];
    const gl = [];
    for (const [nm, o] of sizes) for (const kind of (nm === 'laptop' ? ['suburb'] : ['suburb', 'strip'])) { const B = await bench(br, base, kind, o); const bad = await glassRight(B.p); gl.push(nm + ' ' + kind + ': ' + (bad.length ? bad.join(', ') : 'clean, ' + B.st.spots.length + ' spots'));
      if (nm === 'phone upright' && kind === 'suburb') { await B.p.evaluate(() => { const d = document.createElement('div'); d.style.height = '3000px'; d.style.position = 'relative'; document.body.appendChild(d); document.documentElement.style.overflow = 'auto'; document.body.style.overflow = 'auto'; });
        caught('B5, a page that scrolls', (await glassRight(B.p)).length === 0); }
      await B.ctx.close(); }
    ok('B5 the glass: upright, on its side and a laptop, nothing scrolls, every spot on the glass and clear of the plate, LEAVE a thumb box, the man the fight\'s ~100 pt man, the dial\'s middle and its coming-in end on the glass for every spot',
      gl.every(x => /clean/.test(x)) && /MAN = 100 \/ 98/.test(PAGE), gl.join(' | '));
    const side = await run('suburb', () => 0, { spots: 3, ctx: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, shot: 'rhythm_on_its_side.png' });
    ok('B5 played on its side with a finger on the beat: every note DEAD ON', onRight(side) && !side.errs.length, side.st.finds.map(f => f.kind + ':' + f.word).join(' '));

    /* F1: sixty frames */
    const F1 = on.st.perf, slow = await run('suburb', () => 0, { spots: 4, throttle: 4 }), F4 = slow.st.perf;
    const inPhrase = (on.st.slow || []).filter(q => q.in === 'phrase' && q.work > 25);
    const framesRight = (a, b, slowIn) => a.n > 600 && a.work / a.n < 2 && a.over20 / a.n < 0.03 && b.n > 100 && b.work / b.n < 6 && !(slowIn || []).length;
    ok('F1 sixty frames: a whole block played at 1x, the page\'s own work ' + (F1.work / F1.n).toFixed(2) + ' ms a frame with ' + F1.over20 + ' of ' + F1.n + ' frames over 20 ms; on a phone-shaped CPU (4x) its own work ' + (F4.work / F4.n).toFixed(2) + ' ms a frame of the 16.7 (this box paints in software on the page\'s thread, a phone\'s GPU does not: ' + F4.over20 + ' of ' + F4.n + ' over 20 ms here)',
      framesRight(F1, F4, inPhrase) && onRight(slow), 'no frame of the page\'s work over 25 ms inside a phrase (every pose is cut out at the tap); worst frame of work ' + F1.worst.toFixed(1) + ' ms at 1x, ' + F4.worst.toFixed(1) + ' ms at 4x; at 4x every note still ' + (onRight(slow) ? 'DEAD ON' : 'NOT dead on'));
    caught('F1, a page that spends 9 ms a frame', framesRight(Object.assign({}, F1, { work: 9 * F1.n }), F4, inPhrase));
    caught('F1, a pose cut out in the middle of a phrase (a 60 ms frame)', framesRight(F1, F4, [{ in: 'phrase', work: 60 }]));

    /* B6: on the real page */
    if (!NO_REAL) {
      const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
      const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
      const cityOf = P => P.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url())), townOf = P => P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url())), gameOf = P => P.frames().find(f => /BOHEMIA_SCAVENGE\.html/.test(f.url()));
      const SURFS = ['demo', 'alpha'].filter(s => !ONLY || s === ONLY), SHAPES = ['phone_portrait', 'phone_landscape'].filter(s => !SHAPE || s === SHAPE);
      for (const surf of SURFS) for (const prof of SHAPES) {
        const tag = 'B6 ' + surf + ' ' + (prof === 'phone_portrait' ? 'upright' : 'on its side'); let note = 'not run', d = null;
        try {
          d = await drive.open({ profile: prof, alpha: surf === 'alpha', keepCards: true, beforeTap: async (pg) => {
            for (let i = 0; i < 400; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
            await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
          const P = d.page; await P.waitForTimeout(3000); await d.clearCards().catch(() => {}); await P.waitForTimeout(1200);
          const bases = await cityOf(P).evaluate(() => { const bs = ctBases(); return Object.keys(bs).map(n => ({ n, t: mapTierOf(n), x: bs[n].x, y: bs[n].y })); });
          const b = bases.find(q => q.n === 'Anarchists') || bases[0];
          await cityOf(P).evaluate(b => { city.x = b.x; city.y = b.y; loopOpenTown({ name: b.n, x: b.x, y: b.y, tier: b.t }); }, b);
          let sf = null; for (let i = 0; i < 160 && !sf; i++) { await P.waitForTimeout(250);
            for (const x of townOf(P)) if (await x.evaluate(n => { try { const S = BohemiaSettlement; return S.ready() && S.state.place && S.state.place.name === n && !document.getElementById('arrive') && S.picIn(); } catch (e) { return false; } }, b.n).catch(() => false)) sf = x;
            if (i === 40) await cityOf(P).evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); }
          if (!sf) throw new Error('the town ' + b.n + ' did not come up');
          const fb = await (await sf.frameElement()).boundingBox(); let btn = null, byItself = false;
          for (let k = 0; k < 6 && !btn; k++) { const q = await sf.evaluate(() => BohemiaSettlement.where('lot')).catch(() => null); if (q) await P.touchscreen.tap(fb.x + q.x, fb.y + q.y); await P.waitForTimeout(700);
            if (await sf.evaluate(() => !!document.getElementById('scavgame')).catch(() => false)) { byItself = true; break; }   /* one tap on the lot opens its sheet, never the game (the town's one tap, one answer) */
            btn = await sf.evaluate(() => { if (BohemiaSettlement.state.open !== 'lot') return null; const e = [...document.querySelectorAll('#sbody .act')].find(x => /Search the lot/.test(x.textContent || '')); if (!e || e.disabled) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }).catch(() => null); }
          if (byItself) throw new Error('a tap on the lot opened the game by itself: nothing was pressed (one tap, one answer)');
          if (!btn) throw new Error('no Search the lot button under a finger');
          await P.touchscreen.tap(fb.x + btn.x, fb.y + btn.y);
          let gf = null, st = null; for (let i = 0; i < 240; i++) { gf = gameOf(P); st = gf ? await gf.evaluate(() => window.SCAV && SCAV.state ? SCAV.state() : null).catch(() => null) : null; if (st && ['play', 'empty', 'failed'].includes(st.phase)) break; await P.waitForTimeout(250); }
          if (!st || st.phase !== 'play') throw new Error('the game did not start: ' + (st ? st.phase + ' ' + st.err : 'no page'));
          const shell = await P.evaluate(() => { try { const f = MUS.fac(), b = BOHEMIA_BEAT.now(); return { root: f.root, scale: Array.prototype.slice.call(f.scale), name: f.n, src: b.src, toBeat: b.msToBeat, beatMs: b.beatMs }; } catch (e) { return { err: String(e) }; } });
          /* the page's clock against the shell's ONE BEAT, both read in the same instant inside the game's own frame */
          const phase = await gf.evaluate(() => { const B = window.top.BOHEMIA_BEAT.now(), c = SCAV.clk, b = (performance.now() - c.t0) / c.bm, mine = (Math.ceil(b) - b) * c.bm, e = Math.abs(B.msToBeat - mine) % c.bm;
            return { drift: Math.min(e, c.bm - e), src: c.src, bar: ((Math.floor(b) % 4) + 4) % 4, shellBar: B.beatInBar }; });
          const drift = phase.drift;
          const gb = await (await gf.frameElement()).boundingBox(), cdp = await d.ctx.newCDPSession(P), F = await finger(cdp, gf, await gf.evaluate(() => performance.timeOrigin));
          const s = st.spots.find(q => q.kind === 'house') || st.spots[0];
          const a = await playSpot(F, gf, s, { x: Math.round(gb.x + gb.width * 0.42), y: Math.round(gb.y + gb.height * 0.6), off: { x: gb.x, y: gb.y } }, () => 0);
          if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'rhythm_in_the_' + surf + '_' + prof + '.png') });
          const mid = await gf.evaluate(() => SCAV.state()), f0 = mid.finds[0], nn = notesOf(mid);
          const rest0 = await sf.evaluate(() => window.__TOWN_RESTED | 0); await P.waitForTimeout(600); const rest1 = await sf.evaluate(() => window.__TOWN_RESTED | 0);
          const lv = await gf.evaluate(() => { const r = document.getElementById('leave').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
          await P.waitForTimeout(900); await P.touchscreen.tap(gb.x + lv.x, gb.y + lv.y); await P.waitForTimeout(900);
          const after = await sf.evaluate(() => { const logs = (window.__settleLog || []).filter(m => m.act === 'scavenge'); const say = document.querySelector('#sbody .say p');
            return { frame: !!document.getElementById('scavgame'), paid: logs.map(m => m.kind), say: say ? say.textContent : '', done: (window.__settleLog || []).filter(m => m.act === 'scavenge-done').length, rested: window.__TOWN_RESTED | 0 }; });
          await P.waitForTimeout(500); const rest3 = await sf.evaluate(() => window.__TOWN_RESTED | 0);
          const townRests = rest0 > 0 && rest1 > rest0 && rest3 === after.rested;   /* under the game the town draws nothing; the game gone, it draws again */
          const songIsHis = mid.song && mid.song.root === shell.root && JSON.stringify(mid.song.scale) === JSON.stringify(shell.scale), clockIsHis = phase.src !== 'own' && drift < 12 && phase.bar === phase.shellBar;
          const good = a && nn.length === a.notes.length && nn.every(l => l.zone === 'kill') && f0 && f0.zone === 'kill' && songIsHis && clockIsHis && townRests && !after.frame && after.done === 1 && after.paid.length === 1 && after.paid[0] === f0.got && after.say.length > 12;
          note = b.n + ': board ' + mid.board.name + (mid.board.laid ? ' (laid from the map)' : '') + ', ' + mid.spots.length + ' spots; the clock the shell\'s (' + phase.src + ', ' + drift.toFixed(1) + ' ms from its beat, beat ' + (phase.bar + 1) + ' of the bar against the shell\'s ' + (phase.shellBar + 1) + '); the song ' + shell.name + ' root ' + shell.root + ' [' + shell.scale + ']' + (songIsHis ? '' : ' NOT the page\'s ' + JSON.stringify(mid.song)) +
            '; played ' + s.kind + ' ' + (a ? a.row || JSON.stringify(a.holds) : '') + ' -> ' + nn.map(l => l.word).join(',') + ' -> ' + (f0 ? f0.word + ':' + f0.got : 'none') + '; the town ' + (townRests ? 'rested under the game and drew again after it' : 'DID NOT REST under the game (' + [rest0, rest1, after.rested, rest3] + ')') + ', paid ' + (after.paid.join(',') || 'nothing') + ' and YOU said "' + after.say.slice(0, 60) + '"';
          ok(tag + ': a town\'s lot opens the game on the block\'s board; its clock is the shell\'s one beat and its notes the playing song\'s; a spot played on the beat is dead centre; the town draws nothing under the game; LEAVE; the find paid and said by YOU', !!good, note);
        } catch (e) { ok(tag + ': the real page plays a spot on the beat', false, String(e && e.message || e) + ' | ' + note); }
        finally { if (d) { await d.browser.close().catch(() => {}); try { d.server.close(); } catch (e) {} } }
      }
    }
  } finally { await br.close(); srv.close(); }
  console.log('\nSCAVENGE IS THE RHYTHM: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
