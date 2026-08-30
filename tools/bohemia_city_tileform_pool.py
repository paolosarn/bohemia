#!/usr/bin/env python3
"""THE GREAT TILE MIGRATION, PHASE 1 (8/28/26, ART lane — board row 107).

WHY THIS EXISTS. Measured 8/27 (records/BOHEMIA_FINDING_THE_TILES_RIDE_A_
SURFACE_NOBODY_WALKS_8_27_26.md): every exterior tile family the ART lane
wired since 8/8 draws only in the legacy run slice, which the alpha stopped
downloading on 8/21. The walked city page resolves every kit cell to its
legend entry and already routes ground cells to approved art pools by NAME
(the __PROPER_SIDEWALKS__ table), so the migration is a REGISTRATION, not a
rewrite: this tool packages the approved tileform GROUND families as pools;
the page merges them into SA_IMG and the name table points the named cells
at them.

THE SHAPE FOLLOWS THE FLOORS PRECEDENT (main ad42288): a separate script
file with its own carried-forward tag, NEVER a byte into the blocking chunk
-- the LATE ART gate's budget is already spent and this adds zero to it.

PHASE 1 = FLAT GROUND ONLY, the layer the pool table already serves
(tl.layer 'ground'). Structures (hall roofs, cooling units, tanks, boxcars)
are Phase 2 -- they need the prop/post path, not a ground blit.

REUSE CHECK: opens ONLY approved tileform banks (each carries its own
APPROVED law line, written under EVERYTHING IS A THUMB 8/9); no pixel is
cooked here.

  python3 tools/bohemia_city_tileform_pool.py
    -> slices/BOHEMIA_CITY_TILEFORMS.js
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

OUT = 'slices/BOHEMIA_CITY_TILEFORMS.js'

# pool name -> (bank file, [tile names in order])
POOLS = {
    # the landfill's dominant surface (TF-ART-026)
    'tf_wf':  ('banks/tileforms/TF-ART-026_CANDIDATES_8_27_26.json',
               ['wf_0', 'wf_1', 'wf_2']),
    # the drought bed / hardpan / dry basin floors (TF-ART-025)
    'tf_bed': ('banks/tileforms/TF-ART-025_CANDIDATES_8_26_26.json',
               ['bed_0', 'bed_1', 'bed_2']),
    # the pit floors (TF-ART-025)
    'tf_qf':  ('banks/tileforms/TF-ART-025_CANDIDATES_8_26_26.json',
               ['qf_0', 'qf_1', 'qf_2']),
    # the civic plaza paving and the plinth (TF-ART-029)
    'tf_pz':  ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json',
               ['pz_0', 'pz_1', 'pz_2']),
    'tf_tp':  ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json',
               ['tp_0', 'tp_1', 'tp_2']),
    # the wash channel: invert (plain + stained take the plain three here --
    # the centreline stain needs the run-axis pass, Phase 2) and bank
    'tf_iv':  ('banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json',
               ['iv_p_0', 'iv_p_1']),
    'tf_bk':  ('banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json',
               ['bk_h_0', 'bk_h_1', 'bk_v_0', 'bk_v_1']),
    # the police station's xeriscape beds (TF-ART-024)
    'tf_ls':  ('banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json',
               ['ls_mulch_0', 'ls_mulch_1', 'ls_mulch_2']),
    # the reservoir's roof deck plate (TF-ART-020 volume) -- kind 'ground'
    # on the buried tank, which is why it rides in Phase 1
    'tf_tr':  ('banks/tileforms/TF-ART-020_ROOF_OVERFLOW_VOLUME_8_25_26.json',
               ['tr_deck_0', 'tr_deck_1', 'tr_deck_2']),
    # PHASE 2B: the structure-layer families, served through c.sPool (the
    # approved-pool override ahead of the procedural sTex kinds)
    'tf_dh':  ('banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json',
               ['dh_0', 'dh_1', 'dh_2']),
    'tf_gr':  ('banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json',
               ['gr_0', 'gr_1', 'gr_2']),
    'tf_cu':  ('banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json',
               ['cu_0', 'cu_1']),
    'tf_pt':  ('banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json',
               ['pt_tank_0', 'pt_tank_1']),
    'tf_ibh': ('banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json',
               ['ib_h_0', 'ib_h_1']),
    'tf_ibv': ('banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json',
               ['ib_v_0', 'ib_v_1']),
    # PHASE 2B: the wash's centreline stain (axis pieces) and the planter
    # (lone box vs bed soil; the bed's edge rims are a recorded debt - one
    # texture per cell here, no overlay pass)
    'tf_ivh': ('banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json',
               ['iv_h_0', 'iv_h_1']),
    'tf_ivv': ('banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json',
               ['iv_v_0', 'iv_v_1']),
    'tf_pp':  ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json',
               ['pp_0', 'pp_1']),
    'tf_pps': ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json',
               ['pp_soil_0', 'pp_soil_1', 'pp_soil_2']),
    # PHASE 2C: the wash's armor rock, which the walked world also names as
    # the mountain's talus - dumped rock and rockfall are the same read
    'tf_rip': ('banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json',
               ['rip_0', 'rip_1', 'rip_2']),
    # PHASE 2D: OVERLAY pools - transparent PNGs drawn OVER a cell's base
    # ground by the baker's gArtOver hook. Direction-critical pools ship as
    # ONE-TILE pools because saTex's weather-rarity shuffle permutes any
    # pool longer than seven, and a permuted bearing points at nothing.
    'tf_gw0': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_0']),
    'tf_gw1': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_1']),
    'tf_gw2': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_2']),
    'tf_gw3': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_3']),
    'tf_gw4': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_4']),
    'tf_gw5': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_5']),
    'tf_gw6': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_6']),
    'tf_gw7': ('banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json', ['gw_7']),
    'tf_ppn': ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json', ['pp_rim_n']),
    'tf_pps_': ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json', ['pp_rim_s']),
    'tf_ppe': ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json', ['pp_rim_e']),
    'tf_ppw': ('banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json', ['pp_rim_w']),
}

# PHASE 2A: the railyard's rolling stock through the post path. The city's
# vehicle masters are ALL NOSE-UP (long axis vertical - the stall draw rotates
# a wide stall a quarter turn), so the top-down boxcar/loco sprites rotate a
# quarter here to enter the same contract.
PROPS = {
    'boxcar': ('banks/tileforms/TF-ART-027_CANDIDATES_8_27_26.json',
               ['boxcar_0', 'boxcar_1', 'boxcar_2']),
    'loco':   ('banks/tileforms/TF-ART-027_CANDIDATES_8_27_26.json',
               ['loco_box']),
}

import base64, io
from PIL import Image

props_js = {}
for fam, (path, names) in sorted(PROPS.items()):
    d = json.load(open(path))
    assert str(d.get('law', '')).startswith('APPROVED'), path
    by = {t['name']: t['b64'] for t in d['tiles']}
    arr = []
    for n in names:
        im = Image.open(io.BytesIO(base64.b64decode(by[n]))).convert('RGBA')
        im = im.transpose(Image.ROTATE_90)          # nose-up: long axis vertical
        buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
        arr.append(base64.b64encode(buf.getvalue()).decode())
    props_js[fam] = arr

pools_js, total, report = {}, 0, []
for pool, (path, names) in sorted(POOLS.items()):
    d = json.load(open(path))
    law = str(d.get('law', ''))
    assert law.startswith('APPROVED'), '%s: bank law line is not APPROVED' % path
    by = {t['name']: t['b64'] for t in d['tiles']}
    arr = []
    for n in names:
        assert n in by, '%s missing %s' % (path, n)
        arr.append(by[n])
        total += len(by[n])
    pools_js[pool] = arr
    report.append('%s: %d tiles from %s' % (pool, len(arr), os.path.basename(path)))

body = json.dumps(pools_js)
pbody = json.dumps(props_js)
open(OUT, 'w', encoding='utf8').write(
    '/* THE GREAT TILE MIGRATION, PHASE 1 (8/28/26, ART lane, board row 107).\n'
    '   Approved tileform GROUND pools for the walked city page. Generated by\n'
    '   tools/bohemia_city_tileform_pool.py -- edit the tool, never this file.\n'
    '   Loads late (own tag, floors precedent, main ad42288); the page merges\n'
    '   these into SA_IMG and the __PROPER_SIDEWALKS__ name table routes the\n'
    '   named cells here. */\n'
    'window.TF_POOL_B64=' + body + ';\n'
    'window.TF_PROP_B64=' + pbody + ';\n'
    'if(window.__tfPoolReady)window.__tfPoolReady();\n')
print('wrote %s: %d ground pools + %d prop families, ~%d KB of approved pixels'
      % (OUT, len(pools_js), len(props_js), (total + sum(len(b) for a in props_js.values() for b in a)) // 1024))
for r in report:
    print('  ' + r)
