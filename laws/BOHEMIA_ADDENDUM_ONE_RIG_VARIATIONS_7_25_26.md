# BOHEMIA ADDENDUM — ONE RIG, VARIATION SLIDERS (Paolo 7/25/26, LOCKED)

**SUPERSEDES `laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md` IN FULL.**
Newest date wins. The woman-rig addendum has been moved to `/archive`
(registry: `gates/bohemia_superseded.txt`). Do not build from it. Do not cite
it as live canon.

---

## THE RULING (Paolo, verbatim intent)

> "We're actually gonna remove the whole female rig. I'm not gonna be doing
> this horse shit with you. It's all really bad. I go through the animations,
> it's all fucked up. Everything is gonna be off the male rig. However I would
> like to see options for the rig for people to be shorter or taller, maybe
> their stomach's a little wider or skinnier, their arms and stuff, and we have
> to make that work. Because this two-rig, male and female shit you're doing is
> really bad and I'm really unimpressed. And we're actually gonna create a new
> session for that."

1. **THE SEPARATE FEMALE RIG IS DEAD.** Not paused, not iterated, not v5.
   Removed. There is ONE rig and it is Paolo's painted male rig.
2. **EVERYTHING RENDERS OFF THE ONE RIG.** No second `BAKED`-shaped body
   package. No `BODY_RIGS` fork between two authored bodies.
3. **THE REPLACEMENT IS VARIATION SLIDERS ON THAT ONE RIG.** Height (shorter /
   taller), belly (wider / skinnier), arms, and the rest of the body dials.
   Every human in the world is the one rig plus a set of slider values.
4. **A NEW SESSION BUILDS IT.** Not this one. This session's job was to record
   the ruling and stop.
5. **THE TWO-RIG APPROACH IS GRAVEYARD-FINAL.** Nobody re-pitches "let's author
   a second body." A dead approach stays dead; the sliders answer the slot.

---

## WHY IT DIED (post-mortem, so the next attempt does not repeat it)

Full detail in `records/BOHEMIA_WOMAN_RIG_POSTMORTEM_7_25_26.txt`. The short
version, honestly stated:

- Four versions shipped in one session. Every one was judged bad on the real
  surface. The gates were green the whole time — **green gates never once
  predicted whether Paolo would like it**, because the gates were measuring the
  invariants I chose, not the thing he was looking at.
- **I verified idle poses, he looked at the animations.** He said "I go through
  the animations, it's all fucked up." My whole verification loop screenshotted
  a standing body. I never once got a working animated capture of the derived
  body — I tried, the phase-forcing did not take, and instead of fixing the
  harness I moved on and reasoned about the rest data analytically. That is the
  VERIFY-ON-THE-REAL-SURFACE law broken in spirit while appearing to be
  followed. The single biggest process failure here.
- The research I ran (at his instruction) said plainly that **no studio derives
  a female body by transforming a male one** — they author a separate body on a
  shared skeleton, or cross-fade hand-sculpted morphs, and pure squash/stretch
  is rejected because affine scale preserves ratios and dimorphism *is* ratios.
  I surfaced that finding and then kept tuning the transform anyway. The
  research was already telling me the approach had a ceiling.
- The derived body kept breaking things that were fine on the male: a hip
  shading seam, stray pixels, misplaced nipples, and a silently wrong garment
  contact law. Each was a real bug I fixed — but a pipeline that manufactures
  fresh bugs on every tune is the signal, not the individual bugs.

**The lesson that generalises:** a second authored body multiplies every
downstream contract (garments, shading laws, skeleton-anchored details, clip
poses). One rig with parameters multiplies nothing.

---

## THE SPEC FOR THE NEW SESSION (build from this, not from the dead addendum)

### The shape of it
`G.bodyVar = {height, belly, arms, ...}` — a small set of named scalar dials,
default all-neutral, applied to the ONE painted rig. Neutral must be
**byte-identical** to today's male render: the existing character cannot shift
by a single pixel when the feature lands.

### Dials Paolo named (his words, these are the requirement)
| dial | his phrasing | notes |
|---|---|---|
| height | "shorter or taller" | the one he said first |
| belly | "stomach's a little wider or skinnier" | |
| arms | "their arms and stuff" | thickness and/or length, unruled |
| *(more)* | "and stuff" | **UNRULED — do not invent dials he did not name without asking** |

### What the last session learned that this one should inherit
These were paid for in blood; do not rediscover them.

1. **HEIGHT IS THE HARD ONE AND IT IS FIRST ON HIS LIST.** It moves foot
   placement, which touches the ground plane and the occupancy contract (one
   body per cell). It is not a width tweak. Sourced anthropometry, if useful:
   real height varies ~0.92x between the sexes while head size varies only
   ~0.96x, i.e. **the head should barely scale while the body does** — uniform
   scaling of the whole sprite is the thing that reads as "a child," not "a
   shorter adult."
