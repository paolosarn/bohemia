#!/usr/bin/env python3
"""BOHEMIA -- COOK [every town built for tall and wide], THE GLIDE'S PAIRS (rule 289(b), Paolo 10/26: 'all camps and settlements
have to look good when you flip them from portrait to landscape... I don't know if the buildings and the people flip when it
flips, but you gotta find a way to do it cleanly').

THE CLEAN FLIP is the shared-element move (rule 289(b), the coordinator's default): on a turn every building glides from its tall
spot to its wide spot in one beat at 120 BPM, people ride with the ground under them, only what has no partner fades. RUN TWO plays
it; this writes what it plays from: every thing of a town that stands in BOTH compositions gets ONE id, and both its spots.

READ FROM THE SCENES' OWN MEASURE (records/target/cook_town_screens/wide/render/<town>.json and tall/render/<town>.json, every
piece of every thing measured roof to foot): a thing's spot in a composition is the union of its pieces' boxes there, its foot the
middle of that box's bottom, in picture px and in the scene's metres. A building, a landmark and every tap has one name in both
scenes (the composer builds it by the same builder under the same name), so it pairs by name; a kind that stands several times
(three wrecks, two palms, the tents) pairs by the least travel (each foot as a share of its picture), and what one scene holds more
of than the other fades (listed). The town's junk (fill_*) never pairs: it fades, as the coordinator's research says what has no
partner should.

  python3 tools/bohemia_cook_every_town_the_glide_10_26_26.py      -> slices/settlement_ground_towns/settlement_ground.json towns[name].glide
"""
import os, sys, re, json, math
from scipy.optimize import linear_sum_assignment

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHIP = os.path.join(R, 'slices/settlement_ground_towns')
REND = {'wide': os.path.join(R, 'records/target/cook_town_screens/wide/render'),
        'tall': os.path.join(R, 'records/target/cook_town_screens/tall/render')}
PX = {'wide': (2060, 1092), 'tall': (1024, 1820)}
PPM = 515.0 / 12.0
C45 = math.cos(math.radians(45.0))
BEAT_MS = 500                                         # one beat at 120 BPM (rule 289(b))
ROLE = {'town': {'barber', 'clinic', 'stall', 'posts', 'board', 'bar', 'smith', 'armourer'},
        'fortress': {'clinic', 'barber', 'stall', 'board', 'posts'},
        'camp': {'clinic', 'barber', 'stall', 'posts', 'board'}}


KIND = re.compile(r'^(palm)\d+$')                    # a palm is named by where it stands; one kind both ways


def foot_m(comp, px, py):
    W, H = PX[comp]
    return round(30.0 + (px - W / 2) / PPM, 2), round(30.0 + (H / 2 - py) / (PPM * C45), 2)


def things(comp, slug):
    """name -> list of things (each a union box) in one composition. Pieces of one thing nest (a sign on its wall) or touch
    standing on one line (a row of graves, the church's tower and nave); a name's pieces that stand apart, or one behind another
    (ten tents, one over the next on the screen), are separate things of that name"""
    out = {}
    for o in json.load(open(os.path.join(REND[comp], slug + '.json')))['outlines']:
        if o['name'].startswith('fill_'): continue
        out.setdefault(KIND.sub(r'\1', o['name']), []).append(list(o['box']))
    groups = {}
    for n, boxes in out.items():
        g = []
        for b in boxes:
            merged = [x for x in g if inside(b, x) >= 0.6 or inside(x, b) >= 0.6 or
                      (abs(b[3] - x[3]) <= 16 and not (b[0] > x[2] + 6 or b[2] < x[0] - 6 or b[1] > x[3] + 6 or b[3] < x[1] - 6))]
            for x in merged:
                g.remove(x); b = [min(b[0], x[0]), min(b[1], x[1]), max(b[2], x[2]), max(b[3], x[3])]
            g.append(b)
        groups[n] = sorted(g, key=lambda b: (b[0] + b[2]) / 2)
    return groups


def touching(g, gap=12):
    """a name's things merged where they touch: when the two compositions hold a different count of it, its parts (a garden's
    rows of beds, a run of panels, a wall's lengths) are one thing that the frame cut otherwise"""
    out = []
    for b in g:
        merged = [x for x in out if not (b[0] > x[2] + gap or b[2] < x[0] - gap or b[1] > x[3] + gap or b[3] < x[1] - gap)]
        for x in merged:
            out.remove(x); b = [min(b[0], x[0]), min(b[1], x[1]), max(b[2], x[2]), max(b[3], x[3])]
        out.append(b)
    return sorted(out, key=lambda b: (b[0] + b[2]) / 2)


def spot(comp, b):
    fx, fy = (b[0] + b[2]) // 2, b[3]
    return {'box': b, 'foot': [fx, fy], 'foot_m': list(foot_m(comp, fx, fy))}


def pairs(w, t):
    """the pairing that slides the least: each thing's foot as a share of its picture, the least total travel (scipy's
    assignment); the extra of the longer list fades"""
    if not w or not t: return []
    fw = [(((b[0] + b[2]) / 2) / PX['wide'][0], b[3] / PX['wide'][1]) for b in w]
    ft = [(((b[0] + b[2]) / 2) / PX['tall'][0], b[3] / PX['tall'][1]) for b in t]
    cost = [[math.hypot(a[0] - c[0], a[1] - c[1]) for c in ft] for a in fw]
    i, j = linear_sum_assignment(cost)
    return sorted(zip(i.tolist(), j.tolist()), key=lambda p: fw[p[0]][0])


