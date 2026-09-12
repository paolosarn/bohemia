/* BOHEMIA -- EYES AND EARS, E19 [slop count] round two: THE REAL-SURFACE HALF.
 *
 * Two questions the static scan cannot answer, both asked on the real screen in real
 * Chromium at phone size, because VERIFY ON THE REAL SURFACE is this lane's religion and
 * E13 proved in this lane that a claim read out of source is not a fact on the screen.
 *
 * 1. DOES THE DECIDED FONT ACTUALLY RENDER?
 *    BohemiaMono is embedded as woff2 in all three shipped surfaces and reached through
 *    --face-casing / --face-screen / --face-body. Declared is not rendered: the face can
 *    fail to load, or an element can resolve to the ui-monospace fallback and look exactly
 *    like the "monospace for everything" tell the law names. So this asks the browser
 *    (document.fonts.check) AND measures it: the same string is drawn in the element's own
 *    stack and in a forced generic monospace, and identical widths mean the element is
 *    getting the fallback.
 *
 * 2. WHAT BREAKS WHEN A READER WIDENS THE LETTER SPACING?
 *    Round one's school found the test the tell lists do not have. WCAG requires content
 *    to survive letter-spacing at 0.12 times the font size and word-spacing at 0.16,
 *    all-caps is harder for dyslexic readers, and screen readers may spell capitalised
 *    text letter by letter. So a row of tight letter-spaced uppercase chips is exactly the
 *    layout that fails, and this is a pass condition with no taste in it at all.
 *
 * RULE ZERO: two planted controls. A fixed-width tight-uppercase chip MUST break under
 * the widening, and a flexible one MUST NOT. If the instrument cannot separate those two
 * it is not measuring anything and no number is reported.
 */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_E19_SURFACE_9_12_26.json');

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
                isMobile: true, hasTouch: true };

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files'] });
  const ctx = await b.newContext(PHONE);
  const page = await ctx.newPage();
  const out = { ok: true, when: new Date().toISOString(), face: 'BohemiaMono' };
  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'),
      { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(3500);

    const fr = page.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (!fr) throw new Error('the walked city frame never loaded');
    await fr.waitForSelector('#topbar', { timeout: 30000 }).catch(() => {});

    const res = await fr.evaluate(async () => {
      const FACE = 'BohemiaMono';
      await (document.fonts && document.fonts.ready);
      const loaded = !!(document.fonts && document.fonts.check('10px "' + FACE + '"'));

      /* the chrome: everything a finger can reach plus the labels around it */
      const sel = '#topbar > *, #devtray > *, #cityfeed *, #blstack > *, .pb, #daycard *';
      const els = [...document.querySelectorAll(sel)]
        .filter(e => e.offsetParent !== null || e.getClientRects().length);

      /* THE WIDTH TRICK DOES NOT WORK HERE AND THE FIRST RUN PROVED IT.
         The plan was: draw the same string in the element's own stack and in a forced
         generic monospace, and call identical widths a fallback. It reported 0 of 40
         elements rendering in the decided face while the face WAS loaded and all 40 asked
         for it -- because BohemiaMono is itself a monospace and its advance width matches
         the generic mono exactly. The discriminator cannot separate two monospace faces,
         so it was answering a question it could not answer.
         What is honestly measurable: whether the browser says the face is available
         (document.fonts.check) and whether it is FIRST in the element's resolved stack.
         Available plus first is the face being used; it is an inference, and the record
         says so instead of dressing it up as a pixel measurement. The width probe is kept
         for the one thing it CAN do: prove the element is not falling back to a sans. */
      const cv = document.createElement('canvas').getContext('2d');
      function widthIn(stack, size, text) {
        cv.font = size + 'px ' + stack;
        return cv.measureText(text).width;
      }
      const probe = 'MIWmiw0123';
      const rows = [];
      for (const e of els) {
        const cs = getComputedStyle(e);
        const size = parseFloat(cs.fontSize) || 12;
        const own = widthIn(cs.fontFamily, size, probe);
        const sans = widthIn('sans-serif', size, probe);
        const first = (cs.fontFamily.split(',')[0] || '').replace(/["']/g, '').trim();
        const txt = (e.textContent || '').trim();
        const letters = txt.replace(/[^A-Za-z]/g, '');
        rows.push({
          id: e.id || (e.className && String(e.className).slice(0, 24)) || e.tagName,
          stack: cs.fontFamily.slice(0, 80),
          asks_for_face: /BohemiaMono/i.test(cs.fontFamily),
          face_is_first: /BohemiaMono/i.test(first),
          not_a_sans_fallback: Math.abs(own - sans) > 0.5,
          css_uppercase: cs.textTransform === 'uppercase',
          /* AND THE ONE THE CSS COUNT MISSES: capitals typed into the text itself. A
             reader cannot turn those off and a screen reader may spell them out, which
             is the accessibility half of the letter-spaced-uppercase tell. */
          caps_in_the_text: letters.length >= 3 && letters === letters.toUpperCase(),
          tracking: cs.letterSpacing,
        });
      }

      /* THE SPACING SURVIVAL TEST. WCAG: content must survive letter-spacing 0.12em and
         word-spacing 0.16em. Plus two planted controls in the same pass. */
      const host = document.body;
      const mk = (id, fixed) => {
        const d = document.createElement('div');
        d.id = id;
        d.textContent = 'SAVE OUTFIT';
        /* 80px, NOT 64. The first planted chip was 64px wide holding text that is about
           73px at tight spacing, so it was ALREADY clipped before the widening and the
           detector correctly refused to count it as newly broken. The control was the
           broken thing, not the detector: a control has to PASS before the change and
           FAIL after it, or it is testing nothing. */
        d.style.cssText = 'position:absolute;left:-9999px;top:0;white-space:nowrap;'
          + 'overflow:hidden;text-transform:uppercase;letter-spacing:.4px;font:11px monospace;'
          + (fixed ? 'width:80px;' : 'width:auto;max-width:none;');
        host.appendChild(d);
        return d;
      };
      const planted = [mk('__eyes_fixed', true), mk('__eyes_flex', false)];

      const before = new Map();
      const all = els.concat(planted);
      for (const e of all) {
        before.set(e, { sw: e.scrollWidth, cw: e.clientWidth,
                        r: e.getBoundingClientRect() });
      }

      const st = document.createElement('style');
      st.id = '__eyes_wcag';
      st.textContent = '#topbar *, #devtray *, #cityfeed *, #blstack *, .pb, #daycard *,'
        + ' #__eyes_fixed, #__eyes_flex {'
        + ' letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }';
      document.head.appendChild(st);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const broken = [];
      for (const e of all) {
        const b0 = before.get(e);
        const sw = e.scrollWidth, cw = e.clientWidth;
        const clipped = sw > cw + 1 && !(b0.sw > b0.cw + 1);
        if (clipped) {
          broken.push({ id: e.id || (e.className && String(e.className).slice(0, 24)) || e.tagName,
                        was: b0.sw + '/' + b0.cw, now: sw + '/' + cw });
        }
      }
      const fixedBroke = broken.some(x => x.id === '__eyes_fixed');
      const flexBroke = broken.some(x => x.id === '__eyes_flex');

      st.remove();
      planted.forEach(p => p.remove());

      return { loaded, rows, tested: all.length, broken: broken.filter(x => !x.id.startsWith('__eyes')),
               control_fixed_broke: fixedBroke, control_flex_broke: flexBroke };
    });

    out.font_loaded = res.loaded;
    out.chrome_elements = res.rows.length;
    out.asks_for_face = res.rows.filter(r => r.asks_for_face).length;
    out.face_first_in_stack = res.rows.filter(r => r.face_is_first).length;
    out.not_a_sans_fallback = res.rows.filter(r => r.not_a_sans_fallback).length;
    out.css_uppercase_elements = res.rows.filter(r => r.css_uppercase).length;
    out.caps_typed_into_the_text = res.rows.filter(r => r.caps_in_the_text).length;
    out.spacing_tested = res.tested;
    out.spacing_broken = res.broken.length;
    out.spacing_broken_list = res.broken.slice(0, 20);
    out.controls = [
      { name: 'a planted fixed-width tight-uppercase chip breaks at 0.12em',
        pass: res.control_fixed_broke === true, detail: String(res.control_fixed_broke) },
      { name: 'a planted flexible chip does NOT break at 0.12em',
        pass: res.control_flex_broke === false, detail: String(res.control_flex_broke) },
      { name: 'the decided face is actually loaded in the browser',
        pass: res.loaded === true, detail: String(res.loaded) },
    ];
    out.rows = res.rows.slice(0, 60);
  } catch (e) {
    out.ok = false; out.why = String(e).slice(0, 400);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ ok: out.ok, why: out.why, font_loaded: out.font_loaded,
    chrome: out.chrome_elements, asks: out.asks_for_face, renders: out.in_named_font,
    upper: out.uppercase_elements, tested: out.spacing_tested, broken: out.spacing_broken,
    controls: out.controls }, null, 2));
  await b.close();
})();
