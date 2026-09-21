/* CHARACTER INTO THE VOTE TAB (9/18/26, CHARACTER lane, VAMILY [into the vote tab])
 *
 * RULE 15, ONE VOTE TAB (Paolo 9/14, LOCKED): "We need one central tab in the fucking demo
 * where everything from sounds to portrait to hair to everything that is new, where I vote
 * on it... after I vote on something it needs to stop presenting itself."
 *
 * RULE 12 FIRST, AND THE PREMISE HELD: the row says "once UI [vote tab] lands". Measured
 * before building anything -- the tab is live, records/target/BOHEMIA_VOTE_REGISTRY.json
 * holds 13 items from ui, words and direction, and CHARACTER has ZERO in it. So the row is
 * not blocked, it is simply undone.
 *
 * WHAT THIS LANE PUTS IN, AND WHY IT IS THREE AND NOT THIRTY. STOP PRODUCING (7/26) names
 * surfacing a pile unasked as the failure. A vote CONSUMES an item, so a queue is fine, but
 * the tab is the only place he judges anything and thirty rows from one lane buries every
 * other lane's work. These are the three questions where his answer changes what this lane
 * builds next, and each one is about the thing he keeps noticing himself -- the people:
 *
 *   1. THE TWELVE PEOPLE ON YOUR STREET. He walks past twelve baked bodies. He has never
 *      been shown them together at the size he actually sees them. His answer decides
 *      whether the next cook is more of these shapes or different ones.
 *   2. EVERYBODY IS A DIFFERENT COLOUR NOW. The crowd used to repeat somebody every other
 *      person; now each one gets their own skin, cloth and hair off their id. Real fork: it
 *      reads as a crowd, or it reads as a rainbow. Shown as the SAME street, before and
 *      after, on the real surface.
 *   3. CAN YOU TELL THE THIRTEEN APART? COLOUR IS TERRITORY says a faction's colour states
 *      who would defend you. This is that law with his eyes on it instead of a number, and
 *      it is the honest resurrection of [look verdict], the row that decided itself dead
 *      because "he does not thumb" -- through the mechanism he then asked for.
 *
 * EVERY PICTURE IS THE REAL SURFACE, NOT A MOCKUP. The twelve and the thirteen are rendered
 * by the game's own buildFrame off the game's own tables; the crowd is two screenshots of
 * the walked city, same spot, same seed, same frame, ramps off and on.
 *
 * RIG CHECK (RIG IS LAW): reads only; restores G_WORN, G.equipped, the dials and the caches.
 * REUSE CHECK: cooks no new art. Every pixel here is a body the game already draws.
 *
 *   node tools/bohemia_character_into_the_vote_tab.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PORT = process.env.BOHEMIA_PORT || 8231;

const png = (name, dataUrl) => {
  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, name);
  fs.writeFileSync(f, Buffer.from(dataUrl.split(',')[1], 'base64'));
  const kb = (fs.statSync(f).size / 1024).toFixed(0);
  console.log('  wrote slices/vote/' + name + '  ' + kb + ' KB');
  return f;
};

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });

  /* ===== 1 and 3, off the alpha: the twelve, and the thirteen ===================== */
  const p = await b.newPage({ viewport: { width: 900, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && window.CITY_CAST_LOOKS && window.FACTION_LOOKS, { timeout: 90000 });

  const sheets = await p.evaluate(() => {
    const keepW = window.G_WORN, keepE = G.equipped, keepD = JSON.stringify(G.bodyVar || {});
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    /* ONE BODY, DRAWN THE WAY THE STREET DRAWS IT. buildFrame returns {px, CW, CH}; the
       width is READ off the frame and never defaulted, which is the ruler this lane broke
       on 9/15 by assuming 56 on a frame that is 112. */
    /* *** CORRECTED 9/21: THE DIALS NEVER APPLIED, AND THESE PICTURES ARE ALREADY IN VOTE. ***
       This wrote `G.dials[k] = ...` inside a try/catch. THERE IS NO G.dials -- body variation
       lives in G.bodyVar and needs the rig rebuilt. The catch swallowed the TypeError, so
       BOTH SHEETS HE IS BEING ASKED TO JUDGE rendered every body at DEFAULT proportions:
       twelve cast looks that are supposed to differ in build, and thirteen factions whose
       shape line is half their identity, all drawn as the same man in different clothes.
       A PICTURE THAT DOES NOT SHOW WHAT THE GAME DRAWS IS A LIE IN THE ONE PLACE HE JUDGES
       THINGS, and a thumb on it would have been a thumb on something that does not exist.
       Found the same way the other one was: the same silent catch, in a tool I wrote three
       rounds earlier and never re-read. A SILENT CATCH AROUND A WRITE TURNS "THIS DOES
       NOTHING" INTO "THIS WORKED" -- and it does it quietly enough to survive a round of
       looking at the output, because default proportions still look like people.
       The real path is the one the game uses on its own cast (famPaintBody). */
    const draw = (worn, dials) => {
      const eq = bare();
      G.equipped = eq; window.G_WORN = worn || {};
      G.bodyVar = dials || {};
      rebuildFromRig();
      clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { return null; }
      const W = fr.CW, H = fr.CH;
      if (!W || !H) return null;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
      }
      g2.putImageData(im, 0, 0);
      return c;
    };
    /* A CONTACT SHEET, on the valley's own ground colour rather than white: a body judged
       against white is a body he has never seen. */
    const sheet = (rows, cols, cells, title) => {
      const CELL = 178, PAD = 10, LABEL = 42;
      const c = document.createElement('canvas');
      c.width = cols * CELL + PAD * 2;
      c.height = rows * (CELL + LABEL) + PAD * 2 + 34;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      g2.fillStyle = '#b9a373'; g2.fillRect(0, 0, c.width, c.height);
      g2.fillStyle = '#3a2f1c';
      g2.font = 'bold 18px ui-monospace, monospace'; g2.textBaseline = 'top';
      g2.fillText(title, PAD, PAD);
      cells.forEach((cell, i) => {
        const cx = PAD + (i % cols) * CELL, cy = PAD + 34 + Math.floor(i / cols) * (CELL + LABEL);
        if (cell.cv) {
          const s = Math.min(CELL / cell.cv.width, CELL / cell.cv.height);
          const w = Math.round(cell.cv.width * s), h = Math.round(cell.cv.height * s);
          g2.drawImage(cell.cv, cx + (CELL - w) / 2, cy, w, h);
        }
        /* THE LABEL WRAPS INSIDE ITS OWN CELL. A flat slice(0,26) is wider than the cell at
           12px mono, so neighbouring captions ran into each other and read as one sentence
           ("a bulk on the back nobodysmallest"). Caught by looking at the sheet. */
        g2.fillStyle = '#3a2f1c'; g2.font = '11px ui-monospace, monospace';
        const CH_W = 6.6, MAX = Math.max(8, Math.floor((CELL - 8) / CH_W));
        let line = '', ln = 0;
        for (const w2 of String(cell.label).split(' ')) {
          if (line && (line + ' ' + w2).length > MAX) {
            g2.fillText(line, cx + 2, cy + CELL + 4 + ln * 12); line = w2; ln++;
            if (ln > 2) break;
          } else line = line ? line + ' ' + w2 : w2;
        }
        if (line && ln <= 2) g2.fillText(line.slice(0, MAX), cx + 2, cy + CELL + 4 + ln * 12);
      });
      return c.toDataURL('image/png');
    };

    /* 1. THE TWELVE. The cast table is the game's, read not retyped. */
    const looks = window.CITY_CAST_LOOKS || [];
    /* LABELLED BY WHAT THE SHAPE IS, NOT BY MY FILE NAME. The cast ids are internal and
       four of them are STALE: 'apron', 'poncho', 'bedroll' and 'shortcoat' were re-aimed at
       a WIDTH PROFILE on 9/14 when the first cut failed the silhouette gate, so the id now
       names a garment the body is not wearing. Showing him 'apron' over a plain coat is the
       same defect as [names lie], one screen further out. The table's own `why` says what
       the shape actually is, so that is what goes under the picture. */
    const twelve = looks.map(L => ({
      label: String(L.why || L.id).split('--')[0].split(',')[0].trim(),
      cv: draw(L.worn, L.dials) }));
    const o = {};
    o.twelveN = twelve.length;
    o.twelve = sheet(Math.ceil(twelve.length / 4), 4, twelve,
      'THE ' + twelve.length + ' PEOPLE ON YOUR STREET');

    /* 3. THE THIRTEEN. Their garments live under `worn` -- one level down, which the shape
       gate learned the hard way when it froze thirteen copies of a naked man. */
    const FL = window.FACTION_LOOKS || [];
    const thirteen = FL.map(f => ({ label: f.faction, cv: draw(f.worn || f, f.dials) }));
    o.thirteenN = thirteen.length;
    o.thirteen = sheet(Math.ceil(thirteen.length / 5), 5, thirteen,
      'THE ' + thirteen.length + ' FACTIONS, SIDE BY SIDE');

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); rebuildFromRig(); clear();
    return o;
  });
  await p.close();
  if (errs.length) console.log('  alpha page errors: ' + errs.slice(0, 2).join(' | '));
  png('CHARACTER_THE_TWELVE_PEOPLE.png', sheets.twelve);
  png('CHARACTER_THE_THIRTEEN_FACTIONS.png', sheets.thirteen);

  /* ===== 2, off the walked city: the same street, ramps off and on ================= */
  const p2 = await b.newPage({ viewport: { width: 390, height: 844 },
                               deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p2.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p2.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  let crowd = null;
  if (!fr) console.log('  NO CITY FRAME -- the crowd picture is skipped and NOT faked');
  else {
    crowd = await fr.evaluate(async () => {
      /* STAND WHERE THE PEOPLE ARE. The spawn suburb is one person per screen, measured
         9/15; a question about a CROWD needs a crowd. */
      const NB = BohemiaPopulation.NB, span = NB * FN;
      const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
      let best = null;
      for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
      for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
        let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
        if (ppl.length && (!best || ppl.length > best.n)) best = { n: ppl.length, ppl: ppl };
      }
      if (best) {
        const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
        if (pts.length) {
          const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
          hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
        }
      }
      const cv2 = document.querySelector('canvas');
      const settle = async () => { for (let i = 0; i < 60; i++) { render(); await new Promise(r => setTimeout(r, 16)); } };
      /* AFTER: the ramps as they ship. */
      await settle();
      const after = cv2.toDataURL('image/png');
      /* BEFORE: the same street with every ramp at 1.00, which is exactly what shipped
         before this lane touched it. The cache is cleared so nothing carries over. */
      const keep = { s: CT_RAMP.skin.slice(), c: CT_RAMP.cloth.slice(), h: CT_RAMP.hair.slice() };
      CT_RAMP.skin = [1, 1, 1, 1, 1]; CT_RAMP.cloth = [1, 1, 1, 1, 1]; CT_RAMP.hair = [1, 1, 1, 1, 1];
      CT_RAMP_CV.clear();
      await settle();
      const before = cv2.toDataURL('image/png');
      CT_RAMP.skin = keep.s; CT_RAMP.cloth = keep.c; CT_RAMP.hair = keep.h;
      CT_RAMP_CV.clear(); render();
      return { before: before, after: after, drew: BARK_DREW.length };
    });
  }
  if (crowd) {
    /* ONE PICTURE, SIDE BY SIDE, so he is not asked to remember the left one. */
    const joined = await p.isClosed && null;
    const p3 = await b.newPage({ viewport: { width: 1000, height: 900 } });
    await p3.setContent('<canvas id="c"></canvas>');
    const sideBySide = await p3.evaluate(async (d) => {
      const load = (u) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = u; });
      const A = await load(d.before), B = await load(d.after);
      const PAD = 12, LAB = 30;
      const c = document.getElementById('c');
      c.width = A.width + B.width + PAD * 3; c.height = Math.max(A.height, B.height) + PAD * 2 + LAB + 34;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#b9a373'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#3a2f1c'; g.font = 'bold 20px ui-monospace, monospace'; g.textBaseline = 'top';
      g.fillText('THE SAME STREET, BEFORE AND AFTER', PAD, PAD);
      g.drawImage(A, PAD, PAD + 34); g.drawImage(B, PAD * 2 + A.width, PAD + 34);
      g.font = 'bold 16px ui-monospace, monospace';
      g.fillText('BEFORE', PAD, PAD + 34 + A.height + 6);
      g.fillText('AFTER', PAD * 2 + A.width, PAD + 34 + B.height + 6);
      return c.toDataURL('image/png');
    }, crowd);
    await p3.close();
    png('CHARACTER_THE_CROWD_BEFORE_AND_AFTER.png', sideBySide);
    console.log('  the crowd picture is ' + crowd.drew + ' bodies on one phone screen');
  }
  await b.close();
  console.log('\nNOW REGISTER THEM: append to records/target/BOHEMIA_VOTE_REGISTRY.json');
})();
