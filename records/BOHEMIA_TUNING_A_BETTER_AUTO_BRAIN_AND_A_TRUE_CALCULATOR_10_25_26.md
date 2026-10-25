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
What the rules give a man on a roof (all live, rules.json hit_chance.height): +10 to hit down, -10 a level for anyone
shooting up at him, +1 tile of range a level, and no club reaches him from the street (melee_max_height_gap 1). Over a fight
of five or six rounds that is worth far more than the one shot lost walking up: the brain weighs one turn, never the fight.

### 1d. THE SCREEN (rule 176(f): 'the melee men screen the shooters')

Their melee swings landed where: 27,265 in 600 fights, 16,993 of them on our gunmen. Per man-round a gunman took 0.73 melee
swings and a melee man 0.98: our shooters are hit in melee three quarters as often as our front. Nothing in the crew brain
puts a melee man BETWEEN a foe and a shooter; 'shield_the_backline' only stops a shooter walking AHEAD of the front.
(Early kit is guns first, rule 120: a company of mostly gunmen has few men to screen with; the number is for the brain's
choices, not a law of the rules.)
