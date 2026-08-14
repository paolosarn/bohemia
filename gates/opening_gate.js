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
    await page.waitForTimeout(3200);
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
    await page.waitForTimeout(400);
  }
  async function tapRun(page) {
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
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
    await page.waitForTimeout(5000);
    ok('THE OPENING DOES NOT BURN THROUGH BEHIND THE SPLASH — it waits for the door',
      !(await shown(page)), 'a scene nobody can see is a scene that did not happen');
    await enter(page);
    await tapRun(page);
    await page.waitForTimeout(9000);
    ok('TAPPING RUN WITH NO SAVE PLAYS THE OPENING', await shown(page));
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
    await page.waitForTimeout(1600);
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
    await page.waitForTimeout(4500);
    ok('A PLAYER WITH A SAVE IS NOT SHOWN THE BEGINNING — they are mid-story, and it would read as a bug',
      !(await shown(page)));
    await page.close();
  }
  {
    const { page } = await boot(() => {
      localStorage.setItem('bohemia.opening.seen.v1', '1');
      localStorage.removeItem('bohemia.save.v1');
    });
    await enter(page);
    await tapRun(page);
    await page.waitForTimeout(4500);
    ok('and somebody who has already seen it never sees it again',
      !(await shown(page)));
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
    await page.waitForTimeout(3200);
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

  await b.close();
  console.log('OPENING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
