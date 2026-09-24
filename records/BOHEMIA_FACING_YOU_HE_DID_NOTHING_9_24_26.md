# A CLIP THAT BENDS FORWARD DIES FACING THE CAMERA
ANIMATION lane, 9/24/26, row [judge two] (PICKUP-AND-LAUGH). Session animation-lr9y9i.

## HOW IT WAS FOUND
The row says the two clips Paolo never judged ride to him. Before registering them
I rendered both, all four facings, twelve keys a bar, **and looked at the picture**
— which is the exact thing the hand-at-face graveyard, written the same round, says
this lane failed to do three times running.

Facing the camera, neither clip did anything.

## THE CAUSE IS ONE LINE OF THE RIG
```js
const spF = d => _lat(d) ? Math.sign(Math.cos(FACEANG[d])) : 0;
```
**`spF` is ZERO on N and S.** Every term written `spF(d)*x` therefore vanishes on
the two facings the player looks at most, and a clip whose whole idea is a forward
bend is left with whatever else it happened to say.

`pickup` said `spine: spF(d)*0.52*dn` and `hipOff:[0,4*dn]`. Facing you the spine
term is gone, so a man picking something up dipped four pixels.
`laugh` said `head:-spF(d)*(0.14+0.06*b)` and `spine:-spF(d)*0.08*b`. Facing you
**both** are gone and all that survives is a 0.9 px bob.

## MEASURED ON THE DRAWN PICTURE
Worst key of the bar against the clip's own rest frame: pixels changed as a share
of the body, and how far the drawn body's centre of mass travels.

| | side (E) | facing you (S) |
|---|---|---|
| pickup | 126% / **10.37 px** | 36% / **0.87 px** |
| laugh | 28% / **1.28 px** | 10% / **1.00 px** |

The ruler is the drawn frame, never a joint. This lane has been lied to twice by a
joint ruler and the picture caught it both times.

## THE FIX PATTERN WAS ALREADY IN THE FILE
`nod`, `drunk` and the gaits all branch on `headOn(d)` and say the motion a
different way. So this is that pattern applied, not invented.

Facing you a bend has nothing to project onto, so it is spent where it DOES read:
- **pickup**: the body drops 17, the legs fold, the arms go down and forward, the
  head goes with them.
- **laugh**: a bounce on the beat plus an alternating shoulder shake, the head
  riding the body instead of tipping back.

The three-a-bar shoulder shake is kept because twelve keys hold three cleanly —
the law from the same round's envelope work.

## AFTER
| | facing you, before | facing you, after | side |
|---|---|---|---|
| pickup | 0.87 px / 36.4% | **5.52 px / 68.7%** | untouched, 10.37 px |
| laugh | 1.00 px / 10.3% | **4.22 px / 40.7%** | untouched, 1.28 px |

Both N and S, not just the one I measured.

## GATE
`gates/a_clip_reads_facing_you_gate.js` — 9 claims, 3 mutations caught.

**The second mutation changed the gate.** A single pixel floor of 35% sat BELOW
what the broken pickup already scored (36.4%), so removing the fix left that claim
green. **A FLOOR UNDER THE BUG IS NOT A FLOOR.** The floors are per clip now.

The third mutation is this lane's own turn bug written again — the branch wired to
ONE of the two head-on facings — and the claim that asks about BOTH is what catches
it.

Control: `nod`, which already had the pattern, must still read facing you, so a
build where `headOn` branches do nothing cannot pass. And a separate claim holds
the side views, because a fix that traded one facing for another would pass
everything else.

## WHAT IS NOT FIXED, WITH ITS NUMBERS
**15 of 105 clips** still move well from the side and barely at all facing you.
The gate prints every one with both numbers. Named, not chased: two clips were on
the board, and quietly rewriting forty is forty untested changes.

    walk 4.01/0.73px 28.7% | run 4.23/1.07px 34.6% | stumble 10.41/1.22px 37.8%
    dig 8.78/0.77px 33.7% | bow 9.88/0.9px 20% | shove 6.92/1.35px 34.5%
    inspect-ground 6.97/1.49px 32.9% | retch 4.43/0.8px 19.7% | ...

A gait is the one honest exception in that list: a man walking on the spot moves
his legs and not his middle, which is why the pixel share has to agree before a
clip is named at all.

## IN VOTE
`animation-facing-you-he-did-nothing-9-24`, and it PLAYS (rule 25): both clips
facing him, what they were beside what they are, twelve frames a bar on the real
120 BPM clock.

## TAB
ANIMATION (the clips), and the VOTE tab in the alpha for the item.
