# BOSSES: SEVEN TO NINE, EACH CHANGES THE MAP HIS OWN WAY (11/11/26)

The coordinator's round (routine 'BOSSES next round', 11/11): "Six bosses are live and their prizes land at his place. Next: the next
three from the ladder (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md), each found by a sign, each handing its VERB, each changing the map
its own way, each prize landing in his settlement through HOME BASE's seam; and row 587. Rule 441: each boss proven on the real page,
alpha and demo, on a phone both ways, fought to the end. One build per boss with a VOTE card, rows marked."

Row 587 shipped first (791431354, BUILD 11/11 row 587: the first boss's gate now measures the way in his crew shut).

## THE ASSETS FIRST (rule 337: no content without its assets)

| What | Tool | Ships |
|---|---|---|
| THE LOCKSMITH, THE CHARGE, THE MACHINIST: the men, their own pieces, their weapons on the hand bone | tools/bohemia_bosses_seven_to_nine_11_11_26.py (BOSSES 4's pipe, imported, never edited) | slices/fight_rig/boss_locksmith_0, boss_charge_0, boss_machinist_0 |
| THE LOCK SHOP, THE POWDER YARD, THE PIPE SHOP, before and after | tools/bohemia_bosses_seven_to_nine_places_11_11_26.py | slices/boss_places/lockshop_*, powderyard_*, pipeshop_* |
| what each verb leaves: a cut lock, rubble, a welding bench | same | cutlock, rubble, weldbench |
| the piece each one leaves on a street block: THE CURFEW gate (night, day, after), THE MINE (before, after), THE NAILS (before, after) | same | curfew_*, mine_*, nails_* |
| the three things they hand you: HIS PICK SET, HIS POWDER, HIS PIPE GUN | tools/bohemia_bosses_what_they_hand_you_11_3_26.py (three things added) | hand_pick.png, hand_blow.png, hand_weld.png |

The men: THE LOCKSMITH (a tall thin older man, charcoal turtleneck under a leather vest, a watch cap, a ring of twelve keys at his hip,
a heavy chain across his chest with a brass padlock, THE BIKE-LOCK CHAIN in his fist with its padlock swinging); THE CHARGE (a big man,
field jacket, slate work cap, a belt of ten tan sticks round his chest on a canvas web with red wire and a receiver, a dead man's switch
in his left fist, the 8-pound SLEDGE in his right); THE MACHINIST (coveralls under a smith's apron, the welding mask pushed up, two gas
bottles on his back with a hose, a shell bandolier, HIS PIPE GUN). Measured at the first look: THE MACHINIST's back frame stood off his
body as a hoop and his pipe gun was one pixel at the fight's size; the frame is gone and the pipe is drawn at 4.4 cm.

## THE LOCKSMITH (the ladder's 7th: every lock still working). BUILD 11/11

HIS OWN WAY: THE CLOCK DECIDES THE ROADS. While he stands his keymen hang chain-link gates across the streets round his shop and chain
them at dark. By day they stand open. At night every one is shut and the map's own walk goes the long way round. Each gate is a street
block that runs one way, 2 to 7 blocks from his door, whose shutting makes the walk round it at least 4 blocks longer, and none ever cuts
a way: with every gate shut the crew still reaches his shop and every town it reached before, and the block the crew stands on is never
shut under it. Not a wall that stays (THE POT), not a toll (THE TAP), not the dark (THE BURN): the night decides where you can go.
When he falls the chains are cut, the gates lie in the street, and the roads stay open all night, kept after a reload.

- Found by WORLD TWO's sign: the padlock scratched EVERY LOCK IS THE LOCKSMITH'S.
- Asker: DOÑA LUPE, locked out of her own house (faction_church's face).
- Fight: an assassin's numbers at 1.6 blood with THE BIKE-LOCK CHAIN (BB's flail: over a shield, at the head), his keymen (two thugs, a
  caravan guard), on the downtown board. Lesson: helmets on the men in front, close on him from two sides.
- Verb: PICK THE LOCK. Next to a locked place (a police station, a jail, a shop, a mall, a storage yard), once a door: 8 batteries.
- Prize: HIS PICK SET, through HOME BASE's seam (section 14 hands any verb HOME BASE's table does not know).
- Code: slices/bohemia_bosses.js (15) HIS GATES; cityWalkable wrapped (the one wrapper the bosses own: shut, then locked).
- Data: records/target/bb/boss_act_one.json row THE LOCKSMITH, 'curfew'.
- Gate: gates/the_next_three_change_the_map_gate.js "THE LOCKSMITH" (K1 open by day, K2 chained at night and the long way round,
  never cut off, K3 said and posted; C1a/C1b cut after; R1 the reload; planted P2, P3, P4, P5).

RESULTS (BUILD 11/11n): THE LOCKSMITH CHANGES THE MAP 21/0 on the demo upright and 21/0 on the alpha on its side (on main as of
a96de3ca2, his fight won by AUTO with his own body and face both ways). Measured on the way:
- The first run had his body and face missing (B0, B1 red) because the fight pass had not been packed yet: packed, both green.
- THE DEMO UPRIGHT CAUGHT A REAL BUG (K2 red, 'the walk past his gate goes -1 blocks round'): two of his gates stood on one street 3
  blocks apart, so the two blocks between them were cut off at night, and a crew standing there would be locked in till morning. The
  choice now refuses any set of gates that leaves a pocket (every block near his shop his door reaches by day it still reaches at night,
  gates aside), and the gate checks it (K2 'pockets', planted P2b).
- The walk past one of his gates at night: 16, 17, 22 and 26 blocks round instead of 2 on four different random games.
- The hand things were renamed singular (HIS PICK SET, HIS POWDER): the card header read 'HIS PICKS IS YOURS'.
- The suite's browserless tier on this tree: no red gate names any file of this round (its reds are the fleet's: the repo's growth,
  the published surface over 900 MB, two image libraries missing in this box).
