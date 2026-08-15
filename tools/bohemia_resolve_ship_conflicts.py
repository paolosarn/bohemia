#!/usr/bin/env python3
"""
RESOLVE THE TWO CONFLICTS EVERY SHIP HITS (8/15/26, RUN lane).

Main moved eighteen times during one ship today and every rebase produced the
same two conflicts, in the same two files, with the same correct resolution:

  slices/BOHEMIA_ALPHA_0_9.html   the BUILD STAMP. Two lanes each wrote one line.
                                  The answer is never "pick a side": it is TAKE
                                  MAIN'S LINEAGE AND BUMP IT, because letters only
                                  go forward and a stamp that reads older than one
                                  already shipped tells Paolo he is on an older
                                  build than he is. (Seen twice: 8/14 rolled
                                  h -> g, and a lane shipped 8/15d after 8/15f.)

  00_START_HERE_NEXT_SESSION.md   two lanes appended their section at the top.
                                  The answer is ALWAYS KEEP BOTH. A resolution
                                  that deletes the other lane is not a resolution
                                  -- that is the 8/3 failure no_markers_gate.js
                                  exists for, where 162 lines of the COMBAT lane
                                  were mangled by somebody else's merge.

DOING IT BY HAND IS WHAT KEEPS GOING WRONG. Three times this session conflict
markers reached a commit, the last one because I checked the alpha for markers
and not the whole tree. This does both files the same way every time and then
SWEEPS THE WHOLE TREE, so "I checked the file I was thinking about" stops being
a thing that can happen.

TWO RULES LEARNED THE HARD WAY AND ENCODED HERE:

  WRITE FIRST, VERIFY AFTER. An earlier version of this resolver had the date
  '8/11' baked into its regex. Main rolled to 8/12, the regex missed, and it
  threw BEFORE writing anything -- so the rebase carried on with the file still
  full of markers and the markers were committed. Nothing here refuses to write
  because it did not recognise something: unknown shapes are kept verbatim and
  reported, never dropped.

  NO DATE IS EVER HARD-CODED. The stamp pattern reads whatever date main has.

Usage, after a conflicted rebase:
    python3 tools/bohemia_resolve_ship_conflicts.py "MY HEADLINE"
then check the report, `git add -A`, `git rebase --continue`.
"""
import os
import re
import subprocess
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
HANDOFF = '00_START_HERE_NEXT_SESSION.md'
STAMP = re.compile(r'(<div id="buildstamp"[^>]*>)BUILD (\d+/\d+)([a-z]*) - ([^<]*)(</div>)')


def regions(text):
    """Every conflict region as (start, mid, end_line_index) over a line list."""
    lines = text.split('\n')
    out, i = [], 0
    while i < len(lines):
        if lines[i].startswith('<<<<<<< '):
            b = i
            while b < len(lines) and lines[b] != '=======':
                b += 1
            c = b
            while c < len(lines) and not lines[c].startswith('>>>>>>> '):
                c += 1
            if b < len(lines) and c < len(lines):
                out.append((i, b, c))
                i = c + 1
                continue
        i += 1
    return lines, out


def bump(letter):
    if not letter:
        return 'a'
    if letter[-1] == 'z':
        return letter + 'a'
    return letter[:-1] + chr(ord(letter[-1]) + 1)


def resolve_alpha(headline):
    if not os.path.exists(ALPHA):
        return 'no alpha'
    lines, regs = regions(open(ALPHA, encoding='utf-8').read())
    if not regs:
        return 'alpha: no conflict'
    out, prev, notes = [], 0, []
    for (a, b, c) in regs:
        out += lines[prev:a]
        head = '\n'.join(lines[a + 1:b])          # main's side
        m = STAMP.search(head)
        if m:
            new = m.group(1) + 'BUILD ' + m.group(2) + bump(m.group(3)) + ' - ' + headline + m.group(5)
            out.append(re.sub(STAMP, lambda _: new, head, count=1))
            notes.append('stamp ' + m.group(2) + m.group(3) + ' -> ' + m.group(2) + bump(m.group(3)))
        else:
            # NOT A STAMP. Keep BOTH sides verbatim and say so, never drop one.
            out += lines[a + 1:b] + lines[b + 1:c]
            notes.append('alpha: non-stamp conflict KEPT BOTH SIDES, review it')
        prev = c + 1
    out += lines[prev:]
    open(ALPHA, 'w', encoding='utf-8').write('\n'.join(out))
    return '; '.join(notes)


def resolve_handoff():
    if not os.path.exists(HANDOFF):
        return 'no handoff'
    lines, regs = regions(open(HANDOFF, encoding='utf-8').read())
    if not regs:
        return 'handoff: no conflict'
    out, prev = [], 0
    for (a, b, c) in regs:
        out += lines[prev:a]
        head, mine = lines[a + 1:b], lines[b + 1:c]
        out += mine + [''] + head          # BOTH, mine first (my lane's latest)
        prev = c + 1
    out += lines[prev:]
    open(HANDOFF, 'w', encoding='utf-8').write('\n'.join(out))
    return 'handoff: %d region(s), BOTH sides kept' % len(regs)


def sweep():
    """The whole tree, because 'I checked the file I was thinking about' is how
       markers got committed three times this session."""
    try:
        files = subprocess.check_output(['git', 'ls-files'], text=True).split('\n')
    except Exception as e:
        return ['could not list tracked files: ' + str(e)]
    bad = []
    for f in files:
        if not f or not os.path.exists(f):
            continue
        try:
            with open(f, encoding='utf-8', errors='ignore') as fh:
                for line in fh:
                    if line.startswith('<<<<<<< ') or line.startswith('>>>>>>> '):
                        bad.append(f)
                        break
        except Exception:
            pass
    return bad


def main():
    headline = (sys.argv[1] if len(sys.argv) > 1 else 'SHIP').strip()
    print(resolve_alpha(headline))
    print(resolve_handoff())
    bad = sweep()
    if bad:
        print('STILL CONFLICTED (resolve by hand, then re-run):')
        for f in bad:
            print('   ' + f)
        sys.exit(1)
    print('WHOLE TREE SWEPT: no conflict markers in any tracked file')


if __name__ == '__main__':
    main()
