#!/usr/bin/env node
/* ONE NUMBER FOR A BODY -- rule 16, THE STEP IS A HOUSE (Paolo 9/15, LOCKED,
   laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md).

   His ruling: bodies are drawn LARGER on the street and in the fight. The law's
   own words: "ONE NUMBER IN ONE PLACE. The scale ... lives in one constant that
   the street, the fight, the bodies, the zoom seam and the reach module all read.
   NOTHING IS BAKED ONCE. A second copy anywhere is the bug."

   THIS LANE'S HALF IS THE BODY PIXELS. It owned SIX copies of that number: two in
   the bake and the w/h typed into each of the five senders that post bodies to the
   city, the faction cast and the run slice. Plus a seventh in the bake's own NAME.

   MEASURED before it was touched: the rig renders 112x112 with a standing body of
   98 rows; the bake halves it to 56 before shipping, keeping 4,691 of 18,739 body
   pixels (25%) and a 49-row body, while 158 of 160 colours survive. So the loss is
   RESOLUTION, not palette -- and the city doubles it back with Scale2x to draw it.
   That was an EXPIRED CONTRACT, not a mistake: 56 was the rig's native size when
   the promise was made, and COMBAT already stopped upscaling when the rig moved to
   112 while the city kept being handed a half-size body.

   THE CLAIM THAT MATTERS IS BEHAVIOURAL, not a source scan. PLUMBER proved on
   [suite runs] that a source scan cannot see a typed list once strings have to be
   stripped. So this gate INTERCEPTS the real postMessage traffic and checks that
   what every sender PROMISES is what the bake actually SHIPS. If the number moves
   and one sender is missed, the promise and the payload disagree and this bites.
                                                                   ANIMATION 9/15 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nONE NUMBER FOR A BODY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

for (const f of [ALPHA, LAW]) if (!fs.existsSync(f)) { console.log('  FAIL missing ' + f); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

/* HIS RULING IS READ OUT OF THE LAW, never copied here. */
ok('the law still says the scale is ONE constant and a second copy is the bug',
   /ONE NUMBER IN ONE PLACE/.test(law) && /A second copy anywhere is the bug/.test(law));

ok('this lane names its half of that number once (CAST_PX)',
   /\bconst CAST_PX\s*=\s*\d+\s*;/.test(src));

/* THE NAME IS A COPY TOO. A function called bake56 that bakes at CAST_PX is the
   seventh place the number lives, and it is the one that misleads the next reader. */
