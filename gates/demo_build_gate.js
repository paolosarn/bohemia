/* ============================================================================
   DEMO BUILD GATE (8/26/26) — the demo is its own link, and it is not the bench.

   HIS RULING, 8/25, LOCKED:
     "THE DEMO WILL BE A STANDALONE LINK THAT ISNT THIS WORKSHOP LINK ARE YOU
      SERIOUS AND WE ARE NOT READY FOR THE DEMO YET! WHAT ARE WE STILL MISSING!"
   Law:  laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_8_25_26.md
   Gaps: records/BOHEMIA_WHAT_THE_DEMO_IS_STILL_MISSING_8_25_26.md, item A, which
         says of it in capitals: "THIS IS THE HEADLINE AND EVERYTHING ELSE IS
         SMALLER THAN IT."

   THE LAW NAMED THIS GATE AND ITS FOUR CLAIMS: the demo build exists as its own
   published file; it contains ZERO dev tabs; a cold boot of its URL lands in the
   game and not on a tab bar; and the workshop still boots with all its tabs
   intact, "because taking his bench away to make a demo would be trading one
   mistake for a worse one."

   EVERY CLAIM IS DRIVEN IN A REAL BROWSER, ON BOTH SURFACES. "The file has the
   right markup" and "a stranger who opens this link is in the game" are
   different claims, and only the second one is his ruling. That distinction is
   exactly what the coordinator got wrong for four turns -- the_whole_demo_gate
   proved the day plays INSIDE THE WORKSHOP and was read as proving a demo
   exists. So this gate opens two files, taps the splash the way a person does,
   and reads what is on the screen.

   A CORRECTION TO THE LAW'S OWN WORDING, MEASURED. It says "all seventeen tabs".
   The bar holds SIXTEEN: VOTE LOOK WORDS CUTSCENE DIRECT RUN CHARACTER CLOTHES
   ANIMATION RIG COMBAT MUSIC MAP SLICE LIFE ART. CITY is the seventeenth SURFACE
   but has never been a tab -- the RUN tab routes to the city panel (Paolo 7/28,
   "can you put the city in the run tab?"). Seventeen surfaces, sixteen tabs.
   This gate asserts what is actually there, and names the count so a future
   reader is not left choosing between two numbers.

   node gates/demo_build_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const DEMO = 'slices/BOHEMIA_DEMO.html';
const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';
const CUTTER = 'tools/bohemia_cut_the_demo.js';

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}

/* THE SAME WALK, ON WHICHEVER SURFACE IT IS POINTED AT. One function for both so
   a claim about the demo and the matching claim about the workshop cannot drift
   into measuring two different things. */
