#!/usr/bin/env python3
"""
BOHEMIA - THE SONG AFTER THE BATTLE IS ONE OF HIS (SOUNDS 10/25/26, row [the PC playtest: the sound's part], rule 164
item 23; rule 122). Paolo on his PC, 10/24: the song after a battle 'so bad, so terrible'.

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  __THE_SONG_AFTER_THE_BATTLE__: tools/bohemia_sounds_the_song_after_the_battle_block.js inlined verbatim, right after the
  song fence (__ONE_SONG_ONLY__): STING's 'win' and 'loss' synth figures never play; at the top of the next bar one of HIS
  songs takes the transport (never the fight's own); the job's synth figures are held while the battle's aftermath is up.
Idempotent: the block sits between markers and is replaced on a re-run.
  python3 tools/bohemia_sounds_the_song_after_the_battle_patch.py [--stamp 'BUILD 10/25a - ...']
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
BLOCK = os.path.join(ROOT, 'tools', 'bohemia_sounds_the_song_after_the_battle_block.js')
START = '<!-- __THE_SONG_AFTER_THE_BATTLE__ (SOUNDS 10/25, rule 164) -->\n<script>\n'
END = '</script>\n<!-- /__THE_SONG_AFTER_THE_BATTLE__ -->\n'
ANCHOR = '<!-- /__ONE_SONG_ONLY__ -->\n'


def die(msg):
    print('THE SONG AFTER THE BATTLE PATCH: ' + msg); sys.exit(2)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    block = START + open(BLOCK, encoding='utf-8').read().rstrip() + '\n' + END
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END)
        s = s[:a] + block + s[b:]
    else:
        if s.count(ANCHOR) != 1: die('the fence\'s end %r is not in the alpha exactly once' % ANCHOR.strip())
        s = s.replace(ANCHOR, ANCHOR + block)
    stamp = None
    if '--stamp' in sys.argv:
        stamp = sys.argv[sys.argv.index('--stamp') + 1]
        n = len(re.findall(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', s))
        if n != 1: die('found %d build stamps' % n)
        s = re.sub(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', lambda m: m.group(1) + stamp + m.group(2), s)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('THE SONG AFTER THE BATTLE PATCH: the block in the alpha after the song fence%s' % ((', stamp ' + stamp) if stamp else ''))


if __name__ == '__main__':
    main()
