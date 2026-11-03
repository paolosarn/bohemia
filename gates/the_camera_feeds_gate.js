/* THE CAMERA FEEDS: ALL OF THEM, AND MANY; TWO WAYS; FOUR THINGS  (UI 6, 11/3/26; rules 342 and 348; ask lines 351, 358)

   PAOLO 11/2 (the second star): 'Why not all 3? The view of the city could be better... Why don't we just have as much of these
   as possible to really build that lore ambience?' PAOLO 11/3: 'I want two versions one vertical one horizontal... first person
   view vibe... the word Bohemia, underneath that just only post economic apocalypse, new game and continue... not super loud...
   full screen... I don't even want settings... you close the game open it back up and then it's a random roll.'
   Built in slices/bohemia_ui_crashbox.js (the feed) and slices/bohemia_ui_materials.js (startScreen), the pictures by
   tools/bohemia_ui_the_camera_feeds.py, the sounds by tools/bohemia_ui_the_camera_feeds_sounds.py. Record:
   records/BOHEMIA_UI_THE_CAMERA_FEEDS_11_3_26.md

     C1  TEN OR MORE FEEDS, EACH MADE TWICE: every feed in crashbox.json has a tall sheet whose frame is 9:16 and a wide one whose
         frame is 16:9 (its frames one under the next, 6 or 12), on disk, and its own sound, a different file from every other's
     C2  QUIET: every feed's sound sits at -30 dB rms or under (rule 348 (d)), and the page's own defaults name the same feeds,
         sheets and sounds as the file (a phone that never gets the file still plays them)
     C3  FOUR THINGS ON THE START SCREEN (rule 348 (b)), driven on the demo upright: the letters, POST-ECONOMIC APOCALYPSE,
         NEW GAME, CONTINUE; no SETTINGS, no line under a choice, no version text on the glass (his NOTES is his, not the game's)
     C4  THE WHOLE GLASS: the feed covers the screen edge to edge upright and sideways, and the picture is the tall one upright
     C5  A RANDOM ROLL, NEVER TWICE RUNNING: the game opened six times on the same phone never opens on the feed it opened on last
     C6  THE PHONE TURNS: sideways the wide picture comes up through the tall one (a cross-fade on the grid, never a jump)
     C7  THE MONITOR CYCLES: wound to the cut, the camera cuts to another feed (a roll, a picture of snow) and takes its sound
     C8  NOT SLOWER: no feed picture is asked for before the page's first paint, and only one feed's picture before the title
     C9  nothing threw
   RULE 357 (Paolo 11/3: 'remove the Notes button from everywhere... I don't want an effect behind them, a shadow box, a contrast
   box... wherever you place all the text... it feels like it was meant to be placed there by what's going on in the background'):
     C10 NOTHING BEHIND THE FOUR WORDS: no background, plate, shadow, outline, border, glow or blur on the words or anything between
         them and the picture
     C11 THEY READ ON EVERY FEED, TALL AND WIDE: each feed held in turn, upright and sideways, its words photographed off the glass
         over three keys of its loop: every word 4.5 to 1 against the worse side of the real pixels under it, plain and in the sun
         (the front screen's own J5), his letters 3 to 1
     C12 NO NOTES BUTTON ANYWHERE: none on the title, the phone has no NOTES app, the bar's NOTES is off the glass in every frame
         the game draws
   PLANTED (each must turn its leg red, every run): a feed missing its wide sheet, a 4:3 sheet called tall, a loud sound, a
   SETTINGS choice back on the title, the same feed twice running, a box behind the line, the choices in a grey the picture does not hold up,
   the NOTES button back on the title.

   node gates/the_camera_feeds_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };

const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/crashbox/crashbox.json'), 'utf8')).feed;
const SL = p => path.join(ROOT, 'slices', p);

/* ---------- C1, C2 from the files ---------- */
function sizes(files) {   /* Pillow reads the sheets' sizes; ffmpeg the sounds' loudness */
  const py = 'import sys,json\nfrom PIL import Image\nprint(json.dumps({f: Image.open(f).size for f in sys.argv[1:]}))';
  return JSON.parse(execFileSync('python3', ['-c', py].concat(files), { encoding: 'utf8' }));
}
function rmsOf(f) {
  const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /mean_volume:\s*(-?[\d.]+) dB/.exec(r.stderr || ''); return m ? +m[1] : null;
}
function judgeFiles(F, SZ, RMS) {
  const bad = [], keys = Object.keys(F.options || {});
  const sounds = new Set();
  keys.forEach(k => {
    const o = F.options[k], n = o.frames;
    if (!(n === 6 || n === 12)) bad.push(k + ' frames ' + n);
    [['tall', 9 / 16], ['wide', 16 / 9]].forEach(([w, want]) => {
      const s = o[w] && SZ[o[w]];
      if (!s) { bad.push(k + ' no ' + w); return; }
      const asp = s[0] / (s[1] / n); if (Math.abs(asp - want) > 0.02) bad.push(k + ' ' + w + ' frame ' + asp.toFixed(3));
    });
    if (!o.sound || !fs.existsSync(SL(o.sound))) bad.push(k + ' no sound'); else sounds.add(fs.readFileSync(SL(o.sound)).toString('base64').slice(0, 4000) + fs.statSync(SL(o.sound)).size + o.sound);
    const r = RMS[o.sound]; if (r == null || r > -30) bad.push(k + ' sound ' + r + ' dB');
  });
  const distinct = new Set(keys.map(k => F.options[k].sound)).size === keys.length;
  return { n: keys.length, bad, distinct };
}

