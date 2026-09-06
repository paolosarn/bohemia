# COLOUR BLIND ON THE FACTIONS — what the cloth actually measures
UI lane 11, 9/6/26, from VAMILY row [phone readable] ACCESSIBLE-ON-A-PHONE.
Measurer: `gates/cvd_faction_measure.js`. Enforced as a ratchet by
`gates/phone_readable_gate.js`.

## THE INSTRUMENT
The same cloth `faction_colour_gate.js` reads — REAL RENDERED PIXELS from
`buildFrame`, with skin and the black outline removed so a suntan cannot pass for a
flag. Each faction's mean cloth colour is then pushed through the three common
colour vision deficiencies (LMS projection, standard Brettel/Viénot matrices) and
every pair is compared in CIE Lab, so "how far apart" means how far apart they
LOOK, not RGB arithmetic. 13 factions, 78 pairs.

A dE around 2 is the threshold where most people stop seeing any difference at all.

## WHAT IT FOUND

| vision        | pairs under dE 10 | closest pair                        |
|---------------|-------------------|-------------------------------------|
| normal        | 3                 | Caravans vs Homeless — dE 6.8       |
| protanopia    | 13                | **Anarchists vs Reds — dE 1.8**     |
| deuteranopia  | 11                | Anarchists vs Remnants — dE 4.4     |
| tritanopia    | 9                 | **Trades vs Network — dE 0.9**      |

Roughly **1 in 12 men** has some colour vision deficiency; deuteranomaly alone is
about 5% of men. For those players, Anarchists and Reds wear the same colour, and
Trades and Network wear the same colour.

## WHY THIS IS NOT A BUG BEING FIXED HERE
Two reasons, and both are the repo's own.

1. **The law already answers it.** STRUCTURE-NOT-COLOR, restated in
   `faction_colour_gate.js`: "Colour is the SECOND channel. If these two ever
   disagree, the silhouette wins." The game is not supposed to be readable by hue
   alone for anybody. What these numbers show is how much weight the silhouette is
   actually carrying — for some players it is carrying all of it.
2. **Which faction owns which hue is Paolo's.** MECHANISM-MINE /
   CONTENTS-PAOLO'S. Repainting Reds or Network to open up a protan gap is a
   contents decision, not a lane's to take.

So the gate holds a RATCHET, the same shape `faction_colour_gate.js` uses for hue
ownership: the numbers print on every run so this can never be called unmeasured,
and the count of colliding pairs may not GROW. It cannot get worse by accident.

## [PENDING Paolo] — THE RULING THIS NEEDS
Two factions that a colour-blind player cannot tell apart is only a problem if
telling them apart by colour ever matters mechanically — a crossing cost, a
territory read, a "whose block is this". If it does, the fix is his pick of one:

- **A.** Leave it. The silhouette is the identity channel and always was; colour is
  atmosphere. (Realistic: this is what the law already says.)
- **B.** Repaint the worst pairs. Anarchists/Reds and Trades/Network move far
  enough apart to survive protan and tritan. Costs two or three faction colours he
  has already approved.
- **C.** Add a second non-colour channel where colour currently carries the load —
  a pattern, a mark, a silhouette tell on the outfit — so the answer never depends
  on hue for anybody.

Routed to: FACTIONS (owns the colours), DIRECTION (owns the look), UI (owns the
measurement and the gate).
