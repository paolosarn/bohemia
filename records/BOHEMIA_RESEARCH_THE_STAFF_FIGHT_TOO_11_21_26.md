# THE STAFF FIGHT TOO: THE RESEARCH (VAMILY rule 468)

Paolo 11/21, his words: 'it's just a little too easy... if I got a fucking one-handed weapon and a shield and all my guys got
the right traits leveling up then it just becomes pretty easy... I want you to do research before you even implement this but
maybe they are forced to being in combat... the game becomes more about protecting your staff... if your staff permanently dies
you gotta get new people at different settlements... maybe even similar to how slaves were in Battle Brothers... the better you
want your camp to be, that means less people you can run around with, because there's a limit, I believe it's 12 right now, on a
different origin it might be 14'. Rule 468's order: research first, this page with the design and its numbers, then a lane builds
it. NOTHING IS BUILT BY THIS PAGE.

---

## A. FOR PAOLO

**What Battle Brothers does.** You hire up to five camp people, like a cook or a surgeon. Fame opens each spot. They help off
the field and never fight. A fight holds 12 men, 16 for two origins. The slaves you remember are the Indebted: 10 less health,
a bit less nerve, no brave traits, and down means dead.

**What real armies did.** The camp was often bigger than the army: 3,000 soldiers brought 4,000 women and children. They
cooked, washed and nursed. Raiders went for the baggage. At Agincourt about 600 peasants hit the English baggage and took a
royal crown. At Naseby over 100 camp women were killed.

**What we build.**
1. Every camp person you hire stands in every fight, behind your back row.
2. Each one is one of your 12 (or 16). Five staff means seven fighters.
3. They are weak: 40 to 50 health (a fighter 50 to 60), a knife, no armour, one bad trait.
4. They start scared: two failed nerve checks and they run.
5. Raiders and animals aim for them.
6. Down means dead. Rehire in a town, full price. One town in four has that kind each week.

---

## B. THE RESEARCH, WITH SOURCES

A note on how the Battle Brothers wiki was read: this session could not open the wiki's host (battlebrothers.fandom.com did not
resolve from here). Every wiki fact below was read from the repo's own copy of that wiki,
`reference/library/grok/wiki/PAGES_ALL.tar.gz` (the `bb_all/` file named beside it), and is cited by the page's public URL.
The developer posts are cited by their Steam announcement URLs (the wiki copy carries those links) and their public mirrors,
which the web search did reach.

### B1. Battle Brothers: the followers (the retinue)

- **They never fight.** The developers call them 'non-combat followers ... non-fighting specialists like blacksmiths, surgeons
  or that drill sergeant ... A retinue of people that would support your company of fighting men outside of battle.' Each one
  grants 'one or more beneficial effects on the world map.' (Dev Blog 127, The Retinue, Part I:
  https://steamcommunity.com/games/365360/announcements/detail/1693854158814837916 ; mirror https://gamebanshee.com/3uxkh ;
  repo copy bb_all/0605.) The game's own ambition text says the same: 'There are cooks, scouts and many more who can support us
  off the battlefield.' (Hire Follower: https://battlebrothers.fandom.com/wiki/Hire_Follower , bb_all/0997.)
- **Five places, opened by renown.** 'There's five slots in total for you to fill, and several times that many followers
  available to choose from.' (Dev Blog 127, above; Dev Blog 128:
  https://steamcommunity.com/games/365360/announcements/detail/1693854792181277593 , mirror https://www.gamebanshee.com/3ux9h ,
  bb_all/0606.) The wiki's table: 1 place at 250 renown, 2 at 750, 3 at 1,400, 4 at 2,250, 5 at 3,350 (Retinue:
  https://battlebrothers.fandom.com/wiki/Retinue , bb_all/1687). Eighteen followers in all on that page.
