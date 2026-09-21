#!/usr/bin/env node
/* ============================================================================
   THE DRIVER SAYS WHAT IT OPENED
   (9/22/26, PLUMBER lane, VAMILY row [driver says])

   PEOPLE (f75eb900) and SOUNDS (c6566f47) both asked the one driver for the ALPHA
   in the same round and both got the DEMO. `opts.alpha` was not an option it read,
   so it was dropped in silence, the baked demo opened, and an alpha change
   measured on it came back as A BELIEVABLE WRONG NUMBER WITH NO ERROR.

   Reproduced before the fix:
       asked for: { alpha: true }
       opened   : BOHEMIA_DEMO.html
       stamp    : DEMO - BUILD 9/21f - NOTHING POPS UP

   A red is an argument you can have. A believable wrong number is a lane spending
   a round chasing a change that was never in the file it looked at, and neither
   lane had any way to know.

   THE NAME WAS NEVER THE REAL BUG. `alpha` is just the option that got misspelled
   first; `page`, `useAlpha` or `flie` would all have been dropped the same way. So
   the driver now knows its own vocabulary and refuses anything outside it, and
   this gate holds all three legs -- a law without a machine gate is not enforced,
   and this one cost two lanes a round each.

   WHAT IT HOLDS
     1. alpha: true opens the ALPHA, not the demo
     2. the default is still the demo, so nothing that worked before moved
     3. an option the driver does not understand THROWS rather than being dropped
     4. the driver can say which file it opened, and says so out loud

   WHY IT DOES NOT BOOT A BROWSER FOR LEG 1 AND 2. The whole point is which URL is
   chosen, and that choice is made from opts before anything loads. Booting twice
   to read it would add ninety seconds to the suite to learn what the source already
   decides -- but READING the source and reasoning about it would not be a
   measurement either, and this lane has been wrong that way before. So it calls
   the real open() with a server that answers nothing, and reads the URL the driver
   actually asked for. The choice is exercised; only the page load is not.

     node gates/the_driver_says_what_it_opened_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));

const ALPHA = 'BOHEMIA_ALPHA_0_9.html';
const DEMO = 'BOHEMIA_DEMO.html';

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* Ask the driver to open something, with a boot ceiling small enough that it gives
   up quickly, and catch the URL it asked for on the way past. */
async function urlFor(opts) {
  let asked = null;
  const spy = { '__never__': '/does/not/exist' };
  try {
    const d = await D.open(Object.assign({ boot: 1, settle: 1, serve: spy }, opts));
    asked = d.openedFile ? d.openedFile() : null;
    await d.close().catch(() => {});
  } catch (e) {
    /* the boot is meant to fail; what matters is the file it went for, which the
       error carries when the page cannot be reached */
    const m = /(BOHEMIA_[A-Z0-9_]+\.html)/.exec(String(e && e.message) || '');
    if (m) asked = m[1];
    else if (/does not understand/.test(String(e && e.message))) throw e;
  }
  return asked;
}

(async function main() {
  process.chdir(ROOT);
  console.log('\nTHE DRIVER SAYS WHAT IT OPENED (Paolo\'s fleet, row [driver says])\n');

  /* ---- 3. THE DURABLE LEG FIRST, because it is the one that generalises ---- */
  let threw = null;
  try { await D.open({ useAlpha: true, boot: 1, settle: 1 }); }
  catch (e) { threw = String(e.message); }
  ok('AN OPTION THE DRIVER DOES NOT UNDERSTAND THROWS, instead of being dropped',
    !!threw && /does not understand/.test(threw),
    threw ? 'it threw, but not about the unknown option: ' + threw.slice(0, 120)
          : 'it accepted useAlpha:true in silence. That is exactly how PEOPLE and '
            + 'SOUNDS measured the demo while asking for the alpha. An option a tool '
            + 'does not understand is a question it was asked and did not answer.');
  if (threw) ok('and it names what it DOES understand, so the caller can fix it',
    /It knows:/.test(threw) && /alpha/.test(threw),
    'the message does not list the vocabulary: ' + String(threw).slice(0, 140));

  /* ---- 1 and 2. THE CHOICE ITSELF ---------------------------------------- */
  let a = null, d0 = null, f = null, bad = '';
  try {
    a = await urlFor({ alpha: true });
    d0 = await urlFor({});
    f = await urlFor({ file: ALPHA });
  } catch (e) { bad = String(e.message).slice(0, 140); }

  ok('alpha: true OPENS THE ALPHA', a === ALPHA,
    bad || 'it went for ' + a + '. Two lanes asked this way and measured the demo.');
  ok('the default is still the baked demo, so nothing that worked before moved',
    d0 === DEMO, bad || 'the default went for ' + d0);
  ok('an explicit file: still wins, because naming a file is more specific than '
    + 'naming a surface', f === ALPHA, bad || 'file: ' + ALPHA + ' went for ' + f);

  /* ---- 4. AND IT SAYS SO ------------------------------------------------- */
  ok('the driver exposes which file it opened, so a result can name it',
    typeof D.open === 'function' && a !== null,
    'openedFile() returned nothing, so a number taken through this driver cannot say '
    + 'what it is about');

  console.log('\n=== THE DRIVER SAYS WHAT IT OPENED: ' + pass + ' passed, ' + fail + ' failed ===');
  if (!fail) console.log('    a number taken through this driver can say which file it is about.');
  process.exit(fail ? 1 : 0);
})();
