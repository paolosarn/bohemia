# TAKING A TOWN: THE CHAIN, THE THREE DOORS, AND THE ONE NUMBER WE HAD WRONG
FACTIONS lane, round 63, 10/18/26. Row [take a town] (OWNING-ANOTHER-SETTLEMENT-IS-ENDGAME, rule 56).
Opened by the coordinator under rule 112; no check-in, no question. The lane is under the rule-88 hold
(pages without sheets): a page, a data file, a module nothing live reads yet, a gate. Nothing drawn,
nothing in VOTE, nothing in the demo. NOT IN A TAB. The row's VOTE half (the chain as a timeline) is owed
the round the hold lifts; the timeline is already computed (BohemiaTake.status), so that round is a picture.

## THE ONE-LINE ANSWER
Battle Brothers never lets the company own a town. Its noble houses take each other's towns late in the
game, and they hire you to do the siege; the town goes to the house. Ours keeps that chain, five steps
long, and ends it the way he said: the town is YOURS, or it is RUINED, by you. It opens only in the last
third of an act, only for a company that already has a base of its own, and only once per act.

His words: "owning other settlements is a big deal, endgame, not cheap; not even Battle Brothers lets you
take over a city; your settlement at your base" (fifth votes, 10/1); "if you attack the whole faction
settlement it's yours or ruined" (third votes, 9/28); "I want you to be easier than Battle Brothers"
(rule 117, 10/18).

## WHAT WAS MEASURED BEFORE ANYTHING WAS WRITTEN
- The home base ledger (engine/bohemia_homebases.js, this lane's) already has the two writes a take needs,
  took() and ruined(), and already lists 'contract' as one of the four ways a base changes hands (his
  9/29 words: "raid, contract, boss verb, deal"). NOTHING EVER WROTE ONE BY 'contract'. The world takes
  bases (the raid chain, by 'raid'); the build screen marks your own (took to 'you'); the company never
  took anybody's.
- The ledger already draws his "hard ones late in an act" as thirds (openAt: camp 0, town 1/3, fortress
  2/3, off his DEPTH table in bohemia_towns.js). That is when a base may be RAIDED. Owning is not raiding:
  the take waits for the fortress third (2/3) whatever the tier.
- The canon graph (bohemia_between.js) has ONE war pair in the valley (Cartel and Remnants) and three
  hostile edges in all (the Cartel, the Caravans and the Remnants). So "a house at war hires you", Battle
  Brothers' only door, opens on two or three of fourteen bases. That is why there are three doors.
- arrival_traits.json said Conquered's length was "not on the wiki" and used the shared 7 days. It is on
  the wiki: 3 days (below). Fixed this round.

## WHAT BATTLE BROTHERS DOES (every line re-read out of the wiki tarball by the gate; 25 lines)
1. THE COMPANY NEVER OWNS A TOWN, ON PURPOSE. The developer: "Having a permanent base, like a castle or
   such, will make the player very stationary." (Developer Posts.) They built a mobile company instead.
   We have home bases (his third votes), so taking a town is OURS, and he already knew it: "not even
   Battle Brothers lets you take over a city".
2. TOWNS CHANGE HANDS ONLY IN THE LATE WAR. War of the Noble Houses: "They begin to take over rival
   settlements reducing those settlements supply/wealth levels without destroying them." (Late Game Crises.)
3. THE WAR IS GATED ON TIME, NOT FAME. "it will be foretold around the 50th to 70th day of the campaign and
   start around the 80th - 100th day." and "There is no renown requirement for a crisis to start, but a
   certain amount of days need to have passed in your campaign, as well a minimum roster". (Late Game
   Crises.) Ours: the act's late third.
4. IT IS LONG. "A crisis can take from 30 to 100 days to finish although its possible to drag it even
   longer." (Late Game Crises.) Ours: five steps, never a click.
5. THE WAR GOES ON WITHOUT YOU. "While the war will finish with or without you" (Late Game Crises.) Ours
   already does this: the raid chain lets the world take a base whether you come or not.
