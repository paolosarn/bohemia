#!/usr/bin/env python3
"""
BOHEMIA - SFX BATCH 02. SIX NEW MOMENTS, THIRTY NEW SOUNDS TO JUDGE.

TWO RULINGS FROM PAOLO, 8/2, taken verbatim:

  "Theres no new sounds make new sounds"
  "eat will be a different sound"

He tapped the new soundboard and heard the 7/30 batch, which is the only batch
that has ever existed. The board was doing its job and the board was still
boring: it showed him everything, and everything was old. So this cooks a real
second batch.

AND EAT IS ITS OWN MOMENT NOW, which is his ruling and it also settles the one
question I had open. I had wired PICKUP to the EAT WHAT YOU FOUND action as the
closest real take-the-thing moment, flagged it as the judgement call, and asked
whether to keep it. He answered by ruling the moment, not the sound: eating is a
different thing from picking up. So EAT gets its own recipe and its own five
candidates, and the eat action calls it instead of pickup.

WHAT THAT COSTS, SAID OUT LOUD: pickup goes back to having no call site, because
the eat action was its only one and there is still no inventory anywhere in this
game. That trips the "no approved family is silent" check I shipped this morning,
so pickup gets a NAMED waiver in the gate with the reason and the date. Not
hidden, not quietly deleted from the bank: stated every run, and closed, so
nothing new can join it.

=== THE SIX MOMENTS, AND WHY EACH ONE IS REAL =================================

Nothing here is invented to justify a sound. Every one of these already happens
in the run, today, in silence:

  eat        spendTime('EAT','You ate.')     - HIS RULING
  sleep      spendTime('SLEEP', 8 hours)     - the biggest block of time there is
  talk_start openTalk / openPerson           - somebody turns toward you
  go_inside  enter()                         - you cross into a building
  quest_done RT.state.done flips             - the run's one real completion
  time_pass  the spendTime toast             - hours going by while you stand there

=== THE SOUND DIRECTION, WHICH IS THE FILE'S OWN LAW ==========================

engine/bohemia_sfx.js already states it: apocalyptic horror Final Fantasy, every
sound a small ritual object struck in a big dead room, and CRUCIALLY -- "only
sounds that MEAN something get the room. Footsteps stay dry and close. The
contrast is the horror." So these six are deliberately spread across that axis
rather than all being reverberant:

  eat        WET AND CLOSE. water and grit, almost no room. It should be a
             little unpleasant and entirely intimate: nobody else hears you eat.
  talk_start DRY AND WARM. wood, tiny room, a body turning. The smallest sound
             in the batch, because a person is not an event. Its FIRST cut
             measured 0.019 stereo width on candidate 3 -- effectively mono, and
             sfx_render_gate is right to call that out: moving off mono is the
             one thing this whole engine was rebuilt around. Small does not mean
             centred. Width floor raised to 0.5, space to 0.14, and it is still
             the driest thing in the batch.
  time_pass  GLASS, SPARSE, HALF-LIT. a slow downward slide, medium room. Time
             is the only one that MOVES in pitch.
  go_inside  STONE, and the ROOM is the sound. Not a door (he killed all ten
             door candidates): the space swallowing you as you step in.
  sleep      ASH AND CHOIR, the longest decay in the batch, deep and dark. Going
             under for eight hours in a valley that has already ended.
  quest_done THE CHAPEL BELL, the full reliquary treatment, the most room of
             anything in the game. This is the one moment that earns it.

Six materials, six fundamentals, no two share a room amount. Every duration on
the 16th-of-a-beat grid (120 BPM LAW), nothing invented outside the typed spec.

MECHANISM-MINE / CONTENTS-PAOLO'S: the recipes and the candidates ship. WHICH
sound each moment makes is his verdict, and the bank stays EMPTY for all six
until he thumbs one. Until then they are silent in the game and audible on the
board, which is exactly the pipeline.

REUSE CHECK (REUSE-FIRST, 7/22): zero graphic pixels, so no banks/ art bank
applies and none was opened. The audio reuse is total and deliberate: every one
of these is the EXISTING BOH_SFX modal engine and its existing MODES tables
(water, wood, glass, stone, ash, choir, bell) driven by new parameter vectors.
No new synthesis code is written at all - a recipe is data.

  python3 tools/bohemia_sfx_batch02.py
"""
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ENGINE = 'engine/bohemia_sfx.js'
RUN = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'

E_BEGIN = "    /* ---- BATCH 02 (8/2/26): SIX MOMENTS THE GAME ALREADY HAS ----------"
E_END = "    /* ---- end batch 02 events ---- */"

