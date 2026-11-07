# WEAPONS 11/7: EVERY WEAPON HAS ITS RANGE BANDS, ON THE TILES (VAMILY rule 187, ask line 108; the storeys' agreement with COMBAT TWO, rule 428(b))

The coordinator's dispatch (the routine 'WEAPONS: pistol size, then range bands', 11/7): "NEXT JOB, ask line 108: every weapon has
its RANGE BANDS (a rifle debuffed point-blank, a shotgun deadliest close and weak far, a pistol best short, a scope long), shown on
the tiles the way reach is lit (pistol 1, rifle 2, scope 3), numbers in TUNING's one table. COMBAT TWO is adding the height range
bonus for stories (rule 428(b)): agree in handoffs/ how the two add up and do not edit its board files. Gate with planted fails,
ship, VOTE card, handoff."
His words (rule 187, 10/25): "certain weapons will have their range accuracy; all weapons can shoot the tile next to them, depending
on the type: a rifle shooting one tile next to it might be a range debuff; a shotgun, the closer you are, after one or two tiles...
you'll have to do research on this."
(1) of the same dispatch, the pistol's size: DONE last round (BUILD 11/7q, gate EVERY WEAPON SHOWS R1 to R3, measured sizes in
handoffs/WEAPONS.md: the pistol 15.5 px against a forearm's 14.3, the snub 8.3, the zip gun 18).

## MEASURED BEFORE (main aecbd030)
- COMBAT shipped the mechanism 10/26 (34e0a072): ours.range_bands, read by the chance (chanceWith), the damage (hitDamage), AUTO's
  estimate (expected), the shotgun's step in, and the aim line ('Point-blank...', '...spreads'). Its numbers were its own seed,
  "OUR DEFAULT until TUNING's bands land": the rifle -15 at the next tile, the shotgun 0.7 of its damage at two.
- TUNING's research landed the same day (records/BOHEMIA_TUNING_EVERY_WEAPONS_RANGE_BANDS_10_26_26.md, the one table section N)
  and was never put in: the rifle -10 (handling), the shotgun whole to two tiles and 0.6 / 0.35 at three / four (a cylinder bore's
  pattern on a torso, a tile about 12 m), the scope -20 / -10 close and -1 a tile past two, reach 8. Section N said "nothing reads
  these yet".
- 3 of the 6 ranged families had a band (pistol, shotgun, rifle). The bow and the thrown things had none.
- THE SCOPED DEER RIFLE (ARMORY 11/2, a crossbow-class row) fought as a plain rifle: 6 tiles, -15 point-blank, at its best on the
  second tile, worse far. 'A scope long' was false.
- A BUG ON THE ROOFS: band() read damage_by_tile at exactly the distance, so a shotgun on a roof (+1 tile a storey) hit WHOLE at
  three and four tiles (the band listed only '2'). In 60 rolled AUTO fights 44 of his 112 shotgun shots were from three and four
  tiles.
- THE TILES SHOWED NO BAND. The gun's ground was one taped outline; the band was said only after aiming. The tape stopped at the
  row's reach while a roof's shot went a tile further, and a bow or a sling had no tape at all.
- The gate (COMBAT's) ran 6/1 on main: B4 red (his shotgunners fired from two tiles 38 times and from the next tile 29; COMBAT TWO
  logged it red before and after its own round). No planted fails.

## BATTLE BROTHERS FIRST (TUNING s1, the library)
A shot's chance falls in a straight line a tile by the skill (Quick Shot -4, Aimed Shot -2 with +10, Shoot Bolt -3 with +15, the
Handgonne -10 with +10, thrown -10 a tile past two); no point-blank penalty and no damage by distance anywhere; bows and crossbows
cannot shoot the next tile at all, the Handgonne cannot be used engaged in melee. Higher ground +1 tile a level, +10 from above,
-10 a level from below. So the line is Battle Brothers'; the close cuts and the spread are our twist on it (rule 80), grounded in
TUNING's real-world pages (NYPD hit rates by distance, buckshot patterns, scope field of view).
[bb Battle Brothers shows the hit chance on the man you point at and nothing on the ground; ours keeps that and paints the range card
on the tiles before he points.]

