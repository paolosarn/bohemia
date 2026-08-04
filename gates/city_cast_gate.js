/* BOHEMIA — THE PEOPLE ARE NOT COPIES OF HIM (8/3/26, PEOPLE lane).

   Paolo, 8/3: "now we have character models just shuffle that character model
   every time the game looks and have it not be a copy of me"

   HE WAS DESCRIBING THE CODE EXACTLY. The city frame drew every resident as
   PLAYER_CV -- his own baked body -- through pplTinted(), a colour shift over
   his finished sprite. Same rig, same clothes, different hue. Six weeks of
   wardrobe and everyone in the valley was him.

   The alpha had already been baking six real townsfolk for the run since 7/26
   (runSendCast: swap the tints and the hat, re-bake the rig). The city just
   never received them.

   THE CLAIM THAT MATTERS IS THE LAST ONE. "There is a cast" would pass on six
   copies of him; "a message was sent" would pass on a message that arrived
   empty. So this HASHES THE ACTUAL PIXELS of each baked body and of the
   player's, and requires that every body is distinct AND that not one of them
   is his.

   NOTE FOR WHOEVER READS THIS NEXT: PLAYER_CV and CAST_CV are `let` at the top
   of the frame's script, so they are global LEXICAL bindings and not properties
   of window. The first version of this measurement read window.PLAYER_CV, got
   undefined, and "none of them is the player" passed by comparing against null -
   a check that could not fail. Bare identifiers, always.

   Run: node gates/city_cast_gate.js
   Registered in gates/bohemia_gates.py as CITY CAST. */
'use strict';
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0; const fail = [];
const ok = (n, c) => { c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async () => {
  console.log('CITY CAST GATE — the people wear their own clothes, not his');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
    await page.goto('file://' + ALPHA);
    await page.waitForSelector('#front', { timeout: 40000 });
    await page.click('#front');
    await page.waitForTimeout(1200);
    await page.click('.tab[data-p="run"]');
    await page.waitForTimeout(22000);

    const fr = await page.$('#cityFrame');
    ok('B1 the RUN tab shows the city frame', !!fr);
    if (!fr) return;
    const cf = await fr.contentFrame();

    const m = await cf.evaluate(() => {
      /* hash the real pixels of a baked body */
      const hash = (c) => { if (!c) return null;
        const x = c.getContext('2d');
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let h = 0;
        for (let i = 0; i < d.length; i += 4)
          h = (Math.imul(h, 31) + d[i] + d[i + 1] * 3 + d[i + 2] * 7 + d[i + 3] * 11) | 0;
        return h; };
      /* BARE identifiers: these are `let` at script top level, so they are
         lexical globals and NOT on window (see the header). */
      const cast = (typeof CAST_CV !== 'undefined' && CAST_CV) || null;
      const me = (typeof PLAYER_CV !== 'undefined' && PLAYER_CV && PLAYER_CV.S)
        ? hash(PLAYER_CV.S.idle) : null;
      const bodies = (cast || []).map(s => hash(s.S && s.S.idle));
      const NB = BohemiaPopulation.NB, FN = window.__proof.FN, span = NB * FN;
      const P = window.__proof.getPos();
      const list = pplPeople(Math.floor(P.hx / span), Math.floor(P.hy / span));
      const nb = list.filter(q => q.__ctPinned)[0];
      return { n: cast ? cast.length : 0, me: me, bodies: bodies,
               distinct: new Set(bodies.filter(x => x !== null)).size,
               sameAsHim: me === null ? -1 : bodies.filter(x => x === me).length,
               nbBody: nb ? hash(ctBody(nb, 'S')) : null,
               drawn: window.__PPL_DRAWN, looks: list.map(q => q.look) };
    });

    ok('B2 the cast really reached the city frame (' + m.n + ' bodies)', m.n >= 4);
    ok('B3 the player\'s own body was measurable — if this is null the ' +
      '"not a copy of him" check below is vacuous', m.me !== null);
    ok('B4 every body in the cast is a DIFFERENT body (' + m.distinct + ' of ' +
      m.n + ' distinct)', m.n > 0 && m.distinct === m.n);
    ok('B5 NOT ONE OF THEM IS A COPY OF HIM (' + m.sameAsHim + ' matches his pixels)',
      m.sameAsHim === 0);
    ok('B6 the neighbour is wearing one of them, not his body',
      m.nbBody !== null && m.nbBody !== m.me && m.bodies.indexOf(m.nbBody) >= 0);
    ok('B7 and bodies are still actually painted (' + m.drawn + ') — nobody ' +
      'vanished waiting for the bake', m.drawn >= 1);
    ok('B8 nothing threw' + (errs.length ? ': ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }

  console.log((fail.length ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' +
    fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