ok('no bake is named after the number it no longer controls (bake56 is gone)',
   !/\bbake56\b/.test(src) && /function bakeCast\(/.test(src));

/* Every sender asks the constant rather than typing w/h. */
const typed = (src.match(/w:\s*56\s*,\s*h:\s*56/g) || []).length;
const asked = (src.match(/w:\s*CAST_PX\s*,\s*h:\s*CAST_PX/g) || []).length;
ok('every body sender asks the constant instead of typing the number (' + asked +
   ' ask, ' + typed + ' still type it)', asked >= 5 && typed === 0);

/* COMBAT'S CONTRACT IS A CONTROL AND MUST NOT MOVE. bake112 is a different promise
   (the combat module is handed 112) and rule 16 does not touch it from here. */
ok('CONTROL: the combat bake keeps its own 112 promise, untouched by this lane',
   /function bake112\(/.test(src) && /packIdx\(frameToRGBA\(\{px:px,CW:W,CH:H\}\),112,112\)/.test(src));

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(() => {
    const out = { CAST_PX: (typeof CAST_PX !== 'undefined') ? CAST_PX : null };
    /* WHAT THE BAKE ACTUALLY SHIPS. packIdx returns {w,h,...}: the payload's own
       idea of its size, independent of whatever a sender promises alongside it. */
    const f = bakeCast('S', 'idle', 0.25, true);
    out.bakedW = f.w; out.bakedH = f.h;
    /* and what the RIG renders at, so the halve is visible rather than assumed */
    const nf = buildFrame('S', 'idle', 0.25, true);
    out.rigW = nf.CW; out.rigH = nf.CH;
    let top = -1, bot = -1;
    const rgba = frameToRGBA(nf);
    for (let y = 0; y < nf.CH; y++) for (let x = 0; x < nf.CW; x++)
      if (rgba[(y * nf.CW + x) * 4 + 3] > 8) { if (top < 0) top = y; bot = y; break; }
    out.rigBodyRows = bot < 0 ? 0 : (bot - top + 1);
    /* EVERY SENDER'S PROMISE, CAUGHT OFF THE REAL PAYLOAD. The city iframe is
       LAZY -- #cityFrame does not exist until the CITY tab is opened, and every
       sender begins `if(!fr||!fr.contentWindow)return false`, so a probe that just
       calls them catches nothing and would have scored 0 of 0 as a pass. A gate
       that reads zero senders and says "all agree" is the vacuous control this
       lane has already been burned by once. So the target is INSTALLED, the real
       sender code runs, and its real message object is read. */
    const seen = [];
    let fr = document.getElementById('cityFrame');
    let planted = false;
    if (!fr) { fr = document.createElement('iframe'); fr.id = 'cityFrame';
      fr.style.cssText = 'position:absolute;left:-9999px;width:64px;height:64px';
      document.body.appendChild(fr); planted = true; }
    out.planted = planted;
    const target = fr && fr.contentWindow;
    if (target) {
      const orig = target.postMessage.bind(target);
      try {
        target.postMessage = function (m) { try {
          if (m && typeof m === 'object' && m.type && /CAST|CITY_PLAYER/.test(m.type))
            seen.push({ type: m.type, w: m.w, h: m.h });
        } catch (e) {} return orig.apply(this, arguments); };
        try { CCAST = false; G._sentLook = null; } catch (e) {}
        for (const fn of ['citySendPlayer', 'citySendCast', 'runSendCast'])
          { try { if (typeof window[fn] === 'function') window[fn](); } catch (e) {} }
      } finally { try { target.postMessage = orig; } catch (e) {} }
    }
    if (planted && fr.parentNode) fr.parentNode.removeChild(fr);
    out.seen = seen;
    return out;
  });

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);

  ok('the constant reaches the running game and the bake ships exactly it: CAST_PX=' +
     R.CAST_PX + ', the baked frame is ' + R.bakedW + 'x' + R.bakedH,
     R.CAST_PX !== null && R.bakedW === R.CAST_PX && R.bakedH === R.CAST_PX);

  /* THE PROMISE MUST EQUAL THE PAYLOAD. This is the claim that catches a sender
     left behind when the number moves. */
  const promises = (R.seen || []).filter(s => typeof s.w === 'number');
  const agree = promises.filter(s => s.w === R.CAST_PX && s.h === R.CAST_PX);
  ok('every body message PROMISES the size the bake actually ships (' + agree.length +
     ' of ' + promises.length + ' senders caught on the wire: ' +
     (promises.map(s => s.type).join(', ') || 'none'), promises.length > 0 && agree.length === promises.length);

  /* AND THE SENDER COUNT IS ITS OWN CLAIM, because "0 of 0 agree" is not a pass.
     The first cut of this gate scored exactly that and called it green. */
  ok('senders were actually caught on the wire, not zero of zero (' + promises.length +
     ' caught' + (R.planted ? ', target installed because the city iframe is lazy' : '') + ')',
     promises.length >= 2);

  console.log('');
  console.log('  WHAT THE STREET IS HANDED TODAY, measured, so the cost of his ruling is known:');
  console.log('    the rig renders ' + R.rigW + 'x' + R.rigH + ' and a standing body spans ' + R.rigBodyRows + ' rows;');
  console.log('    the cast ships at ' + R.CAST_PX + ', which keeps 25% of the body pixels (4,691 of 18,739)');
  console.log('    and a 49-row body, while 158 of 160 colours survive. The loss is RESOLUTION, not palette,');
  console.log('    and the city doubles it back with Scale2x to draw it.');
  console.log('    Rule 16 wants bodies LARGER. That is now ONE edit here, and at 112 the halve stops');
  console.log('    happening by itself because the frame already arrives at the asked-for size.');
  console.log('    WHEN it grows is RUN\'s call: the law gives RUN the one constant and gives this lane');
  console.log('    "the rig at the new size". Nothing about the street has been changed by this gate\'s work.');

  /* *** AND THE NUMBER IS COUPLED TO A FILE THIS LANE DOES NOT OWN. ***
     Rule 16 wants bodies larger, and the obvious move is to raise CAST_PX to the
     rig's native 112. MEASURED on the city's own code, and it would be a
     REGRESSION: the city builds its sprite ladder by DOUBLING WHATEVER IT IS SENT,
     and it picks the box independently. Ship 56 and the two agree at every zoom.
     Ship 112 and it hands a double-size picture to the same box.

     THE FIRST TWO CUTS OF THIS GUARD WERE BOTH WRONG, AND THE SECOND ONE IS WHY
     THIS IS BEHAVIOURAL NOW.
     Cut one asserted "CAST_PX is one of the city's rungs". 112 IS a rung, so the
     exact regression walked through; a mutation caught it.
     Cut two asserted 2 x CAST_PX against a rung REGEX'd out of the city source.
     That read the LEGACY branch of bodyLadder -- and bodyLadder has TWO paths now.
     CHARACTER added a ruled path that fires the moment a lot fits on screen, and
     MEASURED, IT IS ALREADY LIVE: at C 14 to 22 in human mode the city draws the
     body into a 224 box today. A regex on the legacy line would have stayed green
     while the real box doubled. A guard that reads a hardcoded expression is
     measuring something narrower than the thing it names -- the same shape as every
     ruler bug this clip has had.
     SO IT ASKS THE CITY'S OWN FUNCTIONS, across every zoom it can be at, on BOTH
     paths: the sprite the city materialises must equal the box it draws into. That
     is one invariant covering both branches, and it stays true when RUN moves the
     camera. */
  const cityFile = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
  if (fs.existsSync(cityFile)) {
    const cpg = await br.newPage();
    const cerr = []; cpg.on('pageerror', e => cerr.push(e.message));
    await cpg.goto('file://' + cityFile, { waitUntil: 'load' });
    await SETTLE(cpg, 3000);
    const L = await cpg.evaluate((CAST) => {
      /* the multiplier the city's draw code applies for each bodySpriteC answer:
         _hd4 (x4) at 64, _hd (x2) at 32, the shipped frame at 17, _half below. */
      const mult = sc => sc >= 64 ? 4 : (sc >= 32 ? 2 : (sc >= 17 ? 1 : 0.5));
      /* WHICH BRANCH RAN, not which condition is true. Asking lotFitsOnScreen
         myself measures the CONDITION; a mutation that hardcodes bodyLadder to its
         legacy line leaves the condition perfectly true and the branch dead, and
         the first cut of this claim scored that 12/0. So the real function is
         wrapped and bodyLadder is asked: if it never consults the condition, the
         ruled path is gone. */
      const rows = [];
      let ruled = 0, legacy = 0, asked = 0;
      const realFits = BODY_SCALE.lotFitsOnScreen;
      for (const C of [6, 8, 11, 14, 17, 22, 28, 32, 40, 44, 56, 64, 80, 88]) {
        let saw = null;
        BODY_SCALE.lotFitsOnScreen = function (c) { asked++; saw = !!realFits.call(BODY_SCALE, c); return saw; };
        let lad = null, sc = null;
        try { lad = bodyLadder(C); } catch (e) {}
        try { sc = bodySpriteC(C); } catch (e) {}
        BODY_SCALE.lotFitsOnScreen = realFits;
        if (saw === true) ruled++; else if (saw === false) legacy++;
        const sprite = mult(sc) * CAST;
        rows.push({ C, ruled: saw === true, box: lad, sprite, agree: sprite === lad });
      }
      return { rows, ruled, legacy, asked, ok: typeof bodyLadder === 'function' && typeof bodySpriteC === 'function' };
    }, R.CAST_PX);
    await cpg.close();

    ok('the city\'s own body functions are reachable, so this coupling is checked by ' +
       'ASKING them and not by reading a hardcoded line (' + (cerr.length ? cerr[0] : 'no page error') + ')',
       L.ok && cerr.length === 0);

    const bad = L.rows.filter(r => !r.agree);
    ok('AT EVERY ZOOM THE CITY CAN BE AT, the sprite it builds from what this lane ships ' +
       'equals the box it draws into: ' + (L.rows.length - bad.length) + ' of ' + L.rows.length +
       ' zooms agree' + (bad.length ? ' -- MISMATCH at C=' + bad.map(r => r.C + ' (box ' + r.box +
       ', sprite ' + r.sprite + ')').join(', ') : '') + '. Raise CAST_PX alone and every one of ' +
       'them doubles past its box.', bad.length === 0);

    /* AND BOTH PATHS MUST ACTUALLY BE EXERCISED, or this is the vacuous control again. */
    ok('and bodyLadder ACTUALLY CONSULTED the ruled condition on every zoom, so neither ' +
       'path is dead code this guard cannot see (' + L.asked + ' consultations, ' + L.ruled +
       ' ruled, ' + L.legacy + ' legacy)',
       L.asked >= L.rows.length && L.ruled > 0 && L.legacy > 0);

    console.log('');
    console.log('  the city\'s rung ladder against what this lane ships, every zoom, both paths:');
    for (const r of L.rows)
      console.log('    C ' + String(r.C).padStart(2) + '  ' + (r.ruled ? 'RULED ' : 'legacy') +
        '  box ' + String(r.box).padStart(3) + '  sprite ' + String(r.sprite).padStart(3) +
        '  ' + (r.agree ? 'agree' : '*** MISMATCH ***'));
  }

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
