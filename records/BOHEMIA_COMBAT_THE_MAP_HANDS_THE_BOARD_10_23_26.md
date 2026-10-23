# COMBAT 10/23: THE MAP HANDS THE BOARD (row [the map hands the board], rule 46a)

## HIS WORDS (9/29)
"No two combat boards are the same."

## MEASURED FIRST (12 deals a ground, the fight's own deal, the district handed in)
- The desert (WORLD's open ground: 1.5% of its cells cover) and the mountain (95.8%, boulders) both dealt the same scrub boards at 30% cover.
- The airport, the industrial yards, the park and the solar fields (WORLD: 24.5%, 6.5-39.6%, 1.9-20.4%, 9-32.8%) all dealt the same ruin boards at 27%.
- The deal's dice were the clock's: the same place never dealt the same board twice, and nothing about the place reached the deal but a kind word.
- The map's door already stamps the cell's district and the cell itself on every fight it starts (BOHEMIA_CITY_WORLD.html, cityHandOver: msg.district, msg.at). The demo's nfOpts hands the fight only the kind (nfKind(district)) and the night.
- The demo's own kind map and WORLD's district list agree on all 78 districts.

## WHAT SHIPPED (the fight's half, slices/BOHEMIA_FIGHT.html)
1. THE DISTRICT NAMES THE GROUND AND THE KIND, in WORLD's list (records/target/BOHEMIA_BOARD_KINDS.json; rule 59, never a second list).
2. THE CELL SEEDS THE DEAL: the same cell on the same ground deals the same board every time it is fought; two grounds never deal the same board; the fight's own dice go back to their own seed after the deal, so the blows are the fight's, never the place's. The cell comes in any of the door's three shapes ({x, y}, a road's {gx, gy}, [x, y]).
3. THE GROUND'S OWN COVER: the share of covered tiles is fitted into the ground's measured envelope (records/target/BOHEMIA_GROUND_EFFECTS.json, what the district kits really draw): above it, whole tiles of cover come off in the dice's order (the field only opens); below it, the place's own pieces (those on the blocks of the kind it leads with: the mountain's boulders and outcrops, never the landfill's cars) go on open tiles, each where that piece sits inside its own tile. Cover pieces are their own sprites over the ground pictures, so the picture still tells the truth; COOK's pictures are untouched.
4. NOTHING HANDED, NOTHING CHANGED: a fight asked for by kind alone deals exactly as before. So the demo plays as it did until the door hands the district and the cell.

## THE NUMBERS (gate THE MAP HANDS THE BOARD 8/0)
- Cover against WORLD's envelope, one cell: the desert 1.3% (1.5), the mountain 96.0% (95.8), the strip 29.0% (1.2-55), the suburb 26.7% (26.5-45.2), the freeway 17.7% (14.5-17.9), the landfill 15.0% (15.0), the trailer park 29.7% (29.6); all thirteen inside (a point envelope within one tile, a tile is a third of a percent).
- 234 pairs of grounds on three cells: 0 the same board (was: the desert and the mountain identical, four grounds identical).
- One cell twice with different dice: the same board; five cells of one ground: five boards.
- The mountain: 202 boulders and outcrops added, none on a wall, the field one from line to line.
- Forty fights (twenty on the mountain, twenty on the desert, three thugs, AUTO): all forty ended; the mountain's take about four rounds, the desert's under three.

## THE DOOR (RUN's file, one line)
In slices/BOHEMIA_DEMO.html's nfOpts(d): `o.district = d && d.district; o.cell = d && d.at;`. With it, every fight the map starts deals the board of the cell he stood on. The gate reports the door's state on every run. The kind that leads does not change (the two maps agree on all 78 districts).

## [bb the battlefield]
Battle Brothers builds its battlefield from the world tile the fight starts on: forest fights in trees, swamp fights in water, hills fights on heights. Ours now does the same from the map cell's ground, with WORLD's measured cover.

## THE ANALOG HORROR LINE
The same corner of the valley deals the same ground every time, like a tape you rewind to the same frame: you learn the boulders, and so do they.

## NOT BUILT
- The door's two fields (RUN).
- The ground's other effects on a fight (height on the hills, water on the shore) beyond what the blocks already carry: WORLD marks height UNREAD for COMBAT [board generator].
