# ADDENDUM: YOU ALWAYS SHOOT FIRST (Paolo 8/3/26, LOCKED)

> "no enemies never get the first shot thats why its important to not miss idk
> if its because im good at the pattern now"

## THE RULING

**THE PLAYER OPENS EVERY FIGHT. NO ENEMY EVER FIRES BEFORE THE PLAYER HAS HAD
A FULL TURN. NOT ON ANY DIFFICULTY, NOT IN AN AMBUSH, NOT EVER.**

This is now settled canon and no session may reopen it. It is not a bug, it is
not a balance lever, and it is not something to "fix" later.

## WHY, IN HIS OWN WORDS

*"thats why its important to not miss."*

The opening shot is the whole reason the dead-shot dial carries weight. If the
fight could open with a round already in you, the first pull of the dial would
be one exchange among many, and missing it would be a shrug. Because you are
guaranteed the first shot, missing it is a **choice you got wrong**, not luck
you did not get. That is what makes the pattern matter.

The second half of what he said is the part worth keeping in mind:
*"idk if its because im good at the pattern now."* He has gotten good at the
minigame. That is the system working, and it is also the honest reason the
fight can feel easy: a player who reliably wins the opening exchange has removed
one gun from the board before anyone answers. **The answer to that is never to
take his first shot away.** It is to make what happens AFTER the first shot
harder, which is what the 8/3 difficulty wiring does.

## WHAT THIS FORBIDS

- No initiative roll, ever.
- No "enemy-first when they spot you" / ambush opener.
- No difficulty tier that grants the enemy a pre-turn volley.
- No perk, quest flag, or arena that starts the fight in the enemy phase.
- No opportunity fire that resolves before the player's first action.

## WHAT THIS DOES NOT FORBID

Everything after your first turn is fair game. Making them **better shots**
(the 8/3 THREAT_BY_PKG wiring), making them **more numerous**, making them
**flank, suppress and take the high ground** are all untouched by this ruling.
Difficulty lives entirely in what happens once the fight is joined.

## THE MEASUREMENT THAT PROMPTED IT

Measured 8/3, before the ruling:

    startPhase 'cover'      enemiesActedBeforeYou 0      yourHP 100

Every fight, without exception. I surfaced it as an open question because it
looked like a standing advantage nobody paid for. He answered: it is deliberate,
it is the point, and it stays.

## GATE

`gates/combat_lab_gate.js` asserts the fight opens in the player's phase with
the enemy turn counter at zero, and that no code path grants a pre-turn enemy
action. A law without a machine gate is not enforced.
