# THE NEW GUNS PRICED (ECONOMY FOUR, 11/27/26; VAMILY rules 489(b), 478, 459; the handoff's job 3)

ECONOMY THREE's handoff, job 3: 'THE NEW GUNS' AND ROUNDS' PRICES (rule 489(b), ARMORY 3): every new gun, drone and round into the one
table (a where-row per file ARMORY 3 adds, bands from the research: real street prices in working days at four AA a day, as the
implants were priced); rounds stay scarce (rule 478).' Rule 489(b): '...the cheap first-person drone that carries a charge... its
rounds in the one price table'.

## 1. MEASURED FIRST

- EVERY NEW PIECE IS ALREADY IN THE ONE TABLE, by its catalog rule: ARMORY 3's sixteen pieces and six beat-up ones are rows of
  records/target/bb/weapons.json (written by tools/bohemia_armory.py as the mean of two Battle Brothers items, crowns at ten to one;
  battery_table.json catalogs). The table check reads 'every number is the table's'. No where-row was missing: ARMORY 3 added no
  file with a price of its own (armory.json is the spec, weapons.json the prices).
- A WRITTEN PRICE IS KEPT: the armory tool keeps a row's 'value' once written ('a price, once written, is TUNING's', LATER); a lane
  moves it in weapons.json with a note (value_by).
- THE ROUNDS: the stall sells six rounds for one AA, every calibre; a burst takes 3 a press, the belt-fed 6 a press and 100 a belt;
  a rocket refills from the crew's rounds at 30 (5 AA); a drone is never refilled (two strikes, then a new kit).

## 2. RESEARCH (records/target/bb/gun_street.json, each with its source)

The real price in median US working days (BLS, $1,214 a week, $243 a day, Q3 2025) at four AA a day, the implants' own conversion.
Bands from ARMORY 3's research (393 million guns, 32 million semi-automatic rifles; rule 489(a) 'what runs short is the ammunition'):
a common gun up to four times its real price (the collapse's premium, never scarcity), army kit up to eight (select-fire, belt-fed,
rockets, military optics were never a civilian buy), and the burned drone up to two (his word: cheap).

THE LADDER (here / real AA, times): Semi-Auto Shotgun 295/20 x14.9 HELD; Rocket Launcher 250/20 x12.7 HELD; Throwaway Rocket 188/25
x7.6; Guard Carbine 140/20 x7.1; Box SMG 68/12 x5.9; Thermal Hunting Rifle 260/53 x4.9; Double Shotgun 40/8 x4.9 HELD; Pipe SMG 19/5
x3.8; Ranch AR 45/13 x3.4; Kalash 48/15 x3.2; Printed Carbine 25/8 x3.0; Switched Pistol 29/12 x2.3; Belt-Fed SAW 175/82 x2.1;
Scout Drone 60/33 x1.8; Night-Sight AR 110/71 x1.6; Charge Drone 30/30 x1.0 (was 90, x3.0). Beat-up: 55% of the clean one.
THE ROUNDS: six for 1 AA against about $2.40 before (25 times: the scarcity rule 478 keeps); a rocket 5 AA against a PG-7V's $100 to
$300 (x1.5); a full belt 17 AA, more than a night of food for three, and more than a town's whole day of rounds (48).

## 3. MOVED, AND HELD

- MOVED: THE CHARGE DRONE, 90 -> 30 for the kit of two (weapons.json value 900 -> 300 crowns, value_by; armory.json tune.set the same
  so a fresh write agrees). His word in rule 489(b) is 'the cheap first-person drone'; ARMORY 3 had priced it 'like a good rifle'.
  Two FPV kits with charges at about $900 each is 30 at four AA a day; it now costs under the AR (45) and the AK (48), as the real
  ones do, and a strike is 15 instead of 45.
- HELD (named in gun_street.json held, the gate allows at most these three and only fewer): the Semi-Auto Shotgun and the Double
  Shotgun (the shotgun family sits at Battle Brothers' handgonne, its only firearm and an end-game piece; the smith's plain shotgun is
  388) and the Rocket Launcher (the handgonne's price made a rocket). REALISM FIRST says bring them down (a real semi-auto 12 gauge is
  about 20 AA); that moves every shotgun's place in the game, which is TUNING's research and his trade (realism against the fight's
  ladder), routed with the numbers.

## 4. THE GATE

gates/the_new_guns_priced_gate.js (in the suite), 7/0: G1 22 pieces each a real price and a game price; G2 each inside its band or
HELD by name (3); G3 the charge drone inside x2 and under the AR and the AK; G4 beat-up at 55% one AA either way; G5 a rocket's refill
x1.5 a real one; G6 the rounds x25, a belt over a night of food for three and over a town's day of rounds; G7 every number sourced.
ARMORY 3's own gates on this tree: THE GUNS GROW UP 23/0, WEAPON SHAPES 9/0. The table: every number is the table's.

## 5. ROUTED

- TUNING (research only, the felt numbers): the shotgun family and the rocket at the handgonne's price, x5 to x15 their real price;
  the numbers above are the research.
- ARMORY (the pieces): a new piece's price is the mean of its two Battle Brothers items; gun_street.json is where its real price goes,
  and the gate will ask for one (G1).
- THE VOTE CARD'S PICTURE is the ladder (no shop in nine towns stocked a charge drone on the walk; the shops roll their shelves). A
  shop's line selling the drone at 30 is the better picture when one is found.

[bb Battle Brothers prices a weapon by its tier in crowns; ours by its tier too, held to what the real thing cost in days of work.]
[analog horror: a price for a drone written on cardboard in marker, crossed out once, lower.]
