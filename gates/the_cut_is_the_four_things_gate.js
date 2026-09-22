/* ==========================================================================
   THE CUT IS THE FOUR THINGS  (RUN, 9/23/26, VAMILY [cut now])

   PAOLO 9/20: "I'm overwhelmed and underwhelmed at the same time... a lot going
   on and I see it but this shit is broken right now."
   PAOLO 9/22: "I'm really trying to push this demo out... I DON'T NEED THE WHOLE
   WORLD, I don't need everything."
   Rule 18g and 18i: THE FOUR THINGS AND NOTHING ELSE.

   WHAT THIS GATE IS FOR, AND WHY IT IS NOT A LIST OF STRINGS IN A FILE. A cut
   that subtracts is one line of CSS away from subtracting the game. So this asks
   the two questions in the rule, in this order, and neither is readable off the
   source:

     1. IS THE CLUTTER GONE FROM THE DEMO. Every control rule 18g names for the
        bin, asked of the glass at 390 x 844: is it drawing.
     2. IS EVERYTHING HE NEEDS STILL REACHABLE. Not "is it in the markup" -- a
        real finger, on the real cut: the pad moves him, NOTES opens and holds
        words, the phone opens, the fight starts.
     3. AND THE WORKSHOP STILL HAS ALL OF IT. The strip is a demo-side stylesheet,
        like the builder drawer and the cold open. If the alpha lost a control
        too, somebody deleted a feature while thinking they were cutting a demo.

   A DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON (rule 14h), so every
   "it still works" leg here requires the thing to still be OPEN and its words to
   have arrived, never just "something changed".

   node gates/the_cut_is_the_four_things_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('THE CUT IS THE FOUR THINGS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

/* rule 18g's own bin list, by the id each one actually carries on the glass */
const GONE = [
  ['musbtn',  'the MUSIC chip'],
  ['savebtn', 'the SAVE chip'],
  ['hmode',   'the HUMAN MODE readout'],
  ['hslot',   'the SUBURB - ON FOOT readout'],
  ['hclock',  'the DAY 1 - 06:00 readout'],
  ['blstack', 'the left rail: STANDING, BUILD HERE, SCAVENGE, BIKE, SLEEP, MARKET'],
  ['note',    'the line of prose with no mouth'],
  ['devbtn',  "the builder's drawer"]
];
/* and what he must still be able to reach */
const KEPT = [['pad', 'the walk pad'], ['notebtn', 'NOTES']];

