#!/usr/bin/env node
// STAFF 2 [at work] 11/27 -- VAMILY rule 482 on the staff as built, the coordinator's next: "their work at camp and at his place
// shows (the cook cooking, the medic healing), the cart reads from every camera". The page he plays, his phone upright and on its side:
// the camp book holds the cook, the surgeon, the blacksmith and the cab driver (their carts as the book keeps them); two of his men are
// struck down by the condition book's own afterFight (the shortcut, said: a fight that hurts them is the cart proof's walk); off the town
// he makes camp (the map's own MAKE CAMP), and the camp's own frame is read for what each camp person draws (BohemiaCampLook.state()
// drawnBy: 'anim:cook' is ANIMATION's cook act on her body) and where the one who heals kneels against the man he heals.
//   W1 the cook cooks (her body's cook act drawn), W2 the surgeon tends a man lying hurt (his tend act, beside that man, facing him),
//   W3 the blacksmith mends (his repair act), W4 every camp person's cart drawn beside him, P no page error.
//   node tools/bohemia_staff_at_work_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
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
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__workProof) { c.retinue = " + JSON.stringify(CAMP) + "; c.carts = { surgeon: 1, blacksmith: 2 }; c.__workProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } } catch (e) {}";
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm });
  const page = d.page, errs = [], row = { shape, surface: TAG };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const short = shape === 'phone_portrait' ? 'upright' : 'sideways';
  try {
    await page.waitForTimeout(2500);
    await page.evaluate(() => { window.__PLAY_BEGAN = true; });
    /* two of his men struck down (the condition book's own afterFight, a fight's rows), so the camp has men lying hurt */
    /* his men's names: the door's own company (BOH_START.picks().company, the men the fight and the camp deal) */
    const names = await page.evaluate(() => { try { return (BOH_START.picks().company || []).map(m => m && m.name).filter(Boolean); } catch (e) { return []; } });
    row.hurt = await d.fr.evaluate((names) => { const C = window.BohemiaCondition; if (!C || !C.afterFight) return 'no condition book';
      const L = names.filter(n => !/^YOU$/i.test(n)).slice(1, 3); if (!L.length) return 'no men: ' + JSON.stringify(names);
      C.afterFight(L.map(n => ({ name: n, hp: 2, hpMax: 60, down: true })), { day: 1 });
      return L; }, names).catch(e => String(e));
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} });
    await d.fr.evaluate(drive.offTheTown).catch(() => null);
    row.campMade = await d.fr.evaluate(() => { try { CITY_CONTACT_POSTED = true; return !!BohemiaMapCamp.make(); } catch (e) { return String(e); } });
    let cf = null; for (let k = 0; k < 120 && !cf; k++) { for (const x of page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
        if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) cf = x;
      if (!cf) await page.waitForTimeout(300); }
    if (!cf) throw new Error('no camp frame');
    /* the camp's own read, a few times while its sheets come in */
    for (let k = 0; k < 24; k++) { await page.waitForTimeout(500);
      row.camp = await cf.evaluate(() => { const L = window.BohemiaCampLook, st = L && L.state ? L.state() : null; if (!st) return null;
        const folk = (L.folk ? L.folk() : []) || [], C = window.__CAMP_CARTS || {}, now = performance.now();
        return { drawnBy: st.drawnBy || {}, acts: (st.acts || []).map(a => a.name + ':' + a.act),
          followers: folk.filter(m => m.campFollower).map(m => ({ id: m.follower, name: m.name, act: m.act, x: m.x, y: m.y, face: m.face })),
          lying: folk.filter(m => m.campMan && (m.act === 'lie' || m.act === 'rest')).map(m => ({ name: m.name, act: m.act, x: m.x, y: m.y })),
          carts: Object.keys(C).map(k => ({ id: k, kind: C[k].kind, ago: Math.round(now - C[k].at) })) }; }).catch(() => null);
      const db = row.camp && row.camp.drawnBy || {}, F = row.camp && row.camp.followers || [];
      if (F.length && F.every(f => /^anim:/.test(db[f.name] || '') || f.act === 'watch')) break; }
    await page.waitForTimeout(800);
    row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_the_camp_at_work.png'));
    await page.screenshot({ path: path.join(ROOT, row.png) });
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  const c = row.camp || {}, db = c.drawnBy || {}, F = c.followers || [], by = id => (F.find(f => f.id === id) || {}), drew = id => db[by(id).name] || null;
  const sg = by('surgeon'), healed = (c.lying || []).find(l => sg.x !== undefined && Math.abs(l.x - sg.x) < 90 && Math.abs(l.y - sg.y) < 60);
  row.pass = { W1: drew('cook') === 'anim:cook', W2: drew('surgeon') === 'anim:tend' && !!healed, W3: drew('blacksmith') === 'anim:repair',
    W4: CAMP.every(id => (c.carts || []).some(k => k.id === id && k.ago < 3000)), P: !row.err && !errs.length };
  row.healed = healed ? healed.name : null;
  await d.close().catch(() => {});
  return row;
}

(async () => {
  const out = [];
  for (const s of SHAPES) { const r = await walk(s); out.push(r);
    console.log(TAG + ' ' + s + (r.err ? ' ERR ' + r.err : '') + ' | hurt ' + JSON.stringify(r.hurt) + ' | camp ' + JSON.stringify(r.campMade) +
      '\n  followers ' + JSON.stringify((r.camp && r.camp.followers || []).map(f => f.id + ':' + f.act + ':' + ((r.camp.drawnBy || {})[f.name] || '-') + '@' + Math.round(f.x) + ',' + Math.round(f.y) + ' ' + f.face)) +
      '\n  lying ' + JSON.stringify(r.camp && r.camp.lying) + ' | healed ' + r.healed + ' | carts ' + JSON.stringify((r.camp && r.camp.carts || []).map(k => k.id + ':' + k.kind)) +
      '\n  ' + JSON.stringify(r.pass) + (r.errs.length ? '\n  errors ' + r.errs.join(' / ') : '')); }
  fs.writeFileSync(path.join(OUTD, 'work_' + TAG + '.json'), JSON.stringify(out, null, 1));
  process.exit(out.every(r => Object.values(r.pass).every(Boolean)) ? 0 : 1);
})();
