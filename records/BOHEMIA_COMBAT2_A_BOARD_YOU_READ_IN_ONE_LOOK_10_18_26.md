# A BOARD YOU READ IN ONE LOOK (COMBAT TWO, 10/18/26, [a board you read in one look], rule 117)

A CANDIDATE (rule 100). Nothing to slices/, engine/ or the demo. VOTE `combat2-a-board-you-read-in-one-look-10-18`
(redo of `combat2-the-five-houses-on-the-board-10-18`), sheet `records/target/COMBAT2_A_BOARD_YOU_READ_IN_ONE_LOOK_10_18.webp`.
Tool `tools/bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26.py` (seeded, about 3.5 minutes). Manifest
`reference/art_bank/fight_board/COMBAT2_ONE_LOOK_10_18.json` (every count below, the cover in metres, the lights, the
terrain, 155 pack keys all UP). The small after-board is committed; the middle and large regenerate (.gitignore).

## WHY THIS ROUND
Rule 117, his words on TUNING's card: 'I want you to be easier than Battle Brothers... Nintendo simplified way kind of
vibes, like minimalist vibes... make the people feel that they're successfully doing it.' The row: the board shows only
what the next move needs; the three boards again with the clutter counted and cut; the five houses kept (his YES, the
fourteenth votes).

## HOW BATTLE BROTHERS DID IT (rule 41; recall, reference/library/battle_brothers/02_COMBAT_RULES.md)
Its board is generated from the map terrain where the fight happens, and every thing that stands on it is a rule: a
tree blocks the hex and the shot, a rock blocks the hex, a hill is height. The small dressing (grass, flowers,
pebbles) is painted into the ground at the ground's own brightness and never reads as a thing. At the start of a turn
the only lit marks are the active man's hex and, on hover, the path. Rogue Fable 4 (combat on the beat) goes further:
'most of the critical information presented in the world and on the field of battle itself'
(records/BOHEMIA_BB_STUDY_DAY_17_HOW_MUCH_DO_YOU_SHOW_8_28_26.md).
OURS, easier (117b): a standing thing is cover, an obstacle, a fence, a house or a light at a crossing, and nothing
else stands.

