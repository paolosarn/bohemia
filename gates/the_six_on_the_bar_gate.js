#!/usr/bin/env node
/* THE SIX ON THE BAR (UI [the PC playtest: the UI's part] (2), rule 164 item 2, Paolo 10/24 on his PC: 'we have four different
   currencies in this game, you're only showing batteries, it's insane'). ECONOMY's six, left to right BATTERIES, FOOD, WATER,
   TAPE, MEDS, ROUNDS (records/BOHEMIA_ECONOMY_DAY_80_HOW_MANY_CURRENCIES_HIS_FOUR_ARE_BATTLE_BROTHERS_FOUR_AND_THE_GAME_COUNTS_ONE_
   10_25_26.md section 3), each his pack's own prop (set A of ui-the-six-at-pack-pixels-10-13, his UP 10/17) and a number; a
   supply stands on the glass only when the game counts it, never a dash, never an invented number. Legs, on the demo:
   S1  the five icons are his pack tiles (slices/supply_icons/ against reference/art_bank/prop): four byte for byte, FOOD the
       water bottle standing behind the can, his two tiles laid together pixel for pixel (UI, rule 209(b));
   S2  the game counts the six (RE-AIMED 10/25, RUN TWO's wagon): the glass carries them from the first minute, no dash, the pack's cells;
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
const SIX = ['batteries', 'food', 'tape', 'meds', 'rounds'];   /* RE-AIMED 10/26 by RUN TWO (rule 209, Paolo 10/26: 'water and food are one resource'): the bar carries FIVE; water is in FOOD's one count, never shown alone */
const SRC = { batteries: 'pack_11_survival_props_045', food: 'pack_11_survival_props_042', water: 'pack_11_survival_props_004', tape: 'pack_11_survival_props_039', meds: 'pack_12_weapons_and_supplies_030', rounds: 'pack_12_weapons_and_supplies_018' };

