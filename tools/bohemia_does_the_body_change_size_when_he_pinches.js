/* DOES THE BODY CHANGE SIZE WHEN HE PINCHES? (9/20/26, CHARACTER lane)
 *
 * RULE 18, THE PLAYABLE CUT (Paolo 9/20, LOCKED): "we were closer to being able to play
 * before, right now we're farther than we've ever been." Only three things ship until the
 * cut holds, and WALKING is one of them: "one walking camera where a house fits, THE BODY
 * ONE FIXED SIZE THAT NEVER CHANGES WHILE HE WALKS OR PINCHES."
 *
 * *** THIS LANE'S OWN MODE LINE SENDS IT HERE: "spend the round measuring your part of
 * loading, walking or the fight (the body wire serves RUN [one camera] and may ship for
 * that alone)." THE BODY IS THIS LANE'S PART OF WALKING. ***
 *
 * AND I HAVE TO MEASURE MY OWN DESIGN AGAINST A RULING THAT POSTDATES IT. On 9/15 I wired
 * the body to GROW when a house fits on the screen -- deliberately, as the readable way to
 * honour rule 16 ("I want people to be larger... each tile is the size of a house"). Rule
 * 18 now says the body may not change size while he pinches. THOSE ARE THE SAME SENTENCE
 * FROM TWO SIDES: mine makes the body grow as the camera pulls back, his says the body must
 * not change. Newest date wins, and he is the one playing it. This measures whether my wire
 * actually fires at the zooms the walk uses, rather than arguing about it.
 *
 * WHAT IT MEASURES, at every zoom the walk can reach (HLEVELS, pinched through the game's
 * own ladder, plus the transition's top end):
 *   the box the draw asks for, the sprite rung it gets, and THE PAINTED HEIGHT ON GLASS --
 *   the last one being the only one he can see.
 * A body that is 104 px at one zoom and 206 px at another is a person who changes size when
 * he pinches, however defensible the reason.
 *
 * RIG CHECK (RIG IS LAW): reads only, and restores HC and HZOOM. REUSE CHECK: cooks nothing.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_does_the_body_change_size_when_he_pinches.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const PORT = process.env.BOHEMIA_PORT || 8231;
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_BODY_CHANGE_SIZE_9_20_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    render();
    const o = { rows: [], HC: HC, HZOOM: HZOOM, mode: MODE,
                levels: (typeof HLEVELS !== 'undefined') ? HLEVELS.slice() : [],
                canvas: [cv.width, cv.height], lot: BODY_SCALE.lotFine };
    /* THE PAINTED HEIGHT, WHICH IS THE ONLY NUMBER HE CAN SEE. The box and the rung are
       bookkeeping; a person is as tall as the pixels that get painted. */
    const painted = (C) => {
      const d = BARK_DREW[0];
      let s = null;
      if (d) { let dir = 'S'; try { dir = pplFace(d.p, d.at); } catch (e) {}
               try { s = ctBody(d.p, dir); } catch (e) {} }
      if (!s) { try { const set = PLAYER_CV['S'] || PLAYER_CV.S; s = set && set.idle; } catch (e) {} }
      if (!s) return null;
      const lad = bodyLadder(C), img = spriteAt(s, bodySpriteC(C));
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g2 = c.getContext('2d', { willReadFrequently: true });
      g2.imageSmoothingEnabled = false; g2.drawImage(img, 0, 0);
      const D = g2.getImageData(0, 0, c.width, c.height).data;
      let y0 = 1e9, y1 = -1;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++)
        if (D[(y * c.width + x) * 4 + 3] >= 128) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return { box: lad, sprite: img.width, painted: +(((y1 - y0 + 1) * lad / c.height).toFixed(1)),
               lotPx: Math.round(BODY_SCALE.lotFine * C) };
    };
    /* EVERY ZOOM THE WALK CAN REACH. HLEVELS is what a pinch snaps to; 48 is the top of the
       transition animation. Asked in HUMAN mode, because that is the only mode this ruling
       is about -- he is walking. */
    const ZOOMS = ((typeof HLEVELS !== 'undefined') ? HLEVELS.slice() : [11, 22, 44, 88]).concat([48]);
    ZOOMS.sort((a, c) => a - c);
    for (const C of ZOOMS) {
      const m = painted(C);
      o.rows.push({ C: C, m: m });
    }
    return o;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const seen = R.rows.filter(r => r.m).map(r => r.m.painted);
  const distinct = Array.from(new Set(seen));
  const L = [];
  L.push('DOES THE BODY CHANGE SIZE WHEN HE PINCHES?  --  CHARACTER lane, 9/20/26');
  L.push('measured on the demo over http, 390x844 at DPR 3, walking, canon seed');
  L.push('');
  L.push('RULE 18 (Paolo 9/20, LOCKED), WALKING: "one walking camera where a house fits, THE');
  L.push('BODY ONE FIXED SIZE THAT NEVER CHANGES WHILE HE WALKS OR PINCHES."');
  L.push('');
  L.push('  his screen        ' + R.canvas[0] + ' x ' + R.canvas[1] + ' px');
  L.push('  walk zoom now     ' + R.HC + '   (a pinch snaps to ' + R.levels.join(', ') + ')');
  L.push('  a lot is          ' + R.lot + ' fine cells');
  L.push('');
  L.push('AT EVERY ZOOM A PINCH CAN REACH');
  L.push('  ' + 'cell px'.padStart(8) + 'lot px'.padStart(8) + 'box'.padStart(6)
    + 'sprite'.padStart(8) + 'PAINTED HEIGHT'.padStart(16));
  for (const r of R.rows) {
    if (!r.m) { L.push('  ' + String(r.C).padStart(8) + '   (nothing drawn)'); continue; }
    L.push('  ' + String(r.C).padStart(8) + String(r.m.lotPx).padStart(8) + String(r.m.box).padStart(6)
      + String(r.m.sprite).padStart(8) + String(r.m.painted).padStart(16));
  }
  L.push('');
  L.push('  DIFFERENT SIZES HE CAN SEE: ' + distinct.length + '  (' + distinct.sort((a, c) => a - c).join(', ') + ' px)');
  L.push('');
  if (distinct.length > 1) {
    L.push('*** THE BODY CHANGES SIZE WHEN HE PINCHES, AND IT IS MY DESIGN THAT DOES IT. ***');
    L.push('On 9/15 I wired the body to GROW when a house fits on the screen, deliberately, as');
    L.push('the readable way to honour rule 16 ("I want people to be larger... each tile is the');
    L.push('size of a house"). Rule 18 says the body may not change size while he pinches.');
    L.push('THOSE ARE THE SAME SENTENCE FROM TWO SIDES and the newest date wins. He is right:');
    L.push('a person who grows when you pinch is not a person, and "farther than we have ever');
    L.push('been" is the sentence that rule was written under.');
    L.push('THE FIX IS SIMPLER THAN WHAT I BUILT: one fixed size at every walk zoom. It still');
    L.push('satisfies rule 16 on its own -- hold the body still in pixels and pull the camera');
    L.push('back, and the person grows AGAINST THE WORLD without a single new pixel, which is');
    L.push('what this lane measured on 9/15 and then failed to build.');
  } else {
    L.push('THE BODY IS ONE FIXED SIZE AT EVERY ZOOM A PINCH CAN REACH. Rule 18 holds.');
  }
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();
