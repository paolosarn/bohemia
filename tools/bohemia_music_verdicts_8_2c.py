#!/usr/bin/env python3
"""
BOHEMIA - HIS 8/2 MUSIC VERDICTS, THIRD SITTING (batch 23 judged). 0 OF 2.

  NOBODY LOCKS UP ANYMORE     DOWN   (lead SPLINTERBELL)
  WHAT THE METER STILL READS  DOWN   (lead ONEBREATH)

THE THEORY THIS BATCH WAS BUILT ON IS DEAD, and that is the whole point of
having named it in public before he judged it.

Batch 23 was cooked on the PITCH-STABILITY reading: across the seven songs he
had judged, every survivor articulated a stable pitch and every casualty was
built on instability, so both leads here were built to articulate. He killed
both. The tally is now 3 survivors against 6 casualties, and the two songs
DESIGNED to satisfy the theory are in the second group. A rule that predicts
success and then produces two failures is not a rule.

That is TWO of my theories dead in one day (semitone adjacency on 8/2 morning,
pitch stability on 8/2 night). The honest conclusion is not a third theory: it
is that I cannot currently predict what he likes from the corpus, and the only
thing in the record that is actually his is the sentence he wrote about the one
song he loved. Whoever cooks music next should start from THAT and stop
reverse-engineering the kills.

AND NOTHING IS BEING COOKED TO REPLACE THEM THIS TURN. The graveyard says fresh
cooks answer the slots; STOP PRODUCING (7/26) says a second rejection ends the
feature for the session, and this is the second rejection of this session's cook
approach. He also said "Lets work on sfx now pls" in the same breath. The slots
stay open, recorded, for a session that has something new to say.

SONG-DEAD-NOT-VOICES (7/20): splinterbell and onebreath are NOT dead. Both are
newborn topologies with one fashion each. They stay in the rack, legal.

  python3 tools/bohemia_music_verdicts_8_2c.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

DOWN = ['NOBODY LOCKS UP ANYMORE', 'WHAT THE METER STILL READS']
CANON_NEW = []

# NEW_VIBES goes EMPTY, and that is correct rather than a hole: the NEW badge
# means "cooked and not yet judged", and after this sitting there is nothing in
# the build he has not ruled on. Leaving the last survivor badged NEW would tell
# him something untrue about his own queue.
NEW_VIBES = []


def main():
    s = open(ALPHA, encoding='utf8').read()
    orig = s

    m = re.search(r'const CANON_DEFAULTS=\{(.*?)\};', s, re.S)
    if not m:
        print('FAIL: CANON_DEFAULTS not found')
        return 1
    pairs = dict(re.findall(r"'([^']+)':(-?\d+)", m.group(1)))
    for n in CANON_NEW:
        pairs[n + '#1'] = '2'
    for n in DOWN:
        pairs[n + '#1'] = '0'
    rebuilt = ','.join("'%s':%s" % (k, v) for k, v in pairs.items())
    s = s[:m.start()] + 'const CANON_DEFAULTS={' + rebuilt + '};' + s[m.end():]

    # dead songs leave the working list (graveyard final). Rebuild from parsed
    # entries so a stray comma cannot leave an array hole.
    i0 = s.index('const MLOOPS=[')
    j0 = s.index('\n];', i0)
    head = 'const MLOOPS=['
    entries = [ln.strip().rstrip(',') for ln in s[i0 + len(head):j0].split('\n')
               if ln.strip().startswith("{n:'")]
    kept = [e for e in entries if e.split("'")[1] not in DOWN]
    cut = [e.split("'")[1] for e in entries if e.split("'")[1] in DOWN]
    s = s[:i0] + head + '\n ' + ',\n '.join(kept) + s[j0:]
    if cut:
        print('  removed %d dead song(s) from MLOOPS: %s' % (len(cut), ', '.join(cut)))

    # prune category tags whose song is no longer in MLOOPS
    m = re.search(r'const CAT_DEFAULTS=\{(.*?)\};', s, re.S)
    cur = dict(re.findall(r"'([^']+)':\[([^\]]*)\]", m.group(1)))
    live = set(re.findall(r"\{n:'([^']+)'", s[s.index('const MLOOPS=['):]))
    dropped = [k for k in cur if k.rsplit('#', 1)[0] not in live]
    for k in dropped:
        del cur[k]
    if dropped:
        print('  pruned %d tag(s): %s' % (len(dropped), ', '.join(sorted(dropped))))
    rebuilt = ',\n '.join("'%s':[%s]" % (k, v) for k, v in sorted(cur.items()))
    s = s[:m.start()] + 'const CAT_DEFAULTS={\n ' + rebuilt + '};' + s[m.end():]

    m = re.search(r'const NEW_VIBES=\[[^\]]*\];', s)
    s = s[:m.start()] + 'const NEW_VIBES=[' + \
        ','.join("'" + n + "'" for n in NEW_VIBES) + '];' + s[m.end():]

    entry = (
        '=== BATCH 23 VERDICT (8/2/26) - 0 OF 2, AND THE THEORY DIED WITH THEM ===\n'
        'DOWN  NOBODY LOCKS UP ANYMORE (splinterbell) and WHAT THE METER STILL READS\n'
        '      (onebreath). Both leads LIVE per SONG-DEAD-NOT-VOICES (7/20).\n'
        'Batch 23 was cooked on the PITCH-STABILITY theory and said so in advance.\n'
        'Both songs were built to satisfy it and both died, so the theory is dead:\n'
        '3 survivors, 6 casualties, and the two designed-to-fit songs are casualties.\n'
        'That is two of my theories killed in one day. The next cook should stop\n'
        'reverse-engineering the kills and start from the only thing that is HIS:\n'
        '"The marker on the door at full intensity is now one of my new favorite\n'
        'songs that you have made great job". NEW_VIBES is empty because nothing in\n'
        'the build is unjudged. The two slots stay open. NO REMAKES.\n'
        '\n')
    anchor = '<script type="text/plain" id="BOHEMIA_MUSIC_REPO">\n'
    if '=== BATCH 23 VERDICT (8/2/26)' not in s:
        s = s.replace(anchor, anchor + entry, 1)

    if s == orig:
        print('nothing changed')
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('HIS BATCH 23 VERDICTS ARE BAKED.')
    print('  BURIED ' + ', '.join(DOWN))
    print('  NEW_VIBES is empty: nothing in the build is unjudged')
    return 0


if __name__ == '__main__':
    sys.exit(main())