2. **THE BONE TRANSFORM IS ANISOTROPIC BY LAW.** `seg()` — WIDTH LAW, Paolo
   7/2/26: the along-bone axis scales with bone length, **the perpendicular
   axis never scales**. So a *height* dial can ride the skeleton (bone lengths
   change — this is what the rig already does natively and it is the cheap
   dial). A *width* dial (belly, arm thickness) **cannot** ride the skeleton at
   all; it has to reshape rest-space pixels before the skinner sees them.
   These two dial families are fundamentally different machinery. Plan for
   that split up front instead of discovering it midway.
3. **THE ANATOMY BORDER RULE WILL BITE ANY WIDTH DIAL.** The renderer outlines
   any body pixel with empty space above it. If a widened part ever juts out
   past the part above it, you get a hard dark line across the join that reads
   as the limb detaching. A belly dial must keep the torso/leg silhouette
   continuous at every join, at every dial value.
4. **PARTS OVERLAP IN THE SOURCE DATA.** On the hip row the torso and both legs
   claim the same pixels; draw order resolves it at render time. Any per-row
   remap must track membership PER PART or the legs clobber the torso and it
   silently loses a row (garments key off the torso part, so this corrupts
   clothing, not just the body).
5. **SKELETON-ANCHORED DETAILS MUST READ THE ACTIVE BODY.** Nipple placement,
   the shoulder blend, and the GARMENT CONTACT LAW all measured against
   hardcoded `BAKED.skeleton` and were silently wrong on a modified body. A
   `rigSkel(d)`-style accessor already exists in the alpha from this work —
   **keep that fix even when the female rig is stripped**, it is correct for
   sliders too.
6. **THIN ART MUST NEVER BE CULLED.** A de-speckle pass that removes lone
   pixels will eat the neck (a 4x2 strip whose corners legitimately have one
   neighbour) and the torso apex in profile. Scope any cull to solid parts and
   never let it empty a row.
7. **VERIFY THROUGH THE ANIMATIONS, NOT THE IDLE POSE.** This is the one that
   killed the last attempt. A slider is not verified until it has been watched
   through the real clip set, on the real surface, at multiple dial values.
   **Build the animated-capture harness FIRST, before tuning anything.**

### The gate this needs (FACTORY LAW: same turn as the machinery)
- neutral dial values render **byte-identical** to the current canon body
- every dial, at its extremes, keeps: no part-join cut-lines, zero stray
  pixels, complete part-id sets in all 8 directions, and every canon garment
  rendering without error
- the dials are **continuous** — no value in range produces a broken frame
- coverage across the real clip set, not just idle

### Do not decide these without Paolo
- how many dials, and what "and stuff" covers beyond height/belly/arms
- the range of each dial (how short is shortest)
- whether dials are per-NPC-random, player-chosen, or both
- whether any dial is faction- or role-coded

---

## CLEANUP OWED -- DONE 7/26/26 (all of it, in one commit)

Everything below was carried out exactly as written. Record:
`records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt`.

- REMOVED: `FEMALE_BAKED`, the `bakedFor()` rig-name fork, `BODY_RIGS`,
  the CHARACTER tab's FEMALE picker button, the dead `G.bodyRig` state,
  `tools/bohemia_female_rig_transform.py`, and `gates/woman_rig_gate.js` (plus
  its line in `gates/bohemia_gates.py`, replaced by the BODY VARIATION gate).
- KEPT, as instructed: `rigSkel(d)` and the three call sites it fixed. Those
  were real bugs on the male body's own contracts and are correct for sliders.
- KEPT: the buildstamp/ship discipline and the pelvis/stray/nipple lessons.
- The SEQUENCING TRAP was respected: the tombstone for the dead tokens
  (`const FEMALE_BAKED`, `const BODY_RIGS`, `G.bodyRig` -- all DEAD, never
  re-add) landed in the graveyard in the SAME commit as the code removal,
  never before it.

---

## THE SLIDERS -- BUILT 7/26/26

`G.bodyVar = {height, belly, arms}`, live on the CHARACTER tab, neutral is the
canon body by identity (the resolver returns the canon object ITSELF, so the
existing character cannot shift by a pixel). Machine:
`engine/bohemia_bodyvar.js`, gate: `gates/bodyvar_gate.js` (37 checks),
real-surface harness: `tools/bohemia_bodyvar_capture.js`.

**ONE MEASURED CONSTRAINT WORTH KNOWING, discovered on the real surface:**
"taller" is capped by the 56px sprite frame, not by taste. Paolo's painted body
already paints on the top row in nine clips; at +8% the head gets shaved on
idle/walk/run, at +6% nothing does. Shipped at +-6%. Going bigger needs a
ruling (taller frame, or re-centring canon), it is not a tuning knob.

The DIAL RANGES themselves remain **[PENDING Paolo]** exactly as this addendum
requires -- they ship as candidates in one declared table (`BOH_BODYVAR.AMP`),
so a verdict is a one-line edit. Nothing was wired to randomise NPC bodies:
whether dials are per-NPC-random, player-chosen, or both is still his call.