def glide_of(town, MAN):
    slug = town.lower(); tier = MAN[town]['tier']; m = MAN[town]
    W, T = things('wide', slug), things('tall', slug)
    for n in set(W) & set(T):
        if len(W[n]) != len(T[n]): W[n], T[n] = touching(W[n]), touching(T[n])
    pieces, faded, taps = [], {'wide': [], 'tall': []}, []
    # every tap the screen opens (hotspots, and the boxes RUN TWO reads, bar the look) pins first: the thing that IS it both ways
    # (a building under another name in some towns, THING in the composer: a tent is the camp's clinic) is the one of the same
    # name with the most overlap with the tap's box in each composition, so the clinic's tent glides to the clinic's tent
    box = lambda comp, r: m[comp]['hotspots'].get(r, {}).get('box') or (m[comp]['boxes'].get(r) if r != 'look' else None)
    roles = sorted((set(m['wide']['hotspots']) | set(m['wide']['boxes'])) - {'look'})
    pinned = {}
    for role in roles:
        wb, tb = box('wide', role), box('tall', role)
        if not (wb and tb): continue
        bw = max(((n, i) for n in W for i in range(len(W[n]))), key=lambda k: iou(W[k[0]][k[1]], wb), default=None)
        bt = max(((n, j) for n in T for j in range(len(T[n]))), key=lambda k: iou(T[k[0]][k[1]], tb), default=None)
        if bw and bt and bw[0] == bt[0] and iou(W[bw[0]][bw[1]], wb) >= 0.5 and iou(T[bt[0]][bt[1]], tb) >= 0.5:
            key = (bw, bt)
            if key in pinned: pinned[key]['roles'].append(role); continue
            n = bw[0]; one = len(W[n]) == 1 and len(T[n]) == 1
            pinned[key] = {'id': '%s.%s' % (slug, n if one or n == role else n + '.' + role), 'name': n, 'roles': [role],
                           'wide': spot('wide', W[n][bw[1]]), 'tall': spot('tall', T[n][bt[1]])}
    used = {('wide',) + k[0] for k in pinned} | {('tall',) + k[1] for k in pinned}
    pieces += pinned.values()
    for n in sorted(set(W) | set(T)):
        w = [b for i, b in enumerate(W.get(n, [])) if ('wide', n, i) not in used]
        t = [b for j, b in enumerate(T.get(n, [])) if ('tall', n, j) not in used]
        pp = pairs(w, t)
        for k, (a, b) in enumerate(pp):
            pieces.append({'id': '%s.%s%s' % (slug, n, '' if len(pp) == 1 and len(W.get(n, [])) == 1 else '.%d' % k), 'name': n,
                           'roles': [], 'wide': spot('wide', w[a]), 'tall': spot('tall', t[b])})
        faded['wide'] += [n] * (len(w) - len(pp)); faded['tall'] += [n] * (len(t) - len(pp))
    # a tap that is part of a piece (the fortress's smith is the barber's ground floor) or the ground (the lot, the build ground)
    # gets its own id and rides the piece it sits in, or the ground
    for role in roles:
        wb, tb = box('wide', role), box('tall', role)
        if not (wb and tb) or any(role in p['roles'] for p in pieces): continue
        host = max(pieces, key=lambda p: min(inside(wb, p['wide']['box']), inside(tb, p['tall']['box'])), default=None)
        on = host['id'] if host and min(inside(wb, host['wide']['box']), inside(tb, host['tall']['box'])) >= 0.6 else 'ground'
        taps.append({'id': '%s.%s' % (slug, role), 'name': role, 'roles': [role], 'rides': on,
                     'wide': spot('wide', wb), 'tall': spot('tall', tb)})
    return {'beat_ms': BEAT_MS, 'ease': "MOTION's curve (rule 229)", 'pieces': pieces, 'taps': taps, 'fade': faded,
            'note': ('THE GLIDE (rule 289(b)): on a turn every piece slides from its spot in the old composition to its spot in the new '
                     'one in one beat, eased; a piece\'s roles are the taps it is; a tap in taps is part of the piece it rides (or the '
                     'ground) and moves with it; what is in fade has no partner and fades; the ground and the junk cross-fade under '
                     'them; a person rides with the piece whose foot is nearest his own and keeps doing what he was doing; the door he '
                     'is at stays under his eye (220(e)).')}


def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    u = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - ix * iy
    return ix * iy / u if u > 0 else 0.0


def inside(a, b):
    """the share of box a that stands inside box b"""
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    s = (a[2] - a[0]) * (a[3] - a[1])
    return ix * iy / s if s > 0 else 0.0


if __name__ == '__main__':
    manp = os.path.join(SHIP, 'settlement_ground.json')
    MAN0 = json.load(open(manp)); MAN = MAN0['towns']
    for town in sorted(MAN):
        g = glide_of(town, MAN); MAN[town]['glide'] = g
        print('  %-11s %2d pieces paired, %d fade wide, %d fade tall' % (town, len(g['pieces']), len(g['fade']['wide']), len(g['fade']['tall'])))
    MAN0['glide'] = ('towns[name].glide: the clean flip\'s pairs (rule 289(b), COOK [every town built for tall and wide]): every piece '
                     'that stands in both compositions, one id, its box, foot (px) and foot (metres) in each; RUN TWO slides each from '
                     'one to the other in one beat on a turn.')
    json.dump(MAN0, open(manp, 'w'), indent=1)
