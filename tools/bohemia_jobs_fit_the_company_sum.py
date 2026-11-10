#!/usr/bin/env python3
# JOBS [jobs that fit] 11/8: the summary of tools/bohemia_jobs_fit_the_company.js's measurement (one or more of its --json files).
# Per crew and day, over every seed: THE DEALT VIEW (every offer the tier could post, read: the job math before any filter) and THE
# BOARDS (the shelf's own deal through the day's filter: what he sees): the share lost more often than won (worth under 0.5 on the AUTO
# count), the stars, the enemies a man, the pay a man, the truth replays (stars against fresh dice), and what the lost jobs are.
# python3 tools/bohemia_jobs_fit_the_company_sum.py a.json [b.json ...] [--json summary.json]
import json, sys, statistics as st
from collections import Counter, defaultdict
args = sys.argv[1:]
OUT = args[args.index('--json') + 1] if '--json' in args else None
files = [a for a in args if a.endswith('.json') and a != OUT]
# the job's kind, the job kinds' own table (records/target/BOHEMIA_JOB_KINDS.json offers[id].kind, else its title guess), read offline
import re, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
KD = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json')))
SH = {o['id']: o for o in json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json')))['offers']}
def kind_of(i):
    row = (KD.get('offers') or {}).get(i)
    if row and row.get('kind'): return row['kind']
    t = (SH.get(i) or {}).get('title', '')
    for g in KD.get('guess') or []:
        try:
            if re.search(g['re'], t, re.I): return g['kind']
        except Exception: pass
    return KD.get('default') or 'clear-crew'
runs = []
for f in files:
    d = json.load(open(f))
    for r in d['runs']:
        r['_hires'] = d.get('hires', 0); runs.append(r)

def crewname(r): return r['origin'] + ('+%d' % r['_hires'] if r['_hires'] else '')
by = defaultdict(lambda: {'seeds': set(), 'dealt': [], 'posted': [], 'truth': [], 'men': 1, 'boards': 0, 'empty': 0})
for r in runs:
    men = (r.get('crew') or {}).get('men') or 1
    for D in r['days']:
        B = by[(crewname(r), D['day'])]
        B['men'] = men; B['seeds'].add(D['code']); B['boards'] += D['places']
        B['dealt'] += [j for j in D['dealt'] if j.get('clean') is not None]
        P = [j for j in D['posted'] if j.get('clean') is not None]
        B['posted'] += P
        for j in P:
            if j.get('truth'): B['truth'].append((j['stars'], j['clean'], j['truth']['clean'], j['truth']['stars']))
lost = lambda L: [j for j in L if j['clean'] < 0.5]
share = lambda a, b: round(100.0 * len(a) / max(1, len(b)))
summary = []
print('%-10s %4s %5s | %-44s | %-46s | %s' % ('crew', 'day', 'seeds', 'DEALT (the job math): n, lost>won, 1/2/3 stars', 'BOARDS (what he sees): n, lost>won, 1/2/3 stars', 'enemies a man (sure fights), pay a man, truth: n, lies'))
for key in sorted(by, key=lambda k: (k[0], k[1])):
    B = by[key]; D, P = B['dealt'], B['posted']
    sd = [sum(1 for j in D if j['stars'] == s) for s in (1, 2, 3)]
    sp = [sum(1 for j in P if j['stars'] == s) for s in (1, 2, 3)]
    epm = [j['sure_men'] / B['men'] for j in P if j.get('sure_men')]
    pay = [j['pay'] / B['men'] for j in P if j.get('pay')]
    # a lie: the star the board showed against the fresh dice's star by more than one line: one star that comes home under 0.65 clean,
    # three stars that come home at 0.8 or better (rule 208(f)'s pooled bars, per job)
    lies = [t for t in B['truth'] if (t[0] == 1 and t[2] < 0.65) or (t[0] == 3 and t[2] >= 0.8)]
    same = [t for t in B['truth'] if t[0] == t[3]]
    print('%-10s %4d %5d | %4d  %3d%%  %4d/%4d/%4d  worth %.2f      | %4d  %3d%%  %4d/%4d/%4d  worth %.2f       | %.1f  %.0f  truth %d, lies %d, same star %d%%' % (
        key[0], key[1], len(B['seeds']), len(D), share(lost(D), D), sd[0], sd[1], sd[2], st.mean([j['clean'] for j in D]) if D else 0,
        len(P), share(lost(P), P), sp[0], sp[1], sp[2], st.mean([j['clean'] for j in P]) if P else 0,
        st.median(epm) if epm else 0, st.mean(pay) if pay else 0, len(B['truth']), len(lies), share(same, B['truth'])))
    kinds = Counter(kind_of(j['id']) for j in lost(D))
    facs = Counter((j.get('faction') or '?') for j in lost(D))
    if lost(D): print('             dealt lost>won by kind: ' + ', '.join('%s %d' % kv for kv in kinds.most_common(7)) + ' | by foe: ' + ', '.join('%s %d' % kv for kv in facs.most_common(7)))
    summary.append({'crew': key[0], 'day': key[1], 'seeds': len(B['seeds']), 'men': B['men'],
                    'dealt': len(D), 'dealt_lost_pct': share(lost(D), D), 'dealt_stars': sd, 'dealt_worth': round(st.mean([j['clean'] for j in D]), 3) if D else None,
                    'posted': len(P), 'posted_lost_pct': share(lost(P), P), 'posted_stars': sp, 'posted_worth': round(st.mean([j['clean'] for j in P]), 3) if P else None,
                    'enemies_a_man': st.median(epm) if epm else None, 'pay_a_man': round(st.mean(pay), 1) if pay else None,
                    'truth': len(B['truth']), 'lies': len(lies), 'same_star_pct': share(same, B['truth']),
                    'dealt_lost_by_kind': dict(kinds.most_common()), 'dealt_lost_by_foe': dict(facs.most_common())})
# the dealt view by job kind and skulls, pooled over every day and seed: where the job math overshoots the company
print('\nTHE DEALT VIEW BY KIND (every day, every seed): crew | kind | skulls | n | lost>won | median worth | median sure men a man')
pool = defaultdict(list)
for key in by:
    for j in by[key]['dealt']: pool[(key[0], kind_of(j['id']), j['skulls'])].append(j)
for k in sorted(pool):
    L = pool[k]; men = by[[x for x in by if x[0] == k[0]][0]]['men']
    print('  %-10s %-16s %d  %4d  %3d%%  %.2f  %.1f' % (k[0], k[1], k[2], len(L), share(lost(L), L), st.median([j['clean'] for j in L]), st.median([j['sure_men'] / men for j in L])))
if OUT:
    json.dump({'draft': True, 'from': files, 'summary': summary,
               'by_kind': [{'crew': k[0], 'kind': k[1], 'skulls': k[2], 'n': len(L), 'lost_pct': share(lost(L), L), 'worth_median': st.median([j['clean'] for j in L])} for k, L in sorted(pool.items())]}, open(OUT, 'w'), indent=1)
