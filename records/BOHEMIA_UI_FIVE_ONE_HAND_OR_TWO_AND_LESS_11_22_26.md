# UI FIVE -- ONE HAND OR TWO, AND THE CARD SAYS LESS (11/22/26; VAMILY rule 477, ask row 718)

PAOLO 11/22: 'It's still not clear to me when I'm buying a weapon from the shop if it's two-handed or one-handed or not, I don't know
why you made that so difficult bro... when I'm buying a weapon there is so much useless information, for real'.

## MEASURED BEFORE (the demo upright, Caravans' smith, through the map's door)

- The weapon card (UI 8's #bwcard, the pop-up on a tap) said nothing about hands. Its title was the weapon's FAMILY ('SHOTGUN',
  'BLADE'), not the piece: rule 474's fix (11/22zj) had tagged the pack picture with the piece's id as data-id, and the card's own
  finder (slices/bohemia_ui_weapon_card.js weaponAt) stopped at the picture, so the name it read was nobody's. Fixed here: the tag is
  data-of, and the card reads the name from the slot round the picture.
- The card on the first tap: 38 to 79 words, 53 on average across the smith's nine weapons (bars for armour and through-armour, the
  blow's action pips, breath, weight, to-hit, the head, every move and its line).
- The strip under the shelf: TWO HANDS on a two-hander only, after the name; seven numbers (damage, armour, through, reach, pips,
  breath, weight); under the faces a row of five differences on the man.
- The crew screen: the line under him said 'TWO HANDS' last, after every number, and nothing on a one-hander.
- The loot: nothing about hands.

## NOW

- THE CARD (slices/bohemia_ui_weapon_card.js __ONE_HAND_OR_TWO__): the first tap shows the SHORT CARD. Its first line, a band he cannot
  miss: ONE-HANDED (an outlined band) or TWO-HANDED (a dark band, gold letters). Then the name and the price, HITS, REACHES (the crew
  screen's own words, '1 TO 2 TILES'), STAFF CAN or CANNOT CARRY IT (rule 471(b): staff take one-handed only). 15 to 18 words.
  EVERYTHING ELSE IS ONE TAP DEEPER: the card's own MORE button shows the long card (the band still first, every number, every move).
  Not a second tap on the piece: in the shop a second tap is the buy, on the crew screen it is the wear; MORE is heard by the window
  first and swallowed, so the shop never buys and the crew screen never wears on it.
- THE HAND RULE IS ONE RULE: the row's hands column first; a bow, a crossbow or a firearm with none takes both hands (the crew
  screen's engine/bohemia_roster.js handsOfRow, the town's the same). The card had its own looser copy that would have called a pistol
  two-handed; it now matches, checked across all 151 weapon rows (0 disagree).
- THE STRIP (slices/BOHEMIA_SETTLEMENT_SCREEN.html, slices/bohemia_ui_three_items.js strip): ONE-HANDED or TWO-HANDED first, then the
  name; only two numbers, how hard it hits and how far it reaches (the rest is the card's MORE). Where the strip is a narrow column (a
  phone on its side) the name sits on the line under the hand word, and the box holds that line for every piece so nothing moves (a
  container query, 300 px). The five differences on the man are the background for a weapon (the face's own arrow says the damage);
  what stops him or goes to the stash ('It takes both hands: his sedan car door goes to the stash.') shows whole.
- THE CREW SCREEN (slices/BOHEMIA_ROSTER_SCREEN.html numsText): the line under him says 'PISTOL ONE-HANDED. dmg 30-45. REACH 1 TO 4
  TILES...': the hands right after the name, never last. The card is the same short card.
- THE LOOT (slices/BOHEMIA_SPOILS_SCREEN.html facts): a weapon tapped says ONE-HANDED or TWO-HANDED in a small band before its name.

THE WORDS ON A WEAPON CARD, the first tap at the smith: BEFORE 53 on average (38 to 79), NOW 16 (15 to 18); the long card one tap deeper
45. All words draft:true. No dialogue line rewritten (rule 454(a)).

## PROOF (rule 441: the page he plays, the way he gets there, a phone upright and sideways)

GATE ONE HAND OR TWO (gates/one_hand_or_two_gate.js, new, in the suite): the demo and the alpha, upright and on its side: H1 every weapon
on the smith's shelf (nine, four two-handed) one tap, the band first and right, name, price, hits, reach, staff, 24 words at most, whole
on the glass; H2 the strip, the hand word before the name, the name whole, two numbers; H3 MORE, the long card, nothing bought, the
piece still lit; H4 the crew screen through the phone's CREW, the line and the card; H5 a road fight won, the loot; H6 nothing threw.
24/0. PLANTED (the demo upright): the old long card on the first tap, no band: H1 red, and it is the 'before' of the count.

CHECKS RE-AIMED TO THE RULE (each named in its file):
- THE ITEM CARD AND THE ITEM BOX: the strip's cells are two; the bars, pips and rounds are read on the long card after its MORE
  (a second tap on the piece would buy it). 42/0.
- A WEAPON TELLS YOU WHAT IT CAN DO: one tap is the short card with the band; the blows are read after MORE; MORE neither wears nor puts
  the comparison away. 7/0.
- A TWO-HANDER WEARS ITS OWN NAME T2: a one-hander now says ONE-HANDED; the check read a piece's hands from its NAME ('two-hand' in the
  label), which called the good fire axe (a two-handed axe) a one-hander: it now reads the piece's own hands. 8/0.
- THE UI MORPHS EVERYWHERE: the card's grow is unchanged (recorded frame by frame: the slot, then 0.90, 0.97, 0.996 of its size, an
  overshoot, home), but the shorter card (21% of the glass, was 31%) spends two of this box's 13 to 20 frames a second between its ends
  where the taller took three: a piece under a quarter of the glass needs two frames between. Its plant (the card popping on in one
  frame) still red. 17/2, the same two reds as main (E3 the fight's end, E6 frames a second on this box).
- EACH SLOT ITS OWN PICTURE: reads the picture's data-of; its double tap waits for the slot to hold still (the first buy missed now and
  then on a slow box while the sheet was still growing). 29/0.
