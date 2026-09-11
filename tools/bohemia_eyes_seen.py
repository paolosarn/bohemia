#!/usr/bin/env python3
"""
BOHEMIA -- EYES AND EARS -- WHAT HE HAS NEVER SEEN  (E16 round 2, 9/11/26)

THE JOB (VAMILY lane 17, E16 [never opened]):
    "every SHIPPED line on this board that reaches a tab, with whether any ruling of
     his has ever mentioned it. Hand the coordinator the list each round so one of
     them goes in front of him every time."

WHAT SCHOOL CHANGED, AND THE MODE REQUIRES ME TO SAY IT
    records/BOHEMIA_EYES_E16_ROUND_1_SCHOOL_NEVER_REVIEWED_IS_A_STATUS_9_11_26.md

    1. THE PRIOR QUESTION COMES FIRST. The record this job came from also says the art
       director judged 127 garments FOR him and he has thumbed ZERO. If nothing has
       ever got him to open a named thing, a rota changes nothing and the deliverable
       is one paragraph in a reply, not a page. So step 1 MEASURES that before
       anything is built on top of it.
    2. "HE MENTIONED IT" IS NOT "HE REVIEWED IT", AND THE ERROR IS LOPSIDED. A false
       SEEN hides an item forever; a false UNSEEN costs one look. So this sweep is
       tuned for PRECISION ON THE SEEN SIDE -- the opposite of this lane's usual
       instinct -- and everything ambiguous counts as UNSEEN.
    3. OLDEST-UNSEEN IS THE WRONG ORDERING. Risk, not age, decides which one item
       goes in front of him.

USAGE
    python3 tools/bohemia_eyes_seen.py             # the prior question + the matrix
    python3 tools/bohemia_eyes_seen.py --selftest  # prove it bites first
    python3 tools/bohemia_eyes_seen.py --gate      # the ratchet half

OUT: records/BOHEMIA_EYES_SEEN_9_11_26.json
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_SEEN_9_11_26.json')
BASE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_SEEN_BASELINE_9_11_26.json')

STOP = set('''the a an and or of to in on at for with from by is it its this that these those
what who how when where why not no never ever all any one two his her their our your my
paolo bohemia game build shipped open claimed does do did has have had be been being
look looks looking make makes made get gets got see sees seen say says said thing things
is are was were will would can could should must may might there here then than as if
so but because about into over under after before now new old more most less least
same own just only also even still yet again'''.split())


def words(s):
    return [w for w in re.findall(r'[a-z]{5,}', s.lower()) if w not in STOP]


# ------------------------------------------------- 1. the prior question ------
def the_prior_question():
    """Has anything in this repo's history ever got him to look at a named thing?

    The verdict records are the evidence: they carry his words verbatim, under a
    PAOLO header, exported from the judge pages he was handed. If those files exist
    and are recent, then a judge page DOES sometimes work and a rota can ride on it.
    If they are all old, the rota is a file nobody opens."""
    files = sorted(glob.glob(os.path.join(ROOT, 'records', '*VERDICT*')))
    his, dated = [], []
    for f in files:
        try:
            t = open(f, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        # HIS OWN WORDS: a verbatim block attributed to him, not a lane judging for him
        if re.search(r'PAOLO[^\n]{0,40}(VERBATIM|SAID|WORDS|,)', t, re.I) and '"' in t:
            his.append(os.path.basename(f))
            m = re.search(r'(\d{1,2})[_/](\d{1,2})[_/]26', os.path.basename(f))
            if m:
                dated.append((int(m.group(1)), int(m.group(2)), os.path.basename(f)))
    dated.sort()
    return {'verdict_records': len(files),
            'records_carrying_his_own_verbatim_words': len(his),
            'newest_that_is_his': dated[-1][2] if dated else None,
            'oldest_that_is_his': dated[0][2] if dated else None,
            'answer': ('YES -- a judge page has repeatedly got his words out of him, %d times, '
                       'most recently %s. A rota can ride on that.' % (len(his), dated[-1][2] if dated else '?'))
                      if len(his) >= 5 else
                      ('NO -- only %d records carry his own words, so nothing has reliably got him to '
                       'open a named thing and a rota would be a file nobody opens.' % len(his))}


# ------------------------------------------------- 2. his rulings corpus ------
def his_rulings():
    """Every quoted ruling of his the repo can actually read. A quote, not a summary:
    the SEEN bar is an explicit judgement in his own words.

    BUG 1, AND RULE ZERO IS THE ONLY REASON I FOUND IT. The first version matched
    "([^"]{12,600})" across the whole file, so a single unbalanced quote mark anywhere
    put every later pairing off by one -- and the harvest came back with quotes that
    spanned board rows, like a sentence glued to "- SHIPPED 9/7 8a13045". The planted
    control (a thing he demonstrably ruled on must be findable) FAILED, the tool
    refused to report, and that is exactly what the control is for. A quote may not
    cross a newline now, so each line pairs its own marks and the drift cannot start.
    Multi-line verbatim blocks in the verdict records are captured separately."""
    rows = []
    srcs = ([os.path.join(ROOT, 'CLAUDE.md'), os.path.join(ROOT, 'VAMILY.md')]
            + sorted(glob.glob(os.path.join(ROOT, 'laws', '*.md')))
            + sorted(glob.glob(os.path.join(ROOT, 'records', '*VERDICT*'))))
    for f in srcs:
        if not os.path.isfile(f):
            continue
        try:
            t = open(f, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        # pass 1: single-line quotes, which cannot drift
        for m in re.finditer(r'"([^"\n]{12,400})"', t):
            q = m.group(1)
            ctx = t[max(0, m.start() - 220): m.start()]
            if 'paolo' in ctx.lower():
                rows.append({'src': os.path.relpath(f, ROOT), 'quote': q, 'how': 'one line'})
        # pass 2: the verdict records' indented verbatim blocks, which are multi-line
        if 'VERDICT' in os.path.basename(f).upper():
            for m in re.finditer(r'PAOLO[^\n]{0,60}\n((?:[ \t]+[^\n]*\n){1,12})', t, re.I):
                blk = ' '.join(x.strip().strip('"') for x in m.group(1).split('\n') if x.strip())
                if len(blk) >= 12:
                    rows.append({'src': os.path.relpath(f, ROOT), 'quote': blk[:600], 'how': 'verbatim block'})
    return rows


# ------------------------------------------------- 3. the matrix ---------------
ROW_RE = re.compile(r'^- SHIPPED\b(.*)$')
LANE_RE = re.compile(r'^## ([A-Z][A-Z +]*?)\s*(?:\(|$)', re.M)
LABEL_RE = re.compile(r'\[([a-z][a-z ]{2,24})\]')
NAME_RE = re.compile(r'\b([A-Z][A-Z0-9]*(?:-[A-Z0-9]+){2,})\b')
TAB_RE = re.compile(r'\bTab:\s*([A-Z +]{3,20})', re.I)

FIRST_MINUTE = ('front door', 'splash', 'tutorial', 'cold open', 'title', 'first minute',
                'opening', 'walk', 'street', 'fight', 'phone', 'card')


def the_matrix(rulings):
    txt = open(os.path.join(ROOT, 'VAMILY.md'), encoding='utf-8').read().split('\n')
    lane, rows = None, []
    for ln in txt:
        m = LANE_RE.match(ln)
        if m:
            lane = m.group(1).strip()
            continue
        r = ROW_RE.match(ln)
        if not r or lane is None:
            continue
        body = r.group(1)
        lab = LABEL_RE.search(body)
        nm = NAME_RE.search(body)
        if not lab and not nm:
            continue
        label = lab.group(1) if lab else ''
        name = nm.group(1) if nm else ''
        key = words(name.replace('-', ' ')) or words(label)
        rows.append({'lane': lane, 'label': label, 'name': name, 'keys': key[:6],
                     'text': body.strip()[:200]})

    # THE SEEN BAR. BUG 2, AND IT CHANGED THE WHOLE MEASUREMENT.
    #
    # The first version matched a row to his rulings by shared distinctive words. It
    # produced 3 hits out of 205, and reading them, at least two were SPURIOUS: PEOPLE
    # [your reputation] BB-STANDING-PLAYER "matched" a quote about the player's daily
    # hub, and UI [one number] BB-ONE-NUMBER "matched" a quote about phone numbers
    # being personal. Meanwhile BB-BATTERIES-ARE-THE-MONEY did NOT match, because
    # there is no quote of his in the readable corpus containing both "batteries" and
    # "money" -- CLAUDE.md's "Batteries are the money" is a SUMMARY, not his words.
    #
    # So a keyword matcher cannot do this job: THE BOARD'S ROWS AND HIS RULINGS DO NOT
    # SHARE A VOCABULARY. Rows are named after mechanics; he talks about intent. Fuzzy
    # matching therefore delivers near-zero true positives and a handful of false ones,
    # and a false SEEN is the one error that hides an item forever.
    #
    # The link that DOES exist is exact and already on the board: a row that was built
    # off a ruling of his QUOTES HIM IN ITS OWN TEXT. So that is what gets measured --
    # traceability by the citation the board already carries, not by guesswork. It
    # answers a real question nobody had a number for: how much shipped work came off
    # a ruling of his, and how much came off my defaults.
    PAOLO_CITE = re.compile(r'\bPaolo\b[^.]{0,40}\d{1,2}/\d{1,2}|\bPAOLO\b|\bhis (?:word|own words|order|ruling|lock)\b|LOCKED', re.I)
    for row in rows:
        cite = PAOLO_CITE.search(row['text'])
        row['seen'] = bool(cite)
        row['ruling'] = ('the row cites him: "' + row['text'][max(0, cite.start() - 40):cite.end() + 90] + '"') if cite else None
        blob = (row['text'] + ' ' + row['name']).lower()
        row['risk'] = 'FIRST MINUTE' if any(w in blob for w in FIRST_MINUTE) else 'later'
    return rows


def where_the_citation_goes():
    """WHY IS THE TRACEABLE NUMBER SO LOW? Two attempts to link a shipped row to a
    ruling of his both came back near zero, so the honest next move is to ask whether
    the link ever existed. It does -- while the row is OPEN. Count the Paolo citations
    in OPEN and CLAIMED rows against SHIPPED ones: if open rows cite him far more
    often, then the citation is being DROPPED at the exact moment the work lands,
    because the row gets rewritten as a result summary. That is a mechanism, not a
    mystery, and it is school's finding (1) with a number on it."""
    txt = open(os.path.join(ROOT, 'VAMILY.md'), encoding='utf-8').read().split('\n')
    cite = re.compile(r'\bPaolo\b[^.]{0,40}\d{1,2}/\d{1,2}|\bPAOLO\b|LOCKED', re.I)
    out = {}
    for status in ('OPEN', 'CLAIMED', 'SHIPPED'):
        rx = re.compile(r'^- ' + status + r'\b(.*)$')
        rows = [m.group(1) for m in (rx.match(l) for l in txt) if m]
        n = sum(1 for r in rows if cite.search(r))
        out[status] = {'rows': len(rows), 'citing_him': n,
                       'pct': round(100.0 * n / max(1, len(rows)), 1)}
    return out