EVENTS = E_BEGIN + r"""
       Paolo 8/2: "Theres no new sounds make new sounds" and, ruling the moment
       rather than the sound, "eat will be a different sound". Every one of these
       already happens in the run today, in silence. */
    { ev: 'eat',        label: 'YOU EAT',            why: 'what the room was holding, and you took it. nobody else hears this' },
    { ev: 'sleep',      label: 'YOU SLEEP',          why: 'eight hours gone. the biggest block of time in the game' },
    { ev: 'talk_start', label: 'SOMEBODY TURNS TO YOU', why: 'the moment a conversation starts. small: a person is not an event' },
    { ev: 'go_inside',  label: 'YOU STEP INSIDE',    why: 'crossing into a building. the ROOM is the sound, not the door' },
    { ev: 'quest_done', label: 'IT IS DONE',         why: 'the run completed. the one moment that earns the whole room' },
    { ev: 'time_pass',  label: 'HOURS GO BY',        why: 'time spent standing still. the only sound here that moves in pitch' }
""" + E_END

R_BEGIN = "    /* ---- BATCH 02 RECIPES (8/2/26) ----"
R_END = "    /* ---- end batch 02 recipes ---- */"

RECIPES = R_BEGIN + r"""
       Spread deliberately across this file's own contrast law: eat and talk are
       dry and close, quest_done gets the most room of anything in the game. */
    eat: {
      base: { mat: 'water', hz: 148, modes: 6, bright: 0.7, decay: 0.1875, damp: 2.2,
              warble: 1.4, trans: 0.55, transHz: 1100, transQ: 0.8, grit: 0.6,
              gritHz: 700, space: 0.05, room: 0.0625, refl: 0, dark: 800,
              width: 0.3, drive: 0.2, mkup: 1.2, gain: 0.3,
              hits: [0, 0.125] },
      jit:  { hz: [110, 205], decay: [0.125, 0.3125], transHz: [700, 1900],
              grit: [0.45, 0.8], gritHz: [500, 1200], warble: [0.8, 2.2],
              damp: [1.7, 2.8], width: [0.2, 0.45] },
      hitSets: [[0, 0.125], [0, 0.0625, 0.1875], [0, 0.1875],
                [0, 0.0625, 0.125, 0.25], [0, 0.125, 0.25]]
    },
    sleep: {
      base: { mat: 'choir', hz: 54, modes: 11, bright: 0.45, decay: 3, damp: 0.7,
              warble: 1.9, atk: 0.375, slide: -4, trans: 0.08, transHz: 500,
              transQ: 0.6, grit: 0.18, gritHz: 380, space: 0.72, room: 2.25,
              refl: 3, dark: 900, width: 0.85, drive: 0.05, mkup: 1.6, gain: 0.26 },
      jit:  { hz: [42, 72], decay: [2.25, 3.75], atk: [0.25, 0.5], slide: [-8, -2],
              space: [0.6, 0.85], room: [1.75, 2.75], dark: [650, 1300],
              warble: [1.3, 2.6], width: [0.7, 1] }
    },
    talk_start: {
      base: { mat: 'wood', hz: 262, modes: 5, bright: 1.05, decay: 0.125, damp: 2,
              warble: 0.6, trans: 0.62, transHz: 2100, transQ: 1.3, grit: 0.16,
              gritHz: 1500, space: 0.18, room: 0.125, refl: 1, dark: 1900,
              width: 0.55, drive: 0.1, mkup: 0.95, gain: 0.28 },
      jit:  { hz: [205, 340], decay: [0.0625, 0.1875], transHz: [1500, 3200],
              bright: [0.85, 1.4], damp: [1.6, 2.5], width: [0.5, 0.8],
              space: [0.14, 0.26] }
    },
    go_inside: {
      base: { mat: 'stone', hz: 84, modes: 8, bright: 0.6, decay: 0.75, damp: 1.4,
              warble: 1.1, atk: 0.0625, trans: 0.3, transHz: 1300, transQ: 1.8,
              grit: 0.3, gritHz: 900, space: 0.66, room: 1.125, refl: 4,
              dark: 1200, width: 0.75, drive: 0.15, mkup: 1.25, gain: 0.29 },
      jit:  { hz: [62, 124], decay: [0.5, 1], space: [0.5, 0.8], room: [0.875, 1.5],
              refl: [2, 4], dark: [850, 1900], warble: [0.7, 1.8], width: [0.6, 0.95] }
    },
    quest_done: {
      base: { mat: 'bell', hz: 196, modes: 14, bright: 1.15, decay: 3.5, damp: 1.1,
              warble: 2.4, trans: 0.45, transHz: 3400, transQ: 2.2, grit: 0.1,
              gritHz: 2600, space: 0.88, room: 2.875, refl: 4, dark: 3000,
              width: 0.95, drive: 0.1, mkup: 1.35, gain: 0.3 },
      jit:  { hz: [150, 268], decay: [2.75, 4], space: [0.75, 1], room: [2.25, 3],
              dark: [2200, 4200], warble: [1.7, 3], bright: [0.9, 1.7],
              transHz: [2400, 5200] }
    },
    time_pass: {
      base: { mat: 'glass', hz: 340, modes: 7, bright: 1.3, decay: 1.25, damp: 1.7,
              warble: 1.6, atk: 0.125, slide: -9, trans: 0.2, transHz: 4600,
              transQ: 2.6, grit: 0.08, gritHz: 3400, space: 0.42, room: 0.75,
              refl: 2, dark: 2400, width: 0.62, drive: 0.05, mkup: 1.15, gain: 0.24 },
      jit:  { hz: [255, 460], decay: [0.875, 1.75], slide: [-14, -5],
              space: [0.3, 0.55], room: [0.5, 1], dark: [1700, 3400],
              warble: [1.1, 2.4], atk: [0.0625, 0.1875] }
    }
""" + R_END


