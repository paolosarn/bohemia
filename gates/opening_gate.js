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
      window.__CAPS = [];
      const cap = document.getElementById('openCap'); if (!cap) return;
      const push = () => {
        const t = (cap.textContent || '').trim();
        if (t && window.__CAPS[window.__CAPS.length - 1] !== t) window.__CAPS.push(t);
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

    /* THE ONE THAT WOULD HAVE BITTEN A DEMO PLAYER. openDone marks seen; so does
       the raid path. If either had forgotten, the person who watched the whole
       opening would be offered it again tomorrow while the person who skipped it
       never would -- exactly backwards. */
    ok('WATCHING IT THROUGH COUNTS AS SEEN - it never ambushes the patient player again',
      played.seen === true);
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

    ok('and nothing threw across the whole opening', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  }

  await b.close();
  console.log('OPENING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
