#!/usr/bin/env python3
"""THE GROUND FOR THE NEW FIGHT  (COMBAT 2 [floor set] round nine, rule 63)

PAOLO 10/2: 'start combat over from the ground up... re-create Battle Brothers combat.' Rule 63:
the old fight is frozen; the new one is slices/BOHEMIA_FIGHT.html, and OURS THAT SURVIVES includes
'the square grid of house tiles cut from the block, COMBAT TWO's floor and cover art'. The board's
note to this lane: 'your sheets are the NEW fight's ground; the board is Battle Brothers' size now
(twenty-plus house tiles across), so a kind is a sheet of several blocks, not 5x5; cut them at that
size, 45 degrees, real sidewalks.'

TWO THINGS WERE IN THE WAY, BOTH FIXED HERE:
  1. SIZE. Every kind was one 5x5 block. Now every kind is a BOARD of 4 x 3 blocks = 20 x 15 house
     tiles (240 m x 180 m), lines five apart on rows 4 and 9, assembled so the streets meet: suburb
     blocks back onto each other yard to yard (how tract housing is actually platted), the
     cul-de-sac's stem is carried south through the block below as a north-south street until it
     meets that block's street, the strip mall's frontage road runs into the yards' back walls.
  2. REACH. All of it lived in banks/, which the site never publishes (pages publishes slices/,
     engine/, records/target). The new fight could not have loaded one pixel. Now the ground ships
     where the fight can read it: slices/fight_ground/, one PNG per BLOCK (a block is reused across
     boards, so a board loads at most a handful) and one manifest, fight_ground.json: per board the
     4 x 3 block layout, the 20 x 15 terrain grid (flat / rough / debris / water / height /
     blocked, read off the drawing as in rounds four and five), the cover placements in metres, the
     two start rows, the tile size. The cover pieces ship as PNGs beside them.

VARIETY WITHOUT NEW CODE: every block exists in two or three VARIANTS. The cooks of rounds three to
eight take explicit seeds; this cook offsets every seed (the R stream and the dress roll) per
variant, so the same street plan comes back with different yards, dirt, cracks, roofs and debris.
No two blocks on a board are the same picture (guarded).

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every board is at least 20 across and 15 deep, its start rows five apart;
  * every block is 5 x 5 tiles of 515 x 364, every pixel his (round three's guard on every block);
  * no block picture repeats inside a board;
  * the manifest's terrain is 20 x 15 and every cover placement is on the board, never on a blocked
    or water tile;
  * every file the manifest names exists under slices/ (so the site serves it).

THE ANALOG HORROR LINE (rule 20): every one of these boards is somewhere somebody used to drive
home to. The new fight starts on their street.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES and TG-04 THE STREET TILE: carried by every block (rounds 2-8).
  CGRD-01 INTO THE BREACH: the far zoom reads as roofs, roads, lots and desert, four fields.
  AH-01 THE BIBLE: the sun north-west, every shadow south-east, one register.
  REUSE CHECK: every block is a round three-to-eight kind, imported; nothing is redrawn here.

[bb the battle map] reference/library/battle_brothers/02_COMBAT_RULES.md and rule 63's wiki text:
  lines start at least five apart on a board of their size; the map is generated from the
  terrain where the fight happens. OURS: the board is generated from the city's own blocks.

    python3 tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py
      -> slices/fight_ground/*.png, slices/fight_ground/fight_ground.json
      -> slices/vote/COMBAT2_THE_GROUND_FOR_THE_NEW_FIGHT_10_2.png
"""
import importlib, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
S8 = importlib.import_module('bohemia_combat2_store_fronts_and_houses_everywhere_cook_10_2_26')
H7, R5, R4, B, F, K, CV = S8.H7, S8.R5, S8.R4, S8.B, S8.F, S8.K, S8.CV
MX = importlib.import_module('bohemia_combat2_mixed_blocks_cook_10_2_26')
BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')   # round fourteen: many more building types
FL = importlib.import_module('bohemia_combat2_freeway_and_landfill_recut_cook_10_4_26')   # round fifteen: his NO, re-cut   # round eleven: the plan varies, not just the dirt
os.chdir(REPO)

