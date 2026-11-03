# TUNING 2: DIFFICULTY IS FINE TUNING, BATTLE BROTHERS' WAY (11/3/26; VAMILY rule 380, ask line 409; amends 351(c)(d))

HIS WORDS (records/BOHEMIA_PAOLO_NO_CAP_KILL_CAMS_OFF_FINE_TUNED_DIFFICULTY_AND_RARE_MELEE_11_3_26.md): "For difficulty, please do more research
on all of our numbers and what Battle Brothers did, really get really good. I feel like you have to make it like twice as many enemies to be
difficult. Battle Brothers from easy to hard just tweaked the numbers tiny, so slightly, to make it harder, and it was awesome, you can feel how
fine tuned the game was." And on the three difficulties' card: "Not final, more research, more tuning."

## 0. THE ANSWER IN PLAIN WORDS
1. BATTLE BROTHERS' LEVELS ARE SMALL, AND EACH STEP MOVES DIFFERENT THINGS: from Beginner to Veteran it takes away 5 points of aim both ways
   (and the 10% more experience and the 5 days of grace before the crisis); from Veteran to Expert it changes no aim at all, it sends harder
   groups sooner (the count and the tier), and its money setting pays 10% less and buys 10% cheaper. Never twice the men.
2. OURS, MEASURED ON THE SAME FIGHT (nine men on day 20, the hardest job): NEW HERE 9 of them, won 19 of 20, about a man down; SEEN IT 9, won 18,
   about a man down; OUTLIVED IT 9 (sometimes 10), won 13, about 4 men down. Our counts are small steps already (1 / 1 / 1.15); THE CLIFF IS
   BETWEEN SEEN IT AND OUTLIVED IT, where three things land at once: the 5 points of aim each way, 15% more men and the tier 8 days on.
3. SPREADING IT LIKE BATTLE BROTHERS means SEEN IT at Battle Brothers' own aim (0) and OUTLIVED IT's count and tier eased to match; the first is
   pinned this round by WORLD's typical-company gate (rule 192), whose men fight with level-1 numbers (TUNING 2's rule 370 record s7). Every
   other lever Battle Brothers moves (experience, pay, prices, the crisis) is not read per level anywhere in our code yet: ROUTED, named below.
4. THE GATE (THE FIGHT IS CLOSE, leg D1): no level's crew more than 0.15 from its neighbour (Battle Brothers' own Expert step) and SEEN IT the
   math; no aim step bigger than Battle Brothers' 5 points; no easier level harder than the next on crews, aim, how soon the late men come or
   the tier's days. THE CARD (VOTE): the same fight on the three levels.

## 1. WHAT BATTLE BROTHERS' DIFFICULTY TOUCHES, AND BY HOW MUCH (the library; TUNING's 10/9 page
## records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md read again against the wiki copy)
COMBAT DIFFICULTY (bb_all/0828_Game Mechanics.txt 'Difficulty levels'):
| | Beginner | Veteran | Expert |
|---|---|---|---|
| your hit roll | 5 points better | normal | normal |
| their hit roll | 5 points worse | normal | normal |
| experience | +10% (the 10/9 page, Level and Experience) | normal | normal |
| the late-game crisis | 5 days later | normal | normal |
| enemy groups | easier groups later | normal | 'harder enemy groups appear sooner' |
| enemy equipment and stats | the same on every level ('Enemies will carry the same equipment with the same stats on all difficulty levels') | | |
GROK_60 (unverified, PASSED FILTER): "Combat difficulty, set at the start, raises both the count and the tier. Higher tier means more leaders and
fewer thugs." Its modders name the Expert party step 1.15 (Limit Break and Souls Mode push it 'from 1.15 to 1.5', DIFFICULTY's s3).
ECONOMIC DIFFICULTY (the same page and the Game Guide table): contract pay 100 / 100 / 90%; selling prices 100 / 100 / 90%; carry caps (tools,
ammunition, medicine) 200/500/150 on Beginner, 150/300/100 after; deserters take their gear on Expert. Starting funds are their own triple.
NOT A LEVEL'S: the roster-strength contract math (0.94 x (strength/100)^0.89, held to 0.75..5), the champions' own chances (+5% on a
three-skull contract, -1% before day 90), the day gates of each kind.
WHAT THE STEPS FEEL LIKE: Beginner to Veteran is a 10-point swing in the duel (yours 5 better, theirs 5 worse); Veteran to Expert is a 15%
bigger, slightly better group a little sooner. Two small steps on DIFFERENT levers. That is the 'tiny tweaks' he felt.

