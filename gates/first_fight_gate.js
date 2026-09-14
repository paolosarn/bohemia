#!/usr/bin/env node
/* ============================================================================
   A REAL FIGHT INSIDE THE FIRST FIVE MINUTES
   (9/13/26, COMBAT lane, VAMILY [first fight], rule 14 THE FIVE MINUTES)

   *** PAOLO 9/13: "I have not experienced any combat yet... it says a car is gonna
   pull up on me and then nothing happens." ***

   THE ROW: within five minutes of walking from the door, a card says a fight is
   coming AND THE FIGHT COMES, measured with a stopwatch on the walked surface.

   SO THIS IS A STOPWATCH. It opens the alpha, walks out of the door, and counts what
   a player actually meets -- driving the shipped stepOnce, which is the one place a
   walked cell fires both directors. Nothing is staged and nothing is hand-fired.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* *** WHAT FIVE MINUTES IS WORTH, MEASURED ON THE REAL INPUT, NOT ASSUMED. ***
   The first cut of this gate called stepOnce in a loop and converted loop
   iterations to seconds at one step per beat (120 BPM, 2 a second), which put the
   card at "29 seconds". THAT WAS WRONG BY ABOUT SEVEN TIMES. Driven with a thumb on
   the real walk dial, the way EYES E26 walked it: ten two-second held presses moved
   SIX fine cells in 22 seconds, so a five-minute walk is worth roughly EIGHTY cells,
   not six hundred steps. (A twenty-second continuous hold moves nothing at all,
   which is the latch letting go at a wall and is correct: "two beats with nothing to
   show for them".)
   So the budget below is in CELLS ACTUALLY WALKED, which is the only unit a player
   and this harness share. 81 is the measured five-minute figure; the cap is the
   honest one and the gate reports the margin. */
