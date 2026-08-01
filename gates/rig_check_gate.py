#!/usr/bin/env python3
"""
BOHEMIA RIG CHECK GATE (7/30/26)

laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md has been law since 7/26 and had
NO MACHINE GATE. By this repo's own FACTORY LAW ("a law without a machine gate is
not enforced", proven 7/16 when six of nine gated laws were already broken), that
means it was not enforced -- and the lane charter in BOHEMIA_BACKLOG.md has listed
"the rig-check gate assertion" as the CHARACTER lane's next first item ever since.
Measured 7/30: 22 tools touch the rig, ZERO documented what they built on.

Why it matters more than a docstring convention: the woman-rig v1-v4 arc is the
canonical post-mortem in that law -- four versions of INVENTING NEW ANATOMY
instead of adjusting the one rig. Kill-reason: IGNORED-THE-RIG. Nothing in the
machine noticed any of the four. This gate is what notices.

THE THREE THINGS IT LOCKS, matching the law's own numbered clauses:

  1. THE RIG CHECK (law item 2). Every tool that touches the rig documents which
     rig surfaces it built on, in the REUSE-FIRST shape: a claim the machine can
     check, never a name-drop. Each block carries an authored sentence plus a
     derived `built on: / joints: / parts:` line, and this gate RE-DERIVES that
     line from the source. Name a joint the tool does not use and it fails.

  2. NO PARALLEL BODY (law items 1 and 4). A "body definition" is an object
     carrying the rig's joint signature whose joint values are COORDINATE PAIRS.
     Measured on the alpha: exactly two exist, BAKED (the rig) and BAKED_EDITS
     (Paolo's edits ON the rig, keyed to the same joints). Everything else that
     mentions joints -- LIFT, ALONG, wOf, EDIT_CHAIN -- holds SCALARS or parent
     lists, i.e. it keys OFF the rig instead of redefining it. A third coordinate
     body appearing is a second anatomy, which is the exact failure the law names.

  3. CLIPS RESOLVE THROUGH THE RIG (law item 4). The render base is BAKED.pose,
     and the variation dials derive from BAKED rather than replacing it.

  python3 gates/rig_check_gate.py
"""
import glob
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
LAW = 'laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md'

RIG = re.compile(r'\bBAKED\b|posedSkel|SKINNERS?\b|SKINNER_API|rigSkel|BODY_PKG|BOH_BODYVAR|bakedFor')
JOINTS = ['neck', 'shL', 'shR', 'elL', 'elR', 'waA', 'waB', 'waC', 'knA', 'knB',
          'headTop', 'handL', 'handR', 'footA', 'footB']
API = ['BAKED.pose', 'BAKED.layers', 'BAKED.skeleton', 'BAKED.layerOverride', 'BAKED',
       'posedSkel', 'rigSkel', 'SKINNERS', 'SKINNER_API', 'BODY_PKG', 'BOH_BODYVAR', 'bakedFor']

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))


print('=== RIG CHECK GATE ===')

# ---------------------------------------------------------------- the record
check('the law is recorded', os.path.exists(LAW))
check('the stamping tool is checked in', os.path.exists('tools/bohemia_rig_check_stamp.py'))
if failed:
    print('=== %d passed / %d failed ===' % (passed, len(failed)))
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)

law = open(LAW, encoding='utf8').read()
flat = re.sub(r'\s+', ' ', law)
check('the law still names the woman-rig v1-v4 post-mortem',
      'woman-rig v1-v4' in flat, 'the canonical IGNORED-THE-RIG case')
check('the law still names the kill-reason IGNORED-THE-RIG', 'IGNORED-THE-RIG' in flat)
check('the law still requires work to CITE its rig layers',
      'cannot cite its rig layers is invalid' in flat)

# ------------------------------------------------- 1. THE RIG CHECK, per tool
def code_only(s):
    """Strip docstrings and comments before deciding a tool TOUCHES the rig.

    8/1: this gate failed a COMBAT-lane tool that never goes near the rig. Its
    only match was the English sentence "FROM WHAT IT IS BAKED FROM" -- the word
    BAKED, in prose, about an animation clip. Classifying that as rig contact and
    then demanding a rig citation for it is the same mistake this gate exists to
    punish in the other direction: it could not tell a USE from a MENTION.

    Note the asymmetry, which is deliberate. Classification reads CODE ONLY, so
    prose can never drag a tool in. But once a tool IS classified, its citation
    is still re-derived against the source with the RIG CHECK block removed --
    because there the risk runs the other way, and a claim must be checkable.

    THE MODULE DOCSTRING ONLY -- not every triple-quoted string. The first
    attempt at this stripped all of them and gutted the gate: 167 checks fell to
    107, and a deliberately falsified citation sailed through. These are PATCH
    tools, so their injected JS lives in r'''...''' payloads -- that is CODE
    wearing quotes, and stripping it hid every real rig reference in the repo.
    A mutation test caught it. Prose lives in the module docstring and in
    comments; that is all that comes out.
    """
    s = re.sub(r'\A(?:#![^\n]*\n)?\s*(?:"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')', '', s)
    s = re.sub(r'/\*[\s\S]*?\*/', '', s)
    s = re.sub(r'^\s*#[^\n]*$', '', s, flags=re.M)
    s = re.sub(r'^\s*//[^\n]*$', '', s, flags=re.M)
    return s

