#!/usr/bin/env python3
"""
BOHEMIA -- EYES AND EARS -- THE NO-READER SWEEP  (E11 round 2, 9/6/26)

THE JOB (VAMILY lane 17, E11 [pixels only]):
    "find every decision of Paolo's that exists ONLY as rendered pixels or browser
     storage and not as a file the game can read."

THE CORRECTED RULE, FROM ROUND ONE'S SCHOOL
    records/BOHEMIA_EYES_E11_ROUND_1_SCHOOL_THE_ARTIFACT_GAP_9_6_26.md

    The job title says "it lives only as pixels" is the defect. School proved that
    false: encoding data in an image is a legitimate, established practice, and
    Aseprite and Lospec both treat a PNG as a first-class palette container beside
    .gpl and .pal. THE DEFECT IS NOT THE CONTAINER. THE DEFECT IS NO READER.

    So this sweep never asks "is it a picture". It asks two questions in order,
    cheapest first, straight out of the round-one spec:

        Q1  is there a file that holds this in a form a parser can open
        Q2  does anything the shipped game actually LOADS read that file

    and it hands back four verdict words:

        LIVE      file exists and the shipped bundle contains it. Nothing owed.
        ORPHAN    file exists, nothing the game loads reads it. LOOKS answered.
        STRANDED  no readable carrier at all. The faction-colour case.
        DRIFTED   file read, but the surface disagrees. Q3, deferred, not built.

WHY THE READER SET IS MEASURED LIVE AND NOT GREPPED
    tools/bohemia_eyes_bundle.js opens the shipped alpha and the shipped demo in
    the real Chromium at iPhone size and records every file the browser fetched.
    A grep cannot tell a loaded file from a file that merely exists on disk, and
    that difference IS this job.

HOW THE FINGERPRINT WORKS, AND THE TWO WRONG VERSIONS BEFORE IT
    v1 looked for the build banner  /* ==== engine/x.js ==== */  and reported 65
       orphans. FALSE. bohemia_coalition.js shipped one round ago and was on the
       list, because its real banner reads
           /* ==== engine/bohemia_coalition.js (COALITION, 9/6) ==== */
       and the regex demanded "====" straight after ".js".
    v2 fixed the regex and reported 30 non-test orphans. STILL FALSE.
       bohemia_sfx.js was on the list and the game plainly plays sounds; the alpha
       inlines it under a completely different marker,
           /* ENGINE SYNC LAW: this body is engine/bohemia_sfx.js, inlined verbatim.
       Two inlining conventions, and a third would break it again.
    v3, this one, ignores markers entirely and matches the CODE. It takes up to
       eight long, distinctive, non-comment lines out of the module and asks how
       many appear verbatim inside the shipped bundle. Three or more is LIVE.
       A build convention can change; the body cannot.

WHAT THIS SWEEP CANNOT SEE (declared, never counted as clean)
    - a value the code assembles at runtime out of pieces is invisible to any text
      scan; every mature hardcoded-value linter has this hole and says so
    - a module reached only on a path the bundle walk never takes
    - whether a value that IS read is still the value Paolo ruled (that is Q3)

THE IGNORE LIST, IN THE OPEN
    - engine/*_tests.js         test harnesses are not meant to ship
    - banks/**  with draft:true these say in their own note that they are never
                                wired into the game; they are reported as DRAFT,
                                a separate column, never as ORPHAN
    Every mature linter of this kind ships an exclude list, and that is why they
    survive a real codebase rather than being muted in week one.

RULE ZERO (from E9): A ZERO NEEDS A POSITIVE CONTROL.
    --selftest plants three known cases and refuses to trust the sweep unless all
    three land in the right bucket: a known LIVE, a known ORPHAN, and a known
    UNGATED law. The ORPHAN control is the important one; without it a sweep can
    pass every check just by finding files.

USAGE
    python3 tools/bohemia_eyes_no_reader.py            # the sweep
    python3 tools/bohemia_eyes_no_reader.py --selftest # prove it bites first
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUNDLE_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_BUNDLE_9_6_26.json')
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_NO_READER_9_6_26.json')

IGNORE_ENGINE = re.compile(r'_tests\.js$')
FP_MIN_LEN = 45
FP_TAKE = 8
FP_NEED = 3


def load_bundle_text():
    """The shipped bundle, as one string. This is everything the game can read."""
    if not os.path.exists(BUNDLE_JSON):
        sys.exit('no bundle record. run: node tools/bohemia_eyes_bundle.js first')
    doc = json.load(open(BUNDLE_JSON))
    files, text = [], []
    for rel in doc['bundle']:
        p = os.path.join(ROOT, rel)
        if os.path.exists(p):
            files.append(rel)
            text.append(open(p, encoding='utf-8', errors='replace').read())
    return doc, files, '\n'.join(text)


def fingerprints(src):
    """Up to FP_TAKE long distinctive non-comment lines, spread through the file."""
    good = []
    for ln in src.split('\n'):
        s = ln.strip()
        if len(s) < FP_MIN_LEN:
            continue
        if s.startswith('//') or s.startswith('*') or s.startswith('/*') or s.startswith('#'):
            continue
        if not re.search(r'[A-Za-z]', s):
            continue
        good.append(s)
    if not good:
        return []
    step = max(1, len(good) // FP_TAKE)
    return good[::step][:FP_TAKE]


def census_engine(bundle_text):
    """Q1+Q2 for every engine module: is its CODE inside what the game loads?"""
    rows = []
    for p in sorted(glob.glob(os.path.join(ROOT, 'engine', '*.js'))):
        rel = os.path.relpath(p, ROOT)
        src = open(p, encoding='utf-8', errors='replace').read()
        if IGNORE_ENGINE.search(rel):
            rows.append({'file': rel, 'verdict': 'IGNORED', 'why': 'test harness, not meant to ship'})
            continue
        fps = fingerprints(src)
        hits = sum(1 for f in fps if f in bundle_text)
        rows.append({
            'file': rel,
            'verdict': 'LIVE' if hits >= FP_NEED else 'ORPHAN',
            'fingerprints': len(fps),
            'hits': hits,
            'bytes': len(src),
        })
    return rows


def census_laws():
    """The repo's own pillar law: A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
    So: does any file under gates/ name this law file? Exact, no keyword guessing."""
    gate_text = []
    for p in glob.glob(os.path.join(ROOT, 'gates', '*')):
        if os.path.isfile(p):
            try:
                gate_text.append(open(p, encoding='utf-8', errors='replace').read())
            except Exception:
                pass
    gates_blob = '\n'.join(gate_text)
    rows = []
    for p in sorted(glob.glob(os.path.join(ROOT, 'laws', '*.md'))):
        base = os.path.basename(p)
        rows.append({'file': 'laws/' + base, 'verdict': 'GATED' if base in gates_blob else 'UNGATED'})
    return rows


def census_banks(bundle_text):
    """A data file that looks answered. Read by the game, read by a checker,
    superseded by a newer sibling, declared draft, or read by nobody.

    THREE BUGS THIS FUNCTION HAD, ALL FOUND BY CHECKING A RESULT BEFORE REPORTING IT:
      bug 1  the reader globs were 'tools/*' and 'gates/*', NOT recursive, so three
             tileform candidate banks read as ORPHAN while tools/tfcook/TF-XXX_cook.py
             was opening them by name the whole time.
      bug 2  five dated SFX approval banks read as ORPHAN. They are SUPERSEDED, not
             stranded: measured, the newest bank carries all 185 picks and misses
             none of the 132 in the older ones. A dated snapshot nobody reads is
             normal churn; calling it a lost ruling is a false alarm, and false
             alarms are how a sweep gets muted in week one.
      bug 3  (in the_named_case) it globbed engine/*.js only, so it missed
             engine/BOHEMIA_faction_colours.json and declared the faction colours
             STRANDED when they had shipped that same round.
    """
    readers = []
    for pat in ('engine/**/*', 'tools/**/*', 'gates/**/*'):
        for p in glob.glob(os.path.join(ROOT, pat), recursive=True):
            if os.path.isfile(p):
                try:
                    readers.append(open(p, encoding='utf-8', errors='replace').read())
                except Exception:
                    pass
    readers_blob = '\n'.join(readers)

    files = sorted(glob.glob(os.path.join(ROOT, 'banks', '**', '*.json'), recursive=True))
    loaded = {}
    for p in files:
        try:
            loaded[p] = json.load(open(p, encoding='utf-8'))
        except Exception:
            loaded[p] = None

    def content_pairs(doc):
        """flatten a bank to a set of (key, item) so one bank can contain another"""
        out = set()
        if isinstance(doc, dict):
            for k, v in doc.items():
                if isinstance(v, list):
                    for i in v:
                        try:
                            out.add((k, json.dumps(i, sort_keys=True)))
                        except Exception:
                            pass
        return out

    stem = re.compile(r'^(.*?)_\d+_\d+b?_\d+\.json$')

    rows = []
    for p in files:
        rel = os.path.relpath(p, ROOT)
        base = os.path.basename(p)
        doc = loaded[p]
        draft = bool(isinstance(doc, dict) and doc.get('draft'))
        if base in bundle_text:
            v = 'LIVE'
        elif base in readers_blob:
            v = 'READ BY A CHECKER'
        else:
            v = None
            m = stem.match(base)
            if m and doc is not None:
                mine = content_pairs(doc)
                if mine:
                    for q in files:
                        qb = os.path.basename(q)
                        if q == p or not qb.startswith(m.group(1) + '_'):
                            continue
                        if not (qb in bundle_text or qb in readers_blob):
                            continue
                        theirs = content_pairs(loaded[q])
                        if theirs and not (mine - theirs):
                            v = 'SUPERSEDED'
                            break
            if v is None:
                v = 'DRAFT' if draft else 'ORPHAN'
        rows.append({'file': rel, 'verdict': v, 'draft': draft})
    return rows



