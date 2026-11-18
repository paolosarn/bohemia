#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the three that waited] (11/18/26; the coordinator's routine 'COOK FIVE next', VAMILY rules 453, 441,
416, 455: 'take the next jobs on your own list, one build each: finished art wherever a card still says STAND-IN').

COMBAT THREE's BUILD 11/18g put in the three legend lines this lane's handoff waited on (its handoff: 'from now a name I ask for
is in the legend the day I ask'). These are their pictures, under its names, through the master rig, no code:

  df_servers_block  THE DATA FORT. A server tile was two thin rows with 10 m of white floor between them (BUILD 11/18d's record,
                    measured on the page). The module lays this at the tile's middle (0.5, 0.98): the two more rows and the
                    three roofed aisles that fill it between the two edge rows. The data fort's own tool makes it
                    (`cut --block`); this build also cuts df_servers_ns again with its cast shadow at three tenths, because
                    the west row's own shadow fell across the block's first roof (a cabinet's top and the roof are one height:
                    there is no such shadow in the world).
  mall_mannequins   THE MALL, the store tile 'display' ('a store's window display, what is left of it: mannequins still
                    dressed, some down'; low cover, laid at (0.5, 0.75), about a tile wide; 'THE RUNWAY LIVES HERE'): a long
                    white plinth like a catwalk, five still standing on it in long coats, no faces, one arm each still held
                    out; two down; one stripped to the form and its head gone; a rail of what is left, on its side; and one
                    that stands on the floor, off the plinth, turned to face the others.
  mall_fountain     THE MALL, the atrium's blocker ('the atrium's fountain, dry, coins still in it'; a tile, laid at
                    (0.5, 0.92)): a round terrazzo basin nine metres across, a piece of its rim broken out, two bowls on a
                    stem, a brass finial; the tile of its floor, the mark the last water left, and the coins, every one of them
                    still there (batteries are the money: nobody bent down for these); a cart on its side in it.

  <venv>/bin/python tools/bohemia_cook5_the_three_that_waited_11_18_26.py render [--quick]
  python3 tools/bohemia_cook5_the_three_that_waited_11_18_26.py cut
  python3 tools/bohemia_cook5_the_three_that_waited_11_18_26.py sheet <before_fort> <after_fort> <before_mall> <after_mall>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a colocation hall's pod (rows of
cabinets in pairs with contained aisles under roof panels); a fashion store's window run (a low white plinth, full-height
dress forms without faces, a chrome rail); an enclosed mall's atrium fountain (a round terrazzo basin, a tiered centre, a
tiled floor, coins). The twins: the data fort's kit and the mall's (the card shows the fort's pods and the mall's two tiles
before and now).
REUSE CHECK (REUSE-FIRST): the data fort's tool (its block, its cut), the mall's tool (its mannequin, its cart, its materials),
the tunnels-and-garage tool under them (the rig, the pieces scene, the cutter): all imported.
ANALOG HORROR: a row of dressed figures with no faces and one of them on the floor facing the rest; a fountain full of money
nobody wants.
No reference game.
"""
import os, sys, json, math
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_data_fort_finished_11_18_26 as DF     # this lane's: the fort's block and its cut
WT = DF.WT; MT = WT.MT; TG = DF.TG
FG, REND = TG.FG, TG.REND
PPM, PYM, TW, TH = TG.PPM, TG.PYM, TG.TW, TG.TH
WAIT_AT = dict(mannequins=(14.0, 8.0), fountain=(40.0, 8.0))
FOUNT_R = 4.4


def lying(P, x, y, z0, coat, flip=False):
    """a mannequin down, its length along x: the legs, the coat, the head"""
    a, b = (x, x + 0.85) if not flip else (x - 0.85, x)
    P.box('skin', a, b, y - 0.09, y + 0.09, z0, z0 + 0.17)
    a, b = (x + 0.75, x + 1.5) if not flip else (x - 1.5, x - 0.75)
    P.box(coat, a, b, y - 0.22, y + 0.22, z0, z0 + 0.24)
    a, b = (x + 1.55, x + 1.75) if not flip else (x - 1.75, x - 1.55)
    P.box('skin', a, b, y - 0.1, y + 0.1, z0, z0 + 0.19)


def mannequins(P, ox, oy, rng):
    """the display: a long white plinth like a catwalk, what still stands on it, and one on the floor facing the rest"""
    P.box('paint_w', ox - 5.0, ox + 5.0, oy, oy + 2.2, 0.0, 0.26); P.box('under', ox - 5.0, ox + 5.0, oy - 0.01, oy, 0.0, 0.05)        # the plinth, its shadow gap
    P.box('under', ox - 4.6, ox + 4.6, oy + 0.75, oy + 1.45, 0.26, 0.268)                                                              # the runner down it
    for x in (ox - 4.7, ox + 4.6): P.box('steel', x, x + 0.08, oy + 2.05, oy + 2.13, 0.26, 2.5)                                        # the frame the lights hung from
    P.box('steel', ox - 4.7, ox + 4.68, oy + 2.05, oy + 2.13, 2.5, 2.57)
    for k in range(5): P.box('under' if k != 3 else 'lit', ox - 3.6 + k * 1.8 - 0.12, ox - 3.6 + k * 1.8 + 0.12, oy + 2.0, oy + 2.18, 2.36, 2.5)   # its lamps: one still on
    Z = 0.268
    for k, (dx, coat, tall, arm) in enumerate(((-3.9, 'coat_k', 1.9, True), (-2.2, 'coat_r', 1.84, True), (-0.6, 'coat_k', 1.92, False), (1.2, 'coat_w', 1.86, True), (3.9, 'coat_m', 1.88, True))):
        MT.mannequin(P, ox + dx, oy + 1.1 + 0.08 * (k % 2), Z, coat, tall, arm)
        if coat == 'coat_k': P.box(coat, ox + dx - 0.34, ox + dx + 0.34, oy + 1.0, oy + 1.26, Z + tall * 0.74, Z + tall * 0.84)         # the shoulders, cut wide
    # one stripped to the form, its head gone
    x = ox + 2.6; P.box('skin', x - 0.1, x + 0.1, oy + 1.03, oy + 1.17, Z, Z + 0.9); P.box('skin', x - 0.2, x + 0.2, oy + 0.99, oy + 1.21, Z + 0.78, Z + 1.56); P.box('steel', x - 0.03, x + 0.03, oy + 1.07, oy + 1.13, Z + 1.56, Z + 1.72)
    lying(P, ox - 1.9, oy + 0.45, Z, 'coat_m'); lying(P, ox + 5.0, oy - 0.7, 0.0, 'coat_r', flip=True)       # two down: one on the plinth, one on the floor off its end
    P.box('skin', ox + 0.3, ox + 0.62, oy + 0.4, oy + 0.48, Z, Z + 0.07)                                      # an arm, by itself
    # the rail of what is left, on its side; coats on the floor
    P.box('steel', ox - 4.6, ox - 2.9, oy - 0.9, oy - 0.84, 0.0, 0.05); P.box('steel', ox - 4.6, ox - 4.54, oy - 1.3, oy - 0.5, 0.0, 0.05); P.box('steel', ox - 2.96, ox - 2.9, oy - 1.3, oy - 0.5, 0.0, 0.05)
    for k, c in enumerate(('coat_k', 'coat_r', 'coat_w', 'coat_k')): P.box(c, ox - 4.4 + k * 0.38, ox - 4.1 + k * 0.38, oy - 0.86, oy - 0.3 + 0.1 * (k % 2), 0.05, 0.09 + 0.01 * k)
    P.box('coat_m', ox - 0.6, ox + 0.3, oy - 0.8, oy - 0.3, 0.0, 0.06); P.box('coat_k', ox - 0.2, ox + 0.5, oy - 1.0, oy - 0.55, 0.06, 0.1)
    # and the one that stands on the floor, off the plinth, turned to face the others (its arm held out north, at them)
    x, y = ox + 2.0, oy - 0.95
    P.box('skin', x - 0.1, x + 0.1, y - 0.07, y + 0.07, 0.0, 0.95); P.box('coat_k', x - 0.23, x + 0.23, y - 0.12, y + 0.12, 0.38, 0.84); P.box('coat_k', x - 0.2, x + 0.2, y - 0.11, y + 0.11, 0.8, 1.58)
    P.box('coat_k', x - 0.34, x + 0.34, y - 0.13, y + 0.13, 1.42, 1.6); P.box('skin', x - 0.09, x + 0.09, y - 0.09, y + 0.09, 1.63, 1.9); P.box('skin', x - 0.05, x + 0.05, y + 0.12, y + 0.42, 1.25, 1.31)


def fountain(P, ox, oy, rng):
    """the atrium's fountain, dry: a round terrazzo basin, a piece of its rim broken out, two bowls on a stem, its coins"""
    n = 28; ri, ro = FOUNT_R - 0.65, FOUNT_R
    P.drum('tile', ox, oy, 0.0, 0.1, ri + 0.02, 28)                                                           # the basin's floor
    for k in range(n):
        if k in (22, 23): continue                             # a piece of the rim broken out
        a0, a1 = 6.2832 * k / n, 6.2832 * (k + 1) / n
        P.poly('terr' if k % 7 else 'terr_d', [(ox + ri * math.cos(a0), oy + ri * math.sin(a0)), (ox + ro * math.cos(a0), oy + ro * math.sin(a0)), (ox + ro * math.cos(a1), oy + ro * math.sin(a1)), (ox + ri * math.cos(a1), oy + ri * math.sin(a1))], 0.0, 0.62)
    a = 6.2832 * 23 / n
    for _ in range(9): x = ox + (ro + rng.uniform(-0.6, 0.7)) * math.cos(a + rng.uniform(-0.2, 0.2)); y = oy + (ro + rng.uniform(-0.6, 0.7)) * math.sin(a + rng.uniform(-0.2, 0.2)); P.box('terr', x, x + rng.uniform(0.2, 0.5), y, y + rng.uniform(0.2, 0.45), 0.0, rng.uniform(0.12, 0.34))
    P.drum('under', ox + 0.5, oy - 0.9, 0.1, 0.106, 1.7, 20)                                                  # the mark the last water left
    P.drum('terr', ox, oy, 0.1, 1.5, 0.5, 16); P.drum('terr', ox, oy, 1.5, 1.78, 1.05, 20, 1.75); P.drum('under', ox, oy, 1.78, 1.786, 1.45, 20)        # the stem, the lower bowl, its dry dark
    P.drum('terr', ox, oy, 1.786, 2.5, 0.3, 12); P.drum('terr', ox, oy, 2.5, 2.7, 0.5, 16, 0.95); P.drum('brass', ox, oy, 2.7, 3.05, 0.16, 10, 0.05)
    for _ in range(90):                                        # the coins: every one of them still there
        r = (ri - 0.2) * math.sqrt(rng.uniform(0.03, 1.0)); a = rng.uniform(0, 6.2832); x, y = ox + r * math.cos(a), oy + r * math.sin(a)
        if math.hypot(x - ox, y - oy) < 0.7: continue
        P.box('coin' if rng.rand() < 0.8 else 'steel', x, x + 0.09, y, y + 0.09, 0.1, 0.112)
    MT.cart(P, ox - 2.2, oy - 1.4, rng, down=True)                                                            # a cart on its side in it
    for _ in range(7): x = ox + rng.uniform(-2.8, 2.8); y = oy + rng.uniform(-2.8, 2.6); P.box('must', x, x + 0.16, y, y + 0.1, 0.1, 0.108)   # leaves
    P.box('jug', ox + 1.6, ox + 1.85, oy - 2.3, oy - 2.2, 0.1, 0.2); P.box('paper', ox + 2.0, ox + 2.5, oy + 1.2, oy + 1.5, 0.1, 0.108)


