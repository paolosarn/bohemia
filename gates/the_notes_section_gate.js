/* ============================================================================
   THE NOTES SECTION  (UI lane 11, 9/21) -- row [copy notes].
   *** PAOLO 9/21: "I still don't see a note section anywhere. A collapsible note
   section that I can copy and paste when I am done playing the demo into you." ***
   records/BOHEMIA_PAOLO_CARDS_STILL_POP_AND_NO_NOTES_9_21_26.md
   Rule 18(f): his direct ask, tiny, touches none of the three, so it ships.

   THIS REPLACES gates/the_notes_button_gate.js's FINDABILITY LEG and keeps that gate
   for the pause and the stamp. It exists because that gate was GREEN on 9/20 about a
   control he could not find, which means it was measuring the wrong thing: it checked
   the mark against a number this lane picked (5 px of ink) instead of against the only
   thing that decides findability, WHICH IS ITS NEIGHBOURS.

   WHAT THE MEASUREMENT ACTUALLY SAID, on a fresh cut of the demo:
     #musbtn    MUSIC   83.8 x 12.3   plate yes   ink rgb(216,196,154)
     #savebtn   SAVE    23.6 x 12.3   plate yes   ink rgb(216,196,154)
     #phonebtn  PHONE   27.0 x 12.3   plate yes   ink rgb(25,19,8) on gold
     #notebtn   (pencil) 44 x 44      plate NO    ink rgb(184,154,106)
   It was the only child of that bar with no body and the only one that was not a word,
   and it was dimmer than everything beside it. A control with no body does not read as
   a control. That is this lane's own object law, broken by this lane's own hand.

   SO EVERY LEG BELOW COMPARES IT TO ITS NEIGHBOURS OR TO HIS SENTENCE, never to a
   number I chose:
     1. it says a WORD, and the word is NOTES
     2. it has a plate, like every other chip in that bar
     3. its ink is no dimmer than its neighbours'
     4. its reach is a real thumb AND it covers none of them (this file measured that a
        44 pad on a chip lies across its neighbour and makes a tap do the wrong thing)
     5. it is at the right-hand end, where he said it is
     6. it TOGGLES: tap opens, tap again collapses, and the chip is still in the bar
     6b. it is still there AFTER CROSSING THE SEAM into the city screen, because the
        row says "on every screen of the demo" and reading the file is not proof
     7. COPY ALL puts the session on the clipboard, and the clipboard is READ BACK
     8. copying saves what is in the box first, because that is the order he does it in
     9. the note still carries where he was standing

   Run: node gates/the_notes_section_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const os   = require('os');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = (d) => {
  console.log('\nTHE NOTES SECTION: ' + pass + ' ok, ' + fail + ' failed');
  if (d) d.close().catch(() => {});
  process.exit(fail ? 1 : 0);
};

(async () => {
  /* HIS DEMO, NOT THE COMMITTED FILE. The deploy cuts the demo from the alpha on every
     push (rule 14a, amended 9/15), so the committed copy lags and testing it would be
     testing something nobody plays. Cut a fresh one into a throwaway path and serve it. */
  const cut = path.join(os.tmpdir(), 'BOHEMIA_NOTES_GATE_CUT.html');
  require('child_process').execFileSync(process.execPath,
    [path.join(ROOT, 'tools/bohemia_cut_the_demo.js'), '--out', cut], { stdio: 'pipe' });
  ok('a fresh cut of the demo was made', fs.existsSync(cut));

  const d = await open({ serve: { 'BOHEMIA_DEMO.html': cut }, file: 'BOHEMIA_DEMO.html' });

  /* ---- 1-5. IT READS AS A CONTROL, MEASURED AGAINST ITS NEIGHBOURS ---- */
  const bar = await d.fr.evaluate(() => {
    const R = document.getElementById('barright');
    if (!R) return { noBar: true };
    const kids = Array.from(R.children).map(el => {
      const r = el.getBoundingClientRect(), st = getComputedStyle(el);
      const inner = el.firstElementChild;
      const ist = inner ? getComputedStyle(inner) : null;
      const ir = inner ? inner.getBoundingClientRect() : null;
      return {
        id: el.id || '', text: (el.textContent || '').trim(),
        w: +r.width.toFixed(1), h: +r.height.toFixed(1), x: +r.x.toFixed(1),
        /* a chip's body may be on the element or on the plate inside it */
        plate: st.boxShadow !== 'none' || !!(ist && ist.boxShadow !== 'none'),
        ink: (ist ? ist.color : st.color),
        drawn: ir ? { w: +ir.width.toFixed(1), h: +ir.height.toFixed(1) } : { w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
        onScreen: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth
      };
    });
    const me = kids.find(k => k.id === 'notebtn');
    /* who owns each neighbour's own centre pixel? a reach that covers a neighbour is a
       tap that does the wrong thing, which this file already measured once. */
    const stolen = [];
    for (const el of Array.from(R.children)) {
      const b = el.getBoundingClientRect();
      /* A ZERO-SIZE CHILD HAS NO CENTRE TO STEAL. #devbtn (TOOLS) is 0x0 in the demo,
         and its "centre" is a point in the bar itself, which the first run of this leg
         reported as a theft. The leg was wrong, not the button: a control nobody can
         see is not a control anybody can mis-tap. */
      if (b.width < 1 || b.height < 1) continue;
      const owner = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      if (owner && owner !== el && !el.contains(owner)) stolen.push((el.id || el.tagName) + ' -> ' + (owner.id || owner.tagName));
    }
    const btn = document.getElementById('notebtn');
    const bb = btn ? btn.getBoundingClientRect() : null;
    const ownsSelf = bb ? (() => { const o = document.elementFromPoint(bb.x + bb.width / 2, bb.y + bb.height / 2);
      return !!o && (o === btn || btn.contains(o)); })() : false;
    return { kids, me, stolen, ownsSelf, last: kids.length ? kids[kids.length - 1].id : '',
             vw: innerWidth, barRight: +R.getBoundingClientRect().right.toFixed(1) };
  });

  if (bar.noBar) { ok('the top bar exists in the demo', false); return done(d); }
  ok('the notes control is in the top bar', !!bar.me);
  if (!bar.me) return done(d);

  ok('it says a WORD, not a mark', /[A-Z]{3,}/.test(bar.me.text), JSON.stringify(bar.me.text));
  ok('  and the word is NOTES', /^NOTES/.test(bar.me.text), bar.me.text);

  const others = bar.kids.filter(k => k.id && k.id !== 'notebtn' && k.w > 0);
  ok('every other chip in this bar has a plate (the control this is judged against)',
     others.length > 0 && others.every(k => k.plate), others.map(k => k.id).join(' '));
  ok('it has a plate too, like SAVE beside it', bar.me.plate);

  /* dimmer than its neighbours is what made it disappear; measure luminance, not a name */
  const lum = c => { const m = String(c).match(/\d+/g) || [0, 0, 0];
    return 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]; };
  const dimmest = Math.min.apply(null, others.map(k => lum(k.ink)));
  ok('its ink is no dimmer than the dimmest chip beside it',
     lum(bar.me.ink) >= dimmest - 1,
     'notes ' + lum(bar.me.ink).toFixed(0) + ' vs dimmest neighbour ' + dimmest.toFixed(0));

  ok('a whole thumb can reach it', bar.me.w >= 44 && bar.me.h >= 44,
     bar.me.w + 'x' + bar.me.h);
  ok('  and that reach steals nobody else\'s centre', bar.stolen.length === 0,
     bar.stolen.join(' | ') || 'none stolen');
  ok('  and it owns its own centre pixel', bar.ownsSelf);
  ok('it is the last thing at the right-hand end, where he said it is',
     bar.last === 'notebtn', 'last=' + bar.last);
  ok('it is on screen', bar.me.onScreen);

  /* ---- 6. IT TOGGLES, AND THE CHIP STAYS IN THE BAR ---- */
  const tap = () => d.fr.evaluate(() => {
    const b = document.getElementById('notebtn');
    const r = b.getBoundingClientRect();
    b.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
  });
  const isOpen = () => d.fr.evaluate(() => !!(window.BohemiaNotes && window.BohemiaNotes.isOpen()));
  const chipThere = () => d.fr.evaluate(() => {
    const b = document.getElementById('notebtn');
    if (!b) return false; const r = b.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < innerHeight; });

  ok('it starts collapsed', !(await isOpen()));
  await tap();
  ok('one tap opens the section', await isOpen());
  ok('  and the chip is still in the bar while it is open', await chipThere());
  ok('  and the chip shows it is open', await d.fr.evaluate(() =>
    document.getElementById('notebtn').classList.contains('on')));
  await tap();
  ok('tapping it again collapses it', !(await isOpen()));
  ok('  and the chip is still there after collapsing', await chipThere());

  /* ---- 6b. ON EVERY SCREEN OF THE DEMO, WHICH IS HALF OF WHAT THE ROW ASKS FOR
     AND THE HALF I NEARLY SHIPPED UNPROVED. The bar has no mode-dependent hiding rule
     and #barright is display:flex unconditionally, so READING the file says the chip
     survives the seam. Reading the file is what this round is about not doing. Cross
     the seam the way a thumb does -- one squeeze -- and ask the page again. ---- */
  await d.pinchOut();
  const cityMode = await d.fr.evaluate(() => (typeof MODE !== 'undefined' ? MODE : '?'));
  ok('the squeeze really crossed into the city', cityMode !== 'human', 'mode ' + cityMode);
  const inCity = await d.fr.evaluate(() => {
    const b = document.getElementById('notebtn');
    if (!b) return { there: false };
    const r = b.getBoundingClientRect();
    const own = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const pl = document.getElementById('noteplate');
    return { there: r.width >= 44 && r.height >= 44 && r.top < innerHeight,
             owns: !!own && (own === b || b.contains(own)),
             says: pl ? (pl.textContent || '').trim() : '' };
  });
  ok('the chip is still in the bar on the city screen', inCity.there);
  ok('  and still says its word there', /^NOTES/.test(inCity.says), inCity.says);
  ok('  and a thumb still reaches it there', inCity.owns);
  await d.pinchIn();

  /* ---- 7-9. COPY AND PASTE, WITH THE CLIPBOARD READ BACK ---- */
  const origin = d.page.url().replace(/(https?:\/\/[^/]+).*/, '$1');
  let canRead = true;
  try { await d.ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin }); }
  catch (e) { canRead = false; }

  await tap();                                   /* open */
  await d.fr.evaluate(() => { document.getElementById('notetext').value = 'THE CAR LOOKS LIKE DOGSHIT'; });
  await d.fr.evaluate(() => { document.getElementById('notecopy').click(); });
  await d.page.waitForTimeout(350);

  const after = await d.fr.evaluate(() => ({
    saved: (window.BohemiaNotes.list() || []).map(n => n.text),
    text:  window.BohemiaNotes.text(),
    chip:  (document.getElementById('notecopy') || {}).textContent || ''
  }));
  ok('COPY ALL saved what was still in the box first',
     after.saved.indexOf('THE CAR LOOKS LIKE DOGSHIT') >= 0, after.saved.join(' | '));
  ok('  and the chip says what happened rather than going quiet',
     /COPIED|COULD NOT COPY/.test(after.chip), JSON.stringify(after.chip));
  ok('  and it reports a copy, not a failure', /COPIED/.test(after.chip), after.chip);

  if (canRead) {
    let clip = '';
    try { clip = await d.page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'READ FAILED: ' + e.message; }
    ok('THE CLIPBOARD REALLY HOLDS THE NOTES (read back, not assumed)',
       clip.indexOf('THE CAR LOOKS LIKE DOGSHIT') >= 0, clip.slice(0, 70).replace(/\n/g, ' / '));
  } else {
    /* REFUSING TO REPORT rather than passing a leg that could not run. A green tick on a
       check the browser would not let me do is the exact shape of lie this lane keeps
       catching in its own rulers. */
    ok('THE CLIPBOARD REALLY HOLDS THE NOTES', false, 'clipboard permission refused; leg could not run');
  }

  ok('the copied text carries where he was standing', /DAY \d/.test(after.text) && /S IN/.test(after.text),
     (after.text.split('\n')[4] || '').trim().slice(0, 64));
  ok('  and it is plain text he can paste, not json', after.text.trim()[0] !== '{');

  done(d);
})().catch(e => { console.error(String(e && e.stack || e)); process.exit(1); });
