#!/usr/bin/env python3
"""
BOHEMIA CANON INDEX (7/16/26)

The question that forced this tool (Paolo, 7/16): "an addendum slapped on top
of another addendum — will it know? will it be smart or what?"

Honest answer: nothing knows. Not project storage, not GitHub, not a fresh
session reading 150 files. The 7/16 graveyard sweep proved it: the LAWS MASTER
itself was instructing a palette Paolo killed six days earlier. Currency of
information is not a property a pile of files has. It has to be BUILT.

This tool builds it. It scans every BOHEMIA_ADDENDUM_*, GDD, and law file,
extracts topic + date from the canon filename format, and emits ONE map:

  - every topic, its addenda NEWEST FIRST (newest wins on conflict — LAW)
  - domain clusters (LIGHT, STREET, COMBAT, ...) so a session working on lamps
    sees every lighting ruling in date order in one glance
  - multi-version topics flagged as SUPERSESSION CHAINS (the danger zones —
    where an old ruling can masquerade as current)

Every session consults the index BEFORE citing an addendum as current.
Regenerated whenever an addendum lands. This is CLAUDE.md's TRUTH HIERARCHY
made mechanical.

  python3 bohemia_canon_index.py [dirs...]   -> BOHEMIA_CANON_INDEX_<date>.md
"""
import os, re, sys, time, collections

DATE_RX = re.compile(r'_(\d{1,2})_(\d{1,2})_(\d{2})(?:__\d+_)?\.(md|txt|js)$')
DOMAINS = {
    'LIGHT & POWER': ['LIGHT', 'LAMP', 'POWER', 'STREETLIGHT', 'GLOW', 'EMITTER'],
    'STREETS & BLOCKS': ['STREET', 'BLOCK', 'LANE', 'PARKING', 'SIDEWALK',
                         'CROSSWALK', 'TURN', 'VEGAS_GEOGRAPHY', 'NEIGHBORHOOD'],
    'PLOTS & DISTRICTS': ['PLOT', 'SUBURB', 'DISTRICT', 'CELL_IS_PLOT', 'WALLED'],
    'ANIMATION': ['ANIM', 'RAGDOLL', 'PIXEL_LAW', 'FLICKER', 'DOOR'],
    'RIG & CHARACTER': ['RIG', 'CHARACTER', 'FACE', 'GARMENT', 'SKIN', 'ANATOMY',
                        'MICRO_EXPRESS', 'REVEAL'],
    'COMBAT': ['COMBAT', 'DIAL', 'TURNBASED', 'DNA_RF4'],
    'TILES & ART': ['TILE', 'SEAM', 'VARIANT', 'TEXTURE', 'PACK', 'PREFAB',
                    'GRAPHICS', 'ART', 'PURITY', 'TAN'],
    'WORLD MODEL & TIME': ['WORLD_MODEL', 'TIME_MODEL', 'CAMERA', 'TIMESTEP',
                           'FOLD', 'LOD', '120', 'HEARTBEAT', 'SCALE', 'VALLEY',
                           'GRID_UNIT', 'OVERMAP'],
    'CITYBUILDER & SURVIVAL': ['CITYBUILDER', 'SURVIVAL', 'LOGISTICS', 'FOOD',
                               'DEATH_MATH', 'LIFE_SUPPORT', 'INFRA'],
    'QUESTS & LORE': ['QUEST', 'LORE', 'AMALGAMATION', 'PACIFIST', 'DIALOGUE',
                      'SUCCESSION', 'MAYOR', 'GENERATIONAL', 'RECORDED', 'BUNKER'],
    'MUSIC & SFX': ['MUSIC', 'VOICES', 'SFX', 'HORROR_LAW'],
    'PROCESS & LAWS': ['FACTORY', 'VERDICT', 'NEVER_LOSE', 'FILE', 'PACKAGE',
                       'MASTER_DOWNLOAD', 'INTAKE', 'GATE', 'WHITELIST',
                       'PRODUCTION', 'PIPELINE', 'CARRY', 'WORKFLOW'],
}

