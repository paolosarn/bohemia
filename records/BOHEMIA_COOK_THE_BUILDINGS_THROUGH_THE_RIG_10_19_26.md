# COOK [the buildings through the rig] 10/19/26: EVERY BUILDING HE HAS SEEN AS TILES, MODELLED AT COOK FOUR'S SIZE

His words (rule 121(j), 10/19): "even the floor tiles and building tiles and all accessories have to get remade with this
analog horror Crashbox style. Everything. Everything." And on COOK FOUR's Strip in the nineteenth votes: "3d remodel otw"
(the motel sign tower, the wedding chapel), "Were changing to the 3d models revamp for everything now but its lookin
decent" (Goodsprings), "3d remodel incoming" (the casino board). Rule 115b had kept the buildings on his packs until
DIRECTION ruled; his 121(j) is newer and moves them to the rig.

## THE FIFTEEN (tools/bohemia_cook_model_buildings.py)
Every size, opening and wrong thing is COOK FOUR's, read from its records 10/17 to 10/19 (the five ranch kinds of the
straight-roof family in the valley's tans; the casino, the tower casino, the church, the motel and its sign tower, the
pawn shop, the wedding chapel, the gas station, the warehouse, the school). Puppet shapes from the props modeller's
boxes and pulled profiles; the roof is COOK FOUR's straight roof made real (the ridge the length of the building, the
gables in the wall's own stucco, 3-tab shingle strips in 20 cm courses, each its own shade, in his tans: 'more tan...
never bright medieval orange'); the walls carry forty years of desert rain splashed up their foot and streaks down from
every sill; windows dark glass in frames, some boarded, some barred, one lit.

## THROUGH THE RIG
The master rig's own pieces imported (tools/bohemia_direction_master_rig.py, never edited): calibrate (every building
first proves the rig: the 1 m cube 58 px, the light 155.4 deg), source_pass at the guide's wear 0.6, dent_pass,
light_and_film at the guide's 128 samples, population('settlement') + post (the snap toward his settlement family's own
colours at 0.6, the ring), card and guide_card; the rig's camera at the men's 57 px a metre, heights x 1.414. Two
additions, said plainly: a SHADOW CATCHER under the building, so its real cast shadow and contact darkness ship as the
rig's shadow layer (black at alpha, on the same box) instead of the props' ellipse; and a canvas cut to the three facings'
own screen boxes (the rig's square span gave the tower casino a 4,860 px square of sky). The ranches render S, SE and SW
(the map turns a house); the Strip and the town face their street, S. rig.json carries rig_round 7, the calibration and
no break, so gates/style_guide_gate.py reads every one.

## FOR RUN (the map's near stop and the settlement) AND COMBAT
Each building: reference/models/bohemia/bld_<name>.glb (geometry and flat colours; the shingle courses and the grime are
procedural and live in the renders), records/target/master_rig/cook_bld_<name>/rig_<facing>.png with shadow_<facing>.png,
rig.json (crop box, real size). The suburb fight blocks already stand the ranches in their own light (row one).