6. THE CONTRACTS. "Raid enemy caravans and settlements", "Besiege enemy forts" (Late Game Crises).
7. THE SIEGE CONTRACT IS THE CHAIN (Siege Fortification): hold the siege ("You will maintain the siege and
   intercept anyone trying to break through."), the town is Besieged while it runs ("During the contract
   the settlement will have the besieged settlement situation."), it can end with no assault ("The
   objective has fallen. Your opponent surrenders."), or by fire ("After the castle was set on fire"), and
   then one more fight ("The defenders send their last attack force at you."). The holy war's version
   adds the choice to stand, attack or run, where running fails the contract (Conquer Holy Site Northern).
8. CONQUERED IS 3 DAYS. "After this contract the settlement will gain the conquered settlement situation
   for 3 days." (Siege Fortification.) The one length the wiki prints for it.
9. A HOUSE HIRES YOU ONCE IT KNOWS YOU. "Become known as 'Professional' (1,050 renown) in order to catch
   the attention of the noble houses." (Make Nobles Aware.) Allied Nobles asks "'Open' or higher relations
   with at least one noble house". Ours: the employer's bar at Open (60) or better.
10. WHERE THE WAR STANDS IS SHOWN IN FOUR WORDS: "Just started", "Raging", "Dragging On", "Almost Over"
    (Defeat Civil War, which also asks 1,500 renown). Ours: the five steps lit, no fame gate.
11. A FORTRESS HAS NO TOWNSFOLK. "Fortified settlements (Fortified Manor/Castle/Stronghold) are fully
    affiliated with their Noble House and do not have separate" bars (Relations). So nobody inside opens a
    fortress's gate.
12. THE DEVELOPER WANTED EXACTLY THIS. "Open conflicts between nobles are a great opportunity for
    mercenaries and this could also lead to settlements changing allegiance thus having a lasting impact on
    the world." and, on rebuilding a fallen town: "The most straight forward solution would obviously be a
    contract where you are hired to help retake and rebuild a settlement." and "not helping a town under
    siege could mean it being razed and no longer available in the game world as a place of commerce and
    safety in the region." (Developer Posts.) A contract, a lasting change, and a ruin that is a real loss.
13. ENDING THE WAR IS THE GOOD ENDING. Retirement's "Leaving a Mark" needs "One late game crisis ended".
    Ours: a town taken is what the next generation inherits (rule 31's derive reads the ledger).

## THE REAL WORLD (two hired captains who took the city)
- BRACCIO DA MONTONE, PERUGIA, 1416: beat Perugia's army at Sant'Egidio on 12 July 1416, with exiles
  from Perugia itself in his force, entered days later and was acclaimed lord; the Pope recognised it in
  1420. https://en.wikipedia.org/wiki/Braccio_da_Montone,
  https://en.wikipedia.org/wiki/Battle_of_Sant%27Egidio. THIS IS THE INSIDE DOOR.
- FRANCESCO SFORZA, MILAN, 1447 TO 1450: hired by the Ambrosian Republic, broke with it in 1448, took the
  city after a siege in early 1450 and was made duke. https://en.wikipedia.org/wiki/Milanese_War_of_Succession.
  THIS IS THE HIRED DOOR AND THE LONG CHAIN: a captain ends up holding the town he was paid to fight for.
  (The sources disagree on the day he entered, 26 February or 22 March 1450; nothing here reads the day.)

## THE FINDING THAT PROVED US WRONG
records/target/bb/arrival_traits.json gave Conquered a length of 7 days and wrote "not on the wiki" beside
it. The Siege Fortification contract page prints 3 days. FIXED: traits.conquered.duration_days = 3 with its
source and quote; bohemia_arrivaltraits.markTaken reads it; raided and well supplied keep the shared 7
(that one really is not on the wiki); the WAR gate now checks the wiki's 3 days instead of "a week".
The library line on crises (reference/library/battle_brothers/01_WORLDMAP.md) gains the chain's facts
with their pages (rule 33j).

## THE SHAPE FOR US: FIVE STEPS (records/target/bb/take.json, engine/bohemia_take.js)
| # | step | closes when | Battle Brothers |
|---|---|---|---|
| 1 | THE ASK | a door is found, the late third has come, you hold a base of your own, this act has no take yet | the war comes late; a house hires you once it knows you |
| 2 | CUT THE ROADS | the holder has no party out (the caller counts them) | "Raid enemy caravans"; "intercept anyone trying to break through" |
| 3 | THE SIEGE | held for the siege days (4, the raid at your gate's own warning days) | "You will maintain the siege" |
| 4 | THE GATE | SURRENDER after the siege (no fight), ASSAULT any time after the roads (one fight; lost fails it), or BURN (a ruin, by you) | "Your opponent surrenders"; "the castle was set on fire" |
| 5 | THE HOLD | the old holder's last force is beaten, or nobody is left to send one | "The defenders send their last attack force at you" |

THE THREE DOORS (step 1 needs one; the data file's order is the order they are tried):
- HIRED (Battle Brothers' own): a faction hostile to the holder in canon, at Open (60) or better with
  you. On the real valley: the Remnants hire you against the Cartel's fortress at 60 and not at 59.
- INSIDE (Braccio's): a faction living on the holder's ground (the hidden four live inside other factions)
  at Open or better with you. Never at a fortress (item 11).
- BEEF (his sixth votes): the holder's own bar with you is Hostile (9 or under). The Church at 9 is yours to
  go after; at 10 it is not.

WHO SENDS THE LAST FORCE (step 5): the holder, if it holds another base; else a faction WARM with the holder
in canon that holds a base of its own. On the real valley the Remnants are warm with the Mob (professional
respect), so taking the Mob's fortress means beating the Remnants' last force; with the Remnants' base a
ruin, nobody comes and the gate is the end. No roll decides it.

WHAT IT WRITES: one ledger entry, base from the holder to the company, by 'contract' (the first use of the
fourth way his 9/29 words named), and Conquered for 3 days through the arrival traits. Or one ruin entry,
by 'contract', on a burn. A lost assault or a lost hold writes nothing and spends the act's one take.

WHAT REFUSES (the "no code that makes it cheap" half; each one is a gate check): TOO_EARLY (every tier,
even a camp you may raid from minute one), NO_PROGRESS (never a guess), NO_HOME, RUIN, ALREADY_YOURS,
ALREADY_OPEN, ONE_PER_ACT (failed or won; the next act opens it again), NO_DOOR, OUT_OF_ORDER, NOT_YET,
SIEGE_NOT_HELD, MOOT (the world took or burned it mid-chain).

## EASIER THAN BATTLE BROTHERS (rule 117)
- No dice: Battle Brothers rolls the surrender (its 40% branch) and the last force (its 60% branch); ours
  decides both from what you did and who is left.
- No fame gate: Battle Brothers' war ambition asks 1,500 renown; ours asks the late third and a home.
- One clear next thing: the timeline lights the step you are on.
- Patience is a win: hold the siege its days and the gate opens with no fight.

## [bb take a town] (the school line)
Battle Brothers: towns change hands only in the late war, by houses, with the company hired for the siege;
the siege contract is hold, surrender or assault or fire, then the defenders' last force; Conquered 3 days.

## [better than bb] (the line)
Battle Brothers' late war ends with the town going to whoever hired you, so you never care which flag flies
over it. Ours: the town is yours, it is a base your next generation inherits, and the people who opened the
gate from inside are still there. FACTIONS.

## GAPS (written in the data file too)
- THE REGION'S TWELVE PLACES: the ledger keys a base by its name and seeds its holder as that name, so
  Henderson's holder reads 'henderson', not the Trades. The take module takes the seed from the caller, but
  the ledger entry would record from:'henderson'. One line in homebases put() closes it: FACTIONS [region in
  the ledger], the new top OPEN row.
- BESIEGED is quoted but no trait file carries its numbers; RUN TWO's settlement traits own the list.
- THE INSIDE DOOR needs who lives on whose ground; the hidden four are people, not a per-base list; the
  caller hands it in.
- THE TIMELINE IN VOTE, the round the hold lifts.

## ROUTED
- RUN TWO: the settlement screen of a town you could take shows status() and the one next thing; a town you
  took is your base (ownedBy), which the build screen already reads.
- RUN: the map's day hands in act progress, each holder's parties out, and the siege days.
- COMBAT: two fights call back into step(): the ASSAULT at the gate and the LAST FORCE at the hold.
- TUNING: siege_days (4) and per_act (1) are drafts for the one table; the rest are the wiki's or his.
- WORDS: the five step names are drafts; a town's people say the ask from a mouth with a portrait.

## PROOF
gates/take_a_town_gate.js (TAKE A TOWN, registered) 172/0 on the real valley, seed 12345; red on six module
mutations (the late third 14 checks, the home 1, one per act 2, the order 12, the siege before a surrender 7,
the write's 'contract' 1) and on a false quote. WAR 39/0 (now checks the wiki's 3 days), ARRIVAL TRAITS 45/0,
THE ARRIVAL 37/0, FACTIONS 679/0, WANTS SEND PARTIES 111/0, REGION BASES 244/0, RELATIONS 66/0, HUNTED 35/0,
GATE REGISTRY 7/0. Red on main before this diff and not mine: HOME BASES 141/1 (slices/BOHEMIA_CITY_WORLD.html
reads the dead cell ledger), EVERY RUNNING LANE HAS A JOB 8/1 (MODS has two OPEN rows).
