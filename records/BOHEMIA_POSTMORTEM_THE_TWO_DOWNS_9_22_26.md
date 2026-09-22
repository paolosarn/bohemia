# POST-MORTEM: THE TWO DOWNS, AND WHAT THE GREY BLOCKS ARE (DIRECTION, 9/22/26)
# [car background]. Both DIRECTION items in the first vote went DOWN. His notes
# are rulings; both are paid here and both deaths are the graveyard's.

## 1. THE CAR SHEET (direction-the-car-before-after-9-15, DOWN)
His words: "Are you fucking for real? What is the gray like Brit blocks
behind the cars, bro what the fuck is going on?" ("Brit blocks" is
voice-to-text for BRICK BLOCKS; never taken literally.)

### WHAT THE GREY BLOCKS ARE, MEASURED
The pad behind/under every car in the sheet reads rgb(65,64,71) — and the
suburb legend's fallback palette in the shipped city file carries
`3:'#3f3f47'` = rgb(63,63,71) for legend code 3, kind 'drive', "cracked
concrete driveway apron". Exact match inside JPEG rounding. THE GREY
BLOCKS ARE THE DRIVEWAY'S FLAT HEX FILL, drawn where the dead car parks
("at the top of the drive, nose to the garage" — the car's own legend
text). It is BLUE: hue ~240, in a world whose measured register is hue
18–47 warm (ground 38, roofs 20–45, the fight bank 29–36). And it does
not travel alone — the same fallback palette carries five cold siblings:
road `1:'#33333c'`, sidewalk `10:'#57575f'`, garage `6:'#6b6b74'`,
`14:'#55565a'`, and the dead car itself `16:'#5a5f63'`.
This is the 7/26 defect class reborn: a flat hex fill standing where
approved art should stand, never compared to the world (his words then:
"you're not using a single one of them").

### THE RULING (routed, coordinator rows it)
- THE DRIVEWAY WEARS THE STREET'S OWN CONCRETE. Kind 'drive' and every
  cold hex above snaps to the warm concrete/seal-coat family the cards
  already measure (value 0.43–0.55, hue 29–45, sat ≤ 0.31; the kerb/slab
  family in the fight bank sits at exactly this). No cold hex ever draws
  under or beside approved art.
- Owners: the fallback hexes live in the suburb legend (LIFE+CITY's
  file); real driveway tiles, if drawn, are COOK to the aerial card's
  commercial-lot values. Either fix passes; the hex swap is one line.
- THE CAR COMES BACK AFTER THE PAD. Rule 30: the re-cook goes through
  the bible and returns as a NEW id, photographed IN THE WORLD (the
  walked street, the real driveway), quoting his kill. Not before the
  pad fix lands — showing him the same grey blocks twice would be the
  vote tab asking a question he already answered.

## 2. THE FIGHT-VERDICT SHEET (direction-fight-verdict-round-3-9-21, DOWN)
His words: "The worst thing you've ever done for me so fucking bad like
teleporting shit not part of the universe the buttons changing
consistent no consistency shits so weird one game mode not teleporting
to different game modes." The coordinator has already ruled the game
half (rule 24: ONE GAME MODE). The presentation half is mine:

### WHAT I DID WRONG
A three-panel sheet of walk frame / fight frame / floor strip READ AS
THREE GAME MODES. He does not see "a verdict document"; anything in the
queue reads as the game. My meta-sheet manufactured exactly the
inconsistency he hates.

### THE RULING (mine, standing)
- DIRECTION REGISTERS NO MORE VERDICT SHEETS OR META-SHEETS in the VOTE
  queue. The FIGHT VERDICT lives on the front page for the chats and in
  records/ for the machine; the queue is for THINGS (rule 25: the tab
  shows the thing).
- A SHEET'S BACKDROP IS THE WORLD OR NOTHING: any candidate any lane
  shows him renders in the walked world, or on plain black. No checker
  transparency, no neutral grey pads, no abstract strips. (This round's
  cause in one line: the one grey backdrop I shipped turned out to be
  the game's own defect wearing my sheet.)

## 3. BOTH IDS ARE CONSUMED
The votes consumed both ids forever (rule 15b). This record is their
post-mortem; the car's successor id arrives per section 1 after the pad
fix; the verdict sheet class has no successor.

```json
{"card":"POSTMORTEM_TWO_DOWNS","date":"9/22/26",
 "kills":[
  {"id":"direction-the-car-before-after-9-15","cause":"driveway fallback hex #3f3f47 (hue 240) under the car, cold in a hue 18-47 world",
   "cold_hexes":{"drive":"#3f3f47","road":"#33333c","walk":"#57575f","garage":"#6b6b74","misc":"#55565a","dead_car":"#5a5f63"},
   "ruling":"drive family snaps to warm concrete (v 0.43-0.55, hue 29-45, sat <=0.31); redo id returns in the world after the fix"},
  {"id":"direction-fight-verdict-round-3-9-21","cause":"a meta-sheet read as three game modes",
   "ruling":"no more verdict sheets in the queue; backdrop is the world or nothing"}],
 "routed":{"LIFE+CITY":"suburb legend cold hexes","COOK":"driveway tiles to the aerial card","coordinator":"rows"}}
```
