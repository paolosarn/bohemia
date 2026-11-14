# FIGHT SCREEN: THE MAN'S SHEET (11/14/26) -- BUILD 11/14r - THE MAN'S SHEET

VAMILY rule 450(a), ask row 621 (rule 449: the fight's unit card is this lane's). PAOLO 11/14: 'The card bro, the combat card is UGLY AS
SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN FINAL SHIT.' The coordinator: 'think about what the card is FOR (what he must know in one second
to decide), cut everything else, then make it beautiful.' This is the first of the cards rebuilt: the sheet a finger on a man's face opens.

## WHAT WAS MEASURED BEFORE A LINE WAS CHANGED (the teardown, records/BOHEMIA_FIGHT_SCREEN_THE_TEARDOWN_OF_THE_CARDS_11_14_26.md)
A flat pale page, the brightest thing on a dark screen: no face, one line of red caps for a title, eight bare numbers beside eight icons
with no word, skill names with no word on what any of them does, a different material from everything else on the glass. On its side it
was 640 points tall on a 390 point screen: the title, every bar, the armour and the nerve were off the top of the glass.

## WHAT THE SHEET IS FOR, AND WHAT IS ON IT NOW (slices/BOHEMIA_FIGHT.html, __THE_MANS_SHEET__)
One glance answers four things and nothing else is on it:
1. WHO: his FACE, a photograph pinned on the board (a gold frame when he is his, red when he is theirs), his name, his level and trade.
   A man of theirs carries THE ONE THING TO KNOW about him (his kind's lesson from the act-one enemies' file, a boss's own, a champion's
   title): 'He stays behind his neighbors and yells them back into the fight. Kill him and the ones who run keep running.'
2. HOW HE IS: UI THREE's eight bars, untouched, each now with ITS WORD beside its icon (HITPOINTS, FATIGUE, RANGED SKILL, MELEE SKILL,
   RANGED DEFENCE, MELEE DEFENCE, RESOLVE, INITIATIVE), his armour, his nerve, his rounds, his wounds, on a receipt slip.
3. WHAT HE HITS WITH: his weapon's own name and its one plain line, in a well; its damage a lit bar, no digits.
4. WHAT HE CAN DO: every skill with its picture and name; A FINGER ON A SKILL READS WHAT IT DOES on the reading line and the sheet
   stays up; a finger anywhere else puts it away.
THE LOOK: the house's own rendered pieces (the kit in slices/bohemia_ui_materials.js: the dark board, the receipt, the well), the same
as the card that opens a fight and the settings card: dark first, light and form, nothing flat. Nothing under 11 points.
IT ALWAYS FITS: upright one column, on its side three (who and weapon, the bars, the skills). The room is measured from where the sheet
really stands (in the game the phone's layout lifts it clear of the phone) and the sheet tightens a step at a time until nothing is off
the glass: the bars go to two columns on its side, the face gets smaller, and at the last the skills become their pictures (the reading
line still reads each). It is redrawn only when something on it changed, so a finger meets the same piece twice.
FEWER NUMBERS (his rule 224(c), 'tired of numbers, more icons'): the first build added the weapon's damage as two numbers and each
skill's line (which carries numbers) and ICONS, NOT NUMBERS went red on it. So damage is a bar and a skill's line shows only under a
finger. The sheet now carries fewer numbers than before this ship.

## THE GATE: THE MAN'S SHEET (gates/the_mans_sheet_gate.js, registered) 7/0
The fight's own page, a phone upright and on its side, three men (his man with 3 skills, his man with 16, a man of theirs with a
lesson). M1 it fits (upright 374 x 557, 605 and 635 of 646; on its side 828 x 215, 217 and 219 of 233, the tightest surface there is).
M2 no type under 11 points, nothing cut, the ground dark. M3 a drawn face, name, level and trade; theirs carries his lesson. M4 eight
bars, each word clear of its bar, the numbers the man's own. M5 the weapon's name and line, its damage a lit bar with no digits, 14
numbers at most on the whole sheet. M6 every skill on it; a finger on a skill reads it and the sheet stays; a finger elsewhere puts it
away. Planted: the fitting taken out: on its side the sheet needs 356, 823 and 776 of 233 points and is off the glass.
NEIGHBOURS' GATES ON THIS DIFF: STATS ARE BARS AND ARROWS, IN HIS ORDER 38/0 (UI THREE's bars hold); ICONS, NOT NUMBERS, IN THE FIGHT
8/0 (it was 7/1 on the first build, see above); EVERY PANEL CLOSES 14/0. HUD OVERLAP 14/1: 'MISSING: phonebtn', a chip of the city
file this diff does not touch.

