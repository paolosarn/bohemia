# BOHEMIA LAW — THE HAIRLINE IN PROFILE, AND HAIR IS ONE PIECE (Paolo, 8/27/26, LOCKED)

## HIS WORDS

> "OKAY FOR THE HAIRS I DONT WANT TO JUDGE ALL OF THEM DOWN BRO BUT HOLY SHIT. U HAVE TO
> FIX THE FOREHEAD SHIT YOU GOT THE FOREHEAD ALL WRONG EAST AND WEST. AND ITS SO
> CONFUSING WHEN ITS FACING EAST AND WEST LIKE YOU HAVE THE HAIR **BALDING BACK FURTHER
> THAN IT SHOULD BE**. AND MOST HAIRS EAST AND WEST ARE JUST LIKE **A SINGLE LINE GOING
> DOWN**. AND THE VERY LONG PAST SHOULDER LENGTH HAIRS LIKE THEY **BREAK IN THE MIDDLE OF
> THE HAIR**. AFTER THE HEAD THERES **NOTHING UNTIL THE SHOULDERS** FACING NORTH AND
> SOUTH. CMON MAN"

Four complaints. **Three causes**, and two of the four came out of a single line of code.

---

## FIRST, THE PART THAT MATTERS MORE THAN THE FIX

**Every number I had said he was wrong.** A measurement pass over all fifteen canon styles,
written before touching anything, reported: zero bare forehead in profile, a median row
eleven pixels wide, and one break in forty-five style/facing pairs. Green, green, green.

Every one of those readings was asking a question that was *nearly* the right one:

| what he said | what I measured | why it came back green |
|---|---|---|
| the forehead is wrong side-on | bald columns on rows **above** the face part | side-on that is two rows, and the bald patch is *beside* the face, not above it |
| it is a single line going down | the **bounding box** of each row | a row with hair at both ends and a hole between measures eleven pixels wide |
| the long hair breaks | rows with **no hair at all** | the break is horizontal — the fall lets go of the head — and every row still has hair somewhere |

This is the second time in three days a metric has told me he was wrong about his own art.
On 8/25 an edge-parity audit read 50.9% "already native" while nine of fifteen styles were
solid blocks, because it was measuring the outline and the shape is the inside. So it is a
rule now and not a coincidence:

> **WHEN A NUMBER DISAGREES WITH HIM ABOUT A PICTURE, GO AND LOOK AT THE PICTURE, AND THEN
> FIX THE RULER.** He is describing pixels on a screen. He is not wrong about them.

What actually found all four was rendering **every canon style in every direction and
looking at it** — which is what his own PLAYTEST DISPATCH (8/25, item 3) told me to do
before another cook, and which I had not done.

---

## CAUSE 1 — SIDE-ON, A FACE IS MOST OF A HEAD

Printed the part grid in profile. The whole thing falls out of it:

```
 row 10-11   ########                  the crown: all skull
 row 16-25   ####FFFFFFFFFFFF          FOUR columns of skull, TWELVE of face
```

The head is 16–18 pixels across side-on and **only the back four to six are the skull
part**. The forehead, the temple, the ear, the cheek and the jaw are all painted as the
FACE region, because side-on the face *is* most of the head.

`put()` refuses to paint hair on a face pixel on any facing that is not `back`, except
above the style's forehead line. So hair got the top fifth of the head, plus a four-pixel
strip down the back.

**That is both of his first two complaints, from one rule.** A hairline that stops a fifth
of the way down is "balding back further than it should be". A four-pixel vertical band is
"a single line going down". They arrived in one sentence because they are one bug.

**And the 8/2 fix already knew this and only did half of it.** That turn taught `sideBot`
that "profile joins back" — how far *down* hair may reach — and left `put()`, which decides
what it may reach *across*, still believing a face part is a face. Side-on it is a head with
a face on the front of it.

### The fix: a real hairline

Hair may paint the face part **behind a per-row front limit**, which is what a hairline
actually is:

- everything down to the style's own forehead depth,
- receding over three cells to a **temple line**,
- then holding, and past the ear pulling back toward the nape — because that is where a
  real hairline goes, and there is no scalp on a jaw.

**The style's `front` dial drives it**, so a fringe still sits forward (43% of the width
left to the face) and a slicked-back head still recedes (55%). The dial that already meant
"how far down the forehead" now also means "how far forward at the temple" — the same fact
about the same haircut, seen from two sides. That is 8/25 clause 1: ONE haircut from every
angle.

**The first cut of this receded past the style's own LENGTH dial and I killed it by
looking.** `side: 0.30` says a buzz cut does not *hang* below a third of the head; it does
not say the scalp stops there. Keying the recede to `side` turned BUZZ CUT back into a
four-pixel strip — the exact bug being fixed. **I had reached for the nearest dial instead
of asking what the dial meant.** The ear is a fact about the head, so the recede is
measured on the head.

The eye, the nose and the mouth live in the front 40% of a profile. The temple line never
reaches them, and the 8/20 rule holding the air in front of his face empty is untouched.

---

## CAUSE 2 — A LOOP WITH TWO BOUNDS HAS TWO PLACES TO BE WRONG

On a front facing the fall below the forehead is drawn as two curtains, and the loops run
from `mn` to `fs[0]+cw`, and from `fs[1]-cw` to `mx`.

