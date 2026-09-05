# BOHEMIA — THE CLIP AUDIT (ANIMATION lane, 9/5/26)

His order, 8/25 playtest dispatch item 10, LOCKED:
"I KNOW WE NEED TO WORK ON FIXING THE ANIMATIONS AND SHIT, ALOT OF THEM ARE KINDA
FUCKED. WE NEED NEW ONES." — AUDIT FIRST, COOK SECOND. Nothing was recooked this
turn. Which clips survive is his.

Measured on the real surface, through `buildFrame`, the function the game draws
with. 8 facings, 24 rendered frames each (`FRAME_CACHE.buckets`, the renderer's own
count). Swing left where the game ships it. Tool: `tools/bohemia_clip_audit.js`.
Pictures: `tools/bohemia_clip_strips.js`.

---

## 0. THE SET IS 105 CLIPS, NOT 63

The 9/4 plan and this lane's queue both say 63. Measured at runtime:

| | count |
|---|---|
| `CLIPS` array (canon) | **64** |
| candidates pushed at load (`CANDIDATES`) | **41** |
| **total the engine can play** | **105** |

The 41 candidates are real, drawable clips that no verdict has ever touched:
punch-heavy, duck, haggle, stagger-hit, dash, inspect-ground, winded, overwatch,
pat-pockets, heave, dizzy, lunge-stretch, psych-up, headbang, air-guitar,
chest-thump, retch, twist-stretch, slump, cower, jumping-jacks, stretch-back,
weave, howl, hail, scratch-back, take-cover, crouch-aim-1h, crouch-aim-2h,
crawl-dying, flee-sprint, flee-scramble, cover-rise, cover-drop, gun-walk,
cover-fire, get-shoved, floor-rise, shiv-jab, bat-arc, spear-drive.

Anything scoped as "the 63" was scoped against a number that has not been true
for a while. The queue row is renamed in place rather than re-derived later.

## 1. THE POSITIVE CONTROLS CAME BACK CLEAN, AND THAT IS THE POINT

- **Nothing throws.** 105 clips x 8 facings x 24 frames, zero exceptions.
- **Nothing is a twin.** Every one of the 105 renders a cycle no other clip
  renders. With 105 hand-authored pose functions this was a real risk (two names
  and one motion is the ONE ID ONE WHOLE PERSON mistake with a different noun) and
  it is not happening.
- `clip_health_gate` (throws / still / empty) and `loop_seam_gate` (snap at the
  wrap) are both **green on the whole set**, re-run this turn.

**WHICH IS THE STRUCTURAL FINDING.** He is looking at this set and calling it
fucked while every gate we own says it is fine. Our animation gates can say
CRASHES or MOVES and have **no word for MOVES WRONG** — the same shape as day 20's
finding that the gates had no word for OWED. The three measurements below are the
missing vocabulary.

## 2. HEAD-ON IS A FIFTH OF PROFILE, AND IT IS NOT THE BACK VIEW

**The median clip's head-on view carries 41% of the pixel motion its profile view
carries. 40 of 105 carry under 35%.** The player's own most-used clips are the
worst of it:

| clip | head-on (best of N,S) | profile (best of E,W) | head-on carries |
|---|---|---|---|
| run | 21.5% | 130.8% | **16%** |
| walk | 19.8% | 107.8% | **18%** |
| tired-walk | 8.5% | 59.6% | **14%** |
| bow | 11.1% | 95.6% | **12%** |
| cough | 6.5% | 40.9% | **16%** |

