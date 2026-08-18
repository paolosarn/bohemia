# DISTANCE OUT OF PURE GEOMETRY (V164, 8/18/26, COMBAT lane)

**RF4-51, machine 3 of the nine. SPECED -> BUILT.**
**TAB: COMBAT.** Fight anything with a SEC-BOT in it and cut a corner.

---

## WHAT HE ASKED FOR

Nothing new. This is his own spec row, written off his own 83-screen capture of
Rogue Fable IV and routed to this lane by `laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md`
section 6. Verbatim:

> **[3] MOVEMENT ASYMMETRY MANUFACTURES DISTANCE FOR FREE.** Slow enemies move
> **orthogonally only**; you move **diagonally** — every diagonal step costs them
> more than it costs you, so you generate distance out of pure geometry with **no
> resource spent.** *"Movement asymmetry is a cleaner difficulty lever than stat
> inflation. Making an enemy orthogonal-only is more interesting than giving it
> more HP, and it teaches the player something durable."*

And the diff column: **"ABSENT, and it is nearly free... THIS IS THE CHEAPEST
DIFFICULTY LEVER IN THE ENTIRE DOCUMENT"** — it costs no new art, no new UI and no
numbers, which matters because NO DAMAGE BEFORE THE DIAL blocks the stat-inflation
alternative anyway.

---

## WHAT SHIPPED

`ortho:true` on the SEC-BOT archetype, sitting next to `hp` and `acc`. `pressAI`
gives a flagged body four neighbours instead of eight — and the four are
`PRESS_CELLS` **filtered**, never a second table, so the two lists can only ever
differ by exactly the diagonals.

Declared, not derived. Which bodies are slow is one word to change, and it is
visible where every other identity number is. Deriving it from a threshold on `hp`
would have been authoring canon behind a formula.

The heavy is the right body for it: 160 hp against a goon's 60, the only
`bot:true` in the table, and a machine that cannot cut a corner is the most
legible slow thing on a board. BAT and SPEAR were already asymmetric by `cad:2`
since 7/19, and they are melee, whose mover is a separate engine module this
session does not touch.

**Nothing announces it.** No icon, no label. He will learn it by cutting a corner
and watching the machine fail to.

---

## AND IT SHIPPED A STATUE FIRST

The first cut did not make bots orthogonal. It made them **immobile** — measured,
zero moves across a real sample. Halving a body's neighbours did not cause that.
It exposed two numbers that had been quietly wrong, and the second one has been
wrong for a long time.

### BUG ONE IS MINE, FROM TWO DAYS AGO

V160 (8/16) capped every gun's MAX at the sight ceiling and **left the EFF column
exactly where it sat**:

| gun | eff | max before V160 | max after |
|---|---|---|---|
| shotgun | 5 | 14 | 9 |
| pistol | 6 | 16 | 12 |
| smg | 10 | 26 | 15 |
| **rifle** | **20** | 44 | **16** |
| **sniper** | **30** | 64 | **16** |

The rifle and the sniper came out wanting to fight **further than they can shoot**,
on a board that stops at 16 and spawns everybody inside sight. `pressScore`'s
entire progress gradient is `max(0, d - eff)`, so for those two guns that term was
**zero at every distance either of them can ever be at.** V160's own comment says
range stops separating weapons and "they already differ by EFF, which is now the
real decision" — and then it left two of four guns with an EFF off the end of the
board, which makes it not a decision at all.

Fix: `effRange()`, mirroring `maxRange()`, one door. A gun cannot want to fight
beyond its own reach, and the dark shrinks where it wants to fight exactly as it
shrinks where it can. **No eff number was retyped.** Inventing "a rifle's real
comfort is 13" would be authoring a dial to make my own feature measure well,
which is the exact thing he caught on 8/16 when I sized a magazine to pass a gate.

### BUG TWO: THE BAR WAS HIGHER THAN A STEP

`PRESS_WORTH` is the margin a tile must beat standing put by. It was a flat
**0.18**, typed in beside a gradient worth `PRESS_PULL/mx` **per tile**:

| gun | reach | one tile of progress is worth | clears the 0.18 bar? |
|---|---|---|---|
| shotgun | 9 | 0.244 | yes |
| pistol | 12 | 0.183 | by two thousandths |
| rifle / sniper | 16 | 0.1375 | **never, at any distance, ever** |

