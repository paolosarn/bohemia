#!/usr/bin/env node
// STAFF 2 [the staff push a cart] 11/22 -- VAMILY rule 471 ON HIS PHONE (rule 441: the page he plays, upright and sideways, started the way he
// starts it). A NEW CREW with his camp four (the cook, the surgeon, the blacksmith, the cab driver), the surgeon's cart welded up once (a steel
// utility cart) and the blacksmith's twice (a wagon), the company's food, meds and tape counted (written to the books before the page's
// scripts, the one shortcut, said), then:
//   M1 THE MAP: his camp walks behind his company, each pushing a cart (the map frame's own count, MAP_DREW.camp and campAt)
//   F1 THE BELL: a road crew off the town through the one driver; every staff member on the board has his book's cart, its back and its front
//      drawn on the glass this second; no fighter has a cart; no staff member holds a two-hander or a shield
//   F2 THE ONE HAND: every staff member's weapon one-handed (the cab driver's snub revolver, the blacksmith's hammer, the box cutters)
//   F3 IT GOES OVER: AUTO plays the fight to its end; a staff member struck down has his cart drawn on its side (the fight's own fall, called on
//      the cook in round two so the picture is certain) and what it held leaves the company's count after the fight
//   C1 THE CAMP: MAKE CAMP after; every follower by the fire stands with his cart drawn (the camp frame's own count, __CAMP_CARTS)
//   P1 no page scroll sideways; P2 the fight's first ten seconds, frames a second; P3 nothing threw
// Writes <out>/cart_<tag>.json and the pictures.
// node tools/bohemia_staff_cart_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FORGE_ONLY = process.argv.indexOf('--forge-only') > 0, ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_cart')), TAG = ALPHA ? 'alpha' : 'demo';
fs.mkdirSync(OUTD, { recursive: true });
const CAMP = ['cook', 'surgeon', 'blacksmith', 'scout'], SUP = { food: 26, meds: 9, tape: 30, rounds: 40 };

