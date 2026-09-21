const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ===== COMBAT SCALE GATE (8/11/26) — THE GATE FOR THE GIANTS =====
   Paolo, on what I shipped: "are you fucking for real like you're going to
   stretch the fucking map so the characters look like fucking Giants on the
   map... that was so creepy and so bad."

   HE WAS RIGHT AND IT WAS A REAL BUG. V138 zoomed the board out by lowering the
   tile pitch. The FLOOR obeyed. THE PEOPLE DID NOT, because every human is
   blitted from a 112x112 canvas at a HARDCODED size that does not know the
   board exists. A body went from ~3 tiles tall to ~6.9 and I shipped it.

   *** THE REAL FAILURE IS THAT I LOOKED STRAIGHT AT IT. *** I rendered the
   board at four pitches, saw the bodies were not shrinking, and wrote down
   "bodies stay readable at every pitch" as a PASS. Looking is not verifying if
   you do not know what would count as failure. So the thing I got wrong by eye
   is a NUMBER here:

       HOW MANY TILES TALL IS A MAN?  It must not change when the zoom changes.

   This boots the real alpha, opens the real combat frame, and reads the real
   drawing constants at several zoom levels. If the floor and the people ever
   stop dividing by the same number, this fails.

   node gates/combat_scale_gate.js
*/
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

let pass = 0; const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fails.push(name + (detail ? ': ' + detail : '')); console.log('  FAIL ' + name + (detail ? '  (' + detail + ')' : '')); }
}

