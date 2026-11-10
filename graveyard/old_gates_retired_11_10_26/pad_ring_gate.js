/* ============================================================================
   THE PAD IS ONE RING, CUT (9/7/26, UI lane 11) -- VAMILY [pad broken].

   *** PAOLO 9/7, from his own frame (records/target/PAOLO_THE_PAD_IS_BROKEN_9_7_26.jpg)
   and then his own pick off the ring sheet: "I want 1." *** His words on the shape:
   "I want the action button to be only surrounded by one other circle, and that circle
   is cut into how many parts of the directions that we need. I don't want them to be
   independent circles. Like a circle outside of a circle."

   THE ROW SAID: do not ship another pad without a gate that checks it on the real page.
   So this is that gate, and it checks the four things his frame showed broken:
     1. ONE RING, not loose pieces -- every direction is a segment of a single svg.
     2. THE FACE IS THE MIDDLE -- the action button's centre sits on the ring's centre,
        at FULL SIZE AND AT HALF SIZE. Half size is where it broke: the face was pinned
        at a fixed 50px offset inside a box that became 90 wide, so it walked into the
        bottom-right corner. That is the exact failure in his photograph.
     3. NOTHING OVERLAPS -- no two direction segments share a pixel.
     4. IT STILL WALKS HIM -- press a segment on a phone viewport and the player moves.
   Every one of them is asked on the shipped page in a 390x844 phone, not on a mock.

     node gates/pad_ring_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8811;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nTHE PAD IS ONE RING: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

const cityFrame = p => p.frames().find(f => /CITY_WORLD/.test(f.url()));
const ready = async (p, ms) => { const t0 = Date.now();
  for (;;) { const c = cityFrame(p);
    if (c) { try { if (await c.evaluate(() => !!window.BOHEMIA_FORETOLD)) return c; } catch (_e) {} }
    if (Date.now() - t0 > (ms || 60000)) return c || null;
    await p.waitForTimeout(250); } };

/* THE MEASUREMENT IS THE SAME AT BOTH SIZES, which is the only way half size can be
   held to the same standard as full size instead of being given its own softer one. */
const measure = () => {
  const segs = [...document.querySelectorAll('.pb')].map(n => {
    const r = n.getBoundingClientRect();
    return { w: n.dataset.walk, svg: n.namespaceURI === 'http://www.w3.org/2000/svg',
             root: (n.ownerSVGElement || {}).id || null,
             l: r.left, t: r.top, r: r.right, b: r.bottom, cx: r.left + r.width/2,
             cy: r.top + r.height/2, W: r.width, H: r.height };
  });
  const m = document.getElementById('mode'), n = document.getElementById('nav');
  const mr = m ? m.getBoundingClientRect() : null, nr = n ? n.getBoundingClientRect() : null;
  return { segs,
    face: mr ? { cx: mr.left + mr.width/2, cy: mr.top + mr.height/2, W: mr.width, H: mr.height } : null,
    nav:  nr ? { cx: nr.left + nr.width/2, cy: nr.top + nr.height/2, W: nr.width, H: nr.height } : null };
};

