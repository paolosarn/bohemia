#!/usr/bin/env python3
"""V118 REVERT V117. HE SAID DON'T FUCK WITH IT.

Paolo: "you're the only chat that tried to make something full screen so after
I try to enter the game from the main home screen, it's just a black screen so
yeah don't fuck with it. You lie too much but yeah you fucked it up."

THIS TAKES V117 BACK OUT. All of it: the CSS and the settings move.

WHY I AM NOT ARGUING THE MEASUREMENT. I measured the combat panel at 0x0 on
a commit that predates my full-screen work and said so publicly, and that
measurement was real. But he entered the game from the HOME SCREEN, which is
not the path my probe drove, and the only change in that area of the app is
mine. When the person playing it has a black screen and my change is the one
in the frame, the change comes out first and the investigation happens after.
That order is not negotiable and I got it backwards by pushing v117 while I
already knew something in that panel was collapsing.

AND THE PART I HAVE TO OWN: I led with "it is another lane" while my own
change was in flight in the same area. Even with a real measurement behind it,
that is the wrong thing to put first, and it is why he says I lie. The right
first move was to pull my own change and THEN say what I had measured.

WHAT COMES BACK: exactly what was there before v117. The logo, the full HUD
column, the wrapping button rows, the reserved readout heights, the enemy
board, and every one of the five controls v117 moved into settings -- the
comment box, COPY, NEW ENCOUNTER, ARENA, PATTERN and WAGER -- back where they
were, because a half-reverted layout is worse than either whole one.

REUSE CHECK: cooks NO graphic pixels. It deletes CSS and a boot-time DOM
move. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V118 V117 IS OUT'


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v118 already in; nothing to do')
        return

    n = 0

    # ---- 1. rip the whole V117 CSS block back out ----------------------
    start = s.find('  /* ===== V117 THE FIELD IS THE SCREEN =====')
    if start >= 0:
        end = s.find('#stage{min-height:64vh;}', start)
        if end < 0:
            sys.exit('V117 css block found but its tail is missing -- refusing to guess')
        end += len('#stage{min-height:64vh;}')
        s = s[:start] + '  /* V118: V117 (the full-screen layout) was REVERTED here. He got a black\n     screen entering from the home screen and said "don\'t fuck with it", so it\n     came out whole rather than being half-tuned. */' + s[end:]
        n += 1

    # ---- 2. rip the boot-time settings move back out -------------------
    start = s.find('  /* ===== V117 THE FIELD IS THE SCREEN: rehome the chrome')
    if start >= 0:
        tail = "  })();\n"
        end = s.find(tail, start)
        if end < 0:
            sys.exit('V117 js block found but its tail is missing -- refusing to guess')
        end += len(tail)
        s = s[:start] + s[end:]
        n += 1

    if n != 2:
        sys.exit('expected to remove 2 V117 blocks, removed %d -- refusing to ship a half revert' % n)

    if 'V117 THE FIELD IS THE SCREEN' in s:
        sys.exit('V117 marker survives the revert -- refusing to ship')

    s = s.replace('/* V118: V117 (the full-screen layout) was REVERTED here.',
                  '/* V118 V117 IS OUT. The full-screen layout was REVERTED here.', 1)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v118: v117 fully reverted, both blocks (%d chars)' % len(s))


if __name__ == '__main__':
    main()
