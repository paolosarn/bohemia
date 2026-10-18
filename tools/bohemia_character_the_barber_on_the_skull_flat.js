#!/usr/bin/env node
/* CHARACTER [the barber on the skull]: THE TWIN. The game's own flat body (the man under every look: black tank, black
   cargos, white sneakers) wearing each of the barber's canon cuts, read live off the alpha's buildFrame in all EIGHT
   facings at the six phases the rig draws ((k + 0.5) / 6, two beats at 120), so the sheet puts the flat cut and the
   sculpted cut side by side, facing for facing, key for key, at 1:1. Read-only: the alpha is never edited; G_WORN,
   bodyVar, age and the equipped slots are put back after.
   Out: records/target/character/barber_flat/<cut>_<F>_k0N.png   (cut = the bank's name, lower case, spaces as _)
   Run: node tools/bohemia_character_the_barber_on_the_skull_flat.js
   REUSE CHECK: the driver is [the walk of every look]'s (tools/bohemia_character_the_walk_of_every_look_flat.js), which
   is COOK THREE's thirteen repainted; the pixels are buildFrame's and genHair's, untouched.
   REFERENCE CHECK: the twin IS the game's own barber cut as the body wears it today; no reference game. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(ROOT, 'records/target/character/barber_flat');
const KEYS = 6, DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
/* the barber's first cuts (the row's END STATE), then the rest of the canon bank in the alpha's order */
const CUTS = (process.env.CUTS || 'TEMPLE TAPER,COIL CROWN,LAYERED FALL').split(',');
/* the barber's mannequin, as tools/bohemia_character_the_barber_on_the_skull.py BARBER_BODY wears it: the man under every
   look in the bank's WRAPPED BOOTS (the white sneakers read as a light from below on the guide's light row, measured) */
const BODY = { base: 'BLACK TANK', legs: 'BLACK CARGOS', feet: 'WRAPPED BOOTS' };

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && typeof rebuildFromRig === 'function', { timeout: 90000 });
  const res = await p.evaluate(({ KEYS, DIRS, CUTS, BODY }) => {
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepE = {};
    for (const s in G.equipped) { keepE[s] = G.equipped[s]; G.equipped[s] = ''; }
    const out = [];
    try {
      for (const cut of CUTS) {
        window.G_WORN = Object.assign({ hair: cut }, BODY); G.bodyVar = { height: 0, belly: 0, shoulders: 0, hips: 0 }; G.age = 'adult';
        rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const dirs = {};
        for (const d of DIRS) {
          const keys = [];
          for (let k = 0; k < KEYS; k++) {
            const fr = buildFrame(d, 'walk', (k + 0.5) / KEYS);
            keys.push({ W: fr.CW, H: fr.CH, px: fr.px.map(q => q ? [q[0], q[1], q[2], q[3] == null ? 255 : q[3]] : 0) });
          }
          dirs[d] = keys;
        }
        out.push({ cut, dirs });
      }
    } finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; for (const s in keepE) G.equipped[s] = keepE[s];
      rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    return out;
  }, { KEYS, DIRS, CUTS, BODY });
  await b.close();
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, '_frames.json');
  fs.writeFileSync(tmp, JSON.stringify(res));
  /* PNGs written by python's PIL (no image library in node here) */
  const py = `
import json, sys
from PIL import Image
d = json.load(open(sys.argv[1]))
n = 0
for L in d:
    tag = L['cut'].lower().replace(' ', '_')
    for f, keys in L['dirs'].items():
        for k, fr in enumerate(keys):
            im = Image.new('RGBA', (fr['W'], fr['H']), (0, 0, 0, 0))
            im.putdata([tuple(q) if q else (0, 0, 0, 0) for q in fr['px']])
            im.save('%s/%s_%s_k%02d.png' % (sys.argv[2], tag, f, k)); n += 1
print('flat barber', len(d), 'cuts', n, 'frames')
`;
  require('child_process').execFileSync('python3', ['-c', py, tmp, OUT], { stdio: 'inherit' });
  fs.unlinkSync(tmp);
})();
