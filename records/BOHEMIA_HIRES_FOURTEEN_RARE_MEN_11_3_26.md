# HIRES: FOURTEEN RARE MEN, EACH WORTH WANTING, EACH HIS OWN LOOK (rule 351(a), ask line 361; HIRES 11/3/26)

## HIS WORDS (verbatim, records/BOHEMIA_PAOLO_THE_CEILING_AT_DAY_20_11_3_26.md)
"right now I'm at day 20 with like 10 super soldiers damn near I only hired like when I saw it was rare first off. We need more more
rare characters, bro like I think three of them are named the same thing in my company"

He hires ONLY when he sees a rare one. So the rare ones are the game's reason to grow a crew: there have to be more of them, each
one has to be worth the batteries, and each has to look like himself, not like the townsman in the next slot.

## MEASURED BEFORE
- records/target/bb/rare_recruits.json held THREE men (RUN TWO 10/25: the road knight, the gun for hire, the blade master), 3 in 100
  a slot, towns and fortresses only.
- A rare man wore WHATEVER BODY THE SLOT DEALT (`rm.look = r.look` in __THE_RARE_MAN_AT_THE_POST__): a road knight was a random
  townsman, so two road knights a week apart were two different men, and a rare man could wear the face of a common man at the
  next post. What made him read as rare was a gold glow round his card.
- His card said RARE, his level, his kit and one line. Nothing said WHY you want him over the 37-battery man beside him.
- The common floor (engine/bohemia_goodbros.js, the six at every post: farmhand, messenger, butcher, brawler, thief, militia) tops
  out at HP 70, fatigue 120, resolve 45, initiative 120, melee 62, ranged 47, both defences 13.

## [bb] BATTLE BROTHERS IS THE FLOOR (the library, reference/library/grok/wiki)
Every row below is the wiki's own (records/target/bb/backgrounds.json, cross-checked against bb_all/0368 Attribute Ranges), and the
odds a vacant slot holds that background are bb_all/0370 Character Backgrounds_Sources. Battle Brothers' guide on price (bb_all/0827
Game Guide): "from 30 for the worst ones up to around 150 for the best ones. Swordmasters are an exception with a base cost of 400!"
The library has no per-background starting-gear rows (the wiki pages carry stats, wage, level, traits, events only), so each kit is
ours, built from real weapons.json/armor.json rows (RUN TWO's measured hedge knight kit kept).

| ours | Battle Brothers | start level | base wage | its odds a slot (bb_all/0370) | where ours stands | perk he walks in with |
|---|---|---|---|---|---|---|
| ROAD KNIGHT | Hedge Knight | 2-5 | 35 | cities 2.2-2.8%, forts 2.6-5.7% | town, fortress | Shield Expert |
| GUN FOR HIRE | Sellsword | 2-4 | 35 | cities 2.2-3.3%, forts 2.9-8.3% | town, fortress | Bullseye |
| BLADE MASTER | Swordmaster | 3-5 | 35 | cities 2.2-3.0%, forts 2.4-3.7% | town, fortress | Sword Mastery |
| CONTRACT MAN | Assassin | 4 | 25 | Blazing Deserts city-states, no % row | town, fortress | Adrenaline |
| LAB HUNTER | Beast Slayer | 2-3 | 15 | cities and villages, no % row | camp, town, fortress | Crippling Strikes |
| OLD GUARD | Retired Soldier | 2-3 | 15 | cities 2.2-5.1%, forts 2.4-15.4%, villages | camp, town, fortress | Rally the Troops |
| PIT FIGHTER | Gladiator | 2-4 | 35 | city-states only, no % row | town, fortress | Taunt |
| CASINO HEIR | Adventurous Noble | 1-3 | 25 | cities 2.2-5.0%, forts 2.7-7.7% | town, fortress | Student |
| STATIC HUNTER | Witchhunter | 1-3 | 13 | cities and villages 2.4-8.0%, forts 2.4-9.1% | camp, town, fortress | Fortified Mind |
| DUNE RIDER | Nomad (melee) | 2-4 | 28 | desert city-states, no % row | camp, town | Pathfinder |
| DESERT WILD | Barbarian | 2-4 | 20 | the north, no % row | camp, town | Colossus |
| CASINO GUARD | King's Guard | 3 | 30 | events only in Battle Brothers | town, fortress | Steel Brow |
| OATH KEEPER | Oathtaker | 1-3 | 22 | forts 2.4-4.5% | town, fortress | Nine Lives |
| ROAD RAIDER | Raider | 2-4 | 28 | cities 2.5-4.9%, forts 2.4-14.3% | town, fortress | Fast Adaptation |

Battle Brothers puts the beast slayer, the retired soldier, the witch hunter and the wild men in VILLAGES too; our camp is its
village, so those five can stand at a camp. The rest are the cities' and the forts' (our towns and fortresses).

## THE SKINS (2050, the economic apocalypse; realism first; who he was is in rare_recruits.json 'who', draft)
- ROAD KNIGHT: a highway patrol trooper who kept riding the 95 after the state stopped paying him.
- GUN FOR HIRE: a private military contractor's rifleman; the firm folded with the dollar, he kept the rifle.
- BLADE MASTER: thirty years the sword in a Strip casino's dinner show; the show closed, the blades stayed sharp.
- CONTRACT MAN: the one the casinos sent when a debt could not be paid.
- LAB HUNTER: kept the de-extinction lab's pens; when the money died the clones got out, and he knows every one (rule 42: the beasts
  are lab-made).
