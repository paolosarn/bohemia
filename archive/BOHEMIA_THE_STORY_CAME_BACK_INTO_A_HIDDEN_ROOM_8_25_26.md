# THE STORY CAME BACK INTO A HIDDEN ROOM (8/25/26, PEOPLE lane)

## THE OPENING IS FOUR SCENES WITH A FIGHT IN THE MIDDLE. THREE OF THEM HAD
## NEVER BEEN SEEN BY ANYBODY, AND ONE MEASUREMENT SHOWS WHY.

Earlier today this lane proved the cold open plays end to end and hands the
player into the tutorial fight. That closed demo rows 7 and 10. It also left one
thing standing that the gate said out loud and did not check:

> "a gate cannot win the tutorial fight to reach scenes 2 through 4"

The 7/19 opening vision is **one unbroken sequence**: night raid, grief dinner,
burial on the ridge. So everything after the fight had never been played by
anybody, human or machine.

---

## WHAT WAS ACTUALLY HAPPENING

Driven on the real surface, through the seam COMBAT publishes:

```
overlay parent   p-city          <- where the opening put it
live panel       p-run           <- where the resume put the player
overlay box      0 x 0
OPEN_RUNNING     true
playing scene    act1_ridge_burial
captions         32 and climbing
```

**The rest of the opening was running perfectly and nobody could see it.** The
last room, the grief dinner and the burial all played, in order, with captions
advancing, inside a panel that was not on screen.

That is this file's own documented lie, committed again:

> "a flex child of a display:none parent still COMPUTES display:flex, so this
> check said yes, the canvas really was painting, the captions really were
> advancing, and the bounding box was 0x0"

It survived because it lives in the one path nobody had ever run.

## TWO CAUSES, BOTH THIS LANE'S

**1. The overlay only ever followed the live panel ONCE.** `openStart` parents it
to whatever panel is live when the opening begins. `openPlay` -- the door every
scene of the sequence goes through -- only set `display`. So scene two inherited
scene one's host and never moved again.

**2. `showTabPanel('run')` does not put you where the RUN tab puts you.** Paolo
put the city in the run tab on 7/28 and the tab's own click handler honours it:

```js
var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
```

`showTabPanel` does the literal thing and lights `p-run`, the parked hidden panel
that exists only so postMessage can still find the run iframe. **Two switchers,
one routing rule, and the resume path used the one that disagrees.**

## THE FIX, AT THE GENERATOR

Both in `tools/bohemia_opening_patch.py`, not in the alpha it writes. Fixing the
output and leaving the generator is the exact mistake this lane paid for hours
earlier today, when a tool of mine kept re-hiding two modules another lane had
already repaired.

- `openPlay` re-parents to `openHost()` on **every** scene, so the overlay follows
  the live panel through one door instead of once at the start.
- `resume()` taps the RUN tab the way a finger taps it, so the one routing rule
  stays in one place. `showTabPanel` is kept as the fallback, so this can never be
  worse than it was.

```
before   parent p-city   live p-run    box 0x0      invisible
after    parent p-city   live p-city   box 390x804  playing act1_the_last_room
```

## AND THE WHOLE SEQUENCE, SEEN FOR THE FIRST TIME

```
act1_cold_open      -> COMBAT (startColdOpen, 2 hostiles, objective "defend")
act1_the_last_room     "Where's NINA."   "Don't go back in there."
act1_grief_dinner      "I picked the green ones out. Force of habit."
                       "I miss them so much, I can't."
                       "We go up in the morning. Wear something you don't mind ruining."
act1_ridge_burial      "THE NEXT MORNING"
```

`{sibling_lost}` resolves to NINA, which is the 7/19 canon holding: the sister is
the one lost.

---

## THE GATE: 40 -> 48

The claim that let this through was **mine, and it was shallow**. It read the live
TAB after the handoff and stopped:

> AND IT ACTUALLY TOOK YOU THERE -- the live tab is the one the scene hands off to

True, and it passes on a COMBAT tab with no fight in it. **A room is not what
happens in the room.** The eight new claims ask the rest:

- the raid starts a real fight, with the encounter id **the scene named**
- and the fight is carrying the way back (it was handed an `onEnd`)
- the encounter settles through the seam COMBAT publishes
- **when the fight ends the story comes back** -- overlay returns, with area
- and resumes into the scene **the handoff named**
- and every line of that scene reaches the screen
- and the caption kept moving after the fight

Everything is read from the scene's own handoff, so a rewrite in the DIRECT tab
moves the target rather than breaking the claim.

### WHOSE HALF IS WHOSE

Invoking `onEnd` here is the honest test, not a side door. COMBAT's contract is
that a settled encounter calls `onEnd`, win or lose -- their end path does it
unconditionally, after the sting, outside the victory branch, and **their** gate
owns proving it. This lane's contract is the other half: when `onEnd` fires, the
story comes back. Winning the fight instead would mean another lane's combat
balance decides whether my story is broken.

## TWO PROBE ERRORS, BOTH CAUGHT BY MEASURING TWICE

1. **"There is no fight."** The first probe read `G.encounter` the moment the
   combat tab went live and found nothing. The handoff deliberately waits for the
   frame and then 250ms more, so **the tab is live before the fight is**. One
   write-up away from filing a bug in another lane's working code. The gate now
   waits for the encounter, and says why in a comment.
2. **"Only 1 of 2 lines played."** The gate waited for the FIRST line of the next
   scene and then asserted ALL of them. Same shape as the vacuous pass closed
   earlier today: the claim was right, the moment of measurement was wrong.

That is three probe errors across this session, every one caught the same way --
by measuring again instead of writing it up.

## THE MUTATION PROOF, AND IT CORRECTED ME

**THE GATE HAS TO CREATE THE CASE IT CLAIMS TO TEST.** Four breaks, real gate
each time, alpha restored from a byte-for-byte backup after every run.

| break | result |
|---|---|
| **M1** the raid hands the fight no way back (`onEnd` dropped) | **6 red** - carries the way back; settles through the seam; story comes back; resumes into the named scene; 0/2 lines; caption frozen at 15 |
| **M2** the re-parent fix removed, on its own | **GREEN, 48/0** |
| **M3** the sequence never resumes (`openContinue` returns false) | **4 red** |
| **M4** BOTH fixes reverted, the exact code that was shipping | **1 red** - `WHEN THE FIGHT ENDS THE STORY COMES BACK` |

**M2 IS THE ONE THAT TAUGHT ME SOMETHING, AND I HAD ALREADY WRITTEN THE OPPOSITE.**
I set out believing both fixes were needed. They are not. Once `resume()` routes
the way the tab bar routes, the live panel IS `p-city`, which is where the overlay
already lives, so the re-parent never fires. **The routing fix is the whole fix.**

The re-parent stays anyway, and the reason is narrow enough to state honestly: it
makes `openPlay` obey the invariant `openStart` already obeys, so every scene of
the sequence goes through one rule instead of inheriting the first scene's host.
It is not load-bearing today and M2 is the proof of that. It is not credited with
fixing anything.

**M4 is the claim that matters**: with the shipped code restored, the gate goes
red, on the right assertion, for the right reason. The bug cannot come back
unnoticed.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_opening_patch.py` | both fixes, at the generator |
| `slices/BOHEMIA_ALPHA_0_9.html` | regenerated from it |
| `gates/opening_gate.js` | 40 -> 48 claims; the post-fight block |
