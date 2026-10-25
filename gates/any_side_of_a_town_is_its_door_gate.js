#!/usr/bin/env node
/* ============================================================================
   ANY SIDE OF A TOWN IS ITS DOOR GATE (RUN 10/25, rule 186(a), row [any side of a town is its door]).

   PAOLO 10/25: 'any tile next to a settlement... take me to the nearest tile that lets me enter... it makes me do a full
   loopy loop around the block.'

   MEASURED BEFORE THE FIX, on the demo's valley: 12 of the 14 towns have street on one side only of their own block (Mob one
   tile, north; Church two, north), and a town opened only from the eight blocks round that one block. The door was the street
   tile there nearest him as the crow flies, so from the far side the walk went round the block. A tap on the town's own block
   went to the road nearest the TAPPED block, first in scan order: always its west or north side.

   WHAT "TOUCHING" MEANS HERE IS WHAT HE SEES: the town as the painter builds it (VB_TOWNS, read from the painter's own list,
   not from the map's walking code): a fortress 4 x 4 blocks, a town 3 x 3, a camp 2 x 2. A block touches the town when it is on
   that painted ground or next to it.

   On the demo, through the one driver, on the phone and the computer (node gates/any_side_of_a_town_is_its_door_gate.js
   [phone_portrait|computer]; both when no profile is named). Every town, from eight sides (a street block about seven blocks
   off to the N, NE, E, SE, S, SW, W and NW), the town's own tap (townTap, what a finger on its name or building calls):
     S1 every walk ends touching the town (a street beside it, or one step off the street onto its ground)
     S2 no walk passes the town before it stops (the first block that touches the town is the last block of the walk)
     S3 every walk is the shortest walk to a block touching the town (this gate's own breadth-first search)
     S4 the old door's loops are gone: the walks where the old door walked two or more blocks further now walk the shortest
        (counted, so the gate says what it fixed)
     S5 MUTATION: the old door put back, S3 goes red (a leg that cannot go red proves nothing)
     S6 a real finger on five towns (on the glass, at the town's block or its building) sets out for the nearest side of the
        town it is on; S6b the same block with no picture to take the finger goes to that town, the nearest side
     S7 five walks on the beat from the far side of five towns: he arrives, that town opens, and it says its name
     S8 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* the gate's own reading, installed in the page once: the painted towns and a shortest walk that knows nothing of the map's */
