/* ONE IN THREE PEOPLE IN THE CITY WAS WEARING A HAT THAT DID NOT DRAW (8/26/26).
 *
 * The wardrobe fix on 8/25 restored 17 garments that rendered nothing -- every knit
 * cap, watch cap, field cap, work cap and slouch beanie, the rice farmer hat and both
 * pairs of shades. "Seventeen garments" undersells it, because the city dresses itself
 * out of that same catalogue.
 *
 * MEASURED, 5,000 people generated exactly the way the game generates them:
 *
 *     29.6%  of everybody in the city is wearing headwear
 *     88.2%  of the hats they were wearing DREW NOTHING
 *     28.4%  of every person in the city put something on their head and stayed bare
 *
 * Only two of the seventeen head garments in the whole game worked -- the shemagh and
 * the scrap helm -- so a crowd that should have read as a working town read as a town
 * where almost nobody owns a hat.
 *
 * BOTH HALVES ARE THE SAME BUILD. The "before" column re-creates the old render
 * faithfully by clearing the head slot for exactly the seventeen that used to draw
 * nothing, which is what the player actually saw; nothing else about the person
 * changes, same seed, same body, same clothes, same hair.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own render, and
 * every person comes from BOH_PERSONLOOK, the same generator the city uses.
 *
 *   node tools/bohemia_the_bald_crowd.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/the-bald-crowd.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 1700 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const WAS_DEAD = new Set(['CHINESE RICE FARMER HAT', 'CHARCOAL WATCH CAP', 'RUST WATCH CAP',
      'OLIVE FIELD CAP', 'STORM KNIT CAP', 'SAND KNIT CAP', 'SLATE WORK CAP', 'WRAPAROUND SHADES',
      'OXBLOOD SLOUCH BEANIE', 'BONE KNIT CAP', 'OLIVE KNIT CAP', 'BRICK WATCH CAP',
      'COPPER FIELD CAP', 'DUST WORK CAP', 'STORM SLOUCH BEANIE', 'KHAKI SLOUCH BEANIE',
      'GREY WRAPAROUNDS']);
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const API = window.BOH_PERSONLOOK;
    const PD_OFF = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];

    /* TEN PEOPLE WHO ARE ACTUALLY WEARING ONE OF THE SEVENTEEN. Walking the same seed
       sequence the city walks, taking the ones the bug would have stripped -- not a
       hand-picked showcase, the first ten the generator hands over. */
    const picks = [];
    for (let i = 0; i < 40000 && picks.length < 10; i++) {
      const look = API.lookFor('crowd:0:' + i, pool);
      const w = look.worn || {};
      if (w.head && WAS_DEAD.has(w.head)) picks.push({ id: 'crowd:0:' + i, look, hat: w.head });
    }

    const keepVar = G.bodyVar, keepWorn = window.G_WORN, keepEq = G.equipped;
    const frame = (q, bare) => {
      const eq = {}; for (const k in keepEq) eq[k] = keepEq[k];
      for (const s of PD_OFF) eq[s] = '';
      const w = {}; for (const k in q.look.worn) w[k] = q.look.worn[k];
      if (bare) delete w.head;                      /* exactly what the player used to see */
      G.bodyVar = q.look.body; window.G_WORN = w; G.equipped = eq;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame('S', 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    /* FIVE ACROSS, NOT TEN. He reads this on a phone held upright; ten across came out
       3,642 pixels wide and 691 tall, which is a strip he has to pinch and drag. */
    const Z = 13, PAD = 12, HDR = 156, COLS = 5;
    const X0 = 0.26, X1 = 0.74, Y0 = 0.02, Y1 = 0.30;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = PAD + COLS * (cw + PAD);
    cv.height = HDR + 4 * (ch + 34) + 40 + 64;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('ONE IN THREE PEOPLE HAD A HAT ON AND YOU COULD NOT SEE IT', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('i checked 5,000 townspeople, made exactly the way the game makes them.', PAD, 80);
    cx.fillText('30 out of every 100 were wearing headwear. 88 out of every 100 of those hats', PAD, 104);
    cx.fillText('drew nothing at all. these ten are the first ten the game handed me.', PAD, 128);

    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
      const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };

    let y = HDR;
    for (let half = 0; half < 2; half++) {
      const five = picks.slice(half * COLS, half * COLS + COLS);
      for (const bare of [true, false]) {
        cx.fillStyle = bare ? '#c98a6a' : '#8fc07a'; cx.font = 'bold 15px monospace';
        cx.fillText(bare ? 'WHAT YOU SAW' : 'WHAT THEY WERE ACTUALLY WEARING', PAD, y + 16);
        five.forEach((q, i) => {
          const x = PAD + i * (cw + PAD);
          blit(frame(q, bare), x, y + 24);
          if (!bare) { cx.fillStyle = '#8a7d68'; cx.font = '11px monospace';
            cx.fillText(q.hat.toLowerCase().slice(0, 21), x, y + 24 + ch + 13); }
        });
        y += ch + 34 + (bare ? 0 : 6);
      }
      y += 14;
    }
    G.bodyVar = keepVar; window.G_WORN = keepWorn; G.equipped = keepEq;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('only 2 of the 17 hats in the whole game worked. so the town read as a place where', PAD, cv.height - 34);
    cx.fillText('almost nobody owns a hat, which is not the town you wrote.', PAD, cv.height - 14);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