tools = []
for f in sorted(glob.glob('tools/*.py') + glob.glob('tools/*.js')):
    src = open(f, encoding='utf8', errors='replace').read()
    if RIG.search(code_only(src)) and os.path.basename(f) != 'bohemia_rig_check_stamp.py':
        tools.append((f, src))

check('rig-touching tools found', len(tools) > 0, '%d' % len(tools))

for f, src in tools:
    name = os.path.basename(f)
    m = re.search(r'RIG CHECK[^\n]*\n(.*?)(?:\n\s*\n|"""|\*/)', src, re.S)
    check('%s carries a RIG CHECK block' % name, bool(m))
    if not m:
        continue
    block = m.group(1)
    # THE SELF-REFERENCE HOLE, found by adversarially testing this gate on 7/30:
    # the claim lives IN the source, so "is footB in the file?" finds the CLAIM,
    # not a use of the joint -- the first version of this gate happily passed a
    # tool that claimed a joint it never touched. Re-derive against the source
    # with the block REMOVED, which is the same reason REUSE-FIRST demands a real
    # open() call rather than a docstring mention.
    body = src.replace(m.group(0), '')

    # the block must actually name rig surfaces, not just exist
    b_api = re.search(r'built on:\s*([^\n]*)', block)
    b_j = re.search(r'joints:\s*([^\n]*)', block)
    b_p = re.search(r'parts:\s*([^\n]*)', block)
    check('%s names what it built on' % name, bool(b_api))
    if not (b_api and b_j and b_p):
        continue

    # RE-DERIVE from the source. A claim the machine can check.
    claimed_api = [a.strip() for a in b_api.group(1).split(',') if a.strip()]
    for a in claimed_api:
        if a == 'the BAKED package':
            continue
        check('%s: claimed rig API %s is really used' % (name, a), a in body)

    claimed_j = [j.strip() for j in b_j.group(1).split(',')
                 if j.strip() and j.strip() != 'none named']
    for j in claimed_j:
        check('%s: claimed joint %s is really used' % (name, j),
              bool(re.search(r'\b%s\b' % re.escape(j), body)))

    claimed_p = re.findall(r'(\d{1,2})=', b_p.group(1))
    for p in claimed_p:
        check('%s: claimed part %s is really used' % (name, p),
              bool(re.search(r'\b%s\b' % p, body)))

# -------------------------------------------- 2. NO PARALLEL BODY, in the alpha
src = open(ALPHA, encoding='utf8').read()
sig = re.compile(r'"?(?:shL|shR|elL|elR|handL|handR|headTop|waA|knA|footA)"?\s*:')
# a joint whose value is a COORDINATE PAIR is a body; a scalar/list is a parameter
coord = re.compile(r'"?(?:shL|shR|elL|elR|handL|handR|headTop)"?\s*:\s*\[\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\]')


def balanced(s, i):
    d = 0
    for k in range(i, len(s)):
        if s[k] == '{':
            d += 1
        elif s[k] == '}':
            d -= 1
            if d == 0:
                return s[i:k + 1]
    return s[i:]


bodies = []
for m in re.finditer(r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\{', src):
    obj = balanced(src, src.index('{', m.start()))
    if len(sig.findall(obj)) >= 5 and coord.search(obj):
        bodies.append(m.group(1))

check('the alpha defines a body at all', len(bodies) > 0, '%d found' % len(bodies))
check('ONE painted rig, plus his edits ON it -- no third anatomy',
      sorted(set(bodies)) == ['BAKED', 'BAKED_EDITS'],
      'found: %s' % ', '.join(sorted(set(bodies))))

# the rig itself is whole
m = re.search(r'const BAKED=(\{.*?\});?\n', src, re.S)
check('BAKED is present in the alpha', bool(m))
if m:
    baked = m.group(1)
    check('BAKED.pose carries all 8 facings',
          len(re.findall(r'"(?:S|SE|E|NE|N|NW|W|SW)"\s*:', baked)) >= 8)
    for j in ['neck', 'shL', 'shR', 'handL', 'handR', 'headTop', 'footA', 'footB']:
        check('BAKED still defines joint %s' % j, ('"%s"' % j) in baked)

# ------------------------------------- 3. CLIPS RESOLVE THROUGH THE RIG
check('the render base IS BAKED.pose (not a private skeleton)',
      bool(re.search(r'let\s+RIG\s*=\s*BAKED\.pose', src)))
check('the variation dials DERIVE from BAKED rather than replacing it',
      bool(re.search(r'BOH_BODYVAR\.apply\(BAKED\s*,', src)))
check('the rest grid the art was painted at is BAKED.skeleton',
      bool(re.search(r'skeleton\s*:\s*BAKED\.skeleton', src)))

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