const HELPERS = () => {
  const list = (VB_TOWNS.list && VB_TOWNS.list.length) ? VB_TOWNS.list : vbTownsInput();
  const T = {}; for (const o of list) T[o.name] = { name: o.name, x: o.bx, y: o.by, x0: o.x0, y0: o.y0, n: o.n };
  const D8 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const rect = (t, c) => Math.max(c[0] < t.x0 ? t.x0 - c[0] : c[0] > t.x0 + t.n - 1 ? c[0] - t.x0 - t.n + 1 : 0, c[1] < t.y0 ? t.y0 - c[1] : c[1] > t.y0 + t.n - 1 ? c[1] - t.y0 - t.n + 1 : 0);
  const touches = (t, c) => !(c[0] === t.x && c[1] === t.y) && rect(t, c) <= 1;
  const shortest = (s, t) => {
    const n = om.n; if (touches(t, s)) return 0;
    const seen = new Set([s[1] * n + s[0]]); let layer = [s];
    for (let dd = 0; layer.length && dd < 400; dd++) { const nx = [];
      for (const c of layer) for (const v of D8) { const q = [c[0] + v[0], c[1] + v[1]]; if (q[0] < 0 || q[1] < 0 || q[0] >= n || q[1] >= n) continue;
        if (touches(t, q)) return dd + 1; const k = q[1] * n + q[0]; if (seen.has(k) || !cityWalkable(q[0], q[1])) continue; seen.add(k); nx.push(q); }
      layer = nx; }
    return null; };
  /* a street block well off the town on the side away from its own streets (the case that looped) */
  const farSide = (t, lo, hi) => { const n = om.n; let s = null, sd = -1;
    for (let y = Math.max(0, t.y - hi - 2); y <= Math.min(n - 1, t.y + hi + 2); y++) for (let x = Math.max(0, t.x - hi - 2); x <= Math.min(n - 1, t.x + hi + 2); x++) {
      if (!cityWalkable(x, y) || rect(t, [x, y]) < lo || rect(t, [x, y]) > hi) continue;
      let near = 99; for (let a = -1; a <= 1; a++) for (let q = -1; q <= 1; q++) if ((a || q) && cityWalkable(t.x + a, t.y + q)) near = Math.min(near, Math.max(Math.abs(x - t.x - a), Math.abs(y - t.y - q)));
      if (near > sd) { sd = near; s = [x, y]; } }
    return s; };
  window.__DOOR = { T, D8, rect, touches, shortest, farSide };
  return Object.keys(T).length;
};

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof ctBases === 'function' && ctBases() && typeof townTap === 'function' && window.VB_TOWNS))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  const nTowns = await fr.evaluate('(' + HELPERS.toString() + ')()');
  /* every town, eight sides: the walk the map sets, the gate's own shortest, the old door's */
  const R = await fr.evaluate(() => {
    const { T, D8, rect, touches, shortest } = window.__DOOR, n = om.n, out = [], home = [city.x, city.y], NM = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const startFor = (t, v) => { const want = [t.x + v[0] * 7, t.y + v[1] * 7];
      for (let r = 0; r <= 4; r++) { let best = null, bd = 1e9;
        for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) { if (Math.max(Math.abs(a), Math.abs(b)) !== r) continue; const c = [want[0] + a, want[1] + b];
          if (c[0] < 0 || c[1] < 0 || c[0] >= n || c[1] >= n || !cityWalkable(c[0], c[1]) || rect(t, c) < 3) continue;
          const dd = Math.abs(a) + Math.abs(b); if (dd < bd) { bd = dd; best = c; } }
        if (best) return best; }
      return null; };
    for (const name in T) { const t = T[name];
      for (let i = 0; i < 8; i++) { const s = startFor(t, D8[i]); if (!s) { out.push({ town: name, side: NM[i], none: true }); continue; }
        const opt = shortest(s, t); if (opt == null) { out.push({ town: name, side: NM[i], s, unreached: true }); continue; }
        city.x = s[0]; city.y = s[1]; TRAVEL = null;
        /* the old door, as it was: a street tile in the eight round the town's block, the nearest to him as the crow flies */
        let old = null; try { const od = townDoor(t.x, t.y); const op = od ? ((od[0] === s[0] && od[1] === s[1]) ? [s] : cityRoute(s[0], s[1], od[0], od[1])) : null; old = op ? op.length - 1 : null; } catch (e) { old = null; }
        townTap({ name, x: t.x, y: t.y });
        const p = TRAVEL && TRAVEL.path ? TRAVEL.path.map(c => [c[0], c[1]]) : null; TRAVEL = null;
        let firstTouch = -1; if (p) for (let k = 0; k < p.length; k++) if (touches(t, p[k])) { firstTouch = k; break; }
        out.push({ town: name, side: NM[i], s, opt, old, steps: p ? p.length - 1 : null, endTouches: !!(p && touches(t, p[p.length - 1])), firstTouch, last: p ? p.length - 1 : -1,
          yard: p ? !cityWalkable(p[p.length - 1][0], p[p.length - 1][1]) : false }); } }
    city.x = home[0]; city.y = home[1]; render();
    return out;
  });
  const cases = R.filter(c => !c.none && !c.unreached);
  console.log('  ' + nTowns + ' towns, ' + cases.length + ' walks measured (' + R.length + ' asked; ' + (R.length - cases.length) + ' with no street block on that side or no road in)');
  const notEnd = cases.filter(c => !c.endTouches), passed = cases.filter(c => c.firstTouch !== c.last), notOpt = cases.filter(c => c.steps !== c.opt);
  ok('S1 every walk ends touching the town', cases.length >= 80 && notEnd.length === 0, notEnd.slice(0, 3).map(c => c.town + ' ' + c.side).join(', ') || cases.length + ' of ' + cases.length + ', ' + cases.filter(c => c.yard).length + ' end one step off the street, on its ground');
  ok('S2 no walk passes the town before it stops', passed.length === 0, passed.slice(0, 3).map(c => c.town + ' ' + c.side + ' touched at ' + c.firstTouch + ' of ' + c.last).join(', ') || 'none');
  ok('S3 every walk is the shortest walk to a block touching the town', notOpt.length === 0, notOpt.slice(0, 3).map(c => c.town + ' ' + c.side + ' ' + c.steps + ' vs ' + c.opt).join(', ') || 'all ' + cases.length);
  const loops = cases.filter(c => c.old != null && c.old - c.opt >= 2), fixed = loops.filter(c => c.steps === c.opt);
  const saved = cases.reduce((a, c) => a + (c.old != null ? Math.max(0, c.old - c.steps) : 0), 0), worst = loops.slice().sort((a, b) => (b.old - b.opt) - (a.old - a.opt))[0];
  ok('S4 the old door\'s loops are gone', fixed.length === loops.length, loops.length + ' of ' + cases.length + ' walks were two or more blocks longer with the old door (' + saved + ' blocks saved in all; worst ' + (worst ? worst.town + ' from the ' + worst.side + ', ' + worst.old + ' -> ' + worst.steps : 'none') + ')');
  /* S5: the old door put back in townTap; the same walks must fail S3 */
  const mut = await fr.evaluate((cs) => {
    const keep = townDoorWalk; let bad = 0;
    window.townDoorWalk = function (t) { const dr = townDoor(t.x, t.y); if (!dr) return null; const p = (dr[0] === city.x && dr[1] === city.y) ? [[city.x, city.y]] : cityRoute(city.x, city.y, dr[0], dr[1]); return p ? { door: dr, path: p } : null; };
    try { for (const c of cs) { city.x = c.s[0]; city.y = c.s[1]; TRAVEL = null; const t = window.__DOOR.T[c.town]; townTap({ name: c.town, x: t.x, y: t.y }); const st = TRAVEL && TRAVEL.path ? TRAVEL.path.length - 1 : null; TRAVEL = null; if (st !== c.opt) bad++; } }
    finally { window.townDoorWalk = keep; }
    return bad;
  }, cases);
  ok('S5 MUTATION: the old door put back, S3 goes red', mut > 0, mut + ' of ' + cases.length + ' walks not the shortest with the old door');

  /* S6: a real finger on five towns */
  const five = ['Mob', 'Church', 'Caravans', 'Reds', 'Blues'];
  const tapRes = [];
  for (const nm of five) {
    const pre = await fr.evaluate((nm) => { const t = window.__DOOR.T[nm]; if (!t) return null; const s = window.__DOOR.farSide(t, 3, 6); if (!s) return null;
      TRAVEL = null; city.x = s[0]; city.y = s[1]; try { camHold(); } catch (e) {} panX = 0; panY = 0; render(); return { t, s }; }, nm);
    if (!pre) { tapRes.push({ nm, none: true }); continue; }
    await page.waitForTimeout(400);
    /* where on the glass the finger answers THIS town: its block, else its building's picture (another town's name plate can
       lie over a block at some zooms, and a plate drawn on top is what the finger is on) */
    const at = await fr.evaluate((t) => {
      render(); const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      const q = iso(t.x, t.y, ox, oy), rr = cv.getBoundingClientRect();
      const pts = [[q.sx, q.sy + TH / 2]]; const h = MAP_TOWN_HIT.find(e => e.name === t.name);
      if (h && h.bld) pts.push([h.bld.x + h.bld.w / 2, h.bld.y + h.bld.h * 0.7], [h.bld.x + h.bld.w / 2, h.bld.y + h.bld.h * 0.4]);
      let pick = null; for (const p of pts) { const r = mapTapWhich(p[0], p[1]); if (r && r.what === 'town' && r.name === t.name) { pick = p; break; } }
      const p = pick || pts[0];
      return { x: rr.left + p[0] * rr.width / CVW, y: rr.top + p[1] * rr.height / CVH, sx: q.sx, sy: q.sy + TH / 2, own: !!pick };
    }, pre.t);
    const fb = await (await fr.frameElement()).boundingBox();
    await fr.evaluate(() => { window.__MAP_TAP = null; });
    if (profile === 'computer') await page.mouse.click(fb.x + at.x, fb.y + at.y); else await page.touchscreen.tap(fb.x + at.x, fb.y + at.y);
    await page.waitForTimeout(250);
    const got = await fr.evaluate(([nm, s]) => {
      const tap = window.__MAP_TAP || null, who = tap && tap.name && window.__DOOR.T[tap.name] ? tap.name : nm, t = window.__DOOR.T[who];
      const p = TRAVEL && TRAVEL.path ? TRAVEL.path.map(c => [c[0], c[1]]) : null; TRAVEL = null;
      return { who, steps: p ? p.length - 1 : null, opt: window.__DOOR.shortest(p ? p[0] : s, t), what: tap ? tap.what : null };
    }, [nm, pre.s]);
    const bare = await fr.evaluate(([nm, s, pt]) => {
      const t = window.__DOOR.T[nm];
      city.x = s[0]; city.y = s[1]; TRAVEL = null; const keep = MAP_TOWN_HIT, keepP = MAP_PARTY_HIT; MAP_TOWN_HIT = []; MAP_PARTY_HIT = [];
      let p = null; try { travelTo(pt[0], pt[1]); p = TRAVEL && TRAVEL.path ? TRAVEL.path.map(c => [c[0], c[1]]) : null; } finally { MAP_TOWN_HIT = keep; MAP_PARTY_HIT = keepP; TRAVEL = null; }
      return { steps: p ? p.length - 1 : null, opt: window.__DOOR.shortest(s, t), touches: !!p && window.__DOOR.touches(t, p[p.length - 1]) };
    }, [nm, pre.s, [at.sx, at.sy]]);
    tapRes.push(Object.assign({ nm, own: at.own, bare }, got));
  }
  const tapBad = tapRes.filter(r => r.none || r.steps == null || r.steps !== r.opt);
  const own = tapRes.filter(r => !r.none && r.own && r.who === r.nm);
  ok('S6 a finger on five towns sets out for the nearest side of the town it is on', own.length >= 4 && tapBad.length === 0,
     tapRes.map(r => r.nm + (r.none ? ' -' : (r.who !== r.nm ? ' (the finger on ' + r.who + '\'s name)' : '') + ' ' + r.steps + '/' + r.opt + ' blocks')).join(', '));
  const bareBad = tapRes.filter(r => !r.none && !(r.bare && r.bare.touches && r.bare.steps === r.bare.opt));
  ok('S6b a finger on a town\'s own block with no picture to take it goes to that town, the nearest side', tapRes.filter(r => !r.none).length >= 4 && bareBad.length === 0,
     tapRes.filter(r => !r.none).map(r => r.nm + ' ' + r.bare.steps + '/' + r.bare.opt).join(', '));

  /* S7: five walks on the beat, from the far side */
  const walks = [];
  for (const nm of five) {
    const st = await fr.evaluate((nm) => {
      const t = window.__DOOR.T[nm]; if (!t) return null; const s = window.__DOOR.farSide(t, 2, 4); if (!s) return null;
      try { loopClose(); } catch (e) {} TRAVEL = null; city.x = s[0]; city.y = s[1]; try { camHold(); } catch (e) {} render();
      const seq = MAP_ARRIVAL ? MAP_ARRIVAL.seq : 0; townTap({ name: nm, x: t.x, y: t.y }); try { travelGoes(); } catch (e) {}
      return { seq, steps: TRAVEL && TRAVEL.path ? TRAVEL.path.length - 1 : 0, s };
    }, nm);
    if (!st) { walks.push({ nm, none: true }); continue; }
    let r = null;
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500);
      r = await fr.evaluate((seq) => ({ arr: MAP_ARRIVAL && MAP_ARRIVAL.seq > seq ? MAP_ARRIVAL.name : null, open: LOOP.open ? LOOP.open.name : null, at: [city.x, city.y], meet: !!(window.MEET && MEET.up) }), st.seq);
      if (r.meet) await fr.evaluate(() => { try { MEET_DONE(true); } catch (e) {} });
      if (r.open) break; }
    walks.push(Object.assign({ nm, steps: st.steps }, r));
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    await page.waitForTimeout(300);
  }
  const wBad = walks.filter(w => w.none || !w.open || w.open !== w.nm || w.arr !== w.nm);
  ok('S7 five walks on the beat from the far side arrive, open that town and say its name', walks.filter(w => !w.none).length >= 4 && wBad.length === 0,
     walks.map(w => w.nm + (w.none ? ' -' : ' ' + w.steps + ' blocks -> ' + (w.open || 'not open'))).join(', '));
  ok('S8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nANY SIDE OF A TOWN IS ITS DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
