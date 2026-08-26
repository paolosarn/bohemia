#!/usr/bin/env python3
"""
BOHEMIA UIBOOK INDEX (8/26/26, UI lane)

Paolo 8/26: "I need you to do big brain research on how to do big brain research
on studying other games UI for one round. And then the first basis of all of this
is gonna be Final Fantasy ten, my favorite UI of all time."

THIS IS THE QUESTBOOK MACHINE, POINTED AT INTERFACES. The quest side already
learned this lesson the hard way (QUEST STUDY LAW, 7/26): a corpus nobody can
QUERY is a corpus nobody reads, and 3,672 findings sat unopened for a month
because skipping them cost nothing and left no trace.

So a UI study is not an essay. It is a corpus of findings with STABLE IDS, and
every id resolves here:

    FFX.L03   LOOK  finding 3 of the Final Fantasy X round
    FFX.R01   READ  finding 1
    FFX.D02   DO    finding 2
    FFX.W04   WORLD finding 4

Mines uibook/BOHEMIA_UIBOOK_R*.md into records/BOHEMIA_UIBOOK_LAW_INDEX.json
(+ .md for Paolo). Never hand-edit the index.

  python3 tools/bohemia_uibook_index.py
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

SRC_GLOB = 'uibook/BOHEMIA_UIBOOK_R*.md'
OUT_JSON = 'records/BOHEMIA_UIBOOK_LAW_INDEX.json'
OUT_MD   = 'records/BOHEMIA_UIBOOK_LAW_INDEX.md'

MASTERS = {'LOOK': 'look', 'READ': 'read', 'DO': 'do', 'WORLD': 'world'}
# a finding's letter must agree with the master it sits under, or an id lies
LETTER_OF = {'look': 'L', 'read': 'R', 'do': 'D', 'world': 'W'}
VERDICTS = ('TAKE', 'ADAPT', 'REFUSE')

HEAD = re.compile(r'^###\s+([A-Z0-9]+)\.([LRDW])(\d{2})\s+(.+?)\s*$')
MASTER = re.compile(r'^MASTER:\s*([A-Z]+)\s*$')
FIELD = re.compile(r'^(LENS|SCREEN|WHAT|WHY|PORT|BECAUSE|CAUTION):\s*(.*)$')


def parse(path):
    """Returns (round_meta, [finding...]). Deliberately strict: a malformed
    finding is an ERROR, not a silently skipped row. The questbook's whole
    problem was findings that existed and were never reached."""
    findings, errs = [], []
    master = None
    cur = None
    field = None
    game = os.path.basename(path)

    lines = open(path, encoding='utf-8').read().split('\n')
    # the round's declared counts, checked against what we actually mine
    declared = {}
    for ln in lines[:40]:
        m = re.match(r'^#\s+(findings|look|read|do|world|take|adapt|refuse):', ln.strip())
        if m:
            for k, v in re.findall(r'(findings|look|read|do|world|take|adapt|refuse):\s*(\d+)', ln):
                declared[k] = int(v)
        elif re.search(r'(findings|take|adapt|refuse):\s*\d+', ln) and ln.startswith('#'):
            for k, v in re.findall(r'(findings|look|read|do|world|take|adapt|refuse):\s*(\d+)', ln):
                declared[k] = int(v)

    title = None
    for ln in lines[:6]:
        if ln.startswith('# BOHEMIA UIBOOK'):
            title = ln.lstrip('# ').strip()

    def close(c):
        if c:
            findings.append(c)

    for i, ln in enumerate(lines):
        mm = MASTER.match(ln.strip())
        if mm:
            close(cur); cur = None; field = None
            master = MASTERS.get(mm.group(1))
            if master is None:
                errs.append('line %d: unknown master %r' % (i + 1, mm.group(1)))
            continue
        hm = HEAD.match(ln)
        if hm:
            close(cur); field = None
            prefix, letter, num, ftitle = hm.groups()
            if master is None:
                errs.append('line %d: finding %s before any MASTER:' % (i + 1, hm.group(0)))
            elif letter != LETTER_OF[master]:
                errs.append('line %d: %s.%s%s sits under MASTER %s (wants letter %s)'
                            % (i + 1, prefix, letter, num, master.upper(), LETTER_OF[master]))
            cur = {'id': '%s.%s%s' % (prefix, letter, num), 'game': prefix,
                   'kind': master or '?', 'title': ftitle.strip(),
                   'source': os.path.basename(path), 'line': i + 1,
                   'lens': '', 'screen': '', 'what': '', 'why': '',
                   'port': '', 'because': '', 'caution': ''}
            continue
        if cur is None:
            continue
        fm = FIELD.match(ln)
        if fm:
            field = fm.group(1).lower()
            cur[field] = fm.group(2).strip()
            continue
        if field and ln.startswith('  ') and ln.strip():
            cur[field] = (cur[field] + ' ' + ln.strip()).strip()
        elif not ln.strip():
            field = None
    close(cur)

    for f in findings:
        # PORT carries the verdict, optionally with a dash and a shout after it
        v = f['port'].split('—')[0].split('--')[0].strip().upper()
        # "ADAPT, AND THERE IS A HARD LIMIT" is a legal PORT line: the verdict is
        # the first WORD, and the shout after it is the finding talking. Strip the
        # punctuation or a comma silently invalidates a real finding.
        v = re.sub(r'[^A-Z]', '', v.split()[0]) if v else ''
        f['verdict'] = v if v in VERDICTS else ''
        if not f['verdict']:
            errs.append('%s: PORT does not start with %s (got %r)'
                        % (f['id'], '/'.join(VERDICTS), f['port'][:40]))
        # SCREEN is allowed to be one short word ("battle"), the prose fields
        # are not. A first cut held them all to 12 characters and rejected the
        # single most correct answer a SCREEN field can have.
        for req, floor in (('lens', 12), ('screen', 3), ('what', 30),
                           ('why', 30), ('because', 20)):
            if len(f[req]) < floor:
                errs.append('%s: %s is missing or too short (%d chars, wants %d)'
                            % (f['id'], req.upper(), len(f[req]), floor))

    return {'file': os.path.basename(path), 'title': title or game,
            'declared': declared}, findings, errs


def main():
    files = sorted(glob.glob(SRC_GLOB))
    if not files:
        print('no uibook rounds found at ' + SRC_GLOB); sys.exit(2)

    laws, rounds, all_errs = {}, [], []
    for p in files:
        meta, fs, errs = parse(p)
        all_errs += ['%s: %s' % (meta['file'], e) for e in errs]
        got = {'findings': len(fs)}
        for k in ('look', 'read', 'do', 'world'):
            got[k] = sum(1 for f in fs if f['kind'] == k)
        for k in ('take', 'adapt', 'refuse'):
            got[k] = sum(1 for f in fs if f['verdict'] == k.upper())
        # THE ROUND MUST COUNT ITSELF HONESTLY. A corpus whose own header
        # disagrees with the corpus is the class of rot the truth hierarchy
        # exists to kill (CLAUDE.md), so the mismatch is an ERROR, not a note.
        for k, want in (meta['declared'] or {}).items():
            if got.get(k) != want:
                all_errs.append('%s: header declares %s:%d, corpus holds %d'
                                % (meta['file'], k, want, got.get(k)))
        for f in fs:
            if f['id'] in laws:
                all_errs.append('DUPLICATE ID %s' % f['id'])
            laws[f['id']] = f
        rounds.append({'file': meta['file'], 'title': meta['title'],
                       'game': fs[0]['game'] if fs else '?', 'counts': got})

    out = {
        '_meta': {
            'what': 'Machine-readable index over the BOHEMIA UIBOOK: every game '
                    'studied for its interface, one round per file. Every citable '
                    'id resolves to a real finding with a lens and a port verdict. '
                    'Generated by tools/bohemia_uibook_index.py; never hand-edited.',
            'why': 'THE UI STUDY LAW (8/26/26). A study whose findings cannot be '
                   'cited is an essay, and an essay changes nothing. This is the '
                   'questbook machine pointed at interfaces.',
            'rounds': rounds,
            'total': len(laws),
        },
        'laws': laws,
    }
    os.makedirs('records', exist_ok=True)
    with open(OUT_JSON, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=1, sort_keys=True, ensure_ascii=False)

    with open(OUT_MD, 'w', encoding='utf-8') as fh:
        fh.write('# BOHEMIA UIBOOK — LAW INDEX\n')
        fh.write('Generated by tools/bohemia_uibook_index.py. Never hand-edited.\n\n')
        for r in rounds:
            c = r['counts']
            fh.write('## %s\n' % r['title'])
            fh.write('%d findings — look %d · read %d · do %d · world %d — '
                     'TAKE %d · ADAPT %d · REFUSE %d\n\n'
                     % (c['findings'], c['look'], c['read'], c['do'], c['world'],
                        c['take'], c['adapt'], c['refuse']))
        fh.write('\n| id | master | verdict | title |\n|---|---|---|---|\n')
        for k in sorted(laws):
            f = laws[k]
            fh.write('| `%s` | %s | **%s** | %s |\n'
                     % (k, f['kind'], f['verdict'], f['title']))

    print('UIBOOK INDEX')
    for r in rounds:
        c = r['counts']
        print('  %-46s %2d findings  (L%d R%d D%d W%d)  TAKE %d ADAPT %d REFUSE %d'
              % (r['file'], c['findings'], c['look'], c['read'], c['do'], c['world'],
                 c['take'], c['adapt'], c['refuse']))
    print('  %d citable findings -> %s' % (len(laws), OUT_JSON))
    if all_errs:
        print('\n  %d PROBLEM(S):' % len(all_errs))
        for e in all_errs:
            print('    ' + e)
        sys.exit(1)


if __name__ == '__main__':
    main()
