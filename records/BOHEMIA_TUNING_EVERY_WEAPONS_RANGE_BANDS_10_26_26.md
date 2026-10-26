# TUNING 10/26: EVERY WEAPON'S RANGE BANDS (rule 187, row [every weapon's range bands]; research only; also [the aim he sees], rule 120(b))

Paolo 10/25 (rule 187): "certain weapons will have their range accuracy; all weapons can shoot the tile next to them, depending on
the type: a rifle shooting one tile next to it might be a range debuff; a shotgun, the closer you are, after one or two tiles...
you'll have to do research on this." Nothing here is built; the bands are rows in the one table, section N, for COMBAT
([every weapon's range bands]: the weapon data, the tiles, the dial, AUTO and the calculator).
Bench: tools/bohemia_tuning_range_bands.js (each gun row at every distance on a flat open board, the fight's own hitChance,
resolveAttack and dice, 2,000 shots a cell; and every shot AUTO took in 60 rolled fights, by class and distance). Bank:
banks/BOHEMIA_TUNING_RANGE_BANDS_10_26_26.json. The cost on his crews: tools/bohemia_tuning_stupid_move_watch.js --shapes
his_bands,newcrew_bands,watch_bands (a research splice of the bands into an in-memory copy of the rules, never the game).

## 1. BATTLE BROTHERS FIRST (records/target/bb/rules.json, the wiki copy)
- A shot's chance falls in a STRAIGHT LINE with distance, by the skill: a bow's Quick Shot -4 a tile, its Aimed Shot -2 a tile
  with +10; a crossbow's Shoot Bolt -3 a tile with +15; the Handgonne -10 a tile with +10; thrown weapons -10 a tile with +30
  (the Throw Axe page: +20, -10 a tile past 2). The first tile is not counted for bows and crossbows (Combat Mechanics, Hit
  Chance pages). Higher ground: +1 tile of reach a level, +10 to hit from above, -10 a level from below; a blocked line -75 percent
  (Bullseye -50).
- THERE IS NO POINT-BLANK PENALTY AND NO DAMAGE BY DISTANCE ANYWHERE IN BATTLE BROTHERS: closer is always at least as good, and
  a hit does the same damage at every range. What Battle Brothers has instead is the floor: bows and crossbows cannot shoot the
  next tile, and the Handgonne "can not be used while engaged in melee" (its page) and shoots only at two tiles, its shrapnel a
  cone that "can hit 5 tiles behind the target".
- So Battle Brothers' own bands are one number a class (the per-tile line). His three asks (the rifle worse point-blank, the
  shotgun best inside one or two, the scope best far) have no Battle Brothers number: they are our twist on its line (rule 80,
  better than Battle Brothers), grounded in the real world below.

## 2. TODAY, MEASURED ON THE LIVE FIGHT (rules print 64d2fbf44e2e)
Our guns ride Battle Brothers' rows: the PISTOL is the dagger carried as the javelin row's shot (the thrown line: +20, -10 a tile
past 2, reach 1 to 4); the SHOTGUN is the Handgonne (+10, -10 a tile, reach 1 to 2); the RIFLE is the crossbow (+15, -3 a tile
past the first, reach 1 to 6). A level-2 shooter (ranged skill 50) on a flat open board by day, the shown chance and the dice's
(2,000 shots a cell; the three targets share one dice stream, so their deviations move together), and the hitpoints a shot takes:
| gun | target | 1 tile | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| pistol (dagger) | thug (defence 0) | 75 / 75.4, 25.0 hp | 75 / 74.4, 24.9 | 65 / 65.0, 21.6 | 55 / 57.8, 19.3 | out | out |
| pistol (dagger) | raider (defence 10, mail) | 65 / 65.3, 8.1 | 65 / 64.3, 8.2 | 55 / 55.3, 6.9 | 45 / 46.4, 5.8 | out | out |
| shotgun (handgonne) | thug | 65 / 65.3, 34.5 | 55 / 54.1, 29.1 | out | | | |
| shotgun (handgonne) | raider | 55 / 55.4, 5.8 | 45 / 43.3, 4.8 | out | | | |
| rifle (light crossbow) | thug | 70 / 70.5, 25.3 | 67 / 66.5, 24.3 | 64 / 65.2, 23.6 | 61 / 62.7, 22.5 | 58 / 56.9, 20.7 | 55 / 52.8, 19.1 |
| rifle (heavy crossbow) | thug | 70 / 70.5, 41.0 | 67 / 66.5, 39.3 | 64 / 65.2, 38.1 | 61 / 62.7, 36.6 | 58 / 56.9, 33.4 | 55 / 52.8, 30.9 |
(The hp a shot falls with distance only because fewer shots hit: a hit does the same at every range, Battle Brothers' rule.)
FINDINGS:
- [the aim he sees] HOLDS: the chance the tile shows and the chance the dice deliver agree within 3 points in every cell (the
  largest gaps, -2.4 at six tiles and +2.8 at four, are one shared dice stream about two standard errors out; resolveAttack hits
  when its roll of 1 to 100 is at or under the shown chance, so the two agree by construction).
- BESIDE BATTLE BROTHERS' BEGINNER AIM (the row's ask): every shown chance above already carries Battle Brothers' Beginner shift,
  +5 on his men's roll (ours.hit_roll_shift by_difficulty 5 / 5 / 0 / -5, rule 117(a): the door's default is Beginner): the level-2
  rifleman's 70 at the next tile is 50 skill - 0 defence + 15 (Shoot Bolt) + 5 (Beginner); on Battle Brothers' Veteran it reads 65,
  on Expert 60. The number on the tile is the Beginner number, and the dice deliver it.
