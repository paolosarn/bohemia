/* THE FACE MAKER GATE (8/28/26) -- he can build a face himself, in a tab, today.
 *
 * Paolo, 8/25 (THE PLAYTEST DISPATCH, item 10): "animations get an audit and FACE
 * CUSTOMISATION, never built, is on the board."
 * HE MUST BE ABLE TO DIRECT IT (8/12, LOCKED): every system he has to make decisions about
 * ships with an INSTRUMENT for making them, IN A TAB, the same turn. The test before
 * shipping anything he must rule on is "WHERE DOES HE CHANGE THIS HIMSELF?" and if the
 * answer is "he tells me and I edit a file", it is not shipped.
 * Law: laws/BOHEMIA_LAW_HE_CAN_BUILD_HIS_OWN_FACE_8_28_26.md
 *
 * *** IT DRIVES THE REAL PANEL. *** It opens the CHARACTER tab, clicks the portrait the way
 * he does, finds the sliders that are actually in the DOM, moves each one, and re-renders
 * the player's face to see whether the pixels moved. A gate that reads the source for the
 * word "slider" would pass on a panel that does nothing (VERIFY ON THE REAL SURFACE, 7/18).
 *
 * AND EACH SLIDER IS TESTED FROM A CLEAN PUNK. The first harness swept them in order
 * without resetting and reported MOUTH HEIGHT dead -- it was not, an earlier slider had
 * already pushed it to the value the test was about to set, through the anatomy clamp.
 * A HARNESS WITH STATE IN IT MEASURES THE STATE. Fourth broken ruler in a week.
 *
 *   node gates/face_maker_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_HE_CAN_BUILD_HIS_OWN_FACE_8_28_26.md');

const SLIDERS_MIN = 12;   /* shape controls in the panel. before this turn: ZERO */

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFaceEditor === 'function', { timeout: 40000 });

  console.log('\nTHE FACE MAKER GATE');

  /* open it the way he does: through the splash, into CHARACTER, tap the portrait */
  await p.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const out = { err: null };
    try {
      const t = document.querySelector('[data-p="char"]'); if (t) t.click();
      out.tab = (document.querySelector('.tab.on') || {}).textContent || '';
      document.getElementById('portraitCv').click();
      const fe = document.getElementById('faceEd');
      out.open = fe.classList.contains('on');
      out.sliders = fe.querySelectorAll('input[type=range]').length;
      out.labels = [...fe.querySelectorAll('input[type=range]')]
        .map(s => (s.parentElement.querySelector('b') || {}).textContent || '?');
      out.cuts = [...fe.querySelectorAll('button')].map(x => x.textContent);

      const shot = () => { const sp = buildSpec(); const buf = renderFace(sp, {});
        let h = 2166136261; for (let i = 0; i < buf.length; i++) h = Math.imul(h ^ buf[i], 16777619) >>> 0;
        return h.toString(16); };

      out.punk = shot();
      const PUNK0 = JSON.stringify(pface);

      /* EVERY SLIDER MOVES PIXELS, each from a clean PUNK, tried at both ends. */
      out.dead = [];
      const n = out.sliders;
      for (let i = 0; i < n; i++) {
        pface = JSON.parse(PUNK0); buildFaceEditor();
        const rs = [...document.getElementById('faceEd').querySelectorAll('input[type=range]')];
        const s = rs[i]; const lab = (s.parentElement.querySelector('b') || {}).textContent || '?';
        const a = shot(); let moved = false;
        for (const v of [s.max, s.min]) {
          s.value = v; s.dispatchEvent(new Event('input'));
          if (shot() !== a) { moved = true; break; }
        }
        if (!moved) out.dead.push(lab);
      }

      /* THE ANATOMY HOLDS. Drive every slider to both ends and assert the head is still a
         head afterwards -- the cheeks widest, the jaw inside them, the chin inside the jaw,
         the features in order down the face. He must not be able to build a skull. */
      pface = JSON.parse(PUNK0); buildFaceEditor();
      const rs2 = [...document.getElementById('faceEd').querySelectorAll('input[type=range]')];
      out.broken = [];
      for (const end of ['max', 'min']) {
        for (const s of rs2) { s.value = s[end]; s.dispatchEvent(new Event('input')); }
        const f = pface.face;
        if (f.cheekW < f.foreheadW + 2) out.broken.push(end + ':cheeks-narrower-than-forehead');
        if (f.jawW > f.cheekW - 1) out.broken.push(end + ':jaw-wider-than-cheeks');
        if (f.chinW > f.jawW - 6) out.broken.push(end + ':chin-wider-than-jaw');
        if (!(f.browY < f.eyeY && f.eyeY < f.noseY && f.noseY < f.mouthY))
          out.broken.push(end + ':features-out-of-order');
        if (f.mouthY > f.top + f.len - 2) out.broken.push(end + ':mouth-past-the-chin');
        /* and it still renders, at every extreme */
        try { renderFace(buildSpec(), {}); } catch (e) { out.broken.push(end + ':THREW ' + e.message); }
      }

      /* THE HAIRCUTS ARE THE BODY'S OWN FIFTEEN, and picking one changes the face. */
      pface = JSON.parse(PUNK0); buildFaceEditor();
      const feb = document.getElementById('faceEd');
      const canon = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
      out.canonN = canon.length;
      const btns = [...feb.querySelectorAll('button')];
      out.cutBtns = canon.filter(g => btns.some(x => x.textContent === g.n.toLowerCase())).length;
      const before = shot();
      const wolf = btns.find(x => x.textContent === 'wolf cut');
      if (wolf) wolf.click();
      out.cutMoved = shot() !== before;

      /* ROLL A FACE produces a different face; BACK TO PUNK restores EXACTLY. */
      pface = JSON.parse(PUNK0); buildFaceEditor();
      const fe2 = document.getElementById('faceEd');
      const roll = [...fe2.querySelectorAll('button')].find(x => x.textContent === 'ROLL A FACE');
      const pre = shot(); if (roll) roll.click();
      out.rollMoved = shot() !== pre;
      const rolledHash = shot();
      let differ = 0;
      for (let i = 0; i < 6; i++) { const rb = [...document.getElementById('faceEd').querySelectorAll('button')]
          .find(x => x.textContent === 'ROLL A FACE'); if (rb) rb.click(); if (shot() !== rolledHash) differ++; }
      out.rollVaries = differ >= 5;
      const rst = [...document.getElementById('faceEd').querySelectorAll('button')]
        .find(x => x.textContent === 'BACK TO PUNK');
      if (rst) rst.click();
      out.reset = shot();

      /* AND IT EXPORTS, because a face he cannot send me is a face he cannot keep. */
      out.hasExport = [...document.getElementById('faceEd').querySelectorAll('button')]
        .some(x => /EXPORT THIS FACE/.test(x.textContent));
      pface = JSON.parse(PUNK0);
    } catch (e) { out.err = String(e); }
    return out;
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  if (r.err) console.log('  harness error: ' + r.err);

  ok('it is in a tab, and the tab is CHARACTER', /CHARACTER/i.test(r.tab || ''), '(' + r.tab + ')');
  ok('tapping the portrait opens it', !!r.open);
  ok('the face has shape controls at all', (r.sliders || 0) >= SLIDERS_MIN,
     '(' + r.sliders + ' sliders; before this turn the editor changed COLOURS ONLY, zero shape)');
  ok('every slider moves the pixels', (r.dead || []).length === 0,
     (r.dead || []).length ? '(dead: ' + r.dead.join(', ') + ')' : '(' + r.sliders + ' of ' + r.sliders + ')');
  ok('he cannot build a head that is not a head', (r.broken || []).length === 0,
     (r.broken || []).length ? '(' + r.broken.join(', ') + ')'
       : '(every slider driven to both ends; anatomy holds and it still renders)');
  ok('the haircuts are the body\'s own fifteen', r.cutBtns === r.canonN,
     '(' + r.cutBtns + ' of ' + r.canonN + ' canon cuts are pickable)');
  ok('and picking one changes his face', !!r.cutMoved);
  ok('ROLL A FACE gives him a different face', !!r.rollMoved);
  ok('and a different one each time', !!r.rollVaries);
  ok('BACK TO PUNK restores the approved face EXACTLY', r.reset === r.punk,
     '(' + r.punk + ' -> ' + r.reset + ')');
  ok('and he can export what he built', !!r.hasExport);

  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 900, '(' + law.length + ' chars)');
  ok('and it names the test it answers', /WHERE DOES HE CHANGE THIS HIMSELF/i.test(law));

  console.log('\nTHE FACE MAKER GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