def scan(dirs):
    seen, rows = set(), []
    for d in dirs:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if not (fn.startswith('BOHEMIA_') and ('ADDENDUM' in fn or 'GDD' in fn
                    or 'LAWS' in fn or 'STATE_OF_PLAY' in fn or 'CANON' in fn)):
                continue
            if fn in seen:
                continue
            seen.add(fn)
            m = DATE_RX.search(fn)
            date = (int('20' + m.group(3)), int(m.group(1)), int(m.group(2))) if m else (0, 0, 0)
            topic = fn.replace('BOHEMIA_ADDENDUM_', '').replace('BOHEMIA_', '')
            topic = DATE_RX.sub('', topic).rstrip('_').replace('.md', '')
            rows.append({'file': fn, 'topic': topic, 'date': date, 'dir': d})
    return rows

def main():
    # REPO-ERA FIX (7/16 merge): the chat-era default scanned three folders that
    # do not exist in a repo, so a bare run indexed NOTHING and still wrote a file.
    # One home now: the repo. Default is the script's own directory.
    # 7/17/26 repo layout: addenda + GDDs + laws masters live in laws/, the
    # index and spine docs at repo root, the registry in gates/.
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
    dirs = sys.argv[1:] or [root, os.path.join(root, 'laws')]
    rows = scan(dirs)
    out = ['# BOHEMIA CANON INDEX — regenerated ' + time.strftime('%m/%d/%y'),
           '', '**LAW: on any conflict between addenda, the NEWEST date wins.**',
           'This index is the map. Consult it BEFORE citing an addendum as current.',
           'A contradiction between two files is a BUG: file it, gate it if mechanical,',
           'flag it [PENDING Paolo] if canon-level.',
           '', '%d canon files indexed across %d locations.' % (len(rows), len(dirs)), '']

    # THE GDD LINEAGE, PINNED AT THE TOP (7/16 merge).
    # The GDDs carry no date stamp, so DATE_RX gave them (0,0,0) and they sorted
    # to the BOTTOM as bare filenames: the lore foundation ranked below every
    # addendum, with no note that all four are live. That is how "v2 is
    # superseded" survived two registries unchallenged — THE MAP NEVER SHOWED IT.
    # The top of the truth hierarchy now sits at the top of its own map.
    out += ['## THE GDD LINEAGE — ALL FOUR ARE LIVE (gated: node gdd_gate.js)', '',
            'v5 EXTENDS v2/v3/v4. It does NOT replace them, and says so in its own',
            'opening line. Each is the SOLE home of load-bearing canon. Never archive one.',
            '',
            '  - `BOHEMIA_GDD_v2.md` — LORE FOUNDATION. Sole home of: the three-dynasty',
            '    ~100-year arc, data portraits (the Amalgamation\'s origin), Project Angel,',
            '    The Crypto Collapse, The Mars and Moon Factor, Neuralink, Dubai The Warning',
            '    City, The Fifth Dimensional Element, The Network\'s true structure.',
            '  - `BOHEMIA_GDD_v3.md` — DIAL CORE + THE ENDGAME. Sole home of: the 52 patterns,',
            '    the five difficulty packages, the killshot moment, The Nuke and the last',
            '    moral choice, The Three-Generation Device, Bohemia Is the Only Free City.',
            '  - `BOHEMIA_GDD_v4.md` — TIME / PERSISTENCE / THE FOLD. Sole home of: the fold,',
            '    succession, the character stack, Bunkerguy, engine laws through 7/2.',
            '  - `BOHEMIA_GDD_v5.md` — 7/3-7/6 systems: valley scale, the overmap, the',
            '    survival economy, the 120 BPM Request Law, vehicles, the Factory Law.',
            '']

    # supersession chains: same topic, multiple dates — the danger zones
    by_topic = collections.defaultdict(list)
    for r in rows:
        by_topic[r['topic']].append(r)
    chains = {t: sorted(v, key=lambda r: r['date'], reverse=True)
              for t, v in by_topic.items() if len(v) > 1}

    # SUFFIX CHAINS (fixed 7/16 merge): exact-topic matching found ZERO chains on
    # a corpus that is full of them, because Bohemia's real pattern is a SUFFIXED
    # follow-up: SIDEWALK_SANCTITY (7/14) -> SIDEWALK_SANCTITY_ENFORCED (7/16).
    # Those are the SAME SUBJECT and the older one is exactly the kind of file
    # that masquerades as current. Exact matching treated them as unrelated, so
    # the tool built to catch stale rulings was blind to the commonest case.
    # Now: if topic A is a strict prefix of topic B at a word boundary, they chain.
    SUFFIXES = ('_ENFORCED', '_RESOLVED', '_RESOLVER', '_V2', '_v2', '_GATE',
                '_CORRECTION', '_LAW', '_AND_INTAKE', '_REBUILD', '_PIPELINE')
    topics = sorted(by_topic)
    for a in topics:
        for b in topics:
            if a == b or not b.startswith(a + '_'):
                continue
            if not any(b[len(a):].startswith(sfx) for sfx in SUFFIXES):
                continue
            merged = sorted(by_topic[a] + by_topic[b],
                            key=lambda r: r['date'], reverse=True)
            chains[a + '  (+ ' + b[len(a) + 1:] + ')'] = merged
            chains.pop(a, None)
            chains.pop(b, None)
    # DECLARED chains: the superseded registry knows subject-level supersession
    # that filenames cannot reveal (different names, same subject).
    # repo-relative (7/16 merge): the hardcoded chat path meant DECLARED chains
    # never loaded at all — the registry was invisible to its own index.
    reg = os.path.join(dirs[0], 'gates', 'bohemia_superseded.txt')
    declared = []
    if os.path.exists(reg):
        for line in open(reg, encoding='utf-8'):
            line = line.strip()
            if line and not line.startswith('#') and '|' in line:
                old, why = [x.strip() for x in line.split('|', 1)]
                declared.append((old, why))
    if chains or declared:
        out += ['## SUPERSESSION CHAINS — where a stale ruling can masquerade as current', '']
        if declared:
            out.append('**Declared in bohemia_superseded.txt (subject-level, filenames alone cannot see these):**')
            for old, why in declared:
                out.append('  - `%s` -> %s' % (old, why))
            out.append('')
        for t in sorted(chains):
            out.append('**%s**' % t)
            for i, r in enumerate(chains[t]):
                tag = 'CURRENT' if i == 0 else 'superseded'
                out.append('  - `%s`  <- %s' % (r['file'], tag))
            out.append('')

    out += ['## BY DOMAIN — newest first inside each', '']
    used = set()
    for dom, keys in DOMAINS.items():
        hits = [r for r in rows if any(k in r['topic'].upper() for k in keys)]
        hits.sort(key=lambda r: r['date'], reverse=True)
        if not hits:
            continue
        out.append('### %s (%d)' % (dom, len(hits)))
        for r in hits:
            used.add(r['file'])
            out.append('- `%s`' % r['file'])
        out.append('')
    rest = sorted((r for r in rows if r['file'] not in used),
                  key=lambda r: r['date'], reverse=True)
    if rest:
        out.append('### UNCLASSIFIED (%d) — add keywords to DOMAINS' % len(rest))
        out += ['- `%s`' % r['file'] for r in rest] + ['']

    # ONE MAP (7/16 merge): the old date-stamped name spawned a NEW index every
    # run. Three of them existed at the merge: three maps, one territory, and a
    # session could cite any of them. The map has ONE name. Git holds the history.
    dest = os.path.join(dirs[0], 'BOHEMIA_CANON_INDEX.md')
    open(dest, 'w', encoding='utf-8').write('\n'.join(out))
    print('canon index: %d files, %d supersession chains -> %s'
          % (len(rows), len(chains), dest))
    for t in sorted(chains):
        print('  CHAIN %-40s %d versions, current = %s'
              % (t, len(chains[t]), chains[t][0]['file']))

if __name__ == '__main__':
    main()
