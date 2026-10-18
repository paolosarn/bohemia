# THE MAP HEARS THE DESERT (SOUNDS, 10/18/26)

Row: [the desert under travel] (VAMILY, SOUNDS), the next round of [the settlement's sounds] and [the map's
sounds]. Opened by the coordinator under rule 112, run on Opus under rule 116.

## THE RULINGS THIS ROUND ACTS ON

- Paolo 10/10, the eleventh votes, YES on sounds-the-road-is-faster-10-5 with: "The travel clip at night is
  terrible so just use the day one for the night one too. I don't know why you know there's already gonna be
  music and stuff that doesn't need to be. You don't have to fall in love with this fucked up generator
  humming noises everywhere, bro. And the dog sound effect has nothing to do with the dog bro."
- Paolo 10/17, UP on sounds-the-settlement-heard-whole-10-17 (the real recordings; the note answered by
  7e9e31b's thinned desert bed). NOTES ARE RULINGS (7/19).

## WHAT SHIPPED

- `MAPDESERT` in slices/BOHEMIA_ALPHA_0_9.html, beside AMB (the alpha owns the map's audio; the map frame
  posts BOHEMIA_MAP_STATE every 500 ms and the shell raises 'bohemia-mapstate'):
  - the recorded desert bed `slices/vote/settlement_heard/bed_day.mp3` (the same file the settlement plays,
    CC0 Freesound clips through ESC-50, every author in that folder's manifest.json) under the map, the DAY
    clip by day AND by night, his words; a far thing every 25 to 60 s (day: horn, helicopter, crow; night:
    helicopter, siren; the rooster stays in the town by day);
  - on while the map posted in the last 1.5 s, no settlement screen open, the RUN or MAP tab on, the page
    visible; anything else fades it out in 0.6 s; through sfxBus(), so the SETTINGS knob scales it;
  - the same one-second equal-gain overlap loop the settlement uses (no codec click at the seam).
- RETIRED, one engine call this round: the arrival's `placeSound('generator', ...)` in AMB.onArrive. The town's
  settlement screen opens 250 ms later and carries its own recorded bed. The decision log stays.
- AMB.tick stands down while MAPDESERT plays: the engine-made air_day / air_night beds (the "terrible" night
  clip), the gust and the generator never play under the map again. The road and dirt footsteps (approved,
  wired 10/13) stay on top.
- The demo re-cut by tools/bohemia_cut_the_demo.js (the cut also carried other lanes' alpha changes that were
  not cut yet; the stamp file moved with it).
- VOTE: `sounds-the-map-hears-the-desert-10-18`, the real map from its own camera with DAY and NIGHT buttons
  playing the same code path (slices/BOHEMIA_THE_MAP_HEARS_THE_DESERT_10_18_26.html).

## GATES

- map heard 17/0 (new, gates/map_heard_gate.js): the alpha and the demo carry the same block byte for byte;
  the day bed by day and by night, never the night or rainforest beds; the recording loads and decodes; a
  forced AMB tick renders nothing while the desert plays; an arrival plays no generator; the settlement
  screen, another tab, or the map going quiet each silence it; run twice, green twice.
- one engine: E9 amended (an arrival is decided once and plays no engine generator; a repeat does nothing;
  the dead dog stays dead). THE GATE IS RED ON MAIN BEFORE THIS CHANGE, the same way: its first click on the
  COMBAT tab times out because the front splash (#front) intercepts the pointer. Measured with this round's
  changes stashed: 0 passed, 1 failed, identical. Not this lane's; named for PLUMBER and RUN.
- cooked sounds 240/0; demo build: the committed demo is exactly the cut.

## NOT DONE, SAID PLAINLY

- The footsteps under travel are still the engine-built ones he approved (10/13). The next row puts recorded
  footsteps there, retiring the next engine call.
- Paper for the board still waits on a real recording.