def census_promised_gates():
    """CENSUS D -- THE SHARPEST ONE, AND IT WAS AN ACCIDENT.

    CLAUDE.md's law index advertises a gate for a law like this:

        - COMPARE EVERY PIECE OF ART TO THE WORLD ... | gate reference_check_gate

    That line is a promise every chat reads and believes. The repo's own pillar law
    says A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so a promised gate that does
    not exist is worse than a law with no gate at all: the second is honest and the
    first is a ruling everybody thinks is being checked.

    This is the cleanest STRANDED case the sweep can find, because there is nothing
    to interpret: the index names a file, and the file is or is not there, and the
    suite does or does not run it.
    """
    idx = open(os.path.join(ROOT, 'CLAUDE.md'), encoding='utf-8').read()
    suite = ''
    sp = os.path.join(ROOT, 'gates', 'bohemia_gates.py')
    if os.path.exists(sp):
        suite = open(sp, encoding='utf-8', errors='replace').read()
    rows = []
    for name in sorted(set(re.findall(r'\| gate ([A-Za-z0-9_.]+)', idx))):
        found = None
        for cand in (name, name + '.js', name + '.py'):
            if os.path.exists(os.path.join(ROOT, 'gates', cand)):
                found = 'gates/' + cand
                break
        if not found:
            v = 'PROMISED BUT MISSING'
        elif name not in suite:
            v = 'EXISTS BUT NEVER RUN'
        else:
            v = 'REAL'
        rows.append({'gate': name, 'file': found, 'verdict': v})
    return rows


