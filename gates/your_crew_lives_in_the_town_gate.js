/* ==========================================================================
   YOUR CREW LIVES IN THE TOWN  (RUN THREE, 10/26/26, VAMILY [your crew lives in the town], rule 218(a)(b)(d))

   PAOLO 10/26: "in the settlements I really want everyone that is on your company or your recruited, you can see them... maybe
   flirting with a girl, maybe drinking some beer, maybe walking around, maybe talking to people... make it feel alive... they
   deserve to see them too... it's gotta be able to hold that type of capacity plus the rest of it."
   MEASURED BEFORE: in a town the picture held its keepers, its crowd, the men at the post, its walkers and the lead; nobody else of
   the company was anywhere (they stood only round the camp's fire).

   LEGS (__YOUR_CREW_LIVES_IN_THE_TOWN__, slices/BOHEMIA_SETTLEMENT_SCREEN.html):
     K1 *** EVERY MAN IN THE PICTURE *** (his phone): a company of twelve in camps, towns and fortresses, every picture: every man but
        the lead is in the town, standing at his activity or walking a path
     K2 ON THE GROUND, NO DOOR CROWDED, NEVER A ROW: every standing man's feet on the picture's ground (settlement_walk.json, never a
        roof), none on a door's front or the post's rail, none on another's spot, never three in a row
     K3 DOING SOMETHING: every man has one of ANIMATION's six activities or walks; a walker moves; each standing man is drawn by his
        activity where his pictures are in, else his idles (never a blank)
     K4 *** A TAP OPENS HIM ***: a real tap on one of his men opens the crew screen on that man
     K5 THE BIGGEST COMPANY FITS: twenty-five men (the biggest roster an origin allows): twenty-four in the picture, the frame on a
        phone's CPU (4x slower) within half again the empty town's, the pictures he adds inside 160 MB decoded
     K6 the computer: every man in, a click opens him
     K7 *** THE LIVE DEMO ***: through the title, a town through the map's door: his company's men are in the picture
     K8 nothing threw
   node gates/your_crew_lives_in_the_town_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('YOUR CREW LIVES IN THE TOWN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
const ACTS = ['drink', 'smoke', 'talk', 'flirt', 'sit', 'stall', 'walk'];
/* every picture the page decodes, counted (an Image or an <img>), so the town's memory is a sum, not a guess */
const HOOK = () => { window.__imgs = []; const I = window.Image; window.Image = function (w, h) { const im = new I(w, h); window.__imgs.push(im); return im; }; window.Image.prototype = I.prototype;
  const ce = document.createElement.bind(document); document.createElement = function (t, o) { const e = ce(t, o); if (String(t).toLowerCase() === 'img') window.__imgs.push(e); return e; }; };
const DECODED = () => { const u = {}; (window.__imgs || []).forEach(im => { if (im.complete && im.naturalWidth) u[im.currentSrc || im.src] = im.naturalWidth * im.naturalHeight * 4; }); return Object.values(u).reduce((a, b) => a + b, 0) / 1048576; };
/* the company handed to the page as the crew screen keeps it: the founding twelve, or more of the valley's rolled men hired */
const COMPANY = (n) => { const C = BohemiaRoster, crew = C.company(C.startingCrew()), used = {}; crew.forEach(m => { used[m.look] = 1; });
  const more = BOHEMIA_PEOPLE_MIX.people.filter(x => x.fight && !used[x.look] && x.sex !== 'f' && (!window.BohemiaRigBodies || !BohemiaRigBodies.person || BohemiaRigBodies.person(x.look)));
  for (let i = 0; crew.length < n && i < more.length; i++) { const m = C.manOf({ name: 'HIRED ' + (i + 1), background: 'farmhand', look: more[i].look }, crew.length); m.look = more[i].look; crew.push(C.company([m])[0]); }
  crew.length = Math.min(crew.length, n); localStorage.setItem('bohemia.company.v1', JSON.stringify(crew)); localStorage.removeItem('bohemia.hired.v1'); return crew.length; };
