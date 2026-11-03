#!/usr/bin/env node
/* BEASTS 2 (11/3/26, rule 345 amended (b), ask line 381, piece 2): THE BEASTS INTO THE FIGHT, SEEN FROM THE FIGHT'S CAMERA.
   WAS: the beast party every beast job dealt before (faction 'beasts': dire wolves and cave hyenas, wherever it was). NOW: the
   parties the jobs deal by ground: the bull at the parks, the camel herd in the open desert, the lion in the hills, the hog
   sounder at the water. The real fight page on his phone (390 x 844), the deal after a beat, his four men on the same board for
   scale. -> slices/vote/beasts_into_the_fight/<name>.webp (half size, cut to the band of the board where the men and the beasts
   stand, so the card shows them near the fight's own size) and shots.json
     node tools/bohemia_beasts_into_the_fight_shots.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'slices/vote/beasts_into_the_fight');
const SHOTS = [
  { name: 'was_beasts', faction: 'beasts', count: 4, kind: 'suburb' },
  { name: 'now_bulls', faction: 'bulls', count: 4, kind: 'scrub' },
  { name: 'now_camels', faction: 'camels', count: 4, kind: 'shore' },
  { name: 'now_lions', faction: 'lions', count: 4, kind: 'scrub' },
  { name: 'now_hogs', faction: 'hogs', count: 4, kind: 'wash' }
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const report = [];
  for (const s of SHOTS) {
    const opts = { seed: 11, speed: 4, auto: false, night: false, kind: s.kind, party: { faction: s.faction, count: s.count, days: 1 }, met: 3, cap: 4 };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    try {
      await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
      await d.page.waitForTimeout(1800);
      const png = path.join(OUT, s.name + '.png');
      await d.page.screenshot({ path: png });
      const them = await d.page.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind));
      report.push({ name: s.name, faction: s.faction, kind: s.kind, them, errors: d.errs.length });
      console.log(s.name, them.join(','), '| errors', d.errs.length);
    } catch (e) { report.push({ name: s.name, failed: String(e && e.message || e) }); console.log(s.name, 'FAILED', String(e).slice(0, 120)); }
    await d.close();
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 1));
  require('child_process').execFileSync('python3', ['-c', "import glob,os,sys\nfrom PIL import Image\nfor f in glob.glob(os.path.join(sys.argv[1],'*.png')):\n im=Image.open(f).convert('RGB'); im=im.resize((im.width//2, im.height//2), Image.LANCZOS); im=im.crop((0, int(im.height*0.19), im.width, int(im.height*0.56))); im.save(f[:-4]+'.webp','WEBP',quality=84); os.remove(f)", OUT]);
})();
