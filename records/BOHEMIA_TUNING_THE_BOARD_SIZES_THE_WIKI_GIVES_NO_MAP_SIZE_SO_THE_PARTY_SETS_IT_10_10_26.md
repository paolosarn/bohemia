# TUNING -- [the board sizes' numbers] THE WIKI GIVES NO MAP SIZE, SO THE PARTY SETS IT (10/10/26)
# Row: VAMILY TUNING [the board sizes' numbers], MODE RESEARCH. Rule 79. COMBAT [the board fits the party], COMBAT TWO [boards by size].

## 1. WHAT BATTLE BROTHERS SAYS (the wiki, bb_all/0424_Combat Mechanics.txt; rules.json deployment)
- NO WIDTH OR DEPTH IS GIVEN ANYWHERE. Checked: the combat page, the dev blogs, the stamped GROK_81 ("the wiki does not say how many hexes wide or deep a normal tactical map is"). So any "BB map is N by M" number is not citable. Mark it: NOT A WIKI NUMBER.
- What it DOES give, and the board must hold: at least 5 hexes between the two lines; your line 1-2 deep, theirs may be deeper; no melee can close in round 1 (a hex costs 2 AP minimum); a bow (7) or crossbow (6) is in range at the start; 12 a side max.
- Those four facts set a MINIMUM board. They do not set a maximum. The maximum is Paolo's ruling (rule 79): small unless an endgame battle or three parties at once.

## 2. WHAT THE DEMO DOES (BOHEMIA_FIGHT.html cropToParty, read, not changed)
- Width = 1 (room) + your depth + 5 (gap, read from rules.json) + their depth - 1 + 1 (room). So 8 wide with one row each side, 9 with a back row on one side, 10 with back rows on both.
- Height = longest line + 2 (one tile above and below), capped at the dealt board (15).
- Full board 20 x 15 only when opts.board, opts.endgame, or 3+ parties (ours.board_fit.big_parties = 3).
- Rows per side: 9 slots each (ours.formation). More than 9 men means a back row.
- NOTHING CHOOSES "small / middle / large" BY PARTY SIZE. COMBAT TWO cut three sized boards (small window 9x7, middle 14x10, large 20x15) and fight_ground.json carries them, but the fight's crop does not read them: the board is a formula cut from the dealt board. Two systems describe board size; only the formula runs.

## 3. THE TABLE (derived by the fight's own formula, front line = min(party, 9))
 party v party | width x height
   2 v 2  | 8 x 4      3 v 3  | 8 x 5      4 v 4  | 8 x 6
   6 v 6  | 8 x 8      8 v 8  | 8 x 10    10 v 10 | 10 x 11
  12 v 12 | 10 x 11   12 v 20 | 10 x 11   3+ parties | 20 x 15
(height here uses my simple longest-line read; the real crop also slides the window to where the lines can reach.)

## 4. THE FINDINGS
A. NO WIKI NUMBER EXISTS FOR MAP SIZE. The demo's small/middle/large numbers are OURS (Paolo rule 79 + COMBAT TWO), not a Battle Brothers measurement. They must be tagged draft in ours.json, not cited to a page.
B. A 2 v 2 FIGHT IS 8 x 4 = 32 TILES. A bow needs 7 clear tiles and the gap is 5, so the fight is shorter than a bow's reach: on that board the archer reaches the far line from turn one, which the wiki allows (bows are in range at start) but it means tiny fights have no approach at all. A floor of height 5 or 6 is worth a look; the wiki gives none.
C. THE MIDDLE SIZE IS NEVER USED. No party size in the formula lands near 14 x 10; widths stop at 8/9/10 then jump to 20. If "middle" is wanted, it needs a threshold row; I name one as a proposal: 5+ men a side or 2 parties = middle.
D. THE REACH BUG (previous round) bites hardest on the small board: a bow that fires only at exactly 7 tiles cannot fire at all on a 8-wide board (the lines are 6 apart).

## ROUTED
- COMBAT: B and C above; cropToParty could read the sized boards, or the sized boards could go.
- TUNING table: ours.board_fit gets two rows: min_height (proposed 6, draft) and middle_at (proposed 5 men or 2 parties, draft).
- Test material: the VOTE page is draft:true, a calculator using the fight's formula.
