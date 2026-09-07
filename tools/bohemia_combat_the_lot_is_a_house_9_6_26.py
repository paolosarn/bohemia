#!/usr/bin/env python3
"""
BOHEMIA -- THE LOT BESIDE THE STREET IS SOMEBODY'S HOUSE  (COOK, [combat ground], 9/6/26)

THE ROW: "the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus: house,
yard, street, lot, cover that reads; a house with a backyard spans 1x2 (9/4 tile law 3d)".

MEASURED FIRST, IN THE FIGHT'S OWN REALM (tools/bohemia_combat_ground_probe_9_6_26.js), and
it corrected the guess I had from reading the source: the fight floor is NOT a flat fill --
100% of its 851 visible cells already draw approved art. What it is, is A STREET AND
NOTHING ELSE:

    lot 26.1%   road 26.1%   walk 17.4%   lane 8.7%   kerb/gutter/median 4.3% each

Half the board is road and pavement. The other quarter is `lot` -- one generic "somebody's
ground" tile standing in for every house, yard and back lot in Las Vegas. THERE IS NO HOUSE
KIND, NO YARD KIND AND NO WALL KIND ON THE COMBAT BOARD AT ALL. The law's clause 3d is
exactly about this gap: "A combat ground tile at that size is a real canvas on the
45-degree corpus: the house, the yard, the street, cover that reads."

*** AND IT COOKS NOTHING, WHICH IS THE PRECEDENT THIS ROW ALREADY HAS. ***
The street under the fight was not painted either: v94 (tools/bohemia_combat_street_tiles_
patch.py) lifted it out of the banks Paolo approved, and said so in capitals -- "NO NEW
GRAPHIC PIXELS ARE COOKED... the run and the fight now stand on the same street." The same
bank has everything this row needs, at exactly 44 px, the combat tile size:
    HOUSE   roof_slope, roof_ridge, roof_eave, roof_hipTL/TR/BL/BR
    YARD    yard_0, yard_1, yard_2, dirt
    WALL    wall_0, wall_1, wall_2, wall_base
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt -- approved 7/28 ("mark it approved"),
picked again 7/29 over the master palette, byte-locked in the visual constitution, and it is
what the RUN ships. So the fight stands on the same HOUSES the walked city does.

THE REFERENCE CHECK (the 9/4 standing duty) is this lane's own sheet, shipped 9/5 for this
exact row: reference/library/tile-ground/ (TG-01..TG-07). TAKEN, structurally:
  TG-02  "from above-at-an-angle a house is ROOF PLANES FIRST (two or four pitched planes,
         one ridge), then the front face; at combat range THE ROOF IS THE HOUSE'S GROUND
         READ, and its ridge line gives the tile its orientation."
         -> the house kind is ROOF ART, and it never spins: a ridge has a direction.
  TG-03  "a Vegas yard is GRAVEL OR HARDPAN inside a block wall -- no lawn in act 1 -- ...
         the wall runs the tile's full edge, so a yard tile's cover story is its WALL, not
         its middle."
         -> yard is yard/dirt, and the property line is a real WALL column, not a colour.
  TG-01  "a Vegas lot is barely bigger than its house -- 3,300-6,100 sq ft lots under
         2,000+ sq ft homes -- so the HOUSE TILE is mostly roof with a thin apron, and A
         FAT MARGIN OF GROUND AROUND A HOUSE IS A SCALE LIE."
         -> one house tile and one yard tile per property. Not one house in a field.
  3d     "a house with a big backyard is 1 by 2 tiles."
         -> that is the property: a house row and a yard row, paired.
NOT TAKEN THIS ROUND: TG-07's cover (a dead car, a dumpster, a porch pier breaking the
silhouette at the tile edge). Cover is PROPS on the ground rather than ground, the approved
wrecks live in a different bank, and half-placing them is worse than naming them next.

WHAT IT CHANGES, in one place: the lot band resolves to house / yard / wall per cell instead
of one flat `lot`. `streetKindAt` is untouched and still says `lot`; the paint loop refines
it exactly where it already refines the lot's variant index, so nothing else on the board
moves and the street is byte-identical.

    python3 tools/bohemia_combat_the_lot_is_a_house_9_6_26.py
"""
import base64, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SURFACES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']
KEY = "const COMBAT_B64='"
MARK = '__THE_LOT_IS_A_HOUSE__'
BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'

LIFT = {
    'house': ['roof_slope', 'roof_ridge', 'roof_eave',
              'roof_hipTL', 'roof_hipTR', 'roof_hipBL', 'roof_hipBR'],
    'yard':  ['yard_0', 'yard_1', 'yard_2', 'dirt'],
    'wall':  ['wall_0', 'wall_1', 'wall_2', 'wall_base'],
}

