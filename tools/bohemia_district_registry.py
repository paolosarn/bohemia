#!/usr/bin/env python3
"""
BOHEMIA DISTRICT REGISTRY (Paolo 7/18/26: "do you have all the info of all the
types of buildings... for the procedural generation landmarks and shit?")

The engine enumerates 77 district/landmark types and places every one on the
overmap, but the info was scattered across a 748-line geography law + inline
code comments, and 10 types had no write-up at all. This tool consolidates it:
ONE catalog of all 77, each with what it is (real-Vegas grounding), where it
places, and its exact RENDER STATUS pulled live from the engine so the doc can
never drift from the code.

  python3 tools/bohemia_district_registry.py   # regenerates the registry .md

MECHANISM-MINE / CONTENTS-PAOLO'S: the descriptions below are the real-world
grounding for each type (a fire station is a fire station). Any Bohemia-specific
ruling the type still needs (ownership, faction, what spawns there) is flagged
[PENDING Paolo], never invented here.
"""
import json, os, subprocess, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md'

# --- render facts pulled LIVE from the engine (never hand-typed) ---
def engine_facts():
    js = (
        "const B=require('./engine/bohemia_overmap_bridge.js');"
        "const fs=require('fs');"
        "const src=fs.readFileSync('engine/bohemia_overmap.js','utf8');"
        "const pairs=[...src.match(/const DISTRICT=\\{([\\s\\S]*?)\\};/)[1]"
        ".matchAll(/([A-Z_]+):[ ]*.([a-z_]+)./g)].map(x=>x[2]);"
        "const P=require('./engine/bohemia_plotgen.js');"
        "const out={};"
        "for(const d of pairs){const r=B.recipeFor({district:d,quality:0.5,seed:1,x:0,y:0});"
        "out[d]=r?r.type:null;}"
        "console.log(JSON.stringify({order:pairs,recipe:out}));"
    )
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit('engine query failed:\n' + r.stderr)
    return json.loads(r.stdout)

# blockgen recipe families that actually BAKE to pixels today
BAKED_RECIPES = {'street', 'freeway', 'desert', 'mountain', 'intersection'}
# plot-interior routing (from the plotgen bridge)
PLOT_INDUSTRIAL = {'industrial', 'warehouse', 'railyard', 'storage'}
PLOT_COMMERCIAL = {'commercial', 'casino', 'mall', 'downtown', 'strip'}

