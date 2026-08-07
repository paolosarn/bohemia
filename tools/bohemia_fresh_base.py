#!/usr/bin/env python3
"""BOHEMIA FRESH BASE (8/7/26) -- prove you are standing in the repository you
think you are, BEFORE the first edit.

WHY THIS EXISTS: records/BOHEMIA_THE_CHECKOUT_LIES_8_7_26.md

Twice in one session the working directory silently reverted to a snapshot ~530
commits behind main, while GitHub kept every push. Git reported nothing: status
clean, log plausible, every file present. The first time I did an entire job
against it -- patch, audit, gate, mutation test, FULL GREEN SUITE -- on an alpha
missing 4,323 lines of five other lanes' work. Pushing would have reverted 547
commits, and every gate was green, because gates measure the tree they are handed.

A GREEN SUITE PROVES NOTHING ABOUT WHICH TREE YOU ARE STANDING IN.

The second time it manufactured evidence that a TRUE finding was false: a file
that is tracked on main (records/target/BOTTOMLEFT.png) looked like it had never
existed in the repo's whole history, and I was one step from writing a retraction.

THE CHECK MUST BE REMOTE. Every convenient check reads local refs and local refs
are the thing that lies:

    $ git ls-remote origin main   ->  aa7bf3c7...
    $ git rev-parse origin/main   ->  c5d4dc6      STALE, and no error anywhere

`git fetch` was timing out on this ~500 MB repo and leaving the remote-tracking
ref untouched. `--depth=1` surfaced why:

    error: cannot lock ref 'refs/remotes/origin/main': is at aa7bf3c7... but
    expected c5d4dc6...

-- the ref file on disk was already correct while rev-parse kept answering with
the old value. So "am I behind origin/main?" can answer NO while being ~530
commits behind. Same bug as the SIX PHANTOM ROLLBACKS earlier in this lane, which
were never rollbacks: fetch failed, origin/main went stale, main looked gutted.

WHAT IT DOES
  1. asks the REMOTE for main's sha (git ls-remote -- always a network round trip,
     never a cached ref)
  2. compares it to the local remote-tracking ref and REPAIRS it with
     `git fetch --force` when they disagree
  3. reports where HEAD stands against the real remote sha, in commits
  4. exits non-zero when the base is stale, so it can gate a script

It deliberately does NOT reset anything. A session may legitimately be mid-rebase
or holding unpushed work, and a tool that helpfully throws that away is a worse
bug than the one it is fixing. It tells you; you decide.

RUN IT BEFORE THE FIRST EDIT, AND AGAIN AFTER ANY LONG STEP. Checking at push time
means you have already done the work twice, which is exactly what today cost. The
full suite takes ~30 minutes here and both of today's reverts landed either side
of one.

    python3 tools/bohemia_fresh_base.py [--branch main] [--quiet]
"""
import subprocess
import sys

BRANCH = 'main'
if '--branch' in sys.argv:
    BRANCH = sys.argv[sys.argv.index('--branch') + 1]
QUIET = '--quiet' in sys.argv


def git(*args, timeout=300):
    """Never raises on a non-zero exit: a failed fetch is a RESULT here, not a
    crash, and swallowing its exit code is how the stale ref stayed invisible."""
    p = subprocess.run(['git'] + list(args), capture_output=True, text=True, timeout=timeout)
    return p.returncode, p.stdout.strip(), p.stderr.strip()


def say(*a):
    if not QUIET:
        print(*a)


say('BOHEMIA FRESH BASE — is this the repository you think it is?')

# 1. THE ONLY TRUSTWORTHY SOURCE. ls-remote goes to the network every time and
#    cannot be served by a stale local ref.
rc, out, err = git('ls-remote', 'origin', 'refs/heads/' + BRANCH)
if rc != 0 or not out:
    print('  CANNOT REACH THE REMOTE — ' + (err or 'no output')[:160])
    print('  This is not a pass. You do not know where you are; retry before editing.')
    sys.exit(2)
