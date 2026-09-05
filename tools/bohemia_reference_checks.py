#!/usr/bin/env python3
"""THE REFERENCE REGISTRY (9/5/26, DIRECTION lane — VAMILY row
REFERENCE-BESIDE-EVERY-CANDIDATE, under the 9/4 compare law).

The compare law, clause 4: THE REFERENCE SITS BESIDE THE CANDIDATE WHEN HE
JUDGES. This tool derives the registry the VOTE page reads — one entry per
judgeable item saying what that item was compared against, in his words or
the cook's own, or an honest UNRECORDED when it was cooked before the law.

DERIVED, NEVER TYPED (the house rule): the icon references are read out of
the hero factory's own per-district match prose (the LABEL dict every bake
maintains — it names Apex Regional, Predock's library, the Las Vegas Wash),
and future per-item references land in the SIDECAR file, which DIRECTION or
a cook writes at cook time and which always beats the derived prose:

    records/BOHEMIA_REFERENCE_SIDECAR.json
      { "<item id>": { "source": "what it was compared to, one plain
        sentence", "taken": "which structural rules came from it",
        "img": "optional repo path to an in-repo comparison image" } }

REUSE CHECK: cooks no pixels; reads tools/bohemia_district_hero_factory.py
(ast, never exec) and the two candidate banks for item ids only.

  python3 tools/bohemia_reference_checks.py
    -> records/BOHEMIA_REFERENCE_CHECKS.json
"""
import ast
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

OUT = 'records/BOHEMIA_REFERENCE_CHECKS.json'
SIDECAR = 'records/BOHEMIA_REFERENCE_SIDECAR.json'

# 1. the hero factory's own match prose (ast so a bake in progress cannot run)
src = open('tools/bohemia_district_hero_factory.py', encoding='utf8').read()
label = {}
for node in ast.walk(ast.parse(src)):
    if isinstance(node, ast.Assign) and getattr(node.targets[0], 'id', '') == 'LABEL':
        label = ast.literal_eval(node.value)
        break

refs = {}
for d, prose in label.items():
    refs[d] = {'source': prose, 'kind': 'icon',
               'derived_from': 'tools/bohemia_district_hero_factory.py LABEL'}

# 2. the face/haircut candidates: honest UNRECORDED unless the sidecar says
#    otherwise — they were cooked before the 9/4 law and pretending they had
#    a reference would be the lie the law names
FACES = 'banks/BOHEMIA_FACE_CANDIDATES_8_28_26.txt'
if os.path.exists(FACES):
    for x in json.load(open(FACES, encoding='utf8')).get('faces', []):
        refs.setdefault(x['id'], {
            'source': None, 'kind': x.get('kind') or 'face',
            'unrecorded': 'cooked before the compare rule (9/4); new batches must name one'})

# 3. the sidecar beats everything
if os.path.exists(SIDECAR):
    for k, v in json.load(open(SIDECAR, encoding='utf8')).items():
        base = refs.get(k) or {}
        base.update(v)
        base.pop('unrecorded', None)
        refs[k] = base

json.dump({'law': 'COMPARE EVERY PIECE OF ART TO THE WORLD 9/4/26, clause 4',
           'refs': refs}, open(OUT, 'w', encoding='utf8'), indent=0)
n_rec = sum(1 for v in refs.values() if v.get('source'))
print('wrote %s: %d items, %d with a reference, %d honestly unrecorded'
      % (OUT, len(refs), n_rec, len(refs) - n_rec))
