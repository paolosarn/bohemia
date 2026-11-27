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

    python3 tools/bohemia_armory.py [write|check] [weapons]
ARMORY 3 (11/27): 'write weapons' writes the weapons only and leaves every armour row, name, look and model as it is on disk
(measured: a full rerun put ORIGINS' 11/7 armour rows back to ARMORY 1's source line and key order, and re-bucketed their models).
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


LIB = 'reference/library/grok/wiki/PAGES_ALL.tar.gz:bb_all/'


def bb_skill(wid, row, name):
    """a Battle Brothers skill as its own row carries it (weapons.json), copied"""
    r = wid.get(row)
    for k in (r or {}).get('skills', []):
        if k['name'] == name: return copy.deepcopy(k)
    raise KeyError(row + ' has no ' + name)


def fire_skills(s, r, a, wid, rec):
    """ARMORY 3 (Paolo 11/27, rules 489(b) and 490): the skills a piece fires with, by its 'fire' mode, each cost a Battle Brothers
    skill's own (its page in the skill's source). Writes r['fire'], r['burst'], r['mag'], r['ammo'], r['sight'], r['gun'],
    r['skills'] (or, for a pistol, r['shot_skill'], the skill its shot fires with: ours.pistol_shot builds the shot at the fight).
    Returns a refusal or None."""
    f = s['fire']; m = f.get('mode'); pistol = bool(s.get('shot'))
    QS = bb_skill(wid, 'short_bow', 'Quick Shot'); AS = bb_skill(wid, 'short_bow', 'Aimed Shot')
    RH = bb_skill(wid, 'handgonne', 'Reload Handgonne'); RL = bb_skill(wid, 'light_crossbow', 'Reload')
    if f.get('sight'): r['sight'] = f['sight']
    if not m: return None
    r['fire'] = m
    base = bb_skill(wid, s['shot'], 'Throw Javelin') if pistol else next((copy.deepcopy(k) for k in a['skills'] if not k['name'].startswith('Reload')), None)
    if base is None: return 'no strike skill on ' + a['id']
    reload = next((copy.deepcopy(k) for k in a['skills'] if k['name'].startswith('Reload')), None)
    def cost(k, name, frm, why):
        k['bb_name'] = k['name']; k['name'] = name; k['ap'] = frm['ap']; k['fatigue'] = frm['fatigue']
        k['cost_from'] = frm['page'] + ' (' + frm['source'] + ')'
        k['effect'] = (k.get('effect') or '') + '; ARMORY 3: ' + why
        return k
    if m in ('semi', 'burst', 'belt'):
        if not f.get('mag'): return m + ' needs a magazine'
        # a shotgun's shot keeps its own name: its cone is weapon_shapes.json's row for that skill (Fire Handgonne)
        if m == 'semi': k = cost(base, base['name'] if a['class'] == 'firearm' else 'Shoot', QS, 'from a magazine of %d, no reload between shots; Quick Shot\'s cost, two a turn' % f['mag'])
        elif m == 'burst': k = cost(base, 'Burst', AS, '%d rounds a press at the man aimed at, each its own roll, each after the first -%s (ours.armory_fire.burst); Aimed Shot\'s cost, one a turn' % (f['burst'], 'recoil'))
        else: k = cost(base, 'Traverse', AS, 'a belt: %d rounds a press across the man aimed at and the tile each side of him (weapon_shapes.json Traverse); Aimed Shot\'s cost' % f['burst'])
        if m != 'semi': r['burst'] = f['burst']
        r['mag'] = f['mag']
        if m == 'belt': reload = RH
        if pistol: r['shot_skill'] = k
        else:
            r['ammo'] = 'For %d uses' % f['mag']
            r['skills'] = [k] + ([reload] if reload else [RL])
    elif m in ('rocket', 'tube'):
        k = copy.deepcopy(base); k['bb_name'] = k['name']; k['name'] = 'Fire Rocket'
        k['effect'] = re.sub(r',? ?can hit \d+ tiles behind the target', '', k.get('effect') or '')   # a rocket is no cone: its blast is below
        k['effect'] = (k.get('effect') or '') + '; ARMORY 3: the blast, the tile hit and its eight (weapon_shapes.json Blast, Battle Brothers\' Fire Pot area)' + ('; one rocket a fight, the tube thrown away, refilled after (Battle Brothers\' Firelance)' if m == 'tube' else '')
        r['skills'] = [k] + ([reload] if m == 'rocket' and reload else [])
        if m == 'tube': r['ammo'] = 'For 1 uses'
    elif m in ('drone', 'spot'):
        P = load(os.path.join(BB, 'bohemia_enemies.json'))['numbers']['fire_pot']
        if m == 'drone':
            k = {'name': 'Launch Drone', 'ap': P['value']['ap'], 'fatigue': P['value']['fatigue'], 'hit_bonus': 0, 'range': None,
                 'effect': 'ARMORY 3 (rule 490): the drone flies to the man picked and hovers over his tile and the four beside it, lit; it blows at the start of the operator\'s next turn on whoever is still on them (ours.armory_fire.drone); a gun can shoot it down first; drop the operator and it falls',
                 'page': 'Throw Fire Pot (20 fatigue)', 'source': LIB + '1995_Throw Fire Pot (20 fatigue).txt', 'cost_from': 'Throw Fire Pot (bohemia_enemies.json numbers.fire_pot)'}
        else:
            k = cost({'name': 'Spot', 'hit_bonus': 0, 'range': None, 'page': QS['page'], 'source': QS['source']}, 'Spot', QS,
                     'the scout drone hangs over the board: for his next turns (ours.armory_fire.spot) his side sees every man of theirs and its shots at them land easier')
            k.pop('bb_name', None)
        r['skills'] = [k]; r['ammo'] = 'For %d uses' % f['rounds']; r['gun'] = True
        r['drone'] = m
    else:
        return 'no fire mode ' + str(m)
    return None


