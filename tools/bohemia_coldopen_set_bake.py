#!/usr/bin/env python3
"""BOHEMIA COLD OPEN SET -- the dressing for the Act 1 match-cut, baked from
APPROVED art only.

REUSE CHECK (REUSE-FIRST, Paolo 7/22, "check out the approved assets first
before cooking"):
  OPENED   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt -- 480 interior tiles, every
           one carrying a Paolo UP verdict from the Great Sweep
           (banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt). Read its buckets
           floors / walls / windows / furniture / light / clutter and rendered
           contact sheets of all six before choosing.
  USED     12 tiles, byte-identical, no recolour, no redraw, no scaling baked
           in. Their sha256 travels with them so the gate can prove they are
           the bank's pixels and not somebody's edit.
  COOKED   NOTHING. This tool draws zero pixels. An art freeze is on and the
           cold open does not need one new pixel to play -- the family table
           was already in the bank.

WHY THESE TWELVE. The 7/19 locked shape is one room seen twice: "the SAME
table, ~10 years later, now in a dingy post-apocalypse house". So the set is
built as ONE room with a BEFORE and AFTER dressing, and the pieces that must
not change (floor, wall, table, chair) are ONE tile used in both eras. What
changes is what ten years actually changes: the window gets boarded, the
flowers become a lantern, the plates become a can. That is the whole apocalypse
told in three props, which is what the match-cut is for.

Excluded on purpose: anything from the pool's blood/bodies packs. NO DAMAGE
BEFORE THE DIAL, and the pool's own law says bodies are a story Paolo places.

  python3 tools/bohemia_coldopen_set_bake.py
Writes: engine/bohemia_coldopen_set.js
Gate:   gates/coldopen_gate.js
"""
import base64
import hashlib
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(ROOT, 'banks', 'BOHEMIA_INTERIOR_POOL_7_26_26.txt')
OUT = os.path.join(ROOT, 'engine', 'bohemia_coldopen_set.js')

# name -> (bucket, pack, idx, what it is doing in the scene)
PICKS = [
    # *** PAOLO 8/11, ON SEEING v1: "The house looked like some medieval japanese
    # shit." He was right and the cause was one decision: orange vertical wood
    # planks on the wall AND the floor. Vertical timber on every surface reads
    # shoji, temple, tea house -- anywhere but Nevada.
    #
    # THE REALISTIC ANSWER IS ALSO THE RIGHT-LOOKING ONE (REALISM FIRST). A Las
    # Vegas house is STUCCO AND TILE: exterior and interior walls skim-coated
    # pale, and hard tile floors instead of carpet because the Mojave runs 40C+
    # and tile is what people actually put down there. So the room is pale
    # plaster walls over a grey-tan tile floor, with a baseboard drawn where they
    # meet -- and a baseboard is the single cheapest thing that says "somebody's
    # house" instead of "a room in a dungeon".
    # CHOSEN BY RENDERING ALL 48 WALLS AND ALL 28 FLOORS AT FULL SIZE AND
    # LOOKING. The first attempt at this fix was picked off a thumbnail sheet and
    # was WRONG TWICE: 'Wall tiles (1)' 1 is plaster PEELING OFF BRICK and
    # 'Floor tiles (1)' 5 is mossy cobblestone, so v2 traded a Japanese temple for
    # a dungeon. A tile you have not looked at full size is a tile you have not
    # chosen (VERIFY ON THE REAL SURFACE, in spirit: look at the pixels).
    ('wall',      'walls',     'Wall tiles (1)',                     0,
     'flat pale skim-coat plaster, hairline cracks, NO masonry showing through. '
     'The nearest thing this bank has to American drywall, and cracked stucco is '
     'what Vegas actually looks like. Same both eras; the room is the constant.'),
    ('floor',     'floors',    '1. Cracked contrete tiles',          1,
     'a grid of square hard tiles. Vegas floors are tile, not carpet, because '
     'the Mojave runs 40C+ -- the realistic answer and the one that killed the '
     'temple read in the same pick.'),
    ('table',     'furniture', 'Furniture and fixtures',             7,
     'THE TABLE. Same tile both eras. "The SAME table, ~10 years later" is the beat.'),
    ('chair',     'furniture', 'Furniture and fixtures',            16,
     'a seat. Five of them before, and the same five after with one of them empty.'),
    ('window_on', 'windows',   '5. Windows and broken glass',       17,
     'shuttered window, frame intact -- the pre-collapse wall.'),
    ('window_off','windows',   '5. Windows and broken glass',        6,
     'the SAME window boarded over. One tile swap carries ten years.'),
    ('lantern',   'light',     '18. Light sources and fire barrels', 13,
     'hurricane lantern. The after-table has no ceiling light; this is the light.'),
    ('plate',     'clutter',   'Food, drink and cafe props',         2,
     'a plate of food. The dinner that is getting cold.'),
    ('soup',      'clutter',   'Food, drink and cafe props',        12,
     'a bowl. Set for the child who is arguing about vegetables.'),
    ('greens',    'clutter',   'Food, drink and cafe props',        15,
     'THE GREEN ONES. Her line points at something the player can see on the table.'),
    ('flowers',   'clutter',   'Food, drink and cafe props',        38,
     'a vase of flowers, centre of the table. Gone after the cut, and nobody says so.'),
    ('can',       'clutter',   'Food, drink and cafe props',        35,
     'a jar. What is on the table ten years later.'),
]


