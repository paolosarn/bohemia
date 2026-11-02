#!/usr/bin/env python3
"""BOHEMIA -- ARMORY (Paolo 11/2, rule 302, ask line 289: 'more clothing, more weapons, the whole thing').

Writes records/target/bb/armory.json (the file a modder edits) into the files the game already reads, so the shop, the
fight, the loot, the crew screen and the icons meet every piece with no new loader:
  weapons.json rows        a weapon row: its family's row A copied (skills, reach, rounds, hands), its numbers the mean of
                           A and B (damage and percents to the nearest 5, value to the nearest 10), marked 'armory'
  armor.json body/head     an armour row the same way (durability, weight, vision, value)
  armour_names.json        the armour piece's own name (rule 202(d): a word of its own, then the object its weight makes it)
  armour_looks.json        the class the man is drawn wearing (engine/bohemia_wear.js, rule 272)
  ours.json pistol_shot    a new pistol's shot row (rule 195: no gun is a club)
  reference/models/bohemia/items.json  the model that draws it today: its family's (A's) object
  slices/rig_melee         a melee piece held as its family's prop (A's own), one hand or two as A
Idempotent: every row it wrote before is taken out first. `check` only measures.

    python3 tools/bohemia_armory.py [write|check]
"""
import copy, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BB = os.path.join(ROOT, 'records/target/bb')
P = lambda *a: os.path.join(ROOT, *a)


def load(p): return json.load(open(p))


def dump(p, d, compact=False):
    s = json.dumps(d, separators=(',', ':'), ensure_ascii=False) if compact else json.dumps(d, indent=1, ensure_ascii=False)
    open(p, 'w').write(s)


def r5(x): return int((x / 5.0) + 0.5) * 5 if x >= 0 else -int((-x / 5.0) + 0.5) * 5
def r10(x): return int((x / 10.0) + 0.5) * 10
def rint(x): return int(x + 0.5) if x >= 0 else -int(-x + 0.5)


def mean(a, b, f):
    if a is None or b is None: return a if b is None else (b if a is None else None)
    return f((a + b) / 2.0)


