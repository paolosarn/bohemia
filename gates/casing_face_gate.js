/* ============================================================================
   THE CASING FACE GATE  (UI lane 11, 9/15)  -- row [no slop], round eight.
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
   DIRECTION's ruling: FIXED PITCH IS LEGAL ONLY WHERE THE IN-WORLD DEVICE IS A
   CHARACTER-CELL SCREEN.

   The screen and body registers got real faces on 9/13. CASING -- the words stamped
   on the machine itself, which is every label, chip, button and readout on the HUD --
   was still resolving to 'BohemiaMono', which is why the walked city still counted 42
   monospace hits. BohemiaCasing is the same 5x8 cut condensed and stamped:
   tools/bohemia_cut_the_rom_face.py.

   *** THE LEG THAT EARNS THIS FILE IS "NOTHING LOWERCASE IS SET IN A CAPS-ONLY FACE",
   AND IT EXISTS BECAUSE THIS LANE SHIPPED THAT EXACT BUG INTO A SCREENSHOT THIS ROUND. ***
   The casing face is caps only on purpose: a stencil kit is one alphabet. So a surface
   set in it must not contain lowercase words, or the game starts SHOUTING prose at him.
   A first pass gave the casing face to all 58 rules that declared the casing TRACK, and
   the day card's own lines -- "nobody has picked it up yet", "about 4 and a half hours on
   foot" -- came back as NOBODY HAS PICKED IT UP YET. Nothing was red. The tell count went
   the right way. Only the picture said so. This gate is that picture, made mechanical.

   Run: node gates/casing_face_gate.js
   ========================================================================== */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8853;

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = () => { console.log('\nTHE CASING HAS ITS OWN FACE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.json':'application/json','.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,'');
  const f=path.join(SLICES, rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type', TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

/* WAIT FOR THE SURFACE TO SAY IT IS READY, never for a number of seconds. Measured 9/13:
   this city needs 24.2 s before it answers at all and 30.8 s to finish, so a probe at 5 s
   is reading a third of a game and this lane published one wrong diagnosis that way. */
const cityFrame = p => p.frames().find(f => /CITY_WORLD/.test(f.url()));
const ready = async p => { const t0 = Date.now();
  for (;;) { const c = cityFrame(p);
    if (c) { try { if (await c.evaluate(() => !!window.BOHEMIA_TEACH)) return c; } catch (_e) {} }
    if (Date.now() - t0 > 60000) return c || null;
    await p.waitForTimeout(250); } };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; }
              catch (e2) { ok('playwright is available to measure the type', false); done(); } }

  /* the cut exists on disk before anything is asked of the page */
  const woff = path.join(SLICES, 'fonts', 'BohemiaCasing-Regular.woff2');
  ok('the casing cut exists as a file', fs.existsSync(woff),
     fs.existsSync(woff) ? fs.statSync(woff).size + ' bytes' : 'missing');

  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2,
                                   isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1200);
  await p.mouse.click(195, 509);
  const c = await ready(p);
  ok('the walked city is up to measure against', !!c);
  if (!c) { await b.close(); srv.close(); done(); }
  await p.waitForTimeout(3000);

  /* ---- 1. THE REGISTER NAMES A REAL FACE, AND NOT A GRID ------------------ */
  const regs = await c.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue('--face-' + n).trim();
    const first = v => (v || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    return { casing: g('casing'), screen: g('screen'), body: g('body'),
             cFirst: first(g('casing')), sFirst: first(g('screen')), bFirst: first(g('body')) };
  });
  ok('the casing register names a face before any fallback (' + (regs.cFirst || 'nothing') + ')',
     !!regs.cFirst && !/^ui-|^system-|monospace|sans-serif$/.test(regs.cFirst));
  /* THE OPPOSITE CALL FROM THE SCREEN REGISTER, ON PURPOSE. A screen falling back to fixed
     pitch is the right failure; a painted plate falling back to it is the exact tell. */
  ok('and its fallback chain has NO monospace in it -- a plate is not a screen',
     !/monospace/.test(regs.casing), regs.casing);
  ok('the three registers are three different faces',
     new Set([regs.cFirst, regs.sFirst, regs.bFirst]).size === 3,
     [regs.cFirst, regs.sFirst, regs.bFirst].join(' / '));

  /* ---- 2. IT LOADED, AND IT REALLY DRAWS --------------------------------- */
  const drew = await c.evaluate(async (fam) => {
    try { await document.fonts.load('11px ' + fam); await document.fonts.ready; } catch (e) {}
    const w = (f) => { const s = document.createElement('span');
      s.style.cssText = 'position:absolute;left:-9999px;font-size:40px;font-family:' + f;
      s.textContent = 'MMMMMMMMMM'; document.body.appendChild(s);
      const x = s.getBoundingClientRect().width; s.remove(); return x; };
    return { loaded: document.fonts.check('11px ' + fam), mine: w("'" + fam + "'"),
             /* THE CONTROL: a family that does not exist. If the two match, the browser
                never used the face and every number after this is the fallback's. That is
                exactly how the first measurement of this face was wrong. */
             control: w('NoSuchFaceAtAll') };
  }, regs.cFirst);
  ok('the casing face actually loaded in the page, not just in the stylesheet', drew.loaded === true);
  ok('and it really draws -- ten Ms measure differently in it than in the fallback',
     Math.abs(drew.mine - drew.control) > 1, drew.mine + ' vs ' + drew.control);

  /* ---- 3. THE MACHINE WEARS IT ------------------------------------------- */
  const worn = await c.evaluate((fam) => {
    const F = id => { const e = document.getElementById(id); return e
      ? getComputedStyle(e).fontFamily.split(',')[0].replace(/['"]/g,'') : null; };
    const want = ['menubar','barleft','hud','blstack','nav','cityfeed'];
    const out = {};
    want.forEach(i => out[i] = F(i));
    return { out, wrong: want.filter(i => out[i] && out[i] !== fam) };
  }, regs.cFirst);
  ok('the top strip, the HUD, the rail, the pad and the phone casing all wear it',
     worn.wrong.length === 0, JSON.stringify(worn.out));

  /* THE DOCUMENT DEFAULT IS THE TELL IN ITS PUREST FORM, and it was --fmono here:
     "monospace for everything" is the first line of the law's own list. Anything that
     does not name a register is TEXT, so the default is the prose face. */
  const dflt = await c.evaluate(() =>
    getComputedStyle(document.body).fontFamily.split(',')[0].replace(/['"]/g,''));
  ok('the document default is not a monospace face', !/mono/i.test(dflt), dflt);

  /* ---- 4. *** NOTHING LOWERCASE IS SET IN THE CAPS-ONLY FACE. *** --------- */
  /* The leg this file exists for. Read off the LIVE page, element by element, because
     the failure it catches is invisible in the source and invisible to the tell count. */
  const shout = await c.evaluate((fam) => {
    const bad = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const t = (n.nodeValue || '').trim();
      if (!t || !/[a-z]{3}/.test(t)) continue;          /* no lowercase word, nothing to lose */
      const e = n.parentElement;
      if (!e) continue;
      const cs = getComputedStyle(e);
      if (cs.fontFamily.split(',')[0].replace(/['"]/g,'') !== fam) continue;
      /* text-transform:uppercase means the words were MEANT to shout; that is a choice
         somebody made about that string, not a face eating a sentence. */
      if (cs.textTransform === 'uppercase') continue;
      bad.push(((e.id ? '#' + e.id : e.tagName) + ' "' + t.slice(0, 38) + '"'));
    }
    return bad;
  }, regs.cFirst);
  ok('no lowercase words are set in the caps-only casing face',
     shout.length === 0, shout.slice(0, 3).join(' | '));

  /* ---- 5. EVERY CHARACTER THE MACHINE DRAWS IS COVERED ------------------- */
  /* Twice now a single character has fallen through to another typeface with nothing red
     anywhere: the phone's signal bar (U+25AE) and every card's close mark (U+2715). Asking
     the renderer what a surface actually draws beats trusting a list somebody remembered. */
  const drawn = await c.evaluate((fam) => {
    const ids = ['menubar','hud','blstack','nav','cityfeed'];
    const chars = new Set();
    ids.forEach(i => { const e = document.getElementById(i); if (!e) return;
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        const el = n.parentElement;
        if (!el || getComputedStyle(el).fontFamily.split(',')[0].replace(/['"]/g,'') !== fam) continue;
        for (const ch of (n.nodeValue || '')) if (ch.trim()) chars.add(ch);
      } });
    return [...chars];
  }, regs.cFirst);

  /* *** THE ORACLE IS THE FONT'S OWN cmap, AND THE FIRST CUT OF THIS LEG GOT IT WRONG. ***
     It asked whether a character MEASURED differently in the face than in a family that
     does not exist, and reported 0, 6 and 8 as missing -- three digits that are plainly
     in the table. Their advance simply happens to equal the fallback's, so a width test
     calls a coincidence a hole. It reported the diamond too, which WAS real, and a leg
     that mixes one true finding with three false ones is worth nothing: the false ones
     teach the next person to ignore it. So the question is asked of the file itself. */
  let covered = null, cmapErr = '';
  try {
    const out = require('child_process').execFileSync('python3', ['-c',
      "from fontTools.ttLib import TTFont;import json,sys;"
      + "f=TTFont(sys.argv[1]);c=set();\n"
      + "[c.update(t.cmap.keys()) for t in f['cmap'].tables];"
      + "print(json.dumps(sorted(c)))",
      path.join(SLICES, 'fonts', 'BohemiaCasing-Regular.ttf')], { encoding: 'utf8' });
    covered = new Set(JSON.parse(out));
  } catch (e) { cmapErr = String(e.message).slice(0, 80); }
  ok('the face\'s own character list could be read, so coverage is a fact and not a guess',
     !!covered, cmapErr);
  if (covered) {
    const miss = drawn.filter(ch => !covered.has(ch.codePointAt(0)))
                      .map(ch => ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase());
    ok('every character the machine draws is covered by the casing face ('
       + drawn.length + ' distinct)', miss.length === 0, miss.slice(0,5).join(', '));
  }

  /* ---- 6. IT IS REALLY CONDENSED, AND REALLY PROPORTIONAL ---------------- */
  /* Both measured ON THE PAGE, not read off the build script. A caption that says
     "condensed" over a drawing that is not is the thing this row keeps catching. */
  const shape = await c.evaluate((fam) => {
    const mk = t => { const s = document.createElement('span');
      s.style.cssText = 'position:absolute;left:-9999px;font-size:100px;font-family:' + "'" + fam + "'";
      s.textContent = t; document.body.appendChild(s);
      const r = s.getBoundingClientRect(); s.remove(); return r; };
    const H = mk('H'), I = mk('I'), M = mk('M');
    return { capW: +H.width.toFixed(2), capH: +H.height.toFixed(2),
             i: +I.width.toFixed(2), m: +M.width.toFixed(2) };
  }, regs.cFirst);
  /* condensed: a cap is narrower than the body face's 0.6em advance. */
  ok('a cap is narrower than it is tall -- the face is condensed, measured on the page',
     shape.capW > 0 && shape.capW < shape.capH * 0.75,
     'cap ' + shape.capW + ' wide in a ' + shape.capH + ' line');
  ok('and it is proportional, not a grid: I is narrower than M',
     shape.i > 0 && shape.m > shape.i + 5, 'I ' + shape.i + ' vs M ' + shape.m);

  /* ---- 7. THE PROSE AND THE GLASS KEEP THEIR OWN REGISTERS --------------- */
  const others = await c.evaluate(() => {
    const F = id => { const e = document.getElementById(id); return e
      ? getComputedStyle(e).fontFamily.split(',')[0].replace(/['"]/g,'') : null; };
    return { glass: F('cityfeedscreen'), card: F('daycardIn') };
  });
  ok('the phone glass is still in the screen register, the one place fixed pitch is legal',
     others.glass === regs.sFirst, String(others.glass));
  ok('the day card is still in the prose register -- writing is not a machine plate',
     others.card === regs.bFirst, String(others.card));

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})().catch(e => { console.error(e); process.exit(1); });
