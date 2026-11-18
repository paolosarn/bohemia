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
