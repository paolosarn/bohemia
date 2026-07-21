#!/usr/bin/env python3
"""
BOHEMIA GATES — one command, every law (7/16/26)

Nine gates got built today. Nine gates nobody will remember to run individually
is nine gates that do not exist. That is the exact failure this whole day was
about: laws enforced by memory are not enforced.

  python3 bohemia_gates.py            # everything
  python3 bohemia_gates.py --fast     # skip the pixel sweeps (~2s vs ~4min)
  python3 bohemia_gates.py --strict   # exit 1 if any gate fails

Run it before any absorption, any wrap, and after any engine edit. Green or it
does not ship.
"""
import subprocess, sys, time, os

# The repo layout (7/17/26): gates live in gates/, engine modules in engine/.
# Every gate runs with cwd = repo root, so data reads are repo-root-relative.
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO_ROOT)

# (name, argv, what it protects, slow?)
GATES = [
    ('GDD LINEAGE',    ['node', 'gates/gdd_gate.js'],
     'v2/v3/v4 are LIVE, v5 extends them', False),
    ('CARRY',          ['python3', 'gates/carry_gate.py', '.'],
     'the registry never eats a live file', False),
    ('ENGINE SYNC',    ['python3', 'gates/bohemia_sync_gate.py', '.'],
     'no module has two bodies', False),
    ('BUNDLE',         ['node', 'gates/bundle_gate.js'],
     'the bundle never lies about its md5s', False),
    ('GRAVEYARD',      ['python3', 'gates/bohemia_graveyard_gate.py', '.', '--strict'],
     'dead things stay dead', False),
    ('ENGINE TESTS',   ['node', 'engine/bohemia_graphics_tests.js'],
     'the graphics engine itself', False),
    ('SIDEWALK',       ['node', 'gates/sidewalk_gate.js'],
     'sidewalk sanctity', False),
    ('LINE COLOR',     ['node', 'gates/line_gate.js'],
     'yellow=direction, white=lane', False),
    ('STREET CONNECT', ['node', 'gates/street_connectivity_gate.js'],
     'no street dead-ends into empty lots', False),
    ('DISTRICT REG',   ['node', 'gates/district_registry_gate.js'],
     'every district type is catalogued', False),
    ('FLOORPLAN',      ['node', 'gates/floorplan_gate.js'],
     'every room reachable, buildings enterable', False),
    ('SUBURB MODULAR', ['node', 'gates/suburb_modular_gate.js'],
     'suburbs snap into 1x2 / 2x2, connected', False),
    ('COMMERCIAL',     ['node', 'gates/commercial_gate.js'],
     'corner plaza: stores + parking connected to the streets', False),
    ('DISTRICT KIT',   ['node', 'gates/district_kit_gate.js'],
     'the factory: shared machine every district extends', False),
    ('DISTRICT TAXONOMY', ['node', 'gates/district_taxonomy_gate.js'],
     'every district type files into one category', False),
    ('INDUSTRIAL',     ['node', 'gates/industrial_gate.js'],
     'warehouse yard on the kit: buildings + yard connected', False),
    ('MEDICAL',        ['node', 'gates/medical_gate.js'],
     'hospital campus: ER, ambulance, helipad, garage', False),
    ('SOLAR',          ['node', 'gates/solar_gate.js'],
     'solar farm: panels, inverters, substation, filled', False),
    ('PARK',           ['node', 'gates/park_gate.js'],
     'community park: field, diamond, courts, skate, dog run, filled', False),
    ('WASH',           ['node', 'gates/wash_gate.js'],
     'flood-control wash: channel + sewer tunnel mouth by the street, drivable', False),
    ('CEMETERY',       ['node', 'gates/cemetery_gate.js'],
     'memorial park: grave sections, chapel, mausoleum, columbarium, drivable', False),
    ('DRIVE-IN',       ['node', 'gates/drivein_gate.js'],
     'dead drive-in theater: screen tower, arced parking rows, snack bar, drivable', False),
    ('GOLF',           ['node', 'gates/golf_gate.js'],
     'dead golf course: holes (tee/fairway/green/bunker/pond), clubhouse, cart-path loop, drivable', False),
    ('STADIUM',        ['node', 'gates/stadium_gate.js'],
     'dead stadium: seating bowl, field, concourse, facade gates, light towers, parking, drivable', False),
    ('TRUCK STOP',     ['node', 'gates/truckstop_gate.js'],
     'dead gas/truck stop: overhead fuel canopy, pumps, store, wash, rig parking, pylon, drivable', False),
    ('SCHOOL',         ['node', 'gates/school_gate.js'],
     'dead school: E-building+gym, field+track, courts, playground, separate bus/drop-off/parking', False),
    ('FIRE STATION',   ['node', 'gates/firestation_gate.js'],
     'dead fire station: apparatus bays, red engines, apron, hose tower, drive-through pull-out', False),
    ('SWAP MEET',      ['node', 'gates/swapmeet_gate.js'],
     'dead swap meet: canopy stall rows, aisles, market hall, gravel parking — the barter stage', False),
    ('SELF-STORAGE',   ['node', 'gates/storage_gate.js'],
     'dead looted storage: unit rows, roll-up doors, pried-open units, drive aisles, fortress fence', False),
    ('WALKABLE LAND',  ['node', 'gates/walkable_gate.js'],
     'no district is mostly parking/driveway: content dominates pavement (vehicular venues exempt)', False),
    ('GARAGE',         ['node', 'gates/garage_gate.js'],
     'parking garage interior: multi-deck, ramps, 3D reachable from the entrance', False),
    ('CRYPT',          ['node', 'gates/crypt_gate.js'],
     'mausoleum crypt interior: vault banks, altar, entrance, footprint-exact', False),
    ('TILE SPEC',      ['node', 'gates/tilespec_gate.js'],
     'every district legend is complete — no undocumented tile ships', False),
    ('WORLD MODEL',    ['node', 'gates/world_gate.js'],
     'one API addresses valley down to a room', False),
    ('TAN WALL',       ['node', 'gates/tan_gate.js'],
     '85/15 tan, independent of weathering', False),
    ('ITEM SCALE',     ['node', 'gates/scale_gate.js'],
     "848 flags resolve", False),
    ('LIGHT REGISTRY', ['node', 'gates/lightreg_gate.js'],
     'dark is the default, circuits decide', False),
    ('PATROL',         ['node', 'gates/patrol_gate.js'],
     'owners patrol what they light', False),
    ('SLICE V11',      ['node', 'gates/test_v11.js'],
     'occupancy, beat, world clock', False),
    ('MUSIC',          ['node', 'gates/music_gate.js'],
     'screech law, voices exist, fresh-batch variety', False),
    ('COMBAT POOL',    ['node', 'gates/combat_pool_gate.js'],
     'faction-tagged songs enter the combat pool with their voices', False),
    ('COMBAT LAB',     ['node', 'gates/combat_lab_gate.js'],
     'beat-tactics lab: dial-gated damage, occupancy, 120, verdict UI', False),
    ('COMBAT ANIM',    ['node', 'gates/combat_anim_gate.js'],
     'combat moves b13: crouch lived, rise/drop, gun-walk, swings, shove/topple read', False),
    ('OPEN COAT',      ['node', 'gates/open_coat_gate.js'],
     'jackets/coats open in front, clothes show underneath', False),
    ('HOODIE',         ['node', 'gates/hood_gate.js'],
     'hood covers neck+carve, crew keeps its hole, back hood real', False),
    ('HEADWEAR',       ['node', 'gates/hat_gate.js'],
     'hats sit on the skull, never the eyes/body, directional', False),
    ('ACCESSORY',      ['node', 'gates/acc_gate.js'],
     'zone-locked: masks below the eyes, shades on them, gloves/belt/scarf', False),
    ('CLOTH STRUCT',   ['node', 'gates/structure_gate.js'],
     'structure-not-color: jacket/poncho/tall-boot/rolled/gear are real shapes', False),
    ('LIFE',           ['node', 'gates/life_gate.js'],
     'agents homed+scheduled on the world model, occupancy, day shape', False),
    ('DRESS',          ['node', 'gates/dress_gate.js'],
     'agents wear only the canon wardrobe, bank fresh, tables empty', False),
    ('ECONOMY',        ['node', 'gates/economy_gate.js'],
     'conservation, monotone scarcity pricing, grounded needs', False),
    ('POPULATION',     ['node', 'gates/population_gate.js'],
     'two-plane sim: census === bodies, offline plane agrees with online', False),
    ('MEMORY',         ['node', 'gates/memory_gate.js'],
     'witnesses: clarity decays, familiarity holds, missing-persons answerable', False),
    ('DEVIATION',      ['node', 'gates/deviation_gate.js'],
     'events bend a life, never break it: expiry required, cap held, re-convergence', False),
    ('CITY TAB',       ['node', 'gates/city_tab_gate.js'],
     'the CITY tab: embedded modules byte-locked to canon, skeleton-as-itself', False),
    ('CITY EDIT',      ['node', 'gates/cityedit_gate.js'],
     'city-builder verbs: skeleton sacred, demolish-to-desert, canon builds only', False),
    ('QUESTBOOK',      ['python3', 'gates/questbook_gate.py'],
     'v2 files are implementable, numbers audited', False),
    ('ART 45',         ['python3', 'gates/art_45_gate.py'],
     'original art is three-quarter view, never flat', False),
    ('LEAF PIXEL',     ['python3', 'gates/bohemia_leaf_gate.py', '--strict'],
     'structure frozen in every clip', True),
    ('PURITY',         ['python3', 'gates/bohemia_purity_gate.py'],
     'purple is the Amalgamation alone', True),
]

