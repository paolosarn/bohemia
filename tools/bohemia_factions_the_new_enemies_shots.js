#!/usr/bin/env node
/* FACTIONS [the new enemies] (11/3/26, VAMILY rule 302): A FIGHT AGAINST EACH NEW TYPE ON THE PHONE. The rebuilt fight page is the
   one every map door of the demo opens (slices/BOHEMIA_FIGHT.html; tools/bohemia_cut_the_demo.js step 6), driven by the one driver
   (tools/bohemia_drive_the_demo.js, his phone upright), handed each new faction's band the way the map hands a party
   ([{kind, count}]), on AUTO: one shot at the deal (every man drawn, the hidden ones too, so the looks can be judged) and one
   after the fight has run, so the moves show (the wall, the hook, the needle, the run, the rally). Page errors are counted.
     node tools/bohemia_factions_the_new_enemies_shots.js [out dir] [faction,faction]
   -> <out>/<faction>_deal.png, <faction>_fight.png, and shots.json (who stood, what moved, errors) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/factions_new_enemies'));
const BANDS = {
  house: [{ kind: 'house_shield', count: 3 }, { kind: 'house_hook', count: 1 }, { kind: 'house_crossbow', count: 2 }],
  watch: [{ kind: 'watch_captain', count: 1 }, { kind: 'watch_neighbor', count: 5 }],
  keepers: [{ kind: 'keeper_feral', count: 1 }, { kind: 'keeper_thrall', count: 3 }],
  water: [{ kind: 'water_cutter', count: 3 }, { kind: 'water_needle', count: 2 }]
};
const KINDS = { house: 'ruin', watch: 'suburb', keepers: 'scrub', water: 'strip' };
const WANT = (process.argv[3] || Object.keys(BANDS).join(',')).split(',');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const report = [];
  for (const f of WANT) {
    const opts = { seed: 11, speed: 4, auto: true, night: false, kind: KINDS[f], party: BANDS[f], met: 3 };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const errs0 = d.errs.length;
    try {
      await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
      await d.page.evaluate(() => { window.__shown = FIGHT.shown; FIGHT.shown = function () { return true; }; });
      await d.page.waitForTimeout(1500);
      await d.page.screenshot({ path: path.join(OUT, f + '_deal.png') });
      const stood = await d.page.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, name: u.name, look: u.look, weapon: u.weapon && u.weapon.name, shield: u.shield && u.shield.name, hp: u.hpMax })));
      await d.page.evaluate(() => { FIGHT.shown = window.__shown; window.__moves = {}; const em = FIGHT.S; });
      /* what moved: read the fight's log as it plays */
      await d.page.waitForTimeout(9000);
      const moves = await d.page.evaluate(() => { const m = {}; (FIGHT.S.log || []).forEach(e => { const k = e.t === 'skill' ? e.skill : (e.t === 'morale' && e.to === 'Fleeing') ? 'flees' : (e.t === 'poisoned' || e.t === 'berserk' || e.t === 'rally') ? e.t : null; if (k) m[k] = (m[k] || 0) + 1; }); return { m, round: FIGHT.S.round, over: FIGHT.S.over, result: FIGHT.S.result || null }; });
      await d.page.screenshot({ path: path.join(OUT, f + '_fight.png') });
      report.push({ faction: f, kind: KINDS[f], stood, moves: moves.m, round: moves.round, over: moves.over, result: moves.result, errors: d.errs.slice(errs0).map(String).slice(0, 5) });
      console.log(f, 'stood', stood.map(s => s.name + '(' + s.look + ')').join(' '), '| moves', JSON.stringify(moves.m), '| round', moves.round, '| errors', d.errs.length - errs0);
    } catch (e) { report.push({ faction: f, failed: String(e && e.message || e), errors: d.errs.slice(errs0).map(String).slice(0, 5) }); console.log(f, 'FAILED', String(e && e.message || e)); }
    await d.close();
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 1));
})();
