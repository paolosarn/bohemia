#!/usr/bin/env python3
"""BOHEMIA -- HOW OLD IS THIS RED, AND WHICH CHECKERS DID NOT RUN

EYES AND EARS, lane 17, E22 [never ran] round two. 9/24/26.
School round one: records/BOHEMIA_EYES_E22_ROUND_1_SCHOOL_A_RED_WITH_NO_AGE_9_24_26.md

THE ROW: "a standing list, every ship, of gates that did not run and gates whose red was never
re-checked, handed to PLUMBER."

WHAT SCHOOL FOUND, AND WHY THIS TOOL IS SHAPED THE WAY IT IS
  * The runner ALREADY names the gates it never started, refuses to call an unfinished run a
    pass, and works out the shard count it would have needed. That half is built, so this tool
    does not rebuild it.
  * NOTHING stored a red's AGE. There was no per-run history in this repo at all: the only
    artefact of a full run was one census of aggregates. So no one could say when a red first
    appeared, whether it has been red every run since, or whether anybody re-ran it once.
  * The published rules this borrows: a check that could not run has NOT passed; a failing check
    stays a failure UNTIL IT IS EXPLAINED, and the load-bearing part of a quarantine is its
    EXPIRY; and never call a failure flaky because one rerun passed -- that needs a pass-rate
    history keyed by run.
  * IT PARSES THE RUNNER'S OWN PRINTED OUTPUT AND TOUCHES NOTHING OF PLUMBER'S. The suite is
    that lane's; a checker that needs another lane's tool changed is a checker that does not
    ship.

AND ONE PROPERTY THAT FELL OUT OF THE FIRST ROUND BY ACCIDENT. My own full run died at gate 153
of 712 when the container restarted, so the runner never reached its summary and the run left NO
RECORD AT ALL. A killed run is the commonest kind here and it used to be worth nothing. Ingested
by this tool it is worth something: 153 real verdicts, and every gate it never reached is
recorded as UNKNOWN -- never as green.

  python3 tools/bohemia_eyes_gate_history.py --ingest <run.log> [--run-id NAME]
  python3 tools/bohemia_eyes_gate_history.py --list
  python3 tools/bohemia_eyes_gate_history.py --controls      (RULE ZERO, five planted histories)
"""
import io
import json
import os
import re
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HIST = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_GATE_HISTORY.jsonl')

ROW = re.compile(r'^\s*\[\s*(\d+)/(\d+)\]\s+(\S.*?)\s{2,}(GREEN|FAIL|RED|SKIP)\s+.*?([\d.]+)s\s*$', re.M)
BOX = re.compile(r'^\s*BOX SPEED:.*?=\s*([\d.]+)x', re.M)
DONE = re.compile(r'^\s*(ALL \d+ GATES GREEN|\d+ OF \d+ GATES? (?:GREEN|PASSED)|\d+ GATE\(S\) FAILED)', re.M)
UNRUN = re.compile(r'^\s*(\d+) GATE\(S\) NEVER RAN', re.M)


def table_names():
    """THE GATE TABLE IS THE DENOMINATOR, and it is read with a pattern that allows any name.
    An earlier count of mine allowed only capitals and reported two live gates as dead ('NO
    BULLSHIT Qs' has a lowercase s, 'PLACEHOLDER #' has a hash). A denominator that drops rows
    makes every percentage a lie, so this one takes whatever is inside the quotes."""
    src = io.open(os.path.join(ROOT, 'gates', 'bohemia_gates.py'), encoding='utf-8').read()
    return sorted(set(re.findall(r"^\s*\('([^']+)',\s*\[", src, re.M)))


