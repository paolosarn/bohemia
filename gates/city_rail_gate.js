/* ============================================================================
   THE LEFT RAIL IS ONE STACK, AND NOTHING ON THE CITY SCREEN OVERLAPS
   (9/11/26, UI lane 11). Row [rail collides].

   *** PAOLO 9/8, from his own frame (records/target/PAOLO_THE_RAIL_COLLIDES_9_8_26.jpg):
   "what is this part of the UI? it's colliding with each other, what's up with that?" ***
   The day's job card sat on top of DROP IN and WHOLE MAP.

   WHY IT HAPPENED, READ IN THE FILE AND THEN MEASURED ON THE REAL PAGE: eight of the nine
   things in that rail were position:static children of one flex column, and the job card
   -- added later by the shift work -- was the one that was not. It carried its own
   `left:6px; bottom:107px`, which was correct on the day it was typed and wrong the moment
   anything else existed at that height. Measured before the fix, at phone size:
       workbtn x fitbtn   52x11      workbtn x modechip   44x5
   Exactly the two chips buried in his photograph.

   SO THIS GATE ASKS THE TWO QUESTIONS THAT KEEP IT FIXED:
     1. NOTHING OVERLAPS. Every visible piece of chrome on the city screen, every pair,
        at phone size, with the job card showing.
     2. AND IT CANNOT COME BACK THE SAME WAY. Every chip in the rail is a child of the
        one column and is laid out BY it -- position:static, no hand-typed offset. That is
        the assertion that catches the NEXT element somebody adds without telling the
        column, which is the actual bug and the reason a one-off nudge would not have been
        a fix.

     node gates/city_rail_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8819;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nTHE CITY RAIL: ' + pass + ' ok, ' + fail + ' failed');
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

/* THE RAIL IS WHATEVER THE COLUMN HOLDS, ASKED OF THE PAGE RATHER THAN LISTED HERE.
   A hardcoded list in the gate would go stale the same way the column's own list did,
   and that is the bug this gate exists to catch. */
const LOOK = () => {
  const stack = document.getElementById('blstack');
  const chips = stack ? [...stack.children] : [];
  const others = ['nav','cityfeed','menubar','hud','daycard','workbtn']
    .map(id => document.getElementById(id)).filter(Boolean);
  const all = [...new Set([...chips, ...others])];
  const vis = [];
  for (const n of all) {
    const s = getComputedStyle(n);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
    const r = n.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    vis.push({ id: n.id || '(' + n.className + ')',
               l:r.left, t:r.top, r:r.right, b:r.bottom,
               w:Math.round(r.width), h:Math.round(r.height),
               pos: s.position,
               inStack: !!(stack && n.parentElement === stack),
               offsets: [s.left, s.top, s.right, s.bottom] });
  }
  const hits = [];
  for (let i = 0; i < vis.length; i++) for (let j = i+1; j < vis.length; j++) {
    const a = vis[i], z = vis[j];
    const ox = Math.min(a.r, z.r) - Math.max(a.l, z.l);
    const oy = Math.min(a.b, z.b) - Math.max(a.t, z.t);
    if (ox > 1 && oy > 1) hits.push(a.id + ' x ' + z.id + ' ' + Math.round(ox) + 'x' + Math.round(oy));
  }
  const card = document.getElementById('workbtn');
  return { vis, hits,
    chips: chips.map(n => n.id).filter(Boolean),
    cardIn: !!(stack && card && card.parentElement === stack),
    cardPos: card ? getComputedStyle(card).position : null,
    cardBox: card ? (card.getBoundingClientRect().width|0) + 'x' + (card.getBoundingClientRect().height|0) : null };
};

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2,
                                   isMobile:true, hasTouch:true });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0,140)));
  await pg.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await pg.waitForTimeout(1200);
  await pg.mouse.click(195, 509);
  const c = await ready(pg);
  ok('the walked city is up to look at the rail', !!c);
  if (!c) { await b.close(); srv.close(); done(); }
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); });
  await c.evaluate(() => { try { cardHide(); } catch(_e){} });
  await c.evaluate(() => { try { if (typeof toCity === 'function') toCity(); } catch(_e){} });
  await pg.waitForTimeout(1500);
  let mode = await c.evaluate(() => { try { return MODE; } catch(_e){ return '?'; } });
  if (mode !== 'city') {
    await c.evaluate(() => { const m=document.getElementById('modechip'); if(m) m.click(); });
    await pg.waitForTimeout(1500);
    mode = await c.evaluate(() => { try { return MODE; } catch(_e){ return '?'; } });
  }
  ok('it is on the city screen, which is the screen in his frame', mode === 'city');

  /* THE CARD IS THE WHOLE POINT, SO IT HAS TO BE SHOWING. It is display:none until the
     day has work in it; his photograph is of a day that did. Forced on, because a gate
     that only ever measures the easy state is not measuring the bug. */
  await c.evaluate(() => { const w=document.getElementById('workbtn'); if(w) w.style.display='block'; });
  await pg.waitForTimeout(1200);
  const seen = await c.evaluate(LOOK);

  console.log('\n  the rail holds: ' + seen.chips.join(' '));
  seen.vis.forEach(v => console.log('    ' + v.id.padEnd(10) + (v.w+'x'+v.h).padEnd(9)
    + v.pos.padEnd(9) + (v.inStack ? 'in the column' : '')));
  console.log('  job card: ' + seen.cardBox + ', ' + seen.cardPos
    + (seen.cardIn ? ', in the column' : ', NOT IN THE COLUMN'));

  /* 1. NOTHING OVERLAPS. */
  ok('*** NOTHING ON THE CITY SCREEN LIES ON ANYTHING ELSE ***'
     + (seen.hits.length ? ' -- ' + seen.hits.length + ': ' + seen.hits.slice(0,4).join(' | ') : ''),
     seen.hits.length === 0);

  /* 2. AND THE JOB CARD IS IN THE COLUMN, WHICH IS WHY. */
  ok('the job card is a child of the rail, not a thing parked on top of it', seen.cardIn === true);
  ok('and the column lays it out -- position:static, so it cannot carry its own offset ('
     + seen.cardPos + ')', seen.cardPos === 'static');

  /* 3. THE ASSERTION THAT CATCHES THE *NEXT* ONE. Every chip in the rail must be laid out
        BY the rail. The moment somebody adds an element with its own top/left, this goes
        red before he has to photograph it. */
  const strays = seen.vis.filter(v => v.inStack && v.pos !== 'static');
  ok('every chip in the rail is laid out BY the rail, so the next element added without '
     + 'telling the column fails here instead of on his screen'
     + (strays.length ? ' -- ' + strays.map(s => s.id + ':' + s.pos).join(' ') : ''),
     strays.length === 0 && seen.chips.length >= 8);

  /* 4. AND THE CARD IS ON HIS HALF-SIZE ORDER LIKE EVERYTHING ELSE. It escaped that list
        the same way it escaped the column: 144x46 in a rail of 44x14 chips. */
  const chipH = seen.vis.filter(v => v.inStack && v.id !== 'note').map(v => v.h);
  const tallest = Math.max(...chipH), shortest = Math.min(...chipH);
  console.log('  chip heights ' + shortest + ' to ' + tallest);
  ok('no chip in the rail is more than twice the height of the smallest -- the card drew '
     + '144x46 beside 44x14 before it joined the half-size list (' + shortest + ' to '
     + tallest + ')', tallest <= shortest * 2);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close();
  done();
})();
