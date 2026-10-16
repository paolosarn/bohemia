# THE SOUND ENVELOPE, AND THE DAY HIS THUMBS KILLED IT (8/12/26)

Paolo 8/11: **"we may need way more voices and way more sounds for the whole game."**

This file was written twice in one day. The first version is the interesting one,
because it was **wrong**, and the machine built to check it is what proved that.

---

## WHAT WAS BUILT IN THE MORNING

26 new sound moments (28 in the game -> 54), cooked inside an envelope derived
from his 140 committed thumbs. Two claims, both measured, both machine-checked
by `gates/sfx_envelope_gate.py`, which **re-derives them from his verdict files
on every run** rather than trusting a pasted number.

1. **MATERIAL IS THE VERDICT** — glass 100%, crystal 53%, stone/bell/choir 50%,
   ash 43%, and metal 20% / wood 33% / water 20%.
2. **HE KILLS SOUNDS THAT ARE PUSHED** — makeup gain effect **-1.17**, drive
   **-0.62**, nothing else above 0.45.

## WHAT HAPPENED HOURS LATER

He judged **all 270 in one sitting.** 97 UP, 173 DOWN. The re-derivation went red.

| material | 140 thumbs | 270 thumbs | |
|---|---|---|---|
| water | 1 UP / 4 — **20%** | 6 UP / 4 — **60%** | best in the game now |
| glass | 5 UP / 0 — **100%** | 8 UP / 12 — **40%** | |
| ash | 13 UP / 17 — 43% | 16 UP / 44 — **27%** | near worst now |
| choir | 5 UP / 5 — 50% | 7 UP / 13 — 35% | |
| **metal** | 3 UP / 12 — 20% | 3 UP / 22 — **12%** | **the one that held** |

The knobs went the same way: makeup gain **-1.17 -> -0.36**, drive **-0.62 ->
-0.23**, and the approved and rejected medians now nearly touch (0.880 vs 0.900).

**Glass was five samples. Water was five samples.** Every material ranking except
metal was small-sample noise that read like a finding, and a full sweep flattened
it. The batch was deliberately built to favour glass and ash and to avoid water —
and `step_glass` died 0/5 while `drink`, the only water moment, swept **5/5**.

## THE LAW, CUT DOWN TO WHAT 270 JUDGEMENTS SUPPORT

1. **METAL IS DEAD.** 3 UP / 22 DOWN across 25 judgements, consistent in both
   sweeps, and the new batch tested it and confirmed it: both metal moments
   (`step_metal`, `reload`) died whole. No new recipe cooks from it.
2. **CONTAINMENT, NOT DIRECTION.** Nothing predicts *which* of five cousins he
   wants, so the envelope stops pretending. `REGION` is the measured bounding box
   of all 97 candidates he has ever approved, and it **binds forward**: any
   recipe added after 8/12 must cook entirely inside it.
3. The surviving weak direction is **reported**, and asserted only as the sign it
   still has. Never as a cap — a cap tight enough to mean anything would be red
   on sounds **he approved**, and a gate that outranks a ruling is the failure
   this lane already has a law about.

### WHY SFX-03 WAS NOT RE-COOKED TO FIT THE BOX

20 of its 130 candidate values sit outside the approved region. They stay there.
A candidate is a pure function of `(event, index)` through its recipe, so
narrowing a jitter range **changes what `casing.1` is** — and 130 of his thumbs
are attached to those exact vectors. Re-cooking to satisfy a check would silently
invalidate judgements he already made. The gate measures the gap and prints it;
it does not fail on it.

---

## HIS SCOREBOARD ON THE NEW BATCH: 14 OF 26 LIVED

**Lived** — `melee_hit` 4/5 · `drink` **5/5** · `generator` 4/5 · `heartbeat` 3/5 ·
`demolish` 3/5 · `ui_back` 3/5 · `ui_deny` 3/5 · `step_wood` 2/5 · `power_on` 2/5 ·
`wind_gust` 2/5 · `step_concrete` 1/5 · `step_sand` 1/5 · `dry_fire` 1/5 · `casing` 1/5

**Died whole** (60 candidates, graveyarded) — `step_glass` `step_metal` `swing`
`reload` `breath` `patch_up` `build_place` `deed` `money` `neon_buzz` `dog_far`
`equip`

### THE PATTERN IN WHAT DIED, offered as a brief and not a law

Nine of the twelve are the moments with **no physical event behind them**: an
abstraction being announced (`build_place`, `deed`, `money`, `equip`) or a texture
with no strike (`breath`, `neon_buzz`, `dog_far`). What lived was almost entirely
**things hitting things**. n=26, so read it cautiously — but it is the strongest
pattern in the sweep, and it is the brief for whatever answers those slots.

---

## AND THE PART THAT MATTERS MOST: THEY PLAY NOW

**97 approved sounds across 32 moments** are in the table the game reads, up from
38 across 18. APPROVED-BUT-UNUSED IS A DEFECT, and the same-day path from his
thumb to the speaker is the whole point of the pipeline.
