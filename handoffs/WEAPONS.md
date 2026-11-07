WEAPONS (weapons-01gkdyuv, COOK's family; rule 424, ask lines 489 and 490, 11/7): BUILD 11/7k EVERY WEAPON SHOWS, SIX MORE ONE-HANDERS.
BUILT, NOT YET SEEN (rule 179). Record records/BOHEMIA_WEAPONS_EVERY_WEAPON_SHOWS_11_7_26.md.
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
- [more one-handers] SHIPPED: 84 one-handed rows and 22 different pictures in a fist BEFORE; 90 rows and 28 pictures NOW. Six
  real things a man finds in a dead Bohemia, each an armory row (records/target/bb/armory.json, round 3) and its own model:
  the tire iron (mace), the golf club (mace), the Bowie knife (sword), the pipe wrench (hammer), the tomahawk (axe), the slot
  machine handle (mace). Each on every smith's roll by price, carried by the enemies who carry its Battle Brothers row
  (carried_by), so it drops as loot; its own shelf picture (slices/market_icons/own_<row>.png) and bag icon.
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
NEXT: the map (above); then the 107 Battle Brothers rows still drawn as their class's picture, most carried first.
[bb Battle Brothers draws every weapon its own sprite in the man's hand on every screen; ours now does in the fight and on the crew card.]
[analog horror: a golf club off a course nobody waters, dead grass still in the grooves; a gift-shop sword off a castle that is not one.]
