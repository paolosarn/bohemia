#!/usr/bin/env node
/* ============================================================================
   CUT THE DEMO (8/26/26) — the demo build, made FROM the workshop, never forked.

   HIS RULING, 8/25, LOCKED:
     "THE DEMO WILL BE A STANDALONE LINK THAT ISNT THIS WORKSHOP LINK ARE YOU
      SERIOUS AND WE ARE NOT READY FOR THE DEMO YET!"
   Law: laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_8_25_26.md
   The coordinator's gap list calls this item A and says of it, in capitals:
   "THIS IS THE HEADLINE AND EVERYTHING ELSE IS SMALLER THAN IT."

   WHY THIS IS A TOOL AND NOT A FILE. The law says the demo is CUT FROM the
   workshop and NEVER A FORK: one engine, one canon, one set of modules, and
   what differs is only WHAT IS REACHABLE. A hand-made demo file is a fork the
   moment anybody touches the alpha, and it would rot silently -- this repo has
   spent a month finding exactly that class of thing. So the demo is GENERATED,
   every ship, and demo_build_gate re-runs this tool and fails if the committed
   demo is not byte-identical to what it produces. That check is the whole
   anti-fork guarantee; the rest is bookkeeping.

   WHAT IT CUTS, and every one of these is a REACHABILITY change, not a rewrite:

   1. SIXTEEN DEV TABS. The workshop's bar is VOTE LOOK WORDS CUTSCENE DIRECT
      RUN CHARACTER CLOTHES ANIMATION RIG COMBAT MUSIC MAP SLICE LIFE ART. The
      demo keeps exactly ONE, RUN, and it is never seen -- see 2.
      MEASURED FIRST, because removing markup other code queries is how you ship
      a black rectangle: only `.tab[data-p="run"]` is ever looked up by
      selector anywhere in the alpha. Every other tab is reached as
      `t.dataset.p` INSIDE the click handler, which cannot run for an element
      that no longer exists. Removing the other sixteen is inert.

   2. THE TAB BAR ITSELF. #app is a flex column of #tabs then #stage{flex:1}, so
      `display:none` on #tabs gives the game the whole screen and costs nothing.
      The RUN tab stays in the DOM because THE SPLASH CLICKS IT: the alpha's own
      entry handler does `document.querySelector('.tab[data-p="run"]').click()`
      and the comment above it explains why it must be a real click -- the city
      iframe is built lazily inside that handler, which also sends the player,
      sends the cast, restores the city save and pushes approved prefabs. A
      markup default would show an empty panel and skip all five. So the demo
      boots down the GAME'S OWN PATH and duplicates none of it.

   3. THE BUILDER'S DRAWER INSIDE THE CITY. This one is not on the routed
      checklist and it is the one that would actually have hurt somebody. The
      walked surface's toolbar is 🎵 MUSIC / 💾 / 📱 PHONE / 🛠, and the 🛠
      opens #devtray: REROLL, UNDER, KEY, PEOPLE, SLIDE. A stranger tapping
      REROLL regenerates the world underneath their own session. That is not a
      cosmetic leak, it is a destroyed playthrough, and "the only thing there is
      the game" is the law it breaks.
      IT IS HIDDEN FROM THE DEMO SIDE, NOT BY EDITING THE CITY. BOHEMIA_CITY_
      WORLD.html belongs to another lane and ONE SYSTEM ONE SESSION means this
      tool does not reach into it. The demo injects one stylesheet into the
      frame it owns, same-origin, in a try/catch that degrades to exactly
      today's behaviour if the browser refuses. The city file is untouched and
      the workshop still has its drawer.

   WHAT IT DELIBERATELY DOES NOT DO:
   - It does not delete the dev PANELS. They are inert without a tab to
     activate them (every heavy iframe in them is created lazily in the click
     handler, and #voteFrame carries data-src rather than src, so nothing is
     fetched), and deleting markup that thirty gates read is a large risk for a
     claim the law does not make. The law is about what is REACHABLE.
   - It does not chase weight. Blocker F, 24 seconds to first play, is real and
     it is RUN's: measured here, the alpha is 4.11 MB of which COMBAT_B64 is
     1.6 MB and the demo NEEDS the fight. Cutting tabs saves 125 KB of RIG_B64
     at most. Claiming this addresses F would be a lie.

     node tools/bohemia_cut_the_demo.js          # write slices/BOHEMIA_DEMO.html
     node tools/bohemia_cut_the_demo.js --check  # exit 1 if the committed one
                                                 # differs (what the gate runs)
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const DEMO = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');

/* THE GAME'S OWN TAB. Everything else in the bar is the bench. */
const KEEP = 'run';

