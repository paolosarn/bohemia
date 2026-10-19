# COOK TWO [the fight floor he hates]: THE FIGHT'S FLOOR FROM THE GROUND HE SAID YES TO (10/19)

His NO on COMBAT's ground fights (the seventeenth votes, 10/18): 'The floor tiles are all shit. It's so terrible so bad I
hate. I hate the ground. I hate the floor. He just looks like shit. It's so fucking bad.' And then, the same night, 'the
combat is still so fucking ass' (rule 120). The row: the fight's floor redrawn from the ground he said YES to (one real
street, cook2-one-real-street-10-18, voted UP; the joins in the valley's tans, 'Way better nice!'), the current floor
beside the new one on the real fight board from the game's camera, in VOTE with its card id, analog horror. Cook only
(rule 100): records/ only; nothing to slices/, engine/ or the demo. Session opened by the coordinator (rule 112), Opus 5.5
at Extra, no check-in.

## WHAT HE HATES, MEASURED BEFORE CUTTING ANYTHING
The demo's fight (slices/BOHEMIA_FIGHT.html) draws its floor from 35 block pictures (slices/fight_ground/block_*.webp,
2,575 x 1,820, five by five house tiles of 515 x 364), made by COMBAT TWO's block maker
(tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py and the eleven round modules it imports). Read off
the maker's own code:
1. THE CAMOUFLAGE. Every ground is TWO soils: a base, and a second one pasted through a coarse random field (9 x 9, 12 x
   12 or 14 x 14 random values, bicubic-stretched over the whole block, cut at one level). That is a two-tone blob print
   10 to 25 m across, the same on every board (DIRECTION's verdict 23, F3: 'a camouflage print, not ground'). The ruin
   carries a third: soot through another noise field at 0.6 darkness.
2. THE ORANGE. The desert, the wash and the scrub are his soils as bought (saturation 0.33 to 0.44, COMBAT TWO's own
   measure); the town yards are the 7/28 starter recook's tan.
3. THE PATCHWORK. The lots, driveways and the ruin's slabs are the recook's grey cobble, framed squares.
The streets (COOK TWO's kit from his road and slab, laid 10/10) and the houses are not the floor he means.

## HOW THE PACK DID IT, AND HOW BATTLE BROTHERS DID IT
- His pack: one soil per tile, frames around each; a yard as bought is a checkerboard of four soil tones. His YES street
  took ONE of his soils (#2), cut its frame, laid it tile by tile with left-right flips and took it shade to shade onto
  the valley's caliche (#9a8e78): the quiet he voted up.
- [bb the battle ground] Battle Brothers' tactical board paints one ground per terrain, quiet under the men, the hex
  grid faint; a tile says what it is by its ground and the things standing on it (trees, rocks, ruins), never by a
  print laid over the whole board (reference/library/battle_brothers/02_COMBAT_RULES.md: the fight is generated from the
  map terrain where it happens).

## WHAT IS NEW
Every ground pixel of the 32 block pictures the outdoor boards use, re-laid from his tiles (the casino's three are an
interior carpet, COMBAT TWO's, left as they are). One soil per ground, no noise field, no second soil:
| ground | his tile (approved set) | taken onto | where it lies |
|---|---|---|---|
| caliche | soil #2, frame cut, left-right flips, rows like brick | #9a8e78, his YES street's dirt exactly | every town yard and the dirt between the houses, the lots' dirt, the ruined block |
| desert | soil #2 | #a19077, a step warmer | the scrub, the wash's flats, the landfill's flats, the freeway's verge |
| rough | soil #4 (flecked where #2 is plain) | #958974, 5 levels under the dirt | the ruin's debris field, the landfill's rough ground |
| playa | soil #21, the cracked dry earth | #ab9e86, the pale wash-bed tan | the wash's bed, the shore's beach |
| track | soil #2 | #8d7e68, packed by wheels | the scrub's two ruts |
| concrete | slab #0, #1, #2, #15 as bought (his quietest, no paint, no weeds) | as bought | driveways, lots, the cul-de-sac's walks, any sidewalk the street kit did not lay |
| asphalt | road #0, #1, #8 to #11 as bought (the YES street's rest area) | as bought | every road the street kit did not lay: the freeway's lanes, the cul-de-sac's bulb, the lots |
| lawn | grass #1, #2, #4, vibrance down two fifths | as bought | one front yard (below) |
Every ground is laid at his own pixel (one pixel size, nothing scaled across) and taken to the 45 camera the way the
blocks are (depth x cos45, NEAREST rows), so it sits on the house tiles exactly as the street kit does.
THE ANALOG HORROR LINE (rule 20, one calm wrong thing per board, from the world's state): ONE front yard on the suburb
board (corner.1, 460 x 266 px) is a green lawn, his spring grass with its vibrance down two fifths. The dollar died, the
water district is a ruin, every other yard is caliche, and somebody still waters this one.

## HOW, WITHOUT EDITING COMBAT TWO'S FILES
tools/bohemia_cook2_the_fight_floor_10_19_26.py imports COMBAT TWO's maker as it is and runs it twice on every block:
1. AS IT IS: the block it makes is compared with the block the fight ships; a pixel a later round changed (the street
   kit's sidewalks, measured on corner.0: 364,018 px) is never touched. scrub.0 regenerates bit for bit.
2. WITH EVERY GROUND CODED: its dress functions hand back one flat code colour per ground, and each code is added to its
   palette as a family of 40 steps, so every shadow its shade() casts on the ground (house, bank, rut) lands on that
   family's ramp. Reading the code back gives per pixel WHICH ground and HOW DARK.
Then the shipped picture keeps every pixel that is not ground, and every ground pixel is his tile at that spot at the
same darkness, the hue walking cool into shadow (the style guide's field 4).
Two bugs of mine, found and fixed before anything registered: (a) the maker caches its desert strips on first use, so the
coded run reused the old orange edge band (a 3 to 6 px orange line round every desert block): the cache is cleared; (b)
my 'unshaded level' came out empty where most of a ground sits at full light, so every shadow on the ground was dropped:
it is the 85th percentile now. And three taste misses, each fixed before registering: his soil #22 for the ruin's debris
kept its own darkness (the recolour keeps his luminance), 53 levels under the dirt, and the debris field was a blob again
(rough is his #4 now, 5 levels under); his slabs #1 and #15 carry the eight-legged star DIRECTION named on 10/10 (the slab is
his calm #0 and #2 now, turned all four ways); one soil tile turned only left-right made a mirrored lattice at 1:1 (every
soil turns all four ways now). The soils keep his tile's own colour grain (the module's keep_grain): side by side at 1:1 and
at the opening frame's scale the two are the same picture, and the twin gate reads the dirt AMBER where the plain recolour
(6 per cent of his colours) read RED.

## MEASURED (records/target/cook2_fight_floor/COOK2_FIGHT_FLOOR_KIT.json, 'measured')
On the pixels this tool re-laid in every block (old = the block the fight ships, new = the re-floored one):
| | old | new |
|---|---|---|
| THE BLOB: luminance spread (0-255) left after a 3 m box blur, median over 32 blocks | 5.70 | 1.38 |
| THE ORANGE: median saturation (0-1), median over the blocks | 0.433 | 0.192 |

100,520,761 px re-laid in all (100% of them his tiles; 0 colours drawn). Per block:

| block | ground share | grounds (px) | shaded px | blob old -> new | sat old -> new |
|---|---|---|---|---|---|
| corner.0 | 46.3% | caliche 2,168,356 | 15,491 | 5.14 -> 0.7 | 0.433 -> 0.192 |
| corner.1 | 51.9% | caliche 2,430,710; lawn 122,360 | 11,517 | 4.94 -> 10.6 | 0.433 -> 0.193 |
| corner.2 | 48.7% | caliche 2,280,240 | 17,180 | 4.76 -> 0.72 | 0.433 -> 0.192 |
| culdesac.0 | 75.0% | caliche 2,721,803, concrete 347,588, asphalt 446,239 | 54,706 | 24.36 -> 28.78 | 0.417 -> 0.189 |
| culdesac.1 | 74.8% | caliche 2,710,191, concrete 347,588, asphalt 446,239 | 53,321 | 24.62 -> 28.74 | 0.417 -> 0.189 |
| freeway.0 | 94.4% | caliche 1,320,206, desert 1,324,586, concrete 144,647, asphalt 1,634,818 | 0 | 33.72 -> 41.36 | 0.417 -> 0.18 |
| freewayo.0 | 75.5% | caliche 1,056,192, desert 1,063,965, concrete 115,734, asphalt 1,304,637 | 88,413 | 32.86 -> 40.44 | 0.417 -> 0.181 |
| landfill.0 | 81.7% | desert 2,877,774, rough 950,320, track 860 | 0 | 11.29 -> 1.38 | 0.591 -> 0.225 |
| landfill.1 | 81.2% | desert 2,877,851, rough 928,823, track 860 | 0 | 11.24 -> 1.34 | 0.592 -> 0.225 |
| lots.0 | 79.8% | caliche 2,697,833, concrete 1,044,441 | 0 | 8.97 -> 15.11 | 0.417 -> 0.192 |
| main.0 | 45.8% | caliche 2,146,544 | 0 | 5.06 -> 0.43 | 0.433 -> 0.192 |
| main.1 | 45.8% | caliche 2,146,544 | 0 | 4.24 -> 0.5 | 0.433 -> 0.192 |
| ruin.0 | 55.4% | caliche 1,395,914, rough 1,199,972 | 17,531 | 14.27 -> 1.37 | 0.417 -> 0.193 |
| ruin.1 | 55.1% | caliche 1,500,165, rough 1,081,648 | 19,688 | 12.61 -> 1.57 | 0.417 -> 0.192 |
| scrub.0 | 97.0% | desert 4,462,661, track 83,991 | 0 | 5.7 -> 0.31 | 0.604 -> 0.227 |
| scrub.1 | 97.4% | desert 4,478,422, track 84,743 | 0 | 5.47 -> 0.32 | 0.605 -> 0.227 |
| scrub.2 | 96.6% | desert 4,442,212, track 83,407 | 0 | 5.88 -> 0.3 | 0.601 -> 0.227 |
| scrubroad.0 | 78.0% | desert 3,589,386, track 65,305 | 0 | 5.82 -> 0.33 | 0.603 -> 0.227 |
| scrubroad.1 | 78.2% | desert 3,597,292, track 65,840 | 0 | 5.69 -> 0.33 | 0.605 -> 0.227 |
| shore.0 | 58.7% | desert 22,952, playa 2,729,378 | 0 | 4.44 -> 1.73 | 0.575 -> 0.189 |
| shore.1 | 58.7% | desert 22,952, playa 2,729,378 | 0 | 4.34 -> 1.67 | 0.575 -> 0.189 |
| strip.0 | 59.8% | caliche 323,632, concrete 259,519, asphalt 2,217,170 | 48,864 | 17.58 -> 19.55 | 0.167 -> 0.064 |
| strip.1 | 59.8% | caliche 323,632, concrete 259,519, asphalt 2,217,170 | 48,864 | 16.71 -> 19.59 | 0.167 -> 0.064 |
| subs.0 | 56.2% | caliche 2,634,619 | 30,474 | 5.0 -> 0.98 | 0.433 -> 0.192 |
| subs.1 | 59.1% | caliche 2,771,426 | 34,132 | 4.2 -> 1.04 | 0.433 -> 0.192 |
| subs.2 | 58.8% | caliche 2,754,270 | 90,736 | 4.71 -> 3.28 | 0.433 -> 0.192 |
| subs.3 | 53.3% | caliche 2,498,991 | 87,240 | 4.24 -> 2.72 | 0.433 -> 0.192 |
| suburb_stem.0 | 47.3% | caliche 2,219,060 | 28,211 | 4.54 -> 0.94 | 0.433 -> 0.192 |
| suburb_stem.1 | 46.8% | caliche 2,194,347 | 24,977 | 4.49 -> 0.89 | 0.433 -> 0.192 |
| wash.0 | 97.5% | desert 3,971,786, playa 597,326, concrete 91 | 96,787 | 10.58 -> 4.93 | 0.596 -> 0.225 |
| wash.1 | 97.5% | desert 3,972,095, playa 597,515, concrete 89 | 97,358 | 10.1 -> 4.93 | 0.596 -> 0.225 |
| works.0 | 32.8% | caliche 1,537,388 | 0 | 5.0 -> 0.51 | 0.417 -> 0.192 |

## THE SHEET (records/target/COOK2_THE_FIGHT_FLOOR.webp, 1,170 px wide for his phone)
The REAL fight on the one driver's phone profile (390 x 844 @3x), named boards at seed 1 by day, shot twice from the
game's camera: as it ships, and with the fight's block pictures answered from records/target/cook2_fight_floor/ (the
driver's serve map; the page asks for the same file and gets the re-floored one; slices/ untouched). Per board: the
opening frame (both teams, what he sees first) NOW | NEW, then the close stop (one art pixel to one device pixel) NOW |
NEW, the crop placed where two thirds of it is floor. Then his tiles as bought beside the ground he said yes to. One
question: is this a floor you can fight on? Tools: tools/bohemia_cook2_the_fight_floor_shot_10_19_26.js, then
tools/bohemia_cook2_the_fight_floor_sheet_10_19_26.py.

## WEAK, SAID
- The roofs are still COMBAT TWO's bright terracotta (his 10/17 note: more tan, never bright orange); COOK FOUR's tanned
  houses are on COMBAT TWO's district boards, not on these blocks. The floor no longer competes with them, so they shout
  more.
- The house and building shadows the maker drew as their own pixels (not as shade over the ground) keep their old warm
  colour on the new grey-tan ground; at the opening frame they read as darker ground, at 1:1 a few are warmer than the
  dirt around them.
- Rough ground (the ruin's debris, the landfill's) is now only a grain difference, 5 levels darker; the debris field reads
  through the rubble pieces and the tap line, barely through the floor.
- The yards are all caliche (the YES street's honest note): one dead lawn in four is the next pass, beside the one green.
- The 32 blocks are 55 MB and regenerate bit for bit (the folder's .gitignore); COMBAT TWO lays them, or imports GROUNDS.
- Nothing is final before his moodboard (rule 108 ROUND THIRTEEN).

## ROUTED
- COMBAT TWO: the kit is records/target/cook2_fight_floor/ (python3 tools/bohemia_cook2_the_fight_floor_10_19_26.py, about
  12 minutes, makes the 32 blocks at the shipped names). After DIRECTION and his vote: swap them into slices/fight_ground
  (your files) and re-run your futures (raided, reclaimed) from them; or dress your block maker and the five district boards
  with GROUNDS and field() directly. Your district boards' warm soils (#18, #22, #0) are the same orange: the same grounds
  answer them.
- DIRECTION: fight verdict 24 (F3, no camouflage sand) reads this sheet; the twin is on it.
- COMBAT: nothing in the fight's code changes; the grid lines, chalk and rings draw over the new ground as before.
- RUN: the demo carries it only after his yes and COMBAT TWO's swap.

## GATES
Pre-push pass (rule 13), run by name on the files this round touches:
- REFERENCE CHECK 502 passed, 2 failed: all three of my tools carry the check; both reds are UI's new tool
  (bohemia_ui_the_line_on_a_ground_cook.py, and the frozen baseline grown by it).
- REUSE FIRST: my three tools PASS; its reds are other lanes' tools.
- ART PIPE 4/1: A2 names 28 drawing tools, none of mine (the sheet's labels are text with a stroke, no drawn box).
- NOT VIBE CODED 30/1: N3 culls none of this card's 16 sprites (the eight grounds, two variants each); its red is COOK
  FOUR's gas station, warehouse and school (D5), CHARACTER's and COOK's rig cards with no sprites, PORTRAIT's crew faces (D3).
- TWIN GATE 20/1: this card is not RED (the dirt AMBER, the slab and the lawn GREEN); the one red is COOK FOUR's second pass.
- VOTE TAB 46/6 with the card registered, and 46/6 identical on main without it: DYNASTY's two whys with no where, and the
  tap-to-open legs on EYES' card's picture. The card leads his first screen among the new cards (the gate's own line).
- PAGES PUBLISH: unchanged red on main (size, PLUMBER's); this round adds 5.3 MB to records/target (the sheet 2.3, the
  sixteen grounds 3.0); the 32 blocks (55 MB) stay out by the folder's .gitignore.
Full suite unmeasured (rule 13).
