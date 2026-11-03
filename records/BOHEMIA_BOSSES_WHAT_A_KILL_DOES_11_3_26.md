# BOSSES FIX, 11/3/26: WHAT A KILL DOES (rule 338, ask line 346)

PAOLO 11/3, playing after the last round: "we still don't know what killing them does, like wtf, and the map effects where their
shit is... I don't like the map icons after I kill a boss too, like wtf."

The first three only (THE POT, THE TAP, THE FILTER). No new boss (rule 337). Their bodies and weapons are COOK ARMOUR's this round:
not touched. Last rounds: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md, records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md.

## MEASURED FIRST, AS A STRANGER (origin/main 6515a3f2)

The boss gate's own stranger's game (the demo, an upright phone 390 x 844, the fog, real taps), each of the three played to the kill,
with a new switch on the gate (BOSSES_EVERY_SECOND) taking a picture every second from the win until he is back on the map and told.
The spoils screen's LEAVE is now a real tap (it was the checker's door). That run: 43 passed, 0 failed (the old checks).

| second after the win | THE POT | THE TAP | THE FILTER |
|---|---|---|---|
| 0-2 | the spoils screen | the spoils screen | the spoils screen |
| 3 | the map back, dark, his place not in view | the map, one second | the card is already up |
| 4 on | her card: SIX LINES of text over the middle of the map, his place under it | his card, six lines | her card, six lines |
| after GOT IT | the next boss's asker, at once | the next boss's asker 3 seconds later (DOC REYES replaced EL CHINO's card) | |

What a stranger did not know, moment by moment:
1. WHAT CHANGED: the kitchen going from black smoke to lit windows was never on the glass. The camera stayed where it was and the
   card covered the middle of the map within one second.
2. WHAT HE GOT: "his pot is yours" is in the middle of a six-line paragraph. No thing, no picture of it. The phone's button lit
   behind the card with a cookfire picture 14 points wide.
3. WHAT IT DOES, WHERE, HOW OFTEN: all in the paragraph, the numbers buried in it.
4. THE MAP AFTER (his words: "I don't like the map icons"): on his place, WORLD TWO's cracked-skull marker beside a door marker and
   a yellow box plate (CLEAN WATER), the verb's 9-second plate ("CLEAN WA[TER W]OUNDS FASTER", half under his men), the town plates
   round it, and HIS OWN MEN STANDING ON THE CHANGED TANKS (THE FILTER stands on a plain street when no works is in reach, and his
   place was painted on that same block). Four labels and a marker on one block, and the change itself hidden.
5. USING IT: the button showed THE POT IS COOLING, grey, on every block for a day, even at THE FILTER's water. The first use put a
   dark box with yellow words over the block for nine seconds: one more sticker.

## WHAT SHIPPED

### 1. The moment he falls (slices/bohemia_bosses.js, (5))
When the spoils screen closes, before anybody talks:
- THE CAMERA GOES TO HIS PLACE: 0.9 s, the map fit's own maths (__THE_MAP_FITS_YOUR_JOBS__), never farther out than he was, to a
  block about 78 points (his place about 112 points wide, a third of the phone).
- THE CHANGE HAPPENS THERE, IN THE MAP'S OWN PAINTED ART: the BEFORE stands for 0.7 s (black smoke; the dry tower and its red lamp;
  the green sludge), then the AFTER rolls down over it for 1 s like a tape tracking in (above the line the after, below it still the
  before, the line itself a few rows of the after slipped sideways and one pale scanline: analog horror, on the beat), then the
  after breathes on its two beat frames for 1.3 s. It plays on this lane's own glass over the map, so his men never cover it.
- THEN THE ONE WHO ASKED SAYS ONE LINE FOR THE VALLEY (after.valley, draft:true):
  TÍA CARMEN: "The kitchen is open again, mijo. The whole strip eats tonight, not only his crew."
  EL CHINO: "The water is running! My whole street drinks again, and nobody pays him for it."
  DOC REYES: "The tanks run clean. Clean water means cuts stop going bad, all over the valley."
- AND HOLDS OUT THE THING HE HANDS YOU, with one plain line (what, where, how often, the number):
  HIS POT: "COOK: once a day, anywhere outside a town. Your men get 8 hours of healing and no time passes."
  HIS WRENCH: "TURN THE WATER ON: on a street next to the water works. Each main runs for good and pays you 6 batteries, once."
  HIS FILTER: "CLEAN THE WATER: next to water or a main you opened. Every fresh wound on your men heals 2 days faster. Once a spot."
- TAKE IT: the thing flies off her card in an arc into the phone and lands on the verb button, which flashes three times.
- Then a minute with nobody stopping you (the next boss's asker waits): he sees the map changed and can try the power.

The three things are new art through DIRECTION's rig, like every icon since 11/2: tools/bohemia_bosses_what_they_hand_you_11_3_26.py
imports DIRECTION's icon tool unedited and runs its model, rig and cut with three new models in real metres (a 30 cm copper stock
pot with its lid and loop handles, an 18-inch pipe wrench with the red handle, a whole-house filter housing with its in and out).
slices/boss_places/hand_cook.png, hand_open.png, hand_purify.png (96 x 96).

