# ALL THE WAY OUT THE OTHER SIDE (8/25/26, PEOPLE lane)

## THE DEMO'S FIRST TEN MINUTES NOW HAVE A MACHINE BEHIND EVERY LINK.
## THE LAST ONE WAS THE SEAM WHERE THE STORY HANDS YOU A DAY.

Two turns ago: the cold open plays, 26 beats, and hands you into the tutorial
fight. One turn ago: the fight comes back, and the three scenes after it had been
playing inside a hidden panel. This one is the end of the line, and it is the link
nobody could have checked because **both demo gates enter the day through a side
door**:

| gate | how it reaches the day |
|---|---|
| `demo_gate.js` | taps `#openSkip` |
| `the_whole_demo_gate.js` | taps `#openNot` (declines) |

Neither has ever walked out of the finished story into a playable day. That is the
seam this lane owns, and it had never been crossed by anybody.

---

## MEASURED, ON THE REAL SURFACE, FROM A CLEARED PHONE

```
scenes played   act1_cold_open -> act1_the_last_room
                -> act1_grief_dinner -> act1_ridge_burial
captions        40
runtime         164 seconds, tap to standing in the day
page errors     0
ends on         p-city, 390x804, tab=run, world frame live in the live panel
opening seen    yes
```

**It works.** A player who watches the whole story lands on the full-size surface
the RUN tab actually shows, with the world in it. Demo rows 7 and 10 are now
proven from the first tap to a playable day, with nothing skipped and nothing
declined.

---

## THE GATE: 48 -> 53

Five claims, all continuing on the page section 5 already has open, so the only
cost is the scenes that were going to play anyway:

- **the whole sequence plays**, every scene the chain names, in order
- and the opening **ends on its own**
- **and it puts you in a day**: a live panel with real area holding a world frame
  with real area
- and that surface is **the one the RUN tab shows**
- and having watched the whole thing, **it never asks again**

The scene list is walked on the page through one shared helper, so the chain walk
and the post-fight claims read one source. A rewrite in the DIRECT tab moves the
target instead of breaking the claim.

**THE WORLD FRAME IS MEASURED FROM THE PARENT ONLY.** A `file://` iframe is an
opaque origin; reading the city's own state throws a SecurityError and teaches
nothing. So the claim is what a person can see: a frame with real area, inside the
panel that is actually live.

---

## THE MISTAKE, AND IT IS THE SAME ONE I FIXED THIS MORNING

The first probe asked "is the opening over?" like this:

```js
!OPEN_RUNNING && !overlayVisible
```

and reported **the opening finished in 65 seconds having played one scene of
four.**

That condition is also true **in the middle of the fight**, when the runtime
stands down and the overlay is hidden so combat can have the screen. A
termination condition that matches the middle is not a termination condition.

This is the identical shape as the vacuous pass closed in this same gate hours
earlier, where "not showing and not running" would have gone green on a scene that
never started. I found that one, wrote the law down, and then made it again in a
probe the same day. The honest terminator is **the last scene of the chain, read
from the chain**, and only then the quiet.

Fourth probe error this session. None of the four reached a record as a finding,
because each was caught the same way: measure again before writing it up.

## THE MUTATION PROOF

**THE GATE HAS TO CREATE THE CASE IT CLAIMS TO TEST.** Three breaks, real gate
each time, alpha restored from a byte-for-byte backup after every run.

| break | result |
|---|---|
| **MA** the last scene of the chain renamed out from under the handoff | **2 red** - the static chain walk names the broken link (`-> !!act1_ridge_burial`) AND the live playthrough reports `3/4` with the missing scene named |
| **MB** the overlay never comes down when the story ends | **2 red** - `the opening ENDS on its own` (still 40 captions: the story played, the curtain never lifted) plus the existing SKIP stranding claim |
| **MC** the day surface never gets its world frame | **1 red** - `AND IT PUTS YOU IN A DAY (p-city 390x804, frame 0x0)`: the panel is fine, the world is missing, and the message says which |

**Three of the five new claims have been red.** The two that have not:
"that surface is the one the RUN tab shows" and "having watched the whole thing,
it never asks again" - the second is the same localStorage key already proven red
three times by the previous turn's M1, M3 and M4. Named rather than implied.

## THE MACHINE

| file | what |
|---|---|
| `gates/opening_gate.js` | 48 -> 53 claims; the into-the-day block and a shared `chainOf` |
