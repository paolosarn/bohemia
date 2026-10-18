#!/usr/bin/env python3
"""EYES AND EARS -- THE KEEP RATE AND THE QUEUE (lane 17, row [the keep rate and the queue], 10/18)

Rule 113(e), two of the coordinator's four signals: the VOTE tab's KEEP RATE (his YES share of the items he judged
in one sitting; under about 40 percent for two sittings means weak candidates, tighten the filter, never grow the
ballot) and THE QUEUE WAITING ON HIM (over about twenty items means the coordinator stopped shielding him).

READ ONLY: it reads records/target/BOHEMIA_VOTE_REGISTRY.json and the coordinator's BOHEMIA_VOTE_TRIAGE.json and
never edits either.

A SITTING is one export of his: the verdicts sharing one 'when' (the date he voted) and one 'at' (the date the
export was spliced). Two exports spliced the same day under one 'when' cannot be told apart from the file and are
counted as one sitting; that is said on the page, not hidden.

WAITING ON HIM is what the tab can still put in front of him: an item with no verdict whose triage tag is red,
yellow or none. Green and gray never render (the tab's own draw(), UI [the triage filter]), so they wait on nobody.

USAGE:  python3 tools/bohemia_eyes_the_keep_rate_and_the_queue_10_18_26.py          # both numbers, per sitting and lane
        python3 tools/bohemia_eyes_the_keep_rate_and_the_queue_10_18_26.py --json   # the same as data
        python3 tools/bohemia_eyes_the_keep_rate_and_the_queue_10_18_26.py --gate   # red when over about twenty wait on him
"""
import collections, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
TRI = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_TRIAGE.json')
QUEUE_CAP = 20          # rule 113(c): 'at most ABOUT TWENTY items waiting on him'
KEEP_FLOOR = 40         # rule 113(e): 'under about 40 percent for two sittings'


def md(s):
    """'10/17' -> (10, 17) so sittings sort by date, not by string."""
    try:
        a, b = str(s).split('/')[:2]
        return (int(a), int(b))
    except Exception:
        return (99, 99)


def measure(reg, tags):
    items = {i['id']: i for i in reg['items']}
    sit = collections.OrderedDict()
    for v in reg['verdicts']:
        key = (v.get('when') or '?', v.get('at') or '')
        sit.setdefault(key, []).append(v)
    sittings = []
    for key in sorted(sit, key=lambda k: (md(k[0]), k[1])):
        vs = sit[key]
        up = sum(1 for v in vs if v.get('vote') == 'up')
        lanes = collections.defaultdict(lambda: [0, 0])
        for v in vs:
            L = lanes[(items.get(v['id']) or {}).get('lane') or '(gone from the registry)']
            L[0] += 1
            L[1] += v.get('vote') == 'up'
        sittings.append({'when': key[0], 'spliced': key[1] or None, 'judged': len(vs), 'yes': up,
                         'keep_pct': round(100.0 * up / len(vs)) if vs else None,
                         'by_lane': {k: {'judged': a, 'yes': b, 'keep_pct': round(100.0 * b / a)} for k, (a, b) in sorted(lanes.items())}})
    judged = {v['id'] for v in reg['verdicts']}
    waiting = collections.Counter()
    by_lane = collections.Counter()
    ids = []
    for it in reg['items']:
        if it['id'] in judged:
            continue
        t = str((tags.get(it['id']) or {}).get('tag') or 'untagged').lower()
        waiting[t] += 1
        if t in ('green', 'gray', 'grey'):
            continue
        by_lane[it.get('lane')] += 1
        ids.append(it['id'])
    on_him = sum(by_lane.values())
    low = [s for s in sittings[-2:] if s['keep_pct'] is not None and s['keep_pct'] < KEEP_FLOOR]
    return {'sittings': sittings, 'waiting_by_tag': dict(waiting), 'waiting_on_him': on_him,
            'waiting_on_him_by_lane': dict(by_lane), 'waiting_on_him_ids': ids,
            'queue_over_cap': on_him > QUEUE_CAP, 'keep_under_floor_two_sittings': len(low) == 2 and len(sittings) >= 2}


def load():
    reg = json.load(open(REG))
    try:
        tags = json.load(open(TRI)).get('tags', {})
    except Exception:
        tags = {}
    return reg, tags


def gate():
    """Planted first: a registry with 21 unsorted items waiting must go red, the same 21 tagged gray must not, and a
    judged item never counts. Then the live file."""
    fails = 0
    fake = {'items': [{'id': 'p%d' % i, 'lane': 'cook'} for i in range(QUEUE_CAP + 1)], 'verdicts': [{'id': 'p0', 'vote': 'up', 'when': '1/1'}]}
    a = measure(fake, {})
    b = measure(fake, {'p%d' % i: {'tag': 'gray'} for i in range(QUEUE_CAP + 1)})
    fake2 = dict(fake, verdicts=fake['verdicts'] + [{'id': 'p1', 'vote': 'down', 'when': '1/1'}])
    c = measure(fake2, {})
    for good, msg in ((a['waiting_on_him'] == QUEUE_CAP and not a['queue_over_cap'], 'twenty waiting after one verdict is at the cap, not over'),
                      (measure(dict(fake, verdicts=[]), {})['queue_over_cap'], 'planted: 21 unsorted waiting goes red'),
                      (b['waiting_on_him'] == 0, 'planted: the same 21 tagged gray wait on nobody'),
                      (c['sittings'][0]['keep_pct'] == 50, 'planted: one yes and one no is a 50 percent sitting')):
        print('  ok  ' if good else '  FAIL', msg); fails += not good
    r = measure(*load())
    live = not r['queue_over_cap']
    print('  ok  ' if live else '  FAIL', 'the live queue waiting on him: %d (cap about %d) %s' % (
        r['waiting_on_him'], QUEUE_CAP, r['waiting_on_him_by_lane'] if not live else ''))
    fails += not live
    k = r['sittings'][-1] if r['sittings'] else {}
    print('  note: the last sitting (%s) kept %s%% of %s; two sittings under %d%% running: %s' % (
        k.get('when'), k.get('keep_pct'), k.get('judged'), KEEP_FLOOR, 'YES' if r['keep_under_floor_two_sittings'] else 'no'))
    print('=== THE QUEUE ON HIM GATE: %s ===' % ('green' if not fails else '%d failed' % fails))
    return 1 if fails else 0


def main():
    if '--gate' in sys.argv:
        return gate()
    r = measure(*load())
    if '--json' in sys.argv:
        print(json.dumps(r, indent=1))
        return 0
    print('THE KEEP RATE, per sitting (his YES share of what he judged):')
    for s in r['sittings']:
        worst = sorted(((v['keep_pct'], k, v['judged']) for k, v in s['by_lane'].items() if v['judged'] >= 3))[:2]
        print('  %-6s %3d judged, %3d yes, keep %3s%%   lowest lanes (3+ judged): %s' % (
            s['when'], s['judged'], s['yes'], s['keep_pct'], ', '.join('%s %d%% of %d' % (k, p, n) for p, k, n in worst) or '-'))
    print('THE QUEUE: %d items wait on him (red, yellow or not sorted yet; cap about %d); by tag %s' % (
        r['waiting_on_him'], QUEUE_CAP, r['waiting_by_tag']))
    print('  by lane: %s' % r['waiting_on_him_by_lane'])
    print('SIGNALS: queue over the cap: %s; keep rate under %d%% two sittings running: %s' % (
        'YES' if r['queue_over_cap'] else 'no', KEEP_FLOOR, 'YES' if r['keep_under_floor_two_sittings'] else 'no'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
