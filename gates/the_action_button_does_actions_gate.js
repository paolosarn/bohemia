const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE ACTION BUTTON DOES ACTIONS (8/26/26, RUN lane)
   THE PLAYTEST DISPATCH item 6, LOCKED 8/25. He said it twice.

     "I HATE THAT THE ACTION BUTTON IS THE CITY BUTTON I WANT TO CHANGE THAT I
      SCROLL OUT AND SCROLL INTO THE CITY NOT BY CLICKING THE ACTION BUTTON"

     "the action button shouldn't be the city button, bro ... Like, you haven't
      even done that."

   HIS SENTENCE HAS TWO HALVES AND THE SECOND ONE WAS NEVER BUILT.

   HALF ONE, ZOOM, WAS ALREADY DONE, and this gate measures it rather than
   arguing: a real two-finger pinch dispatched as actual touch walks
   street -> city -> sky and all the way back. __ZOOM_SEAM__ (8/2) and
   __ONE_ZOOM_TO_THE_MOON__ (8/12) built that.

   HALF TWO: the big round button in the middle of the movement pad -- the
   largest control in the game, under his right thumb, wearing HIS CHARACTER'S
   FACE -- still said DROP IN / CITY. So the most reachable thing on screen was a
   camera toggle and the game had NO BUTTON FOR DOING THE THING IN FRONT OF YOU.

   WHAT THIS HOLDS:
     A. the round button is not a camera toggle any more
     B. it says the VERB in front of him, and is quiet when there is none
     C. pressing it does the thing -- ENTER measured against a real door
     D. and LETS HIM OUT again, which the first cut got wrong
     E. the camera toggle still exists somewhere (NO DISTRICT IS A PRISON)
     F. and the zoom chain still runs street -> city -> sky -> back

   *** TWO THINGS THIS GATE HAD TO LEARN, BOTH OF THEM ABOUT ITSELF. ***
   1. A FIGHT LEGITIMATELY TAKES THE SCREEN. Walking into a building rolls for
      one (FIGHT_ODDS 0.35, deterministic per footprint), and when it fires the
      shell shows the combat frame -- so the city measures 0x0 and every button
      in it becomes unclickable. THAT IS CORRECT. An earlier run of this probe
      read that as "walking into a house destroys the whole HUD" and was one
      sentence away from being written up as a major bug. It checks the shell
      before blaming the city now.
   2. SO THE DOOR IT USES IS HIS OWN FRONT DOOR, because __NOT_YOUR_OWN_HOUSE__
      makes "no ambush here" a LAW rather than luck, and cityFightRoll() reads
      INSIDE and so cannot be asked before you are already in.

   node gates/the_action_button_does_actions_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE ACTION BUTTON: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* ---- SOURCE: the camera is not wired to the round button any more --------- */
