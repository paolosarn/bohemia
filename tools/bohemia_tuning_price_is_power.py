#!/usr/bin/env python3
"""TUNING 2 [price is power] 11/3 (VAMILY rule 370(3), ask line 396; Paolo 11/3: 'Battle Brothers never had a [man] wearing like
seven dollars [of gear] and damn near one shot [everything]... I just buy them [gear for] 21 and nothing can stop me').

PRICE IS POWER: on the armourer's shelf no piece is dearer than a piece of the same slot that protects at least as much and weighs
no more (strictly better in one). Measured on Battle Brothers' own rows (records/target/bb/armor.json, the wiki's crowns): 16 body
pieces and 11 helmets break it, nearly all costumes, event clothes and the ancient and decayed sets the wiki prices for their story
(the Noble Tunic at 100 crowns holds 20; the Undertaker's Apron at 65 holds 30); our own armory has three more (the football pads,
the football helmet, the welding mask). The fix lowers the WORSE, DEARER piece to five crowns under the cheapest piece that
out-protects it, repeated until nothing breaks the rule; a good cheap piece is never made dearer, so nothing a player already buys
for its armour moves. Battle Brothers' crowns stay on the row as wiki_value; value_by says why. Idempotent: it starts from
wiki_value when a row has one. Shields are checked the same way (armour, weight, and both defences) and break nothing.

The engine (engine/bohemia_pricetable.js), the settlement screen's shelf and the hire formula read `value` as before; the gate
gates/the_fight_is_close_gate.js leg P1 holds the rule.
  python3 tools/bohemia_tuning_price_is_power.py            dry run: prints what would move
  python3 tools/bohemia_tuning_price_is_power.py --write    writes records/target/bb/armor.json
"""
import json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PATH = os.path.join(ROOT, 'records/target/bb/armor.json')
STEP = 5
WHY = ('TUNING 2 [price is power] 11/3 (rule 370(3)): lowered to five crowns under the cheapest piece of this slot that holds at '
       'least as much and weighs no more, so a worse piece never costs more than a better one; Battle Brothers\' crowns kept in wiki_value '
       '(tools/bohemia_tuning_price_is_power.py, records/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_11_3_26.md s2)')


def weight(r):
    return abs(r.get('fatigue') or 0)


def out_protects(q, r, slot):
    """q holds at least as much as r, weighs no more, and is strictly better in one (shields: both defences too)"""
    if not (q['durability'] >= r['durability'] and weight(q) <= weight(r)):
        return False
    if slot == 'shields':
        qm, qr, rm, rr = q.get('melee_defense') or 0, q.get('ranged_defense') or 0, r.get('melee_defense') or 0, r.get('ranged_defense') or 0
        if not (qm >= rm and qr >= rr):
            return False
        return q['durability'] > r['durability'] or weight(q) < weight(r) or qm > rm or qr > rr
    return q['durability'] > r['durability'] or weight(q) < weight(r)


def breaks(rows, slot):
    out = []
    for r in rows:
        dom = [q for q in rows if q is not r and q['value'] < r['value'] and out_protects(q, r, slot)]
        if dom:
            out.append((r, min(dom, key=lambda q: q['value'])))
    return out


def fix(d):
    moved = []
    for slot in ('body', 'head', 'shields'):
        rows = [r for r in d[slot] if r.get('value') is not None and r.get('durability') is not None]
        for r in rows:
            if 'wiki_value' in r:
                r['value'] = r['wiki_value']
        base = {id(r): r['value'] for r in rows}
        for _ in range(500):
            bad = breaks(rows, slot)
            if not bad:
                break
            for r, q in bad:
                nv = max(0, q['value'] - STEP)
                if nv < r['value']:
                    r['value'] = nv
        for r in rows:
            b = base[id(r)]
            if r['value'] != b:
                r['wiki_value'] = b
                r['value_by'] = WHY
                moved.append((slot, r['id'], r['durability'], r.get('fatigue'), b, r['value']))
            else:
                r.pop('wiki_value', None)
                r.pop('value_by', None)
    return moved


def main():
    raw = open(PATH, encoding='utf-8').read()
    d = json.loads(raw)
    moved = fix(d)
    for m in moved:
        print('%-8s %-40s holds %4s weight %4s  %5s -> %5s crowns' % m)
    left = sum(len(breaks([r for r in d[s] if r.get('value') is not None and r.get('durability') is not None], s)) for s in ('body', 'head', 'shields'))
    print('%d pieces moved; %d still break the rule' % (len(moved), left))
    if '--write' in sys.argv:
        with open(PATH, 'w', encoding='utf-8') as f:
            f.write(json.dumps(d, indent=1, ensure_ascii=False) + ('\n' if raw.endswith('\n') else ''))
        print('wrote', os.path.relpath(PATH, ROOT))


if __name__ == '__main__':
    main()
