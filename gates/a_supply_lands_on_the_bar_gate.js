#!/usr/bin/env node
/* A SUPPLY LANDS ON THE BAR (ECONOMY THREE 11/26, VAMILY rule 482: 'the next money moment he meets, better... a fight's spoils
   counted on the bar'; rule 441). MEASURED before: a road fight won and LOOT ALL, the batteries climbed on the beat lit amber (THE
   COUNT) but the tape went 40 to 41 with nothing to say it moved. NOW (slices/bohemia_ui_materials.js __A_SUPPLY_LANDS_ON_THE_BAR__)
   a supply's figure that moves lights two beats on the batteries' own plate, laid around the number so the bar keeps its size.
   LEGS, the demo or the alpha, the phone upright or on its side:
     B1 before he takes anything, no supply on the bar is lit (the first count a page draws is not a moment)
     B2 LOOT ALL: the tape's figure on the bar he sees goes up by what the fight left and lights up inside one second
     B3 the light is gone within three seconds, the number stays
     B4 the bar does not change size while it is lit (its row, to the pixel)
     B5 the batteries still climb on the beat (lit while they count) to what the purse holds (a fight that left none: nothing moves)
     B6 no page error
   node gates/a_supply_lands_on_the_bar_gate.js [demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const MODE = process.argv[2] || 'demo', SHAPE = process.argv[3] || 'phone_portrait', T = MODE + ' ' + SHAPE;
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
(async () => {
  const d = await D.open({ profile: SHAPE, alpha: MODE === 'alpha', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    await d.fr.waitForFunction(() => window.LOOP && LOOP.start, null, { timeout: 300000 }); await P.waitForTimeout(4000);
    const f = await D.roadFightOffTheTown(d, { id: 'toll_crew', name: 'the toll crew', seq: 459 });
    if (!f) throw new Error('no road fight');
    await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
    const SF = () => P.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await P.waitForTimeout(200);
    const sf = SF(); if (!sf) throw new Error('no spoils');
    await P.waitForTimeout(2500);
    const read = () => sf.evaluate(() => { const g = document.querySelector('#bmtb .g'), t = document.querySelector('#bmtb .s.six[data-f=tape]'), b = document.querySelector('#bmtb .s.bats'), r = g ? g.getBoundingClientRect() : null;
      return { lit: [...document.querySelectorAll('#bmtb .s.six.up, #bmtb .s.six.down')].filter(x => !x.classList.contains('bats')).map(x => x.dataset.f), tape: t ? +t.querySelector('b').textContent : null, tapeCls: t ? t.className : '',
        tapeBg: t ? getComputedStyle(t.querySelector('b')).backgroundColor : '', bats: b ? +b.querySelector('b').textContent : null, counting: !!(b && b.classList.contains('counting')), row: r ? [Math.round(r.width), Math.round(r.height)] : null }; });
    const before = await read(), left = await sf.evaluate(() => (BohemiaSpoilsScreen.state.counts || {}).tape | 0), cells = await sf.evaluate(() => (BohemiaSpoilsScreen.state.counts || {}).batteries | 0);
    ok('B1 ' + T + ': before he takes anything no supply on the bar is lit (' + (before.lit.join(', ') || 'none') + ')', before.lit.length === 0 && before.tape != null);
    await sf.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /LOOT ALL/.test(x.textContent)); if (b) b.click(); });
    const seen = []; const t0 = Date.now(); let litAt = null, sawCount = false;
    while (Date.now() - t0 < 3200) { const r = await read(); seen.push(r); if (r.counting) sawCount = true; if (litAt == null && /\bup\b/.test(r.tapeCls)) litAt = Date.now() - t0; await P.waitForTimeout(120); }
    const end = seen[seen.length - 1], purse = await d.fr.evaluate(() => loopBats());
    ok('B2 ' + T + ': LOOT ALL, the tape ' + before.tape + ' -> ' + end.tape + ' (the fight left ' + left + '), lit amber after ' + litAt + ' ms', left > 0 && end.tape === before.tape + left && litAt != null && litAt <= 1000 && seen.some(r => /\bup\b/.test(r.tapeCls) && /\(2(2[0-9]|3[0-9]), 1[6-9][0-9]/.test(r.tapeBg)), JSON.stringify(seen.filter(r => /\bup\b/.test(r.tapeCls))[0] || null));
    ok('B3 ' + T + ': the light is gone by three seconds, the number stays (' + end.tape + ', ' + (end.tapeCls || '') + ')', !/\b(up|down)\b/.test(end.tapeCls) && end.lit.length === 0);
    const rows = seen.map(r => String(r.row));
    ok('B4 ' + T + ': the bar\'s row the same size while it is lit (' + [...new Set(rows.concat([String(before.row)]))].join(' / ') + ')', new Set(rows.concat([String(before.row)])).size === 1);
    ok('B5 ' + T + ': the batteries still climb on the beat (' + cells + ' left by the fight: ' + before.bats + ' -> ' + end.bats + ', the purse ' + purse + ')', end.bats === purse && (cells > 0 ? sawCount && purse > before.bats : purse === before.bats));
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
  ok('B6 ' + T + ': no page error', e2.length === 0, e2.slice(0, 2).join(' | '));
  await d.close().catch(() => {});
  console.log('=== A SUPPLY LANDS ON THE BAR (' + T + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
