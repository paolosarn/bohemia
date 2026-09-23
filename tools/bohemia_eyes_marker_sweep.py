#!/usr/bin/env python3
"""BOHEMIA -- IS THERE MERGE DEBRIS IN THE SHARED FILES, AND IS IT REALLY DEBRIS

EYES AND EARS, lane 17, E21 [marker sweep] round two. 9/23/26.
School round one: records/BOHEMIA_EYES_E21_ROUND_1_SCHOOL_THE_CHECKER_EVERYBODY_USES_IS_WRONG_HERE_9_22_26.md

THE ROW: "ECONOMY reported a bare conflict marker in the handoff at the EYES/UI seam; the
coordinator's check found only the long decorative separators... a sweep that distinguishes a
real seven-character marker from a separator, on every shared file, every ship."

WHY THE OBVIOUS ANSWER IS NOT USED, ALL OF IT MEASURED IN ROUND ONE, NOT READ:
  * `git diff --check`, git's own leftover-marker check, FLAGS A MARKDOWN SETEXT HEADING -- a
    title with a line of equals under it. This repo carries 2,583 of those in .md and 3,504
    lines of seven-or-more equals overall, so it would be red on nearly every prose commit, and
    a gate that is always red is a gate somebody switches off.
  * pre-commit's check-merge-conflict matches the same bare ======= at line start AND, unless
    it is given --assume-in-merge, returns 0 WITHOUT SCANNING ANYTHING when no merge is in
    progress. In CI it passes by declining to look.
  * A diff check cannot see debris that is already committed and untouched (measured: exit 0
    while a whole-tree sweep finds three lines). Our one real incident was exactly that shape:
    a marker reached the shipped splash on 8/27 and a page gate caught it, not a merge check.

SO THIS SWEEP, TO THE DESIGN ROUND ONE WROTE DOWN BEFORE ANY CODE:
  1. A CANDIDATE is a line whose first characters are a run of <, |, = or > of the length in
     force for that path -- read from `git check-attr conflict-marker-size`, default 7, because
     seven is a default and not a law (proved: `git merge-file --marker-size=32` writes 32).
     An open, base or close run must be followed by a space (or end of line); an = run must be
     alone on its line.
  2. A FINDING needs THE ORDERED SET INSIDE ONE FILE: open, then optionally base, then the
     separator, then close, in that order. A lone ======= is never a finding by itself. That is
     the discriminator the row asked for and the one the published write-ups converge on.
  3. FENCED CODE BLOCKS IN MARKDOWN ARE EXCLUDED, because our own 8/27 record QUOTES a real
     marker while describing the incident, and a checker that accuses a record of quoting an
     incident is a checker nobody trusts.
  4. RULE ZERO: five planted controls must behave before any number is printed -- a real set is
     found, a decorative separator is ignored, a setext heading is ignored, a quoted marker in a
     fence is ignored, and a 32-character set under its attribute is found. If any control
     misbehaves the sweep REFUSES TO REPORT.

Usage:  python3 tools/bohemia_eyes_marker_sweep.py [--json <path>] [--quiet]
Exit 0 always; the gate that fails on findings is gates/marker_sweep_gate.py.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SIZE = 7
BINARY_SNIFF = 8192


def sh(args, cwd=ROOT):
    return subprocess.run(args, cwd=cwd, stdout=subprocess.PIPE,
                          stderr=subprocess.DEVNULL).stdout.decode('utf-8', 'replace')


def marker_size_for(paths, cwd=ROOT):
    """THE SIZE IS ASKED OF GIT, NEVER HARDCODED. A sweep pinned to seven breaks silently the
    day somebody adds a .gitattributes, which is exactly the class of rot this lane exists to
    find. git answers 'unspecified' when nothing is set, and then seven is correct."""
    out = {}
    if not paths:
        return out
    p = subprocess.run(['git', 'check-attr', '--stdin', 'conflict-marker-size'], cwd=cwd,
                       input='\n'.join(paths).encode(), stdout=subprocess.PIPE,
                       stderr=subprocess.DEVNULL).stdout.decode('utf-8', 'replace')
    for line in p.splitlines():
        # <path>: conflict-marker-size: <value>
        bits = line.rsplit(': ', 1)
        if len(bits) != 2:
            continue
        path = bits[0].rsplit(': conflict-marker-size', 1)[0]
        val = bits[1].strip()
        out[path] = int(val) if val.isdigit() else DEFAULT_SIZE
    return out


def candidates_in(text, size, is_markdown):
    """Return the marker candidates in one file's text, in line order.
    kind is 'open' (<), 'base' (|), 'sep' (=) or 'close' (>)."""
    runs = {'<': 'open', '|': 'base', '=': 'sep', '>': 'close'}
    found = []
    fenced = False
    fence_re = re.compile(r'^\s{0,3}(```|~~~)')
    for n, line in enumerate(text.split('\n'), 1):
        if is_markdown and fence_re.match(line):
            fenced = not fenced
            continue
        if fenced:
            continue                      # a quoted marker is a photograph, not debris
        if not line:
            continue
        ch = line[0]
        kind = runs.get(ch)
        if kind is None:
            continue
        run = len(line) - len(line.lstrip(ch))
        if run != size:
            continue
        rest = line[run:]
        if kind == 'sep':
            if rest.strip():              # ======= must be ALONE: anything after it is prose
                continue
        else:
            if rest and not rest.startswith(' '):
                continue                  # git writes '<<<<<<< label', never '<<<<<<<label'
        found.append({'line': n, 'kind': kind, 'text': line[:90]})
    return found


def sets_in(cands):
    """THE DISCRIMINATOR. An ordered open -> (base) -> sep -> close inside one file. A lone
    separator, a lone close, a heading: none of them is a finding."""
    sets, i = [], 0
    while i < len(cands):
        if cands[i]['kind'] != 'open':
            i += 1
            continue
        j, base, sep, close = i + 1, None, None, None
        while j < len(cands):
            k = cands[j]['kind']
            if k == 'base' and sep is None and base is None:
                base = cands[j]
            elif k == 'sep' and sep is None:
                sep = cands[j]
            elif k == 'close' and sep is not None:
                close = cands[j]
                break
            elif k == 'open':
                break
            j += 1
        if sep is not None and close is not None:
            sets.append({'open_line': cands[i]['line'], 'base_line': base['line'] if base else None,
                         'sep_line': sep['line'], 'close_line': close['line'],
                         'close_text': close['text']})
            i = j + 1
        else:
            i += 1
    return sets


def scan_text(path, text, size):
    is_md = path.endswith(('.md', '.markdown'))
    cands = candidates_in(text, size, is_md)
    return cands, sets_in(cands)


def tracked_text_files():
    out = []
    for p in sh(['git', 'ls-files', '-z']).split('\0'):
        if not p:
            continue
        full = os.path.join(ROOT, p)
        try:
            with open(full, 'rb') as fh:
                head = fh.read(BINARY_SNIFF)
        except OSError:
            continue
        if b'\0' in head:                 # a picture cannot carry prose debris
            continue
        out.append(p)
    return out


# ---------------------------------------------------------------- RULE ZERO
PLANTS = [
    ('real set, 7', 'a.md',
     'a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> topic\n', 7, True),
    ('a decorative separator alone', 'b.md',
     'a line\n=======\nanother line\n', 7, False),
    ('a markdown setext heading', 'c.md',
     'A Heading\n=======\nbody text\n', 7, False),
    ('a real marker QUOTED in a fence', 'd.md',
     'we saw this:\n\n```\n>>>>>>> 7333cce (a commit subject)\n<<<<<<< HEAD\n=======\n```\n\nend\n', 7, False),
    ('real set, 32 under its attribute', 'e.md',
     'a\n' + '<' * 32 + ' mine\nb\n' + '=' * 32 + '\nc\n' + '>' * 32 + ' theirs\n', 32, True),
]


def controls():
    """No number is printed unless all five of these behave. A sweep that cannot tell a heading
    from a conflict is not a sweep, and the only way to know is to plant both."""
    res = []
    for name, fname, text, size, should_find in PLANTS:
        _, sets = scan_text(fname, text, size)
        got = len(sets) > 0
        res.append({'name': name, 'expected': 'FOUND' if should_find else 'IGNORED',
                    'got': 'FOUND' if got else 'IGNORED', 'pass': got == should_find})
    # and one control on the real mechanism, not on a string in this file: git's own writer
    with tempfile.TemporaryDirectory() as td:
        for n, body in (('mine.txt', 'a\nMINE\nz\n'), ('base.txt', 'a\nBASE\nz\n'),
                        ('theirs.txt', 'a\nTHEIRS\nz\n')):
            open(os.path.join(td, n), 'w').write(body)
        subprocess.run(['git', 'merge-file', '--marker-size=32', '-p', 'mine.txt', 'base.txt',
                        'theirs.txt'], cwd=td, stdout=open(os.path.join(td, 'out'), 'w'),
                       stderr=subprocess.DEVNULL)
        out = open(os.path.join(td, 'out')).read()
        _, sets = scan_text('out.txt', out, 32)
        res.append({'name': 'git really writes a 32-char set and the sweep finds THAT',
                    'expected': 'FOUND', 'got': 'FOUND' if sets else 'IGNORED',
                    'pass': bool(sets)})
    return res


def main():
    quiet = '--quiet' in sys.argv
    jpath = None
    if '--json' in sys.argv:
        jpath = sys.argv[sys.argv.index('--json') + 1]

    ctrl = controls()
    bad = [c for c in ctrl if not c['pass']]
    report = {'what': 'merge debris in the shared files', 'row': 'E21 [marker sweep] round two',
              'controls': ctrl, 'failing_controls': [c['name'] for c in bad]}

    if bad:
        # RULE ZERO: refuse to print numbers when a control misbehaves.
        report['findings'] = None
        report['refused'] = 'the controls did not behave, so no number here would mean anything'
        if not quiet:
            print('  MARKER SWEEP: CONTROLS FAILED -> ' + ' | '.join(report['failing_controls']))
            print('  REFUSING TO REPORT. A sweep whose planted cases misbehave says nothing.')
        if jpath:
            json.dump(report, open(jpath, 'w'), indent=2)
        return 0

    files = tracked_text_files()
    sizes = marker_size_for(files)
    findings, cand_count, lookalikes = [], 0, []
    for p in files:
        try:
            text = open(os.path.join(ROOT, p), encoding='utf-8', errors='replace').read()
        except OSError:
            continue
        size = sizes.get(p, DEFAULT_SIZE)
        cands, sets = scan_text(p, text, size)
        cand_count += len(cands)
        for s in sets:
            findings.append({'file': p, **s})
        for c in cands:
            if not sets:
                lookalikes.append({'file': p, 'line': c['line'], 'kind': c['kind'],
                                   'text': c['text']})

    report.update({
        'files_swept': len(files),
        'marker_shaped_lines': cand_count,
        'findings': findings,
        'lonely_candidates_that_are_NOT_findings': lookalikes[:20],
        'lonely_candidate_count': len(lookalikes),
        'marker_sizes_seen': sorted(set(sizes.values())) or [DEFAULT_SIZE],
    })
    if jpath:
        json.dump(report, open(jpath, 'w'), indent=2)
    if not quiet:
        print('  MARKER SWEEP: controls all green (%d of %d)' % (len(ctrl), len(ctrl)))
        print('  %d text files swept, marker size %s' % (len(files), report['marker_sizes_seen']))
        print('  FINDINGS (a whole ordered conflict set in one file): %d' % len(findings))
        for f in findings:
            print('    %s: open %d, sep %d, close %d  %s'
                  % (f['file'], f['open_line'], f['sep_line'], f['close_line'], f['close_text'][:50]))
        print('  lone marker-shaped lines that are NOT findings: %d' % len(lookalikes))
        for l in lookalikes[:6]:
            print('    %s:%d  %s  %s' % (l['file'], l['line'], l['kind'], l['text'][:46]))
    return 0


if __name__ == '__main__':
    sys.exit(main())
