# THE COLOUR WAS NEVER THE BUG, THE GEOMETRY WAS

**8/19/26 — WORLD lane. Two district icons the hue gate has called "monochrome" for
three weeks were not painted wrong. They were painted correctly and then covered up
by their own walls, and every attempt to fix them repainted the thing nobody could
see.**

---

## WHAT THE GATE SAID, AND FOR HOW LONG

`gates/hue_gate.py` has been red since 7/29 on the same four names:

```
FAIL: no icon is monochrome -- every district carries at least 2 hue families
      -- policestation(1), stadium(1), cemetery(1), basin(1)
```

`gates/squint_gate.py` has been red the same length of time on one:

```
FAIL: every icon is a SHAPE at map zoom, not an empty box or a filled one -- radio 1%
```

Both gates are ratchets, both were measured red at the parent commit and red at
HEAD with a byte-identical failure list, so this is old debt and not a regression
from the five new landmark icons that landed this session (the set went 64 -> 69
districts and the lists did not move).

Being old is not a defence. Five of sixty-nine districts read as mud or as nothing
on the MAP tab, and the law those gates enforce is EVERY DISTRICT IS ITS OWN
LANDMARK (Paolo 7/28).

## THE PART THAT MATTERED

Before changing a colour I asked a different question: is the second colour
*desaturated*, or is it *absent*? Those need opposite fixes and they look the same
in a hue histogram. So I counted pixels where green beat both other channels:

```
policestation  green-dominant=0   blue-dominant=297320
stadium        green-dominant=0   blue-dominant=0
cemetery       green-dominant=0   blue-dominant=14066
basin          green-dominant=0   blue-dominant=0
```

The stadium's field is `#5b6a44`. It is drawn, it is in the palette, the builder
has emitted it every bake since the icon was written. **Zero pixels of it reach the
sprite.** Same for the basin's low-flow channel, `#4c8450`.

Not dark. Not washed out. *Not there.*

## WHY — AND I GOT THIS WRONG ONCE BEFORE I LOOKED

My first answer was occlusion by a vertical wall, and I shipped a fix for it: rake
the stadium bowl, lower the basin berm. Then I rendered it and looked, which I
should have done first, and the picture said something else.

**There were three different causes, one per icon, and only one of them was the
one I guessed.**

**basin — there was never a hole.** The embankment was four NESTED SOLID BOXES
stepping down. A nested solid box has a top face, so the outermost tier roofed over
everything inside it. The "rectangular hole with a notch cut in one wall" in that
builder's own docstring has never once been rendered. It was a flat-topped mound,
and lowering the berm just made it a shorter mound. **A hole is four bars, not a
smaller block.** Each tier is now a picture frame — south, north, west, east — so
the middle is open to the floor.

**stadium — a z-buffer coin toss.** `_draw_ground()` lays the pad as a box from
z=-0.5 up 0.55, so the pad's top face is at **z = +0.05**. The field was drawn at
z=0.02 to 0.08, *straddling it*. Two near-coplanar surfaces three centimetres apart
is a coin toss, and the pad won across most of the disc. The field now sits at 0.10.
That is the whole fix; nothing about it is visible except the field, which is the
point.

**policestation — it was painted on a face the camera cannot see.** This projection
puts the eye off +x/+y, so a box shows its top, its +x face and its +y face and
nothing else. The previous session moved the department colour off the (removed)
patrol fleet and onto a signage band bolted to the building — and put the band on
the **-y** face. Drawn correctly, shaded correctly, hidden behind the building it
was bolted to, every bake since. The source note claiming that fix has been sitting
directly above the invisible geometry the whole time.

The rake and the lowered berm stayed, because both are truer than what they
replaced (below), but neither was the bug and I should not have written them as
though they were.

## AND THE GEOMETRY WAS WRONG ABOUT THE REAL THING TOO

Kept, because both are truer than what they replaced even though neither was the
occlusion I thought it was:

**A seating bowl RAKES.** It is not a cylinder. Rows climb outward as they rise,
roughly 30 degrees at an upper deck, so the opening *widens* with height and you
look across the far stand at the field. That rake is exactly why you can see the
field of a real stadium from an oblique aerial. Rebuilt as six stacked rings whose
inner radius grows with z, plus a press ring at the rim.

**A detention basin is EXCAVATED, not walled.** Clark County Regional Flood Control
builds them with 3:1 and 4:1 side slopes and a berm barely a metre over natural
grade, because steeper will not hold in this soil and cannot be mowed or driven on.
A 3.4 m vertical crest was never the section. Crest drops to 1.25 m, the steps run
wide and shallow, and the emergency spillway is now cut DOWN THROUGH the crest
rather than floating above it, which is what an emergency spillway is: a low place
in the berm. The staff gauge came down from 7.2 m to 4.0 m to match, since a gauge
measures water the basin can actually hold.