# what each type IS (real-world grounding; district-string keyed).
# Kept factual. Reserved Bohemia lore is flagged, not filled.
DESC = {
 'mountain':   'The valley rim ranges (E+W borders, Paolo cardinal). Impassable rock.',
 'desert':     'Raw Mojave ground: the default lot before anything is built on it.',
 'strip':      'Las Vegas Blvd — the N-S resort corridor, mega-casinos strung along it.',
 'resort':     'A mega-resort block flanking the Strip (rooms + casino floor mass).',
 'mall':       'An enclosed shopping mall (big-box footprint, ring parking).',
 'downtown':   'Fremont / arts-district core at the Strip’s north end; dense urban grid.',
 'suburb':     'A walled residential tract — the bulk fabric of the valley.',
 'industrial':'Warehouse / light-industry flats (Sunrise, N Las Vegas belts).',
 'commercial': 'Strip-mall commercial: parking apron fronting a storefront band.',
 'dam':        'Hoover Dam — the SOUTH landmark, the way to Lake Mead.',
 'solar':      'The NORTH solar panel field (Paolo cardinal); real: valley solar.',
 'wash':       'Dry flood channel; the entrance to the storm/sewer world below.',
 'water':      'Lake Mead / Lake Las Vegas surface water.',
 'freeway':    'The "X": I-15 + US-95/515, grade-separated, breaks the grid.',
 'arterial':   'The mile-grid surface streets — the connective tissue of the city.',
 'beltway':    'The "C": the 215 ring road hugging the valley rim.',
 'park':       'A public park / greenspace lot.',
 'airport':    'Harry Reid Intl — runways + terminals (SE of the Strip).',
 'airbase':    'Nellis AFB — military airfield, NE valley.',
 'campus':     'A university campus (UNLV / CSN).',
 'rail':       'The rail line, border to border (freight spine).',
 'railyard':   'Rail marshalling yard — tracks, container flats.',
 'town':       'Boulder City — a self-contained town with its own street grid.',
 'medical':    'A hospital / medical district (Sunrise, UMC).',
 'interchange':'The Spaghetti Bowl — the I-15/US-95 stack interchange.',
 'golf':       'A golf course (large green plot, ringed by streets).',
 'gated':      'A gated master-planned community (walled, few entries).',
 'school':     'A K-12 school campus.',
 'casino':     'An off-Strip casino block (locals casinos).',
 'stadium':    'Allegiant Stadium — the domed football stadium.',
 'speedway':   'Las Vegas Motor Speedway — the oval track, far NE.',
 'convention': 'The LVCC convention center complex (halls + the Loop stop).',
 'waterpark':  'A water park (pools, slides, big footprint).',
 'minigp':     'A karting / mini-GP track.',
 'estate':     'Foothill estates — large-lot housing on the mountain borders.',
 'reclaim':    'The water reclamation plant (the 99% reuse loop terminus).',
 'landfill':   'The regional landfill (Apex).',
 'intake':     'The Lake Mead intake — "the straw" claiming the shoreline.',
 'substation': 'An electrical substation (grid node).',
 'cemetery':   'A cemetery / memorial ground.',
 'prison':     'A walled correctional facility.',
 'terminal':   'A bus / freight terminal.',
 'sphere':     'The Sphere — the spherical venue, a fixed landmark.',
 'boneyard':   'The Neon Boneyard — dead sign graveyard.',
 'chapel':     'A wedding chapel (the small-lot Vegas fixture).',
 'fort':       'Old Mormon Fort — the founding adobe site.',
 'basin':      'A flood-detention basin (ties into the storm system).',
 'ballpark':   'A ballpark (Cashman / Las Vegas Ballpark).',
 'swapmeet':   'A swap meet / open-air market lot.',
 'drivein':    'A drive-in theater lot.',
 'highroller':'The High Roller observation wheel.',
 'trailer':    'A trailer / RV park (rough-fabric housing).',
 'storage':    'Self-storage sprawl (near arterials).',
 'watertreat': 'A water treatment plant.',
 'reservoir':  'A covered water reservoir tank field.',
 'pumpstation':'A water pumping station.',
 'farm':       'Homestead farming — yard crops on private well/cistern.',
 'sign':       'The "Welcome to Fabulous Las Vegas" sign parcel.',
 'strat':      'The Stratosphere tower.',
 'datafort':   'The Data Fortress — the fiber-fed data center (born of Enron fiber).',
 'arsenal':    'The Arsenal — a fortified munitions/armory site. [Bohemia lore: PENDING Paolo]',
 'firestation':'A fire station.',
 'policestation':'A police station.',
 'jail':       'The city/county jail (holding, distinct from prison).',
 'courthouse': 'A courthouse / civic justice building.',
 'warehouse':  'A distribution warehouse (big shed + docks).',
 'truckstop':  'A highway truck stop (fuel + lot) on an approach.',
 'battery':    'A grid-scale battery storage yard.',
 'quarry':     'A rock quarry carving the approach hills.',
 'gypsum':     'The gypsum mine carving the rim (real: Blue Diamond).',
 'springs':    'The Springs Preserve — the valley’s original water source.',
 'luxor':      'The Luxor pyramid — a fixed Strip landmark.',
 'fueldepot':  'A fuel tank-farm depot.',
 'granary':    'A grain silo / granary.',
 'library':    'A public library branch.',
 'radio':      'A radio / broadcast station + antenna.',
 'robofactory':'A robotics factory. [Bohemia lore: PENDING Paolo]',
}

