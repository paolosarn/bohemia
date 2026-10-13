# THE ROAD AND DIRT BEDS, WIRED LIVE (SOUNDS, 10/13)

Row [the map's sounds]. `sounds-the-road-is-faster-10-5` and `sounds-dirt-is-slower-10-5`
are both APPROVED (his ninth sweep's own read of them). This row has named the same gap
every round since round one (10/5): "BOHEMIA_MAP_CURRENT.html posts nothing to the
parent at all -- no postMessage, zero audio hooks -- so there is no live travel state
to hang a sound on yet." RUN's [the map hears] fixed that on 10/9, and its own comment
in `BOHEMIA_CITY_WORLD.html` says outright: "what plays to it is SOUNDS' (the beds are
his to judge first)." His judge is in on both. This closes it.

## What it is

The map's own `mapState()` already posts, every 500 ms, whichever tab is up:
`{ moving, speed, surface: 'road'|'dirt', settlement, arriving, ... }`. Nothing new to
measure -- the signal was built and waiting.

## Same discipline as BARGLASS, bigger function

`footstepModelled`/`footstepWalk` (`engine/bohemia_horror_sounds.js`) are pure buffer
math -- a contact pulse, the ground's own plate modes, grit, a seeded per-step jitter so
no two footfalls ever render identical -- and neither calls a Web Audio filter node
anywhere (checked directly, same way `barGlassDown` was). So the alpha's new `TRAVELBED`
object duplicates the SAME MATH again, not a filter chain. It is a bigger duplicate than
`BARGLASS` (footstep physics has more moving parts than a sum of two struck materials),
but the reasoning is identical: `gates/cooked_sounds_gate.js` reads `TRAVELBED`'s own
source text against `H.TRAVELBED_CONST`, constant for constant, the same technique ROOM,
BROADCAST and BARGLASS already use.

## One detail that would have been a different sound if missed

`footstepWalk` renders each footfall with `beat: BEAT/perBeat`, not the full 0.5 s beat.
A paved road's `perBeat` is 2 (the game's own faster-road ratio, read onto the footfall
engine rather than typed as a second number) so each of its footsteps renders in a 0.25 s
window; dirt's `perBeat` is 1, the full 0.5 s. Dropping that and reusing one window for
both would have shipped a different sound from the one he approved, not a simplification
of it -- so `TRAVELBED.renderStep` takes the window size explicitly, the same way the
module does.

## Never a looped buffer

A `loop:true` buffer repeats the exact same footfalls forever -- the one thing
`footstepModelled`'s own variant seed exists to prevent ("A REAL WALK NEVER LANDS THE
SAME TWICE"). `TRAVELBED` renders 16-beat (8 s) segments one-shot, each one picking up
the step count where the last left off, and starts a fresh segment when the current one
is ending or the surface changes. A long walk never repeats a footfall, matching
`footstepWalk`'s own guarantee rather than a cheaper stand-in for it.

## Wired through the map's own travel clock

`window.addEventListener('bohemia-mapstate', ...)` now also reads `d.moving` and
`d.surface`: moving and not at a settlement screen keeps the bed running (asphalt for
'road', dirt otherwise, switching mid-walk if the surface changes); not moving, or the
settlement screen open, stops it at once. The existing `onArrive` dispatch on the same
event is untouched.

## Checked by a machine, the same lesson every time

`H.TRAVELBED_CONST` carries both materials' constants read straight off `GROUND.asphalt`
and `GROUND.dirt`, never retyped, plus `BEAT`, `HEEL_TOE` and each surface's `perBeat`.
`gates/cooked_sounds_gate.js`: two new claims (the alpha has a live object, every
constant matches), 240/0 (was 238/0).

## Proved on the real page, not assumed from the source

A standalone Playwright check (and `gates/one_engine_gate.js`'s new E12 claim) dispatches
a real `bohemia-mapstate` CustomEvent with `moving:true, surface:'road'`: the bed starts,
`surface` reads `'asphalt'`, a real buffer exists. A second event with `surface:'dirt'`
switches it. A third with `moving:false, settlement:true` stops it. One call each, zero
page errors -- `{"before":0,"afterRoad":1,"playingRoad":true,"surfaceRoad":"asphalt",
"surfaceDirt":"dirt","playingAfterStop":false,"threw":null}`. E12 could not run inside
its own gate file (confirmed again, 45 s timeout): this gate's own boot is the same
pre-existing, unrelated break every round of this row has named (PLUMBER territory).

## What this did not do

    the night's insects (nightInsects)    STILL UNJUDGED (confirmed fresh against the
                                          registry). unjudged = silent keeps it off the
                                          map exactly as every round before this.
    "voices low" at a settlement,         STILL the standing vocal-palette gap, same
    "the crew's shout" at a fight's       reason named every round: this lane's whole
    approach                              palette is struck/resonant/particle material,
                                          never a faked voice.
    the sight-stop sound (68a)            STILL waits on [you can flee], unshipped
                                          elsewhere.

This row re-claims with this round's work. SOUNDS: the sha this round landed on
(PENDING).
