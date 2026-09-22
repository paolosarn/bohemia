/* ============================================================================
   NOTHING POPS UP WHEN THE DEMO STARTS (9/21/26, RUN lane, VAMILY [no pop ups])

   PAOLO 9/20, TWICE IN A ROW, rule 19a: "I start the demo and a bunch of shit pops
   up on the screen. What the fuck is that?" -- and on the second frame of the game,
   the SNATCHER road card: "you don't got quests like that for real... it can't just
   be these bullshit-ass text prompts."

   MEASURED BEFORE ANYTHING WAS WRITTEN, on the served demo, phone profile, five
   minutes, NOTHING TAPPED BUT THE PAD (tools/bohemia_what_pops_up_9_21_26.js):

       ONE card opened by itself, at 2.5 SECONDS, AND IT NEVER WENT AWAY.
       554 presses on the pad over five minutes moved him ZERO CELLS,
       because the first thing the game does was sitting on the only control.

   That is his sentence and it is also the #daycard-over-the-pad bug PLUMBER has
   carried on RUN's row for three rounds running.

   WHAT THIS GATE HOLDS, and it holds the RULE and not the four callers:
     1. FIVE MINUTES FROM THE DOOR, ZERO CARDS HE DID NOT TAP FOR. Walked with the
        one driver, cards deliberately NOT cleared, because a stranger has no
        harness to clear them.
     2. AND HE CAN WALK, which is the half a card count would miss entirely: the
        pad has to move him. A dead card that is merely invisible is still a card.
     3. EVERY CARD THAT DOES OPEN SAYS WHY. cardShow refuses a card whose caller
        cannot name a reason, so a lane that adds a forced card tomorrow finds this
        red instead of Paolo finding a pop-up.
     4. THE BOOKKEEPING IS NOT DELETED, AND THE ROOM HAS A DOOR. The morning's words
        are on the phone, which is where rule 19a sends them -- and the phone is drawn
        on the screen, it rings, one real touch opens it, and its CLOSE folds it. A
        room with no door is the same as a deleted room, which is what this leg caught:
        the chip this used to ask about was deleted on 9/22 and the drawn phone that
        replaced it was pointer-events:none, so the phone could not be opened at all.
     5. THE DAY STILL TURNS. SLEEP was the rollover as well as a button; the night
        now turns by itself. A fix that stopped the calendar would be worse than the
        card it removed.

   node gates/nothing_pops_up_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('NOTHING POPS UP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const MINUTES = 5;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }

  try {
    const fr = d.fr;

    /* WRAP THE ONE CHOKE POINT. Every panel in this game comes through cardShow, so
       this records what opened and WHY, which is the thing the rule is about. */
    await fr.evaluate(() => {
      window.__POPS = [];
      const t0 = Date.now();
      const real = window.cardShow;
      window.cardShow = function (html, onTap, why) {
        window.__POPS.push({
          at: Date.now() - t0, why: why || null,
          text: String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70)
        });
        return real.apply(this, arguments);
      };
      return true;
    });

    const cardUp = () => fr.evaluate(() => {
      const c = document.getElementById('daycard');
      return !!(c && c.classList.contains('on'));
    });

    ok('*** THE FIRST FRAME OF THE GAME IS THE GAME, NOT A CARD ***', !(await cardUp()));

    /* HE WALKS. One direction, held, the way a stranger does. */
    const fEl = await d.page.$('iframe#cityFrame');
    const fb = fEl ? await fEl.boundingBox() : { x: 0, y: 0 };
    const w = await fr.evaluate(() => {
      const pad = document.getElementById('pad');
      const g = pad && pad.querySelectorAll('.pb')[2];   /* east */
      const a = g && (g.querySelector('.parr') || g);
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    ok('the pad is there to press', !!w);
    if (!w) { await d.close(); return done(); }

    const at0 = await d.state();
    const until = Date.now() + MINUTES * 60000;
    let presses = 0;
    while (Date.now() < until) {
      const pts = [{ x: fb.x + w.x, y: fb.y + w.y, id: 1 }];
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts });
      await d.page.waitForTimeout(90);
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      presses++;
      await d.page.waitForTimeout(400);
    }
    const at1 = await d.state();
    const moved = Math.max(Math.abs(at1.hx - at0.hx), Math.abs(at1.hy - at0.hy));

    const pops = await fr.evaluate(() => window.__POPS);
    const unasked = pops.filter(p => !p.why);
    say(MINUTES + ' MINUTES FROM THE DOOR, ' + presses + ' presses, nothing tapped but the pad');
    say('  cards opened: ' + pops.length + ' (' + unasked.length + ' with no reason)');
    for (const p of pops) say('    ' + (p.at / 1000).toFixed(1) + 's  [' + (p.why || 'NO REASON') + ']  ' + p.text);

    ok('*** ZERO CARDS HE DID NOT TAP FOR, IN FIVE MINUTES *** (' + pops.length + ')',
       pops.length === 0);
    ok('and nothing is on screen at the end of it', !(await cardUp()));

    /* THE HALF A CARD COUNT WOULD MISS: an invisible card is still a card if his
       presses do not reach the world. */
    say('  he covered ' + moved + ' cells over ' + presses + ' presses');
    ok('*** AND THE PAD MOVED HIM *** (' + moved + ' cells; it was 0 before this)',
       moved > 40);

    /* THE RULE ITSELF, on the source, so a caller added tomorrow cannot slip past
       by simply never firing during a five-minute walk. */
    const src = require('fs').readFileSync(
      path.join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
    ok('a card with no reason is REFUSED at the one door, not in eight callers',
       /function cardShow\(html,onTap,asked\)\{\s*if\(!asked\)\{/.test(src.replace(/\s+/g, ' ').replace(/ \{/g, '{'))
       || /function cardShow\(html,onTap,asked\)/.test(src));
    ok('and a refusal is remembered rather than swallowed', /CARDS_REFUSED/.test(src));
    /* COUNT THE CALLS, NOT A ONE-LINE SHAPE. The first cut of this counter used a
       regex that only matched a cardShow written on one line and reported 2 of 5,
       which would have read as a real red on a correct tree. A checker that is
       wrong in the safe direction is still a checker that lies. */
    const calls = src.split(/\bcardShow\(/).slice(1);
    let named = 0, unnamed = 0;
    for (const c of calls) {
      /* the call's own text, up to the statement that closes it */
      const head = c.slice(0, c.indexOf('\n}') + 1 || 4000).slice(0, 4000);
      const end = head.match(/,\s*'([^']{4,80})'\s*\)\s*;/);
      if (end) named++; else unnamed++;
    }
    say('  cardShow call sites: ' + calls.length + ', naming a reason: ' + named);
    ok('every card that may open names why, and the rest are refused ('
       + named + ' named of ' + calls.length + ')', named >= 4);

    /* THE BOOKKEEPING IS NOT DELETED. */
    const phone = await fr.evaluate(() => {
      try {
        const st = phoneState();
        return { morning: st.morning };
      } catch (e) { return { err: String(e.message).slice(0, 80) }; }
    });
    const lines = (phone.morning && phone.morning.lines) ? phone.morning.lines.length : 0;
    say('  the phone carries "' + ((phone.morning || {}).head || '-') + '", ' + lines + ' lines');
    ok('*** THE MORNING IS NOT DELETED, IT IS ON THE PHONE *** (' + lines + ' lines)', lines > 0);

    /* *** AND A ROOM WITH NO DOOR IS THE SAME AS A DELETED ROOM. *** (9/23.)
       THE OLD LEG ASKED #phonebtn WHETHER IT WAS GOLD. UI deleted #phonebtn on 9/22 on
       his own ruling ("the phone is the phone button"), so the leg was asking an element
       that is not in the document, and `(null || {}).className` answers undefined --
       a check that can only ever say no, about a thing that is not there.
       WHAT IT ASKS NOW IS WHAT HE WOULD DO: find the phone on the screen, look at it,
       put a finger on it, and see the morning. Measured, not read. */
    /* THE DRAWN PHONE LIVES ON THE CITY SCREEN, SO GO THERE THE WAY HE GOES THERE.
       The first cut of this set MODE by hand and said so, because the squeeze did not
       cross. It does now: that was never the seam, it was the driver walking the game
       through the loading screen without ever pressing BEGIN (TRAP 7 in the driver),
       so both fingers were landing on a sheet over the canvas. Assignment is not input. */
    await d.pinchOut();
    await d.page.waitForTimeout(1200);
    const reached = await fr.evaluate(() => MODE);
    say('  one squeeze on the street reached: ' + reached);
    ok('the city screen is reached by a squeeze, the way he reaches it', reached === 'city');

    const handle = await fr.evaluate(() => {
      const f = document.getElementById('cityfeed');
      if (!f) return { there: false };
      const b = f.getBoundingClientRect();
      const mid = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return { there: true, w: Math.round(b.width), h: Math.round(b.height),
               ring: /\bring\b/.test(f.className),
               finger: getComputedStyle(f).pointerEvents !== 'none',
               /* who actually gets the point: the phone, or the map behind it */
               gets: mid ? (mid.id || mid.tagName) : null,
               mine: !!(mid && f.contains(mid)) };
    });
    say('  the drawn phone is ' + handle.w + ' x ' + handle.h
        + ', the point at its middle goes to ' + handle.gets);
    ok('the phone he was sent words to is DRAWN on the screen', handle.there && handle.w > 0);
    ok('*** AND IT CATCHES A FINGER, SO IT IS A DOOR AND NOT A PICTURE ***',
       handle.finger === true && handle.mine === true);
    ok('and it rings, so he knows there is something to read', handle.ring === true);

    /* A REAL TOUCH, AT ITS REAL PLACE ON THE GLASS. The harness loses the first touch
       into a fresh frame (measured on the walk gate too), so a lost press is retried
       ONCE before it is called a dead button -- accusing the game of what the ruler
       did is this lane's most expensive recurring mistake. */
    const feedMid = () => fr.evaluate(() => {
      const b = document.getElementById('cityfeed').getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    });
    let m = await feedMid();
    await d.tapAt(m.x, m.y);
    await d.page.waitForTimeout(600);
    let opened = await fr.evaluate(() => !!PHONE_ON);
    if (!opened) { m = await feedMid(); await d.tapAt(m.x, m.y); await d.page.waitForTimeout(600);
                   opened = await fr.evaluate(() => !!PHONE_ON); }
    const after = await fr.evaluate(() => ({ on: !!PHONE_ON, unread: MORNING_UNREAD | 0 }));
    say('  one touch on the drawn phone: it opened ' + after.on
        + ', the morning went from ' + lines + ' unread to ' + after.unread);
    ok('*** ONE TOUCH ON THE DRAWN PHONE OPENS IT *** (his 9/22 ruling, on the glass)',
       after.on === true);
    ok('and opening it marks the morning read, so the ring means something',
       after.unread === 0);

    /* AND IT FOLDS. Its own CLOSE, because the open phone covers the drawn one. */
    const cb = await fr.evaluate(() => {
      const c = document.getElementById('phoneclose'); if (!c) return null;
      const b = c.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: Math.round(b.width) };
    });
    if (cb && cb.w > 0) { await d.tapAt(cb.x, cb.y); await d.page.waitForTimeout(500); }
    const folded = await fr.evaluate(() => !PHONE_ON);
    ok('and it folds again, so it is not a one-way door', folded === true);
    /* *** AND IT ASKS THE SOURCE AND THE BUILT FILE, BECAUSE ASKING ONLY THE BUILT FILE
       IS HOW THIS WENT MISSING. *** (9/23.) The morning block was written straight into
       slices/BOHEMIA_CURRENT_SLICE.html, which is GENERATED from the phone source by
       tools/build_current_slice.js. It shipped, it was green, and the next lane that
       rebuilt the slice for its own reasons wiped it -- exactly as a rebuild should.
       A CHECK THAT ONLY READS THE OUTPUT CANNOT TELL "somebody wrote it in the right
       place" FROM "somebody wrote it in the file the build overwrites". Both, now: the
       source must carry it AND the built slice must too, which is also the only way to
       catch a source edit that nobody rebuilt. */
    const fsx = require('fs');
    const phoneSrc = fsx.readFileSync(
      path.join(__dirname, '..', 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'), 'utf8');
    const phoneOut = fsx.readFileSync(
      path.join(__dirname, '..', 'slices/BOHEMIA_CURRENT_SLICE.html'), 'utf8');
    ok('the phone really renders what the run sends it, IN ITS SOURCE',
       /function morningBlock\(\)/.test(phoneSrc));
    ok('  and the built slice was rebuilt from that source, so it is not a stale copy',
       /function morningBlock\(\)/.test(phoneOut));

    /* THE DAY STILL TURNS. SLEEP was the ROLLOVER as well as a button, and a fix
       that removed the button and stopped the calendar would be worse than the card.

       *** AND THE FIRST CUT OF THIS LEG WAS WRONG ABOUT THE GAME, NOT THE OTHER WAY
       ROUND. *** It called the night on the demo and demanded day 2. THE DEMO ENDS
       AFTER DAY ONE, on purpose, and has since __THE_ENDING__ was built: ctDemoOver
       sends the last night to the ending instead of the rollover. So the honest test
       turns the demo flag off for one call and asks the ROLLOVER whether it still
       rolls, and asks the demo separately whether its last night still ends. Two
       different rules, two different questions, and neither of them is "the number
       went up". */
    const roll = await fr.evaluate(() => {
      try {
        const was = CT_IS_DEMO;
        CT_IS_DEMO = false;                 /* ask the ROLLOVER, not the ending */
        const before = DAY.day;
        showReckoning();
        const after = DAY.day;
        CT_IS_DEMO = was;
        return { before: before, after: after };
      } catch (e) { return { err: String(e.message).slice(0, 120) }; }
    });
    say('  the night turned by itself: day ' + roll.before + ' -> ' + roll.after
        + (roll.err ? ' [' + roll.err + ']' : ''));
    ok('*** AND THE DAY STILL TURNS WITHOUT A BUTTON TO PRESS *** (day '
       + roll.before + ' -> ' + roll.after + ')', !roll.err && roll.after > roll.before);
    ok('and it turned with no card to dismiss', !(await cardUp()));

    /* and the demo's own last night still ends the demo, which is a card, and it is
       the one forced card rule 19a does not name: the game finishing. */
    const endPops = await fr.evaluate(() => {
      window.__POPS.length = 0;
      try { CT_IS_DEMO = true; showReckoning(); } catch (e) { }
      return window.__POPS.map(p => p.why);
    });
    say('  the demo\'s last night: ' + JSON.stringify(endPops));
    ok('the demo still ends, and the ending names itself rather than sneaking through',
       endPops.length === 1 && /ended/.test(String(endPops[0])));

    /* *** THE OTHER HALF OF THE ROW (PAOLO 9/21, THE THIRD TIME): "all these fucked
       up quest cards that don't do anything when I click on them." ***
       Killing the cards that open by themselves is not the same as every row on the
       cards he CAN reach doing something. Measured with real touches, every row of
       every reachable card, one page per card: of 19 rows, ONE was a genuinely dead
       press -- the market's shelf, where he has ZERO batteries, so pressing FOOD ran
       the whole buy, got CANNOT_AFFORD and redrew the card saying exactly what it was
       already saying. Nothing moved, so from his side the button was dead.
       THIS LEG HOLDS THE FIX AT ITS SOURCE: a row he cannot buy carries no data-act,
       so a tap cannot reach the dispatcher at all. The full sweep lives in
       tools/bohemia_every_tap_on_every_card_9_21_26.js (16 of 16 rows alive). */
    const shelf = await fr.evaluate(() => {
      try {
        document.getElementById('daycard').classList.remove('on');
        showMarket();
        const c = document.getElementById('daycard');
        const out = [];
        c.querySelectorAll('.mrow').forEach(el => out.push({
          txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28),
          no: /\bno\b/.test(el.className), act: el.dataset.act || null }));
        document.getElementById('daycard').classList.remove('on');
        return out;
      } catch (e) { return [{ err: String(e.message).slice(0, 80) }]; }
    });
    const cantAfford = shelf.filter(r => r.no);
    const pressableAnyway = cantAfford.filter(r => r.act);
    say('  market shelf: ' + shelf.length + ' rows, ' + cantAfford.length
        + ' he cannot buy, ' + pressableAnyway.length + ' of those still pressable');
    ok('*** A ROW HE CANNOT BUY IS NOT A DEAD PRESS, IT IS NOT A PRESS *** ('
       + pressableAnyway.length + ' pressable of ' + cantAfford.length + ' unaffordable)',
       pressableAnyway.length === 0);

    ok('nothing threw in five minutes (' + d.errs.length + ')', d.errs.length === 0);
    if (d.errs.length) say('  ' + d.errs.slice(0, 3).join(' | '));

    await d.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 180) + ']', false);
    try { await d.close(); } catch (e2) { }
    done();
  }
})();
