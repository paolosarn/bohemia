/* BOHEMIA -- HOW BIG IS THE PERSON, ON THE GLASS
 * EYES AND EARS, lane 17, E26's owed measurement. 9/21/26. Rule 21.
 *
 * RULE 21 (coordinator 9/21, from four lanes' measurements): "A person is drawn at ONE pixel size
 * on every surface he walks or fights on (112 box, about 100 px painted, the size the street has
 * shipped at for months) and the camera moves the ground, never his size." The street leg has a
 * gate (body_scale 14/0). THE FIGHT LEG IS OWED, and the rule itself records the defect it is
 * owed for: "the fight ties the body to the floor zoom (3.03x smaller the moment a fight starts,
 * 37 px against 112)."
 *
 * AND THIS LANE HAS OWED THE SAME MEASUREMENT SINCE E26 ROUND 8, in its own words: "a body painted
 * inside the screen rectangle is not a body a person notices -- at the far zoom it is a few pixels,
 * and that is the next thing to measure." Rule 21 has now put a NUMBER on it, so it is checkable.
 *
 * WHAT IT MEASURES: every image the game paints on the world canvas, by the size it is painted AT,
 * as a histogram. Then the body is identified NOT BY GUESSING but by the game's own constant: the
 * page is asked for BODY_FIXED and for what bodyLadder() returns at the live cell size, and the
 * count of draws landing on that exact height is the number of bodies painted at the shipped size.
 * Anything painted at a body-shaped size that is NOT that height is the finding.
 *
 * WHY A HISTOGRAM AND NOT A GUESS. E28 round one is the reason: that instrument counted 44x44
 * draws onto 44x44 scratch canvases as full-frame overlays and would have put two false
 * accusations on the front page, with every control green. Proving a counter bites does not prove
 * it counts the right thing. So this one prints the WHOLE distribution and names its identifier
 * out loud, and only draws on the world canvas are counted.
 *
 * RULE ZERO:
 *   C1 a planted draw at a known destination size must appear in the histogram at that size
 *   C2 draws onto scratch canvases must NOT be in the world histogram (E28's exact mistake)
 *   C3 the page's own body constant must be readable, or the identifier is a guess and the run
 *      refuses to name a body height at all
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const SURFACE = arg('--surface', path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'));

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await (await b.newContext(PHONE)).newPage();
  const out = { what: 'how big is the person, on the glass', rule: 'rule 21, 9/21',
                when: new Date().toISOString(), surface: SURFACE, controls: [], findings: [] };

  await page.addInitScript(() => {
    try {
      const W = window;
      W.__bsHist = {};            /* destination height -> count, per canvas size */
      W.__bsScratch = 0;
      const P = (W.CanvasRenderingContext2D || {}).prototype;
      if (!P || P.__bsHooked) return;
      const rd = P.drawImage;
      P.drawImage = function () {
        const a = arguments;
        const dh = a.length === 9 ? a[8] : (a.length === 5 ? a[4] : null);
        const c = this.canvas;
        if (dh != null && c) {
          const key = (c.width + 'x' + c.height) + '|' + Math.round(dh);
          W.__bsHist[key] = (W.__bsHist[key] || 0) + 1;
        }
        return rd.apply(this, arguments);
      };
      P.__bsHooked = true;
    } catch (e) {}
  });

  try {
    await page.goto('file://' + SURFACE, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await sleep(2500);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await sleep(32000);

    /* walk a little, so bodies are actually painted */
    await page.evaluate(async () => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const pads = [...d.querySelectorAll('*')].filter(e => /^(dpad|pad|walk|stick|nub)/i.test(e.id || ''));
      const t = pads[0]; if (!t) return;
      const r = t.getBoundingClientRect();
      t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      await new Promise(z => setTimeout(z, 6000));
      t.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    }).catch(() => {});
    await sleep(1500);

    /* C3: the page's own body constant, or this run names no body height at all */
    const know = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = fr && fr.contentWindow;
      if (!w) return null;
      const c = (fr.contentDocument || {}).querySelector ? fr.contentDocument.querySelector('canvas') : null;
      /* BODY_FIXED IS MODULE-SCOPED AND NOT ON THE WINDOW, but bodyLadder() IS, and it reads
         MODE and BODY_FIXED from inside its own scope. In human mode it returns BODY_FIXED for
         ANY cell size, so asking it at several very different cell sizes both READS the constant
         and PROVES which branch we are on: all-equal means the fixed body, different means the
         zoom ladder. That is an identifier taken from the game rather than guessed, which is the
         whole point of control C3. */
      let probe = null, allSame = null;
      try {
        if (typeof w.bodyLadder === 'function') {
          probe = [8, 17, 32, 64, 96].map(c => { try { return w.bodyLadder(c); } catch (e) { return null; } });
          allSame = probe.every(v => v === probe[0] && typeof v === 'number');
        }
      } catch (e) {}
      return { BODY_FIXED: allSame ? probe[0] : null,
               bodyLadder_at_cells_8_17_32_64_96: probe,
               fixed_not_laddered: allSame,
               canvas: c ? (c.width + 'x' + c.height) : null };
    }).catch(() => null);
    out.the_pages_own_numbers = know;
    out.controls.push({ name: 'C3 the page’s own body constant is readable, so the identifier '
                          + 'is not a guess',
                        pass: !!(know && know.BODY_FIXED != null),
                        detail: know ? ('bodyLadder at cells 8/17/32/64/96 returned '
                          + JSON.stringify(know.bodyLadder_at_cells_8_17_32_64_96)
                          + (know.fixed_not_laddered
                             ? ' -- all the same, so this is the FIXED body and the value is the constant'
                             : ' -- NOT all the same, so the body is on the zoom ladder here'))
                          : 'the city frame could not be read' });

    /* C1 and C2: plant one draw on the world canvas and one on a scratch canvas */
    const planted = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const d = (fr && fr.contentDocument) || document;
      const w = fr.contentWindow;
      const c = d.querySelector('canvas'); if (!c) return null;
      const px = d.createElement('canvas'); px.width = px.height = 4;
      c.getContext('2d').drawImage(px, 0, 0, 7, 777);            /* a size nothing else uses */
      const scratch = d.createElement('canvas'); scratch.width = scratch.height = 50;
      scratch.getContext('2d').drawImage(px, 0, 0, 7, 778);      /* on a scratch canvas */
      return { world: c.width + 'x' + c.height, scratchKey: '50x50|778' };
    }).catch(() => null);

    const hist = await page.evaluate(() => {
      const fr = document.getElementById('cityFrame');
      const w = fr && fr.contentWindow;
      return w ? w.__bsHist : null;
    }).catch(() => null);
    out.raw_histogram_keys = hist ? Object.keys(hist).length : 0;

    const worldKey = know && know.canvas ? know.canvas : (planted && planted.world);
    const world = {}, scratch = {};
    if (hist) for (const k of Object.keys(hist)) {
      const [cvs, h] = k.split('|');
      if (worldKey && cvs === worldKey) world[h] = (world[h] || 0) + hist[k];
      else scratch[h] = (scratch[h] || 0) + hist[k];
    }
    out.world_canvas = worldKey;
    out.painted_heights_on_the_world = Object.entries(world)
      .map(([h, n]) => [Number(h), n]).sort((a, b) => b[1] - a[1]).slice(0, 14);
    out.controls.push({ name: 'C1 a planted draw appears in the world histogram at its own size',
                        pass: !!world['777'],
                        detail: world['777'] ? ('found ' + world['777'] + ' draw(s) at 777 px')
                          : 'the planted 777 px draw is missing, so this histogram is not the world canvas' });
    out.controls.push({ name: 'C2 a draw onto a scratch canvas is NOT in the world histogram '
                          + '(the exact mistake E28 round one made)',
                        pass: !world['778'],
                        detail: world['778'] ? 'the scratch draw leaked into the world histogram'
                          : 'the 778 px scratch draw stayed out of it' });

    const fixed = know && know.BODY_FIXED;
    if (fixed != null) {
      const atFixed = world[String(fixed)] || 0;
      const bodyish = Object.entries(world).map(([h, n]) => [Number(h), n])
        .filter(([h]) => h >= 20 && h <= 260 && h !== 777 && h !== fixed)
        .sort((a, b) => b[1] - a[1]).slice(0, 6);
      out.bodies_painted_at_the_shipped_size = atFixed;
      out.other_body_shaped_heights = bodyish;
      if (atFixed === 0) {
        out.findings.push({ rule: 'RULE 21 THE GROUND MAY ZOOM, THE PERSON MAY NOT',
          reading: 'NOT ONE image was painted at the page’s own BODY_FIXED of ' + fixed
            + ' px on the world canvas in this walk. The body-shaped sizes actually painted were: '
            + bodyish.map(([h, n]) => h + ' px x' + n).join(', ') });
      }
    }
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 400); }
  await b.close();
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_EYES_BODY_SIZE_9_21_26.json'), JSON.stringify(out, null, 2));
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  const k = out.the_pages_own_numbers || {};
  console.log('  the page\'s own bodyLadder at cells 8/17/32/64/96: '
    + JSON.stringify(k.bodyLadder_at_cells_8_17_32_64_96)
    + (k.fixed_not_laddered ? '  -> FIXED at ' + k.BODY_FIXED : '  -> on the ladder, not fixed'));
  console.log('  painted at the shipped size: ' + out.bodies_painted_at_the_shipped_size);
  console.log('  top painted heights on the ' + out.world_canvas + ' world canvas:');
  for (const [h, n] of (out.painted_heights_on_the_world || [])) console.log('     ' + String(h).padStart(5) + ' px  x' + n);
  process.exit(0);
})();
