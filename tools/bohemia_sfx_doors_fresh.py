#!/usr/bin/env python3
"""
BOHEMIA - THE DOOR, COOKED FRESH FROM THE MATERIALS THAT WON (8/9/26)

Paolo named DOORS in the minimum demo sound set on 8/9. He killed all ten door
candidates on 7/30. Both of those are true and there is no contradiction:

  GRAVEYARD IS FINAL BINDS CLAUDE, NOT PAOLO. He is the only one who can revive
  his own dead thing, and newest-date-wins. The precedent is the health-bar face
  (8/3), revived by him after being killed -- and the rule that came with it: it
  must NOT be a remake. A fresh cook answers the dead slot.

=== WHAT THE POST-MORTEM ALREADY TOLD US, AND IT IS UNUSUALLY SPECIFIC ======

The 7/30 graveyard entry did not stop at "he said no". It found ONE cause behind
twenty-two deaths:

    METAL AND WOOD DIED. Across the whole batch metal went 3 UP / 12 DOWN and
    wood 0 UP / 5 DOWN, while ash, stone and bell went 25 UP / 0 DOWN and
    crystal 8 UP / 2 DOWN. The only two events wiped out ENTIRELY were DOOR
    OPENS (built from metal) and DOOR SHUTS (built from wood) -- the two events
    whose material was the material that lost.

and a second finding inside the survivors:

    the survivors are consistently BRIGHTER, SHORTER, HARDER-DRIVEN and MORE
    ARTICULATED than the dead ones. He wants sounds that CUT and STOP.

and the instruction, written before anyone knew he would ask for doors again:

    "A future door, when he greenlights one, is a FRESH COOK from a material
    that actually won -- and 'build the door out of metal or wood again' is now
    a documented dead end, not an untried idea."

So this is not a guess. Metal groan and wood thud are barred. The brief is ash
and stone, bright, short, hard-driven, articulated.

=== NEW IDS, ON PURPOSE ====================================================

door_open.0-4 and door_shut.0-4 are listed dead in gates/bohemia_graveyard.txt.
Re-cooking under those exact ids would silently put a NEW sound behind a
registered dead id, which corrupts the one registry the no-remake law depends on.
So these are new events with new ids, and the dead ten stay dead and stay
findable.

=== WHAT A DOOR IS IN THIS WORLD ===========================================

Not a haunted-house creak. This is a dead Las Vegas valley: thirty years of grit
and sun on everything, sand under every sill, frames dried and shrunk. A door
here does not groan on a hinge -- it DRAGS on grit and then STOPS HARD. That is
the same sound the winning materials already make, which is why the material
finding and the world agree:

  DOOR DRAG   ash. the swollen door hauled over sand in the sill. articulated
              into several strikes so it reads as a drag and not a hit, bright,
              gritty, and short enough to end before you notice it.
  DOOR CLACK  stone. the latch and the frame arriving at the same instant. The
              hardest, shortest, most driven sound in this file. It CUTS AND
              STOPS, which is the phrase the post-mortem ends on.

REUSE CHECK: no graphic pixels are cooked here, so no banks/ art bank applies and
none was opened. It opens the existing engine (engine/bohemia_sfx.js), reuses its
MATERIALS, its jitter machinery and its cook()/render() path unchanged, and adds
two recipes. No new synthesis engine, no new bus, no sample.

MECHANISM-MINE / CONTENTS-PAOLO'S: these are CANDIDATES. Nothing is banked and
the game still makes no door sound until he thumbs one. They appear in the MUSIC
tab judge and the soundboard like every other unjudged moment.

Idempotent by REPLACEMENT, never by refusal.

  python3 tools/bohemia_sfx_doors_fresh.py
"""
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ENGINE = 'engine/bohemia_sfx.js'

E_BEGIN = "    /* ---- DOORS, FRESH COOK (8/9/26) -----------------------------------"
E_END = "    /* ---- end fresh doors events ---- */"

EVENTS = E_BEGIN + r"""
       He killed all ten metal/wood doors on 7/30 and named DOORS in the minimum
       demo sound set on 8/9. GRAVEYARD IS FINAL binds me, not him -- and the
       7/30 post-mortem already wrote the brief for the replacement: ash and
       stone won 25 UP / 0 DOWN while metal and wood lost, and the survivors
       were brighter, shorter, harder-driven. NEW IDS so the dead ten stay dead
       and stay findable. */
    { ev: 'door_drag',  label: 'THE DOOR DRAGS OPEN', why: 'thirty years of sand in the sill. it hauls, it does not creak' },
    { ev: 'door_clack', label: 'THE DOOR STOPS DEAD', why: 'latch and frame at the same instant. the sound that CUTS and STOPS' }
""" + E_END

R_BEGIN = "    /* ---- FRESH DOOR RECIPES (8/9/26) ----"
R_END = "    /* ---- end fresh door recipes ---- */"