def cut(s, a, b):
    if a not in s:
        return s, False
    i = s.index(a)
    j = s.index(b) + len(b)
    if s[j:j + 1] == '\n':
        j += 1
    return s[:i] + s[j:], True


def main():
    e = open(ENGINE, encoding='utf8').read()

    # ---- events (idempotent by fence) ------------------------------------
    e, removed = cut(e, E_BEGIN, E_END)
    if removed:
        print('  batch 02 events removed (idempotent re-inject)')
    # RE-INJECT HAS TO SURVIVE ITS OWN LAST RUN. The first inject appends a
    # COMMA to the air_inside line, so a second run looking for the pristine
    # comma-less line finds nothing and dies. Match either shape and normalise.
    base = ("    { ev: 'air_inside',   label: 'INSIDE A BUILDING',    "
            "why: 'a room with nobody in it but you' }")
    if base + ',\n' in e:
        e = e.replace(base + ',\n', base + '\n', 1)
    if base + '\n' not in e:
        print('FAIL: cannot find the end of the EVENTS table')
        return 1
    e = e.replace(base + '\n', base + ',\n' + EVENTS + '\n', 1)

    # ---- recipes ---------------------------------------------------------
    e, removed = cut(e, R_BEGIN, R_END)
    if removed:
        print('  batch 02 recipes removed (idempotent re-inject)')
    # the RECIPE object's closing brace, found by walking from its start so a
    # later '\n  };' in the file can never be mistaken for it
    k = e.index('var RECIPE')
    end = e.index('\n  };\n', k)
    # AND THE SAME RE-INJECT TRAP AS THE EVENTS TABLE, one line down: the first
    # inject adds a COMMA after the last stock recipe, the fence cut takes the
    # recipes back out and leaves that comma behind, and the next run adds a
    # second one -> `},,`. Caught by diffing two consecutive runs rather than by
    # reading, which is the only way this class of drift ever shows up.
    while end > 0 and e[end - 1] == ',':
        e = e[:end - 1] + e[end:]
        end -= 1
    e = e[:end] + ',\n' + RECIPES + e[end:]

    open(ENGINE, 'w', encoding='utf8').write(e)

    # THE EAT WIRE LIVES IN bohemia_sfx_wire_patch.py, WHICH ALREADY OWNS EVERY
    # run-side call site. It was briefly done here as well, and that is exactly
    # the two-tools-one-seam mistake that duplicated two songs earlier today.
    # ONE OWNER. This tool cooks the recipes; the wire patch places the calls,
    # and it is re-run below so the change lands in the built run.

    # ---- rebuild everything that carries a copy --------------------------
    for cmd in (['node', 'tools/build_run_slice.js'],
                ['python3', 'tools/bohemia_sfx_factory.py'],
                ['python3', 'tools/bohemia_sfx_wire_patch.py'],
                ['python3', 'tools/bohemia_sound_mix_patch.py']):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            print('FAIL: %s\n%s' % (' '.join(cmd), (r.stdout + r.stderr)[-900:]))
            return 1

    alpha = open('slices/BOHEMIA_ALPHA_0_9.html', encoding='utf8').read()
    for ev in ('eat', 'sleep', 'talk_start', 'go_inside', 'quest_done', 'time_pass'):
        if "ev: '%s'" % ev not in alpha:
            print('FAIL: %s did not reach the alpha' % ev)
            return 1
    print('BATCH SFX-02 IS COOKED: 6 new moments x 5 candidates = 30 to judge.')
    print('  the bank stays EMPTY for all six until he thumbs one')
    return 0


if __name__ == '__main__':
    sys.exit(main())