The more truthful shape and the visible shape are the same shape. That keeps
happening and it is worth trusting.

## WHAT THE COLOUR FIXES ACTUALLY WERE

Every colour used here is an entry that was **already in that district's own engine
module palette and simply never drawn**. Nothing was invented.

**policestation** had a second problem underneath the invisible-face one: the band
is painted in `PATROL`, and `PATROL` is palette entry 7, `#cfcfc6`, *near white*. A
grey stripe on a grey building is not a hue family even when you can see it. The
site now carries the lit gold shield over the +x entry (entry 13) and a xeriscape
strip along the +y frontage (entry 3) — both permanent fixtures, so neither leaves
with the fleet. Frontage only: nothing rings the plot (Paolo 8/16).

**cemetery** gets its reflecting pool (entry 9), which every memorial park in this
valley has at the mausoleum entry and which this builder had simply never drawn.
Headstones skip the pool footprint, because nobody is buried in it.

**basin** gets its salt cedar, rooted along the wet strip and nowhere else, which is
exactly how it grows.

**radio** was the squint failure, and its own docstring was the argument against
fixing it: "MOSTLY AIR ... that emptiness is the recognition, not a flaw in the
drawing." It is a flaw. A guyed broadcast mast is a triangular lattice about a metre
and a half across the face, cross-braced every metre or so and hung with 2-3 m
microwave drums at three or four levels, because every site on the ridge backhauls
to the next one down. It was drawn as a 0.38 m post. One percent of its own
silhouette is what a pole looks like when it should have been a truss.

## THE MEASUREMENT

Old vs new, on the same measurement the two gates make. Floors are `families >= 2`
and `top-half ink 10-92%`:

```
                families            chromatic     top-half ink
stadium         1  ->  3              59% -> 58%      -> 38%
basin           1  ->  4              90% -> 90%      -> 52%
policestation   1  ->  4             1.1% -> 5.8%     -> 35%
cemetery        1  ->  2             3.6% -> 3.8%     -> 46%
radio           2  ->  2 (hue ok)    6.9% -> 14%     1% -> 16%
```

## AND THE THING THAT MADE ALL OF THIS POSSIBLE

**The full hero bake takes 85 minutes.** I spent the first one on a fix built from
reading code instead of looking at pixels, and it was wrong on two icons out of
three. What changed the session was a small harness that bakes ONE hero at reduced
scale, in main()'s exact dressing order, and reports the same two numbers the gates
do:

```
$ python3 tools/bohemia_hero_one.py stadium basin policestation radio cemetery
  stadium         954 faces  families=3 [0, 1, 2]     chromatic= 57.6%  top-half ink= 38%
  basin           307 faces  families=4 [1, 2, 3, 4]  chromatic= 89.9%  top-half ink= 52%
  policestation   297 faces  families=4 [1, 2, 3, 7]  chromatic=  5.8%  top-half ink= 35%
  radio          1418 faces  families=2 [1, 7]        chromatic= 14.2%  top-half ink= 16%
  cemetery        778 faces  families=2 [1, 6]        chromatic=  3.8%  top-half ink= 46%
```

Eighty-five minutes to a couple of seconds — and it is *faithful*, which is the only
reason any number off it is worth anything: run the pre-8/19 radio through it and it
reports **1%**, the same figure `squint_gate.py` reported off the real 1724 px bank.
Four guesses became four experiments.

It shipped as `tools/bohemia_hero_one.py`, because a harness that only exists in one
session's scratch directory is a harness the next person rebuilds from nothing. It
is an EARLY WARNING and it says so in its own output — it cannot pass anything, the
real bank and the two gates remain the only authority.

## THE LESSON, FOR THE NEXT SESSION

**A colour gate can fail for a geometry reason, and it will not tell you.** When an
icon measures monochrome, count the pixels of the colour you *think* you drew before
you touch the palette. Absent and desaturated are different diseases with opposite
treatments, and repainting a surface nobody can see is a fix you can ship over and
over while the gate stays red — which is exactly what the note in
`build_policestation` records somebody doing, in a comment sitting directly above
the invisible geometry.

And the harder one, which I did to myself here: **three icons failed the same gate
for three unrelated reasons.** A shared symptom is not evidence of a shared cause.
I found one plausible mechanism, believed it explained all of them, and wrote it up
as fact in this file before rendering anything. The render disagreed.

The general form, and this repo keeps paying for it: **a symptom that survives
content changes is a pipeline bug** (VERIFY ON THE REAL SURFACE, 7/18). It was true
of the hoodie, it was true of the prism cap that made every drum look like a tarp,
and it was true here — but only for one of the three.
