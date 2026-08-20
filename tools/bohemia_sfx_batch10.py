#!/usr/bin/env python3
"""
BOHEMIA — SFX-10: THE TWO SURFACES I JUST MADE AUDIBLE HAVE ONE SAMPLE EACH
(8/20/26, SOUND lane).

REUSE CHECK. Banks opened: the alpha's 602-voice rack, and every candidate voice
below was rendered at the REAL footstep operating point (sd 0.05, the semitone
the recipe actually uses) and measured before it was written down. Four names
that looked perfect for wood -- `knock`, `rim`, `wood`, `brim` -- render SILENT
through synthV because they are drumV kinds, and measuring is the only reason
they are not in this batch. Nothing new is cooked: it is all his rack.

WHY THIS EXISTS, AND IT IS MY OWN LAST SHIP THAT CAUSED IT.
Yesterday the city's ground classifier knew three surfaces and every sidewalk
played the roadway footstep. I made it report six, which finally lets
step_concrete, step_sand and step_wood play -- three sounds he approved on 8/12
and had never heard. But:

    step_asphalt   5 approved variants
    step_gravel    5
    step_dirt      5
    step_concrete  1  (+3 from walk_more = 4 effective)
    step_sand      1  <-- and the classifier returns 'sand' for ANY unnamed
    step_wood      2       tile, which is most of the open valley

So the moment those surfaces became reachable, the MACHINE GUN defect this lane
already has a law about went live: one sample fired every step reads as a
machine, not a footstep. Sand is the worst of it because bare desert falls
through to sand, which makes it the most-walked ground in the game behind
asphalt, playing ONE sound.

A fix that creates a defect one layer down is half a fix. This is the other half.

THE SOURCE IS THE ONE THAT WORKS. Instruments run 48% approval against roughly
30% for raw synthesis on his own thumbs, and the moments that came back from the
dead all came back as instruments (miss -> miss_past, 0/45 then 20 up / 0 down).
Both existing step_sand and step_wood are raw synthesis.

THE POOLS ARE ODD-NUMBERED ON PURPOSE. The round-robin research is consistent
that odd variant counts beat even ones, because an even pool locks to the
phrasing -- and in this engine EVERYTHING quantises to 120 BPM, so an even pool
would lock hard. Five each, feeding a sibling pool the way step_concrete already
draws from walk_more.

MEASURED, at sd 0.05 and the recipe's own semitone:
  SAND  cabasa 0.028s  washboard 0.042s  brushkit 0.056s  sodahiss 0.048s
        sweeppad 0.083s      -- short, granular, no ring, which is what sand is
  WOOD  rimshotr 0.014s  claves 0.023s  templeblock 0.045s  spoonclack 0.065s
        marimba 0.217s       -- a board under a boot, and one that rings

  python3 tools/bohemia_sfx_batch10.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'

EVENTS = """    /* ---- batch SFX-10 (8/20): siblings for the two surfaces that became
       reachable on 8/20 and had one sample each. A single sample under every
       step is the MACHINE GUN, and bare desert falls through to sand. ---- */
    { ev: 'sand_more',   label: 'MORE SAND',             why: 'step_sand.0 is ONE sample, and the ground classifier returns sand for any unnamed tile -- which is most of the open valley' },
    { ev: 'wood_more',   label: 'MORE BOARDS',           why: 'step_wood has two samples for every porch, deck and floorboard in the game' },