## WHAT THE TOOL DOES
It lays round two's three boards with round two's own code and random draws, records every piece the dress places
and every decal it stamps (the part of the dress that placed it is read from the dress's own comments), and lets a
piece stand only if it passes THE ONE-LOOK RULES. Nothing is drawn (rule 108): a piece is kept, cut, carried, or
swapped for another of his pack pieces. PROVED: the before board is round two pixel for pixel (the small board laid
again by round two's untouched path and compared array to array: True).

THE ONE-LOOK RULES
1. No words on the ground (the STOP signs, the KEEP OUT sign). His 10/1 list of what was wrong under the fighters
   named 'words on the board'.
2. A thing stands only if it is a rule (tufts, pallets, mail boxes have no fight fact).
3. One thing per spot, no specks: loose rocks, bushes and junk off the yards; one junk pile or dumpster marks a ROUGH
   back yard, two piles a vacant lot; one dead tree a lot.
4. A car where a car would be: in front of its own garage, under its carport, one wreck per stretch of street (none
   within two house tiles of another, none in or beside a crossing), one wreck per vacant lot.
5. Light only at the crossings: two lamps a crossing on its north-west and south-east corners (a lamp already within a
   house tile stays; else a cut one is carried there); one fire barrel a board with its scorch.
6. The loud lines quieted: cracks only along the kerb (DIRECTION 10/10: 'a real road cracks at the edges'); the
   barricade one material (his concrete jersey in place of the red-and-white striped).
7. Kept whole: every house, every wall and fence run along a street, the zebras, the centre lines, and each board's
   analog horror line.

## THE COUNT, AT THE START OF A TURN (before -> after)
The opening frame is the board whole on an upright phone, 1,170 device px wide: the fight's far stop, where both
teams are on one screen (rule 104a).

| | small 9x7 | middle 14x10 | large 20x15 |
|---|---|---|---|
| houses (kept) | 8 -> 8 | 15 -> 15 | 29 -> 29 |
| things standing | 276 -> 120 | 638 -> 287 | 1,320 -> 470 |
| of them with no fight fact | 67 -> 0 | 169 -> 0 | 376 -> 0 |
| LIT (lamps, fire barrels) | 7 -> 3 | 19 -> 9 | 39 -> 19 |
| LABELLED (words) | 3 -> 0 | 14 -> 0 | 26 -> 0 |
| LOUD (warning paint) | 2 -> 0 | 14 -> 12 (the ring, kept) | 2 -> 0 |
| OUTLINED: crack decals | 23 -> 5 | 67 -> 20 | 146 -> 39 |
| OUTLINED: chain-link pieces (kept, fence runs) | 31 | 46 | 157 |
| most things on one house tile | 13 -> 4 | 15 -> 12 (the ring) | 17 -> 5 |
| THE EYE'S COUNT at the opening frame | 135 -> 37 | 267 -> 81 | 534 -> 147 |
| of them specks (under 10 px) | 0 -> 0 | 0 -> 0 | 260 -> 35 |

THE EYE'S COUNT is an independent pixel instrument: the opening frame against the same board's ground with nothing
standing, both shrunk the same way; every joined blob of pixels that moved more than 24 levels is one thing the eye
counts. The ground's own texture cannot count (it is in both pictures). PROVED POINTED AT THE RIGHT THING: twelve of
his cars planted far apart on the small board's bare ground read 12 (the first version read 13, one car split in two;
parts within 2 px are now joined). The rings, the lit reach tiles, the picked-tile box and the aim line are COMBAT's
marks ([the marks on the board], claimed 10/18) and are not counted or touched here.

CUT BY RULE (large): rule 1, 26 signs; rule 2, 309 tufts, 31 pallets, 10 mail boxes; rule 3, 181 rocks, 108 junk,
86 trees, 19 bushes, 18 tyres, 12 dumpsters; rule 4, 30 cars; rule 5, 16 lamps and 4 fire barrels (12 lamps carried
to a crossing's corner). Every placed piece fell under a named rule (0 unnamed).

## WHAT HE WILL SEE
The yards are open ground with a house, its drive and at most one tree; the streets carry a few wrecks, two lamps at
every crossing and the concrete barricade; the back-yard walls and fences still line every street. On the large board
the analog horror line (one block's front yards with the same dead tree, evenly spaced) now reads at once, because
nothing else in a yard competes with it. The middle board's ring of barrels is the one tile that still holds twelve
things: it is that board's calm wrong thing, kept.

## WEAK, SAID
- At the large board's opening frame his 1x pieces (a junk pile, a dumpster, a jersey piece) are 8 px: 35 specks
  remain, all of them the rough markers and the barricade. The cure is the board fitting the party (rule 79: a large
  board only for a large fight), or the rig's props at their real size (rule 115), not more cutting.
- The fence runs still change material at every lot (chain link, block wall, scrap); a run of one material per block
  side would be quieter. Not cut: they are the cover lines.
- The asphalt cell itself (COOK TWO's) carries dense crack texture; only my decals were cut. COOK TWO's file, not mine.
- The scale question stands: the fight today draws a man 0.86 of a tile tall (MAN_OF_TILE), these boards stand him at
  the house's ruler (1.75 m on an 11.5 m tile). One reader change in COMBAT at his FINAL, as rounds one and two said.
- 2x props on 1x ground (MIXELS) wait on DIRECTION's style guide field 1.

## ANALOG HORROR LINE (rule 20)
Unchanged and now louder by subtraction: the clean police car (small and large), the ring of barrels (middle), the
same dead tree evenly spaced (large).

## GATES
REFERENCE CHECK 492/0. ART PIPE: the new tool counts 0 literal pixel writes. VOTE TAB: run on my card before push
(rule 22g); result in the handoff block. Full suite unmeasured (rule 13).
