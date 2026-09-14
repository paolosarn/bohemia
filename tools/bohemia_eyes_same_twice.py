#!/usr/bin/env python3
"""
BOHEMIA -- SAME FILE, SAME ANSWER?  (EYES AND EARS, E26 [five minutes], 9/14/26)

WHY THIS EXISTS. THE FIVE MINUTES (Paolo 9/13, LOCKED) made the demo's first five minutes on
a phone the only measure of the game, and it made this lane post THE STRANGER'S LIST every
round. Round 4 walked a demo file that is BYTE-IDENTICAL to the one round 3 walked
(md5 f5f706f61a0e905437e7a36d54e7004c, last touched by fe1cca0) and the walk came back with a
DIFFERENT LIST:

    round 3, that file:  2 dead buttons ("BUILD", "BUILD BIG 2x2"), 10 inert, 2.9 s to first tappable, 114 holds
    round 4, that file:  0 dead buttons,                             4 inert, 4.12 s,                 107 holds

The game cannot have been fixed: only THE RUN re-cuts the demo, and the file did not move.
So one of those two lists is wrong, and until this is measured I do not know which. A list that
changes when the game does not is not an observation, it is noise wearing an observation's
clothes -- and it is worse than nothing, because every lane on the board acts on it.

E3's lesson said a checker that fails on absolute badness gets muted. This is the other half of
it: a checker that cannot repeat itself gets BELIEVED, once, and sends somebody chasing a bug
that was never there. Two lanes already shipped against item 2 of my list.

WHAT IT DOES. Runs the walk N times, one at a time, with nothing else driving a browser,
against a file whose hash it records before and after. It keeps each run's JSON and its shots,
then prints which numbers HELD across every run and which ones MOVED. Nothing that moved may
go on his list as a fact. A number that holds N times is a finding; a number that moves is a
question about my instrument.

RULE ZERO (E9). A zero needs a positive control, so --selftest proves BOTH directions on
planted data before any real number is believed:
  C1  two identical runs must report ZERO moved fields (else it invents instability)
  C2  two runs differing in one field must report exactly that ONE field (else it is blind)
  C3  a run whose file hash changed mid-sweep must be REFUSED, not averaged
  C4  a missing run must be an error, never a silent 1-of-3

WRONG VERSIONS OF THIS TOOL, KEPT ON PURPOSE (the lane writes its mistakes down):
  v1  ran the three walks IN PARALLEL to save wall clock. That is what caused the problem it
      was built to measure: at 20:44 this round a second browser was started while the first
      walk was still walking, and the two runs share one output path and one shot folder, so
      the shots on disk came from two different browsers. Sequential, always, and the harness
      now refuses to start if another walk is running.
  v2  compared the whole JSON with ==. Every run differs in "when" and in per-item timings, so
      everything always "moved" and the tool said nothing. It now compares a NAMED set of
      claim-bearing fields plus the SET OF LABELS it calls dead, which is what actually
      reaches his list.
"""
import io, json, os, subprocess, sys, hashlib, shutil, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
DEMO = 'slices/BOHEMIA_DEMO.html'
OUT = 'records/BOHEMIA_EYES_E26_WALK_DEMO_9_14_26.json'
SHOTS = 'records/eyes_e26_walk_demo'
KEEP = 'records/eyes_e26_repeat'

# The fields that become sentences on his front page. Anything not here is timing detail.
CLAIMS = [
    'time_until_something_is_tappable_s',
    'time_to_first_fight_s',
    'dead_affordances',
    'tapped_and_inert_but_never_claimed_to_be_a_button',
    'page_errors',
    'console_errors',
    'failed_requests',
]


def md5(p):
    try:
        return hashlib.md5(io.open(p, 'rb').read()).hexdigest()
    except Exception:
        return 'unreadable'


def another_walk_running():
    try:
        ps = subprocess.check_output(['ps', 'ax'], encoding='utf-8', errors='replace')
    except Exception:
        return False
    return any('bohemia_eyes_five_minutes' in ln for ln in ps.split('\n'))


def dead_labels(run):
    out = []
    for d in (run.get('dead') or []):
        if isinstance(d, dict):
            out.append(str(d.get('label') or d.get('text') or d.get('id') or d))
        else:
            out.append(str(d))
    return sorted(out)


def compare(runs):
    """Returns (held, moved). A field is HELD only if every run agrees."""
    held, moved = {}, {}
    for k in CLAIMS:
        vals = [r.get('numbers', {}).get(k, '<missing>') for r in runs]
        if len(set(map(repr, vals))) == 1:
            held[k] = vals[0]
        else:
            moved[k] = vals
    labels = [tuple(dead_labels(r)) for r in runs]
    if len(set(labels)) == 1:
        held['dead_button_labels'] = list(labels[0])
    else:
        moved['dead_button_labels'] = [list(x) for x in labels]
    ctl = [sorted([c.get('name') for c in (r.get('controls') or []) if not c.get('pass')]) for r in runs]
    held['a_control_failed_in_any_run'] = any(x for x in ctl)
    return held, moved


