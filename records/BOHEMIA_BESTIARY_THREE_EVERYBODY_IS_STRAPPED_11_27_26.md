# BESTIARY 3: EVERYBODY IS STRAPPED (BUILD 11/27l, VAMILY rule 489(a), 11/27)

PAOLO 11/27: 'most enemies should be having pistols... if you are a force walking around, bro you're at least gonna have some guns...
human forces probably have at the very least pistols, everybody is strapped.' Rule 478 stands: the rounds stay scarce. Rule 489(d): gun
damage does not change (it did not).

## MEASURED BEFORE (main 278d7afe0, tools as below)
Every kind a band deals (80), four to eight of each fielded on the live rules (tools/bohemia_fight_headless.js):
- 50 human kinds (not a beast, a machine or a ghost). 44 walked in with no gun in their hands; 37 had no gun anywhere in their gear.
- The six that shot: the marksman (2 of 8: the crossbow ones), the House's crossbows, the darter, the casino's gunner and spotter, the
  mechanic. The bowman, the needle, the slinger, the kids and every club, blade and spear carried nothing that fires.
- Their men's pistol shots a fight: 0.

## THE RULE, BATTLE BROTHERS FIRST
Battle Brothers gives its melee men a bag of throwing weapons and they throw while closing, then switch (bb_all/0297_Brigand Raider.txt:
'If the weapon's range is 1, 25% [lower] / 35% chance of a Bundle of Throwing Axes, Bundle of Javelins or Throwing Spear';
bb_all/0193_Barbarian Thrall.txt: 40%, 'they move forward and switch to throwing weapons if they have them'). Every human ranged man of
theirs carries a sidearm. The swap costs AP unless Quick Hands. Battle Brothers arms a third of them; the valley arms every one (the
393 million guns of ARMORY 3's research; what runs short is the rounds). The research on roles: records/BOHEMIA_BESTIARY_THREE_HUMAN_FORCES_BY_ROLE_THE_RESEARCH_11_27_26.md.

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html __EVERYBODY_IS_STRAPPED__, records/target/bb/bohemia_enemies.json numbers.strapped)
- Every armed man of theirs who is not a beast, a machine or a ghost and has no gun in his hands carries a pistol in his bag (his
  waistband): his own gear's pistol first (the thug's Dagger, the poacher's Knife, the needle's Notched Blade, the faithful's Dagger),
  else his phase's list by his place in the band (no die thrown: every roll after him is the one it was).
  first: Knife, Zip Gun, 2 rounds | early: Zip Gun, Knife, Dagger, 3 | middle: Dagger, Snub Revolver, Zip Gun, 4 |
  late: Snub Revolver, Rondel Dagger, Dagger, Switched Pistol, 5. A count, never an endless quiver (their own guns keep Battle Brothers'
  endless quivers, as before). TUNING moves the numbers.
- The draw is the bag's swap (4 AP, Quick Hands' first free): the brain that weighs every swap (__AUTO_KNOWS_ITS_MAN__) pulls it when
  nobody is in reach of his own weapon and puts it back when a man is. Nothing new in the brain.
