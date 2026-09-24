/* BOHEMIA: DOES SCAVENGE SAY SO (9/24/26, LIFE + CITY, row [eyes: half a hud]).

   EYES round 14 and this lane agree on six of the seven controls and DISAGREE ON ONE:
   EYES says "ONLY SCAVENGE 8H still does nothing anywhere"; this lane measured
   #workbtn ALIVE, with "DAY 1 · 13:57" appearing as a new word on the first press.

   BOTH CAN BE TRUE, AND THAT IS THE FINDING. #workbtn's handler is doWork(), which
   pays a shift into the purse, pushes a post to the phone, ADVANCES THE CLOCK BY THE
   SHIFT'S HOURS and then re-syncs the button, which may hide it. It opens NO PANEL.
   So a "did a panel appear" test says dead and a "did any word change" test says
   alive, and neither is the question a player asks.

   PAOLO 9/13, RULE 14(d): "A card that promises something and does nothing is the
   worst bug in the game: deliver it or remove it." A button that silently burns eight
   hours of his day is not nothing -- it is worse than nothing, because he cannot tell
   it happened and he cannot get the hours back.

   SO THIS ASKS THE ONLY QUESTION THAT MATTERS: press it once, and does the GAME
   change in a way HE CAN SEE? The clock, the money, the phone, the button itself.

   Run from repo root:  node tools/bohemia_does_scavenge_say_so_probe.js
*/
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ alpha: true });
  console.log(d.says());

  const read = () => d.fr.evaluate(() => {
    const el = document.getElementById('workbtn');
    const cs = el ? getComputedStyle(el) : null;
    let money = null;
    try { money = JSON.stringify(BohemiaPurse.read(PURSE)).slice(0, 80); } catch (e) {}
    if (money === null) { try { money = String(window.__WORKED || 0); } catch (e) {} }
    let posts = null;
    try { posts = (window.PHONEFEED || []).length; } catch (e) { posts = null; }
    /* every word the top bar is showing him, which is where a clock lives */
    const bar = [];
    for (const n of document.querySelectorAll('#topbar *, #menubar *, #blstack *')) {
      const own = Array.from(n.childNodes).filter(q => q.nodeType === 3)
        .map(q => q.textContent).join('').trim();
      if (own && own.length < 40) bar.push(own);
    }
    return {
      btn: el ? { text: (el.textContent || '').trim(), display: cs.display } : null,
      clock: (typeof DAY !== 'undefined') ? (DAY.day + ' ' + DAY.min + ' ' + DAY.phase) : '?',
      worked: window.__WORKED || 0, unpaid: window.__WORK_UNPAID || 0,
      posts, money, bar
    };
  });

  const before = await read();
  console.log('');
  console.log('BEFORE          button "' + (before.btn && before.btn.text) + '" ('
    + (before.btn && before.btn.display) + ')');
  console.log('                clock ' + before.clock + ', shifts worked ' + before.worked
    + ', phone posts ' + before.posts);

  /* press it the way he does: a real finger, frame-aware, through the driver */
  const box = await d.fr.evaluate(() => {
    const el = document.getElementById('workbtn'); if (!el) return null;
    const r = el.getBoundingClientRect();
    return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)];
  });
  if (!box) { console.log('THE BUTTON IS NOT ON SCREEN AT ALL.'); await d.close(); process.exit(0); }
  await d.tapAt(box[0], box[1]);
  await d.page.waitForTimeout(1400);
  const after = await read();

  console.log('AFTER ONE PRESS button "' + (after.btn && after.btn.text) + '" ('
    + (after.btn && after.btn.display) + ')');
  console.log('                clock ' + after.clock + ', shifts worked ' + after.worked
    + ', phone posts ' + after.posts);
  console.log('');
  const moved = [];
  if (before.clock !== after.clock) moved.push('THE CLOCK (' + before.clock + ' -> ' + after.clock + ')');
  if (before.worked !== after.worked) moved.push('a shift was PAID (' + before.worked + ' -> ' + after.worked + ')');
  if (before.unpaid !== after.unpaid) moved.push('a shift went UNPAID (' + before.unpaid + ' -> ' + after.unpaid + ')');
  if (before.posts !== after.posts) moved.push('the phone got a post (' + before.posts + ' -> ' + after.posts + ')');
  if (String(before.money) !== String(after.money)) moved.push('the money changed');
  if (before.btn && after.btn && before.btn.display !== after.btn.display)
    moved.push('the button itself went ' + before.btn.display + ' -> ' + after.btn.display);
  const newBar = after.bar.filter(w => before.bar.indexOf(w) < 0);

  console.log('WHAT THE PRESS ACTUALLY DID:');
  if (!moved.length) console.log('    NOTHING AT ALL. EYES is right and it is dead.');
  else for (const m of moved) console.log('    ' + m);
  console.log('');
  console.log('WHAT HE COULD SEE CHANGE, in the bar and the rail: '
    + (newBar.length ? newBar.map(w => '"' + w + '"').join(', ') : 'NOTHING'));
  console.log('');
  if (moved.length && !newBar.length)
    console.log('  >>> IT WORKS AND IT DOES NOT SAY SO. That is rule 14(d)\'s worse case:');
  if (moved.length && newBar.length)
    console.log('  >>> IT WORKS AND IT SAYS SO.');
  console.log('  errors: ' + d.errs.length + (d.errs.length ? '  ' + d.errs[0] : ''));
  await d.close();
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
