#!/usr/bin/env node
/* ============================================================================
   PLAY TAKES YOU THERE GATE (RUN 10/26, row [play takes you there], rule 227(c); EYES' normie hour F9: 'PLAY with a job on and
   nothing else picked: nothing moves for 8 s').

   PAOLO 10/26: 'or when you press play it just walks you automatically towards the quest, perfectly.'

   MEASURED BEFORE: the map's only path finder (cityRoute) is breadth-first, fewest blocks, blind to the ground under them and to who
   is on it; UI TWO's PLAY fell back to a tap's door with it.

   On the demo, through the one driver, the phone and the computer (node gates/play_takes_you_there_gate.js [profile]). Two real
   jobs off the nearest town's board (its own 'Take it' message), then the one call UI TWO's PLAY makes (window.mapPlayToJob):
     P1  PLAY alone, a job on: the party sets out, and the journey ends where the job sends him next (BohemiaJobKinds.nextOf: its
         place, or beside the town it names)
     P2  THE PATH FINDER'S OWN ROUTE: the journey is mapBestRoute's, and on 40 seeded trips across the valley it is never more
         minutes than the fewest-blocks route, and fewer on some (roads faster than dirt)
     P3  AROUND WHAT HE CAN SEE IS DANGEROUS: a crew hunting him put on the fewest-blocks route's middle: the best route keeps two
         blocks clear of it where the valley has a way round
     P4  THE TOWN WHEN THE JOB SAYS SO: the job done and owed in town (its stage 'back'): PLAY goes to that town's nearest side and
         arriving opens it
     P5  A TAP OF HIS OWN IS HIS OWN WAY: a tap elsewhere sets his route, never PLAY's (no PLAY mark on it)
     P6  no job, PLAY sets nothing out (the clock's own GO is the phone's)
     P7  MUTATION: PLAY's route off, P1 goes red
     P8  nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && window.mapPlayToJob && window.BohemiaJobKinds && BohemiaJobKinds.ready()))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);
  /* P6 first: nothing held */
  const p6 = await fr.evaluate(() => { LOOP.held = []; travelStop(); return { ok: window.mapPlayToJob(), travel: !!TRAVEL }; });
  /* two real jobs off the nearest town's board */
  const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { name: n, x: b.x | 0, y: b.y | 0, d: dd, tier: mapTierOf(n) }; } if (best) loopOpenTown(best); return best; });
  let sf = null; for (let i = 0; i < 60 && !sf; i++) { const fh = await fr.$('#settleFrame'); sf = fh ? await fh.contentFrame() : null; if (!sf) await page.waitForTimeout(300); }
  await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready && BohemiaBoardShelf.ready(), null, { timeout: 30000 }).catch(() => {});
  const offers = await sf.evaluate(() => BohemiaBoardShelf.shelf().offers.map(o => o.id));
  for (const id of offers.slice(0, 2)) {
    await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); }, id);
    await page.waitForTimeout(700);
  }
  await sf.evaluate(() => window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'leave', place: BohemiaSettlement.state.place.name, batteries: null }, '*'));
  await page.waitForTimeout(1500);
  /* P1 + P2's first half */
  const p1 = await fr.evaluate(() => {
    const held = LOOP.held.map(j => ({ id: j.id, plays: j.plays || null, next: BohemiaJobKinds.nextOf(j) || (j.target ? { x: j.target.x, y: j.target.y } : null) }));
    const j = held[0]; travelStop();
    const go = window.mapPlayToJob(j && j.id);
    const T = TRAVEL ? { to: TRAVEL.to.slice(), n: TRAVEL.path.length, play: TRAVEL.play || null, town: TRAVEL.town ? TRAVEL.town.name : null, path: TRAVEL.path.map(c => c.join(',')).join(' ') } : null;
    let near = false, best = null;
    if (T && j && j.next) {
      if (j.next.town) near = !!T.town && mapNorm(T.town) === mapNorm(j.next.name);
      else near = Math.max(Math.abs(T.to[0] - (j.next.x | 0)), Math.abs(T.to[1] - (j.next.y | 0))) <= 2;
      const r = j.next.town ? mapBestRoute(city.x, city.y, { town: mapPlayTown(j.next) }) : mapBestRoute(city.x, city.y, { x: j.next.x | 0, y: j.next.y | 0 });
      best = r ? r.path.map(c => c.join(',')).join(' ') : null; }
    return { held: held.length, go, T, near, same: !!best && !!T && best === T.path, next: j && j.next, last: MAP_PLAY.last, speed: TRAVEL_SPEED };
  });
  ok('P1 PLAY alone, a job on: the party sets out for where the job sends him next', p1.held >= 1 && p1.go && !!p1.T && p1.T.play === (await fr.evaluate(() => LOOP.held[0] && LOOP.held[0].id)) && p1.near && p1.speed > 0,
     p1.held + ' held; ' + (p1.T ? p1.T.n + ' blocks to ' + p1.T.to + (p1.T.town ? ' (' + p1.T.town + ')' : '') : 'nothing set') + ' for ' + JSON.stringify(p1.next && { x: p1.next.x, y: p1.next.y, name: p1.next.name, town: !!p1.next.town }));
  await fr.evaluate(() => { travelStop(); });
  /* P2: the route is the path finder's, and the path finder is minutes, not blocks */
  const p2 = await fr.evaluate(() => {
    let s = 7, rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = om.n, walk = []; for (let y = 1; y < n - 1; y++) for (let x = 1; x < n - 1; x++) if (cityWalkable(x, y)) walk.push([x, y]);
    const mins = p => { let m = 0; for (let i = 1; i < p.length; i++) m += cityStepMins(p[i][0], p[i][1]); return m; };
    let worse = 0, better = 0, tried = 0, saved = 0;
    for (let k = 0; k < 80 && tried < 40; k++) { const a = walk[(rnd() * walk.length) | 0], b = walk[(rnd() * walk.length) | 0];
      if (Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) < 12) continue;
      const bf = cityRoute(a[0], a[1], b[0], b[1]); if (!bf) continue;
      const hold = HUNT; HUNT = null; const be = mapBestRoute(a[0], a[1], { x: b[0], y: b[1] }); HUNT = hold; if (!be) continue;
      tried++; const mb = mins(bf), me = be.mins; if (me > mb + 1e-6) worse++; if (me < mb - 1) { better++; saved += mb - me; } }
    return { tried, worse, better, saved: Math.round(saved) };
  });
  ok('P2 the path finder\'s own route: never more minutes than the fewest-blocks route, fewer on some', p1.same && p2.tried >= 30 && p2.worse === 0 && p2.better >= 3,
     'PLAY\'s journey is mapBestRoute\'s: ' + p1.same + '; ' + p2.tried + ' trips, ' + p2.worse + ' slower, ' + p2.better + ' quicker (' + p2.saved + ' min saved)');
  /* P3 */
  const p3 = await fr.evaluate(() => {
    const n = om.n; let found = null;
    for (let rr = 14; rr <= 26 && !found; rr += 2) for (const v of DIRS) { const x = city.x + v[0] * rr, y = city.y + v[1] * rr;
      if (x < 2 || y < 2 || x >= n - 2 || y >= n - 2 || !cityWalkable(x, y)) continue;
      const hold0 = HUNT; HUNT = null; const r0 = mapBestRoute(city.x, city.y, { x, y }); HUNT = hold0; if (!r0 || r0.path.length < 10) continue;
      const mid = r0.path[(r0.path.length / 2) | 0];
      const hold = HUNT; HUNT = { id: 'gate', at: [mid[0], mid[1]], name: 'GATE', count: 3, steps: 0 };
      const r1 = mapBestRoute(city.x, city.y, { x, y }); HUNT = hold;
      if (!r1) continue;
      const clear = Math.min(...r1.path.map(c => Math.max(Math.abs(c[0] - mid[0]), Math.abs(c[1] - mid[1]))));
      const via = Math.min(...r0.path.map(c => Math.max(Math.abs(c[0] - mid[0]), Math.abs(c[1] - mid[1]))));
      found = { to: [x, y], mid, clear, via, b0: r0.blocks, b1: r1.blocks, danger: (r1.danger || []).length }; }
    return found;
  });
  ok('P3 around a crew hunting him: two blocks clear where the valley has a way round', !!p3 && p3.via === 0 && p3.clear >= 2 && p3.danger >= 1,
     p3 ? 'the crew at ' + p3.mid + ' on the plain route (' + p3.b0 + ' blocks); PLAY\'s keeps ' + p3.clear + ' clear (' + p3.b1 + ' blocks)' : 'no test trip found');
  /* P4: owed in town */
  const p4a = await fr.evaluate(() => {
    const j = LOOP.held.filter(h => h && h.fromAt)[0] || LOOP.held[0]; if (!j) return null;
    j.stage = 'back'; j.fight = null; LOOP.fighting = null;
    /* stand him well off the town, on a street */
    const n = om.n, T = loopTownAt(j.fromAt ? j.fromAt.x : j.target.x, j.fromAt ? j.fromAt.y : j.target.y, 1) || null;
    const nx = BohemiaJobKinds.nextOf(j);
    const TT = nx && nx.town ? mapPlayTown(nx) : null; if (!TT) return { why: 'the job names no town: ' + JSON.stringify(nx) };
    let st = null; for (let rr = 9; rr <= 18 && !st; rr++) for (const v of DIRS) { const x = (nx.x | 0) + v[0] * rr, y = (nx.y | 0) + v[1] * rr; if (x > 1 && y > 1 && x < n - 1 && y < n - 1 && cityWalkable(x, y) && !loopTownAt(x, y, 2) && mapBestRoute(x, y, { town: TT })) { st = [x, y]; break; } }
    if (!st) return { why: 'no street 9 to 18 blocks off ' + TT.name }; travelStop(); city.x = st[0]; city.y = st[1]; render();
    const go = window.mapPlayToJob(j.id);
    return { id: j.id, from: j.from, next: nx, go, T: TRAVEL ? { town: TRAVEL.town ? TRAVEL.town.name : null, n: TRAVEL.path.length } : null };
  });
  let opened = false, t0 = Date.now();
  while (p4a && !p4a.why && p4a.T && Date.now() - t0 < 90000) { await page.waitForTimeout(500);
    if (await fr.evaluate(() => !!(MEET && MEET.up))) await fr.evaluate(() => { try { MEET_DONE(false); window.mapPlayToJob(); } catch (e) {} });
    opened = await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')); if (opened) break; }
  const p4b = await fr.evaluate(() => ({ open: LOOP.open ? LOOP.open.name : null }));
  ok('P4 the job done and owed in town: PLAY goes to that town and arriving opens it', !!p4a && !p4a.why && p4a.go && !!p4a.T && mapNormJS(p4a.T.town) === mapNormJS(p4a.from) && opened,
     p4a && p4a.why ? p4a.why : p4a ? 'owed in ' + p4a.from + ', set out for ' + (p4a.T && p4a.T.town) + ' (' + (p4a.T && p4a.T.n) + ' blocks), opened ' + p4b.open : 'no job');
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  await page.waitForTimeout(500);
  /* P5 */
  const p5 = await fr.evaluate(() => { const n = om.n; let c = null; for (let rr = 6; rr <= 14 && !c; rr++) for (const v of DIRS) { const x = city.x + v[0] * rr, y = city.y + v[1] * rr; if (x > 1 && y > 1 && x < n - 1 && y < n - 1 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) { c = [x, y]; break; } }
    travelStop(); const okk = c && travelTo(0, 0, c); const r = { ok: !!okk, play: TRAVEL ? (TRAVEL.play || null) : 'none' }; travelStop(); return r; });
  ok('P5 a tap of his own is his own way, never PLAY\'s', p5.ok && p5.play === null, JSON.stringify(p5));
  ok('P6 no job held: PLAY sets nothing out', p6.ok === false && !p6.travel, JSON.stringify(p6));
  /* P7 */
  const p7 = await fr.evaluate(() => { MAP_PLAY.on = false; travelStop(); const r = window.mapPlayToJob(); const t = !!TRAVEL; MAP_PLAY.on = true; travelStop(); return { r, t }; });
  ok('P7 MUTATION: PLAY\'s route off, P1 goes red (nothing set out)', p7.r === false && !p7.t, JSON.stringify(p7));
  ok('P8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}
function mapNormJS(v) { return String(v || '').toUpperCase().replace(/[\s_]/g, ''); }

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['phone_portrait', 'computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 220)); } }
  console.log('\nPLAY TAKES YOU THERE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
