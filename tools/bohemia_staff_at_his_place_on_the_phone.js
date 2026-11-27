#!/usr/bin/env node
// STAFF 2 [at his place] 11/27 -- VAMILY rule 482 on the staff as built, the coordinator's next: "their work at camp and at his place
// shows (the cook cooking, the medic healing), the cart reads from every camera". The page he plays, his phone upright and on its side:
// the camp book holds the cook, the surgeon, the blacksmith and the cab driver; his place planted and its forge, yard, lookout and grinder
// built (HOME BASE's own calls, the shortcut its proof takes: planting and building takes days); one of his men struck down (the
// condition book's afterFight); his place opened the way a tap on it opens it, and its footage read on each of its cameras in turn
// (the footage's own cut): who the frame drew, each camp person's lot, act and cart, the cart's height in the footage's pixels.
//   F1 every camp person is on his place's footage on some camera, each with his cart drawn there; F2 the blacksmith on the forge's lot
//   at his repair, the cook at her cook, the surgeon on the hurt man's lot at his tend; F3 the acts are ANIMATION's cells for those
//   bodies (not a stand-in); P no page error.
//   node tools/bohemia_staff_at_his_place_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const ALPHA = A.includes('--alpha'), CODE = arg('--code', 'K7QM9X'), SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(',');
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_cart')), TAG = ALPHA ? 'alpha' : 'demo';
const CAMP = ['cook', 'surgeon', 'blacksmith', 'scout'];
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__placeProof) { c.retinue = " + JSON.stringify(CAMP) + "; c.carts = { surgeon: 1, blacksmith: 2 }; c.__placeProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } } catch (e) {}";
  /* through the title the way he comes in (HOME BASE's proof does the same): his company dealt to the town screens */
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
  const P = d.page, F = d.fr, errs = [], row = { shape, surface: TAG, cams: [] };
  P.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const short = shape === 'phone_portrait' ? 'upright' : 'sideways';
  try {
    for (let i = 0; i < 60; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaHomeMap)).catch(() => false)) break; await P.waitForTimeout(250); }
    await P.evaluate(() => { window.__PLAY_BEGAN = true; });
    /* his place planted and built (HOME BASE's own calls, as its proof plants it) */
    row.planted = await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
      const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.ok !== false) { at = [x, y]; break; } }
      if (!at) return 'no ground'; BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 30; w.food = 12; wagonPut(w);
      ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3; return at; }).catch(e => String(e));
    /* one of his men struck down (the condition book's afterFight), for the one who heals */
    const names = await P.evaluate(() => { try { return (BOH_START.picks().company || []).map(m => m && m.name).filter(Boolean); } catch (e) { return []; } });
    row.hurt = await F.evaluate((names) => { const C = window.BohemiaCondition; if (!C || !C.afterFight) return null; const L = names.filter(n => !/^YOU$/i.test(n)).slice(1, 2);
      C.afterFight(L.map(n => ({ name: n, hp: 2, hpMax: 60, down: true })), { day: 3 }); return L; }, names).catch(e => String(e));
    await P.waitForTimeout(1500);
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 160 && !fr; i++) { await P.waitForTimeout(250); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) fr = x; }
    if (!fr) throw new Error('his place did not open on its footage');
    await P.waitForTimeout(3000);
    row.staff = await fr.evaluate(() => window.__HOME_STAFF || null).catch(() => null);
    row.workers = await fr.evaluate(() => ({ workers: window.__HOME_WORKERS || null, shop: (function () { try { return shopCrew().map(m => m.name + ':' + m.look); } catch (e) { return String(e); } })() })).catch(e => String(e));
    row.crewHere = await fr.evaluate(() => { const BC = window.BohemiaCondition || (window.parent && window.parent.BohemiaCondition); return ((window.VAR && VAR.folk) || []).filter(p => p.crewMan).map(p => { let c = null; try { c = BC.condFor(p.name); } catch (e) {} return p.name + ':' + (c && c.blood != null ? Math.round(c.blood * 100) : '?') + (p.works ? '@' + p.works : ''); }); }).catch(e => String(e));
    /* each camera in turn (the footage's own cut), what it drew */
    for (let c = 0; c < 6; c++) {
      if (c) { await fr.evaluate(() => window.__HOME_FEED_AGE(99999)).catch(() => null); await P.waitForTimeout(3200); }
      await fr.evaluate(() => { window.__HOME_FEED_CARTS = {}; }).catch(() => null); await P.waitForTimeout(900);
      const cam = await fr.evaluate(() => { const I = window.BohemiaIdles, now = performance.now(), Z = window.__HOME_FEED_STAFF || {}, C = window.__HOME_FEED_CARTS || {};
        return { cam: Z.cam, forgeLot: Z.forge, drew: Object.keys(C).filter(k => C[k].cam === Z.cam).map(k => ((Z.ppl || []).find(o => o.id === k) || {}).name),
          staff: (Z.ppl || []).map(o => Object.assign({}, o, { cell: !!(o.act && I && I.activity && I.activity(o.look, 'probe', now, Math.max(0, I.DIRS.indexOf(o.face || 'S')), { act: o.act })) })),
          carts: Object.assign({}, C) }; }).catch(e => ({ err: String(e).slice(0, 200) }));
      cam.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_his_place_' + (c + 1) + '_cam' + (cam.cam || 0) + '.png'));
      await P.screenshot({ path: path.join(ROOT, cam.png) });
      row.cams.push(cam);
    }
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  const seen = {}, cartSeen = {};
  row.cams.forEach(c => (c.staff || []).forEach(s => { if ((c.drew || []).includes(s.name)) seen[s.id] = s; if (c.carts && c.carts[s.id] && c.carts[s.id].cam === c.cam) cartSeen[s.id] = c.carts[s.id]; }));
  const st = row.staff || [], by = id => st.find(s => s.id === id) || {}, last = row.cams[row.cams.length - 1] || {};
  row.pass = {
    F1: CAMP.every(id => seen[id] && cartSeen[id]),
    F2: by('blacksmith').act === 'repair' && row.cams.some(c => (c.staff || []).some(s => s.id === 'blacksmith' && c.forgeLot != null && s.n === c.forgeLot)) && by('cook').act === 'cook' && by('surgeon').act === 'tend' && !!by('surgeon').by,
    F3: ['cook', 'surgeon', 'blacksmith'].every(id => row.cams.some(c => (c.staff || []).some(s => s.id === id && s.cell))),
    P: !row.err && !errs.length };
  row.seen = Object.keys(seen); row.cartSeen = cartSeen;
  await d.close().catch(() => {});
  return row;
}

