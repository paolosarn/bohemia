#!/usr/bin/env node
/* ============================================================================
   THE HOUSE BOARD IS THE BOARD
   (9/15/26, COMBAT lane, VAMILY [house board], rule 16 THE STEP IS A HOUSE)

   *** PAOLO 9/15: "I just entered combat and this is not at the scale that I needed
   it to be... implement it into combat too, right now it's not there." ***

   THE ROW: a fight tile is a lot, a fighter is the ruled body size, a pistol reaches
   one and a rifle two, and the FIRST fight is at the new size.

   SO THIS GATE STARTS A REAL FIGHT THE WAY HE STARTS ONE -- walking up to a crew on
   the street and tapping one (the door V217 shipped) -- and then measures the board
   he actually landed on with the fight's OWN functions. Nothing is set by hand
   before the measurement: if the default is wrong, every number below is wrong.

   AND IT MEASURES THE BODY OFF THE INK. "About half a lot tall" is a real claim and
   it is checkable: the bake is 112 px square, the person inside it is the alpha
   bounding box, and a lot is fieldPitch times the short side of the glass. A gate
   that asserted the SCALE CONSTANT instead of the person on the screen would pass on
   a sprite drawn at any size at all.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close();
  console.log('=== HOUSE BOARD GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
  const SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);

  /* *** THE DOOR WENT STALE AND THIS GATE SPENT ITS ROUNDS MEASURING A SPLASH. ***
     MEASURED 9/24, on main and on this tree alike, printed by a throwaway arm: at the
     moment this gate sends its finger at a hostile, the element under that point is
     DIV#loadgl inside DIV#front.load.ready -- THE LOADING SCREEN, still on top, over a
     city frame that is alive and answering every question underneath it. That is why
     "the pointer can reach that body" is red: not a missing body, not a covered canvas
     in the city, THE FRONT DOOR NEVER OPENED.

     The two blind clicks at (215,450) were written before rule 18's loading screen
     existed. The splash's own PLAY sits at the bottom of the screen and its handler
     refuses until __LOAD_READY is set, so a finger in the middle at nine seconds hits
     #loadgl and nothing happens, for ever.

     The procedure below is COPIED FROM THE ONE DRIVER (tools/bohemia_drive_the_demo.js,
     rule 14(g)), traps 5 and 6, which already carry the scars: there are TWO front doors
     (#fronttap and #front) and only one of them opens on a given surface, so tap both;
     and knocking is not getting in, so keep knocking on a CLOCK until the door is behind
     you. The driver's own comment names a gate that printed "NOTHING REACHABLE ...
     DIV#loadgl" for exactly this reason.
     THIS IS NOT THE REAL FIX. The real fix is rule 14(g) itself -- put this gate ON the
     driver instead of carrying a copy of its door. That is an instrument job on this
     lane's row, and it is the second round it has been named. */
  const knock = async () => {
    for (const id of ['fronttap', 'front']) {
      const b = await page.evaluate((i) => {
        const f = document.getElementById(i);
        if (!f || getComputedStyle(f).display === 'none') return null;
        const r = f.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return null;
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, id);
      if (b) await page.mouse.click(b.x, b.y);
      await page.evaluate((i) => { const f = document.getElementById(i); if (f) f.click(); }, id);
    }
  };
  const doorStillThere = () => page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    return !!(f && getComputedStyle(f).display !== 'none' && f.offsetParent !== null);
  });
  const tKnock = Date.now();
  await knock();
  while ((await doorStillThere()) && Date.now() - tKnock < 90000) { await sleep(700); await knock(); }
  /* AND REFUSE TO REPORT IF IT DID NOT OPEN, rather than measure the splash and call the
     numbers a finding. Every arm past this point is about the fight; none of them mean
     anything if the game never started. */
  const doorLeft = !(await doorStillThere());
  ok('the front door opened after ' + ((Date.now() - tKnock) / 1000).toFixed(1) + ' s, so '
     + 'everything below is about the game and not the loading screen (this gate tapped '
     + 'blind at a fixed point for rounds and was reading #loadgl)', doorLeft);
  if (!doorLeft) return done(browser);

  let city = null;
  for (let i = 0; i < 900; i++) {
    city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
    if (city) { let a = false;
      try { a = await city.evaluate(() => typeof ctSawCell === 'function' && typeof streetTapFoe === 'function'); } catch (e) {}
      if (a) break; }
    await sleep(150);
  }
  if (!city) { ok('the walked city came up', false); return done(browser); }
  ok('the walked city came up', true);

  /* the card and the shell banner come off the way a player takes them off */
  const cityBox = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
  for (let i = 0; i < 8; i++) {
    let hit = false;
    for (const sel of ['.dcgo[data-act="go"]', '[data-act="close"]', '.dcgo']) {
      const h = await city.$(sel).catch(() => null);
      if (h && await h.isVisible().catch(() => false)) {
        const b = await h.boundingBox();
        if (b) { await page.mouse.click(cityBox.x + b.x + b.width / 2, cityBox.y + b.y + b.height / 2); hit = true; break; }
      }
    }
    await sleep(hit ? 1100 : 600);
    const clear = await city.evaluate(() => { const c = document.querySelector('canvas');
      const b = c.getBoundingClientRect();
      const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return !!el && el.tagName === 'CANVAS'; }).catch(() => true);
    if (clear) break;
  }
  await page.evaluate(() => { const n = document.getElementById('openNot'), inv = document.getElementById('openInvite');
    if (inv && getComputedStyle(inv).display !== 'none' && n) n.click(); });

  /* ---------- START A FIGHT THE WAY HE STARTS ONE ----------

     STAND CLOSE ENOUGH THAT THE CREW IS ON THE SCREEN, AND DO NOT PICK THE NUMBER.
     This stood the player FIVE cells south of the crew, which was a fine distance on the
     street this gate was written against. Rule 16 made a step a house and the street's
     zoom moved with it, so five cells is now off the glass: measured this round, the
     street had drawn one hit box, its own tap test claimed all three sample points on it,
     and elementFromPoint at those points returned NOTHING -- the body is real, it is
     simply not on the screen the finger is touching.
     So the gate WALKS IN instead of standing at a constant: nearest offset first, and it
     stops at the first distance where a body is both claimed by the street and actually
     under the finger. That is a search for the condition, not a new magic number, and it
     survives the next time the zoom moves. */
  const fbox = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
  const AIM = () => city.evaluate(() => {
    const r = cv.getBoundingClientRect(), hits = (typeof HOST_HIT !== 'undefined' && HOST_HIT) || [];
    let claimed = 0, under = null, pt = null;
    for (const h of hits) for (const f of [0.5, 0.62, 0.74]) {
      const cx = h.x + h.w / 2, cy = h.y + h.h * f;
      if (!streetTapFoe(cx, cy)) continue;
      claimed++;
      const px = r.left + cx * r.width / cv.width, py = r.top + cy * r.height / cv.height;
      const el = document.elementFromPoint(px, py);
      if (!under) { under = el ? (el.tagName + (el.id ? '#' + el.id : '')) : 'nothing'; pt = [px | 0, py | 0]; }
      if (el && el.tagName === 'CANVAS') return { x: px, y: py, boxes: hits.length };
    }
    return { x: null, boxes: hits.length, claimed: claimed, under: under, pt: pt,
             view: [innerWidth, innerHeight],
             /* AND THE RULER ITSELF, because the first walk-in printed pt [0,0] at every
                distance, which is not a body off the glass, it is a mapping that divides
                by a board it is not standing on. Say which canvas answered and how big
                its box is, so the next round starts from a number instead of a theory. */
             rect: [r.left | 0, r.top | 0, r.width | 0, r.height | 0],
             board: [cv.width, cv.height, cv.id || '(no id)'],
             hit0: hits[0] ? [hits[0].x | 0, hits[0].y | 0, hits[0].w | 0, hits[0].h | 0] : null };
  }).catch(e => ({ x: null, err: String(e).slice(0, 120) }));

  let placed = null, aim = null;
  for (const off of [1, 2, 3, 4, 5]) {
    placed = await city.evaluate((o) => {
      const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
        radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
      const c = list.map(x => ({ at: x.at, count: x.count,
        d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) })).sort((a, b) => a.d - b.d)[0];
      if (!c) return null;
      window.__CITY.human(c.at[0], c.at[1] + o);
      return { crew: c.at, count: c.count, off: o };
    }, off);
    if (!placed) break;
    await sleep(1500);
    aim = await AIM();
    if (aim && aim.x != null) { console.log('  STOOD ' + off + ' CELLS OFF AND THE BODY WAS UNDER THE FINGER'); break; }
    console.log('  AT ' + off + ' CELLS ' + JSON.stringify(aim));
  }
  if (aim && aim.x == null) aim = null;
  if (!placed) { ok('a crew to walk up to', false); return done(browser); }
  /* AND WHEN IT IS STILL RED, THE LINES ABOVE SAY WHAT IT SAW AT EVERY DISTANCE -- how
     many bodies the street had drawn hit boxes for, how many of those its own tap test
     claims, what is under the finger, and where the finger was against the frame's own
     viewport. A red with no numbers is a rumour, and this arm was one for rounds. */
  if (!aim) { ok('a hostile body to tap', false); return done(browser); }
  const reach = await page.evaluate((arg) => { const e = document.elementFromPoint(arg.x, arg.y);
    return !!e && e.tagName === 'IFRAME' && e.id === 'cityFrame'; },
    { x: fbox.x + aim.x, y: fbox.y + aim.y });
  if (!reach) { ok('the pointer can reach that body', false); return done(browser); }
  await page.mouse.click(fbox.x + aim.x, fbox.y + aim.y);
  await sleep(6500);
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  if (!cf) { ok('the fight came up', false); return done(browser); }
  ok('a real fight, started the way he starts one', true);

  /* THE BAKE HAS TO EXIST BEFORE THE INK CAN BE MEASURED. One run in three read
     personInLots as undefined because SPR.cv had no idle frame yet at that instant --
     the arm failed closed, which is right, but a check that goes red on a timing
     race is a check nobody will trust the next time it is red for a real reason. */
  let baked = false;
  for (let i = 0; i < 60; i++) {
    try { baked = await cf.evaluate(() => { const p = SPR.cv && (SPR.cv.S || SPR.cv[Object.keys(SPR.cv)[0]]);
      return !!(p && p.idle && p.idle.width); }); } catch (e) {}
    if (baked) break;
    await sleep(400);
  }
  ok('the body bake is up, so the ink can be measured', baked);

  /* ---------- THE BOARD HE LANDED ON, MEASURED WITH THE FIGHT'S OWN FUNCTIONS ---------- */
  const b = await cf.evaluate(() => {
    const out = {}, W = cv.width, H = cv.height;
    out.canvas = [W, H];
    out.houseOn = !!houseOn();
    out.flagWasSetByHand = (G.houseTile !== undefined);
    out.tilePx = +(Math.min(W, H) * fieldPitch(W, H)).toFixed(2);
    out.spritePx = +(112 * bodyScale()).toFixed(2);
    out.tileInSpriteWidths = +(out.tilePx / out.spritePx).toFixed(3);
    /* REPOINTED 9/21 (V223): this leg's own words are "THE GLASS holds a handful of
       houses", and it was measuring the board at zoom 1 rather than at the camera the
       fight actually uses. The fight auto-frames -- uzApply scales the world by the
       live zoom every frame -- so W/tilePx is a number nobody ever sees. It went red
       for the work going right the moment rule 21 put the lot at its ruled size.
       Same class as the two rulers V219 repointed and the marking arm this round:
       a ruler written in a unit the game has moved past. */
    out.zoom = (typeof G !== 'undefined' && (G._uzE || G.userZoom)) || 1;
    out.tilesAcross = +(W / (out.tilePx * out.zoom)).toFixed(2);
    out.tilesAcrossAtZoom1 = +(W / out.tilePx).toFixed(2);
    out.reach = {}; for (const w of ['pistol', 'rifle', 'shotgun', 'smg', 'sniper'])
      out.reach[w] = wpnRange(w).max;
    out.sight = sightTiles();
    out.men = (G.e || []).map(e => +(e.edist || 0).toFixed(2));
    out.teach = !!G.teachBeat;
    /* THE PERSON, OFF THE INK, not off the scale constant */
    const pick = (SPR.cv && (SPR.cv.S || SPR.cv[Object.keys(SPR.cv)[0]]));
    if (pick && pick.idle) {
      const im = pick.idle, c = document.createElement('canvas');
      c.width = im.width; c.height = im.height;
      const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let top = -1, bot = -1;
      for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++)
        if (d[(yy * c.width + xx) * 4 + 3] > 12) { if (top < 0) top = yy; bot = yy; break; }
      out.inkFrac = +((bot - top + 1) / im.height).toFixed(3);
      out.personPx = +(out.inkFrac * out.spritePx).toFixed(2);
      out.personInLots = +(out.personPx / out.tilePx).toFixed(3);
    }
    return out;
  });
  console.log('  THE BOARD: ' + JSON.stringify(b));

  ok('*** THE FIGHT HE WALKS INTO IS AT HOUSE SCALE, WITH NOBODY HAVING TOUCHED A DIAL. *** '
    + 'The flag that turns it on was assigned nowhere in the game before this row, so every '
    + 'fight ever played was on the body board',
    b.houseOn === true && b.flagWasSetByHand === false);

  ok('a tile is about one and three quarter sprite widths, which is his number by eye ('
    + b.tileInSpriteWidths + ')', b.tileInSpriteWidths > 1.5 && b.tileInSpriteWidths < 2.1);

  ok('the glass holds a handful of houses, not a car park of them (' + b.tilesAcross
    + ' across at the camera he is actually looking through, ' + b.tilesAcrossAtZoom1
    + ' at zoom 1; was 35.3 on the body board)', b.tilesAcross > 4 && b.tilesAcross < 10);

  ok('A PISTOL REACHES ONE HOUSE AND A RIFLE TWO, his 9/4 ruling, on the board he lands on',
    b.reach.pistol === 1 && b.reach.rifle === 2 && b.reach.shotgun === 1 && b.reach.smg === 1);

  ok('A PERSON STANDS ABOUT HALF A LOT TALL, measured off the ink in the bake and not off the '
    + 'scale constant (' + b.personInLots + ' lots)',
    b.personInLots > 0.4 && b.personInLots < 0.65);

  ok('nobody is standing outside sight: every man on the board is inside what you can see',
    b.men.length > 0 && b.men.every(d => d <= b.sight));

  /* ---------- AND IT IS PLAYABLE AT THIS SCALE ---------- */
  /* *** AND "REACHABLE" IS TWO QUESTIONS, WHICH IS WHY THE FIRST CUT OF THIS ARM WENT
     RED ONE RUN IN THREE. *** On the house board a pistol reaches ONE HOUSE, so
     whether a man happens to spawn inside 1.08 is a roll -- and an arm that asks only
     that is a coin flip dressed as a check. The honest question is whether he can be
     reached AT ALL: in reach at the bell, or reachable by WALKING, which is the verb
     the whole board is built around. So this drives the shipped doMove, greedily, the
     way a player closes on somebody, and reports both. */
  const play = await cf.evaluate(() => {
    const out = {};
    const near = () => Math.min.apply(null, (G.e || []).filter(e => !e.dead).map(e => e.edist || 99).concat([99]));
    out.men = (G.e || []).length;
    out.myMax = +maxRange(myRange()).toFixed(2);
    out.inReachAtBell = (G.e || []).filter(e => inMyRange(e)).length;
    out.nearestAtBell = +near().toFixed(2);
    /* THEIR approach first, the way the turn loop runs it */
    try { for (let t = 0; t < 6; t++) tickTurnEnd(); } catch (e) { out.threw = String(e).slice(0, 120); }
    out.nearestAfterTheirTurns = +near().toFixed(2);
    /* then HIS legs: eight directions, keep whichever shortens the gap, ten turns */
    let steps = 0;
    for (let t = 0; t < 10 && near() > out.myMax; t++) {
      let best = null, bd = near();
      for (let d = 0; d < 8; d++) {
        const snap = (G.e || []).map(e => e.edist);
        try { G.phase = 'cover'; G.over = false; doMove(d); } catch (e) {}
        const n = near();
        if (n < bd) { bd = n; best = d; }
        for (let i = 0; i < snap.length; i++) if (G.e[i]) G.e[i].edist = snap[i];   /* put it back, try the next */
      }
      if (best === null) break;
      try { G.phase = 'cover'; G.over = false; doMove(best); } catch (e) {}
      steps++;
    }
    out.stepsWalked = steps;
    out.nearestAfterWalking = +near().toFixed(2);
    out.inReachAfterWalking = (G.e || []).filter(e => inMyRange(e)).length;
    return out;
  });
  console.log('  THE FIGHT: ' + JSON.stringify(play));
  ok('somebody can be reached -- in reach at the bell, or reached by walking, which is '
    + 'the verb a one-house pistol is built around. A board where nobody can ever be '
    + 'touched is a diorama',
    !play.threw && play.men > 0 && (play.inReachAtBell > 0 || play.inReachAfterWalking > 0));

  /* ---------- AND ADJACENT IS ALWAYS REACHABLE, INCLUDING AT NIGHT ----------
     THE DEFECT THIS ARM EXISTS FOR, found by running this gate three times instead of
     once: on two runs in three the first fight of the game put its one man at edist 1
     against a pistol that reached 0.75, so he could not be shot AND WALKING COULD NOT
     HELP, because edist 1 is adjacent and there is nowhere closer to stand. The floor
     was hd(PT_BLANK+2) -- a body-scale number divided by eight -- and nights drove
     reach under it, because rangeMult halves in the dark and on a board of 1s and 2s
     a half is below the floor. It is driven through the SHIPPED maxRange with the
     shipped night multiplier, not by reading the constant. */
  const night = await cf.evaluate(() => {
    const out = {};
    const probe = (k) => ({ pistol: +maxRange(wpnRange('pistol'), k).toFixed(3),
                            rifle: +maxRange(wpnRange('rifle'), k).toFixed(3) });
    out.atNoon = probe(1);
    out.atHalfLight = probe(0.5);     /* the darkest rangeMult the night term reaches */
    out.atAQuarter = probe(0.25);     /* darker than the game ever gets, as a floor test */
    out.liveMult = +rangeMult().toFixed(3);
    out.liveMax = +maxRange(myRange()).toFixed(3);
    return out;
  });
  console.log('  THE DARK: ' + JSON.stringify(night));
  ok('a man standing one house away can always be shot, day or night: on the house board '
    + 'reach never falls below ADJACENT, because there is nowhere closer to stand and his '
    + '9/4 ruling has no clause about the hour',
    night.atNoon.pistol >= 1 && night.atHalfLight.pistol >= 1 && night.atAQuarter.pistol >= 1
      && night.liveMax >= 1);
  ok('and the night still bites where it can: a rifle in the dark comes down from two '
    + 'houses to one', night.atNoon.rifle === 2 && night.atHalfLight.rifle < 2);

  /* ---------- NO DAMAGE BEFORE THE DIAL ---------- */
  const dmg = await cf.evaluate(() => {
    const out = {};
    out.dmgKnowsScale = /houseOn|HOUSE_K|tileK|houseTile/.test(String(applyDamage));
    out.lethal = (typeof LETHAL !== 'undefined') ? LETHAL : null;
    /* the same shot at the same fraction of reach on both boards */
    const sample = (on) => { G.houseTile = on; const r = wpnRange('pistol');
      return { eff: +(r.eff / r.max).toFixed(4) }; };
    out.houseFrac = sample(true); out.bodyFrac = sample(false);
    delete G.houseTile;
    out.backToDefault = !!houseOn();
    return out;
  });
  console.log('  THE DIAL: ' + JSON.stringify(dmg));
  ok('NO DAMAGE BEFORE THE DIAL: the damage path knows nothing about the board scale',
    dmg.dmgKnowsScale === false);
  ok('the accuracy curve is the same shape on both boards, because eff carries across the '
    + "body table's own eff/max ratio (" + dmg.houseFrac.eff + ' against ' + dmg.bodyFrac.eff + ')',
    Math.abs(dmg.houseFrac.eff - dmg.bodyFrac.eff) < 0.001);

  /* ---------- THE DIAL SURVIVES, BECAUSE HIS OWN ROW SAYS IT DOES ---------- */
  const flip = await cf.evaluate(() => {
    const out = {};
    const hb = document.getElementById('housebtn');
    out.haveButton = !!hb;
    out.labelAtDefault = hb ? hb.textContent : null;
    if (hb) hb.click();
    out.afterOne = { on: !!houseOn(), label: hb ? hb.textContent : null };
    if (hb) hb.click();
    out.afterTwo = { on: !!houseOn(), label: hb ? hb.textContent : null };
    return out;
  });
  console.log('  THE BUTTON: ' + JSON.stringify(flip));
  ok('the bench button still reaches the old board, which his own V198 row says it must',
    flip.haveButton && flip.afterOne.on === false && flip.afterTwo.on === true);
  ok('and the label agrees with the board at the default, which it could not before '
    + '(it painted off a raw flag that is undefined until somebody presses it)',
    /A HOUSE/.test(String(flip.labelAtDefault)) && /A BODY/.test(String(flip.afterOne.label)));

  console.log('  page errors: ' + JSON.stringify(errors.slice(0, 4)));
  ok('no page errors through the whole round trip', errors.length === 0);
  await done(browser);
})();