def selftest():
    fails = []
    base = {'numbers': {k: 1 for k in CLAIMS}, 'dead': [{'label': 'BUILD'}], 'controls': []}
    other = json.loads(json.dumps(base))
    # C1 two identical runs -> nothing moved
    h, m = compare([base, json.loads(json.dumps(base))])
    if m:
        fails.append('C1 invented instability on identical runs: %s' % list(m))
    # C2 one field differs -> exactly that field
    other['numbers']['console_errors'] = 3
    h, m = compare([base, other])
    if list(m) != ['console_errors']:
        fails.append('C2 blind or noisy: moved=%s' % list(m))
    # C2b a dead label appearing in one run only must move
    third = json.loads(json.dumps(base))
    third['dead'] = []
    h, m = compare([base, third])
    if 'dead_button_labels' not in m:
        fails.append('C2b did not notice a dead button present in one run and absent in another')
    # C3 a hash change must refuse
    if refuse_if_moved('aaa', 'bbb') is not True:
        fails.append('C3 accepted a sweep whose file changed underneath it')
    if refuse_if_moved('aaa', 'aaa') is not False:
        fails.append('C3b refused a sweep whose file never moved')
    # C4 a missing run is an error
    try:
        compare([base, {}])
        h, m = compare([base, {}])
        if not m:
            fails.append('C4 treated a missing run as agreement')
    except Exception as e:
        fails.append('C4 crashed instead of reporting: %s' % e)
    print('  SELFTEST ' + ('FAILED:\n    ' + '\n    '.join(fails) if fails else
                           'OK: it stays quiet on identical runs, names the one field that moved, '
                           'refuses a sweep whose file changed, and will not call a missing run agreement.'))
    return 1 if fails else 0


def refuse_if_moved(a, b):
    return a != b


def main():
    if '--selftest' in sys.argv:
        return selftest()
    n = 3
    for i, a in enumerate(sys.argv):
        if a == '--runs' and i + 1 < len(sys.argv):
            n = max(2, int(sys.argv[i + 1]))
    if another_walk_running():
        print('  REFUSED: another five-minute walk is already running. Two walks share one output '
              'path and one shot folder, and that is the exact contamination this tool exists for.')
        return 1
    before = md5(DEMO)
    os.makedirs(KEEP, exist_ok=True)
    runs = []
    for i in range(n):
        t0 = time.time()
        env = dict(os.environ, NODE_PATH='/opt/node22/lib/node_modules')
        r = subprocess.run(['node', 'tools/bohemia_eyes_five_minutes.js', 'demo'],
                           env=env, capture_output=True, encoding='utf-8', errors='replace')
        if not os.path.exists(OUT):
            print('  run %d wrote no result. stderr tail: %s' % (i + 1, (r.stderr or '')[-400:]))
            return 1
        j = json.load(io.open(OUT, encoding='utf-8'))
        runs.append(j)
        shutil.copyfile(OUT, os.path.join(KEEP, 'run%d.json' % (i + 1)))
        print('  run %d done in %.0fs: dead=%s inert=%s tappable=%ss holds=%s'
              % (i + 1, time.time() - t0,
                 j.get('numbers', {}).get('dead_affordances'),
                 j.get('numbers', {}).get('tapped_and_inert_but_never_claimed_to_be_a_button'),
                 j.get('numbers', {}).get('time_until_something_is_tappable_s'),
                 j.get('numbers', {}).get('extra_walk_rounds')))
        sys.stdout.flush()
    after = md5(DEMO)
    if refuse_if_moved(before, after):
        print('  REFUSED: the demo file changed while I was walking it (%s -> %s). Nothing here '
              'describes one game.' % (before[:8], after[:8]))
        return 1
    held, moved = compare(runs)
    print('\n  THE FILE:  %s  md5 %s  (unchanged across %d walks)' % (DEMO, before[:8], n))
    print('\n  HELD across every walk (these may be said as facts):')
    for k, v in held.items():
        print('    %-52s %s' % (k, v))
    print('\n  MOVED between walks on an unchanged file (these may NOT):')
    if not moved:
        print('    nothing. the instrument repeats.')
    for k, v in moved.items():
        print('    %-52s %s' % (k, v))
    res = {'file': DEMO, 'md5': before, 'runs': n, 'held': held, 'moved': moved,
           'per_run': [{'numbers': r.get('numbers'), 'dead': dead_labels(r)} for r in runs]}
    io.open('records/BOHEMIA_EYES_E26_REPEAT_9_14_26.json', 'w', encoding='utf-8').write(
        json.dumps(res, indent=2))
    print('\n  SAME FILE, SAME ANSWER?  %s' % ('YES for every claim.' if not moved else
          '%d of %d claims MOVED. Those claims are about my instrument, not his game.'
          % (len(moved), len(held) + len(moved))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
