# THE NOTICE AT THE EDGE
FACTIONS lane · [horror signs] round three · rule 22 (cook every round) · 9/22/26

## THE ONE LINE
**This valley has three completely different rents and nothing has ever told the player
which one he is standing in.** On a fortress you pay for every block you walk on. In a camp
two blocks in three are free. Same valley, same night. This round made the board a crew
nails up where its ground starts, and every number on it is read out of the game.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## MEASURED FIRST, AND IT IS A REAL RULE NOBODY HAS SEEN
`BohemiaTowns.rentShape(tier, seats)` answers what a tier charges by **asking `rentOn()`
repeatedly until the window repeats** — a derived posted rate, never typed. One boot of the
one driver, on the real valley:

| tier | every | costs | free | who runs them |
|---|---|---|---|---|
| **fortress** | 1 block | 1 battery | **0** | Caravans, Cartel, Mob, Network, Remnants |
| **town** | 3 blocks | 2 batteries | **1** | Anarchists, Blues, Church, Reds |
| **camp** | 3 blocks | 1 battery | **2** | Colorful, Custom, Homeless, Trades, Volunteers |

**And he spawns on the worst of them.** Cell 48,48 is Mob fortress ground, block 122, and
Mob hold **1490 cells**, more than anybody in the valley. The first block of the game is the
harshest rent there is.

`ctRentLine` already produces *"Mob want 1 battery tonight for the 1 block of theirs you
have used"* — and it lives on a panel he has to open.

So the player's real decision, **walk two streets over and it is cheaper**, exists in the
rules and is invisible. The only way to learn it today is to lose batteries and guess.

## THE THIRD SILHOUETTE, AND THE FIRST LIVING ONE
Round one was a shop's pole sign. Round two was an agency monument. **Both are printed, and
both are leftovers of the dead world.**

This one is a plank on two stakes, made by hand with a brush, nailed over whatever was
there. That contrast is the whole reason it is a different shape:

> **The printed signs are the old world still talking. The painted ones are who runs it
> now.**

A player should be able to tell those apart across a street without reading a word. That is
the tone doing structural work instead of decorating.

## *** TEXT TOO WIDE FOR ITS PLATE HAS NOW HAPPENED THREE TIMES, SO THE KIT REPORTS IT ***
Round one ran OF THE SANDS off both edges of a chapel. This round ran *"1 BLOCK : 1
BATTERY"* and *"NOTHING HERE IS FREE"* off both edges of a plank.

Every time it is invisible in the source and obvious in the render. **Every time the fix was
local to one page, so the next sign hit it again.** That is the actual defect: not the
strings, the fact that nothing carried the lesson forward.

`c3` and `c5` now take the width the text has to live in, and anything too wide lands in
`K.overflows`, which the page prints in a red box. It still **draws** — clipping or
truncating would be a lie about what was asked for — but it cannot ship quietly.

**And the reporter immediately caught one I had already passed by eye.** *"COSTS 2
BATTERIES"* is 67 px in a 64 px space. Three pixels over. I had looked straight at the
render, seen three boards that fit, and called it fixed. The word COSTS came off every line,
which is better sign-writing anyway: a rate board says 3 BLOCKS / 2 BATTERIES and nothing
else.

That is the fourth time this lane has learned that **a clean answer from the wrong oracle
looks exactly like a fact** — and the first time the oracle it replaced was my own eye on a
picture I had already fixed once.

## AND ROUND ONE'S DEFECT CAME BACK IN A NEW COAT
The brush run-out was an identical block at the right-hand end of all three boards. **One
accident repeated is not an accident, it is a texture somebody pasted** — the exact thing
round one's corner stain did across six signs. It is placed off the crew's own name now,
fixed per sign, different between them, nothing random, and it tapers in two steps because
that is what a dry brush does.

## THE PUBLISHED SITE HAS CROSSED ITS SIZE CAP, AND IT IS NOT THIS LANE'S
`PAGES PUBLISH` went red this round: **261 MB against a 260 MB cap.** I flagged it at 257 MB
last round as "getting close and nobody's row yet". It is now over.

**Measured, not assumed:** with all four of this lane's pages removed from `slices/`, the
gate reads **261 MB and still fails**. Every page this lane has ever made totals under
100 KB, which does not register at MB resolution.

Where it actually is:

| | |
|---|---|
| `slices/` | 152 MB (88 MB html, 34 MB png, 29 MB js) |
| `records/target/` | 107 MB, of which **103.6 MB is 303 PNG files** |
| `engine/` | 4.7 MB |

**The cheapest lever, and it needs no judgement call:** about **20 MB of retired judge
pages are still being published** — TARGET_SCREEN_JUDGE 4.8 MB, LIVE_SLICE_V9 4.4 MB,
LIVE_SLICE_V11 3.0 MB, PERIMETER_JUDGE 2.3 MB and sixteen more. Rule 15 (9/14) killed every
one of them: *"No lane builds its own judge page again; the old eight present nothing new."*
The VOTE tab replaced them. Dropping them alone puts the surface back under the cap.

This matters beyond a red row. The 8/6 history is explicit: Pages failed **three commits in
a row**, thirty minutes then timeout, because the build was copying more than the product.
This is that coming back.

Not this lane's to fix — publish config is not FACTIONS' system, and rule 18 says only the
four things ship. Routed with the numbers.

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear. Registered as
`factions-the-notice-at-the-edge-9-22`.

## NOTED, NOT FIXED
**Church (#826c3e) and Trades (#674b34) read as the same board.** Two crews, two tiers,
one colour to the eye. That is already `[PENDING Paolo] 5` about colour clashes on the map,
and it is his call, so it is written down rather than touched.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched. One real thing made and registered where
he votes. The cook gate reads *"FACTIONS has cooked at least as recently as it has coded"*
and is now **14/0** — every making lane has caught up.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**When the same defect arrives a third time, stop fixing the instance and build the thing
that reports it.** Two rounds of fixing overflowing strings one page at a time taught
nothing; twenty lines that make the kit confess an overflow caught a fourth one inside the
same round, after I had already looked at the picture and passed it.