const drawn = (fr, id) => fr.evaluate((i) => {
  const el = document.getElementById(i);
  if (!el) return { there: false, seen: false };
  const b = el.getBoundingClientRect(), s = getComputedStyle(el);
  const seen = s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity !== 0
            && b.width > 4 && b.height > 4
            && b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth;
  return { there: true, seen: seen, w: Math.round(b.width), h: Math.round(b.height),
           x: Math.round(b.x), y: Math.round(b.y) };
}, id);

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }

  try {
    const fr = d.fr;
    await d.page.waitForTimeout(1500);

    /* ---- 1. THE CLUTTER IS GONE ---------------------------------------- */
    let still = [];
    for (const [id, what] of GONE) {
      const g = await drawn(fr, id);
      if (g.seen) still.push(what);
      ok('gone from the demo: ' + what, !g.seen);
    }
    say('  rule 18g names 8 things for the bin; ' + (8 - still.length) + ' of 8 are off the screen');

    /* AND THE COUNT, WHICH IS THE THING HE ACTUALLY FEELS. Every box with an id that
       a player can see on the first screen.
       *** BOTH NUMBERS ARE MEASURED ON A GAME THAT WAS REALLY OPENED. *** The first
       pair I took read 24 -> 10, and both were wrong in the same direction: the driver
       was leaving the loading screen over the glass (TRAP 7), so the teaching overlay
       under it was never counted. With the door really pressed it is 27 -> 13. A
       before and an after taken through different glass are not a before and after. */
    const boxes = await fr.evaluate(() => {
      const seen = new Set(); let n = 0;
      /* *** THE PHONE IS ONE THING, NOT SIX. *** UI put the drawn phone on the STREET
         (9/23, [phone on the street]) after RUN measured that the morning was in a room
         with no door there. That is a KEEP on rule 18g's own list, and it arrives as a
         46 x 62 object made of six named boxes -- the casing, the tape, the screen, the
         glass, the bar, the clock -- which pushed this count from 13 to 19 without one
         extra thing appearing on his screen. COUNTING AN OBJECT'S OWN PARTS AS CLUTTER
         WOULD PUNISH THE FIX THIS LANE ASKED FOR. The phone counts once. */
      const phone = (el) => el.closest && (el.closest('#cityfeed') || el.closest('#phonewrap'));
      for (const el of Array.from(document.querySelectorAll('body *'))) {
        if (!el.id || seen.has(el.id)) continue;
        if (el.id !== 'cityfeed' && el.id !== 'phonewrap' && phone(el)) continue;
        if (el.tagName === 'CANVAS' || el.tagName === 'SVG') continue;
        const b = el.getBoundingClientRect(), s = getComputedStyle(el);
        if (b.width < 6 || b.height < 6) continue;
        if (b.bottom < 0 || b.top > innerHeight || b.right < 0 || b.left > innerWidth) continue;
        if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
        seen.add(el.id); n++;
      }
      return n;
    });
    say('  boxes with a name on his first screen: ' + boxes + ' (it was 27 before the cut)');
    ok('*** LESS ON SCREEN, MEASURED, NOT CLAIMED *** (' + boxes + ' of 27)', boxes <= 16);

    /* ---- 2. AND EVERYTHING HE NEEDS IS STILL REACHABLE ------------------ */
    for (const [id, what] of KEPT) {
      const g = await drawn(fr, id);
      ok('still on the screen: ' + what, g.seen === true);
    }
    /* NOTES DID NOT MOVE ACROSS THE SCREEN. Taking things away must not push the
       one control that stayed under the other hand. */
    const nb = await drawn(fr, 'notebtn');
    say('  NOTES sits at x=' + nb.x + ' of 390');
    ok('and NOTES is still on the right, where his thumb left it', nb.x > 195);

    /* THE PAD MOVES HIM. The game's own cell numbers, not a picture diff. */
    const where = () => fr.evaluate(() => ({ x: hx, y: hy }));
    const before = await where();
    const arrow = await fr.evaluate(() => {
      const pad = document.getElementById('pad');
      const g = pad && pad.querySelectorAll('.pb')[2];        /* east */
      const a = g && (g.querySelector('.parr') || g);
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (arrow) for (let i = 0; i < 12; i++) { await d.tapAt(arrow.x, arrow.y); await d.page.waitForTimeout(120); }
    const after = await where();
    const moved = Math.abs(after.x - before.x) + Math.abs(after.y - before.y);
    say('  twelve presses on the pad moved him ' + moved + ' cells');
    ok('*** THE PAD STILL WALKS HIM ON THE STRIPPED CUT ***', moved > 0);

    /* NOTES OPENS AND HOLDS WORDS. Open, and STILL open, with text in it. */
    if (nb.seen) { await d.tapAt(nb.x + nb.w / 2, nb.y + nb.h / 2); await d.page.waitForTimeout(700); }
    const notes = await fr.evaluate(() => {
      const el = document.querySelector('#notepanel, #notewrap, .notepanel')
             || document.getElementById('notebtn');
      const open = !!document.querySelector('#notepanel.on, #notewrap.on, #notebtn.on')
                || !!(el && /\bon\b/.test(el.className));
      const box = document.querySelector('#notepanel, #notewrap');
      const words = box ? (box.textContent || '').replace(/\s+/g, ' ').trim().length : 0;
      return { open: open, words: words };
    });
    say('  NOTES opened: ' + notes.open + ', and it is holding ' + notes.words + ' characters');
    ok('*** NOTES STILL OPENS, AND STAYS OPEN WITH WORDS IN IT ***',
       notes.open === true && notes.words > 0);

    /* AND IT FOLDS AGAIN, BY ITS OWN CLOSE.
       *** MEASURED, BECAUSE MY FIRST TWO GUESSES WERE BOTH WRONG. *** The notes panel
       is 390 x 844 -- the WHOLE SCREEN -- so it covers the NOTES button itself, and
       tapping NOTES again cannot fold it: that touch lands on the panel. A tap low on
       the world does not fold it either. Its own CLOSE does, first try. That is not a
       defect, it is a full-screen panel behaving like one, and the gate has to use the
       door the panel actually has instead of the one I assumed.
       FOLDING IT HERE IS ALSO THE RULER, NOT THE GAME: the first cut of this gate left
       NOTES up and then went straight at the phone, and both phone legs went red with
       the point landing on the notes panel -- correct behaviour reported as a break,
       which is the "before blaming the game, blame the ruler" mistake with an extra
       step. */
    const back = await fr.evaluate(() => {
      const b = document.getElementById('noteback'); if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, says: (b.textContent || '').trim() };
    });
    if (back) { await d.tapAt(back.x, back.y); await d.page.waitForTimeout(600); }
    const folded = await fr.evaluate(() => !document.querySelector('#notewrap.on'));
    say('  NOTES folds again on its own ' + (back ? back.says : '(no close found)'));
    ok('and NOTES folds again, so it is not a one-way door', folded === true);

    /* TO THE CITY SCREEN BY HIS OWN GESTURE, NOT BY SETTING THE CAMERA. The first cut
       of this gate set MODE by hand and said so, because the pinch did not cross --
       which turned out to be the driver walking the game through the loading screen
       (TRAP 7 in the driver). With that fixed the squeeze is a real door again, and
       assignment is not input (the driver's own trap 4). */
    await d.pinchOut();
    await d.page.waitForTimeout(1200);
    const reached = await fr.evaluate(() => MODE);
    say('  one squeeze on the street reached: ' + reached);
    ok('the city screen is reached by a squeeze, the way he reaches it', reached === 'city');
    const ph = await fr.evaluate(() => {
      const f = document.getElementById('cityfeed');
      if (!f) return { there: false };
      const b = f.getBoundingClientRect();
      const mid = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return { there: b.width > 0, mine: !!(mid && f.contains(mid)),
               gets: mid ? (mid.id || mid.tagName + '.' + mid.className) : null,
               x: b.x + b.width / 2, y: b.y + b.height / 2 };
    });
    say('  the point at the middle of the drawn phone goes to ' + ph.gets);
    ok('the phone is still drawn on the city screen', ph.there === true);
    ok('and it still catches a finger rather than the map behind it', ph.mine === true);
    if (ph.there) {
      /* the harness loses the first touch into a fresh frame; retry once before
         accusing the game of what the ruler did */
      await d.tapAt(ph.x, ph.y); await d.page.waitForTimeout(600);
      if (!(await fr.evaluate(() => !!PHONE_ON))) {
        await d.tapAt(ph.x, ph.y); await d.page.waitForTimeout(600);
      }
    }
    const phoneOpen = await fr.evaluate(() => !!PHONE_ON);
    ok('*** AND ONE TOUCH STILL OPENS THE PHONE ON THE CUT ***', phoneOpen === true);
    await fr.evaluate(() => { try { phoneClose(); MODE = 'human'; } catch (e) {} });

    /* THE FIGHT. The tab strip is hidden in the demo, and the fight's own door
       clicks that hidden tab to build its frame -- so this asks whether the door
       still opens with the strip gone, which is the whole risk of a cut. */
    await d.pageEval(() => { try { cityEncounterIn({ packageId: 1, label: 'the cut proof', street: true }); } catch (e) { window.__ENCERR = String(e.message); } });
    await d.page.waitForTimeout(3500);
    const fight = await d.pageEval(() => {
      const f = document.getElementById('combatFrame');
      const b = f ? f.getBoundingClientRect() : null;
      return { frame: !!f, err: window.__ENCERR || null,
               w: b ? Math.round(b.width) : 0, h: b ? Math.round(b.height) : 0,
               on: !!(window.CITYFIGHT) };
    });
    say('  the fight door: frame ' + fight.frame + ', ' + fight.w + ' x ' + fight.h
        + (fight.err ? (', threw ' + fight.err) : ''));
    ok('*** THE FIGHT STILL STARTS ON THE STRIPPED CUT ***',
       fight.frame === true && fight.w > 100 && fight.h > 100);

    await d.close();
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await d.close(); } catch (_e) {}
  }

  /* ---- 3. AND THE WORKSHOP KEPT EVERY ONE OF THEM --------------------- */
  let a;
  try { a = await drive.open({ alpha: true, keepCards: true }); }
  catch (e) { ok('the alpha boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    await a.page.waitForTimeout(2000);
    let kept = 0;
    for (const [id, what] of GONE) {
      const g = await drawn(a.fr, id);
      if (g.there) kept++;
      ok('the workshop still has ' + what + ' (hidden from the demo side only)', g.there === true);
    }
    say('  the alpha still carries ' + kept + ' of ' + GONE.length + ' stripped controls');
    await a.close();
  } catch (e) {
    ok('the alpha leg ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await a.close(); } catch (_e) {}
  }
  done();
})();