- THE RIFLE IS AT ITS BEST POINT-BLANK TODAY (70 at the next tile, 55 at six): the opposite of his "a range debuff" one tile out.
  Battle Brothers' crossbow line does that: +15 with the first tile free.
- THE SHOTGUN is 65 at one and 55 at two: deadliest close only because of its 35 to 75 damage; nothing in it falls off with
  distance but the aim, and it never reaches three except from a roof.
- THE PISTOL is already "at home close": 75 at one and two, -10 a tile after.
- THERE IS NO SCOPED RIFLE ROW: the heavy crossbow is the light crossbow's line with more damage, best close like the rest.
- IN THE FIGHTS (60 rolled AUTO fights of the watch's crew shapes, 1,270 shots): rifles shoot from every distance (1: 15 percent,
  2: 28, 3: 13, 4: 11, 5: 12, 6: 15, 7 from roofs: 6), pistols mostly close (1: 28 percent, 2: 23, 3: 17, 4: 29), shotguns mostly
  at two (60 percent). In the fights the shown chance runs lower than on the flat board (cover, night, shields, defence): rifles
  65 at one tile, 34 at six; pistols 61 at one, 25 at four.

## 3. THE REAL WORLD AT OUR SCALE (a tile is a house)
- THE RULER: COMBAT TWO's middle board is 14 x 10 house tiles over 161 x 115 m, so a tile is about 11.5 m (12.6 yards). The
  pistol's four tiles are about 46 m, the shotgun's two about 23 m, the rifle's six about 69 m: all short for a rifle, long for a
  pistol, the edge for buckshot.
