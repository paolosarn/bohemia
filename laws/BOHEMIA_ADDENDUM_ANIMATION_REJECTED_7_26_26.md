# BOHEMIA ADDENDUM — THE ANIMATIONS ARE REJECTED (Paolo 7/26/26, LOCKED)

## THE RULING, HIS WORDS

> "I'm really concerned with the Animation rig and the skeleton of the rig. You
> know I set the rig up in a way so that way when it's animation time there
> wouldn't be anything that looks like dog shit or glitchy but it's very clear
> that that's still the case... when the pixels travel and translate more the
> shit's looking so bad... and then we also did like a feature for like hands
> and the arms and stuff and sometimes they're clipping wrong and it's all bad.
> These animations, like only a couple of them are solid. Like I really just
> wanna kill all the animations, like all of them. The biggest problem is where
> the torso is and the arm was sitting, and then the arm moves and then it's
> just like morphing and glitching and providing extra pixels and it's looking
> like dog shit. Like the whole, all the animations essentially need to be
> redone. It's really disappointing."

**NO CLIP IS APPROVED ANY MORE.** The entire animation set is rejected as a set.
Nothing in CLIPS carries a verdict from before this date; whatever thumbs any
individual clip once got are void, because they were given on a renderer that
was fabricating pixels underneath them.

## THE READING I ACTED ON (stated, not assumed silently)

He said "kill all the animations" AND "all the animations essentially need to be
redone." Those are one instruction, not two: the set is dead **as approved
content**, and it comes back rebuilt. So the clips were NOT deleted from the
tree this turn — deleting them leaves the game with no motion at all and would
not move anything toward the redo. They are now UNAPPROVED PLACEHOLDERS. If he
wants them physically gone before the replacement exists, that is one word from
him and it happens.

## WHY IT LOOKS LIKE THAT — THE ROOT CAUSE, NAMED

He diagnosed it exactly: *"where the torso is and the arm was sitting, and then
the arm moves and then it's just like morphing and glitching and providing extra
pixels."*

The renderer skins limbs by **continuous per-bone resampling**. For every screen
cell it samples backwards through the bone's transform into rest space. At any
angle that is not a multiple of 90 degrees that resample **cannot** be lossless
— pixels merge, split and shift by fractions of a pixel. On pixel art that reads
as MORPHING. It is not a bug in any one clip; it is what the technique does.

Bohemia already knows this and already banned it — for the head only:

> **HEAD RIGID STAMP LAW (Paolo 7/2/26, GLOBAL, LOCKED):** "the head is NOT a
> limb. It never expands, shrinks, or changes shape, not a single pixel, in any
> animation." And for the ragdoll: rotation is snapped to a multiple of 90
> degrees precisely because *"a rotation by a MULTIPLE OF 90deg is LOSSLESS — the
> pixels land exactly on the grid, no resampling, no morph."*

**The limbs never got that law.** The head is protected; the arms are resampled
every frame. That is the whole difference between the part of the body he
doesn't complain about and the part he does.

On top of the resample, four passes ADD pixels that were never painted:
- **JOINT WELD** — stamps limb pixels a second time under the parent frame near
  the shoulder and elbow. Duplicate pixels, exactly at the torso/arm junction he
  named.
- **refineSkin pinhole fill** — invents pixels to close gaps the resample opened.
- **EVERY PIXEL LANDS** — forces rest sources onto the screen when the resample
  dropped them.
- **MINIMUM HAND SLIVER LAW** — stamps a 2x4 rectangle of hand-coloured pixels
  when a head-on pose buries a hand. This is the "feature for the hands and arms"
  he says is clipping wrong: it is literally drawing a hand that the pose does
  not put there.

Every one of those exists to paper over damage from the resample. Kill the
resample and most of them stop being needed.

## THE LAW THIS ESTABLISHES

**LIMB RIGID STAMP (extends the HEAD RIGID STAMP LAW to the whole body):**
painted limb pixels are never resampled. A limb may be TRANSLATED freely and
rotated only in LOSSLESS steps; any residual angle is absorbed by moving the
joint, never by warping the art. No pass may fabricate a pixel that was not
painted. Where a pose genuinely needs a shape the art does not contain, the
answer is a painted frame, not an invented one.

Gate: a fabrication counter on the real render path — every clip, every facing,
every phase — that reports how many on-screen pixels have no painted source.
The number for a shipped clip is zero.

## WHAT THIS BLOCKS AND WHAT IT DOES NOT

- BLOCKS: shipping, judging or building on any animation clip as if approved.
- BLOCKS: any new clip authored against the current resampling renderer — it
  would inherit the same morphing on day one.
- DOES NOT BLOCK: the body variation sliders. They re-place Paolo's painted
  pixels in REST space and are then drawn by whatever renderer is live; they do
  not resample anything themselves and they get better, not worse, when the
  renderer stops morphing.
- DOES NOT BLOCK: the RUN, combat, city or quest lanes using the body as-is.
  The character still draws; it just is not approved-looking in motion yet.

## AMENDED SAME DAY — THE PROFILE IS A PLANK, AND THAT COMES FIRST

Paolo, after the first fix shipped: *"literally no difference between the new
rig and the old rig. I'm so fucking confused when I faced the east and try to
do all the animations. It's all really bad bro."*

Both halves measured and both correct — full write-up in
`records/BOHEMIA_EAST_PROFILE_FINDING_7_26_26.txt`:

- **"No difference" is true.** The weld removal changes 74% of frames by an
  average of **4.2 pixels** on a ~450-pixel body. Real, and invisible at 1x.
  Leading with "61% of invented pixels removed" was reporting a metric instead
  of an experience. The change stays in; it is not the fix and must never be
  presented as one again.
- **East is a NARROW SLAB, and that is ART, not the renderer.** Painted torso
  width is **8px on East against 13px on South**; whole-body width 17.2 vs
  21.2; arm pixels per frame 91 vs 142. Both arms live *inside* that 8px
  footprint, so in profile an arm can only slide around inside the body or
  poke out as a bar. No sampling change makes eight pixels read as a body with
  depth.

**So the order of work below gains a step ZERO: the profile body has to be
repainted with real depth before anything downstream is worth doing.** That art
is Paolo's and RIG LAW forbids me reshaping his regions — so it needs either
his hand or his explicit go-ahead for candidates. Until then, east stays a
plank and nobody should be polishing it.

## THE ORDER OF WORK (rig first, clips second — this is the whole point)

Redoing 60 clips on a renderer that morphs would produce 60 morphing clips. So:
1. Prove the fabrication with a counter on the real surface. Publish the number.
2. Fix the renderer: LIMB RIGID STAMP, and retire every pass that invents pixels.
3. Only then rebuild the clip set, judged against the fixed renderer.

## PENDING PAOLO

- **THE PROFILE REPAINT: his hand, or his go-ahead for candidates?** RIG LAW
  says I never reshape his painted regions, so this one cannot be assumed.
- Which clips are "the couple that are solid"? Naming them gives the rebuild its
  reference poses instead of starting from nothing.
- Whether the current clips are deleted outright before the replacement lands,
  or stay running as unapproved placeholders (this addendum assumes the latter).