def wait_parts(P, rng):
    mannequins(P, *WAIT_AT['mannequins'], rng); fountain(P, *WAIT_AT['fountain'], rng)


def wait_mats(bpy, NF, F, M, which):
    if which != 'wait_pieces': return
    MT.mall_mats(bpy, NF, F, M, 'mall_pieces')                 # the mall's own (terrazzo, brass, the coats, the forms)
    M.update(coat_k=NF.material(bpy, 'in_cloth_coat_k', 'tape_grey', 0, 0.78), coat_w=NF.material(bpy, 'in_cloth_coat_w', 'clay_bone', 3, 0.95),
             tile=NF.material(bpy, 'in_stall_basin_tile', 'clay_teal', 3, 0.9), coin=NF.material(bpy, 'in_brass_coin', 'clay_mustard', 3, 1.08))


TG.PARTS['wait_pieces'] = wait_parts
TG.MAT_HOOKS.append(wait_mats)


def cut_light(im, foot_m, box_m, name, folder, shadow, quality):
    """the cutter's own cut (TG.cut_piece: the same box, foot and shadow rule) saved at a lighter quality: the mall's kit has a
    budget of 900,000 bytes (this lane's gate, A5) and stood at 841,870 before these two; at the cutter's 86 they took it to
    918,404. At 60 they are 59,000 together and no different at the fight's sizes (looked at, side by side, one to one)"""
    x0, x1 = int(TG.px(box_m[0])), int(TG.px(box_m[1])); y0, y1 = int(TG.py(box_m[3])), int(TG.py(box_m[2]))
    a = np.asarray(im.crop((x0, y0, x1, y1)), np.float32) / 255.0
    solid = a[..., :3].max(-1) > 0.05; a[..., 3] = np.where(solid, a[..., 3], a[..., 3] * shadow)
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), 'RGBA'); bb = out.getbbox(); out = out.crop(bb)
    out.save(os.path.join(FG, folder, name + '.webp'), 'WEBP', quality=quality, method=6)
    return dict(w=out.width, h=out.height, foot=[round(TG.px(foot_m[0]) - x0 - bb[0], 1), int(round(TG.py(foot_m[1]) - y0 - bb[1]))])