"""

RECIPES = """
    /* ================= BATCH SFX-10 (8/20/26) ==========================
       Sibling pools for step_sand and step_wood, built on his rack because the
       instrument source runs 48% approval against 30% for raw synthesis and
       both existing recipes are raw synthesis. Every voice was rendered at the
       REAL footstep point -- sd 0.05, the recipe's own semitone -- before it
       was written here; `knock`, `rim`, `wood` and `brim` all looked right for
       boards and all render SILENT through synthV, because they are drumV
       kinds. Measuring is the only reason they are not in this file. */
    sand_more: {
      /* SAND HAS NO RING. Grain, a short hiss, and nothing that sustains -- so
         the decay is tiny, the room is off, and the grit is nearly all of it. */
      base: { synth: 'instrument', inst: 'cabasa', mat: 'ash', hz: 74,
              modes: 4, bright: 0.42, decay: 0.09375, damp: 2.4, warble: 0.25,
              atk: 0, trans: 0.5, transHz: 780, transQ: 0.7, grit: 0.9,
              gritHz: 520, space: 0.05, room: 0.0625, refl: 0, dark: 620,
              width: 0.32, drive: 0.07, mkup: 0.9, gain: 0.3 },
      /* THE NOTE HAS TO BE LONGER THAN THE VOICE. decay jit started at 0.0625,
         which quantises to a 1/16-beat window of 31 ms, and `sweeppad` needs 83
         at this step -- so it was cut to a click. A footstep is short, not
         shorter than the thing making it. */
      jit:  { hz: [58, 102], decay: [0.09375, 0.1875], width: [0.24, 0.44],
              dark: [460, 900], grit: [0.8, 1] },
      /* `sweeppad` was here and came out a CLICK: the calibration grid predicts its
         peak from two semitones, -24 and +12, and this recipe sits at about -18
         where the straight line between them overshoots by roughly 2.6x. Third
         time that two-point pitch model has mispredicted a voice. `guiro` is
         measured accurate at this operating point. The model is the real bug and
         it is written up as the top item; fixing it moves every instrument sound
         he has already approved, so it wants a deliberate re-record, not a
         late-session bolt-on. */
      instSets: ['cabasa', 'washboard', 'brushkit', 'sodahiss', 'guiro'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    wood_more: {
      /* A BOARD UNDER A BOOT. Brighter and shorter than the materials that die
         in his sweeps -- the door post-mortem's own prescription, which the
         existing step_wood recipe already carries in its comment. */
      base: { synth: 'instrument', inst: 'templeblock', mat: 'wood', hz: 116,
              modes: 5, bright: 0.95, decay: 0.09375, damp: 2.2, warble: 0.6,
              atk: 0, trans: 0.7, transHz: 2800, transQ: 1.3, grit: 0.26,
              gritHz: 1600, space: 0.1, room: 0.125, refl: 1, dark: 1600,
              width: 0.44, drive: 0.09, mkup: 0.88, gain: 0.31 },
      jit:  { hz: [95, 160], decay: [0.0625, 0.125], width: [0.34, 0.58],
              dark: [1200, 2400], bright: [0.78, 1.2] },
      instSets: ['templeblock', 'spoonclack', 'claves', 'rimshotr', 'marimba'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
"""


def main():
    s = open(ENGINE, encoding='utf8').read()
    if "ev: 'sand_more'" in s:
        print('  already installed (idempotent, nothing to do)')
        return 0

    mark = "    /* ---- end batch SFX-05 events ---- */"
    if mark not in s:
        print('FAIL: could not find the end of the events list')
        return 1
    # the entry before the marker may have no trailing comma; the SFX-09 tool
    # learned this the hard way when node refused to parse the module.
    tail = "with no body in it at all' }"
    if tail in s and (tail + ',') not in s:
        s = s.replace(tail, tail + ',', 1)
    s = s.replace(mark, EVENTS + mark, 1)

    ranchor = '\n    walk_more: {'
    if ranchor not in s:
        print('FAIL: could not find the recipe table')
        return 1
    s = s.replace(ranchor, '\n' + RECIPES.rstrip() + ranchor, 1)

    open(ENGINE, 'w', encoding='utf8').write(s)
    print('  2 sibling pools added: sand_more, wood_more')
    print('  the engine now declares %d game moments'
          % len(re.findall(r"\{ ev: '", s)))
    print('  NEXT: measure the new voices, rebuild, then wire the sibling pools')
    return 0


if __name__ == '__main__':
    sys.exit(main())
