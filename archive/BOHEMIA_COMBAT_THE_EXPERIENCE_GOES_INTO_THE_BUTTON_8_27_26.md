# V189 — THE EXPERIENCE GOES INTO THE BUTTON
### COMBAT lane, 8/27/26. He remembered a feature correctly, and it was half-connected.

---

## WHAT HE SAID

> *"BRO WHEN U KILLED PEOPLE OR DROPPED THEM BACK A MONTH AGO **THE EXPERIENCE
> WOULD LOAD INTO YOUR BAR INTO YOUR CHARACTER INTO THE ACTION BUTTON WHERE YOUR
> FACE IS** WHATS UP WITH THAT?"*

**He is right, he is precise, and nothing was deleted.**

The **GHOST CHIP** (Paolo 7/3/26) is a gold experience mote that arcs out of a
body and homes on the fire button. The code has always said so in its own words —
it sets the target to `ex2=W-92, ey2=H-92` and labels that **"the fire-button
corner: you"**. It even accelerates on the way in.

---

## TWO THINGS WERE MISSING, AND THEY ARE THE SAME OMISSION

**The loop was built from both ends and never joined in the middle.**

**1. The chip fired at the killshot, not where the experience lands.** V181
(8/25) moved the experience **onto the body** and made you walk to it, on his own
ruling — *"you get experience and loot off their bodies."* The chip kept spawning
at the moment of the kill. **So the mote and the money came apart:** gold flies
when you drop someone, and you collect the experience thirty seconds later by
walking, with nothing on screen.

**2. The button never got its meter.** The 7/3 comment ends: *"**the green meter
is XP-bound later**; this is its currency in flight."* Later never came. That
button has carried his **face**, his **health** and a **stamina orb** since V129
and has never carried experience at all — **so the chips have been flying home to
a button with nothing to fill, for nearly two months.**

**And it could not have been built before yesterday.** V188's tree is the first
thing in this game that gives experience a destination and a **next level** to be
a fraction of.

---

## WHAT SHIPS

- **The chips fly when the experience actually lands** — out of the body you just
  walked onto, one per five points, homing on the button exactly as they always
  have. The killshot chip is untouched: V85 already ruled those are separate
  moments — *"the stop belongs to the kill, the reward comes after it."*
- **A gold rim on the button**, filling clockwise as you close on the next level.
  **Gold, matching the chip that feeds it**, so the thing arriving and the thing
  filling are visibly one substance — and deliberately **not green**, because the
  fluid behind it is stamina and two greens in one circle is the mush he
  complained about in the music.
- **A level is a moment**, not a number that quietly ticks over.

---

## MEASURED ON THE REAL SURFACE

| | |
|---|---|
| chips off the body you walk onto | **0 → 3**, paying 15 xp |
| gold rim strokes at 0% / 50% / 90% | **0 / 1 / 1** |
| **arc sweep as a fraction of a circle** | **0.5 and 0.9** |
| damage, empty tree vs five levels | 40 → 40 |
| page errors | 0 |

**Measured as an angle, not a stroke count.** That is V179's lesson: counting a
draw proves it *runs*, never that it is *proportional*. **A meter that always
painted the same arc would pass a stroke count happily.**

---

## AND THE CACHE KEY, WHICH IS THE WHOLE REASON THIS COULD LOOK FINISHED AND DO NOTHING

That button is **cached** — on backdrop, wash, hp tier, stamina and lean. **A
meter that is not in the key repaints never.** The fraction is in the key now,
quantised to 40 steps so a single point of experience does not repaint it.

This is the same class as V129's own discovery that drawing the stamina fluid
**behind** an opaque portrait produced a **byte-identical button at zero stamina
and at full.**

---

## TWO THINGS THE HARNESS TAUGHT, BOTH WORTH KEEPING

**THE PORTRAITS NEVER LOAD IN A HEADLESS BOOT.** `paintFireButton` returns false
the instant `SPR.portraits` is missing, so **nothing inside it runs** and the rim
could not be judged at all. The gate now hands it a real 64x64 canvas — the
smallest thing that lets the **shipped painter** run end to end — and says so out
loud. Everything measured after that line is shipped code.

**AND A COMMENT I WROTE BROKE THE ENTIRE FILE.** The first cut of this quoted the
7/3 code *inside* my own block comment, and the quoted fragment contained a
comment-closing marker. **That ended my comment early and turned the rest of the
combat script into garbage** — `TREE is not defined`, nothing ran. Found by
bisecting the five edits one at a time against a syntax check, which located it in
one pass. **Never quote code containing `*/` inside a block comment.**

---

## GATES

- `fight_moves_you_gate.js` — **114 pass / 0 fail**
- `combat_lab_gate.js` — **930 pass / 1 fail** (the pre-existing fight-music
  ladder red from another session, unchanged)
- `one_engine_gate.js` — **3 pass / 0 fail**

One claim re-pointed: **V129's** orb-in-front check, whose 900-character window
the new rim outgrew. The claim is about **order** and is unchanged.

---

## WHERE HE FINDS IT

**COMBAT tab.** Drop somebody, walk onto the body: gold comes off it and flies
into the button under your thumb, and the ring around your face fills. Fill it and
you level.
