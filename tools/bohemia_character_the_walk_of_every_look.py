#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the walk of every look]: ALL FOURTEEN WALK IN EIGHT (rule 115c, 115g: the demo wears the rig, the
party's people first; RUN's cut needs a walk for whichever look passes first). Last round only four of the fourteen models
(Reds, Anarchists, Trades, Cartel) had their walk rendered; now every look walks in all eight facings at six drawn keys
(two beats at 120 BPM, three keys a beat), the skirts, the capes and the prints moving with the body, because every
garment is skinned to the man's own bones (tools/bohemia_character_the_thirteen_through_the_rig.py) and the rig renders
the model's own walk clip (Anim_0) at the drawn keys only (DIRECTION's master rig, unedited).

This tool only LAYS OUT what the rig rendered. Out:
  * slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK.png  -- the atlas the VOTE page plays: one row per look per facing (14 x 8), folded into three columns,
    plus one row per look of the game's own flat walk (SE), six keys a row, every frame pasted whole from the model's one
    crop box (so the ground never jitters), bottom-centre in one cell.
  * slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK_TABLE.js -- the cell, the rows, the beat.
  * records/target/character/CHARACTER_THE_WALK_OF_EVERY_LOOK.png -- the still sheet: per look, the flat walk's six keys
    beside the model's six keys at 1:1 (SE), then every look's eight facings at the passing key; the caption names the
    pixel size, the palette and the light (rule 114c).
Run (plain python3, after the rig renders and tools/bohemia_character_the_walk_of_every_look_flat.js):
    python3 tools/bohemia_character_the_walk_of_every_look.py

