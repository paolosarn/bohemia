/* ============================================================================
   INSTALL CARD GATE (8/18/26, RUN lane) — demo board row 6, the last one open.

   The board:
     "ROW 6 -- IT GOES ON HIS HOME SCREEN -- PARTIAL. The manifest, the icon and
      the apple metas shipped 8/16, so an install WORKS and looks right on the
      springboard. But NOTHING EVER TELLS HIM IT EXISTS: grep -c 'ADD TO HOME'
      is 0 across both surfaces. REMAINS: THE ASK. OWNER: RUN."

   WHY THE ASK CANNOT BE SKIPPED ON THE PLATFORM HE DEMOS ON: `beforeinstallprompt`
   has never existed in Safari (WebKit bug 255716), and Chrome and Edge on iOS are
   Safari underneath, so they cannot install either. Every other platform draws
   this prompt for free. iOS gets a sentence from us or it gets nothing at all.

   AND THE STAKE IS THE SAVE. iOS does NOT share localStorage between Safari and a
   home-screen app -- separate storage, separate cookies, separate worker. The run
   he is in does not travel with him when he installs. So the ask belongs at the
   end of DAY 1, when he has the least to lose, not on day nine.

   WHAT IT HOLDS, and half of these exist because the first cut got them wrong:
     1. IT IS A LINE, NOT A MODAL. The first cut was its own card between the
        SLEEP tap and the DAY 2 wake, and it took THREE of my own gates red
        (vista_beat 14/5, dayloop 56/1, demo_day 21/3): the first night became
        reckoning -> install -> wake -> GET UP -> vista, five modals, four before
        he plays day two. So the SHAPE is asserted here, not just the presence.
     2. THE RECKONING STILL HAS EXACTLY ONE BUTTON, which is the machine form of
        "it costs him nothing" -- the tap that dismisses it is the SLEEP tap he
        was already making. Anything that adds a second tap goes red.
     3. ONE TAP STILL LANDS ON DAY 2, driven by actually playing day 1 to sleep
        in a real browser rather than by reading the source.
     4. THE iOS INSTRUCTION NAMES THE ELLIPSIS. iOS 26 moved Share out of the
        Safari toolbar; copy that says "tap the Share button" describes a button
        that is not on his screen. This is the one factual claim in the copy and
        it is the one that rots, so it is pinned.
     5. ONCE EVER, ACROSS RELOADS -- it rides the save. A prompt that comes back
        every night is an ad.
     6. AND NEVER INSIDE THE INSTALLED APP. Telling a man who already installed it
        to install it is the most obviously broken thing this could do.
     7. WORDS ARE TAGGED draft:true (ALWAYS MAKE AN ATTEMPT, 8/11) so every word
        is findable and editable, and nothing here is a number.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('INSTALL CARD GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* ---- 1. the ask exists at all, which is the whole row ------------------- */
