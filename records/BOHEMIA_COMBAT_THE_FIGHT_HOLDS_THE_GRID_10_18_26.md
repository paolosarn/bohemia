# THE FIGHT HOLDS THE WHOLE GRID (COMBAT, 10/18/26, [the fight holds the grid], rule 117(e))

His words (10/18, records/BOHEMIA_PAOLO_WHAT_ARE_YOU_EVEN_TESTING_A_TUNING_NUMBER_IS_A_GRID_10_18_26.md): "how are you even
testing these fights... against animals, against different group sizes, when you got one person, three people, six people,
up to 14... I have a 12 man Lone Wolf squad, you can go up to 36 or 40 enemies... we don't even have all the equipment in the
game." The coordinator's line to COMBAT, opening this chat: "if the fight cannot yet hold 40 enemies or a beast, that is
yours to fix first." TUNING runs the grid (research only, rule 38g); this round makes every cell of it playable.

## MEASURED BEFORE ANY CHANGE (the live fight's rules, headless, AUTO both sides)

| | result |
|---|---|
| humans, your 1 / 3 / 6 / 12 / 14 against 3 / 9 / 20 / 40 brigands | 20 of 20 cells build, everyone on the board, nobody stacked, every fight ends |
| beasts, the same 20 cells | **20 of 20 CRASH on the first line**: a beast carries no gear and the fight builds a man around a weapon row (`enemyUnit` read `w.class` of null) |
| the 31 kinds the wiki makes immune to fatigue (ancient dead, zombies, golems) | **20 of 31 NEVER SWING** in a fight of six: no fatigue pool in the data, read as a pool of zero, so every swing "costs too much"; the plain wiederganger is one of them |

## WHAT CHANGED

1. **A BEAST'S WEAPON IS ITS BITE** (how Battle Brothers does it: a Direwolf has no gear, its weapon is the racial skill
   "Direwolf Bite does 30-50 Damage with 70% Armor Damage and 20% Direct Damage", 4 AP, 6 fatigue). New source tool
   `tools/bohemia_combat_beast_attacks.py` copies every racial attack page from the wiki archive in the repo into
   `records/target/bb/beast_attacks.json`, one weapon-shaped row a page (class `natural`, no hands), each citing its page.
   Each enemy takes the exact page its own wiki page links (the wiki has two "Bite" pages: the zombie's 15-35 and the
   kraken's 70-110). 34 attacks, 45 gearless enemies armed, 10 refused BY NAME (the Alp, the Hexe, the Kraken's body, the
   eggs: no skill that says it does damage). What a page says an attack also does (bleeding, stagger, three tiles at once)
   is copied as words and flagged `effects_not_built`; the fight builds none of it yet.
2. **THE FATIGUE-IMMUNE PAY NO FATIGUE.** `enemies.json` already lists `Fatigue` under `immune` for all 30 rows with no
   fatigue pool; the fight never read the list. Now it does (`tires(u)`): 20 silent kinds to 1 (the mortar, which the data
   gives no hitpoints).
3. **THE PACK.** `ours.enemy_tiers.mix.beasts` is FACTIONS' draft for the lab-made beasts (records/target/bb/factions.json):
   early four dire wolves to two hyenas, late three dire wolves, two frenzied, one schrat; the middle keeps the early pack
   until a source says when the frenzied join. TUNING owns every weight. A map hand-over of `{faction: 'beasts'}` now deals it.
4. **ON THE GLASS.** A beast wears ANIMATION's baked sheet (`slices/fight_beasts`, rules 42 and 69) at the people's scale
   (a dire wolf ~62 px at the ears where a man is ~100): idle, step, the lunge for the bite, the fall. `ours.beast_looks`
   says which sheet: the dire wolf is its own; **the hyena, the wolf and the war dog wear the dire wolf's sheet as a
   STAND-IN** until ANIMATION bakes each. The schrat, the unhold and the rest have no sheet: a stand-in man. The turn strip
   and the bar show the pen's wolf head in their red (a crop of the body is never a portrait, rule 115(h)). A finger held
   on a wolf shows its card: TEETH, Direwolf Bite, 30 to 50, 70% against armour, 20% straight through, 1 tile, "none, it
   bites", 4 AP, 6 fatigue (`weapon_lines.json` row `natural`, a draft for WORDS).