def parse_log(text):
    rows = ROW.findall(text)
    gates = {}
    for _n, _tot, name, status, secs in rows:
        gates[name.strip()] = {'status': 'RED' if status in ('FAIL', 'RED') else status,
                               'seconds': float(secs)}
    total = int(rows[0][1]) if rows else None
    complete = bool(DONE.search(text))
    never = int(UNRUN.search(text).group(1)) if UNRUN.search(text) else None
    # *** A FILTERED RUN IS NOT AN UNFINISHED ONE, AND THE FIRST CUT OF THIS TOOL SAID IT WAS.
    # *** Fed a `--only BUDGET` run it announced "NO VERDICT IN THE NEWEST RUN: 709 -- the run
    # FINISHED and these were never started", which reads as 709 checks skipped for lack of time
    # and is a frightening number that is simply false: 709 were never SELECTED. The runner keeps
    # the original index on every line ([28/713], [309/713]) so a filtered run is sparse, and the
    # three cases are told apart exactly:
    #   complete + a NEVER RAN line   -> the runner's own unrun list, real
    #   complete + no NEVER RAN line + fewer verdicts than the table -> FILTERED, by --only/--shard
    #   not complete                  -> KILLED, and the rest were never reached
    kind = ('killed' if not complete
            else 'unfinished' if never
            else 'filtered' if (total and len(gates) < total) else 'full')
    return {'gates': gates, 'total_in_table_at_the_time': total,
            'box_speed': float(BOX.search(text).group(1)) if BOX.search(text) else None,
            'complete': complete, 'kind': kind,
            'runner_said_never_ran': never}


def load_history(path=HIST):
    out = []
    if not os.path.exists(path):
        return out
    for line in io.open(path, encoding='utf-8'):
        line = line.strip()
        if line:
            out.append(json.loads(line))
    return out


def ingest(log_path, run_id=None, path=HIST):
    text = io.open(log_path, encoding='utf-8', errors='replace').read()
    p = parse_log(text)
    if not p['gates']:
        print('  nothing to ingest: no gate lines in ' + log_path)
        return 1
    try:
        sha = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT,
                             stdout=subprocess.PIPE).stdout.decode().strip()
    except Exception:
        sha = None
    rec = {'run_id': run_id or (os.path.basename(log_path) + '@' + time.strftime('%Y-%m-%dT%H:%M:%SZ',
           time.gmtime(os.path.getmtime(log_path)))),
           'when': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(os.path.getmtime(log_path))),
           'sha': sha, 'log': os.path.basename(log_path), **p}
    with io.open(path, 'a', encoding='utf-8') as fh:
        fh.write(json.dumps(rec) + '\n')
    red = sum(1 for g in p['gates'].values() if g['status'] == 'RED')
    print('  ingested %s: %d gates (%d red), complete=%s, box %s'
          % (rec['run_id'], len(p['gates']), red, p['complete'], p['box_speed']))
    return 0


