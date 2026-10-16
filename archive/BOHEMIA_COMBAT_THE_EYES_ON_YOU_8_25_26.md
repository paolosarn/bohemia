# THE EYES ON YOU (v179, RF4-53 layer 2)

COMBAT lane, 8/25/26. **TAB: COMBAT — a ring lights up under every man who can
actually see you.**

> *"Three-layer awareness... **a binary spotted/unspotted system has no decisions
> in it.**"* — and the readout discipline the diff column flags: **rings on the
> map**, information on the field, never in a menu.

## MEASURED FIRST, TWICE, AND THE SECOND MEASUREMENT CHANGED THE BUILD

**Does distance ever decide anything?** Our sight is 17 tiles, not RF4's 6,
because this is a gun game — so a detection ring might be a circle nobody is ever
near. Over 278 real fight states and 1177 living men, every *"he cannot see me"*
broken into why:

| | |
|---|---|
| he **can** see you | 414 |
| **too far** | 132 (17.3% of blind men) |
| **blocked by cover** | 631 (82.7%) |

Distance binds, but **cover decides**.

**Then: is "he can see me" already on screen?** V165 made vision the master
switch — it gates the bead, the volley, the press, the shout and the spotter's
pin — so this is the fact the player most needs.

| | |
|---|---|
| men who can see you | 450 |
| of those, already marked on screen | **450 (100%)** |
| **men marked on screen who cannot see you** | **707 of 1157 (61%)** |

**The signal was not missing — it was over-inclusive.** The washes are honest
about a man's *stance* (he is up, he is shooting) and say nothing about his line
to *you*, because your cover is what breaks it. **Three in five marked men could
not see you**, with no way to tell which. That is worse than the binary the row
complains about.

## WHAT SHIPS

**A ring on the ground under every man who actually has eyes on you.** It reads
`seesMe()` — the same predicate the five systems above run on — so it cannot
disagree with the fight. **It is the game's own answer, drawn.**

An **ellipse, not a circle** (45 degree art law), squashed like every other
ground mark. **Bone**, because green is the peek wash, red is firing and the held
bead, amber is the melee telegraph, blue is the way out, and purple is reserved
for the Amalgamation. Drawn **under** the body so it covers no pixel of his art.
A `[DIAL]` switches it off.

**And it makes cover legible**, which is the point: the stone takes 73% of the
guns off you and until now it did that invisibly. Step behind a rock and rings go
out.

## THE PROOF TOOK FOUR TRIES AND THE FIRST THREE WERE WRONG

1. **A colour filter guessed at the blend** returned a clean zero — while the
   branch was running **84 times a frame.**
2. **The sampler read un-zoomed field coordinates**, the same transform mistake
   the car tap made, so it read pixels the ring was never painted on.
3. **A pixel diff of two staged boards** looked convincing at 924 of 968 pixels —
   **and its own null control killed it.** Staging the *same* condition twice
   differed nearly as much, because the board is **animated**: beat pulses,
   washes, sprites breathing. **A photograph of a moving thing is not a
   measurement.**
4. **Counting the draw call.** The context is wrapped and the ring's own stroke is
   counted. Deterministic, identical across runs:

| men with eyes on you | bone strokes |
|---|---|
| 0 | **0** |
| 2 | 104 |
| 3 | 162 |

**And the ring shipped too faint the first time** — correct, squashed, in the
right place, and barely readable at the zoom he actually plays, where a man is
about eight pixels. It now has a dark seat under the bright line. **Same lesson as
V170's smoke**, which shipped too pale and had to be darkened after somebody
looked at it.

## THE LEDGER: RF4-53 STAYS SPECED, DELIBERATELY

Layer 3 (propagation) shipped as V175's first-sight alarm. **Layer 2 ships here.**
Layer 1 — a detection radius counted in stealth points, and stealth as a
fight-start trigger — needs a stealth stat and a *pre-fight*, and our arena starts
already engaged. **Two of three layers is not BUILT**, and marking it so would be
exactly the overclaim the UNHELD split killed.

## GATES

`fight_moves_you` **83 pass / 0 fail** (2 new) · `combat_lab` **918 pass / 0
fail** (5 new). **Six mutations, all caught**: switching it off, drawing it for
everybody, making it a circle, removing the draw, removing the dark seat, and
swapping `seesMe` for `peeking`.
