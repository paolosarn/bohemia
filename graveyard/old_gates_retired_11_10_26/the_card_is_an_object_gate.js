/* ============================================================================
   THE CARD IS AN OBJECT  (UI lane 11, 9/16)  -- row [no slop], round nine.
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md

   Two entries on the law's own list of tells are "a grey one-pixel border on every
   card" and "the rounded card as the way to group". After eight rounds the biggest
   single owner of BOTH on the walked city was #daycardIn -- 5 hairlines and 8 radii --
   which is the card he meets in the first five seconds of the game, every time.

   *** THE FINDING THAT MADE THIS ROUND: GET UP WAS WEARING THREE EDGES AT ONCE. ***
   .dcgo is named in the city's own object rule (a bevelled box: border 0, radius 0, a
   clip-path cut corner), and a later rule with the same specificity put border-radius:9px
   and a 1px hairline straight back on top of it. Measured on the real card before a line
   was changed: clip-path YES, border 1, radius 9. The bevel had been drawn underneath a
   rounded hairline box nobody meant to keep. The card's own border and radius were the
   same shape of rot in reverse: the skin has cancelled them with !important since round
   three, so they painted nothing for days while still counting as two tells and still
   telling the next reader this card is a rounded hairline box.

   SO THIS GATE ASKS THE RENDERED CARD, NOT THE STYLESHEET. A declaration that a later
   rule cancels reads exactly like a declaration that works.

   AND IT GUARDS THE MEANING, NOT ONLY THE LOOK. .rpend was DASHED on purpose -- that is
   how a not-settled row differed from a settled one. Deleting a tell and silently costing
   the player a distinction is a worse trade than keeping the tell, so the dashed edge was
   translated into the object language (solid rows stand proud, the pending row is
   recessed) and the gate holds the DIFFERENCE, not the decoration.

   Run: node gates/the_card_is_an_object_gate.js
   ========================================================================== */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8865;
