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
     planted: the three-a-second line taken out (S4 red); the gun's line taken out (S3 red)
   Run: node gates/every_shot_is_felt_gate.js      (about fifty seconds) */
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
    if (plant && /BOHEMIA_FIGHT\.html$/.test(rel)) { const s = String(body), t = plant === 'strobe' ? s.replace('>= D.max_per_second) { N.held++; return; }', '>= 99) { N.held++; return; }') : s.replace('shotFelt(u, t, a.at + B * 0.35, B);   /* __EVERY_SHOT_IS_FELT__', ';   /* __EVERY_SHOT_IS_FELT__'); if (t === s) throw new Error('the plant did not take'); body = Buffer.from(t); }
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
    const R = await p.evaluate(() => { const L = window.__SHOT; return { seen: UI.shotSeen, log: UI.shotLog || [], guns: L.guns, his: L.his, theirs: L.theirs, bows: L.bows, kinds: Object.keys(L.kinds), white: DB.shot.white, at: UI.shotAt || null, over: !!FIGHT.S.over }; });
    await ctx.close(); return R; };
  /* the flashes off the glass's own log: a flash begins where the white rises (or after a third of a second of nothing) */
  const flashes = (log) => { const o = []; let c = null, prev = 0; log.forEach(([t, a]) => { if (!c || t - c.end > 320 || a > prev + 0.015) { c = { start: t, end: t, peak: a }; o.push(c); } else { c.end = t; c.peak = Math.max(c.peak, a); } prev = a; }); return o; };
  const worstSecond = (starts) => starts.reduce((m, t, i) => Math.max(m, starts.filter(x => x >= t && x < t + 1000).length), 0);
  try {
    /* S3 */
    const R = await fight(), F = flashes(R.log), N = R.seen || {};
    const longest = F.reduce((m, f) => Math.max(m, f.end - f.start), 0), peaks = Object.keys(R.white).map(k => R.white[k]), okPeak = F.every(f => peaks.some(pk => Math.abs(f.peak - pk) < 0.02));
    check(R.guns >= 4 && R.his > 0 && R.theirs > 0 && N.fired === R.guns && N.white + N.volley + N.held === N.fired && F.length === N.white && okPeak && longest <= 250 && N.barrelDrawn > 0 && worstSecond(F.map(f => f.start)) <= 3 && !errs.length, 'S3',
      'IN A FIGHT: ' + R.guns + ' gun shots in the fight\'s log (' + R.his + ' his, ' + R.theirs + ' theirs; ' + R.kinds.join(', ') + '), ' + N.fired + ' counted by the glass: ' + N.white + ' whites, ' + N.volley + ' joined a volley, ' + N.held + ' held; ' + F.length + ' flashes on the glass, each at its gun\'s peak (' + F.map(f => f.peak).join(', ') + '), the longest ' + longest + ' ms; the barrel drawn ' + (N.barrelDrawn | 0) + ' frames; the worst second began ' + worstSecond(F.map(f => f.start)) + '; ' + R.bows + ' bow shots threw none; page errors ' + errs.length);
    /* S4, S5: asked of the page's own shotFelt with the fight's own men */
    const synth = async (store, how) => { const { ctx, p } = await open(store);
      const out = await p.evaluate(async (how) => { UI.auto = false; const g = FIGHT.S.units.filter(u => FIGHT.isGun(u.weapon)), t = FIGHT.S.units.filter(u => u.side === 'them')[0], sleep = ms => new Promise(r => setTimeout(r, ms));
        UI.shots = []; UI.shotSeen = null; UI.shotLog = []; const now = performance.now() + 60;
        if (how === 'volley') for (let i = 0; i < 8; i++) shotFelt(g[i % g.length], t, now + i * 12, 500);
        if (how === 'stream') for (let i = 0; i < 12; i++) shotFelt(g[i % g.length], t, now + i * 200, 500);
        if (how === 'one') shotFelt(g.filter(u => shotKind(u) === 'pistol')[0] || g[0], t, now, 500);
        await sleep(how === 'stream' ? 3000 : 700);
        return { seen: UI.shotSeen, log: UI.shotLog, soft: shotSoft(), pistol: DB.shot.white.pistol, softX: DB.shot.soft.white_x }; }, how);
      await ctx.close(); return out; };
    const V = await synth(null, 'volley'), ST = await synth(null, 'stream'), FV = flashes(V.log), FS = flashes(ST.log);
    const strobeOk = (S, FL) => S.seen.white < 12 && S.seen.held >= 1 && S.seen.white + S.seen.held === 12 && worstSecond(FL.map(f => f.start)) <= 3;
    check(V.seen.white === 1 && V.seen.volley === 7 && FV.length === 1 && strobeOk(ST, FS), 'S4', 'A VOLLEY IS ONE FLASH, NEVER A STROBE: eight shots in a tenth of a second: ' + V.seen.white + ' white, ' + V.seen.volley + ' joined it, ' + FV.length + ' flash on the glass; twelve shots a fifth of a second apart: ' + ST.seen.white + ' whites, ' + ST.seen.held + ' held, the worst second began ' + worstSecond(FS.map(f => f.start)) + ' flashes');
    const full = await synth({ 'boh.flash': 'full', BOH_SETTINGS: JSON.stringify({ lessmo: true }) }, 'one'), soft = await synth({ 'boh.flash': 'soft' }, 'one'), less = await synth({ BOH_SETTINGS: JSON.stringify({ lessmo: true }) }, 'one');
    const pk = S => flashes(S.log).reduce((m, f) => Math.max(m, f.peak), 0);
    check(Math.abs(pk(full) - full.pistol) < 0.02 && !full.soft && soft.soft && Math.abs(pk(soft) - soft.pistol * soft.softX) < 0.02 && less.soft && Math.abs(pk(less) - less.pistol * less.softX) < 0.02, 'S5',
      'SOFT: a pistol whites the screen to ' + pk(full) + ' on FULL (even with MOTION: LESS), ' + pk(soft) + ' on FLASH: SOFT, ' + pk(less) + ' on MOTION: LESS with FLASH never picked (the soft share is x' + soft.softX + ')');
    /* planted */
    plant = 'strobe'; const PS = await synth(null, 'stream'), PF = flashes(PS.log);
    check(!strobeOk(PS, PF), 'S4 planted', 'the three-a-second line taken out: twelve shots throw ' + PS.seen.white + ' whites, the worst second began ' + worstSecond(PF.map(f => f.start)) + ' flashes');
    plant = 'hook'; const PR = await fight();
    check(PR.guns >= 2 && !(PR.seen && PR.seen.fired), 'S3 planted', 'the gun\'s line taken out: ' + PR.guns + ' gun shots in the fight, ' + ((PR.seen && PR.seen.fired) | 0) + ' felt');
  } catch (e) { check(false, 'S3', 'the page leg threw: ' + String(e && e.message || e).slice(0, 220)); }
  await b.close(); srv.close(); done();
})();
function done() { console.log('\nEVERY SHOT IS FELT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
