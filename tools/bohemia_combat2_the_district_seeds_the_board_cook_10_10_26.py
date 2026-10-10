#!/usr/bin/env python3
"""THE DISTRICT SEEDS THE BOARD: NO TWO DISTRICTS OPEN THE SAME FIGHT  (COMBAT 2, [the district seeds the board])

WORLD 10/9 (bf86c941): 24 of the 78 districts open the same fight, because the handover carries only the block's KIND
(nfKind) and every district of a kind is dealt from the same pool; the airport, city hall, the jail and three of the
legendary gear places all read as the one ruin. Rule 46: no two combat boards are the same.

So every district in records/target/BOHEMIA_BOARD_KINDS.json gets ITS OWN board inside its kind: the kind's blocks laid
by rule 77's join rule (L.solve), seeded by the district's name, re-seeded until its layout is unlike every other
district's. Nothing is drawn: every block is a shipped block, every seam joins.

  fight_ground.json districts[name] = {kind, blocks: [[...4...] x 3]}     (the fight's blockLibrary composes the
                                       terrain, cover and lights from the blocks, as it does for every board)

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every district of the file has a board; every board has zero broken
seams; no two boards share a tile hash (the block ids in order).

THE ANALOG HORROR LINE (rule 20): every place is its own place, even in ruin: the courthouse and the jail are two
different dead blocks, never the same one twice.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: a district's board reads as its kind at a glance.
  TG-04 THE STREET TILE: the same joined streets in every district (rule 77, LEG 5).
  AH-01 THE BIBLE: one register; nothing new is drawn.
  REUSE CHECK: every block is a shipped block of slices/fight_ground; the picker is L.solve.

[bb the battle map] Battle Brothers' battlefield is generated from the tile the fight starts on (its terrain and the
  location), so two fights on two tiles differ. OURS: the district's name is the seed.

    python3 tools/bohemia_combat2_the_district_seeds_the_board_cook_10_10_26.py
"""
import importlib, json, os, random, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
os.chdir(REPO)
L = importlib.import_module('bohemia_combat2_tiles_are_legos_cook_10_5_26')
MAN = 'slices/fight_ground/fight_ground.json'
KINDS = 'records/target/BOHEMIA_BOARD_KINDS.json'


def die(msg): sys.exit('REFUSED: ' + msg)


def palettes(have):
    pick = lambda *pre: [b for b in have if b.split('.')[0] in pre]
    houses = pick('subs', 'corner', 'lots')
    town = houses + pick('main', 'works')
    desert = pick('scrub')
    return {
        'ruin': [pick('ruin', 'lots', 'subs'), pick('ruin', 'subs', 'corner'), pick('ruin', 'lots', 'subs')],
        'strip': [pick('strip'), town, town],
        'suburb': [houses, houses, houses],
        'culdesac': [pick('culdesac'), pick('suburb_stem'), houses + pick('main')],
        'suburb_stem': [pick('culdesac'), pick('suburb_stem'), houses],
        'landfill': [pick('landfill'), pick('landfill', 'scrub'), pick('landfill', 'scrub')],
        'freeway': [houses, pick('freeway', 'freewayo'), desert + pick('scrubroad')],
        'scrub': [desert, desert, desert],
        'wash': [desert, desert, desert],
        'shore': [pick('shore'), desert, desert],
    }


def desert_with_washes(base, washes, rng):
    """The desert's washes run a whole column (rule 77's reader cannot see a wash): chosen columns are wash, top to bottom."""
    cols = rng.sample(range(4), rng.choice([1, 2]))
    lay = [list(r) for r in base]
    for c in cols:
        for r in range(len(lay)):
            if r == 0 and lay[r][c].startswith('shore'): continue
            lay[r][c] = washes[(r + c) % len(washes)]
    return lay


def main():
    m = json.load(open(MAN))
    have = sorted(m['blocks'])
    edges = L.read_all(m)
    pal = palettes(have)
    washes = [b for b in have if b.startswith('wash')]
    seen, out = set(), {}
    for d in json.load(open(KINDS))['districts']:
        name, kind = d['district'], d['boardKind']
        if kind not in pal: die('%s: no palette for kind %s' % (name, kind))
        lay = None
        for k in range(400):
            rng = random.Random('district-%s-%d' % (name, k))
            fixed = {(1, c): ('freewayo.0' if c % 2 else 'freeway.0') for c in range(4)} if kind == 'freeway' else None
            got = L.solve(pal[kind], edges, rng, fixed=fixed, twins=kind != 'freeway', tries=3000)
            if not got: continue
            if kind in ('scrub', 'wash', 'shore') and washes: got = desert_with_washes(got, washes, rng)
            if L.board_faults(got, edges): continue
            h = tuple(b for row in got for b in row)
            if h in seen: continue
            seen.add(h); lay = got; break
        if not lay: die('%s (%s): no joined board unlike the others in 400 seeds' % (name, kind))
        out[name] = dict(kind=kind, blocks=lay)
    m['districts'] = out
    m['districts_key'] = {'use': "the fight opens districts[the handover's district].blocks instead of dealing from the kind's pool",
                          'seed': 'the district name; re-seeded until no other district has the same layout', 'source': KINDS}
    json.dump(m, open(MAN, 'w'), indent=1)
    by = {}
    for v in out.values(): by[v['kind']] = by.get(v['kind'], 0) + 1
    print('ok: %d districts, %d distinct boards, by kind %s' % (len(out), len(seen), by))
    return out


if __name__ == '__main__':
    main()
