# TUNING: A BETTER AUTO BRAIN AND A TRUE CALCULATOR (rule 176(g), research only, 10/25)

THE PAGE FOR COMBAT (rule 176(h): COMBAT builds the one brain from it, for AUTO, the enemy and the calculator).
Research only (rule 38g): no game code touched. The bench is `tools/bohemia_tuning_auto_brain.js` (a research instrument,
not a gate); the numbers are in `banks/BOHEMIA_TUNING_AUTO_BRAIN_10_25_26.json` (draft:true, nothing in the game reads it).
Written in pieces, each committed as it landed.

HIS WORDS (records/BOHEMIA_PAOLO_AUTO_NEVER_WASTES_A_TURN_AND_THE_ODDS_ARE_TRUE_10_25_26.md):
'a guy very low on health, instead of trying to kill the enemy, walks two tiles away and then two tiles back in front of the
enemy... once I start doubting the decisions AUTO takes, I start doubting the calculator.' And: 'if buildings two or three
storeys are supposed to be advantageous for people with guns, why isn't the first thing they do finding the nearest one and
firing... big brain research on how to be a better auto combat system and have a better auto combat calculator, but it's
pretty dog shit right now.'

---------------------------------------------------------------------------------------------------------------------------

## 1. WHAT OUR AUTO DOES WRONG TODAY, MEASURED

HOW: 600 fights of the live fight file (slices/BOHEMIA_FIGHT.html, its own rules and data, no hooks), AUTO on both sides,
played headless through the whole-grid engine. Fight k plays seed 9000+k on a district and a map cell the map could hand
(all 78 districts in WORLD's list, cycled), a company of 3, 6 or 12 in each of the three gear stages (early kit, the town
shelf, the city shelf), against brigands, the kids, the machines or the heavies, at 0.6 to 1.6 times the map's own count.
We won 397 of 600. Every man's every round is written down: where he stood when his turn began, every step he took and
why the brain took it (read off the flags it sets: the step out of melee, the climb, the flight, the kite), every swing,
reload and skill, where he ended. 33,779 man-rounds for us, 34,875 for them.

### 1a. THE DANCE (rule 176(a)(b))

| what a man did in his turn (our AUTO, 600 fights) | count | per fight |
|---|---|---|
| spent steps and ended on the tile he began | 914 (8.5% of the turns he moved) | 1.5 |
| ... and did NOTHING else that turn (no swing, reload, skill or swap): a WASTED TURN | **325** | 0.54 |
| ... of those 325, a man who COULD NOT ACT anyway: nothing to shoot (out of rounds, or unloaded with no reload) | 197 | |
| ... of those 325, a man OUT OF BREATH (one more swing would pass his most fatigue) | 105 | |
| ... of those 325, a man who could act | 23 | |
| ... of those 325, hurt under half his hitpoints | 31 | |
| off one round and back the next (A to B, then B to A) | 460 | 0.77 |
| ... with no swing in either round (the dance he saw) | **58** (27 nothing to shoot, 11 out of breath, 20 could act) | 0.10 |
| left a fight (a foe beside him at the start, none at the end) and walked back into one the next round | 71 (15 of them a morale flight: Fleeing, then rallied) | 0.12 |
| began his turn with a foe he could strike (in reach, AP, breath, seen) | 16,794 | |
| ... and never swung | 257 (1.5%): reloaded 118, stood 66, used a skill 33, walked 40 | |
| FREE SWINGS TAKEN walking out of a foe's reach (zone of control) | **4,261** | **7.1** |
| (their brain, the same count) | 688 | 1.1 |

THE ENEMY'S brain wastes almost nothing (5 wasted turns in 600 fights); its off-and-backs are the kids' throw-and-step-back
(the kite, by design) and line men re-closing after a push.

### 1b. WHY: THREE HOLES IN ONE FUNCTION (aiStep, slices/BOHEMIA_FIGHT.html line 2276)

Replayed step by step (seed 9003 man c2 round 4, seed 9023 man c11 round 8):

1. THE MOVE NEVER ASKS 'CAN I ACT FROM THERE'. The move scorer (line 2343) counts a tile as good when a foe is in range
   from it and the AP to strike is left (line 2348: score = the hit cap, 95, plus AP left). It never asks for BREATH, for
   ROUNDS, or for a LOADED gun, which `canStrike` (line 1721) does ask. So a man who cannot strike walks to a tile from which
   he still cannot strike. Seed 9023 c11: a thrower with 0 javelins left walks 4,10 -> 3,10 -> 3,11 -> 4,10, three rounds in
   a row, never throwing. Seed 9003 c2: a pistol man at 45 of 45 fatigue, two brigands beside him, tries to walk out, is held
   twice by their free swings, steps out to 7,6, then (no foe he can strike from 7,6: he is winded) the 'go toward the
   fight' branch walks him straight back to 8,6, beside the same two brigands, with 1 AP left. THAT IS THE DANCE HE SAW:
   'a guy very low on health... uses stamina points to walk two tiles away and two tiles back in front of the enemy'.
   93% of the wasted turns (302 of 325) are a man who could not act and was walked anyway.
