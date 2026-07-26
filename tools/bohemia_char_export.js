/* BOHEMIA CHARACTER EXPORT (7/26/26) — the ART lane's only source of bodies.
 *
 * VERIFY-ON-THE-REAL-SURFACE law: a target screen that draws its own stick
 * figure is a lie about the game. So the character in every target screen is
 * baked by the SHIPPED ALPHA itself — this script drives the real
 * slices/BOHEMIA_ALPHA_0_9.html in a real browser, calls the alpha's own
 * buildFrame()/frameToRGBA() (the same pair the run, the city and combat bake
 * through) and writes the raw 56x56 RGBA frames out as PNGs.
 *
 * REUSE CHECK: this file draws NOTHING. Every pixel it emits came out of the
 * alpha's rig + wardrobe + face pipeline. No bank is sampled, no art is cooked.
 *
 *   node tools/bohemia_char_export.js   ->  records/target/char/*.png
 */
const path = require('path'), fs = require('fs');

function playwright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records', 'target', 'char');
const ALPHA = path.join(REPO, 'slices', 'BOHEMIA_ALPHA_0_9.html');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => console.log('  PAGEERR', String(e).slice(0, 200)));
  await p.goto('file://' + ALPHA);
  await p.waitForTimeout(5000);
  await p.mouse.click(195, 400);            /* through the front splash */
  await p.waitForTimeout(4000);
  const ready = await p.evaluate(() => typeof buildFrame === 'function' &&
                                       typeof frameToRGBA === 'function');
  if (!ready) { console.error('FAIL: the alpha never exposed buildFrame/frameToRGBA'); process.exit(1); }
  const shots = await p.evaluate(() => {
    const res = {};
    const mk = f => {
      const rgba = frameToRGBA(f), c = document.createElement('canvas');
      c.width = 56; c.height = 56;
      const ctx = c.getContext('2d'), id = ctx.createImageData(56, 56);
      id.data.set(rgba); ctx.putImageData(id, 0, 0);
      return c.toDataURL('image/png');
    };
    for (const d of DIRS) res['idle_' + d] = mk(buildFrame(d, 'idle', 0.25));
    for (const d of ['S', 'E', 'W', 'N', 'SE', 'SW', 'NE', 'NW'])
      [0, 0.25, 0.5, 0.75].forEach((ph, i) => { res['walk_' + d + '_' + i] = mk(buildFrame(d, 'walk', ph)); });
    return res;
  });
  for (const k in shots) fs.writeFileSync(path.join(OUT, k + '.png'),
                                          Buffer.from(shots[k].split(',')[1], 'base64'));
  console.log('OK ' + Object.keys(shots).length + ' real bakes -> records/target/char/');
  await b.close();
})();
