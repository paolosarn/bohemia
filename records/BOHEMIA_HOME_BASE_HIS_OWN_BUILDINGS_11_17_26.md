# HOME BASE, 11/17/26: HIS OWN BUILDINGS (BUILD 11/17l; VAMILY rule 453(1), rule 445, rule 441; ask line 571)

The coordinator's round (rule 453, 'do a full sweep, let's have some fun'): (1) the next buildings that open a door (a place to train
his men, a place to craft, a wall and a watch post), each SEEN standing in the camera feeds; (2) a defence fight at his place; (3) his
impact shown there. Rule 454(a): no standing line rewritten, new words the fewest. This is (1).

## MEASURED FIRST (main b94bd492, the demo upright, a planted place)
- His place could build lotbuild's eight (wall, tank, shed, pump, garden, solar, stall, roof). None trains, none crafts, none watches.
- lotbuild's list is every held part's and is copied into the map (two bodies); each entry is checked against a district kit's art,
  so his own buildings are HOME BASE's, not lotbuild's.
- The game has the pieces: the crew climbs by the fight's XP count (engine/bohemia_roster.js grant, the crew screen's after-fight
  queue bohemia.fight.after.v1); the company's supplies (tape, rounds) are the top bar's (bohemia.supplies.v1); the map knows every
  roaming crew (partiesAll). CAMP TWO cooked the right pieces (slices/camp_two/kit.png): the drill sergeant's bag on its post, the
  blacksmith's anvil and shield, the lookout's raised seat.
- Battle Brothers' Training Hall (reference/library/grok/wiki/CORE_WIKITEXT.md): Veteran's Lessons, +35% XP over the next 3 battles,
  the price growing with the man's level.

## WHAT WAS BUILT
1. records/target/bb/home_base.json places: TRAINING YARD (TRAIN; 1 battery 3 tape), FORGE (CRAFT; 1 battery 4 tape), LOOKOUT (WATCH;
   1 battery 2 tape). One of each, on his place's first free open lot, standing the day after (engine/bohemia_home.js buildPlace,
   placesOf). They count as standing, so the place grows by them too.
2. Each stands on its lot in CAMP TWO's own piece, at a man's height where the lot allows, and is a door on his place's town screen;
   CAM 2 THE LOTS sees all three.
3. THE YARD: a tap, then a man: he trains for his level's price (2 batteries a level under 2), +35% XP over his next 3 fights. The crew
   screen counts it (BOHEMIA_ROSTER_SCREEN.html __HOME_BASE_TRAINED__, engine trained()): proven on the real crew screen, the same
   100 XP fight gave the trained man 135 and the untrained 100, his training then 2 fights left.
4. THE FORGE: PRESS ROUNDS, 2 tape into 6 rounds, the top bar's own counts.
5. THE LOOKOUT: says the nearest roaming crew within 10 blocks, its faction, its distance and its way ("Nobody within 10 blocks."
   when there is none).
6. The desk: eleven to build, three across upright (six on its side), each its cost and its line, no word cut, the sheet still under
   half the glass upright. YOUR PLACE CAN adds TRAIN, CRAFT, WATCH, lit when they stand.
7. Fixed on the way: a build's door is its own drawn picture (the tank's door, as tall as the whole BUILD box, took the tap meant for
   the lookout behind it, measured on its side); a gift build cleared from its lot frees the lot (the record kept its stale lot).
New words (rule 454(a), the fewest): the three names and lines, 'Who trains?', 'Scrap in, rounds out.', the lookout's two lines, the
train and trained tags, PRESS ROUNDS.

## THE GATE: gates/home_base_gate.js, YOUR PLACE, PLANTED
Engine 30/0 (E10: refused before planting, one of each, never on the pot's lot, nothing off the list, standing the day after; the yard's
100 is 135 then 2 fights left, the untrained 100; the price is the level's; PLANTED: a training that adds nothing is caught).
Demo upright 101/0, sideways 98/0 (D17: the desk offers the three; a real tap puts the yard up for 1 battery and 3 tape; the next days
all three stand as doors; CAM 2 sees them; a real tap trains a man for his price; the forge presses 2 tape into 6 rounds; the lookout
says what it sees; the desk says TRAIN, CRAFT, WATCH; the crew screen gives the trained man 35 more of 100). The alpha probed by real
taps both ways. THE SETTLEMENT SCREEN 75/0 before the rebase; after it 74/1, the one red (THE BAR MOVES THE PRICE: Hostile
prices as Neutral) red the same on main's own town screen and map (run with this round's two files swapped for main's): not this diff. BUILD A LOT 62/0. EVERY LEVEL WAITS 7/1 and STRUCK DOWN, HE STILL FIGHTS 33/1: their phone
halves green, their computer half lost its browser on this box ('Target page, context or browser has been closed'); a run of the first
with this round's crew-screen hook taken out did not finish inside 560 s, so it proves nothing either way. The hook changes the XP of
a man trained at the yard only, and nobody is trained in those gates.

## NOT DONE, SAID PLAINLY
- A WALL that changes a defence fight is (2), the next build; the lookout's warning before a raid belongs with it.
- The pieces stand small (his place's lots are small in the camp picture); his own bare ground is still owed.
- The forge makes one thing (rounds); more recipes are TUNING's and ECONOMY's to set.

[bb Battle Brothers' training hall gives a man +35% XP over three battles for his level's price; ours is a yard behind your place.]
[analog horror: a bag on a post in an empty yard; on CAM 2 it is still swinging.]
