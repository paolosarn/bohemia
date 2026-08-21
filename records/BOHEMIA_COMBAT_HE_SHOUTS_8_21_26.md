# HE SHOUTS (v175, RF4-39 — the anti-pull rule)

COMBAT lane, 8/21/26. **TAB: COMBAT.**

> *"There is now a **50% chance that enemies will shout immediately upon gaining
> agro** to prevent easy, repeatable single pulls."* The corridor-pull degenerate
> strategy is deliberately broken.

Our diff: **ABSENT** — *"and this is the direct mechanical answer to his 8/15
complaint (**'I just found some cover and I stayed in the same place just
shooting people'**) — it makes a static hold stop working without touching
animation."*

## MEASURED FIRST, BECAUSE WE ALREADY HAD A SHOUT AND IT LOOKED STRONGER

V165's routine shout is **100%, not 50%, and it runs every turn, not once**. On
paper that is stricter than RF4's rule, so the question was never *"is the rule
implemented"* — it was **"is the degenerate strategy it exists to prevent still
available."**

It was:

| at the moment he is first seen, 30 boards | |
|---|---|
| men who see him | 1.97 |
| men told without eyes of their own | 0.43 |
| **men still completely ignorant** | **1.87** |
| **boards allowing a clean single pull** | **11 of 30** |

And standing still, only **5 fights in 20** ever reached a state where the whole
room knew he was there.

**The cause is geometry, not a missing feature.** The routine shout travels
`SHOUT_TILES` (8) from a man who can *see* you, so anybody standing further out
never learns anything. Break one line, take one man, repeat.

## WHAT SHIPS

**The first time a man lays eyes on you, he may yell** — and a yell carries
further than *"I told the one next to me."* Half the time, everyone inside
`ALARM_TILES` (15) learns where you are without eyes of their own.

Measured with the alarm switched off and on across the same fights — the control
is exact rather than a different day's run, because pre-setting `_everSaw`
suppresses the alarm and changes nothing else:

| over 60 boards | alarm off | alarm on |
|---|---|---|
| clean single pulls | 16-17 | **10-15** |
| men left ignorant | 1.58-1.63 | **1.22-1.35** |
| whole room learns where he is | 8-10 / 40 | **15-17 / 40** |

**Ranges, not single numbers, because the mechanic is a coin and the honest way
to report a coin is over repeated runs.** The gate first ran 30 boards — about
fifteen coin flips — and swung hard enough to pass and fail the same claim on
consecutive runs (12 against 7, then 9 against 8). **The answer to an underpowered
measurement is more evidence, never a looser threshold**, so it now runs 60 boards
and 40 fights and has been green across repeated runs. The *direction* has been
consistent in every measurement taken: the alarm always cuts pulls and always
wakes more rooms; only the size moves.

## FIFTY PERCENT IS THE MECHANIC, NOT A HEDGE

RF4's own wording is *"prevent **easy, repeatable** single pulls"* — not prevent
pulls. Measured at `ALARM_CHANCE` 1.0 the clean pull nearly vanishes (**2 of
30**); at 0.5 it survives as a gamble. **A certainty deletes the play; a coin
makes it a bet.** It is also the honest model: sometimes a man yells, and
sometimes he just starts shooting.

**Both dials were proven live before shipping.** The radius at 40 tiles moves the
numbers too (6 of 30 pulls, 14 of 20 rooms alerted), so neither is decoration —
the lesson from `MEDIC_SHY` two builds ago.

**It is the first sighting only.** A yell every turn is the routine shout with a
bigger number, and it would make the alarm meaningless by making it constant. The
point is that the moment you are *found* is dangerous in a way the rest of the
fight is not.

**NO DAMAGE BEFORE THE DIAL is untouched.** It moves *information*, which is
V165's currency, and reuses V165's own `markSeen`, so what an alarmed man knows is
exactly what a told man knows — one definition of "where he is", not two that can
drift. It runs inside `visionTick`, before the routine shout, so one function
decides who knows what.

## GATES

`fight_moves_you` **69 pass / 0 fail** (4 new, all measured against the in-page
control) · `combat_lab` **895 pass / 3 fail** (6 new; all three fails already red
on clean main).

**Seven mutations, all caught**: never firing, always firing, firing every turn
instead of once, a yell shortened to 4 tiles, the call removed, the per-fight
reset inverted, and the already-knew guard removed.

**RF4-39 moves SPECED → BUILT.**
