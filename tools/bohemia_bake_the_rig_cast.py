#!/usr/bin/env python3
"""BOHEMIA -- RUN [the demo wears the rig] (rule 115g), 10/18: THE GANGS ON THE MAP WEAR THE RIG.

PAOLO 10/18: 'is the demo changing, I liked the robot that got made type shit.' The thirteen gang looks
built as 3D models on the rig (CHARACTER, character-the-thirteen-through-the-rig-10-18) got his YES
('Nice direction very good not final'). The map's roaming parties ARE those thirteen gangs (MAP_ART.fac:
Anarchists, Blues, ... Volunteers, the same thirteen names as the rig's folders), and they were drawn from
the street's twelve generic cast bodies under a coloured flag. So each party now wears its own gang's rig
model: its eight turns standing and its six-key walk in eight, straight from CHARACTER's renders.

ONE FILE, NOT 728. The renders are 13 gangs x 8 turns x 7 frames of PNG; a phone fetching 728 files is the
first-load row's enemy. This packs them into ONE sheet, every frame cropped to the one box all of them fit,
at the render's own pixels (nothing resampled: one native pixel size, rule 114a), with a small index:
    slices/BOHEMIA_RIG_CAST.png   the sheet: a row per gang and turn, columns = still, walk k00..k05
    slices/BOHEMIA_RIG_CAST.json  {w, h, foot, gangs, dirs, cols, src}
The map fetches it after the door, only when a party is first drawn; until it lands a party keeps the cast.

AND THE PEOPLE (RUN [the 3D models in the demo], rule 121(b) and (e), 10/19: 'we have to do a full
implementation of the 3D models, that's top priority'; 'EVERYTHING IS A 3D MODEL NOW... WTF TRYING TO COMBINE
THE TWO'). Every other person on the map was the street's old flat cast: him, his two men, the crowds at the
places and the crews on a job. A second sheet, the same way, of the 3D people he voted up that are not a gang:
    body          HIM: CHARACTER's 3D twin of the game's own flat body (character-the-walk-of-every-look-10-18, BODY)
    coil_crown, temple_taper, layered_fall   the barber's 3D man with three of his cuts (character-the-barber-on-the-skull-10-18):
                  his two men, and the plain people in a crowd
    thug, marksman, poacher   COOK THREE's tiers on the rig (cook3-the-thug-through-the-rig-10-18, cook3-the-marksman-through-
                  the-rig-10-18, cook3-the-poachers-body-again-10-18): the crew on a job, a party with no gang
All render at the same 57 px a metre (each rig.json's res over ortho_scale), so they stand at one size beside the gangs.
    slices/BOHEMIA_RIG_PEOPLE.png / .json   (the same index, 'gangs' naming the looks)
    python3 tools/bohemia_bake_the_rig_cast.py            # both sheets (the gangs' is byte-identical run to run)
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/character/rig')
OUT_PNG = os.path.join(ROOT, 'slices/BOHEMIA_RIG_CAST.png')
OUT_JSON = os.path.join(ROOT, 'slices/BOHEMIA_RIG_CAST.json')
GANGS = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless',
         'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers']
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
WALK = 6
T = 'records/target/'
PEOPLE = {'body': T + 'character/rig/body', 'coil_crown': T + 'character/barber/coil_crown',
          'temple_taper': T + 'character/barber/temple_taper', 'layered_fall': T + 'character/barber/layered_fall',
          'thug': T + 'cook3/rig/thug', 'marksman': T + 'cook3/rig/marksman', 'poacher': T + 'cook3/rig/poacher_again'}
SETS = {
    'gangs': dict(looks=GANGS, src=lambda g: os.path.join(SRC, g), png=OUT_PNG, json=OUT_JSON,
                  what='RUN [the demo wears the rig] 10/18: the thirteen gangs rendered on the rig, one row per gang and turn',
                  frm='records/target/character/rig (CHARACTER, character-the-thirteen-through-the-rig-10-18, his YES)'),
    'people': dict(looks=list(PEOPLE), src=lambda g: os.path.join(ROOT, PEOPLE[g]),
                   png=os.path.join(ROOT, 'slices/BOHEMIA_RIG_PEOPLE.png'), json=os.path.join(ROOT, 'slices/BOHEMIA_RIG_PEOPLE.json'),
                   what='RUN [the 3D models in the demo] 10/19: everybody on the map who is not a gang, rendered on the rig, one row per look and turn',
                   frm=dict((g, PEOPLE[g]) for g in PEOPLE)),
}
SET = SETS['gangs']


def frames(g, d):
    base = SET['src'](g)
    out = [os.path.join(base, 'rig_%s.png' % d)]
    out += [os.path.join(base, 'rig_Anim_0_%s_k%02d.png' % (d, k)) for k in range(WALK)]
    return out


def main():
    global SET, GANGS
    for name in SETS:
        SET = SETS[name]; GANGS = SET['looks']
        bake()


def bake():
    ims, box = {}, None
    for g in GANGS:
        for d in DIRS:
            for i, p in enumerate(frames(g, d)):
                if not os.path.exists(p):
                    if i == 0:
                        sys.exit('MISSING ' + os.path.relpath(p, ROOT))
                    continue   # a gang CHARACTER has not walked yet stands (its walk cells stay empty); 10/19 all thirteen walk
                im = Image.open(p).convert('RGBA')
                ims[p] = im
                b = im.getbbox()
                if b:
                    box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    # The renders are not one size: the four walked gangs come at 86 x 131, the nine standing ones cropped
    # tight per gang (31 to 38 wide). Within a gang every frame is one size and one camera. So every frame
    # goes into one cell with its own picture's middle on the cell's middle and its gang's ground line on the
    # cell's ground line (the lowest painted row of that gang's eight standing turns: the feet).
    gfoot, above, below, half = {}, 0, 0, 0
    for g in GANGS:
        st = [ims[frames(g, d)[0]] for d in DIRS]
        gfoot[g] = max(im.getbbox()[3] for im in st)
        for p, im in ims.items():
            if os.path.dirname(p) != SET['src'](g):
                continue
            bb = im.getbbox()
            if not bb:
                continue
            above = max(above, gfoot[g] - bb[1]); below = max(below, bb[3] - gfoot[g])
            half = max(half, im.size[0] / 2 - bb[0], bb[2] - im.size[0] / 2)
    w, h = int(2 * half + 2) // 2 * 2, above + below + 1
    foot = above
    cols = 1 + WALK
    sheet = Image.new('RGBA', (w * cols, h * len(GANGS) * len(DIRS)), (0, 0, 0, 0))
    for gi, g in enumerate(GANGS):
        for di, d in enumerate(DIRS):
            row = gi * len(DIRS) + di
            for c, p in enumerate(frames(g, d)):
                if p not in ims:
                    continue
                im = ims[p]
                sheet.alpha_composite(im, (c * w + w // 2 - im.size[0] // 2, row * h + foot - gfoot[g]))
    # 123,000 colours raw (1.7 MB); held to 256 with no dither it is about 370 KB and looks the same at 2x
    # (checked side by side), and a phone fetches a fifth of it
    sheet.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(SET['png'], optimize=True)
    meta = {'what': SET['what'], 'src': SET['frm'],
            'walks': [g for g in GANGS if all(os.path.exists(p) for d in DIRS for p in frames(g, d))],
            'w': w, 'h': h, 'foot': foot, 'cols': cols, 'gangs': GANGS, 'dirs': DIRS}
    with open(SET['json'], 'w') as f:
        json.dump(meta, f, indent=1)
        f.write('\n')
    print('%s: %d frames, cell %dx%d, feet at %d, sheet %dx%d, %d KB' % (
        os.path.basename(SET['png']), len(ims), w, h, foot, sheet.size[0], sheet.size[1], os.path.getsize(SET['png']) // 1024))


if __name__ == '__main__':
    main()
