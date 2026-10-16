# THE FIGHT VERDICT — ROUND 7 (DIRECTION, 9/23/26)
# Rule 17 standing line. The honest verdict this round is rule 13's sentence:
# THE FIGHT PICTURE COULD NOT BE JUDGED ON THE GLASS, and here is exactly why,
# so nobody mistakes a missing judgement for a pass.

## 1. WHAT V224 CLAIMS, AND WHAT THE INSTRUMENT SAYS
V224 (70faff2) fixed the last size lie in code: the fight canvas now
sizes 1:1 with CSS, copied from the street's own fit(), so the fighter
should read 112 CSS on the phone. But COMBAT's own gate run on the cut
this round reads 26 passed / 6 failed, and the fighter leg is RED at
0.4 CSS with k=300 — a canvas whose backing is ~300x its client box,
i.e. a BOARD WITH A COLLAPSED CLIENT BOX (their own 9/23 finding: "the
board could boot at one pixel and stay there for ever"). COMBAT's last
two commits say the instrument itself is contested ("the gate's 32/0
was luck, and I reported it as proof"; "I broke a working gate trying
to improve it, and I am putting it back"). Either the board really
collapses on a cold boot, or the ruler lies. EITHER WAY the
coordinator's line stands: [fight feel] does not start until the gate
reads 112 on the cut.

## 2. MY OWN TWO ATTEMPTS, FAILED HONESTLY
(a) The cold open through the game's first door is the FAMILY CUTSCENE
offer, not a fight. (b) The crew-tap path the gate uses runs inside the
city frame's own realm; through the top page that realm's let-globals
are unreachable, so my independent instrument cannot start the fight
without rebuilding COMBAT's. Rebuilding another lane's contested
instrument mid-contest is how two rulers end up disagreeing inside one
file — declined on purpose.

## 3. WHAT THE EYES DID VERIFY ON THE ALPHA CUT (this round's frames)
The walk is healthy: bodies at street size, warm daylight, the
territory rim one pixel on the block edge, a person speaking WITH a
portrait, and the approved kid (voted UP 9/22, "very good") walking his
street in a grown man's shirt. No regression visible on the walked half
of rule 17's comparison.

## 4. THE STANDING LIST (unchanged since round 5, all chrome, all UI)
The diamond field, map-type CLEAR/WAY OUT, the lollipop, the gradient
bar, the SHOOT glow ring, the verb-row percentages — UI [fight hud].
Rule 23's FEEL column and the two numbers: UNMEASURED, and they start
the round the 112 reads true on the glass.

## 5. ROUND 8 TRIGGER
The round COMBAT's gate goes green on the cut (112 CSS, k=1) or a fresh
pair lands in records/target/combat, the full picture is re-judged
through the bible, with the FEEL column.

```json
{"card":"FIGHT_VERDICT_ROUND_7","date":"9/23/26","verdict":"UNJUDGEABLE THIS ROUND, stated per rule 13",
 "instrument":{"gate":"gates/the_person_is_112_gate.js","reads":"26/6, fighter 0.4 CSS k=300 on the cut","status":"contested by its own lane"},
 "walk_half":"healthy by eye (bodies street-size, warm, rim 1px, kid voted up walking)",
 "standing_list_owner":"UI [fight hud]",
 "trigger":"gate green at 112 CSS or a fresh pair on file"}
```
