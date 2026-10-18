#!/usr/bin/env python3
"""BOHEMIA -- COOK [props through the rig]: THE VOTE SHEET. The lamp, the gun and the wreck that came off DIRECTION's
master rig (tools/bohemia_cook_model_props.py), each beside HIS OWN pack tile at 1:1, standing on his cracked street
tile (style guide field 19, step 3), with all eight facings in a row (step 2) and the truck maquette beside the wreck
(step 6: does it look like it came from the same table?). The quartermaster's line opens every row, read from the
index by tools/bohemia_quartermaster_line.py, never typed. Every picture is at one art pixel to one sheet pixel and
the whole sheet is then doubled with nearest neighbour, so there is ONE pixel size on it (no mixels, guide field 2).

    python3 tools/bohemia_cook_props_through_the_rig_sheet.py          ->  records/target/COOK_PROPS_THROUGH_THE_RIG.png
    python3 tools/bohemia_cook_props_through_the_rig_sheet.py fight    ->  records/target/COOK_FIGHT_PROPS_THROUGH_THE_RIG.png
      ([the fight props through the rig]: the barrier, the dumpster, the cart and the tyres a fight tile stands on)
    python3 tools/bohemia_cook_props_through_the_rig_sheet.py terrains ->  records/target/COOK_THE_EMPTY_TERRAINS_COVER.png
      ([the empty terrains' cover]: the freeway's rolled wreck, overpass pier, lane closure and fallen gantry, and the
      landfill's heap, car bales and dead dozer; the board count's emptiest terrains)
    python3 tools/bohemia_cook_props_through_the_rig_sheet.py blockwar ->  records/target/COOK_THE_BLOCK_WARS_COVER.png
      ([the block war's cover]: the sandbags, the chain-link and its gate, the container, the propane tank, the rubble
      mound and the cart corral; a row may name the facing its MINE picture stands at, the three-quarter his pack
      draws a container at, and says so in the caption)

REFERENCE CHECK: the twins are his approved tiles named in each row; the cards are the rig's own (rig.json).
REUSE CHECK: it draws nothing; it lays out his approved tiles from reference/art_bank (the twins and the street tile),
the rig's renders and the truck maquette, and reuses the quartermaster's tool for each row's line. No bank opened.
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/art_bank')
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
GROUND = 'pack:1. Cracked street tiles#0'
ROWS = [
    ('lamp', 'THE LAMP POST, 3.2 m', 'a lamp post', ['--words', 'lamp', 'light', '--nearest', '18. Light sources and fire barrels#3'], 'pack:18. Light sources and fire barrels#3', None),
    ('gun', 'THE HEAVY MACHINE GUN ON ITS TRIPOD, 1.75 m', 'a gun', ['--packs', '12. Weapons and supplies', '--nearest', '12. Weapons and supplies#11'], 'pack:12. Weapons and supplies#11', None),
    ('wreck', 'THE WRECK, A 4.7 m SEDAN', 'a wrecked car', ['--words', 'car', 'cars', '--nearest', '9. Abandoned cards#0'], 'pack:9. Abandoned cards#0', 'records/target/direction_rig_round_five/truck/rig_S.png'),
]
COMPOSE = 'COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a)'
FIGHT_ROWS = [
    ('barrier', 'THE JERSEY BARRIER, 3.0 m', 'a concrete jersey barrier', ['--packs', '3. Barricades and blockades', '--nearest', '3. Barricades and blockades#4'], 'pack:3. Barricades and blockades#4', None),
    ('dumpster', 'THE DUMPSTER, 1.85 m', 'a dumpster', ['--packs', '14. Trash and junk props', '--nearest', '14. Trash and junk props#3'], 'pack:14. Trash and junk props#3', 'records/target/direction_rig_round_five/truck/rig_S.png'),
    ('cart', 'THE SHOPPING CART, 1.0 m', 'a shopping cart', ['--words', 'shopping', 'trolley', '--nearest', '15. Street props#21', '--verdict', 'OWNS ZERO, BUY OR COMMISSION (no cart in 294 packs; the twin is his wire bin, the same wire)'], 'pack:15. Street props#21', None),
    ('tyres', 'THE TYRES, TWO STACKS', 'a stack of tyres', ['--packs', '3. Barricades and blockades', '--nearest', '3. Barricades and blockades#5'], 'pack:3. Barricades and blockades#5', None),
]
BLOCKWAR_ROWS = [
    ('sandbags', 'THE SANDBAG WALL, 2.6 m, 0.85 m HIGH (COVER)', 'a sandbag wall', ['--packs', '5. Barricades and defenses', '--nearest', '5. Barricades and defenses#2'], 'pack:5. Barricades and defenses#2', None),
    ('fence', 'THE CHAIN-LINK RUN AND ITS GATE, 5.5 m (A BLOCKER YOU SEE THROUGH)', 'a chain-link fence and gate', ['--packs', '6. Chain link fences', '13. Fences and wire', '--nearest', '6. Chain link fences#0', '13. Fences and wire#10'], 'pack:6. Chain link fences#0', None),
    ('container', 'THE SHIPPING CONTAINER, 6.06 m (A BLOCKER YOU CLIMB)', 'a shipping container', ['--packs', 'Cargo, crates and containers', '--nearest', 'Cargo, crates and containers#36'], 'pack:Cargo, crates and containers#36', 'records/target/direction_the_truck_turned_up/truck/rig_SW.png', 'SW'),
    ('propane', 'THE PROPANE TANK, 3.02 m (COVER THAT STOPS YOU)', 'a propane tank', ['--packs', '9. Boilers and tanks', 'Cargo, crates and containers', '--nearest', 'Cargo, crates and containers#22', '9. Boilers and tanks#25'], 'pack:Cargo, crates and containers#22', None),
    ('rubble', 'THE RUBBLE MOUND, 4.6 m, 1.4 m HIGH (THE MOUND: HIGH GROUND)', 'a rubble mound', ['--packs', '9. Rubble and debris', '--nearest', '9. Rubble and debris#1'], 'pack:9. Rubble and debris#1', None),
    ('corral', 'THE CART CORRAL, 6.3 m, WITH LAST ROUND\'S CART FOUR TIMES (COVER THAT STOPS YOU)', 'a cart corral', ['--words', 'shopping', 'trolley', 'corral', '--nearest', '15. Street props#21', '--verdict', 'OWNS ZERO, BUY OR COMMISSION (no cart and no corral in 294 packs; the twin is his wire bin; the carts are last round\'s model)'], 'pack:15. Street props#21', None, 'SE'),
]
TERRAIN_ROWS = [
    ('rolled', 'THE FREEWAY: LAST ROUND\'S WRECK ROLLED ONTO ITS ROOF, 4.7 m OF CAR (A BLOCKER YOU CROUCH BEHIND)', 'a car rolled onto its roof', ['--packs', '9. Abandoned cards', '10. Abandoned cars', '--nearest', '9. Abandoned cards#0'], 'pack:9. Abandoned cards#0', None),
    ('pier', 'THE FREEWAY: AN OVERPASS PIER, 7.3 m, THE DECK SHEARED OFF IT (A BLOCKER)', 'a freeway overpass pier', ['--words', 'pillar', 'column', 'pier', 'bridge', '--nearest', '3. Barricades and blockades#10', '--verdict', 'LOOKED AT THE UNJUDGED FIRST: none is a freeway pier (classical stone columns, wooden walkways, volcanic pillars); COMPOSE BESIDE IT, the twin his concrete barricade (rule 115a)'], 'pack:3. Barricades and blockades#10', None),
    ('drums', 'THE FREEWAY: THE LANE CLOSURE NOBODY TOOK DOWN, FOUR DRUMS AND FIVE CONES (COVER, KNEE TO WAIST)', 'traffic drums and cones', ['--packs', '17. Warning Signs and road props', 'Streets props and urban', '--words', 'cone', 'drum', '--nearest', '17. Warning Signs and road props#23', '17. Warning Signs and road props#17'], 'pack:17. Warning Signs and road props#23', None),
    ('gantry', 'THE FREEWAY: THE SIGN GANTRY COME DOWN, 5 m OF TRUSS AND ITS POST (A BLOCKER YOU FIRE THROUGH)', 'an overhead sign gantry', ['--words', 'gantry', 'sign', '--nearest', '17. Warning Signs and road props#10', '--verdict', 'COMPOSE BESIDE IT (he owns signs on posts and boards, no overhead gantry; the model is the source, rule 115a)'], 'pack:17. Warning Signs and road props#10', None),
    ('heap', 'THE LANDFILL: THE LAST LOAD NOBODY PUSHED IN, A HEAP OF BAGS AND JUNK (THE MOUND: HIGH GROUND)', 'a landfill heap of bags and junk', ['--packs', '7. Trash and debris', '14. Trash and junk props', '--nearest', '7. Trash and debris#0'], 'pack:7. Trash and debris#0', None),
    ('bales', 'THE LANDFILL: CRUSHED CARS BALED AND STACKED IN STEPS, 2.1 m (COVER YOU CLIMB)', 'crushed-car bales', ['--words', 'bale', 'crushed', 'scrap', '--packs', '7. Trash and debris', '--nearest', '7. Trash and debris#3'], 'pack:7. Trash and debris#3', None),
    ('dozer', 'THE LANDFILL: THE DOZER THAT PUSHED IT, DEAD WHERE IT STOPPED, ITS TRACK THROWN (A BLOCKER, THE CAGE CLIMBABLE)', 'a bulldozer', ['--words', 'dozer', 'bulldozer', 'tractor', 'excavator', 'construction', '--verdict', 'OWNS ZERO, BUY OR COMMISSION (no dozer and no machine of the kind in 294 packs; the twin is his nearest machine, a wreck; the truck maquette beside it)'], 'pack:9. Abandoned cards#25', 'records/target/direction_the_truck_turned_up/truck/rig_S.png'),
]
SETS = {
    'props': (ROWS, 'records/target/COOK_PROPS_THROUGH_THE_RIG.png', 'COOK [props through the rig] 10/18: THREE PROPS MODELLED AT THE SOURCE, RENDERED THROUGH THE MASTER RIG'),
    'fight': (FIGHT_ROWS, 'records/target/COOK_FIGHT_PROPS_THROUGH_THE_RIG.png', 'COOK [the fight props through the rig] 10/18: FOUR THINGS A FIGHT TILE STANDS ON, MODELLED AT THE SOURCE, THROUGH THE MASTER RIG'),
    'blockwar': (BLOCKWAR_ROWS, 'records/target/COOK_THE_BLOCK_WARS_COVER.png', "COOK [the block war's cover] 10/18: SIX THINGS A MAN STANDS BEHIND IN A CITY FIGHT, MODELLED AT THE SOURCE, THROUGH THE MASTER RIG (round six's recipe)", 1),
    'terrains': (TERRAIN_ROWS, 'records/target/COOK_THE_EMPTY_TERRAINS_COVER.png', "COOK [the empty terrains' cover] 10/18: THE FREEWAY'S AND THE LANDFILL'S COVER, SEVEN THINGS MODELLED AT THE SOURCE, THROUGH THE MASTER RIG", 1),
}
BG, INK, DIM = (34, 33, 31, 255), (226, 218, 198, 255), (150, 144, 130, 255)
WRAP = 1700   # the eight facings of a six-metre box are 3,700 px in one row (a 7,472 px sheet, 5.2 MB on his phone): they wrap


def lines_of(eight, wrap_at):
    """the eight facings in rows no wider than wrap_at, each row [(facing, picture), ...]"""
    rows, cur, w = [], [], 0
    for f, e in zip(FACINGS, eight):
        if cur and w + e.width + 6 > wrap_at: rows.append(cur); cur, w = [], 0
        cur.append((f, e)); w += e.width + 6
    return rows + [cur]


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def his(key):
    for r in json.load(open(os.path.join(BANK, 'CORPUS.json')))['tiles'].values():
        if r['key'] == key: return Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    sys.exit('%s is not in the corpus' % key)


def qm(what, args):
    if '--verdict' not in args: args = args + ['--verdict', COMPOSE]
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools/bohemia_quartermaster_line.py'), what] + args, capture_output=True, text=True)
    if r.returncode: sys.exit('the quartermaster line did not come: ' + r.stderr[:300])
    return r.stdout.strip()


def on_ground(sprite, tile):
    """the sprite standing on his street tile, the tile repeated under it at 1:1"""
    w, h = sprite.width + 16, sprite.height + 16
    g = Image.new('RGBA', (w, h))
    for y in range(0, h, tile.height):
        for x in range(0, w, tile.width): g.alpha_composite(tile, (x, y))
    g.alpha_composite(sprite, (8, 8))
    return g


def wrap(d, text, f, width):
    words, lines, cur = text.split(' '), [], ''
    for wd in words:
        t = (cur + ' ' + wd).strip()
        if d.textlength(t, font=f) > width and cur: lines.append(cur); cur = wd
        else: cur = t
    return lines + [cur]


def main(which='props'):
    rows, out, headline = SETS[which][:3]
    zoom = SETS[which][3] if len(SETS[which]) > 3 else 2   # six props at true size doubled is 49 million pixels, too heavy for his phone
    wrap_at = WRAP if len(SETS[which]) > 3 else 10 ** 6    # the earlier sheets keep their one row of eight
    tile = his(GROUND)
    blocks, W = [], 0
    for row in rows:
        name, title, what, qargs, twin_key, maquette = row[:6]
        face = row[6] if len(row) > 6 else 'S'
        d = 'records/target/master_rig/cook_%s' % name
        rig = json.load(open(os.path.join(ROOT, d, 'rig.json')))
        twin = his(twin_key)
        s = Image.open(os.path.join(ROOT, d, 'rig_%s.png' % face)).convert('RGBA')
        pics = [('HIS', twin), ('MINE' if face == 'S' else 'MINE (%s)' % face, on_ground(s, tile))]
        if maquette: pics.append(('MAQUETTE', Image.open(os.path.join(ROOT, maquette)).convert('RGBA')))
        eight = [Image.open(os.path.join(ROOT, d, 'rig_%s.png' % f)).convert('RGBA') for f in FACINGS]
        if wrap_at < 10 ** 6: eight = [e.crop(e.getbbox()) for e in eight]   # the rig's one shared box is mostly air on a long thing: trimmed, never resampled
        blocks.append((title, qm(what, qargs), rig, pics, eight))
        W = max(W, sum(p.width for _, p in pics) + 16 * len(pics), min(sum(e.width for e in eight) + 6 * 8, wrap_at))
    W = max(W, 900) + 24
    f1, f2, f3 = font(14), font(9), font(10)
    probe = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    hs = []
    for title, line, rig, pics, eight in blocks:
        n = len(wrap(probe, line, f2, W - 24)) + 3
        hs.append(24 + n * 12 + max(p.height for _, p in pics) + sum(20 + max(e.height for _, e in ln) for ln in lines_of(eight, wrap_at)) + 30)
    head = 74
    sheet = Image.new('RGBA', (W, head + sum(hs)), BG); dr = ImageDraw.Draw(sheet)
    dr.text((12, 10), headline, font=f1, fill=INK)
    for i, t in enumerate(wrap(dr, 'Pixel size: 57 px a metre, true size, one pixel size on the sheet (all at 1:1%s). Palette:' % (', the sheet doubled' if zoom == 2 else '') + ' records/target/BOHEMIA_STYLE_PALETTE.json, five materials a prop, eight a vehicle. Light: one sun from the upper left, the rig\'s own. Nothing is final before his moodboard (rule 108).', f2, W - 24)):
        dr.text((12, 32 + i * 12), t, font=f2, fill=DIM)
    y = head
    for (title, line, rig, pics, eight), h in zip(blocks, hs):
        dr.line((12, y, W - 12, y), fill=(70, 66, 60, 255))
        dr.text((12, y + 6), title + '   card: ' + rig['card']['verdict'], font=f1, fill=INK); yy = y + 24
        for t in wrap(dr, line, f2, W - 24): dr.text((12, yy), t, font=f2, fill=DIM); yy += 12
        outs = [r for r in rig['card']['rows'] if r.startswith('OUT')]
        dr.text((12, yy), 'out: ' + ('; '.join(o[5:].strip() for o in outs) or 'none'), font=f2, fill=DIM); yy += 24
        x, ph = 12, max(p.height for _, p in pics)
        for cap, p in pics:
            dr.text((x, yy - 11), cap, font=f2, fill=INK)
            sheet.alpha_composite(p, (x, yy + ph - p.height)); x += p.width + 16
        yy += ph + 20
        for ln in lines_of(eight, wrap_at):
            x = 12; eh = max(e.height for _, e in ln)
            for f, e in ln:
                dr.text((x, yy - 11), f, font=f2, fill=DIM)
                sheet.alpha_composite(e, (x, yy + eh - e.height)); x += e.width + 6
            yy += eh + 20
        y += h
    if zoom > 1: sheet = sheet.resize((sheet.width * zoom, sheet.height * zoom), Image.NEAREST)
    sheet.save(os.path.join(ROOT, out), optimize=True)
    print(out, sheet.size)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'props')
