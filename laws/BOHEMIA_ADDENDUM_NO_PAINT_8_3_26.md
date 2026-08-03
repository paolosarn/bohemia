# BOHEMIA ADDENDUM — NO PAINT (Paolo 8/3/26, LOCKED)

> "I really want my game to look more like that very good"
> — Paolo, 8/3/26, on Machine Party

That is a DIRECTION and under `laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md`
a direction he states is a ruling, not a proposal to bring back for a thumb. So
Machine Party is now a NAMED VISUAL REFERENCE for Bohemia, sitting beside the
existing reference stack (Valheim / Project Zomboid / Fallout: New Vegas / Pocket
City 2) as the one that governs **how it looks** rather than how it plays.

Study: `records/BOHEMIA_RESEARCH_MACHINE_PARTY_8_3_26.md`, four rounds. Read it
before touching this. It is **DOC_ONLY** under the lab tiers — no primary page was
reachable — and it says so at length.

**CORROBORATED BY A SECOND, INDEPENDENT STUDY THE SAME DAY:** the ART lane was asked
the same thing in different words and landed
`records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md` without either session seeing the
other. Both reached the same headline — the grime pass is the unifier and it crosses
object boundaries — from different directions. Clause 2 therefore rests on two
independent reads, not one. Their dossier is deeper on texture construction and on the
sound; read it alongside this.

**WHAT THIS ADDENDUM DOES NOT DO: IT DOES NOT LIFT THE ART FREEZE AND IT DOES NOT
AUTHORISE ONE PIXEL.** Under `laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md` a
frozen lane produces nothing, and finding a legal-looking reason to ship anyway IS
the violation. This file is the brief the ART lane is bound BY when he lifts the
freeze. Until then it is paper, on purpose.

---

## CLAUSE 1 — NO PAINT: EVERY OBJECT WAS BUILT BY SOMEBODY WHO DID NOT CARE HOW IT
## LOOKED

Sharp angles. Bare minimum to do the job. No decorative element that is not also
functional. The fiction is that a working engineer built the thing to work and
nobody has prettied it up since.

This is a SHAPE rule and it costs nothing, because it is already true of our
world: a Las Vegas ten years into a dead grid has nobody left whose job is making
things look nice. Klubnika's version, on his own machines: very sharp angles, and
no coat of paint to make them look pretty, just the bare minimum from the
fictional engineer's side.

LOCKED. This governs Claude-authored props and structures. It does NOT override
`RIG LAW` — Paolo's painted regions stay sacrosanct — and it does not reach any
asset he painted himself.

## CLAUSE 2 — THE GRIME IS ONE PASS OVER EVERYTHING, NOT FLAVOUR PER ASSET

The thing that makes separately-authored objects read as ONE PLACE is a single
consistency pass of dirt, streaks and leaks applied across the entire bank after
the assets exist — not better individual assets, and not per-tile flourish.

This is the load-bearing finding of the whole study. Klubnika painted grimy leaks
into every corner of every texture in Buckshot Roulette and the result was that it
blended the entire thing together rather than having different objects. It is the
direct answer to "the world does not look consistent," which is the exact problem
that froze the art in the first place.

The corollary is the part that matters to a factory: **once the grime pass is
consistent, imperfection in an individual tile stops being visible.** He does not
even UV unwrap his models properly and nobody notices, because the grunge covers
it. The route to a coherent world is therefore NOT a higher bar per tile.

**APPROVED 8/3/26: "SURE".** The grime pass happens. That is his word and it is the
ruling; nobody re-asks it.

He approved it with a question attached, and the question is the important half:

> "SURE BUT WE HAVE SO MANY GRAPHICS ASSETS TO ADD. DO WE DO THIS BEFORE WE THE DEMO
> ND THE END?"

## CLAUSE 2A — THE ANSWER: NEITHER. IT IS A PIPELINE STAGE, NOT A MILESTONE.

He is right to smell a trap, and the trap is real: **if the grime is a hand-painted
pass, then it can only ever be done at the end, and it has to be redone from scratch
every single time an asset is added.** Hundreds of assets are still coming. A manual
pass would be re-run, by hand, hundreds of times, and would be permanently out of
date in between. That is the version that eats the schedule, and it is the version he
was worried about.

