#!/usr/bin/env node
/* THE SIX ON THE BAR (UI [the PC playtest: the UI's part] (2), rule 164 item 2, Paolo 10/24 on his PC: 'we have four different
   currencies in this game, you're only showing batteries, it's insane'). ECONOMY's six, left to right BATTERIES, FOOD, WATER,
   TAPE, MEDS, ROUNDS (records/BOHEMIA_ECONOMY_DAY_80_HOW_MANY_CURRENCIES_HIS_FOUR_ARE_BATTLE_BROTHERS_FOUR_AND_THE_GAME_COUNTS_ONE_
   10_25_26.md section 3), each his pack's own prop (set A of ui-the-six-at-pack-pixels-10-13, his UP 10/17) and a number; a
   supply stands on the glass only when the game counts it, never a dash, never an invented number. Legs, on the demo:
   S1  the six icons are his pack tiles, byte for byte (slices/supply_icons/ against reference/art_bank/prop);
   S2  today the game counts the batteries: the glass carries the batteries and no dash, the batteries wear the pack's cells;
   S3  a count handed by the map (window.BOH_SUPPLIES, the one door the purse or the map fills) stands at once, in ECONOMY's order,
       each with its own pack prop, on the phone and on the computer, fitting the glass;
   S4  low reads red: water for under three days of the crew the bill feeds; enough food is not red;
   S5  a hold (a mouse over the glass) shows the nights after the batteries and the days food and water last; letting go hides them;
   S6  what is not a number never stands (a string, NaN, a missing key);
   S7  the page threw nothing.
   Run: node gates/the_six_on_the_bar_gate.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const SIX = ['batteries', 'food', 'water', 'tape', 'meds', 'rounds'];
const SRC = { batteries: 'pack_11_survival_props_045', food: 'pack_11_survival_props_042', water: 'pack_11_survival_props_004', tape: 'pack_11_survival_props_039', meds: 'pack_12_weapons_and_supplies_030', rounds: 'pack_12_weapons_and_supplies_018' };

(async () => {
  const same = SIX.filter(k => { try { return fs.readFileSync(path.join(ROOT, 'slices/supply_icons', k + '.png')).equals(fs.readFileSync(path.join(ROOT, 'reference/art_bank/prop', SRC[k] + '.png'))); } catch (_e) { return false; } });
  leg(same.length === 6, 'S1  THE SIX ICONS ARE HIS PACK TILES, BYTE FOR BYTE', same.length + ' of 6');
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  for (const prof of ['phone_portrait', 'computer']) {
    const d = await open({ profile: prof });
    const p = d.page, fr = d.fr;
    await p.waitForTimeout(2000); try { await d.clearCards(); } catch (_e) {}
    const read = () => fr.evaluate(() => { const g = document.querySelector('#bmtb [data-tb=g]'), gr = g.getBoundingClientRect();
      return [...g.querySelectorAll('.s')].filter(e => e.offsetWidth > 0).map(e => { const r = e.getBoundingClientRect(), im = e.querySelector('img'), b = e.querySelector('b'), i = e.querySelector('i');
        return { f: e.dataset.f, n: b ? b.textContent.trim() : '', low: !!(b && b.classList.contains('low')), src: im ? im.getAttribute('src') : '', icon: im ? Math.round(im.getBoundingClientRect().height) : 0,
          inside: r.left >= gr.left - 1 && r.right <= gr.right + 1, i: i && i.offsetWidth > 0 ? i.textContent.trim() : '' }; }); });
    let r0 = await read();
    if (prof === 'phone_portrait') leg(r0.map(x => x.f).join(' ') === 'batteries' && !r0.some(x => /^[–-]$/.test(x.n)) && /supply_icons\/batteries\.png$/.test(r0[0].src) && /^\d+$/.test(r0[0].n),
      'S2  TODAY THE GAME COUNTS THE BATTERIES: THE GLASS CARRIES THEM, NO DASH, THE PACK\'S CELLS', JSON.stringify(r0.map(x => x.f + ':' + x.n)));
    const crew = await fr.evaluate(() => (window.__BILL && __BILL.crew) | 0);
    await fr.evaluate(() => { window.BOH_SUPPLIES = { food: 30, water: 2, tape: 3, meds: 1, rounds: 40 }; });
    await p.waitForTimeout(900);
    const r1 = await read();
    leg(r1.map(x => x.f).join(' ') === SIX.join(' ') && r1.every(x => /supply_icons\/(\w+)\.png$/.test(x.src) && x.src.indexOf(x.f + '.png') >= 0 && x.icon >= 24) && r1.every(x => x.inside),
      'S3  ' + prof.toUpperCase() + ': THE SIX STAND AT ONCE, IN ECONOMY\'S ORDER, EACH ITS OWN PROP, INSIDE THE GLASS', r1.map(x => x.f + ':' + x.n + '@' + x.icon + (x.inside ? '' : ' OUT')).join(' '));
    const w = r1.find(x => x.f === 'water'), fd = r1.find(x => x.f === 'food');
    if (prof === 'phone_portrait') leg(w && w.low && fd && !fd.low && crew > 0, 'S4  LOW READS RED: 2 WATER FOR A CREW OF ' + crew + ' IS RED, 30 FOOD IS NOT', 'water low ' + (w && w.low) + ', food low ' + (fd && fd.low));
    if (prof === 'computer') {
      const gb = await fr.evaluate(() => { const r = document.querySelector('#bmtb [data-tb=g]').getBoundingClientRect(); return { x: r.x + r.width - 20, y: r.y + r.height / 2 }; });
      const fb = await p.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return { x: r.x, y: r.y }; });
      await p.mouse.move(fb.x + gb.x, fb.y + gb.y); await p.waitForTimeout(700);
      const h = await read();
      await p.mouse.move(5, 880); await p.waitForTimeout(700);
      const h2 = await read();
      const nights = h.find(x => x.f === 'nights'), hf = h.find(x => x.f === 'food'), hw = h.find(x => x.f === 'water');
      leg(nights && hf && /^\d+ DAYS?$/.test(hf.i) && hw && /^\d+ DAYS?$/.test(hw.i) && h.map(x => x.f).indexOf('nights') === 1 && !h2.find(x => x.f === 'nights') && !(h2.find(x => x.f === 'food') || {}).i,
        'S5  A HOLD SHOWS THE NIGHTS AFTER THE BATTERIES AND THE DAYS FOOD AND WATER LAST; LET GO, THEY GO', 'held: ' + h.map(x => x.f + (x.i ? '(' + x.i + ')' : '')).join(' ') + ' | let go: ' + h2.map(x => x.f + (x.i ? '(' + x.i + ')' : '')).join(' '));
      await fr.evaluate(() => { window.BOH_SUPPLIES = { food: 'lots', water: NaN, meds: 2 }; });
      await p.waitForTimeout(900);
      const r6 = await read();
      leg(r6.map(x => x.f).join(' ') === 'batteries meds', 'S6  WHAT IS NOT A NUMBER NEVER STANDS (A STRING, NaN, A MISSING KEY)', r6.map(x => x.f + ':' + x.n).join(' '));
    }
    errs.push(...d.errs.filter(e => !/ResizeObserver/.test(e)));
    await d.close();
  }
  leg(errs.length === 0, 'S7  THE PAGE THREW NOTHING', errs.slice(0, 3).join(' | ') || 'none');
  console.log('=== THE SIX ON THE BAR GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
