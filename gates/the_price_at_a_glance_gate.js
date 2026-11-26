#!/usr/bin/env node
/* THE PRICE AT A GLANCE (ECONOMY THREE 11/26, VAMILY rule 482: 'make it read clearer and look better: the price, what he has, what
   it buys, at a glance, upright and sideways, no clutter'; rule 441 on the real glass). records/BOHEMIA_ECONOMY_THREE_THE_PRICE_AT_A_GLANCE_11_26_26.md.
   MEASURED before (the demo, a new crew at Caravans, 290 batteries): the smith's shelf drew the 388 shotgun's price the same as the
   44 knife's; the strip's 'Buy it and wear it' was cut to 'Buy it and w...' upright and 'to the stash' said no price; the stall faded a
   buy he could not pay to a ghost; 'SELL 2' and 'SELL 12' read like prices beside '+1'; the trade good's line hung a dot at a line's end.
   LEGS, on the demo or the alpha, the phone upright or on its side, real fingers on the doors:
     G1 the smith's shelf: every price over his purse is red, every price he can pay is not
     G2 the strip, the dearest piece picked: both buys say its price, red because it is more than he holds; no label is cut (its
        words whole inside the button, a second line before a cut)
     G3 the stall with a thin purse (10 left, planted): every BUY over it is red and still readable (not a ghost); every BUY he can
        pay is not red
     G4 every SELL that takes more than one says how many in the good's own picture and the count, on one line, inside its box
     G5 the trade good's row: what is made here and what he has each on its own line, no line ending in a dot
     G6 no page error
     M  the bite: the shelf's red planted away turns G1's check red
   node gates/the_price_at_a_glance_gate.js [demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const MODE = process.argv[2] || 'demo', SHAPE = process.argv[3] || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const red = c => { const m = /rgba?\((\d+), (\d+), (\d+)/.exec(c || ''); return !!m && +m[1] > 150 && +m[1] > 2 * +m[2] && +m[1] > 2 * +m[3]; };
(async () => {
  const d = await D.open({ profile: SHAPE, alpha: MODE === 'alpha', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const T = MODE + ' ' + SHAPE;
  try {
    await fr.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
    await page.waitForTimeout(4000);
    const tn = 'Caravans';
    await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await page.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate((n) => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn).catch(() => false)) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(2000);
    const tapXY = async (xy) => { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height)); };
    const openBy = async (k) => { for (let t = 0; t < 4; t++) { const xy = await sf.evaluate((q) => BohemiaSettlement.where(q), k); if (xy) await tapXY(xy); await page.waitForTimeout(2500); if (await sf.evaluate((q) => BohemiaSettlement.state.open === q, k)) return true; } return false; };
    const shut = () => sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }).then(() => page.waitForTimeout(900));
    /* the smith */
    const shopK = await sf.evaluate(() => ['smith', 'armourer', 'arms'].filter(k => BohemiaSettlement.where(k))[0] || null);
    const opened = shopK && await openBy(shopK);
    const shelf = await sf.evaluate(() => { const have = BohemiaSettlement.bats(); return { have, tiles: [...document.querySelectorAll('#shelfgrid .slot.full')].filter(t => !t.classList.contains('yours')).map(t => { const e = t.querySelector('em.money'); return { p: +(e && e.textContent || 0), red: getComputedStyle(e).color, dear: t.classList.contains('dear') }; }) }; });
    const wrong = shelf.tiles.filter(t => (t.p > shelf.have) !== red(t.red));
    ok('G1 ' + T + ': the ' + shopK + '\'s shelf, ' + shelf.have + ' in the purse: ' + shelf.tiles.filter(t => red(t.red)).map(t => t.p).join(', ') + ' red, ' + shelf.tiles.filter(t => !red(t.red)).map(t => t.p).join(', ') + ' not',
      opened && shelf.tiles.length >= 3 && shelf.tiles.some(t => t.p > shelf.have) && wrong.length === 0, wrong.map(t => t.p).join(', '));
    /* the bite: the shelf's red planted away, G1's own check reads it */
    const bite = await sf.evaluate(() => { const st = document.createElement('style'); st.id = 'glance_plant'; st.textContent = '#sheet .slot.dear>em.money{color:inherit!important}'; document.head.appendChild(st);
      const have = BohemiaSettlement.bats(), t = [...document.querySelectorAll('#shelfgrid .slot.full')].filter(x => !x.classList.contains('yours')).map(x => { const e = x.querySelector('em.money'); return { p: +(e && e.textContent || 0), c: getComputedStyle(e).color }; }); st.remove(); return { have, t }; });
    ok('M ' + T + ': PLANTED, the shelf\'s red taken away: G1\'s check reads red', bite.t.some(t => t.p > bite.have && !red(t.c)));
    await sf.evaluate(() => { const t = [...document.querySelectorAll('#shelfgrid .slot.full')].filter(x => x.classList.contains('dear'))[0]; if (t) t.click(); });
    await page.waitForTimeout(1500);
    const strip = await sf.evaluate(() => [...document.querySelectorAll('#shopstrip .ss-acts>.act')].filter(b => !b.dataset.dim).map(b => { const s = b.querySelector('span'), e = b.querySelector('em'), r = b.getBoundingClientRect(), sr = s.getBoundingClientRect();
      return { id: b.id, words: s.textContent, price: e ? e.textContent : '', red: e ? getComputedStyle(e).color : '', cut: s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1 || sr.bottom > r.bottom + 1 || sr.right > r.right + 1 }; }));
    ok('G2 ' + T + ': the dearest picked: ' + strip.map(b => '"' + b.words + '" ' + b.price).join(' | ') + ', red, nothing cut',
      strip.length === 2 && strip.every(b => /\d/.test(b.price) && red(b.red) && !b.cut) && strip.some(b => /^Buy it/.test(b.words)) && strip.some(b => /to the stash/.test(b.words)), JSON.stringify(strip));
    await shut();
    /* the stall, a thin purse */
    await sf.evaluate(() => { const S = BohemiaSettlement.state, n = BohemiaSettlement.bats(); if (n > 10) BohemiaPurse.debit(S.purse, 'electricity', n - 10, 'the gate: a thin purse', 'gate', 0); });
    const stall = await openBy('stall');
    const st = await sf.evaluate(() => { const have = BohemiaSettlement.bats();
      const buys = [...document.querySelectorAll('#sbody .stline .sb.buy, #sbody .tgline .sb.buy')].filter(b => !b.classList.contains('back') && b.dataset.p !== '').map(b => ({ p: +b.dataset.p, red: getComputedStyle(b.querySelector('.sp')).color, op: +getComputedStyle(b).opacity }));
      const sells = [...document.querySelectorAll('#sbody .stline .sb.sell')].map(b => { const c = b.querySelector('small'), r = b.getBoundingClientRect(), cr = c.getBoundingClientRect(); return { cap: c.textContent, pic: !!c.querySelector('img.sbg'), lines: Math.round(cr.height / parseFloat(getComputedStyle(c).lineHeight || 11)), inside: cr.left >= r.left - 1 && cr.right <= r.right + 1 && cr.top >= r.top - 1 }; });
      const tg = [...document.querySelectorAll('#sbody .tgline .stl small')].map(e => e.textContent);
      return { have, buys, sells, tg }; });
    const wrongB = st.buys.filter(b => (b.p > st.have) !== red(b.red) || (b.p > st.have && b.op < 0.8));
    ok('G3 ' + T + ': the stall with ' + st.have + ' left: BUY ' + st.buys.filter(b => red(b.red)).map(b => b.p).join(', ') + ' red and readable, ' + st.buys.filter(b => !red(b.red)).map(b => b.p).join(', ') + ' not',
      stall && st.have === 10 && st.buys.some(b => b.p > st.have) && st.buys.some(b => b.p <= st.have) && wrongB.length === 0, JSON.stringify(wrongB));
    const many = st.sells.filter(s => /\d/.test(s.cap)), badS = many.filter(s => !s.pic || !s.inside || s.lines > 1);
    ok('G4 ' + T + ': every SELL of more than one (' + many.map(s => s.cap).join(', ') + ') says it in the good\'s own picture, one line, inside its box', many.length >= 1 && badS.length === 0, JSON.stringify(badS));
    ok('G5 ' + T + ': the trade good\'s row: ' + st.tg.map(t => '"' + t + '"').join(' / ') + ', no line ends in a dot',
      st.tg.length === 0 || (st.tg.some(t => /MADE HERE/.test(t)) && st.tg.some(t => /^YOU HAVE \d+$/.test(t)) && st.tg.every(t => !/·\s*$/.test(t))));
    await shut();
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
  ok('G6 ' + T + ': no page error', e2.length === 0, e2.slice(0, 2).join(' | '));
  await d.close().catch(() => {});
  console.log('=== THE PRICE AT A GLANCE (' + T + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
