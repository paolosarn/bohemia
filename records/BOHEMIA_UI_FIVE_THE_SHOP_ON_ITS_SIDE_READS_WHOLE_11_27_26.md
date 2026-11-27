# BOHEMIA -- THE SHOP ON ITS SIDE READS WHOLE (UI FIVE, 11/27/26, BUILD 11/27zza)

The coordinator's routine 'UI FIVE: the next screen' (rules 482, 495): the handoff's NEXT (no scrolling where it is banned, the fullest
hall's rows, the spoils screen owed), then the next screen he meets that is not clear yet, upright and sideways, never choppy, built the
rule 495 way (the fix where the cause lives).

## WHAT WAS RED, MEASURED ON MAIN 337d9b851

- SCROLLING IS ILLEGAL 35/2: N3 and N9 on its side, 'words under 11 px: span 9.0px "Buy it"' at the smith and the armourer, at every UI
  size. THE CAUSE IS THIS LANE'S OWN: __THE_NARROW_STRIP_S_BUTTONS__ (UI FIVE 11/22) set the buy buttons' words to 9 px when the shop's
  strip is a column of 300 px or less (a phone on its side: 172 px, two buttons of 83 x 44).
- THE FULLEST HALL (N8) and NO LINE CUT WHILE THERE IS GLASS: green (12/0). Row 634 was closed 11/18.
- WALKING EVERY PIECE ON ITS SIDE (91 to 93 pieces a town: the smith, the arms, the armourer) found two more cuts no gate read:
  - on every body armour and helmet (48 of 48 at one armourer) 'ARMOUR CLASS' kept its 92 px column and the value took three big lines
    in the 74 px left: 16 to 27 px under the man's box ('LIGHT to MEDIUM, WALKS' and the rest gone)
  - an armour's three numbers (its bar, fatigue, initiative) ran off the strip's right edge: '-40' read '-' (the item card's strip,
    slices/bohemia_ui_three_items.js, holds every card to one row with !important; right everywhere but this column)

## THE FIX, IN THE NARROW STRIP'S OWN RULE (slices/BOHEMIA_SETTLEMENT_SCREEN.html @container (max-width:300px), where the cause was)

- The buttons' words at 11 px (the floor), a pixel less gap and padding: two 11 px lines and the price fit the 44 px button. At 11 px
  'Buy it and' is 66 px and the density rule (#sheet.ns-d1 .act{padding:4px 10px!important}) left 63: the narrow rule's padding is now
  !important over it, inside this column only. 'Buy it and / wear it', 'to the / stash', whole.
- The class line: label and value as one sentence (display:block), two lines: 'ARMOUR CLASS LIGHT to / MEDIUM, WALKS FREE'.
- An armour's or a helmet's numbers (the facts box now says its kind, data-kind) take the box's spare third row (an armour has no ONE-
  or TWO-HANDED line above them; the box keeps its one height, so nothing moves from piece to piece).
- Under the class line 'ON YOU' folds away (his face's gold frame says it, as it already folded under a weapon's said line), and the
  armour's own stat lines with it (they were squeezed to a 2 px sliver, a speck under the class; each face carries its number).
- NOT YET: A SHIELD. Its five numbers need a row the box has not got, and its man's lines run under the box too (38 of 91 pieces at one
  armourer were shields, 5 to 6 cuts each, the same before this build). Its own layout, next.

Upright the strip is 370 px wide: none of this applies there, and 'Buy it and wear it' already reads whole on two 13 px lines (the old
NEXT item 'upright Buy it and ...' is done).

## CHECKED

- THE NARROW STRIP READS WHOLE (new, gates/the_narrow_strip_reads_whole_gate.js, in the suite): W1 the buy words at 11 px or more and
  whole (91 pieces), W2 no word cut on a weapon, a body armour or a helmet, W3 the shields reported, W4 nothing threw: 4/0; PLANTED the
  words at 9 px (W1 red, 34 words) and the class back in its column (W2 red, 7 pieces).
- SCROLLING IS ILLEGAL 37/0 both ways (was 35/2). NO LINE CUT WHILE THERE IS GLASS 12/0, NO LINE UNDER ANOTHER 3/0, ONE HAND OR TWO 25/0,
  THE ITEM CARD AND THE ITEM BOX 42/0, THE SHOP TAPS 9/0, THE PRICE AT A GLANCE 7/0, HEAVY ARMOUR COSTS A TILE 8/0 (one 7/1 run, its
  fight board's lit tiles, 8/0 again and 8/0 on main: a timing flake), WHAT YOU BUY GOES ON THE MAN 11/1 (C2 red on main too, 10/2 there).

VOTE ui5-the-shop-on-its-side-11-27 (STAND-IN, before and now, a body armour and a weapon).
[bb Battle Brothers' item tooltip: the armour's numbers in a column, every one whole, never cut by its frame]
[analog horror: a price tag typed on a label maker, letters you can read from arm's length]
