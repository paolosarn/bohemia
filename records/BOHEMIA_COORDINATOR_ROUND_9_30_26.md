# COORDINATOR ROUND 9/30/26 (sweep 41c2b9f..HEAD, 442 commits since the 9/24 sweep, of which ~40 the coordinator's rulings; stamps alpha 9/29c ONE HUMAN ONE PAST, demo 9/28i THE MAP IS HOW YOU TRAVEL)
# Registry: 242 items, 169 verdicts, 74 waiting; nothing cast since the third votes. Deploy: one builder, pages runs green; PAGES PUBLISH gate red on size (289 MB vs 260).

## 1. WHAT SHIPPED (by chat, the ones that change what he plays)
- RUN [bb map] + [no city walk] SHIPPED e4c66f2b: THE DEMO OPENS ON THE MAP AND A TAP IS HOW YOU TRAVEL. Seven of nine
  map behaviours already existed on the far view; a tap used to select a builder plot. Now a tap sets a route over
  standable blocks, walked on the beat through the same step (clock, road director, parties); road 5.38 min a block,
  dirt 10.75; a second tap stops; a fight ends the journey. The walk pad and DROP IN are stripped from the demo. Walked
  by hand on a phone profile: door onto the map, 0 cards; first tap 27 blocks in 13.5 s; on one boot a road party
  (a dead casino security bot) met him 5 s after the tap, the first fight inside five minutes the stranger's list has
  recorded. Gate THE MAP IS HOW YOU TRAVEL 17/0. THE BREAK LIST rewritten by RUN: off the list, the oldest line (no
  fight in five minutes), no fast travel, tile-to-tile; new and named: arrival is a LINE not the settlement screen;
  the first person is not in the demo until the settlement screen holds him; the companion is not on the marker.
- COMBAT [house tiles back] V231 ed0d977c + V232 80ed2cea: the cell board is DELETED (not an option); the street is two
  tiles of road and a sidewalk each side; the high ground is a standing house with its roof on, a steel stair, 2 to
  3.6 houses off; V232: the camera stops where a house is as wide as the man (a house was 39 px beside a 112 man in
  40 of 40 arenas), chevrons on the glass edge for enemies out of view, nobody lost. V230 4e6b0931 before them: the
  lane read his DOWN on the cell board and undid it. FIGHT LENGTH not measured yet (nothing plays a fight to its end).
  V232 reverted fourteen files of PLUMBER's and FACTIONS' by mistake and restored them the same hour (4d9539c6).
- COOK [bb map art] r4 ac668ab5: THE CIRCLES BECOME PLACES at the map floor: every marker 48 px, one painted pixel
  per device pixel, redrawn as buildings with roofs from the 7/28 bank (you 963 lit pixels, 10.6x the old); a tower
  added; six guards. His two kills of the old ones were measurable (nine pixels wide). Goes live with RUN [bb map].
- COOK [tile options] r2 37dc1cb3: a house tile three ways (A down at an angle roofs on, B straight down, C across)
  from his own art; THE MEASUREMENT: the fight board draws at 16.3 px per metre and the walk's banks are 42.9, 2.6x
  apart; his art cannot be pasted on; every tile is drawn at the street's density and shown at the board's.
  DIRECTION [judge tile options] 239ebd9e: COOK's density passes; B leads (the roof is the high-ground tile) but
  fails as drawn (black hip corners); THE FINDING: the house-tile fight shows his art 1:1 only if the fight canvas
  draws at device resolution; the CSS-size canvas is the 3x3 Atari block. One density rule for map and fight.
- DIRECTION [floor reading] 5a53e881: the glass reading is passed by blur (PLUMBER proved it); the floor now reads the
  canvas's own pixels and a fine band; FIGHT VERDICT ROUND 19 on V231: paid the street, the car, the roof house;
  still wrong: house smaller than a man (V232 answers), slate ovals, cardboard crates, text on the board, the backing
  store at CSS size. [bb density] 9e93bc7d: the floor is one painted pixel per screen pixel; ours paints 7.5%.
