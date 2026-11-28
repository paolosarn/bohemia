#!/usr/bin/env node
/* CHARACTER 4, 11/28/26: EVERY CHAMPION IN HIS BAND'S CHAMPION CLOTHES, measured on the fight's own code (tools/bohemia_fight_headless.js):
   60 three-star late bands of each of the road crews, the kids and the heavies; how many champions, how many in their own clothes;
   and the first three road-crew bands whose champion was rolled off an ordinary man (for the VOTE card).
     node tools/bohemia_character_four_every_champion_bands.js [out.json]   */
const path = require('path'); const ROOT = path.dirname(__dirname);
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const ctx = engine(), F = ctx.FIGHT; const out = {}; const keep = [];
for (const fac of ['brigands', 'kids', 'heavies']) {
  let champ = 0, own = 0;
  for (let s = 1; s <= 60; s++) {
    ctx.setSeed(s); F.setup({ auto: true, formation: null, cap: 12, party: { faction: fac, count: 13, days: 90, difficulty: 1, skulls: 3 }, days: 90 });
    const them = F.S.units.filter(u => u.side === 'them');
    them.filter(u => u.champion).forEach(u => { champ++; if (/^enemy_champion_/.test(u.look)) own++; if (keep.length < 3 && fac === 'brigands' && !/leader/.test(u.kind)) keep.push({ fac, seed: s, champ: u.kind, name: u.name, look: u.look, band: them.map(x => x.look) }); });
  }
  out[fac] = champ + ' champions, ' + own + ' in their own clothes';
}
console.log(JSON.stringify(out)); if (process.argv[2]) require('fs').writeFileSync(process.argv[2], JSON.stringify(keep));
