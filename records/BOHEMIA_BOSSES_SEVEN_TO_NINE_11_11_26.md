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
