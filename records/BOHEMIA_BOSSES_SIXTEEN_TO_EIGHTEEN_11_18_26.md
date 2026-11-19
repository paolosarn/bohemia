# BOSSES, 11/18/26: THE LADDER'S 16TH TO 18TH, EACH HIS OWN WAY, THE FEWEST WORDS, EACH PRIZE ON HIS CAMERAS (the coordinator's round 'BOSSES next')

The routine (rule 453, round after round): fifteen bosses are live. Next the ladder's 16th, 17th and 18th
(records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 91-93: THE WARD, THE CISTERN, THE SMITH), one per build, the fewest words (rule
454(a)), each prize seen on his place's cameras. Rule 441: each fought to the end on the real page, alpha and demo, a phone both ways.

THE WORDS (rules 454(a) and 455): no rumour, no asker, no line on the sign's card or on the card after he falls (the quiet rows of last
round). His ONE line is on his own fight card and it is two words, the first scary (rule 455(b)): THE WARD 'Bleed slower.', THE
CISTERN 'Die thirsty.', THE SMITH 'Burn, kid.' (draft). The rest is readout: the tool's button, its number rising off the men, the
thing's name on the after card and one plain line of what it does, one line of what changed on the map.

## THE CAMERAS (MEASURED FIRST)
- HOME BASE's plan keeps 12 lots (rule 373) and a prize or a trophy takes the back lots. MEASURED: by the 15th boss all twelve hold
  earlier things, so last round's three were kept in the hall (named on the desk), NOT ON CAMERA (said so in last round's record and
  gate). HOME BASE's own build sheet and the cork board take free lots too.
- HOME BASE's seam already takes a PERSON (BohemiaHomeMap.give, kind 'person', THE CLIMB's kept people go through it): a person takes no
  lot, joins the people who live there (engine/bohemia_home.js addResident, up to 24) and stands among them on CAM 3 THE PEOPLE
  (slices/BOHEMIA_SETTLEMENT_SCREEN.html homeFolk, his own look).
- SO EACH OF THESE THREE HANDS YOU A PERSON WITH HIS THING: his nurse, his keeper, his apprentice. The hand is still the thing (the bag,
  the tarp, the fire) on the after card; the one who comes with it MOVES IN and lives at your place, on CAM 3, kept after a reload
  (slices/bohemia_bosses.js prizes(): a hand with a 'person' goes through the seam as kind 'person', same id 'prize:<verb>').
