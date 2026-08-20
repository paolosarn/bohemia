/* ============================================================================
   LIGHT GATE (8/3/26)

   Paolo 8/3: "you're called the art direction chat and you're not doing a lot of
   art directing. You're kind of just like putting art in places. I can't even
   see it like what's wrong with you"

   He was right and the measurement said so. The play area of a real screenshot,
   chrome cropped off, before any of this:

       VALUE RANGE     110 of 255
       COOL PIXELS     0.0%
       CONTRAST SD     32.5

   The brightest thing in the game was mid grey, every pixel in the frame was the
   same colour temperature, and nothing in the world cast a shadow. A week of
   texture work had been going into a picture that had no LIGHT in it, which is
   why none of it read. Two things fix that and this gate holds both:

     THE LOOK  -- one tone curve and one split-tone over every world tile, so the
                  frame uses the screen and the shadows are lit by the SKY.
     THE SUN   -- every solid mass throws a cast shadow onto the ground, so a
                  building sits ON the dirt instead of like a sticker on paper.

   THREE FAILURES THIS EXISTS TO PREVENT, all of which already happened once:

   1. A SPLIT-TONE THAT CANNOT CHANGE A HUE. The first cut ran a per-CHANNEL LUT:
      each channel was split-toned by its OWN value. The source art is r >> b
      everywhere, so red got the highlight boost and blue got the shadow boost in
      the same pixel and the hue never moved. Measured cool pixels: 0.0% before,
      0.0% after. It looked like a working feature and was a no-op. The split has
      to be keyed on the PIXEL'S LUMINANCE, and it has to be a blend TOWARD a
      colour -- a per-channel multiply cannot put blue on top of red, ever. Same
      lesson as the 8/2 perimeter cap, where only a blend-toward-target worked.

   2. A SUN POINTING THE WRONG WAY. Every cooked tile in this repo is lit from the
      upper LEFT (SKIN_LIGHT: end_l 1.12 sunlit, end_r 0.86 shaded). A cast shadow
      at any other angle lands on the lit side of every wall in the game.

   3. A CACHE KEYED ON src.length. look() memoises a graded canvas per image. The
      first key was src.length, which collides the moment two tiles of the same
      size encode to the same number of bytes -- with hundreds of 44x44 PNGs that
      is not hypothetical, and it swaps one wall for another while looking like a
      world bug rather than a cache bug.

   AND IT MEASURES ON THE REAL SURFACE (7/18 law). The source checks above can all
   pass on a feature that draws nothing. So this walks out the front door of the
   shipped run, shoots the same standing frame twice with the light off and on,
   and asserts the picture actually changed -- range, contrast, temperature, and a
   non-zero count of ground cells in shadow.

     node gates/light_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEV = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

const dev = fs.readFileSync(DEV, 'utf8');
const run = fs.readFileSync(RUN, 'utf8');

/* ==== 1. THE LOOK IS THERE, IN BOTH THE SOURCE AND THE THING HE PLAYS ====== */
ok('LOOK exists in the dev slice', /var LOOK\s*=\s*\{/.test(dev));
ok('LOOK ships in the built run',  /var LOOK\s*=\s*\{/.test(run));
ok('LOOK is ON (a grade nobody sees is not a grade)', /var LOOK[\s\S]{0,120}?on:\s*true/.test(run));

/* ==== 2. THE SPLIT IS KEYED ON LUMINANCE, NOT PER-CHANNEL ================= */
/* the dead form: three separate LUTs, each split-toned by its own channel value */
ok('the dead per-channel split-tone LUT is GONE (it could not move a hue)',
   !/LOOK\.lo\[0\]\s*\+\s*\(LOOK\.hi\[0\]/.test(run));
ok('the split reads the PIXEL\'S OWN LUMINANCE', /var lum\s*=\s*\(r\s*\*\s*\d+/.test(run));
ok('the shadow is a BLEND TOWARD THE SKY, not a multiply',
   /r\s*\+=\s*\(kr\s*-\s*r\)\s*\*\s*a/.test(run));
ok('the highlight is a BLEND TOWARD THE SUN, not a multiply',
   /r\s*\+=\s*\(nr\s*-\s*r\)\s*\*\s*s/.test(run));

/* the sky must actually BE cool and the sun must actually BE warm, as colours */
const sky = (run.match(/sky:\s*\[\s*(\d+),\s*(\d+),\s*(\d+)/) || []).slice(1).map(Number);
const sun = (run.match(/sun:\s*\[\s*(\d+),\s*(\d+),\s*(\d+)/) || []).slice(1).map(Number);
ok('the SKY colour is blue (b > r), which is what a shadow is lit by',
   sky.length === 3 && sky[2] > sky[0] + 30);
ok('the SUN colour is warm (r > b), which is what a lit face gets',
   sun.length === 3 && sun[0] > sun[2] + 30);
const skyAmt = parseFloat((run.match(/skyAmt:\s*([\d.]+)/) || [])[1]);
ok('the sky reaches far enough into the darks to be seen (skyAmt >= 0.20)',
   skyAmt >= 0.20);

/* ==== 3. THE CACHE CANNOT COLLIDE ========================================= */
ok('look() no longer keys its cache on src.length',
   !/var key\s*=\s*im\.src\.length/.test(run));
ok('look() keys on a stamped id unique to the image object',
   /im\.__lookId\s*\|\|\s*\(im\.__lookId\s*=\s*\+\+_lookId\)/.test(run));

/* ==== 4. NO RESAMPLE. The grade is a per-pixel transform on a canvas the SAME
   size as the source, then blitted at integer scale like everything else. ==== */
ok('the graded canvas is the source\'s exact size (no resample)',
   /c\.width\s*=\s*im\.naturalWidth;\s*c\.height\s*=\s*im\.naturalHeight/.test(run));
ok('the graded canvas keeps smoothing off',
   /getContext\('2d'\);\s*g\.imageSmoothingEnabled\s*=\s*false/.test(run));

/* ==== 5. THE SUN, AND WHICH WAY IT POINTS ================================= */
ok('SUN exists in the dev slice', /var SUN\s*=\s*\{/.test(dev));
ok('SUN ships in the built run',  /var SUN\s*=\s*\{/.test(run));
ok('SUN is ON', /var SUN[\s\S]{0,80}?on:\s*true/.test(run));
/* THE ONE THAT MATTERS: the art is lit from the upper LEFT, so the shadow falls
   DOWN AND RIGHT, so the caster is looked for UP AND LEFT of the receiver. */
ok('the caster is looked for UP-LEFT, so the shadow falls DOWN-RIGHT',
   /sunSolid\(gx\s*-\s*d\s*,\s*gy\s*-\s*d\)/.test(run));
ok('the art it must agree with is still lit from the upper left',
   /SKIN_LIGHT\s*=\s*\{[^}]*wall_end_l:\s*1\.\d+[^}]*wall_end_r:\s*0\.\d+/.test(run));

const reach = parseInt((run.match(/reach:\s*(\d+)/) || [])[1], 10);
ok('the shadow is at least two cells long, so the step IS a penumbra', reach >= 2);
const step = (run.match(/step:\s*\[([^\]]+)\]/) || [])[1];
const steps = step ? step.split(',').map(s => parseFloat(s)) : [];
ok('the shadow has ' + reach + ' strengths for ' + reach + ' cells', steps.length === reach);
ok('the shadow gets WEAKER with distance, never stronger',
   steps.length > 1 && steps.every((v, i) => i === 0 || v < steps[i - 1]));
ok('the near shadow is strong enough to see (>= 0.35)', steps[0] >= 0.35);
ok('the far shadow does not reach zero (there would be no second step)', steps[reach - 1] > 0.05);

/* a shadow is the ground lit by the sky: darker AND cooler, texture intact. A black
   wash would erase the very tiles he paid for, which is the whole point of them. */
const tint = (run.match(/tint:\s*'rgb\((\d+),(\d+),(\d+)\)'/) || []).slice(1).map(Number);
ok('the shadow tint is COOL (b > r), not a black wash',
   tint.length === 3 && tint[2] > tint[0] + 20);
ok('the shadow tint keeps the texture (never darker than half)',
   tint.length === 3 && Math.min.apply(null, tint) >= 100);
ok('the shadow is a multiply, so his bought texture survives it',
   /globalCompositeOperation\s*=\s*'multiply'/.test(run));

/* ==== 6. WHAT THROWS ONE, AND WHAT DOES NOT =============================== */
ok('a caster is anything the occupancy layer calls solid or structure',
   /function sunSolid[\s\S]{0,240}LAYERG\[gy\]\[gx\]\s*===\s*'structure'/.test(run));
ok('a caster is not also a receiver', /if\(sunSolid\(gx,gy\)\)\s*continue/.test(run));
ok('the shadow pass is exterior only', /if\(mode!=='ext'\|\|!SUN\.on\)\s*return/.test(run));
/* the shadow is GROUND lighting: it goes down before the bodies and the overlays,
   never over the top of the character standing in it */
const iSun = run.indexOf("ctx.globalCompositeOperation='multiply'");
const iFade = run.indexOf('var fade=[], doorOver=null');
const iBodies = run.indexOf('__RUN_PPL_DRAWN');
ok('the shadow lands before the bodies do', iSun > 0 && iBodies > iSun);
ok('the shadow lands after the ground it falls on', iSun > iFade && iFade > 0);

/* ==== 7. EVERY WORLD TILE GOES THROUGH THE GRADE ========================== */
const looks = (run.match(/look\(/g) || []).length;
ok('every world draw site is graded (' + looks + ' look() sites, >= 11)', looks >= 11);

/* ========================================================================== */
/* ==== 8. AND IT IS TRUE ON THE SURFACE HE ACTUALLY SEES ================== */
/* Everything above can pass on a feature that draws nothing. This walks out the
   front door of the shipped run and measures the picture. */

function bfs(passable, from, to) {
  const H = passable.length, W = passable[0].length, key = (x, y) => x + ',' + y;
  const prev = new Map([[key(from[0], from[1]), null]]);
  const q = [from], D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to[0] && y === to[1]) break;
    for (const [dx, dy] of D) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || !passable[ny][nx]) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  const out = []; let cur = key(to[0], to[1]);
  if (!prev.has(cur)) return out;
  let node = to;
  while (prev.get(cur)) { const p = prev.get(cur); out.unshift([node[0] - p[0], node[1] - p[1]]); node = p; cur = key(p[0], p[1]); }
  return out;
}

/* THE FRAME, AS AN EYE SEES ONE, read off the real canvas rather than off a PNG:
   how much of the screen it uses, how much it varies, and whether there is more
   than one colour temperature in it. Measured in the page so this needs nothing
   installed and reads exactly the pixels he is looking at. */
const MEASURE = function(){
  const c=document.getElementById('cv');
  const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  const n=c.width*c.height, lum=new Float64Array(n);
  let warm=0, cool=0, sum=0;
  for(let i=0,j=0;i<d.length;i+=4,j++){
    const r=d[i],g=d[i+1],b=d[i+2];
    const L=r*0.299+g*0.587+b*0.114; lum[j]=L; sum+=L;
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
    if(mx===0||(mx-mn)/mx<0.06) continue;
    if(r===mx&&b===mn) warm++; else if(b===mx&&r===mn) cool++;
  }
  const s=Array.prototype.slice.call(lum).sort((a,b)=>a-b);
  const mean=sum/n; let v=0; for(let j=0;j<n;j++){ const e=lum[j]-mean; v+=e*e; }
  return { range:s[Math.floor(n*0.95)]-s[Math.floor(n*0.05)], sd:Math.sqrt(v/n),
           cool:100*cool/n, warm:100*warm/n };
};

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  let died = null;
  p.on('pageerror', e => { died = e.message; });
  await p.goto('file://' + RUN);
  await p.waitForFunction(() => window.__RUN && window.__RUN.state, null, { timeout: 60000 });
  await SETTLE(p, 4000);
  for (let i = 0; i < 3; i++) { await p.mouse.click(195, 620); await SETTLE(p, 700); }

  const home = await p.evaluate(() => {
    const i = window.__RUN.interior(), s = window.__RUN.state();
    if (!i) return null;
    const d = i.door;
    return { pass: i.pass, at: [s.px, s.py],
             door: d ? (d.x !== undefined ? [d.x, d.y] : [d[0], d[1]]) : null };
  });
  const KEY = { '1,0': 'ArrowRight', '-1,0': 'ArrowLeft', '0,1': 'ArrowDown', '0,-1': 'ArrowUp' };
  if (home && home.door) {
    for (const s of bfs(home.pass, home.at, home.door)) {
      await p.keyboard.press(KEY[s[0] + ',' + s[1]]); await SETTLE(p, 45);
      if ((await p.evaluate(() => window.__RUN.state().mode)) !== 'int') break;
    }
    for (let i = 0; i < 8; i++) {
      const c = await p.evaluate(() => window.__RUN.state());
      if (c.mode !== 'int') break;
      const dx = Math.sign(home.door[0] - c.px), dy = Math.sign(home.door[1] - c.py);
      await p.keyboard.press(dx ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
                                : (dy > 0 ? 'ArrowDown' : dy < 0 ? 'ArrowUp' : 'ArrowDown'));
      await SETTLE(p, 520);
    }
  }
  for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowDown'); await SETTLE(p, 140); }
  await SETTLE(p, 1000);

  const st = await p.evaluate(() => window.__RUN.state());
  ok('the shot is OUTSIDE, where the world is (a bedroom proves nothing)', st.mode !== 'int');

  /* HOW MANY GROUND CELLS ARE ACTUALLY IN SHADOW right now, asked of the game's
     own functions rather than of a picture */
  const shade = await p.evaluate(() => {
    const s = window.__RUN.state(); let solid = 0, sh = 0;
    for (let y = s.py - 9; y <= s.py + 9; y++) for (let x = s.px - 5; x <= s.px + 5; x++) {
      if (y < 0 || x < 0 || !SOLIDG[y] || x >= SOLIDG[y].length) continue;
      if (sunSolid(x, y)) { solid++; continue; }
      for (let d = 1; d <= SUN.reach; d++) if (sunSolid(x - d, y - d)) { sh++; break; }
    }
    return { solid: solid, sh: sh };
  });
  ok('there are buildings in the test frame at all (' + shade.solid + ')', shade.solid > 10);
  ok('and they are throwing shadows onto the ground (' + shade.sh + ' cells)', shade.sh > 0);

  async function frame(on) {
    await p.evaluate((v) => {
      LOOK.on = v; SUN.on = v; _lookLut = null;
      for (const k in _looked) delete _looked[k];
      for (const k2 in _skinLit) delete _skinLit[k2];
      try { draw(); } catch (_e) {}
    }, on);
    await SETTLE(p, 900);
    await p.evaluate(() => { try { draw(); } catch (_e) {} });
    await SETTLE(p, 300);
    return await p.evaluate(MEASURE);
  }
  const A = await frame(false), B = await frame(true);
  await b.close();

  ok('the run did not throw while being lit' + (died ? ' (' + died + ')' : ''), !died);

  {
    console.log('  UNLIT  range ' + A.range.toFixed(0) + '  sd ' + A.sd.toFixed(1) +
                '  warm ' + A.warm.toFixed(1) + '%  cool ' + A.cool.toFixed(1) + '%');
    console.log('  LIT    range ' + B.range.toFixed(0) + '  sd ' + B.sd.toFixed(1) +
                '  warm ' + B.warm.toFixed(1) + '%  cool ' + B.cool.toFixed(1) + '%');
    /* THE THREE NUMBERS THE COMPLAINT WAS ABOUT */
    ok('the frame uses MORE of the screen than it did (' +
       A.range.toFixed(0) + ' -> ' + B.range.toFixed(0) + ', +20 needed)', B.range - A.range >= 20);
    ok('the frame has MORE contrast in it (' +
       A.sd.toFixed(1) + ' -> ' + B.sd.toFixed(1) + ', +4 needed)', B.sd - A.sd >= 4);
    ok('THERE IS SKY IN THE SHADOWS: cool pixels ' +
       A.cool.toFixed(1) + '% -> ' + B.cool.toFixed(1) + '% (>= 2.5% needed)', B.cool >= 2.5);
    /* and it is still a DESERT: the sun did not get graded out of it */
    ok('it is still a warm world (' + B.warm.toFixed(1) + '% warm, > 50% needed)', B.warm > 50);
  }

  console.log((fail ? 'FAIL' : 'PASS') + ': light gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();
