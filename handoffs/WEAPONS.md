WEAPONS (weapons-01gkdyuv, COOK's family; rule 424, 426(c), 187; ask lines 489, 490, 494, 515, 108; 11/7): LATEST BUILD 11/7y EVERY WEAPON HAS ITS RANGE BANDS; before it BUILD 11/7q THE PISTOL A FOREARM LONG and BUILD 11/7l EVERY WEAPON SHOWS, SIX MORE ONE-HANDERS.
BUILT, NOT YET SEEN (rule 179). Records records/BOHEMIA_WEAPONS_EVERY_WEAPONS_RANGE_BANDS_11_7_26.md (this round) and records/BOHEMIA_WEAPONS_EVERY_WEAPON_SHOWS_11_7_26.md.
- [range bands] SHIPPED (ask line 108, rule 187; the coordinator's routine 'WEAPONS: pistol size, then range bands'):
  MEASURED BEFORE (main aecbd030): COMBAT's 10/26 mechanism ran on its own seed (the rifle -15, the shotgun 0.7 at two), never
  TUNING's one table; 3 of 6 ranged families had a band; the scoped deer rifle fought as a plain rifle (6 tiles, best second tile);
  a shotgun on a roof hit WHOLE at 3 and 4 tiles (band() read the exact tile); the tiles showed no band; the gate 6/1 (B4 red).
  NOW: ours.range_bands = TUNING's section N, live (pistol none, best 1-2; shotgun whole to 2, x0.6 at 3, x0.35 at 4 and past;
  rifle -10 point-blank, best 2-5; scope its own line +10/-1 a tile past 2, -20/-10 close, reach 8, best 3-8; bow -10 point-blank,
  draft; thrown none). rangeBandOf (a row's own 'band', else its job), bandAt (the damage share is a step: past the last tile listed
  it holds), shotLineOf (the one place a weapon's line is chosen), bandCard (the range card). THE RANGE CARD ON THE GROUND: every
  ranged weapon's ground taped by inRange (a roof's tile included, a bow's too), the weak rings hatched in his own tape the other
  diagonal from their rust, a strip on each with '-7' / '-12' / '60%'; the words 'best at 2 to 5', '1 to 3 tiles from up here'.
  The scoped deer rifle: armory.json tune.set band 'scope', range 8 (tools/bohemia_armory.py write moved only its row).
  COST: 354 rolled AUTO fights each, 200 won with the bands, 203 zeroed: a tie.
- THE STOREYS AND THE BANDS, AGREED FOR COMBAT TWO (rule 428(b); COMBAT TWO, read this before you touch the storeys' reach):
  (1) REACH = the row's range + reachUp(a, t). reachUp is the ONE function for the storeys' tiles (today Battle Brothers' +1 a level
  over the man's level); inRange and the range card both read it. 428(b)'s 'one story no range, two range, three more' changes
  reachUp and nothing else; the tape follows. (2) ACCURACY: the band's points and the storeys' points ADD on the chance; neither
  multiplies. (3) DAMAGE: only the band moves damage, by the TRUE distance in tiles (a shotgun two storeys up reaches 4 tiles and its
  4th is x0.35). (4) The defence on a house tile is yours alone; the bands read none of it. (5) WEAPONS edits band, bandAt,
  rangeBandOf, shotLineOf, bandCard, the card's drawing, ours.range_bands and range_bands_card; COMBAT TWO owns reachUp's numbers, the
  storeys' points and every board file (none touched). Gate EVERY WEAPON HAS ITS RANGE BANDS B3 holds it and reads reachUp, so your
  change to the reach turns nothing red unless the band stops reading the true distance.
- GATE: EVERY WEAPON HAS ITS RANGE BANDS (gates/every_weapon_has_its_range_bands_gate.js, rewritten from COMBAT's; in the suite):
  T1 the one table's numbers, B1 34 ranged rows banded, B2 161 row-distance pairs, B3 the storeys, B4 the card honest, B5 hits at
  the shown chance, B6 AUTO's estimate, B7 phone and computer pixels; PLANTED P1 to P4 (the rifle's point-blank zeroed, the scope's
  band off its row, the step broken, no hatch). 14/0 on main 35a96842 rebased (the page legs too). Also run: EVERY WEAPON SHOWS 15/0, HEIGHTS YOU CAN READ 4/0, DEMO BUILD 25/0; red the same on main (not this round's): THE FIGHT READS ONLY SOURCED NUMBERS 7/3 (COMBAT TWO's STREET_RING), THE HIT CHANCE LOOK H4-H9, THE FIGHT ON THE LIVE PATH (the first fight never opens; L7).
- TOOLS: tools/bohemia_weapons_range_bands_proof_11_7_26.js (the live fight on his phone, six frames) and
  tools/bohemia_weapons_range_bands_sheet.py (records/target/weapons_range_bands/sheet.webp, the VOTE card).
- FOR TUNING: band.bow_close and range_bands_card.weak_at are drafts in section N; the scope row's '+15' was +10's numbers (fixed).
- [weapons show] THE FIGHT AND THE CREW SCREEN DONE, THE MAP NOT YET (continuing, about 2 of 3).
  MEASURED BEFORE: of the 145 weapon rows the fight drew 12 from empty fists: the five two-handed swords (rhomphaia, warbrand,
  longsword, greatsword, executioner's sword), the three two-handed flails (two-handed wooden flail, two-handed flail, berserk
  chain), the four two-handed cleavers (two-handed saif, rusty warblade, crypt cleaver, two-handed scimitar). ROOT CAUSE: the fight
  finds a melee row's picture by row, else class (slices/rig_melee/rig_melee.json), and two_by_class named only hammer, axe, mace,
  polearm and spear; no two-handed blade, chain or cleaver picture existed. Every smith's shelf rolls from the whole list by price,
  so they were sold. THE CREW SCREEN drew a gun or nothing: every melee row, every bow, every shield missing on the card.
  FIXED: three two-handed family models, one a class (two_by_class sword -> the gift-shop claymore, flail -> the tow chain,
  cleaver -> the ditch blade), YOU's renders on layer t5; the crew card (slices/BOHEMIA_ROSTER_SCREEN.html __EVERY_WEAPON_SHOWS__)
  draws what the fight draws: the melee idle on the held sheet or his own keys, the thing from the fight's own sheets (his, his
  gang's, YOU's moved by the feet), the shield over or under by the facing, the bow.
  THE MAP (OWED, measured): his crew walks beside him from their own walk sheets (rig_mix, RIG_CAST), and no weapon is drawn in any
  map man's hands, for any row. It needs its own render: each family's thing in YOU's fist on the map walk's six keys and the map
  idle (the rig_march way, ANIMATION's towns tool pose), laid on every crew man by his feet. NEXT ROUND, first.
- [more one-handers] SHIPPED: 84 one-handed rows and 23 real one-handed objects in a fist BEFORE; 90 rows and 29 NOW (424(c) counts real objects only). Six
  real things a man finds in a dead Bohemia, each an armory row (records/target/bb/armory.json, round 3) and its own model:
  the tire iron (mace), the golf club (mace), the Bowie knife (sword), the pipe wrench (hammer), the tomahawk (axe), the slot
  machine handle (mace). Each on every smith's roll by price, carried by the enemies who carry its Battle Brothers row
  (carried_by), so it drops as loot; its own shelf picture (slices/market_icons/own_<row>.png) and bag icon.
- [no cheap route] (rule 424(c), ask line 515, added mid-round): the pipe (one-handed maces AND the five two-handed maces) and the
  sledge (two-handed hammers AND the one-handed picks and war hammer) were each one object at two sizes. FOLDED: the pipe one-handed
  only, the sledgehammer two-handed only (a two-handed mace is the sledge), a one-handed hammer or pick the framing hammer. Gate D5/D6.
- [the pistol] 'Too tiny' (rule 426(c), ask line 494): BUILD 11/7q THE PISTOL A FOREARM LONG. Measured: every melee thing and long gun
  already drew at about real size; the three handguns did not (the fist hides the grip): the pistol 10.4 px of its real 12.4 (a
  forearm 14.3), the snub 4.3 of 7.9. Built 1.35 over real about the grip and re-rendered in all four gun systems (COOK's golden
  and six guns tools, imported): the pistol 15.5 px now, the snub 8.3, the zip gun 18. Gate R1 to R3 (every weapon at real size,
  the pistol a forearm, planted). YOU rebuilt for the grid, hold and idle systems in 43 s; renders about 5 minutes.
- tools/bohemia_armory.py FIXED (a latent bug): a rerun put every own model back on its family prop (the crowbar drawn as the pipe
  again, all 15 of COOK's), took the rows off COOK's own items.json entries, and undid TUNING's prices and the armour's own looks.
  A rerun now only ADDS; what a later lane wrote is kept.
- GATE: EVERY WEAPON SHOWS (gates/every_weapon_shows_gate.js, in the suite): D the data, F the demo's road fight (every row and
  every shield DRAWN in his hands, the fight's own draw watched call by call, 3 of 8 facings, two looks), C the demo's crew screen,
  planted fails (the sword's two-handed picture out: the five swords red in all three; the tire iron's row out).
- TOOLS: tools/bohemia_weapons_every_weapon_shows_11_7_26.py (model, wire, render, pack, alone, icon-render, shelf, manifest:
  COOK's every-weapon tool imported, layers m6/s6/t5), tools/bohemia_weapons_every_weapon_shows_proof_11_7_26.js (the fight's frames,
  BEFORE and AFTER). Renders: bpy 4.2 in a python3.11 venv; YOU rebuilt in 35 s (COMBAT `bodies you`, the melee tool's `pose`, the
  Stand frame), 15 renders in about 12 minutes on four workers.
NEXT: the map's crew holding their weapons (424(a)'s last third, above), first; then the 107 Battle Brothers rows still drawn as their class's picture, most carried first.
[bb Battle Brothers draws every weapon its own sprite in the man's hand on every screen; ours now does in the fight and on the crew card. Battle Brothers shows the hit chance on the man you point at and nothing on the ground; ours paints the range card on the tiles before he points.]
[analog horror: a golf club off a course nobody waters, dead grass still in the grooves; a gift-shop sword off a castle that is not one; the range lines of a shooting club off Highway 95 taped on a lot nobody parks in, the yards crossed out and written again as houses.]