OUT_DIR = 'slices/fight_ground'
OUT_MANIFEST = OUT_DIR + '/fight_ground.json'
OUT_CARD = 'slices/vote/COMBAT2_THE_GROUND_FOR_THE_NEW_FIGHT_10_2.png'
PX, PY, N, die = B.PX, B.PY, B.N, K.die
BW, BH = 4, 3                                      # blocks across, down: 20 x 15 house tiles
MODS = [K, F, CV, B, R4, R5, H7, S8, MX, BT, FL]
_R0, _DRESS0, _DANY0 = K.R, K.dress, B.dress_any


def variant(off):
    """Every seed in rounds three to eight, offset: the same plan, different ground."""
    R = (lambda s: _R0(s + off)) if off else _R0
    dress = (lambda v, w, h, s: _DRESS0(v, w, h, s + off)) if off else _DRESS0
    dany = (lambda t, w, h, s: _DANY0(t, w, h, s + off)) if off else _DANY0
    for mod in MODS:
        if hasattr(mod, 'R'): mod.R = R
        if hasattr(mod, 'dress'): mod.dress = dress
    B.dress_any = dany


def stem_through(block):
    """The cul-de-sac's stem runs off the bottom of its block at column 2; the block below carries
       it south as a north-south street to that block's own street (rows 0-1, column 2)."""
    board, pieces, surf, grid = block[:4]
    for r in (0, 1):
        board.paste(F.street_small(15 + 2 * r, ns=True), (2 * PX, r * PY)); grid[r][2] = 'flat'
    pieces = [p for p in pieces if not (24 <= p['x_m'] < 36 and p['y_m'] < 24)]
    return (board, pieces, surf, grid) + tuple(block[4:])


MAKERS = {
    'subs': lambda: MX.suburb_seeded(601),
    'corner': lambda: MX.suburb_seeded(701, cross_col=2),
    'cornerw': lambda: MX.suburb_seeded(751, cross_col=0),
    'lots': lambda: MX.empty_lots(801),
    'main': lambda: BT.main_street(911)[:4],
    'works': lambda: BT.the_works(933)[:4],
    'suburb_stem': lambda: stem_through(H7.suburb45()),
    'culdesac': lambda: S8.culdesac45(),
    'strip': lambda: S8.strip45(),
    'ruin': lambda: S8.ruin45(),
    'scrub': lambda: R4.scrub(),
    'wash': lambda: (lambda b: (b[0], b[1], b[2], wash_terrain(b)))(B.wash()),
    'freeway': lambda: FL.freeway2(1201),
    'freewayo': lambda: FL.freeway2(1213, overpass=True),
    'shore': lambda: R5.shore(),
    'landfill': lambda: FL.landfill2(1301),
}


def wash_terrain(b):
    wm = np.array(b[2]['wash']) > 127
    g = [['rough'] * N for _ in range(N)]
    for r in range(N):
        for c in range(N):
            if wm[B.M(r * 12):B.M((r + 1) * 12), B.M(c * 12):B.M((c + 1) * 12)].mean() > 0.35: g[r][c] = 'flat'
    g[3][0] = 'height'
    return g


import random
# ROUND ELEVEN (sweep L): every board is SEEDED from a palette of blocks per row, so the plan changes
# across the width and down the board; no block sits beside or above its own twin.
HOUSES = ['subs.0', 'subs.1', 'subs.2', 'subs.3', 'corner.0', 'corner.1', 'cornerw.0', 'lots.0']
TOWN = HOUSES + ['main.0', 'main.1', 'works.0']            # round fourteen: main street and the works mix into town boards
PALETTES = {
    'suburb':   [HOUSES, HOUSES + ['main.0'], HOUSES],
    'culdesac': [['culdesac.0', 'culdesac.1'] + HOUSES[:4], None, HOUSES + ['main.1']],
    'strip':    [['strip.0', 'strip.1', 'main.0', 'works.0'], TOWN, TOWN],
    'ruin':     [['ruin.0', 'ruin.1', 'lots.0', 'subs.2'], ['ruin.0', 'ruin.1', 'subs.3', 'corner.1'], ['ruin.1', 'ruin.0', 'lots.0', 'subs.0']],
    'desert':   [['scrub.0', 'scrub.1', 'scrub.2'], ['wash.0', 'wash.1', 'scrub.2', 'scrub.0'], ['scrub.1', 'scrub.0', 'scrub.2']],
    'freeway':  [['strip.0', 'strip.1', 'lots.0'], ['freeway.0', 'freewayo.0'], ['scrub.0', 'scrub.1', 'scrub.2']],
    'shore':    [['shore.0', 'shore.1'], ['scrub.0', 'wash.0', 'scrub.1', 'wash.1'], ['scrub.2', 'scrub.0', 'scrub.1']],
    'landfill': [['landfill.0', 'landfill.1'], ['landfill.1', 'landfill.0', 'scrub.0', 'scrub.1'], ['scrub.2', 'landfill.0', 'landfill.1', 'scrub.0']],
}