- OLD GUARD: a Guard sergeant whose pension died with the dollar; he still stands a line like it is drill.
- PIT FIGHTER: a cage fighter out of the Mob's pit, the crowd's favourite the year the lights went half out (rule 375's arena).
- CASINO HEIR: a casino family's son, fenced at a private academy; the fortune went to zero; he wants a story.
- STATIC HUNTER: hunts the static listeners (the valley's cultists); he has heard the broadcast and it did not take him.
- DUNE RIDER: a rodeo rider off the old circuit; the bulls are clones now. His bullwhip is a whip row (rule 320: reach two).
- DESERT WILD: ten years off the grid in the Spring Mountains; he walked down and the money was gone.
- CASINO GUARD: a casino's head of security, twenty years of the floor; the casino is dark, he is not.
- OATH KEEPER: a burned-out SWAT medic; he swore to bring them back and still does.
- ROAD RAIDER: a convoy raider who walked off when his crew turned on each other.
Nobody's line is Spanglish (rule 355) and nothing says Las Vegas (rule 362).

## EACH HIS OWN LOOK (rule 337: the asset ships with the content; rule 115: the rig's look is the look)
Every rare man is ONE person of the valley. tools/bohemia_hires_the_rare_men.py hand-picks every piece from CHARACTER's barber's book
(records/target/character/BOHEMIA_THE_BARBERS_BOOK.json; never rolled, every name checked and none held): his heritage and skin
tone, his cut and its colour, his face shape, his beard, his mark, his hat or face piece, his top and his coat (the runway: the
blade master's wrap coat, the contract man's comma coat, the heir's split-tail leather, the pit fighter's stacked jersey pant), his
trousers, his boots, his gear (pauldrons, chest rigs, bandoliers, bracers, gorgets). Then RUN TWO's own people tool (imported, not
edited) builds him with CHARACTER's person builder and renders him on DIRECTION's master rig: eight stills, the walk, the portrait
and the four speaking mouths, and COMBAT's six fight clips; packed into his own fight sheet (slices/fight_rig/person_rare_<n>.webp,
in the place's people's cell with their guns), his face on the fight's face strip, his walk sheet (slices/rig_walk), and into the
people mix as gang 'rare', marked rare, NEVER fight: true and in no gang's pool, so no common post slot, crowd, map sheet or
main-man pick ever deals his body. No two share a top and a coat, or a cut and a face shape; the one trench is the static hunter's
(TRENCHCOATS ARE FOR BADASSES: the cap governs the random crowd, a man made by hand wears what he is; the rest are jackets, vests,
a chore coat, a poncho and the runway's shorter coats, a desert).

A rare man you hired never stands at a post again (his look is in your company); one rare man never stands twice at one post;
his name is seeded by his body, so he has the same name at every post (BohemiaUniqueName still makes it unique in your company,
rule 351(b)).

NEVER A GLOWING BORDER: the gold glow RUN TWO drew round his card is gone. He reads as rare by his card and his look: he stands in a
lit spot on his card (the only man at the post who does), in a body no other man wears; RARE and his level on his card's first
line; the perk his trade taught him and why you want him in gold.

## EACH WORTH WANTING (the edge line, rare_recruits.json 'edge', draft)
One line on his card: the perk he walks in with and what it does in plain words, then what he brings. The perk is his trade's (the
crew screen takes it off one of his level points, rolledIn's own rule, so it is the RIGHT perk, not an extra one; the fight reads
every one of the fourteen perks already). His stats: Battle Brothers' way, RUN TWO's (kept): level 2 or 3, rolled in the top
quarter of his background's range, his levels taken on four picks a level off his plan, three talents (stars), his own kit on him.
MEASURED (gates/more_rare_hires_gate.js H3): every one of the fourteen's WORST possible roll at level 2 beats the best possible
common man at the post in at least one stat (see the gate's line for each).

Prices (the hall's formula, base + 500 x (level - 1)^1.5 + kit x 1.25, x the hall's four fifths, in batteries; base: the guide's
30 to 150 laid along the wiki's base wage, 40 + 4.4 x (wage - 10) to the nearest 10, the blade master's 400 kept):
static hunter 102 to 175 (the cheap rare one), dune rider 175 to 248, oath keeper 182 to 255, desert wild 191 to 264, gun for hire
227 to 300, lab hunter 229 to 302, contract man 232 to 305, blade master 303 to 376, casino heir 331 to 404, road raider 332 to
405, casino guard 366 to 439, old guard 382 to 455, pit fighter 420 to 493, road knight 500 to 573.

## HALF OR MORE ARE MELEE (rule 351(a) AMENDED, Paolo 11/3, ask line 410: 'more rare melee guys all the rare guys i saw were ranged only')
MEASURED, the cause: RUN TWO's three were two melee men and a rifleman, yet every card drew the man holding the PISTOL that rides in
his bag (rule 120(a): every man at the post holds a gun; hireGun() takes the first gun in his kit) and printed PISTOL 1-4 TILES as his
weapon, so the road knight with his winged mace and riot shield read as a shooter. NOW: eleven of the fourteen fight with a melee
weapon in hand (road knight's pipe and riot shield, blade master's pawn-shop katana, lab hunter's boar spear, old guard's spear and
car door, pit fighter's chain, casino heir's fencing sword, dune rider's bullwhip, desert wild's splitting maul, casino guard's baton
and crash-bar riot shield, oath keeper's hammer and cracked riot shield, road raider's sign-post halberd); his card shows HIS weapon
(its icon, its name, its reach: CHAIN 1 TILE) and stands him bare of the gun (rareArm(), __FOURTEEN_RARE_MEN__); his pistol is still
in his bag; in the fight he walks in holding his melee weapon (his kit's main, as before) and the fight draws it in his fist off his
cell's props (YOU's, his ref), like every rolled man of the place. The casino guard (the coordinator's 'ex-casino head of security
with a baton') carries the baton and a riot shield, his snub revolver in the bag. Three shoot: the gun for hire, the contract man,
the static hunter.

## HOW OFTEN (TUNING owns the number: it is in TUNING's table now)
The chance lives in records/target/bb/ours.json rare_at_the_post (value.chance_per_slot 0.06, levels [2, 3]), the file TUNING's one
numbers table reads (tools/bohemia_tuning_one_table_seed.js reads ours.json); the settlement screen reads that row first and the
rare file's own chance_per_slot only if the row is missing. Battle Brothers keeps each rare background between 2.2 and 8.3 in 100 a
slot; we keep the WHOLE rare share inside that band at 6 in 100, so a careful player meets one every few towns:
- a town's four slots: 1 - 0.94^4 = 22% of weeks (about one visit in 4.5)
- a fortress's six: 31% (one in 3.2)
- a camp's two: 12% (one in 8.6), the village kinds only
- market day's two more and the recruiter's two to four more raise it.
Which man: his weight among the men that place may hold (Battle Brothers' odds; the rarest kinds, blade master, contract man,
casino guard, weight 1). TUNING 2 HOLDS THE RISK: his own 'I'm unstoppable with rare men in cheap gear' (ask line 396) is theirs;
a rarer chance or a dearer man is a one-number change in that row.

## THE GATES
- MORE RARE HIRES (new, gates/more_rare_hires_gate.js): the file; each his own look (pieces apart, every file on disk, rare in the
  mix, in no pool or band); the edge over the common floor; TUNING's chance read and measured; camps only the village kinds; no
  common slot wears a rare look; a hired one never comes back; THE SEEDED TEST (BohemiaSettlement.showRare(kind) puts each of the
  fourteen in the post's first slot: his card in HIS body, drawn, RARE, his edge, his words, three stars, the spotlight and no glow,
  fitting 390 px); one man one name; the demo shows one through its own town door.
- THE RARE MAN AT THE POST (RUN TWO's) and THE BEST RECRUIT AT THE TOP (RUN THREE's) re-aimed: the rate is TUNING's row, the camp
  holds the village kinds, the card's mark is the spotlight.

## ROUTED (NOTES, not done here)
- TUNING 2: the chance (0.06) and the price formula are yours in ours.json rare_at_the_post; ask line 396 says rare men in cheap gear
  are too strong; the rare man's perk takes one of his points, so no man is stronger than his level allows.
- WORDS: every 'edge', 'line' and 'who' is draft:true; rewrite any.
- DIRECTION / COOK THREE: the fourteen outfits are a coordinator-free default from the barber's book; re-dress any piece in
  tools/bohemia_hires_the_rare_men.py DESIGN and run `all` (about an hour on four cores).
- COOK ARMOUR (rule 337): the kit each man walks in with is existing armour rows; how armour shows on the body is yours.
- ANIMATION: no gun-held idle yet for the fourteen (slices/rig_idles/fight_person_rare_<n>); his card stands him in his fight sheet's
  carry still until one is made, like every man whose idle is not in.
- RUN TWO: tools/bohemia_run2_no_two_people_alike.py fight-pack rewrites fight_rig.json's 'person' rows and the face strip from its
  own roll; run `python3 tools/bohemia_hires_the_rare_men.py pack` after it, or MORE RARE HIRES goes red (H2).
