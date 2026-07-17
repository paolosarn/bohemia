#!/usr/bin/env python3
"""BOHEMIA QUESTBOOK EXTRACTOR — batch appender (7/17/26)

BATCH LAW: "The corpus is a database, not a pile. The extraction is
machine-generated from the .md corpus. It is never hand-maintained."

The dead chat's full regenerator did not survive into the repo (named failure,
7/17). This tool is the working half: given file numbers, it machine-parses
those dives and APPENDS their findings to the masters, updating the header
counts. It never rewrites the historical sections, so nothing the old
generator wrote can drift. Full-regen parity is a standing job.

Run from repo root: python3 tools/bohemia_questbook_extract.py 139 140 141
Idempotent per batch: refuses to append a file number already present.
"""
import os
import re
import sys

QB = 'questbook'
CRAFT = os.path.join(QB, 'BOHEMIA_CRAFT_MASTER_7_16_26.txt')
FLAWS = os.path.join(QB, 'BOHEMIA_FLAWS_MASTER_7_16_26.txt')
PORTS = os.path.join(QB, 'BOHEMIA_PORTS_MASTER_7_16_26.txt')
GAP = os.path.join(QB, 'BOHEMIA_QUESTBOOK_GAP_MATRIX_7_16_26.txt')


def load_dive(n):
    fn = [f for f in os.listdir(QB) if re.match(r'BOHEMIA_QUESTBOOK_%d_.*\.md$' % n, f)][0]
    text = open(os.path.join(QB, fn), encoding='utf-8').read()
    title = re.search(r'#\d+ — "(.*?)"', text).group(1)
    game = re.search(r'\*\*Game:\*\* (.*)', text).group(1).strip()
    game = re.sub(r'\s*\(\d{4}\)\s*$', '', game)
    return fn, text, title, game


def craft_section(n, text, title, game):
    out = ['### #%d  %s (%s)' % (n, title, game)]
    for m in re.finditer(r'^(W\d+)\. ([A-Z0-9][^.]*)\. (.*)$', text, re.M):
        out.append('  %-3s %s' % (m.group(1), m.group(2).strip()))
        out.append('      %s' % m.group(3).strip())
    return '\n'.join(out), len(re.findall(r'^W\d+\.', text, re.M))


def flaws_section(n, text, title, game):
    out = ['### #%d  %s (%s)' % (n, title, game)]
    count = 0
    for m in re.finditer(r'\*\*(F\d+) — (.*?)\.\*\* (.*?)\n\*\*LAW FOR BOHEMIA:\*\* (.*?)(?:\n\n|\n\*\*F|\Z)',
                         text, re.S):
        count += 1
        out.append('  X  %s' % m.group(2).strip())
        out.append('     %s' % ' '.join(m.group(3).split()))
        out.append('     LAW: %s' % ' '.join(m.group(4).split()))
    return '\n'.join(out), count


def ports_section(n, text, title, game):
    out = ['### #%d  %s (%s)' % (n, title, game)]
    count = 0
    for m in re.finditer(r'^### (PORT \d+ — .*?)\n\*\*System:\*\* (.*?)\n(.*?)(?=\n### PORT|\n---|\Z)',
                         text, re.S | re.M):
        count += 1
        body = m.group(3).strip().split('\n\n')[0]
        out.append('  ->  %s' % m.group(1).strip())
        out.append('      system: %s' % m.group(2).strip())
        out.append('      %s' % ' '.join(body.split())[:400])
    return '\n'.join(out), count


def bump_header(path, added_findings, added_files, banner):
    s = open(path, encoding='utf-8').read()
    m = re.search(r'(\d+) (findings|ports)(?: / (\d+) files)?', s)
    total = int(m.group(1)) + added_findings
    if m.group(3):
        repl = '%d %s / %d files' % (total, m.group(2), int(m.group(3)) + added_files)
    else:
        repl = '%d %s' % (total, m.group(2))
    s = s.replace(m.group(0), repl, 1)
    first2, rest2 = s.split('\n', 1)
    return first2 + '  [+' + banner + ']\n' + rest2


def main():
    nums = [int(a) for a in sys.argv[1:]]
    if not nums:
        print('usage: bohemia_questbook_extract.py N [N...]')
        return 1
    banner = 'BATCH appended %s (7/17/26, machine-parsed)' % ','.join(map(str, nums))
    adds = {CRAFT: [], FLAWS: [], PORTS: []}
    counts = {CRAFT: 0, FLAWS: 0, PORTS: 0}
    gap_rows = []
    for n in nums:
        for path in (CRAFT, FLAWS, PORTS):
            if ('### #%d ' % n) in open(path, encoding='utf-8').read():
                print('REFUSED: #%d already present in %s' % (n, path))
                return 1
        fn, text, title, game = load_dive(n)
        c, cn = craft_section(n, text, title, game)
        f, fn_ = flaws_section(n, text, title, game)
        p, pn = ports_section(n, text, title, game)
        if not (cn and fn_ and pn):
            print('REFUSED: #%d parsed to zero in a section (craft %d flaws %d ports %d)'
                  % (n, cn, fn_, pn))
            return 1
        adds[CRAFT].append(c); counts[CRAFT] += cn
        adds[FLAWS].append(f); counts[FLAWS] += fn_
        adds[PORTS].append(p); counts[PORTS] += pn
        lines = text.count('\n') + 1
        conv = 'Y' if re.search(r'^> ', text, re.M) else '.'
        flow = 'Y' if 'FULL EVENT FLOW' in text else '.'
        gap_rows.append('%-5d %-52s %6d %6d %6d %6d %5s %5s %5s'
                        % (n, (title + ' (' + game + ')')[:52], lines, cn, fn_, pn, flow, conv, 'Y'))
        print('#%d: %d craft, %d flaws, %d ports' % (n, cn, fn_, pn))

    for path in (CRAFT, FLAWS, PORTS):
        s = bump_header(path, counts[path], len(nums), banner)
        s = s.rstrip('\n') + '\n\n' + '\n\n'.join(adds[path]) + '\n'
        open(path, 'w', encoding='utf-8').write(s)
    g = open(GAP, encoding='utf-8').read().rstrip('\n')
    g += '\n' + '\n'.join(gap_rows) + '\n'
    first, rest = g.split('\n', 1)
    open(GAP, 'w', encoding='utf-8').write(first + '  [+' + banner + ']\n' + rest)
    print('masters + gap matrix appended.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
