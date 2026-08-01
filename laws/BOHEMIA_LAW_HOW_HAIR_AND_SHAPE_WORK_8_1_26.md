# BOHEMIA CRAFT LAW — HOW HAIR AND SHAPE ACTUALLY WORK (Paolo 8/1/26, LOCKED)

> "Please remember all my feedback and put it into your own training data"
> — Paolo, 8/1/26

## WHY THIS FILE EXISTS, STATED HONESTLY

He asked for his feedback to go into my training data. **That is not something I
can do.** Nothing learned in a session persists into the model; the next session
boots the same weights, with no memory of this one. A promise to "remember" is a
lie, and a lie he would only discover three sessions from now when the same
mistake came back.

What CAN persist is this repo. GIT IS THE MEMORY is a standing law here for
exactly this reason. So his craft feedback is written down as LAW, not as a note,
and the checkable clauses are wired to gates — because A LAW WITHOUT A MACHINE
GATE IS NOT ENFORCED, and this repo has already proven that six of nine ungated
laws were silently broken.

**This file is the training data. The gate is the memory.**

---

## THE SEVEN RULES, from the 8/1 hair verdicts

### 1. THE BACK IS NOT THE FRONT
> "the shape from the front and the back for a lot of hairstyles whether I proved
> or disapprove them they are coming off very similar and not well research that a
> front shape would look different than when a person would turn around"

A silhouette that reads the same from both sides has not been designed, it has
been mirrored. **This generalises past hair**: it is the same defect as coats
showing their open front from behind (fixed 8/1) and shoes being byte-identical
front to back (still outstanding). Anything worn on a body must be authored for
the direction it is seen from.

### 2. COVER THE HEADSPACE
> "a lot of the back of the heads there's a lot of headspace that should be
> covered more by hair absolutely that's the first thing"

Bare scalp where hair should be reads as a bug, not a style. The cause was a
front-facing constraint (stop above the brow) being applied on back facings where
there is no face to avoid. **The general lesson: a constraint that exists to
protect one view must be scoped to that view.**

### 3. NO STRAIGHT LINES — HAIR IS LITTLE OFF SHAPES
> "a lot about hair is about just the little off shapes that it makes so even
> something with the shag you know how you shape the hair you know I'm seeing you
> make like a lot of straight lines and that's not realistic at all"

Perfectly straight edges read as machine-drawn. Irregularity must be
DETERMINISTIC (same input, same wobble, forever) or an NPC shimmers between
frames. Randomness is not the answer; a hash is.

### 4. TWO PIXELS OF HAIR, ONE PIXEL OF SKIN  *(AMENDED 8/1, same day)*

> "new rule for cornrows or any sort of skin to hair hairstyle one pixel for the
> skin two pixels for the hair pretty please and thank you"
> — Paolo, 8/1/26, superseding his own earlier wording below

**THE RATIO IS 2:1, HAIR TO SKIN.** Wherever skin shows through hair — cornrows,
ropes, braids, any weave — two pixels of hair, one pixel of skin. It applies to
the CLASS ("any sort of skin to hair hairstyle"), not to one style.

**AND I GOT THIS WRONG IN BOTH DIRECTIONS, which is why it is written twice.**
The original generator was `%3` — already 2 hair : 1 skin, already right. His
first note said "the difference is just one pixel not like two or three", I read
that as 1:1, and changed it to `%2`. That was OVER-reading him: he was rejecting a
*three-pixel gap*, not asking for a one-pixel *ram*. My "fix" was a regression he
then had to spend a turn correcting. **When a note could mean two things, the one
that changes working code needs checking before it ships.**

At 56px the difference is not subtle: 1:1 reads as grey mush, 2:1 reads as rows.

### 4a. THE SUPERSEDED WORDING, kept for the audit trail


> "when we don't have a lot of real estate to work with ... The difference is just
> one pixel not like two or three"

Said twice, unprompted. At 56px a 2-3px alternation collapses into a solid mass
with a stripe. Texture at this scale is **one pixel on, one pixel off**. This is
the single most transferable rule in this file: it applies to every future
texture, weave, stripe, or rope anywhere on the body.

### 5. CENTRE WHAT SHOULD BE CENTRAL
> "Mohawk is good, but I would like to see you ... just have it more central on
> the head. You kinda have it like off to the right so please fix that"

The cause was `Math.round` on a midpoint: **.5 breaks upward**, so on an
even-width span the centre lands one pixel right, every single time, forever.
Use floor, and centre on the CURRENT row's span so it tracks a tilted form.
Any centred feature anywhere in this codebase has this bug latent in it.

