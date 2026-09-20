/* IS THE FIGHTER THE SAME SIZE AS THE WALKER? (9/20/26, CHARACTER lane)
 *
 * RULE 17, THE FIGHT LOOKS LIKE THE GAME (Paolo 9/18, LOCKED): "I played the demo and
 * actually sent the link to someone on Instagram and I was pretty embarrassed... when I
 * zoomed out, it looked good, but WHEN COMBAT STARTED IT WAS SO FUCKING BAD."
 * The fight must be "the same ground art at house scale, THE SAME BODIES AT THE RULED SIZE,
 * the same light and cloud".
 *
 * RULE 18 holds this lane to "measuring your part of loading, walking or the fight". THE
 * BODY IS THIS LANE'S PART OF BOTH WALKING AND THE FIGHT. Walking was measured and fixed
 * last round: one fixed size, 112 box, about 100 px of painted person, at every zoom a
 * pinch can reach. THIS ASKS THE OTHER HALF: does the fight draw that same person?
 *
 * IT IS A MEASUREMENT AND NOT A FIX, ON PURPOSE. The fight board is COMBAT's system and
 * [fight looks] is its row; ONE SYSTEM, ONE SESSION. What this lane owes COMBAT is the
 * ruled number and an honest measurement of the gap, not a patch in their document.
 *
 * WHY IT DECODES RATHER THAN ASKS THE ALPHA: the fight ships as a base64 document inside
 * the alpha, so the only way to run it and read its own numbers is to decode it and serve
 * it. The probe copies it into slices/ for one run and deletes it, and it reads the fight's
 * OWN functions -- FIELD_ZOOM and bodyScale() -- rather than any number retyped here.
 *
 * RIG CHECK (RIG IS LAW): reads only, and writes nothing into the game. REUSE CHECK: cooks
 * nothing.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_is_the_fighter_the_same_size_as_the_walker.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const PORT = process.env.BOHEMIA_PORT || 8231;
const TMP = path.join(REPO, 'slices/_tmp_combat_probe.html');
const OUT = path.join(REPO, 'records/BOHEMIA_IS_THE_FIGHTER_THE_SAME_SIZE_9_20_26.txt');

(async () => {
  const src = fs.readFileSync(ALPHA, 'utf8');
  const m = /const COMBAT_B64='([^']+)'/.exec(src);
  if (!m) { console.error('the alpha does not carry COMBAT_B64 any more'); process.exit(1); }
  fs.writeFileSync(TMP, Buffer.from(m[1], 'base64').toString('utf8'));

  const b = await chromium.launch({ args: ['--no-sandbox'] });
  let F = null, W = null;
  try {
    /* ===== THE FIGHT, RUN ON ITS OWN, READ THROUGH ITS OWN FUNCTIONS ============= */
    const p = await b.newPage({ viewport: { width: 390, height: 844 },
                                deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await p.goto('http://127.0.0.1:' + PORT + '/slices/_tmp_combat_probe.html');
    await new Promise(r => setTimeout(r, 14000));
    F = await p.evaluate(() => {
      const o = {};
      try { o.FIELD_ZOOM = (typeof FIELD_ZOOM !== 'undefined') ? FIELD_ZOOM : null; } catch (e) {}
      try { o.bodyScale = (typeof bodyScale === 'function') ? bodyScale() : null; } catch (e) {}
      o.boxPx = (o.bodyScale == null) ? null : Math.max(1, Math.round(112 * o.bodyScale));
      /* THE SOURCE IS A 112 CANVAS. drawHuman's own line is
         x.drawImage(cv112, 0,0,112,112, ex-56*S, ey-84*S, w, w) with w = 112*S,
         so the box IS 112 scaled, read here rather than retyped. */
      try { o.drawsFrom112 = /drawImage\(cv112,0,0,112,112/.test(String(drawHuman)); } catch (e) { o.drawsFrom112 = null; }
      return o;
    });
    await p.close();

    /* ===== THE STREET, THE SAME QUESTION, THROUGH ITS OWN HELPERS ================ */
    const p2 = await b.newPage({ viewport: { width: 390, height: 844 },
                                 deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await p2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
    await new Promise(r => setTimeout(r, 7000));
    await p2.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
    await new Promise(r => setTimeout(r, 18000));
    const fr = p2.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
    if (fr) W = await fr.evaluate(() => {
      render();
      const o = { box: bodyLadder(HC), HC: HC };
      let s = null;
      const d = BARK_DREW[0];
      if (d) { let dir = 'S'; try { dir = pplFace(d.p, d.at); } catch (e) {}
               try { s = ctBody(d.p, dir); } catch (e) {} }
      if (!s) { try { const set = PLAYER_CV['S'] || PLAYER_CV.S; s = set && set.idle; } catch (e) {} }
      if (s) {
        const img = spriteAt(s, bodySpriteC(HC));
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const g2 = c.getContext('2d', { willReadFrequently: true });
        g2.imageSmoothingEnabled = false; g2.drawImage(img, 0, 0);
        const D = g2.getImageData(0, 0, c.width, c.height).data;
        let y0 = 1e9, y1 = -1;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++)
          if (D[(y * c.width + x) * 4 + 3] >= 128) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
        o.paintedShare = (y1 - y0 + 1) / c.height;
        o.painted = +((y1 - y0 + 1) * o.box / c.height).toFixed(1);
      }
      return o;
    });
    await p2.close();
  } finally {
    await b.close();
    try { fs.unlinkSync(TMP); } catch (e) {}
  }

  const ratio = (F && F.boxPx && W && W.box) ? +(W.box / F.boxPx).toFixed(2) : null;
  /* THE PAINTED HEIGHT IN THE FIGHT IS DERIVED, AND SAYS SO. The fight run on its own has
     no baked body to measure -- it receives one from the alpha at runtime -- but it blits
     the SAME 112 source, so the painted share measured on the street applies. Two measured
     numbers and one multiplication, not a guess, and not presented as a direct reading. */
  const fightPainted = (F && F.bodyScale != null && W && W.paintedShare != null)
    ? +(112 * F.bodyScale * W.paintedShare).toFixed(1) : null;

  const L = [];
  L.push('IS THE FIGHTER THE SAME SIZE AS THE WALKER?  --  CHARACTER lane, 9/20/26');
  L.push('measured on the real surfaces, 390x844 at DPR 3');
  L.push('');
  L.push('RULE 17 (Paolo 9/18, LOCKED): "when I zoomed out, it looked good, but WHEN COMBAT');
  L.push('STARTED IT WAS SO FUCKING BAD." The fight must carry "the same bodies at the ruled');
  L.push('size". RULE 18 holds this lane to measuring its part of walking or the fight, and');
  L.push('the body is its part of both.');
  L.push('');
  L.push('  THE STREET   box ' + (W ? W.box : '?') + ' px    painted ' + (W ? W.painted : '?') + ' px'
    + (W ? '    at walk zoom ' + W.HC : ''));
  L.push('  THE FIGHT    box ' + (F ? F.boxPx : '?') + ' px    painted ' + (fightPainted == null ? '?' : fightPainted)
    + ' px    (derived: the same 112 source at the fight\'s own scale)');
  L.push('');
  if (ratio) {
    L.push('  *** THE SAME PERSON IS ' + ratio + ' TIMES SMALLER THE MOMENT A FIGHT STARTS. ***');
  }
  L.push('');
  L.push('WHY, IN THE FIGHT\'S OWN WORDS. It blits the body at 112 times bodyScale(), and');
  L.push('bodyScale() is "1/FIELD_ZOOM -- the people ride the same number as the floor".');
  L.push('FIELD_ZOOM is ' + (F ? F.FIELD_ZOOM : '?') + '. So the fighter is a third of a walker BY CONSTRUCTION,');
  L.push('not by accident: the body was tied to the floor\'s zoom so that pulling the floor');
  L.push('back would not leave giants standing on it.');
  L.push('THAT IS THE SAME SHAPE AS THE DEFECT THIS LANE FIXED ON THE STREET LAST ROUND, and');
  L.push('the fix there is the one that applies here: the ground may zoom, THE PERSON MAY NOT.');
  L.push('Hold the body at the ruled size and let the floor move under him.');
  L.push('');
  L.push('THE RULED SIZE IS ONE NUMBER AND THIS LANE OWNS IT: a 112 box, about 100 px of');
  L.push('painted person. That is what every body on the street is drawn at, at every zoom a');
  L.push('pinch can reach, and it is enforced by gates/body_scale_gate.js.');
  L.push('');
  L.push('NOT FIXED HERE, ON PURPOSE. The fight board is COMBAT\'s system and [fight looks] is');
  L.push('its row; ONE SYSTEM, ONE SESSION. What this lane owes is the number and an honest');
  L.push('measurement of the gap. Re-run this tool as the fix lands; when the two lines above');
  L.push('read the same, that half of rule 17 is done.');
  L.push('');
  L.push('HONEST LIMIT: the fight was run on its own to read its own functions, so it had no');
  L.push('baked body in it and the painted number for the fight is DERIVED -- the fight\'s');
  L.push('measured scale times the street\'s measured painted share of the same 112 source.');
  L.push('The BOX numbers are both direct readings.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();
