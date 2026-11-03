#!/usr/bin/env node
/* FACTIONS [five more beasts] (11/3/26, ask line 343): A FIGHT AGAINST EACH NEW BEAST ON THE PHONE, the same driver and the same
   two shots as the new enemies' (tools/bohemia_factions_the_new_enemies_shots.js): the deal (every one drawn) and the fight after it
   has run on AUTO, on the board kind of the ground each one roams (the coyotes the suburb, the lion the mountain's scrub, the hogs
   the wash, the camels the springs' shore, the bull the open scrub); what moved is read from the fight's own log (the kick, the
   charge, the feed, the pin, the bleeding). Page errors are counted.
     node tools/bohemia_factions_five_more_beasts_shots.js [out dir] [faction,faction]
   -> <out>/<faction>_deal.png, <faction>_fight.png, and shots.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/factions_five_beasts'));
const BANDS = {
  coyotes: [{ kind: 'coyote', count: 6 }],
  lions: [{ kind: 'mountain_lion', count: 1 }],
  hogs: [{ kind: 'feral_hog', count: 4 }],
  camels: [{ kind: 'camelops', count: 3 }],
  bulls: [{ kind: 'feral_bull', count: 1 }]
};
const KINDS = { coyotes: 'suburb', lions: 'scrub', hogs: 'wash', camels: 'shore', bulls: 'scrub' };
const WANT = (process.argv[3] || Object.keys(BANDS).join(',')).split(',');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const report = [];
  for (const f of WANT) {
    const opts = { seed: 11, speed: 4, auto: true, night: false, kind: KINDS[f], party: BANDS[f], met: 3, cap: 4 };   /* four of his: an act-one crew, so the beast's move gets its turn */
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
      await d.page.waitForTimeout(+(process.env.BEAST_RUN_MS || 14000));
      const moves = await d.page.evaluate(() => { const m = {}; (FIGHT.S.log || []).forEach(e => { const k = e.t === 'skill' ? e.skill : (e.t === 'morale' && e.to === 'Fleeing') ? 'flees' : (e.t === 'poisoned' || e.t === 'berserk' || e.t === 'rally' || e.t === 'pinned' || e.t === 'bleeding' || e.t === 'staggered' || e.t === 'free') ? e.t : null; if (k) m[k] = (m[k] || 0) + 1; }); return { m, round: FIGHT.S.round, over: FIGHT.S.over, result: FIGHT.S.result || null }; });
      await d.page.screenshot({ path: path.join(OUT, f + '_fight.png') });
      report.push({ faction: f, kind: KINDS[f], stood, moves: moves.m, round: moves.round, over: moves.over, result: moves.result, errors: d.errs.slice(errs0).map(String).slice(0, 5) });
      console.log(f, 'stood', stood.map(s => s.name + '(' + s.look + ')').join(' '), '| moves', JSON.stringify(moves.m), '| round', moves.round, '| errors', d.errs.length - errs0);
    } catch (e) { report.push({ faction: f, failed: String(e && e.message || e), errors: d.errs.slice(errs0).map(String).slice(0, 5) }); console.log(f, 'FAILED', String(e && e.message || e)); }
    await d.close();
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 1));
  /* the shots at half size as WebP for the VOTE card (a phone's 1170 x 2532 PNG is 3 MB) */
  require('child_process').execFileSync('python3', ['-c', "import glob,os,sys\nfrom PIL import Image\nfor f in glob.glob(os.path.join(sys.argv[1],'*_deal.png'))+glob.glob(os.path.join(sys.argv[1],'*_fight.png')):\n im=Image.open(f).convert('RGB'); im.resize((im.width//2,im.height//2),Image.LANCZOS).save(f[:-4]+'.webp','WEBP',quality=80); os.remove(f)", OUT]);
})();
