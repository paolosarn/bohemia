# THE MAP HEARS (RUN, 10/9/26, [the map hears])

> **SOUNDS 10/5 (4a0d27cf):** the travel screen posts nothing to the parent; the road and dirt beds and
> 68a's sight-stop sound have nothing to play to on the MAP tab.

## MEASURED FIRST
- The map told the shell only `BOHEMIA_WHERE` every four seconds (inside, night, minute, district, the
  nearest lit block), which SOUNDS round two used to let the valley's weather play on the MAP tab.
  Nothing said whether the party was moving, on a road or on dirt, whether the clock was stopped, or
  that a town had been reached.
- SOUNDS' travel beds (`travelRoadBed`, `travelDirtBed`, `nightInsects`) live in
  engine/bohemia_horror_sounds.js, which only the VOTE preview pages load; they wait on his votes
  (sounds-the-road-is-faster-10-5 and its two neighbours). Unjudged is silent is SOUNDS' own rule, so
  wiring them into the game is SOUNDS' call; this row gives them something to play to.

## NOW (`__THE_MAP_HEARS__`, the map; one line in the shell)
- **`BOHEMIA_MAP_STATE` on the beat** (every 500 ms, 120 BPM), from the map frame to the shell whichever
  tab is up: `moving` and `speed` (the pad's pick), `surface` road or dirt from the ground under the party
  (road on the five paved districts that make travel faster: freeway, arterial, strip, beltway,
  interchange; dirt elsewhere), `day`, `min`, `hour`, `night`, `stopped` (the pad on pause), `settlement`
  (the settlement screen open), `arriving` (the last town reached: name, sequence, how long ago; also
  posted the moment he gets there), `sight` (a party in sight: `MAP_SIGHT`, null until the map draws
  roaming parties, which is [you can flee]'s), `at` (his block).
- **The shell keeps it:** `window.BOH_MAP_STATE` (with a count and a time) and a `bohemia-mapstate`
  event for whoever plays to it.

## FOR SOUNDS
Listen with `addEventListener('bohemia-mapstate', e => e.detail)` or read `window.BOH_MAP_STATE`:
`moving && surface === 'road'` is the road bed, `moving && surface === 'dirt'` the dirt bed, `night` the
insects, `arriving` (a new `seq`) the arrival, `stopped` the clock, `sight` the sight-stop (68a) once
[you can flee] sets it. One bus with the song.

## CHECKS
- **THE MAP HEARS**, new, 8/0, registered slow. Driven on the demo: ten states in 5.2 s, median gap
  500 ms; the clock is the map's; a freeway says road and a wash says dirt; eight of eight beats moving on
  a journey, still after the stop; pause stops the clock; reaching Church names Church the same moment;
  the settlement screen open is said. Mutations, each red: posting every 2 s; every ground called road;
  no arrival mark; the shell dropping the state.
