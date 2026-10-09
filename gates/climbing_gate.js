/* THE CLIMBING GATE (RUN TWO, row [climbing], 10/10/26).
   Win a fight, see the level, pick a perk, see it in the next fight. Drives the real fight
   (slices/BOHEMIA_FIGHT.html, on auto) inside a host frame, catches its BOHEMIA_FIGHT_OVER with each
   man's XP (COMBAT counts it the Battle Brothers way: killer 20, party 80, less 15), hands it to the
   roster screen, which levels him on the wiki's table (rules.json experience, the Level and Experience
   page), raises three stats by his star column (the Talents page) and gives a perk point; taps PICK A
   PERK and a tier-1 perk; then boots a second fight with the roster's company and finds the perk on
   the man. Shots: slices/vote/RUN2_CLIMBING_BEFORE_10_10.png and _AFTER_.
   Run: node gates/climbing_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8863;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const HOST = '<!doctype html><meta charset=utf-8><body style="margin:0"><iframe id=f src="/slices/BOHEMIA_FIGHT.html" style="width:390px;height:844px;border:0"></iframe>'
  + '<script>window.__over=null;addEventListener("message",function(e){if(e.data&&e.data.type==="BOHEMIA_FIGHT_OVER")window.__over=e.data;});</script>';
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  await ctx.addInitScript(() => { if (/BOHEMIA_FIGHT/.test(location.pathname)) window.FIGHT_OPTS = { seed: 11, speed: 60, auto: true };
    try { if (location.pathname === '/__host.html') { localStorage.removeItem('bohemia.climb.v1'); localStorage.setItem('bohemia.formation.v1', 'null'); localStorage.setItem('bohemia.hired.v1', '[]'); } } catch (e) {} });
  /* 1. A FIGHT, WON */
  const h = await ctx.newPage(); h.on('pageerror', e => errs.push('fight: ' + e.message));
  await h.goto('http://127.0.0.1:' + PORT + '/__host.html');
  await h.waitForFunction(() => window.__over, null, { timeout: 240000 });
  const over = await h.evaluate(() => window.__over);
  ok('the fight ends and says so to the game', !!over && Array.isArray(over.crew), over && over.result);
  ok('  it was won', over.result === 'won', over.result);
  const earned = over.crew.filter(c => c.xpGained > 0);
  ok('  the recap hands each man his XP by name', earned.length >= 3, earned.map(c => c.name + ' +' + c.xpGained).slice(0, 4).join(', '));
  await h.close();
  /* 2. THE ROSTER: before, then the fight lands */
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('roster: ' + e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(600);
  /* the man who earned the most, alive */
  const top = earned.filter(c => !c.dead).sort((a, c) => c.xpGained - a.xpGained)[0];
  /* the table: a fight's XP alone rarely buys 200, so the gate also gives the top man the rest of level 2 the
     way a second win would; the rest stand on what the fight gave them */
  const pad = Math.max(0, 200 - top.xpGained);
  await p.evaluate(n => { const s = BohemiaRosterScreen.state; s.sel = s.crew.findIndex(m => m.name === n); }, top.name);
  const before = await p.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return { lv: m.level, xp: m.xp, st: Object.assign({}, m.stats), stars: m.stars }; }, top.name);
  await p.evaluate(() => BohemiaRosterScreen.open({})); await p.waitForTimeout(200);
  await p.evaluate(n => { const s = BohemiaRosterScreen.state; s.sel = s.crew.findIndex(m => m.name === n); BohemiaRosterScreen.open({}); }, top.name);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_CLIMBING_BEFORE_10_10.png') });
  const rows = over.crew.map(c => c.name === top.name ? Object.assign({}, c, { xpGained: c.xpGained + pad }) : c);
  await p.evaluate(r => window.postMessage({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', crew: r }, '*'), rows);
  await p.waitForTimeout(400);
  const after = await p.evaluate(n => { const s = BohemiaRosterScreen.state, m = s.crew.find(x => x.name === n); return { lv: m.level, xp: m.xp, st: Object.assign({}, m.stats), pts: m.points, sel: s.crew[s.sel].name,
    sub: document.querySelector('#card .sub').textContent, said: document.getElementById('said').textContent, gains: document.querySelectorAll('#card .gain').length, bar: !!document.querySelector('#card .xpbar i') }; }, top.name);
  ok('he climbs on Battle Brothers\' table: 200 XP is level 2', before.lv === 1 && after.lv === 2 && after.xp >= 200, top.name + ' ' + before.lv + ' -> ' + after.lv + ' at ' + after.xp + ' XP');
  const up = Object.keys(after.st).filter(k => after.st[k] > before.st[k]);
  const inCol = up.every(k => { const d = after.st[k] - before.st[k], s = before.stars[k] || 0; return d >= 1 && d <= 6 && (s < 2 || d >= 3); });
  ok('  three different stats go up, each by his star column (the Talents page)', up.length === 3 && inCol, up.map(k => k + ' +' + (after.st[k] - before.st[k])).join(', '));
  ok('  the card shows the level, the XP bar and the green gains', /LEVEL 2/.test(after.sub) && after.bar && after.gains === 3, after.said);
  ok('  he gets one perk point and the card opens on him', after.pts === 1 && after.sel === top.name);
  /* 3. PICK A PERK */
  await p.click('#pick'); await p.waitForTimeout(200);
  const ch = await p.evaluate(() => [].map.call(document.querySelectorAll('.plist button'), x => x.dataset.perk));
  const tiers = await p.evaluate(ids => ids.map(id => BohemiaRoster.data.perkRows.find(r => r.id === id).tier), ch);
  ok('  only tier one opens to his first point (Battle Brothers\' tiers)', ch.length === 9 && tiers.every(t => t === 1), ch.length + ' choices');
  const want = ch[0];
  await p.click('.plist button[data-perk="' + want + '"]'); await p.waitForTimeout(300);
  const took = await p.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return { perks: m.perks, pts: m.points, txt: document.querySelector('#card .perks').textContent,
    post: (window.__rosterLog || []).filter(x => x.act === 'perk').length, small: [].filter.call(document.querySelectorAll('#card button'), e => { const r = e.getBoundingClientRect(); return r.width > 0 && Math.min(r.width, r.height) < 44; }).length }; }, top.name);
  ok('tap a perk and he has it, the point spent, the game told', took.perks[0] === want && took.pts === 0 && took.post === 1, took.txt);
  ok('  every button on the card is 44 on his phone', took.small === 0, took.small + ' small');
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_CLIMBING_AFTER_10_10.png') });
  /* it keeps: a fresh open still has him at level 2 with the perk */
  const p2 = await ctx.newPage(); await p2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await p2.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  const kept = await p2.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return { lv: m.level, perks: m.perks }; }, top.name);
  ok('  and he keeps it when the screen opens again', kept.lv === 2 && kept.perks[0] === want);
  const company = await p.evaluate(() => { document.getElementById('done').click(); const d = (window.__rosterLog || []).filter(x => x.act === 'done').pop(); return d && d.company; });
  ok('DONE hands the game the company the fight reads (background, level, perks)', company && company.find(c => c.name === top.name).perks[0] === want);
  /* 4. THE NEXT FIGHT */
  const f2 = await ctx.newPage(); f2.on('pageerror', e => errs.push('fight 2: ' + e.message));
  await f2.addInitScript(c => { window.FIGHT_OPTS = { seed: 11, speed: 1, company: c }; }, company);
  await f2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await f2.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  const u = await f2.evaluate(n => { const v = FIGHT.S.units.find(x => x.side === 'you' && x.name === n); return v && { lv: v.level, perks: v.perks }; }, top.name);
  ok('the next fight: he walks in at level 2 with the perk he picked', u && u.lv === 2 && u.perks.indexOf(want) >= 0, u && (u.lv + ' ' + u.perks.join(',')));
  const fresh = await f2.evaluate(() => FIGHT.S.units.filter(x => x.side === 'you' && x.level === 1).every(x => x.perks.length === 0));
  ok('  and a man with no points spent has no perks the roster did not give him', fresh);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE CLIMBING GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
