#!/usr/bin/env python3
"""BOHEMIA -- COOK [the first guns off the rig]: THE VOTE SHEET. The six guns (two options for each of the game's gun
lines, the PISTOL, the SHOTGUN and the RIFLE) that came off DIRECTION's master rig on the armourer's rack
(tools/bohemia_cook_model_guns.py), each cut from the rig's own close camera (--portrait: 80 degrees, front-on, the
camera PORTRAIT uses for a face) and laid beside HIS OWN gun tiles and beside WHAT THE GAME SHOWS TODAY for that line
(the market's picture, slices/market_icons/), all at one art pixel to one sheet pixel. Then the rack itself: the close
camera's three front facings beside his two racks, the eight facings at the fight's true 57 px a metre on his cracked
street tile, and the robot and the truck he fell for beside it (style guide field 19, step 6: does it look like it came
from the same table?). Last, every gun at the fight's own size, cut from the rack's S still, beside the robot: the size
a gun is in a man's hand. The quartermaster's line opens every block, read from the index, never typed. ONE pixel size
per picture and nothing resampled; the sheet is not doubled.

    python3 tools/bohemia_cook_guns_sheet.py      ->  records/target/COOK_THE_FIRST_GUNS_OFF_THE_RIG.png

A gun's box on a picture is its world box (reference/models/bohemia/gun_rack.json) projected through the camera the rig
wrote down (rig.json, portrait.json): the same arithmetic the rig's camera does, so the crop is where the gun is, never
guessed by eye.

REFERENCE CHECK: the twins are his own tiles named on each block (approved ones from reference/art_bank, never-judged
ones decoded whole from banks/BOHEMIA_HD_TILE_REPO_part1-4.txt); the cards are the rig's own (rig.json).
REUSE CHECK: it draws nothing; the layout helpers, the quartermaster call and his street tile are the props sheet's
(tools/bohemia_cook_props_through_the_rig_sheet.py).
"""
import base64, io, json, math, os, sys
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohemia_cook_props_through_the_rig_sheet import ROOT, FACINGS, GROUND, BG, INK, DIM, font, his, qm, on_ground, wrap   # noqa: E402

RIG = 'records/target/master_rig/cook_gun_rack'
OUT = 'records/target/COOK_THE_FIRST_GUNS_OFF_THE_RIG.png'
ROBOT = 'records/target/direction_rig_round_six/robot/rig_S.png'
TRUCK = 'records/target/direction_the_truck_turned_up/truck/rig_S.png'
LINES = [
    ('THE PISTOL', 'pistol_a', 'A: a 1911-pattern service pistol, blued, wood grips, the grip taped', 'pistol_b', 'B: a four-inch revolver gone to dull steel, a string lanyard on the butt',
     'a pistol or a revolver', ['--packs', '12. Weapons and supplies', '--nearest', '12. Weapons and supplies#6', '12. Weapons and supplies#9', '12. Weapons and supplies#8'],
     ['pack:12. Weapons and supplies#6', 'pack:12. Weapons and supplies#9', 'pack:12. Weapons and supplies#8'], 'w_pistol.png', 'his pistol #6'),
    ('THE SHOTGUN', 'shotgun_a', 'A: a double barrel sawn off, two hammers, the cut wrist taped', 'shotgun_b', 'B: a pump gun, wood slide and stock, the cracked wrist held with hose clamps',
     'a shotgun', ['--packs', '12. Weapons and supplies', '--nearest', '12. Weapons and supplies#5', '12. Weapons and supplies#12', '12. Weapons and supplies#13'],
     ['pack:12. Weapons and supplies#5', 'pack:12. Weapons and supplies#12', 'pack:12. Weapons and supplies#13'], 'w_shotgun.png', 'his SMG #7, the market calls it the shotgun'),
    ('THE RIFLE', 'rifle_a', 'A: a bolt-action deer rifle, open sights, a cut seatbelt for a sling', 'rifle_b', 'B: a lever-action carbine, the receiver bare steel, the forend wired on',
     'a long gun (a rifle or carbine)', ['--words', 'rifle', 'carbine', 'musket', 'weapon', 'gun', 'cannon', '--nearest', '17. Cannons and weapons#13',
     '--verdict', 'OWNS ZERO, BUY OR COMMISSION (no modern long gun in 294 packs: his gun packs hold pistols, a revolver, SMGs and sawn-offs; the nearest long gun is the never-judged flintlock blunderbuss; the model is the source, rule 115a)'],
     ['pack:17. Cannons and weapons#13'], 'w_rifle.png', 'his suppressed pistol #10, the market calls it the rifle'),
]
RACK_Q = ('the armourer\'s gun rack', ['--packs', '17. Cannons and weapons', '12. Weapons and armory', '--nearest', '17. Cannons and weapons#15', '12. Weapons and armory#10',
          '--verdict', 'LOOKED AT THE UNJUDGED FIRST: his two racks are an armoury\'s (a flintlock and a dagger on a frame; spears, an axe and a shield); COMPOSE BESIDE IT (his racks are the score; the model is the source, rule 115a)'])
