/* ============================================================================
   HOME + PHONE GATE (8/11/26)

   Paolo: "How was this a run when my house isn't labeled and the Phone app that
   we worked so hard for isn't even implemented yet."

   Both were the same defect and it is the one this lane keeps repeating: THE WORK
   EXISTS AND IS NOT IN THE SURFACE HE TAPS. The phone was FINISHED -- 1.6 MB of
   it, Network feed with DMs, the ONE MAP over the real generated valley, Wallet,
   Profile -- sitting behind the alpha's SLICE tab, which is a developer tab. And
   the day loop woke him at 06:00 nowhere in particular, in a valley where nothing
   was his.

   THIS GATE DRIVES THE REAL CITY IN A REAL BROWSER, THE WAY A PLAYER DRIVES IT:
   it taps GET UP on the wake card, taps DROP IN, then taps PHONE. Every earlier
   attempt to check this by calling functions directly gave a WRONG ANSWER --
   swapMode() called from a harness throws on two PRE-EXISTING temporal-dead-zone
   faults in the city (updHud reads RIDING, the footprint walk reads IN_D4, both
   `let`s declared after the code that uses them), so a direct call measures a
   half-executed page. Tapping the buttons measures the game.

   WHAT IT REFUSES TO LET ROT:
     1. HOME exists, is a real enterable house, and is the SAME house twice
     2. you WAKE AT YOUR OWN DOOR, and the label is actually DRAWN there
     3. the label is not smeared over the whole valley (far away = not drawn)
     4. the PHONE button opens THE REAL SLICE -- the same file the SLICE tab
        loads, never a second copy that would drift
     5. the phone KNOWS WHERE HE IS: district, day, clock and the live objective,
        and its map's "you" blip is his actual cell. This is the half of the 7/27
        backlog entry that said "doesn't progress as I walk".
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PHONE = path.join(ROOT, 'slices/BOHEMIA_CURRENT_SLICE.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('HOME + PHONE GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---- 1. it is in the files the player loads ----------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('YOUR HOUSE is in the city he walks', c.indexOf('__YOUR_HOUSE__') >= 0);
  ok('the PHONE is in the city he walks', c.indexOf('__PHONE_IN_POCKET__') >= 0);
  ok('and the phone button opens the REAL slice, not a second copy',
     /PHONE_FR\.src\s*=\s*'BOHEMIA_CURRENT_SLICE\.html'/.test(c));
  ok('the phone slice it opens actually exists', fs.existsSync(PHONE));

  const p = fs.readFileSync(PHONE, 'utf8');
  ok('the phone can RECEIVE where he is (it is built, not just planned)',
     p.indexOf('__PHONE_LIVE__') >= 0 && p.indexOf('bohemiaPhoneWhere') >= 0);

  /* the source is what gets rebuilt; a fix that only lives in the artefact is a
     fix the next `node tools/build_current_slice.js` deletes. */
  const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'), 'utf8');
  ok('and it lives in the phone SOURCE, so a rebuild cannot delete it',
     src.indexOf('__PHONE_LIVE__') >= 0);
}

