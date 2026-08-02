# COMBAT GOES FULL SCREEN — AND MAIN IS BROKEN BY ANOTHER LANE (8/2/26)

## URGENT, AND IT IS NOT COMBAT'S: THE COMBAT TAB IS DEAD ON MAIN

While verifying the full-screen work I found that **the combat panel collapses to
0x0 on pristine `origin/main`**. The tab opens to nothing.

**BISECTED TO ONE COMMIT:**

| commit | combat panel |
|---|---|
| `5cf8c9f` COMBAT v116 | 430 x 846 |
| `dfc7f08` … `e1ac249` (7 commits) | 430 x 846 |
| **`e734666` "A DOOR IS THE WAY IN"** | **0 x 0** |

**COMBAT_B64 IS BYTE-IDENTICAL ACROSS THAT COMMIT.** Only `CITY_B64` changed
(+3,188 chars). So a CITY-lane change is killing the combat tab — almost
certainly a boot-time throw that aborts before the panel is built.

I have not touched it. ONE SYSTEM ONE SESSION says the city lane owns that blob,
and raiding it mid-flight is how two lanes destroy each other. **It needs their
eyes, and it needs them now, because the tab is dead for Paolo right now.**

The COMBAT RUNS smoke gate (built two turns ago) catches it in seconds — running
it on main is the fastest possible confirmation for whoever picks it up.

---

## THE FULL-SCREEN WORK (v117)

> *"Can you try to make the combat gameplay as full screen as realistic we can
> and anything that is already in the menu or whatever is like a Settings button"*

**WHERE IT WAS.** `#wrap` is a flex column — header, `#chud`, then `#stage` with
`flex:1`. The canvas got whatever was left after a logo, a comment box, a health
bar, an enemy board, a gap track, **thirteen buttons** and four readout lines had
taken their share. On a 430x900 phone the fight ran in a letterbox at roughly
half the screen.

**MEASURED AFTER: the field is ~83% of the screen.**

### THE FIRST ATTEMPT KILLED THE TAB, AND THE GATE CAUGHT IT

I first took the chrome out of flow — `position:fixed` on the header, the HUD and
the stage. **The parent panel is sized by its content and the content is this
document**, so removing everything from flow collapsed the iframe to 0x0.
MEASURED: panel 430x846 before, 0x0 after.

**The runtime smoke gate built two turns ago caught it before it shipped.** That
is precisely the class of bug it exists for, and it is the second time this week
it has paid for itself.

**So nothing leaves the flow.** The chrome just gets small and `#stage`'s `flex:1`
eats every pixel that frees up:

- the logo is gone (a title-screen thing, never a HUD thing)
- **the verb row scrolls sideways** instead of wrapping into a second and third
  row that shove the picture down
- the four readout lines lose their reserved empty height
- the enemy chip board collapses — it is a read the field already gives you
- `#stage` gets a hard floor of `64vh`, so the picture can never be squeezed back
  into a letterbox by anything added later

### AND "ANYTHING THAT IS LIKE A SETTINGS BUTTON" WENT BEHIND THE GEAR

That is the half of his sentence that actually buys the space. Five controls were
eating a third of the HUD and **not one of them is something you do while
somebody is shooting at you**:

| control | why it moved |
|---|---|
| live comment box + COPY | a verdict tool, not a fight control |
| NEW ENCOUNTER | you press it *between* fights |
| ARENA (re-roll) | same |
| PATTERN: AUTO | a debugging clamp, never a move |
| WAGER | set *before* the fight, never mid-turn |

They move **node and all**, so every listener already bound to them comes with
them untouched.

**NOTHING THAT RESOLVES A TURN MOVED.** If it changes what happens on the beat it
stays on the glass — burying a move behind a menu on a phone is worse than a
small screen.

### PROOF

v117 was verified against the **last known-good build** (`e1ac249`), because main
is broken by someone else: smoke gate clean, panel 430x846, field ~83%.
