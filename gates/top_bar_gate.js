/* ============================================================================
   THE TOP MENU BAR (9/7/26, UI lane 11).
   laws/BOHEMIA_ADDENDUM_THE_TOP_MENU_BAR_9_7_26.md

   *** PAOLO 9/7, LOCKED: "we need a top menu bar like how Battle Brothers has it, how
   Civilization five has it, Surviving the Aftermath has a... Surviving Mars has a, you
   know, shit like that, bro. Top menu." ***

   WHAT ALL FOUR OF THOSE BARS ARE, AND WHAT THIS GATE THEREFORE ASKS. They are ONE STRIP
   PINNED TO THE TOP EDGE, spanning the whole width, with status at the left, the date or
   turn in the middle or right, and the menu hanging off the right end. What Bohemia had
   instead was a pile in a corner: a #hud line, and five chips floating over the world
   underneath it, each one its own island. So:
     1. THERE IS ONE BAR AND IT SPANS THE SCREEN -- not a chip cluster with a new name.
     2. IT IS AT THE TOP, and it starts at the very top edge.
     3. THE WORLD STARTS BELOW IT -- a bar lying on top of the game is the floating pile
        again in a strip's clothes.
     4. THE MENU IS IN IT -- every chip that used to float is inside the bar's box now.
     5. AND THE MENU STILL WORKS: press PHONE, does the phone open. That is the only
        question that has ever told the truth about this surface (three harnesses lied
        about the same controls during [half size]).
     6. NO INVENTED MONEY. The three currencies are LOCKED at three and there is no live
        purse on the street, so the bar must show NO currency numbers rather than zeroes
        that mean nothing -- and never more than three when one is wired, because his 7/26
        ban on the "spreadsheet simulator" feel still stands.

     node gates/top_bar_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8813;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nTHE TOP MENU BAR: ' + pass + ' ok, ' + fail + ' failed');
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
  ok('the walked city is up to look at the top of the screen', !!c);
  if (!c) { await b.close(); srv.close(); done(); }
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); });
  await c.evaluate(() => { try { cardHide(); } catch(_e){} });
  await pg.waitForTimeout(900);

  const seen = await c.evaluate(() => {
    const g = id => document.getElementById(id);
    const box = n => { if (!n) return null; const r = n.getBoundingClientRect();
      return { l:r.left, t:r.top, r:r.right, b:r.bottom, w:r.width, h:r.height }; };
    const bar = g('menubar'), stage = g('stage'), right = g('barright');
    const wrapW = document.documentElement.clientWidth;
    /* WHAT ELSE IS STILL FLOATING UP THERE. Anything a finger can press that draws in
       the top strip of the screen and is NOT inside the bar is the old pile surviving. */
    const loose = [];
    for (const n of document.querySelectorAll('#topbar > *, #devtray > *, [id$="btn"]')) {
      const r = n.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
      if (r.top < 24 && !(bar && bar.contains(n))) loose.push(n.id || n.className);
    }
    return {
      bar: box(bar), stage: box(stage), wrapW,
      chips: right ? [...right.children].map(n => n.id).filter(Boolean) : [],
      money: (g('barmoney') || {}).textContent || '',
      moneyReads: (window.BOHEMIA_BAR && window.BOHEMIA_BAR.money) ? window.BOHEMIA_BAR.money() : 'no module',
      clockIn: !!(bar && g('hclock') && bar.contains(g('hclock'))),
      whereIn: !!(bar && g('hslot') && bar.contains(g('hslot'))),
      loose,
      on: !!(window.BOHEMIA_BAR && window.BOHEMIA_BAR.on())
    };
  });

  console.log('\n  bar      ' + (seen.bar ? Math.round(seen.bar.w) + 'x' + Math.round(seen.bar.h)
    + ' at top ' + Math.round(seen.bar.t) : 'NOT THERE') + ' (screen ' + seen.wrapW + ' wide)');
  console.log('  menu     ' + (seen.chips.join(' ') || 'nothing'));
  console.log('  world    starts at ' + (seen.stage ? Math.round(seen.stage.t) : '?'));
  console.log('  money    ' + (seen.money ? '"' + seen.money + '"' : 'none shown')
    + '   (the reader returns ' + JSON.stringify(seen.moneyReads) + ')');

  ok('*** THERE IS A TOP MENU BAR ***', seen.on === true && !!seen.bar);
  if (!seen.bar) { await b.close(); srv.close(); done(); }

  /* 1 and 2: ONE STRIP, THE WHOLE WIDTH, AT THE TOP. */
  ok('it spans the screen rather than clustering in a corner ('
     + Math.round(seen.bar.w) + ' of ' + seen.wrapW + ')', seen.bar.w >= seen.wrapW - 2);
  ok('it is pinned to the top edge (top ' + Math.round(seen.bar.t) + ')', seen.bar.t <= 1);

  /* 3: THE WORLD STARTS BELOW IT. */
  ok('the world starts BELOW the bar, so the bar is a strip and not a sticker on the game'
     + ' (bar ends ' + Math.round(seen.bar.b) + ', world starts ' + Math.round(seen.stage.t) + ')',
     seen.stage && seen.stage.t >= seen.bar.b - 1);

  /* 4: THE MENU IS IN IT, AND NOTHING IS LEFT FLOATING. */
  ok('the menu buttons live in the bar (' + seen.chips.length + ': ' + seen.chips.join(' ') + ')',
     seen.chips.length >= 4);
  ok('nothing is still floating loose over the world at the top'
     + (seen.loose.length ? ' -- ' + seen.loose.join(' ') : ''), seen.loose.length === 0);

  /* AND THE READOUTS THE BAR EXISTS TO CARRY. */
  ok('the day and the clock are in the bar', seen.clockIn === true);
  ok('where you are standing is in the bar', seen.whereIn === true);

  /* 6: NO INVENTED MONEY. */
  ok('*** IT SHOWS NO CURRENCY IT DOES NOT HAVE *** -- nothing on the street holds a purse, '
     + 'so the bar shows no money rather than a zero that means nothing',
     seen.moneyReads === null && seen.money.trim() === '');

  /* 5: AND THE ONLY QUESTION THAT HAS EVER TOLD THE TRUTH ABOUT THESE CONTROLS. */
  const was = await c.evaluate(() => { const w=document.getElementById('phonewrap');
    return !!(w && getComputedStyle(w).display !== 'none'); });
  const t = await c.evaluate(() => { const e=document.getElementById('phonebtn');
    if (!e) return null; const r=e.getBoundingClientRect(); if (r.width<1) return null;
    const fr = window.frameElement ? window.frameElement.getBoundingClientRect() : {left:0,top:0};
    return { x:r.left+r.width/2+fr.left, y:r.top+r.height/2+fr.top }; });
  let opened = null;
  if (t) { await pg.mouse.click(t.x, t.y); await pg.waitForTimeout(900);
    const now = await c.evaluate(() => { const w=document.getElementById('phonewrap');
      return !!(w && getComputedStyle(w).display !== 'none'); });
    opened = now && !was; }
  ok('*** AND THE MENU STILL WORKS: PRESS PHONE IN THE BAR AND THE PHONE OPENS ***',
     opened === true);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close();
  done();
})();