async function look(b, half) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2,
                                   isMobile:true, hasTouch:true });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0,140)));
  await pg.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await pg.waitForTimeout(1200);
  await pg.mouse.click(195, 509);
  const c = await ready(pg);
  if (!c) { await ctx.close(); return { err:'no city' }; }
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); });
  await c.evaluate(() => { try { cardHide(); } catch(_e){} });
  if (!half) await c.evaluate(() => window.BOHEMIA_HALF && window.BOHEMIA_HALF.off());
  await pg.waitForTimeout(900);

  const on  = await c.evaluate(() => !!(window.BOHEMIA_HALF && window.BOHEMIA_HALF.on()));
  const got = await c.evaluate(measure);
  const overlap = await c.evaluate(OVERLAP_PROBE);

  /* AND THEN THE ONLY QUESTION THAT SETTLES ANYTHING: press it, did he move. Three
     harnesses lied about this pad in one round ([half size]), every one of them by
     comparing coordinates to coordinates. So: read where he is standing, hold a
     segment the way a thumb holds it, read again. */
  const posOf = () => c.evaluate(() => {
    try { const q = window.__proof && window.__proof.getPos ? window.__proof.getPos() : null;
      return q ? (q.hx + ',' + q.hy) : null; } catch(_e){ return null; } });
  const fr = await c.frameElement().then(h => h.boundingBox()).catch(() => ({x:0,y:0}));

  /* *** AND IT PRESSES ALL EIGHT, NOT ONE. *** The picture showed the lower segments
     sitting over the frame's dark band, which is exactly the shape of a bug you cannot
     see: seven directions that walk and one that is decoration.

     BUT "DID HE MOVE" IS THE WRONG QUESTION TO ASK OF A BUTTON, AND THIS GATE FOUND
     THAT OUT BY BEING WRONG ONCE. On a re-run against a moved main it reported the ↘
     segment dead while every other run had eight of eight. Nothing about the pad had
     changed: he had simply walked into something solid by the eighth press, and a man
     pushed against a wall does not move however honest the button is. So the two
     questions are separated, because they are two questions:
        DID THE GAME RECEIVE THE PRESS -- read `held`, which startHold sets to the
        direction index. That is the button working, and it is asked of all eight.
        DID HE MOVE -- reported, and held to a floor rather than a demand, because the
        map is allowed to have walls in it. */
  const dirIdx = { '↑':0,'↗':1,'→':2,'↘':3,'↓':4,'↙':5,'←':6,'↖':7 };
  const deaf = [], dead = [], live = [];
  let before = null, after = null;
  for (const seg of got.segs) {
    const was = await posOf();
    await pg.mouse.move(fr.x + seg.cx, fr.y + seg.cy);
    await pg.mouse.down();
    await pg.waitForTimeout(400);
    const heard = await c.evaluate(() => {
      try { return typeof held !== 'undefined' ? held : null; } catch (_e) { return null; } });
    await pg.waitForTimeout(1100); await pg.mouse.up();
    await pg.waitForTimeout(500);
    const now = await posOf();
    if (heard !== dirIdx[seg.w]) deaf.push(seg.w + '(' + heard + ')');
    if (was === null || now === null || was === now) dead.push(seg.w); else live.push(seg.w);
    if (seg.w === '→') { before = was; after = now; }
  }
  await ctx.close();
  return { on, ...got, overlap, deaf, dead, live, before, after, errs };
}

/* *** A BOUNDING BOX IS THE WRONG INSTRUMENT FOR A PIE SLICE, AND THIS GATE SAID SO
   ABOUT ITSELF BEFORE IT SAID IT ABOUT THE PAD. *** The first cut of this check
   compared the eight bounding rectangles and reported eight overlaps on a ring whose
   segments do not touch: the box around a wedge contains most of its neighbours'
   wedges too, so the rectangle answers a question nobody asked. That is the same class
   of lie the [half size] round hit three times in a row -- a measurement disagreeing
   with the thing itself -- so the test asks the SHAPES: for a grid of points across the
   ring, is this point painted by more than one segment. isPointInFill is the browser's
   own answer about its own geometry, and it cannot be fooled by a box. */
