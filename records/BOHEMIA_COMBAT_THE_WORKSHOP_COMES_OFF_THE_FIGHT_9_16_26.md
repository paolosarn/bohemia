# V220 — THE WORKSHOP COMES OFF THE FIGHT (COMBAT lane, `[eyes: dev strip]`)

EYES E26 round 7 walked **the deploy cut** — what he actually opens, not the committed
demo file — reproduced it on two walks and photographed it
(`records/eyes_e26_walk_deploy/04_04_cards.png`):

> a real fight arrives at about 02:05, and **across the top of it, above the health
> bar**: WAIT, SUPPRESS, HAND-PEEK: OFF, NEW ENCOUNTER, WAY OUT 14T — and the gear's
> own chip pushed off the corner, reading as the fragment "TTINGS".

**PAOLO 9/13: "this glitchy buggy AI experience where nothing's complete."**

The first fight in the game arrived with the tools used to build it left on screen.

---

## MEASURED FIRST, IN A REAL FIGHT STARTED THE WAY HE STARTS ONE

The row says four of the five do nothing when pressed. Pressed here, on a real
encounter, under the rule 14(h) test — the panel had to stay open and something the
fight owns had to move:

```
WAIT            WORKS   readout "A FIGHT HAS STARTED" -> "STEADY +5%"
SUPPRESS        WORKS   readout -> "PINNED 1"
HAND-PEEK: OFF  WORKS   label flips to HAND-PEEK: ON
NEW ENCOUNTER   WORKS   it restarts the fight, which is the developer action
ARENA           WORKS   label STREET #72978 -> STREET #93429
```

> **They are not dead buttons, and that is worse: they are live developer controls
> over a stranger's fight.** NEW ENCOUNTER really does throw away the fight he is in.
> ARENA really does re-roll the ground under him.

And the strip is **a fifth of his screen**: `#chud` measured 181 px of an 890 px
viewport, all of it above the board.

## I GOT THE LIST WRONG TWICE, BOTH TIMES THE SAME WAY

My first probe reported WAGER, PATTERN, the kit row and STAIRS with a bounding box of
`[0,0,0,0]`, and I wrote two confident sentences off it: that **WAGER was dead**, and
then that **the strip was so overloaded it clipped its own controls off the screen**.

**Both are false.** The probe asked `getComputedStyle(el).display`, and a node inside a
`display:none` **ancestor** keeps its own display value — so *"inside the closed
settings panel"* and *"clipped off the screen"* read identically. Asked properly, with
`offsetParent` and `getClientRects`, on clean main, in a real fight:

```
ON HIS SCREEN   WAIT, SUPPRESS, the kit row, SHOVE, HAND-PEEK, NEW ENCOUNTER, ARENA
ALREADY NOT     the comment box, WAGER, PATTERN, the perk tree, STAIRS
```

**Which is exactly what EYES photographed.** Their picture shows HAND-PEEK and NEW
ENCOUNTER and nothing else from the workshop. The photograph was right and my
instrument was wrong, twice. The list is **three**, not six.

## WHAT SHIPPED, AND IT IS THE MOVE HE HAS ALREADY MADE FIVE TIMES HIMSELF

The top row's own comments are a history of him clearing it out: DASH and VAULT (V122,
*"I never use them"*), SPRINT (V123, *"I NEED YOU TO HAVE SPRINT OFF THE TOP MENU BC
ITS IN THE GAMEPLAY UI NOW"*), GRENADE (V124, *"bro i needed you to get rid of the
grenade button too bro wtf"*), the stamina pips (V129). Same complaint every time, and
every time **the function was kept and the button moved.** This is the sixth.

**HAND-PEEK, NEW ENCOUNTER and ARENA move into the workshop panel he already has** —
the gear, whose own heading is DEMO SETTINGS and which already holds FOES, RESET
FIGHT, THE OPEN BOOK, the tile dials, the boss list, and (it turns out) the comment
box, WAGER and PATTERN.

**Moved, not rewired, which is the whole reason this is safe.** `appendChild` moves a
live node and its listeners with it, so not one handler is re-bound, nothing is
duplicated, there is no second copy to drift, and nothing is deleted.

What stays on the strip is the game: **WAIT, SUPPRESS, the kit charges, the perk tree,
SHOVE and STAIRS** — every one a verb, and the two the row accused are measured
working.

## AND THE LAST DEVELOPER STRING ON HIS SCREEN WAS THE MAN'S NAME

With the strip cleared, the one control left up there read:

```
SHOVE hostile_0 (stun 1 · 30%)
```

`hostile_0` is a variable name on a button a stranger presses. **It was invented in one
place and nowhere else**: the door fabricated a name for every man the city sent
(`name: r.name || ('hostile_' + i)`), while `applyRoster`'s own rule is
`if (r.name) e.n = r.name` — it only overrides when a name **exists**. So the fallback
was overwriting the archetype's own word (SHIV, MEDIC, SNIPER, BREACHER, GOON, which
the bench has always shown) with an id.

Removing the fallback hands the display name back to the table that already has one.
**Nothing is invented and nothing is ruled**: who these people *are* is canon and still
his, `eid` is untouched so identity does not move, and this **deletes** a made-up
string rather than adding one. The button now reads `SHOVE GOON (stun 1 · 30%)`.

## PROOF

`dev_strip_gate` — **9 passed, 0 failed.** It starts a real fight by tapping a body on
the street and then asks two questions that must **both** be true, because either one
alone is a way to cheat: *is the workshop off his screen*, and *does every one of those
controls still work* — a gate that only asked the first would pass if I deleted them.

```
the strip            181 px -> 111 px
on his screen        HAND-PEEK, NEW ENCOUNTER, ARENA: not on screen
still exist          all three
behind the gear      all three, reachable, and each one still acts when pressed
what he can read     SETTINGS · YOU · 100/100 · WAIT · SUPPRESS ·
                     SHOVE GOON (stun 1 · 30%) · WAY OUT 4T · out on the block
developer strings    none
```

**Mutation-proved three ways:** skip the move → the *not on his screen*, *strip is
smaller*, *moved into the group* and *they still work* arms go red; **delete** them
instead of moving → the *none deleted* arm goes red and the screen arm reports
`absent` rather than passing; put the fabricated name back → the *no developer string*
arm goes red on `SHOVE hostile_0`.

Confirmed on a photograph, which is how it was found and how the name was found after
it.

## THE DIAL

This moves DOM nodes and deletes one fabricated string. Not one number in a fight is
touched.

## ROUTED

- **The cold open still fabricates names.** `slices/BOHEMIA_ALPHA_0_9.html` builds its
  cold-open roster with `name: 'hostile_' + i` explicitly. That scene is RUN's, so the
  line is named here rather than changed.
- **`getComputedStyle(el).display` cannot see a hidden ancestor.** It cost me two wrong
  answers in one round, and it is the same family as the three instrument defects from
  the round before. Any check of *"is this on his screen"* wants `offsetParent` and
  `getClientRects`, and rule 14(h)'s panel test wants the same.

---

**Tool:** `tools/bohemia_workshop_off_the_fight_patch.py` (MARK
`__THE_WORKSHOP_IS_BEHIND_THE_GEAR__`, the fight blob and one line of the shell) ·
**Gate:** `gates/dev_strip_gate.js` · **Tab:** COMBAT, and any fight you walk into from
CITY.