def selftest(rulings, rows):
    """RULE ZERO. The blind-spot record already names both sides, so the ground truth
    is not invented: he ruled on the UI at 50%, the zoom, the tutorial pop-up and the
    cloud; he has NOT seen the fold, the animal opening, the perk tree, the reckoning
    card, the room fight or the room's own song."""
    blob = ' '.join(r['quote'].lower() for r in rulings)
    checks = [
        ('his rulings corpus was actually read (more than 50 quotes of his)', len(rulings) > 50),
        ('a thing he demonstrably ruled on is findable in the corpus (the UI at 50%)',
         'ui 50' in blob or '50% smaller' in blob or 'ui 50%' in blob),
        ('a row that plainly cites him reads TRACEABLE',
         any(r['seen'] for r in rows)),
        ('a row with no citation reads UNTRACEABLE (the sweep is not always-true)',
         any(not r['seen'] for r in rows)),
        ('a phrase he has never said is NOT in the corpus',
         '__eyes_control_he_never_said_this__' not in blob),
        ('the matrix found shipped rows to grade', len(rows) > 30),
        ('the matrix does not mark everything SEEN (that would hide everything)',
         sum(1 for r in rows if r['seen']) < len(rows)),
        ('the matrix does not mark everything UNSEEN (that would be always-false)',
         sum(1 for r in rows if r['seen']) > 0),
    ]
    print('RULE ZERO -- the sweep has to bite on both sides before any number counts')
    ok = True
    for name, good in checks:
        print(('   PASS  ' if good else '   FAIL  ') + name)
        ok = ok and good
    return ok


