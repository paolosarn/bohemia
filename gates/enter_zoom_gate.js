#!/usr/bin/env node
/* ============================================================================
   HOW THE FIGHT BEGINS: THE CAMERA PULLS BACK
   (9/11/26, COMBAT lane, VAMILY row [enter zoom])

   PAOLO RULED IT 9/6, OPTION A: "Yes definitely, and the map will zoom out
   nicely, maybe a cloud opacity somewhere."

   The row: you never leave the street. When a fight starts the view zooms out
   from person-scale to house-scale over the SAME ground you are standing on, on
   the beat at 120 BPM, and comes back in when it ends. HIS DETAIL, LOCKED: a
   cloud passes in the turn, a soft opacity layer that covers the moment the
   scale changes, so the zoom reads as weather and not as a loading screen.

   WHY THIS IS ITS OWN GATE. combat_entry_gate has forty arms in front of this
   one and they leave the shell showing the FIGHT panel with the city frame
   hidden -- and a hidden document gets no animation frames, so every attempt to
   drive a 500 ms camera move from down there waited for frames that were never
   coming. This one boots, puts the STREET on screen, and asks its question
   first. A gate that has to unwind another gate's state is the wrong gate.

   EVERY LOOP IN HERE HAS A WALL-CLOCK WAY OUT, for the same reason: an
   animation-frame loop inside a document the shell may hide is a hang, not a
   failure, and a hang reads as a broken machine rather than a broken feature.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LEDGER = path.join(__dirname, '..', 'engine', 'bohemia_draw_budget.json');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const done = async (br) => { if (br) await br.close();
  console.log('=== ENTER ZOOM GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  await page.goto('file://' + ALPHA);
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(4000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });

  const city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
  ok('the walked street is on screen, which is where this move happens', !!city);
  if (!city) return done(browser);

  /* ---- 1. IT LASTS TWO BEATS, AND EVERY ENTRY USES IT ------------------ */
  const wired = await city.evaluate(() => {
    const src = String(streetFightOnStep) + String(roadContactFight) + String(cityFightOnEnter);
    return { out: typeof fightZoomOut === 'function', back: typeof fightZoomIn === 'function',
      door: typeof cityHandOver === 'function', shade: typeof fightShade === 'function',
      paint: typeof fzPaint === 'function',
      /* RAW MEANS A POST THAT BYPASSES THE DOOR, not the word ENCOUNTER. The
         first cut counted the message's own type field and got four out of four
         entries that all DO go through the door -- the type is still in the
         object either way, so it was counting the thing both versions share. */
      raw: src.split('parent.postMessage({type:').length - 1,
      viaDoor: src.split('cityHandOver(').length - 1,
      /* AND THE DOOR ASKS FOR THE OTHER SKIN, which is the look card's own
         clause: a room gets the doorway's shadow, not a cloud. */
      doorSkin: String(cityFightOnEnter).indexOf("'door')") >= 0,
      streetSkins: (String(streetFightOnStep) + String(roadContactFight)).indexOf("'door'") >= 0,
      ms: FZ_MS, beat: BEAT, deep: FZ_DEEP, core: FZ_CORE, hand: FZ_HAND };
  });
  console.log('  wired: ' + JSON.stringify(wired));
  ok('V205 THE MOVE EXISTS AND EVERY ENTRY GOES THROUGH IT. A street bump, a crew closing on you, a road contact and a door into a room all used to hand over with a hard cut of their own; all four go through one door now (' + wired.viaDoor
    + ', with ' + wired.raw + ' still raw), which is the row\'s own sentence: SAME MOVE for a street fight and for a room, both directions. AND IT LASTS TWO BEATS (' + wired.ms
    + ' against the city\'s own ' + wired.beat + '), which is not a duration I picked: DIRECTION\'s look card of 9/6 rules it, "beat one the cloud arrives, beat two the scale settles... A longer zoom reads as a cutscene; a shorter one as a glitch." The first cut of this row ran ONE beat, because it was built before I read the card the card itself routes to this row. AND A ROOM GETS THE OTHER SKIN (' + wired.doorSkin
    + '), the doorway\'s own shadow rather than a cloud, with the street entries asking for no skin at all (' + !wired.streetSkins
    + '): one mechanism, two skins, and the card says the skins never mix',
    wired.out && wired.back && wired.door && wired.shade && wired.paint
    && wired.raw === 0 && wired.viaDoor === 4
    && wired.ms === wired.beat * 2 && wired.beat === 500
    && wired.doorSkin === true && wired.streetSkins === false);

  /* ---- 2. THE PICTURE MOVES AND THE CAMERA DOES NOT -------------------- */
  const move = await city.evaluate(() => new Promise(res => {
    const gx = cv.getContext('2d', { willReadFrequently: true });
    /* THE LEFT EDGE OF THE SCREEN. It is street before the move and it is not
       street during it, because the street has been scaled away from it. Read
       off the glass, not off a variable. */
    const edge = () => { const d = gx.getImageData(2, (cv.height / 2) | 0, 30, 1).data;
      let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
      return s / (d.length / 4) / 3; };
    const hc0 = HC, e0 = edge();
    let frames = 0, peakAt = null, shades = 0;
    /* THE SCALE IS READ OFF THE ARGUMENT THE SHIPPED PAINT IS CALLED WITH, not
       guessed from pixels: that is the number that IS the pull-back, and a pixel
       reading of it cannot tell a zoom from the shade passing over the same
       pixels. The shade is counted the same way, off its own calls. */
    const scales = [], liveFrames = [], curve = [];
    const realPaint = window.fzPaint, realShade = window.fightShade;
    window.fzPaint = function (snap, s) { frames++; scales.push(s);
      /* AND THE SCALE IS CHECKED AGAINST THE CLOCK IT IS DRIVEN BY, which is the
         claim that survives a stalled machine: how MANY frames the pull-back gets
         is the browser's business, but every frame it does get has to be at the
         scale the elapsed time says. */
      curve.push([performance.now() - t0, s]);
      return realPaint.apply(this, arguments); };
    window.fightShade = function (a, u) { shades++; liveFrames.push([Math.round(a * 100) / 100, Math.round(u * 100) / 100]);
      return realShade.apply(this, arguments); };
    const t0 = performance.now(), hc = [], seen = [];
    /* *** AND THE SAMPLER RUNS TO THE END OF THE MOVE, NOT FOR A FIXED WINDOW,
       BECAUSE THIS MACHINE STALLS. *** MEASURED, with nothing running at all: the
       walked city gets TEN animation frames a second here and its worst gap
       between two of them is 1439 ms. A sampler that watches for a fixed 1150 ms
       therefore reports "the pull-back never happened" on a build where it
       happens perfectly -- which is exactly what the first cut of this arm did,
       and the cause was one stall in the browser, not one line of the move. So it
       polls until the move says it is finished, with a wall-clock ceiling. */
    let worstGap = 0, lastTick = t0;
    const finish = (starved) => { window.fzPaint = realPaint; window.fightShade = realShade;
      res({ frames: frames, shades: shades, peakAt: peakAt, starved: !!starved,
        worstGap: Math.round(worstGap),
        hc0: hc0, hcEnd: HC,
        minScale: scales.length ? Math.round(Math.min.apply(null, scales) * 100) / 100 : null,
        maxScale: scales.length ? Math.round(Math.max.apply(null, scales) * 100) / 100 : null,
        offCurve: curve.length ? Math.round(Math.max.apply(null, curve.map(function (r) {
          const u = Math.min(1, r[0] / FZ_MS);
          const p = Math.max(0, Math.min(1, (u - FZ_PULL0) / (FZ_PULL1 - FZ_PULL0)));
          return Math.abs(r[1] - (1 - (1 - FZ_DEEP) * ease(p)));
        })) * 1000) / 1000 : null,
        curveN: curve.length,
        hcMoved: hc.length ? Math.max.apply(null, hc.map(v => Math.abs(v - hc0))) > 0.01 : null,
        inkBefore: Math.round(e0 * 10) / 10,
        inkDelta: seen.length ? Math.round(Math.max.apply(null, seen.map(v => Math.abs(v - e0))) * 10) / 10 : 0,
        firstShade: liveFrames.length ? liveFrames[0] : null,
        lastShade: liveFrames.length ? liveFrames[liveFrames.length - 1] : null,
        zooming: FZOOMING }); };
    const bail = setTimeout(() => finish(true), 9000);
    FZOOMING = false;
    const started = fightZoomOut(function () { peakAt = Math.round(performance.now() - t0); });
    const tick = () => { const n = performance.now();
      if (n - lastTick > worstGap) worstGap = n - lastTick;
      lastTick = n;
      hc.push(HC); seen.push(edge());
      /* it ends when the MOVE ends -- the latch it holds while it is running --
         and the ceiling is only there so a broken build cannot hang the suite */
      if (FZOOMING && n - t0 < 8000) return setTimeout(tick, 25);
      clearTimeout(bail); finish(false); };
    if (!started) { clearTimeout(bail); return finish(false); }
    setTimeout(tick, 25);
  }));
  /* READ AFTER, NOT INSIDE. The sampler resolves on the same animation frame the
     move's last one lands on, and which of the two callbacks runs first is not
     something to assert. The claim is that it CLEARS. */
  await sleep(900);
  move.zooming = await city.evaluate(() => FZOOMING);
  console.log('  the move: ' + JSON.stringify(move));
  ok('V205 *** AND THE PICTURE MOVES WHILE THE CAMERA DOES NOT, WHICH IS THE CORRECTION THAT MADE THIS WORK. *** The first cut drove HC -- the walked street\'s pixels per cell, the way the map transition does -- and two things came straight back off the real surface. ELEVEN FRAMES IN EIGHT HUNDRED MILLISECONDS, because re-rendering the city at a new zoom busts its chunk cache every single frame; and HC LEFT AT 1.4, a blur of dots where the street used to be, because I read that function\'s curve as spanning the whole move when its own ease never reaches more than a half. So the frame ALREADY on the glass is photographed once and that one bitmap is scaled: ' + move.frames
    + ' frames of it, ending at ' + move.minScale
    + ' -- and EVERY FRAME IT GOT WAS AT THE SCALE THE CLOCK SAYS, the worst one off the curve by ' + move.offCurve
    + '. That is the claim that survives this machine: how many frames a 500 ms move gets here is the browser\'s business (one stall of ' + move.worstGap
    + ' ms can eat the whole second beat and leave a single frame), but the scale of every frame it does get is arithmetic off the elapsed time. Read off the SCALE the shipped paint is handed, which is the number that IS the zoom, because a pixel reading cannot tell a zoom from the shade crossing the same pixels. The camera is untouched (moved: ' + move.hcMoved + ', ended at ' + move.hcEnd + ' from ' + move.hc0
    + '), and the edge of the screen really does change (' + move.inkBefore + ' by ' + move.inkDelta
    + '). One blit a frame, and it cannot strand a camera it never touches. AND THE FIRST BEAT IS THE LIVE WORLD, not a photograph: the shade is painted over ' + move.shades
    + ' real renders before the scale starts moving, which is the card\'s own clause -- "the world clock, the music transport and the walk beat run through the turn uninterrupted. The transition is weather, not a pause."',
    move.starved === false && move.frames >= 1 && move.shades >= 2
    && move.minScale !== null && move.minScale <= 0.35
    && move.offCurve !== null && move.offCurve < 0.03
    && move.hcMoved === false && Math.abs(move.hcEnd - move.hc0) < 0.01
    && move.inkDelta > 8 && move.zooming === false);

  ok('V205 AND THE HANDOVER FIRES UNDER THE SHADE, at four fifths of the move (' + move.peakAt
    + ' ms of 1000), MEASURED WHERE IT HAPPENS. The first cut timed it from the shell -- the gap between a Playwright call going out and a message arriving -- and read 940 ms, which is mostly the round trip between a test runner and a browser. The number that matters is inside the document doing the work. MEASURED, AND IT IS WHY THIS IS ON A CLOCK AT ALL: the walked city idles at TWENTY frames a second here and fell to THREE under load, which put the handover at 845 ms on the frame-counted version -- a visible hitch before a fight the row says starts on the beat. The picture is allowed to be as smooth as the document can manage; WHEN the fight starts is not. AND FOUR FIFTHS IS THE CARD\'S ARITHMETIC, not a feel: the shade has to be OVER the player when the documents swap, and it also has to be "gone by the end of beat two, fully - no lingering tint, no residue", so the swap happens with 200 ms of the second beat still left for the shell to take it off in. THE BAND IS EARLY-SIDE EXACT AND LATE-SIDE MEASURED: it may never fire BEFORE the mark, because that would hand over with the shade off the player; and it is allowed to be late by however long this machine actually stalled during the run (worst gap between two frames: ' + move.worstGap
    + ' ms, against a baseline of 1439 ms with nothing running), because a timer cannot fire while the thread is blocked and that is the browser, not the build',
    typeof move.peakAt === 'number' && move.peakAt >= 780
    && move.peakAt <= 800 + Math.max(250, move.worstGap + 120));

  /* ---- 2b. THE CARD'S OWN NUMBERS, READ OFF THE GLASS ------------------
     DIRECTION ruled what this half second looks like on 9/6 and routed the card
     to this row by name, so these are not my taste and they are not adjectives:
     a value multiplier darkening to 0.75-0.85 at the core, value ONLY, covering
     at most 60% of the frame at its peak, travelling one way across it.
     THE WORLD UNDERNEATH IS FROZEN FOR THE MEASUREMENT and nothing else is: the
     shipped fightShade is called on the shipped canvas, and the base picture is
     held still because that is the only way to read a multiplier -- a moving
     street would be measured as part of the shade. */
  const spec = await city.evaluate(() => {
    const gx = cv.getContext('2d', { willReadFrequently: true });
    const W = cv.width, H = cv.height;
    try { render(); } catch (e) {}
    const base = gx.getImageData(0, 0, W, H).data;
    const held = document.createElement('canvas'); held.width = W; held.height = H;
    held.getContext('2d').drawImage(cv, 0, 0);
    const sample = (u, skin) => {
      g.drawImage(held, 0, 0);
      fightShade(1, u, skin);
      const d = gx.getImageData(0, 0, W, H).data;
      let n = 0, dark = 0, cx = 0, cw = 0;          /* coverage, over any pixel with ink */
      let bn = 0, minR = 9, worst = 0;              /* the band and the hue test, BRIGHT pixels
                                                       only: an 8-bit channel of 20 cannot show a
                                                       multiply to better than a twentieth, and
                                                       that quantisation is not a hue rotation */
      for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
        const i = (y * W + x) * 4, b0 = base[i], b1 = base[i + 1], b2 = base[i + 2];
        if (b0 < 12 && b1 < 12 && b2 < 12) continue;
        const rs = []; if (b0 > 8) rs.push(d[i] / b0); if (b1 > 8) rs.push(d[i + 1] / b1);
        if (b2 > 8) rs.push(d[i + 2] / b2);
        if (!rs.length) continue;
        const r = rs.reduce((p, q) => p + q, 0) / rs.length;
        n++; if (r < 0.85) { dark++; cx += x; cw++; }
        if (Math.min(b0, b1, b2) > 60) { bn++;
          if (r < minR) minR = r;
          const sp = Math.max.apply(null, rs) - Math.min.apply(null, rs);
          if (sp > worst) worst = sp; }
      }
      return { pxAny: n, pxBright: bn,
        darkPct: n ? Math.round(dark / n * 1000) / 10 : null,
        minRatio: minR < 9 ? Math.round(minR * 1000) / 1000 : null,
        hueSpread: Math.round(worst * 1000) / 1000,
        centroid: cw ? Math.round(cx / cw / W * 1000) / 1000 : null };
    };
    const out = { us: {} };
    [0.2, 0.4, 0.6, 0.78, 0.95].forEach(u => { out.us['u' + u] = sample(u, 'cloud'); });
    out.door = sample(0.5, 'door');
    out.clear = sample(0, 'cloud');
    try { render(); } catch (e) {}
    return out;
  });
  const peakU = spec.us['u0.78'], trav = [0.2, 0.4, 0.6, 0.78, 0.95]
    .map(u => spec.us['u' + u].centroid).filter(v => v != null);
  const travels = trav.length >= 3 && trav.every((v, i) => i === 0 || v > trav[i - 1] - 0.001);
  const coverOK = Object.keys(spec.us).every(k => spec.us[k].darkPct <= 60);
  const bandOK = peakU.minRatio >= 0.74 && peakU.minRatio <= 0.86;
  const valueOnly = Object.keys(spec.us).every(k => spec.us[k].hueSpread <= 0.08);
  console.log('  the shade, frame by frame: ' + JSON.stringify(spec.us));
  console.log('  the door skin: ' + JSON.stringify(spec.door) + '   travel: ' + JSON.stringify(trav));
  ok('V205 *** AND IT IS A CLOUD SHADOW, WHICH IS DIRECTION\'S RULING AND WAS NOT WHAT I BUILT FIRST. *** The card of 9/6 is routed to this row by name and says it plainly: "a soft-edged VALUE MULTIPLIER (darken to 0.75-0.85 at its core, feathered wide)... No white mist, no blur -- this is a desert with a sun, and what crosses a desert street is shade." MY FIRST CUT WAS PALE DUST, the white mist the card bans by name, because I built the row before I read the card. Measured on the shipped canvas with the world held still: the darkest the street gets is x' + peakU.minRatio
    + ' of what it was (the card\'s band is 0.75 to 0.85) and the worst disagreement between the three channels anywhere in the frame is ' + peakU.hueSpread
    + ' -- so it "multiplies value and touches NOTHING else, no hue rotation, no saturation change". That is arithmetic and not an eye: black at an alpha scales every channel by the same (1-alpha), which is why it is drawn that way and not as a grey fill or a blend mode',
    bandOK && valueOnly && peakU.pxBright > 200);

  ok('V205 AND IT COVERS AT MOST 60% OF THE FRAME AND TRAVELS ACROSS IT, the other two clauses my first cut broke. The card: the core "covers at most 60% of the frame at its peak and NEVER the whole screen - a full-frame dim is a fade-to-black in a costume, which is the hard cut again", and "one direction of travel... it enters one screen edge and leaves the other. A shadow that blooms in place reads as an effect; one that CROSSES reads as sky." Measured across the move, the shaded part of the frame peaks at ' + peakU.darkPct
    + '% and its centre walks ' + JSON.stringify(trav)
    + ' across the width, one way, never back. My first cut bloomed in place over the whole frame, which is the thing the card calls the hard cut again. AND IT IS GONE WHEN IT IS GONE: at the start of the move the frame is ' + spec.clear.darkPct
    + '% shaded, so there is no residue and no tint sitting on the street between fights',
    coverOK && peakU.darkPct > 8 && travels && spec.clear.darkPct < 1);

  ok('V205 AND A ROOM IS NOT A CLOUD: "the shade is the DOORWAY\'S own shadow sweeping the frame as you cross the threshold -- interior dark, not a cloud. One mechanism, two skins; the skins never mix." The door skin measures darker at its core (x' + spec.door.minRatio
    + ' against the cloud\'s x' + peakU.minRatio + ') and in a different shape (' + spec.door.darkPct
    + '% of the frame against ' + peakU.darkPct + '%), so walking into a house does not look like weather arriving indoors',
    spec.door.minRatio !== null && spec.door.minRatio < peakU.minRatio - 0.05
    && spec.door.hueSpread <= 0.08 && spec.door.darkPct <= 60);

  /* ---- 3. THE FIGHT STARTS ON THE CLOCK -------------------------------- */
  await page.evaluate(() => { window.__z = null; window.__zt = performance.now();
    window.addEventListener('message', e => { const d = e && e.data;
      if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER' && window.__z == null)
        window.__z = Math.round(performance.now() - window.__zt); }); });
  const fired = await city.evaluate(() => {
    const realAdj = window.ctAdjacent;
    window.ctAdjacent = () => ({ id: 'ez_foe', home: [3, 3], hostile: true });
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    try { contactClear(); } catch (e) {}
    FZOOMING = false;
    const r = streetFightOnStep();
    window.ctAdjacent = realAdj;
    return { fired: r, zooming: FZOOMING };
  });
  await sleep(2500);
  const onTime = await page.evaluate(() => window.__z);
  const latch = await city.evaluate(() => FZOOMING);
  console.log('  on the clock: fired ' + JSON.stringify(fired) + ', handover at ' + onTime + ' ms, latch after ' + latch);
  ok('V205 AND THE BUMP REALLY REACHES THE SHELL THROUGH THE MOVE (handover seen ' + onTime
    + ' ms after the call went out, most of which is the test runner\'s own round trip -- the half beat is asserted above, inside the document that does it). AND THE LATCH CLEARS ANYWAY (' + latch
    + '): the handover HIDES this document, so animation frames stop and the second half of the move never runs -- the flag it set would have stayed up forever and refused every fight after the first, which is exactly how a harness of mine hung before a backstop on a real clock was added. ' + latch
    + '): the handover HIDES this document, so animation frames stop and the second half of the move never runs -- the flag it set would have stayed up forever and refused every fight after the first, which is exactly how a harness of mine hung before a backstop on a real clock was added',
    fired.fired === true && typeof onTime === 'number' && onTime > 0 && latch === false);

  /* ---- 4. A REAL FIGHT IS ON THE OTHER SIDE OF IT ---------------------- */
  await sleep(5000);
  const cframe = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  const board = cframe ? await cframe.evaluate(() => ({ arenaKind: G.arenaKind,
    men: (G.e || []).length, roomIsNull: G.cityRoom == null })) : null;
  console.log('  the board: ' + JSON.stringify(board));
  ok('V205 AND A REAL FIGHT IS ON THE OTHER SIDE OF THE CLOUD, on the ground you were standing on: a ' + (board && board.arenaKind)
    + ' board with ' + (board && board.men) + ' men and no room, which is what a street bump is supposed to build. The move is the PICTURE of what the code already does -- the board has been built out of the real place since the door and the street rows -- so if this arm goes red the transition ate the handover rather than dressing it',
    !!board && board.arenaKind === 'street' && board.men >= 1 && board.roomIsNull === true);

  /* ---- 5. THE CLOUD OUTLIVES THE SWAP AND EATS NO TAPS ----------------- */
  const veil = await page.evaluate(() => {
    const v = document.getElementById('fzveil');
    if (!v) return { exists: false };
    const cs = getComputedStyle(v);
    const e = document.elementFromPoint(215, 500);
    return { exists: true, pointer: cs.pointerEvents, z: cs.zIndex,
      under: e ? (e.id || e.tagName) : null, opacity: cs.opacity,
      /* AND THE SHELL'S HALF WEARS THE CARD'S NUMBERS TOO: black at 0.22 is the
         0.78 core, it fades OUT to transparent rather than covering the frame,
         and it keeps travelling as it clears. */
      bg: cs.backgroundImage.replace(/\s+/g, ' '),
      dark: /rgba\(0, ?0, ?0, ?0\.22\)/.test(cs.backgroundImage),
      pale: /rgba\((1[5-9]\d|2[0-5]\d), ?(1[5-9]\d|2[0-5]\d),/.test(cs.backgroundImage),
      fades: /rgba\(0, ?0, ?0, ?0\) 100%/.test(cs.backgroundImage),
      travels: /transform/.test(cs.transitionProperty) };
  });
  console.log('  the shell\'s shade: ' + JSON.stringify(veil));
  ok('V205 AND THE SHADE OUTLIVES THE PANEL SWAP, which the city\'s own canvas cannot do: the handover REPLACES that whole panel, shadow and all, so the cover vanished at the exact instant it was meant to be over the player and you saw weather and then a hard cut. The cover lives above BOTH documents now (z ' + veil.z
    + '), wearing the card\'s numbers and not its own: black at 0.22 alpha is the 0.78 core (' + veil.dark
    + '), nothing pale anywhere in it (' + !veil.pale + '), it feathers out to nothing instead of covering the frame (' + veil.fades
    + ') and it keeps travelling as it clears (' + veil.travels + '). *** AND THAT MEANS THE SWAP IS NOT HIDDEN, WHICH IS THE RULING AND NOT A BUG: *** an opaque cover would hide it completely and a "full-frame dim is a fade-to-black in a costume, which is the hard cut again". What carries the moment instead is that both pictures are the same ground in the same palette at two scales. AND IT CAN NEVER EAT A TAP: pointer-events ' + veil.pointer
    + ', and what is under the finger mid-screen is ' + veil.under
    + ' rather than the veil. A full-screen layer over a phone game is one bad line away from a dead control',
    veil.exists === true && veil.pointer === 'none' && veil.under !== 'fzveil'
    && veil.dark === true && veil.pale === false && veil.fades === true && veil.travels === true);

  /* ---- 6. AND THE WAY BACK IN ------------------------------------------ */
  await page.click('[data-p="run"]', { timeout: 15000 }).catch(() => {});
  await sleep(2500);
  const back = await city.evaluate(() => new Promise(res => {
    const gx = cv.getContext('2d', { willReadFrequently: true });
    const W = cv.width, H = cv.height;
    let frames = 0, shades = 0, lastA = null;
    const realPaint = window.fzPaint, realShade = window.fightShade;
    window.fzPaint = function () { frames++; return realPaint.apply(this, arguments); };
    window.fightShade = function (a) { shades++; lastA = a; return realShade.apply(this, arguments); };
    FZOOMING = false;
    window.dispatchEvent(new MessageEvent('message',
      { data: { type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true } } }));
    setTimeout(() => { window.fzPaint = realPaint; window.fightShade = realShade;
      /* AND NO RESIDUE, WHICH IS THE CARD'S WORD: the frame the move leaves behind
         is compared against a clean render of the same street, pixel by pixel. */
      const after = gx.getImageData(0, 0, W, H).data;
      try { render(); } catch (e) {}
      const clean = gx.getImageData(0, 0, W, H).data;
      let n = 0, moved = 0;
      for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
        const i = (y * W + x) * 4; n++;
        if (Math.abs(after[i] - clean[i]) + Math.abs(after[i + 1] - clean[i + 1])
          + Math.abs(after[i + 2] - clean[i + 2]) > 24) moved++; }
      res({ frames: frames, shades: shades, lastA: lastA == null ? null : Math.round(lastA * 100) / 100,
        residuePct: Math.round(moved / n * 1000) / 10, zooming: FZOOMING, hc: HC, target: HZOOM });
    }, 2000);
  }));
  console.log('  the way back: ' + JSON.stringify(back));
  ok('V205 AND IT COMES BACK IN WHEN THE FIGHT ENDS, which is the other half of his ruling and the card\'s "the return uses the same two beats reversed": ' + back.frames
    + ' frames of the pull coming back out under the shade and ' + back.shades
    + ' of the live street with it clearing off, ending at alpha ' + back.lastA
    + ', and the street left exactly where it was found (' + back.hc + ' against ' + back.target
    + '). AND IT LEAVES NO RESIDUE, which the card demands in those words -- "no lingering tint, no residue; brightness returns to exactly the pre-turn frame": the frame the move ends on differs from a clean render of the same street in ' + back.residuePct
    + '% of its pixels. THE ORDER IS THE SHELL\'S AND IT MATTERS: the way home clicks the RUN tab FIRST and posts the end second, so the street is on screen when this runs -- posted into a hidden document it paints one frame and stops',
    back.frames >= 2 && back.shades >= 2 && back.zooming === false
    && back.residuePct <= 2 && Math.abs(back.hc - back.target) < 0.01);

  /* ---- 7. AND THE FIGHT PAYS NOTHING ---------------------------------- */
  const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  const row = (L.features || []).find(f => /pull-back|cloud/i.test(f.name));
  console.log('  the cost: row ' + !!row + ', in_loop ' + (row && JSON.stringify(row.in_loop))
    + ', draw surface ' + (L.draw_surface || []).length);
  ok('V205 AND THE FIGHT PAYS NOTHING FOR ANY OF IT, which is the law this lane shipped one row earlier: anything new that draws IN THE FIGHT arrives with its cost in milliseconds a beat and does not enter the loop until there is room -- and the worst-case headroom is 2.5 ms. So nothing new draws in there. The pull-back is the CITY\'s (one blit of a frame it had already drawn) and the cover is the SHELL\'s (one div for one beat), both during a handover, and the combat blob\'s draw surface is unchanged at ' + (L.draw_surface || []).length
    + ' functions. The ledger carries this row with in_loop ' + (row && JSON.stringify(row.in_loop))
    + ' and the reason, so the next lane does not have to take my word for it',
    !!row && row.in_loop === false && (L.draw_surface || []).length === 15);

  ok('no page errors through the whole move, out and back', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  console.log('=== ENTER ZOOM GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