GREEN WITH THIS BUILD: EVERY ITEM HAS AN ICON 10/0, STATS ARE BARS IN HIS ORDER 47/0, TWO HANDS 9/0, THE CREW SCREEN READS THE STASH
23/0, OPTIMIZE LOOT 22/0, THE BATTERY IS REAL 53/0, THE ROSTER SCREEN 15/0.
RED ON MAIN, NOT THIS BUILD'S (each the same count on main without this change): THE SHOP SAYS WHAT IT DOES W1 (worn, the crew
screen's defences null), THE TOWN'S PART 5 (on the red list), THE SETTLEMENT SCREEN 1 (on the red list), THE UI BELONGS TO THE WORLD
4 (on the red list).

VOTE ui5-one-hand-or-two-11-22 (STAND-IN): the smith, its dearest weapon tapped once: before (the files at 14ef314da) on the left, now
on the right. Made by tools/bohemia_ui_five_one_hand_or_two_card.js and .py.

[bb Battle Brothers: the item's slot says what it is at a glance, the long numbers live in the tooltip on hover; on a phone the tooltip
is a button on the card]
[analog horror: a pawn ticket with one line stamped in a box at the top, BOTH HANDS or ONE HAND, the clerk's carbon underneath if you
ask for it]

## FOLLOW-UP, BUILD 11/22zzb: THE STRIP WHOLE ON A PHONE ON ITS SIDE

MEASURED (the demo and the alpha on their side, the smith, a two-hander tapped; the same on main before 11/22zw, the files at 14ef314da
served for the picture): the strip is a column 171 px wide and its two buttons 80 px each: they read 'B | 113' and 'to the...'; the
line on what goes to the stash ('It takes both hands: his sedan car door goes to the stash.') needs three lines and the man box held two.
NOW (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_NARROW_STRIP_S_BUTTONS__, inside the strip's 300 px container query, so upright and the
computer are untouched): each button's words stand over its price, two lines at most, centred ('Buy it and / wear it', 'to the /
stash'); that line one size smaller; the man box one line taller for every piece, so nothing moves from one piece to the next. The sheet
still ends 36 px above the glass's bottom and scrolls by the same 1 px rounding it did before.
GATE ONE HAND OR TWO H2 now also reads the narrow strip's two buttons and that line whole: without this build red on the demo on its
side ('Buy it and wear it', 'to the stash', the line cut), with it 25/0 on all four.
LEFT, AND WHY: upright the buy button still reads 'Buy it and ...' (its words need 140 px of 101; older than 11/22zw). Letting them take
two lines upright made WHAT YOU BUY GOES ON THE MAN's B2 and K1 buy nothing, two runs of two, though a finger at the button's centre lands
on it in a probe; not shipped until that is understood.
A CHECK MADE TO WAIT AS HE DOES: WHAT YOU BUY GOES ON THE MAN K2 pressed the phone's CREW 300 ms after the shop's close, while the sheet
still folded away over the map; it missed 3 runs of 3 once the strip grew a line. It now waits for the sheet to be gone: K2 green. Its
C1 and C2 are the red list's (RUN TWO, 11/10), red on main the same.
THE SHOP TAPS 9/0, THE ITEM CARD AND THE ITEM BOX 42/0.
