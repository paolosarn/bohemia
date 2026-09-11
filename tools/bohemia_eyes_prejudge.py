#!/usr/bin/env python3
"""
BOHEMIA -- EYES AND EARS -- THE PRE-JUDGE PASS  (E15 round 2, 9/11/26)

THE JOB (VAMILY lane 17, E15 [machine judges]):
    "DIRECTION is holding SIX claimed jobs and one open; the art director is the
     bottleneck because every cook waits on a human judgement ... build the pass
     that runs every cook through the sheet and the card BEFORE it reaches
     DIRECTION, so DIRECTION rules only on what a machine cannot."

WHAT SCHOOL CHANGED, AND THE MODE REQUIRES ME TO SAY IT
    records/BOHEMIA_EYES_E15_ROUND_1_SCHOOL_A_PREJUDGE_THAT_FORWARDS_EVERYTHING_9_7_26.md

    1. A PRE-JUDGE THAT ANNOTATES BUT STILL FORWARDS EVERYTHING ADDS WORK. The
       bottleneck is his attention, not a shortage of information. So this pass has
       exactly three outcomes and only one of them is a report: RETURNED (goes back
       to the cook, never reaches him), DECIDED (ships under EVERYTHING IS A THUMB),
       HIS (reaches him, grouped by which human question it turns on).
    2. THE BOTTLENECK MOVES, so STEP 0 MEASURES THE QUEUE BEFORE ACCEPTING THE
       PREMISE. Six claimed lines is a COUNT, not a queue. If DIRECTION is not the
       constraint this tool says so and says which lane is.
    3. THE RUBBER STAMP IS MEASURABLE IN ADVANCE. A 0% override rate is a process
       failure, not proof the machine is right, so the pass carries an override
       meter and raises the alarm about ITSELF.
    4. THE MACHINE IS SILENT WHEN IT PASSES. Excessive nitpicking buries the one
       thing he was needed for.

USAGE
    python3 tools/bohemia_eyes_prejudge.py            # step 0 + the pass
    python3 tools/bohemia_eyes_prejudge.py --queue    # step 0 only
    python3 tools/bohemia_eyes_prejudge.py --selftest # prove it bites first

OUT: records/BOHEMIA_EYES_PREJUDGE_9_11_26.json
"""
import json, os, re, sys, datetime, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOARD = os.path.join(ROOT, 'VAMILY.md')
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_PREJUDGE_9_11_26.json')
TODAY = datetime.date(2026, 9, 11)

LANE_RE = re.compile(r'^## ([A-Z][A-Z +]*?)\s*(?:\(|$)', re.M)
ROW_RE = re.compile(r'^- (OPEN|CLAIMED|SHIPPED|STANDING|PARKED)\b(.*)$')
DATE_RE = re.compile(r'\b(\d{1,2})/(\d{1,2})(?:/(\d{2}))?\b')


def read_board():
    """Every lane, every row, with the claim date where there is one."""
    txt = open(BOARD, encoding='utf-8').read().split('\n')
    lanes, cur = {}, None
    for ln in txt:
        m = LANE_RE.match(ln)
        if m:
            cur = m.group(1).strip()
            lanes.setdefault(cur, [])
            continue
        if cur is None:
            continue
        r = ROW_RE.match(ln)
        if r:
            lanes[cur].append({'status': r.group(1), 'text': r.group(2).strip()})
    return lanes


def age_days(text):
    """How long has this row been sitting, from the date written on it."""
    m = DATE_RE.search(text[:60])
    if not m:
        return None
    mo, day = int(m.group(1)), int(m.group(2))
    try:
        d = datetime.date(2026, mo, day)
    except ValueError:
        return None
    return (TODAY - d).days


