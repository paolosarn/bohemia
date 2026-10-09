# TUNING ROUND 7 -- [grok sources] MY SIX RESEARCH PAGES, CHECKED AGAINST THE WIKI (10/9/26)
# Row: VAMILY TUNING [grok sources] (rule 49b). Sources, each stamped PASSED FILTER: reference/library/grok/
# GROK_83 (fight length), GROK_115 (injury), GROK_60 (enemy math), GROK_21/22/119 (hit chance, prices by difficulty);
# and the wiki dump itself, reference/library/wiki PAGES_ALL (read directly: Permanent Injuries, Fatality,
# Combat Mechanics, Temporary Injuries). Cited as "source: Grok, unverified" where it comes through Grok, and as
# "wiki page, read here" where this lane opened the page. Every claim below that I wrote from memory is marked.

## 1. WHAT I HAD WRONG (the corrections, biggest first)

### 1a. DEATH: BATTLE BROTHERS KILLS TWO STRUCK-DOWN MEN IN THREE, NOT ONE IN FIVE  [wiki: Permanent Injuries, read here]
My death-rule page (9/30) said BB's survival "depends on how the fight ended; a won fight is kinder". THAT IS WRONG.
The wiki: a man at 0 hitpoints survives with a random permanent injury with a FLAT 33% chance (90% with the Survivor
trait). He cannot survive if the last hit was a FATALITY, if he was RETREATING, or if the damage was bleeding or
poison. Winning does nothing. Also (Fatality page): a head hit with Overhead Strike or Round Swing is a 99% decapitation;
a Surgeon follower prevents fatalities for brothers with no permanent injuries; surviving men cannot be eaten or raised.
So his ruled 20% dead / 80% survive is SO MUCH KINDER than BB's 67% dead / 33% survive that "vanilla plus Battle
Brothers" with his number is not the same game. Measured with my model (5% struck per fight):
    his rule 20% / veteran 10%        median life 122 fights   dead before veteran 17%
    BB's real 67% dead                 median life  21 fights   dead before veteran 47%
    BB with the Survivor trait (10%)   median life 139 fights   dead before veteran  9%
So BB's real default is harsher than my IRON preset (29 fights). It is a fact for his decision, not a recommendation.
THREE THINGS FROM IT, none changing his ruling: (i) a RETREATING man cannot survive, which is the missing cost for a
withdraw verb (my "losing a fight is 30%" idea had no basis and is struck); (ii) FATALITY is a separate roll for
head and body hits (99% on the two big skills), which is where "you fucked up" kills; (iii) the Surgeon follower
is a ready-made table row (no permanent injuries -> no fatality). Rule 56 (10/1, "a little more per trait or injury")
is the same shape as the Surgeon rule, from the other side.

### 1b. WHAT MAKES AN INJURY  [Grok GROK_115, source: Grok, unverified; wiki Temporary Injuries read here]
I wrote that an injury happens on "a hit that takes a big share of hitpoints" (recall). Correct and now exact: a hit can
leave an injury only if the target can receive one, the hit does at least 10 health, and damage divided by max
health reaches the injury's own threshold, 25% (broken nose, bruised leg) up to 50% (broken ribs) and 60% (fractured
skull), times multipliers. Against our fight: max health 100, so 25 damage is the lowest gate. The sniper (32-48) and
bat (26-38) clear every low gate every time; the goon (14-26) almost never does. So INJURIES COME FROM SPECIFIC ENEMY
KINDS, not from "being struck down", and the table needs a row for the gate (threshold per mark) as well as the
30-to-40 days. This also means my 'struck down' model (HP to zero) counts only the worst events.

### 1c. ARMOUR: MY MECHANISM WAS RIGHT, THE DETAIL IS BETTER  [wiki: Combat Mechanics, read here]
Hitpoint damage = base x (share that ignores armour) MINUS 10% of the armour you still have; the rest is armour
damage at the weapon's effectiveness (billhook 150%); once armour is gone the remainder spills through; head crit x1.5.
So every point of armour also takes 0.1 off each hit that gets through: 95 versus 105 armour is one flat point on
every hit plus a longer-lasting pool. That is the real "slightly better" in BB, and it is a THIRD small term that
my hold proposal did not have. Hit chance (Grok GROK_21, unverified): skill minus defence, defence above 50 counts
half, floor 5%, ceiling 95%, surrounded subtracts 5 defence per extra enemy, height +-10, head chance 25. Nine
Lives survives a killing blow at 11-15 health. NOTE: our enemy hit chance reaches 0.97 at point blank, above BB's
95% ceiling; there is no cap in our formula.

### 1d. DIFFICULTY: BB HAS NO ENEMY LEVEL AND NO GEAR DIAL  [Grok GROK_60, source: Grok, unverified]
Enemy strength in BB comes from YOUR crew: the 12 strongest men, each 10 plus 2 per level past 1 (gear does not
count, benched men do). A camp already on the map scales with days and caps at day 267 (tripled by then); a roaming
party scales with days and your score, capped at day 100; legendary camps are fixed. The difficulty setting raises
the COUNT and the TIER together, and a higher tier means more leaders and fewer thugs, "the equipment step"; there
is no separate gear formula. Enemies are unit types, not levels. My difficulty page invented "enemy level" and "enemy
gear" as two dials. KEEP the pressure slider but rebuild it from the BB shape: count, tier mix (leaders to thugs),
and a days term; and note our fight has no crew-score term at all, which is why a strong crew cannot be punished.
Also on difficulty (Grok GROK_22/119): carry cap 200 on Beginner, 150 on Veteran and Expert; on Expert a city hall
buys your goods at about 17.7 to 19.7 percent of worth. Money is a difficulty lever too. The open row [the difficulty
steps] owns the full list.

### 1e. FIGHT LENGTH: HE SAID THERE IS NO NUMBER  [Grok GROK_83, source: Grok, unverified, his words]
Paolo: no average; you can kill six people with one good person, or mess up and it takes 40 minutes; no hard number;
the permanent rule is the feeling. The wiki gives no minutes. So my fight-length page is only a MODEL (rounds x
units x seconds each, calibrated to his 30-to-40 for a tough BB fight) and the "routine 2 to 4, tough 8 to 15"
lines were the manager's defaults, not his words. They stay as ceilings for the VOTE default and nothing more.
The BB seconds-per-unit stays recall; no source gives it.

## 2. WHAT STANDS
The five-points mechanism (armour as a second pool and the fatigue tax), the lifespans curve (it is real-world, not BB),
the numbers-table shape, the existing-tiers measurement (our code), the 9.4 rounds (our code), and the finding that
a struck-down chance per fight is the missing row of his death rule.

## 3. TABLE CHANGES (draft file updated, nothing reads it)
Added reference rows: death.survive_bb 0.33 (wiki), death.survive_survivor 0.90, injury.gate_min_damage 10,
injury.threshold_range [0.25, 0.60], armour.hp_term 0.10, hit.floor 0.05, hit.ceiling 0.95. Struck the idea
death.lost_fight_bonus. Re-pointed diff.enemy_level_mult and diff.gear to diff.tier_mix and diff.days_term.

## ROUTED
- COMBAT: a retreating man cannot survive (the withdraw verb's cost); a fatality roll on head and body hits; cap our hit chance.
- TUNING [the difficulty steps] (open): full Beginner/Veteran/Expert list from the wiki; this page is its context.
- PEOPLE: the Surgeon rule (no permanent injury, no fatality) and rule 56's extra-per-trait.
- Test material: WHO DIES now has a BB real-odds button; draft:true, never in the game.
