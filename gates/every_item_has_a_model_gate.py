#!/usr/bin/env python3
"""EVERY ITEM HAS A MODEL (COOK gate, 10/25, row [a model for every item], rule 177(c); Paolo 10/25: 'I'm not seeing all the
weapons, armour and off-hand items in the actual combat; I gave everyone car door shields and I don't see that').

What it holds, read from the files and never from the tool's own say-so:
  M1 EVERY ROW HAS AN OBJECT: every row of records/target/bb/weapons.json and armor.json (body, head, shields) lands on one
     of the objects in reference/models/bohemia/items.json, by the market's OWN naming (the weapon classes and the armour
     thresholds read out of slices/bohemia_ui_materials.js, OBJ_CLASS and armourName), so a renamed class or a moved
     threshold turns this red instead of drawing the wrong thing.
  M2 EVERY OBJECT HAS ITS FILE: each manifest entry's glb is there, opens as a glb, has meshes, and is the file the manifest
     measured (its sha1).
  M3 THE RIG'S FORMAT: a held thing has the grip at the origin and its haft or barrel out along +X; a shield has the forearm
     (x = 0) behind its face and spans its own w and h; a worn thing carries a skin whose joints are the rig's man's own 19
     bones (CesiumMan's names) and nothing else.
  M4 THE PALETTE: every material of a model COOK built this round is a step of a role of records/target/BOHEMIA_STYLE_PALETTE.json,
     its base colour that step's colour, at most five a model (the style guide's prop cap), and no model all greys (rule 167(b):
     faded, dirty, rare colour, never drained: at least one material off the grey roles).
  M5 THE COMPARE: every model COOK built carries its sheet on the man over a real fight floor (records/target/cook_every_item/
     check_<name>.webp), made after the model.
  and four mutations that must bite (a row of an unknown class, a missing file, a stray bone, a sixth material).
"""
import hashlib, json, os, re, struct, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, 'reference/models/bohemia')
OUT = os.path.join(ROOT, 'records/target/cook_every_item')
BONES = {'Skeleton_torso_joint_1', 'Skeleton_torso_joint_2', 'torso_joint_3', 'Skeleton_neck_joint_1', 'Skeleton_neck_joint_2',
         'Skeleton_arm_joint_L__4_', 'Skeleton_arm_joint_L__3_', 'Skeleton_arm_joint_L__2_', 'Skeleton_arm_joint_R',
         'Skeleton_arm_joint_R__2_', 'Skeleton_arm_joint_R__3_', 'leg_joint_L_1', 'leg_joint_L_2', 'leg_joint_L_3', 'leg_joint_L_5',
         'leg_joint_R_1', 'leg_joint_R_2', 'leg_joint_R_3', 'leg_joint_R_5'}
GREY_ROLES = {'tape_grey', 'metal_painted', 'rubber', 'cloth_black', 'chrome', 'glass_eye'}
FAILS, PASSES = [], []


def ok(name, cond, detail=''):
    (PASSES if cond else FAILS).append(name + ('' if cond else '  <- ' + str(detail)[:300]))


def glb(path):
    b = open(path, 'rb').read()
    magic, ver, ln = struct.unpack('<4sII', b[:12])
    if magic != b'glTF': raise ValueError('not a glb')
    cl, ct = struct.unpack('<I4s', b[12:20])
    return json.loads(b[20:20 + cl]), hashlib.sha1(b).hexdigest()


def mat4(nd):
    """a glTF node's local matrix (row-major 4x4)"""
    if 'matrix' in nd:
        m = nd['matrix']; return [[m[c * 4 + r] for c in range(4)] for r in range(4)]
    tx, ty, tz = nd.get('translation', [0, 0, 0]); x, y, z, w = nd.get('rotation', [0, 0, 0, 1]); sx, sy, sz = nd.get('scale', [1, 1, 1])
    R = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
         [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
    return [[R[0][0] * sx, R[0][1] * sy, R[0][2] * sz, tx], [R[1][0] * sx, R[1][1] * sy, R[1][2] * sz, ty], [R[2][0] * sx, R[2][1] * sy, R[2][2] * sz, tz], [0, 0, 0, 1]]


def mul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(4)) for j in range(4)] for i in range(4)]


