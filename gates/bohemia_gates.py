#!/usr/bin/env python3
"""
BOHEMIA GATES — one command, every law (7/16/26)

Nine gates got built today. Nine gates nobody will remember to run individually
is nine gates that do not exist. That is the exact failure this whole day was
about: laws enforced by memory are not enforced.

  python3 bohemia_gates.py            # everything
  python3 bohemia_gates.py --fast     # skip the pixel sweeps (~2s vs ~4min)
  python3 bohemia_gates.py --strict   # exit 1 if any gate fails

Run it before any absorption, any wrap, and after any engine edit. Green or it
does not ship.
"""
import subprocess, sys, time, os

# The repo layout (7/17/26): gates live in gates/, engine modules in engine/.
# Every gate runs with cwd = repo root, so data reads are repo-root-relative.
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO_ROOT)

# (name, argv, what it protects, slow?)
GATES = [
    ('GDD LINEAGE',    ['node', 'gates/gdd_gate.js'],
     'v2/v3/v4 are LIVE, v5 extends them', False),
    ('CARRY',          ['python3', 'gates/carry_gate.py', '.'],
     'the registry never eats a live file', False),
    ('ENGINE SYNC',    ['python3', 'gates/bohemia_sync_gate.py', '.'],
     'no module has two bodies', False),
    ('BUNDLE',         ['node', 'gates/bundle_gate.js'],
     'the bundle never lies about its md5s', False),
    ('GRAVEYARD',      ['python3', 'gates/bohemia_graveyard_gate.py', '.', '--strict'],
     'dead things stay dead', False),
    ('ENGINE TESTS',   ['node', 'engine/bohemia_graphics_tests.js'],
     'the graphics engine itself', False),
    ('SIDEWALK',       ['node', 'gates/sidewalk_gate.js'],
     'sidewalk sanctity', False),
    ('LINE COLOR',     ['node', 'gates/line_gate.js'],
     'yellow=direction, white=lane', False),
    ('TAN WALL',       ['node', 'gates/tan_gate.js'],
     '85/15 tan, independent of weathering', False),
    ('ITEM SCALE',     ['node', 'gates/scale_gate.js'],
     "848 flags resolve", False),
    ('LIGHT REGISTRY', ['node', 'gates/lightreg_gate.js'],
     'dark is the default, circuits decide', False),
    ('PATROL',         ['node', 'gates/patrol_gate.js'],
     'owners patrol what they light', False),
    ('SLICE V11',      ['node', 'gates/test_v11.js'],
     'occupancy, beat, world clock', False),
    ('QUESTBOOK',      ['python3', 'gates/questbook_gate.py'],
     'v2 files are implementable, numbers audited', False),
    ('BQ FORMAT',      ['node', 'engine/bohemia_bq_tests.js'],
     'the .bq parser/validator contract (alias-fill, dead links, no stat gates)', False),
    ('QUEST RUNTIME',  ['node', 'engine/bohemia_quest_runtime_tests.js'],
     'the .bq runtime plays a quest to COMPLETE/FAIL', False),
    ('ENGINE CORE',    ['node', 'engine/bohemia_tests.js'],
     'the monolith: fold, heir, save, recorded/unrecorded amalgamation model', False),
    ('LOOP QUESTS',    ['node', 'engine/bohemia_loop_quests_tests.js'],
     'quests are pullable from the GameContext and resume from the save', False),
    ('LOOP ENTITIES',  ['node', 'engine/bohemia_loop_entities_tests.js'],
     'the spawner is pullable from the context, deterministic, dead-stays-dead', False),
    ('LOOP LEDGER',    ['node', 'engine/bohemia_loop_ledger_tests.js'],
     'quest choices/outcomes feed the choice-log (fold + amalgamation see them)', False),
    ('LOOP TALK',      ['node', 'engine/bohemia_loop_talk_tests.js'],
     'an NPC tile offers its quest when the player steps up; binding rides the save', False),
    ('LOOP SLICE',     ['node', 'engine/bohemia_loop_slice_tests.js'],
     'the whole goal-slice loop headless: walk->talk->play->journal->save/reload->fold', False),
    ('LOOP CHANNEL',   ['node', 'engine/bohemia_loop_channel_tests.js'],
     'feed quests pick up over the phone; phoneless (homeless) only in person', False),
    ('LOOP FEED',      ['node', 'engine/bohemia_loop_feed_tests.js'],
     'the feed: every deed is a newest-first post over the recorded choice-log', False),
    ('LOOP CLOUT',     ['node', 'engine/bohemia_loop_clout_tests.js'],
     'reckless deeds earn dramatically more followers than quiet ones (Paolo lock)', False),
    ('LOOP PROFILE',   ['node', 'engine/bohemia_loop_profile_tests.js'],
     'the social profile: posts/quests/reach over the feed, CLOUT-weighted by default', False),
    ('MUSIC',          ['python3', 'gates/music_gate.py'],
     'screech-clean, voices defined, new voices + variety per batch', False),
    ('LEAF PIXEL',     ['python3', 'gates/bohemia_leaf_gate.py', '--strict'],
     'structure frozen in every clip', True),
    ('PURITY',         ['python3', 'gates/bohemia_purity_gate.py'],
     'purple is the Amalgamation alone', True),
]

def run(argv):
    try:
        p = subprocess.run(argv, capture_output=True, text=True, timeout=1800)
        return p.returncode, (p.stdout or '') + (p.stderr or '')
    except FileNotFoundError:
        return 127, 'gate file missing: ' + argv[-1]
    except subprocess.TimeoutExpired:
        return 124, 'timed out'

def summarize(name, out):
    """One line that says what actually happened, not just pass/fail."""
    for line in out.split('\n'):
        l = line.strip()
        if 'ENGINE SYNC LAW HOLDS' in l or 'VIOLATED' in l: return l
        if l.startswith('=== ') and ('passed' in l or 'FAIL' in l): return l.strip('= ')
        if 'pass /' in l: return l
        if 'LIVE REFERENCES' in l: return l
        if 'clips checked' in l: return l
        if 'images checked' in l: return l
    return out.strip().split('\n')[-1][:70] if out.strip() else ''

def main():
    fast = '--fast' in sys.argv
    strict = '--strict' in sys.argv
    print('=' * 78)
    print('BOHEMIA GATES')
    print('=' * 78)
    failed = []
    t0 = time.time()
    for name, argv, what, slow in GATES:
        if fast and slow:
            print('  %-15s SKIP     %s' % (name, what))
            continue
        t = time.time()
        rc, out = run(argv)
        ok = (rc == 0)
        if not ok:
            failed.append(name)
        print('  %-15s %-8s %-38s %5.1fs' % (name, 'GREEN' if ok else 'FAIL', what, time.time() - t))
        s = summarize(name, out)
        if s:
            print('                   %s' % s[:88])
        if not ok:
            for line in out.split('\n'):
                if 'FAIL' in line or 'VIOLAT' in line or 'Error' in line:
                    print('                   > %s' % line.strip()[:88])
    print('=' * 78)
    if failed:
        print('  %d GATE(S) FAILED: %s   (%.0fs)' % (len(failed), ', '.join(failed), time.time() - t0))
    else:
        print('  ALL GATES GREEN   (%.0fs)' % (time.time() - t0))
    return 1 if (failed and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