An earlier fix — correct in intent, and its comment says exactly the right thing, *"HAIR
HANGS FROM THE WIDEST PART OF THE HEAD, NOT FROM THE CHIN"* — widened `fs` to the whole
head on the last rows of the skull. It left `mn` and `mx` where the mass loop had put them,
which on those rows **is the chin**.

So the left loop started to the right of where it was told to stop, and the right loop
stopped to the left of where it started, and **both ran zero times.**

Measured on LONG LOOSE facing S: rows 16–29 drew hair, **rows 30 and 31 drew nothing at
all**, row 32 picked up again. Two blank rows right at the jaw, so the hair let go of the
head and started again at the shoulder.

**That is his sentence, exactly, as a pair of numbers:** *"AFTER THE HEAD THERES NOTHING
UNTIL THE SHOULDERS."*

Moving one of two loop bounds is not a fix, it is a fifty-fifty. Both move together now.

---

## CAUSE 3 — A NAPE IS WHERE HAIR ENDS

From behind, the last two rows of the skull draw inward to a nape. That is his own 8/1
ruling and it is right — for hair that **ends** there.

It was drawing on every back view however long the style was. Measured on LONG LOOSE facing
N: rows 28–29 drew 6 pixels and row 30 drew 11. The mass pinched to a point at the jaw and
flared straight back out underneath it — **a waist in the middle of the hair**, which is
what "breaks in the middle" looks like when the break is a narrowing rather than a hole.

Same mistake as cause 2, on the other side of the head: a shape that is right for hair
ending at the nape, applied to hair on its way past the shoulders. Real long hair has no
nape line; the mass runs straight down and the neck never shows.

It only draws when the hair actually stops there. Nothing about a crop, a buzz or a bob
changes.

---

## AND ONE THING ONLY LOOKING CAUGHT, AFTER THE FIX

With hair covering the side of the head, the strand-separation shadow — one dark pixel
every four cells, drifting to keep it from being a rule — turned into **ruled horizontal
lines across the crown**. The drift stepped once every four pixels, which was invisible
back when the mass was four pixels wide and reads as a straight line with two kinks in it
across fourteen. **A segment length has to be small against the thing it is breaking up,
and this one stopped being small when the mass grew.** Halved, so a fourteen-pixel run gets
seven moves instead of three. No new travel: the parting still only moves by one pixel.

---

## THE RESULT, MEASURED ON THE REAL RENDER

| | before | after |
|---|---|---|
| profile styles balding at the brow (under 33% of the browline) | **11 of 15** | **0 of 15** |
| worst browline coverage in profile | **25%** | **56%** |
| typical row of hair below the brow, in profile | 10–11px | **12–16px** |
| style/facings with a piece of hair floating off the head | **6 of 75** | **0** |
| style/facings whose fall chokes at the neck | **8 of 75** | **0** |
| style/facings drawn in more than one piece | 11 of 75 | **5 of 75** |

The five that remain are short styles on the front facing — SLICK BACK, SALT CROWN, GREY
WISPS — whose crown band and temple hair meet only along the outline. Nothing floats, and
he did not name them. Recorded rather than quietly capped.

Not one haircut was deleted, shortened or renamed. The long styles all still hang past the
jaw, which the gate checks separately, because **a haircut that is whole because it stopped
at the jaw would pass every other test in this law.**

---

## THE GATE

`gates/hairline_gate.js`, measured on the real render, never on the generator's own claims.

1. **The ruler proves its own eyes first.** It runs the whole measurement on a bald head
   and asserts a bowl cut moves at least 60 pixels of the profile render. Three of the four
   numbers in the first version of this measurement reported green on a build that was
   visibly broken in four ways, so a check here that only reports a number is not worth
   having.
2. **No style is balding back in profile** — at least 33% of the browline row is hair.
3. **No style in profile is a line going down** — at least 7 hair pixels in a typical row
   below the brow.
4. **No piece of hair floats off the head** — the hair is flood-filled into blobs and any
   real blob (6+ pixels, 2+ rows) that does not touch the head is a failure. **This is the
   check no per-row test can make**, and it is why the first ruler missed everything.
5. **No fall chokes at the neck** — the narrowest row at the neck is at least 45% of the
   widest row of the fall.
6. **The past-shoulder styles are whole from every angle**, and **they still hang past the
   jaw**.
7. **This law records the cause and not just the symptom** — it fails if the text stops
   naming the face part or the loop bound, because a fix whose reason has been deleted is
   the thing that rots first.

The measurement body is **imported from `tools/bohemia_hair_the_four_complaints.js`**, so
the gate and the report can never drift into disagreeing about what a break is.

---

## THE LESSON UNDERNEATH

**Two of these three bugs were half-finished fixes, and both left a correct comment
standing over incorrect code.** The 8/2 turn wrote "profile joins back" and taught it to
one of the two places that needed it. The curtain fix wrote "hair hangs from the widest part
of the head, not from the chin" and moved one of the two bounds that decide where it hangs.

Both would survive any review that reads the comment and believes it. Only the pixels
disagreed, and only someone looking at them would know.

---
Tab: **CHARACTER** (try the haircuts on) and **RUN** (everybody on the street).
Reference sheet: `slices/look/hair-reference.png` — every canon style, five facings.
Record: `records/BOHEMIA_THE_HAIRLINE_IN_PROFILE_8_27_26.txt`.
The 56 pin moved on purpose: `gates/clothes_56_pin.txt` carries the reason in its header.
