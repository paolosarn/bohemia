#!/usr/bin/env node
/* THE RADIO LIVES IN THE FEED (WORDS 2, 11/3/26; VAMILY rule 371, ask line 397).

   His words, the VOTE tab, NO on the town falling on its own radio: 'this is what the tweets are for... if it's an important
   quest and timewise you won't see any other tweets, priority... I love the radio noise... we're not running a new system,
   this is mostly going to be in the tweet system... I did hear all the newest sound effects and why am I shitting my pants,
   really good, definitely need to hear more of that implemented... keep all these assets.'

     F1  THE FEED'S OWN FORMAT: a town's fall, run in a sandbox, posts a handle and the words (no time stamp, no channel label
         in front), each line as itself (@church_gate, @church_tower, @ch4_church), every one PRIORITY while it plays; after it
         ends the lines sit in the feed's back pages with no hold
     F2  THE SOUNDS UNDER THE FEED (371(c)): a big post (a man dead) asks the shell for its slice of the fall's own recording
         once; a second inside the gap, an ordinary post, the first minute and a fall already playing ask nothing
     F3  THE PRIORITY HOLD (371(b)): the phone's strip keeps only the priority posts while any is up, and an important post
         (priority, or a big kind) keeps the strip its whole read time; the strip's fit, scroll and read times untouched
     F4  NO SEPARATE RADIO SURFACE (371(a)): the scanner draws nothing itself (no element, no page, no log); its lines reach the
         glass only through the phone's posts; no page in the game has a radio card, log or screen
     F5  EVERY RADIO ASSET KEPT AND USED MORE (371(c)(d)): the recording, its index and its manifest are there; every one of the
         feed's big kinds has its sound and every sound is a real slice of the recording (the static on the weakest post, the
         squelch on a key-up, the open mic inside the open mic, the carrier lost at the cut); the shell plays it (the engine
         byte for byte in the alpha and the demo, its glue routes it); the feed marks a big post and the map carries that engine
     L1  (--live) THE REAL DEMO, upright phone: a newer ordinary post shows on the strip when nothing plays (the control); then a
         town falls and for 24 s every sample of the strip is the town's channel and never that newer post
   Run: node gates/the_radio_lives_in_the_feed_gate.js [--live] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const R = p => path.join(ROOT, p);
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + String(why).slice(0, 700) + ']' : '')); };

const L = JSON.parse(fs.readFileSync(R('records/target/bb/radio_lines.json'), 'utf8'));
const K = JSON.parse(fs.readFileSync(R('records/target/bb/feed_kinds.json'), 'utf8'));
const RADIO_SRC = fs.readFileSync(R('slices/bohemia_radio.js'), 'utf8');
const PHONE_SRC = fs.readFileSync(R('slices/bohemia_phone.js'), 'utf8');

/* the scanner in a sandbox, the clock in our hands */
async function sandbox(up) {
  let now = 1e12; const timers = [], posted = [], ears = [];
  const win = { performance: { now: () => up }, localStorage: { getItem: () => null, setItem: () => {} },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(JSON.stringify(L))) }),
    setTimeout: (f, ms) => { timers.push({ f, due: now + (ms | 0) }); return timers.length; }, clearTimeout: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, postMessage: m => posted.push(m),
    BohemiaFeed: { on: fn => { ears.push(fn); return () => {}; } },
    BohemiaPhone: { P: { posts: () => [] } } };
  win.parent = win; win.window = win;
  win.Date = { now: () => now };
  vm.createContext(win); vm.runInContext(RADIO_SRC, win);
  await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r));
  const advance = ms => { const end = now + ms; for (;;) { timers.sort((a, b) => a.due - b.due); const t = timers[0]; if (!t || t.due > end) break; timers.shift(); now = t.due; try { t.f(); } catch (e) {} } now = end; };
  return { win, posted, ears, advance, up: v => { up = v; } };
}

