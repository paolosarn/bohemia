#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN THREE: THE WALK, FIRST SECOND TO END SCREEN (rule 461, rule 449(b), rule 441(a)).
   'Walk the whole fight on a phone upright and on its side, first second to end screen, and fix every ugly or unclear thing you
   find, the screen as a whole before any one card.'
   Opens the real page (the demo or the alpha) the way a stranger opens it, a phone upright (390 x 844) or on its side (844 x 390),
   meets a road crew through the map's own card, presses ENGAGE with a finger and walks the whole fight:
     the card; the first seconds (stills at 0.3, 1, 2, 3.5, 5 s); FIGHT; his first turn (his card, a finger on a lit square: a step);
     AUTO at 2x to the end with a still every 2.5 s; the end screen; LEAVE; the map again.
   At every still the glass is READ, not just pictured: every card of the fight's glass that is up (the why line, the veteran, the
   crew's call, the strip, the sheet, the end, the wipe, the pick, the hurts), its box in points, whether it is off the glass, whether
   any of its words are cut (a box whose words overflow it), and EVERY PAIR OF THEM THAT LIE ON EACH OTHER (two cards at once is the
   defect this tool was written for), and whether the phone lies on any of them.
   node tools/bohemia_fight_screen_the_walk.js <alpha|demo> <upright|sideways> <outdir> [road|beasts]
   BEFORE=1 serves the fight's page (and this lane's files) as BEFORE_REF (default HEAD) has them.
   FRAMES=1 (rule 480(c)(d), 11/26: 'make sure fps is never choppy for nothing'): once the map is up the phone is slowed four times
   (Emulation.setCPUThrottlingRate 4, the rule's own slowed phone) and every painted frame of the whole page is counted (a 1-pixel canvas
   drawn each frame: an empty rAF chain is handed frames lazily, gates/bohemia_phone_perf.js); every still becomes a MARK instead of a
   screenshot (a screenshot stalls frames itself) and two more moments are walked on his turn (his sheet opened and closed by a finger).
   walk.json then carries frames: per stretch between two marks, its frames a second, its longest frame and every frame past 50 ms.
   Writes <outdir>/walk.json and <outdir>/shots/*.png.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/fight_walk', CASE = process.argv[5] || 'road';
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { execSync } = require('child_process');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
const MINE = ['slices/BOHEMIA_FIGHT.html', 'slices/bohemia_fight_why.js', 'slices/bohemia_fight_opener.js', 'slices/bohemia_fight_face.js', 'slices/bohemia_fight_glass.js', 'slices/BOHEMIA_SPOILS_SCREEN.html'];
const OLD = {}; if (process.env.BEFORE) for (const f of MINE) { try { OLD[f] = execSync('git show ' + (process.env.BEFORE_REF || 'HEAD') + ':' + f, { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { OLD[f] = Buffer.from('/* not on ' + (process.env.BEFORE_REF || 'HEAD') + ' */'); } }

