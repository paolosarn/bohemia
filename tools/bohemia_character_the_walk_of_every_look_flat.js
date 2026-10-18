#!/usr/bin/env node
/* CHARACTER [the walk of every look]: THE TWIN'S WALK. The game's own flat sprite of each of the thirteen (and the body
   under them), walking SE, read live off the alpha's buildFrame at the SAME six phases the rig draws ((i + 0.5) / 6, two
   beats at 120), so the sheet puts the old walk and the model's walk key for key at 1:1. Read-only: the alpha is never
   edited, its worn/dials/age are put back after. Out: records/target/character/walk_flat/<look>_SE_k0N.png
   Run: node tools/bohemia_character_the_walk_of_every_look_flat.js
   REUSE CHECK: the driver is COOK THREE's thirteen repainted (tools/bohemia_cook3_the_thirteen_repainted.js), the same
   swap of G_WORN / G.bodyVar / G.age and the same cache clears; the pixels are buildFrame's, untouched.
   REFERENCE CHECK: the twin IS the game's own sprite as it walks today; no reference game. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(ROOT, 'records/target/character/walk_flat');
const KEYS = 6, DIR = process.env.DIR || 'SE';
/* the body under every look, as tools/bohemia_character_the_thirteen_through_the_rig.py LOOKS['Body'] wears it */
const BODY = { hair: 'TEMPLE TAPER', base: 'BLACK TANK', legs: 'BLACK CARGOS', feet: 'WHITE SNEAKERS' };

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS && typeof rebuildFromRig === 'function', { timeout: 90000 });
  const res = await p.evaluate(({ KEYS, DIR, BODY }) => {
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepE = {};
    for (const s in G.equipped) { keepE[s] = G.equipped[s]; G.equipped[s] = ''; }
    const looks = [{ faction: 'Body', worn: BODY, dials: { height: 0, belly: 0, shoulders: 0, hips: 0 } }].concat(FACTION_LOOKS);
    const out = [];
    try {
      for (const f of looks) {
        window.G_WORN = f.worn; G.bodyVar = f.dials; G.age = f.age || 'adult';
        rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const keys = [];
        for (let k = 0; k < KEYS; k++) {
          const fr = buildFrame(DIR, 'walk', (k + 0.5) / KEYS);
          keys.push({ W: fr.CW, H: fr.CH, px: fr.px.map(q => q ? [q[0], q[1], q[2], q[3] == null ? 255 : q[3]] : 0) });
        }
        out.push({ look: f.faction, keys });
      }
    } finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; for (const s in keepE) G.equipped[s] = keepE[s];
      rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    return out;
  }, { KEYS, DIR, BODY });
  await b.close();
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(OUT, '_frames.json');
  fs.writeFileSync(tmp, JSON.stringify(res));
  /* PNGs written by python's PIL (no image library in node here) */
  const py = `
import json, sys
from PIL import Image
d = json.load(open(sys.argv[1]))
for L in d:
    for k, f in enumerate(L['keys']):
        im = Image.new('RGBA', (f['W'], f['H']), (0, 0, 0, 0))
        im.putdata([tuple(q) if q else (0, 0, 0, 0) for q in f['px']])
        im.save('%s/%s_${DIR}_k%02d.png' % (sys.argv[2], L['look'].lower(), k))
print('flat walk', len(d), 'looks')
`;
  require('child_process').execFileSync('python3', ['-c', py, tmp, OUT], { stdio: 'inherit' });
  fs.unlinkSync(tmp);
})();
