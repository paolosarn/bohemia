#!/usr/bin/env node
/* EVERY SHOT IS FELT (FIGHT SCREEN 11/14/26; VAMILY rule 450(b)(c)(d), ask row 622).
   PAOLO 11/14: 'anytime anyone fires a shot I want a muzzle flash on the screen, some quick shit, like it goes all white or
   something, I want people to feel this shot for real.'
   THE LAW: every gun fired by anyone, his men's or theirs, throws a flash at its barrel AND a quick white hit across the whole
   screen, a frame or two, on the shot's own moment, bigger for a bigger gun. It must never strobe: a volley is one flash, never
   more than three in a second, and SETTINGS carries a switch that softens it. The numbers are one file a modder edits
   (records/target/bb/fight_shot.json); slices/BOHEMIA_FIGHT.html (__EVERY_SHOT_IS_FELT__) draws it; the switch is FLASH in
   slices/bohemia_settings.js.
   THE LEGS:
     S1  THE NUMBERS READ: draft; a bigger gun a bigger white (pistol < rifle < shotgun, none over 0.8); quick (the peak and its fall
         inside a fifth of a second); three a second at most; soft is under 0.4 of full
     S2  THE PAGE IS WIRED: the flash is asked for on the gun's own line for anyone's gun, ticked every frame, taps pass through it,
         no css animation drives it, the block rolls no dice and moves no man; the switch is in the settings card
     S3  IN A FIGHT (the fight's own page on a phone, guns on both sides, AUTO): every gun shot is counted, his and theirs; each
         whites the screen to its gun's peak and is gone inside a quarter second; the barrel's flash is drawn on the shooter; in no
         second do more than three flashes begin; a bow throws none
     S4  A VOLLEY IS ONE FLASH, AND NEVER A STROBE: eight shots inside a tenth of a second are one white; twelve shots a fifth of a
         second apart begin no more than three flashes in any second (the rest are held: seen at the barrel, heard, no white)
     S5  SOFT: with FLASH: SOFT the peak is the soft share of full; MOTION: LESS is soft when FLASH was never picked; FLASH: FULL
         wins over MOTION: LESS
     S6  THE GLASS ITSELF AT 1x, 2x AND 4x ON AUTO (FIGHT SCREEN TWO 11/18, ask row 650, FOUND BY EYES: 'four white flashes in one
         second in two alpha AUTO fights, the page's own count holding none'): three fights side by side (the load EYES had), each
         read by a sampler of the gate's own on every drawn frame: the white's real opacity and the board's own pixels, never the
         page's count. In no second of real time do more than three flashes begin on the glass, at any speed
     S7  A LATE FRAME NEVER MAKES A FOURTH: four shots a third of a second apart (three a second by the schedule) with the page
         busy for 90 ms at the first: the glass begins three and the fourth is held; fourteen shots a quarter second apart with the
         page stalling at random: never more than three begin in any second on the glass
     S8  THE VEST'S WHITE ASKS THE SAME CAP: alone it whites the board (read off the board's pixels); inside a second that has
         three flashes already it is not drawn; with FLASH: SOFT it is the soft share
     planted: the cap taken out of the glass (S4 and S7 red: four begin in a second on the glass); the gun's line taken out (S3 red)
   Run: node gates/every_shot_is_felt_gate.js      (about two minutes) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..'), rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const D = JSON.parse(rd('records/target/bb/fight_shot.json')), PAGE = rd('slices/BOHEMIA_FIGHT.html'), SET = rd('slices/bohemia_settings.js');

/* ---- S1 ---- */
{ const W = D.white, bad = [], longest = Math.max.apply(null, Object.keys(D.fade_ms).map(k => D.hold_ms + D.fade_ms[k]));
  if (D.draft !== true) bad.push('not draft:true');
  if (!(W.pistol < W.rifle && W.rifle < W.shotgun && W.shotgun <= 0.8 && W.pistol >= 0.2)) bad.push('the white by gun');
  if (!(longest <= 200)) bad.push('a flash of ' + longest + ' ms is not quick');
  if (!(D.max_per_second >= 1 && D.max_per_second <= 3)) bad.push('more than three a second');
  if (!(D.volley_ms >= 100 && D.volley_ms <= 400)) bad.push('the volley window');
  if (!(D.glass_second_ms >= 1000 + 2 * 34 && D.glass_second_ms <= 1300)) bad.push('the glass\'s second is not a second and a late frame');
  if (!(D.rise > 0 && D.rise <= 0.03)) bad.push('the rise');
  if (!(D.soft.white_x > 0 && D.soft.white_x <= 0.4)) bad.push('soft is not soft');
  ['pistol', 'rifle', 'shotgun'].forEach(k => { if (!(D.barrel.forward[k] > 0 && D.barrel.up[k] > 0 && D.barrel.size[k] > 0 && D.fade_ms[k] > 0)) bad.push('the barrel of the ' + k); });
  if (!(D.barrel.size.pistol < D.barrel.size.rifle && D.barrel.size.rifle < D.barrel.size.shotgun)) bad.push('the barrel flash by gun');
  check(!bad.length, 'S1', 'THE NUMBERS READ: white ' + W.pistol + ' / ' + W.rifle + ' / ' + W.shotgun + ' (pistol, rifle, shotgun), the longest flash ' + longest + ' ms, ' + D.max_per_second + ' a second at most, a volley inside ' + D.volley_ms + ' ms is one, soft x' + D.soft.white_x + (bad.length ? '; BAD: ' + bad.join(' | ') : '')); }

