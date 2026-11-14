# UI THREE: THE ITEM CARD IS PICTURES, THE ITEM BOX IS A LIT WELL (11/7/26)

Rows [the weapon card] (rule 251(b)) and [the item box] (rule 249(d)), opened again by rule 425(a), "the months of jobs".
Ask lines 178 (the weapon card) and 175 (the item boxes), with 145 and 146 (stats as icons and bars everywhere) moved on.
BUILD 11/7s - THE ITEM CARD IS PICTURES. Session UI THREE (claude session 01GKDyuvPvmndtYsPNo59Yab).

## His words

- 10/26 (rule 251): "there's so many numbers, we don't need this many numbers, it should just be an icon, a green arrow up,
  a red arrow down and a number... the way the weapon stats are displayed is dog shit, it's so ugly."
- 10/26 (rule 249): "the interior of the boxes kinda looks like dog shit."
- 11/7 (rule 425): "more of the jobs I've been asking you for months... I'm just concerned you don't have it all recorded."

## Measured before (the phone, 390 x 844, main at 61f555a6)

- The shop's card (the smith, a fire axe tapped): a line of word chips, "DAMAGE 30-40 | VS ARMOUR 120% | THROUGH ARMOUR
  40%", cut by its own box after the third; TO HIT, HEAD, REACH, A SWING and WEIGHT were never on the glass.
- The weapon's card (UI 8's pawn ticket, 11/6): every blow as "4 AP . 13 BREATH . 1 TILE"; the rifle's shot said
  "6-6 TILES" (the row's raw columns) where the fight reads 1 to 6.
- A full box: the kit's pocket at 44 points; its two walls a black bracket across the top and the left of every piece,
  the piece small on a flat brown floor. Every box the same, whatever the piece was worth.
- The crew screen's stash wrapped "30-50" onto two lines; his main hand's box wrapped "1-4 TILES" onto two lines over
  the pistol, which sat on top of the words MAIN HAND.

## Now

### The card (slices/bohemia_ui_three_items.js, BohemiaItemCard.cells)
A row of pictures, each with its bar or one number. Never a line of words.

| what | the picture | the bar or the number |
|---|---|---|
| DAMAGE | the hole (10/26) | a bar to the hardest blow in the game (120), the low-to-high stretch lit, "30-40" on it |
| VS ARMOUR | a sledge on a rusted, cracked plate | a bar to the most any weapon does to armour (225), "120%" |
| THROUGH ARMOUR | a round through a plate seen edge on | a bar to the most any weapon puts through (60), "40%" |
| REACH | slabs: his own with him on it, then every tile he reaches lit amber | the picture is the number |
| ACTION | the fight's own pips (its drawer's amber bar) | one lit for every AP the blow costs; the big card shows all nine |
| BREATH | the lungs | how much breath one blow costs |
| WEIGHT | an anvil | a red arrow down and how much breath it takes off him |
| ROUNDS | one brass round a shot | the magazine |
| TO HIT, HEAD | the skill's own picture, a range target's paper man | a green arrow up and the amount |
| TWO HANDS | two fists on one haft, big, beside the name | (RUN TWO's words kept beside it, rule 194(b)) |
| ARMOUR / HOLDS | a dead cop's plate carrier, navy | a bar to the most any piece of its kind holds (body 320, head 320, shield 72) |
| MELEE DEF, RANGED DEF, INITIATIVE | the stat's own picture | the arrow and the amount |

Every bar's most possible is the top of its own column in the rows, worked on load from weapons.json and armor.json (the same
rule as the stats' bars, rule 223: "how far it is from the maximum that's even possible"). Every cell keeps its word for a
screen reader and on a held finger (title), never on the glass.

Where he meets it:
- THE SHOP'S STRIP (every smith, armourer and camp shop in the CITY): one row under the piece's name, the least read clipped
  first; RUN TWO's itemNums still decides what the card says (a marked __UI_THREE_ITEMS__ block lays its numbers as pictures),
  and RUN TWO's chip contract is kept (span.ch, data-stat, a stat_icons picture, "DAMAGE 30-40" in the reader's text).
- THE WEAPON'S CARD (UI 8's pawn ticket, a tap on any weapon in the shop, the stash, his gear, the loot): the big card under
  the title, bars long, nine pips with the blow's lit; every blow's row its pips, its breath and its slabs; the words "4 AP .
  13 BREATH . 1 TILE" kept for the reader and for UI 8's own gate. One marked line in slices/bohemia_ui_weapon_card.js calls it.
  The blow's slabs read the fight's own reach (BohemiaRoster.armOf), so the rifle's shot is 1 to 6 like the fight, not "6-6".

### The box (BohemiaItemCard.dress)
- A FRAME WHOSE METAL IS THE PIECE'S QUALITY: rust for a beat-up piece (pitted), bone tin for a solid one, brass with a rivet
  in each corner for a good one, brass round red enamel for the valley's own (armory.json), dark tin for an empty box. The
  quality is the shop's own qualityWord (a weapon's rank in its class and hands by value), so a tile named "beat-up pistol"
  is always rust; armour, helmets and shields by value in their kind (worn 115, solid 93, good 102, own 28 of 338 pieces).