- **How they are hired.** From the retinue screen, 'a new screen accessible from the world map', a campfire with tents. 'Each
  follower costs a certain amount of money to hire, and you can replace a follower at any time with a different one for a
  cost.' Many have an unlock condition beyond renown: the drill sergeant needs 'a brother with a permanent injury' retired
  (Dev Blog 127). Prices are one-time: the Cook 2,000 crowns (unlock: carry 8 different provisions), the Surgeon 3,500 (unlock:
  treat 5 injured men at a temple) (https://battlebrothers.fandom.com/wiki/The_Cook_(Follower) , bb_all/1952;
  https://battlebrothers.fandom.com/wiki/The_Surgeon_(Follower) , bb_all/1974).
- **They take no place in the company.** The retinue is its own five places on its own screen, apart from the roster of men
  (Dev Blog 127). This is the line rule 468 changes.
- **Why the developers made them:** 'permanent progress not erased by battles lost' (Dev Blog 127). Rule 468 makes them losable
  on purpose. That is the trade: the follower becomes a risk you carry, not a safe bonus.
- A Steam community guide sorts the followers by kind rather than rating them ('Detailed Follower Mechanics: A Guide',
  https://steamcommunity.com/app/365360/discussions/0/4149469212592158948 ; only its opening was reachable from here).

### B2. Battle Brothers: the Indebted (what Paolo remembered as 'the slaves')

- **Where they are.** The Manhunters origin: 'The bulk of your outfit are captives, forced to fight to earn their freedom.'
  Start: two manhunters and four indebted. 'Take up to 16 men into battle at once' and 'have 25 men in your roster'. 'Having
  equal or fewer indebted than non-indebted will make your men dissatisfied.' (Manhunters:
  https://battlebrothers.fandom.com/wiki/Manhunters , bb_all/1239; Dev Blog 140, New Origins, mirror
  https://gamebanshee.com/3d8qw , which describes a pair of slave-drivers and four slaves and up to sixteen men into battle at once.)
- **Their numbers against a normal man** (Indebted (Background): https://battlebrothers.fandom.com/wiki/Indebted_(Background) ,
  bb_all/1073; the base row is the Daytaler's, Character Backgrounds: https://battlebrothers.fandom.com/wiki/Character_Backgrounds ,
  bb_all/0368, as copied in records/target/bb/backgrounds.json):

  | | Indebted | Daytaler (the base) | Servant (for comparison) |
  |---|---|---|---|
  | hitpoints | 40 to 50 | 50 to 60 | 45 to 55 |
  | resolve (nerve) | 25 to 40 | 30 to 40 | 25 to 35 |
  | melee skill | 47 to 57 | 47 to 57 | 47 to 57 |
  | melee and ranged defence | 0 to 5 | 0 to 5 | 0 to 5 |
  | initiative | 95 to 105 | 100 to 110 | 105 to 110 |
  | wage | 0 | 6 | 4 |

- **Their rules.** 'No morale check triggered for non-indebted allies upon dying.' On the Manhunters origin: 'Limited to
  character level 7', '10% more experience', and 'Is permanently dead if struck down and will not survive with a permanent
  injury.' They are excluded from the brave traits (Brave, Determined, Fearless, Iron Jaw, Loyal, Lucky, Strong, Survivor,
  Tough and more), and from the resolve and hitpoint talents. They cannot desert (Desertion:
  https://battlebrothers.fandom.com/wiki/Desertion , bb_all/0572).
- **Do they really run sooner?** Only a little by the numbers: their nerve floor is 5 lower and their health 10 lower, and
  none of them can roll a brave trait. The game has no special 'flee faster' rule for them. They break sooner in practice
  because they are hit harder and braver traits are barred. The origin gives its overseers a whip, Crack the Whip (4 AP, 10
  fatigue): 'Resets the morale of the targeted indebted to Steady if currently below' and buffs them for 2 rounds, at 1 to 3
  damage (https://battlebrothers.fandom.com/wiki/Crack_the_Whip_(Manhunters) , bb_all/0449). Our design makes the 'run sooner'
  real with one clear rule (C4) instead of a hidden number.

### B3. Battle Brothers: how many men

- **12 in a fight, the rest in reserve.** 'While the maximum number of characters you can lead into battle is, for reasons of
  balance and usability, still twelve, you now also have a reserve roster to draw from.' (Dev Blog #76, the official site:
  https://battlebrothersgame.com/?p=15526 .) A review counts 12 plus a reserve of 8 (https://gamebanshee.com/kd6w3). The 20 is
  confirmed by the Roster of 20 ambition ('company max roster size must be at least 20', bb_all/1709,
  https://battlebrothers.fandom.com/wiki/Roster_of_20) and the Gladiators page ('Has only 12 instead of 20 slots in the roster').
- **Origins that change it** (each origin's page):

  | Battle Brothers origin | ours (records/target/bb/origins.json) | into a fight | in the company |
  |---|---|---|---|
  | every other origin | THE CREW THAT IS LEFT, A NEW CREW, UP FROM HENDERSON, THE WATER TRUCK, THE SCAVENGERS, THE DESERTERS, THE RAIDERS, THE LAB RATS, THE FAITHFUL, THE HUNTERS | 12 | 20 |
  | Peasant Militia ('Human Wave': https://battlebrothers.fandom.com/wiki/Peasant_Militia , bb_all/1533) | THE BLOCK WATCH | 16 | 25 |
  | Manhunters (above) | THE DEBT COLLECTORS | 16 | 25 |
  | Oathtakers ('Can only have 18 brothers in their roster': https://battlebrothers.fandom.com/wiki/Oathtakers , bb_all/1470) | THE PROMISE KEEPERS | 12 | 18 |
  | Gladiators ('never have more than 12 men in your roster': https://battlebrothers.fandom.com/wiki/Gladiators , bb_all/0848) | THE FIGHT PIT | 12 | 12 |
  | Lone Wolf ('Can never have more than 12 men in your roster': https://battlebrothers.fandom.com/wiki/Lone_Wolf , bb_all/1194) | THE LONE WOLF | 12 | 12 |

- **Where Paolo's '14' comes from.** No origin takes 14 into a fight. The 14 is how many of the best men the game counts when
  it sizes the enemy for the Militia and the Manhunters: contract difficulty 'scales with the strength of your roster (which
  equals a sum of individual strengths [10 + 2*(lvl-1)] of 12 strongest brothers)' (Game Mechanics:
  https://battlebrothers.fandom.com/wiki/Game_Mechanics , bb_all/0828), 14 for those two origins (the repo's
  reference/library/grok/GROK_60_ENEMY_MATH_2026_10_02.md; our records/target/bb/party_math.json roster_strength
  strongest 12, strongest_wide 14). Paolo asked the same thing on 11/3 ('could be 14 with a certain origin') and the fight
  already takes Battle Brothers' 16 (slices/BOHEMIA_FIGHT.html, the cap comment in setup()).

### B4. Battle Brothers: a thing on your side you must keep alive

- On an Escort Caravan contract the caravan's donkeys stand on the board: 'Losing all Donkeys will fail the contract. Losing
  some, but not all Donkeys will have you poorly complete the contract. You gain 50% less crowns & Relation.' (Escort Caravan:
  https://battlebrothers.fandom.com/wiki/Escort_Caravan , bb_all/0703.)
- A donkey has 180 hitpoints, melee defence -30, and 'Donkeys are stationary, have no skills, and are not in the turn order'; they are immune
  to morale. The wiki adds 'Enemies prefer attacking donkeys over your brothers', flagged there as needing a citation (Donkey:
  https://battlebrothers.fandom.com/wiki/Donkey , bb_all/0657). So Battle Brothers already has the 'protect the soft thing'
  fight; ours makes the soft thing a person who can move, panic and die for good.

### B5. Battle Brothers: morale, the rules our fight already uses

From the Morale page (https://battlebrothers.fandom.com/wiki/Morale , bb_all/1316), all already in slices/BOHEMIA_FIGHT.html
check() and ripple(): five rungs (Confident, Steady, Wavering, Breaking, Fleeing), each failed check one rung down; resolve is
the chance, capped at 95; Wavering x0.9 on resolve and skills, Breaking x0.8, Fleeing x0.7; an ally dying is a check at
`+20 - 0.035 x his XP value + distance^2.4`; 'Allies adjacent +3 per ally' on a negative check; 'Fleeing units can rally on their
own when not adjacent to enemies' (+2 a round fleeing); a brother at the map edge does not leave, his morale drops to Breaking.

### B6. Real history: camp followers and baggage trains

**How many.**
- Early 1600s, Jacob von Wallhausen: 'When you recruit a regiment of German soldiers ... you do not only acquire 3,000
  soldiers; along with these you will certainly find 4,000 women and children.' (Quoted in John A. Lynn, Women, Armies, and
  Warfare in Early Modern Europe, Cambridge 2008, excerpt:
  https://assets.cambridge.org/97805218/97655/excerpt/9780521897655_excerpt.pdf .) About 1.3 followers a soldier.
- 1648, the last year of the Thirty Years' War: the Imperial-Bavarian army had 40,000 men entitled to rations 'and more than
  100,000 wives, prostitutes, servants, children, and other camp followers' (Hunt et al., The Making of the West, 'The Effects
  of Constant Fighting': https://digfir-published.macmillanusa.com/hunt5e/hunt5e_ch15_13.html). About 2.5 a soldier.
- A Landsknecht regiment of 1,000 men 'would be accompanied by 500 women and 300 children' in the Thirty Years' War; the train
  (the Tross) held women, children, craftsmen and day labourers, and an unattached woman was let in only with 'a skill or trade
  which made them a valuable asset' (Tross: https://en.wikipedia.org/wiki/Tross ; a secondary summary). About 0.8 a soldier.
- Army strength figures of the period left the baggage train out (LWL, Westfaelischer Friede documentation:
  https://www.lwl.org/westfaelischer-friede-download/wfe-t/wfe-txt1-31.htm). The real camp was big and uncounted.

**What they did.** Laundry, meals, petty trade and heavy camp labour (Lynn, HistoryNet: https://historynet.com/women-in-war/);
smiths, wheelwrights, carpenters, merchants and sutlers who sold to the troops, a 'campaign community' near the size of a town
(Lynn, Cambridge excerpt, above); tailors, cobblers, barbers and surgeons, beasts of burden and carts (Tross, above). They were
under army discipline, 'subject to army discipline just like the soldiers', and the baggage train was a mostly civilian rear
(Historic UK, 'Women on the March': https://www.historic-uk.com/HistoryUK/HistoryofEngland/Camp-Followers/). The Landsknechte
had an officer, the Hurenweibel, usually an old soldier, who led the train and kept it out of the army's way (Tross, above,
and a weaker source, https://threadreaderapp.com/thread/1672087005109399552.html).

**Where it stood.** Behind or beside the army, on the safe side. At Arsuf (1191) the column marched with 'the baggage' on the
seaward side and the fighting men between it and the enemy; the enemy struck 'the moment the baggage train of the rear-guard
became separated from the rest of the army' (https://en.wikipedia.org/wiki/Battle_of_Arsuf ;
https://defendingcrusaderkingdoms.blogspot.com/2016/09/battle-of-arsuf-september-7-1191.html). Armies ringed their camps with
their own carts as a moving wall, the wagon fort (https://en.wikipedia.org/wiki/Wagon_fort). At Bannockburn (1314) the Scots'
'small folk' were 'given the task of guarding the Scottish baggage train', and late in the battle they came over the hill
under banners made of camp blankets, after the loot of the English dead
(https://warhistory.org/@msw/article/the-wars-of-independence-bannockburn-1314-iii).

**How often it was attacked, and what happened.** No source gives a rate. The pattern in every case found: the baggage sat
behind the line, lightly guarded, and the enemy went for it when it saw loot or a gap; after a defeat the followers were
plundered, taken or killed.
- Agincourt (1415): 'As the English were collecting prisoners, a band of French peasants led by local noblemen began
  plundering Henry's baggage behind the lines'; 'thinking it was an attack from the rear, Henry had the French nobles he was
  holding prisoner killed' (Britannica: https://www.britannica.com/event/Battle-of-Agincourt). The raiders were 'a few
  men-at-arms and perhaps 600 French peasants' (https://weaponsandwarfare.com/?p=20695 ; another count says 1,000,
  https://englishhistory.net/?p=3547). Ysembart d'Azincourt 'led a small force against the lightly protected English baggage
  train, seizing some of Henry's personal belongings, including a crown' (https://englishmonarchs.co.uk/battle_agincourt.html).
  Holinshed names 'Robinet of Bournonville, Rifflart of Clamas, Isambert of Agincourt'
  (https://english.nsms.ox.ac.uk/Holinshed/texts_old_2009-09-17/1587/1587_5126.html).
- Bannockburn (1314): the Scottish baggage train 'was sacked by the Earl of Atholl in the aftermath of the battle' (Historic
  Environment Scotland: https://portal.historicenvironment.scot/designation/BTL4).
- Naseby (1645): after the battle the Parliament's cavalry fell on the King's baggage train; 'over a hundred dead and many more
  mutilated' among the women camp followers, taken for Irish (Mark Stoyle, University of Southampton:
  https://eprints.soton.ac.uk/79667). A royalist source called the dead 'soldiers' wives' (Civil War Petitions:
  https://www.civilwarpetitions.ac.uk/blog/echoes-of-a-massacre-the-petition-of-bridget-rumney/).

**What it means for the design (realism first).** The real camp traveled with the army, stood behind it, was weak, was the
enemy's favourite soft target, and was lost with the battle. All of that goes in. The one thing that does not: the real camp
outnumbered the army (0.8 to 2.5 followers a soldier). On a phone board with 12 places that would be 10 to 30 civilians a
fight. Paolo's own words put the camp inside the 12 ('the better you want your camp to be, that means less people you can run
around with'), and Battle Brothers' five places stay the ceiling, so this is his rule, not a trade made behind him.

### B7. This repo now (what the design has to fit)

- **The followers.** 18 rows in records/target/bb/retinue.json (a modder's file; 11 can be hired, 7 are shut until another
  lane's system lands). Hired in a town's hall, three a week per town (`met_per_place` 3, engine/bohemia_camp.js inTown), or at
  camp; one-time price 200 to 390 batteries (Battle Brothers' crowns / 10); no wage (rule 56). Places by CLOUT, 0 to 5, Battle
  Brothers' table (engine/bohemia_renown.js slots(), records/target/bb/renown.json). The take: retinueTake in
  slices/BOHEMIA_SETTLEMENT_SCREEN.html (checks the places and the batteries). They stand at camp by their pieces
  (slices/bohemia_camp_look.js folk()); one id, one whole person (engine/bohemia_rig_bodies.js isCompany). Their effects are
  read through BohemiaCamp.has / mult / plus, so a follower who is gone stops working by himself. They never come to a fight:
  nothing in the fight's hand-over reads BohemiaCamp (after a fight the alpha reads only the drill sergeant's xpDrill). Handoff: handoffs/RETINUE.md; record:
  records/BOHEMIA_RETINUE_THE_EIGHTEEN_PEOPLE_11_7_26.md.
- **The limits.** The fight's cap IS enforced: slices/BOHEMIA_FIGHT.html setup() takes `opts.cap` (the origin's `field_cap`,
  else records/target/bb/ours.json `field_size` 12), stands the first `cap` men, keeps the main man always, and names the rest
  in `S.reserve` (rule 378 amended 11/3; gates/no_cap_on_how_many_fight_gate.js holds the 16 for THE BLOCK WATCH). The
  company's cap (`roster_cap`, 20) is SHOWN (the crew screen's title in slices/BOHEMIA_ROSTER_SCREEN.html, 'YOUR COMPANY n / 20
  12 IN A FIGHT'; the origin card in slices/BOHEMIA_ALPHA_0_9.html 'ROOM FOR 20, 12 IN A FIGHT') but NOT ENFORCED: the hall's
  Hire in slices/BOHEMIA_SETTLEMENT_SCREEN.html checks only the batteries before hireIntoCompany. A finding for the builder.
- **How a fight deploys.** The door (slices/BOHEMIA_ALPHA_0_9.html, the hand-over block with __THE_ORIGIN_SETS_THE_COMPANY__ and
  __WHO_YOU_HIRE_FIGHTS__) hands `o.company` (the crew screen's line, YOU first), `o.cap`, `o.formation`, and `o.camp` when a
  crew finds him at camp (CAMP THREE, rule 406(c)). The fight's rowsOf() and deployCrew() put melee in the front column
  (`S.cols[0]`), shooters in the back column (`S.cols[0] - 1`), nine slots a row (ours.json `formation.slots_per_row`, Battle
  Brothers' three rows of nine), and anyone past both rows in a third column and behind (`rows.more`). That third column is
  where the staff go.
- **Morale** is Battle Brothers' page, already built (B5): check(), ripple(), flee() in slices/BOHEMIA_FIGHT.html; origin ways
  (never confident, never flees, the whip) in engine/bohemia_origin_ways.js. Note: ripple() fires a check for every ally on any
  death; it has no Indebted exception yet.
- **Death.** fall() in slices/BOHEMIA_FIGHT.html: the main man is only downed; anyone else dies on `ours.struck_down_death_chance`
  0.2 plus 0.05 a mark (cap 4), else a permanent injury.
- **Targets.** bestTarget() scores expected harm; the marksman already prefers the soft (no shield, a rookie, a bare head:
  softness()), the runners go round for the weakest (records/target/bb/ai.json `rusher`, `backline.soft`). A staff member is
  already the softest thing on the board; the pull in C5 is on top.
- **Enemy size.** The map sizes a party from roster strength (records/target/bb/party_math.json, 10 + 2 a level over the 12
  strongest, 14 for THE BLOCK WATCH and THE DEBT COLLECTORS); the door caps the first fights at the company plus one
  (`cn = o.company.length`, the __EVERY_FIGHT_SIZED_TO_THE_CREW__ block). Both would count staff as fighters if staff were put
  in `o.company`. They must not be.
- **Their bodies.** Only 5 of the 18 follower looks have a fight sheet in slices/fight_rig/fight_rig.json (person_woman_0 to 3
  and person_town_9). The other 13 (person_town_14, 17, 18, 19, 23, 26, 28, 29, 36, 39, 42, 43, 44) have none. ONE ID, ONE
  WHOLE PERSON says the cook on the board wears the cook's own body, so those 13 sheets are a build step, not an option.

---

## C. THE DESIGN, FOR THE LANE THAT BUILDS IT

Every number here is a draft for TUNING's one table; each says where it came from.

### C1. Who comes into a fight

- **Every follower with you** (BohemiaCamp.retinue()), every fight. Not a choice: rule 468 'forced to being in combat'. Real
  camps traveled with the army (B6).
- **Not in the pit.** An arena fight takes only the men he picked (the door's __THE_ARENA__ block); the staff wait outside, as
  a crowd would.
- Everywhere else they come: the road, a job, a boss, a camp raid, the freeway, an interior.

### C2. Where they stand at the bell

- **Behind his back row**: the third column (`S.cols[0] - 2`, the fight's own `rows.more` placement, filled from the middle
  out), then the column behind it. Never in the front column. Never next to an enemy at the bell. Realism: the baggage behind
  the line (Agincourt, Arsuf, Bannockburn, B6).
- **At camp** (a crew found him camped, `opts.camp`): on the camp's own square, by the fire, on the tiles his fighters left;
  the third column if the square is full.
- **The line-up (deploy):** he may move a staff member like anyone, but only inside his back column and behind it; never into
  the front column.
- A small camp mark on them (UI's), so he reads 'camp' at a glance, never 'one of my fighters'.

### C3. What they are, against a fighter

Battle Brothers' Indebted row, level 1 (B2), on our people:

| | a fighter (the Daytaler base) | a staff member |
|---|---|---|
| hitpoints | 50 to 60 | 40 to 50 |
| resolve | 30 to 40 | 25 to 40 |
| melee skill | 47 to 57 | 47 to 57 |
| ranged skill | 32 to 42 | 32 to 42 |
| melee and ranged defence | 0 to 5 | 0 to 5 |
| initiative | 100 to 110 | 95 to 105 |
| fatigue | 90 to 100 | 90 to 100 |
| level | 1 and up | 1, forever (no XP) |
| traits | rolled at the post | exactly one, rolled once and kept: Clumsy (-5 melee skill), Craven (-10 resolve), Fainthearted (-5 resolve), Fragile (-10 hitpoints) or Hesitant (-10 initiative) (records/target/bb/traits.json, each `at_the_post: true`); never a brave one (the Indebted's excluded list) |
| gear | what he is given | his work clothes (no body armour, no helmet) and a knife (records/target/bb/weapons.json `knife`); nothing can be put on him |
| starts the fight | Steady | Wavering |
| struck down | 20% dead (+5% a mark), else a long injury | dead, every time |

His stats are rolled once, when he joins, from his id and kept in the camp's state (the same person every fight).

### C4. The morale rule (why they run sooner)

- **They start one rung low: Wavering** (x0.9 on resolve and skills, Battle Brothers' table). Two failed checks and they flee;
  a fighter needs three. They may climb back to Steady, never to Confident.
- **Worked example** (an ally of level 1 dies three tiles away: modifier +20 - 3.5 + 13.97 = +30.5):
  a fighter at Steady with resolve 35 fails 35% of the time and needs three fails to run;
  a staff member at Wavering with resolve 32.5 (x0.9 = 29.3) fails 40% and needs two;
  with Craven, 49%. One fighter beside him: +3 (Battle Brothers' 'Allies adjacent'), 37%.
  So protecting them is two jobs: keep enemies off them, and keep a fighter next to them.
- **When they flee** they run for the nearest edge (flee()) and, like any of his men, do not leave the board: at the edge they
  drop to Breaking and cower there (Battle Brothers' brother-at-the-edge rule). They rally on their own when no enemy is next
  to them (+2 a round fleeing). A cowering cook at the edge is exactly where a raider who went round finds her. That is the
  point.
- **Their fall or flight shakes no fighter** (Battle Brothers' Indebted rule, 'No morale check triggered for non-indebted allies
  upon dying'); it does shake the other staff (they are not soldiers). In ripple(): skip fighters when the one who fell or ran
  is staff.
- **No whip.** THE DEBT COLLECTORS' whip stays on their debtors (engine/bohemia_origin_ways.js whip.men); staff are not
  debtors.

### C5. How the enemy treats them

Realism: raiders went for the baggage because the loot was there (Agincourt, Bannockburn, Naseby); Battle Brothers says enemies
prefer the donkeys. Disciplined troops fought the army. So, in bestTarget(), a staff member's score is multiplied by the
family's pull (new block in records/target/bb/ai.json, `camp_pull`, each with its source):

| enemy family (records/target/bb/roster.json) | pull on a staff member | why |
|---|---|---|
| roaming_crews, desert_road_crews, lab_breakout_keepers, kids_and_runners | x1.5 | raiders and looters: the baggage is the prize (Agincourt's peasants; the Donkey page) |
| beasts | x1.25 | an animal takes the weakest (on top of the rusher's own 'go round for the weakest') |
| every other family | x1 | soldiers fight the company; they still take a staff member when he is the best hit in reach, because he is soft |

**Step two, the raid from behind** (realism: the Agincourt raid came from behind the line; Arsuf's enemy struck the separated
baggage): in a fight against roaming_crews or desert_road_crews, 1 fight in 5, up to 2 of their men (never the leader) start at
his back edge instead of their line, at least two turns' run from the nearest staff member (the fight's own __ROOM_TO_RUN__
measure: AP a turn / the flat step cost). Never in the game's first fights (the door's first-fights rule), so nothing happens in the
first second (the second votes). If no tile at the back edge is that far, there is no raid that fight.

### C6. The limit, shared by origin

**Everyone of his on the board counts in the fight's cap, and everyone with him counts in the company's cap.** Staff take
their places first; fighters fill the rest in the line's order; the main man always stands; fighters past it wait in the
reserve, as now. Staff are never put in the reserve.

| origin (ours) | fight cap | company cap | fighters in a fight with 1 / 3 / 5 staff |
|---|---|---|---|
| THE CREW THAT IS LEFT, A NEW CREW, UP FROM HENDERSON, THE WATER TRUCK, THE SCAVENGERS, THE DESERTERS, THE RAIDERS, THE LAB RATS, THE FAITHFUL, THE HUNTERS | 12 | 20 | 11 / 9 / 7 |
| THE BLOCK WATCH, THE DEBT COLLECTORS | 16 | 25 | 15 / 13 / 11 |
| THE PROMISE KEEPERS | 12 | 18 | 11 / 9 / 7 |
| THE FIGHT PIT, THE LONE WOLF | 12 | 12 | 11 / 9 / 7 (and the whole company is never more than 12 people) |

The trade only bites once his fighters outnumber the places left: six fighters and two staff is eight, under 12, and costs
nothing but the protecting. That is right: early on, the camp is a soft spot to guard; late, it is a fighter given up.

The places by CLOUT (0 to 5) stay Battle Brothers'. Five is the most staff anyone carries.

Enemy size: staff never count in roster strength (party_math.json: fighters only) and never in the first fights' 'company plus
one' cap. A camp makes the fight harder by what it is, not by making the enemy bigger.

### C7. What a death costs, and re-hiring

- **Struck down = dead.** In fall(): staff never roll; they die. The Surgeon does not save them (his help is for fighters).
- **What goes with them:** their effect (has(id) turns false, so mult and plus drop by themselves: no cook, the food bill is
  back to x1); their place by the fire (freed); the person, for good (ONE ID, ONE WHOLE PERSON: kept in a `dead` list in the
  camp's state with where and which fight; that look is never dealt again, not to the hall, not to a town crowd).
- **Re-hiring:** the kind goes back in the town deal. When a hall next deals it, it is a NEW person of the valley: a look from
  engine/bohemia_people_mix.js that the company, the retinue and the dead do not wear, with a fight sheet and a portrait; a new
  name; the same job, numbers and price (Battle Brothers' one-time price, ours / 10: 200 to 390 batteries). Odds: 3 dealt from
  11 open kinds is about 27% for one kind in one town in one week, so about one town in four.
- **What a loss costs, in numbers:** 200 to 390 batteries to replace him, and his help until the next one is found (about four
  town visits). The place by the fire is not lost: CLOUT keeps it open for the next one.
- A post on the phone feed when one dies (WORLD's or UI's hook, words draft:true for WORDS).

### C8. The end of a fight

- **Lost when no fighter of his stands.** Staff alone never hold the board.
- **A lost fight:** every staff member still on the board goes with the company's taken (the door's `bohemia.taken.v1`, RUN's
  __THE_WIPE_WAKES_IN_TOWN__) and is lost to him, like Naseby's baggage. No rescue in the first build (D8).
- **A retreat:** staff run with it (runs() already takes every man of his side when `S.retreat`); they stand nearest the back
  edge, so they usually get out first, like a real baggage train sent off first.
- **The hand-back:** staff ride back in their own list (`S.staffOut`: id, name, look, dead, cowering, taken), never in the
  company's rows, so the crew screen never thinks a fighter died. The alpha's after-fight block (beside the drill sergeant's xpDrill and nfAfterKeep) calls BohemiaCamp.lose(id, why) for each
  one lost.

### C9. On their turn, and AUTO

- **They move by themselves, never by his hand** (a new ai.json archetype `staff`): with an enemy next to him and not Breaking
  or Fleeing, he swings his knife; else he steps to the open tile behind the line nearest his nearest fighter, farther from the
  enemy; Fleeing, flee() as now. They take their turn in the order like anyone (initiative 95 to 105), one beat each.
- **AUTO guards the camp:** in ai.json `crew.auto`, an enemy standing next to a staff member is worth x1.3 to AUTO's pick (draft,
  TUNING), and AUTO keeps one man beside the staff when it can.

### C10. The files to change

- records/target/bb/retinue.json: a `staff` block (the stat line of C3 with its source, the trait list, the gear, `starts`
  Wavering, `struck_down` dead, `pull` per family, `raid` 1 in 5 and 2 men), every field described for a modder; bake with
  tools/bohemia_retinue_bake.js.
- records/target/bb/ai.json: `camp_pull` (C5), the `staff` archetype (C9), `crew.auto.guards_the_camp`.
- engine/bohemia_camp.js: staff() (the followers with him as fight people, stats and trait rolled once and kept), lose(id,
  why), the `dead` list, and inTown dealing a new person for a kind whose person is dead.
- slices/BOHEMIA_ALPHA_0_9.html, the fight's door: `o.staff = BohemiaCamp.staff()` beside `o.company`; the first-fights cap and the
  party sizing count `o.company` only; the hand-back calls lose().
- slices/BOHEMIA_FIGHT.html: setup() (fighters = cap - staff, main man always; staff units with `staff: true`), deployCrew()
  (the third column, the camp square), check() (start Wavering, never Confident), ripple() (no check on fighters for staff),
  fall() (staff die), bestTarget() (the pull), the staff turn, the raid start, the result rule (C8), `S.staffOut`.
- slices/bohemia_job_danger.js (o.company and crewNow) and records/target/bb/party_math.json's reader: fighters only.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: retinueTake and the hall's Hire both shut when fighters + staff reach the company cap
  (the cap is not enforced at all now, B7); TAKE ON says the cost in plain words, draft:true ('She stands in your fights. One of
  your 12.').
- slices/BOHEMIA_ROSTER_SCREEN.html: the title counts them ('YOUR COMPANY 14 / 20, 12 IN A FIGHT, 3 OF THEM CAMP'); the line-up
  shows them in the back.
- slices/fight_rig: the 13 missing follower sheets (B7), from the lane that bakes the fight's sheets, before the build ships.
- gates/the_staff_fight_too_gate.js (new, in the suite as THE STAFF FIGHT TOO); keep green gates/no_cap_on_how_many_fight_gate.js,
  gates/the_retinue_gate.js, gates/settlement_screen_gate.js, gates/the_origin_sets_the_company_gate.js.

### C11. The checks that prove it (the gate's legs, and the phone)

1. **The cap.** A NEW CREW with 14 fighters and 3 staff: the board holds 9 fighters and 3 staff, 5 named in the reserve, YOU
   standing. THE BLOCK WATCH with 3: 13 and 3.
2. **Where they stand.** Every staff member at the bell is west of his back column (or on the camp square in a camp fight);
   none in the front column; none next to an enemy.
3. **Their nerve.** Over 200 seeded fights: every staff member starts Wavering and is never Confident; a staff death fires no
   morale check on a fighter and does fire one on another staff member.
4. **Their death.** 100 staff struck down, 100 dead; after the hand-back BohemiaCamp.has(id) is false and the cook's food
   multiplier is back to 1.
5. **The pull.** 300 seeded AUTO fights against roaming crews with 3 staff: the share of their blows on staff is higher than
   with the pull set to 1, by the file's own number.
6. **The enemy does not grow.** The map's party for 7 fighters and 5 staff is the party for those 7 fighters alone.
7. **Re-hire.** After the cook dies, the hall deals a cook again within the measured town-weeks; a new look and name, never the
   dead one's; the dead look in no town crowd.
8. **The company cap.** With fighters + staff at 20, the hall's Hire and TAKE ON are both shut, with the words why.
9. **On the phone.** The demo at 390 x 844 upright and on its side: a fight with 3 staff shows each behind the back row in his
   own body and face; no page scroll sideways; the fight holds 60 frames a second in its first ten seconds (PLUMBER's bar).
10. **It got harder.** 500 AUTO fights with 5 staff against 500 with none (the same fighters' quality): the win rate drops by a
    measured amount, and the routine fight stays inside 2 to 4 minutes (rule 9/29). This is the leg that answers 'too easy'.
11. **Planted controls go red:** staff counted outside the cap (17 on the board) turns leg 1 red; staff rolling the 20% turns
    leg 4 red.

### C12. Build order

1. The data and the camp (retinue.json staff block, ai.json, bohemia_camp.js staff/lose). 2. The door and the fight (C1 to C4,
C6 to C8). 3. The hall's and the crew screen's words, and the company cap enforced. 4. Re-hiring. 5. The pull and AUTO's guard.
6. The raid from behind. The 13 fight sheets run in parallel in their own lane and gate the ship.

---

## D. WHAT IS NOT DECIDED, AND WHY IT DOES NOT NEED PAOLO

Each has a default the lane builds; he corrects what he hates (EVERYTHING IS A THUMB).

1. **Do staff do a job in the fight** (the surgeon patching, the scavenger picking up)? Default: no. Battle Brothers' followers
   help off the field; a fight job can be added later without undoing anything.
2. **Can he move them on his turn?** Default: no, they move themselves (C9). A routine fight must stay 2 to 4 minutes on a
   phone, five more men to tap would stretch it, and real followers were not under the captain's orders. Protecting them is his
   fighters' job.
3. **Can he give them armour or a better weapon?** Default: no. They must stay weak, his own words ('weaker... not gonna have
   the best traits'); a cook in plate is a fighter.
4. **Do they level up?** Default: never. They are not soldiers; Battle Brothers caps even its fighting debtors at 7.
5. **The raid from behind** (C5): default on, 1 fight in 5 against raiders, 2 men at most, never in the first fights. It is
   the most real thing in the history (Agincourt) and TUNING can turn the 1 in 5.
6. **Staff in the pit:** default no (C1).
7. **Does a staff death shake the fighters?** Default no, Battle Brothers' Indebted rule; it keeps one death from routing the
   line.
8. **Can taken staff be rescued?** Default no for now. A rescue is a job, and job content waits on its own research.
9. **Re-hire price:** default the same price. Battle Brothers charges once per hire; the time to find one is the real cost.
10. **More than five, as real camps were bigger than armies?** Default no: five places, Battle Brothers' and his own limit (B6).
11. **Origins with their own camp rule** (THE WATER TRUCK is a caravan, it could carry more): default none; TUNING's origin pass
    can add one.
12. **Do staff eat or draw a wage?** Default unchanged: bought once, no wage (rule 56).
13. **A wagon on the board as cover** (Battle Brothers' caravan donkeys and cart): default no outside a camp fight; in a camp
    fight the camp's own pieces already stand there (CAMP THREE).
14. **The shield-and-traits ease itself:** this change answers it by adding risk, not by touching the shield. TUNING measures
    whether it worked (C11 leg 10) and owns any shield number.

[bb Battle Brothers: five non-combat followers by renown, a fight of 12 (16 for the Militia and the Manhunters), and the
Manhunters' Indebted who die when they fall and shake nobody when they do; ours puts the followers on the board and makes them
the Indebted.]
[analog horror: when the cook dies her pot stays on the fire; the next cook the hall deals never asks whose pot it was.]