SUBKIND = """/* __THE_LOT_IS_A_HOUSE__ (COOK, [combat ground], 9/6) -- THE GROUND BESIDE THE STREET IS
   SOMEBODY'S HOUSE, NOT "a lot".
   MEASURED in the fight's own realm before anything changed: 26.1% of the visible board is
   the `lot` kind, one generic tile standing in for every house, yard and back lot in the
   valley, and the board had NO house, yard or wall kind at all. The tile law's clause 3d
   is about exactly this: "a combat ground tile at that size is a real canvas -- the house,
   the yard, the street, cover that reads."
   A PROPERTY IS ONE HOUSE AND ONE YARD, PAIRED, which is his own words ("a house with a
   big backyard is now one by two tiles big") and the reference's own number: a Vegas lot
   is barely bigger than its house (TG-01, 3,300-6,100 sq ft lots under 2,000+ sq ft homes),
   so a fat margin of ground around a house is a scale lie. House row, yard row, repeat.
   AND THE PROPERTY LINE IS A REAL WALL. TG-03: a Vegas yard is gravel or hardpan INSIDE A
   BLOCK WALL, and "the wall runs the tile's full edge, so a yard tile's cover story is its
   WALL, not its middle". Every fourth column of the lot band is that wall, running with the
   lots the way a side wall does.
   THE ROOF IS THE HOUSE. TG-02: from above-at-an-angle a house is roof planes first, and at
   combat range the roof IS the house's ground read. Which is why `house` is not in ST_SPIN:
   a ridge has a direction and a spun roof is a different house. */
function lotSubKind(wx,wy){
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';
}
"""

PAINT_OLD = """      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;"""
PAINT_NEW = """      let _sk=streetKindAt(wx);
      /* __THE_LOT_IS_A_HOUSE__ : refined exactly where the lot's variant is already
         refined, so the street above is byte-identical and only the lot band moves. */
      if(_sk==='lot') _sk=lotSubKind(wx,wy);
      const _sn=(STREET_B64[_sk]||[1]).length;"""

IDX_OLD = """      const _si=(_sk==='lot')?lotIdx(wx,wy,_sn):(h%_sn);"""
IDX_NEW = """      const _si=(_sk==='lot')?lotIdx(wx,wy,_sn):(h%_sn);   /* nothing resolves to 'lot' now, and the line stays so a future kind can */"""


def main():
    bank = json.load(open(os.path.join(ROOT, BANK), encoding='utf-8'))
    art = {t['id']: t['b64'] for t in bank['tiles'] if 'b64' in t}
    add = {}
    for kind, ids in LIFT.items():
        got = [art[i] for i in ids if i in art]
        if len(got) != len(ids):
            sys.exit('ABORT: %s is missing from the approved bank: %s'
                     % (kind, [i for i in ids if i not in art]))
        add[kind] = got

    touched = 0
    for rel in SURFACES:
        path = os.path.join(ROOT, rel)
        src = open(path, encoding='utf-8').read()
        if KEY not in src:
            print('  %s: no COMBAT_B64, skipped' % rel); continue
        i0 = src.index(KEY) + len(KEY); j0 = src.index("'", i0)
        combat = base64.b64decode(src[i0:j0]).decode('utf-8')
        if MARK in combat:
            print('  %s: already applied' % rel); continue

        for name, anchor in (('the paint loop', PAINT_OLD), ('the variant index', IDX_OLD),
                             ('the street bank', 'const STREET_B64=')):
            if combat.count(anchor) != 1:
                sys.exit('ABORT (%s): %s appears %d times, expected 1.'
                         % (rel, name, combat.count(anchor)))

        # 1. the three kinds, into the bank the fight already reads
        b0 = combat.index('const STREET_B64=') + len('const STREET_B64=')
        b1 = combat.index('};', b0) + 1
        bankjs = json.loads(combat[b0:b1])
        for k, v in add.items():
            if k in bankjs:
                sys.exit('ABORT (%s): the fight already has a "%s" kind; refusing to overwrite it.' % (rel, k))
            bankjs[k] = v
        combat = combat[:b0] + json.dumps(bankjs, separators=(',', ':')) + combat[b1:]

        # 2. the sub-kind, and the one line that uses it
        combat = combat.replace('function lotIdx(', SUBKIND + 'function lotIdx(', 1)
        combat = combat.replace(PAINT_OLD, PAINT_NEW, 1)
        combat = combat.replace(IDX_OLD, IDX_NEW, 1)
        # 3. gravel may spin; a roof and a wall never do (a ridge has a direction)
        combat = combat.replace("const ST_SPIN={road:1,walk:1,lot:1}",
                                "const ST_SPIN={road:1,walk:1,lot:1,yard:1}", 1)

        for needle, why in [(MARK, 'the marker is in the fight'),
                            ('function lotSubKind(wx,wy)', 'the sub-kind exists'),
                            ("if(_sk==='lot') _sk=lotSubKind(wx,wy);", 'the paint loop uses it'),
                            ('"house":[', 'the house kind reached the bank')]:
            if needle not in combat:
                sys.exit('ABORT (%s): %s -- not true after the substitution.' % (rel, why))

        b64 = base64.b64encode(combat.encode('utf-8')).decode('ascii')
        open(path, 'w', encoding='utf-8').write(src[:i0] + b64 + src[j0:])
        print('  %s: patched (%d kinds lifted, %d tiles, no pixels cooked)'
              % (rel, len(add), sum(len(v) for v in add.values())))
        touched += 1
    print('OK, %d surface(s) patched' % touched)


if __name__ == '__main__':
    main()
