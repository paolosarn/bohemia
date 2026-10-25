#!/usr/bin/env node
/* THE FIGHT'S BARS AND THE END SCREEN, NEVER AI SLOP (UI [the PC playtest: the UI's part] (4), rule 164 items 7, 16 and 25, Paolo
   10/24 on his PC: the UI never looks like AI slop; the loot screen is AI slop; the fight's UI better than Battle Brothers').
   slices/bohemia_ui_materials.js __THE_FIGHTS_BARS__ and the end screen's dress. Legs:
   B1  the fight (his phone and a computer): the man's three strips are gauges, each its own stat icon in front (heart, shield,
       lungs), 16 points tall, a sunk track and a fill drawn in pixels (no CSS gradient), the numbers printed in them equal to
       the man's own (hitpoints, armour head + body, fatigue of its most);
   B2  the numbers follow the man shown: another man taken, the hitpoints printed are his;
   B3  THE END SCREEN (RUN TWO's, slices/BOHEMIA_SPOILS_SCREEN.html): the XP bars are the same track and tube, no gradient left on
       them; what they left wears his pack's props (batteries, rounds, scrap) beside each count;
   B4  nothing thrown.
   Run: node gates/the_fights_bars_and_the_end_screen_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const OPTS = 'window.FIGHT_OPTS={seed:21,kind:"suburb",company:[{background:"companion_2hand",name:"RAUL"},{background:"companion_1hand",name:"DESI"},{background:"companion_ranged",name:"TINA"}],cap:12,party:{count:4,days:3,difficulty:1,faction:"brigands"}}';

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  for (const prof of ['phone_portrait', 'computer']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: prof, arm: OPTS });
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && document.getElementById('load').style.display === 'none', null, { timeout: 90000 }).catch(() => {});
    await p.evaluate(() => { try { fightNow(); } catch (e) {} });
    await p.waitForTimeout(2500);
    const read = () => p.evaluate(() => {
      const v = (FIGHT_UI.pend && FIGHT_UI.pend.target) || FIGHT.current() || FIGHT.S.units[0];
      const bars = [...document.querySelectorAll('#stats .bar')].map(b => { const i = b.querySelector('i'), cs = getComputedStyle(i), bb = getComputedStyle(b, '::before');
        return { cls: b.className, h: Math.round(b.getBoundingClientRect().height), icon: bb.backgroundImage.replace(/^.*\/(\w+)\.png.*$/, '$1'), fill: cs.backgroundImage.slice(0, 30), track: getComputedStyle(b).backgroundImage.slice(0, 30),
          grad: /gradient/.test(cs.backgroundImage + getComputedStyle(b).backgroundImage), num: (b.querySelector('b.bm-num') || {}).textContent || '' }; });
      return { name: v.name, want: [v.hp + '/' + v.hpMax, ((v.armB | 0) + (v.armH | 0)) + '/' + ((v.armBMax | 0) + (v.armHMax | 0)), Math.round(v.fat) + '/' + FIGHT.fatMax(v)], bars };
    });
    const a = await read();
    const icons = a.bars.map(b => b.icon).join(' ');
    leg(a.bars.length === 3 && icons === 'hp melee_defense fatigue' && a.bars.every(b => b.h >= 16 && /^url\("data:image\/png/.test(b.fill) && /^url\("data:image\/png/.test(b.track) && !b.grad) && a.bars.map(b => b.num).join(' ') === a.want.join(' '),
      'B1  ' + prof.toUpperCase() + ': THREE GAUGES, ICON IN FRONT, 16 POINTS, DRAWN TRACK AND FILL, HIS OWN NUMBERS', icons + ' | ' + a.bars.map(b => b.num + '@' + b.h + (b.grad ? ' GRADIENT' : '')).join(' ') + ' | want ' + a.want.join(' '));
    if (prof === 'phone_portrait') {
      const other = await p.evaluate(() => { const v = FIGHT.S.units.find(x => x.side === 'them' && FIGHT.onField(x)); if (!v) return null; FIGHT_UI.pend = { target: v }; return v.name; });
      await p.waitForTimeout(800);
      const b2 = await read();
      leg(!!other && b2.name === other && b2.bars.map(b => b.num).join(' ') === b2.want.join(' '),
        'B2  THE NUMBERS FOLLOW THE MAN SHOWN', (other || 'nobody') + ': ' + b2.bars.map(b => b.num).join(' ') + ' want ' + b2.want.join(' '));
    }
    errs.push(...d.errs);
    await d.close();
  }
  {
    const d = await open({ file: 'BOHEMIA_SPOILS_SCREEN.html', bare: true, profile: 'phone_portrait' });
    await d.page.waitForTimeout(3000);
    const s = await d.page.evaluate(() => ({
      xp: [...document.querySelectorAll('.xpbar')].map(x => { const i = x.querySelector('i'), u = x.querySelector('u');
        return [getComputedStyle(x).backgroundImage, i ? getComputedStyle(i).backgroundImage : 'url(none)', u ? getComputedStyle(u).backgroundImage : 'url(none)'].map(t => /gradient/.test(t) ? 'GRADIENT' : (/data:image\/png/.test(t) ? 'drawn' : t.slice(0, 20))).join(','); }),
      counts: [...document.querySelectorAll('.count[data-count]')].map(c => c.dataset.count + ':' + getComputedStyle(c, '::before').backgroundImage.replace(/^.*\/(\w+)\.png.*$/, '$1')) }));
    leg(s.xp.length > 0 && s.xp.every(x => x === 'drawn,drawn,drawn'), 'B3  THE END SCREEN: EVERY XP BAR THE SUNK TRACK AND THE LIT TUBE, NO GRADIENT', s.xp.join(' | '));
    leg(s.counts.length === 3 && s.counts.every(c => c.split(':')[0] === c.split(':')[1]), 'B3b WHAT THEY LEFT WEARS HIS PACK\'S PROPS BESIDE EACH COUNT', s.counts.join(' '));
    errs.push(...d.errs);
    await d.close();
  }
  const e2 = errs.filter(e => !/ResizeObserver/.test(e));
  leg(e2.length === 0, 'B4  NOTHING THROWN', e2.slice(0, 3).join(' | ') || 'none');
  console.log('=== THE FIGHT\'S BARS AND THE END SCREEN GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
