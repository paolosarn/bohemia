/* ============================================================================
   COLD BOOT GATE (8/11/26) — the game starts on a bad signal, and the gates find
   the real frame.

   TWO REGRESSIONS THIS EXISTS TO KILL, both found the same afternoon, both
   invisible to every gate in the suite.

   1. THE FONT HELD THE GAME HOSTAGE. A render-blocking <link> to
      fonts.googleapis.com sat on a connection timeout when the host was
      unreachable. Measured on the city:

          network normal (this sandbox is offline)   16.0s to world-ready
          every http(s) request aborted instantly     3.1s to world-ready

      Thirteen of those sixteen seconds were a dead socket, not the world. Paolo
      demos on an iPhone, and a phone on cellular, a captive-portal wifi, or a
      basement IS the unreachable case -- sixteen seconds of white screen reads
      as broken, on the one impression that counts. So this gate boots the city
      WITH THE NETWORK DEAD and holds it to a ceiling.

      A NOTE ON THE CEILING: it is deliberately generous (12s) against a measured
      3.2s. It is not a performance budget -- it is a tripwire for the specific
      failure of a blocking third-party request, which costs whole multiples, not
      percent. A tight budget here would go red on a slow CI box and teach the
      fleet to ignore this gate.

   2. THE GATES WERE MEASURING A BLANK DOCUMENT. Five browser gates crashed with
      `ReferenceError: om is not defined`, three of them already red on
      origin/main. Callers pick the city with

          page.frames().find(fr => CITY.isFrame(fr, page))

      and find() takes the FIRST match. isFrame still matched bare /srcdoc/ --
      true of how the city loaded before 8/2, meaningless now -- and the alpha
      carries more than one srcdoc frame. The first match was somebody else's
      EMPTY frame, so a dozen gates ran their whole measurement in a blank
      document. This gate pins the predicate's ordering directly, because the
      thing that broke was a SHARED RESOLVER and nothing owned it.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('COLD BOOT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const CEILING_MS = 12000;

/* ---- 1. NO THIRD-PARTY REQUEST MAY BLOCK THE PARSER --------------------- */
{
  const src = fs.readFileSync(CITY, 'utf8');
  ok('the cold-boot fix is in the surface he plays', src.indexOf('__COLD_BOOT__') >= 0);

  /* every stylesheet <link> to an EXTERNAL host must be non-blocking. A
     <noscript> copy is legitimate and is skipped: it only applies when scripting
     is off, and then there is no game to hold up anyway. */
  const noNoscript = src.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  const links = noNoscript.match(/<link\b[^>]*>/g) || [];
  const blocking = links.filter(t =>
    /rel\s*=\s*["']?stylesheet/i.test(t) &&
    /https?:\/\//i.test(t) &&
    !/media\s*=\s*["']?print/i.test(t));
  ok('NO external stylesheet blocks the parser (' + links.length + ' links, '
     + blocking.length + ' blocking)' + (blocking.length ? ' -- ' + blocking[0].slice(0, 90) : ''),
     blocking.length === 0);
  ok('and the one we fixed still swaps itself in when the network IS good',
     /onload\s*=\s*["']this\.media=/.test(src));
}

/* ---- 2. THE SHARED FRAME PREDICATE PREFERS THE REAL CITY ---------------- */
{
  const mk = u => ({ url: () => u });
  const empty = mk('about:srcdoc');
  const real = mk('file:///x/slices/BOHEMIA_CITY_WORLD.html');
  const main = mk('file:///x/slices/BOHEMIA_ALPHA_0_9.html');
  const page = { mainFrame: () => main, frames: () => [main, empty, real] };

  ok('the real city frame is recognised', CITY_APP.isFrame(real, page) === true);
  ok('a stray srcdoc frame is NOT, when a named city frame exists on the page '
     + '(this is the exact bug: find() returned the empty one)',
     CITY_APP.isFrame(empty, page) === false);
  ok('the page\'s own main frame is never the city', CITY_APP.isFrame(main, page) === false);

  /* and find(), the way every caller actually spells it, now lands on the city */
  const picked = page.frames().find(fr => CITY_APP.isFrame(fr, page));
  ok('page.frames().find(isFrame) selects the CITY, not the blank document',
     picked === real);

  /* backward compatibility: a surface that really does srcdoc the app still works */
  const legacyPage = { mainFrame: () => main, frames: () => [main, empty] };
  ok('a surface that genuinely srcdocs the city still resolves (no named frame present)',
     CITY_APP.isFrame(empty, legacyPage) === true);
}

/* ---- 3. IT ACTUALLY BOOTS WITH THE NETWORK DEAD ------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to boot the city cold', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  /* kill every http(s) request instantly. file:// is untouched, so the game
     itself loads -- this simulates a phone with no usable signal, which is the
     case that produced the sixteen seconds. */
  await pg.route(/^https?:/, r => r.abort());
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));

  const t0 = Date.now();
  await pg.goto('file://' + CITY, { waitUntil: 'domcontentloaded', timeout: 120000 });
  let ready = null;
  for (let i = 0; i < 600; i++) {
    try {
      if (await pg.evaluate(() => typeof om !== 'undefined' && typeof cellAt !== 'undefined'
                                && typeof DAY !== 'undefined')) { ready = Date.now() - t0; break; }
    } catch (e) {}
    await SETTLE(pg, 50);
  }
  await b.close();

  ok('the city becomes playable AT ALL with the network dead', ready !== null);
  ok('and it does it under ' + (CEILING_MS / 1000) + 's (measured ' + ready + 'ms; it was '
     + '16000ms with the font blocking)', ready !== null && ready < CEILING_MS);
  ok('with no page error on the offline path' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
