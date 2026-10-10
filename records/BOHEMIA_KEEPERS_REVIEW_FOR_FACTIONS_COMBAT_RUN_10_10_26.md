# THE KEEPERS -- a review file for FACTIONS, COMBAT and RUN (PEOPLE lane, 10/10/26)

VAMILY.md's [keepers] names its own split: "the beast-keeper as a
background and a faction... With FACTIONS (the keeper faction's roster)
and COMBAT (the beast slot on the board)." This lane built its own
exclusive piece only -- the six real crafts and the companion slot's shape
-- and touched no other lane's file.

## The six real crafts

`engine/bohemia_keepers.js` (new, pure, gated `gates/keepers_gate.js`,
21/0). `BohemiaKeepers.CRAFTS` holds six real beast-keeper practices, each
citation copied verbatim from `records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_
ROUND_THREE_THE_SEVENTEEN_9_29_26.md` section 2:

- `war_dogs` -- dog
- `hunting_birds` -- eagle (falconry)
- `camel_cavalry` -- camel
- `horse_raiders` -- horse
- `hyena_men` -- hyena
- `bee_keepers` -- no animal (a thrown weapon, a hive, not a companion)

## A real gap, measured not guessed

"The automated companion may be an animal" cannot be built honestly today:
`slices/BOHEMIA_CITY_WORLD.html`'s own `CT_WALKS_WITH` only ever holds a
person's id (`CT_WALKS_WITH = hit.id;`, checked directly, confirmed by the
gate's own leg D). `BohemiaKeepers.companionSlot(craftId)` proposes the real
shape that case would need:

```js
{ kind: 'animal', species: 'dog', craft: 'War Dogs', craftId: 'war_dogs' }
```

Wiring `CT_WALKS_WITH` (and every place that reads it expecting a person's
id) to accept this shape is RUN's own file to touch, not named lightly --
it is a real structural change, not a one-line addition like the price
line or the rumour filter in this lane's last two rounds.

## What FACTIONS and COMBAT still own

- **FACTIONS**: the keeper faction's own roster -- which of the sixteen
  real factions (or a new one) actually runs each craft, and how a player
  reaches "useful" standing with them. This module names the crafts; it
  does not assign them to a faction.
- **COMBAT**: "the raid where the enemy brings a hyena" and the beast's
  slot on the fight board. This module's `CRAFTS` list is the real source
  for which animal each craft fields, if useful there.

## No price, on purpose

The research round's own economic note is qualitative only: "a live
capture -- a handler's dog or camel -- is worth a season's pay." That is
not a number, and rule 63d forbids inventing one where no source gives it.
A real price waits on TUNING's table or a direct Grok ask, named here, not
faked.

## The ship test this row names

A background and a company slot for the beast-keeper. The cook
`slices/BOHEMIA_KEEPERS_10_10_26.html` shows all six crafts and their real
companion-slot shape (or honest refusal) standalone. The faction roster,
the fight's beast slot and the live companion wiring are FACTIONS',
COMBAT's and RUN's own hands, named above.
