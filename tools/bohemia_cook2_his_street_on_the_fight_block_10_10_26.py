#!/usr/bin/env python3
"""COOK TWO [the street kit from the packs], round three: HIS STREET ON THE FIGHT'S OWN BLOCK, so the before
and the after are the SAME place (rule 89, Paolo 10/10: 'Can't tell difference. Looks like dogshit' -> a look
item is a before and after of the same thing, side by side, one art pixel to one phone pixel).

Source bank: banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (through the kit tool).
It reads the main-street blocks COMBAT TWO cut (slices/fight_ground/block_main_{0,1}.webp, never edited), finds
the street on its own pixels (the road column by column from the centre row out, the sidewalk the 44 px
above it), and lays the kit's stamps (his street pools: asphalt, sidewalk, kerb colours, the faded dash) into
exactly those pixels. Buildings, shadows and yards are untouched pixel for pixel; they are COOK FOUR's.
Writes slices/fight_ground/kit_street/onboard/block_main_N.webp + onboard.json (the pack manifest, rule 82a)
and slices/vote/COOK2_THE_STREET_BEFORE_AFTER.png at 1:1 (two 585 px crops side by side = 1170 px, his
phone's upright width at 3x).
COMBAT TWO swaps blocks['main.N'].src to the onboard file when it re-lays; that file is theirs.
  python3 tools/bohemia_cook2_his_street_on_the_fight_block_10_10_26.py
"""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('kit', os.path.join(R, 'tools/bohemia_cook2_the_street_kit_from_the_packs_10_10_26.py'))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); K = vars(mod)
G = os.path.join(R, 'slices/fight_ground'); OUT = os.path.join(G, 'kit_street/onboard')
CY = 830          # a row inside the street on both main blocks (measured: road 776-895)
WALK_PX = 44

def roadish(a):
    w = a[..., 0] - a[..., 2]; l = a.sum(2)
    return (w <= 14) & (l > 20) & (l < 300)