def the_named_case(bundle_text):
    """COLOUR IS TERRITORY, 8/26, LOCKED. The ruling the coordinator named as the
    reason this job exists. Is there a faction-to-colour carrier anywhere, and can
    the shipped game read it?"""
    hits = []
    pat = re.compile(r'(colour|color)', re.I)
    cands = (glob.glob(os.path.join(ROOT, 'engine', '**', '*'), recursive=True)
             + glob.glob(os.path.join(ROOT, 'banks', '**', '*.json'), recursive=True)
             + glob.glob(os.path.join(ROOT, 'records', '*.json')))
    for p in cands:
        if not os.path.isfile(p):
            continue
        base = os.path.basename(p)
        if not pat.search(base):
            continue
        rel = os.path.relpath(p, ROOT)
        # BUG 4, same class as bugs 1-3: asking whether the FILENAME appears in the
        # bundle says False for a file that is inlined verbatim, which is exactly how
        # this repo ships its data. Ask whether its CONTENT is there instead.
        try:
            body = open(p, encoding='utf-8', errors='replace').read()
        except Exception:
            body = ''
        fps = [x for x in re.findall(r'#[0-9a-fA-F]{6}', body)] or fingerprints(body)
        hit = sum(1 for f in set(fps) if f in bundle_text)
        hits.append({'file': rel, 'values_found_in_bundle': hit, 'values_total': len(set(fps)),
                     'in_bundle': hit > 0 and hit >= max(1, len(set(fps)) // 2)})
    # and: does the shipped bundle carry a faction name next to a hex at all?
    factions = ['Mob', 'Cartel', 'Remnants', 'Caravans', 'Colorful', 'Homeless', 'Volunteers']
    near = {}
    for f in factions:
        n = 0
        for m in re.finditer(re.escape(f), bundle_text):
            w = bundle_text[max(0, m.start() - 200): m.start() + 200]
            if re.search(r'#[0-9a-fA-F]{6}\b', w):
                n += 1
        near[f] = n
    return {'carrier_files': hits, 'faction_name_within_200_chars_of_a_hex': near}


def selftest():
    """RULE ZERO: a zero needs a positive control. Plant three known cases."""
    import shutil
    made = []
    ok = True
    try:
        # control 1: a known ORPHAN engine module -- real code, nothing loads it
        orphan = os.path.join(ROOT, 'engine', '__eyes_control_orphan.js')
        open(orphan, 'w').write('\n'.join(
            'const EYES_CONTROL_ORPHAN_%d = "this line exists nowhere in any shipped slice at all %d";' % (i, i)
            for i in range(12)))
        made.append(orphan)
        # control 2: a known LIVE engine module -- copy lines straight out of the bundle
        doc, files, bundle_text = load_bundle_text()
        lines = [l.strip() for l in bundle_text.split('\n') if len(l.strip()) >= FP_MIN_LEN and not l.strip().startswith('//')]
        live = os.path.join(ROOT, 'engine', '__eyes_control_live.js')
        open(live, 'w').write('\n'.join(lines[::max(1, len(lines)//40)][:40]))
        made.append(live)
        # control 3: a known UNGATED law -- a law file no gate has ever heard of
        law = os.path.join(ROOT, 'laws', 'BOHEMIA_LAW___EYES_CONTROL_UNGATED_9_6_26.md')
        open(law, 'w').write('# control law. no gate names this file.\n')
        made.append(law)

        # control 4: a gate the law index promises that does not exist
        cm = os.path.join(ROOT, 'CLAUDE.md')
        cm_before = open(cm, encoding='utf-8').read()
        open(cm, 'w', encoding='utf-8').write(cm_before + '\n- EYES CONTROL LAW -> laws/x.md | gate __eyes_control_absent_gate\n')
        made.append(('RESTORE', cm, cm_before))

        eng = {r['file']: r for r in census_engine(bundle_text)}
        lws = {r['file']: r for r in census_laws()}
        checks = [
            ('a planted module nothing loads reads ORPHAN', eng.get('engine/__eyes_control_orphan.js', {}).get('verdict') == 'ORPHAN'),
            ('a planted module made of shipped code reads LIVE', eng.get('engine/__eyes_control_live.js', {}).get('verdict') == 'LIVE'),
            ('a planted law no gate names reads UNGATED', lws.get('laws/BOHEMIA_LAW___EYES_CONTROL_UNGATED_9_6_26.md', {}).get('verdict') == 'UNGATED'),
            ('a promised gate that does not exist reads PROMISED BUT MISSING',
             any(r['gate'] == '__eyes_control_absent_gate' and r['verdict'] == 'PROMISED BUT MISSING'
                 for r in census_promised_gates())),
        ]
        print('SELFTEST -- RULE ZERO: a zero needs a positive control')
        for name, good in checks:
            print(('   PASS  ' if good else '   FAIL  ') + name)
            ok = ok and good
    finally:
        for m in made:
            try:
                if isinstance(m, tuple):
                    open(m[1], 'w', encoding='utf-8').write(m[2])
                else:
                    os.remove(m)
            except Exception:
                pass
    print('SELFTEST: ' + ('the sweep bites. results below can be trusted.' if ok else 'THE SWEEP IS BLIND. DO NOT TRUST ANY NUMBER IT PRINTS.'))
    return ok


def main():
    if '--selftest' in sys.argv:
        sys.exit(0 if selftest() else 1)
    doc, files, bundle_text = load_bundle_text()
    if not selftest():
        sys.exit('refusing to report numbers from a blind sweep')
    print()
    print('THE READER SET: %d files, %.1f MB. That is everything the shipped game can read.' % (len(files), len(bundle_text) / 1048576.0))

    eng = census_engine(bundle_text)
    lws = census_laws()
    bnk = census_banks(bundle_text)
    named = the_named_case(bundle_text)
    promised = census_promised_gates()

    e_live = [r for r in eng if r['verdict'] == 'LIVE']
    e_orph = [r for r in eng if r['verdict'] == 'ORPHAN']
    e_ign = [r for r in eng if r['verdict'] == 'IGNORED']
    l_un = [r for r in lws if r['verdict'] == 'UNGATED']
    b_orph = [r for r in bnk if r['verdict'] == 'ORPHAN']
    b_draft = [r for r in bnk if r['verdict'] == 'DRAFT']

    print()
    print('CENSUS A -- ENGINE MODULES (does the shipped game contain this code?)')
    print('   LIVE     %3d' % len(e_live))
    print('   ORPHAN   %3d   <- real code, nothing the game loads reads it' % len(e_orph))
    print('   IGNORED  %3d   (test harnesses, on the written ignore list)' % len(e_ign))
    for r in sorted(e_orph, key=lambda r: -r['bytes'])[:40]:
        print('        %-46s %6d bytes  %d/%d fingerprints found' % (r['file'], r['bytes'], r['hits'], r['fingerprints']))

    print()
    print('CENSUS B -- LAWS (does any checker name this law file?)')
    print('   laws on disk %d, GATED %d, UNGATED %d' % (len(lws), len(lws) - len(l_un), len(l_un)))

    print()
    print('CENSUS C -- DATA BANKS (a file that looks answered)')
    for v in ('LIVE', 'READ BY A CHECKER', 'SUPERSEDED', 'DRAFT', 'ORPHAN'):
        print('   %-18s %3d' % (v, len([r for r in bnk if r['verdict'] == v])))
    for r in b_orph:
        print('        ORPHAN  ' + r['file'])

    bad_gates = [r for r in promised if r['verdict'] != 'REAL']
    print()
    print('CENSUS D -- GATES THE LAW INDEX PROMISES (a ruling everybody thinks is checked)')
    print('   promised %d, real %d, broken %d' % (len(promised), len(promised) - len(bad_gates), len(bad_gates)))
    for r in bad_gates:
        print('        %-24s %s' % (r['gate'], r['verdict']))

    print()
    print('THE NAMED CASE -- COLOUR IS TERRITORY (8/26, LOCKED)')
    if not named['carrier_files']:
        print('   STRANDED. No colour carrier file exists at all.')
    else:
        for h in named['carrier_files']:
            print('   %-52s in the shipped bundle: %s' % (h['file'], h['in_bundle']))
    print('   faction name within 200 chars of a hex, inside the shipped bundle:')
    for k, v in named['faction_name_within_200_chars_of_a_hex'].items():
        print('        %-12s %d' % (k, v))

    out = {
        'what': 'EYES AND EARS -- E11 [pixels only] round 2, THE NO-READER SWEEP',
        'date': '9/6/26',
        'rule': 'the defect is not the container, the defect is NO READER',
        'school': 'records/BOHEMIA_EYES_E11_ROUND_1_SCHOOL_THE_ARTIFACT_GAP_9_6_26.md',
        'reader_set': files,
        'reader_set_bytes': len(bundle_text),
        'blind_spots': [
            'a value assembled at runtime out of pieces is invisible to any text scan',
            'a module reached only on a path the bundle walk never takes',
            'whether a value that IS read still matches what Paolo ruled (Q3, deferred)',
        ],
        'ignore_list': ['engine/*_tests.js', 'banks/** with draft:true are reported DRAFT, never ORPHAN'],
        'census_engine': eng,
        'census_laws_ungated': [r['file'] for r in l_un],
        'census_laws_total': len(lws),
        'census_banks': bnk,
        'named_case_colour_is_territory': named,
        'census_promised_gates': promised,
        'counts': {
            'engine_live': len(e_live), 'engine_orphan': len(e_orph), 'engine_ignored': len(e_ign),
            'laws_total': len(lws), 'laws_ungated': len(l_un),
            'banks_orphan': len(b_orph), 'banks_draft': len(b_draft),
            'gates_promised': len(promised), 'gates_broken': len(bad_gates),
        },
    }
    json.dump(out, open(OUT, 'w'), indent=1)
    print()
    print('written: ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
