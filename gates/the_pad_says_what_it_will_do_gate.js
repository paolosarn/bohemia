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
     GLYPH   single arrow -> double arrow (the distance doubled, so the arrow did)
     WEIGHT  the warm walking accent -> the map's cooler line
     FACE    and the wedge under the arrow cools with it

   (THE THIRD ONE USED TO BE "round thumbstick -> square map tile" and it is GONE,
   which I am writing here rather than quietly dropping. The pad was rebuilt on 9/7
   into an SVG ring of wedges and a ring cannot become a square. The rebuild traded
   that signal for the drawn double chevron and kept the meaning on purpose, so the
   count stays at three and the third is a different REAL change, not a softened
   version of the dead one.)

   AND IT HOLDS THE THING THAT MAKES IT A FIX RATHER THAN A DECORATION: the
   change is driven by a REAL SEAM. Measured after a real two-finger pinch, not
   after this gate sets MODE by hand.

   AND IT HOLDS THAT NO CAPTION WAS ADDED. TALK TO HIM LIKE A PERSON: words on
   his screen are a cost, and the wrong fix here is a sentence explaining the
   mismatch instead of removing it.

   node gates/the_pad_says_what_it_will_do_gate.js
   ========================================================================== */
const path = require('path');
const http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const REL = 'slices/BOHEMIA_ALPHA_0_9.html';

/* *** SERVED, BECAUSE file:// IS A BUILD NO PLAYER GETS (9/13, RUN). *** This
   opened the alpha off disk, where the city cannot stream its tile banks at all:
   fetch() REFUSES the file:// scheme outright. This lane measured that on 9/5 and
   fixed COMBAT RUNS the same way this round. A tiny static server over the repo
   root, so every relative path resolves exactly as it does in production. */
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json',
               '.txt': 'text/plain', '.bq': 'text/plain' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(ROOT, rel);
      if (f.indexOf(ROOT) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

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
  const srv = await serve();
  const ALPHA = 'http://127.0.0.1:' + srv.address().port + '/' + REL;
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
    if (!city) { await browser.close(); srv.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1300);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1600);

    /* WHAT HIS EYE ACTUALLY GETS, off computed style rather than off the rule I
       wrote. A CSS rule that never applies is the classic way this claim lies.

       *** REWRITTEN 9/13 (RUN), AND THIS GATE WAS LYING, NOT THE GAME. *** On 9/7
       another lane rebuilt the pad from html buttons into an SVG ring of eight <g>
       wedges, because no font carries all eight arrows in one weight and four came
       out thin inside the same control. This probe was reading borderRadius, width,
       color and textContent off those groups. NONE OF THOSE APPLY TO AN SVG GROUP,
       so it read 0px and empty strings and reported that the pad had stopped saying
       anything. It never stopped: the rebuild kept the meaning deliberately and its
       own comment says so -- "the shape is drawn twice, one triangle for walking,
       two stacked for travelling, and the meaning the other lane built is kept
       exactly."

       SO IT ASKS THE PAD WHAT IT DRAWS. The wedge face is .pseg, the single arrow
       is .parr and the double is .parr2, and .mapmove swaps them in css.

       ONE LEG OF THE ORIGINAL THREE REALLY IS GONE, AND I AM NOT HIDING IT: the
       round thumbstick turning into a square map tile cannot exist on a ring of
       wedges, and the rebuild traded it for the drawn double chevron. So the third
       signal here is a DIFFERENT real change, not a softer version of the dead one:
       the wedge FACE cools as well as the arrow on it. Three things still change at
       once, all three drawn, all three measured off the finished picture. */
    const look = () => city.evaluate(() => {
      const pad = document.getElementById('pad');
      const all = Array.from(pad.querySelectorAll('.pb'));
      const b = all[0];
      const cs = getComputedStyle(b);
      const shown = el => !!el && getComputedStyle(el).display !== 'none';
      const paint = el => { if (!el) return ''; const s = getComputedStyle(el);
        return s.fill + '|' + s.stroke; };
      const seg = b.querySelector('.pseg');
      /* the direction each wedge MEANS, off its own data attribute rather than off
         text it does not have -- the same correction the walk harnesses took */
      const dirs = all.map(x => (x.dataset && x.dataset.walk) || '');
      /* every text node inside the nav, so a caption cannot hide as a sibling */
      const nav = document.getElementById('nav');
      let words = '';
      const walk = n => { if (n.nodeType === 3) words += n.nodeValue; else
        Array.from(n.childNodes).forEach(walk); };
      walk(nav);
      return { mode: MODE, cls: pad.className.baseVal || pad.className || '',
               wedges: all.length,
               singles: all.filter(x => shown(x.querySelector('.parr'))).length,
               doubles: all.filter(x => shown(x.querySelector('.parr2'))).length,
               /* THE ARROW HE CAN SEE, not both of them averaged: the hidden one
                  still reports a colour and that would make the two modes match. */
               arrow: paint(shown(b.querySelector('.parr2'))
                          ? b.querySelector('.parr2') : b.querySelector('.parr')),
               face: paint(seg),
               dirs: dirs,
               navWords: words.replace(/[\s↑-⇙→⇒]/g, '') };
    });

    /* ---- 1. WALKING: a thumbstick ---------------------------------------- */
    const walk = await look();
    ok('in the walked world the pad is the walking ring (' + walk.wedges
      + ' wedges, face ' + walk.face + ')',
      walk.mode === 'human' && walk.wedges === 8 && !/mapmove/.test(walk.cls));
    ok('and every wedge draws ONE arrow (' + walk.singles + ' single, '
      + walk.doubles + ' double)',
      walk.singles === 8 && walk.doubles === 0);
    ok('and all eight say which way they go (' + walk.dirs.slice(0, 3).join('') + ')',
      walk.dirs.filter(Boolean).length === 8);

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
    const glyph = map.doubles === 8 && map.singles === 0;
    const weight = map.arrow !== walk.arrow;
    const face = map.face !== walk.face;
    ok('*** GLYPH: the arrow doubles, because the step it takes is ninety-six '
      + 'metres instead of one *** (' + walk.singles + ' single -> '
      + map.doubles + ' double)', glyph);
    ok('*** WEIGHT: the arrow comes off the warm walking accent onto the map\'s '
      + 'own tint *** (' + walk.arrow + ' -> ' + map.arrow + ')', weight);
    ok('*** FACE: and the wedge under it cools too, so it is not one small mark '
      + 'that changed *** (' + walk.face + ' -> ' + map.face + ')', face);
    ok('*** AND ALL THREE CHANGE AT ONCE, BECAUSE ONE CAN BE MISSED ***',
      glyph && weight && face);

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
    ok('and it turns back into the walking ring when he drops back in ('
      + back.mode + ', ' + back.singles + ' single)',
      back.mode === 'human' && back.singles === walk.singles
      && back.doubles === walk.doubles && back.face === walk.face
      && back.arrow === walk.arrow);

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: walking ' + walk.singles + ' single ' + walk.arrow
      + ' on ' + walk.face + '  ·  map ' + map.doubles + ' double ' + map.arrow
      + ' on ' + map.face + '  ·  back to ' + back.singles + ' single');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  srv.close();
  done();
})();
