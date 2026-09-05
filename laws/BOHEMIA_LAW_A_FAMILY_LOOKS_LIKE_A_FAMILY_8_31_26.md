# A FAMILY LOOKS LIKE A FAMILY (8/31/26, CHARACTER lane)

Paolo, 8/31, one word: **"VAMILY."** He had just watched the opening — the family at the
table, the blink, ten years later. The word is FAMILY.

The honest answer was a number, and it was bad.

---

## MEASURED FIRST, WITH A CONTROL, BEFORE ANYTHING WAS TOUCHED

A claim like "the family resembles each other" is not checkable on its own: everybody in
this game comes out of one generator, so any four faces share something. The only claim
that means anything is **more alike than strangers**. So the report renders the four, and
50 control groups of four random citizens from the same function, and compares the same
traits both ways.

| | family | four strangers |
|---|---|---|
| same skin tone | **0.0%** | 9.0% |
| same hair colour | 16.7% | 25.0% |
| same eye colour | 16.7% | 17.3% |
| skull difference | 2.19 | 2.06 *(lower = more alike)* |

**The family was LESS alike than four people off the street, on every single trait.** Not
one pair in that house shared a skin tone.

The cause is one line: they are keyed `FATHER:RAY`, `MOTHER:DENISE`, `BROTHER:MARCO`,
`SISTER:NINA` — four independent hashes. Nothing in the pipeline had ever been told they
were related.

---

## HEREDITY RIDES THE ROLL, NOT THE FINISHED FACE

This is the whole trick and it is worth stating plainly, because the obvious version is
wrong in a way that is hard to see.

The obvious version: take the child's finished face and pull its numbers toward the
parents' finished numbers. That **destroys A CHILD IS NOT A SMALL ADULT** (8/27) — the
parents' numbers already have *adult* baked into them, so blending toward them undoes
every child adjustment in `faceFor`.

`faceFor` derives everything from `faceRollHash(id, salt)` and `faceBell(id, salt)`. So:

> **The rolls are the genes. The age is the expression.**

One wrapper (`kinMix`) makes a child's rolls a weighted blend of its parents' rolls at the
same salt, and then the whole of `faceFor` runs normally — so the child inherits the dice
and then grows into its own body. Every dial downstream inherits for free, and **no second
face generator was written**, which is how the portrait and the body became different
people on 8/27.

`h = 0.62`: a child sits most of the way to its parents and keeps about a third of its own
draw. Facial morphology is high-heritability but it is not a copy.

**And not everything blends.**

- **Eye colour is copied from one parent** (86% of the time, the rest their own). Averaging
  index 1 (brown) and index 3 (green) in a list whose order means nothing would hand a
  child grey — a colour neither parent has and no gene produced.
- **Skin is blended**, because skin is additive and polygenic: a child of a light parent and
  a dark one lands between them. Blended on **lightness**, not on list position, because
  `SKIN_TONES` is nearly but not exactly ordered (pale sits darker than fair) — so blending
  the index would quietly mis-rank two tones. Blend what the eye actually reads, then snap
  to the nearest tone the palette has.
- **Hair colour is copied from a parent**, because it does not come from a roll at all — it
  comes from `NPCFactory`, which owns skin and hair for the whole valley and knows nothing
  about who anybody's parents are.

---

## GREY IS AN AGE, NOT A COLOUR

Measured over 400 people at each age, asking the game for the age explicitly:

| child | teen | adult |
|---|---|---|
| **29.8%** | 24.3% | 26.0% |

**A child in this valley was as likely to have grey or white hair as an adult.** The age
dial moves the skull, the eye height, the brow, the nose and the mouth, and had never
touched the hair. That is how NINA — a child at a pre-apocalypse family dinner — came out
grey, and how a mother young enough to have a small child came out white.

The fix asks the **same** picker for another draw rather than inventing a palette, so the
population's weighting is untouched and only the age constraint is new. Same division of
labour the skull already uses: *the range makes people different, the clamps keep them
people.*

**It applies only where a caller asserted an age**, and that limit is not timidity. The
first cut gated on the *rolled* age, which fires for the anonymous crowd too — and
`talking_portrait_gate` caught it within the minute: portrait-to-body hair agreement fell
100% → 94.0%, which is ONE ID ONE WHOLE PERSON broken by the very fix that was citing it.

> **A crowd citizen's age is a portrait-only fiction.** `faceFor` rolls one; the body
> standing in the street has no age at all. Re-picking hair for a "child" only the portrait
> believes in makes the head and the body two different people again.

Giving the crowd real ages is a **system**, not a clamp. It is a named row, not something
to fake here.

---

## WHAT IT LOOKS LIKE NOW

| | family | four strangers |
|---|---|---|
| same skin tone | **16.7%** | 9.0% |
| same hair colour | **33.3%** | 25.0% |
| same eye colour | **100.0%** | 17.3% |
| skull difference | **1.47** | 2.06 |

RAY light with black hair; DENISE dark with blonde; MARCO mid-toned with his father's
black; NINA mid-toned with her mother's blonde. All four blue-eyed. The children sit
between their parents, and the siblings look more like each other than like either parent —
which is what siblings do.

The approved player face is **byte-identical** (hash `c9856a89`), the crowd is untouched,
and heredity is opt-in through `kin`.

---

## AND THE RULER LIED ABOUT THE MOST VISIBLE TRAIT IN THE GAME

The first report said **skin agreement 100%** — for the family *and* for the strangers —
while the rendered picture showed four different colours of person sitting at one table.

It read `spec.skin`, which `faceFor` has never set. The resolved tone lives on `_tone`. So
it compared `undefined` to `undefined`.

> **A metric that reads a field that does not exist reports perfect agreement.** It will do
> it confidently, and forever, and it will do it about the thing you care most about.

Only rendering the four and **looking** caught it. Eleventh broken ruler this month, and
the same shape as the other ten: reading what I expected instead of what is there.

A second one, the same afternoon: the report built its **own** copy of the face key
(`role + ':' + name`) instead of calling the game's. When heredity landed, the numbers did
not move by a thousandth — because the ruler was still measuring the old path while the
game had moved. **A ruler that builds its own copy of what it measures is measuring its own
copy.**

---

## WHO THEY ARE STAYS HIS

The mechanism is mine; the people are Paolo's. `FAMILY_CAST` already carried the names
(RAY, DENISE, MARCO, NINA — all `draft:true`), the ages, the bodies and the clothes. The
kinship graph is **read** from the cast's own `survivesIf` field rather than typed here: a
parent is a member who survives `'always'`, and anybody else is a child. And an explicit
`face` block on a cast member still overrides every line of this.

Tab: **RUN** (the opening — they speak, and their portraits pop up) / **CHARACTER** (the
family cards, all eight facings).
Gate: `gates/family_gate.js` — every claim carries its own control, and deleting heredity
turns it red and reproduces the original numbers exactly.
Report: `node tools/bohemia_do_they_look_related.js`
Record: `records/BOHEMIA_DO_THEY_LOOK_RELATED_8_31_26.txt`
