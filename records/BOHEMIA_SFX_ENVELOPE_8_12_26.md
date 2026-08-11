# THE SOUND ENVELOPE — WHAT 140 THUMBS ACTUALLY SAID (8/12/26)

Paolo 8/11: **"we may need way more voices and way more sounds for the whole game."**

The voices half was answered by casting new speakers from an ENVELOPE derived
from his six approved voices (192 distinct people, all inside the region he
already said yes to). This is the sounds half, and it was built the same way and
in the same order: **measure his verdicts first, write recipes second.**

---

## THE MEASUREMENT

Every thumb in `records/BOHEMIA_SFX_VERDICT_*.txt` (five files, latest wins per
id) joined against the cooked vector behind that id. **140 judged, 62 UP,
78 DOWN, 0 orphans.**

### 1. MATERIAL IS THE VERDICT

| material | UP | DOWN | kept |
|---|---|---|---|
| glass | 5 | 0 | **100%** |
| crystal | 8 | 7 | 53% |
| stone | 10 | 10 | 50% |
| bell | 10 | 10 | 50% |
| choir | 5 | 5 | 50% |
| ash | 13 | 17 | 43% |
| wood | 5 | 10 | 33% |
| bone | 2 | 3 | 40% |
| metal | 3 | 12 | **20%** |
| water | 1 | 4 | **20%** |

Metal, wood and water together are **9 UP / 26 DOWN across 35 judgements.**
That is not one bad cook. And it independently reproduces the 7/30 door
post-mortem — ash and stone lived, metal and wood died — from data that
post-mortem never looked at.

### 2. HE KILLS SOUNDS THAT ARE PUSHED

| knob | approved mean | rejected mean | effect size |
|---|---|---|---|
| **mkup** (makeup gain) | 0.92 | 1.28 | **-1.17** |
| **drive** (saturation) | 0.16 | 0.30 | **-0.62** |
| hz | 415 | 246 | +0.43 |
| everything else | | | under 0.45 |

mkup is the single strongest continuous separator in the whole judged set. This
is his complaint about v1 — *"it sounds like it was made with some software from
2006"* — restated as a number. Loud and saturated is the tell.

### 3. WHAT THE DATA DOES **NOT** SAY

Within a single moment's five candidates there is **no parameter with a clean
direction**: 8 moments split UP/DOWN, and the best knob is 5 of 7. Which of five
cousins he wants is taste, and taste is his.

**So the envelope picks the FAMILY. He still picks the sound.** A gate that
claimed more than this would be the exact failure the craft law names.

---

## THE LAW THIS PRODUCED

Machine-checked by `gates/sfx_envelope_gate.py` (160 checks):

1. Cook from the materials that win. metal / wood / water only where the struck
   object **is** that thing — and then brighter, shorter and less driven than the
   ten doors that died. The exception must be written into the engine with the
   reason; the gate reads the reason, it does not accept the exception bare.
2. `mkup <= 1.10` and `drive <= 0.30` on every new recipe, base **and** jitter —
   the sound he hears is the jittered one.

**THE GATE DOES NOT OUTRANK THE RULING.** Checks 1-6 re-derive all of the above
from his verdict files on every run. If his future thumbs reverse a direction,
the gate goes red and the recipes get rebuilt from the new data.

---

## WHAT SHIPPED: BATCH SFX-03, 26 NEW MOMENTS (28 -> 54)

**A. THE GROUND** (he named footsteps-by-ground demo-critical and the game had three)
`step_concrete` `step_sand` `step_glass` `step_wood` `step_metal`

**B. THE FIGHT** (the gun got a voice on 8/1; nothing else in the fight did)
`swing` `melee_hit` `reload` `dry_fire` `casing`

**C. THE BODY** (a hardcore RPG whose body system was silent)
`heartbeat` `breath` `drink` `patch_up`

**D. THE CITY YOU BUILD** (it is a city-builder and building was mute)
`build_place` `demolish` `deed` `money` `power_on`

**E. THE VALLEY MOVES** (the rare thing that breaks the three air beds)
`wind_gust` `neon_buzz` `generator` `dog_far`

**F. THE PHONE AND THE MENU** (`ui_tap` was carrying every interface moment alone)
`ui_back` `ui_deny` `equip`

All 26 x 5 candidates render, measure, go silent on time and come out identical
twice on the real render path (`sfx_render_gate`, 3636 checks, 270 candidates).
**Nothing is banked.** Unjudged is silent, on purpose — which sound each moment
makes is his call, not the machine's.

---

## THREE THINGS THE RENDER MEASUREMENT CAUGHT ON THE WAY

- **Four moments cooked below the judgeable band** (peaks 0.10-0.15 against a
  0.15 floor). He would have been thumbing which one he could HEAR. Fixed on
  `gain`, never on his approved vectors — the verdict is on the sound, the bus
  is where the mix happens.
- **Two moments came out dead mono, and raising `width` did nothing.** The modal
  spread alternates partials around centre, so a sound made of two near-identical
  partials cancels its own L-R. That spread is shared machinery every approved
  sound already uses, so it does not get touched: the width came instead from the
  layers panned asymmetrically (early reflections, offset in time, and the grit
  bed). On the heartbeat the grit is also the truer sound — blood and body under
  the thump, not a bare tone.
- **The fingerprint ledger had to be re-recorded** (130 -> 270). The gate refused
  to pass a roster it had never measured, which is the correct behaviour and the
  reason that check exists.
