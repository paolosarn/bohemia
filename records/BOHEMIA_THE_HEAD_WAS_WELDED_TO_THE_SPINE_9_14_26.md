# THE HEAD WAS WELDED TO THE SPINE
ANIMATION lane, 9/14/26. VAMILY row `[redo killed]`, round six.
Beat one of his headshot spec, and the pin that defeated three attempts at it.

## WHAT HE ASKED FOR
laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md section 9, verbatim:

> "4 beats: head snaps back on impact (0 to 0.08), torso/body gives FIRST and knees
> fold (0.10 to 0.45), arms hold UP on inertia while the body drops (0.15 to 0.35),
> torso falls BACK with a hard resistance clamp so it NEVER folds into the waist
> (spine clamped at -0.55), arms come in slightly LAST (0.72 to 1)."

## THE PIN, AND IT IS EXACT
Three attempts last round all measured 5.1px of head travel against the waist's
4.1 -- identical to each other and to the build with no impulse at all. The record
said FIND THE PIN before writing a fourth kick. Here it is, measured:

**The head has EXACTLY ZERO freedom in the sim.** Head angle minus spine angle,
over thirty steps of the fall, with a 5px impulse on the head and without one:

    head angle MINUS spine angle, no kick : 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    head angle MINUS spine angle, 5px kick: 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    spread over 30 steps, no kick : 0.0000
    spread over 30 steps, 5px kick: 0.0000

The GLUE LAW block in `hsStep` (the STATIC SHOULDERS pin) rewrites `headTop` off
the spine frame **every single step**:

    for(const s of ['shL','shR','headTop']){const o=HS.shOff[s];
      const gx=HS.p.neck[0]+o[0]*ct-o[1]*st, gy=HS.p.neck[1]+o[0]*st+o[1]*ct;
      ... HS.p[s]=g; HS.prev[s]+=delta; }

Position dictated, velocity carried along. Any impulse on the head is overwritten
in the same step it is applied. That is why 2.6 and 5.0 were the same number on
screen, and it is why the third attempt changed nothing: **it exempted the one
joint in the rig that has no freedom to use.**

Kicking the neck instead moves the head 15.5 degrees in 13 steps; kicking the
waist moves it 17.8 the other way; kicking the head moves it 0.15. The lever was
never the head.

## THE OBVIOUS FIX BUYS BEAT ONE AND KILLS BEAT FOUR
The neck is ALREADY kicked, at 3.4 px/frame, and the horizontal speed cap clips it
to **1.6** on the first integration step while the waist's 1.2 passes untouched.
3.4 against 1.2 is a ratio of 2.8; after the cap it is 1.33; the head measures 5.1
against 4.1, which is 1.24. **The cap is the whole reason the head leads instead of
snapping.** Lifting it inside his window, swept:

    neck ceiling inside his window    0/1.6    2.2     2.8     3.4+
    beat 1, head vs waist              1.24    1.73    2.22    2.73
    beat 4, arms close (his floor 12)  +16     -0.6    -2.9    -13.3

It saturates at 3.4 because 3.4 is the kick, which proves the cap was the only
clip. And it is the same bad trade the leg window offered last round: his fourth
beat dies to buy his first. **The cap is not touched.**

## WHAT IS BUILT: THE NECK JOINT, WHICH THE SIM DOES NOT HAVE
The glue law's own sentence is "the stiffest neck: ONE WHIP with the shot, then it
rides the body". That is exactly what shipped. Inside his window only, in `hsPose`
on the rendered skeleton, the head rotates about the neck by a pulse that peaks 30%
into the window and returns to glued by its end. After it, the head is rigid
forever, as before.

**The sim is never touched**, so his other three beats cannot move. Measured before
and after on all eight facings, not assumed:

    dir |  beat2 before/after | beat3 before/after | beat4 before/after
      N |       101.5 / 101.5 |        24/3   24/3 |            2 / 2
     NE |       120.7 / 120.7 |      19/-19 19/-19 |        -0.3 / -0.3
      E |       142.1 / 142.1 |        15/9   15/9 |        -0.2 / -0.2
     SE |         79.8 / 79.8 |        13/5   13/5 |          0.5 / 0.5
      S |         38.1 / 38.1 |      12/10  12/10 |          16 / 16
     SW |         37.2 / 37.2 |        12/5   12/5 |        -0.9 / -0.9
      W |       158.7 / 158.7 |        26/8   26/8 |          0.6 / 0.6
     NW |       100.5 / 100.5 |      21/-17 21/-17 |        -0.3 / -0.3

