# V214 — THE FIGHT WEARS THE GAME'S OWN FACE, and the five-minute claim is corrected (COMBAT lane)

Two pieces of work, both of them corrections to things this lane shipped.

---

# PART ONE: MY OWN FIVE-MINUTE CLAIM WAS WRONG BY SEVEN TIMES

Last round I shipped `[first fight]` and wrote that the card arrives **"at step 58,
about 29 seconds."** That number was wrong, and it was wrong in the direction that
matters: if he walks for thirty seconds expecting a fight and gets nothing, he
concludes it is still broken.

**The error was the unit.** My gate called `stepOnce` in a loop and converted loop
iterations to seconds at one step per beat (120 BPM, two a second). **A real
held-press walk is nothing like that fast.**

Driven with a thumb on the real dial, the way EYES E26 walked it:

```
ten two-second held presses    6 fine cells in 22 seconds
a five-minute walk             about 81 cells
one 20-second continuous hold  0 cells  (the latch letting go at a wall -- correct)
```

And the card, measured in the same unit on three runs: **55 cells actually walked,
identically every time.**

> 55 of 81 cells. **The card lands about three and a half minutes in, not at
> twenty-nine seconds** — inside the five minutes, with about twenty-six cells of
> margin, and no more.

The row still holds. The number I put on it did not. The gate now measures in **cells
actually walked** against a measured five-minute budget, and says so in the claim, so
nobody reads loop iterations as seconds again.

**And EYES's own "no fight in five minutes" was measured at 21:56, six minutes before
my fix landed at 22:02.** Their finding was true of the tree they walked. It is worth
saying plainly rather than leaving the impression the fix failed.

---

# PART TWO: THE FIGHT WAS FETCHING ITS FONT FROM GOOGLE

A bounce-back from **EYES E26, the stranger's list, item 3**, routed to "COMBAT and
UI". It is this lane's file, so this lane fixed it.

> *"THE FIGHT IS TYPESET IN SPACE GROTESK AND FETCHES IT FROM GOOGLE FONTS. The one
> failed request of the five minutes is `fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk`
> from about:srcdoc... 42 mentions.
> `laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md` bans it BY NAME."*

Two separate faults in one line. The law lists that face as a **named tell**. And it
is a **network request, from a srcdoc document, on a phone, in the first five
minutes** — the only failed request of the whole walk. A fight that needs the internet
to draw its own text looks broken on a bad connection, which is the *"glitchy, buggy,
nothing's complete"* he opened rule 14 with.

## THE FIX IS REUSE, NOT A TYPEFACE DECISION

The typeface is not this lane's to choose, so it did not choose one. The walked city
already carries the game's three faces — **BohemiaROM, BohemiaBody, BohemiaMono at two
weights** — as `@font-face` blocks with the woff2 **embedded as data URIs**, costing no
request at all. Those four blocks are copied **verbatim** into the fight's document
and the fight's text points at them.

Measured before copying, because 1.35 MB of blob does not need bloating: **32.5 KB of
CSS, about 43 KB on the alpha.** That buys three embedded faces and removes a network
request.

## VERIFIED ON THE REAL SURFACE

```
body font           BohemiaBody, sans-serif
stylesheet links    0
BohemiaBody         loaded
"Space Grotesk"     gone, 42 to 0
EXTERNAL REQUESTS   0
FAILED REQUESTS     0
```

## TWO MISTAKES I MADE DOING IT

**ONE: my first swap broke the fight.** I used one regex that wrapped every hit in
quotes, which was right for CSS and wrong for the canvas strings:
`x.font='600 9px Space Grotesk, sans-serif'` became `x.font='600 9px 'BohemiaBody',
sans-serif'` — a terminated JS string. **The whole fight stopped defining `G`.** The
rout gate caught it immediately; **my tool's own guard did not**, because it checked
only that the words were gone, never that the file still parsed. Quoted stays quoted
and bare stays bare now, and every script in the blob is syntax-checked.

**TWO: a gate of ours was pinned to the mechanism instead of the claim.**
`combat_lab_gate`'s V66 arm asserts *"the cross-origin font no longer blocks combat's
boot"* — V66 measured a **12.9-second cold stall** from exactly this font and fixed it
with the `media="print" onload` trick. The arm pinned that trick's spelling. Removing
the font entirely means **there is no cross-origin font left to block anything**, which
delivers everything the claim asks for and more, and the arm went red anyway.

The lab gate's own note, twenty lines above it, says it best: *"A checker that fails a
change preserving everything it claims is pinned to the wrong thing."* The arm now
asks the claim — no cross-origin font can block the boot, satisfied either because
none is fetched (today) or because the one that is carries the non-blocking form.
**Amended out loud, claim kept, history kept.**

## PROOF

`the_rout_gate` — **11 passed, 0 failed**, with the font claim riding along in a gate
that already boots the alpha and opens the fight, rather than paying for a whole
browser of its own.

**Pre-push pass:** FIRST FIGHT 9/0, FIGHT MOVES YOU 170/0, THE ROUT 11/0, PLATE COSTS
TAPE 15/0, PICKUP 9/0, GUNS CLOSE 10/0, COMBAT ENTRY 43/0, BLOB INTEGRITY 107/0,
COMBAT LAB 929/3 (the same three pre-existing arms, baselined against a tree without
this change).

**Not mine, baselined the same way:** `enter_zoom_gate` reads **12/1 with and without
V214**, so that red belongs to somebody else's change or its own flake. It read 13/0
earlier the same round.

**The demo was not re-cut** — rule 14(a).

## THE DIAL

This is text. Nothing in the fight's rules is touched. No size, weight, colour,
letter-spacing or layout number moves: only the font's **name** changed in each
declaration, so every declaration's shape is byte-identical.

---

**Tools:** `tools/bohemia_fight_wears_the_game_face_patch.py` (MARK
`__FIGHT_WEARS_THE_GAME_FACE__`) · **Tab:** COMBAT.
