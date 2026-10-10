# THE LONG INJURY -- a review file for COMBAT and RUN TWO (PEOPLE lane, 10/9/26)

VAMILY.md's [struck down] (COMBAT, claimed, combat-nfnki9) names "the roster
shows the injury as one pain line (VIA GROK, one label, the penalty by body
part)" as part of its own scope. That's the same card this row
([the long injury], PEOPLE) was asked for. Rather than two lanes writing two
different versions of the same content, this lane built it once, as a pure,
gated module, so COMBAT's roll and RUN TWO's card can both read from it.

## The odds are already real -- nothing to add there

`records/target/bb/ours.json` already carries the sourced numbers, cited to
the locked law (`laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md`):

- `struck_down_death_chance`: 0.2
- `struck_down_laid_up_days`: [30, 40]
- `veteran_death_chance`: 0.1 (`THE_THIRD_VOTES`)
- `main_character_dies`: false

## What this lane built: the person's fact, given he lived

`engine/bohemia_long_injury.js`, pure, gated (`gates/long_injury_gate.js`,
38/0). Call `BohemiaLongInjury.injuryFact(key)` with any stable per-man key
(the same shape the goodbros/heirs rolls already use) and get back:

```js
{ days: 30-40, markId, markName, painLine, bodyPartPenalty }
```

- `days`: the real 30-40 range above, rolled deterministically off `key`.
- `markId`/`markName`: one of the eleven real PERMANENT rows in
  `records/target/bb/injuries.json` (Brain Damage, Broken Elbow Joint,
  Broken Knee, Partly Collapsed Lung, Maimed Foot, Missing Ear, Missing Eye,
  Missing Finger, Missing Nose, Traumatized, Weakened Heart) -- a literal
  match to his own words ("a scar, a limp, a lost eye, a stat that never
  comes back").
- `painLine`: that mark's own real `flavor` text, first sentence only.
- `bodyPartPenalty`: that mark's own real `effects_text`, joined.

Call `BohemiaLongInjury.healDay(fact)` once per real game day that passes
(a pure step: `days` goes down by one, floors at zero, the mark never
clears). This module doesn't call it anywhere itself -- whichever lane owns
the city's day-tick (not this one) wires that in; a day clock is a
different file's system.

## Suggested wiring

**For COMBAT's [struck down] roll**: when the 20%/80% (or 10% for a
veteran) roll says "lives, injured," call `injuryFact(thatMan.key)` once and
store the result on him. That's his whole injury, done.

**For RUN TWO's clinic card** (`slices/BOHEMIA_SETTLEMENT_SCREEN.html`'s
`woundedList()`): today it rolls a random *temporary* injury from
`injuries.json` when `w.injuryName` is missing, which is the wrong list for
a man struck down in a fight (temporary injuries there heal in 1-9 real
days, nowhere near the locked 30-40). If a wounded man already carries a
fact from `injuryFact()` (`w.markName`/`w.painLine`/`w.bodyPartPenalty`),
show those instead of re-rolling a temporary one. `clinicPrice()`'s own
day-halving is untouched -- it already works on whatever `w.days` holds.

## A canon note, named not hidden

`engine/bohemia_down.js` (9/12, PEOPLE) promises "nothing on a person you
keep is forever" with three injuries that all heal (knocked/leg/hand). The
9/27 law above is newer and explicitly locks a permanent mark for the
struck-down-in-a-fight case; NEWEST DATE WINS means this module is the
correct read for that case. `bohemia_down.js` is untouched -- it may still
be the right shape for injuries that do not come from a fight, and deciding
whether to retire or fold it is a bigger call than this row asked for.

## The ship test this row names

"In VOTE: a laid-up man's card." The cook
`slices/BOHEMIA_THE_LONG_INJURY_10_9_26.html` shows three real cards
standalone. Wiring it into the live fight and the live settlement screen is
COMBAT's and RUN TWO's own hand, named above.
