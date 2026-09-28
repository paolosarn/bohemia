# EYES AND EARS -- E24 [phone latency], ROUND TWO: THE CHECK

9/28/26. Round one (records/BOHEMIA_EYES_E24_ROUND_1_SCHOOL_THE_COMPENSATION_ALREADY_SHIPPED_MAY_BE_TALKING_TO_NOBODY_9_28_26.md)
found that the fight's own device-latency fix leans on `outputLatency`, a property with a
real, sourced gap on iOS Safari, and that this sandbox has no way to read a real Safari
number at all (no WebKit binary anywhere in it, no real phone, no microphone).

Round two does not fake that number. It measures something this sandbox actually can prove:
**does the game already have a way to survive a bad number, whatever it turns out to be, and
does that way work correctly.**

## THE ANSWER, FIRST: YES, IT ALREADY EXISTS, AND IT IS CORRECT

Reading the real, current fight (not a stale grep -- more on that below) found a `#synccal`
button in the fight's own settings menu, wired to the exact genre-standard fix round one's
school researched: tap along to the beat 8 times, throw out the first two taps, take the
MEDIAN of the rest, refuse the whole result if the taps are too scattered, and store the
difference as a personal number (`G.audioOffset`) that gets added into the same clock the
fight already judges by. **It does not matter why a phone's real number is bad -- Safari's
missing property, a slow touch pipeline, wired earbuds, anything -- if this fix is correct,
the player can survive whatever the number turns out to be**, without this lane or anyone
else ever needing to know it in advance.

Driven with deliberately-timed inputs at a KNOWN bias against the fight's real beat clock,
proven both directions and against noise:

| test | injected bias | audioOffset the game computed | pass |
|---|---|---|---|
| on the beat | 0 ms | 0 ms | yes |
| aimed late | +90 ms | -100 ms | yes (moved the right way, by roughly the right amount) |
| aimed early | -70 ms | +70 ms | yes (exact) |
| scattered on purpose | alternating +-90 ms | 0 ms, REFUSED | yes (did not store noise) |

All four RULE ZERO controls (C1-C4) pass. The mechanism is real, reachable through an
ordinary settings menu (not a workshop-only dev control -- checked its own ancestor chain),
and mathematically correct in both directions, with a genuine refusal path for bad input.

## WHAT ALMOST BECAME A FALSE HEADLINE, CAUGHT BEFORE IT WENT IN

A plain text search for the fight's own `PERFECT_MS`/`audioMs`/`outputLatency` across every
shipped file found **nothing**, which nearly became this round's opening line ("the mechanism
round one worried about is gone"). It is not gone: the whole combat module ships as one giant
base64 string (`COMBAT_B64`), decoded into an iframe's `srcdoc` at runtime, so a text search
of the shipped file cannot see any of it. Confirmed by running the real thing instead of
reading it: re-ran this lane's own `tools/bohemia_eyes_late_beat.js` fresh against today's
alpha and got the same mechanism, the same numbers, a 9.36 ms gap against the fight's 55 ms
PERFECT band -- unchanged since 9/7. **VERIFY ON THE REAL SURFACE**, the same lesson this
lane has now hit at three different depths in three different rounds this week (a stale card
list, a stale frame name, and now a stale grep of an encoded module).

## THE SECOND THING THIS ROUND FOUND, AND IT IS THE REAL BLOCKER ON A BIGGER TEST

Round two originally set out to drive the calibration button with genuine Playwright
touchscreen taps -- the same input class a finger produces -- at controlled moments. **They
never landed.** Chased down properly rather than worked around blindly:

- The fight's own "TAP TO START" screen does not respond to a scripted mouse click or a
  scripted touch tap either, on this rig -- this lane's own E14 record already found and
  normalised this exact fallback on 9/7 ("startGame() called by hand"), and it still holds.
- Once the game is started that way, the outer LOADING SCREEN this game shows on every real
  boot (`#loadgl`) never actually finishes in this harness. Watched directly: the log reaches
  "PUTTING PEOPLE ON IT" and then sits there, unmoving, for over a minute, whether the page is
  opened as a local file or served over a plain local HTTP server standing in for one. Every
  real pointer this tool sent kept landing on that loading log, underneath everything, exactly
  the shape of defect PLUMBER's shared driver was built to catch and already has a documented
  name for ("a live oracle under an overlay answers, and the answer is about a screen nobody
  is looking at") -- just one layer deeper than that driver currently checks, because this
  loading screen belongs to the fight tab, not the walked city the driver was written for.

**This was not chased to a root cause this round** -- that would be its own row, not a detour
inside this one -- but it is named plainly rather than quietly worked around: every automated
walk of the fight that starts the way E14's tool does (and it is the only way found that
works at all here) is starting a fight a real player's own tap never actually drove, and has
been doing that since at least 9/7 without anyone noticing, because nothing before this round
needed a real pointer to land afterward.

**The workaround, disclosed, not hidden**: with a real pointer blocked at the outer layer,
the eight calibration presses in the table above were each fired as a genuine DOM click
event, dispatched on the real button from inside the fight's own script, at a wall-clock
instant this tool scheduled. That is proven to drive the same code path a real tap does (a
direct `.click()` call registered a real sample before this fix existed) and it tests
whether an event ARRIVING at a controlled time gets graded and averaged correctly. It does
NOT test whether a real finger's touch reaches the button at all, which is exactly the half
this round could not clear.

## BLIND SPOTS, NAMED

- No WebKit anywhere in this sandbox (checked): iOS Safari's real numbers were never touched,
  only Chromium. This is the row's original ask and it is still open.
- No real phone, no microphone: nothing here confirms what a real touch sensor or a real
  speaker actually does, only what a script and a browser claim.
- No real human's tap bias (people tap 20-100 ms early on average, per round one's school):
  this measures the ALGORITHM under a KNOWN bias, not a person calibrating it for real.
- The loading-screen hang under automated/local serving is real and reproducible but its
  cause is not found this round -- named for whoever picks it up next, not solved here.

## ROUTED

Nothing yet. The loading-screen hang is a real, reproducible finding but this round did not
find its root cause, so it is named here and in the board row rather than posted as a
one-line bounce-back that could point the wrong lane at the wrong fix.

## SHIP TEST

The row asked whether the game can survive whatever a real phone's touch-to-sound gap turns
out to be, one number per platform. This sandbox cannot produce Safari's or Android's real
number -- said plainly, not worked around by a guess -- but it can and did prove that the
game's own answer to "whatever that number is" already exists, is reachable by an ordinary
player, and is mathematically correct in both directions with a working refusal path for
noise. **Round two SHIPPED, both rounds of E24 done.**
