/* A TOWN IS SAFE GATE (CAMP [a town is safe], VAMILY rule 273(a)(b)(d)(e), 10/26/26).
   PAOLO 10/26: 'if you are in a settlement with other people you cannot get attacked, so you can always hang out there and heal... a
   button where time will pass... the entrance territory: if I leave and don't move a single map tile and press camp, it will be the
   settlement camp style'.
   On the cut he plays, phone and computer, his HEAL being the phone's HEAL app (a real tap):
     T1 HEAL IN A TOWN: in a town's screen through the map's door, a hurt man, a hunting crew walking up to him: HEAL passes the hours
        there (the town's own picture stays, never the camp), he heals at CAMP speed (the table's camped rate an hour, not the
        march's), and the crew never reaches him: no meet card, no fight, no camp warning
     T2 HEAL AGAIN ENDS THE REST, and he is still in the town
     T3 ON THE TOWN'S EDGE (a map tile of its edge, the town's screen closed): a hunting crew walking up never reaches him; a street
        crew does not fire on the step
     T4 HEAL ON THE EDGE opens that town's own screen to rest in, never the lone street camp
     T6 nothing threw
   (275(c), the lineup retreat landing two blocks off, is COMBAT's __PULLED_BACK__ and its own gate.)
   node gates/a_town_is_safe_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const REST = () => { try { if (BohemiaMapCamp.on()) BohemiaMapCamp.break(); } catch (e) {} try { if (typeof loopClose === 'function') loopClose(); } catch (e) {}
  try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} window.__CAMP_WARNED = []; };
/* one man of the company hurt deep (90 percent of his hit points), tape enough; his key */
const HURT = () => {
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  const names = BohemiaCondition.company().names, k = names.find(n => n !== 'YOU') || names[0];
  s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 54, armHMax: 20, lostH: 0, armBMax: 80, lostB: 0, wound: null });
  localStorage.setItem(KEY, JSON.stringify(s));
  const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  return { key: k, camped: BohemiaCondition.rates({ camped: true }).hp, march: BohemiaCondition.rates({ camped: false }).hp };
};
const LOST = (k) => { const s = JSON.parse(localStorage.getItem('bohemia.condition.v1') || '{}'); return s.men && s.men[k] ? s.men[k].lostHp : null; };
/* a hunting crew one block off, walking at him */
const HUNTER = (id) => { let at = null; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(city.x + dx, city.y + dy)) { at = [city.x + dx, city.y + dy]; break; }
  HUNT = { id: id, ev: null, name: 'The Gate Crew', arch: 'human', count: 3, at: at || [city.x + 1, city.y], steps: 0, made: performance.now() }; return HUNT.at; };

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const P = profile + ': ';
  const tapHeal = async () => { for (const x of d.page.frames()) { const sel = '#bohphone .app[data-app=heal]';
      if (await x.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }, sel).catch(() => false)) {
        const loc = x.locator(sel).first(); if (profile === 'phone_portrait') await loc.tap(); else await loc.click(); return true; } }
    return false; };
  const townFrame = async (name) => { for (let k = 0; k < 60; k++) { for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
      if (await x.evaluate((n) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, name).catch(() => false)) return x;
    await d.page.waitForTimeout(300); } return null; };
  try {
    await d.page.waitForTimeout(2500);
    await d.fr.evaluate('window.REST = ' + REST.toString() + '; window.HUNTER = ' + HUNTER.toString() + ';');   /* the gate's two helpers, in the map */
    await d.fr.evaluate(() => REST()); await d.page.waitForTimeout(500);
    /* ---- T1 HEAL in a town ---- */
    const town = await d.fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs); const n = names.find(k => mapTierOf(k) === 'town') || names[0];
      const t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return t; });
    const tf = await townFrame(town.name);
    const hurt = await d.fr.evaluate(HURT);
    await d.page.waitForTimeout(400);
    const tapped1 = await tapHeal(); await d.page.waitForTimeout(300);
    const a1 = await d.fr.evaluate((k) => { HUNTER('hunt:town'); window.__CAMP_WARNED = []; const st = BohemiaMapCamp.state(); return { on: BohemiaMapCamp.on(), hours: st.hours, lost: (JSON.parse(localStorage.getItem('bohemia.condition.v1')).men[k] || {}).lostHp, town: (window.__CAMP || {}).town }; }, hurt.key);
    await d.page.waitForTimeout(500 * 4 + 300);
    const b1 = await d.fr.evaluate((k) => ({ on: BohemiaMapCamp.on(), hours: BohemiaMapCamp.state().hours, lost: (JSON.parse(localStorage.getItem('bohemia.condition.v1')).men[k] || {}).lostHp,
      open: LOOP.open ? LOOP.open.name : null, frame: LOOP.frame ? LOOP.frame.style.display : null, meet: !!MEET.up, fight: !!LOOP.fighting, kept: window.__TOWN_KEPT || null, warned: (window.__CAMP_WARNED || []).length }), hurt.key);
    const sc1 = tf ? await tf.evaluate(() => ({ camp: BohemiaSettlement.camp().camp, place: BohemiaSettlement.state.place.name, rest: window.__TOWN_REST || null })) : null;
    const hrs = b1.hours - a1.hours, healed = a1.lost - b1.lost, perHour = hrs > 0 ? healed / hrs : 0;
    ok(P + 'T1 *** HEAL IN A TOWN *** (' + town.name + '): the hours pass there, the town\'s own picture staying, he heals at camp speed (' + hurt.camped + ' an hour, the march ' + hurt.march + '), and the crew walking up never reaches him: no card, no fight, no warning',
      !!tf && tapped1 && a1.on && a1.town === town.name && b1.on && hrs >= 3 && Math.abs(perHour - hurt.camped) < 0.6 && b1.open === town.name && b1.frame === 'block' && !b1.meet && !b1.fight && b1.warned === 0 && !!sc1 && !sc1.camp && sc1.place === town.name && !!sc1.rest,
      JSON.stringify({ tapped: tapped1, town: a1.town, hours: hrs, perHour: Math.round(perHour * 100) / 100, open: b1.open, frame: b1.frame, meet: b1.meet, kept: b1.kept && b1.kept.n, warned: b1.warned, screen: sc1 }));
    /* ---- T2 HEAL again ends the rest; still in the town ---- */
    const tapped2 = await tapHeal(); await d.page.waitForTimeout(600);
    const c2 = await d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why, open: LOOP.open ? LOOP.open.name : null, frame: LOOP.frame ? LOOP.frame.style.display : null }));
    ok(P + 'T2 HEAL AGAIN ENDS THE REST, and he is still in the town', tapped2 && !c2.on && c2.why === 'left' && c2.open === town.name && c2.frame === 'block', JSON.stringify(c2));
    /* ---- T3 on the town's edge ---- */
    const e3 = await d.fr.evaluate((t) => { REST(); let edge = null;
      for (let r = 1; r <= 4 && !edge; r++) for (let dx = -r; dx <= r && !edge; dx++) for (let dy = -r; dy <= r && !edge; dy++) { const x = t.x + dx, y = t.y + dy;
        if (!cityWalkable(x, y)) continue; const a = townAtDoor(x, y, false), on = townAtDoor(x, y, true); if (a && a.name === t.name && !on) edge = [x, y]; }
      if (!edge) return { edge: null };
      city.x = edge[0]; city.y = edge[1]; const k0 = (window.__TOWN_KEPT && window.__TOWN_KEPT.n) | 0, s0 = window.__TOWN_KEPT_STREET | 0;
      HUNTER('hunt:edge');
      for (let i = 0; i < 8; i++) { try { meetWalk(function () { mapStepWorld(); }); } catch (e) {} }
      let street = null; try { street = streetFightOnStep(); } catch (e) { street = 'threw'; }
      return { edge, meet: !!MEET.up, fight: !!LOOP.fighting, kept: ((window.__TOWN_KEPT && window.__TOWN_KEPT.n) | 0) - k0, street, streetKept: (window.__TOWN_KEPT_STREET | 0) - s0, hunt: HUNT ? HUNT.at : 'gave up' }; }, town);
    ok(P + 'T3 ON THE TOWN\'S EDGE (the screen closed): a hunting crew walking up never reaches him; a street crew does not fire on the step',
      !!e3.edge && !e3.meet && !e3.fight && e3.kept > 0 && e3.street === false && e3.streetKept === 1, JSON.stringify(e3));
    /* ---- T4 HEAL on the edge opens the town's own screen ---- */
    await d.fr.evaluate(() => { HUNT = null; });
    const tapped4 = await tapHeal(); await d.page.waitForTimeout(600);
    const tf4 = await townFrame(town.name);
    const c4 = await d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), town: (window.__CAMP || {}).town, open: LOOP.open ? LOOP.open.name : null, camp: !!(LOOP.open && LOOP.open.camp), frame: LOOP.frame ? LOOP.frame.style.display : null }));
    ok(P + 'T4 HEAL ON THE EDGE opens ' + town.name + '\'s own screen to rest in, never the lone street camp', tapped4 && c4.on && c4.town === town.name && c4.open === town.name && !c4.camp && c4.frame === 'block' && !!tf4, JSON.stringify(Object.assign(c4, { screen: !!tf4 })));
    await d.fr.evaluate(() => REST());
    ok(P + 'T6 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 160) : 'no errors');
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== A TOWN IS SAFE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
