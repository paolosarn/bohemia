#!/usr/bin/env python3
"""THE QUARTERMASTER'S COUNT -- COUNT THE STORES BEFORE ANYONE COOKS
(PLUMBER 10/17/26, VAMILY row [the quartermaster's count]; the coordinator's school round twelve,
rule 100c amended: records/BOHEMIA_COORDINATOR_SCHOOL_TWELFTH_ROUND_THE_QUARTERMASTERS_COUNT_10_11_26.md)

PAOLO 10/10 (82a): "the cars is an asset we downloaded; a lot of the original street tiles and
sidewalks we downloaded; LOOK AGAIN." COOK then measured (ab6da98f): 294 packs bought, 8,674 tiles,
210 packs no chat had ever opened, 35 burnt wrecks sitting in the APPROVED bank through eight rounds
of a lane repainting cars. The 7/27 shopping law said "check the index first" and had no machine.

THIS IS THE MACHINE. One command, reads everything he owns, prints one line per family:

    we own 600 pieces of road in 18 packs, 4 never opened

and writes the same numbers to records/target/BOHEMIA_QUARTERMASTERS_COUNT.json, which the gate
(gates/quartermasters_count_gate.js) reads. Every cook study page opens with its family's line
(copied from here, never typed from memory) and no art item registers without naming the pack
piece it started from, or the family whose count here is ZERO. A hole exists only when the count
says zero.

WHAT "OWN" MEANS: a tile in the four HD repo chunks (banks/BOHEMIA_HD_TILE_REPO_part1-4.txt), the
source of truth COOK's index was built from. The 1,927 approved tiles are a SUBSET and are counted
as such, never as the whole.

WHAT "OPENED" MEANS, mechanically, so nobody argues it: a pack is OPENED when something on main
has touched it by name:
    (a) a tile of it was judged UP in the 7/13 sweep (it is in reference/art_bank/CORPUS.json), or
    (b) its name appears in code (tools/, gates/, slices/, engine/: code that names a pack pulls
        its tiles) or in the VOTE registry's twins (records/target, "pack:<name>#<idx>"), or
    (c) its name appears in a page (records/, laws/, tickets/, skills/) that names at most 20
        packs. A page naming more than 20 is an INVENTORY (the whole-bank page names all 294, the
        four-holes page its 31 unopened, July's requirements matrix 84) and a list is nobody
        looking at a tile; the JSON names every page it set aside as an inventory.
Everything else is NEVER OPENED. The per-pack rows in the JSON say what opened each pack and
where, so the claim can be checked by hand, and a chat opens a pack by naming it in its page.
MEASURED 10/17 before the rule was written: 171 files name a pack; with every name counted as a
look, 0 packs are "never opened", because one page lists all 294. That is why the inventory rule
exists, and the 20 is read off the file table (the lists sit at 22 and above, the looks at 19
and below), not picked.

FAMILIES come from COOK's index (reference/art_bank_index/INDEX.json, [the whole bank], 10/13), the
one place a pack's family is decided. A pack the index does not know is reported under
"unsorted", loudly, never guessed into a family.

    python3 tools/bohemia_quartermasters_count.py                 print every family's line, write the JSON
    python3 tools/bohemia_quartermasters_count.py --family road   print one family's line (for a study page)
    python3 tools/bohemia_quartermasters_count.py --check         re-count and compare to the committed JSON (the gate)
    python3 tools/bohemia_quartermasters_count.py --packs prop    list a family's packs with their opened-by evidence

Free. Reads; never draws. About thirty seconds (one git grep over the tree is most of it).
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CHUNKS = ['banks/BOHEMIA_HD_TILE_REPO_part%d.txt' % i for i in (1, 2, 3, 4)]
INDEX = 'reference/art_bank_index/INDEX.json'
CORPUS = 'reference/art_bank/CORPUS.json'
OUT = 'records/target/BOHEMIA_QUARTERMASTERS_COUNT.json'
LINE_RE = re.compile(r'we own ([\d,]+) pieces? of ([a-z][a-z+ \-]*?) in (\d+) packs?, (\d+) never opened', re.I)

CODE_DIRS = ['tools', 'gates', 'slices', 'engine']
PAGE_DIRS = ['records', 'laws', 'tickets', 'skills']
INVENTORY_NAMES = 20
EXCLUDE = [':(exclude)archive', ':(exclude)records/archive', ':(exclude)**/node_modules/**',
           ':(exclude)records/target/BOHEMIA_QUARTERMASTERS_COUNT.json', ':(exclude)**/*_ARCHIVE.md',
           ':(exclude)banks']


def read_packs():
    packs = {}
    for c in CHUNKS:
        with open(c, encoding='utf8') as f:
            d = json.load(f)
        for name, tiles in d['packs'].items():
            if name in packs:
                sys.exit('two chunks carry the same pack name: %r' % name)
            packs[name] = {'tiles': len(tiles),
                           'sizes': sorted({'%dx%d' % (t.get('w', 0), t.get('h', 0)) for t in tiles})[:6]}
    return packs


def approved_per_pack():
    out = {}
    try:
        tiles = json.load(open(CORPUS, encoding='utf8'))['tiles']
    except Exception:
        return out
    for t in tiles.values():
        out[t['pack']] = out.get(t['pack'], 0) + 1
    return out


def families_from_index(packs):
    fam = {}
    try:
        idx = json.load(open(INDEX, encoding='utf8'))
        for name, e in idx.get('entries', {}).items():
            fam[name] = e.get('family') or 'unsorted'
    except Exception:
        pass
    for name in packs:
        fam.setdefault(name, 'unsorted')
    return fam


def cited_where(packs):
    """pack name -> files that name it, by the rule in the header. One git grep (fixed strings,
    every name) finds the files; then each file is read once and the ambiguous names ('1. Floor
    tiles' inside '1. Floor tiles (1)') are settled by a longest-first regex. Returns (hits,
    inventories)."""
    names = sorted(packs, key=len, reverse=True)
    with tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False, encoding='utf8') as tf:
        tf.write('\n'.join(names))
        tmp = tf.name
    try:
        out = subprocess.run(['git', 'grep', '-I', '-F', '-l', '-f', tmp, '--'] + CODE_DIRS + PAGE_DIRS + EXCLUDE,
                             capture_output=True, text=True, cwd=ROOT).stdout
    finally:
        os.unlink(tmp)
    files = [f for f in out.splitlines() if f]
    rx = re.compile('|'.join(re.escape(n) for n in names))
    hits = {n: [] for n in packs}
    inventories = []
    for p in files:
        try:
            txt = open(os.path.join(ROOT, p), encoding='utf8', errors='replace').read()
        except Exception:
            continue
        found = set(rx.findall(txt))
        is_page = p.split('/')[0] in PAGE_DIRS and not p.startswith('records/target/')
        if is_page and len(found) > INVENTORY_NAMES:
            inventories.append('%s (%d packs named)' % (p, len(found)))
            continue
        for n in found:
            if len(hits[n]) < 6:
                hits[n].append(p)
            elif hits[n][-1] != '...':
                hits[n].append('...')
    return hits, inventories


def line_for(fname, f):
    return 'we own %s pieces of %s in %d packs, %d never opened' % (
        '{:,}'.format(f['pieces']), fname, f['packs'], f['never_opened'])


def count():
    packs = read_packs()
    appr = approved_per_pack()
    fam = families_from_index(packs)
    cites, inventories = cited_where(packs)
    rows = {}
    for name, p in packs.items():
        a = appr.get(name, 0)
        c = cites.get(name, [])
        rows[name] = {'family': fam[name], 'tiles': p['tiles'], 'approved': a, 'sizes': p['sizes'],
                      'opened': bool(a or c),
                      'opened_by': (['approved (7/13 sweep): %d tiles' % a] if a else []) + c}
    families = {}
    for name, r in rows.items():
        f = families.setdefault(r['family'], {'pieces': 0, 'packs': 0, 'approved': 0, 'never_opened': 0,
                                               'never_opened_packs': []})
        f['pieces'] += r['tiles']
        f['packs'] += 1
        f['approved'] += r['approved']
        if not r['opened']:
            f['never_opened'] += 1
            f['never_opened_packs'].append(name)
    for fname, f in families.items():
        f['line'] = line_for(fname, f)
        f['never_opened_packs'].sort()
    total = {'pieces': sum(r['tiles'] for r in rows.values()), 'packs': len(rows),
             'approved': sum(r['approved'] for r in rows.values()),
             'never_opened': sum(1 for r in rows.values() if not r['opened'])}
    total['line'] = 'we own %s pieces in %d packs, %d never opened (%s approved in the 7/13 sweep)' % (
        '{:,}'.format(total['pieces']), total['packs'], total['never_opened'], '{:,}'.format(total['approved']))
    sha = ''
    try:
        sha = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], text=True).strip()
    except Exception:
        pass
    return {'what': "THE QUARTERMASTER'S COUNT: everything he owns, per family, and how much of it anybody has opened.",
            'line_shape': 'we own N pieces of <family> in M packs, K never opened',
            'read_from': CHUNKS + [INDEX, CORPUS],
            'counted_at': sha,
            'opened_means': ['(a) a tile of it is in the approved corpus (7/13 sweep)',
                             '(b) a tool, gate, slice or engine file names it (code that names a pack pulls its tiles), or a VOTE twin does',
                             '(c) a page names it and names at most %d packs (a page naming more is an inventory, not a look)' % INVENTORY_NAMES],
            'inventories_not_counted_as_looks': sorted(inventories),
            'total': total,
            'families': dict(sorted(families.items(), key=lambda kv: -kv[1]['pieces'])),
            'packs': dict(sorted(rows.items()))}


def same_numbers(a, b):
    """The numbers the gate holds: pieces and packs per family and in total. never_opened only
    falls as chats open packs, and a line that was true when written stays true; it is printed,
    not judged."""
    ka = {k: (v['pieces'], v['packs']) for k, v in a['families'].items()}
    kb = {k: (v['pieces'], v['packs']) for k, v in b['families'].items()}
    return ka == kb and (a['total']['pieces'], a['total']['packs']) == (b['total']['pieces'], b['total']['packs'])


def main(argv):
    if '--family' in argv:
        fam = argv[argv.index('--family') + 1].lower()
        c = count()
        f = c['families'].get(fam)
        if not f:
            print('we own 0 pieces of %s in 0 packs, 0 never opened  (no pack of this family in the store: a HOLE, the only kind that is real; families we own: %s)'
                  % (fam, ', '.join(c['families'])))
            return 0
        print(f['line'])
        return 0
    if '--packs' in argv:
        fam = argv[argv.index('--packs') + 1].lower()
        c = count()
        for name, r in c['packs'].items():
            if r['family'] == fam:
                print('%-45s %4d tiles  %4d approved  %s' % (name, r['tiles'], r['approved'],
                      'OPENED by ' + '; '.join(r['opened_by'][:3]) if r['opened'] else 'NEVER OPENED'))
        return 0
    c = count()
    if '--check' in argv:
        try:
            old = json.load(open(OUT, encoding='utf8'))
        except Exception as e:
            print('STALE: %s cannot be read (%s). Run: python3 tools/bohemia_quartermasters_count.py' % (OUT, e))
            return 1
        if not same_numbers(old, c):
            print('STALE: the committed count disagrees with the packs on disk. Run: python3 tools/bohemia_quartermasters_count.py')
            return 1
        print('CURRENT: %s (counted at %s)' % (old['total']['line'], old.get('counted_at', '?')))
        return 0
    print("THE QUARTERMASTER'S COUNT (everything in banks/BOHEMIA_HD_TILE_REPO_part1-4.txt)\n")
    for fname, f in c['families'].items():
        print('  ' + f['line'] + ('   <- %d approved' % f['approved'] if f['approved'] else '   <- none approved yet'))
    print('\n  ' + c['total']['line'])
    if c['inventories_not_counted_as_looks']:
        print('  pages set aside as inventories (a list is not a look): ' + '; '.join(c['inventories_not_counted_as_looks']))
    if '--dry' not in argv:
        with open(OUT, 'w', encoding='utf8') as fh:
            json.dump(c, fh, indent=1, ensure_ascii=False)
            fh.write('\n')
        print('\n  written: ' + OUT)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