So it is not that. **THE GRIME IS A MACHINE THAT RUNS AT BAKE TIME OVER WHATEVER THE
BANK CURRENTLY HOLDS.** Build it once, now, and:

- **Every asset added from that day forward is grimed the day it lands**, with no
  extra work and no second pass. Adding five hundred more tiles costs zero grime
  work.
- **It is never a milestone**, so it is neither "before the demo" nor "at the end" —
  it is simply on, from the moment it exists, the way the 45-degree check is on.
- **Nothing is behind it.** Asset production does not wait for the grime and the
  grime does not wait for asset production. That is the whole reason to answer his
  question this way instead of picking one of the two dates he offered.
- **It answers the same question for the demo:** the demo gets grime because
  everything gets grime. There is no separate demo pass to schedule.

Three requirements on that machine, all mechanism and therefore ours:

1. **IT COMPOSITES AT BAKE, IT NEVER WRITES TO `banks/`.** RIG LAW and his painted
   regions are sacrosanct. The source pixels he bought and painted are not touched;
   the dirt is a layer applied on the way to the screen. Which also means it is
   reversible, and a wrong strength is a one-line change and not a re-cook.
2. **IT IS ONE DIAL, SO HE JUDGES STRENGTH ONCE.** Not per-tile, not per-material —
   one number for the whole world, because uniformity across object boundaries is the
   entire finding. **The number is [PENDING Paolo]** and he judges it by looking at
   the world, not at a tile.
3. **IT IS INDIFFERENT TO OBJECT BOUNDARIES.** A grime system that respects where
   one asset stops and the next begins has reproduced the exact problem it exists to
   solve. This is the requirement most likely to be quietly broken by somebody being
   tidy, so it is the one the gate has to hold.

**WHO BUILDS IT: THE ART LANE, NOT THIS ONE.** It is a texture-pipeline stage and the
ART lane owns the texture pipeline and is actively working in it. The LAB lane wrote
the brief and does not touch the cook. And it still does not run until he lifts the
freeze — an approved grime pass is not an approved art batch.

### AND IT IS ALREADY BUILT, CORRECTLY, AT ZERO

**STATUS 8/3/26:** the ART lane shipped `tools/bohemia_grime_cook.py` and
`gates/grime_gate.py` the same day, with **`GRIME_STRENGTH = 0.0`** — the machinery
exists, the world looks exactly as it did, and their own gate fails the build if a later
session turns the dial up without a recorded ruling from him. That is this clause
satisfied to the letter.

**HE RAISED THE SAME WORRY WITH BOTH LANES, IN DIFFERENT WORDS, AND GOT THE SAME ANSWER
TWICE.** To that lane: *"are you absolutely sure we do it now?"* To this one: *"BUT WE
HAVE SO MANY GRAPHICS ASSETS TO ADD. DO WE DO THIS BEFORE WE THE DEMO ND THE END?"* Both
lanes independently split the thing in half the same way — **BUILD THE MACHINERY NOW,
DEFER THE TUNING** — and their reason is the sharper one: one district type of
twenty-seven is finished, so tuning a whole-world look against four percent of the world
means tuning it twice and spending his thumbs on a number guaranteed to change.

Recorded because two lanes converging on the same split from different evidence is the
strongest form this answer can take, and because he should not have to be asked a third
time.

### A NOTE ON HOW THIS GATE GOT IT WRONG FIRST

`no_paint_gate.js`'s derivative sweep originally failed **any** file implementing a grime
pass, on the grounds that he had not approved one. Then he approved one, and the ART lane
built it — so the check red-flagged their correct work with a reason that was no longer
true. **A GATE MUST NEVER OUTRANK A RULING.** The ban was removed the same day it was
written and replaced with E9, which checks what is still true: an implementation must be
gated, and the dial stays at zero until he rules the amount. Fix the ruler, never the
target.

## CLAUSE 3 — DARK IS THE DEFAULT, LIT IS THE EXCEPTION, AND WE ALREADY SAID SO

CLUSTERED POWER (~12% lit) and LIGHT = TERRITORY are already canon and already
gated. What the reference shows is what those laws look like when the ART actually
commits to them instead of merely permitting them: reviewers describe Machine
Party in the same four words every time — dark, grim, claustrophobic, industrial.

