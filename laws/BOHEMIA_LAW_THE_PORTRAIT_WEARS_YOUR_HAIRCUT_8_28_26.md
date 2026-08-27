# BOHEMIA LAW — THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING (8/28/26, LOCKED)

## WHERE THIS CAME FROM

Paolo, 8/26: *"Eye colors matching the portrait again."*

That five-word ruling produced ONE ID, ONE WHOLE PERSON on 8/27, which fixed **skin**,
**hair colour** and **eyes**, and whose record says, in my own words, *"same person on both
sides now, every time."*

**The haircut itself was never checked.** It is the largest shape on a head.

---

## MEASURED, OVER 200 CITIZENS, BEFORE TOUCHING ANYTHING

| | |
|---|---|
| distinct haircuts on the **body** | **16** |
| distinct hair silhouettes the **portrait** could draw | **6** |
| of the 7 style names the portrait spec could hold, how many drew *different pixels* | **2** — `straight`, `coils`, `buzz`, `locs` and `afro` were byte-identical to each other |
| how often the portrait's hair length matched the body's | **24.7%** |

**24.7% is worse than the 33% a coin gives you over three bands.** That is the part worth
keeping. Two independent hashes are not merely *unrelated* — they can land anti-correlated,
so the system was doing slightly worse than if it had guessed. Three quarters of the people
in Bohemia had one haircut standing in front of you and a different one in the portrait
that popped up when they spoke.

---

## TWO CAUSES

### 1. A sentence I wrote that was false when I wrote it

The 8/27 code carries this comment, in `faceFor`:

> ~~THE CUT ITSELF IS STILL THIS FUNCTION'S, because the BODY has no notion of a hairstyle
> — NPCFactory picks a painted hair LAYER, not a portrait cut.~~

`NPCFactory` picks a painted layer. True. But **`BOH_PERSONLOOK.lookFor`** — which is what
actually dresses the crowd, and which `faceFor` was *already calling for their clothes* —
hands back `worn.hair`, one of the fifteen canon `genHair` styles. Measured: **set for 93%
of citizens.**

I checked one of the two things that dress a person, found no haircut there, and wrote down
that there wasn't one. **A claim about the codebase made from one of the two places is a
guess** (8/1: *do not claim things about the codebase without checking*).

### 2. Five dead names

`renderFace` tested `style === 'wavy_mid' || style === 'curly'` and drew a zig down each
side; every other name fell through and drew nothing. So five of seven names were the same
haircut. **A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A DIAL** (8/27) — third place that has
been true this week.

---

## THE FIX: THE SAME VOCABULARY, NOT A SECOND ONE

The portrait now reads **the five dials the body's own generator reads** — `side`, `front`,
`vol`, `flare`, `tex` — out of the one place a haircut's numbers are written down: the
`genHair` call that defines it.

There were exactly two ways to get those numbers: copy them into a second table, or read
the first one. **A second table is how the portrait and the body ended up wearing different
haircuts in the first place** (ENGINE SYNC LAW: one canonical body per module). So
`hairDialsFor` reads the call, cached once.

That is a real dependency on this file never being minified, which it is not — and the gate
asserts all fifteen canon styles resolve to **distinct** dial sets, so if a build step ever
mangles it the gate goes red the same turn instead of the crowd quietly going bald.

### Two things looking caught that measuring did not

**`front` was worth three pixels.** My first cut ran it from the top of the *face* to the
brow — about eight rows — so the whole dial was worth three of them and SLICK BACK and
FRINGE came out as the same haircut with a rounding error between them. The body measures
the same dial from the top of the *skull* to the chin. Matching that is not a style choice;
it is the difference between two renderers meaning the same thing by the same number.
Spread afterwards: **thirteen pixels** between the highest hairline in the game and the
lowest, against three.

**The mass let go of itself.** Moving the crown's outer corners with the hairline opened a
six-row stripe of bare scalp between the top of the head and the hair at the sides. Only
the three points of the front arc move now. (Same failure as the body's fall letting go at
the jaw the day before — a shape that stops being one piece.)

---

## THE RESULT

| | before | after |
|---|---|---|
| portrait/body agreement on hair length | **24.7%** | **88.2%** |
| correlation, body's length dial vs the fall actually drawn | ~0 | **0.924** |
| distinct hair silhouettes the portrait can draw | **6** | **56** |
| textures that move pixels | 1 of 7 names | **4 of 4** |

**The face Paolo approved is byte-identical.** Hash `c9856a89` on this tree and on
`origin/main`, checked rather than asserted. Every new dial is optional and every one
defaults to exactly the old drawing; the player's spec sets none of them, so the player
takes the default path. The gate hashes it every run.

**The texture stays the person's own roll, and that is honest rather than lazy:** all
fifteen canon body styles are `tex: 'solid'` (locs and braid belong to dead styles), so
there is nothing on the body to agree *with* yet. Four values that all move pixels, against
two that collapsed into "texture" and "no texture". When the body grows a textured cut,
this reads it the same way the shape dials do.

---

## THE GATE

`gates/portrait_haircut_gate.js` — **12 checks, all on rendered pixels, never on spec
fields.**

1. all fifteen canon haircuts resolve to distinct dial sets
2. **agreement ≥ 75%** on the rendered fall (measured 88.2%; a coin gives 33%)
3. **correlation ≥ 0.80** between the body's length dial and the fall drawn (0.924) — a
   band match can be luck, a correlation across 186 people cannot
4. **ceiling ≥ 40** distinct silhouettes (56)
5. all four textures draw something different
6. each of `side`, `front`, `vol`, `flare` moves pixels *on its own*
7. the approved player face is unmoved, by hash
8. this law records the number it *was*, not only the number it is

### Why it measures pixels and never fields

The first version of the report behind this gate compared `sp.hair.len`, a **string**. The
fix made the renderer read `sp.hair.side` instead — so `len` stopped driving anything, and
the ruler went on reading it and cheerfully reported that the fix had changed nothing.

**Third broken ruler in a week**, and the same shape every time: a number that is perfectly
true about something nobody is asking about. The ceiling probe was wrong the same way in
the same run — it drove the dead fields, so all 21 combinations rendered identically and it
reported a ceiling of **one** on a renderer that had just grown five dials.

---

## THE LESSON UNDERNEATH

**When you write down that something does not exist, say where you looked.** The comment
that cost this was not lazy and it was not vague — it named a mechanism (`NPCFactory`) and
described it correctly. It just wasn't the only mechanism, and nothing in the sentence
admitted that only one had been checked. A confident negative is the most expensive kind of
wrong, because nobody re-opens it.

---
Tab: **RUN** (talk to anybody) and **CHARACTER** (try the haircuts on).
Record: `records/BOHEMIA_THE_PORTRAIT_WEARS_YOUR_HAIRCUT_8_28_26.txt`.
Report: `tools/bohemia_does_the_portrait_wear_your_haircut.js`.
