# BUILD WHERE YOU ARE STANDING — and the cache whose "one frame" lasted forever
(9/5/26, LIFE + CITY lane. VAMILY job `[builder reachable] BUILDER-WHERE-HE-WALKS`.)

## HALF THE BRIEF WAS ALREADY FALSE, AND I MEASURED IT BEFORE BUILDING ANYTHING

The job read: *"the build verbs and panel reach the walked surface and the demo;
today they live only in the aerial tab."*

Driven on the **real cut demo**, through the splash, as a player: the CITY button is
there, the panel opens on a plot, BUILD is live. **The builder has reached the demo
for some time.** The note that said otherwise — mine, from the round that shipped
`[builder works]` — was grepping `BOHEMIA_RUN_CURRENT.html` for `cityTapPlot`, and the
demo does not build its city from that file: it loads `BOHEMIA_CITY_WORLD.html` in an
iframe. **A grep over the wrong artefact is not a measurement**, and it sat in a STATE
line for two rounds looking exactly like one.

## WHAT WAS ACTUALLY MISSING IS THE OTHER HALF OF THE JOB'S OWN NAME

`cityTapPlot` was guarded by `MODE==='city'`. So a player standing on the street could
not touch the city he is rebuilding without first leaving it and looking down at it
from the air. **The city he is rebuilding was a thing he could only reach from a
helicopter.**

## WHAT SHIPPED

A **BUILD HERE** chip on the walked surface, beside SLEEP and MARKET in the bottom-left
column — joined to that column *the day it was born*, because every chip that skipped
it is a bug that function has a paragraph about.

Tapping it opens **the same panel** for the cell under his feet: same verbs, the same
skeleton-is-sacred rule, the same one battery. A second builder for the street would be
a second set of rules to keep in step with the first, which is the bug this file has
fixed six times. It is a **toggle** (the chip is the only way in, so it has to be the
way out too) and the panel grows an **X** in human mode, because on foot there is no
plot to tap a second time.

It is **not** offered in the aerial view, where tapping a plot already does this. One
door per room.

## THE BUG THIS JOB EXPOSED, WHICH IS THE REAL FIND

The first drive through it demolished the plot under the player's feet, the delta took
the edit — and `om.at` kept answering **SUBURB**. So the panel offered DEMOLISH a
second time, and the next BUILD was refused as *"build only on empty desert"* for a
plot that was already desert.

The edit-seam frame cache argues, in its own comment, that it is safe because *"within
a single frame the map cannot change"*. That rule is right. But the only thing that
advances `CITY_FRAME` is the **city render**, and the walked surface never runs one —
so on foot the "one frame" lifetime quietly became **forever**.

**The cache was never wrong about its rule, only about who was keeping it.** It was
invisible until now because until this round the only way to edit was in city mode,
where `render()` bumps the counter one line later. **A new door found an old hole.**

Fixed where an edit happens (`CBafterEdit` bumps the counter), which makes the stated
lifetime true again rather than adding a fourth cache with a fourth argument about when
it dies.

## THE GATE

`gates/builder_where_he_walks_gate.js`, **16 pass / 0 fail**, on the walked surface
**and** in the cut demo (rule 7).

A2 and A3 hold **reachability, not existence** — the 8/27 lesson, where a chip at a
hardcoded offset sat under `#blstack`, a real click on it timed out, and a gate reading
its *text* called it fine. A5 and B5 ask **`om.at`, the world**, not the delta, which
is the only reason the cache bug was caught rather than shipped.

| mutation | legs that went red |
|---|---|
| remove the seam-cache bump | A5, A6, A7, B5 |
| restore the `MODE==='city'` guard | 7 legs |
| show the chip in every mode | A9 |

## AND ITS OWN DEMO SECTION WENT RED TWICE ON INNOCENT CONTROLS

1. **The cold open card.** `#daycard` is `inset:0`, z-index 40. Nothing had tapped GET
   UP inside the frame, so the chip was drawn and unpressable.
2. **The invite banner.** `#openInvite` — *"DAY 1 BEGINS BEFORE THE DAY"* — is
   `absolute; left:0; right:0; top:0; z-index:39`, lying **across the top of the city
   frame**, so until a player answers it (WATCH / NOT NOW) it swallows every tap in the
   top band of the screen. That is exactly where the build panel lives.

The second one was worth the hunt, because both halves of the evidence were true and
only one of them decided: `elementFromPoint` **inside** the frame said `cbdem`;
the same point in the **parent** said `openNot`. What turned the theory into a
measurement was a ladder of taps down the screen — every y reached the frame except the
one under the banner.

**Third time this lane has written a gate that skipped a step the player cannot skip.**
The button was innocent all three times. *Walk the game, never your memory of it.*

## WHERE THIS STOPS

What you build on foot changes the world model and the walked streets regenerate from
it — but whether the **building itself is standing there in the art** when you walk up
to it is `[buildings appear] A-BUILDING-YOU-PLACED-SHOWS-UP-ON-FOOT`, further down this
lane's queue. Not absorbed into this one.

## THE STANDING NOTE

**A CACHE'S LIFETIME IS A PROMISE ABOUT WHO WILL END IT.** This one named a frame that,
on half the game's surfaces, never comes. Two rounds of building on foot would have
been impossible and the code would have looked correct the whole time.
