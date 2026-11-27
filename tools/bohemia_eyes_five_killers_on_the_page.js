/* ============================================================================
   EYES: FIVE KILLERS ON THE PAGE HE PLAYS (VAMILY rules 493(d) and 494(a), Paolo 11/27: 'I have five combat people [that] were
   absolute killers and there's no more challenges, nothing else to do'; 'I haven't seen one caravan quest').
   The demo upright at 390x844, a new game through the door (NEW GAME, BEGIN, GO), the first town; then his company is swapped
   for five killers made by tools/bohemia_eyes_five_killers.js (--company-out: the crew screen's own climb, kept the way the crew
   screen keeps it, bohemia.company.v1) and the map's clock set to the day asked. Then, in the map's own frame, every place's
   board as the shelf deals it (BohemiaBoardShelf.pick over mapPlaces), each offer's kind (BohemiaJobKinds.kindOf) and its read
   for HIS crew (BohemiaJobDanger.peek: the fight's own AUTO played against the crew the fight's door would hand over), polled
   until read. Without the killers (EYES_KILLERS=none) it reads the crew the game gave, day by day (EYES_DAYS=1,4,7,...).
   EYES_KILLERS=<file.json>  EYES_DAYS=60  EYES_WAIT=240 (s for the reads)  node tools/bohemia_eyes_five_killers_on_the_page.js <outdir>
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || '/tmp/eyes_killers';
const BASE = 'https://paolosarn.github.io/bohemia/';
const FILE = 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'audio/webm',
  '.opus': 'audio/ogg', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.txt': 'text/plain', '.woff2': 'font/woff2' };
const KILLERS = process.env.EYES_KILLERS || 'none';
const DAYS = (process.env.EYES_DAYS || '60').split(',').map(Number);
const WAITS = +(process.env.EYES_WAIT || 240);
fs.mkdirSync(OUT, { recursive: true });
const LOG = path.join(OUT, 'run.log');
const log = (...a) => { const s = new Date().toISOString().slice(11, 19) + ' ' + a.join(' '); fs.appendFileSync(LOG, s + '\n'); console.log(s); };

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = process.env.EYES_SIDE ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } });
  });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => { errs.push(String(e).slice(0, 200)); log('PAGEERROR', String(e).slice(0, 160)); });
  const wait = (ms) => page.waitForTimeout(ms);
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(250); } return false; };
  const city = () => page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url())) || null;
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapText = async (f, sel, re) => {
    const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(); const st = getComputedStyle(x); return r.width > 4 && r.height > 4 && st.visibility !== 'hidden' && st.display !== 'none' && +st.opacity > 0.05; })[0];
      if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]);
    if (!b) return null; const fb = await box(f); if (!fb) return null; await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const anyFrameTap = async (sel, re) => { for (const f of page.frames()) { try { if (await tapText(f, sel, re)) return true; } catch (e) {} } return false; };
  const shot = async (name) => { try { await page.screenshot({ path: path.join(OUT, name + '.png') }); } catch (e) {} };

  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(async () => anyFrameTap('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(async () => anyFrameTap('#fronttap', 'BEGIN'), 90000); await wait(3500);
  const barberUp = async () => { for (const f of page.frames()) { try { if (await f.evaluate(() => /THE BARBER/.test(document.body.innerText) && [...document.querySelectorAll('button,div')].some(e => /^GO$/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 20))) return true; } catch (e) {} } return false; };
  await until(async () => anyFrameTap('button,div', '^GO$'), 30000);
  for (let i = 0; i < 20 && await barberUp(); i++) { await wait(2500); await anyFrameTap('button,div', '^GO$'); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000);
  await wait(5000);
  const first = await city().evaluate(() => ({ town: LOOP.open && LOOP.open.name, day: T.day, origin: LOOP.start && LOOP.start.origin, crew: (BohemiaJobKinds.roster().men || []).map(m => m.name + ' L' + m.level) }));
  log('first town', JSON.stringify(first));
  await shot('00_first_town');

  if (KILLERS !== 'none') {
    const co = JSON.parse(fs.readFileSync(KILLERS, 'utf8'));
    await page.evaluate((co) => { localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); localStorage.removeItem('bohemia.company.line.v1'); localStorage.setItem('bohemia.hired.v1', '[]'); }, co);
    log('the company is now', co.map(m => m.name + ' L' + m.level).join(', '));
  }
  /* EYES_CLOUT=n: the company's name as a long run leaves it (engine/bohemia_renown.js, bohemia.renown.v1), so the big work that
     waits for a name (job_clout.json: a fortress's two skulls at 250, three at 1050) is open */
  if (process.env.EYES_CLOUT) { await page.evaluate((n) => { localStorage.setItem('bohemia.renown.v1', JSON.stringify({ score: n, keys: [], log: [] })); }, +process.env.EYES_CLOUT);
    log('clout now', await city().evaluate(() => { try { return BohemiaRenown.score(); } catch (e) { return String(e); } })); }
  /* EYES_SWEEP=1: the deal of every board window from day 1 to 88 as the shelf deals it (reads not waited on: a job not read yet
     is posted reading), each offer's kind; and the page's own pool by kind, with what each tier may draw */
  if (process.env.EYES_SWEEP) {
    const S = await city().evaluate(() => {
      const pool = (BohemiaBoardShelf.shelf() || {}).offers || [], byKind = {}, tiers = {};
      pool.forEach(o => { const k = BohemiaJobKinds.kindOf(o); byKind[k] = (byKind[k] || 0) + 1; (o.tiers || []).forEach(t => { tiers[k + '@' + t] = (tiers[k + '@' + t] || 0) + 1; }); });
      const dealt = {}, firstDay = {}, perWin = [];
      for (let D = 1; D <= 88; D += 3) { const places = BohemiaBoardShelf.mapPlaces(D) || [], w = {};
        places.forEach(p => { (BohemiaBoardShelf.pick(p, D, { places, traits: p.traits, held: [], done: [] }) || []).forEach(o => { const k = BohemiaJobKinds.kindOf(o); dealt[k] = (dealt[k] || 0) + 1; w[k] = (w[k] || 0) + 1; if (firstDay[k] == null) firstDay[k] = D; }); });
        perWin.push({ day: D, kinds: w }); }
      const tiersOfPlaces = {}; (BohemiaBoardShelf.mapPlaces(1) || []).forEach(p => { tiersOfPlaces[p.tier] = (tiersOfPlaces[p.tier] || 0) + 1; });
      const when = {}; pool.forEach(o => { if (o.when) { const k = BohemiaJobKinds.kindOf(o) + ':' + o.when; when[k] = (when[k] || 0) + 1; } });
      return { pool: pool.length, byKind, tiers, when, dealt, firstDay, perWin, tiersOfPlaces, built: ['haul-caravan', 'find-place', 'find-person', 'hunt-kind', 'clear-camp', 'carry', 'hold-defend', 'recover-return', 'patrol'].map(k => [k, BohemiaJobKinds.built(k)]) };
    });
    fs.writeFileSync(path.join(OUT, 'sweep.json'), JSON.stringify(S, null, 1));
    log('pool', S.pool, JSON.stringify(S.byKind)); log('places by tier', JSON.stringify(S.tiersOfPlaces)); log('only when', JSON.stringify(S.when));
    log('dealt days 1-88', JSON.stringify(S.dealt)); log('first day dealt', JSON.stringify(S.firstDay)); log('built', JSON.stringify(S.built));
    await browser.close(); return;
  }
  const all = { first, killers: KILLERS, days: [] };
  for (const D of DAYS) {
    await city().evaluate((D) => { T.day = D; }, D);
    const st = await city().evaluate(() => { try { return { strength: BohemiaJobKinds.strength(), roster: BohemiaJobKinds.roster().men.map(m => m.name + ' L' + m.level) }; } catch (e) { return { err: String(e) }; } });
    log('day', D, 'strength', JSON.stringify(st).slice(0, 300));
    const read = async () => city().evaluate((D) => {
      const places = BohemiaBoardShelf.mapPlaces(D) || [], out = [];
      places.forEach(p => { let jobs = []; try { jobs = BohemiaBoardShelf.pick(p, D, { places, traits: p.traits, held: [], done: [] }) || []; } catch (e) { jobs = [{ err: String(e).slice(0, 80) }]; }
        jobs.forEach(o => { let r = null; try { r = BohemiaJobDanger.peek(o, p.name); } catch (e) { r = { err: String(e).slice(0, 60) }; }
          out.push({ place: p.name, tier: p.tier, id: o.id, title: o.title, skulls: o.skulls, pay: o.pay, kind: (function () { try { return BohemiaJobKinds.kindOf(o); } catch (e) { return '?'; } })(),
            state: r && r.state, clean: r && r.clean != null ? Math.round(r.clean * 100) : null, stars: (function () { try { return BohemiaJobDanger.stars(r); } catch (e) { return null; } })(),
            party: o.party ? { count: o.party.count, faction: o.party.faction } : null }); }); });
      return { places: places.length, offers: out, sweat: window.__SWEAT_JOB || null };
    }, D);
    let R = null; const t0 = Date.now();
    while (Date.now() - t0 < WAITS * 1000) { R = await read(); const left = R.offers.filter(o => o.state !== 'read').length; if (!left) break; await wait(5000); }
    const left = R.offers.filter(o => o.state !== 'read').length;
    log('day', D, 'places', R.places, 'offers', R.offers.length, 'unread', left, 'in', Math.round((Date.now() - t0) / 1000), 's');
    const kinds = {}; R.offers.forEach(o => { kinds[o.kind] = (kinds[o.kind] || 0) + 1; });
    log('  kinds', JSON.stringify(kinds));
    const sorted = R.offers.filter(o => o.clean != null).sort((a, b) => a.clean - b.clean);
    log('  hardest five', JSON.stringify(sorted.slice(0, 5).map(o => [o.place, o.title, o.kind, o.skulls + 'sk', 'clean ' + o.clean, 'stars ' + o.stars])));
    log('  reds (under 80)', sorted.filter(o => o.clean < 80).length, 'of', sorted.length, '| sweat job', JSON.stringify(R.sweat));
    all.days.push(Object.assign({ day: D, strength: st }, R));
    fs.writeFileSync(path.join(OUT, 'boards.json'), JSON.stringify(all, null, 1));
  }
  all.errs = errs; fs.writeFileSync(path.join(OUT, 'boards.json'), JSON.stringify(all, null, 1));
  log('page errors', errs.length);
  await browser.close();
})().catch(e => { console.error(e.stack || e.message); process.exit(1); });