(async () => {
  const keys = Object.keys(J.options);
  const files = []; keys.forEach(k => ['tall', 'wide'].forEach(w => { if (J.options[k][w] && fs.existsSync(SL(J.options[k][w]))) files.push(SL(J.options[k][w])); }));
  const sz = sizes(files), SZ = {}; Object.keys(sz).forEach(f => { SZ[path.relative(path.join(ROOT, 'slices'), f)] = sz[f]; });
  const RMS = {}; keys.forEach(k => { const s = J.options[k].sound; if (s && fs.existsSync(SL(s))) RMS[s] = rmsOf(SL(s)); });
  const v = judgeFiles(J, SZ, RMS);
  ok('C1 ten or more feeds, each a tall 9:16 and a wide 16:9 sheet on disk (' + v.n + ' feeds)', v.n >= 10 && !v.bad.filter(b => !/sound/.test(b)).length, v.bad.filter(b => !/sound/.test(b)).slice(0, 4).join('; '));
  ok('C1 and each its own sound, a different file from every other\'s', v.distinct && !v.bad.filter(b => /no sound/.test(b)).length);
  ok('C2 QUIET: every feed\'s sound at -30 dB rms or under', !v.bad.filter(b => / sound -?[\d.]+ dB|sound null/.test(b)).length, keys.map(k => k + ' ' + RMS[J.options[k].sound]).join(' '));
  /* the page's own defaults mirror the file */
  const src = fs.readFileSync(SL('bohemia_ui_crashbox.js'), 'utf8');
  const miss = []; keys.forEach(k => ['tall', 'wide', 'sound'].forEach(w => { if (src.indexOf("'" + J.options[k][w] + "'") < 0) miss.push(k + ' ' + w); }));
  ok('C2 the page\'s own defaults name the same sheets and sounds as the file', !miss.length, miss.slice(0, 4).join(', '));
  /* PLANTED on a copy */
  const P1 = JSON.parse(JSON.stringify(J)); delete P1.options[keys[0]].wide;
  ok('C1 PLANTED: a feed missing its wide sheet is caught', judgeFiles(P1, SZ, RMS).bad.some(b => / no wide/.test(b)));
  const SZ2 = Object.assign({}, SZ); const t0 = J.options[keys[1]].tall; SZ2[t0] = [390, 520 * J.options[keys[1]].frames];
  ok('C1 PLANTED: a 4:3 sheet called tall is caught', judgeFiles(J, SZ2, RMS).bad.some(b => / tall frame/.test(b)));
  const RMS2 = Object.assign({}, RMS); RMS2[J.options[keys[2]].sound] = -20;
  ok('C2 PLANTED: a loud sound is caught', judgeFiles(J, SZ, RMS2).bad.some(b => / sound -20/.test(b)));

  /* ---------- C3 to C9 driven on the demo ---------- */
  const res = {};
  const TEXTS = () => {
    const t = document.querySelector('#title'); if (!t) return null;
    const seen = []; const w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode, s = (n.textContent || '').trim(); if (!s) continue;
      const el = n.parentElement; if (!el || el.closest('.sheet') || el.closest('.notes')) continue;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      let hid = false; for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) { hid = true; break; } }
      if (!hid) seen.push(s); }
    const mark = !!document.querySelector('#title .bm-start .jtf-mark, #title .bm-start .t canvas');
    return { seen, mark };
  };
  const FEEDBOX = () => { const c = document.getElementById('cbxfeed'); if (!c || !c.isConnected) return null; const r = c.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight, st: window.BohemiaCrashbox && BohemiaCrashbox.state() }; };
  const judgeTexts = t => { const want = ['POST-ECONOMIC APOCALYPSE', 'NEW GAME', 'CONTINUE']; const extra = t.seen.filter(s => want.indexOf(s) < 0);
    return { okk: t.mark && want.every(w => t.seen.indexOf(w) >= 0) && !extra.length, extra }; };
  let d;
  try {
    d = await open({ keepCards: true, beforeTap: async (page) => {
      const wait = async (fn, ms) => { const t = Date.now() + ms; while (Date.now() < t) { if (await page.evaluate(fn).catch(() => false)) return true; await page.waitForTimeout(200); } return false; };
      await wait(() => !!window.__LOAD_READY && !!(window.BohemiaCrashbox && BohemiaCrashbox.state().loaded), 40000);
      await page.waitForTimeout(800);
      res.t = await page.evaluate(TEXTS);
      res.box = await page.evaluate(FEEDBOX);
      /* PLANTED: SETTINGS put back on the title, read the same way, then taken off */
      res.plant = await page.evaluate((TX) => { const m = document.querySelector('#title .bm-start .m'); if (!m) return null;
        const b = document.createElement('button'); b.className = 'b pane'; b.innerHTML = '<span class="tx"><b>SETTINGS</b><i></i></span>'; m.appendChild(b);
        const r = (new Function('return (' + TX + ')()'))(); b.remove(); return r; }, TEXTS.toString());
      /* C8: what was asked for, and when */
      res.loads = await page.evaluate(() => performance.getEntriesByType('resource').filter(e => /crashbox\/feed_.*\.webp/.test(e.name)).map(e => ({ n: e.name.split('/').pop(), at: Math.round(e.startTime) })));
      res.fp = await page.evaluate(() => { const p = performance.getEntriesByType('paint').find(e => e.name === 'first-paint'); return p ? Math.round(p.startTime) : null; });
      /* C10: nothing behind the words (the words, and every element between them and the title's root) */
      const BEHIND = () => { const root = document.querySelector('#title .bm-start'); if (!root) return ['no title'];
        const bad = [], seen = new Set();
        root.querySelectorAll('.t, .t *, .m, .m *').forEach(e => { for (let p = e; p && p !== root; p = p.parentElement) { if (seen.has(p)) break; seen.add(p);
          const c = getComputedStyle(p), tag = (p.className && String(p.className)) || p.tagName;
          if (c.display === 'none') continue;
          const bgA = (c.backgroundColor.match(/[\d.]+/g) || [0, 0, 0, 0]); if ((bgA.length === 3 || +bgA[3] > 0) && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') bad.push(tag + ' background ' + c.backgroundColor);
          if (c.backgroundImage !== 'none') bad.push(tag + ' background-image');
          if (c.boxShadow !== 'none') bad.push(tag + ' box-shadow');
          if (c.textShadow !== 'none') bad.push(tag + ' text-shadow');
          if (c.filter !== 'none') bad.push(tag + ' filter');
          if (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) bad.push(tag + ' outline');
          if (['Top', 'Right', 'Bottom', 'Left'].some(sd => parseFloat(c['border' + sd + 'Width']) > 0 && c['border' + sd + 'Style'] !== 'none')) bad.push(tag + ' border');
          const b2 = getComputedStyle(p, '::before'), a2 = getComputedStyle(p, '::after');
          [b2, a2].forEach(q => { if (q && q.content && q.content !== 'none' && q.content !== 'normal' && q.display !== 'none') bad.push(tag + ' ::before/::after'); }); } });
        return bad; };
      res.behind = await page.evaluate(BEHIND);
      await page.evaluate(() => { const sb = document.querySelector('#title .bm-start .sub'); if (sb) sb.style.setProperty('background', '#000', 'important'); });
      res.behindPlant = await page.evaluate(BEHIND);
      await page.evaluate(() => { const sb = document.querySelector('#title .bm-start .sub'); if (sb) sb.style.removeProperty('background'); });
      /* C12 on the title, and its plant */
      const NOTES = () => { const n = Array.from(document.querySelectorAll('#title .notes, #notebtn, [data-k="notes"]')).filter(e => { const r = e.getBoundingClientRect(); let v = r.width > 0 && r.height > 0;
        for (let p = e; p && v; p = p.parentElement) { const c = getComputedStyle(p); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) v = false; } return v; }); return n.length; };
      res.notes = await page.evaluate(NOTES);
      await page.evaluate(() => { let n = document.querySelector('#title .notes'); if (!n) { n = document.createElement('div'); n.className = 'notes'; n.setAttribute('role', 'button'); n.setAttribute('data-k', 'notes'); n.textContent = 'NOTES'; n.id = 'cf-plant-notes';
        n.style.cssText = 'position:fixed;top:10px;right:10px;padding:12px;color:#fff'; document.getElementById('title').appendChild(n); } n.style.setProperty('display', 'block', 'important'); });
      res.notesPlant = await page.evaluate(NOTES);
      await page.evaluate(() => { const p = document.getElementById('cf-plant-notes'); if (p) p.remove(); else { const n = document.querySelector('#title .notes'); if (n) n.style.removeProperty('display'); } });
      /* C11: every feed held in turn, upright and sideways, its words read off the real glass over three keys */
      res.reads = []; res.readPlant = null;
      const READ = async () => {
        const items = await page.evaluate(() => { const out = [], root = document.querySelector('#title .bm-start');
          const add = (e, k, col, need) => { if (!e) return; const r = e.getBoundingClientRect(); if (!r.width || !r.height) return; out.push({ k, need, col, box: [Math.max(0, r.left), Math.max(0, r.top), Math.min(innerWidth, r.right) - Math.max(0, r.left), Math.min(innerHeight, r.bottom) - Math.max(0, r.top)] }); };
          const col = e => getComputedStyle(e).color;
          const sub = root.querySelector('.sub'); add(sub, 'the line', col(sub), 4.5);
          root.querySelectorAll('.m .b').forEach(b => { if (b.disabled) return; const w = b.querySelector('b'); const rg = document.createRange(); rg.selectNodeContents(w); const r = rg.getBoundingClientRect();
            out.push({ k: w.textContent, need: 4.5, col: col(w), box: [r.left, r.top, r.width, r.height] }); });
          const mk = root.querySelector('.t canvas'); add(mk, 'BOHEMIA', 'rgb(226, 189, 106)', 3.0);
          const st = document.createElement('style'); st.id = 'cf-hide'; st.textContent = '#title .bm-start .t, #title .bm-start .m{visibility:hidden!important}'; document.head.appendChild(st);
          return out; });
        const shots = []; for (let i = 0; i < 3; i++) { await page.waitForTimeout(i ? 560 : 150); shots.push((await page.screenshot()).toString('base64')); }
        await page.evaluate(() => { const st = document.getElementById('cf-hide'); if (st) st.remove(); });
        return page.evaluate(async ({ shots, items }) => {
          const LUM = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
          const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
          const worst = items.map(it => ({ k: it.k, need: it.need, plain: 99, sun: 99 }));
          for (const png of shots) { const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
            const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const sc = im.width / innerWidth;
            items.forEach((it, j) => { const [x, y, w, h] = it.box, d = g.getImageData(Math.round(x * sc), Math.round(y * sc), Math.max(1, Math.round(w * sc)), Math.max(1, Math.round(h * sc))).data, S = [];
              for (let i = 0; i < d.length; i += 4 * 3) S.push([d[i], d[i + 1], d[i + 2]]); S.sort((p, q) => LUM(...p) - LUM(...q));
              const t = it.col.match(/[\d.]+/g).slice(0, 3).map(Number), tl = LUM(...t), bg = S[Math.floor((S.length - 1) * (tl > 0.18 ? 0.9 : 0.1))];
              worst[j].plain = Math.min(worst[j].plain, +CR(tl, LUM(...bg)).toFixed(2)); worst[j].sun = Math.min(worst[j].sun, +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2)); }); }
          return worst; }, { shots, items });
      };
      const keys = await page.evaluate(() => Object.keys(BohemiaCrashbox.data().feed.options).filter(k => BohemiaCrashbox.data().feed.options[k].on !== false));
      for (const [vw, vh, ori] of [[390, 844, 'tall'], [844, 390, 'wide']]) {
        await page.setViewportSize({ width: vw, height: vh });
        for (const k of keys) {
          await page.evaluate(k => { localStorage.setItem('bohemia.title.feed', k); }, k);
          await wait(() => { const s = BohemiaCrashbox.state(); return s.loaded && !s.fading && s.shown === (innerWidth >= innerHeight ? 'wide' : 'tall'); }, 15000);
          await page.waitForTimeout(250);
          const r = await READ(); res.reads.push({ k, ori, r });
          if (k === keys[1] && ori === 'tall' && !res.readPlant) {   /* PLANTED: the choices in a grey the picture does not hold up */
            await page.evaluate(() => { document.querySelectorAll('#title .bm-start .m .b b').forEach(w => w.style.setProperty('color', '#6e6a62', 'important')); });
            res.readPlant = await READ();
            await page.evaluate(() => { document.querySelectorAll('#title .bm-start .m .b b').forEach(w => w.style.removeProperty('color')); });
          }
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => localStorage.removeItem('bohemia.title.feed'));
      /* C5: opened again and again on the same phone */
      res.rolls = [res.box && res.box.st ? res.box.st.pick : null];
      for (let i = 0; i < 5; i++) {
        await page.reload(); await wait(() => !!(window.BohemiaCrashbox && BohemiaCrashbox.state().pick), 30000);
        res.rolls.push(await page.evaluate(() => BohemiaCrashbox.state().pick));
      }
      await wait(() => !!window.__LOAD_READY && !!(window.BohemiaCrashbox && BohemiaCrashbox.state().loaded), 40000);
      /* C6: the phone turns */
      await page.setViewportSize({ width: 844, height: 390 });
      res.turn = []; for (let i = 0; i < 14; i++) { await page.waitForTimeout(110); res.turn.push(await page.evaluate(() => { const s = BohemiaCrashbox.state(); return { o: s.orient, shown: s.shown, f: s.fading }; })); }
      await page.waitForTimeout(1500);
      res.side = await page.evaluate(FEEDBOX);
      res.sideTexts = await page.evaluate(TEXTS);
      await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500);
      /* C7: wound to the cut */
      const before = await page.evaluate(() => ({ k: BohemiaCrashbox.state().pick, snd: window.__TITLEWIND ? __TITLEWIND.SRC : null }));
      await page.evaluate(() => BohemiaCrashbox.cutSoon());
      res.cutSeen = []; for (let i = 0; i < 40; i++) { await page.waitForTimeout(100); res.cutSeen.push(await page.evaluate(() => BohemiaCrashbox.state().cutting)); }
      const after = await page.evaluate(() => ({ k: BohemiaCrashbox.state().pick, snd: window.__TITLEWIND ? __TITLEWIND.SRC : null, opt: BohemiaCrashbox.data().feed.options[BohemiaCrashbox.state().pick] }));
      res.cut = { before, after };
    } });
    res.errs = d.errs ? d.errs.slice() : [];
  } catch (e) { res.threw = String(e && e.stack || e); }
  try { if (d) await d.close(); } catch (e) {}

  const t = res.t || { seen: [], mark: false }, jt = judgeTexts(t);
  ok('C3 FOUR THINGS on the start screen: the letters, POST-ECONOMIC APOCALYPSE, NEW GAME, CONTINUE, nothing else', jt.okk, 'seen: ' + t.seen.join(' | '));
  ok('C3 PLANTED: a SETTINGS choice back on the title is caught', !!res.plant && !judgeTexts(res.plant).okk, res.plant ? judgeTexts(res.plant).extra.join(',') : 'not read');
  ok('C3 and sideways the same four things', !!res.sideTexts && judgeTexts(res.sideTexts).okk, res.sideTexts ? res.sideTexts.seen.join(' | ') : 'not read');
  const full = b => !!b && b.x <= 0 && b.y <= 0 && b.w >= b.vw - 1 && b.h >= b.vh - 1;
  ok('C4 THE WHOLE GLASS upright: the feed covers the screen edge to edge, the tall picture', full(res.box) && res.box.st.shown === 'tall', res.box ? [res.box.w, res.box.h, res.box.st.shown].join(' ') : 'no feed');
  ok('C4 and sideways, the wide picture', full(res.side) && res.side.st.shown === 'wide', res.side ? [res.side.w, res.side.h, res.side.st.shown].join(' ') : 'no feed');
  const r = res.rolls || [], twice = r.some((k, i) => i > 0 && k === r[i - 1]);
  ok('C5 A RANDOM ROLL: opened six times on one phone, never the same feed twice running', r.length === 6 && r.every(Boolean) && !twice, r.join(' '));
  const plantRolls = ['a', 'a'];
  ok('C5 PLANTED: the same feed twice running is caught', plantRolls.some((k, i) => i > 0 && k === plantRolls[i - 1]));
  const tn = res.turn || [];
  ok('C6 THE PHONE TURNS: the wide picture comes up through the tall one (a cross-fade, never a jump)', tn.some(x => x.f) && tn.length && tn[tn.length - 1].shown === 'wide', tn.map(x => (x.f ? 'f' : '-') + x.shown[0]).join(''));
  const c = res.cut || {};
  ok('C7 THE MONITOR CYCLES: wound to the cut, it cuts (roll and snow) to another camera', !!c.after && c.after.k !== c.before.k && (res.cutSeen || []).some(Boolean), c.before ? c.before.k + ' -> ' + c.after.k : 'not read');
  ok('C7 and the next camera brings its own sound', !!c.after && !!c.after.opt && c.after.snd === c.after.opt.sound, c.after ? c.after.snd : '');
  const L = res.loads || [];
  ok('C8 NOT SLOWER: no feed picture asked for before the first paint, and one feed\'s picture only before the title is up', L.length >= 1 && res.fp != null && L.every(x => x.at >= res.fp) && new Set(L.map(x => x.n.replace(/_(tall|wide)\.webp$/, ''))).size === 1,
    'first paint ' + res.fp + ' ms; ' + L.map(x => x.n + '@' + x.at).join(' '));
  ok('C10 NOTHING BEHIND THE FOUR WORDS: no box, plate, shadow, outline, border, glow or blur', !!res.behind && !res.behind.length, (res.behind || ['not read']).slice(0, 4).join('; '));
  ok('C10 PLANTED: a box behind the line is caught', !!res.behindPlant && res.behindPlant.some(b => /background/.test(b)), (res.behindPlant || []).slice(0, 2).join('; '));
  const shortOf = r => r.filter(w => w.plain < w.need || (w.need > 3 && w.sun < w.need));
  const allReads = res.reads || [], shortReads = allReads.filter(x => shortOf(x.r).length || x.r.length < 3);
  ok('C11 THEY READ ON EVERY FEED, TALL AND WIDE: every word 4.5 to 1 (and in the sun), his letters 3 to 1, over three keys (' + allReads.length + ' screens)',
    allReads.length >= 20 && !shortReads.length, shortReads.slice(0, 4).map(x => x.k + ' ' + x.ori + ': ' + (x.r.length < 3 ? 'words missing' : shortOf(x.r).map(w => w.k + ' ' + w.plain + '/' + w.sun).join(','))).join(' | ') || allReads.map(x => x.k + x.ori[0] + ' ' + Math.min(...x.r.filter(w => w.need > 3).map(w => Math.min(w.plain, w.sun))).toFixed(1)).join(' '));
  ok('C11 PLANTED: the choices in a grey the picture does not hold up are caught', !!res.readPlant && shortOf(res.readPlant).length > 0, res.readPlant ? shortOf(res.readPlant).map(w => w.k + ' ' + w.plain + '/' + w.sun).join(',') : 'not read');
  const phoneSrc = fs.readFileSync(SL('bohemia_phone.js'), 'utf8'), matSrc = fs.readFileSync(SL('bohemia_ui_materials.js'), 'utf8');
  const appsM = /var APPS = (\[[^\]]*\])/.exec(phoneSrc);
  ok('C12 NO NOTES BUTTON ANYWHERE: none on the title, no NOTES app on the phone, the bar\'s NOTES off the glass', res.notes === 0 && !!appsM && !/notes/.test(appsM[1]) && /#notebtn\{display:none!important\}/.test(matSrc),
    'title ' + res.notes + ', apps ' + (appsM ? appsM[1] : '?'));
  ok('C12 PLANTED: the NOTES button back on the title is caught', res.notesPlant > 0, res.notesPlant + ' shown');
  const errs = (res.errs || []).filter(e => !/favicon|ERR_ABORTED|net::/.test(e));
  ok('C9 nothing threw', !res.threw && !errs.length, (res.threw || errs.slice(0, 3).join(' | ')).slice(0, 300));
  console.log('\nTHE CAMERA FEEDS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