def standing_list(history, names, quiet=False):
    """THE STANDING LIST. Three questions, and each one refuses to answer past its data."""
    out = {'runs': len(history), 'gates_in_table': len(names)}
    if not history:
        out['refused'] = 'no runs have been ingested, so there is nothing to age'
        return out
    newest = history[-1]
    # THE "WHAT HAS NO VERDICT" QUESTION IS ONLY ASKABLE OF A RUN THAT TRIED EVERYTHING, so it is
    # asked of the newest run that was not filtered. The ages below still use every run, filtered
    # ones included, because a filtered run is a real verdict on the gates it did select.
    unfiltered = [h for h in history if h.get('kind') != 'filtered'] or [newest]
    coverage = unfiltered[-1]
    seen_ever = set()
    for h in history:
        seen_ever |= set(h['gates'])

    # 1. WHAT THE NEWEST RUN DID NOT REACH. A partial run's silence is not a skip and not a pass.
    missing = sorted(n for n in names if n not in coverage['gates'])
    out['newest_run'] = {'run_id': newest['run_id'], 'complete': newest['complete'],
                         'kind': newest.get('kind'),
                         'gates_with_a_verdict': len(newest['gates']),
                         'box_speed': newest['box_speed']}
    kind = coverage.get('kind')
    out['coverage_run'] = {'run_id': coverage['run_id'], 'kind': kind,
                           'gates_with_a_verdict': len(coverage['gates'])}
    out['no_verdict'] = {
        'count': len(missing),
        'measured_on': coverage['run_id'],
        'what_that_means': (
            'the run FINISHED and the runner named these as never started' if kind == 'unfinished'
            else 'the run FINISHED and reached everything, so this should be 0' if kind == 'full'
            else 'the newest run that tried everything DID NOT FINISH, so these were never '
                 'reached: unknown, never green'),
        'names': missing[:40]}

    # 2. HOW OLD EVERY RED IS. Absence never resets the clock and never counts as a re-check.
    # THE REDS ARE EVERY GATE WHOSE NEWEST KNOWN VERDICT IS RED, not the newest run's reds. A
    # filtered run of four gates would otherwise announce "4 red" and read as the fleet's red
    # count, which is the same false-number shape as the 709 above. Each red carries the run its
    # verdict came from, so a stale verdict cannot pass for a fresh one.
    latest = {}
    for h in history:
        for name, g in h['gates'].items():
            latest[name] = {'status': g['status'], 'seconds': g['seconds'], 'run': h['run_id']}
    reds = []
    for name, g in sorted(latest.items()):
        if g['status'] != 'RED':
            continue
        streak, last_green, last_seen = 0, None, None
        for h in reversed(history):
            st = (h['gates'].get(name) or {}).get('status')
            if st is None:
                continue
            if last_seen is None:
                last_seen = h['run_id']
            if st == 'RED':
                streak += 1
            else:
                last_green = h['run_id']
                break
        reds.append({'gate': name, 'consecutive_runs_red': streak,
                     'newest_verdict_came_from': g['run'],
                     'last_run_that_included_it': last_seen,
                     'last_run_it_was_green_in': last_green,
                     'seconds_when_it_last_ran': g['seconds']})
    reds.sort(key=lambda r: (-r['consecutive_runs_red'], r['gate']))
    out['reds'] = reds
    out['red_count'] = len(reds)
    if len(history) < 2:
        out['age_is_refused'] = ('ONE RUN IS NOT A HISTORY: every streak below reads 1 because '
                                 'there is nothing before it. The ages become real at the second '
                                 'ingested run.')

    # 3. NEVER CENSUSED. In the table, never in any run, so nothing is known about it at all.
    out['never_in_any_run'] = {'count': len(set(names) - seen_ever),
                               'names': sorted(set(names) - seen_ever)[:20]}
    if not quiet:
        n = out['newest_run']
        print('  RUNS INGESTED: %d   GATES IN THE TABLE: %d' % (out['runs'], out['gates_in_table']))
        print('  NEWEST RUN: %s  (%s, %d verdicts, box %s)'
              % (n['run_id'], 'complete' if n['complete'] else 'DID NOT FINISH',
                 n['gates_with_a_verdict'], n['box_speed']))
        m = out['no_verdict']
        print('  COVERAGE MEASURED ON: %s (%s)' % (out['coverage_run']['run_id'], out['coverage_run']['kind']))
        print('  NO VERDICT THERE: %d -- %s' % (m['count'], m['what_that_means']))
        print('  GATES WHOSE NEWEST VERDICT IS RED: %d' % out['red_count'])
        if out.get('age_is_refused'):
            print('  ' + out['age_is_refused'])
        for r in reds[:12]:
            print('    %-22s red in %d run(s) running, verdict from %s, last green in %s'
                  % (r['gate'][:22], r['consecutive_runs_red'], r['newest_verdict_came_from'],
                     r['last_run_it_was_green_in'] or 'NO RUN YET'))
        print('  IN THE TABLE AND IN NO RUN AT ALL: %d' % out['never_in_any_run']['count'])
    return out


# ---------------------------------------------------------------- RULE ZERO
def _run(gates, complete=True, rid='r'):
    return {'run_id': rid, 'when': rid, 'sha': None, 'log': rid, 'complete': complete,
            'box_speed': 1.0, 'total_in_table_at_the_time': len(gates),
            'runner_said_never_ran': None,
            'gates': {k: {'status': v, 'seconds': 1.0} for k, v in gates.items()}}


