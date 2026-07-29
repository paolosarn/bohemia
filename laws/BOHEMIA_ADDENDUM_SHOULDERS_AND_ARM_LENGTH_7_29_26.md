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

## 7. FAT IS FAT — HIS RULING, 7/29/26, THE SAME DAY

I asked whether fat should follow the shoulder setting (male belly / female hip
and thigh). **He said no, and closed it:**

> "nah when i put fat its like your fat fuck that woman belly shit. these
> characters are going to be more unisex vibes and you can tell a woman is a woman
> because their arms can be slightly skinnier, they are shorter and yeah."

**FAT IS FAT.** One behaviour for everybody. There is no sex-aware fat
distribution and there is not going to be one — the research says male fat is
android and female gynoid, and it is being deliberately **overruled** because
Bohemia's cast is unisex by design, not by accident.

**HOW A WOMAN READS, in his words:** slightly skinnier arms, shorter, and the
narrower shoulder this addendum added. Every one of those is a dial that already
exists. That is the whole female body plan and it needs no new mechanism.

The gate pins it: no `hips`, no `bust`, no `fatDistribution` dial may appear.

Gate: `gates/clothes_follow_gate.js` + `gates/bodyvar_gate.js`.

---

# ADDENDUM 2 — HIPS, AND LIMB THICKNESS IS ONE DIAL
**Paolo, 7/29/26.** *"we can add hip width and arm width can be tied to leg width too."*

**HIPS** completes the ratio. Shoulders could only ever work one end of
biacromial:biiliac; the pelvis never moved. ±18% — slightly under the shoulder's
range, because a pelvis is bone and varies less than a shoulder girdle. The torso
now takes **three** dials through a list: shoulders own the cap, belly owns the
navel, hips own the pelvis, each on its own band so they compose instead of
fighting. Measured at the rest layer: **9 / 11 / 13**.

**LIMB THICKNESS IS ONE DIAL.** The ARMS dial now drives the thighs. Thin arms on
tree-trunk legs is not a body anyone has. It is deliberately gentler on a leg —
the arm gets ±45% because a 3-4px strip needs a big fraction to read at all, and
that same 45% on a 6px thigh would be a cartoon, so the leg profile caps at 0.55
for ±25%. Zero at the hip join and zero at the ankle, so the leg still meets the
pelvis and the foot exactly as painted. Measured: thigh **4 / 5 / 7**.

## TWO BUGS FOUND BY MEASURING, BOTH WORTH KEEPING WRITTEN DOWN

**1. A DIAL NOT NAMED IN `warpLayers`' EARLY-OUT IS SILENTLY DEAD.** `hips` was in
`PART_SPEC`, had a profile, had an amplitude — and did **nothing**, because
`warpLayers` returns before it ever looks unless the dial is in that one line. The
rest-layer torso measured 11px at every hip setting. The gate now checks that line.

**2. A FLOOR CAN KILL HALF A DIAL.** The thigh shipped with `minW: 5` while its own
painted row is 5px, so the entire narrow half was dead: **5/5/5/5/7**. Dropped to
4 — the arm's own floor — which still leaves two pixels of skin between the outline
columns.

Neutral is still the identical BAKED object, and enclosed holes across 8 facings x
extreme dial configs is still **0**.