- Their looks are RUN TWO's rolled people (reuse-first, records/target/character/barber/person_*): the nurse person_town_45 (a white tee,
  a bone vest), the keeper person_rare_10 (a dust poncho, wrapped boots), the apprentice person_trades_7 (a smith's apron, a work cap).
- FOR HOME BASE (noted on its board, not touched): homeFolk draws the first 8 of up to 24 residents, so in a long game the newest ones
  (these three) are not drawn. The gate reads her by name and says so if she is not drawn.

## WHAT WAS MADE FIRST (all three, the first build carries them)
- THE MEN (tools/bohemia_bosses_sixteen_to_eighteen_11_18_26.py, BOSSES 4's tool imported, nothing added to the wardrobe): THE WARD, a
  thin man in surgeon's green (a sage car coat over a green shirt, green trousers, white sneakers), a STETHOSCOPE round his neck, his
  MASK pulled down under his chin, THE AMPUTATION KNIFE (BB's Scramasax) in his fist. THE CISTERN, a heavy man in a storm poncho over a
  slate tank, THE WATER KEY (a curb-stop key, BB's Tire Iron) in his fist, A FIVE-GALLON BLUE JUG in the other, A COILED HOSE on his
  hip. THE SMITH, a big man in a smith's leather apron over a black tank, THE CROSS-PEEN HAMMER (BB's Warhammer), THE TONGS, WELDING
  GOGGLES round his neck. No purple (0.0 percent each). MEASURED: a band at 1.19 m is over the top of the torso's sections (the model
  failed three times); the collar pieces sit at 1.15 to 1.17 m, the hose's hip at 0.92 m.
- THEIR FACES go on the bosses' own strip after last round's three (faces_bosses.webp, fight_rig.json faces.more), the first strip
  untouched.
- THEIR PLACES (tools/bohemia_bosses_sixteen_to_eighteen_places_11_18_26.py): THE CLINIC (before: its red cross painted over black,
  plywood on the windows, a chain on the door, a gurney out front with a sheet over somebody; after: the door open and lit, the cross red
  on white, the gurney empty, a bench), THE ROOF TANKS (a two-storey block, three blue tanks on the roof, the downspout; before: his chain
  round the spigot, his key on the wall; after: the spigot open, jugs lined up, a puddle), THE FORGE (a corrugated shed, a brick chimney;
  before: the door down, the forge's glow under it, his scrap chained in a heap; after: the door up, the anvil out front on its stump).
  Their pieces on the map: WARDTAPE (two posts, his tape, a sheet with his black cross; after: cut and hanging, the sheet down), TANK (a
  blue tank on a stand, chained, his man with a jug; after: the tap open, two jugs, nobody), ANVIL (an anvil on a stump, his chain round
  it, a heap of scrap; after: the chain cut). The marks the tools leave: an open first-aid box and a bandage, a tarp funnel over a
  barrel, a can stove with a pot of lead and cast rounds.
- THE THINGS THEY HAND YOU (tools/bohemia_bosses_what_they_hand_you_11_3_26.py): HIS BAG (a red trauma bag, a white cross, gauze, a
  syringe; the first cut read beige, the rig's blood ramp at its second step; at its first it is red), HIS TARP (a tarp funnel on poles
  over a ribbed barrel), HIS FIRE (a crucible in its tongs over the coals, an ingot by it).
- THEIR MOVING CARDS: records/target/bosses_sixteen_to_eighteen/VOTE_BOSS_WARD.webp, VOTE_BOSS_CISTERN.webp, VOTE_BOSS_SMITH.webp.
- THE CODE OF ALL THREE, inert until each one's row ships (slices/bohemia_bosses.js): (24) HIS WARD, (25) HIS TANKS, (26) HIS ANVILS,
  one engine of a REACH (the 'radius' blocks round his place, off a town; his 'marks' painted on street blocks where it ends, wherever
  the crew has seen); the verbs treat, catch, smelt; the person prize. The verbs' order: fix, TREAT, mark, SMELT, open, purify, pick,
  blow, press, weld, climb, survey, fade, burn, track, CATCH, look, cook.
- HOW THE HOURS ARE HELD (MEASURED, the honest way): the map's clock (advance()) hands every minute to the condition's elapse. A wrapper
  that took the healing back afterwards would let the condition's own event fire on a whole company for a moment (CAMP ends a camp when
  the company is whole), so the wrapper holds the condition's own RATES at nothing while elapse runs (blood: the march, camp and cook
  rates; armour: the mending rate), then puts them back: the bar, the camp and the sums all read the truth, and no tape is spent for
  armour that was not mended.

## THE WARD (the ladder's 16th: the last clinic, and what is left in it). BUILD 11/18j

HIS OWN WAY: NOTHING HEALS NEAR HIM. While he stands, the 6 blocks round his clinic (off a town) give no blood back: the hours there,
marching or camped, heal nobody. His tape and his black cross stand on posts where his reach ends (3 of them). When he falls his
clinic's lights are on: the same blocks heal TWICE AS FAST, kept after a reload. Battle Brothers: a location's owners hold what is
round it until it is taken.
- Found by WORLD TWO's radio. Nobody asks (rule 454(a)).
- Fight: BB's Officer's numbers (the man who drives the indebted) at 1.8 blood with a Scramasax, three Indebted (his patients, working
  off their beds) and a Conscript, on the lab board. His one line: 'Bleed slower.' (draft).
- Verb: TREAT. Off a town, once a day, when a man is hurt: every man's blood back, and every fresh wound treated the clinic's way (the
  condition's own treat: half its days and half its debuff, once a wound). It comes second in the order, after THE TOOTH's fix: when
  somebody is hurt it is the button.
- Prize: the after card says HIS NURSE IS YOURS over his bag; THE NURSE moves into your place and stands on CAM 3, kept after a reload. Data: row THE WARD, 'ward'.
- GATE (THE WARD CHANGES THE MAP, registered): the demo upright 22/0 and the alpha on its side 22/0, on the build merged with main at
  47f73d0b4. Upright: in his reach two hours gave 0 of 30 blood back, out of it 10 (the table's march rate, 5 an hour); after his fall 2
  times as fast; TREAT put 64 to 87 blood back across the hurt men; THE NURSE on CAM 3 by a real tap. MEASURED: the reopened game came
  up inside a town on the alpha (BLUES), so the reload's walk back to his reach never started and R1 read nothing: the gate's reload walk
  now leaves a town first (the game is right; the checker walked from the wrong place).
- POST-CHECK ON WHAT LANDED (main at cbfad9d18, with BESTIARY's fight changes under it): the demo upright 22/0 and the alpha on its
  side 22/0, run from a clean checkout of that sha.

## THE CISTERN (the ladder's 17th: every roof worth catching rain off). BUILD 11/18u

HIS OWN WAY: HIS MEN TAKE YOUR WATER. While he stands, every 3 hours of the game's own clock the crew spends in the 6 blocks round his
roof tanks (off a town), his men take 1 FOOD off the wagon (food and water are one count, rule 209: a man's night of a can and a
bottle). His tanks stand up on their stands where his reach ends, chained, his man by each (3 of them). When he falls each tank's tap is
open: a stop on its block gives 1 FOOD, once a day a tank, kept after a reload. Battle Brothers: a location's owners hold what is round
it until it is taken; the water you could not get without asking is on the map for anybody.
- Found by WORLD TWO's tag on a gutter. Nobody asks (rule 454(a)).
- Fight: BB's Nomad Leader's numbers (the desert's water lord) at 1.8 blood with a Tire Iron (his water key), two Nomad Slingers (on
  the roofs) and a Nomad Outlaw, on the cul-de-sac board. His one line: 'Die thirsty.' (draft).
- Verb: CATCH. Off a town, beside a roof (suburb, estate, gated, apartment, trailer, residential, ranch), once a day: the tarp and the
  barrel, +2 FOOD. In the order it comes after TRACK, before LOOK.
- Prize: the after card says HIS KEEPER IS YOURS over his tarp; THE KEEPER moves into your place and stands on CAM 3. Data: row THE
  CISTERN, 'tanks'.
- MEASURED ON THE WAY (the band shows one verb at a time, the file's order deciding): after his fight TREAT lit on every block off a
  town (the men were hurt), and while the next boss's sign is out TRACK lights on every block off a town too; CATCH was lit on 303 of
  the blocks round the crew and TRACK on all 303. So a player taps TRACK (once a day) and then CATCH shows: the gate taps them the same
  way. FOR UI / RUN: the more verbs he holds, the more one daily verb hides the next until it is used; a band of two (the first two
  lit) would show both.
- GATE (THE CISTERN CHANGES THE MAP, registered): the demo upright 22/0 and the alpha on its side 22/0. Seven hours in his reach cost 2
  FOOD, the same seven out of it 0; after his fall seven hours there cost nothing and a stop on his tank gave 1 FOOD; CATCH gave +2;
  THE KEEPER on CAM 3 by a real tap. MEASURED ON THE WAY: (1) RUN TWO's BohemiaOriginStart is not on the map's page, so the first build
  of the take found no wagon: the map's own wagonGet/wagonPut carry it now; (2) on the alpha on its side the camera sits close and his
  tanks at the edge of his reach were off the glass: the gate reads his marks beside one, and reads the open ones standing on one;
  (3) with three phones running at once the sign's card came up late and covered the next legs: the gate waits 30 s for it; (4) a
  clock wound back under his count hid a take: the gate sets the morning before each walk and leaves his reach first.
