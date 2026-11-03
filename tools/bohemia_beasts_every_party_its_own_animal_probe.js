#!/usr/bin/env node
/* BEASTS 2 (11/3/26, rule 345 amended (b), ask line 381): EVERY BEAST PARTY DEALS ITS OWN ANIMAL, DRAWN FROM ITS OWN SHEET.
   For each beast faction a job can now hand the fight (the dire wolves, the cave hyenas, the feral dogs, the coyotes, the lion, the
   hogs, the camels, the bull), the real fight page is opened on his phone with that party ({faction, count}) and read back: the
   kinds it dealt, and the sheet each one is drawn from (the fight's own rigBeast: no fallback to the dire wolf for anything but a
   dire wolf). Page errors counted.   node tools/bohemia_beasts_every_party_its_own_animal_probe.js [faction,faction] */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const WANT = (process.argv[2] || 'wolves,hyenas,dogs,coyotes,lions,hogs,camels,bulls').split(',');
(async () => {
  let bad = 0;
  for (const f of WANT) {
    const opts = { seed: 7, speed: 4, auto: false, night: false, kind: 'scrub', party: { faction: f, count: 4, days: 1 }, met: 3, cap: 4 };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    try {
      await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
      const r = await d.page.evaluate(() => {
        const idx = DB.rig.looks, m = DB.ours.beast_rig_looks ? DB.ours.beast_rig_looks.value : {};
        return FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, beast: !!u.beast, sheet: m[u.kind] || null, has: !!(m[u.kind] && idx[m[u.kind]]) }));
      });
      const sheets = [...new Set(r.map(x => x.sheet))], fell = r.filter(x => !x.has);
      const ok = r.length > 0 && r.every(x => x.beast) && !fell.length && (f === 'wolves' || sheets.indexOf('beast_dire_wolf') < 0);
      if (!ok) bad++;
      console.log((ok ? 'ok   ' : 'FAIL ') + f.padEnd(8), r.map(x => x.kind).join(','), '| sheets', sheets.join(','), '| errors', d.errs.length);
    } catch (e) { bad++; console.log('FAIL ' + f, String(e && e.message || e).slice(0, 120)); }
    await d.close();
  }
  console.log(bad ? 'EVERY PARTY ITS OWN ANIMAL: ' + bad + ' failed' : 'EVERY PARTY ITS OWN ANIMAL: all ' + WANT.length + ' ok');
  process.exit(bad ? 1 : 0);
})();
