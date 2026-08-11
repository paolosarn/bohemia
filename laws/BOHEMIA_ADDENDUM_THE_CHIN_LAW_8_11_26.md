# BOHEMIA ADDENDUM — THE CHIN LAW (Paolo 8/11/26, LOCKED)

> "It looks like u fixed it make sure we never have this chin issue ever again."

## WHY THIS IS A LAW AND NOT A BUGFIX

He caught the same defect **three times across three weeks**, and each time it was
called fixed:

| when | what he said | what got done |
|---|---|---|
| 7/28 | "Make the neck one tile less facing east and west... towards the chin" | E and W dropped to one throat row. **Every other facing left at two.** |
| 8/11 | chin circled: "this is not how the rig has my head and my neck line... there needs to be more head underneath the mouth" | the head's missing silhouette edge was found and fixed, and I told him it was done |
| 8/11 | zoomed all the way in, same area circled: "THIS IS NOT FIXED ARE YOU RETARDED BRO ARE YOU FUCKING FR" | the throat was found eating both chin rows |

Then, writing the gate for this very law, its **first run found the defect still
live on the E facing** — where his rig paints exactly one face row below the mouth,
so even a single throat row ate the entire chin.

**Four instances. Two unrelated mechanisms. Same symptom every time.** That is the
signature of a missing law, not a recurring bug.

## THE TWO MECHANISMS

1. **THE HEAD HAD NO EDGE.** The body shades itself from the part grid and an edge
   pixel takes the darker anatomy tone — but the whole pass was wrapped in
   `if (g !== 0)`, and `GROUP` puts head and face in group 0. The head was the one
   body part in the game excluded from having a silhouette edge at all, so the
   jawline he painted rendered the same colour as the cheek beside it. Measured:
   the columns he painted the dark anatomy index on came out `191,175,166` — the
   face's own tone.

2. **THE THROAT ATE THE CHIN.** `NECK_TONE` takes the lowest N rows of visible
   FACE skin, because part 3 is 100% cloth on every facing he looks at and a tone
   there can never appear. At `throatRows: 2` those rows are his **jaw and his
   chin**, both painted the neck's tone, so chin and neck read as one slab with the
   mouth sitting on top of it.

## THE LAW

Written as properties, so it does not matter which pass breaks it next.

- **A. THERE IS ALWAYS HEAD UNDER THE MOUTH.** Wherever his rig paints face rows
  below the mouth row, at least one of them must render as **face**, not as neck.
  His words, twice: *"there needs to be more head underneath the mouth."*
- **B. THE THROAT NEVER TAKES MORE THAN ONE ROW OF FACE.** Two reaches the chin.
- **C. THE HEAD HAS AN EDGE.** The outermost skin pixel of a head row reads darker
  than the skin inside it, exactly like every other body part, so his painted jaw
  taper can draw itself.
- **D. EVERY PAINTED FACING, EVERY TIME.** The 7/28 fix was applied to two facings
  and left the front broken for three weeks precisely because nobody checked the
  others.

## THE IMPLEMENTATION RULE THAT MATTERS MOST

**A NUMBER TUNED PER FACING WILL ALWAYS BE WRONG ON THE NEXT FACING SOMEBODY
OPENS.** `throatRows` was corrected three times by eye and was still wrong. So the
count stopped being the rule and the chin became the rule:

> **The throat may never claim the last face row under the mouth.**

The pass reads the mouth row off his own facial art for the facing it is drawing
and refuses to start unless a face row survives between the mouth and the throat.
On S the throat takes y15 and the chin at y14 lives; on E the only row below the
mouth *is* the chin, so the throat takes nothing there. No per-direction table,
nothing to re-tune, and correct on a facing that does not exist yet.

His 7/27 ruling (*"the neck is not a different color"*) is untouched — the throat
still takes its row everywhere it can do so without eating a chin.

## GATE

`gates/chin_law_gate.js`, registered in the suite. Runs every facing his face is
painted on, with **hair removed** (a hairstyle is allowed to cover a jaw; the
question is whether the body draws one at all). Mutation-tested: removing the chin
clamp fails it, removing the head edge fails it three times over.

## THE PROCESS LESSON, AND IT COST HIM THREE ROUNDS

**IF A COMPLAINT SURVIVES YOUR FIX, YOU FIXED A DIFFERENT THING.** Two separate
bugs sat under one complaint. I found the first, verified it hard, shipped it, and
declared it done — and he was still looking at the same slab. Measure *the exact
rows he circled* before saying it is fixed, and if he says it is still there,
believe him and go back to the pixels.

Also, from the same afternoon: **a ruler that cannot see the change is worse than
no ruler.** The width ruler was blind to a tone fix and reported the render
identical before and after. The edge ruler written to replace it was reading the
sprite's black outline and passed with the fix ripped back out. Every assertion in
the chin gate is mutation-tested for that reason.

## FILES

- `tools/bohemia_head_edge_patch.py` — the head gets the silhouette edge every
  other body part already had
- `tools/bohemia_throat_row_patch.py` — one throat row, every direction
- `tools/bohemia_chin_law_patch.py` — the throat may never claim the last chin row
- `gates/chin_law_gate.js` — the law, enforced
- `records/CHIN_UNDER_THE_MOUTH_8_11.png` — before/after at his own zoom
