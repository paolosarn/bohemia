const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE PAD SAYS WHAT IT IS ABOUT TO DO (8/27/26, RUN lane)

     "how come in the run like it wants to keep spawning me like outside of like
      my starter Neighbourhood it's so confusing"

   YESTERDAY FIXED THE CONSEQUENCE AND LEFT THE CONFUSION. LOOKING AT THE MAP IS
   NOT TRAVELLING stopped a glance from moving his body 194 tiles. He did not say
   "it moved me". He said IT IS CONFUSING, and that is a different defect:

     THE SAME CONTROL, IN THE SAME CORNER, UNDER THE SAME THUMB, LOOKING EXACTLY
     THE SAME, MEANT TWO COMPLETELY DIFFERENT THINGS.
        zoomed in    one tile. About a metre. Free.
        zoomed out   one overmap cell. Ninety-six metres. TEN MINUTES of his day,
                     and since this turn a road encounter that can eat twenty more.

   Norman's split is the one that applies: an AFFORDANCE is what a control can do,
   a SIGNIFIER is what it tells you it will do. The affordance changed at the seam
   and the signifier never did.

   SO THIS GATE HOLDS THREE SIGNALS, NOT ONE, because one can be missed:
     SHAPE   round thumbstick -> square map tile
     GLYPH   single arrow -> double arrow (the distance doubled, so the arrow did)
     WEIGHT  the warm walking accent -> the map's cooler line

   AND IT HOLDS THE THING THAT MAKES IT A FIX RATHER THAN A DECORATION: the
   change is driven by a REAL SEAM. Measured after a real two-finger pinch, not
   after this gate sets MODE by hand.

   AND IT HOLDS THAT NO CAPTION WAS ADDED. TALK TO HIM LIKE A PERSON: words on
   his screen are a cost, and the wrong fix here is a sentence explaining the
   mismatch instead of removing it.

   node gates/the_pad_says_what_it_will_do_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE PAD SAYS WHAT IT WILL DO: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                         hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1300);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1600);

    /* WHAT HIS EYE ACTUALLY GETS, off computed style rather than off the rule I
       wrote. A CSS rule that never applies is the classic way this claim lies. */
    const look = () => city.evaluate(() => {
      const pad = document.getElementById('pad');
      const b = pad.querySelector('.pb');
      const cs = getComputedStyle(b);
      const glyphs = Array.from(pad.querySelectorAll('.pb')).map(x => x.textContent);
      /* every text node inside the nav, so a caption cannot hide as a sibling */
      const nav = document.getElementById('nav');
      let words = '';
      const walk = n => { if (n.nodeType === 3) words += n.nodeValue; else
        Array.from(n.childNodes).forEach(walk); };
      walk(nav);
      return { mode: MODE, radius: cs.borderRadius, w: cs.width,
               border: cs.borderColor, color: cs.color, glyphs: glyphs,
               navWords: words.replace(/[\s↑-⇙→⇒]/g, ''),
               cls: pad.className };
    });

    /* ---- 1. WALKING: a thumbstick ---------------------------------------- */
    const walk = await look();
    ok('in the walked world the pad is a round thumbstick (' + walk.radius + ')',
      walk.mode === 'human' && /50%|21px|22px/.test(walk.radius));
    ok('and its arrows are single (' + walk.glyphs.slice(0, 3).join('') + ')',
      walk.glyphs.filter(g => g === '↑' || g === '→' || g === '↓'
        || g === '←').length >= 4);

    /* ---- 2. A REAL PINCH, NOT A SET OF MODE ------------------------------ */
    /* *** THE WHOLE POINT IS THE SEAM. *** Setting MODE by hand would prove the
       CSS exists and prove nothing about whether his gesture reaches it. Real
       touch, because hand-made PointerEvents make setPointerCapture throw. */
    const cdp = await ctx.newCDPSession(page);
    const box = await (await city.$('#cv')).boundingBox();
    const px = box.x + box.width / 2, py = box.y + box.height / 2;
    const touch = (type, sep) => cdp.send('Input.dispatchTouchEvent', { type,
      touchPoints: sep === null ? [] : [{ x: px - sep / 2, y: py, id: 1 },
                                        { x: px + sep / 2, y: py, id: 2 }] });
    async function pinch(dir, steps) {
      let sep = dir > 0 ? 300 : 40;
      await touch('touchStart', sep);
      for (let i = 0; i < steps; i++) {
        sep = dir > 0 ? Math.max(16, sep * 0.84) : Math.min(340, sep * 1.19);
        await touch('touchMove', sep);
        await new Promise(r => setTimeout(r, 32));
      }
      await touch('touchEnd', null);
      await new Promise(r => setTimeout(r, 250));
    }
    await pinch(1, 14); await SETTLE(page, 900);
    const map = await look();
    ok('a real pinch out reaches the map (' + map.mode + ')', map.mode === 'city');

    /* ---- 3. THREE SIGNALS, ALL OF THEM ---------------------------------- */
    const shape = map.radius !== walk.radius;
    const glyph = map.glyphs.filter(g => g === '⇑' || g === '⇒'
      || g === '⇓' || g === '⇐').length >= 4;
    const weight = map.border !== walk.border || map.color !== walk.color;
    ok('*** SHAPE: the thumbstick becomes a map tile *** (' + walk.radius + ' -> '
      + map.radius + ')', shape);
    ok('*** GLYPH: the arrow doubles, because the step it takes is ninety-six '
      + 'metres instead of one *** (' + walk.glyphs.slice(0, 3).join('') + ' -> '
      + map.glyphs.slice(0, 3).join('') + ')', glyph);
    ok('*** WEIGHT: it comes off the warm walking accent onto the map\'s line *** ('
      + walk.color + ' -> ' + map.color + ')', weight);
    ok('*** AND ALL THREE CHANGE AT ONCE, BECAUSE ONE CAN BE MISSED ***',
      shape && glyph && weight);

    /* ---- 4. AND NO CAPTION WAS ADDED ------------------------------------ */
    /* The wrong fix is a sentence explaining the mismatch. TALK TO HIM LIKE A
       PERSON: words on his screen are a cost, and this is a signifier problem. */
    ok('no caption was bolted on to explain it ("' + map.navWords.slice(0, 40)
      + '" vs "' + walk.navWords.slice(0, 40) + '")',
      map.navWords.length <= walk.navWords.length + 2);

    /* ---- 5. AND IT COMES BACK ------------------------------------------- */
    /* A one-way signifier is a bug of its own: he would walk the rest of the
       session looking at a map pad while actually stepping one tile at a time. */
    await pinch(-1, 14); await SETTLE(page, 900);
    await pinch(-1, 14); await SETTLE(page, 900);
    const back = await look();
    ok('and it turns back into a thumbstick when he drops back in ('
      + back.mode + ', ' + back.radius + ')',
      back.mode === 'human' && back.radius === walk.radius
      && back.glyphs.join('') === walk.glyphs.join(''));

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: walking ' + walk.radius + ' ' + walk.glyphs.slice(0, 4).join('')
      + ' ' + walk.color + '  ·  map ' + map.radius + ' ' + map.glyphs.slice(0, 4).join('')
      + ' ' + map.color + '  ·  back to ' + back.radius);
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
