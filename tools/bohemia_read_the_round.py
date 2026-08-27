#!/usr/bin/env python3
"""BOHEMIA READ THE ROUND (8/27/26, PEOPLE lane) -- eight pastes in, one page out.

THE PROTOCOL ALREADY SAYS THIS HAS TO HAPPEN, in its own words: "Each tester
sends Paolo ONE paste; Paolo forwards pastes to any chat; the coordinator
compiles all rounds into one digest (where they quit, what confused, what they
said)." The card collects. Nothing reads.

AND A FORMAT IS NOT PROVEN READABLE UNTIL SOMETHING READS IT. This is as much a
test of the paste as it is a tool: if eight of them cannot be laid side by side
and diffed against round two, the format is wrong and the time to find that out
is before the round, not after it. First impressions spend once.

NOTHING IN HERE IS RETYPED FROM THE CARD. The questions and the list of things
the instrument cannot answer are READ OUT OF engine/bohemia_blackbox.js at run
time, so a session that rewords a question cannot leave this tool quoting the
old one. A retyped constant is how this repo's population dial said 19 when the
truth was 1.1.

    python3 tools/bohemia_read_the_round.py round/*.txt
    python3 tools/bohemia_read_the_round.py round1/*.txt --against round0/*.txt

WHAT IT REFUSES TO DO: average anything into a score. Five people is not a
sample, it is five people, and a mean of five opinions is a number that looks
like evidence. Counts and verbatim quotes only.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODULE = os.path.join(ROOT, 'engine/bohemia_blackbox.js')


def card_words():
    """The questions and the limits, read off the module rather than retyped."""
    src = open(MODULE, encoding='utf-8').read()
    asks = re.findall(r"^\s+ask: '([^']+)'", src, re.M)
    if len(asks) < 4:
        sys.exit('READ THE ROUND FAILED: found %d questions in %s, expected at least 4. '
                 'The card changed shape under this tool and it will not guess.'
                 % (len(asks), os.path.relpath(MODULE, ROOT)))
    block = re.search(r'var CANNOT = \[(.*?)\];', src, re.S)
    cannot = re.findall(r"'([^']+)'", block.group(1)) if block else []
    beats = re.findall(r"said: '([^']+)'", src)
    return asks, cannot, beats


def parse(path):
    """One paste. Unreadable is REPORTED, never skipped: a tester whose paste we
    could not read is a finding about us, and silently dropping them turns eight
    testers into six without anybody noticing."""
    txt = open(path, encoding='utf-8', errors='replace').read()
    if 'BOHEMIA / ONE DAY' not in txt:
        return {'file': os.path.basename(path), 'broken': 'not a Bohemia paste'}
    r = {'file': os.path.basename(path), 'broken': None, 'answers': {}, 'words': '',
         'reached': [], 'missed': []}
    for key in ('BUILD', 'SEED', 'DEVICE', 'PLAYED', 'GOT AS FAR AS',
                'STOPPED THERE FOR', 'IN GAME'):
        m = re.search(r'^' + key + r': (.*)$', txt, re.M)
        r[key] = m.group(1).strip() if m else None
    r['reached'] = re.findall(r'^\s+\d+m \d+s\s+(.+)$', txt, re.M)
    m = re.search(r'^NEVER GOT TO:\n\s+(.+)$', txt, re.M)
    r['missed'] = [s.strip() for s in m.group(1).split(',')] if m else []
    asks, _c, _b = card_words()
    for q in asks[:3]:
        m = re.search(re.escape(q) + r'\n\s{2}(.+)$', txt, re.M)
        a = m.group(1).strip() if m else '(no answer)'
        r['answers'][q] = None if a == '(no answer)' else a
    m = re.search(re.escape(asks[3]) + r'\n\s{2}(.+?)(?:\n\n|\n---)', txt, re.S)
    w = m.group(1).strip() if m else ''
    r['words'] = '' if w == '(nothing written)' else w
    return r


def secs(played):
    m = re.match(r'(\d+)m (\d+)s', played or '')
    return int(m.group(1)) * 60 + int(m.group(2)) if m else None


def tally(rows, key):
    out = {}
    for r in rows:
        v = r.get(key)
        if v:
            out[v] = out.get(v, 0) + 1
    return sorted(out.items(), key=lambda kv: -kv[1])


def bar(n, of):
    return '#' * n + '.' * max(0, of - n)


def digest(rows, label):
    asks, cannot, beats = card_words()
    good = [r for r in rows if not r['broken']]
    bad = [r for r in rows if r['broken']]
    L = []
    L.append('=' * 74)
    L.append('  ' + label + ': ' + str(len(good)) + ' pastes read'
             + (', ' + str(len(bad)) + ' UNREADABLE' if bad else ''))
    L.append('=' * 74)
    for b in bad:
        L.append('  UNREADABLE  ' + b['file'] + '   (' + b['broken'] + ')')
    if not good:
        return '\n'.join(L)

    builds = tally(good, 'BUILD')
    L.append('')
    L.append('WHICH BUILD THEY WERE ON')
    for v, n in builds:
        L.append('  %2d  %s' % (n, v))
    if len(builds) > 1:
        L.append('  *** MORE THAN ONE BUILD IN THIS ROUND. Their quit points are not')
        L.append('      comparable to each other until you know which change landed when.')
    seeds = tally(good, 'SEED')
    if len(seeds) > 1:
        L.append('  *** MORE THAN ONE SEED. Different valleys, so nothing about WHERE')
        L.append('      they got lost can be compared across these testers.')
    L.append('')
    L.append('DEVICES')
    for v, n in tally(good, 'DEVICE'):
        L.append('  %2d  %s' % (n, v[:96]))

    L.append('')
    L.append('HOW FAR THEY GOT  (the only line that answers "is the demo working")')
    far = tally(good, 'GOT AS FAR AS')
    for v, n in far:
        L.append('  %-28s %s  %d' % (v, bar(n, len(good)), n))
    stuck = [r for r in good if r['GOT AS FAR AS'] != beats[-1]]
    if stuck:
        L.append('')
        L.append('  AND HOW LONG EACH ONE SAT THERE BEFORE THEY STOPPED')
        for r in sorted(stuck, key=lambda r: r['file']):
            L.append('    %-22s %-26s sat %s' % (r['file'][:22],
                     r['GOT AS FAR AS'], r['STOPPED THERE FOR'] or '?'))
    L.append('')
    L.append('  WHAT NOBODY REACHED')
    every = set(beats)
    for r in good:
        every &= set(r['missed'])
    L.append('    ' + (', '.join(sorted(every, key=beats.index)) if every
                       else 'nothing. every beat was reached by somebody.'))

    times = [t for t in (secs(r['PLAYED']) for r in good) if t is not None]
    if times:
        times.sort()
        L.append('')
        L.append('HOW LONG THEY PLAYED   shortest %dm  middle %dm  longest %dm'
                 % (times[0] // 60, times[len(times) // 2] // 60, times[-1] // 60))

    for i, q in enumerate(asks[:3]):
        L.append('')
        L.append(q)
        counts = {}
        for r in good:
            a = r['answers'].get(q) or '(did not answer)'
            counts[a] = counts.get(a, 0) + 1
        for v, n in sorted(counts.items(), key=lambda kv: -kv[1]):
            L.append('  %-28s %s  %d' % (v, bar(n, len(good)), n))
        if i == 0:
            yes = counts.get('I already want to', 0)
            L.append('  -> %d of %d would send it TODAY. That is the number. The middle'
                     % (yes, len(good)))
            L.append('     answer is people being kind and it does not count.')

    L.append('')
    L.append(asks[3].upper() + ', VERBATIM AND UNEDITED')
    said = [r for r in good if r['words']]
    if not said:
        L.append('  nobody wrote anything. That is itself a finding: the box is at the')
        L.append('  bottom of the card and they may never have reached it.')
    for r in said:
        L.append('  ' + r['file'] + ':')
        L.append('    "' + r['words'] + '"')

    L.append('')
    L.append('WHAT THIS PAGE CANNOT TELL YOU')
    for c in cannot:
        L.append('  - ' + c)
    L.append('  - and nothing here is averaged into a score, on purpose. Five people')
    L.append('    is five people, and a mean of five opinions looks like evidence.')
    return '\n'.join(L)


def main():
    args = [a for a in sys.argv[1:]]
    if not args:
        sys.exit(__doc__.strip().split('\n\n')[0] + '\n\n  '
                 + 'python3 tools/bohemia_read_the_round.py round/*.txt')
    if '--against' in args:
        i = args.index('--against')
        now, before = args[:i], args[i + 1:]
    else:
        now, before = args, []
    print(digest([parse(p) for p in now], 'THIS ROUND'))
    if before:
        print('\n\n' + digest([parse(p) for p in before], 'THE ROUND BEFORE'))
        print('\n' + '=' * 74)
        print('  READ THE TWO "HOW FAR THEY GOT" BLOCKS AGAINST EACH OTHER. If the')
        print('  quit points moved later and more people would send it today, the')
        print('  demo is converging. NEVER re-screen a revised cut to the same')
        print('  audience: they compare it to memory instead of to nothing.')
        print('=' * 74)


if __name__ == '__main__':
    main()