def main(mode):
    spec = load(os.path.join(BB, 'armory.json'))
    W = load(os.path.join(BB, 'weapons.json')); A = load(os.path.join(BB, 'armor.json'))
    N = load(os.path.join(BB, 'armour_names.json')); L = load(os.path.join(BB, 'armour_looks.json'))
    M = load(P('slices/rig_melee/rig_melee.json'))
    rec = spec['record']
    W['rows'] = [r for r in W['rows'] if 'armory' not in r]
    for k in ('body', 'head'): A[k] = [r for r in A[k] if 'armory' not in r]
    wid = {r['id']: r for r in W['rows']}
    out_w, bad = [], []
    for s in spec['weapons']:
        a, b = (wid.get(x) for x in s['between'])
        if not a or not b: bad.append(s['id'] + ': no row ' + str(s['between'])); continue
        if a['class'] != b['class'] and not s.get('across'): bad.append(s['id'] + ': A and B are two families'); continue
        r = copy.deepcopy(a)
        for k in ('missing', 'conflicts', 'notes', 'dlc'): r.pop(k, None)
        r['id'], r['name'] = s['id'], s['name']
        r['damage_min'] = mean(a['damage_min'], b['damage_min'], r5); r['damage_max'] = mean(a['damage_max'], b['damage_max'], r5)
        r['armor_damage_pct'] = mean(a.get('armor_damage_pct'), b.get('armor_damage_pct'), r5)
        r['armor_ignore_pct'] = mean(a.get('armor_ignore_pct'), b.get('armor_ignore_pct'), r5)
        r['durability'] = mean(a.get('durability'), b.get('durability'), rint)
        r['fatigue'] = mean(a.get('fatigue'), b.get('fatigue'), rint)
        r['value'] = mean(a.get('value'), b.get('value'), r10)
        r['source'] = rec + ' | ARMORY 11/2: the mean of ' + a['id'] + ' and ' + b['id'] + ', fought with ' + a['id'] + "'s skills | A: " + a['source'] + ' | B: ' + b['source']
        r['armory'] = {'name': s['name'].lower(), 'object': s['object'], 'line': s['line'], 'tier': s['tier'], 'kind': s['kind'],
                       'role': s['role'], 'between': s['between'], 'across': s.get('across'), 'carried_by': s['carried_by'], 'draft': True}
        same = [x for x in W['rows'] if x['class'] == r['class'] and (x['damage_min'], x['damage_max'], x.get('armor_damage_pct'), x.get('value')) ==
                (r['damage_min'], r['damage_max'], r.get('armor_damage_pct'), r['value'])]
        if same: bad.append(s['id'] + ': the same numbers as ' + same[0]['id'])
        out_w.append(r)
    aid = {k: {r['id']: r for r in A[k]} for k in ('body', 'head')}
    out_a = {'body': [], 'head': []}
    for k in ('body', 'head'):
        for s in spec[k]:
            a, b = (aid[k].get(x) for x in s['between'])
            if not a or not b: bad.append(s['id'] + ': no ' + k + ' row ' + str(s['between'])); continue
            r = {'id': s['id'], 'name': s['name'][2:].title() if s['name'].startswith('a ') else s['name'].title(),
                 'durability': mean(a['durability'], b['durability'], r5), 'fatigue': mean(a.get('fatigue'), b.get('fatigue'), rint)}
            if k == 'head': r['vision'] = mean(a.get('vision'), b.get('vision'), rint)
            r['value'] = mean(a.get('value'), b.get('value'), r10)
            r['source'] = rec + ' | ARMORY 11/2: the mean of ' + a['id'] + ' and ' + b['id'] + ' | A: ' + a['source'] + ' | B: ' + b['source']
            r['armory'] = {'name': s['name'], 'class': s['class'], 'line': s['line'], 'tier': s['tier'], 'kind': s['kind'], 'between': s['between'], 'draft': True}
            out_a[k].append(r)
    if bad: print('ARMORY: REFUSED\n  ' + '\n  '.join(bad)); return 1
    print('ARMORY: %d weapons, %d body, %d head' % (len(out_w), len(out_a['body']), len(out_a['head'])))
    for r in out_w: print('  %-18s %-8s %sh  dmg %s-%s  vs armour %s%%  %s batteries' % (r['id'], r['class'], r.get('hands') or 2, r['damage_min'], r['damage_max'], r['armor_damage_pct'], max(1, rint(r['value'] / 10.0))))
    for k in ('body', 'head'):
        for r in out_a[k]: print('  %-18s %-4s holds %s  weight %s  %s batteries' % (r['id'], k, r['durability'], r['fatigue'], max(1, rint(r['value'] / 10.0))))
    if mode != 'write': return 0
    W['rows'] += out_w; W['_armory'] = {'count': len(out_w), 'by': 'tools/bohemia_armory.py from armory.json', 'record': rec}
    for k in ('body', 'head'): A[k] += out_a[k]
    A['_armory'] = {'body': len(out_a['body']), 'head': len(out_a['head']), 'by': 'tools/bohemia_armory.py from armory.json', 'record': rec}
    for k in ('body', 'head'):
        for r in out_a[k]:
            N[k][r['id']] = r['armory']['name']
            L[k][r['id']] = {'name': r['armory']['name'], 'class': r['armory']['class']}
    for r in out_w:
        a = r['armory']['between'][0]
        for key in ('by_row', 'two_by_row', 'bow_by_row'):
            if key in M and a in M[key]: M[key][r['id']] = M[key][a]
    # the 3D model that draws each piece today: its family's (A's) object in COOK's manifest, until COOK models it on its own
    IP = P('reference/models/bohemia/items.json'); I = load(IP); ids = set(r['id'] for r in out_w) | set(r['id'] for k in out_a for r in out_a[k])
    for o in I['items'].values(): o['rows'] = [x for x in o.get('rows', []) if x not in ids]
    def bucket(k, d):   # the market's own object for an armour piece's weight (RUN TWO's armourName, the gate's M1)
        if k == 'head': return 'rag_hood' if d < 40 else 'hard_hat' if d < 100 else 'riot_helmet' if d < 180 else 'full_riot_helm'
        return 'work_jacket' if d < 40 else 'padded_vest' if d < 100 else 'plate_carrier' if d < 180 else 'full_riot_armour'
    for r in out_w:
        a = r['armory']['between'][0]
        for o in I['items'].values():
            if a in o.get('rows', []): o['rows'].append(r['id']); break
    for k in ('body', 'head'):
        for r in out_a[k]: I['items'][bucket(k, r['durability'])]['rows'].append(r['id'])
    dump(IP, I)
    dump(os.path.join(BB, 'weapons.json'), W); dump(os.path.join(BB, 'armor.json'), A)
    dump(os.path.join(BB, 'armour_names.json'), N); dump(os.path.join(BB, 'armour_looks.json'), L)
    dump(P('slices/rig_melee/rig_melee.json'), M, compact=True)
    # ours.json: the new pistols' shots, written into its by_row block as text (the file's own layout kept)
    op = os.path.join(BB, 'ours.json'); t = open(op).read()
    t = re.sub(r',\n    "(%s)": "[a-z_]+"' % '|'.join(re.escape(s['id']) for s in spec['weapons']), '', t)
    m = re.search(r'("pistol_shot": \{\s*"value": \{\s*"class": "dagger",\s*"by_row": \{)([^}]*)\}', t)
    body = m.group(2).rstrip()
    add = ''.join(',\n    "%s": "%s"' % (s['id'], s['shot']) for s in spec['weapons'] if s.get('shot'))
    t = t[:m.start(2)] + body + add + '\n   ' + t[m.end(2):]
    open(op, 'w').write(t); json.loads(t)
    print('ARMORY: written')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'check'))