const MIN = 44;

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = () => { console.log('\nTHE CARD IS AN OBJECT: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.json':'application/json','.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,'');
  const f=path.join(SLICES, rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type', TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

/* WAIT FOR THE SURFACE TO SAY IT IS READY, never a number of seconds: this city needs
   24.2 s before it answers at all, and this lane has published one wrong diagnosis
   taken from a probe that measured at five. */
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
              catch (e2) { ok('playwright is available to measure the card', false); done(); } }

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

  const card = await c.evaluate(() => {
    const el = document.getElementById('daycardIn');
    if (!el) return { err: 'no card' };
    if (getComputedStyle(el).display === 'none') return { err: 'card not open' };
    const read = (e) => {
      const cs = getComputedStyle(e);
      const bw = ['Top','Right','Bottom','Left'].map(s => parseFloat(cs['border'+s+'Width']) || 0);
      const br = ['TopLeft','TopRight','BottomRight','BottomLeft'].map(s => parseFloat(cs['border'+s+'Radius']) || 0);
      const r = e.getBoundingClientRect();
      return { who: (e.id ? '#'+e.id : '.'+(e.getAttribute('class')||e.tagName)),
               border: Math.max(...bw), radius: Math.max(...br),
               shadow: cs.boxShadow || 'none',
               clip: !!(cs.clipPath && cs.clipPath !== 'none'),
               w: Math.round(r.width), h: Math.round(r.height),
               text: (e.textContent||'').trim().slice(0,26) };
    };
    const all = [read(el)];
    el.querySelectorAll('*').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      all.push(read(e));
    });
    return { all, round: getComputedStyle(document.documentElement)
                          .getPropertyValue('--skin-chipround').trim() || '2px' };
  });
  ok('the card he meets first could be opened and measured', !card.err, card.err || '');
  if (card.err) { await b.close(); srv.close(); done(); }

  /* ---- 1. NO HAIRLINE ANYWHERE ON THE CARD ------------------------------- */
  const hair = card.all.filter(x => x.border > 0);
  ok('nothing on the card is drawn with a one-pixel border',
     hair.length === 0, hair.map(x => x.who + ' ' + x.border).slice(0,4).join(', '));

  /* ---- 2. NO ROUNDED CARDS ---------------------------------------------- */
  /* The skin's own corner is allowed; a rounded CARD is the tell, and the difference is
     size. Anything above 4px is the rounded-box idiom rather than a softened edge. */
  const CAP = 4;
  const round = card.all.filter(x => x.radius > CAP);
  ok('nothing on the card is a rounded card (over ' + CAP + 'px)',
     round.length === 0, round.map(x => x.who + ' ' + x.radius).slice(0,4).join(', '));

  /* ---- 3. THE THINGS HE PRESSES ARE OBJECTS, NOT RECTANGLES -------------- */
  /* An object has a bottom. A flat fill with no offset shadow is a div; the skin gives a
     lit rim above and a dark base below. This is the positive half of the law: deleting
     the hairline without giving the thing a body just makes it flatter. */
  const rows = card.all.filter(x => /(^|\s)\.dcbtn/.test(x.who) || x.who === '.dcbtn');
  ok('the answers he reads are real rows on the card', rows.length > 0, rows.length + ' found');
  const flat = rows.filter(x => x.shadow === 'none' || !/inset/.test(x.shadow));
  ok('and every one of them has a body -- a lit rim and a dark base, not a flat fill',
     rows.length > 0 && flat.length === 0, flat.map(x => x.who).slice(0,3).join(', '));

  /* ---- 4. GET UP WEARS EXACTLY ONE EDGE TREATMENT ------------------------ */
  const go = card.all.find(x => x.who === '.dcgo' || /dcgo/.test(x.who));
  ok('the way out of the card is there to measure', !!go, go ? go.text : 'missing');
  if (go) {
    /* the bevel is the city's own box; a border or a radius on top of it is the
       second and third edge this round went looking for */
    ok('GET UP is the city\'s bevelled box and nothing else is drawn round it',
       go.clip === true && go.border === 0 && go.radius === 0,
       'clip ' + go.clip + ', border ' + go.border + ', radius ' + go.radius);
  }

  /* ---- 5. THE PENDING ROW STILL READS AS UNSETTLED ----------------------- */
  /* THE MEANING, NOT THE DECORATION. It used to be dashed. It is a recess now, and what
     this leg holds is that it is still DIFFERENT from a settled row -- because a tell
     removed at the cost of a distinction the player could see is a bad trade. The card on
     screen at boot carries no .rpend, so this reads the stylesheet's own two rules and
     asserts they disagree; when a reckoning card is on screen the shapes are measured. */
  const live = card.all.find(x => /rpend/.test(x.who));
  if (live) {
    const solid = card.all.find(x => /rrow|mrow/.test(x.who));
    ok('a pending row still reads differently from a settled one',
       !!solid && live.shadow !== solid.shadow, live.shadow.slice(0, 40));
  } else {
    const src = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
    const grab = (sel) => {
      const i = src.indexOf('#daycardIn ' + sel + '{');
      return i < 0 ? '' : src.slice(i, src.indexOf('}', i));
    };
    const pend = grab('.rpend'), row = grab('.rrow');
    ok('the pending row keeps a shape of its own, and it is not a dashed hairline',
       !!pend && !/dashed/.test(pend) && /box-shadow/.test(pend) && pend !== row,
       pend ? (/dashed/.test(pend) ? 'still dashed' : 'recessed') : 'rule not found');
  }

  /* ---- 6. THE REACH SURVIVED THE RESTYLE --------------------------------- */
  /* Every previous round that moved these boxes cost a tap somewhere. */
  const small = card.all.filter(x => /dcbtn|dcgo|dcx/.test(x.who) && (x.w < MIN - 0.5 || x.h < MIN - 0.5));
  ok('every control on the card is still 44 on an iPhone in portrait',
     small.length === 0, small.map(x => x.who + ' ' + x.w + 'x' + x.h).slice(0,3).join(', '));

  /* ---- 7. AND THE DEAD DECLARATIONS ARE GONE, NOT OVERRIDDEN ------------- */
  /* The ruler reads source. A cancelled declaration paints nothing and still counts, and
     still tells the next reader the wrong thing about this card. */
  const src = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  /* THE CARD'S OWN RULE, NOT A VARIANT OF IT. The first cut of this leg took the first
     '#daycardIn{' in the file, which is '#daycard.roadcard #daycardIn{' -- a different rule
     with none of the declarations this leg is about, so it passed green while measuring
     nothing. Anchored to the start of a line, which is where the card's own rule begins. */
  const i = src.indexOf('\n#daycardIn{');
  const own = i < 0 ? '' : src.slice(i + 1, src.indexOf('}', i));
  ok('the card\'s own rule no longer declares a border or a card radius at all',
     !!own && !/border\s*:\s*1px/.test(own) && !/border-radius\s*:\s*1[0-9]px/.test(own),
     own ? own.replace(/\s+/g,' ').slice(0,60) : 'rule not found');

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})().catch(e => { console.error(e); process.exit(1); });