2. STAYING PUT IS NEVER A CHOICE. The tile he stands on is skipped (line 2339), and any other tile with a foe in reach
   scores at least 95 and is walked to (line 2373: move if closer OR score >= 95). So a man on a fine tile with a foe in
   reach, who cannot or need not swing, must walk somewhere.
3. ONE ACTION AT A TIME, RE-DECIDED. aiStep does one act and returns; the next call scores the board again from the new tile
   with less AP. Nothing remembers where he came from or what he meant to do, so the best tile from B is often A (the step's
   AP left changes the sum). Battle Brothers had the same bug and fixed it: 'Fixed issue with ranged AI sometimes moving back
   and forth instead of attacking.' (bb_all/2113_Update 1.2.0.23.txt).

AND THE FREE SWINGS: walking out of a ring is never priced. The move scorer adds nothing for the free swings the walk will
draw (moveTo rolls them, line 1406), and the 'stand, do not walk out through his swing' guard (line 2323) covers only a man
with a melee weapon. A gunman (every gun carries its club at one) in a ring, too winded to club, walks out through it: our
men eat 7.1 free swings a fight, theirs 1.1. Battle Brothers: 'Changed AI of more intelligent opponents to be less prone to
gift the player free attacks' (bb_all/1415_News and Dev Blogs.txt, 0.7.0.10).

AND THE RELOAD BEFORE THE SHOT: 118 times a man with a loaded gun and a foe in his sights reloaded instead of shooting: the
reload line (2314) comes before the shot in aiStep, so a magazine gun that is not full tops up first. A turn's shot is lost.

### 1c. THE ROOF (rule 176(f): 'why isn't the first thing they do finding the nearest one and firing')

| our gunmen (anyone with a ranged weapon: guns, bows, crossbows, throwers), 600 fights | count | share |
|---|---|---|
| gunmen | 2,796 | |
| a two or three storey roof on the board | 1,625 | 58% |
| ... how far, at the start | mean 2.5 steps | |
| could walk onto a roof within one turn at some point in the fight | 1,171 | |
| ... and EVER stood on one | **452** | **39%** |
| met the brain's own climb test at some point (reach the roof AND still shoot from it this turn, outside a ring) | 481 | |
| ... and took it | 400 | 83% |
| gun turns | 23,315 | |
| ... with the climb test open that turn | 935 | 4% |
| ... climbed that turn | 643 | 69% |
| THEIR gunmen who could walk onto a roof within a turn / ever did | 550 / 122 | 22% |

WHY: the climb (line 2258) is real but NARROW: it fires only when the roof is reachable AND a foe is already in range from
it AND the AP to shoot is left (line 2266) the SAME turn. A roof 2.5 steps off costs 5 AP of walking plus 1 AP a storey
(ap.move_cost.height_change_extra), so a man with 9 AP arrives with 2, under a shot's 3 or 4: the test fails on the turn he
could have walked there, and nothing walks him there to shoot NEXT turn. Outside the climb, a roof is worth +10 to a
melee man and +20 to a gunman (heightGain, line 2232) while every step toward the fight is worth 95 (line 2357: -hunt x 95):
one step closer beats any roof. Their brigand shooters ('backline') have no high-ground switch at all.
MEASURED (the first 150 fights again, every turn a gunman of ours stood below a roof he could walk onto that turn: 1,320):

| why he did not climb | turns | share |
|---|---|---|
| no foe in range from any roof he could reach (yet: he would shoot from it NEXT turn) | 600 | 45% |
| a foe in range from the roof, but no AP left to shoot after the climb (he would shoot NEXT turn) | 496 | 38% |
| the climb test was met (he climbs, as above, about 7 times in 10) | 190 | 14% |
| the only roofs were ahead of his own front man (shield_the_backline) | 33 | 3% |
| the only roofs were inside a foe's ring | 1 | 0% |

83% of the missed roofs fail on ONE thing: the brain counts only THIS turn's shot. A man who climbs now and shoots from the
roof for the rest of the fight is never weighed.
What the rules give a man on a roof (all live, rules.json hit_chance.height): +10 to hit down, -10 a level for anyone
shooting up at him, +1 tile of range a level, and no club reaches him from the street (melee_max_height_gap 1). Over a fight
of five or six rounds that is worth far more than the one shot lost walking up: the brain weighs one turn, never the fight.

### 1d. THE SCREEN (rule 176(f): 'the melee men screen the shooters')

Their melee swings landed where: 27,265 in 600 fights, 16,993 of them on our gunmen. Per man-round a gunman took 0.73 melee
swings and a melee man 0.98: our shooters are hit in melee three quarters as often as our front. Nothing in the crew brain
puts a melee man BETWEEN a foe and a shooter; 'shield_the_backline' only stops a shooter walking AHEAD of the front.
(Early kit is guns first, rule 120: a company of mostly gunmen has few men to screen with; the number is for the brain's
choices, not a law of the rules.)