Divide by your own range and the further your gun shoots, the less a tile is
allowed to be worth to you. That is backwards, and for anything reaching past 12
tiles 0.18 was not a margin, it was a **wall**.

The bar is derived off the pull now, against the longest reach in the game, and
means one plain thing: **half a tile of real progress**. Every gun can clear it
with one step, which is the least a movement threshold can do and still be a
threshold.

---

## MEASURED

Share of bodies that have somewhere better to stand than where they are:

| | before | after both fixes |
|---|---|---|
| ordinary gunmen (8 cells) | 86% | **99%** |
| SEC-BOT (8 cells) | 49% | 66% |
| SEC-BOT (4 cells, shipped) | 35% | **57%** |

The mechanic itself, on the shipped mover — 96 chases, 24 arenas x 4 flee
directions, same arena and same start cell and same flee vector in both arms, the
**only** difference being the flag:

```
he runs diagonally for 8 turns, one chaser
  8-WAY chaser           ends 12.04 tiles out   (stepped 6.2 of 8 turns)
  ORTHOGONAL-ONLY chaser ends 14.32 tiles out   (stepped 6.1 of 8 turns)
  DISTANCE MANUFACTURED BY GEOMETRY ALONE: 2.28 tiles
  the slow one lost ground in 71 of 96 trials
```

**AND THE NUMBER WENT DOWN WHEN THE BUGS WERE FIXED, WHICH IS THE POINT.** The
statue "manufactured" **4.03** tiles while stepping 2.6 turns in 8. A body that
never moves also generates distance, and it generates *more* of it. That is not
this feature. The real mechanic manufactures 2.28 while walking as often as
the fast body does (6.1 turns against 6.2), and the gate now checks the step **count** so it can tell the
two apart.

---

## THE GATES

**`gates/fight_moves_you_gate.js`** — 15 claims (was 10), measured on the shipped
mover in a real browser. Four are new:

1. cutting corners leaves the machine 2.28 tiles further back over 8 turns, in 71
   of 96 trials
2. **and it is geometry, not a freeze** — the slow body still walks about as often
   as the fast one
3. a slow body never lands on a diagonal, in the fights he actually plays
4. **and the pull is live at all** — a chaser who wants you steps on 6.2 turns in
   8; a gun whose EFF sits off the end of the board stands there instead

**`gates/combat_lab_gate.js`** — 832 claims (was 823). The shape, plus the claim
run as pure geometry before it is trusted as code, plus `effRange` executed
against real range rows, plus the derived-bar arithmetic. Two older claims were
**re-pointed, and one of them had been guarding the broken version**: the V138
check swore "both terms are monotonic at every distance, so there is no flat
stretch to stall in" while pinning the literal `d-R.eff` — the exact expression
that had been structurally zero since V160. It was reading the words rather than
the arithmetic.

### MUTATION-TESTED, FOUR WAYS, EACH PUT BACK

| mutation | result |
|---|---|
| `pressAI` always uses the eight cells | **3 red** — manufactured distance collapses to 0.19 tiles, 13 diagonal landings appear |
| `ortho:true` removed from the archetype | **1 red** — no flagged body exists in a real arena |
| `effRange` reverted to raw `R.eff` | **2 red** — the chaser drops from stepping 6.5 turns in 8 to 4.0 |
| `PRESS_WORTH` reverted to the flat 0.18 | **1 red** — manufactured distance rises to 4.28 tiles while the slow body steps 1.8 turns in 8 |

That last row is the whole reason the step-count claim exists. The broken version
scores **better** on the headline number.

---

## KNOWN, DELIBERATE, NOT A BUG

A rifleman in daylight is comfortable anywhere he can shoot — `effRange` clamps
him to his own 16 and the board is 16 — so he repositions for **angle** rather
than closing, and holds when neither is available. That is a coherent heavy: the
pistol men come to you, the machine holds and turns. Giving the rifle a comfort
band tighter than its reach would mean picking a number, and there is no ruling
for one.

---

## NOT HERE, AND NOT MINE

"Liquids block sprinting and movement abilities" is the terrain half of this same
spec row. Terrain properties are WORLD's system by the same law's section 6.
Flagged, not built.