- THE PISTOL: police hit rates fall with distance: the RAND study of NYPD reports (1998 to 2006) about 37 percent of shots hit at
  seven yards or closer and 23 percent past seven (PolitiFact's summary); the New York Times (2006 data) 43 percent at zero to six
  feet. Relative to its close rate the pistol loses about a third by the second band; ours loses 27 percent from two tiles to four
  (75 -> 55). Battle Brothers' thrown line already matches the shape.
- THE SHOTGUN: buckshot from an open (cylinder) barrel spreads about 0.6 inch a yard in range tests (The Firearm Blog's
  myth-busting test: 0.35 to 0.96, the Remington cylinder bores 0.58 to 0.60), well under the old inch a yard; Ellifritz measured
  about seven inches at 50 feet. At one tile (12.6 yards) the pattern is about 8 inches, at two about 15, at three about 23: every
  pellet on an 18-inch torso to two tiles, about three in five at three, about a third at four. So the shotgun's DAMAGE is whole to
  two tiles and falls after; its reach of two stands, the fall-off only bites from a roof's extra tiles.
- THE RIFLE: at 11 to 69 m a rifle's accuracy does not fall in any way a game should show; what a long gun loses up close is
  HANDLING (a long barrel in a doorway, the man beside you inside its swing), the reason close-quarters doctrine picks short
  weapons. That is his "might be a range debuff" at the next tile, and it is small.
- THE SCOPE: magnification narrows the field of view; close-range shooters are steered to 1x to 4x because a low setting picks up
  a target faster and keeps the view wide, and a high one makes far shots easier (the optics guides found; Shooting Illustrated's
  'do-it-all optics': the ability to engage close threats is what a scope loses). So a scope is worse close and better far.

## 4. THE BANDS, PROPOSED (DRAFT, the one table section N; Battle Brothers' line first, his twist on top)
| class | the line (Battle Brothers') | close (his twist) | damage by distance | reach |
|---|---|---|---|---|
| pistol | +20, -10 a tile past 2 (as today) | none: at home at 1 and 2 | whole at every tile | 1 to 4 |
| shotgun | +10, -10 a tile (as today) | none: deadliest at 1 by its damage | whole to 2 tiles; x0.6 at 3, x0.35 at 4 (a roof's reach) | 1 to 2 (+1 a level up) |
| rifle | +15, -3 a tile past the first (as today) | -10 at the next tile (handling) | whole at every tile | 1 to 6 |
| scoped rifle (no row yet) | +15, -1 a tile past 2 (the magnification halves Battle Brothers' Aimed Shot's -2) | -20 at the next tile, -10 at two (the field of view) | whole at every tile | 1 to 8 |
With a level-2 shooter on a thug: the rifle 60 / 67 / 64 / 61 / 58 / 55 (best at two and three tiles), the scope 45 / 55 / 64 /
63 / 62 / 61 / 60 / 59 (it passes the plain rifle at four tiles and leads it by 6 at six), the pistol 75 / 75 / 65 / 55, the
shotgun 65 / 55 (and from a roof 45 x0.6, 35 x0.35).

## 5. WHAT THE BANDS COST HIS CREWS (measured, a research splice of the rifle's -10 and the shotgun's fall-off on both sides)
100 rolled AUTO fights a crew, the same fights as the watch's round one:
- his crew (a rifle, two spear-and-car-door men): won 58 -> 57, clean 28 -> 28
- A New Crew (two pistols, a rifle): won 75 -> 72, clean 39 -> 41
- the twelve (two rifles in twelve): won 81 -> 82, clean 21 -> 21
All inside the noise (about 5 in 100). The bands change where a rifle wants to stand, not whether he wins. None of the three crews
carries a shotgun, so its fall-off is not measured here (the first splice cut its damage at two tiles, the corrected one at three).

## 6. WHAT PROVES US WRONG
Battle Brothers never made a gun worse up close and never made a hit weaker far away; every band here except the pistol's is our
own. And today's rifle is best at the next tile, so the rule 187(a) sentence "a rifle debuffed point-blank" is false on the live
fight right now, while rule 185 lets it shoot there.

## ROUTED
- THE ONE TABLE, section N (records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md): band.pistol, band.shotgun, band.shotgun_damage,
  band.rifle, band.rifle_close, band.scope (a row waiting for a scope), and aim.shown_vs_done (the check this bench repeats).
- COMBAT [every weapon's range bands]: the hook is chanceWith's ranged line (ch = sk - df + base + per * ...) for the close
  penalty and hitDamage's base for the damage band, both by d = dist(a, t); the tiles and the dial show the band (187(c)); AUTO
  and the calculator read the same function (187(d)); the gate (187(e)): this bench's table re-run against the band rows.
- COMBAT's board: one NOTE with the hook and the numbers.

## SOURCES
- records/target/bb/rules.json hit_chance.ranged (bb_all/0424_Combat Mechanics.txt, bb_all/1002_Hit Chance.txt); parsed.handgonne
  (bb_all/0766_Fire Handgonne (5 fatigue).txt); bb_all/0935_Handgonne.txt (tilerange 2, "can not be used while engaged in melee")
- https://www.politifact.com/factchecks/2018/may/25/shannon-watts/do-more-7-10-police-bullets-miss-their-mark-gun-co (RAND: 37 percent at 7 yards or closer, 23 beyond)
- https://cbsnews.com/news/empire-state-building-shooting-sparks-questions-about-nypd-shot-accuracy (NYPD accuracy)
- https://www.thefirearmblog.com/blog/2014/07/04/myth-busting-1-per-yard-shotgun-pattern-spreads (0.35 to 0.96 inch a yard, cylinder 0.58 to 0.60)
- https://activeresponsetraining.net/?p=21245 (Ellifritz: about seven inches at 50 feet)
- https://www.shootingillustrated.com/articles/2010/10/5/do-it-all-optics (close threats and the riflescope)
