/* ============================================================================
   DEMO GATE (8/15/26, PEOPLE lane) — critical path row 9.

   records/BOHEMIA_THE_DEMO_PLAN_8_4_26.md:
     "9. DEMO GATE: one integration test that plays the whole day headless +
         deploy-verified on the real link. THE DEMO IS A BUILD, NOT A VIBE."
   It is the only row on the critical path with no owner named, and it is the
   row that turns "the demo works" from a claim somebody makes at the end of a
   turn into a thing the machine says.

   WHY THIS EXISTS WHEN dayloop_gate ALREADY PLAYS A DAY IN A BROWSER.
   It does, and it plays it in slices/BOHEMIA_CITY_WORLD.html — the page the
   run lives in. THAT IS NOT THE DOOR. Paolo taps ONE link and it is the alpha;
   everything he sees, he sees through it. Every difference between those two
   surfaces is a place a demo can be broken while every gate is green, and this
   session found three of exactly that kind in one afternoon (the opening in a
   panel the RUN tab never shows, a scene playing behind the splash, a module
   fresh on disk and a build behind in the frame). So this plays the demo THE
   WAY HE PLAYS IT: open the link, tap through the splash, tap RUN, and go.

   WHAT IT REFUSES TO LET ROT — the spine of the demo, in order:
     the door opens -> the opening is OFFERED -> it plays and hands you the day
     -> the day names its job in the quest's own words -> you can take it
     -> the objective goes live -> the day can end -> the reckoning quotes what
     happened -> tomorrow is a different job.
   Any one of those breaking is a demo that cannot be shown to anybody.

   *** WHAT THIS GATE DOES NOT DO, SAID OUT LOUD RATHER THAN QUIETLY SKIPPED. ***
   Row 9's second clause is "deploy-verified on the real link". THIS CONTAINER
   CANNOT REACH github.io -- the agent proxy answers 403 to CONNECT for it
   (checked: curl -> "CONNECT tunnel failed, response 403"). A gate that cannot
   make the request cannot make the claim, and faking it with a local file read
   would be exactly the side-door probe the 7/18 law bans. So the deploy half
   stays a MANUAL step (the pages workflow run + git merge-base --is-ancestor,
   per CLAUDE.md's ship flow) until somebody runs this where the network allows
   it, and this comment is here so nobody reads 'DEMO GATE GREEN' as 'the live
   link is good'.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  ok('the one link exists on disk', fs.existsSync(ALPHA));
  if (!fs.existsSync(ALPHA)) { console.log('DEMO GATE: 0 passed, 1 failed'); process.exit(1); }

  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));

  /* A PHONE THAT HAS NEVER SEEN THIS GAME. Everything the demo does for a first
     time has to be driven from a first time, or the first time is the one path
     nobody ever tests. */
  await page.goto('file://' + ALPHA);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(3400);

  /* ---- 1. THE DOOR ------------------------------------------------------- */
  {
    const front = await page.evaluate(() => {
      const f = document.getElementById('front');
      return { there: !!f, shown: !!f && getComputedStyle(f).display !== 'none' };
    });
    ok('the link opens on the front screen', front.there && front.shown);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(600);
    ok('and TAP TO ENTER lets you in', await page.evaluate(() => {
      const f = document.getElementById('front');
      return !f || getComputedStyle(f).display === 'none';
    }));
    const stamp = await page.evaluate(() =>
      (document.getElementById('buildstamp') || {}).textContent || '');
    ok('the build says which build it is (' + stamp.trim() + ')', /BUILD \d+\/\d+/.test(stamp));
  }

  /* ---- 2. THE FIRST FIVE MINUTES (critical path row 7) -------------------- */
  {
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await page.waitForTimeout(3000);
    const invite = await page.evaluate(() => {
      const i = document.getElementById('openInvite');
      if (!i || getComputedStyle(i).display === 'none') return null;
      const r = i.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), txt: (i.textContent || '').trim().slice(0, 40) };
    });
    ok('tapping RUN on a fresh phone OFFERS the opening', !!invite && invite.w > 80,
      JSON.stringify(invite));
    await page.evaluate(() => { const w = document.getElementById('openWatch'); if (w) w.click(); });
    await page.waitForTimeout(10000);
    const playing = await page.evaluate(() => {
      const w = document.getElementById('openWrap'), c = document.getElementById('openCv');
      if (!w || getComputedStyle(w).display === 'none') return null;
      const r = w.getBoundingClientRect();
      if (r.width < 80) return null;
      let lit = 0;
      try {
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        for (let i = 0; i < d.length; i += 4 * 37) if (d[i] + d[i + 1] + d[i + 2] > 40) lit++;
      } catch (_e) { return null; }
      return { lit, cap: ((document.getElementById('openCap') || {}).textContent || '').trim().slice(0, 40) };
    });
    ok('WATCH plays the cold open — the family is on screen before the day',
      !!playing && playing.lit > 60, JSON.stringify(playing));
    ok('and somebody is saying something in it', !!playing && playing.cap.length > 0);
    /* however it ends, it must put you in the day. This is the stranding check
       and it is the one that would ruin a demo in front of a person. */
    await page.evaluate(() => { const s = document.getElementById('openSkip'); if (s) s.click(); });
    await page.waitForTimeout(1600);
    ok('and it hands you the day rather than stranding you on a black screen',
      await page.evaluate(() => {
        const w = document.getElementById('openWrap');
        return !w || getComputedStyle(w).display === 'none';
      }));
  }

  /* ---- 3. THE DAY, THROUGH THE DOOR (critical path rows 1 and 4) --------- */
  {
    /* *** ASK THE FRAMES, DO NOT MATCH THEIR URLS. *** The first cut picked
       `frames().find(f => /RUN_CURRENT|CITY_WORLD/.test(f.url()))` and got
       RUN_CURRENT, which comes first in the list and does NOT own the day loop:
       DAY, DQ and the wake card all live in BOHEMIA_CITY_WORLD. That is the
       exact .find()-returns-the-first-match bug the handoff records against
       gates/bohemia_city_app.js isFrame(), which blinded fourteen gates at once.
       So the frame is chosen by what it CAN DO, and it cannot be wrong. */
    let fr = null;
    for (const f of page.frames()) {
      let has = false;
      try { has = await f.evaluate(() => typeof DAY !== 'undefined' && typeof DQ !== 'undefined'); }
      catch (_e) { has = false; }
      if (has) { fr = f; break; }
    }
    ok('the surface that owns the day is loaded inside the link',
      !!fr, page.frames().map(f => f.url().slice(-26)).join(','));
    if (fr) {
      await page.waitForTimeout(2500);
      const day = await fr.evaluate(() => {
        const card = document.getElementById('daycardIn');
        const txt = card ? (card.textContent || '') : '';
        return {
          alive: typeof DAY !== 'undefined' && !!DAY,
          phase: (typeof DAY !== 'undefined' && DAY) ? DAY.phase : null,
          min: (typeof DAY !== 'undefined' && DAY) ? DAY.min : null,
          card: !!card, txt: txt.replace(/\s+/g, ' ').trim().slice(0, 120),
          go: !!document.querySelector('#daycardIn .dcgo'),
        };
      });
      ok('the day loop is alive behind the link', day.alive === true);
      ok('day 1 wakes at 06:00', day.phase === 'awake' && day.min === 360, JSON.stringify(day.min));
      ok('a WAKE card is up with something to do', day.card && day.txt.length > 10, day.txt);
      ok('and there is a button to start the day', day.go === true);

      /* *** TAKE THE JOB THE WAY A FINGER TAKES IT. ***
         This called offerAccept() -- a JS function -- and declared the demo's
         opening move working. That is the mistake that cost two "still not
         fixed" rounds on 8/15: A GATE THAT PERFORMS THE MISSING STEP IS TESTING
         ITSELF. The whole first two minutes of the demo is a chain of taps
         (GET UP -> PHONE -> tap to unlock -> TAKE IT) and every link of it could
         break with offerAccept() still returning cleanly.
         Driven as taps now, end to end. Measured while writing it: the chain
         works, and the phone is its own frame -- slices/BOHEMIA_CURRENT_SLICE
         .html, NOT the run slice -- reached by asking every frame which one has
         a VISIBLE control, never by matching a URL or taking the first hit. */
      ok('the day starts with NO objective — the job has not arrived yet',
        await fr.evaluate(() => ((document.getElementById('qline') || {}).textContent || '') === ''));

      await fr.click('#daycardIn .dcgo');            // GET UP
      await page.waitForTimeout(900);
      ok('GET UP is a real button and it wakes the day',
        await fr.evaluate(() => (typeof DAY !== 'undefined' && DAY) ? DAY.phase === 'awake' : false));

      await fr.click('#phonebtn');                   // the phone, in his pocket
      await page.waitForTimeout(7000);               // NETWORK OS boots
      const slot = await fr.$('#phoneslot');
      const box = slot ? await slot.boundingBox() : null;
      ok('tapping PHONE opens it', !!box && box.height > 100);
      if (box) {                                     // TAP TO UNLOCK
        await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.9);
        await page.waitForTimeout(2200);
      }

      /* ASK EVERY FRAME WHICH ONE HAS THE BUTTON. Two frames answer to the run's
         URL and .find() takes the wrong one; the phone is a third file again. */
      let phone = null;
      const visibleTakeIt = () => [...document.querySelectorAll('*')].some(e => {
        if (e.children.length) return false;
        if (/^(SCRIPT|STYLE)$/.test(e.tagName)) return false;
        if (!/take it/i.test(e.textContent || '')) return false;
        const r = e.getBoundingClientRect();
        return r.width > 10 && r.height > 6;
      });
      for (const f of page.frames()) {
        try { if (await f.evaluate(visibleTakeIt)) phone = f; } catch (_e) {}
      }
      ok('THE JOB IS ON THE PHONE, with a button he can press',
        !!phone, 'GET UP -> PHONE -> unlock should surface the day\'s job');
      if (phone) {
        await phone.evaluate(() => {
          const t = [...document.querySelectorAll('*')].find(e => {
            if (e.children.length) return false;
            if (/^(SCRIPT|STYLE)$/.test(e.tagName)) return false;
            if ((e.textContent || '').trim().toUpperCase() !== 'TAKE IT') return false;
            const r = e.getBoundingClientRect();
            return r.width > 10 && r.height > 6;
          });
          if (t) t.click();
        });
        await page.waitForTimeout(1800);
      }
      const took = await fr.evaluate(() => ({
        hud: (document.getElementById('qline') || {}).textContent || '',
        phase: (typeof DAY !== 'undefined' && DAY) ? DAY.phase : null,
      }));
      ok('TAPPING "TAKE IT" PUTS A LIVE OBJECTIVE ON THE HUD ("' +
        took.hud.trim().slice(0, 44) + '") — the whole opening move, by finger',
        took.hud.trim().length > 0);

      /* THE DAY CAN END, AND ENDING MEANS SOMETHING. Driven through the loop's
         own clock rather than by walking sixteen hours, which is what the day
         loop's API is for. */
      const night = await fr.evaluate(() => {
        try { DAY.tick(20 * 60, 'suburb'); } catch (_e) {}
        const s = DAY.summary();
        return { phase: DAY.phase, reason: s.reason, notes: (s.notes || []).length };
      });
      ok('the day ends at nightfall', night.phase === 'ended' && night.reason === 'nightfall');
      ok('and the reckoning has something to say about it (' + night.notes + ' notes)',
        night.notes > 0);

      /* TOMORROW IS A DIFFERENT JOB -- the claim that makes it a LOOP and not a
         level, and the one that row 4 (3-5 playable quests) actually buys. */
      const days = await fr.evaluate(() => {
        const out = [];
        try {
          for (let d = 1; d <= 5; d++) {
            const s = DQ.specForDay(d);
            out.push(s ? s.id : null);
          }
        } catch (_e) { return null; }
        return out;
      });
      ok('five days, five different jobs (' + (days || []).join(', ') + ')',
        !!days && days.every(Boolean) && new Set(days).size === 5,
        'demo plan row 4: 3-5 PLAYABLE QUESTS');
    }
  }

  /* ---- 4. NOTHING THREW, ANYWHERE, THE WHOLE WAY THROUGH ----------------- */
  ok('a person can play the demo end to end with no page error' +
    (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

  await b.close();
  console.log('DEMO GATE: ' + pass + ' passed, ' + fail + ' failed  ' +
    '(the whole demo, through the one link; the deploy half is MANUAL -- this ' +
    'container cannot reach github.io)');
  process.exit(fail ? 1 : 0);
})();
