# BESTIARY 4 -- THE ENEMY GROWS WITH HIS COMPANY, AND A CHAMPION IS ROLLED (BUILD 11/27zzb), 11/27/26

VAMILY rules 491(a) (this lane's half: the forces' numbers and kit by his company), 493(a)(c)(d) (the champions), 482, 480(b), 441,
461(c) amended. Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more challenges, nothing else to do.'
Research: records/BOHEMIA_BESTIARY_THREE_HOW_BATTLE_BROTHERS_SCALES_THE_ENEMY_11_27_26.md (BESTIARY 3, cited). JOBS 2's company strength
(slices/bohemia_job_kinds.js strength(), window.__COMPANY_STRENGTH) is the input.

## MEASURED FIRST (tools/bohemia_bestiary_four_five_killers.js, the live fight on the bench, AUTO both sides, 12 fights a cell)
Five killers: five men of level 11 (Battle Brothers' last perk level) with their stats GROWN the way the crew screen grows them
(engine/bohemia_roster.js levelUp/raise: the plan's first four stats a level at the one-star column's mean; a level-11 melee man is
melee 64, melee defence 34, health 90), the city shelf's kit (210 body, 210 head, the late weapons), day 90. The strong twelve: twelve
of level 8, the same way. On main (banks/BOHEMIA_BESTIARY_FOUR_FIVE_KILLERS_BEFORE_11_27_26.json):
- FIVE KILLERS WON 100 IN 100 OF EVERY JOB: one, two and three stars, brigands, the House, the heavies, the hired guns; nobody down.
  That is his sentence, on the bench. Why: strength 171 is a typical company's day 53, so every job dressed them for the MIDDLE phase
  (thugs, raiders, marksmen), never the late men; and the count stopped at 12.
- THE STRONG TWELVE WON 100 OF EVERY JOB TOO; their two- and three-star jobs were the same fight (the job's most, 13; the math said
  16.7 and 22.3); a thinned faction (the House 0.55, the hired guns 0.35) sent 7 and 5 men to his twelve.
- Champions came as three wiki kinds in the late mixes only (brigands, kids, heavies): 42 to 75 in 100 late bands, ONE-STAR JOBS
  INCLUDED (Battle Brothers: -99% on a one-skull contract); none in any other faction.
- A side finding for TUNING and JOBS 2: the bench's companies (tools/bohemia_world_most_jobs_fit.js, tools/bohemia_tuning_the_whole_grid.js)
  hand men a LEVEL with no grown stats, so 'level 8' fights like a recruit; the measured spreads of 11/27y are for stat-less men.

## BUILT
1. THE DRESS READS HIS MEN (slices/BOHEMIA_CITY_WORLD.html partyMath 'job', __THE_ENEMY_GROWS_WITH_HIS_COMPANY__; party_math.json
   job_bb.grows): the dress reads his strength x (12 / his counted men)^t, t rising from 0 at a man's strength 20 (level 6) to 1 at 30
   (level 11): five men of level 11 are dressed as twelve of them would be (the late men), a crew of recruits exactly as before; never
   past the day the calendar allows (dress_ahead, rule 120(a)).
2. A FEW STRONG MEN ARE SIZED NEARER THE COMPANY THEY FIGHT LIKE (job_bb.grows.small): Battle Brothers' own guard against the small-roster
   trick (its arena: strength x 12 / roster size, bb_all/0131_Arena.txt; the trick named, bb_all/0827_Game Guide.txt L236), at half its
   power, on the same ramp: five killers' three-star job: the math 12.1 -> 17.9.
3. PAST THE JOB'S MOST, BETTER MEN, NOT MORE (slices/BOHEMIA_FIGHT.html partyFor/growUp; bohemia_enemies.json numbers.grows): what the
   math wanted past the most rides as party.over; a thinned faction thins what the math WANTED (so the House fills the board: 7 -> 12
   for the strong twelve's three stars), then (over - 1) x the band's men step one rung up their own faction's ladder (the kinds of its
   mix from this phase on, melee and shooters apart, by the wiki's XP, the weakest first; never into a leader or a champion; a beast
   pack never). Battle Brothers: 'the maximum number and type of enemies is limited by the spawn list used' (0827 L238); its brigands
   grow by rank (0299_Brigands.txt). No die is thrown.
4. A CHAMPION IS ROLLED, BATTLE BROTHERS' WAY (FIGHT champRoll/champOn, __A_CHAMPION_IS_ROLLED__; numbers.champion): every man of a
   human band, 1% (2% the elite kinds), +5% on a three-star job, -99% on a one-star job, never in the first week (rule 120(a), thugs first; Battle Brothers deals no three-skull contract in its first days, bb_all/0626 L3445), -2% before the late phase (BB's early -1% made
   -2 so the elite kinds wait too, rule 443(d)); one a band, the band's own die (seeded off the band, its stars and its day: the card's
   read and the fight meet the same man; no die of the fight moves). A brigand leader, a kids' skirmisher, a heavies' warrior become
   the wiki's champion rows (champions.swap; those kinds left the late mixes); any other keeps his kind and takes BB's numbers: health
   x1.35, aim x1.15, defences x1.25, resolve x1.5. Every champion wears his row's armour at the top of its range (kit a tier up).
   BB's damage x1.15 is NOT taken: damage waits on Paolo (rule 489(d)).
   - A NAME: champions.by_faction, every human faction a road deals (the House's sergeant-at-arms, the block's captain, the hired guns'
     top gun...), drafts for WORDS; said when he is first seen ('OLD VEGAS, the House's sergeant-at-arms, is with them.').
   - A LOOK: Battle Brothers' skull on his token, gold, twice the board's other marks, right of his bars (CHAMP_MARK).
   - A PRIZE: engine/bohemia_spoils.js found(): a dead champion's weapon, shield and armour always drop, whole (never tape), and 6 to 12
     batteries from his pockets (numbers.champion.prize_batteries), after every other die.
5. THE CARD AND THE FIGHT AGREE: the danger reader (slices/bohemia_job_danger.js roll, plans, doorOpts) and the alpha's door (nfOpts, and
   the demo re-cut) carry the job's stars and the over to the fight.

