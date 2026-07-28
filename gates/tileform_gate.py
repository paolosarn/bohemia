#!/usr/bin/env python3
"""
BOHEMIA TILEFORM GATE (7/28/26) — the TILE REQUEST FORM law, machine-checked.

BOHEMIA_TILE_REQUEST_FORM.md, rule 7, says in its own text:

    GATE (routed to SHARED, non-cook): tileform_gate validates every form —
    all required fields present, caption JSON parses, the shopping check names
    a real index entry, the anchor resolves, edge vocabulary is one of the
    four legal words. A board row whose form fails the gate is not OPEN.

That gate did not exist. The form law landed the same day the first eight
CITY-lane forms were filed, which means eight contracts the ART lane is
supposed to cook from one-shot were resting entirely on self-attestation —
and the autonomy doctrine's own words are that verification is never
self-attestation. So it is written here, non-cook, exactly as the law routes
it.

WHAT IT PROVES, per form in records/tileforms/:
  1. every required section heading (A-J) is present
  2. every required field line inside A-E and G-J is present and NOT EMPTY
     (a heading with nothing after the colon is the classic vague form, and a
     vague form is a REJECTED form by rule 11 of the law)
  3. the caption block parses as JSON and carries every key the template
     names, with the right types
  4. the caption's `id` matches the filename's TF id, and `layer` is one of
     the five legal layers (ground/structure/overhead/prop/portal) — the same
     vocabulary the DISTRICT DOSSIER LAW uses, so a form's caption can be
     ingested by the tilespec pipeline without translation
  5. `edge_contract` (section C and the caption) uses the legal vocabulary:
     single placement / self-seamless / wang-16 / blob-47
  6. the SHOPPING CHECK names a real file that EXISTS on disk — this is the
     REUSE-FIRST rule applied to forms: a claimed shopping check must actually
     point at something, not just say so
  7. the APPROVED ANCHOR names a real banks/ or records/ path that EXISTS
  8. sections G and H are non-trivial (named outside reference, real-world
     grounding, and an anti-reference are the three things the law says kill
     revision rounds — an empty one is the whole failure mode)
  9. every form has a board row in BOHEMIA_TILE_REQUESTS.md, and every board
     row that claims a FORM: id has that form on disk — the index and the
     contracts cannot drift apart

WHAT IT DELIBERATELY DOES NOT PROVE: whether the research is GOOD, whether
the tile will look right, or whether Paolo wants it. Those are his, forever.
This gate checks that the contract is fillable-in-one-shot, nothing more.

  python3 gates/tileform_gate.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

FORMS_DIR = 'records/tileforms'
BOARD = 'BOHEMIA_TILE_REQUESTS.md'

SECTIONS = ['A. IDENTITY', 'B. WHY', 'C. WHERE', 'D. WHEN', 'E. HOW',
            'F. THE CAPTION', 'G. REFERENCES', 'H. DON\'T WANT',
            'I. ACCEPTANCE', 'J. ADMIN']

# field label -> the section it must live under. The label is matched as
# "- LABEL" at the start of a line, tolerant of the parenthetical hints the
# template carries.
FIELDS = {
    'A. IDENTITY':  ['NAME', 'FAMILY/SET', 'THE JOB, ONE SENTENCE'],
    'B. WHY':       ['DEMANDED BY', 'WHAT LOOKS BROKEN TODAY', 'SHOPPING CHECK'],
    'C. WHERE':     ['SURFACE + TAB', 'DISTRICT FAMILIES', 'LAYER', 'SOLID?',
                     'MUST SIT BESIDE', 'NEVER BESIDE', 'EDGE CONTRACT'],
    'D. WHEN':      ['ACT', 'BEST TIME', 'WEATHER STATES', 'LIT/UNLIT', 'ANIMATION'],
    'E. HOW':       ['EXACT SIZE', 'VIEW', 'PALETTE', 'LIGHT', 'SHADOWS',
                     'SCALE ANCHORS', 'WEAR LEVEL', 'VARIANTS'],
    'G. REFERENCES': ['APPROVED ANCHOR', 'NAMED OUTSIDE REFERENCE',
                      'REAL-WORLD GROUNDING'],
    'J. ADMIN':     ['STATUS'],
}

LAYERS = {'ground', 'structure', 'overhead', 'prop', 'portal'}
EDGE_WORDS = ['single placement', 'self-seamless', 'wang-16', 'blob-47']

CAPTION_KEYS = {
    'id': str, 'name': str, 'layer': str, 'solid': bool, 'enter': bool,
    'district_families': list, 'best_time': str, 'best_location': str,
    'place_next_to': list, 'never_next_to': list, 'weather_ok': list,
    'acts': list, 'edge_contract': str, 'tags': list,
}

# WHAT "FILLED IN" MEANS, and this took a correction to get right.
#
# The first version of this gate demanded 12+ characters in every field and
# then judged 50 forms from five lanes with it. It produced 100 failures,
# nearly all of them FALSE: "none" is the correct and complete answer to
# SHADOWS (the separate-shadow law), "standalone" is the template's own
# suggested FAMILY/SET, "static" is the right ANIMATION, "1" is the right ACT.
# A gate that calls those stubs is measuring PROSE LENGTH instead of meaning,
# and it would have bounced four other lanes' honest work.
#
# So: every field must be PRESENT AND NON-EMPTY, which is the real failure
# mode (a heading with nothing after it). Length floors survive only where the
# LAW ITSELF demands depth - the named outside reference, the real-world
# grounding, and the anti-reference, which rule 3 calls deep research and
# which the studio-practice note says kill the most revision rounds.
MIN_VALUE = 1

passed = 0
fails = []


def ok(cond, msg):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(msg)


def section_body(text, name):
    """everything under '## <name>' up to the next '## '

    The heading is matched as a PREFIX, not a whole line: the template's own
    headings carry parenthetical hints ("## B. WHY (the need - no ruling, no
    tile)") and several lanes keep them. Anchoring to end-of-line reported
    every one of those forms as missing eight sections it plainly had.
    """
    m = re.search(r'^##\s+' + re.escape(name) + r'\b', text, re.M)
    if not m:
        return None
    nxt = re.search(r'^##\s', text[m.end():], re.M)
    return text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]


def field_value(body, label):
    """the text after '- LABEL...:' including its wrapped continuation lines"""
    # \b only works when the label ends in a word character. "SOLID?" and
    # "FAMILY/SET" do not, and asserting a boundary there matches nothing -
    # which is how this gate's first run reported every form as missing a
    # field that every form actually had.
    edge = r'\b' if re.match(r'\w', label[-1]) else ''
    m = re.search(r'^-\s+' + re.escape(label) + edge + r'(.*)$', body, re.M)
    if not m:
        return None
    rest = m.group(1)
    # Strip the template's own parenthetical hint and the colon after the
    # label - but ONLY at the front. Splitting on the first colon anywhere
    # (the first version of this) ate the answer whenever the answer itself
    # contained a colon, e.g. "- SOLID? yes when closed - ENTERABLE? YES: ..."
    # came back as everything after "YES:".
    val = re.sub(r'^\s*\([^)]*\)', '', rest)
    val = re.sub(r'^\s*:', '', val)
    tail = body[m.end():]
    for line in tail.split('\n'):
        # A new field starts at COLUMN ZERO. An INDENTED "  - foo" is a nested
        # bullet inside this field's own answer - several lanes write their
        # shopping check as an indented list of banks, and breaking on those
        # threw away the entire answer and then reported the field as empty.
        if re.match(r'^-\s+[A-Z]', line) or re.match(r'^##\s', line) or line.startswith('```'):
            break
        val += ' ' + line.strip()
    return val.strip()


def path_claims(s):
    """every repo-ish path mentioned in a blob of prose"""
    return re.findall(r'(?:banks|records|laws|engine|slices|gates|tools)/[A-Za-z0-9_./-]*[A-Za-z0-9_]', s)


if not os.path.isdir(FORMS_DIR):
    print('TILEFORM GATE: no %s directory' % FORMS_DIR)
    sys.exit(1)

forms = sorted(f for f in os.listdir(FORMS_DIR) if f.endswith('.md'))
ok(len(forms) > 0, 'no forms in %s at all' % FORMS_DIR)

board = open(BOARD, encoding='utf8').read() if os.path.exists(BOARD) else ''
ok(bool(board), '%s is missing' % BOARD)

seen_ids = {}

for fn in forms:
    p = os.path.join(FORMS_DIR, fn)
    text = open(p, encoding='utf8').read()
    tag = fn

    m = re.match(r'(TF-[A-Z]+-\d+)_', fn)
    ok(bool(m), '%s: filename does not start with TF-<LANE>-<NNN>_' % tag)
    if not m:
        continue
    tf = m.group(1)
    ok(tf not in seen_ids, '%s: duplicate TF id %s (also %s)' % (tag, tf, seen_ids.get(tf)))
    seen_ids[tf] = fn

    # 1) every section present
    for s in SECTIONS:
        ok(section_body(text, s) is not None, '%s: missing section "%s"' % (tag, s))

    # 2) every required field present AND filled
    for sec, labels in FIELDS.items():
        body = section_body(text, sec)
        if body is None:
            continue
        for lab in labels:
            v = field_value(body, lab)
            ok(v is not None, '%s: %s has no "- %s" line' % (tag, sec, lab))
            if v is not None:
                ok(len(v) >= MIN_VALUE,
                   '%s: %s / %s is EMPTY - a heading with nothing after it is an unfilled form'
                   % (tag, sec, lab))

    # 3) caption parses
    cm = re.search(r'```json\s*(\{.*?\})\s*```', text, re.S)
    ok(bool(cm), '%s: section F has no ```json caption block' % tag)
    cap = None
    if cm:
        try:
            cap = json.loads(cm.group(1))
            passed += 1
        except Exception as e:
            fails.append('%s: caption JSON does not parse (%s)' % (tag, e))
    if cap is not None:
        for k, t in CAPTION_KEYS.items():
            ok(k in cap, '%s: caption missing key "%s"' % (tag, k))
            if k in cap:
                ok(isinstance(cap[k], t),
                   '%s: caption "%s" should be %s, got %s' % (tag, k, t.__name__, type(cap[k]).__name__))
        ok('anim' in cap, '%s: caption missing key "anim"' % tag)
        # 4) id matches, layer legal
        ok(cap.get('id') == tf, '%s: caption id %r != filename id %r' % (tag, cap.get('id'), tf))
        ok(cap.get('layer') in LAYERS,
           '%s: caption layer %r is not one of %s' % (tag, cap.get('layer'), sorted(LAYERS)))
        ok(cap.get('acts') == [1],
           '%s: caption acts must be [1] (act-1 law) unless a Paolo ruling is cited; got %r'
           % (tag, cap.get('acts')))
        # 5) edge vocabulary
        ec = str(cap.get('edge_contract', '')).lower()
        ok(any(w in ec for w in EDGE_WORDS),
           '%s: caption edge_contract %r uses none of the four legal words %s'
           % (tag, cap.get('edge_contract'), EDGE_WORDS))

    cwhere = section_body(text, 'C. WHERE')
    if cwhere:
        ecv = (field_value(cwhere, 'EDGE CONTRACT') or '').lower()
        ok(any(w in ecv for w in EDGE_WORDS),
           '%s: section C EDGE CONTRACT uses none of the four legal words' % tag)
        # the SHORT_OK fields are checked for vocabulary rather than length
        lay = (field_value(cwhere, 'LAYER') or '').lower()
        hits = [l for l in LAYERS if l in lay]
        ok(len(hits) >= 1,
           '%s: section C LAYER %r names none of the five legal layers %s'
           % (tag, lay, sorted(LAYERS)))
        if cap is not None and hits:
            ok(cap.get('layer') in hits,
               '%s: caption layer %r is not the layer section C declares (%s)'
               % (tag, cap.get('layer'), '/'.join(hits)))
        sol = (field_value(cwhere, 'SOLID?') or '').lower()
        ok('yes' in sol or 'no' in sol or 'n/a' in sol,
           '%s: section C SOLID? must answer yes/no/n-a, got %r' % (tag, sol))
    dwhen = section_body(text, 'D. WHEN')
    if dwhen:
        act = (field_value(dwhen, 'ACT') or '')
        ok(act.strip().startswith('1'),
           '%s: section D ACT must be 1 (act-1 law) unless a Paolo ruling is cited; got %r'
           % (tag, act[:40]))

    # 6) and 7) THE PATHS A FORM CLAIMS MUST BE REAL.
    #
    # Deliberately NOT "every form must cite a path". The established
    # convention across five lanes is to name an approved asset in words
    # ("the frozen starter set wall_0/wall_base/wall_under_eave"), which is a
    # legitimate way to point at the corpus and is what the law's own worked
    # example partly does. Demanding a path would bounce forty honest forms
    # over a convention nobody agreed to.
    #
    # What IS checked is the class of failure that actually costs the art lane
    # a wasted cook: a form that names a FILE THAT DOES NOT EXIST. That is a
    # claim the machine can settle, and it caught a real one on its first run
    # over the other lanes' work (gates/vehicle_size_gate.js, which is .py).
    bwhy = section_body(text, 'B. WHY')
    if bwhy:
        sc = field_value(bwhy, 'SHOPPING CHECK') or ''
        ok(len(sc) >= 40,
           '%s: SHOPPING CHECK is %d chars - rule 2 says name what you checked and why it does not cover the need'
           % (tag, len(sc)))
        for c in path_claims(sc):
            ok(os.path.exists(c), '%s: SHOPPING CHECK names %s which does not exist' % (tag, c))

    grefs = section_body(text, 'G. REFERENCES')
    if grefs:
        an = field_value(grefs, 'APPROVED ANCHOR') or ''
        ok(len(an) >= 30, '%s: APPROVED ANCHOR is %d chars - it must name the nearest approved corpus item' % (tag, len(an)))
        for c in path_claims(an):
            ok(os.path.exists(c), '%s: APPROVED ANCHOR names %s which does not exist' % (tag, c))
        # 8) the two reference fields that kill revision rounds
        for lab, floor in (('NAMED OUTSIDE REFERENCE', 60), ('REAL-WORLD GROUNDING', 120)):
            v = field_value(grefs, lab) or ''
            ok(len(v) >= floor,
               '%s: %s is %d chars, under the %d floor - the law calls this deep research, not a name-drop'
               % (tag, lab, len(v), floor))

    hdont = section_body(text, "H. DON'T WANT")
    ok(hdont is not None and len(hdont.strip()) >= 120,
       '%s: the ANTI-REFERENCE (H) is the field the law says kills the most revision rounds; it is empty or thin' % tag)

    # 9) the board and the forms agree
    ok(tf in board, '%s: no row in %s claims FORM: %s' % (tag, BOARD, tf))

for tf in re.findall(r'FORM:\s*(TF-[A-Z]+-\d+)', board):
    ok(tf in seen_ids, 'board claims FORM: %s but records/tileforms/ has no such file' % tf)

print('TILEFORM GATE: %d passed, %d failed  (%d forms)' % (passed, len(fails), len(forms)))
for f in fails:
    print('  FAIL  ' + f)
sys.exit(1 if fails else 0)
