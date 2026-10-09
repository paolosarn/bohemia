# WHAT OF A MAN PASSES TO HIS HEIR
DYNASTY, row [the company inherits]. 10/9/26. MODE: page plus the data (BUILD).

## THE RULE, AS DATA (engine/bohemia_heirs.js ROWS, all draft:true, TUNING's)
Measured first: the repo now has a real crew entry (RUN TWO's roster: level, xp, stats, stars, perks, gear slots, background), so "levels and perks earned in the demo mean something later" has something to carry. Before this, heirs had a name and a look only.
- LEVEL: half the parent's, rounded up, never below 1 (levelShare 0.5). It compounds each hop: 7 -> 4 -> 2. That is his 9/28 reading, a child half the DNA and a grandchild a quarter.
- PERKS: the first half, in the order the parent took them (perkShare 0.5).
- STARS: carry whole. Talent runs in a family.
- GEAR: all of it, a crew man's slots flattened (37g, gear stays in the family).
- HOUSE: passes.
- DEBT: crosses at 0.45 (debtShare), which is bohemia_standing's own GEN_LOSS, reused so there is one number for what crosses a generation.
- NAME: the surname, only if the name was earned (earlier round).
- THE BODY NEVER CARRIES: no stats, wounds or age are copied. Gate leg proves a parent's injury and stats do not appear on the heir.
A man with none of these fields still derives exactly as before.

## NOT DONE, SAID PLAINLY
The roster's crew men have no `house`, `debt` or wound written by any game system yet, so on the street today level and perks are 1 and none (level 1, xp 0, perks []). The rule is proven on the input shape. The numbers are drafts, and which perks are the best to pass is a choice I did not make (first taken first).

## ROUTED
PEOPLE [good bros] and RUN TWO [climbing]: when a man gains a level or a perk, the heir gets it. TUNING: levelShare, perkShare, debtShare. COMBAT: the heir's stats come from the background and stars, never the parent's body.

GATE: HEIRS gate new section 1c, 10 legs. Mutant (perkShare 1) went red.