const FIVE_MIN_CELLS = 81;
const WALK_ATTEMPTS = 900;   /* loop room to actually cover those cells */

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
  console.log('=== FIRST FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

/* walk out of the door until the card is on the glass, stopping the moment it is */
const WALK_TO_CARD = `(STEPS) => {
  const dirs = [0, 2, 1, 3, 0, 2]; let di = 0, stuck = 0;
  const out = { step: -1, threw: 0, moved: 0, cellsAtCard: -1 };
  const start = [hx, hy];
  for (let i = 0; i < STEPS; i++) {
    let okstep = false;
    try { okstep = stepOnce(dirs[di % dirs.length]); } catch (e) { out.threw++; }
    if (okstep) { out.moved++; stuck = 0; } else { stuck++; if (stuck > 3) { di++; stuck = 0; } }
    if (i % 90 === 89) di++;
    const dc = document.getElementById('daycard');
    if (dc && getComputedStyle(dc).display !== 'none' && dc.classList.contains('roadcard')) {
      out.step = i;
      out.cellsAtCard = out.moved;
      out.netAway = Math.abs(hx - start[0]) + Math.abs(hy - start[1]);
      out.inside = (typeof INSIDE !== 'undefined' && INSIDE) ? 'INSIDE' : 'outdoors';
      out.text = (dc.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 120);
      out.arms = Array.from(dc.querySelectorAll('button,[data-arm],.mrow'))
        .map(x => (x.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 34)).filter(Boolean);
      break;
    }
  }
  out.district = (typeof dayWhere === 'function') ? dayWhere() : null;
  out.roadTableHere = (typeof ROAD_TABLE !== 'undefined' && out.district) ? !!ROAD_TABLE[out.district] : null;
  out.walkTableHere = (typeof WALK_TABLE !== 'undefined' && out.district) ? !!WALK_TABLE[out.district] : null;
  out.walkFired = (typeof WALK_LOG !== 'undefined' && WALK_LOG) ? WALK_LOG.map(x => (x && x.id) + '/' + (x && x.kind)) : [];
  return out;
}`;

(async () => {
  const browser = await chromium.launch();
  const runs = [];
  /* TWO WALKS, because a first five minutes that is right once can be luck */
  for (let n = 0; n < 2; n++) {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
    const SRV = await serve();
    const BASE = 'http://127.0.0.1:' + SRV.address().port;
    await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
    await sleep(9000);
    await page.mouse.click(215, 450); await sleep(2500);
    await page.mouse.click(215, 450);

    /* AND THE WORLD HAS TO BE ALIVE BEFORE A STOPWATCH MEANS ANYTHING. Measured:
       the walked city needs about eleven seconds after the tap before one step
       works at all -- until then every step throws on a function the last script
       block has not defined yet. A harness that starts walking before that is
       measuring a half-loaded world, which is how this gate's first cut got three
       confident zeroes that meant nothing. */
    let city = null, aliveAt = null; const t0 = Date.now();
    for (let i = 0; i < 900; i++) {
      city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
      if (city) { let a = false;
        try { a = await city.evaluate(() => typeof ctSawCell === 'function' && typeof ctAdjacent === 'function'); } catch (e) {}
        if (a) { aliveAt = Date.now() - t0; break; } }
      await sleep(150);
    }
    await page.evaluate(() => { window.__M = [];
      window.addEventListener('message', e => { const d = e && e.data;
        if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER')
          window.__M.push({ label: d.label, why: d.why, street: !!d.street, room: !!d.room,
            roster: (d.roster || []).length }); }); });

    const walk = await city.evaluate(eval('(' + WALK_TO_CARD + ')'), WALK_ATTEMPTS);
    walk.aliveAt = aliveAt;

    /* AND THE FIGHT COMES: press the arm that says it is a fight, like a player */
    let pressed = 'not reached', msgs = [];
    if (walk.step >= 0 && walk.inside === 'outdoors') {
      pressed = await city.evaluate(() => {
        const dc = document.getElementById('daycard');
        const arms = Array.from(dc.querySelectorAll('button,[data-arm],.mrow'));
        const f = arms.find(x => /A FIGHT/i.test(x.textContent || ''));
        if (!f) return 'no fight arm on the card';
        try { FZOOMING = false; } catch (e) {}
        f.click(); return 'pressed';
      });
      await sleep(5000);
      msgs = await page.evaluate(() => window.__M || []);
    }
    runs.push({ walk, pressed, msgs, errors });
    console.log('  walk ' + (n + 1) + ': card after ' + walk.cellsAtCard + ' CELLS WALKED (of a '
      + FIVE_MIN_CELLS + '-cell five minutes), ' + walk.inside + ', in the ' + walk.district
      + ' [road table ' + walk.roadTableHere + ', walk table ' + walk.walkTableHere + ']'
      + ', fired ' + JSON.stringify(walk.walkFired) + ' -> ' + pressed + ' ' + JSON.stringify(msgs));
    await page.close(); SRV.close();
  }

  const a = runs[0], b = runs[1];
  const mins = c => (c / FIVE_MIN_CELLS * 5).toFixed(1);

  ok('*** A CARD SAYS A FIGHT IS COMING, INSIDE THE FIRST FIVE MINUTES, ON EVERY WALK. *** His words were "I have not experienced any combat yet... it says a car is gonna pull up on me and then nothing happens", and the stopwatch agreed: the walked street produced 0 cards and 0 fights, because the only director that can start a fight reads ROAD_TABLE, which has NO ROW for the '
    + a.walk.district + ' he wakes in, while WALK_TABLE does (' + a.walk.walkTableHere
    + ') and its whole response was one line of text. Now the card is on the glass after '
    + a.walk.cellsAtCard + ' and ' + b.walk.cellsAtCard + ' CELLS ACTUALLY WALKED, against the '
    + FIVE_MIN_CELLS + ' cells a thumb covers in five minutes on the real dial -- so about '
    + mins(a.walk.cellsAtCard) + ' minutes in, with ' + (FIVE_MIN_CELLS - a.walk.cellsAtCard)
    + ' cells of margin. THE UNIT IS THE POINT: the first cut of this gate counted loop iterations and called it "29 seconds", which was wrong by about seven times, because a real held-press walk is far slower than one step per beat',
    a.walk.cellsAtCard > 0 && b.walk.cellsAtCard > 0
    && a.walk.cellsAtCard <= FIVE_MIN_CELLS && b.walk.cellsAtCard <= FIVE_MIN_CELLS
    && a.walk.roadTableHere === false && a.walk.walkTableHere === true);

  ok('AND IT IS A REAL CARD WITH A REAL CHOICE ON IT, not a line of text: it reads "'
    + (a.walk.text || '').slice(0, 80) + '" with the arms ' + JSON.stringify(a.walk.arms)
    + '. One of them says it is a fight, which is V203\'s arm on the road\'s own card -- reused, not rebuilt',
    Array.isArray(a.walk.arms) && a.walk.arms.length >= 2
    && a.walk.arms.some(x => /A FIGHT/i.test(x)));

  const m = (a.msgs || [])[0] || null;
  ok('*** AND THE FIGHT COMES. *** Pressing that arm posts a real encounter, and the message is FINGERPRINTED so this cannot be some other fight: label "'
    + (m && m.label) + '", why "' + (m && m.why) + '", street ' + (m && m.street) + ', room '
    + (m && m.room) + ', ' + (m && m.roster) + ' in the party. THE FINGERPRINT IS THE POINT -- the first cut of this gate walked into a garage, pressed the arm, saw a fight open and called it proof, and it was the INTERIOR DOOR\'S fight (room true, 5 men, a garage label). A green result from a path you did not test is the defect this lane has now found four times',
    !!m && m.why === 'road:scavenger_shakedown' && m.street === true && m.room === false
    && m.roster >= 1 && /scavenger/i.test(m.label || ''));

  ok('AND IT HAPPENS THE SAME WAY TWICE, because a first five minutes that is right once can be luck: both walks met it after '
    + a.walk.cellsAtCard + ' and ' + b.walk.cellsAtCard + ' cells, both outdoors, both posting the same fingerprint',
    a.walk.cellsAtCard === b.walk.cellsAtCard && b.walk.inside === 'outdoors'
    && ((b.msgs || [])[0] || {}).why === 'road:scavenger_shakedown');

  /* AND THE INDOORS GUARD IS TESTED DIRECTLY, because the walk above never goes
     indoors and an arm that only says "this card happened to be outdoors" passes
     for the wrong reason -- proved by mutation: deleting the guard left it green. */
  const indoors = await (async () => {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
    const SRV = await serve();
    await page.goto('http://127.0.0.1:' + SRV.address().port + '/slices/BOHEMIA_ALPHA_0_9.html',
      { waitUntil: 'load', timeout: 120000 });
    await sleep(9000); await page.mouse.click(215, 450); await sleep(2500); await page.mouse.click(215, 450);
    let city = null;
    for (let i = 0; i < 900; i++) {
      city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
      if (city) { let al = false;
        try { al = await city.evaluate(() => typeof ctSawCell === 'function'); } catch (e) {}
        if (al) break; }
      await sleep(150);
    }
    const r = await city.evaluate(() => {
      const dc = document.getElementById('daycard');
      try { cardHide(); } catch (e) {}
      const wasInside = INSIDE;
      /* stand him indoors and fire the very moment that opens the card outdoors */
      INSIDE = INSIDE || { foot: { W: 4, H: 4 }, fp: { W: 4, H: 4 } };
      const got = { fired: true, id: 'scavenger_shakedown', name: 'desperate scavenger shakedown',
        kind: 'interactive', seq: 1, at: { district: 'suburb', phase: 'day' } };
      let line = null, card = null;
      /* THE SHIPPED walkInterrupt IS WHAT RUNS, not a copy of its logic in this
         gate. The first cut of this arm re-implemented the if/else here, so
         mutating the real guard left the gate GREEN -- the same
         test-a-copy-of-the-code defect this lane keeps finding, written by me.
         The director is stubbed to hand walkInterrupt this one moment; everything
         after that is the real function. */
      const realDir = WALK_DIR;
      WALK_DIR = { consider: function () { return got; } };
      try { walkInterrupt(1); } catch (e) {}
      WALK_DIR = realDir;
      try { line = (document.getElementById('packline') || {}).textContent || null; } catch (e) {}
      try { card = !!(dc && getComputedStyle(dc).display !== 'none' && dc.classList.contains('roadcard')); } catch (e) {}
      /* and the real refusal underneath it, which is why the guard exists */
      let contact = null;
      try { contact = roadContactFight(got); } catch (e) { contact = 'threw'; }
      INSIDE = wasInside;
      return { lineSaid: !!line, cardOpened: card, contactIndoors: contact };
    });
    await page.close(); SRV.close();
    return r;
  })();
  console.log('  indoors: ' + JSON.stringify(indoors));
  ok('AND NOTHING IS PROMISED THAT CANNOT BE DELIVERED, which is rule 14(d) and is TESTED INDOORS RATHER THAN ASSUMED. roadContactFight refuses indoors on purpose ("indoors is the door\'s fight"), so a card opened in a garage would show a DROP HIM arm that does nothing when pressed. Standing indoors and firing the very moment that opens the card outside: the line is still said ('
    + indoors.lineSaid + '), NO CARD OPENS (' + indoors.cardOpened + '), and the contact underneath refuses ('
    + indoors.contactIndoors + '). THE FIRST CUT OF THIS ARM ONLY SAID "the card I met happened to be outdoors", and deleting the guard left it GREEN -- an arm that passes for the wrong reason is worse than no arm',
    indoors.lineSaid === true && indoors.cardOpened === false && indoors.contactIndoors === false);

  ok('and both walks did meet their card outdoors, where it can be delivered ('
    + a.walk.inside + ', ' + b.walk.inside + ')',
    a.walk.inside === 'outdoors' && b.walk.inside === 'outdoors');

  ok('AND THE WORLD WAS ALIVE BEFORE THE STOPWATCH STARTED, which is its own finding: the walked city needs about '
    + Math.round((a.walk.aliveAt || 0) / 100) / 10 + 's and ' + Math.round((b.walk.aliveAt || 0) / 100) / 10
    + 's after the tap before ONE STEP WORKS -- until then every step throws on a function the last script block has not finished defining, so no director fires and no fight can start. A harness that walks before that is measuring a half-loaded world, and this gate\'s first cut got three confident zeroes that meant nothing',
    (a.walk.aliveAt || 0) > 0 && (b.walk.aliveAt || 0) > 0 && a.walk.threw === 0 && b.walk.threw === 0);

  ok('NO GLOBAL SPAWNS EVER still holds: nothing here adds a table, a district or a moment. The '
    + a.walk.district + ' produced this because WALK_TABLE already authored a row for it and nothing consumed it; a district with no row still produces nothing',
    a.walk.walkTableHere === true && a.walk.roadTableHere === false);

  const errs = a.errors.concat(b.errors);
  /* ---- V216 AND THE CARD SURVIVES THE NEXT STEP ------------------------- */
  const survive = await (async () => {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
    const SRV = await serve();
    await page.goto('http://127.0.0.1:' + SRV.address().port + '/slices/BOHEMIA_ALPHA_0_9.html',
      { waitUntil: 'load', timeout: 120000 });
    await sleep(9000); await page.mouse.click(215, 450); await sleep(2500); await page.mouse.click(215, 450);
    let city = null;
    for (let i = 0; i < 900; i++) {
      city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
      if (city) { let al = false; try { al = await city.evaluate(() => typeof ctSawCell === 'function'); } catch (e) {}
        if (al) break; }
      await sleep(150);
    }
    const up = await city.evaluate(eval('(' + WALK_TO_CARD + ')'), WALK_ATTEMPTS);
    const cardOn = () => city.evaluate(() => { const dc = document.getElementById('daycard');
      return !!(dc && getComputedStyle(dc).display !== 'none' && dc.classList.contains('roadcard')); });
    const before = await cardOn();
    /* press the WALK DIAL itself, which is how a player moves and is the input that
       was erasing this card */
    const bs = city.locator('#pad .pb'); const n = await bs.count();
    let t = bs.nth(0);
    for (let i = 0; i < n; i++) { const d = await bs.nth(i).getAttribute('data-walk');
      if (d === '\u2192') { t = bs.nth(i); break; } }
    const box = await t.boundingBox();
    await page.mouse.move(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2));
    await page.mouse.down(); await sleep(150); await page.mouse.up(); await sleep(400);
    const afterOne = await cardOn();
    await page.mouse.down(); await sleep(150); await page.mouse.up(); await sleep(400);
    const afterTwo = await cardOn();
    await page.close(); SRV.close();
    return { reached: up.step >= 0, before, afterOne, afterTwo };
  })();
  console.log('  the card against the dial: ' + JSON.stringify(survive));
  ok('*** AND THE CARD SURVIVES THE NEXT STEP, WHICH IS THE DEFECT V213 CREATED AND EYES FOUND. *** They walked the five minutes with a thumb, pressed this dial 117 times and reported NO FIGHT SURFACE SEEN -- while the number above says the card arrives at about press 92. It DID arrive; PRESS 93 ERASED IT. startHold calls roadBail on every press, which is right for a card shown during TRAVEL where nobody holds the walk dial, and wrong the moment V213 routed the WALKED STREET into the same card, because pressing that dial IS how you walk. Now: card up ('
    + survive.before + '), one walk press and it is STILL THERE (' + survive.afterOne + ')',
    survive.reached === true && survive.before === true && survive.afterOne === true);

  ok('AND IT IS STILL NOT A LOCK, which is the ruling this must not break: a SECOND press is him walking away and it dismisses the card ('
    + survive.afterTwo + '). One press of grace, and it is a COUNT rather than a clock -- the first cut gave it two beats, a real ruled duration, and measured that does NOTHING at the real cadence, because a thumb walks in two-second presses and lands long after a one-second window has closed',
    survive.afterTwo === false);

  ok('no page errors through either walk', errs.length === 0);
  if (errs.length) console.log('  errors: ' + JSON.stringify(errs.slice(0, 3)));
  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  fail++; return done(null);
});
