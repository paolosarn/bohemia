# NINE LIVED, NINE DIED, AND FOUR SWEPT CLEAN (8/28/26, SOUND lane)

He judged **599 of 600**. That is the largest single body of sound judgement
this project has ever produced, and it landed on SFX-11 — the eighteen sibling
pools cooked that morning for moments that played one sample forever.

## THE RESULT

    door_more    5/5   *** CLEAN SWEEP ***       dry_more     0/5
    swing_more   5/5   *** CLEAN SWEEP ***       eat_more     0/5
    wind_more    5/5   *** CLEAN SWEEP ***       lungs_more   0/5
    tread_more   5/5   *** CLEAN SWEEP ***       mag_more     0/5
    chip_more    3/5                             sign_more    0/5
    seton_more   2/5                             down_more    0/5
    tape_more    2/5                             quit_more    0/5
    buzz_more    1/5                             power_more   0/5
    cloth_more   1/5                             hunker_more  0/5

**29 of 90, nine pools of eighteen, and FOUR CLEAN SWEEPS IN ONE BATCH.** The
previous record was two, set on 8/15. Nothing has swept 5/5 four times in a
single batch before.

## WHAT THAT ACTUALLY BOUGHT HIM, IN PLAY

The whole point was the machine gun: a moment with one approved sample fires a
byte-identical sound every time. Nine moments widened the moment his thumbs were
baked:

    door_drag    1 -> 6      every door in the valley
    swing_air    2 -> 7      every melee that misses
    wind_gust    2 -> 7      the most-heard sound outside footsteps
    boots_go     2 -> 7      somebody flanking you
    stone_bite   1 -> 4      your cover being eaten
    set_down     2 -> 4      tape_pull  2 -> 4
    phone_buzz   2 -> 3      cloth_on   2 -> 3

The bank went from 55 moments / 156 samples to **65 moments / 185 samples**.

## THE NINE THAT DIED ARE FIRST REJECTIONS, AND THEY STILL GET NO SECOND COOK

STOP PRODUCING ends a feature on the *second* rejection, so one more cook would
technically be legal for all nine. It is not happening. The same message that
killed them gave a reading — **the materials are cooked** — and the honest
response to a reading is to use it on the next thing, not to re-cook the thing
it was given about.

Nothing got quieter: every one of the nine is a *sibling*, so its parent moment
still plays the sample it already had.

## HIS RULING, AND THE GATE THAT NEARLY DESTROYED HIS BEST BATCH

> "Im tired of all these voices they ran their course no more wood stone ash
> bone shit its COOKED"

Law: `laws/BOHEMIA_ADDENDUM_THE_MATERIALS_ARE_COOKED_8_28_26.md`.

**The obvious gate would have been a disaster.** Banning those four materials
outright goes red on **80 of 120 recipes** on the day it ships — including all
four of the clean sweeps he had just given, because `door_more` is stone,
`swing_more` and `wind_more` are ash, and `tread_more` is bone.

He did not say those sounds are bad. He said **he is tired of them and they ran
their course** — a statement about the next cook, not a verdict on the last one.
So the 120 recipes alive at the moment of the ruling are grandfathered by name,
and only new cooks are bound. A check that deleted his own best batch to
"enforce" his ruling would be a gate outranking a ruling.

## AND I GOT METAL WRONG, AND A GATE CAUGHT ME

I read his six metal approvals as reviving the material — newest date wins — and
wrote it into the law and a gate. **That same sweep contained fifty-four metal
rejections.** Counted across every verdict file:

    water 40%   stone 36%   bone 36%   bell 33%   ash 33%
    crystal 30%   wood 29%   choir 28%   glass 27%   metal 10%

I had cherry-picked the thumbs that agreed with me out of a body of evidence
that ran nine to one the other way. `sfx_envelope_gate` went red and named it.
The palette is **four**, not six: bell, choir, crystal, glass. (Water is 6 up / 9
down — the best rate in the table on the smallest sample, and not a finding.)

**And the rest of that table is the real result.** Every material except metal
sits in a 27–40% band. There is no material signal in this rack beyond "not
metal", which is worth knowing before anyone explains his taste with a material
again.

## FIVE THINGS THE VERDICTS BROKE, AND WHAT EACH ONE WAS

Baking 185 approvals is not a data edit; it moves the whole build.

1. **SFX WIRED** — three approved pools had no call path, because the *parent
   moments* (`cloth_on`, `set_down`, `tape_pull`) are already waived for verbs
   that do not exist. A sibling's playability is exactly its parent's, so each
   inherits the parent's waiver **and its expiry needle** — they come back
   together or not at all. A sibling with its own softer excuse would outlive
   the parent's and become a hiding place.
2. **SFX ENVELOPE** — `REGION`, the bounding box of everything he has ever
   approved, no longer contained his own new canon: `tape_more.4` rises 5.76
   semitones and the box stopped at 5. Re-recorded from the 185, deliberately,
   exactly like the render fingerprints.
3. **SILENT MOMENTS** — the nine he killed have no caller, which is correct: a
   caller for an emptied pool plays silence. Added with the reason. And the
   ratchet on killed moments (30) had to move to 40, which is the number he
   made it, with the reason written where the number is.
4. **SILENT MOMENTS, again, and this one was a real bug** — the gate cuts the
   engine out of its haystack by exact string match. My engine edits landed
   after the last inline, so the copy in the alpha no longer matched, the cut
   failed, and the gate started reporting live references to dead cash ids that
   were only there because the whole engine was suddenly in scope. Re-inlined.
5. **SFX SHUFFLE** — green on main, red on mine, and mine was the real cause: he
   left **exactly one** candidate unjudged (`cloth_more.0`), and the gate's
   drive needs three distinct items to exercise YES, NO and SKIP. Neither the
   empty case it already handled nor the full one. A one-item queue is its own
   state; the legs that are arithmetically impossible on it are held back and
   named, and every leg that still means something still runs.

## THE TWO REDS THAT ARE NOT MINE

`GRAVEYARD` fails identically on plain `origin/main` — ten live references, all
in hair-lane files. `SFX DIVERSITY` is the long-standing true red; this batch
moved it 67.7% → 58.1% earlier today and his sweep has not changed the shape of
it.

## WHAT COMES NEXT

Not another cook on the retired palette. Four materials remain and they are a
different world from where this rack has lived: **bell, crystal and glass ring;
choir is a voice.** Nothing left is dry matter, which is exactly the substance
of what he asked for.
