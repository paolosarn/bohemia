# WHAT THE STONE IS WORTH (8/21/26, COMBAT lane, RF4-18)

**The stone takes 69% of the guns off you.** Measured causally over 263 real
fight states. Nothing held that until today.

## THE ROW

RF4-18, ★:

> *"**Walls are mechanics, not scenery.** Infusion-of-Storms grants +1 Power for
> ending a turn **wide open**, meaning **not adjacent to any walls**... **Abilities
> read the room.**"*

Our diff column called it **ABSENT** — *"cover and LOS are read, but nothing keys
off wall adjacency or open-ness."* That is true, and it buried the more important
fact: **the room already decides the fight, and nothing was measuring it.**

## THE MEASUREMENT

Policy arms cannot answer this. The same in-cover-versus-open comparison came
back **2.94 against 2.67** on one run and **4.51 against 2.95** on the next — 24
fights of random rolls swamp the effect entirely.

So it was asked **causally, one frozen board at a time**: count the guns with a
clean line on the player, take every rock off the board, count again. Same men,
same tiles, same turn. The only difference is whether the stone exists.

| | guns with a clean line on you |
|---|---|
| every rock gone | **0.73** |
| the stone in place | **0.23** |

**69% of the guns removed**, and it is not a rare branch — the stone changed who
had a line in **102 of 263** states.

**This is the single largest defensive system in the fight**, and it now has a
gate. Gated in `fight_moves_you_gate.js`, blocking at 45%.

## AND A DISTINCTION THAT MATTERS: ADJACENCY IS NOT COVER

`inRealCover()` asks whether **one** pillar blocks **one living man's** line, so
it flickers as men walk. Wall **adjacency** is a property of the ground under
your feet that nobody can change from across the lot. Measured apart, they
disagree badly — a man standing next to a rock that covers him from nobody reads
"not in cover" while being exactly what RF4-18 calls not-wide-open.

Conflating them is how a mechanic gets built on a number that was never about it,
and the first version of this measurement did exactly that.

## THE MECHANIC WAS BUILT AND CUT

Given cover that strong, the interesting decision is not *"should I take cover"*
(always yes) but *"is this turn worth standing up for"* — so V175 paid you for
**leaving**: end your turn wide open and the chain allows one more killshot. It
pays in the one currency the 8/20 measurement found this fight short of, and the
cost side was already proven at 69%.

It measured correctly on every count — the allowance swung 2 → 3 in the open and
back to 2 next to a rock, adjacency read independently of exposure, the weapon's
own cap still bound it, and it landed on **52%** of turns in real fights.

**And it only works with a pistol.**

| weapon | killshot wall | with the bonus |
|---|---|---|
| pistol | 8 | 2 → **3** |
| smg | 2 | 2 → 2 |
| shotgun | 2 | 2 → 2 |
| rifle | 1 | 1 → 1 |

V62's weapon identity caps killshots per turn per weapon, and for three of the
four that cap swallows the bonus whole. **The readout would have printed "out
here the rifle gets one more this turn" and handed over nothing** — a rule that
holds for one weapon in four is not a rule the player can learn, and V163 already
wrote down that a rule holding 58% of the time is unlearnable.

Reverted, tool deleted. **Not a graveyard entry** — he never saw it.

## WHAT RF4-18 ACTUALLY NEEDS, PRECISELY

A reward currency that is **not weapon-capped**. The two obvious ones are both
closed:

- **damage** — NO DAMAGE BEFORE THE DIAL
- **the dial** — his single most-reported system; not something to widen on my
  own initiative

Raising the *wall* instead of the allowance was considered and rejected: the wall
**is** weapon identity, and a rifle that fires twice because of where you stand
is not a rifle any more.

So RF4-18 stays **SPECED**, with the blocker named rather than a third version of
the mechanic written. The half of it that was really at stake — *does the room
mean anything* — is answered, at 69%, and now guarded.
