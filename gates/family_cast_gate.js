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
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(6000);

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
    const cards = document.querySelectorAll('#familyCast .famCard');
    cards.forEach(card => {
      const bd = card.querySelector('.famBody'), sh = card.querySelector('.famShadow');
      const rec = { role: bd ? bd.getAttribute('data-famrole') : '?', body: 0, shadow: 0, bodyLowDark: 0, sig: '' };
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
          const k = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4);
          h[k] = (h[k] || 0) + 1;
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

  /* EVERY MEMBER WEARS LEGS. Measured 8/11: an exposed shin paints the dark
     under-body (31,31,36) instead of skin -- byte-identical to wearing no leg
     garment -- while the same body paints bare ARMS as skin. Until that render
     bug is fixed, a bare-legged cast member is a broken-looking one, so the cast
     is held to clothed legs and this check documents WHY rather than hiding it. */
  const bareLegs = (R.legless || []);
  ok('every cast member wears a LEG garment (' + (bareLegs.length ? 'BARE: ' + bareLegs.join(', ') :
    'none bare') + ') — an exposed shin currently paints the dark under-body, not skin',
    bareLegs.length === 0);

  ok('every garment on every cast member is APPROVED canon (' + R.catalogue + ' canon garments; ' +
    (R.unapproved.length ? 'OFFENDERS: ' + R.unapproved.join(', ') : 'no offenders') + ')',
    R.unapproved.length === 0);

  console.log('FAMILY CAST GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
