#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the reference twin]: reference/art_bank/ by family, the twins the cook lanes read before
they draw (rule 82, Paolo 10/10: 'take inspiration from the assets we downloaded'; rule 82a: for tiles, props, cars,
streets and sidewalks the twin IS his approved pack tile).

This tool fills each family folder with (a) a SAMPLE of his approved pack tiles (verdict UP in
banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt), decoded from banks/BOHEMIA_HD_TILE_REPO_part1-4.txt at their own pixels,
enough to set the bar beside ours; and (b) pointers to the reference images the repo already holds for that family
(his Pocket City 2 shots, in their zoom-range department). COOK [the pack is the twin] owns extracting the WHOLE corpus;
this samples it and says so. Each folder gets a README naming its twin, its source and what is still owed.

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
AH-01 and AH-03; the approved asset index (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, the 7/27 shopping law).

usage: python3 tools/bohemia_direction_art_bank.py
"""
import json, os, base64, re, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'reference/art_bank')
PER = 12
FAMILIES = {
    'road':         ['1. Cracked street tiles', '1. Cracked contrete tiles', '6. Stone paths and roads'],
    'ground':       ['1. Ground Tiles', '7. Burnt ground tiles', '8. Burned Ground and fire marks', '2. Dirt path tiles', '3. Grass and ground tiles'],
    'prop':         ['9. Abandoned cards', '10. Abandoned cars', '15. Street props', '14. Trash and junk props', '3. Barricades and blockades', '17. Warning Signs and road props'],
    'settlement':   ['5. Roof tiles', '4. House wall tiles', '2. Broken building walls', '6. Chain link fences', '11. Fences and gates'],
}
REPO_REFS = {
    'map_tile':   ['reference/pocket_city_2/04_the_district_from_above.png', 'reference/pocket_city_2/05_the_whole_city_landscape.png'],
    'settlement': ['reference/pocket_city_2/03_a_block_and_a_landmark.png'],
    'character':  ['reference/pocket_city_2/01_closest_one_person_on_a_bench.png', 'reference/pocket_city_2/06_closest_landscape_a_man_walking.png'],
    'fight_board':['reference/pocket_city_2/02_a_bus_stop_and_a_speech_bubble.png'],
}
OWED = {
    'character': 'the runway twin (Rick Owens, Balenciaga, Bottega Veneta looks, his 9/21 names) as images: not in the repo, the hosts are blocked here; he sends them or Grok fetches them',
    'portrait': 'real-face references at portrait crop: not in the repo; he sends them or Grok fetches them',
    'phone': 'a real cracked iPhone photographed: not in the repo; he sends one',
}
slug = lambda s: re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')

ups = {}
for v in json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts']:
    if v.get('v') == 'UP': ups.setdefault(v['pack'], []).append(v['idx'])
packs = {}
for i in range(1, 5):
    packs.update(json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_HD_TILE_REPO_part%d.txt' % i)))['packs'])

index = {}
for fam in set(FAMILIES) | set(REPO_REFS) | set(OWED) | {'fight_board', 'map_tile'}:
    d = os.path.join(OUT, fam); os.makedirs(d, exist_ok=True)
    files = []
    for pack in FAMILIES.get(fam, []):
        if pack not in packs: continue
        idxs = [x for x in ups.get(pack, []) if x < len(packs[pack])][:max(1, PER // len(FAMILIES[fam]) + 1)]
        for x in idxs:
            t = packs[pack][x]
            fn = 'pack_%s_%03d.png' % (slug(pack), x)
            open(os.path.join(d, fn), 'wb').write(base64.b64decode(t['b64']))
            files.append({'file': fn, 'pack': pack, 'idx': x, 'w': t.get('w'), 'h': t.get('h'), 'approved': 'UP (7/13 sweep)'})
    for src in REPO_REFS.get(fam, []):
        files.append({'file': '../../../' + src, 'source': src, 'department': 'Pocket City 2: the zoom range (scale and density at that stop), never a style source'})
    index[fam] = {'files': files, 'owed': OWED.get(fam)}
    with open(os.path.join(d, 'README.md'), 'w') as f:
        f.write('# ART BANK: %s\n\nThe twin the cook lanes read before they draw (rule 82). Sampled by DIRECTION 10/10 '
                '(tools/bohemia_direction_art_bank.py); COOK [the pack is the twin] fills the whole corpus.\n\n' % fam.upper())
        for x in files: f.write('- %s  %s\n' % (x['file'], x.get('pack') or x.get('source')))
        if OWED.get(fam): f.write('\nOWED: %s\n' % OWED[fam])
        if not files and not OWED.get(fam): f.write('\n(built from the families above: see the twin sheet)\n')
json.dump(index, open(os.path.join(OUT, 'INDEX.json'), 'w'), indent=1)
print({k: len(v['files']) for k, v in index.items()})