(async () => {
  /* UI [food and water are one] (rule 209(b)): FOOD is ONE picture, his two pack tiles laid together with no pixel changed, the
     water bottle standing behind the can (slices/supply_icons/SOURCES.txt): the other four byte for byte, FOOD pixel for pixel */
  const FOUR = SIX.filter(k => k !== 'food');
  const same = FOUR.filter(k => { try { return fs.readFileSync(path.join(ROOT, 'slices/supply_icons', k + '.png')).equals(fs.readFileSync(path.join(ROOT, 'reference/art_bank/prop', SRC[k] + '.png'))); } catch (_e) { return false; } });
  /* the two tiles laid the way SOURCES.txt says (PIL's alpha_composite, the tool that made it), compared pixel for pixel */
  const foodOk = (() => { try { return require('child_process').execFileSync('python3', ['-c', [
    'import sys', 'from PIL import Image', 'import numpy as np',
    'f, c, b = [Image.open(x).convert("RGBA") for x in sys.argv[1:4]]',
    'o = Image.new("RGBA", (112, 112), (0, 0, 0, 0)); o.alpha_composite(b, (64, 0)); o.alpha_composite(c, (0, 16))',
    'd = int((np.asarray(o).astype(int) != np.asarray(f).astype(int)).any(-1).sum()) if f.size == (112, 112) else -1',
    'print("true" if d == 0 else str(d) + " pixels off")'].join('\n'),
    path.join(ROOT, 'slices/supply_icons/food.png'), path.join(ROOT, 'reference/art_bank/prop', SRC.food + '.png'), path.join(ROOT, 'reference/art_bank/prop', SRC.water + '.png')], { encoding: 'utf8' }).trim(); } catch (e) { return String(e.message).slice(0, 80); } })();
  leg(same.length === FOUR.length && foodOk === 'true', 'S1  THE FIVE ICONS ARE HIS PACK TILES: FOUR BYTE FOR BYTE, FOOD THE CAN IN FRONT OF THE BOTTLE, NO PIXEL CHANGED (rule 209(b))', same.length + ' of ' + FOUR.length + ' byte for byte; food ' + foodOk);   /* RE-AIMED 10/26 (rule 209): five; the can with the bottle behind it is UI's to make (NOTE), and this leg follows it then */
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
    /* RE-AIMED 10/25 (RUN TWO __THE_WAGON__): the game counts the six now (bohemia.supplies.v1, seeded at the door: the origin's
       wagon and its Battle Brothers start), so the glass carries the batteries and every count the game keeps from the first minute */
    const kept = await fr.evaluate(() => { try { const w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'); return ['food', 'tape', 'meds', 'rounds'].filter(k => w && typeof w[k] === 'number'); } catch (e) { return []; } });
    if (prof === 'phone_portrait') leg(r0.map(x => x.f).join(' ') === ['batteries'].concat(kept).join(' ') && kept.length === 4 && !r0.some(x => /^[–-]$/.test(x.n)) && /supply_icons\/batteries\.png$/.test(r0[0].src) && r0.every(x => /^\d+$/.test(x.n)),
      'S2  THE GAME COUNTS THE FIVE: THE GLASS CARRIES THEM FROM THE FIRST MINUTE, NO DASH, THE PACK\'S CELLS', JSON.stringify(r0.map(x => x.f + ':' + x.n)));
    const crew = await fr.evaluate(() => (window.__BILL && __BILL.crew) | 0);
    await fr.evaluate(() => { window.BOH_SUPPLIES = { food: 2, water: 30, tape: 3, meds: 1, rounds: 40 };   /* a water key handed by an old door never stands */ });
    await p.waitForTimeout(900);
    const r1 = await read();
    leg(r1.map(x => x.f).join(' ') === SIX.join(' ') && r1.every(x => /supply_icons\/(\w+)\.png$/.test(x.src) && x.src.indexOf(x.f + '.png') >= 0 && x.icon >= 24) && r1.every(x => x.inside),
      'S3  ' + prof.toUpperCase() + ': THE FIVE STAND AT ONCE, IN ECONOMY\'S ORDER, EACH ITS OWN PROP, INSIDE THE GLASS, NO WATER ALONE', r1.map(x => x.f + ':' + x.n + '@' + x.icon + (x.inside ? '' : ' OUT')).join(' '));
    const fd = r1.find(x => x.f === 'food'), rd = r1.find(x => x.f === 'rounds');
    if (prof === 'phone_portrait') leg(fd && fd.low && rd && !rd.low && crew > 0, 'S4  LOW READS RED: 2 NIGHTS OF FOOD AND WATER FOR A CREW OF ' + crew + ' IS RED, 40 ROUNDS IS NOT', 'food low ' + (fd && fd.low) + ', rounds low ' + (rd && rd.low));
    if (prof === 'computer') {
      const gb = await fr.evaluate(() => { const r = document.querySelector('#bmtb [data-tb=g]').getBoundingClientRect(); return { x: r.x + r.width - 20, y: r.y + r.height / 2 }; });
      const fb = await p.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return { x: r.x, y: r.y }; });
      await p.mouse.move(fb.x + gb.x, fb.y + gb.y); await p.waitForTimeout(700);
      const h = await read();
      await p.mouse.move(5, 880); await p.waitForTimeout(700);
      const h2 = await read();
      const nights = h.find(x => x.f === 'nights'), hf = h.find(x => x.f === 'food'), hw = h.find(x => x.f === 'water');
      leg(nights && hf && /^\d+ NIGHTS?$/.test(hf.i) && !hw   /* RE-AIMED 10/25 (RUN TWO): the wagon is eaten at nightfall, so its hold counts nights (THE DAYS ONCE: DAYS is never on the bar) */ && h.map(x => x.f).indexOf('nights') === 1 && !h2.find(x => x.f === 'nights') && !(h2.find(x => x.f === 'food') || {}).i,
        'S5  A HOLD SHOWS THE NIGHTS AFTER THE BATTERIES AND THE NIGHTS THE FOOD AND WATER LAST; LET GO, THEY GO', 'held: ' + h.map(x => x.f + (x.i ? '(' + x.i + ')' : '')).join(' ') + ' | let go: ' + h2.map(x => x.f + (x.i ? '(' + x.i + ')' : '')).join(' '));
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
