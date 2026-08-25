/* ============================================================================
   FIRST NIGHT GATE (8/19/26, RUN lane).

   THE FIRST NIGHT HAD NEVER BEEN PLAYED AS A SEQUENCE. Nine beats now land in
   the player's first twenty minutes -- cold open, wake, the job on the phone,
   the offer, the market, the reckoning, the install line, the day 2 wake, the
   vista -- and each was built by a different turn against its own gate. Every
   one of those gates was green. THE BUG WAS IN THE SPACE BETWEEN THEM, which is
   the space no gate was watching, and it was not subtle:

     #openInvite (the shell's cold-open banner)   page y   40 -> 127
     the city's own toolbar                       page y   89 -> 120

   The toolbar was ENTIRELY INSIDE the banner. Covered: MUSIC, save, the builder
   drawer, and PHONE with its unread badge lit -- on the morning the wake card
   says "Something came in on your phone overnight. THE METER READER." The job
   comes in on the phone. The demo's core loop was blocked at minute one, by the
   story hook, and neither beat won: the family-at-the-table hook was a thin bar
   losing to a big gold GET UP button in the middle of the screen.

   WHAT THIS GATE HOLDS, and several of these exist because I got them wrong
   first and the measurement caught me:

     1. THE PHONE IS REACHABLE ON DAY 1 WHILE THE INVITE IS UP. Not "the rects
        do not intersect" -- it TAPS the phone at its own centre point, through
        the shell, and asserts the phone actually opens. The rect check is the
        cheap half; the tap is the true one.
     2. AND THE INVITE STANDS DOWN ENTIRELY while a city surface is open. The
        first cut only moved the banner below the toolbar and shipped that half
        -- measured, the phone SCREEN then ran 115-844 with the banner at
        121-208, so the top ninety pixels of the job list were still under it.
        Clearing a button and covering the surface behind it is moving a bug.
     3. IT COMES BACK when the surface closes. Standing down must not mean
        losing the invitation.
     4. THE COLD OPEN STILL WORKS: WATCH still plays it, NOT NOW still dismisses
        it and is still remembered. This gate must never be satisfiable by
        deleting the beat it is protecting.
     5. THE OFFSET IS DERIVED, NOT TYPED. The shell may not carry a hardcoded
        pixel height for another document's toolbar, and the source is checked
        for one -- that number is the bug, one commit later.
     6. THE WORLD IS NOT AN OVERLAY. The occlusion rule matched #cv, the world
        canvas itself (94% of the viewport), in its first cut -- which suppressed
        the banner permanently and would have shipped "the cold open never
        appears" INSIDE the fix for "the cold open covers the phone". Asserted
        directly, because it is the exact failure a naive rule reintroduces.
     7. ONE TAP TO PLAY. The whole reason this pass happened: the research on
        openings is blunt that stacked interruptions in the first minutes teach a
        player the game will keep interrupting him. Day 1 costs ONE tap.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('FIRST NIGHT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}
async function worldFrame(page) {
  for (let i = 0; i < 90; i++) {
    const f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
    if (f) return f;
    await SETTLE(page, 250);
  }
  return null;
}

/* ---- 1. the mechanism is derived, and the beat still exists -------------- */
{
  const a = fs.readFileSync(ALPHA, 'utf8');
  const c = fs.readFileSync(CITY, 'utf8');
  const acode = a.replace(/\/\*[\s\S]*?\*\//g, '');
  const ccode = c.replace(/\/\*[\s\S]*?\*\//g, '');

  ok('the fix is in the build', a.indexOf('__THE_COLD_OPEN_CLEARS_THE_TOOLBAR__') >= 0
     && c.indexOf('__THE_COLD_OPEN_CLEARS_THE_TOOLBAR__') >= 0);
  ok('THE CITY REPORTS ITS OWN CHROME rather than the shell guessing at it, and '
     + 'the number is MEASURED off its own toolbar',
     /postMessage\(\{bohemiaCityChrome:/.test(ccode)
     && /getElementById\('topbar'\)[\s\S]{0,400}?getBoundingClientRect\(\)/.test(ccode)
     && /top:\s*Math\.ceil\(r\.bottom\)/.test(ccode));
  ok('and the shell positions the invite from that report',
     /inv\.style\.top\s*=\s*\(typeof CITY_CHROME_TOP==='number'\?CITY_CHROME_TOP:0\)/.test(acode));
  /* THE NUMBER THAT MUST NOT EXIST. A hardcoded toolbar height in the shell is
     this bug again one commit later, and it would pass every other check here. */
  ok('and the shell carries NO hardcoded toolbar height for the city',
     !/openInvite[\s\S]{0,400}?style\.top\s*=\s*['"]?\d+px/.test(acode));
  /* THE BEAT MUST NOT WAIT ON ANOTHER DOCUMENT'S LOAD. The first cut held the
     banner back until the report arrived, which LOOKED principled -- no number,
     no guess -- and landed the pixels correctly, so this gate went green on it.
     Measured afterwards: the report arrives 8.5 SECONDS after the RUN tap,
     because the city is a 2.3MB document, so the story hook sat invisible for
     eight seconds and opening_gate went red. Before the city exists there is no
     toolbar to clear, so it opens where it always did and drops on the report. */
  ok('the banner does NOT wait on the city\'s load to be offered -- an empty '
     + 'panel has no toolbar to cover', !/typeof CITY_CHROME_TOP!=='number'\)\{ inv\.style\.display='none'/.test(acode));
  /* AND STANDING DOWN IS FOR SURFACES THAT REPLACE THE SCREEN, NOT SCRIMS. */
  ok('standing down is limited to OPAQUE surfaces -- a scrim like the day card is '
     + 'a modal over the world, and treating it as occluding meant the cold open '
     + 'was never offered at all', /parseFloat\(al\[1\]\)<1\) continue/.test(ccode));

  /* THE BEAT ITSELF IS STILL THERE. This gate must not be satisfiable by
     deleting the cold open. */
  ok('THE COLD OPEN STILL EXISTS: the invite, its words and both answers',
     /openInvite/.test(a) && /BEGINS BEFORE THE DAY/.test(a)
     && /openWatch/.test(a) && /openNot/.test(a));
  ok('WATCH still starts it and NOT NOW is still remembered',
     /openWatch[\s\S]{0,200}?openStart\(\)/.test(acode)
     && /openNot[\s\S]{0,300}?openMarkSeen\(\)/.test(acode));

  /* HIS FEET ARE THE TRUTH -- and homeFind must ask the player, not the camera.
     mktHub() and mktAt() already read the player's cell this way; homeFind was
     the one asking city.x, which is how the house ended up 38 cells away. */
  ok('the fix is in the build', c.indexOf('__HIS_FEET_ARE_THE_TRUTH__') >= 0);
  /* AMENDED 8/24, AND IT IS A STRENGTHENING RATHER THAN A LOOSENING. This read
     `_pcx=(MODE==='human')?((hx/FN)|0):city.x` as a literal source match. That
     expression is still here and still the answer whenever it is the right one --
     it just is not FIRST any more.
     WHY: Paolo, 8/24, "It's hard to find my house. It's not easy." The 8/19 fix
     stopped the CAMERA moving his house. Nothing stopped WALKING moving it: the
     cache keyed on the cell he was standing in, so crossing a district re-scanned
     the new cell and called a house there his home, and in a cell with no house
     homeFind returned null and he had no house at all (measured: the HOME marker
     drew at spawn and vanished after fourteen steps).
     Both fixes want the same thing -- THE HOUSE DOES NOT MOVE -- so the claim now
     asserts that directly, in three parts, and the camera clause is held to being
     the last resort rather than merely present. LANDED is the player's own
     position at drop-in, so HIS FEET ARE STILL THE TRUTH; they are just the feet
     he arrived on. */
  ok('homeFind resolves from the PLAYER, never the camera marker',
     /_pcx=_lcell\?_lcell\[0\]:\(\(MODE==='human'\)\?\(\(hx\/FN\)\|0\):city\.x\)/.test(ccode)
     && /const key=seed\+':'\+_pcx\+','\+_pcy/.test(ccode));
  ok('and his house is ONE house: anchored on where he LANDED, so walking into '
     + 'another district cannot hand him a different one',
     /_lcell=\(typeof LANDED!=='undefined'&&LANDED\)\?\[\(LANDED\[0\]\/FN\)\|0,\(LANDED\[1\]\/FN\)\|0\]:null/.test(ccode));
  ok('and the standing cell survives ONLY as the fallback for before he has '
     + 'dropped in, which is the one moment LANDED is null',
     ccode.indexOf('city.x') < 0 || /_lcell\?[^;]*city\.x/.test(ccode));
  ok('and it uses the same idiom mktHub/mktAt already used, rather than a new one',
     /\(MODE==='human'\)\?\(\(hx\/FN\)\|0\):city\.x/.test(ccode.replace(/var cx=/g, '')));

  /* THE WORLD IS NOT AN OVERLAY -- the regression that hid inside the fix. */
  ok('the occlusion rule requires a declared stacking level, so the world canvas '
     + 'is never mistaken for a surface over it', /z>=1/.test(ccode.replace(/\s/g, '')));
  ok('and it is a property, not a list of surface names (no phonewrap/daycard '
     + 'roll-call in the reporter)',
     !/cityOccluded[\s\S]{0,600}?(phonewrap|daycard|mktwrap)/.test(ccode));
}

/* ---- 1b. THE DAY CAN BE SPENT BY PLAYING -------------------------------- */
/* THE BUG: engine/bohemia_dayloop.js:109 was `mins = Math.max(0, mins | 0)`.
   `| 0` truncates, the walk ticks 0.084 min per fine cell, and 0.084|0 === 0 --
   so every step the player ever took was discarded. Each call truncated
   independently, so the remainder could never accumulate and WALKING COULD NEVER
   MOVE THE CLOCK, at any distance, forever. Measured with tick hooked: six cells
   walked, six calls of 0.084, 0.504 minutes owed, DAY.min 360 before and 360
   after. That is why the reckoning always read "0h lived - 16h given back" -- not
   a quiet day, a day that could not be spent by playing.
   AND DAY.step HAD NO CALLER AT ALL, so "N steps" was always 0 too. */
{
  const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_dayloop.js'), 'utf8');
  /* COMMENTS STRIPPED FIRST. The patch's own comment QUOTES the dead line so the
     next reader knows what was wrong, and the first cut of this check grepped the
     raw file and matched that comment -- a gate that reads prose as code. Same
     trap as the seed literal on 8/18. */
  const esrc = src.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('the day loop no longer truncates sub-minute time with `| 0`',
     !/mins\s*=\s*Math\.max\(0,\s*mins\s*\|\s*0\)/.test(esrc));

  const L = DL.make(); L.wake();
  const t0 = L.min;
  for (let i = 0; i < 12; i++) L.tick(0.084, 'suburb');
  ok('TWELVE WALKED CELLS COST ONE MINUTE -- the remainder accumulates instead of '
     + 'being thrown away (' + t0 + ' -> ' + L.min + ')', L.min === t0 + 1);
  for (let i = 0; i < 12; i++) L.tick(0.084, 'suburb');
  ok('and it keeps accumulating (' + L.min + ')', L.min === t0 + 2);

  /* THE HALF OF `| 0` THAT WAS DOING REAL WORK must survive: it also turned NaN
     and undefined into 0, and without that a bad caller freezes the day forever. */
  const S = DL.make(); S.wake(); const s0 = S.min;
  S.tick(NaN, 'x'); S.tick(undefined, 'x'); S.tick('abc', 'x'); S.tick(-5, 'x');
  ok('NaN / undefined / a string / a negative still cannot move or freeze the clock',
     S.min === s0);

  const W = DL.make(); W.wake(); W.tick(10, 'x');
  ok('and the whole-minute callers are untouched (advance(10) still spends 10)',
     W.min === 360 + 10);

  const P = DL.make(); P.wake(); P.tick(0.5, 'x');
  const Q = DL.make(); Q.restore(P.serialize()); Q.tick(0.5, 'x');
  ok('the sub-minute remainder rides the save, so a reload does not quietly lose it',
     Q.min === 361);

  const M = DL.make(); M.wake();
  for (let i = 0; i < 5; i++) M.step('suburb');
  ok('and DAY.step counts steps when something calls it', M.summary().steps === 5);
}

/* ---- 2. played, on the real alpha ---------------------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    const page = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.route(/^https?:/, r => r.abort());
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 2500);
    await page.evaluate(() => document.getElementById('front').click());
    await SETTLE(page, 4000);

    const f = await worldFrame(page);
    ok('the walked world is up in the RUN tab', !!f);
    if (!f) { await b.close(); done(); }

    for (let i = 0; i < 80; i++) { if (await f.$('#daycardIn .dcgo')) break; await SETTLE(page, 250); }

    /* ONE TAP TO PLAY */
    let taps = 0;
    for (let i = 0; i < 8; i++) {
      const up = await f.evaluate(() => {
        const c = document.getElementById('daycard');
        if (!c || getComputedStyle(c).display === 'none') return false;
        return !!document.querySelector('#daycardIn .dcgo');
      });
      if (!up) break;
      await f.$eval('#daycardIn .dcgo', el => el.click());
      taps++;
      await SETTLE(page, 900);
    }
    ok('DAY 1 COSTS ONE TAP before he is standing in the world (' + taps + ')', taps === 1);

    const frTop = await page.evaluate(() =>
      document.querySelector('#p-city iframe').getBoundingClientRect().top);
    const inv = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      const r = e.getBoundingClientRect();
      return { display: getComputedStyle(e).display, top: r.top, bottom: r.bottom,
               chrome: window.CITY_CHROME_TOP };
    });
    ok('THE COLD OPEN IS ACTUALLY OFFERED (it is on screen, not skipped)',
       inv.display !== 'none');
    ok('and the city reported its chrome so the shell had a real number ('
       + inv.chrome + ')', typeof inv.chrome === 'number' && inv.chrome > 0);

    const ph = await f.evaluate(() => {
      const e = document.getElementById('phonebtn');
      const r = e.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    });
    const pTop = ph.top + frTop, pBot = ph.bottom + frTop;
    const overlaps = inv.display !== 'none' && !(pBot <= inv.top || pTop >= inv.bottom);
    ok('THE PHONE BUTTON IS NOT UNDER THE BANNER (phone ' + Math.round(pTop) + '-'
       + Math.round(pBot) + ', banner ' + Math.round(inv.top) + '-'
       + Math.round(inv.bottom) + ')', !overlaps);

    /* THE TRUE TEST: tap it through the shell and see the phone open. */
    await page.mouse.click((ph.left + ph.right) / 2, (ph.top + ph.bottom) / 2 + frTop);
    await SETTLE(page, 1500);
    const open1 = await f.evaluate(() => {
      const p = document.getElementById('phonewrap');
      return !!p && getComputedStyle(p).display !== 'none';
    });
    ok('AND TAPPING IT REALLY OPENS THE PHONE -- the job arrives on the phone, so '
       + 'this is the demo\'s core loop, not a cosmetic overlap', open1 === true);

    /* AND THE BANNER STANDS DOWN while the phone is up */
    const invBusy = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, busy: window.CITY_BUSY };
    });
    ok('THE BANNER STANDS DOWN while the phone is open, instead of sitting on the '
       + 'job list', invBusy.display === 'none' && invBusy.busy === true);

    /* AND IT COMES BACK */
    await f.evaluate(() => { const c = document.getElementById('phoneclose');
      if (c) c.click(); else phoneClose(); });
    await SETTLE(page, 1500);
    const invBack = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, busy: window.CITY_BUSY };
    });
    ok('and it COMES BACK when he closes it -- standing down is not losing the '
       + 'invitation', invBack.display !== 'none' && invBack.busy === false);

    /* NOT NOW still works and is still an answer */
    await page.evaluate(() => document.getElementById('openNot').click());
    await SETTLE(page, 600);
    const gone = await page.evaluate(() => {
      const e = document.getElementById('openInvite');
      return { display: getComputedStyle(e).display, want: e.dataset.want };
    });
    ok('NOT NOW still dismisses it', gone.display === 'none');
    /* and a later chrome report must not resurrect a dismissed banner */
    await SETTLE(page, 1400);
    const stayGone = await page.evaluate(() =>
      getComputedStyle(document.getElementById('openInvite')).display);
    ok('and it STAYS dismissed -- a later chrome report never raises a banner he '
       + 'already answered', stayGone === 'none');

    /* ---- HE TAKES THE JOB BY TAPPING IT, NOT BY CALLING IT ------------- */
    /* demo_day_gate calls offerAccept() directly, so the CROSS-FRAME path --
       phone iframe -> city -> day loop -- had never been driven by a tap. It is
       the same class of seam as the shell/city bridge that was dead for weeks. */
    {
      const pf = page.frames().find(fr => /CURRENT_SLICE/.test(fr.url()));
      ok('the phone screen is really up as its own frame', !!pf);
      if (pf) {
        const b4 = await f.evaluate(() => ({ taken: !!OFFER_TAKEN,
          obj: (document.getElementById('qline') || {}).textContent || '' }));
        /* WAIT FOR THE BUTTON, DO NOT ASSUME THE SETTLE WAS LONG ENOUGH (8/20).
           This gate is green alone and went red inside the parallel suite: under
           CPU contention the phone frame had not finished painting its job list
           when the settle hit its ceiling, `.lv-take` was null, and the three
           claims after it fell over -- then the whole gate CRASHED on the next
           evaluate and abandoned its remaining twenty. A load flake is a real
           flake: it means the check was timing on a guess. So poll for the
           button the way the sleep fix says to, with a ceiling that still fails
           honestly if it truly never arrives. */
        let hit = false;
        try {
          /* state:'attached', NOT the default 'visible'. Measured 8/20: the
             default cost this gate fifteen claims in one edit. The button is in
             the phone frame's list and the tap works, but playwright's default
             wants a laid-out visible box and this frame does not give it one --
             so waitForSelector timed out on an element querySelector finds
             instantly. The condition I need is "it exists to be tapped". */
          await pf.waitForSelector('.lv-take', { state: 'attached', timeout: 8000 });
          hit = await pf.evaluate(() => {
            const t = document.querySelector('.lv-take');
            if (!t) return false; t.click(); return true;
          });
        } catch (e) { hit = false; }
        ok('the job has a TAKE IT he can actually tap', hit === true);
        await SETTLE(page, 1800);
        const now = await f.evaluate(() => ({ taken: !!OFFER_TAKEN,
          obj: (document.getElementById('qline') || {}).textContent || '' }));
        ok('TAPPING IT IN THE PHONE TAKES THE JOB, across the frame boundary',
           b4.taken === false && now.taken === true);
        ok('and an objective arrives in the city ("' + now.obj.trim().slice(0, 38) + '")',
           now.obj.trim() !== '');
      }
      await f.evaluate(() => { try { phoneClose(); } catch (e) { } });
      await SETTLE(page, 600);
    }

    /* ---- HIS HOUSE IS WHERE HE IS ------------------------------------- */
    /* THE BUG THIS CATCHES, measured on a clean boot before it was fixed:
         LANDED [6205,6271] -> body in cell (48,48)
         HOME_KEY "2691674296:37,22" -> his house resolved in cell (37,22)
       HIS OWN HOUSE WAS 38 CELLS FROM HIS FEET, every boot, and the phone
       pointed him at it. The marker started correct and was moved by the
       shell's BOHEMIA_GOTO_CELL, which forwards a cell from the RUN SLICE --
       a different surface with its own player -- and homeFind() keyed on the
       marker. Two surfaces, two players, one marker. */
    const house = await f.evaluate(() => {
      const h = homeFind();
      const body = { x: (hx / FN) | 0, y: (hy / FN) | 0 };
      return { body: body, marker: { x: city.x, y: city.y },
               homeCell: h ? { x: (h.x / FN) | 0, y: (h.y / FN) | 0 } : null,
               phoneHome: (phoneState() || {}).home || null,
               key: typeof HOME_KEY !== 'undefined' ? HOME_KEY : null };
    });
    ok('HIS HOUSE IS IN THE CELL HE IS STANDING IN -- body ' + JSON.stringify(house.body)
       + ', house ' + JSON.stringify(house.homeCell) + ' (it was 38 cells away)',
       !!house.homeCell && house.homeCell.x === house.body.x
       && house.homeCell.y === house.body.y);
    ok('and the phone points at that same house rather than one across the valley',
       !!house.phoneHome && !!house.phoneHome.cell
       && house.phoneHome.cell.x === house.body.x
       && house.phoneHome.cell.y === house.body.y);

    /* ---- AND HE CAN GET INTO A BUILDING BY WALKING --------------------- */
    /* THE COVERAGE HOLE THIS FILLS: demo_day_gate calls dayEnteredBuilding()
       directly, so "the job beat works" was proven and "a body can cross a
       threshold" never was. Measured 8/19 in a 129x129 sweep around the spawn:
       2,334 cells belong to enterable buildings and TWO could be walked into.
       massHasDoor counted FOUR door markers (hdoor, portal+enter, doorW, doorE)
       and the walk admitted through TWO -- so a house whose door is a doorW made
       the guard say "this building HAS a door", flipping the walk to its strict
       branch, which then could not see the marker the guard had just counted.
       THE GUARD LOCKED THE DOOR AND THREW AWAY THE KEY. His own front door was
       one of the eighteen refused. */
    const doors = await f.evaluate(() => {
      const R = 48; let enter = 0, usable = 0, nearest = null;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const c = cellAt(hx + dx, hy + dy); if (!c || !c.enter) continue;
        enter++;
        let hd = false; try { hd = massHasDoor(hx + dx, hy + dy); } catch (e) { }
        if (hd ? isDoorCell(c) : true) {
          usable++;
          const d = Math.abs(dx) + Math.abs(dy);
          if (!nearest || d < nearest.d) nearest = { d: d };
        }
      }
      return { enter: enter, usable: usable, nearest: nearest };
    });
    ok('WHAT COUNTS AS A DOOR IS ONE PREDICATE, so the guard and the walk cannot '
       + 'disagree (' + doors.usable + ' of ' + doors.enter + ' building cells admit '
       + 'him, it was 2)', doors.usable > 2);
    ok('and there is a door he can actually reach ('
       + (doors.nearest ? doors.nearest.d + ' cells' : 'NONE') + ')',
       !!doors.nearest && doors.nearest.d < 48);

    /* WALKED IN, BY HAND. A BFS over walkable cells stands in for a player's
       eyes; every move is a real pointer hold on the real pad. The presses are a
       FULL BEAT: movement is beat-quantised at 120 BPM, and a first cut at 220ms
       landed 8 steps of a 14-step path and looked like the door refusing him. */
    const went = await f.evaluate(async () => {
      const DIRS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
      const press = i => new Promise(res => {
        const p = document.querySelectorAll('#pad .pb')[i];
        p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        setTimeout(() => { p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); res(); }, 560);
      });
      const h = homeFind(); if (!h) return { err: 'no home' };
      const goal = { x: h.x, y: h.y };
      const dayBefore = { steps: DAY.summary().steps, min: DAY.min };
      const key = (x, y) => x + ',' + y, prev = new Map(), seen = new Set([key(hx, hy)]);
      let q = [[hx, hy]], found = null, iter = 0;
      while (q.length && !found && iter++ < 40000) {
        const [cx, cy] = q.shift();
        for (const [dx, dy] of DIRS) {
          const nx = cx + dx, ny = cy + dy, k = key(nx, ny);
          if (seen.has(k)) continue;
          if (Math.abs(nx - hx) > 90 || Math.abs(ny - hy) > 90) continue;
          if (Math.max(Math.abs(nx - goal.x), Math.abs(ny - goal.y)) <= 1) { prev.set(k, [cx, cy]); found = [nx, ny]; break; }
          const c = cellAt(nx, ny); if (!c || !c.walk) continue;
          seen.add(k); prev.set(k, [cx, cy]); q.push([nx, ny]);
        }
      }
      if (!found) return { err: 'no walkable path to his own door' };
      const path = []; let cur = found;
      while (cur && key(cur[0], cur[1]) !== key(hx, hy)) { path.push(cur); cur = prev.get(key(cur[0], cur[1])); }
      path.reverse();
      for (const [px, py] of path) {
        if (typeof INSIDE !== 'undefined' && INSIDE) break;
        const k = DIRS.findIndex(d => d[0] === Math.sign(px - hx) && d[1] === Math.sign(py - hy));
        if (k >= 0) await press(k);
      }
      if (!(typeof INSIDE !== 'undefined' && INSIDE)) {
        const k = DIRS.findIndex(d => d[0] === Math.sign(goal.x - hx) && d[1] === Math.sign(goal.y - hy));
        if (k >= 0) { await press(k); await press(k); }
      }
      return { inside: (typeof INSIDE !== 'undefined' && !!INSIDE),
               label: (typeof INSIDE !== 'undefined' && INSIDE) ? String(INSIDE.label) : null,
               entered: DAY.summary().entered,
               dayBefore: dayBefore,
               dayAfter: { steps: DAY.summary().steps, min: DAY.min },
               districts: DAY.summary().districts,
               fight: !!(window.__CITY_FIGHT_ON || (typeof CFIGHT !== 'undefined' && CFIGHT)),
               skippedHome: window.__FIGHT_SKIPPED_HOME || 0 };
    });
    ok('HE CAN WALK THROUGH HIS OWN FRONT DOOR -- by hand, on the real pad'
       + (went.err ? ' -- ' + went.err : ' (' + String(went.label).slice(0, 42) + ')'),
       went.inside === true);
    ok('and the day loop records that he went in, so the reckoning can say so',
       Array.isArray(went.entered) && went.entered.length > 0);
    /* NOT YOUR OWN HOUSE. The fight roll is deterministic off the footprint, so
       his house was not unlucky once -- it was a firefight forever. Screenshotted
       it: WAIT / SUPPRESS / RIFLE / ENGAGE over a street, while the readout still
       said "inside the garage interior". */
    ok('AND HIS OWN HOUSE IS NOT AN AMBUSH -- the odds are untouched, the house is '
       + 'exempt (skipped ' + went.skippedHome + ')', went.skippedHome >= 1);

    /* ---- AND HE CAN FINISH THE JOB, BY HAND ---------------------------- */
    /* THE WHOLE DEMO LOOP, WITH NOTHING CALLED FOR HIM. Every earlier proof of
       this beat went through demo_day_gate, which calls offerAccept() and
       dayEnteredBuilding() directly. Here he tapped GET UP, tapped PHONE, tapped
       TAKE IT, walked to his own door and crossed it -- and the quest's own
       choice card is what met him on the other side. */
    /* `.state` IS NULL WHEN NO JOB WAS TAKEN, and reading .stage off it threw --
       which killed the gate outright and abandoned the twelve claims after it.
       The step BEFORE this one is the thing that failed in that case; this one
       should say so, not detonate. Default the stage and let the claim be red. */
    const job = await f.evaluate(() => ({
      stage: ((DQ.serialize() || {}).state || {}).stage || null,
      cardUp: (() => { const c = document.getElementById('daycard');
        return !!(c && getComputedStyle(c).display !== 'none'); })(),
      options: [...document.querySelectorAll('#daycardIn .dcbtn')].map(b => b.innerText.trim().split('\n')[0]),
      indoorStepsBefore: DAY.summary().steps,
    }));
    ok('WALKING IN RAISES THE QUEST\'S OWN CHOICE CARD (' + job.options.join('/') + ')',
       job.cardUp === true && job.options.length >= 2);

    /* A STEP INDOORS IS STILL A STEP. Yesterday's fix went into the OUTDOOR
       mover; the interior one ticks the same 0.084 and never called DAY.step, so
       walking the length of a house counted zero. */
    const indoor = await f.evaluate(async () => {
      const before = DAY.summary().steps;
      const press = i => new Promise(res => {
        const p = document.querySelectorAll('#pad .pb')[i];
        p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        setTimeout(() => { p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); res(); }, 560);
      });
      for (const k of [0, 2, 4, 6, 1, 3]) await press(k);
      return { before: before, after: DAY.summary().steps, inside: !!INSIDE };
    });
    ok('A STEP INDOORS IS STILL A STEP -- the interior mover counts too now ('
       + (indoor.after - indoor.before) + ' walking around inside)',
       indoor.after > indoor.before);

    /* TAPPED THROUGH TO A RESOLUTION, and the payout is honest. */
    const done = await f.evaluate(async () => {
      const bs = document.querySelectorAll('#daycardIn .dcbtn');
      if (!bs.length) return { err: 'no options to tap' };
      const before = purseBalances();
      bs[0].click();
      await new Promise(r => setTimeout(r, 900));
      return { before: before, after: purseBalances(), done: DQ.done(), outcome: DQ.outcome(),
               tags: DQ.tags ? DQ.tags() : null,
               paid: window.__PAID || 0,
               refused: (typeof PAY_REFUSED !== 'undefined') ? PAY_REFUSED : null,
               objective: (document.getElementById('qline') || {}).textContent || '',
               cardStillUp: (() => { const c = document.getElementById('daycard');
                 return !!(c && getComputedStyle(c).display !== 'none'); })() };
    });
    ok('TAPPING AN OPTION RESOLVES IT to the quest author\'s own outcome ('
       + done.outcome + (done.tags ? ', tagged ' + done.tags.join('/') : '') + ')',
       done.done === true && !!done.outcome);
    ok('the card gets out of his way afterwards', done.cardStillUp === false);
    ok('and the objective line says so ("' + String(done.objective).trim().slice(0, 30) + '")',
       /DONE/i.test(done.objective || ''));
    /* THE PAYOUT IS ALLOWED TO BE NOTHING, AND MUST NEVER BE INVENTED. What a
       day's work pays is Paolo's ruling (EVERYTHING COSTS ONE, 8/15), so the
       honest outcomes are "paid" or a NAMED refusal -- never a number nobody
       ruled. This asserts the refusal is named rather than silent. */
    ok('FINISHING THE JOB REACHES THE PURSE, and with nothing ruled it pays NOTHING '
       + 'rather than inventing a number (' + (done.paid ? 'paid' : done.refused) + ')',
       done.paid >= 1 || done.refused === 'NO_RULING');

    /* ---- AND THAT WALK SPENT THE DAY ---------------------------------- */
    /* THE ASSERTION IS MADE OVER THE WALK TO HIS DOOR rather than a separate
       stroll, because that walk is already real outdoor movement driven by real
       pointer holds. A separate block ran AFTER he was indoors, where the
       interior mover does not count steps, and reported "walking counts 0" for
       entirely the wrong reason. */
    const gotSteps = went.dayAfter ? went.dayAfter.steps - went.dayBefore.steps : 0;
    const gotMins = went.dayAfter ? went.dayAfter.min - went.dayBefore.min : 0;
    ok('WALKING COUNTS AS STEPS on the surface he plays (' + gotSteps + ', it was '
       + 'always 0 because DAY.step had no caller)', gotSteps > 0);
    ok('AND WALKING SPENDS THE DAY (' + gotMins + ' minute(s); it was always 0 because '
       + '`mins | 0` truncated every 0.084 tick to nothing)', gotMins > 0);
    ok('and the district ledger records where that time actually went',
       Array.isArray(went.districts) && went.districts.some(d => d.mins > 0));

    /* WHILE HE IS IN HIS BODY, AN OUTSIDE SURFACE MAY NOT MOVE HIM. */
    const held = await f.evaluate(() => {
      MODE = 'human';
      const before = { x: city.x, y: city.y };
      window.postMessage({ type: 'BOHEMIA_GOTO_CELL', x: 3, y: 91 }, '*');
      return new Promise(r => setTimeout(() =>
        r({ before: before, after: { x: city.x, y: city.y } }), 350));
    });
    ok('a cell posted by another surface does NOT move him while he is walking '
       + '(' + JSON.stringify(held.before) + ' -> ' + JSON.stringify(held.after) + ')',
       held.after.x === held.before.x && held.after.y === held.before.y);
    /* AND THE CASE PAOLO ASKED FOR IS UNTOUCHED (7/28, "I want that reflected
       when I'm in the city menu"). A fix that broke this would be a trade, not
       a fix, so it is asserted in the same breath. */
    const moved = await f.evaluate(() => {
      MODE = 'city';
      window.postMessage({ type: 'BOHEMIA_GOTO_CELL', x: 3, y: 91 }, '*');
      return new Promise(r => setTimeout(() => r({ x: city.x, y: city.y }), 350));
    });
    ok('but in the CITY MENU the marker still follows it -- Paolo 7/28 is intact',
       moved.x === 3 && moved.y === 91);

    ok('no page error across the first night' + (errs.length ? ' -- ' + errs[0] : ''),
       errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => {
  /* A CRASH MUST STILL FILE ITS REPORT (8/20). When this fell over inside the
     parallel suite it printed one line about a null and swallowed the tally, so
     the log could not say whether it died at claim 3 or claim 50 -- and a check
     whose result you cannot read is the same failure as a check that never ran.
     Print how far it got and name the step that killed it. */
  console.log('  > FAIL the first night ran end to end without throwing -- ' + e.message);
  fail++;
  console.log('FIRST NIGHT GATE: ' + pass + ' passed, ' + fail + ' failed (CRASHED after claim '
    + (pass + fail - 1) + ', the rest never ran)');
  process.exit(1);
});