REUSE CHECK: the frames are the rig's (records/target/character/rig/<look>/rig_Anim_0_<F>_kNN.png); the flat walk is the
game's buildFrame; the play page is ANIMATION's beast-in-eight page pattern (slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.html).
REFERENCE CHECK: the twin is the game's own flat sprite walking today, key for key; analog horror AH-01. No reference game.
"""
import os, json
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RIG = os.path.join(ROOT, 'records/target/character/rig')
FLAT = os.path.join(ROOT, 'records/target/character/walk_flat')
ORDER = ['Body', 'Caravans', 'Colorful', 'Anarchists', 'Blues', 'Homeless', 'Church', 'Reds', 'Cartel', 'Trades', 'Mob',
         'Network', 'Volunteers', 'Remnants']   # the body, then FACTION_LOOKS in the alpha's order
FAC = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
KEYS = 6
BG = (22, 21, 20); GROUND = (118, 106, 88); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)


def frames(look):
    d = os.path.join(RIG, look.lower())
    return {f: [Image.open(os.path.join(d, 'rig_Anim_0_%s_k%02d.png' % (f, k))).convert('RGBA') for k in range(KEYS)] for f in FAC}


def flat(look):
    return [Image.open(os.path.join(FLAT, '%s_SE_k%02d.png' % (look.lower(), k))).convert('RGBA') for k in range(KEYS)]


def trim_flat(ims):
    """the flat frames sit in the 112 box; cut them all with ONE box (the union), so the flat walk never jitters either"""
    bb = [im.getbbox() for im in ims]
    box = (min(b[0] for b in bb), min(b[1] for b in bb), max(b[2] for b in bb), max(b[3] for b in bb))
    return [im.crop(box) for im in ims]


def main():
    F = {n: frames(n) for n in ORDER}
    T = {n: trim_flat(flat(n)) for n in ORDER}
    every = [im for n in ORDER for v in F[n].values() for im in v] + [im for v in T.values() for im in v]
    cw = max(im.width for im in every) + 4; ch = max(im.height for im in every) + 4

    # THE ATLAS (transparent; the page draws the ground)
    rows = {}; r = 0
    for n in ORDER:
        for f in FAC: rows['%s:%s' % (n, f)] = r; r += 1
        rows['%s:flat' % n] = r; r += 1
    # folded into GROUPS columns of rows: a 17,000 px tall image is past what some phone browsers will decode
    GROUPS = 3; per = -(-r // GROUPS)
    at = {key: [(i // per) * cw * KEYS, (i % per) * ch] for key, i in rows.items()}
    A = Image.new('RGBA', (cw * KEYS * GROUPS, ch * per), (0, 0, 0, 0))
    def put(img, im, x, y): img.paste(im, (x + (cw - im.width) // 2, y + ch - im.height - 2), im)
    for n in ORDER:
        for f in FAC:
            x0, y0 = at['%s:%s' % (n, f)]
            for k, im in enumerate(F[n][f]): put(A, im, x0 + k * cw, y0)
        x0, y0 = at['%s:flat' % n]
        for k, im in enumerate(T[n]): put(A, im, x0 + k * cw, y0)
    os.makedirs(os.path.join(ROOT, 'slices/vote'), exist_ok=True)
    A.save(os.path.join(ROOT, 'slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK.png'), optimize=True)
    tab = dict(cell=[cw, ch], keys=KEYS, beats=2, bpm=120, looks=ORDER, facings=FAC, at=at,
               ppm=57, light='the rig\'s sun, upper left', palette='the runway paint as the street wears it (records/cook3/thirteen_repainted.png, AFTER)')
    with open(os.path.join(ROOT, 'slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK_TABLE.js'), 'w') as fh:
        fh.write('/* CHARACTER [the walk of every look]: written by tools/bohemia_character_the_walk_of_every_look.py */\n')
        fh.write('window.WALK_TABLE = ' + json.dumps(tab) + ';\n')

    # THE STILL SHEET
    lw = 92
    Wd = max(12 + lw + 2 * KEYS * (cw + 4) + 24, 12 + lw + 8 * (cw + 4))
    H = 70 + 16 + len(ORDER) * (ch + 6) + 30 + len(ORDER) * (ch + 6) + 30
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    def cell(im, x, y):
        S.paste(GROUND, (x, y, x + cw, y + ch)); S.paste(im, (x + (cw - im.width) // 2, y + ch - im.height - 2), im)
    d.text((12, 8), 'CHARACTER: ALL FOURTEEN WALK IN EIGHT, THE MODELS BESIDE THE GAME\'S FLAT WALK, 1:1. CANDIDATES: nothing is final before the moodboard.', fill=INK)
    d.text((12, 24), '57 px a metre (1.72 m = 98 px), one pixel size | palette: the runway paint as the street wears it (records/cook3/thirteen_repainted.png, AFTER) | ONE light: the rig\'s sun, upper left', fill=DIM)
    d.text((12, 38), '6 drawn keys = 2 beats at 120 (three a beat); nothing between two keys is drawn. The cloth is skinned to the bones, so skirts, capes and prints walk with the body.', fill=DIM)
    y = 58; d.text((12 + lw, y), 'THE GAME TODAY: the flat sprite walking SE (buildFrame), 6 keys', fill=HEAD)
    d.text((12 + lw + KEYS * (cw + 4) + 24, y), 'OURS: the model walking SE, the same 6 phases', fill=HEAD); y += 16
    for n in ORDER:
        d.text((12, y + ch // 2), n.upper(), fill=INK); x = 12 + lw
        for im in T[n]: cell(im, x, y); x += cw + 4
        x += 24
        for im in F[n]['SE']: cell(im, x, y); x += cw + 4
        y += ch + 6
    y += 12; d.text((12 + lw, y), 'EIGHT FACINGS, the passing key (k01) of each look: S SE E NE N NW W SW', fill=HEAD); y += 16
    for n in ORDER:
        d.text((12, y + ch // 2), n.upper(), fill=INK); x = 12 + lw
        for f in FAC: cell(F[n][f][1], x, y); x += cw + 4
        y += ch + 6
    out = os.path.join(ROOT, 'records/target/character/CHARACTER_THE_WALK_OF_EVERY_LOOK.png')
    S.save(out); print('sheet', out, S.size, 'atlas', A.size, 'cell', cw, ch)


if __name__ == '__main__':
    main()
