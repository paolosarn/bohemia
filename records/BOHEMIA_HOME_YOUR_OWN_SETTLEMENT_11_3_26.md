# HOME, 11/3/26: YOUR OWN SETTLEMENT, RESEARCH ROUND ONE: WHAT THE BEST ONE-SCREEN BASES DO (rules 343, 347, 349; ask lines 352, 356, 359)

HOME is the LIFE + CITY lane's settlement chat (session_01GKDyuvGDg14E2BHw8zmmXJ). MODE: RESEARCH ONLY (rule 349) until he picks a
direction. Nothing in this round touches the game.

## HIS WORDS, THREE TIMES IN ONE NIGHT
- 11/2, VOTE tab, on WHAT A KILL DOES (rule 343, line 352): "Why dont we incorporate it into the custom settlement system? Instead of doing
  some bullshit we can have our settlement stardew valley bohemia vibes where u have the same real estate as the other settlements but u
  can actually impact it!"
- 11/3 (rule 347, line 356): "a settlement that saves civilization... literally every thing in our custom settlement can be customized...
  this is also where unique people throughout the journey can post up... super easy to customize... that pseudo mayor vibe... you plant
  your part of the city kind of wherever you want... you gotta be in charge for like the daily battery usage... not Valheim tile by tile,
  a Stardew Valley vibe... are you sure you wanna plant down here, this is permanent".
- 11/3 (rule 349, line 359): "before you build anything... rounds of big brain research... it's literally just gonna be one screen...
  one screen to extremely customize... maybe an indoor system... two screens as an upgrade, maybe when act two starts... I want this to be
  AAA and premium".

