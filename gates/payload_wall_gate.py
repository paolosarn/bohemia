#!/usr/bin/env python3
"""THE PAYLOAD WALL (8/2/26) — the cliff nobody had measured.

Paolo, 8/2: "We need to do so much that we know that we don't know you need to be able
to know that. WE HAVE 11 months of forward motion work we need to complete."

So I went looking for what is NOT on records/BOHEMIA_THE_BIG_MISSING_7_29_26.md, and the
first thing I measured was the file he taps.

  slices/BOHEMIA_ALPHA_0_9.html is 38.7 MB.
  It grew 2.09 MB/day over the last two days, measured off git.
  GITHUB REFUSES ANY FILE OVER 100 MB. Not a warning - the push is rejected.
  At that rate the alpha stops being pushable in about FOUR WEEKS.

Nobody wrote that down anywhere. Every lane would have kept shipping into it and then one
ordinary Tuesday every push in the project starts failing at once, on a limit nobody was
watching, with no obvious cause. That is the shape of a real unknown-unknown: not a hard
problem, an UNWATCHED one.

WHERE THE BYTES ACTUALLY ARE, measured rather than assumed:
  35.76 MB   ONE line - const CITY_B64='...' - a whole HTML page base64'd inline
   1.35 MB   COMBAT_B64, same trick
   0.90 MB   all the actual code and markup in the file

And base64 costs 33% on top of the bytes it carries: that 35.76 MB of text is 26.82 MB of
real page, so ~9 MB of the alpha is the ENCODING and nothing else. Four other tabs (RUN,
SLICE, LIFE, MAP) already load their page from a sibling file with data-src and pay none
of it - so the cheaper pattern is already in the same file, four times over.

WHAT THIS GATE DOES: it is an ALARM, not an opinion. It measures every file the fleet has
to be able to push, reports the projection, and FAILS at a budget set well below the wall
so somebody sees it with weeks of room instead of on the day it lands.

  python3 gates/payload_wall_gate.py
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

MB = 1048576.0
GITHUB_HARD_LIMIT = 100 * MB      # push REJECTED above this. not negotiable, not ours.
GITHUB_WARN_LIMIT = 50 * MB       # GitHub starts warning here
BUDGET = 45 * MB                  # ours, deliberately below the warning
PHONE_BUDGET = 8 * MB             # what the ONE LINK should cost on first tap

P = F = 0
notes = []


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def tracked_files():
    out = subprocess.run(['git', 'ls-files', '-z'], capture_output=True, text=True).stdout
    return [f for f in out.split('\0') if f and os.path.exists(f)]


def growth_per_day(path):
    """measured off git, never guessed. returns (bytes/day, days_of_data) or (None, 0)."""
    log = subprocess.run(
        ['git', 'log', '--format=%H %ad', '--date=short', '-n', '80', '--', path],
        capture_output=True, text=True).stdout.strip().split('\n')
    seen = {}
    for line in log:
        if not line.strip():
            continue
        sha, date = line.split()[0], line.split()[-1]
        if date in seen:
            continue
        blob = subprocess.run(['git', 'rev-parse', '%s:%s' % (sha, path)],
                              capture_output=True, text=True).stdout.strip()
        if not blob:
            continue
        size = subprocess.run(['git', 'cat-file', '-s', blob],
                              capture_output=True, text=True).stdout.strip()
        if size.isdigit():
            seen[date] = int(size)
    if len(seen) < 2:
        return None, 0
    days = sorted(seen)
    span = (len(days) - 1)
    return (seen[days[-1]] - seen[days[0]]) / float(span), span


def main():
    print('THE PAYLOAD WALL - what the fleet can still push, and for how long')

    files = tracked_files()
    chk(len(files) > 100, 'git ls-files returned almost nothing - cannot audit')

    big = sorted(((os.path.getsize(f), f) for f in files), reverse=True)[:8]
    notes.append('largest tracked files: ' + ', '.join(
        '%s %.1fMB' % (os.path.basename(f), s / MB) for s, f in big))

    over_hard = [(s, f) for s, f in big if s >= GITHUB_HARD_LIMIT]
    chk(not over_hard,
        'A FILE IS ALREADY OVER GITHUB\'S 100 MB HARD LIMIT and cannot be pushed: %s'
        % ', '.join('%s (%.1f MB)' % (f, s / MB) for s, f in over_hard))

    over_warn = [(s, f) for s, f in big if GITHUB_WARN_LIMIT <= s < GITHUB_HARD_LIMIT]
    for s, f in over_warn:
        notes.append('*** %s is %.1f MB - past GitHub\'s 50 MB warning line ***' % (f, s / MB))

    over_budget = [(s, f) for s, f in big if s >= BUDGET]
    chk(not over_budget,
        'OVER THE FLEET BUDGET of %.0f MB, which exists so somebody sees the 100 MB wall '
        'with weeks of room instead of on the day a push starts failing: %s. The bytes are '
        'almost certainly a base64 blob - four tabs in the alpha already load their page '
        'from a sibling file with data-src and pay no encoding tax at all.'
        % (BUDGET / MB, ', '.join('%s (%.1f MB)' % (f, s / MB) for s, f in over_budget)))

    # THE PROJECTION. This is the part that turns a number into a date.
    alpha = 'slices/BOHEMIA_ALPHA_0_9.html'
    if os.path.exists(alpha):
        size = os.path.getsize(alpha)
        rate, span = growth_per_day(alpha)
        notes.append('the one link he taps: %.1f MB' % (size / MB))
        if rate and rate > 0:
            days = (GITHUB_HARD_LIMIT - size) / rate
            notes.append('growth %.2f MB/day measured over %d day(s) of git history'
                         % (rate / MB, span))
            notes.append('AT THAT RATE THE ALPHA CANNOT BE PUSHED AT ALL IN %.0f DAYS '
                         '(~%.1f weeks)' % (days, days / 7))
            chk(days > 60,
                'THE PROJECT STOPS SHIPPING IN %.0f DAYS. The alpha is %.1f MB and gaining '
                '%.2f MB/day; GitHub rejects any file over 100 MB outright. Every lane '
                'pushes this file, so when it lands nobody can ship anything.'
                % (days, size / MB, rate / MB))
        else:
            notes.append('not enough git history in this clone to measure growth')

        # what it costs HIM, on a phone, on the one link
        chk(size <= PHONE_BUDGET,
            'FIRST TAP COSTS %.0f SECONDS ON WEAK LTE (%.1f MB at 5 Mbps). He opens this on '
            'a phone. The four tabs that load a sibling file fetch it only when he opens '
            'them; the two that inline a base64 blob make him download both before the '
            'splash draws.' % ((size * 8 / 1e6) / 5.0, size / MB))

        # name the actual bytes so the fix is obvious rather than a hunt
        blobs = []
        with open(alpha, encoding='utf-8', errors='replace') as fh:
            for n, line in enumerate(fh, 1):
                if len(line) > 200000:
                    tag = line.strip()[:40]
                    blobs.append((len(line), n, tag))
        for ln, n, tag in sorted(blobs, reverse=True):
            notes.append('  line %-6d %7.2f MB  %s' % (n, ln / MB, tag))
        inline = sum(b[0] for b in blobs)
        if inline:
            notes.append('  -> %.1f MB of the %.1f MB file is inlined blobs (%.0f%%); base64 '
                         'carries a 33%% tax, so ~%.1f MB of it is pure encoding'
                         % (inline / MB, size / MB, 100.0 * inline / size, inline * 0.25 / MB))

    for n in notes:
        print('  NOTE  ' + n)
    print('  %d passed, %d FAILED' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
