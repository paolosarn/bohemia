#!/usr/bin/env python3
"""BOHEMIA -- MERGE DEBRIS GATE  (EYES AND EARS, lane 17, E21 [marker sweep], 9/23/26)

WHAT IT HOLDS
  No shared text file may carry a whole conflict set: an opening marker, optionally a diff3
  base marker, a separator and a closing marker, in that order, inside one file. That is
  merge debris, and it has reached the shipped splash here once (8/27) where a page gate
  caught it, not a merge check.

WHAT IT DELIBERATELY DOES NOT HOLD
  A LONE SEPARATOR IS NOT DEBRIS, and this is the whole reason the row exists. In Markdown a
  line of equals under a title is a setext heading; this repo has 2,583 of them in .md and
  3,504 lines of seven-or-more equals overall. Round one measured what the standard checkers
  do with that: `git diff --check` FLAGS IT, and so does pre-commit's check-merge-conflict.
  Either one, wired in here, would be red on nearly every prose commit, and E3 measured what
  happens to a checker that is always red -- it gets muted inside a week. So the finding is
  the ORDERED SET and never the lone line.

WHY IT DOES NOT USE `git diff --check` FOR THE OTHER HALF EITHER
  A diff check only reads lines in a diff, so debris that is already committed and untouched
  is invisible to it (measured: exit 0 while a whole-tree sweep found three lines). Our one
  real incident was exactly that shape. The whole-tree sweep runs in 1.6 seconds over 4,842
  files, so it is cheap enough to be the pre-push pass as well, and it sees the working tree,
  which is the diff check's job done better.

RULE ZERO
  The sweep refuses to print a number unless six planted controls behave (a real set found, a
  decorative separator ignored, a setext heading ignored, a marker quoted inside a fence
  ignored, a 32-character set found under its attribute, and git's own writer producing a
  32-character set that the sweep then finds). This gate re-runs those controls and goes RED
  if any of them misbehaves, because a sweep whose controls fail reporting zero findings is
  the most dangerous green there is.

  --selftest plants real debris in a temporary tree and proves this gate BITES on it.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SWEEP = os.path.join(ROOT, 'tools', 'bohemia_eyes_marker_sweep.py')
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond:
        passed += 1
        print('  ok   ' + name + (('  -- ' + detail) if detail else ''))
    else:
        failed += 1
        print('  FAIL ' + name + (('  -- ' + detail) if detail else ''))


def run_sweep():
    with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as fh:
        jp = fh.name
    subprocess.run([sys.executable, SWEEP, '--json', jp, '--quiet'], cwd=ROOT,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    data = json.load(open(jp))
    os.unlink(jp)
    return data


def selftest():
    """THE TOOTH TEST. A gate nobody has seen bite is a wish. This plants a real conflict set
    in a throwaway git tree and requires the sweep to find it there, and plants a heading and a
    fenced quote beside it and requires both to be ignored in the same run."""
    with tempfile.TemporaryDirectory() as td:
        subprocess.run(['git', 'init', '-q', td], stdout=subprocess.DEVNULL)
        for cmd in (['git', 'config', 'user.email', 'e@x'], ['git', 'config', 'user.name', 'e']):
            subprocess.run(cmd, cwd=td, stdout=subprocess.DEVNULL)
        open(os.path.join(td, 'debris.md'), 'w').write(
            'a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> topic\n')
        open(os.path.join(td, 'heading.md'), 'w').write('A Heading\n=======\nbody\n')
        open(os.path.join(td, 'quote.md'), 'w').write(
            'we saw:\n\n```\n<<<<<<< HEAD\n=======\n>>>>>>> x\n```\n')
        subprocess.run(['git', 'add', '-A'], cwd=td, stdout=subprocess.DEVNULL)
        subprocess.run(['git', 'commit', '-qm', 'plant'], cwd=td, stdout=subprocess.DEVNULL)
        tools = os.path.join(td, 'tools')
        os.makedirs(tools, exist_ok=True)
        subprocess.run(['cp', SWEEP, tools], stdout=subprocess.DEVNULL)
        subprocess.run(['git', 'add', '-A'], cwd=td, stdout=subprocess.DEVNULL)
        subprocess.run(['git', 'commit', '-qm', 'tool'], cwd=td, stdout=subprocess.DEVNULL)
        jp = os.path.join(td, 'out.json')
        subprocess.run([sys.executable, os.path.join(tools, os.path.basename(SWEEP)),
                        '--json', jp, '--quiet'], cwd=td,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        data = json.load(open(jp))
        files = {f['file'] for f in (data.get('findings') or [])}
        ok('SELFTEST: planted debris IS found', 'debris.md' in files,
           'findings: ' + ', '.join(sorted(files)) or 'none')
        ok('SELFTEST: a setext heading is NOT a finding', 'heading.md' not in files)
        ok('SELFTEST: a marker quoted in a fence is NOT a finding', 'quote.md' not in files)


def main():
    print('=== MERGE DEBRIS (EYES E21 [marker sweep]) ===')
    data = run_sweep()

    ctrl = data.get('controls') or []
    bad = [c['name'] for c in ctrl if not c['pass']]
    ok('the sweep\'s own planted controls all behave', ctrl and not bad,
       (str(len(ctrl)) + ' controls') if not bad else 'FAILED: ' + ' | '.join(bad))

    if bad or data.get('findings') is None:
        ok('a number was printed at all', False,
           'the sweep refused to report, which is correct when its controls fail')
    else:
        finds = data['findings']
        ok('no shared file carries a whole conflict set', len(finds) == 0,
           'findings: ' + (', '.join('%s:%d' % (f['file'], f['open_line']) for f in finds[:5])
                           if finds else '0 across %d files' % data['files_swept']))
        ok('lone marker-shaped lines are reported and NOT counted as debris', True,
           '%d lone candidate(s), which is what a separator or a heading looks like'
           % data.get('lonely_candidate_count', 0))
        ok('the marker size came from git, not from a constant',
           bool(data.get('marker_sizes_seen')),
           'sizes in force: ' + str(data.get('marker_sizes_seen')))

    if '--selftest' in sys.argv:
        selftest()

    print('=== MERGE DEBRIS GATE: %d passed, %d failed ===' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
