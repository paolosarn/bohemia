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
  return { W, H, up, over, S };
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
  const still = async (n) => { let g = null; const f = fightF(); if (f) { g = await f.evaluate(READ_GLASS).catch(e => ({ err: String(e).slice(0, 120) })); const fb = await box(f).catch(() => null);
      const ph = await phoneBox(); if (g && g.up && ph && fb) { g.phone = ph; g.underPhone = g.up.filter(c => ['why', 'vet', 'call', 'say', 'drawer', 'pick'].includes(c.id)).filter(c => { const x = c.x + fb.x, y = c.y + fb.y; return Math.min(x + c.w, ph.x + ph.w) - Math.max(x, ph.x) > 2 && Math.min(y + c.h, ph.y + ph.h) - Math.max(y, ph.y) > 2; }).map(c => c.id); } }
    const sp = frame(/SPOILS_SCREEN/); if (sp) g = Object.assign(g || {}, { spoils: await sp.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300)).catch(() => null) });
    try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {}
    W.stills.push({ n, t: Date.now(), g }); log('STILL', n, g && g.up ? g.up.map(c => c.id + (c.off ? '!OFF' : '') + (c.cut.length ? '!CUT' : '')).join(',') : '', g && g.over && g.over.length ? 'OVERLAP ' + g.over.join(';') : '', g && g.underPhone && g.underPhone.length ? 'UNDER PHONE ' + g.underPhone.join(',') : '', g && g.S ? JSON.stringify(g.S) : '', g && g.phone && g.phone.card ? 'PHONE ' + g.phone.card : '', g && g.spoils ? 'SPOILS ' + g.spoils.slice(0, 80) : ''); };
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
  W.met = await city().evaluate((CASE) => { const band = CASE === 'beasts' ? ['wolf', 'wolf', 'wolf'] : ['brigand_thug', 'brigand_thug', 'brigand_raider'];
    const at = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })();
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: CASE === 'beasts' ? 'a pack' : 'the toll crew', faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: CASE === 'beasts' ? 'beast' : 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: CASE === 'beasts' ? 'beasts' : 'brigands', band: band, rolled: true }, street: true, why: CASE === 'beasts' ? 'road:pack' : 'road:toll_crew', at: { gx: at[0] | 0, gy: at[1] | 0 } };
    try { MEET.on = true; return { ok: meetWalk(function () { return cityHandOver(msg); }), at: at }; } catch (e) { return { err: String(e) }; } }, CASE).catch(e => ({ err: String(e) }));
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
  if (hasCard) { await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60); await wait(1300); await still('00_card');
    await tapSel(city(), '#meetcard button[data-meet="go"]'); }
  log('MET', hasCard, JSON.stringify(W.met));
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000, 50);
  const f = fightF(); if (!f) { log('NO FIGHT'); W.errs = errs; fs.writeFileSync(path.join(OUT, 'walk.json'), JSON.stringify(W, null, 1)); process.exit(1); }
  const t0 = Date.now();
  for (const [ms, n] of [[300, '01_first_0_3s'], [1000, '02_first_1s'], [2000, '03_first_2s'], [3500, '04_first_3_5s'], [5000, '05_first_5s']]) { const d = ms - (Date.now() - t0); if (d > 0) await wait(d); await still(n); }
  /* FIGHT with a finger */
  await tapSel(page.mainFrame(), '#bohphone .fgo'); await wait(400); await still('06_after_fight_pressed');
  const his = await until(async () => f.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'you' && !UI.anim.length && !FIGHT.S.deploy; }), 30000, 200);
  await wait(700); await still('07_his_turn');
  /* a step by hand: a finger on a lit square of his reach */
  if (his) { const sq = await f.evaluate(() => { try { const u = FIGHT.current(), S = FIGHT.S, best = FIGHT.reach(u, null, true).best;
          const ok = Object.keys(best).map(Number).map(k => [k % S.w, Math.floor(k / S.w)]).filter(([x, y]) => (x !== u.x || y !== u.y) && !S.units.some(o => o.hp > 0 && o.x === x && o.y === y));
          ok.sort((a, b) => (b[0] - a[0]) || (Math.abs(a[1] - u.y) - Math.abs(b[1] - u.y)));
          const c = ok.find(([x, y]) => x > u.x && Math.abs(x - u.x) <= 2) || ok[0]; if (!c) return null;
          return { x: sx((c[0] + .5 + stagger(c[1])) * UI.tw), y: sy((c[1] + .6) * UI.th), c, from: [u.x, u.y] }; } catch (e) { return { err: String(e) }; } }).catch(() => null);
    W.step = sq; if (sq && sq.x != null) { const fb = await box(f); await page.touchscreen.tap(fb.x + sq.x, fb.y + sq.y); await wait(500); await still('08_square_tapped'); await page.touchscreen.tap(fb.x + sq.x, fb.y + sq.y); await wait(1200); await still('09_after_step'); } }
  /* AUTO at 2x, a still every 2.5 s, to the end */
  const phoneB = async (c) => tapSel(page.mainFrame(), '#bohphone button[data-c="' + c + '"]');
  if (!(await f.evaluate(() => !!UI.auto).catch(() => true))) { await phoneB('auto'); await wait(500); }
  for (let i = 0; i < 4; i++) { const h = await f.evaluate(() => UI.hand).catch(() => 2); if (h === 2) break; await phoneB('speed'); await wait(400); }
  let k = 10; const tA = Date.now(); while (Date.now() - tA < 150000) { const o = await f.evaluate(() => !!FIGHT.S.over).catch(() => true); if (o) break; await wait(2500); await still(String(k++).padStart(2, '0') + '_auto'); if (k > 60) break; }
  await wait(300); await still('80_over_0_3s'); await wait(1200); await still('81_over_1_5s'); await wait(2500); await still('82_over_4s');
  await until(() => !!frame(/SPOILS_SCREEN/), 12000, 300); await wait(1500); await still('83_end_screen');
  for (let i = 0; i < 14; i++) { const sp = frame(/SPOILS_SCREEN/); if (!sp) break; await tapText('button', '^LEAVE$', sp); await wait(2500); if (i === 0) await still('84_after_leave'); }
  await wait(2000); await still('85_map_again');
  W.home = await city().evaluate(() => MODE === 'city' && !document.querySelector('iframe[src*="BOHEMIA_FIGHT"]')).catch(() => null);
  W.errs = errs; fs.writeFileSync(path.join(OUT, 'walk.json'), JSON.stringify(W, null, 1));
  log('DONE', WHICH, WAY, CASE, 'home', W.home, 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
