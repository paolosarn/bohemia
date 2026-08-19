#!/usr/bin/env python3
"""
BOHEMIA — BURY THE DEAD SONGS (8/19/26). GRAVEYARD IS FINAL, applied to music.

REUSE CHECK: cooks nothing. It opens no bank and draws no pixel and writes no
note; it reads the death notices that are ALREADY in the alpha's embedded music
repo and makes the rest of the file agree with them. The only "new" thing it
produces is a tombstone line in gates/bohemia_graveyard.txt, which is a record,
not content.

WHAT WAS WRONG
The embedded music repo marks a killed song with its own line:

    /* GRAVEYARD (down 7/8, no remake): THE CHOIR THAT STAYED */

Seven songs carry that line and were never actually buried. They are still in
MLOOPS, the live working list, and CANON_DEFAULTS still has them at 2 -- which
is CANON, the top weight. And THE CHOIR THAT STAYED is tagged OVERWORLD NIGHT,
which is the phase the valley ships in, so a song Paolo killed on 7/8 has been
one of the most likely tracks to play in the streets ever since.

Nothing caught it because nothing could: the deaths were written in a COMMENT
inside the alpha and never given a line in gates/bohemia_graveyard.txt, so the
graveyard gate had no token to look for. A law is only as enforced as its
registry is complete. tools/bohemia_music_verdicts_8_2.py already had the right
shape for this -- bury at 0, drop from the working list, prune the tag -- it was
just never pointed at the 7/8 batch.

WHAT IT DOES, all three halves, because any one alone leaves it half-dead:
  1. CANON_DEFAULTS[name] = 0     the play pools filter on 0
  2. out of MLOOPS                the working list holds no corpses
  3. CAT_DEFAULTS tag pruned      a tag nominates a song for a pool
  4. a line in the registry       so graveyard_gate can see it forever

WHAT IT DOES NOT DO: touch the voices. Batch 6's death notices kill the SONGS
and say nothing about retiring their voices, and the repo is explicit elsewhere
when a voice dies with its song ("ironlung voice retired with it") or when it
does not ("scrapchime voice LIVES"). Reading silence as a retirement would kill
chapelbreath and ghostvox, which the SFX engine is using right now. A mention is
not a use, and an absence is not a ruling.

  python3 tools/bohemia_music_bury_the_dead.py           # report only
  python3 tools/bohemia_music_bury_the_dead.py --write   # bury them
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
REGISTRY = 'gates/bohemia_graveyard.txt'

# The one shape that is a death notice and nothing else. Deliberately NOT
# "any line mentioning the word graveyard": the repo says "GRAVEYARD" inside
# VARIETY LAW prose, inside batch summaries that list SURVIVORS, and inside a
# note about a song being PROMOTED whose old arrangement became the graveyard
# record. A checker that cannot tell those apart from a kill is the broken one.
NOTICE = re.compile(r'/\*\s*[^\w\s]*\s*GRAVEYARD\s*\(down [^)]*\):\s*(.+?)\s*\*/')


def dead_names(src):
    head = src[:src.index('const MLOOPS=[')]
    return sorted({m.group(1).strip() for m in NOTICE.finditer(head)})


def main():
    write = '--write' in sys.argv
    s = open(ALPHA, encoding='utf8').read()
    dead = dead_names(s)
    print('=== BURY THE DEAD SONGS — %d death notices in the embedded repo ===' % len(dead))

    i0 = s.index('const MLOOPS=[')
    j0 = s.index('\n];', i0)
    live = set(re.findall(r"\{n:'([^']+)'", s[i0:j0]))
    m = re.search(r'const CANON_DEFAULTS=\{(.*?)\};', s, re.S)
    pairs = dict(re.findall(r"'([^']+)':(-?\d+)", m.group(1)))

    walking = [n for n in dead if n in live or pairs.get(n + '#1') == '2']
    for n in dead:
        flag = ''
        if n in live:
            flag += ' STILL IN THE WORKING LIST'
        if pairs.get(n + '#1') == '2':
            flag += ' BAKED CANON'
        print('  %-34s %s' % (n[:34], flag.strip() or 'buried'))
    if not walking:
        print('  every killed song is out of the list and buried at 0.')
        return 0
    print('  %d ARE STILL WALKING.' % len(walking))
    if not write:
        print('\n(--write to bury them)')
        return 1

    # 1. bury the verdict
    for n in walking:
        pairs[n + '#1'] = '0'
    rebuilt = ','.join("'%s':%s" % (k, v) for k, v in pairs.items())
    s = s[:m.start()] + 'const CANON_DEFAULTS={' + rebuilt + '};' + s[m.end():]

    # 2. out of the working list. REBUILT FROM PARSED ENTRIES, never cut with a
    # pattern: a regex delete leaves the neighbouring comma behind and `},\n,\n{`
    # is an EMPTY SLOT, which is the hole that crashed MLOOPS[130] on 8/2.
    i0 = s.index('const MLOOPS=[')
    j0 = s.index('\n];', i0)
    head = 'const MLOOPS=['
    body = s[i0 + len(head):j0]
    entries = [ln.strip().rstrip(',') for ln in body.split('\n')
               if ln.strip().startswith("{n:'")]
    kept = [e for e in entries if e.split("'")[1] not in walking]
    print('  MLOOPS %d -> %d' % (len(entries), len(kept)))
    s = s[:i0] + head + '\n ' + ',\n '.join(kept) + s[j0:]

    # 3. a tag nominates a song for a play pool, so a tag on a corpse is the
    #    defect wearing a different hat
    m2 = re.search(r'const CAT_DEFAULTS=\{(.*?)\};', s, re.S)
    cur = dict(re.findall(r"'([^']+)':\[([^\]]*)\]", m2.group(1)))
    livenow = set(re.findall(r"\{n:'([^']+)'", s[s.index('const MLOOPS=['):]))
    dropped = [k for k in cur if k.rsplit('#', 1)[0] not in livenow]
    for k in dropped:
        del cur[k]
    if dropped:
        print('  pruned %d tag(s) pointing at a song no longer in MLOOPS: %s'
              % (len(dropped), ', '.join(sorted(dropped))))
    rb = ',\n '.join("'%s':[%s]" % (k, v) for k, v in sorted(cur.items()))
    s = s[:m2.start()] + 'const CAT_DEFAULTS={\n ' + rb + '};' + s[m2.end():]

    open(ALPHA, 'w', encoding='utf8').write(s)

    # 4. the registry, so the graveyard gate can see them from now on
    reg = open(REGISTRY, encoding='utf8').read()
    add = []
    for n in walking:
        if n.upper() in reg.upper():
            continue
        add.append("n:'%s'    | 7/8/26 | DOWN (batch 6/7 horror). GRAVEYARD FINAL, no remake. "
                   "Buried in code 8/19/26: the kill was only ever a COMMENT in the alpha's "
                   "music repo, so this song sat in MLOOPS baked CANON for six weeks and "
                   "THE CHOIR THAT STAYED was tagged OVERWORLD NIGHT and actually playing. "
                   "Its VOICES are NOT retired -- batch 6 killed songs, not voices." % n)
    if add:
        if not reg.endswith('\n'):
            reg += '\n'
        reg += ('\n# --- MUSIC, BURIED IN CODE 8/19/26 (tools/bohemia_music_bury_the_dead.py).\n'
                '# Each of these already had a death notice inside the alpha and none of them\n'
                '# had a line here, which is why the graveyard gate never saw them.\n'
                + '\n'.join(add) + '\n')
        open(REGISTRY, 'w', encoding='utf8').write(reg)
        print('  wrote %d tombstone(s) into %s' % (len(add), REGISTRY))
    print('  buried: %s' % ', '.join(walking))
    return 0


if __name__ == '__main__':
    sys.exit(main())