async function walk(chromium, file) {
  /* --allow-file-access-from-files: on the PUBLISHED site both documents sit on
     paolosarn.github.io and the frame is same-origin with no flag at all. Under
     file:// Chromium gives every file an opaque origin, so without this the
     demo's stylesheet injection would be blocked HERE and nowhere else, and the
     gate would be measuring the harness rather than the build. Production is
     strictly more permissive than what is proved below. */
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'slices', file));
  await p.waitForTimeout(1800);

  const cold = await p.evaluate(() => ({
    demoFlag: !!window.__BOHEMIA_DEMO_BUILD,
    tabs: [...document.querySelectorAll('.tab')].map(t => t.dataset.p),
    barShown: (() => { const t = document.getElementById('tabs'); return t ? getComputedStyle(t).display !== 'none' : false; })(),
    stamp: (document.getElementById('buildstamp') || {}).textContent || '',
    splashShown: (() => { const f = document.getElementById('front'); return !!f && getComputedStyle(f).display !== 'none'; })(),
    panelsOn: [...document.querySelectorAll('.panel.on')].map(x => x.id)
  }));

  /* tapped the way a person taps it, not by setting a class */
  await p.click('#front', { force: true }).catch(() => { });
  await p.waitForTimeout(9000);

  const after = await p.evaluate(() => ({
    barShown: (() => { const t = document.getElementById('tabs'); return t ? getComputedStyle(t).display !== 'none' : false; })(),
    panelsOn: [...document.querySelectorAll('.panel.on')].map(x => x.id),
    openedOnGame: window.__OPENED_ON_THE_GAME || 0,
    runTabMissing: !!window.__RUN_TAB_MISSING,
    cityFrame: !!document.getElementById('cityFrame')
  }));

  let city = null;
  const cf = p.frames().find(x => x.url().includes('CITY_WORLD'));
  if (cf) {
    await cf.waitForLoadState('load').catch(() => { });
    await p.waitForTimeout(2500);
    city = await cf.evaluate(() => {
      const vis = id => {
        const e = document.getElementById(id);
        if (!e) return 'absent';
        return getComputedStyle(e).display === 'none' ? 'hidden' : 'VISIBLE';
      };
      return {
        devbtn: vis('devbtn'), devtray: vis('devtray'),
        phonebtn: vis('phonebtn'), musbtn: vis('musbtn'), savebtn: vis('savebtn'),
        injected: !!document.getElementById('demo-cut-city'),
        /* IT BOOTS AND IT PLAYS ARE DIFFERENT CLAIMS. A cut that lands on a
           pretty static frame would pass every reachability check above and be
           useless to a stranger, so the frame is asked whether it owns the DAY
           LOOP -- DAY and DQ are the two the whole-demo gate drives -- and
           whether the first morning is actually on screen. */
        hasDay: typeof DAY !== 'undefined', hasDQ: typeof DQ !== 'undefined',
        day: (typeof DAY !== 'undefined' && DAY) ? (DAY.n || DAY.day || null) : null,
        wakeCard: (() => {
          const e = document.getElementById('daycardIn');
          return e ? getComputedStyle(e).display !== 'none' : 'absent';
        })()
      };
    }).catch(() => null);
    /* and the one button a player reaches for first */
    try {
      await cf.evaluate(() => { const b = document.getElementById('phonebtn'); if (b) b.click(); });
      await p.waitForTimeout(2200);
      const ph = await cf.evaluate(() => {
        const e = document.getElementById('phonewrap') || document.getElementById('phone');
        return e ? getComputedStyle(e).display !== 'none' : 'absent';
      });
      if (city) city.phoneOpens = ph;
    } catch (_e) { }
  }

  await b.close();
  return { cold, after, city, errs };
}