### 2. The map after a kill: the changed place is the mark
- WORLD TWO's cracked skull, door marker and yellow place plate stand down where a boss's place is painted (slices/bohemia_his_map.js,
  two marked lines; the place still counts as drawn for HIS MAP's B4).
- The 9-second plate is gone.
- The place's name, once he is down: no box, no colour, 9-point letters, faint, under the place, and only when the place is at least
  72 points wide (close). Far out, the painted place alone.
- His place is painted beside the street he fought on, never under his men: the building block by the door, or for a boss WORLD
  TWO stood on a plain street the nearest building block behind it. A verb's mark (the cookfire, the running main, the drum) and the
  shut mains sit off his men's feet the same way.

### 3. Using it
- The phone's button shows the thing he handed you (his pot, his wrench, his filter, 20 points) and its plain name, and it lights
  only where it works: no more grey THE POT IS COOLING on every block (the feed already said the pot cools for a day). When it
  comes on it flickers twice like a tube light (slices/bohemia_phone.js, marked __THE_BOSS_VERB_ON_THE_PHONE__).
- Every use plays the change where he stands: the cookfire rolls in, the main goes from shut to running, the drum of clean water
  appears, and the number rises off his men for two seconds (+96 BLOOD, +6 BATTERIES, 2 WOUNDS: 2 DAYS FASTER); the number is on the
  feed in plain words, as before.

The words and the numbers are in records/target/bb/boss_act_one.json (after.valley, after.take, verb.hand, verb.first.rise), draft:true,
every number a shape TUNING owns.

## PROOF, THE SAME STRANGER'S RUN AFTER

gates/bosses_act_one_gate.js, extended (A5m the moment, A5b one line and the thing, A5f the flight, A5i the map after, A6c the use),
the same stranger's game with a picture a second (BOSSES_EVERY_SECOND): **55 passed, 0 failed** (on origin/main 6515a3f2 plus this
round, the final code). Won by: THE POT AUTO; THE TAP and THE FILTER the checker (AUTO lost; the crew meets them hurt, last round's note stands).

| | the moment (A5m) | her line and the thing (A5b, A5f) | the map after (A5i) | first use (A6c) |
|---|---|---|---|---|
| THE POT | camera 0.9 s to his place, zoom 1.0 to 4.3, THE KITCHEN 112 points wide, 20 px from the open middle; black smoke, the tape, windows lit; 4.15 s, her card 1 ms after | TÍA CARMEN's one line + HIS POT; TAKE IT: the pot flew to the button COOK: HEAL YOUR MEN | kitchen_after on the building beside his men, no skull, no door, no plate, the name faint over it | +45 BLOOD rose off his men, the cookfire rolled in at their feet |
| THE TAP | the same, 13 px off the middle, 4.0 s | EL CHINO + HIS WRENCH onto TURN THE WATER ON | tower_after beside his men, clean | +6 BATTERIES, the main went from shut to running |
| THE FILTER | the same, 23 px off the middle, 4.1 s | DOC REYES + HIS FILTER onto CLEAN THE WATER | tanks_after beside his men (THE FILTER stood on a street: his place moved to the building behind it), clean | 2 WOUNDS: 2 DAYS FASTER, the drum of clean water |

THE STRANGER'S SECONDS, NOW (THE FILTER; the other two the same shape): 0-1 the fight's end, 2-4 the spoils screen, 5-9 the map at his
place (the green sludge, the tape, the clean water), 10-12 her card with his filter, 13 on the map with nobody stopping him. Before:
one second of dark map, then six lines of text, then the next boss's asker.

FOUND AND FIXED ON THE WAY, BY THE PICTURES:
- The next boss's asker landed the second her card closed (EL CHINO over the kitchen, DOC REYES over THE TAP's card). A minute's
  hush now follows TAKE IT, and it is set BEFORE the card closes: the first try set it after, and the close's own redraw asked the
  next asker in between (seen in the second run's pictures, fixed, the third run clean).
- His place's faint name sat under his men's feet; it is over the place now.
- The shut mains near him: six within twelve blocks was more marks round him than the changed place; three within eight, faded.
- A red X square near THE FILTER's place in both the before and after pictures is NOT a boss mark (not the shut main, not the
  grave cross, not drawn by this file or the skull/door/plate code); left for its owner, named here so nobody thinks it is ours.

Pictures (half size): records/target/bosses_act_one/ (each boss: who asks, the clue, his place and card, his fight, the moment's card,
his place after, the held finger, the verb used). The VOTE sheet: records/target/bosses_act_one/vote_what_a_kill_does.webp (last
round's two moments over this build's five), its twin was_filter_map_after_the_kill.webp.

## NOT DONE / NEXT
- The other sixteen of act one take a row each the same way (valley, hand, rise) and a model each in the hand tool.
- The pipe wrench reads at 44 points on the flight, less well at 20 on the button; a sharper jaw is a ten-minute rig rerun.
- UI 4's long-press tooltip still takes over the held finger on the verb button when it lands.