const OVERLAP_PROBE = () => {
  const segs = [...document.querySelectorAll('.pb')];
  const svg = segs.length ? segs[0].ownerSVGElement : null;
  if (!svg) return { err: 'no svg' };
  const paths = segs.map(g => ({ w: g.dataset.walk, p: g.querySelector('.pseg') }));
  const pt = svg.createSVGPoint();
  const bad = {}; let probed = 0, painted = 0;
  for (let x = 0; x <= 180; x += 2) for (let y = 0; y <= 180; y += 2) {
    pt.x = x; pt.y = y; probed++;
    const hits = paths.filter(o => o.p && o.p.isPointInFill(pt)).map(o => o.w);
    if (hits.length) painted++;
    if (hits.length > 1) bad[hits.join('/')] = (bad[hits.join('/')] || 0) + 1;
  }
  return { probed, painted, pairs: Object.keys(bad) };
};

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const full = await look(b, false);
  const half = await look(b, true);
  await b.close(); srv.close();

  ok('the walked city is up to look at the pad on a phone', !full.err && !half.err);
  if (full.err || half.err) done();

  for (const [name, v] of [['FULL SIZE', full], ['HALF SIZE', half]]) {
    console.log('\n  --- ' + name + ' (halving ' + (v.on ? 'on' : 'off') + ') ---');
    console.log('    ring box   ' + Math.round(v.nav.W) + 'x' + Math.round(v.nav.H));
    console.log('    face       ' + Math.round(v.face.W) + 'x' + Math.round(v.face.H)
      + '  off centre by ' + Math.abs(v.face.cx - v.nav.cx).toFixed(1) + ','
      + Math.abs(v.face.cy - v.nav.cy).toFixed(1) + ' px');
    console.log('    segments   ' + v.segs.length
      + (v.segs.length ? '  (one svg: ' + (v.segs.every(s => s.svg && s.root && s.root === v.segs[0].root)) + ')' : ''));

    /* 1. ONE RING. Not "eight things arranged in a circle" -- ONE shape they are all
          cut out of, which is the whole of what he asked for. */
    ok(name + ': every direction is a segment of ONE ring, not its own loose circle',
       v.segs.length === 8 && v.segs.every(s => s.svg && s.root && s.root === v.segs[0].root));

    /* 2. THE FACE IS THE MIDDLE. The tolerance is 2px, not "roughly": in his frame the
          face was ~25px out at half size, in a 90px box. */
    const offx = Math.abs(v.face.cx - v.nav.cx), offy = Math.abs(v.face.cy - v.nav.cy);
    ok(name + ': the action button sits in the CENTRE of the ring ('
       + offx.toFixed(1) + ',' + offy.toFixed(1) + ' px off)', offx <= 2 && offy <= 2);

    /* 3. THE FACE IS INSIDE THE RING, not next to it. */
    const inside = v.face.cx > v.nav.cx - v.nav.W/2 && v.face.cx < v.nav.cx + v.nav.W/2
                && v.face.cy > v.nav.cy - v.nav.H/2 && v.face.cy < v.nav.cy + v.nav.H/2
                && v.face.W < v.nav.W && v.face.H < v.nav.H;
    ok(name + ': the face is inside the ring, and smaller than it', inside);

    /* 4. NOTHING OVERLAPS -- asked of the shapes, not of their boxes. */
    console.log('    painted    ' + v.overlap.painted + ' of ' + v.overlap.probed + ' probes land on the ring');
    ok(name + ': no two directions lie on top of each other'
       + (v.overlap.pairs.length ? ' -- ' + v.overlap.pairs.slice(0,4).join(' ') : '')
       + ' (' + v.overlap.painted + ' painted probes)',
       v.overlap.pairs.length === 0 && v.overlap.painted > 200);

    /* 5. ALL EIGHT DIRECTIONS ARE THERE, ONE EACH. His frame had two pointing the
          same way and one where the face should have been. */
    const dirs = v.segs.map(s => s.w).sort().join('');
    ok(name + ': all eight directions are present, one each (' + dirs + ')',
       new Set(v.segs.map(s => s.w)).size === 8);

    /* 6. AND EVERY ONE OF THEM IS A REAL BUTTON. */
    console.log('    presses    ' + (v.segs.length - v.deaf.length) + ' of ' + v.segs.length
      + ' reach the game, ' + v.live.length + ' of ' + v.segs.length + ' move him'
      + (v.deaf.length ? '   NOT HEARD: ' + v.deaf.join(' ') : ''));
    ok(name + ': *** EVERY SEGMENT DELIVERS ITS OWN DIRECTION TO THE GAME, ALL EIGHT *** ('
       + (v.segs.length - v.deaf.length) + '/' + v.segs.length
       + (v.deaf.length ? ', not heard: ' + v.deaf.join(' ') : '') + ')', v.deaf.length === 0);
    ok(name + ': and pressing them actually walks him (' + v.live.length + '/' + v.segs.length
       + '; east ' + v.before + ' -> ' + v.after + '). A wall is allowed to stop a step, so '
       + 'this is a floor, not a demand -- the line above is the one about the button',
       v.live.length >= 5);
  }

  ok('the halving really is on for the half-size half of this gate', half.on === true);
  ok('and really off for the full-size half, so the two columns are different pictures',
     full.on === false);

  /* AND THE RING SHRINKS AS ONE THING. The old pad had eleven numbers that each had to
     be halved by hand and did not stay in step; a viewBox has one. */
  const ratio = half.nav.W / full.nav.W, fratio = half.face.W / full.face.W;
  console.log('\n  ring ' + ratio.toFixed(3) + 'x, face ' + fratio.toFixed(3) + 'x');
  ok('the face shrinks by the same factor as the ring, so it cannot come apart from it ('
     + ratio.toFixed(3) + ' vs ' + fratio.toFixed(3) + ')', Math.abs(ratio - fratio) <= 0.02);

  const errs = (full.errs||[]).concat(half.errs||[]);
  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  done();
})();