---------------------------------------------------------------------------------------------------------------------------

## 2. BATTLE BROTHERS' AI FIRST (rule 33; the library: reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/)

The library never prints the AI's machinery: no list of scored behaviours, no formula. It shows what the scores DO, in the
developers' own words and the changelogs. Every quote below was read on its page. Grok ask 42 (Battle Brothers' AI, the dev
blogs) has NOT landed as this page is written (the only 'ask 42' file in the library, GROK_ASK_42_MORALE_2026_10_24.md, is a
different ask, morale; the number is used twice); fold it in when it lands.

| question | what Battle Brothers does | the words, the page |
|---|---|---|
| how a man picks his act | every act competes, moving included, not just the swing | 'The AI also takes into account all other things it can do like moving to a better position and so on.' (0626_Developer Posts) |
| weights are numbers on acts | a choice's likelihood is multiplied by what is around it; a hazard is one constant | 'The likelihood of going for the shield is increased by 1.25^n, with n being the number of allies surrounding the target' and 'a single constant that determines to what lengths it will go to avoid running into spearwalls' (0626) |
| behaviours are separate pieces | a kind with no 'flee' piece cannot flee | 'Fleeing hexen and alps don't actually flee, because their AI has no "flee" behavior.' (0321_Bugs) |
| engage or hold | by the range balance and the count it can SEE | 'Changed AI to better handle range advantages and disadvantages when deciding whether to engage or hold a defensive position.' (1415_News and Dev Blogs, 0.7.0.10); Brigands: 'if they think they have it, they will stand their ground and shoot at you' (0299_Brigands); 'a bandit wouldn't rush to attack 6-8 men on his own' (0626) |
| it never cheats | it scores only what its side can see | 'the AI can not target anyone it can not see.' and 'No AI cheating in this game and that is very important to us.' (0626) |
| fair to the player | the enemy spreads its blows | 'The AI will not stack all its attacks on the weakest target as this would be unfair and really hard to counter.' (0626) |
| protect a friend | guard the soft ones, rotate a friend out of danger | 'They'll be better at protecting their vulnerable units, changing between offensive and defensive strategies, and identifying bait from the player.' (0583_Dev Blog 105); Footmen 'can Rotate with allies to save them from danger' (0801_Footman); the line-of-fire penalty raised so 'protecting vulnerable characters with good positioning is rewarded more' (1415, Beta 0.9.0.21) |
| take height | the high ground, shooters first | 'It is always advantageous to have the high ground in any battle and the AI will try to occupy the high ground whenever possible, especially their ranged units.' (0424_Combat Mechanics); 'Ranged weapons gain an additional hex of range for each level of height' and climbing costs '+1 to AP cost per tile' (0424); the bonus above is flat +10, the penalty below -10 a level (1002_Hit Chance) |
| never arrive with nothing | do not walk into reach with no AP to swing | 'Changed AI of more intelligent opponents to be less prone to gift the player free attacks by charging without any action points left on arrival.' (1415, 0.7.0.10) |
| never waste AP | wait rather than waste | 'Changed AI to make use of the wait function in more situations as to waste less action points.' (1415, 0.7.0.10) |
| THE DANCE | a bug, fixed | 'Fixed issue with ranged AI sometimes moving back and forth instead of attacking.' (2113_Update 1.2.0.23) |
| hazards on the floor | a tile with a bad effect is avoided | 'Fixed AI not properly avoiding tiles with negatives effects, such as fire' (2149_Update 1.5.0.13) |
| a hurt man | he does NOT step back by choice; morale decides. A check on 15 or more hitpoints lost (worse the more he is missing), a friend's death, being surrounded; each failed check one state down (Steady, Wavering, Breaking, Fleeing; skills x0.9, x0.8, x0.7); a fleeing man 'can't fight or use skills' and 'can rally on their own when not adjacent to enemies' | 1316_Morale; Grok's morale page (GROK_ASK_42_MORALE_2026_10_24.md, PASSED FILTER) agrees |
| leaving the battle | only the last few, by the count | 'Whether an AI combatant retreats or not depends on a few factors, such as how many of his allies are still with him, how many have already fallen, and how many men the player still has.' and 'the AI will not attempt to flee a battle from the beginning' (1415) |
| the same brain at every difficulty | difficulty is numbers, never a smarter brain | 'AI behavior are the same for all difficulty levels.' (0626) |
| a prediction | Battle Brothers REFUSED a formula: it cannot predict a fight | 'No matter how we shuffle numbers with the current system, there's no way we'll arrive at a satisfying level of prediction, so we're going another way.' (1415, Progress Update) and on auto-resolve: 'What if you auto-resolve and your favourite brother dies in that fight against a pretty easy opponent? Then you will probably reload' (0626) |
| how an archer picks his spot | THE LIBRARY DOES NOT SAY; players saw Nomad Archers 'position themselves directly behind advancing melee allies' (1437_Nomad Archer) | |