/* ---- 2. drive the real city, the way he drives it ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to drive the real city', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  /* offline on purpose: this is the phone-with-no-signal case, and the cold-boot
     fix means the world still comes up in ~3s instead of hanging on a font. */
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });

  for (let i = 0; i < 90; i++) {
    if (await pg.$('#daycardIn .dcgo')) break;
    await pg.waitForTimeout(200);
  }
  const woke = await pg.$('#daycardIn .dcgo');
  ok('the day opens with a WAKE card (the loop is alive here too)', !!woke);
  if (!woke) { await b.close(); done(); }
  await pg.click('#daycardIn .dcgo');                 // GET UP
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { const m = document.getElementById('mode'); if (m) m.click(); });
  await pg.waitForTimeout(1800);                      // the drop-in transition

  const home = await pg.evaluate(() => {
    const h = homeFind();
    if (!h) return { none: true };
    const c = cellAt(h.x + (h.w >> 1), h.y + (h.h >> 1));
    return {
      home: [h.x, h.y, h.w, h.h],
      enter: (c && c.enter) || '',
      pos: [hx, hy],
      dist: Math.round(Math.hypot(h.x + h.w / 2 - hx, h.y + h.h / 2 - hy)),
      woke: window.__WOKE_HOME || 0,
      label: window.__HOME_LABEL || 0,
      cell: h.cell
    };
  });
  ok('HOME resolves to a real building in the district he spawns in', !home.none);
  if (!home.none) {
    ok('and it is a HOUSE, off the world model, not a shed or a lot'
       + ' ("' + home.enter.slice(0, 34) + '")', /house/i.test(home.enter));
    ok('HE WAKES AT HIS OWN DOOR (' + home.dist + ' cells from the middle of it)',
       home.woke >= 1 && home.dist <= Math.max(home.home[2], home.home[3]));
    ok('and the word HOME is actually DRAWN there -- a label nobody sees is not a'
       + ' label (' + home.label + ' draws)', home.label >= 1);
  }

  /* the SAME house twice: a home that moves is not a home */
  const twice = await pg.evaluate(() => {
    const a = homeFind(); HOME_KEY = null; const c = homeFind();
    return (a && c) ? (a.x === c.x && a.y === c.y && a.w === c.w && a.h === c.h) : false;
  });
  ok('re-resolving from scratch finds the SAME house (it cannot wander)', twice === true);

  /* BOUNDED: stand far away and the label must not draw */
  const far = await pg.evaluate(() => {
    const h = homeFind(), p0 = [hx, hy];
    hx = h.x + 300; hy = h.y + 300;
    window.__HOME_LABEL = 0; render();
    const n = window.__HOME_LABEL || 0;
    hx = p0[0]; hy = p0[1]; render();
    return n;
  });
  ok('standing 300 cells away, the label is NOT drawn (' + far + ')', far === 0);

  /* ---- 3. the phone ----------------------------------------------------- */
  await pg.click('#phonebtn');
  let fr = null;
  for (let i = 0; i < 80; i++) {
    fr = pg.frames().find(f => /CURRENT_SLICE/.test(f.url()));
    if (fr) { try { if (await fr.evaluate(() => typeof LIVE !== 'undefined')) break; } catch (e) {} }
    await pg.waitForTimeout(500);
  }
  ok('tapping PHONE opens the phone, in the run', !!fr);
  const bar = await pg.evaluate(() => ({
    on: PHONE_ON, vis: !!document.querySelector('#phonewrap.on'),
    bar: (document.getElementById('phonewhere') || {}).textContent || ''
  }));
  ok('the phone is actually on screen', bar.on === true && bar.vis === true);

  if (fr) {
    await pg.waitForTimeout(1200);
    const live = await fr.evaluate(() => ({
      live: LIVE,
      strip: (document.querySelector('.live-strip') || {}).textContent || '',
      tile: (typeof player !== 'undefined' && player.tile) ? [player.tile.x, player.tile.y] : null
    }));
    ok('THE PHONE KNOWS WHERE HE IS -- district, day and clock',
       !!live.live && !!live.live.district && live.live.day >= 1 && /^\d\d:\d\d$/.test(live.live.clock || ''));
    ok('and it shows him, on the phone, not just in a variable ("'
       + live.strip.slice(0, 40) + '")',
       live.strip.toUpperCase().indexOf(String(live.live.district).toUpperCase()) >= 0);
    ok('it carries TODAY\'S JOB in the quest\'s own words',
       !!live.live.objective && live.strip.indexOf(live.live.objective) >= 0);
    ok('the map\'s "you" blip is HIS cell, not a demo actor parked at a start tile',
       !!live.tile && live.tile[0] === live.live.cell.x && live.tile[1] === live.live.cell.y);
    ok('and the phone knows where HOME is, so it can draw it',
       !!live.live.home && !!live.live.home.cell);
  }

  await b.close();
  ok('no page error through wake, drop in, walk and phone'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  done();
})();