- A RAISED RIM: three bands, its outer lip lit up and left (the kit's one sun), its inner lip the other way round.
- A RECESSED WALL: the rim's shadow on the floor at the top and left, ordered-dithered at the glass's own pixels; a lit edge
  bottom and right.
- THE KIT'S OWN FLOOR (rule 430: the Crashbox art stays and is improved, never thrown away): the pocket's cardboard lining for
  a box with a piece in it, its cracked glass for an empty one, each box cut from another part of the glass as the kit cuts it.
  The black bracket (the pocket's two walls at 44 points) is what is gone.
- A LAMP OVER THE PIECE: a warm pool on the floor, four dithered steps; the piece dropped on its own hard shadow down and right.
- NOTHING CHANGES SIZE (rule 250, UI 9's sizes, rule 402): the frame is a border image drawn over the box's own padding, the
  floor and the light its background; with the dress taken off every box measures the same within a pixel; the lit box's
  outline stays inside its rectangle.
- Inside his gear's boxes, "1-4 TILES" is its slabs and "5 RDS" its rounds, drawn as the label's own background (the label's
  words stay its text, so every screen and gate reading "1-4 TILES" still reads it, and the crew screen's count stays 104,
  rule 172(c)); the stash's "30-50" sits on one line.

Where he meets it: every box in the shop's shelf and bag, the crew screen's stash, his gear and the picker, and the end of a
fight's loot and stash.

### The pictures (tools/bohemia_ui_three_item_icons.py)
Twelve new, drawn with UI's own renderer (a solid with a height, the kit's one sun, outlined in the receipt's ink, on a hard
shadow), never a CSS gradient: armour, vs_armour, through_armour, weight, two_hands, head, round, pip, pip_off, tile,
tile_lit, tile_you. Sheet: records/target/UI_THREE_THE_ITEM_CARD_PICTURES_11_7_26.png.
UI's look-alike measure (gates/the_stat_icons_read_at_a_glance_gate.py) holds the six big ones apart from the nine stat
pictures and each other at 72, 54 and 18 px, and a stranger names each in 40 glances. It bit three times on the way: a
kettlebell, a skull and a green carrier each read as the fist (resolve) or the sandbags (ranged defence) at 18 px, so the
weight is an anvil, the head a white range target with a post, the carrier navy and cut wide.

## Gate: THE ITEM CARD AND THE ITEM BOX (gates/the_item_card_and_the_item_box_gate.js)
I1 the pictures (the tool's check); I2 every row of 338 pieces, every number from the files alone; I3 every bar's most
possible the top of its column; I4 every piece's quality. On the phone and the computer: W1 the strip is pictures with no word
on the glass; W2 every bar's fill within a pixel; W3 pips, slabs and rounds; W4 the first six cells whole in one row; W5 nothing
moves when a second weapon is tapped (43 boxes and the strip within a pixel); C1 the weapon's card; B1 the shop's frames are
the pieces' qualities and agree with their names; B2 no box changed size; A1 the armourer's armour and shield; B3 the crew
screen's stash and gear; B4 the end of a fight's loot. M (--plant): a most possible halved, a frame that grows the box, a
quality turned round, a word put back on the strip, a pip short: each turns its leg red.

## What is not done (said plainly)
- THE FIGHT'S OWN WEAPON CARD (COMBAT's drawer in BOHEMIA_FIGHT.html, the kit's STAT_WORDS rows) is still rows of words and
  numbers. It is COMBAT's file; a NOTE on COMBAT's board carries the one call (BohemiaItemCard.card) that would lay it.
- ASK LINES 145 AND 146 ("stats everywhere as icons and bars", "icons not numbers everywhere") are bigger than this round: the
  five stat screens (10/26) and now every item card and box are pictures; the map, the town's other sheets, the phone, the end
  screen, the meet card and the job card were not counted this round.
- [an icon for every perk] (rule 252) is still claimed and not started.
- EYES has not seen any of it (rule 179): BUILT, NOT YET SEEN.

## Files
slices/bohemia_ui_three_items.js (new), slices/stat_icons/ (twelve new), tools/bohemia_ui_three_item_icons.py (new),
gates/the_item_card_and_the_item_box_gate.js (new); marked blocks in slices/BOHEMIA_SETTLEMENT_SCREEN.html
(__UI_THREE_ITEMS__ and one script tag), slices/BOHEMIA_ROSTER_SCREEN.html and slices/BOHEMIA_SPOILS_SCREEN.html (one script
tag each), slices/bohemia_ui_weapon_card.js (one marked line in show()). Nothing of UI 9's files touched
(bohemia_ui_no_scroll.js, bohemia_ui_crashbox.js); the loading menu untouched (rule 358).
Pictures: records/target/ui3_item_card_and_box_11_7/before_and_now.webp (the card's own). The two close-ups
(the_boxes_and_the_strip_up_close.webp, the_loot_now.webp) left the published site 11/14 for its 900 MB cap (rule 447(b)); they are in
git at 831744b7.

[bb Battle Brothers' item tooltip puts a small picture beside every number of a weapon; its stash is a grid of dark recessed
slots. Ours drops the words and lays each number on its bar to the game's own top.]
[analog horror: the box is a pawnshop's tray worn through to the tin, a cheap lamp over the one thing in it; the rust frame is
what a beat-up thing has been through.]
