/* ============================================================================
   THE BAR FITS HIS GLASS  (UI lane 11, 9/22) -- rows [phone is the button] and
   [notes on screen], one push.
   *** PAOLO 9/22: "How do I access the notes to make notes as I'm playing the
   demo?" and "There shouldn't be a phone button in the top right. I should click
   the phone and then it opens the phone. The phone is the phone button." ***
   records/BOHEMIA_PAOLO_CITY_MODE_9_22_26.md, his frame
   records/target/PAOLO_CITY_MODE_9_22_26.png: the bar reads "T SAVE PHONE" and
   then the edge of the glass, with NOTES past it.

   *** WHY MY OWN GATE PASSED THAT BAR, WHICH IS THE POINT OF THIS FILE. ***
   the_notes_section_gate.js had a leg called "it is on screen" and it asked

       r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth

   `r.left < innerWidth` IS TRUE FOR A CONTROL HANGING OFF THE RIGHT. A chip whose
   left edge is at 380 and whose right edge is at 424 passes that check on a 390
   px phone. The ruler was satisfied by exactly the thing he was complaining about.
   FOURTH TIME IN THIS LANE that a checker agreed with itself and disagreed with
   his phone, so the question is rewritten once, here, in the only form that
   means anything: IS THE WHOLE CONTROL INSIDE THE GLASS.

   *** AND WHAT THIS GATE HONESTLY CANNOT DO. *** It cannot reproduce his overflow.
   iOS Safari inflates type when -webkit-text-size-adjust is unset (it was unset in
   every file in this game, measured: zero hits) and headless Chromium never does,
   which is why three probes of mine measured a bar that fit while his photograph
   showed one cut off. I could not build a control either: the demo cut REFERENCES
   the city file rather than inlining it, so serving an old cut still serves the
   current city and there is no "before" to fail against. SO THIS GATE DOES NOT
   CLAIM A REPRODUCTION. It applies the pressure instead and holds a PROPERTY: with
   his exact words in the bar, the glass narrowed to 320, and the type forced 30%
   bigger, the control is still whole. That property is carried by one line --
   #barright is flex:0 0 auto, so the right-hand group cannot shrink or wrap and
   the pressure goes into the readouts, which are allowed to lose letters and
   already do. A readout losing a word is a nuisance; a CONTROL off the glass does
   not exist.

   Run: node gates/the_bar_fits_his_glass_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = (d) => {
  console.log('\nTHE BAR FITS HIS GLASS: ' + pass + ' ok, ' + fail + ' failed');
  if (d) d.close().catch(() => {});
  process.exit(fail ? 1 : 0);
};

(async () => {
  console.log('\nTHE BAR FITS HIS GLASS  ([phone is the button] + [notes on screen])\n');

  /* ---- the two source facts that carry the property ---- */
  ok('the right-hand group cannot shrink or wrap',
     /#barright\{display:flex;align-items:center;gap:5px;flex:0 0 auto/.test(CITY));
  ok('the readouts are the ones allowed to lose letters',
     /#musbtn\{min-width:0;overflow:hidden;text-overflow:ellipsis/.test(CITY));
  ok('the type cannot be inflated by the one browser he uses',
     /-webkit-text-size-adjust:100%/.test(CITY));

  const cut = path.join(os.tmpdir(), 'BOHEMIA_BARFIT_CUT.html');
  require('child_process').execFileSync(process.execPath,
    [path.join(ROOT, 'tools/bohemia_cut_the_demo.js'), '--out', cut], { stdio: 'pipe' });
  const d = await open({ serve: { 'BOHEMIA_DEMO.html': cut }, file: 'BOHEMIA_DEMO.html' });

  /* ---- his ask: the chip is gone and the drawn phone is the handle ----
     HIS FRAME IS CITY MODE AND THE DRAWN PHONE ONLY EXISTS THERE. The first cut of
     this gate measured it on the walking screen, where it is 0x0, and the tap test
     PASSED ANYWAY because a click dispatched at an invisible element still fires its
     handler. A leg that cannot see its subject is not a leg. Cross the seam the way a
     thumb does, one squeeze, and then look. */
  await d.pinchOut();
  await d.page.waitForTimeout(600);
  ok('the squeeze really reached the screen in his photograph',
     (await d.fr.evaluate(() => (typeof MODE !== 'undefined' ? MODE : '?'))) === 'city');
  const phone = await d.fr.evaluate(() => {
    const feed = document.getElementById('cityfeed');
    return { chip: !!document.getElementById('phonebtn'),
             feed: !!feed,
             role: feed ? feed.getAttribute('role') : null,
             label: feed ? feed.getAttribute('aria-label') : null,
             big: feed ? (() => { const b = feed.getBoundingClientRect();
               return Math.round(b.width) + 'x' + Math.round(b.height); })() : null };
  });
  ok('the PHONE chip is gone from the top right', !phone.chip);
  ok('the drawn phone is still there', phone.feed, phone.big);
  ok('  and it is the handle now', phone.role === 'button', String(phone.role));
  ok('  and it says what it opens', /phone/i.test(phone.label || ''), String(phone.label));
  /* a whole panel is many times a thumb; measure it rather than assume */
  const wh = (phone.big || '0x0').split('x').map(Number);
  ok('  and it is far bigger than a thumb', wh[0] >= 44 && wh[1] >= 44, phone.big);

  const state = () => d.fr.evaluate(() => (typeof PHONE_ON !== 'undefined' ? !!PHONE_ON : null));
  const tapFeed = () => d.fr.evaluate(() => {
    const f = document.getElementById('cityfeed'), b = f.getBoundingClientRect();
    f.dispatchEvent(new MouseEvent('click', { bubbles: true,
      clientX: b.x + b.width / 2, clientY: b.y + b.height / 2 }));
  });
  ok('the phone starts folded', (await state()) === false);
  await tapFeed(); await d.page.waitForTimeout(300);
  ok('tapping the drawn phone opens it', (await state()) === true);
  await tapFeed(); await d.page.waitForTimeout(300);
  ok('  and tapping it again folds it', (await state()) === false);

  /* ---- THE PROPERTY, UNDER PRESSURE ---- */
  const look = async (vw, infl, words) => {
    await d.page.setViewportSize({ width: vw, height: 812 });
    await d.fr.evaluate(({ infl, words }) => {
      const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
      if (words) { set('hmode', 'CITY MODE'); set('hslot', 'FREEWAY');
                   set('hclock', 'DAY 2 · 20:15 NIGHT'); set('musbtn', 'CAMPFIRE CONFESSION'); }
      const old = document.getElementById('__stress'); if (old) old.remove();
      if (infl) { const st = document.createElement('style'); st.id = '__stress';
        st.textContent = '#menubar,#menubar *{font-size:' + (5 * infl).toFixed(2) + 'px!important}';
        document.head.appendChild(st); }
    }, { infl, words });
    await d.page.waitForTimeout(320);
    return d.fr.evaluate(() => {
      const n = document.getElementById('notebtn');
      const b = n ? n.getBoundingClientRect() : null;
      const m = document.getElementById('musbtn');
      return { whole: !!(b && b.left >= -0.5 && b.right <= innerWidth + 0.5),
               at: b ? Math.round(b.left) + '..' + Math.round(b.right) : 'ABSENT',
               vw: innerWidth,
               ink: m ? parseFloat(getComputedStyle(m).fontSize) : 0 };
    });
  };

  const plain = await look(390, 0, false);
  ok('NOTES is WHOLLY on the glass at 390 (not merely "on screen")',
     plain.whole, plain.at + ' of ' + plain.vw);
  const his = await look(375, 0, true);
  ok('  with his exact words in the bar, at 375', his.whole, his.at + ' of ' + his.vw);
  const infl = await look(375, 1.30, true);
  /* PROVE THE STRESS BIT. My first cut of this set the font-size on #menubar and
     .uihalf's `font-size:5px!important` beat it, so every "inflated" run came back
     byte-identical and looked like a pass. A stress that cannot move the pixels is
     not a stress, and this gate refuses to score it. */
  ok('the inflation stress really changed the type', infl.ink > plain.ink + 0.4,
     plain.ink + 'px -> ' + infl.ink + 'px');
  ok('  and NOTES is still whole with the type 30% bigger', infl.whole, infl.at + ' of ' + infl.vw);
  const tiny = await look(320, 1.15, true);
  ok('  and still whole at 320, the narrowest phone anybody holds',
     tiny.whole, tiny.at + ' of ' + tiny.vw);

  /* two runs of this gate at once share one temp path, and the first to finish deletes
     it under the second, which then dies on unlink with every leg already green.
     A gate that crashes while passing is a gate that reports a failure it did not find. */
  try { fs.unlinkSync(cut); } catch (e) {}
  done(d);
})().catch(e => { console.error(String(e && e.stack || e)); process.exit(1); });
