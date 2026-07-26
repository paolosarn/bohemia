# BOHEMIA ADDENDUM — STAMINA NEVER COSTS A TURN (Paolo 7/26/26, LOCKED)

Paolo: "you have to understand that the way the strategy is gonna work in this
game, it's gonna be fun — like when you sprint and use stamina points, it
doesn't consume a turn, bro."

## THE LAW

**Anything paid for with stamina is a FREE ACTION. It never ends your turn.**

Stamina is the movement-and-options economy inside a turn. The fun of the
strategy is the CHAIN: suppress, dash to a new angle, sprint across the open,
and still take your shot, until the pips run out. A verb that charges stamina
AND eats the turn is a verb nobody will ever press.

What separates the mobility verbs is PRICE and RISK, never turn cost:

| verb    | cost   | what you get                      | what it costs you |
|---------|--------|-----------------------------------|-------------------|
| SPRINT  | 1 pip  | 2 tiles                           | FULL exposure crack from anyone holding a bead |
| DASH    | 2 pips | 2 tiles, breaks their locks       | HALF exposure |
| VAULT   | 1 pip  | over low cover, new angle         | reduced exposure |
| SUPPRESS| 1 pip  | pins everyone with a line, 1 turn | a turn of cooldown |

Cheap and reckless, or expensive and clean. Your turn survives either way; what
runs out is stamina.

## THIS WAS ALREADY HIS LAW AND THE CODE SAID SO

The constant sitting directly under the sprint code has read, since V54, in his
words: `const STAM_MAX=3;   /* V54 STAMINA (Paolo, Fable model): stamina actions
DON'T end your turn */`. Suppress, dash and vault all honoured it. SPRINT never
did — and v67 made it worse by charging a pip while STILL ending the turn, which
is the worst of both and exactly the kind of thing that makes a verb dead.

Fixed v72: a sprint ends nothing and keeps its full risk.

## THE STANDING CHECK

Before any combat verb ships: if it spends stamina, does it end the turn? If
yes, it is broken. `combat_lab_gate` asserts the V54 comment is still in the
code next to a sprint that no longer calls `endTurnReturn`.

Real-surface proof (7/26): two sprints back to back inside one turn, pips
3 -> 2 -> 1, no turn boundary in between —
`slices/BOHEMIA_SPRINT_FREE_PROOF_7_26_26.png`.
