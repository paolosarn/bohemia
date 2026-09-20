/* ============================================================================
   THE NOTES BUTTON  (UI lane 11, 9/20) -- row [notes button].
   *** PAOLO 9/20: "in the demo there should be a note section at the very top right,
   just the tiniest button, where as I'm playing the demo I can write all my thoughts
   down and then resume back to playing." ***
   Rule 18(f): his direct ask, tiny, touches none of the three, so it ships while the
   rest of this lane holds.

   THE ROW'S OWN SHIP TEST IS THE SPINE OF THIS FILE: open, type, close, and the game
   resumed on the same cell at the same clock; the export carries the stamp and the place.

   *** THE LEG THAT EARNS IT IS THE PAUSE, AND THE FIRST RUN OF THIS TEST LIED TO ME. ***
   It reported the game moving while the note box was open, and the overlay leaking looked
   like the obvious cause. It was not: a tap EARLIER in the same run had started a HOLD on
   the pad, and the hold was still stepping. Opening the box first, having touched nothing,
   the game holds. So the test opens the box before it touches anything, and the pause is
   now explicit in the page (a capture-phase block) rather than left to stacking order --
   because asking the browser who owns the arrow's pixel gave TWO different answers on two
   runs of the same probe, and a pause that depends on which answer you get is not a pause.

   AND THE CLOCK NEEDED NO STOPPING, WHICH IS ALSO MEASURED. This valley runs on
   I-MOVE-YOU-MOVE: T.day and T.min advance per step, so with hands off the clock is still.
   The pause he asked for is the pause of not stepping, and that is what this holds.

   Run: node gates/the_notes_button_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const MIN = 44;

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = () => { console.log('\nTHE NOTES BUTTON: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await open({}); }
  catch (e) { ok('the demo could be driven to the street', false, String(e.message).slice(0, 90)); done(); }

  const state = () => d.fr.evaluate(() => ({
    day: (typeof T !== 'undefined') ? T.day : null,
    min: (typeof T !== 'undefined') ? T.min : null,
    hx: (typeof hx !== 'undefined') ? hx : null,
    hy: (typeof hy !== 'undefined') ? hy : null,
    mode: (typeof MODE !== 'undefined') ? MODE : '?' }));

  /* ---- 1. THE TINIEST BUTTON, TOP RIGHT, STILL 44 ------------------------ */
  const btn = await d.fr.evaluate((MIN) => {
    const b = document.getElementById('notebtn');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    /* THE RIGHTMOST CONTROL, not the rightmost NODE: the bar's own container reaches
       further right than anything in it, and comparing against it called this leg red on
       a button that was already in the right place. */
    let best = null;
    document.querySelectorAll('#menubar div,#menubar span,#menubar button').forEach(e => {
      if (e.id === 'barleft' || e.id === 'barright' || e.id === 'barmid' || e.id === 'barmoney') return;
      if (e.querySelector && e.querySelector('div,span,button')) return;   /* containers out */
      const x = e.getBoundingClientRect();
      if (x.width < 3 || x.height < 3) return;
      if (!best || x.right > best.right) best = { el: e, right: x.right, id: e.id || e.tagName };
    });
    /* the tiniest INK: font size against every other control in the bar */
    const inks = [];
    document.querySelectorAll('#menubar div,#menubar span,#menubar button').forEach(e => {
      if (e.querySelector && e.querySelector('div,span,button')) return;
      const t = (e.textContent || '').trim();
      if (!t) return;
      inks.push({ id: e.id || e.className || e.tagName, px: parseFloat(getComputedStyle(e).fontSize) || 0 });
    });
    const mine = inks.find(x => x.id === 'notebtn');
    return { w: Math.round(r.width), h: Math.round(r.height),
             at: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
             reaches: !!(hit && (hit === b || b.contains(hit))),
             reach44: r.width >= MIN - 0.5 && r.height >= MIN - 0.5,
             rightmost: !!(best && (best.el === b || b.contains(best.el))),
             rightmostIs: best ? best.id : 'none',
             ink: mine ? mine.px : null,
             tiniestInk: !!(mine && inks.every(x => x.px >= mine.px)),
             inks: inks.map(x => x.id + ':' + x.px).join(' ') };
  }, MIN);
  ok('the notes button is on the screen he plays', !!btn);
  if (!btn) { await d.close(); done(); }
  ok('it is the rightmost control in the top bar, which is where he said it is',
     btn.rightmost, 'rightmost is ' + btn.rightmostIs);
  ok('its ink is the smallest in the bar (' + btn.ink + 'px)', btn.tiniestInk, btn.inks);
  ok('and its reach is still 44, because THE THUMB is a law and tiny is about the ink',
     btn.reach44, btn.w + 'x' + btn.h);
  ok('a real finger at its centre reaches it', btn.reaches);

  /* ---- 2. ONE TAP IN, AND NOTHING HAS BEEN TOUCHED BEFORE IT -------------- */
  const before = await state();
  await d.tapAt(btn.at[0], btn.at[1]);
  await d.page.waitForTimeout(700);
  const opened = await d.fr.evaluate(() => ({
    on: !!document.querySelector('#notewrap.on'),
    where: (document.getElementById('notewhere') || {}).textContent || '' }));
  ok('one tap opens the note box', opened.on);
  ok('and the box already knows where he was standing, without him typing it',
     /DAY/.test(opened.where) && /AT /.test(opened.where), opened.where.slice(0, 80));

  /* ---- 3. *** THE PAUSE *** ---------------------------------------------- */
  /* EVERY ARROW, NOT ONE. The first cut of this leg pressed a single arrow, and removing
     the page's entire capture-phase block left it green -- so the leg was being satisfied by
     the scrim and could not tell me whether the block did anything at all. Pressing all
     eight, and printing who owns each pixel, is the difference between "a tap did nothing"
     and "the game cannot be stepped from here". */
  const arrows = await d.fr.evaluate(() => {
    const out = [];
    document.querySelectorAll('.pb').forEach(g => {
      const r = g.getBoundingClientRect();
      const x = Math.round(r.x + r.width / 2), y = Math.round(r.y + r.height / 2);
      const e = document.elementFromPoint(x, y);
      out.push({ at: [x, y], owner: e ? (e.id ? '#' + e.id : e.tagName) : 'null' });
    });
    return out;
  });
  ok('the walk pad is there to try to press through the box', arrows.length > 0,
     arrows.length + ' arrows, owned by ' + [...new Set(arrows.map(a => a.owner))].join('/'));
  for (const a of arrows) { await d.tapAt(a.at[0], a.at[1]); await d.page.waitForTimeout(200); }
  await d.page.waitForTimeout(1200);
  const during = await state();
  const still = (a, b) => a.day === b.day && a.min === b.min && a.hx === b.hx && a.hy === b.hy;
  ok('pressing EVERY arrow on the walk pad while the box is open does NOT move him',
     still(before, during), JSON.stringify(before) + ' -> ' + JSON.stringify(during));

  /* *** THE CAPTURE BLOCK IS LOAD-BEARING, AND IT TOOK TWO TRIES TO PROVE IT. ***
     The first cut of the pause leg pressed ONE arrow. Deleting the page's whole
     capture-phase block left it green, and I was one sentence from writing the block off
     as decoration the scrim made redundant. It was the LEG that was weak, not the block.
     Pressing all eight arrows and, more importantly, dispatching an event STRAIGHT AT the
     pad's own group -- the one route an overlay can never intercept -- and the same
     deletion now turns three legs red: the event reaches the pad, a hold starts, and he
     walks five cells while the box is open with his hands nowhere near the game.
     A LOCK NOTHING CAN PROVE IS THE SAME SLOP AS A DECLARATION A LATER RULE CANCELS, which
     is what this lane has spent two rounds writing about. The answer is not to delete the
     lock; it is to write the leg that can tell. */
  const lock = await d.fr.evaluate(() => {
    const g = document.querySelector('.pb');
    if (!g) return { err: 'no pad' };
    const r = g.getBoundingClientRect();
    let reached = false;
    const spy = () => { reached = true; };
    g.addEventListener('pointerdown', spy);
    g.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true,
      clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
    g.removeEventListener('pointerdown', spy);
    return { reached };
  });
  ok('an event aimed straight at the pad, past the box entirely, is stopped before the '
     + 'game sees it', lock.err ? false : lock.reached === false,
     lock.err || ('reached the pad: ' + lock.reached));

  /* and with hands off, the clock does not creep either */
  const q1 = await state(); await d.page.waitForTimeout(2500); const q2 = await state();
  ok('and with hands off the clock does not creep, because time moves when he moves',
     still(q1, q2), JSON.stringify(q1) + ' -> ' + JSON.stringify(q2));

  /* ---- 4. HE TYPES ------------------------------------------------------- */
  /* THE KEYBOARD GOES TO THE PAGE AND THE GAME IS IN A FRAME. Focusing the textarea from
     inside the frame is not enough: the iframe element has to hold focus in the parent or
     every keystroke lands in the shell. That cost this round two passes and it is an
     instrument note for every lane that drives this demo, not a defect in the game. */
  const tb = await d.fr.evaluate(() => { const t = document.getElementById('notetext');
    const r = t.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; });
  await d.tapAt(tb[0], tb[1]); await d.page.waitForTimeout(250);
  await d.page.evaluate(() => { const f = [...document.querySelectorAll('iframe')]
    .find(x => /CITY_WORLD/.test(x.src || '')); if (f) f.focus(); });
  await d.fr.evaluate(() => document.getElementById('notetext').focus());
  const SAY = 'the car looks like dogshit zoomed out';
  await d.page.keyboard.type(SAY);
  await d.page.waitForTimeout(300);
  const typed = await d.fr.evaluate(() => (document.getElementById('notetext') || {}).value || '');
  ok('he can type into it with a real keyboard', typed === SAY, JSON.stringify(typed).slice(0, 60));

  /* ---- 5. ONE TAP OUT, AND HE IS EXACTLY WHERE HE WAS --------------------- */
  const sb = await d.fr.evaluate(() => { const b = document.getElementById('notesave');
    const r = b.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; });
  await d.tapAt(sb[0], sb[1]); await d.page.waitForTimeout(700);
  const closed = await d.fr.evaluate(() => !document.querySelector('#notewrap.on'));
  const after = await state();
  ok('one tap and the box is gone', closed);
  ok('and he resumed on the SAME cell at the SAME clock',
     still(before, after), JSON.stringify(before) + ' -> ' + JSON.stringify(after));

  /* ---- 6. THE NOTE CARRIES ITS OWN CONTEXT ------------------------------- */
  const saved = await d.fr.evaluate(() => window.BohemiaNotes.list());
  ok('the note was kept', saved.length >= 1, saved.length + ' saved');
  const n = saved[saved.length - 1] || {};
  const c = n.ctx || {};
  ok('it kept what he wrote', n.text === SAY, String(n.text).slice(0, 50));
  ok('and it stamped the build, the mode, the place, the clock and the seconds in, '
     + 'so he never types any of it',
     !!c.build && !!c.mode && !!c.cell && c.day != null && typeof c.secs === 'number',
     JSON.stringify({ build: c.build, mode: c.mode, cell: c.cell, day: c.day, secs: c.secs }).slice(0, 120));
  ok('and a small picture of what was on the glass', !!(c.shot && c.shot.length > 500),
     c.shot ? c.shot.length + ' chars' : 'none');

  /* ---- 7. IT LEAVES THE PHONE THE SAME ROAD A VOTE DOES ------------------- */
  const txt = await d.fr.evaluate(() => window.BohemiaNotes.exportTxt());
  ok('the export is text he can send, and it carries what he wrote',
     txt.indexOf(SAY) >= 0);
  ok('and it carries the build stamp and the place with it',
     txt.indexOf(c.build) >= 0 && /AT \d+,\d+/.test(txt),
     txt.split('\n').slice(2, 5).join(' | ').slice(0, 110));

  /* ---- 8. IT SURVIVES THE PHONE BEING PUT DOWN --------------------------- */
  const persisted = await d.fr.evaluate(() => {
    try { return (JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]') || []).length; }
    catch (e) { return -1; } });
  ok('the note is on the phone, not just on the screen', persisted >= 1, String(persisted));

  ok('nothing threw while doing any of it', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