/* what the town shows of his company now */
const HERE = () => { const S = BohemiaSettlement, crew = S.crewTown(), here = S.crewHere(), fronts = S.doorFronts(), h = S.scale().person;
  const stand = here.filter(p => !p.busy), others = S.folk().filter(p => !p.crewMan);
  const bad = [];
  stand.forEach(p => { if (!S.onGround(p.x, p.y)) bad.push(p.name + ' off the ground');
    fronts.forEach(d => { if (Math.abs(p.x - d.x) < d.w - 10 && p.y > d.y - 4 && p.y < d.y + d.h - 6) bad.push(p.name + ' on the ' + d.k + "'s front"); });
    stand.concat(others).forEach(q => { if (q !== p && Math.abs(q.x - p.x) < 40 && Math.abs(q.y - p.y) < h * .22) bad.push(p.name + ' on ' + (q.name || q.look) + "'s spot"); });
    const row = stand.filter(q => Math.abs(q.y - p.y) < 16 && Math.abs(q.x - p.x) < 240); if (row.length >= 3) bad.push(p.name + ' in a row of ' + row.length); });
  return { src: S.picSrc(), crew: crew.length, names: crew.map(m => m.name), here: here.map(p => ({ name: p.name, act: p.act, x: p.x, y: p.y, walk: !!p.busy, doing: p.doing || null })), bad: [...new Set(bad)] }; };

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const page = async (vp, mobile) => { const ctx = await b.newContext(mobile ? { viewport: vp, deviceScaleFactor: 3, isMobile: true, hasTouch: true } : { viewport: vp });
    await ctx.addInitScript(HOOK); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster && window.BOHEMIA_PEOPLE_MIX && window.BohemiaRigBodies, null, { timeout: 30000 });
    await p.waitForFunction(() => BohemiaRoster.data && BohemiaRoster.data.xp, null, { timeout: 20000 }).catch(() => {});
    return { ctx, p }; };
  const openTown = async (p, name, tier, day) => { await p.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
      BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: o.day, batteries: 500 }); }, { name, tier, day });
    await p.waitForFunction(() => BohemiaSettlement.crewTown().length > 0 && BohemiaSettlement.crewHere().length > 0, null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(600); return p.evaluate(HERE); };
  const tapMan = async (p, man, touch) => { const at = await p.evaluate(n => { const q = BohemiaSettlement.crewHere().find(x => x.name === n && !x.busy); if (!q) return null;
      const c = document.querySelector('canvas').getBoundingClientRect(), s = BohemiaSettlement.toScreen(q.x, q.y), h = BohemiaSettlement.scale().person * BohemiaSettlement._view().s;
      return { x: c.left + s.x, y: c.top + s.y - h * .45 }; }, man);
    if (!at) return null; if (touch) await p.touchscreen.tap(at.x, at.y); else await p.mouse.click(at.x, at.y);
    const rf = await (async () => { for (let k = 0; k < 40; k++) { await p.waitForTimeout(300); const f = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (f) return f; } return null; })();
    if (!rf) return { opened: false };
    await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(500);
    const sel = await rf.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return m ? m.name : null; }).catch(() => null);
    await rf.evaluate(() => { const d = document.getElementById('done'); if (d) d.click(); }).catch(() => {}); await p.waitForTimeout(600);
    return { opened: true, sel }; };

  /* ---- K1, K2, K3 on the phone ---- */
  let ph;
  try {
    ph = await page({ width: 390, height: 844 }, true);
    await ph.p.evaluate(COMPANY, 12);
    const towns = [['camp', 'DRY WELL'], ['camp', 'SALT CAMP'], ['camp', 'COYOTE SPRINGS'], ['town', 'BLUE DIAMOND'], ['town', 'GOODSPRINGS'], ['town', 'MESQUITE'], ['fortress', 'NELLIS GATE'], ['fortress', 'THE CHURCH'], ['fortress', 'HOOVER'], ['home', 'HOME']];
    const seen = [];
    for (const [tier, name] of towns) seen.push(Object.assign({ tier, name }, await openTown(ph.p, name, tier, 3)));
    const pics = [...new Set(seen.map(s => s.src))];
    const missing = seen.filter(s => s.here.length !== s.crew || s.crew !== 11);
    ok('*** K1 EVERY MAN IN THE PICTURE *** (phone): a company of twelve, ' + seen.length + ' places on ' + pics.length + ' pictures (' + pics.join(' ') + '): the eleven who are not the lead in every one',
      missing.length === 0 && pics.length >= 6, missing.map(s => s.name + ' ' + s.here.length + '/' + s.crew).join(', ') || seen.map(s => s.name + ' ' + s.here.length).join(', '));
    const bad = [].concat(...seen.map(s => s.bad.map(x => s.name + ': ' + x)));
    ok('K2 ON THE GROUND, NO DOOR CROWDED, NEVER A ROW: every standing man on the picture\'s ground, off every door\'s front and the post\'s rail, off everybody\'s spot, never three in a row',
      bad.length === 0, bad.slice(0, 4).join(' | ') || (seen.reduce((a, s) => a + s.here.filter(h => !h.walk).length, 0) + ' standing men checked'));
    const all = [].concat(...seen.map(s => s.here)), acts = {}; all.forEach(h => { acts[h.act] = (acts[h.act] || 0) + 1; });
    const blank = all.filter(h => !h.walk && !(h.doing === 'activity' || h.doing === 'idle'));
    /* a walker moves */
    const w0 = await ph.p.evaluate(() => BohemiaSettlement.crewHere().filter(p => p.busy).map(p => p.x)); await ph.p.waitForTimeout(2000);
    const w1 = await ph.p.evaluate(() => BohemiaSettlement.crewHere().filter(p => p.busy).map(p => p.x));
    const moved = w0.filter((x, i) => w1[i] != null && Math.abs(w1[i] - x) > 5).length;
    const drawnAct = all.filter(h => h.doing === 'activity').length;
    ok('K3 DOING SOMETHING: every man at one of the six or walking (' + Object.keys(acts).map(k => k + ' ' + acts[k]).join(', ') + '); every standing man drawn (' + drawnAct + ' by his activity, ' + all.filter(h => h.doing === 'idle').length + ' by his idles while ANIMATION\'s pictures render); the walkers walk (' + moved + ' of ' + w0.length + ' moved in two seconds)',
      all.every(h => ACTS.indexOf(h.act) >= 0) && Object.keys(acts).length >= 4 && blank.length === 0 && (w0.length === 0 || moved >= 1), blank.slice(0, 3).map(h => h.name + ' ' + h.doing).join(' | '));
    /* ---- K4 a real tap ---- */
    /* a man on the glass (the town is wider than a phone until RUN TWO's [the town fits the screen] fits it, rule 218(c)) */
    const t = await openTown(ph.p, 'BLUE DIAMOND', 'town', 3);
    const onGlass = await ph.p.evaluate(() => { const c = document.querySelector('canvas').getBoundingClientRect(), v = BohemiaSettlement._view(), h = BohemiaSettlement.scale().person * v.s;
      return BohemiaSettlement.crewHere().filter(q => !q.busy).map(q => { const s = BohemiaSettlement.toScreen(q.x, q.y); return { name: q.name, x: c.left + s.x, y: c.top + s.y - h * .45 }; })
        .filter(q => q.x > 30 && q.x < innerWidth - 30 && q.y > 90 && q.y < innerHeight - 60).map(q => q.name); });
    const pick = t.here.find(h => !h.walk && onGlass.indexOf(h.name) >= 0);
    const tp = pick ? await tapMan(ph.p, pick.name, true) : null;
    ok('*** K4 A TAP OPENS HIM *** (phone, a real tap on ' + (pick && pick.name) + ', one of ' + onGlass.length + ' of his men on the glass): the crew screen opens on him', !!tp && tp.opened && tp.sel === pick.name, JSON.stringify(tp));
    if (process.env.BOHEMIA_SHOT_DIR) { await openTown(ph.p, 'BLUE DIAMOND', 'town', 3); await ph.p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'crew_in_town_phone.png') }); }
  } catch (e) { ok('the phone legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  if (ph) await ph.ctx.close();

  /* ---- K5 the biggest company ---- */
  try {
    const cost = {};
    for (const n of [1, 25]) {
      const q = await page({ width: 390, height: 844 }, true), cdp = await q.ctx.newCDPSession(q.p);
      const got = await q.p.evaluate(COMPANY, n); const h = await openTown(q.p, 'BLUE DIAMOND', 'town', 3); await q.p.waitForTimeout(5000);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      const t = await q.p.evaluate(async () => { const t = []; for (let i = 0; i < 40; i++) { t.push(BohemiaSettlement.drawMs(1)[0]); await new Promise(r => requestAnimationFrame(r)); } t.sort((a, b) => a - b); return t[20]; });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      cost[n] = { got, here: (await q.p.evaluate(HERE)).here.length, crew: h.crew, ms: t, mb: await q.p.evaluate(DECODED), bad: (await q.p.evaluate(HERE)).bad };
      await q.ctx.close(); }
    const B = cost[25], E = cost[1];
    ok('K5 THE BIGGEST COMPANY FITS: twenty-five men, ' + B.here + ' of the ' + B.crew + ' who are not the lead in the picture; the frame on a phone\'s CPU ' + B.ms.toFixed(1) + ' ms against the empty town\'s ' + E.ms.toFixed(1) + '; his men\'s pictures ' + (B.mb - E.mb).toFixed(0) + ' MB decoded',
      B.got === 25 && B.crew === 24 && B.here === 24 && B.bad.length === 0 && B.ms <= E.ms * 1.5 && B.mb - E.mb < 160, B.bad.slice(0, 3).join(' | '));
  } catch (e) { ok('K5 the biggest company leg ran [' + String(e.message).slice(0, 200) + ']', false); }

  /* ---- K6 the computer ---- */
  try {
    const q = await page({ width: 1440, height: 900 }, false); await q.p.evaluate(COMPANY, 12);
    const h = await openTown(q.p, 'NELLIS GATE', 'fortress', 3), pick = h.here.find(x => !x.walk);
    const tp = pick ? await tapMan(q.p, pick.name, false) : null;
    if (process.env.BOHEMIA_SHOT_DIR) { await openTown(q.p, 'NELLIS GATE', 'fortress', 3); await q.p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'crew_in_town_computer.png') }); }
    ok('K6 the computer: ' + h.here.length + ' of ' + h.crew + ' in the fortress, on the ground; a click opens ' + (pick && pick.name) + ' on the crew screen', h.here.length === h.crew && h.crew === 11 && h.bad.length === 0 && !!tp && tp.sel === pick.name, JSON.stringify(tp) + ' ' + h.bad.slice(0, 2).join(' | '));
    await q.ctx.close();
  } catch (e) { ok('K6 the computer leg ran [' + String(e.message).slice(0, 160) + ']', false); }
  ok('K8a nothing threw on the settlement screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();

  /* ---- K7 the live demo ---- */
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('K7 the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(3000);
    const town = await fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs); const n = names.find(k => mapTierOf(k) === 'town') || names[0]; return { name: n, tier: mapTierOf(n) }; });
    await fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, town.name);
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && BohemiaSettlement.crewTown().length > 0; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) throw new Error('no town with his company through the map\'s door ' + JSON.stringify(town));
    await sf.waitForFunction(() => BohemiaSettlement.crewHere().length > 0, null, { timeout: 15000 }).catch(() => {});
    await P.waitForTimeout(800);
    const h = await sf.evaluate(HERE);
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'crew_in_town_demo.png') });
    ok('*** K7 THE LIVE DEMO *** (' + town.name + ' through the map\'s door, ' + h.src + '): ' + h.here.length + ' of his ' + h.crew + ' men who are not the lead in the picture (' + h.here.map(x => x.name + ' ' + x.act).join(', ') + ')',
      h.crew >= 1 && h.here.length === h.crew && h.bad.length === 0, h.bad.slice(0, 3).join(' | '));
    ok('K8b nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('K7 the demo legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();