WHAT THIS MEANS FOR US (Battle Brothers' way first, then his rulings over it):
1. ONE SCORE FOR EVERY ACT, MOVING INCLUDED, AND STAYING PUT IS AN ACT. Their brain weighs 'moving to a better position'
   against the swing; ours skips the tile it stands on (1b, hole 2).
2. NEVER ARRIVE WITH NOTHING, NEVER DANCE: two of their own fixes are our two holes (1b): a man walks only to a tile from
   which he can DO something this turn or next, and the back-and-forth they fixed in 1.2.0.23 is the dance he saw.
3. THE HURT MAN, BATTLE BROTHERS' WAY: he keeps fighting until his MORALE breaks; the step back is morale's, not his
   choice, and a friend rotating him out is an ability (rule 180: never on AUTO). So for AUTO (rule 176(b)): a hurt man who
   can finish the man in reach strikes; one who cannot act steps back ONCE, only if the step costs no free swing, and stays
   back; otherwise he holds and ends his turn. The measured dance (1a) is mostly NOT morale: 15 of 71 leave-and-returns were
   a flight and rally; 302 of 325 wasted turns were men who could not act and were walked.
4. HEIGHT FOR THE SHOOTERS, OVER MORE THAN ONE TURN: 'whenever possible, especially their ranged units' is a standing want,
   not a one-turn test.
5. FAIR ONE WAY, FOCUSED THE OTHER: the ENEMY keeps Battle Brothers' spread (fair to him); OUR AUTO focuses (rule 180(h),
   his words: 'the man the team can kill this turn'). One brain, one switch per side.
6. WAIT: their AI waits to save AP. Rule 180(g) reads every button but move, fire and the melee attack as an ability, so
   AUTO does not wait; it ends its turn. (Recover, Rally, Taunt, Adrenaline, Indomitable, Footwork and the bag swap, all
   used by the crew brain today, go the same way for our side: measured 33 turns in 600 fights where a skill took the place
   of a swing in reach.)
7. THE CALCULATOR IS THE ONLY HONEST WAY TO A NUMBER: Battle Brothers gave up on a strength formula because it cannot
   predict; ours plays the fight out with the same brain. That is right, and it must be checked (part 4).

---------------------------------------------------------------------------------------------------------------------------

## 3. THE CRAFT OF TACTICS AI (rule 6: cited by author, talk, book and paper; no game named)

Citations checked by search and publisher listings; 'second-hand' marks a chapter whose contents were read in someone
else's summary, not on its own page (gameaipro.com and GDC Vault were not reachable from here).

### 3a. EVERY ACT SCORED WITH WEIGHTS (utility)
Each candidate act is scored by several CONSIDERATIONS; each reads one input, clamps it to 0..1 between two bookends, runs it
through a response curve, and the scores are MULTIPLIED, so any consideration at zero VETOES the act; the agent takes the top
score (or draws among the near-top by weight). Multiplying many sinks the score (nine at 0.9 give 0.39); the compensation
for N considerations is s' = s + (1 - s)(1 - 1/N)s (in code credited to Mark; not seen in his own slides).
- Dave Mark, Behavioral Mathematics for Game AI, Course Technology, 2009 (ISBN 978-1-58450-684-3).
- Kevin Dill and Dave Mark, 'Improving AI Decision Modeling Through Utility Theory', GDC AI Summit 2010 (gdcvault.com/play/1012410).
- Dave Mark and Mike Lewis, 'Building a Better Centaur: AI at Massive Scale', GDC AI Summit 2015 (gdcvault.com/play/1021848).
- Kevin Dill, 'Dual-Utility Reasoning', Game AI Pro 2, ch. 3, CRC Press, 2015 (each option has a RANK and a WEIGHT; only the
  top-ranked options stay in play; second-hand).
- Mike Lewis, 'Choosing Effective Utility-Based Considerations', Game AI Pro 3, ch. 13, 2017 (second-hand).
- David 'Rez' Graham, 'An Introduction to Utility Theory', Game AI Pro, ch. 9, 2013.
FOR US: our move score is already a weighted sum (95 for 'a foe in range', -95 a step from the fight, +1 an AP left, +5 a
friend beside, +20 height), but its terms are not in one currency, and the one consideration that must veto, CAN HE ACT
FROM THERE, is missing (1b, hole 1). In a product it is a factor of 0; in our sum it is a hard filter before the sum.

### 3b. MAPS OF DANGER AND VALUE OVER THE BOARD (influence maps)
Each unit stamps a value on the grid that fades with distance or, better, with PATH COST (walls block it); layers (enemy
threat, ally reach) are added and multiplied into one 'working map' per question, and a position's score is
S(x) = value(x) - w x danger(x).
- Paul Tozour, 'Influence Mapping', Game Programming Gems 2, Charles River Media, 2001, pp. 287-297.
- Dave Mark, 'Modular Tactical Influence Maps', Game AI Pro 2, ch. 30, 2015 (templates and working maps; second-hand).
- Alex J. Champandard, 'The Mechanics of Influence Mapping: Representation, Algorithm and Parameters', AiGameDev.com, 2011
  (read in full; the spread follows graph edges, so distance is path cost).