(async () => {
  console.log('=== DEMO BUILD GATE — the demo is its own link, and it is not the bench ===');

  /* ---- 1. IT EXISTS, AS ITS OWN FILE ------------------------------------ */
  const demoPath = path.join(ROOT, DEMO);
  const exists = fs.existsSync(demoPath);
  ok('THE DEMO BUILD EXISTS as its own file, not as a path through the workshop '
    + '(' + DEMO + ')', exists,
    'the coordinator\'s gap list item A: "Zero standalone slices." Run: node ' + CUTTER);
  if (!exists) { console.log('\nDEMO BUILD GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); }

  /* ---- 2. IT IS A CUT, NEVER A FORK ------------------------------------- */
  /* The law's words: "CUT FROM the workshop, never a fork of it. One engine, one
     canon, one set of modules." A file somebody hand-edits is a fork the moment
     the alpha moves, and it rots silently. Regenerating and comparing is the
     only version of that promise a machine can hold. */
  let cutOut = '', cutOk = false;
  try {
    cutOut = execFileSync('node', [path.join(ROOT, CUTTER), '--check'],
      { cwd: ROOT, encoding: 'utf8' });
    cutOk = true;
  } catch (e) { cutOut = String((e.stdout || '') + (e.stderr || '')); }
  ok('and it is a CUT OF THE CURRENT WORKSHOP, not a fork: regenerating it with '
    + CUTTER + ' changes nothing', cutOk, cutOut.trim());

  /* ---- 3. IT IS PUBLISHED ----------------------------------------------- */
  /* The push working is not the site working (8/6). slices/ has to be in BOTH
     _config.yml and the workflow copy list or the demo 404s in production while
     sitting on disk, which is the exact failure pages_publish_gate exists for. */
  const cfg = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
  const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/pages.yml'), 'utf8');
  ok('and the site actually PUBLISHES the folder it lives in, so the link is real '
    + 'rather than a file on disk', /slices/.test(cfg) && /slices/.test(wf),
    '_config.yml and .github/workflows/pages.yml must both carry slices/');
  /* AND PRODUCTION DOES NOT DEPEND ON ANYBODY REMEMBERING. The committed demo
     goes stale the moment any lane edits the alpha, and "somebody regenerates
     it" is exactly the manual step that left slices/BOHEMIA_RUN_CURRENT.html
     four days behind engine/ with nothing noticing. The deploy re-cuts it, and
     because the workflow runs with `set -e` a cutter that REFUSES (exit 2, when
     the alpha changed shape under it) fails the build instead of publishing a
     half-demo to strangers. */
  ok('and THE DEPLOY CUTS IT FRESH, so a stale demo can never reach a stranger '
    + 'even if a lane forgets to regenerate it',
    /* MATCH THE STEP, NOT THE PROSE. The first version of this searched the
       workflow for the cutter's path and passed on the COMMENT above the step
       explaining why the step exists -- so deleting the step left it green.
       Caught by mutating it, which is the only reason it is not still wrong.
       Third time this week a check has matched a sentence instead of code. */
    /^\s*run:\s*node\s+tools\/bohemia_cut_the_demo\.js\s*$/m.test(wf),
    '.github/workflows/pages.yml must have a step that RUNS ' + CUTTER
    + ' before assembling the site (a comment mentioning it is not a step)');

  const { chromium } = pw();

  /* ---- 4. THE DEMO, WALKED ---------------------------------------------- */
  const d = await walk(chromium, 'BOHEMIA_DEMO.html');

  const devTabs = d.cold.tabs.filter(t => t !== 'run');
  ok('ZERO DEV TABS: the bar holds nothing but the game\'s own RUN tab '
    + '(tabs present: ' + (d.cold.tabs.join(' ') || 'none') + ')',
    devTabs.length === 0, 'dev tabs still reachable: ' + devTabs.join(' '));
  ok('and the RUN tab is still THERE, because the splash clicks it to open the '
    + 'game -- removing it would be a demo that never starts',
    d.cold.tabs.includes('run'));
  ok('and NO TAB BAR IS EVER SHOWN, before the tap or after it '
    + '(' + d.cold.barShown + ' / ' + d.after.barShown + ')',
    d.cold.barShown === false && d.after.barShown === false);

  /* THE FALLBACK MATTERS TOO. Found by mutating this gate: with the RUN tab
     removed the demo landed on P-CHAR, the wardrobe workbench, because the
     alpha's markup marks that panel `on` at rest. The demo must have no at-rest
     panel at all, so its worst case is a blank stage rather than a stranger
     standing in a developer tool. */
  ok('and NOTHING IS OPEN AT REST -- the demo has no fallback onto his wardrobe '
    + 'bench if anything ever fails to click '
    + '(' + (d.cold.panelsOn.join(',') || 'none') + ')',
    d.cold.panelsOn.length === 0);
  ok('A COLD BOOT LANDS IN THE GAME: one tap on the splash and the panel on screen '
    + 'is the walked city (' + (d.after.panelsOn.join(',') || 'none') + ')',
    d.after.panelsOn.includes('p-city'));
  ok('and it got there down THE GAME\'S OWN PATH -- the splash clicked the real '
    + 'RUN tab, which is what builds the city frame, sends the player, sends the '
    + 'cast and restores the save (opened ' + d.after.openedOnGame + 'x)',
    d.after.openedOnGame >= 1 && d.after.runTabMissing === false);
  ok('and the city frame is actually built and loaded, not an empty panel',
    d.after.cityFrame === true && !!d.city);

  /* ---- 5. THE BUILDER'S DRAWER IS NOT PART OF THE GAME ------------------ */
  /* Not on the routed checklist, and the one that would have hurt somebody:
     #devtray holds REROLL, which regenerates the world under a stranger's own
     session. "A stranger opens it and the only thing there is the game." */
  ok('THE BUILDER\'S DRAWER IS UNREACHABLE in the demo: the 🛠 button and the tray '
    + 'behind it are hidden, so nobody taps REROLL and regenerates the world under '
    + 'their own save (' + (d.city ? d.city.devbtn + ' / ' + d.city.devtray : 'no city') + ')',
    !!d.city && d.city.devbtn === 'hidden' && d.city.devtray === 'hidden');
  ok('and THE PLAYER\'S OWN BUTTONS SURVIVED -- phone, music and save are still '
    + 'there, because this is a cut and not a stripping '
    + '(' + (d.city ? [d.city.phonebtn, d.city.musbtn, d.city.savebtn].join(' ') : 'no city') + ')',
    !!d.city && d.city.phonebtn === 'VISIBLE' && d.city.musbtn === 'VISIBLE'
    && d.city.savebtn === 'VISIBLE');

  /* ---- 5b. AND IT PLAYS, WHICH IS A DIFFERENT CLAIM FROM IT BOOTS ------- */
  ok('THE DEMO IS THE GAME, NOT A SHELL: the surface it lands on owns the day '
    + 'loop (DAY ' + (d.city ? d.city.hasDay : '?') + ', DQ '
    + (d.city ? d.city.hasDQ : '?') + ') and it is DAY ' + (d.city ? d.city.day : '?'),
    !!d.city && d.city.hasDay === true && d.city.hasDQ === true && d.city.day === 1);
  ok('and A STRANGER ARRIVES ON THE FIRST MORNING, with the wake card up, rather '
    + 'than in the middle of somebody else\'s save '
    + '(' + (d.city ? d.city.wakeCard : '?') + ')',
    !!d.city && d.city.wakeCard === true);
  ok('and THE PHONE OPENS when they tap it -- the one button the day\'s work is '
    + 'behind (' + (d.city ? d.city.phoneOpens : '?') + ')',
    !!d.city && d.city.phoneOpens === true);

  ok('the demo knows which surface it is, from the inside', d.cold.demoFlag === true);
  ok('and ITS STAMP SAYS SO, so a tester\'s screenshot tells us which build they '
    + 'played (' + JSON.stringify(d.cold.stamp) + ')', /^DEMO - /.test(d.cold.stamp));
  ok('the demo threw nothing on the way in: ' + (d.errs.slice(0, 2).join(' | ') || 'clean'),
    d.errs.length === 0);

  /* ---- 6. AND THE BENCH IS EXACTLY WHERE HE LEFT IT --------------------- */
  const w = await walk(chromium, 'BOHEMIA_ALPHA_0_9.html');
  /* THE LAW IS "HIS BENCH MUST NOT LOSE A TAB TO MAKE A DEMO", so this asks
     whether every protected tab is STILL THERE -- not whether the count is
     exactly sixteen. An exact count also forbids a lane from ever ADDING one,
     which the law does not, and which is not this gate's business: the UI lane
     added its own tab on 8/26 and turned this red without going anywhere near
     the demo. Losing any of the sixteen below is still red, which is the whole
     point. (Seventeen SURFACES, sixteen protected tabs -- CITY is the panel the
     RUN tab routes to and has never been a tab of its own.) */
  const BENCH = ['vote', 'look', 'words', 'cutscene', 'direct', 'run', 'char',
                 'clothes', 'anim', 'rig', 'combat', 'music', 'map', 'slice',
                 'life', 'art'];
  const lost = BENCH.filter(t => !w.cold.tabs.includes(t));
  ok('THE WORKSHOP IS UNTOUCHED: every one of his sixteen tabs is still in his '
    + 'bar (' + w.cold.tabs.length + ' present: ' + w.cold.tabs.join(' ') + ')'
    + (lost.length ? ' -- LOST: ' + lost.join(' ') : ''),
    lost.length === 0,
    'his bench must not lose a tab to make a demo');
  ok('and his tab bar is still SHOWN, which is the half of the law that protects '
    + 'him rather than the player', w.cold.barShown === true);
  ok('and the workshop is NOT flagged as the demo, so nothing can ever treat his '
    + 'bench as the thing strangers play', w.cold.demoFlag === false);
  ok('and the workshop keeps its builder\'s drawer '
    + '(' + (w.city ? w.city.devbtn : 'no city') + ')',
    !!w.city && w.city.devbtn === 'VISIBLE' && w.city.injected === false);
  ok('and the workshop stamp is NOT a demo stamp '
    + '(' + JSON.stringify(w.cold.stamp) + ')', !/^DEMO - /.test(w.cold.stamp));
  ok('the workshop threw nothing either: ' + (w.errs.slice(0, 2).join(' | ') || 'clean'),
    w.errs.length === 0);

  console.log('\nDEMO BUILD GATE: ' + pass + ' passed, ' + fail + ' failed');
  if (!fail) {
    console.log('  There are two surfaces now. His bench still has sixteen tabs, and a '
      + 'stranger opening the demo is standing in the valley with nothing else on screen.');
  }
  process.exit(fail ? 1 : 0);
})();
