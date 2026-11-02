# ROBOT [the robots fight] — 11/2/26 (ask row 277, VAMILY rules 301 and 115(d))

Paolo 11/2: "One of the first things I was impressed by, graphic wise, art asset wise, was that robot you made that was that
Bohemian style, I was like oh my God that's perfect... you don't even have those robots, you have characters with gray skin
instead of that robot... you made a robot and you didn't even implement it, where did that robot go." And: "always remember
this economic apocalypse HBO Crashbox vibe."

## What stood in for it (measured before the change)
- THE MECHANIC's machines (Battle Brothers' `wiederganger` and `armored_wiederganger`, ours.bestiary.mechanic.machines, named
  MACHINE / PLATED MACHINE) wore the homeless, caravan, reds, volunteers, blues and remnants men's sheets
  (ours.people_looks.band.wiederganger / armored_wiederganger), and the fight's `chipBlit` washed them grey and green
  (`chipSheet`: saturation 0.8 grey, then a 0.22 green-grey over). Those were the grey-skinned men he saw.
- The robot he loved is DIRECTION's master-rig robot: `reference/models/quaternius/RobotExpressive.glb` through
  `tools/bohemia_direction_master_rig.py` (records/target/master_rig/DIRECTION_THE_MASTER_RIG_ROBOT.png; rounds five and six,
  the style guide). It was never in the game.

