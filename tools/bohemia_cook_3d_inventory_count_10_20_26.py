#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D]: THE COUNT, RECOMPUTED FROM THE GAME'S OWN FILES (10/20/26).
Rule 123: 'the count going down in records/ is your proof'. A family's flat count is read here, never typed: a picture
counts as 3D only while the file the game draws still has the hash this lane's converter recorded when it swapped it in
(records/target/cook_floor_not_final/swapped.json, records/target/cook_cover_rig/swapped.json,
records/target/cook_settlement_rig/swapped.json), or, for the map, while the bank's hero carries the rig's mark and the
map copy the wire made from it. Writes the counts and a log line into records/target/cook_3d_inventory.json.

  python3 tools/bohemia_cook_3d_inventory_count_10_20_26.py [--note "what landed"]

REFERENCE CHECK (the 9/4 standing duty): nothing is drawn; it counts. No reference game.
REUSE CHECK (REUSE-FIRST): the converters' own ledgers and the board json.
TASTE CHECK: none needed, no pixel is made.
"""
import os, sys, json, hashlib, glob
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INV = os.path.join(R, 'records/target/cook_3d_inventory.json')


def sha(p):
    try: return hashlib.sha1(open(os.path.join(R, p), 'rb').read()).hexdigest()
    except OSError: return None


def ledger(p):
    p = os.path.join(R, p)
    return json.load(open(p)) if os.path.exists(p) else {}


def main(note=None):
    inv = json.load(open(INV))
    F = inv['families']
    man = json.load(open(os.path.join(R, 'slices/fight_ground/fight_ground.json')))
    fl = ledger('records/target/cook_floor_not_final/swapped.json')
    done = sorted(b for b in man['blocks'] if b in fl and sha(fl[b]['file']) == fl[b]['sha1'])
    F['fight_floor'].update(in_3d=done, flat=F['fight_floor']['total'] - len(done))
    cv = ledger('records/target/cook_cover_rig/swapped.json')
    ok = {k for k, v in cv.items() if sha(v['file']) == v.get('sha1')}
    cover = sorted(k for k in ok if not k.startswith('light_')); lights = sorted(k for k in ok if k.startswith('light_'))
    F['fight_cover'].update(in_3d=cover, flat=F['fight_cover']['total'] - len(cover))
    F['fight_lights'].update(in_3d=lights, flat=F['fight_lights']['total'] - len(lights))
    st = ledger('records/target/cook_settlement_rig/swapped.json')
    sd = sorted(k for k, v in st.items() if sha(v['file']) == v.get('sha1'))
    F['settlement_backdrops'].update(in_3d=sd, flat=F['settlement_backdrops']['total'] - len(sd))
    try:
        bank = json.load(open(os.path.join(R, 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt')))
        frm = {}
        page = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')).read()
        import re
        m = re.search(r'HERO_FROM\s*=\s*(\{[^;]*\})', page)
        frm = json.loads(m.group(1)) if m else {}
        md = sorted(h['district'] for h in bank['heroes'] if h.get('through_the_rig') and frm.get(h['district']) == hashlib.sha1(h['b64'].encode('ascii')).hexdigest()[:12])
    except Exception as e:
        md = []; print('  map count unread:', e)
    F['map_districts'].update(in_3d=md, flat=F['map_districts']['total'] - len(md))
    inv['total_flat'] = sum(f['flat'] for f in F.values())
    inv['log'].append(dict(at=note or 'recount', total_flat=inv['total_flat'], **{k: f['flat'] for k, f in F.items()}))
    json.dump(inv, open(INV, 'w'), indent=1)
    print('  total flat %d: ' % inv['total_flat'] + ', '.join('%s %d/%d' % (k, f['flat'], f['total']) for k, f in F.items()))


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[a.index('--note') + 1] if '--note' in a else None)