def main():
    with open(POOL, 'r', encoding='utf-8') as f:
        pool = json.load(f)

    index = {}
    for bucket, items in pool['buckets'].items():
        for it in items:
            index[(bucket, it['pack'], it['idx'])] = it

    out, missing = [], []
    for name, bucket, pack, idx, why in PICKS:
        it = index.get((bucket, pack, idx))
        if not it:
            missing.append(name)
            continue
        raw = base64.b64decode(it['b64'])
        out.append({
            'name': name, 'bucket': bucket, 'pack': pack, 'idx': idx, 'why': why,
            'sha256': hashlib.sha256(raw).hexdigest(),
            'bytes': len(raw),
            'b64': it['b64'],
        })
    if missing:
        raise SystemExit('missing from the bank: ' + ', '.join(missing))

    body = ',\n'.join(
        '  {name:%s,bucket:%s,pack:%s,idx:%d,sha256:%s,bytes:%d,why:%s,\n   b64:%s}'
        % (json.dumps(t['name']), json.dumps(t['bucket']), json.dumps(t['pack']),
           t['idx'], json.dumps(t['sha256']), t['bytes'], json.dumps(t['why']),
           json.dumps(t['b64']))
        for t in out)

    js = '''/* BOHEMIA COLD OPEN SET -- generated by tools/bohemia_coldopen_set_bake.py.
   DO NOT HAND-EDIT. Re-run the tool.

   %d approved interior tiles, byte-identical out of
   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (every tile in that pool carries a
   Paolo UP verdict from the Great Sweep). Each carries the sha256 of its own
   PNG bytes, so gates/coldopen_gate.js can re-open the bank and prove these are
   the approved pixels rather than something a lane redrew during an art freeze.

   NOT NEW ART. Nothing here was cooked, recoloured, or scaled at bake time. */
(function (root) {
  var TILES = [
%s
  ];
  var BY = {};
  TILES.forEach(function (t) { BY[t.name] = t; t.src = 'data:image/png;base64,' + t.b64; });

  /* THE ROOM IS ONE ROOM, DRESSED TWICE. Anything not named here is identical
     across the cut on purpose -- that is what makes it a match-cut and not a
     scene change. */
  var ERA = {
    pre_collapse:  { window: 'window_off', dress: ['flowers', 'plate', 'soup', 'greens'],
                     warm: '#ffb45a', amb: 0.00, note: 'lit, laid for dinner, everybody home' },
    post_collapse: { window: 'window_off', dress: ['can', 'lantern'],
                     warm: '#8ea0b8', amb: 0.62, note: 'same room, one lamp, one chair empty' },
  };
  /* pre_collapse uses the intact shuttered window; written separately so the
     swap is one named field a reader can find. */
  ERA.pre_collapse.window = 'window_on';

  var API = { TILES: TILES, BY: BY, ERA: ERA, VERSION: 'coldopen-set-1.0.0',
              SOURCE: 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaColdOpenSet = API;
})(typeof window !== 'undefined' ? window : globalThis);
''' % (len(out), body)

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)
    print('COLD OPEN SET: %d approved tiles baked (%.0f KB)'
          % (len(out), len(js) / 1024.0))
    for t in out:
        print('  %-12s %-34s idx %-3d %5d B  %s' % (t['name'], t['pack'], t['idx'],
                                                    t['bytes'], t['sha256'][:12]))
    print('  -> ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
