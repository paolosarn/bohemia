#!/usr/bin/env node
/* ==========================================================================
   HIS PLACE, HIS WAY  (HOME BASE 5, 11/27/26, VAMILY rule 347(c); rules 343(d), 480(c), 441; ask row 356)

   PAOLO 11/3: 'literally every thing in our custom settlement can be customized... super easy to customize... that pseudo mayor
   vibe... not Valheim tile by tile, a Stardew Valley vibe'. Research: records/BOHEMIA_HOME_BASE_HIS_PLACE_HIS_WAY_THE_RESEARCH_11_27_26.md.
   Build record: records/BOHEMIA_HOME_BASE_HIS_PLACE_HIS_WAY_11_27_26.md.

   ENGINE (engine/bohemia_home.js setLook, pure):
     W1  a spot is a footage lot 1..12, one lot one thing (a second thing put on a lot takes it, the first goes back to where it falls);
         planted: an unplanted place refuses every choice; lot 13 refused
     W2  a paint is one of home_base.json look.paints, BARE takes the paint off; a paint that is not one is refused
     W3  a sign keeps A-Z 0-9 and a little punctuation, upper case, look.sign_max letters; empty takes it down
     W4  a job is a lot key or REST; anything else refused
   ON THE DEMO, a phone upright and sideways (his place planted, four buildings of his, five builds, a family and a man he let go
   living there), EVERY CHOICE BY A REAL TAP on the footage and the sheet:
     H1  MOVE: a tap on the water tank, MOVE: the lots it can stand on are lit; a tap on one: the tank stands there on the footage,
         a thing that stood there swaps, everything else where it stood. PLANTED (his look off at the map): the tank back where it
         fell, red.
     H2  PAINT: LIME lifts the tank's own pixels on the night footage, TAR on the roof drops them (each measured against BARE on the
         same lot). PLANTED: no paint drawn, red.
     H3  SIGN: his words typed, OK: the plate stands at the tank's lot on the footage. PLANTED: none drawn, red.
     H4  ITS NAME: a tap on the name in the camera's text opens it; ANOTHER, OK: the map's name is the list's next, the plate at his
         gate says it. PLANTED: the same tap opens nothing, red.
     H5  WHO WORKS WHAT: a tap on one who lives there: WORKS AT; a tap on a build nobody works: the map puts him on it and the footage
         stands him at it. PLANTED: the map back to the old order, red.
     H6  LAID BOTH WAYS (481(b)): the thing's sheet with MOVE, PAINT, SIGN, the name's sheet and the person's sheet: sideways a column
         beside the footage, upright under it, never over it; every button on the glass and 44 points tall.
     H7  NEVER CHOPPY (480(c)): the phone slowed four times, three seconds with his look off and three with everything painted and
         signed: the footage paints at its own six a second and his look adds no frame held past 50 ms (one at most, the spread).
     H8  KEPT: saved, the page shut and opened again (CONTINUE): the tank where he put it, its paint, its sign, the name, the job,
         what he calls them.
     H9  WHAT HE CALLS THEM (Battle Brothers: tap the name): NAME on a person's sheet, typed, OK: the map calls them that, the sheet
         says it, their job stays theirs. PLANTED: called by the name they came with, red.
   Run: node gates/his_place_his_way_gate.js [--engine] [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && !g ? '  [' + String(x).slice(0, 600) + ']' : '')); };
const done = () => { console.log('HIS PLACE, HIS WAY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };

/* ---------------- ENGINE ---------------- */
const H = require(path.join(ROOT, 'engine/bohemia_home.js'));
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/home_base.json'), 'utf8'));
H.setData(DATA);
console.log('ENGINE');
{ const r = H.make('W'), un = H.setLook(r, 'paint', 'h0:tank', 'lime');
  ok('W1 planted: an unplanted place refuses a choice (' + un.why + ')', !un.ok && un.why === 'NOT_PLANTED');
  H.plant(r, { x: 1, y: 1 }, 2, null);
  const a = H.setLook(r, 'spot', 'h0:tank', 6), b = H.setLook(r, 'spot', 'h1:garden', 6), c = H.setLook(r, 'spot', 'h2:wall', 13);
  ok('W1 one lot, one thing: the garden put on lot 6 takes it, the tank goes back to where it falls (' + JSON.stringify(r.look.spots) + '); lot 13 refused', a.ok && b.ok && r.look.spots['h1:garden'] === 6 && !('h0:tank' in r.look.spots) && !c.ok);
  const p1 = H.setLook(r, 'paint', 'h0:tank', 'lime'), p2 = H.setLook(r, 'paint', 'h0:tank', 'gold'), p3 = H.setLook(r, 'paint', 'h1:garden', 'tar'), p4 = H.setLook(r, 'paint', 'h1:garden', 'bare');
  ok('W2 a paint from the file stays, BARE takes it off, one not in the file refused (' + JSON.stringify(r.look.paint) + ')', p1.ok && !p2.ok && p3.ok && p4.ok && r.look.paint['h0:tank'] === 'lime' && !('h1:garden' in r.look.paint) && DATA.look.paints[0].id === 'bare');
  const s1 = H.setLook(r, 'sign', 'h0:tank', 'no <b>water</b> here ok?'), s2 = H.setLook(r, 'sign', 'h1:garden', '   ');
  ok('W3 a sign upper case, only letters it can paint, ' + DATA.look.sign_max + ' at most ("' + r.look.signs['h0:tank'] + '"); empty takes it down', s1.ok && /^[A-Z0-9 .,!?'&#\-]+$/.test(r.look.signs['h0:tank']) && r.look.signs['h0:tank'].length <= DATA.look.sign_max && !('h1:garden' in r.look.signs) && s2.ok);
  const j1 = H.setLook(r, 'job', 'TOMAS', '2,0'), j2 = H.setLook(r, 'job', 'ANA', 'rest'), j3 = H.setLook(r, 'job', 'ANA', 'the moon');
  ok('W4 a job is a lot or REST, nothing else (' + JSON.stringify(r.look.jobs) + ')', j1.ok && j2.ok && !j3.ok && r.look.jobs.TOMAS === '2,0' && r.look.jobs.ANA === 'rest');
  const back = H.load(H.save(r), 'W'); ok('W1 saved and loaded, it is all still there', JSON.stringify(back.look) === JSON.stringify(r.look)); }
if (process.argv.includes('--engine')) done();

/* ---------------- ON THE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle, continueThroughTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const ONLY = arg('--only');
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ONLY || p === ONLY);
async function setUp(F) {
  return F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
    const x0 = city.x, y0 = city.y; let at = null;
    for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
    BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 60; w.food = 12; wagonPut(w);
    ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3;
    const bk = lotBookFor(BohemiaBetween.mine()), P0 = purseGet(); BohemiaPurse.credit(P0, 'electricity', 20, 'gate', 'gate', DAY.day);
    ['tank', 'garden', 'solar', 'roof', 'wall'].forEach((k, i) => { try { BohemiaLotBuild.start(bk, P0, { x: i, y: 0 }, k, DAY.day, lotHoldFor(BohemiaBetween.mine())); } catch (e) {} });
    for (let q = 0; q < 2; q++) { for (const k in bk.lots) bk.lots[k].done = true; DAY.day = DAY.day + 1; try { lotWake(); } catch (e) {} }
    BohemiaHome.addResident(BohemiaHomeMap.rec(), { name: 'TOMAS ARVIZU', why: 'let go', day: DAY.day, act: 1 });
    return { at, res: BohemiaHomeMap.state().residents.map(r => r.name), workers: BohemiaHomeMap.workers() }; });
}
async function openHis(P, F) {
  await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on) && !!(window.__HOME_LOOK && window.__HOME_LOOK().on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
  if (!fr) return null;
  for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
  await P.waitForTimeout(4500); return fr;
}
function tapper(P, fr) {
  const at = async (fn, a) => { const fb = await (await fr.frameElement()).boundingBox(); const w = await fr.evaluate(fn, a); if (!w) return false; await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); return true; };
  const sel = async (q) => at(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 2) return null; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, q);
  const until = async (done, ms, a) => { for (let i = 0; i < (ms || 3000) / 200; i++) { await P.waitForTimeout(200); if (await fr.evaluate(done, a).catch(() => false)) return true; } return false; };
  return { at, sel, until };
}
/* the sheet against the footage, and every button of it on the glass at 44 points */
const LAY = () => { const sc = document.getElementById('scene').getBoundingClientRect(), sh = document.getElementById('sheet').getBoundingClientRect(), v = window.__HOME_FEED_VIEW(), st = window.__HOME_STATION;
  const S = [sh.left - sc.left, sh.top - sc.top, sh.right - sc.left, sh.bottom - sc.top].map(Math.round), R = v ? [v.X, v.Y, v.X + v.W, v.Y + v.H].map(Math.round) : null;
  const ov = R ? Math.max(0, Math.min(R[2], S[2]) - Math.max(R[0], S[0])) * Math.max(0, Math.min(R[3], S[3]) - Math.max(R[1], S[1])) : -1;
  const btn = [...document.querySelectorAll('#sbody button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { t: (b.dataset.look || b.dataset.paint || b.dataset.job || b.textContent || '').slice(0, 14), h: Math.round(r.height), on: r.left >= sc.left - 1 && r.right <= sc.right + 1 && r.top >= sc.top - 1 && r.bottom <= sc.bottom + 1 }; });
  return { side: sc.width > sc.height, W: Math.round(sc.width), H: Math.round(sc.height), st, S, R, ov, btn }; };
const laid = (g) => { if (!g.st || !g.R) return false; const lay = g.side ? (g.S[0] >= g.R[2] - 1 || g.S[2] <= g.R[0] + 1) && g.S[3] - g.S[1] >= g.H * .95 : g.S[1] >= g.R[3] - 1;
  return lay && g.ov <= g.W && g.btn.length >= 1 && g.btn.every(b => b.on && b.h >= 44); };

(async () => {
  for (const prof of PROFS) {
    console.log('ON THE DEMO, ' + prof);
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
    const set = await setUp(F);
    const fr = await openHis(P, F);
    ok('H0 his place opens on its cameras with his look on (residents ' + (set.res || []).join(', ') + ')', !!fr, JSON.stringify(set));
    if (!fr) { await d.close(); continue; }
    const T = tapper(P, fr), L = () => fr.evaluate(() => window.__HOME_LOOK());
    const close = async () => { await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); }); await P.waitForTimeout(800); };
    const send = async () => { await fr.evaluate(() => { window.postMessage({ type: 'BOHEMIA_HOME', home: JSON.parse(JSON.stringify(window.parent.BohemiaHomeMap.state())), plan: null }, '*'); }); await P.waitForTimeout(900); };
    const off = async (v) => { await F.evaluate(v => BohemiaHomeMap.lookOff(v), v); await send(); };
    const lotKey = async (id) => fr.evaluate(id => { const bk = window.parent.lotBookFor(window.parent.BohemiaBetween.mine()); for (const k in bk.lots) if (bk.lots[k].id === id) return 'h' + parseInt(k, 10); const p = (window.__HOME_DESK.home.places || []).filter(p => p.id === id)[0]; return p ? 'h' + p.lot : null; }, id);
    const tank = await lotKey('tank'), roof = await lotKey('roof');
    const openK = async (k) => { for (let t = 0; t < 3; t++) { await T.at(k => { const w = BohemiaSettlement.where(k); return w ? { x: w.x, y: w.y } : null; }, k); if (await T.until(k => BohemiaSettlement.state.open === k && !!document.querySelector('#sbody .hlook'), 3000, k)) return true; } return false; };
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(0));
    /* H1 MOVE */
    const l0 = await L(), from = l0.spots[tank];
    const o1 = await openK(tank); await P.waitForTimeout(1300);
    const g6a = await fr.evaluate(LAY);
    ok('H6 ' + (g6a.side ? 'sideways' : 'upright') + ': the tank\'s sheet with MOVE, PAINT, SIGN laid beside/under the footage, ' + g6a.btn.length + ' buttons on the glass at 44+ (' + g6a.btn.map(b => b.t + ':' + b.h).join(' ') + ')', o1 && laid(g6a) && ['move', 'paint', 'sign'].every(k => g6a.btn.some(b => b.t === k)), JSON.stringify(g6a));
    await T.sel('#sbody .hlb[data-look="move"]'); await T.until(() => !!window.__HOME_MOVE, 2500); await P.waitForTimeout(1000);
    const mv = await fr.evaluate(() => window.__HOME_MOVE);
    const to = mv && mv.can.length ? mv.can[mv.can.length - 1] : null;
    if (to != null) { await T.at(n => window.__HOME_FEED_AT(n) || null, to); await T.until(() => !!window.__HOME_MOVED, 2500); }
    await P.waitForTimeout(900);
    const l1 = await L(), moved = await fr.evaluate(() => window.__HOME_MOVED || null);
    const others = Object.keys(l0.spots).filter(k => k !== tank && l0.spots[k] !== to).every(k => l1.spots[k] === l0.spots[k]);
    const swapOk = !moved || !moved.swap || l1.spots[moved.swap] === from;
    ok('H1 MOVE: ' + (mv ? mv.can.length : 0) + ' lots lit for the tank (' + (mv && mv.can.join(',')) + '); a tap on lot ' + to + ': the tank stands on lot ' + l1.spots[tank] + ' (was ' + from + ')' + (moved && moved.swap ? ', ' + moved.swap + ' swapped to ' + l1.spots[moved.swap] : '') + ', everything else where it stood',
      !!mv && mv.can.length >= 1 && l1.spots[tank] === to && to !== from && others && swapOk, JSON.stringify({ mv, l0: l0.spots, l1: l1.spots, moved }));
    /* H2 PAINT */
    const bare = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), tank);
    await T.sel('#sbody .hlb[data-look="paint"]'); await T.until(() => !!document.querySelector('#sbody .hpaint'), 2000); await P.waitForTimeout(1100);   /* the UI's page turn lands */
    const g6p = await fr.evaluate(LAY);
    await T.sel('#sbody .hsw[data-paint="lime"]'); await T.until(() => !!window.__HOME_PAINTED, 2000); await P.waitForTimeout(800);
    const lime = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), tank);
    ok('H6 the five paints on the glass at 44+ (' + g6p.btn.filter(b => /^(bare|lime|primer|drab|tar)$/.test(b.t)).map(b => b.t + ':' + b.h).join(' ') + ')', laid(g6p) && g6p.btn.filter(b => /^(bare|lime|primer|drab|tar)$/.test(b.t)).length === 5, JSON.stringify(g6p));
    /* H3 SIGN */
    await T.sel('#sbody .hlb[data-look="sign"]'); await T.until(() => !!document.querySelector('#sbody .hsign input'), 2000);
    await T.sel('#sbody .hsign input'); await P.keyboard.type('no water'); await T.sel('#sbody .hsign [data-look="sign-ok"]'); await T.until(() => !!window.__HOME_SIGNED, 2000); await P.waitForTimeout(800);
    const l3 = await L();
    ok('H3 SIGN: typed, OK: "' + ((l3.signs[tank] || {}).text) + '" stands at the tank\'s lot on the footage', !!l3.signs[tank] && l3.signs[tank].text === 'NO WATER' && l3.look.signs[tank + ':tank'] === 'NO WATER', JSON.stringify(l3.signs));
    await close();
    let fb = null, ft = null;
    /* the roof IS the clinic's door at his place: a tap opens the clinic, whose sheet carries MOVE, PAINT, SIGN too; PAINT takes him to the roof's station */
    let shop = false; if (roof) { for (let i = 0; i < 3 && !shop; i++) { await T.at(k => { const w = BohemiaSettlement.where(k); return w ? { x: w.x, y: w.y } : null; }, roof); shop = await T.until(() => !!document.querySelector('#sbody .hlook.hshop'), 3000); }
      await P.waitForTimeout(900); fb = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), roof); const sk = await fr.evaluate(() => BohemiaSettlement.state.open);
      ok('H2 the roof is the clinic\'s door (' + sk + '): its sheet carries MOVE, PAINT, SIGN', shop && sk === 'clinic', sk);   /* the roof: the forge reads near black at night already (3 to 4 of 255) and his man stands in front of it */
      await T.sel('#sbody .hlb[data-look="paint"]'); await T.until(() => !!document.querySelector('#sbody .hpaint'), 2000); await P.waitForTimeout(1100);
      await T.sel('#sbody .hsw[data-paint="tar"]'); await P.waitForTimeout(900); ft = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), roof); await close(); }
    const painted = (b, l, f0, f1) => typeof b === 'number' && typeof l === 'number' && l >= b * 1.3 + 4 && typeof f0 === 'number' && typeof f1 === 'number' && f1 <= f0 * .7;
    ok('H2 PAINT: LIME lifts the tank on the night footage ' + bare + ' -> ' + lime + ', TAR drops the roof ' + fb + ' -> ' + ft, painted(bare, lime, fb, ft), JSON.stringify({ bare, lime, fb, ft }));
    /* H4 ITS NAME */
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(0)); await P.waitForTimeout(400);
    await T.at(() => window.__HOME_LOOK_AT('osd')); const nOpen = await T.until(() => !!document.querySelector('#sbody [data-look="another"]'), 2500); await P.waitForTimeout(600);
    const g6n = await fr.evaluate(LAY);
    ok('H6 the name\'s sheet laid ' + (g6n.side ? 'beside' : 'under') + ' the footage, its buttons on the glass at 44+', nOpen && laid(g6n), JSON.stringify(g6n));
    const want = DATA.look.names[0];
    await T.sel('#sbody [data-look="another"]'); await P.waitForTimeout(300); await T.sel('#sbody [data-look="name-ok"]'); await T.until(() => !!window.__HOME_NAMED, 2000); await P.waitForTimeout(1600);
    const nm = await F.evaluate(() => BohemiaHomeMap.state().name), l4 = await L();
    ok('H4 ITS NAME: a tap on the camera\'s name line, ANOTHER, OK: the map calls it ' + nm + ' and the plate at his gate says "' + (l4.gate && l4.gate.text) + '"', nOpen && nm === want && l4.gate && l4.gate.text === want, JSON.stringify({ nm, gate: l4.gate }));
    /* H5 WHO WORKS WHAT */
    const ppl = await fr.evaluate(() => window.__HOME_FEED_PEOPLE().filter(p => p.resident).map(p => p.name)), who = ppl.indexOf('TOMAS ARVIZU') >= 0 ? 'TOMAS ARVIZU' : ppl[0];
    let jobTo = null, w5 = null, f5 = null, r9 = null;
    if (who) { for (let t = 0; t < 3; t++) { await T.at(n => { const p = window.__HOME_FEED_PEOPLE().filter(q => q.name === n)[0]; return p ? { x: p.x, y: p.y } : null; }, who); if (await T.until(() => !!document.querySelector('#sbody .hjobs'), 2500)) break; }
      await P.waitForTimeout(900);
      const g6w = await fr.evaluate(LAY);
      ok('H6 ' + who + '\'s sheet (WORKS AT) laid ' + (g6w.side ? 'beside' : 'under') + ' the footage, its buttons on the glass at 44+', laid(g6w) && g6w.btn.some(b => b.t === 'rest'), JSON.stringify(g6w));
      jobTo = await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .hjobs .act[data-job]')].filter(e => !e.classList.contains('on') && e.dataset.job !== 'rest'); const free = b.filter(e => /^\+/.test((e.querySelector('em') || {}).textContent || '')); const e = free[0] || b[0]; return e ? e.dataset.job : null; });
      if (jobTo) { await T.sel('#sbody .hjobs .act[data-job="' + jobTo + '"]'); await T.until(g => (window.__HOME_JOBS || {}).mine === g, 3000, jobTo); await P.waitForTimeout(1500); }
      w5 = await F.evaluate(() => BohemiaHomeMap.workers()); f5 = await L();
      /* H9 WHAT HE CALLS THEM: NAME on the same sheet, typed, OK */
      await T.sel('#sbody .hwho [data-look="rename"]'); await T.until(() => !!document.querySelector('#sbody [data-look="rename-in"]'), 2500); await P.waitForTimeout(1100);
      await fr.evaluate(() => { const i = document.querySelector('#sbody [data-look="rename-in"]'); if (i) i.value = ''; });
      await T.sel('#sbody [data-look="rename-in"]'); await P.keyboard.type('el flaco'); await T.sel('#sbody [data-look="rename-ok"]'); await T.until(() => !!window.__HOME_RENAMED, 2500); await P.waitForTimeout(1500);
      r9 = { map: await F.evaluate(n => (BohemiaHomeMap.state().residents.filter(r => r.name === n)[0] || {}).called || null, who), head: await fr.evaluate(() => (document.querySelector('#sbody .say .nm') || {}).textContent || ''), job: await F.evaluate(() => BohemiaHomeMap.workers()) };
      await close(); }
    ok('H9 WHAT HE CALLS THEM: NAME on ' + who + '\'s sheet, typed, OK: the map calls them ' + (r9 && r9.map) + ', the sheet says "' + (r9 && r9.head) + '", and their job is still theirs',
      !!r9 && r9.map === 'EL FLACO' && /^EL FLACO/.test(r9.head) && r9.job[jobTo] === who, JSON.stringify(r9));
    const jobLot = f5 ? f5.spots['h' + parseInt(jobTo, 10)] : null, onFoot = f5 ? f5.feet.filter(x => x.name === who)[0] : null;
    ok('H5 WHO WORKS WHAT: a tap on ' + who + ', WORKS AT ' + jobTo + ': the map puts him there (' + JSON.stringify(w5) + ') and the footage stands him at its lot ' + jobLot + ' (' + (onFoot && onFoot.lot) + ')',
      !!jobTo && !!w5 && w5[jobTo] === who && !!onFoot && onFoot.lot === jobLot && onFoot.job, JSON.stringify({ jobTo, w5, onFoot, jobLot }));
    /* H7 NEVER CHOPPY: the same page at 4x, three seconds with his look off and three with everything painted and signed: his look
       holds the footage at its own six a second and adds no held frame (the town under the footage has its own: PLUMBER's frame walk) */
    const cdp = await P.context().newCDPSession(P).catch(() => null);
    const meas7 = async () => fr.evaluate(async () => { window.__HOME_FEED_AGE(-60000); const a = window.__HOME_FEED_VIEW(); const gaps = []; let last = performance.now();
      await new Promise(r => { const t0 = performance.now(); const f = (t) => { gaps.push(t - last); last = t; if (t - t0 < 3000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); });
      const b = window.__HOME_FEED_VIEW(); window.__HOME_FEED_AGE(60000); const L = window.__HOME_LOOK();
      return { paints: b.paints - a.paints, frames: gaps.length, over50: gaps.slice(2).filter(g => g > 50).length, worst: Math.round(Math.max.apply(null, gaps.slice(2))), signs: Object.keys(L.signs).length, painted: Object.keys(L.painted).length }; });
    await off(true); if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }).catch(() => {}); await P.waitForTimeout(1200);
    const b7 = await meas7();
    await off(false); await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.parent.BohemiaHomeMap.state())), f = window.__HOME_FEED.slots, P = ['lime', 'primer', 'drab', 'tar']; let i = 0;
      for (const n in f) { const k = f[n].key + ':' + f[n].id; h.look.paint[k] = P[i % 4]; h.look.signs[k] = 'LOT ' + n; i++; } window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); });
    await P.waitForTimeout(2500);
    const ch = await meas7();
    if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
    ok('H7 NEVER CHOPPY at 4x: ' + ch.painted + ' things painted, ' + ch.signs + ' signs: the footage painted ' + ch.paints + ' times in 3 s, ' + ch.over50 + ' frames held past 50 ms (worst ' + ch.worst + ' ms) against ' + b7.over50 + ' with his look off (' + b7.paints + ' paints)',
      ch.painted >= 5 && ch.signs >= 5 && ch.paints >= 12 && ch.paints <= 24 && ch.over50 <= b7.over50 + 1, JSON.stringify({ ch, b7 }));
    await send();   /* his own look back on the screen (the map never had the gate's paints) */
    /* PLANTED: his look off at the map; each leg's check on what the footage draws now */
    await off(true); await P.waitForTimeout(600);
    const pl = await L(), plW = await F.evaluate(() => BohemiaHomeMap.workers()), pLime = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), tank);
    ok('H1 planted: his look off, the tank falls back to lot ' + pl.spots[tank] + ', the move leg reads red', pl.spots[tank] !== to);
    ok('H2 planted: no paint drawn (' + JSON.stringify(pl.painted) + ', the tank ' + pLime + '), the paint leg reads red', !painted(bare, pLime, fb, fb) && !Object.keys(pl.painted).length);
    ok('H3 planted: no sign drawn, the sign leg reads red', !pl.signs[tank]);
    await T.at(() => window.__HOME_LOOK_AT('osd') || { x: 30, y: (document.getElementById('hfeed').getBoundingClientRect().bottom - 40) }); await P.waitForTimeout(900);
    const pn = await fr.evaluate(() => !!document.querySelector('#sbody [data-look="another"]')); await close();
    ok('H4 planted: the same tap on the name opens nothing and no plate stands at the gate, the name leg reads red', !pn && !pl.gate);
    const pc9 = await F.evaluate(n => (BohemiaHomeMap.state().residents.filter(r => r.name === n)[0] || {}).called || null, who);
    ok('H9 planted: his look off, they are called ' + (pc9 || who) + ' again, the name leg reads red', pc9 !== 'EL FLACO');
    ok('H5 planted: the map back to the old order (' + JSON.stringify(plW) + '), the job leg reads red', !(plW[jobTo] === who && pl.feet.some(x => x.name === who && x.job)));
    await off(false);
    /* H8 KEPT across a reload */
    await F.evaluate(() => { try { saveNow('gate'); } catch (e) {} }); await P.waitForTimeout(1500); await P.close().catch(() => {});
    const e = await drive.open({ again: d, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await continueThroughTitle(pg); await pg.waitForTimeout(1800); } });
    for (let i = 0; i < 40; i++) { if (await e.fr.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await e.page.waitForTimeout(250); }
    const fr2 = await openHis(e.page, e.fr);
    const k8 = fr2 ? await fr2.evaluate(() => window.__HOME_LOOK()) : null, w8 = await e.fr.evaluate(() => BohemiaHomeMap.workers()).catch(() => null);
    const c8 = await e.fr.evaluate(n => (BohemiaHomeMap.state().residents.filter(r => r.name === n)[0] || {}).called || null, who).catch(() => null);
    ok('H8 KEPT: the page shut and opened again (CONTINUE): the tank on lot ' + (k8 && k8.spots[tank]) + ', ' + (k8 && k8.painted[tank]) + ', "' + (k8 && k8.signs[tank] && k8.signs[tank].text) + '", the gate "' + (k8 && k8.gate && k8.gate.text) + '", ' + who + ' at ' + jobTo + ', called ' + c8,
      c8 === 'EL FLACO' && !!k8 && k8.spots[tank] === to && k8.painted[tank] === 'lime' && k8.signs[tank] && k8.signs[tank].text === 'NO WATER' && k8.gate && k8.gate.text === want && !!w8 && w8[jobTo] === who, JSON.stringify({ k8, w8 }).slice(0, 900));
    await e.close();
  }
  done();
})().catch(e => { console.error(e); fail++; done(); });
