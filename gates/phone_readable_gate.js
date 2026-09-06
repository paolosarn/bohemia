/* ============================================================================
   ACCESSIBLE ON A PHONE (9/6/26, UI lane 11) -- VAMILY [phone readable].

   THE ROW: "text size, tap targets, colour-blind safety on faction colours,
   motion; the Game Accessibility Guidelines basic tier that the sound and colour
   rules already cite, applied to the whole surface."

   MEASURED FIRST, on the served demo at 390x844 with no storage -- the surface a
   stranger actually gets, never off disk (a file:// probe grades a build no player
   receives; proved 9/5, demo_is_current_gate.js):

       TEXT     21 pieces of text under 12px, EIGHT of them at 10px: the top bar,
                the chips, the card subheads.
       TAP      ONE control under the 44px thumb, out of every clickable thing in
                both documents: the day card's close button at 34x34 -- and
                thumb_gate was GREEN over it, proved by putting 34 back.
       MOTION   ZERO animations running, and zero prefers-reduced-motion support in
                the walked city. Motion is not a hazard here yet; the switch exists
                so it never becomes one silently.
       COLOUR   thirteen factions, 78 pairs, pushed through the three common colour
                vision deficiencies: 13 pairs are under dE 10 for a protan and
                Anarchists vs Reds sit at dE 1.8 -- indistinguishable.

   WHAT THIS GATE WILL NOT DO, AND WHY. It does not repaint a faction. Which faction
   owns which hue is HIS (MECHANISM-MINE / CONTENTS-PAOLO'S), and the law already
   answers the colour-blind case with STRUCTURE-NOT-COLOR: "Colour is the SECOND
   channel. If these two ever disagree, the silhouette wins." So the colour legs are
   a RATCHET, the same shape faction_colour_gate uses: the numbers are printed every
   run so nobody can call this unmeasured, and the count of colliding pairs may not
   GROW. Fixing the collisions is a ruling, and it is in the handoff for him.

   AND THE DEFAULT NEVER MOVES. What size the game is drawn at is the art direction's
   call. What this lane owes a player is the CHOICE -- which is what the Game
   Accessibility Guidelines basic tier asks for, and what the row cites.

     node gates/phone_readable_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8803;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nACCESSIBLE ON A PHONE: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

const cityFrame = p => p.frames().find(f => /CITY_WORLD/.test(f.url()));
/* wait for the END of the city's script, never a number of seconds: its last block is
   232 KB and a fixed sleep grades a half-parsed page (teach_gate.js records this) */
const ready = async (p, ms) => { const t0 = Date.now();
  for (;;) { const c = cityFrame(p);
    if (c) { try { if (await c.evaluate(() => !!window.BOHEMIA_TEACH)) return c; } catch (_e) {} }
    if (Date.now() - t0 > (ms || 60000)) return c || null;
    await p.waitForTimeout(250); } };

/* ONE SWEEP, RUN IN BOTH DOCUMENTS. Only elements that own their own text node are
   measured: asking a wrapper its font-size counts the same sentence many times over. */