Identical on every facing, every beat.

**The head can never come off**, and the RIGID LIMB LAW is why: it runs immediately
after and forces the neck bone back to its exact rest length. Head-to-body gap
measured on all eight facings at every amplitude out to 0.9 rad: **1px**, always.

The shape, head travel from frame zero, facing S:

    step :  no snap   with the snap
       0 :        0          0
       2 :      1.4          6
       5 :      2.2         10      <- 0 to 10px in five steps, an twelfth of a second
       8 :      3.2         10
      11 :        4        9.1
      15 :      5.1        6.1      <- back on the glued position, the body takes over

## THE AMPLITUDE WAS LOOKED AT, NOT PICKED
0.45 rad, 26 degrees. A zoomed strip of the head at 0, 0.34, 0.45, 0.6 and 0.8 rad
across the window: at 0.6 the neck starts to read long, at 0.8 the head lifts off
the collar. A human neck extends about 60 degrees, so 26 is well inside anatomy.

## TWO RULERS WERE WRONG AND BOTH WERE FIXED
1. **The first head-attachment ruler looked DOWNWARD** for neck pixels under the
   head. It called the shipped, glued build **19% attached with a 9-row gap**,
   which is impossible. Once a body is lying down the neck is BESIDE the head, not
   under it. Replaced with a direction-free minimum distance between the head blob
   and the body blob, which reads 1px everywhere, as it should.
2. **The FOUR BEATS gate's beat-one ruler was two ENDPOINTS**, `at(0.08)` minus
   `at(0)`. A snap that whips and returns to glued is invisible between them: it
   scored 6.1px at every amplitude from 0.1 rad to 0.6 rad. It now measures the
   PEAK inside his window. Third ruler bug of this class this session.

## THE GATE
`gates/the_head_snaps_back_gate.js`, in the suite as **HEAD SNAPS**. 13 claims.
The load-bearing one is the **WHIP**: peak head travel inside his window divided by
the travel at the window's END. A head that merely leads moves monotonically and
scores exactly **1.00** -- which is what the build before this round scored on all
eight facings, and what all three failed attempts would have scored.

    dir | whip before -> after | vs the waist before -> after
      N |          1  ->  1.38 |              1.1  ->  1.68
     NE |          1  ->  1.52 |              1.1  ->  1.68
      E |          1  ->  1.77 |             1.17  ->  2.08
     SE |          1  ->  1.65 |             1.61  ->  3.18
      S |          1  ->  1.65 |             1.24  ->  2.44
     SW |          1  ->  1.97 |             1.24  ->  2.44
      W |             1  ->  1 |             3.54  ->  3.54   <- masked, printed
     NW |          1  ->  1.38 |             1.34  ->  1.85

It carries the CONTROL that THE CRUMPLE gets no snap (Paolo 7/17: a head shot
destroys motor control instantly, the corpse is flaccid), and it carries a claim
that **the pin is still written down in `hsReset`**, because the only thing that
stops a fourth impulse being written there is the finding being where the next
person looks.

