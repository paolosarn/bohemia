# THE STEPS FROM A RECORDING (SOUNDS, 10/18/26)

Row: [steps from a recording] (VAMILY, SOUNDS), the next round of [the desert under travel]. Opened by the
coordinator under rule 112, run on Opus under rule 116.

## THE RULINGS THIS ROUND ACTS ON

- Paolo, the fourteenth votes: YES on a desert not a rainforest, the map hears the desert, the settlement sounds
  real in the game, the title is the desert. Every sound he kept since 10/17 starts from a microphone.
- Rule 108b (10/10): a sound starts from a recording; the engine's oscillator and noise calls are the retire list.
- His 10/5 'the road is faster' and his 10/13 YES on TRAVELBED (the modelled road and dirt beds): the cadence stays.
- Rule 32e: real material, no sand. Unjudged is silent. Rule 93: a demo cut is RUN's call only.

## WHAT SHIPPED

- RECORDINGS: four new CC0 Freesound walks via ESC-50's footsteps class (40 clips, 24 CC0; chosen by what the
  recordist named the ground):
  - asphalt: Ryding, 'Fotsteg pa asfalt' (3-94343-A-25); hintringer, 'walking slow on the street' (3-249913-A-25)
  - dirt: Ryding, 'Fotsteg pa grus' (gravel, the same recordist and shoes as his asphalt; 3-94344-A-25);
    soundmary, 'footsteps - gravel pavement' (4-117627-A-25)
  FLAC in reference/library/sound_bank/esc50_cc0/, licence lines frozen in tools/bohemia_from_a_recording_sources.json
  and LICENCES.md. Every author is CC0 at the source.
- THE CUTS: tools/bohemia_from_a_recording.py --steps finds each footfall (a 150 Hz high-passed envelope at 25 Hz,
  peaks a third of a second apart, 8 dB prominence), keeps the four strongest per recording, cuts from 8 ms before
  the hit to 0.22 s (road) or 0.38 s (dirt), never into the next footfall; high-pass 120 Hz, tape at 0.8, low-pass
  7.5 / 6.5 kHz; every cut levelled by its loudest 30 ms to -19 dB (measured: an rms target left the gravel cuts
  9 dB apart once the peak cap bit; by the hit, the road's eight sit within 0.1 dB, the gravel's within 3.2).
  Out: slices/vote/travel_steps/steps_asphalt.mp3 and steps_dirt.mp3 (49 KB each), one cut per half-second slot,
  and manifest.json with every slot, window and source; before_steps_*.mp3 is the same cuts with only the fades.
- THE PLAYER: engine/bohemia_travel_steps.js, BOH_TRAVEL_STEPS.make(). A look-ahead clock lays one cut per
  footfall on the beat, the road two a beat and the dirt one (TRAVELBED's own PERBEAT), at TRAVELBED's own level
  (0.5), never the same cut twice in a row, each 3 percent faster or slower and 1.5 dB louder or softer.
- VOTE: sounds-the-steps-from-a-recording-10-18, slices/BOHEMIA_THE_STEPS_FROM_A_RECORDING_10_18_26.html: the real
  map from its own camera, the recorded desert bed under it at the game's level, ROAD and DIRT (real shoes) and
  WHAT PLAYS NOW (the engine step, BOH_HORROR_SOUNDS.travelRoadBed / travelDirtBed) for the A/B.

## NOT IN THE ALPHA YET, ON PURPOSE

The alpha is untouched this round. The row says the engine render retires 'once his VOTE says so', and any alpha
byte means a demo re-cut (DEMO BUILD gate), which is RUN's call (rule 93). The swap is written as a cue in
BUILD_CALLING_SCRIPT.md for RUN on his YES: one script tag (../engine/bohemia_travel_steps.js), one
`var STEPS = BOH_TRAVEL_STEPS.make({ dir: 'vote/travel_steps/' })`, and in the 'bohemia-mapstate' listener
`STEPS.ensure(bus, MUS.AC, surface)` in place of `__travelBedEnsure(...)`, `STEPS.stopBed()` beside
`TRAVELBED.stopBed()`. The gate turns red if the alpha loads the file without his YES in the registry.

## GATES

- travel steps 31/0 (new, gates/travel_steps_gate.js, registered in bohemia_gates.py): sprites and manifest agree,
  every source CC0 and in the licence file, the engine's cadence and level equal TRAVELBED's, unjudged silent; in a
  real browser every cut decodes with silence before it and a hit in its first 60 ms, the road lays 16 to 19 steps
  in 4 s and the dirt 7 to 11, no cut twice in a row, the A/B's engine step plays, STOP stops, nothing throws.
  Run twice, green twice. It caught one real defect on the way: on a 390 px phone the fifth button wrapped below
  the bar; the bar is a two-column grid now.
- from a recording --check PASS; cooked sounds GREEN; attempt 15/0; gate registry 7/0.
- vote tab: red BEFORE this change on two DYNASTY items with no 'where you see it' (dynasty-flip-at-crisis-10-9,
  dynasty-animal-era-10-10); measured with this round stashed, identical. Not this lane's; named for DYNASTY.

## NEXT

- On his YES: RUN's cue. On B (quieter): REL down 3 dB in the engine file, one number.
- The next engine call to retire: the fight's step on the house tiles, or the settlement's own walk, from the same
  four walks; paper for the board still waits on a real recording.
