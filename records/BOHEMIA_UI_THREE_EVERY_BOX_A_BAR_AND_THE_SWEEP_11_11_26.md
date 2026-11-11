# UI THREE: EVERY BOX A BAR, THE FEED'S HANDLES, AND THE SWEEP FOR FLOATING NAMES (11/11/26)

The coordinator's routine "UI THREE next round" (11/11): (1) the same icons and bars on every screen that still shows bare numbers
or words (the crew screen, the shop, the camp, the fight's unit card), upright and sideways; (2) ask row 559 (the FEED's look,
found by PLUMBER 8); (3) rule 442(b), nothing floats over the world to name it: sweep for any label that still does.
Asks 145 and 146 round four, row 559, rule 442(b). Session UI THREE (claude session 01GKDyuvPvmndtYsPNo59Yab).

## His words
- 10/26 (rule 224): "I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and the
  only number that matters is by how much."
- 11/9 (rule 442(b)): "it has to be naturally part of the world or I don't want it, the little floating labels I don't like it."

## (1) EVERY BOX A BAR
MEASURED (the demo and the crew screen, the phone upright and sideways, every number on the glass listed per screen):
- THE CREW SCREEN: his eight are bars (rounds one to three), but every piece's box still said a bare number: his gear's 40, 50, 24
  (what a hat, a vest, a car door hold) and the stash's 30, 65, 110, 70, 115, 24, 32 and 30-50, 30-40, 40-60, each coloured green
  or red against what he wears. Thirteen bare numbers in thirteen boxes.
- THE SHOP: at rest the shelf and the prices (a price is the one number he needs); one tap shows the item card as pictures and bars
  and each man's arrow and amount (rounds two, rule 433). Nothing bare.
- THE CAMP (a fight won on the demo, MAKE CAMP): only the bar's five counts and the clock (rule 224 keeps them). Nothing bare.
- THE FIGHT'S UNIT CARD: his hitpoints, armour and breath are bars with 58/58 on them, Battle Brothers' own way; the blow's AP are
  the fight's pips. Nothing bare (the '9 AP' beside the pips is COMBAT's file and says what the pips say).
- THE LOOT: its boxes are pictures and short names. Nothing bare.
NOW, the crew screen's boxes (his gear, the stash, the picker): each number is a bar under the piece's own picture, in the label's
own line (its 11 px), to the most any piece of its kind has (the item card's tops: a blow 120, a vest or a hat 320, a shield 72);
a weapon's bar is led by damage's picture (as before) with its low-to-high stretch lit and the low part dim; a piece that beats or
loses to what he wears carries the green up or the red down arrow over its bar's right end. The exact number is one tap away (the
item card, rule 433), and stays the label's words for the reader and every gate. Nothing changes size; the crew screen's count
stays 104 (budget 105: a first try with a small armour picture before every bar counted 114 and was taken back).
Where he meets it: the CREW button on the phone, in every town and on the map; the camp's crew screen too.

## (2) ROW 559: THE FEED'S HANDLES
MEASURED (THE CASING FACE, 14 ok 2 failed on main 75daeb7b): '@waterline', '@thecircuit', '@nightcount' set in the caps-only casing
face, so their small letters fell to another font; the face's own character list could not be read (fontTools missing here too).
NOW the handle prints in the feed's own ROM face (lowercase, '@' and '_' in it), its gold and its size kept
(slices/bohemia_ui_materials.js, one line). Fixing it showed one more: a family card's name ('Cyrus', #actflip) in the same face;
it is stamped in capitals like every name on a card. THE CASING FACE 17 ok, 0 failed.

## (3) RULE 442(b): THE SWEEP (a tool walked the demo at rest on the city, the open map, a town, a fight and the camp, upright and
sideways, listing every page element floating over a world picture and every word drawn into a world canvas)
- THE TOWN SCREEN: nothing floats to name a building (TOWN FIX took the signs off, 438(a)).
- THE FIGHT BOARD: no word drawn on the board; over it only each man's health bars and the taped hint 'Your line, before the fight.'
- THE CAMP: nothing floats; its MAP button is a press.
- THE OPEN MAP: the map draws its names Battle Brothers' way, every frame, one list (RUN's __NO_NAME_COVERS_ANOTHER__): the towns'
  and jobs' plates (CHURCH, BLUE DIAMOND; each one is also the tap that opens the town, __A_TAP_ON_A_TOWN_GOES_TO_THE_TOWN__), a
  party's plate with its count (REDS, CARTEL), the freeways' shields (WORLD's I-15, US 95, 215; ask 285 'the freeways look like
  freeways'), the land's names (SPRING MOUNTAINS, BLACK MOUNTAINS, LAKE MEAD; a tap on one says what it is), and the map's status
  line #packline over the land ('Cartel came through here just now. a crew, and they are close.'; the tracks, the travel lines,
  the pack's BACK OFF warning share it).
- THE SCAVENGE SCENE (not reached by this sweep): EYES found its spots float word labels (SEARCH, SIPHON, DETECTOR), ask row 608,
  SCAVENGE 2's, open.
NOT CHANGED, AND WHY: these are the map's own names, not a building's sign; several are the doors he taps, each is another lane's
system with its own gates (RUN, WORLD, LIFE), and he never asked for the map's names to go. Ripping them out in this round would be
the half piece rule 441 forbids. A NOTE on the coordinator's board lays out the fork: (a) keep them (Battle Brothers' map names its
towns and parties); (b) at rest only the towns' plates (they are doors) and a party's count, the land's names and the road shields
on a tap (433(b)); (c) the shields drawn as real roadside signs on the land (442(b)'s 'the place says it itself'). And the status
line: words with no mouth over the map (the 9/20 law) belong on the phone's feed as a post (BohemiaFeed.mouth exists); RUN and
WORLD own its writers.

## Gates
- THE ITEM CARD AND THE ITEM BOX (gates/the_item_card_and_the_item_box_gate.js) new leg V1, on the phone, the computer and the phone
  sideways: every number a crew screen box said is read OFF THE GLASS: the bar's lit stretch found in the pixels, within a pixel
  and a half of the files' number over the files' own top (a weapon's start too), the number not on the glass, damage's picture
  before a weapon's bar and nothing added before what holds, the arrow exactly where the screen marks better or worse. Plants:
  a box's bar to half its top (V1 red); the number put back on the glass (V1 red). 50 passed, 0 failed with eight plants.
- THE CASING FACE 17/0 (was 14/2).
- THE COMPANY SCREEN 48/0 (the count 104 kept).

## What is not done (said plainly)
- The map's names (above): a fork for the coordinator, NOTE on its board.
- The crew screen's 'ARMOUR: LIGHT, WALKS FREE' is still words (RUN TWO's weight line, ask 406); the fight's '9 AP' beside its pips
  (COMBAT's file).
- EYES has not seen it (rule 179): BUILT, NOT YET SEEN.

Pictures: records/target/ui3_every_box_a_bar_11_11/before_and_now.webp (the crew screen before and now on a 390 x 844 phone, twice
the pixels; under it the demo's crew screen sideways).

[bb Battle Brothers' stash and paperdoll show each piece with a thin condition bar under it; the number comes on the hover.]
[analog horror: a pawnshop's shelf tags with the numbers worn off, only the fill line inked on the cardboard left.]