def controls():
    """No list is printed unless these five behave. Each one is a shape this list could get
    wrong in a way that would read as good news."""
    res = []

    # A: red, red, red, then GREEN -> the streak is over and the re-check is named
    h = [_run({'A': 'RED'}, rid='r1'), _run({'A': 'RED'}, rid='r2'),
         _run({'A': 'RED'}, rid='r3'), _run({'A': 'GREEN'}, rid='r4')]
    got = standing_list(h, ['A'], quiet=True)
    res.append({'name': 'a red that went green is not on the red list at all',
                'pass': got['red_count'] == 0})

    # B: red three times, then a run that never reached it -> absence must NOT reset the age,
    #    and it must NOT read as green
    h = [_run({'B': 'RED'}, rid='r1'), _run({'B': 'RED'}, rid='r2'),
         _run({'B': 'RED'}, rid='r3'), _run({}, complete=False, rid='r4')]
    got = standing_list(h, ['B'], quiet=True)
    miss = got['no_verdict']
    res.append({'name': 'a gate the newest run never reached reads NO VERDICT, never green',
                'pass': miss['count'] == 1 and 'never green' in miss['what_that_means'],
                'detail': miss['what_that_means']})

    # C: one run only -> the age question is refused rather than answered with a 1
    h = [_run({'C': 'RED'}, rid='r1')]
    got = standing_list(h, ['C'], quiet=True)
    res.append({'name': 'one run is not a history, and the age is refused instead of guessed',
                'pass': bool(got.get('age_is_refused'))})

    # D: a red with two runs behind it reports the real streak and the real last-green
    h = [_run({'D': 'GREEN'}, rid='r1'), _run({'D': 'RED'}, rid='r2'), _run({'D': 'RED'}, rid='r3')]
    got = standing_list(h, ['D'], quiet=True)
    r = got['reds'][0] if got['reds'] else {}
    res.append({'name': 'the streak counts back to the last green and names that run',
                'pass': r.get('consecutive_runs_red') == 2 and r.get('last_run_it_was_green_in') == 'r1',
                'detail': json.dumps(r)})

    # F: A FILTERED RUN MUST NOT BE READ AS COVERAGE. This is the control for the false 709.
    h = [_run({'F1': 'GREEN', 'F2': 'GREEN'}, rid='full-r1'),
         dict(_run({'F1': 'RED'}, rid='only-r2'), kind='filtered')]
    h[0]['kind'] = 'full'
    h[0]['total_in_table_at_the_time'] = 2
    got = standing_list(h, ['F1', 'F2'], quiet=True)
    res.append({'name': 'a filtered run is not coverage: the missing count comes from the last '
                        'run that tried everything',
                'pass': got['no_verdict']['count'] == 0 and got['coverage_run']['run_id'] == 'full-r1',
                'detail': 'no-verdict %d, measured on %s' % (got['no_verdict']['count'],
                                                             got['coverage_run']['run_id'])})

    # E: a gate in the table that no run ever touched is called out on its own
    h = [_run({'E': 'GREEN'}, rid='r1')]
    got = standing_list(h, ['E', 'NEVER TOUCHED'], quiet=True)
    res.append({'name': 'a gate in the table and in no run at all is named separately',
                'pass': got['never_in_any_run']['count'] == 1
                        and got['never_in_any_run']['names'] == ['NEVER TOUCHED']})
    return res


def main():
    a = sys.argv
    if '--controls' in a or '--list' in a:
        ctrl = controls()
        bad = [c['name'] for c in ctrl if not c['pass']]
        for c in ctrl:
            print('  %s %s%s' % ('ok  ' if c['pass'] else 'FAIL', c['name'],
                                 ('  -- ' + str(c.get('detail'))[:90]) if c.get('detail') else ''))
        if bad:
            print('  REFUSING TO PRINT A LIST: ' + ' | '.join(bad))
            return 1
        if '--controls' in a:
            return 0
    if '--ingest' in a:
        i = a.index('--ingest')
        rid = a[a.index('--run-id') + 1] if '--run-id' in a else None
        return ingest(a[i + 1], rid)
    if '--list' in a:
        out = standing_list(load_history(), table_names())
        if '--json' in a:
            json.dump(out, open(a[a.index('--json') + 1], 'w'), indent=2)
        return 0
    print(__doc__)
    return 0


if __name__ == '__main__':
    sys.exit(main())
