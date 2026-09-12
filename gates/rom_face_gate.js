/* ============================================================================
   THE SCREEN HAS ITS OWN FACE (UI lane 11, 9/13/26) -- row [no slop].
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
   DIRECTION's ruling: records/BOHEMIA_THE_FONT_RESEARCH_9_11_26.md, sections 2-4.

   *** THE ONE LINE THIS ENFORCES: FIXED PITCH IS LEGAL ONLY WHERE THE IN-WORLD
   DEVICE IS A CHARACTER-CELL SCREEN. *** Before this row, all three type registers
   on the walked city resolved to the same outline monospace, so the ruling was in
   breach on every surface that is not a screen and nothing noticed, because a
   register that exists but resolves to one face everywhere is a name, not a system.

   WHAT IT ASKS, AND WHY EACH ONE IS THE REAL QUESTION RATHER THAN A PROXY:
     1. the screen register resolves to a DIFFERENT face than the casing register,
        which is the whole claim "there are registers" reduced to something false-
        ifiable. Point them at one face again and this goes red.
     2. the face actually LOADS and DRAWS -- measured by rendering a string in it
        and in a fallback and proving the widths differ, because a @font-face that
        404s leaves the text looking fine in the fallback and a gate that only reads
        the stylesheet would call that green.
     3. EVERY CHARACTER THE GLASS DRAWS IS COVERED BY THE GLASS'S OWN FACE. This is
        the leg that matters most and it is the one a person would not think to
        write: the phone's signal bars are U+25AE, which the first cut of the face
        did not have, so one glyph fell back to the outline face and the status bar
        was quietly two typefaces wide. Nobody sees that at 8px. The rule is not
        "does it have the characters I remembered", it is "does it have the ones the
        game actually puts on that surface", which cannot be satisfied by guessing.
     4. the casing is NOT given the screen's face just for sitting next to it.

     node gates/rom_face_gate.js
   ========================================================================== */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8842;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nTHE SCREEN HAS ITS OWN FACE: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }
const cityFrame = p => p.frames().find(f => /CITY_WORLD/.test(f.url()));
const ready = async p => { const t0 = Date.now();
  for (;;) { const c = cityFrame(p);
    if (c) { try { if (await c.evaluate(() => !!window.BOHEMIA_TEACH)) return c; } catch (_e) {} }
    if (Date.now() - t0 > 60000) return c || null;
    await p.waitForTimeout(250); } };

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
  if (!c) { await b.close(); srv.close(); done(); }
  await p.waitForTimeout(3000);

  /* 1. THE REGISTERS ARE DIFFERENT FACES, which is the claim in one line. */
  const regs = await c.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const first = v => (v || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    return { screen: cs.getPropertyValue('--face-screen').trim(),
             casing: cs.getPropertyValue('--face-casing').trim(),
             body:   cs.getPropertyValue('--face-body').trim(),
             sFirst: first(cs.getPropertyValue('--face-screen')),
             cFirst: first(cs.getPropertyValue('--face-casing')) };
  });
  ok('the screen register names a face before any fallback (' + (regs.sFirst || 'nothing') + ')',
     !!regs.sFirst);
  ok('and it is NOT the same face as the casing register -- a register that resolves to one '
     + 'face everywhere is a name, not a system (screen ' + regs.sFirst + ', casing '
     + regs.cFirst + ')', !!regs.sFirst && regs.sFirst !== regs.cFirst);

  /* 2. IT LOADS AND IT DRAWS. A @font-face that never arrives looks fine in the
        fallback, so ask the renderer, not the stylesheet. */
  const drew = await c.evaluate(async (fam) => {
    try { await document.fonts.load('16px "' + fam + '"'); } catch (_e) {}
    const mk = (ff) => { const s = document.createElement('span');
      s.textContent = 'MMMMMMMMMM'; s.style.cssText =
        'position:absolute;left:-9999px;top:0;font-size:40px;white-space:pre;font-family:' + ff;
      document.body.appendChild(s); const w = s.getBoundingClientRect().width;
      s.remove(); return w; };
    return { loaded: document.fonts.check('16px "' + fam + '"'),
             face: +mk('"' + fam + '",serif').toFixed(2),
             fallback: +mk('serif').toFixed(2) };
  }, regs.sFirst);
  ok('the screen face actually loaded in the page, not just in the stylesheet', drew.loaded === true);
  ok('and it really draws the text -- ten Ms measure differently in it than in the fallback ('
     + drew.face + ' vs ' + drew.fallback + ')', drew.loaded && drew.face !== drew.fallback);

  /* 3. THE GLASS IS SET IN IT, and everything on the glass inherits it. */
  const glass = await c.evaluate(() => {
    const f = document.getElementById('cityfeed'); if (f) f.style.display = 'flex';
    const s = document.getElementById('cityfeedscreen');
    if (!s) return null;
    const first = getComputedStyle(s).fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    const seen = new Set();
    (function walk(n){ if (n.nodeType === 3) { for (const ch of n.nodeValue) seen.add(ch); }
      else for (const k of n.childNodes) walk(k); })(s);
    return { first, chars: [...seen].filter(ch => ch.charCodeAt(0) > 31) };
  });
  ok('the phone glass exists to be measured', !!glass);
  if (!glass) { await b.close(); srv.close(); done(); }
  ok('the glass is drawn in the screen register -- the device carries the face, so everything '
     + 'on it inherits (' + glass.first + ')', glass.first === regs.sFirst);

  /* 4. EVERY CHARACTER THE GLASS DRAWS IS IN THAT FACE. */
  const uncovered = await c.evaluate(async ([fam, chars]) => {
    try { await document.fonts.load('16px "' + fam + '"'); } catch (_e) {}
    const cv = document.createElement('canvas').getContext('2d');
    const out = [];
    for (const ch of chars) {
      cv.font = '64px "' + fam + '", serif';
      const a = cv.measureText(ch).width;
      cv.font = '64px serif';
      const b = cv.measureText(ch).width;
      /* a glyph the face does not have falls through to serif and measures the same */
      if (a === b) out.push(ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase());
    }
    return out;
  }, [regs.sFirst, glass.chars]);
  ok('EVERY character the glass draws is covered by the glass\'s own face, so the status bar '
     + 'is never quietly two typefaces wide (' + glass.chars.length + ' distinct drawn'
     + (uncovered.length ? ', MISSING: ' + uncovered.join(' ') : ', none missing') + ')',
     uncovered.length === 0);

  /* 5. AND THE CASING DID NOT CATCH IT. The phone's case is not a screen; it must not
        inherit a screen's face just by being the glass's parent. */
  const casing = await c.evaluate(() => {
    const el = document.getElementById('modechip') || document.getElementById('sleepbtn')
            || document.querySelector('#hud');
    if (!el) return null;
    return getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  });
  ok('a control on the casing is NOT drawn in the screen face -- fixed pitch is legal only '
     + 'where the device is a screen (' + (casing || 'nothing found') + ')',
     !!casing && casing !== regs.sFirst);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})();