RACK_TWINS = ['pack:17. Cannons and weapons#15', 'pack:12. Weapons and armory#10']
_BANK = {}


def tile(key):
    """his tile by key: an approved one from the bank on disk, a never-judged one decoded whole from the pack repo"""
    try: return his(key)
    except SystemExit: pass
    if not _BANK:
        for i in range(1, 5): _BANK.update(json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_HD_TILE_REPO_part%d.txt' % i)))['packs'])
    pack, idx = key[len('pack:'):].rsplit('#', 1)
    return Image.open(io.BytesIO(base64.b64decode(_BANK[pack][int(idx)]['b64']))).convert('RGBA')


def cam_box(lo, hi, centre, k, zs, tilt, look_z, ppm, res, crop, pad):
    """a world box through the rig's camera: ortho, turned 0 (the S facing), tilted from straight down by tilt; the
    model sits with its ground centre at the origin, scaled k (z by k x zs); the picture is cut at the rig's crop box"""
    t = math.radians(tilt); up = (math.cos(t), math.sin(t))
    xs, ys = [], []
    for x in (lo[0], hi[0]):
        for y in (lo[1], hi[1]):
            for z in (lo[2], hi[2]):
                wx, wy, wz = (x - centre[0]) * k, (y - centre[1]) * k, (z - centre[2]) * k * zs
                xs.append(res / 2 + wx * ppm); ys.append(res / 2 - (wy * up[0] + (wz - look_z) * up[1]) * ppm)
    return (int(math.floor(min(xs) - crop[0] - pad)), int(math.floor(min(ys) - crop[1] - pad)), int(math.ceil(max(xs) - crop[0] + pad)), int(math.ceil(max(ys) - crop[1] + pad)))


def main():
    rig = json.load(open(os.path.join(ROOT, RIG, 'rig.json'))); por = json.load(open(os.path.join(ROOT, RIG, 'portrait.json')))
    world = json.load(open(os.path.join(ROOT, 'reference/models/bohemia/gun_rack.json')))
    rb = world['rack_box']; centre = ((rb['lo'][0] + rb['hi'][0]) / 2, (rb['lo'][1] + rb['hi'][1]) / 2, rb['lo'][2])   # the rig's ground centre
    k = rig['scale_from_model']; dims = [(h - l) * k for l, h in zip(rb['lo'], rb['hi'])]
    close = Image.open(os.path.join(ROOT, por['files'][por['facings'].index('S')])).convert('RGBA')
    still = Image.open(os.path.join(ROOT, RIG, 'rig_S.png')).convert('RGBA')
    look_c = dims[2] - por['head_m'] * 0.55

    def gun_close(name):
        g = world['guns'][name]
        b = cam_box(g['lo'], g['hi'], centre, k, 1.0, 80.0, look_c, por['ppm'], por['res'], por['crop_box_px'], 3)
        return close.crop(b)

    def gun_still(name):
        g = world['guns'][name]
        zs = rig['z_stretch']
        b = cam_box(g['lo'], g['hi'], centre, k, zs, rig['camera']['tilt_deg'], dims[2] * zs / 2, rig['ppm'], rig['res'], rig['crop_box_px'], 2)
        return still.crop(b)

    f1, f2, f3 = font(16), font(10), font(12)
    street = his(GROUND)
    blocks = []
    for title, a, acap, b, bcap, what, qargs, twins, market, mcap in LINES:
        pics = [('HIS #' + t.rsplit('#', 1)[1], tile(t)) for t in twins]
        pics.append(('IN THE GAME TODAY: ' + mcap, Image.open(os.path.join(ROOT, 'slices/market_icons', market)).convert('RGBA')))
        pics += [(acap, gun_close(a)), (bcap, gun_close(b))]
        blocks.append(('%s: A OR B?' % title, qm(what, qargs), [pics]))
    eight = [Image.open(os.path.join(ROOT, RIG, 'rig_%s.png' % f)).convert('RGBA') for f in FACINGS]
    rack_rows = [[('HIS #' + t.rsplit('#', 1)[1], tile(t)) for t in RACK_TWINS] + [('THE CLOSE CAMERA, %s' % f, Image.open(os.path.join(ROOT, p)).convert('RGBA')) for f, p in zip(por['facings'], por['files'])],
                 [(f, on_ground(e.crop(e.getbbox()), street)) for f, e in zip(FACINGS, eight)] + [('THE ROBOT', Image.open(os.path.join(ROOT, ROBOT)).convert('RGBA')), ('THE TRUCK', Image.open(os.path.join(ROOT, TRUCK)).convert('RGBA'))]]
    blocks.append(("THE ARMOURER'S RACK THEY HANG ON, 1.48 m   card: " + rig['card_guide']['verdict'], qm(*RACK_Q), rack_rows))
    fight = [('THE ROBOT (the ruler, 1.72 m)', Image.open(os.path.join(ROOT, ROBOT)).convert('RGBA'))]
    fight += [(n.replace('_', ' ').upper(), on_ground(gun_still(n), street)) for n in ('pistol_a', 'pistol_b', 'shotgun_a', 'shotgun_b', 'rifle_a', 'rifle_b')]
    blocks.append(("AT THE FIGHT'S OWN SIZE: 57 px a metre, the size a gun is in a man's hand", '', [fight]))

    probe = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    W = max(sum(p.width + 18 for _, p in row) for _, _, rows in blocks for row in rows) + 24
    hs = []
    for title, line, rows in blocks:
        n = len(wrap(probe, line, f2, W - 24)) if line else 0
        hs.append(30 + n * 13 + sum(34 + max(p.height for _, p in row) for row in rows) + 16)
    intro = ['COOK [the first guns off the rig] 10/19: THE GUNS HE STARTS WITH, MODELLED AT THE SOURCE, THROUGH THE MASTER RIG (rule 120a: guns first; rule 115a: the robot\'s and the truck\'s way; rule 47b: the guns are his pick, A or B a line)',
             'Pixel size: the guns at %.0f px a metre from the rig\'s close camera (the pistol beside his own pistol), the rack\'s eight facings and the last row at the fight\'s 57 px a metre; every picture at 1:1, nothing resampled, one pixel size each. Palette: records/target/BOHEMIA_STYLE_PALETTE.json (the gunmetal, the worn steel, the wood, the tape, the pine: five materials). Light: the rig\'s one sun, upper left, above. Zero breaks of the rig.' % por['ppm']]
    ih = 14 + sum(len(wrap(probe, t, f3 if i == 0 else f2, W - 24)) * (16 if i == 0 else 13) for i, t in enumerate(intro)) + 10
    sheet = Image.new('RGBA', (W, ih + sum(hs)), BG); dr = ImageDraw.Draw(sheet)
    y = 10
    for i, t in enumerate(intro):
        for ln in wrap(dr, t, f3 if i == 0 else f2, W - 24): dr.text((12, y), ln, font=f3 if i == 0 else f2, fill=INK if i == 0 else DIM); y += 16 if i == 0 else 13
    y = ih
    for (title, line, rows), h in zip(blocks, hs):
        dr.line((12, y, W - 12, y), fill=(70, 66, 60, 255))
        dr.text((12, y + 8), title, font=f1, fill=INK); yy = y + 30
        for t in (wrap(dr, line, f2, W - 24) if line else []): dr.text((12, yy), t, font=f2, fill=DIM); yy += 13
        for row in rows:
            yy += 22; x, ph = 12, max(p.height for _, p in row)
            for cap, p in row:
                for j, c in enumerate(wrap(dr, cap, f2, max(p.width, 90))[:2]): dr.text((x, yy - 20 + j * 11), c, font=f2, fill=INK)
                sheet.alpha_composite(p, (x, yy + ph - p.height)); x += p.width + 18
            yy += ph + 12
        y += h
    sheet.save(os.path.join(ROOT, OUT), optimize=True)
    print(OUT, sheet.size, os.path.getsize(os.path.join(ROOT, OUT)))


if __name__ == '__main__':
    main()