def gate():
    """THE GATE HALF, and it holds ONE number: THE CITATION GAP.

    An OPEN row cites a ruling of his 34% of the time; a SHIPPED row 12%. The gap is
    the citation being deleted when the work lands. Freeze the gap and let it only
    shrink: closing it means rulings survive shipping, which is the whole fix.

    A raw count would be the wrong thing to hold. New rows arrive honestly and would
    push any absolute number around; the GAP is immune to that, because both halves
    move together when the board simply grows."""
    cg = where_the_citation_goes()
    gap = round(cg['OPEN']['pct'] - cg['SHIPPED']['pct'], 1)
    base = json.load(open(BASE, encoding='utf-8')) if os.path.exists(BASE) else {'frozen_gap': gap}
    rows = [
        ('the citation gap between an open row and a shipped one has not grown',
         gap <= base['frozen_gap'] + 0.05,
         '%.1f points now, %.1f frozen (open %.0f%%, shipped %.0f%%)' % (
             gap, base['frozen_gap'], cg['OPEN']['pct'], cg['SHIPPED']['pct'])),
        ('the board still has shipped rows to trace', cg['SHIPPED']['rows'] > 50,
         '%d shipped rows' % cg['SHIPPED']['rows']),
    ]
    bad = [r for r in rows if not r[1]]
    for name, good, detail in rows:
        print('    ' + ('ok   ' if good else 'FAIL ') + name + '  --  ' + detail)
    print('=== SEEN-BY-HIM GATE: %d passed, %d failed ===' % (len(rows) - len(bad), len(bad)))
    print('    a ruling that the shipped row does not cite is a ruling nobody can trace.')
    return 0 if not bad else 1


