# FOR THE LAB: the encounter curve has landed, and your gate is red on purpose

**Filed 8/19/26 by the COMBAT lane. Two checks in `rf4_teardown_gate.js` are red
and I did not clear them, because clearing them means writing in your column.**

## WHAT HAPPENED

Paolo, 8/19: *"its still not feeling like rogue fable 4 bro."*

I went to your spec instead of guessing and found RF4-24 — the only three-star row
in the document — sitting at SPECED with the worst measurement in it. So COMBAT
built the curve, which is what your own column rule and your own gate header say
is supposed to happen:

> it demands the divergence stay **MEASURED AND DECLARED** … and **goes red when
> COMBAT lands the encounter curve.** When the curve lands it goes red and the
> spec gets rewritten, rather than quietly becoming false.

It landed. It is red. That is the design working.

## THE NEW MEASUREMENT, off your own `tools/bohemia_rf4_teardown_measure.js`

```
was:  8.0 per fight   min 8, max 8, across 40 arenas   INSIDE 3-6:  0 OF 40
now:  4.3 per fight   min 3, max 6, across 40 arenas   INSIDE 3-6: 40 OF 40
counts: 4,5,3,5,3,3,6,5,5,5,6,3,4,5,3,4,3,5,6,3,3,5,4,6,4,5,5,4,3,3,5,6,3,4,4,3,6,6,4,3
```

The cause of the old number was one button: `8` had carried the `on` class in the
demo FOES row since it was written, `G.numEnemies` defaulted to 8, and nothing
ever rolled anything else. Size is rolled per encounter now (3:30% / 4:35% /
5:22% / 6:13%, off the arena's own seeded dice so a seed still reproduces a
fight), 7-8 stay **reserved** exactly as his notes say, and pinning any number on
that row still works.

## WHAT IS RED, AND WHY I LEFT IT

| check | why |
|---|---|
| **C2** the spec states the same measured numbers it was written from | the BOHEMIA TODAY cell of RF4-24 still says 8.0 / min 8 / max 8 |
| **C3** and the same in-band count | it still says 0 OF 40; it is 40 OF 40 |

**I wrote the new numbers into that cell, and G3 caught me and was right to.** The
column rule gives COMBAT the STATUS column and nothing else, and the BOHEMIA TODAY
column is yours. So I reverted the prose, set STATUS to BUILT on RF4-24 and
RF4-26, and left the two reds standing as the signal rather than reaching into
your file. G3 and F14 are green.

`F14` will go stale the moment you rewrite the cell — it asserts the spec plainly
states *"every Bohemia fight is boss sizing"*, which stopped being true today.
That is the `civ5_gate D4` shape you already have a precedent for: a check whose
finding expired because the finding got fixed. It wants rewriting to the new
truth, not deleting.

## ONE THING YOU SHOULD CARRY INTO THE CELL WITH THE NUMBERS

The curve makes the fight **measurably less lethal one for one**, and it should
be recorded next to the win, not buried. Same policy, same rolls, 24 fights each,
through the shipped return-fire path:

```
pinned 8    6.36 HP lost per turn   0.246 hits per turn   died 8 of 24
the curve   3.74 HP lost per turn   0.168 hits per turn   died 2 of 24
```

Turns per fight barely moved (8.6 against 9.4), so it is not a short-fight
illusion. Half the guns is half the incoming fire, and shuffling which archetypes
turn up barely dents it — moving the SEC-BOT from N>=5 to N>=4 bought back 3.31 to
3.74 and no more. The only lever that closes the gap is per-enemy damage, which
**NO DAMAGE BEFORE THE DIAL** forbids, and RF4's actual compensator is **attrition
across a floor** rather than a crowd in one room. That is a real open question for
the spec and it is not a COMBAT-only one.

Full working: `records/BOHEMIA_COMBAT_THE_ENCOUNTER_CURVE_8_19_26.md`.

## ALSO BUILT, SAME TURN

**RF4-26** → BUILT. Rosters were picked by modular arithmetic on the slot index
and every rule was gated on N being large (`N>=5` machine, `N>=4` sniper), so
shrinking N alone would have deleted the interesting bodies from small fights.
There is a composed spine at every size now: one sniper (the worst man, on the
back slot), a SEC-BOT at 4+, a blade at 3+, goons for the rest. Measured: a
priority target in 60 of 60 fights, three or more kinds of body in 60 of 60.

**RF4-37 is NOT claimed.** Guaranteeing a priority target exists is only its
precondition. Making him *worth crossing the room for* is the other half and is
still SPECED.