def cut():
    # the data fort: the block in the folder and the art file, and the long-side row with its cast shadow at three tenths
    DF.cut(block=True)
    # the mall's two, added to its art file and its sizes (nothing else of the mall's cut again)
    im = Image.open(os.path.join(REND, 'wait_pieces.png')).convert('RGBA'); A = WAIT_AT; ship = os.path.join(FG, 'mall')
    x, y = A['mannequins']; m = cut_light(im, (x, y - 1.35), (x - 5.3, x + 5.6, y - 1.4, y + 2.3 + 2.6 * 1.45), 'mall_mannequins', 'mall', 0.6, 60)
    x, y = A['fountain']; f = cut_light(im, (x, y - FOUNT_R), (x - FOUNT_R - 0.2, x + FOUNT_R + 1.0, y - FOUNT_R - 0.1, y + FOUNT_R + 0.2 + 3.1 * 1.45), 'mall_fountain', 'mall', 0.6, 60)
    sz = json.load(open(os.path.join(ship, 'sizes.json'))); art = json.load(open(os.path.join(ship, 'mall_art.json')))
    for key, v, kind, h, name in (('mannequins', m, 'LOW_COVER', 1.9, 'THE MANNEQUINS'), ('fountain', f, 'COVER', 3.05, 'THE FOUNTAIN, DRY')):
        v = dict(v, piece=key, src='mall/mall_%s.webp' % key, facing='S'); sz[key] = v
        art['kit']['mall_' + key] = dict(kind=kind, h=h, name=name, stage='finished', src=v['src'], w=v['w'], h_px=v['h'], foot=v['foot'])
    art['how_it_lays']['the mannequins and the fountain (11/18)'] = ("mall_mannequins is the store tile 'display': a plinth 10 m wide and 2.2 m deep with what still stands on it, the rail and one figure on the floor south of it; foot its south edge middle (the floor things' way). "
        "mall_fountain is a round basin 8.8 m across, 3 m up at its finial, foot its south rim middle: laid at (0.5, 0.92) it sits inside its tile.")
    json.dump(sz, open(os.path.join(ship, 'sizes.json'), 'w'), indent=1); json.dump(art, open(os.path.join(ship, 'mall_art.json'), 'w'), indent=1)
    print('mall: mannequins', (m['w'], m['h'], m['foot']), os.path.getsize(os.path.join(ship, 'mall_mannequins.webp')), 'fountain', (f['w'], f['h'], f['foot']), os.path.getsize(os.path.join(ship, 'mall_fountain.webp')))