async function walk(shape) {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__cartProof) { c.retinue = " + JSON.stringify(CAMP) + "; c.carts = { surgeon: 1, blacksmith: 2 }; c.__cartProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } } catch (e) {}";
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm });
  const page = d.page, errs = [], row = { shape, surface: TAG, hired: CAMP.slice() };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const short = shape === 'phone_portrait' ? 'upright' : 'sideways';
  const shot = async (name) => { const f = path.join(OUTD, TAG + '_' + short + '_' + name + '.png'); await page.screenshot({ path: f }); return path.relative(ROOT, f); };
  const forgeStep = async (cf) => {
      /* U1 THE FORGE: the sheet his place's forge opens (homePlaceSheet's forge branch, the page's own), opened on the town screen he starts in with a
         built forge handed to it (the shortcut, said: planting his place and building the forge takes days, HOME BASE's gate walks that);
         a REAL TAP on the cab driver's row: 150 batteries and 20 tape off, his cart a steel utility cart, the row now offers the wagon */
      for (let i = 0; i < 40; i++) { if (await cf.evaluate(() => { try { return BohemiaSettlement._bats() > 0; } catch (e) { return false; } }).catch(() => false)) break; await page.waitForTimeout(250); }   /* the purse reaches the town's screen a moment after it opens */
      const pre = await cf.evaluate(() => { try { BohemiaSettlement._forge(); } catch (e) { return { err: String(e) }; }
        const C = window.BohemiaCamp, w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}');
        return { rows: [...document.querySelectorAll('#sbody .act[data-cart]')].map(b => b.dataset.cart + ':' + b.dataset.cartNow + ':' + (b.disabled ? 'off' : 'on') + ':' + b.textContent), bats: BohemiaSettlement._bats(), tape: w.tape | 0, lv: C.cartLevel('scout') }; }).catch(e => ({ err: String(e) }));
      await page.waitForTimeout(700);
      let fb2 = null; try { fb2 = await (await cf.frameElement()).boundingBox(); } catch (e) {}   /* the camp's screen sits inside the map's frame: its box on the page */
      /* HOME BASE's own tap (gates/home_base_gate.js tapQ17): the sheet settled (no slide left), then a thumb on the row, again if it missed */
      const settle = async () => { for (let i = 0; i < 25; i++) { const still = await cf.evaluate(() => { const t = getComputedStyle(document.getElementById('sheet')).transform; return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'; }).catch(() => true); if (still) return; await page.waitForTimeout(100); } };
      let bt = null;
      for (let t = 0; t < 3; t++) { await settle();
        const loc = cf.locator('#sbody .act[data-cart="scout"]').first(); if (!(await loc.count()) || await loc.isDisabled().catch(() => true)) break;
        await loc.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(400); bt = await loc.boundingBox().catch(() => null);   /* his thumb scrolls the sheet till the row is mid-glass */
        /* the camp gate's own way (gates/camp_holds_until_he_ends_it_gate.js): a thumb upright, the sideways profile has no touch screen, a click */
        if (shape === 'phone_portrait') await loc.tap({ timeout: 4000 }).catch(() => {}); else await loc.click({ timeout: 4000 }).catch(() => {});
        let hit = false; for (let i = 0; i < 12 && !hit; i++) { await page.waitForTimeout(250); hit = await cf.evaluate(() => !!window.__HOME_CART).catch(() => false); }
        if (hit) break; }
      if (process.env.CART_DEBUG_CLICK && !(await cf.evaluate(() => !!window.__HOME_CART).catch(() => false))) row.forgeJsClick = await cf.evaluate(() => { const e = document.querySelector('#sbody .act[data-cart="scout"]'); if (!e) return 'no row'; const r = { disabled: e.disabled, pe: getComputedStyle(e).pointerEvents, sheetPe: getComputedStyle(document.getElementById('sheet')).pointerEvents }; e.click(); r.after = !!window.__HOME_CART; return r; }).catch(e => String(e));
      await page.waitForTimeout(600);
      row.png_forge = await shot('the_forge_welds_a_cart');
      const post = await cf.evaluate(() => { const C = window.BohemiaCamp, w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}');
        return { tapped: window.__HOME_CART || null, rows: [...document.querySelectorAll('#sbody .act[data-cart]')].map(b => b.dataset.cart + ':' + b.dataset.cartNow + ':' + (b.disabled ? 'off' : 'on') + ':' + b.textContent), bats: BohemiaSettlement._bats(), tape: w.tape | 0, lv: C.cartLevel('scout') }; }).catch(e => ({ err: String(e) }));
      row.forge = { pre, post, tapAt: bt };
  };
  try {
    await page.waitForTimeout(2500);
    /* the company's counts after the door seeded its own (the origin's week): the cart's stock is read off these at the fight's door */
    await d.fr.evaluate((sup) => { localStorage.setItem('bohemia.supplies.v1', JSON.stringify(sup)); try { if (typeof __barPaintRead === 'function') __barPaintRead(); } catch (e) {} }, SUP);
    /* U1 first, in the town he starts in (its screen is up at the door; the camp ends itself once everyone is whole) */
    { await d.fr.evaluate(() => { try { const t = startTownPick(); if (t) loopOpenTown({ name: t.name, x: t.x, y: t.y, tier: t.tier }); } catch (e) {} });   /* the town he starts beside, opened the way a tap on it opens it */
      let tf = null; for (let k = 0; k < 60 && !tf; k++) { for (const x of page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
          if (await x.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) tf = x;
        if (!tf) await page.waitForTimeout(300); }
      if (tf) await forgeStep(tf); else row.forgeWhy = 'no town screen'; }
    if (FORGE_ONLY) throw new Error('FORGE_ONLY');
    /* M1 THE MAP: BEGIN pressed (the driver skips the title: the shell's own flag, so the people's sheets the first play holds come in),
       off the town's ground (a town is a door), his camp drawn behind him at the map's own zoom */
    await page.evaluate(() => { window.__PLAY_BEGAN = true; });
    await d.fr.evaluate(drive.offTheTown).catch(() => null);
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { camHold(); } catch (e) {} });   /* his own zoom: the people stand at his size at every zoom */
    let m1 = null; for (let k = 0; k < 90; k++) { await page.waitForTimeout(500);
      m1 = await d.fr.evaluate(() => ({ camp: (window.MAP_DREW || {}).camp | 0, at: ((window.MAP_DREW || {}).campAt || []).slice(-4), err: (window.MAP_DREW || {}).campErr || null, you: (window.MAP_DREW || {}).you || null })).catch(() => null);
      if (m1 && m1.camp >= 1) break; }
    row.map = m1; row.png_map = await shot('the_camp_on_the_map');
    /* the fight */
    const c = await drive.roadFightOffTheTown(d);
    if (!c) throw new Error('no road fight stood');
    await c.evaluate(() => { window.__SF = { n: 0, t0: performance.now(), gaps: [] }; let last = performance.now();
      const tick = (t) => { const S = window.__SF; S.n++; S.gaps.push(t - last); last = t; if (t - S.t0 < 10000) requestAnimationFrame(tick); else S.t1 = t; }; requestAnimationFrame(tick); });
    for (let k = 0; k < 40; k++) { await page.waitForTimeout(400); if (await c.evaluate(() => { const D = FIGHT_UI.cartDrawn || {}; return FIGHT.S.units.filter(u => u.staff && FIGHT.onField(u)).every(u => D[u.id]); }).catch(() => false)) break; }
    await page.waitForTimeout(600);
    row.bell = await c.evaluate(() => { const now = performance.now(), D = (FIGHT_UI.cartDrawn || {}), S = FIGHT.S;
      return { units: S.units.map(u => ({ id: u.id, side: u.side, staff: !!u.staff, staffId: u.staffId || null, name: u.name, cart: u.cart ? u.cart.id : null, load: u.cart ? u.cart.load : null, n: u.cart ? u.cart.n : 0,
        weapon: (u.weapon.of || u.weapon).id, two: FIGHT._t.bothHands(u.weapon), shield: !!(u.shield || u.shieldBack), face: u.cartFace, onField: FIGHT.onField(u),
        drawn: D[u.id] ? Math.round(now - D[u.id].at) : null, drawnWhich: D[u.id] ? D[u.id].which : null })),
        seen: { back: (FIGHT_UI.clipSeen || {})['cart:back'] | 0, front: (FIGHT_UI.clipSeen || {})['cart:front'] | 0 } }; });
    { const fh = await page.$('#fightFrame'), fb = fh ? await fh.boundingBox() : null, iw = await c.evaluate(() => [innerWidth, innerHeight]);
      row.onGlass = await c.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you' && FIGHT.onField(u)).map(u => ({ staff: !!u.staff, name: u.name, bar: u._bar ? { x: u._bar.x, y: u._bar.y } : null })));
      if (fb) row.onGlass.forEach(g => { if (g.bar) { g.px = fb.x + g.bar.x * fb.width / iw[0]; g.py = fb.y + g.bar.y * fb.height / iw[1]; } });
      row.view = await page.evaluate(() => [innerWidth, innerHeight]); }
    row.png_bell = await shot('the_carts_at_the_bell');
    /* the close-up for the card: the fight's own camera pinched in on his camp (his own pinch would do the same), then given back */
    row.close = await c.evaluate(() => { const st = FIGHT.S.units.filter(u => u.staff && FIGHT.onField(u)); if (!st.length) return null;
      camMine(); UI.zoom = UI.zoom * 2.6; UI.cx = st.reduce((a, u) => a + (u.x + 0.5) * UI.tw, 0) / st.length; UI.cy = st.reduce((a, u) => a + (u.y + 0.7) * UI.th, 0) / st.length; clampCam(); return { z: UI.zoom }; }).catch(() => null);
    await page.waitForTimeout(900); row.png_close = await shot('the_carts_close');
    await c.evaluate(() => { UI.pinched = false; fitNow(); }).catch(() => null);
    row.scroll = { top: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), fight: await c.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
    await page.waitForTimeout(8000);
    row.frames = await c.evaluate(() => { const S = window.__SF, ms = (S.t1 || performance.now()) - S.t0, g = S.gaps.slice(1).sort((a, b) => a - b);
      return { fps: +(1000 * S.n / ms).toFixed(1), worstMs: Math.round(g[g.length - 1] || 0), p95Ms: Math.round(g[Math.floor(g.length * 0.95)] || 0) }; });
    /* F3 IT GOES OVER: AUTO on; the cook falls in round two (the fight's own fall: struck down, so dead), and the fight plays on to its end */
    await c.evaluate(() => { FIGHT_UI.auto = true; });
    let felled = null; const t1 = Date.now();
    while (Date.now() - t1 < 240000 && !(await c.evaluate(() => FIGHT.S.over).catch(() => true))) { await page.waitForTimeout(700);
      if (!felled) felled = await c.evaluate(() => { if (FIGHT.S.round < 2) return null; const u = FIGHT.S.units.find(v => v.staffId === 'cook' && FIGHT.onField(v)); if (!u) return null;
        const a = FIGHT.S.units.find(v => v.side === 'them' && FIGHT.onField(v)); FIGHT._t.fall(u, a); return { id: u.id, name: u.name, round: FIGHT.S.round, n: u.cart ? u.cart.n : 0, load: u.cart ? u.cart.load : null }; }).catch(() => null);
      if (felled && !row.tip) { await page.waitForTimeout(1500);
        await c.evaluate((id) => { FIGHT_UI.auto = false; const u = FIGHT.byId(id); if (!u) return; camMine(); UI.zoom = UI.zoom * 2.6; UI.cx = (u.x + 0.5) * UI.tw; UI.cy = (u.y + 0.7) * UI.th; clampCam(); }, felled.id).catch(() => null); await page.waitForTimeout(700);
        row.tip = await c.evaluate((id) => { const D = (FIGHT_UI.cartDrawn || {})[id]; return D ? { which: D.which, ago: Math.round(performance.now() - D.at), face: D.face } : null; }, felled.id).catch(() => null);
        { const fh = await page.$('#fightFrame'), fb = fh ? await fh.boundingBox() : null;
          const at = await c.evaluate((id) => { const v = FIGHT.byId(id); if (!v) return null; return [sx((dx(v) + .5) * UI.tw), sy((dy(v) + .9) * UI.th), innerWidth, innerHeight, UI.zoom * UI.th]; }, felled.id).catch(() => null);
          if (fb && at) row.tipAt = { x: fb.x + at[0] * fb.width / at[2], y: fb.y + at[1] * fb.height / at[3], tile: at[4] * fb.height / at[3] }; }
        row.png_tip = await shot('the_cooks_cart_goes_over'); await c.evaluate(() => { UI.pinched = false; fitNow(); FIGHT_UI.auto = true; }).catch(() => null); } }
    row.felled = felled;
    row.auto = await c.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, rounds: FIGHT.S.round, staff: FIGHT.S.units.filter(u => u.staff).map(u => ({ id: u.staffId, dead: !!u.dead })) }));
    let sf = null; const t0 = Date.now();
    while (Date.now() - t0 < 25000 && !sf) { const h = await page.$('#spoilsdoor iframe'); const f = h && await h.contentFrame(); if (f && await f.evaluate(() => !!document.getElementById('leave')).catch(() => false)) sf = f; else await page.waitForTimeout(400); }
    if (sf) { await page.waitForTimeout(900); const h = await page.$('#spoilsdoor iframe'), hb = await h.boundingBox();
      const b = await sf.evaluate(() => { const e = document.getElementById('leave'); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, innerWidth, innerHeight]; });
      await page.touchscreen.tap(hb.x + b[0] * hb.width / b[2], hb.y + b[1] * hb.height / b[3]); }
    await page.waitForTimeout(2500);
    row.after = await page.evaluate(() => { let C = null, sup = null; try { C = document.getElementById('cityFrame').contentWindow.BohemiaCamp; } catch (e) {}
      try { sup = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'); } catch (e) {}
      return { lost: window.__NF_STAFF_LOST || null, camp: C ? C.retinue() : null, supplies: sup, cookCart: C && C.cartLevel ? C.cartLevel('cook') : null }; });
    /* C1 THE CAMP: off the town, MAKE CAMP; the camp's own frame draws each follower with his cart */
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} });
    await d.fr.evaluate(drive.offTheTown).catch(() => null);
    row.campMade = await d.fr.evaluate(() => { try { CITY_CONTACT_POSTED = true; return !!BohemiaMapCamp.make(); } catch (e) { return String(e); } });
    let cf = null; for (let k = 0; k < 120 && !cf; k++) { for (const x of page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
        if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) cf = x;
      if (!cf) await page.waitForTimeout(300); }
    if (cf) { let cc = null; for (let k = 0; k < 30; k++) { await page.waitForTimeout(400); cc = await cf.evaluate(() => { const C = window.__CAMP_CARTS || {}, now = performance.now(); return Object.keys(C).map(k => ({ id: k, kind: C[k].kind, load: C[k].load, face: C[k].face, ago: Math.round(now - C[k].at) })); }).catch(() => null);
        if (cc && cc.length) break; }
      row.fire = cc; await page.waitForTimeout(1500); row.png_camp = await shot('the_carts_by_the_fire');
      }
    else row.fireWhy = 'no camp frame';
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); row.errAt = String(e && e.stack || '').split('\n').slice(0, 3).join(' | ').slice(0, 300); }
  if (row.err === 'FORGE_ONLY') delete row.err;
  row.errs = errs.slice(0, 6);
  const U = (row.bell && row.bell.units) || [], st = U.filter(u => u.staff && u.onField), fighters = U.filter(u => !u.staff);
  const book = { cook: 'shopping_cart', surgeon: 'utility_cart', blacksmith: 'wagon', scout: row.forge && row.forge.post && row.forge.post.lv === 1 ? 'utility_cart' : 'shopping_cart' };   /* the cab driver's welded up at the forge first */
  const lostCook = ((row.after && row.after.lost) || []).find(x => x.id === 'cook');
  row.P = {
    M1: !!(row.map && row.map.camp >= 1),
    F1: st.length > 0 && st.every(u => u.cart === book[u.staffId] && u.drawn !== null && u.drawn < 1500) && fighters.every(u => !u.cart) && !!row.bell && row.bell.seen.back > 0 && row.bell.seen.front > 0,
    F2: st.length > 0 && st.every(u => !u.two && !u.shield) && st.some(u => u.weapon === 'snub_revolver') && st.some(u => u.weapon === 'pickaxe'),
    F3: !!(row.felled && row.tip && row.tip.which === 'tip' && lostCook && lostCook.spilt && lostCook.spilt.n === row.felled.n),
    U1: !!(row.forge && row.forge.pre && row.forge.post && row.forge.pre.lv === 0 && row.forge.post.lv === 1 && row.forge.pre.bats - row.forge.post.bats === 150 && row.forge.pre.tape - row.forge.post.tape === 20
      && row.forge.post.rows.some(r => /^scout:utility_cart:(on|off):.*WAGON/.test(r))),
    C1: !!(row.fire && row.after && Array.isArray(row.after.camp) && row.after.camp.length > 0 && row.after.camp.every(id => row.fire.some(x => x.id === id && x.ago < 3000))),
    P1: !!row.scroll && row.scroll.top <= 0 && row.scroll.fight <= 0, P2: !!row.frames && row.frames.fps > 0, P3: !row.err && !errs.length };
  if (FORGE_ONLY) row.P = { U1: row.P.U1, P3: !row.err && !errs.length };
  console.log('  ' + TAG + ' ' + shape + ': ' + (row.err ? 'ERR ' + row.err + ' ' : '') + 'map camp ' + (row.map && row.map.camp) + ' | ' + st.map(u => u.name.split(' ')[0] + ' ' + u.cart + '/' + u.load + ' ' + u.weapon + (u.drawn !== null ? ' drawn' : ' NOT DRAWN')).join('; ') +
    ' | fighters with a cart ' + fighters.filter(u => u.cart).length + ' | fps ' + (row.frames && row.frames.fps) + ' worst ' + (row.frames && row.frames.worstMs) + ' ms | felled ' + JSON.stringify(row.felled) + ' tip ' + JSON.stringify(row.tip) +
    ' | lost ' + JSON.stringify(lostCook && lostCook.spilt) + ' | forge ' + JSON.stringify(row.forge && row.forge.post && { lv: row.forge.post.lv, rows: row.forge.post.rows }) + ' | camp ' + (row.fireWhy || JSON.stringify((row.fire || []).map(x => x.id + ':' + x.kind))) + ' | ' + Object.keys(row.P).map(k => k + (row.P[k] ? ' ok' : ' RED')).join(' ') + (errs.length ? ' | errors ' + errs.join(' / ') : ''));
  await d.close().catch(() => {});
  return row;
}

(async () => {
  const rows = []; for (const s of SHAPES) rows.push(await walk(s));
  fs.writeFileSync(path.join(OUTD, 'cart_' + TAG + (FORGE_ONLY ? '_forge' : '') + '.json'), JSON.stringify(rows, null, 1));
  const red = rows.some(r => Object.values(r.P || {}).some(v => !v));
  console.log(red ? 'THE STAFF PUSH A CART ON THE PHONE: RED' : 'THE STAFF PUSH A CART ON THE PHONE: green');
  process.exit(red ? 1 : 0);
})();