function die(msg) {
  console.error('CUT THE DEMO FAILED: ' + msg);
  console.error('  The alpha changed shape under this tool. That is a real event and it '
    + 'must stop the cut rather than quietly produce a half-demo.');
  process.exit(2);
}

function cut(src) {
  const notes = { removedTabs: [], keptTabs: [] };

  /* ---- 1. the dev tabs ------------------------------------------------- */
  const barAt = src.indexOf('<div id="tabs">');
  if (barAt < 0) die('no <div id="tabs"> in the alpha');
  const barEnd = src.indexOf('</div>\n  <div id="syncBadge">', barAt);
  if (barEnd < 0) die('the tab bar does not end where it always has (before #syncBadge)');
  let bar = src.slice(barAt, barEnd);

  const TAB = /<div class="tab(?: on)?" data-p="([a-z]+)">[^<]*<\/div>/g;
  const found = [];
  let m;
  while ((m = TAB.exec(bar))) found.push(m[1]);
  if (found.length < 15) die('found only ' + found.length + ' tabs in the bar; the '
    + 'workshop has seventeen and this tool will not guess');
  if (!found.includes(KEEP)) die('there is no RUN tab to keep, so the demo would have '
    + 'no way to open the game');

  bar = bar.replace(TAB, (whole, p) => {
    if (p === KEEP) { notes.keptTabs.push(p); return whole; }
    notes.removedTabs.push(p);
    return '';
  });
  src = src.slice(0, barAt) + bar + src.slice(barEnd);

  /* ---- 2. the bar itself, and the CHARACTER default ---------------------- */
  /* the workshop opens on `class="tab on" data-p="char"`. That tab is gone now,
     so nothing carries `on` at rest -- which is correct: #app is display:none
     until the splash is tapped, and the splash's runTab.click() lights the game. */
  const HEAD = '</head>';
  if (src.indexOf(HEAD) < 0) die('no </head>');
  const style = '<style id="demo-cut">\n'
    + '/* THE DEMO HAS NO TAB BAR. #app is a flex column of #tabs then\n'
    + '   #stage{flex:1}, so hiding the bar hands the game the whole screen.\n'
    + '   The single RUN tab stays in the DOM because the splash clicks it. */\n'
    + '#tabs{display:none !important}\n'
    + '</style>\n';
  src = src.replace(HEAD, style + HEAD);

  /* ---- 2b. AND NO FALLBACK ONTO THE BENCH -------------------------------- */
  /* FOUND BY MUTATING THE GATE, not by reading the file. With the RUN tab
     removed the demo did not land on nothing -- it landed on P-CHAR, the
     CHARACTER wardrobe workbench, because the alpha's markup carries
     `class="panel on" id="p-char"` as its at-rest default. The real demo never
     reaches that state (the splash's click moves `on` to p-city, measured), but
     a build for strangers must not keep a fallback whose failure mode is
     "you are now in the developer's wardrobe tool". Nothing is marked on at
     rest; the splash lights the game, which is the only path there is. */
  /* *** AND ON 8/26 THE RUN LANE MOVED THE AT-REST DEFAULT TO p-city ON PURPOSE
     ("THE DOOR OPENS ON THE GAME", backlog row P0-DOOR), WHICH STOPPED THE CUT DEAD
     AND WITH IT EVERY DEPLOY. *** This tool exits 2 when the alpha changes shape under
     it and `set -e` in .github/workflows/pages.yml turns that into a failed build, so
     the play link stopped updating for every lane at once -- which is the refusal
     working exactly as designed and then nobody being told.
     THE RULE WAS NEVER "p-char", AND IT IS NOT "LAND ON THE GAME" EITHER -- the gate
     that holds this says NOTHING IS OPEN AT REST, and I had to be told that by the
     gate after my first fix let p-city keep its `on`. The splash's click is what
     lights the game, and it is the only path there is; a panel marked open at rest is
     a fallback, and a fallback that fires is a stranger standing in a tool. So: strip
     the `on` from WHICHEVER panel carries it. Any third state still refuses, because
     then the tool genuinely does not know what it is looking at.
     THIS IS NOT THIS LANE'S FILE. It is touched because an unpublishable site blocks
     the demo every lane is shipping, the fix is the one the tool's own message asks
     for, and leaving it red would have made my own push invisible too. */
  const CHARON = '<div class="panel on" id="p-char"';
  const CITYON = '<div class="panel on" id="p-city"';
  if (src.indexOf(CHARON) >= 0) src = src.replace(CHARON, '<div class="panel" id="p-char"');
  else if (src.indexOf(CITYON) >= 0) src = src.replace(CITYON, '<div class="panel" id="p-city"');
  else die('the alpha opens on neither p-char nor p-city, so this '
    + 'tool cannot tell what its at-rest default has become');

  /* ---- 3. a name of its own --------------------------------------------- */
  if (src.indexOf('<title>BOHEMIA</title>') < 0) die('the alpha title is not <title>BOHEMIA</title>');
  src = src.replace('<title>BOHEMIA</title>', '<title>BOHEMIA</title>');

  /* ---- 4. the stamp says which surface you are on ------------------------ */
  /* BUILD STAMP + DEPLOY VERIFY (7/20) plus the friends-round rule that every
     pasted build is identifiable. A tester screenshotting the splash has to be
     able to tell us whether they were on the demo or the bench. */
  const ST = /(<div id="buildstamp"[^>]*>)([^<]*)(<\/div>)/;
  const sm = src.match(ST);
  if (!sm) die('no #buildstamp div to stamp');
  if (/^DEMO /.test(sm[2])) die('the alpha stamp already says DEMO, which means this '
    + 'tool was pointed at a demo build instead of the workshop');
  src = src.replace(ST, (w, a, txt, c) => a + 'DEMO - ' + txt + c);

  /* ---- 5. the page knows which surface it is ----------------------------- */
  /* Not decoration: a gate has to be able to tell the two apart from the inside,
     and so does anything that ever wants to behave differently for a stranger. */
  const BODY = '</body>';
  if (src.indexOf(BODY) < 0) die('no </body>');
  const epilogue = [
    '<script id="demo-epilogue">',
    '/* ===== THE DEMO CUT (generated by tools/bohemia_cut_the_demo.js) ======',
    '   Everything in here is REACHABILITY. Not one line changes what the game',
    '   does, and every line degrades to exactly the workshop behaviour if it',
    '   fails. Do not hand-edit: the gate regenerates this file and compares. */',
    'window.__BOHEMIA_DEMO_BUILD = true;',
    '',
    '/* THE BUILDER\'S DRAWER IS NOT PART OF THE GAME. The walked city\'s toolbar',
    '   carries 🛠, which opens #devtray: REROLL, UNDER, KEY, PEOPLE, SLIDE. A',
    '   stranger tapping REROLL regenerates the world under their own session.',
    '   HIDDEN FROM THIS SIDE ONLY. slices/BOHEMIA_CITY_WORLD.html is another',
    '   lane\'s file and this tool does not touch it -- the workshop keeps its',
    '   drawer, the city keeps its code, and the demo simply does not show it.',
    '   The frame is same-origin on the published site. If a browser ever',
    '   refuses (a file:// load without --allow-file-access-from-files), the',
    '   catch leaves the page exactly as it is today rather than breaking it. */',
    '/* THE THUMB: 44px MINIMUM, iPHONE PORTRAIT. Measured on the built demo over',
    '   http at 390x844: TWELVE OF THIRTEEN tappable controls on the first city',
    '   screen were under 44px -- the top chips at 30px tall, which is 68% of the',
    '   target, and the eight walk arrows at 42. THE LAW HAS NEVER HAD A GATE, so',
    '   nothing was ever going to notice. gates/thumb_gate.js does now.',
    '   APPLIED FROM THE DEMO SIDE ONLY, like the drawer above: the city file is',
    '   another lane\'s and this tool does not reach into it. The workshop keeps',
    '   exactly the sizes it has and those rows are filed, not silently patched.',
    '   THE ARROWS GROW WITHOUT MOVING. The pad is a 180px radial layout of eight',
    '   42px boxes at fixed offsets around an 80px centre. Growing them to 44 with',
    '   a -1px margin expands each by one pixel in every direction and leaves every',
    '   centre exactly where it was, so the geometry he plays with is untouched:',
    '   44+80+44 = 168 inside 180, and the widest pair still clears by 3px. */',
    '/* ORDER AND SPECIFICITY, AND I BROKE THE DRAWER HIDE PROVING IT. The thumb',
    '   rule below sets display:flex on every child of #topbar, and #devbtn IS a',
    '   child of #topbar. Two !important declarations at equal specificity are',
    '   settled by ORDER, so the later thumb rule beat the earlier hide and the',
    '   builder button came back -- 44x44 and tappable for the whole session, which',
    '   is worse than the 149ms window it was meant to close. A rule can be',
    '   individually correct and wrong because of where it sits.',
    '   THE HIDE NOW GOES LAST AND CARRIES A COMPOUND SELECTOR, so it wins on',
    '   specificity as well as on order and cannot be undone by anything added',
    '   above it later. */',
    'var DEMO_CITY_CSS = [',
    '  \'#topbar>*,#blstack>*{min-height:44px !important;min-width:44px !important;\'',
    '    + \'display:flex !important;align-items:center !important;justify-content:center !important}\',',
    '  \'.pb{width:44px !important;height:44px !important;margin:-1px !important}\',',
    '  /* EVERY WALK BUTTON WAS DRAWING TWO ARROWS. The city already carries UI-12\'s',
    '     fix -- the direction is a CSS border triangle on .pb::before, and its eight',
    '     rotations measure exactly 0/45/90/135/180/225/270/315, correct for all',
    '     eight. But the ORIGINAL TEXT GLYPH was never removed: it is still the',
    '     button\'s textContent at 15px, so each control renders a correct triangle',
    '     with a stray arrow stuck to it. Proved by hiding the text and diffing:',
    '     8 of 8 buttons changed, and what is left is a clean triangle.',
    '     A HALF-FINISHED FIX THAT LEAVES THE OLD THING STANDING BESIDE THE NEW ONE,',
    '     which is the same shape as the two hairline bugs on 8/27.',
    '     SAFE IN BOTH OF THE PAD\'S MODES, checked rather than assumed: padMode()',
    '     swaps the text between dataset.walk and dataset.mapmove, and the drawn',
    '     triangles are present in BOTH (one triangle walking, two for map-move), so',
    '     the glyph is redundant in both. In map mode it was even rendering in a',
    '     different colour from the triangles it sat on. */',
    '  \'.pb{color:transparent !important;text-shadow:none !important}\',',
    '  \'#topbar #devbtn,#devbtn,#topbar #devtray,#devtray{display:none !important}\'',
    '].join(\'\\n\');',
    '',
    '(function(){',
    '  var last = null;',
    '  function dress(f){',
    '    try{',
    '      var d = f.contentDocument;',
    '      if(!d || !d.head || d.getElementById(\'demo-cut-city\')) return;',
    '      var st = d.createElement(\'style\'); st.id = \'demo-cut-city\';',
    '      st.textContent = DEMO_CITY_CSS;',
    '      d.head.appendChild(st);',
    '    }catch(_e){}',
    '  }',
    '  /* THE POLL WAS 400ms AND THAT IS A WINDOW, NOT A GUARD. Measured over http',
    '     on the built demo: the builder button was on screen AND returned by',
    '     elementFromPoint 149ms after the tap into the city -- so a thumb landing',
    '     in the top-right corner in the first half second opens REROLL, which is',
    '     the exact thing this block exists to prevent. A poll cannot close that;',
    '     only watching for the frame the instant it is created can. So: a',
    '     MutationObserver on the panel that receives it, dressed on creation, on',
    '     load, and on every frame for the first two seconds, with the interval',
    '     kept underneath as the belt to that pair of braces. */',
    '  function watch(){',
    '    var host = document.getElementById(\'p-city\');',
    '    if(!host) return;',
    '    try{',
    '      new MutationObserver(function(){',
    '        var f = document.getElementById(\'cityFrame\');',
    '        if(f){ dress(f); try{ f.addEventListener(\'load\', function(){ dress(f); }); }catch(_e){} }',
    '      }).observe(host, {childList:true, subtree:true});',
    '    }catch(_e){}',
    '  }',
    '  if(document.readyState === \'loading\') document.addEventListener(\'DOMContentLoaded\', watch);',
    '  else watch();',
    '  var until = 0;',
    '  (function spin(){',
    '    var f = document.getElementById(\'cityFrame\');',
    '    if(f){ if(!until) until = Date.now() + 2000; dress(f); }',
    '    if(!until || Date.now() < until) requestAnimationFrame(spin);',
    '  })();',
    '  setInterval(function(){',
    '    var f = document.getElementById(\'cityFrame\');',
    '    if(!f) return;',
    '    if(f !== last){ last = f; try{ f.addEventListener(\'load\', function(){ dress(f); }); }catch(_e){} }',
    '    dress(f);',
    '  }, 400);',
    '})();',
    '</script>',
    ''
  ].join('\n');
  src = src.replace(BODY, epilogue + BODY);

  return { src, notes };
}