## WHAT IS BUILT
1. THE NUMBERS ARE THE ONE TABLE'S, LIVE (records/target/bb/ours.json range_bands; the one table section N's rows now say live):
   | band | the line (Battle Brothers') | the band | on a level-2 thug, 1 tile to its reach | best |
   |---|---|---|---|---|
   | pistol | thrown: +20, -10 a tile past 2 | none | 75 75 65 55 | 1 to 2 |
   | shotgun | Handgonne: +10, -10 a tile | damage whole to 2, x0.6 at 3, x0.35 at 4 and past | 65 55 (a roof: 75 65 55x0.6) | 1 |
   | rifle | Shoot Bolt: +15, -3 a tile past 1 | -10 at the next tile | 60 67 64 61 58 55 | 2 to 5 |
   | scope | its own: +10, -1 a tile past 2 | -20 at the next tile, -10 at two; reach 8 | 45 55 64 63 62 61 60 59 | 3 to 8 |
   | bow | Quick Shot | -10 at the next tile (draft) | 45 51 47 43 39 35 31 | 2 to 4 |
   | bottles (thrown) | thrown, from 2 tiles | none | 75 65 55 (slings to 6) | 2 |
   The table's scope row read '+15' while its own numbers (45 ... 59) are +10's: +10 is live, the row says so. The bow's -10 is
   new (band.bow_close, draft for TUNING): Battle Brothers lets no bow shoot the next tile; rule 185 lets every weapon, so the bow
   takes the rifle's handling cut for the same reason.
2. EVERY RANGED WEAPON HAS ITS BAND (slices/BOHEMIA_FIGHT.html rangeBandOf): a row's own band when it names one (weapons.json
   'band'), else its job's. The scoped deer rifle names 'scope' and reaches 8 (records/target/bb/armory.json tune.set, written by
   tools/bohemia_armory.py: only its row moved). shotLineOf is the one place a weapon's line is chosen (chanceWith reads it; the
   scope's own line comes from its band). A modder gives a new gun its band with one word on its row.
