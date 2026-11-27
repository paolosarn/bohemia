#!/usr/bin/env python3
"""
BOHEMIA - EVERY SONG IN TURN (SOUNDS THREE 11/27/26, rule 488(c): the rotation plays them all, no song twice in a row,
the least-played next).

Puts engine/bohemia_every_song_in_turn.js in the alpha and the demo, byte for byte, between its markers, after
__THE_PART_OF_TOWN__ (it wraps the fence's pick and the part of town's fight song, so both must stand first), and puts one
line at the top of the street's pick (CITYMUS.pick) and the opening's (MENUMUS.pick): when SONGTURN stands, it chooses.
Every other caller (THE SONGS GO IN's queue a phrase early, the song after the battle, the part of town) already goes
through CITYMUS.pick, so one line there is the whole street.

Idempotent: a re-run replaces the block and leaves the lines as they are.
  python3 tools/bohemia_sounds_every_song_in_turn_patch.py
Gate: gates/every_song_in_turn_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHELLS = [os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), os.path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html')]
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_every_song_in_turn.js')
START = '<!-- __EVERY_SONG_IN_TURN__ (SOUNDS THREE 11/27, rule 488) -->\n<script>\n'
END = '</script>\n<!-- /__EVERY_SONG_IN_TURN__ -->\n'
AFTER = '<!-- /__THE_PART_OF_TOWN__ -->\n'
TAIL = ('/* ---- __EVERY_SONG_IN_TURN__: installed over the music already here (tools/bohemia_sounds_every_song_in_turn_patch.py) ---- */\n'
        'try { if (window.BOH_EVERY_SONG_IN_TURN) BOH_EVERY_SONG_IN_TURN.install(window); } catch (e) { window.__EVERY_SONG_IN_TURN_ERR = String(e && e.message || e); }\n')
HOOK = ' if(window.SONGTURN&&SONGTURN.choose)return SONGTURN.choose(cs);   /* __EVERY_SONG_IN_TURN__ (SOUNDS THREE 11/27, rule 488(c)): least played first, never twice in a row */'
PICKS = [('const CITYMUS={', '  pick(){ let cs=this.candidates(); if(!cs.length)return null;'),
         ('const MENUMUS={', '  pick(){ const cs=this.candidates(); if(!cs.length)return null;')]


def die(m):
    print('EVERY SONG IN TURN PATCH: ' + m)
    sys.exit(1)


def main():
    body = open(ENGINE, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    block = START + '/* ==== inlined verbatim from engine/bohemia_every_song_in_turn.js (the gate holds it byte for byte) ==== */\n' + body + TAIL + END
    for p in SHELLS:
        s = open(p, encoding='utf-8').read()
        if START in s:
            a = s.index(START)
            b = s.index(END, a) + len(END)
            s = s[:a] + block + s[b:]
        else:
            if s.count(AFTER) != 1:
                die(os.path.basename(p) + ': the part of town\'s end marker found %d times' % s.count(AFTER))
            s = s.replace(AFTER, AFTER + block)
        for obj, line in PICKS:
            o = s.index(obj)
            i = s.index(line, o)
            if s[i + len(line):i + len(line) + len(HOOK)] != HOOK:
                if HOOK in s[o:i + 4000]:
                    die(os.path.basename(p) + ': ' + obj + ' carries the hook somewhere else')
                s = s[:i + len(line)] + HOOK + s[i + len(line):]
        open(p, 'w', encoding='utf-8').write(s)
        print('patched ' + os.path.basename(p))


if __name__ == '__main__':
    main()
