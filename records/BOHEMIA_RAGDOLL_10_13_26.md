# RAGDOLL (ANIMATION, [ragdoll], 10/13/26)

## WHY THIS, NOW
PAOLO 10/10, his twelfth vote, NO on the posed fall (animation-the-fall-10-11): 'Why did so hard to get ragdoll
physics, bro?'. The posed clip was V2, the last (rule 95.2): graveyarded by the coordinator, and he named the thing he
wants. The row: a man struck down falls under gravity on the rig's own bones (a few rigid segments, joint limits, the
floor, a seed so the same hit falls the same way), comes to rest flat, head on the ground, never on end or upside
down, the eight facings out of the same bones; before (the posed clip) beside after at 1:1; cook only (rule 100).

## THE GHOST: WHY THE 7/17 RAGDOLL DIED, AND WHAT THIS ONE DOES INSTEAD
His 7/17 verdict on the old Verlet ragdoll: 'tweaking, jumping around, not falling fast enough, unnatural'; measured
then as 'a dozen constraint laws fighting each other every frame = 17-20 px single-frame joint POPS'. So this one keeps
the physics PLAIN and CONSISTENT: this facing's own rest skeleton as particles; every bone a RIGID link; the torso and
the head one rigid block (cross links); ONE limit at each knee, elbow and hip, a minimum distance, nothing else
arguing; a floor with friction and each part's own thickness; gravity at the body's scale (a 1.75 m man is ~100 px,
so ~560 px/s/s); a fixed 1/240 s step with 16 passes; a seeded blow on the upper body, away from the way he faces; and
SLEEP, as physics engines do, once he lies and nothing moves faster than 12 px/s for a quarter second. Simulated once
per body and facing (slices/BOHEMIA_ALPHA_0_9.html, __RAGDOLL__), sampled on the twelve-key grid: 4 beats, 12 drawn
pictures. Drawn as the posed fall was (upright, then turned by the torso's angle), so a long coat stays a coat; the
turn is a rigid transform, so the picture IS the simulation's pose.

## WHAT MEASURING FOUND (all in the physics, none in a ruler unless it says ruler)
1. Feet at no thickness and the back at six: every corpse rested propped at a tilt and rocked. Each part got its own
   thickness, and the floor moved under the soles so standing is not already inside it (a 4 px kick threw him over).
2. A 'lying' damping that counted any six parts on the floor caught him SITTING and froze him propped at 50 degrees;
   a 'back on the floor' test never fired lying on his side (the shoulders stack, the neck sits 19 px up). It now
   starts once the torso is past 70 degrees with the hips down.
3. A stiffer knee (0.93 instead of 0.85) made him sit down and stay sitting on one facing: put back.
4. The blow's range: too narrow and 23 of 40 other seeds rested the same; too wide and he somersaulted.
5. Lying on his side in this picture-plane fall his wide shoulders stack and propped the head end up 25 degrees: the
   shoulders now rest lower (the picture is set on the ground by its lowest pixel, so nothing shows through).
6. RULER: 'keeps 75% of the standing body's pixels' assumed the arms always show; lying with his back to you they are
   under him (0.71 to 0.74, looked at). 65% now: the claim is for a CUT picture.
KNOWN, SAID: on a bent shin the boots show 2-3 px upright spikes; they come from how boots are drawn for a standing
shin (CHARACTER's wardrobe), and a stiffer knee does not remove them (it sat him down instead).

## PROOF
    THE RAGDOLL FALLS (new, gates/the_ragdoll_falls_gate.js, in the suite): 15/0, the player and four long-garment
    outfits, all eight facings, the simulation every 1/120 s and the rig's own frames: no bone stretches (worst 0.15
    px), nothing through the floor, every joint limit holds, NO POP (worst 2.5 px a step; the old one popped 17-20),
    he falls (torso past 60 degrees, weight down 25+ px), he comes to rest, the same seed falls identically and another
    seed falls another way, the dead lie flat with the head at one end on the ground (CONTROL: the old sleep@0 dead fail
    30 of 40), nothing cut, nothing missing, eight different dead.
    MUTATIONS, 5 caught: soft bones (3 fail), no floor (7), no joint limits (6), one fall for every seed (1), a body
    that never rests (1).
    VOTE animation-ragdoll-10-13 (FINAL?, redo of animation-the-fall-10-11): eight facings, the posed fall he voted down
    beside the ragdoll, live, one art pixel to one phone pixel, the player and the Reds; filmed at his phone's profile,
    zero page errors; the strip lossless (152 KB).

## WHAT IS NOT DONE, SAID SO
NOT IN THE FIGHT (rule 100). When he says final: the fight's sheets take the ragdoll's twelve pictures as the fall and
its last as the dead (a seed per fighter gives every man his own fall), and COMBAT reads the table.
THE HIT IS NOT IN THIS CLIP: the blow is a push at the first instant; take-hit stays the hit picture.
PICTURE-PLANE PHYSICS: the body falls in the plane of the picture, so a man facing you or away goes over sideways, as
the posed fall did. A full 3-D ragdoll is the [eight through the rig] road, DIRECTION's master rig.

## [bb ragdoll] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
Battle Brothers swaps a killed man for a corpse sprite lying on the ground; there is no fall to watch (this lane's
9/28 line), and the library has nothing on ragdolls, so nothing is claimed. WHAT WE DO DIFFERENTLY: he goes down by
the weight of his own body, every man a little differently, and lies where his body took him.

## ANALOG HORROR LINE (rule 30)
A pose is a man acting dead; a ragdoll is the moment the man stops holding himself up, and you can see exactly when.
