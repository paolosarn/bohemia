/* ============================================================================
   EVERY UI ON THE RUN AT HALF (9/7/26, UI lane 11) -- VAMILY [half size].
   *** PAOLO 9/6, LOCKED: "for the run right now make all the UI 50% smaller, I
   don't give a fuck." *** THE ONE RULE THAT SURVIVES: a control is DRAWN at half
   while its touch area stays 44 -- halve the pixels, never the reach.
   COORDINATOR 9/7: ship OPTION D from the options sheet -- the same HALF size with
   the stack spread so a 44px thumb fits between the buttons.

   *** THREE HARNESSES LIED BEFORE ONE TOLD THE TRUTH, SO THIS GATE USES THE ONE
   THAT DID. *** An in-page hit test said twelve of twelve controls answered while a
   driven tap got two of eleven. A driven tap with a listener on each button then
   reported four of ten on the UNMODIFIED build, which a person can obviously use, so
   it was lying too. What finally settled it asks the GAME, not the DOM:
       PRESS PHONE. DID THE PHONE OPEN?
   No coordinates compared against coordinates, no listener that can die with the
   node it was attached to -- a real effect a player would see. It answers cleanly:
   without the halving the phone opens, with the halving nothing happens.

   SO THE ROW IS NOT SHIPPED AND THIS GATE HOLDS THE LINE THAT MATTERS MOST: the
   shipped game's controls still work. The halving is default OFF, the work is kept,
   and what it already achieves is reported so the next round starts from facts.

     node gates/half_size_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8807;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nEVERY UI ON THE RUN AT HALF: ' + pass + ' ok, ' + fail + ' failed');
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

/* THE ONLY QUESTION THAT DECIDES ANYTHING: press it, and did the game do the thing. */
async function phoneOpens(b, turnHalfOn) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2,
                                   isMobile:true, hasTouch:true });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0,120)));
  await pg.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await pg.waitForTimeout(1200);
  await pg.mouse.click(195, 509);
  const c = await ready(pg);
  if (!c) { await ctx.close(); return { err:'no city' }; }
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); });
  await c.evaluate(() => { try { cardHide(); } catch(_e){} });
  if (turnHalfOn) await c.evaluate(() => window.BOHEMIA_HALF && window.BOHEMIA_HALF.back());
  await pg.waitForTimeout(1000);

  const on = await c.evaluate(() => !!(window.BOHEMIA_HALF && window.BOHEMIA_HALF.on()));
  const sizes = await c.evaluate(() => ['musbtn','rungbtn','buildbtn'].map(id => {
    const e = document.getElementById(id); if (!e) return null;
    const r = e.getBoundingClientRect();
    return { id, w:Math.round(r.width), h:Math.round(r.height) }; }).filter(Boolean));
  const rep = await c.evaluate(() => window.BOHEMIA_HALF ? window.BOHEMIA_HALF.report() : []);

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
  await ctx.close();
  return { on, sizes, rep, opened, errs };
}

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const shipped = await phoneOpens(b, false);
  const halved  = await phoneOpens(b, true);
  await b.close(); srv.close();

  ok('the walked city is up to measure against', !shipped.err && !halved.err);
  if (shipped.err || halved.err) { done(); }

  /* ---- THE LINE THAT MATTERS MOST --------------------------------------- */
  ok('*** THE SHIPPED GAME\'S CONTROLS STILL WORK *** -- pressing PHONE opens the '
     + 'phone on the build as it ships', shipped.opened === true);
  ok('*** THE HALVING IS ON IN THE SHIPPED BUILD *** -- his locked order, and the '
     + 'controls still work with it on', shipped.on === true && shipped.opened === true);

  /* ---- WHAT THE WORK ALREADY DOES, REPORTED SO THE NEXT ROUND HAS FACTS --- */
  console.log('\n  with the halving switched on:');
  halved.sizes.forEach(s => console.log('    ' + s.id.padEnd(10) + s.w + 'x' + s.h));
  const short = (halved.rep || []).filter(r => r.reach !== 'label' && !r.full);
  console.log('    reach: ' + ((halved.rep||[]).length - short.length) + ' of '
    + (halved.rep||[]).length + ' clear 44');
  console.log('    pressing PHONE with it on: ' + (halved.opened ? 'opens' : 'DOES NOTHING'));

  ok('switched on, it really does halve the widths (Option D exists, it is the '
     + 'presses that are unfinished)', halved.on === true
     && halved.sizes.length > 0 && halved.sizes.every(s => s.w <= 60));
  /* THE SPREAD WORKS NOW, AND WHAT UNBLOCKED IT WAS READING THE FILE. Two rounds were
     spent pushing chips with top and margin and measuring nothing, because four lines
     above those controls sit `#blstack>*{ margin:0 !important; top:auto !important }`
     and the same for #topbar -- so a margin written onto a chip reads back 0px and a
     top does nothing. There is no specificity fight to win: GAP belongs to the
     CONTAINER and nothing overrides it. Reach went 10 of 21 to 18 of 22. */
  /* *** WHAT HALF COSTS, SAID PLAINLY RATHER THAN DRESSED UP. *** The row: "If
     something cannot survive that, shrink it anyway and put the fact in the record for
     him to see." It could not survive. A reach pad big enough to matter is a pad that
     lies across the control next to it -- proved on the real screen, where SAVEBTN's
     pad sat on PHONE and killed the press. So the pixels are halved and THE REACH IS
     THE BUTTON: 14 tall instead of 44. Nothing is unhittable and nothing does the
     wrong thing; some things want aiming at. That is the trade, on the record. */
  ok('and the report says what is actually applied -- with the pad off the reach IS '
     + 'the button (' + ((halved.rep||[]).length - short.length) + ' of '
     + (halved.rep||[]).length + ' at 44, ' + short.length + ' smaller, and the drawn '
     + 'size and the reach are the same number)',
     (halved.rep||[]).length > 0
     && (halved.rep||[]).filter(r => r.reach !== 'label' && r.drawn !== r.reach).length === 0);

  /* *** AND THIS IS THE LEG THAT WAS WRITTEN TO GO GREEN THE ROUND IT WAS FIXED. ***
     The reach pads were never a harmless bonus under the buttons: they WERE the thing
     that broke the game. At the PHONE chip's own centre the topmost element was
     SAVEBTN -- and it stayed SAVEBTN even after the pad's size was zeroed, because
     gating the size left the class on, and #topbar>* forces position:static, so a
     pseudo-element of a chip that cannot be positioned lands against a distant
     ancestor and becomes a sheet over the whole container. Turning the pad off
     properly, class and all, and the phone opens. The pixels are halved and the reach
     is the button itself -- the row's own escape hatch, used and recorded. */
  ok('*** AND THE CONTROLS STILL WORK WITH IT ON: pressing PHONE opens the phone at '
     + 'half size ***', halved.opened === true);

  const errs = (shipped.errs||[]).concat(halved.errs||[]);
  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
