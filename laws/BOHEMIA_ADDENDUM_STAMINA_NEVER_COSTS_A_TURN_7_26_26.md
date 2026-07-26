# BOHEMIA ADDENDUM — STAMINA NEVER COSTS A TURN (Paolo 7/26/26, LOCKED)

Paolo: "you have to understand that the way the strategy is gonna work in this
game, it's gonna be fun — like when you sprint and use stamina points, it
doesn't consume a turn, bro."

## AMENDED SAME DAY, AND THIS IS THE PART THAT MATTERED

Paolo, after the first pass: "you don't understand -- when I press shift it's
almost like a run. It's almost like I get free movement and I CAN'T GET SHOT AT
that turn. That's what Rogue Fable IV does. I can use up all my action stamina
points in my turn and it doesn't end my turn, meaning I DON'T GET SHOT after I
run to a location."

The first pass stopped sprint from ending the turn and LEFT THE RETURN FIRE IN
(`mobExposeFire`). From the player's chair, eating a volley the moment you arrive
IS being shot for moving, so the fix landed as no fix at all.

**FULL LAW: a stamina move costs stamina AND NOTHING ELSE.** No turn. No return
fire. No free crack, no chip damage, no opportunity attack. Spend all three pips
crossing the board if you want; nobody shoots. What you pay is that you ARRIVE
WITH NOTHING LEFT -- no pips for suppress, no dash out, and their two-turn red
line still ticking. That is the tension. A tax on moving is not.

Your one real ACTION -- popping out to shoot -- still ends the turn and still
eats the volley. That is the trade the whole fight is built on, and it is the
only thing that should ever cost you a turn.

Proof (7/26, real build): three sprints inside ONE turn, pips 3 -> 2 -> 1 -> 0,
HP 100/100 the whole way, fourth attempt refused for lack of stamina.
`slices/BOHEMIA_FREE_MOVEMENT_PROOF_7_26_26.png`

## THE LAW

**Anything paid for with stamina is a FREE ACTION. It never ends your turn, and
it never draws a shot.**

Stamina is the movement-and-options economy inside a turn. The fun of the
strategy is the CHAIN: suppress, dash to a new angle, sprint across the open,
and still take your shot, until the pips run out. A verb that charges stamina
AND eats the turn is a verb nobody will ever press.

What separates the mobility verbs is PRICE and RISK, never turn cost:

| verb    | cost   | what you get                      | what it costs you |
|---------|--------|-----------------------------------|-------------------|
| SPRINT  | 1 pip  | 2 tiles                           | nothing but the pip |
| DASH    | 2 pips | 2 tiles, breaks their locks       | nothing but the pips |
| VAULT   | 1 pip  | over low cover, new angle         | nothing but the pip |
| SUPPRESS| 1 pip  | pins everyone with a line, 1 turn | a turn of cooldown |

Nobody shoots you for any of it. What runs out is stamina, and arriving with an
empty bar is the whole cost.

## THIS WAS ALREADY HIS LAW AND THE CODE SAID SO

The constant sitting directly under the sprint code has read, since V54, in his
words: `const STAM_MAX=3;   /* V54 STAMINA (Paolo, Fable model): stamina actions
DON'T end your turn */`. Suppress, dash and vault all honoured it. SPRINT never
did — and v67 made it worse by charging a pip while STILL ending the turn, which
is the worst of both and exactly the kind of thing that makes a verb dead.

Fixed v72: a sprint ends nothing and keeps its full risk.

## THE STANDING CHECK

Before any combat verb ships, two questions: if it spends stamina, does it end
the turn? Does it draw ANY return fire? Either answer being yes means it is
broken. `mobExposeFire()` still exists in the code for a future non-stamina verb
and has ZERO callers; the gate asserts that count stays at zero. `combat_lab_gate` asserts the V54 comment is still in the
code next to a sprint that no longer calls `endTurnReturn`.

Real-surface proof (7/26): two sprints back to back inside one turn, pips
3 -> 2 -> 1, no turn boundary in between —
`slices/BOHEMIA_SPRINT_FREE_PROOF_7_26_26.png`.
