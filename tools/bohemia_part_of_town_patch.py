#!/usr/bin/env python3
"""
BOHEMIA - THE MAP PLAYS THE PART OF TOWN YOU ARE IN, INTO THE GAME (SOUNDS 10/26/26, row [the map plays the part of town you
are in], rule 237; amends rule 122's fence for the faction songs only).

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  __THE_PART_OF_TOWN__: engine/bohemia_part_of_town.js inlined verbatim (the gate holds it byte for byte) and one line that
  installs it over the music already there (SONGFENCE, CITYMUS, INTENSITY, MUS), after __THE_SONGS_GO_IN__ so the thirteen's
  recordings and the ladder are in place first. Nothing in the map's file changes: the map already reports where the party is
  every four seconds (BOHEMIA_WHERE) and already knows whose ground every cell is (turfAt); the shell asks it, same origin.

Idempotent: the block sits between markers and is replaced on a re-run.
  python3 tools/bohemia_part_of_town_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_part_of_town.js')
START = '<!-- __THE_PART_OF_TOWN__ (SOUNDS 10/26, rule 237) -->\n<script>\n'
END = '</script>\n<!-- /__THE_PART_OF_TOWN__ -->\n'
ANCHOR = '<!-- /__THE_SONGS_GO_IN__ -->\n'
GLUE = """/* ---- __THE_PART_OF_TOWN__: installed over the music already here (tools/bohemia_part_of_town_patch.py) ---- */
try { if (window.BOH_PART_OF_TOWN && window.SONGFENCE && window.CITYMUS) BOH_PART_OF_TOWN.install(window); } catch (e) { window.__PART_OF_TOWN_ERR = String(e && e.message || e); }
"""


def main():
    s = open(ALPHA, encoding='utf-8').read()
    body = ('/* ==== inlined verbatim from %s (the gate holds it byte for byte) ==== */\n' % os.path.relpath(ENGINE, ROOT)
            + open(ENGINE, encoding='utf-8').read().rstrip() + '\n' + GLUE)
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END)
        s = s[:a] + START + body + END + s[b:]
    else:
        if s.count(ANCHOR) != 1:
            print('THE PART OF TOWN PATCH: anchor found %d times' % s.count(ANCHOR)); sys.exit(1)
        s = s.replace(ANCHOR, ANCHOR + START + body + END)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('THE PART OF TOWN PATCH: the alpha carries it (%d bytes)' % len(body))


if __name__ == '__main__':
    main()
