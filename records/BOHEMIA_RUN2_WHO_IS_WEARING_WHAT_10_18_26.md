# WHO IS WEARING WHAT (RUN TWO, row [the crew screen reads the stash], 10/18/26, commit b47f391)

PAOLO, the twelfth vote on the map's bar (10/13): "still not a button for me to view my crew, equip them with items from my storage."
[equip from the stash] (55a49c3) built the half where an item moves: one door, the stash as the bag, drag onto a card.
This round is the half where he SEES it.

## WHAT HE SEES (the company screen, slices/BOHEMIA_ROSTER_SCREEN.html, through CREW in any place's bar)
- Under the two lines, WHO IS WEARING WHAT: every living man is one row. His face from his own sheet, his name, his level
  (or LAID UP n d), and his four slots, MAIN, OFF, BODY, HEAD, each FILLED with what he wears.
- A weapon shows the pack's own tile (slices/market_icons/, the tiles [the market in the pack's art] copied byte for byte);
  armour and shields show the materials' drawn icon, because the packs hold no armour (rule 101: placeholders, never faked).
- Tap a slot: the bag opens INSIDE his row (rule 19a, nothing pops up), cut to what fits that slot. The said line says
  how many fit. Tap one and they swap: he wears it, what he wore goes back in the bag, the bag's count does not change.
  TAKE OFF empties the slot into the bag. Tap the slot again and the picker closes.
- His card and the bag stay below the rows; the drag from the bag onto the card still works.

## HOW IT IS MEASURED (gates/the_crew_screen_reads_the_stash_gate.js, 21/0, his phone's profile 390x844 at 3x, real taps)
12 rows for 12 men, 4 slots each, every slot reads his gear (full where he has it, empty where he does not, the name on
it), every face drawn (4,096 painted pixels each), 12 of 12 worn weapons as pack tiles, the smallest slot 62x48 and no row
off the glass; the stash's rifle, hard hat and vest in the bag; DESI's HEAD slot offers only the hard hat (never the rifle
or the vest) plus TAKE OFF; he wears it, the hood goes back, the game is told {who, slot, item}; his MAIN slot offers only
the rifle; the rifle swaps for the bludgeon with the bag at 3 before and after; TAKE OFF empties the head; the company the
fight reads carries light_crossbow and a null head; the same rows open through the settlement's CREW door with the rifle
still in his hand. Registered in the suite as THE CREW SCREEN READS THE STASH.

## WHAT ELSE MOVED
- engine/bohemia_roster.js: a weapon item carries its Battle Brothers class (cls), one additive field, so the starting
  crew's guns show the tile the market's items already did. Loaded by script tag, not inlined: no slice rebuild.
- roster_screen_gate (14/0) and equip_from_the_stash_gate (7/0): their drags aimed at the bag below the glass once twelve
  rows sat above the card; they scroll the gear row into view first. The equip gate's shot goes through proofShot now.
- gates/vote_tab_gate.js: the 'newest thing is at the top' leg read rows[0] of an EMPTY front (his thirteenth votes
  consumed every red, 0 in front by design) and went red on the first untagged item after a sitting, while passing
  vacuously on an empty queue. It now reads the first row he sees, in front or first behind the fold.

## OWED
- UI [one screen]: CREW on the map's bar and the fight's bar is one line each, BohemiaCrewDoor.open({base:'slices/'}).
- A cook: armour and helmet tiles; until then body and head keep the drawn icon.
- VOTE run2-who-is-wearing-what-10-18, picture slices/vote/RUN2_WHO_IS_WEARING_WHAT_10_18.png.