def recut(name):
    im = Image.open(os.path.join(G, name + '.webp')).convert('RGB')
    a = np.asarray(im).astype(int); H, W = a.shape[:2]
    rd = roadish(a)
    asph, k1 = K['stamp_field']('street', 7001, W, H)
    walk, k2 = K['stamp_field']('side', 7002, W, H)
    A, Wk = np.asarray(asph), np.asarray(walk)
    out = a.copy().astype(np.uint8); n = 0
    tops, bots = np.full(W, -1), np.full(W, -1)
    for x in range(W):
        if rd[CY - 20:CY + 20, x].mean() < 0.6: continue
        t = CY
        while t > 0 and rd[max(0, t - 6):t, x].mean() > 0.3: t -= 1
        b = CY
        while b < H - 1 and rd[b:b + 6, x].mean() > 0.3: b += 1
        tops[x], bots[x] = t, b
    ok = tops >= 0
    # one street, one line: the top and bottom are the street's, not a crack's -- the mode across the run
    T = int(np.bincount(tops[ok]).argmax()); B = int(np.bincount(bots[ok]).argmax())
    # one street, one straight kerb: every street column takes the street's own T and B (a column whose
    # run strays is a crack or a car, not a second street); the walk is laid as one band over the old walk
    xs = np.nonzero(ok)[0]
    oldwalk = (a[T - WALK_PX:T - 4, :, 0] - a[T - WALK_PX:T - 4, :, 2]).mean(0) > 20
    c = (T + B) // 2; dash = int(3 * K['PXM_X'])
    for x in xs:
        out[T:B, x] = A[T:B, x]; n += B - T
        if oldwalk[x]: out[T - WALK_PX:T - 4, x] = Wk[T - WALK_PX:T - 4, x]
        out[T - 4:T - 1, x] = K['KERB']; out[T - 1:T + 3, x] = K['SHADE']
        if (x // dash) % 2 == 0:                                            # 3 m painted, 3 m worn
            out[c - 3:c + 3, x] = (out[c - 3:c + 3, x] * 0.3 + np.array(K['PAINT']) * 0.7).astype(np.uint8)
    # round four: the street is not only the band. Where it widens (the apron beside the flat roof, the cross
    # street's mouth) the old road runs on: every 8 px cell that is mostly old road and CONNECTED to the band
    # takes the asphalt too (a flood from the band's centre row; no scipy in the box)
    C = 8; gh, gw = H // C, W // C
    L = a.sum(2); flat = np.zeros_like(rd)
    flat[1:-1, 1:-1] = (L[1:-1, 1:-1] == L[:-2, 1:-1]) & (L[1:-1, 1:-1] == L[2:, 1:-1]) & (L[1:-1, 1:-1] == L[1:-1, :-2]) & (L[1:-1, 1:-1] == L[1:-1, 2:]) & (np.abs(a[1:-1, 1:-1] - np.array([56, 54, 50])).sum(2) < 4)
    lum = a.sum(2)[:gh * C, :gw * C].reshape(gh, gw, C, C).transpose(0, 1, 2, 3).reshape(gh, gw, -1)
    # a shadow is the old road's grey but FLAT (std 0 measured); the road is grainy (std 22-55)
    cell = (rd[:gh * C, :gw * C].reshape(gh, gw, C, C).mean((2, 3)) > 0.5) & (lum.std(2) > 8)
    seen = np.zeros_like(cell); st = [(c // C, x // C) for x in xs[::C]]
    while st:
        y, x = st.pop()
        if not (0 <= y < gh and 0 <= x < gw) or seen[y, x] or not cell[y, x]: continue
        seen[y, x] = True; st += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    conn = np.zeros_like(rd); conn[:gh * C, :gw * C] = np.kron(seen, np.ones((C, C), bool)).astype(bool)
    conn &= rd & ~flat; conn[T - WALK_PX:B] = False                                 # the band is already laid
    out[conn] = A[conn]; n += int(conn.sum())
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(out).save(os.path.join(OUT, name + '.webp'), lossless=True)
    keys = sorted({tuple(k) for k in k1 + k2})
    return im, Image.fromarray(out), keys, dict(road_rows=[T, B], columns=int(ok.sum()), px=int(n))

def main():
    man = {'lane': 'cook 2', 'rule': '87 / 82a / 89', 'note': 'the street pixels of COMBAT TWO\'s main blocks re-laid from his pools; buildings untouched (COOK FOUR)', 'pieces': {}}
    sheet = None
    for name in ('block_main_0', 'block_main_1'):
        before, after, keys, info = recut(name)
        man['pieces'][name] = dict(src=name + '.webp', keys=[list(k) for k in keys],
                                   exception='buildings, yards and shadows are the old cut, unchanged: COOK FOUR re-cuts them', **info)
        print(name, info)
        if name == 'block_main_1':
            box = (1300, 560, 1885, 1100)                                  # 585 x 540: one art px = one phone px
            sheet = Image.new('RGB', (1170 + 10, 540 + 40), (14, 14, 14))
            sheet.paste(before.crop(box), (0, 40)); sheet.paste(after.crop(box), (595, 40))
            d = ImageDraw.Draw(sheet)
            d.text((8, 12), 'BEFORE  the fight street now', fill=(235, 235, 235))
            d.text((603, 12), 'AFTER  the same street, his tiles', fill=(235, 235, 235))
        # THE FUTURES (round four): raided and reclaimed are the same street with things laid on it. Every pixel
        # a future changed from the present stays the future's (its rubble, its soot, its new paint); every
        # pixel it left alone takes the re-laid present. So the futures wear his street under their own story.
        b0 = np.asarray(before).astype(int); a1 = np.asarray(after)
        for fut in ('raided', 'reclaimed'):
            fn = name + '_' + fut
            f = np.asarray(Image.open(os.path.join(G, fn + '.webp')).convert('RGB'))
            same = (np.abs(f.astype(int) - b0).sum(2) <= 6)
            o = np.where(same[..., None], a1, f).astype(np.uint8)
            Image.fromarray(o).save(os.path.join(OUT, fn + '.webp'), lossless=True)
            man['pieces'][fn] = dict(src=fn + '.webp', keys=[list(k) for k in keys],
                                     exception='the future\'s own changes and the buildings are the old cut, unchanged',
                                     future_px_kept=int((~same).sum()))
            print(fn, 'future pixels kept', int((~same).sum()))
    json.dump(man, open(os.path.join(OUT, 'onboard.json'), 'w'), indent=1)
    os.makedirs(os.path.join(R, 'slices/vote'), exist_ok=True)
    sheet.save(os.path.join(R, 'slices/vote/COOK2_THE_STREET_BEFORE_AFTER.png'))
main()