- Dry, the pistol goes back in his waistband and his own weapon comes out (strapHome, the swap's AP or what is left of them), never his
  fists while his own weapon rides in his bag. MEASURED: before this fix 40 fights had 100 pistols go dry and 120 fist blows; after, 0.
- The draw has its flash and words ('THUG pulls a pistol from his waistband.'), the dry pistol its own ('... the pistol goes back in his
  waistband.'). FOUND ON THE WAY: the fight's note table (NOTE_BEATS) had no 'dry' and no 'swap', so rule 478's NO ROUNDS flash on HIS
  men never played since 11/22, and no swap of theirs ever showed. Both added at no length (no turn takes longer).
- A body whose model carries its own weapon (tier_thug's pipe, tier_poacher's hatchet; ours.model_carries) is never dealt to a strapped
  man (his pistol would come out of a fist holding the pipe): the thug's pool keeps its other 12 looks. CHARACTER 2: the pipe as a laid
  prop would give the look back.
- IT DROPS: the pistol still in a dead man's waistband rides home on his body (spoilsOf sidearm) and engine/bohemia_spoils.js found()
  rolls it on the weapon's roll after every other die (no other roll moves), with the rounds left in it.

## MEASURED AFTER
- 50 of 50 human kinds armed with a gun (44 with a waistband pistol, 5 with a gun in hand, the marksman both ways).
- 78 fights, six farmhands on AUTO against 13 bands (brigands at days 2, 10, 30; watch, house, heavies, kids, water, flock, hired,
  takers, casino, keepers), the same dice before and now:
  | | before | now |
  |---|---|---|
  | his six win | 69 of 78 | 62 of 78 |
  | his men dead a fight | 0.29 | 0.40 |
  | turns a fight | 7.8 | 8.9 |
  | their pistol draws a fight | 0 | 3.4 |
  | their pistol shots a fight | 0 | 6.6 |
  | the brain's time a fight (this box) | 451 ms | 580 ms |
  | its slowest single move | 87 ms | 75 ms |
  The first fight of the game (brigands, day 2, 2 rounds a pistol) is won 6 of 6 both ways.
- Loot a won fight (30 fights, the spoils' own found()): items 4.9 -> 8.2, pistols 0 -> 4.3, rounds 0 -> 8.2. FOR ECONOMY THREE: guns
  everywhere and rounds short is the valley's real shape, but four pistols a won fight is a money tap if a pistol sells for much; the
  price is theirs.
- On the page (tools/bohemia_bestiary_three_strapped_proof.js, the shipped fight at 390 x 844, AUTO both sides, nothing staged): a
  brigand thug with a club pulls his pistol out of reach and fires; HIT on his man; the words in the fight's kept feed; 0 page errors.
  Frames records/bestiary_proof/strapped_draw_6.jpg and _7.jpg (not published: the site is at 897 of its 900 MB).

## GATES (rule 13: the pre-push pass, the files in this diff)
EVERYBODY IS STRAPPED (new, gates/everybody_is_strapped_gate.js) 8/0 with its three plants red (the table emptied, an endless pistol,
the dry pistol to his fists). NO AMMO, NO SHOT 12/0 (its N5 re-aimed to rule 489(a): their own guns keep endless quivers, the waistband
pistol carries its few). EVERY TYPE THROUGH A FIGHT 5/0 (53 of 53 kinds of men drop; 80 of 80 kinds fight and finish). THE BESTIARY
FLOOR 13/0 (data legs). AUTO KNOWS ITS MAN 11/0. THE GUNS GROW UP 19/0. A FEW, NOT TWELVE 7/0. EACH ORIGIN ITS OWN 19/0. OPTIMIZE LOOT
22/0. SCRAP IS TAPE 11/0. THE LOOT READS 6/0. DEMO BUILD 25/0. PAGES PUBLISH 30/0. THE SPOILS 17/4: the four are main's own (the
crew screen's level-up tap, quarantined, FIXES 2's note). THE NEW ENEMIES: quarantined (times out at 600 s); every leg it printed ok.
Full suite unmeasured since PLUMBER 8's line.

## ROUTED
- ECONOMY THREE: the pistol loot (4.3 a won fight) and the rounds looted (8.2) against the price table and the rounds' stall.
- TUNING: numbers.strapped (the lists and the rounds by phase); the win rate moved 88% -> 79% with farmhands.
- CHARACTER 2: tier_thug and tier_poacher carry their weapon in the model; a laid prop gives them back to strapped men.
- COMBAT FOUR: rule 478's NO ROUNDS flash was never played (NOTE_BEATS had no 'dry'); fixed here at no length, the words theirs.
- FIGHT SCREEN 3: the spoils' items carry sidearm:true for the waistband pistol, if the end screen wants to say where it came from.

## NEXT (this lane, rule 489(c) and 490)
The roles, from the research: the drone operator first (rule 490: ARMORY 3's charge drone, the operator stays back, drop him and his
drones fall; the factions that would really have drones), then the machine gunner (the belt-fed behind a shield), the rocket man (one
rocket a fight, fired before the lines meet), the breacher (the shove that strips a wall), the medic (no Battle Brothers model: one a
squad, at the back, spends his turn, the obvious first kill).
[bb Battle Brothers gives a third of its melee men a bag of javelins; the valley gives every one of them a pistol]
[analog horror: the kid with the bat has a pistol in his waistband too, and you only see it when he goes for it]