LOCKED, and it is a restatement, not a new law. No lane may brighten the unlit
world toward legibility. The dark is the subject.

## CLAUSE 4 — THE RAMP IS NARROW AND WARM-DEAD; THE COLOURS ARE HIS

The reference's palette is five colours: a near-black oxblood up through rust and
clay to one ochre accent and one bone highlight, with **no cool colour at all**.
The FINDING is the shape of that ramp — narrow, desaturated, warm, one accent.

**BOHEMIA'S PALETTE IS [PENDING Paolo] AND ALWAYS WAS.** MECHANISM-MINE /
CONTENTS-PAOLO'S: I do not write colour canon, and a five-hex list scraped by a
third party off somebody else's post-processed game is evidence about shape, never
a set of values to paste. Any lane that reads this clause as permission to recolor
a bank has misread it.

## CLAUSE 5 — WE TAKE HIS PALETTE DISCIPLINE AND WE REFUSE HIS READABILITY TRADE

Klubnika let a gameplay-critical item — the colour-coded shells — become genuinely
hard to tell apart, because the post-processing and the mood outranked reading it.
He paid that price knowingly.

**WE DO NOT.** Bohemia is a phone game read at arm's length in daylight; SUN MODE
exists for exactly this reason. Narrow the palette, keep the contrast.

Recorded as a DELIBERATE DIVERGENCE so that nobody later crushes our contrast
toward the reference thinking they are being faithful, and nobody later "fixes"
our contrast back up thinking clause 4 was an oversight. Both directions are
wrong; this clause is the line.

## CLAUSE 6 — STEPPED AND HELD, NEVER SMOOTHED

The most-praised thing about the reference's motion is that it reads as
STOP-MOTION: low frame count, real weight, poses held rather than interpolated
through.

We already own the grid that produces this. The 120 BPM LAW quantises everything
to the BEAT and I-MOVE-YOU-MOVE means the world is stepping anyway. Holding a pose
on the beat instead of smoothing through it is the same move, and it is native to
pixel animation.

LOCKED as a DIRECTION for the ANIMATION lane. It sets no frame counts and it
overrides nothing in LEAF-PIXEL LAW — structure still stays frozen, animation
still touches only the leaf.

## CLAUSE 7 — THE MENACE IS IN WHAT THE OBJECT IS FOR

A machine built to harm is sinister before it is drawn, because it is emotionless
and has no mercy, and it is worse when it has **no failsafe** and cannot be
stopped. That is free horror and it aims at the apparatus, not at blood.

This CORROBORATES `laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md` from a
second direction: the reference is a shipped, Very Positive, extremely violent
game whose dread is almost entirely anticipation. It adds no new permission for
gore and it changes nothing about NO DAMAGE BEFORE THE DIAL.

---

## WHAT THIS EXPLICITLY DOES NOT DO

- **It does not make Bohemia 3D.** The reference is low-poly 3D built in Blender.
  Bohemia is pixel art at a fixed three-quarter view and the **45 DEGREE ART LAW
  stands untouched** — it is the thing that makes our corpus cohere at all. No
  clause above is about geometry.
- **It does not change the camera.** His camera is in the room; ours looks over a
  city. The side-scroller camera remains the named anti-reference.
- **It does not introduce computed lighting, fog, or depth blur.** His stated
  reason for working in 3D was to let the computer handle lighting. We paint every
  value by hand, so our version of his darkness is palette and value discipline
  and nothing else.
- **It does not lift the freeze, cook a pixel, or recolor a bank.**
- **It does not set a palette, a frame count, or a grime strength.**

## GATE

`gates/no_paint_gate.js`, registered in the suite as NO PAINT. A law without a
machine gate is not enforced, so it is machine-locked the same turn.

What it proves: the seven clauses and the divergence are still in this file; the
study exists and still carries its DOC_ONLY disclosure and its 3D-versus-pixel-art
warning; the pendings (the grime decision, the palette) have NOT been quietly
filled in; and — the check that actually matters — **no lane has treated this
addendum as permission**: no palette constant list, no bank recolor, and no
freeze-lifting language has appeared anywhere off the back of it.

That last check is the whole point. This addendum is the exact kind of document
that reads like a green light for the art lane, and it is the opposite of one.
