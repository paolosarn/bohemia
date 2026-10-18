#!/usr/bin/env python3
"""EYES AND EARS -- THE BLIND PASS (lane 17, row [the blind pass], claimed 10/16, shipped 10/18)

PAOLO, ninth votes (10/10), on a card that reached him unread: "I'm so confused what is the purpose of this? Is
this like a tutorial or something?" Rule 99 (the audition behind the screen) and rule 104k (a card he must ask
about is not ready). The row: every new VOTE item waits for EYES' one-line PASS or BACK, read from the item's own
fields, before the tab shows it; a card EYES BACKs never reaches him; the pass rate per lane is a line the
coordinator reads at the sweep. CONSTRAINT: EYES fixes nothing and the tab's filter is UI's, so this tool only
WRITES ITS VERDICTS (records/target/EYES_THE_BLIND_PASS.json) and never edits the registry or the tab.

ROUND ONE (school, records/BOHEMIA_EYES_THE_BLIND_PASS_ROUND_1_SCHOOL_HIS_CONFUSED_CARDS_10_18_26.md) was REUSE
FIRST: PLUMBER's cook gate already refuses a look item with no before-and-after at 1:1 (rule 89), so leg 5 below is
that gate's own test, ported, not a second opinion. Nothing in the repo read the WORDS on a card. The school's
calibration set is his own: every verdict whose words say he could not tell what the card was (CONFUSED below).
A check earns its place only if it BACKs his confused cards more often than his clear ones; the rate on both sets
is printed every run, so the filter is graded on him, never on itself.

THE LEGS. Two kinds, and the school decided which is which (a card is BACK when any BACK leg fails):
  RULINGS (his words; they stand whatever they predict):
  1 A THING TO SEE OR HEAR: show.how is image, clip, audio or page and its file is on disk (first votes 9/21:
    'text items are boring, make the pixels and the sound').
  4 PLAIN WORDS: no file path, no code word (TALK TO HIM LIKE A PERSON, 8/24).
  5 THE BEFORE AND AFTER: a look item carries before_after at 1:1 (the cook gate's own rule 89 test).
  6 NOT TEAM BUSINESS: no card about the machine, the chats, gates, rules or the handoff (rule 113d).
  PREDICTORS (kept only because they BACK his confused cards more than his clear ones, measured on 467 verdicts):
  2 WHERE HE MEETS IT: the words name a place in the game or a tab (NAME THE TAB, 7/28; his 'when would I see
    this'). 24 percent of his confused cards miss it against 7 percent of his clear ones: lift 3.7. KEPT.
  NOTES ONLY (measured and found NOT to predict his confusion, so they never send a card back):
  3 WHAT HE DECIDES (a question, options, a decision word): 24 percent against 22, lift 1.1.
  7 LENGTH (over four sentences or a sentence over 28 words): 67 percent against 57; the longest-sentence and
    word-count curves of the two sets lie on top of each other at every threshold from 25 to 100.

USAGE:  python3 tools/bohemia_eyes_the_blind_pass_10_18_26.py            # the new items, PASS or BACK, writes the file
        python3 tools/bohemia_eyes_the_blind_pass_10_18_26.py --school   # the calibration on his judged cards
        python3 tools/bohemia_eyes_the_blind_pass_10_18_26.py --selftest
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
TRI = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_TRIAGE.json')
OUT = os.path.join(ROOT, 'records/target/EYES_THE_BLIND_PASS.json')

CONFUSED = re.compile(r"confus|can.?t even like understand|what is the purpose|what.?s going on|what the fuck is going on|"
                      r"no fucking clue|when would (i|you) see|why are you asking me|did not explain|where is this going|"
                      r"what do you mean|can.?t tell difference|miscellaneous", re.I)

PLACES = re.compile(r"\b(map|fight|city|street|settlement|title|start screen|screen|tab|demo|travel|recap|town|camp|"
                    r"road|block|shop|clinic|tavern|market|barber|phone|menu|loading|front door|alpha|game|desert|"
                    r"night|valley|home base|house|garage|motel|inn|party|you see|you hear|in play)\b", re.I)
DECIDE = re.compile(r"\?|\b(pick|choose|keep|kill|yes|no\b|which|decid|your (call|look|pick|word)|up (builds|keeps)|"
                    r"down (kills|keeps)|or not|a or b|tap|vote)", re.I)
CODE = re.compile(r"[\w-]+/[\w./-]+|\.(py|js|json|html|png|md|txt)\b|\b\w+_\w+\b|\bsha\b|\bcommit|\bregistry\b|"
                  r"\bfunction\b|\bregex|\bpipeline\b|\bJSON\b", re.I)
TEAM = re.compile(r"\b(gate|gates|handoff|coordinator|chat|chats|lane|lanes|rule \d+|the board|backlog|suite|checker|"
                  r"VAMILY|the machine now)\b", re.I)

LOOK_LANE = re.compile(r"^(cook( ?(2|3|4|two|three|four))?|combat ?(2|two)|ui|character|portrait)$", re.I)
ALSO_ART = re.compile(r"^(combat|run|eyes)$", re.I)
ART = ('tile', 'face', 'haircut', 'outfit', 'animation')


def on_disk(src):
    return bool(src) and (os.path.exists(os.path.join(ROOT, 'slices', src)) or os.path.exists(os.path.join(ROOT, src)))


def is_look(it):
    l, k = str(it.get('lane') or '').strip(), it.get('kind')
    if k in ('verdict', 'line', 'sound'):
        return False
    return bool((LOOK_LANE.match(l) and (k in ART or k == 'ui')) or (ALSO_ART.match(l) and k in ART))


def sentences(s):
    return [x for x in re.split(r'(?<=[.!?])\s+', s.strip()) if x]


def legs(it):
    """[(n, passed, reason)] for one item, the reason in words a person reads."""
    sh, words = it.get('show') or {}, ' '.join(str(it.get(k) or '') for k in ('title', 'why', 'question'))
    why = str(it.get('why') or '')
    out = []
    how = sh.get('how')
    out.append((1, how in ('image', 'clip', 'audio', 'page') and on_disk(sh.get('src')),
                'nothing to see or hear (it shows ' + (('words only' if how == 'text' else 'a missing file') if how else 'nothing') + ')'))
    out.append((2, bool(PLACES.search(words)), 'it never says where in the game he meets it'))
    code = CODE.search(words)
    out.append((4, not code, 'a word only the team reads: "%s"' % (code.group(0) if code else '')))
    if is_look(it):
        ba = it.get('before_after')
        good = isinstance(ba, dict) and str(ba.get('before') or '').strip() and str(ba.get('after') or '').strip() \
            and str(ba.get('scale') or '').replace(' ', '') == '1:1'
        out.append((5, bool(good), 'a look with no before and after at one to one'))
    t = TEAM.search(words)
    out.append((6, not t, 'team business, not the game ("%s")' % (t.group(0) if t else '')))
    return out


def notes(it):
    """The two measured non-predictors, printed beside a verdict and never deciding it."""
    words = ' '.join(str(it.get(k) or '') for k in ('title', 'why', 'question'))
    ss = sentences(str(it.get('why') or ''))
    longest = max([len(x.split()) for x in ss] or [0])
    n = []
    if not (it.get('question') or it.get('options') or DECIDE.search(words)):
        n.append('note: never says what he decides')
    if len(ss) > 4 or longest > 28:
        n.append('note: %d sentences, longest %d words' % (len(ss), longest))
    return n


PREDICTORS = (2,)


def verdict(it):
    ls = legs(it)
    bad = [r for n, p, r in ls if not p]
    return ('PASS', '') if not bad else ('BACK', bad[0]), [n for n, p, r in ls if not p]


def load():
    d = json.load(open(REG))
    try:
        tags = json.load(open(TRI)).get('tags', {})
    except Exception:
        tags = {}
    return d, tags


def school():
    d, _ = load()
    items = {i['id']: i for i in d['items']}
    conf, clear = [], []
    for v in d['verdicts']:
        it = items.get(v['id'])
        if not it:
            continue
        (conf if CONFUSED.search(v.get('said') or '') else clear).append(it)
    per = {}
    for name, group in (('confused', conf), ('clear', clear)):
        backs = [verdict(i) for i in group]
        legn = {n: sum(1 for (_, f) in backs if n in f) for n in (1, 2, 4, 5, 6)}
        per[name] = {'n': len(group), 'back': sum(1 for (v, _), _f in backs if v == 'BACK'), 'by_leg': legn,
                     'back_on_predictors': sum(1 for (_, f) in backs if any(n in f for n in PREDICTORS))}
    return per, conf


def main():
    if '--selftest' in sys.argv:
        return selftest()
    if '--school' in sys.argv:
        per, conf = school()
        for k, v in per.items():
            print('%-9s %3d judged cards, %3d BACK (%d%%), %d on the predictor  by leg %s' % (
                k, v['n'], v['back'], 100 * v['back'] // max(1, v['n']), v['back_on_predictors'], v['by_leg']))
        for it in conf:
            (v, r), _ = verdict(it)
            print('  his confused card %-52s %s %s' % (it['id'][:52], v, r))
        return 0
    d, tags = load()
    judged = {v['id'] for v in d['verdicts']}
    new = [i for i in d['items'] if i['id'] not in judged and i['id'] not in tags]
    rows, lanes = [], {}
    for it in new:
        (v, r), f = verdict(it)
        rows.append({'id': it['id'], 'lane': it.get('lane'), 'made': it.get('made'), 'eyes': v, 'why': r, 'legs_failed': f,
                     'notes': notes(it)})
        L = lanes.setdefault(it.get('lane'), [0, 0]); L[0] += 1; L[1] += v == 'PASS'
        print('%-4s %-52s %-10s %s %s' % (v, it['id'][:52], str(it.get('lane'))[:10], r, '; '.join(notes(it))))
    per, _ = school()
    out = {'made': 'EYES [the blind pass], tools/bohemia_eyes_the_blind_pass_10_18_26.py; read only, the registry is never edited. '
                   'BACK means the card is not ready to reach him; the tab filter that obeys it is UI\'s.',
           'calibration_on_his_judged_cards': per,
           'pass_rate_by_lane': {k: '%d of %d' % (v[1], v[0]) for k, v in sorted(lanes.items(), key=lambda kv: str(kv[0]))},
           'items': rows}
    json.dump(out, open(OUT, 'w'), indent=1)
    print('pass rate by lane:', out['pass_rate_by_lane'])
    print('calibration: his confused cards BACK %d of %d, his clear cards %d of %d' % (
        per['confused']['back'], per['confused']['n'], per['clear']['back'], per['clear']['n']))
    return 0


def selftest():
    good = {'id': 'x', 'lane': 'cook 4', 'kind': 'tile', 'title': 'THE MOTEL WITH A STRAIGHT ROOF',
            'why': 'The motel on the map now has a flat tan roof. Keep it or kill it.',
            'show': {'how': 'image', 'src': '../records/target/COOK4_THE_MOTEL_STRAIGHT_ROOF.png'},
            'before_after': {'before': 'a', 'after': 'b', 'scale': '1:1'}}
    planted = [
        (dict(good, show={'how': 'text', 'src': 'words'}), 1),
        (dict(good, why='It is better now. Keep it or kill it.', title='THE ROOF'), 2),
        (dict(good, why='The motel on the map reads tools/bohemia_cook4_motel.py now. Keep it?'), 4),
        (dict(good, before_after=None), 5),
        (dict(good, why='The coordinator asked the chat to make the motel on the map. Keep it?'), 6),
    ]
    fails = 0
    (v, _), _f = verdict(good)
    print('  ok  ' if v == 'PASS' else '  FAIL', 'a plain card that shows the motel passes'); fails += v != 'PASS'
    for it, leg in planted:
        (v, r), f = verdict(it)
        hit = v == 'BACK' and leg in f
        print('  ok  ' if hit else '  FAIL', 'planted leg %d is sent back: %s' % (leg, r)); fails += not hit
    per, _ = school()
    c, k = per['confused'], per['clear']
    lift = (c['back_on_predictors'] / max(1, c['n'])) / max(1e-9, k['back_on_predictors'] / max(1, k['n']))
    better = lift >= 2
    print('  ok  ' if better else '  FAIL', 'its predictor legs BACK his confused cards at least twice as often as his clear ones '
          '(%d/%d against %d/%d, lift %.1f)' % (c['back_on_predictors'], c['n'], k['back_on_predictors'], k['n'], lift)); fails += not better
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