const src = fs.readFileSync(CITY, 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
ok('*** THE ROUND BUTTON IS NOT WIRED TO THE CAMERA *** -- this exact line was '
  + 'the complaint, twice',
  !/getElementById\('mode'\)\.addEventListener\('click',\s*transition\s*\)/.test(code));
ok('and the verb it runs is one function, not a menu',
  /function actPress\s*\(/.test(code) && /function actFront\s*\(/.test(code));
/* THE VERB'S OWNERS ARE THE EXISTING ONES. A copy of inEnter's insides here
   would drift from what walking into the same door does -- which is exactly how
   the door predicate ended up duplicated inside homeFind. */
ok('and each verb calls the thing that already owned it (inEnter, ctOpen, '
  + 'showMarket, stepOnce) rather than a copy of its insides',
  /actPress[\s\S]{0,700}?inEnter\(/.test(code)
  && /actPress[\s\S]{0,700}?ctOpen\(/.test(code)
  && /actPress[\s\S]{0,700}?stepOnce\(/.test(code));

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                         hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    /* THE DAY CARD SITS BEHIND THE OPENING OVERLAY. Skipping the opening first is
       not optional: an earlier probe fired eight clicks at the card while the
       overlay was up, changed nothing, and blamed the canvas. */
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1300);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1600);

    const btn = () => city.evaluate(() => ({
      label: (document.getElementById('modeLbl') || {}).textContent,
      verb: window.__ACT_VERB || null,
      inside: (typeof INSIDE !== 'undefined') && !!INSIDE,
      onDoor: !!(typeof INSIDE !== 'undefined' && INSIDE
                 && INSIDE.ix === INSIDE.door[0] && INSIDE.iy === INSIDE.door[1]),
      chip: (document.getElementById('modechip') || {}).textContent || null,
      mode: MODE }));
    const shell = () => page.evaluate(() => {
      const t = document.querySelector('.tab.on');
      return t ? t.getAttribute('data-p') : null; });

    /* ---- B. QUIET WHEN THERE IS NOTHING --------------------------------- */
    const idle = await btn();
    ok('*** STANDING IN THE OPEN, THE BUTTON SAYS NOTHING *** ("' + idle.label
      + '") -- it used to say DROP IN, which is a camera move offered as the '
      + 'game\'s primary verb', !idle.label);

    /* ---- E. THE CAMERA TOGGLE SURVIVES ---------------------------------- */
    /* NO DISTRICT IS A PRISON (Paolo 8/1): zoom is the way, but a player whose
       fingers cannot pinch must still have one. It just is not the big button. */
    ok('the camera toggle still exists, at the size of a preference ("'
      + idle.chip + '")', /DROP IN|CITY/.test(idle.chip || ''));

    /* ---- C + D. ENTER AND LEAVE, ON HIS OWN FRONT DOOR ------------------ */
    const placed = await city.evaluate(() => {
      let h = null; try { h = homeFind(); } catch (e) { }
      if (!h || !h.door) return { none: true };
      const d = h.door, F = { S: [0, -1], N: [0, 1], E: [-1, 0], W: [1, 0] };
      for (const face in F) { const o = F[face];
        let s = null; try { s = cellAt(d[0] + o[0], d[1] + o[1]); } catch (e) { continue; }
        if (s && s.walk) { hx = d[0] + o[0]; hy = d[1] + o[1]; HFACE = face;
          try { render(); ctVerb(); } catch (e) { }
          return { door: d.slice(), facing: face }; } }
      return { none: true };
    });
    await SETTLE(page, 800);
    ok('put him at his own front door, where the law says no fight can fire ('
      + JSON.stringify(placed) + ')', !placed.none);

    const atDoor = await btn();
    ok('*** FACING A DOOR, THE BUTTON SAYS ENTER *** ("' + atDoor.label + '")',
      atDoor.verb === 'enter');

    await city.click('#mode', { timeout: 8000 }).catch(() => { });
    await SETTLE(page, 1600);
    const inside = await btn();
    const tab = await shell();
    ok('the fight did not take the screen, so this is really measuring the button '
      + '(tab "' + tab + '")', tab === 'run');
    ok('*** PRESSING IT PUTS HIM INSIDE *** (inside ' + inside.inside + ')',
      inside.inside === true);
    /* THE FIRST CUT SHIPPED THIS WRONG: standing in the room, the button still
       said ENTER -- it offered to put him into the room he was already in. */
    ok('*** AND IT DOES NOT STILL SAY ENTER ONCE HE IS IN *** ("' + inside.label
      + '")', inside.verb === 'leave');

    /* AND OUT AGAIN, BY WALKING. __STEP_INSIDE__ (his own request: "WHY WHEN I
       ENTER A HOUSE I CANT GO LEFT AND RIGHT") puts him one cell THROUGH the
       door, so the way out is two real steps and not a teleport. */
    let out = null, presses = 0;
    for (let i = 0; i < 4; i++) {
      await city.click('#mode', { timeout: 8000 }).catch(() => { });
      await SETTLE(page, 1400);
      presses++;
      out = await btn();
      if (!out.inside) break;
    }
    /* *** "HE IS OUTSIDE" IS TRIVIALLY TRUE IF HE WAS NEVER IN. *** Under
       mutation this claim went GREEN with the whole patch reverted, because the
       button never put him inside in the first place and the loop measured a man
       standing in the street. A claim whose precondition never fired is holding
       nothing -- the same shape as the door claims that passed after the splash
       earlier today. It has to prove the round trip. */
    ok('*** AND THE SAME BUTTON WALKS HIM BACK OUT *** (' + presses + ' presses, '
      + 'through the door, no teleport)',
      inside.inside === true && out && out.inside === false);
    ok('and once he is outside it goes quiet again ("' + (out ? out.label : '?')
      + '")', out && !out.label);

    /* ---- F. AND ZOOM IS STILL THE WAY IN AND OUT ------------------------ */
    /* HIS ACTUAL SENTENCE: "I SCROLL OUT AND SCROLL INTO THE CITY". Real touch
       through CDP, because hand-made PointerEvents make setPointerCapture throw
       and the probe then reports "the zoom does nothing" about a canvas it never
       touched. */
    const cdp = await ctx.newCDPSession(page);
    const cvBox = await (await city.$('#cv')).boundingBox();
    const px = cvBox.x + cvBox.width / 2, py = cvBox.y + cvBox.height / 2;
    const touch = async (type, sep) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: sep === null ? []
        : [{ x: px - sep / 2, y: py, id: 1 }, { x: px + sep / 2, y: py, id: 2 }] });
    async function pinch(dir, steps) {
      let sep = dir > 0 ? 300 : 40;
      await touch('touchStart', sep);
      for (let i = 0; i < steps; i++) {
        sep = dir > 0 ? Math.max(16, sep * 0.84) : Math.min(340, sep * 1.19);
        await touch('touchMove', sep);
        await new Promise(r => setTimeout(r, 32));
      }
      await touch('touchEnd', null);
      await new Promise(r => setTimeout(r, 250));
    }
    const seen = [];
    for (let i = 0; i < 4; i++) { await pinch(1, 14); await SETTLE(page, 700);
      seen.push(await city.evaluate(() => (SKY ? 'sky' : MODE))); }
    ok('*** PINCHING OUT FROM THE STREET REACHES THE CITY *** (' + seen.join(' -> ') + ')',
      seen.indexOf('city') >= 0);
    ok('*** AND KEEPS GOING, OUT PAST THE VALLEY *** -- his words, "keep zooming '
      + 'out and it\'s cool"', seen.indexOf('sky') >= 0);
    const back = [];
    for (let i = 0; i < 5; i++) { await pinch(-1, 14); await SETTLE(page, 700);
      back.push(await city.evaluate(() => (SKY ? 'sky' : MODE))); }
    ok('*** AND SPREADING BACK IN WALKS HIM AGAIN *** (' + back.join(' -> ') + ') '
      + '-- the seam runs both ways or it is a trapdoor', back.indexOf('human') >= 0);

    ok('and nothing threw through any of it ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);
    console.log('  MEASURED: idle "" · at a door ENTER · inside LEAVE · out in '
      + presses + ' presses · zoom ' + seen.join('>') + ' then ' + back.join('>'));
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