(async () => {
  const out = [];
  for (const s of SHAPES) { const r = await walk(s); out.push(r);
    console.log(TAG + ' ' + s + (r.err ? ' ERR ' + r.err : '') + ' | planted ' + JSON.stringify(r.planted) + ' | hurt ' + JSON.stringify(r.hurt) +
      '\n  crew here ' + JSON.stringify(r.crewHere) + ' workers ' + JSON.stringify(r.workers) + '\n  staff ' + JSON.stringify((r.staff || []).map(x => x.id + ':' + x.act + (x.by ? ' by ' + x.by : ''))) +
      r.cams.map(c => '\n  CAM ' + c.cam + (c.err ? ' ERR ' + c.err : '') + ' drew ' + JSON.stringify(c.drew) + ' staff ' + JSON.stringify((c.staff || []).map(s => s.id + '@' + s.n + ' ' + s.act + (s.cell ? '*' : '') + ' h' + s.h)) + ' carts ' + JSON.stringify(Object.keys(c.carts || {}).map(k => k + ':' + c.carts[k].kind + ' h' + c.carts[k].h + ' cam' + c.carts[k].cam))).join('') +
      '\n  ' + JSON.stringify(r.pass) + (r.errs.length ? '\n  errors ' + r.errs.join(' / ') : '')); }
  fs.writeFileSync(path.join(OUTD, 'place_' + TAG + '.json'), JSON.stringify(out, null, 1));
  process.exit(out.every(r => Object.values(r.pass).every(Boolean)) ? 0 : 1);
})();
