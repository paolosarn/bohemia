/* BOHEMIA -- EYES AND EARS, E17 [locked ignored] round two: THE SURFACE HALF.
 *
 * One question only, asked on the real screen instead of in the source:
 * WHAT IS ACTUALLY DRAWN ON THE FIRST THING HE TOUCHES?
 *
 * THE RULING UNDER TEST
 *   laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md line 88:
 *   "## THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo)"
 *   Note the case. That lock is lowercase, which is the whole reason round one
 *   said a case-sensitive sweep would miss the brief's own example.
 *
 * WHY A PICTURE AND NOT A GREP
 *   E13 proved it in this lane: a claim read out of source is not a fact on the
 *   surface. The source says the splash holds a logo canvas, a subtitle and a
 *   TAP line. That is evidence, not proof, because a canvas can draw anything.
 *   So this opens the shipped alpha in real Chromium at iPhone size and counts
 *   what is on the screen behind the name: distinct colours, and how much of
 *   the splash is anything other than its flat ground.
 *
 * WHAT "A RIDGE IS DRAWN" WOULD LOOK LIKE
 *   A drawn landscape is a horizon: many colours, and a large share of pixels
 *   that are not the background. A wordmark on a void is the opposite -- a
 *   handful of colours, and the only non-ground pixels are the name plate and
 *   two text lines, all of which this measures and subtracts.
 *
 * RULE ZERO (E9, this lane's own law): a zero needs a positive control.
 *   Before measuring the splash it measures the WALKED CITY canvas the same way.
 *   The city is unquestionably a drawn scene. If the city does not come back as
 *   one, the measurement is broken and NOTHING is printed.
 */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');

function pw() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright'];
  for (const t of tries) { try { return require(t); } catch (e) {} }
  throw new Error('playwright not found');
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/* NO PIXEL MATH HERE, ON PURPOSE. The first cut of this file counted colours in
   node with pngjs and node does not have pngjs in this environment, so it printed
   {ok:false} and measured nothing. Python in the same repo already has Pillow.
   So node does the one thing only node can do -- drive the real browser and take
   the picture -- and the counting happens in bohemia_eyes_locked.py, which also
   keeps every number in one place. */
const OUTDIR = path.join(ROOT, 'records', 'target');
function shot(buf, name) {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const p = path.join(OUTDIR, name);
  fs.writeFileSync(p, buf);
  return path.relative(ROOT, p);
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files'] });
  const ctx = await b.newContext(PHONE);
  const page = await ctx.newPage();
  const out = { ok: true, when: new Date().toISOString() };
  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'),
      { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);

    /* THE SPLASH, before anything is tapped. */
    const front = await page.$('#front');
    if (!front) throw new Error('#front not on the page');
    out.splash_png = shot(await front.screenshot(), 'EYES_E17_SPLASH.png');

    /* what the splash's own furniture accounts for: the name plate and the two
       text lines. Measured so the verdict cannot be accused of counting the
       wordmark as scenery. */
    out.furniture = await page.evaluate(() => {
      const ids = ['logoplate', 'frontsub', 'fronttap'];
      const f = document.getElementById('front');
      if (!f) return null;
      const fr = f.getBoundingClientRect();
      let a = 0; const parts = [];
      for (const id of ids) {
        const e = document.getElementById(id);
        if (!e) continue;
        const r = e.getBoundingClientRect();
        a += r.width * r.height;
        parts.push({ id, w: +r.width.toFixed(1), h: +r.height.toFixed(1) });
      }
      return { parts, share: +(a / (fr.width * fr.height)).toFixed(4) };
    });

    /* THE POSITIVE CONTROL: the walked city canvas, which is beyond argument a
       drawn scene. If this does not read as one, the instrument is wrong. */
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(3500);
    const fr = page.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr) {
      await fr.waitForSelector('#cv', { timeout: 30000 }).catch(() => {});
      const cv = await fr.$('#cv');
      if (cv) out.city_png = shot(await cv.screenshot(), 'EYES_E17_CITY.png');
    }
  } catch (e) {
    out.ok = false; out.why = String(e).slice(0, 300);
  }
  await b.close();
  fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_EYES_E17_SURFACE_9_12_26.json'),
    JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})();
