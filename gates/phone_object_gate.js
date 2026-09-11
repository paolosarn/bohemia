/* ============================================================================
   THE FEED IS A PHONE YOU CAN SEE, NOT A BLACK BOX (9/11/26, UI lane 11).
   Row [phone object]. laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md

   *** PAOLO 9/8, from his own frame (records/target/PAOLO_THE_FEED_IS_NOT_A_PHONE_9_8_26.jpg):
   "this doesn't look like a cool post-economic-apocalyptic phone, does it, bro, come on?" ***

   He was right, and what makes this gateable rather than a matter of taste is that the
   difference between a PANEL and an OBJECT is measurable. A panel is one box with text in
   it. An object has THICKNESS -- a casing you can measure, a screen inset inside it, and
   wear that was put there on purpose. So:
     1. THE CASING IS REAL. Measured bezel on every side, not a 1px border.
     2. THE SCREEN IS INSET INSIDE IT. Strictly inside, all four edges.
     3. THE GLASS IS CRACKED, and the crack is a DRAWN shape with an impact point, not a
        gradient pretending -- the first cut was three full-length diagonals and looking
        at it showed scratches on a window.
     4. *** THE BATTERY IS A REAL READING. *** This is the leg that matters most, because
        it is the one that could quietly become a lie. It must agree with the city's OWN
        cbLitFront() at the player's own tile -- is the street he is standing on a live
        circuit -- and it must never print a number it does not have.
     5. THE WORDS ARE UNTOUCHED. The feed still fills with posts and they still say what
        WORDS wrote. The object was the job; the writing was never the problem.
     6. IT IS DRAWN FROM A SKIN. His three-acts law's one required piece of architecture.
        Proved by MUTATION: change the skin's variable and the object changes with it. A
        skin nothing reads is a config file, not a skin.

     node gates/phone_object_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8817;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nTHE FEED IS A PHONE: ' + pass + ' ok, ' + fail + ' failed');
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
  ok('the walked city is up to look at the feed', !!c);
  if (!c) { await b.close(); srv.close(); done(); }
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); });
  await c.evaluate(() => { try { cardHide(); } catch(_e){} });

  /* THE PHONE ONLY EXISTS WHERE HE SAID IT LIVES: zoomed out, in city mode. */
  await c.evaluate(() => { try { if (typeof toCity === 'function') toCity(); } catch(_e){} });
  await pg.waitForTimeout(1500);
  let mode = await c.evaluate(() => { try { return MODE; } catch(_e){ return '?'; } });
  if (mode !== 'city') {
    await c.evaluate(() => { const m=document.getElementById('modechip'); if(m) m.click(); });
    await pg.waitForTimeout(1500);
    mode = await c.evaluate(() => { try { return MODE; } catch(_e){ return '?'; } });
  }
  ok('it is in CITY mode, which is the only place the feed shows', mode === 'city');
  await pg.waitForTimeout(4000);

  const seen = await c.evaluate(() => {
    const g = id => document.getElementById(id);
    const box = n => { if (!n) return null; const r = n.getBoundingClientRect();
      return { l:r.left, t:r.top, r:r.right, b:r.bottom, w:r.width, h:r.height }; };
    const feed = g('cityfeed'), scr = g('cityfeedscreen'), glass = g('cityfeedglass'),
          batt = g('cityfeedbatt'), tape = g('cityfeedtape');
    const cs = feed ? getComputedStyle(feed) : null;
    /* what the city itself says about the ground he is standing on, asked the same way
       the build permit asks it -- this is the number the battery has to agree with */
    let truth = null;
    try {
      const P = window.__proof;
      if (P && typeof cbLitFront === 'function' && P.FN)
        truth = !!cbLitFront((P.hx/P.FN)|0, (P.hy/P.FN)|0);
    } catch (_e) {}
    return {
      on: !!(feed && feed.classList.contains('on')),
      feed: box(feed), screen: box(scr),
      pad: cs ? [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]
                 .map(v => parseFloat(v) || 0) : null,
      cracks: glass ? glass.querySelectorAll('svg path').length : 0,
      glassHits: glass ? getComputedStyle(glass).pointerEvents : 'none',
      tape: !!tape && box(tape).h > 1,
      battCls: batt ? batt.className : null,
      battText: batt ? (batt.textContent || '').trim() : null,
      skinSays: window.BOHEMIA_SKIN ? window.BOHEMIA_SKIN.litHere() : 'no skin',
      skinName: window.BOHEMIA_SKIN ? window.BOHEMIA_SKIN.current() : null,
      truth,
      posts: [...document.querySelectorAll('#cityfeedlist .fp')].map(n => ({
        who: (n.querySelector('.who')||{}).textContent || '',
        txt: (n.querySelector('.txt')||{}).textContent || '' })),
      caseColor: cs ? cs.backgroundImage.slice(0, 40) : ''
    };
  });

  console.log('\n  phone    ' + (seen.feed ? Math.round(seen.feed.w)+'x'+Math.round(seen.feed.h) : 'NOT THERE')
    + '   bezel ' + (seen.pad ? seen.pad.join('/') : '?'));
  console.log('  screen   ' + (seen.screen ? Math.round(seen.screen.w)+'x'+Math.round(seen.screen.h) : 'none'));
  console.log('  glass    ' + seen.cracks + ' drawn crack paths');
  console.log('  battery  ' + seen.battCls + '   the city says lit=' + seen.truth
    + ', the phone says ' + seen.skinSays);
  console.log('  posts    ' + seen.posts.length + ' on screen');
  console.log('  skin     ' + seen.skinName);

  ok('the feed is on screen in city mode', seen.on === true && !!seen.feed);
  if (!seen.feed) { await b.close(); srv.close(); done(); }

  /* 1. THE CASING IS REAL. A panel has a 1px border; an object has a body you can measure. */
  const minPad = seen.pad ? Math.min(...seen.pad) : 0;
  ok('*** IT HAS A CASING, NOT A BORDER *** -- every side of the body measures at least 4px '
     + '(' + seen.pad.join('/') + ')', minPad >= 4);

  /* 2. THE SCREEN IS INSET INSIDE THE CASING, all four edges. */
  const inset = seen.screen && seen.screen.l > seen.feed.l + 1 && seen.screen.r < seen.feed.r - 1
             && seen.screen.t > seen.feed.t + 1 && seen.screen.b < seen.feed.b - 1;
  ok('the screen sits INSIDE the casing on all four sides, so it reads as a window in a '
     + 'body rather than the body itself', !!inset);

  /* 3. THE CRACK IS DRAWN, and it does not eat presses. */
  ok('the glass carries a drawn fracture (' + seen.cracks + ' paths), not a gradient '
     + 'pretending to be one', seen.cracks >= 6);
  ok('and the glass cannot swallow a tap -- it is pointer-events:none, the exact mistake '
     + 'the half-size reach pads made', seen.glassHits === 'none');
  ok('there is tape on it', seen.tape === true);

  /* 4. *** THE BATTERY IS A REAL READING, AND THIS IS THE LEG THAT MATTERS MOST. *** */
  ok('*** THE BATTERY AGREES WITH THE CITY *** -- it reads cbLitFront at the player\'s own '
     + 'tile (city says ' + seen.truth + ', phone says ' + seen.skinSays + ')',
     seen.truth !== null && seen.skinSays === seen.truth);
  ok('and the battery draws the state it actually read ('
     + seen.battCls + ')',
     (seen.truth === true  && /\blit\b/.test(seen.battCls || '')) ||
     (seen.truth === false && /\bdark\b/.test(seen.battCls || '')));
  ok('*** AND IT NEVER PRINTS A NUMBER IT DOES NOT HAVE *** -- no invented percentage, '
     + 'no filler digits, because he cannot tell a made-up number from a real one by '
     + 'looking at it', !/\d/.test(seen.battText || ''));

  /* *** AND THE OTHER HALF OF THE READING IS PROVED TOO, BECAUSE ONE BRANCH IS NOT A
     READING. *** Everything above saw lit=false. If cbLitFront returned false everywhere
     -- which is EXACTLY the bug this city already paid for once, when a permit asked about
     the plot instead of the street and refused nothing -- every assertion above would
     still be green and the battery would be a decoration that always says the same thing.
     A BRANCH THAT HAS NEVER EXECUTED IS NOT CODE, IT IS AN INTENTION. So: find a genuinely
     lit street, stand the player on it, and watch the cell change. */
  const flip = await c.evaluate(async () => {
    const P = window.__proof; if (!P || typeof cbLitFront !== 'function') return { err:'no reader' };
    const FN = P.FN, was = { hx:P.hx, hy:P.hy };
    const t0x = (P.hx/FN)|0, t0y = (P.hy/FN)|0;
    let found = null;
    for (let r = 1; r < 90 && !found; r++) {
      for (let dx = -r; dx <= r && !found; dx++) for (let dy = -r; dy <= r && !found; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = t0x + dx, y = t0y + dy;
        try { if (cbLitFront(x, y)) found = { x, y }; } catch (_e) {}
      }
    }
    if (!found) return { err:'no lit street anywhere within 90 tiles' };
    P.setPos(found.x * FN + (FN/2|0), found.y * FN + (FN/2|0));
    const lit = window.BOHEMIA_SKIN ? window.BOHEMIA_SKIN.litHere() : null;
    window.BOHEMIA_SKIN && window.BOHEMIA_SKIN.paintBattery();
    const cls = (document.getElementById('cityfeedbatt')||{}).className || '';
    P.setPos(was.hx, was.hy);
    window.BOHEMIA_SKIN && window.BOHEMIA_SKIN.paintBattery();
    return { found, lit, cls, backCls: (document.getElementById('cityfeedbatt')||{}).className || '' };
  });
  console.log('  lit test ' + (flip.err ? flip.err
    : 'stood him on a live street at ' + flip.found.x + ',' + flip.found.y
      + ' -> ' + flip.cls + ', stepped back off -> ' + flip.backCls));
  ok('*** THE BATTERY HAS BOTH STATES AND THEY ARE THE GROUND, NOT THE CLOCK *** -- stood '
     + 'on a live street it charges, stepped off it does not'
     + (flip.err ? ' -- ' + flip.err : ''),
     !flip.err && flip.lit === true && /\blit\b/.test(flip.cls) && /\bdark\b/.test(flip.backCls));

  /* 5. THE WORDS ARE UNTOUCHED. */
  ok('the feed still fills with posts -- the object was the job, the writing was never '
     + 'the problem (' + seen.posts.length + ' on screen)', seen.posts.length >= 3);
  ok('and every post still has a voice and a line',
     seen.posts.length > 0 && seen.posts.every(p => /^@\S/.test(p.who) && p.txt.length > 8));

  /* 6. IT COMES FROM A SKIN, PROVED BY MUTATION. */
  const mutated = await c.evaluate(() => {
    const feed = document.getElementById('cityfeed');
    const before = getComputedStyle(feed).borderTopColor;
    document.documentElement.style.setProperty('--skin-caseedge', 'rgb(255, 0, 0)');
    const after = getComputedStyle(feed).borderTopColor;
    /* put it back the way the skin had it, so the gate leaves no paint behind */
    if (window.BOHEMIA_SKIN) window.BOHEMIA_SKIN.wear('salvage');
    const restored = getComputedStyle(feed).borderTopColor;
    return { before, after, restored };
  });
  ok('*** THE OBJECT IS DRAWN FROM A SKIN *** -- changing one skin value repaints the '
     + 'phone (' + mutated.before + ' -> ' + mutated.after + '), so act two is a second '
     + 'skin and not a second phone',
     mutated.before !== mutated.after && mutated.after === 'rgb(255, 0, 0)');
  ok('and putting the skin back restores it, so nothing here is one-way',
     mutated.restored === mutated.before);
  ok('the skin in the shipped build is the act-one one', seen.skinName === 'salvage');

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close();
  done();
})();
