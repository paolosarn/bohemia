/* THE KILL GOES IN THE STASH (WORLD 12, 11/7/26; VAMILY rule 426(e), ask line 496). It replaces THE CARCASS AND THE VULTURES' carcass
   legs: he voted that build NO on 11/6: 'you're not simplifying... I just want easy, quick interaction... maybe they end up in our
   storage... the shopping cart was an example and you ran with it'.
   ON THE DEMO HE PLAYS (the phone held up, real touches), on the map off any town's ground:
     K0 a beast fight through the one door (the shell's own end, the spoils, home): the kill lies on the map beside where the fight was
     K1 NO WORDS: the kill is drawn as the animal on its side and nothing else: no plate, no kilos, no clock, no choices, no cart
     K2 ONE TAP on the kill (a real finger): its meat is in the company's food (two nights a man) and its hide is a roll of ECONOMY's
        HIDES in the stash; the kill is gone from the map, the clock did not move, no card and no screen opened, the purse did not move
     K3 NO CART: the walk is not slower with the hides in the stash; the old hooks are gone (no pace, no haul, no tell, no leave, no den)
     K4 OFF FROM IT, STILL ONE TAP: tapped from three blocks off, the crew walks there and the walk's end takes it
     K5 THE STASH FULL: the tap still puts the meat in the food, the hide stays on the kill and the one line says the stash is full; a
        tap after there is room takes the hide
     K6 A TOWN BUYS IT: at a town's armourer the roll of hides sits in his bag with its own pack picture, shown on no man; Sell it
        sells it for batteries at the town's price
     K7 THE CREW SCREEN NEVER WEARS IT: a trade good goes on nobody (ECONOMY's own fits())
     V1 NO VULTURES (rule 431(a)(f), ask line 510): nothing circles the kill, nothing follows him, no lair birds on the map; the two
        icons that rise off a kill he took play on their own thin layer (the map not redrawn for them) and are gone in a second
     V2 the map's cap holds 'vulture' and 'lair_birds' at nought (records/target/bb/map_ambient.json)
     V3 a kill nobody takes is gone after two game days, quietly
     R  nothing threw on any page.
   PLANTED (run with --plant; each must turn its own leg red, then the gate says whether every plant was caught):
     a plate with words on the kill (K1), a tap that leaves the stash empty (K2), the cart's slower walk put back (K3).
   node gates/the_kill_goes_in_the_stash_gate.js [--plant] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
const PLANT = process.argv.includes('--plant');
let pass = 0, fail = 0, d = null;
const errs = [], legs = {};
function ok(name, good, why) { if (good) pass++; else fail++; const id = name.split(' ')[0]; legs[id] = legs[id] === false ? false : !!good; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }
const OFF_TOWN = () => { const N = om.n; let best = null, bd = 1e9;
  for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y)) continue; let near = false;
    for (let a = -5; a <= 5 && !near; a++) for (let b = -5; b <= 5 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true;
    if (near) continue; let open = 0; for (const q of DIRS) if (cityWalkable(x + q[0], y + q[1])) open++; if (open < 6) continue;
    const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } }
  if (best) { try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; try { camHold(); render(); } catch (e) {} } return best; };
const CLEAN = () => { try { if (LOOP.open) loopClose(); } catch (e) {} try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} try { if (window.MEET && MEET.up) MEET_DONE(false); } catch (e) {} try { contactClear(); } catch (e) {} try { travelStop(); } catch (e) {} };
const BAG = () => { try { return JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []; } catch (e) { return []; } };

/* a real finger on the kill, by the box the file drew for it */
async function tapKill(id) {
  const fr = d.fr, p = d.page;
  await fr.evaluate(() => { try { render(); } catch (e) {} }); await sleep(300);
  const box = await fr.evaluate((id) => { const H = BohemiaCarcass.hits(); for (const h of H) if (h.what.kill === id) return { x: h.x + h.w / 2, y: h.y + h.h / 2, w: h.w, h: h.h }; return null; }, id);
  if (!box) return { how: 'NOT DRAWN' };
  const fb = await (await fr.frameElement()).boundingBox(), cr = await fr.evaluate(() => { const c = document.getElementById('cv') || document.querySelector('canvas'); const r = c.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  await p.touchscreen.tap(fb.x + cr.x + box.x, fb.y + cr.y + box.y); await sleep(600);
  const t = await fr.evaluate(() => window.__CARCASS_TAP || null);
  return { how: t && t.id === id ? 'a tap' : 'the finger did not reach it', box };
}
/* the kill laid through the same door a fight's end uses (fightHome), at a known place */
const lay = (kind, n) => d.fr.evaluate((a) => { const b = []; for (let i = 0; i < a.n; i++) b.push({ kind: a.kind, beast: true, hurt: 0 }); const c = BohemiaCarcass.fightHome({ outcome: { dead: a.n, bodies: b, result: 'win', victory: true }, at: { gx: city.x, gy: city.y } }); return c ? { id: c.id, at: c.at } : null; }, { kind, n });

async function legsOnce(tag) {
  const fr = d.fr, p = d.page;
  /* K1 no words */
  await fr.evaluate(() => { BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); try { travelStop(); camHold(); render(); } catch (e) {} });
  await sleep(600);
  await fr.evaluate(() => { window.__GATE_RENDERS = 0; if (!window.__GATE_RWRAP) { const r0 = window.render; window.render = function () { window.__GATE_RENDERS++; return r0.apply(this, arguments); }; window.__GATE_RWRAP = r0; } });
  await sleep(2500);
  const base = await fr.evaluate(() => { const n = window.__GATE_RENDERS; if (window.__GATE_RWRAP) { window.render = window.__GATE_RWRAP; window.__GATE_RWRAP = null; } return n; });
  const c1 = await lay('american_lion', 1); await sleep(400);
  /* every word the kill's own draw puts on the glass: the plates it hands the map's name layout and any text it paints itself */
  const k1 = await fr.evaluate(() => { const C = BohemiaCarcass, d0 = C.draw, P2 = CanvasRenderingContext2D.prototype, ft = P2.fillText, st0 = P2.strokeText; let painted = 0, plated = [];
    P2.fillText = function () { if (window.__GATE_IN_KILL) painted++; return ft.apply(this, arguments); }; P2.strokeText = function () { if (window.__GATE_IN_KILL) painted++; return st0.apply(this, arguments); };
    C.draw = function (ox, oy) { const n0 = (typeof MAP_PLATES !== 'undefined' && MAP_PLATES) ? MAP_PLATES.length : 0; window.__GATE_IN_KILL = true; try { return d0.apply(this, arguments); } finally { window.__GATE_IN_KILL = false;
      try { plated = plated.concat(MAP_PLATES.slice(n0).map(q => String(q.t || ''))); } catch (e) {} } };
    try { render(); } finally { C.draw = d0; P2.fillText = ft; P2.strokeText = st0; }
    const D0 = window.__CARCASS_DREW || {}; return { drawn: D0.carcass | 0, words: painted + plated.length, painted, said: plated.slice(0, 3) }; });
  ok('K1' + tag + ' NO WORDS: the kill is the animal on its side, no plate, no kilos, no clock, no choices', !!c1 && k1.drawn >= 1 && k1.words === 0, JSON.stringify(k1));
  /* V1 the vultures over it, on their own layer */
  await fr.evaluate(() => { window.__GATE_RENDERS = 0; window.__GATE_SKY0 = BohemiaCarcass.sky().frames; if (!window.__GATE_RWRAP) { const r0 = window.render; window.render = function () { window.__GATE_RENDERS++; return r0.apply(this, arguments); }; window.__GATE_RWRAP = r0; } });
  await sleep(2500);
  const v1 = await fr.evaluate((base) => { const k = BohemiaCarcass.sky(), A = window.BohemiaAmbient ? BohemiaAmbient.stats() : {}, out = { birds: k.birds + ((A.vulture || {}).peak | 0), lairBirds: (A.lair_birds || {}).peak | 0, renders: window.__GATE_RENDERS, base };
    if (window.__GATE_RWRAP) { window.render = window.__GATE_RWRAP; window.__GATE_RWRAP = null; } return out; }, base);
  /* K2 one real tap */
  const before = await fr.evaluate(() => ({ t: T.day * 1440 + T.min, bats: loopBats(), bag: (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []).length, food: ((wagonGet() || {}).food | 0), want: BohemiaCarcass.foodOf({ kg: 135 }), mode: MODE, meet: !!(window.MEET && MEET.up) }));
  const tp = c1 ? await tapKill(c1.id) : { how: 'NO KILL' };
  await sleep(400);
  const k2 = await fr.evaluate((id) => { const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || [], mine = bag.filter(x => x && x.from === 'a kill');
    return { t: T.day * 1440 + T.min, bats: loopBats(), bag: bag.length, food: ((wagonGet() || {}).food | 0), names: mine.map(x => x.name), trade: mine.map(x => x.trade), icon: mine.map(x => x.icon),
      left: !!BohemiaCarcass.state().list.filter(c => c.id === id).length, mode: MODE, meet: !!(window.MEET && MEET.up), fight: !!LOOP.fighting, page: !!(window.parent.document.getElementById('spoilsdoor') || window.parent.document.getElementById('fightFrame')),
      settle: [...window.parent.document.querySelectorAll('iframe')].some(f => /SETTLEMENT_SCREEN|ROSTER_SCREEN/.test(f.src || '') && f.offsetParent !== null) }; }, c1 && c1.id);
  ok('K2' + tag + ' ONE TAP: its meat in the company\'s food, its hide a roll of HIDES in the stash, the kill gone, no clock, no card, no screen (' + tp.how + ')',
    tp.how === 'a tap' && before.want > 0 && k2.food === before.food + before.want && k2.trade.join() === 'hides' && /g_hides/.test(k2.icon[0] || '') && k2.bag === before.bag + 1 && !k2.left && k2.t === before.t && k2.bats === before.bats && k2.mode === 'city' && !k2.meet && !k2.fight && !k2.page && !k2.settle,
    JSON.stringify({ before, after: k2 }));
  const v1b = await fr.evaluate(() => { render(); return { birds: BohemiaCarcass.sky().birds, flew: BohemiaCarcass.last().flew | 0, layer: !!document.getElementById('killrise') }; });
  ok('V1' + tag + ' NO VULTURES: nothing circles the kill, no lair birds; the two icons rose off it on their own layer, the map not redrawn for them',
    v1.birds === 0 && v1.lairBirds === 0 && v1b.birds === 0 && v1b.flew >= 1 && v1b.layer && v1.renders <= v1.base + 2, JSON.stringify({ v1, v1b }));
  /* K3 no cart */
  const k3 = await fr.evaluate(() => { const x = city.x, y = city.y, keep = localStorage.getItem('bohemia.bag.v1'); localStorage.setItem('bohemia.bag.v1', JSON.stringify([BohemiaCarcass.hideItem('hides')])); const withMeat = cityStepMins(x, y); localStorage.setItem('bohemia.bag.v1', '[]'); const without = cityStepMins(x, y); localStorage.setItem('bohemia.bag.v1', keep);
    const C = BohemiaCarcass; return { withMeat, without, api: ['pace', 'haul', 'tell', 'leave', 'eat', 'denFor', 'dressing'].filter(k => k in C), cart: 'cart' in C.state() }; });
  ok('K3' + tag + ' NO CART: the walk is the same with the hides in the stash; no pace, haul, tell, leave, eat or den', k3.withMeat === k3.without && k3.api.length === 0 && !k3.cart, JSON.stringify(k3));
  return { c1 };
}

(async () => {
  console.log('\nTHE KILL GOES IN THE STASH (rule 426(e)): the demo, phone_portrait' + (PLANT ? ', WITH PLANTS' : ''));
  d = await D.open({ profile: 'phone_portrait' });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const fr = d.fr, p = d.page;
  await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 60000);
  await fr.evaluate(CLEAN); await fr.evaluate(() => { BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); });
  const at = await fr.evaluate('(' + OFF_TOWN + ')()');
  if (!at) { ok('a block off any town\'s ground', false, 'none'); return finish(); }

  /* ---------------- K0: a beast fight through the one door ---------------- */
  await fr.evaluate(() => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'giant lions', faction: null, draft: true, roster: [{ arch: 'beast' }, { arch: 'beast' }],
    party: { count: 2, faction: 'prides', days: 1, difficulty: 1 }, street: true, why: 'gate:kill', at: { gx: city.x, gy: city.y }, __met: true }); });
  const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
  let killed = null;
  if (f) {
    await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000);
    killed = await f.evaluate(() => { const out = []; FIGHT.S.units.forEach((u) => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; out.push({ kind: u.kind, beast: !!u.beast }); }); return out; });
    await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
    const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
    await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
      if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const b = await lb.boundingBox(); if (b && b.width >= 2) await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(1200); }
      return (await gone()) || null; }, 90000, 600);
    await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME), 15000); await sleep(1800);
  }
  const c0 = await fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1] || null, L = BohemiaCarcass.last().born.slice(-1)[0] || null;
    return { c: c ? { n: c.n, by: c.by, at: c.at, goods: c.goods.map(g => g.what + (g.kg ? ' ' + g.kg + ' kg' : '') + (g.good ? ' ' + g.good : '')) } : null, from: L ? L.bodies : null, here: [city.x, city.y] }; });
  const beasts = (killed || []).filter(b => b.beast).length;
  ok('K0 a beast fight through the one door: the kill lies beside where the fight was, with its meat and hide to give',
    !!f && !!c0.c && c0.from === true && c0.c.n === beasts && beasts > 0 && Math.max(Math.abs(c0.c.at[0] - at[0]), Math.abs(c0.c.at[1] - at[1])) <= 1 && c0.c.goods.some(n => /^meat \d+ kg$/.test(n)) && c0.c.goods.some(n => /^hide hides$/.test(n)),
    !f ? 'NO FIGHT OPENED' : JSON.stringify({ c0, killed }));
  await fr.evaluate(CLEAN); await fr.evaluate('(' + OFF_TOWN + ')()');

  await legsOnce('');

  /* ---------------- K4: from three blocks off, still one tap ---------------- */
  await fr.evaluate(() => { BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); });
  const c4 = await lay('hyena', 3);
  const off = await fr.evaluate((c) => { for (const q of [[3, 0], [0, 3], [-3, 0], [0, -3], [3, 3], [-3, -3], [3, -3], [-3, 3]]) { const x = c.at[0] + q[0], y = c.at[1] + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { city.x = x; city.y = y; try { camHold(); render(); } catch (e) {} return [x, y]; } } return null; }, c4);
  const tp4 = c4 && off ? await tapKill(c4.id) : { how: 'NO KILL OR NO SPOT' };
  const k4 = await waitFor(() => fr.evaluate((id) => { const mine = (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []).filter(x => x.from === 'a kill'); const left = BohemiaCarcass.state().list.some(c => c.id === id);
    const T0 = BohemiaCarcass.last().taken.slice(-1)[0] || {}; return !left && mine.length ? { trade: mine.map(x => x.trade), food: T0.food, at: [city.x, city.y], walking: !!TRAVEL } : null; }, c4 && c4.id), 30000, 300);
  ok('K4 OFF FROM IT, STILL ONE TAP: three hyenas tapped three blocks off, the crew walks there and the walk\'s end takes the meat and the hide (' + tp4.how + ')',
    tp4.how === 'a tap' && !!k4 && k4.trade.join() === 'hides' && k4.food > 0, JSON.stringify({ off, k4 }));

  /* ---------------- K5: the stash full ---------------- */
  await fr.evaluate(() => { BohemiaCarcass.reset(); const cap = window.BohemiaCamp && BohemiaCamp.stashSlots ? BohemiaCamp.stashSlots() : 36, b = []; for (let i = 0; i < cap; i++) b.push({ id: 'knife', kind: 'weapon', cls: 'dagger', name: 'knife', price: 1 }); localStorage.setItem('bohemia.bag.v1', JSON.stringify(b)); });
  await fr.evaluate('(' + OFF_TOWN + ')()');
  const c5 = await lay('coyote', 2);
  const tp5 = c5 ? await tapKill(c5.id) : { how: 'NO KILL' };
  const k5a = await fr.evaluate((id) => { const c = BohemiaCarcass.state().list.filter(c => c.id === id)[0], T0 = BohemiaCarcass.last().taken.slice(-1)[0] || {};
    return { left: !!c, goods: c ? c.goods.map(g => g.what) : null, food: T0.food, line: (document.getElementById('packline') || {}).textContent || '', full: BohemiaCarcass.last().full | 0, bag: (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []).length }; }, c5 && c5.id);
  await fr.evaluate(() => { const b = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'); b.splice(0, 2); localStorage.setItem('bohemia.bag.v1', JSON.stringify(b)); });
  const tp5b = c5 ? await tapKill(c5.id) : { how: 'NO KILL' };
  const k5b = await fr.evaluate((id) => ({ left: BohemiaCarcass.state().list.some(c => c.id === id), trade: (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []).filter(x => x.from === 'a kill').map(x => x.trade) }), c5 && c5.id);
  ok('K5 THE STASH FULL: the meat still goes in the food, the hide stays on the kill and the line says so; with room, one tap takes the hide',
    tp5.how === 'a tap' && k5a.left && k5a.goods.join() === 'hide' && k5a.food > 0 && /stash is full/i.test(k5a.line) && k5a.full >= 1 && tp5b.how === 'a tap' && !k5b.left && k5b.trade.join() === 'hides', JSON.stringify({ k5a, k5b }));

  /* ---------------- V3: gone after two game days ---------------- */
  await fr.evaluate(() => { BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); });
  const c3 = await lay('feral_hog', 1);
  const v3 = await fr.evaluate((id) => { const has = () => BohemiaCarcass.state().list.some(c => c.id === id); const a = has(); advance(47 * 60); const b = has(); advance(2 * 60); return { born: a, at47: b, at49: has() }; }, c3 && c3.id);
  ok('V3 a kill nobody takes is still there after 47 game hours and gone after 49, quietly', v3.born && v3.at47 && !v3.at49, JSON.stringify(v3));
  const v2 = await fr.evaluate(() => { const A = window.BohemiaAmbient; return A ? { vulture: A.cap('vulture'), lair: A.cap('lair_birds'), loaded: A.loaded(), onMap: BohemiaCarcass.data().vultures.on_the_map } : null; });
  ok('V2 the map\'s cap holds the vulture and the lair birds at nought, and the kill\'s data says no vultures on the map', !!v2 && v2.vulture === 0 && v2.lair === 0 && v2.loaded && v2.onMap === false, JSON.stringify(v2));
  const v4 = await fr.evaluate(() => ({ meet: !!(window.MEET && MEET.up), fight: !!LOOP.fighting, frame: !!window.parent.document.getElementById('fightFrame') }));
  ok('V4 they never attack the living: no card, no fight from any of this', !v4.meet && !v4.fight && !v4.frame, JSON.stringify(v4));

  /* ---------------- K7: the crew screen never wears it (ECONOMY's own guard on every trade good) ---------------- */
  const ROS = require('fs').readFileSync(path.join(ROOT, 'slices/BOHEMIA_ROSTER_SCREEN.html'), 'utf8');
  const k7s = { fits: /function fits\(it, slot\)\{ if\(!it \|\| it\.trade\) return false;/.test(ROS), slotOf: /function slotOf\(it\)\{ if\(it && it\.trade\) return null;/.test(ROS),
    hide: await fr.evaluate(() => { const it = BohemiaCarcass.hideItem('hides'); return it ? { trade: it.trade, kind: it.kind } : null; }) };
  ok('K7 THE CREW SCREEN NEVER WEARS IT: the roll of hides is a trade good, and the crew screen puts a trade good on nobody', k7s.fits && k7s.slotOf && !!k7s.hide && k7s.hide.trade === 'hides', JSON.stringify(k7s));

  /* ---------------- PLANTED: each must turn its leg red ---------------- */
  if (PLANT) {
    console.log('\n--- PLANTED (each must go red) ---');
    const keep = { pass, fail, legs: Object.assign({}, legs) };
    await fr.evaluate(CLEAN); await fr.evaluate('(' + OFF_TOWN + ')()');
    await fr.evaluate(() => { const C = BohemiaCarcass; window.__GATE_UNPLANT = { draw: C.draw, take: C.take, tap: C.tap, step: window.cityStepMins };
      /* a plate with words on the kill */
      const d0 = C.draw; C.draw = function (ox, oy) { d0(ox, oy); try { C.state().list.forEach(c => { const p = iso(c.at[0], c.at[1], ox, oy); MAP_PLATES.push({ t: '1 AMERICAN LION · 135 KG · FRESH 6H', lx: p.sx, ly: p.sy, w: 80, col: '#f2d7a0', sx: p.sx, cy: p.sy, r: 33, box: { x: p.sx, y: p.sy, w: 80, h: 11 }, carcass: true }); }); } catch (e) {} };
      /* a tap that leaves the stash empty */
      C.take = function () { return false; }; const t0 = C.tap; C.tap = function (x, y) { const r = t0(x, y); try { const b = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').filter(i => i.from !== 'a kill'); localStorage.setItem('bohemia.bag.v1', JSON.stringify(b)); } catch (e) {} return r; };
      /* the cart's slower walk put back */
      const s0 = window.cityStepMins; window.cityStepMins = function (x, y) { const b = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'); return s0(x, y) * (b.some(i => i.from === 'a kill') ? 1.5 : 1); }; });
    Object.keys(legs).forEach(k => delete legs[k]);
    await legsOnce(' [planted]');
    const caught = { K1: legs.K1 === false, K2: legs.K2 === false, K3: legs.K3 === false };
    pass = keep.pass; fail = keep.fail; Object.assign(legs, keep.legs);   /* the plants' reds are expected; only whether each bit counts */
    ok('PLANTS every planted defect turned its leg red', caught.K1 && caught.K2 && caught.K3, JSON.stringify(caught));
    await fr.evaluate(() => { const C = BohemiaCarcass, U = window.__GATE_UNPLANT; C.draw = U.draw; C.take = U.take; C.tap = U.tap; window.cityStepMins = U.step; });
  }

  /* ---------------- K6: a town buys it ---------------- */
  await fr.evaluate(() => { BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', JSON.stringify([BohemiaCarcass.hideItem('hides')])); });
  await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await sleep(400);
    for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  let k6 = null;
  if (sf) {
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await sleep(1200);
    for (let tries = 0; tries < 4; tries++) {   /* the town's door can still be gliding in: a real tap on the armourer, again until it opens */
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await sleep(500);
      const w = await sf.evaluate(() => BohemiaSettlement.where('armourer')), fb = await (await sf.frameElement()).boundingBox();
      if (w) await p.touchscreen.tap(fb.x + w.x, fb.y + w.y);
      const opened = await sf.waitForFunction(() => BohemiaSettlement.state.open === 'armourer', null, { timeout: 4000 }).then(() => true).catch(() => false);
      if (opened) break; await sleep(1500); }
    await sleep(800);
    const tapEl = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel);
      if (!r) return false; const fb2 = await (await sf.frameElement()).boundingBox(); await p.touchscreen.tap(fb2.x + r.x, fb2.y + r.y); await sleep(500); return true; };
    const g0 = await sf.evaluate(() => { const t = [...document.querySelectorAll('#baggrid .slot.full')]; return { open: BohemiaSettlement.state.open, bats: BohemiaSettlement.bats(), n: BohemiaSettlement.state.stash.length,
      tiles: t.map(x => ({ name: (x.querySelector('.nm2') || {}).textContent || '', pic: ((x.querySelector('img') || {}).getAttribute ? x.querySelector('img').getAttribute('src') : '') || '' })) }; });
    const picked = await tapEl('#baggrid .slot.full:nth-child(1)');
    const g1 = await sf.evaluate(() => ({ onman: !!document.querySelector('#shopstrip .onman.ss-man:not(.ss-empty)'), sell: (document.getElementById('sellit') || {}).textContent || '' }));
    await tapEl('#sellit');
    const g2 = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), n: BohemiaSettlement.state.stash.length, left: BohemiaSettlement.state.stash.filter(x => x.from === 'a kill').length }));
    k6 = { g0, picked, g1, g2 };
    await sf.evaluate(() => { try { BohemiaSettlement.close ? BohemiaSettlement.close() : null; } catch (e) {} });
  }
  ok('K6 A TOWN BUYS IT: the roll of hides in his bag with its own pack picture, shown on no man, Sell it pays batteries at the town\'s price',
    !!k6 && k6.g0.open === 'armourer' && k6.g0.tiles.length === 1 && /g_hides/.test(k6.g0.tiles[0].pic) && k6.picked && !k6.g1.onman && /sell it/i.test(k6.g1.sell) && k6.g2.left === 0 && k6.g2.bats > k6.g0.bats,
    JSON.stringify(k6));

  ok('R nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  return finish();
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
async function finish() {
  console.log('\nTHE KILL GOES IN THE STASH: ' + pass + ' passed, ' + fail + ' failed');
  try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