RECIPES = R_BEGIN + r"""
       ASH and STONE only. Metal and wood are a documented dead end here, not an
       untried idea, and the numbers behind that are in the graveyard. Both are
       cooked BRIGHTER, SHORTER and HARDER-DRIVEN than the ten that died, per
       the same post-mortem. */
    door_drag: {
      base: { mat: 'ash', hz: 174, modes: 5, bright: 1.15, decay: 0.1875, damp: 2.5,
              warble: 0.45, atk: 0, slide: -2, trans: 0.88, transHz: 3600,
              transQ: 1.8, grit: 0.92, gritHz: 2600, space: 0.14, room: 0.1875,
              refl: 1, dark: 2900, width: 0.5, drive: 0.62, mkup: 1.05, gain: 0.34,
              hits: [0, 0.0625, 0.125] },
      jit:  { hz: [138, 232], bright: [0.95, 1.35], decay: [0.125, 0.25],
              transHz: [2800, 5200], grit: [0.82, 0.98], gritHz: [1900, 3600],
              drive: [0.5, 0.78], dark: [2200, 3800], damp: [2.1, 2.9],
              width: [0.4, 0.62] },
      hitSets: [[0, 0.0625, 0.125], [0, 0.0625], [0, 0.0625, 0.125, 0.1875],
                [0, 0.125], [0, 0.0625, 0.125]]
    },
    door_clack: {
      base: { mat: 'stone', hz: 232, modes: 4, bright: 1.3, decay: 0.0625, damp: 2.8,
              warble: 0.3, atk: 0, slide: -6, trans: 0.98, transHz: 5200,
              transQ: 2.2, grit: 0.55, gritHz: 3400, space: 0.1, room: 0.125,
              refl: 1, dark: 3200, width: 0.42, drive: 0.75, mkup: 1.12, gain: 0.4 },
      jit:  { hz: [186, 296], bright: [1.1, 1.55], decay: [0.0625, 0.125],
              transHz: [4200, 7000], grit: [0.42, 0.7], drive: [0.62, 0.9],
              dark: [2600, 4200], slide: [-9, -3], damp: [2.4, 3.2] }
    }
""" + R_END


def cut(text, begin, end):
    if begin not in text:
        return text, False
    i = text.index(begin)
    j = text.index(end) + len(end)
    if text[j:j + 1] == '\n':
        j += 1
    return text[:i] + text[j:], True


def main():
    if not os.path.exists(ENGINE):
        print('FAIL: no engine at %s' % ENGINE)
        return 1
    e = open(ENGINE, encoding='utf8').read()

    # ---- events ----------------------------------------------------------
    e, removed = cut(e, E_BEGIN, E_END)
    if removed:
        print('  fresh door events removed (idempotent re-inject)')
    # THE SAME RE-INJECT TRAP batch 02 documented: the first run leaves a comma
    # on the line it appended to, the fence cut takes the block back out, and a
    # second run looking for the pristine comma-less line finds nothing. Match
    # either shape and normalise before appending.
    base = ("    { ev: 'time_pass',  label: 'HOURS GO BY',        "
            "why: 'time spent standing still. the only sound here that moves in pitch' }")
    if base + ',\n' in e:
        e = e.replace(base + ',\n', base + '\n', 1)
    if base + '\n' not in e:
        print('FAIL: cannot find the end of the EVENTS table')
        return 1
    e = e.replace(base + '\n', base + ',\n' + EVENTS + '\n', 1)

    # ---- recipes ---------------------------------------------------------
    e, removed = cut(e, R_BEGIN, R_END)
    if removed:
        print('  fresh door recipes removed (idempotent re-inject)')
    k = e.index('var RECIPE')
    end = e.index('\n  };\n', k)
    while end > 0 and e[end - 1] == ',':
        e = e[:end - 1] + e[end:]
        end -= 1
    e = e[:end] + ',\n' + RECIPES + e[end:]

    open(ENGINE, 'w', encoding='utf8').write(e)
    print('THE DOOR IS COOKED FROM THE MATERIALS THAT WON.')
    print('  door_drag  ash    the swollen door hauled over sand, articulated')
    print('  door_clack stone  latch and frame together. it cuts and it stops')
    print('  NEW IDS: the ten metal/wood doors he killed stay dead and findable')
    print('  nothing banked -- the game still makes no door sound until he thumbs one')

    # the factory owns the surface these appear on; re-run it so they reach the
    # MUSIC tab in the same pass rather than waiting for somebody to notice.
    for dep in ('tools/bohemia_sfx_factory.py',
                'tools/bohemia_sfx_wire_patch.py',
                'tools/bohemia_voice_patch.py'):
        r = subprocess.run([sys.executable, dep], capture_output=True, text=True)
        if r.returncode != 0:
            print('FAIL: %s could not re-apply after the door cook:' % dep)
            print(r.stdout[-800:])
            print(r.stderr[-800:])
            return 1
        print('  re-applied %s' % dep)
    return 0


if __name__ == '__main__':
    sys.exit(main())