def main():
    facts = engine_facts()
    order, recipe = facts['order'], facts['recipe']
    missing_desc = [d for d in order if d not in DESC]
    if missing_desc:
        raise SystemExit('DESC missing for: ' + ' '.join(missing_desc))

    def plot_kind(d):
        if d in PLOT_INDUSTRIAL: return 'industrial'
        if d in PLOT_COMMERCIAL: return 'commercial'
        return 'suburb'  # the plotgen bridge default

    def status(d):
        rt = recipe.get(d)
        if rt is None:
            return 'PENDING', rt
        if rt in BAKED_RECIPES:
            return 'BAKES', rt
        return 'RECIPE', rt   # engine grid exists, no bake/art pool yet

    rows = []
    for d in order:
        st, rt = status(d)
        rows.append((d, st, rt, DESC[d]))

    n = len(order)
    baked = [r for r in rows if r[1] == 'BAKES']
    recipe_only = [r for r in rows if r[1] == 'RECIPE']
    pending = [r for r in rows if r[1] == 'PENDING']

    L = []
    L.append('# BOHEMIA DISTRICT REGISTRY (7/18/26)')
    L.append('')
    L.append('The complete catalog of every procedural district/landmark type. '
             'GENERATED from the engine (tools/bohemia_district_registry.py) — the '
             'render status is read live from bohemia_overmap_bridge.js, so this '
             'file can never drift from the code. Regenerate the same turn any '
             'district is added; gates/district_registry_gate.js fails if a type '
             'in the enum is missing here.')
    L.append('')
    L.append('## THE COUNT')
    L.append('- **%d** district types defined + placed on the 96x96 overmap.' % n)
    L.append('- **%d BAKES**: has a render recipe that bakes to pixels today '
             '(street / freeway / desert / mountain families).' % len(baked))
    L.append('- **%d RECIPE**: engine grid recipe exists, art pool / bake not '
             'built yet (wash, solar, farm, airfield).' % len(recipe_only))
    L.append('- **%d PENDING**: placed on the map, but the fine-layer template is '
             '[PENDING Paolo] (MECHANISM-MINE / CONTENTS-PAOLO’S). These render as '
             'their desert lot until a ruling + art land.' % len(pending))
    L.append('')
    L.append('RENDER STATUS LEGEND: **BAKES** = you can see it in a slice now · '
             '**RECIPE** = generates a grid, needs art to bake · **PENDING** = '
             'reserved for Paolo’s ruling, no recipe yet.')
    L.append('')

    def table(title, group):
        L.append('## %s (%d)' % (title, len(group)))
        L.append('')
        L.append('| type | status | recipe | what it is |')
        L.append('|---|---|---|---|')
        for d, st, rt, desc in group:
            L.append('| `%s` | %s | %s | %s |' % (d, st, rt or '—', desc))
        L.append('')

    table('BAKES — rendered to pixels today', baked)
    table('RECIPE — grid exists, art pending', recipe_only)
    table('PENDING PAOLO — placed, fine-layer reserved', pending)

    L.append('## PLOT INTERIORS (engine/bohemia_plotgen.js)')
    L.append('')
    L.append('Three plot kinds have interior layouts (all with buildings still '
             'EMPTY by design, awaiting building art): **suburb** (walled tract + '
             'gates), **commercial** (parking fronting storefronts), **industrial** '
             '(drive apron + shed pads + fence). The plotgen bridge routes: '
             'industrial/warehouse/railyard/storage → industrial; commercial/casino/'
             'mall/downtown/strip → commercial; everything else → suburb.')
    L.append('')
    L.append('## WHERE THE DEEPER CANON LIVES')
    L.append('- laws/BOHEMIA_ADDENDUM_VEGAS_GEOGRAPHY_7_4_26.md — the landmark '
             'lore + placement rationale (the richest source).')
    L.append('- laws/BOHEMIA_ADDENDUM_CELL_IS_PLOT_WALLED_SUBURBS_7_14_26.md — '
             'cell = plot, wall to wall.')
    L.append('- laws/BOHEMIA_ADDENDUM_DISTRICT_MERGE_LAW_7_14_26.md — same-type '
             'cells merge up to 2x2.')
    L.append('- engine/bohemia_overmap.js (skeleton + proceduralDistrict) — the '
             'live placement rules.')
    L.append('')
    L.append('## STILL OWED PAOLO (the honest gap)')
    L.append('The %d PENDING types need, per type, your ruling on what they ARE in '
             'Bohemia (who owns them, what spawns there) and then art. `arsenal` and '
             '`robofactory` carry game-specific lore that is entirely your call. '
             'Everything above the PENDING line already generates.' % len(pending))
    L.append('')

    open(OUT, 'w').write('\n'.join(L))
    print('district registry -> %s' % OUT)
    print('  %d types: %d BAKES, %d RECIPE, %d PENDING'
          % (n, len(baked), len(recipe_only), len(pending)))

if __name__ == '__main__':
    main()