(async () => {
  console.log('='.repeat(74));
  console.log('THE RADIO LIVES IN THE FEED: a town falls as posts, priority, the radio under them (rule 371)');
  console.log('='.repeat(74));

  /* F1 */
  {
    const s = await sandbox(70000);
    const ok = s.win.BohemiaRadio.fall('Church', 'Mob');
    s.advance(3500);                                   /* no shell answered: the words run by themselves */
    s.advance(60000);
    const mid = s.win.BohemiaRadio.live();
    const T = L.towns.Church, lines = T.lines.map(x => x.say.replace(/\{town\}/g, 'Church'));
    const bad = mid.filter(p => !/^@[a-z0-9_]{2,15}$/.test(p.who) || p.who.length > (L.handle_max || 16) || /^\d\d:\d\d/.test(p.txt) || lines.indexOf(p.txt) < 0 || p.priority !== true);
    const handles = [...new Set(mid.map(p => p.who))];
    s.advance(60000);
    const after = s.win.BohemiaPhone.P.posts(), st = s.win.BohemiaRadio.state();
    leg(ok && mid.length >= 8 && !bad.length && handles.length >= 3 && handles.indexOf('@church_tower') >= 0 && handles.indexOf('@church_gate') >= 0
      && !st.playing && after.length === L.skeleton.length && after.every(p => p.priority === false && p.radio),
      'F1  THE FEED\'S OWN FORMAT: A HANDLE AND THE WORDS, EACH VOICE AS ITSELF, PRIORITY WHILE IT PLAYS, NO HOLD AFTER',
      mid.length + ' lines by 63 s, handles ' + handles.join(' ') + '; first "' + (mid[0] ? mid[0].who + ': ' + mid[0].txt : '') + '"; bad ' + bad.length + '; after: ' + after.length + ' in the back pages, holds ' + after.filter(p => p.priority).length);
  }

  /* F2 */
  {
    const s = await sandbox(70000);
    const ear = s.ears[0], unders = () => s.posted.filter(m => m && m.ev === 'under');
    const r1 = ear && ear({ type: 'man_dead', text: 'x' }); const n1 = unders().length, m1 = unders()[0];
    const r2 = ear && ear({ type: 'wipe' });                         /* inside the gap */
    s.advance((L.under_gap_s || 20) * 1000 + 100);
    const r3 = ear && ear({ type: 'price_up' });                     /* an ordinary post */
    s.win.BohemiaRadio.fall('Church', 'Mob'); s.advance(3500);
    const r4 = ear && ear({ type: 'raid_seen' });                    /* a fall is playing */
    const e = await sandbox(10000); const r5 = e.ears[0] && e.ears[0]({ type: 'man_dead' });   /* the first minute */
    const seg = L.segments[L.under_posts.man_dead];
    leg(r1 === true && n1 === 1 && m1.what === 'carrier' && m1.from === seg.from && m1.dur === seg.dur && !r2 && !r3 && !r4 && !r5 && unders().length === 1,
      'F2  A BIG POST ASKS FOR ITS SLICE OF THE RECORDING ONCE; THE GAP, AN ORDINARY POST, A FALL PLAYING AND THE FIRST MINUTE ASK NOTHING',
      'man dead -> ' + (m1 ? m1.what + ' ' + m1.from + ' s for ' + m1.dur + ' s' : 'nothing') + '; then ' + [r2, r3, r4, r5].map(Boolean).join(' '));
  }

  /* F3 */
  {
    const m = /function stripHold\(posts\) \{[\s\S]*?\n  \}/.exec(PHONE_SRC);
    let hold = null; try { hold = m && vm.runInNewContext('(' + m[0] + ')'); } catch (e) {}
    const a = { who: '@a', txt: 'a' }, b = { who: '@b', txt: 'b', priority: true }, c = { who: '@c', txt: 'c' }, d = { who: '@d', txt: 'd', priority: true };
    const w1 = hold ? hold([a, b, c, d]).map(p => p.who).join('') : '', w2 = hold ? hold([a, c]).map(p => p.who).join('') : '';
    const sp = PHONE_SRC.slice(PHONE_SRC.indexOf('function stripPaint('), PHONE_SRC.indexOf('/* ---- YOUR COMPANY'));
    const wired = /var posts = stripHold\(/.test(sp) && /H\.stripHeld && Date\.now\(\) < H\.stripHeld/.test(sp) && /H\.stripHeld = \(p\.priority \|\| p\.big\) \? Date\.now\(\) \+ ms : 0/.test(sp);
    const kept = /fitStrip\(fd\)/.test(sp) && /stripScroll\(fd\)/.test(sp) && /readMs\(p\)/.test(sp) && /STRIP_BACK = 6/.test(PHONE_SRC);
    const maps = /type: x\.type \|\| '', big: !!x\.big/.test(PHONE_SRC);
    leg(w1 === '@b@d' && w2 === '@a@c' && wired && kept && maps,
      'F3  THE PRIORITY HOLD: WHILE ANY PRIORITY POST IS UP THE STRIP SHOWS ONLY THOSE; AN IMPORTANT ONE KEEPS IT ITS READ TIME; FIT, SCROLL AND READ TIMES UNTOUCHED',
      'mixed -> ' + w1 + ', ordinary -> ' + w2 + '; wired ' + wired + ', kept ' + kept + ', the post carries its kind ' + maps);
  }

  /* F4 */
  {
    const draws = /document\.|createElement|innerHTML|appendChild|insertAdjacent/.test(RADIO_SRC.replace(/\/\*[\s\S]*?\*\//g, ''));
    const onlyPhone = /P\.posts = function \(\) \{[\s\S]{0,200}?return DONE\.concat\(a\)\.concat\(live\(\)\)/.test(RADIO_SRC);
    const pages = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'slices/bohemia_phone.js'];
    const surfaces = pages.filter(f => /(id|class)\s*=\s*["'][^"']*\bradio[-_]?(log|card|screen|panel|app)?\b[^"']*["']|['"]radio(log|card|screen|panel|app)['"]/i.test(fs.readFileSync(R(f), 'utf8')));
    leg(!draws && onlyPhone && !surfaces.length,
      'F4  NO SEPARATE RADIO SURFACE: THE SCANNER DRAWS NOTHING, ITS LINES REACH THE GLASS ONLY AS THE PHONE\'S POSTS, NO PAGE HAS A RADIO CARD, LOG OR SCREEN',
      'draws ' + draws + ', through the phone ' + onlyPhone + ', surfaces ' + (surfaces.join(', ') || 'none'));
  }

  /* F5 */
  {
    const files = ['slices/radio/fall.mp3', 'slices/radio/index.json', 'slices/radio/manifest.json'].filter(f => fs.existsSync(R(f)));
    const IDX = JSON.parse(fs.readFileSync(R('slices/radio/index.json'), 'utf8'));
    const big = K.kinds.filter(k => k.big).map(k => k.id), U = L.under_posts || {}, S = L.segments || {};
    const unmapped = big.filter(k => !S[U[k]]), stray = Object.keys(U).filter(k => k[0] !== '_' && big.indexOf(k) < 0);
    const sk = IDX.skeleton, keys = sk.filter(x => x.kind === 'key'), weakest = keys.slice().sort((a, b) => a.sig - b.sig)[0];
    const openS = sk.find(x => x.kind === 'open'), cut = sk.find(x => x.kind === 'cut');
    const inside = (s, a, b) => s && s.from >= a - 1e-6 && s.from + s.dur <= b + 1e-6;
    const segOk = inside(S.static, weakest.at, weakest.at + weakest.key) && keys.some(k => S.squelch && S.squelch.from < k.at + k.key && S.squelch.from + S.squelch.dur > k.at + k.key)
      && inside(S.open, openS.at, openS.at + openS.key) && S.carrier && Math.abs(S.carrier.from - cut.at) < 0.01 && Object.values(S).filter(x => x && x.dur).every(x => x.from + x.dur <= IDX.length_s);
    const eng = fs.readFileSync(R('engine/bohemia_radio_heard.js'), 'utf8');
    const alpha = fs.readFileSync(R('slices/BOHEMIA_ALPHA_0_9.html'), 'utf8'), demo = fs.readFileSync(R('slices/BOHEMIA_DEMO.html'), 'utf8');
    const shell = s => s.indexOf(eng) >= 0 && /d\.ev === 'under'\) \{ try \{ R\.under\(d\.id/.test(s);
    const fe = fs.readFileSync(R('engine/bohemia_feedstream.js'), 'utf8'), city = fs.readFileSync(R('slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
    const marks = /if \(item\.big\) post\.big = true;/.test(fe) && city.indexOf(fe) >= 0;
    leg(files.length === 3 && big.length >= 6 && !unmapped.length && !stray.length && segOk && /under: function \(id, seg\)/.test(eng) && shell(alpha) && shell(demo) && marks,
      'F5  EVERY RADIO ASSET KEPT AND USED MORE: EVERY BIG KIND HAS ITS SLICE OF THE RECORDING, EACH SLICE WHERE IT SAYS, THE SHELL PLAYS IT, THE FEED MARKS A BIG POST',
      files.length + '/3 files; big kinds ' + big.length + ', unmapped ' + (unmapped.join(',') || 'none') + ', stray ' + (stray.join(',') || 'none') + '; slices ' + segOk
      + '; shell alpha ' + shell(alpha) + ' demo ' + shell(demo) + '; the feed marks big and the map carries it ' + marks);
  }

  /* L1 */
  if (process.argv.includes('--live')) {
    const { open } = require(R('tools/bohemia_drive_the_demo.js'));
    let d = null;
    try {
      d = await open({ profile: 'phone_portrait', door: 120000, engage: true }); const p = d.page, fr = d.fr;
      await p.waitForTimeout(2500); try { await d.clearCards(); } catch (_e) {}
      const strip = () => p.evaluate(() => { const b = document.querySelector('#bohphone .home .bpfd .fp b'); return b ? b.textContent : null; });
      /* the control: a newer ordinary post on the phone's list shows on the strip when nothing plays */
      await fr.evaluate(() => { const P = BohemiaPhone.P, base = P.posts; window.__PROBE = { who: '@gate_probe', txt: 'a newer ordinary post', kind: 'world' };
        P.posts = function () { return base.apply(P, arguments).concat(window.__PROBE ? [window.__PROBE] : []); }; });
      let ctl = false; for (let i = 0; i < 40 && !ctl; i++) { await p.waitForTimeout(500); ctl = (await strip()) === '@gate_probe'; }
      /* the fall: after the first minute it plays (A6 of the radio gate); then 24 s of samples */
      await fr.evaluate(() => BohemiaRadio.fall('Church', 'Mob'));
      await fr.waitForFunction(() => BohemiaRadio.state().playing && BohemiaRadio.live().length > 0, null, { timeout: 120000 }).catch(() => {});
      const seen = []; for (let i = 0; i < 48; i++) { await p.waitForTimeout(500); seen.push(await strip()); }
      const st = await fr.evaluate(() => BohemiaRadio.state()), held = await p.evaluate(() => ({ pri: window.__PHONE_PRIORITY | 0, held: window.__PHONE_HELD | 0 }));
      const radioH = seen.filter(h => h && /^@(church_|ch4_church)/.test(h)).length, probe = seen.filter(h => h === '@gate_probe').length;
      leg(ctl && st.playing && radioH >= 44 && probe === 0 && held.pri > 0 && d.errs.length === 0,
        'L1  THE REAL DEMO: A NEWER ORDINARY POST SHOWS WHEN NOTHING PLAYS; WHILE THE CHURCH FALLS EVERY SAMPLE IS ITS CHANNEL AND NEVER THAT POST',
        'control ' + ctl + '; ' + radioH + '/48 samples the channel, probe ' + probe + ', ' + [...new Set(seen)].join(' ') + '; priority shown ' + held.pri + ', held ' + held.held + '; errors ' + d.errs.length + (d.errs[0] ? ': ' + d.errs[0] : ''));
    } catch (e) { leg(false, 'L1  THE REAL DEMO', String(e && e.message || e).slice(0, 300)); }
    finally { try { await d.browser.close(); } catch (_e) {} try { d.server.close(); } catch (_e) {} }
  }

  console.log('\n=== THE RADIO LIVES IN THE FEED: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
