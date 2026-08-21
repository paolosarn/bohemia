#!/usr/bin/env python3
"""
BOHEMIA — THE DESERT MOVES THE METAL (8/21/26, SOUND lane).

REUSE CHECK: cooks no new VOICE. It adds one recipe on the `fm` method, which
already ships (neon_hum, deed_stamp, set_down, car_heat), and it rides the
AMBIENCE ROTATION that already exists and already carries the gust, the
generator and the lit sign. No new mechanism, no new bus, no new wire shape.

WHY, AND WHAT WAS WRONG BEFORE. THE CAR TICKS was offered to Paolo ten times
across two ids and every one died:

    panel_tick  "hiding behind a car is a clock you can watch"   0 UP / 5 DOWN
    car_heat    "the raw-synthesis version"                      0 UP / 5 DOWN

TWO THINGS WERE WRONG AND NEITHER WAS THE SYNTHESIS.

1. THE BRIEF DESCRIBED A CAR THAT HAD JUST BEEN DRIVEN. Engine-cooling tick is a
   twenty-to-thirty minute phenomenon after a hot shutdown. Bohemia's cars are
   WRECKS -- they are cover, they have sat for years, and a cold wreck does not
   tick because an engine cooled in it. Written that way the moment could never
   be true in this valley, which is the coins mistake exactly: the better the
   sound was at being what it was asked to be, the more wrong it was.

   WHAT IS TRUE INSTEAD, and it happens every single day: sheet metal in the
   Mojave takes full sun, expands, and then CONTRACTS as the sun comes off it.
   Thermal cycling makes abandoned steel tick and pop in the late afternoon and
   again in the morning. It needs no engine and no driver. That is the real
   moment, it belongs to the WORLD rather than to combat cover, and that is why
   this rides the ambience rotation instead of a cover state.

2. EVERY CANDIDATE TICKED IN RHYTHM. All ten hit-sets across both ids land on a
   32nd-note grid (every value a multiple of 0.0625). Contracting metal is
   stick-slip: the intervals are irregular AND THEY LENGTHEN, because the metal
   approaches ambient temperature asymptotically and the contraction rate decays
   with it. A tick that arrives on a grid reads as a machine, a meter, a clock --
   which is what the old brief literally asked for ("a clock you can watch").
   These hit-sets are deliberately OFF the grid and each gap is roughly 1.5x the
   one before it.

   AND THAT DOES NOT TOUCH THE 120 BPM LAW. That law governs GAMEPLAY -- "when a
   mechanic and the beat disagree, THE MECHANIC MOVES: difficulty, pattern speed,
   cycle length, cover windows". It is about WHEN a sound is triggered, never
   about the grain texture inside one triggered event. The sound is still asked
   for on the beat like everything else; what happens inside it is texture.

METHOD: `fm`, chosen on purpose. SFX DIVERSITY is red because `instrument` owns
53.8 percent of all non-modal recipes against a 50 percent cap -- Paolo's own
"you need more diverse sounds bro its getting stale" as arithmetic. fm has four.
Cooking here lifts the floor instead of raising the top.

  python3 tools/bohemia_desert_metal_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'

EVENT = """    /* ---- 8/21: THE DESERT MOVES THE METAL. Replaces THE CAR TICKS, which
       died 10 for 10 under panel_tick and car_heat because its brief described
       an engine cooling after a drive, in a valley whose cars are years-old
       wrecks. Sun-heated sheet metal contracting in the late afternoon is the
       version that is true here, needs nobody to have driven anything, and
       belongs to the world rather than to combat cover. ---- */
    { ev: 'metal_ticks', label: 'THE METAL MOVES',    why: 'sun-heated sheet metal contracting as the day comes off it. irregular, and the gaps get longer as it cools. no engine, no driver, just steel and the desert' },
"""

RECIPE = """
    metal_ticks: {
      /* STICK-SLIP, NOT A CLOCK. Every dead candidate for this moment ticked on
         a 32nd grid and therefore read as a meter. Contracting metal releases
         irregularly and SLOWS DOWN, because the panel approaches ambient
         asymptotically -- so every gap below is off the grid and each one is
         roughly 1.5x the gap before it. Thin and bright: this is a panel
         releasing, not a bar being struck. */
      base: { synth: 'fm', mat: 'metal', hz: 1850, ratio: 2.74, index: 1.5,
              modes: 5, bright: 0.68, decay: 0.075, damp: 2.2, warble: 0.2,
              atk: 0, trans: 0.55, transHz: 3100, transQ: 1.5, grit: 0.18,
              gritHz: 2200, space: 0.12, room: 0.1875, refl: 1, dark: 5200,
              width: 0.42, drive: 0.04, mkup: 0.82, gain: 0.24,
              hits: [0, 0.11, 0.29, 0.58, 1.02] },
      jit:  { hz: [1450, 2600], ratio: [2.2, 3.4], index: [1.0, 2.3],
              decay: [0.05, 0.11], bright: [0.55, 0.8], dark: [4200, 6600],
              width: [0.34, 0.55] },
      hitSets: [[0, 0.11, 0.29, 0.58, 1.02], [0, 0.14, 0.33, 0.67],
                [0, 0.09, 0.23, 0.47, 0.88], [0, 0.17, 0.41, 0.83],
                [0, 0.13, 0.31, 0.62, 1.09]]
    },
"""


def main():
    s = open(ENGINE, encoding='utf8').read()
    if "ev: 'metal_ticks'" in s:
        print('  the engine already has it')
        return 0

    mark = "    /* ---- end batch SFX-05 events ---- */"
    if mark not in s:
        print('FAIL: could not find the end of the events list')
        return 1
    s = s.replace(mark, EVENT + mark, 1)

    anchor = '\n    walk_more: {'
    if anchor not in s:
        print('FAIL: could not find the recipe table')
        return 1
    s = s.replace(anchor, '\n' + RECIPE.rstrip() + anchor, 1)
    open(ENGINE, 'w', encoding='utf8').write(s)
    print('  metal_ticks added: fm, off-grid, gaps that lengthen as it cools')
    print('  NEXT: add it to the ambience rotation, then rebuild + re-wire')
    return 0


if __name__ == '__main__':
    sys.exit(main())