def run(argv):
    try:
        p = subprocess.run(argv, capture_output=True, text=True, timeout=1800)
        return p.returncode, (p.stdout or '') + (p.stderr or '')
    except FileNotFoundError:
        return 127, 'gate file missing: ' + argv[-1]
    except subprocess.TimeoutExpired:
        return 124, 'timed out'

def summarize(name, out):
    """One line that says what actually happened, not just pass/fail."""
    for line in out.split('\n'):
        l = line.strip()
        if 'ENGINE SYNC LAW HOLDS' in l or 'VIOLATED' in l: return l
        if l.startswith('=== ') and ('passed' in l or 'FAIL' in l): return l.strip('= ')
        if 'pass /' in l: return l
        if 'LIVE REFERENCES' in l: return l
        if 'clips checked' in l: return l
        if 'images checked' in l: return l
    return out.strip().split('\n')[-1][:70] if out.strip() else ''

def main():
    fast = '--fast' in sys.argv
    strict = '--strict' in sys.argv
    print('=' * 78)
    print('BOHEMIA GATES')
    print('=' * 78)
    failed = []
    t0 = time.time()
    for name, argv, what, slow in GATES:
        if fast and slow:
            print('  %-15s SKIP     %s' % (name, what))
            continue
        t = time.time()
        rc, out = run(argv)
        ok = (rc == 0)
        if not ok:
            failed.append(name)
        print('  %-15s %-8s %-38s %5.1fs' % (name, 'GREEN' if ok else 'FAIL', what, time.time() - t))
        s = summarize(name, out)
        if s:
            print('                   %s' % s[:88])
        if not ok:
            for line in out.split('\n'):
                if 'FAIL' in line or 'VIOLAT' in line or 'Error' in line:
                    print('                   > %s' % line.strip()[:88])
    print('=' * 78)
    if failed:
        print('  %d GATE(S) FAILED: %s   (%.0fs)' % (len(failed), ', '.join(failed), time.time() - t0))
    else:
        print('  ALL GATES GREEN   (%.0fs)' % (time.time() - t0))
    return 1 if (failed and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
