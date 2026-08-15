/* ============================================================================
   THE CITY CAN TALK TO THE SHELL GATE (8/15/26, RUN lane)

   THE DEFECT THIS EXISTS FOR, measured in a real browser on 8/15 before one line
   was changed:

       postMessage({bohemiaCityState:{...day:42}})            -> CITYSAVE 0 bytes
       postMessage({type:'X', bohemiaCityState:{...day:42}})  -> CITYSAVE 135 bytes

   Identical payloads. The only difference is a `.type` field, and the city never
   sends one. `combatMsgIn(d)` opened with `if(!d||!d.type)return false;` and
   SEVEN handlers inside it are keyed on bohemia* properties with no .type -- so
   all seven were unreachable, including THE AUTOSAVE.

   THE CITY HAD NEVER AUTOSAVED THROUGH THE ALPHA, and the city's own save panel
   said "Saved to this device. Autosaves survive a reload." My own 8/12 and 8/14
   gates asserted the purse and the market "ride the save" and both were right
   about the city page opened DIRECTLY -- where the city is the top document and
   there is no shell to post to. On the surface Paolo plays, the message went
   nowhere. That is the 7/18 law in one sentence: a side-door probe is a lie.

   WHAT THIS GATE HOLDS:
     1. the guard is never again "typed messages only"
     2. EVERY untyped bohemia* message the city sends is actually ROUTED
     3. the ones with a visible effect really have it, driven as messages
     4. unrelated postMessages are still ignored, which is what the guard is for
        -- a fix that accepts everything is not a fix
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('CITY BRIDGE GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* ---- 1. the shape of the guard, and what the city actually sends --------- */
const A = fs.readFileSync(ALPHA, 'utf8');
const C = fs.readFileSync(CITY, 'utf8');
ok('the guard no longer drops every untyped message',
   A.indexOf('function combatMsgIn(d){\n  if(!d||!d.type)return false;') < 0);
ok('and the fix is in the build', A.indexOf('__THE_CITY_CAN_TALK__') >= 0);

/* THE LIST IS DERIVED FROM THE ALPHA ITSELF, never typed here: whatever handlers
   exist is what gets probed, so a handler added tomorrow is covered tonight. */
const HANDLERS = [...new Set(
  (A.match(/if\(d\.(bohemia\w+)!==undefined\)/g) || [])
    .map(s => /if\(d\.(bohemia\w+)!==undefined\)/.exec(s)[1])
)];
ok('the alpha has bohemia* keyed handlers to check (' + HANDLERS.length + ')', HANDLERS.length >= 5);

/* and the city really does send them without a .type -- the premise of the bug */
const SENT = [...new Set(
  (C.match(/postMessage\(\{(bohemia\w+)/g) || [])
    .map(s => /postMessage\(\{(bohemia\w+)/.exec(s)[1])
)];
ok('the city posts untyped bohemia* messages (' + SENT.join(', ') + ')', SENT.length > 0);

(async () => {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.route(/^https?:/, r => r.abort());
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => { document.getElementById('front').click(); });
    await page.waitForTimeout(2000);

    /* ---- 2. every handler the alpha declares is ROUTED untyped ----------- */
    const routed = await page.evaluate(keys => {
      const out = {};
      for (const k of keys) {
        const msg = {}; msg[k] = {};
        let r = null;
        try { r = combatMsgIn(msg); } catch (e) { r = 'threw: ' + e.message; }
        out[k] = r;
      }
      return out;
    }, HANDLERS);
    for (const k of HANDLERS)
      ok('UNTYPED ' + k + ' is routed, not dropped (' + routed[k] + ')', routed[k] === true);

    /* ---- 3. the ones with a visible effect really have it --------------- */
    const eff = await page.evaluate(async () => {
      const out = {};
      const b0 = CITYSAVE.status().bytes;
      window.postMessage({ bohemiaCityState: { v: 1, seed: 1, day: 42, min: 600 } }, '*');
      await new Promise(r => setTimeout(r, 400));
      out.saveBytes = CITYSAVE.status().bytes;
      out.saveGrew = CITYSAVE.status().bytes > b0;
      const l = CITYSAVE.load();
      out.day = l && l.data ? l.data.day : null;

      const s0 = window.__CITY_SFX || 0;
      window.postMessage({ bohemiaCitySfx: { ev: 'phone_buzz' } }, '*');
      await new Promise(r => setTimeout(r, 300));
      out.sfxGrew = (window.__CITY_SFX || 0) > s0;

      window.postMessage({ bohemiaPrefabApproved: { pool: 'suburb', list: [] } }, '*');
      await new Promise(r => setTimeout(r, 300));
      /* bare G, not window.G: it is a top-level const in the alpha, so it lives
         in script scope and never lands on window. Checking window.G reported
         the handler broken when it had run perfectly. */
      out.prefab = (typeof G !== 'undefined') && !!G._prefabApproved;
      return out;
    });
    ok('THE AUTOSAVE ACTUALLY SAVES through the shell now (' + eff.saveBytes + ' bytes)',
       eff.saveGrew === true);
    ok('and it is the state that was sent, read back (day ' + eff.day + ')', eff.day === 42);
    ok('the city\'s SOUNDS reach the audio bus (the SOUND lane\'s phone buzz)',
       eff.sfxGrew === true);
    ok('approved prefabs reach the shell', eff.prefab === true);

    /* ---- 4. and it is still a guard ------------------------------------- */
    const ignored = await page.evaluate(() => {
      const junk = [{ hello: 1 }, { data: 'x' }, {}, { notbohemia: 1 }];
      return junk.map(j => { try { return combatMsgIn(j); } catch (e) { return 'threw'; } });
    });
    ok('an unrelated postMessage is STILL ignored -- a guard that accepts '
       + 'everything is not a fix (' + JSON.stringify(ignored) + ')',
       ignored.every(v => v === false));

    ok('no page error across the bridge' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }
  done();
})().catch(e => { console.log('CITY BRIDGE GATE CRASHED: ' + e.message); process.exit(1); });