## 1. THE BUILD ROUND THAT WAS STOPPED (rule 349(a)), SAID PLAINLY
The first brief (rule 337, assets first) had this chat model the six lot pieces. Rule 349 landed while the first full render ran. Stopped
then: the render killed, NOTHING pushed to main (no models, no screen, no data, no VOTE card, no stamp, no cut). What existed is kept off
main on the branch `home-stopped-build-11-3` (c3330d38): tools/bohemia_home_your_own_lot_11_3_26.py (the kitchen with THE POT's own pot on a
cinder-block rocket hearth under a tin lean-to; the main from the curb-stop box with THE TAP's own wrench; the purifier as a slow sand bed
with THE FILTER's own housing as the pre-filter; garden beds; a rain tank; a three-panel rack and battery cabinet; each bare, built and
working, through the town screens' own camera, ground, light and rig) and one quarter-size test sheet. If his pick wants fixed lots with
those pieces, that tool is the start; if not, it stays on the branch.

## 2. WHAT THE GAME HAS TODAY FOR A PLACE OF YOUR OWN (measured on 97f25c40, reuse first)
- engine/bohemia_lotbuild.js: 8 builds (shed, pump house, garden bed, solar panel, vendor stall, roof, wall, water tank), each 1 battery and 1
  day, each makes exactly one of the six (or houses a family, or guards); finished builds are deeds the derive counts in acts 2 and 3; a raid
  can take or burn them (records/BOHEMIA_BUILDING_IS_BACK_ON_YOUR_OWN_LOT_9_29_26.md, ..._EVERYTHING_YOU_CAN_BUILD_10_1_26.md). NO LEVELS: a lot
  holds one thing, built once.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: one painted picture per town (tall and wide), buildings are the buttons; for a place you hold it shows
  ONE lot box and ONE build box per tier (LOTBOX, BUILDBOX), so a home today is one lot on one screen.
- His picks that stand: 9/29 'you build on what you hold, and what you hold grows block by block' (the map); 9/29 'look how Battle Brothers
  does it' (building is seen in the settlement screen); 10/1 'garden bed, water tank and solar panel only' (the build list for now).
- The bill: records/target/bb/nightly_bill.json, 2 batteries a man a night ('a ration ONE and four litres ONE').
- The bosses: THE POT, THE TAP, THE FILTER each hand a verb on the phone (records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md); nothing of
  theirs stands anywhere you own.

## 3. THE RESEARCH: SEVEN GAMES, WHAT EACH PUTS ON ONE SCREEN (real sources; direct page reads are blocked in this container, so every line
## below is from the cited search results, and the ones a source could not confirm say so)

| game | the one screen | a tap does | depth vs ease | upkeep | growth you SEE | the itch | numbers |
|---|---|---|---|---|---|---|---|
| FALLOUT SHELTER (Bethesda, 2015) | a vault seen as a cross-section, 'an ant farm look' (TheSixthAxis) | tap a room to collect, drag a dweller into a room | rooms are few kinds; two or three side by side merge into one bigger room | power, food, water bars drain all the time | the vault goes DOWN floor by floor inside one shaft | 'play sessions surpassed 70 million times a day' in week one (Bethesda via GameBanshee) | $5.1M in two weeks (SuperData via GameSpot); 100M+ users (Bethesda via Ubergizmo) |
| DARKEST DUNGEON's HAMLET (Red Hook, 2016) | one painted town; the hub you return to between expeditions (Wikipedia) | tap a building to use it | ~9 buildings; each upgrades in place (the Blacksmith's gear, the Guild's skill levels, Training Regimen -10% a level, the Stagecoach's roster size) (wiki.gg) | heirlooms pay the upgrades; stress is treated in the Abbey/Tavern/Sanitarium | the same screen, each building visibly upgraded; the DLC added districts (Wikipedia, 'The Fire's Edge' 2026) | players argue build order in every forum (four orders in the results): the choice is the itch | 2 million-plus sold is NOT in these results; not quoted |
| SUIKODEN's CASTLE (Konami, 1995 to 2006) | your army's headquarters | walk in; the people you recruited are in it | the castle level comes from 'plot progression and the number of 108 Stars recruited' (Gensopedia) | none | it GROWS as you recruit: 'gambling, bath, storage, shops and more' unlock (Giant Bomb review); non-fighters 'enhance the headquarters' (MobyGames) | recruit all 108 for the best ending (Game8) | not quoted |
| CLASH OF CLANS (Supercell, 2012) | one village on one fixed plot | tap a building to upgrade it; drag to move it | many levels per building; the layout is yours and a shared design can be copied in one tap (ExitLag guide) | builders and timers | the same plot fills and every level changes the building's look | a GDC talk exists, 'Designing Games That People Will Play For Years' (GDC Vault listing; content not read) | not quoted here |
| FROSTPUNK (11 bit, 2018) | one city round one generator | build in rings | 'buildings grow around the generator in circles, streets are circular, and heat areas are radial' (lead designer, Xbox Wire) | coal: widening the heat zone 'sharply increases coal use' (Wikipedia) | the rings fill outward inside one view | survival against the cold | not quoted |
| THIS WAR OF MINE / SHELTERED (11 bit 2014; Unicube 2016) | the shelter as a cutaway, a doll's house (PCGamesN; Daily Dot) | assign a person, craft a stove, a radio, a workshop | few rooms, every object a real need | Sheltered: fuel runs the generator that runs the air and water filters (Wikipedia) | rooms fill with what you made | the people: a family member has one good and one bad trait (Sheltered) | not quoted |
| TOWNSCAPER (Oskar Stalberg, 2020) | one town on the water | tap a spot, pick a colour | NO choices but where and what colour; 'an algorithm ensures every block snaps together' (design-milk) | none | it rises as you tap | 'a toy rather than a game' (Stalberg); one critic: repetitive after 15 to 20 minutes (GOG) | ~100,000 early-access copies in just over two weeks (Edge) |
| (the counter-example) FALLOUT 4's SETTLEMENTS (Bethesda, 2015) | many settlements, free placement in first person | grab and place any piece | 'nearly every action in build mode was awkward' (Why I Quit Fallout 4); 'a constant struggle with the controls' (TechRaptor); no screen to manage settlers (forum list) | food, water, defence numbers | whatever you can wrestle into place | 'the best and worst new feature in the game' (Player.one) | n/a |
| (the cozy one he named) ANIMAL CROSSING NEW HORIZONS is NOT named by him; Stardew Valley IS (the feel, rule 133; the place that is yours, rule 343(d)). ACNH's 47 to 49 million copies (Nintendo via Nookipedia, Statista) are quoted only as the size of the 'place that is mine' itch, never as a reference. | | | | | | | |

### THE SIX THINGS THE SEVEN AGREE ON
1. GROWTH HAPPENS IN PLACE. Not one of the one-screen games adds land beyond the frame: Darkest Dungeon's hamlet never gets bigger, Clash's
   plot is fixed and fills, Fallout Shelter goes down inside one shaft, Frostpunk fills rings inside one view, Suikoden's castle opens rooms.
   What changes is the LEVEL, the DENSITY, the HEIGHT and the PEOPLE.
2. A TAP ON THE THING IS THE WHOLE INTERFACE (the hamlet, Clash, Fallout Shelter, Townscaper). Free placement is where it breaks
   (Fallout 4: 'nearly every action in build mode was awkward'). His 'super easy... not tile by tile' is the same finding.
3. EVERY UPGRADE IS SEEN. A level that does not change the picture does not count (the hamlet, Clash, Suikoden's new rooms).
4. THE PEOPLE ARE THE GLUE. Suikoden's castle grows from who you recruited; Cult of the Lamb's director: 'the glue has been these followers'
   (Julian Wilton, PC Gamer); Sheltered and This War of Mine are about the family in the cutaway. His 'unique people throughout the journey
   can post up' is this exactly.
5. UPKEEP IS A BAR THAT DRAINS (Fallout Shelter's three, Frostpunk's coal, Sheltered's fuel). His 'in charge of the daily battery usage' is
   this; it bites only if it is shown on the screen every time you open it.
6. THE ART RESOLVES ITSELF (Townscaper's snapping): the player picks WHAT and WHICH LOOK, the game makes it look right. That is how
   'extremely customizable' and 'AAA and premium' live together: no player ever makes an ugly settlement.

## 4. THE REAL WORLD, MEASURED
- WATER: Sphere's minimum is 15 litres a person a day, 2.5 to 3 of them to drink (ALNAP's summary of the Sphere standard; CARE's toolkit
  splits 7.5 to 15 L into drinking, hygiene and cooking); 25 L is the long-term goal (Sphere in Practice).
- FOOD: 2,100 kcal a person a day (the WHO baseline Sphere uses).
- SPACE: 3.5 m2 of living space a person, not counting cooking and washing (Sphere in Practice).
- LAS VEGAS RAIN: 4.18 inches a year at the airport (Review-Journal on the NWS normal; USGS lists 4.13 for 1961-90) = 106 mm.
- THE VALLEY'S READY-MADE CANDIDATES (the coordinator's default, real): the walled subdivisions behind block walls with one or two gates; the
  strip malls (a roof, a car park); the schools (a fence, a field); a parking garage (concrete, ramps, a top deck in full sun).

## 5. ONE FINDING THAT PROVES US WRONG (and two more), MEASURED AGAINST THE REPO
1. *** A RAIN TANK IN LAS VEGAS IS NOT A WATER SOURCE. *** 106 mm of rain a year on the stopped build's 3 x 2.2 m catchment roof is 0.70 m3,
   about 560 L after losses: 1.5 L a day, a tenth of ONE person's 15 L. Our WATER TANK reads '+1 water a day' (engine/bohemia_lotbuild.js)
   with no litres behind it, and the stopped build drew it as a rain catch. Realism first: in this valley a tank is STORAGE, filled from the
   main THE TAP opens or the purifier THE FILTER gives you; on its own it holds a day's water against a raid or a dry main, it does not make
   water. (The 10/1 drawing's 'downpipe off the roof' is the same mistake.)
2. ONE SCREEN DOES NOT GROW BLOCK BY BLOCK. Rule 347(b)'s default 'growing block by block' and the 9/29 verdict were written for the MAP.
   On ONE screen (rule 349(b)) every one of the seven grows in place (finding 3.1). So on the map the zone may grow; on the screen the
   frame shows the whole planted place from day one and growth is lots waking up, levels, height and people. Routed to the coordinator.
3. OUR BUILDS HAVE NO DEPTH TO CUSTOMIZE. 8 builds, each 1 battery 1 day, one per lot, built once, no level, no look to pick. Every game in
   the table has levels (3 to 10 per building) and most have a look to pick. 'Extremely customizable' needs both: a level ladder per lot
   and a few looks per level, all drawn.

## 6. THE THREE DIRECTIONS FOR ROUND TWO (draft, never in the game; round two draws each as pictures of OUR one screen, tall and wide, from
## the game's camera, for the VOTE tab; realistic first)
- A. THE BLOCK YOU TOOK (realistic, and his own words: 'the same real estate as the other settlements'). One real Vegas place you plant on
  (a walled cul-de-sac behind its block wall and gate, six to eight houses round the turning circle; or a strip mall), painted exactly
  like every town's screen, with about twelve FIXED lots in it (the yards, the garages, the circle, the gate, the roofs). Tap a lot: what
  stands there (from what you have), its level, its material and paint (three or four looks inside the colour law), its sign; tap the gate:
  the settlement's name. The bosses' prizes take named lots (the kitchen in a garage, the main at the circle's hydrant, the purifier in the
  retention basin). The people you bring move into the houses and their porch shows their trade. It grows in place: a second storey,
  panels on the roofs, the wall rebuilt; act two adds the INSIDE screen (the clubhouse or the storm drain under it), his 'indoor system'.
  Learned from: Darkest Dungeon's hamlet (one painted screen, in-place upgrades you see), Suikoden's castle (the people fill it), Clash of
  Clans (a fixed plot that fills), Townscaper (the art resolves itself).
- B. THE CUTAWAY. Your settlement is ONE building seen in cross-section (a dead casino's parking garage: concrete decks, ramps, the top deck
  in the sun for panels and the tank), rooms you fill, people walking between floors, growth going up a deck or down into the basement.
  It fits an upright phone better than anything (a tall slice), and the indoor screen is built in from the start. It leaves 'the same real
  estate as the other settlements' (no town is a cutaway). Learned from: Fallout Shelter, This War of Mine, Sheltered.
- C. THE RING. One heart in the middle (the main THE TAP opened, or a battery bank) and the lots in rings round it; what the heart reaches
  (the water's pressure, the power's reach) is how far the rings fill; the heart's daily batteries are the tension. Real (a main's pressure
  and a small grid's reach are real limits), but the outer lots get small on a phone. Learned from: Frostpunk.
Each direction keeps: the bosses' prizes stand there; the bill shown on the screen (batteries, food, water per person a day); the first
planting asks 'are you sure? This is permanent' once; never in the first minute; Stardew Valley only for the feel of a place that is
yours (343(d)); Battle Brothers has no home (our twist).

## 7. ROUTED
- COORDINATOR: finding 5.2 (347(b)'s 'block by block' is a map idea; the one screen grows in place) and 5.1 (a Vegas rain tank is storage,
  not a source): both canon-level, his to rule if he cares; this lane draws round two on these readings.
- ECONOMY / TUNING (research only): the settlement's bill in people-days: 15 L water and 2,100 kcal a person a day (Sphere) against our
  'a ration ONE and four litres ONE' (nightly_bill.json, the company's bill, which is drinking and cooking only and fine for men on the road).
- RUN TWO: today a held place shows one LOTBOX and one BUILDBOX per tier; direction A needs about twelve lot boxes on one picture. Nothing to
  do until he picks.
- BOSSES 4: rule 347(e), which of its bosses can be talked down and what each would do living in your settlement (already on its brief).

## NEXT (round two, research only, rule 349(e))
The three directions drawn as pictures of our one screen (tall and wide, from the game's camera), A first, three VOTE cards (moving: the
same place bare, then a few lots built, then working at night), each with its 'learned from' line. Then he picks; then the build.

## SOURCES (from this round's searches)
Fallout Shelter: thesixthaxis.com/2015/06/15/manage-your-own-fallout-shelter-on-ios-tonight; gamespot.com/articles/fallout-shelter-makes-51-million-in-first-two-week/1100-6428950; gamebanshee.com/kaxqp; ubergizmo.com/2017/09/fallout-shelter-more-than-100m-users.
Darkest Dungeon: en.wikipedia.org/wiki/Darkest_Dungeon; darkestdungeon.wiki.gg/wiki/Hamlet; darkestdungeon.wiki.gg/wiki/Blacksmith; segmentnext.com/darkest-dungeon-building-upgrades.
Suikoden: gensopedia.org/w/Recruitment_guide_(Suikoden_II); giantbomb.com/user-reviews/id/2699/a-great-game; mobygames.com/group/465; game8.co/games/Suikoden-2/archives/496888.
Clash of Clans: gdcvault.com/play/1021858; exitlag.com/blog/es/mejores-bases-clash-of-clans.
Frostpunk: news.xbox.com/en-us/2019/09/20/frostpunk-console-edition-radial-driven-design-of-gameplay-and-controls; en.wikipedia.org/wiki/Frostpunk.
This War of Mine / Sheltered: dailydot.com/this-war-of-mine-review; pcgamesn.com/sheltered/fallout-meets-the-sims-living-it-up-with-a-nuclear-family-in-sheltered; wikipedia.org/wiki/Sheltered_(video_game).
Townscaper: design-milk.com/townscaper-architecture-cityscape-pc-game; pcgamer.com/townscapers-developer-on-how-its-radically-casual-design-is-inspiring-a-new-wave-of-low-stress-builders-to-adapt-the-blueprint; gog.com/game/townscaper; magzter.com (Edge, 'Toy town').
Fallout 4: reindeer-pomegranate-pk38.squarespace.com/blog/2015/12/01/why-i-quit-fallout-4; techraptor.net/gaming/opinions/16-improvements-fallout-4-can-make-for-settlement-building; player.one/stub-69946.
Cult of the Lamb: pcgamer.com/games/action/the-making-of-cult-of-the-lamb-a-lot-of-the-design-was-trying-to-encourage-the-player-to-be-evil.
Animal Crossing (size of the itch only): nookipedia.com/wiki/New_Horizons; statista.com/statistics/1112631/animal-crossing-new-horizons-sales.
Sphere: spherestandards.org/wp-content/uploads/Sphere-in-Practice.pdf; es.slideshare.net/ALNAP/alnap-2013-meeting-sphere-presentation; careemergencytoolkit.org (CARE emergency toolkit).
Las Vegas rain: reviewjournal.com (2022 rainfall, the 4.18 inch normal); pubs.usgs.gov/sir/2006/5252/table1.html.
