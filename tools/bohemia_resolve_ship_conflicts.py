#!/usr/bin/env python3
"""
BOHEMIA — RESOLVE THE TWO CONFLICTS EVERY PARALLEL SHIP HITS (7/31/26)

REUSE CHECK: cooks nothing, draws nothing, opens no art bank. This is git plumbing.

With this many lanes shipping to main at once, a rebase collides on exactly two files,
every single time, for exactly two reasons:

  00_START_HERE_NEXT_SESSION.md   two lanes each PREPENDED their section
  slices/BOHEMIA_ALPHA_0_9.html   two lanes each bumped #buildstamp

Both have one correct resolution and it is mechanical, so doing it by hand with line
indices is just a chance to lose somebody's handoff. It nearly happened once already
this session: a resolver asserted, the file was left with markers, and the markers got
staged and committed because the next command ran anyway.

  HANDOFF: keep BOTH sides, whole, mine on top. A handoff section is somebody's only
           record of their session. Nothing is ever dropped.
  STAMP:   keep MINE, but advance the date-letter PAST theirs. Two lanes both landing
           "7/31v" is how Paolo ends up unable to tell which build he is on, which is
           the entire reason the stamp exists.

  python3 tools/bohemia_resolve_ship_conflicts.py        # resolve, then git add
  python3 tools/bohemia_resolve_ship_conflicts.py --check  # report only, exit 1 if any
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

HANDOFF = '00_START_HERE_NEXT_SESSION.md'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
STAMP = re.compile(r'BUILD (\d+/\d+)([a-z]+) - ')


def bump(letter):
    """a -> b, z -> aa, az -> ba. NEVER chr(ord('z')+1).

    That is not hypothetical: with this many lanes shipping, 8/1 actually ran past z,
    and the naive increment put "BUILD 8/1{" on main. run_gate caught it -- the stamp
    must be a date-letter and a headline -- but it was live for one push, and a stamp
    Paolo cannot read is the exact failure the stamp law exists to prevent.
    """
    chars = list(letter)
    i = len(chars) - 1
    while i >= 0:
        if chars[i] != 'z':
            chars[i] = chr(ord(chars[i]) + 1)
            return ''.join(chars)
        chars[i] = 'a'
        i -= 1
    return 'a' + ''.join(chars)


def hunks(lines):
    """every conflict as (start, ours_slice, theirs_slice, end_exclusive)"""
    out, i = [], 0
    while i < len(lines):
        if lines[i].startswith('<<<<<<<'):
            mid = end = None
            for j in range(i + 1, len(lines)):
                if lines[j] == '=======' and mid is None:
                    mid = j
                elif lines[j].startswith('>>>>>>>'):
                    end = j
                    break
            if mid is None or end is None:
                raise SystemExit('unterminated conflict at line %d' % (i + 1))
            out.append((i, (i + 1, mid), (mid + 1, end), end + 1))
            i = end + 1
        else:
            i += 1
    return out


def resolve_handoff(lines):
    """keep both sides whole; mine (the rebased commit, i.e. THEIRS in git terms) first"""
    for start, ours, theirs, end in reversed(hunks(lines)):
        a = lines[ours[0]:ours[1]]
        b = lines[theirs[0]:theirs[1]]
        lines[start:end] = b + [''] + a
    return lines


def resolve_stamp(lines):
    """keep my stamp line, but move its letter past whatever landed on main"""
    for start, ours, theirs, end in reversed(hunks(lines)):
        a = '\n'.join(lines[ours[0]:ours[1]])       # what is on main
        b_lines = lines[theirs[0]:theirs[1]]        # mine
        b = '\n'.join(b_lines)
        ma, mb = STAMP.search(a), STAMP.search(b)
        if ma and mb:
            # DATE FIRST, THEN LETTER. Comparing letters alone silently shipped a
            # "7/31w" stamp while main had already rolled over to "8/1a" -- older
            # than what it was replacing, which is worse than not bumping at all.
            date, letter = ma.group(1), ma.group(2)
            if (date, letter) >= (mb.group(1), mb.group(2)):
                nxt = bump(letter)
                b_lines = [STAMP.sub('BUILD %s%s - ' % (date, nxt), l, count=1)
                           if STAMP.search(l) else l for l in b_lines]
                print('   stamp: main is at %s%s, mine advances to %s%s'
                      % (date, letter, date, nxt))
        lines[start:end] = b_lines
    return lines


def run(path, fn, check):
    if not os.path.exists(path):
        return 0
    raw = open(path, encoding='utf8').read()
    lines = raw.split('\n')
    n = len(hunks(lines))
    if not n:
        return 0
    print('%s: %d conflict hunk(s)' % (path, n))
    if check:
        return n
    before = len(raw)
    out = '\n'.join(fn(lines))
    bad = [l for l in out.split('\n')
           if l.startswith('<<<<<<<') or l.startswith('>>>>>>>') or l == '=======']
    if bad:
        raise SystemExit('REFUSING to write %s: %d marker(s) survived' % (path, len(bad)))
    if path == ALPHA and len(out) < before * 0.95:
        raise SystemExit('REFUSING to write %s: it shrank %d -> %d' % (path, before, len(out)))
    open(path, 'w', encoding='utf8').write(out)
    print('   resolved -> %d lines' % out.count('\n'))
    return n


def main():
    check = '--check' in sys.argv
    total = run(HANDOFF, resolve_handoff, check) + run(ALPHA, resolve_stamp, check)
    if not total:
        print('no ship conflicts')
    elif not check:
        print('now: git add %s %s && git rebase --continue' % (HANDOFF, ALPHA))
    return 1 if (check and total) else 0


if __name__ == '__main__':
    sys.exit(main())
