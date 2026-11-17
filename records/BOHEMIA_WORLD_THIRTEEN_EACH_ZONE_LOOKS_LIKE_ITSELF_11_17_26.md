# WORLD THIRTEEN, ROUND SIX, BUILD ONE: EACH ZONE LOOKS LIKE ITSELF (11/17/26)

VAMILY rule 453; rules 429(g)(h); asks 508, 509. BUILD 11/17q - EACH ZONE LOOKS LIKE ITSELF. VOTE
world13-each-zone-looks-like-itself-11-17 (stand_in).

The coordinator 11/17 (his vote on THE GENERATED WORLD HOLDS: 'Amazing'): '(1) more of what he called amazing: each zone of a new
valley looks and plays like itself on the map (the works by the rail, the trailer parks by the freeways, the Strip, the lake shore,
the open desert), with its own places and roads.'

## 1. MEASURED FIRST (the phone, upright, the near stop; 22 valleys in node)

- THE WORKS: at the near and street stops (the close tiles, 96 and 128 texels a block) every building box stood at the far view's
  stretch (VB_TALL: works 3, shops 2.2, casinos 3.5). Measured on the phone at the near stop by the rail (block 55,31): the works'
  boxes 17 to 23 T tall against a house model's 6, a wall of grey towers taller than downtown. The works read as skyscrapers, not
  sheds and yards.
- THE OPEN DESERT: 11/14c left 20 pockets of the 389 off the joined network: house and works lumps beyond the desert with no road
  out, and the desert itself had no way across it but the arterials. Battle Brothers' map has its tracks; ours had none.
- The trailer parks already sit by the freeways and the rail (11/10c THE VALLEY HAS ITS ZONES, the land-use rules); the Strip and
  the lake shore keep their 11/10 looks. Not touched this build.

## 2. THE BUILD

- THE WORKS STAND AS SHEDS UP CLOSE (slices/BOHEMIA_CITY_WORLD.html, `__EACH_ZONE_LOOKS_LIKE_ITSELF__`): VB_TALL carries closeS 96
  and closeK { works 1.1, shops 1.4, casinos 2.5 }; the close tiles (S at least 96) stand those kinds at closeK, the far view keeps
  his 10/25 'taller taller taller'. The homes (houses, trailers, apartments) and the freeway keep their far stretch up close: cutting
  them broke THE HOUSES STAND UP CLOSE M3 (the tallest house over his men) and was put back the same build.
  After: a works shed about two houses tall and wide at the near stop; downtown and the Strip the tallest thing in view again.
- THE DESERT HAS ITS TRACKS (engine/bohemia_overmap.js, `__THE_DESERT_HAS_ITS_TRACKS__`, re-inlined into the map page verbatim):
  `landTracks(m, lanes)`, a pure function of the finished valley. It finds what is off the main network (a pocket of road off it, a
  lump of buildings with no road at all) and lays a dirt track from each, breadth-first over the open ground (desert, wash, basin,
  springs, gypsum, quarry, farm, park, golf, landfill, boneyard, solar), the mountain's edge only when nothing else gets through,
  never over water, a reservoir or a building, and never onto a freeway (it meets an arterial, the Strip or a house street). Each
  track block carries the same four end bits as a lane (1 N, 2 E, 4 S, 8 W). buildOvermap answers m.tracks (t.track per block).
  The map page reads them once a valley (vbTracksValley, none under a home base's square) and the painter draws them on every tile at
  every zoom: a smooth packed strip with two dark ruts, the ground's own colours (dirt and rail), the hills and lumps under it flat.
- PLAYS LIKE ITSELF: the tracks are in the network the gate measures, so a pocket in the desert is reached by road; the party walks
  them like any street.

## 3. NUMBERS (22 valleys)

- 718 track blocks join 369 of the 389 pockets and roadless lumps; the main network is at least 99.83 in 100 of the road blocks on
  every valley (was 99.5); the 20 left are 23 blocks of house and works pockets walled in by water or buildings and 10 blocks of Strip
  stubs. At least 99.85 in 100 of the building lumps on the main network (was 98), 99.92 fronting a road or a track.
- The demo valley: 43 track blocks (desert 15, mountain edge 21, solar 5, farm 1, wash 1).

## 4. GATES (all on this tree)

- THE GENERATED WORLD HOLDS 8/0: G1 now counts the tracks (main network at least 99.8, nothing unexplained), G2 99.5 / 99.8,
  G3, G4 planted, P1/P2 on the page upright and on its side.
- THE CORNERS JOIN 7/0, THE MAP'S STREETS JOIN 6/0, MAP JOINS 23/0, A STREET IN FRONT OF EVERY HOUSE 10/0, THE VALLEY HAS ITS ZONES
  9/0, THE PLACES ARE TEMPLATES 13/0, EVERY MAP KIND HAS ITS FIGHT ANSWER 22/0, THE MAP STANDS UP 13/0, ONLY TALLER BREAKS 10/0, THE
  HOUSES STAND UP CLOSE 28/0.
- THE MAP STANDS TALLER is RED on main without this build, the same legs (W1 the near stop's glass, W3b the berm, C1 the timing):
  20/6 on main, 21/5 here. Named for RUN in the handoff.

## 5. PICTURES (the VOTE card, the phone upright)

Left: main at the near stop by the rail, the works as towers. Middle: this build, the same spot, the works as sheds. Right: the
street stop in the open desert south-west (block 10,91), a dirt track across it to the houses.

## 6. NEXT (rule 453)

(2) every zone's cells handed to COMBAT THREE with their ground (a per-zone ground table in FIGHT_OPTS.ground, the track carried);
(3) the map's draw measured on a cheap phone at every zoom on many seeds.

[bb] Battle Brothers' map has its dirt roads between the towns and across the open land; ours lays one from every place the roads
do not reach.
[analog horror] two ruts in the dust out to a house nobody should be living in, and the ruts are fresh.