/* ---- S2 ---- */
{ const blk = (PAGE.split('/* ---------------- __EVERY_SHOT_IS_FELT__')[1] || '').split('/* ---------------- /__EVERY_SHOT_IS_FELT__')[0] || '', css = (/#shotflash\{[^}]*\}/.exec(PAGE) || [''])[0], bad = [];
  if (!/if \(ranged && !sling && FIGHT\.isGun\(u\.weapon\)\) shotFelt\(u, t, a\.at \+ B \* 0\.35, B\);/.test(PAGE)) bad.push('the gun\'s line does not ask for it (or asks only for one side)');
  if (!/placePick\(\); tickShot\(now\);/.test(PAGE)) bad.push('not ticked in the frame');
  if (!/shotBarrel\(v, X, Y, h, now\);/.test(PAGE)) bad.push('no barrel flash on the man');
  if (!/<div id="shotflash"><\/div>/.test(PAGE) || !/pointer-events:none/.test(css) || /animation|transition/.test(css)) bad.push('the white takes taps or is driven by css');
  if (!/fetch\('\.\.\/records\/target\/bb\/fight_shot\.json', FRESH\)/.test(PAGE)) bad.push('the numbers are not read');
  if (!blk) bad.push('no block');
  if (/\brng\(|SEED\s*=|S\.(over|deploy|round)\s*=|endTurn\(|aiStep\(|\.hp\s*[-+]?=/.test(blk)) bad.push('the flash touches the fight');
  if (!/D\.max_per_second/.test(blk) || !/D\.volley_ms/.test(blk)) bad.push('no line against a strobe');
  /* __THE_CAP_IS_ON_THE_GLASS__ (row 650): the cap is asked where the white is drawn, on the frame's clock, and nowhere on the schedule; the vest's white asks it too */
  { const tick = (/function tickShot\(now\) \{[\s\S]*?\n\}\n/.exec(blk) || [''])[0], felt = (/function shotFelt\(u, t, at, B\) \{[\s\S]*?\n\}\n/.exec(blk) || [''])[0];
    if (!/glassMayBegin\(now\)/.test(tick) || !/function glassMayBegin\(now\)/.test(blk) || !/D\.glass_second_ms/.test(blk)) bad.push('the cap is not asked where the white is drawn');
    if (/max_per_second|held\+\+/.test(felt)) bad.push('the cap is still counted on the schedule');
    if (!/now - UI\.whiteAt < beatMs\(\) && glassSpark\(now\)\)/.test(PAGE)) bad.push('the vest\'s white does not ask the cap');
    if ((PAGE.match(/fillRect\(0, 0, cx\.canvas\.width, cx\.canvas\.height\)/g) || []).length !== 1) bad.push('a whole-board fill this gate does not know'); }
  if (!/prefers-reduced-motion/.test(blk) || !/boh\.flash/.test(blk) || !/lessmo/.test(blk)) bad.push('soft is not read');
  if (!/row\('FLASH', flashBtn\(\)\)/.test(SET) || !/FLASH_KEY = 'boh\.flash'/.test(SET)) bad.push('no FLASH switch in settings');
  check(!bad.length, 'S2', 'THE PAGE IS WIRED: the gun\'s own line asks for it for anyone, ticked every frame, drawn on the man, taps pass through, no css drives it, no dice, the strobe lines and the soft reads are in, FLASH is in settings' + (bad.length ? '; BAD: ' + bad.join(' | ') : '')); }

/* ---- the page ---- */
(async () => {
  let chromium = null; try { chromium = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })().chromium; } catch (e) {}
  if (!chromium) { check(false, 'S3', 'no browser on this box'); return done(); }
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  let plant = null;
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f);
    if (plant && /BOHEMIA_FIGHT\.html$/.test(rel)) { const s = String(body), t = plant === 'strobe' ? s.replace('if (G.began.length >= M) { G.held++; return false; }', 'if (G.began.length >= 99) { G.held++; return false; }') : s.replace('shotFelt(u, t, a.at + B * 0.35, B);   /* __EVERY_SHOT_IS_FELT__', ';   /* __EVERY_SHOT_IS_FELT__'); if (t === s) throw new Error('the plant did not take'); body = Buffer.from(t); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(body); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch(), errs = [];
  const OPTS = { why: 'road:1', auto: true, deploy: false, speed: 2, met: 3, district: 'suburb', cell: { gx: 40, gy: 40 },
    party: { count: 5, days: 40, difficulty: 1, band: ['brigand_marksman', 'brigand_thug', 'brigand_thug', 'brigand_marksman', 'brigand_thug'], rolled: true, faction: 'brigands' },
    company: [{ background: 'militia', level: 2, gear: { main: 'snub_revolver' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'handgonne' } }, { name: 'RAUL', background: 'militia', level: 2, gear: { main: 'zip_gun' } }, { name: 'LUPE', background: 'militia', level: 2, gear: { main: 'shortsword' } }] };
  const open = async (store) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    await p.addInitScript(([o, st]) => { window.FIGHT_OPTS = o; try { Object.keys(st || {}).forEach(k => localStorage.setItem(k, st[k])); } catch (e) {} }, [OPTS, store || {}]);
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0 && !!DB.shot, null, { timeout: 45000 });
    return { ctx, p }; };
  /* a fight on AUTO, read to its end or forty seconds: every shot the fight's own log holds against what the glass did */
  const fight = async () => { const { ctx, p } = await open();
    /* the oracle: every attack the page starts to draw, read at that moment (a man's weapon can change or drop before the fight ends) */
    await p.evaluate(() => { const L = window.__SHOT = { guns: 0, his: 0, theirs: 0, bows: 0, kinds: {} }, sa = window.startAnim;
      window.startAnim = function (a) { try { if (a && a.k === 'attack') { const e = a.e, u = FIGHT.byId(e.id), ranged = e.shot === undefined ? FIGHT.isRanged(u.weapon) : e.shot;
          if (ranged) { const sling = u.weapon.class === 'throwing' && !FIGHT.isGun(u.weapon); if (!sling && FIGHT.isGun(u.weapon)) { L.guns++; L[u.side === 'you' ? 'his' : 'theirs']++; L.kinds[shotKind(u)] = 1; } else L.bows++; } } } catch (x) {} return sa.apply(this, arguments); }; });
    const t0 = Date.now(); while (Date.now() - t0 < 40000) { const s = await p.evaluate(() => ({ over: !!FIGHT.S.over, fired: UI.shotSeen ? UI.shotSeen.fired : 0 })); if (s.over || s.fired >= 14) break; await p.waitForTimeout(300); }
    await p.waitForTimeout(700);
    const R = await p.evaluate(() => { const L = window.__SHOT; return { pend: (UI.shots || []).filter(q => !q.n0 && !q.off).length, seen: UI.shotSeen, log: UI.shotLog || [], guns: L.guns, his: L.his, theirs: L.theirs, bows: L.bows, kinds: Object.keys(L.kinds), white: DB.shot.white, at: UI.shotAt || null, over: !!FIGHT.S.over }; });
    await ctx.close(); return R; };
  /* the flashes off the glass's own log: a flash begins where the white rises (or after a third of a second of nothing) */
  const flashes = (log) => { const o = []; let c = null, prev = 0; log.forEach(([t, a]) => { if (!c || t - c.end > 320 || a > prev + D.rise - 0.001) { c = { start: t, end: t, peak: a }; o.push(c); } else { c.end = t; c.peak = Math.max(c.peak, a); } prev = a; }); return o; };
  const worstSecond = (starts) => starts.reduce((m, t, i) => Math.max(m, starts.filter(x => x >= t && x < t + 1000).length), 0);
  try {
    /* S3 */
    /* a fight in which both sides fired a gun (who carries one is the fight's own dice): three tries */
    let R = null; for (let i = 0; i < 3; i++) { R = await fight(); if (R.guns >= 4 && R.his > 0 && R.theirs > 0) break; }
    const F = flashes(R.log), N = R.seen || {};
    const longest = F.reduce((m, f) => Math.max(m, f.end - f.start), 0), peaks = Object.keys(R.white).map(k => R.white[k]), okPeak = F.every(f => peaks.some(pk => Math.abs(f.peak - pk) < 0.02));
    check(R.guns >= 4 && R.his > 0 && R.theirs > 0 && N.fired === R.guns && N.white + N.volley + N.held + (R.pend | 0) === N.fired && F.length === N.white && okPeak && longest <= 250 && N.barrelDrawn > 0 && worstSecond(F.map(f => f.start)) <= 3 && !errs.length, 'S3',
      'IN A FIGHT: ' + R.guns + ' gun shots in the fight\'s log (' + R.his + ' his, ' + R.theirs + ' theirs; ' + R.kinds.join(', ') + '), ' + N.fired + ' counted by the glass: ' + N.white + ' whites, ' + N.volley + ' joined a volley, ' + N.held + ' held; ' + F.length + ' flashes on the glass, each at its gun\'s peak (' + F.map(f => f.peak).join(', ') + '), the longest ' + longest + ' ms; the barrel drawn ' + (N.barrelDrawn | 0) + ' frames; the worst second began ' + worstSecond(F.map(f => f.start)) + '; ' + R.bows + ' bow shots threw none; page errors ' + errs.length);
    /* S4, S5: asked of the page's own shotFelt with the fight's own men */
    const synth = async (store, how) => { const { ctx, p } = await open(store);
      const out = await p.evaluate(async (how) => { UI.auto = false; const g = FIGHT.S.units.filter(u => FIGHT.isGun(u.weapon)), t = FIGHT.S.units.filter(u => u.side === 'them')[0], sleep = ms => new Promise(r => setTimeout(r, ms));
        UI.shots = []; UI.shotSeen = null; UI.shotLog = []; const now = performance.now() + 60;
        if (how === 'volley') for (let i = 0; i < 8; i++) shotFelt(g[i % g.length], t, now + i * 12, 500);
        if (how === 'stream') for (let i = 0; i < 12; i++) shotFelt(g[i % g.length], t, now + i * 200, 500);
        if (how === 'one') shotFelt(g.filter(u => shotKind(u) === 'pistol')[0] || g[0], t, now, 500);
        await sleep(how === 'stream' ? 3000 : 700);
        return { seen: UI.shotSeen, pend: (UI.shots || []).filter(q => !q.n0 && !q.off).length, log: UI.shotLog, soft: shotSoft(), pistol: DB.shot.white.pistol, softX: DB.shot.soft.white_x }; }, how);
      await ctx.close(); return out; };
    const V = await synth(null, 'volley'), ST = await synth(null, 'stream'), FV = flashes(V.log), FS = flashes(ST.log);
    const strobeOk = (S, FL) => S.seen.fired >= 12 && S.seen.white < 12 && S.seen.held >= 1 && S.seen.white + S.seen.volley + S.seen.held + (S.pend | 0) === S.seen.fired && worstSecond(FL.map(f => f.start)) <= 3;   /* the fight is live under the twelve: a man of theirs may fire one of his own */   /* two that reach the glass on one late frame are one flash (volley) */
    check(V.seen.white === 1 && V.seen.volley === 7 && FV.length === 1 && strobeOk(ST, FS), 'S4', 'A VOLLEY IS ONE FLASH, NEVER A STROBE: eight shots in a tenth of a second: ' + V.seen.white + ' white, ' + V.seen.volley + ' joined it, ' + FV.length + ' flash on the glass; twelve shots a fifth of a second apart: ' + ST.seen.white + ' whites, ' + ST.seen.volley + ' joined, ' + ST.seen.held + ' held of ' + ST.seen.fired + ' fired, the worst second began ' + worstSecond(FS.map(f => f.start)) + ' flashes');
    const full = await synth({ 'boh.flash': 'full', BOH_SETTINGS: JSON.stringify({ lessmo: true }) }, 'one'), soft = await synth({ 'boh.flash': 'soft' }, 'one'), less = await synth({ BOH_SETTINGS: JSON.stringify({ lessmo: true }) }, 'one');
    const pk = S => flashes(S.log).reduce((m, f) => Math.max(m, f.peak), 0);
    check(Math.abs(pk(full) - full.pistol) < 0.02 && !full.soft && soft.soft && Math.abs(pk(soft) - soft.pistol * soft.softX) < 0.02 && less.soft && Math.abs(pk(less) - less.pistol * less.softX) < 0.02, 'S5',
      'SOFT: a pistol whites the screen to ' + pk(full) + ' on FULL (even with MOTION: LESS), ' + pk(soft) + ' on FLASH: SOFT, ' + pk(less) + ' on MOTION: LESS with FLASH never picked (the soft share is x' + soft.softX + ')');
    /* ---- S6, S7, S8: THE GLASS ITSELF (row 650) ---- */
    /* the gate's own eye on the glass, every drawn frame, by its own rAF: the white's real opacity and the board's own pixels (the
       mean of all of them); a flash BEGINS on a frame where the glass is whiter by a tenth than the frame before (WCAG 2.3.1's tenth) */
    const SAMPLER = () => { const G = window.__GLASS = { frames: 0, starts: [], white: [], board: [], maxGap: 0 }; let chain = null, prev = null, pa = 0, pl = null, last = 0;
      /* the board's TRUE mean light: halved and halved again (each halving is the mean of four), never a few sample points (a hit's
         camera kick moves a sparse sample by a tenth and is not a flash; measured 11/18) */
      const mean = (cv) => { if (!chain || chain.w !== cv.width || chain.h !== cv.height) { chain = { w: cv.width, h: cv.height, L: [] }; let w = cv.width, h = cv.height; while (w > 16 || h > 16) { w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2)); const c = document.createElement('canvas'); c.width = w; c.height = h; chain.L.push(c); } }
        let src = cv; chain.L.forEach((c, k) => { const g = c.getContext('2d', { willReadFrequently: k === chain.L.length - 1 }); g.imageSmoothingEnabled = true; g.clearRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height); src = c; });
        const e = chain.L[chain.L.length - 1], d = e.getContext('2d').getImageData(0, 0, e.width, e.height).data, n = e.width * e.height; let s = 0; for (let i = 0; i < n; i++) s += (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255; return s / n; };
      const tick = (now) => { requestAnimationFrame(tick); try { const el = document.getElementById('shotflash'), a = el ? +getComputedStyle(el).opacity || 0 : 0, lum = mean(cx.canvas);
          const glass = lum * (1 - a) + a; G.frames++; if (last) G.maxGap = Math.max(G.maxGap, now - last); last = now;
          if (prev !== null && glass - prev >= 0.10) G.starts.push(Math.round(now));
          if (a > 0 && pa === 0) G.white.push(Math.round(now));
          if (pl !== null && lum - pl >= 0.10) G.board.push([Math.round(now), +(lum - pl).toFixed(2)]);
          prev = glass; pa = a; pl = lum; } catch (e) { G.err = String(e); } };
      requestAnimationFrame(tick); };
    const HEAVY = Object.assign({}, OPTS, { party: { count: 8, days: 60, difficulty: 1, band: ['brigand_marksman', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_marksman'], rolled: true, faction: 'brigands' },
      company: [{ background: 'militia', level: 3, gear: { main: 'snub_revolver' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'handgonne' } }, { name: 'RAUL', background: 'militia', level: 3, gear: { main: 'zip_gun' } }, { name: 'LUPE', background: 'militia', level: 3, gear: { main: 'snub_revolver' } }] });
    delete HEAVY.speed;
    const glassFight = async (hand) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }), p = await ctx.newPage();
      p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
      await p.addInitScript(([o, h]) => { window.FIGHT_OPTS = o; try { localStorage.setItem('bohemia.fight.speed', String(h)); } catch (e) {} }, [HEAVY, hand]);
      await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
      await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0 && !!DB.shot, null, { timeout: 60000 }); await p.evaluate(SAMPLER);
      const t0 = Date.now(); while (Date.now() - t0 < 38000) { const o = await p.evaluate(() => !!FIGHT.S.over); if (o) break; await p.waitForTimeout(400); }
      await p.waitForTimeout(500);
      const R = await p.evaluate(() => ({ seen: UI.shotSeen || {}, G: window.__GLASS, cap: { n: UI.glass ? UI.glass.n : -1, held: UI.glass ? UI.glass.held : -1 }, hand: UI.hand, auto: !!UI.auto, beat: Math.round(beatMs()) })); await ctx.close(); return R; };
    { const HANDS = [1, 2, 4], enough = R => (R.seen.fired | 0) >= 4 && R.G.white.length >= 3, RS = await Promise.all(HANDS.map(glassFight)), bad = [], says = [];
      /* a fight too short to say anything is played again (who shoots is the fight's own dice): up to two more, side by side */
      for (let t = 0; t < 2 && RS.some(R => !enough(R)); t++) { const again = await Promise.all(HANDS.map((h, i) => enough(RS[i]) ? null : glassFight(h))); again.forEach((R, i) => { if (R) RS[i] = R; }); }
      RS.forEach((R, i) => { const m = worstSecond(R.G.starts), mw = worstSecond(R.G.white);
        says.push(HANDS[i] + 'x (a beat ' + R.beat + ' ms): ' + (R.seen.fired | 0) + ' shots, ' + R.G.starts.length + ' flashes begun on the glass over ' + R.G.frames + ' drawn frames (the longest frame ' + Math.round(R.G.maxGap) + ' ms), the worst second ' + m + ' (the white alone ' + mw + '), the page held ' + (R.seen.held | 0) + (R.G.board.length ? ', the board alone got whiter ' + R.G.board.length + ' times' : ''));
        if (R.hand !== HANDS[i] || !R.auto) bad.push(HANDS[i] + 'x: not on AUTO at that speed');
        if (R.G.err || R.G.frames < 120) bad.push(HANDS[i] + 'x: the glass was not read (' + (R.G.err || R.G.frames + ' frames') + ')');
        if ((R.seen.fired | 0) < 4 || R.G.white.length < 3) bad.push(HANDS[i] + 'x: too few shots to say (' + (R.seen.fired | 0) + ' shots, ' + R.G.white.length + ' whites)');
        if (m > 3 || mw > 3) bad.push(HANDS[i] + 'x: ' + Math.max(m, mw) + ' BEGAN IN ONE SECOND ON THE GLASS'); });
      check(!bad.length && !errs.length, 'S6', 'THE GLASS ITSELF AT 1x, 2x AND 4x ON AUTO, three fights side by side, every drawn frame read off the glass: ' + says.join('; ') + '; page errors ' + errs.length + (bad.length ? '; BAD: ' + bad.join(' | ') : '')); }
    /* S7: the schedule is legal, the frames are late */
    const late = async (how) => { const { ctx, p } = await open(); await p.evaluate(SAMPLER);
      const out = await p.evaluate(async (how) => { UI.auto = false; const g = FIGHT.S.units.filter(u => FIGHT.isGun(u.weapon)), t = FIGHT.S.units.filter(u => u.side === 'them')[0], sleep = ms => new Promise(r => setTimeout(r, ms)), busy = ms => { const t0 = performance.now(); while (performance.now() - t0 < ms) {} };
        await sleep(1300); const G = window.__GLASS; G.starts = []; G.white = []; UI.shots = []; UI.shotSeen = null; UI.shotLog = []; const now = performance.now() + 40;
        if (how === 'four') { [0, 334, 668, 1002].forEach((d, i) => shotFelt(g[i % g.length], t, now + d, 500)); await sleep(30); busy(90); await sleep(1700); }
        else { for (let i = 0; i < 14; i++) shotFelt(g[i % g.length], t, now + i * 260, 500); const end = now + 14 * 260 + 500; let k = 7; while (performance.now() < end) { k = (k * 1103515245 + 12345) % 2147483648; await sleep(40 + k % 160); busy(50 + k % 90); } await sleep(300); }
        return { seen: UI.shotSeen, pend: (UI.shots || []).filter(q => !q.n0 && !q.off).length, starts: G.starts, white: G.white, gap: Math.round(G.maxGap) }; }, how);
      await ctx.close(); return out; };
    { const A = await late('four'), B2 = await late('stream'), wa = worstSecond(A.white), wb = Math.max(worstSecond(B2.white), worstSecond(B2.starts));
      /* the fight is live under these shots: a man of theirs may fire one of his own, so the counts are at least, and sum to what was fired */
      check(A.seen.fired >= 4 && A.seen.white + A.seen.volley + A.seen.held + A.pend === A.seen.fired && A.white.length >= 1 && wa <= 3 && worstSecond(A.starts) <= 3 && B2.seen.fired >= 14 && wb <= 3 && B2.seen.held >= 1 && B2.seen.white + B2.seen.volley + B2.seen.held + B2.pend === B2.seen.fired, 'S7',
        'A LATE FRAME NEVER MAKES A FOURTH: four shots a third of a second apart, the page busy 90 ms at the first: ' + A.white.length + ' begin on the glass (' + (A.white.length ? A.white[A.white.length - 1] - A.white[0] : 0) + ' ms first to last), ' + A.seen.held + ' held; fourteen shots a quarter second apart with the page stalling (the longest frame ' + B2.gap + ' ms): ' + B2.white.length + ' begin on the glass, ' + B2.seen.held + ' held, the worst second ' + wb); }
    /* S8: the vest's white */
    { const vest = async (store, how) => { const { ctx, p } = await open(store); await p.evaluate(SAMPLER);
        const out = await p.evaluate(async (how) => { UI.auto = false; const g = FIGHT.S.units.filter(u => FIGHT.isGun(u.weapon)), t = FIGHT.S.units.filter(u => u.side === 'them')[0], sleep = ms => new Promise(r => setTimeout(r, ms));
          await sleep(1300); const G = window.__GLASS; G.starts = []; G.white = []; G.board = []; UI.shots = []; UI.shotSeen = null; const now = performance.now() + 40;
          if (how === 'after three') { [0, 200, 400].forEach((d, i) => shotFelt(g[i % g.length], t, now + d, 500)); UI.whiteAt = now + 650; } else UI.whiteAt = now;
          await sleep(1500); return { board: G.board, white: G.white.length, ok: UI.glass.sparkOk, soft: UI.glass.sparkSoft }; }, how);
        await ctx.close(); return out; };
      const alone = await vest(null, 'alone'), after = await vest(null, 'after three'), soft = await vest({ 'boh.flash': 'soft' }, 'alone'), jump = R => R.board.reduce((m, q) => Math.max(m, q[1]), 0);
      check(alone.ok && jump(alone) >= 0.3 && after.white === 3 && !after.ok && jump(after) < 0.10 && soft.ok && soft.soft === D.soft.white_x && jump(soft) < jump(alone) * 0.5, 'S8',
        'THE VEST\'S WHITE ASKS THE SAME CAP: alone the board gets whiter by ' + jump(alone) + ' (read off its pixels); after three flashes inside the second it is not drawn (the board moved ' + jump(after) + '); on FLASH: SOFT it is ' + jump(soft) + ' (the soft share x' + soft.soft + ')'); }
    /* planted */
    plant = 'strobe'; { const PL = await late('stream'), P4 = await late('four'), pw = Math.max(worstSecond(PL.white), worstSecond(PL.starts));
      check(pw >= 4, 'S7 planted', 'the cap taken out of the glass: fourteen shots a quarter second apart begin ' + pw + ' in one second ON THE GLASS (the gate\'s own eye, not the page\'s count), ' + ((PL.seen && PL.seen.held) | 0) + ' held; the four a third of a second apart with a late first frame: ' + P4.white.length + ' begin inside ' + (P4.white.length ? P4.white[P4.white.length - 1] - P4.white[0] : 0) + ' ms'); }
    plant = 'strobe'; const PS = await synth(null, 'stream'), PF = flashes(PS.log);
    check(!strobeOk(PS, PF), 'S4 planted', 'the three-a-second line taken out: twelve shots throw ' + PS.seen.white + ' whites, the worst second began ' + worstSecond(PF.map(f => f.start)) + ' flashes');
    plant = 'hook'; const PR = await fight();
    check(PR.guns >= 2 && !(PR.seen && PR.seen.fired), 'S3 planted', 'the gun\'s line taken out: ' + PR.guns + ' gun shots in the fight, ' + ((PR.seen && PR.seen.fired) | 0) + ' felt');
  } catch (e) { check(false, 'S3', 'the page leg threw: ' + String(e && e.message || e).slice(0, 220)); }
  await b.close(); srv.close(); done();
})();
function done() { console.log('\nEVERY SHOT IS FELT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
