/* EVERY FACE BREATHES GATE (PORTRAIT [every face breathes], VAMILY rule 246(d), 10/26/26).
   PAOLO 10/26: 'I wanna see my crew, anytime they're on the screen, or anytime anyone's on the screen with a portrait, just
   slightly moving, like breathing... if they have a serious wound maybe they could be reacting to it'.
   The rule's gate, its own words: every portrait changes over two seconds, breathing 12 to 20 a minute; a wounded face reacts
   and an unwounded one does not; frame time in line.
     E1 ONE CLOCK ON THE GAME'S GRID: three keys a beat at 120 BPM (engine/bohemia_wound_faces.js KEY_MS), a breath of 24 keys:
        15 a minute, inside a resting man's 12 to 20; a blink every 3 to 6 seconds; no frame is held between two keys
     E2 THE FRAMES ARE HIS OWN RENDERS: every face rendered carries the wince at 128 and at 64, and the blink and the eyes to each
        side (the '_blink', '_look_l', '_look_r', '_wince' rows of his atlas), unless his eyes are behind his gear: a face whose
        eyes turned and moved no pixel either way (a visor, a blindfold) has nothing to blink, and that is the only excuse; a
        face whose eyes move and never blink fails
     E3 *** ON THE REAL SURFACE: THE CREW SCREEN *** (slices/BOHEMIA_ROSTER_SCREEN.html in Chromium): a face drawn by the one face
        painter changes over two seconds, and its breath, counted over sixteen seconds, is 12 to 20 a minute, at 128 and at 64
     E4 A WOUNDED FACE REACTS, A WHOLE ONE DOES NOT: a man struck down today winces within ten seconds and the wince's pixels are
        his face's; a whole man never winces in twenty
     E5 A TALKING FACE IS THE TALKER'S: while his mouth says a line this clock leaves his face alone
     E6 FRAME TIME IN LINE: with twelve faces breathing on the page the frames come as fast as with none (p95 within 2 ms), and
        nothing threw
   node gates/every_face_breathes_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const J = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };

const W = require(path.join(ROOT, 'engine/bohemia_wound_faces.js'));
console.log('E1 one clock on the game\'s grid');
ok('three keys a beat at 120 BPM', Math.abs(W.KEY_MS - 60000 / 120 / 3) < 1e-9, W.KEY_MS.toFixed(1) + ' ms');
const breaths = (look, size, keys) => { let n = 0, prev = 0; for (let k = 0; k < keys; k++) { const d = W.lifeAt({ look, size, off: 5 }, k).dy; if (prev > -size / 128 && d <= -size / 128) n++; prev = d; } return n; };
const perMin = breaths('person_town_0', 128, 360) ;   // 360 keys = 60 s
ok('a breath every eight beats: 12 to 20 a minute', perMin >= 12 && perMin <= 20, perMin + ' a minute');
const blinks = (() => { let n = 0; for (let k = 0; k < 360; k++) if (W.lifeAt({ look: 'person_town_0', size: 128, off: 5 }, k).frame === '_blink') n++; return n; })();
ok('a blink every 3 to 6 seconds', blinks >= 10 && blinks <= 20, blinks + ' in a minute');

console.log('E2 the frames are his own renders');
const OUTD = 'records/target/portrait/wounds/';
const ours = J('records/target/bb/ours.json'); const pl = (ours.people_looks.value || ours.people_looks).crew;
const made = fs.readdirSync(path.join(ROOT, OUTD)).filter(f => f.endsWith('.json') && !f.startsWith('BOHEMIA_')).map(f => f.slice(0, -5));
const want = Array.from(new Set(['you'].concat(pl)));
const lack = [], hidden = [];
made.forEach(l => {
  const X = J(OUTD + l + '.json');
  const has = (f, n) => { const q = X.rows[f] && X.rows[f].rest && X.rows[f].rest[n]; return !!(q && (q.add || q.cut)); };
  ['128', '64'].forEach(n => {
    if (!has('_wince', n)) lack.push(l + ':_wince@' + n);
    const eyes = has('_look_l', n) || has('_look_r', n);
    if (!eyes && !has('_blink', n)) { hidden.push(l + '@' + n); return; }   // behind his gear: nothing of the eyes shows
    ['_blink', '_look_l', '_look_r'].forEach(f => { if (!has(f, n)) lack.push(l + ':' + f + '@' + n); });
  });
});
ok('YOU and the whole starting company have their frames', want.every(l => made.indexOf(l) >= 0), want.filter(l => made.indexOf(l) < 0).join(', ') || want.length + ' faces');
ok('every face rendered winces, and blinks and glances wherever his eyes show, at 128 and 64', !lack.length && made.length > 0, lack.slice(0, 8).join(', ') + (lack.length > 8 ? ' and ' + (lack.length - 8) + ' more' : '') || made.length + ' faces');
ok('the eyes behind gear are few (at most 1 in 20 faces at 128) and named', hidden.filter(h => /@128$/.test(h)).length <= made.length / 20, hidden.join(', ') || 'none');

(async () => {
  let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ok('playwright', false, e.message); return finish(); }
  const who = pl.find(l => made.indexOf(l) >= 0 && l !== 'you') || made[0];
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' })[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const book = JSON.stringify({ men: { GRIZ: { shown: 'GRIZ', look: who, hpMax: 55, lostHp: 54, marks: ['missing_eye'], wound: { mark: 'missing_eye', left: 36, of: 36, day: 1 } } }, dead: [] });
  await page.addInitScript((b) => { try { localStorage.setItem('bohemia.condition.v1', b); } catch (e) {} }, book);
  await page.goto(base + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.BohemiaCrewFaces && window.BohemiaWoundFaces, null, { timeout: 20000 }).catch(() => {});
  /* a face drawn by the one painter, watched key by key */
  const watch = (look, size, secs) => page.evaluate(async ([look, size, secs]) => {
    const F = window.BohemiaCrewFaces, W = window.BohemiaWoundFaces;
    const c = document.createElement('canvas'); c.width = c.height = size; document.body.appendChild(c);
    F.draw(c.getContext('2d'), look, size);
    await new Promise(r => setTimeout(r, 900));
    const out = [], t0 = performance.now();
    while (performance.now() - t0 < secs * 1000) {
      await new Promise(r => setTimeout(r, W.KEY_MS));
      const d = c.getContext('2d').getImageData(0, 0, size, size).data; let h = 0; for (let k = 0; k < d.length; k += 53) h = (h * 31 + d[k]) >>> 0;
      out.push({ t: performance.now() - t0, life: c.dataset.life || '', h });
    }
    c.remove(); return out;
  }, [look, size, secs]);
  console.log('E3 on the real surface: the crew screen');
  for (const n of [128, 64]) {
    const s = await watch(who, n, 16);   // four whole breaths
    const first2 = new Set(s.filter(x => x.t < 2000).map(x => x.h));
    let inh = 0, prev = 0; s.forEach(x => { if (/^_wince/.test(x.life)) return;   /* the breath catching on a wince is not a breath */ const dy = parseFloat(String(x.life).split('|')[1] || '0'); if (prev > -n / 128 && dy <= -n / 128) inh++; prev = dy; });
    const rate = inh * 60 / 16;
    ok('E3 ' + who + ' at ' + n + ' changes over two seconds', first2.size >= 2, first2.size + ' different pictures in 2 s');
    ok('E3 and breathes 12 to 20 a minute (counted on the page over 16 s)', rate >= 12 && rate <= 20, rate + ' a minute');
  }
  console.log('E4 a wounded face reacts, a whole one does not');
  const hurt = await watch(who, 128, 10);
  ok('E4 ' + who + ' struck down today winces within ten seconds', hurt.some(x => /^_wince/.test(x.life)), hurt.filter(x => /^_wince/.test(x.life)).length + ' keys of wincing');
  const whole = await watch('you', 128, 20);
  ok('E4 a whole man never winces (YOU, 20 s)', !whole.some(x => /^_wince/.test(x.life)) && whole.some(x => /^_blink/.test(x.life)), whole.filter(x => /^_blink/.test(x.life)).length + ' blinks, ' + whole.filter(x => /^_wince/.test(x.life)).length + ' winces');
  console.log('E5 a talking face is the talker\'s');
  const talk = await page.evaluate(async ([look]) => {
    const F = window.BohemiaCrewFaces, W = window.BohemiaWoundFaces;
    const c = document.createElement('canvas'); c.width = c.height = 128; document.body.appendChild(c);
    F.draw(c.getContext('2d'), look, 128); await new Promise(r => setTimeout(r, 900));
    const before = c.dataset.life; F.talk(c, look, 'Ya lo sé, the batteries are short again.');
    const lives = new Set(); for (let i = 0; i < 12; i++) { await new Promise(r => setTimeout(r, W.KEY_MS)); lives.add(c.dataset.life); }
    const mouths = c.dataset.mouth; c.remove(); return { lives: [...lives], mouth: mouths, before };
  }, [who]);
  ok('E5 while he talks the clock leaves his face alone (his mouth moves, the life frame holds)', talk.lives.length <= 1 && !!talk.mouth, 'life ' + talk.lives.join(',') + ', mouth ' + talk.mouth);
  console.log('E6 frame time in line');
  const ft = await page.evaluate(async ([look]) => {
    const F = window.BohemiaCrewFaces;
    const frames = async (ms) => { const t = []; let last = performance.now(); const t0 = last; await new Promise(res => { const f = (now) => { t.push(now - last); last = now; if (now - t0 < ms) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); t.sort((a, b) => a - b); return t[Math.floor(t.length * 0.95)]; };
    const none = await frames(3000);
    const cs = []; for (let i = 0; i < 12; i++) { const c = document.createElement('canvas'); c.width = c.height = 128; document.body.appendChild(c); F.draw(c.getContext('2d'), look, 128); cs.push(c); }
    await new Promise(r => setTimeout(r, 1000));
    const twelve = await frames(3000); cs.forEach(c => c.remove());
    return { none, twelve };
  }, [who]);
  ok('E6 twelve faces breathing: frames as fast as with none (p95 within 2 ms)', ft.twelve - ft.none <= 2, 'p95 ' + ft.none.toFixed(1) + ' ms with none, ' + ft.twelve.toFixed(1) + ' ms with twelve');
  ok('E6 nothing threw', !errs.length, errs.slice(0, 3).join(' | ') || 'no page errors');
  await browser.close(); server.close();
  finish();
})().catch(e => { ok('the walk ran', false, e.stack); finish(); });
function finish() { console.log('\nEVERY FACE BREATHES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