## AFTER (banks/BOHEMIA_BESTIARY_FOUR_FIVE_KILLERS_AFTER_11_27_26.json; won in 100, men down a fight)
    five killers vs brigands    1 star 100 -> 92 (1.0 down)   2 stars 100 -> 58 (2.3)   3 stars 100 -> 8 (4.7)
    five killers vs the House   100 / 100 / 100 (a champion in half its three-star bands)
    five killers vs the heavies 100 / 100 / 100;  vs the hired guns 100 / 100 / 100
    strong twelve, every job    100 (two and three stars now differ: 3.5 -> 5.7 -> 8.0 marauders; the House 7 -> 12 men)
The brigands now span easy, fair and one to sweat for (rule 491(b)) for a company like his. NOT YET: the House, the heavies and the hired
guns lose to five killers every time, and nothing on the board makes the strong twelve sweat. Their count_scale (0.55, 0.45, 0.35) was
set for early fights and reads each of their men as worth two or three brigands; on the bench late, ten House men fall to five killers
with nobody down. THE NEXT JOB: measure each human faction's worth a man in the late phase and set its thinning by phase (this lane's
data), then re-measure the strong twelve.

## THE PROOF ON THE PAGE (tools/bohemia_bestiary_four_champion_proof.js house; records/bestiary_proof/champion_proof.json)
Five killers against a three-star House band of 12 on day 90, the band rolled by the fight's own setup (seed 2) and handed whole to the
shipped fight page at 390 x 844, AUTO: the same man on the page (OLD VEGAS, the House's sergeant-at-arms, a shield man: health 95 against
70, armour 60/80 at the top of his row, aim 63 against 55); his skull drawn right of his bars; won in 9 rounds; he died; the spoils with
every die missing: his arming sword and his old wooden shield, whole, and 7 batteries. No page error.

## GATES
THE ENEMY GROWS WITH HIS COMPANY 7/0 (new, gates/the_enemy_grows_with_his_company_gate.js, in the suite): G1 the data, G2 the map (five
killers dressed for day 100, the math 17.9; three recruits sized and dressed as without the rule), G3 the band (20 bands: marauders 94 ->
166 at over 1.7, the House 140 -> 240 men, bison 40 -> 40), G4 the champion (one-star 0 of 120; three-star House 47 of 120; never two;
the same man in a new fight 6 of 6; health 95 vs 70, armour at the top; a leader becomes the wiki champion 12 times), G5 the prize, G6 the
card, G7 measured. --plant: rungs off, the one-star -99 off, the prize off: three reds.
THE VOTE TAB GATE 66/0. THE BESTIARY FLOOR: its full run is past the 10-minute foreground limit on this box (killed at 9 min 50 s, rule 461(c)); its F7 leg's live check (gates/the_bestiary_floor_men.js) run alone: no champion before the late phase in any faction (0 of 100 each), the three wiki champion kinds named from their lists and never twice, one a band; F7 had read 'kids: 3 in 100 bands before the late phase' at the first cut (BB's -1%), hence -2. THE JOB TELLS THE TRUTH: its run is past 25 minutes on this box (killed by its timeout twice); its J9 (no champion on day one) is held by never_in_phase and G4's first-week leg.
EVERYBODY IS STRAPPED 5/0 (S1 now counts the champion kinds the roll deals: 51); THE BESTIARY 10/0; THE WORK SPANS HIS STRENGTH 6/0;
THE KILL CAMS 9/0; DEMO BUILD 25/0. THE FIGHT IS CLOSE 15/2: main's own two reds, the same (P1 PRICE IS POWER, B1 NEW TOUGH won 97).

[bb Battle Brothers sends a late company more of its best ranks, and on a three-skull contract a named man with his famed piece]
[analog horror: the one with the gold skull is the one they all look at before they move]
