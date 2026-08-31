const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   OPENING GATE (8/14/26, PEOPLE lane)

   THE DEMO PLAN HAS TWO ROWS FOR THIS AND NEITHER WAS DONE.
   records/BOHEMIA_THE_DEMO_PLAN_8_4_26.md, THE CRITICAL PATH:
     "7.  THE FIRST FIVE MINUTES: an opening that needs zero explanation -- the
          scripted-scene runtime (PEOPLE 0sc) playing a minimal cold open, or a
          clean wake-up-and-go if the cold open isn't ready."
     "10. THE COLD OPEN SCENE (PEOPLE 0sc scripted-scene runtime + RUN consumes"
   The runtime shipped 8/9, the scene shipped, the CUTSCENE tab shipped and is
   gated forty claims deep -- and the run booted straight into wakeInBed(),
   which is that row's own FALLBACK. Measured: zero references to the scene
   runtime anywhere in the run source. The demo's first five minutes was the
   fallback the whole time while the real opening sat one tab away.

   SO THIS GATE ASKS THE ONE QUESTION A FILE-READING GATE CANNOT: when somebody
   with no save taps RUN, does the cold open actually happen to them? It boots
   the real alpha, clears the flags a fresh phone would not have, taps the tab
   Paolo taps, and watches for pixels.

   AND IT CHECKS THE THREE WAYS THIS FEATURE COULD BE WORSE THAN NOT SHIPPING:
     - it plays for somebody mid-save (you are not at the beginning of the story)
     - it plays a second time (a demo player watching the intro every morning)
     - it strands somebody on a black screen with no way into the day
   The last one is why SKIP is checked before anything else.

   IT MUST PLAY WHAT HE DIRECTED. The 8/12 law says every system he rules on
   ships with an instrument; DIRECT was that instrument and it was only half
   wired, because the thing it edits was a tab nobody's run ever entered. The
   opening reads DIR['scene:<id>'] before canon, and this drives that for real:
   plant an edited line, boot, and demand the edited words on screen.
   ========================================================================== */
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

