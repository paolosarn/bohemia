#!/usr/bin/env python3
"""THE PIECE THAT ANSWERS IT (WORLD THIRTEEN 11/11, VAMILY rule 429(a)(b)(c), 430; ask lines 504, 505, 506).

The coordinator 11/11: 'the fight-answer table finished: every building kind on the map names the board piece that answers it'.
records/target/bb/map_fight_kinds.json said what a kind IS in a fight (storeys, in or on the roof, cover, what blocks); it did not
say WHICH PIECE OF THE FIGHT'S KIT stands for it. The fight picks those pieces from three other tables and its cut code, none of
them this one. This tool writes, into every row of the one table, the piece that answers it, read off what the fight does today
(so nothing the fight deals changes), and says plainly where the kit has nothing of its own (a stand-in, and what is wanted):

  piece.deal  (every map kind: the board the fight deals for a cell of it, from fight_ground.json's blocks)
     kind      the board kind asked for       records/target/BOHEMIA_BOARD_KINDS.json districts[].boardKind (the beltway: the freeway's)
     ground    its ground                     the same row's ground
     families  the block families it deals    records/target/bb/ours.json board_grounds.districts[kind] or .grounds[ground]
               (the first leads, on half the slots: board_grounds.lead_share)
     place     the place board, where one is   ours.json place_boards: place_<name> (built) whose districts hold it; its landmark_block
               family 'landmark' (fight_ground.json boards.place_<name>)
     stand_in  true where the fight has no block of the kind's own (BOARD_KINDS isCatchAll: the civic interior, the apron, the
               compound are owed, BOARD_KINDS familiesWithNoBlock)
  piece.cut   (every row: what the board cut from the map lays for it, slices/bohemia_street_board.js plan() and lay())
     tiles     the cut's tile kinds for its painter class (plan(): road, walk, freeway, yard, slab, building, lot, tower, podium,
               plaza, park, park_trees, water, dirt, rough, cliff, rail, solar, apron, ruin)
     pieces    the kit pieces laid there (street_board.json houses / buildings / ground / streets, kit_cover)
     stand_in  true where the kit has no piece of its own for it, with 'wants'

Run it after any change to those tables; the gate (gates/the_map_kinds_have_fight_answers_gate.js F15 to F18) re-derives every
piece and goes red on any row that disagrees, any name the kit does not have, any kind without a piece.

  python3 tools/bohemia_world_thirteen_pieces.py          write the pieces into the table (then run the fight kinds sync)
  python3 tools/bohemia_world_thirteen_pieces.py --check  exit 1 if it would change anything
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
TABLE = P('records/target/bb/map_fight_kinds.json')

def load(p):
    with open(p, encoding='utf8') as f: return json.load(f)

def sources():
    fg = load(P('slices/fight_ground/fight_ground.json'))
    lib = set(k.split('.')[0] for k in fg['blocks'])
    for b in fg['boards'].values():
        for row in b['blocks']:
            for n in row: lib.add(n.split('|')[0].split('.')[0])
    bk = load(P('records/target/BOHEMIA_BOARD_KINDS.json'))
    ours = load(P('records/target/bb/ours.json'))
    sb = load(P('slices/fight_ground/street_board/street_board.json'))
    cov = sorted(f[6:-5] for f in os.listdir(P('slices/fight_ground/kit_cover')) if f.startswith('cover_') and f.endswith('.webp'))
    src = open(P('slices/bohemia_street_board.js'), encoding='utf8').read()
    m = re.search(r"var BUILDING_BY = (\{[^;]*\});", src)
    by = json.loads(re.sub(r"(\w+):", r'"\1":', m.group(1)).replace("'", '"'))
    page = open(P('slices/BOHEMIA_CITY_WORLD.html'), encoding='utf8').read()
    sub = {}
    for name, rx in re.findall(r"if \(/\^\(([a-z|]+)\)\$/\.test\(d\)\) return VB_SUB\.(\w+);", page[page.index('function vbSubOf(d){'):][:900]):
        for d in name.split('|'): sub[d] = rx
    for d in ('estate', 'gated', 'trailer', 'apartment'): sub[d] = d
    return dict(fg=fg, lib=lib, boards=set(fg['boards']), bk=bk, ours=ours, sb=sb, cover=cov, by=by, sub=sub)

# ---- the deal: what the fight deals for a cell of a map kind -------------------------------------------------------------
def deal(d, S):
    BK = {r['district']: r for r in S['bk']['districts']}
    bg = S['ours']['board_grounds']['value']
    pl = S['ours']['place_boards']['value']['places']
    r = BK.get(d)
    if r is None and d == 'beltway': r = {'boardKind': 'freeway', 'ground': 'freeway', 'isCatchAll': False}   # the fight's freeway board takes it (FB.isFreeway)
    if r is None: return None
    fam = bg['districts'].get(d) or bg['grounds'].get(r['ground']) or []
    place = next((k for k, v in pl.items() if v.get('built') and d in v.get('districts', [])), None)   # placeOwn: a built place only
    out = {'kind': r['boardKind'], 'ground': r['ground'], 'families': list(fam), 'lead': fam[0] if fam else None,
           'place': ('place_' + place) if place else None}
    if place:   # dealOwn: the place's landmark block on its row and column, its field blocks round it (ours.json place_boards)
        P = pl[place]
        out['landmark'] = P['landmark_block']
        fl = list(P.get('field', [])) + [b for v in (P.get('cols') or {}).values() for b in v] + [b for v in (P.get('rows') or {}).values() for b in v]
        out['field'] = sorted(set(b.split('|')[0] for b in fl))
    out['stand_in'] = bool(r.get('isCatchAll'))
    if r.get('isCatchAll'):
        owed = next((w for w in S['bk'].get('familiesWithNoBlock', []) if d in w.get('districts', [])), None)
        if owed: out['wants'] = owed['wantsABlock']
    return out

# ---- the cut: what the board cut from the map lays for it ------------------------------------------------------------------
HOUSES = ['ranch_plain', 'ranch_porch', 'ranch_wing', 'ranch_garage', 'ranch_carport']
TILES = {   # plan(): the painter class's tile kinds; lay(): the ground under them
    'road': (['road', 'walk'], ['streets:*']), 'blvd': (['road', 'walk'], ['streets:*']), 'freeway': (['freeway'], ['streets:*', 'cover:jersey']),
    'green': (['park', 'park_trees'], ['ground:dirt']), 'water': (['water'], ['ground:water']), 'land': (['dirt', 'rough'], ['ground:dirt']),
    'mountain': (['rough', 'cliff'], ['ground:dirt', 'ground:rubble']), 'rail': (['rail'], ['ground:rubble']), 'solar': (['solar'], ['ground:dirt']),
    'field': (['apron'], ['ground:apron']), 'dam': (['apron'], ['ground:apron']),
}
def cut_district(d, row, S):
    cl, by, sub = row.get('class'), S['by'], S['sub'].get(d)
    if cl in TILES: t, p = TILES[cl]; return {'tiles': t, 'pieces': list(p)}
    if cl == 'houses':
        if sub == 'trailer': return {'tiles': ['yard'], 'pieces': ['cover:trailer', 'ground:dirt']}
        if sub == 'apartment': return {'tiles': ['slab', 'yard'], 'pieces': ['building:' + n for n in by['town']] + ['ground:apron'],
                                       'stand_in': True, 'wants': 'a garden apartment slab of two or three storeys (the cut stands the town\'s motel, pawn shop or chapel in its place)'}
        if d == 'town': return {'tiles': ['building', 'yard'], 'pieces': ['building:' + n for n in by['town']]}
        return {'tiles': ['yard'], 'pieces': ['house:' + h for h in HOUSES] + ['ground:dirt']}
    if cl == 'town': return {'tiles': ['building', 'yard'], 'pieces': ['building:' + n for n in by['town']]}
    if cl in ('tower', 'casino'):
        fam = 'tower' if cl == 'tower' else 'casino'
        out = {'tiles': ['tower', 'podium', 'plaza'], 'pieces': ['building:' + n for n in by[fam]] + ['ground:plaza', 'ground:apron']}
        if cl == 'tower': out.update(stand_in=True, wants='a tower the fight can live beside (the cut stands the rig\'s casino or school, street_board.js says WEAK)')
        return out
    if cl == 'roof':
        fam = 'shop' if sub == 'shop' else 'works' if sub == 'works' else 'civic'
        out = {'tiles': ['building', 'lot', 'yard'], 'pieces': ['building:' + n for n in by[fam]] + ['ground:apron']}
        if row.get('building') in ('tank', 'silo', 'compound', 'shed') or (fam == 'civic' and row.get('building') not in ('civic',)):
            out.update(stand_in=True, wants='a ' + row.get('building', 'building') + ' of its own (the cut stands the ' + fam + ' pieces)')
        return out
    return {'tiles': ['lot'], 'pieces': ['ground:apron'], 'stand_in': True, 'wants': 'its class ' + str(cl) + ' has no cut of its own'}

# a building type of the town, the home lot or a model: the kit piece the cut lays for it
BUILD = {
    'house': (['house:' + h for h in HOUSES], None), 'trailer': (['cover:trailer'], None),
    'shop': (['building:pawn_shop', 'building:gas_station', 'building:motel'], None),
    'civic': (['building:school', 'building:church', 'building:chapel'], None), 'casino': (['building:casino'], None),
    'tower': (['building:casino', 'building:school'], 'a tower the fight can live beside'), 'works': (['building:warehouse'], None),
    'hangar': (['building:warehouse'], 'a hangar of its own'), 'shed': (['cover:shed'], None),
    'hall': (['building:school'], 'a hall of its own'), 'stage': (['ground:plaza', 'cover:pallet'], 'a stage'),
    'shack': (['building:pawn_shop'], 'a shack of scrap'), 'tent': (['cover:pallet', 'cover:sandbags'], 'a tent'),
    'container': (['cover:barricade'], 'a shipping container a man stands on'), 'heap': (['cover:rubble_0', 'cover:tyres'], 'a scrap heap a man climbs'),
    'post': (['cover:sandbags', 'cover:pole'], 'a watch post on legs'), 'tank': (['cover:barrel'], 'a water or fuel tank a man stands on'),
    'wall': (['cover:wall', 'cover:wall_corner', 'streets:walk_wallfoot'], None),
}
OPEN = {'yard': 'ground:dirt', 'garden': 'ground:dirt', 'garden_bed': 'ground:dirt', 'plaza': 'ground:plaza', 'lot': 'ground:apron',
        'main': 'ground:plaza', 'purifier': 'ground:plaza', 'solar_panel': 'ground:dirt'}
def cut_thing(key, row):
    b = row.get('building')
    if b in (None, 'none') or row.get('man') == 'open':
        return {'tiles': ['yard'], 'pieces': [OPEN.get(key, 'ground:dirt')]}
    pieces, wants = BUILD.get(b, (['ground:apron'], 'a ' + str(b) + ' of its own'))
    out = {'tiles': ['building'], 'pieces': list(pieces)}
    if key.startswith('ranch_') and b == 'house': out['pieces'] = ['house:' + key]
    if wants: out.update(stand_in=True, wants=wants)
    return out

# the region's real places that stand outside the valley (no map kind): the map kind whose board the fight deals there
OUTSIDE = {'the_lab': 'medical', 'lenzie_station': 'powerplant', 'spring_mountain_ranch': 'farm', 'callville_bay': 'water'}

def pieces(J, S):
    for d, row in J['districts'].items():
        p = {'deal': deal(d, S), 'cut': cut_district(d, row, S)}
        row['piece'] = p
    for ns in ('lots', 'marks', 'works'):
        for k, row in J['town'][ns].items(): row['piece'] = {'deal': 'town', 'cut': cut_thing(k, row)}
    for k, row in J['home']['pieces'].items(): row['piece'] = {'deal': 'town', 'cut': cut_thing(k, row)}
    for k, row in J['models']['houses'].items(): row['piece'] = {'cut': cut_thing(k, row)}
    rows = J.get('places', {}).get('rows', {})
    for k, row in (rows.items() if isinstance(rows, dict) else []):
        kind = row.get('kind') or OUTSIDE.get(k)
        if kind in J['districts']: row['piece'] = {'deal': kind, 'cut': cut_thing(k, row)}
        if not row.get('kind') and k in OUTSIDE: row['piece']['outside'] = 'out on the region, no map kind of its own: the fight deals ' + kind + "'s board"
    J['fields']['piece'] = ("WORLD THIRTEEN 11/11 (tools/bohemia_world_thirteen_pieces.py writes it, never by hand): the piece of the fight's kit "
        "that answers the kind. deal: the board dealt for a cell of it (kind, ground, the block families of fight_ground.json it deals, the "
        "lead, the place board place_<name> with its landmark block and field blocks where a built place stands there: the fight deals that first), cut: what the board cut from the map lays "
        "(the tile kinds and the kit pieces: house:<model>, building:<name>, ground:<name>, streets:<piece> of street_board.json (streets:* "
        "any of them), cover:<name> of fight_ground.json's cover and cover_extra or kit_cover). stand_in true where the kit has nothing of the kind's own yet, with what is wanted. A town's and a home's piece deals "
        "the town district's board ('town'); a real place's deals its map kind's.")
    return J

def main():
    S = sources()
    s = open(TABLE, encoding='utf8').read()
    J = pieces(json.loads(s), S)
    out = json.dumps(J, indent=1, ensure_ascii=False) + ('\n' if s.endswith('\n') else '')
    if '--check' in sys.argv:
        print('in step' if out == s else 'OUT OF STEP'); sys.exit(0 if out == s else 1)
    if out != s:
        with open(TABLE, 'w', encoding='utf8') as f: f.write(out)
    n = len(J['districts']); si = sum(1 for r in J['districts'].values() if r['piece']['deal'] and r['piece']['deal'].get('stand_in'))
    print(('written' if out != s else 'already in step') + ': ' + str(n) + ' map kinds, ' + str(si) + ' dealt from a stand-in board')

if __name__ == '__main__':
    main()