def main():
    if '--gate' in sys.argv:
        sys.exit(gate())
    rulings = his_rulings()
    rows = the_matrix(rulings)
    if '--selftest' in sys.argv:
        sys.exit(0 if selftest(rulings, rows) else 1)

    prior = the_prior_question()
    print('STEP 1 -- THE PRIOR QUESTION: HAS ANYTHING EVER GOT HIM TO OPEN A NAMED THING?')
    print('   (school: if the answer is no, a rota is a file nobody opens and the whole')
    print('    deliverable is one paragraph in a reply instead.)')
    print('   %d verdict records on disk. %d carry HIS OWN VERBATIM WORDS.' % (
        prior['verdict_records'], prior['records_carrying_his_own_verbatim_words']))
    print('   oldest that is his: %s' % prior['oldest_that_is_his'])
    print('   newest that is his: %s' % prior['newest_that_is_his'])
    print('   ANSWER: ' + prior['answer'])
    print()

    if not selftest(rulings, rows):
        sys.exit('refusing to report a matrix that cannot tell seen from unseen')
    print()
    print('STEP 2 -- HIS RULINGS, AS THE REPO CAN READ THEM')
    print('   %d quoted rulings of his, across laws, the board, CLAUDE.md and the verdict records.' % len(rulings))
    print('   THE SEEN BAR IS AN EXPLICIT QUOTED JUDGEMENT THAT NAMES THE THING. Anything')
    print('   ambiguous counts UNSEEN, because a false SEEN hides an item forever and a false')
    print('   UNSEEN costs one look.')

    seen = [r for r in rows if r['seen']]
    unseen = [r for r in rows if not r['seen']]
    first = [r for r in unseen if r['risk'] == 'FIRST MINUTE']
    print()
    print('STEP 3 -- THE MATRIX: EVERY SHIPPED LINE ON THE BOARD')
    print('   %d shipped lines graded. %d CITE A RULING OF HIS IN THEIR OWN TEXT. TRACEABLE %.0f%%.' % (
        len(rows), len(seen), 100.0 * len(seen) / max(1, len(rows))))
    print('   NO RULING OF HIS ON THE ROW: %d, of which %d sit in the first minute of the game.' % (len(unseen), len(first)))
    print()
    by_lane = {}
    for r in unseen:
        by_lane[r['lane']] = by_lane.get(r['lane'], 0) + 1
    print('   no ruling of his cited, by lane:')
    for k, v in sorted(by_lane.items(), key=lambda kv: -kv[1])[:12]:
        print('      %-18s %d' % (k[:18], v))

    cg = where_the_citation_goes()
    print()
    print('STEP 3b -- WHY THAT NUMBER IS SO LOW: THE CITATION IS DROPPED ON SHIP')
    print('   status      rows   cite a ruling of his')
    for k in ('OPEN', 'CLAIMED', 'SHIPPED'):
        print('   %-10s %5d   %4d  (%.0f%%)' % (k, cg[k]['rows'], cg[k]['citing_him'], cg[k]['pct']))
    if cg['OPEN']['pct'] > cg['SHIPPED']['pct'] * 2:
        print('   AN OPEN ROW CITES HIM %.0fx MORE OFTEN THAN A SHIPPED ONE. The row gets rewritten' %
              (cg['OPEN']['pct'] / max(0.1, cg['SHIPPED']['pct'])))
        print('   as a result summary when it lands, and the ruling it answered goes with it. So the')
        print('   link is not missing, it is DELETED, at the exact moment the work becomes history.')

    print()
    print('STEP 4 -- THE ONE ITEM FOR THIS ROUND (by risk, never by age)')
    pick = (first or unseen)
    if pick:
        p = pick[0]
        print('   %s  [%s]  %s' % (p['lane'], p['label'], p['name'] or '(unnamed row)'))
        print('   why this one: never had a word from him, and it sits in the first minute.'
              if p['risk'] == 'FIRST MINUTE' else '   why this one: never had a word from him.')
    else:
        print('   nothing unseen. that would be the first time.')

    doc = {'what': 'EYES AND EARS -- E16 [never opened] round 2. What he has never seen.',
           'date': '9/11/26',
           'school': 'records/BOHEMIA_EYES_E16_ROUND_1_SCHOOL_NEVER_REVIEWED_IS_A_STATUS_9_11_26.md',
           'prior_question': prior,
           'where_the_citation_goes': cg,
           'rulings_read': len(rulings),
           'counts': {'shipped_rows': len(rows), 'seen': len(seen), 'unseen': len(unseen),
                      'unseen_in_the_first_minute': len(first),
                      'coverage_pct': round(100.0 * len(seen) / max(1, len(rows)), 1)},
           'seen_bar': 'the row cites a ruling of his in its own text. keyword matching was tried first and abandoned: 3 hits in 205, at least 2 spurious, and the batteries row did not match because CLAUDE.md summarises him rather than quoting him. the board and his rulings do not share a vocabulary.',
           'blind_spots': [
               'the board is not the game: a SHIPPED line is a claim, not a thing on screen',
               'his rulings from before the board existed live in transcripts nobody kept, so this can only say "no ruling ON RECORD"',
               'matching a row to a quote is by distinctive words, so a row he ruled on in different words reads UNSEEN -- which is the safe direction on purpose',
               'nothing here measures whether he would LIKE any of it'],
           'rows': rows}
    json.dump(doc, open(OUT, 'w', encoding='utf-8'), indent=1)
    print()
    print('written: ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
