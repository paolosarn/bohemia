#!/usr/bin/env node
/* ============================================================================
   THE ZOOM LADDER (RUN 10/24/26, row [one map at every zoom], rule 142)

   Paolo 10/24: 'the map when it's zoomed out looks a certain way, and when it
   zooms in it fades to the 2D shit we had previously... it's like three maps:
   when the map blows up I see the skeleton, ugly old 2D rough-draft horseshit.'

   Boots the demo through the one driver on his phone, gets onto the map, and
   walks the camera from the farthest stop to the closest in small steps through
   the map's own zoom call (setZoomAt, the function every pinch move calls), then
   one real squeeze past the closest stop (where the old block view opened).
   At every step it photographs the glass and writes down which layers drew:
     painted   the painted 3D city (vbCityDraw) and its weight
     blocks    the old per-block pictures (the 2D tiles under it)
     look      the old block close-up past the closest stop (the skeleton)
   Writes a contact sheet (slices/vote/RUN_THE_ZOOM_LADDER_<tag>.webp) and the
   numbers (records/run/THE_ZOOM_LADDER_<tag>.json).

     node tools/bohemia_run_the_zoom_ladder.js [--tag before] [--steps 16] [--file BOHEMIA_DEMO.html]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const D = require('./bohemia_drive_the_demo.js');

const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TAG = arg('tag', 'before');
const STEPS = +arg('steps', 16);
const FILE = arg('file', 'BOHEMIA_DEMO.html');
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ladder-'));

async function main() {
  const d = await D.open({ file: FILE });
  const fr = d.fr, page = d.page;
  const L = { file: FILE, tag: TAG, when: new Date().toISOString(), steps: [] };
  try {
    /* the demo opens on the map (rule 38b); the driver's squeezes can carry it on into the sky (the region seen from
       above), which is a different picture, so the ladder starts from the map itself */
    await d.toMap().catch(() => {});
    await fr.evaluate(() => { if (typeof SKY !== 'undefined' && SKY) skyExit(); });
    await page.waitForTimeout(3000);
    const zb = await fr.evaluate(() => zoomBounds());
    L.bounds = zb;
    const read = () => fr.evaluate(() => {
      const r = { czoom: +CZOOM.toFixed(3), tw: +TW.toFixed(1), mode: MODE, sky: !!(typeof SKY !== 'undefined' && SKY), look: !!(typeof LOOK !== 'undefined' && LOOK.on) };
      const one = typeof VB_ONE_MAP !== 'undefined' && VB_ONE_MAP;
      try { r.paintedAlpha = (!one && TW >= VB_CITY_NONE) ? 0 : +vbCityAlpha().toFixed(2); } catch (e) { r.paintedAlpha = null; }
      try { r.blocks = (typeof window.__MAP_BLOCKS_DREW !== 'undefined') ? !!window.__MAP_BLOCKS_DREW : (TW > VB_CITY_HOLD); } catch (e) { r.blocks = null; }
      try { r.tiles = window.VBT ? { landed: VBT.landed, held: VBT.tiles.size, S: VBT.S, waiting: VBT.want | 0 } : null; } catch (e) { r.tiles = null; }
      return r; });
    const shots = [];
    for (let i = 0; i <= STEPS; i++) {
      const z = zb[0] * Math.pow(zb[1] / zb[0], i / STEPS);
      await fr.evaluate((z) => { ZGEST.fresh = true; setZoomAt(z); }, z);
      /* the sharper tiles land in the worker; give the glass the time a person gives it (up to 8 s), then the picture */
      for (let k = 0; k < 16; k++) { await page.waitForTimeout(500); const w = await fr.evaluate(() => window.VBT ? (VBT.want | 0) + (VBT.busy ? 1 : 0) : 0).catch(() => 0); if (k >= 2 && !w) break; }
      const f = path.join(TMP, 's' + String(i).padStart(2, '0') + '.png');
      await d.shot(f);
      const r = await read(); r.i = i; L.steps.push(r); shots.push(f);
      console.log('  step ' + i + ' ' + JSON.stringify(r));
    }
    /* and one real squeeze past the closest stop: the old block view lived there */
    await d.pinchIn().catch(() => {});
    await page.waitForTimeout(2500);
    const f = path.join(TMP, 's99.png'); await d.shot(f); shots.push(f);
    const r = await read(); r.i = 'past the closest'; L.steps.push(r);
    console.log('  past the closest ' + JSON.stringify(r));
    L.errors = d.errs.slice(0, 10);
    /* the contact sheet: five a row, at a third of the phone's size */
    const out = path.join(ROOT, 'slices/vote/RUN_THE_ZOOM_LADDER_' + TAG.toUpperCase() + '_10_24.webp');
    const py = `
import sys, json
from PIL import Image, ImageDraw
fs = json.loads(sys.argv[1]); labs = json.loads(sys.argv[2])
ims = [Image.open(f).convert('RGB') for f in fs]
w, h = ims[0].size; k = 0.34; tw, th = int(w * k), int(h * k)
cols = 5; rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + 18)), (12, 10, 8)); dr = ImageDraw.Draw(S)
for n, im in enumerate(ims):
    x, y = (n % cols) * tw, (n // cols) * (th + 18)
    S.paste(im.resize((tw, th), Image.LANCZOS), (x, y + 18)); dr.text((x + 4, y + 3), labs[n], fill=(230, 220, 190))
S.save(sys.argv[3], 'WEBP', quality=80)
`;
    const labs = L.steps.map((s) => (s.i === 'past the closest' ? 'PAST CLOSEST ' : 'z' + s.czoom + ' ') + 'block ' + s.tw + 'px' + (s.look ? ' LOOK' : '') + (s.sky ? ' SKY' : '') + (s.blocks ? ' OLD BLOCKS' : '') + (s.tiles && s.tiles.held ? ' tiles@' + s.tiles.S : '') + ' paint ' + s.paintedAlpha);
    cp.execFileSync('python3', ['-c', py, JSON.stringify(shots), JSON.stringify(labs), out]);
    L.sheet = path.relative(ROOT, out);
    console.log('  sheet ' + L.sheet);
  } finally {
    const o = path.join(ROOT, 'records/run/THE_ZOOM_LADDER_' + TAG.toUpperCase() + '_10_24.json');
    fs.mkdirSync(path.dirname(o), { recursive: true }); fs.writeFileSync(o, JSON.stringify(L, null, 1));
    await d.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