def sheet(bf, af, bm, am):
    """records/target/COOK5_THE_THREE_THAT_WAITED_11_18.webp: what the VOTE card shows: the fort's pods and the mall's two tiles on
    his phone before and now (the game's own fight page), then the three pictures at their own pixels"""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items:
            n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    cw = (WID - 30) // 4; ch = int(570 * cw / 390)
    title('THE DATA FORT: THE SERVERS ARE SERVERS', 'on his phone, 390 x 844: as the fight opens, and pinched in on a pod; before (two thin rows and a stand-in between them) and now')
    strip((('BEFORE', up(os.path.join(bf, 'datafort_upright_open_a01.png'))), ('NOW', up(os.path.join(af, 'datafort_upright_open_a01.png'))),
           ('BEFORE, CLOSE', up(os.path.join(bf, 'datafort_upright_pod_end_close.png'))), ('NOW, CLOSE', up(os.path.join(af, 'datafort_upright_pod_end_close.png')))), cw, ch)
    first_row = len(rows) - 1
    title('THE MALL: THE MANNEQUINS AND THE FOUNTAIN', 'pinched in on his phone: a store, and the atrium; before (stand-ins) and now')
    strip((('A STORE, BEFORE', up(os.path.join(bm, 'mall_upright_mannequins_close.png'))), ('A STORE, NOW', up(os.path.join(am, 'mall_upright_mannequins_close.png'))),
           ('THE ATRIUM, BEFORE', up(os.path.join(bm, 'mall_upright_fountain_close.png'))), ('THE ATRIUM, NOW', up(os.path.join(am, 'mall_upright_fountain_close.png')))), cw, ch)
    title('THE THREE PICTURES AT THEIR OWN PIXELS')
    def piece(fn, bg):
        im = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    ims = [piece(os.path.join(FG, 'mall/mall_mannequins.webp'), (120, 112, 100)), piece(os.path.join(FG, 'mall/mall_fountain.webp'), (176, 168, 150)), piece(os.path.join(FG, 'datafort/df_servers_block.webp'), (192, 192, 186))]
    hgt = 330; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]; tot = sum(i.width for i in ims) + 16; k = min(1.0, WID / tot)
    r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
    for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
    rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_THREE_THAT_WAITED_11_18.webp'); out.save(fn, 'WEBP', quality=76, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook5-the-three-that-waited-11-18.webp'); fst.save(f2, 'WEBP', quality=80, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render': print('  rendered', TG.scene_pieces('wait_pieces', '--quick' in a), flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2], a[3], a[4])
    else: print(__doc__)
