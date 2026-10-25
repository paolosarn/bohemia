#!/usr/bin/env node
// TUNING [a better AUTO brain and a true calculator] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE: why a gunman below a roof he can
// walk onto this turn does not climb (the first 150 fights of tools/bohemia_tuning_auto_brain.js, today's brain). Prints the table in
// records/BOHEMIA_TUNING_A_BETTER_AUTO_BRAIN_AND_A_TRUE_CALCULATOR_10_25_26.md s1c.
'use strict';
const T = require('./bohemia_tuning_auto_brain.js');
const G = require('./bohemia_tuning_the_whole_grid.js');
(async () => {
  const ctx0 = await G.engine(true), D = ctx0.DB.boardKinds.districts;
  const why = {}; let turns = 0;
  for (let k = 0; k < 150; k++) {
    const ctx = await G.engine(true), F = ctx.FIGHT, S = F.S;
    T.setupFight(ctx, T.fightOf(k, D));
    let g = 0, last = null;
    while (!S.over && g < 60000 && S.round <= 40) {
      const u = F.current(); if (!u) break;
      const key = u.id + '|' + S.round;
      if (u.side === 'you' && F.isRanged(u.weapon) && key !== last && F.level(u.x, u.y) < 2) {
        last = key;
        const f = F.reach(u), sAP = F._t.skillAP(u.weapon, F.strikeSkill(u.weapon), u), foes = S.units.filter(v => v.side !== u.side && F.onField(v));
        let any = false, inRange = false, apOk = false, zoc = false, ok = false;
        const hunt = F._t.huntField(u), line = F._t.lineOf(u, hunt);
        let ahead = false;
        Object.keys(f.best).forEach(kk => { kk = Number(kk); const x = kk % S.w, y = Math.floor(kk / S.w);
          if (F.level(x, y) < 2) return; any = true;
          const ox = u.x, oy = u.y; u.x = x; u.y = y;
          const r = foes.some(t => F.canStrike(Object.assign({}, u, { ap: 99, fat: 0 }), t) && F.sideSees(u.side, t));
          u.x = ox; u.y = oy;
          if (r) inRange = true;
          const a = u.ap - f.best[kk] >= sAP; if (r && a) apOk = true;
          const z = F.zocOn(u, x, y).length > 0; if (r && a && z) zoc = true;
          const ah = line && line.front !== null && hunt(x, y) <= line.front && hunt(x, y) < hunt(u.x, u.y);
          if (r && a && !z && ah) ahead = true;
          if (r && a && !z && !ah) ok = true;
        });
        if (any) { turns++; const w = ok ? 'climb test met' : !inRange ? 'no foe in range from any roof he can reach' : !apOk ? 'a foe in range, but no AP left to shoot after the climb' : ahead ? 'only roofs ahead of his front man' : 'only roofs in a foe ring'; why[w] = (why[w] || 0) + 1; }
      }
      F.aiStep(u); g++;
    }
  }
  console.log('gun turns with a roof he can walk onto this turn (not on one):', turns); Object.keys(why).forEach(w => console.log('  ' + w + ': ' + why[w] + ' (' + (100 * why[w] / turns).toFixed(0) + '%)'));
})();