(async () => {
  console.log('=== COMBAT SCALE GATE ===');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + path.resolve(process.argv[2] || 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load', timeout: 120000 });
  await SETTLE(p, 9000);
  await p.mouse.click(215, 450); await SETTLE(p, 2500);
  await p.mouse.click(215, 450); await SETTLE(p, 2500);
  await p.evaluate(() => { document.querySelector('[data-p="combat"]').click(); });
  await SETTLE(p, 7000);
  const f = p.frames().find(x => x.name() === 'combatFrame');
  if (!f) { console.log('  FAIL no combatFrame'); await b.close(); process.exit(1); }
  const box = await (await p.$('#p-combat')).boundingBox();
  await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await SETTLE(p, 4500);

  const R = await f.evaluate(() => {
    /* *** AND THE PROBE WAS READING THE WRONG CANVAS THE WHOLE TIME (found 9/21). ***
       querySelector('canvas') returns the FIRST canvas in the document, which is the
       183x54 LOGO, not the board. Every canvas-dependent number this gate has ever
       printed was measured off a logo: that is why "visible" read 0.2 tiles the moment
       it was pointed at the real pitch. The tilesTall ratio survived it by accident,
       because both halves divided by the same wrong m. The board is #cv. */
    const cv = document.getElementById('cv') || document.querySelector('canvas');
    const W = cv.width, H = cv.height, m = Math.min(W, H);
    /* THE REAL PROBE: the game's OWN functions, at the zoom that actually
       ships. FIELD_ZOOM is a const and cannot be driven from here, which is
       correct -- so the invariant is stated against the UNZOOMED board:
       a man must be the same number of tiles tall at the shipped zoom as he
       was at zoom 1, or the floor and the people are not dividing by the same
       number and somebody is a giant. */
    const ringNow = m * FIELD_PITCH;
    const bodyNow = 112 * bodyScale();
    const ringRef = m * 0.085;          /* zoom 1: the board as it always was */
    const bodyRef = 112 * 1;
    return { zoom: FIELD_ZOOM,
             zoomIsInt: Number.isInteger(FIELD_ZOOM),
             pitchDerived: Math.abs(FIELD_PITCH - 0.085 / FIELD_ZOOM) < 1e-9,
             hasBodyScale: typeof bodyScale === 'function',
             hasContentR: typeof contentR === 'function',
             tilesTallNow: +(bodyNow / ringNow).toFixed(4),
             tilesTallRef: +(bodyRef / ringRef).toFixed(4),
             /* rule 21 (9/21) asks about PIXELS, not tiles, on the house board, and
                the lot is TILE_WIDE sprite widths -- so the probe hands back both in
                the unit the ruling uses, and which board it is standing on. */
             house: (typeof houseOn === 'function') ? !!houseOn() : false,
             bodyPx: +bodyNow.toFixed(4),
             ringNow: +(m * fieldPitch(W, H)).toFixed(4),
             tileWide: (typeof TILE_WIDE !== 'undefined')
               ? ((typeof G !== 'undefined' && G.tileWide) || TILE_WIDE) : 0,
             /* REPOINTED 9/21 (V223), AND IT WAS WRONG IN BOTH DIRECTIONS. This read
                0.85/FIELD_PITCH, the pitch BEFORE V198's tile-wide multiplier, so it
                answered a question about a board the game stopped drawing in V198:
                30 tiles visible when the real number was 10.2. That is why this leg
                has been red on main -- against a contentR of 7.6, a FALSE 30. Read
                through the pitch the floor actually uses, the same tree is 3.4
                against a contentR of 3.9, and the leg is telling the truth for the
                first time since V198. */
             visible: +(0.85 / fieldPitch(W, H)).toFixed(1),
             visibleOldUnit: +(0.85 / FIELD_PITCH).toFixed(1),
             contentR: +contentR().toFixed(1) };
  });

  ok('FIELD_ZOOM is a WHOLE NUMBER (pixel art may only scale by integers under nearest-neighbour; a fractional multiplier makes some source pixels cover two screen pixels and their neighbours one, so columns come out fatter and everything shimmers when it moves)',
     R.zoomIsInt, 'FIELD_ZOOM=' + R.zoom);
  ok('the floor pitch is DERIVED from the zoom, not typed in: FIELD_PITCH === 0.085/FIELD_ZOOM. V138 shipped 0.038, which is 0.085 over nothing -- a number picked off a screenshot',
     R.pitchDerived);
  ok('the people have a scale AT ALL: bodyScale() exists. Before this, every human was blitted at a hardcoded 112x112 that did not know the board existed',
     R.hasBodyScale);
  ok('how far the world is BUILT is derived from how far he can SEE: contentR() exists, so a zoom change can never leave a ring of bare desert at the edge of the board by construction',
     R.hasContentR);

  /* *** THE ONE THAT WOULD HAVE CAUGHT IT, RE-POINTED ONTO THE NEWEST RULING, 9/21. ***
     This leg used to read: "a man is the same number of TILES tall as he was before the
     zoom... the floor and the people must divide by the same number". RULE 21 (9/21,
     laws/BOHEMIA_LAW_THE_GROUND_MAY_ZOOM_THE_PERSON_MAY_NOT_9_21_26.md) says the
     opposite in as many words: "A person is drawn at ONE pixel size on every surface he
     walks or fights on (112 box) and THE CAMERA MOVES THE GROUND, NEVER HIS SIZE."
     Newest date wins, and this lane's own 9/12 standing note is the procedure: A GATE
     MUST NEVER OUTRANK A RULING -- when a leg fires, read what it asserts against the
     newest ruling BEFORE you read it against the code.
     IT IS NOT LOOSENED, IT IS TURNED OVER. The giants bug was a body whose PIXELS moved
     with the camera, and that is exactly what is checked now, in the unit the ruling
     uses. V138's 2.24x still fails it, because V138 moved the pixels. The body board is
     unchanged and still holds the old invariant, because bodyScale is still 1/FIELD_ZOOM
     there -- so both boards are checked, each against its own rule. */
  if (R.house) {
    ok('*** A MAN IS THE SAME NUMBER OF PIXELS AT EVERY ZOOM (rule 21: the ground may zoom, the person may not). *** The giants bug was a body whose pixels moved with the camera; V138 would still fail this at 2.24x',
       Math.abs(R.bodyPx - 112) < 1e-3,
       'the fighter is ' + R.bodyPx + ' px, and the box the street ships at is 112');
    ok('and the lot moved instead, to TILE_WIDE sprite widths, which is his dial',
       Math.abs(R.ringNow - R.tileWide * 112) < 1.5,
       'lot=' + R.ringNow.toFixed(1) + ' wanted=' + (R.tileWide * 112).toFixed(1));
  } else {
    ok('*** A MAN IS THE SAME NUMBER OF TILES TALL AS HE WAS BEFORE THE ZOOM (the body board, where the old invariant still rules). ***',
       Math.abs(R.tilesTallNow - R.tilesTallRef) < 1e-3,
       'shipped=' + R.tilesTallNow + ' unzoomed=' + R.tilesTallRef +
       ' (ratio ' + (R.tilesTallNow / R.tilesTallRef).toFixed(2) + 'x)');
  }

  ok('the world is BUILT further than he can SEE, so no zoom leaves a ring of bare desert at the edge of the board (visible ' + R.visible + ' tiles, content ' + R.contentR + ')',
     R.contentR > R.visible);

  ok('no page errors while the board drew', errs.length === 0, errs.slice(0, 2).join(' | '));

  await b.close();
  console.log('\n=== COMBAT SCALE GATE: ' + pass + ' passed, ' + fails.length + ' failed ===');
  if (fails.length) { for (const x of fails) console.log('  - ' + x); process.exit(1); }
})();