/* THE GLASS, READ IN THE FIGHT'S FRAME: every card of the fight's own glass that is up */
const READ_GLASS = () => {
  const ids = ['why', 'vet', 'call', 'say', 'drawer', 'over', 'wipe', 'pick', 'hurts', 'winds', 'outap', 'num', 'top', 'bot'];
  const W = innerWidth, H = innerHeight, up = [];
  for (const id of ids) { const e = document.getElementById(id); if (!e) continue; const st = getComputedStyle(e);
    if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity < 0.05) continue; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    if (!(e.textContent || '').trim() && !e.querySelector('canvas,img,button')) continue;
    const cut = [...e.querySelectorAll('*')].concat([e]).filter(x => { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden') return false; if (!(x.textContent || '').trim()) return false; return (x.scrollWidth > x.clientWidth + 2 && /hidden|clip/.test(s.overflowX + s.overflow)) || (x.scrollHeight > x.clientHeight + 2 && /hidden|clip/.test(s.overflowY + s.overflow)); }).map(x => (x.id || x.className || x.tagName) + ':' + (x.textContent || '').trim().slice(0, 40));
    up.push({ id, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), off: r.x < -1 || r.y < -1 || r.right > W + 1 || r.bottom > H + 1, cut, text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90), bg: st.backgroundColor, img: st.backgroundImage !== 'none' });
  }
  const over = [], talk = ['why', 'vet', 'call', 'say', 'drawer', 'over', 'wipe', 'pick'];
  for (let i = 0; i < up.length; i++) for (let j = i + 1; j < up.length; j++) { const a = up[i], b = up[j]; if (!talk.includes(a.id) && !talk.includes(b.id)) continue;
    const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > 2 && iy > 2) over.push(a.id + '/' + b.id + ' ' + ix + 'x' + iy); }
  let S = null; try { const s = FIGHT.S; S = { round: s.round, deploy: !!s.deploy, over: !!s.over, mine: (function () { const u = FIGHT.current(); return u ? u.side + ':' + u.name : null; })(), hand: UI.hand, auto: !!UI.auto, log: s.log.length, alive: s.units.filter(u => u.hp > 0).map(u => u.side[0]).join('') }; } catch (e) {}
  /* the men on the glass: a man's whole figure (his box and half a figure either side, the fight's own allFramed) inside the glass, never under the phone's corner counted here */
  let men = null; try { const f = manH() * FIG_HALF; men = FIGHT.S.units.filter(v => FIGHT.onField(v)).map(v => { const b = manBox(v.x, v.y); return { s: v.side[0], off: b.x - f < -1 || b.x + f > W + 1 || b.head < -1 || b.feet > H + 1, cut: Math.round(Math.max(0, -(b.x - f), (b.x + f) - W)) }; }); } catch (e) { men = { err: String(e).slice(0, 80) }; }
  return { W, H, up, over, S, men, zoom: (function () { try { return { z: +UI.zoom.toFixed(3), far: +UI.far.toFixed(3), near: +UI.near.toFixed(3), coverFar: UI.coverFar || null }; } catch (e) { return null; } })() };
};

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: +(process.env.SCALE || 1), hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (OLD[rel]) return route.fulfill({ status: 200, body: OLD[rel], headers: { 'Content-Type': MIME[path.extname(rel)] } });
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapText = async (sel, re, only) => { for (const f of (only ? [only] : page.frames())) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 3 && r.height > 3 && st.visibility !== 'hidden' && st.display !== 'none'; }).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]); if (!b) continue; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; } catch (e) {} } return false; };
  const W = { which: WHICH, way: WAY, case: CASE, before: !!process.env.BEFORE, stills: [] };
  const phoneBox = async () => page.evaluate(() => { const p = document.getElementById('bohphone'); if (!p || getComputedStyle(p).display === 'none') return null; const r = p.getBoundingClientRect(), h = p.querySelector('.fight .fh'); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), card: h ? (h.classList.contains('them') ? 'THEIRS ' : 'HIS ') + (h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) : null }; }).catch(() => null);
  const FR = !!process.env.FRAMES;
  /* PROFILE=a,b,...: a CPU profile from each named mark to the next one; the time each function spent itself, summed by name and file:line */
  const PROF = (process.env.PROFILE || '').split(',').filter(Boolean); let cdp = null, profAt = null; W.profiles = {};
  const profStop = async () => { if (!profAt || !cdp) return; const at = profAt; profAt = null; try { const { profile } = await cdp.send('Profiler.stop'); if (process.env.PROFILE_RAW) { try { fs.writeFileSync(path.join(OUT, 'profile_' + at + '.cpuprofile'), JSON.stringify(profile)); } catch (e) {} } const self = {}, dt = profile.timeDeltas || [], ids = profile.samples || [], byId = {};
      for (const nd of profile.nodes) byId[nd.id] = nd; for (let i = 0; i < ids.length; i++) { const nd = byId[ids[i]], cf = nd.callFrame, k = (cf.functionName || '(anon)') + ' ' + String(cf.url || '').split('/').pop() + ':' + (cf.lineNumber + 1); self[k] = (self[k] || 0) + (dt[i] || 0) / 1000; }
      const tot = Object.values(self).reduce((a, b) => a + b, 0); W.profiles[at] = { ms: Math.round(tot), top: Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 18).map(e => [e[0], Math.round(e[1])]) };
      /* and INCLUSIVE: the time each function and everything it called took (a stack counts a function once) */
      const par = {}; for (const nd of profile.nodes) for (const c of (nd.children || [])) par[c] = nd.id; const inc = {};
      for (let i = 0; i < ids.length; i++) { const seen = new Set(); let id = ids[i]; while (id != null) { const cf = byId[id].callFrame, k = (cf.functionName || '(anon)') + ' ' + String(cf.url || '').split('/').pop() + ':' + (cf.lineNumber + 1); if (cf.url && !seen.has(k)) { seen.add(k); inc[k] = (inc[k] || 0) + (dt[i] || 0) / 1000; } id = par[id]; } }
      W.profiles[at].inclusive = Object.entries(inc).sort((a, b) => b[1] - a[1]).slice(0, 40).map(e => [e[0], Math.round(e[1])]);
      log('PROFILE', at, Math.round(tot) + ' ms sampled'); for (const [k, v] of W.profiles[at].top.slice(0, 8)) log('   self', String(v).padStart(6) + ' ms', k); for (const [k, v] of W.profiles[at].inclusive) log('   incl', String(v).padStart(6) + ' ms', k); } catch (e) { log('PROFILE FAILED', at, String(e).slice(0, 120)); } };
  /* TRACE=a,b,...: a Chrome trace from each named mark to the next: every main-thread task past 50 ms, what it was made of (the direct
     steps inside it: a script by its file and function, style, layout, paint, a canvas's own draw), and the window's totals by step */
  const TRC = (process.env.TRACE || '').split(',').filter(Boolean); let trcAt = null, trcEv = []; W.traces = {};
  const trcStop = async () => { if (!trcAt || !cdp) return; const at = trcAt; trcAt = null;
    const done = new Promise(res => cdp.once('Tracing.tracingComplete', res)); await cdp.send('Tracing.end'); await done;
    const ev = trcEv; trcEv = []; const main = {}; if (process.env.TRACE_RAW) { try { fs.writeFileSync(path.join(OUT, 'trace_' + at + '.json'), JSON.stringify(ev)); } catch (e) {} } log('TRACE EVENTS', at, ev.length); ev.forEach(e => { if (e.ph === 'M' && e.name === 'thread_name' && e.args && e.args.name === 'CrRendererMain') main[e.pid + ':' + e.tid] = 1; });
    const X = ev.filter(e => e.ph === 'X' && main[e.pid + ':' + e.tid] && e.dur != null).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
    const name = (e) => { const d = (e.args && (e.args.data || e.args.beginData)) || {}; const u = String(d.url || (d.stackTrace && d.stackTrace[0] && d.stackTrace[0].url) || d.frame || '').split('/').pop().split('?')[0];
      return e.name + (d.functionName ? ' ' + d.functionName : '') + (u ? ' ' + u.slice(0, 40) : '') + (d.lineNumber != null && e.name === 'FunctionCall' ? ':' + (d.lineNumber + 1) : ''); };
    const tasks = X.filter(e => e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask'), long = [], tot = {};
    for (const t of tasks) { const kids = X.filter(e => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.name !== 'RunTask' && e.name !== 'ThreadControllerImpl::RunTask');
      const top = []; let edge = -1; for (const k of kids) { if (k.ts >= edge) { top.push(k); edge = k.ts + k.dur; } }
      top.forEach(k => { const n = name(k); tot[n] = (tot[n] || 0) + k.dur / 1000; });
      if (t.dur > 50000) { const by = {}; top.forEach(k => { const n = name(k); by[n] = (by[n] || 0) + k.dur / 1000; }); long.push({ ms: Math.round(t.dur / 1000), parts: Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => [e[0], Math.round(e[1])]) }); } }
    W.traces[at] = { long: long.sort((a, b) => b.ms - a.ms).slice(0, 10), totals: Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 16).map(e => [e[0], Math.round(e[1])]) };
    log('TRACE', at, long.length + ' tasks past 50 ms'); for (const l of W.traces[at].long.slice(0, 6)) log('   task ' + l.ms + ' ms:', l.parts.map(p => p[1] + ' ' + p[0]).join(' | ')); log('   totals:', W.traces[at].totals.slice(0, 10).map(p => p[1] + ' ' + p[0]).join(' | ')); };
  const GLN = [];
  const mark = async (n) => { await page.evaluate((n) => { if (window.__FR) window.__FR.marks.push({ n: n, t: performance.now() }); }, n).catch(() => null);
    { const ff = fightF(); if (ff) { const xs = await ff.evaluate(() => { const a = window.__GL || []; window.__GL = []; return a; }).catch(() => null); if (xs) GLN.push.apply(GLN, xs); } }
    if (trcAt) await trcStop(); if (cdp && TRC.includes(n)) { try { trcEv = []; await cdp.send('Tracing.start', { categories: 'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,v8.execute,__metadata', transferMode: 'ReportEvents' }); trcAt = n; } catch (e) { log('TRACE FAILED', String(e).slice(0, 100)); } }
    if (profAt) await profStop(); if (cdp && PROF.includes(n)) { try { await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start'); profAt = n; } catch (e) {} } };
  const still = async (n) => { if (FR) { await mark(n); log('MARK', n); W.stills.push({ n, t: Date.now() }); return; } let g = null; const f = fightF(); if (f) { g = await f.evaluate(READ_GLASS).catch(e => ({ err: String(e).slice(0, 120) })); const fb = await box(f).catch(() => null);
      const ph = await phoneBox(); if (g && g.up && ph && fb) { g.phone = ph; g.underPhone = g.up.filter(c => ['why', 'vet', 'call', 'say', 'drawer', 'pick'].includes(c.id)).filter(c => { const x = c.x + fb.x, y = c.y + fb.y; return Math.min(x + c.w, ph.x + ph.w) - Math.max(x, ph.x) > 2 && Math.min(y + c.h, ph.y + ph.h) - Math.max(y, ph.y) > 2; }).map(c => c.id); } }
    const sp = frame(/SPOILS_SCREEN/); if (sp) g = Object.assign(g || {}, { spoils: await sp.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300)).catch(() => null) });
    try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {}
    W.stills.push({ n, t: Date.now(), g }); log('STILL', n, g && g.up ? g.up.map(c => c.id + (c.off ? '!OFF' : '') + (c.cut.length ? '!CUT' : '')).join(',') : '', g && g.over && g.over.length ? 'OVERLAP ' + g.over.join(';') : '', g && g.underPhone && g.underPhone.length ? 'UNDER PHONE ' + g.underPhone.join(',') : '', g && g.S ? JSON.stringify(g.S) : '', g && g.phone && g.phone.card ? 'PHONE ' + g.phone.card : '', g && Array.isArray(g.men) && g.men.some(m => m.off) ? 'MEN OFF ' + g.men.filter(m => m.off).map(m => m.s + m.cut).join(',') + ' z' + JSON.stringify(g.zoom) : '', g && g.spoils ? 'SPOILS ' + g.spoils.slice(0, 80) : ''); };
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(() => tapText('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(() => tapText('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(() => tapText('button,div', '^GO$'), 30000);
  for (let i = 0; i < 4; i++) { const up = await page.evaluate(() => { const m = document.getElementById('mainmaker'); return !!m && getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().height > 50; }); if (!up) break; await wait(1500); await tapText('button,div', '^GO$'); await wait(1500); }
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000); await wait(5000);
  try { await tapText('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}
  await city().evaluate(() => { if (MODE !== 'city') { try { swapMode(); } catch (e) {} } }).catch(() => null);
  await until(async () => city().evaluate(() => MODE === 'city'), 8000); await wait(1500);
  await city().evaluate(offTheTown).catch(() => null);
  await until(async () => city().evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 30000);
  if (FR) { await page.evaluate(() => { window.__FR = { t: [], marks: [] }; const c = document.createElement('canvas'); c.width = c.height = 1;
      c.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;z-index:2147483647;pointer-events:none;opacity:.02'; document.body.appendChild(c);
      const g = c.getContext('2d'); let n = 0; const step = (ts) => { window.__FR.t.push(ts); n++; g.fillStyle = (n & 1) ? '#000' : '#fff'; g.fillRect(0, 0, 1, 1); requestAnimationFrame(step); }; requestAnimationFrame(step); });
    cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); if (PROF.length) await cdp.send('Profiler.enable'); cdp.on('Tracing.dataCollected', (m) => { for (const e of m.value) trcEv.push(e); });
    await wait(3000); await mark('map_idle'); await wait(4000); }
  if (FR) await mark('00a_meet_called');
  W.met = await city().evaluate((CASE) => { const band = CASE === 'beasts' ? ['wolf', 'wolf', 'wolf'] : ['brigand_thug', 'brigand_thug', 'brigand_raider'];
    const at = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })();
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: CASE === 'beasts' ? 'a pack' : 'the toll crew', faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: CASE === 'beasts' ? 'beast' : 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: CASE === 'beasts' ? 'beasts' : 'brigands', band: band, rolled: true }, street: true, why: CASE === 'beasts' ? 'road:pack' : 'road:toll_crew', at: { gx: at[0] | 0, gy: at[1] | 0 } };
    try { MEET.on = true; return { ok: meetWalk(function () { return cityHandOver(msg); }), at: at }; } catch (e) { return { err: String(e) }; } }, CASE).catch(e => ({ err: String(e) }));
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
  if (hasCard) { await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60); await wait(1300); await still('00_card');
    await tapSel(city(), '#meetcard button[data-meet="go"]'); if (FR) await mark('00b_engage_tapped'); }
  log('MET', hasCard, JSON.stringify(W.met));
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000, 50);
  const f = fightF(); if (!f) { log('NO FIGHT'); W.errs = errs; fs.writeFileSync(path.join(OUT, 'walk.json'), JSON.stringify(W, null, 1)); process.exit(1); }
  /* FRAMES: what each of this lane's pieces costs per call, in the fight's page (the card's refresh, the sheet) and on the phone (the card's repaint) */
  if (FR) { await f.evaluate((WRAP) => { window.__GL = []; ['hud', 'drawer'].concat((WRAP || '').split(',').filter(Boolean)).forEach(function (n) { const o = window[n]; if (typeof o !== 'function') return;
      window[n] = function () { const t = performance.now(); try { return o.apply(this, arguments); } finally { window.__GL.push([n, performance.timeOrigin + t, performance.now() - t]); } }; }); }, process.env.WRAP || '').catch(() => null);
    await page.evaluate(() => { window.__PHONE_MAN_T = { n: 0, ms: 0, max: 0, list: [] }; }).catch(() => null); }
  const t0 = Date.now();
  for (const [ms, n] of [[300, '01_first_0_3s'], [1000, '02_first_1s'], [2000, '03_first_2s'], [3500, '04_first_3_5s'], [5000, '05_first_5s']]) { const d = ms - (Date.now() - t0); if (d > 0) await wait(d); await still(n); }
  /* END=withdraw: RETREAT from the lineup (rule 253: one press), nobody moved */
  if (process.env.END === 'withdraw') { await tapSel(page.mainFrame(), '#bohphone button[data-c="flee"]'); await wait(300); await still('06w_withdraw_pressed'); await wait(1200); await still('06w_withdraw_1_5s');
    await wait(2500); await still('06w_withdraw_4s'); W.overCard = await f.evaluate(() => { const o = document.getElementById('over'); const st = getComputedStyle(o); return { display: st.display, visibility: st.visibility, head: (document.getElementById('oh') || {}).textContent }; }).catch(() => null);
    log('OVER CARD', JSON.stringify(W.overCard)); await wait(3000); await still('06w_withdraw_7s'); W.errs = errs; fs.writeFileSync(path.join(OUT, 'walk.json'), JSON.stringify(W, null, 1)); log('DONE', WHICH, WAY, 'withdraw', 'page errors', errs.length); await browser.close(); process.exit(0); }
  /* END=lose: his men a breath from the end (1 health, no armour), then the fight plays out on AUTO */
  if (process.env.END === 'lose') await f.evaluate(() => { FIGHT.S.units.filter(v => v.side === 'you').forEach(v => { v.hp = 1; v.armB = 0; v.armH = 0; }); hud(); });
  /* FIGHT with a finger */
  await tapSel(page.mainFrame(), '#bohphone .fgo'); await wait(400); await still('06_after_fight_pressed');
  const his = await until(async () => f.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'you' && !UI.anim.length && !FIGHT.S.deploy; }), FR ? 120000 : 30000, 200);
  await wait(700); await still('07_his_turn');
  /* FRAMES: his sheet, opened and closed by a finger on his face on the phone's card */
  if (FR && his) { await wait(1500); await mark('07a_sheet_open'); await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(2000); await mark('07b_sheet_close'); await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(2000); await mark('07c_his_turn_idle'); await wait(1500); }
  /* a step by hand: a finger on a lit square of his reach */
  if (his) { const sq = await f.evaluate(() => { try { const u = FIGHT.current(), S = FIGHT.S, best = FIGHT.reach(u, null, true).best;
          const ok = Object.keys(best).map(Number).map(k => [k % S.w, Math.floor(k / S.w)]).filter(([x, y]) => (x !== u.x || y !== u.y) && !S.units.some(o => o.hp > 0 && o.x === x && o.y === y));
          ok.sort((a, b) => (b[0] - a[0]) || (Math.abs(a[1] - u.y) - Math.abs(b[1] - u.y)));
          const c = ok.find(([x, y]) => x > u.x && Math.abs(x - u.x) <= 2) || ok[0]; if (!c) return null;
          return { x: sx((c[0] + .5 + stagger(c[1])) * UI.tw), y: sy((c[1] + .6) * UI.th), c, from: [u.x, u.y] }; } catch (e) { return { err: String(e) }; } }).catch(() => null);
    W.step = sq; if (sq && sq.x != null) { const fb = await box(f); await page.touchscreen.tap(fb.x + sq.x, fb.y + sq.y); await wait(500); await still('08_square_tapped'); await page.touchscreen.tap(fb.x + sq.x, fb.y + sq.y); await wait(1200); await still('09_after_step'); } }
  /* AUTO at 2x, a still every 2.5 s, to the end */
  const phoneB = async (c) => tapSel(page.mainFrame(), '#bohphone button[data-c="' + c + '"]');
  /* END=retreat: he pulls out on his turn (RETREAT, armed, pressed again), the rest of the fight played to its end on AUTO */
  if (process.env.END === 'retreat') { for (let i = 0; i < 40; i++) { const st = await f.evaluate(() => ({ over: !!FIGHT.S.over, mine: (function () { const u = FIGHT.current(); return !!u && u.side === 'you' && !UI.anim.length; })(), ret: !!FIGHT.S.retreat })).catch(() => ({ over: true }));
      if (st.over || st.ret) break; if (st.mine) { await phoneB('flee'); await wait(400); if (i === 0) await still('09r_retreat_armed'); await phoneB('flee'); await wait(800); } else await wait(400); }
    await still('09r_retreat_pressed'); }
  if (!(await f.evaluate(() => !!UI.auto).catch(() => true))) { await phoneB('auto'); await wait(500); }
  for (let i = 0; i < 4; i++) { const h = await f.evaluate(() => UI.hand).catch(() => 2); if (h === 2) break; await phoneB('speed'); await wait(400); }
  const lose = () => process.env.END === 'lose' ? f.evaluate(() => { if (!FIGHT.S.over) FIGHT.S.units.forEach(u => { if (u.side === 'you' && u.hp > 1) u.hp = 1; else if (u.side === 'them' && u.hp > 0 && !u.dead) u.hp = 9999; }); }).catch(() => null) : null;
  let k = 10; const tA = Date.now(); while (Date.now() - tA < (FR ? 420000 : 150000)) { const o = await f.evaluate(() => !!FIGHT.S.over).catch(() => true); if (o) break; for (let q = 0; q < 5; q++) { await lose(); await wait(500); } await still(String(k++).padStart(2, '0') + '_auto'); if (k > 60) break; }
  await wait(300); await still('80_over_0_3s'); await wait(1200); await still('81_over_1_5s'); await wait(2500); await still('82_over_4s');
  await until(() => !!frame(/SPOILS_SCREEN/), 12000, 300); await wait(1500); await still('83_end_screen');
  W.overCard = await f.evaluate(() => { const o = document.getElementById('over'); if (!o) return null; const st = getComputedStyle(o); return { display: st.display, visibility: st.visibility, handed: o.classList.contains('handed'), head: (document.getElementById('oh') || {}).textContent, text: (o.innerText || '').replace(/\s+/g, ' ').slice(0, 300) }; }).catch(() => null);
  log('OVER CARD', JSON.stringify(W.overCard));
  if (W.overCard && W.overCard.display !== 'none' && W.overCard.visibility !== 'hidden') { await tapText('button', '^(LEAVE|AGAIN|DONE|BACK TO THE MAP)$', fightF()); await wait(2500); await still('83b_after_over_button'); }
  for (let i = 0; i < 14; i++) { const sp = frame(/SPOILS_SCREEN/); if (!sp) break; await tapText('button', '^LEAVE$', sp); await wait(2500); if (i === 0) await still('84_after_leave'); }
  await wait(2000); await still('85_map_again');
  W.home = await city().evaluate(() => MODE === 'city' && !document.querySelector('iframe[src*="BOHEMIA_FIGHT"]')).catch(() => null);
  if (FR) { await mark('end'); const R = await page.evaluate(() => window.__FR).catch(() => null);
    if (R) { const seg = []; for (let i = 0; i + 1 < R.marks.length; i++) { const a = R.marks[i], b = R.marks[i + 1], ts = R.t.filter(t => t >= a.t && t <= b.t), d = [];
        for (let j = 1; j < ts.length; j++) d.push(ts[j] - ts[j - 1]);
        const dur = b.t - a.t, big = d.map((x, j) => [x, ts[j + 1]]).filter(x => x[0] > 50);
        seg.push({ from: a.n, to: b.n, ms: Math.round(dur), fps: ts.length > 1 ? Math.round(10 * (ts.length - 1) / ((ts[ts.length - 1] - ts[0]) / 1000)) / 10 : 0, worst: d.length ? Math.round(Math.max.apply(null, d)) : null,
          hitches: big.length, hitchList: big.slice(0, 12).map(x => [Math.round(x[0]), Math.round(x[1] - a.t)]) }); }
      /* the pieces' own cost, per stretch */
      const to = await page.evaluate(() => performance.timeOrigin), GL = GLN, PM = (await page.evaluate(() => (window.__PHONE_MAN_T || {}).list || []).catch(() => [])) || [];
      const pieces = GL.concat(PM.map(x => ['manPaint', x[0], x[1]]));
      for (let i = 0; i + 1 < R.marks.length; i++) { const a = to + R.marks[i].t, b = to + R.marks[i + 1].t, by = {};
        pieces.filter(x => x[1] >= a && x[1] < b).forEach(x => { const o = by[x[0]] = by[x[0]] || { n: 0, ms: 0, max: 0 }; o.n++; o.ms += x[2]; if (x[2] > o.max) o.max = x[2]; });
        Object.keys(by).forEach(k => { by[k].ms = Math.round(by[k].ms * 10) / 10; by[k].max = Math.round(by[k].max * 10) / 10; }); seg[i].pieces = by; }
      W.frames = { throttle: 4, viewport: VP, segs: seg };
      for (const g of seg) log('FRAMES', (g.from + ' -> ' + g.to).padEnd(40), g.ms + ' ms', g.fps + ' fps', 'worst ' + g.worst + ' ms', g.hitches + ' past 50 ms', '| ' + Object.keys(g.pieces || {}).map(k => k + ' ' + g.pieces[k].n + 'x max ' + g.pieces[k].max).join(', '));
      const all = {}; pieces.forEach(x => { const o = all[x[0]] = all[x[0]] || { n: 0, ms: 0, max: 0, over8: 0 }; o.n++; o.ms += x[2]; if (x[2] > o.max) o.max = x[2]; if (x[2] > 8) o.over8++; });
      Object.keys(all).forEach(k => { all[k].mean = Math.round(all[k].ms / all[k].n * 100) / 100; all[k].ms = Math.round(all[k].ms); all[k].max = Math.round(all[k].max * 10) / 10; });
      W.frames.pieces = all; log('PIECES', JSON.stringify(all)); } }
  W.errs = errs; fs.writeFileSync(path.join(OUT, 'walk.json'), JSON.stringify(W, null, 1));
  log('DONE', WHICH, WAY, CASE, 'home', W.home, 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
