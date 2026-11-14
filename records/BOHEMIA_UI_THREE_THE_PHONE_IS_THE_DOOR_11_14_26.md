# UI THREE: THE PHONE IS THE DOOR (11/14/26)

VAMILY rule 448, ask row 615. The coordinator's routine "UI THREE the phone is the door" (11/14): it goes ahead of the icons and bars;
the motion lane is closed, so this is UI THREE's. Session UI THREE (claude session 01GKDyuvPvmndtYsPNo59Yab).

## His words (11/14)
"When in doubt and you don't know what to do with the UI transitions, just do it from where the phone screen would be at all
times... if you don't have an artistic thing to combine something with, just do it from the phone, where the phone is at, just have
it come out from there."

## Every screen change, and where it opens from (measured on the demo, the phone upright and sideways)
Two layers move the game's screens, both one shared piece every page calls (no copy per screen):
- MOTION's layer (slices/bohemia_motion.js, MOTION 3's realMorph and its doors) moves the REAL screens:
  | screen | opens from | closes into |
  |---|---|---|
  | a town or the camp (its frame) | its place on the map (world) | the same |
  | the fight | its ground on the map (world: the dive) | home the same way |
  | a building's sheet (the board, the hall, the shop, the build sheet) | the building he tapped, its box in the town's picture (world) | the same |
  | the shop's item card, a sheet's page, the shop's man strip | what he tapped inside the sheet (world: the slot, the line) | the same |
  | the settings | the phone's own SETTINGS (phone) | the same |
  | the loot screen (the end of a fight) | the phone (or the fight's ability tray as the fight hands over) | the same |
  | the crew screen | its CREW button, on the phone (phone) | the same |
- The house's pop-up layer (slices/bohemia_ui_nothing_pops.js, POPS) moves the cards, and now EVERY ROW NAMES WHERE IT OPENS FROM:
  | card | from |
  |---|---|
  | the road event's card, the meet card, the day card, the notes, the town's talk, the town's warning, the settings' card, the end screen, the kills card | THE PHONE (was: grown in place, or from the finger) |
  | a tooltip | the finger (it is about the thing under it) |
  | the crew screen's 'let him go?', the level-up, an injury card | in place (a piece inside a screen unrolls) |
  | the fight's veteran, weapon card, 'fight over' | the fight's own glass: FIGHT SCREEN's (rule 449), untouched |

## Now
- THE PHONE'S SPOT, ONE ANSWER: where the phone stands (UI TWO's BOH_PHONE_RECT), else where it last stood on a glass of this shape,
  else its corner (bottom right, its size on a phone), carried into whichever page asks: the same spot on every screen, the phone
  drawn or not (BohemiaPops.phoneSpot).
- A card from the phone is laid over the phone's spot at the phone's size, travels out and grows (three held poses on the music's
  grid, the overshoot), lands; going, a copy of it travels back into the phone and is gone. The voice cards still stand clear of
  the phone where they land (their 'translate' is kept as the travel's end).
- MOTION's record now says where each real move came from (row.at), so a gate can check it.
- NOT CHANGED: what already grew from its own thing (the town, the camp, the fight, a building's sheet, the crew screen, the settings
  and the loot screen were MOTION 3's, 11/8 to 11/10). A first try here also moved the building's sheet from the pop-up layer and
  hid a closed sheet; MOTION already grows it from the building and needs it seen while it goes home, so that was taken back.

## Smooth (rule 441), measured on the demo
The worst gap between two painted frames while a screen opens: settings 17 ms upright and sideways; a building's sheet 33 ms in the
middle of four opens, against 17 to 33 ms for the same sheet with its move switched off (the sheet's own build is the cost; the
move adds no frame). The crew screen's grow: 543 to 683 ms, no gap in its record.

## Gate: THE PHONE IS THE DOOR (gates/the_phone_is_the_door_gate.js, new)
S1 every pop-up names where it opens from, every card that is not the world's, a finger's or the fight's opens from the phone; S2
MOTION's doors keep their things. On the demo, upright and sideways: L1 every move of the settings starts on the phone (the card at
the phone's centre within 6 px, the whole of it at the phone's SETTINGS), none anywhere else, the worst frame measured; L2 a
building's sheet comes from the building tapped (within 70 px) and goes back into it, no slide from an edge, the move adds no frame;
L3 the crew screen grows out of its button on the phone; L4 NO SCREEN WITHOUT AN ANSWER: every screen that appears on the walk is
named by the table or MOTION's doors, a new one turns it red with its name. Plant: the settings' card told to grow from the finger
with MOTION's move off: L1's judge turns it away. 13 passed, 0 failed.

## The seam with FIGHT SCREEN (rule 449)
FIGHT SCREEN owns everything on the fight's glass, its own pop-ups included (the rows marked 'top' here are its, untouched). The
changes INTO and OUT OF the fight stay this rule's: into it, MOTION's dive from the fight's ground on the map; out of it, the loot
screen up out of the phone (or the fight's ability tray: MOTION finds it by data-morph="abilities") and home. FIGHT SCREEN: keep
data-morph="abilities" on the tray and data-morph="phone" on the phone while the fight is up, and a new screen of the fight's that
leaves the fight's glass opens through BohemiaPops (a row with its from) or MOTION, never its own cut (NOTE on its board).

Picture (it plays): records/target/ui3_the_phone_is_the_door_11_14/the_road_card.webp, a road event's card the old way (grown in
place) and now (out of the phone and back into it), the demo on a 390 x 844 phone.

[bb Battle Brothers' event cards open over the map from its centre; ours come out of the phone in his hand, the one thing that is
always his.]
[analog horror: every message comes out of the cracked phone's glass and goes back into it, like a feed you cannot close.]
