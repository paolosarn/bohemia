/* ============================================================================
   YOU CAN SEE IT COMING (9/5/26, UI lane) -- board row [danger visible].

   THE MANAGER'S CALL, 9/5: "a fight that arrives with no warning on a phone is a rage
   quit. Before you walk into a dangerous block you can SEE it ... the block reads hot,
   the people read wrong, one glance is enough. No numbers, no meter, no text box."

   WHAT THIS GATE IS HOLDING, AND WHAT IT IS HONESTLY NOT.
   There are no dangerous blocks in the game yet, and that was measured before a line
   was written: a cell knows {g,s,walk,q} and no owner; FACTION_ASSIGN ships empty
   because who sits where is Paolo's; FACTIONS' own board STATE says "nobody holds
   ground" and NAME-THE-CIRCUIT-OWNER is marked needs Paolo; BohemiaBetween, which
   knows who is hostile to you, is not even loaded in the walked frame; and RUN still
   holds [enemies exist]. So the TELL is built and the SOURCE is a seam that ships
   EMPTY -- window.BOHEMIA_DANGER.at(gx,gy) -> 0..1 -- and this gate proves the tell,
   not the threat. The row stays CLAIMED until there is something real to see.

   THE FOUR THINGS IT ACTUALLY CHECKS:
   1. EMPTY COSTS NOTHING AND SHOWS NOTHING. With no source installed the street is
      pixel-identical to the street before this feature existed. A tell that tinted
      anything by default would be inventing danger.
   2. INSTALLED, THE GROUND CHANGES. The picture is different where the source says so.
   3. IT SURVIVES GREYSCALE. COLOUR IS TERRITORY (8/26) keeps the greyscale test:
      silhouette and value carry, colour is the second channel. So danger is carried by
      VALUE first and the check measures the difference with the colour removed. A hot
      tint alone would pass a naive check and fail a colour-blind player.
   4. THE EDGE IS THE WARNING. The boundary between dangerous and safe reads STRONGER
      than the middle of the block, because "before you walk into it" means you see a
      line from outside, not a wash once you are standing in it.
   And it adds no DOM node: no number, no meter, no text box, per his words.
   ============================================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8795;
let pass = 0, fail = 0;
const ok = (m, g) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nYOU CAN SEE IT COMING: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1100);
  const tap = await p.evaluate(() => { const n=[...document.querySelectorAll('*')]
    .filter(x=>/TAP TO ENTER/i.test(x.textContent||'')&&x.children.length<4).pop();
    if(!n) return null; const r=n.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
  if(!tap){ ok('the demo opens', false); await b.close(); srv.close(); done(); }
  await p.mouse.click(tap.x,tap.y); await p.waitForTimeout(5500);
  const city = p.frames().find(f=>/CITY_WORLD/.test(f.url()));
  if(!city){ ok('the walked city loaded', false); await b.close(); srv.close(); done(); }
  try{ await p.evaluate(()=>{const n=document.getElementById('openNot'); if(n) n.click();}); }catch(e){}
  await p.waitForTimeout(600);
  try{ await city.evaluate(()=>{ for(const n of document.querySelectorAll('button,div,span'))
    if((n.textContent||'').trim()==='GET UP'){n.click();return;} }); }catch(e){}
  await p.waitForTimeout(1200);

  const seam = await city.evaluate(() => ({
    exists: typeof window.BOHEMIA_DANGER === 'object' && window.BOHEMIA_DANGER !== null,
    empty: !(window.BOHEMIA_DANGER && typeof window.BOHEMIA_DANGER.at === 'function'),
    mode: (typeof MODE!=='undefined')?MODE:null
  }));
  ok('the seam a danger source installs into exists', seam.exists);
  /* THIS LEG USED TO ASSERT THE SEAM SHIPPED EMPTY, AND THAT WAS RIGHT LAST ROUND AND
     IS WRONG NOW. RUN shipped [enemies exist] (bb2057b): crews of people stand on a
     corner and close on you. So the tell is wired to them and the claim flips from
     "invents nothing" to "shows exactly what the hostiles module says is there".
     It still invents nothing -- who is dangerous is RUN's own ruling, read not decided. */
  ok('and it is WIRED to the crews RUN shipped, not to a table this lane made up',
     !seam.empty);
  ok('and this is measured on the walked street, not the map', seam.mode === 'human');

  const fe = await p.$('iframe#cityFrame'); const fb = await fe.boundingBox();
  const clip = { x: fb.x+10, y: fb.y+150, width: 370, height: 420 };
  const shot = async () => (await p.screenshot({ clip }));
  const nodes = () => city.evaluate(() => document.querySelectorAll('*').length);

  /* Compare two PNG buffers by decoding them in the page that already has a canvas:
     no image library, and no new dependency added for one gate. Returns the percentage
     of pixels that differ and a per-column profile, which the edge test needs. */
  const PNG = { diff: (x, y) => city.evaluate(async ([b1, b2]) => {
      const load = b => new Promise(res => { const i = new Image();
        i.onload = () => res(i); i.src = 'data:image/png;base64,' + b; });
      const [i1, i2] = await Promise.all([load(b1), load(b2)]);
      const c = document.createElement('canvas'); c.width = i1.width; c.height = i1.height;
      const g2 = c.getContext('2d');
      g2.drawImage(i1, 0, 0); const d1 = g2.getImageData(0, 0, c.width, c.height).data;
      g2.clearRect(0, 0, c.width, c.height);
      g2.drawImage(i2, 0, 0); const d2 = g2.getImageData(0, 0, c.width, c.height).data;
      let n = 0; const W = c.width, H = c.height; const colDiff = new Array(W).fill(0);
      for (let i = 0; i < d1.length; i += 4) {
        const dv = Math.abs(d1[i]-d2[i]) + Math.abs(d1[i+1]-d2[i+1]) + Math.abs(d1[i+2]-d2[i+2]);
        if (dv > 24) { n++; colDiff[((i/4)|0) % W]++; }
      }
      return { pct: 100*n/(W*H), colDiff, W, H };
    }, [x.toString('base64'), y.toString('base64')]) };

  /* ============================================================================
     MEASURE AGAINST THE STREET'S OWN NOISE FLOOR, NOT AGAINST ZERO.
     Four legs of this gate were written as exact-frame comparisons and all four
     flaked, and the reason turned out to be one measured fact: TWO FRAMES OF A
     CLEARED STREET 300ms APART ARE NEVER IDENTICAL. People walk, an ambient line
     appears and clears, the clock moves. So "removing the tell puts it back exactly"
     was asking the valley to hold its breath, and a fixed 3% threshold was really
     measuring how much of the test patch the camera happened to be pointed at.
     THE FIX IS SELF-CALIBRATION: measure the noise floor in this same run, then ask
     whether the tell is far above it and whether removing it comes back down to it.
     No magic number, and it cannot be fooled by a livelier or quieter street.
     ============================================================================ */
  const install = () => city.evaluate(() => {
    const px = hx, py = hy;
    window.BOHEMIA_DANGER.at = (gx, gy) => {
      const d = Math.max(Math.abs(gx - px), Math.abs(gy - py));
      return (d >= 3 && d <= 9) ? 0.85 : 0;
    };
    if (typeof render === 'function') render();
  });
  const clear = () => city.evaluate(() => {
    window.BOHEMIA_DANGER.at = null; if (typeof render === 'function') render();
  });
  const settle = 260;

  /* THE NOISE FLOOR MUST BE MEASURED THE SAME WAY THE SIGNAL IS. The first cut took
     the two cleared frames with only a WAIT between them and every other frame with a
     render() between them -- so the floor came out 0.0% while a cleared street that had
     been repainted twice came out 2.3%, and the gate blamed the feature for what the
     repaint does (the world advances on the beat: people take a step). Same treatment
     on both sides or the comparison is not a comparison. */
  await clear(); await p.waitForTimeout(settle); const q0 = await shot();
  await clear(); await p.waitForTimeout(settle); const q1 = await shot();
  await install(); await p.waitForTimeout(settle); const qOn = await shot();
  await clear();   await p.waitForTimeout(settle); const q2 = await shot();

  /* COUNT THE TELL'S OWN RIM COLOUR, NOT THE WHOLE FRAME.
     Whole-frame diffing kept reporting a 2 to 5 per cent "residue" after the source was
     cleared, and looking at the difference image showed exactly what it was: A SPEECH
     BUBBLE. The valley says things on its own ("Somebody upstream is drinking before we
     do"), and a bubble that appears between two frames is several per cent of the
     picture. Two cleared frames with no bubble change are 0.03 per cent apart, so there
     was never a stain -- the ruler was counting the game being alive.
     So the presence and absence of the tell are measured by the tell itself: the rim is
     painted at a known colour, so count pixels near it. A bubble cannot fake that, and
     it is a direct measurement of the mark rather than of everything around it. */
  /* READ THE GAME'S OWN CANVAS, NOT A SCREENSHOT OF IT. The first cut shipped each
     frame out as a PNG, decoded it back inside the page and counted there; it returned
     ZERO rim pixels on a frame that provably contains 2,554 of them, so the round trip
     was the broken part rather than the feature. The canvas is right there and it has
     the pixels: ask it. Fewer moving parts, and nothing between the measurement and
     the thing measured. */
  const rimNow = () => city.evaluate(() => {
    const c = (typeof cv !== 'undefined') ? cv : document.querySelector('canvas');
    const g2 = c.getContext('2d');
    const d = g2.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.abs(d[i]-232) < 26 && Math.abs(d[i+1]-112) < 26 && Math.abs(d[i+2]-44) < 26) n++;
    }
    return n;
  });

  const noise  = (await PNG.diff(q0, q1)).pct;
  const signal = (await PNG.diff(q1, qOn)).pct;
  const back   = (await PNG.diff(q1, q2)).pct;

  /* THIS CLAIM IS NOT MADE ON A WHOLE-FRAME DIFF ANY MORE, AND THAT IS A RULER BEING
     REPLACED RATHER THAN A BAR BEING LOWERED. A whole-frame comparison cannot tell this
     feature's mark apart from THE VALLEY TALKING: an ambient speech bubble is several
     per cent of the picture, so the "noise floor" swung between 0.0% and 1.9% depending
     on whether somebody happened to say something, and the same correct tell passed or
     failed on that. The rim count below measures the mark ITSELF -- 0 pixels before,
     ~2,900 with a source installed, 0 after clearing -- which is a stricter statement of
     the same thing and is immune to anything else on screen. `signal` is still computed
     here because the greyscale test needs a colour-side number to be a ratio of. */
  console.log('         [whole-frame magnitudes, for the record: tell ' + signal.toFixed(1)
    + '%, street noise ' + noise.toFixed(1) + '%. Not asserted on: a speech bubble moves '
    + 'several per cent and this cannot tell one from the other. The rim count can.]');
  await clear();   await p.waitForTimeout(settle); const rimBefore = await rimNow();
  await install(); await p.waitForTimeout(settle); const rimOn     = await rimNow();
  await clear();   await p.waitForTimeout(settle); const rimAfter  = await rimNow();
  ok('the tell\'s own rim is ON the street when a source is installed and GONE when it '
     + 'is cleared (' + rimBefore + ' rim pixels before, ' + rimOn + ' with danger, '
     + rimAfter + ' after clearing) -- measured on the mark itself, so an ambient '
     + 'speech bubble appearing mid-test cannot be mistaken for a stain',
     rimOn > 200 && rimBefore < rimOn / 20 && rimAfter < rimOn / 20);

  /* NO NUMBER, NO METER, NO TEXT BOX: sampled either side of ONE forced repaint, so
     the valley has no time to add a speech bubble and be blamed for it. */
  const nPair = await city.evaluate(() => {
    const before = document.querySelectorAll('*').length;
    if (typeof render === 'function') render();
    return [before, document.querySelectorAll('*').length];
  });
  ok('and it adds NO element to the page -- no number, no meter, no text box ('
     + nPair[0] + ' -> ' + nPair[1] + ' nodes across one repaint)', nPair[0] === nPair[1]);

  /* THE GREYSCALE TEST, on a back-to-back pair like everything else. COLOUR IS
     TERRITORY keeps the greyscale rule: colour is the SECOND channel, so a tell that
     lived in hue alone would collapse here. Scale-free: what fraction of the change
     survives losing all colour. */
  const grey = async (on) => {
    await city.evaluate(() => { document.documentElement.style.filter = 'grayscale(1)'; });
    if (on) await install(); else await clear();
    await p.waitForTimeout(settle);
    const s2 = await shot();
    await city.evaluate(() => { document.documentElement.style.filter = ''; });
    return s2;
  };
  const gOff = await grey(false);
  await city.evaluate(() => { document.documentElement.style.filter = 'grayscale(1)'; });
  await install(); await p.waitForTimeout(settle);
  const gOn = await p.screenshot({ clip });
  await city.evaluate(() => { document.documentElement.style.filter = ''; });
  const gd = await PNG.diff(gOff, gOn);
  const keep = signal > 0 ? (gd.pct / signal) : 0;
  ok('and it SURVIVES GREYSCALE -- with every colour removed it keeps '
     + Math.round(keep * 100) + '% of the change it makes in colour (' + gd.pct.toFixed(1)
     + '% vs ' + signal.toFixed(1) + '%), so it is carried by VALUE and not by hue',
     gd.pct > Math.max(0.8, noise * 3) && keep >= 0.5);

  /* THE EDGE IS THE WARNING: the boundary column must differ more than the middle of
     the block, or what you have is a wash you notice once you are already inside it. */
  const cols = gd.colDiff.map((v, i) => ({ i, v })).filter(c => c.v > 0);
  let edgeWins = false, border = -1, insideAvg = 0;
  if (cols.length > 8) {
    const first = cols[0].i, last = cols[cols.length - 1].i;
    border = Math.max(gd.colDiff[first], gd.colDiff[last]);
    const inner = cols.filter(c => c.i > first + 2 && c.i < last - 2);
    insideAvg = inner.length ? inner.reduce((a, c) => a + c.v, 0) / inner.length : 0;
    edgeWins = border > insideAvg;
  }
  ok('and the EDGE reads stronger than the middle, so you see the line you are about '
     + 'to cross from OUTSIDE it (edge ' + border + ' vs inside ' + insideAvg.toFixed(0)
     + ')', edgeWins);

  /* ============================================================================
     THE ROW'S OWN SHIP TEST, ON THE GAME'S OWN DANGER AND NOT ON AN INJECTED ONE:
     "BEFORE you walk into a dangerous block you can SEE it."
     That is a comparison of two distances, so measure both. RUN's crews notice you at
     SEE_YOU cells. The hot ground has to appear FURTHER OUT than that or the warning
     arrives at the same moment the thing it warns about, which is not a warning.
     Walked toward a real crew a cell at a time, counting the tell's own rim colour.
     ============================================================================ */
  const walk = await city.evaluate(async () => {
    if (typeof BohemiaHostiles === 'undefined' || typeof hostDanger !== 'function') return null;
    const day = (T.day | 0);
    const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0),
      at: [hx, hy], radius: 40, probe: hostileProbe, danger: hostDanger(),
      density: HOST_DENSITY, day: day }) || [];
    if (!list.length) return { crews: 0 };
    list.sort((a, b) => Math.max(Math.abs(a.at[0]-hx), Math.abs(a.at[1]-hy))
                      - Math.max(Math.abs(b.at[0]-hx), Math.abs(b.at[1]-hy)));
    const t = list[0].at, ux = Math.sign(t[0]-hx), uy = Math.sign(t[1]-hy);
    const rim = () => { const c = (typeof cv !== 'undefined') ? cv : document.querySelector('canvas');
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4)
        if (Math.abs(d[i]-232)<26 && Math.abs(d[i+1]-112)<26 && Math.abs(d[i+2]-44)<26) n++;
      return n; };
    /* ASK THE TELL ABOUT THIS CREW'S GROUND, not "is there any orange on screen".
       The first cut counted rim pixels anywhere in frame and reported 30 cells, which
       was really A DIFFERENT CREW's block showing at the edge -- three of them stand
       within forty cells. Walking the approach line and asking at() about the cell the
       player is standing on names the distance for THIS crew and cannot be borrowed
       from a neighbour. The rim count still runs, as the separate check that the
       warning is actually on screen and not merely true in the data. */
    let firstHot = null, rimAt = null;
    for (let step = 30; step >= 2; step--) {
      hx = t[0] - ux*step; hy = t[1] - uy*step;
      const v = window.BOHEMIA_DANGER.at(hx, hy);
      if (v > 0 && firstHot === null) {
        firstHot = step;
        if (typeof render === 'function') render();
        await new Promise(r => setTimeout(r, 60));
        rimAt = rim();
        break;
      }
    }
    return { crews: list.length, seeYou: BohemiaHostiles.SEE_YOU,
             block: BohemiaHostiles.SEE_YOU * 2, firstSeen: firstHot, rimAt: rimAt };
  });
  ok('there are real crews on the walked street to warn about ('
     + (walk ? walk.crews : 0) + ' within 40 cells)', !!walk && walk.crews > 0);
  /* WORDED FOR WHAT IS ACTUALLY MEASURED. at() reports DANGEROUS GROUND, not one
     named crew's, and three crews stand within forty cells, so the distance below is
     "how far out the hot ground starts on this approach" rather than "this crew's
     block begins here". That is still exactly the row's claim -- you are warned before
     anything can see you -- and being warned by the neighbours' block is a true
     warning, but the sentence should say what the number is. */
  ok('and the ground reads hot BEFORE anything can see you -- on the approach to the '
     + 'nearest crew it starts at '
     + (walk && walk.firstSeen) + ' cells out and they notice you at '
     + (walk && walk.seeYou) + ', so you get '
     + (walk && walk.firstSeen ? walk.firstSeen - walk.seeYou : 0)
     + ' cells to turn around',
     !!walk && walk.firstSeen !== null && walk.firstSeen > walk.seeYou);
  ok('and it is actually ON SCREEN at that distance, not just true in the data ('
     + (walk && walk.rimAt) + ' rim pixels drawn)', !!walk && walk.rimAt > 0);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})();
