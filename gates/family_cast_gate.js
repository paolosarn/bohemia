/* BOHEMIA FAMILY CAST GATE (8/11/26, CHARACTER lane)
 *
 * Paolo, demo-critical: "THE FAMILY CAST: father, mother, brother, sister on the
 * rig, approved wardrobe, shadows separate, fit for the cold open fight."
 *
 * Four claims, and each one is a way the cast could be quietly wrong:
 *
 *   1. ALL FOUR ARE THERE AND THEY RENDER. A cast member that builds but draws
 *      nothing is the failure this catches -- counted in PAINTED PIXELS on the
 *      real canvas, never "the element exists".
 *   2. THEY ARE FOUR DIFFERENT PEOPLE. Same rig, different dials and clothes, so
 *      the sprites must actually differ. Compared as pixel signatures: if two
 *      members ever collapse to the same body the cast is decoration.
 *   3. EVERY GARMENT IS ALREADY APPROVED. Each worn item must exist in the live
 *      catalogue with st === 'canon'. A demo cast wearing unapproved clothes is a
 *      demo of unapproved clothes, and this is the check that stops a later
 *      "just for now" item creeping in.
 *   4. SHADOWS ARE A SEPARATE LAYER (7/26, LOCKED). The shadow canvas must carry
 *      paint and the SPRITE canvas must carry none of it. Measured structurally:
 *      the body canvas is required to have NO semi-transparent dark pixels below
 *      the feet, which is where a contact shadow would land if anyone ever
 *      "simplified" this into one canvas.
 *
 * WHY 4 IS WORTH A GATE RATHER THAN A COMMENT: putImageData REPLACES destination
 * pixels, so the one-canvas version does not fail loudly -- it either erases the
 * shadow or paints it over the body, and both look like a styling opinion rather
 * than a broken law. The two-canvas structure is the only version that survives
 * the renderer, so the structure is what gets asserted.
 *
 *   node gates/family_cast_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 1500);
  await page.click('.tab[data-p="char"]');
  await SETTLE(page, 6000);

  const R = await page.evaluate(() => {
    const out = { members: [], cast: (window.FAMILY_CAST || []).length, catalogue: 0, unapproved: [], legless: [] };
    const canon = new Set();
    (window.GARMENTS || []).forEach(g => { if (g.st === 'canon') canon.add(g.n); });
    out.catalogue = canon.size;
    (window.FAMILY_CAST || []).forEach(m => {
      if (!(m.worn && m.worn.legs)) out.legless.push(m.role);
      Object.keys(m.worn || {}).forEach(slot => {
        if (!canon.has(m.worn[slot])) out.unapproved.push(m.role + '/' + slot + '=' + m.worn[slot]);
      });
    });
    /* THE PLAYER'S OWN CLOTHES, worn under theirs. famPaintBody borrowed G_WORN but
       left G.equipped alone, so every member also wore the PD defaults -- leather
       legwarmers, balenciagas, the cowl hoodie. Measured 8/11 before the fix:
       BROTHER 320 px of the player's hoodie, SISTER 154, FATHER 72, MOTHER 40. */
    const pdBad = new Set();
    ['pants/leather-legwarmer','shoes/balenciaga','shirt/cowl-hoodie','jacket/japanese-fuzz_hoodDown']
      .forEach(k => ((PD.ramps[k]||[]).forEach(c => pdBad.add(c.join(',')))));
    pdBad.delete('28,22,24');   /* the shared dark anatomy entry is in EVERY ramp, skin included */
    out.pdWorn = {};
    const cards = document.querySelectorAll('#familyCast .famCard');
    cards.forEach(card => {
      const bd = card.querySelector('.famBody'), sh = card.querySelector('.famShadow');
      const rec = { role: bd ? bd.getAttribute('data-famrole') : '?', body: 0, shadow: 0, bodyLowDark: 0, sig: '', top: 1e9, bot: -1, pxH: 0, headH: 0, neckY: 0, neckW: 0 };
      if (bd) {
        const d = bd.getContext('2d').getImageData(0, 0, bd.width, bd.height).data;
        const h = {};
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 8) continue;
          rec.body++;
          const y = Math.floor((i / 4) / bd.width);
          /* a contact shadow lands in the bottom rows as SEMI-transparent black.
             The body itself is opaque there (boots), so this is specific. */
          if (y > bd.height - 12 && d[i + 3] < 200 && d[i] < 40 && d[i + 1] < 40 && d[i + 2] < 40) rec.bodyLowDark++;
          const exact = d[i] + ',' + d[i + 1] + ',' + d[i + 2];
          if (pdBad.has(exact)) rec.pd = (rec.pd || 0) + 1;
          const k = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4);
          h[k] = (h[k] || 0) + 1;
          if (d[i + 3] > 40) { if (y < rec.top) rec.top = y; if (y > rec.bot) rec.bot = y; }
        }
        rec.pxH = rec.bot - rec.top + 1;
        /* HEAD HEIGHT VIA THE NECK PINCH, and the first version of this was wrong.
           I measured "widest row in the top quarter", which on the father catches
           his HAIR and his SHOULDERS and reported the child as having the smaller
           head -- the exact inversion of the truth. The head is the narrow blob
           ABOVE the shoulders, so the honest landmark is the narrowest row between
           the crown and the shoulder line. Search from 15% to 45% of the figure:
           starting at the very top would pick the crown itself, which is narrow
           because it is round. FIX THE RULER, NEVER THE TARGET. */
        {
          const a = rec.top + Math.max(2, Math.round(rec.pxH * 0.15));
          const b2 = rec.top + Math.max(4, Math.round(rec.pxH * 0.45));
          let best = 1e9, bestY = a;
          for (let y = a; y <= b2 && y < bd.height; y++) {
            let w = 0;
            for (let x = 0; x < bd.width; x++) if (d[((y * bd.width) + x) * 4 + 3] > 40) w++;
            if (w > 0 && w < best) { best = w; bestY = y; }
          }
          rec.neckY = bestY; rec.neckW = best;
          rec.headH = bestY - rec.top + 1;
        }
        rec.sig = Object.keys(h).sort().map(k => k + '=' + h[k]).join('|');
      }
      if (sh) {
        const s = sh.getContext('2d').getImageData(0, 0, sh.width, sh.height).data;
        for (let i = 3; i < s.length; i += 4) if (s[i] > 4) rec.shadow++;
      }
      out.members.push(rec);
    });
    return out;
  });

  ok('the cast is declared and it is the four canon roles (' + R.cast + ')', R.cast === 4);
  ok('all four cast cards are on the CHARACTER tab (' + R.members.length + ')', R.members.length === 4);

  const roles = R.members.map(m => m.role).join(',');
  ok('the roles are FATHER, MOTHER, BROTHER, SISTER (' + roles + ')',
    ['FATHER', 'MOTHER', 'BROTHER', 'SISTER'].every(r => roles.indexOf(r) >= 0));

  for (const m of R.members) {
    ok(m.role + ': the body actually renders (' + m.body + ' painted pixels) — an element that ' +
      'exists but draws nothing is the failure this counts', m.body > 400);
    ok(m.role + ': its SHADOW layer carries paint (' + m.shadow + ' px)', m.shadow > 100);
    ok(m.role + ': NO shadow in the sprite canvas (' + m.bodyLowDark + ' stray semi-transparent dark ' +
      'pixels under the feet) — SHADOWS ARE A SEPARATE LAYER, 7/26 LOCKED', m.bodyLowDark === 0);
  }

  /* four people, not one person four times */
  const sigs = R.members.map(m => m.sig);
  const uniq = new Set(sigs);
  ok('the four are FOUR DIFFERENT PEOPLE, not one rig four times (' + uniq.size + ' distinct sprites)',
    uniq.size === R.members.length);

  /* SHE WEARS HER OWN CLOTHES AND NOTHING ELSE (8/11).
     This used to assert that every member wore a LEG garment, as a workaround for a
     reported "a bare shin paints the dark under-body 31,31,36 instead of skin" bug.
     THERE WAS NO SUCH BUG. Strip BOTH wardrobes and the legs render 175/175 skin and
     the arms 85/85 -- the renderer was innocent. What was actually happening: 31,31,36
     and 20,20,25 are entries of the pants/leather-legwarmer ramp, and famPaintBody
     borrowed G_WORN but left G.equipped alone, so every cast member wore THE PLAYER'S
     PD DEFAULTS under her own outfit. The shin was correctly painting a garment nobody
     realised was still on.
     So the workaround is gone -- a bare-legged cast member is legal now, a kid in
     shorts is legal now -- and the REAL invariant is asserted in its place. */
  for (const m of R.members)
    ok(m.role + ": wears HER OWN clothes and nothing else (" + (m.pd || 0) + " pixels of the " +
       "PLAYER'S default PD garments). Before this was fixed: BROTHER 320, SISTER 154, " +
       "FATHER 72, MOTHER 40 -- the cast was wearing the player's hoodie and legwarmers " +
       "underneath their canon outfits", !m.pd);

  /* ===== PAOLO 8/11: "we have to assign the different heights in the different
     body sizing ... are we even able to make character a kid child characters".
     My first cast was four of the same man, because BODYVAR is width dials plus a
     2px height nudge and nothing in it touches the head. These are the assertions
     that would have caught it, so it cannot come back. */
  const H = {};
  R.members.forEach(m => { H[m.role] = m; });
  const heights = R.members.map(m => m.pxH);
  const spread = Math.max.apply(null, heights) - Math.min.apply(null, heights);
  ok('the four are FOUR DIFFERENT HEIGHTS (' + R.members.map(m => m.role + ' ' + m.pxH).join(', ') + ')',
    new Set(heights).size === 4);
  ok('the height spread is real, not a 2px dial nudge (' + spread + 'px) — BODYVAR height is ' +
    'only +-5%, so a spread this size can ONLY come from the age axis', spread >= 14);
  ok('the FATHER is the tallest and the CHILD is the shortest (' +
    (H.FATHER ? H.FATHER.pxH : '?') + ' vs ' + (H.SISTER ? H.SISTER.pxH : '?') + ')',
    !!(H.FATHER && H.SISTER) && H.FATHER.pxH === Math.max.apply(null, heights) &&
    H.SISTER.pxH === Math.min.apply(null, heights));
  ok('the BROTHER (teen) sits BETWEEN the child and the adults (' + (H.BROTHER ? H.BROTHER.pxH : '?') + ')',
    !!(H.BROTHER && H.SISTER && H.FATHER) && H.BROTHER.pxH > H.SISTER.pxH && H.BROTHER.pxH < H.FATHER.pxH);
  /* THE ACTUAL CHILD TEST. Not height -- head-to-body ratio, which is the thing
     that makes a child read as a child rather than as a small adult. */
  {
    const ratio = m => (m && m.pxH) ? m.headH / m.pxH : 0;
    const row = R.members.map(m => m.role + ' ' + ratio(m).toFixed(3)).join(', ');
    const adults = R.members.filter(m => m.role === 'FATHER' || m.role === 'MOTHER').map(ratio);
    const kid = ratio(H.SISTER);
    /* DIRECTION, NOT A TUNED MARGIN. The head-fraction should rise by ~1.29x on
       the arithmetic (4.89 heads adult -> 3.79 child), and it measures ~1.11x --
       because the CROWN is hair, not skull, and the four wear different hair, so
       the measured "top" carries a garment. Rather than tune a threshold until it
       passes, this asserts the thing that cannot be faked and is what the law
       actually needs: THE CHILD'S HEAD FRACTION IS LARGER THAN BOTH ADULTS'. If
       the age axis is ever removed the child collapses to a small adult and this
       inverts immediately. The residual gap between 1.29 and 1.11 is hair, and it
       is written down here rather than hidden in a constant. */
    ok('head-to-body ratio rises toward the CHILD (' + row + ') — a small adult is ' +
      'not a child, and this ratio is the whole difference',
      kid > 0 && adults.length === 2 && adults.every(a => kid > a));
  }

  ok('every garment on every cast member is APPROVED canon (' + R.catalogue + ' canon garments; ' +
    (R.unapproved.length ? 'OFFENDERS: ' + R.unapproved.join(', ') : 'no offenders') + ')',
    R.unapproved.length === 0);

  console.log('FAMILY CAST GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
