# THE RAGDOLL'S HITS: A SHOT, A CLUB, A FALL FROM A ROOF, ON THE SAME BONES (ANIMATION, 10/17/26, row [ragdoll hits])

Rule 110 (the big swing, no check-in; the MODE line: 'the ragdoll's hit variety (a shot, a club, a fall from a roof) in
eight'), his twelfth vote ('why is it so hard to get ragdoll physics, bro?'), rule 100 (cook only: VOTE, never the fight),
ROUND THIRTEEN (a placeholder until the moodboard), AN ENVELOPE RAMPS SLOWER THAN THE GRID (twelve drawn keys, the
simulation sampled on them). The 10/13 ragdoll (records/BOHEMIA_RAGDOLL_10_13_26.md) had ONE blow: a seeded push on the
upper body. Every man died the same kind of death. Now the simulation takes a KIND.

## WHAT EXISTS NOW (TAB: VOTE, the card PLACEHOLDER: THE RAGDOLL'S HITS, playing)
- slices/BOHEMIA_ALPHA_0_9.html, __RAGDOLL__: RAGDOLL.kind ('blow' by default; the fight never sets it) and ONE knob table,
  RAGDOLL.hit, for the three new kinds; ragdollSim(R, h, seed, kind):
  * BLOW: the 10/13 push, byte for byte (the gate checks ragdollSim with no kind equals 'blow' on every set).
  * SHOT: a snap. The head is pushed 2.6 times the blow's share and the chest 1.8, the hips a fifth: the head leads the
    body by 8 px or more in the first tenth of a second (the blow's head barely leads) and he goes over nearer where
    he stood.
  * CLUB: a swing from the side. The push is broad (a floor of 0.2 under the linear ramp, so the hips are carried, not
    just tipped), the arms fly with the swing: the hips are 9 to 11 px further along at a quarter second than the blow's.
  * ROOF: no blow. The body starts 130 px up (2.3 m at his scale, a roof's edge), already turned 30 degrees about his
    feet toward the fall side with a drift off the edge, and falls; it lands in 0.65 s and lies.
  * The two settling knobs the kinds needed (settle, the damping once lying; sleep, the speed under which a lying body
    stops): a harder landing leaves the floor and the rigid torso nudging each other at 20 to 35 px/s (a quarter pixel
    a picture), which the blow's 12 px/s sleep line never caught; a kind sleeps under its own line, and may sleep propped
    (an arm under him, the hips up) once the torso is past 70 degrees and nothing moves.
- ragdollPose carries _lift: how far the body's lowest part is above the floor at that key (fallPlace sets every picture
  on the ground, so the roof fall needed its height back); the VOTE page lifts the picture by it and draws the roof's
  edge where he stood at the first key.
- tools/bohemia_animation_ragdoll_hits_bake.js films the alpha's OWN frames (buildFrame) through the one driver: the
  player and the Reds, eight facings, four kinds, the twelve drawn keys and the last; tools/bohemia_animation_ragdoll_hits_bake.py
  packs them into slices/vote/ANIMATION_RAGDOLL_HITS.webp (lossless) + _TABLE.js with every key's lift.
- slices/vote/ANIMATION_RAGDOLL_HITS.html: eight facings x (blow, shot, club, roof), four beats of fall and two lying,
  on the 120 beat, one art pixel to one phone pixel, YOU and THE REDS. No vote inside (rule 25).
- VOTE: animation-ragdoll-hits-10-17, PLACEHOLDER, a redo-of card on the 10/13 ragdoll.

## WHAT THE SWEEP FOUND (every number from the live alpha, the knobs swept in-page before one was set)
1. THE SHOT WAS GOING TO BE A CRUMPLE AND THE PHYSICS SAID NO. A shot man's knees give; I let the knee fold to half
   its length and pushed the hips down. Measured: a push on the hips alone cannot fold a vertical leg (the hips dropped
   7 px in a quarter second, the blow's 7); with the knees buckled sideways he did drop into a heap, and then a kneeling
   man is STABLE: on 6 to 12 of 16 sets he stayed propped at 33 to 45 degrees, rocking at 90 to 130 px/s, never flat.
   A heavy damping once the hips were down froze him kneeling on 16 of 16 and froze the roof fall propped at 44.
   So the shot is a SNAP, which the plank physics does well, and the crumple waits for the 3-D ragdoll ([eight through
   the rig]). Said, not hidden.
2. THE KINDS DID NOT READ ON 'TRAVEL'. The first shot and club measured within 2 to 10 px of the blow's travel on every
   facing: once a man topples he moves half his height whatever hit him. The tells that hold are the HEAD leading the
   hips (the shot) and the HIPS carried (the club), both in the first quarter second, where the hit is.
3. THE ROOF LANDED ON ITS FEET. Dropped upright with a drift, he landed standing and sat down on 5 of 8 facings (rest at
   32 to 64 degrees). Turned 30 degrees about his feet as he leaves the edge, he lands on his side on 8 of 8.
4. SLEEP. The 10/13 sleep rule (lying, and nothing over 12 px/s for a quarter second) never fired on the harder landings:
   the kinds rocked at 20 to 35 px/s at the 2 s mark on 4 to 9 of 16 sets. A kind sleeps under its own line (60 px/s for
   the shot and the club, 40 for the roof: half a pixel a step at most, invisible on the drawn keys) and may sleep propped
   once the torso is over; the blow keeps the 10/13 rule to the letter.

## PROOF
    RAGDOLL HITS (new, gates/the_ragdoll_hits_gate.js, in the suite as RAGDOLL HITS), 16 (outfit, facing) sets x 4
    kinds: the blow identical to ragdollSim without a kind on every set; no stretch (0.21 px), nothing through the
    floor, no pop (3.3 px a step), every kind falls (torso past 60, weight down 25+), rests (the blow under 6 px/s; a
    kind under 40, worst 27.6), lies flat (the blow 1.5 wide and 0.55 of standing height; a kind 1.3 and 0.62: the Reds'
    coat over bent legs after a snap, 82 x 62 on one of 48), head down, nothing cut; the snap (the head leads the hips
    3+ px further than the blow's at 0.1 s; measured 8 to 10), the throw (the hips carried 8+ px further at 0.25 s;
    measured 9 to 11), the roof's start (128 px up) and landing, the four apart at 0.25 s, the table's lifts the
    physics'. A kind that is ignored is refused first. THE TWO RULERS A KIND GETS LOOSER, SAID: rest 40 px/s not 6 (a
    third of a pixel a step; the sleep rule cannot catch a body propped under 70 degrees), flat 1.3 and 0.62 not 1.5
    and 0.55 (one set, the coat). Both measured, both written in the gate's text.
    RAGDOLL FALLS (the 10/13 gate) still 15/0: the blow is the blow.
    Filmed in chromium: the page's canvases all change frame on the beat, zero page errors.

## WHAT IS NOT DONE, SAID SO
NOT IN THE FIGHT (rule 100). The crumple (knees giving) is not here: the picture-plane physics cannot settle a kneeling
man; it is the 3-D ragdoll's. The club's arms are a push, not a weapon: nothing swings in the picture (the hitter is
another man's clip). The roof fall shows on the VOTE page by lifting the picture; in the fight it is COMBAT's board that
knows where the roof is (THE THIRD VOTES: high ground is a roof).

## [bb hits] THE SCHOOL LINE (rule 39b)
Battle Brothers kills with one corpse sprite whatever the weapon. WHAT WE DO DIFFERENTLY: the weapon is in the fall: a
shot snaps the head first, a club throws the body, and a roof is a roof.

## ANALOG HORROR LINE (rule 30)
Four ways to go down and none of them is a pose: the tape just shows what the body did.