5. **THE OPEN SAYS WHOSE MOVE IT IS.** Wolves (initiative 150) move before his men; the open's line said "Tap inside the
   chalk to walk" under a wolf's turn. It now says "Their move. Tap the board to skip it." when they go first.
6. **ONE HEADLESS LOADER.** `tools/bohemia_fight_headless.js` plays the live fight's rules in node from the page's OWN data
   list (`DATA_FILES` and the `DB.x = a[i]` lines of `loadAll`), so a bench cannot fall behind the fight; `fill(ctx, script)`
   for a bench with its own context. TUNING's old bench had a hand-typed list and threw on every run after my last ship
   (0fcfd306 began reading WORLD's ground table); TUNING fixed its own the same way in 2f2bd75e, so its file is left as it is.
   TUNING's grid bench hands each beast an in-memory weapon row because the fight had no beast; that still plays (the fight
   takes a weapon from the gear first), and the real bite rows are now `beast_attacks.json`, the same pages it chose.

## AFTER (gate THE FIGHT HOLDS THE WHOLE GRID, 17/0; 4 red on the old fight; THE REBUILT FIGHT PLAYS 152/0)

120 cells x 2 seeds = 240 fights: your company 1, 3, 6, 12, 14 against 3, 9, 20, 40; brigands and the beast pack; early
(day 1, the place's kit), middle (day 30, MAIL armour, level 3), late (day 65, PLATE armour, level 6; CHARACTER's tiers,
records/target/bb/armor_tiers.json). Every fight builds, every man on an open tile, nobody on anybody, every fight ends, the
beasts bite in every beast cell (1,285 dire wolves, 496 hyenas, 248 frenzied, 131 schrats dealt). The longest fight on AUTO
is **6.7 minutes** (beasts, late, 12 against 40), under his 15 (9/29). The glass, 14 against 40 dire wolves on his phone's
profile: loads, all 54 on the board, every wolf his men can see drawn from the sheet (the fight's fog hides the rest, as
Battle Brothers'), both teams framed at the open, the pack bites, no page error. Table for TUNING:
`records/target/BOHEMIA_COMBAT_THE_WHOLE_GRID_HOLDS.json` (won / rounds / minutes per cell, DRAFT: THE GEAR IS NOT IN).

Frames: 54 on the board cost nothing over 21 (this box: 40.6 against 39.6 a second; at 4x throttle 7.2 against 7.1). The
throttled number is the box's software rasteriser (83% of the profile inside one canvas call), not the fight's code; it is
PLUMBER's speed row, said here so nobody reads the 40 as the cause.

## WHAT THE GRID SAYS THAT IS NOT MINE (routed, never tuned here)

- **TUNING**: the win column is grim and it is your grid's first read, not a difficulty: one man never beats three; fourteen
  never beat twenty at any gear stage; a level adds no stat in the fight (your own finding, the gains lever), so PLATE at
  level 6 barely moves a cell. Your grid bench can drop its in-memory beast rows for beast_attacks.json (its cells that
  were "not played" because the fight had no animal: the fight now has one).
- **ANIMATION**: a sheet for the hyena (the desert's pack hunter), the war dog, the schrat; until then the stand-ins above.
- **WORDS**: the TEETH line on the weapon card is a draft.
- **FACTIONS**: the beasts' middle phase is the early pack until a source names when the frenzied join.
- **On the glass, said plainly**: forty stand three deep on COMBAT TWO's 20 x 15 board (Battle Brothers: "1-2 lines deep for
  your forces, may be deeper for the enemy"), and a wolf is longer than a house tile, so the pack reads as one block.

## NOT BUILT (the honest list of cells that play but are not yet Battle Brothers)

Bleeding (the hyena), stagger, knockback, the schrat's three-in-a-row Uproot and the unhold's three-wide Sweep (they strike one
tile; [weapon shapes]), the schrat's Grow Shield, the wolf rider's once-a-turn bite, the beasts' pack AI (they fight as a
line), the beasts' fear of guns. Every one is listed on its row in `beast_attacks.json` as `effects_not_built`.
