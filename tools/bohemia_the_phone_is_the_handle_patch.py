#!/usr/bin/env python3
"""
THE LOUDEST BUTTON ON THE FIRST MORNING LED AWAY FROM THE GAME
(8/25/26, RUN lane. Backlog row P0-MORNING. Demo blocker, found 8/24, measured today.)

THE ROW SAID: "tapping ONLY the obvious primary button goes GET UP -> SLEEP ->
DAY 2 and never plays anything. A tester can finish the demo without ever meeting
the game."

I BUILT A COLD HAND AND IT IS WORSE THAN THAT. The probe scores every visible
control by what its pixels actually do -- fill brightness weighted hardest, then
border, then text, then area -- presses whatever wins, and never reads a word.
Twelve taps from a cold boot:

    1. WATCH        the opening      (correct, and the only good tap in the run)
    2. GET UP       the wake card    (correct)
    3. DROP IN      score 33         <-- and here the game ends
    4. CITY         score 33
    5. DROP IN ...  and so on, ten times, forever

    phone opened : 0
    job taken    : 0
    clock        : 06:00 at tap 1 and 06:00 at tap 12

HE NEVER EVEN REACHES SLEEP. He flips the camera between the street and the map
until he puts the phone down. And `__OFFER_RANG` is 1 the whole time -- THE PHONE
DID RING, at 06:00, and the hand never heard it, because the ringing phone is a
dark chip with a hairline border and a 14-pixel dot on the corner.

DON NORMAN NAMES THIS EXACTLY, and the row already cited him: AFFORDANCES are
what actions are possible, SIGNIFIERS are what tells you where the action goes,
and WHEN YOU HAVE TO PUT A SIGN ON A DOOR, THE DESIGN ALREADY FAILED. The badge
is a sign on a door. The fix cannot be more text, a tooltip, an arrow or a
tutorial line -- all of those are bigger signs on the same door.

=== THE FIX: THE PHONE WEARS THE GAME'S OWN "PRESS THIS" CLOTHES ==============

While a call is unread, #phonebtn takes the SOLID FILL the opening's WATCH button
already wears (#d8b45a on #191308). That is not a new signifier invented for this
bug -- it is the exact treatment the very first screen of the game uses to say
"this one", so by the time the player reaches the toolbar they have already been
taught it once and pressed it once.

*** AND IT HANGS OFF THE OWNER THAT ALREADY EXISTS. *** phoneBadge() computes
`(OFFER && !OFFER_TAKEN)` -- "there is an unread call" -- and is called from
offerRing() and from taking the job. It is the ONE place in the file that knows
this. So the class is toggled THERE and nowhere else. This week has been one long
argument for that: a door predicate copied into homeFind, an objective hint copied
into an inlined module, a toolbar offset copied into popwrap, and a population
card I gave a second writer on a 600ms poll and had to take back out. A second
thing deciding "is the phone ringing" is the same bug waiting.

NOT DAY ONE ONLY, ON PURPOSE. The row asked for 06:00 on day one; the honest rule
is "an unread call is the game asking for you", which is true every morning and
needs no date check to rot. Day one is covered because day one is the loudest case
of it.

IT SWITCHES ITSELF OFF. The moment he opens the phone and takes the job,
OFFER_TAKEN goes true, phoneBadge runs, and the chip is a chip again. A permanent
shout is just a louder sign on the same door.

NOT CHANGED: GET UP and SLEEP are untouched, exactly as the row requires. Nothing
moves, nothing is added to the screen, no word of copy is written. One chip
changes colour while the phone is ringing.

REUSE CHECK: no graphic pixels cooked -- this is a CSS class reusing the fill
already declared on #openWatch in the alpha, so no banks/ lookup applies.

Idempotent (marker __THE_PHONE_IS_THE_HANDLE__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_PHONE_IS_THE_HANDLE__'

# ------------------------------------------------------------- 1. the clothes
CSS_OLD = """#phonebtn:active{border-color:var(--acc);color:#fff}"""

CSS_NEW = """#phonebtn:active{border-color:var(--acc);color:#fff}
/* """ + MARK + """ (8/25) -- A RINGING PHONE LOOKS LIKE A BUTTON YOU PRESS.
   MEASURED with a cold hand that presses the loudest control on screen and never
   reads: from a cold boot it went WATCH, GET UP, then DROP IN / CITY / DROP IN /
   CITY ten times and stopped. Phone opened 0. Job taken 0. Clock 06:00 at the
   first tap and 06:00 at the twelfth. The phone HAD rung -- it was a dark chip
   with a hairline and a 14px dot, and the dot is a sign on a door (Norman: when
   you have to put a sign on a door, the design already failed).
   THIS IS NOT A NEW SIGNIFIER. It is the fill the opening's WATCH button wears,
   which is the first thing the player ever presses, so the language is already
   taught. It is worn ONLY while the call is unread and it takes itself off. */
#phonebtn.ring{background:#d8b45a;border-color:#d8b45a;color:#191308;font-weight:700}
#phonebtn.ring:active{background:#c8a44a;color:#0d0a04}
/* and the dot is redundant once the whole chip is lit: two signifiers for one
   fact is how a screen gets noisy. */
#phonebtn.ring #phonebadge{display:none !important}"""

# --------------------------------------------- 2. the one owner also dresses it
BADGE_OLD = """function phoneBadge(){
  var el=document.getElementById('phonebadge'); if(!el)return;
  var n=(OFFER&&!OFFER_TAKEN)?1:0;
  el.textContent=n?String(n):''; el.style.display=n?'block':'none';
}"""

BADGE_NEW = """function phoneBadge(){
  var el=document.getElementById('phonebadge');
  var n=(OFFER&&!OFFER_TAKEN)?1:0;
  if(el){ el.textContent=n?String(n):''; el.style.display=n?'block':'none'; }
  /* """ + MARK + """: THE SAME FACT, WORN LOUDER. This function is already the
     one place in the file that knows whether there is an unread call, and it is
     called from offerRing() and from taking the job -- so the chip's clothes are
     decided HERE and nowhere else. A second thing polling "is the phone ringing"
     is the bug I shipped into the population card on 8/24 and had to remove. */
  var b=document.getElementById('phonebtn');
  if(b) b.classList.toggle('ring', !!n);
}"""

EDITS = [
    (CSS_OLD, CSS_NEW, "the ringing chip wears the opening's own primary fill"),
    (BADGE_OLD, BADGE_NEW, 'and the one owner of "is it ringing" puts it on'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the phone already looks like the handle')
        return
    for needle, why in (('function offerRing(', 'the call that rings at 06:00'),
                        ("id=\"phonebtn\"", 'the chip in the toolbar'),
                        ('OFFER_TAKEN', 'the read/unread fact')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s' % CITY)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()
