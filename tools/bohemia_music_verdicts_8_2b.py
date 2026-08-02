#!/usr/bin/env python3
"""
BOHEMIA — HIS 8/2 MUSIC VERDICTS, SECOND SITTING (batch 22 judged)

He judged batch 22 the same day he judged 21. One of three lived:

  A BELL FOR NOBODYS SHIFT   DOWN    (lead SALTPSALM)
  THE MARKER ON THE DOOR     CANON   (lead BROKENROSARY)   -> OVERWORLD DAY
  COUNTING WHAT IS LEFT      DOWN    (lead TOLLHOUSE)

AND HE SAID SOMETHING HE HAS NOT SAID ONCE THIS SESSION, so it is recorded
verbatim everywhere a future cook will look:

  "The marker on the door at full intensity is now one of my new favorite songs
   that you've made great job"

That is the first stated POSITIVE ruling on a cooked song in this whole run.
Every other verdict has been a thumb with no words. It is worth more than the
two kills: it names an intensity (FULL) and a lead (brokenrosary) that he
actually likes, which is a target instead of a warning.

WHAT "PROCESSING A VERDICT PASTE" MEANS, unchanged from the 8/2 first sitting:
canon baked into defaults, downs BURIED (0 in CANON_DEFAULTS and OUT of MLOOPS,
because GRAVEYARD IS FINAL means out of the working list too), categories baked,
kill reasons logged when given. He gave none this time either, so none are
invented -- the graveyard post-mortem says what I OBSERVE and labels itself an
inference.

SONG-DEAD-NOT-VOICES (Paolo 7/20): saltpsalm and tollhouse are NOT dead. Both
are newborn topologies with exactly one fashion each, and the law keeps voices
alive for future songs. They stay in the rack, ledgered, legal.

Idempotent: rebuilds the same four tables rather than stacking, and rebuilds
MLOOPS from PARSED ENTRIES so an array hole cannot be created by a stray comma.

  python3 tools/bohemia_music_verdicts_8_2b.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- his sheet, batch 22 ---------------------------------------------------
DOWN = ['A BELL FOR NOBODYS SHIFT', 'COUNTING WHAT IS LEFT']
CANON_NEW = ['THE MARKER ON THE DOOR']

# NEW_VIBES = the survivor. It keeps the NEW badge until the next cook answers
# the slots these two kills opened.
NEW_VIBES = CANON_NEW

# Only the delta. The 8/2 first-sitting tool baked the other 37 assignments and
# this tool merges onto whatever is already in the file, so re-listing them
# would only create a second place for the same truth to rot.
CATS = {'THE MARKER ON THE DOOR': 'OVERWORLD DAY'}

HIS_WORDS = ("The marker on the door at full intensity is now one of my new "
             "favorite songs that you've made great job")


def main():
    s = open(ALPHA, encoding='utf8').read()
    orig = s

    # ---- 1. CANON_DEFAULTS: approval in, downs BURIED at 0 ----------------
    m = re.search(r'const CANON_DEFAULTS=\{(.*?)\};', s, re.S)
    if not m:
        print('FAIL: CANON_DEFAULTS not found')
        return 1
    pairs = dict(re.findall(r"'([^']+)':(-?\d+)", m.group(1)))
    for n in CANON_NEW:
        pairs[n + '#1'] = '2'
    for n in DOWN:
        pairs[n + '#1'] = '0'        # 0 is what every play pool filters on
    rebuilt = ','.join("'%s':%s" % (k, v) for k, v in pairs.items())
    s = s[:m.start()] + 'const CANON_DEFAULTS={' + rebuilt + '};' + s[m.end():]

    # ---- 1b. DEAD SONGS LEAVE THE WORKING LIST ---------------------------
    i0 = s.index('const MLOOPS=[')
    j0 = s.index('\n];', i0)
    head = 'const MLOOPS=['
    entries = [ln.strip().rstrip(',') for ln in s[i0 + len(head):j0].split('\n')
               if ln.strip().startswith("{n:'")]
    kept = [e for e in entries if e.split("'")[1] not in DOWN]
    cut = [e.split("'")[1] for e in entries if e.split("'")[1] in DOWN]
    s = s[:i0] + head + '\n ' + ',\n '.join(kept) + s[j0:]
    if cut:
        print('  removed %d dead song(s) from MLOOPS (graveyard final): %s'
              % (len(cut), ', '.join(cut)))

    # ---- 2. CAT_DEFAULTS: the survivor gets its pool ----------------------
    m = re.search(r'const CAT_DEFAULTS=\{(.*?)\};', s, re.S)
    if not m:
        print('FAIL: CAT_DEFAULTS not found')
        return 1
    cur = dict(re.findall(r"'([^']+)':\[([^\]]*)\]", m.group(1)))
    for song, cat in CATS.items():
        cur[song + '#1'] = "'" + cat + "'"
    # PRUNE tags whose song is no longer in MLOOPS. A tag on a dead song
    # nominates a corpse for a play pool -- that is what the combat-pool gate
    # caught when WIND THROUGH THE COUNTING HOUSE got baked from a stale export
    # line. GRAVEYARD IS FINAL, applied to categories too.
    live = set(re.findall(r"\{n:'([^']+)'", s[s.index('const MLOOPS=['):]))
    dropped = [k for k in cur if k.rsplit('#', 1)[0] not in live]
    for k in dropped:
        del cur[k]
    if dropped:
        print('  pruned %d tag(s) for songs no longer in MLOOPS: %s'
              % (len(dropped), ', '.join(sorted(dropped))))
    rebuilt = ',\n '.join("'%s':[%s]" % (k, v) for k, v in sorted(cur.items()))
    s = s[:m.start()] + 'const CAT_DEFAULTS={\n ' + rebuilt + '};' + s[m.end():]

    # ---- 3. NEW_VIBES = the survivor --------------------------------------
    m = re.search(r'const NEW_VIBES=\[[^\]]*\];', s)
    s = s[:m.start()] + 'const NEW_VIBES=[' + \
        ','.join("'" + n + "'" for n in NEW_VIBES) + '];' + s[m.end():]

    # ---- 4. the embedded repo carries his words --------------------------
    entry = (
        '=== BATCH 22 VERDICT (8/2/26) — 1 OF 3 LIVED ===\n'
        'CANON  THE MARKER ON THE DOOR (lead brokenrosary, rhythm inside one note)\n'
        'DOWN   A BELL FOR NOBODYS SHIFT (saltpsalm) · COUNTING WHAT IS LEFT (tollhouse)\n'
        'CATEGORY  THE MARKER ON THE DOOR -> OVERWORLD DAY\n'
        'HIS WORDS, VERBATIM: "' + HIS_WORDS + '"\n'
        'That is the first stated positive ruling on a cooked song this run. FULL\n'
        'INTENSITY is the setting he named; brokenrosary is the lead he named.\n'
        'Both dead leads LIVE per SONG-DEAD-NOT-VOICES (7/20). No remakes.\n'
        '\n')
    anchor = '<script type="text/plain" id="BOHEMIA_MUSIC_REPO">\n'
    if '=== BATCH 22 VERDICT (8/2/26)' not in s:
        s = s.replace(anchor, anchor + entry, 1)

    if s == orig:
        print('nothing changed')
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('HIS BATCH 22 VERDICTS ARE BAKED.')
    print('  CANON  ' + ', '.join(CANON_NEW))
    print('  BURIED ' + ', '.join(DOWN))
    print('  cat    THE MARKER ON THE DOOR -> OVERWORLD DAY')
    print('  NEW_VIBES = the survivor')
    return 0


if __name__ == '__main__':
    sys.exit(main())