## 2. OURS, BESIDE THEM (after TUNING 2's rule 370 round, main e412573a5)
| lever | NEW HERE | SEEN IT | OUTLIVED IT | Battle Brothers (Beginner / Veteran / Expert) |
|---|---|---|---|---|
| crews (party_math difficulty_count_mult) | 1 | 1 | 1.15 | easier later / 1 / harder sooner (1.15 by its modders) |
| your aim, theirs (ours.json hit_roll_shift) | +5 / -5 | +5 / -5 | 0 | +5 / -5, 0, 0 |
| how soon a strong company meets the late men (job_bb.dress_ahead) | about day 28 | about day 22 | about day 18 | 'harder groups appear sooner' on Expert |
| the tier's days on top (enemy_tiers.difficulty_days) | 0 | 0 | 8 | (the same 'sooner') |
| experience | the same | the same | the same | +10% on Beginner |
| contract pay, prices | the same | the same | the same | 90% on Expert (economic) |
| the crisis | n/a | n/a | n/a | 5 days later on Beginner |
THE SAME FIGHT (banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_AFTER_11_3_26.json, the fresh company, nine men, day 20):
| | everyday job | hardest job |
|---|---|---|
| NEW HERE | 6 of them, won 20 of 20, a man down every other fight | 9 of them, won 19 of 20, about a man down |
| SEEN IT | 6 of them, won 19 of 20, about a man down | 9 of them, won 18 of 20, about a man down |
| OUTLIVED IT | 7 of them, won 18 of 20, about a man down | 9 of them, won 13 of 20, about 4 men down |
Pooled over the three companies at days 10 and 20 (the gate's sample): the hardest job won 91 / 97 / 62 in 100 by level, men struck down 1.22 /
0.92 / 3.16. NEW HERE and SEEN IT are one small step apart (NEW HERE costs a little MORE on its hardest job, because it now meets the full crew
and COMBAT 7's breaking enemy softened SEEN IT this hour); SEEN IT to OUTLIVED IT is the cliff (97 -> 62).
'TWICE AS MANY ENEMIES': no level of ours sends twice the men (1 / 1 / 1.15); what he felt as 'more men' is the cliff's three levers at once.

## 3. THE FINDING THAT PROVES US WRONG
TUNING 2's own rule 370 record said 'Battle Brothers' Beginner never shrinks a crew'. The wiki does not say that: it says Beginner brings easier
groups later and Expert harder groups sooner, and GROK_60 reads both as count and tier; its quote about equipment and stats is about what a man
carries, not how many come. CORRECTED in that record (s3 lever 2, s4 item 1): NEW HERE now meets the full crew ON PURPOSE, a small step harder
than Battle Brothers' Beginner, because his newest words are that even Battle Brothers' easiest bit and ours did not (rule 370(1)).

## 4. THE RE-SET, AND WHAT IS PINNED
SHIPPED THIS ROUND (rule 370's round, measured there): NEW HERE's crews 0.85 -> 1 (the lever that made the easiest a walk on top of its aim); how
soon the late men come stepped 2.5 / 3.5 / 4.5 (was 2.5 / 3 / 4) so the three levels stay apart on that lever.
THE SPREAD BATTLE BROTHERS WOULD MAKE, NOT SHIPPED: SEEN IT's aim 5 -> 0 (Battle Brothers' Veteran) and OUTLIVED IT's tier days 8 -> about 4 and
crews 1.15 kept, so each step moves one or two levers, never three. MEASURED IN THE RULE 370 ROUND: SEEN IT at aim 0 drops WORLD's typical
company (most_jobs_fit_the_company_gate) to 10 to 50 in 100 on its day-20 two-skull job (it asks 60); and, computed, SEEN IT's crews 1.05 would turn its day-20
three-skull six into seven (it asks 30 or better, it reads 30): that gate pins SEEN IT until its tool climbs its men as the game does (rule
162(e)); then this spread ships in one round. OUTLIVED IT is not eased alone: easing the hardest level without the middle catching up would make
the levels closer by making the top softer, which he did not ask for.
NEEDS CODE (no number in our files is read per level): experience per level (Battle Brothers' +10% on Beginner: the fight reads one
experience.global_modifier), pay and prices per level (Battle Brothers' economic 90%: the map's pay and the stall read no level), the crisis
(no crisis clock yet).

## 5. THE GATE: THE FIGHT IS CLOSE, leg D1 (records/target/bb/party_math.json closeness_bands.steps, steps_why)
- crews: every neighbour within 0.15 (1 / 1 / 1.15 / 1.3: steps 0, 0.15, 0.15), SEEN IT the math (1);
- aim: every neighbour within 5 points (5 / 5 / 0 / -5);
- no easier level harder than the next on crews, aim, the late men's pace (2.5 / 3.5 / 4.5) or the tier's days (0 / 0 / 8).

## 6. THE VOTE CARD: tuning-the-same-fight-three-levels-11-3 (records/target/three_levels_11_3/card.webp, tools/bohemia_tuning_three_levels_card.js)
The same nine men on day 20 on the three levels, the everyday job and the hardest job, in his words; what each level moves under its name; the
one line on the cliff. You see it in the VOTE tab.

## ROUTED
- WORLD: tools/bohemia_world_most_jobs_fit.js's men climb as the game climbs them (rule 162(e)); then TUNING ships s4's spread.
- COMBAT 7: experience per level (a per-level multiplier read beside experience.global_modifier), if he wants Battle Brothers' +10%.
- ECONOMY: pay and prices per level (Battle Brothers' economic difficulty, 90% on the top level), if he wants the money to step too.
[bb the step: Battle Brothers moves the aim between easy and middle and the groups between middle and hard; two small steps on different levers]
[analog horror: nobody tells you which level you are on; the road just remembers how many of them came last time]