- VOTE bosses-the-locksmiths-gates-11-11: records/target/bosses_vote_locksmith_11_11/VOTE.webp (his shop at night, the gates chained,
  then DOÑA LUPE's card); his moving card records/target/bosses_seven_to_nine/VOTE_BOSS_LOCKSMITH.webp.

## THE CHARGE (the ladder's 8th: who still has anything that goes off). BUILD 11/11r

HIS OWN WAY: THE STREET ITSELF IS THE DANGER, AND DAYLIGHT IS HOW YOU READ IT. While he stands his powder men have buried can charges in
5 street blocks 2 to 5 out from his yard (the sign's way in first). By day the dug dirt shows: a mine next to the crew or down the street
in sight (the map's own sight, which sees along a street and never round a corner) is spotted for good, drawn with a stake and a rag,
and the map's own walk goes round it (never where that would cut the crew off from him). At night nobody sees dug dirt: walk onto one you
never spotted and it goes off: the walk stops, one of your men (never the main man) takes the injuries table's Pierced Leg Muscles for 4
days and 20 blood (BohemiaCondition, the crew screen's own wounds), and the block is a hole. Not a wall, not a toll, not the dark, not a
hunt: Battle Brothers' lesson that scouting decides the road. When he falls his men dig every one up, kept after a reload (and WORLD
TWO's wall comes down where his yard was, its own).

- Found by WORLD TWO's sign: the radio, then a bang.
- Asker: TEO, a quarry man whose brother found one of the cans (faction_trades' face).
- Fight: an engineer's numbers at 2.2 blood with THE SLEDGE (BB's Two-Handed Hammer: three men at once, knocks them down), his powder men
  (a raider, a thug, a marksman), on the canyon board. Lesson: spread out, hit him from the sides.
- Verb: BLOW A HOLE. Beside a wall between two streets where the walk through is at least 3 blocks shorter than the way round, once a
  day: the block becomes a way through for good (cityWalkable's bosses wrapper: a hole you blew is walked; the rubble lies in it).
  Measured: the phone shows one verb, the order's first, so beside a shop PICK THE LOCK takes the button and BLOW waits for the next block.
- Prize: HIS POWDER, through HOME BASE's seam.
- Code: slices/bohemia_bosses.js (16) HIS MINES. Data: boss_act_one.json row THE CHARGE, 'mines'.
- Gate: "THE CHARGE" (M1 spotted by day, painted, walked round; M2 at night one nobody spotted goes off and wounds a man; C1a/C1b dug up;
  V1 BLOW A HOLE; R1 the reload with the hole; planted P2, P2b, P3, P4, P5, P6).

Measured on the way: the first runs had M1 and M2 red. The map sees along a street and never round a corner, so a mine two blocks off on
the diagonal was never spotted (the gate stands beside it or down the street now); and the night walk to the far mine went by his yard,
so his own card stopped the walk before the mine (the gate walks a way that keeps off his yard). Standing on one at night, it went off and
RAUL took the wound (the probe, before the fix).

RESULTS (BUILD 11/11r): THE CHARGE CHANGES THE MAP 22/0 on the demo upright and 22/0 on the alpha on its side. On the way: the gate's
night lasted one step (the map's T.min alone; the walk syncs it back from the day's own clock), so the gate now sets the day's clock to
dusk (18:10: the map's night starts at 18:00, the day ends at 22:00) for a walk taken at night; one alpha run lost TEO's card in its
first 140 seconds and cascaded red, the next alpha run was 22/0 (earlier alpha runs had her card too). A man takes the wound twice if
the walk crosses two cans (RAUL, 37 blood, on the demo run).
- VOTE bosses-the-charges-mines-11-11: records/target/bosses_vote_charge_11_11/VOTE.webp (the gate's own phone: a mine spotted by day, one
  gone off at dusk, dug up after, TEO's card).


## THE MACHINIST (the ladder's 9th: the pipe, the cap and the nail). BUILD 11/11v

HIS OWN WAY: TIME IS WHAT HE TAKES. While he stands his men throw nails and welded caltrops over 14 street blocks within 4 of his pipe
shop (the sign's way in first): every one costs the walk 3 times its minutes (the map's own minutes, cityStepMins wrapped the way
cityWalkable is), so the map's own walk by minutes goes round them where it can and the clock runs when it cannot. Not a wall, not a toll,
not the dark, not a hunt, not a mine. When he falls his men sweep them up and the same streets are his carts' road, swept and graded:
0.6 times the minutes, faster than plain ground for good (Battle Brothers: a road is faster than the land round it), kept after a reload;
and WORLD TWO opens THE PIPE SHOP (its own).

- Found by WORLD TWO's sign: a man at the bar.
- Asker: LA GÜERA, a mechanic with burned forearms (faction_anarchists' face).
- Fight: a gunner's numbers at 2.0 blood with HIS PIPE GUN (BB's Handgonne: two tiles, through the men in front, a turn to load), his
  shop boys (two marksmen and a thug), on the works board. Lesson: rush him the turn after he fires.
- Verb: WELD A PIPE GUN. Next to scrap (an industrial block, a storage yard, an arsenal, a boneyard, a dump), once a day: a PIPE GUN (the
  Handgonne's numbers, draft) into the company's bag (bohemia.bag.v1, the stash every screen reads), or YOUR BAG IS FULL.
- Prize: HIS PIPE GUN, through HOME BASE's seam.
- Code: slices/bohemia_bosses.js (17) HIS NAILS. Data: boss_act_one.json row THE MACHINIST, 'nails'.
- Gate: "THE MACHINIST" (N1 three times the minutes, painted; N2 said and posted; N3 the walk by minutes goes round; C1a his road; V1 WELD;
  R1 the reload with the gun in the bag; planted P2, P3, P4, P5, P6).

RESULTS (BUILD 11/11v): THE MACHINIST CHANGES THE MAP 23/0 on the demo upright and 23/0 on the alpha on its side. Measured: a nailed
block costs 16.1 minutes against 5.4 plain; his road after him 3.2; the walk to his door 59 minutes instead of 38 (demo) and 86 instead
of 54 (alpha) across his nails; WELD put one PIPE GUN in the bag and then cooled for the day. On the way: the first N3 asked for a nailed
block with a plain block each side and found none (his nails are one patch), the second asked the walk by minutes to cross fewer nails
than the shortest walk and found the streets round his shop are dead ends with no way round, so the honest check is the clock: the walk
to his door costs more minutes for his nails, and the walk by minutes never crosses more of them than the shortest walk.
- VOTE bosses-the-machinists-nails-11-11: records/target/bosses_vote_machinist_11_11/VOTE.webp (the gate's own phone: his nails, his road,
  LA GÜERA's card). The three men's moving cards: records/target/bosses_seven_to_nine/VOTE_BOSS_{LOCKSMITH,CHARGE,MACHINIST}.webp.

## THE ROUND, ALL THREE
Nine bosses now, each changing the map his own way: THE POT shuts streets, THE TAP's pipe costs blood, THE FILTER's machines fight, THE
BURN's dark, THE SURVEYOR's forgetting, THE CLIMB's hunt, THE LOCKSMITH's clock (gates at night), THE CHARGE's danger read by day (mines),
THE MACHINIST's time (nails). Every prize through HOME BASE's seam. Each gate both ways on the real page, fought to the end.