remote_sha = out.split()[0]

_, head_sha, _ = git('rev-parse', 'HEAD')
_, local_ref, _ = git('rev-parse', 'origin/' + BRANCH)

say('  remote origin/%-4s  %s   (git ls-remote, the truth)' % (BRANCH, remote_sha[:9]))
say('  local  origin/%-4s  %s' % (BRANCH, local_ref[:9]))
say('  HEAD                %s' % head_sha[:9])

# 2. REPAIR A STALE TRACKING REF. --force matters: the plain fetch is what fails
#    silently, and it fails by REFUSING to move a ref it thinks it already knows.
if local_ref != remote_sha:
    say('  local tracking ref is STALE — repairing with an explicit forced fetch')
    rc, _, err = git('fetch', '--force', 'origin',
                     '+refs/heads/%s:refs/remotes/origin/%s' % (BRANCH, BRANCH), timeout=600)
    if rc != 0:
        say('  forced fetch reported: ' + err[:200])
    _, local_ref, _ = git('rev-parse', 'origin/' + BRANCH)
    say('  local  origin/%-4s  %s  (after repair)' % (BRANCH, local_ref[:9]))

# 2b. A SHALLOW CLONE MAKES EVERY ANCESTRY ANSWER A LIE, AND SAYS NOTHING.
#     I did this to myself on 8/7. When the full fetch kept timing out I reached
#     for `git fetch --depth=1` to get the sha -- which is the FIRST thing anyone
#     reaches for in exactly the situation this tool exists for -- and that grafts
#     a shallow boundary. History is truncated, so merge-base and rev-list answer
#     from a stump: this tool then reported HEAD as "2 behind and 703 AHEAD" of a
#     commit it had been sitting exactly on minutes earlier. Nothing warned.
#     A wrong ancestry answer is worse than no answer, so refuse to give one.
if git('rev-parse', '--is-shallow-repository')[1] == 'true':
    print('  *** THIS CLONE IS SHALLOW — ANCESTRY CANNOT BE TRUSTED ***')
    print('  merge-base and rev-list read a truncated history and will report')
    print('  confident nonsense (measured: "2 behind, 703 ahead" of a commit HEAD')
    print('  was sitting on). Usually caused by a `--depth=N` fetch reached for')
    print('  when the full one timed out. Repair before deciding anything:')
    print('      git fetch --unshallow origin')
    sys.exit(3)

# 3. WHERE DOES HEAD ACTUALLY STAND? Measured against the REMOTE sha, not the
#    local ref, because the local ref is the thing that was lying.
have_remote = git('cat-file', '-t', remote_sha)[0] == 0
if not have_remote:
    print('  THE REMOTE COMMIT IS NOT IN THIS CLONE AT ALL (%s).' % remote_sha[:9])
    print('  The checkout is not merely behind, it does not contain main. DO NOT EDIT.')
    sys.exit(1)

rc_anc = git('merge-base', '--is-ancestor', remote_sha, head_sha)[0]
_, behind, _ = git('rev-list', '--count', '%s..%s' % (head_sha, remote_sha))
_, ahead, _ = git('rev-list', '--count', '%s..%s' % (remote_sha, head_sha))
behind = int(behind or 0)
ahead = int(ahead or 0)

if rc_anc == 0:
    say('  BASE IS FRESH — HEAD contains origin/%s%s' %
        (BRANCH, (', +%d commit(s) of your own' % ahead) if ahead else ''))
    sys.exit(0)

print('  *** STALE BASE: HEAD IS %d COMMIT(S) BEHIND origin/%s ***' % (behind, BRANCH))
if ahead:
    print('  and %d commit(s) ahead — you have work here that main does not.' % ahead)
    print('  REBASE, do not reset: `git rebase origin/%s`' % BRANCH)
else:
    print('  nothing of your own is here: `git checkout -B <branch> origin/%s`' % BRANCH)
print('  Do NOT trust a green suite run on this tree, and do NOT push from it.')
sys.exit(1)
