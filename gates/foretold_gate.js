/* ============================================================================
   A CRISIS ANNOUNCED IN ADVANCE (9/6/26, UI lane 11) -- VAMILY [crisis warning]
   / BB-FORETOLD.

   THE ROW: "A CRISIS ANNOUNCED IN ADVANCE IS THE DESIGN, NOT A COURTESY... the
   player has to be able to SEE the buildup. This is the display half of WORLD
   BB-SLOWER-EVERY-TIME, and without it that row is a simulation nobody can
   perceive. An escalation the player cannot see coming is not tension, it is an
   ambush."

   MEASURED FIRST, AND IT CHANGED THE JOB. WORLD has NOT shipped
   BB-SLOWER-EVERY-TIME, so there is no critical-slowing-down signal to display and
   inventing one would be taking another lane's row. But THE-VALLEY-RUNS-OUT is
   shipped and REAL: the valley eats its stocks daily, daysLeft comes off numbers
   nobody typed, and the night a good hits zero is a beat on the nightfall card.
   THE CRISIS ALREADY RUNS. What was missing is precisely the row's complaint --
   YOU COULD ONLY SEE IT AT BEDTIME, once a night, on one card, with the whole
   approach invisible in between. That is the ambush.

   WHAT THIS HOLDS:
     A  the buildup is visible DURING PLAY, on the feed, not only at nightfall
     B  IT ESCALATES: the closer the crisis, the more often the valley says so --
        the row's own picture of a buildup
     C  IT IS SILENT WHEN THERE IS NOTHING COMING. A warning that is always on is
        wallpaper, and this screen has been asked five times for less furniture
     D  *** IT DOES NOT STEAL THE NIGHTFALL BEAT. *** valleyRunsOut() MUTATES
        (it writes L.__gone to decide what ran out TONIGHT, which is what makes
        that beat fire once instead of every night forever). A display that called
        it to have a look would quietly eat another lane's shipped moment. This
        reads BohemiaEconomy.report(), which is pure. The leg proves the mutation
        is untouched, because "I was careful" is not a gate.
     E  the numbers are READ, never typed: what it says tracks the real ledger
     F  it says the name of the thing that is running out, not a generic alarm

   Every leg runs on the REAL served demo -- never off disk, where the same-origin
   injections silently no-op and a gate grades a build no player gets.

     node gates/foretold_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8805;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nA CRISIS ANNOUNCED IN ADVANCE: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

const cityFrame = p => p.frames().find(f => /CITY_WORLD/.test(f.url()));
/* wait for the END of the city's script, never a number of seconds */
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
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1200);
  await p.mouse.click(195, 509);
  const c = await ready(p);
  ok('the walked city is up to measure against', !!c);
  if (!c) { done(); }
  await p.waitForTimeout(2000);

  const there = await c.evaluate(() => !!(window.BOHEMIA_FORETOLD && window.BOHEMIA_FEED));
  ok('the valley can warn you at all, and it has the feed to say it on', there);
  if (!there) { done(); }

  /* ---- C: SILENT WHEN NOTHING IS COMING --------------------------------- */
  const quiet = await c.evaluate(() => {
    const F = window.BOHEMIA_FORETOLD;
    F.reset();
    /* a valley with plenty of everything: stock far above daily need */
    const L = (typeof MKT_LEDGER !== 'undefined' && MKT_LEDGER) ? MKT_LEDGER : (mktLedger && mktLedger());
    if (!L) return { skip: 'no ledger' };
    const keep = JSON.parse(JSON.stringify(L.stocks));
    Object.keys(L.stocks).forEach(k => { L.stocks[k] = 100000; });
    const said = F.check(false);
    const s = F.scarcest();
    L.stocks = keep;
    return { said: said, days: s ? s.daysLeft : null };
  });
  ok('with the shelves full it says NOTHING -- a warning that is always on is '
     + 'wallpaper (scarcest ' + (quiet.days == null ? 'none' : Math.round(quiet.days) + 'd') + ')',
     quiet.skip === 'no ledger' || quiet.said === null);

  /* ---- A + E + F: IT SPEAKS AS THE REAL NUMBER FALLS --------------------- */
  const spoke = await c.evaluate(() => {
    const F = window.BOHEMIA_FORETOLD;
    const L = (typeof MKT_LEDGER !== 'undefined' && MKT_LEDGER) ? MKT_LEDGER : (mktLedger && mktLedger());
    if (!L) return { skip: 'no ledger' };
    const keep = JSON.parse(JSON.stringify(L.stocks));
    const out = { steps: [] };
    /* squeeze ONE good down through the rungs, using the real daily-need maths */
    const good = Object.keys(L.stocks)[0];
    const need = (window.BohemiaEconomy && BohemiaEconomy.GOODS[good])
      ? (BohemiaEconomy.daysLeft(L, good) > 0 ? L.stocks[good] / BohemiaEconomy.daysLeft(L, good) : 1) : 1;
    Object.keys(L.stocks).forEach(k => { L.stocks[k] = 100000; });
    for (const days of [6, 2, 0.5]) {
      F.reset();
      L.stocks[good] = need * days;
      const r = F.check(false);
      out.steps.push({ want: days, got: r, seen: BohemiaEconomy.daysLeft(L, good) });
    }
    L.stocks = keep;
    return out;
  });
  const steps = spoke.steps || [];
  ok('as the real ledger falls the valley starts talking about it, during play, '
     + 'without waiting for bedtime (' + steps.filter(s => s.got).length + ' of '
     + steps.length + ' rungs spoke)',
     steps.length === 3 && steps.every(s => s.got && s.got.txt));
  ok('and it names the thing that is running out, rather than sounding a generic '
     + 'alarm ("' + (steps[0] && steps[0].got ? steps[0].got.txt : '-') + '")',
     steps.every(s => s.got && s.got.txt.indexOf(String(s.got.good).toLowerCase()) >= 0));
  ok('and the rung it picks tracks the real number, not a guess (' 
     + steps.map(s => Math.round(s.seen*10)/10 + 'd->' + (s.got ? s.got.rung : '-')).join(', ') + ')',
     steps.length === 3 && steps[0].got.rung === 'week'
     && steps[1].got.rung === 'close' && steps[2].got.rung === 'last');

  /* ---- B: IT ESCALATES --------------------------------------------------- */
  const cadence = await c.evaluate(() => window.BOHEMIA_FORETOLD.rungs());
  const shrinking = cadence.every((r, i) => i === 0 || r.every < cadence[i-1].every);
  ok('the closer it gets the MORE OFTEN the valley brings it up, which is the row\'s '
     + 'own picture of a buildup (' + cadence.map(r => r.days + 'd every ' + r.every + ' beats').join(', ')
     + ')', shrinking === true && cadence.length >= 3);

  /* ---- the words actually reach the feed --------------------------------- */
  const reached = await c.evaluate(() => {
    const F = window.BOHEMIA_FORETOLD, FEED = window.BOHEMIA_FEED;
    const L = (typeof MKT_LEDGER !== 'undefined' && MKT_LEDGER) ? MKT_LEDGER : null;
    if (!L) return { skip: 1 };
    const keep = JSON.parse(JSON.stringify(L.stocks));
    const good = Object.keys(L.stocks)[0];
    const dl = BohemiaEconomy.daysLeft(L, good);
    const need = dl > 0 ? L.stocks[good] / dl : 1;
    Object.keys(L.stocks).forEach(k => { L.stocks[k] = 100000; });
    L.stocks[good] = need * 2;
    const before = FEED.count();
    F.reset(); const r = F.check(false);
    const after = FEED.posts();
    L.stocks = keep;
    return { before, added: after.length - before,
             last: after.length ? after[after.length-1] : null, said: !!r };
  });
  ok('and the warning actually lands on the feed the player is reading, tagged as a '
     + 'draft so WORDS can edit it (' + JSON.stringify(reached.last) + ')',
     reached.skip === 1 || (reached.said && reached.last
       && reached.last.kind === 'world' && reached.last.draft === true));

  /* ---- D: IT DOES NOT STEAL THE NIGHTFALL BEAT --------------------------- */
  const untouched = await c.evaluate(() => {
    const F = window.BOHEMIA_FORETOLD;
    const L = (typeof MKT_LEDGER !== 'undefined' && MKT_LEDGER) ? MKT_LEDGER : null;
    if (!L) return { skip: 1 };
    const keep = JSON.parse(JSON.stringify(L.stocks));
    const keepGone = L.__gone ? L.__gone.slice() : undefined;
    /* put a good at zero: valleyRunsOut() would record it as gone TONIGHT */
    const good = Object.keys(L.stocks)[0];
    L.stocks[good] = 0;
    delete L.__gone;
    /* the display looks, hard, many times */
    for (let i = 0; i < 40; i++) { F.scarcest(); F.check(true); }
    const stolenBy = L.__gone;                 /* must still be undefined */
    /* and the nightfall beat still fires, first time, with that good in it */
    const v = valleyRunsOut();
    const fired = !!(v && v.tonight && v.tonight.indexOf(good) >= 0);
    L.stocks = keep; if (keepGone === undefined) delete L.__gone; else L.__gone = keepGone;
    return { stolenBy, fired, good };
  });
  ok('*** LOOKING AT THE CRISIS DOES NOT CONSUME IT *** -- 40 reads leave the '
     + 'nightfall bookkeeping untouched (L.__gone still '
     + JSON.stringify(untouched.stolenBy) + ')',
     untouched.skip === 1 || untouched.stolenBy === undefined);
  ok('and the nightfall card still gets its once-only beat afterwards, naming the '
     + 'good that ran out (' + untouched.good + ')',
     untouched.skip === 1 || untouched.fired === true);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  await b.close(); srv.close(); done();
})();
