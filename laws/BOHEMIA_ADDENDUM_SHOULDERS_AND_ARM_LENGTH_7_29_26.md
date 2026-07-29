# BOHEMIA ADDENDUM — SHOULDERS + ARM LENGTH (the two dials that make a woman
# out of one rig)
**Paolo, 7/29/26. LOCKED.**

> "lets continue working on the arm length and how fat someone is when you adjust
> these two think about widening shortening the shoulder parts of the rig does
> that make sense. i dont want to create a female rig. but these sliders will
> help us make that. please and thank you. do online research if you need."

## 1. THE POINT

**No female rig. Ever.** The dead woman-rig arc is in the graveyard and stays
there. Body variety — including a female read — comes out of the ONE rig through
dials. This addendum adds the two that actually carry that load.

## 2. GROUNDED, NOT GUESSED (researched 7/29)

**SHOULDERS.** The **biacromial-to-biiliac ratio** — shoulder breadth over hip
breadth — is the strongest silhouette dimorphism in the human body: roughly
**1.4 in men and 1.2 in women**. Broad shoulders over narrow hips is the male
read; the female read is the same hip under a narrower shoulder. That is a ~14%
narrowing against an unchanged hip, so the dial is **±20% of the shoulder's own
half-width** — the whole real span, with headroom either side.

**ARM LENGTH.** Arm span tracks height almost exactly: the healthy adult ratio
sits between **1.00 and 1.05**, men averaging ~5cm of span over height and women
~1.2cm. Arms are **not a free dimension on a human body**, so this is deliberately
a narrow dial: **±12% of the arm's own length**. Wider would leave the species.

Sources: shoulder/hip ratio and its sexual dimorphism per anthropometric
reference; arm-span-to-height ratio per stature-estimation literature.

## 3. HOW EACH ONE WORKS

**SHOULDERS is a WIDTH dial on the torso, and the torso now answers to TWO.**
Belly swells at the navel; shoulders works the opposite end — full through the
shoulder band, eased out by the chest, **zero at the hip, because the hip is the
hip and it does not move.** The two never fight over the same rows, so a
wide-shouldered thin man and a narrow-shouldered heavy one are both reachable.
The amounts are **summed as fractional width, never multiplied**, so neither dial
can cancel the other and each keeps its own amplitude.

**ARM LENGTH is a BONE dial, like height.** The art is not stretched — the joints
move and the skinner redraws his painted arm along the longer bone. It scales from
the **shoulder**, because that is where an arm hangs from: elbow and hand travel,
the shoulder cap does not, so the arm never tears off the torso. The hand rides
with it as one unit.

## 4. THE HALF THAT MADE IT REAL: ARMS RIDE THE SHOULDER

The first build moved the torso and left the arms hanging. Measured on S, the
silhouette at the shoulder row read **18px at every setting from −1 to 0** — dead
in the narrowing direction — because up there the outline is made of **ARM**, not
torso. The arm-follows-flank pass fired for the belly only.

An arm hangs FROM the shoulder: move the shoulder, the whole arm unit goes with
it. After: shoulder **16 / 18 / 20** across the dial, a shoulder:hip of **0.89**
at the narrow end.

## 5. THE 1PX VOID, WHICH WAS NOT THIS DIAL'S BUG

At shoulders +1 a single empty cell appeared on SE (33,15) and SW (22,15). Cause,
measured — all four neighbours black, the cell itself null: a gap exactly **one
pixel wide** is still open to the outside when the interior hole-fill runs, so it
survives that pass; then the outline paints both its **walls** and leaves the
middle, because at snapshot time that cell's neighbours were empty too. A black
ring with a hole punched in it.

Fixed where it belongs, in the outline: any empty cell **fully enclosed by the
finished sprite** is closed with the outline colour. It cannot eat real space — a
cell with even one empty neighbour is left alone, so armpits, crotch gaps and
every intentional concavity are untouched. This was a latent outline bug the new
dial merely exposed.

## 6. MEASURED

| check | result |
|---|---|
| `apply()` at all dials 0 returns the identical BAKED object | **true** (structural, not tested) |
| shoulder width across the dial, facing S | **16 / 18 / 20** |
| shoulder:hip at the narrow end | **0.89** |
| arm bone length across the dial | **14.08 / 16.00 / 17.92 px** (±12%) |
| enclosed holes, 8 facings x 6 extreme dial configs | **0** |

Sheet: `records/dials/NEW_DIALS_7_29_26.png` — last column is the point: a
narrower, softer silhouette out of one rig.

## 7. STILL OPEN

Fat DISTRIBUTION is not yet sex-aware. The research is unambiguous — male fat
goes to the belly (android), female to hip and thigh (gynoid), and the same
growth data shows boys widening in the upper body while girls widen in the lower
limbs. Today the belly dial swells the navel for everybody. Making the fat follow
the shoulder setting is the natural next move and is **[PENDING, Paolo's call]**,
because it changes what his existing belly dial does to his own character.

Gate: `gates/clothes_follow_gate.js`.