- Damian Isla, 'Probabilistic Target Tracking and Search Using Occupancy Maps', AI Game Programming Wisdom 3, 2006, pp. 379-388.
FOR US: one DANGER map a round per side (every tile: the damage the foes who can reach or shoot it next round expect to deal
a man standing there, with their AP, their hit chance at that tile counting height and cover, and their weapon) and one
VALUE map per man (every tile he can reach: the best damage he can deal from it with the AP and breath left). Our board is
20 x 15 = 300 tiles and a side is at most about 40 men: a few thousand cheap sums a round.

### 3c. PICKING THE TILE (tactical position selection)
Generate the candidate tiles, drop the bad ones with cheap yes/no FILTERS first, then score the rest with weighted tests
(cover from each threat, distance band to the target, line of sight, height, spacing, never in a friend's line of fire):
S = (product of the pass/fail filters) x (sum of weighted normalised scores).
- Matthew Jack, 'Tactical Position Selection: An Architecture and Query Language', Game AI Pro, ch. 26, 2013 (second-hand).
- Mieszko Zielinski, 'Asking the Environment Smart Questions', Game AI Pro, ch. 33, 2013.
- Matthew Jack and Mika Vehkala, 'Spaces in the Sandbox: Tactical Awareness in Open World Games', GDC AI Summit 2013.
- Eric Johnson, 'Taming Spatial Queries: Tips for Natural Position Selection', Game AI Pro Online Edition 2021, ch. 5.
FOR US: the candidates are the reach field the brain already builds (reach()); the filters are CAN ACT FROM THERE (or next
turn), NOT A WALK THROUGH A RING unless the act is worth the free swings, NOT AHEAD OF THE LINE for a shooter; the score is
section 5's.

### 3d. A TURN OF LOOKAHEAD
Score each of my acts against the enemy's best reply, averaged over the dice (expectimax; Ballard's *-minimax prunes trees
with chance nodes); for big fights, search over a small PORTFOLIO of scripted behaviours rather than raw moves; or sample
the future (Monte Carlo tree search).
- Bruce W. Ballard, 'The *-Minimax Search Procedure for Trees Containing Chance Nodes', Artificial Intelligence 21(3), 1983.
- Levente Kocsis and Csaba Szepesvari, 'Bandit Based Monte-Carlo Planning', ECML 2006.
- Cameron Browne et al., 'A Survey of Monte Carlo Tree Search Methods', IEEE TCIAIG 4(1), 2012.
- David Churchill, Abdallah Saffidine and Michael Buro, 'Fast Heuristic Search for RTS Game Combat Scenarios', AIIDE 2012
  (scripts order the moves, playouts score the leaves; the no-overkill attack value: damage over HP left after the team's
  committed damage).
- David Churchill and Michael Buro, IEEE CIG 2013 (portfolio greedy search; its title names a game, left out): beat
  alpha-beta and UCT in fights of up to 50 against 50, inside 40 ms.
- Pavel Smejkal and Jakub Gemrot, AIIDE 2018 (title names a game, left out): in turn-based combat on tiles, a Monte Carlo
  search that values hitpoints beat portfolio search in small and medium fights, and no method won at every size.
- Gijs-Jan Roelofs, 'Pitfalls and Solutions When Using Monte-Carlo Tree Search for Strategy and Tactical Games', Game AI
  Pro 3, ch. 28, 2017.
FOR US: in PLAY the danger map is the turn of lookahead (the enemy's next round, summed, not searched): cheap, on the phone,
every man every turn. The CALCULATOR and COMBAT'S GATE can afford playouts: the gate's 'exhaustive search of the turn'
(rule 180(h)) is a portfolio of the man's candidate plans each scored by playouts on common dice (part 4).

### 3e. STOPPING THE DANCE (oscillation)
- MOMENTUM: the last-chosen behaviour gets a flat +25% on the next decision, 'a bit of hysteresis' (the Curvature utility
  tool's wiki, github.com/apoch/curvature/wiki, read).
- A SWITCH THRESHOLD: change only when the new choice beats the current one by 10 to 20% (Johnson 2021, above; second-hand).
- COMMIT, INERTIA, COOLDOWN, REPEAT PENALTY: Kevin Dill, Eugene Ray Pursel, Pat Garrity and Gino Fragomeni, 'Design
  Patterns for the Configuration of Utility-Based AI', I/ITSEC 2012, paper 12146 (commit: an option keeps its rank until it
  finishes; inertia: its rank stays just under the rank it won at; repeat penalty: its rank drops each use; second-hand).
- A COST FOR UNDOING LAST TURN'S MOVE: no source found; ours is the repeat penalty applied to the tile he left (our
  extrapolation, named as such).