const SWEEP = () => {
  let small = 0, tot = 0, min = 999, over = 0;
  const W = window.innerWidth;
  document.querySelectorAll('*').forEach(e => {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const r = e.getBoundingClientRect();
    if (r.width >= 1 && (r.right > W + 1.5 || r.left < -1.5)) over++;
    if (r.width < 1 || r.height < 1) return;
    let own = ''; for (const n of e.childNodes) if (n.nodeType === 3) own += n.nodeValue;
    if (!own.trim()) return;
    const px = parseFloat(cs.fontSize) || 0; if (px <= 0) return;
    tot++; if (px < 12) small++; if (px < min) min = px;
  });
  return { small, tot, min: min === 999 ? null : min, over,
           hscroll: document.documentElement.scrollWidth > W + 1 };
};

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
  await p.waitForTimeout(1200);
  await p.mouse.click(195, 509);
  const c = await ready(p);
  ok('the walked city is up to measure against', !!c);
  if (!c) { done(); }
  await p.waitForTimeout(2500);

  const S = () => p.evaluate(SWEEP);
  const C = () => c.evaluate(SWEEP);

  /* ---- TEXT ------------------------------------------------------------- */
  const has = await p.evaluate(() => !!(window.BOHEMIA_SETTINGS && window.BOHEMIA_SETTINGS.setText));
  ok('a player can change the text size at all (nothing could, before this row)', has);
  if (!has) { done(); }

  await p.evaluate(() => window.BOHEMIA_SETTINGS.setText(1));
  await p.waitForTimeout(1000);
  const s1 = await S(), c1 = await C();
  ok('AT THE DEFAULT NOTHING MOVES -- the art direction still owns how the game looks '
     + '(shell ' + s1.small + '/' + s1.tot + ' under 12px, city ' + c1.small + '/' + c1.tot + ')',
     (s1.small + c1.small) > 0);

  const rows = [];
  for (const step of [2, 3]) {
    await p.evaluate(n => window.BOHEMIA_SETTINGS.setText(n), step);
    await p.waitForTimeout(1200);
    const floor = await p.evaluate(() => window.BOHEMIA_SETTINGS.floor());
    rows.push({ step, floor, s: await S(), c: await C() });
  }
  for (const r of rows) {
    ok('text size ' + r.step + ' puts a ' + r.floor + 'px floor under EVERY word, in BOTH '
       + 'documents -- the shell and the walked city (shell min ' + r.s.min
       + ', city min ' + r.c.min + ')',
       r.s.small === 0 && r.c.small === 0 && r.s.min >= r.floor && r.c.min >= r.floor);
    /* BIGGER MUST NOT MEAN BROKEN. A setting that makes the text readable and the
       screen unusable has not helped anybody. */
    ok('and at size ' + r.step + ' nothing is pushed off the screen and neither document '
       + 'scrolls sideways (shell over ' + r.s.over + ', city over ' + r.c.over + ')',
       r.s.over === 0 && r.c.over === 0 && !r.s.hscroll && !r.c.hscroll);
  }

  /* AND THE TOP BAR MUST NOT FUSE. Caught on a screenshot of this very feature: the
     city's HUD is a flex row on space-between, so raising the text ate the slack and
     "HUMAN MODE DAY 1 - 06:00 SUBURB - ON FOOT" ran together into one string. */
  const gapped = await c.evaluate(() => {
    const h = document.getElementById('hud'); if (!h) return { skip: true };
    const kids = [...h.children].filter(k => k.getBoundingClientRect().width > 1);
    if (kids.length < 2) return { skip: true };
    let worst = 1e9;
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i-1].getBoundingClientRect(), bb = kids[i].getBoundingClientRect();
      if (Math.abs(a.top - bb.top) > 4) continue;          /* different rows, fine */
      worst = Math.min(worst, bb.left - a.right);
    }
    return { worst: worst === 1e9 ? null : Math.round(worst) };
  });
  ok('and the top bar\'s labels still have air between them at the biggest size, rather '
     + 'than running into one another (' + JSON.stringify(gapped) + ')',
     gapped.skip === true || gapped.worst === null || gapped.worst >= 6);

  await p.evaluate(() => window.BOHEMIA_SETTINGS.setText(1));
  await p.waitForTimeout(1000);
  const back = await C();
  ok('and going back restores exactly what was authored, rather than a guess at it ('
     + back.small + '/' + back.tot + ' vs ' + c1.small + '/' + c1.tot + ')',
     back.small === c1.small && back.min === c1.min);

  /* ---- MOTION ----------------------------------------------------------- */
  await p.evaluate(() => window.BOHEMIA_SETTINGS.setMotion(true));
  await p.waitForTimeout(600);
  const mo = await p.evaluate(async () => {
    const shell = !!document.getElementById('bohmotion');
    const cf = document.getElementById('cityFrame');
    let city = null;
    try { city = !!cf.contentDocument.getElementById('bohmotion'); } catch (_e) {}
    return { shell, city };
  });
  ok('LESS MOTION reaches both documents, not just the one the switch lives in ('
     + JSON.stringify(mo) + ')', mo.shell === true && mo.city === true);

  const stilled = await c.evaluate(() => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:-99px;top:-99px;width:10px;height:10px;'
      + 'transition:opacity 2s linear;animation:none';
    document.body.appendChild(d);
    const dur = getComputedStyle(d).transitionDuration;
    d.remove();
    return dur;
  });
  ok('and it actually stills a real moving thing, whoever wrote it and whenever they '
     + 'wrote it -- a fresh element with a two second transition comes back at '
     + stilled, parseFloat(stilled) < 0.1);

  await p.evaluate(() => window.BOHEMIA_SETTINGS.setMotion(false));
  await p.waitForTimeout(600);
  const moOff = await p.evaluate(() => !!document.getElementById('bohmotion'));
  ok('and turning it back on gives the motion back', moOff === false);

  /* THE PHONE ALREADY ASKED. A player who set reduce-motion on their device has
     answered this once; asking again is the fiddling the setting exists to end. */
  const ctx2 = await b.newContext({ viewport:{width:390,height:844}, isMobile:true,
                                    hasTouch:true, reducedMotion:'reduce' });
  const p2 = await ctx2.newPage();
  await p2.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p2.waitForTimeout(1500);
  await p2.mouse.click(195, 509);
  await ready(p2);
  await p2.waitForTimeout(2000);
  const honoured = await p2.evaluate(() => window.BOHEMIA_SETTINGS
    ? window.BOHEMIA_SETTINGS.motion() : null);
  ok('a phone that already asked for less motion is obeyed without anybody being asked '
     + 'twice (' + honoured + ')', honoured === true);
  await ctx2.close();

  /* ---- TAP TARGETS: the new controls are thumbs too ---------------------- */
  const newCtrls = await p.evaluate(() => {
    document.getElementById('gearbtn').click();
    const out = [];
    ['settext','setmotion'].forEach(id => {
      const n = document.getElementById(id); if (!n) return out.push({ id, missing:true });
      const kids = id === 'settext' ? [...n.children] : [n];
      kids.forEach((k, i) => { const r = k.getBoundingClientRect();
        out.push({ id: id + (kids.length > 1 ? ('#' + i) : ''),
                   w: Math.round(r.width), h: Math.round(r.height) }); });
    });
    document.getElementById('setclose').click();
    return out;
  });
  const tooSmall = newCtrls.filter(x => x.missing || x.w < 44 || x.h < 44);
  ok('the two new controls are thumbs like everything else on this screen ('
     + newCtrls.length + ' measured, ' + tooSmall.length + ' under 44: '
     + (tooSmall.map(x => x.id + ' ' + x.w + 'x' + x.h).join(', ') || 'none') + ')',
     newCtrls.length >= 4 && tooSmall.length === 0);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  await b.close(); srv.close();

  /* ---- COLOUR BLIND SAFETY, ON REAL CLOTH PIXELS ------------------------- */
  const cvd = require('./cvd_faction_measure.js');
  const R = await cvd.measure();
  console.log('\n  colour vision, 13 factions, 78 pairs, dE on rendered cloth:');
  const RATCHET = { normal: 3, protan: 13, deutan: 11, tritan: 9 };
  for (const k of ['normal','protan','deutan','tritan']) {
    const w = R.pairs[k], under = w.filter(x => x.d < 10).length;
    console.log('   ' + k.padEnd(7) + ' pairs under dE10: ' + String(under).padStart(2)
      + '   closest: ' + w[0].a + ' vs ' + w[0].b + ' at dE ' + w[0].d);
  }
  for (const k of ['normal','protan','deutan','tritan']) {
    const under = R.pairs[k].filter(x => x.d < 10).length;
    ok('colour: ' + k + ' collisions do not GROW (' + under + ', ratchet ' + RATCHET[k]
       + ') -- the law already answers this with STRUCTURE-NOT-COLOR, so the silhouette '
       + 'carries identity and this only stops it getting worse',
       under <= RATCHET[k]);
  }
  done();
})();