## What shipped
1. **The sheet** (`tools/bohemia_robot_the_robots_fight.py render|pack`): the same model through DIRECTION's master rig with
   the fight's own in-memory changes (COMBAT's `render()`: movers' light off, persistent data, samples 24, dents off) plus two:
   a fight clip may name the robot's own clip and its drawn keys as shares of it, and the camera's square is 1 m wider (the
   robot's own Death throws it back 2.78 m and its head pops off and rolls; the square was 2.42 m half-wide). Every key is a
   frame of the robot's own animation, nothing posed by hand, the model never re-exported:
   - stand: the passing pose of its Idle (DIRECTION round six's still); idle: 12 keys of Idle (3 a beat, the men's grid)
   - walk: 6 keys of Walking; swing: Punch at 0.15 / 0.35 / 0.65 (wind-up, the blow, follow-through)
   - hit: Death at 0.10 / 0.03 (rocked onto its heels, then back); fall: Death at 0.20 / 0.38 / 1.0 (over, down, in pieces)
   - eight facings, the fight's order, the one-pixel day rim, 64 colours, lossless: `slices/fight_rig/robot.webp`
     (27 x 8 cells of 335 x 253, 727 KB); the demo's cut packs it (`slices/fight_rig/packed/robot.webp`, 2048 x 1311).
   - its face: DIRECTION's portrait of the same head (rig_portrait_S.png) on the fight's face sheet (ONE ID, ONE WHOLE PERSON).
   - size: 1.72 m tall (DIRECTION's in every round), 57 px a metre, the man's ruler. It draws 120 to 140 px tall against a
     man's 106 to 111 on both the fight's and the map's sheets because its body is 1.39 m wide and 1.16 m deep: the 45 degree
     camera sees the top of its dome. Its true size beside a man, nothing scaled after the render.
2. **The enemy type** (records/target/bb/ours.json): `bestiary.look_pools` wiederganger / armored_wiederganger -> `robot`;
   `people_looks.band.robot = ["robot"]`; names ROBOT / PLATED ROBOT (draft words); and **its own stats row** `ours.robot`
   (rows.wiederganger, rows.armored_wiederganger: hp 100 / 130, initiative 45, melee 45 / 50, defence -5, AP 6, armour
   0-50 / 2-30 and 20-140 / 27-115, fatigue and resolve null: it never tires and never breaks). The numbers are Battle
   Brothers' (the lesson kept whole); the fight lays the row over the wiki's row (`robotRow` in enemyUnit), so TUNING or a
   modder changes the robot there and nowhere else. The meet card's word for the crew is ROBOT / ROBOTS (job_danger).
3. **The fight** (slices/BOHEMIA_FIGHT.html, only where a unit's stats and sheet are picked): `robotRow`; and in `chipBlit` a
   robot is drawn in its own rust and paint (no grey wash) and, standing, plays its 12 idle keys. The mechanic's diode, the
   reboot's band glitch, the oil, the raise and the unplug when the last mechanic falls are unchanged.
4. **The map** (slices/BOHEMIA_CITY_WORLD.html, `__THE_ROBOTS_ON_THE_MAP__`): a party whose roll came back as the machines
   (`cityHandOver` writes the fight's own roll into `MAP_PARTY_CREW`) is drawn as the MECHANIC (a man of its gang, behind)
   and his robot (in front), cut from the packed atlas into the map's person frame the way `rigSheetSet` cuts a man (112 wide,
   feet at 93 in 100; the whole sheet only if the pack is stale, by its bytes, as the fight checks).

## Proof (tools/bohemia_robot_the_robots_fight_proof.js; records/target/ROBOT_THE_ROBOTS_FIGHT_*.png, _PROOF.json)
- FIGHT, phone profile (390 x 844 at 3x), the page every door of the demo opens, party faction 'machines', 5, day 40: the
  board dealt MECHANIC + 3 ROBOTs, each on robot.webp (kind robot), 100 hp, the `ours.robot` row read. 3,015 robot draws:
  idle 1,920, walk 37, swing 50, hit 159, fall 849. Won in 6 rounds, 3 robots down. HUD portrait: ROBOT, its own face.
- MAP, the demo at the phone profile: 4 robot parties drawn from the packed atlas (packed: true). TEST SETUP, stated: no party
  is in his sight at the opening (two stand at his own town, the rest off the glass, measured four ways), so for the picture
  every party's roll is set to the machines and the fog and sight lines are lifted; where the parties stand and how they are
  drawn is the map's own. CARD: records/target/ROBOT_THE_ROBOTS_FIGHT_CARD.png.

## Next round (not done this round)
- **The map knows the crew only from the meet.** A roaming party is handed as brigands and the road's faction is rolled at the
  meet (ours.road_factions, `roadOpts`), so before contact a robot crew walks as gang men. Battle Brothers shows what a party
  is before you engage: WORLD should roll the road's faction when the party is made and hand it to the meet.
- **Grey and stand-in bodies left** (do not repaint people this round; listed for the next):
  - `geist` (the DEAD ONE, ghosts faction and the graveyard): no art of its own; a man from the `default` pool under the
    fight's cold GHOST_WASH (`ghostBlit`).
  - `schrat` (Battle Brothers' tree beast): no art and no pool; it stands in the `default` pool's men (remnants, network,
    volunteers), unwashed.
  - `orc_young` (BRUISER): the mob and cartel gang men; no Bruiser body of its own (the HEAVY has one).
  - The PLATED ROBOT is the same robot as the ROBOT (no plates of its own yet).
- The robot sheet is 3x a man's in bytes (727 KB; the fall's 2.8 m needs a big cell). The packed atlas holds it to 10.7 MB
  decoded; a per-clip box would cut the bytes.

REUSE CHECK: DIRECTION's model, clips, materials and master rig; COMBAT's sheet layout, rim and colours; RUN's packer; the map's
own person pen. REFERENCE CHECK: compared beside DIRECTION's master rig, style guide, round five and round six robots at 2x
(the same robot, the round-six look); analog horror AH-01 (rust and grime from the master rig's source pass). [bb ...] Battle
Brothers' Necromancer and Wiederganger keep their lesson whole: kill the man in the back and his robots drop.

## Gates run (the ones this change touches, once)
GREEN: the bestiary (after the roster file was regenerated: it carries the names, MACHINE -> ROBOT), ghosts and apparitions,
attempt, demo build, factions, the sheets are packed, who the face is. RED AND NOT THIS CHANGE: demo gate (TAP TO ENTER and the
cold open: the same three failures with this change's four page files put back to a9f222fb), the fight reads only sourced numbers
(COMBAT's dealHash and board-shape constants; none of the 11 is this change's), one man one look and no two people alike (the
crew screen's hired men), the fight draws what he wears (YOU's car door 5/8), the face is his own face (DRY WELL's stall keeper),
nothing comes twice (ours.json fetched six times), pages publish (1647 MB surface), reference check and reuse first (other lanes'
tools; both of this change's tools carry their checks), a merge did not delete a system (its control commit is not in this clone).
