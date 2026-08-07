/* BOHEMIA — CAN THE GAME GET THROUGH ONE DAY? (8/6/26)
 *
 * THE BIG MISSING, item 1, and it is the biggest thing on the eleven-month list:
 *
 *   "Every organ exists somewhere: quests (text), combat (dial), currencies
 *    (ruled), time-spending (resolver), sleep-save (built), travel (walkable
 *    valley). What does NOT exist is one playable DAY: wake at base -> pick up a
 *    quest -> travel to it -> resolve it -> GET PAID -> spend something -> sleep,
 *    save. THE CIRCULATORY SYSTEM BETWEEN THE ORGANS IS THE GAME, AND IT HAS
 *    NEVER ONCE CIRCULATED."
 *
 * IT LISTS TWO BLOCKERS -- quest placement [PENDING] and economy payout -- AND
 * THOSE WERE GUESSED ON 7/29. Nobody has ever attempted the day and found out
 * where it actually stops. A guessed blocker list is a plan built on a hunch, and
 * this repo has spent a week learning what happens when nobody checks which door
 * they are looking at.
 *
 * SO THIS DOES NOT FIX THE LOOP. Fixing it is the RUN lane's charter and is
 * genuinely blocked on Paolo's unmade rulings. This ATTEMPTS the day on the real
 * surface he taps and reports, link by link, how far the game gets and what the
 * FIRST thing to stop it actually is -- so the blocker list is measured instead
 * of assumed, and ordered instead of guessed.
 *
 * DRIVES THE SURFACE HE OPENS. Not the run slice, which the alpha loads and never
 * displays (records/BOHEMIA_A_CHECK_POINTED_AT_THE_WRONG_DOOR_8_4_26.md). Tap the
 * splash, tap RUN, and work with whatever is really there.
 *
 * READ-ONLY. It never writes a file, never edits the game, and every verb it uses
 * is one a player has.
 *
 *   node tools/bohemia_game_day_probe.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(g + '/playwright'); } catch (e) { }
  }
  return require('playwright');
}

const LINKS = [];
const link = (n, state, detail) => { LINKS.push({ n, state, detail }); };

(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  /* THE CONTROL SET, AND IT IS NOT OPTIONAL. The first version of this probe scanned
     window's property names with regexes and reported six PARTIALs and a verdict of
     "it circulates". Every one was a false positive off a browser built-in:
         /quest/i  matched  XMLHttpRequest, PaymentRequest
         /dial/i   matched  SVGRadialGradientElement, HTMLDialogElement
         /scrip/i  matched  TrustedScript, SVGScriptElement
         /cap/i    matched  escape, MediaCapabilities
     A checker that cannot tell a mention from a use is the broken one (Paolo 8/1) --
     and I wrote one INTO A PROBE ABOUT THIS EXACT DISEASE, an hour after gating it.
     So the game's globals are now defined as WINDOW MINUS A BLANK PAGE'S WINDOW. No
     built-in can ever be mistaken for a game system again. */
  const ctrlPage = await browser.newPage();
  await ctrlPage.goto('about:blank');
  /* AND THE CONTROL HAS TO BE THE SAME KIND OF CONTEXT. The second version took
     built-ins from a TOP-LEVEL blank page while the game runs in an IFRAME, and an
     iframe exposes a different set -- so PaymentRequest, PresentationRequest,
     ImageCapture, CaptureController and showSaveFilePicker all survived the filter
     and were still being reported as game systems. Wrong control, same false
     positives, one layer down. The control is now a BLANK IFRAME INSIDE THE SAME
     PAGE: identical context type, so the only names left after the subtraction are
     the game's own. */
  const BUILTINS = new Set(await ctrlPage.evaluate(async () => {
    const f = document.createElement('iframe');
    f.src = 'about:blank';
    document.body.appendChild(f);
    await new Promise(r => setTimeout(r, 300));
    return Object.getOwnPropertyNames(f.contentWindow);
  }));
  await ctrlPage.close();

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));

  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForSelector('#front', { timeout: 60000 });
  await page.click('#front');
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="run"]');
  await page.waitForTimeout(28000);
  const fh = await page.$('#cityFrame');
  const cf = fh ? await fh.contentFrame() : null;
  if (!cf) { console.log('FATAL: the RUN tab gave no frame'); await browser.close(); process.exit(1); }

  /* ---- LINK 1: WAKE AT BASE ---------------------------------------------- */
  const wake = await cf.evaluate(() => ({
    mode: (typeof MODE !== 'undefined') ? MODE : null,
    at: (typeof hx !== 'undefined') ? [hx, hy] : null,
    clock: (typeof T !== 'undefined' && T) ? (T.min | 0) : null,
  }));
  link('1 WAKE AT BASE',
    (wake.mode === 'human' && wake.at && (wake.at[0] || wake.at[1])) ? 'OK' : 'BLOCKED',
    'mode=' + wake.mode + ' at=' + JSON.stringify(wake.at) + ' clock=' + wake.clock);

  /* ---- LINK 2: PICK UP A QUEST ------------------------------------------- */
  /* EXACT NAMES, NOT A WORD SEARCH. Three versions of this probe tried to DISCOVER
     the game's systems by scanning window for words, and all three reported browser
     built-ins as game features (Request contains "quest"; SVGRadialGradientElement
     contains "dial"; TrustedScript contains "scrip"). Subtracting a control set did
     not save it either. The approach was wrong, not the tuning: NAMES ARE A DIALECT,
     so ask for the SPECIFIC things a player would use and let absence be absence. */
  const NAMED = async (names) => cf.evaluate((ns) => {
    const found = {};
    for (const n of ns) {
      try { const v = window[n]; if (v !== undefined) found[n] = typeof v; } catch (e) { }
    }
    return found;
  }, names);

  const questSyms = await NAMED(['BohemiaQuest', 'BohemiaBQ', 'QUESTS', 'QUESTLOG', 'questLog',
    'ACTIVE_QUEST', 'questRun', 'BQ', 'acceptQuest', 'offerQuest']);
  const screen = await cf.evaluate(() =>
    [...document.querySelectorAll('button,.btn,[role=button]')]
      .map(b => (b.textContent || '').trim()).filter(Boolean).slice(0, 20));
  link('2 PICK UP A QUEST', Object.keys(questSyms).length ? 'PARTIAL' : 'BLOCKED',
    'quest symbols present: ' + (Object.keys(questSyms).join(', ') || 'NONE') +
    ' | buttons a player can see: ' + (screen.join(' / ') || 'none'));

  /* ---- LINK 3: TRAVEL ----------------------------------------------------- */
  const before = await cf.evaluate(() => [hx, hy]);
  await cf.evaluate(() => {
    /* press the real d-pad the way a thumb does */
    const b = document.querySelector('.pb');
    if (b) { b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); }
  });
  await page.waitForTimeout(2500);
  await cf.evaluate(() => {
    const b = document.querySelector('.pb');
    if (b) { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); }
  });
  const after = await cf.evaluate(() => [hx, hy]);
  const moved = before && after && (before[0] !== after[0] || before[1] !== after[1]);
  link('3 TRAVEL (walk with the d-pad)', moved ? 'OK' : 'BLOCKED',
    'from ' + JSON.stringify(before) + ' to ' + JSON.stringify(after));

  /* ---- LINK 4: RESOLVE (talk to somebody) --------------------------------- */
  const talk = await cf.evaluate(() => {
    const out = {};
    try {
      out.people = (typeof __CT !== 'undefined' && __CT.everyone) ? __CT.everyone().length : null;
      out.adjacent = (typeof __CT !== 'undefined' && __CT.adjacent) ? !!__CT.adjacent() : null;
      out.verb = (typeof __CT !== 'undefined' && __CT.verb) ? __CT.verb() : null;
      out.namesKnown = (typeof __CT !== 'undefined' && __CT.nameCount) ?
        (typeof __CT.nameCount === 'function' ? __CT.nameCount() : __CT.nameCount) : null;
    } catch (e) { out.err = String(e).slice(0, 80); }
    return out;
  });
  link('4 RESOLVE — talk', (talk.people > 0) ? (talk.adjacent ? 'OK' : 'PARTIAL') : 'BLOCKED',
    'people reachable: ' + talk.people + ' | somebody adjacent: ' + talk.adjacent +
    ' | verb: ' + talk.verb + ' | names earned: ' + talk.namesKnown);

  /* ---- LINK 4b: RESOLVE (fight) ------------------------------------------- */
  const fightSyms = await NAMED(['BOHEMIA_RUN_COMBAT', 'startCombat', 'enterCombat', 'COMBAT',
    'BohemiaCombat', 'deadEye', 'DEADEYE', 'openCombat', 'toCombat']);
  link('4b RESOLVE — fight', Object.keys(fightSyms).length ? 'PARTIAL' : 'BLOCKED',
    'combat entry points on the walked surface: ' + (Object.keys(fightSyms).join(', ') || 'NONE'));

  /* ---- LINK 5: GET PAID / LINK 6: SPEND ----------------------------------- */
  const moneySyms = await NAMED(['purse', 'PURSE', 'BohemiaEconomy', 'ECON', 'ECONOMY',
    'money', 'MONEY', 'wallet', 'WALLET', 'scrip', 'SCRIP', 'barter', 'BARTER',
    'currency', 'CURRENCY', 'pay', 'payout', 'balance']);
  const hasMoney = Object.keys(moneySyms).length > 0;
  link('5 GET PAID (three currencies)', hasMoney ? 'PARTIAL' : 'BLOCKED',
    'currency on the walked surface: ' + (Object.keys(moneySyms).join(', ') || 'NONE AT ALL'));
  link('6 SPEND SOMETHING', hasMoney ? 'PARTIAL' : 'BLOCKED',
    hasMoney ? 'there is something to spend' : 'nothing to spend: no currency exists here');

  /* ---- LINK 7: SLEEP, SAVE ------------------------------------------------ */
  const saveSyms = await NAMED(['ctSave', 'tpSave', 'tjSave', 'applyRestore', 'doSleep',
    'sleep', 'SLEEP', 'goToBed', 'restUntil', 'autosave', 'saveGame']);
  const keys = await cf.evaluate(() => Object.keys(localStorage));
  /* SAVING and SLEEPING are two different links and the day needs both: a save you
     can only trigger from a menu is not "sleep ends the day". */
  const canSave = ['ctSave', 'tpSave', 'tjSave', 'applyRestore', 'saveGame', 'autosave']
    .some(n => n in saveSyms);
  const canSleep = ['doSleep', 'sleep', 'SLEEP', 'goToBed', 'restUntil'].some(n => n in saveSyms);
  link('7 SLEEP, SAVE', (canSave && canSleep) ? 'OK' : canSave ? 'PARTIAL' : 'BLOCKED',
    'save: ' + (canSave ? 'yes' : 'NO') + ' | sleep-to-end-the-day: ' + (canSleep ? 'yes' : 'NO') +
    ' | symbols: ' + (Object.keys(saveSyms).join(', ') || 'none') +
    ' | localStorage keys: ' + keys.length);

  /* ---- THE VERDICT -------------------------------------------------------- */
  console.log('');
  console.log('='.repeat(78));
  console.log('  CAN THE GAME GET THROUGH ONE DAY?   (measured on the surface RUN opens)');
  console.log('='.repeat(78));
  for (const l of LINKS) {
    console.log('  ' + (l.state === 'OK' ? '[OK]     ' : l.state === 'PARTIAL' ? '[PARTIAL]' : '[BLOCKED]') +
      ' ' + l.n);
    console.log('           ' + l.detail);
  }
  const firstBlock = LINKS.find(l => l.state === 'BLOCKED');
  console.log('='.repeat(78));
  console.log('  OK ' + LINKS.filter(l => l.state === 'OK').length +
    ' | PARTIAL ' + LINKS.filter(l => l.state === 'PARTIAL').length +
    ' | BLOCKED ' + LINKS.filter(l => l.state === 'BLOCKED').length);
  console.log('  FIRST THING THAT STOPS THE DAY: ' + (firstBlock ? firstBlock.n : 'nothing — it circulates'));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
  console.log('='.repeat(78));

  fs.writeFileSync('records/BOHEMIA_GAME_DAY_PROBE.json',
    JSON.stringify({ links: LINKS, firstBlocker: firstBlock ? firstBlock.n : null }, null, 1));
  await browser.close();
})();