/* ---- 1. THE FALLBACK IS STILL THERE, which is the honest half of row 7 ---- */
{
  const runSrc = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
  ok('the run still wakes you in your own bed — the opening is a door, not a replacement',
    fs.existsSync(runSrc) && /function wakeInBed/.test(fs.readFileSync(runSrc, 'utf8')));
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  async function boot(seed) {
    const page = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    /* *** THE SEQUENCE ASKS THE PLAYER A QUESTION NOW, SO THIS GATE HAS TO ANSWER IT.
       (8/30, THE CUT ASKS WHO YOU BECAME.) *** The face maker sits on the match-cut: the
       scene HOLDS on the first frame of the adult and waits for THIS IS ME. That is right
       for a person -- they may spend five minutes on a head -- and it hangs a headless
       run forever, because a gate is the one player who never taps. Answering it is not
       weakening the proof, it is the gate learning a step that is now part of the
       sequence it exists to prove.
       IT IS AN INIT SCRIPT, NOT A PATCH AT EACH WAIT. This file plays the opening from
       several places, and a fix applied at one of them leaves the others hanging -- which
       is exactly what the first two attempts did. One standing rule on the page, applied
       to every play-through, is the honest simulation: A PLAYER WHO ALWAYS PRESSES THE
       BUTTON. If the beat is ever moved or removed in DIRECT this simply never fires.
       (Two earlier attempts are worth remembering. Putting the tap inside SETTLE's extra
       condition did nothing, because hold() deliberately leaves the room ANIMATING and
       SETTLE polls for STILLNESS -- A WAIT THAT POLLS FOR STILLNESS CANNOT WAIT FOR
       SOMETHING THAT MOVES. And a bounded loop that also polled "has the last scene
       played" exited on ITERATION ZERO whenever lastId was null, because the check reads
       `!id || ...` -- A LOOP THAT CAN EXIT ON A NULL IS NOT A WAIT.) */
    await page.addInitScript(() => {
      setInterval(function () {
        var b = document.getElementById('becomeDone'); if (b) b.click();
      }, 400);
    });
    await page.goto('file://' + ALPHA);
    await page.evaluate(seed || (() => {
      localStorage.removeItem('bohemia.opening.seen.v1');
      localStorage.removeItem('bohemia.save.v1');
    }));
    await page.reload();
    await SETTLE(page, 3200);
    return { page, errs };
  }
  /* ENTER THE WAY A PERSON ENTERS. The first cut clicked the RUN tab straight
     through the TAP TO ENTER splash -- which a finger cannot do, because #front
     is fixed at z-index 200 over the whole page. Every DOM check passed and the
     screenshot was the splash: the scene was playing behind it. */
  const frontUp = p => p.evaluate(() => {
    const f = document.getElementById('front');
    return !!f && getComputedStyle(f).display !== 'none';
  });
  async function enter(page) {
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 400);
  }
  async function tapRun(page) {
    const _runTab = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false;
      t.click(); return true;
    });
    ok('the RUN tab exists in the alpha and was tapped', _runTab === true);
  }
  /* PIXELS, not a style attribute. A display:flex on an empty canvas is not an
     opening; the claim is that somebody SEES the family at the table. */
  async function painted(page) {
    return page.evaluate(() => {
      const c = document.getElementById('openCv');
      if (!c) return 0;
      try {
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let lit = 0;
        for (let i = 0; i < d.length; i += 4 * 37) if (d[i] + d[i + 1] + d[i + 2] > 40) lit++;
        return lit;
      } catch (_e) { return -1; }
    });
  }
  /* *** display:flex IS NOT VISIBLE, AND THAT LIE COST AN HOUR. *** The overlay
     shipped inside p-run, and the RUN tab does not show p-run -- since Paolo's
     7/28 "put the city in the run tab" the switcher routes run -> p-city and
     leaves the run iframe parked in a hidden panel so postMessage still finds
     it. A flex child of a display:none parent still COMPUTES display:flex, so
     this check said yes, the canvas really was painting, the captions really
     were advancing, and the bounding box was 0x0. The screenshot was the only
     thing that told the truth.
     SO THE CLAIM IS AREA, NOT STYLE: a thing with no width is a thing nobody
     sees, whatever its computed display says. */
  const shown = p => p.evaluate(() => {
    const w = document.getElementById('openWrap');
    if (!w || getComputedStyle(w).display === 'none') return false;
    const r = w.getBoundingClientRect();
    return r.width > 80 && r.height > 80;
  });

  /* ---- 2. A FRESH PLAYER GETS THE COLD OPEN ---- */
  {
    const { page, errs } = await boot();
    ok('the overlay exists in the alpha at all', await page.$('#openWrap') !== null);
    ok('and it is HIDDEN before the run is opened — it must not cover the splash',
      !(await shown(page)));
    /* *** IT MUST NOT PLAY BEHIND THE TAP TO ENTER SCREEN. *** This is the claim
       a screenshot caught and the DOM could not: overlay shown, canvas painted,
       captions advancing, and the human looking at the splash the whole time. */
    ok('the front screen is still up before anybody enters', await frontUp(page));
    await tapRun(page);
    await SETTLE(page, 5000);
    ok('THE OPENING DOES NOT BURN THROUGH BEHIND THE SPLASH — it waits for the door',
      !(await shown(page)), 'a scene nobody can see is a scene that did not happen');
    ok('and it does not even OFFER itself from behind the splash',
      await page.evaluate(() => {
        const i = document.getElementById('openInvite');
        return !i || getComputedStyle(i).display === 'none';
      }));
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 2500);
    /* IT INVITES, IT DOES NOT AMBUSH. Auto-playing on a tab tap trampled three
       other lanes' gates (NAV CLUSTER lost the canvas, both voice gates lost
       their utterance counts) and was wrong for him anyway on a sixteen-tab
       surface he taps all day. The claim is that a fresh player is OFFERED it. */
    const invited = await page.evaluate(() => {
      const i = document.getElementById('openInvite');
      if (!i || getComputedStyle(i).display === 'none') return false;
      const r = i.getBoundingClientRect();
      return r.width > 80 && r.height > 20;
    });
    ok('TAPPING RUN WITH NO DAY IN PROGRESS OFFERS THE OPENING', invited);
    ok('and it has NOT seized the screen — the run is playable underneath',
      !(await shown(page)), 'a cutscene that takes the screen because you changed tabs is a thing you learn to dread');
    await page.evaluate(() => { const w = document.getElementById('openWatch'); if (w) w.click(); });
    /* WAIT FOR THE PIXELS, NOT FOR QUIET (8/21). This was a literal 9-second
       sleep and the sleep-killing pass replaced it with SETTLE's default
       quiescence rule -- WHICH CANNOT SEE A CUTSCENE. A MutationObserver counts
       DOM changes and PAINTING A CANVAS MUTATES NO DOM, so the page went "quiet"
       before the opening had drawn a frame and "it is DRAWING" reported 0 lit
       samples on a cutscene that plays perfectly. Proved both ways: restore the
       literal sleep and the same claim passes, 24/0.

       IT IS A RACE, WHICH IS WHY IT LOOKED LIKE SOMEBODY ELSE'S BUG. This gate
       read 24/0 in the morning and 23/1 in the evening on a tree whose only
       relevant difference was load, and the handoff recorded it as "arrived with
       main, verified by reverting my edit" -- a verification that reverted the
       WRONG edit, because the settle conversion had already been committed. The
       correction is in records/BOHEMIA_THE_WHOLE_DEMO_PLAYS_8_21_26.md.

       SECOND INSTANCE OF A TRAP THIS LANE DOCUMENTED IN bohemia_settle.js THE
       DAY BEFORE (navcluster's portrait was the first). The fix is the one that
       docstring already names: when the gate knows what it is waiting for, pass
       the CONDITION. Here it is literally the next line's assertion. */
    await SETTLE(page, 9000, async () => (await painted(page)) > 0);
    ok('TAPPING WATCH PLAYS THE OPENING', await shown(page));
    const lit = await painted(page);
    ok('and it is DRAWING — the family is on screen, not an empty canvas (' + lit + ' lit samples)',
      lit > 60, 'pixels sampled off the real canvas');
    /* and it must be in the panel the RUN tab ACTUALLY routes to, whatever that
       panel is called this month. Read, never assumed. */
    const host = await page.evaluate(() => {
      const w = document.getElementById('openWrap');
      const live = document.querySelector('.panel.on');
      return { parent: w && w.parentElement && w.parentElement.id, live: live && live.id };
    });
    ok('the overlay is inside the panel the RUN tab actually shows (' + host.parent + ')',
      !!host.parent && host.parent === host.live,
      'run routes to ' + host.live + ', not p-run — 7/28 "put the city in the run tab"');
    const cap = await page.evaluate(() => (document.getElementById('openCap') || {}).textContent || '');
    ok('and the caption is saying something (' + JSON.stringify(cap.slice(0, 34)) + ')', cap.trim().length > 0);
    ok('SKIP is on screen from the first frame — he will watch this a hundred times',
      await page.evaluate(() => {
        const s = document.getElementById('openSkip');
        return !!s && getComputedStyle(s).display !== 'none';
      }));
    /* THE STRANDING CHECK. Whatever else is true, there must be a way into the
       day. Clicked through the DOM rather than page.click(): a Playwright click
       throws on a hidden element and the throw killed the whole gate before it
       could report the claims above it. A gate that dies instead of failing
       tells you nothing about the other fifteen things it was going to check. */
    await page.evaluate(() => { const s = document.getElementById('openSkip'); if (s) s.click(); });
    await SETTLE(page, 1600);
    ok('SKIP puts you in the day — nobody is ever stranded on a black rectangle',
      !(await shown(page)));
    ok('and skipping counts as seen, so it does not ambush you again on the next tab tap',
      await page.evaluate(() => !!localStorage.getItem('bohemia.opening.seen.v1')));
    ok('the alpha booted clean', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  }

  /* ---- 3. IT DOES NOT PLAY WHEN IT WOULD BE WRONG ---- */
  {
    const { page } = await boot(() => {
      localStorage.removeItem('bohemia.opening.seen.v1');
      /* a REAL save: a labelled one, past turn 0. Not the auto:start the run
         writes on boot before anybody has done anything -- see below. */
      localStorage.setItem('bohemia.save.v1', JSON.stringify(
        [{ label: 'sleep', beat: 4200, engine: { turn: 9 } }]));
    });
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 4500);
    const inv = p => p.evaluate(() => {
      const i = document.getElementById('openInvite');
      return !!i && getComputedStyle(i).display !== 'none';
    });
    ok('A PLAYER WITH A SAVE IS NOT EVEN OFFERED THE BEGINNING — they are mid-story',
      !(await shown(page)) && !(await inv(page)));
    await page.close();
  }
  {
    const { page } = await boot(() => {
      localStorage.setItem('bohemia.opening.seen.v1', '1');
      localStorage.removeItem('bohemia.save.v1');
    });
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 4500);
    ok('and somebody who has already seen it is never asked again',
      !(await shown(page)) && !(await page.evaluate(() => {
        const i = document.getElementById('openInvite');
        return !!i && getComputedStyle(i).display !== 'none';
      })));
    await page.close();
  }

  /* ---- 4. IT PLAYS *HIS* VERSION (the 8/12 law, closing its loop) ---- */
  {
    const MINE = 'THIS IS THE DIRECTED LINE AND IT MUST REACH THE OPENING';
    const { page } = await boot();
    const planted = await page.evaluate((mine) => {
      /* the DIRECT tab's own store, edited the way DIRECT edits it */
      const all = window.BOHEMIA_CUTSCENES || [];
      const c = all.find(s => s.scene && /cold_open/.test(String(s.scene.id || ''))) || all[0];
      if (!c) return false;
      const copy = JSON.parse(JSON.stringify(c.scene));
      const say = (copy.beats || []).filter(bt => bt.kind === 'say' && bt.text);
      if (!say.length) return false;
      say[0].text = mine;
      /* WRITE THROUGH THE PAGE'S OWN KEY, never a retyped string. The first cut
         guessed 'bohemia.direct.v1' and the DIRECT tab actually uses
         'bohemia_direct_v1' -- so the plant landed nowhere, the opening
         correctly served canon, and the gate blamed the feature. A gate that
         retypes a constant is testing its own typo. */
      const key = (typeof DIR_KEY !== 'undefined') ? DIR_KEY : null;
      if (!key) return false;
      const store = {}; store['scene:' + c.scene.id] = copy;
      localStorage.setItem(key, JSON.stringify(store));
      return true;
    }, MINE);
    ok('a directed edit can be planted the way the DIRECT tab plants one', planted);
    await page.reload();
    await SETTLE(page, 3200);
    /* DIRECT may key its store differently; read what the page itself resolves */
    const resolves = await page.evaluate(() => {
      try {
        if (typeof openScene !== 'function') return 'no openScene';
        const s = openScene();
        const say = (s.beats || []).filter(b => b.kind === 'say' && b.text);
        return say.length ? say[0].text : 'no say beat';
      } catch (e) { return 'threw: ' + e.message; }
    });
    ok('THE OPENING RESOLVES HIS DIRECTED SCENE, not the shipped one — what he edits in DIRECT is what the game opens with',
      resolves === MINE, JSON.stringify(String(resolves).slice(0, 60)));
    await page.close();
  }

  /* ---- 5. IT PLAYS TO THE END BY ITSELF, AND IT HANDS YOU SOMEWHERE -------
     *** EVERY GATE THAT HAS EVER TOUCHED THIS SCENE TAPPED SKIP. *** Swept 8/25:
     four gates reach the cold open -- this one above, demo_gate, one_valley_gate,
     run_gate -- and every single one of them clicks #openSkip within a few
     seconds of it starting. So "the demo's opening plays" rested on four gates
     proving it STARTS and nobody, ever, proving it FINISHES. The demo plan calls
     row 7 THE FIRST FIVE MINUTES, not the first five seconds.

     WHAT THAT LEFT UNCHECKED IS NOT SMALL. Whether it advances past its first
     caption at all. Whether the lines he directed reach the screen or stop three
     beats in. Whether the ten-years cut lands. Whether WATCHING it (rather than
     skipping it) counts as seen -- if only the skip marked it, the one person
     patient enough to sit through the whole opening is the one person it ambushes
     again every morning. Whether it throws halfway. And where a human is standing
     when it stops. Every one of those could have been broken all week with this
     gate green, because the gate never let the scene get past its opening frame.

     EVERYTHING HERE IS DERIVED FROM THE SCENE, NEVER TYPED IN. The line list, the
     beat count, the cut and the handoff all come out of openScene() at runtime --
     the same call the game makes, so it already carries his DIRECT edits and a
     rewrite in the DIRECT tab moves the spec instead of breaking the gate. An
     assertion that pins today's captions fails the morning he improves one, and
     this lane has now paid for that exact mistake five times. */
  {
    const { page, errs } = await boot();
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 2500);

    const scene = await page.evaluate(() => {
      try {
        const s = (typeof openScene === 'function') ? openScene() : null;
        if (!s) return null;
        const beats = s.beats || [];
        return {
          id: String(s.id || ''),
          beats: beats.length,
          say: beats.filter(b => b.kind === 'say' && b.text).map(b => String(b.text)),
          cuts: beats.filter(b => b.kind === 'cut').length,
          handoff: beats.find(b => b.kind === 'handoff') || null
        };
      } catch (_e) { return null; }
    });
    ok('the page resolves an opening scene with lines in it (' +
      (scene ? scene.beats + ' beats, ' + scene.say.length + ' lines' : 'none') + ')',
      !!scene && scene.beats > 0 && scene.say.length > 0);

    /* WATCH THE ELEMENT HE READS. A poll would drop any beat shorter than its
       interval and then report a line as never shown; an observer on the real
       caption node cannot miss a write to it. It is also the surface itself --
       the words in #openCap are literally what a person sees. */
    await page.evaluate(() => {
      window.__CAPS = []; window.__SCENES = [];
      const cap = document.getElementById('openCap'); if (!cap) return;
      const push = () => {
        const t = (cap.textContent || '').trim();
        if (t && window.__CAPS[window.__CAPS.length - 1] !== t) window.__CAPS.push(t);
        /* which scene of the sequence is speaking, sampled off the same event.
           A sequence that plays one scene four times is not a sequence. */
        try {
          const id = OPEN_PLAYER && OPEN_PLAYER.scene && OPEN_PLAYER.scene.id;
          if (id && window.__SCENES[window.__SCENES.length - 1] !== id) window.__SCENES.push(id);
        } catch (_x) {}
      };
      push();
      new MutationObserver(push).observe(cap, { childList: true, subtree: true, characterData: true });
    });

    await page.evaluate(() => { const w = document.getElementById('openWatch'); if (w) w.click(); });
    const ran = await page.evaluate(() =>
      typeof OPEN_RUNNING !== 'undefined' && OPEN_RUNNING === true);
    ok('WATCH puts the runtime in play', ran);

    /* *** NOTHING IN THIS BLOCK TAPS SKIP. That is the entire point of it. ***
       The ceiling is a demo claim, not a tuning number: an opening somebody
       cannot sit through is broken for a demo whatever else is true of it. */
    const shownNow = () => page.evaluate(() => {
      const w = document.getElementById('openWrap');
      return !!w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 80;
    });
    const took = await SETTLE(page, 150000, async () =>
      (await page.evaluate(() => typeof OPEN_RUNNING !== 'undefined' && OPEN_RUNNING === false))
      && !(await shownNow()));

    const played = await page.evaluate(() => {
      const on = document.querySelector('.panel.on');
      const r = on ? on.getBoundingClientRect() : null;
      const w = document.getElementById('openWrap');
      const tab = document.querySelector('.tab.on');
      return {
        caps: (window.__CAPS || []).slice(),
        running: (typeof OPEN_RUNNING !== 'undefined') ? OPEN_RUNNING : null,
        overlay: !!w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 80,
        w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0,
        landed: tab ? String(tab.dataset.p || '') : null,
        seen: !!localStorage.getItem('bohemia.opening.seen.v1')
      };
    });

    /* `ran &&` IS NOT DECORATION, IT CLOSES A VACUOUS PASS IN THIS GATE'S OWN
       HEADLINE CLAIM. "not showing and not running" is also true of a scene that
       NEVER STARTED, so stub openStart and the loudest assertion here would have
       gone green on an opening that did nothing at all. Found by asking what each
       new claim would do under a mutation rather than by watching it pass. */
    ok('THE OPENING PLAYS ALL THE WAY TO ITS END ON ITS OWN - nobody tapped SKIP (' +
      Math.round(took / 1000) + 's)', ran && !played.overlay && played.running === false,
      'if this is the first red here, the scene froze or never reached its last beat');
    ok('and it is over inside two and a half minutes - row 7 is THE FIRST FIVE MINUTES',
      took < 150000);
    ok('the caption is not frozen on its first line (' + played.caps.length + ' captions)',
      played.caps.length > 1);

    /* {tokens} are substituted at play time ({sibling_lost} becomes a name), so
       the literal halves either side of one are what a gate can honestly demand.
       Asking for the raw authored string would fail on a correct substitution. */
    const litOf = t => String(t).split(/\{[^}]*\}/).map(s => s.trim()).filter(s => s.length > 3);
    /* the scenes the sequence names, in order, walked on the page. Shared by the
       post-fight claims and the chain walk below so both read one source. */
    const chainOf = async startId => await page.evaluate(id0 => {
      const out = []; let id = id0, seen = {}, g = 0;
      while (id && !seen[id] && g++ < 20) {
        seen[id] = 1; out.push(id);
        const s = (typeof openSceneById === 'function') ? openSceneById(id) : null;
        if (!s) break;
        const h = (s.beats || []).find(b => b.kind === 'handoff');
        id = h ? (h.then || (h.to === 'scene' ? h.scene : null)) : null;
      }
      return out;
    }, startId);
    const stream = played.caps.join('\n');
    const missing = (scene ? scene.say : []).filter(t => {
      const frags = litOf(t);
      return frags.length ? !frags.every(f => stream.indexOf(f) >= 0) : false;
    });
    ok('EVERY LINE THE SCENE AUTHORS REACHES THE SCREEN (' +
      ((scene ? scene.say.length : 0) - missing.length) + '/' + (scene ? scene.say.length : 0) + ')',
      !!scene && missing.length === 0, JSON.stringify(missing.slice(0, 2)));

    const nameless = (scene ? scene.say : []).filter(t => {
      const f = litOf(t)[0]; if (!f) return false;
      const hit = played.caps.find(c => c.indexOf(f) >= 0);
      return !hit || hit.indexOf(f) === 0;      /* nothing printed ahead of the words */
    });
    ok('and every line arrives with a name on it - he can tell who is talking',
      nameless.length === 0, JSON.stringify(nameless.slice(0, 2)));

    /* the time cards are the captions that carry no authored line. A scene with
       a cut in it must show more than one of them, or the ten-years jump exists
       only in the script. Derived from the cut beat, so a scene without one is
       not held to it. */
    const cards = played.caps.filter(c => !(scene ? scene.say : []).some(t => {
      const f = litOf(t)[0]; return f && c.indexOf(f) >= 0;
    }));
    const laterCards = Array.from(new Set(cards)).filter(c => c !== played.caps[0]);
    ok('THE TIME CARD CHANGES - the ten-year jump is on screen, not just in the script (' +
      JSON.stringify(laterCards.slice(0, 3)) + ')',
      !scene || scene.cuts === 0 || laterCards.length >= 2);

    /* *** THE FLAG IS NOT SPENT IN THE MIDDLE OF THE STORY. ***
       This claim used to read "watching it through counts as seen" and sampled
       HERE, at the handoff to the raid -- which passed only because openRaid was
       marking the opening seen roughly 65 seconds in, with three of its four
       scenes still unplayed. MEASURED 8/25: close the app during the grief dinner
       and come back, and you are not offered it, nothing plays, the flag is spent,
       and the last room, the grief dinner and the burial are GONE. The claim was
       encoding the bug.
       So it now guards the fix instead: A STORY THAT IS NOT OVER HAS NOT BEEN
       SEEN. Whoever re-adds openMarkSeen to the raid path turns this red. The
       original meaning is kept, correctly sampled, by "having watched the whole
       thing, it never asks again" at the end of this block. */
    ok('THE SEEN FLAG IS NOT SPENT MID SEQUENCE - the story is not over yet',
      played.seen === false,
      'marking it seen at the raid throws away every scene after the fight for anybody who stops');
    ok('and it leaves you on a live surface with real area, not a black rectangle (' +
      played.w + 'x' + played.h + ')', played.w > 200 && played.h > 200);

    /* THE SEAM BETWEEN TWO LANES. The scene names a function COMBAT publishes;
       the name is read out of the scene and looked up on the page, so a rename on
       either side turns this red instead of silently ending the opening early --
       which is the failure that hid the raid for twelve days. */
    const seam = await page.evaluate(h => {
      if (!h) return 'no handoff';
      if (h.to === 'combat' && h.call) return typeof window[h.call];
      if (h.to === 'scene' && h.scene)
        return (typeof openSceneById === 'function' && openSceneById(h.scene)) ? 'function' : 'missing scene';
      return 'unknown';
    }, scene ? scene.handoff : null);
    ok('the scene\'s handoff names something the page can actually call (' + seam + ')',
      seam === 'function' || seam === 'no handoff',
      'two lanes building halves that never meet is this repo\'s most expensive recurring bug');

    /* AND IT WENT THERE. Read off the alpha own switcher contract -- showTabPanel
       sets .tab.on by data-p -- and compared against what the SCENE says it hands
       off to. No panel id is typed in here, so the claim survives a rename of the
       panels and follows a rewrite of the handoff. */
    const hasTab = await page.evaluate(to =>
      !!to && !!document.querySelector('.tab[data-p="' + to + '"]'),
      scene && scene.handoff ? scene.handoff.to : null);
    ok('AND IT ACTUALLY TOOK YOU THERE - the live tab is the one the scene hands off to (' +
      played.landed + ')',
      !hasTab || played.landed === String(scene.handoff.to),
      'the scene ends by handing the player to ' + (scene && scene.handoff ? scene.handoff.to : '-'));

    /* ---- THE WHOLE SEQUENCE, NOT JUST ITS FIRST LINK ----------------------
       laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md is explicit that this
       is ONE UNBROKEN SEQUENCE: "1. NIGHT RAID ... 2. THE GRIEF DINNER ... 3. THE
       BURIAL ON THE RIDGE (tutorial ends here)." Authored as four scenes chained
       by their own handoff beats. Everything above proves the FIRST link plays; a
       gate cannot win the tutorial fight to reach the rest of it, and should not
       pretend to.

       WHAT IT CAN DO IS WALK THE CHAIN, and that is exactly where the 8/19 bug
       lived: startColdOpen sat in the alpha for twelve days with one occurrence
       and zero callers, so the death the whole opening is built on never happened
       and the grief dinner mourned nobody. A NAME THAT RESOLVES TO NOTHING LOOKS
       IDENTICAL TO A FINISHED SEQUENCE AT RUNTIME -- openContinue just returns
       false and the opening quietly ends early. So every link is looked up on the
       page the game actually runs in, and a broken one is named out loud. */
    const chain = await page.evaluate(startId => {
      const out = [], seen = {};
      let id = startId, guard = 0;
      while (id && !seen[id] && guard++ < 20) {
        seen[id] = 1;
        const s = (typeof openSceneById === 'function') ? openSceneById(id) : null;
        if (!s) { out.push({ id, missing: true }); break; }
        const beats = s.beats || [];
        const h = beats.find(b => b.kind === 'handoff');
        const row = { id, beats: beats.length, say: beats.filter(b => b.kind === 'say' && b.text).length };
        if (h) {
          row.via = h.to;
          if (h.call) row.callable = (typeof window[h.call] === 'function') ? h.call : ('MISSING ' + h.call);
          row.next = h.then || (h.to === 'scene' ? h.scene : null) || null;
        }
        out.push(row);
        id = row.next;
      }
      return out;
    }, scene ? scene.id : null);
    const broke = chain.filter(r => r.missing);
    const uncallable = chain.filter(r => r.callable && r.callable.indexOf('MISSING ') === 0);
    ok('EVERY SCENE THE OPENING CHAINS TO EXISTS (' +
      chain.map(r => r.missing ? ('!!' + r.id) : (r.id + ':' + r.beats)).join(' -> ') + ')',
      broke.length === 0, JSON.stringify(broke));
    ok('and every function the sequence names is on the page (' +
      (chain.filter(r => r.callable).map(r => r.callable).join(', ') || 'none named') + ')',
      uncallable.length === 0, JSON.stringify(uncallable));
    const totals = chain.filter(r => !r.missing)
      .reduce((a, r) => ({ b: a.b + r.beats, s: a.s + r.say }), { b: 0, s: 0 });
    console.log('  . the opening sequence: ' + chain.length + ' scenes, ' +
      totals.b + ' beats, ' + totals.s + ' spoken lines');

    /* ---- AND THE OTHER SIDE OF THE FIGHT, WHICH NOBODY HAD EVER SEEN --------
       *** THE CLAIM ABOVE ABOUT WHERE IT LANDS WAS TRUE AND SHALLOW. *** It reads
       the live TAB and stops there, so it passes on a COMBAT tab with no fight in
       it: a room, not what happens in the room. That is the same defect this gate
       was written to catch, committed by this gate.

       The 7/19 opening vision is ONE UNBROKEN SEQUENCE and the fight sits in the
       middle of it. Everything after the raid -- the last room, the grief dinner,
       the burial that ends the tutorial -- had never been played by anyone, because
       a gate cannot win a tutorial fight and no human had sat through it either.

       WHOSE HALF IS WHOSE, and this is why invoking onEnd here is the honest test
       rather than a side door. COMBAT's contract is that a settled encounter calls
       onEnd, win or lose; their end path does it unconditionally, after the sting,
       outside the victory branch, and THEIR gate owns proving it. This lane's
       contract is the other half: WHEN onEnd FIRES, THE STORY COMES BACK. So this
       drives the seam COMBAT publishes, from the encounter the game itself created,
       and asserts only the half this lane owns. Winning the fight instead would
       make the opening's gate fail whenever combat balance moved, which is a
       different lane's number deciding whether my story is broken. */
    const raid = scene && scene.handoff && scene.handoff.to === 'combat' ? scene.handoff : null;
    if (raid) {
      /* WAIT FOR THE FIGHT, NOT FOR THE TAB. Measured: the handoff deliberately
         waits for the combat frame and then 250ms more, so the tab is live BEFORE
         the encounter exists. Reading it on the tab reported "no fight" on a raid
         that starts perfectly -- a probe error that was one write-up away from
         being filed as a bug in another lane's code. */
      await SETTLE(page, 25000, async () => await page.evaluate(() =>
        !!(typeof G !== 'undefined' && G && G.encounter && typeof G.encounter.onEnd === 'function')));
      const fight = await page.evaluate(() => {
        const e = (typeof G !== 'undefined' && G) ? G.encounter : null;
        if (!e) return null;
        return {
          id: e.ctx && e.ctx.encounterId, objective: e.ctx && e.ctx.objective,
          roster: (e.roster || []).length, hasOnEnd: typeof e.onEnd === 'function'
        };
      });
      ok('THE RAID STARTS A REAL FIGHT, not just a tab (' +
        (fight ? fight.roster + ' hostiles, ' + JSON.stringify(fight.objective) : 'NO ENCOUNTER') + ')',
        !!fight && fight.roster > 0);
      ok('and it is the encounter the SCENE named (' + (fight && fight.id) + ' / ' + raid.encounter + ')',
        !!fight && (!raid.encounter || fight.id === raid.encounter),
        'the scene names the encounter id; a rename on either lane must not pass silently');
      ok('and the fight is carrying the way back - the scene handed it an onEnd',
        !!fight && fight.hasOnEnd,
        'no onEnd means the opening ends at the fight and the grief dinner never plays');

      const capsBefore = await page.evaluate(() => (window.__CAPS || []).length);
      const settled = await page.evaluate(() => {
        const e = (typeof G !== 'undefined' && G) ? G.encounter : null;
        if (!e || typeof e.onEnd !== 'function') return false;
        try { e.onEnd('encounter-won'); return true; } catch (_x) { return false; }
      });
      ok('the encounter can be settled through the seam COMBAT publishes', settled);

      /* WHAT MUST COME BACK is read out of the scene's own handoff, so a rewrite
         moves the target instead of breaking the claim. */
      const nextId = raid.then || null;
      const nextLines = await page.evaluate(id => {
        const s = id && typeof openSceneById === 'function' ? openSceneById(id) : null;
        return s ? (s.beats || []).filter(b => b.kind === 'say' && b.text).map(b => String(b.text)) : [];
      }, nextId);
      /* WAIT FOR THE WHOLE SCENE, NOT ITS FIRST LINE. The first cut waited only
         for line one and then asserted all of them, so it reported 1/2 on a scene
         that plays both perfectly -- the gate sampling before the thing it was
         about to demand. Same shape as the vacuous pass closed above: the claim
         was fine, the moment of measurement was wrong. */
      const wantFrags = nextLines.map(t => litOf(t)[0]).filter(Boolean);
      await SETTLE(page, 60000, async () => await page.evaluate(fr => {
        const s = (window.__CAPS || []).join('\n');
        return fr.every(f => s.indexOf(f) >= 0);
      }, wantFrags));

      const back = await page.evaluate(() => {
        const w = document.getElementById('openWrap');
        const r = w ? w.getBoundingClientRect() : null;
        return {
          caps: (window.__CAPS || []).slice(),
          shown: !!w && getComputedStyle(w).display !== 'none' && r.width > 80 && r.height > 80,
          running: typeof OPEN_RUNNING !== 'undefined' ? OPEN_RUNNING : null,
          scene: (typeof OPEN_PLAYER !== 'undefined' && OPEN_PLAYER && OPEN_PLAYER.scene)
            ? OPEN_PLAYER.scene.id : null
        };
      });
      ok('WHEN THE FIGHT ENDS THE STORY COMES BACK - the overlay returns and plays on',
        back.shown && back.running === true,
        'this is the seam that had never once been exercised; a false here means the demo ends at the fight');
      ok('and it resumes into the scene the handoff named (' + back.scene + ' / ' + nextId + ')',
        !nextId || back.scene === nextId);
      const stream2 = back.caps.join('\n');
      const missing2 = nextLines.filter(t => {
        const frags = litOf(t);
        return frags.length ? !frags.every(f => stream2.indexOf(f) >= 0) : false;
      });
      ok('AND THE LINES AFTER THE FIGHT REACH THE SCREEN (' +
        (nextLines.length - missing2.length) + '/' + nextLines.length + ' of ' + nextId + ')',
        missing2.length === 0, JSON.stringify(missing2.slice(0, 2)));
      ok('and the caption kept moving after the fight (' + capsBefore + ' -> ' + back.caps.length + ')',
        back.caps.length > capsBefore);

      /* ---- AND ALL THE WAY OUT THE OTHER SIDE, INTO A DAY -------------------
         The last link of the demo's opening, and the last one nobody had checked.
         BOTH demo gates play the day: demo_gate SKIPS the opening and
         the_whole_demo_gate DECLINES it. So "the day" has only ever been entered
         through the side door, and the seam where the finished STORY hands the
         player into a playable surface had never been crossed by anybody.

         The terminator is the LAST SCENE OF THE CHAIN, read from the chain, and
         only then the quiet. "Not running and not shown" on its own is ALSO TRUE
         DURING THE FIGHT -- a probe using exactly that reported the opening
         finished at 65s having played one scene of four, which is the same
         vacuous shape as the `ran &&` hole closed higher up this file. A
         termination condition that matches the middle is not a termination
         condition. */
      const chainIds = await chainOf(scene ? scene.id : null);
      const lastId = chainIds.length ? chainIds[chainIds.length - 1] : null;
      await SETTLE(page, 200000, async () => await page.evaluate(
        id => !id || (window.__SCENES || []).indexOf(id) >= 0, lastId));
      await SETTLE(page, 90000, async () => await page.evaluate(() => {
        const w = document.getElementById('openWrap');
        const vis = !!w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 80;
        return (typeof OPEN_RUNNING !== 'undefined' && !OPEN_RUNNING) && !vis;
      }));

      const out = await page.evaluate(() => {
        const on = document.querySelector('.panel.on');
        const tab = document.querySelector('.tab.on');
        const w = document.getElementById('openWrap');
        const r = on ? on.getBoundingClientRect() : null;
        /* THE WORLD FRAME, MEASURED FROM THE PARENT ONLY. A file:// iframe is an
           opaque origin, so reading the city's own state throws SecurityError and
           teaches nothing. What a person can see is what is asserted: a frame
           with real area, inside the panel that is actually live. */
        const fr = on ? on.querySelector('iframe') : null;
        const fb = fr ? fr.getBoundingClientRect() : null;
        return {
          scenes: window.__SCENES || [], caps: (window.__CAPS || []).length,
          running: typeof OPEN_RUNNING !== 'undefined' ? OPEN_RUNNING : null,
          shown: !!w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 80,
          panel: on ? on.id : 'none', tab: tab ? tab.dataset.p : null,
          panelW: r ? Math.round(r.width) : 0, panelH: r ? Math.round(r.height) : 0,
          frame: !!fr, frameW: fb ? Math.round(fb.width) : 0, frameH: fb ? Math.round(fb.height) : 0,
          seen: !!localStorage.getItem('bohemia.opening.seen.v1')
        };
      });
      const missedScenes = chainIds.filter(id => out.scenes.indexOf(id) < 0);
      ok('THE WHOLE SEQUENCE PLAYS, not just the scene before the fight (' +
        out.scenes.length + '/' + chainIds.length + ': ' + out.scenes.join(' -> ') + ')',
        missedScenes.length === 0, JSON.stringify(missedScenes));
      ok('and the opening ENDS on its own (' + out.caps + ' captions)',
        !out.shown && out.running === false);
      ok('AND IT PUTS YOU IN A DAY - a live panel with the world in it (' +
        out.panel + ' ' + out.panelW + 'x' + out.panelH + ', frame ' + out.frameW + 'x' + out.frameH + ')',
        out.panelW > 200 && out.panelH > 200 && out.frame &&
        out.frameW > 200 && out.frameH > 200,
        'the story is over and the player has to be standing somewhere playable');
      ok('and that surface is the one the RUN tab shows (' + out.panel + ', tab ' + out.tab + ')',
        out.tab === 'run');
      ok('and having watched the whole thing, it never asks again', out.seen === true);
      ok('and the bookmark is put away when the story is actually over',
        await page.evaluate(() => !localStorage.getItem('bohemia.opening.at.v1')),
        'a stale bookmark would offer a finished story back to somebody who finished it');
    }
  }

  /* ---- 6. THE PHONE RINGS DURING THE GRIEF DINNER ------------------------
     *** THE OPENING USED TO SPEND ITS OWN FLAG 65 SECONDS IN. *** openRaid
     called openMarkSeen at the handoff to the fight, with three of the
     sequence's four scenes unplayed. MEASURED 8/25: stop during the grief
     dinner, come back, and you are not offered it, nothing is playing, the flag
     is spent and there are no saves. The last room, the grief dinner and the
     burial were GONE with no way back -- the entire emotional payload of the
     opening, lost to a phone call, on a demo player's first run.

     THE RULE IS: YOU HAVE SEEN THE OPENING WHEN YOU HAVE SEEN THE OPENING. This
     drives the interruption for real -- play in, stop mid sequence, RELOAD THE
     PAGE the way a force quit does, and demand the story is still reachable and
     picks up where it stopped rather than replaying beats they already sat
     through. Nothing here reads a flag it did not watch being written. */
  {
    const { page, errs } = await boot();
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 2500);
    await page.evaluate(() => { const w = document.getElementById('openWatch'); if (w) w.click(); });
    await SETTLE(page, 150000, async () => await page.evaluate(() =>
      !!(typeof G !== 'undefined' && G && G.encounter && typeof G.encounter.onEnd === 'function')));

    ok('THE FLAG IS STILL UNSPENT WHEN THE RAID TAKES THE SCREEN',
      await page.evaluate(() => !localStorage.getItem('bohemia.opening.seen.v1')),
      'this is the exact moment it used to be spent, and what it cost was every scene after');
    ok('and the invite does not offer the opening while it is already in flight',
      await page.evaluate(() => {
        try { return typeof openShould === 'function' ? openShould() === false : true; }
        catch (_x) { return false; }
      }), 'OPEN_MIDFLIGHT does this job now; it used to be done by spending the seen flag');

    await page.evaluate(() => { const e = G.encounter; if (e && e.onEnd) e.onEnd('encounter-won'); });
    const midId = await page.evaluate(() => {
      /* whatever the sequence moves to after the fight, read off the page */
      try { return openNext(openScene()) ? (openNext(openScene()).then || null) : null; }
      catch (_x) { return null; }
    });
    await SETTLE(page, 90000, async () => await page.evaluate(
      id => { try { return !!(OPEN_PLAYER && OPEN_PLAYER.scene && (!id || OPEN_PLAYER.scene.id === id)); }
              catch (_x) { return false; } }, midId));
    const stopped = await page.evaluate(() => ({
      scene: (OPEN_PLAYER && OPEN_PLAYER.scene) ? OPEN_PLAYER.scene.id : null,
      bookmark: localStorage.getItem('bohemia.opening.at.v1')
    }));
    ok('THE GAME REMEMBERS WHERE THEY GOT TO (' + stopped.bookmark + ')',
      !!stopped.bookmark && stopped.bookmark === stopped.scene);

    /* the force quit */
    await page.reload();
    await SETTLE(page, 3500);
    await enter(page);
    await tapRun(page);
    await SETTLE(page, 4000);
    const back = await page.evaluate(() => {
      const i = document.getElementById('openInvite');
      return {
        offered: !!i && getComputedStyle(i).display !== 'none',
        seen: !!localStorage.getItem('bohemia.opening.seen.v1')
      };
    });
    ok('AN INTERRUPTED OPENING IS STILL THERE WHEN THEY COME BACK', back.offered === true,
      'the last room, the grief dinner and the burial are the payload; losing them to a phone call is the bug this guards');
    ok('and it has still not been marked seen, because they have not seen it', back.seen === false);

    await page.evaluate(() => { const w = document.getElementById('openWatch'); if (w) w.click(); });
    await SETTLE(page, 60000, async () => await page.evaluate(() => {
      try { return !!(OPEN_PLAYER && OPEN_PLAYER.scene); } catch (_x) { return false; } }));
    const resumed = await page.evaluate(() =>
      (OPEN_PLAYER && OPEN_PLAYER.scene) ? OPEN_PLAYER.scene.id : null);
    ok('AND IT PICKS UP WHERE THEY LEFT IT (' + resumed + '), not 26 beats from the top',
      resumed === stopped.scene,
      'replaying what they already sat through is its own way of taking their time');
    ok('nothing threw across the interruption', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();

    ok('and nothing threw across the whole opening', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  }

  await b.close();
  console.log('OPENING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
