# THE SCREENS PAST THE PHONE (UI, 10/22/26, ui-the-days-once)

Row: UI [the screens past the phone] THE-TABLET-AND-THE-COMPUTER-ARE-NOT-A-STRETCHED-PHONE (rule 62's four screen classes;
UI 10/10, rule 74). Built into the game by media rule in the materials (rule 123: no card; he meets it on a tablet or a
computer).

## Measured before, on the screens' own files through the one driver

- THE COMPANY SCREEN on a tablet (820 x 1180): one column 2,068 points tall; the line and who wears what full width (each
  gear slot about 290 points wide); the man's page 931 points down and the bag 1,350 down, off the glass. A computer already
  had two columns (the screen's own laptop rule from 1,100 wide).
- THE SETTLEMENT'S SHEET on a computer (1440 x 900): the phone's drawer stretched to the glass. A stall's four price rows ran
  1,416 points across, the price at the far right end; the shelf and bag grids are six slots a row at a sixth of the width
  each, so a slot would be about 235 points square.

## How Battle Brothers did it

The company screen is the line (the formation grid) on one side and the selected man's page (paper doll, stats) with the
stash under it on the other, all on one screen. A town building is a window over the town: the building's picture and its
keeper on the left, the shop's grid and your stash on the right, slots of one fixed size.

## What changed (slices/bohemia_ui_materials.js)

- ROSTER_CSS, from 700 to 1,099 wide (a phone on its side, a tablet): #cols is two columns, the line and who wears what on
  the left, his page and the bag (five slots of 44 to 56 a row) on the right, held in view while the left scrolls. Above
  1,100 the screen's own laptop rule runs as before. Upright on a phone: unchanged.
- SETTLE_CSS, from 700 wide: the sheet is a window at most 1,040 wide, centred, still sliding up from the bottom; when the
  sheet has someone to talk to, he and his words are the left column (220 to 300) and everything else (the rows, the
  shelf, the bag) the right; slots 56 to 72; the close X gets its own 48-point gutter. Upright on a phone: unchanged.
- RUN TWO's two files are untouched (ONE SYSTEM, ONE SESSION).

## Measured after

- Company screen: tablet left 0..488, right 500..820 (his page at the top, 66); phone on its side left 0..512, right
  524..844; computer unchanged (168..808, 832..1272).
- The armourer's sheet: tablet 12..808, computer 200..1240 of 1440, phone on its side 12..832; the armourer left, the shelf
  and the bag right; every slot 72; the X over nothing.

## Proof

gates/the_screens_past_the_phone_gate.js, in the suite as THE SCREENS PAST THE PHONE: 36/0 on tablet, computer, phone on its
side and upright; two planted defects caught (the company screen back to one column, the sheet stretched to the glass).

## [bb interface]

Battle Brothers' company screen and town windows are laid for a monitor first; ours were laid for a phone first and now
re-lay at 700 wide into the same shape.

## Analog horror line

The armourer's window opens over the dead street like a pawn shop's grille: his face on one side, the wire shelf on the other.
