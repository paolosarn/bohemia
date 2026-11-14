# FIGHT SCREEN: THE TEARDOWN OF THE CARDS (11/14/26) -- a record; nothing in the game is changed by it

VAMILY rules 449(b)(c) and 450(a); ask rows 616 and 621. PAOLO 11/14: 'The combat screen needs a whole reworking. It's been dog shit...
ugly as fuck.' And, asked which part he hates most: 'The card bro, the combat card is UGLY AS SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN
FINAL SHIT.' The coordinator's order: 'First the teardown: screenshots of the fight on a phone both ways, every piece on the glass named
and measured against the laws and the references. Then ONE rebuilt look.' This is the teardown. The rebuild is the next round's.

HOW IT WAS MEASURED: tools/bohemia_fight_screen_teardown.js, the demo (BUILD 11/14l) opened the way a stranger opens it, a phone upright
(390 x 844 points) and on its side (844 x 390), three moments read off the glass: A the card that opens a fight (the map's meet card),
B the bell (the fight's first seconds), C the man's card (a finger on his face). Every piece's box, type size, ink and ground were read
from the page itself: records/fight_screen_teardown_11_14/measured_upright.json and measured_sideways.json, six stills beside them.
0 page errors. Sizes are in points (the phone's own unit: a thumb needs 44).

## THE ANSWER IN ONE BREATH
There is no one card. There are FIVE different things that each act as 'the card', in FOUR different materials, and none of them shows a
face and a reason together. The one he looks at most (the man's card on the phone) prints its numbers at 5 points, which nobody can
read. The big one (his sheet) is a list of eight bare numbers on pale paper with no face, and sideways most of it is off the screen.
The card that opens the fight names the crew and draws its men (his own ruling, rule 224), but has no leader and no why.

## 1. THE FIVE THINGS THAT ACT AS 'THE CARD' (measured)
| # | piece | where it lives | size upright | size sideways | material |
|---|-------|----------------|--------------|---------------|----------|
| 1 | THE MEET CARD (opens a fight: ENGAGE / FALL BACK) | the map's frame, #meetcard (RUN's) | 306 wide: title 15 pt, lines 11 pt, men 306 x 84, buttons 148 x 44 | the same, centred | dark cardboard, a paper slip inside |
| 2 | THE WHY CARD (11/14k) | the fight's frame, #why (mine) | 374 x 63: face 52, name 10 pt, sentence 14 pt | 400 x 63 | dark glass, a red or gold edge |
| 3 | THE VETERAN'S CARD and THE CREW'S CALL | the fight's frame, #vet #call | about 300 x 60: face 44 / 34, 12 and 13 pt | the same | #vet PALE PAPER, #call dark glass |
| 4 | THE MAN'S CARD ON THE PHONE | the shell's phone, .fight (slices/bohemia_phone.js) | the whole fight page is 108 x 235: face 30, name 8 pt, three numbers 5 pt, status line 5 pt | 97 x 212: face 27, name 8 pt, numbers 5 pt | dark red phone glass |
| 5 | HIS SHEET (a finger on his face) | the fight's frame, #drawer | 373 x 374: title 11 pt, eight bars with a number each 13 pt, three lines 11 pt, perks 11 pt | 711 x 640 ON A 390 TALL SCREEN | PALE PAPER |
Also on the glass at the bell: the paper strip #say (205 x 30, 11 pt: 'Your line, before the fight.'), the bars over the men (drawn),
the chalk line, the white of a shot (#shotflash, 11/14l). The fight page's own top bar (the round and the turn order) and bottom bar
are NOT shown in the game: the phone carries the buttons.

## 2. WHAT IS WRONG, PIECE BY PIECE (each measured, each against its law)
THE MAN'S CARD ON THE PHONE (the one he sees every turn):
- THE NUMBERS ARE 5 POINTS TALL. '60/60', '79/79', '0/111' and the status line are set at 5 pt; his name at 8 pt; 'No skills on this
  man yet' at 7 pt. The same game's settings card holds 11 and 12 pt. A number nobody can read is decoration.
- THE STATUS LINE IS CUT. Upright: 'OUTCLASSES YOU · LV 5 · DODG' and then the edge of the phone. Rule 441(a): no screen that cuts words.
- EVERY SMALL BUTTON IS UNDER A THUMB. WAIT, RETREAT and AUTO are 25 x 27 points upright and 23 x 24 sideways; the speed button
  25 x 22; the two app buttons 54 x 28. FIGHT / END TURN is 102 x 28. The house rule is 44 (the settings card's own header says
  'every control 44 points'). RETREAT sits 1 point from WAIT and 0 from AUTO: the button that ends the fight is the easiest to hit by
  mistake. (It asks twice, which is why this has not cost him a fight.)
- THE WHOLE FIGHT PAGE IS 108 POINTS WIDE: 28 percent of the phone's width upright, 12 percent sideways. Twenty-five pieces live in it.
- It shows an ENEMY at the bell (MARKSMAN, 'OUTCLASSES YOU'), in the same card his own man will be in a second later, with no sign of
  whose card it is but a red edge on a 30 point face.
HIS SHEET (#drawer):
- SIDEWAYS IT DOES NOT FIT. 640 points tall on a 390 point screen, its top at minus 258: the title, all eight bars, the armour and
  the nerve are off the top of the glass; what he sees is the tail of the perk list. The veteran's card lies over what is left.
  Rule 441(a), and the ground rule that the game is played both ways.
- EIGHT BARE NUMBERS, NO WORDS: 60, 111, 60, 50, 15, 5, 50, 110, each beside a 20 point icon. UI THREE made every number a bar (rule
  275) and that part holds; but nothing on the sheet says which bar is which to a new player except the icon.
- NO FACE, NO BODY, NO WEAPON. The title is one line of red caps: 'MARKSMAN · LEVEL 1 · BOW'. The law is EVERYBODY HAS A FACE (8/27)
  and ONE ID, ONE WHOLE PERSON; the one place he reads a man has neither.
- 'A CARD THAT LISTS IS NOT A CARD THAT TELLS' (WORDS Q25, 9/15): five perk names with no word on what any of them does.
- PALE FLAT PAPER over the middle of the board: no light, no form, no edge (the law: all UI is built with light and form, 9/20), and
  it is the brightest thing on a dark screen (the analog horror law: thought about at the source, never a white sheet).
THE MEET CARD (the card that opens a fight; rule 450(a) names it: 'who is on him, how many, and the one WHY sentence from a face'):
- NO LEADER AND NO FACE. Four small men in a row (306 x 84), nobody in front, nobody named.
- THE COUNT IS THEIR MEN, DRAWN, AND THAT IS HIS RULING (rule 224, Paolo 10/26: 'tired of it just being numbers... more icons': no lone
  count, their number is their men drawn, his a tally). CORRECTED THE SAME ROUND: this line first called 'MEN · SOME' a word where a
  number belongs; that was this lane reading the card without its law. What is wrong is smaller: the men are 0.62 size in a row with
  nobody in front, so four men and seven read alike at a glance.
- NO WHY. The reason arrives only after ENGAGE, inside the fight (11/14k). So he decides to fight or fall back BEFORE he is told why
  they are on him. That is the wrong order: the why belongs on the card where he chooses.
- A LESSON CAN LIE ON ITS BUTTONS. On the upright still the map's own teaching card (DESI: 'Tap a building to go in...') lies over
  ENGAGE and half of FALL BACK. The buttons still take a finger; he cannot see them. FOUND, FOR FIXES 2 AND RUN (not this lane's card
  yet): records/fight_screen_teardown_11_14/A_meet_upright.webp.
- It opens from the middle of the screen, not from the crew he met and not from the phone's spot (rule 448).
THE SPEAKING CARDS:
- TWO LOOKS FOR ONE JOB. The veteran teaches on pale paper (#vet); the crew's commentary and the why line are dark glass (#call,
  #why). Three cards, one spot, two materials. The why line was built in the dark one on purpose (it would be rebuilt with the rest).
THE WHOLE GLASS:
- FOUR MATERIALS AT ONCE: dark cardboard (the meet card), dark red phone glass, pale paper (the sheet, the veteran, the strip), dark
  glass with a coloured edge (the call, the why). Rule 449(b): 'rebuilt as one look'.
- THE TURN ORDER IS NOT IN THE GAME. The fight page's own strip of faces lives in #top, and #top is hidden in the game; the phone
  shows 'R1' and one man. Nobody can see who moves next. (Battle Brothers: 'a turn order strip at the top with every face in order',
  reference/library/battle_brothers/10_UI_AND_FEEL.md.) Rule 449(b) lists the turn order among what is rebuilt.
- NOTHING SAYS THE FIGHT'S NUMBERS AT A GLANCE: how many of his stand, how many of theirs. The meet card had it and it is gone at the bell.

## 3. AGAINST THE WORLD'S BEST (what the library holds, and what it does not)
- BATTLE BROTHERS (reference/library/battle_brothers/10_UI_AND_FEEL.md; records/BOHEMIA_BB_SCHOOL_THE_INTERFACE_ROUND_THREE_THE_HUD_IN_
  CELLS_9_27_26.md): the fight HUD is 'the active man's skills as a row of icons with AP and fatigue cost; his bars; a turn order
  strip at the top with every face in order; a combat log; end turn / wait / retreat', and 'the HUD is a FRAME... almost nothing
  floats on top of the world. The one thing that does is the hover card, and that is summoned, not resident.' Its man's page is
  'portrait (painted, aged by injuries), background story, stats with stars, perks tree, equipment paper doll... A man's page is
  where the story lives.' OURS, MEASURED AGAINST IT: no turn order; the summoned card (the sheet) has no portrait, no equipment and
  no story; the resident card (the phone) is too small to read. Their before-the-fight is a painted event with a mouth; ours is four
  small men and the word SOME.
- ROGUE FABLE 4: THE LIBRARY HOLDS NO PAGE ON ITS SCREEN. records/BOHEMIA_RF4_TEARDOWN_SPEC.md and the RF4 dossiers measure its
  machines (the turn, the enemies, the consumables), never its HUD or its inspect card. Rule 450(a) says 'compared to the world's best
  before it is called done (Battle Brothers' and Rogue Fable 4's own cards, from the library)'. So THE FIRST STEP OF THE REBUILD IS A
  LIBRARY PAGE: Rogue Fable 4's fight screen and its inspect card, measured from its own stills with sources, filed under
  reference/library. Said plainly: this teardown does not have it, and nothing here is written from memory of that game.

## 4. THE ORDER OF THE REBUILD (the next round; rule 450(a): the opening card first, it carries the why line)
1. THE LIBRARY PAGE on Rogue Fable 4's screen and card (above). Small; it gates 'done', not the start.
2. THE OPENING CARD, FINISHED: one card where he chooses: their LEADER'S FACE, the crew's name, HOW MANY as their men drawn (rule 224,
   never a lone number), the ONE WHY SENTENCE from that face (the chooser and the table are built: slices/bohemia_fight_why.js can be asked before
   the fight as well as at the bell), the ground in one line, ENGAGE and FALL BACK at 44 points and never under another card; opening
   out of the crew he met (448(a)). The meet card is RUN's file: this needs a marked block there or RUN's word; the coordinator decides
   whose hands. At the bell the same face says the same sentence once more, small, and goes.
3. THE MAN'S CARD, FINISHED, in two sizes that are one design: the resident one (nothing under 11 points, nothing cut, every button a
   thumb, RETREAT away from WAIT and AUTO; if the phone's fight page cannot hold that at 108 points, it grows or the numbers leave it)
   and the summoned one (his face and body, his weapon with its damage, the eight bars each with its word, what each perk does in a
   line, fitted to 390 by 844 AND 844 by 390 with nothing off the glass).
4. THE TURN ORDER back on the glass in the game, as part of the same look.
5. ONE MATERIAL for all of it, built with light and form, dark first (the analog horror law), the same as the map's HUD.
Each piece: proven on the real page both ways, its VOTE card the before and the after side by side, the stills here as the before.

## 5. WHAT THIS RECORD IS NOT
It changes nothing in the game and judges no taste: every line is a measurement or a law it is held against. What the cards should
LOOK like is the rebuild's work and his thumb.

## ROUTED (proposals; the coordinator adds jobs)
- FIXES 2 / RUN: a lesson card lies over the meet card's ENGAGE (the still A_meet_upright.webp).
- THE COORDINATOR: the opening card is in RUN's file (the map's #meetcard) and the man's resident card is in UI's phone
  (slices/bohemia_phone.js .fight); rule 449 gave this lane 'what sits on the glass over the fight' and rule 450 'the card that opens a
  fight and the man's card'. Say whether this lane edits those two files in marked blocks, or their owners build to this lane's design.
- UI THREE: the eight bars and their icons on the sheet are yours and hold; the sheet around them is what gets rebuilt.

[bb Battle Brothers' fight HUD is a frame and its one floating card is summoned; ours floats five cards in four materials and frames nothing]
[analog horror: the brightest thing on the fight's glass is a blank sheet of paper with eight numbers on it]

*** 11/14, LATER THE SAME ROUND: HIS SHEET (piece 5) IS REBUILT, records/BOHEMIA_FIGHT_SCREEN_THE_MANS_SHEET_11_14_26.md. AND THE OPENING CARD'S
BLOCKER IS NAMED THERE: the men drawn on the meet card are the map's models and the men in the fight are dealt by the fight, so a leader's face
on the card would not be the man who stands in the fight (ONE ID, ONE WHOLE PERSON); the band's looks must be handed from the map to the fight
first, and that hand-over is COMBAT THREE's. ***

*FIGHT SCREEN, 11/14/26. A record; the stills and both measurement files are in records/fight_screen_teardown_11_14/.*
