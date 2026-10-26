# COMBAT 10/26: ICONS, NOT NUMBERS, IN THE FIGHT (rule 224 on the fight's screens)

## HIS WORDS
"this is a universal thing... I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red
arrow, and the only number that matters is by how much... universally across the board for all the UI"
(records/BOHEMIA_PAOLO_ICONS_NOT_NUMBERS_EVERYWHERE_AND_EVERYTHING_IN_THE_LAST_THREE_DAYS_10_26_26.md; rule 224(a) names the fight)

## BEFORE (the fight at 10bfd6a9, seed 3 on a strip, his pistol man with a car door, two rounds gone)
- His bar: '9/9 AP 0/74 FAT +30'. The AP twice (the pips and 9/9), the fatigue twice (its own bar said 0/74 as well), the wind
  back a pale '+30' with no picture. And the bar's numbers were stale between two men whose bars had the same widths: his fatigue
  bar said 0/74 on a man of 73 (UI's numbers repaint when a bar's style changes; the width did not).
- His card: 'Armour, head 30 / 30', 'Armour, body 30 / 30', 'Rounds left 3 / 5'.
- The weapon card: 'Reach 1 to 4 tiles', 'Rounds 5, then Reload 4 AP', 'Against armour 75%' and 'Straight through armour 45%' as
  bare text, the car door 'Melee / ranged defence +15 / +15'.
- The shot square's cover cut (230(c)) a text arrow of mine.
- Numerals counted (UI THREE's counter: a run of digits in shown text), phone and computer: his bar 16, his card 15, the weapon card 12.

## NOW (slices/BOHEMIA_FIGHT.html, UI's kit engine/bohemia_stats.js)
- HIS BAR: '9 AP' (the AP he spends said once; the pips its picture) and what comes back next turn as UI's mark: the lungs, a
  green up arrow and the amount (+15, +30 unspent). The fatigue figure lives on the fatigue bar only. Rule 224 is newer than 125(b)
  (Battle Brothers' numbers 'where he already looks for them'): the numbers stay, said once each.
- THE BAR'S NUMBERS ARE HIS MAN'S: each bar carries its man's numbers in its style, so UI's repaint fires on every change of man.
- HIS CARD: the armour, head and body, a bar each filled to what is left, the number once on it; the rounds left as rounds (a
  dozen and more said as a number).
- THE WEAPON CARD: the reach as tiles (a gun's point-blank dark, the rest lit); the magazine as rounds then RELOAD and its AP; the
  two armour numbers filled against the most any weapon in weapons.json carries (225 and 60), the number on the fill; the car
  door's two defences UI's marks (the icon, a green up arrow and how much).
- THE SHOT SQUARE: the cover cut is UI's red down arrow and the amount.
- The exact figure a hover away: every pip row carries it in its title.
- Kept, by 224(b): the counts he spends (AP, a skill's AP and fatigue), the round, the speed, the shot's chance, the damage range,
  a change's amount.

## THE GATE: ICONS, NOT NUMBERS, IN THE FIGHT (gates/icons_not_numbers_in_the_fight_gate.js, in the suite) 8/0
P1 his bar, phone and computer: '9 AP' then the lungs mark, up, '+30'; the fatigue bar says 0/73, his own. P2 his card: head 40 of 40
and body 50 of 50 as bars (fill 100%, the number once); rounds 3 lit of 5. P3 the weapon card: reach 4 tiles lit; rounds 5 of 5;
both armour fills right; the door +15 and +15 as marks, up. P4 FEWER NUMBERS: his bar 16 -> 13, his card 15 -> 11, the weapon card
12 -> 9, phone and computer. P5 nothing threw.

## A FREEZE FOUND ON THE WAY (the camera's glide)
Two runs of THE REBUILT FIGHT PLAYS hung for 50 minutes in a fast AUTO fight (the page sweep's landfill, the day-100 party), and
GEAR NEVER VANISHES ran out of time twice, each time with four browsers at once. A hang detector on a copy of the driver (the
debugger attached as the page opens) caught it: the page stuck in mkEllipse drawing a pop's ring 10^21 cells wide, the zoom at 10^20.
The cause, stepGlide: a glide asked later in the frame than the frame's own 'now' read its progress k below 0, and at a fast pace (a
glide of a few ms) the eased e ran far past 1 (k -4 gives e 32), so the zoom became the target's ratio to the 32nd power. Measured on
main's fight: a 2 ms glide stepped 8 ms early sent the zoom to 2.3e-10 of itself (toward a zoom-in it goes to 10^9 and up); 4 ms
early, 3.9e-3. Fixed with k never under 0: the same steps leave the zoom where it was; the day-100 fight and the ten-board sweep
at 60 times speed, four rounds back to back under load, never hung. At his own pace the old bug was a one-frame camera jump at
AUTO's fast finish, not a freeze; at a few ms a glide it froze the page. COMBAT TWO's camera ship (6585e7a4, the same round) landed
the same clamp (a glide asked later than the frame's 'now' starts at the frame's 'now', k never under 0) and a zoom eased in a
straight line of its reach; this ship keeps theirs and adds a glide never under 1 ms (a 0 ms glide read 0 over 0).

## THE AP LINE KEEPS ITS HEIGHT
The first mark was 14 px on a 9 px line: the AP line grew 12 -> 16 px, the bar 4 px, and on the wide screens THE REBUILT FIGHT
read TWO ROWS and the flipped phone's glass 64% (65 is the floor). The mark is 10 px now, centred in the line: the line 12 px, the
bar 135 px, as on main, phone on its side and computer (the gate's P1 holds the line at 12).

## THE OTHER GATES ON IT
THE SHIELD COVERS THE MAN BEHIND 6/0 (S4 reads the kit's arrow: '15%-28'), THE TURN ENDS ITSELF 8/0 (its 'numbers on the bar' leg
re-aimed: the AP once, the fatigue on its bar), FATIGUE COMES BACK EVERY TURN 8/0 (the '+N' is the mark's text), MELEE IS ONE TILE 9/0 (its reach leg reads the tiles' title), ONE TAP 16/0, THE PC PLAYTEST 27/0, THE LITTLE THINGS 7/0, BY HAND QUICKER 20/0, RETREAT AND THE ROUT 13/0, THE FIGHT'S BAR IS STUDIO MADE 15/0, STATS ARE BARS 29/5 (its five reds the shop's ON A MAN and a shop error, the same five on main's fight). On the tree merged with COMBAT TWO's camera (6585e7a4): THE FIGHT AS CLOSE AS IT CAN BE 51/0 (49/2 once under three gates at once, its two timing legs; 51/0 on main's fight and on mine at the same load), GEAR NEVER VANISHES 6/0, NOBODY ON ANYBODY 14/0, THE REBUILT FIGHT PLAYS 154/1 (main's fight 153/2 beside it: the night's edges, 41%, red on both).

## ROUTED
- UI: the fight's own lines use the kit now (mark, change); the bars' numbers were stale between men of the same widths (fixed from
  the fight's side, a style property per bar; your paint could read the man itself); the three bars' 'N/M' are yours under 224(b).
- EYES: his turn on the live link: '9 AP', the lungs and a green +30; hold a finger on his man: the armour bars and the rounds; hold
  it on the strike square: the reach as tiles, the rounds, the car door's two green arrows.