3. THE STEP (bandAt): past the last tile a band lists, its damage share holds; a roof's extra tile never makes buckshot whole again.
4. THE RANGE CARD ON THE GROUND (__THE_RANGE_CARD_ON_THE_GROUND__, FIGHT.bandCard): every ranged weapon's ground is taped (a bow's
   and a sling's too), every tile the rules' own inRange reaches (a roof's tile included). A ring where his shot is worth 10 points
   or more under his best ring (ours.range_bands_card.weak_at, draft), or that the band cuts, is HATCHED IN HIS OWN TAPE, the other
   diagonal from their rust (a ring of theirs over a weak ring of his reads as a cross), with a line where the sweet spot ends and a
   strip of tape on the ring toward the nearest man of theirs with the number written on it in ink ('-7', '-12', '60%'), never under
   a man. The clean ground is his sweet spot. A shooting range paints its yard lines; his crew tapes them.
   The words follow: 'Your rifle: 1 to 6 tiles, best at 2 to 5.' 'Your shotgun: 1 to 3 tiles from up here, best at 1.' The aim
   line: 'Point-blank: your rifle is clumsy this close, -10%.' / 'Too close for your rifle: -10% at 2 tiles.' (the scope) / 'At 3
   tiles the shotgun's shot spreads: 60% of its damage.' (draft:true, for WORDS)
5. A RULES FILE ONE DEPLOY BEHIND loses the card, never the board (try around the card; THE FIGHT ON THE LIVE PATH's BEHIND list now
   takes range_bands_card out too).

## THE STOREYS AND THE BANDS, AGREED WITH COMBAT TWO (rule 428(b); also in handoffs/WEAPONS.md)
- REACH: a shot reaches its row's range plus the storeys' tiles. The storeys' tiles live in ONE function, reachUp(a, t) (today
  Battle Brothers' +1 a level over the man's level); inRange and the range card both read it. 428(b) ('one story: no range; two:
  range; three: more') changes reachUp and nothing else, and the tape on the ground follows by itself.
- ACCURACY: the band's points and the storeys' points ADD on the chance (chanceWith: the line, the band, then above_per_storey or
  below_per_storey per storey); neither multiplies the other.
- DAMAGE: only the band moves damage; the storeys never do. The band reads the TRUE distance in tiles, so a shotgun two storeys up
  reaches four tiles and its fourth tile is x0.35: height buys the tile, the buckshot still spreads.
- DEFENCE ON A HOUSE TILE (428(b)'s 'more defence') is COMBAT TWO's alone; nothing of the bands reads it.
- Files: WEAPONS edits band(), bandAt, rangeBandOf, shotLineOf, bandCard, the card's drawing and ours.range_bands /
  range_bands_card; COMBAT TWO owns reachUp's numbers, the storeys' points and every board file. Nothing of COMBAT TWO's was edited.
- Gate EVERY WEAPON HAS ITS RANGE BANDS B3 holds the agreement: on 1, 2, 3 storeys a shotgun reaches 2 + reachUp, its share by the
  true distance, its chance the flat's plus exactly the storeys' points. When 428(b) moves reachUp, B3 reads the new reach.

## WHAT THE BANDS COST HIS CREWS (rolled AUTO fights, the gate's crews, 6 board kinds)
354 fights each: with the bands 200 won, with them zeroed 203 (a tie). The first 60 read 37 against 45, which looked like a cost; at
150 the variants (each band taken out alone) were 84 to 94 with the one that should have helped us (their bows' point-blank cut out)
winning MORE, the signature of noise. The bands change where a gun wants to stand, not whether he wins (TUNING measured the same on
its splice: 58 -> 57, 75 -> 72, 81 -> 82).
AUTO: its estimate of every shot is the chance times the band's share (400 shots weighed, all the band's); their bows fire
point-blank 10% -> 3% of their shots. His riflemen still fire from the next tile about one shot in nine with or without the band: a
man stood beside him has walked there, and stepping off costs the free swing.

## GATE: EVERY WEAPON HAS ITS RANGE BANDS (gates/every_weapon_has_its_range_bands_gate.js, rewritten; in the suite)
T1 the numbers are the one table's (parsed from section N) and the table says live; B1 every one of the 34 ranged rows (the pistols
as their shot) has its band, the scoped deer rifle the scope's at 8; B2 the chance is the line plus the band and the damage its share,
161 row and distance pairs; B3 the storeys add and never multiply; B4 the card marks weak exactly where the rules' chance is, the
rifle weak point-blank, the shotgun best beside him, the pistol best short, the scope best far; B5 hits land at the shown chance (9
buckets); B6 AUTO's estimate is the band's; B7 phone and computer: the rifle's next ring hatched in his tape with its strip (tape
pixels counted on the glass: 511 in the weak ring, 0 in the sweet), the aim says point-blank -10%, the scope says 1 to 8, best at 3
to 8. PLANTED: P1 the rifle's point-blank zeroed (T1 and B4 red), P2 the scope's band off its row (B1 red), P3 the step broken (B3
red: a 3-storey roof's fifth tile x1), P4 the page draws no hatch (B7's pixels red, 0).

## THE PROOF
tools/bohemia_weapons_range_bands_proof_11_7_26.js (the live fight file on his phone: the rifle, the scope, the pistol, the shotgun,
the bow, the shotgun on the board's roof) -> records/target/weapons_range_bands/proof/; tools/bohemia_weapons_range_bands_sheet.py
-> records/target/weapons_range_bands/sheet.webp (the VOTE card weapons-every-weapon-has-its-range-bands-11-7, STAND-IN).

## WEAK
- The bow's -10 and the card's -10 are drafts (TUNING's to move). The thrown things' band is the line alone.
- His riflemen still shoot point-blank when a man walks up to them; AUTO's walk keeps its old 'keep your distance' term for every gun
  but the shotgun.
- The label says what the ring loses beside his best ring ('-7' at the rifle's next tile), the aim line says the band's own cut
  (-10): both are true; a reader may ask why they differ.
- The dial (rule 187(c)'s 'and the dial') says the band in the aim line it shows; nothing on the dial's face itself.

## ROUTED
- TUNING: band.bow_close (draft) and range_bands_card.weak_at (draft) in section N, to confirm or move.
- COMBAT TWO: the agreement above (reachUp is the one place the storeys' reach lives).
- WORDS: the aim line's three band sentences and 'best at' (draft:true).

[analog horror: the range lines of a shooting club off Highway 95, taped on a parking lot nobody parks in: the numbers still in marker,
the yards crossed out and written again as houses.]