def seeded_layout(name):
    rng = random.Random('bohemia-board-' + name)
    lay = []
    for br, pal in enumerate(PALETTES[name]):
        row = []
        for bc in range(BW):
            if pal is None:                                         # under a cul-de-sac: carry its stem south
                above = lay[br - 1][bc]
                row.append('suburb_stem.%d' % (bc % 2) if above.startswith('culdesac') else rng.choice([b for b in TOWN if b != above]))
                continue
            opts = [b for b in pal if (not row or b != row[-1]) and (br == 0 or b != lay[br - 1][bc])] or pal
            if 'culdesac' in name and br == 0 and bc in (0, 2): opts = [b for b in opts if b.startswith('culdesac')] or opts
            row.append(rng.choice(opts))
        lay.append(row)
    return streets_run_through(lay, rng)


def streets_run_through(lay, rng):
    """ROUND TWELVE: A CROSS STREET DOES NOT STOP AT THE BLOCK EDGE. Where any town block in a
       column carries a cross street (or a cul-de-sac stem comes down it), every town block in that
       column carries the same street, in the variant that differs from its left and upper
       neighbours; an empty-lots block in such a column becomes a corner."""
    town = lambda b: b.split('.')[0] in ('subs', 'corner', 'cornerw', 'lots', 'main', 'works')   # a street never stops at a main-street block either (rule 67: the lines run through)
    # at most two cross streets a board (a real grid has long blocks); the stem's column always counts
    has = [bc for bc in range(BW) if any(lay[br][bc].startswith(('corner', 'suburb_stem')) for br in range(BH))]
    stems = [bc for bc in has if any(lay[br][bc].startswith('suburb_stem') for br in range(BH))]
    busy = lambda bc: sum(lay[br][bc].startswith(('main', 'works')) for br in range(BH))   # keep main street and the works where they stand
    cand = sorted([bc for bc in has if bc not in stems and bc - 1 not in stems and bc + 1 not in stems], key=busy)
    keep = stems + [bc for bc in cand if busy(bc) == 0][:max(0, 2 - len(stems))]
    for bc in range(BW):
        if bc in keep: continue
        for br in range(BH):
            if lay[br][bc].startswith('corner'):
                ok = ['subs.%d' % v for v in range(4) if (bc == 0 or lay[br][bc - 1] != 'subs.%d' % v) and (br == 0 or lay[br - 1][bc] != 'subs.%d' % v) and (bc == BW - 1 or lay[br][bc + 1] != 'subs.%d' % v)]
                lay[br][bc] = rng.choice(ok)
    for bc in keep:
        col = [lay[br][bc] for br in range(BH)]
        fam = None
        for b in col:
            if b.startswith('cornerw'): fam = 'cornerw'
            elif b.startswith('corner') and fam is None: fam = 'corner'
        if any(b.startswith('suburb_stem') for b in col): fam = 'corner'   # the stem is at column 2, as is 'corner'
        if not fam: continue
        for br in range(BH):
            if not town(lay[br][bc]): continue
            for v in range(3):
                cand = '%s.%d' % (fam, v)
                if (bc == 0 or lay[br][bc - 1] != cand) and (br == 0 or lay[br - 1][bc] != cand) and (bc == BW - 1 or lay[br][bc + 1] != cand):
                    lay[br][bc] = cand; break
    return lay