FOR US, three fixes in order of what they kill: (1) ONE PLAN A TURN, chosen once at the start and carried out whole (commit:
kills hole 3, the re-decision after every step); (2) STAYING PUT IS A PLAN and wins ties (inertia: one step's AP, kills hole
2); (3) THE UNDO RULE: a plan that ends on the tile he left last turn, with no act in either turn, is refused (the repeat
penalty, kills the two-round dance).

### 3f. THE TEAM (screening, focus)
- William van der Sterren, 'Squad Tactics: Team AI and Emergent Maneuvers' and 'Squad Tactics: Planned Maneuvers', AI Game
  Programming Wisdom, Charles River Media, 2002; and 'Hierarchical Plan-Space Planning for Multi-Unit Combat Maneuvers',
  Game AI Pro, ch. 13, 2013.
- Alex Champandard, Philip Dunstan and Matthew Jack, 'Believable Tactics for Squad AI', GDC AI Summit 2012.
- Michael Dawe, 'Beyond the Kung-Fu Circle: A Flexible System for Managing NPC Attacks', Game AI Pro, ch. 28, 2013 (attack
  slots: how many may attack one target at once).
- F. W. Lanchester, Aircraft in Warfare: The Dawn of the Fourth Arm, Constable, 1916: the square law (dA/dt = -bB,
  dB/dt = -aA): every early kill removes that enemy's damage for EVERY turn after it. This is why FOCUS wins (rule 180(h))
  and why Battle Brothers spreads its enemy's blows on purpose to be fair (part 2).
FOR US: focus is the team's no-overkill value (damage over the hitpoints LEFT after what the men before him this round
already put in); the screen is a melee man's tile between a foe and a shooter (the foe's path to the shooter runs through his
ring), scored as the damage it saves the shooter.

---------------------------------------------------------------------------------------------------------------------------

## 4. THE CALCULATOR (rule 176(c)(d), rule 180(d))

WHAT IT IS TODAY (slices/BOHEMIA_FIGHT.html line 3763 on): a second copy of the same rules (the same aiStep: THE SAME BRAIN,
already) is handed the frozen board and plays it out on AUTO for BOTH sides, ODDS_RUNS = 24 times, in a worker; the colour
goes on the tin after ODDS_FIRST = 8 runs and is refined to 24; a run stops at ODDS_STEPS = 6,000 brain steps. Each run is
WORTH (oddsRunValue, rule 144(e)(f)) 1 for a win with nobody down, ours.odds_colour.down_value (0.5) times the share still
standing for a win with men down and none dead, and 0 for a loss, a death, or a run that did not end. The hidden number is
the mean worth; green at 0.8 and over ('turn'), the beat's glow at 0.92.

### 4a. HOW MANY RUNS FOR A STEADY NUMBER (the arithmetic; the citations are in 3d and below)
A read of n runs has a standard error of root(p(1-p)/n); the 95% margin is 1.96 of those.

| runs | margin at a true 50 | at a true 80 | at a true 90 |
|---|---|---|---|
| 8 (the first colour today) | +-35 points | +-28 | +-21 |
| 24 (the full read today) | +-20 | +-16 | +-12 |
| 64 | +-12 | +-10 | +-7 |
| 250 | +-6 | +-5 | +-4 |

Runs for a margin E at 95%: n = 1.96^2 p(1-p) / E^2: +-5 points takes 385 runs at 50 and 246 at 80; +-10 takes 97 and 62.
WHAT THE TIN DOES WRONG FROM NOISE ALONE (binomial, the read's own worth taken as a win rate):

| the true chance | read at 8 runs | read at 24 | read at 64 |
|---|---|---|---|
| 70 (should be red) reads GREEN | 26 in 100 | 11 in 100 | 3 in 100 |
| 85 (should be green) reads RED | 34 in 100 | 29 in 100 | 15 in 100 |
| 90 (should be green) reads RED | 19 in 100 | 9 in 100 | 1 in 100 |

So even with a perfect brain, today's first colour is wrong about one time in four near the line. Eight clean wins out of
eight cannot even prove the fight is over 80: the Wilson interval (Wilson 1927; Brown, Cai and DasGupta, Statistical
Science 16(2), 2001) puts its floor at 68; it takes 16 clean wins in 16 to clear 80 at 95%.
- E. B. Wilson, 'Probable Inference, the Law of Succession, and Statistical Inference', JASA 22(158), 1927.
- Abraham Wald, 'Sequential Tests of Statistical Hypotheses', Annals of Mathematical Statistics 16(2), 1945 (stop the
  runs as soon as the side of the line is settled).
- Paul Glasserman and David D. Yao, 'Some Guidelines and Guarantees for Common Random Numbers', Management Science 38(6),
  1992 (the same dice for every read, so two reads differ by the board, not the luck).
- Glenn W. Brier, 'Verification of Forecasts Expressed in Terms of Probability', Monthly Weather Review 78(1), 1950, and
  Allan H. Murphy, 'A New Vector Partition of the Probability Score', J. Applied Meteorology 12, 1973 (the score of a
  forecast against what happened; always saying 50 scores 0.25).
- Mahdi Pakdaman Naeini, Gregory Cooper and Milos Hauskrecht, AAAI 2015, and Chuan Guo et al., 'On Calibration of Modern
  Neural Networks', ICML 2017 (the reliability table: forecasts in bands, each band's mean forecast against its rate).