def ours_line(t, key, value):
    """ours.json keeps each top-level key in its own layout (one line, or laid out one space a level): that key's value replaced
    in the layout it had, or a new key added on one line before the closing brace"""
    m = re.search(r'^ "%s": ' % re.escape(key), t, re.M)
    if m:
        v0, end = json.JSONDecoder().raw_decode(t, m.end())
        laid = '\n' in t[m.end():end]
        s = json.dumps(value, indent=1, ensure_ascii=False).replace('\n', '\n ') if laid else json.dumps(value, ensure_ascii=False)
        return t[:m.end()] + s + t[end:]
    end = t.rstrip().rfind('}')
    return t[:end].rstrip() + ',\n "%s": %s\n}\n' % (key, json.dumps(value, ensure_ascii=False))


def main(mode, part=None):
    wonly = part == 'weapons'
    spec = load(os.path.join(BB, 'armory.json'))
    W = load(os.path.join(BB, 'weapons.json')); A = load(os.path.join(BB, 'armor.json'))
    N = load(os.path.join(BB, 'armour_names.json')); L = load(os.path.join(BB, 'armour_looks.json'))
    M = load(P('slices/rig_melee/rig_melee.json'))
    L0 = copy.deepcopy(L)                                              # the looks as they were: an 'own' key a model gave a row is kept
    W_PIECES = set(load(P('slices/wear/wear.json'))['pieces'])         # the pieces the wear sheet holds
    rec = spec['record']
    # ARMORY 3 (11/27, rule 490(e) 'more variations... makes, conditions, homemade versions'): a 'worn_of' entry is its base piece
    # (the base's family rows, fire, tune and own picture) with its own id, name, line, tier, kind and carried_by, and 'worn'
    base = {s['id']: s for s in spec['weapons']}
    def expand(s):
        of = s.get('worn_of') or s.get('named_of')   # ARMORY 3 round three (rule 493(c)): a NAMED prize is its base piece made better
        if not of: return s
        b = copy.deepcopy(base[of])
        for k in ('carried_by', 'starter'): b.pop(k, None)
        b.update(s); return b
    spec['weapons'] = [expand(s) for s in spec['weapons']]
    # WEAPONS 11/7 (rule 424): a rerun only ADDS. Measured: a second `write` put every own model back on its family prop
    # (rig_melee by_row: the crowbar drawn as the pipe again, all thirteen of COOK's and the two two-handers), took the rows off
    # COOK's own entries in items.json, and undid TUNING's prices (value_by) and the armour's own looks ('own'). What a later lane
    # wrote on a row this tool made is kept: LATER below, and the index and the manifest are only filled where they are empty.
    LATER = ('value', 'wiki_value', 'value_by')
    # a price, once written, is TUNING's (rule 21: one numbers table; TUNING 2 [price is power] moved them, and one moved with no note)
    later = {('w', r['id']): {k: r[k] for k in LATER if k in r} for r in W['rows'] if 'armory' in r}
    for k in ('body', 'head'): later.update({(k, r['id']): {x: r[x] for x in LATER if x in r} for r in A[k] if 'armory' in r})
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
        # ARMORY 2 (rule 320): what moves off the mean, each with its why; a whip's blow is LASH and reaches ours.whip.reach
        t = s.get('tune') or {}
        for k, v in (t.get('add') or {}).items(): r[k] = (r.get(k) or 0) + v
        for k, v in (t.get('set') or {}).items(): r[k] = v
        if t: r['source'] += ' | ARMORY 2 tune: ' + json.dumps({k: t[k] for k in ('add', 'set', 'lash_hit_bonus') if k in t}) + ' (' + t['why'] + ')'
        if s.get('lash'):
            reach = load(os.path.join(BB, 'ours.json'))['whip']['value']['reach']
            r['range'], r['range_min'], r['range_max'] = '1-%d' % reach, 1, reach
            for sk in r['skills']:
                if sk['name'] == 'Whip':
                    sk['name'] = 'Lash'; sk['bb_name'] = 'Whip'
                    sk['effect'] = 'Reaches %d tiles (ours.whip.reach, rule 320; Battle Brothers 3); two stacks of 5 bleeding a turn for 2 turns when it takes 6 health or more; its row\'s share straight through' % reach
                    if t.get('lash_hit_bonus'): sk['hit_bonus'] = t['lash_hit_bonus']
                if sk.get('range') == 3: sk['range'] = reach
            # VOTE FIXES 11/2 (Paolo: 'Disarm is a low luck ability vibe and all whips can have them'): no Disarm button; a landed LASH rolls ours.whip.disarm_pct
            r['skills'] = [sk for sk in r['skills'] if sk['name'] != 'Disarm']
            for sk in r['skills']:
                if sk['name'] == 'Lash': sk['effect'] += '; a landed lash may disarm him for his next turn (ours.whip.disarm_pct, a low luck roll)'
            r['whip'] = dict(s.get('whip') or {})
        # ARMORY 3 (rules 489(b), 490): how the piece fires, each mode's skills Battle Brothers' own (fire_skills below)
        if s.get('fire'):
            fb = fire_skills(s, r, a, wid, rec)
            if fb: bad.append(s['id'] + ': ' + fb); continue
        # ARMORY 3 round three: NAMED (rule 493(c), Battle Brothers' named items, bb_all/1403_Named Weapons.txt: 'Durability is always
        # modified. Then two other random stats... are improved'; ours designed, not rolled): durability up, the weight lighter, and a
        # gun's shot surer, a blade's or a club's blow harder; A GUN'S DAMAGE NEVER MOVES (rule 489(d)); never on a stall, always dropped
        if s.get('named'):
            im = s['named']['improve']; gunlike = bool(s.get('shot')) or r['class'] in ('crossbow', 'firearm', 'bow') or r.get('gun')
            if im.get('damage') and not gunlike: r['damage_min'] += im['damage']; r['damage_max'] += im['damage']
            if im.get('hit'):
                for sk in (r.get('skills') or []) + ([r['shot_skill']] if r.get('shot_skill') else []):
                    if not sk['name'].startswith('Reload') and isinstance(sk.get('hit_bonus'), (int, float)): sk['hit_bonus'] += im['hit']
            if im.get('lighter_pct') and isinstance(r.get('fatigue'), (int, float)): r['fatigue'] = -int(round(abs(r['fatigue']) * (1 - im['lighter_pct'] / 100.0)))
            if im.get('durability_pct') and isinstance(r.get('durability'), (int, float)): r['durability'] = int(round(r['durability'] * (1 + im['durability_pct'] / 100.0)))
            if im.get('sight'): r['sight'] = im['sight']
            r['value'] = r10(r['value'] * im.get('value_x', 3))
            r['named'] = {'guarded_by': s['named']['guarded_by'], 'story': s['named']['story'], 'improve': im}
            r['source'] += ' | ARMORY 3 named' + (' of ' + s['named_of'] if s.get('named_of') else '') + ': ' + json.dumps(im)
        # ARMORY 3: WORN (a shot-out barrel, a loose action): the same gun, the same damage (rule 489(d)), its shot 'hit' points
        # harder to land and 'value_pct' of the price
        if s.get('worn'):
            wv = s['worn']
            for sk in (r.get('skills') or []) + ([r['shot_skill']] if r.get('shot_skill') else []):
                if not sk['name'].startswith('Reload') and isinstance(sk.get('hit_bonus'), (int, float)): sk['hit_bonus'] += wv['hit']
            r['value'] = r10(r['value'] * wv['value_pct'] / 100.0); r['worn'] = wv
            r['source'] += ' | ARMORY 3 worn of ' + s['worn_of'] + ': ' + json.dumps(wv)
        r['armory'] = {'name': s['name'].lower(), 'object': s['object'], 'line': s['line'], 'tier': s['tier'], 'kind': s['kind'],
                       'role': s['role'], 'between': s['between'], 'across': s.get('across'), 'carried_by': s['carried_by'], 'draft': True}
        if s.get('fire'): r['armory']['fire'] = s['fire']
        if s.get('worn_of'): r['armory']['worn_of'] = s['worn_of']
        if s.get('named'): r['armory']['named'] = {'guarded_by': s['named']['guarded_by'], 'story': s['named']['story']}
        if s.get('named_of'): r['armory']['named_of'] = s['named_of']
        if s.get('own_gun'): r['armory']['own_gun'] = s['own_gun']
        if s.get('starter'): r['armory']['starter'] = True
        if s.get('prop'): r['armory']['prop'] = s['prop']
        same = [x for x in W['rows'] if x['class'] == r['class'] and (x['damage_min'], x['damage_max'], x.get('armor_damage_pct'), x.get('value')) ==
                (r['damage_min'], r['damage_max'], r.get('armor_damage_pct'), r['value'])]
        if same: bad.append(s['id'] + ': the same numbers as ' + same[0]['id'])
        r.update(later.get(('w', r['id']), {}))
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
            # ORIGINS 11/7 (rule 427(c)): an armour piece may carry the weapons' 'tune' too (the Lone Wolf's golden named pieces)
            t = s.get('tune') or {}
            for kk, v in (t.get('add') or {}).items(): r[kk] = (r.get(kk) or 0) + v
            for kk, v in (t.get('set') or {}).items(): r[kk] = v
            if t: r['source'] += ' | tune: ' + json.dumps({kk: t[kk] for kk in ('add', 'set') if kk in t}) + ' (' + t['why'] + ')'
            r['armory'] = {'name': s['name'], 'class': s['class'], 'line': s['line'], 'tier': s['tier'], 'kind': s['kind'], 'between': s['between'], 'draft': True}
            r.update(later.get((k, r['id']), {}))
            if s.get('origin'): r['armory']['origin'] = s['origin']   # ORIGINS 11/7: that origin's own (its crew wears it, only its home town sells it)
            if s.get('own'): r['armory']['own'] = s['own']           # ORIGINS 11/7: its own model on the body (slices/wear)
            out_a[k].append(r)
    if bad: print('ARMORY: REFUSED\n  ' + '\n  '.join(bad)); return 1
    print('ARMORY: %d weapons, %d body, %d head' % (len(out_w), len(out_a['body']), len(out_a['head'])))
    for r in out_w: print('  %-18s %-8s %sh  dmg %s-%s  vs armour %s%%  %s batteries' % (r['id'], r['class'], r.get('hands') or 2, r['damage_min'], r['damage_max'], r['armor_damage_pct'], max(1, rint(r['value'] / 10.0))))
    for k in ('body', 'head'):
        for r in out_a[k]: print('  %-18s %-4s holds %s  weight %s  %s batteries' % (r['id'], k, r['durability'], r['fatigue'], max(1, rint(r['value'] / 10.0))))
    if mode != 'write': return 0
    W['rows'] += out_w; W['_armory'] = {'count': len(out_w), 'by': 'tools/bohemia_armory.py from armory.json', 'record': rec}
    if wonly:   # the armour as it is on disk, untouched
        A = load(os.path.join(BB, 'armor.json')); N = load(os.path.join(BB, 'armour_names.json')); L = load(os.path.join(BB, 'armour_looks.json'))
        out_a = {'body': [], 'head': []}
    for k in ('body', 'head'): A[k] += out_a[k]
    if not wonly: A['_armory'] = {'body': len(out_a['body']), 'head': len(out_a['head']), 'by': 'tools/bohemia_armory.py from armory.json', 'record': rec}
    for k in ('body', 'head'):
        for r in out_a[k]:
            N[k][r['id']] = r['armory']['name']
            own = (L[k].get(r['id']) or {}).get('own')   # COOK's own look for the piece (rule 337), kept
            L[k][r['id']] = {'name': r['armory']['name'], 'class': r['armory']['class']}
            own = own or r['armory'].get('own')   # ORIGINS 11/7: an origin piece names its own model
            if own and own in W_PIECES: L[k][r['id']]['own'] = own
    for r in out_w:
        a = r['armory']['between'][0]
        for key in ('by_row', 'two_by_row', 'bow_by_row'):
            if key in M and a in M[key] and r['id'] not in M[key]: M[key][r['id']] = r['armory'].get('prop') or M[key][a]   # never over a model already named (COOK's own)
    # the 3D model that draws each piece today: its family's (A's) object in COOK's manifest, until COOK models it on its own
    IP = P('reference/models/bohemia/items.json'); I = load(IP); ids = set(r['id'] for r in out_w) | set(r['id'] for k in out_a for r in out_a[k])
    mine = set(x for o in I['items'].values() if o.get('was') for x in o.get('rows', []))   # rows on a model of their own (COOK's 'was'): left there
    ids = ids - mine
    for o in I['items'].values(): o['rows'] = [x for x in o.get('rows', []) if x not in ids]
    def bucket(k, d):   # the market's own object for an armour piece's weight (RUN TWO's armourName, the gate's M1)
        if k == 'head': return 'rag_hood' if d < 40 else 'hard_hat' if d < 100 else 'riot_helmet' if d < 180 else 'full_riot_helm'
        return 'work_jacket' if d < 40 else 'padded_vest' if d < 100 else 'plate_carrier' if d < 180 else 'full_riot_armour'
    for r in out_w:
        if r['id'] in mine: continue
        a = r['armory']['between'][0]
        for o in I['items'].values():
            if a in o.get('rows', []): o['rows'].append(r['id']); break
    for k in ('body', 'head'):
        for r in out_a[k]:
            if r['id'] not in mine: I['items'][bucket(k, r['durability'])]['rows'].append(r['id'])
    dump(IP, I)
    dump(os.path.join(BB, 'weapons.json'), W)
    if not wonly:
        dump(os.path.join(BB, 'armor.json'), A)
        dump(os.path.join(BB, 'armour_names.json'), N); dump(os.path.join(BB, 'armour_looks.json'), L)
    dump(P('slices/rig_melee/rig_melee.json'), M, compact=True)
    # ours.json: the new pistols' shots, written into its by_row block as text (the file's own layout kept)
    op = os.path.join(BB, 'ours.json'); t = open(op).read()
    t = re.sub(r',\n    "(%s)": "[a-z_]+"' % '|'.join(re.escape(s['id']) for s in spec['weapons']), '', t)
    m = re.search(r'("pistol_shot": \{\s*"value": \{\s*"class": "dagger",\s*"by_row": \{)([^}]*)\}', t)
    body = m.group(2).rstrip()
    add = ''.join(',\n    "%s": "%s"' % (s['id'], s['shot']) for s in spec['weapons'] if s.get('shot'))
    t = t[:m.start(2)] + body + add + '\n   ' + t[m.end(2):]
    # ARMORY 3 (rules 478, 489(b), 490): what each piece carries into a fight, what a refill costs the stock, what is never refilled
    # (ours.gun_rounds, COMBAT FOUR's key: only by_id, per_shot_by_id and consumable are written, each piece's own); the fire's numbers
    # (ours.armory_fire), its bands (ours.range_bands) and its two shapes (weapon_shapes.json), each from armory.json's own block
    O = json.loads(t)
    G = O['gun_rounds']; gv = G['value']
    mine3 = [s for s in spec['weapons'] if s.get('fire') and s['fire'].get('rounds')]
    gv['by_id'] = dict((k, v) for k, v in (gv.get('by_id') or {}).items() if k not in set(s['id'] for s in spec['weapons']))
    for s in mine3: gv['by_id'][s['id']] = s['fire']['rounds']
    gv['per_shot_by_id'] = dict((s['id'], s['fire']['per_shot']) for s in mine3 if s['fire'].get('per_shot'))
    gv['consumable'] = [s['id'] for s in mine3 if s['fire'].get('consumable')]
    G['armory'] = 'by_id, per_shot_by_id and consumable are written by tools/bohemia_armory.py from armory.json (ARMORY 3, ' + spec.get('record_4', '') + ')'
    t = ours_line(t, 'gun_rounds', G)
    if spec.get('fire_numbers'): t = ours_line(t, 'armory_fire', spec['fire_numbers'])
    if spec.get('fire_bands'):
        RB = O['range_bands']
        for k, v in spec['fire_bands'].items():
            if not k.startswith('_'): RB['value'][k] = v
        t = ours_line(t, 'range_bands', RB)
    open(op, 'w').write(t); json.loads(t)
    # ARMORY 3: a piece's own picture in his hands, where COOK's own guns hold one that fits (slices/fight_rig/own_guns.json by_row,
    # its compact layout kept); only this file's rows are touched
    OGP = P('slices/fight_rig/own_guns.json'); OG = load(OGP); mineids = set(s['id'] for s in spec['weapons'])
    for s in spec['weapons']:
        g = s.get('own_gun')
        if g and g in OG['guns']: OG['by_row'][s['id']] = g
        elif s['id'] in OG['by_row'] and s['id'] in mineids and s.get('fire'): OG['by_row'].pop(s['id'])
    allrows = set(x['id'] for x in W['rows'])
    for k in [k for k in OG['by_row'] if k not in allrows]: OG['by_row'].pop(k)   # a picture kept for a row that is gone points at nothing
    dump(OGP, OG, compact=True)
    if spec.get('fire_shapes'):
        # the file is laid out by hand (COMBAT's): ours go in as one line each before the rows close, the rest byte for byte
        SP = os.path.join(BB, 'weapon_shapes.json'); st = open(SP).read()
        st = '\n'.join(l for l in st.split('\n') if not (l.lstrip().startswith('{"skill": ') and '"armory": true' in l))   # ours out, a line each
        i = st.rstrip().rfind(']'); head = st[:i].rstrip().rstrip(',')
        add = ''.join(',\n    ' + json.dumps(dict([('skill', x['skill']), ('armory', True)] + [(k, v) for k, v in x.items() if k not in ('skill', 'armory')]), ensure_ascii=False) for x in spec['fire_shapes'])
        st = head + add + '\n  ' + st[i:]
        json.loads(st); open(SP, 'w').write(st)
    print('ARMORY: written')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'check', sys.argv[2] if len(sys.argv) > 2 else None))