### 6. A FADE MUST ACTUALLY FADE
> "I'm not seeing you with any of the hairs that you're making like try to fade in
> a natural skin color that's customizable obviously to the hair"

A shape that simply stops is not a fade. A fade BLENDS INTO THAT PERSON'S SKIN
TONE, and the blend is customizable per hair colour. **BUILT 8/1/26.**

He was right that it is the same machinery as cornrows: *"I'm sure all the coding
or whatever you're doing for the cornrows will help you make more hairstyles with
fades or whatever when skin touches the hair."* A fade is not a colour ramp, it is
a **DENSITY RAMP** — near the crown hair is solid, and toward the taper more of the
skin underneath shows through, until it is skin. So it is expressed in the SAME
`texSkip` that draws a cornrow, on the same head-anchored phase, which is what
stops it scattering into noise.

It blends into SKIN, not into a paler hair tone: skipping a pixel means the body's
own colour shows, whatever that person's complexion is. That is what makes it
"customizable obviously to the hair" for free — it is the real skin underneath, per
citizen, with no palette of mine involved.

MEASURED, HIGH FADE from behind, hair coverage per row:
`92% -> 69% -> 54% -> 42% -> 33% -> 25% -> 0%`. BUZZ CUT, which has no fade, holds
~90% and then stops dead. That difference is the whole clause, and it is why
SHAVED FADE was killed ("there's no sort of fade").

STILL HIS: three fade shapes ship as CANDIDATES (st:'cook'), never canon on my
say-so, and BOH_PERSONLOOK only ever picks canon — so a fade cannot reach a citizen
for free while the unlock in A HAIRCUT IS A LUXURY is unresolved.

### 7. LONG HAIR SHOWS FROM THE FRONT
> "with more of the longer hairstyles even from the front I would like to see you
> know a couple pixels of hair, depending on that sort of hairstyle from the
> front, even if it is in the back of the head"

Mass behind the head is still visible past the silhouette from the front. A style
is a 3D volume, not two independent 2D drawings.

---

## THE PROCESS FEEDBACK, from the same day — equally binding

These came out of him catching me, or my own gates catching me, on 8/1. They are
recorded because the code lesson is worthless without the working lesson.

**A GATE MUST NEVER OUTRANK A RULING.** The hair gate asserted "he got a real
batch (>=20 shapes)" against the CANON count. He killed 13 of 26 and the gate went
RED — reporting a failure for the pipeline working exactly as designed. If a gate
turns his verdict into my error, the gate is wrong. It happened three times this
day; every time the fix was the gate, never his ruling.

**A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE.** Four
separate times in one day: the person-look gate failed on its own header quoting
him; the crowd gate failed on a comment saying "never buildFrame"; RIG CHECK
failed another lane's tool over the English words "BAKED FROM"; the graveyard gate
reported a resurrection because AFRO appears inside a base64 blob and LOCS inside
"VOTING BLOCS". Documenting a rule is not breaking it.

**A METRIC THAT AVERAGES OVER THE WHOLE THING CANNOT SEE A CONSTANT PART OF IT.**
The crowd gate read 12/12 distinct people while every one of them had the
identical face, hair and skin — bodies and clothes differ enough to mask it. The
hair gate read 11/26 distinct because it hashed the OUTLINE, and a hairline is a
boundary INSIDE the head. **Fix the ruler, never the target.**

**DISTINCT-AS-A-TUPLE HIDES A DIAL THAT BARELY MOVES.** "200 people, 188 distinct
bodies" stayed green while two of twelve citizens rendered byte-identical: six
dials only have to disagree in ONE place to count as distinct. Measure every
dimension separately, on realistic sequential inputs.

**VERIFY ON THE REAL SURFACE, AND LOOK AT IT.** Every bug he reported on 8/1 —
the bare backs, the coats opening down the spine, the identical heads — was
invisible to a green gate and obvious in a screenshot. Render it and look before
claiming it works.

**DO NOT CLAIM THINGS ABOUT THE CODEBASE WITHOUT CHECKING.** I told him "nothing
in the repo varies a person's appearance" (false — NPCFactory had since 7/2) and
"not one clothing generator is facing-aware" (false — 12 of 13 were; my grep
pattern was broken). Both went into commit messages and module headers before
being caught. A claim is a thing the machine can check; write it that way or do
not write it.

---

## GATE

`gates/craft_law_gate.js` pins this file's clauses and asserts the ones a machine
can check today are still enforced in the code that implements them. Clause 6 is
unbuilt and the gate records it as outstanding rather than pretending otherwise.
