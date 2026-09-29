# [three d look] -- ONE LIGHT, THE WORLD'S OWN, ON A FACE
# PORTRAIT (chat 20), 9/29/26. Paolo 9/14: "try to make it look 3-D too while
# we're at it." One attempt: a portrait built with real light and form (a lit,
# shaded, slightly turned head, one light source shared with the world's sun)
# delivered as 2-D pixels, for three people he knows, beside the flat versions,
# into the VOTE tab. Compared to the world before it goes (the compare law).

## THE THREE PEOPLE
Not three random crowd ids. Reyna (the player, `act1`), Ezekiel (`act2`) and
Perla (`act3`) -- the same three faces [three faces] already built this
session and he has already met on the phone strip. `buildSpec()` for Reyna,
`descendantSpec(2, anc)` for Ezekiel, `descendantSpec(3, anc)` for Perla:
REUSE-FIRST, not a new cast.

## THE BUG THIS ROUND ACTUALLY FIXES
[blank faces] school (9/28) already measured this and left it open: the
world's own light rule (`gates/art_45_gate.py`, per row, the right third of a
lit mass' own local span should out-lum the left third by 8% or more of the
mass's mean) applied to 20 shipped faces read 0 of 20 passing, 18 of 20
leaning the WRONG way. That round traced it to source and stopped, school
only. This round is the fix.

`renderFace`'s one soft-shadow polygon sat on screen-RIGHT
(`poly([[cx+7,Y0+4],...],ShSoft)`), the side the world's own rule says should
be BRIGHTER, not darker. The nose's own shadow column sat at `cx+1`, one
pixel right of centre -- also backwards, since a shadow falls AWAY from the
light and the light was supposed to be on the right.

## THE FIX, GATED SO NOTHING SHIPPED MOVES
A new `opts.threeD` flag, checked once (`const _3d = !!(opts&&opts.threeD)`),
false everywhere the play surface calls `renderFace` (rule 18: the making
goes to VOTE first). When true:
- the old shadow polygon MIRRORS to the left, the shadow side;
- a second, darker inner polygon (`Ln`, the ramp's own darkest step) nests
  inside it near the jaw, so the shadow actually falls off instead of
  sitting as one flat patch -- real FORM, not just a repositioned flat one;
- a highlight polygon (`L`, the ramp's own lightest step) sits on the right
  cheekbone, so the lit side reads brighter, not merely less-shadowed;
- the nose's shadow column flips to `cx-1`, consistent with light from the
  right.
When false, every line is byte-identical to what has shipped since [horror
face]. `opts.threeD` is never set outside this cook tool and the VOTE page
that will read this spec, so his own approved face has not moved (checked:
talking_portrait_gate's pinned-hash leg is untouched, 34/0, no repoint
needed this round -- unlike [head and gear] last round, this fix never
touches the default path at all).

## "SLIGHTLY TURNED HEAD" -- THE HONEST HALF-ANSWER
No new anatomy this round. The turn is read through directional light alone,
the same trick real pixel portraits use to imply a 3/4 view without
redrawing the skull. A literal geometric turn (asymmetric cheek/jaw widths,
a shifted centre-line) is a bigger, riskier change than one attempt should
carry, and is named here as the honest next step rather than faked with a
shading-only illusion oversold as more than it is.

## MEASURED, NOT EYEBALLED
Same ruler as [blank faces], replicated exactly (per-row, local opaque span,
right third vs left third, background excluded by colour-matching the known
gradient since our buffer carries no alpha channel to lean on):

    crowd (20 faces, gate:crowd:0..190)   flat 0 of 20 pass   3D 14 of 20 pass
    Reyna (you)                            flat -1.8% of base  3D +6.6% of base
    Ezekiel                                flat -2.3% of base  3D +6.7% of base
    Perla                                  flat -5.8% of base  3D +0.0% of base

Direction is fixed on every one of the 20 crowd faces and on all three named
people (every flat number is negative or near-zero and out-of-rule; every 3D
number moved positive). Strength clears the 8%-of-base bar on 14 of 20 in the
crowd, and gets close but not quite there on Reyna and Ezekiel specifically
(6.6% and 6.7%, against an 8% bar).

## THE ONE REAL ANOMALY, EXPLAINED RATHER THAN HIDDEN
Perla's own number is nearly flat (0.04%) even in 3D mode. Checked why rather
than assumed: her `descendantSpec` roll gave her `hat: 'hat/durag'`. The
durag polygon (`spec.hat==='hat/durag'` block, drawn after hair) spans
`Y0+3` to `f.browY-2` -- the forehead and temple, which is exactly where the
upper portion of both the highlight and the shadow polygons live. A real
chunk of both gets painted over by the opaque cap before the eye ever sees
them. This is not a bug in the light; it is a real, physically honest thing
a hat does to a face. Reyna and Ezekiel, both bare-headed this roll, show
the effect clearly; Perla is the true, undodged exception, shown on the card
with the reason written under it rather than swapped for a cleaner example.

## COOKED (rule 22)
`portrait-three-d-eat-two-d-9-29`, registered in the VOTE tab: flat vs 3D
for all three named people, the numbers under each, and the crowd claim.
This is a CANDIDATE, not a locked ruling (unlike [head and gear] last round,
this is the first time this exact idea has been shown to him) -- his thumb
decides whether `opts.threeD` becomes the default path or goes to the
graveyard with a post-mortem.

## GATES
talking_portrait 34/0 (unmoved -- his approved face pin never had reason to
change, since the fix only fires behind a flag nothing live sets), portrait_
haircut 15/0, family 17/0 (PEOPLE's [family eyes] landed two new checks this
round, both clean), face_maker 16/0, hair 39/0, hairline 12/0, hair_
graveyard 13/0, craft_law 39/0, alpha_loads 20/0, character_in_the_vote_tab
9/0, handoff 9/0, vote_tab 30/1 (pre-existing, two coordinator items,
checked and not mine).

## WHAT IS STILL OPEN
A literal geometric turn (not just directional light) is the honest next
step if he votes this up. The bar is not cleared on 6 of 20 crowd faces even
with the fix; whether that needs a stronger highlight/shadow contrast or is
an acceptable spread is his to judge on the card, not assumed here.