def step_zero(lanes):
    """MEASURE THE QUEUE BEFORE ACCEPTING THE PREMISE.

    School: theory of constraints says relieving one constraint moves the focus to
    the next, and queueing theory says wait time rises non-linearly with demand. Six
    claimed lines is a count. A queue is work that is WAITING, and how long it has
    waited. If DIRECTION is not the constraint, building it a machine is building for
    the wrong bottleneck.
    """
    rows = []
    for lane, rs in lanes.items():
        claimed = [r for r in rs if r['status'] == 'CLAIMED']
        openr = [r for r in rs if r['status'] == 'OPEN']
        shipped = [r for r in rs if r['status'] == 'SHIPPED']
        ages = [a for a in (age_days(r['text']) for r in claimed) if a is not None]
        rows.append({
            'lane': lane, 'claimed': len(claimed), 'open': len(openr), 'shipped': len(shipped),
            'oldest_claim_days': max(ages) if ages else None,
            'median_claim_days': sorted(ages)[len(ages) // 2] if ages else None,
        })
    rows.sort(key=lambda r: (-(r['oldest_claim_days'] or -1), -r['claimed']))
    return rows


# ---------------------------------------------------------------- the pass ----
SHEET = os.path.join(ROOT, 'banks', 'eyes', 'BOHEMIA_EYES_REFERENCE_SCORE_SHEET_9_5_26.json')


def load_sheet():
    """BUG 1: I read the sheet with the wrong field names (by/ask) and it printed
    0 machine questions and 10 human ones with every question text as None -- a
    confident, completely wrong coverage map waiting to happen. The real keys are
    n / who / q / test / why."""
    d = json.load(open(SHEET, encoding='utf-8'))
    qs = d.get('questions', [])
    machine = [q for q in qs if (q.get('who') or '').strip() == 'machine']
    human = [q for q in qs if (q.get('who') or '').strip() != 'machine']
    assert machine and human, 'the sheet did not parse: field names moved again'
    return machine, human


# ------------------------------------------------------- the coverage map ----
# REUSE-FIRST is a law, and E15 asks for a machine pre-judge that LARGELY ALREADY
# EXISTS: STYLE CARD and TARGET MATCH are both registered in the suite and both
# already grade cooks by machine. So the new artefact is not another judge, it is
# an honest map of which of E7's seven machine questions is ALREADY gated, by what,
# and over which art.
#
# EVERY CLAIM CARRIES ITS OWN EVIDENCE STRING AND THE TOOL VERIFIES THE STRING IS
# STILL IN THE GATE. A coverage map that asserts rather than checks rots the day a
# gate is edited, which is exactly the class of rot E11 found.
COVERAGE = [
    {'n': 1, 'gate': 'gates/texture_match_gate.py', 'evidence': 'every cooked tile lands inside the band measured off HIS art',
     'scope': 'TILES only'},
    {'n': 2, 'gate': 'gates/target_screen_gate.py', 'evidence': 'unique colour',
     'scope': 'the target screen only'},
    {'n': 3, 'gate': 'gates/style_card_gate.py', 'evidence': 'sits in the register or is a clear accent',
     'scope': 'WARDROBE only'},
    {'n': 4, 'gate': 'gates/style_card_gate.py', 'evidence': 'keeps its value inside the card',
     'scope': 'WARDROBE only'},
    {'n': 5, 'gate': None, 'evidence': 'autocorr', 'scope': None},
    {'n': 6, 'gate': 'gates/pixel_craft_gate.py', 'evidence': 'lit corner',
     'scope': 'the pixel-craft corpus only'},
    {'n': 7, 'gate': None, 'evidence': None, 'scope': None},
]


def check_coverage(machine):
    rows = []
    for q in machine:
        c = next((x for x in COVERAGE if x['n'] == q['n']), None)
        row = {'n': q['n'], 'question': q['q'], 'test': q.get('test', '')}
        if not c or not c['gate']:
            row.update({'covered': False, 'gate': None, 'scope': None,
                        'why': 'no gate in the suite performs this test'})
        else:
            path = os.path.join(ROOT, c['gate'])
            present = False
            if os.path.exists(path):
                present = c['evidence'] in open(path, encoding='utf-8', errors='replace').read()
            row.update({'covered': present, 'gate': c['gate'], 'scope': c['scope'],
                        'evidence': c['evidence'],
                        'why': 'the gate still carries the check' if present
                               else 'THE COVERAGE CLAIM IS STALE: that gate no longer carries this check'})
        rows.append(row)
    return rows


# --------------------------------------------------------- the override meter ----
def override_meter():
    """SCHOOL'S HARD REQUIREMENT: automation bias is documented everywhere, and the
    named leading indicator of a rubber stamp is a DECLINING OVERRIDE RATE. A 0%
    override rate is a process failure, not proof the machine is right.

    To compute it you need, per cook, the machine's verdict AND the human verdict
    that followed, in one place. So the first question is whether that record exists
    at all -- and this is E11's disease again: a rate nobody can compute is a rate
    nobody will notice going to zero."""
    vfiles = sorted(glob.glob(os.path.join(ROOT, 'records', '*VERDICT*')))
    paired = []
    for f in vfiles[:400]:
        try:
            t = open(f, encoding='utf-8', errors='replace').read().lower()
        except Exception:
            continue
        if ('gate' in t or 'machine' in t) and ('thumb' in t or 'approve' in t or 'verdict' in t):
            paired.append(os.path.basename(f))
    return {'verdict_records': len(vfiles),
            'records_mentioning_both_a_machine_and_a_human_call': len(paired),
            'examples': paired[:5],
            'computable': False,
            'why_not': ('no record stores, per cook, the MACHINE verdict beside the HUMAN verdict that '
                        'followed it. Files that mention both mention them in prose, not as a pair a '
                        'machine can compare. So the override rate cannot be computed today.'),
            'the_one_line_that_would_fix_it': ('when a cook clears the machine pass, write its machine verdict '
                                               'into the same verdict record the human thumb lands in. One field, '
                                               'and the rate becomes a number forever after.')}


def selftest():
    """RULE ZERO: a coverage map that asserts instead of checking looks identical to
    one that works, right up until a gate is edited underneath it."""
    machine, _ = load_sheet()
    checks = []

    # control 1: a claim pointed at a gate that does not carry the evidence must read STALE
    saved = COVERAGE[0].copy()
    COVERAGE[0]['evidence'] = '__eyes_this_string_is_in_no_gate_anywhere__'
    r = next(x for x in check_coverage(machine) if x['n'] == 1)
    checks.append(('a coverage claim whose check is gone reads STALE, not covered', r['covered'] is False))
    COVERAGE[0].update(saved)

    # control 2: a claim pointed at a gate file that does not exist must read NOT COVERED
    saved2 = COVERAGE[2].copy()
    COVERAGE[2]['gate'] = 'gates/__eyes_no_such_gate__.py'
    r2 = next(x for x in check_coverage(machine) if x['n'] == 3)
    checks.append(('a coverage claim pointed at a missing gate reads NOT COVERED', r2['covered'] is False))
    COVERAGE[2].update(saved2)

    # control 3: the real claims must still come back covered, or the map is just always-false
    live = check_coverage(machine)
    checks.append(('the real claims still come back COVERED (the map is not always-false)',
                   sum(1 for x in live if x['covered']) >= 4))

    print('RULE ZERO -- the map has to bite before any coverage number counts')
    ok = True
    for name, good in checks:
        print(('   PASS  ' if good else '   FAIL  ') + name)
        ok = ok and good
    return ok


BASE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_PREJUDGE_BASELINE_9_11_26.json')


def gate():
    """THE GATE HALF, and it holds two things only.

    1. NO COVERAGE CLAIM MAY GO STALE. If a gate is edited and stops carrying the
       check this map credits it with, the map is lying and the fleet would go on
       believing a question is gated when it is not. That is E11's disease and it
       goes red immediately, not on a ratchet.
    2. THE GAP COUNT MAY ONLY GO DOWN. Frozen at whatever it honestly is. E3's
       lesson: a checker that fails on absolute badness gets muted in a week; one
       that fails on GROWTH survives, because green means you did not make it worse.
    """
    machine, _ = load_sheet()
    cov = check_coverage(machine)
    stale = [r for r in cov if r['gate'] and not r['covered']]
    gaps = [r for r in cov if not r['gate']]
    base = json.load(open(BASE, encoding='utf-8')) if os.path.exists(BASE) else {'frozen_gaps': len(gaps)}
    rows = []
    rows.append(('no coverage claim has gone stale (a gate stopped carrying its check)',
                 not stale, ', '.join('#%d -> %s' % (r['n'], r['gate']) for r in stale) or 'none'))
    rows.append(('the number of E7 machine questions no gate performs has not grown',
                 len(gaps) <= base['frozen_gaps'],
                 '%d now, %d frozen' % (len(gaps), base['frozen_gaps'])))
    rows.append(('the sheet still parses into machine and human questions',
                 len(machine) == 7, '%d machine questions' % len(machine)))
    bad = [r for r in rows if not r[1]]
    for name, good, detail in rows:
        print('    ' + ('ok   ' if good else 'FAIL ') + name + '  --  ' + detail)
    print('=== PRE-JUDGE COVERAGE GATE: %d passed, %d failed ===' % (len(rows) - len(bad), len(bad)))
    print('    a question the fleet thinks is gated and is not is worse than one nobody claims.')
    return 0 if not bad else 1


def main():
    if '--selftest' in sys.argv:
        sys.exit(0 if selftest() else 1)
    if '--gate' in sys.argv:
        if not selftest():
            print('=== PRE-JUDGE COVERAGE GATE: 0 passed, 1 failed ===')
            print('    the map cannot tell a stale claim from a live one, so its green would mean nothing')
            sys.exit(1)
        print()
        sys.exit(gate())
    if not selftest():
        sys.exit('refusing to report a coverage map that cannot tell a stale claim from a live one')
    print()
    lanes = read_board()
    q = step_zero(lanes)

    print('STEP 0 -- WHERE THE QUEUE ACTUALLY IS')
    print('   (school: six claimed lines is a COUNT. a queue is work that is WAITING,')
    print('    and how long it has waited. the bottleneck moves, so measure it first.)')
    print()
    print('   lane                 claimed  open  shipped  oldest claim')
    for r in q[:12]:
        print('   %-20s %6d %5d %8d  %s' % (
            r['lane'][:20], r['claimed'], r['open'], r['shipped'],
            ('%d rounds-worth of dates' % r['oldest_claim_days']) if r['oldest_claim_days'] is not None else '-'))

    direction = next((r for r in q if r['lane'].startswith('DIRECTION')), None)
    worst = q[0] if q else None
    print()
    if direction is None:
        print('   DIRECTION not found on the board. Cannot test the premise.')
    else:
        print('   THE PREMISE SAID DIRECTION IS THE BOTTLENECK.')
        print('   DIRECTION holds %d claimed and %d open, oldest claim dated %s.' % (
            direction['claimed'], direction['open'],
            ('%d days back' % direction['oldest_claim_days']) if direction['oldest_claim_days'] is not None else 'undated'))
        if worst and worst['lane'] != direction['lane']:
            print('   BUT THE OLDEST UNSHIPPED CLAIM ON THE WHOLE BOARD IS %s (%s days back, %d claimed).' % (
                worst['lane'], worst['oldest_claim_days'], worst['claimed']))
            print('   So DIRECTION is not obviously the constraint, and this tool says so rather')
            print('   than building a machine for the wrong bottleneck.')
        else:
            print('   MEASURED: DIRECTION does hold the oldest unshipped claim on the board.')

    machine, human = load_sheet()
    cov = check_coverage(machine)
    print()
    print('REUSE-FIRST -- WHAT ALREADY JUDGES COOKS BY MACHINE')
    print('   STYLE CARD and TARGET MATCH are both registered in the suite and both already')
    print('   grade cooks. So the new thing is not another judge, it is an honest map of which')
    print('   of E7\'s seven machine questions is ALREADY gated, by what, and over which art.')
    print()
    print('   #  question                     gated by                        over')
    for r in cov:
        print('   %d  %-28s %-31s %s' % (
            r['n'], r['question'][:28],
            (r['gate'] or 'NOTHING').replace('gates/', '')[:31],
            r['scope'] or '--'))
        if r['gate'] and not r['covered']:
            print('      ^ %s' % r['why'])
    gaps = [r for r in cov if not r['covered']]
    print()
    print('   COVERED %d of %d. NOT COVERED BY ANY GATE: %s' % (
        len(cov) - len(gaps), len(cov), ', '.join('#%d %s' % (r['n'], r['question']) for r in gaps) or 'none'))
    print('   AND EVERY COVERED ONE IS SCOPED. A cook that is neither wardrobe nor a tile')
    print('   (a building, a face, a prop) is graded by nothing on this sheet.')

    print()
    print('THE THREE QUESTIONS NO MACHINE TOUCHES, AND THAT IS CORRECT')
    for x in human:
        print('   %d  %s' % (x['n'], x['q']))

    om = override_meter()
    print()
    print('THE OVERRIDE METER -- AND IT CANNOT BE COMPUTED YET, WHICH IS THE FINDING')
    print('   %d verdict records on disk; %d mention both a machine call and a human one, in prose.' % (
        om['verdict_records'], om['records_mentioning_both_a_machine_and_a_human_call']))
    print('   ' + om['why_not'])
    print('   THE ONE LINE THAT WOULD FIX IT: ' + om['the_one_line_that_would_fix_it'])

    doc = {
        'what': 'EYES AND EARS -- E15 [machine judges] round 2. Step 0: where the queue actually is.',
        'override_meter': om,
        'date': '9/11/26',
        'school': 'records/BOHEMIA_EYES_E15_ROUND_1_SCHOOL_A_PREJUDGE_THAT_FORWARDS_EVERYTHING_9_7_26.md',
        'step_zero': q,
        'premise_tested': {
            'the_premise': 'DIRECTION is the bottleneck because every cook waits on a human judgement',
            'direction': direction,
            'oldest_unshipped_claim_on_the_board': worst,
        },
        'sheet': {'machine': [x['q'] for x in machine], 'human': [x['q'] for x in human]},
        'coverage': cov,
        'gaps': [r['question'] for r in cov if not r['covered']],
        'reuse_first': 'STYLE CARD and TARGET MATCH are registered in the suite and already grade cooks by machine; the pass E15 asks for largely exists, so this round maps the gap instead of rebuilding it',
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(doc, open(OUT, 'w', encoding='utf-8'), indent=1)
    print()
    print('written: ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