*(peak frame-to-frame change as a share of the body's own ink)*

**THE FIRST READING OF THIS WAS WRONG AND IT WOULD HAVE SENT A RECOOK AT THE WRONG
HALF OF THE RIG.** The weakest facing is N for **77 of 105** clips, which reads as
"the back view is dead". It is not. Checked against S, the other head-on view:
walk S 19.8 / N 13.1, run S 21.5 / N 15.4, idle S 6.9 / N 5.3 — the two head-on
views are 1.1–1.7x apart and **both sit 5–8x below profile**. N wins the
weakest-facing count by a photo finish between two quiet views. The defect is
head-on against profile, not front against back.

Then I looked at the strips, because a number that disagrees about a picture is
the thing to distrust. Head-on walk in both N and S **does** read — the boots
separate, the hands swing. It is weaker, not dead. Foreshortening is real and the
engine already compensates for it (the N/S CRUNCH LAW, `nsGait`). **The open
question, and it is his:** is the crunch law's compensation enough at a fifth of
profile? Standard sprite practice says subtle motion disappears at this size and
wants the acting pushed roughly a third further; that is a recook, so it waits.

## 3. WHICH LIMB DOES THE ACTING — AND THE FIRST RULER WAS BROKEN

WORK INDEX = a region's share of the motion / its share of the body. 1.00 = it
moved exactly its own weight; above 1 it is carrying the clip. Region sizes are measured per clip off its own first frame, not assumed; on a
resting body they run head 16.4%, torso 24.3%, arms 26.8%, legs 32.6%.

**The first cut ranked regions by RAW share of changed pixels and was wrong.** It
failed `taunt` on 33.0% head against 32.9% arms — a coin flip reported as a defect
— because a raw share is really a question about area. It also **inverted three
clips** (smoke, pickup, carry). Ruler fixed, target untouched.

Across all 105, which region carries the clip:

| | head | torso | arms | legs |
|---|---|---|---|---|
| clips it carries | 33 | 0 | **58** | 14 |
| median work index | 1.21 | 0.78 | **1.54** | **0.36** |

**The legs are the biggest region of this body and the quietest thing on it.**
Arms carry more than half the set. That is not an area artifact — legs are 32.6%
of the body against arms' 26.8%, so the bigger region is moving less.

**And then the name test found my own table wrong more often than it found a clip
wrong**, which is worth writing down so nobody treats it as a verdict list. It
flagged 14 of 46 named clips; looking at the strips settled most of them *against
the table*: a whistle really is fingers to the mouth (arms, not head), a push
really is driven from the legs, people really do talk with their hands, you really
do look down at what you are pouring. The picture outranks the table.

**What survived looking:**

- **`jump` does not jump.** Legs work 0.65, arms 1.45. On the strip the whole body
  translates upward as one piece, the legs never crouch and never extend, and
  there is no anticipation before it. Nobody jumps with their arms.
- **`whistle` is a static hold**, not a cycle: the arm goes to the face and stays
  there. Peak 7.4%, head work 0.77 against arms 2.90, and its head-on view
  carries 16% of its profile. This repo has
  already ruled on this shape — the `salute` graveyard note reads "a one-beat
  static hold, the life-pass lesson says holds need visible cyclic motion".

## 4. THE QUIET END OF THE SET

Peak frame-to-frame change, best facing, as a share of the body:

| clip | peak | reading |
|---|---|---|
| two-hand | 3.2% | **design, not a defect** — holding a gun steady |
| pistol | 3.3% | **design, not a defect** — same |
| pray | 5.2% | worth his eye |
| eat | 5.3% | worth his eye |
| whistle | 7.4% | static hold, see above |
| sit-chair | 8.3% | seated, low by nature |
| sleep | 8.6% | asleep, low by nature |
| smoke | 8.8% | worth his eye |
| lean | 8.9% | leaning, low by nature |
| idle | 9.1% | breathing; correct |

A sweep that cannot tell a bug from a design decision is the broken one, so the
aiming and resting clips are named as intended rather than counted as failures.
The four worth his eye are `pray`, `eat`, `smoke`, `whistle`.

---

## WHAT THIS DOES NOT DO

It does not judge. Which clips get recooked, which get killed and which are fine
as they are is his call ("which survive = HIS"), and the next row is showing him
the list.

## THE INSTRUMENTS

- `tools/bohemia_clip_audit.js` — the sweep. Writes the raw table beside this file.
- `tools/bohemia_clip_strips.js` — renders a clip's whole cycle as a contact strip
  at 3x, above the size the game draws it, so a finding can be looked at.
- `gates/clip_audit_gate.js` — pins what this audit established so it cannot rot.
- Raw table: `records/BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt`
