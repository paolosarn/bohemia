/* ============================================================================
   THE STREET DRAWS NO HAIRLINES  (UI lane 11, 9/18) -- row [no slop], round ten.
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md

   *** THE MEASUREMENT THAT MADE THIS ROUND, AND IT IS ABOUT THE OTHER INSTRUMENT. ***
   The tell ruler reads SOURCE. On the walked city it said 46 one-pixel borders and 53
   rounded corners. Measured on the LIVE opening street, the game was drawing THREE and
   THREE. Nearly everything left in that count is a declaration the skin already cancels
   with !important, or a rule for a panel that is not open. Eight rounds of this row have
   been reported against a number fifteen times larger than anything he can see.

   Both questions are real and they are different. A dead declaration still counts, still
   misleads the next reader, and is exactly how a killed shape comes back -- GET UP was
   drawn with a bevel AND a rounded hairline because a later rule put the hairline back.
   The ruler keeps that honest. THIS gate holds the other half: what he actually sees.

   THE RATCHET: the opening street draws ZERO one-pixel edges. It is at zero now (the hint
   line, the teaching caption and the top bar's underside were the last three, all
   translated into the skin's own body rather than deleted, because each was doing real
   work separating a label from a moving world). Anything that adds one comes back here.

   WHAT IS DELIBERATELY NOT COUNTED, so the ratchet cannot be gamed and cannot be cruel:
     a CIRCLE is a shape, not a rounded card -- the pad's ring and face are 999px
     a TRANSPARENT border paints nothing -- several controls carry one as an :active hook
     a panel he has not opened is not on his screen
   The measurement itself lives in tools/bohemia_what_actually_paints.js and is REQUIRED
   from there, not copied, so the CLI he could run and the gate that blocks a ship can
   never quietly disagree.

   Run: node gates/the_street_draws_no_hairlines_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { paints, paintsWith } = require(path.join(ROOT, 'tools/bohemia_what_actually_paints.js'));

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};

(async () => {
  let d;
  try { d = await open({}); }
  catch (e) { ok('the demo could be driven to the street', false, String(e.message).slice(0, 90));
              console.log('\nTHE STREET DRAWS NO HAIRLINES: ' + pass + ' ok, ' + fail + ' failed');
              process.exit(1); }

  /* THE ONE DRIVER (rule 14g). A screenshot is the honest instrument and a selector is a
     guess; this uses the shared driver's own boot, so it is standing where a player is. */
  const street = await paints(d.fr);
  const uniq = a => [...new Set(a)];

  ok('the opening street draws no one-pixel edges at all',
     street.hair.length === 0, uniq(street.hair).slice(0, 5).join(' '));

  /* THE ROUNDED BOXES THAT SURVIVE EACH HAVE A REASON, AND THE REASON IS NAMED.
     #stage is the game's own viewport corner -- the glass of the device the interface is
     supposed to BE, not a card round a group. #teachring is a 2px accent pointer that
     circles the control being taught. Both are the object language, not the idiom the law
     names, so the leg pins the LIST rather than the count: a new rounded box shows up. */
  const ALLOWED = ['#stage', '#teachring'];
  const strays = uniq(street.round).filter(x => !ALLOWED.includes(x.split(':')[0]));
  ok('and the only rounded boxes left on it are the ones with a reason (' + ALLOWED.join(', ') + ')',
     strays.length === 0, strays.slice(0, 5).join(' '));

  /* THE PANELS HE CAN OPEN. Not a ratchet at zero -- the map key really does draw 32 swatch
     edges and the phone really does draw its own casing -- but a CEILING, so the next lane
     to touch these cannot quietly add a pile. Numbers measured 9/18 on the shipped build. */
  const CEILING = { outfitpanel: 0, savepanel: 0, devtray: 0, daycard: 0, keypanel: 32, cityfeed: 4 };
  for (const id of Object.keys(CEILING)) {
    const r = await paintsWith(d.fr, id);
    if (r.missing) { ok('the ' + id + ' is only built when he opens it, so it is not on his screen', true); continue; }
    ok('with ' + id + ' open the street draws no more than ' + CEILING[id] + ' one-pixel edges',
       r.hair.length <= CEILING[id], r.hair.length + ' drawn: ' + uniq(r.hair).slice(0, 3).join(' '));
  }

  /* AND THE PHONE'S FOUR ARE ITS OWN BODY, WHICH IS THE POINT OF THE PHONE.
     [phone object] built a casing with real thickness, tape over the top edge and a cracked
     screen. Its edges are a thing's edges, which is what the law asks for; stripping them to
     make a number fall would be the ruler counting the cure as the disease, which this lane
     has already done once. Named so nobody does it by accident. */
  const phone = await paintsWith(d.fr, 'cityfeed');
  ok('the phone\'s remaining edges are the phone\'s own body, not a card round a group',
     phone.missing || uniq(phone.hair).every(x => /^#cityfeed/.test(x) || /^#stage/.test(x)),
     uniq(phone.hair).join(' '));

  ok('nothing threw while walking the street', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  await d.close();
  console.log('\nTHE STREET DRAWS NO HAIRLINES: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
