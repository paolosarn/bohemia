/* THE ROSTER SHOWS THE HURT GATE (RUN TWO, row [the roster shows the hurt], 10/10/26).
   Strike a man down in the real fight, read him on the roster: the fight (on auto, in a host frame)
   ends with BOHEMIA_FIGHT_OVER carrying down, laidUpDays and the injury (COMBAT [struck down]); the
   roster takes him out of the line into LAID UP, his card shows the days left, the permanent mark
   (the wiki's injury, injuries.json), PEOPLE's one pain line (engine/bohemia_long_injury.js painLine)
   and the clinic's price; dragging him into the line is refused; the clock heals him a day at a time
   (healDay) and at zero he stands in the line again with the mark still on him; a dead man leaves.
   Shots: slices/vote/RUN2_THE_HURT_BEFORE_10_10.png and _AFTER_. Run: node gates/roster_hurt_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8866;
const LI = require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const HOST = '<!doctype html><meta charset=utf-8><body style="margin:0"><iframe id=f src="/slices/BOHEMIA_FIGHT.html" style="width:390px;height:844px;border:0"></iframe>'
  + '<script>window.__over=null;addEventListener("message",function(e){if(e.data&&e.data.type==="BOHEMIA_FIGHT_OVER")window.__over=e.data;});</script>';
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u.startsWith('/__host')) { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
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
  await ctx.addInitScript(() => { if (/BOHEMIA_FIGHT/.test(location.pathname)) window.FIGHT_OPTS = { seed: Number(localStorage.getItem('__seed') || 1), speed: 60, auto: true }; });
  /* 1. FIGHTS UNTIL ONE OF HIS IS STRUCK DOWN AND LIVES */
  let over = null, hurt = null;
  for (let seed = 1; seed <= 12 && !hurt; seed++) {
    const h = await ctx.newPage(); h.on('pageerror', e => errs.push('fight: ' + e.message));
    await h.goto('http://127.0.0.1:' + PORT + '/__host' + seed + '.html');
    await h.evaluate(s => { localStorage.setItem('__seed', s); localStorage.removeItem('bohemia.climb.v1'); localStorage.setItem('bohemia.formation.v1', 'null'); localStorage.setItem('bohemia.hired.v1', '[]'); }, seed);
    await h.reload();
    await h.waitForFunction(() => window.__over, null, { timeout: 240000 });
    over = await h.evaluate(() => window.__over); await h.close();
    hurt = over.crew.find(c => c.down && !c.main && c.injury);
    if (hurt) console.log('     seed ' + seed + ': ' + hurt.name + ' down, ' + hurt.laidUpDays + ' days, ' + hurt.injury.name);
  }
  ok('the fight strikes one of his down and says so (down, days, the injury)', !!hurt && hurt.laidUpDays >= 30 && hurt.laidUpDays <= 40, hurt && hurt.name);
  if (!hurt) { await b.close(); srv.close(); console.log('\nTHE ROSTER SHOWS THE HURT GATE: ' + pass + ' ok, ' + (fail) + ' failed'); process.exit(1); }
  /* 2. THE ROSTER */
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('roster: ' + e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(600);
  await p.evaluate(n => { const s = BohemiaRosterScreen.state; s.sel = s.crew.findIndex(m => m.name === n); BohemiaRosterScreen.open({}); }, hurt.name);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_HURT_BEFORE_10_10.png') });
  await p.evaluate(o => window.postMessage(o, '*'), over); await p.waitForTimeout(400);
  const r = await p.evaluate(n => { const s = BohemiaRosterScreen.state, i = s.crew.findIndex(m => m.name === n), c = document.getElementById('card');
    return { i, inLine: s.front.concat(s.back).indexOf(i) >= 0, strip: !!document.querySelector('#hurt .cell[data-hurt="' + i + '"]'), sel: s.crew[s.sel].name,
      head: (c.querySelector('.hurtbox b') || {}).textContent || '', mark: (c.querySelector('.hurtbox .mark') || {}).textContent || '', clinic: (c.querySelector('.hurtbox .clinic') || {}).textContent || '',
      pain: (c.querySelector('.pain') || {}).textContent || '', inCo: BohemiaRosterScreen.company().some(x => x.name === n) }; }, hurt.name);
  ok('he leaves the line for LAID UP, and the card opens on him', !r.inLine && r.strip && r.sel === hurt.name);
  ok('  his card: the days left of the days he got', r.head === 'LAID UP ' + hurt.laidUpDays + ' OF ' + hurt.laidUpDays + ' DAYS', r.head);
  ok('  the permanent mark, the wiki\'s injury and what it takes', r.mark.indexOf(hurt.injury.name.toUpperCase()) >= 0, r.mark.slice(0, 70));
  ok('  the one pain line is PEOPLE\'s, from that injury', r.pain.indexOf(LI.painLine(hurt.injury.id)) >= 0, r.pain.slice(0, 60));
  const lv = 1, price = Math.max(1, Math.round(20 * hurt.laidUpDays * (1 + (lv - 1) * 0.2) / 10));
  ok('  the clinic\'s price to halve the days', r.clinic.indexOf(String(price) + ' batteries') >= 0, r.clinic);
  ok('  and the next fight does not get him', !r.inCo);
  /* drag him into an empty front slot: refused */
  const box = async sel => { const q = await p.locator(sel).boundingBox(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; };
  const j = await p.evaluate(() => BohemiaRosterScreen.state.front.indexOf(null));
  const a = await box('#hurt .cell[data-hurt="' + r.i + '"]'), z = await box('#front .cell:nth-child(' + (j + 1) + ')');
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 10, a.y - 10, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  const ref = await p.evaluate(i => ({ inLine: BohemiaRosterScreen.state.front.concat(BohemiaRosterScreen.state.back).indexOf(i) >= 0, said: document.getElementById('said').textContent, post: (window.__rosterLog || []).filter(x => x.act === 'refused').length }), r.i);
  ok('drag him into the line and it is refused, in words', !ref.inLine && ref.post === 1 && /cannot stand in the line/.test(ref.said), ref.said);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_HURT_AFTER_10_10.png') });
  /* the clock heals him */
  await p.evaluate(() => window.postMessage({ type: 'BOHEMIA_DAY', days: 1 }, '*')); await p.waitForTimeout(200);
  const d1 = await p.evaluate(() => document.querySelector('#card .hurtbox b').textContent);
  ok('a day on the clock takes a day off', d1 === 'LAID UP ' + (hurt.laidUpDays - 1) + ' OF ' + hurt.laidUpDays + ' DAYS', d1);
  const kept = await p.evaluate(n => { BohemiaRosterScreen.open({}); const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return m.hurt.days; }, hurt.name);
  ok('  and it keeps when the screen opens again', kept === hurt.laidUpDays - 1);
  await p.evaluate(n => BohemiaRosterScreen.dayPassed(n), hurt.laidUpDays);
  const back = await p.evaluate(i => { const s = BohemiaRosterScreen.state; s.sel = i; BohemiaRosterScreen.open({}); return { inLine: s.front.concat(s.back).indexOf(i) >= 0, head: (document.querySelector('#card .hurtbox b') || {}).textContent, mark: (document.querySelector('#card .hurtbox .mark') || {}).textContent || '' }; }, r.i);
  ok('at zero he stands in the line again, and the mark never clears', back.inLine && back.head === 'HEALED, BUT MARKED' && back.mark.indexOf(hurt.injury.name.toUpperCase()) >= 0, back.head);
  /* a dead man leaves */
  const dead = await p.evaluate(() => { const s = BohemiaRosterScreen.state, m = s.crew.find(x => !x.main && !x.mark); BohemiaRosterScreen.afterFight([{ name: m.name, dead: true, xpGained: 0 }]);
    const i = s.crew.indexOf(m); return { inLine: s.front.concat(s.back).indexOf(i) >= 0, inCo: BohemiaRosterScreen.company().some(x => x.name === m.name), name: m.name }; });
  ok('a man killed in the fight leaves the line and the company', !dead.inLine && !dead.inCo, dead.name);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE ROSTER SHOWS THE HURT GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