---------------------------------------------------------------------------------------------------------------------------

## 5. THE ONE BRAIN FOR COMBAT, AND ITS WEIGHTS (rule 176(h), rule 180; the first table, section H of the one numbers table)

A FIRST TABLE, NOT A FINISH LINE (rule 178): every weight below is re-tuned when perks, gear, enemies or acts enter the
fight, and the calculator re-checked (TUNING [the odds keep up], standing).

### 5a. THE SHAPE: ONE PLAN A TURN, EVERY PLAN SCORED IN ONE CURRENCY
The same function for AUTO, the enemy and the calculator (one switch per side: focus or spread; abilities or not).
At the START of his turn the man lists his PLANS: every tile he can reach this turn, THE ONE HE STANDS ON INCLUDED, and at
each tile the act he could do there: strike a foe with his best-accuracy attack (gun or club or blade), reload to fire, or
nothing. He picks the best plan ONCE and carries it out whole (3e: commit). Every term is in ONE CURRENCY: EXPECTED
HITPOINTS (armour counted the way the rules split a blow), for his side (+) and against it (-), so a roof, a kill, a free
swing and a step can be weighed against each other without a hand-made scale.

HARD FILTERS FIRST (a plan that fails one is never scored; 3a's veto, 3c's filters):
- V1 CAN ACT: a plan with a strike needs everything canStrike asks from that tile with the AP left: breath, rounds, a
  loaded gun, range, sight (kills 1b hole 1: 93% of the wasted turns).
- V2 NO UNDO: a plan with no act that ends on the tile he left last turn, after a turn with no act, is refused (3e's repeat
  penalty; kills the two-round dance).
- V3 RULE 180 ON OUR SIDE: move, fire, strike; reload only to keep firing (never with a loaded shot on, 1b: 118 lost shots);
  no Recover, Rally, Taunt, Adrenaline, Indomitable, Footwork, bag swap, sweep, wait.