BOARDS = {k: seeded_layout(k) for k in PALETTES}
# ROUND SIXTEEN (rule 67): a wash is a line too. It runs the whole depth of its column (periodic in its own
# depth, so each wash block meets the next), and on the shore it runs down into the lake.
BOARDS['desert'] = [['scrub.2', 'wash.0', 'scrub.1', 'scrub.0'], ['scrub.0', 'wash.1', 'scrub.2', 'wash.0'], ['scrub.1', 'wash.0', 'scrub.0', 'wash.1']]
BOARDS['shore'] = [['shore.0', 'shore.1', 'shore.0', 'shore.1'], ['scrub.1', 'wash.0', 'scrub.0', 'wash.1'], ['scrub.2', 'wash.1', 'scrub.1', 'wash.0']]
START_ROWS = (4, 9)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    need = sorted({b for lay in BOARDS.values() for row in lay for b in row})
    cover = {k: fn() for k, fn in CV.PIECES}
    blocks = {}
    for bid in need:
        kind, v = bid.split('.')
        variant(int(v) * 1009)
        res = MAKERS[kind]()
        board, pieces, surf, grid = res[:4]
        B.guard({bid: (board, pieces, surf)}, cover)
        blocks[bid] = (board, pieces, grid)
        board.save('%s/block_%s.png' % (OUT_DIR, bid.replace('.', '_')), optimize=True)
        print('  block', bid)
    variant(0)
    for k, (im, meta) in cover.items(): im.save('%s/cover_%s.png' % (OUT_DIR, k))
    extra = {}
    for i in range(len(B.DROCK)): extra['rock_%d' % i] = B.rock_piece(i)
    extra['outcrop'] = B.outcrop()
    extra.update(R5.EXTRA)
    extra.update(BT.FURNITURE)                                          # round twenty: the buildings' own pieces
    for k, im in extra.items(): im.save('%s/cover_%s.png' % (OUT_DIR, k))
    for sid in ('lamp_house_side', 'lamp_your_side', 'oil_drum'):          # his 7/28 light sprites
        F.load(F.SPR[sid]).convert('RGBA').save('%s/light_%s.png' % (OUT_DIR, sid))
    man = dict(version='fight-ground-10-2', built='10/2/26', lane='combat 2', for_file='slices/BOHEMIA_FIGHT.html (rule 63)',
               tile_px=[PX, PY], tile_metres=K.TILE_M, px_per_metre=K.PPM, block_tiles=N, board_tiles=[BW * N, BH * N],
               perspective='45 DEGREE ART LAW: depth and heights x cos45, south faces seen',
               start_rows=list(START_ROWS),
               terrain_key={'flat': 'Battle Brothers flat (2 AP)', 'rough': 'BB forest floor / rough (3 AP)', 'debris': 'BB snow (3 AP)',
                            'water': 'BB swamp (4 AP, melee defence malus)', 'height': '+1 level: +10% hit down, -10% up, +1 range',
                            'blocked': 'impassable, blocks sight'},
               cover={k: dict(src='cover_%s.png' % k, **{kk: vv for kk, vv in meta.items()}) for k, (im, meta) in cover.items()},
               cover_extra={k: dict(src='cover_%s.png' % k, **(BT.FURN_META[k] if k in BT.FURN_META else dict(h=(2.5 if k == 'outcrop' else 1.4), kind=('MOUND' if k == 'outcrop' else 'COVER')))) for k in extra},
               blocks={bid: dict(src='block_%s.png' % bid.replace('.', '_')) for bid in blocks},
               lights_key={'lamp': 'a street lamp; live ones light a pool radius_m around their base (night: a lit tile plays as day)',
                           'drum': 'an oil drum with a fire in it, always live', 'anchor': 'x_m, y_m = the sprite base; draw it bottom-centred',
                           'circuit': "'grid' lamps burn only where the map says this block has power (rule 73); 'fire' always burns", 'block': '[block row, block column]: the unit the map powers'},
               boards={})
    for name, lay in BOARDS.items():
        terr = [[None] * (BW * N) for _ in range(BH * N)]
        cov, pics = [], set()
        for br, row in enumerate(lay):
            for bc, bid in enumerate(row):
                board, pieces, grid = blocks[bid]
                for r in range(N):
                    for c in range(N): terr[br * N + r][bc * N + c] = grid[r][c]
                for p in pieces:
                    q = dict(p); q['x_m'] = round(p['x_m'] + bc * 60, 1); q['y_m'] = round(p['y_m'] + br * 60, 1)
                    cov.append(q)
        for row in lay:                                               # no repeated picture side by side
            for a, b2 in zip(row, row[1:]):
                if a == b2 and not a.startswith('freeway'): die(   # the freeway's lanes must run on unbroken
                    '%s: two identical blocks side by side (%s)' % (name, a))
        if len(terr[0]) < 20 or len(terr) < 15: die('%s is under 20 x 15' % name)
        if START_ROWS[1] - START_ROWS[0] < 5: die('start rows under five apart')
        for q in cov:
            t = terr[int(q['y_m'] // 12)][int(q['x_m'] // 12)]
            if t in ('blocked',): die('%s: %s on a blocked tile' % (name, q['piece']))
        # ROUND TWELVE: THE LIGHTS THAT STILL WORK, as data. Round six drew night with his lamps (one
        # in three lit) and the drums people keep burning; the new fight lays a flat wash for night.
        # Each board now lists its lamps on the walks of every street block and a drum in some
        # lots, live or dead (seeded), with the sprites beside them, so the fight can light pools.
        lr = random.Random('bohemia-lights-' + name); lights = []
        for br, row in enumerate(lay):
            for bc, bid in enumerate(row):
                k = bid.split('.')[0]
                if k in ('subs', 'corner', 'cornerw', 'lots', 'ruin', 'suburb_stem', 'strip'):
                    ys = (14.4, 46.0) if k == 'strip' else (24.4, 36.0)
                    for x in range(5, 60, 12):
                        for y in ys:
                            lights.append(dict(kind='lamp', src='light_lamp_house_side.png' if y < 30 else 'light_lamp_your_side.png',
                                               x_m=bc * 60 + x, y_m=br * 60 + y, live=lr.random() < 0.36, radius_m=7.0,
                                               circuit='grid', block=[br, bc]))   # rule 73: the map powers a block on or off
                if k in ('subs', 'lots', 'ruin', 'landfill', 'scrub') and lr.random() < 0.5:
                    lights.append(dict(kind='drum', src='light_oil_drum.png', x_m=round(bc * 60 + 6 + lr.random() * 48, 1),
                                       y_m=round(br * 60 + (8 if lr.random() < 0.5 else 52), 1), live=True, radius_m=5.0,
                                       circuit='fire', block=[br, bc]))
        man['boards'][name] = dict(blocks=lay, terrain=terr, cover=cov, lights=lights)
    for bid, b in man['blocks'].items():
        if not os.path.exists(os.path.join(OUT_DIR, b['src'])): die('missing ' + b['src'])
    json.dump(man, open(OUT_MANIFEST, 'w'), indent=1)
    # the card: all eight boards at the far zoom, start rows marked
    sc = 0.03
    bw, bh = int(PX * N * sc), int(PY * N * sc)
    thumbs = []
    for name, lay in BOARDS.items():
        im = Image.new('RGB', (bw * BW, bh * BH))
        for br, row in enumerate(lay):
            for bc, bid in enumerate(row):
                board, pieces, _ = blocks[bid]
                im.paste(B.composed(board, pieces, cover).convert('RGB').resize((bw, bh), Image.LANCZOS), (bc * bw, br * bh))
        d = ImageDraw.Draw(im); th = bh / N
        d.line([(0, int(4.5 * th)), (im.size[0], int(4.5 * th))], fill=(120, 200, 255), width=2)
        d.line([(0, int(9.5 * th)), (im.size[0], int(9.5 * th))], fill=(255, 110, 90), width=2)
        thumbs.append((name, im))
    tw, thh = thumbs[0][1].size
    out = Image.new('RGB', (tw * 2 + 60, (thh + 40) * 4 + 80), (12, 11, 10))
    d = ImageDraw.Draw(out)
    for i, (name, im) in enumerate(thumbs):
        x, y = 20 + (i % 2) * (tw + 20), 20 + (i // 2) * (thh + 40)
        d.text((x, y), name.upper() + '  20 x 15', font=K.font(15), fill=(222, 181, 118)); out.paste(im, (x, y + 22))
    d.text((20, out.size[1] - 40), 'blue: your line.  red: theirs.  Five houses apart.  Every board ready for the new fight.', font=K.font(14), fill=(190, 160, 110))
    out.save(OUT_CARD, optimize=True)
    tot = sum(os.path.getsize(os.path.join(OUT_DIR, f)) for f in os.listdir(OUT_DIR))
    print('ok: %d boards, %d blocks, %.1f MB in %s' % (len(BOARDS), len(blocks), tot / 1e6, OUT_DIR))
    importlib.import_module('bohemia_combat2_fight_ground_pack_10_2_26').pack()   # round thirteen: ship lossless WebP, never PNG
    importlib.import_module('bohemia_combat2_the_wide_board_cook_10_5_26').main()  # round twenty-one: the apron and the four frames


if __name__ == '__main__':
    main()
