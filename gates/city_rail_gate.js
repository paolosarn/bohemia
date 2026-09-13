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
    /* __NO_TABS__ -- GET THERE THE WAY HE SAID, NOT THE WAY THAT WAS EASY. This clicked
       #modechip, the DROP IN / CITY button. Paolo killed that button (9/6, and again 9/13:
       "that function should only be utilized by the zoom in, zoom out"), so a gate that
       still reaches the city by pressing it is testing a door that no longer exists -- and
       it would have gone red at the ruling rather than at a defect. The transition itself
       never belonged to the button: swapMode() is what the pinch calls in both directions.
       So the gate asks for the transition the same way the zoom does. */
    await c.evaluate(() => { try { swapMode(); } catch (_e) {} });
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
  /* *** THE COUNT WAS >= 8 AND THAT WAS COUNTING THE FURNITURE. *** It went red the moment
        [no tabs] removed WHOLE MAP and DROP IN -- a RULING of Paolo's, twice given, not a
        defect. A gate that encodes how many buttons the game happens to have will go red
        every time somebody obeys him, and this lane has now made that exact mistake twice
        (thumb_gate demanded two buttons the demo deliberately hides).
        WHAT THE NUMBER IS ACTUALLY FOR is stopping this leg passing vacuously on an empty
        sweep, so it stays a FLOOR and stops being a census. The assertion that matters is
        the strays one beside it: every chip in the rail is laid out BY the rail. */
  const strays = seen.vis.filter(v => v.inStack && v.pos !== 'static');
  ok('every chip in the rail is laid out BY the rail, so the next element added without '
     + 'telling the column fails here instead of on his screen (' + seen.chips.length + ' chips)'
     + (strays.length ? ' -- ' + strays.map(s => s.id + ':' + s.pos).join(' ') : ''),
     strays.length === 0 && seen.chips.length >= 4);

  /* 4. AND THE CARD IS ON HIS HALF-SIZE ORDER LIKE EVERYTHING ELSE. It escaped that list
        the same way it escaped the column: 144x46 in a rail of 44x14 chips. */
  const chipH = seen.vis.filter(v => v.inStack && v.id !== 'note').map(v => v.h);
  const tallest = Math.max(...chipH), shortest = Math.min(...chipH);
  console.log('  chip heights ' + shortest + ' to ' + tallest);
  ok('no chip in the rail is more than twice the height of the smallest -- the card drew '
     + '144x46 beside 44x14 before it joined the half-size list (' + shortest + ' to '
     + tallest + ')', tallest <= shortest * 2);

  /* ==== [no tabs] -- THE TWO BUTTONS ARE GONE, AND THE WAY ACROSS IS NOT ==================
     PAOLO 9/13, his SECOND time (locked 9/6): "there is a button that says pretty map and
     this button that says drop in, when that function should only be utilized by the zoom
     in, zoom out." Deleting a control is only free if the thing it did still happens, so
     this asks both halves: the buttons are NOT on screen, AND the seam still crosses in
     both directions. Put either button back and the first leg goes red; break the
     transition and the second does. */
  const gone = await c.evaluate(() => {
    const up = id => { const e = document.getElementById(id); if (!e) return false;
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity !== 0
             && r.width > 0 && r.height > 0; };
    /* AND THE PAD FACE, because the coordinator's frame-F count listed "DROP IN on the pad
       face" as a fourteenth place that button appears. It does not any more -- the round
       button wears the ACTION VERB -- and the row itself rules that "the action button is
       not a zoom button", so this pins it: whatever the pad says, it is never the crossing. */
    const lbl = (document.getElementById('modeLbl') || {}).textContent || '';
    return { fit: up('fitbtn'), chip: up('modechip'), lbl: lbl.trim() };
  });
  ok('WHOLE MAP and DROP IN are not on the screen at all -- zoom is the only way across the '
     + 'seam, which is what he asked for twice'
     + (gone.fit || gone.chip ? ' -- STILL THERE: ' + [gone.fit && 'fitbtn', gone.chip && 'modechip'].filter(Boolean).join(' ') : ''),
     !gone.fit && !gone.chip);
  ok('and the round button is not a zoom button either -- the pad face wears the action verb, '
     + 'never DROP IN or WHOLE MAP (it says "' + gone.lbl + '")',
     !/DROP\s*IN|WHOLE\s*MAP/i.test(gone.lbl));

  const seam = await c.evaluate(() => {
    const m = () => (typeof MODE !== 'undefined' ? MODE : null);
    const a = m(); try { swapMode(); } catch (_e) { return { err: 1 }; }
    const b = m(); try { swapMode(); } catch (_e) { return { err: 2 }; }
    return { a, b, c: m() };
  });
  ok('and the crossing the buttons used to do still happens, both ways -- the pinch calls '
     + 'the same transition (' + seam.a + ' -> ' + seam.b + ' -> ' + seam.c + ')',
     !seam.err && seam.a && seam.b && seam.a !== seam.b && seam.c === seam.a);

  /* ==== [eyes: reach spills] -- THE REACH IS 44 AND IT STILL LANDS ==================
     EYES reported 9/7 that savebtn reached 236x54 and swallowed five neighbours. That is
     FIXED and the bounce-back was stale -- re-measured 9/13, every control owned its own
     centre. What was live was the opposite: with the halving on, reach EQUALLED ink at
     12 px, under a third of a thumb, because [half size] had to kill the 44 px box (a 44
     box at a 22 pitch sits on the chip beneath it) and replaced it with a 30 px gap. That
     makes the ISOLATION 44, not the reach: a finger that misses hits nothing instead of
     the wrong thing, which is good and is a different promise from the thumb law.
     The fix spends the same pitch differently -- 44 px chips with no gap instead of 12 px
     chips with 30 px of dead air -- so this leg has to prove BOTH halves at once, because
     either alone is the bug that was already shipped once:
       (a) every chip owns 44 px, and
       (b) a driven tap at each chip's centre still reaches THAT chip.
     Grow the boxes without (b) and you rebuild the 9/7 overlap; keep (b) without (a) and
     you are back to a 12 px target. */
  const reach = await c.evaluate(() => {
    const st = document.getElementById('blstack');
    if (!st) return { err: 'no rail' };
    const small = [], stolen = [];
    for (const e of st.children) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const id = e.id || ('.' + (e.getAttribute('class') || e.tagName));
      if (r.width < 44 || r.height < 44) small.push(id + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      const top = document.elementFromPoint(Math.round(r.left + r.width / 2),
                                            Math.round(r.top + r.height / 2));
      let owner = top; while (owner && !owner.id && owner.parentElement) owner = owner.parentElement;
      if (!owner || owner.id !== e.id) stolen.push(id + ' -> ' + ((owner && owner.id) || 'nothing'));
    }
    return { n: st.children.length, small, stolen };
  });
  ok('every chip in the rail is a 44 px target EVEN WITH THE HALVING ON -- ink halves, reach '
     + 'does not (' + (reach.n || 0) + ' chips'
     + (reach.small && reach.small.length ? ', UNDER: ' + reach.small.join(' ') : '') + ')',
     !reach.err && reach.small && reach.small.length === 0);
  ok('and a tap at each chip\'s own centre still reaches THAT chip, so the 44 was not bought '
     + 'by sitting on the neighbour -- the exact way this broke on 9/7'
     + (reach.stolen && reach.stolen.length ? ' -- STOLEN: ' + reach.stolen.join(' ') : ''),
     !reach.err && reach.stolen && reach.stolen.length === 0);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close();
  done();
})();