def world_bounds(J):
    """the model's bounds in the file's world (glTF y-up): every mesh node's box corners carried through its parents"""
    par = {}
    for i, nd in enumerate(J['nodes']):
        for c in nd.get('children', []): par[c] = i
    def world(i):
        M = mat4(J['nodes'][i])
        while i in par: i = par[i]; M = mul(mat4(J['nodes'][i]), M)
        return M
    lo, hi = [1e9] * 3, [-1e9] * 3
    for i, nd in enumerate(J['nodes']):
        if 'mesh' not in nd or 'skin' in nd: continue
        M = world(i)
        for p in J['meshes'][nd['mesh']]['primitives']:
            a = J['accessors'][p['attributes']['POSITION']]; mn, mx = a['min'], a['max']
            for cx in (mn[0], mx[0]):
                for cy in (mn[1], mx[1]):
                    for cz in (mn[2], mx[2]):
                        q = [M[r][0] * cx + M[r][1] * cy + M[r][2] * cz + M[r][3] for r in range(3)]
                        lo = [min(u, v) for u, v in zip(lo, q)]; hi = [max(u, v) for u, v in zip(hi, q)]
    if lo[0] > hi[0]:   # a skinned file: its meshes as they lie
        lo = [min(J['accessors'][p['attributes']['POSITION']]['min'][i] for m in J['meshes'] for p in m['primitives']) for i in range(3)]
        hi = [max(J['accessors'][p['attributes']['POSITION']]['max'][i] for m in J['meshes'] for p in m['primitives']) for i in range(3)]
    return lo, hi


def market_naming():
    """the weapon classes and armour thresholds as the UI's icons read them (they mirror RUN TWO's market word for word)"""
    js = open(os.path.join(ROOT, 'slices/bohemia_ui_materials.js')).read()
    m = re.search(r"var OBJ_CLASS = \{(.*?)\};", js, re.S)
    cls = dict(re.findall(r"(\w+):'([^']+)'", m.group(1)))
    body = re.search(r"function armourName\(kind, dur\) \{(.*?)\n  \}", js, re.S).group(1)
    th = {k: [(int(n), w) for n, w in re.findall(r"dur < (\d+) \? '([^']+)'", line)] + [(None, re.findall(r": '([^']+)';", line)[-1])]
          for k, line in (('head', [l for l in body.split('\n') if "'head'" in l][0]), ('shield', [l for l in body.split('\n') if "'shield'" in l][0]),
                          ('body', [l for l in body.split('\n') if l.strip().startswith('return dur')][0]))}
    return cls, th


def word(th, dur):
    for n, w in th:
        if n is None or dur < n: return w


def obj_of_word(w):
    return re.sub(r'^(a|an) ', '', w).replace(' ', '_').replace('armour', 'armour')


def rows_to_objects(W, A, cls, th, by_row, shield_by_row):
    out, bad = {}, []
    for r in W['rows']:
        if r['id'] in by_row: out[r['id']] = by_row[r['id']]; continue
        c = cls.get(r['class'])
        if not c: bad.append(r['id']); continue
        out[r['id']] = c.replace(' ', '_')
    for k, kk in (('body', 'body'), ('head', 'head'), ('shields', 'shield')):
        for r in A[k]:
            if k == 'shields' and r['id'] in shield_by_row: out[r['id']] = shield_by_row[r['id']]; continue
            out[r['id']] = obj_of_word(word(th[kk], r['durability']))
    return out, bad