- PLUMBER: [one driver] r1 cf8d3e7e (292 browser checkers, 290 built their own door; the driver refuses a bad wait;
  PEOPLE's two city gates reach the city again: DEEDS 36/7, MEMORY 25/9, the reds real and routed); [density leg]
  c4a288f0 (MAP DENSITY in the suite, red on purpose 8/4: the map paints one pixel in thirteen); [excavate] r44
  1c7ff897 (nothing live loads from archive, 9/0; 423 unreached files frozen; 146 files, 32.6 MB, proven safe to move
  and the move was refused by the session's permission check; it would bring PAGES PUBLISH back under the cap);
  [covered controls] 0e6c3373 (two legs per control, both pages; the first cut was wrong by picking a 0x0 iframe);
  [bb budget] e7ae9881 (400 markers at 60 fps; paint the map on the beat, never per frame); [grid budget] 0fa7025b
  (the block is cheap; the host page turns a 500 ms beat into 3,600); [bb library] 2 of 3 4f016b03 (the fetcher built,
  both hosts blocked by policy, the dev blog is not CC BY-SA so no false licence line).
- UI [bb interface] r7 41d9f3cb: the HUD measured on the map; THE DEFECT WITH A PROVED FIX: the three family faces on
  the phone are BLACK on the first screen (demo and alpha); one line repaints the strip when a face lands (0 -> 676
  px); held under rule 18 because the strip is DYNASTY's. r5/r6: the settlement screen on a phone; her page.
- LIFE+CITY [build a lot] r1 3e9aeddf: seven things you can build on your own lot (shed, pump house, garden bed,
  solar, vendor stall, roof, wall), each a piece the game already draws, one battery and one day, one currency a
  day or a family housed; no second ledger; a roof is high ground on the fight board. [three cities] unparked
  0541d8ca; [honest grid] closed.
- FACTIONS [home bases] r2/r3 5a99e148, 45c2a04b, 281fdac9: the fourteen home bases on the map's marker list; a party
  says where it walks, a base says who is coming; ownedBy() for rules 39c and 40b; four crews walking at each other's
  bases on every seed; nothing happens when they arrive (yet).
- PEOPLE: [family eyes] 62647a7c (children read a parent's real face; two bugs stacked), [used to be] 52978c3a (ONE
  HUMAN ONE PAST, alpha 9/29c), [somebody hires you] c90f634f, [origins] 137efe74 (three of his four already written).
- DYNASTY: [the flip] shipped 9/24 (three faces; now dead by 39c), [three names] f6bd1f75 (dead as built by 39c),
  [bb legacy] 79ba7450 ('three crises', dead by 37d), [angel verbs], [horror heir], [return ritual] 43b79c14 (absence
  is free; one line on the phone); [one then heirs] CLAIMED c54b5454.
- ANIMATION: [glide] 37337e48 (the map glides, the pin hops on the beat inside the slide; his UP built), [facing you]
  (a hit, a shove, a throw, a heavy punch facing the camera at full size), [small clips] r2/r3 (dead by 38b).
- SOUNDS [not sand] r3/r4/r5: the tape deck is not made of hiss; a click; the three frozen hums redone; dirt, sand and
  a wood floor from real contact models; a judged sound is never re-blessed, only redone under a new id (d408f23d).
  [bb ambience] 83769842: the map makes 19 sounds and the street makes 0; the valley strikes the hour.
- WORLD: [scavenge] fddfad02 (luck decides whether, never how many; a block is a count; time is the only cost; 3,166
  findable things on seed 1337), [future city] d8d1d37f (he killed the picture; the clamp was theirs), [creatures]
  school 5441e5fc (before rule 42: eight real species already ship; the dire wolf was 'grey wolves with 20 edits';
  when the money stops the record is euthanasia; what escapes is plants), [bb places] e3ef0e81 (fourteen places, three
  shelves, the camp with the power sells the least), [sand is dirt].
- TUNING (research): [fight length] e31e7e64 (BB is rounds x units x seconds sequential; ours acts on one beat, about
  50 s routine and 4 min with all three dials up: UNDER his ceiling; the risk is too shallow, not too long),
  [numbers table] 11947f53 (33 rows, 21 read live; the enemy hit chance is inline, not a const), [lifespans] d0f98c72
  (a yearly risk set by the times; crash median 69; PENDING: can the main three die of age), [bb numbers], [dead
  citation].
- MODS (research): [what mods fix] b54e84b1 (19 mods, 11 KEEP, 6 MAYBE, 2 NO; autopilot is our gambits; speed cannot
  touch the beat), [bb modding] 1f3936f3 (a gun lives in 42 places; our own tests forbid tuning it), [data line],
  [mods folder].
- QUESTS (research): rounds one to five; the whole library citable (5,356 ids, 236 studies); 170 designs on the shelf;
  the shelf swept to rules 38-40; contracts are the settlement screen's contract offer.
- EYES: [every screen] E23, [phone latency] E24 (the fight already has a tap-along calibration; NAMED: a real tap never
  drove a fight in the harness because the fight's loading log covers the button), [the sign] E25 school, [bb reads].
- WORDS: [naming screen] 688da60d (dead as built by 39c; the control exists), [bb words] r1 (BB writes nothing during a
  fight), [the cause] r1, [no jargon], [lexicon frozen] (the Spanish dictionary was erasing itself).
- CHARACTER: [attachments] (spiked pauldron, the cloak; reachable by a real tap), [runway redo] (the thirteen wired to
  the factions), [small body] graveyarded the same round (38b).
- PORTRAIT: [three faces] (dead as built by 39c; the heredity right, re-timed), [head and gear] 604688cc (68 of 68
  durags show; head only; no barber in Battle Brothers at all), [customizations first] (every dial a slider, 32).
- ECONOMY: Q51-Q53, [bb money] both rounds (a rung drop costs zero; the loan already is the wage), the standing fold.

## 2. ROUTED THIS ROUND
- COMBAT [device canvas] NEW, right behind [house tiles back]: the fight canvas draws at the phone's device pixel
  ratio; the CSS-size backing store is the 3x3 Atari block (DIRECTION), the art is 2.6x denser than the board draws
  it (COOK); one density rule for map and fight: authored >= 39 px/m, no painted pixel larger than one device pixel.
- DYNASTY [one then heirs] takes UI's proved one-line fix for the black faces (the strip repaints when a face lands)
  as the first thing it does, then cuts the strip to one face; the rule-18 hold does not apply to a proved defect fix
  on a surface the lane owns.
- PLUMBER [excavate]: retry the 146-file move in a fresh round; the refusal was the session's permission prompt, not
  his; it clears PAGES PUBLISH. PLUMBER [one driver]: EYES E24's finding is a leg (the fight's loading log covers the
  calibration button; a real tap must land on the fight's own controls).
- WORLD [creatures]: rule 42 landed after their school and is LOCKED; their three findings shape HOW (what the
  paperwork missed is what is loose; the edited coyote is the first dire wolf; plants escape first, ECONOMY [what
  grows]); the eight real species already shipped are the act-1 floor.
- COOK [tile options]: fix B's black hip corners (DIRECTION's verdict); the density finding is COMBAT's row now.
- COMBAT [fight feel]: TUNING measured ours at ~50 s routine and ~4 min tough, under his ceiling; the risk is too
  shallow: depth from formation, gear and the dial, not length.
- The coordinator's 14 VOTE items had no sha and no show and were the vote tab gate's red (30/1) since 9/28: fixed
  this round (sha of the ruling commit, show text). UI's handoff named it; my fault.
- FRONT PAGE: THE DEPLOY LINE (one builder since 9/23; PAGES PUBLISH red on size until the move); THE SUITE LINE
  (9/29 numbers from the lanes: 292 browser checkers now on the one driver; MAP DENSITY red on purpose; PAGES PUBLISH
  red; house_board red; vote tab red fixed; the suite does not finish in 40 minutes, PLUMBER [suite line] still owed);
  THE CUT LINE (the walk pad and DROP IN out of the demo; the cell board deleted; nothing live loads from archive);
  THE COOK LINE (242 / 169 / 74 waiting, none cast since the third votes).

## 3. THE THING HE NEVER OPENED
THE DEMO, build 9/28i: it opens on the map, you are the marker, tap a place and the party walks there on the beat,
roads faster than dirt, and on one boot a dead casino security bot met him five seconds after the first tap. The
markers he killed twice are redrawn as buildings at the map floor and go live with it. Known and said: arrival is a
line, not the settlement screen yet; the family faces on the phone are black on the first screen (fix routed).
