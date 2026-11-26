#!/usr/bin/env node
// STAFF 2 [hire reads] 11/26 -- VAMILY rule 480(b) on the staff as built (rules 468, 471): HIRING AND REHIRING IN TOWNS WORKS AND READS.
// The page he plays, his phone upright and on its side: the town he starts beside opened the way a tap on it opens it, its hall's sheet opened
// as a tap on the hall opens it, and every camp person the hall offers opened with a real tap on his name. Each opened row must say the cart
// he will push (a rehire: the cart his job kept when his side held the field; the book here keeps the cab driver's steel utility cart and the
// cook's wagon) and one hand only; then a TAKE ON is tapped for real and the camp book must hold him, with his cart.
//   node tools/bohemia_staff_hire_reads.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const ALPHA = A.includes('--alpha'), CODE = arg('--code', 'K7QM9X'), SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(',');
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_cart')), TAG = ALPHA ? 'alpha' : 'demo';
const KEPT = { scout: 1, cook: 2 };   // the jobs whose carts stayed when they fell on a field his side held
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__hireProof) { c.retinue = []; c.carts = " + JSON.stringify(KEPT) + "; c.dead = [{ id: 'cook', name: 'Graciela Ochoa', look: 'person_woman_0', why: 'dead', n: 0 }]; c.lost = { cook: 1 }; c.__hireProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c));" +
    " localStorage.setItem('bohemia.renown.v1', JSON.stringify({ score: 800, keys: [], log: [] })); } } catch (e) {}";   // a name two can follow (the hall's own rule: no name, nobody follows)
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm });
  const page = d.page, errs = [], row = { shape, surface: TAG };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const tap = async (loc) => { const b = await loc.boundingBox(); if (!b) return false; const x = b.x + Math.min(b.width / 2, 40), y = b.y + b.height / 2;
    if (shape === 'phone_portrait') await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); return true; };
  try {
    await page.waitForTimeout(2500);
    await d.fr.evaluate(() => { try { const t = startTownPick(); if (t) loopOpenTown({ name: t.name, x: t.x, y: t.y, tier: t.tier }); } catch (e) {} });
    let tf = null; for (let k = 0; k < 60 && !tf; k++) { for (const x of page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
        if (await x.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) tf = x;
      if (!tf) await page.waitForTimeout(300); }
    if (!tf) throw new Error('no town screen');
    /* the purse the door seeds (the origin's batteries) is read before the hall: a town opened in the first seconds can stand before it lands */
    row.purseAt = []; for (let k = 0; k < 40; k++) { const b = await tf.evaluate(() => BohemiaSettlement._bats()).catch(() => -1); row.purseAt.push(b); if (b > 0) break; await page.waitForTimeout(500); }
    row.hall = await tf.evaluate(() => BohemiaSettlement._hall());
    await page.waitForTimeout(1600);
    const ids = await tf.evaluate(() => [].map.call(document.querySelectorAll('#sbody .retf'), r => r.dataset.id));
    row.offered = ids; row.rows = [];
    const dbg = () => tf.evaluate(() => ({ tight: document.getElementById('sheet').className, rows: [].map.call(document.querySelectorAll('#sbody .retf'), r => ({ id: r.dataset.id, cls: r.className, cl: r.dataset.cartLine || null, tip: r.dataset.tip || null,
      more: getComputedStyle(r.querySelector('.rmore')).display, rc: !!r.querySelector('.rcart') })) }));
    if (process.env.HIRE_DEBUG) console.log('before', JSON.stringify(await dbg()));
    for (const id of ids) {
      const nm = tf.locator('#sbody .retf[data-id="' + id + '"] .rname').first();
      await tf.evaluate((id) => { const e = document.querySelector('#sbody .retf[data-id="' + id + '"] .rname'); if (e) e.scrollIntoView({ block: 'center' }); }, id).catch(() => {});   /* the middle of the sheet: the line he hears stands over its bottom edge */
      await page.waitForTimeout(250);
      let ok = await tap(nm);
      await page.waitForTimeout(1200);
      if (!(await tf.evaluate((id) => { const r = document.querySelector('#sbody .retf[data-id="' + id + '"]'); return !!(r && r.classList.contains('open')); }, id))) { ok = await tap(nm) && 'again'; await page.waitForTimeout(1200); }   /* the sheet still sliding in takes the first tap */   /* an opened row can tip the sheet past the glass: the fit settles (UI FOUR's tight step) before it is read */
      if (process.env.HIRE_DEBUG) console.log('after ' + id, JSON.stringify(await dbg()));
      row.rows.push(await tf.evaluate((id) => { const r = document.querySelector('#sbody .retf[data-id="' + id + '"]'); if (!r) return { id, gone: true };
        const c = r.querySelector('.rcart'), k = r.querySelector('.rcost:not(.rcart)'), cb = c && c.getBoundingClientRect(), bt = r.querySelector('.act');
        const seen = !!(cb && cb.width > 0 && cb.height > 0), tip = r.dataset.tip || '';
        return { id, mark: (r.querySelector('.rname span') || {}).textContent || '', name: (r.querySelector('.rname b') || {}).textContent || '', open: r.classList.contains('open'), soon: !!(bt && /not yet/i.test(bt.textContent)), cart: seen ? c.textContent : (tip.match(/Pushes .*$/) || [null])[0], by: seen ? 'his opened row' : tip ? 'the held finger' : 'nothing',
          cartId: r.dataset.cartId || null, take: k ? k.textContent : null, seen, kept: BohemiaCamp.cartOf(id).id }; }, id).then(x => Object.assign(x, { tapped: ok })));
    }
    row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_the_hall_says_the_cart.png'));
    /* THE HELD FINGER (H5): where his opened row is shut (the fullest hall) a finger held on a camp person shows his words and his cart; held
       for real (a touch held on the upright glass, the mouse resting on it on its side), the bubble read off the glass and the picture taken while it stands */
    const hid = ids.filter(i => KEPT[i])[0] || ids[0];
    if (hid) {
      await tf.evaluate((id) => { const e = document.querySelector('#sbody .retf[data-id="' + id + '"] .rname'); if (e) e.scrollIntoView({ block: 'center' }); }, hid).catch(() => {});
      await page.waitForTimeout(500);
      const bb = await tf.locator('#sbody .retf[data-id="' + hid + '"] .rname').first().boundingBox(), x = bb && bb.x + Math.min(bb.width / 2, 40), y = bb && bb.y + bb.height / 2;
      let cdp = null;
      if (bb && shape === 'phone_portrait') { cdp = await page.context().newCDPSession(page); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await page.waitForTimeout(1100); }
      else if (bb) { await page.mouse.move(x - 6, y); await page.mouse.move(x, y, { steps: 3 }); await page.waitForTimeout(1300); }
      row.held = { id: hid, tip: null };
      for (const fr of page.frames()) { const t = await fr.evaluate(() => { const e = document.getElementById('bptip'); return e ? e.textContent : null; }).catch(() => null); if (t) row.held.tip = t; }
      await page.screenshot({ path: path.join(ROOT, row.png) });
      if (cdp) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(300); }
      else if (bb) { await page.mouse.move(5, 5); await page.waitForTimeout(300); }
    } else await page.screenshot({ path: path.join(ROOT, row.png) });
    /* TAKE ON, tapped for real, on the first one the purse can pay */
    const pick = await tf.evaluate(() => { const b = BohemiaSettlement._bats(); const ok = [].filter.call(document.querySelectorAll('#sbody .retf'), r => { const x = r.querySelector('.act'); return x && !x.disabled && +x.dataset.price <= b; });
      const r = ok.filter(r => BohemiaCamp.cartLevel(r.dataset.id) > 0)[0] || ok[0]; return r ? r.dataset.id : null; });   /* a rehire first: the job whose cart was kept */
    row.take = { id: pick, purse: await tf.evaluate(() => BohemiaSettlement._bats()), shut: await tf.evaluate(() => [].map.call(document.querySelectorAll('#sbody .retf .act'), x => x.parentNode.dataset.id + ':' + x.dataset.price + (x.disabled ? ':shut' : ''))) };
    if (pick) {
      const bt = tf.locator('#sbody .retf[data-id="' + pick + '"] .act').first(); await tf.evaluate((id) => { const e = document.querySelector('#sbody .retf[data-id="' + id + '"] .act'); if (e) e.scrollIntoView({ block: 'center' }); }, pick).catch(() => {}); await page.waitForTimeout(250);
      row.take.tapped = await tap(bt); await page.waitForTimeout(700);
      row.take.after = await tf.evaluate((id) => ({ hired: BohemiaCamp.retinue().indexOf(id) >= 0, cart: BohemiaCamp.cartOf(id).id, weapon: BohemiaCamp.armsOf(id) }), pick);
    }
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  const R = row.rows || [];
  row.pass = { H1: !!(row.hall && R.length), H2: R.filter(r => !r.soon).length > 0 && R.filter(r => !r.soon).every(r => r.by !== 'nothing' && /^Pushes a .+\. One hand only\.$/.test(r.cart || '') && r.cartId === r.kept),
    H3: R.filter(r => KEPT[r.id]).every(r => r.cartId !== 'shopping_cart'), H4: !!(row.take && row.take.after && row.take.after.hired && row.take.after.cart === (KEPT[row.take.id] === 2 ? 'wagon' : KEPT[row.take.id] === 1 ? 'utility_cart' : 'shopping_cart')),
    H6: R.filter(r => r.id === 'cook').every(r => /YOUR LAST ONE FELL/.test(r.mark) && !/GRACIELA/.test(r.name)) && R.filter(r => r.id !== 'cook').every(r => !/YOUR LAST ONE FELL/.test(r.mark)),   /* STAFF 2 (rule 482): the trade that lost one says so, and it is someone new */
    H5: !!(row.held && /Pushes a .+\. One hand only\./.test(row.held.tip || '')), E: !errs.length };
  await d.close().catch(() => {});
  return row;
}

(async () => {
  const out = [];
  for (const s of SHAPES) { const r = await walk(s); out.push(r);
    console.log(TAG + ' ' + s + (r.err ? ' ERR ' + r.err : '') + ' | offered ' + JSON.stringify(r.offered) + '\n  ' + (r.rows || []).map(x => x.id + ' ' + x.name + ' [' + x.mark + ']: "' + x.cart + '" (' + (x.soon ? 'his work waits' : x.by) + ')').join('\n  ') +
      '\n  held on ' + JSON.stringify(r.held) + '\n  take ' + JSON.stringify(r.take) + '\n  ' + JSON.stringify(r.pass) + (r.errs.length ? '\n  errors ' + r.errs.join(' / ') : '')); }
  fs.writeFileSync(path.join(OUTD, 'hire_' + TAG + '.json'), JSON.stringify(out, null, 1));
  process.exit(out.every(r => Object.values(r.pass).every(Boolean)) ? 0 : 1);
})();