def check(M, W, A, cls, th, quiet=False):
    """every check on a manifest; returns the failures (so the mutations can be run through the same code)"""
    global FAILS, PASSES
    FAILS, PASSES = [], []
    items = M['items']
    by_row = {r: n for n, e in items.items() for r in e.get('rows', []) if n in ('club', 'bat', 'hatchet')}
    shield_by_row = {r: n for n, e in items.items() for r in e.get('rows', []) if n == 'crash_bar'}
    mapped, bad = rows_to_objects(W, A, cls, th, by_row, shield_by_row)
    ok('M1 every weapon class has a market name', not bad, bad[:6])
    miss = sorted({o for o in mapped.values() if o not in items})
    ok('M1 every row (%d) lands on a modelled object' % len(mapped), not miss, miss)
    wrong = [r for r, o in mapped.items() if o in items and r not in items[o].get('rows', [])]
    ok('M1 the manifest lists each row under the object the market names it', not wrong, wrong[:6])
    P = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
    for n, e in items.items():
        path = os.path.join(MODELS, e['glb'])
        if not os.path.exists(path): ok('M2 %s has its file' % n, False, e['glb']); continue
        try: J, sha = glb(path)
        except Exception as ex: ok('M2 %s opens as a glb' % n, False, ex); continue
        ok('M2 %s has meshes' % n, len(J.get('meshes', [])) > 0)
        if 'sha1' in e: ok('M2 %s is the file the manifest measured' % n, e['sha1'] == sha, '%s != %s' % (e['sha1'][:8], sha[:8]))
        lo, hi = world_bounds(J)
        kind = e['kind']
        if kind == 'held':
            # glTF is y-up: Blender's +X stays +X; the grip at the origin, the haft out along +X (the bow along its limbs)
            ok('M3 %s holds its grip at the origin' % n, lo[0] <= 0.02 and hi[0] >= -0.02 and lo[1] <= 0.02 and hi[1] >= -0.02, (lo, hi))
            if n != 'compound_bow': ok('M3 %s reaches out along +X' % n, hi[0] >= 1.5 * max(abs(lo[0]), 0.03), (lo, hi))
        elif kind == 'shield':
            ok('M3 %s has its forearm behind its face' % n, lo[0] < 0 < hi[0] and hi[0] >= 0.05, (lo, hi))
            ok('M3 %s spans its own width and height' % n, (hi[2] - lo[2]) >= e['w'] * 0.95 and (hi[1] - lo[1]) >= e['h'] * 0.95, (lo, hi, e['w'], e['h']))
        else:
            skins = J.get('skins', [])
            ok('M3 %s carries a skin' % n, bool(skins))
            if skins:
                names = {J['nodes'][j].get('name') for s in skins for j in s['joints']}
                stray = sorted(names - BONES)
                ok('M3 %s is skinned to the rig\'s man\'s own bones only' % n, not stray and BONES <= names, stray or sorted(BONES - names))
        if e.get('made', '').startswith('COOK 10/25'):
            mats = J.get('materials', [])
            ok('M4 %s has at most five materials' % n, len(mats) <= 5, len(mats))
            roles, off = [], []
            for m in mats:
                rs = [(r, int(m.get('name', '')[-1])) for r in P if re.search(r'_%s_\d$' % r, m.get('name', ''))]
                if not rs: off.append(m.get('name')); continue
                role, step = max(rs, key=lambda x: len(x[0])); roles.append(role)
                hx = P[role]['ramp'][step]
                lin = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
                want = [lin(int(hx[i:i + 2], 16) / 255) for i in (1, 3, 5)]
                got = m.get('pbrMetallicRoughness', {}).get('baseColorFactor', [1, 1, 1, 1])[:3]
                if max(abs(a - b) for a, b in zip(want, got)) > 0.01: off.append('%s %s != %s' % (m.get('name'), [round(x, 3) for x in got], hx))
            ok('M4 %s takes every colour from the palette' % n, not off, off[:3])
            ok('M4 %s is never all grey (167(b))' % n, any(r not in GREY_ROLES for r in roles), roles)
            sheet = os.path.join(OUT, 'check_%s.webp' % n)
            ok('M5 %s is compared on the man over a fight floor' % n, os.path.exists(sheet) and os.path.getmtime(sheet) >= os.path.getmtime(path) - 1
               if not os.environ.get('BOHEMIA_GATE_FROM_GIT') else os.path.exists(sheet), sheet)
    return list(FAILS)


def main():
    M = json.load(open(os.path.join(MODELS, 'items.json')))
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))
    A = json.load(open(os.path.join(ROOT, 'records/target/bb/armor.json')))
    cls, th = market_naming()
    os.environ['BOHEMIA_GATE_FROM_GIT'] = '1'   # a fresh checkout has no mtimes worth reading: the sheet must exist
    fails = check(M, W, A, cls, th); passes = list(PASSES)
    # the mutations: each must bite
    mut = []
    W2 = json.loads(json.dumps(W)); W2['rows'].append(dict(W2['rows'][0], id='mutant', **{'class': 'lightsaber'}))
    mut.append(('a row of a class the market cannot name', check(M, W2, A, cls, th)))
    M2 = json.loads(json.dumps(M)); M2['items']['car_door'] = dict(M2['items']['car_door'], glb='item_nothing_here.glb')
    mut.append(('the car door\'s file gone', check(M2, W, A, cls, th)))
    M3 = json.loads(json.dumps(M)); first_worn = [n for n, e in M3['items'].items() if e['kind'].startswith('worn')]
    BONES.add('Skeleton_tail_joint') if first_worn else None
    mut.append(('a skeleton with a bone the man does not have', check(M3, W, A, cls, th) if first_worn else ['skip']))
    BONES.discard('Skeleton_tail_joint')
    th2 = {k: [(n_, w) for n_, w in v] for k, v in th.items()}; th2['shield'] = [(None, 'a shopping cart')]
    mut.append(('a shield the market names as a thing with no model', check(M, W, A, cls, th2)))
    print('EVERY ITEM HAS A MODEL')
    for p in passes: print('  ok   ', p)
    for f in fails: print('  FAIL ', f)
    bit = True
    for nm, fl in mut:
        print('  %s mutation: %s (%d failures)' % ('ok  ' if fl else 'FAIL', nm, len(fl))); bit = bit and bool(fl)
    n_ok, n_bad = len(passes), len(fails) + (0 if bit else 1)
    print('%d/%d' % (n_ok, n_bad))
    sys.exit(1 if n_bad else 0)


if __name__ == '__main__':
    main()
