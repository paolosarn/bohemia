# V239 — EVERY FIGHT ENDS
(COMBAT, rule 57: "COMBAT owns the end condition")

## HIS WORDS

Paolo 10/1, he played the demo: *"I entered combat and it was so dog shit and then combat didn't end so I
couldn't get back into the overworld."* Rule 57: every fight ends and returns to the map: all down, all
fled, your side down. RUN [fight returns] owns the way back; this lane owns the end.

## WHY IT NEVER ENDED, FOUND IN THE SOURCE

V159 (8/16, this lane) made the way out the **only** win: *"Killing every man no longer ends the fight."*
Every fight places a way out, so on a cleared board the game printed NOTHING LEFT IN YOUR WAY and waited
for him to walk there. Nothing told him that, so he sat on a quiet board. V212's rout also waited, with no
limit, for him to chase every runner still in reach. And the rout's one line was never reset, so after
the first rout it never spoke again.

## NOW

| ending | before | now |
|---|---|---|
| every man down | not over: the board waits for the way out | **over, won** (AREA CLEAR, the receipt) |
| every man broke and ran out of reach | not over | **over, won** (THEY RAN) |
| runners still in his reach | the chase, forever | the chase for `ROUT_TURNS` = 3 turns, **then over, won** |
| he reaches the way out | won (YOU MADE IT) | the same: the early win, leaving before it is over |
| his side down | lost | the same |

Every end goes out through the V59 handoff (`sendCombatEnd`), the one door RUN listens on.

## MEASURED

`gates/every_fight_ends_gate.js` **9/0**, new: it makes each ending in a real fight and asks the game's
own end check. **On the build before V239: 4/5**, with every man down giving `over: false` with the way
out on the board. That is the bug he hit, reproduced. combat_lab **923/9** (main 922/10: the V159 pin he
overruled now passes, re-pointed with rule 57, and the win-message pin re-pointed). the_rout 10/1 and
house_rulers 11/2, the same before and after. Four of this lane's gates are now in the suite
(NOTHING ON THE GROUND, NO ATARI, A HOUSE IS NEVER SMALLER THAN A MAN, EVERY FIGHT ENDS): orphans 34 to 30.

## FIGHT LENGTH (rule 40a)

Cover bot, three fights, real time, this build: **65.3 s, 6.7 s, 6.2 s**, downed each time, kills 3, 0, 0.
The bot never wins, so these fights end the old way (his side down); the new endings are proven by the gate,
which makes each one. The lethality question (5 to 65 s against a 2 to 4 minute default) stands for TUNING.

## [bb end]

Battle Brothers' battle ends when the last enemy is dead or has left the field, and you may chase the
fleeing ones. **What we do differently:** the chase is three turns on the beat, then they got away.

## ANALOG HORROR LINE

The street goes quiet the moment the last one drops. The receipt prints anyway.

---

**Tool:** `tools/bohemia_every_fight_ends_patch.py` (the replay list carries eighteen) · **Gate:**
`gates/every_fight_ends_gate.js` 9/0 · **VOTE:** `combat-every-fight-ends-10-1` · **Stamp:** 10/1h ·
**Tab:** COMBAT, and any fight from CITY.