const src = fs.readFileSync(CITY, 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '');   /* prose must never satisfy a check */
{
  ok('the ask is in the build', src.indexOf('__KEEP_THIS_RUN__') >= 0);
  /* THE ASSERTION THAT WOULD HAVE CAUGHT THE ROW: the measurement the board's
     sentence is literally made of. It was 0 for as long as the manifest existed. */
  ok('ADD TO HOME SCREEN is actually said somewhere a player can read it -- the '
     + 'grep the demo board row is made of', /Add to Home Screen/i.test(code));

  /* IT IS A LINE, NOT A MODAL. Shape, not presence. */
  ok('it is a LINE on a card he is already reading', /function installLine\(\)/.test(code));
  ok('and NOT a modal of its own -- the shape three gates rejected',
     !/function installAsk\(/.test(code) && !/cardShow\([\s\S]{0,40}INSTALL/.test(code));
  ok('it is anchored on the DAY 1 reckoning, before its single button',
     /if\(s\.day===1 && installShouldAsk\(\)\) h\+=installLine\(\);/.test(code));

  /* THE iOS 26 FACT. This is the claim that rots, so it is pinned. */
  ok('the iOS instruction names the ELLIPSIS -- iOS 26 moved Share out of the '
     + 'Safari toolbar, so "tap the Share button" describes a button that is not there',
     /\\u22ef[\s\S]{0,60}Share/.test(code));

  /* NEVER INSIDE THE INSTALLED APP */
  ok('it never shows inside the installed app (navigator.standalone)',
     /navigator\.standalone === true\) return false/.test(code));
  ok('and covers everyone else via display-mode',
     /display-mode: standalone\)'\)\.matches\)[\s\S]{0,30}return false/.test(code));

  /* ONCE EVER, ACROSS RELOADS */
  ok('it rides the save, so once really means once', /installAsked:!!INSTALL_ASKED/.test(code));
  ok('and the restore reads it back', /if\(st\.installAsked\)/.test(code));

  /* WORDS (8/11) */
  ok('the copy is a real attempt tagged draft:true, so he can edit every word',
     /INSTALL_WORDS=\{ draft:true/.test(code));
  ok('and it is WORDS, not a decision -- no number is set here',
     !/INSTALL_WORDS[\s\S]{0,400}?:\s*-?\d/.test(code));

  /* THE TDZ TRAP, twice paid for already in this file */
  ok('INSTALL_ASKED is var, not let -- citySnapshot reads it ~500 lines earlier '
     + 'and a top-level let would throw from the dead zone',
     /var INSTALL_ASKED=false;/.test(code));
}

/* ---- 2. played, in a real browser --------------------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/^https?:/, r => r.abort());
    await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
    for (let i = 0; i < 120; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }

    /* play day 1 to sleep, by tapping */
    await pg.$eval('#daycardIn .dcgo', el => el.click());     /* GET UP, day 1 */
    await SETTLE(pg, 250);
    await pg.evaluate(() => { document.getElementById('sleepbtn').click(); });
    await SETTLE(pg, 500);

    const reck = await pg.evaluate(() => {
      const el = document.getElementById('daycardIn');
      return { html: el ? el.innerHTML : '', text: el ? el.innerText : '',
               buttons: el ? el.querySelectorAll('.dcgo').length : -1,
               shown: window.__INSTALL_SHOWN || 0 };
    });
    ok('THE ASK IS ON THE DAY 1 RECKONING, on the card he is already reading',
       reck.shown === 1 && /KEEP THIS RUN/i.test(reck.text));
    ok('and it really says how (' + (/Add to Home Screen/i.test(reck.text) ? 'named' : 'MISSING') + ')',
       /Add to Home Screen/i.test(reck.text));
    ok('and it names the ellipsis, not a Share button that is not on his screen',
       reck.text.indexOf('⋯') >= 0);
    /* THE COST-HIM-NOTHING ASSERTION */
    ok('THE RECKONING STILL HAS EXACTLY ONE BUTTON -- the tap that dismisses this '
       + 'is the SLEEP tap he was already making (' + reck.buttons + ')', reck.buttons === 1);

    /* ONE TAP STILL LANDS ON DAY 2 */
    await pg.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(pg, 600);
    const d2 = await pg.evaluate(() => ({ day: DAY.day,
      text: (document.getElementById('daycardIn') || {}).innerText || '' }));
    ok('ONE TAP AND HE IS ON DAY 2 -- the ask added no step to his night (day '
       + d2.day + ')', d2.day === 2);
    ok('and the ask is not on the day 2 card', !/KEEP THIS RUN/i.test(d2.text));

    /* ONCE EVER, and it is in the save */
    const rode = await pg.evaluate(() => ({
      asked: INSTALL_ASKED, inSave: citySnapshot().installAsked === true,
      wouldAskAgain: installShouldAsk(), shown: window.__INSTALL_SHOWN || 0 }));
    ok('it is spent after one showing (' + rode.shown + ')',
       rode.asked === true && rode.wouldAskAgain === false && rode.shown === 1);
    ok('and "once" survives the tab, because it rides the save', rode.inSave === true);

    /* a restored save must not re-ask */
    const restored = await pg.evaluate(() => {
      INSTALL_ASKED = false;
      applyRestore(Object.assign(citySnapshot(), { installAsked: true }));
      return { asked: INSTALL_ASKED, would: installShouldAsk() };
    });
    ok('a reloaded run does NOT ask again -- a prompt that comes back every night '
       + 'is an ad', restored.asked === true && restored.would === false);

    ok('no page error across the night' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('INSTALL CARD GATE CRASHED: ' + e.message); process.exit(1); });