- V4 NEVER ARRIVE WITH NOTHING (Battle Brothers 0.7.0.10): a walk into a foe's reach with no AP left to strike is refused,
  except for the kinds that rush by nature (the beasts' 'rusher').
- V5 THE LINE (today's shield_the_backline, kept): a shooter never ends ahead of his own front man.

THE SCORE OF A PLAN (H rows below):
  S = DEAL + KILL + HOLD - lambda(hp) x DANGER - FREE + SCREEN + NEXT + STAY
- DEAL: chance to hit from that tile (the rules' own hitChance, height and cover in it) x mean damage; on OUR side times
  1.25^n for n of his friends who already struck that foe this round (focus, 180(h); Battle Brothers' own 1.25^n weight,
  bb_all/0626), on THEIRS divided by 1 + n (Battle Brothers' spread, fair to him).
- KILL: chance the act kills x the foe's THREAT (the damage he expects to deal a round) x brain.kill_rounds (Lanchester: a
  kill removes his damage for every round after; 3f).
- HOLD: what the tile is worth for the rounds he will stand on it (brain.hold_rounds): for a shooter, the +10 he gets
  shooting down and the -10 a level the foes get shooting up at him, times the shots that will be traded; a tile in cover
  the same way with the cover's numbers. THIS IS THE ROOF: the rules' own height numbers over two rounds, not +20.
- DANGER: the danger map (3b): the damage the foes who can reach or shoot that tile next round expect to deal there.
  lambda(hp) = brain.danger_weight x (1 + brain.hurt_weight x (1 - hp/hpMax)): a hurt man weighs danger up to twice.
- FREE: the free swings the walk draws out of a ring: each one's chance x damage, plus the chance he is HELD x the plan's
  own act (a held man loses it). Measured today: 7.1 free swings a fight, unpriced (1a).
- SCREEN: for a melee man, a tile in the ring a foe must cross to reach one of our shooters: the damage that foe would deal
  the shooter in a round (3f; 1d).
- NEXT: for a plan with no act this turn, the best DEAL he can make NEXT turn from that tile x brain.next_turn_discount
  (replaces today's 'a step closer is worth 95'); this is what walks a gunman to the nearest roof he can shoot from next
  turn, and what keeps a winded man where he will be able to swing.
- STAY: the plan that keeps him where he stands wins unless another beats it by brain.switch_margin (3e: inertia).
- Ties: the plan that spends less AP.

THE HURT MAN (rule 176(b)), in this shape: lambda doubles his fear, so: if he can KILL the man in reach, KILL wins (the
threat removed outweighs his danger); if he cannot act, V1 and FREE keep him from walking out through swings, and NEXT plus
DANGER pick ONE tile out of reach he can still fight from; V2 never lets him walk back the next turn for nothing.

### 5b. THE FIXES, TRIED ON THE SAME 600 FIGHTS (a research prototype, never the game)
To show what the fixes buy before COMBAT builds them, the bench splices six small changes into an IN-MEMORY copy of the live
rules (tools/bohemia_tuning_auto_brain.js, SPLICES; each anchor matched exactly once or it stops), for OUR side only (the
enemy keeps today's brain, so every change is AUTO's), on the same 600 seeded fights:
- TODAY: the live brain.
- NO ABILITIES (rule 180): no Recover, Rally, Taunt, Adrenaline, Indomitable, Footwork, bag swap or sweep for AUTO.
- PROTO: no abilities plus F1 can I act (a man who cannot strike does not walk; he stands), F2 staying is a plan (his tile
  scored with the rest, plus one step's AP), F3 no walk out of a ring (a man in reach who did not strike stays; a bow with no
  club may still step out once), F4 the shot before the reload, F5 the roof (a gunman with no shot where he stands climbs a
  roof he can reach even with no AP to shoot, and a roof is worth two steps, 190, in his move score), F6 focus (1.25^n).
- PROTO2: PROTO, but a man who cannot act stands only with a foe within two tiles (he still closes from farther off).
These are blunt hand splices, not section 5a's brain: they show the size of the holes, not the best weights.

| our AUTO, 600 fights | TODAY | NO ABILITIES | PROTO | PROTO2 |
|---|---|---|---|---|
| WON | **397** | 383 | **427** | 423 |
| lost | 185 | 202 | 139 | 143 |
| standoffs (60 rounds, nobody ends it) | 18 | 15 | 34 | 34 |
| rounds a fight | 11.3 | 11.0 | 14.2 | 14.2 |
| our men down a fight / dead | 2.41 / 0.42 | 2.58 / 0.42 | 2.22 / 0.41 | 2.24 / 0.39 |
| WASTED TURNS (steps, back on his tile, nothing done) | **325** | 343 | **0** | 0 |
| turns ending on the tile he began | 914 | 958 | 7 | 10 |
| off one round and back the next | 460 | 388 | 140 | 190 |
| ... with no swing in either | 58 | 87 | 45 | 59 |
| left a fight and walked back in | 71 | 71 | 26 | 41 |
| free swings taken a fight | **7.1** | 7.6 | **2.7** | 2.7 |
| a strike in reach never swung | 1.5% | 1.8% | 0.2% | 0.2% |
| gunmen who could walk onto a roof and ever stood on one | 39% | 38% | 46% | 45% |
| gun turns ending on a roof | 3,275 | 3,202 | **6,980** | 6,782 |
| melee swings taken a round: gunman / melee man (the screen) | 0.73 / 0.98 | 0.76 / 1.03 | 0.56 / 0.99 | 0.56 / 1.00 |

WHAT THIS SAYS:
1. RULE 180 COSTS AUTO ABOUT 2 POINTS (397 -> 383 won): the calculator's number drops by about that much when COMBAT takes
   the abilities away (180(d)); TUNING [the odds keep up] re-checks it then.
2. THE FIXES ARE WORTH MORE THAN THE ABILITIES: 383 -> 427, a quarter of the losses gone (202 -> 139), the wasted turn
   gone (325 -> 0), the free swings cut by 64%, twice the gun turns on a roof, the shooters hit in melee a quarter less.
3. THE DANCE THAT IS LEFT is mostly morale and the kids' kite: 45 off-and-backs with no swing remain, 12 of the 26
   leave-and-returns are a man who FLED and rallied (Battle Brothers' own morale, rule 33: kept), the rest a man pushed or
   waiting a turn; F2 alone (stay is a plan) does not stop the TWO-ROUND dance: that is V2's job (the undo rule), not
   tried here.
4. THE ROOF EXPOSES A RULES HOLE: the standoffs double (18 -> 34) and the fights run 26% longer (11.3 -> 14.2 rounds).
   Replayed, 32 of the 34 are our last men on a roof that no club can reach (melee_max_height_gap 1: a club reaches one
   storey; a one-tile roof two storeys up has no tile beside it at its own level), 25 of them against enemies with no gun
   left. Under today's brain those 34 fights were 24 LOSSES, 4 wins and 6 standoffs; with the roof they never end. Battle Brothers ends such a fight two ways (part 2): the AI's last few RETREAT when they see no chance, and
   a man's position is only worth what he can do from it. So, for COMBAT: (a) HOLD counts only while he can shoot from
   the roof (a man out of rounds and with no club reach has no reason to stay up); (b) the enemy's last men retreat by
   Battle Brothers' count (allies left, allies fallen, his men left; bb_all/1415); (c) the fight's own standoff end
   (nobody can harm anybody for N rounds) is a rule the fight lacks today (the bench's idle mark is 20 rounds, the whole
   grid's). And the fights must stay short (2 to 4 minutes routine, 9/29): PROTO2 shows closing from afar is not the cause.
5. ONE BRAIN STILL: the splices are side-switched only to measure AUTO's share; the gate (rule 176(h)) is the same brain for
   both sides with the two side switches (focus or spread, abilities or not).