## ON THE PAGE HE PLAYS (rule 441(a); tools/bohemia_fight_screen_teardown.js, the same tool and moments as the teardown)
The real page opened the way a stranger opens it, a crew met through the map's own card, ENGAGE pressed with a finger, then a finger on
the man's face on the phone, then a finger on a skill.
RESULT, four surfaces, each inside the glass with nothing off it, no type under 11 points, a face, eight bars with words, a finger on a skill read and the sheet stayed: the demo upright 374 x 491 of 542 points of room (a MARKSMAN, 5 skills); the demo on its side 708 x 218 of 372 (a RAIDER, 17 skills, shown as pictures); the alpha upright 374 x 453 of 500 (a RAIDER, 17 skills); the alpha on its side 708 x 285 of 330 (a MARKSMAN, 5 skills). 0 page errors. The room is less than the screen because the phone's layout lifts the sheet clear of the phone.
BEFORE, the same tool, the same build line: upright a pale list 373 x 374 with no face; on its side 711 x 640 on a 390 point screen,
its top 258 points off the glass.

## WHAT IS NOT IN THIS SHIP, SAID PLAINLY
- THE MAN'S CARD ON THE PHONE (5 point numbers, a cut status line, buttons of 25 by 27 points) IS NOT REBUILT. It lives in the shell's
  phone (slices/bohemia_phone.js, UI's file); the seam to agree with UI THREE is below.
- THE CARD THAT OPENS A FIGHT IS NOT REBUILT, AND HERE IS ITS BLOCKER. A leader's face on that card must be the man who stands in the
  fight (ONE ID, ONE WHOLE PERSON). Today the men drawn on the meet card are the MAP's models (rigSetOf, mapPeopleOf) and the men in the
  fight are dealt by the fight from its own looks, by its own dice: they are different people. Only a boss's look is handed over
  (BohemiaBosses.dress -> opts.boss.look). So the opening card needs the band's LOOKS handed from the map to the fight first; the
  hand-over is COMBAT THREE's and the card is RUN's file. Until then the why sentence stays at the bell, on a face that is true.
- The head says his trade in the fight's word ('CROSSBOW', 'SWORD') and the well says the weapon's house name ('RIFLE', 'BLADE'):
  two words for one thing, older than this ship; for WORDS and COMBAT.
- A man with seventeen skills on a sideways phone shows them as pictures, read one at a time under a finger.
- The library still has no page on Rogue Fable 4's screen; the sheet is compared to Battle Brothers' man's page only
  (reference/library/battle_brothers/10_UI_AND_FEEL.md: 'portrait, stats, perks, equipment... a man's page is where the story lives').

## THE SEAM WITH UI THREE (rule 448; the coordinator: 'agree the seam in your handoff')
- YOURS, KEPT AS THEY ARE: the eight bars (__UI_THREE_STATS__, fightBars) and their icons; I stand them in my slip and add their
  word by css (the icon's own aria-label). Your gate holds 38/0.
- MINE: the sheet around them (#drawer.sheet), the speaking cards (#why #vet #call), the white of a shot.
- OPEN: the man's card on the phone is in your file and rule 450 names it mine. PROPOSAL: I hand you the design (nothing under 11
  points, nothing cut, every button a thumb, RETREAT away from WAIT and AUTO, the same board as the sheet) and you build it in your
  file, or the coordinator says I edit a marked block there. Either way the two cards must be one look.
- RULE 448: the sheet is summoned by a finger on HIS FACE, so it has its own thing to grow from (448(a)); it does not open from the
  phone's spot. It appears in one frame today; a grow-from-the-face is yours to add in the motion layer or mine on your word.

## ROUTED (proposals; the coordinator adds jobs)
- COMBAT THREE and RUN: the band's looks handed from the map to the fight (the opening card's blocker, above).
- WORDS: the reading line's two drafts ('Tap a skill to read what it does.') and the trade against the weapon's house name.
- EYES: UI.sheetFit on the fight's frame says the sheet's box, its room, its step and whether it fits.

[bb Battle Brothers' man's page is a portrait, stats, perks and a paper doll, and it is where the story lives; ours was a list of
numbers, and is now a face, eight words and what he can do]
[analog horror: an ID photograph pinned to a dark board, and under it one sentence on how to stop him]

*FIGHT SCREEN, 11/14/26.*