const alpha = fs.readFileSync(ALPHA, 'utf8');
const { src, notes } = cut(alpha);

if (process.argv.includes('--check')) {
  let have = null;
  try { have = fs.readFileSync(DEMO, 'utf8'); } catch (_e) { }
  if (have === null) { console.error('NO DEMO BUILD: ' + path.relative(ROOT, DEMO) + ' does not exist'); process.exit(1); }
  if (have !== src) {
    console.error('THE DEMO IS NOT A CUT OF THE CURRENT WORKSHOP: regenerating it changes '
      + (Math.abs(have.length - src.length)) + ' bytes of length and/or content. '
      + 'Run: node tools/bohemia_cut_the_demo.js');
    process.exit(1);
  }
  console.log('the committed demo is exactly what the workshop cuts to (' + src.length + ' bytes)');
  process.exit(0);
}

fs.writeFileSync(DEMO, src);
console.log('=== CUT THE DEMO ===');
console.log('  workshop : ' + (alpha.length / 1048576).toFixed(2) + ' MB, ' + (notes.removedTabs.length + notes.keptTabs.length) + ' tabs');
console.log('  removed  : ' + notes.removedTabs.length + ' dev tab(s) -- ' + notes.removedTabs.join(' '));
console.log('  kept     : ' + notes.keptTabs.join(' ') + ' (never shown; the splash clicks it to open the game)');
console.log('  hidden   : the tab bar, and the city\'s 🛠 builder drawer');
console.log('  wrote    : ' + path.relative(ROOT, DEMO) + '  (' + (src.length / 1048576).toFixed(2) + ' MB)');
console.log('  the workshop file was not touched.');