And it PRINTS the one facing it does not cleanly hold. **W's whip is masked**: the
snap happens (the head moves 20px against the waist's 5px) but W's own fall is the
most violent of the eight and outruns the whip by the window's end, so peak and end
land together. W's knee peaks at 159 degrees, the worst of the eight. That is
**beat two's** defect, and beat two is still not built.

Seven mutations, all caught:
  M1 the build before this round      -> 8 claims red, whip 0 of 8
  M2 SNAP_RAD=0                       -> 3 red
  M3 SNAP_RAD=1.2 (69 degrees)        -> the anatomy claim red
  M4 the CRUMPLE guard dropped        -> the control red
  M5 pivots at the shoulder not neck  -> 2 red
  M6 a clock of its own, not his      -> 3 red
  M7 the pin finding deleted          -> the pin claim red

## WHERE HIS FOUR BEATS STAND NOW
    beat 1 head snaps back   BUILT  (peak 10.0px against the waist's 4.1)
    beat 2 knees fold        NOT BUILT (peaks 38 degrees, straightens again)
    beat 3 arms hold up      NOT BUILT (body drops 12px, hand drops 10, they travel together)
    beat 4 arms come in last BUILT  (the hand closes 16.0px)

Two of four. Both remaining ones need a MECHANISM, not a window: for the knees to
fold the waist has to drop between planted feet, and for the arms to hold up the
hands have to resist while the torso goes.

## AND A THIRD RULER WAS WRONG: MOTION VISIBLE COULD ONLY SEE AN EIGHTH OF THE FALL
The snap turned MOTION VISIBLE red on "the top of the sprite drops (1px)", floor 2.
It was green on clean main, so it was mine, and it was triaged before anything else.

**The body never moved.** Measured step by step against the previous build: waist
and foot positions differ on **0 of 40 steps**. The tracking camera is not panning
because of the whip. The sprite's top moved because the head itself drops 2px when
it rotates 26 degrees about the neck -- 18px of bone times (1 - cos 26), which is
1.9px. Correct geometry, not a defect.

A first fix -- stopping the whip from dragging the camera's bbox -- measured
**identical on every gate and every number** with and without it, so it was deleted
rather than shipped. It was written on a hypothesis the measurement had already
disproved.

**THE REAL FIND: `hsPose` clamps its step to `dt=Math.min(dt,0.05)` and advances
the sim ONCE per call.** So N samples advance the ragdoll at most 0.05*N seconds,
however long you wait between them. The gate took **seven** samples and reached
HS.t = 0.4 of a **3.22 second** fall -- the first twelve percent -- after 1.4
seconds of waiting. Sample by sample:

    sample     0      1      2      3      4      5      6
    HS.t     0.015  0.081  0.139  0.198  0.254  0.310  0.368
    top        9      8      8      9     10     10     10

It scored its 2px floor on a **1px upward wobble** plus 1px of real drop. Any
change to the first quarter second flips it either way, which is exactly what the
snap did: the head drops its 2px immediately, so the 8 never appears and max-minus-
min falls to 1.

Sampled across the whole fall (70 samples, 55ms, so the clamp lets the sim run),
the same clip reads:

    clip          grow   drop        old seven samples saw
    headshot       61     46            5 and 2
    headshot-2     35     26            5 and 4
    idle            0      0            (correctly still)
    walk            0      0            (correctly still)

Deterministic: three trials, identical numbers, on both builds. The floors are now
**20 and 20**, set off that, so the claim needs a body that actually goes down
instead of one that twitches. **The gate got about ten times stronger, not weaker**,
and it still catches the exact defect it was born for: removing the headshot's
real-time exemption so the sprite freezes takes all four claims to **0px**.

Third ruler bug of this class this round, fourth of the session. The pattern is
always the same shape: **a unit or a span that is not what the ruler's sentence
claims** -- seconds read as fractions, 56-space constants on a 112 rig, two
endpoints called a peak, and now an eighth of a fall called a fall.

## WHAT W'S MASKED WHIP POINTED AT, MEASURED BEFORE LEAVING IT
The gate prints W as the one facing whose own fall outruns the whip. Chasing that
one line gave beat two's real diagnosis, which is NOT what "the knees do not fold"
implies. Knee angle across his fold window, all eight facings (0 is straight, 180
is folded double):

    dir |  K (knock projection) | knee peak (at) | knee at his window end
      N |          [0.71, 0.39] |  102  (0.26)   |   14
     NE |         [-0.71, 0.39] |  122  (0.285)  |   22
      E |             [-1, 0]   |  142  (0.44)   |  144
     SE |         [-0.71,-0.39] |   80  (0.27)   |   29
      S |          [0.71,-0.39] |   38  (0.26)   |    5
     SW |          [0.71,-0.39] |   37  (0.275)  |    3
      W |              [1, 0]   |  159  (0.34)   |  133
     NW |          [0.71, 0.39] |  102  (0.275)  |   31

**The knee peak tracks |K[0]| exactly.** There is ONE canonical sim projected onto
eight knock axes, so the knee's fold in the sim is the same every time; only the
projection differs. E and W are the pure lateral falls (|K[0]| = 1) and see the
fold undistorted. S and SW are nearly edge-on and see almost none of it.

So beat two is two opposite defects, not one:
- **On the two lateral facings the knee folds nearly DOUBLE** (142 and 159 degrees)
  and stays there. That is too far, not too little.
- **On the other six it folds and then straightens back out** (102 -> 14,
  122 -> 22, 80 -> 29, 38 -> 5, 37 -> 3, 102 -> 31).

Facings sharing a K share their numbers, which is the check on this reading: N and
NW are both [0.71, 0.39] and both peak at 102; S and SW are both [0.71, -0.39] and
peak at 38 and 37.

**The next round's question is therefore not "how do I make the knees fold".** The
sim already folds them nearly double. It is whether a fold that reads correctly on
E and W can survive the projection onto the other six, or whether the fold has to
be authored per-projection. That is a real fork and it wants measuring, not a
window change. Nothing was built on it this round.
