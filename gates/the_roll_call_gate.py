#!/usr/bin/env python3
"""THE ROLL CALL (CHARACTER [every old asset into the new look], 10/19/26, rule 115(c)).

His words, 10/18: 'we still have to get the hair approved and the hats approved and the sunglasses approved and all the
assets we have we have to coordinate them, rename them, reapply them in the new art stuff, so please don't forget.'
'Please don't forget' is a list that cannot lose a row. This gate is that.

  R1  every entry of the alpha's GARMENTS table and every piece of the paper doll is on the roll call exactly once
  R2  every name a look wears today (CITY_CAST_LOOKS, FACTION_LOOKS) is a roll-call name
  R3  a row says approved only when every card it cites carries his UP in the registry
  R4  no hair, hat or eyewear is approved until a card of its own passes (his 10/18: 'we still have to get the hair
      approved... the hats... the sunglasses'), whatever card it rode on
  R5  a dead shape is listed and never batched for a rebuild (GRAVEYARD IS FINAL)
  R6  the roll call is fresh: the tool re-derives it from the alpha, the registry and the tools, row for row
  R7  every PORTRAIT head piece maps onto a roll-call name (no second name system)

    python3 gates/the_roll_call_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RC = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_the_roll_call as T  # noqa: E402

P = F = 0


def ok(label, cond, extra=''):
    global P, F
    if cond:
        P += 1; print('  ok   ' + label + (('   ' + extra) if extra else ''))
    else:
        F += 1; print('  FAIL ' + label + (('\n         ' + extra) if extra else ''))


def main():
    print('THE ROLL CALL -- every hair, hat, eyewear and garment a person can wear, one row each (rule 115c)')
    rc = json.load(open(RC))
    rows = rc['assets']
    names = [r['name'] for r in rows]
    s = open(T.ALPHA, encoding='utf-8').read()
    G = T.garments(s)
    i = s.find('const PD_DATA = {')
    pd = json.loads(s[i + len('const PD_DATA = '):s.find('\n', i)].rstrip().rstrip(';'))
    want = [g[0] for g in G] + [k for k in pd['layers'] if k.split('/')[0] not in ('body', 'facial')]
    # a second ruler for R1, not the tool's parser: every 'layer:' key inside the table is one garment
    j = s.find('var GARMENTS=window.GARMENTS=['); body = s[j:j + len(s[j:].split('\n];')[0])]
    layers = len(__import__('re').findall(r"\blayer:'[a-z]+'", body))
    ok('R1 the parser reads every entry: %d names against %d layer keys in the table' % (len(G), layers), len(G) == layers)
    missing = sorted(set(want) - set(names)); twice = sorted(n for n in set(names) if names.count(n) > 1)
    ok('R1 every GARMENTS entry (%d) and paper-doll piece is on the roll call exactly once (%d rows)' % (len(G), len(rows)),
       not missing and not twice and len(rows) >= 390, ('missing %s; twice %s' % (missing[:8], twice[:8])) if (missing or twice) else '')
    worn = T.looks(s)
    unknown = sorted(set(v for w in worn.values() for v in w.values()) - set(names))
    ok('R2 every name the %d looks wear is a roll-call name' % len(worn), not unknown and len(worn) >= 25, ', '.join(unknown[:8]))
    reg = json.load(open(T.REG)); V = dict((v['id'], v) for v in reg.get('verdicts', []) if v.get('id'))
    lie = []
    for r in rows:
        nl = r['new_look']
        if nl['state'].startswith('approved'):
            cs = [c['card'] for c in nl.get('cards', [])] + ([nl['card']] if nl.get('card') else [])
            if not cs or any((V.get(c) or {}).get('vote') != 'up' for c in cs):
                lie.append(r['name'])
    ok('R3 a row says approved only when every card it cites has his UP', not lie, ', '.join(lie[:8]))
    early = [r['name'] for r in rows if r['kind'] in T.UNAPPROVED_KINDS and r['new_look']['state'].startswith('approved')]
    ok('R4 no hair, hat or eyewear is approved before a card of its own passes', not early, ', '.join(early[:8]))
    dead = [r['name'] for r in rows if r['old'] == 'dead' and (r.get('batch') or 'never' not in r['new_look']['state'])]
    ok('R5 every dead shape is listed and never batched (%d dead)' % sum(1 for r in rows if r['old'] == 'dead'), not dead, ', '.join(dead[:8]))
    tmp = os.path.join(tempfile.mkdtemp(), 'rc.json')
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools/bohemia_character_the_roll_call.py')], env=dict(os.environ, ROLL_CALL_OUT=tmp),
                   check=True, stdout=subprocess.DEVNULL)
    fresh = json.load(open(tmp))
    stale = [a['name'] for a, b in zip(fresh['assets'], rows) if a != b] + (['row count'] if len(fresh['assets']) != len(rows) else [])
    ok('R6 the roll call re-derives row for row (tools/bohemia_character_the_roll_call.py)', not stale, ('stale: ' + ', '.join(stale[:8])) if stale else '')
    ok('R7 every PORTRAIT head piece maps onto a roll-call name', not fresh.get('portrait_unmapped'), '; '.join(fresh.get('portrait_unmapped') or []))
    print('=== THE ROLL CALL: %d passed, %d failed ===' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
